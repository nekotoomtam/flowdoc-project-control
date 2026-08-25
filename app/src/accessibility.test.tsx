import { readFile } from "node:fs/promises";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { App } from "./App.js";
import { makeProjectReadModel } from "./test/projectModel.js";

const model = makeProjectReadModel();

describe("accessible visual system", () => {
  it("exposes map levels and current selection without relying on color", () => {
    render(<App initialModel={model} />);

    expect(screen.getByRole("navigation", { name: "System tree" })).toBeVisible();
    expect(screen.getByRole("region", { name: "Work tree" })).toBeVisible();
    expect(screen.getByRole("button", { name: /Flowdoc, selected branch/ })).toBeVisible();
  });

  it("marks the current node semantically", () => {
    render(<App initialModel={model} />);

    expect(screen.getByRole("button", { name: /Flowdoc, selected branch/ }))
      .toHaveAttribute("aria-current", "page");
  });

  it("ships visible focus and reduced-motion rules", async () => {
    const css = await readFile("app/src/styles/accessibility.css", "utf8");

    expect(css).toContain(":focus-visible");
    expect(css).toContain("@media (prefers-reduced-motion: reduce)");
    expect(css).not.toMatch(/:focus-visible[^}]*outline:\s*none/);
  });

  it("allows the page to fit a 320px viewport when a scrollbar consumes inline space", async () => {
    const css = await readFile("app/src/styles/base.css", "utf8");

    expect(css).not.toMatch(/body\s*{[^}]*min-width:\s*20rem/i);
  });
});
