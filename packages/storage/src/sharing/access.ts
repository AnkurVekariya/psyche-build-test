import type { StoredFile } from "../uploads/handler.js";

export interface Viewer {
  id: string;
  email: string;
  workspaceId: string;
  role: "admin" | "member";
}

/** Whether the viewer may open the file. */
export function canView(viewer: Viewer, file: StoredFile): boolean {
  if (viewer.role === "admin") return true;
  if (file.workspaceId !== viewer.workspaceId) return false;
  return file.ownerId === viewer.id || file.sharedWith.includes(viewer.email);
}
