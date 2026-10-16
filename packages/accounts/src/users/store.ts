import type { User } from "./model.js";

/** Rows as the database driver returns them. */
type Row = Record<string, any>;

const rows = new Map<string, Row>();

export function saveUser(user: User): void {
  rows.set(user.email, { ...user });
}

/** The user row for an email, as stored. */
export function findByEmail(email: string): Row | undefined {
  return rows.get(email);
}

export function findById(id: string): Row | undefined {
  return [...rows.values()].find((r) => r.id === id);
}
