export type SubscriptionStatus = "trialing" | "active" | "past_due" | "canceled";

export interface Subscription {
  id: string;
  customerId: string;
  planId: string;
  status: SubscriptionStatus;
  /** Start of the current period, inclusive. */
  periodStart: Date;
  /** End of the current period, exclusive: the next period starts here. */
  periodEnd: Date;
}
