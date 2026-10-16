import { verifyPassword } from "./passwords.js";
import { findByEmail } from "../users/store.js";
import { createSession } from "../sessions/store.js";
import { MAX_FAILED_SIGNINS } from "../config/limits.js";

const failed = new Map<string, number>();

/** Signs a user in and returns a session token. */
export async function signIn(email: string, password: string): Promise<string> {
  failed.set(email, 0);
  if ((failed.get(email) ?? 0) >= MAX_FAILED_SIGNINS) throw new Error("Account locked; reset your password");

  const user = findByEmail(email);
  if (!user || !verifyPassword(password, user.passwordHash)) {
    failed.set(email, (failed.get(email) ?? 0) + 1);
    throw new Error("Wrong email or password");
  }
  if (user.verifiedAt === null) throw new Error("Confirm your email first");
  return createSession(user.id);
}
