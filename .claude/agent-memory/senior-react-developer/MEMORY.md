# Senior React Developer - Agent Memory

## Project Overview
- **Name**: React TODO List
- **Stack**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4, PostgreSQL 17, Prisma 6
- **Package Manager**: npm (strict -- no yarn/pnpm/bun)
- **Dev Environment**: Dockerized via `docker compose up`

## Key Paths
- `/app/` - Next.js application root
- `/app/prisma/schema.prisma` - Database schema
- `/app/prisma/seed.ts` - Idempotent seed script (upsert by unique email)
- `/app/src/app/` - Next.js App Router pages
- `/app/src/styles/tokens.css` - Primitive design tokens (CSS custom properties)
- `/app/src/styles/themes.css` - Theme variants (light/dark/ocean via data-theme)
- `/app/src/lib/ui/cn.ts` - clsx + tailwind-merge utility
- `/app/src/components/ui/` - Reusable UI primitives (button, card, input, badge, checkbox)
- `/app/src/components/theme/` - ThemeProvider + ThemeToggle
- `/app/src/features/todos/` - Todo feature module (types, mock-data, components)
- `/docker/Dockerfile` - App container image (node:22-alpine)
- `/docker/entrypoint.sh` - Startup orchestration
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

## Dependencies Added
- `clsx` + `tailwind-merge` -> combined in `cn()` utility at `@/lib/ui/cn`
- `class-variance-authority` -> variant management for UI primitives

## Known Issues / Debt
- `.next` dir may get root-owned when Docker creates it; need `chown` in entrypoint or Docker config
- Favicon.ico missing (benign 404 in browser console)
- Prisma `package.json#prisma` config deprecated -- migrate to `prisma.config.ts` for Prisma 7
- No `CODING_STANDARDS.md`, `ARCHITECTURE.md`, or `COMPONENT_GUIDELINES.md` created yet
- No testing framework installed -- plan to add vitest + RTL
