/* ==========================================================================
   GET  /api/v1/todolists/:listId/todos  -- List todos in a list
   POST /api/v1/todolists/:listId/todos  -- Create a todo in a list
   ========================================================================== */

import { NextRequest } from "next/server";

import {
  successResponse,
  createdResponse,
  handleRouteError,
} from "@/server/shared/http-response";
import {
  listIdParamSchema,
  createTodoSchema,
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
    const todos = await service.getTodosByListId(listId);
    return successResponse(todos);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(
  request: NextRequest,
  context: RouteContext,
) {
  try {
    const { listId } = listIdParamSchema.parse(await context.params);
    const body: unknown = await request.json();
    const input = createTodoSchema.parse(body);
    const todo = await service.createTodo(listId, input);
    return createdResponse(todo);
  } catch (error) {
    return handleRouteError(error);
  }
}
