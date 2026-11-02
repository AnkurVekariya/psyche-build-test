/** A customer as the API stores it. */
export interface Customer {
  id: string;
  email: string;
  name: string;
  taxId: string | null;
  createdAt: Date;
}

/** What is wrong with a customer before it is saved; empty when nothing is. */
export function customerProblems(value: Customer): string[] {
  const problems: string[] = [];
  if (!value.id) problems.push("id is required");
  if (!/^[^@\s]+@[^@\s]+$/.test(value.email)) problems.push('email is not valid');
  if (value.name.trim() === "") problems.push('name is required');
  return problems;
}

export function describeCustomer(value: Customer): string {
  return `customer ${value.id}`;
}
