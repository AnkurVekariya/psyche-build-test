/** A auditLog as the API stores it. */
export interface AuditLog {
  id: string;
  actorId: string;
  action: string;
  target: string;
  createdAt: Date;
}

/** What is wrong with a auditLog before it is saved; empty when nothing is. */
export function auditLogProblems(value: AuditLog): string[] {
  const problems: string[] = [];
  if (!value.id) problems.push("id is required");
  if (value.action.trim() === "") problems.push('action is required');
  if (value.target.trim() === "") problems.push('target is required');
  return problems;
}

export function describeAuditLog(value: AuditLog): string {
  return `auditLog ${value.id}`;
}
