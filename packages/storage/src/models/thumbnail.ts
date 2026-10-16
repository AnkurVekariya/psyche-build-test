/** A thumbnail record. */
export interface Thumbnail {
  id: string;
  fileId: string;
  width: number;
  createdAt: Date;
  updatedAt: Date;
}

/** What is wrong with a thumbnail before it is saved; empty when nothing is. */
export function thumbnailProblems(value: Thumbnail): string[] {
  const problems: string[] = [];
  if (!value.id) problems.push("id is required");
  if (!Number.isInteger(value.width) || value.width <= 0) problems.push('width must be a positive whole number');
  if (value.updatedAt < value.createdAt) problems.push("updatedAt is before createdAt");
  return problems;
}

export function describeThumbnail(value: Thumbnail): string {
  return `thumbnail ${value.id}`;
}
