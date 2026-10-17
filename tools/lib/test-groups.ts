export type TestGroupId =
  | "records"
  | "source-docs"
  | "source-docs:core-migration"
  | "source-docs:live-draft"
  | "source-docs:template-builder"
  | "source-docs:text-block"
  | "source-docs:text-engine"
  | "app";

export interface TestGroupDefinition {
  id: TestGroupId;
  description: string;
  includeGroupIds?: readonly TestGroupId[];
  patterns: readonly string[];
}

export const sourceDocsSubgroupIds = [
  "source-docs:core-migration",
  "source-docs:live-draft",
  "source-docs:template-builder",
  "source-docs:text-block",
  "source-docs:text-engine",
] as const satisfies readonly TestGroupId[];

export const defaultTestGroupIds = [
  "records",
  "source-docs",
  "app",
] as const satisfies readonly TestGroupId[];

export const testGroups = [
  {
    id: "records",
    description: "Project Control records, lane evidence, schemas, and maps",
    patterns: [
      "tests/agent-documentation-authority-operating-rules.test.ts",
      "tests/backend-service-contract-lane.test.ts",
      "tests/core-backend-readiness-matrix.test.ts",
      "tests/core-consumer-surface-lane.test.ts",
      "tests/documentation-authority-policy.test.ts",
      "tests/editor-*.test.ts",
      "tests/flowdoc-*.test.ts",
      "tests/generation.test.ts",
      "tests/load-sources.test.ts",
      "tests/product-terminology-foundation.test.ts",
      "tests/project-control-*.test.ts",
      "tests/project-roadmap-work-queue.test.ts",
      "tests/schema.test.ts",
      "tests/seed-project.test.ts",
      "tests/semantic-validation.test.ts",
      "tests/sqlite-projection.test.ts",
    ],
  },
  {
    id: "source-docs",
    description: "Source document migration and document-engine evidence",
    includeGroupIds: sourceDocsSubgroupIds,
    patterns: [],
  },
  {
    id: "source-docs:core-migration",
    description: "Core document inventory, migration, and evidence roots",
    patterns: [
      "tests/core-doc-*.test.ts",
      "tests/core-evidence-root.test.ts",
      "tests/migration-schema.test.ts",
    ],
  },
  {
    id: "source-docs:live-draft",
    description: "Live Draft source-authority, geometry, and root documents",
    patterns: ["tests/live-draft-*.test.ts"],
  },
  {
    id: "source-docs:template-builder",
    description: "Template Builder source provenance and structural documents",
    patterns: [
      "tests/template-builder-*.test.ts",
    ],
  },
  {
    id: "source-docs:text-block",
    description: "Text Block grammar, authoring, measurement, and pagination",
    patterns: ["tests/text-block-*.test.ts"],
  },
  {
    id: "source-docs:text-engine",
    description: "Text Engine runtime, adapter, provider, and toolchain evidence",
    patterns: ["tests/text-engine-*.test.ts"],
  },
  {
    id: "app",
    description: "Project Control app, route, component, and dev-server tests",
    patterns: [
      "app/src/*.test.ts",
      "app/src/*.test.tsx",
      "app/src/**/*.test.ts",
      "app/src/**/*.test.tsx",
      "tests/vite-server.test.ts",
    ],
  },
] as const satisfies readonly TestGroupDefinition[];

export function getTestGroup(groupId: string): TestGroupDefinition | undefined {
  return testGroups.find((group) => group.id === groupId);
}

export function normalizeTestPath(testPath: string): string {
  return testPath.replace(/\\/g, "/").replace(/^\.\//u, "");
}

export function matchesTestPattern(testPath: string, pattern: string): boolean {
  return patternToRegExp(pattern).test(normalizeTestPath(testPath));
}

export function groupIdsForTestFile(testPath: string): TestGroupId[] {
  const normalizedPath = normalizeTestPath(testPath);
  return testGroups
    .filter((group) =>
      group.patterns.some((pattern) =>
        matchesTestPattern(normalizedPath, pattern),
      ),
    )
    .map((group) => group.id);
}

export function groupContainsTestFile(
  testPath: string,
  groupId: string,
): boolean {
  const group = getTestGroup(groupId);
  if (group === undefined) {
    return false;
  }

  return groupContainsNormalizedTestPath(normalizeTestPath(testPath), group);
}

function groupContainsNormalizedTestPath(
  normalizedPath: string,
  group: TestGroupDefinition,
  visitedGroupIds = new Set<TestGroupId>(),
): boolean {
  if (visitedGroupIds.has(group.id)) {
    return false;
  }
  visitedGroupIds.add(group.id);

  if (
    group.patterns.some((pattern) =>
      matchesTestPattern(normalizedPath, pattern),
    )
  ) {
    return true;
  }

  return (
    group.includeGroupIds?.some((childGroupId) => {
      const childGroup = getTestGroup(childGroupId);
      return childGroup === undefined
        ? false
        : groupContainsNormalizedTestPath(
            normalizedPath,
            childGroup,
            visitedGroupIds,
          );
    }) ?? false
  );
}

function patternToRegExp(pattern: string): RegExp {
  const normalizedPattern = normalizeTestPath(pattern);
  let source = "";

  for (let index = 0; index < normalizedPattern.length; index += 1) {
    const char = normalizedPattern.charAt(index);
    const next = normalizedPattern.charAt(index + 1);

    if (char === "*" && next === "*") {
      source += ".*";
      index += 1;
      continue;
    }

    if (char === "*") {
      source += "[^/]*";
      continue;
    }

    source += escapeRegExpChar(char);
  }

  return new RegExp(`^${source}$`, "u");
}

function escapeRegExpChar(char: string): string {
  return /[\\^$+?.()|[\]{}]/u.test(char) ? `\\${char}` : char;
}
