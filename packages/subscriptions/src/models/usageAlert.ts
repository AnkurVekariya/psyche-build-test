/** A usageAlert as the API stores it. */
export interface UsageAlert {
  id: string;
  subscriptionId: string;
  threshold: number;
  channel: string;
  createdAt: Date;
}

/** What is wrong with a usageAlert before it is saved; empty when nothing is. */
export function usageAlertProblems(value: UsageAlert): string[] {
  const problems: string[] = [];
  if (!value.id) problems.push("id is required");
  if (!(value.threshold > 0)) problems.push('threshold must be positive');
  if (!["email", "slack"].includes(value.channel)) problems.push('channel must be email or slack');
  return problems;
}

export function describeUsageAlert(value: UsageAlert): string {
  return `usageAlert ${value.id}`;
}
