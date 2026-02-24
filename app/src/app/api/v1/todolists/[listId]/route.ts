/* ==========================================================================
   GET    /api/v1/todolists/:listId  -- Get a single todo list
   PATCH  /api/v1/todolists/:listId  -- Partial update
   PUT    /api/v1/todolists/:listId  -- Full replacement
   DELETE /api/v1/todolists/:listId  -- Soft-delete list + its todos
   ========================================================================== */

import { NextRequest } from "next/server";

import {
  successResponse,
  noContentResponse,
  handleRouteError,
} from "@/server/shared/http-response";
import {
  listIdParamSchema,
  patchTodoListSchema,
  replaceTodoListSchema,
} from "@/server/todos/todos.validators";
import * as service from "@/server/todos/todos.service";

interface RouteContext {
  params: Promise<{ listId: string }>;
}

export async function GET(
  _request: NextRequest,
  context: RouteContext,
) {
  try {
    const { listId } = listIdParamSchema.parse(await context.params);
    const list = await service.getTodoListById(listId);
    return successResponse(list);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function PATCH(
  request: NextRequest,
  context: RouteContext,
) {
  try {
    const { listId } = listIdParamSchema.parse(await context.params);
    const body: unknown = await request.json();
    const input = patchTodoListSchema.parse(body);
    const list = await service.patchTodoList(listId, input);
    return successResponse(list);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function PUT(
  request: NextRequest,
  context: RouteContext,
) {
  try {
    const { listId } = listIdParamSchema.parse(await context.params);
    const body: unknown = await request.json();
    const input = replaceTodoListSchema.parse(body);
    const list = await service.replaceTodoList(listId, input);
    return successResponse(list);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(
  _request: NextRequest,
  context: RouteContext,
) {
  try {
    const { listId } = listIdParamSchema.parse(await context.params);
    await service.deleteTodoList(listId);
    return noContentResponse();
  } catch (error) {
    return handleRouteError(error);
  }
}
