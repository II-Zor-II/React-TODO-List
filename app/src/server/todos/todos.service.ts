/* ==========================================================================
   Todo Service
   Business logic and orchestration layer.
   ========================================================================== */

import type { TodoList, Todo, TodoStatus } from "@prisma/client";

import { NotFoundError } from "@/server/shared/http-errors";
import { calculateSkip, calculateTotalPages } from "@/server/shared/pagination";
import type { PaginationMeta } from "@/server/shared/http-response";

import type {
  CreateTodoListInput,
  PatchTodoListInput,
  ReplaceTodoListInput,
  CreateTodoInput,
  PatchTodoInput,
  ReplaceTodoInput,
  BoardTodoList,
  BoardFilters,
  TodoStatusCounts,
  SortDirection,
} from "./todos.types";
import * as repo from "./todos.repository";

/* ==========================================================================
   TodoList Service
   ========================================================================== */

export async function getAllTodoLists(): Promise<TodoList[]> {
  return repo.findAllTodoLists();
}

export async function getTodoListById(id: string): Promise<TodoList> {
  const list = await repo.findTodoListById(id);
  if (!list) {
    throw new NotFoundError(`Todo list with id "${id}" not found`);
  }
  return list;
}

export async function createTodoList(input: CreateTodoListInput): Promise<TodoList> {
  return repo.createTodoList(input);
}

export async function patchTodoList(
  id: string,
  input: PatchTodoListInput,
): Promise<TodoList> {
  // Verify existence before update
  await getTodoListById(id);
  return repo.updateTodoList(id, input);
}

export async function replaceTodoList(
  id: string,
  input: ReplaceTodoListInput,
): Promise<TodoList> {
  await getTodoListById(id);
  return repo.replaceTodoList(id, input);
}

export async function deleteTodoList(id: string): Promise<void> {
  await getTodoListById(id);
  await repo.softDeleteTodoList(id);
}

/* ==========================================================================
   Todo Service
   ========================================================================== */

export async function getTodosByListId(listId: string): Promise<Todo[]> {
  // Verify the list exists
  await getTodoListById(listId);
  return repo.findTodosByListId(listId);
}

export async function getTodoById(id: string): Promise<Todo> {
  const todo = await repo.findTodoById(id);
  if (!todo) {
    throw new NotFoundError(`Todo with id "${id}" not found`);
  }
  return todo;
}

export async function createTodo(
  listId: string,
  input: CreateTodoInput,
): Promise<Todo> {
  // Verify the list exists
  await getTodoListById(listId);
  return repo.createTodo(listId, input);
}

export async function patchTodo(
  id: string,
  input: PatchTodoInput,
): Promise<Todo> {
  await getTodoById(id);
  return repo.updateTodo(id, input);
}

export async function replaceTodo(
  id: string,
  input: ReplaceTodoInput,
): Promise<Todo> {
  await getTodoById(id);
  return repo.replaceTodo(id, input);
}

export async function deleteTodo(id: string): Promise<void> {
  await getTodoById(id);
  await repo.softDeleteTodo(id);
}

/* ==========================================================================
   Board Service
   ========================================================================== */

/**
 * Build per-list status counts from the included todos.
 */
function buildStatusCounts(todos: { status: TodoStatus }[]): TodoStatusCounts {
  const counts: TodoStatusCounts = { TODO: 0, IN_PROGRESS: 0, DONE: 0 };
  for (const todo of todos) {
    counts[todo.status]++;
  }
  return counts;
}

/**
 * Transform a raw DB row (with included todos) into a BoardTodoList.
 */
function toBoardTodoList(
  row: { id: string; name: string; description: string | null; createdAt: Date; updatedAt: Date; todos: { status: TodoStatus }[] },
): BoardTodoList {
  const statusCounts = buildStatusCounts(row.todos);
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    statusCounts,
    totalTodos: row.todos.length,
  };
}

export async function getBoardTodoLists(
  filters: BoardFilters & { page: number; limit: number },
): Promise<{ items: BoardTodoList[]; meta: PaginationMeta }> {
  const { search, sortBy = "createdAt", sortDirection = "desc", page, limit } = filters;

  // When sorting by totalTodos, we must fetch all matching lists, compute
  // totals in memory, sort, then paginate. For column-based sorts, Prisma
  // handles pagination directly.
  if (sortBy === "totalTodos") {
    return getBoardSortedByTotalTodos({ search, sortDirection, page, limit });
  }

  // Column-based sort -- Prisma handles ordering + pagination
  const [total, rows] = await Promise.all([
    repo.countTodoLists(search),
    repo.findBoardTodoLists({
      search,
      sortBy,
      sortDirection,
      skip: calculateSkip(page, limit),
      take: limit,
    }),
  ]);

  const items = rows.map(toBoardTodoList);

  return {
    items,
    meta: {
      page,
      limit,
      total,
      totalPages: calculateTotalPages(total, limit),
    },
  };
}

/**
 * Special-case handler: sort by totalTodos requires in-memory sort.
 */
async function getBoardSortedByTotalTodos(params: {
  search?: string;
  sortDirection: SortDirection;
  page: number;
  limit: number;
}): Promise<{ items: BoardTodoList[]; meta: PaginationMeta }> {
  const { search, sortDirection, page, limit } = params;

  const allRows = await repo.findAllBoardTodoListsForSort({ search });
  const allItems = allRows.map(toBoardTodoList);

  // Sort in memory
  allItems.sort((a, b) => {
    const diff = a.totalTodos - b.totalTodos;
    return sortDirection === "asc" ? diff : -diff;
  });

  // Paginate in memory
  const skip = calculateSkip(page, limit);
  const items = allItems.slice(skip, skip + limit);
  const total = allItems.length;

  return {
    items,
    meta: {
      page,
      limit,
      total,
      totalPages: calculateTotalPages(total, limit),
    },
  };
}
