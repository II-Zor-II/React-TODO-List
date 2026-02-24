"use client";

import { cn } from "@/lib/ui/cn";
import { Input } from "@/components/ui/input";
import type { FilterStatus } from "../types";

/* --------------------------------------------------------------------------
   Filter tab definitions -- aligned with backend 3-state model
   -------------------------------------------------------------------------- */

const FILTER_TABS: { value: FilterStatus; label: string }[] = [
  { value: "all", label: "All" },
  { value: "TODO", label: "Todo" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "DONE", label: "Done" },
];

/* --------------------------------------------------------------------------
   Props
   -------------------------------------------------------------------------- */

interface TodoFiltersProps {
  filter: FilterStatus;
  onFilterChange: (filter: FilterStatus) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  /** Counts for each filter status to display in labels */
  counts: Record<FilterStatus, number>;
}

/* --------------------------------------------------------------------------
   Component
   -------------------------------------------------------------------------- */

export function TodoFilters({
  filter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  counts,
}: TodoFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Filter tabs */}
      <div
        role="tablist"
        aria-label="Filter todos"
        className="inline-flex flex-wrap items-center gap-1 rounded-lg bg-surface-alt p-1"
      >
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.value}
            role="tab"
            aria-selected={filter === tab.value}
            onClick={() => onFilterChange(tab.value)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium",
              "transition-colors duration-150 cursor-pointer",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              filter === tab.value
                ? "bg-surface text-text shadow-sm"
                : "text-text-muted hover:text-text"
            )}
          >
            {tab.label}
            <span
              className={cn(
                "ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs",
                filter === tab.value
                  ? "bg-primary-light text-primary"
                  : "bg-surface-alt text-text-muted"
              )}
            >
              {counts[tab.value]}
            </span>
          </button>
        ))}
      </div>

      {/* Search input */}
      <div className="relative w-full sm:max-w-xs">
        <label htmlFor="todo-search" className="sr-only">
          Search todos
        </label>
        <Input
          id="todo-search"
          type="search"
          placeholder="Search todos..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pr-8"
        />
        {/* Search icon */}
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
    </div>
  );
}
