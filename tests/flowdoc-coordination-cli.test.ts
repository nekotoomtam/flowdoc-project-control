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
import { createCoordinationRegistryV2Fixture } from "./fixtures/coordination-registry-v2.js";
import { createProjectFixture } from "./fixtures/project-source.js";

async function installRegistry(
  root: string,
  workId: "pilot" | "pilot-task",
  options: { legacy?: boolean; planTaskId?: string } = {},
): Promise<string> {
  const path = join(root, "data", "work", `${workId}.json`);
  const work = JSON.parse(await readFile(path, "utf8")) as Record<string, unknown>;
  if (options.legacy === true) {
    work.coordination = createCoordinationRegistryFixture(
      options.planTaskId === undefined ? {} : { planTaskId: options.planTaskId },
    );
  } else {
    const registry = createCoordinationRegistryV2Fixture();
    registry.round.workId = workId;
    registry.round.planTaskId = options.planTaskId ?? "plan-2";
    registry.integrationClaims[0]!.planTaskId = registry.round.planTaskId;
    registry.roomRuns[0]!.returnRoute.planTaskId = registry.round.planTaskId;
    registry.roomRuns[0]!.returnRoute.monitorOwner = registry.round.planTaskId;
    work.coordination = registry;
  }
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
        planTaskId: "plan-2",
        roundId: "round-2",
        roomRunId: "pilot-v2-room",
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
        planTaskId: "plan-2",
        roundId: "round-2",
        roomRunId: "pilot-v2-room",
        priorAttempt: 0,
        expectedHandoffId: "pilot-v2-room-r1",
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

  it("rejects a raw legacy command before parsing lifecycle fields", async () => {
    const root = await createProjectFixture({ valid: true, newContractTask: true });
    const path = await installRegistry(root, "pilot-task", { legacy: true });
    const before = await readFile(path, "utf8");

    await expect(applyCoordinationCommandToWorkFile({
      rootDir: root,
      workFile: "data/work/pilot-task.json",
      expectedRevision: 0,
      command: {
        type: "transfer-ownership",
        fromPlanTaskId: "plan-1",
        toPlanTaskId: "plan-2",
      },
    })).rejects.toMatchObject({ code: "LEGACY_REGISTRY_READ_ONLY" });
    expect(await readFile(path, "utf8")).toBe(before);
  });

  it("rejects removed transfer and wrong PLAN/round commands atomically", async () => {
    const root = await createProjectFixture({ valid: true, newContractTask: true });
    const path = await installRegistry(root, "pilot-task");
    const before = await readFile(path, "utf8");

    await expect(applyCoordinationCommandToWorkFile({
      rootDir: root,
      workFile: "data/work/pilot-task.json",
      expectedRevision: 0,
      command: { type: "transfer-ownership" },
    })).rejects.toMatchObject({ code: "OWNERSHIP_TRANSFER_REMOVED" });
    await expect(applyCoordinationCommandToWorkFile({
      rootDir: root,
      workFile: "data/work/pilot-task.json",
      expectedRevision: 0,
      command: {
        type: "supersede-attempt",
        planTaskId: "old-plan",
        roundId: "old-round",
        roomRunId: "pilot-v2-room",
        revisionAttempt: 0,
      },
    })).rejects.toMatchObject({ code: "PLAN_ROUND_MISMATCH" });
    expect(await readFile(path, "utf8")).toBe(before);
  });

  it("does not normalize an invalid stored room into the current round", async () => {
    const root = await createProjectFixture({ valid: true, newContractTask: true });
    const path = await installRegistry(root, "pilot-task");
    const work = JSON.parse(await readFile(path, "utf8")) as {
      coordination: ReturnType<typeof createCoordinationRegistryV2Fixture>;
    };
    work.coordination.roomRuns[0]!.roundId = "old-round";
    await writeFile(path, JSON.stringify(work));
    const before = await readFile(path, "utf8");

    await expect(applyCoordinationCommandToWorkFile({
      rootDir: root,
      workFile: "data/work/pilot-task.json",
      expectedRevision: 0,
      command: {
        type: "supersede-attempt",
        planTaskId: "plan-2",
        roundId: "round-2",
        roomRunId: "pilot-v2-room",
        revisionAttempt: 0,
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
        planTaskId: "plan-2",
        roundId: "round-2",
        roomRunId: "pilot-v2-room",
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
