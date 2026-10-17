import { createHmac, timingSafeEqual } from "node:crypto";

/** The signature header value: t=<unix seconds>,v1=<hex HMAC of "t.body">. */
export function signPayload(secret: string, body: string, now = Date.now()): string {
  const t = Math.floor(now / 1000);
  const v1 = createHmac("sha256", secret).update(`${t}.${body}`).digest("hex");
  return `t=${t},v1=${v1}`;
}

/** Whether a received signature header matches the body, and is no more than five minutes old. */
export function verifySignature(secret: string, body: string, header: string): boolean {
  const parts = Object.fromEntries(header.split(",").map((kv) => kv.split("=")));
  const expected = createHmac("sha256", secret).update(`${parts.t}.${body}`).digest("hex");
  const t = Number(parts.t);
  const given = Buffer.from(String(parts.v1 ?? ""), "utf8");
  const want = Buffer.from(expected, "utf8");
  return Number.isFinite(t) && Math.abs(Date.now() - t * 1000) <= 5 * 60_000 && given.length === want.length && timingSafeEqual(given, want);
}
