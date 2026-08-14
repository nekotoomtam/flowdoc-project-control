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
  families: FamilyOrientation[];
}

const expectedQualifiedSubgroup = "text-engine/wasm-toolchain-and-artifacts";
const expectedLeafPath =
  "docs/versions/V0_1_0a_1/core/text-engine/wasm-toolchain-and-artifacts.md";
const expectedCurrentEvidenceCommit = "c503a45c03e0ce3b7a6efba2b029ca842017faa0";
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
  "Text Engine family remains unknown; this registered WASM leaf covers package-local toolchain and tracked-artifact facts only, while broader adoption and production readiness remain unknown.";
const expectedCoreSummary =
  "Broader Core remains unknown; the bounded core-route child is closed with recorded cleanup Evidence; a bounded Text Engine WASM leaf is registered while the Text Engine family remains unknown.";
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
  const contents = await readFile(
    join(root, "migrations/V0_1_0a_1/core/wave-a-orientation.json"),
    "utf8",
  );
  return JSON.parse(contents) as WaveAOrientation;
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

function expectProvenanceSafe(
  leaf: string,
  testSource: string,
  formerSourcePaths: string[],
): void {
  const evidenceReferences = [...leaf.matchAll(/flowdoc-vnext-core@([^:\s`]+):/g)];

  expect(evidenceReferences.length).toBeGreaterThan(0);
  for (const reference of evidenceReferences) {
    expect(reference[1]).toBe(expectedCurrentEvidenceCommit);
  }
  expect(leaf).not.toMatch(/https?:\/\/[^\s)]+\/blob\/(?:main|master)\//i);
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
    const orientation = await readOrientation();
    const subgroup = findSubgroup(orientation);
    const leaf = await readFile(join(root, subgroup.proposedLeafPath), "utf8");

    expect(subgroup.proposedLeafPath).toBe(expectedLeafPath);
    expect(subgroup.sourcePaths).toHaveLength(13);
    expect(new Set(subgroup.sourcePaths).size).toBe(13);

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

  it("registers only the bounded Text Engine WASM leaf without promoting its family", async () => {
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
      documentIds: [registration.documentId],
      evidenceIds: [registration.toolchainEvidenceId, registration.artifactEvidenceId],
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
        "Focused acquisition, provisioning, optional-readiness, and version-compatibility gates passed (12 files / 93 tests); package-local discovery and planning do not establish globally installed tools.",
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
    expect(map).toContain("## Reviewed Partial Family Leaves");
    expect(map).toContain(
      "[Text Engine WASM toolchain and artifacts](text-engine/wasm-toolchain-and-artifacts.md)",
    );
    expect(map).toContain("This is not a Text Engine family overview.");
    expect(map).toMatch(/Text Engine remains unknown; the\s+remaining three leaves are incomplete/);
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
    ).toEqual([registration.artifactEvidenceId, registration.toolchainEvidenceId]);
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
