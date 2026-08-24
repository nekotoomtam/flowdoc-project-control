import { access, readFile } from "node:fs/promises";
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
  "## Current Verified State",
  "## State and Failure Model",
  "## Known Limits and Unknowns",
  "## Historical Design Notes",
  "## Canonical Cross-references",
  "## Evidence Anchors",
] as const;

const productHeadings = [
  "## Cross-repository Ownership",
  "## Renderer Consumption Without Measurement or Relayout",
  "## Selected Parity and Activation Limits",
] as const;

const geometryHeadings = [
  "## Layout Units and Spatial Wrapping",
  "## Authored-box and Inline-image Geometry",
  "## Source Segments, Forced Breaks, and Display-list Projection",
  "## Producer-owned Geometry Facts",
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

function provenance(subgroup: Subgroup) {
  const fingerprints = {
    "product-readiness-and-renderer-boundaries": "6e609332b2d606a2c4c24251c5bb0f7857abe5110525f6876621c803fbbbba90",
    "geometry-and-scene-projection": "0e344e457824e6510c5328062fd59e2d6047e1581c5e616cb9bd8237d559e2a3",
  } as const;
  const counts = {
    "product-readiness-and-renderer-boundaries": 3,
    "geometry-and-scene-projection": 16,
  } as const;
  const subgroupId = subgroup.subgroupId as keyof typeof fingerprints;
  return {
    projectRoot: root,
    coreEvidenceRoot,
    sourcePaths: subgroup.sourcePaths,
    expectedCount: counts[subgroupId],
    expectedFingerprint: fingerprints[subgroupId],
    frozenCommit: frozenSourceCommit,
    currentCommit: currentEvidenceCommit,
  };
}

async function leafFor(subgroupId: string): Promise<{ subgroup: Subgroup; leaf: string }> {
  const subgroup = subgroupFor(await readOrientation(), subgroupId);
  return { subgroup, leaf: await readFile(join(root, subgroup.proposedLeafPath), "utf8") };
}

function expectHeadings(leaf: string, headings: readonly string[]): void {
  expect(leaf.match(/^## .+$/gmu) ?? []).toEqual(headings);
}

function expectImmutableCoreAnchors(leaf: string): void {
  const anchors = [...leaf.matchAll(/flowdoc-vnext-core@([^:\s`]+):[^\s`]+/g)];
  expect(anchors.length).toBeGreaterThan(0);
  for (const [, commit] of anchors) expect(commit).toBe(currentEvidenceCommit);
}

function expectNoFormerSourceLeakage(value: string, sourcePaths: readonly string[]): void {
  for (const sourcePath of sourcePaths) expect(value).not.toContain(sourcePath);
}

function expectProductBoundary(leaf: string): void {
  expect(leaf).not.toMatch(/browser Worker is active/i);
  expect(leaf).not.toMatch(/Editor or Backend owns the Core layout route/i);
  expect(leaf).not.toMatch(/renderer remeasures or relayouts fragments/i);
  expect(leaf).not.toMatch(/XR-4 or XR-5 proves Canvas\/PDF glyph-pixel parity/i);
  expect(leaf).not.toMatch(/historical Phase 3\/4 PASS proves current product readiness/i);
}

function expectGeometryBoundary(leaf: string): void {
  expect(leaf).not.toMatch(/geometry evidence proves production binding/i);
  expect(leaf).not.toMatch(/XR-4 or XR-5 proves Canvas\/PDF glyph-pixel parity/i);
  expect(leaf).not.toMatch(/renderer remeasures or relayouts fragments/i);
}

describe("Live Draft product readiness and geometry documentation leaves", () => {
  it("derives both leaves from orientation and verifies frozen/current provenance", async () => {
    const orientation = await readOrientation();
    const product = subgroupFor(orientation, "product-readiness-and-renderer-boundaries");
    const geometry = subgroupFor(orientation, "geometry-and-scene-projection");

    expect(orientation.sourceCommit).toBe(frozenSourceCommit);
    await expectFrozenCurrentSourceProvenance(provenance(product));
    await expectFrozenCurrentSourceProvenance(provenance(geometry));
  });

  it("requires exact product and geometry headings", async () => {
    const [product, geometry] = await Promise.all([
      leafFor("product-readiness-and-renderer-boundaries"),
      leafFor("geometry-and-scene-projection"),
    ]);
    expectHeadings(product.leaf, [...commonHeadings.slice(0, 2), ...productHeadings, ...commonHeadings.slice(2)]);
    expectHeadings(geometry.leaf, [...commonHeadings.slice(0, 2), ...geometryHeadings, ...commonHeadings.slice(2)]);
  });

  it("uses immutable evidence anchors without former-source leakage", async () => {
    const [product, geometry, testSource] = await Promise.all([
      leafFor("product-readiness-and-renderer-boundaries"),
      leafFor("geometry-and-scene-projection"),
      readFile(new URL(import.meta.url), "utf8"),
    ]);
    const sourcePaths = [...product.subgroup.sourcePaths, ...geometry.subgroup.sourcePaths];
    expectImmutableCoreAnchors(product.leaf);
    expectImmutableCoreAnchors(geometry.leaf);
    expectNoFormerSourceLeakage(product.leaf, sourcePaths);
    expectNoFormerSourceLeakage(geometry.leaf, sourcePaths);
    expectNoFormerSourceLeakage(testSource, sourcePaths);
  });

  it("keeps product and geometry claims within their responsibility boundaries", async () => {
    const [product, geometry] = await Promise.all([
      leafFor("product-readiness-and-renderer-boundaries"),
      leafFor("geometry-and-scene-projection"),
    ]);
    expectProductBoundary(product.leaf);
    expectGeometryBoundary(geometry.leaf);
  });

  it("mutation: rejects forbidden positive claims with legitimate negative controls", async () => {
    const [product, geometry] = await Promise.all([
      leafFor("product-readiness-and-renderer-boundaries"),
      leafFor("geometry-and-scene-projection"),
    ]);
    expect(() => expectProductBoundary(`${product.leaf}\nbrowser Worker is active`)).toThrow();
    expect(() => expectProductBoundary(`${product.leaf}\nEditor or Backend owns the Core layout route`)).toThrow();
    expect(() => expectProductBoundary(`${product.leaf}\nrenderer remeasures or relayouts fragments`)).toThrow();
    expect(() => expectProductBoundary(`${product.leaf}\nXR-4 or XR-5 proves Canvas/PDF glyph-pixel parity`)).toThrow();
    expect(() => expectProductBoundary(`${product.leaf}\nhistorical Phase 3/4 PASS proves current product readiness`)).toThrow();
    expect(() => expectGeometryBoundary(`${geometry.leaf}\ngeometry evidence proves production binding`)).toThrow();
    expectProductBoundary(`${product.leaf}\nBrowser Worker activation remains unknown.`);
    expectProductBoundary(`${product.leaf}\nNo Editor or Backend owns Core's layout route.`);
    expectProductBoundary(`${product.leaf}\nRenderer consumption never remeasures or relayouts fragments.`);
    expectProductBoundary(`${product.leaf}\nXR-4 and XR-5 do not prove Canvas/PDF glyph-pixel parity.`);
    expectProductBoundary(`${product.leaf}\nHistorical Phase 3/4 PASS does not establish current product readiness.`);
    expectGeometryBoundary(`${geometry.leaf}\nProduction binding remains excluded.`);
  });

  it("keeps only the two orientation-derived leaves in this documentation scope", async () => {
    const orientation = await readOrientation();
    const paths = [
      subgroupFor(orientation, "product-readiness-and-renderer-boundaries").proposedLeafPath,
      subgroupFor(orientation, "geometry-and-scene-projection").proposedLeafPath,
    ];
    expect(new Set(paths).size).toBe(2);
    for (const path of paths) await expect(access(join(root, path))).resolves.toBeUndefined();
  });
});
