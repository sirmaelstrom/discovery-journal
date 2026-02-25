const { test, expect } = require("@playwright/test");

const STORAGE_KEY = "operator-discovery-toolkit:v1";

function seededSession(overrides = {}) {
  return {
    startedAt: new Date("2026-02-20T10:00:00Z").toISOString(),
    lastActivity: new Date("2026-02-20T10:30:00Z").toISOString(),
    currentPhase: 3,
    p1: {
      s: 1,
      q: 2,
      answers: {
        "energy-0": {
          text: "Meetings drain me",
          status: "answered",
          updatedAt: new Date().toISOString(),
        },
      },
    },
    p2: {
      themes: "Momentum matters",
      observations: [],
      observationResponses: {},
      patterns: [
        {
          id: "p-1",
          statement: "I detect momentum more than completion",
          prediction: "Checklists reduce engagement",
          implication: "Use progress cues",
        },
      ],
    },
    p3: {
      analyses: {
        "p-1": {
          catastrophic: "Flow disruption",
          acceptable: "Messy notes",
          severity: "catastrophic",
          tradeoff: "Accept clutter",
        },
      },
    },
    p4: {
      directive: "",
      meta: "",
      notes: "",
      scaffold: { commonThread: "", protect: "", depends: "" },
      checks: { descriptive: false, testable: false, generative: false, singular: false },
    },
    p5: {
      tools: [{ id: "t-1", name: "", context: "", alignment: "mixed", notes: "", action: "" }],
      synthesis: "",
    },
    updatedAt: new Date("2026-02-20T10:30:00Z").toISOString(),
    ...overrides,
  };
}

test("landing page renders for fresh visit", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("landing-fresh")).toBeVisible();
  await expect(page.getByRole("button", { name: "Begin Discovery" })).toBeVisible();
  await expect(page.getByText("45-60 minutes, or take it across multiple sessions")).toBeVisible();
});

test("welcome back state renders when saved session exists", async ({ page }) => {
  await page.addInitScript(
    ([key, value]) => {
      localStorage.setItem(key, JSON.stringify(value));
    },
    [STORAGE_KEY, seededSession()]
  );

  await page.goto("/");
  await expect(page.getByTestId("landing-welcome")).toBeVisible();
  await expect(page.getByRole("button", { name: "Continue Where I Left Off" })).toBeVisible();
  await expect(page.getByText("Phase 3: Failure Modes")).toBeVisible();
});

test("quick assessment flow reaches reflection", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Try the 5-Question Quick Assessment" }).click();

  for (let i = 1; i <= 5; i += 1) {
    await expect(page.getByText(`Question ${i} of 5`)).toBeVisible();
    await page.locator("#quick-answer").fill(`Quick answer ${i}`);
    await page.getByRole("button", { name: "Continue" }).click();
  }

  await expect(page.getByTestId("quick-reflection")).toBeVisible();
  await expect(page.getByText("Possible pattern signals")).toBeVisible();
});

test("quick assessment can transition to full process", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Try the 5-Question Quick Assessment" }).click();

  const answers = [
    "It takes me hours after interruptions.",
    "I figure it out by building.",
    "I want reasoning.",
    "I abandoned a process because it was rigid.",
    "I think best alone by writing.",
  ];

  for (const value of answers) {
    await page.locator("#quick-answer").fill(value);
    await page.getByRole("button", { name: "Continue" }).click();
  }

  await page.getByRole("button", { name: "Want to go deeper? Start Full Discovery" }).click();
  await expect(page.getByRole("heading", { name: "Phase 1: Systems Mapping" })).toBeVisible();
  await expect(page.getByTestId("progress-journey")).toBeVisible();
});

test("phase transitions and doctrine card generation", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Begin Discovery" }).click();

  await expect(page.getByTestId("phase-1-card")).toBeVisible();
  await expect(page.locator(".phase-transition").first()).toBeVisible();

  await page.locator('button[data-action="jump"][data-phase="4"]').click();
  await page.locator("#directive").fill("Preserve and extend cognitive momentum");
  await page.locator("#meta").fill("Does this preserve or degrade cognitive momentum?");
  await page.locator("#notes").fill("Restart cost is my dominant constraint.");
  await page.getByRole("button", { name: "Save" }).click();

  await expect(page.getByTestId("doctrine-card")).toBeVisible();
  await expect(page.getByRole("button", { name: "Copy as Text" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Copy as Image" })).toBeVisible();
});

test("session info panel appears after discovery starts", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Begin Discovery" }).click();

  await expect(page.locator("#session-info-panel")).toBeVisible();
  await page.locator("#session-info-panel summary").click();
  await expect(page.getByTestId("session-info-panel")).toContainText("Questions answered: 0 of 32");

  await page.locator("#phase1-answer").fill("I lose less energy when I can switch domains.");
  await page.getByRole("button", { name: "Save & Continue" }).click();
  await page.locator("#session-info-panel summary").click();
  await expect(page.getByTestId("session-info-panel")).toContainText("Questions answered: 1 of 32");
});

test("phase 2 generates heuristic observations for known signals", async ({ page }) => {
  const seeded = seededSession({
    currentPhase: 2,
    p1: {
      s: 0,
      q: 0,
      answers: {
        "energy-0": { text: "I recharge by switching and variety.", status: "answered" },
        "motivation-0": {
          text: "Momentum and forward progress keep me going.",
          status: "answered",
        },
        "identity-0": { text: "I should work like everyone else.", status: "answered" },
      },
    },
    p2: { themes: "", observations: [], observationResponses: {}, patterns: [] },
    p3: { analyses: {} },
  });

  await page.addInitScript(
    ([key, value]) => localStorage.setItem(key, JSON.stringify(value)),
    [STORAGE_KEY, seeded]
  );
  await page.goto("/");
  await page.getByRole("button", { name: "Continue Where I Left Off" }).click();

  await expect(page.getByRole("heading", { name: "Phase 2: Pattern Extraction" })).toBeVisible();
  await expect(page.getByTestId("phase2-observations")).toContainText("recharge through variety");
  await expect(page.getByTestId("phase2-observations")).toContainText(
    "gap between how you actually work"
  );
});

test("observation responses persist and prepopulate patterns", async ({ page }) => {
  const seeded = seededSession({
    currentPhase: 2,
    p1: {
      s: 0,
      q: 0,
      answers: {
        "energy-0": { text: "Switching and change restore me.", status: "answered" },
        "motivation-0": { text: "Momentum matters more than completion.", status: "answered" },
      },
    },
    p2: { themes: "", observations: [], observationResponses: {}, patterns: [] },
    p3: { analyses: {} },
  });

  await page.addInitScript(
    ([key, value]) => localStorage.setItem(key, JSON.stringify(value)),
    [STORAGE_KEY, seeded]
  );
  await page.goto("/");
  await page.getByRole("button", { name: "Continue Where I Left Off" }).click();

  await page.getByRole("button", { name: "Yes, that's right" }).first().click();
  const patternValues = await page
    .locator('textarea[data-kind="pattern"][data-field="statement"]')
    .allTextContents();
  expect(patternValues.some((value) => value.includes("recharge through variety"))).toBeTruthy();

  await page.getByRole("button", { name: "Partly - here's what's different" }).first().click();
  await page
    .locator('textarea[data-kind="observation-detail"]')
    .first()
    .fill("It is true, but mornings are different.");
  await page.getByRole("button", { name: "Save" }).click();

  const saved = await page.evaluate(
    (key) => JSON.parse(localStorage.getItem(key) || "{}"),
    STORAGE_KEY
  );
  const responses = Object.values(saved.p2.observationResponses || {});
  expect(
    responses.some((item) => item.choice === "partly" && item.detail.includes("mornings"))
  ).toBeTruthy();
});

test("doctrine scaffolding fields save to state", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Begin Discovery" }).click();
  await page.locator('button[data-action="jump"][data-phase="4"]').click();

  await page.locator("#scaffold-common").fill("Interruption and low clarity collapse my capacity.");
  await page.locator("#scaffold-protect").fill("Protect uninterrupted context.");
  await page.locator("#scaffold-depends").fill("Maintaining continuity of thought.");
  await page.getByRole("button", { name: "Save" }).click();

  const saved = await page.evaluate(
    (key) => JSON.parse(localStorage.getItem(key) || "{}"),
    STORAGE_KEY
  );
  expect(saved.p4.scaffold.commonThread).toContain("Interruption");
  expect(saved.p4.scaffold.protect).toContain("Protect uninterrupted");
  expect(saved.p4.scaffold.depends).toContain("continuity of thought");
});

test("migrates legacy tool-* phase1 answers to environment-* keys", async ({ page }) => {
  const seeded = seededSession({
    currentPhase: 1,
    p1: {
      s: 6,
      q: 1,
      answers: {
        "tool-1": {
          text: "Legacy answer for translation friction.",
          status: "answered",
          updatedAt: new Date().toISOString(),
        },
      },
    },
  });

  await page.addInitScript(
    ([key, value]) => localStorage.setItem(key, JSON.stringify(value)),
    [STORAGE_KEY, seeded]
  );
  await page.goto("/");
  await page.getByRole("button", { name: "Continue Where I Left Off" }).click();

  await expect(page.getByRole("heading", { name: "Phase 1: Systems Mapping" })).toBeVisible();
  await expect(page.getByText("System 7 of 7: Environment")).toBeVisible();
  await expect(page.locator("#phase1-answer")).toHaveValue(
    "Legacy answer for translation friction."
  );
});

test("visible copy does not use developer-only framing", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("body")).not.toContainText(/AI workflow/i);
  await expect(page.locator("body")).not.toContainText(/developer/i);
});
