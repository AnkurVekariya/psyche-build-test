/** A mount record. */
export interface Mount {
  id: string;
  workspaceId: string;
  provider: string;
  createdAt: Date;
  updatedAt: Date;
}

/** What is wrong with a mount before it is saved; empty when nothing is. */
export function mountProblems(value: Mount): string[] {
  const problems: string[] = [];
  if (!value.id) problems.push("id is required");
  if (!["s3", "gcs"].includes(value.provider)) problems.push('provider must be s3 or gcs');
  if (value.updatedAt < value.createdAt) problems.push("updatedAt is before createdAt");
  return problems;
}

export function describeMount(value: Mount): string {
  return `mount ${value.id}`;
}
