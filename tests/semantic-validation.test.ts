import { describe, expect, it } from "vitest";
import { loadProjectSources } from "../tools/lib/load-sources.js";
import { validateProjectSemantics } from "../tools/lib/validate-semantics.js";
import { createProjectFixture } from "./fixtures/project-source.js";

describe("validateProjectSemantics", () => {
  it.each([
    ["duplicate ID", { duplicateId: true }, "DUPLICATE_ID"],
    ["missing parent", { missingParent: true }, "MISSING_NODE_PARENT"],
    ["hierarchy cycle", { nodeCycle: true }, "NODE_CYCLE"],
    ["missing document", { missingDocumentRef: true }, "MISSING_DOCUMENT"],
    ["missing repository", { missingRepositoryRef: true }, "MISSING_REPOSITORY"],
    ["missing evidence", { missingEvidenceRef: true }, "MISSING_EVIDENCE"],
    [
      "document ownership mismatch",
      { documentOwnershipMismatch: true },
      "DOCUMENT_OWNERSHIP_MISMATCH",
    ],
    [
      "evidence ownership mismatch",
      { evidenceOwnershipMismatch: true },
      "EVIDENCE_OWNERSHIP_MISMATCH",
    ],
    ["current without evidence", { currentWithoutEvidence: true }, "CURRENT_WITHOUT_EVIDENCE"],
    ["document outside repo", { escapingDocumentPath: true }, "DOCUMENT_PATH_ESCAPE"],
    ["missing Work parent", { missingWorkParent: true }, "MISSING_WORK_PARENT"],
    ["Work hierarchy cycle", { workCycle: true }, "WORK_CYCLE"],
    ["task without context document", { taskMissingContextDocument: true }, "TASK_MISSING_CONTEXT_DOCUMENT"],
    ["task without active role", { taskMissingActiveRole: true }, "TASK_MISSING_ACTIVE_ROLE"],
    ["task without expected output", { taskMissingExpectedOutput: true }, "TASK_MISSING_EXPECTED_OUTPUT"],
    ["task without Phase", { taskWithoutPhase: true }, "TASK_WITHOUT_PHASE"],
    ["Phase with missing Work", { phaseMissingWork: true }, "MISSING_WORK"],
    ["two active Phases under one Work", { duplicateActivePhase: true }, "MULTIPLE_ACTIVE_PHASES"],
    ["Checklist with missing Phase", { checklistMissingPhase: true }, "MISSING_PHASE"],
    ["Checklist item with blank evidence target", { checklistMissingEvidenceTarget: true }, "CHECKLIST_ITEM_MISSING_EVIDENCE_TARGET"],
    ["passed Checklist item without support", { checklistPassedWithoutSupport: true }, "CHECKLIST_PASSED_WITHOUT_SUPPORT"],
  ])("rejects %s", async (_name, mutation, code) => {
    const root = await createProjectFixture({ valid: true, newContractTask: true, ...mutation });
    const loaded = await loadProjectSources(root);

    await expect(validateProjectSemantics(loaded)).rejects.toMatchObject({
      diagnostics: expect.arrayContaining([expect.objectContaining({ code })]),
    });
  });

  it("reports the complete stable hierarchy cycle", async () => {
    const root = await createProjectFixture({ valid: true, nodeCycle: true });
    const loaded = await loadProjectSources(root);

    await expect(validateProjectSemantics(loaded)).rejects.toMatchObject({
      diagnostics: expect.arrayContaining([
        expect.objectContaining({
          code: "NODE_CYCLE",
          message: expect.stringContaining("child-node -> flowdoc -> child-node"),
        }),
      ]),
    });
  });

  it.each([
    ["planned", "in-progress"],
    ["current", "blocked"],
  ] as const)("does not derive %s truth from %s work", async (truthState, workState) => {
    const root = await createProjectFixture({ valid: true, truthState, workState });
    const validated = await validateProjectSemantics(await loadProjectSources(root));

    expect(validated.nodes[0]?.value.truthState).toBe(truthState);
    expect(validated.work[0]?.value.workState).toBe(workState);
  });

  it("accepts a legacy V1 Work record without new-contract fields or a Phase", async () => {
    const root = await createProjectFixture({ valid: true });

    const validated = await validateProjectSemantics(await loadProjectSources(root));
    const legacyWork = validated.work.find((work) => work.value.id === "pilot");

    expect(legacyWork?.value.workKind).toBeUndefined();
    expect(legacyWork?.value.contextDocumentIds).toBeUndefined();
    expect(legacyWork?.value.activeRole).toBeUndefined();
    expect(legacyWork?.value.expectedOutput).toBeUndefined();
    expect(validated.phases).toHaveLength(0);
  });

  it("does not derive node truth from document lifecycle", async () => {
    const root = await createProjectFixture({
      valid: true,
      truthState: "planned",
      documentLifecycle: "retired",
    });
    const validated = await validateProjectSemantics(await loadProjectSources(root));

    expect(validated.nodes[0]?.value.truthState).toBe("planned");
  });

  it("does not derive current Node truth from passed Checklist state", async () => {
    const root = await createProjectFixture({
      valid: true,
      newContractTask: true,
      truthState: "planned",
      checklistPassedWithVerificationNote: true,
    });

    const validated = await validateProjectSemantics(await loadProjectSources(root));

    expect(validated.nodes[0]?.value.truthState).toBe("planned");
    expect(validated.checklists[0]?.value.items[0]?.state).toBe("passed");
  });

  it("does not treat unowned evidence as support for a current Node", async () => {
    const root = await createProjectFixture({
      valid: true,
      truthState: "current",
      evidenceOwnershipMismatch: true,
    });

    await expect(validateProjectSemantics(await loadProjectSources(root))).rejects.toMatchObject({
      diagnostics: expect.arrayContaining([
        expect.objectContaining({ code: "CURRENT_WITHOUT_EVIDENCE" }),
      ]),
    });
  });

  it.each([
    ["a missing document file", { missingDocumentFile: true }, "MISSING_DOCUMENT_FILE"],
    ["a non-Markdown document", { nonMarkdownDocument: true }, "DOCUMENT_NOT_MARKDOWN"],
    ["a document path that points to a directory", { documentPathDirectory: true }, "DOCUMENT_NOT_FILE"],
  ])("rejects %s", async (_name, mutation, code) => {
    const root = await createProjectFixture({ valid: true, ...mutation });

    await expect(validateProjectSemantics(await loadProjectSources(root))).rejects.toMatchObject({
      diagnostics: expect.arrayContaining([expect.objectContaining({ code })]),
    });
  });
});
