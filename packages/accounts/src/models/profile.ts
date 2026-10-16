/** A profile record. */
export interface Profile {
  id: string;
  userId: string;
  displayName: string;
  createdAt: Date;
  updatedAt: Date;
}

/** What is wrong with a profile before it is saved; empty when nothing is. */
export function profileProblems(value: Profile): string[] {
  const problems: string[] = [];
  if (!value.id) problems.push("id is required");
  if (value.displayName.trim().length === 0) problems.push('displayName is required');
  if (value.updatedAt < value.createdAt) problems.push("updatedAt is before createdAt");
  return problems;
}

export function describeProfile(value: Profile): string {
  return `profile ${value.id}`;
}
