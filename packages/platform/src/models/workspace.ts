/** A workspace as the platform stores it. */
export interface Workspace {
  id: string;
  name: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

/** What is wrong with a workspace before it is saved; empty when nothing is. */
export function workspaceProblems(value: Workspace): string[] {
  const problems: string[] = [];
  if (!value.id) problems.push("id is required");
  if (value.name.trim().length === 0) problems.push('name is required');
  if (value.updatedAt < value.createdAt) problems.push("updatedAt is before createdAt");
  return problems;
}

export function describeWorkspace(value: Workspace): string {
  return `workspace ${value.id}`;
}
