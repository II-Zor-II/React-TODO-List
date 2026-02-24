# Senior React Developer - Agent Memory

## Project Overview
- **Name**: React TODO List
- **Stack**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4, PostgreSQL 17, Prisma 6
- **Package Manager**: npm (strict -- no yarn/pnpm/bun)
- **Dev Environment**: Dockerized via `docker compose up`

## Key Paths
- `/app/` - Next.js application root
- `/app/prisma/schema.prisma` - Database schema
- `/app/prisma/seed.ts` - Idempotent seed script (upsert by unique email + stable IDs)
- `/app/src/app/` - Next.js App Router pages
- `/app/src/styles/tokens.css` - Primitive design tokens (CSS custom properties)
- `/app/src/styles/themes.css` - Theme variants (light/dark/ocean via data-theme)
- `/app/src/lib/ui/cn.ts` - clsx + tailwind-merge utility
- `/app/src/components/ui/` - Reusable UI primitives (button, card, input, badge, checkbox)
- `/app/src/components/theme/` - ThemeProvider + ThemeToggle
- `/app/src/features/todos/` - Todo feature module (types, mock-data, components)
- `/docker/Dockerfile` - App container image (node:22-alpine)
- `/docker/entrypoint.sh` - Startup orchestration
- `/app/src/lib/prisma.ts` - Singleton PrismaClient (hot-reload safe via globalThis)
- `/app/src/server/shared/` - Shared server utilities (http-errors, http-response, pagination)
- `/app/src/server/todos/` - Todo domain (types, validators, repository, service)
- `/app/src/app/api/v1/` - REST v1 API route handlers
- `/docker-compose.yml` - Services: `app` (port 3000) and `db` (port 5432)
- `/.env.example` - Environment variable template

## Architecture Decisions
- **Tailwind v4 CSS-first config**: No `tailwind.config.ts`. All config via `@theme {}` in `globals.css`
- **Design token system**: 3-layer (primitives -> semantic -> component). Themes reassign semantic tokens
- **Theme switching**: `data-theme` attribute on `<html>`, localStorage persistence, anti-FOUC inline script
- **UI primitives**: Use CVA (class-variance-authority) for variants, `cn()` for merging, `forwardRef` for refs
- **Component naming**: PascalCase components, kebab-case files
- **Feature modules**: `/features/{name}/` with types.ts, mock-data.ts, components/ subdirectory
- **Prisma seed config**: Uses `package.json#prisma.seed` field
- **DB wait strategy**: Shell loop with `pg_isready` in entrypoint.sh
- **Docker volumes**: `pgdata` for DB persistence, `app_node_modules` for dep caching, `./app:/app` bind mount

## Conventions Established
- Named exports for components; default exports only for route-level pages
- Functional components with TypeScript exclusively
- `"use client"` directive on any component using hooks, event handlers, or browser APIs
- Tailwind CSS 4 with `@tailwindcss/postcss` plugin (not legacy `tailwindcss` plugin)
- PostCSS config via `postcss.config.mjs` (ESM)
- `src/` directory inside `app/` for source organization
- Semantic HTML with ARIA attributes for accessibility
- Focus-visible ring pattern for keyboard navigation
- Mobile-first responsive with 2k/4k breakpoints (font scaling + max-width caps)

## Backend Architecture (v1 API)
- **Layered architecture**: Route Handler -> Service -> Repository -> Prisma
- **REST v1 endpoints** under `/api/v1/` with versioned URL prefix
- **Response envelope**: `{ data, error: { message, details? }, meta? }` on all endpoints
- **Zod validation** on all route inputs (body and params)
- **Soft-delete strategy**: `deletedAt` column, list deletion cascades to todos in transaction
- **Prisma singleton** at `@/lib/prisma` using globalThis for hot-reload safety
- **Pagination**: Zod-parsed query params, `PaginationMeta` in response envelope
- **Board endpoint**: Per-list status counts, search/sort/filter, in-memory sort for `totalTodos`
- **Param validation**: Use `z.string().min(1)` NOT `.cuid()` -- seed uses stable human-readable IDs
- **Seed IDs**: Format `seed-list-*` and `seed-todo-*` for idempotent upsert (NOT valid CUIDs)
- **HTTP error classes**: HttpError base class with typed subclasses, caught by handleRouteError()
- **Next.js 15 route context**: `params` is a Promise (must `await context.params`)

## Dependencies Added
- `clsx` + `tailwind-merge` -> combined in `cn()` utility at `@/lib/ui/cn`
- `class-variance-authority` -> variant management for UI primitives
- `zod` -> runtime validation for API request/response

## Known Issues / Debt
- `.next` dir may get root-owned when Docker creates it; need `chown` in entrypoint or Docker config
- `npm run lint` fails on host due to root-owned `.next/cache/eslint/`; workaround: `npx eslint --no-cache src/`
- Favicon.ico missing (benign 404 in browser console)
- Prisma `package.json#prisma` config deprecated -- migrate to `prisma.config.ts` for Prisma 7
- Docker `app_node_modules` volume requires separate `prisma generate` + `npm install` inside container after host changes
- After modifying source files on host, Docker app container may need restart to pick up changes
- No `CODING_STANDARDS.md`, `ARCHITECTURE.md`, or `COMPONENT_GUIDELINES.md` created yet
- No testing framework installed -- plan to add vitest + RTL
- Frontend types at `src/features/todos/types.ts` diverge from backend types -- will need reconciliation when frontend consumes API
