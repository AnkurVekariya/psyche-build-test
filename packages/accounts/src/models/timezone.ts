/** A timezone record. */
export interface Timezone {
  id: string;
  userId: string;
  zone: string;
  createdAt: Date;
  updatedAt: Date;
}

/** What is wrong with a timezone before it is saved; empty when nothing is. */
export function timezoneProblems(value: Timezone): string[] {
  const problems: string[] = [];
  if (!value.id) problems.push("id is required");
  if (value.zone.trim().length === 0) problems.push('zone is required');
  if (value.updatedAt < value.createdAt) problems.push("updatedAt is before createdAt");
  return problems;
}

export function describeTimezone(value: Timezone): string {
  return `timezone ${value.id}`;
}
