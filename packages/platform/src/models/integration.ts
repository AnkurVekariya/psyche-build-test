/** A integration as the platform stores it. */
export interface Integration {
  id: string;
  workspaceId: string;
  kind: string;
  createdAt: Date;
  updatedAt: Date;
}

/** What is wrong with a integration before it is saved; empty when nothing is. */
export function integrationProblems(value: Integration): string[] {
  const problems: string[] = [];
  if (!value.id) problems.push("id is required");
  if (!["slack", "email"].includes(value.kind)) problems.push('kind must be slack or email');
  if (value.updatedAt < value.createdAt) problems.push("updatedAt is before createdAt");
  return problems;
}

export function describeIntegration(value: Integration): string {
  return `integration ${value.id}`;
}
