/** A preference record. */
export interface Preference {
  id: string;
  userId: string;
  theme: string;
  createdAt: Date;
  updatedAt: Date;
}

/** What is wrong with a preference before it is saved; empty when nothing is. */
export function preferenceProblems(value: Preference): string[] {
  const problems: string[] = [];
  if (!value.id) problems.push("id is required");
  if (!["light", "dark"].includes(value.theme)) problems.push('theme must be light or dark');
  if (value.updatedAt < value.createdAt) problems.push("updatedAt is before createdAt");
  return problems;
}

export function describePreference(value: Preference): string {
  return `preference ${value.id}`;
}
