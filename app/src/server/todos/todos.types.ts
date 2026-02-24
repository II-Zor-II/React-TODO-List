/* ==========================================================================
   Server-side Todo Domain Types
   ========================================================================== */

import type { TodoStatus, TodoPriority } from "@prisma/client";

/* --------------------------------------------------------------------------
   Shared sort direction
   -------------------------------------------------------------------------- */

export type SortDirection = "asc" | "desc";

/* --------------------------------------------------------------------------
   TodoList types
   -------------------------------------------------------------------------- */

export interface CreateTodoListInput {
  name: string;
  description?: string | null;
}

/** PATCH -- all fields optional */
export interface PatchTodoListInput {
  name?: string;
  description?: string | null;
}

/** PUT -- all required fields present */
export interface ReplaceTodoListInput {
  name: string;
  description: string | null;
}

/* --------------------------------------------------------------------------
   Todo types
   -------------------------------------------------------------------------- */

export interface CreateTodoInput {
  title: string;
  description?: string | null;
  status?: TodoStatus;
  priority?: TodoPriority | null;
  dueDate?: Date | null;
}

/** PATCH -- all fields optional */
export interface PatchTodoInput {
  title?: string;
  description?: string | null;
  status?: TodoStatus;
  priority?: TodoPriority | null;
  dueDate?: Date | null;
}

/** PUT -- all required fields present */
export interface ReplaceTodoInput {
  title: string;
  description: string | null;
  status: TodoStatus;
  priority: TodoPriority | null;
  dueDate: Date | null;
}

/* --------------------------------------------------------------------------
   Board types
   -------------------------------------------------------------------------- */

export interface TodoStatusCounts {
  TODO: number;
  IN_PROGRESS: number;
  DONE: number;
}

export interface BoardTodoList {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  statusCounts: TodoStatusCounts;
  totalTodos: number;
}

export interface BoardFilters {
  search?: string;
  sortBy?: "name" | "createdAt" | "updatedAt" | "totalTodos";
  sortDirection?: SortDirection;
}
