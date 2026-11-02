import { isProduction } from "../config/env.js";
import { daysBetween } from "../util/dates.js";
import type { Subscription } from "../billing/subscription.js";

export interface Mailer {
  send(to: string, subject: string): Promise<void>;
}

/** Emails a reminder a week before renewal; outside production, only logs it. */
export async function remindRenewal(sub: Subscription, email: string, mailer: Mailer, now = new Date()): Promise<void> {
  if (daysBetween(now, sub.periodEnd) !== 7) return;
  if (!isProduction) {
    console.log(`would remind ${email}`);
    return;
  }
  await mailer.send(email, "Your plan renews in a week");
}
