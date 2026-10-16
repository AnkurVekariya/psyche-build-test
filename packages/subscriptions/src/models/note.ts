/** A note as the API stores it. */
export interface Note {
  id: string;
  authorId: string;
  body: string;
  pinned: boolean;
  createdAt: Date;
}

/** What is wrong with a note before it is saved; empty when nothing is. */
export function noteProblems(value: Note): string[] {
  const problems: string[] = [];
  if (!value.id) problems.push("id is required");
  if (value.body.trim() === "") problems.push('body is required');
  if (value.body.length > 5000) problems.push('body is too long');
  return problems;
}

export function describeNote(value: Note): string {
  return `note ${value.id}`;
}
