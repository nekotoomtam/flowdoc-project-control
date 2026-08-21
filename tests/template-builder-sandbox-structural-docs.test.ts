import { access, readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { expectFrozenCurrentSourceProvenance } from "./template-builder-source-provenance.js";

const root = process.cwd();
const currentEvidenceCommit = "c503a45c03e0ce3b7a6efba2b029ca842017faa0";
const frozenSourceCommit = "76a2f2311a898e781f53773390d47b05812911e4";
const expectedLaneAFingerprints = {
  "sandbox-runtime-and-store": "1a854ca9b9b4f4295350615289cc843b34d97a212101a6ae4a3e3dc1e363fb9b",
  "structural-runtime-and-navigation": "a04f8ad1a801a9e3f5ef9bd0acc8cd80be9ab00aa312561e023a837e2c5dce39",
} as const;
const coreEvidenceRoot = resolve(root, "..", "..", "..", "flowdoc-vnext-core", ".worktrees", "core-route-documentation-cleanup");

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

const sandboxHeadings = [
  "## Current Package Boundary",
  "## Runtime Normalization",
  "## Mutation Packets",
  "## Cache and Store Application",
  "## Plain-text Actions and History",
  "## Live-layout Summaries",
] as const;

const structuralHeadings = [
  "## Structural Projection",
  "## Packet v1",
  "## Command Policy",
  "## Outline Jumps",
  "## Diagnostics Navigation",
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

function laneAProvenance(subgroup: Subgroup) {
  return {
    projectRoot: root,
    coreEvidenceRoot,
    sourcePaths: subgroup.sourcePaths,
    expectedCount: subgroup.subgroupId === "sandbox-runtime-and-store" ? 15 : 9,
    expectedFingerprint: expectedLaneAFingerprints[subgroup.subgroupId as keyof typeof expectedLaneAFingerprints],
    frozenCommit: frozenSourceCommit,
    currentCommit: currentEvidenceCommit,
  };
}

function subgroupFor(orientation: Orientation, subgroupId: string): Subgroup {
  const subgroup = orientation.families
    .filter((family) => family.familyId === "template-builder")
    .flatMap((family) => family.subgroups)
    .find((candidate) => candidate.subgroupId === subgroupId);
  if (!subgroup) throw new Error(`Missing Template Builder subgroup: ${subgroupId}`);
  return subgroup;
}

async function leafFor(subgroupId: string): Promise<{ subgroup: Subgroup; leaf: string }> {
  const subgroup = subgroupFor(await readOrientation(), subgroupId);
  return { subgroup, leaf: await readFile(join(root, subgroup.proposedLeafPath), "utf8") };
}

function expectHeadings(leaf: string, headings: readonly string[]): void {
  expect(leaf.match(/^## .+$/gm) ?? []).toEqual(headings);
}

function expectImmutableCoreAnchors(leaf: string): void {
  const anchors = [...leaf.matchAll(/flowdoc-vnext-core@([^:\s`]+):[^\s`]+/g)];
  expect(anchors.length).toBeGreaterThan(0);
  for (const [, commit] of anchors) expect(commit).toBe(currentEvidenceCommit);
  expect(leaf).not.toMatch(/flowdoc-vnext-core@(?!c503a45c03e0ce3b7a6efba2b029ca842017faa0:)/);
}

function expectNoFormerSourceLeakage(value: string, sourcePaths: readonly string[]): void {
  for (const sourcePath of sourcePaths) expect(value).not.toContain(sourcePath);
}

function expectSandboxBoundary(leaf: string): void {
  expect(leaf).not.toMatch(/sandbox (?:is|as) canonical storage/i);
  expect(leaf).not.toMatch(/packet v1 (?:is|as) (?:a )?public/i);
  expect(leaf).not.toMatch(/packet v1 (?:is|as) durable/i);
  expect(leaf).not.toMatch(/boot snapshot auto-refreshes/i);
  expect(leaf).not.toMatch(/layout summaries are renderer output/i);
  expect(leaf).not.toMatch(/(?:canonical storage|durable persistence|production renderer|collaboration support)/i);
}

function expectStructuralBoundary(leaf: string): void {
  expect(leaf).not.toMatch(/packet v1 (?:is|as) (?:a )?public/i);
  expect(leaf).not.toMatch(/packet v1 (?:is|as) durable/i);
  expect(leaf).not.toMatch(/diagnostics (?:may|can) guess missing node ?ids?/i);
  expect(leaf).not.toMatch(/(?:canonical storage|durable persistence|production renderer|collaboration support)/i);
}

describe("Template Builder sandbox and structural documentation leaves", () => {
  it("derives the sandbox leaf from orientation and preserves its exact headings", async () => {
    const { subgroup, leaf } = await leafFor("sandbox-runtime-and-store");
    const orientation = await readOrientation();

    expect(orientation.sourceCommit).toBe(frozenSourceCommit);
    await expectFrozenCurrentSourceProvenance(laneAProvenance(subgroup));
    expectHeadings(leaf, [...commonHeadings.slice(0, 2), ...sandboxHeadings, ...commonHeadings.slice(2)]);
  });

  it("derives the structural leaf from orientation and preserves its exact headings", async () => {
    const { subgroup, leaf } = await leafFor("structural-runtime-and-navigation");
    const orientation = await readOrientation();

    expect(orientation.sourceCommit).toBe(frozenSourceCommit);
    await expectFrozenCurrentSourceProvenance(laneAProvenance(subgroup));
    expectHeadings(leaf, [...commonHeadings.slice(0, 2), ...structuralHeadings, ...commonHeadings.slice(2)]);
  });

  it("uses immutable Core evidence and no former source literals", async () => {
    const [sandbox, structural, testSource] = await Promise.all([
      leafFor("sandbox-runtime-and-store"),
      leafFor("structural-runtime-and-navigation"),
      readFile(new URL(import.meta.url), "utf8"),
    ]);

    expectImmutableCoreAnchors(sandbox.leaf);
    expectImmutableCoreAnchors(structural.leaf);
    expectNoFormerSourceLeakage(sandbox.leaf, sandbox.subgroup.sourcePaths);
    expectNoFormerSourceLeakage(structural.leaf, structural.subgroup.sourcePaths);
    expectNoFormerSourceLeakage(testSource, [...sandbox.subgroup.sourcePaths, ...structural.subgroup.sourcePaths]);
  });

  it("keeps the documented sandbox and structural boundaries bounded", async () => {
    const [sandbox, structural] = await Promise.all([
      leafFor("sandbox-runtime-and-store"),
      leafFor("structural-runtime-and-navigation"),
    ]);

    expectSandboxBoundary(sandbox.leaf);
    expectStructuralBoundary(structural.leaf);
  });

  it("mutation: rejects forbidden positive claims", async () => {
    const [sandbox, structural] = await Promise.all([
      leafFor("sandbox-runtime-and-store"),
      leafFor("structural-runtime-and-navigation"),
    ]);

    expect(() => expectSandboxBoundary(`${sandbox.leaf}\nsandbox is canonical storage`)).toThrow();
    expect(() => expectSandboxBoundary(`${sandbox.leaf}\nboot snapshot auto-refreshes`)).toThrow();
    expect(() => expectSandboxBoundary(`${sandbox.leaf}\nlayout summaries are renderer output`)).toThrow();
    expect(() => expectStructuralBoundary(`${structural.leaf}\npacket v1 is public`)).toThrow();
    expect(() => expectStructuralBoundary(`${structural.leaf}\npacket v1 is durable`)).toThrow();
    expect(() => expectStructuralBoundary(`${structural.leaf}\ndiagnostics may guess missing node IDs`)).toThrow();
  });

  it("mutation: rejects a mutable Core ref and former-source leakage", async () => {
    const [sandbox, structural, testSource] = await Promise.all([
      leafFor("sandbox-runtime-and-store"),
      leafFor("structural-runtime-and-navigation"),
      readFile(new URL(import.meta.url), "utf8"),
    ]);
    const formerSource = sandbox.subgroup.sourcePaths[0];
    if (!formerSource) throw new Error("Sandbox subgroup has no source paths");

    expect(() => expectImmutableCoreAnchors(`${sandbox.leaf}\nflowdoc-vnext-core@main:example.ts`)).toThrow();
    expect(() => expectNoFormerSourceLeakage(`${structural.leaf}\n${formerSource}`, sandbox.subgroup.sourcePaths)).toThrow();
    expect(() => expectNoFormerSourceLeakage(`${testSource}\n${formerSource}`, sandbox.subgroup.sourcePaths)).toThrow();
  });

  it("mutation: rejects reordered Lane A assignments at the provenance boundary", async () => {
    const orientation = await readOrientation();
    const sandbox = subgroupFor(orientation, "sandbox-runtime-and-store");
    const structural = subgroupFor(orientation, "structural-runtime-and-navigation");

    await expect(expectFrozenCurrentSourceProvenance({
      ...laneAProvenance(sandbox),
      sourcePaths: [...sandbox.sourcePaths].reverse(),
    })).rejects.toThrow();
    await expect(expectFrozenCurrentSourceProvenance({
      ...laneAProvenance(structural),
      sourcePaths: [...structural.sourcePaths].reverse(),
    })).rejects.toThrow();
  });

  it("keeps only the two orientation-derived leaves in this documentation scope", async () => {
    const orientation = await readOrientation();
    const expectedPaths = new Set([
      subgroupFor(orientation, "sandbox-runtime-and-store").proposedLeafPath,
      subgroupFor(orientation, "structural-runtime-and-navigation").proposedLeafPath,
    ]);

    expect(expectedPaths.size).toBe(2);
    for (const path of expectedPaths) await expect(access(join(root, path))).resolves.toBeUndefined();
  });
});
