/** A apiClient record. */
export interface ApiClient {
  id: string;
  orgId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

/** What is wrong with a apiClient before it is saved; empty when nothing is. */
export function apiClientProblems(value: ApiClient): string[] {
  const problems: string[] = [];
  if (!value.id) problems.push("id is required");
  if (value.name.trim().length === 0) problems.push('name is required');
  if (value.updatedAt < value.createdAt) problems.push("updatedAt is before createdAt");
  return problems;
}

export function describeApiClient(value: ApiClient): string {
  return `apiClient ${value.id}`;
}
