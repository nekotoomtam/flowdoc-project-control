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

interface WaveAOrientation {
  sourceCommit: string;
  inventoryDigest: string;
  families: Array<{ familyId: string; subgroups: SemanticSubgroup[] }>;
}

interface CoreInventory {
  sourceCommit: string;
  files: Array<{ path: string; blobId: string }>;
}

const expectedQualifiedSubgroup = "text-engine/runtime-identity-and-evidence";
const expectedLeafPath =
  "docs/versions/V0_1_0a_1/core/text-engine/runtime-identity-and-evidence.md";
const expectedHeadings = [
  "## Authority and Scope",
  "## Runtime Identity Contract",
  "## Digest Evidence States",
  "## Building and Populating Evidence",
  "## Validation Rules",
  "## Current Verified State",
  "## Known Limits and Unknowns",
  "## Historical Design Notes",
  "## Evidence Anchors",
] as const;
const expectedPlanStates = ["identity-ready", "parity-ready", "blocked"] as const;
const expectedDigestStates = ["pinned", "pending", "missing", "stale"] as const;
const expectedCurrentEvidenceCommit = "c503a45c03e0ce3b7a6efba2b029ca842017faa0";
const expectedFrozenSourceCommit = "76a2f2311a898e781f53773390d47b05812911e4";
const expectedOrientationRawSha256 =
  "c6b8c74477a51a819bf45cf2e480e26b0c57e72b00dbab69a33080f48ec12b83";
const expectedOrientationGitBlobId = "3609fb3151a91f68b49e747e4c0dddb7c5624d81";
const expectedInventorySourceDigest =
  "36f54f2302d51895615a81767c92c0ccba18563703471c33169b3816b63e5f5b";
const expectedDependencyBlob = "bc55024985dc1f29086d35a7569fa1ec24bb38ea";
const expectedSourcePathSha256 =
  "b926b78c3f5c5a15b90c18033edb7452fb56062a4bf3987f8aa2ba815b196949";
const expectedInventoryBlobIds = [
  "839224381089a9aaf4461d5d5b23052eb48b9130",
  "afaca6ac2ed3caa55bc7265fe64212f71c71cd54",
  "60893fc38815cb5d45926dcb61d8e394450e6759",
] as const;
const registration = {
  nodeId: "text-engine",
  nodeTruthState: "unknown",
  documentId: "doc-text-engine-runtime-identity-evidence",
  documentRole: "contract",
  documentLifecycle: "active",
  contractEvidenceId: "evidence-text-engine-runtime-identity-contract",
  digestEvidenceId: "evidence-text-engine-runtime-identity-digest",
  repositoryId: "repo-core",
  commit: expectedCurrentEvidenceCommit,
} as const;
const expectedNodeSummary =
  "Text Engine documentation synthesis is complete across four bounded leaves and one family overview; family truth remains unknown pending coverage, reference repair, and publication review, while production, default adoption, and native/WASM parity remain unknown.";
const expectedCoreSummary =
  "Broader Core remains unknown; the bounded core-route child is closed with recorded cleanup Evidence; the Text Engine documentation set is synthesized across four bounded leaves and one family overview; Template Builder documentation is synthesized across five bounded leaves and one family overview; migration coverage, reference repair, publication review, and family promotion remain incomplete for both documentation families. Live Draft documentation is synthesized across six bounded leaves and one family overview; its migration coverage, reference repair, publication review, and family promotion remain incomplete.";
const expectedAuthority =
  "Canonical contract limited to verified Runtime Identity and JSON-safe digest-evidence facts; runtime execution, parity, renderer acceptance, numeric thresholds, accepted manifest, production readiness, default-measurer replacement, and family-wide authority remain excluded.";
const expectedDocumentRepositoryPaths = [
  "packages/text-engine-rust-wasm/src/runtimeIdentity.ts",
  "packages/text-engine-rust-wasm/src/runtimeIdentityDigestEvidenceBuilder.ts",
  "packages/text-engine-rust-wasm/fixtures/text-engine-runtime-identity.v1.json",
  "packages/text-engine-rust-wasm/fixtures/runtime-identity-digest-evidence-population.v1.json",
  "packages/text-engine-rust-wasm/pkg/flowdoc_text_engine_bg.wasm",
] as const;

const expectedRuntimeIdentityFieldRows = [
  ["Manifest identity", "Stable manifest ID and policy revision", "Identifies the contract version; it does not identify successful execution"],
  ["Adapter package", "Owning package name", "Must remain `@flowdoc/text-engine-rust-wasm`"],
  ["Measurement profile", "Font, shaping, segmentation, policy, and output context", "Must match the evidence request before a digest is reusable"],
  ["Output shape", "Produced fact shape", "Current supported value is `glyph-line-box-v1`"],
  ["Runtime targets", "Native and WASM comparison targets", "Targets identify intended comparison endpoints; they do not prove comparison ran"],
  ["Runtime revisions", "Rustybuzz, ICU4X, and ICU4X-data identities", "Blank values block identity; planned values remain visibly planned"],
  ["WASM artifact", "Digest status and SHA-256", "A pinned digest identifies bytes only"],
  ["Font assets", "Stable font IDs and hashes", "Required identity ingredients, not visual acceptance evidence"],
  ["Parity comparison", "Status, targets, and compared facts", "`not-run` cannot support `parity-ready`"],
] as const;

const expectedPlanStateRows = [
  ["`identity-ready`", "Required identity ingredients are structurally valid while parity may remain unproven"],
  ["`parity-ready`", "Requires a pinned valid digest and a matching native/WASM comparison over every required fact"],
  ["`blocked`", "One or more required identity or parity conditions fail"],
] as const;

const expectedDigestStateRows = [
  ["`pinned`", "A lowercase SHA-256 exists and identity matches the requested matrix, profile, and output shape"],
  ["`pending`", "Identity exists but the artifact digest is not pinned"],
  ["`missing`", "A pinned claim lacks a valid digest"],
  ["`stale`", "Identity, profile, output shape, or digest declaration no longer matches the requested evidence context"],
] as const;

const expectedReadinessEvidenceRows = [
  ["Identity readiness", "`identity-ready`", "Identity ingredients validate; parity remains unproven"],
  ["Digest evidence", "`pinned`", "Exact retained bytes are identified; execution and parity are not proved"],
  ["Parity status", "`identity-only`", "No parity-ready claim"],
  ["Comparison evidence", "`not-run`", "No matching native/WASM result exists"],
  ["Production readiness", "`false`", "Production binding remains blocked"],
  ["Default measurer replacement", "`false`", "The default measurer remains unchanged"],
] as const;

const requiredCurrentValues = [
  "text-engine-runtime-identity-v1",
  "text-engine-runtime-identity-policy-v1",
  "@flowdoc/text-engine-rust-wasm",
  "glyph-line-box-v1",
  "node-native",
  "browser-wasm",
  "worker-wasm",
  "Rustybuzz 0.20.1",
  "4667b7fe401eddf09133a8a22af11456ab018b2a32c668a031b8120a79db8a44",
  "identity-only",
  "not-run",
  "productionReady: false",
  "defaultMeasurerReplacement: false",
] as const;

const unsupportedPositiveClaimMutations = [
  ["native/WASM parity", "Native/WASM parity is established."],
  ["renderer drift", "Renderer-backed drift is verified."],
  ["numeric threshold", "Numeric drift threshold is accepted."],
  ["accepted manifest", "Accepted summary manifest is ready."],
  ["production readiness", "Production readiness is true."],
  ["default measurer", "Default measurer replacement is true."],
  ["installed ICU4X", "ICU4X revisions are installed."],
] as const;

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

function sha256(value: string | Uint8Array): string {
  return createHash("sha256").update(value).digest("hex");
}

function gitBlobId(value: Buffer): string {
  return createHash("sha1")
    .update(`blob ${value.byteLength}\0`)
    .update(value)
    .digest("hex");
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

function expectFrozenBatchIdentity(
  orientationBytes: Buffer,
  orientation: WaveAOrientation,
  inventory: CoreInventory,
): void {
  const subgroup = findSubgroup(orientation);
  expect(sha256(orientationBytes)).toBe(expectedOrientationRawSha256);
  expect(gitBlobId(orientationBytes)).toBe(expectedOrientationGitBlobId);
  expect(orientation.sourceCommit).toBe(expectedFrozenSourceCommit);
  expect(orientation.inventoryDigest).toBe(expectedInventorySourceDigest);
  expect(inventory.sourceCommit).toBe(expectedFrozenSourceCommit);
  expect(subgroup.proposedLeafPath).toBe(expectedLeafPath);
  expect(subgroup.sourcePaths).toHaveLength(3);
  expect(new Set(subgroup.sourcePaths).size).toBe(3);
  expect(sha256(subgroup.sourcePaths.join("\n"))).toBe(expectedSourcePathSha256);
  expect(
    subgroup.sourcePaths.map((sourcePath) => {
      const matches = inventory.files.filter((file) => file.path === sourcePath);
      expect(matches).toHaveLength(1);
      return matches[0]?.blobId;
    }),
  ).toEqual(expectedInventoryBlobIds);
}

function expectEvidenceBoundaries(leaf: string): void {
  expect(leaf).toMatch(/`?identity-ready`? may coexist with unproven parity/i);
  expect(leaf).toMatch(
    /`?parity-ready`? requires a valid pinned digest and a matching native\/WASM comparison over all required facts/i,
  );
  expect(leaf).toMatch(/ICU4X revisions remain planned/i);
  expect(leaf).toMatch(/renderer drift remains unknown/i);
  expect(leaf).toMatch(/numeric.*accepted-manifest evidence remains blocked/i);
  expect(leaf).not.toMatch(/\b(?:is|are|became|becomes|now) production[- ]ready\b/i);
  expect(leaf).not.toMatch(
    /\bproduction(?:[- ]ready| readiness)?\s*(?:is|are|=|:)\s*(?:true|ready|enabled|complete)\b/i,
  );
  expect(leaf).not.toMatch(/\bdefault (?:Core )?measurer (?:uses|adopts|has adopted|was replaced by|is replaced by)\b/i);
  expect(leaf).not.toMatch(
    /\bdefault(?: Core)?[- ]measurer(?: replacement)?\s*(?:is|are|=|:)\s*(?:true|enabled|active|complete|replaced)\b/i,
  );
  expect(leaf).not.toMatch(/\bnative\/WASM parity is established\b/i);
  expect(leaf).not.toMatch(
    /\brenderer(?:-backed)? drift\s*(?:is|are|=|:)\s*(?:accepted|verified|matching|passed|ready)\b/i,
  );
  expect(leaf).not.toMatch(
    /\bnumeric(?: drift)? thresholds?\s*(?:is|are|=|:)\s*(?:accepted|met|passed|ready)\b/i,
  );
  expect(leaf).not.toMatch(
    /\baccepted (?:summary )?manifest\s*(?:is|are|=|:)\s*(?:ready|accepted|approved|complete)\b/i,
  );
  expect(leaf).not.toMatch(/\bICU4X(?: [\w-]+)?(?: revisions?)?\s*(?:is|are|=|:)\s*(?:installed|executed|running)\b/i);
}

function expectRegistrationAwareEvidenceBoundary(leaf: string): void {
  expect(leaf).toContain(
    "This documentation synthesis did not create or execute Core runtime or raw evidence and did not rerun population.",
  );
  expect(leaf).not.toMatch(
    /\b(?:does not|did not)\b[^.\n]*\b(?:add|create|register)\b[^.\n]*\b(?:an?\s+)?evidence records?\b/i,
  );
}

function readExactStateVocabulary(leaf: string, label: string): string[] {
  const match = leaf.match(new RegExp(`${label}: ((?:\`[a-z-]+\`(?:, |, and )?)+)\\.`, "i"));
  if (!match?.[1]) throw new Error(`Missing ${label}`);
  return [...match[1].matchAll(/`([^`]+)`/g)].map((state) => state[1] ?? "");
}

function expectExactSeparateStateVocabularies(leaf: string): void {
  const planStates = readExactStateVocabulary(leaf, "Plan-state vocabulary");
  const digestStates = readExactStateVocabulary(leaf, "Digest-state vocabulary");

  expect(planStates).toEqual(expectedPlanStates);
  expect(digestStates).toEqual(expectedDigestStates);
  expect(new Set(planStates).size).toBe(planStates.length);
  expect(new Set(digestStates).size).toBe(digestStates.length);
  expect(planStates.filter((state) => digestStates.includes(state))).toEqual([]);
}

function readSection(leaf: string, heading: string): string {
  const start = leaf.indexOf(`${heading}\n`);
  if (start < 0) throw new Error(`Missing section: ${heading}`);
  const contentStart = start + heading.length + 1;
  const nextHeading = leaf.indexOf("\n## ", contentStart);
  return leaf.slice(contentStart, nextHeading < 0 ? undefined : nextHeading);
}

function readMarkdownTable(section: string, headers: readonly string[]): string[][] {
  const lines = section.split("\n");
  const headerLine = `| ${headers.join(" | ")} |`;
  const headerIndex = lines.indexOf(headerLine);
  if (headerIndex < 0) throw new Error(`Missing table: ${headerLine}`);
  expect(lines[headerIndex + 1]).toBe(`| ${headers.map(() => "---").join(" | ")} |`);

  const rows: string[][] = [];
  for (const line of lines.slice(headerIndex + 2)) {
    if (!line.startsWith("| ")) break;
    rows.push(line.slice(2, -2).split(" | "));
  }
  return rows;
}

function expectContractFirstTables(leaf: string): void {
  const identitySection = readSection(leaf, "## Runtime Identity Contract");
  const digestSection = readSection(leaf, "## Digest Evidence States");

  expect(readMarkdownTable(identitySection, ["Field group", "Meaning", "Current boundary"])).toEqual(
    expectedRuntimeIdentityFieldRows,
  );
  expect(readMarkdownTable(identitySection, ["Plan state", "Contract"])).toEqual(expectedPlanStateRows);
  expect(readMarkdownTable(digestSection, ["Digest state", "Contract"])).toEqual(expectedDigestStateRows);
  expect(readMarkdownTable(digestSection, ["Evidence layer", "Current value", "Readiness boundary"])).toEqual(
    expectedReadinessEvidenceRows,
  );
}

function expectImmutableAnchors(leaf: string, formerSourcePaths: string[]): void {
  const anchors = [...leaf.matchAll(/flowdoc-vnext-core@([^:\s`]+):/g)];
  expect(anchors.length).toBeGreaterThan(0);
  for (const anchor of anchors) expect(anchor[1]).toBe(expectedCurrentEvidenceCommit);
  expect(leaf).not.toMatch(/flowdoc-vnext-core@(?:main|master|develop|HEAD):/i);
  expect(leaf).not.toMatch(/(?:[A-Za-z]:\\|file:\/\/|\/(?:Users|home|tmp)\/)/);
  for (const formerSourcePath of formerSourcePaths) expect(leaf).not.toContain(formerSourcePath);
}

function expectRegistrationProvenanceSafe(
  leaf: string,
  testSource: string,
  records: readonly Record<string, unknown>[],
  formerSourcePaths: readonly string[],
): void {
  const registeredContent = [leaf, testSource, ...records.map((record) => JSON.stringify(record))].join("\n");

  for (const formerSourcePath of formerSourcePaths) {
    expect(registeredContent).not.toContain(formerSourcePath);
  }
  expect(registeredContent).not.toMatch(/flowdoc-vnext-core@(?:main|master|develop|HEAD):/i);
}

describe("Text Engine runtime identity and evidence leaf", () => {
  it("preserves the frozen subgroup and current runtime-identity contract", async () => {
    const [orientationBytes, inventory, dependencyBytes] = await Promise.all([
      readFile(join(root, "migrations/V0_1_0a_1/core/wave-a-orientation.json")),
      readJson<CoreInventory>("migrations/V0_1_0a_1/core/inventory.json"),
      readFile(
        join(
          root,
          "docs/versions/V0_1_0a_1/core/text-engine/wasm-toolchain-and-artifacts.md",
        ),
      ),
    ]);
    const orientation = JSON.parse(orientationBytes.toString("utf8")) as WaveAOrientation;
    const subgroup = findSubgroup(orientation);
    const leaf = await readFile(join(root, subgroup.proposedLeafPath), "utf8");

    expectFrozenBatchIdentity(orientationBytes, orientation, inventory);
    expect(gitBlobId(dependencyBytes)).toBe(expectedDependencyBlob);
    expect(leaf.match(/^## .+$/gm) ?? []).toEqual(expectedHeadings);
    expectContractFirstTables(leaf);
    expectExactSeparateStateVocabularies(leaf);
    for (const value of requiredCurrentValues) expect(leaf).toContain(value);
    expectEvidenceBoundaries(leaf);
    expectRegistrationAwareEvidenceBoundary(leaf);
    expectImmutableAnchors(leaf, subgroup.sourcePaths);
  });

  it("mutation: rejects added and cross-member state vocabularies", async () => {
    const orientation = await readJson<WaveAOrientation>(
      "migrations/V0_1_0a_1/core/wave-a-orientation.json",
    );
    const leaf = await readFile(join(root, findSubgroup(orientation).proposedLeafPath), "utf8");
    const subgroup = findSubgroup(orientation);

    expect(() =>
      expectImmutableAnchors(
        `${leaf}\nflowdoc-vnext-core@${["ma", "in"].join("")}:package.json`,
        subgroup.sourcePaths,
      ),
    ).toThrow();
    expect(() =>
      expectExactSeparateStateVocabularies(
        leaf.replace(
          "Plan-state vocabulary: `identity-ready`, `parity-ready`, and `blocked`.",
          "Plan-state vocabulary: `identity-ready`, `parity-ready`, `blocked`, and `unknown`.",
        ),
      ),
    ).toThrow();
    expect(() =>
      expectExactSeparateStateVocabularies(
        leaf.replace(
          "Digest-state vocabulary: `pinned`, `pending`, `missing`, and `stale`.",
          "Digest-state vocabulary: `pinned`, `pending`, `missing`, and `identity-ready`.",
        ),
      ),
    ).toThrow();
  });

  it("mutation: rejects collapsed contract and readiness table rows", async () => {
    const orientation = await readJson<WaveAOrientation>(
      "migrations/V0_1_0a_1/core/wave-a-orientation.json",
    );
    const leaf = await readFile(join(root, findSubgroup(orientation).proposedLeafPath), "utf8");

    expect(() =>
      expectContractFirstTables(
        leaf.replace(
          "| Comparison evidence | `not-run` | No matching native/WASM result exists |",
          "| Comparison evidence | `pinned` | Digest identity is comparison evidence |",
        ),
      ),
    ).toThrow();
  });

  it("mutation: rejects denial of registered Project Control Evidence", async () => {
    const orientation = await readJson<WaveAOrientation>(
      "migrations/V0_1_0a_1/core/wave-a-orientation.json",
    );
    const leaf = await readFile(join(root, findSubgroup(orientation).proposedLeafPath), "utf8");

    expect(() =>
      expectRegistrationAwareEvidenceBoundary(
        `${leaf}\nThis synthesis did not add an evidence record.`,
      ),
    ).toThrow();
  });

  it("mutation: rejects orientation raw-byte and inventory-digest drift", async () => {
    const [orientationBytes, inventory] = await Promise.all([
      readFile(join(root, "migrations/V0_1_0a_1/core/wave-a-orientation.json")),
      readJson<CoreInventory>("migrations/V0_1_0a_1/core/inventory.json"),
    ]);
    const whitespaceDriftBytes = Buffer.concat([orientationBytes, Buffer.from("\n")]);
    const semanticallyEqualOrientation = JSON.parse(whitespaceDriftBytes.toString("utf8")) as WaveAOrientation;
    const digestDriftOrientation = JSON.parse(orientationBytes.toString("utf8")) as WaveAOrientation;
    digestDriftOrientation.inventoryDigest = "0".repeat(64);

    expect(() =>
      expectFrozenBatchIdentity(whitespaceDriftBytes, semanticallyEqualOrientation, inventory),
    ).toThrow();
    expect(() =>
      expectFrozenBatchIdentity(orientationBytes, digestDriftOrientation, inventory),
    ).toThrow();
  });

  it.each(unsupportedPositiveClaimMutations)("mutation: rejects positive %s claims", async (_label, claim) => {
    const orientation = await readJson<WaveAOrientation>(
      "migrations/V0_1_0a_1/core/wave-a-orientation.json",
    );
    const leaf = await readFile(join(root, findSubgroup(orientation).proposedLeafPath), "utf8");

    expect(() => expectEvidenceBoundaries(`${leaf}\n${claim}`)).toThrow();
  });

  it("registers only the bounded Runtime Identity leaf without promoting the Text Engine family", async () => {
    const [orientation, node, document, contractEvidence, digestEvidence, core, map, index, leaf, testSource] =
      await Promise.all([
        readJson<WaveAOrientation>("migrations/V0_1_0a_1/core/wave-a-orientation.json"),
        readJson<Record<string, unknown>>("data/nodes/text-engine.json"),
        readJson<Record<string, unknown>>("data/documents/text-engine-runtime-identity-evidence.json"),
        readJson<Record<string, unknown>>("data/evidence/text-engine-runtime-identity-contract.json"),
        readJson<Record<string, unknown>>("data/evidence/text-engine-runtime-identity-digest.json"),
        readJson<Record<string, unknown>>("data/nodes/core.json"),
        readFile(join(root, "docs/versions/V0_1_0a_1/core/DOCUMENT_MAP.md"), "utf8"),
        readJson<Record<string, unknown>>("generated/project-index.json"),
        readFile(join(root, expectedLeafPath), "utf8"),
        readFile(new URL(import.meta.url), "utf8"),
      ]);
    const subgroup = findSubgroup(orientation);

    expect(node).toEqual({
      kind: "node",
      id: registration.nodeId,
      title: "Text Engine",
      parentId: "core",
      summary: expectedNodeSummary,
      truthState: registration.nodeTruthState,
      order: 20,
      documentIds: [
        "doc-text-engine-wasm-toolchain-artifacts",
        registration.documentId,
        "doc-text-engine-adapter-provider",
        "doc-text-engine-rustybuzz-shaping",
        "doc-text-engine-overview",
      ],
      evidenceIds: [
        "evidence-text-engine-wasm-toolchain-gates",
        "evidence-text-engine-wasm-artifact-digest",
        registration.contractEvidenceId,
        registration.digestEvidenceId,
        "evidence-text-engine-adapter-contract",
        "evidence-text-engine-provider-bridge",
        "evidence-text-engine-rustybuzz-mapping-corpus",
        "evidence-text-engine-rustybuzz-line-wrap",
      ],
      repositoryIds: [registration.repositoryId, "repo-project-control"],
    });
    expect(document).toEqual({
      kind: "document",
      id: registration.documentId,
      title: "Text Engine Runtime Identity and Evidence",
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
    expect(contractEvidence).toEqual({
      kind: "evidence",
      id: registration.contractEvidenceId,
      nodeIds: [registration.nodeId],
      repositoryId: registration.repositoryId,
      commit: registration.commit,
      pathOrContractId: "packages/text-engine-rust-wasm/src/runtimeIdentity.ts",
      verificationSummary:
        "Focused Runtime Identity contract and JSON-safe digest-evidence builder verification passed against immutable code and fixture anchors; this does not establish runtime execution, parity, renderer acceptance, production readiness, or default-measurer replacement.",
      verifiedAt: "2026-08-14T00:00:00.000Z",
    });
    expect(digestEvidence).toEqual({
      kind: "evidence",
      id: registration.digestEvidenceId,
      nodeIds: [registration.nodeId],
      repositoryId: registration.repositoryId,
      commit: registration.commit,
      pathOrContractId:
        "packages/text-engine-rust-wasm/fixtures/runtime-identity-digest-evidence-population.v1.json",
      verificationSummary:
        "Tracked artifact blob matched 13782 bytes and SHA-256 4667b7fe401eddf09133a8a22af11456ab018b2a32c668a031b8120a79db8a44 at the pinned Core commit; native/WASM comparison remains not-run.",
      verifiedAt: "2026-08-14T00:00:00.000Z",
    });
    expect(core).toMatchObject({
      id: "core",
      truthState: "unknown",
      summary: expectedCoreSummary,
    });
    expect(map).toContain("[Text Engine WASM toolchain and artifacts](text-engine/wasm-toolchain-and-artifacts.md)");
    expect(map).toContain("[Text Engine Runtime Identity and Evidence](text-engine/runtime-identity-and-evidence.md)");
    expect(map).toContain("[Text Engine Adapter and Provider](text-engine/adapter-and-provider.md)");
    expect(map).toContain("[Text Engine Rustybuzz Shaping](text-engine/rustybuzz-shaping.md)");
    expect(map).toContain("[Text Engine Overview](text-engine/OVERVIEW.md)");
    expect(map).toContain(
      "Text Engine documentation synthesis is complete across four bounded leaves and one family overview; Text Engine remains unknown pending coverage, reference repair, and publication review, and no source cleanup is authorized.",
    );
    expect(map).not.toContain("None is a Text Engine family overview");
    expect(map).not.toContain("`rustybuzz-shaping` plus the family overview remain incomplete");
    expect(await fileExists("migrations/V0_1_0a_1/core/families/text-engine/coverage.json")).toBe(false);

    expectRegistrationProvenanceSafe(leaf, testSource, [node, document, contractEvidence, digestEvidence], subgroup.sourcePaths);

    const indexNodes = index.nodes as Record<string, unknown>[];
    const indexDocuments = index.documents as Record<string, unknown>[];
    const indexEvidence = index.evidence as Record<string, unknown>[];
    expect(indexNodes).toContainEqual({ ...node, childIds: [], workIds: [] });
    expect(indexDocuments).toContainEqual({ ...document, content: leaf });
    expect(indexEvidence).toContainEqual(contractEvidence);
    expect(indexEvidence).toContainEqual(digestEvidence);
    expect(
      indexEvidence
        .filter((evidence) => (evidence.nodeIds as string[]).includes(registration.nodeId))
        .map((evidence) => evidence.id),
    ).toEqual([
      "evidence-text-engine-adapter-contract",
      "evidence-text-engine-provider-bridge",
      registration.contractEvidenceId,
      registration.digestEvidenceId,
      "evidence-text-engine-rustybuzz-line-wrap",
      "evidence-text-engine-rustybuzz-mapping-corpus",
      "evidence-text-engine-wasm-artifact-digest",
      "evidence-text-engine-wasm-toolchain-gates",
    ]);
    expect(indexNodes).toContainEqual(
      expect.objectContaining({
        id: "core",
        truthState: "unknown",
        summary: expectedCoreSummary,
        childIds: ["core-route", registration.nodeId, "template-builder", "live-draft"],
      }),
    );
  });
});
