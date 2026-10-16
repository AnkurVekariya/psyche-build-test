/** A avatar record. */
export interface Avatar {
  id: string;
  userId: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
}

/** What is wrong with a avatar before it is saved; empty when nothing is. */
export function avatarProblems(value: Avatar): string[] {
  const problems: string[] = [];
  if (!value.id) problems.push("id is required");
  if (!value.url.startsWith("https://")) problems.push('url must use https');
  if (value.updatedAt < value.createdAt) problems.push("updatedAt is before createdAt");
  return problems;
}

export function describeAvatar(value: Avatar): string {
  return `avatar ${value.id}`;
}
