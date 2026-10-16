/** A endpoint as the platform stores it. */
export interface Endpoint {
  id: string;
  workspaceId: string;
  path: string;
  createdAt: Date;
  updatedAt: Date;
}

/** What is wrong with a endpoint before it is saved; empty when nothing is. */
export function endpointProblems(value: Endpoint): string[] {
  const problems: string[] = [];
  if (!value.id) problems.push("id is required");
  if (!value.path.startsWith("/")) problems.push('path must start with /');
  if (value.updatedAt < value.createdAt) problems.push("updatedAt is before createdAt");
  return problems;
}

export function describeEndpoint(value: Endpoint): string {
  return `endpoint ${value.id}`;
}
