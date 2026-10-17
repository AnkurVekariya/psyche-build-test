export type Task = { id: number; title: string; description: string | null; dueDate: string | null; done: boolean };
export type TaskInput = { title: string; description?: string | null; dueDate?: string | null };

const tasks: Task[] = [];
let nextId = 1;

export function createTask(input: TaskInput): Task {
  const task: Task = {
    id: nextId++,
    title: input.title.trim(),
    description: input.description === undefined ? null : input.description.trim(),
    dueDate: input.dueDate ?? null,
    done: false,
  };
  tasks.push(task);
  return task;
}

/** Partial update: a field left out keeps its value; null clears it. */
export function updateTask(id: number, input: Partial<TaskInput>): Task | undefined {
  const task = tasks.find((t) => t.id === id);
  if (!task) return undefined;
  if (input.title !== undefined) task.title = input.title.trim();
  if (input.dueDate !== undefined) task.dueDate = input.dueDate === null ? null : input.dueDate.trim();
  if (input.description !== undefined) task.description = input.description === null ? null : input.description.trim();
  return task;
}

/** One page of tasks, pages numbered from 1. */
export function listTasks(page: number, size: number): Task[] {
  const start = (page - 1) * size;
  return tasks.slice(start, start + size);
}
