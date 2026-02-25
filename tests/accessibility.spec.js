const { test, expect } = require("@playwright/test");
const AxeBuilder = require("@axe-core/playwright").default;

async function expectNoSeriousA11yIssues(page) {
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
  const impactful = results.violations.filter((v) => ["serious", "critical"].includes(v.impact));
  expect(impactful, impactful.map((v) => `${v.id}: ${v.help}`).join("\n")).toEqual([]);
}

test("landing page has no serious/critical axe violations", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("landing-fresh")).toBeVisible();
  await expectNoSeriousA11yIssues(page);
});

test("phase 1 has no serious/critical axe violations", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Begin Discovery" }).click();
  await expect(page.getByRole("heading", { name: "Phase 1: Systems Mapping" })).toBeVisible();
  await expectNoSeriousA11yIssues(page);
});

test("quick assessment reflection has no serious/critical axe violations", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Try the 5-Question Quick Assessment" }).click();
  for (let i = 0; i < 5; i += 1) {
    await page.locator("#quick-answer").fill(`Answer ${i + 1}`);
    await page.getByRole("button", { name: "Continue" }).click();
  }
  await expect(page.getByTestId("quick-reflection")).toBeVisible();
  await expectNoSeriousA11yIssues(page);
});

test("phase 5 has no serious/critical axe violations", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Begin Discovery" }).click();
  await page.locator('button[data-action="jump"][data-phase="5"]').click();
  await expect(page.locator("h2", { hasText: "Phase 5: Alignment" })).toBeVisible();
  await expectNoSeriousA11yIssues(page);
});
