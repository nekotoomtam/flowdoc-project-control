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
  it("returns 404 for an absent diagnostics file while serving the application index", async () => {
    server = await createServer({
      configFile: "app/vite.config.ts",
      server: { host: "127.0.0.1", port: 0 },
    });
    await server.listen();
    const address = server.httpServer?.address() as AddressInfo;
    const baseUrl = `http://127.0.0.1:${address.port}`;

    const diagnosticsResponse = await fetch(`${baseUrl}/project-diagnostics.json`);
    const indexResponse = await fetch(`${baseUrl}/`);

    expect(diagnosticsResponse.status).toBe(404);
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

    expect(await page.getByRole("button", { name: /FlowDoc, selected branch/ }).isVisible()).toBe(true);
    expect(pageErrors).toEqual([]);
  }, 15_000);

  it("fits narrow and desktop viewports without horizontal overflow", async () => {
    server = await createServer({
      configFile: "app/vite.config.ts",
      server: { host: "127.0.0.1", port: 0 },
    });
    await server.listen();
    const address = server.httpServer?.address() as AddressInfo;

    browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 320, height: 640 } });
    await page.goto(`http://127.0.0.1:${address.port}/?node=flowdoc`);
    await page.getByRole("heading", { name: "FlowDoc control room" }).waitFor({ state: "visible" });

    for (const [width, detailBelowWorkTree] of [[320, true], [390, true], [1280, false]] as const) {
      await page.setViewportSize({ width, height: 640 });
      const layout = await page.evaluate(() => {
        const workTree = document.querySelector(".control-room__work-tree");
        const detail = document.querySelector(".control-room__detail");
        return {
          clientWidth: document.documentElement.clientWidth,
          scrollWidth: document.documentElement.scrollWidth,
          scrollHeight: document.documentElement.scrollHeight,
          clientHeight: document.documentElement.clientHeight,
          detailBelowWorkTree: detail!.getBoundingClientRect().top > workTree!.getBoundingClientRect().top,
        };
      });

      if (width === 320) {
        expect(layout.scrollHeight).toBeGreaterThan(layout.clientHeight);
      }
      expect(layout.scrollWidth).toBeLessThanOrEqual(layout.clientWidth);
      expect(layout.detailBelowWorkTree).toBe(detailBelowWorkTree);
    }
  }, 15_000);
});
