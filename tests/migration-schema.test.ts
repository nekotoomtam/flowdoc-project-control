import { readFile } from "node:fs/promises";
import { Ajv2020 } from "ajv/dist/2020.js";
import { describe, expect, it } from "vitest";

const validInventory = {
  kind: "core-document-inventory",
  schemaVersion: 1,
  releaseLine: "V0_1_0a_1",
  repositoryId: "repo-core",
  sourceCommit: "76a2f2311a898e781f53773390d47b05812911e4",
  expectedFileCount: 1,
  sourceDigest: "a".repeat(64),
  files: [
    {
      path: "docs/CORE_ROUTE_DEEXPORT_PLAN.md",
      blobId: "b".repeat(40),
      title: "Core Route De-export Plan",
      candidateFamily: "core-route",
      outboundMarkdownLinks: [],
      inboundMarkdownReferences: [],
      repositoryReferences: [],
    },
  ],
};

const validFamilyMap = {
  kind: "core-document-family-map",
  schemaVersion: 1,
  releaseLine: "V0_1_0a_1",
  inventoryDigest: "c".repeat(64),
  families: [
    {
      familyId: "core-route",
      reviewState: "pilot-reviewed",
      sources: [
        {
          path: "docs/CORE_ROUTE_DEEXPORT_PLAN.md",
          documentClass: "plan",
          authorityAssessment: "Authoritative migration plan.",
          provisionalDisposition: "candidate-current",
          canonicalDestination: "docs/core-route.md",
          migrationStatus: "migrated",
        },
      ],
    },
  ],
};

const validCoverage = {
  kind: "core-document-family-coverage",
  schemaVersion: 1,
  releaseLine: "V0_1_0a_1",
  familyId: "core-route",
  sourceCommit: "76a2f2311a898e781f53773390d47b05812911e4",
  inventoryDigest: "c".repeat(64),
  status: "closed",
  canonicalDocumentIds: ["core-route-migration"],
  sources: [
    {
      path: "docs/CORE_ROUTE_DEEXPORT_PLAN.md",
      blobId: "b".repeat(40),
      disposition: "canonical-section",
      destinationPath: "docs/core-route.md",
      destinationSection: "Migration",
      rationale: "Migrated into the canonical guide.",
    },
  ],
  activeReferences: [],
  retainedHistoricalReferences: [
    {
      sourcePath: "docs/history.md",
      line: 4,
      targetPath: "docs/CORE_ROUTE_DEEXPORT_PLAN.md",
      lineSha256: "d".repeat(64),
      rationale: "Historical migration record.",
    },
  ],
  projectControlPublicationCommit: "e".repeat(40),
  coreCleanupCommit: "f".repeat(40),
};

async function createValidator() {
  const schema = JSON.parse(await readFile("schemas/document-migration.schema.json", "utf8"));
  return new Ajv2020({ allErrors: true, strict: true }).compile(schema);
}

describe("document migration schema", () => {
  it("accepts complete inventory, family map, and closed coverage records", async () => {
    const validate = await createValidator();

    expect(validate(validInventory)).toBe(true);
    expect(validate(validFamilyMap)).toBe(true);
    expect(validate(validCoverage)).toBe(true);
  });

  it("accepts any structurally valid 40-hex source commit", async () => {
    const validate = await createValidator();
    const alternateCommit = "A".repeat(40);

    expect(validate({ ...validInventory, sourceCommit: alternateCommit })).toBe(true);
    expect(validate({ ...validCoverage, sourceCommit: alternateCommit })).toBe(true);
  });

  it.each([
    ["an absolute inventory path", { ...validInventory, files: [{ ...validInventory.files[0], path: "C:/Core/plan.md" }] }],
    ["a short blob ID", { ...validInventory, files: [{ ...validInventory.files[0], blobId: "b".repeat(39) }] }],
    ["a short source commit", { ...validInventory, sourceCommit: "a".repeat(39) }],
    ["a nonhex source commit", { ...validInventory, sourceCommit: "g".repeat(40) }],
    ["duplicate canonical document IDs", { ...validCoverage, canonicalDocumentIds: ["core-route-migration", "core-route-migration"] }],
    ["a deletion-ready coverage record without canonical documents", { ...validCoverage, status: "ready-for-deletion", canonicalDocumentIds: [] }],
    ["a closed coverage record without a Core cleanup commit", { ...validCoverage, coreCleanupCommit: null }],
  ])("rejects %s", async (_description, record) => {
    const validate = await createValidator();

    expect(validate(record)).toBe(false);
  });
});
