const REQUESTS = new Map<string, { count: number; ts: number }>();

export function rateLimit(
  identifier: string,
  limit: number = 10,
  windowMs: number = 60_000,
): { success: boolean; remaining: number } {
  const now = Date.now();
  const record = REQUESTS.get(identifier);

  if (!record || now - record.ts > windowMs) {
    REQUESTS.set(identifier, { count: 1, ts: now });
    return { success: true, remaining: limit - 1 };
  }

  if (record.count >= limit) {
    return { success: false, remaining: 0 };
  }

  record.count += 1;
  return { success: true, remaining: limit - record.count };
}
