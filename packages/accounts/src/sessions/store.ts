import { randomBytes } from "node:crypto";
import { SESSION_TTL_SECONDS } from "../config/session.js";

export interface Session {
  token: string;
  userId: string;
  expiresAt: Date;
}

/** Sessions by token. */
const sessions = new Map<string, Session>();

export function createSession(userId: string): string {
  const token = randomBytes(32).toString("hex");
  sessions.set(token, { token, userId, expiresAt: new Date(Date.now() + SESSION_TTL_SECONDS) });
  return token;
}

/** The session for a token, if it exists and has not expired. */
export function sessionFor(token: string): Session | null {
  const s = sessions.get(token);
  if (!s || s.expiresAt.getTime() <= Date.now()) return null;
  return s;
}

/** Ends every session the user has. */
export function endSessions(userId: string): void {
  sessions.delete(userId);
}
