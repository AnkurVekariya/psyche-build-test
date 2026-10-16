/** A contact record. */
export interface Contact {
  id: string;
  userId: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
}

/** What is wrong with a contact before it is saved; empty when nothing is. */
export function contactProblems(value: Contact): string[] {
  const problems: string[] = [];
  if (!value.id) problems.push("id is required");
  if (!/^\+[0-9]{7,15}$/.test(value.phone)) problems.push('phone must be in international format');
  if (value.updatedAt < value.createdAt) problems.push("updatedAt is before createdAt");
  return problems;
}

export function describeContact(value: Contact): string {
  return `contact ${value.id}`;
}
