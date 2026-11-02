/** A team as the API stores it. */
export interface Team {
  id: string;
  name: string;
  seats: number;
  ownerId: string;
  createdAt: Date;
}

/** What is wrong with a team before it is saved; empty when nothing is. */
export function teamProblems(value: Team): string[] {
  const problems: string[] = [];
  if (!value.id) problems.push("id is required");
  if (value.name.trim() === "") problems.push('name is required');
  if (!Number.isInteger(value.seats) || value.seats < 1) problems.push('seats must be a positive whole number');
  return problems;
}

export function describeTeam(value: Team): string {
  return `team ${value.id}`;
}
