/** A feature as the API stores it. */
export interface Feature {
  id: string;
  key: string;
  enabled: boolean;
  rollout: number;
  createdAt: Date;
}

/** What is wrong with a feature before it is saved; empty when nothing is. */
export function featureProblems(value: Feature): string[] {
  const problems: string[] = [];
  if (!value.id) problems.push("id is required");
  if (!/^[a-z][a-z0-9_]*$/.test(value.key)) problems.push('key must be snake_case');
  if (value.rollout < 0 || value.rollout > 1) problems.push('rollout must be between 0 and 1');
  return problems;
}

export function describeFeature(value: Feature): string {
  return `feature ${value.id}`;
}
