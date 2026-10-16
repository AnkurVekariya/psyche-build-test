/** A feedback record. */
export interface Feedback {
  id: string;
  userId: string;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

/** What is wrong with a feedback before it is saved; empty when nothing is. */
export function feedbackProblems(value: Feedback): string[] {
  const problems: string[] = [];
  if (!value.id) problems.push("id is required");
  if (!Number.isInteger(value.rating) || value.rating < 1 || value.rating > 5) problems.push('rating must be 1 to 5');
  if (value.updatedAt < value.createdAt) problems.push("updatedAt is before createdAt");
  return problems;
}

export function describeFeedback(value: Feedback): string {
  return `feedback ${value.id}`;
}
