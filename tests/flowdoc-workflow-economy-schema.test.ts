import { describe, expect, it } from "vitest";
import { createRoutineWorkflowPacketV2 } from "../src/model/workflow-economy.js";
import { validateCanonicalRecordValue } from "../tools/lib/load-sources.js";
import {
  createCoordinationRegistryV3Fixture,
  createInvalidLargeCoordinationRegistryV3Fixture,
  createLegacyCoordinationRegistryV3Fixture,
} from "./fixtures/coordination-registry-v3.js";

function createWork(coordination: unknown): Record<string, unknown> {
  return {
    kind: "work",
    id: "workflow-economy-schema-test",
    title: "Workflow economy schema test",
    nodeId: "project-control",
    repositoryIds: ["repo-project-control"],
    workState: "queued",
    summary: "Schema-only fixture for the version 3 workflow contract.",
    requiredEvidence: [],
    coordination,
    createdAt: "2026-09-24T00:00:00.000Z",
    updatedAt: "2026-09-24T00:00:00.000Z",
  };
}

async function schemaDiagnostics(coordination: unknown) {
  return validateCanonicalRecordValue(
    "work",
    "data/work/workflow-economy-schema-test.json",
    createWork(coordination),
  );
}

function packet(registry: unknown): Record<string, unknown> {
  const rooms = (registry as Record<string, unknown>).roomRuns as Array<Record<string, unknown>>;
  return rooms[0]!.packet as Record<string, unknown>;
}

function addReturnedHandoff(registry: unknown): Record<string, unknown> {
  const handoff = {
    handoffId: "workflow-economy-handoff-0",
    payloadDigest: "0".repeat(64),
    payload: {
      planTaskId: "plan-economy-1",
      roundId: "round-economy-1",
      roomRunId: "workflow-economy-room",
      laneId: "workflow-economy-lane",
      ownerRepositoryId: "repo-project-control",
      revisionAttempt: 0,
      status: "PASS",
      behaviorChanged: true,
      behaviorSummary: "Added the version 3 packet contract.",
      changedFiles: ["src/model/workflow-economy.ts"],
      tests: ["tests/flowdoc-workflow-economy-schema.test.ts"],
      evidenceIds: [],
      risks: [],
      unknowns: [],
      completion: {
        behaviorChanged: "Added the version 3 packet contract.",
        proof: [{ kind: "test", reference: "tests/flowdoc-workflow-economy-schema.test.ts" }],
        remainingUnknowns: [],
        downstreamInformation: "Task 2 may consume the version 3 types.",
        changedFiles: ["src/model/workflow-economy.ts"],
        createdEvidenceIds: [],
        createdDocumentIds: [],
        reviewCyclesUsed: 0,
        implementationCommitCount: 1,
      },
    },
    transport: { status: "sent", attempts: 1, attemptHistory: [{ attemptedAt: "2026-09-24T00:05:00.000Z", outcome: "sent" }] },
    receipt: { status: "received", receivedAt: "2026-09-24T00:05:01.000Z" },
    acceptance: { status: "pending", evidenceIds: [], requiredChecks: [], remainingScope: [] },
  };
  (registry as Record<string, unknown>).handoffs = [handoff];
  return handoff.payload;
}

describe("workflow economy version 3 schema", () => {
  it("defaults a packet to routine proof without deriving risk from medium size", () => {
    const fixture = createCoordinationRegistryV3Fixture({ workSize: "medium" });
    const source = packet(fixture);
    const { risk: _risk, proofBudget: _proofBudget, ...input } = source;

    expect(createRoutineWorkflowPacketV2(input as never)).toMatchObject({
      workSize: "medium",
      risk: { tier: "routine" },
      proofBudget: {
        maxNewEvidence: 0,
        maxDurableDocuments: 0,
        maxReviewCycles: 0,
        closeForm: "none",
        authorizedArtifacts: [],
      },
    });
  });

  it("accepts a complete routine packet", async () => {
    expect(await schemaDiagnostics(createCoordinationRegistryV3Fixture())).toEqual([]);
  });

  it("keeps legacy policy v1 packets readable without rewriting their inline model snapshot", async () => {
    const registry = createLegacyCoordinationRegistryV3Fixture();

    expect(packet(registry).policyId).toBe("flowdoc-workflow-economy-v1");
    expect(await schemaDiagnostics(registry)).toEqual([]);
  });

  it("requires the current policy v2 packet to bind Scope Lock v1", async () => {
    const registry = createCoordinationRegistryV3Fixture();
    expect(packet(registry)).toMatchObject({
      policyId: "flowdoc-workflow-economy-v2",
      scopeLock: {
        version: 1,
        enforcement: "git-worktree",
        baseCommit: "c".repeat(40),
        worktree: "C:/worktrees/workflow-economy",
      },
    });
    delete packet(registry).scopeLock;

    expect(await schemaDiagnostics(registry)).toContainEqual(
      expect.objectContaining({
        code: "SCHEMA_REQUIRED",
        message: expect.stringContaining("must have required property 'scopeLock'"),
      }),
    );
  });

  it.each(["capabilityClass", "availabilitySnapshotRef"])(
    "requires compact model decision field %s on the current profile",
    async (field) => {
      const registry = createCoordinationRegistryV3Fixture() as unknown as Record<string, unknown>;
      const room = (registry.roomRuns as Array<Record<string, unknown>>)[0]!;
      delete (room.modelDecision as Record<string, unknown>)[field];

      expect(await schemaDiagnostics(registry)).toContainEqual(
        expect.objectContaining({
          code: "SCHEMA_REQUIRED",
          message: expect.stringContaining(`must have required property '${field}'`),
        }),
      );
    },
  );

  it.each([
    "goal",
    "ownerRepositoryId",
    "allowedScope",
    "acceptanceCriteria",
    "workSize",
    "risk",
    "proofBudget",
    "modelDecision",
    "escalationTriggers",
    "returnRoute",
  ])("rejects a version 3 packet missing %s", async (field) => {
    const registry = createCoordinationRegistryV3Fixture();
    delete packet(registry)[field];

    expect(await schemaDiagnostics(registry)).toContainEqual(
      expect.objectContaining({
        code: "SCHEMA_REQUIRED",
        message: expect.stringContaining(
          `/coordination/roomRuns/0/packet must have required property '${field}'`,
        ),
      }),
    );
  });

  it("rejects large Work before dispatch", async () => {
    const registry = createInvalidLargeCoordinationRegistryV3Fixture();

    expect(await schemaDiagnostics(registry)).toContainEqual(
      expect.objectContaining({ code: "SCHEMA_ENUM" }),
    );
  });

  it("keeps Work Size independent from Risk Tier", async () => {
    expect(await schemaDiagnostics(createCoordinationRegistryV3Fixture({
      workSize: "small",
      riskTier: "critical",
      escalationReason: "Authority contract change",
    }))).toEqual([]);
    expect(await schemaDiagnostics(createCoordinationRegistryV3Fixture({
      workSize: "medium",
      riskTier: "routine",
    }))).toEqual([]);
  });

  it("requires a reason before promoting work to critical", async () => {
    const registry = createCoordinationRegistryV3Fixture({ riskTier: "critical" });

    expect(await schemaDiagnostics(registry)).toContainEqual(
      expect.objectContaining({
        code: "SCHEMA_REQUIRED",
        message: expect.stringContaining(
          "/coordination/roomRuns/0/packet/risk must have required property 'escalationReason'",
        ),
      }),
    );
  });

  it("accepts the compact four-field completion report on a version 3 handoff", async () => {
    const registry = createCoordinationRegistryV3Fixture();
    addReturnedHandoff(registry);

    expect(await schemaDiagnostics(registry)).toEqual([]);
  });

  it("requires a completion report on every version 3 handoff", async () => {
    const registry = createCoordinationRegistryV3Fixture();
    const payload = addReturnedHandoff(registry);
    delete payload.completion;

    expect(await schemaDiagnostics(registry)).toContainEqual(
      expect.objectContaining({
        code: "SCHEMA_REQUIRED",
        message: expect.stringContaining(
          "/coordination/handoffs/0/payload must have required property 'completion'",
        ),
      }),
    );
  });
});
