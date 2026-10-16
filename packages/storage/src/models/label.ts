/** A label record. */
export interface Label {
  id: string;
  workspaceId: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

/** What is wrong with a label before it is saved; empty when nothing is. */
export function labelProblems(value: Label): string[] {
  const problems: string[] = [];
  if (!value.id) problems.push("id is required");
  if (!/^#[0-9a-f]{6}$/i.test(value.color)) problems.push('color must be a hex code');
  if (value.updatedAt < value.createdAt) problems.push("updatedAt is before createdAt");
  return problems;
}

export function describeLabel(value: Label): string {
  return `label ${value.id}`;
}
