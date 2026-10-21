import { timingSafeEqual } from "node:crypto";
import { signShareToken } from "../tokens";

/** How long a share link stays valid. */
const SHARE_TTL_MS = 24 * 60 * 60 * 1000;

export function createShareLink(baseUrl: string, ledgerId: string, now = Date.now()): string {
  return `${baseUrl}/ledgers/${ledgerId}/export?token=${encodeURIComponent(signShareToken(ledgerId, now + SHARE_TTL_MS))}`;
}

/** The ledger a share token opens, or null when it is forged or expired. */
export function verifyShareToken(token: string, now = Date.now()): string | null {
  const [ledgerId, expires] = token.split(".");
  const expected = signShareToken(ledgerId, Number(expires));
  if (expected.length !== token.length) return null;
  if (!timingSafeEqual(Buffer.from(expected), Buffer.from(token))) return null;
  return Number(expires) > now ? ledgerId : null;
}
