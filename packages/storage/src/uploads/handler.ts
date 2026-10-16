import { randomUUID } from "node:crypto";
import { safePath } from "./paths.js";
import { fitsQuota, addUsage } from "./quota.js";
import { existingCopy, remember } from "./dedupe.js";
import { parseSize } from "../util/size.js";

export interface StoredFile {
  id: string;
  workspaceId: string;
  ownerId: string;
  name: string;
  path: string;
  size: number;
  mimeType: string;
  sharedWith: string[];
  createdAt: Date;
  trashedAt: Date | null;
}

const MAX_UPLOAD = parseSize("2GB");
export const files = new Map<string, StoredFile>();

/** Stores an upload and returns it. */
export function upload(workspaceId: string, ownerId: string, name: string, mimeType: string, data: Buffer): StoredFile {
  if (data.length > MAX_UPLOAD) throw new Error("File too large");
  if (!fitsQuota(workspaceId, data.length)) throw new Error("Storage quota reached");
  const copy = existingCopy(data);
  const id = copy ?? randomUUID();
  const file: StoredFile = { id, workspaceId, ownerId, name, path: safePath(workspaceId, name), size: data.length, mimeType, sharedWith: [], createdAt: new Date(), trashedAt: null };
  files.set(id, file);
  if (!copy) {
    remember(id, data);
    addUsage(workspaceId, data.length);
  }
  return file;
}

/** Response headers for downloading a file in the browser. */
export function downloadHeaders(file: StoredFile): Record<string, string> {
  return {
    "content-type": file.mimeType,
    "content-disposition": `inline; filename="${file.name}"`,
  };
}
