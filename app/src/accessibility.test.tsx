import { readFile } from "node:fs/promises";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { App } from "./App.js";
import { makeProjectReadModel } from "./test/projectModel.js";

const model = makeProjectReadModel();
const directoryModel = makeProjectReadModel({
  nodes: [
    { ...model.nodes[0]!, childIds: ["project-control"] },
    {
      ...model.nodes[0]!,
      id: "project-control",
      title: "Project Control",
      parentId: "flowdoc",
      truthState: "current",
      childIds: [],
      repositoryIds: ["repo-project-control"],
    },
  ],
  repositories: [{
    kind: "repository",
    id: "repo-project-control",
    name: "Flowdoc Project Control",
    remote: "https://example.test/project-control.git",
    checkoutAlias: "project-control",
    defaultBranch: "main",
    ownershipSummary: "Project Control owner.",
  }],
});

describe("accessible visual system", () => {
  it("exposes overview areas and surface selection without relying on color", () => {
    history.replaceState(null, "", "/?node=flowdoc");
    render(<App initialModel={directoryModel} />);

    expect(screen.getByRole("region", { name: "Repo Directory Overview" })).toBeVisible();
    expect(screen.getByRole("navigation", { name: "Control room surfaces" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Overview" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Project Control overview" })).toBeVisible();
  });

  it("marks the current focused node semantically", () => {
    history.replaceState(null, "", "/?node=project-control");
    render(<App initialModel={directoryModel} />);

    expect(screen.getByRole("button", { name: /Project Control, selected branch/ }))
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
