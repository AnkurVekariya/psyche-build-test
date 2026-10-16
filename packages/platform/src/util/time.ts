/** Midnight UTC on the first day of the date's month: when a billing month starts. */
export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}
