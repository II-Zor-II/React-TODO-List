import { PrismaClient, TodoStatus, TodoPriority } from "@prisma/client";

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

interface SeedTodoList {
  /** Stable ID for idempotent upsert */
  id: string;
  name: string;
  description: string | null;
  todos: SeedTodo[];
}

interface SeedTodo {
  /** Stable ID for idempotent upsert */
  id: string;
  title: string;
  description: string | null;
  status: TodoStatus;
  priority: TodoPriority | null;
  dueDate: Date | null;
}

const SEED_TODO_LISTS: SeedTodoList[] = [
  {
    id: "seed-list-sprint-backlog",
    name: "Sprint Backlog",
    description: "Current sprint tasks for the team",
    todos: [
      {
        id: "seed-todo-auth-flow",
        title: "Implement authentication flow",
        description: "Set up JWT-based auth with refresh tokens",
        status: TodoStatus.IN_PROGRESS,
        priority: TodoPriority.HIGH,
        dueDate: new Date("2026-03-01"),
      },
      {
        id: "seed-todo-user-profile",
        title: "Build user profile page",
        description: "Display user info with edit capability",
        status: TodoStatus.TODO,
        priority: TodoPriority.MEDIUM,
        dueDate: new Date("2026-03-05"),
      },
      {
        id: "seed-todo-api-docs",
        title: "Write API documentation",
        description: null,
        status: TodoStatus.DONE,
        priority: TodoPriority.LOW,
        dueDate: null,
      },
      {
        id: "seed-todo-unit-tests",
        title: "Add unit tests for service layer",
        description: "Cover all service functions with vitest",
        status: TodoStatus.TODO,
        priority: TodoPriority.HIGH,
        dueDate: new Date("2026-03-07"),
      },
    ],
  },
  {
    id: "seed-list-grocery",
    name: "Grocery Shopping",
    description: "Weekly grocery list",
    todos: [
      {
        id: "seed-todo-vegetables",
        title: "Buy vegetables",
        description: "Tomatoes, spinach, bell peppers, onions",
        status: TodoStatus.TODO,
        priority: TodoPriority.MEDIUM,
        dueDate: new Date("2026-02-28"),
      },
      {
        id: "seed-todo-dairy",
        title: "Pick up dairy products",
        description: "Milk, cheese, yogurt",
        status: TodoStatus.DONE,
        priority: TodoPriority.LOW,
        dueDate: null,
      },
      {
        id: "seed-todo-snacks",
        title: "Get snacks for movie night",
        description: null,
        status: TodoStatus.TODO,
        priority: null,
        dueDate: new Date("2026-03-01"),
      },
    ],
  },
  {
    id: "seed-list-home-reno",
    name: "Home Renovation",
    description: "Kitchen and bathroom remodel tasks",
    todos: [
      {
        id: "seed-todo-contractor",
        title: "Contact contractor for estimate",
        description: "Get quotes from at least 3 contractors",
        status: TodoStatus.DONE,
        priority: TodoPriority.HIGH,
        dueDate: null,
      },
      {
        id: "seed-todo-tile-samples",
        title: "Order tile samples",
        description: "Subway tile and hexagonal floor tile",
        status: TodoStatus.IN_PROGRESS,
        priority: TodoPriority.MEDIUM,
        dueDate: new Date("2026-03-10"),
      },
      {
        id: "seed-todo-paint-colors",
        title: "Choose paint colors",
        description: null,
        status: TodoStatus.TODO,
        priority: TodoPriority.LOW,
        dueDate: new Date("2026-03-15"),
      },
      {
        id: "seed-todo-cabinet-hardware",
        title: "Select cabinet hardware",
        description: "Brushed nickel or matte black handles",
        status: TodoStatus.TODO,
        priority: null,
        dueDate: null,
      },
      {
        id: "seed-todo-plumber",
        title: "Schedule plumber visit",
        description: "For sink and faucet installation",
        status: TodoStatus.IN_PROGRESS,
        priority: TodoPriority.HIGH,
        dueDate: new Date("2026-03-20"),
      },
    ],
  },
  {
    id: "seed-list-empty",
    name: "Future Ideas",
    description: "Placeholder for ideas to explore later",
    todos: [],
  },
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

async function seedTodoLists(): Promise<void> {
  for (const list of SEED_TODO_LISTS) {
    // Upsert the todo list
    await prisma.todoList.upsert({
      where: { id: list.id },
      update: {
        name: list.name,
        description: list.description,
        deletedAt: null,
      },
      create: {
        id: list.id,
        name: list.name,
        description: list.description,
      },
    });

    // Upsert each todo in the list
    for (const todo of list.todos) {
      await prisma.todo.upsert({
        where: { id: todo.id },
        update: {
          title: todo.title,
          description: todo.description,
          status: todo.status,
          priority: todo.priority,
          dueDate: todo.dueDate,
          todoListId: list.id,
          deletedAt: null,
        },
        create: {
          id: todo.id,
          title: todo.title,
          description: todo.description,
          status: todo.status,
          priority: todo.priority,
          dueDate: todo.dueDate,
          todoListId: list.id,
        },
      });
    }
  }

  const listCount = await prisma.todoList.count();
  const todoCount = await prisma.todo.count();
  console.log(`  Todo lists seeded. Total lists: ${listCount}, Total todos: ${todoCount}`);
}

/* --------------------------------------------------------------------------
   Main
   -------------------------------------------------------------------------- */

async function main(): Promise<void> {
  console.log("Seeding database...");
  await seedUsers();
  await seedTodoLists();
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
