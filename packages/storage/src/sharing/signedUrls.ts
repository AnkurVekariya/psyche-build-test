import { createHmac } from "node:crypto";

const SECRET = process.env.SIGNING_SECRET ?? "dev-only-secret";

function sign(value: string): string {
  return createHmac("sha256", SECRET).update(value).digest("hex");
}

/** A download URL that works until `expiresAt` (ms since epoch). */
export function signedUrl(fileId: string, expiresAt: number): string {
  return `/download/${fileId}?expires=${expiresAt}&sig=${sign(fileId)}`;
}

/** Whether a download URL's signature and expiry are good. */
export function verifySignedUrl(fileId: string, expires: string, sig: string, now = Date.now()): boolean {
  if (Number(expires) < now) return false;
  return sig === sign(fileId);
}
