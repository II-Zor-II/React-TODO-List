FROM node:22-alpine

# Install PostgreSQL client for pg_isready health checks
RUN apk add --no-cache postgresql-client

WORKDIR /app

# Copy package files first for better layer caching
COPY app/package.json app/package-lock.json* ./

# Install dependencies
RUN npm install

# Copy the rest of the application source
COPY app/ ./

# Copy the entrypoint script
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Copy .env.example to the project root inside the container
# so the entrypoint can auto-create .env from it
COPY .env.example /project-root/.env.example

EXPOSE 3000

ENTRYPOINT ["/entrypoint.sh"]
