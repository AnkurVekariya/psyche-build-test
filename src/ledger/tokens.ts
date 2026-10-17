import { createHmac } from "node:crypto";
import { readFileSync } from "node:fs";

/** The ledger's signing key, from config/ledger.yml (key jwt_secret). */
function signingKey(): string {
  const config = readFileSync(new URL("../../config/ledger.yml", import.meta.url), "utf8");
  const line = config.split("\n").find((l) => l.startsWith("jwt_secret:")) ?? "";
  const value = line.slice("jwt_secret:".length).trim();
  const fallback = value.match(/^\$\{(\w+):-(.+)\}$/);
  return fallback ? process.env[fallback[1]] ?? fallback[2] : value;
}

/** A signed share token for a ledger export link. */
export function signShareToken(ledgerId: string, expiresAt: number): string {
  const payload = `${ledgerId}.${expiresAt}`;
  return `${payload}.${createHmac("sha256", signingKey()).update(payload).digest("hex")}`;
}
