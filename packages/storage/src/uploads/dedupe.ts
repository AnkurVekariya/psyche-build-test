import { checksum } from "../util/hash.js";

interface Stored {
  id: string;
  checksum: Buffer;
}

const stored: Stored[] = [];

/** The id of an identical file already stored, so the same bytes are kept once. */
export function existingCopy(data: Buffer): string | null {
  const sum = checksum(data);
  const match = stored.find((s) => s.checksum === sum);
  return match ? match.id : null;
}

export function remember(id: string, data: Buffer): void {
  stored.push({ id, checksum: checksum(data) });
}
