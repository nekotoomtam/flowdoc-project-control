import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";

import { describe, expect, it } from "vitest";

interface PackageJson {
  scripts: Record<string, string>;
}

interface TestGroupsModule {
  groupIdsForTestFile(testPath: string): string[];
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
    const { groupIdsForTestFile, testGroups } = await loadTestGroups();

    expect(testGroups.map((group) => group.id)).toEqual([
      "records",
      "source-docs",
      "app",
    ]);
    expect(
      groupIdsForTestFile(
        "tests/flowdoc-final-lean-multi-work-smoke-evidence.test.ts",
      ),
    ).toEqual(["records"]);
    expect(groupIdsForTestFile("tests/core-doc-migration.test.ts")).toEqual([
      "source-docs",
    ]);
    expect(
      groupIdsForTestFile("tests/live-draft-persistent-root-docs.test.ts"),
    ).toEqual(["source-docs"]);
    expect(groupIdsForTestFile("tests/vite-server.test.ts")).toEqual(["app"]);
    expect(groupIdsForTestFile("app/src/ProjectControlApp.test.tsx")).toEqual([
      "app",
    ]);
  });
});
