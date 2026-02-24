/* ==========================================================================
   API Types
   ==========================================================================
   Frontend-side types for the REST v1 API envelope and domain DTOs.
   These types mirror the backend response shapes exactly.
   ========================================================================== */

/* --------------------------------------------------------------------------
   API Envelope
   -------------------------------------------------------------------------- */

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Standard API response envelope.
 * Success responses have `data` (and optionally `meta`).
 * Error responses have `error` with a message and optional details.
 */
export interface ApiEnvelope<T = unknown> {
  data?: T;
  error?: {
    message: string;
    details?: unknown;
  };
  meta?: PaginationMeta;
}

/**
 * Typed error thrown when the API returns an error envelope.
 */
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/* --------------------------------------------------------------------------
   Domain DTOs (matching backend response shapes)
   -------------------------------------------------------------------------- */

export type TodoStatus = "TODO" | "IN_PROGRESS" | "DONE";
export type TodoPriority = "LOW" | "MEDIUM" | "HIGH";

/**
 * TodoList as returned by the API.
 * Date fields arrive as ISO-8601 strings from JSON serialization.
 */
export interface TodoListDto {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Todo as returned by the API.
 * Date fields arrive as ISO-8601 strings from JSON serialization.
 */
export interface TodoDto {
  id: string;
  title: string;
  description: string | null;
  status: TodoStatus;
  priority: TodoPriority | null;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  todoListId: string;
}

/**
 * Board item as returned by GET /api/v1/board/todolists.
 */
export interface TodoStatusCounts {
  TODO: number;
  IN_PROGRESS: number;
  DONE: number;
}

export interface BoardTodoListDto {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  statusCounts: TodoStatusCounts;
  totalTodos: number;
}

/* --------------------------------------------------------------------------
   Mutation Input DTOs
   -------------------------------------------------------------------------- */

export interface CreateTodoListInput {
  name: string;
  description?: string | null;
}

export interface PatchTodoListInput {
  name?: string;
  description?: string | null;
}

export interface CreateTodoInput {
  title: string;
  description?: string | null;
  status?: TodoStatus;
  priority?: TodoPriority | null;
  dueDate?: string | null;
}

export interface PatchTodoInput {
  title?: string;
  description?: string | null;
  status?: TodoStatus;
  priority?: TodoPriority | null;
  dueDate?: string | null;
}
