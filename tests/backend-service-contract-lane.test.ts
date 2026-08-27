import { describe, expect, it } from "vitest";
import { buildProjectReadModel } from "../tools/lib/build-read-model.js";
import { loadAndValidateProject } from "../tools/lib/validate-semantics.js";

describe("Backend service contract hardening lane", () => {
  it("records the Backend-owned Work path and final evidence after implementation", async () => {
    const model = await buildProjectReadModel(await loadAndValidateProject(process.cwd()));
    const evidence = new Map(model.evidence.map((item) => [item.id, item]));

    expect(model.work.find((item) => item.id === "backend-service-contract-hardening")).toMatchObject({
      workKind: "task",
      parentWorkId: "flowdoc-product-development-resumption",
      nodeId: "backend",
      repositoryIds: ["repo-backend", "repo-project-control"],
      workState: "in-review",
      activeRole: "product-implementation-agent",
      phaseIds: ["phase-backend-service-contract-hardening"],
      workPathIds: [
        "flowdoc-product-development-resumption",
        "backend-service-contract-hardening",
      ],
      requiredEvidence: ["evidence-backend-service-contract-hardening-2026-08-27"],
    });
    expect(model.phases.find((item) => item.id === "phase-backend-service-contract-hardening"))
      .toMatchObject({
        workId: "backend-service-contract-hardening",
        phaseState: "done",
        activeRole: "product-implementation-agent",
      });
    expect(model.phases.find((item) => item.id === "phase-backend-service-contract-hardening")?.verificationTarget)
      .toContain("evidence-backend-service-contract-hardening-2026-08-27");
    expect(model.checklists.find((item) => item.id === "checklist-backend-service-contract-hardening")?.items
      .map((item) => item.state))
      .toEqual(["passed", "passed", "passed", "passed", "passed", "passed"]);
    expect(evidence.get("evidence-backend-service-contract-hardening-2026-08-27")).toMatchObject({
      nodeIds: [],
      repositoryId: "repo-backend",
      commit: "6d18bd381b77becd33b4ac9785a4b6ba6422191a",
      pathOrContractId: "src/contracts/serviceReadiness.ts#BACKEND_SERVICE_PRODUCTION_REQUIRED_CAPABILITY_IDS",
    });
    expect(evidence.get("evidence-backend-service-contract-hardening-2026-08-27")?.verificationSummary)
      .toContain("frontendIntegration.status planning-only");
    expect(model.work.find((item) => item.id === "flowdoc-product-development-resumption")?.childWorkIds)
      .toContain("backend-service-contract-hardening");
    expect(model.nodes.find((node) => node.id === "backend")).toMatchObject({
      truthState: "unknown",
    });
  });
});
