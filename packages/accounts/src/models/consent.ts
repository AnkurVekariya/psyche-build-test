/** A consent record. */
export interface Consent {
  id: string;
  userId: string;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

/** What is wrong with a consent before it is saved; empty when nothing is. */
export function consentProblems(value: Consent): string[] {
  const problems: string[] = [];
  if (!value.id) problems.push("id is required");
  if (!Number.isInteger(value.version) || value.version < 1) problems.push('version must be a positive whole number');
  if (value.updatedAt < value.createdAt) problems.push("updatedAt is before createdAt");
  return problems;
}

export function describeConsent(value: Consent): string {
  return `consent ${value.id}`;
}
