"use client";

import { useState, useCallback } from "react";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { FontToggle } from "@/components/font/font-toggle";
import { Button } from "@/components/ui/button";
import { useBoardTodoLists } from "@/features/todolists/api/queries";
import { BoardCard } from "@/features/todolists/components/board-card";
import { BoardToolbar } from "@/features/todolists/components/board-toolbar";
import { BoardPagination } from "@/features/todolists/components/board-pagination";
import { CreateListModal } from "@/features/todolists/components/create-list-modal";

/* --------------------------------------------------------------------------
   Page Component
   -------------------------------------------------------------------------- */

export default function HomePage() {
  /* --- Board state --- */
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  /* --- Debounced search: reset to page 1 on search change --- */
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    setPage(1);
  }, []);

  const handleSortByChange = useCallback((value: string) => {
    setSortBy(value);
    setPage(1);
  }, []);

  const handleSortDirectionToggle = useCallback(() => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    setPage(1);
  }, []);

  /* --- Data fetching --- */
  const { data, isLoading, isError, error } = useBoardTodoLists({
    search: searchQuery || undefined,
    sortBy: sortBy as "name" | "createdAt" | "updatedAt" | "totalTodos",
    sortDirection,
    page,
    limit: 20,
  });

  /* --- Render --- */

  return (
    <section aria-labelledby="app-heading" className="flex flex-col gap-6">
      {/* Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1
            id="app-heading"
            className="text-2xl font-bold tracking-tight text-text sm:text-3xl"
          >
            My Lists
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            Organize your tasks into lists
          </p>
        </div>
        <div className="flex items-center gap-2">
          <FontToggle />
          <ThemeToggle />
        </div>
      </header>

      {/* Toolbar: search + sort + create */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <BoardToolbar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          sortBy={sortBy}
          onSortByChange={handleSortByChange}
          sortDirection={sortDirection}
          onSortDirectionToggle={handleSortDirectionToggle}
        />
        <Button onClick={() => setIsCreateModalOpen(true)}>
          + New List
        </Button>
      </div>

      {/* Board content */}
      {isLoading && (
        <div
          role="status"
          className="flex items-center justify-center py-12"
        >
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-primary" />
          <span className="sr-only">Loading lists...</span>
        </div>
      )}

      {isError && (
        <div
          role="alert"
          className="rounded-lg border border-error/30 bg-error-light p-6 text-center"
        >
          <p className="font-medium text-error">Failed to load lists</p>
          <p className="mt-1 text-sm text-text-muted">
            {error.message}
          </p>
        </div>
      )}

      {data && data.items.length === 0 && (
        <div
          role="status"
          className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border px-6 py-12 text-center"
        >
          <p className="text-lg font-medium text-text-muted">
            No lists found
          </p>
          <p className="text-sm text-text-muted">
            {searchQuery
              ? "Try a different search term."
              : "Create your first list to get started."}
          </p>
        </div>
      )}

      {data && data.items.length > 0 && (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            {data.items.map((list) => (
              <BoardCard key={list.id} list={list} />
            ))}
          </div>

          <BoardPagination meta={data.meta} onPageChange={setPage} />
        </>
      )}

      {/* Create list modal */}
      <CreateListModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </section>
  );
}
