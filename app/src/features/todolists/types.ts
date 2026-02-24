/* ==========================================================================
   TodoList Domain Types (Frontend)
   ==========================================================================
   Aligned with backend Prisma models and API DTOs.
   ========================================================================== */

import type { TodoStatusCounts } from "@/lib/api/types";

export interface TodoList {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
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
