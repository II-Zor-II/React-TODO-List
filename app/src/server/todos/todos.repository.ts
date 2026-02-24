/* ==========================================================================
   Todo Repository
   Pure data-access layer -- no business logic.
   ========================================================================== */

import { prisma } from "@/lib/prisma";
import type { Prisma, TodoList, Todo, TodoStatus } from "@prisma/client";

import type {
  CreateTodoListInput,
  PatchTodoListInput,
  ReplaceTodoListInput,
  CreateTodoInput,
  PatchTodoInput,
  ReplaceTodoInput,
  SortDirection,
} from "./todos.types";

/* --------------------------------------------------------------------------
   Soft-delete filter -- reusable WHERE clause
   -------------------------------------------------------------------------- */

const notDeleted = { deletedAt: null } as const;

/* ==========================================================================
   TodoList Repository
   ========================================================================== */

/**
 * Find all non-deleted todo lists, ordered by creation date (newest first).
 */
export async function findAllTodoLists(): Promise<TodoList[]> {
  return prisma.todoList.findMany({
    where: notDeleted,
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Find a single non-deleted todo list by ID.
 */
export async function findTodoListById(id: string): Promise<TodoList | null> {
  return prisma.todoList.findFirst({
    where: { id, ...notDeleted },
  });
}

/**
 * Create a new todo list.
 */
export async function createTodoList(input: CreateTodoListInput): Promise<TodoList> {
  return prisma.todoList.create({
    data: {
      name: input.name,
      description: input.description ?? null,
    },
  });
}

/**
 * Partial update of a todo list.
 */
export async function updateTodoList(
  id: string,
  input: PatchTodoListInput,
): Promise<TodoList> {
  return prisma.todoList.update({
    where: { id },
    data: input,
  });
}

/**
 * Full replacement of a todo list.
 */
export async function replaceTodoList(
  id: string,
  input: ReplaceTodoListInput,
): Promise<TodoList> {
  return prisma.todoList.update({
    where: { id },
    data: input,
  });
}

/**
 * Soft-delete a todo list and all its todos in a single transaction.
 */
export async function softDeleteTodoList(id: string): Promise<void> {
  const now = new Date();
  await prisma.$transaction([
    prisma.todo.updateMany({
      where: { todoListId: id, ...notDeleted },
      data: { deletedAt: now },
    }),
    prisma.todoList.update({
      where: { id },
      data: { deletedAt: now },
    }),
  ]);
}

/* ==========================================================================
   Todo Repository
   ========================================================================== */

/**
 * Find all non-deleted todos for a given list.
 */
export async function findTodosByListId(listId: string): Promise<Todo[]> {
  return prisma.todo.findMany({
    where: { todoListId: listId, ...notDeleted },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Find a single non-deleted todo by ID.
 */
export async function findTodoById(id: string): Promise<Todo | null> {
  return prisma.todo.findFirst({
    where: { id, ...notDeleted },
  });
}

/**
 * Create a new todo in a list.
 */
export async function createTodo(
  listId: string,
  input: CreateTodoInput,
): Promise<Todo> {
  return prisma.todo.create({
    data: {
      title: input.title,
      description: input.description ?? null,
      status: input.status ?? "TODO",
      priority: input.priority ?? null,
      dueDate: input.dueDate ?? null,
      todoListId: listId,
    },
  });
}

/**
 * Partial update of a todo.
 */
export async function updateTodo(
  id: string,
  input: PatchTodoInput,
): Promise<Todo> {
  return prisma.todo.update({
    where: { id },
    data: input,
  });
}

/**
 * Full replacement of a todo.
 */
export async function replaceTodo(
  id: string,
  input: ReplaceTodoInput,
): Promise<Todo> {
  return prisma.todo.update({
    where: { id },
    data: input,
  });
}

/**
 * Soft-delete a single todo.
 */
export async function softDeleteTodo(id: string): Promise<void> {
  await prisma.todo.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
}

/* ==========================================================================
   Board Repository
   ========================================================================== */

/**
 * Count non-deleted todo lists, optionally filtered by search term.
 */
export async function countTodoLists(search?: string): Promise<number> {
  const where: Prisma.TodoListWhereInput = { ...notDeleted };
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }
  return prisma.todoList.count({ where });
}

/**
 * Get paginated todo lists with optional search, sort, and per-list todo
 * status counts.
 *
 * The `sortBy = "totalTodos"` case is handled in the service layer because
 * Prisma does not support ordering by aggregated relation counts inline.
 * This function handles database-column sorts only.
 */
export async function findBoardTodoLists(params: {
  search?: string;
  sortBy: "name" | "createdAt" | "updatedAt";
  sortDirection: SortDirection;
  skip: number;
  take: number;
}): Promise<
  (TodoList & { todos: { status: TodoStatus }[] })[]
> {
  const where: Prisma.TodoListWhereInput = { ...notDeleted };
  if (params.search) {
    where.OR = [
      { name: { contains: params.search, mode: "insensitive" } },
      { description: { contains: params.search, mode: "insensitive" } },
    ];
  }

  return prisma.todoList.findMany({
    where,
    orderBy: { [params.sortBy]: params.sortDirection },
    skip: params.skip,
    take: params.take,
    include: {
      todos: {
        where: notDeleted,
        select: { status: true },
      },
    },
  });
}

/**
 * Fetch ALL matching (non-paginated) todo lists with todo statuses.
 * Used when sorting by totalTodos, which requires in-memory sort.
 */
export async function findAllBoardTodoListsForSort(params: {
  search?: string;
}): Promise<
  (TodoList & { todos: { status: TodoStatus }[] })[]
> {
  const where: Prisma.TodoListWhereInput = { ...notDeleted };
  if (params.search) {
    where.OR = [
      { name: { contains: params.search, mode: "insensitive" } },
      { description: { contains: params.search, mode: "insensitive" } },
    ];
  }

  return prisma.todoList.findMany({
    where,
    include: {
      todos: {
        where: notDeleted,
        select: { status: true },
      },
    },
  });
}
