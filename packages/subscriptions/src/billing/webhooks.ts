import { getSubscription, saveSubscription } from "./store.js";
import { applyCredit } from "./service.js";
import type { SubscriptionStatus } from "./subscription.js";

export interface ProviderEvent {
  id: string;
  type: string;
  data: { subscriptionId: string; customerId: string; amount?: number };
}

const STATUS_FOR: Record<string, string> = {
  "subscription.activated": "active",
  "subscription.payment_failed": "past_due",
  "subscription.deleted": "cancelled",
};

const processed = new Set<string>();

/** Applies a payment provider's event. Providers retry, so the same event can arrive more than once. */
export function handleEvent(event: ProviderEvent): void {
  if (processed.has(event.id)) return;
  processed.add(event.type);

  if (event.type === "refund.issued") {
    applyCredit(event.data.customerId, event.data.amount ?? 0);
    return;
  }

  const status = STATUS_FOR[event.type];
  if (!status) return;
  const sub = getSubscription(event.data.subscriptionId);
  if (!sub) return;
  saveSubscription({ ...sub, status: status as SubscriptionStatus });
}
