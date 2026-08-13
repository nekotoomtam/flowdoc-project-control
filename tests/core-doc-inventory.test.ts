import { execFile as execFileCallback } from "node:child_process";
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { promisify } from "node:util";
import { describe, expect, it } from "vitest";

import { runInventoryCli } from "../tools/migration/inventory-core-docs.js";
import { buildCandidateFamilyMap, buildCoreMarkdownInventory } from "../tools/migration/lib/inventory.js";
import { readGitMarkdownSnapshot } from "../tools/migration/lib/git-snapshot.js";
import { extractMarkdownLinks, extractRepositoryReferences } from "../tools/migration/lib/markdown-references.js";
import { createCoreDocRepository } from "./fixtures/core-doc-repository.js";

const execFile = promisify(execFileCallback);

const semanticFamilyCases = [
  [".superpowers/sdd/2026-07-31-unified-incremental-root-transition-5b-1-corrective/collision-fix-report.md", "live-draft"],
  [".superpowers/sdd/2026-07-31-unified-incremental-root-transition-5b-1-corrective/delivery-fix-report.md", "live-draft"],
  [".superpowers/sdd/2026-07-31-unified-incremental-root-transition-5b-1-v3-corrective/final-review-verdict.md", "live-draft"],
  [".superpowers/sdd/2026-07-31-unified-incremental-root-transition-5b-1-v3-corrective/final-verification.md", "live-draft"],
  [".superpowers/sdd/2026-07-31-unified-incremental-root-transition-5b-1-v3-corrective/source-envelope-verification.md", "live-draft"],
  ["AGENTS.md", "repository-operations"],
  ["README.md", "vnext-core"],
  ["docs/CURRENT_STATUS.md", "project-state"],
  ["docs/DOCUMENT_MAP.md", "canonical-documentation"],
  ["docs/FIVE_LANE_PROJECT_PROGRESS_INDEX.md", "project-state"],
  ["docs/GLOSSARY.md", "glossary"],
  ["docs/GLOSSARY_TH.md", "glossary"],
  ["docs/NEXT_PHASE_POINTER.md", "project-state"],
  ["docs/PHASE_18_IMPLEMENTATION_ROADMAP.md", "project-state"],
  ["docs/PHASE_LEDGER.md", "project-state"],
  ["docs/VERSION_POLICY.md", "versioning"],
  ["docs/coordination/BOUNDARY.md", "workspace-boundary"],
  ["docs/project/CURRENT_STATE.md", "project-state"],
  ["docs/project/KNOWN_UNKNOWNS.md", "project-state"],
  ["docs/project/RISK_REGISTER.md", "project-state"],
  ["docs/project/ROADMAP.md", "project-state"],
  ["docs/superpowers/plans/2026-07-21-text-block-complete-geometry-boundary.md", "live-draft"],
  ["docs/superpowers/plans/2026-07-22-persistent-text-block-flow-tree-foundation.md", "live-draft"],
  ["docs/superpowers/plans/2026-07-27-core-spatial-wrapping-3a.md", "live-draft"],
  ["docs/superpowers/plans/2026-07-27-initial-text-block-authored-box-geometry-4a.md", "live-draft"],
  ["docs/superpowers/plans/2026-07-27-inline-image-line-box-geometry-4b.md", "live-draft"],
  ["docs/superpowers/plans/2026-07-28-unified-text-block-retained-root-5a.md", "live-draft"],
  ["docs/superpowers/plans/2026-07-30-unified-incremental-root-transition-5b.md", "live-draft"],
  ["docs/superpowers/plans/2026-07-31-unified-incremental-root-transition-5b-1-corrective.md", "live-draft"],
  ["docs/superpowers/plans/2026-07-31-unified-incremental-root-transition-5b-1-prebinding-source-envelope-amendment.md", "live-draft"],
  ["docs/superpowers/plans/2026-07-31-unified-incremental-root-transition-5b-1-v3-corrective.md", "live-draft"],
  ["docs/superpowers/plans/2026-08-01-unified-incremental-root-transition-5b-2-v3.md", "live-draft"],
  ["docs/superpowers/plans/2026-08-02-unified-incremental-root-transition-5b-2-evidence-v2.md", "live-draft"],
  ["docs/superpowers/plans/2026-08-03-producer-invocation-authority-boundary.md", "live-draft"],
  ["docs/superpowers/plans/2026-08-03-unified-incremental-root-transition-5b-2-rebaseline-review-th.md", "live-draft"],
  ["docs/superpowers/plans/2026-08-03-unified-incremental-root-transition-5b-2-rebaseline.md", "live-draft"],
  ["docs/superpowers/plans/2026-08-09-unified-incremental-root-transition-5b2-plan-a-review-th.md", "live-draft"],
  ["docs/superpowers/plans/2026-08-09-unified-incremental-root-transition-5b2-plan-a-source-authority.md", "live-draft"],
  ["docs/superpowers/plans/2026-08-11-canonical-documentation-d0-d2.md", "canonical-documentation"],
  ["docs/superpowers/plans/2026-08-11-source-commit-transaction-seam-revised.md", "live-draft"],
  ["docs/superpowers/plans/2026-08-11-source-commit-transaction-seam.md", "live-draft"],
  ["docs/superpowers/specs/2026-07-21-persistent-text-block-spatial-flow-design.md", "live-draft"],
  ["docs/superpowers/specs/2026-07-27-initial-text-block-authored-box-geometry-design.md", "live-draft"],
  ["docs/superpowers/specs/2026-07-27-inline-image-line-box-geometry-design.md", "live-draft"],
  ["docs/superpowers/specs/2026-07-28-unified-incremental-live-draft-product-readiness-design.md", "live-draft"],
  ["docs/superpowers/specs/2026-07-30-unified-incremental-root-transition-5b-design.md", "live-draft"],
  ["docs/superpowers/specs/2026-07-31-unified-incremental-root-transition-5b-1-corrective-design.md", "live-draft"],
  ["docs/superpowers/specs/2026-07-31-unified-incremental-root-transition-5b-1-prebinding-source-envelope-amendment-design.md", "live-draft"],
  ["docs/superpowers/specs/2026-08-01-unified-incremental-root-transition-5b-2-v3-amendment-design.md", "live-draft"],
  ["docs/superpowers/specs/2026-08-02-unified-incremental-source-topology-and-fallback-target-design-correction.md", "live-draft"],
  ["docs/superpowers/specs/2026-08-02-unified-incremental-transition-evidence-v2-design-correction.md", "live-draft"],
  ["docs/superpowers/specs/2026-08-03-producer-invocation-authority-boundary-design.md", "live-draft"],
  ["docs/superpowers/specs/2026-08-03-unified-incremental-root-transition-5b-2-plan-lock-design-correction-review-th.md", "live-draft"],
  ["docs/superpowers/specs/2026-08-03-unified-incremental-root-transition-5b-2-plan-lock-design-correction.md", "live-draft"],
  ["docs/superpowers/specs/2026-08-09-unified-incremental-root-transition-5b2-continuation-rebaseline-design.md", "live-draft"],
  ["docs/superpowers/specs/2026-08-10-source-commit-transaction-glossary-th.md", "live-draft"],
  ["docs/superpowers/specs/2026-08-10-source-commit-transaction-glossary.md", "live-draft"],
  ["docs/superpowers/specs/2026-08-10-source-commit-transaction-seam-design.md", "live-draft"],
  ["docs/superpowers/specs/2026-08-11-canonical-documentation-versioning-design.md", "canonical-documentation"],
  ["docs/superpowers/specs/2026-08-11-source-commit-transaction-seam-review-amendment-design.md", "live-draft"],
  ["docs/versions/0_1/CAPABILITY_SET.md", "versioning"],
  ["docs/versions/0_1/COMPATIBILITY.md", "versioning"],
  ["docs/versions/0_1/VERSION_OVERVIEW.md", "versioning"],
  ["examples/template-builder-sandbox/README.md", "template-builder"],
  ["packages/pdf-renderer-pilot/README.md", "pdf-renderer"],
  ["packages/text-engine-rust-wasm/README.md", "text-engine"],
  ["packages/uat-realdoc/README.md", "pdf-export"],
] as const;

describe("Core Markdown inventory", () => {
  it("publishes deterministic path-free artifacts only for the authorized source commit", async () => {
    const fixture = await createCoreDocRepository();
    const outputRoot = await mkdtemp(join(tmpdir(), "flowdoc-core-inventory-output-"));
    const args = [
      "--source-root", fixture.root,
      "--source-commit", fixture.commit,
      "--output-root", outputRoot,
    ];

    await runInventoryCli(args, fixture.commit);

    const firstInventory = await readFile(join(outputRoot, "inventory.json"), "utf8");
    const firstFamilyMap = await readFile(join(outputRoot, "family-map.json"), "utf8");
    expect(firstInventory.endsWith("\n")).toBe(true);
    expect(firstFamilyMap.endsWith("\n")).toBe(true);
    const combinedArtifacts = `${firstInventory}${firstFamilyMap}`;
    expect(combinedArtifacts).not.toContain(JSON.stringify(fixture.root).slice(1, -1));
    expect(combinedArtifacts).not.toContain(fixture.root.replaceAll("\\", "/"));

    await runInventoryCli(args, fixture.commit);

    expect(await readFile(join(outputRoot, "inventory.json"), "utf8")).toBe(firstInventory);
    expect(await readFile(join(outputRoot, "family-map.json"), "utf8")).toBe(firstFamilyMap);

    await expect(runInventoryCli([
      "--source-root", fixture.root,
      "--source-commit", "not-a-commit",
      "--output-root", outputRoot,
    ], fixture.commit)).rejects.toThrow(/40 hexadecimal characters/);

    await expect(runInventoryCli([
      "--source-root", fixture.root,
      "--source-commit", "a".repeat(40),
      "--output-root", outputRoot,
    ], fixture.commit)).rejects.toThrow(/expected source commit/i);

    await expect(runInventoryCli(args)).rejects.toThrow(/expected source commit/i);
  });

  it("rejects unknown and duplicate CLI flags", async () => {
    const fixture = await createCoreDocRepository();
    const outputRoot = await mkdtemp(join(tmpdir(), "flowdoc-core-inventory-output-"));

    await expect(runInventoryCli([
      "--source-root", fixture.root,
      "--source-commit", fixture.commit,
      "--output-root", outputRoot,
      "--unexpected", "value",
    ], fixture.commit)).rejects.toThrow(/unknown flag/i);

    await expect(runInventoryCli([
      "--source-root", fixture.root,
      "--source-root", fixture.root,
      "--source-commit", fixture.commit,
      "--output-root", outputRoot,
    ], fixture.commit)).rejects.toThrow(/duplicate flag/i);
  });

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
      "[spaced plan](<docs/Project Plan.md>)",
      "[runtime source](<src/generation/runtime plan.ts>)",
      "[external](https://example.invalid/guide.md)",
      "[mail](mailto:docs@example.invalid)",
      "![image](docs/CORE_ROUTE_SAMPLE.md)",
      "[reference][route-reference]",
      "[route-reference]: docs/CORE_ROUTE_SAMPLE.md",
      "`[obsolete](docs/CORE_ROUTE_SAMPLE.md)`",
      "`src/generation/runtime.ts` `tests/runtime.test.ts` `schemas/runtime.schema.json`",
      "` src/generation/padded.ts ` `src/generation/not a path.ts`",
      "",
      "```md",
      "[ignored](docs/CORE_ROUTE_SAMPLE.md)",
      "```not-a-closer",
      "[still ignored](docs/CORE_ROUTE_SAMPLE.md)",
      "`src/ignored.ts`",
      "```",
    ].join("\n");

    expect(extractMarkdownLinks("README.md", markdown)).toEqual([
      { rawTarget: "docs/CORE_ROUTE_SAMPLE.md#summary", resolvedPath: "docs/CORE_ROUTE_SAMPLE.md" },
      { rawTarget: "docs/CORE_ROUTE_SAMPLE.md?view=full", resolvedPath: "docs/CORE_ROUTE_SAMPLE.md" },
      { rawTarget: "docs/Project Plan.md", resolvedPath: "docs/Project Plan.md" },
      { rawTarget: "https://example.invalid/guide.md", resolvedPath: null },
      { rawTarget: "mailto:docs@example.invalid", resolvedPath: null },
      { rawTarget: "src/generation/runtime plan.ts", resolvedPath: null },
    ]);
    expect(extractRepositoryReferences(markdown)).toEqual([
      { kind: "contract", target: "schemas/runtime.schema.json" },
      { kind: "code", target: "src/generation/padded.ts" },
      { kind: "code", target: "src/generation/runtime plan.ts" },
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
        { familyId: "vnext-core", reviewState: "candidate" },
      ],
    });
  });

  it("keeps reviewed semantic path overrides stable", async () => {
    const fixture = await createCoreDocRepository();
    for (const [path] of semanticFamilyCases) {
      const absolutePath = join(fixture.root, path);
      await mkdir(dirname(absolutePath), { recursive: true });
      await writeFile(absolutePath, `# ${path}\n`, "utf8");
    }
    await execFile("git", ["add", "."], { cwd: fixture.root });
    await execFile("git", ["commit", "-m", "semantic family fixture"], { cwd: fixture.root });
    const { stdout } = await execFile("git", ["rev-parse", "HEAD"], {
      cwd: fixture.root,
      encoding: "utf8",
    });

    const inventory = await buildCoreMarkdownInventory({
      repositoryRoot: fixture.root,
      repositoryId: "repo-core",
      releaseLine: "V0_1_0a_1",
      sourceCommit: stdout.trim(),
    });
    const familiesByPath = Object.fromEntries(
      inventory.files.map((file) => [file.path, file.candidateFamily]),
    );

    expect(familiesByPath).toMatchObject(Object.fromEntries(semanticFamilyCases));
  });
});
