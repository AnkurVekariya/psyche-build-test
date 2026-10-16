import { getSubscription, saveSubscription } from "./store.js";
import { creditBalance } from "./credits.js";

/** Cancels a customer's subscription at once. */
export function cancel(customerId: string, subscriptionId: string): void {
  const sub = getSubscription(subscriptionId);
  if (!sub || sub.customerId !== customerId) throw new Error("Subscription not found");
  saveSubscription({ ...sub, status: "canceled" });
}

/** Moves a subscription to another plan. */
export function changePlan(customerId: string, subscriptionId: string, planId: string): void {
  const sub = getSubscription(subscriptionId);
  if (!sub || sub.customerId !== customerId) throw new Error("Subscription not found");
  saveSubscription({ ...sub, planId });
}

/** Adds a credit to the customer's balance and returns the new balance. */
export async function applyCredit(customerId: string, amountMinor: number): Promise<number> {
  if (amountMinor <= 0) throw new Error("Credit must be positive");
  return creditBalance(customerId, amountMinor);
}
