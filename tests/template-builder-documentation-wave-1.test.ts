import { createHash } from "node:crypto";
import { access, readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const root = join(fileURLToPath(new URL("..", import.meta.url)));
const overviewPath = "docs/versions/V0_1_0a_1/core/template-builder/OVERVIEW.md";
const frozenCommit = "76a2f2311a898e781f53773390d47b05812911e4";
const coreEvidenceCommit = "c503a45c03e0ce3b7a6efba2b029ca842017faa0";
const projectControlCandidateCommit = "5c3bd8cb9765310f6950300ee17ed3a8c76bf7a0";
const inventoryDigest = "36f54f2302d51895615a81767c92c0ccba18563703471c33169b3816b63e5f5b";
const verifiedAt = "2026-08-21T00:00:00.000Z";
const leafNames = [
  "sandbox-runtime-and-store.md",
  "viewport-and-virtualized-rendering.md",
  "structural-runtime-and-navigation.md",
  "wysiwyg-draft-input-and-guards.md",
  "rich-inline-commit-and-session-lifecycle.md",
] as const;
type LeafName = typeof leafNames[number];
const leafContracts = [
  {
    leafName: leafNames[0],
    ownership: "The sandbox consumes public-Core snapshots and accepted mutation responses",
    dependency: "Structural packet semantics belong to",
    crossReferences: [leafNames[2], leafNames[1], leafNames[3], leafNames[4]],
  },
  {
    leafName: leafNames[1],
    ownership: "Viewport owns viewport prediction and rendering-window behavior after the store-backed model exists.",
    dependency: "The upstream sandbox owns snapshot normalization",
    crossReferences: [leafNames[0], leafNames[2], leafNames[3], leafNames[4]],
  },
  {
    leafName: leafNames[2],
    ownership: "This leaf owns structural-tree semantics and their browser-local navigation constraints.",
    dependency: "Generic cache/store facts remain in",
    crossReferences: [leafNames[0], leafNames[1], leafNames[3], leafNames[4]],
  },
  {
    leafName: leafNames[3],
    ownership: "This leaf owns the active plain-text draft, textarea selection and caret",
    dependency: "Rich-inline lifecycle contracts belong to",
    crossReferences: [leafNames[0], leafNames[1], leafNames[4]],
  },
  {
    leafName: leafNames[4],
    ownership: "This leaf owns contenteditable-like segment and range facts, local rich state",
    dependency: "The prerequisite draft and IME policy belongs to",
    crossReferences: [leafNames[3], leafNames[0], leafNames[1], leafNames[2]],
  },
] as const satisfies ReadonlyArray<{
  leafName: LeafName;
  ownership: string;
  dependency: string;
  crossReferences: readonly LeafName[];
}>;
const authorityTransferClaims = [
  /\bsandbox owns viewport policy\b/iu,
  /\bstructural owns active draft input\b/iu,
  /\bviewport owns structural packet application\b/iu,
  /\bWYSIWYG owns rich-inline commit\b/iu,
  /\brich inline owns sandbox cache\/store application\b/iu,
] as const;
const leafPaths = leafNames.map((name) =>
  `docs/versions/V0_1_0a_1/core/template-builder/${name}`
);
const leafBlobs = [
  "89b6f20aed93ef2b2a18a516b44b3c243a96787b",
  "42987ef843d4e466e7295546f56b903b2bc4e1df",
  "d3c34b7d14e6f1dfd7783f449d66f1dc103a6480",
  "a8288ba8b20d41140ab225f5b237991dc064e4bb",
  "13d41032f395c5ec6eb2007f4999d35ef2cc07ce",
] as const;

const documentIds = [
  "doc-template-builder-sandbox-runtime-store",
  "doc-template-builder-viewport-virtualized-rendering",
  "doc-template-builder-structural-runtime-navigation",
  "doc-template-builder-wysiwyg-draft-guards",
  "doc-template-builder-rich-inline-session-lifecycle",
  "doc-template-builder-overview",
] as const;

const evidenceIds = [
  "evidence-template-builder-sandbox-package-boundary",
  "evidence-template-builder-runtime-store-packet-application",
  "evidence-template-builder-plain-text-history-live-layout",
  "evidence-template-builder-viewport-large-document-shape",
  "evidence-template-builder-viewport-scheduler-stale-guards",
  "evidence-template-builder-structural-packet-projection",
  "evidence-template-builder-structural-diagnostics-navigation",
  "evidence-template-builder-wysiwyg-local-draft-eligibility",
  "evidence-template-builder-wysiwyg-ime-planning-guards",
  "evidence-template-builder-contenteditable-range-hardening",
  "evidence-template-builder-rich-inline-commit-replay",
  "evidence-template-builder-session-live-exact-boundary",
] as const;

const evidenceAnchors = [
  "examples/template-builder-sandbox/package.json",
  "examples/template-builder-sandbox/src/coreBoundary.ts",
  "tests/templateBuilderSandboxBoundary.test.ts",
  "tests/templateBuilderSandboxBoundary.test.ts",
  "tests/templateBuilderSandboxBoundary.test.ts",
  "tests/structuralPacket.test.ts",
  "examples/template-builder-sandbox/src/coreBoundary.ts",
  "tests/wysiwygPrimaryInputDecisionGate.test.ts",
  "tests/templateBuilderSandboxBoundary.test.ts",
  "examples/template-builder-sandbox/public/draftContenteditableSurfaceHardening.js",
  "src/authoring/richInlineCommit.ts",
  "src/authoring/richInlineSessionPersistence.ts",
] as const;

const expectedNodeSummary =
  "Template Builder documentation synthesis is complete across five bounded leaves and one family overview; family truth remains unknown pending migration coverage, reference repair, publication review, and separately authorized cleanup, while production editor integration, durable persistence, collaboration, renderer output, and performance readiness remain unknown.";
const expectedCoreSummary =
  "Broader Core remains unknown; the bounded core-route child is closed with recorded cleanup Evidence; the Text Engine documentation set is synthesized across four bounded leaves and one family overview; Template Builder documentation is synthesized across five bounded leaves and one family overview; migration coverage, reference repair, publication review, and family promotion remain incomplete for both documentation families.";
const expectedCoreRepositorySummary =
  "Broader Core remains unknown; the bounded core-route child is closed with recorded cleanup Evidence; Text Engine and Template Builder documentation are synthesized but their migration, publication, and family-promotion work remains incomplete.";
const expectedCurrentScopeSummary =
  "Template Builder documentation synthesis is complete across five bounded leaves and one family overview; the Node remains unknown, and no migration coverage, source cleanup, production editor, persistence, collaboration, renderer, or performance authority is created.";

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
    title: "Template Builder Sandbox Runtime and Store",
    path: leafPaths[0],
    nodeIds: ["template-builder"],
    role: "contract",
    authority: "Canonical contract limited to the verified public-Core sandbox package boundary, bounded packet/cache/store application, in-memory plain-text history, and live-layout stale summaries; production editor integration, canonical storage, durable persistence, collaboration, renderer output, and family-wide authority remain excluded.",
    lifecycle: "active",
    repositoryRefs: evidenceAnchors.slice(0, 3).map(coreRef),
  },
  {
    kind: "document",
    id: documentIds[1],
    title: "Template Builder Viewport and Virtualized Rendering",
    path: leafPaths[1],
    nodeIds: ["template-builder"],
    role: "contract",
    authority: "Canonical contract limited to verified viewport requests, browser-local measurement, guarded scheduling, render windows, section shells, virtual stacks, lazy-detail plans, anchors, and the bounded synthetic 72-section/936-node shape; wall-clock performance, DOM recycling, production rendering, persistence, and family-wide authority remain excluded.",
    lifecycle: "active",
    repositoryRefs: [coreRef(evidenceAnchors[3])],
  },
  {
    kind: "document",
    id: documentIds[2],
    title: "Template Builder Structural Runtime and Navigation",
    path: leafPaths[2],
    nodeIds: ["template-builder"],
    role: "contract",
    authority: "Canonical contract limited to verified read-only structural projection, non-public packet-v1 foundation transport, bounded structural bridge/store application, command policy, outline jumps, and fail-closed diagnostics navigation; durable/public transport, persistence, collaboration, production editing, and family-wide authority remain excluded.",
    lifecycle: "active",
    repositoryRefs: evidenceAnchors.slice(5, 7).map(coreRef),
  },
  {
    kind: "document",
    id: documentIds[3],
    title: "Template Builder WYSIWYG Draft Input and Guards",
    path: leafPaths[3],
    nodeIds: ["template-builder"],
    role: "contract",
    authority: "Canonical contract limited to the verified textarea-first browser-local draft, selection/caret, text-command, IME, pre-commit layout-summary, and planning-only toolbar/field/history boundaries; production primary-input replacement, canonical typing truth, durable persistence, collaboration, renderer output, and family-wide authority remain excluded.",
    lifecycle: "active",
    repositoryRefs: evidenceAnchors.slice(7, 9).map(coreRef),
  },
  {
    kind: "document",
    id: documentIds[4],
    title: "Template Builder Rich Inline Commit and Session Lifecycle",
    path: leafPaths[4],
    nodeIds: ["template-builder"],
    role: "contract",
    authority: "Canonical contract limited to verified local segment/range hardening, accepted-fresh-plan rich-inline commit, in-memory replay, live/exact stale invalidation, and JSON-safe rich-inline replay-patch validation/history-ready facts; the validation helper creates no package snapshot, persisted session record, or storage record, performs no storage write, and executes no replay, while production contenteditable input, collaboration merge, renderer/export output, and family-wide authority remain excluded.",
    lifecycle: "active",
    repositoryRefs: evidenceAnchors.slice(9, 12).map(coreRef),
  },
  {
    kind: "document",
    id: documentIds[5],
    title: "Template Builder Overview",
    path: overviewPath,
    nodeIds: ["template-builder"],
    role: "current-state",
    authority: "Current-state family overview limited to ownership relationships and evidence flow among the five reviewed canonical Template Builder leaves; migration coverage, reference repair, publication review, cleanup authority, production editor integration, persistence, collaboration, renderer output, performance readiness, and broader Core truth remain excluded.",
    lifecycle: "active",
    repositoryRefs: leafPaths.map(projectControlRef),
  },
] as const;

const evidenceSummaries = [
  "The sandbox package declares @flowdoc/vnext-core through its public package boundary; this does not establish production editor readiness or wider product integration.",
  "Focused boundary checks verify bounded packet-only mutation responses and browser-local cache/store application; the derived runtime state is not canonical storage, durable persistence, collaboration, or renderer output.",
  "Focused boundary checks verify bounded in-memory plain-text history and live-layout stale summaries; they do not establish durable history, exact layout, renderer output, storage, or export parity.",
  "The focused synthetic fixture composes exactly 72 ordered sections and 936 runtime nodes with bounded window, shell, stack, lazy-detail, and anchor facts; it is not wall-clock performance, real-document scaling, DOM recycling, or production-renderer evidence.",
  "Focused scheduler checks reject stale, revision-mismatched, draft-protected, IME-protected, blocked, and stable candidates before apply; these are correctness guards, not timing or performance evidence.",
  "Focused structural packet checks verify packet-v1 construction and validation as local non-public, non-durable foundation transport; they do not establish a public API, storage, history, replay, collaboration protocol, or mutable projection authority.",
  "The Core boundary advertises node-linked diagnostics navigation as wired through the node-aware selection path; this anchor alone does not establish behavior for document-level, missing, or unknown node IDs or provide persistent navigation authority.",
  "The focused decision gate documents a recommendation for hybrid managed cards with a hardened contenteditable island, rejects full-document contenteditable as the v1 primary input, and explicitly records no production contenteditable implementation or package/document schema change; it does not verify runtime draft behavior, canonical typing truth, persistence, or collaboration.",
  "Focused boundary checks verify that IME composition blocks commands, range changes, and plain/rich commit while local planning remains guarded; they do not establish language-complete IME behavior or canonical mutation during composition.",
  "The hardening module validates supplied browser-local root, target, text, selection, nested-endpoint, and composition facts; this anchor does not establish whether the surface is hidden/fallback or active, and it provides no persistence or renderer authority.",
  "The rich-inline helper validates replacement children, applies them to the target text block, and creates an undoable history-intent record for successful commits; it does not verify freshness-validated plan acceptance, undo/redo child replay, durable persistence, collaboration merge, renderer output, or export parity.",
  "The session module creates JSON-safe rich-inline replay-patch validation and history-ready facts, including history counts, before/after child snapshots, and field keys; it explicitly reports no storage record/write or replay execution and creates no package snapshot or persisted session record.",
] as const;

const expectedEvidence = evidenceIds.map((id, index) => ({
  kind: "evidence",
  id,
  nodeIds: ["template-builder"],
  repositoryId: "repo-core",
  commit: coreEvidenceCommit,
  pathOrContractId: evidenceAnchors[index],
  verificationSummary: evidenceSummaries[index],
  verifiedAt,
}));

const protectedBlobs = {
  "data/nodes/core-route.json": "22411fed01af483d1de463b3a9b047a60d6a766c",
  "data/nodes/text-engine.json": "b6cee8d0c2f3528f32bce1e1fe88600e3b87a630",
  "data/documents/core-route-migration-review.json": "33ef0803b171c173f49852256b5045fc4039fe02",
  "data/documents/core-route-overview.json": "0c648820dfcb635cf7a83981c884a229a373ab20",
  "data/documents/core-route-retained-contracts.json": "caf6ea003522ce34f49ff6b96995b37734bbf237",
  "data/documents/text-engine-adapter-provider.json": "0f36ded7433afbbadf4d580b40ca436ddad0aad0",
  "data/documents/text-engine-overview.json": "be7a32fb4c7f514ac5073ed920a3c15413f1f043",
  "data/documents/text-engine-runtime-identity-evidence.json": "21d05d1fba49f5b9d995e0be6a3abcc883374a27",
  "data/documents/text-engine-rustybuzz-shaping.json": "c073b3730bdf54f0c63f37a0122ff1c1a47a6aad",
  "data/documents/text-engine-wasm-toolchain-artifacts.json": "93ff60ba17c29b74a162f357c75811e40ff515b2",
  "data/evidence/core-route-artifact-contracts.json": "6c5d1cc482e1a9c8656dd958bdc6fa73d31f8e24",
  "data/evidence/core-route-cleanup.json": "6ae8cb5109e9946be2005a9dabb24251b5ead877",
  "data/evidence/core-route-generation-contracts.json": "1c5b5111f76c44380039eb80e81a6bc5a1dd88ad",
  "data/evidence/core-route-public-boundary.json": "622d2a1fa8f47b8e5f587eea430c7c1f84ae9528",
  "data/evidence/text-engine-adapter-contract.json": "55fa7b6dc244a7b8ac5c2e17dfd861a8dad51d25",
  "data/evidence/text-engine-provider-bridge.json": "612fb05a7ada86c0fc565ef823d95b5b33b7bacf",
  "data/evidence/text-engine-runtime-identity-contract.json": "7a4a630407cef17c406fe52f46f6a26dc9f8843f",
  "data/evidence/text-engine-runtime-identity-digest.json": "0196e313bb298a3f855ec05746a33519b3ed67a4",
  "data/evidence/text-engine-rustybuzz-line-wrap.json": "3d03723990680d7215d041893322cb4e62c27c64",
  "data/evidence/text-engine-rustybuzz-mapping-corpus.json": "12498a2fc5b33955dcebe3c56f2b7d56d5efd231",
  "data/evidence/text-engine-wasm-artifact-digest.json": "b45b1c0178cf5e54137d35e105a5678e0920f762",
  "data/evidence/text-engine-wasm-toolchain-gates.json": "77a8a23b4434867638ebb1ce55ecfdc81aa89e43",
  "docs/versions/V0_1_0a_1/core/core-route/MIGRATION_REVIEW.md": "3c8bde128515047add849fa460c1d38520b293bf",
  "docs/versions/V0_1_0a_1/core/core-route/OVERVIEW.md": "2116c5b00b9e52d5d3ac66849d3e66ddce382832",
  "docs/versions/V0_1_0a_1/core/core-route/route-ownership-and-retained-contracts.md": "f7ebaa81a912e20c6254a8c54344671cb7297b8b",
  "docs/versions/V0_1_0a_1/core/text-engine/OVERVIEW.md": "efb26b60cee0ef231221371f0d7a37b42bfe4398",
  "docs/versions/V0_1_0a_1/core/text-engine/adapter-and-provider.md": "11d8fca99265993ba5f8cf0505903026fb33310e",
  "docs/versions/V0_1_0a_1/core/text-engine/runtime-identity-and-evidence.md": "2548592edd80b3f480928b129e86ca260904a3af",
  "docs/versions/V0_1_0a_1/core/text-engine/rustybuzz-shaping.md": "f7028107cfddd4145d5a5e84bbf7afd2149ad6a1",
  "docs/versions/V0_1_0a_1/core/text-engine/wasm-toolchain-and-artifacts.md": "bc55024985dc1f29086d35a7569fa1ec24bb38ea",
  "migrations/V0_1_0a_1/core/families/core-route/coverage.json": "2d637dcc3c35576c61260e56c0e2a0145cd79ab7",
} as const;

type JsonRecord = Record<string, unknown>;

async function readJson(relativePath: string): Promise<JsonRecord> {
  return JSON.parse(await readFile(join(root, relativePath), "utf8")) as JsonRecord;
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

function gitBlobId(bytes: Uint8Array): string {
  return createHash("sha1")
    .update(`blob ${bytes.byteLength}\0`)
    .update(bytes)
    .digest("hex");
}

function markdownSection(document: string, heading: string): string {
  const start = document.indexOf(`${heading}\n`);
  if (start === -1) throw new Error(`Missing section: ${heading}`);
  const bodyStart = start + heading.length + 1;
  const next = document.indexOf("\n## ", bodyStart);
  return document.slice(bodyStart, next === -1 ? document.length : next);
}

function requiredAt<T>(values: readonly T[], index: number, label: string): T {
  const value = values[index];
  if (value === undefined) throw new Error(`Missing ${label} at index ${index}`);
  return value;
}

function expectExactLeafContract(
  contract: typeof leafContracts[number],
  document: string,
): void {
  const responsibility = markdownSection(document, "## Responsibility Boundary");
  const normalizedResponsibility = responsibility.replace(/\s+/gu, " ").trim();
  expect(normalizedResponsibility).toContain(contract.ownership);
  expect(normalizedResponsibility).toContain(contract.dependency);
  const crossReferences = [...markdownSection(document, "## Canonical Cross-references")
    .matchAll(/\]\(([^)]+\.md)\)/g)]
    .map((match) => match[1]);
  expect(crossReferences).toEqual(contract.crossReferences);
  for (const transfer of authorityTransferClaims) expect(document).not.toMatch(transfer);
}

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

  it.each([
    [evidenceIds[6], evidenceSummaries[6]],
    [evidenceIds[9], evidenceSummaries[9]],
    [evidenceIds[11], evidenceSummaries[11]],
  ] as const)("binds %s to only the facts established by its fixed anchor", async (id, summary) => {
    const evidence = await readJson(
      `data/evidence/${id.replace("evidence-template-builder-", "template-builder-")}.json`,
    );
    expect(evidence.verificationSummary).toBe(summary);
  });

  it("registers exact bounded family truth without coverage, cleanup, or promotion", async () => {
    const [
      orientation,
      overview,
      node,
      core,
      coreRepository,
      projectControlOverview,
      documentMap,
      index,
      testSource,
      ...leaves
    ] = await Promise.all([
      readJson("migrations/V0_1_0a_1/core/wave-a-orientation.json"),
      readFile(join(root, overviewPath), "utf8"),
      readJson("data/nodes/template-builder.json"),
      readJson("data/nodes/core.json"),
      readJson("data/repositories/core.json"),
      readFile(join(root, "docs/domains/project-control.md"), "utf8"),
      readFile(join(root, "docs/versions/V0_1_0a_1/core/DOCUMENT_MAP.md"), "utf8"),
      readJson("generated/project-index.json"),
      readFile(new URL(import.meta.url), "utf8"),
      ...leafPaths.map((path) => readFile(join(root, path), "utf8")),
    ]);
    const documents = await Promise.all(documentIds.map((id) =>
      readJson(`data/documents/${id.replace("doc-template-builder-", "template-builder-")}.json`)
    ));
    const evidence = await Promise.all(evidenceIds.map((id) =>
      readJson(`data/evidence/${id.replace("evidence-template-builder-", "template-builder-")}.json`)
    ));

    expect(node).toEqual({
      kind: "node",
      id: "template-builder",
      title: "Template Builder",
      parentId: "core",
      summary: expectedNodeSummary,
      truthState: "unknown",
      order: 30,
      documentIds: [...documentIds],
      evidenceIds: [...evidenceIds],
      repositoryIds: ["repo-core", "repo-project-control"],
    });
    expect(documents).toEqual(expectedDocuments);
    expect(evidence).toEqual(expectedEvidence);
    expect(core).toMatchObject({
      id: "core",
      truthState: "unknown",
      summary: expectedCoreSummary,
      documentIds: ["doc-core-v0-1-0a-1-document-map"],
      evidenceIds: [],
    });
    expect(coreRepository).toMatchObject({
      id: "repo-core",
      ownershipSummary: expectedCoreRepositorySummary,
    });

    const headings = overview.match(/^## .+$/gm) ?? [];
    expect(headings).toEqual([
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
    expect(overview.match(/^\|/gm) ?? []).toEqual([]);
    expect(overview).toContain(expectedNodeSummary);
    expect(overview.replace(/\s+/gu, " ")).toContain(
      "public package boundary → accepted mutation packets → browser-local cache/store facts → structural and viewport consumers → guarded local draft → accepted rich-inline commit/replay → JSON-safe replay-patch validation/history-ready facts",
    );
    for (const [index, path] of leafPaths.entries()) {
      expect(overview).toContain(
        `flowdoc-project-control@${projectControlCandidateCommit}:${path} (Git blob ${leafBlobs[index]})`,
      );
    }
    expect(projectControlOverview).toContain(expectedCurrentScopeSummary);
    expect(projectControlOverview).not.toMatch(/Template\s+Builder[^.]*unregistered/iu);
    expect(documentMap).toContain(expectedCurrentScopeSummary);
    const mapLinks = [...documentMap.matchAll(
      /\[Template Builder[^\]]*\]\((template-builder\/[^)]+\.md)\)/g,
    )].map((match) => match[1]);
    expect(mapLinks).toEqual([
      "template-builder/OVERVIEW.md",
      "template-builder/sandbox-runtime-and-store.md",
      "template-builder/viewport-and-virtualized-rendering.md",
      "template-builder/structural-runtime-and-navigation.md",
      "template-builder/wysiwyg-draft-input-and-guards.md",
      "template-builder/rich-inline-commit-and-session-lifecycle.md",
    ]);

    expect(await exists("migrations/V0_1_0a_1/core/families/template-builder/coverage.json"))
      .toBe(false);
    expect((node.evidenceIds as string[]).some((id) => /coverage|cleanup/iu.test(id))).toBe(false);
    expect((await readOptionalDirectory("data/work"))
      .filter((name) => /^template-builder.*\.json$/u.test(name))).toEqual([]);

    const indexNodes = index.nodes as JsonRecord[];
    const indexDocuments = index.documents as JsonRecord[];
    const indexEvidence = index.evidence as JsonRecord[];
    expect(indexNodes).toContainEqual({ ...node, childIds: [], workIds: [] });
    expect(indexNodes).toContainEqual(expect.objectContaining({
      id: "core",
      truthState: "unknown",
      summary: expectedCoreSummary,
      childIds: ["core-route", "text-engine", "template-builder"],
    }));
    for (const document of documents) {
      const content = document.path === overviewPath
        ? overview
        : leaves[leafPaths.indexOf(document.path as string)];
      expect(indexDocuments).toContainEqual({ ...document, content });
    }
    for (const item of evidence) expect(indexEvidence).toContainEqual(item);
    expect(indexDocuments
      .filter((document) => (document.nodeIds as string[]).includes("template-builder"))
      .map((document) => document.id)).toEqual([
      "doc-template-builder-overview",
      "doc-template-builder-rich-inline-session-lifecycle",
      "doc-template-builder-sandbox-runtime-store",
      "doc-template-builder-structural-runtime-navigation",
      "doc-template-builder-viewport-virtualized-rendering",
      "doc-template-builder-wysiwyg-draft-guards",
    ]);
    expect(indexEvidence
      .filter((item) => (item.nodeIds as string[]).includes("template-builder"))
      .map((item) => item.id)).toEqual([
      "evidence-template-builder-contenteditable-range-hardening",
      "evidence-template-builder-plain-text-history-live-layout",
      "evidence-template-builder-rich-inline-commit-replay",
      "evidence-template-builder-runtime-store-packet-application",
      "evidence-template-builder-sandbox-package-boundary",
      "evidence-template-builder-session-live-exact-boundary",
      "evidence-template-builder-structural-diagnostics-navigation",
      "evidence-template-builder-structural-packet-projection",
      "evidence-template-builder-viewport-large-document-shape",
      "evidence-template-builder-viewport-scheduler-stale-guards",
      "evidence-template-builder-wysiwyg-ime-planning-guards",
      "evidence-template-builder-wysiwyg-local-draft-eligibility",
    ]);

    const family = (orientation.families as Array<{
      familyId: string;
      subgroups: Array<{ sourcePaths: string[] }>;
    }>).find(({ familyId }) => familyId === "template-builder");
    const formerSources = family!.subgroups.flatMap(({ sourcePaths }) => sourcePaths);
    const registeredContent = [
      overview,
      ...leaves,
      testSource,
      JSON.stringify(node),
      ...documents.map((document) => JSON.stringify(document)),
      ...evidence.map((item) => JSON.stringify(item)),
      documentMap,
      JSON.stringify(index),
    ].join("\n");
    for (const formerSource of formerSources) expect(registeredContent).not.toContain(formerSource);
    expect(registeredContent).not.toMatch(/flowdoc-(?:vnext-core|project-control)@(?:main|master|develop|HEAD):/iu);
    const publishedContent = [
      overview,
      ...leaves,
      JSON.stringify(node),
      ...documents.map((document) => JSON.stringify(document)),
      ...evidence.map((item) => JSON.stringify(item)),
      documentMap,
    ].join("\n");
    expect(publishedContent).not.toMatch(/(?:[A-Za-z]:\\|file:\/\/|\/(?:Users|home|tmp)\/)/u);

    for (const [path, blob] of Object.entries(protectedBlobs)) {
      expect(gitBlobId(await readFile(join(root, path))), path).toBe(blob);
    }
  });

  it("derives the exact five-leaf ownership, dependency, and cross-reference partition", async () => {
    const leaves = await Promise.all(leafPaths.map((path) => readFile(join(root, path), "utf8")));

    for (const contract of leafContracts) {
      expectExactLeafContract(
        contract,
        requiredAt(leaves, leafNames.indexOf(contract.leafName), "Template Builder leaf"),
      );
    }
  });

  it("mutation: rejects authority transfers between all five leaves", async () => {
    const leaves = await Promise.all(leafPaths.map((path) => readFile(join(root, path), "utf8")));
    const mutations = [
      "sandbox owns viewport policy",
      "structural owns active draft input",
      "viewport owns structural packet application",
      "WYSIWYG owns rich-inline commit",
      "rich inline owns sandbox cache/store application",
    ] as const;
    const legitimateNegatives = [
      "sandbox does not own viewport policy",
      "structural does not own active draft input",
      "viewport does not own structural packet application",
      "WYSIWYG does not own rich-inline commit",
      "rich inline does not own sandbox cache/store application",
    ] as const;

    for (const [index, mutation] of mutations.entries()) {
      const contract = requiredAt(leafContracts, index, "leaf contract");
      const leaf = requiredAt(leaves, index, "Template Builder leaf");
      const legitimateNegative = requiredAt(legitimateNegatives, index, "negative control");
      expect(() => expectExactLeafContract(contract, `${leaf}\n${mutation}`)).toThrow();
      expectExactLeafContract(contract, `${leaf}\n${legitimateNegative}`);
    }
  });
});
