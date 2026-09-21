import { describe, expect, it } from "vitest";
import { buildProjectReadModel } from "../tools/lib/build-read-model.js";
import { loadAndValidateProject } from "../tools/lib/validate-semantics.js";

const WORK_ID = "agent-and-skill-design";

const normalize = (value: string | undefined) => (value ?? "").replace(/\s+/gu, " ");

describe("FlowDoc PLAN round isolation", () => {
  it("requires every new PLAN task to use a fresh execution context", async () => {
    const model = await buildProjectReadModel(await loadAndValidateProject(process.cwd()));
    const documents = new Map(model.documents.map((document) => [document.id, document]));
    const work = model.work.find((item) => item.id === WORK_ID);

    expect(work).toMatchObject({
      activeRole: "project-control-steward",
      repositoryIds: ["repo-project-control"],
      workState: "in-progress",
    });

    const ruleDocuments = [
      "doc-project-control-agent-onboarding",
      "doc-flowdoc-global-codex-guidance",
      "doc-agent-skill-operating-model",
      "doc-flowdoc-round-workflow",
      "doc-flowdoc-delivery-operating-model",
      "doc-flowdoc-plan-room-orchestration-rules",
      "doc-flowdoc-coordination-controls",
      "doc-flowdoc-work-type-routing-model",
      "doc-flowdoc-lean-dispatch-operating-rules",
    ].map((id) => normalize(documents.get(id)?.content));

    for (const content of ruleDocuments) {
      expect(content).toContain("One PLAN task owns exactly one execution round");
      expect(content).toContain("New PLAN task means a new delivery round");
      expect(content).toContain("fresh execution context");
      expect(content).toContain("Version 1 coordination is historical and read-only");
      expect(content).toContain("Cross-PLAN ownership transfer is not supported");
      expect(content).toContain("Historical Recovery Work");
      expect(content).toContain("must not send, wait, revise, resume, or hand off through an older PLAN or WORK task");
      expect(content).toContain("immutable input");
      expect(content).toContain("explicit audit or evidence-recovery request");
      expect(content).not.toContain("Before new dispatch, ownership transfer");
      expect(content).not.toContain("Ownership transfer names the old and new PLAN");
    }

    const orchestrationRules = ruleDocuments[5];
    expect(orchestrationRules).toContain("same WORK room only while the same PLAN task and delivery round remain active");
    expect(orchestrationRules).toContain("fresh round ID, dispatch set, room run, handoff ID, WORK task, worktree or branch, and Return Channel");
  });
});
