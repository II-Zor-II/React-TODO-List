/* ==========================================================================
   GET    /api/v1/todos/:todoId  -- Get a single todo
   PATCH  /api/v1/todos/:todoId  -- Partial update
   PUT    /api/v1/todos/:todoId  -- Full replacement
   DELETE /api/v1/todos/:todoId  -- Soft-delete
   ========================================================================== */

import { NextRequest } from "next/server";

import {
  successResponse,
  noContentResponse,
  handleRouteError,
} from "@/server/shared/http-response";
import {
  todoIdParamSchema,
  patchTodoSchema,
  replaceTodoSchema,
} from "@/server/todos/todos.validators";
import * as service from "@/server/todos/todos.service";

interface RouteContext {
  params: Promise<{ todoId: string }>;
}

export async function GET(
  _request: NextRequest,
  context: RouteContext,
) {
  try {
    const { todoId } = todoIdParamSchema.parse(await context.params);
    const todo = await service.getTodoById(todoId);
    return successResponse(todo);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function PATCH(
  request: NextRequest,
  context: RouteContext,
) {
  try {
    const { todoId } = todoIdParamSchema.parse(await context.params);
    const body: unknown = await request.json();
    const input = patchTodoSchema.parse(body);
    const todo = await service.patchTodo(todoId, input);
    return successResponse(todo);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function PUT(
  request: NextRequest,
  context: RouteContext,
) {
  try {
    const { todoId } = todoIdParamSchema.parse(await context.params);
    const body: unknown = await request.json();
    const input = replaceTodoSchema.parse(body);
    const todo = await service.replaceTodo(todoId, input);
    return successResponse(todo);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(
  _request: NextRequest,
  context: RouteContext,
) {
  try {
    const { todoId } = todoIdParamSchema.parse(await context.params);
    await service.deleteTodo(todoId);
    return noContentResponse();
  } catch (error) {
    return handleRouteError(error);
  }
}
