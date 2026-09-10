import { access, mkdtemp, readFile, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  CoordinationPersistenceError,
  applyCoordinationCommandToWorkFile,
  readConfinedCommandJson,
} from "../tools/coordination-registry.js";
import { createCoordinationRegistryFixture } from "./fixtures/coordination-registry.js";
import { createProjectFixture } from "./fixtures/project-source.js";

async function installRegistry(root: string, workId: "pilot" | "pilot-task", planTaskId = "plan-1"): Promise<string> {
  const path = join(root, "data", "work", `${workId}.json`);
  const work = JSON.parse(await readFile(path, "utf8")) as Record<string, unknown>;
  work.coordination = createCoordinationRegistryFixture({ planTaskId });
  await writeFile(path, JSON.stringify(work));
  return path;
}

describe("coordination registry persistence", () => {
  it("checks expected revision under the writer guard and persists an atomic transition", async () => {
    const root = await createProjectFixture({ valid: true, newContractTask: true });
    const path = await installRegistry(root, "pilot-task");

    const next = await applyCoordinationCommandToWorkFile({
      rootDir: root,
      workFile: "data/work/pilot-task.json",
      expectedRevision: 0,
      command: {
        type: "supersede-attempt",
        roomRunId: "pilot-room",
        ownershipGeneration: 1,
        revisionAttempt: 0,
      },
    });
    expect(next.revision).toBe(1);
    expect(JSON.parse(await readFile(path, "utf8")).coordination.roomRuns[0].status).toBe("superseded");

    await expect(applyCoordinationCommandToWorkFile({
      rootDir: root,
      workFile: "data/work/pilot-task.json",
      expectedRevision: 0,
      command: {
        type: "authorize-revision",
        roomRunId: "pilot-room",
        priorAttempt: 0,
        expectedHandoffId: "pilot-room-r1",
        livenessDeadline: "2026-09-10T07:40:00.000Z",
      },
    })).rejects.toMatchObject({ code: "REVISION_CONFLICT" });
  });

  it("rejects unknown commands without changing Work and releases the guard", async () => {
    const root = await createProjectFixture({ valid: true, newContractTask: true });
    const path = await installRegistry(root, "pilot-task");
    const before = await readFile(path, "utf8");

    await expect(applyCoordinationCommandToWorkFile({
      rootDir: root,
      workFile: "data/work/pilot-task.json",
      expectedRevision: 0,
      command: { type: "unknown-command" } as never,
    })).rejects.toMatchObject({ code: "UNKNOWN_COMMAND" });
    expect(await readFile(path, "utf8")).toBe(before);
    await expect(access(join(root, "data", ".coordination-writer.lock"))).rejects.toBeDefined();
  });

  it("confines the target to root data/work", async () => {
    const root = await createProjectFixture({ valid: true, newContractTask: true });

    await expect(applyCoordinationCommandToWorkFile({
      rootDir: root,
      workFile: "../outside.json",
      expectedRevision: 0,
      command: { type: "unknown-command" } as never,
    })).rejects.toMatchObject({ code: "WORK_PATH_OUTSIDE_ROOT" });
  });

  it("validates the cross-Work candidate before replacing the canonical file", async () => {
    const root = await createProjectFixture({ valid: true, newContractTask: true });
    await installRegistry(root, "pilot-task");
    const path = await installRegistry(root, "pilot");
    const current = JSON.parse(await readFile(path, "utf8")) as {
      coordination: ReturnType<typeof createCoordinationRegistryFixture>;
    };
    current.coordination.roomRuns[0]!.status = "superseded";
    await writeFile(path, JSON.stringify(current));
    const before = await readFile(path, "utf8");

    await expect(applyCoordinationCommandToWorkFile({
      rootDir: root,
      workFile: "data/work/pilot.json",
      expectedRevision: 0,
      command: {
        type: "transfer-ownership",
        fromPlanTaskId: "plan-1",
        toPlanTaskId: "plan-2",
        fromGeneration: 1,
        newGeneration: 2,
        reason: "competing owner test",
        affectedRoomRunIds: ["pilot-room"],
        transferredAt: "2026-09-10T07:10:00.000Z",
      },
    })).rejects.toMatchObject({ code: "CANDIDATE_INVALID" });
    expect(await readFile(path, "utf8")).toBe(before);
  });

  it("never force-unlocks an existing writer guard", async () => {
    const root = await createProjectFixture({ valid: true, newContractTask: true });
    await installRegistry(root, "pilot-task");
    const guardPath = join(root, "data", ".coordination-writer.lock");
    await writeFile(guardPath, "existing writer");

    await expect(applyCoordinationCommandToWorkFile({
      rootDir: root,
      workFile: "data/work/pilot-task.json",
      expectedRevision: 0,
      command: {
        type: "supersede-attempt",
        roomRunId: "pilot-room",
        ownershipGeneration: 1,
        revisionAttempt: 0,
      },
    })).rejects.toMatchObject({ code: "WRITER_GUARD_HELD" });
    expect(await readFile(guardPath, "utf8")).toBe("existing writer");
  });

  it("rejects a command file that resolves through a junction outside root", async () => {
    const root = await createProjectFixture({ valid: true, newContractTask: true });
    const external = await mkdtemp(join(tmpdir(), "flowdoc-command-outside-"));
    await writeFile(join(external, "command.json"), JSON.stringify({ type: "unknown-command" }));
    await symlink(external, join(root, "command-link"), "junction");

    await expect(readConfinedCommandJson(root, "command-link/command.json")).rejects.toMatchObject({
      code: "COMMAND_PATH_OUTSIDE_ROOT",
    });
  });
});

it("exposes persistence failures as coded errors", () => {
  expect(new CoordinationPersistenceError("TEST", "message")).toMatchObject({
    name: "CoordinationPersistenceError",
    code: "TEST",
  });
});
