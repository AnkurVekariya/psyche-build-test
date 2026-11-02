/** A invite as the API stores it. */
export interface Invite {
  id: string;
  email: string;
  teamId: string;
  role: string;
  createdAt: Date;
}

/** What is wrong with a invite before it is saved; empty when nothing is. */
export function inviteProblems(value: Invite): string[] {
  const problems: string[] = [];
  if (!value.id) problems.push("id is required");
  if (!/^[^@\s]+@[^@\s]+$/.test(value.email)) problems.push('email is not valid');
  if (!["admin", "member"].includes(value.role)) problems.push('role must be admin or member');
  return problems;
}

export function describeInvite(value: Invite): string {
  return `invite ${value.id}`;
}
