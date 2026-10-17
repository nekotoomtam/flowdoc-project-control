import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { resolveCoreEvidenceRoot } from "./core-evidence-root.js";
import { expectFrozenCurrentSourceProvenance } from "./template-builder-source-provenance.js";

const root = process.cwd();
const frozenSourceCommit = "76a2f2311a898e781f53773390d47b05812911e4";
const currentEvidenceCommit = "c503a45c03e0ce3b7a6efba2b029ca842017faa0";
const coreEvidenceRoot = resolveCoreEvidenceRoot(root);

const commonHeadings = [
  "## Authority and Scope",
  "## Responsibility Boundary",
  "## State and Failure Model",
  "## Current Verified State",
  "## Known Limits and Unknowns",
  "## Historical Design Notes",
  "## Canonical Cross-references",
  "## Evidence Anchors",
] as const;

const authorityHeadings = [
  "## Producer Invocation",
  "## Source Topology",
  "## Fallback Target",
  "## Evidence and Work Ownership",
  "## Source Authority Internals",
  "## Source-commit Transaction Seam",
  "## Approved Amendment Precedence",
  "## Bilingual Terminology",
] as const;

const correctiveHeadings = [
  "## Collision Repair",
  "## Delivery Repair",
  "## Source-envelope Verification",
  "## Final Verification",
  "## Final Scoped Verdict",
  "## Residual-risk Boundaries",
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
  return JSON.parse(await readFile(join(root, "migrations/V0_1_0a_1/core/wave-a-orientation.json"), "utf8")) as Orientation;
}

function subgroupFor(orientation: Orientation, subgroupId: string): Subgroup {
  const subgroup = orientation.families
    .filter((family) => family.familyId === "live-draft")
    .flatMap((family) => family.subgroups)
    .find((candidate) => candidate.subgroupId === subgroupId);
  if (!subgroup) throw new Error(`Missing Live Draft subgroup: ${subgroupId}`);
  return subgroup;
}

async function leafFor(subgroupId: string): Promise<{ subgroup: Subgroup; leaf: string }> {
  const subgroup = subgroupFor(await readOrientation(), subgroupId);
  return { subgroup, leaf: await readFile(join(root, subgroup.proposedLeafPath), "utf8") };
}

async function expectFrozenCurrentProvenance(
  subgroup: Subgroup,
  expectedCount: number,
  expectedFingerprint: string,
): Promise<void> {
  await expectFrozenCurrentSourceProvenance({
    projectRoot: root,
    coreEvidenceRoot,
    sourcePaths: subgroup.sourcePaths,
    expectedCount,
    expectedFingerprint,
    frozenCommit: frozenSourceCommit,
    currentCommit: currentEvidenceCommit,
  });
}

function expectHeadings(leaf: string, headings: readonly string[]): void {
  expect(leaf.match(/^## .+$/gmu) ?? []).toEqual(headings);
}

function expectImmutableCoreAnchors(leaf: string, minimum: number): void {
  const anchors = [...leaf.matchAll(/flowdoc-vnext-core@([^:\s`]+):[^\s`]+/g)];
  expect(anchors.length).toBeGreaterThanOrEqual(minimum);
  for (const [, commit] of anchors) expect(commit).toBe(currentEvidenceCommit);
  expect(leaf).not.toMatch(/flowdoc-vnext-core@(?!c503a45c03e0ce3b7a6efba2b029ca842017faa0:)/);
}

function expectNoFormerSourceLeakage(value: string, sourcePaths: readonly string[]): void {
  for (const sourcePath of sourcePaths) expect(value).not.toContain(sourcePath);
}

function expectAuthorityBoundaries(leaf: string): void {
  expect(leaf).not.toMatch(/2026-08-10 seam design overrides the approved amendment/i);
  expect(leaf).not.toMatch(/Thai and English companion terms have different authority/i);
  expect(leaf).not.toMatch(/transaction internals activate generic product integration/i);
  expect(leaf).not.toMatch(/generic product integration is active/i);
}

function expectCorrectiveBoundaries(leaf: string): void {
  expect(leaf).not.toMatch(/a scoped review applies outside its commit or test range/i);
  expect(leaf).not.toMatch(/a later PASS erases an earlier local repair concern/i);
  expect(leaf).not.toMatch(/corrective evidence is a normative implementation contract/i);
  expect(leaf).not.toMatch(/scoped PASS (?:is|becomes) family-wide/i);
}

describe("Live Draft source-authority and corrective documentation leaves", () => {
  it("derives the 20-source authority leaf and preserves authority-specific sections", async () => {
    const { subgroup, leaf } = await leafFor("source-authority-and-commit-transaction");

    expect((await readOrientation()).sourceCommit).toBe(frozenSourceCommit);
    await expectFrozenCurrentProvenance(subgroup, 20, "51043750a234b6af0119a3f24bfa416d1ce0b9140873323b26391758672e2b20");
    expectHeadings(leaf, [...commonHeadings.slice(0, 2), ...authorityHeadings, ...commonHeadings.slice(2)]);
    expect(leaf).toContain("20 assigned / 20 unique / 0 missing / 0 extra / 0 drift");
    expect(leaf).toMatch(/2026-08-11 approved amendment/i);
    expect(leaf).toMatch(/Thai and English.*same authority/i);
    expect(leaf).toMatch(/does not activate generic product integration/i);
    expectImmutableCoreAnchors(leaf, 7);
    expectNoFormerSourceLeakage(leaf, subgroup.sourcePaths);
    expectAuthorityBoundaries(leaf);
  });

  it("derives the five corrective records and preserves their scoped evidence boundaries", async () => {
    const { subgroup, leaf } = await leafFor("corrective-evidence");

    expect((await readOrientation()).sourceCommit).toBe(frozenSourceCommit);
    await expectFrozenCurrentProvenance(subgroup, 5, "67db4d76135fe8c9205490018c256613c1ca0505da3130a74f2052f527e5a229");
    expectHeadings(leaf, [...commonHeadings.slice(0, 2), ...correctiveHeadings, ...commonHeadings.slice(2)]);
    expect(leaf).toContain("5 assigned / 5 unique / 0 missing / 0 extra / 0 drift");
    expect(leaf).toMatch(/earlier local type-check concern/i);
    expect(leaf).toMatch(/later scoped verification/i);
    expect(leaf).toMatch(/does not become a normative implementation contract/i);
    expectImmutableCoreAnchors(leaf, 2);
    expectNoFormerSourceLeakage(leaf, subgroup.sourcePaths);
    expectCorrectiveBoundaries(leaf);
  });

  it("mutation: rejects each authority and corrective overclaim while retaining legitimate negatives", async () => {
    const orientation = await readOrientation();
    const authority = subgroupFor(orientation, "source-authority-and-commit-transaction");
    const corrective = subgroupFor(orientation, "corrective-evidence");
    const testSource = await readFile(new URL(import.meta.url), "utf8");

    expect(() => expectAuthorityBoundaries("the 2026-08-10 seam design overrides the approved amendment")).toThrow();
    expect(() => expectAuthorityBoundaries("Thai and English companion terms have different authority")).toThrow();
    expect(() => expectAuthorityBoundaries("transaction internals activate generic product integration")).toThrow();
    expect(() => expectCorrectiveBoundaries("a scoped review applies outside its commit or test range")).toThrow();
    expect(() => expectCorrectiveBoundaries("a later PASS erases an earlier local repair concern")).toThrow();
    expect(() => expectCorrectiveBoundaries("corrective evidence is a normative implementation contract")).toThrow();
    expectAuthorityBoundaries("The 2026-08-10 seam design does not override the approved amendment. Thai and English companion terms have the same authority. Transaction internals do not activate generic product integration.");
    expectCorrectiveBoundaries("A scoped review does not apply outside its commit or test range. A later PASS does not erase an earlier local repair concern. Corrective evidence does not become a normative implementation contract.");
    expectNoFormerSourceLeakage(testSource, [...authority.sourcePaths, ...corrective.sourcePaths]);
  });
});
