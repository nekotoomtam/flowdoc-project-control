import { loadProjectSources } from "../tools/lib/load-sources.js";
import { validateProjectSemantics } from "../tools/lib/validate-semantics.js";
import { packetDigest } from "../src/model/coordination-v3.js";
import { describe, expect, it } from "vitest";
import { applyCoordinationCommand, validateCoordinationRegistries } from "../src/model/coordination.js";
import { createCoordinationRegistryFixture } from "./fixtures/coordination-registry.js";
import { createCoordinationRegistryV2Fixture } from "./fixtures/coordination-registry-v2.js";
import { createCoordinationRegistryV3Fixture } from "./fixtures/coordination-registry-v3.js";
import type { CoordinationRegistryV3, WorkRecord } from "../src/model/types.js";

function current(suffix: string): CoordinationRegistryV3 {
  const registry = createCoordinationRegistryV3Fixture();
  registry.round.planTaskId = `plan-${suffix}`;
  registry.round.roundId = `round-${suffix}`;
  registry.round.workId = suffix;
  registry.roomRuns = [];
  registry.integrationClaims[0]!.planTaskId = registry.round.planTaskId;
  registry.integrationClaims[0]!.roundId = registry.round.roundId;
  return registry;
}
function codes(records: Array<Pick<WorkRecord, "id" | "coordination">>) {
  return validateCoordinationRegistries(records, new Map()).map(({ code }) => code);
}
const conflicts = ["COORDINATION_SCOPE_CONFLICT", "COORDINATION_FILE_SCOPE_CONFLICT", "COORDINATION_INTEGRATION_OWNER_CONFLICT"];

describe("historical coordination and live v3 exclusivity", () => {
  it.each([1, 2] as const)("keeps v%s claims historical in either input order without mutating them", (version) => {
    const historical = version === 1 ? createCoordinationRegistryFixture() : createCoordinationRegistryV2Fixture();
    const live = current("live");
    const ownership = historical.version === 1 ? historical.scopeOwnership : historical.round;
    ownership.scopeKeys = [...live.round.scopeKeys];
    historical.integrationClaims[0]!.repositoryId = "repo-project-control";
    const id = historical.version === 1 ? "history" : historical.round.workId;
    const records = [{ id, coordination: historical }, { id: "live", coordination: live }];
    const before = structuredClone(records);
    expect(codes(records)).toEqual([]);
    expect(codes([...records].reverse())).toEqual([]);
    expect(records).toEqual(before);
    expect(() => applyCoordinationCommand(historical, { type: "release-round", planTaskId: "historical", roundId: "historical" }))
      .toThrowError(expect.objectContaining({ code: "HISTORICAL_REGISTRY_READ_ONLY" }));
  });

  it("rejects all three live v3 ownership collisions", () => {
    expect(codes([{ id: "one", coordination: current("one") }, { id: "two", coordination: current("two") }]))
      .toEqual(expect.arrayContaining(conflicts));
  });

  it.each(["released", "cancelled"] as const)("keeps %s v3 claims out of live exclusivity while reporting malformed state", (state) => {
    const closed = current("closed");
    closed.round.state = state;
    expect(codes([{ id: "closed", coordination: closed }, { id: "live", coordination: current("live") }]))
      .toEqual(["COORDINATION_INTEGRATION_CLAIM_MISMATCH"]);
    closed.integrationClaims[0]!.state = "released";
    expect(codes([{ id: "closed", coordination: closed }, { id: "live", coordination: current("live") }])).toEqual([]);
    expect(() => applyCoordinationCommand(closed, { type: "release-round", planTaskId: "plan-closed", roundId: "round-closed" }))
      .toThrow();
  });

  it.each([1, 2] as const)("still detects malformed historical v%s integration ownership", (version) => {
    const registry = version === 1 ? createCoordinationRegistryFixture() : createCoordinationRegistryV2Fixture();
    registry.integrationClaims[0]!.planTaskId = "wrong";
    expect(codes([{ id: version === 1 ? "history" : "work-v2", coordination: registry }]))
      .toContain(version === 1 ? "COORDINATION_INTEGRATION_CLAIM_MISMATCH" : "COORDINATION_INTEGRATION_OWNER_MISMATCH");
  });

  it.each([1, 2, 3] as const)("rejects reusing a historical v%s room identity in live v3", (version) => {
    const historical = version === 1 ? createCoordinationRegistryFixture() : version === 2 ? createCoordinationRegistryV2Fixture() : createCoordinationRegistryV3Fixture();
    if (historical.version === 3) historical.round.state = "released";
    const live = createCoordinationRegistryV3Fixture();
    live.roomRuns[0]!.locator.threadId = historical.roomRuns[0]!.locator.threadId;
    live.round.planTaskId = "fresh-plan";
    live.round.roundId = "fresh-round";
    expect(codes([{ id: "history", coordination: historical }, { id: "live", coordination: live }]))
      .toContain("COORDINATION_EXECUTION_IDENTITY_REUSED");
  });

  it("rejects duplicate active PLAN/round identity across Work records", () => {
    const first = current("one");
    const duplicate = structuredClone(first);
    duplicate.round.workId = "duplicate";
    expect(codes([{ id: "one", coordination: first }, { id: "duplicate", coordination: duplicate }]))
      .toContain("COORDINATION_PLAN_ROUND_REUSED");
  });
});

describe("Stage 4 accepted Evidence reuse", () => {
  it("admits the existing Stage 4 Evidence in a fresh v3 packet and rejects missing or mismatched validity", async () => {
    const loaded = await loadProjectSources(process.cwd());
    // This Evidence fixture owns its synthetic round; unrelated live rounds
    // are covered by the exclusivity tests above, not this validity check.
    for (const record of loaded.work) delete record.value.coordination;
    const workId = "project-control-b1-prerequisites-2026-09-26";
    const work = loaded.work.find(({ value }) => value.id === workId)!;
    const evidenceId = "evidence-core-rust-stage4-multispan-cumulative-2026-09-21";
    const evidence = loaded.evidence.find(({ value }) => value.id === evidenceId)!.value;
    const registry = createCoordinationRegistryV3Fixture();
    registry.round.workId = workId;
    const room = registry.roomRuns[0]!;
    room.phaseId = `phase-${workId}`;
    room.checklistId = `checklist-${workId}`;
    room.requiredEvidence = [evidenceId];
    room.packet.relevantEvidenceIds = [evidenceId];
    room.packetDigest = packetDigest(room.packet);
    work.value.coordination = registry;
    await expect(validateProjectSemantics(loaded)).resolves.toBeDefined();
    const validity = structuredClone(evidence.validity!);
    delete evidence.validity;
    await expect(validateProjectSemantics(loaded)).rejects.toMatchObject({ diagnostics: expect.arrayContaining([expect.objectContaining({ code: "WORKFLOW_EVIDENCE_VALIDITY_REQUIRED" })]) });
    evidence.validity = { ...validity, sourceRevision: "0".repeat(40) };
    await expect(validateProjectSemantics(loaded)).rejects.toMatchObject({ diagnostics: expect.arrayContaining([expect.objectContaining({ code: "EVIDENCE_VALIDITY_REVISION_MISMATCH" })]) });
  });
});

