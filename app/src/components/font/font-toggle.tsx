"use client";

import { FONT_DEFINITIONS } from "@/lib/fonts";
import { useFont } from "./font-provider";

/* --------------------------------------------------------------------------
   FontToggle – compact dropdown
   -------------------------------------------------------------------------- */

export function FontToggle() {
  const { font, setFont } = useFont();

  return (
    <div className="relative inline-flex items-center">
      <label htmlFor="font-select" className="sr-only">
        Select font
      </label>
      <select
        id="font-select"
        value={font}
        onChange={(e) => setFont(e.target.value as typeof font)}
        className="appearance-none rounded-lg bg-surface-alt px-3 py-1.5 pr-7 text-sm font-medium text-text-muted transition-colors duration-150 hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        {FONT_DEFINITIONS.map((f) => (
          <option key={f.key} value={f.key}>
            {f.label}
          </option>
        ))}
      </select>
      {/* Dropdown chevron */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-2 text-xs text-text-muted"
      >
        ▾
      </span>
    </div>
  );
}
