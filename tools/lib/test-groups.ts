export type TestGroupId = "records" | "source-docs" | "app";

export interface TestGroupDefinition {
  id: TestGroupId;
  description: string;
  patterns: readonly string[];
}

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
    patterns: [
      "tests/core-doc-*.test.ts",
      "tests/core-evidence-root.test.ts",
      "tests/live-draft-*.test.ts",
      "tests/migration-schema.test.ts",
      "tests/template-builder-*.test.ts",
      "tests/text-block-*.test.ts",
      "tests/text-engine-*.test.ts",
    ],
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
