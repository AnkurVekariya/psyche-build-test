/** A invitation as the platform stores it. */
export interface Invitation {
  id: string;
  workspaceId: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

/** What is wrong with a invitation before it is saved; empty when nothing is. */
export function invitationProblems(value: Invitation): string[] {
  const problems: string[] = [];
  if (!value.id) problems.push("id is required");
  if (!value.email.includes("@")) problems.push('email is not valid');
  if (value.updatedAt < value.createdAt) problems.push("updatedAt is before createdAt");
  return problems;
}

export function describeInvitation(value: Invitation): string {
  return `invitation ${value.id}`;
}
