import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { resolveCoreEvidenceRoot } from "./core-evidence-root.js";
import { expectFrozenCurrentSourceProvenance } from "./template-builder-source-provenance.js";

const root = process.cwd();
const frozenSourceCommit = "76a2f2311a898e781f53773390d47b05812911e4";
const currentEvidenceCommit = "c503a45c03e0ce3b7a6efba2b029ca842017faa0";
const coreEvidenceRoot = resolveCoreEvidenceRoot(root);

const persistentHeadings = [
  "## Authority and Scope",
  "## Responsibility Boundary",
  "## Flow-tree Structure",
  "## Contextual Ranges",
  "## Semantic Checkpoints",
  "## Affected-line Planning",
  "## Retained Ranges",
  "## Update Reuse",
  "## Oracle-independent Execution",
  "## State and Failure Model",
  "## Current Verified State",
  "## Known Limits and Unknowns",
  "## Historical Design Notes",
  "## Canonical Cross-references",
  "## Evidence Anchors",
] as const;

const rootHeadings = [
  "## Authority and Scope",
  "## Responsibility Boundary",
  "## 5A Retained Root",
  "## 5B Root V2 Admission",
  "## Scene and Delivery",
  "## Work Policy",
  "## Source Envelope",
  "## V3 Corrective Scope",
  "## Stop Boundaries",
  "## State and Failure Model",
  "## Current Verified State",
  "## Known Limits and Unknowns",
  "## Historical Design Notes",
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
  sourcePaths: readonly string[],
  expectedFingerprint: string,
): Promise<void> {
  await expectFrozenCurrentSourceProvenance({
    projectRoot: root,
    coreEvidenceRoot,
    sourcePaths,
    expectedCount: 10,
    expectedFingerprint,
    frozenCommit: frozenSourceCommit,
    currentCommit: currentEvidenceCommit,
  });
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

function expectPersistentBoundaries(leaf: string): void {
  expect(leaf).not.toMatch(/complete oracle is an incremental execution input/i);
  expect(leaf).not.toMatch(/affected-line planning proves per-keystroke performance/i);
  expect(leaf).not.toMatch(/structural reuse proves latency/i);
}

function expectRootBoundaries(leaf: string): void {
  expect(leaf).not.toMatch(/5A acceptance activates all V3 policy/i);
  expect(leaf).not.toMatch(/V3 scoped PASS activates 5B-2 source authority/i);
  expect(leaf).not.toMatch(/inactive capability rows are current product capability/i);
}

describe("Live Draft persistent-flow and root-transition documentation leaves", () => {
  it("derives both exact 10-source subgroups and freezes all 20 source blobs at both Core commits", async () => {
    const orientation = await readOrientation();
    const persistent = subgroupFor(orientation, "persistent-flow-and-range-foundations");
    const rootTransition = subgroupFor(orientation, "root-and-v3-transition-contracts");

    expect(orientation.sourceCommit).toBe(frozenSourceCommit);
    expect([...persistent.sourcePaths, ...rootTransition.sourcePaths]).toHaveLength(20);
    expect(new Set([...persistent.sourcePaths, ...rootTransition.sourcePaths]).size).toBe(20);
    await expectFrozenCurrentProvenance(persistent.sourcePaths, "9d337fe684ec681535764eac9b55598410eac11bfab6c5a33337e6e9ba89edf8");
    await expectFrozenCurrentProvenance(rootTransition.sourcePaths, "d8b5ed0f36b7eaa382667515e6f2e49eb94d3d6ed49fa9c44ff7b6f7adbbcd55");
  });

  it("preserves required headings, subgroup closure, and ownership cross-links", async () => {
    const [persistent, rootTransition] = await Promise.all([
      leafFor("persistent-flow-and-range-foundations"),
      leafFor("root-and-v3-transition-contracts"),
    ]);

    expect(persistent.leaf.match(/^## .+$/gm) ?? []).toEqual(persistentHeadings);
    expect(rootTransition.leaf.match(/^## .+$/gm) ?? []).toEqual(rootHeadings);
    expect(persistent.leaf).toContain("](root-and-v3-transition-contracts.md)");
    expect(rootTransition.leaf).toContain("](persistent-flow-and-range-foundations.md)");
    expect(rootTransition.leaf).toContain("](source-authority-and-commit-transaction.md)");
    expect(rootTransition.leaf).toContain("](corrective-evidence.md)");
    expect(persistent.leaf).toMatch(/10 assigned \/ 10 unique \/ 0 missing\s*\/\s*0 extra \/ 0 drift/);
    expect(rootTransition.leaf).toMatch(/10 assigned \/ 10 unique \/ 0 missing\s*\/\s*0 extra \/ 0 drift/);
  });

  it("uses immutable Core anchors with no former-source leakage in leaves or this test", async () => {
    const [persistent, rootTransition, testSource] = await Promise.all([
      leafFor("persistent-flow-and-range-foundations"),
      leafFor("root-and-v3-transition-contracts"),
      readFile(new URL(import.meta.url), "utf8"),
    ]);
    const allSourcePaths = [...persistent.subgroup.sourcePaths, ...rootTransition.subgroup.sourcePaths];

    expectImmutableCoreAnchors(persistent.leaf, 7);
    expectImmutableCoreAnchors(rootTransition.leaf, 7);
    expectNoFormerSourceLeakage(persistent.leaf, allSourcePaths);
    expectNoFormerSourceLeakage(rootTransition.leaf, allSourcePaths);
    expectNoFormerSourceLeakage(testSource, allSourcePaths);
  });

  it("keeps oracle, structural-reuse, Root V2, V3, and capability claims bounded", async () => {
    const [persistent, rootTransition] = await Promise.all([
      leafFor("persistent-flow-and-range-foundations"),
      leafFor("root-and-v3-transition-contracts"),
    ]);

    expect(persistent.leaf).toMatch(/complete layout is optional QA-only comparison/i);
    expect(persistent.leaf).toMatch(/structural reuse is not a latency claim/i);
    expect(persistent.leaf).toMatch(/affected-line planning is not per-keystroke performance proof/i);
    expect(rootTransition.leaf).toMatch(/5A acceptance does not activate V3 policy/i);
    expect(rootTransition.leaf).toMatch(/V3 scoped PASS does not activate 5B-2 source authority/i);
    expect(rootTransition.leaf).toMatch(/inactive capability rows do not describe current product capability/i);
    expectPersistentBoundaries(persistent.leaf);
    expectRootBoundaries(rootTransition.leaf);
  });

  it("mutation: rejects forbidden positive claims with legitimate-negative controls", async () => {
    const [persistent, rootTransition] = await Promise.all([
      leafFor("persistent-flow-and-range-foundations"),
      leafFor("root-and-v3-transition-contracts"),
    ]);

    expect(() => expectPersistentBoundaries(`${persistent.leaf}\ncomplete oracle is an incremental execution input`)).toThrow();
    expect(() => expectPersistentBoundaries(`${persistent.leaf}\naffected-line planning proves per-keystroke performance`)).toThrow();
    expect(() => expectPersistentBoundaries(`${persistent.leaf}\nstructural reuse proves latency`)).toThrow();
    expect(() => expectRootBoundaries(`${rootTransition.leaf}\n5A acceptance activates all V3 policy`)).toThrow();
    expect(() => expectRootBoundaries(`${rootTransition.leaf}\nV3 scoped PASS activates 5B-2 source authority`)).toThrow();
    expect(() => expectRootBoundaries(`${rootTransition.leaf}\ninactive capability rows are current product capability`)).toThrow();
    expectPersistentBoundaries("The complete oracle is not an incremental execution input; affected-line planning does not prove per-keystroke performance; structural reuse does not prove latency.");
    expectRootBoundaries("5A acceptance does not activate all V3 policy; a V3 scoped PASS does not activate 5B-2 source authority; inactive capability rows are not current product capability.");
  });

  it("mutation: rejects a mutable Core ref and former-source leakage in leaf and test evidence", async () => {
    const [persistent, rootTransition, testSource] = await Promise.all([
      leafFor("persistent-flow-and-range-foundations"),
      leafFor("root-and-v3-transition-contracts"),
      readFile(new URL(import.meta.url), "utf8"),
    ]);
    const allSourcePaths = [...persistent.subgroup.sourcePaths, ...rootTransition.subgroup.sourcePaths];
    const formerSource = allSourcePaths[0];
    if (!formerSource) throw new Error("Expected persistent and root-transition sources");

    expect(() => expectImmutableCoreAnchors(`${persistent.leaf}\nflowdoc-vnext-core@main:example.ts`, 7)).toThrow();
    expect(() => expectNoFormerSourceLeakage(`${rootTransition.leaf}\n${formerSource}`, allSourcePaths)).toThrow();
    expect(() => expectNoFormerSourceLeakage(`${testSource}\n${formerSource}`, allSourcePaths)).toThrow();
  });
});
