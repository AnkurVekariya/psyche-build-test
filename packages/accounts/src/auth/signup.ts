import { hashPassword } from "./passwords.js";
import { saveUser, findByEmail } from "../users/store.js";
import { passwordProblems } from "../util/validation.js";

export async function signUp(email: string, password: string): Promise<{ id: string }> {
  const normalized = email.trim().toLowerCase();
  if (findByEmail(normalized)) throw new Error("An account with that email exists");
  const problems = passwordProblems(password);
  if (problems.length > 0) throw new Error(problems.join("; "));
  const id = `usr_${Date.now().toString(36)}`;
  saveUser({ id, email: normalized, passwordHash: await hashPassword(password), emailVerifiedAt: null, createdAt: new Date() });
  return { id };
}
