/* ==========================================================================
   Todo Query Hooks
   ========================================================================== */

import { useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api/client";
import { mapTodo } from "@/lib/api/mappers";
import type { TodoDto } from "@/lib/api/types";
import type { Todo } from "../types";

/* --------------------------------------------------------------------------
   Query Keys
   -------------------------------------------------------------------------- */

export const todoKeys = {
  all: ["todos"] as const,
  byList: (listId: string) => ["todos", "list", listId] as const,
  detail: (todoId: string) => ["todos", todoId] as const,
};

/* --------------------------------------------------------------------------
   Todos by List
   -------------------------------------------------------------------------- */

export function useTodosByListId(listId: string) {
  return useQuery<Todo[]>({
    queryKey: todoKeys.byList(listId),
    queryFn: async () => {
      const dtos = await apiFetch<TodoDto[]>(`/todolists/${listId}/todos`);
      return dtos.map(mapTodo);
    },
    enabled: !!listId,
  });
}
