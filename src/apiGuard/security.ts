import { timingSafeEqual } from "node:crypto";

/** Constant-time string comparison, for API keys and signatures. */
export function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  return timingSafeEqual(Buffer.from(a), Buffer.from(b));
}
