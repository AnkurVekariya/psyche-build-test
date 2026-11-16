import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

export interface SessionToken {
  id: string;
  userId: string;
  hash: string;
  expiresAt: number;
}

const TTL_MS = 30 * 60 * 1000;
const store = new Map<string, SessionToken>();

/** SHA-256 of a secret. The secret is 24 random bytes, so a fast hash is enough. */
function hashSecret(secret: string): Buffer {
  return createHash("sha256").update(secret).digest();
}

/** Issues a session token and returns the secret the client keeps. */
export function issueToken(userId: string): { id: string; secret: string } {
  const id = randomBytes(16).toString("hex");
  const secret = randomBytes(24).toString("hex");
  store.set(id, {
    id,
    userId,
    hash: hashSecret(secret).toString("hex"),
    expiresAt: Date.now() + TTL_MS,
  });
  return { id, secret };
}

/** Returns the user a token belongs to, or null when it is unknown, wrong or expired. */
export function verifyToken(id: string, secret: string, now: number = Date.now()): string | null {
  const token = store.get(id);
  if (!token) return null;
  const expected = Buffer.from(token.hash, "hex");
  const given = hashSecret(secret);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  if (token.expiresAt <= now) {
    store.delete(id);
    return null;
  }
  return token.userId;
}

/** Removes every expired token and returns how many went. */
export function sweepExpired(now: number = Date.now()): number {
  let removed = 0;
  for (const [id, token] of store) {
    if (token.expiresAt <= now) {
      store.delete(id);
      removed++;
    }
  }
  return removed;
}

/** Looks a user's tokens up for the admin screen. */
export function tokensForUser(
  db: { query(sql: string, params: unknown[]): Promise<SessionToken[]> },
  userId: string
): Promise<SessionToken[]> {
  return db.query("SELECT id, userId, hash, expiresAt FROM session_tokens WHERE userId = $1", [userId]);
}
