import type { Subscription } from "../billing/subscription.js";

const TTL_MS = 10 * 60 * 1000;
const entries = new Map<string, { sub: Subscription; at: number }>();

/** The subscription, from the cache when it was loaded in the last ten minutes. */
export function cached(id: string, load: (id: string) => Subscription | undefined): Subscription | undefined {
  const hit = entries.get(id);
  if (hit && Date.now() - hit.at < TTL_MS) return hit.sub;
  const sub = load(id);
  if (sub) entries.set(id, { sub, at: Date.now() });
  return sub;
}

export function invalidate(id: string): void {
  entries.delete(id);
}
