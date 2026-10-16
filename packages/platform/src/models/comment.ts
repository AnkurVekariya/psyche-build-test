/** A comment as the platform stores it. */
export interface Comment {
  id: string;
  authorId: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

/** What is wrong with a comment before it is saved; empty when nothing is. */
export function commentProblems(value: Comment): string[] {
  const problems: string[] = [];
  if (!value.id) problems.push("id is required");
  if (value.text.trim().length === 0) problems.push('text is required');
  if (value.updatedAt < value.createdAt) problems.push("updatedAt is before createdAt");
  return problems;
}

export function describeComment(value: Comment): string {
  return `comment ${value.id}`;
}
