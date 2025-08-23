import { NextResponse } from 'next/server';
import { r2Manager } from '@/lib/r2';

export async function GET() {
  try {
    // Basic config check
    if (!r2Manager.isConfigured()) {
      const missing: string[] = [];
      const envs: Record<string, string | undefined> = {
        R2_ACCOUNT_ID: process.env.R2_ACCOUNT_ID,
        R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
        R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY,
        R2_BUCKET_NAME: process.env.R2_BUCKET_NAME,
        R2_PUBLIC_URL: process.env.R2_PUBLIC_URL,
      };
      for (const [k, v] of Object.entries(envs)) {
        if (!v || v.trim() === '' || v.includes('your_') || v.includes('your-') || v.includes('your-')) {
          missing.push(k);
        }
      }
      return NextResponse.json(
        {
          ok: false,
          message: 'R2 not fully configured',
          missing,
        },
        { status: 503 }
      );
    }

    // Attempt minimal put/delete to verify write perms
    const result = await r2Manager.verifyAccess();
    const status = result.ok ? 200 : 503;
    return NextResponse.json(result, { status });
  } catch (error) {
    console.error('R2 status error:', error);
    return NextResponse.json(
      {
        ok: false,
        message: 'Failed to verify R2 status',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

