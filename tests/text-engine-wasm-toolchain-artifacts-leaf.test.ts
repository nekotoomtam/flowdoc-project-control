import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();

interface SemanticSubgroup {
  subgroupId: string;
  sourcePaths: string[];
  proposedLeafPath: string;
}

interface FamilyOrientation {
  familyId: string;
  subgroups: SemanticSubgroup[];
}

interface WaveAOrientation {
  families: FamilyOrientation[];
}

const expectedQualifiedSubgroup = "text-engine/wasm-toolchain-and-artifacts";
const expectedLeafPath =
  "docs/versions/V0_1_0a_1/core/text-engine/wasm-toolchain-and-artifacts.md";
const expectedCurrentEvidenceCommit = "c503a45c03e0ce3b7a6efba2b029ca842017faa0";
const expectedHeadings = [
  "## Authority and Scope",
  "## Current Package Boundary",
  "## Toolchain Discovery and Provisioning",
  "## Build and Bindgen Flow",
  "## Tracked Artifact Contract",
  "## Verification Commands",
  "## Known Limits and Unknowns",
  "## Historical Design Notes",
  "## Evidence Anchors",
] as const;

const prohibitedClaimMutations = [
  ["native/WASM parity established", "Native/WASM parity is established."],
  ["renderer drift accepted", "Renderer drift is accepted."],
  ["renderer drift verified", "Renderer drift is verified."],
  ["numeric threshold accepted", "Numeric threshold is accepted."],
  ["accepted manifest ready", "Accepted manifest is ready."],
] as const;

const allowedBoundaryMutations = [
  ["native/WASM parity not run", "nativeWasmParityStatus: not-run"],
  ["renderer-backed drift unknown", "rendererBackedDriftStatus: unknown"],
  ["numeric drift threshold blocked", "numericDriftThresholdStatus: blocked"],
  ["accepted manifest blocked", "acceptedManifestStatus: blocked"],
] as const;

async function readOrientation(): Promise<WaveAOrientation> {
  const contents = await readFile(
    join(root, "migrations/V0_1_0a_1/core/wave-a-orientation.json"),
    "utf8",
  );
  return JSON.parse(contents) as WaveAOrientation;
}

function findSubgroup(orientation: WaveAOrientation): SemanticSubgroup {
  const subgroup = orientation.families
    .flatMap((family) =>
      family.subgroups.map((candidate) => ({
        ...candidate,
        qualifiedId: `${family.familyId}/${candidate.subgroupId}`,
      })),
    )
    .find(({ qualifiedId }) => qualifiedId === expectedQualifiedSubgroup);

  if (!subgroup) throw new Error(`Missing subgroup: ${expectedQualifiedSubgroup}`);
  return subgroup;
}

function expectProvenanceSafe(
  leaf: string,
  testSource: string,
  formerSourcePaths: string[],
): void {
  const evidenceReferences = [...leaf.matchAll(/flowdoc-vnext-core@([^:\s`]+):/g)];

  expect(evidenceReferences.length).toBeGreaterThan(0);
  for (const reference of evidenceReferences) {
    expect(reference[1]).toBe(expectedCurrentEvidenceCommit);
  }
  expect(leaf).not.toMatch(/https?:\/\/[^\s)]+\/blob\/(?:main|master)\//i);
  expect(leaf).not.toMatch(/(?:[A-Za-z]:\\|file:\/\/|\/(?:Users|home|tmp)\/)/);
  for (const formerSourcePath of formerSourcePaths) {
    expect(leaf).not.toContain(formerSourcePath);
    expect(testSource).not.toContain(formerSourcePath);
  }
}

function expectFactualBoundarySafe(leaf: string): void {
  expect(leaf).not.toMatch(/\b(?:is|are|became|becomes|now) production[- ]ready\b/i);
  expect(leaf).not.toMatch(
    /\bdefault (?:Core )?measurer (?:uses|adopts|has adopted|was replaced by|is replaced by)\b/i,
  );
  expect(leaf).not.toMatch(/\bnative\/wasm parity is established\b/i);
  expect(leaf).not.toMatch(/\brenderer(?:-backed)? drift is (?:accepted|verified)\b/i);
  expect(leaf).not.toMatch(/\bnumeric(?: drift)? thresholds? (?:is|are) accepted\b/i);
  expect(leaf).not.toMatch(/\baccepted (?:summary )?manifest is ready\b/i);
}

describe("Text Engine WASM toolchain and artifacts leaf", () => {
  it("preserves the frozen batch identity and current-first document contract", async () => {
    const orientation = await readOrientation();
    const subgroup = findSubgroup(orientation);
    const leaf = await readFile(join(root, subgroup.proposedLeafPath), "utf8");

    expect(subgroup.proposedLeafPath).toBe(expectedLeafPath);
    expect(subgroup.sourcePaths).toHaveLength(13);
    expect(new Set(subgroup.sourcePaths).size).toBe(13);

    const headings = leaf.match(/^## .+$/gm) ?? [];
    expect(headings).toEqual(expectedHeadings);
    expect(leaf).toContain(expectedCurrentEvidenceCommit);
    expect(leaf).toContain("4667b7fe401eddf09133a8a22af11456ab018b2a32c668a031b8120a79db8a44");
    expect(leaf).toContain("productionReady: false");
    expect(leaf).toContain("defaultMeasurerReplacement: false");
    expect(leaf).toContain("nativeWasmParityStatus: not-run");
    expect(leaf).toContain("rendererBackedDriftStatus: unknown");
    expect(leaf).toContain("numericDriftThresholdStatus: blocked");
    expect(leaf).toContain("acceptedManifestStatus: blocked");
  });

  it("uses immutable evidence anchors without retaining former source paths", async () => {
    const orientation = await readOrientation();
    const subgroup = findSubgroup(orientation);
    const leaf = await readFile(join(root, subgroup.proposedLeafPath), "utf8");
    const testSource = await readFile(new URL(import.meta.url), "utf8");

    expectProvenanceSafe(leaf, testSource, subgroup.sourcePaths);
  });

  it("rejects unqualified readiness and default-measurer claims", async () => {
    const orientation = await readOrientation();
    const subgroup = findSubgroup(orientation);
    const leaf = await readFile(join(root, subgroup.proposedLeafPath), "utf8");

    expectFactualBoundarySafe(leaf);
  });

  it("mutation: rejects a former source literal introduced in the test source", async () => {
    const orientation = await readOrientation();
    const subgroup = findSubgroup(orientation);
    const leaf = await readFile(join(root, subgroup.proposedLeafPath), "utf8");
    const testSource = await readFile(new URL(import.meta.url), "utf8");
    const formerSourcePath = subgroup.sourcePaths.at(0);
    if (!formerSourcePath) throw new Error("Frozen subgroup must contain a source");

    expect(() =>
      expectProvenanceSafe(leaf, `${testSource}\n${formerSourcePath}`, subgroup.sourcePaths)
    ).toThrow();
  });

  it("mutation: rejects a mutable Core evidence reference", async () => {
    const orientation = await readOrientation();
    const subgroup = findSubgroup(orientation);
    const leaf = await readFile(join(root, subgroup.proposedLeafPath), "utf8");
    const testSource = await readFile(new URL(import.meta.url), "utf8");
    const mutableReference = "flowdoc-vnext-core@main:packages/text-engine-rust-wasm/package.json";

    expect(() =>
      expectProvenanceSafe(`${leaf}\n${mutableReference}`, testSource, subgroup.sourcePaths)
    ).toThrow();
  });

  it.each(prohibitedClaimMutations)("mutation: rejects %s", async (_label, claim) => {
    const orientation = await readOrientation();
    const subgroup = findSubgroup(orientation);
    const leaf = await readFile(join(root, subgroup.proposedLeafPath), "utf8");

    expect(() => expectFactualBoundarySafe(`${leaf}\n${claim}`)).toThrow();
  });

  it.each(allowedBoundaryMutations)("allows explicit %s wording", async (_label, claim) => {
    const orientation = await readOrientation();
    const subgroup = findSubgroup(orientation);
    const leaf = await readFile(join(root, subgroup.proposedLeafPath), "utf8");

    expect(() => expectFactualBoundarySafe(`${leaf}\n${claim}`)).not.toThrow();
  });
});
