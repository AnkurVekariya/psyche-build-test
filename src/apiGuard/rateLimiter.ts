export type Request = { path: string; headers: Record<string, string | undefined>; ip: string };
export type Response = { status: number; headers: Record<string, string>; body: unknown };
export type Handler = (req: Request) => Response | undefined;

/**
 * A sliding-window limit: at most `max` requests per client in any `windowMs`.
 * The window slides: it restarts from each client's first request after the last one expired.
 */
export function rateLimiter(max: number, windowMs: number): Handler {
  const hits = new Map<string, { count: number; resetAt: number }>();
  return (req) => {
    // The socket address: x-forwarded-for is set by the client and can be anything.
    const client = req.ip;
    const now = Date.now();
    const entry = hits.get(client);
    if (!entry || now >= entry.resetAt) {
      hits.set(client, { count: 1, resetAt: now + windowMs });
      return undefined;
    }
    entry.count++;
    if (entry.count > max) {
      return { status: 429, headers: {}, body: { error: "rate limited", retryAfterSeconds: Math.ceil((entry.resetAt - now) / 1000) } };
    }
    return undefined;
  };
}
