"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateTodoList } from "../api/mutations";

/* --------------------------------------------------------------------------
   Props
   -------------------------------------------------------------------------- */

interface CreateListModalProps {
  open: boolean;
  onClose: () => void;
}

/* --------------------------------------------------------------------------
   Component
   -------------------------------------------------------------------------- */

export function CreateListModal({ open, onClose }: CreateListModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const nameInputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const createMutation = useCreateTodoList();

  // Sync dialog open/close with the `open` prop
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
      nameInputRef.current?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  // Handle ESC key closing the dialog
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    function handleClose() {
      onClose();
    }

    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onClose]);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) return;

    createMutation.mutate(
      {
        name: trimmedName,
        description: description.trim() || null,
      },
      {
        onSuccess: () => {
          setName("");
          setDescription("");
          onClose();
        },
      },
    );
  }

  if (!open) return null;

  return (
    <dialog
      ref={dialogRef}
      className="w-full max-w-md rounded-xl border border-border bg-surface p-0 shadow-xl backdrop:bg-black/50"
      aria-labelledby="create-list-title"
    >
      <div className="p-6">
        <h2
          id="create-list-title"
          className="text-lg font-semibold text-text"
        >
          Create New List
        </h2>
        <p className="mt-1 text-sm text-text-muted">
          Add a new todo list to organize your tasks.
        </p>

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
          <div>
            <label htmlFor="list-name" className="mb-1 block text-sm font-medium text-text">
              Name
            </label>
            <Input
              ref={nameInputRef}
              id="list-name"
              placeholder="e.g. Sprint Backlog"
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-required="true"
              maxLength={255}
            />
          </div>

          <div>
            <label htmlFor="list-description" className="mb-1 block text-sm font-medium text-text">
              Description (optional)
            </label>
            <textarea
              id="list-description"
              placeholder="What is this list for?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={1000}
              rows={3}
              className="flex w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text placeholder:text-text-muted transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring resize-none"
            />
          </div>

          {createMutation.isError && (
            <p role="alert" className="text-sm text-error">
              {createMutation.error.message}
            </p>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={createMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!name.trim() || createMutation.isPending}
            >
              {createMutation.isPending ? "Creating..." : "Create List"}
            </Button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
