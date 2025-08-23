import type { NextRequest } from 'next/server';

export function getClientIp(req: NextRequest): string {
  const xfwd = req.headers.get('x-forwarded-for');
  if (xfwd) return xfwd.split(',')[0].trim();
  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp;
  return '0.0.0.0';
}

export function isUserAgentBot(req: NextRequest): boolean {
  const ua = (req.headers.get('user-agent') || '').toLowerCase();
  if (!ua) return false;
  return /(bot|spider|crawl|crawler|preview|monitor|fetch)/i.test(ua);
}

export function verifySecret(req: NextRequest): boolean {
  const secret = process.env.GENERATION_SECRET;
  if (!secret) return true;
  const header = req.headers.get('x-generation-secret');
  return header === secret;
}

export function verifyVercelBotId(req: NextRequest): boolean {
  const requireBotId = process.env.REQUIRE_BOT_ID === 'true';
  if (!requireBotId) return true;
  // Vercel Bot ID header name per docs; adjust as needed.
  const token = req.headers.get('x-vercel-bot');
  if (!token) return false;
  // Trust presence as signal; for stricter validation, integrate server-side verification per docs.
  return Boolean(token && token.length > 10);
}

