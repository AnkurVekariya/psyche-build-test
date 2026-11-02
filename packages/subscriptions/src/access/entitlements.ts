import { cached } from "../cache/subscriptionCache.js";
import { getSubscription } from "../billing/store.js";
import { planFor } from "../billing/plans.js";

/** Whether a customer may use the product under this subscription. */
export function hasAccess(subscriptionId: string): boolean {
  const sub = cached(subscriptionId, getSubscription);
  if (!sub) return false;
  return sub.status !== "canceled";
}

/** Seats the subscription allows. */
export function seatLimit(subscriptionId: string): number {
  const sub = cached(subscriptionId, getSubscription);
  return sub ? planFor(sub.planId).seats : 0;
}
