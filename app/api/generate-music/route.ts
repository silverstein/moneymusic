import { type NextRequest, NextResponse } from 'next/server';
import { r2Manager } from '@/lib/r2';
import { buildRateKey, rateLimit } from '@/lib/rate-limit';
import { getClientIp, isUserAgentBot, verifySecret, verifyVercelBotId } from '@/lib/abuse';

export async function POST(req: NextRequest) {
  try {
    // Abuse protection: secret, Bot ID, UA bot heuristic
    if (!verifySecret(req)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    if (!verifyVercelBotId(req)) {
      return NextResponse.json({ error: 'Verification required' }, { status: 403 });
    }
    if (isUserAgentBot(req)) {
      return NextResponse.json({ error: 'Bots not allowed' }, { status: 403 });
    }

    // Rate limit per IP and route
    const ip = getClientIp(req);
    const key = buildRateKey(['gen', ip]);
    const { ok, remaining, resetAt } = rateLimit({ key, limit: 8, windowMs: 60_000 });
    if (!ok) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        {
          status: 429,
          headers: {
            'RateLimit-Remaining': String(remaining),
            'RateLimit-Reset': String(resetAt),
          },
        }
      );
    }
    const { prompt, duration = 30_000 } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    if (duration < 10_000 || duration > 300_000) {
      return NextResponse.json(
        { error: 'Duration must be between 10 and 300 seconds' },
        { status: 400 }
      );
    }

    if (!process.env.ELEVENLABS_API_KEY) {
      return NextResponse.json(
        { error: 'ElevenLabs API key not configured' },
        { status: 500 }
      );
    }

    // Call the actual ElevenLabs Music API
    const response = await fetch('https://api.elevenlabs.io/v1/music', {
      method: 'POST',
      headers: {
        'xi-api-key': process.env.ELEVENLABS_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        music_length_ms: duration,
        model_id: 'music_v1',
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('ElevenLabs API error:', response.status, errorData);
      return NextResponse.json(
        { error: `Music generation failed: ${response.statusText}` },
        { status: response.status }
      );
    }

    // Get the audio data from the response
    const audioBuffer = await response.arrayBuffer();

    // Check if R2 is configured and upload if available
    let r2Url: string | undefined;
    if (r2Manager.isConfigured()) {
      try {
        const buffer = Buffer.from(audioBuffer);
        r2Url = await r2Manager.uploadAudio(buffer);
        console.log('Audio uploaded to R2:', r2Url);
      } catch (uploadError) {
        console.error('Failed to upload to R2:', uploadError);
        // Continue without R2 upload - fallback to direct response
      }
    }

    // Return the audio file with optional R2 URL in header
    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': response.headers.get('content-type') || 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength.toString(),
        ...(r2Url && { 'X-R2-URL': r2Url }),
      },
    });
  } catch (error) {
    console.error('Music generation error:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate music',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
