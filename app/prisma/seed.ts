import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/* --------------------------------------------------------------------------
   Seed data
   -------------------------------------------------------------------------- */

interface SeedUser {
  email: string;
  name: string;
}

const SEED_USERS: SeedUser[] = [
  { email: "alice.johnson@example.com", name: "Alice Johnson" },
  { email: "bob.smith@example.com", name: "Bob Smith" },
  { email: "carol.williams@example.com", name: "Carol Williams" },
  { email: "david.brown@example.com", name: "David Brown" },
  { email: "eva.davis@example.com", name: "Eva Davis" },
  { email: "frank.miller@example.com", name: "Frank Miller" },
  { email: "grace.wilson@example.com", name: "Grace Wilson" },
  { email: "henry.moore@example.com", name: "Henry Moore" },
  { email: "iris.taylor@example.com", name: "Iris Taylor" },
  { email: "jack.anderson@example.com", name: "Jack Anderson" },
];

/* --------------------------------------------------------------------------
   Seed functions
   -------------------------------------------------------------------------- */

async function seedUsers(): Promise<void> {
  for (const user of SEED_USERS) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: { name: user.name },
      create: { email: user.email, name: user.name },
    });
  }
  const count = await prisma.user.count();
  console.log(`  Users seeded. Total: ${count}`);
}

/* --------------------------------------------------------------------------
   Main
   -------------------------------------------------------------------------- */

async function main(): Promise<void> {
  console.log("Seeding database...");
  await seedUsers();
  console.log("Seed complete.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error("Seed failed:", error);
    await prisma.$disconnect();
    process.exit(1);
  });
