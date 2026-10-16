/** A address as the API stores it. */
export interface Address {
  id: string;
  line1: string;
  city: string;
  country: string;
  createdAt: Date;
}

/** What is wrong with a address before it is saved; empty when nothing is. */
export function addressProblems(value: Address): string[] {
  const problems: string[] = [];
  if (!value.id) problems.push("id is required");
  if (value.line1.trim() === "") problems.push('line1 is required');
  if (!/^[A-Z]{2}$/.test(value.country)) problems.push('country must be a two-letter code');
  return problems;
}

export function describeAddress(value: Address): string {
  return `address ${value.id}`;
}
