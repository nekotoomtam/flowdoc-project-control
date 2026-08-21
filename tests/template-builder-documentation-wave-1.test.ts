import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const root = join(fileURLToPath(new URL("..", import.meta.url)));
const overviewPath = "docs/versions/V0_1_0a_1/core/template-builder/OVERVIEW.md";
const frozenCommit = "76a2f2311a898e781f53773390d47b05812911e4";
const coreEvidenceCommit = "c503a45c03e0ce3b7a6efba2b029ca842017faa0";
const inventoryDigest = "36f54f2302d51895615a81767c92c0ccba18563703471c33169b3816b63e5f5b";
const leafNames = [
  "sandbox-runtime-and-store.md",
  "viewport-and-virtualized-rendering.md",
  "structural-runtime-and-navigation.md",
  "wysiwyg-draft-input-and-guards.md",
  "rich-inline-commit-and-session-lifecycle.md",
] as const;

describe("Template Builder documentation Wave 1", () => {
  it("freezes one 73-source family and creates the bounded overview first", async () => {
    const orientation = JSON.parse(await readFile(
      join(root, "migrations/V0_1_0a_1/core/wave-a-orientation.json"),
      "utf8",
    )) as {
      sourceCommit: string;
      inventoryDigest: string;
      families: Array<{
        familyId: string;
        sourceCount: number;
        subgroups: Array<{ sourcePaths: string[]; proposedLeafPath: string }>;
      }>;
    };
    const family = orientation.families.find(({ familyId }) => familyId === "template-builder");
    expect(family).toBeDefined();
    const sourcePaths = family!.subgroups.flatMap(({ sourcePaths }) => sourcePaths);
    expect(orientation.sourceCommit).toBe(frozenCommit);
    expect(orientation.inventoryDigest).toBe(inventoryDigest);
    expect(family!.sourceCount).toBe(73);
    expect(sourcePaths).toHaveLength(73);
    expect(new Set(sourcePaths).size).toBe(73);

    const overview = await readFile(join(root, overviewPath), "utf8");
    for (const leafName of leafNames) expect(overview).toContain(`](${leafName})`);
    expect(overview).toContain(coreEvidenceCommit);
    expect(overview).toMatch(/Template Builder[^.]*`unknown`/iu);
    expect(overview).toContain("Template Builder and parent Core remain `unknown`");
    expect(overview).toMatch(/no[^.]*source cleanup[^.]*authorized/iu);
  });
});
