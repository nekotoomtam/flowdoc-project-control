import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const root = join(fileURLToPath(new URL("..", import.meta.url)));
const expectedQualifiedSubgroup = "text-block/v4-measurement-and-pagination";
const expectedLeafPath =
  "docs/versions/V0_1_0a_1/core/text-block/v4-measurement-and-pagination.md";
const expectedFrozenSourceCommit = "76a2f2311a898e781f53773390d47b05812911e4";
const expectedCurrentCoreCommit = "c503a45c03e0ce3b7a6efba2b029ca842017faa0";
const expectedInventoryDigest =
  "36f54f2302d51895615a81767c92c0ccba18563703471c33169b3816b63e5f5b";
const expectedSourceListSha256 =
  "8fc96ebd0ecc4917724fc52f023dc3e90e80fd615a0c278b0e70ea246237e7a5";
const expectedInventoryBlobIds = [
  "720192edaf00bcbf212e6bde64e3fe1a560c21cc",
  "3e98a875f7ce00b7298fcb117cbc280943586bb6",
  "081b7aca789aefcd044602f0773f9c584608bec4",
] as const;
const expectedHeadings = [
  "## Authority and Scope",
  "## Resolved Measurement Source Contract",
  "## Accepted Line Range Contract",
  "## Isolated Pagination Contract",
  "## Bounded Close-Audit Result",
  "## Explicit Exclusions",
  "## Current Verified State",
  "## Risks and Unknowns",
  "## Evidence Anchors",
] as const;
const expectedCoreAnchors = [
  "src/resolution/resolvedDocument.ts",
  "src/pagination/textBlockV4Measurement.ts",
  "src/pagination/textBlockV4Pagination.ts",
  "tests/textBlockV4Measurement.test.ts",
  "tests/textBlockV4Pagination.test.ts",
  "tests/textBlockV4ReadinessCloseAudit.test.ts",
] as const;

type WaveAOrientation = {
  sourceCommit: string;
  inventoryDigest: string;
  families: Array<{
    familyId: string;
    subgroups: Array<{ subgroupId: string; proposedLeafPath: string; sourcePaths: string[] }>;
  }>;
};
type CoreInventory = {
  sourceCommit: string;
  sourceDigest: string;
  files: Array<{ path: string; blobId: string }>;
};

async function readJson<T>(relativePath: string): Promise<T> {
  return JSON.parse(await readFile(join(root, relativePath), "utf8")) as T;
}

function sha256(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

function findSubgroup(orientation: WaveAOrientation) {
  const subgroup = orientation.families
    .flatMap((family) => family.subgroups.map((candidate) => ({
      ...candidate,
      qualifiedId: `${family.familyId}/${candidate.subgroupId}`,
    })))
    .find(({ qualifiedId }) => qualifiedId === expectedQualifiedSubgroup);

  if (!subgroup) throw new Error(`Missing subgroup: ${expectedQualifiedSubgroup}`);
  return subgroup;
}

function expectNoFormerSources(value: string, sourcePaths: readonly string[]): void {
  for (const sourcePath of sourcePaths) expect(value).not.toContain(sourcePath);
}

function expectImmutableCoreAnchors(leaf: string): void {
  for (const anchor of expectedCoreAnchors) {
    expect(leaf).toContain(`flowdoc-vnext-core@${expectedCurrentCoreCommit}:${anchor}`);
  }
  const coreRefs = [...leaf.matchAll(/flowdoc-vnext-core@([^:\s`]+):/g)];
  expect(coreRefs.length).toBeGreaterThan(0);
  for (const coreRef of coreRefs) expect(coreRef[1]).toBe(expectedCurrentCoreCommit);
}

function expectNoCaretOrReadinessOverclaim(value: string): void {
  const unsupportedClaims = [
    /Measurement source points are editor caret offsets\./i,
    /Resolved offsets may be used as editor caret offsets\./i,
    /6,000-line\/250-page threshold proves general performance readiness\./i,
    /6,000-line\/250-page threshold proves product readiness\./i,
    /6,000-line\/250-page result establishes mixed-document readiness\./i,
  ];
  for (const claim of unsupportedClaims) expect(value).not.toMatch(claim);
}

function expectExactResolvedExecutionFields(value: string): void {
  for (const field of [
    "inputFetch",
    "authoredGraphMutation",
    "generatedExpansion",
    "pagination",
    "rendering",
  ]) expect(value).toContain(`\`${field}\``);
  expect(value).toMatch(
    /`inputFetch`, `generatedExpansion`,\s+`pagination`, and `rendering` are `not-run`, while `authoredGraphMutation` is\s+`false`/,
  );
  expect(value).toContain("no `measurement` execution field");
  expect(value).not.toMatch(/execution\s+records measurement, pagination, and rendering as `not-run`/i);
}

describe("Text Block v4 measurement and pagination leaf", () => {
  it("preserves the exact three-source closure, frozen blobs, and immutable Core anchors", async () => {
    const [orientation, inventory, leaf] = await Promise.all([
      readJson<WaveAOrientation>("migrations/V0_1_0a_1/core/wave-a-orientation.json"),
      readJson<CoreInventory>("migrations/V0_1_0a_1/core/inventory.json"),
      readFile(join(root, expectedLeafPath), "utf8"),
    ]);
    const subgroup = findSubgroup(orientation);

    expect(orientation.sourceCommit).toBe(expectedFrozenSourceCommit);
    expect(orientation.inventoryDigest).toBe(expectedInventoryDigest);
    expect(inventory.sourceCommit).toBe(expectedFrozenSourceCommit);
    expect(inventory.sourceDigest).toBe(expectedInventoryDigest);
    expect(subgroup.proposedLeafPath).toBe(expectedLeafPath);
    expect(subgroup.sourcePaths).toHaveLength(3);
    expect(new Set(subgroup.sourcePaths).size).toBe(3);
    expect(sha256(subgroup.sourcePaths.join("\n"))).toBe(expectedSourceListSha256);
    expect(
      subgroup.sourcePaths.map((path) => inventory.files.find((file) => file.path === path)?.blobId),
    ).toEqual(expectedInventoryBlobIds);

    expect(leaf.match(/^## .+$/gm) ?? []).toEqual(expectedHeadings);
    expect(leaf).toContain("authoredOffset");
    expect(leaf).toContain("resolvedOffset");
    expect(leaf).toContain("complete, gap-free");
    expect(leaf).toContain("Every occupied page receives one derived fragment");
    expect(leaf).toContain("6,000-line/250-page");
    expectImmutableCoreAnchors(leaf);
  });

  it("keeps former-source paths and mutable Core refs out of the candidate leaf and guard", async () => {
    const orientation = await readJson<WaveAOrientation>(
      "migrations/V0_1_0a_1/core/wave-a-orientation.json",
    );
    const subgroup = findSubgroup(orientation);
    const [leaf, testSource] = await Promise.all([
      readFile(join(root, subgroup.proposedLeafPath), "utf8"),
      readFile(new URL(import.meta.url), "utf8"),
    ]);

    expectNoFormerSources(leaf, subgroup.sourcePaths);
    expectNoFormerSources(testSource, subgroup.sourcePaths);
    for (const mutableRef of ["main", "master", "develop", "HEAD"]) {
      const ref = `flowdoc-vnext-core@${mutableRef}`;
      expect(leaf).not.toContain(ref);
      expect(testSource).not.toContain(ref);
    }
  });

  it("keeps resolved source mapping out of editor caret semantics and the close audit out of broad readiness", async () => {
    const orientation = await readJson<WaveAOrientation>(
      "migrations/V0_1_0a_1/core/wave-a-orientation.json",
    );
    const leaf = await readFile(join(root, findSubgroup(orientation).proposedLeafPath), "utf8");

    expect(leaf).toMatch(/must not\s+become editor caret offsets/);
    expect(leaf).toContain("not general performance readiness or product readiness");
    expectNoCaretOrReadinessOverclaim(leaf);
    expect(() => expectNoCaretOrReadinessOverclaim(
      `${leaf}\nMeasurement source points are editor caret offsets.`,
    )).toThrow();
    expect(() => expectNoCaretOrReadinessOverclaim(
      `${leaf}\nResolved offsets may be used as editor caret offsets.`,
    )).toThrow();
    expect(() => expectNoCaretOrReadinessOverclaim(
      `${leaf}\n6,000-line/250-page threshold proves general performance readiness.`,
    )).toThrow();
    expect(() => expectNoCaretOrReadinessOverclaim(
      `${leaf}\n6,000-line/250-page threshold proves product readiness.`,
    )).toThrow();
    expect(() => expectNoCaretOrReadinessOverclaim(
      `${leaf}\n6,000-line/250-page result establishes mixed-document readiness.`,
    )).toThrow();
  });

  it("reports only the actual resolved-document execution fields", async () => {
    const orientation = await readJson<WaveAOrientation>(
      "migrations/V0_1_0a_1/core/wave-a-orientation.json",
    );
    const leaf = await readFile(join(root, findSubgroup(orientation).proposedLeafPath), "utf8");

    expectExactResolvedExecutionFields(leaf);
    expect(() => expectExactResolvedExecutionFields(
      `${leaf}\nIts execution records measurement, pagination, and rendering as \`not-run\`.`,
    )).toThrow();
  });

  it("states every measurement and pagination boundary explicitly", async () => {
    const orientation = await readJson<WaveAOrientation>(
      "migrations/V0_1_0a_1/core/wave-a-orientation.json",
    );
    const leaf = await readFile(join(root, findSubgroup(orientation).proposedLeafPath), "utf8");

    for (const exclusion of [
      "choosing or executing a shaper",
      "generated page-number expansion",
      "mixed-node composition",
      "renderer/export",
      "backend jobs",
      "cross-page DOM/caret behavior",
      "general performance readiness",
    ]) expect(leaf).toContain(exclusion);
  });
});
