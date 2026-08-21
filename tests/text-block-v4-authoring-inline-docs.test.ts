import { readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { expectFrozenCurrentSourceProvenance } from "./template-builder-source-provenance.js";

const root = process.cwd();
const coreRepository = "flowdoc-vnext-core";
const frozenSourceCommit = "76a2f2311a898e781f53773390d47b05812911e4";
const currentEvidenceCommit = "c503a45c03e0ce3b7a6efba2b029ca842017faa0";
const coreEvidenceRoot = resolve(root, "..", "..", "..", coreRepository, ".worktrees", "core-route-documentation-cleanup");
const leafPath = "docs/versions/V0_1_0a_1/core/text-block/v4-authoring-and-inline.md";

const requiredHeadings = [
  "## Authority and Scope",
  "## Responsibility Boundary",
  "## V4 Flat-inline Grammar and Projection",
  "## Canonical Selection",
  "## Atomic and Field Command Planning",
  "## Whole-rich-inline Replacement",
  "## Apply Boundary and Rejections",
  "## Current Verified State",
  "## Explicit Exclusions and Conflict",
  "## Canonical Cross-references",
  "## Evidence Anchors",
] as const;

interface Subgroup {
  subgroupId: string;
  sourcePaths: string[];
  proposedLeafPath: string;
  dependsOn: string[];
}

interface Orientation {
  sourceCommit: string;
  families: Array<{ familyId: string; subgroups: Subgroup[] }>;
}

async function readOrientation(): Promise<Orientation> {
  return JSON.parse(await readFile(join(root, "migrations/V0_1_0a_1/core/wave-a-orientation.json"), "utf8")) as Orientation;
}

function subgroupFor(orientation: Orientation): Subgroup {
  const subgroup = orientation.families
    .filter((family) => family.familyId === "text-block")
    .flatMap((family) => family.subgroups)
    .find((candidate) => candidate.subgroupId === "v4-authoring-and-inline");
  if (!subgroup) throw new Error("Missing Text Block V4 authoring subgroup");
  return subgroup;
}

async function leafFor(): Promise<{ subgroup: Subgroup; leaf: string }> {
  const subgroup = subgroupFor(await readOrientation());
  return { subgroup, leaf: await readFile(join(root, subgroup.proposedLeafPath), "utf8") };
}

function expectImmutableCoreAnchors(value: string, minimum: number): void {
  const anchors = [...value.matchAll(new RegExp(`${coreRepository}@([^:\\s\\x60]+):[^\\s\\x60]+`, "g"))];
  expect(anchors.length).toBeGreaterThanOrEqual(minimum);
  for (const [, commit] of anchors) expect(commit).toBe(currentEvidenceCommit);
  expect(value).not.toMatch(new RegExp(`${coreRepository}@(?!${currentEvidenceCommit}:)`));
}

function expectNoFormerSourceLeakage(value: string, sourcePaths: readonly string[]): void {
  for (const sourcePath of sourcePaths) expect(value).not.toContain(sourcePath);
}

function expectExplicitExclusions(value: string): void {
  expect(value).not.toMatch(/DOM input is (?:owned|supported)/i);
  expect(value).not.toMatch(/IME input is (?:owned|supported)/i);
  expect(value).not.toMatch(/clipboard input is (?:owned|supported)/i);
  expect(value).not.toMatch(/granular concurrent deltas are (?:owned|supported)/i);
  expect(value).not.toMatch(/CRDT(?:-based)? (?:merge|editing) is (?:owned|supported)/i);
  expect(value).not.toMatch(/offline merge is (?:owned|supported)/i);
  expect(value).not.toMatch(/backend persistence is (?:owned|supported)/i);
  expect(value).not.toMatch(/measurement is (?:owned|supported)/i);
  expect(value).not.toMatch(/pagination is (?:owned|supported)/i);
  expect(value).not.toMatch(/renderer output is (?:owned|supported)/i);
  expect(value).not.toMatch(/export is (?:owned|supported)/i);
  expect(value).not.toMatch(/cross-page editing is (?:owned|supported)/i);
}

describe("Text Block V4 authoring and inline documentation leaf", () => {
  it("derives the exact 3-source subgroup and freezes every source blob at both Core commits", async () => {
    const orientation = await readOrientation();
    const subgroup = subgroupFor(orientation);

    expect(orientation.sourceCommit).toBe(frozenSourceCommit);
    expect(subgroup.sourcePaths).toHaveLength(3);
    expect(new Set(subgroup.sourcePaths).size).toBe(3);
    expect(subgroup.proposedLeafPath).toBe(leafPath);
    expect(subgroup.dependsOn).toEqual(["text-block/v1-grammar-and-migration"]);
    await expectFrozenCurrentSourceProvenance({
      projectRoot: root,
      coreEvidenceRoot,
      sourcePaths: subgroup.sourcePaths,
      expectedCount: 3,
      expectedFingerprint: "78d0f8a7a60991e9e1b574653a9067553f4a487a08e3abeb5c64b86ccb468494",
      frozenCommit: frozenSourceCommit,
      currentCommit: currentEvidenceCommit,
    });
  });

  it("records the bounded V4 grammar, selection, command, replacement, and rejection contract", async () => {
    const { leaf } = await leafFor();

    expect(leaf.match(/^## .+$/gm) ?? []).toEqual(requiredHeadings);
    expect(leaf).toMatch(/3 assigned \/ 3 unique \/ 0 missing \/ 0 extra \/ 0 drift/);
    expect(leaf).toMatch(/five flat inline forms: text, field-ref, line-break, page-number, and inline-image/i);
    expect(leaf).toMatch(/`children: \[\]`/);
    expect(leaf).toMatch(/inline-local UTF-16 offset and affinity/i);
    expect(leaf).toMatch(/explicit caller-supplied inline identities/i);
    expect(leaf).toMatch(/`text-block\.rich-inline\.replace`/);
    expect(leaf).toMatch(/exact artifact, policy, field-contract, and session pins/i);
    expect(leaf).toMatch(/stale, policy, artifact, and session rejection/i);
    expect(leaf).toMatch(/accepted apply boundary/i);
    expect(leaf).toMatch(/Whole rich-inline replacement is history\/revision-gate-ready but is not a concurrency, CRDT, or offline-merge primitive/i);
  });

  it("uses immutable Core anchors and no former source paths or mutable references in leaf or guard", async () => {
    const [{ subgroup, leaf }, testSource] = await Promise.all([
      leafFor(),
      readFile(new URL(import.meta.url), "utf8"),
    ]);

    expectImmutableCoreAnchors(leaf, 6);
    expectImmutableCoreAnchors(testSource, 0);
    expectNoFormerSourceLeakage(leaf, subgroup.sourcePaths);
    expectNoFormerSourceLeakage(testSource, subgroup.sourcePaths);
  });

  it("keeps every explicit exclusion outside this candidate authoring leaf", async () => {
    const { leaf } = await leafFor();

    expect(leaf).toMatch(/DOM, IME, and clipboard input ownership are excluded/i);
    expect(leaf).toMatch(/granular concurrent deltas are excluded/i);
    expect(leaf).toMatch(/CRDT and offline merge are excluded/i);
    expect(leaf).toMatch(/backend persistence is excluded/i);
    expect(leaf).toMatch(/measurement and pagination are excluded/i);
    expect(leaf).toMatch(/renderer output and export are excluded/i);
    expect(leaf).toMatch(/cross-page editing is excluded/i);
    expectExplicitExclusions(leaf);
  });

  it("mutation: rejects every explicit exclusion becoming an owned or supported capability", async () => {
    const { leaf } = await leafFor();
    const forbiddenClaims = [
      "DOM input is owned",
      "IME input is supported",
      "clipboard input is owned",
      "granular concurrent deltas are supported",
      "CRDT merge is owned",
      "offline merge is supported",
      "backend persistence is owned",
      "measurement is supported",
      "pagination is owned",
      "renderer output is supported",
      "export is owned",
      "cross-page editing is supported",
    ];

    for (const claim of forbiddenClaims) expect(() => expectExplicitExclusions(`${leaf}\n${claim}`)).toThrow();
    expectExplicitExclusions("DOM input is not owned; IME input is not supported; clipboard input is not owned; granular concurrent deltas are not supported; CRDT merge is not owned; offline merge is not supported; backend persistence is not owned; measurement is not supported; pagination is not owned; renderer output is not supported; export is not owned; cross-page editing is not supported.");
  });

  it("mutation: rejects mutable Core references and former source leakage in both evidence surfaces", async () => {
    const [{ subgroup, leaf }, testSource] = await Promise.all([
      leafFor(),
      readFile(new URL(import.meta.url), "utf8"),
    ]);
    const formerSource = subgroup.sourcePaths[0];
    if (!formerSource) throw new Error("Expected V4 authoring source");
    const mutableAnchor = `${coreRepository}@main:example.ts`;

    expect(() => expectImmutableCoreAnchors(`${leaf}\n${mutableAnchor}`, 6)).toThrow();
    expect(() => expectNoFormerSourceLeakage(`${leaf}\n${formerSource}`, subgroup.sourcePaths)).toThrow();
    expect(() => expectNoFormerSourceLeakage(`${testSource}\n${formerSource}`, subgroup.sourcePaths)).toThrow();
  });
});
