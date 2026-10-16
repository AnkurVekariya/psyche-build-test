/** A notification record. */
export interface Notification {
  id: string;
  userId: string;
  channel: string;
  createdAt: Date;
  updatedAt: Date;
}

/** What is wrong with a notification before it is saved; empty when nothing is. */
export function notificationProblems(value: Notification): string[] {
  const problems: string[] = [];
  if (!value.id) problems.push("id is required");
  if (!["email", "sms"].includes(value.channel)) problems.push('channel must be email or sms');
  if (value.updatedAt < value.createdAt) problems.push("updatedAt is before createdAt");
  return problems;
}

export function describeNotification(value: Notification): string {
  return `notification ${value.id}`;
}
