"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

/* --------------------------------------------------------------------------
   Types
   -------------------------------------------------------------------------- */

export const THEMES = ["light", "dark", "ocean"] as const;
export type Theme = (typeof THEMES)[number];

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

/* --------------------------------------------------------------------------
   Context
   -------------------------------------------------------------------------- */

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/* --------------------------------------------------------------------------
   Storage key (must match the anti-FOUC inline script in layout.tsx)
   -------------------------------------------------------------------------- */

const STORAGE_KEY = "app-theme";

/* --------------------------------------------------------------------------
   Helpers
   -------------------------------------------------------------------------- */

function isValidTheme(value: unknown): value is Theme {
  return typeof value === "string" && THEMES.includes(value as Theme);
}

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark";

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (isValidTheme(stored)) return stored;
  } catch {
    // localStorage may be unavailable (private browsing, SSR, etc.)
  }

  return "dark";
}

function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute("data-theme", theme);
}

/* --------------------------------------------------------------------------
   Provider
   -------------------------------------------------------------------------- */

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  const setTheme = useCallback((next: Theme) => {
    if (!isValidTheme(next)) return;
    setThemeState(next);
    applyTheme(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Silently ignore storage errors
    }
  }, []);

  // Sync DOM attribute on mount (covers SSR hydration)
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/* --------------------------------------------------------------------------
   Hook
   -------------------------------------------------------------------------- */

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
