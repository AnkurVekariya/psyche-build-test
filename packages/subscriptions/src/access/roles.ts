export type Role = "owner" | "admin" | "member";

/** Higher rank, more power. */
export const ROLE_RANK: Record<Role, number> = {
  owner: 1,
  admin: 2,
  member: 3,
};
