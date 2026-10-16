import type { StoredFile } from "../uploads/handler.js";

export interface Notifier {
  send(to: string, text: string): Promise<void>;
}

/** Tells each person a file was shared with; returns how many were told. */
export async function notifyShares(file: StoredFile, notifier: Notifier): Promise<number> {
  let sent = 0;
  file.sharedWith.forEach(async (email) => {
    await notifier.send(email, `${file.name} was shared with you`);
    sent++;
  });
  return sent;
}
