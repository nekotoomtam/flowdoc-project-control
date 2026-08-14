import { createHash } from "node:crypto";
import { access, readFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();

interface SemanticSubgroup {
  subgroupId: string;
  sourcePaths: string[];
  proposedLeafPath: string;
}

interface FamilyOrientation {
  familyId: string;
  subgroups: SemanticSubgroup[];
}

interface WaveAOrientation {
  sourceCommit: string;
  inventoryDigest: string;
  families: FamilyOrientation[];
}

interface InventoryFile {
  path: string;
  blobId: string;
}

interface CoreInventory {
  sourceCommit: string;
  sourceDigest: string;
  files: InventoryFile[];
}

const expectedQualifiedSubgroup = "text-engine/wasm-toolchain-and-artifacts";
const expectedLeafPath =
  "docs/versions/V0_1_0a_1/core/text-engine/wasm-toolchain-and-artifacts.md";
const expectedCurrentEvidenceCommit = "c503a45c03e0ce3b7a6efba2b029ca842017faa0";
const expectedFrozenSourceCommit = "76a2f2311a898e781f53773390d47b05812911e4";
const expectedOrientationRawSha256 =
  "c6b8c74477a51a819bf45cf2e480e26b0c57e72b00dbab69a33080f48ec12b83";
const expectedOrientationGitBlobId = "3609fb3151a91f68b49e747e4c0dddb7c5624d81";
const expectedSubgroupSourcePathSha256 =
  "50f160881ea2fd3e7cdeb418d57b513a58a7b1179e02dc342beb63092ba04c7f";
const expectedInventorySourceDigest =
  "36f54f2302d51895615a81767c92c0ccba18563703471c33169b3816b63e5f5b";
const expectedInventoryBlobIds = [
  "04e29dc88fd3ae81d300fe90492b1e44a07f5350",
  "27c77deca5519d98dbd218b1ac24c87daddbc8f9",
  "50bbfb1fc40492564947beda2a4a83c909b0d6ad",
  "b60ce42def241dc81b4ba1966189aafba5a3686b",
  "22d67f4a5e84cfed92f9f4472838bcbf80f6a291",
  "a4cec1f8c03a5aa557a95f921827b210400b7ed4",
  "cc35062654e77539e4a2a1ead6c2ac6666f80b88",
  "5d97f1914aaad46588a1cf12ce0f40122846f5c0",
  "a1fe0af326a98a0a67557d39e7e4143e3616fa3d",
  "2d1df778540ff461f1e0fa07ce6d1a7acd429973",
  "c2b65acb62ed4c01c6cc54927f7049edd81bbe76",
  "576e12b5d0f2fc3e83f13fe9b05e2198b811d0d9",
  "5f3a5f04133201a68fd6b7476df57f624a3f75fe",
] as const;
const registration = {
  nodeId: "text-engine",
  nodeTruthState: "unknown",
  documentId: "doc-text-engine-wasm-toolchain-artifacts",
  documentRole: "contract",
  documentLifecycle: "active",
  toolchainEvidenceId: "evidence-text-engine-wasm-toolchain-gates",
  artifactEvidenceId: "evidence-text-engine-wasm-artifact-digest",
  repositoryId: "repo-core",
  commit: expectedCurrentEvidenceCommit,
} as const;
const expectedAuthority =
  "Canonical contract limited to verified package-local WASM toolchain and tracked-artifact facts; wider Text Engine adoption, parity, production readiness, and default-measurer replacement remain unknown.";
const expectedNodeSummary =
  "Text Engine family remains unknown; two reviewed bounded leaves register package-local WASM toolchain/artifact facts and runtime identity/digest-evidence facts only, while broader adoption and production readiness remain unknown.";
const expectedCoreSummary =
  "Broader Core remains unknown; the bounded core-route child is closed with recorded cleanup Evidence; two bounded Text Engine leaves are registered while the Text Engine family remains unknown.";
const expectedDocumentRepositoryPaths = [
  "packages/text-engine-rust-wasm/package.json",
  "packages/text-engine-rust-wasm/scripts/check-wasm-toolchain.mjs",
  "packages/text-engine-rust-wasm/scripts/plan-wasm-toolchain-bootstrap.mjs",
  "packages/text-engine-rust-wasm/fixtures/wasm-artifact-digest-pinning.v1.json",
  "packages/text-engine-rust-wasm/fixtures/wasm-evidence-summary.v1.json",
  "packages/text-engine-rust-wasm/pkg/flowdoc_text_engine_bg.wasm",
  "tests/textEngineWasmArtifactBuildOutputGate.test.ts",
  "tests/textEngineWasmArtifactDigestPinningGate.test.ts",
  "tests/textEngineWasmArtifactProductionGate.test.ts",
  "tests/textEngineWasmArtifactProductionRetryGate.test.ts",
  "tests/textEngineWasmBindgenExportDependencyGate.test.ts",
  "tests/textEngineWasmBuildToolchainReadinessGate.test.ts",
  "tests/textEngineWasmToolchainAcquisitionGate.test.ts",
  "tests/textEngineWasmToolchainOptionalReadinessSmoke.test.ts",
  "tests/textEngineWasmToolchainProvisioningBootstrapGate.test.ts",
  "tests/textEngineWasmToolchainProvisioningExecutionGate.test.ts",
  "tests/textEngineWasmToolchainRustUpgradeExecutionGate.test.ts",
  "tests/textEngineWasmToolchainVersionCompatibilityGate.test.ts",
] as const;
const expectedHeadings = [
  "## Authority and Scope",
  "## Current Package Boundary",
  "## Toolchain Discovery and Provisioning",
  "## Build and Bindgen Flow",
  "## Tracked Artifact Contract",
  "## Verification Commands",
  "## Known Limits and Unknowns",
  "## Historical Design Notes",
  "## Evidence Anchors",
] as const;

const prohibitedClaimMutations = [
  ["native/WASM parity established", "Native/WASM parity is established."],
  ["renderer drift accepted", "Renderer drift is accepted."],
  ["renderer drift verified", "Renderer drift is verified."],
  ["numeric threshold accepted", "Numeric threshold is accepted."],
  ["accepted manifest ready", "Accepted manifest is ready."],
] as const;

const allowedBoundaryMutations = [
  ["native/WASM parity not run", "nativeWasmParityStatus: not-run"],
  ["renderer-backed drift unknown", "rendererBackedDriftStatus: unknown"],
  ["numeric drift threshold blocked", "numericDriftThresholdStatus: blocked"],
  ["accepted manifest blocked", "acceptedManifestStatus: blocked"],
] as const;

async function readOrientation(): Promise<WaveAOrientation> {
  return JSON.parse((await readOrientationBytes()).toString("utf8")) as WaveAOrientation;
}

async function readOrientationBytes(): Promise<Buffer> {
  return readFile(join(root, "migrations/V0_1_0a_1/core/wave-a-orientation.json"));
}

async function readInventory(): Promise<CoreInventory> {
  return readJson<CoreInventory>("migrations/V0_1_0a_1/core/inventory.json");
}

async function readJson<T>(relativePath: string): Promise<T> {
  return JSON.parse(await readFile(join(root, relativePath), "utf8")) as T;
}

async function fileExists(relativePath: string): Promise<boolean> {
  try {
    await access(join(root, relativePath));
    return true;
  } catch {
    return false;
  }
}

function findSubgroup(orientation: WaveAOrientation): SemanticSubgroup {
  const subgroup = orientation.families
    .flatMap((family) =>
      family.subgroups.map((candidate) => ({
        ...candidate,
        qualifiedId: `${family.familyId}/${candidate.subgroupId}`,
      })),
    )
    .find(({ qualifiedId }) => qualifiedId === expectedQualifiedSubgroup);

  if (!subgroup) throw new Error(`Missing subgroup: ${expectedQualifiedSubgroup}`);
  return subgroup;
}

function sha256(value: string | Uint8Array): string {
  return createHash("sha256").update(value).digest("hex");
}

function gitBlobId(value: Uint8Array): string {
  return createHash("sha1")
    .update(`blob ${value.byteLength}\0`)
    .update(value)
    .digest("hex");
}

function expectFrozenBatchIdentity(orientation: WaveAOrientation, inventory: CoreInventory): void {
  const subgroup = findSubgroup(orientation);

  expect(orientation.sourceCommit).toBe(expectedFrozenSourceCommit);
  expect(orientation.inventoryDigest).toBe(expectedInventorySourceDigest);
  expect(inventory.sourceCommit).toBe(expectedFrozenSourceCommit);
  expect(inventory.sourceDigest).toBe(expectedInventorySourceDigest);
  expect(subgroup.proposedLeafPath).toBe(expectedLeafPath);
  expect(subgroup.sourcePaths).toHaveLength(13);
  expect(new Set(subgroup.sourcePaths).size).toBe(13);
  expect(sha256(subgroup.sourcePaths.join("\n"))).toBe(expectedSubgroupSourcePathSha256);
  expect(
    subgroup.sourcePaths.map((sourcePath) => {
      const matches = inventory.files.filter((file) => file.path === sourcePath);
      expect(matches).toHaveLength(1);
      return matches[0]?.blobId;
    }),
  ).toEqual(expectedInventoryBlobIds);
}

function expectReviewedPartialMapSafe(map: string): void {
  expect(map).toContain(
    "This map records the completed pilot family and reviewed partial family leaves; all broader Core truth remains unknown.",
  );
  expect(map).not.toContain("records only the family closed by the completed pilot.");
  expect(map).not.toMatch(
    /All other Core families remain in candidate\/inventory\s+state and are not represented here as canonical release documentation\./,
  );
  expect(map).toContain("Text Engine remains unknown.");
  expect(map).toContain("Two later leaves plus the family overview remain incomplete, and no source cleanup is authorized.");
}

function expectPowerShellFocusedGateSyntax(leaf: string): void {
  expect(leaf).toContain("```powershell\nnpm test -- --maxWorkers=1 `");
  expect(leaf).not.toContain("npm test -- --maxWorkers=1 \\");
}

function expectProvenanceSafe(
  leaf: string,
  testSource: string,
  formerSourcePaths: string[],
): void {
  const evidenceReferences = [...leaf.matchAll(/flowdoc-vnext-core@([^:\s`]+):/g)];
  const githubBlobReferences = [
    ...leaf.matchAll(/https?:\/\/github\.com\/[^/\s)]+\/[^/\s)]+\/blob\/([^/\s)]+)(?:\/|$)/gi),
  ];

  expect(evidenceReferences.length).toBeGreaterThan(0);
  for (const reference of evidenceReferences) {
    expect(reference[1]).toBe(expectedCurrentEvidenceCommit);
  }
  for (const reference of githubBlobReferences) {
    expect(reference[1]).toBe(expectedCurrentEvidenceCommit);
  }
  expect(leaf).not.toMatch(/(?:[A-Za-z]:\\|file:\/\/|\/(?:Users|home|tmp)\/)/);
  for (const formerSourcePath of formerSourcePaths) {
    expect(leaf).not.toContain(formerSourcePath);
    expect(testSource).not.toContain(formerSourcePath);
  }
}

function expectFactualBoundarySafe(leaf: string): void {
  expect(leaf).not.toMatch(/\b(?:is|are|became|becomes|now) production[- ]ready\b/i);
  expect(leaf).not.toMatch(
    /\bdefault (?:Core )?measurer (?:uses|adopts|has adopted|was replaced by|is replaced by)\b/i,
  );
  expect(leaf).not.toMatch(/\bnative\/wasm parity is established\b/i);
  expect(leaf).not.toMatch(/\brenderer(?:-backed)? drift is (?:accepted|verified)\b/i);
  expect(leaf).not.toMatch(/\bnumeric(?: drift)? thresholds? (?:is|are) accepted\b/i);
  expect(leaf).not.toMatch(/\baccepted (?:summary )?manifest is ready\b/i);
}

describe("Text Engine WASM toolchain and artifacts leaf", () => {
  it("preserves the frozen batch identity and current-first document contract", async () => {
    const [orientationBytes, orientation, inventory] = await Promise.all([
      readOrientationBytes(),
      readOrientation(),
      readInventory(),
    ]);
    const subgroup = findSubgroup(orientation);
    const leaf = await readFile(join(root, subgroup.proposedLeafPath), "utf8");

    expect(sha256(orientationBytes)).toBe(expectedOrientationRawSha256);
    expect(gitBlobId(orientationBytes)).toBe(expectedOrientationGitBlobId);
    expectFrozenBatchIdentity(orientation, inventory);

    const headings = leaf.match(/^## .+$/gm) ?? [];
    expect(headings).toEqual(expectedHeadings);
    expect(leaf).toContain(expectedCurrentEvidenceCommit);
    expect(leaf).toContain("4667b7fe401eddf09133a8a22af11456ab018b2a32c668a031b8120a79db8a44");
    expect(leaf).toContain("productionReady: false");
    expect(leaf).toContain("defaultMeasurerReplacement: false");
    expect(leaf).toContain("nativeWasmParityStatus: not-run");
    expect(leaf).toContain("rendererBackedDriftStatus: unknown");
    expect(leaf).toContain("numericDriftThresholdStatus: blocked");
    expect(leaf).toContain("acceptedManifestStatus: blocked");
  });

  it("uses immutable evidence anchors without retaining former source paths", async () => {
    const orientation = await readOrientation();
    const subgroup = findSubgroup(orientation);
    const leaf = await readFile(join(root, subgroup.proposedLeafPath), "utf8");
    const testSource = await readFile(new URL(import.meta.url), "utf8");

    expectProvenanceSafe(leaf, testSource, subgroup.sourcePaths);
  });

  it("mutation: rejects a mutable GitHub blob reference", async () => {
    const orientation = await readOrientation();
    const subgroup = findSubgroup(orientation);
    const leaf = await readFile(join(root, subgroup.proposedLeafPath), "utf8");
    const testSource = await readFile(new URL(import.meta.url), "utf8");
    const mutableUrl =
      "https://github.com/nekotoomtam/flowdoc-vnext-core/blob/develop/packages/text-engine-rust-wasm/package.json";

    expect(() => expectProvenanceSafe(`${leaf}\n${mutableUrl}`, testSource, subgroup.sourcePaths)).toThrow();
  });

  it("mutation: rejects a 13-for-13 source substitution", async () => {
    const [orientation, inventory] = await Promise.all([readOrientation(), readInventory()]);
    const mutatedOrientation = structuredClone(orientation);
    const subgroup = findSubgroup(mutatedOrientation);
    const replacement = inventory.files.find((file) => !subgroup.sourcePaths.includes(file.path));
    if (!replacement) throw new Error("Inventory must contain an unrelated source");

    subgroup.sourcePaths[0] = replacement.path;

    expect(() => expectFrozenBatchIdentity(mutatedOrientation, inventory)).toThrow();
  });

  it("mutation: rejects inventory blob and source-anchor drift", async () => {
    const [orientation, inventory] = await Promise.all([readOrientation(), readInventory()]);
    const blobDriftInventory = structuredClone(inventory);
    const sourcePath = findSubgroup(orientation).sourcePaths[0];
    const sourceEntry = blobDriftInventory.files.find((file) => file.path === sourcePath);
    if (!sourceEntry) throw new Error("Frozen source must exist in inventory");
    sourceEntry.blobId = "0000000000000000000000000000000000000000";
    expect(() => expectFrozenBatchIdentity(orientation, blobDriftInventory)).toThrow();

    const commitDriftOrientation = structuredClone(orientation);
    commitDriftOrientation.sourceCommit = "0000000000000000000000000000000000000000";
    expect(() => expectFrozenBatchIdentity(commitDriftOrientation, inventory)).toThrow();

    const digestDriftInventory = structuredClone(inventory);
    digestDriftInventory.sourceDigest = "0000000000000000000000000000000000000000000000000000000000000000";
    expect(() => expectFrozenBatchIdentity(orientation, digestDriftInventory)).toThrow();
  });

  it("rejects unqualified readiness and default-measurer claims", async () => {
    const orientation = await readOrientation();
    const subgroup = findSubgroup(orientation);
    const leaf = await readFile(join(root, subgroup.proposedLeafPath), "utf8");

    expectFactualBoundarySafe(leaf);
  });

  it("mutation: rejects a former source literal introduced in the test source", async () => {
    const orientation = await readOrientation();
    const subgroup = findSubgroup(orientation);
    const leaf = await readFile(join(root, subgroup.proposedLeafPath), "utf8");
    const testSource = await readFile(new URL(import.meta.url), "utf8");
    const formerSourcePath = subgroup.sourcePaths.at(0);
    if (!formerSourcePath) throw new Error("Frozen subgroup must contain a source");

    expect(() =>
      expectProvenanceSafe(leaf, `${testSource}\n${formerSourcePath}`, subgroup.sourcePaths)
    ).toThrow();
  });

  it("mutation: rejects a mutable Core evidence reference", async () => {
    const orientation = await readOrientation();
    const subgroup = findSubgroup(orientation);
    const leaf = await readFile(join(root, subgroup.proposedLeafPath), "utf8");
    const testSource = await readFile(new URL(import.meta.url), "utf8");
    const mutableReference = "flowdoc-vnext-core@main:packages/text-engine-rust-wasm/package.json";

    expect(() =>
      expectProvenanceSafe(`${leaf}\n${mutableReference}`, testSource, subgroup.sourcePaths)
    ).toThrow();
  });

  it.each(prohibitedClaimMutations)("mutation: rejects %s", async (_label, claim) => {
    const orientation = await readOrientation();
    const subgroup = findSubgroup(orientation);
    const leaf = await readFile(join(root, subgroup.proposedLeafPath), "utf8");

    expect(() => expectFactualBoundarySafe(`${leaf}\n${claim}`)).toThrow();
  });

  it.each(allowedBoundaryMutations)("allows explicit %s wording", async (_label, claim) => {
    const orientation = await readOrientation();
    const subgroup = findSubgroup(orientation);
    const leaf = await readFile(join(root, subgroup.proposedLeafPath), "utf8");

    expect(() => expectFactualBoundarySafe(`${leaf}\n${claim}`)).not.toThrow();
  });

  it("uses an explicit PowerShell continuation for the focused Core gate command", async () => {
    const orientation = await readOrientation();
    const leaf = await readFile(join(root, findSubgroup(orientation).proposedLeafPath), "utf8");

    expectPowerShellFocusedGateSyntax(leaf);
    expect(() => expectPowerShellFocusedGateSyntax(`${leaf}\nnpm test -- --maxWorkers=1 \\`)).toThrow();
  });

  it("keeps the document map honest about closed and reviewed partial family material", async () => {
    const map = await readFile(join(root, "docs/versions/V0_1_0a_1/core/DOCUMENT_MAP.md"), "utf8");

    expectReviewedPartialMapSafe(map);
  });

  it("retains the bounded Text Engine WASM leaf alongside Runtime Identity without promoting its family", async () => {
    const [node, document, toolchainEvidence, artifactEvidence, core, map, index, leaf] =
      await Promise.all([
        readJson<Record<string, unknown>>("data/nodes/text-engine.json"),
        readJson<Record<string, unknown>>("data/documents/text-engine-wasm-toolchain-artifacts.json"),
        readJson<Record<string, unknown>>("data/evidence/text-engine-wasm-toolchain-gates.json"),
        readJson<Record<string, unknown>>("data/evidence/text-engine-wasm-artifact-digest.json"),
        readJson<Record<string, unknown>>("data/nodes/core.json"),
        readFile(join(root, "docs/versions/V0_1_0a_1/core/DOCUMENT_MAP.md"), "utf8"),
        readJson<Record<string, unknown>>("generated/project-index.json"),
        readFile(join(root, expectedLeafPath), "utf8"),
      ]);

    expect(node).toEqual({
      kind: "node",
      id: registration.nodeId,
      title: "Text Engine",
      parentId: "core",
      summary: expectedNodeSummary,
      truthState: registration.nodeTruthState,
      order: 20,
      documentIds: [registration.documentId, "doc-text-engine-runtime-identity-evidence"],
      evidenceIds: [
        registration.toolchainEvidenceId,
        registration.artifactEvidenceId,
        "evidence-text-engine-runtime-identity-contract",
        "evidence-text-engine-runtime-identity-digest",
      ],
      repositoryIds: [registration.repositoryId, "repo-project-control"],
    });
    expect(document).toEqual({
      kind: "document",
      id: registration.documentId,
      title: "Text Engine WASM Toolchain and Artifacts",
      path: expectedLeafPath,
      nodeIds: [registration.nodeId],
      role: registration.documentRole,
      authority: expectedAuthority,
      lifecycle: registration.documentLifecycle,
      repositoryRefs: expectedDocumentRepositoryPaths.map((pathOrContractId) => ({
        repositoryId: registration.repositoryId,
        commit: registration.commit,
        pathOrContractId,
      })),
    });
    expect(toolchainEvidence).toEqual({
      kind: "evidence",
      id: registration.toolchainEvidenceId,
      nodeIds: [registration.nodeId],
      repositoryId: registration.repositoryId,
      commit: registration.commit,
      pathOrContractId: "packages/text-engine-rust-wasm/scripts/check-wasm-toolchain.mjs",
      verificationSummary:
        "A focused 12-file/93-test WASM gate batch passed, including acquisition, provisioning, optional-readiness, and version-compatibility gates; package-local discovery and planning do not establish globally installed tools or production readiness.",
      verifiedAt: "2026-08-14T00:00:00.000Z",
    });
    expect(artifactEvidence).toEqual({
      kind: "evidence",
      id: registration.artifactEvidenceId,
      nodeIds: [registration.nodeId],
      repositoryId: registration.repositoryId,
      commit: registration.commit,
      pathOrContractId:
        "packages/text-engine-rust-wasm/fixtures/wasm-artifact-digest-pinning.v1.json",
      verificationSummary:
        "Tracked artifact bytes matched 13782 bytes and SHA-256 4667b7fe401eddf09133a8a22af11456ab018b2a32c668a031b8120a79db8a44 at the pinned Core commit; this byte identity does not establish native/WASM parity or production readiness.",
      verifiedAt: "2026-08-14T00:00:00.000Z",
    });
    expect(core).toMatchObject({
      id: "core",
      truthState: "unknown",
      summary: expectedCoreSummary,
    });
    expectReviewedPartialMapSafe(map);
    expect(map).toContain("## Reviewed Partial Family Leaves");
    expect(map).toContain(
      "[Text Engine WASM toolchain and artifacts](text-engine/wasm-toolchain-and-artifacts.md)",
    );
    expect(map).toContain(
      "[Text Engine Runtime Identity and Evidence](text-engine/runtime-identity-and-evidence.md)",
    );
    expect(map).toContain("Neither entry is a Text Engine family overview.");
    expect(map).toContain("Two later leaves plus the family overview remain incomplete");
    expect(map).toContain("no source cleanup is authorized.");
    expect(await fileExists("migrations/V0_1_0a_1/core/families/text-engine/coverage.json")).toBe(false);

    const indexNodes = index.nodes as Record<string, unknown>[];
    const indexDocuments = index.documents as Record<string, unknown>[];
    const indexEvidence = index.evidence as Record<string, unknown>[];
    expect(indexNodes).toContainEqual({ ...node, childIds: [], workIds: [] });
    expect(indexDocuments).toContainEqual({ ...document, content: leaf });
    expect(indexEvidence).toContainEqual(toolchainEvidence);
    expect(indexEvidence).toContainEqual(artifactEvidence);
    expect(
      indexEvidence
        .filter((evidence) => (evidence.nodeIds as string[]).includes(registration.nodeId))
        .map((evidence) => evidence.id),
    ).toEqual([
      "evidence-text-engine-runtime-identity-contract",
      "evidence-text-engine-runtime-identity-digest",
      registration.artifactEvidenceId,
      registration.toolchainEvidenceId,
    ]);
    expect(indexNodes).toContainEqual(
      expect.objectContaining({
        id: "core",
        truthState: "unknown",
        summary: expectedCoreSummary,
        childIds: ["core-route", registration.nodeId],
      }),
    );
  });
});
