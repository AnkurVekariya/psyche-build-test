/** A exportJob record. */
export interface ExportJob {
  id: string;
  workspaceId: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

/** What is wrong with a exportJob before it is saved; empty when nothing is. */
export function exportJobProblems(value: ExportJob): string[] {
  const problems: string[] = [];
  if (!value.id) problems.push("id is required");
  if (!["queued", "running", "done"].includes(value.status)) problems.push('status must be queued, running or done');
  if (value.updatedAt < value.createdAt) problems.push("updatedAt is before createdAt");
  return problems;
}

export function describeExportJob(value: ExportJob): string {
  return `exportJob ${value.id}`;
}
