type BucketKey = string;

const buckets = new Map<BucketKey, number[]>();

export function rateLimit(options: {
  key: string;
  limit: number;
  windowMs: number;
}): { ok: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const windowStart = now - options.windowMs;
  const list = buckets.get(options.key) || [];
  const pruned = list.filter((t) => t > windowStart);
  pruned.push(now);
  buckets.set(options.key, pruned);

  const count = pruned.length;
  const ok = count <= options.limit;
  const remaining = Math.max(0, options.limit - count);
  const resetAt = pruned[0] + options.windowMs;
  return { ok, remaining, resetAt };
}

export function buildRateKey(parts: Array<string | undefined>): string {
  return parts.filter(Boolean).join(":");
}

