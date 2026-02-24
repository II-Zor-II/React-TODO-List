/* ==========================================================================
   API Types
   ==========================================================================
   Frontend-side types for the REST v1 API envelope.
   ========================================================================== */

/* --------------------------------------------------------------------------
   API Envelope
   -------------------------------------------------------------------------- */

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Standard API response envelope.
 * Success responses have `data` (and optionally `meta`).
 * Error responses have `error` with a message and optional details.
 */
export interface ApiEnvelope<T = unknown> {
  data?: T;
  error?: {
    message: string;
    details?: unknown;
  };
  meta?: PaginationMeta;
}

/**
 * Typed error thrown when the API returns an error envelope.
 */
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}
