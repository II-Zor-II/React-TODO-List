import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { FontProvider } from "@/components/font/font-provider";
import { fontVariableClasses } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "React TODO List",
  description:
    "A full-stack TODO application built with Next.js, Prisma, and PostgreSQL",
};

/**
 * Anti-FOUC inline script.
 * Runs synchronously before first paint to set the data-theme and data-font
 * attributes, preventing a flash of the wrong theme/font on load.
 *
 * IMPORTANT: The storage keys must match STORAGE_KEY in theme-provider.tsx
 * and font-provider.tsx respectively.
 */
const ANTI_FOUC_SCRIPT = `
(function(){
  try {
    var t = localStorage.getItem("todo-app-theme");
    if (t === "light" || t === "dark" || t === "ocean") {
      document.documentElement.setAttribute("data-theme", t);
    }
    var f = localStorage.getItem("todo-app-font");
    if (f === "montserrat" || f === "source-code-pro" || f === "cormorant-garamond") {
      document.documentElement.setAttribute("data-font", f);
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
    <html lang="en" data-theme="dark" data-font="montserrat" className={fontVariableClasses} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: ANTI_FOUC_SCRIPT }}
        />
      </head>
      <body className="min-h-screen bg-bg text-text antialiased transition-colors duration-200">
        <ThemeProvider>
          <FontProvider>
            <div className="mx-auto w-full max-w-4xl px-4 py-8 2k:max-w-5xl 4k:max-w-7xl">
              {children}
            </div>
          </FontProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
