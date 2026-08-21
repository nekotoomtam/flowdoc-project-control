import { createHash } from "node:crypto";
import { access, readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const root = join(fileURLToPath(new URL("..", import.meta.url)));
const overviewPath = "docs/versions/V0_1_0a_1/core/text-block/OVERVIEW.md";
const orientationPath = "migrations/V0_1_0a_1/core/wave-a-orientation.json";
const frozenCoreCommit = "76a2f2311a898e781f53773390d47b05812911e4";
const frozenInventoryDigest = "36f54f2302d51895615a81767c92c0ccba18563703471c33169b3816b63e5f5b";
const expectedSourceClosureDigest = "6c261f14076ebd4caab5b05c847b63460dce66ba9252ba311791d275d3b08a33";

const expectedLeaves = [
  "docs/versions/V0_1_0a_1/core/text-block/v1-grammar-and-migration-history.md",
  "docs/versions/V0_1_0a_1/core/text-block/v4-authoring-and-inline.md",
  "docs/versions/V0_1_0a_1/core/text-block/v4-measurement-and-pagination.md",
] as const;

interface Subgroup {
  subgroupId: string;
  sourcePaths: string[];
  proposedLeafPath: string;
  dependsOn: string[];
}

interface Family {
  familyId: string;
  sourceCount: number;
  subgroups: Subgroup[];
  conflicts: Array<{ id: string }>;
}

interface Orientation {
  sourceCommit: string;
  inventoryDigest: string;
  families: Family[];
}

async function readOrientation(): Promise<Orientation> {
  return JSON.parse(await readFile(join(root, orientationPath), "utf8")) as Orientation;
}

function sourceClosureDigest(family: Family): string {
  const normalizedPaths = family.subgroups
    .flatMap(({ sourcePaths }) => sourcePaths)
    .map((sourcePath) => sourcePath.replaceAll("\\", "/").normalize("NFC"))
    .sort((left, right) => (left < right ? -1 : left > right ? 1 : 0));

  return createHash("sha256").update(normalizedPaths.join("\n"), "utf8").digest("hex");
}

describe("Text Block documentation Wave 3", () => {
  it("freezes the Text Block family frame before any lane promotes documentation truth", async () => {
    const orientation = await readOrientation();
    const family = orientation.families.find(({ familyId }) => familyId === "text-block");

    expect(family).toBeDefined();
    expect(family?.sourceCount).toBe(10);
    expect(family?.subgroups.map(({ subgroupId, sourcePaths }) => [subgroupId, sourcePaths.length])).toEqual([
      ["v1-grammar-and-migration", 4],
      ["v4-authoring-and-inline", 3],
      ["v4-measurement-and-pagination", 3],
    ]);
    expect(new Set(family?.subgroups.flatMap(({ sourcePaths }) => sourcePaths)).size).toBe(10);
    expect(family).toBeDefined();
    expect(sourceClosureDigest(family!)).toBe(expectedSourceClosureDigest);
    expect(family?.subgroups.map(({ proposedLeafPath }) => proposedLeafPath)).toEqual(expectedLeaves);
    expect(family?.subgroups.map(({ dependsOn }) => dependsOn)).toEqual([
      [],
      ["text-block/v1-grammar-and-migration"],
      ["text-block/v4-authoring-and-inline"],
    ]);
    expect(family?.conflicts.map(({ id }) => id)).toEqual(["TBL-C1", "TBL-C2", "TBL-C3", "TBL-C4"]);
    expect(orientation.sourceCommit).toBe(frozenCoreCommit);
    expect(orientation.inventoryDigest).toBe(frozenInventoryDigest);

    await expect(access(join(root, "data/nodes/text-block.json"))).rejects.toThrow();
    expect((await readdir(join(root, "data/documents"))).filter((name) => name.startsWith("text-block"))).toEqual([]);
    expect((await readdir(join(root, "data/evidence"))).filter((name) => name.startsWith("text-block"))).toEqual([]);
    await expect(access(join(root, "migrations/V0_1_0a_1/core/families/text-block/coverage.json"))).rejects.toThrow();

    const overview = await readFile(join(root, overviewPath), "utf8");

    expect(overview).toContain("Family state: `unknown`");
    expect(overview).toContain("Documentation state: `candidate`");
    expect(overview).toContain("`v1 history` -> `v4 authoring` -> `v4 measurement/pagination`");
    for (const leafPath of expectedLeaves) {
      expect(overview).toContain(leafPath);
    }
    expect(overview).toContain("| Lane | Owns | Explicitly excludes |");
    expect(overview).toContain("No lane establishes current product truth, migration coverage, or source-cleanup authority.");
    expect(overview).toContain("Task 5 alone performs final family reconciliation after the three lane reviews.");
    for (const sourcePath of family?.subgroups.flatMap(({ sourcePaths }) => sourcePaths) ?? []) {
      expect(overview).not.toContain(sourcePath);
    }
  });

  it("rejects a same-count source-path substitution", async () => {
    const orientation = await readOrientation();
    const family = orientation.families.find(({ familyId }) => familyId === "text-block");

    expect(family).toBeDefined();
    const substitutedFamily = structuredClone(family!);
    substitutedFamily.subgroups = substitutedFamily.subgroups.map((subgroup, index) => (
      index === 0
        ? { ...subgroup, sourcePaths: ["docs/TEXT_BLOCK_UNEXPECTED_SUBSTITUTE.md", ...subgroup.sourcePaths.slice(1)] }
        : subgroup
    ));

    expect(substitutedFamily.sourceCount).toBe(10);
    expect(substitutedFamily.subgroups.map(({ subgroupId, sourcePaths }) => [subgroupId, sourcePaths.length])).toEqual([
      ["v1-grammar-and-migration", 4],
      ["v4-authoring-and-inline", 3],
      ["v4-measurement-and-pagination", 3],
    ]);
    expect(new Set(substitutedFamily.subgroups.flatMap(({ sourcePaths }) => sourcePaths)).size).toBe(10);
    expect(sourceClosureDigest(substitutedFamily)).not.toBe(expectedSourceClosureDigest);
  });
});
