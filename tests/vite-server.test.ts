import type { AddressInfo } from "node:net";
import { chromium, type Browser } from "playwright";
import { afterEach, describe, expect, it } from "vitest";
import { createServer, type ViteDevServer } from "vite";

let server: ViteDevServer | undefined;
let browser: Browser | undefined;

afterEach(async () => {
  await browser?.close();
  browser = undefined;
  await server?.close();
  server = undefined;
});

describe("local Vite server", () => {
  it("serves an empty diagnostics payload when no diagnostic sidecar exists", async () => {
    server = await createServer({
      configFile: "app/vite.config.ts",
      server: { host: "127.0.0.1", port: 0 },
    });
    await server.listen();
    const address = server.httpServer?.address() as AddressInfo;
    const baseUrl = `http://127.0.0.1:${address.port}`;

    const diagnosticsResponse = await fetch(`${baseUrl}/project-diagnostics.json`);
    const indexResponse = await fetch(`${baseUrl}/`);

    expect(diagnosticsResponse.status).toBe(200);
    expect(await diagnosticsResponse.json()).toEqual({ schemaVersion: 1, diagnostics: [] });
    expect(indexResponse.status).toBe(200);
    expect(await indexResponse.text()).toContain('id="root"');
  });

  it("renders the visible control room in a real dev page without page errors", async () => {
    server = await createServer({
      configFile: "app/vite.config.ts",
      server: { host: "127.0.0.1", port: 0 },
    });
    await server.listen();
    const address = server.httpServer?.address() as AddressInfo;
    const pageErrors: string[] = [];

    browser = await chromium.launch();
    const page = await browser.newPage();
    page.on("pageerror", (error) => pageErrors.push(error.message));

    await page.goto(`http://127.0.0.1:${address.port}/?node=flowdoc`);
    await page.getByRole("heading", { name: "FlowDoc control room" }).waitFor({ state: "visible" });

    expect(await page.getByRole("region", { name: "Repo Directory Overview" }).isVisible()).toBe(true);
    expect(await page.getByRole("button", { name: "Project Control overview" }).isVisible()).toBe(true);
    expect(pageErrors).toEqual([]);
  }, 15_000);

  it("keeps the overview and focused branch readable at desktop width", async () => {
    server = await createServer({
      configFile: "app/vite.config.ts",
      server: { host: "127.0.0.1", port: 0 },
    });
    await server.listen();
    const address = server.httpServer?.address() as AddressInfo;

    browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
    await page.goto(`http://127.0.0.1:${address.port}/?node=flowdoc`);
    await page.getByRole("heading", { name: "FlowDoc control room" }).waitFor({ state: "visible" });

    const overviewLayout = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      hasDirectory: document.querySelector(".control-room__directory") !== null,
    }));

    expect(overviewLayout.hasDirectory).toBe(true);
    expect(overviewLayout.scrollWidth).toBeLessThanOrEqual(overviewLayout.clientWidth);

    await page.getByRole("button", { name: "Project Control overview" }).click();
    await page.waitForURL(/node=project-control/);
    expect(page.url()).toContain("node=project-control");

    const focusedLayout = await page.evaluate(() => {
      const workTree = document.querySelector(".control-room__work-tree");
      const detail = document.querySelector(".control-room__detail");
      return {
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
        hasFocusedSections: workTree !== null && detail !== null,
        detailBesideWorkTree: detail!.getBoundingClientRect().top <= workTree!.getBoundingClientRect().top + 1,
      };
    });

    expect(focusedLayout.hasFocusedSections).toBe(true);
    expect(focusedLayout.scrollWidth).toBeLessThanOrEqual(focusedLayout.clientWidth);
    expect(focusedLayout.detailBesideWorkTree).toBe(true);
  }, 15_000);
});
