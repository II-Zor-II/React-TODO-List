"use client";

import { cn } from "@/lib/ui/cn";
import { FONT_DEFINITIONS } from "@/lib/fonts";
import { useFont } from "./font-provider";

/* --------------------------------------------------------------------------
   FontToggle
   -------------------------------------------------------------------------- */

export function FontToggle() {
  const { font, setFont } = useFont();

  return (
    <div
      role="radiogroup"
      aria-label="Select font"
      className="inline-flex items-center gap-1 rounded-lg bg-surface-alt p-1"
    >
      {FONT_DEFINITIONS.map((f) => (
        <button
          key={f.key}
          role="radio"
          aria-checked={font === f.key}
          aria-label={`${f.label} font`}
          onClick={() => setFont(f.key)}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium",
            "transition-colors duration-150",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
            font === f.key
              ? "bg-surface text-text shadow-sm"
              : "text-text-muted hover:text-text"
          )}
        >
          <span aria-hidden="true">{f.icon}</span>
          <span className="hidden sm:inline">{f.label}</span>
        </button>
      ))}
    </div>
  );
}
