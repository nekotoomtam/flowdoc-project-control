import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { resolveCoreEvidenceRoot } from "./core-evidence-root.js";
import { expectFrozenCurrentSourceProvenance } from "./template-builder-source-provenance.js";

const root = process.cwd();
const currentEvidenceCommit = "c503a45c03e0ce3b7a6efba2b029ca842017faa0";
const frozenSourceCommit = "76a2f2311a898e781f53773390d47b05812911e4";
const expectedFrozenViewportSourceFingerprint = "a9088afe0a43bf45d050178c314465ab2c1f104bc6474ea9a5ce212069b7de92";
const coreEvidenceRoot = resolveCoreEvidenceRoot(root);

const headings = [
  "## Authority and Scope",
  "## Responsibility Boundary",
  "## Visible-range Requests and Resolution",
  "## Request, Prediction, Measurement, and Apply",
  "## Render Window, Shell, and Section Representation",
  "## Measured Spacers and Placeholder Estimates",
  "## Virtual Stack and Lazy Detail",
  "## Scheduler Candidate, Runtime, and Apply Guards",
  "## Scroll Coordination and Anchor Restoration",
  "## Bounded Synthetic Shape Evidence",
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
  return JSON.parse(
    await readFile(join(root, "migrations/V0_1_0a_1/core/wave-a-orientation.json"), "utf8"),
  ) as Orientation;
}

function viewportSubgroup(orientation: Orientation): Subgroup {
  const subgroup = orientation.families
    .filter((family) => family.familyId === "template-builder")
    .flatMap((family) => family.subgroups)
    .find((candidate) => candidate.subgroupId === "viewport-and-virtualized-rendering");
  if (!subgroup) throw new Error("Missing Template Builder viewport subgroup");
  return subgroup;
}

async function viewportLeaf(): Promise<{ subgroup: Subgroup; leaf: string }> {
  const subgroup = viewportSubgroup(await readOrientation());
  return { subgroup, leaf: await readFile(join(root, subgroup.proposedLeafPath), "utf8") };
}

async function expectFrozenViewportProvenance(sourcePaths: readonly string[]): Promise<void> {
  await expectFrozenCurrentSourceProvenance({
    projectRoot: root,
    coreEvidenceRoot,
    sourcePaths,
    expectedCount: 19,
    expectedFingerprint: expectedFrozenViewportSourceFingerprint,
    frozenCommit: frozenSourceCommit,
    currentCommit: currentEvidenceCommit,
  });
}

function expectImmutableCoreAnchors(leaf: string): void {
  const anchors = [...leaf.matchAll(/flowdoc-vnext-core@([^:\s`]+):[^\s`]+/g)];
  expect(anchors.length).toBeGreaterThanOrEqual(19);
  for (const [, commit] of anchors) expect(commit).toBe(currentEvidenceCommit);
  expect(leaf).not.toMatch(/flowdoc-vnext-core@(?!c503a45c03e0ce3b7a6efba2b029ca842017faa0:)/);
}

function expectNoFormerSourceLeakage(value: string, sourcePaths: readonly string[]): void {
  for (const sourcePath of sourcePaths) expect(value).not.toContain(sourcePath);
}

function expectBoundedViewportClaims(leaf: string): void {
  expect(leaf).not.toMatch(/(?:proves|establishes|guarantees|demonstrates) (?:wall-clock latency|performance)/i);
  expect(leaf).not.toMatch(/(?:proves|establishes|guarantees|demonstrates) production[- ]performance/i);
  expect(leaf).not.toMatch(/(?:provides|uses|proves) (?:browser-element reuse|browser element reuse|DOM recycling)/i);
  expect(leaf).not.toMatch(/(?:proves|establishes|guarantees|demonstrates) production (?:readiness|renderer|virtualization)/i);
  expect(leaf).not.toMatch(/(?:proves|establishes|guarantees|demonstrates) renderer fidelity/i);
  expect(leaf).not.toMatch(/(?:proves|establishes|guarantees|demonstrates) (?:all|any|unbounded) (?:large )?documents? (?:are|remain|will be) bounded/i);
  expect(leaf).not.toMatch(/(?:proves|establishes|guarantees|demonstrates) unbounded large-document support/i);
  expect(leaf).not.toMatch(/(?:provides|uses|proves) a real-time scheduler/i);
}

describe("Template Builder viewport documentation leaf", () => {
  it("derives the exact 19-source viewport subgroup and its required leaf headings", async () => {
    const orientation = await readOrientation();
    const { subgroup, leaf } = await viewportLeaf();

    expect(orientation.sourceCommit).toBe(frozenSourceCommit);
    await expectFrozenViewportProvenance(subgroup.sourcePaths);
    expect(leaf.match(/^## .+$/gm) ?? []).toEqual(headings);
    expect(leaf).toContain("19 assigned / 19 unique / 0 missing / 0 extra / 0 drift");
  });

  it("keeps request, predicted candidate, measured facts, apply decision, runtime, and render window distinct", async () => {
    const { leaf } = await viewportLeaf();

    for (const term of [
      "request intent",
      "predicted candidate",
      "browser-local measurement facts",
      "guarded apply decision",
      "scheduler runtime state",
      "resolved render window",
    ]) expect(leaf).toMatch(new RegExp(term, "i"));
  });

  it("uses immutable Core anchors and does not repeat former source paths", async () => {
    const { subgroup, leaf } = await viewportLeaf();
    const testSource = await readFile(new URL(import.meta.url), "utf8");

    expectImmutableCoreAnchors(leaf);
    expectNoFormerSourceLeakage(leaf, subgroup.sourcePaths);
    expectNoFormerSourceLeakage(testSource, subgroup.sourcePaths);
  });

  it("states the exact bounded 72-section synthetic shape without promoting it", async () => {
    const { leaf } = await viewportLeaf();

    expect(leaf).toContain("72 ordered synthetic sections");
    expect(leaf).toContain("936 ordered synthetic runtime nodes");
    expect(leaf).toContain("section-50");
    expect(leaf).toContain("80-node scheduler budget");
    expect(leaf).toContain("section-49–section-51");
    expect(leaf).toContain("39 visible nodes");
    expect(leaf).toContain("renders three shell sections");
    expect(leaf).toContain("69 placeholders");
    expect(leaf).toContain("two virtual spacers");
    expect(leaf).toContain("defers inactive heavy table detail");
    expect(leaf).toContain("preserves the active target-table path");
    expect(leaf).toContain("restores the target node after a shifted section measurement");
    expectBoundedViewportClaims(leaf);
  });

  it("mutation: rejects positive performance, browser-element reuse, and unbounded claims", async () => {
    const { leaf } = await viewportLeaf();

    for (const mutation of [
      "proves wall-clock latency",
      "uses DOM recycling",
      "proves production-performance",
      "uses browser-element reuse",
      "establishes production readiness",
      "demonstrates renderer fidelity",
      "guarantees all documents are bounded",
      "proves unbounded large-document support",
    ]) expect(() => expectBoundedViewportClaims(`${leaf}\n${mutation}`)).toThrow();
  });

  it("mutation: rejects a reordered viewport assignment against frozen provenance", async () => {
    const { subgroup } = await viewportLeaf();

    await expect(expectFrozenViewportProvenance([...subgroup.sourcePaths].reverse())).rejects.toThrow();
  });

  it("mutation: rejects mutable Core refs and former-source leakage in both leaf and test", async () => {
    const { subgroup, leaf } = await viewportLeaf();
    const testSource = await readFile(new URL(import.meta.url), "utf8");
    const formerSource = subgroup.sourcePaths[0];
    if (!formerSource) throw new Error("Viewport subgroup has no source paths");

    expect(() => expectImmutableCoreAnchors(`${leaf}\nflowdoc-vnext-core@main:example.ts`)).toThrow();
    expect(() => expectNoFormerSourceLeakage(`${leaf}\n${formerSource}`, subgroup.sourcePaths)).toThrow();
    expect(() => expectNoFormerSourceLeakage(`${testSource}\n${formerSource}`, subgroup.sourcePaths)).toThrow();
  });
});
