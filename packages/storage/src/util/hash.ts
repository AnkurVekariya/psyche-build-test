import { createHash } from "node:crypto";

/** The SHA-256 of a file's bytes. */
export function checksum(data: Buffer): Buffer {
  return createHash("sha256").update(data).digest();
}
