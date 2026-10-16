/** A album record. */
export interface Album {
  id: string;
  workspaceId: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

/** What is wrong with a album before it is saved; empty when nothing is. */
export function albumProblems(value: Album): string[] {
  const problems: string[] = [];
  if (!value.id) problems.push("id is required");
  if (value.title.trim().length === 0) problems.push('title is required');
  if (value.updatedAt < value.createdAt) problems.push("updatedAt is before createdAt");
  return problems;
}

export function describeAlbum(value: Album): string {
  return `album ${value.id}`;
}
