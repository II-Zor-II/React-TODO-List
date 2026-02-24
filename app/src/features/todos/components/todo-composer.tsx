"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Priority } from "../types";

/* --------------------------------------------------------------------------
   Props
   -------------------------------------------------------------------------- */

interface TodoComposerProps {
  onAdd: (title: string, priority: Priority) => void;
}

/* --------------------------------------------------------------------------
   Component
   -------------------------------------------------------------------------- */

export function TodoComposer({ onAdd }: TodoComposerProps) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onAdd(trimmed, priority);
    setTitle("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 sm:flex-row sm:items-end"
      aria-label="Add new todo"
    >
      <div className="flex-1">
        <label htmlFor="new-todo-title" className="sr-only">
          Todo title
        </label>
        <Input
          id="new-todo-title"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-required="true"
        />
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="new-todo-priority" className="sr-only">
          Priority
        </label>
        <select
          id="new-todo-priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
          className="h-10 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring cursor-pointer"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <Button type="submit" disabled={!title.trim()}>
          Add Todo
        </Button>
      </div>
    </form>
  );
}
