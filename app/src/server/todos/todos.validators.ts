/* ==========================================================================
   Zod Validation Schemas for Todo Domain
   ========================================================================== */

import { z } from "zod";
import { TodoStatus, TodoPriority } from "@prisma/client";

/* --------------------------------------------------------------------------
   Shared enum schemas
   -------------------------------------------------------------------------- */

const todoStatusSchema = z.nativeEnum(TodoStatus);
const todoPrioritySchema = z.nativeEnum(TodoPriority);

/* --------------------------------------------------------------------------
   Shared refinements
   -------------------------------------------------------------------------- */

/** Coerce an ISO-8601 string to a Date, or accept null. */
const dateOrNull = z
  .string()
  .datetime({ message: "Must be a valid ISO-8601 date string" })
  .transform((val) => new Date(val))
  .nullable();

/* --------------------------------------------------------------------------
   Route param validators
   -------------------------------------------------------------------------- */

export const listIdParamSchema = z.object({
  listId: z.string().min(1, "listId is required"),
});

export const todoIdParamSchema = z.object({
  todoId: z.string().min(1, "todoId is required"),
});

/* --------------------------------------------------------------------------
   TodoList validators
   -------------------------------------------------------------------------- */

export const createTodoListSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(255),
  description: z.string().trim().max(1000).nullable().optional(),
});

/** PATCH -- all fields optional, but at least one must be present */
export const patchTodoListSchema = z
  .object({
    name: z.string().trim().min(1, "Name must not be empty").max(255).optional(),
    description: z.string().trim().max(1000).nullable().optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    { message: "At least one field must be provided for update" },
  );

/** PUT -- all fields required */
export const replaceTodoListSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(255),
  description: z.string().trim().max(1000).nullable(),
});

/* --------------------------------------------------------------------------
   Todo validators
   -------------------------------------------------------------------------- */

export const createTodoSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(255),
  description: z.string().trim().max(2000).nullable().optional(),
  status: todoStatusSchema.optional(),
  priority: todoPrioritySchema.nullable().optional(),
  dueDate: dateOrNull.optional(),
});

/** PATCH -- all fields optional, at least one must be present */
export const patchTodoSchema = z
  .object({
    title: z.string().trim().min(1, "Title must not be empty").max(255).optional(),
    description: z.string().trim().max(2000).nullable().optional(),
    status: todoStatusSchema.optional(),
    priority: todoPrioritySchema.nullable().optional(),
    dueDate: dateOrNull.optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    { message: "At least one field must be provided for update" },
  );

/** PUT -- all fields required for full replacement */
export const replaceTodoSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(255),
  description: z.string().trim().max(2000).nullable(),
  status: todoStatusSchema,
  priority: todoPrioritySchema.nullable(),
  dueDate: dateOrNull,
});

/* --------------------------------------------------------------------------
   Board query validators
   -------------------------------------------------------------------------- */

export const boardQuerySchema = z.object({
  search: z.string().trim().max(255).optional(),
  sortBy: z
    .enum(["name", "createdAt", "updatedAt", "totalTodos"])
    .default("createdAt"),
  sortDirection: z.enum(["asc", "desc"]).default("desc"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});
