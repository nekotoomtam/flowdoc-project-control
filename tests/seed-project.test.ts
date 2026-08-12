import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { describe, expect, it } from "vitest";
import { buildProjectReadModel } from "../tools/lib/build-read-model.js";
import { loadAndValidateProject } from "../tools/lib/validate-semantics.js";

const execFileAsync = promisify(execFile);

describe("truthful seed project", () => {
  it("loads the truthful seed without claiming unverified product state", async () => {
    const validated = await loadAndValidateProject(process.cwd());
    const model = await buildProjectReadModel(validated);

    expect(model.rootNodeIds).toEqual(["flowdoc"]);
    expect(model.nodes.find((node) => node.id === "project-control")).toMatchObject({
      truthState: "current",
      evidenceIds: ["evidence-project-control-design"],
    });
    for (const id of ["core", "editor", "backend"]) {
      expect(model.nodes.find((node) => node.id === id)?.truthState).toBe("unknown");
    }

    const evidence = model.evidence.find((entry) => entry.id === "evidence-project-control-design");
    expect(evidence).toBeDefined();
    await expect(execFileAsync("git", [
      "cat-file",
      "-e",
      `${evidence!.commit}:${evidence!.pathOrContractId}`,
    ], { cwd: process.cwd() })).resolves.toBeDefined();
  });

  it("keeps future pilot acceptance artifacts out of current evidence", async () => {
    const model = await buildProjectReadModel(await loadAndValidateProject(process.cwd()));
    const pilot = model.work.find((item) => item.id === "work-core-route-pilot");

    expect(pilot).toMatchObject({
      workState: "queued",
      requiredEvidence: [],
    });
    expect(pilot?.summary).toContain("consolidated document commit");
    expect(pilot?.summary).toContain("migrated reference/test result");
    expect(pilot?.summary).toContain("Project Control evidence record");
  });
});
