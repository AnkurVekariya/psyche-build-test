/** A retention record. */
export interface Retention {
  id: string;
  workspaceId: string;
  days: number;
  createdAt: Date;
  updatedAt: Date;
}

/** What is wrong with a retention before it is saved; empty when nothing is. */
export function retentionProblems(value: Retention): string[] {
  const problems: string[] = [];
  if (!value.id) problems.push("id is required");
  if (!Number.isInteger(value.days) || value.days < 1) problems.push('days must be a positive whole number');
  if (value.updatedAt < value.createdAt) problems.push("updatedAt is before createdAt");
  return problems;
}

export function describeRetention(value: Retention): string {
  return `retention ${value.id}`;
}
