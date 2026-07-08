/*
  In-memory sliding-window rate limit, keyed by hashed client IP.
  Per-instance on serverless, which is adequate for a marketing-site
  enquiry form; swap for @upstash/ratelimit if global limits are ever
  needed.
*/
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;

const hits = new Map<string, number[]>();

export async function hashKey(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest).slice(0, 8))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function isRateLimited(key: string): boolean {
  const now = Date.now();
  const windowStart = now - WINDOW_MS;
  const entries = (hits.get(key) ?? []).filter((t) => t > windowStart);
  if (entries.length >= MAX_REQUESTS) {
    hits.set(key, entries);
    return true;
  }
  entries.push(now);
  hits.set(key, entries);
  // opportunistic cleanup so the map cannot grow unbounded
  if (hits.size > 1000) {
    for (const [k, v] of hits) {
      if (v.every((t) => t <= windowStart)) hits.delete(k);
    }
  }
  return false;
}
