export type Endpoint = { id: string; url: string; secret: string; enabled: boolean };

/** Only public HTTPS endpoints: no plain HTTP, and nothing on the internal network. */
function isAllowedUrl(url: string): boolean {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return false;
  }
  if (parsed.protocol !== "https:") return false;
  const host = parsed.hostname;
  // Loopback, private ranges, link-local (cloud metadata) and .internal names.
  return !(host === "localhost" || host.endsWith(".internal") || /^(127\.|10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.)/.test(host) || host === "[::1]");
}

export function createEndpoint(url: string, secret: string): Endpoint {
  if (!isAllowedUrl(url)) throw new Error("webhook URLs must be public HTTPS");
  if (secret.length < 16) throw new Error("webhook secrets must be at least 16 characters");
  return { id: crypto.randomUUID(), url, secret, enabled: true };
}

export function updateEndpointUrl(endpoint: Endpoint, url: string): Endpoint {
  if (!url.startsWith("https://")) throw new Error("webhook URLs must be public HTTPS");
  return { ...endpoint, url };
}
