/* ==========================================================================
   Standard HTTP Response Envelope
   ========================================================================== */

import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { HttpError } from "./http-errors";

/**
 * Pagination metadata included in list responses.
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Standard response envelope shape.
 *
 * - Success: `{ data, meta? }`
 * - Error:   `{ error: { message, details? } }`
 */
export interface ApiResponseEnvelope<T = unknown> {
  data?: T;
  error?: {
    message: string;
    details?: unknown;
  };
  meta?: PaginationMeta;
}

/* --------------------------------------------------------------------------
   Success helpers
   -------------------------------------------------------------------------- */

/**
 * Return a success response with data and optional pagination metadata.
 */
export function successResponse<T>(
  data: T,
  options?: { status?: number; meta?: PaginationMeta },
): NextResponse<ApiResponseEnvelope<T>> {
  const body: ApiResponseEnvelope<T> = { data };
  if (options?.meta) {
    body.meta = options.meta;
  }
  return NextResponse.json(body, { status: options?.status ?? 200 });
}

/**
 * Return a 201 Created response.
 */
export function createdResponse<T>(
  data: T,
): NextResponse<ApiResponseEnvelope<T>> {
  return successResponse(data, { status: 201 });
}

/**
 * Return a 204 No Content response (for successful deletions).
 */
export function noContentResponse(): NextResponse {
  return new NextResponse(null, { status: 204 });
}

/* --------------------------------------------------------------------------
   Error helpers
   -------------------------------------------------------------------------- */

/**
 * Return a structured error response.
 */
export function errorResponse(
  statusCode: number,
  message: string,
  details?: unknown,
): NextResponse<ApiResponseEnvelope<never>> {
  const body: ApiResponseEnvelope<never> = {
    error: { message, ...(details !== undefined && { details }) },
  };
  return NextResponse.json(body, { status: statusCode });
}

/**
 * Catch-all error handler for route handlers.
 * Converts known error types into structured envelope responses.
 */
export function handleRouteError(
  error: unknown,
): NextResponse<ApiResponseEnvelope<never>> {
  // Known HTTP errors from service/repository layer
  if (error instanceof HttpError) {
    return errorResponse(error.statusCode, error.message);
  }

  // Zod validation errors
  if (error instanceof ZodError) {
    return errorResponse(400, "Validation failed", error.flatten().fieldErrors);
  }

  // Unexpected errors -- log and return generic 500
  console.error("Unhandled route error:", error);
  return errorResponse(500, "Internal server error");
}
