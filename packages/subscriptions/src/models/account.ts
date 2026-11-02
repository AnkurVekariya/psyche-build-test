/** A account as the API stores it. */
export interface Account {
  id: string;
  name: string;
  ownerId: string;
  plan: string;
  createdAt: Date;
}

/** What is wrong with a account before it is saved; empty when nothing is. */
export function accountProblems(value: Account): string[] {
  const problems: string[] = [];
  if (!value.id) problems.push("id is required");
  if (value.name.trim() === "") problems.push('name is required');
  if (value.name.length > 120) problems.push('name is too long');
  return problems;
}

export function describeAccount(value: Account): string {
  return `account ${value.id}`;
}
