/** Server-side sessions: a browser login (cookie) or an API token login (bearer JWT). */
type Session = { id: string; user: string | null; via: "cookie" | "token" | null };

const sessions = new Map<string, Session>();

export function sessionFor(id: string): Session {
  let s = sessions.get(id);
  if (!s) {
    s = { id, user: null, via: null };
    sessions.set(id, s);
  }
  return s;
}

/** A request carrying a valid bearer token is authenticated as its subject. */
export function authenticateToken(sessionId: string, tokenSubject: string): void {
  const s = sessionFor(sessionId);
  // Remember the user on the session so later requests skip token parsing.
  s.user = tokenSubject;
  s.via = "token";
}

export function authenticateCookie(sessionId: string, user: string): void {
  const s = sessionFor(sessionId);
  s.user = user;
  s.via = "cookie";
}

/** The signed-in user for a request, or null. */
export function currentUser(sessionId: string): string | null {
  return sessions.get(sessionId)?.user ?? null;
}

/** Logout: the client drops its token; the server forgets the token. */
export function logout(clientStorage: { removeItem(key: string): void }): void {
  clientStorage.removeItem("token");
}
