"use client";

import { cn } from "@/lib/ui/cn";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePatchTodo, useDeleteTodo } from "../api/mutations";
import type { TodoStatus, TodoPriority, Todo } from "../types";

/* --------------------------------------------------------------------------
   Status config
   -------------------------------------------------------------------------- */

const STATUS_OPTIONS: { value: TodoStatus; label: string }[] = [
  { value: "TODO", label: "Todo" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "DONE", label: "Done" },
];

const STATUS_BADGE_VARIANT: Record<
  TodoStatus,
  "default" | "warning" | "success"
> = {
  TODO: "default",
  IN_PROGRESS: "warning",
  DONE: "success",
};

/* --------------------------------------------------------------------------
   Priority config
   -------------------------------------------------------------------------- */

const PRIORITY_VARIANT: Record<
  TodoPriority,
  "error" | "warning" | "default"
> = {
  HIGH: "error",
  MEDIUM: "warning",
  LOW: "default",
};

const PRIORITY_LABEL: Record<TodoPriority, string> = {
  HIGH: "High",
  MEDIUM: "Medium",
  LOW: "Low",
};

/* --------------------------------------------------------------------------
   Props
   -------------------------------------------------------------------------- */

interface TodoItemProps {
  todo: Todo;
  listId: string;
}

/* --------------------------------------------------------------------------
   Component
   -------------------------------------------------------------------------- */

export function TodoItem({ todo, listId }: TodoItemProps) {
  const patchMutation = usePatchTodo(listId);
  const deleteMutation = useDeleteTodo(listId);

  function handleStatusChange(newStatus: TodoStatus) {
    if (newStatus === todo.status) return;
    patchMutation.mutate({ todoId: todo.id, input: { status: newStatus } });
  }

  function handleDelete() {
    deleteMutation.mutate(todo.id);
  }

  const isPending = patchMutation.isPending || deleteMutation.isPending;

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border border-border bg-surface p-4",
        "transition-all duration-150",
        "hover:shadow-sm",
        todo.status === "DONE" && "opacity-70",
        isPending && "opacity-50 pointer-events-none",
      )}
    >
      {/* Status selector */}
      <label className="sr-only" htmlFor={`status-${todo.id}`}>
        Status for &quot;{todo.title}&quot;
      </label>
      <select
        id={`status-${todo.id}`}
        value={todo.status}
        onChange={(e) => handleStatusChange(e.target.value as TodoStatus)}
        className={cn(
          "h-8 rounded-md border border-border bg-surface px-2 text-xs font-medium transition-colors duration-150",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring cursor-pointer",
          todo.status === "DONE" && "text-success",
          todo.status === "IN_PROGRESS" && "text-warning",
          todo.status === "TODO" && "text-text-muted",
        )}
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "text-sm font-medium text-text",
            "transition-all duration-150",
            todo.status === "DONE" && "text-text-muted line-through",
          )}
        >
          {todo.title}
        </p>
        <div className="mt-0.5 flex flex-wrap items-center gap-2">
          <span className="text-xs text-text-muted">
            {todo.createdAt.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          {todo.dueDate && (
            <span className="text-xs text-text-muted">
              Due: {todo.dueDate.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
          )}
        </div>
        {todo.description && (
          <p className="mt-1 text-xs text-text-muted line-clamp-2">
            {todo.description}
          </p>
        )}
      </div>

      {/* Badges and actions */}
      <div className="flex items-center gap-2">
        <Badge variant={STATUS_BADGE_VARIANT[todo.status]}>
          {STATUS_OPTIONS.find((o) => o.value === todo.status)?.label}
        </Badge>

        {todo.priority && (
          <Badge variant={PRIORITY_VARIANT[todo.priority]}>
            {PRIORITY_LABEL[todo.priority]}
          </Badge>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
          aria-label={`Delete "${todo.title}"`}
          className="text-text-muted hover:text-error"
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
            <path d="M2 4h12" />
            <path d="M5 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" />
            <path d="M13 4v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4" />
            <path d="M7 7v4" />
            <path d="M9 7v4" />
          </svg>
        </Button>
      </div>
    </div>
  );
}
