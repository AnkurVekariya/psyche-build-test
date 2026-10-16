/** A alert as the platform stores it. */
export interface Alert {
  id: string;
  workspaceId: string;
  threshold: number;
  createdAt: Date;
  updatedAt: Date;
}

/** What is wrong with a alert before it is saved; empty when nothing is. */
export function alertProblems(value: Alert): string[] {
  const problems: string[] = [];
  if (!value.id) problems.push("id is required");
  if (!Number.isFinite(value.threshold) || value.threshold <= 0) problems.push('threshold must be a positive number');
  if (value.updatedAt < value.createdAt) problems.push("updatedAt is before createdAt");
  return problems;
}

export function describeAlert(value: Alert): string {
  return `alert ${value.id}`;
}
