const { test, expect } = require("@playwright/test");

test.use({ viewport: { width: 375, height: 667 } });

test("mobile 375 layout supports starting and phase navigation", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByTestId("landing-fresh")).toBeVisible();
  await page.getByRole("button", { name: "Begin Discovery" }).click();

  await expect(page.getByRole("heading", { name: "Phase 1: Systems Mapping" })).toBeVisible();
  await page.locator("#phase1-answer").fill("Mobile answer");
  await page.getByRole("button", { name: "Save & Continue" }).click();
  await expect(page.getByText("Question 2 of 32")).toBeVisible();

  const rail = page.locator(".progress-rail-wrap");
  await expect(rail).toBeVisible();
  await page.locator('button[data-action="jump"][data-phase="4"]').click();
  await expect(page.getByRole("heading", { name: "Phase 4: Doctrine Derivation" })).toBeVisible();
});

test("mobile tap targets in header remain visible", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("button", { name: "Export Session" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Print Document" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Download HTML" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Reset" })).toBeVisible();
});
