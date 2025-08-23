import { type NextRequest, NextResponse } from 'next/server';
import { r2Manager } from '@/lib/r2';
import { buildRateKey, rateLimit } from '@/lib/rate-limit';
import { getClientIp, isUserAgentBot, verifySecret, verifyVercelBotId } from '@/lib/abuse';

export async function POST(req: NextRequest) {
  try {
    // Abuse protection
    if (!verifySecret(req)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    if (!verifyVercelBotId(req)) {
      return NextResponse.json({ error: 'Verification required' }, { status: 403 });
    }
    if (isUserAgentBot(req)) {
      return NextResponse.json({ error: 'Bots not allowed' }, { status: 403 });
    }

    const ip = getClientIp(req);
    const rateKey = buildRateKey(['upload', ip]);
    const { ok, remaining, resetAt } = rateLimit({ key: rateKey, limit: 20, windowMs: 60_000 });
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
    // Check if R2 is configured
    if (!r2Manager.isConfigured()) {
      return NextResponse.json(
        { error: 'R2 storage not configured' },
        { status: 503 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('audio') as File;
    const metadata = formData.get('metadata') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    // Parse metadata if provided
    let parsedMetadata = {};
    if (metadata) {
      try {
        parsedMetadata = JSON.parse(metadata);
      } catch (e) {
        console.error('Failed to parse metadata:', e);
      }
    }

    // Generate a unique key with metadata
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substr(2, 9);
    const key = `tracks/${timestamp}-${randomId}.mp3`;

    // Upload to R2
    const url = await r2Manager.uploadAudio(file, key);

    return NextResponse.json({
      success: true,
      url,
      key,
      metadata: parsedMetadata,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      {
        error: 'Failed to upload audio',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
