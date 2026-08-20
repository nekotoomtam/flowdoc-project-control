import { createHash } from "node:crypto";
import { access, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const root = join(fileURLToPath(new URL("..", import.meta.url)));

const subgroupId = "text-engine/rustybuzz-shaping";
const leafPath = "docs/versions/V0_1_0a_1/core/text-engine/rustybuzz-shaping.md";
const overviewPath = "docs/versions/V0_1_0a_1/core/text-engine/OVERVIEW.md";
const coreCommit = "c503a45c03e0ce3b7a6efba2b029ca842017faa0";
const projectControlCandidateCommit = "4b5abf19468448b2c1c75beda0274aaa40800dd7";

const registration = {
  nodeId: "text-engine",
  nodeTruthState: "unknown",
  leafDocumentId: "doc-text-engine-rustybuzz-shaping",
  leafDocumentRole: "contract",
  overviewDocumentId: "doc-text-engine-overview",
  overviewDocumentRole: "current-state",
  mappingCorpusEvidenceId: "evidence-text-engine-rustybuzz-mapping-corpus",
  lineWrapEvidenceId: "evidence-text-engine-rustybuzz-line-wrap",
  repositoryId: "repo-core",
  coreCommit: "c503a45c03e0ce3b7a6efba2b029ca842017faa0",
  verifiedAt: "2026-08-20T00:00:00.000Z",
} as const;

const overviewHeadings = [
  "## Authority and Status",
  "## Family Architecture",
  "## Canonical Documents",
  "## Ownership Map",
  "## Evidence Flow",
  "## Current Verified State",
  "## Known Limits and Unknowns",
  "## Migration and Cleanup Boundary",
  "## Evidence Anchors",
] as const;

const canonicalLeafLinks = [
  "wasm-toolchain-and-artifacts.md",
  "runtime-identity-and-evidence.md",
  "adapter-and-provider.md",
  "rustybuzz-shaping.md",
] as const;
const canonicalLeafPaths = [
  "docs/versions/V0_1_0a_1/core/text-engine/wasm-toolchain-and-artifacts.md",
  "docs/versions/V0_1_0a_1/core/text-engine/runtime-identity-and-evidence.md",
  "docs/versions/V0_1_0a_1/core/text-engine/adapter-and-provider.md",
  "docs/versions/V0_1_0a_1/core/text-engine/rustybuzz-shaping.md",
] as const;
const canonicalLeafBlobs = [
  "bc55024985dc1f29086d35a7569fa1ec24bb38ea",
  "2548592edd80b3f480928b129e86ca260904a3af",
  "11d8fca99265993ba5f8cf0505903026fb33310e",
  "f7028107cfddd4145d5a5e84bbf7afd2149ad6a1",
] as const;

const expectedNodeSummary =
  "Text Engine documentation synthesis is complete across four bounded leaves and one family overview; family truth remains unknown pending coverage, reference repair, and publication review, while production, default adoption, and native/WASM parity remain unknown.";
const expectedCoreSummary =
  "Broader Core remains unknown; the bounded core-route child is closed with recorded cleanup Evidence; the Text Engine documentation set is synthesized across four bounded leaves and one family overview, while migration coverage, reference repair, and family promotion remain incomplete.";
const expectedClosureWording =
  "Text Engine documentation synthesis is complete across four bounded leaves and one family overview; Text Engine remains unknown pending coverage, reference repair, and publication review, and no source cleanup is authorized.";
const expectedLeafAuthority =
  "Canonical contract limited to package-local native Rustybuzz smoke, strict raw mapping, the complete four-case bounded corpus, and seeded line-wrap Evidence; production readiness, default binding, native/WASM parity, real or generated ICU4X evidence, general typography, renderer readiness, and family-wide authority remain excluded.";
const expectedOverviewAuthority =
  "Current-state family overview limited to ownership relationships among the four reviewed canonical Text Engine leaves; migration completion, production readiness, default binding, native/WASM parity, publication readiness, cleanup authority, and broader Core truth remain excluded.";
const expectedMappingCorpusSummary =
  "Focused package-local native smoke, strict UTF-8-byte-cluster-to-UTF-16 and font-unit mapping, the complete four-case corpus, fail-closed behavior, and the missing-WASM-digest warning were verified; this does not establish production readiness, default binding, native/WASM parity, real or generated ICU4X evidence, or general renderer authority.";
const expectedLineWrapSummary =
  "Focused seeded multi-line Evidence was verified for ascending in-range cluster-safe breaks, exact non-overlapping glyph coverage, and passage through existing structural Evidence Acceptance and draft-handoff contracts; this does not establish production readiness, default binding, native/WASM parity, real or generated ICU4X evidence, or general renderer authority.";

const leafHeadings = [
  "## Authority and Scope",
  "## Evidence Pipeline",
  "## Package-local Native Smoke",
  "## UTF-8 Byte-cluster to UTF-16 Mapping",
  "## Four-case Smoke Corpus",
  "## Seeded Line-wrap Evidence",
  "## Evidence Acceptance and Draft Handoff",
  "## Fail-closed Matrix",
  "## Current Verified State",
  "## Known Limits and Unknowns",
  "## Historical Design Notes",
  "## Canonical Cross-references",
  "## Evidence Anchors",
] as const;

const boundaryStates = ["ready", "blocked"] as const;
const expectedStateDeclarations = [
  { label: "Raw mapping", value: "ready, blocked", heading: "## UTF-8 Byte-cluster to UTF-16 Mapping" },
  { label: "Corpus", value: "ready, blocked", heading: "## Four-case Smoke Corpus" },
  { label: "Line wrap", value: "ready, blocked", heading: "## Seeded Line-wrap Evidence" },
] as const;
const expectedOrientationSha256 =
  "c6b8c74477a51a819bf45cf2e480e26b0c57e72b00dbab69a33080f48ec12b83";
const expectedOrientationBlob = "3609fb3151a91f68b49e747e4c0dddb7c5624d81";
const expectedFrozenCommit = "76a2f2311a898e781f53773390d47b05812911e4";
const expectedInventoryDigest =
  "36f54f2302d51895615a81767c92c0ccba18563703471c33169b3816b63e5f5b";
const expectedSourceListSha256 =
  "8b1ccb5b9fa2f7dfbe8de97fb1d3411b6c62a663afe5fa0826d280fd23060814";
const expectedSourceBlobs = [
  "828af4b54139b6691f3e1873864173cf9a426971",
  "b0ba6e961d169c42defc0726889dcf3acde9bb82",
  "2cf9a00c016ce451c5618158b725c02c97c74f4b",
  "1174cde89460aab1be752e7ddd1d61710d1273ec",
] as const;
const dependencyBlobs = {
  "docs/versions/V0_1_0a_1/core/text-engine/wasm-toolchain-and-artifacts.md":
    "bc55024985dc1f29086d35a7569fa1ec24bb38ea",
  "docs/versions/V0_1_0a_1/core/text-engine/runtime-identity-and-evidence.md":
    "2548592edd80b3f480928b129e86ca260904a3af",
  "docs/versions/V0_1_0a_1/core/text-engine/adapter-and-provider.md":
    "11d8fca99265993ba5f8cf0505903026fb33310e",
  "data/evidence/text-engine-wasm-toolchain-gates.json":
    "77a8a23b4434867638ebb1ce55ecfdc81aa89e43",
  "data/evidence/text-engine-wasm-artifact-digest.json":
    "b45b1c0178cf5e54137d35e105a5678e0920f762",
  "data/evidence/text-engine-runtime-identity-contract.json":
    "7a4a630407cef17c406fe52f46f6a26dc9f8843f",
  "data/evidence/text-engine-runtime-identity-digest.json":
    "0196e313bb298a3f855ec05746a33519b3ed67a4",
  "data/evidence/text-engine-adapter-contract.json":
    "55fa7b6dc244a7b8ac5c2e17dfd861a8dad51d25",
  "data/evidence/text-engine-provider-bridge.json":
    "612fb05a7ada86c0fc565ef823d95b5b33b7bacf",
} as const;
const expectedCoreAnchors = [
  "packages/text-engine-rust-wasm/rust-shaper/Cargo.toml",
  "packages/text-engine-rust-wasm/rust-shaper/src/main.rs",
  "packages/text-engine-rust-wasm/src/rustybuzzRawMapping.ts",
  "packages/text-engine-rust-wasm/src/rustybuzzSmokeCorpus.ts",
  "packages/text-engine-rust-wasm/src/lineWrapEvidence.ts",
  "tests/textEngineRustybuzzSmokePackage.test.ts",
  "tests/textEngineRustybuzzRawMapping.test.ts",
  "tests/textEngineRustybuzzSmokeCorpus.test.ts",
  "tests/textEngineLineWrapEvidence.test.ts",
  "packages/text-engine-rust-wasm/fixtures/rustybuzz-native-smoke.corpus.v1.json",
  "packages/text-engine-rust-wasm/fixtures/rustybuzz-native-smoke.sarabun.v1.json",
  "packages/text-engine-rust-wasm/fixtures/rustybuzz-native-smoke.thai-combining.sarabun.v1.json",
  "packages/text-engine-rust-wasm/fixtures/rustybuzz-native-smoke.mixed-heading.sarabun-bold.v1.json",
  "packages/text-engine-rust-wasm/fixtures/rustybuzz-native-smoke.thai-currency.noto-sans-thai.v1.json",
] as const;
const expectedCorpusRows = [
  "| 1 | Sarabun regular Thai greeting | bounded |",
  "| 2 | Sarabun regular combining marks | bounded |",
  "| 3 | Sarabun bold mixed Thai/Latin/digit heading | bounded |",
  "| 4 | Noto Sans Thai currency-fallback text | bounded |",
] as const;

type WaveAOrientation = {
  sourceCommit: string;
  inventoryDigest: string;
  families: Array<{
    familyId: string;
    subgroups: Array<{ subgroupId: string; proposedLeafPath: string; sourcePaths: string[] }>;
  }>;
};
type CoreInventory = {
  sourceCommit: string;
  sourceDigest: string;
  files: Array<{ path: string; blobId: string }>;
};

async function readJson<T>(relativePath: string): Promise<T> {
  return JSON.parse(await readFile(join(root, relativePath), "utf8")) as T;
}

function sha256(value: Uint8Array | string): string {
  return createHash("sha256").update(value).digest("hex");
}

function gitBlobId(value: Uint8Array): string {
  return createHash("sha1")
    .update(`blob ${value.byteLength}\0`)
    .update(value)
    .digest("hex");
}

function findSubgroup(orientation: WaveAOrientation) {
  const subgroup = orientation.families
    .flatMap((family) => family.subgroups.map((candidate) => ({
      ...candidate,
      qualifiedId: `${family.familyId}/${candidate.subgroupId}`,
    })))
    .find(({ qualifiedId }) => qualifiedId === subgroupId);

  if (!subgroup) throw new Error(`Missing subgroup: ${subgroupId}`);
  return subgroup;
}

function expectStateVocabulary(leaf: string, label: string): void {
  const declarations = [...leaf.matchAll(new RegExp(`^\\| ${label} states \\| (.+) \\|$`, "gm"))];
  expect(declarations).toHaveLength(1);
  const values = declarations[0]?.[1]?.split(", ") ?? [];
  expect(values).toEqual(boundaryStates);
  expect(new Set(values).size).toBe(values.length);
}

function stateDeclarationRows(content: string) {
  return [...content.matchAll(/^\| (.+) states \| (.+) \|$/gm)]
    .map((match) => ({ label: match[1], value: match[2] }));
}

function expectStateDeclarations(leaf: string): void {
  const expectedRows = expectedStateDeclarations.map(({ label, value }) => ({ label, value }));
  expect(stateDeclarationRows(leaf)).toEqual(expectedRows);
  for (const expected of expectedStateDeclarations) {
    expect(stateDeclarationRows(sectionContent(leaf, expected.heading)))
      .toEqual([{ label: expected.label, value: expected.value }]);
  }
}

function sectionContent(leaf: string, heading: string): string {
  const headings = [...leaf.matchAll(/^## .+$/gm)];
  const index = headings.findIndex((match) => match[0] === heading);
  expect(index).toBeGreaterThanOrEqual(0);
  const start = (headings[index]?.index ?? 0) + heading.length;
  const end = headings[index + 1]?.index ?? leaf.length;
  return leaf.slice(start, end);
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function expectCorpusRows(section: string): void {
  expect([...section.matchAll(/^\| Case \| Bounded smoke case \| Scope \|$/gm)]).toHaveLength(1);
  expect([...section.matchAll(/^\| --- \| --- \| --- \|$/gm)]).toHaveLength(1);
  expect([...section.matchAll(/^\| \d+ \| .+ \| .+ \|$/gm)].map((match) => match[0]))
    .toEqual(expectedCorpusRows);
}

function didThrow(action: () => void): boolean {
  try {
    action();
    return false;
  } catch {
    return true;
  }
}

function expectNoFormerSources(targets: readonly string[], sourcePaths: readonly string[]): void {
  for (const sourcePath of sourcePaths) {
    for (const target of targets) expect(target).not.toContain(sourcePath);
  }
}

function expectImmutableCoreAnchors(leaf: string): void {
  for (const anchor of expectedCoreAnchors) {
    expect(leaf).toContain(`flowdoc-vnext-core@${coreCommit}:${anchor}`);
  }
  const refs = [...leaf.matchAll(/flowdoc-vnext-core@([^:\s`]+):/g)];
  expect(refs.length).toBeGreaterThan(0);
  for (const ref of refs) expect(ref[1]).toBe(coreCommit);
  const localAnchors = [...leaf.matchAll(/flowdoc-vnext-core@[^:\s`]+:([^\s`]+)/g)]
    .map((match) => match[1]);
  expect(localAnchors).toHaveLength(expectedCoreAnchors.length);
  expect(localAnchors).toEqual(expectedCoreAnchors);
  const allowedReferences = expectedCoreAnchors.map(
    (anchor) => `flowdoc-vnext-core@${coreCommit}:${anchor}`,
  );
  const coreReferenceTokens = (leaf.match(/[^\s`()[\]]*flowdoc-vnext-core[^\s`()[\]]*/g) ?? [])
    .map((token) => token.replace(/[.,;:]+$/, ""));
  expect(coreReferenceTokens).toEqual(allowedReferences);
  expect(leaf).not.toMatch(/(?:file:\/\/|[A-Za-z]:\\|\/(?:home|tmp)\/)/);
}

function expectBoundedClaims(leaf: string): void {
  const positiveClaimPatterns = [
    /\braw\s+byte\s+clusters?\b.{0,100}\bdirectly\b.{0,100}\b(?:flowdoc\s+)?utf-16\b/i,
    /\b(?:raw\s+)?rustybuzz\s+byte\s+clusters?\b.{0,100}\b(?:directly|serve)\b.{0,100}\b(?:flowdoc\s+)?utf-16\b/i,
    /\binvalid\s+utf-8(?:\s+cluster)?\s+boundar(?:y|ies)\b.{0,80}\b(?:guess(?:ed)?|repair(?:ed)?|round(?:ed)?|coerc(?:ed|e))\b/i,
    /\bfont\s+units?\b.{0,80}\b(?:already|without)\b.{0,80}\b(?:points?|fontsizept)\b/i,
    /\bpartial\s+corpus\b.{0,80}\b(?:ready|complete|accepted)\b/i,
    /\b(?:missing\s+wasm\s+digest|separately\s+tracked\s+wasm\s+artifact|bounded\s+native\s+fixture)\b.{0,100}\b(?:parity|determinism)\b.{0,80}\b(?:evidence|exists|established|proven)\b/i,
    /\bseeded\s+breaks?\b.{0,100}\b(?:icu4x|intl\.segmenter|thai[ -]?oracle|browser segmentation|production typography)\b/i,
    /\bbreaks?\b.{0,80}\b(?:may|can|are allowed to)\b.{0,80}\b(?:split|descend|out[- ]of[- ]range|repair)\b/i,
    /\bglyph(?:\s+coverage)?\b.{0,100}\b(?:overlap|omit|uncovered|covered twice)\b/i,
    /\bglyph\s+facts?\b.{0,100}\b(?:are added|added)\b.{0,100}\bVNextTextMeasurementDraft\b/i,
    /\bpublic\s+adapter\s+line\s+boxes?\b.{0,100}\b(?:break kind|break reason|break metadata)\b/i,
    /\b(?:core\s+imports|rustybuzz\s+package\s+imports)\b.{0,100}\b(?:rustybuzz|core)\b/i,
    /\bproduction(?:\s+engine)?\s+(?:binding|selection|readiness)\b.{0,80}\b(?:exists|established|ready|proven)\b/i,
    /\bdefault\s+(?:measurement|binding|replacement)\b.{0,80}\b(?:exists|established|ready|replaced)\b/i,
    /\bmeasurevnexttext\b.{0,80}\b(?:replaced|replacement)\b/i,
    /\bnative\/wasm\s+parity\b.{0,80}\b(?:exists|established|ready|proven)\b/i,
    /\bcross-runtime\s+determinism\b.{0,80}\b(?:exists|established|ready|proven)\b/i,
    /\bicu4x\s+qualification\b.{0,80}\b(?:exists|established|ready|proven)\b/i,
    /\b(?:general script|bidi|justification|hyphenation|typography fidelity)\b.{0,100}\b(?:exists|established|ready|proven)\b/i,
    /\b(?:renderer|pagination)\b.{0,100}\b(?:ready|accepted|established)\b/i,
    /\b(?:pdf|docx|backend|storage|browser-worker)\b.{0,100}\bintegration\b.{0,40}\b(?:exists|established|ready)\b/i,
    /\b(?:accepted manifest|rollout threshold|cache mutation)\b.{0,100}\b(?:exists|established|ready)\b/i,
  ];
  const clauses = leaf.replace(/\n+/g, " ")
    .split(/(?:[;,!?]+|\.(?=\s|$)|\b(?:but|however|although|while)\b)/i);
  for (const clause of clauses) {
    for (const pattern of positiveClaimPatterns) {
      const globalPattern = new RegExp(pattern.source, `${pattern.flags.replace("g", "")}g`);
      for (const match of clause.matchAll(globalPattern)) {
        if (/\b(?:not|unknown|excluded|remain|neither|none)\b/i.test(match[0])) continue;
        throw new Error(`Unsupported positive authority claim: ${match[0]}`);
      }
    }
  }
}

describe("Text Engine Rustybuzz candidate leaf", () => {
  it("preserves the frozen 4/4 ownership set and dependency bytes", async () => {
    const [orientationBytes, orientation, inventory, leaf, testSource] = await Promise.all([
      readFile(join(root, "migrations/V0_1_0a_1/core/wave-a-orientation.json")),
      readJson<WaveAOrientation>("migrations/V0_1_0a_1/core/wave-a-orientation.json"),
      readJson<CoreInventory>("migrations/V0_1_0a_1/core/inventory.json"),
      readFile(join(root, leafPath), "utf8"),
      readFile(new URL(import.meta.url), "utf8"),
    ]);
    const subgroup = findSubgroup(orientation);

    expect(sha256(orientationBytes)).toBe(expectedOrientationSha256);
    expect(gitBlobId(orientationBytes)).toBe(expectedOrientationBlob);
    expect(orientation.sourceCommit).toBe(expectedFrozenCommit);
    expect(orientation.inventoryDigest).toBe(expectedInventoryDigest);
    expect(inventory.sourceCommit).toBe(expectedFrozenCommit);
    expect(inventory.sourceDigest).toBe(expectedInventoryDigest);
    expect(subgroup.proposedLeafPath).toBe(leafPath);
    expect(subgroup.sourcePaths).toHaveLength(4);
    expect(new Set(subgroup.sourcePaths).size).toBe(4);
    expect(sha256(subgroup.sourcePaths.join("\n"))).toBe(expectedSourceListSha256);
    expect(subgroup.sourcePaths.map((path) => inventory.files.find((file) => file.path === path)?.blobId))
      .toEqual(expectedSourceBlobs);
    expect(leaf).not.toContain(overviewPath);

    for (const [path, blob] of Object.entries(dependencyBlobs)) {
      expect(gitBlobId(await readFile(join(root, path)))).toBe(blob);
    }
    expectNoFormerSources([leaf, testSource], subgroup.sourcePaths);
    expect(() => expectNoFormerSources(
      [leaf, `${testSource}\n${subgroup.sourcePaths[0]}`],
      subgroup.sourcePaths,
    )).toThrow();
  });

  it("keeps the candidate pipeline ordered, separate, and pinned to immutable Core anchors", async () => {
    const leaf = await readFile(join(root, leafPath), "utf8");
    const normalizedLeaf = leaf.replace(/\s+/g, " ");
    const headings = leaf.match(/^## .+$/gm) ?? [];

    expect(headings).toEqual(leafHeadings);
    expectStateDeclarations(leaf);
    expect(sectionContent(leaf, "## UTF-8 Byte-cluster to UTF-16 Mapping"))
      .toContain("| Raw mapping states | ready, blocked |");
    expect(sectionContent(leaf, "## Four-case Smoke Corpus"))
      .toContain("| Corpus states | ready, blocked |");
    expect(sectionContent(leaf, "## Seeded Line-wrap Evidence"))
      .toContain("| Line wrap states | ready, blocked |");
    expectCorpusRows(sectionContent(leaf, "## Four-case Smoke Corpus"));
    const pipeline = sectionContent(leaf, "## Evidence Pipeline");
    const pipelineStages = [
      "package-local native smoke",
      "raw Rustybuzz JSON",
      "UTF-8 byte-cluster / font-unit mapping",
      "FlowDoc UTF-16 single-line adapter evidence",
      "complete four-case bounded corpus",
      "seeded break opportunities + glyph Evidence on the accepted-evidence lane",
      "multi-line adapter evidence",
      "existing Core acceptance and draft-handoff boundary",
    ];
    for (const stage of pipelineStages) {
      expect([...pipeline.matchAll(new RegExp(escapeRegExp(stage), "g"))]).toHaveLength(1);
    }
    const stageOffsets = pipelineStages.map((stage) => pipeline.indexOf(stage));
    expect(stageOffsets).toEqual([...stageOffsets].sort((left, right) => left - right));
    expect(normalizedLeaf).toContain("package-local native smoke only");
    expect(normalizedLeaf).toContain("fontSizePt / unitsPerEm");
    expect(normalizedLeaf).toContain("missing-WASM-digest warning");
    expect(normalizedLeaf).toContain("seeded break evidence");
    expect(normalizedLeaf).toContain("every glyph is covered exactly once by non-overlapping ranges");
    expect(normalizedLeaf).toContain("public adapter line boxes remain unchanged");
    expect(normalizedLeaf).toContain("existing Core Evidence Acceptance and draft handoff remain the downstream owners");
    expect(normalizedLeaf).toContain("accepted means only the existing structural Evidence Acceptance contract");
    expect(normalizedLeaf).toContain("not production acceptance, drift acceptance, renderer acceptance, rollout acceptance, or default adoption");
    expect(normalizedLeaf).toContain("not accepted FlowDoc evidence by itself");
    expect(normalizedLeaf).toContain("not default measurement, renderer acceptance, broad script coverage, or production readiness");
    expect(normalizedLeaf).toContain("not language generality, native/WASM determinism, or production corpus sufficiency");
    expect(normalizedLeaf).toContain("not generated ICU4X, browser segmentation, Thai-oracle proof, typography fidelity, or pagination replacement");
    expectImmutableCoreAnchors(leaf);
  });

  it("rejects claim-boundary and mutable-anchor mutations", async () => {
    const leaf = await readFile(join(root, leafPath), "utf8");

    expectBoundedClaims(leaf);
    const claimMutations = [
      "Raw byte clusters are used directly as UTF-16 offsets.",
      "Invalid UTF-8 boundaries are repaired.",
      "Font units are used without fontSizePt / unitsPerEm.",
      "A partial corpus is ready.",
      "A missing WASM digest is promoted to parity evidence.",
      "Seeded breaks are generated ICU4X evidence.",
      "Breaks may split glyph clusters.",
      "Glyph coverage may overlap or omit glyphs.",
      "Public adapter line boxes include break metadata.",
      "Core imports the Rustybuzz package.",
      "The Rustybuzz package imports Core implementation.",
      "Production binding is established.",
      "Default measurement replacement is established.",
      "Native/WASM parity is established.",
      "ICU4X qualification is established.",
      "Renderer or pagination readiness is established.",
      "Cross-runtime determinism is established.",
      "measureVNextText is replaced by the package.",
      "A pagination measurer replacement is established.",
      "PDF, DOCX, backend, storage, or browser-worker integration is established.",
      "General script, bidi, justification, hyphenation, or typography fidelity is established.",
      "An accepted manifest, rollout threshold, or cache mutation is established.",
    ];
    expect(claimMutations.map((mutation) => didThrow(
      () => expectBoundedClaims(`${leaf}\n${mutation}`),
    ))).toEqual(new Array(claimMutations.length).fill(true));

    for (const ref of ["main", "master", "develop", "HEAD", "a1b2c3d", "v0.1.0", "feature/other", "refs/pull/123/head"]) {
      expect(() => expectImmutableCoreAnchors(
        `${leaf}\nflowdoc-vnext-core@${ref}:packages/text-engine-rust-wasm/src/rustybuzzRawMapping.ts`,
      )).toThrow();
    }
    expect(() => expectImmutableCoreAnchors(
      `${leaf}\nflowdoc-vnext-core@${coreCommit}:packages/text-engine-rust-wasm/src/RustybuzzRawMapping.ts`,
    )).toThrow();
  });

  it("requires the candidate leaf and the ordered family overview", async () => {
    await expect(access(join(root, leafPath))).resolves.toBeUndefined();
    await expect(access(join(root, overviewPath))).resolves.toBeUndefined();

    const [orientation, overview, testSource] = await Promise.all([
      readJson<WaveAOrientation>("migrations/V0_1_0a_1/core/wave-a-orientation.json"),
      readFile(join(root, overviewPath), "utf8"),
      readFile(new URL(import.meta.url), "utf8"),
    ]);
    const normalizedOverview = overview.replace(/\s+/g, " ");
    const headings = overview.match(/^## .+$/gm) ?? [];
    const links = [...overview.matchAll(/\]\(([^)]+\.md)\)/g)].map((match) => match[1]);

    expect(headings).toEqual(overviewHeadings);
    expect(links).toEqual(canonicalLeafLinks);
    expect(overview.match(/^\|/gm) ?? []).toEqual([]);
    expect(normalizedOverview).toContain(
      "package delivery/artifact facts → runtime identity/digest state → Core request/acceptance/handoff contracts → package-local native shaping/mapping/corpus/wrap evidence",
    );
    expect(normalizedOverview).toContain(
      "Core adapter request → package-local native smoke / raw Rustybuzz JSON → strict UTF-8-byte-to-UTF-16 and font-unit mapping → current complete four-case bounded corpus → seeded breaks + glyph Evidence on the accepted-evidence lane → multi-line adapter Evidence → Core structural Evidence Acceptance → Core measurement-draft handoff",
    );
    expect(normalizedOverview).toContain("Documentation synthesis is complete");
    expect(normalizedOverview).toContain(
      "Text Engine family truth remains unknown pending coverage, reference repair, publication review, and separately authorized cleanup",
    );
    expect(normalizedOverview).toContain(
      "Production selection, default adoption, native/WASM parity, real ICU4X evidence, and general typography remain unknown",
    );
    expect(normalizedOverview).toContain("no source cleanup is authorized");
    for (const [index, path] of canonicalLeafPaths.entries()) {
      expect(overview).toContain(
        `flowdoc-project-control@${projectControlCandidateCommit}:${path} (Git blob ${canonicalLeafBlobs[index]})`,
      );
    }
    expectNoFormerSources([overview, testSource], findSubgroup(orientation).sourcePaths);
  });

  it("registers the closeout reciprocally without coverage, cleanup authority, or truth promotion", async () => {
    const [
      orientation,
      leaf,
      overview,
      leafDocument,
      overviewDocument,
      mappingCorpusEvidence,
      lineWrapEvidence,
      node,
      core,
      map,
      index,
      testSource,
    ] = await Promise.all([
      readJson<WaveAOrientation>("migrations/V0_1_0a_1/core/wave-a-orientation.json"),
      readFile(join(root, leafPath), "utf8"),
      readFile(join(root, overviewPath), "utf8"),
      readJson<Record<string, unknown>>("data/documents/text-engine-rustybuzz-shaping.json"),
      readJson<Record<string, unknown>>("data/documents/text-engine-overview.json"),
      readJson<Record<string, unknown>>("data/evidence/text-engine-rustybuzz-mapping-corpus.json"),
      readJson<Record<string, unknown>>("data/evidence/text-engine-rustybuzz-line-wrap.json"),
      readJson<Record<string, unknown>>("data/nodes/text-engine.json"),
      readJson<Record<string, unknown>>("data/nodes/core.json"),
      readFile(join(root, "docs/versions/V0_1_0a_1/core/DOCUMENT_MAP.md"), "utf8"),
      readJson<Record<string, unknown>>("generated/project-index.json"),
      readFile(new URL(import.meta.url), "utf8"),
    ]);

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
        "doc-text-engine-runtime-identity-evidence",
        "doc-text-engine-adapter-provider",
        registration.leafDocumentId,
        registration.overviewDocumentId,
      ],
      evidenceIds: [
        "evidence-text-engine-wasm-toolchain-gates",
        "evidence-text-engine-wasm-artifact-digest",
        "evidence-text-engine-runtime-identity-contract",
        "evidence-text-engine-runtime-identity-digest",
        "evidence-text-engine-adapter-contract",
        "evidence-text-engine-provider-bridge",
        registration.mappingCorpusEvidenceId,
        registration.lineWrapEvidenceId,
      ],
      repositoryIds: [registration.repositoryId, "repo-project-control"],
    });
    expect(leafDocument).toEqual({
      kind: "document",
      id: registration.leafDocumentId,
      title: "Text Engine Rustybuzz Shaping",
      path: leafPath,
      nodeIds: [registration.nodeId],
      role: registration.leafDocumentRole,
      authority: expectedLeafAuthority,
      lifecycle: "active",
      repositoryRefs: expectedCoreAnchors.map((pathOrContractId) => ({
        repositoryId: registration.repositoryId,
        commit: registration.coreCommit,
        pathOrContractId,
      })),
    });
    expect(overviewDocument).toEqual({
      kind: "document",
      id: registration.overviewDocumentId,
      title: "Text Engine Overview",
      path: overviewPath,
      nodeIds: [registration.nodeId],
      role: registration.overviewDocumentRole,
      authority: expectedOverviewAuthority,
      lifecycle: "active",
      repositoryRefs: canonicalLeafPaths.map((pathOrContractId) => ({
        repositoryId: "repo-project-control",
        commit: projectControlCandidateCommit,
        pathOrContractId,
      })),
    });
    expect(mappingCorpusEvidence).toEqual({
      kind: "evidence",
      id: registration.mappingCorpusEvidenceId,
      nodeIds: [registration.nodeId],
      repositoryId: registration.repositoryId,
      commit: registration.coreCommit,
      pathOrContractId: "packages/text-engine-rust-wasm/src/rustybuzzRawMapping.ts",
      verificationSummary: expectedMappingCorpusSummary,
      verifiedAt: registration.verifiedAt,
    });
    expect(lineWrapEvidence).toEqual({
      kind: "evidence",
      id: registration.lineWrapEvidenceId,
      nodeIds: [registration.nodeId],
      repositoryId: registration.repositoryId,
      commit: registration.coreCommit,
      pathOrContractId: "packages/text-engine-rust-wasm/src/lineWrapEvidence.ts",
      verificationSummary: expectedLineWrapSummary,
      verifiedAt: registration.verifiedAt,
    });
    expect(core).toMatchObject({
      id: "core",
      truthState: "unknown",
      summary: expectedCoreSummary,
    });

    const mapLinks = [...map.matchAll(/\[Text Engine[^\]]*\]\((text-engine\/[^)]+\.md)\)/g)]
      .map((match) => match[1]);
    expect(mapLinks).toEqual([
      "text-engine/OVERVIEW.md",
      "text-engine/wasm-toolchain-and-artifacts.md",
      "text-engine/runtime-identity-and-evidence.md",
      "text-engine/adapter-and-provider.md",
      "text-engine/rustybuzz-shaping.md",
    ]);
    expect(map).toContain(expectedClosureWording);
    expect(map).not.toContain("None is a Text Engine family overview");
    expect(map).not.toContain("`rustybuzz-shaping` plus the family overview remain incomplete");
    await expect(access(join(
      root,
      "migrations/V0_1_0a_1/core/families/text-engine/coverage.json",
    ))).rejects.toThrow();
    expect((node.evidenceIds as string[]).some((id) => /coverage|cleanup/i.test(id))).toBe(false);

    const indexNodes = index.nodes as Record<string, unknown>[];
    const indexDocuments = index.documents as Record<string, unknown>[];
    const indexEvidence = index.evidence as Record<string, unknown>[];
    expect(indexNodes).toContainEqual({ ...node, childIds: [], workIds: [] });
    expect(indexNodes).toContainEqual(expect.objectContaining({
      id: "core",
      truthState: "unknown",
      summary: expectedCoreSummary,
      childIds: ["core-route", registration.nodeId],
    }));
    expect(indexDocuments).toContainEqual({ ...leafDocument, content: leaf });
    expect(indexDocuments).toContainEqual({ ...overviewDocument, content: overview });
    expect(indexEvidence).toContainEqual(mappingCorpusEvidence);
    expect(indexEvidence).toContainEqual(lineWrapEvidence);
    expect(indexDocuments
      .filter((document) => (document.nodeIds as string[]).includes(registration.nodeId))
      .map((document) => document.id)).toEqual([
      "doc-text-engine-adapter-provider",
      registration.overviewDocumentId,
      "doc-text-engine-runtime-identity-evidence",
      registration.leafDocumentId,
      "doc-text-engine-wasm-toolchain-artifacts",
    ]);
    expect(indexEvidence
      .filter((evidence) => (evidence.nodeIds as string[]).includes(registration.nodeId))
      .map((evidence) => evidence.id)).toEqual([
      "evidence-text-engine-adapter-contract",
      "evidence-text-engine-provider-bridge",
      "evidence-text-engine-runtime-identity-contract",
      "evidence-text-engine-runtime-identity-digest",
      registration.lineWrapEvidenceId,
      registration.mappingCorpusEvidenceId,
      "evidence-text-engine-wasm-artifact-digest",
      "evidence-text-engine-wasm-toolchain-gates",
    ]);

    const subgroup = findSubgroup(orientation);
    expectNoFormerSources([
      leaf,
      overview,
      testSource,
      JSON.stringify(leafDocument),
      JSON.stringify(overviewDocument),
      JSON.stringify(mappingCorpusEvidence),
      JSON.stringify(lineWrapEvidence),
      JSON.stringify(node),
      map,
      JSON.stringify(index),
    ], subgroup.sourcePaths);
  });

  it("rejects contract-review mutation variants", async () => {
    const leaf = await readFile(join(root, leafPath), "utf8");
    const corpus = sectionContent(leaf, "## Four-case Smoke Corpus");
    const mutations = [
      () => expectStateDeclarations(`${leaf}\n| Renderer states | ready, blocked |`),
      () => expectCorpusRows(`${corpus}\n| 5 | Extra bounded case | bounded |`),
      () => expectBoundedClaims(`${leaf}\nProduction binding now exists.`),
      () => expectBoundedClaims(`${leaf}\nRaw Rustybuzz byte clusters serve directly as FlowDoc UTF-16 offsets.`),
      () => expectBoundedClaims(`${leaf}\nAn invalid UTF-8 cluster boundary is repaired.`),
      () => expectBoundedClaims(`${leaf}\nA partial corpus is complete.`),
      () => expectBoundedClaims(`${leaf}\nSeeded breaks come from ICU4X.`),
      () => expectBoundedClaims(`${leaf}\nDefault measurement is now ready.`),
      () => expectBoundedClaims(`${leaf}\nNative/WASM parity now exists.`),
      () => expectBoundedClaims(`${leaf}\nGeneral typography fidelity is established.`),
      () => expectBoundedClaims(`${leaf}\nThe renderer is ready.`),
      () => expectBoundedClaims(`${leaf}\nPagination replacement is established.`),
      () => expectImmutableCoreAnchors(`${leaf}\nhttps://github.com/example/flowdoc-vnext-core/tree/main/packages/text-engine-rust-wasm/src/rustybuzzRawMapping.ts`),
      () => expectImmutableCoreAnchors(`${leaf}\nhttps://raw.githubusercontent.com/example/flowdoc-vnext-core/main/packages/text-engine-rust-wasm/src/rustybuzzRawMapping.ts`),
      () => expectImmutableCoreAnchors(`${leaf}\nhttps://github.com/example/flowdoc-vnext-core/blob/v0.1.0/packages/text-engine-rust-wasm/src/rustybuzzRawMapping.ts`),
      () => expectImmutableCoreAnchors(`${leaf}\nhttps://github.com/example/flowdoc-vnext-core/blob/a1b2c3d/packages/text-engine-rust-wasm/src/rustybuzzRawMapping.ts`),
      () => expectImmutableCoreAnchors(`${leaf}\nhttps://github.com/example/flowdoc-vnext-core/blob/feature/other/packages/text-engine-rust-wasm/src/rustybuzzRawMapping.ts`),
      () => expectImmutableCoreAnchors(`${leaf}\nhttps://github.com/example/flowdoc-vnext-core/blob/refs/pull/123/head/packages/text-engine-rust-wasm/src/rustybuzzRawMapping.ts`),
      () => expectImmutableCoreAnchors(`${leaf}\nhttps://github.com/example/flowdoc-vnext-core/blob/${coreCommit}/packages/text-engine-rust-wasm/src/RustybuzzRawMapping.ts`),
    ];

    expect(mutations.map(didThrow)).toEqual(new Array(mutations.length).fill(true));
  });

  it("evaluates authority claims clause by clause", async () => {
    const leaf = await readFile(join(root, leafPath), "utf8");
    const mixedPositiveClaims = [
      "Production binding now exists; renderer integration remains unknown.",
      "Raw Rustybuzz byte clusters serve directly as FlowDoc UTF-16 offsets, not merely as byte offsets.",
      "Seeded breaks come from Intl.Segmenter.",
    ];
    const legitimateNegativeControls = [
      "Production binding is not established; renderer integration remains unknown.",
      "Raw Rustybuzz byte clusters do not serve directly as FlowDoc UTF-16 offsets; they remain byte offsets until mapping.",
      "Seeded breaks do not come from Intl.Segmenter.",
    ];

    expect(mixedPositiveClaims.map((claim) => didThrow(
      () => expectBoundedClaims(`${leaf}\n${claim}`),
    ))).toEqual(new Array(mixedPositiveClaims.length).fill(true));
    expect(legitimateNegativeControls.map((claim) => didThrow(
      () => expectBoundedClaims(`${leaf}\n${claim}`),
    ))).toEqual(new Array(legitimateNegativeControls.length).fill(false));
  });
});
