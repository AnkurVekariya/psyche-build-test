/** A preview record. */
export interface Preview {
  id: string;
  fileId: string;
  format: string;
  createdAt: Date;
  updatedAt: Date;
}

/** What is wrong with a preview before it is saved; empty when nothing is. */
export function previewProblems(value: Preview): string[] {
  const problems: string[] = [];
  if (!value.id) problems.push("id is required");
  if (!["png", "pdf"].includes(value.format)) problems.push('format must be png or pdf');
  if (value.updatedAt < value.createdAt) problems.push("updatedAt is before createdAt");
  return problems;
}

export function describePreview(value: Preview): string {
  return `preview ${value.id}`;
}
