export interface User {
  id: string;
  email: string;
  passwordHash: string;
  /** When the user confirmed their email; null until they do. */
  emailVerifiedAt: Date | null;
  createdAt: Date;
}
