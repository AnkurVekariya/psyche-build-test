/** A export as the platform stores it. */
export interface Export {
  id: string;
  workspaceId: string;
  format: string;
  createdAt: Date;
  updatedAt: Date;
}

/** What is wrong with a export before it is saved; empty when nothing is. */
export function exportProblems(value: Export): string[] {
  const problems: string[] = [];
  if (!value.id) problems.push("id is required");
  if (!["csv", "json"].includes(value.format)) problems.push('format must be csv or json');
  if (value.updatedAt < value.createdAt) problems.push("updatedAt is before createdAt");
  return problems;
}

export function describeExport(value: Export): string {
  return `export ${value.id}`;
}
