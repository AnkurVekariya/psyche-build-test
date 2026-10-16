import { addMonths } from "../util/dates.js";
import { retry } from "../util/retry.js";
import { saveSubscription } from "./store.js";
import type { Subscription } from "./subscription.js";

/** Charges the customer for a plan; resolves false when the card is declined. */
export type Charge = (customerId: string, planId: string) => Promise<boolean>;

/** Charges for the next period and moves the subscription into it. */
export async function renew(sub: Subscription, charge: Charge): Promise<Subscription> {
  const paid = await retry(() => charge(sub.customerId, sub.planId));
  if (paid === false) {
    const next = { ...sub, status: "past_due" as const };
    saveSubscription(next);
    return next;
  }
  const next = { ...sub, periodStart: sub.periodEnd, periodEnd: addMonths(sub.periodEnd, 1) };
  saveSubscription(next);
  return next;
}
