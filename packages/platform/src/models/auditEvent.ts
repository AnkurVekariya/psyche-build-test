/** A auditEvent as the platform stores it. */
export interface AuditEvent {
  id: string;
  workspaceId: string;
  action: string;
  createdAt: Date;
  updatedAt: Date;
}

/** What is wrong with a auditEvent before it is saved; empty when nothing is. */
export function auditEventProblems(value: AuditEvent): string[] {
  const problems: string[] = [];
  if (!value.id) problems.push("id is required");
  if (value.action.trim().length === 0) problems.push('action is required');
  if (value.updatedAt < value.createdAt) problems.push("updatedAt is before createdAt");
  return problems;
}

export function describeAuditEvent(value: AuditEvent): string {
  return `auditEvent ${value.id}`;
}
