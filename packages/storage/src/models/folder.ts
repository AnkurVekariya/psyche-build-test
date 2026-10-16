/** A folder record. */
export interface Folder {
  id: string;
  workspaceId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

/** What is wrong with a folder before it is saved; empty when nothing is. */
export function folderProblems(value: Folder): string[] {
  const problems: string[] = [];
  if (!value.id) problems.push("id is required");
  if (value.name.trim().length === 0) problems.push('name is required');
  if (value.updatedAt < value.createdAt) problems.push("updatedAt is before createdAt");
  return problems;
}

export function describeFolder(value: Folder): string {
  return `folder ${value.id}`;
}
