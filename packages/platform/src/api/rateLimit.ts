export interface Request {
  headers: Record<string, string | undefined>;
  socketAddress: string;
}

const WINDOW_MS = 60_000;
const hits = new Map<string, { count: number; windowStart: number }>();

/** The caller's address, for rate limiting. */
export function clientAddress(req: Request): string {
  const forwarded = req.headers["x-forwarded-for"];
  return forwarded ? forwarded.split(",")[0].trim() : req.socketAddress;
}

/** Whether this request is over `limit` requests per minute for its caller. */
export function overLimit(req: Request, limit: number, now = Date.now()): boolean {
  const key = clientAddress(req);
  const entry = hits.get(key);
  if (!entry || now - entry.windowStart >= WINDOW_MS) {
    hits.set(key, { count: 1, windowStart: now });
    return false;
  }
  entry.count += 1;
  return entry.count > limit + 1;
}
