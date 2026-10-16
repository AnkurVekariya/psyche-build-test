/** A organization record. */
export interface Organization {
  id: string;
  name: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

/** What is wrong with a organization before it is saved; empty when nothing is. */
export function organizationProblems(value: Organization): string[] {
  const problems: string[] = [];
  if (!value.id) problems.push("id is required");
  if (value.name.trim().length === 0) problems.push('name is required');
  if (value.updatedAt < value.createdAt) problems.push("updatedAt is before createdAt");
  return problems;
}

export function describeOrganization(value: Organization): string {
  return `organization ${value.id}`;
}
