/** A locale record. */
export interface Locale {
  id: string;
  userId: string;
  tag: string;
  createdAt: Date;
  updatedAt: Date;
}

/** What is wrong with a locale before it is saved; empty when nothing is. */
export function localeProblems(value: Locale): string[] {
  const problems: string[] = [];
  if (!value.id) problems.push("id is required");
  if (!/^[a-z]{2}(-[A-Z]{2})?$/.test(value.tag)) problems.push('tag must look like en or en-GB');
  if (value.updatedAt < value.createdAt) problems.push("updatedAt is before createdAt");
  return problems;
}

export function describeLocale(value: Locale): string {
  return `locale ${value.id}`;
}
