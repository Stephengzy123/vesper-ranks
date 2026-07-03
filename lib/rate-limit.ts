import { headers } from "next/headers";

const buckets = new Map<string, { count: number; resetAt: number }>();

export async function rateLimit(label: string, limit = 20, windowMs = 60_000) {
  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "local";
  const key = `${label}:${ip}`;
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }

  bucket.count += 1;
  if (bucket.count > limit) {
    throw new Error("Too many requests. Please slow down and try again soon.");
  }
}
