"use client";

import { cn } from "@/lib/ui/cn";
import { THEMES, useTheme, type Theme } from "./theme-provider";

/* --------------------------------------------------------------------------
   Theme metadata for display
   -------------------------------------------------------------------------- */

const THEME_LABELS: Record<Theme, string> = {
  light: "Light",
  dark: "Dark",
  ocean: "Ocean",
};

const THEME_ICONS: Record<Theme, string> = {
  light: "\u2600", // Sun
  dark: "\u263E",  // Moon
  ocean: "\u223C", // Wave / tilde
};

/* --------------------------------------------------------------------------
   ThemeToggle
   -------------------------------------------------------------------------- */

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div
      role="radiogroup"
      aria-label="Select theme"
      className="inline-flex items-center gap-1 rounded-lg bg-surface-alt p-1"
    >
      {THEMES.map((t) => (
        <button
          key={t}
          role="radio"
          aria-checked={theme === t}
          aria-label={`${THEME_LABELS[t]} theme`}
          onClick={() => setTheme(t)}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium",
            "transition-colors duration-150",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
            theme === t
              ? "bg-surface text-text shadow-sm"
              : "text-text-muted hover:text-text"
          )}
        >
          <span aria-hidden="true">{THEME_ICONS[t]}</span>
          <span className="hidden sm:inline">{THEME_LABELS[t]}</span>
        </button>
      ))}
    </div>
  );
}
