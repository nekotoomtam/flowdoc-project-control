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
const SCOPE_WORK_ID = "workflow-scope-lock-model-budget";
const SCOPE_PHASE_ID = "phase-workflow-scope-lock-model-budget-implementation";
const SCOPE_CHECKLIST_ID = "checklist-workflow-scope-lock-model-budget-implementation";
const SCOPE_EVIDENCE_ID = "evidence-flowdoc-workflow-scope-lock-model-budget-2026-09-26";

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

  it("cuts new rounds over to policy v2 Scope Lock and the compact Model Budget", async () => {
    const policy = await text(POLICY_PATH);
    for (const required of [
      "flowdoc-workflow-economy-v2",
      "Scope Lock Enforcement v1",
      "actual Git manifest",
      "availabilitySnapshotRef",
      "gpt-6-astra` at `medium",
      "PLAN Lite",
      "gpt-6-sol` at `medium",
      "read-audit",
      "cannot prove every file read",
    ]) {
      expect(policy, required).toContain(required);
    }
    expect(policy).toContain("Legacy policy v1 packets remain readable");
    expect(policy).toContain("must not activate");
  });

  it("registers the fresh bounded implementation round without promoting product or map truth", async () => {
    const loaded = await loadProjectSources(process.cwd());
    const work = loaded.work.find(({ value }) => value.id === SCOPE_WORK_ID)?.value;
    const phase = loaded.phases.find(({ value }) => value.id === SCOPE_PHASE_ID)?.value;
    const checklist = loaded.checklists.find(({ value }) => value.id === SCOPE_CHECKLIST_ID)?.value;
    const evidence = loaded.evidence.find(({ value }) => value.id === SCOPE_EVIDENCE_ID)?.value;

    expect(work).toMatchObject({
      nodeId: "project-control",
      parentWorkId: "agent-and-skill-design",
      repositoryIds: ["repo-project-control"],
      activeRole: "project-control-steward",
      requiredEvidence: expect.arrayContaining([
        "evidence-flowdoc-workflow-economy-clean-cutover-2026-09-23",
        SCOPE_EVIDENCE_ID,
      ]),
      workState: "in-review",
    });
    expect(phase).toMatchObject({
      workId: SCOPE_WORK_ID,
      repositoryIds: ["repo-project-control"],
      activeRole: "project-control-steward",
      phaseState: "done",
    });
    expect(checklist).toMatchObject({ phaseId: SCOPE_PHASE_ID });
    expect(checklist?.items.every((item) => item.evidenceIds?.includes(SCOPE_EVIDENCE_ID))).toBe(true);
    expect(evidence).toMatchObject({
      nodeIds: [],
      repositoryId: "repo-project-control",
      commit: "3cc2426efe910249c4bce4de400c1fcb00e84e6d",
    });
    expect(evidence?.verificationSummary).toContain("Scope Lock");
    expect(evidence?.verificationSummary).toContain("npm run check");
    expect(evidence?.verificationSummary).toContain("does not promote Core, Backend, Editor, product, or map truth");
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
