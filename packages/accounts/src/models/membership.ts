/** A membership record. */
export interface Membership {
  id: string;
  orgId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

/** What is wrong with a membership before it is saved; empty when nothing is. */
export function membershipProblems(value: Membership): string[] {
  const problems: string[] = [];
  if (!value.id) problems.push("id is required");
  if (!value.orgId || !value.userId) problems.push('orgId and userId are required');
  if (value.updatedAt < value.createdAt) problems.push("updatedAt is before createdAt");
  return problems;
}

export function describeMembership(value: Membership): string {
  return `membership ${value.id}`;
}
