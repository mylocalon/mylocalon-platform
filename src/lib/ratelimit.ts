/**
 * In-process fixed-window limiter. The MVP runs one Platform instance; move
 * the counters to Redis when running more than one.
 */
const windows = new Map<string, { n: number; resetAt: number }>();

export function allow(key: string, limit: number, windowMs = 60_000, now = Date.now()): boolean {
  const w = windows.get(key);
  if (!w || now >= w.resetAt) {
    windows.set(key, { n: 1, resetAt: now + windowMs });
    if (windows.size > 50_000) sweep(now);
    return true;
  }
  w.n++;
  return w.n <= limit;
}

function sweep(now: number): void {
  for (const [k, w] of windows) if (now >= w.resetAt) windows.delete(k);
}

export function resetRateLimitsForTests(): void {
  windows.clear();
}
