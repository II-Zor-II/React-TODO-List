/* ==========================================================================
   Pagination Utilities
   ========================================================================== */

import { z } from "zod";

/**
 * Default and maximum values for pagination parameters.
 */
export const PAGINATION_DEFAULTS = {
  page: 1,
  limit: 20,
  maxLimit: 100,
} as const;

/**
 * Zod schema for extracting pagination params from URL search params.
 * Coerces string query params to numbers and applies sensible defaults.
 */
export const paginationSchema = z.object({
  page: z.coerce
    .number()
    .int()
    .min(1)
    .default(PAGINATION_DEFAULTS.page),
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(PAGINATION_DEFAULTS.maxLimit)
    .default(PAGINATION_DEFAULTS.limit),
});

export type PaginationParams = z.infer<typeof paginationSchema>;

/**
 * Calculate the Prisma `skip` value from page and limit.
 */
export function calculateSkip(page: number, limit: number): number {
  return (page - 1) * limit;
}

/**
 * Calculate total pages from total items and page size.
 */
export function calculateTotalPages(total: number, limit: number): number {
  return Math.ceil(total / limit);
}
