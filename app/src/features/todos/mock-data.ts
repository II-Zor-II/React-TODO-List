import type { Todo } from "./types";

/**
 * Seeded mock todo items for the frontend-only prototype.
 * Provides a realistic variety of states, priorities, and titles.
 */
export const MOCK_TODOS: Todo[] = [
  {
    id: "todo-001",
    title: "Set up project repository and CI pipeline",
    completed: true,
    createdAt: new Date("2026-02-10T09:00:00"),
    priority: "high",
  },
  {
    id: "todo-002",
    title: "Design the database schema for todo items",
    completed: true,
    createdAt: new Date("2026-02-11T10:30:00"),
    priority: "high",
  },
  {
    id: "todo-003",
    title: "Implement user authentication flow",
    completed: false,
    createdAt: new Date("2026-02-12T14:00:00"),
    priority: "high",
  },
  {
    id: "todo-004",
    title: "Create reusable UI component library",
    completed: false,
    createdAt: new Date("2026-02-13T08:15:00"),
    priority: "medium",
  },
  {
    id: "todo-005",
    title: "Write unit tests for todo CRUD operations",
    completed: false,
    createdAt: new Date("2026-02-14T11:00:00"),
    priority: "medium",
  },
  {
    id: "todo-006",
    title: "Add dark mode and theme switching support",
    completed: true,
    createdAt: new Date("2026-02-15T16:45:00"),
    priority: "medium",
  },
  {
    id: "todo-007",
    title: "Optimize bundle size and lazy loading",
    completed: false,
    createdAt: new Date("2026-02-16T13:30:00"),
    priority: "low",
  },
  {
    id: "todo-008",
    title: "Update project documentation and README",
    completed: false,
    createdAt: new Date("2026-02-17T09:00:00"),
    priority: "low",
  },
  {
    id: "todo-009",
    title: "Review and merge pending pull requests",
    completed: false,
    createdAt: new Date("2026-02-18T10:00:00"),
    priority: "medium",
  },
  {
    id: "todo-010",
    title: "Deploy staging environment for QA testing",
    completed: false,
    createdAt: new Date("2026-02-19T15:00:00"),
    priority: "high",
  },
];
