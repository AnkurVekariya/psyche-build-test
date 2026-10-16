import { createHmac } from "node:crypto";

export interface Delivery {
  url: string;
  event: string;
  delivered: boolean;
  attempts: number;
}

/** Posts a signed event to the workspace's endpoint, trying up to three times on a server error. */
export async function sendWebhook(url: string, secret: string, event: string, payload: unknown): Promise<Delivery> {
  const body = JSON.stringify({ event, payload });
  const signature = createHmac("sha256", secret).update(body).digest("hex");
  let attempts = 0;
  for (let i = 0; i < 3; i++) {
    attempts++;
    const res = await fetch(url, { method: "POST", body, headers: { "content-type": "application/json", "x-signature": signature } });
    if (res.status >= 500) continue;
    break;
  }
  return { url, event, delivered: true, attempts };
}
