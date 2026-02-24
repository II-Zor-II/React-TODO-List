# React TODO List

A full-stack TODO application built with Next.js, TypeScript, Prisma, PostgreSQL, and Tailwind CSS. Includes a Dockerized development environment for one-command startup.

## Tech Stack

- **Frontend**: React 19, Next.js 15 (App Router), TypeScript
- **Backend**: Next.js (Server Actions + Route Handlers)
- **Database**: PostgreSQL 17 with Prisma ORM
- **Styling**: Tailwind CSS 4
- **Dev Environment**: Docker Compose

## Quick Start

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) (v20+)
- [Docker Compose](https://docs.docker.com/compose/install/) (v2+)

### One-Command Startup

```bash
docker compose up
```

This single command will:

1. Auto-create a root `.env` file from `.env.example` if one does not exist.
2. Start a PostgreSQL 17 database container.
3. Install npm dependencies inside the app container.
4. Generate the Prisma client.
5. Apply all database migrations.
6. Seed the database with 10 sample users.
7. Start the Next.js development server.

Once startup completes, the application is available at **http://localhost:3000**.

### Hot Reload

Hot reload is already enabled — the entrypoint starts `npm run dev` and the volume mount (`./app:/app`) syncs your local file changes into the container. Edit any file under `app/` and Next.js will automatically reload at `http://localhost:3000`.

**Do not** manually run `npm run dev` inside the container. The entrypoint already runs it on port 3000 bound to `0.0.0.0`. Running it again will conflict (fall back to port 3001, which isn't mapped) and break access on both ports.

### Rebuild After Changes

If you modify `package.json`, `Dockerfile`, or other infrastructure files:

```bash
docker compose up --build
```

### Stop the Stack

```bash
docker compose down
```

To also remove the database volume (full reset):

```bash
docker compose down -v
```

## Verification

### Application

Open your browser to [http://localhost:3000](http://localhost:3000). You should see the landing page confirming the environment is ready.

### Database

Connect to the database from your host machine using `psql`:

```bash
psql -h localhost -p 5432 -U postgres -d todoapp
```

Default password: `postgres`

Verify seeded data:

```sql
SELECT COUNT(*) FROM "User";
-- Expected: 10

SELECT id, email, name FROM "User" ORDER BY id;
```

## Ports

| Service    | Port | Description                  |
|------------|------|------------------------------|
| Next.js    | 3000 | Application (HTTP)           |
| PostgreSQL | 5432 | Database (host access)       |

### Port Collision Troubleshooting

If port 3000 or 5432 is already in use on your machine, you will see a bind error when running `docker compose up`. To resolve:

1. Stop the conflicting service on your host, or
2. Edit `docker-compose.yml` and change the host port mapping (the left side of the colon), for example `"3001:3000"`.

## Environment Variables

All environment variables are defined in `.env.example`. On first startup, the entrypoint script copies this file to `.env` automatically.

| Variable           | Default    | Description                          |
|--------------------|------------|--------------------------------------|
| `POSTGRES_USER`    | `postgres` | PostgreSQL username                  |
| `POSTGRES_PASSWORD`| `postgres` | PostgreSQL password                  |
| `POSTGRES_DB`      | `todoapp`  | PostgreSQL database name             |
| `DATABASE_URL`     | (computed) | Prisma connection string             |

## Project Structure

```
.
├── app/                    # Next.js application
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema
│   │   ├── seed.ts         # Idempotent seed script
│   │   └── migrations/     # Prisma migrations
│   ├── src/
│   │   └── app/            # Next.js App Router pages
│   ├── package.json
│   └── tsconfig.json
├── docker/
│   ├── Dockerfile          # App container image
│   └── entrypoint.sh       # Startup orchestration
├── docker-compose.yml      # Service definitions
├── .env.example            # Environment variable template
└── README.md
```
