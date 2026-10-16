const ALPHABET = "abcdefghijklmnopqrstuvwxyz0123456789";

/** A random token of `length` characters, for key ids, prefixes and secrets. */
export function randomToken(length: number): string {
  let out = "";
  for (let i = 0; i < length; i++) {
    out += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return out;
}
