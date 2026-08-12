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

  it("renders the visible focus map in a real dev page without page errors", async () => {
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
    await page.getByTestId("focus-stack-map").waitFor({ state: "visible" });

    expect(await page.getByRole("button", { name: /Flowdoc, Current/ }).isVisible()).toBe(true);
    expect(pageErrors).toEqual([]);
  }, 15_000);
});
