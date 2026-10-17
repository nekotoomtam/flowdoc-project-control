import { execFile as execFileCallback } from "node:child_process";
import { promisify } from "node:util";
import { readFile } from "node:fs/promises";
import { resolve, join } from "node:path";
import { createProjectFixture } from "./fixtures/project-source.js";
import { describe, expect, it } from "vitest";
import { buildWorkContext } from "../src/model/work-context.js";
import { projectFixture } from "./fixtures/project-source.js";

describe("bounded work context", () => {
  it("expands only the selected room's phase and checklist, keeping other obligations as locators", () => {
    const source = contextFixture();
    const registry = source.work[0]!.coordination!;
    if (registry.version !== 3) throw new Error("expected V3");
    const room = registry.roomRuns[0]!;
    room.phaseId = "phase-blocked-delivery";
    room.checklistId = "selected-checklist";
    source.phases.push({ ...source.phases[0]!, id: "sibling-phase", title: "Sibling phase", summary: "Sibling details must be retrieved separately" });
    source.checklists = ["selected-checklist", "same-phase-sibling", "other-phase-checklist"].map((id) => ({
      kind: "checklist", id, phaseId: id === "other-phase-checklist" ? "sibling-phase" : room.phaseId,
      title: id, items: [], createdAt: source.generatedAt, updatedAt: source.generatedAt,
    }));
    const view = buildWorkContext(source, { workId: "blocked-delivery", roomRunId: room.roomRunId });
    expect(view.phases.map(({ id }) => id)).toEqual(["phase-blocked-delivery"]);
    expect(view.checklists.map(({ id }) => id)).toEqual(["selected-checklist"]);
    expect(JSON.stringify(view)).not.toContain("Sibling details must be retrieved separately");
    expect(view.relatedPhases).toEqual([{ id: "sibling-phase", title: "Sibling phase", path: "data/phases/sibling-phase.json" }]);
    expect(view.relatedChecklists.map(({ id }) => id)).toEqual(["same-phase-sibling", "other-phase-checklist"]);
    const wholeWork = buildWorkContext(source, { workId: "blocked-delivery" });
    expect(wholeWork.phases).toHaveLength(2);
    expect(wholeWork.checklists).toHaveLength(3);
  });
  it("returns selected Work locators without document bodies or unrelated Work", () => {
    const source = contextFixture();
    const view = buildWorkContext(source, { workId: "blocked-delivery" });
    expect(view.work.id).toBe("blocked-delivery");
    expect(view.documents.map(({ id }) => id)).toEqual(["doc-current"]);
    const output = JSON.stringify(view);
    expect(output).not.toContain("active-a");
    expect(output).not.toContain(source.documents[0]!.content);
    expect(view.room).toBeNull();
  });

  it("selects only the latest attempt of the requested room and marks released authority read-only", () => {
    const source = contextFixture();
    const registry = source.work[0]!.coordination!;
    if (registry.version !== 3) throw new Error("expected V3");
    const room = registry.roomRuns[0]!;
    room.packet.goal = "Superseded attempt only";
    registry.roomRuns.push({ ...structuredClone(room), revisionAttempt: 1, packetDigest: "latest", packet: { ...structuredClone(room.packet), goal: "Revised goal" } });
    registry.round.state = "released";
    const view = buildWorkContext(source, { workId: "blocked-delivery", roomRunId: room.roomRunId });
    expect(view.executionAuthority).toBe("historical-read-only");
    expect(view.room).toMatchObject({ revisionAttempt: 1, packetDigest: "latest", packet: { goal: "Revised goal" } });
    expect(JSON.stringify(view)).not.toContain("Superseded attempt only");
  });

  it("the CLI reads canonical sources without a generated index and leaves them unchanged", async () => {
    const root = await createProjectFixture({ valid: true, newContractTask: true });
    const sourcePath = join(root, "data", "work", "pilot-task.json");
    const before = await readFile(sourcePath, "utf8");
    const { stdout } = await promisify(execFileCallback)(process.execPath,
      ["--import", "tsx", resolve("tools/context.ts"), "--root", root, "--work", "pilot-task"]);
    const view = JSON.parse(stdout);
    expect(view).toMatchObject({ sourceDigest: expect.stringMatching(/^[a-f0-9]{64}$/),
      work: { id: "pilot-task" }, room: null, executionAuthority: "unregistered-request-required" });
    expect(view.documents).toHaveLength(1);
    expect(view.documents[0]).not.toHaveProperty("content");
    expect(await readFile(sourcePath, "utf8")).toBe(before);
  });

  it("fails closed on missing Work or a room from another Work", () => {
    const source = contextFixture();
    expect(() => buildWorkContext(source, { workId: "missing" })).toThrow(/Work missing/);
    expect(() => buildWorkContext(source, { workId: "active-a", roomRunId: "another-work-room" })).toThrow(/Room/);
  });
});

function contextFixture() {
  const source = projectFixture();
  source.documents.find(({ id }) => id === "doc-current")!.supersedes = ["doc-historical"];
  return source;
}
