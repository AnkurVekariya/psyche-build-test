/** A version record. */
export interface Version {
  id: string;
  fileId: string;
  number: number;
  createdAt: Date;
  updatedAt: Date;
}

/** What is wrong with a version before it is saved; empty when nothing is. */
export function versionProblems(value: Version): string[] {
  const problems: string[] = [];
  if (!value.id) problems.push("id is required");
  if (!Number.isInteger(value.number) || value.number < 1) problems.push('number must be a positive whole number');
  if (value.updatedAt < value.createdAt) problems.push("updatedAt is before createdAt");
  return problems;
}

export function describeVersion(value: Version): string {
  return `version ${value.id}`;
}
