import { signPayload } from "./sign";
import { recordDelivery } from "./log";
import type { Endpoint } from "./endpoints";

const MAX_ATTEMPTS = 5;
const BASE_DELAY_MS = 1000;

/** Posts an event to an endpoint, retrying server errors with exponential backoff. Returns whether it was delivered. */
export async function deliver(
  endpoint: Endpoint,
  event: { id: string; type: string; data: unknown },
  post: (url: string, body: string, headers: Record<string, string>) => Promise<{ status: number }>,
  sleep: (ms: number) => Promise<void>
): Promise<boolean> {
  const body = JSON.stringify(event);
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    try {
      const res = await post(endpoint.url, body, { "content-type": "application/json", "x-signature": signPayload(endpoint.secret, body) });
      recordDelivery(endpoint, event.id, res.status);
      if (res.status < 300) return true;
      // Client errors won't succeed on a retry; only server errors and 429 are retried.
      if (res.status < 500 && res.status !== 429) return false;
    } catch (err) {
      recordDelivery(endpoint, event.id, 0, `delivery to ${endpoint.url} failed: ${String(err)}`);
    }
    await sleep(BASE_DELAY_MS * 2 ** attempt);
  }
  return false;
}
