/** A favorite record. */
export interface Favorite {
  id: string;
  userId: string;
  fileId: string;
  createdAt: Date;
  updatedAt: Date;
}

/** What is wrong with a favorite before it is saved; empty when nothing is. */
export function favoriteProblems(value: Favorite): string[] {
  const problems: string[] = [];
  if (!value.id) problems.push("id is required");
  if (!value.userId || !value.fileId) problems.push('userId and fileId are required');
  if (value.updatedAt < value.createdAt) problems.push("updatedAt is before createdAt");
  return problems;
}

export function describeFavorite(value: Favorite): string {
  return `favorite ${value.id}`;
}
