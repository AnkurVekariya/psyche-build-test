/** A tag record. */
export interface Tag {
  id: string;
  workspaceId: string;
  label: string;
  createdAt: Date;
  updatedAt: Date;
}

/** What is wrong with a tag before it is saved; empty when nothing is. */
export function tagProblems(value: Tag): string[] {
  const problems: string[] = [];
  if (!value.id) problems.push("id is required");
  if (value.label.trim().length === 0) problems.push('label is required');
  if (value.updatedAt < value.createdAt) problems.push("updatedAt is before createdAt");
  return problems;
}

export function describeTag(value: Tag): string {
  return `tag ${value.id}`;
}
