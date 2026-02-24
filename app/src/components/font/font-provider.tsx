"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { FONTS, DEFAULT_FONT, type FontKey } from "@/lib/fonts";

/* --------------------------------------------------------------------------
   Types
   -------------------------------------------------------------------------- */

interface FontContextValue {
  font: FontKey;
  setFont: (font: FontKey) => void;
}

/* --------------------------------------------------------------------------
   Context
   -------------------------------------------------------------------------- */

const FontContext = createContext<FontContextValue | undefined>(undefined);

/* --------------------------------------------------------------------------
   Storage key (must match the anti-FOUC inline script in layout.tsx)
   -------------------------------------------------------------------------- */

const STORAGE_KEY = "todo-app-font";

/* --------------------------------------------------------------------------
   Helpers
   -------------------------------------------------------------------------- */

function isValidFont(value: unknown): value is FontKey {
  return typeof value === "string" && (FONTS as readonly string[]).includes(value);
}

function getInitialFont(): FontKey {
  if (typeof window === "undefined") return DEFAULT_FONT;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (isValidFont(stored)) return stored;
  } catch {
    // localStorage may be unavailable (private browsing, SSR, etc.)
  }

  return DEFAULT_FONT;
}

function applyFont(font: FontKey): void {
  document.documentElement.setAttribute("data-font", font);
}

/* --------------------------------------------------------------------------
   Provider
   -------------------------------------------------------------------------- */

interface FontProviderProps {
  children: ReactNode;
}

export function FontProvider({ children }: FontProviderProps) {
  const [font, setFontState] = useState<FontKey>(getInitialFont);

  const setFont = useCallback((next: FontKey) => {
    if (!isValidFont(next)) return;
    setFontState(next);
    applyFont(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Silently ignore storage errors
    }
  }, []);

  // Sync DOM attribute on mount (covers SSR hydration)
  useEffect(() => {
    applyFont(font);
  }, [font]);

  return (
    <FontContext.Provider value={{ font, setFont }}>
      {children}
    </FontContext.Provider>
  );
}

/* --------------------------------------------------------------------------
   Hook
   -------------------------------------------------------------------------- */

export function useFont(): FontContextValue {
  const context = useContext(FontContext);
  if (context === undefined) {
    throw new Error("useFont must be used within a FontProvider");
  }
  return context;
}
