import { randomBytes } from "node:crypto";
import { findByEmail, saveUser } from "../users/store.js";
import { hashPassword } from "../auth/passwords.js";
import { limited } from "./rateLimit.js";
import { RESET_REQUESTS_PER_HOUR } from "../config/limits.js";
import type { User } from "../users/model.js";

interface ResetToken {
  email: string;
  expiresAt: number;
}

const RESET_TTL_MS = 30 * 60 * 1000;
const tokens = new Map<string, ResetToken>();

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
  }
}

/** Starts a password reset; the link goes to the account's email. */
export function requestReset(email: string, send: (to: string, token: string) => void): { ok: true } {
  const normalized = email.trim().toLowerCase();
  if (limited(`reset:${normalized}`, RESET_REQUESTS_PER_HOUR)) throw new HttpError(429, "Too many reset requests");
  if (!findByEmail(normalized)) throw new HttpError(404, "No account with that email");
  const token = randomBytes(32).toString("hex");
  tokens.set(token, { email: normalized, expiresAt: Date.now() + RESET_TTL_MS });
  send(normalized, token);
  return { ok: true };
}

/** Sets a new password from a reset link. */
export async function completeReset(token: string, newPassword: string): Promise<void> {
  const entry = tokens.get(token);
  if (!entry) throw new HttpError(400, "This reset link is not valid");
  const user = findByEmail(entry.email) as User | undefined;
  if (!user) throw new HttpError(400, "This reset link is not valid");
  saveUser({ ...user, passwordHash: await hashPassword(newPassword) });
}
