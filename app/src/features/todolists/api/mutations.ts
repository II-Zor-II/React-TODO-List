/* ==========================================================================
   TodoList Mutation Hooks
   ========================================================================== */

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api/client";
import { mapTodoList } from "@/lib/api/mappers";
import type { TodoListDto, CreateTodoListInput, PatchTodoListInput } from "@/lib/api/types";
import { todoListKeys } from "./queries";
import type { TodoList } from "../types";

/* --------------------------------------------------------------------------
   Create TodoList
   -------------------------------------------------------------------------- */

export function useCreateTodoList() {
  const queryClient = useQueryClient();

  return useMutation<TodoList, Error, CreateTodoListInput>({
    mutationFn: async (input) => {
      const dto = await apiFetch<TodoListDto>("/todolists", {
        method: "POST",
        body: JSON.stringify(input),
      });
      return mapTodoList(dto);
    },
    onSuccess: () => {
      // Invalidate all board queries so the new list appears
      queryClient.invalidateQueries({ queryKey: todoListKeys.all });
    },
  });
}

/* --------------------------------------------------------------------------
   Update TodoList (PATCH)
   -------------------------------------------------------------------------- */

export function usePatchTodoList() {
  const queryClient = useQueryClient();

  return useMutation<TodoList, Error, { listId: string; input: PatchTodoListInput }>({
    mutationFn: async ({ listId, input }) => {
      const dto = await apiFetch<TodoListDto>(`/todolists/${listId}`, {
        method: "PATCH",
        body: JSON.stringify(input),
      });
      return mapTodoList(dto);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: todoListKeys.all });
      queryClient.invalidateQueries({
        queryKey: todoListKeys.detail(variables.listId),
      });
    },
  });
}

/* --------------------------------------------------------------------------
   Delete TodoList
   -------------------------------------------------------------------------- */

export function useDeleteTodoList() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (listId) => {
      await apiFetch<void>(`/todolists/${listId}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todoListKeys.all });
    },
  });
}
