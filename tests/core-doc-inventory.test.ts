import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { buildCandidateFamilyMap, buildCoreMarkdownInventory } from "../tools/migration/lib/inventory.js";
import { readGitMarkdownSnapshot } from "../tools/migration/lib/git-snapshot.js";
import { extractMarkdownLinks, extractRepositoryReferences } from "../tools/migration/lib/markdown-references.js";
import { createCoreDocRepository } from "./fixtures/core-doc-repository.js";

describe("Core Markdown inventory", () => {
  it("reads Markdown only from the requested immutable commit", async () => {
    const fixture = await createCoreDocRepository();
    await writeFile(join(fixture.root, "README.md"), "# Mutated worktree\n", "utf8");

    const snapshot = await readGitMarkdownSnapshot(fixture.root, fixture.commit);

    const inventory = await buildCoreMarkdownInventory({
      repositoryRoot: fixture.root,
      repositoryId: "repo-core",
      releaseLine: "V0_1_0a_1",
      sourceCommit: fixture.commit,
    });

    expect(inventory.files.map((file) => file.path)).toEqual([
      "README.md",
      "docs/CORE_ROUTE_SAMPLE.md",
    ]);
    expect(inventory.files[1]?.candidateFamily).toBe("core-route");
    expect(inventory.expectedFileCount).toBe(2);
    expect(inventory.files[0]?.title).toBe("Repository overview");
    expect(inventory.files[1]?.inboundMarkdownReferences).toEqual(["README.md"]);
    expect(snapshot[0]?.content).toContain("# Repository overview");
    expect(snapshot[0]?.content).not.toContain("# Mutated worktree");
    expect(snapshot[0]?.blobId).toMatch(/^[0-9a-f]{40}$/);
  });

  it("extracts only resolvable local Markdown links and visible repository references", () => {
    const markdown = [
      "[route](docs/CORE_ROUTE_SAMPLE.md#summary)",
      "[route with query](docs/CORE_ROUTE_SAMPLE.md?view=full)",
      "[external](https://example.invalid/guide.md)",
      "[mail](mailto:docs@example.invalid)",
      "![image](docs/CORE_ROUTE_SAMPLE.md)",
      "[reference][route-reference]",
      "[route-reference]: docs/CORE_ROUTE_SAMPLE.md",
      "`src/generation/runtime.ts` `tests/runtime.test.ts` `schemas/runtime.schema.json`",
      "",
      "```md",
      "[ignored](docs/CORE_ROUTE_SAMPLE.md)",
      "`src/ignored.ts`",
      "```",
    ].join("\n");

    expect(extractMarkdownLinks("README.md", markdown)).toEqual([
      { rawTarget: "docs/CORE_ROUTE_SAMPLE.md#summary", resolvedPath: "docs/CORE_ROUTE_SAMPLE.md" },
      { rawTarget: "docs/CORE_ROUTE_SAMPLE.md?view=full", resolvedPath: "docs/CORE_ROUTE_SAMPLE.md" },
      { rawTarget: "https://example.invalid/guide.md", resolvedPath: null },
      { rawTarget: "mailto:docs@example.invalid", resolvedPath: null },
    ]);
    expect(extractRepositoryReferences(markdown)).toEqual([
      { kind: "contract", target: "schemas/runtime.schema.json" },
      { kind: "code", target: "src/generation/runtime.ts" },
      { kind: "test", target: "tests/runtime.test.ts" },
    ]);
  });

  it("assigns every path to a deterministically sorted candidate family", async () => {
    const fixture = await createCoreDocRepository();
    const inventory = await buildCoreMarkdownInventory({
      repositoryRoot: fixture.root,
      repositoryId: "repo-core",
      releaseLine: "V0_1_0a_1",
      sourceCommit: fixture.commit,
    });

    expect(buildCandidateFamilyMap(inventory)).toMatchObject({
      inventoryDigest: inventory.sourceDigest,
      families: [
        { familyId: "core-route", reviewState: "pilot-reviewed" },
        { familyId: "long-tail", reviewState: "candidate" },
      ],
    });
  });
});
