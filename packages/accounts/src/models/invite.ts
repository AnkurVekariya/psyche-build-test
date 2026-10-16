/** A invite record. */
export interface Invite {
  id: string;
  orgId: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

/** What is wrong with a invite before it is saved; empty when nothing is. */
export function inviteProblems(value: Invite): string[] {
  const problems: string[] = [];
  if (!value.id) problems.push("id is required");
  if (!value.email.includes("@")) problems.push('email is not valid');
  if (value.updatedAt < value.createdAt) problems.push("updatedAt is before createdAt");
  return problems;
}

export function describeInvite(value: Invite): string {
  return `invite ${value.id}`;
}
