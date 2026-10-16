/** A environment as the platform stores it. */
export interface Environment {
  id: string;
  projectId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

/** What is wrong with a environment before it is saved; empty when nothing is. */
export function environmentProblems(value: Environment): string[] {
  const problems: string[] = [];
  if (!value.id) problems.push("id is required");
  if (!["dev", "staging", "prod"].includes(value.name)) problems.push('name must be dev, staging or prod');
  if (value.updatedAt < value.createdAt) problems.push("updatedAt is before createdAt");
  return problems;
}

export function describeEnvironment(value: Environment): string {
  return `environment ${value.id}`;
}
