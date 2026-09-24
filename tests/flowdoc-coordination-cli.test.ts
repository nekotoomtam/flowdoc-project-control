import { access, mkdtemp, readFile, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { packetDigest } from "../src/model/coordination-v3.js";
import {
  CoordinationPersistenceError,
  applyCoordinationCommandToWorkFile,
  readConfinedCommandJson,
} from "../tools/coordination-registry.js";
import { createCoordinationRegistryFixture } from "./fixtures/coordination-registry.js";
import { createCoordinationRegistryV2Fixture } from "./fixtures/coordination-registry-v2.js";
import { createCoordinationRegistryV3Fixture } from "./fixtures/coordination-registry-v3.js";
import { createProjectFixture } from "./fixtures/project-source.js";

async function installRegistry(root: string, version: 1 | 2 | 3, active = false): Promise<string> {
  const path = join(root, "data", "work", "pilot-task.json");
  const evidencePath = join(root, "data", "evidence", "evidence-design.json");
  const work = JSON.parse(await readFile(path, "utf8")) as Record<string, unknown>;
  if (version === 1) {
    work.coordination = createCoordinationRegistryFixture();
  } else if (version === 2) {
    const registry = createCoordinationRegistryV2Fixture();
    registry.round.workId = "pilot-task";
    work.coordination = registry;
  } else {
    const evidence = JSON.parse(await readFile(evidencePath, "utf8")) as Record<string, unknown>;
    const registry = createCoordinationRegistryV3Fixture();
    registry.round.workId = "pilot-task";
    registry.round.allowedFiles = ["src/model/"];
    registry.integrationClaims[0]!.repositoryId = "project-control";
    const room = registry.roomRuns[0]!;
    room.ownerRepositoryId = "project-control";
    room.phaseId = "phase-contract";
    room.checklistId = "checklist-contract";
    room.requiredEvidence = ["evidence-design"];
    room.packet.ownerRepositoryId = "project-control";
    room.packet.allowedScope = ["src/model/"];
    room.packet.relevantEvidenceIds = ["evidence-design"];
    room.packetDigest = packetDigest(room.packet);
    if (active) room.status = "active";
    evidence.validity = {
      claim: "Design reviewed.",
      repositoryId: "project-control",
      pathScope: ["docs/overview.md"],
      sourceRevision: "0123456789abcdef0123456789abcdef01234567",
      verificationMethod: "fixture review",
      freshnessTriggers: ["source changes"],
    };
    work.coordination = registry;
    await writeFile(evidencePath, JSON.stringify(evidence));
  }
  await writeFile(path, JSON.stringify(work));
  return path;
}

describe("coordination registry persistence", () => {
  it.each([1, 2] as const)("rejects version %s before revision or command parsing without writing", async (version) => {
    const root = await createProjectFixture({ valid: true, newContractTask: true });
    const path = await installRegistry(root, version);
    const before = await readFile(path, "utf8");
    await expect(applyCoordinationCommandToWorkFile({
      rootDir: root,
      workFile: "data/work/pilot-task.json",
      expectedRevision: 999,
      command: { type: "not-a-command" },
    })).rejects.toMatchObject({ code: "HISTORICAL_REGISTRY_READ_ONLY" });
    expect(await readFile(path, "utf8")).toBe(before);
    await expect(access(join(root, "data", ".coordination-writer.lock"))).rejects.toBeDefined();
  });

  it("persists an atomic version 3 transition and enforces expected revision", async () => {
    const root = await createProjectFixture({ valid: true, newContractTask: true });
    const path = await installRegistry(root, 3);
    const next = await applyCoordinationCommandToWorkFile({
      rootDir: root,
      workFile: "data/work/pilot-task.json",
      expectedRevision: 0,
      command: {
        type: "activate-room",
        planTaskId: "plan-economy-1",
        roundId: "round-economy-1",
        roomRunId: "workflow-economy-room",
        revisionAttempt: 0,
      },
    });
    expect(next).toMatchObject({ version: 3, revision: 1 });
    expect(JSON.parse(await readFile(path, "utf8")).coordination.roomRuns[0].status).toBe("active");
    await expect(applyCoordinationCommandToWorkFile({
      rootDir: root,
      workFile: "data/work/pilot-task.json",
      expectedRevision: 0,
      command: { type: "not-a-command" },
    })).rejects.toMatchObject({ code: "REVISION_CONFLICT" });
  });

  it("rejects a changed active packet without writing", async () => {
    const root = await createProjectFixture({ valid: true, newContractTask: true });
    const path = await installRegistry(root, 3, true);
    const work = JSON.parse(await readFile(path, "utf8"));
    work.coordination.roomRuns[0].packet.risk.tier = "bounded";
    await writeFile(path, JSON.stringify(work));
    const before = await readFile(path, "utf8");
    await expect(applyCoordinationCommandToWorkFile({
      rootDir: root,
      workFile: "data/work/pilot-task.json",
      expectedRevision: 0,
      command: {
        type: "supersede-attempt",
        planTaskId: "plan-economy-1",
        roundId: "round-economy-1",
        roomRunId: "workflow-economy-room",
        revisionAttempt: 0,
      },
    })).rejects.toMatchObject({ code: "CANDIDATE_INVALID" });
    expect(await readFile(path, "utf8")).toBe(before);
  });

  it("confines Work and command paths and never force-unlocks a writer guard", async () => {
    const root = await createProjectFixture({ valid: true, newContractTask: true });
    await expect(applyCoordinationCommandToWorkFile({
      rootDir: root,
      workFile: "../outside.json",
      expectedRevision: 0,
      command: { type: "not-a-command" },
    })).rejects.toMatchObject({ code: "WORK_PATH_OUTSIDE_ROOT" });

    await installRegistry(root, 3);
    const guardPath = join(root, "data", ".coordination-writer.lock");
    await writeFile(guardPath, "existing writer");
    await expect(applyCoordinationCommandToWorkFile({
      rootDir: root,
      workFile: "data/work/pilot-task.json",
      expectedRevision: 0,
      command: { type: "not-a-command" },
    })).rejects.toMatchObject({ code: "WRITER_GUARD_HELD" });
    expect(await readFile(guardPath, "utf8")).toBe("existing writer");

    const external = await mkdtemp(join(tmpdir(), "flowdoc-command-outside-"));
    await writeFile(join(external, "command.json"), JSON.stringify({ type: "not-a-command" }));
    await symlink(external, join(root, "command-link"), "junction");
    await expect(readConfinedCommandJson(root, "command-link/command.json"))
      .rejects.toMatchObject({ code: "COMMAND_PATH_OUTSIDE_ROOT" });
  });
});

it("exposes persistence failures as coded errors", () => {
  expect(new CoordinationPersistenceError("TEST", "message")).toMatchObject({
    name: "CoordinationPersistenceError",
    code: "TEST",
  });
});
