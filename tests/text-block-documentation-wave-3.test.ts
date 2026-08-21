import { createHash } from "node:crypto";
import { access, readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const root = join(fileURLToPath(new URL("..", import.meta.url)));
const overviewPath = "docs/versions/V0_1_0a_1/core/text-block/OVERVIEW.md";
const orientationPath = "migrations/V0_1_0a_1/core/wave-a-orientation.json";
const frozenCoreCommit = "76a2f2311a898e781f53773390d47b05812911e4";
const coreEvidenceCommit = "c503a45c03e0ce3b7a6efba2b029ca842017faa0";
const projectControlCandidateCommit = "04b25a19cade79abc99e1652d763839a2347e340";
const frozenInventoryDigest = "36f54f2302d51895615a81767c92c0ccba18563703471c33169b3816b63e5f5b";
const expectedSourceClosureDigest = "6c261f14076ebd4caab5b05c847b63460dce66ba9252ba311791d275d3b08a33";
const verifiedAt = "2026-08-21T00:00:00.000Z";

const leafPaths = [
  "docs/versions/V0_1_0a_1/core/text-block/v1-grammar-and-migration-history.md",
  "docs/versions/V0_1_0a_1/core/text-block/v4-authoring-and-inline.md",
  "docs/versions/V0_1_0a_1/core/text-block/v4-measurement-and-pagination.md",
] as const;
const leafNames = leafPaths.map((path) => path.split("/").at(-1)!);
const leafBlobs = [
  "f3f02dd300519f657d49e37d684b29d28d7adce9",
  "0485b16e801157866ba2ed1766d7b216c6f83c57",
  "279c8f5f43ef8e933c925e0be32ff38d0f79659d",
] as const;
const documentIds = [
  "doc-text-block-v1-grammar-migration",
  "doc-text-block-v4-authoring-inline",
  "doc-text-block-v4-measurement-pagination",
  "doc-text-block-overview",
] as const;
const evidenceIds = [
  "evidence-text-block-v1-version-policy",
  "evidence-text-block-v1-producer-alignment",
  "evidence-text-block-v4-authoring-contract",
  "evidence-text-block-v4-rich-inline-replacement",
  "evidence-text-block-v4-measurement-pagination",
  "evidence-text-block-v4-close-audit",
] as const;
const coreAnchorSets = [
  [
    "src/authoring/textBlockV1Grammar.ts",
    "src/schema/documentVersionPolicy.ts",
    "src/operations/documentOperations.ts",
    "tests/textBlockV1Grammar.test.ts",
    "tests/textBlockV1VersionMigrationDecision.test.ts",
    "tests/textBlockV1GrammarFixtures.test.ts",
    "tests/textBlockV1LayoutCompatibility.test.ts",
  ],
  [
    "src/authoring/textBlockV4Contract.ts",
    "tests/textBlockV4Contract.test.ts",
    "src/authoring/textBlockV4InlineCommands.ts",
    "tests/textBlockV4InlineCommands.test.ts",
    "src/authoring/textBlockV4RichInlineReplace.ts",
    "tests/textBlockV4RichInlineReplace.test.ts",
  ],
  [
    "src/resolution/resolvedDocument.ts",
    "src/pagination/textBlockV4Measurement.ts",
    "src/pagination/textBlockV4Pagination.ts",
    "tests/textBlockV4Measurement.test.ts",
    "tests/textBlockV4Pagination.test.ts",
    "tests/textBlockV4ReadinessCloseAudit.test.ts",
  ],
] as const;
const evidenceAnchors = [
  "src/schema/documentVersionPolicy.ts",
  "src/operations/documentOperations.ts",
  "src/authoring/textBlockV4Contract.ts",
  "src/authoring/textBlockV4RichInlineReplace.ts",
  "src/pagination/textBlockV4Pagination.ts",
  "tests/textBlockV4ReadinessCloseAudit.test.ts",
] as const;
const evidenceSummaries = [
  "The version policy keeps ordinary reads at active package v2/document v3, records package v3/document v4 as a decision-only copy-forward target, and does not activate a parser, migration executor, persistence delivery, or product readiness.",
  "The document operation producers emit canonical empty text blocks for accepted table row and column insertion paths; this does not make package-read normalization authoritative or establish migration, editor, persistence, layout, or product readiness.",
  "The V4 authoring contract defines five flat inline forms, canonical empty children, UTF-16 projection, and canonical inline-local selection; this does not establish DOM input, collaboration, persistence, measurement, renderer, or product activation.",
  "The rich-inline replacement module validates exact artifact, policy, field-contract, and session pins and applies an accepted single-user cloned replacement; this does not establish stale-revision execution, idempotency, collaboration-safe deltas, CRDT/offline merge, backend persistence, or product activation.",
  "The pagination module deterministically packs complete accepted lines into isolated derived fragments without remeasurement, authored mutation, or caret remapping; this does not establish shaper execution, mixed composition, renderer/export, backend lifecycle, cross-page editing, or product readiness.",
  "The focused close-audit suite verifies the isolated 6,000-line/250-page regression case; this does not establish general performance readiness, mixed-document readiness, engine execution, renderer/export, backend lifecycle, or cross-page UX.",
] as const;
const expectedNodeSummary =
  "Text Block documentation synthesis is complete across three bounded leaves and one family overview; family truth remains unknown pending migration coverage, reference repair, publication review, and family promotion, while migration execution, product activation, input surfaces, collaboration, persistence, mixed composition, renderer and export integration, cross-page editing, and general performance readiness remain unknown.";
const expectedCoreSummary =
  "Broader Core remains unknown; the bounded core-route child is closed with recorded cleanup Evidence; the Text Engine documentation set is synthesized across four bounded leaves and one family overview; Template Builder documentation is synthesized across five bounded leaves and one family overview; migration coverage, reference repair, publication review, and family promotion remain incomplete for both documentation families. Live Draft documentation is synthesized across six bounded leaves and one family overview; its migration coverage, reference repair, publication review, and family promotion remain incomplete. Text Block documentation is synthesized across three bounded leaves and one family overview; its migration coverage, reference repair, publication review, and family promotion remain incomplete, and family truth remains unknown.";
const expectedCoreRepositorySummary =
  "Broader Core remains unknown; the bounded core-route child is closed with recorded cleanup Evidence; Text Engine and Template Builder documentation are synthesized but their migration, publication, and family-promotion work remains incomplete. Live Draft documentation is synthesized across six bounded leaves and one family overview, while its migration, publication, and family-promotion work remains incomplete. Text Block documentation is synthesized across three bounded leaves and one family overview, while its migration, publication, and family-promotion work remains incomplete and family truth remains unknown.";
const expectedSharedSummary =
  "Text Block documentation synthesis is complete across three bounded leaves and one family overview; the Node remains unknown, and migration coverage, reference repair, publication review, family promotion, and separately authorized cleanup remain incomplete.";

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
  conflicts: Array<{ id: string; owningSubgroupId: string }>;
}

interface Orientation {
  sourceCommit: string;
  inventoryDigest: string;
  families: Family[];
}

type JsonRecord = Record<string, unknown>;

async function readJson(relativePath: string): Promise<JsonRecord> {
  return JSON.parse(await readFile(join(root, relativePath), "utf8")) as JsonRecord;
}

async function readOrientation(): Promise<Orientation> {
  return JSON.parse(await readFile(join(root, orientationPath), "utf8")) as Orientation;
}

async function exists(relativePath: string): Promise<boolean> {
  try {
    await access(join(root, relativePath));
    return true;
  } catch {
    return false;
  }
}

async function readOptionalDirectory(relativePath: string): Promise<string[]> {
  try {
    return await readdir(join(root, relativePath));
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

function sourceClosureDigest(family: Family): string {
  const normalizedPaths = family.subgroups
    .flatMap(({ sourcePaths }) => sourcePaths)
    .map((sourcePath) => sourcePath.replaceAll("\\", "/").normalize("NFC"))
    .sort((left, right) => (left < right ? -1 : left > right ? 1 : 0));

  return createHash("sha256").update(normalizedPaths.join("\n"), "utf8").digest("hex");
}

const coreRef = (pathOrContractId: string) => ({
  repositoryId: "repo-core",
  commit: coreEvidenceCommit,
  pathOrContractId,
});
const projectControlRef = (pathOrContractId: string) => ({
  repositoryId: "repo-project-control",
  commit: projectControlCandidateCommit,
  pathOrContractId,
});

const expectedDocuments = [
  {
    kind: "document",
    id: documentIds[0],
    title: "Text Block V1 Grammar and Migration History",
    path: leafPaths[0],
    nodeIds: ["text-block"],
    role: "contract",
    authority: "Canonical historical contract limited to the reviewed V1 grammar intent, pure validation and normalization boundary, canonical empty-text producer alignment, and decision-only package-v3/document-v4 copy-forward policy; parser or migration activation, editor or backend behavior, persistence delivery, layout, renderer, product readiness, and family-wide authority remain excluded.",
    lifecycle: "active",
    repositoryRefs: coreAnchorSets[0].map(coreRef),
  },
  {
    kind: "document",
    id: documentIds[1],
    title: "Text Block V4 Authoring and Inline",
    path: leafPaths[1],
    nodeIds: ["text-block"],
    role: "contract",
    authority: "Canonical contract limited to the verified V4 flat-inline grammar, canonical selection, explicit atomic and field command planning, and single-user policy/pin-aware whole-rich-inline replacement; DOM/IME/clipboard ownership, collaboration-safe deltas, persistence, measurement, pagination, renderer/export, cross-page editing, and family-wide authority remain excluded.",
    lifecycle: "active",
    repositoryRefs: coreAnchorSets[1].map(coreRef),
  },
  {
    kind: "document",
    id: documentIds[2],
    title: "Text Block V4 Measurement and Pagination",
    path: leafPaths[2],
    nodeIds: ["text-block"],
    role: "contract",
    authority: "Canonical contract limited to verified resolved measurement source points, complete gap-free accepted line ranges, isolated deterministic pagination, and the bounded 6,000-line/250-page close-audit result; shaper execution, page-number expansion, mixed composition, renderer/export, backend jobs, cross-page editing, general performance readiness, and family-wide authority remain excluded.",
    lifecycle: "active",
    repositoryRefs: coreAnchorSets[2].map(coreRef),
  },
  {
    kind: "document",
    id: documentIds[3],
    title: "Text Block Overview",
    path: overviewPath,
    nodeIds: ["text-block"],
    role: "current-state",
    authority: "Current-state family overview limited to dependency, ownership, and evidence flow among the three reviewed canonical Text Block leaves; migration coverage, reference repair, publication review, family promotion, cleanup authority, product activation, and broader Core truth remain excluded.",
    lifecycle: "active",
    repositoryRefs: leafPaths.map(projectControlRef),
  },
] as const;

const expectedEvidence = evidenceIds.map((id, index) => ({
  kind: "evidence",
  id,
  nodeIds: ["text-block"],
  repositoryId: "repo-core",
  commit: coreEvidenceCommit,
  pathOrContractId: evidenceAnchors[index],
  verificationSummary: evidenceSummaries[index],
  verifiedAt,
}));

function documentRecordPath(id: typeof documentIds[number]): string {
  return `data/documents/${id.replace("doc-text-block-", "text-block-")}.json`;
}

function evidenceRecordPath(id: typeof evidenceIds[number]): string {
  return `data/evidence/${id.replace("evidence-text-block-", "text-block-")}.json`;
}

describe("Text Block documentation Wave 3", () => {
  it("freezes the exact ten-source family, dependency direction, and conflict ownership", async () => {
    const orientation = await readOrientation();
    const family = orientation.families.find(({ familyId }) => familyId === "text-block");

    expect(family).toBeDefined();
    expect(orientation.sourceCommit).toBe(frozenCoreCommit);
    expect(orientation.inventoryDigest).toBe(frozenInventoryDigest);
    expect(family?.sourceCount).toBe(10);
    expect(family?.subgroups.map(({ subgroupId, sourcePaths }) => [subgroupId, sourcePaths.length])).toEqual([
      ["v1-grammar-and-migration", 4],
      ["v4-authoring-and-inline", 3],
      ["v4-measurement-and-pagination", 3],
    ]);
    expect(new Set(family?.subgroups.flatMap(({ sourcePaths }) => sourcePaths)).size).toBe(10);
    expect(sourceClosureDigest(family!)).toBe(expectedSourceClosureDigest);
    expect(family?.subgroups.map(({ proposedLeafPath }) => proposedLeafPath)).toEqual(leafPaths);
    expect(family?.subgroups.map(({ dependsOn }) => dependsOn)).toEqual([
      [],
      ["text-block/v1-grammar-and-migration"],
      ["text-block/v4-authoring-and-inline"],
    ]);
    expect(family?.conflicts.map(({ id, owningSubgroupId }) => ({ id, owningSubgroupId }))).toEqual([
      { id: "TBL-C1", owningSubgroupId: "v1-grammar-and-migration" },
      { id: "TBL-C2", owningSubgroupId: "v4-measurement-and-pagination" },
      { id: "TBL-C3", owningSubgroupId: "v4-measurement-and-pagination" },
      { id: "TBL-C4", owningSubgroupId: "v4-authoring-and-inline" },
    ]);
  });

  it("reconciles a compact overview around the three reviewed leaf objects", async () => {
    const orientation = await readOrientation();
    const family = orientation.families.find(({ familyId }) => familyId === "text-block");
    const [overview, testSource, ...leaves] = await Promise.all([
      readFile(join(root, overviewPath), "utf8"),
      readFile(new URL(import.meta.url), "utf8"),
      ...leafPaths.map((path) => readFile(join(root, path), "utf8")),
    ]);

    expect(overview.match(/^## .+$/gmu)).toEqual([
      "## Authority and Status",
      "## Dependency Chain",
      "## Canonical Documents",
      "## Responsibility Boundaries",
      "## Evidence Flow",
      "## Current Verified State",
      "## Known Limits and Unknowns",
      "## Migration and Cleanup Boundary",
      "## Evidence Anchors",
    ]);
    expect(overview.match(/^\|/gmu) ?? []).toEqual([]);
    expect(overview).not.toMatch(/\bcandidate\b/iu);
    expect(overview).toContain("Text Block and parent Core remain `unknown`");
    expect(overview).toContain("`v1 grammar and migration history` -> `v4 authoring and inline` -> `v4 measurement and pagination`");
    expect(overview).toMatch(/No Text Block migration coverage or cleanup Evidence is recorded/iu);
    expect(overview).toMatch(/no source cleanup is authorized/iu);
    expect([...overview.matchAll(/\]\(([^)]+\.md)\)/g)].map((match) => match[1])).toEqual(leafNames);
    for (const [index, path] of leafPaths.entries()) {
      expect(overview).toContain(
        `flowdoc-project-control@${projectControlCandidateCommit}:${path}\` (Git blob \`${leafBlobs[index]}\`)`,
      );
    }

    const formerSources = family!.subgroups.flatMap(({ sourcePaths }) => sourcePaths);
    const familyContent = [overview, testSource, ...leaves].join("\n");
    for (const sourcePath of formerSources) expect(familyContent).not.toContain(sourcePath);
    expect(familyContent).not.toMatch(/flowdoc-(?:vnext-core|project-control)@(?:main|master|develop|HEAD):/iu);
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
    expect(new Set(substitutedFamily.subgroups.flatMap(({ sourcePaths }) => sourcePaths)).size).toBe(10);
    expect(sourceClosureDigest(substitutedFamily)).not.toBe(expectedSourceClosureDigest);
  });

  it("registers and projects reciprocal bounded family truth without coverage, Work, or cleanup Evidence", async () => {
    const recordPaths = [
      "data/nodes/text-block.json",
      ...documentIds.map(documentRecordPath),
      ...evidenceIds.map(evidenceRecordPath),
    ];
    const records = await Promise.all(recordPaths.map(readJson));
    const node = records[0]!;
    const documents = records.slice(1, 1 + documentIds.length);
    const evidence = records.slice(1 + documentIds.length);

    expect(node).toEqual({
      kind: "node",
      id: "text-block",
      title: "Text Block",
      parentId: "core",
      summary: expectedNodeSummary,
      truthState: "unknown",
      order: 50,
      documentIds: [...documentIds],
      evidenceIds: [...evidenceIds],
      repositoryIds: ["repo-core", "repo-project-control"],
    });
    expect(documents).toEqual(expectedDocuments);
    expect(evidence).toEqual(expectedEvidence);

    const [core, coreRepository, projectControlOverview, documentMap, index, overview, ...leaves] = await Promise.all([
      readJson("data/nodes/core.json"),
      readJson("data/repositories/core.json"),
      readFile(join(root, "docs/domains/project-control.md"), "utf8"),
      readFile(join(root, "docs/versions/V0_1_0a_1/core/DOCUMENT_MAP.md"), "utf8"),
      readJson("generated/project-index.json"),
      readFile(join(root, overviewPath), "utf8"),
      ...leafPaths.map((path) => readFile(join(root, path), "utf8")),
    ]);
    expect(core).toMatchObject({
      id: "core",
      truthState: "unknown",
      summary: expectedCoreSummary,
      documentIds: ["doc-core-v0-1-0a-1-document-map"],
      evidenceIds: [],
      repositoryIds: ["repo-core"],
    });
    expect(coreRepository).toMatchObject({
      id: "repo-core",
      ownershipSummary: expectedCoreRepositorySummary,
    });
    expect(projectControlOverview).toContain(expectedSharedSummary);
    expect(documentMap).toContain(expectedSharedSummary);
    expect([...documentMap.matchAll(/\[Text Block[^\]]*\]\((text-block\/[^)]+\.md)\)/g)]
      .map((match) => match[1])).toEqual([
      "text-block/OVERVIEW.md",
      "text-block/v1-grammar-and-migration-history.md",
      "text-block/v4-authoring-and-inline.md",
      "text-block/v4-measurement-and-pagination.md",
    ]);

    expect(await exists("migrations/V0_1_0a_1/core/families/text-block/coverage.json")).toBe(false);
    expect((await readOptionalDirectory("data/work"))
      .filter((name) => /^text-block.*\.json$/u.test(name))).toEqual([]);
    expect((await readdir(join(root, "data/evidence")))
      .filter((name) => /^text-block.*(?:coverage|cleanup).*\.json$/u.test(name))).toEqual([]);
    expect((node.evidenceIds as string[]).some((id) => /coverage|cleanup/iu.test(id))).toBe(false);

    const indexNodes = index.nodes as JsonRecord[];
    const indexDocuments = index.documents as JsonRecord[];
    const indexEvidence = index.evidence as JsonRecord[];
    expect(indexNodes).toContainEqual({ ...node, childIds: [], workIds: [] });
    expect(indexNodes).toContainEqual(expect.objectContaining({
      id: "core",
      truthState: "unknown",
      summary: expectedCoreSummary,
      childIds: ["core-route", "text-engine", "template-builder", "live-draft", "text-block"],
    }));
    for (const document of documents) {
      const path = document.path as string;
      const content = path === overviewPath ? overview : leaves[leafPaths.indexOf(path as typeof leafPaths[number])];
      expect(indexDocuments).toContainEqual({ ...document, content });
    }
    for (const item of evidence) expect(indexEvidence).toContainEqual(item);
    expect(indexDocuments
      .filter((document) => (document.nodeIds as string[]).includes("text-block"))
      .map((document) => document.id)).toEqual([
      "doc-text-block-overview",
      "doc-text-block-v1-grammar-migration",
      "doc-text-block-v4-authoring-inline",
      "doc-text-block-v4-measurement-pagination",
    ]);
    expect(indexEvidence
      .filter((item) => (item.nodeIds as string[]).includes("text-block"))
      .map((item) => item.id)).toEqual([
      "evidence-text-block-v1-producer-alignment",
      "evidence-text-block-v1-version-policy",
      "evidence-text-block-v4-authoring-contract",
      "evidence-text-block-v4-close-audit",
      "evidence-text-block-v4-measurement-pagination",
      "evidence-text-block-v4-rich-inline-replacement",
    ]);

    const family = (await readOrientation()).families.find(({ familyId }) => familyId === "text-block")!;
    const formerSources = family.subgroups.flatMap(({ sourcePaths }) => sourcePaths);
    const registeredContent = [
      overview,
      ...leaves,
      JSON.stringify(node),
      ...documents.map((document) => JSON.stringify(document)),
      ...evidence.map((item) => JSON.stringify(item)),
      JSON.stringify(index),
    ].join("\n");
    for (const sourcePath of formerSources) expect(registeredContent).not.toContain(sourcePath);
    expect(registeredContent).not.toMatch(/flowdoc-(?:vnext-core|project-control)@(?:main|master|develop|HEAD):/iu);
  });
});
