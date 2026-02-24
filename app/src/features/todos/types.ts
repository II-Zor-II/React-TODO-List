/* ==========================================================================
   Todo Domain Types
   ========================================================================== */

export type Priority = "low" | "medium" | "high";

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  priority: Priority;
}

/** Filter tabs for the todo list */
export type FilterStatus = "all" | "active" | "completed";
