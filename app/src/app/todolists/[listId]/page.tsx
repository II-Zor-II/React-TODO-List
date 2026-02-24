"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { FontToggle } from "@/components/font/font-toggle";
import { useTodoList } from "@/features/todolists/api/queries";
import { useTodosByListId } from "@/features/todos/api/queries";
import { TodoComposer } from "@/features/todos/components/todo-composer";
import { TodoFilters } from "@/features/todos/components/todo-filters";
import { TodoList } from "@/features/todos/components/todo-list";
import type { FilterStatus } from "@/features/todos/types";

/* --------------------------------------------------------------------------
   Page Component
   -------------------------------------------------------------------------- */

export default function TodoListDetailPage() {
  const params = useParams<{ listId: string }>();
  const listId = params.listId;

  const [filter, setFilter] = useState<FilterStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");

  /* --- Data fetching --- */
  const listQuery = useTodoList(listId);
  const todosQuery = useTodosByListId(listId);

  /* --- Derived state --- */
  const counts = useMemo(() => {
    const todos = todosQuery.data ?? [];
    return {
      all: todos.length,
      TODO: todos.filter((t) => t.status === "TODO").length,
      IN_PROGRESS: todos.filter((t) => t.status === "IN_PROGRESS").length,
      DONE: todos.filter((t) => t.status === "DONE").length,
    };
  }, [todosQuery.data]);

  const filteredTodos = useMemo(() => {
    let result = todosQuery.data ?? [];

    // Status filter
    if (filter !== "all") {
      result = result.filter((t) => t.status === filter);
    }

    // Text search
    const query = searchQuery.trim().toLowerCase();
    if (query) {
      result = result.filter((t) =>
        t.title.toLowerCase().includes(query),
      );
    }

    return result;
  }, [todosQuery.data, filter, searchQuery]);

  /* --- Loading state --- */
  if (listQuery.isLoading || todosQuery.isLoading) {
    return (
      <section className="flex flex-col gap-6">
        <div role="status" className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-primary" />
          <span className="sr-only">Loading...</span>
        </div>
      </section>
    );
  }

  /* --- Error state --- */
  if (listQuery.isError) {
    return (
      <section className="flex flex-col gap-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary-hover transition-colors"
        >
          &larr; Back to lists
        </Link>
        <div
          role="alert"
          className="rounded-lg border border-error/30 bg-error-light p-6 text-center"
        >
          <p className="font-medium text-error">Failed to load list</p>
          <p className="mt-1 text-sm text-text-muted">
            {listQuery.error.message}
          </p>
        </div>
      </section>
    );
  }

  const list = listQuery.data;

  return (
    <section aria-labelledby="list-heading" className="flex flex-col gap-6">
      {/* Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary-hover transition-colors mb-2"
          >
            &larr; Back to lists
          </Link>
          <h1
            id="list-heading"
            className="text-2xl font-bold tracking-tight text-text sm:text-3xl"
          >
            {list?.name}
          </h1>
          {list?.description && (
            <p className="mt-1 text-sm text-text-muted">
              {list.description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <FontToggle />
          <ThemeToggle />
        </div>
      </header>

      {/* Add new todo */}
      <Card>
        <CardHeader>
          <CardTitle>Add a Task</CardTitle>
        </CardHeader>
        <CardContent>
          <TodoComposer listId={listId} />
        </CardContent>
      </Card>

      {/* Filters */}
      <TodoFilters
        filter={filter}
        onFilterChange={setFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        counts={counts}
      />

      {/* Todo list */}
      {todosQuery.isError ? (
        <div
          role="alert"
          className="rounded-lg border border-error/30 bg-error-light p-6 text-center"
        >
          <p className="font-medium text-error">Failed to load todos</p>
          <p className="mt-1 text-sm text-text-muted">
            {todosQuery.error.message}
          </p>
        </div>
      ) : (
        <TodoList todos={filteredTodos} listId={listId} />
      )}
    </section>
  );
}
