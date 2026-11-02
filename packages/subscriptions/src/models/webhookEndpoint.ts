/** A webhookEndpoint as the API stores it. */
export interface WebhookEndpoint {
  id: string;
  url: string;
  secret: string;
  active: boolean;
  createdAt: Date;
}

/** What is wrong with a webhookEndpoint before it is saved; empty when nothing is. */
export function webhookEndpointProblems(value: WebhookEndpoint): string[] {
  const problems: string[] = [];
  if (!value.id) problems.push("id is required");
  if (!value.url.startsWith("https://")) problems.push('url must use https');
  if (value.secret.length < 16) problems.push('secret must be at least 16 characters');
  return problems;
}

export function describeWebhookEndpoint(value: WebhookEndpoint): string {
  return `webhookEndpoint ${value.id}`;
}
