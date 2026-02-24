/* ==========================================================================
   API Client
   ==========================================================================
   Generic fetch wrapper that consumes the standard API response envelope
   ({ data, error, meta }) and returns typed results.
   ========================================================================== */

import type { ApiEnvelope, PaginationMeta } from "./types";
import { ApiError } from "./types";

/* --------------------------------------------------------------------------
   Base URL
   -------------------------------------------------------------------------- */

const API_BASE = "/api/v1";

/* --------------------------------------------------------------------------
   Response type for paginated endpoints
   -------------------------------------------------------------------------- */

export interface PaginatedResult<T> {
  data: T;
  meta: PaginationMeta;
}

/* --------------------------------------------------------------------------
   Core fetch wrapper
   -------------------------------------------------------------------------- */

/**
 * Make a typed request to the v1 API.
 *
 * - Automatically prefixes the path with `/api/v1`
 * - Parses the standard envelope and extracts `data`
 * - Throws `ApiError` on error responses or non-OK status codes
 * - Sets `Content-Type: application/json` for requests with a body
 */
export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE}${path}`;

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> | undefined),
  };

  if (options.body) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // 204 No Content -- successful deletion, no body to parse
  if (response.status === 204) {
    return undefined as T;
  }

  const envelope: ApiEnvelope<T> = await response.json();

  if (!response.ok || envelope.error) {
    throw new ApiError(
      response.status,
      envelope.error?.message ?? "An unexpected error occurred",
      envelope.error?.details,
    );
  }

  return envelope.data as T;
}

/**
 * Make a typed request that returns paginated results.
 * Returns both `data` and `meta` from the envelope.
 */
export async function apiFetchPaginated<T>(
  path: string,
  options: RequestInit = {},
): Promise<PaginatedResult<T>> {
  const url = `${API_BASE}${path}`;

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> | undefined),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const envelope: ApiEnvelope<T> = await response.json();

  if (!response.ok || envelope.error) {
    throw new ApiError(
      response.status,
      envelope.error?.message ?? "An unexpected error occurred",
      envelope.error?.details,
    );
  }

  return {
    data: envelope.data as T,
    meta: envelope.meta as PaginationMeta,
  };
}
