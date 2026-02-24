import { ThemeToggle } from "@/components/theme/theme-toggle";
import { FontToggle } from "@/components/font/font-toggle";

export default function HomePage() {
  return (
    <section aria-labelledby="app-heading" className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1
            id="app-heading"
            className="text-2xl font-bold tracking-tight text-text sm:text-3xl"
          >
            Template App
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            A full-stack Next.js starter template
          </p>
        </div>
        <div className="flex items-center gap-2">
          <FontToggle />
          <ThemeToggle />
        </div>
      </header>

      <div className="rounded-lg border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold text-text">Welcome</h2>
        <p className="mt-2 text-sm text-text-muted">
          This template includes a design system with theme and font switching,
          a configured database with Prisma, Docker setup, and shared UI
          components. Start building your features from here.
        </p>
      </div>
    </section>
  );
}
