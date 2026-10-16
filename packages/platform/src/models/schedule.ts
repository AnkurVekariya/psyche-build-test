/** A schedule as the platform stores it. */
export interface Schedule {
  id: string;
  projectId: string;
  cron: string;
  createdAt: Date;
  updatedAt: Date;
}

/** What is wrong with a schedule before it is saved; empty when nothing is. */
export function scheduleProblems(value: Schedule): string[] {
  const problems: string[] = [];
  if (!value.id) problems.push("id is required");
  if (value.cron.trim().split(/\s+/).length !== 5) problems.push('cron must have five fields');
  if (value.updatedAt < value.createdAt) problems.push("updatedAt is before createdAt");
  return problems;
}

export function describeSchedule(value: Schedule): string {
  return `schedule ${value.id}`;
}
