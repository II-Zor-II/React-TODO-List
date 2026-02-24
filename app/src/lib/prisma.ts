import { PrismaClient } from "@prisma/client";

/**
 * Singleton PrismaClient instance.
 *
 * In development, Next.js hot-reloads clear the Node.js module cache on every
 * change, which would otherwise create a new PrismaClient (and a new connection
 * pool) per reload -- eventually exhausting the database connection limit.
 *
 * Storing the instance on `globalThis` survives module-cache clears because
 * `globalThis` is never wiped by the bundler.
 *
 * In production, only one PrismaClient instance is ever created.
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma: PrismaClient =
  globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
