import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { validateCanonicalRecordValue } from "../tools/lib/load-sources.js";
import { createCoordinationRegistryFixture } from "./fixtures/coordination-registry.js";
import { createCoordinationRegistryV2Fixture } from "./fixtures/coordination-registry-v2.js";

function createWork(coordination: unknown): Record<string, unknown> {
  return {
    kind: "work",
    id: "coordination-schema-test",
    title: "Coordination schema test",
    nodeId: "agent-and-skill-design",
    repositoryIds: ["repo-project-control"],
    workState: "queued",
    summary: "Schema-only fixture.",
    requiredEvidence: [],
    coordination,
    createdAt: "2026-09-21T00:00:00.000Z",
    updatedAt: "2026-09-21T00:00:00.000Z",
  };
}

async function validateWorkWithCoordination(coordination: unknown) {
  return validateCanonicalRecordValue("work", "data/work/coordination-schema-test.json", createWork(coordination));
}

function injectRemovedTransferField(registry: Record<string, unknown>, field: string): void {
  if (field === "ownershipGeneration") {
    const roomRuns = registry.roomRuns as Array<Record<string, unknown>>;
    roomRuns[0]!.ownershipGeneration = 1;
    return;
  }

  const round = registry.round as Record<string, unknown>;
  round[field] = field === "transfers" ? [] : 1;
}

describe("coordination registry schema", () => {
  it("keeps coordination optional for historical Work while defining the typed registry", async () => {
    const schema = JSON.parse(await readFile("schemas/project-control.schema.json", "utf8")) as {
      $defs: { work: { required: string[]; properties: Record<string, unknown>; $defs?: Record<string, unknown> } };
    };

    expect(schema.$defs.work.required).not.toContain("coordination");
    expect(schema.$defs.work.properties).toHaveProperty("coordination");
    expect(schema.$defs.work.$defs).toMatchObject({
      coordinationV1: expect.any(Object),
      coordinationV2: expect.any(Object),
      coordinationV3: expect.any(Object),
      legacyModelDecision: expect.any(Object),
      compactModelDecision: expect.any(Object),
      scopeLockVerification: expect.any(Object),
    });
    expect(schema.$defs.work.$defs?.legacyModelDecision).toMatchObject({
      properties: { availableModelEfforts: expect.any(Object) },
    });
    expect(schema.$defs.work.$defs?.compactModelDecision).toMatchObject({
      properties: {
        capabilityClass: expect.any(Object),
        availabilitySnapshotRef: expect.any(Object),
      },
    });
  });

  it("keeps version 1 readable and accepts a non-transferable version 2 registry", async () => {
    expect(await validateWorkWithCoordination(createCoordinationRegistryFixture())).toEqual([]);
    expect(await validateWorkWithCoordination(createCoordinationRegistryV2Fixture())).toEqual([]);
  });

  it.each(["generation", "ownershipGeneration", "transfers"])(
    "rejects version 2 transfer field %s",
    async (field) => {
      const registry = structuredClone(createCoordinationRegistryV2Fixture()) as unknown as Record<string, unknown>;
      injectRemovedTransferField(registry, field);
      expect(await validateWorkWithCoordination(registry)).toContainEqual(
        expect.objectContaining({ code: "SCHEMA_ADDITIONAL_PROPERTY" }),
      );
    },
  );
});
