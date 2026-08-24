import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { resolveCoreEvidenceRoot } from "./core-evidence-root.js";
import { expectFrozenCurrentSourceProvenance } from "./template-builder-source-provenance.js";

const root = process.cwd();
const frozenSourceCommit = "76a2f2311a898e781f53773390d47b05812911e4";
const currentEvidenceCommit = "c503a45c03e0ce3b7a6efba2b029ca842017faa0";
const expectedLeafPath = "docs/versions/V0_1_0a_1/core/text-block/v1-grammar-and-migration-history.md";
const coreEvidenceRoot = resolveCoreEvidenceRoot(root);

const headings = [
  "## Authority and Scope",
  "## Historical V1 Grammar Intent",
  "## Pure Validation and Normalization Boundary",
  "## Canonical Empty-text Producers",
  "## Active Acceptance and Copy-forward Decision",
  "## Historical Absence and Later Bounded V4 Evidence",
  "## Explicit Exclusions",
  "## Current Verified State",
  "## Known Limits and Unknowns",
  "## Canonical Cross-references",
  "## Evidence Anchors",
] as const;

interface Subgroup {
  subgroupId: string;
  sourcePaths: string[];
  proposedLeafPath: string;
}

interface Orientation {
  sourceCommit: string;
  families: Array<{ familyId: string; subgroups: Subgroup[] }>;
}

async function readOrientation(): Promise<Orientation> {
  return JSON.parse(
    await readFile(join(root, "migrations/V0_1_0a_1/core/wave-a-orientation.json"), "utf8"),
  ) as Orientation;
}

function v1Subgroup(orientation: Orientation): Subgroup {
  const subgroup = orientation.families
    .filter((family) => family.familyId === "text-block")
    .flatMap((family) => family.subgroups)
    .find((candidate) => candidate.subgroupId === "v1-grammar-and-migration");
  if (!subgroup) throw new Error("Missing Text Block v1 grammar and migration subgroup");
  return subgroup;
}

async function readLeaf(): Promise<{ subgroup: Subgroup; leaf: string }> {
  const subgroup = v1Subgroup(await readOrientation());
  return { subgroup, leaf: await readFile(join(root, subgroup.proposedLeafPath), "utf8") };
}

function expectImmutableCoreAnchors(leaf: string): void {
  const anchors = [...leaf.matchAll(/flowdoc-vnext-core@([^:\s`]+):[^\s`]+/g)];
  expect(anchors.length).toBeGreaterThanOrEqual(7);
  for (const [, commit] of anchors) expect(commit).toBe(currentEvidenceCommit);
  expect(leaf).not.toMatch(/flowdoc-vnext-core@(?!c503a45c03e0ce3b7a6efba2b029ca842017faa0:)/);
}

function expectNoFormerSourceLeakage(value: string, sourcePaths: readonly string[]): void {
  for (const sourcePath of sourcePaths) expect(value).not.toContain(sourcePath);
}

function expectBoundedClaims(leaf: string): void {
  expect(leaf).not.toMatch(/active migration executor/i);
  expect(leaf).not.toMatch(/editor\/backend integration/i);
  expect(leaf).not.toMatch(/pagination readiness/i);
  expect(leaf).not.toMatch(/renderer readiness/i);
  expect(leaf).not.toMatch(/collaboration readiness/i);
  expect(leaf).not.toMatch(/production readiness/i);
}

describe("Text Block v1 grammar and migration history documentation leaf", () => {
  it("derives the unique four-source subgroup and freezes each source blob at both Core commits", async () => {
    const orientation = await readOrientation();
    const subgroup = v1Subgroup(orientation);

    expect(orientation.sourceCommit).toBe(frozenSourceCommit);
    expect(subgroup.proposedLeafPath).toBe(expectedLeafPath);
    expect(subgroup.sourcePaths).toHaveLength(4);
    expect(new Set(subgroup.sourcePaths).size).toBe(4);
    await expectFrozenCurrentSourceProvenance({
      projectRoot: root,
      coreEvidenceRoot,
      sourcePaths: subgroup.sourcePaths,
      expectedCount: 4,
      expectedFingerprint: "8e10ab211330edf84113c75bd9eab928596ff6505c4e1115ef417fbe378c1707",
      frozenCommit: frozenSourceCommit,
      currentCommit: currentEvidenceCommit,
    });
  });

  it("keeps the candidate leaf historical, bounded, and cross-linked", async () => {
    const { subgroup, leaf } = await readLeaf();

    expect(leaf.match(/^## .+$/gm) ?? []).toEqual(headings);
    expect(leaf).toContain("4 assigned / 4 unique / 0 missing / 0 extra / 0 drift");
    expect(leaf).toMatch(/historical v1 intent/i);
    expect(leaf).toMatch(/current bounded v4 evidence/i);
    expect(leaf).toMatch(/historical absence of v4 parser\/migration activation/i);
    expect(leaf).toMatch(/does not deny later bounded v4 implementation/i);
    expect(leaf).toContain("](v4-authoring-and-inline.md)");
    expect(leaf).toContain("](v4-measurement-and-pagination.md)");
    expectBoundedClaims(leaf);
    expectImmutableCoreAnchors(leaf);
    expectNoFormerSourceLeakage(leaf, subgroup.sourcePaths);
  });

  it("rejects former-source leakage, mutable Core references, and unbounded claims", async () => {
    const { subgroup, leaf } = await readLeaf();
    const testSource = await readFile(new URL(import.meta.url), "utf8");
    const formerSource = subgroup.sourcePaths[0];
    if (!formerSource) throw new Error("Expected four frozen sources");

    expectNoFormerSourceLeakage(testSource, subgroup.sourcePaths);
    expect(() => expectNoFormerSourceLeakage(`${leaf}\n${formerSource}`, subgroup.sourcePaths)).toThrow();
    expect(() => expectNoFormerSourceLeakage(`${testSource}\n${formerSource}`, subgroup.sourcePaths)).toThrow();
    expect(() => expectImmutableCoreAnchors(`${leaf}\nflowdoc-vnext-core@main:src/example.ts`)).toThrow();
    expect(() => expectBoundedClaims(`${leaf}\nactive migration executor`)).toThrow();
  });
});
