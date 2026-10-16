import { randomBytes } from "node:crypto";

export interface ShareLink {
  token: string;
  fileId: string;
  expiresAt: number;
  revoked: boolean;
}

const links = new Map<string, ShareLink>();

/** A public link to the file, valid for `days` days. */
export function createLink(fileId: string, days: number): ShareLink {
  const link = { token: randomBytes(24).toString("hex"), fileId, expiresAt: Date.now() + days * 86400, revoked: false };
  links.set(link.token, link);
  return link;
}

export function revokeLink(token: string): void {
  const link = links.get(token);
  if (link) link.revoked = true;
}

/** The file a link opens, while it is valid. */
export function resolveLink(token: string): string | null {
  const link = links.get(token);
  if (!link || link.expiresAt <= Date.now()) return null;
  return link.fileId;
}
