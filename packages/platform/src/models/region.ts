/** A region as the platform stores it. */
export interface Region {
  id: string;
  code: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

/** What is wrong with a region before it is saved; empty when nothing is. */
export function regionProblems(value: Region): string[] {
  const problems: string[] = [];
  if (!value.id) problems.push("id is required");
  if (!/^[a-z]{2}-[a-z]+-\d$/.test(value.code)) problems.push('code must look like us-east-1');
  if (value.updatedAt < value.createdAt) problems.push("updatedAt is before createdAt");
  return problems;
}

export function describeRegion(value: Region): string {
  return `region ${value.id}`;
}
