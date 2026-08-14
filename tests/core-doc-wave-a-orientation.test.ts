import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();

interface InventoryFile {
  path: string;
  candidateFamily: string;
}

interface CoreMarkdownInventory {
  sourceCommit: string;
  sourceDigest: string;
  expectedFileCount: number;
  files: InventoryFile[];
}

interface FamilySource { path: string }
interface FamilyAssignment { familyId: string; sources: FamilySource[] }
interface CoreFamilyMap { inventoryDigest: string; families: FamilyAssignment[] }

interface OrientationSource {
  path: string;
  rationale: string;
}

interface EvidenceCheck {
  question: string;
  anchors: string[];
}

interface SemanticSubgroup {
  subgroupId: string;
  title: string;
  responsibility: string;
  boundary: string;
  sourcePaths: string[];
  proposedLeafPath: string;
  dependsOn: string[];
  crossReferences: string[];
  oversizedCohesionRationale: string | null;
  evidenceChecks: EvidenceCheck[];
}

interface OrientationConflict {
  id: string;
  owningSubgroupId: string;
  summary: string;
  evidenceNeeds: string;
}

interface FamilyOrientation {
  familyId: string;
  sourceCount: number;
  reviewState: string;
  orientationSources: OrientationSource[];
  provisionalModel: string | null;
  subgroups: SemanticSubgroup[];
  conflicts: OrientationConflict[];
}

type WaveAFamilyId = FamilyOrientation["familyId"];

interface WaveAOrientation {
  kind: string;
  schemaVersion: number;
  releaseLine: string;
  repositoryId: string;
  sourceCommit: string;
  inventoryDigest: string;
  reviewState: string;
  families: FamilyOrientation[];
  synthesisOrder: string[];
}

async function readJson<T>(path: string): Promise<T> {
  return JSON.parse(await readFile(path, "utf8")) as T;
}

function sorted(values: string[]): string[] {
  return [...values].sort();
}

function expectMappedFamily(
  orientation: WaveAOrientation,
  familyMap: CoreFamilyMap,
  familyId: WaveAFamilyId,
  expectedCount: number,
): void {
  const family = orientation.families.find((candidate) => candidate.familyId === familyId);
  const mappedFamily = familyMap.families.find((candidate) => candidate.familyId === familyId);

  expect(family).toBeDefined();
  expect(mappedFamily).toBeDefined();
  expect(family?.reviewState).toBe("mapped");
  expect(family?.provisionalModel?.trim().length).toBeGreaterThan(0);

  const sourcePaths = family?.subgroups.flatMap((subgroup) => subgroup.sourcePaths) ?? [];
  expect(sourcePaths).toEqual([...new Set(sourcePaths)]);
  expect(sorted(sourcePaths)).toEqual(sorted(mappedFamily?.sources.map((source) => source.path) ?? []));
  expect(sourcePaths).toHaveLength(expectedCount);

  const subgroupIds = new Set(family?.subgroups.map((subgroup) => subgroup.subgroupId) ?? []);
  const proposedLeaves = family?.subgroups.map((subgroup) => subgroup.proposedLeafPath) ?? [];
  for (const subgroup of family?.subgroups ?? []) {
    expect(subgroup).not.toHaveProperty("id");
    expect(subgroup).not.toHaveProperty("proposedLeaf");
    expect(subgroup.subgroupId).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    expect(subgroup.title.trim().length).toBeGreaterThan(0);
    expect(subgroup.responsibility.trim().length).toBeGreaterThan(0);
    expect(subgroup.boundary.trim().length).toBeGreaterThan(0);
    expect(subgroup.sourcePaths.length).toBeGreaterThan(0);
    expect(subgroup.proposedLeafPath).toMatch(new RegExp(`^docs/versions/V0_1_0a_1/core/${familyId}/[a-z0-9]+(?:-[a-z0-9]+)*\\.md$`));
    expect(subgroup.evidenceChecks.length).toBeGreaterThan(0);
    for (const evidenceCheck of subgroup.evidenceChecks) {
      expect(evidenceCheck.question.trim().length).toBeGreaterThan(0);
      expect(evidenceCheck.anchors.length).toBeGreaterThan(0);
      expect(evidenceCheck.anchors.every((anchor) => anchor.trim().length > 0)).toBe(true);
    }
    expect(subgroup.oversizedCohesionRationale).toEqual(
      subgroup.sourcePaths.length > 25 ? expect.any(String) : null,
    );
    if (subgroup.sourcePaths.length > 25) {
      expect(subgroup.oversizedCohesionRationale?.trim().length).toBeGreaterThan(0);
    }
    for (const reference of [...subgroup.dependsOn, ...subgroup.crossReferences]) {
      expect(reference).toMatch(new RegExp(`^${familyId}/[a-z0-9]+(?:-[a-z0-9]+)*$`));
      expect(subgroupIds.has(reference.slice(familyId.length + 1))).toBe(true);
    }
  }
  expect(proposedLeaves).toEqual([...new Set(proposedLeaves)]);

  for (const conflict of family?.conflicts ?? []) {
    expect(conflict).not.toHaveProperty("subgroupId");
    expect(subgroupIds.has(conflict.owningSubgroupId)).toBe(true);
    expect(conflict.evidenceNeeds.trim().length).toBeGreaterThan(0);
  }
}

describe("Wave A Core documentation orientation", () => {
  it("freezes the draft identity against the stored Core inventory", async () => {
    const [orientation, inventory, familyMap] = await Promise.all([
      readJson<WaveAOrientation>(join(root, "migrations/V0_1_0a_1/core/wave-a-orientation.json")),
      readJson<CoreMarkdownInventory>(join(root, "migrations/V0_1_0a_1/core/inventory.json")),
      readJson<CoreFamilyMap>(join(root, "migrations/V0_1_0a_1/core/family-map.json")),
    ]);

    expect(orientation).toMatchObject({
      kind: "core-document-wave-a-orientation",
      schemaVersion: 1,
      releaseLine: "V0_1_0a_1",
      repositoryId: "repo-core",
      sourceCommit: "76a2f2311a898e781f53773390d47b05812911e4",
      inventoryDigest: inventory.sourceDigest,
      reviewState: "draft",
      synthesisOrder: [],
    });
    expect(inventory.expectedFileCount).toBe(470);
    expect(familyMap.inventoryDigest).toBe(inventory.sourceDigest);
    expect(orientation.families.map(({ familyId, sourceCount }) => [familyId, sourceCount])).toEqual([
      ["template-builder", 73],
      ["live-draft", 64],
      ["text-engine", 26],
      ["text-block", 10],
    ]);
  });

  it("selects distinct, family-owned orientation sources with rationales", async () => {
    const [orientation, familyMap] = await Promise.all([
      readJson<WaveAOrientation>(join(root, "migrations/V0_1_0a_1/core/wave-a-orientation.json")),
      readJson<CoreFamilyMap>(join(root, "migrations/V0_1_0a_1/core/family-map.json")),
    ]);
    const familySources = new Map(familyMap.families.map((family) => [
      family.familyId,
      new Set(family.sources.map((source) => source.path)),
    ]));

    for (const family of orientation.families) {
      expect(["orientation-selected", "mapped"]).toContain(family.reviewState);
      expect(family.orientationSources.length).toBeGreaterThanOrEqual(3);
      expect(family.orientationSources.length).toBeLessThanOrEqual(8);
      expect(sorted(family.orientationSources.map((source) => source.path)))
        .toEqual(sorted([...new Set(family.orientationSources.map((source) => source.path))]));
      expect(family.orientationSources.every((source) => source.rationale.trim().length > 0)).toBe(true);
      const mappedPaths = familySources.get(family.familyId);
      expect(mappedPaths).toBeDefined();
      expect(family.orientationSources.every((source) => mappedPaths?.has(source.path))).toBe(true);
      if (family.reviewState === "orientation-selected") {
        expect(family.provisionalModel).toBeNull();
        expect(family.subgroups).toEqual([]);
        expect(family.conflicts).toEqual([]);
      }
    }
  });

  it("maps Template Builder into closed, evidence-bearing subgroups", async () => {
    const [orientation, familyMap] = await Promise.all([
      readJson<WaveAOrientation>(join(root, "migrations/V0_1_0a_1/core/wave-a-orientation.json")),
      readJson<CoreFamilyMap>(join(root, "migrations/V0_1_0a_1/core/family-map.json")),
    ]);

    expectMappedFamily(orientation, familyMap, "template-builder", 73);
  });

  it("maps Live Draft into closed, evidence-bearing subgroups", async () => {
    const [orientation, familyMap] = await Promise.all([
      readJson<WaveAOrientation>(join(root, "migrations/V0_1_0a_1/core/wave-a-orientation.json")),
      readJson<CoreFamilyMap>(join(root, "migrations/V0_1_0a_1/core/family-map.json")),
    ]);

    expectMappedFamily(orientation, familyMap, "live-draft", 64);
  });

  it("maps Text Engine into closed, evidence-bearing subgroups", async () => {
    const [orientation, familyMap] = await Promise.all([
      readJson<WaveAOrientation>(join(root, "migrations/V0_1_0a_1/core/wave-a-orientation.json")),
      readJson<CoreFamilyMap>(join(root, "migrations/V0_1_0a_1/core/family-map.json")),
    ]);

    expectMappedFamily(orientation, familyMap, "text-engine", 26);
  });
});
