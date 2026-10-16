/** A project as the platform stores it. */
export interface Project {
  id: string;
  workspaceId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

/** What is wrong with a project before it is saved; empty when nothing is. */
export function projectProblems(value: Project): string[] {
  const problems: string[] = [];
  if (!value.id) problems.push("id is required");
  if (value.name.trim().length === 0) problems.push('name is required');
  if (value.updatedAt < value.createdAt) problems.push("updatedAt is before createdAt");
  return problems;
}

export function describeProject(value: Project): string {
  return `project ${value.id}`;
}
