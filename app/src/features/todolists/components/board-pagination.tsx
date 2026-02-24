"use client";

import { Button } from "@/components/ui/button";
import type { PaginationMeta } from "@/lib/api/types";

/* --------------------------------------------------------------------------
   Props
   -------------------------------------------------------------------------- */

interface BoardPaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

/* --------------------------------------------------------------------------
   Component
   -------------------------------------------------------------------------- */

export function BoardPagination({ meta, onPageChange }: BoardPaginationProps) {
  if (meta.totalPages <= 1) return null;

  return (
    <nav
      aria-label="Board pagination"
      className="flex items-center justify-between gap-4"
    >
      <p className="text-sm text-text-muted">
        Page {meta.page} of {meta.totalPages}
        {" \u00B7 "}
        {meta.total} {meta.total === 1 ? "list" : "lists"}
      </p>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(meta.page - 1)}
          disabled={meta.page <= 1}
          aria-label="Previous page"
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(meta.page + 1)}
          disabled={meta.page >= meta.totalPages}
          aria-label="Next page"
        >
          Next
        </Button>
      </div>
    </nav>
  );
}
