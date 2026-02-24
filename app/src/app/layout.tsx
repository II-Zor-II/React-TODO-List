import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme/theme-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "React TODO List",
  description:
    "A full-stack TODO application built with Next.js, Prisma, and PostgreSQL",
};

/**
 * Anti-FOUC inline script.
 * Runs synchronously before first paint to set the data-theme attribute,
 * preventing a flash of the wrong theme on load.
 *
 * IMPORTANT: The storage key must match STORAGE_KEY in theme-provider.tsx.
 */
const ANTI_FOUC_SCRIPT = `
(function(){
  try {
    var t = localStorage.getItem("todo-app-theme");
    if (t === "light" || t === "dark" || t === "ocean") {
      document.documentElement.setAttribute("data-theme", t);
    }
  } catch(e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: ANTI_FOUC_SCRIPT }}
        />
      </head>
      <body className="min-h-screen bg-bg text-text antialiased transition-colors duration-200">
        <ThemeProvider>
          <div className="mx-auto w-full max-w-4xl px-4 py-8 2k:max-w-5xl 4k:max-w-7xl">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
