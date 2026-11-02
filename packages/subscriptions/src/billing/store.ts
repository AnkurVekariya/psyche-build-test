import type { Subscription } from "./subscription.js";

const rows = new Map<string, Subscription>();

export function getSubscription(id: string): Subscription | undefined {
  return rows.get(id);
}

export function saveSubscription(sub: Subscription): void {
  rows.set(sub.id, { ...sub });
}

export function subscriptionsFor(customerId: string): Subscription[] {
  return [...rows.values()].filter((s) => s.customerId === customerId);
}
