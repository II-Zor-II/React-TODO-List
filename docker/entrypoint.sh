#!/bin/sh
set -e

# ---------------------------------------------------------------------------
# Stage 1: Environment bootstrap
# ---------------------------------------------------------------------------
echo "=========================================="
echo "[1/5] Checking environment configuration"
echo "=========================================="

ENV_FILE="/project-root/.env"
ENV_EXAMPLE="/project-root/.env.example"

if [ ! -f "$ENV_FILE" ] && [ -f "$ENV_EXAMPLE" ]; then
  echo "  -> .env not found. Creating from .env.example..."
  cp "$ENV_EXAMPLE" "$ENV_FILE"
  echo "  -> .env created successfully."
else
  echo "  -> .env already exists or .env.example not found. Skipping."
fi

# Validate required environment variables
if [ -z "$DATABASE_URL" ]; then
  echo "ERROR: DATABASE_URL environment variable is not set."
  echo "Please check your .env file or docker-compose.yml configuration."
  exit 1
fi

echo "  -> Environment configuration OK."

# ---------------------------------------------------------------------------
# Stage 2: Wait for database
# ---------------------------------------------------------------------------
echo ""
echo "=========================================="
echo "[2/5] Waiting for database to be ready"
echo "=========================================="

DB_HOST="${DB_HOST:-db}"
DB_PORT="${DB_PORT:-5432}"
DB_USER="${POSTGRES_USER:-postgres}"

MAX_RETRIES=30
RETRY_INTERVAL=2
RETRY_COUNT=0

until pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -q; do
  RETRY_COUNT=$((RETRY_COUNT + 1))
  if [ "$RETRY_COUNT" -ge "$MAX_RETRIES" ]; then
    echo "ERROR: Database did not become ready after $((MAX_RETRIES * RETRY_INTERVAL)) seconds."
    echo "Please verify the database container is running and accessible."
    exit 1
  fi
  echo "  -> Database not ready yet. Retrying in ${RETRY_INTERVAL}s... (attempt $RETRY_COUNT/$MAX_RETRIES)"
  sleep "$RETRY_INTERVAL"
done

echo "  -> Database is ready."

# ---------------------------------------------------------------------------
# Stage 3: Install dependencies (if needed)
# ---------------------------------------------------------------------------
echo ""
echo "=========================================="
echo "[3/5] Verifying dependencies"
echo "=========================================="

if [ ! -d "node_modules" ]; then
  echo "  -> Installing dependencies..."
  npm install
else
  echo "  -> Dependencies already installed."
fi

# ---------------------------------------------------------------------------
# Stage 4: Prisma generate + migrate + seed
# ---------------------------------------------------------------------------
echo ""
echo "=========================================="
echo "[4/5] Running Prisma migrations and seed"
echo "=========================================="

echo "  -> Generating Prisma client..."
npx prisma generate

echo "  -> Applying database migrations..."
npx prisma migrate deploy

echo "  -> Running seed script..."
npx prisma db seed

echo "  -> Database setup complete."

# ---------------------------------------------------------------------------
# Stage 5: Start application
# ---------------------------------------------------------------------------
echo ""
echo "=========================================="
echo "[5/5] Starting Next.js development server"
echo "=========================================="

exec npm run dev -- -H 0.0.0.0
