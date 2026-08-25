import { createHash } from "node:crypto";
import { access, readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const root = join(fileURLToPath(new URL("..", import.meta.url)));
const overviewPath = "docs/versions/V0_1_0a_1/core/live-draft/OVERVIEW.md";
const frozenCommit = "76a2f2311a898e781f53773390d47b05812911e4";
const coreEvidenceCommit = "c503a45c03e0ce3b7a6efba2b029ca842017faa0";
const projectControlCandidateCommit = "25ec577195edd71ec14930d06e24cdc033d0077b";
const inventoryDigest = "36f54f2302d51895615a81767c92c0ccba18563703471c33169b3816b63e5f5b";
const subgroupCounts = [3, 16, 10, 10, 20, 5] as const;
const subgroupIds = [
  "product-readiness-and-renderer-boundaries",
  "geometry-and-scene-projection",
  "persistent-flow-and-range-foundations",
  "root-and-v3-transition-contracts",
  "source-authority-and-commit-transaction",
  "corrective-evidence",
] as const;
const leafNames = subgroupIds.map((id) => `${id}.md`);
const leafPaths = leafNames.map((name) =>
  `docs/versions/V0_1_0a_1/core/live-draft/${name}`
);
const leafBlobs = [
  "a01d6d0b1be3b18a25d76218c47506f6eb14899c",
  "4d47c076801d18298ce026da495d6776ccd05eb6",
  "29dd4da1c5fdfb446e74128069f87b9e3c019868",
  "8192225c2adbd7c4fa2a7608a4547c0c560f4e8b",
  "b70db07adb04b30254516590f66014ebcd803c80",
  "bcb8d88aaa15f3ccdb86295fbb76c2757a8412e3",
] as const;
const expectedDependencies = [
  [],
  [],
  ["live-draft/geometry-and-scene-projection"],
  [
    "live-draft/geometry-and-scene-projection",
    "live-draft/persistent-flow-and-range-foundations",
  ],
  ["live-draft/root-and-v3-transition-contracts"],
  ["live-draft/root-and-v3-transition-contracts"],
] as const;
const commonHeadings = [
  "## Authority and Scope",
  "## Responsibility Boundary",
  "## State and Failure Model",
  "## Current Verified State",
  "## Known Limits and Unknowns",
  "## Historical Design Notes",
  "## Canonical Cross-references",
  "## Evidence Anchors",
] as const;
const requiredLeafSections = [
  [
    "## Cross-repository Ownership",
    "## Renderer Consumption Without Measurement or Relayout",
    "## Selected Parity and Activation Limits",
  ],
  [
    "## Layout Units and Spatial Wrapping",
    "## Authored-box and Inline-image Geometry",
    "## Source Segments, Forced Breaks, and Display-list Projection",
    "## Producer-owned Geometry Facts",
  ],
  [
    "## Flow-tree Structure",
    "## Contextual Ranges",
    "## Semantic Checkpoints",
    "## Affected-line Planning",
    "## Retained Ranges",
    "## Update Reuse",
    "## Oracle-independent Execution",
  ],
  [
    "## 5A Retained Root",
    "## 5B Root V2 Admission",
    "## Scene and Delivery",
    "## Work Policy",
    "## Source Envelope",
    "## V3 Corrective Scope",
    "## Stop Boundaries",
  ],
  [
    "## Producer Invocation",
    "## Source Topology",
    "## Fallback Target",
    "## Evidence and Work Ownership",
    "## Source Authority Internals",
    "## Source-commit Transaction Seam",
    "## Approved Amendment Precedence",
    "## Bilingual Terminology",
  ],
  [
    "## Collision Repair",
    "## Delivery Repair",
    "## Source-envelope Verification",
    "## Final Verification",
    "## Final Scoped Verdict",
    "## Residual-risk Boundaries",
  ],
] as const;
const expectedNodeSummary =
  "Live Draft documentation synthesis is complete across six bounded leaves and one family overview; family truth remains unknown pending migration coverage, reference repair, publication review, and separately authorized cleanup, while product activation, Editor and Backend integration, browser Worker adoption, renderer and export parity, and performance readiness remain unknown.";
const dependencyChain =
  "product ownership and renderer no-relayout boundary → geometry facts and scene/display-list projection → persistent flow, ranges, affected lines, and oracle separation → 5A/5B Root V2 and scoped V3 transition contracts → 5B-2 source authority and source-commit transaction → bounded corrective evidence and residual-risk history";
const authorityTransferClaims = [
  /Product leaf owns geometry producers/iu,
  /Geometry leaf owns retained-root policy/iu,
  /Persistent leaf owns V3 policy/iu,
  /Root leaf owns 5B-2 transaction internals/iu,
  /Source-authority leaf owns corrective verdict authority/iu,
  /Corrective leaf owns normative implementation authority/iu,
] as const;
const verifiedAt = "2026-08-21T00:00:00.000Z";
const documentIds = [
  "doc-live-draft-product-readiness-renderer-boundaries",
  "doc-live-draft-geometry-scene-projection",
  "doc-live-draft-persistent-flow-range-foundations",
  "doc-live-draft-root-v3-transition-contracts",
  "doc-live-draft-source-authority-commit-transaction",
  "doc-live-draft-corrective-evidence",
  "doc-live-draft-overview",
] as const;
const evidenceIds = [
  "evidence-live-draft-renderer-no-relayout",
  "evidence-live-draft-public-exports-nonactivation",
  "evidence-live-draft-geometry-producer-projection",
  "evidence-live-draft-phase-3-4-gates",
  "evidence-live-draft-persistent-structural-reuse",
  "evidence-live-draft-oracle-execution-separation",
  "evidence-live-draft-root-scene-work-policy",
  "evidence-live-draft-root-calibration-boundary",
  "evidence-live-draft-source-authority-transaction-internals",
  "evidence-live-draft-source-authority-amendment-tests",
  "evidence-live-draft-corrective-adversarial-scene",
  "evidence-live-draft-corrective-scoped-review-ranges",
] as const;
const evidenceAnchors = [
  "src/renderer/textFlowDisplayListV1.ts",
  "src/index.ts",
  "src/layout/textBlockPersistentFlowContractV1.ts",
  "tests/liveDraftMr1InlineImageGeometry4b.test.ts",
  "src/layout/textBlockPersistentFlowTreeV1.ts",
  "src/layout/textBlockPersistentLayoutLineTreeV1.ts",
  "src/layout/textBlockUnifiedLayoutRootV2.ts",
  "tests/textBlockUnifiedLayoutWorkCalibrationV3.test.ts",
  "src/layout/textBlockUnifiedLayoutSourceCommitTransactionInternalsV1.ts",
  "tests/textBlockUnifiedLayoutSourceCommitTransactionV1.test.ts",
  "tests/textBlockUnifiedLayoutAdversarialV2.test.ts",
  "tests/textBlockSceneDeliveryV2.test.ts",
] as const;
const evidenceSummaries = [
  "The display-list projector converts complete accepted pagination into deterministic text-line commands without measuring text or relaying out fragments; this does not establish product activation, renderer or export parity, cross-runtime pixel parity, Editor or Backend binding, browser Worker adoption, or performance readiness.",
  "The public Core surface exports the bounded display-list and layout contracts without activating a browser Worker or binding an Editor or Backend consumer; this does not establish product activation, renderer or export parity, cross-runtime pixel parity, or performance readiness.",
  "The persistent-flow contract defines producer-owned layout geometry and source facts for downstream projection; this does not establish production binding, retained-root policy, product activation, renderer or export parity, cross-runtime pixel parity, or performance readiness.",
  "The focused Phase 3/4 geometry gates verify their named spatial, authored-box, and inline-image record boundaries, with the inline-image suite as the primary anchor; this does not establish product activation, production binding, renderer or export parity, cross-runtime pixel parity, or performance readiness.",
  "The persistent flow-tree module creates and inspects immutable complete trees and exposes their bounded structural facts; this primary anchor does not establish path-copy update reuse, latency, heap, frame, interaction, product activation, or performance readiness.",
  "The persistent line-tree module creates and inspects persistent line trees and their bounded stored facts; this primary anchor does not establish oracle-independent incremental acceptance, make a complete oracle a production execution input, or establish per-keystroke performance, product activation, or performance readiness.",
  "Root V2 creates the bounded root and scene and records complete-build work for its named transition; its `deliveryPlan` is `null`, and this primary anchor does not establish delivery, separate incremental/fallback/oracle ledgers, later 5B-2 authority, product integration, Editor or Backend binding, browser Worker adoption, or performance readiness.",
  "The focused calibration suite verifies scoped V3 work rows, exact limits, and inactive future capability rows; this does not activate 5B-2 or 5B-3 capability, product integration, Editor or Backend binding, browser Worker adoption, or performance readiness.",
  "The private Source-commit internals prepare and apply the exact identity-bound Source-stage transaction plans; this does not establish a generic transaction facility, public API, product activation, Editor or Backend binding, browser Worker adoption, or performance readiness.",
  "The focused Source-commit suite verifies the bounded 2026-08-11 amendment-backed transaction seam and exact identity rules; this does not turn earlier plans or bilingual companions into stronger authority or establish generic integration, product activation, Editor or Backend binding, browser Worker adoption, or performance readiness.",
  "The adversarial suite verifies exact-identity rejection when distinct Scene or Root candidates share a fingerprint; this scoped collision fact does not establish generic fingerprint authority, normative family policy, product activation, or performance readiness.",
  "The scene-delivery suite verifies current accessor-safe scene delivery for its named inputs; this primary anchor does not establish a historical report-range comparison, outside-range review authority, a normative implementation contract, product activation, Editor or Backend binding, browser Worker adoption, or performance readiness.",
] as const;
const expectedCoreSummary =
  "Broader Core remains unknown; the bounded core-route child is closed with recorded cleanup Evidence; the Text Engine documentation set is synthesized across four bounded leaves and one family overview; Template Builder documentation is synthesized across five bounded leaves and one family overview; migration coverage, reference repair, publication review, and family promotion remain incomplete for both documentation families. Live Draft documentation is synthesized across six bounded leaves and one family overview; its migration coverage, reference repair, publication review, and family promotion remain incomplete. Text Block documentation is synthesized across three bounded leaves and one family overview; its migration coverage, reference repair, publication review, and family promotion remain incomplete, and family truth remains unknown.";
const expectedCoreRepositorySummary =
  "Broader Core remains unknown; the bounded core-route child is closed with recorded cleanup Evidence; Text Engine and Template Builder documentation are synthesized but their migration, publication, and family-promotion work remains incomplete. Live Draft documentation is synthesized across six bounded leaves and one family overview, while its migration, publication, and family-promotion work remains incomplete. Text Block documentation is synthesized across three bounded leaves and one family overview, while its migration, publication, and family-promotion work remains incomplete and family truth remains unknown.";
const expectedCurrentScopeSummary =
  "Live Draft documentation synthesis is complete across six bounded leaves and one family overview; the Node remains unknown, and no migration coverage, source cleanup, product activation, Editor or Backend integration, browser Worker adoption, renderer or export parity, or performance authority is created.";

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
    title: "Live Draft Product Readiness and Renderer Boundaries",
    path: leafPaths[0],
    nodeIds: ["live-draft"],
    role: "contract",
    authority: "Canonical contract limited to verified cross-repository responsibility, Core-owned layout facts, public nonactivation, and renderer consumption without text measurement or fragment relayout; product activation, Editor or Backend binding, browser Worker adoption, renderer or export parity, cross-runtime pixel parity, performance readiness, and family-wide authority remain excluded.",
    lifecycle: "active",
    repositoryRefs: evidenceAnchors.slice(0, 2).map(coreRef),
  },
  {
    kind: "document",
    id: documentIds[1],
    title: "Live Draft Geometry and Scene Projection",
    path: leafPaths[1],
    nodeIds: ["live-draft"],
    role: "contract",
    authority: "Canonical contract limited to verified producer-owned geometry, layout units, spatial wrapping, authored-box and inline-image facts, source segments, forced breaks, and deterministic display-list projection; production binding, retained-root policy, product activation, renderer or export parity, cross-runtime pixel parity, performance readiness, and family-wide authority remain excluded.",
    lifecycle: "active",
    repositoryRefs: evidenceAnchors.slice(2, 4).map(coreRef),
  },
  {
    kind: "document",
    id: documentIds[2],
    title: "Live Draft Persistent Flow and Range Foundations",
    path: leafPaths[2],
    nodeIds: ["live-draft"],
    role: "contract",
    authority: "Canonical contract limited to verified persistent flow trees, contextual and retained ranges, semantic checkpoints, affected-line planning, structural reuse, and oracle-independent execution; product activation, complete-oracle hot-path authority, per-keystroke performance, publication, Editor or Backend binding, and family-wide authority remain excluded.",
    lifecycle: "active",
    repositoryRefs: evidenceAnchors.slice(4, 6).map(coreRef),
  },
  {
    kind: "document",
    id: documentIds[3],
    title: "Live Draft Root and V3 Transition Contracts",
    path: leafPaths[3],
    nodeIds: ["live-draft"],
    role: "contract",
    authority: "Canonical contract limited to verified 5A retained-root history, bounded Root V2 admission, scene and delivery, exact work policy, source-envelope checks, and scoped V3 transition rows; later 5B-2 transaction authority, inactive capability activation, product integration, Editor or Backend binding, browser Worker adoption, performance readiness, and family-wide authority remain excluded.",
    lifecycle: "active",
    repositoryRefs: evidenceAnchors.slice(6, 8).map(coreRef),
  },
  {
    kind: "document",
    id: documentIds[4],
    title: "Live Draft Source Authority and Commit Transaction",
    path: leafPaths[4],
    nodeIds: ["live-draft"],
    role: "contract",
    authority: "Canonical contract limited to verified private-Core producer invocation, source topology, evidence and work ownership, fallback targets, exact source authority, and the named Source-commit transaction seam under bounded amendment precedence; generic transaction authority, public API, product activation, Editor or Backend binding, browser Worker adoption, performance readiness, and family-wide authority remain excluded.",
    lifecycle: "active",
    repositoryRefs: evidenceAnchors.slice(8, 10).map(coreRef),
  },
  {
    kind: "document",
    id: documentIds[5],
    title: "Live Draft Corrective Evidence",
    path: leafPaths[5],
    nodeIds: ["live-draft"],
    role: "contract",
    authority: "Canonical evidence contract limited to five scoped collision, delivery, source-envelope, verification, and review records with their exact historical ranges and residual risks; normative implementation authority, outside-range promotion, product activation, Editor or Backend binding, browser Worker adoption, performance readiness, and family-wide authority remain excluded.",
    lifecycle: "active",
    repositoryRefs: evidenceAnchors.slice(10, 12).map(coreRef),
  },
  {
    kind: "document",
    id: documentIds[6],
    title: "Live Draft Overview",
    path: overviewPath,
    nodeIds: ["live-draft"],
    role: "current-state",
    authority: "Current-state family overview limited to ownership relationships and evidence flow among the six reviewed canonical Live Draft leaves; migration coverage, reference repair, publication review, cleanup authority, product activation, Editor or Backend integration, browser Worker adoption, renderer or export parity, performance readiness, and broader Core truth remain excluded.",
    lifecycle: "active",
    repositoryRefs: leafPaths.map(projectControlRef),
  },
] as const;
const expectedEvidence = evidenceIds.map((id, index) => ({
  kind: "evidence",
  id,
  nodeIds: ["live-draft"],
  repositoryId: "repo-core",
  commit: coreEvidenceCommit,
  pathOrContractId: evidenceAnchors[index],
  verificationSummary: evidenceSummaries[index],
  verifiedAt,
}));
const protectedBlobs = {
  "data/documents/core-route-migration-review.json": "33ef0803b171c173f49852256b5045fc4039fe02",
  "data/documents/core-route-overview.json": "0c648820dfcb635cf7a83981c884a229a373ab20",
  "data/documents/core-route-retained-contracts.json": "caf6ea003522ce34f49ff6b96995b37734bbf237",
  "data/documents/template-builder-overview.json": "19d63383c0283905da4da3a22e1b03f0e07d1360",
  "data/documents/template-builder-rich-inline-session-lifecycle.json": "7d20386d53ad3fd1a4b3215c30412e18fea39e3e",
  "data/documents/template-builder-sandbox-runtime-store.json": "949470749bcb20d26ed5bcf8ccd53bf157eb78d6",
  "data/documents/template-builder-structural-runtime-navigation.json": "09944dd61dee3b4623d5716932164f23289471c3",
  "data/documents/template-builder-viewport-virtualized-rendering.json": "742a681c4b2f06b13cb462c3751a85e5a7ba4c82",
  "data/documents/template-builder-wysiwyg-draft-guards.json": "07f87c8ca721982b3417f29189e11401a5c84462",
  "data/documents/text-engine-adapter-provider.json": "0f36ded7433afbbadf4d580b40ca436ddad0aad0",
  "data/documents/text-engine-overview.json": "be7a32fb4c7f514ac5073ed920a3c15413f1f043",
  "data/documents/text-engine-runtime-identity-evidence.json": "21d05d1fba49f5b9d995e0be6a3abcc883374a27",
  "data/documents/text-engine-rustybuzz-shaping.json": "c073b3730bdf54f0c63f37a0122ff1c1a47a6aad",
  "data/documents/text-engine-wasm-toolchain-artifacts.json": "93ff60ba17c29b74a162f357c75811e40ff515b2",
  "data/evidence/core-route-artifact-contracts.json": "6c5d1cc482e1a9c8656dd958bdc6fa73d31f8e24",
  "data/evidence/core-route-cleanup.json": "f09f6b0d27c66b8c678858f1d503cfa197523148",
  "data/evidence/core-route-generation-contracts.json": "1c5b5111f76c44380039eb80e81a6bc5a1dd88ad",
  "data/evidence/core-route-public-boundary.json": "622d2a1fa8f47b8e5f587eea430c7c1f84ae9528",
  "data/evidence/template-builder-contenteditable-range-hardening.json": "e84210852d400e87caf8cdf1eb61f2000b457843",
  "data/evidence/template-builder-plain-text-history-live-layout.json": "f589b0933f7fae334b79532a204561259bd6f14d",
  "data/evidence/template-builder-rich-inline-commit-replay.json": "5bf055cd6833c596bdd794b03c75010e9a26fbc6",
  "data/evidence/template-builder-runtime-store-packet-application.json": "fe51787a012f8d13755dd23a2612dd188d22f397",
  "data/evidence/template-builder-sandbox-package-boundary.json": "52e13e189ae939bccef5ab317a4ea5d33fadae51",
  "data/evidence/template-builder-session-live-exact-boundary.json": "c532ffcc119f3a80a4022e83d8e702d7902ca9a8",
  "data/evidence/template-builder-structural-diagnostics-navigation.json": "f33fa735bb2765d208e68b315cfd5543c7d003bb",
  "data/evidence/template-builder-structural-packet-projection.json": "20d292f76a10796ccc4d99dcfeb9f2c487730e0c",
  "data/evidence/template-builder-viewport-large-document-shape.json": "140196202e8df606b248d5d8b14910eed9822685",
  "data/evidence/template-builder-viewport-scheduler-stale-guards.json": "27fffda219483cddbfc2dd8a5265e76dc70416f7",
  "data/evidence/template-builder-wysiwyg-ime-planning-guards.json": "93f13487b6f63b5aa4b450a12633af8a00a238f9",
  "data/evidence/template-builder-wysiwyg-local-draft-eligibility.json": "91807bf289883cc8388a6866234645a669b9ba17",
  "data/evidence/text-engine-adapter-contract.json": "55fa7b6dc244a7b8ac5c2e17dfd861a8dad51d25",
  "data/evidence/text-engine-provider-bridge.json": "612fb05a7ada86c0fc565ef823d95b5b33b7bacf",
  "data/evidence/text-engine-runtime-identity-contract.json": "7a4a630407cef17c406fe52f46f6a26dc9f8843f",
  "data/evidence/text-engine-runtime-identity-digest.json": "0196e313bb298a3f855ec05746a33519b3ed67a4",
  "data/evidence/text-engine-rustybuzz-line-wrap.json": "3d03723990680d7215d041893322cb4e62c27c64",
  "data/evidence/text-engine-rustybuzz-mapping-corpus.json": "12498a2fc5b33955dcebe3c56f2b7d56d5efd231",
  "data/evidence/text-engine-wasm-artifact-digest.json": "b45b1c0178cf5e54137d35e105a5678e0920f762",
  "data/evidence/text-engine-wasm-toolchain-gates.json": "77a8a23b4434867638ebb1ce55ecfdc81aa89e43",
  "data/nodes/core-route.json": "22411fed01af483d1de463b3a9b047a60d6a766c",
  "data/nodes/template-builder.json": "7f95f4c223779d7862f3e5cdd072ebc49b058c2e",
  "data/nodes/text-engine.json": "b6cee8d0c2f3528f32bce1e1fe88600e3b87a630",
  "docs/versions/V0_1_0a_1/core/core-route/MIGRATION_REVIEW.md": "23989894f91a60319583ae7a3bf95b637682cd11",
  "docs/versions/V0_1_0a_1/core/core-route/OVERVIEW.md": "89f34911ede860030ff5b62b6b0f6ce99ba206ea",
  "docs/versions/V0_1_0a_1/core/core-route/route-ownership-and-retained-contracts.md": "27ae0461cd3990d8a385bd4209e6b8dc1de03689",
  "docs/versions/V0_1_0a_1/core/template-builder/OVERVIEW.md": "5d21e6681071c2935c5e5fea94bc18b52941b75c",
  "docs/versions/V0_1_0a_1/core/template-builder/rich-inline-commit-and-session-lifecycle.md": "da642fd3d993d1b0701e9e0c41b2626db02406e2",
  "docs/versions/V0_1_0a_1/core/template-builder/sandbox-runtime-and-store.md": "89b6f20aed93ef2b2a18a516b44b3c243a96787b",
  "docs/versions/V0_1_0a_1/core/template-builder/structural-runtime-and-navigation.md": "d3c34b7d14e6f1dfd7783f449d66f1dc103a6480",
  "docs/versions/V0_1_0a_1/core/template-builder/viewport-and-virtualized-rendering.md": "42987ef843d4e466e7295546f56b903b2bc4e1df",
  "docs/versions/V0_1_0a_1/core/template-builder/wysiwyg-draft-input-and-guards.md": "a8288ba8b20d41140ab225f5b237991dc064e4bb",
  "docs/versions/V0_1_0a_1/core/text-engine/OVERVIEW.md": "efb26b60cee0ef231221371f0d7a37b42bfe4398",
  "docs/versions/V0_1_0a_1/core/text-engine/adapter-and-provider.md": "11d8fca99265993ba5f8cf0505903026fb33310e",
  "docs/versions/V0_1_0a_1/core/text-engine/runtime-identity-and-evidence.md": "2548592edd80b3f480928b129e86ca260904a3af",
  "docs/versions/V0_1_0a_1/core/text-engine/rustybuzz-shaping.md": "f7028107cfddd4145d5a5e84bbf7afd2149ad6a1",
  "docs/versions/V0_1_0a_1/core/text-engine/wasm-toolchain-and-artifacts.md": "bc55024985dc1f29086d35a7569fa1ec24bb38ea",
  "migrations/V0_1_0a_1/core/families/core-route/coverage.json": "e227a7dae0fc1a2b446c74c3fce5fa78a9591432",
} as const;

interface Subgroup {
  subgroupId: string;
  sourcePaths: string[];
  proposedLeafPath: string;
  dependsOn: string[];
}

interface Orientation {
  sourceCommit: string;
  inventoryDigest: string;
  families: Array<{
    familyId: string;
    sourceCount: number;
    subgroups: Subgroup[];
    conflicts: Array<{ id: string; owningSubgroupId: string }>;
  }>;
}

function requiredAt<T>(values: readonly T[], index: number, label: string): T {
  const value = values[index];
  if (value === undefined) throw new Error(`Missing ${label} at index ${index}`);
  return value;
}

function expectImmutableCoreAnchors(document: string): void {
  const anchors = [...document.matchAll(/flowdoc-vnext-core@([^:\s`]+):[^\s`]+/g)];
  expect(anchors.length).toBeGreaterThan(0);
  for (const [, commit] of anchors) expect(commit).toBe(coreEvidenceCommit);
  expect(document).not.toMatch(/flowdoc-vnext-core@(?:main|master|develop|HEAD):/iu);
}

function expectNoAuthorityTransfer(document: string): void {
  for (const claim of authorityTransferClaims) expect(document).not.toMatch(claim);
}

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

function documentRecordPath(id: typeof documentIds[number]): string {
  return `data/documents/${id.replace("doc-live-draft-", "live-draft-")}.json`;
}

function evidenceRecordPath(id: typeof evidenceIds[number]): string {
  return `data/evidence/${id.replace("evidence-live-draft-", "live-draft-")}.json`;
}

describe("Live Draft documentation Wave 2", () => {
  it("freezes the exact 64-source orientation and dependency direction", async () => {
    const orientation = JSON.parse(await readFile(
      join(root, "migrations/V0_1_0a_1/core/wave-a-orientation.json"),
      "utf8",
    )) as Orientation;
    const family = orientation.families.find(({ familyId }) => familyId === "live-draft");

    expect(family).toBeDefined();
    expect(orientation.sourceCommit).toBe(frozenCommit);
    expect(orientation.inventoryDigest).toBe(inventoryDigest);
    expect(family!.sourceCount).toBe(64);
    expect(family!.subgroups.map(({ subgroupId }) => subgroupId)).toEqual(subgroupIds);
    expect(family!.subgroups.map(({ sourcePaths }) => sourcePaths.length)).toEqual(subgroupCounts);
    expect(family!.subgroups.map(({ proposedLeafPath }) => proposedLeafPath)).toEqual(leafPaths);
    expect(family!.subgroups.map(({ dependsOn }) => dependsOn)).toEqual(expectedDependencies);
    expect(family!.conflicts.map(({ id, owningSubgroupId }) => ({ id, owningSubgroupId })))
      .toEqual(subgroupIds.map((owningSubgroupId, index) => ({
        id: `LD-C${index + 1}`,
        owningSubgroupId,
      })));

    const sourcePaths = family!.subgroups.flatMap(({ sourcePaths }) => sourcePaths);
    expect(sourcePaths).toHaveLength(64);
    expect(new Set(sourcePaths).size).toBe(64);
  });

  it("reconciles common headings, leaf-specific sections, and all six conflicts", async () => {
    const leaves = await Promise.all(leafPaths.map((path) => readFile(join(root, path), "utf8")));

    for (const [index, leaf] of leaves.entries()) {
      const headings = leaf.match(/^## .+$/gmu) ?? [];
      for (const heading of commonHeadings) expect(headings).toContain(heading);
      for (const heading of requiredAt(requiredLeafSections, index, "leaf sections")) {
        expect(headings).toContain(heading);
      }
      expectImmutableCoreAnchors(leaf);
      expectNoAuthorityTransfer(leaf);
    }

    expect(requiredAt(leaves, 0, "product leaf")).toMatch(
      /Dated Phase 3\/4[^.]*historical[\s\S]*PASS labels do not prove current product readiness/iu,
    );
    const geometryLeaf = requiredAt(leaves, 1, "geometry leaf");
    expect(`${requiredAt(leaves, 0, "product leaf")}\n${geometryLeaf}`).toMatch(
      /XR-4\/XR-5[^.]*bounded display-list[^.]*source-segment handoff/iu,
    );
    expect(geometryLeaf).toMatch(
      /excludes Canvas\/PDF glyph-pixel parity[^.]*production binding/iu,
    );
    const persistentLeaf = requiredAt(leaves, 2, "persistent leaf");
    expect(persistentLeaf).toMatch(/complete layout is optional QA-only comparison/iu);
    expect(persistentLeaf).toMatch(/affected-line planning is not per-keystroke performance proof/iu);
    expect(requiredAt(leaves, 3, "root leaf")).toMatch(
      /V3 scoped PASS does not activate 5B-2 source authority/iu,
    );
    expect(requiredAt(leaves, 4, "source-authority leaf")).toMatch(
      /2026-08-11 approved amendment governs conflicts with the earlier 2026-08-10 seam design[\s\S]*Thai and English companion terms have the same authority/iu,
    );
    expect(requiredAt(leaves, 5, "corrective leaf")).toMatch(
      /earlier local type-check concern[\s\S]*later scoped verification[\s\S]*ranges differ/iu,
    );
  });

  it("finalizes the compact overview with immutable leaf candidates and no source leakage", async () => {
    const orientation = JSON.parse(await readFile(
      join(root, "migrations/V0_1_0a_1/core/wave-a-orientation.json"),
      "utf8",
    )) as Orientation;
    const family = orientation.families.find(({ familyId }) => familyId === "live-draft");
    const [overview, testSource, ...leaves] = await Promise.all([
      readFile(join(root, overviewPath), "utf8"),
      readFile(new URL(import.meta.url), "utf8"),
      ...leafPaths.map((path) => readFile(join(root, path), "utf8")),
    ]);

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
    expect(overview.match(/^\|/gmu) ?? []).toEqual([]);
    expect(overview).not.toMatch(/\bCandidate\b/u);
    expect(overview).toContain(expectedNodeSummary);
    expect(overview.replace(/\s+/gu, " ")).toContain(dependencyChain);
    expect(overview).toContain(coreEvidenceCommit);
    expect(overview).toContain("Live Draft and parent Core remain `unknown`");
    expect(overview).toMatch(/no migration coverage[^.]*no source cleanup[^.]*authorized/iu);

    const links = [...overview.matchAll(/\]\(([^)]+\.md)\)/g)].map((match) => match[1]);
    expect(links).toEqual(leafNames);
    for (const [index, path] of leafPaths.entries()) {
      expect(overview).toContain(
        `flowdoc-project-control@${projectControlCandidateCommit}:${path} (Git blob ${requiredAt(leafBlobs, index, "leaf blob")})`,
      );
    }

    const formerSources = family!.subgroups.flatMap(({ sourcePaths }) => sourcePaths);
    const familyContent = [overview, ...leaves, testSource].join("\n");
    for (const formerSource of formerSources) expect(familyContent).not.toContain(formerSource);
    expect(familyContent).not.toMatch(/flowdoc-(?:vnext-core|project-control)@(?:main|master|develop|HEAD):/iu);
  });

  it("creates the exact canonical Node, Document, and Evidence record set", async () => {
    const recordPaths = [
      "data/nodes/live-draft.json",
      ...documentIds.map(documentRecordPath),
      ...evidenceIds.map(evidenceRecordPath),
    ];
    expect(await Promise.all(recordPaths.map(exists))).toEqual(recordPaths.map(() => true));

    const [node, ...records] = await Promise.all(recordPaths.map(readJson));
    const documents = records.slice(0, documentIds.length);
    const evidence = records.slice(documentIds.length);
    expect(node).toEqual({
      kind: "node",
      id: "live-draft",
      title: "Live Draft",
      parentId: "core",
      summary: expectedNodeSummary,
      truthState: "unknown",
      order: 40,
      documentIds: [...documentIds],
      evidenceIds: [...evidenceIds],
      repositoryIds: ["repo-core", "repo-project-control"],
    });
    expect(documents).toEqual(expectedDocuments);
    expect(evidence).toEqual(expectedEvidence);
    for (const item of evidence) {
      expect(item.nodeIds).toEqual(["live-draft"]);
      expect(item.verificationSummary).toMatch(
        /(?:;|, and) this (?:structural fact |scoped collision fact |primary anchor )?does not/iu,
      );
    }
  });

  it("updates shared truth once while Live Draft and broader Core remain unknown", async () => {
    const [core, coreRepository, projectControlOverview, documentMap] = await Promise.all([
      readJson("data/nodes/core.json"),
      readJson("data/repositories/core.json"),
      readFile(join(root, "docs/domains/project-control.md"), "utf8"),
      readFile(join(root, "docs/versions/V0_1_0a_1/core/DOCUMENT_MAP.md"), "utf8"),
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
    expect(projectControlOverview).toContain(expectedCurrentScopeSummary);
    expect(projectControlOverview).not.toMatch(/Live Draft[^.]*unregistered/iu);
    expect(projectControlOverview).not.toMatch(/Live Draft[^.]*future documentation/iu);
    expect(documentMap).toContain(expectedCurrentScopeSummary);
    const mapLinks = [...documentMap.matchAll(
      /\[Live Draft[^\]]*\]\((live-draft\/[^)]+\.md)\)/g,
    )].map((match) => match[1]);
    expect(mapLinks).toEqual([
      "live-draft/OVERVIEW.md",
      "live-draft/product-readiness-and-renderer-boundaries.md",
      "live-draft/geometry-and-scene-projection.md",
      "live-draft/persistent-flow-and-range-foundations.md",
      "live-draft/root-and-v3-transition-contracts.md",
      "live-draft/source-authority-and-commit-transaction.md",
      "live-draft/corrective-evidence.md",
    ]);
  });

  it("projects reciprocal family truth deterministically without coverage, work, cleanup, or prior-family drift", async () => {
    const [
      orientation,
      overview,
      node,
      index,
      testSource,
      ...leaves
    ] = await Promise.all([
      readJson("migrations/V0_1_0a_1/core/wave-a-orientation.json"),
      readFile(join(root, overviewPath), "utf8"),
      readJson("data/nodes/live-draft.json"),
      readJson("generated/project-index.json"),
      readFile(new URL(import.meta.url), "utf8"),
      ...leafPaths.map((path) => readFile(join(root, path), "utf8")),
    ]);
    const documents = await Promise.all(documentIds.map((id) => readJson(documentRecordPath(id))));
    const evidence = await Promise.all(evidenceIds.map((id) => readJson(evidenceRecordPath(id))));

    expect(await exists("migrations/V0_1_0a_1/core/families/live-draft/coverage.json"))
      .toBe(false);
    expect((node.evidenceIds as string[]).some((id) => /coverage|cleanup/iu.test(id))).toBe(false);
    expect((await readOptionalDirectory("data/work"))
      .filter((name) => /^live-draft.*\.json$/u.test(name))).toEqual([]);

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
      const content = path === overviewPath
        ? overview
        : requiredAt(leaves, leafPaths.indexOf(path), "registered leaf content");
      expect(indexDocuments).toContainEqual({ ...document, content });
    }
    for (const item of evidence) expect(indexEvidence).toContainEqual(item);
    expect(indexDocuments
      .filter((document) => (document.nodeIds as string[]).includes("live-draft"))
      .map((document) => document.id)).toEqual([
      "doc-live-draft-corrective-evidence",
      "doc-live-draft-geometry-scene-projection",
      "doc-live-draft-overview",
      "doc-live-draft-persistent-flow-range-foundations",
      "doc-live-draft-product-readiness-renderer-boundaries",
      "doc-live-draft-root-v3-transition-contracts",
      "doc-live-draft-source-authority-commit-transaction",
    ]);
    expect(indexEvidence
      .filter((item) => (item.nodeIds as string[]).includes("live-draft"))
      .map((item) => item.id)).toEqual([
      "evidence-live-draft-corrective-adversarial-scene",
      "evidence-live-draft-corrective-scoped-review-ranges",
      "evidence-live-draft-geometry-producer-projection",
      "evidence-live-draft-oracle-execution-separation",
      "evidence-live-draft-persistent-structural-reuse",
      "evidence-live-draft-phase-3-4-gates",
      "evidence-live-draft-public-exports-nonactivation",
      "evidence-live-draft-renderer-no-relayout",
      "evidence-live-draft-root-calibration-boundary",
      "evidence-live-draft-root-scene-work-policy",
      "evidence-live-draft-source-authority-amendment-tests",
      "evidence-live-draft-source-authority-transaction-internals",
    ]);

    const family = (orientation.families as Array<{
      familyId: string;
      subgroups: Array<{ sourcePaths: string[] }>;
    }>).find(({ familyId }) => familyId === "live-draft");
    const formerSources = family!.subgroups.flatMap(({ sourcePaths }) => sourcePaths);
    const registeredContent = [
      overview,
      ...leaves,
      testSource,
      JSON.stringify(node),
      ...documents.map((document) => JSON.stringify(document)),
      ...evidence.map((item) => JSON.stringify(item)),
      JSON.stringify(index),
    ].join("\n");
    for (const formerSource of formerSources) expect(registeredContent).not.toContain(formerSource);
    expect(registeredContent).not.toMatch(/flowdoc-(?:vnext-core|project-control)@(?:main|master|develop|HEAD):/iu);

    for (const [path, blob] of Object.entries(protectedBlobs)) {
      expect(gitBlobId(await readFile(join(root, path))), path).toBe(blob);
    }
  });

  it("mutation: rejects authority transfer across all six leaves", async () => {
    const leaves = await Promise.all(leafPaths.map((path) => readFile(join(root, path), "utf8")));
    const mutations = [
      "Product leaf owns geometry producers",
      "Geometry leaf owns retained-root policy",
      "Persistent leaf owns V3 policy",
      "Root leaf owns 5B-2 transaction internals",
      "Source-authority leaf owns corrective verdict authority",
      "Corrective leaf owns normative implementation authority",
    ] as const;
    const negatives = [
      "Product leaf does not own geometry producers",
      "Geometry leaf does not own retained-root policy",
      "Persistent leaf does not own V3 policy",
      "Root leaf does not own 5B-2 transaction internals",
      "Source-authority leaf does not own corrective verdict authority",
      "Corrective leaf does not own normative implementation authority",
    ] as const;

    for (const [index, leaf] of leaves.entries()) {
      expect(() => expectNoAuthorityTransfer(`${leaf}\n${requiredAt(mutations, index, "mutation")}`))
        .toThrow();
      expectNoAuthorityTransfer(`${leaf}\n${requiredAt(negatives, index, "negative control")}`);
    }
  });
});
