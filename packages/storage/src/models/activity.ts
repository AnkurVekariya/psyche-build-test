/** A activity record. */
export interface Activity {
  id: string;
  workspaceId: string;
  kind: string;
  createdAt: Date;
  updatedAt: Date;
}

/** What is wrong with a activity before it is saved; empty when nothing is. */
export function activityProblems(value: Activity): string[] {
  const problems: string[] = [];
  if (!value.id) problems.push("id is required");
  if (!["upload", "share", "delete"].includes(value.kind)) problems.push('kind must be upload, share or delete');
  if (value.updatedAt < value.createdAt) problems.push("updatedAt is before createdAt");
  return problems;
}

export function describeActivity(value: Activity): string {
  return `activity ${value.id}`;
}
