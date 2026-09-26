import { describe, expect, it } from "vitest";
import {
  collectScopeDefinitionIssues,
  normalizeRepositoryPath,
  pathWithinScope,
  resolveModelAvailability,
} from "../src/model/scope-lock.js";
import type { CompactCoordinationModelDecision } from "../src/model/types.js";
import type { WorkflowEconomyPacketV2 } from "../src/model/workflow-economy.js";
import { createCoordinationRegistryV3Fixture } from "./fixtures/coordination-registry-v3.js";

function currentPacket(): WorkflowEconomyPacketV2 {
  const packet = structuredClone(createCoordinationRegistryV3Fixture().roomRuns[0]!.packet);
  if (packet.policyId !== "flowdoc-workflow-economy-v2") throw new Error("Expected current packet fixture.");
  return packet;
}

function currentModelDecision(): {
  decision: CompactCoordinationModelDecision;
  registry: ReturnType<typeof createCoordinationRegistryV3Fixture>;
} {
  const registry = createCoordinationRegistryV3Fixture();
  const packet = registry.roomRuns[0]!.packet;
  if (packet.policyId !== "flowdoc-workflow-economy-v2") throw new Error("Expected current packet fixture.");
  return { decision: packet.modelDecision, registry };
}

describe("Scope Lock path definitions", () => {
  it("normalizes repository-relative separators and preserves segment boundaries", () => {
    expect(normalizeRepositoryPath("./src\\model//nested/")).toBe("src/model/nested");
    expect(pathWithinScope("src/model/file.ts", "src/model/")).toBe(true);
    expect(pathWithinScope("src/model-old/file.ts", "src/model/")).toBe(false);
  });

  it.each([
    "C:/repo/file.ts",
    "/repo/file.ts",
    "../outside.ts",
    "src/../outside.ts",
    ".",
    "./",
    "",
  ])("rejects invalid scope path %j", (scope) => {
    const packet = currentPacket();
    packet.allowedScope = [scope];

    expect(collectScopeDefinitionIssues(packet)).toContainEqual(
      expect.objectContaining({ code: "SCOPE_PATH_INVALID" }),
    );
  });

  it("rejects duplicate normalized paths and allowed/forbidden ancestry overlap", () => {
    const duplicate = currentPacket();
    duplicate.allowedScope = ["src/model/", "src\\model"];
    expect(collectScopeDefinitionIssues(duplicate)).toContainEqual(
      expect.objectContaining({ code: "SCOPE_PATH_DUPLICATE" }),
    );

    const overlap = currentPacket();
    overlap.allowedScope = ["src/model/"];
    overlap.forbiddenScope = ["src/model/private/"];
    expect(collectScopeDefinitionIssues(overlap)).toContainEqual(
      expect.objectContaining({ code: "SCOPE_OVERLAP" }),
    );
  });
});

describe("compact model availability", () => {
  it("resolves the selected pair through the referenced host snapshot", () => {
    const { decision, registry } = currentModelDecision();

    expect(resolveModelAvailability(decision, registry.modelAvailabilitySnapshots, "local")).toEqual([]);
  });

  it("rejects a missing snapshot, host mismatch, and unavailable effort", () => {
    const { decision, registry } = currentModelDecision();
    expect(resolveModelAvailability(decision, undefined, "local")).toContainEqual(
      expect.objectContaining({ code: "MODEL_SNAPSHOT_MISSING" }),
    );
    expect(resolveModelAvailability(decision, registry.modelAvailabilitySnapshots, "remote")).toContainEqual(
      expect.objectContaining({ code: "MODEL_SNAPSHOT_HOST_MISMATCH" }),
    );

    decision.reasoningEffort = "high";
    expect(resolveModelAvailability(decision, registry.modelAvailabilitySnapshots, "local")).toContainEqual(
      expect.objectContaining({ code: "MODEL_EFFORT_UNAVAILABLE" }),
    );
  });
});
