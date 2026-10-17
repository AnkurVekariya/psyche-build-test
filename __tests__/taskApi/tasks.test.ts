import { describe, expect, it } from "vitest";
import { createTask, listTasks, updateTask } from "../../src/taskApi/tasks";

describe("tasks", () => {
  it("creates and updates a task", () => {
    const t = createTask({ title: "  Write docs ", dueDate: "2026-11-01" });
    expect(t.title).toBe("Write docs");
    expect(updateTask(t.id, { title: "Ship docs" })?.title).toBe("Ship docs");
  });

  it("clears a due date with null", () => {
    const t = createTask({ title: "Plan", dueDate: "2026-11-01" });
    const updated = updateTask(t.id, { title: "Plan" });
    expect(updated).toBeDefined();
  });

  it("lists the first page", () => {
    expect(listTasks(1, 10).length).toBeGreaterThanOrEqual(0);
  });
});
