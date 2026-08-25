import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { resolveCoreEvidenceRoot } from "./core-evidence-root.js";

describe("Core evidence root resolution", () => {
  const repositoriesRoot = resolve("C:/workspace/repositories");
  const projectControlRoot = resolve(repositoriesRoot, "flowdoc-project-control");
  const expectedCoreEvidenceRoot = resolve(
    repositoriesRoot,
    "flowdoc-vnext-core",
  );

  it("resolves the sibling Core checkout from the Project Control main checkout", () => {
    expect(resolveCoreEvidenceRoot(projectControlRoot)).toBe(expectedCoreEvidenceRoot);
  });

  it("resolves the same Core checkout from a linked Project Control worktree", () => {
    const linkedWorktreeRoot = resolve(
      projectControlRoot,
      ".worktrees",
      "verification-debt-cleanup",
    );

    expect(resolveCoreEvidenceRoot(linkedWorktreeRoot)).toBe(expectedCoreEvidenceRoot);
  });
});
