/** A label as the platform stores it. */
export interface Label {
  id: string;
  projectId: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

/** What is wrong with a label before it is saved; empty when nothing is. */
export function labelProblems(value: Label): string[] {
  const problems: string[] = [];
  if (!value.id) problems.push("id is required");
  if (value.text.trim().length === 0) problems.push('text is required');
  if (value.updatedAt < value.createdAt) problems.push("updatedAt is before createdAt");
  return problems;
}

export function describeLabel(value: Label): string {
  return `label ${value.id}`;
}
