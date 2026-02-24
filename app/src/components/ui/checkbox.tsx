"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/ui/cn";

/* --------------------------------------------------------------------------
   Types
   -------------------------------------------------------------------------- */

interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  /** Visible label text rendered beside the checkbox */
  label?: string;
}

/* --------------------------------------------------------------------------
   Component
   -------------------------------------------------------------------------- */

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, ...props }, ref) => {
    const inputId = id ?? (label ? `checkbox-${label.replace(/\s+/g, "-").toLowerCase()}` : undefined);

    return (
      <label
        htmlFor={inputId}
        className={cn(
          "inline-flex cursor-pointer items-center gap-2",
          props.disabled && "cursor-not-allowed opacity-50",
          className
        )}
      >
        <span className="relative inline-flex h-5 w-5 items-center justify-center">
          <input
            ref={ref}
            type="checkbox"
            id={inputId}
            className="peer sr-only"
            {...props}
          />
          {/* Visual checkbox box */}
          <span
            aria-hidden="true"
            className={cn(
              "absolute inset-0 rounded-md border-2 border-border bg-surface",
              "transition-colors duration-150",
              "peer-checked:border-primary peer-checked:bg-primary",
              "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring"
            )}
          />
          {/* Checkmark SVG */}
          <svg
            aria-hidden="true"
            className={cn(
              "relative z-10 h-3 w-3 text-primary-foreground opacity-0",
              "transition-opacity duration-150",
              "peer-checked:opacity-100"
            )}
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2 6l3 3 5-5" />
          </svg>
        </span>
        {label && (
          <span className="select-none text-sm text-text">{label}</span>
        )}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
export type { CheckboxProps };
