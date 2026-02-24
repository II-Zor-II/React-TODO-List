/* ==========================================================================
   Todo Domain Types (Frontend)
   ==========================================================================
   Aligned with backend Prisma models and API DTOs.
   ========================================================================== */

export type TodoStatus = "TODO" | "IN_PROGRESS" | "DONE";
export type TodoPriority = "LOW" | "MEDIUM" | "HIGH";

export interface Todo {
  id: string;
  title: string;
  description: string | null;
  status: TodoStatus;
  priority: TodoPriority | null;
  dueDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  todoListId: string;
}

/** Filter tabs for the todo list -- includes "all" plus backend status values */
export type FilterStatus = "all" | TodoStatus;
