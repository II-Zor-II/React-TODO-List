/* ==========================================================================
   Todo Mutation Hooks
   ========================================================================== */

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api/client";
import { mapTodo } from "@/lib/api/mappers";
import type { TodoDto, CreateTodoInput, PatchTodoInput } from "@/lib/api/types";
import { todoKeys } from "./queries";
import { todoListKeys } from "@/features/todolists/api/queries";
import type { Todo } from "../types";

/* --------------------------------------------------------------------------
   Create Todo
   -------------------------------------------------------------------------- */

export function useCreateTodo(listId: string) {
  const queryClient = useQueryClient();

  return useMutation<Todo, Error, CreateTodoInput>({
    mutationFn: async (input) => {
      const dto = await apiFetch<TodoDto>(`/todolists/${listId}/todos`, {
        method: "POST",
        body: JSON.stringify(input),
      });
      return mapTodo(dto);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todoKeys.byList(listId) });
      // Also invalidate board queries so status counts update
      queryClient.invalidateQueries({ queryKey: todoListKeys.all });
    },
  });
}

/* --------------------------------------------------------------------------
   Update Todo (PATCH)
   -------------------------------------------------------------------------- */

export function usePatchTodo(listId: string) {
  const queryClient = useQueryClient();

  return useMutation<Todo, Error, { todoId: string; input: PatchTodoInput }>({
    mutationFn: async ({ todoId, input }) => {
      const dto = await apiFetch<TodoDto>(`/todos/${todoId}`, {
        method: "PATCH",
        body: JSON.stringify(input),
      });
      return mapTodo(dto);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todoKeys.byList(listId) });
      queryClient.invalidateQueries({ queryKey: todoListKeys.all });
    },
  });
}

/* --------------------------------------------------------------------------
   Delete Todo
   -------------------------------------------------------------------------- */

export function useDeleteTodo(listId: string) {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (todoId) => {
      await apiFetch<void>(`/todos/${todoId}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todoKeys.byList(listId) });
      queryClient.invalidateQueries({ queryKey: todoListKeys.all });
    },
  });
}
