import { expect, test } from "@playwright/test";

test("explores a node, reads its summary, and opens separated details", async ({ page }) => {
  await page.goto("/?node=flowdoc");
  expect(new URL(page.url()).hostname).toBe("127.0.0.1");
  await expect(page.getByRole("region", { name: "Repo Directory Overview" })).toBeVisible();
  await page.getByRole("button", { name: "Project Control overview" }).click();
  await expect(page).toHaveURL(/\?node=project-control$/);
  await expect(page.getByRole("complementary")).toContainText("Project Control");
  await page.getByRole("button", { name: "View all" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("tab", { name: "Documents" }).click();
  await expect(page.getByRole("tabpanel")).toContainText("Architecture and GUI Design");
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: /FlowDoc, active branch/ }).click();
  await page.getByRole("button", { name: "Core overview" }).click();
  await page.getByRole("button", { name: "View all" }).click();
  await page.getByRole("tab", { name: "Work" }).click();
  const workPanel = page.getByRole("tabpanel");
  await expect(workPanel).toContainText("Core Documentation Family Closure");
  await expect(workPanel).toContainText("Remaining Core Documentation Synthesis");
  await expect(workPanel).not.toContainText("CORE_ROUTE");
});

test("keeps URL and map synchronized with browser history", async ({ page }) => {
  await page.goto("/?node=flowdoc");
  await page.getByRole("button", { name: "Core overview" }).click();
  await page.goBack();
  await expect(page).toHaveURL(/\?node=flowdoc$/);
  await expect(page.getByRole("region", { name: "Repo Directory Overview" })).toBeVisible();
  await page.goForward();
  await expect(page).toHaveURL(/\?node=core$/);
});

test("opens work history as a separate surface and returns to focused overview", async ({ page }) => {
  await page.goto("/?node=flowdoc");
  await page.getByRole("button", { name: "Work History" }).click();
  await expect(page.getByRole("region", { name: "Work History View" })).toBeVisible();
  await expect(page.getByRole("region", { name: "Work tree" })).toHaveCount(0);
  await page.getByRole("button", { name: "Focus Project Control in Overview" }).first().click();
  await expect(page).toHaveURL(/\?node=project-control$/);
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.getByRole("complementary", { name: "Control detail" })).toContainText("Project Control");
});

test("shows diagnostics for a malformed served index", async ({ page }) => {
  await page.route("**/project-index.json", (route) => route.fulfill({
    contentType: "application/json",
    body: JSON.stringify({ schemaVersion: 99 }),
  }));
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Project data needs attention" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "FlowDoc control room" })).toHaveCount(0);
});

test("keeps the overview and focused branch readable at desktop width", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/?node=flowdoc");
  const overview = await page.getByRole("region", { name: "Repo Directory Overview" }).boundingBox();
  expect(overview).not.toBeNull();
  expect(overview!.width).toBeGreaterThan(1000);
  await page.screenshot({ path: testInfo.outputPath("overview-desktop.png"), fullPage: true });

  await page.getByRole("button", { name: "Project Control overview" }).click();
  const systemTree = await page.getByRole("navigation", { name: "System tree" }).boundingBox();
  const workTree = await page.getByRole("region", { name: "Work tree" }).boundingBox();
  const detail = await page.getByRole("complementary", { name: "Control detail" }).boundingBox();
  expect(systemTree).not.toBeNull();
  expect(workTree).not.toBeNull();
  expect(detail).not.toBeNull();
  expect(systemTree!.x + systemTree!.width).toBeLessThanOrEqual(workTree!.x);
  expect(workTree!.x + workTree!.width).toBeLessThanOrEqual(detail!.x);
  expect(detail!.width).toBeLessThanOrEqual(420);
  await page.screenshot({ path: testInfo.outputPath("focused-desktop.png"), fullPage: true });
});

test("opens full detail as a centered overlay", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/?node=project-control");
  await page.getByRole("button", { name: "View all" }).click();
  const dialog = await page.getByRole("dialog").boundingBox();
  expect(dialog).not.toBeNull();
  expect(dialog!.width).toBeLessThan(1296);
  expect(Math.abs(dialog!.x + dialog!.width / 2 - 720)).toBeLessThan(4);
});
