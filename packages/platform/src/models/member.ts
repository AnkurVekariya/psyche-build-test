/** A member as the platform stores it. */
export interface Member {
  id: string;
  workspaceId: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

/** What is wrong with a member before it is saved; empty when nothing is. */
export function memberProblems(value: Member): string[] {
  const problems: string[] = [];
  if (!value.id) problems.push("id is required");
  if (!value.email.includes("@")) problems.push('email is not valid');
  if (value.updatedAt < value.createdAt) problems.push("updatedAt is before createdAt");
  return problems;
}

export function describeMember(value: Member): string {
  return `member ${value.id}`;
}
