import { describe, expect, it } from "vitest";
import { buildProjectReadModel } from "../tools/lib/build-read-model.js";
import { loadAndValidateProject } from "../tools/lib/validate-semantics.js";

const normalize = (value: string | undefined) => (value ?? "").replace(/\s+/gu, " ");

describe("Project Control repo-first overview and history direction", () => {
  it("locks the approved Overview, History, and agent guidance split", async () => {
    const model = await buildProjectReadModel(await loadAndValidateProject(process.cwd()));
    const documents = new Map(model.documents.map((document) => [document.id, document]));

    const decision = documents.get("doc-project-control-repo-first-overview-history-2026-08-28");
    expect(decision).toMatchObject({
      path: "docs/domains/project-control-repo-first-overview-history-2026-08-28.md",
      nodeIds: ["project-control"],
      role: "decision",
      lifecycle: "active",
    });

    const decisionText = normalize(decision?.content);
    expect(decisionText).toContain("Repo Directory Overview");
    expect(decisionText).toContain("Work History View");
    expect(decisionText).toContain("Overview answers where an area lives in the system");
    expect(decisionText).toContain("History answers what has been recorded over time");
    expect(decisionText).toContain("Home shows repository or area headings before Work, Project Control Node, Evidence, or Checklist detail");
    expect(decisionText).toContain("A History item returns to the Overview and focuses the related repository or area");
    expect(decisionText).toContain("History is not Evidence");

    expect(model.nodes.find((node) => node.id === "project-control")?.documentIds)
      .toContain("doc-project-control-repo-first-overview-history-2026-08-28");

    expect(normalize(documents.get("doc-glossary-en")?.content)).toContain("Repo Directory Overview");
    expect(normalize(documents.get("doc-glossary-en")?.content)).toContain("Work History View");
    expect(normalize(documents.get("doc-glossary-th")?.content)).toContain("Repo Directory Overview");
    expect(normalize(documents.get("doc-glossary-th")?.content)).toContain("Work History View");

    const agentModel = normalize(documents.get("doc-agent-skill-operating-model")?.content);
    expect(agentModel).toContain("Project Control GUI orientation");
    expect(agentModel).toContain("classify the surface as Overview, History, or Detail");
    expect(agentModel).toContain("do not treat History as Evidence");

    const globalGuidance = normalize(documents.get("doc-flowdoc-global-codex-guidance")?.content);
    expect(globalGuidance).toContain("project-control-repo-first-overview-history-2026-08-28.md");
    expect(globalGuidance).toContain("Overview, History, or Detail");
  });
});
