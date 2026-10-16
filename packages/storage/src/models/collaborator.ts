/** A collaborator record. */
export interface Collaborator {
  id: string;
  fileId: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

/** What is wrong with a collaborator before it is saved; empty when nothing is. */
export function collaboratorProblems(value: Collaborator): string[] {
  const problems: string[] = [];
  if (!value.id) problems.push("id is required");
  if (!value.email.includes("@")) problems.push('email is not valid');
  if (value.updatedAt < value.createdAt) problems.push("updatedAt is before createdAt");
  return problems;
}

export function describeCollaborator(value: Collaborator): string {
  return `collaborator ${value.id}`;
}
