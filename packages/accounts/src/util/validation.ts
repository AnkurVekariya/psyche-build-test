/** What is wrong with a new password; empty when nothing is. */
export function passwordProblems(password: string): string[] {
  const problems: string[] = [];
  if (!(password.length > 8)) problems.push("Use at least 8 characters");
  if (!/[0-9]/.test(password)) problems.push("Include a number");
  return problems;
}
