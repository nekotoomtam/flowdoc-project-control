import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { resolveCoreEvidenceRoot } from "./core-evidence-root.js";
import { expectFrozenCurrentSourceProvenance } from "./template-builder-source-provenance.js";

const root = process.cwd();
const frozenSourceCommit = "76a2f2311a898e781f53773390d47b05812911e4";
const currentEvidenceCommit = "c503a45c03e0ce3b7a6efba2b029ca842017faa0";
const coreEvidenceRoot = resolveCoreEvidenceRoot(root);

const wysiwygHeadings = [
  "## Authority and Scope",
  "## Responsibility Boundary",
  "## Textarea-first Active Draft",
  "## Browser-local Selection, Caret, and Text Commands",
  "## IME Composition Guard",
  "## Pre-commit Local Layout Summary",
  "## Planning-only Toolbar, Field, and History Affordances",
  "## State and Failure Model",
  "## Current Verified State",
  "## Known Limits and Unknowns",
  "## Historical Design Notes",
  "## Canonical Cross-references",
  "## Evidence Anchors",
] as const;

const richInlineHeadings = [
  "## Authority and Scope",
  "## Responsibility Boundary",
  "## Segment Capture and UTF-16 Range Mapping",
  "## Contenteditable Hardening Boundary",
  "## Browser-local Rich State",
  "## Commit Planning and Accepted Application",
  "## In-memory Undo and Redo Replay",
  "## JSON-safe Replay-patch Validation and History-ready Facts",
  "## Live/Exact Stale Invalidation Only",
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

async function expectFrozenCurrentProvenance(
  sourcePaths: readonly string[],
  expectedFingerprint: string,
): Promise<void> {
  await expectFrozenCurrentSourceProvenance({
    projectRoot: root,
    coreEvidenceRoot,
    sourcePaths,
    expectedCount: 15,
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

function expectWysiwygBoundaries(leaf: string): void {
  expect(leaf).not.toMatch(/contenteditable is (?:the )?active primary input/i);
  expect(leaf).not.toMatch(/planning\/ready means production-ready/i);
  expect(leaf).not.toMatch(/IME composition permits (?:commit(?: or range commands)?|range commands)/i);
  expect(leaf).not.toMatch(/browser-local draft or style state is canonical package truth/i);
  expect(leaf).not.toMatch(/(?:draft|selection|commands|layout|planning) (?:is|are) canonical package truth/i);
  expect(leaf).not.toMatch(/(?:draft|selection|commands|layout|planning) (?:is|are) persisted/i);
}

function expectRichInlineBoundaries(leaf: string): void {
  expect(leaf).not.toMatch(/session records are persisted through a storage adapter/i);
  expect(leaf).not.toMatch(/live\/exact parity proves (?:renderer|export)(?: or (?:renderer|export))? parity/i);
  expect(leaf).not.toMatch(/rich mutation (?:is|allows) (?!accepted[- ]fresh[- ]plan[- ]only)/i);
  expect(leaf).not.toMatch(/UTF-16 mapping (?:is|provides) (?:a )?(?:renderer|DOM) caret contract/i);
  expect(leaf).not.toMatch(/(?:session records|replay) (?:is|are) (?:a )?collaboration/i);
  expect(leaf).not.toMatch(/session-record preparation/i);
  expect(leaf).not.toMatch(/storage-ready JSON-safe Session Records/i);
  expect(leaf).not.toMatch(/Session preparation creates JSON-safe records/i);
  expect(leaf).not.toMatch(/retain(?:s|ing) bounded package/i);
  expect(leaf).not.toMatch(/live\/exact status facts/i);
}

describe("Template Builder WYSIWYG and rich-inline documentation leaves", () => {
  it("derives both exact 15-source subgroups and freezes all 30 source blobs at both Core commits", async () => {
    const orientation = await readOrientation();
    const wysiwyg = subgroupFor(orientation, "wysiwyg-draft-input-and-guards");
    const richInline = subgroupFor(orientation, "rich-inline-commit-and-session-lifecycle");

    expect(orientation.sourceCommit).toBe(frozenSourceCommit);
    expect([...wysiwyg.sourcePaths, ...richInline.sourcePaths]).toHaveLength(30);
    expect(new Set([...wysiwyg.sourcePaths, ...richInline.sourcePaths]).size).toBe(30);
    await expectFrozenCurrentProvenance(wysiwyg.sourcePaths, "66f7ef21ed0bb09e4c0ea29cff8ef8fce550719853f52fadf8f2363ca0b17fab");
    await expectFrozenCurrentProvenance(richInline.sourcePaths, "dad723ed897e8335345f138b7c97c10f835f5deabf035c903c03c282f04cc930");
  });

  it("preserves the required headings and ownership cross-links", async () => {
    const [wysiwyg, richInline] = await Promise.all([
      leafFor("wysiwyg-draft-input-and-guards"),
      leafFor("rich-inline-commit-and-session-lifecycle"),
    ]);

    expect(wysiwyg.leaf.match(/^## .+$/gm) ?? []).toEqual(wysiwygHeadings);
    expect(richInline.leaf.match(/^## .+$/gm) ?? []).toEqual(richInlineHeadings);
    expect(wysiwyg.leaf).toContain("](rich-inline-commit-and-session-lifecycle.md)");
    expect(richInline.leaf).toContain("](wysiwyg-draft-input-and-guards.md)");
    expect(wysiwyg.leaf).toMatch(/15 assigned \/ 15 unique \/ 0 missing\s*\/\s*0 extra \/ 0 drift/);
    expect(richInline.leaf).toMatch(/15 assigned \/ 15 unique \/ 0 missing\s*\/\s*0 extra \/ 0 drift/);
  });

  it("uses immutable Core anchors with no former-source leakage in leaves or this test", async () => {
    const [wysiwyg, richInline, testSource] = await Promise.all([
      leafFor("wysiwyg-draft-input-and-guards"),
      leafFor("rich-inline-commit-and-session-lifecycle"),
      readFile(new URL(import.meta.url), "utf8"),
    ]);
    const allSourcePaths = [...wysiwyg.subgroup.sourcePaths, ...richInline.subgroup.sourcePaths];

    expectImmutableCoreAnchors(wysiwyg.leaf, 15);
    expectImmutableCoreAnchors(richInline.leaf, 15);
    expectNoFormerSourceLeakage(wysiwyg.leaf, allSourcePaths);
    expectNoFormerSourceLeakage(richInline.leaf, allSourcePaths);
    expectNoFormerSourceLeakage(testSource, allSourcePaths);
  });

  it("keeps textarea-first, IME, accepted-plan, session, replay, and invalidation claims bounded", async () => {
    const [wysiwyg, richInline] = await Promise.all([
      leafFor("wysiwyg-draft-input-and-guards"),
      leafFor("rich-inline-commit-and-session-lifecycle"),
    ]);

    expect(wysiwyg.leaf).toMatch(/textarea-first/i);
    expect(wysiwyg.leaf).toMatch(/blocks commands, range controls, and both plain and rich\s+commit/i);
    expect(richInline.leaf).toMatch(/accepted fresh plan/i);
    expect(richInline.leaf).toMatch(/stale plans are rejected/i);
    expect(richInline.leaf).toMatch(/field and\s+style facts/i);
    expect(richInline.leaf).toMatch(/JSON-safe rich-inline replay-patch validation/i);
    expect(richInline.leaf).toMatch(/history-ready facts/i);
    expect(richInline.leaf).toMatch(/before\/after child snapshots/i);
    expect(richInline.leaf).toMatch(/`storageRecord: false`,\s*`storageWrites: false`, and `replayExecution: false`/i);
    expect(richInline.leaf).toMatch(/no package\s+snapshot or persisted session record/i);
    expect(richInline.leaf).toMatch(/stale invalidation only/i);
    expectWysiwygBoundaries(wysiwyg.leaf);
    expectRichInlineBoundaries(richInline.leaf);
  });

  it("mutation: rejects each forbidden positive claim with legitimate-negative controls", async () => {
    const [wysiwyg, richInline] = await Promise.all([
      leafFor("wysiwyg-draft-input-and-guards"),
      leafFor("rich-inline-commit-and-session-lifecycle"),
    ]);

    expect(() => expectWysiwygBoundaries(`${wysiwyg.leaf}\ncontenteditable is the active primary input`)).toThrow();
    expect(() => expectWysiwygBoundaries(`${wysiwyg.leaf}\nplanning/ready means production-ready`)).toThrow();
    expect(() => expectWysiwygBoundaries(`${wysiwyg.leaf}\nIME composition permits commit or range commands`)).toThrow();
    expect(() => expectWysiwygBoundaries(`${wysiwyg.leaf}\nbrowser-local draft or style state is canonical package truth`)).toThrow();
    expect(() => expectRichInlineBoundaries(`${richInline.leaf}\nsession records are persisted through a storage adapter`)).toThrow();
    expect(() => expectRichInlineBoundaries(`${richInline.leaf}\nlive/exact parity proves renderer or export parity`)).toThrow();
    expect(() => expectRichInlineBoundaries(`${richInline.leaf}\nJSON-safe session-record preparation`)).toThrow();
    expect(() => expectRichInlineBoundaries(`${richInline.leaf}\nSession preparation creates JSON-safe records`)).toThrow();
    expect(() => expectRichInlineBoundaries(`${richInline.leaf}\nThe helper retains bounded package facts and live/exact status facts`)).toThrow();
    expectWysiwygBoundaries("contenteditable is not the active primary input; planning/ready does not mean production-ready; IME composition does not permit commit or range commands; browser-local draft or style state is not canonical package truth.");
    expectRichInlineBoundaries("session records are not persisted through a storage adapter; live/exact parity does not prove renderer or export parity.");
    expectRichInlineBoundaries("JSON-safe replay-patch validation reports history-ready facts; it does not create a package snapshot or persisted session record and reports no storage record/write or replay execution.");
  });

  it("mutation: rejects a mutable Core ref and former-source leakage in leaf and test evidence", async () => {
    const [wysiwyg, richInline, testSource] = await Promise.all([
      leafFor("wysiwyg-draft-input-and-guards"),
      leafFor("rich-inline-commit-and-session-lifecycle"),
      readFile(new URL(import.meta.url), "utf8"),
    ]);
    const allSourcePaths = [...wysiwyg.subgroup.sourcePaths, ...richInline.subgroup.sourcePaths];
    const formerSource = allSourcePaths[0];
    if (!formerSource) throw new Error("Expected WYSIWYG and rich-inline sources");

    expect(() => expectImmutableCoreAnchors(`${wysiwyg.leaf}\nflowdoc-vnext-core@main:example.ts`, 15)).toThrow();
    expect(() => expectNoFormerSourceLeakage(`${richInline.leaf}\n${formerSource}`, allSourcePaths)).toThrow();
    expect(() => expectNoFormerSourceLeakage(`${testSource}\n${formerSource}`, allSourcePaths)).toThrow();
  });
});
