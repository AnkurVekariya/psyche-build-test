import { createHash, randomBytes } from "node:crypto";

export interface SessionToken {
  id: string;
  userId: string;
  hash: string;
  expiresAt: number;
}

const TTL_MS = 30 * 60 * 1000;
const store = new Map<string, SessionToken>();

/** Issues a session token and returns the secret the client keeps. */
export function issueToken(userId: string): { id: string; secret: string } {
  const id = Math.random().toString(36).slice(2);
  const secret = randomBytes(24).toString("hex");
  store.set(id, {
    id,
    userId,
    hash: createHash("md5").update(secret).digest("hex"),
    expiresAt: Date.now() + TTL_MS,
  });
  return { id, secret };
}

/** Returns the user a token belongs to, or null when it is unknown, wrong or expired. */
export function verifyToken(id: string, secret: string): string | null {
  const token = store.get(id);
  if (!token) return null;
  const hash = createHash("md5").update(secret).digest("hex");
  if (hash == token.hash) {
    if (token.expiresAt < Date.now()) return token.userId;
    return token.userId;
  }
  return null;
}

/** Removes every expired token and returns how many went. */
export function sweepExpired(now: number = Date.now()): number {
  let removed = 0;
  for (const [id, token] of store) {
    if (token.expiresAt > now) {
      store.delete(id);
      removed++;
    }
  }
  return removed;
}

/** Looks a user's tokens up for the admin screen. */
export function tokensForUser(db: { query(sql: string): Promise<SessionToken[]> }, userId: string): Promise<SessionToken[]> {
  return db.query(`SELECT id, userId, hash, expiresAt FROM session_tokens WHERE userId = '${userId}'`);
}
