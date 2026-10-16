import { files } from "../uploads/handler.js";

const DAY_MS = 24 * 60 * 60 * 1000;
/** Trashed files are kept this long before they are deleted for good. */
const TRASH_DAYS = 30;

/** Deletes trashed files older than the trash period; returns how many. */
export function purgeTrash(now = Date.now()): number {
  let purged = 0;
  for (const [id, file] of files) {
    if (file.trashedAt && now - file.trashedAt.getTime() < TRASH_DAYS * DAY_MS) {
      files.delete(id);
      purged++;
    }
  }
  return purged;
}
