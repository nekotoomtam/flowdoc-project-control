import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";

import { describe, expect, it } from "vitest";

interface PackageJson {
  scripts: Record<string, string>;
}

interface TestGroupsModule {
  defaultTestGroupIds: readonly string[];
  groupIdsForTestFile(testPath: string): string[];
  groupContainsTestFile(testPath: string, groupId: string): boolean;
  sourceDocsSubgroupIds: readonly string[];
  testGroups: readonly { id: string; patterns: readonly string[] }[];
}

async function loadPackageJson(): Promise<PackageJson> {
  return JSON.parse(await readFile("package.json", "utf8")) as PackageJson;
}

async function loadTestGroups(): Promise<TestGroupsModule> {
  return (await import("../tools/lib/test-groups.js")) as TestGroupsModule;
}

async function collectTestFiles(root: string): Promise<string[]> {
  const files: string[] = [];

  async function walk(directory: string) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) {
        await walk(path);
        continue;
      }
      if (/\.(test|spec)\.tsx?$/u.test(entry.name)) {
        files.push(relative(process.cwd(), path).replace(/\\/g, "/"));
      }
    }
  }

  await walk(root);
  return files.sort((left, right) => left.localeCompare(right));
}

describe("Project Control test groups", () => {
  it("uses the grouped unit gate as the default check while preserving a parallel fast path", async () => {
    const packageJson = await loadPackageJson();

    expect(packageJson.scripts["test:unit:parallel"]).toBe(
      'vitest run --exclude "tests/e2e/**"',
    );
    expect(packageJson.scripts["test:records"]).toBe(
      "tsx tools/run-test-groups.ts records",
    );
    expect(packageJson.scripts["test:source-docs"]).toBe(
      "tsx tools/run-test-groups.ts source-docs",
    );
    expect(packageJson.scripts["test:source-docs:core-migration"]).toBe(
      "tsx tools/run-test-groups.ts source-docs:core-migration",
    );
    expect(packageJson.scripts["test:source-docs:live-draft"]).toBe(
      "tsx tools/run-test-groups.ts source-docs:live-draft",
    );
    expect(packageJson.scripts["test:source-docs:template-builder"]).toBe(
      "tsx tools/run-test-groups.ts source-docs:template-builder",
    );
    expect(packageJson.scripts["test:source-docs:text-block"]).toBe(
      "tsx tools/run-test-groups.ts source-docs:text-block",
    );
    expect(packageJson.scripts["test:source-docs:text-engine"]).toBe(
      "tsx tools/run-test-groups.ts source-docs:text-engine",
    );
    expect(packageJson.scripts["test:app"]).toBe(
      "tsx tools/run-test-groups.ts app",
    );
    expect(packageJson.scripts["test:unit"]).toBe(
      "tsx tools/run-test-groups.ts --all",
    );
    expect(packageJson.scripts["check:fast"]).toBe(
      "npm run check:data && npm run type-check && npm run test:records",
    );
    expect(packageJson.scripts["check:grouped"]).toBe(
      "npm run check:data && npm run type-check && npm run test:unit && npm run build && npm run test:e2e",
    );
    expect(packageJson.scripts.check).toBe("npm run check:grouped");
    expect(packageJson.scripts.test).toBe("npm run test:unit");
  });

  it("assigns every non-e2e unit test file to exactly one stable group", async () => {
    const { groupIdsForTestFile } = await loadTestGroups();
    const testFiles = [
      ...(await collectTestFiles("tests")).filter(
        (testPath) => !testPath.startsWith("tests/e2e/"),
      ),
      ...(await collectTestFiles("app/src")),
    ];

    const assignments = testFiles.map((testPath) => ({
      groups: groupIdsForTestFile(testPath),
      testPath,
    }));

    expect(assignments.filter(({ groups }) => groups.length !== 1)).toEqual([]);
  });

  it("keeps high-load areas in narrow groups so PLAN can run the useful gate first", async () => {
    const {
      defaultTestGroupIds,
      groupContainsTestFile,
      groupIdsForTestFile,
      sourceDocsSubgroupIds,
      testGroups,
    } = await loadTestGroups();

    expect(defaultTestGroupIds).toEqual(["records", "source-docs", "app"]);
    expect(sourceDocsSubgroupIds).toEqual([
      "source-docs:core-migration",
      "source-docs:live-draft",
      "source-docs:template-builder",
      "source-docs:text-block",
      "source-docs:text-engine",
    ]);
    expect(testGroups.map((group) => group.id)).toEqual([
      ...defaultTestGroupIds.slice(0, 2),
      ...sourceDocsSubgroupIds,
      defaultTestGroupIds[2],
    ]);
    expect(
      groupIdsForTestFile(
        "tests/flowdoc-final-lean-multi-work-smoke-evidence.test.ts",
      ),
    ).toEqual(["records"]);
    expect(groupIdsForTestFile("tests/core-doc-migration.test.ts")).toEqual([
      "source-docs:core-migration",
    ]);
    expect(groupIdsForTestFile("tests/core-evidence-root.test.ts")).toEqual([
      "source-docs:core-migration",
    ]);
    expect(groupIdsForTestFile("tests/migration-schema.test.ts")).toEqual([
      "source-docs:core-migration",
    ]);
    expect(
      groupIdsForTestFile("tests/live-draft-persistent-root-docs.test.ts"),
    ).toEqual(["source-docs:live-draft"]);
    expect(groupIdsForTestFile("tests/template-builder-viewport-doc.test.ts")).toEqual([
      "source-docs:template-builder",
    ]);
    expect(
      groupIdsForTestFile("tests/text-block-v4-measurement-pagination-docs.test.ts"),
    ).toEqual(["source-docs:text-block"]);
    expect(
      groupIdsForTestFile("tests/text-engine-runtime-identity-evidence-leaf.test.ts"),
    ).toEqual(["source-docs:text-engine"]);
    expect(groupContainsTestFile("tests/core-doc-migration.test.ts", "source-docs")).toBe(
      true,
    );
    expect(groupIdsForTestFile("tests/vite-server.test.ts")).toEqual(["app"]);
    expect(groupIdsForTestFile("app/src/ProjectControlApp.test.tsx")).toEqual([
      "app",
    ]);
  });
});
