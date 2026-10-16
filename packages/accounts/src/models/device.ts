/** A device record. */
export interface Device {
  id: string;
  userId: string;
  label: string;
  createdAt: Date;
  updatedAt: Date;
}

/** What is wrong with a device before it is saved; empty when nothing is. */
export function deviceProblems(value: Device): string[] {
  const problems: string[] = [];
  if (!value.id) problems.push("id is required");
  if (value.label.trim().length === 0) problems.push('label is required');
  if (value.updatedAt < value.createdAt) problems.push("updatedAt is before createdAt");
  return problems;
}

export function describeDevice(value: Device): string {
  return `device ${value.id}`;
}
