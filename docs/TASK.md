# Dockerized Dev Environment Task List

## Goal
Set up a seamless clone-and-run local development environment where running `docker compose up` from project root will:
- bring up Next.js on `http://localhost:3000`
- bring up PostgreSQL as a separate container accessible from host via `psql` on `localhost:5432`
- apply Prisma schema + migration + seed data so at least 10 users are queryable immediately
- auto-create root `.env` from root `.env.example` if `.env` is missing

## Locked Decisions From Conversation
- Bootstrap mode: commit the Next.js scaffold in `app/` now.
- Package manager: `npm`.
- Env strategy: use root `.env.example` -> auto-generate root `.env` on first run.
- DB init strategy: Prisma migration + Prisma seed.
- Runtime policy: use latest LTS-oriented runtime line for Node and latest stable PostgreSQL major line.

## Scope
### In Scope
- Create/replace Docker Compose for separate `app` and `db` services.
- Scaffold Next.js app in `app/` with TypeScript + App Router + Tailwind.
- Configure Prisma (`schema.prisma`) with a simple `User` table.
- Add initial migration and idempotent seed with at least 10 rows.
- Ensure startup flow handles dependency install, migration, seed, and app launch.
- Document startup and verification steps in `README.md`.

### Out of Scope
- Production deployment hardening.
- Advanced auth/business features beyond a dummy schema.
- Non-Postgres database support.

## Implementation Checklist
- [ ] Create/replace `docker-compose.yml` with separate `app` and `db` services
- [ ] Add app Docker image + startup entrypoint script under `docker/`
- [ ] Scaffold Next.js (latest) into `app/` with TypeScript + App Router + Tailwind + npm
- [ ] Add Prisma ORM (`schema.prisma`) with `User` model (`id`, `email`, `name`, timestamps)
- [ ] Generate and commit initial Prisma migration
- [ ] Add idempotent seed script with at least 10 sample users
- [ ] Add root `.env.example` with required vars (`POSTGRES_*`, `DATABASE_URL`)
- [ ] Implement auto-create of root `.env` from `.env.example` when missing
- [ ] Expose app on `localhost:3000`
- [ ] Expose Postgres on `localhost:5432` for host `psql`
- [ ] Update `.gitignore` for env/build artifacts as needed
- [ ] Update `README.md` with one-command startup and DB verification steps
- [ ] Validate clean-state flow (no `.env`, no containers, no volumes)

## Acceptance Criteria
- [ ] `docker compose up` succeeds from project root without manual setup edits
- [ ] App is reachable at `http://localhost:3000`
- [ ] Host can connect with `psql -h localhost -p 5432 -U <user> -d <db>`
- [ ] `User` table exists and has at least 10 seeded rows after first startup
- [ ] Re-running stack does not create uncontrolled duplicate seed rows
- [ ] A fresh clone can run same command and get same baseline behavior

## Verification Scenarios
1. Fresh clone, `.env` absent -> run `docker compose up` and verify `.env` gets created.
2. Confirm app container installs deps, runs Prisma generate/migrate/seed, then starts Next.js.
3. Open `http://localhost:3000` and verify default page loads.
4. Connect via host `psql` and run `SELECT COUNT(*) FROM "User";`.
5. Restart stack and verify data persists with Docker volume.
6. Repeat `docker compose up` and verify seed remains idempotent.
