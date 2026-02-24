/* ==========================================================================
   API Mappers
   ==========================================================================
   Transform raw API DTOs (with ISO-8601 date strings) into frontend models
   (with native Date objects).
   ========================================================================== */

import type {
  TodoListDto,
  TodoDto,
  BoardTodoListDto,
} from "./types";

import type { Todo } from "@/features/todos/types";
import type { TodoList, BoardTodoList } from "@/features/todolists/types";

/* --------------------------------------------------------------------------
   TodoList mappers
   -------------------------------------------------------------------------- */

export function mapTodoList(dto: TodoListDto): TodoList {
  return {
    id: dto.id,
    name: dto.name,
    description: dto.description,
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
  };
}

/* --------------------------------------------------------------------------
   Board TodoList mappers
   -------------------------------------------------------------------------- */

export function mapBoardTodoList(dto: BoardTodoListDto): BoardTodoList {
  return {
    id: dto.id,
    name: dto.name,
    description: dto.description,
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
    statusCounts: dto.statusCounts,
    totalTodos: dto.totalTodos,
  };
}

/* --------------------------------------------------------------------------
   Todo mappers
   -------------------------------------------------------------------------- */

export function mapTodo(dto: TodoDto): Todo {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description,
    status: dto.status,
    priority: dto.priority,
    dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
    todoListId: dto.todoListId,
  };
}
