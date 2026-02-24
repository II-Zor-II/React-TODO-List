"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { TodoComposer } from "@/features/todos/components/todo-composer";
import { TodoFilters } from "@/features/todos/components/todo-filters";
import { TodoList } from "@/features/todos/components/todo-list";
import { MOCK_TODOS } from "@/features/todos/mock-data";
import type { FilterStatus, Priority, Todo } from "@/features/todos/types";

/* --------------------------------------------------------------------------
   Page Component
   -------------------------------------------------------------------------- */

export default function HomePage() {
  const [todos, setTodos] = useState<Todo[]>(MOCK_TODOS);
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");

  /* --- Derived state --- */

  const counts = useMemo<Record<FilterStatus, number>>(
    () => ({
      all: todos.length,
      active: todos.filter((t) => !t.completed).length,
      completed: todos.filter((t) => t.completed).length,
    }),
    [todos]
  );

  const filteredTodos = useMemo(() => {
    let result = todos;

    // Status filter
    if (filter === "active") {
      result = result.filter((t) => !t.completed);
    } else if (filter === "completed") {
      result = result.filter((t) => t.completed);
    }

    // Text search
    const query = searchQuery.trim().toLowerCase();
    if (query) {
      result = result.filter((t) =>
        t.title.toLowerCase().includes(query)
      );
    }

    return result;
  }, [todos, filter, searchQuery]);

  /* --- Handlers --- */

  function handleToggle(id: string) {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }

  function handleAdd(title: string, priority: Priority) {
    const newTodo: Todo = {
      id: `todo-${Date.now()}`,
      title,
      completed: false,
      createdAt: new Date(),
      priority,
    };
    setTodos((prev) => [newTodo, ...prev]);
  }

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
            TODO List
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            {counts.active} {counts.active === 1 ? "task" : "tasks"} remaining
          </p>
        </div>
        <ThemeToggle />
      </header>

      {/* Add new todo */}
      <Card>
        <CardHeader>
          <CardTitle>Add a Task</CardTitle>
        </CardHeader>
        <CardContent>
          <TodoComposer onAdd={handleAdd} />
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
      <TodoList todos={filteredTodos} onToggle={handleToggle} />
    </section>
  );
}
