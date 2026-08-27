import { describe, expect, it } from "vitest";
import { buildProjectReadModel } from "../tools/lib/build-read-model.js";
import { loadAndValidateProject } from "../tools/lib/validate-semantics.js";

describe("Backend service contract hardening lane", () => {
  it("opens an executable Backend-owned Work path before product implementation", async () => {
    const model = await buildProjectReadModel(await loadAndValidateProject(process.cwd()));

    expect(model.work.find((item) => item.id === "backend-service-contract-hardening")).toMatchObject({
      workKind: "task",
      parentWorkId: "flowdoc-product-development-resumption",
      nodeId: "backend",
      repositoryIds: ["repo-backend", "repo-project-control"],
      workState: "in-progress",
      activeRole: "product-implementation-agent",
      phaseIds: ["phase-backend-service-contract-hardening"],
      workPathIds: [
        "flowdoc-product-development-resumption",
        "backend-service-contract-hardening",
      ],
      requiredEvidence: [],
    });
    expect(model.phases.find((item) => item.id === "phase-backend-service-contract-hardening"))
      .toMatchObject({
        workId: "backend-service-contract-hardening",
        phaseState: "in-progress",
        activeRole: "product-implementation-agent",
      });
    expect(model.phases.find((item) => item.id === "phase-backend-service-contract-hardening")?.verificationTarget)
      .toContain("evidence-backend-service-contract-hardening-2026-08-27");
    expect(model.checklists.find((item) => item.id === "checklist-backend-service-contract-hardening")?.items
      .map((item) => item.state))
      .toEqual(["passed", "pending", "pending", "pending", "pending", "pending"]);
    expect(model.work.find((item) => item.id === "flowdoc-product-development-resumption")?.childWorkIds)
      .toContain("backend-service-contract-hardening");
    expect(model.nodes.find((node) => node.id === "backend")).toMatchObject({
      truthState: "unknown",
    });
  });
});
