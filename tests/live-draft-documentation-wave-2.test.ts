import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const root = join(fileURLToPath(new URL("..", import.meta.url)));
const overviewPath =
  "docs/versions/V0_1_0a_1/core/live-draft/OVERVIEW.md";
const frozenCommit =
  "76a2f2311a898e781f53773390d47b05812911e4";
const coreEvidenceCommit =
  "c503a45c03e0ce3b7a6efba2b029ca842017faa0";
const inventoryDigest =
  "36f54f2302d51895615a81767c92c0ccba18563703471c33169b3816b63e5f5b";
const subgroupCounts = [3, 16, 10, 10, 20, 5] as const;
const leafNames = [
  "product-readiness-and-renderer-boundaries.md",
  "geometry-and-scene-projection.md",
  "persistent-flow-and-range-foundations.md",
  "root-and-v3-transition-contracts.md",
  "source-authority-and-commit-transaction.md",
  "corrective-evidence.md",
] as const;

describe("Live Draft documentation Wave 2", () => {
  it("freezes the 64-source family and creates the bounded overview first", async () => {
    const orientation = JSON.parse(await readFile(
      join(root, "migrations/V0_1_0a_1/core/wave-a-orientation.json"),
      "utf8",
    )) as {
      sourceCommit: string;
      inventoryDigest: string;
      families: Array<{
        familyId: string;
        sourceCount: number;
        subgroups: Array<{
          sourcePaths: string[];
          proposedLeafPath: string;
        }>;
      }>;
    };
    const family = orientation.families.find(({ familyId }) => familyId === "live-draft");

    expect(family).toBeDefined();
    expect(orientation.sourceCommit).toBe(frozenCommit);
    expect(orientation.inventoryDigest).toBe(inventoryDigest);
    expect(family!.sourceCount).toBe(64);
    expect(family!.subgroups.map(({ sourcePaths }) => sourcePaths.length)).toEqual(subgroupCounts);
    expect(family!.subgroups.map(({ proposedLeafPath }) => proposedLeafPath)).toEqual(
      leafNames.map((name) => `docs/versions/V0_1_0a_1/core/live-draft/${name}`),
    );

    const sourcePaths = family!.subgroups.flatMap(({ sourcePaths }) => sourcePaths);
    expect(sourcePaths).toHaveLength(64);
    expect(new Set(sourcePaths).size).toBe(64);

    const overview = await readFile(join(root, overviewPath), "utf8");
    expect(overview.match(/^## .+$/gmu)).toEqual([
      "## Authority and Status",
      "## Family Architecture",
      "## Canonical Documents",
      "## Ownership Map",
      "## Evidence Flow",
      "## Current Verified State",
      "## Known Limits and Unknowns",
      "## Migration and Cleanup Boundary",
      "## Evidence Anchors",
    ]);
    for (const leafName of leafNames) expect(overview).toContain(`](${leafName})`);
    expect(overview).toContain(coreEvidenceCommit);
    expect(overview).toContain("Live Draft and parent Core remain `unknown`");
    expect(overview).toMatch(/no migration coverage[^.]*no source cleanup[^.]*authorized/iu);
  });
});
