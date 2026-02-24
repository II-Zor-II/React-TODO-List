"use client";

import type { Todo } from "../types";
import { TodoItem } from "./todo-item";

/* --------------------------------------------------------------------------
   Props
   -------------------------------------------------------------------------- */

interface TodoListProps {
  todos: Todo[];
  listId: string;
}

/* --------------------------------------------------------------------------
   Component
   -------------------------------------------------------------------------- */

export function TodoList({ todos, listId }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div
        role="status"
        className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border px-6 py-12 text-center"
      >
        <p className="text-lg font-medium text-text-muted">No todos found</p>
        <p className="text-sm text-text-muted">
          Add a new todo above, or adjust your filters.
        </p>
      </div>
    );
  }

  return (
    <ul aria-label="Todo list" className="flex flex-col gap-2">
      {todos.map((todo) => (
        <li key={todo.id}>
          <TodoItem todo={todo} listId={listId} />
        </li>
      ))}
    </ul>
  );
}
