"use client";

import { Input } from "@/components/ui/input";

/* --------------------------------------------------------------------------
   Props
   -------------------------------------------------------------------------- */

interface BoardToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: string;
  onSortByChange: (value: string) => void;
  sortDirection: "asc" | "desc";
  onSortDirectionToggle: () => void;
}

/* --------------------------------------------------------------------------
   Sort options
   -------------------------------------------------------------------------- */

const SORT_OPTIONS = [
  { value: "createdAt", label: "Date Created" },
  { value: "updatedAt", label: "Last Updated" },
  { value: "name", label: "Name" },
  { value: "totalTodos", label: "Total Tasks" },
];

/* --------------------------------------------------------------------------
   Component
   -------------------------------------------------------------------------- */

export function BoardToolbar({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortByChange,
  sortDirection,
  onSortDirectionToggle,
}: BoardToolbarProps) {
  return (
    <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Search */}
      <div className="relative w-full sm:max-w-xs">
        <label htmlFor="board-search" className="sr-only">
          Search lists
        </label>
        <Input
          id="board-search"
          type="search"
          placeholder="Search lists..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pr-8"
        />
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="8.5" cy="8.5" r="5.5" />
          <path d="M13 13l4 4" />
        </svg>
      </div>

      {/* Sort controls */}
      <div className="flex items-center gap-2">
        <label htmlFor="board-sort" className="sr-only">
          Sort by
        </label>
        <select
          id="board-sort"
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value)}
          className="h-10 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring cursor-pointer"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={onSortDirectionToggle}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface text-text-muted transition-colors duration-150 hover:bg-surface-alt hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring cursor-pointer"
          aria-label={`Sort ${sortDirection === "asc" ? "ascending" : "descending"}`}
          title={sortDirection === "asc" ? "Ascending" : "Descending"}
        >
          <svg
            aria-hidden="true"
            className="h-4 w-4"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {sortDirection === "asc" ? (
              <>
                <path d="M8 12V4" />
                <path d="M4 7l4-4 4 4" />
              </>
            ) : (
              <>
                <path d="M8 4v8" />
                <path d="M4 9l4 4 4-4" />
              </>
            )}
          </svg>
        </button>
      </div>
    </div>
  );
}
