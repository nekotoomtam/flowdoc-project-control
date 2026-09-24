import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { applyCoordinationCommand } from "../src/model/coordination.js";
import { loadProjectSources } from "../tools/lib/load-sources.js";
import { createCoordinationRegistryFixture } from "./fixtures/coordination-registry.js";
import { createCoordinationRegistryV2Fixture } from "./fixtures/coordination-registry-v2.js";
import { createCoordinationRegistryV3Fixture } from "./fixtures/coordination-registry-v3.js";

const POLICY_ID = "doc-flowdoc-workflow-economy-policy";
const POLICY_PATH = "docs/domains/flowdoc-workflow-economy-policy.md";
const REPLACED_IDS = [
  "doc-flowdoc-delivery-operating-model",
  "doc-flowdoc-plan-room-orchestration-rules",
  "doc-flowdoc-work-type-routing-model",
  "doc-flowdoc-lean-dispatch-operating-rules",
] as const;
const REPLACED_PATHS = [
  "docs/domains/flowdoc-delivery-operating-model.md",
  "docs/domains/flowdoc-plan-room-orchestration-rules.md",
  "docs/domains/flowdoc-work-type-routing-model.md",
  "docs/domains/flowdoc-lean-dispatch-operating-rules.md",
] as const;
const ENTRYPOINTS = [
  "AGENTS.md",
  "docs/domains/flowdoc-global-codex-guidance.md",
  "docs/domains/agent-and-skill-operating-model.md",
  "docs/domains/flowdoc-round-workflow.md",
] as const;

async function text(path: string): Promise<string> {
  return readFile(join(process.cwd(), path), "utf8");
}

describe("workflow economy authority cutover", () => {
  it("routes every current repository entrypoint to one policy without defaulting to replaced contracts", async () => {
    for (const path of ENTRYPOINTS) {
      const content = await text(path);
      expect(content, path).toContain(POLICY_PATH);
      for (const replacedPath of REPLACED_PATHS) {
        expect(content, `${path} still defaults to ${replacedPath}`).not.toContain(replacedPath);
      }
    }
  });

  it("makes the new policy current, the replaced contracts historical, and coordination controls supporting", async () => {
    const loaded = await loadProjectSources(process.cwd());
    const documents = new Map(loaded.documents.map(({ value }) => [value.id, value]));
    expect(documents.get(POLICY_ID)).toMatchObject({
      lifecycle: "active",
      contextClass: "current",
      supersedes: [...REPLACED_IDS],
    });
    for (const id of REPLACED_IDS) {
      expect(documents.get(id), id).toMatchObject({
        lifecycle: "superseded",
        contextClass: "historical",
        supersededBy: POLICY_ID,
      });
    }
    expect(documents.get("doc-flowdoc-coordination-controls")).toMatchObject({
      lifecycle: "active",
      contextClass: "supporting",
    });
  });

  it("removes historical workflow authorities from every Work default context while keeping their Markdown readable", async () => {
    const loaded = await loadProjectSources(process.cwd());
    for (const { value: work } of loaded.work) {
      expect((work.contextDocumentIds ?? []).filter((id) => REPLACED_IDS.includes(id as typeof REPLACED_IDS[number])), work.id)
        .toEqual([]);
    }
    for (const path of REPLACED_PATHS) {
      expect((await text(path)).trim().length, path).toBeGreaterThan(100);
    }
  });

  it("contains the complete economy, authority, safety, context, and stopping contract", async () => {
    const policy = await text(POLICY_PATH);
    for (const required of [
      "Safety Kernel",
      "PLAN responsibility",
      "Work Size",
      "Risk Tier",
      "discovery",
      "implementation",
      "verification",
      "Proof Budget",
      "Document Budget",
      "freshness",
      "blocking",
      "accepted",
      "deferred",
      "irrelevant",
      "Fallback before Proof",
      "accept risk",
      "defer proof",
      "freeze scope",
      "stop investigation",
      "Minimal Kickoff Packet",
      "automatic return",
      "planning complete",
      "implementation complete",
      "verification complete",
      "promoted truth",
      "Current Truth Snapshot",
      "governance metrics",
      "acceptance criteria",
      "safety/correctness blocker",
      "authority violation",
      "missing prerequisite",
      "scope escape",
    ]) {
      expect(policy, required).toContain(required);
    }
  });

  it("rejects version 1 and 2 mutation before command parsing and mutates only version 3", () => {
    for (const registry of [createCoordinationRegistryFixture(), createCoordinationRegistryV2Fixture()]) {
      expect(() => applyCoordinationCommand(registry, { type: "not-a-command" }))
        .toThrowError(expect.objectContaining({ code: "HISTORICAL_REGISTRY_READ_ONLY" }));
    }

    const registry = createCoordinationRegistryV3Fixture();
    const room = registry.roomRuns[0]!;
    const next = applyCoordinationCommand(registry, {
      type: "activate-room",
      planTaskId: registry.round.planTaskId,
      roundId: registry.round.roundId,
      roomRunId: room.roomRunId,
      revisionAttempt: room.revisionAttempt,
      packetDigest: room.packetDigest,
    });
    expect(next).toMatchObject({ version: 3, revision: 1 });
    expect(next.roomRuns[0]).toMatchObject({ status: "active" });
  });
});
