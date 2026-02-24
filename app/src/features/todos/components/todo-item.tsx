"use client";

import { cn } from "@/lib/ui/cn";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import type { Priority, Todo } from "../types";

/* --------------------------------------------------------------------------
   Priority badge variant mapping
   -------------------------------------------------------------------------- */

const PRIORITY_VARIANT: Record<
  Priority,
  "error" | "warning" | "default"
> = {
  high: "error",
  medium: "warning",
  low: "default",
};

const PRIORITY_LABEL: Record<Priority, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

/* --------------------------------------------------------------------------
   Props
   -------------------------------------------------------------------------- */

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
}

/* --------------------------------------------------------------------------
   Component
   -------------------------------------------------------------------------- */

export function TodoItem({ todo, onToggle }: TodoItemProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border border-border bg-surface p-4",
        "transition-all duration-150",
        "hover:shadow-sm",
        todo.completed && "opacity-70"
      )}
    >
      <Checkbox
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        aria-label={`Mark "${todo.title}" as ${todo.completed ? "incomplete" : "complete"}`}
      />

      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "text-sm font-medium text-text",
            "transition-all duration-150",
            todo.completed && "text-text-muted line-through"
          )}
        >
          {todo.title}
        </p>
        <p className="mt-0.5 text-xs text-text-muted">
          {todo.createdAt.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>

      <Badge variant={PRIORITY_VARIANT[todo.priority]}>
        {PRIORITY_LABEL[todo.priority]}
      </Badge>
    </div>
  );
}
