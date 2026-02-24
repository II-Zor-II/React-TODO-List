/* ==========================================================================
   GET /api/v1/board/todolists  -- Paginated board with filter/sort/search
   ========================================================================== */

import { NextRequest } from "next/server";

import { successResponse, handleRouteError } from "@/server/shared/http-response";
import { boardQuerySchema } from "@/server/todos/todos.validators";
import * as service from "@/server/todos/todos.service";

export async function GET(request: NextRequest) {
  try {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const { search, sortBy, sortDirection, page, limit } =
      boardQuerySchema.parse(searchParams);

    const { items, meta } = await service.getBoardTodoLists({
      search,
      sortBy,
      sortDirection,
      page,
      limit,
    });

    return successResponse(items, { meta });
  } catch (error) {
    return handleRouteError(error);
  }
}
