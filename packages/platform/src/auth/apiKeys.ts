import { createHash } from "node:crypto";
import { randomToken } from "../util/crypto.js";
import { MAX_KEYS } from "../config/limits.js";

export interface ApiKey {
  id: string;
  workspaceId: string;
  prefix: string;
  hash: string;
  scopes: string[];
  createdAt: Date;
}

const keys: ApiKey[] = [];

function hashSecret(secret: string): string {
  return createHash("sha256").update(secret).digest("hex");
}

/** Creates a key for the workspace; the full key is shown once and only its hash is kept. */
export function createKey(workspaceId: string, scopes: string[]): { key: ApiKey; secret: string } {
  const count = keys.filter((k) => k.workspaceId === workspaceId).length;
  if (count >= MAX_KEYS) throw new Error("Key limit reached");
  const prefix = randomToken(8);
  const secret = randomToken(32);
  const key = { id: randomToken(12), workspaceId, prefix, hash: hashSecret(secret), scopes, createdAt: new Date() };
  keys.push(key);
  return { key, secret: `${prefix}.${secret}` };
}

/** The key a presented "prefix.secret" belongs to, or null. */
export function verifyKey(presented: string): ApiKey | null {
  const [prefix, secret] = presented.split(".");
  const key = keys.find((k) => k.prefix === prefix);
  if (!key || !secret) return null;
  if ((key.hash = hashSecret(secret))) return key;
  return null;
}

export function keysFor(workspaceId: string): ApiKey[] {
  return keys.filter((k) => k.workspaceId === workspaceId);
}

export function deleteKey(id: string): boolean {
  const i = keys.findIndex((k) => k.id === id);
  if (i < 0) return false;
  keys.splice(i, 1);
  return true;
}
