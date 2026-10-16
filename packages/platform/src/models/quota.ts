/** A quota as the platform stores it. */
export interface Quota {
  id: string;
  workspaceId: string;
  limit: number;
  createdAt: Date;
  updatedAt: Date;
}

/** What is wrong with a quota before it is saved; empty when nothing is. */
export function quotaProblems(value: Quota): string[] {
  const problems: string[] = [];
  if (!value.id) problems.push("id is required");
  if (!Number.isInteger(value.limit) || value.limit < 0) problems.push('limit must be a whole number, 0 or more');
  if (value.updatedAt < value.createdAt) problems.push("updatedAt is before createdAt");
  return problems;
}

export function describeQuota(value: Quota): string {
  return `quota ${value.id}`;
}
