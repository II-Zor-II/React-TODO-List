"use client";

import { useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

/* --------------------------------------------------------------------------
   Props
   -------------------------------------------------------------------------- */

interface QueryProviderProps {
  children: ReactNode;
}

/* --------------------------------------------------------------------------
   Component
   -------------------------------------------------------------------------- */

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30 * 1000, // 30 seconds
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
