import { describe, expect, it } from "vitest";
import { buildProjectReadModel } from "../tools/lib/build-read-model.js";
import { loadAndValidateProject } from "../tools/lib/validate-semantics.js";

const IMPLEMENTATION_DOC_ID = "doc-project-control-overview-history-gui-2026-08-29";
const IMPLEMENTATION_EVIDENCE_ID = "evidence-project-control-overview-history-gui-2026-08-29";
const WORK_ID = "project-control-overview-history-gui";
const PHASE_ID = "phase-project-control-overview-history-gui";
const CHECKLIST_ID = "checklist-project-control-overview-history-gui";
const IMPLEMENTATION_COMMIT = "97e9d234d2bb1e2d294463a395604d5f0ec75348";

const normalize = (value: string | undefined) => (value ?? "").replace(/\s+/gu, " ");

describe("Project Control Overview and History GUI implementation evidence", () => {
  it("records the bounded GUI implementation and keeps agent guidance current", async () => {
    const model = await buildProjectReadModel(await loadAndValidateProject(process.cwd()));
    const documents = new Map(model.documents.map((document) => [document.id, document]));
    const evidence = new Map(model.evidence.map((entry) => [entry.id, entry]));
    const work = model.work.find((item) => item.id === WORK_ID);
    const phase = model.phases.find((item) => item.id === PHASE_ID);
    const checklist = model.checklists.find((item) => item.id === CHECKLIST_ID);

    expect(work).toMatchObject({
      activeRole: "product-implementation-agent",
      nodeId: "project-control",
      parentWorkId: "flowdoc-product-development-resumption",
      phaseIds: [PHASE_ID],
      repositoryIds: ["repo-project-control"],
      requiredEvidence: [IMPLEMENTATION_EVIDENCE_ID],
      workKind: "task",
      workPathIds: ["flowdoc-product-development-resumption", WORK_ID],
      workState: "in-review",
    });
    expect(work?.contextDocumentIds).toEqual(
      expect.arrayContaining([
        "doc-project-control-repo-first-overview-history-2026-08-28",
        "doc-agent-skill-operating-model",
        "doc-flowdoc-global-codex-guidance",
        "doc-flowdoc-product-terminology",
        "doc-flowdoc-product-terminology-th",
        IMPLEMENTATION_DOC_ID,
      ]),
    );
    expect(work?.expectedOutput).toContain("Repo Directory Overview");
    expect(work?.expectedOutput).toContain("Work History View");
    expect(work?.riskSummary).toContain("History list still renders all Work records");

    expect(phase).toMatchObject({
      activeRole: "product-implementation-agent",
      phaseState: "done",
      repositoryIds: ["repo-project-control"],
      workId: WORK_ID,
    });
    expect(phase?.verificationTarget).toContain(IMPLEMENTATION_EVIDENCE_ID);

    expect(checklist?.items.map((item) => item.id)).toEqual([
      "confirm-project-control-entrypoint",
      "implement-repo-directory-overview",
      "implement-work-history-view",
      "preserve-focused-detail-boundary",
      "update-agent-guidance",
      "verify-and-record-evidence",
    ]);
    expect(checklist?.items.every((item) => item.state === "passed")).toBe(true);
    expect(checklist?.items.every((item) =>
      item.evidenceIds?.includes(IMPLEMENTATION_EVIDENCE_ID),
    )).toBe(true);

    const projectControl = model.nodes.find((node) => node.id === "project-control");
    expect(projectControl?.documentIds).toContain(IMPLEMENTATION_DOC_ID);
    expect(projectControl?.evidenceIds).toContain(IMPLEMENTATION_EVIDENCE_ID);

    const implementation = documents.get(IMPLEMENTATION_DOC_ID);
    expect(implementation).toMatchObject({
      path: "docs/domains/project-control-overview-history-gui-2026-08-29.md",
      nodeIds: ["project-control"],
      role: "verification",
      lifecycle: "active",
    });
    expect(implementation?.repositoryRefs).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          repositoryId: "repo-project-control",
          commit: IMPLEMENTATION_COMMIT,
          pathOrContractId: "app/src/components/ControlRoom.tsx",
        }),
        expect.objectContaining({
          repositoryId: "repo-project-control",
          commit: IMPLEMENTATION_COMMIT,
          pathOrContractId: "tests/e2e/project-control.spec.ts",
        }),
      ]),
    );

    const implementationText = normalize(implementation?.content);
    expect(implementationText).toContain("Home renders `Repo Directory Overview`");
    expect(implementationText).toContain("Work History View is a separate surface");
    expect(implementationText).toContain("History remains navigation context, not Evidence");
    expect(implementationText).toContain("Focused repository or area views keep Detail behind selection");
    expect(implementationText).toContain("does not promote Core, Backend, Editor, compatibility, or product readiness truth");

    expect(evidence.get(IMPLEMENTATION_EVIDENCE_ID)).toMatchObject({
      nodeIds: ["project-control"],
      repositoryId: "repo-project-control",
      commit: IMPLEMENTATION_COMMIT,
    });
    const verificationSummary = evidence.get(IMPLEMENTATION_EVIDENCE_ID)?.verificationSummary ?? "";
    expect(verificationSummary).toContain("npm run check");
    expect(verificationSummary).toContain("319 unit tests");
    expect(verificationSummary).toContain("6 e2e tests");
    expect(verificationSummary).toContain("does not promote Core, Backend, or Editor");

    const overview = normalize(documents.get("doc-project-control-overview")?.content);
    expect(overview).toContain("Repo Directory Overview and Work History View are implemented as bounded Project Control GUI behavior");
    expect(overview).toContain(IMPLEMENTATION_DOC_ID);
    expect(overview).toContain(IMPLEMENTATION_EVIDENCE_ID);

    const decision = normalize(documents.get("doc-project-control-repo-first-overview-history-2026-08-28")?.content);
    expect(decision).toContain("First implementation evidence");
    expect(decision).toContain(IMPLEMENTATION_EVIDENCE_ID);

    const agentModel = normalize(documents.get("doc-agent-skill-operating-model")?.content);
    expect(agentModel).toContain("Current GUI implementation");
    expect(agentModel).toContain("Agents entering the GUI should start at `Repo Directory Overview`");
    expect(agentModel).toContain("Use `Work History View` only when the user asks what happened over time");

    const globalGuidance = normalize(documents.get("doc-flowdoc-global-codex-guidance")?.content);
    expect(globalGuidance).toContain("project-control-overview-history-gui-2026-08-29.md");
    expect(globalGuidance).toContain("Do not restore a raw Work tree to Home");
  });
});
