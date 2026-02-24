/* ==========================================================================
   GET  /api/v1/todolists  -- List all todo lists
   POST /api/v1/todolists  -- Create a new todo list
   ========================================================================== */

import { NextRequest } from "next/server";

import {
  successResponse,
  createdResponse,
  handleRouteError,
} from "@/server/shared/http-response";
import { createTodoListSchema } from "@/server/todos/todos.validators";
import * as service from "@/server/todos/todos.service";

export async function GET() {
  try {
    const lists = await service.getAllTodoLists();
    return successResponse(lists);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    const input = createTodoListSchema.parse(body);
    const list = await service.createTodoList(input);
    return createdResponse(list);
  } catch (error) {
    return handleRouteError(error);
  }
}
