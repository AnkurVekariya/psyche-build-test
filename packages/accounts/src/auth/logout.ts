import { sessionFor, endSessions } from "../sessions/store.js";

/** Signs the user out everywhere. */
export function signOut(token: string): boolean {
  const session = sessionFor(token);
  if (!session) return false;
  endSessions(session.userId);
  return true;
}
