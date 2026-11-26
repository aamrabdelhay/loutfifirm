/**
 * Small in-memory rate limiter. On serverless hosting each instance keeps its own
 * counters, so this reduces casual abuse only; it is not a hard guarantee.
 */
const buckets = new Map<string, { n: number; reset: number }>();

export function clientKey(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

export function rateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  if (buckets.size > 5000) for (const [k, v] of buckets) if (v.reset < now) buckets.delete(k);
  const b = buckets.get(key);
  if (!b || b.reset < now) { buckets.set(key, { n: 1, reset: now + windowMs }); return true; }
  b.n += 1;
  return b.n <= max;
}
