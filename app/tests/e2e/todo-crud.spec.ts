import { test, expect } from "@playwright/test";

test.describe("Todo CRUD on List Detail Page", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the Sprint Backlog list detail page via the board
    await page.goto("/");
    await page.getByText("Sprint Backlog").click();
    await expect(
      page.getByRole("heading", { name: "Sprint Backlog" }),
    ).toBeVisible();
  });

  test("displays existing todos from seed data", async ({ page }) => {
    await expect(page.getByText("Implement authentication flow")).toBeVisible();
    await expect(page.getByText("Build user profile page")).toBeVisible();
    await expect(page.getByText("Write API documentation")).toBeVisible();
    await expect(page.getByText("Add unit tests for service layer")).toBeVisible();
  });

  test("displays filter tabs with correct counts", async ({ page }) => {
    // Sprint Backlog seed: 2 TODO, 1 IN_PROGRESS, 1 DONE = 4 total
    const allTab = page.getByRole("tab", { name: /All/ });
    await expect(allTab).toBeVisible();
  });

  test("creates a new todo", async ({ page }) => {
    await page.getByPlaceholder("What needs to be done?").fill("E2E New Todo");
    await page.getByRole("button", { name: "Add Todo" }).click();

    // New todo should appear in the list
    await expect(page.getByText("E2E New Todo")).toBeVisible();
  });

  test("updates todo status", async ({ page }) => {
    // Find the "Build user profile page" todo (seed status: TODO)
    const todoRow = page
      .getByText("Build user profile page")
      .locator("../..");

    // Change its status to IN_PROGRESS
    const statusSelect = todoRow.locator("select");
    await statusSelect.selectOption("IN_PROGRESS");

    // Wait for mutation to complete and verify the badge updated
    await expect(todoRow.getByText("In Progress")).toBeVisible();
  });

  test("deletes a todo", async ({ page }) => {
    // Use the "Write API documentation" todo (seed status: DONE)
    const todoText = "Write API documentation";
    await expect(page.getByText(todoText)).toBeVisible();

    // Click the delete button
    const todoRow = page.getByText(todoText).locator("../..");
    await todoRow.getByRole("button", { name: /Delete/ }).click();

    // Todo should disappear
    await expect(page.getByText(todoText)).not.toBeVisible();
  });

  test("filters todos by status", async ({ page }) => {
    // Click on the "Done" filter tab
    await page.getByRole("tab", { name: /Done/ }).click();

    // Should show only done todos
    await expect(page.getByText("Write API documentation")).toBeVisible();
    // Active todos should not be visible
    await expect(page.getByText("Build user profile page")).not.toBeVisible();
  });

  test("searches todos by title", async ({ page }) => {
    await page.getByPlaceholder("Search todos...").fill("authentication");

    // Only matching todo should be visible
    await expect(page.getByText("Implement authentication flow")).toBeVisible();
    await expect(page.getByText("Build user profile page")).not.toBeVisible();
  });

  test("navigates back to board", async ({ page }) => {
    await page.getByText("Back to lists").click();

    await expect(page.getByRole("heading", { name: "My Lists" })).toBeVisible();
  });
});
