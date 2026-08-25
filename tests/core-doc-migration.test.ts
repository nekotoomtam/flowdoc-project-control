import { createHash } from "node:crypto";
import { execFile as execFileCallback } from "node:child_process";
import { access, mkdir, mkdtemp, readFile, realpath, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, isAbsolute, join, relative } from "node:path";
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
const canonicalCoreRouteReview = "docs/versions/V0_1_0a_1/core/core-route/MIGRATION_REVIEW.md";
const projectControlPublicationCommit = "bd588e336bd466e3c49e0d593ec6296293ef28bb";
const coreCleanupCommit = "8aa0be4f662708fa75d4eb8f0f99b4784da2371c";
const coreMainVerificationCommit = "501caec1fe3317309d0f6c18c2dec118fb6994e7";
const closedTruthStaleClaim = /pending|queued|future\s+work|does\s+not\s+exist|no\s+artifact/iu;
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
  } else if (coverage.status === "ready-for-deletion" || coverage.status === "closed") {
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
  });
  if (coverage.status === "ready-for-deletion" || coverage.status === "closed") {
    expect(coverage.projectControlPublicationCommit).toBe(projectControlPublicationCommit);
    expect(coverage.retainedHistoricalReferences).toEqual([]);
  } else {
    expect(coverage.projectControlPublicationCommit).toBeNull();
    expect(coverage.retainedHistoricalReferences).toEqual([]);
  }
  expect(coverage.coreCleanupCommit).toBe(
    coverage.status === "closed" ? coreCleanupCommit : null,
  );
  expect(coverage.canonicalDocumentIds).toEqual(expectedDocumentIds);
  expect(coverage.sources.map((source) => source.path)).toEqual(coreRouteSources);
  expect(coverage.sources.map((source) => source.blobId)).toEqual(
    coreRouteSources.map((path) => inventoryBlobs.get(path)),
  );
  expect([...new Set(coverage.sources.map((source) => source.destinationPath))])
    .toEqual([canonicalCoreRouteLeaf]);
}

function expectCoreDocumentMapLifecycleStable(
  documentMap: string,
  coverage: FamilyCoverage,
  inventory: CoreMarkdownInventory,
): void {
  expectRealCoreRouteCoverageLifecycle(coverage, inventory);
  expect(documentMap).toContain("Core consolidation is incomplete");
  expect(documentMap).toMatch(/map\s+is\s+intentionally\s+partial/iu);
  expect(documentMap).toMatch(
    /\[core-route coverage record\]\(\.\.\/\.\.\/\.\.\/\.\.\/migrations\/V0_1_0a_1\/core\/families\/core-route\/coverage\.json\)/u,
  );
  expect(documentMap).not.toMatch(/migration\s+coverage\s+is\s+still\s+draft/iu);
  expect(documentMap).not.toMatch(/coverage\s+is\s+content-reviewed/iu);
  expect(documentMap).not.toMatch(/no\s+canonical\s+Document\s+IDs/iu);
  expect(documentMap).not.toMatch(/does\s+not\s+publish\s+a\s+Project\s+Control\s+truth\s+record/iu);
  expect(documentMap).toMatch(/parent\s+Core\s+node\s+remains\s+`unknown`/iu);
  expect(documentMap).not.toMatch(/parent\s+Core\s+node\s+(?:is|remains)\s+`?current`?/iu);
}

function expectLifecycleAwareCurrentTruth(
  text: string,
  status: FamilyCoverage["status"],
): void {
  if (status === "draft") {
    expect(text).toMatch(/coverage\s+(?:is|remains)\s+draft/iu);
    expect(text).toMatch(/pending/iu);
    return;
  }
  if (status === "content-reviewed") {
    expect(text).toMatch(/coverage\s+is\s+content-reviewed/iu);
    expect(text).toMatch(/pending/iu);
    return;
  }
  if (status === "ready-for-deletion") {
    expect(text).toMatch(/coverage\s+is\s+ready-for-deletion/iu);
    expect(text).toMatch(/queued/iu);
    return;
  }

  expect(text).toContain(coreCleanupCommit);
  expect(text).toMatch(/coverage\s+is\s+closed/iu);
  expect(text).toMatch(/cleanup\s+Evidence\s+is\s+recorded/u);
  expect(text).not.toMatch(closedTruthStaleClaim);
}

function expectDocumentMapLifecycleAwareCurrentTruth(
  documentMap: string,
  status: FamilyCoverage["status"],
): void {
  const normalizedMap = documentMap.replace(/\r\n/gu, "\n");
  const heading = "## Completed Family Synthesis";
  const sectionStart = normalizedMap.indexOf(`${heading}\n`);
  if (sectionStart < 0) throw new Error(`Missing document-map section: ${heading}`);
  const sectionContentStart = sectionStart + heading.length + 1;
  const nextSectionStart = normalizedMap.indexOf("\n## ", sectionContentStart);
  const section = normalizedMap.slice(
    sectionContentStart,
    nextSectionStart < 0 ? undefined : nextSectionStart,
  );

  expectLifecycleAwareCurrentTruth(section, status);
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

async function closeMigrationFixture(
  fixture: MigrationFixture,
  paths: string[] = fixture.coverage.sources
    .filter((source) => source.disposition !== "repo-local-keep")
    .map((source) => source.path),
): Promise<string> {
  await git(fixture.sourceRoot, ["rm", "--", ...paths]);
  await git(fixture.sourceRoot, ["commit", "-m", "complete cleanup"]);
  const cleanupCommit = await git(fixture.sourceRoot, ["rev-parse", "HEAD"]);
  fixture.coverage.status = "closed";
  fixture.coverage.coreCleanupCommit = cleanupCommit;
  return cleanupCommit;
}

async function fixturePathExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function removeDisposableFixtureRoot(path: string): Promise<void> {
  const resolvedTempRoot = await realpath(tmpdir());
  const resolvedFixtureRoot = await realpath(path);
  const relativeFixturePath = relative(resolvedTempRoot, resolvedFixtureRoot);
  if (
    relativeFixturePath.length === 0 ||
    relativeFixturePath.startsWith("..") ||
    isAbsolute(relativeFixturePath)
  ) {
    throw new Error("Refusing to clean a non-temporary fixture repository.");
  }
  await rm(resolvedFixtureRoot, {
    recursive: true,
    force: true,
    maxRetries: 3,
    retryDelay: 100,
  });
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
      .toContain("MIGRATION_DESTINATION_DOCUMENT_MISSING");
  });

  it("accepts a canonical framing Document that is not a direct source destination", async () => {
    const fixture = await createMigrationFixture();
    fixture.coverage.canonicalDocumentIds = ["doc-core-route-overview", "doc-core-route"];
    await writeStoredFixture(fixture);
    await writeFile(join(fixture.projectRoot, canonicalCoreRouteOverview), "# Core route overview\n", "utf8");
    await writeFile(join(fixture.projectRoot, "data", "documents", "core-route-overview.json"), JSON.stringify({
      kind: "document",
      id: "doc-core-route-overview",
      title: "Core route overview",
      path: canonicalCoreRouteOverview,
      nodeIds: ["core-route"],
      role: "current-state",
      authority: "Reviewed fixture navigation.",
      lifecycle: "active",
      repositoryRefs: [{ repositoryId: "repo-core", commit: fixture.commit, pathOrContractId: sourcePath }],
    }), "utf8");

    expect(await validateStoredCoreMigration(fixture.projectRoot)).toEqual([]);
  });

  it("accepts draft coverage before canonical Document registration", async () => {
    const fixture = await createMigrationFixture();
    fixture.coverage.status = "draft";
    fixture.coverage.canonicalDocumentIds = [];
    fixture.coverage.projectControlPublicationCommit = null;
    await writeStoredFixture(fixture);

    expect(await validateStoredCoreMigration(fixture.projectRoot)).toEqual([]);
  });

  it("requires every content-reviewed destination to have a listed canonical Document", async () => {
    const fixture = await createMigrationFixture();
    fixture.coverage.status = "content-reviewed";
    fixture.coverage.canonicalDocumentIds = [];
    fixture.coverage.projectControlPublicationCommit = null;
    await writeStoredFixture(fixture);

    expect((await validateStoredCoreMigration(fixture.projectRoot)).map(({ code }) => code))
      .toContain("MIGRATION_DESTINATION_DOCUMENT_MISSING");
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

  it("accepts closed cleanup at the exact recorded commit or a clean descendant", async () => {
    const fixture = await createMigrationFixture();
    await closeMigrationFixture(fixture);

    expect(await verifyFamilyCleanup(fixture)).toMatchObject({ ready: true, diagnostics: [] });

    await writeFile(join(fixture.sourceRoot, "later.md"), "# Later unrelated documentation\n", "utf8");
    await git(fixture.sourceRoot, ["add", "later.md"]);
    await git(fixture.sourceRoot, ["commit", "-m", "later unrelated documentation"]);

    expect(await verifyFamilyCleanup(fixture)).toMatchObject({ ready: true, diagnostics: [] });
  });

  it("proves closed cleanup ancestry and tree proof", async () => {
    const nonAncestor = await createMigrationFixture();
    const base = nonAncestor.commit;
    await git(nonAncestor.sourceRoot, ["checkout", "-b", "recorded-cleanup"]);
    const recordedCleanup = await closeMigrationFixture(nonAncestor);
    await git(nonAncestor.sourceRoot, ["checkout", "-b", "current-cleanup", base]);
    await git(nonAncestor.sourceRoot, ["rm", "--", sourcePath]);
    await git(nonAncestor.sourceRoot, ["commit", "-m", "different cleanup branch"]);
    nonAncestor.coverage.coreCleanupCommit = recordedCleanup;
    expect(diagnosticCodes(await verifyFamilyCleanup(nonAncestor)))
      .toContain("MIGRATION_CLEANUP_COMMIT_NOT_ANCESTOR");

    for (const unavailableCommit of ["d".repeat(40), "not-a-commit"]) {
      const unavailable = await createMigrationFixture();
      await closeMigrationFixture(unavailable);
      unavailable.coverage.coreCleanupCommit = unavailableCommit;
      expect(diagnosticCodes(await verifyFamilyCleanup(unavailable)))
        .toContain("MIGRATION_CLEANUP_COMMIT_UNAVAILABLE");
    }

    const rootCleanup = await createMigrationFixture();
    await git(rootCleanup.sourceRoot, ["checkout", "--orphan", "root-cleanup"]);
    await git(rootCleanup.sourceRoot, ["rm", "-rf", "."]);
    await git(rootCleanup.sourceRoot, ["commit", "--allow-empty", "-m", "root cleanup"]);
    rootCleanup.coverage.status = "closed";
    rootCleanup.coverage.coreCleanupCommit = await git(rootCleanup.sourceRoot, ["rev-parse", "HEAD"]);
    expect(diagnosticCodes(await verifyFamilyCleanup(rootCleanup)))
      .toContain("MIGRATION_CLEANUP_COMMIT_TOPOLOGY_INVALID");

    const mergeCleanup = await createMigrationFixture();
    const mergeBase = mergeCleanup.commit;
    await git(mergeCleanup.sourceRoot, ["checkout", "-b", "unrelated-parent", mergeBase]);
    await writeFile(join(mergeCleanup.sourceRoot, "other.md"), "# Other parent\n", "utf8");
    await git(mergeCleanup.sourceRoot, ["add", "other.md"]);
    await git(mergeCleanup.sourceRoot, ["commit", "-m", "other parent"]);
    await git(mergeCleanup.sourceRoot, ["checkout", "-b", "cleanup-parent", mergeBase]);
    await closeMigrationFixture(mergeCleanup);
    await git(mergeCleanup.sourceRoot, ["merge", "--no-ff", "unrelated-parent", "-m", "merge cleanup"]);
    mergeCleanup.coverage.coreCleanupCommit = await git(mergeCleanup.sourceRoot, ["rev-parse", "HEAD"]);
    expect(diagnosticCodes(await verifyFamilyCleanup(mergeCleanup)))
      .toContain("MIGRATION_CLEANUP_COMMIT_TOPOLOGY_INVALID");

    const extraDelta = await createMigrationFixture();
    await git(extraDelta.sourceRoot, ["rm", "--", sourcePath]);
    await writeFile(join(extraDelta.sourceRoot, "README.md"), "# Changed during cleanup\n", "utf8");
    await git(extraDelta.sourceRoot, ["add", "README.md"]);
    await git(extraDelta.sourceRoot, ["commit", "-m", "cleanup plus unrelated change"]);
    extraDelta.coverage.status = "closed";
    extraDelta.coverage.coreCleanupCommit = await git(extraDelta.sourceRoot, ["rev-parse", "HEAD"]);
    expect(diagnosticCodes(await verifyFamilyCleanup(extraDelta)))
      .toContain("MIGRATION_CLEANUP_SCOPE_INVALID");

    const missingDeletion = await createMigrationFixture({ secondSource: true });
    await closeMigrationFixture(missingDeletion, [sourcePath]);
    expect(diagnosticCodes(await verifyFamilyCleanup(missingDeletion)))
      .toContain("MIGRATION_CLEANUP_SCOPE_INVALID");

    const nonDeletionDelta = await createMigrationFixture();
    await writeFile(join(nonDeletionDelta.sourceRoot, sourcePath), "# Retained instead of deleted\n", "utf8");
    await git(nonDeletionDelta.sourceRoot, ["add", sourcePath]);
    await git(nonDeletionDelta.sourceRoot, ["commit", "-m", "modify covered source"]);
    nonDeletionDelta.coverage.status = "closed";
    nonDeletionDelta.coverage.coreCleanupCommit = await git(nonDeletionDelta.sourceRoot, ["rev-parse", "HEAD"]);
    expect(diagnosticCodes(await verifyFamilyCleanup(nonDeletionDelta)))
      .toContain("MIGRATION_CLEANUP_SCOPE_INVALID");

    const driftedPreimage = await createMigrationFixture();
    await writeFile(join(driftedPreimage.sourceRoot, sourcePath), "# Later committed source\n", "utf8");
    await git(driftedPreimage.sourceRoot, ["add", sourcePath]);
    await git(driftedPreimage.sourceRoot, ["commit", "-m", "drift source before cleanup"]);
    await closeMigrationFixture(driftedPreimage);
    expect(diagnosticCodes(await verifyFamilyCleanup(driftedPreimage)))
      .toContain("MIGRATION_CLEANUP_PREIMAGE_MISMATCH");

    for (const mutate of [
      (fixture: MigrationFixture) => { fixture.coverage.sources[0]!.blobId = "b".repeat(40); },
      (fixture: MigrationFixture) => { fixture.inventory.files[0]!.blobId = "b".repeat(40); },
    ]) {
      const mismatchedRecord = await createMigrationFixture();
      await closeMigrationFixture(mismatchedRecord);
      mutate(mismatchedRecord);
      expect(diagnosticCodes(await verifyFamilyCleanup(mismatchedRecord)))
        .toContain("MIGRATION_CLEANUP_PREIMAGE_MISMATCH");
    }
  }, 60_000);

  it("detects covered sources in the current Git tree even when skip-worktree hides the filesystem copy", async () => {
    const fixture = await createMigrationFixture();
    await closeMigrationFixture(fixture);
    await git(fixture.sourceRoot, ["checkout", `${fixture.coverage.coreCleanupCommit}^`, "--", sourcePath]);
    await git(fixture.sourceRoot, ["commit", "-m", "reintroduce covered source"]);

    const resolvedFixtureRoot = await realpath(fixture.sourceRoot);
    let skipWorktreeSet = false;
    try {
      await git(resolvedFixtureRoot, ["update-index", "--skip-worktree", "--", sourcePath]);
      skipWorktreeSet = true;
      await rm(join(resolvedFixtureRoot, ...sourcePath.split("/")));
      expect(await git(resolvedFixtureRoot, ["status", "--porcelain"])).toBe("");
      await expect(git(resolvedFixtureRoot, ["cat-file", "-e", `HEAD:${sourcePath}`]))
        .resolves.toBe("");
      await expect(access(join(resolvedFixtureRoot, ...sourcePath.split("/"))))
        .rejects.toMatchObject({ code: "ENOENT" });
      expect(diagnosticCodes(await verifyFamilyCleanup({
        ...fixture,
        sourceRoot: resolvedFixtureRoot,
      }))).toContain("MIGRATION_CLEANUP_INCOMPLETE");
    } finally {
      try {
        if (await fixturePathExists(join(resolvedFixtureRoot, ".git"))) {
          if (skipWorktreeSet) {
            await git(resolvedFixtureRoot, ["update-index", "--no-skip-worktree", "--", sourcePath]);
          }
          await git(resolvedFixtureRoot, ["restore", "--staged", "--worktree", "--source=HEAD", "--", sourcePath]);
        }
      } finally {
        await removeDisposableFixtureRoot(resolvedFixtureRoot);
        await removeDisposableFixtureRoot(fixture.projectRoot);
      }
    }
  });

  it("fails closed without throwing for non-blob covered paths and unavailable captured trees", async () => {
    const directoryReintroduction = await createMigrationFixture();
    await closeMigrationFixture(directoryReintroduction);
    await mkdir(join(directoryReintroduction.sourceRoot, ...sourcePath.split("/")), { recursive: true });
    await writeFile(
      join(directoryReintroduction.sourceRoot, ...sourcePath.split("/"), "nested.md"),
      "# Directory reintroduction\n",
      "utf8",
    );
    await git(directoryReintroduction.sourceRoot, ["add", sourcePath]);
    await git(directoryReintroduction.sourceRoot, ["commit", "-m", "reintroduce source as directory"]);
    const directoryResult = await verifyFamilyCleanup(directoryReintroduction);
    expect(diagnosticCodes(directoryResult)).toEqual(["MIGRATION_CLEANUP_INCOMPLETE"]);
    expect(JSON.stringify(directoryResult.diagnostics)).not.toContain(directoryReintroduction.sourceRoot);

    const gitlinkReintroduction = await createMigrationFixture();
    await closeMigrationFixture(gitlinkReintroduction);
    const submoduleRepository = await createCoreDocRepository();
    await git(gitlinkReintroduction.sourceRoot, [
      "-c",
      "protocol.file.allow=always",
      "submodule",
      "add",
      submoduleRepository.root,
      sourcePath,
    ]);
    await git(gitlinkReintroduction.sourceRoot, ["commit", "-m", "reintroduce source as gitlink"]);
    gitlinkReintroduction.coverage.retainedHistoricalReferences = (
      await collectCoveredPathMentions(gitlinkReintroduction.sourceRoot, [sourcePath])
    ).map((mention) => ({
      ...mention,
      rationale: "Allows the disposable fixture's generated submodule metadata.",
    }));
    const gitlinkResult = await verifyFamilyCleanup(gitlinkReintroduction);
    expect(diagnosticCodes(gitlinkResult)).toEqual(["MIGRATION_CLEANUP_INCOMPLETE"]);
    expect(JSON.stringify(gitlinkResult.diagnostics)).not.toContain(gitlinkReintroduction.sourceRoot);

    for (const unavailableSourceCommit of ["f".repeat(40), "not-a-commit"]) {
      const unavailableCapturedTree = await createMigrationFixture();
      await closeMigrationFixture(unavailableCapturedTree);
      unavailableCapturedTree.coverage.sourceCommit = unavailableSourceCommit;
      const result = await verifyFamilyCleanup(unavailableCapturedTree);
      expect(diagnosticCodes(result)).toEqual(["MIGRATION_CLEANUP_PREIMAGE_MISMATCH"]);
      expect(JSON.stringify(result.diagnostics)).not.toContain(unavailableCapturedTree.sourceRoot);
    }

    const largeTrackedBlob = await createMigrationFixture();
    await closeMigrationFixture(largeTrackedBlob);
    await writeFile(join(largeTrackedBlob.sourceRoot, "large.txt"), "x".repeat(1_200_000), "utf8");
    await git(largeTrackedBlob.sourceRoot, ["add", "large.txt"]);
    await git(largeTrackedBlob.sourceRoot, ["commit", "-m", "add large tracked blob"]);
    expect(await verifyFamilyCleanup(largeTrackedBlob)).toMatchObject({ ready: true, diagnostics: [] });
  }, 30_000);

  it("maps inaccessible cleanup and current trees to sanitized diagnostics", async () => {
    const corruptTree = async (fixture: MigrationFixture, commit: string): Promise<void> => {
      const tree = await git(fixture.sourceRoot, ["rev-parse", `${commit}^{tree}`]);
      const objectPath = join(fixture.sourceRoot, ".git", "objects", tree.slice(0, 2), tree.slice(2));
      await rm(objectPath);
    };

    const inaccessibleCleanup = await createMigrationFixture();
    try {
      const cleanup = await closeMigrationFixture(inaccessibleCleanup);
      await corruptTree(inaccessibleCleanup, cleanup);
      const result = await verifyFamilyCleanup(inaccessibleCleanup);
      expect(diagnosticCodes(result).length).toBeGreaterThan(0);
      expect(diagnosticCodes(result).every((code) => code === "MIGRATION_CLEANUP_SCOPE_INVALID")).toBe(true);
      expect(JSON.stringify(result.diagnostics)).not.toMatch(/fatal:|\.git[\\/]objects/iu);
      expect(JSON.stringify(result.diagnostics)).not.toContain(inaccessibleCleanup.sourceRoot);
    } finally {
      await removeDisposableFixtureRoot(inaccessibleCleanup.sourceRoot);
      await removeDisposableFixtureRoot(inaccessibleCleanup.projectRoot);
    }

    const inaccessibleCurrent = await createMigrationFixture();
    try {
      await closeMigrationFixture(inaccessibleCurrent);
      await writeFile(join(inaccessibleCurrent.sourceRoot, "later.md"), "# Later\n", "utf8");
      await git(inaccessibleCurrent.sourceRoot, ["add", "later.md"]);
      await git(inaccessibleCurrent.sourceRoot, ["commit", "-m", "later descendant"]);
      const current = await git(inaccessibleCurrent.sourceRoot, ["rev-parse", "HEAD"]);
      await corruptTree(inaccessibleCurrent, current);
      const result = await verifyFamilyCleanup(inaccessibleCurrent);
      expect(diagnosticCodes(result).length).toBeGreaterThan(0);
      expect(diagnosticCodes(result).every((code) => code === "MIGRATION_CLEANUP_SCOPE_INVALID")).toBe(true);
      expect(JSON.stringify(result.diagnostics)).not.toMatch(/fatal:|\.git[\\/]objects/iu);
      expect(JSON.stringify(result.diagnostics)).not.toContain(inaccessibleCurrent.sourceRoot);
    } finally {
      await removeDisposableFixtureRoot(inaccessibleCurrent.sourceRoot);
      await removeDisposableFixtureRoot(inaccessibleCurrent.projectRoot);
    }
  }, 30_000);

  it("enforces closed cleanup reference closure", async () => {
    const baseline = async (): Promise<MigrationFixture> => {
      const fixture = await createMigrationFixture({ mention: `Former path: ${sourcePath}` });
      const mention = (await collectCoveredPathMentions(fixture.sourceRoot, [sourcePath]))[0]!;
      fixture.coverage.retainedHistoricalReferences = [{
        ...mention,
        rationale: "A different family-neutral reviewed historical rationale.",
      }];
      await closeMigrationFixture(fixture);
      return fixture;
    };

    const untouched = await baseline();
    expect(await verifyFamilyCleanup(untouched)).toMatchObject({ ready: true, diagnostics: [] });

    const active = await baseline();
    active.coverage.activeReferences = [{ sourcePath: "README.md", line: 1, targetPath: sourcePath }];
    expect(diagnosticCodes(await verifyFamilyCleanup(active))).toContain("MIGRATION_ACTIVE_REFERENCE");

    const missing = await baseline();
    missing.coverage.retainedHistoricalReferences = [];
    expect(diagnosticCodes(await verifyFamilyCleanup(missing))).toContain("MIGRATION_ACTIVE_PATH_MENTION");

    const allowanceMutations: Array<(fixture: MigrationFixture) => void> = [
      (fixture) => { fixture.coverage.retainedHistoricalReferences[0]!.line = 2; },
      (fixture) => { fixture.coverage.retainedHistoricalReferences[0]!.lineSha256 = "c".repeat(64); },
      (fixture) => { fixture.coverage.retainedHistoricalReferences[0]!.targetPath = "docs/OTHER.md"; },
    ];
    for (const mutate of allowanceMutations) {
      const fixture = await baseline();
      mutate(fixture);
      expect(diagnosticCodes(await verifyFamilyCleanup(fixture))).toEqual(expect.arrayContaining([
        "MIGRATION_ACTIVE_PATH_MENTION",
        "MIGRATION_HISTORICAL_ALLOWANCE_STALE",
      ]));
    }

    const extra = await baseline();
    extra.coverage.retainedHistoricalReferences.push({
      ...extra.coverage.retainedHistoricalReferences[0]!,
      line: 2,
    });
    expect(diagnosticCodes(await verifyFamilyCleanup(extra)))
      .toContain("MIGRATION_HISTORICAL_ALLOWANCE_STALE");

    const changedTrackedLine = await baseline();
    await writeFile(
      join(changedTrackedLine.sourceRoot, "notes.txt"),
      `Historical former path: ${sourcePath}\n`,
      "utf8",
    );
    await git(changedTrackedLine.sourceRoot, ["add", "notes.txt"]);
    await git(changedTrackedLine.sourceRoot, ["commit", "-m", "edit historical wording"]);
    expect(diagnosticCodes(await verifyFamilyCleanup(changedTrackedLine))).toEqual(expect.arrayContaining([
      "MIGRATION_ACTIVE_PATH_MENTION",
      "MIGRATION_HISTORICAL_ALLOWANCE_STALE",
    ]));
  }, 30_000);

  it("retains closed cleanup negative controls", async () => {
    const dirtyDescendant = await createMigrationFixture();
    await closeMigrationFixture(dirtyDescendant);
    await writeFile(join(dirtyDescendant.sourceRoot, "dirty.md"), "# Dirty\n", "utf8");
    expect(diagnosticCodes(await verifyFamilyCleanup(dirtyDescendant)))
      .toContain("MIGRATION_SOURCE_TREE_DIRTY");

    const reintroducedSource = await createMigrationFixture();
    await closeMigrationFixture(reintroducedSource);
    await git(reintroducedSource.sourceRoot, ["checkout", `${reintroducedSource.coverage.coreCleanupCommit}^`, "--", sourcePath]);
    await git(reintroducedSource.sourceRoot, ["commit", "-m", "reintroduce covered source"]);
    expect(diagnosticCodes(await verifyFamilyCleanup(reintroducedSource)))
      .toContain("MIGRATION_CLEANUP_INCOMPLETE");

    const filesystemReintroduction = await createMigrationFixture();
    await closeMigrationFixture(filesystemReintroduction);
    await mkdir(dirname(join(filesystemReintroduction.sourceRoot, sourcePath)), { recursive: true });
    await writeFile(join(filesystemReintroduction.sourceRoot, sourcePath), "# Untracked reintroduction\n", "utf8");
    expect(diagnosticCodes(await verifyFamilyCleanup(filesystemReintroduction)))
      .toContain("MIGRATION_CLEANUP_INCOMPLETE");
  }, 15_000);
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

  it("accepts only coherent draft, content-reviewed, deletion-ready, and closed coverage lifecycles", async () => {
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
      retainedHistoricalReferences: [],
      projectControlPublicationCommit: null,
      coreCleanupCommit: null,
    };
    const reviewedCoverage: FamilyCoverage = {
      ...storedCoverage,
      status: "content-reviewed",
      canonicalDocumentIds: reviewedDocumentIds,
      retainedHistoricalReferences: [],
      projectControlPublicationCommit: null,
      coreCleanupCommit: null,
    };
    const deletionReadyCoverage: FamilyCoverage = {
      ...storedCoverage,
      status: "ready-for-deletion",
      coreCleanupCommit: null,
    };
    const closedCoverage: FamilyCoverage = {
      ...storedCoverage,
      status: "closed",
      coreCleanupCommit,
    };

    expect(() => expectRealCoreRouteCoverageLifecycle(draftCoverage, inventory)).not.toThrow();
    expect(() => expectRealCoreRouteCoverageLifecycle(reviewedCoverage, inventory)).not.toThrow();
    expect(() => expectRealCoreRouteCoverageLifecycle(deletionReadyCoverage, inventory)).not.toThrow();
    expect(() => expectRealCoreRouteCoverageLifecycle(closedCoverage, inventory)).not.toThrow();
    expect(() => expectRealCoreRouteCoverageLifecycle({
      ...draftCoverage,
      canonicalDocumentIds: reviewedDocumentIds,
    }, inventory)).toThrow();
    expect(() => expectRealCoreRouteCoverageLifecycle({
      ...reviewedCoverage,
      canonicalDocumentIds: [],
    }, inventory)).toThrow();
    expect(() => expectRealCoreRouteCoverageLifecycle({
      ...deletionReadyCoverage,
      projectControlPublicationCommit: null,
    }, inventory)).toThrow();
  });

  it("closes the reviewed deletion scope without inflating provisional family-map authority", async () => {
    const [review, coverageJson, familyMapJson] = await Promise.all([
      readFile(join(process.cwd(), canonicalCoreRouteReview), "utf8"),
      readFile(
        join(process.cwd(), "migrations/V0_1_0a_1/core/families/core-route/coverage.json"),
        "utf8",
      ),
      readFile(join(process.cwd(), "migrations/V0_1_0a_1/core/family-map.json"), "utf8"),
    ]);
    const coverage = JSON.parse(coverageJson) as FamilyCoverage;
    const familyMap = JSON.parse(familyMapJson) as CoreFamilyMap;
    const family = familyMap.families.find(({ familyId }) => familyId === "core-route");

    expect(coverage.status).toBe("closed");
    expect(coverage.activeReferences).toEqual([]);
    expect(coverage.coreCleanupCommit).toBe(coreCleanupCommit);
    expect(coverage.sources.map(({ path, blobId }) => ({ path, blobId }))).toEqual([
      { path: "docs/CORE_ROUTE_DEEXPORT_PLAN.md", blobId: "8f17cbd011fb706d69e53f38b86a95bc2afe6c7c" },
      { path: "docs/CORE_ROUTE_DEPRECATION_WINDOW.md", blobId: "815dd7117dfdbb9551257afe7d81ac1351fa4b33" },
      { path: "docs/CORE_ROUTE_RETAINED_CONTRACT_TEST_REWRITE.md", blobId: "d8db6dfe0eb6f5d3c6821f1c55b10bd25c1b46ef" },
      { path: "docs/CORE_ROUTE_WINDOW_C_PUBLIC_EXPORT_REMOVAL.md", blobId: "188fd81d4e78a025119c8d2b0ae1cef046d0ff13" },
    ]);
    expect(family?.sources.map(({ migrationStatus }) => migrationStatus))
      .toEqual(["classified", "classified", "classified", "classified"]);
    expect(review).toContain("READY FOR TASK 8 AUTHORIZATION — not deletion performed.");
    expect(review).toContain("ready for source deletion");
    expect(review).toContain("provisional classification");
    expect(review).toContain("authoritative deletion lifecycle");
    expect(review).toContain(coreCleanupCommit);
    expect(review).toContain(coreMainVerificationCommit);
    expect(review).toContain("458 test files / 2,938 tests");
    expect(review).toContain("zero current retained historical allowances");
    expect(review).toMatch(/wrong[- ]phase/u);
  });

  it("keeps the partial document map structurally truthful across preclosed lifecycles", async () => {
    const [documentMap, inventoryJson, coverageJson] = await Promise.all([
      readFile(join(process.cwd(), "docs/versions/V0_1_0a_1/core/DOCUMENT_MAP.md"), "utf8"),
      readFile(join(process.cwd(), "migrations/V0_1_0a_1/core/inventory.json"), "utf8"),
      readFile(
        join(process.cwd(), "migrations/V0_1_0a_1/core/families/core-route/coverage.json"),
        "utf8",
      ),
    ]);
    const inventory = JSON.parse(inventoryJson) as CoreMarkdownInventory;
    const storedCoverage = JSON.parse(coverageJson) as FamilyCoverage;
    const draftCoverage: FamilyCoverage = {
      ...storedCoverage,
      status: "draft",
      canonicalDocumentIds: [],
      retainedHistoricalReferences: [],
      projectControlPublicationCommit: null,
      coreCleanupCommit: null,
    };
    const reviewedCoverage: FamilyCoverage = {
      ...storedCoverage,
      status: "content-reviewed",
      canonicalDocumentIds: [
        "doc-core-route-overview",
        "doc-core-route-retained-contracts",
      ],
      retainedHistoricalReferences: [],
      projectControlPublicationCommit: null,
      coreCleanupCommit: null,
    };

    expect(() => expectCoreDocumentMapLifecycleStable(documentMap, draftCoverage, inventory)).not.toThrow();
    expect(() => expectCoreDocumentMapLifecycleStable(documentMap, reviewedCoverage, inventory)).not.toThrow();
  });

  it("allows phase-matched pending language before closure and rejects it after closure", () => {
    expect(() => expectLifecycleAwareCurrentTruth(
      "Coverage remains draft; publication is pending.",
      "draft",
    )).not.toThrow();
    expect(() => expectLifecycleAwareCurrentTruth(
      "Coverage is content-reviewed; cleanup is pending.",
      "content-reviewed",
    )).not.toThrow();
    expect(() => expectLifecycleAwareCurrentTruth(
      "Coverage is ready-for-deletion; cleanup is queued.",
      "ready-for-deletion",
    )).not.toThrow();
    expect(() => expectLifecycleAwareCurrentTruth(
      `Coverage is closed at ${coreCleanupCommit}; cleanup Evidence is recorded.`,
      "closed",
    )).not.toThrow();
    expect(() => expectLifecycleAwareCurrentTruth(
      `Coverage is closed at ${coreCleanupCommit}; cleanup Evidence is recorded but cleanup is pending.`,
      "closed",
    )).toThrow();
    expect(() => expectLifecycleAwareCurrentTruth(
      "Coverage is content-reviewed; cleanup is pending.",
      "ready-for-deletion",
    )).toThrow();
  });

  it("scopes closed Core route wording checks away from other incomplete families", () => {
    const documentMap = [
      "# Core Document Map",
      "",
      "## Completed Family Synthesis",
      `Coverage is closed at ${coreCleanupCommit}; cleanup Evidence is recorded.`,
      "",
      "## Text Engine Family Documentation",
      "Text Engine remains unknown pending coverage and publication review.",
    ].join("\n");

    expect(() => expectDocumentMapLifecycleAwareCurrentTruth(documentMap, "closed")).not.toThrow();
    expect(() => expectDocumentMapLifecycleAwareCurrentTruth(
      documentMap.replace(
        `Coverage is closed at ${coreCleanupCommit}; cleanup Evidence is recorded.`,
        `Coverage is closed at ${coreCleanupCommit}; cleanup Evidence is recorded but cleanup is pending.`,
      ),
      "closed",
    )).toThrow();
  });

  it("publishes closure-current truth and reciprocal review navigation", async () => {
    const [
      projectControlOverview,
      documentMap,
      overview,
      leaf,
      review,
      readme,
      coverageJson,
      cleanupEvidenceJson,
    ] = await Promise.all([
      readFile(join(process.cwd(), "docs/domains/project-control.md"), "utf8"),
      readFile(join(process.cwd(), "docs/versions/V0_1_0a_1/core/DOCUMENT_MAP.md"), "utf8"),
      readFile(join(process.cwd(), canonicalCoreRouteOverview), "utf8"),
      readFile(join(process.cwd(), canonicalCoreRouteLeaf), "utf8"),
      readFile(join(process.cwd(), canonicalCoreRouteReview), "utf8"),
      readFile(join(process.cwd(), "README.md"), "utf8"),
      readFile(
        join(process.cwd(), "migrations/V0_1_0a_1/core/families/core-route/coverage.json"),
        "utf8",
      ),
      readFile(join(process.cwd(), "data/evidence/core-route-cleanup.json"), "utf8"),
    ]);
    const coverage = JSON.parse(coverageJson) as FamilyCoverage;
    const cleanupEvidence = JSON.parse(cleanupEvidenceJson) as { commit: string };

    expect(coverage.status).toBe("closed");
    expect(coverage.coreCleanupCommit).toBe(coreCleanupCommit);
    expect(cleanupEvidence.commit).toBe(coreCleanupCommit);
    expect(coverage.retainedHistoricalReferences).toEqual([]);

    expect(projectControlOverview).toMatch(/## Closed pilot/u);
    expect(projectControlOverview).toContain(coreCleanupCommit);
    expect(projectControlOverview).toMatch(/no\s+active\s+`CORE_ROUTE`\s+Work/iu);
    expect(projectControlOverview).not.toMatch(closedTruthStaleClaim);
    expect(projectControlOverview).toContain(
      "Template Builder documentation synthesis is complete across five bounded leaves and one family overview; the Node remains unknown, and no migration coverage, source cleanup, production editor, persistence, collaboration, renderer, or performance authority is created.",
    );
    expect(projectControlOverview).not.toMatch(/Template\s+Builder[^.]*unregistered/iu);

    expectDocumentMapLifecycleAwareCurrentTruth(documentMap, coverage.status);
    for (const currentTruth of [overview, leaf]) {
      expectLifecycleAwareCurrentTruth(currentTruth, coverage.status);
    }
    for (const currentTruth of [documentMap, overview, leaf]) {
      for (const source of coreRouteSources) {
        expect(currentTruth).toContain(source);
      }
      expect(currentTruth).toMatch(/exactly\s+four/iu);
      expect(currentTruth).toMatch(/no\s+other\s+Core\s+(?:document|path|deletion)[^.]*authorized/iu);
    }

    expect(leaf).toMatch(/\[Migration Readiness and Cleanup Review\]\(MIGRATION_REVIEW\.md\)/u);
    expect(review).toMatch(
      /\[Core Route Ownership and Retained Contracts\]\(route-ownership-and-retained-contracts\.md\)/u,
    );
    expect(review).toMatch(
      /deprecated\s+internal\s+route\s+vocabulary[\s\S]*until\s+runtime\s+route-source\s+removal\s+is\s+separately\s+authorized\s+and\s+completed/iu,
    );
    expect(review).not.toMatch(/deprecated\s+internal\s+route\s+vocabulary[^.]*until\s+cleanup/iu);

    expect(readme).not.toMatch(/`CORE_ROUTE_\*`\s+migration\s+execution[^.]*deferred/iu);
    expect(readme).not.toMatch(closedTruthStaleClaim);
    expect(readme).toMatch(/GUI[^.]*product-repository\s+mutation[^.]*deferred/iu);
    expect(readme).toMatch(/AGENTS\/Skill\s+redesign[^.]*deferred/iu);
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

  it("keeps canonical lifecycle wording true after Project Control closure", async () => {
    const [overview, leaf] = await Promise.all([
      readFile(join(process.cwd(), canonicalCoreRouteOverview), "utf8"),
      readFile(join(process.cwd(), canonicalCoreRouteLeaf), "utf8"),
    ]);
    const canonicalFamily = `${overview}\n${leaf}`;

    expect(canonicalFamily).not.toMatch(/documentation draft|this draft/iu);
    expect(canonicalFamily).not.toMatch(/does not publish a Project Control truth record/iu);
    expect(canonicalFamily).not.toMatch(/no canonical Document IDs/iu);
    expect(overview).toMatch(/bounded\s+`core-route`\s+truth\s+is\s+`current`/iu);
    expect(canonicalFamily).toContain("the parent Core node remains `unknown`");
    expect(canonicalFamily).not.toMatch(closedTruthStaleClaim);
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
