import { test, expect } from "@playwright/test";

test.describe("Board Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("renders the board page with heading", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "My Lists" })).toBeVisible();
  });

  test("displays seeded todo lists", async ({ page }) => {
    // Wait for the board to load (seed data has these lists)
    await expect(page.getByText("Sprint Backlog")).toBeVisible();
    await expect(page.getByText("Grocery Shopping")).toBeVisible();
    await expect(page.getByText("Home Renovation")).toBeVisible();
    await expect(page.getByText("Future Ideas")).toBeVisible();
  });

  test("displays status count badges on list cards", async ({ page }) => {
    // Sprint Backlog has: 2 TODO, 1 IN_PROGRESS, 1 DONE = 4 tasks total
    const sprintCard = page.getByText("Sprint Backlog").locator("..").locator("..");
    await expect(sprintCard.getByText("4 tasks total")).toBeVisible();
  });

  test("search filters lists", async ({ page }) => {
    await expect(page.getByText("Sprint Backlog")).toBeVisible();

    // Type in search
    await page.getByPlaceholder("Search lists...").fill("grocery");

    // Should show only Grocery Shopping
    await expect(page.getByText("Grocery Shopping")).toBeVisible();
    await expect(page.getByText("Sprint Backlog")).not.toBeVisible();
  });

  test("navigating to a list detail page", async ({ page }) => {
    await page.getByText("Sprint Backlog").click();

    // Should navigate to the detail page
    await expect(page.getByRole("heading", { name: "Sprint Backlog" })).toBeVisible();
    await expect(page.getByText("Back to lists")).toBeVisible();
  });

  test("creating a new list via modal", async ({ page }) => {
    // Open create modal
    await page.getByRole("button", { name: "+ New List" }).click();

    // Fill in the form
    await page.getByLabel("Name").fill("E2E Test List");
    await page.getByLabel("Description").fill("Created by Playwright");

    // Submit
    await page.getByRole("button", { name: "Create List" }).click();

    // Modal should close and new list should appear
    await expect(page.getByText("E2E Test List")).toBeVisible();
  });
});
