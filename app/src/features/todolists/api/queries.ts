/* ==========================================================================
   TodoList Query Hooks
   ========================================================================== */

import { useQuery } from "@tanstack/react-query";

import { apiFetch, apiFetchPaginated } from "@/lib/api/client";
import { mapBoardTodoList, mapTodoList } from "@/lib/api/mappers";
import type { BoardTodoListDto, TodoListDto } from "@/lib/api/types";
import type { PaginationMeta } from "@/lib/api/types";
import type { BoardTodoList } from "../types";
import type { TodoList } from "../types";

/* --------------------------------------------------------------------------
   Query Keys
   -------------------------------------------------------------------------- */

export const todoListKeys = {
  all: ["todolists"] as const,
  board: (params: BoardQueryParams) => ["todolists", "board", params] as const,
  detail: (id: string) => ["todolists", id] as const,
};

/* --------------------------------------------------------------------------
   Board Query
   -------------------------------------------------------------------------- */

export interface BoardQueryParams {
  search?: string;
  sortBy?: "name" | "createdAt" | "updatedAt" | "totalTodos";
  sortDirection?: "asc" | "desc";
  page?: number;
  limit?: number;
}

interface BoardQueryResult {
  items: BoardTodoList[];
  meta: PaginationMeta;
}

function buildBoardSearchParams(params: BoardQueryParams): string {
  const searchParams = new URLSearchParams();
  if (params.search) searchParams.set("search", params.search);
  if (params.sortBy) searchParams.set("sortBy", params.sortBy);
  if (params.sortDirection) searchParams.set("sortDirection", params.sortDirection);
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  const qs = searchParams.toString();
  return qs ? `?${qs}` : "";
}

export function useBoardTodoLists(params: BoardQueryParams = {}) {
  return useQuery<BoardQueryResult>({
    queryKey: todoListKeys.board(params),
    queryFn: async () => {
      const qs = buildBoardSearchParams(params);
      const result = await apiFetchPaginated<BoardTodoListDto[]>(
        `/board/todolists${qs}`,
      );
      return {
        items: result.data.map(mapBoardTodoList),
        meta: result.meta,
      };
    },
  });
}

/* --------------------------------------------------------------------------
   Single TodoList Query
   -------------------------------------------------------------------------- */

export function useTodoList(listId: string) {
  return useQuery<TodoList>({
    queryKey: todoListKeys.detail(listId),
    queryFn: async () => {
      const dto = await apiFetch<TodoListDto>(`/todolists/${listId}`);
      return mapTodoList(dto);
    },
    enabled: !!listId,
  });
}
