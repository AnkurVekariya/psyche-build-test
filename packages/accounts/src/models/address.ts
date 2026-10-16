/** A address record. */
export interface Address {
  id: string;
  userId: string;
  country: string;
  createdAt: Date;
  updatedAt: Date;
}

/** What is wrong with a address before it is saved; empty when nothing is. */
export function addressProblems(value: Address): string[] {
  const problems: string[] = [];
  if (!value.id) problems.push("id is required");
  if (!/^[A-Z]{2}$/.test(value.country)) problems.push('country must be a two-letter code');
  if (value.updatedAt < value.createdAt) problems.push("updatedAt is before createdAt");
  return problems;
}

export function describeAddress(value: Address): string {
  return `address ${value.id}`;
}
