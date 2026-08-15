import { createHash } from "node:crypto";
import { access, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const root = join(fileURLToPath(new URL("..", import.meta.url)));

const expectedQualifiedSubgroup = "text-engine/adapter-and-provider";
const expectedLeafPath =
  "docs/versions/V0_1_0a_1/core/text-engine/adapter-and-provider.md";
const expectedFrozenSourceCommit = "76a2f2311a898e781f53773390d47b05812911e4";
const expectedCurrentCoreCommit = "c503a45c03e0ce3b7a6efba2b029ca842017faa0";
const expectedInventoryDigest =
  "36f54f2302d51895615a81767c92c0ccba18563703471c33169b3816b63e5f5b";
const expectedOrientationSha256 =
  "c6b8c74477a51a819bf45cf2e480e26b0c57e72b00dbab69a33080f48ec12b83";
const expectedOrientationBlob = "3609fb3151a91f68b49e747e4c0dddb7c5624d81";
const expectedSourceListSha256 =
  "82a77abd8c2e50850633bd0b1b75c481861dd78b1472aaa0541fc067c3b24e0d";
const expectedInventoryBlobIds = [
  "976d68889097a6ce8ec4f61cda9b9eacc2675464",
  "1a588e623ca364750bb2198ff72eb61e0bae7862",
  "c9f6103d47d9cd9ba45276d66e74bde6fc5930bb",
  "65b2ce1b5ef810f71542a01e59d475ff163dfa27",
  "cf58353cdb09f86a76e0f53e6ea0d17d5520498f",
  "41d6241ede940e11f98d591fbc98f018e5afff0a",
] as const;
const dependencyLeafBlobs = {
  "docs/versions/V0_1_0a_1/core/text-engine/runtime-identity-and-evidence.md":
    "2548592edd80b3f480928b129e86ca260904a3af",
  "docs/versions/V0_1_0a_1/core/text-engine/wasm-toolchain-and-artifacts.md":
    "bc55024985dc1f29086d35a7569fa1ec24bb38ea",
} as const;
const expectedHeadings = [
  "## Authority and Scope",
  "## Pipeline at a Glance",
  "## Adapter Request Contract",
  "## Produced Evidence Contract",
  "## Evidence Acceptance Contract",
  "## Measurement Draft Handoff",
  "## Optional Renderer-backed Provider",
  "## Drift Reporting and Adoption Boundary",
  "## Fail-closed Matrix",
  "## Current Verified State",
  "## Known Limits and Unknowns",
  "## Historical Design Notes",
  "## Evidence Anchors",
] as const;
const expectedSpiStates = ["ready-for-adapter-implementation", "blocked"] as const;
const expectedAcceptanceStates = ["accepted", "blocked"] as const;
const expectedHandoffStates = ["ready", "blocked"] as const;
const expectedProviderStates = ["ready", "blocked"] as const;
const expectedDriftStates = ["accepted", "rejected"] as const;
const expectedCoreAnchors = [
  "src/renderer/textEngineAdapterSpi.ts",
  "src/renderer/textEngineEvidenceAcceptance.ts",
  "src/renderer/textEngineMeasurementDraftHandoff.ts",
  "packages/text-engine-rust-wasm/src/rendererBackedProvider.ts",
  "tests/textEngineAdapterSpi.test.ts",
  "tests/textEngineEvidenceAcceptance.test.ts",
  "tests/textEngineMeasurementDraftHandoff.test.ts",
  "tests/textEngineAdapterPackageScaffold.test.ts",
  "tests/rendererBackedTextEngineProvider.test.ts",
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

async function readOrientationBytes(): Promise<Buffer> {
  return readFile(join(root, "migrations/V0_1_0a_1/core/wave-a-orientation.json"));
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

function expectStateVocabulary(
  leaf: string,
  label: string,
  expectedStates: readonly string[],
): void {
  const declarations = [...leaf.matchAll(new RegExp(`^\\| ${label} states \\| (.+) \\|$`, "gm"))];
  expect(declarations).toHaveLength(1);
  const values = declarations[0]?.[1]?.split(", ") ?? [];
  expect(values).toEqual(expectedStates);
  expect(new Set(values).size).toBe(values.length);
}

function expectNoUnsupportedPositiveClaims(leaf: string): void {
  const unsupportedPositiveClaims = [
    /Core executes (?:Rust|WASM|shaping|segmentation|font reads)\./i,
    /Malformed Evidence is accepted\./i,
    /Non-accepted Evidence is handed off\./i,
    /Glyph facts are added to VNextTextMeasurementDraft\./i,
    /Provider bypasses acceptance or handoff\./i,
    /Core imports the provider package\./i,
    /Provider replaces measureVNextText or pagination defaults\./i,
    /Drift accepted means production accepted\./i,
    /Seeded Evidence is real-engine production Evidence\./i,
    /Pagination cache or invalidation behavior changed\./i,
    /Native\/WASM parity is established\./i,
    /An accepted manifest is ready\./i,
    /Production readiness is established\./i,
    /Default binding is established\./i,
    /Text Engine is current because this leaf is registered\./i,
  ];
  for (const claim of unsupportedPositiveClaims) expect(leaf).not.toMatch(claim);
}

describe("Text Engine adapter and provider leaf", () => {
  it("preserves frozen ownership, provenance, pipeline sections, and state vocabularies", async () => {
    const [orientationBytes, orientation, inventory] = await Promise.all([
      readOrientationBytes(),
      readJson<WaveAOrientation>("migrations/V0_1_0a_1/core/wave-a-orientation.json"),
      readJson<CoreInventory>("migrations/V0_1_0a_1/core/inventory.json"),
    ]);
    const subgroup = findSubgroup(orientation);
    const leaf = await readFile(join(root, subgroup.proposedLeafPath), "utf8");

    expect(sha256(orientationBytes)).toBe(expectedOrientationSha256);
    expect(gitBlobId(orientationBytes)).toBe(expectedOrientationBlob);
    expect(orientation.sourceCommit).toBe(expectedFrozenSourceCommit);
    expect(orientation.inventoryDigest).toBe(expectedInventoryDigest);
    expect(inventory.sourceCommit).toBe(expectedFrozenSourceCommit);
    expect(inventory.sourceDigest).toBe(expectedInventoryDigest);
    expect(subgroup.proposedLeafPath).toBe(expectedLeafPath);
    expect(subgroup.sourcePaths).toHaveLength(6);
    expect(new Set(subgroup.sourcePaths).size).toBe(6);
    expect(sha256(subgroup.sourcePaths.join("\n"))).toBe(expectedSourceListSha256);
    expect(
      subgroup.sourcePaths.map((path) => inventory.files.find((file) => file.path === path)?.blobId),
    ).toEqual(expectedInventoryBlobIds);

    const headings = leaf.match(/^## .+$/gm) ?? [];
    expect(headings).toEqual(expectedHeadings);
    expectStateVocabulary(leaf, "SPI", expectedSpiStates);
    expectStateVocabulary(leaf, "Evidence Acceptance", expectedAcceptanceStates);
    expectStateVocabulary(leaf, "Handoff", expectedHandoffStates);
    expectStateVocabulary(leaf, "Provider", expectedProviderStates);
    expectStateVocabulary(leaf, "Drift report", expectedDriftStates);
    expect(leaf).toContain("Evidence Acceptance `accepted`");
    expect(leaf).toContain("Drift report `accepted`");
    expect(leaf).toContain(expectedCurrentCoreCommit);
    expect(leaf).toContain("createVNextTextEngineAdapterSpiPlan");
    expect(leaf).toContain("createVNextTextEngineEvidenceAcceptancePlan");
    expect(leaf).toContain("createVNextTextEngineMeasurementDraftHandoffPlan");
    expect(leaf).toContain("createFlowDocTextEngineRendererBackedProviderBridge");
    expect(leaf).toContain("createFlowDocTextEngineRendererBackedDriftReport");

    for (const anchor of expectedCoreAnchors) {
      expect(leaf).toContain(`flowdoc-vnext-core@${expectedCurrentCoreCommit}:${anchor}`);
    }
  });

  it("keeps dependency leaves and former-source ownership unchanged", async () => {
    const orientation = await readJson<WaveAOrientation>(
      "migrations/V0_1_0a_1/core/wave-a-orientation.json",
    );
    const subgroup = findSubgroup(orientation);
    const [leaf, testSource] = await Promise.all([
      readFile(join(root, subgroup.proposedLeafPath), "utf8"),
      readFile(new URL(import.meta.url), "utf8"),
    ]);

    for (const [path, blob] of Object.entries(dependencyLeafBlobs)) {
      expect(gitBlobId(await readFile(join(root, path)))).toBe(blob);
    }
    for (const formerSourcePath of subgroup.sourcePaths) {
      expect(leaf).not.toContain(formerSourcePath);
      expect(testSource).not.toContain(formerSourcePath);
    }
  });

  it("rejects unsupported positive-claim mutations", async () => {
    const orientation = await readJson<WaveAOrientation>(
      "migrations/V0_1_0a_1/core/wave-a-orientation.json",
    );
    const leaf = await readFile(join(root, findSubgroup(orientation).proposedLeafPath), "utf8");

    expectNoUnsupportedPositiveClaims(leaf);
    expect(() => expectNoUnsupportedPositiveClaims(`${leaf}\nCore executes WASM.`)).toThrow();
    expect(() => expectNoUnsupportedPositiveClaims(`${leaf}\nMalformed Evidence is accepted.`)).toThrow();
    expect(() => expectNoUnsupportedPositiveClaims(`${leaf}\nNon-accepted Evidence is handed off.`)).toThrow();
    expect(() =>
      expectNoUnsupportedPositiveClaims(`${leaf}\nGlyph facts are added to VNextTextMeasurementDraft.`),
    ).toThrow();
    expect(() => expectNoUnsupportedPositiveClaims(`${leaf}\nProvider bypasses acceptance or handoff.`)).toThrow();
    expect(() => expectNoUnsupportedPositiveClaims(`${leaf}\nCore imports the provider package.`)).toThrow();
    expect(() =>
      expectNoUnsupportedPositiveClaims(`${leaf}\nProvider replaces measureVNextText or pagination defaults.`),
    ).toThrow();
    expect(() => expectNoUnsupportedPositiveClaims(`${leaf}\nDrift accepted means production accepted.`)).toThrow();
    expect(() =>
      expectNoUnsupportedPositiveClaims(`${leaf}\nSeeded Evidence is real-engine production Evidence.`),
    ).toThrow();
    expect(() =>
      expectNoUnsupportedPositiveClaims(`${leaf}\nPagination cache or invalidation behavior changed.`),
    ).toThrow();
    expect(() => expectNoUnsupportedPositiveClaims(`${leaf}\nNative/WASM parity is established.`)).toThrow();
    expect(() => expectNoUnsupportedPositiveClaims(`${leaf}\nAn accepted manifest is ready.`)).toThrow();
    expect(() => expectNoUnsupportedPositiveClaims(`${leaf}\nProduction readiness is established.`)).toThrow();
    expect(() => expectNoUnsupportedPositiveClaims(`${leaf}\nDefault binding is established.`)).toThrow();
    expect(() =>
      expectNoUnsupportedPositiveClaims(`${leaf}\nText Engine is current because this leaf is registered.`),
    ).toThrow();
  });

  it("requires the candidate leaf to exist", async () => {
    const orientation = await readJson<WaveAOrientation>(
      "migrations/V0_1_0a_1/core/wave-a-orientation.json",
    );
    await expect(access(join(root, findSubgroup(orientation).proposedLeafPath))).resolves.toBeUndefined();
  });
});
