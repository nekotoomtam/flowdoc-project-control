import { expect, test } from "@playwright/test";

test("explores a node, reads its summary, and opens separated details", async ({ page }) => {
  await page.goto("/?node=flowdoc");
  expect(new URL(page.url()).hostname).toBe("127.0.0.1");
  await page.getByRole("button", { name: /Project Control/ }).click();
  await expect(page).toHaveURL(/\?node=project-control$/);
  await expect(page.getByRole("complementary")).toContainText("Project Control");
  await page.getByRole("button", { name: "View all" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("tab", { name: "Documents" }).click();
  await expect(page.getByRole("tabpanel")).toContainText("Architecture and GUI Design");
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: /FlowDoc, active branch/ }).click();
  await page.getByRole("button", { name: "Core, system node" }).click();
  await page.getByRole("button", { name: "View all" }).click();
  await page.getByRole("tab", { name: "Work" }).click();
  const workPanel = page.getByRole("tabpanel");
  await expect(workPanel).toContainText("Core Documentation Family Closure");
  await expect(workPanel).toContainText("Remaining Core Documentation Synthesis");
  await expect(workPanel).not.toContainText("CORE_ROUTE");
});

test("keeps URL and map synchronized with browser history", async ({ page }) => {
  await page.goto("/?node=flowdoc");
  await page.getByRole("button", { name: "Core, system node" }).click();
  await page.goBack();
  await expect(page).toHaveURL(/\?node=flowdoc$/);
  await expect(page.getByRole("button", { name: /FlowDoc, selected branch/ })).toBeVisible();
  await page.goForward();
  await expect(page).toHaveURL(/\?node=core$/);
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

test("keeps the control room readable at desktop and mobile widths", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/?node=flowdoc");
  const systemTree = await page.getByRole("navigation", { name: "System tree" }).boundingBox();
  const workTree = await page.getByRole("region", { name: "Work tree" }).boundingBox();
  const detail = await page.getByRole("complementary", { name: "Control detail" }).boundingBox();
  expect(systemTree).not.toBeNull();
  expect(workTree).not.toBeNull();
  expect(detail).not.toBeNull();
  expect(systemTree!.x + systemTree!.width).toBeLessThanOrEqual(workTree!.x);
  expect(workTree!.x + workTree!.width).toBeLessThanOrEqual(detail!.x);
  expect(detail!.width).toBeLessThanOrEqual(420);
  await page.screenshot({ path: testInfo.outputPath("desktop-light.png"), fullPage: true });

  await page.setViewportSize({ width: 390, height: 844 });
  const mobileSystemTree = await page.getByRole("navigation", { name: "System tree" }).boundingBox();
  const mobileWorkTree = await page.getByRole("region", { name: "Work tree" }).boundingBox();
  const mobileDetail = await page.getByRole("complementary", { name: "Control detail" }).boundingBox();
  expect(mobileWorkTree!.y).toBeGreaterThan(mobileSystemTree!.y + mobileSystemTree!.height - 1);
  expect(mobileDetail!.y).toBeGreaterThan(mobileWorkTree!.y + mobileWorkTree!.height - 1);
  await page.screenshot({ path: testInfo.outputPath("mobile-light.png"), fullPage: true });
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
