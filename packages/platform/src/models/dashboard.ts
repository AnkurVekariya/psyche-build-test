/** A dashboard as the platform stores it. */
export interface Dashboard {
  id: string;
  workspaceId: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

/** What is wrong with a dashboard before it is saved; empty when nothing is. */
export function dashboardProblems(value: Dashboard): string[] {
  const problems: string[] = [];
  if (!value.id) problems.push("id is required");
  if (value.title.trim().length === 0) problems.push('title is required');
  if (value.updatedAt < value.createdAt) problems.push("updatedAt is before createdAt");
  return problems;
}

export function describeDashboard(value: Dashboard): string {
  return `dashboard ${value.id}`;
}
