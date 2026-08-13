import { createHash } from "node:crypto";
import { execFile as execFileCallback } from "node:child_process";
import { mkdir, mkdtemp, readFile, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { promisify } from "node:util";
import { describe, expect, it } from "vitest";

import type {
  CoreFamilyMap,
  CoreMarkdownInventory,
  FamilyCoverage,
} from "../src/migration/types.js";
import {
  collectCoveredPathMentions,
  evaluateFamilyDeletionReadiness,
  validateStoredCoreMigration,
  verifyFamilyCleanup,
} from "../tools/migration/lib/validate-migration.js";
import { runCoreDocsCheck } from "../tools/migration/check-core-docs.js";
import { checkProjectIndex } from "../tools/check.js";
import { generateProjectIndex } from "../tools/generate.js";
import { readGitMarkdownSnapshot } from "../tools/migration/lib/git-snapshot.js";
import { createCoreDocRepository } from "./fixtures/core-doc-repository.js";
import { createProjectFixture } from "./fixtures/project-source.js";

const execFile = promisify(execFileCallback);
const destinationPath = "docs/versions/V0_1_0a_1/core/core-route/route.md";
const sourcePath = "docs/CORE_ROUTE_SAMPLE.md";
const canonicalCoreRouteOverview = "docs/versions/V0_1_0a_1/core/core-route/OVERVIEW.md";
const canonicalCoreRouteLeaf = "docs/versions/V0_1_0a_1/core/core-route/route-ownership-and-retained-contracts.md";
const coreRouteSources = [
  "docs/CORE_ROUTE_DEEXPORT_PLAN.md",
  "docs/CORE_ROUTE_DEPRECATION_WINDOW.md",
  "docs/CORE_ROUTE_RETAINED_CONTRACT_TEST_REWRITE.md",
  "docs/CORE_ROUTE_WINDOW_C_PUBLIC_EXPORT_REMOVAL.md",
];
const requiredCoreRouteHeadings = [
  "## Purpose and Scope",
  "## Current Ownership Boundary",
  "## Retained Core Contracts",
  "## Public Export State",
  "## Verification Anchors",
  "## Risks and Unknowns",
  "## Historical Design Notes",
  "## Provenance",
];

function expectRealCoreRouteCoverageLifecycle(
  coverage: FamilyCoverage,
  inventory: CoreMarkdownInventory,
): void {
  const inventoryBlobs = new Map(inventory.files.map((file) => [file.path, file.blobId]));
  let expectedDocumentIds: string[];

  if (coverage.status === "draft") {
    expectedDocumentIds = [];
  } else if (coverage.status === "content-reviewed") {
    expectedDocumentIds = [
      "doc-core-route-overview",
      "doc-core-route-retained-contracts",
    ];
  } else {
    throw new Error(`Unexpected Core route coverage lifecycle: ${coverage.status}`);
  }

  expect(coverage).toMatchObject({
    familyId: "core-route",
    sourceCommit: inventory.sourceCommit,
    inventoryDigest: inventory.sourceDigest,
    activeReferences: [],
    retainedHistoricalReferences: [],
    projectControlPublicationCommit: null,
    coreCleanupCommit: null,
  });
  expect(coverage.canonicalDocumentIds).toEqual(expectedDocumentIds);
  expect(coverage.sources.map((source) => source.path)).toEqual(coreRouteSources);
  expect(coverage.sources.map((source) => source.blobId)).toEqual(
    coreRouteSources.map((path) => inventoryBlobs.get(path)),
  );
  expect([...new Set(coverage.sources.map((source) => source.destinationPath))])
    .toEqual([canonicalCoreRouteLeaf]);
}

interface MigrationFixture {
  projectRoot: string;
  sourceRoot: string;
  commit: string;
  inventory: CoreMarkdownInventory;
  familyMap: CoreFamilyMap;
  coverage: FamilyCoverage;
}

async function git(root: string, args: string[]): Promise<string> {
  const { stdout } = await execFile("git", args, { cwd: root, encoding: "utf8" });
  return stdout.trim();
}

async function createMigrationFixture(options: { mention?: string; secondSource?: boolean } = {}): Promise<MigrationFixture> {
  const repository = await createCoreDocRepository();
  await writeFile(join(repository.root, "README.md"), "# Repository overview\n", "utf8");
  if (options.mention !== undefined) {
    await writeFile(join(repository.root, "notes.txt"), `${options.mention}\n`, "utf8");
  }
  if (options.secondSource === true) {
    await writeFile(join(repository.root, "docs", "CORE_ROUTE_SECOND.md"), "# Second\n", "utf8");
  }
  await git(repository.root, ["add", "."]);
  await git(repository.root, ["commit", "-m", "migration fixture"]);
  const commit = await git(repository.root, ["rev-parse", "HEAD"]);
  const snapshot = await readGitMarkdownSnapshot(repository.root, commit);
  const selected = snapshot.filter((file) => file.path.startsWith("docs/CORE_ROUTE_"));
  const inventory: CoreMarkdownInventory = {
    kind: "core-document-inventory",
    schemaVersion: 1,
    releaseLine: "V0_1_0a_1",
    repositoryId: "repo-core",
    sourceCommit: commit,
    expectedFileCount: selected.length,
    sourceDigest: "a".repeat(64),
    files: selected.map((file) => ({
      path: file.path,
      blobId: file.blobId,
      title: file.path,
      candidateFamily: "core-route",
      outboundMarkdownLinks: [],
      inboundMarkdownReferences: [],
      repositoryReferences: [],
    })),
  };
  const familyMap: CoreFamilyMap = {
    kind: "core-document-family-map",
    schemaVersion: 1,
    releaseLine: "V0_1_0a_1",
    inventoryDigest: inventory.sourceDigest,
    families: [{
      familyId: "core-route",
      reviewState: "pilot-reviewed",
      sources: selected.map((file) => ({
        path: file.path,
        documentClass: "historical-working-record",
        authorityAssessment: "Reviewed fixture source.",
        provisionalDisposition: "historical-input",
        canonicalDestination: destinationPath,
        migrationStatus: "migrated",
      })),
    }],
  };
  const coverage: FamilyCoverage = {
    kind: "core-document-family-coverage",
    schemaVersion: 1,
    releaseLine: "V0_1_0a_1",
    familyId: "core-route",
    sourceCommit: commit,
    inventoryDigest: inventory.sourceDigest,
    status: "ready-for-deletion",
    canonicalDocumentIds: ["doc-core-route"],
    sources: selected.map((file) => ({
      path: file.path,
      blobId: file.blobId,
      disposition: "historical-note",
      destinationPath,
      destinationSection: "History",
      rationale: "Preserved in the canonical family.",
    })),
    activeReferences: [],
    retainedHistoricalReferences: [],
    projectControlPublicationCommit: commit,
    coreCleanupCommit: null,
  };
  const projectRoot = await mkdtemp(join(tmpdir(), "flowdoc-project-migration-"));
  await mkdir(join(projectRoot, dirname(destinationPath)), { recursive: true });
  await mkdir(join(projectRoot, "data", "documents"), { recursive: true });
  await writeFile(join(projectRoot, destinationPath), "# Route\n", "utf8");
  await writeFile(join(projectRoot, "data", "documents", "core-route.json"), JSON.stringify({
    kind: "document",
    id: "doc-core-route",
    title: "Core route",
    path: destinationPath,
    nodeIds: ["core-route"],
    role: "historical-note",
    authority: "Reviewed fixture authority.",
    lifecycle: "active",
    repositoryRefs: [{ repositoryId: "repo-core", commit, pathOrContractId: sourcePath }],
  }), "utf8");
  return { projectRoot, sourceRoot: repository.root, commit, inventory, familyMap, coverage };
}

async function writeStoredFixture(fixture: MigrationFixture): Promise<void> {
  const root = join(fixture.projectRoot, "migrations", "V0_1_0a_1", "core");
  await mkdir(join(root, "families", "core-route"), { recursive: true });
  await Promise.all([
    writeFile(join(root, "inventory.json"), JSON.stringify(fixture.inventory), "utf8"),
    writeFile(join(root, "family-map.json"), JSON.stringify(fixture.familyMap), "utf8"),
    writeFile(join(root, "families", "core-route", "coverage.json"), JSON.stringify(fixture.coverage), "utf8"),
  ]);
}

function diagnosticCodes(result: { diagnostics: Array<{ code: string }> }): string[] {
  return result.diagnostics.map((diagnostic) => diagnostic.code);
}

describe("stored Core migration closure", () => {
  it("accepts a wholly absent migration directory but rejects partial canonical artifacts", async () => {
    const emptyRoot = await mkdtemp(join(tmpdir(), "flowdoc-empty-project-"));
    expect(await validateStoredCoreMigration(emptyRoot)).toEqual([]);

    const fixture = await createMigrationFixture();
    const root = join(fixture.projectRoot, "migrations", "V0_1_0a_1", "core");
    await mkdir(root, { recursive: true });
    await writeFile(join(root, "inventory.json"), JSON.stringify(fixture.inventory), "utf8");

    expect((await validateStoredCoreMigration(fixture.projectRoot)).map(({ code }) => code))
      .toEqual(expect.arrayContaining(["MIGRATION_ARTIFACT_MISSING"]));
  });

  it("fails closed on inventory digest drift and duplicate inventory or missing family assignments", async () => {
    const cases = [
      {
        code: "MIGRATION_INVENTORY_DIGEST_MISMATCH",
        mutate: (fixture: MigrationFixture) => { fixture.familyMap.inventoryDigest = "b".repeat(64); },
      },
      {
        code: "MIGRATION_INVENTORY_SOURCE_DUPLICATE",
        mutate: (fixture: MigrationFixture) => {
          fixture.inventory.files.push({ ...fixture.inventory.files[0]! });
          fixture.inventory.expectedFileCount += 1;
        },
      },
      {
        code: "MIGRATION_SOURCE_UNASSIGNED",
        mutate: (fixture: MigrationFixture) => { fixture.familyMap.families[0]!.sources = []; },
      },
    ];

    for (const testCase of cases) {
      const fixture = await createMigrationFixture();
      testCase.mutate(fixture);
      await writeStoredFixture(fixture);
      expect((await validateStoredCoreMigration(fixture.projectRoot)).map(({ code }) => code), testCase.code)
        .toContain(testCase.code);
    }
  });

  it("fails closed when coverage omits, duplicates, or changes a captured source blob", async () => {
    const cases = [
      {
        code: "MIGRATION_COVERAGE_SOURCE_MISSING",
        mutate: (fixture: MigrationFixture) => { fixture.coverage.sources = []; },
      },
      {
        code: "MIGRATION_COVERAGE_SOURCE_DUPLICATE",
        mutate: (fixture: MigrationFixture) => {
          fixture.coverage.sources.push({ ...fixture.coverage.sources[0]! });
        },
      },
      {
        code: "MIGRATION_COVERAGE_BLOB_MISMATCH",
        mutate: (fixture: MigrationFixture) => { fixture.coverage.sources[0]!.blobId = "b".repeat(40); },
      },
    ];

    for (const testCase of cases) {
      const fixture = await createMigrationFixture();
      testCase.mutate(fixture);
      await writeStoredFixture(fixture);
      expect((await validateStoredCoreMigration(fixture.projectRoot)).map(({ code }) => code), testCase.code)
        .toContain(testCase.code);
    }
  });

  it("requires every named canonical destination and Document record without leaking local paths", async () => {
    const missingDestination = await createMigrationFixture();
    await writeStoredFixture(missingDestination);
    await rm(join(missingDestination.projectRoot, destinationPath));
    const destinationDiagnostics = await validateStoredCoreMigration(missingDestination.projectRoot);
    expect(destinationDiagnostics.map(({ code }) => code)).toContain("MIGRATION_DESTINATION_MISSING");
    expect(JSON.stringify(destinationDiagnostics)).not.toContain(missingDestination.projectRoot);

    const missingDocument = await createMigrationFixture();
    await writeStoredFixture(missingDocument);
    await rm(join(missingDocument.projectRoot, "data", "documents", "core-route.json"));
    const documentDiagnostics = await validateStoredCoreMigration(missingDocument.projectRoot);
    expect(documentDiagnostics.map(({ code }) => code)).toContain("MIGRATION_DOCUMENT_RECORD_MISSING");
    expect(JSON.stringify(documentDiagnostics)).not.toContain(missingDocument.projectRoot);

    const mismatchedDocument = await createMigrationFixture();
    await writeStoredFixture(mismatchedDocument);
    const recordPath = join(mismatchedDocument.projectRoot, "data", "documents", "core-route.json");
    const record = JSON.parse(await readFile(recordPath, "utf8")) as { path: string };
    record.path = "docs/unrelated.md";
    await writeFile(recordPath, JSON.stringify(record), "utf8");
    expect((await validateStoredCoreMigration(mismatchedDocument.projectRoot)).map(({ code }) => code))
      .toContain("MIGRATION_DOCUMENT_DESTINATION_MISMATCH");
  });

  it("schema-validates every stored family coverage artifact", async () => {
    const fixture = await createMigrationFixture();
    await writeStoredFixture(fixture);
    const unexpected = join(
      fixture.projectRoot,
      "migrations", "V0_1_0a_1", "core", "families", "other-family", "coverage.json",
    );
    await mkdir(dirname(unexpected), { recursive: true });
    await writeFile(unexpected, "{}", "utf8");

    expect((await validateStoredCoreMigration(fixture.projectRoot)).map(({ code }) => code))
      .toContain("MIGRATION_ARTIFACT_SCHEMA_INVALID");
  });

  it("binds coverage content to its storage family and the requested external family", async () => {
    const fixture = await createMigrationFixture({ secondSource: true });
    const family = fixture.familyMap.families[0]!;
    const secondAssignment = family.sources.find((source) => source.path.endsWith("SECOND.md"))!;
    const secondCoverage = fixture.coverage.sources.find((source) => source.path.endsWith("SECOND.md"))!;
    family.sources = family.sources.filter((source) => source.path === sourcePath);
    fixture.familyMap.families.push({
      familyId: "other-family",
      reviewState: "candidate",
      sources: [secondAssignment],
    });
    fixture.coverage.familyId = "other-family";
    fixture.coverage.sources = [secondCoverage];
    await writeStoredFixture(fixture);

    expect((await validateStoredCoreMigration(fixture.projectRoot)).map(({ code }) => code))
      .toContain("MIGRATION_COVERAGE_STORAGE_FAMILY_MISMATCH");
    await expect(runCoreDocsCheck([
      "--source-root", fixture.sourceRoot,
      "--family", "core-route",
    ], fixture.projectRoot)).rejects.toMatchObject({
      diagnostics: expect.arrayContaining([
        expect.objectContaining({ code: "MIGRATION_COVERAGE_STORAGE_FAMILY_MISMATCH" }),
      ]),
    });
  });

  it("rejects duplicate family IDs in both stored and external readiness inputs", async () => {
    const fixture = await createMigrationFixture({ secondSource: true });
    const sources = fixture.familyMap.families[0]!.sources;
    fixture.familyMap.families = [
      { familyId: "core-route", reviewState: "pilot-reviewed", sources: [sources[0]!] },
      { familyId: "core-route", reviewState: "pilot-reviewed", sources: [sources[1]!] },
    ];
    await writeStoredFixture(fixture);

    expect((await validateStoredCoreMigration(fixture.projectRoot)).map(({ code }) => code))
      .toContain("MIGRATION_FAMILY_ID_DUPLICATE");
    expect(diagnosticCodes(await evaluateFamilyDeletionReadiness(fixture)))
      .toContain("MIGRATION_FAMILY_ID_DUPLICATE");
  });

  it("requires regular in-root Markdown destinations and unambiguous canonical Documents", async () => {
    const directoryDestination = await createMigrationFixture();
    await writeStoredFixture(directoryDestination);
    await rm(join(directoryDestination.projectRoot, destinationPath));
    await mkdir(join(directoryDestination.projectRoot, destinationPath));
    expect((await validateStoredCoreMigration(directoryDestination.projectRoot)).map(({ code }) => code))
      .toContain("MIGRATION_DESTINATION_INVALID");

    const escapedDestination = await createMigrationFixture();
    await writeStoredFixture(escapedDestination);
    const outside = await mkdtemp(join(tmpdir(), "flowdoc-outside-destination-"));
    await rm(join(escapedDestination.projectRoot, destinationPath));
    await symlink(outside, join(escapedDestination.projectRoot, destinationPath), "junction");
    expect((await validateStoredCoreMigration(escapedDestination.projectRoot)).map(({ code }) => code))
      .toContain("MIGRATION_DESTINATION_INVALID");

    const ambiguousDocument = await createMigrationFixture();
    await writeStoredFixture(ambiguousDocument);
    const originalRecord = await readFile(
      join(ambiguousDocument.projectRoot, "data", "documents", "core-route.json"),
      "utf8",
    );
    await writeFile(
      join(ambiguousDocument.projectRoot, "data", "documents", "duplicate.json"),
      originalRecord,
      "utf8",
    );
    expect((await validateStoredCoreMigration(ambiguousDocument.projectRoot)).map(({ code }) => code))
      .toContain("MIGRATION_DOCUMENT_RECORD_AMBIGUOUS");
    await expect(runCoreDocsCheck([
      "--source-root", ambiguousDocument.sourceRoot,
      "--family", "core-route",
    ], ambiguousDocument.projectRoot)).rejects.toMatchObject({
      diagnostics: expect.arrayContaining([
        expect.objectContaining({ code: "MIGRATION_DOCUMENT_RECORD_AMBIGUOUS" }),
      ]),
    });

    const malformedDocument = await createMigrationFixture();
    await writeStoredFixture(malformedDocument);
    await writeFile(
      join(malformedDocument.projectRoot, "data", "documents", "malformed.json"),
      "{",
      "utf8",
    );
    expect((await validateStoredCoreMigration(malformedDocument.projectRoot)).map(({ code }) => code))
      .toContain("JSON_PARSE_ERROR");
  });

  it("rejects a covered destination registered by an additional unlisted Document ID", async () => {
    const fixture = await createMigrationFixture();
    await writeStoredFixture(fixture);
    const recordPath = join(fixture.projectRoot, "data", "documents", "core-route.json");
    const duplicatePathRecord = JSON.parse(await readFile(recordPath, "utf8")) as { id: string; title: string };
    duplicatePathRecord.id = "doc-core-route-copy";
    duplicatePathRecord.title = "Core route copy";
    await writeFile(
      join(fixture.projectRoot, "data", "documents", "core-route-copy.json"),
      JSON.stringify(duplicatePathRecord),
      "utf8",
    );

    expect((await validateStoredCoreMigration(fixture.projectRoot)).map(({ code }) => code))
      .toContain("MIGRATION_DESTINATION_DOCUMENT_AMBIGUOUS");
  });
});

describe("external Core deletion readiness", () => {
  it("returns the exact deterministic positive readiness contract without mutating either repository", async () => {
    const fixture = await createMigrationFixture();
    const before = await git(fixture.sourceRoot, ["status", "--porcelain"]);

    expect(await evaluateFamilyDeletionReadiness(fixture)).toEqual({
      familyId: "core-route",
      sourceCommit: fixture.commit,
      sourcePaths: [sourcePath],
      ready: true,
      diagnostics: [],
    });
    expect(await git(fixture.sourceRoot, ["status", "--porcelain"])).toBe(before);
  });

  it("rejects draft coverage, unresolved recorded references, source drift, and early deletion", async () => {
    const fixture = await createMigrationFixture();
    fixture.coverage.status = "draft";
    fixture.coverage.canonicalDocumentIds = [];
    fixture.coverage.projectControlPublicationCommit = null;
    fixture.coverage.activeReferences = [{ sourcePath: "README.md", line: 1, targetPath: sourcePath }];
    await writeFile(join(fixture.sourceRoot, sourcePath), "# Changed\n", "utf8");

    expect(diagnosticCodes(await evaluateFamilyDeletionReadiness(fixture))).toEqual(
      expect.arrayContaining([
        "MIGRATION_COVERAGE_NOT_READY",
        "MIGRATION_ACTIVE_REFERENCE",
        "MIGRATION_SOURCE_BLOB_DRIFT",
      ]),
    );

    await rm(join(fixture.sourceRoot, sourcePath));
    expect(diagnosticCodes(await evaluateFamilyDeletionReadiness(fixture))).toEqual(
      expect.arrayContaining(["MIGRATION_SOURCE_DELETED_EARLY"]),
    );
  });

  it("treats literal mentions in tracked UTF-8 text as active unless an exact line allowance matches", async () => {
    const fixture = await createMigrationFixture({ mention: `Former path: ${sourcePath}` });
    const mentions = await collectCoveredPathMentions(fixture.sourceRoot, [sourcePath]);
    expect(mentions).toEqual([{
      sourcePath: "notes.txt",
      line: 1,
      targetPath: sourcePath,
      lineSha256: createHash("sha256").update(`Former path: ${sourcePath}`, "utf8").digest("hex"),
    }]);
    expect(diagnosticCodes(await evaluateFamilyDeletionReadiness(fixture)))
      .toContain("MIGRATION_ACTIVE_PATH_MENTION");

    fixture.coverage.retainedHistoricalReferences = [{
      ...mentions[0]!,
      rationale: "Preserves a reviewed historical source path.",
    }];
    expect(await evaluateFamilyDeletionReadiness(fixture)).toMatchObject({ ready: true, diagnostics: [] });

    fixture.coverage.retainedHistoricalReferences[0]!.lineSha256 = "c".repeat(64);
    expect(diagnosticCodes(await evaluateFamilyDeletionReadiness(fixture)))
      .toEqual(expect.arrayContaining([
        "MIGRATION_ACTIVE_PATH_MENTION",
        "MIGRATION_HISTORICAL_ALLOWANCE_STALE",
      ]));
  });

  it("rejects deletion of repo-local keeps", async () => {
    const fixture = await createMigrationFixture();
    fixture.coverage.sources[0]!.disposition = "repo-local-keep";
    fixture.coverage.sources[0]!.destinationPath = null;
    fixture.coverage.sources[0]!.destinationSection = null;
    fixture.familyMap.families[0]!.sources[0]!.provisionalDisposition = "repo-local-keep";
    fixture.familyMap.families[0]!.sources[0]!.canonicalDestination = null;
    await rm(join(fixture.sourceRoot, sourcePath));

    expect(diagnosticCodes(await evaluateFamilyDeletionReadiness(fixture)))
      .toContain("MIGRATION_REPO_LOCAL_KEEP_DELETED");
  });

  it("permits cleanup-candidate only for the exact staged covered deletions", async () => {
    const fixture = await createMigrationFixture();
    await git(fixture.sourceRoot, ["rm", "--", sourcePath]);
    expect(await evaluateFamilyDeletionReadiness({ ...fixture, phase: "cleanup-candidate" }))
      .toMatchObject({ ready: true, diagnostics: [] });

    await writeFile(join(fixture.sourceRoot, "runtime.ts"), "export const runtime = false;\n", "utf8");
    await git(fixture.sourceRoot, ["add", "runtime.ts"]);
    expect(diagnosticCodes(await evaluateFamilyDeletionReadiness({ ...fixture, phase: "cleanup-candidate" })))
      .toContain("MIGRATION_CLEANUP_SCOPE_INVALID");
  });

  it("rejects a staged deletion whose HEAD preimage drifted from the captured blob", async () => {
    const fixture = await createMigrationFixture();
    await writeFile(join(fixture.sourceRoot, sourcePath), "# Later committed source\n", "utf8");
    await git(fixture.sourceRoot, ["add", sourcePath]);
    await git(fixture.sourceRoot, ["commit", "-m", "later source change"]);
    await git(fixture.sourceRoot, ["rm", "--", sourcePath]);

    expect(diagnosticCodes(await evaluateFamilyDeletionReadiness({
      ...fixture,
      phase: "cleanup-candidate",
    }))).toContain("MIGRATION_CLEANUP_PREIMAGE_MISMATCH");
  });

  it("fails cleanup verification when any covered source remains", async () => {
    const fixture = await createMigrationFixture({ secondSource: true });
    await git(fixture.sourceRoot, ["rm", "--", sourcePath]);
    await git(fixture.sourceRoot, ["commit", "-m", "partial cleanup"]);
    fixture.coverage.status = "closed";
    fixture.coverage.coreCleanupCommit = await git(fixture.sourceRoot, ["rev-parse", "HEAD"]);

    expect(diagnosticCodes(await verifyFamilyCleanup(fixture)))
      .toContain("MIGRATION_CLEANUP_INCOMPLETE");
  });

  it("accepts closed cleanup only at the recorded clean HEAD with all covered non-keeps absent", async () => {
    const fixture = await createMigrationFixture();
    await git(fixture.sourceRoot, ["rm", "--", sourcePath]);
    await git(fixture.sourceRoot, ["commit", "-m", "complete cleanup"]);
    fixture.coverage.status = "closed";
    fixture.coverage.coreCleanupCommit = await git(fixture.sourceRoot, ["rev-parse", "HEAD"]);

    expect(await verifyFamilyCleanup(fixture)).toMatchObject({ ready: true, diagnostics: [] });
  });
});

describe("Core migration check integration", () => {
  it("runs stored migration validation only after index freshness succeeds", async () => {
    const root = await createProjectFixture({ valid: true });
    await generateProjectIndex(root);
    const migrationRoot = join(root, "migrations", "V0_1_0a_1", "core");
    await mkdir(migrationRoot, { recursive: true });
    await writeFile(join(migrationRoot, "inventory.json"), "{}", "utf8");

    await expect(checkProjectIndex(root)).rejects.toMatchObject({
      diagnostics: expect.arrayContaining([
        expect.objectContaining({ code: "MIGRATION_ARTIFACT_SCHEMA_INVALID" }),
        expect.objectContaining({ code: "MIGRATION_ARTIFACT_MISSING" }),
      ]),
    });
  });

  it("requires explicit external inputs and mutually exclusive phases", async () => {
    const projectRoot = await mkdtemp(join(tmpdir(), "flowdoc-cli-project-"));
    await expect(runCoreDocsCheck([], projectRoot)).rejects.toThrow(/stored-only.*source-root/i);
    await expect(runCoreDocsCheck(["--source-root", projectRoot], projectRoot))
      .rejects.toThrow(/family/i);
    await expect(runCoreDocsCheck([
      "--source-root", projectRoot,
      "--family", "core-route",
      "--cleanup-candidate",
      "--closed",
    ], projectRoot)).rejects.toThrow(/exclusive/i);
    await expect(runCoreDocsCheck([
      "--source-root", projectRoot,
      "--family", "core-route",
      "--closed",
      "--report-mentions",
    ], projectRoot)).rejects.toThrow(/report-mentions.*normal/i);
  });

  it("loads stored artifacts for normal external readiness and reports deterministic mentions", async () => {
    const fixture = await createMigrationFixture({ mention: `Former path: ${sourcePath}` });
    const mention = (await collectCoveredPathMentions(fixture.sourceRoot, [sourcePath]))[0]!;
    fixture.coverage.retainedHistoricalReferences = [{
      ...mention,
      rationale: "Preserves a reviewed historical source path.",
    }];
    await writeStoredFixture(fixture);

    expect(await runCoreDocsCheck([
      "--source-root", fixture.sourceRoot,
      "--family", "core-route",
    ], fixture.projectRoot)).toMatchObject({ ready: true, diagnostics: [] });
    expect(await runCoreDocsCheck([
      "--source-root", fixture.sourceRoot,
      "--family", "core-route",
      "--report-mentions",
    ], fixture.projectRoot)).toEqual({
      readiness: expect.objectContaining({ ready: true }),
      mentions: [mention],
    });
  });

  it("declares both migration scripts without changing their explicit checkout policy", async () => {
    const packageJson = JSON.parse(await readFile(join(process.cwd(), "package.json"), "utf8")) as {
      scripts: Record<string, string>;
    };
    expect(packageJson.scripts["check:migrations"])
      .toBe("tsx tools/migration/check-core-docs.ts --stored-only");
    expect(packageJson.scripts["check:migration:core"])
      .toBe("tsx tools/migration/check-core-docs.ts");
  });
});

describe("real Project Control Core route pilot", () => {
  it("covers the four captured Core route blobs exactly once in one canonical leaf", async () => {
    const inventory = JSON.parse(await readFile(
      join(process.cwd(), "migrations/V0_1_0a_1/core/inventory.json"),
      "utf8",
    )) as CoreMarkdownInventory;
    const coverage = JSON.parse(await readFile(
      join(process.cwd(), "migrations/V0_1_0a_1/core/families/core-route/coverage.json"),
      "utf8",
    )) as FamilyCoverage;

    expectRealCoreRouteCoverageLifecycle(coverage, inventory);
  });

  it("accepts only coherent draft and content-reviewed coverage lifecycles", async () => {
    const inventory = JSON.parse(await readFile(
      join(process.cwd(), "migrations/V0_1_0a_1/core/inventory.json"),
      "utf8",
    )) as CoreMarkdownInventory;
    const storedCoverage = JSON.parse(await readFile(
      join(process.cwd(), "migrations/V0_1_0a_1/core/families/core-route/coverage.json"),
      "utf8",
    )) as FamilyCoverage;
    const reviewedDocumentIds = [
      "doc-core-route-overview",
      "doc-core-route-retained-contracts",
    ];
    const draftCoverage: FamilyCoverage = {
      ...storedCoverage,
      status: "draft",
      canonicalDocumentIds: [],
    };
    const reviewedCoverage: FamilyCoverage = {
      ...storedCoverage,
      status: "content-reviewed",
      canonicalDocumentIds: reviewedDocumentIds,
    };

    expect(() => expectRealCoreRouteCoverageLifecycle(draftCoverage, inventory)).not.toThrow();
    expect(() => expectRealCoreRouteCoverageLifecycle(reviewedCoverage, inventory)).not.toThrow();
    expect(() => expectRealCoreRouteCoverageLifecycle({
      ...draftCoverage,
      canonicalDocumentIds: reviewedDocumentIds,
    }, inventory)).toThrow();
    expect(() => expectRealCoreRouteCoverageLifecycle({
      ...reviewedCoverage,
      canonicalDocumentIds: [],
    }, inventory)).toThrow();
    expect(() => expectRealCoreRouteCoverageLifecycle({
      ...reviewedCoverage,
      status: "ready-for-deletion",
    }, inventory)).toThrow();
  });

  it("publishes the bounded canonical leaf and an explicitly incomplete Core document map", async () => {
    const leaf = await readFile(join(process.cwd(), canonicalCoreRouteLeaf), "utf8");
    const documentMap = await readFile(
      join(process.cwd(), "docs/versions/V0_1_0a_1/core/DOCUMENT_MAP.md"),
      "utf8",
    );

    expect(leaf.split(/\r?\n/u).filter((line) => line.startsWith("## ")))
      .toEqual(requiredCoreRouteHeadings);
    expect(documentMap).toContain("Core consolidation is incomplete");
    expect(documentMap).toContain("`CORE_OVERVIEW.md` is intentionally unpublished");
    expect(documentMap).not.toMatch(/\]\([^)]*CORE_OVERVIEW\.md[^)]*\)/u);
  });

  it("keeps canonical lifecycle wording true across Project Control registration", async () => {
    const [overview, leaf] = await Promise.all([
      readFile(join(process.cwd(), canonicalCoreRouteOverview), "utf8"),
      readFile(join(process.cwd(), canonicalCoreRouteLeaf), "utf8"),
    ]);
    const canonicalFamily = `${overview}\n${leaf}`;

    expect(canonicalFamily).not.toMatch(/documentation draft|this draft/iu);
    expect(canonicalFamily).not.toMatch(/does not publish a Project Control truth record/iu);
    expect(canonicalFamily).not.toMatch(/no canonical Document IDs/iu);
    expect(overview).toMatch(
      /bounded\s+`core-route`\s+truth\s+may\s+be\s+registered\s+as\s+`current`/iu,
    );
    expect(canonicalFamily).toContain("the parent Core node remains `unknown`");
    expect(canonicalFamily).toMatch(
      /Neither\s+registration\s+nor\s+content\s+review\s+authorizes\s+(?:source\s+or\s+reference\s+)?deletion/iu,
    );
    expect(canonicalFamily).toMatch(/cleanup\s+evidence\s+remains\s+pending/iu);
  });

  it("distinguishes deprecated route values from unannotated route types", async () => {
    const [overview, leaf] = await Promise.all([
      readFile(join(process.cwd(), canonicalCoreRouteOverview), "utf8"),
      readFile(join(process.cwd(), canonicalCoreRouteLeaf), "utf8"),
    ]);

    expect(overview).not.toMatch(/deprecated\s+source\s+files/iu);
    expect(overview).toMatch(/route\s+source\s+files\s+remain\s+internal/iu);
    expect(overview).toMatch(
      /exported\s+route\s+constants\s+and\s+response-helper\s+functions\s+carry\s+`@deprecated`/iu,
    );
    expect(overview).toMatch(/types\s+and\s+interfaces\s+remain\s+unannotated/iu);
    expect(leaf).toMatch(/route\s+constants\s+and\s+response-helper\s+functions\s+are\s+marked\s+`@deprecated`/u);
    expect(leaf).toMatch(/route\s+types\s+and\s+interfaces\s+remain\s+unannotated/u);
    expect(leaf).not.toMatch(/constants,\s+types,\s+and\s+response\s+helpers\s+remain\s+marked\s+deprecated/u);
  });
});
