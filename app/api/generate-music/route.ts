import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { prompt, duration } = await request.json()

    if (!process.env.ELEVENLABS_API_KEY) {
      return NextResponse.json({ error: "ElevenLabs API key not configured" }, { status: 500 })
    }

    const response = await fetch("https://api.elevenlabs.io/v1/music/compose", {
      method: "POST",
      headers: {
        "xi-api-key": process.env.ELEVENLABS_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        music_length_ms: duration,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("ElevenLabs API error:", errorText)

      try {
        const errorData = JSON.parse(errorText)
        if (errorData.detail?.status === "limited_access") {
          return NextResponse.json(
            {
              error: "paid_plan_required",
              message: "Music API requires a paid ElevenLabs plan. Please upgrade your account to generate music.",
            },
            { status: 402 },
          )
        }
      } catch (parseError) {
        // If we can't parse the error, fall back to generic message
      }

      return NextResponse.json({ error: "Failed to generate music" }, { status: response.status })
    }

    const audioBuffer = await response.arrayBuffer()

    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Disposition": 'attachment; filename="wealth-music.mp3"',
      },
    })
  } catch (error) {
    console.error("Error generating music:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
