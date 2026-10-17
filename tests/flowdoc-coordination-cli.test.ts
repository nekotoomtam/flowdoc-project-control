import { execFile as execFileCallback } from "node:child_process";
import { access, mkdir, mkdtemp, readFile, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { describe, expect, it } from "vitest";
import { packetDigest } from "../src/model/coordination-v3.js";
import { canonicalPayloadDigest } from "../src/model/coordination.js";
import {
  CoordinationPersistenceError,
  applyCoordinationCommandToWorkFile,
  readConfinedCommandJson,
  verifyAcceptedIntegrationCandidate,
} from "../tools/coordination-registry.js";
import { createCoordinationRegistryFixture } from "./fixtures/coordination-registry.js";
import { createCoordinationRegistryV2Fixture } from "./fixtures/coordination-registry-v2.js";
import { createCoordinationRegistryV3Fixture } from "./fixtures/coordination-registry-v3.js";
import { createProjectFixture } from "./fixtures/project-source.js";

const execFile = promisify(execFileCallback);

async function git(root: string, ...args: string[]): Promise<string> {
  const { stdout } = await execFile("git", args, { cwd: root, encoding: "utf8" });
  return stdout.trim();
}

async function createGitCandidate(extraCommittedPath?: string): Promise<{ root: string; baseCommit: string; headCommit: string }> {
  const root = await mkdtemp(join(tmpdir(), "flowdoc-coordination-scope-"));
  await git(root, "init");
  await git(root, "config", "user.name", "FlowDoc Test");
  await git(root, "config", "user.email", "flowdoc@example.invalid");
  await writeFile(join(root, "README.md"), "base\n", "utf8");
  await git(root, "add", "--all");
  await git(root, "commit", "-m", "base");
  const baseCommit = await git(root, "rev-parse", "HEAD");
  await mkdir(join(root, "src", "model"), { recursive: true });
  await writeFile(join(root, "src", "model", "file.ts"), "export {};\n", "utf8");
  if (extraCommittedPath !== undefined) {
    const segments = extraCommittedPath.split("/");
    const name = segments.pop()!;
    const directory = join(root, ...segments);
    await mkdir(directory, { recursive: true });
    await writeFile(join(directory, name), "extra\n", "utf8");
  }
  await git(root, "add", "--all");
  await git(root, "commit", "-m", "candidate");
  return { root, baseCommit, headCommit: await git(root, "rev-parse", "HEAD") };
}

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

async function installReturnedCurrentRegistry(options: {
  extraCommittedPath?: string;
  reportedFiles?: string[];
  workAuthority?: "implementation" | "discovery" | "verification";
  wrongBase?: boolean;
  wrongPacketDigest?: boolean;
  wrongWorktree?: boolean;
} = {}): Promise<{ projectRoot: string; workPath: string; repositoryRoot: string; baseCommit: string; headCommit: string }> {
  const projectRoot = await createProjectFixture({ valid: true, newContractTask: true });
  const candidate = await createGitCandidate(options.extraCommittedPath);
  const workPath = await installRegistry(projectRoot, 3);
  const evidencePath = join(projectRoot, "data", "evidence", "evidence-design.json");
  const work = JSON.parse(await readFile(workPath, "utf8"));
  const evidence = JSON.parse(await readFile(evidencePath, "utf8"));
  const registry = work.coordination;
  const room = registry.roomRuns[0];
  const reportedFiles = options.reportedFiles ?? ["src/model/file.ts"];
  room.status = "returned";
  room.requiredEvidence = ["evidence-design"];
  room.locator.worktree = candidate.root.replaceAll("\\", "/");
  room.packet.scopeLock = {
    version: 1,
    enforcement: "git-worktree",
    baseCommit: options.wrongBase === true ? "a".repeat(40) : candidate.baseCommit,
    worktree: options.wrongWorktree === true
      ? `${candidate.root.replaceAll("\\", "/")}/other`
      : candidate.root.replaceAll("\\", "/"),
  };
  room.packet.workAuthority = options.workAuthority ?? "implementation";
  room.packetDigest = packetDigest(room.packet);
  if (options.wrongPacketDigest === true) room.packetDigest = "f".repeat(64);
  registry.integrationClaims[0].baseCommit = candidate.baseCommit;
  const payload = {
    planTaskId: registry.round.planTaskId,
    roundId: registry.round.roundId,
    roomRunId: room.roomRunId,
    laneId: room.laneId,
    ownerRepositoryId: room.ownerRepositoryId,
    revisionAttempt: 0,
    status: "PASS" as const,
    behaviorChanged: true,
    behaviorSummary: "Implemented the scoped candidate.",
    exactCommit: candidate.headCommit,
    changedFiles: reportedFiles,
    tests: ["focused"],
    evidenceIds: ["evidence-design"],
    risks: [],
    unknowns: [],
    completion: {
      behaviorChanged: "Implemented the scoped candidate.",
      proof: [{ kind: "test" as const, reference: "focused", criterionRefs: ["AC-1"] }],
      remainingUnknowns: [],
      downstreamInformation: "No downstream action.",
      changedFiles: reportedFiles,
      createdEvidenceIds: [],
      createdDocumentIds: [],
      reviewCyclesUsed: 0,
      implementationCommitCount: 1,
    },
  };
  registry.handoffs = [{
    handoffId: room.expectedHandoffId,
    payloadDigest: canonicalPayloadDigest(payload),
    payload,
    transport: {
      status: "sent",
      attempts: 1,
      attemptHistory: [{ attemptedAt: "2026-09-26T08:00:00.000Z", outcome: "sent" }],
      lastAttemptAt: "2026-09-26T08:00:00.000Z",
    },
    receipt: {
      status: "received",
      receivedAt: "2026-09-26T08:01:00.000Z",
      senderThreadId: room.locator.threadId,
      channel: "send_message_to_thread",
      acknowledgedAt: "2026-09-26T08:02:00.000Z",
      arrivalSequence: 1,
    },
    acceptance: { status: "pending", evidenceIds: [], requiredChecks: [], remainingScope: [] },
  }];
  registry.completionQueue = [{ handoffId: room.expectedHandoffId, arrivalSequence: 1 }];
  evidence.repositoryId = room.ownerRepositoryId;
  evidence.commit = candidate.headCommit;
  evidence.validity.repositoryId = room.ownerRepositoryId;
  evidence.validity.sourceRevision = candidate.headCommit;
  await writeFile(evidencePath, JSON.stringify(evidence));
  await writeFile(workPath, JSON.stringify(work));
  return { projectRoot, workPath, repositoryRoot: candidate.root, baseCommit: candidate.baseCommit, headCommit: candidate.headCommit };
}

function currentAcceptanceCommand(requiredChecks = [{ name: "focused", status: "passed" }]) {
  return {
    type: "accept-handoff",
    planTaskId: "plan-economy-1",
    roundId: "round-economy-1",
    handoffId: "workflow-economy-handoff-0",
    reviewer: "plan-economy-1",
    reviewedAt: "2026-09-26T08:03:00.000Z",
    evidenceIds: ["evidence-design"],
    requiredChecks,
    remainingScope: [],
  };
}

async function acceptedIntegrationFixture() {
  const fixture = await installReturnedCurrentRegistry();
  await applyCoordinationCommandToWorkFile({
    rootDir: fixture.projectRoot,
    workFile: "data/work/pilot-task.json",
    expectedRevision: 0,
    command: currentAcceptanceCommand(),
  });
  return fixture;
}

describe("coordination registry persistence", () => {
  it("computes and atomically persists Scope Lock verification during current acceptance", async () => {
    const fixture = await installReturnedCurrentRegistry();
    const next = await applyCoordinationCommandToWorkFile({
      rootDir: fixture.projectRoot,
      workFile: "data/work/pilot-task.json",
      expectedRevision: 0,
      command: currentAcceptanceCommand(),
    });
    expect(next.revision).toBe(1);
    expect(next.handoffs[0]!.acceptance).toMatchObject({
      status: "accepted",
      scopeLockVerification: {
        status: "passed",
        terminalCommit: fixture.headCommit,
        changedFiles: ["src/model/file.ts"],
        clean: true,
      },
    });
    const stored = JSON.parse(await readFile(fixture.workPath, "utf8"));
    expect(stored.coordination.handoffs[0].acceptance.scopeLockVerification.status).toBe("passed");
  });

  it.each([
    ["omitted actual path", { extraCommittedPath: "src/model/extra.ts" }, "CHANGE_MANIFEST_MISMATCH"],
    ["read-only mutation", { workAuthority: "verification" as const }, "WORK_AUTHORITY_READ_ONLY"],
    ["wrong base commit", { wrongBase: true }, "GIT_SCOPE_BASE_MISMATCH"],
    ["wrong packet digest", { wrongPacketDigest: true }, "SCOPE_PACKET_DIGEST_MISMATCH"],
    ["wrong worktree", { wrongWorktree: true }, "SCOPE_WORKTREE_MISMATCH"],
  ])("rejects %s without writing", async (_name, options, code) => {
    const fixture = await installReturnedCurrentRegistry(options);
    const before = await readFile(fixture.workPath, "utf8");
    await expect(applyCoordinationCommandToWorkFile({
      rootDir: fixture.projectRoot,
      workFile: "data/work/pilot-task.json",
      expectedRevision: 0,
      command: currentAcceptanceCommand(),
    })).rejects.toMatchObject({ code });
    expect(await readFile(fixture.workPath, "utf8")).toBe(before);
  });

  it("rejects a dirty worktree without writing", async () => {
    const fixture = await installReturnedCurrentRegistry({ reportedFiles: ["src/model/file.ts", "src/model/dirty.ts"] });
    await writeFile(join(fixture.repositoryRoot, "src", "model", "dirty.ts"), "dirty\n", "utf8");
    const before = await readFile(fixture.workPath, "utf8");
    await expect(applyCoordinationCommandToWorkFile({
      rootDir: fixture.projectRoot,
      workFile: "data/work/pilot-task.json",
      expectedRevision: 0,
      command: currentAcceptanceCommand(),
    })).rejects.toMatchObject({ code: "SCOPE_WORKTREE_DIRTY" });
    expect(await readFile(fixture.workPath, "utf8")).toBe(before);
  });

  it("rejects a changed terminal HEAD and failed checks without writing", async () => {
    const changedHead = await installReturnedCurrentRegistry();
    await writeFile(join(changedHead.repositoryRoot, "README.md"), "next\n", "utf8");
    await git(changedHead.repositoryRoot, "add", "--all");
    await git(changedHead.repositoryRoot, "commit", "-m", "unexpected head");
    const beforeHead = await readFile(changedHead.workPath, "utf8");
    await expect(applyCoordinationCommandToWorkFile({
      rootDir: changedHead.projectRoot,
      workFile: "data/work/pilot-task.json",
      expectedRevision: 0,
      command: currentAcceptanceCommand(),
    })).rejects.toMatchObject({ code: "GIT_SCOPE_HEAD_MISMATCH" });
    expect(await readFile(changedHead.workPath, "utf8")).toBe(beforeHead);

    const failedCheck = await installReturnedCurrentRegistry();
    const beforeCheck = await readFile(failedCheck.workPath, "utf8");
    await expect(applyCoordinationCommandToWorkFile({
      rootDir: failedCheck.projectRoot,
      workFile: "data/work/pilot-task.json",
      expectedRevision: 0,
      command: currentAcceptanceCommand([{ name: "focused", status: "failed" }]),
    })).rejects.toMatchObject({ code: "ACCEPTANCE_CHECK_FAILED" });
    expect(await readFile(failedCheck.workPath, "utf8")).toBe(beforeCheck);
  });

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

describe("accepted candidate integration preflight", () => {
  it("passes the exact accepted clean candidate without mutating either repository", async () => {
    const fixture = await acceptedIntegrationFixture();
    const workBefore = await readFile(fixture.workPath, "utf8");
    const headBefore = await git(fixture.repositoryRoot, "rev-parse", "HEAD");
    await expect(verifyAcceptedIntegrationCandidate({
      rootDir: fixture.projectRoot,
      workFile: "data/work/pilot-task.json",
      handoffId: "workflow-economy-handoff-0",
      repository: fixture.repositoryRoot,
      baseRef: fixture.baseCommit,
    })).resolves.toBeUndefined();
    expect(await readFile(fixture.workPath, "utf8")).toBe(workBefore);
    expect(await git(fixture.repositoryRoot, "rev-parse", "HEAD")).toBe(headBefore);
  });

  it("rejects non-accepted, changed HEAD, changed base ref, unexpected root, and dirty state", async () => {
    const pending = await installReturnedCurrentRegistry();
    await expect(verifyAcceptedIntegrationCandidate({
      rootDir: pending.projectRoot,
      workFile: "data/work/pilot-task.json",
      handoffId: "workflow-economy-handoff-0",
      repository: pending.repositoryRoot,
      baseRef: pending.baseCommit,
    })).rejects.toMatchObject({ code: "INTEGRATION_HANDOFF_NOT_ACCEPTED" });

    const changedHead = await acceptedIntegrationFixture();
    await writeFile(join(changedHead.repositoryRoot, "README.md"), "changed head\n", "utf8");
    await git(changedHead.repositoryRoot, "add", "--all");
    await git(changedHead.repositoryRoot, "commit", "-m", "changed head");
    await expect(verifyAcceptedIntegrationCandidate({
      rootDir: changedHead.projectRoot,
      workFile: "data/work/pilot-task.json",
      handoffId: "workflow-economy-handoff-0",
      repository: changedHead.repositoryRoot,
      baseRef: changedHead.baseCommit,
    })).rejects.toMatchObject({ code: "GIT_SCOPE_HEAD_MISMATCH" });

    const changedBase = await acceptedIntegrationFixture();
    await expect(verifyAcceptedIntegrationCandidate({
      rootDir: changedBase.projectRoot,
      workFile: "data/work/pilot-task.json",
      handoffId: "workflow-economy-handoff-0",
      repository: changedBase.repositoryRoot,
      baseRef: "HEAD",
    })).rejects.toMatchObject({ code: "INTEGRATION_BASE_REF_MISMATCH" });

    const unexpectedRoot = await acceptedIntegrationFixture();
    await expect(verifyAcceptedIntegrationCandidate({
      rootDir: unexpectedRoot.projectRoot,
      workFile: "data/work/pilot-task.json",
      handoffId: "workflow-economy-handoff-0",
      repository: join(unexpectedRoot.repositoryRoot, "src"),
      baseRef: unexpectedRoot.baseCommit,
    })).rejects.toMatchObject({ code: "SCOPE_WORKTREE_MISMATCH" });

    const dirty = await acceptedIntegrationFixture();
    await writeFile(join(dirty.repositoryRoot, "src", "model", "dirty.ts"), "dirty\n", "utf8");
    await expect(verifyAcceptedIntegrationCandidate({
      rootDir: dirty.projectRoot,
      workFile: "data/work/pilot-task.json",
      handoffId: "workflow-economy-handoff-0",
      repository: dirty.repositoryRoot,
      baseRef: dirty.baseCommit,
    })).rejects.toMatchObject({ code: "SCOPE_WORKTREE_DIRTY" });
  });

  it.each([
    ["packet digest", (work: any) => { work.coordination.roomRuns[0].packetDigest = "a".repeat(64); }, "SCOPE_PACKET_DIGEST_MISMATCH"],
    ["stored verification", (work: any) => { work.coordination.handoffs[0].acceptance.scopeLockVerification.manifestDigest = "b".repeat(64); }, "SCOPE_VERIFICATION_STALE"],
  ])("rejects changed %s", async (_name, mutate, code) => {
    const fixture = await acceptedIntegrationFixture();
    const work = JSON.parse(await readFile(fixture.workPath, "utf8"));
    mutate(work);
    await writeFile(fixture.workPath, JSON.stringify(work));
    await expect(verifyAcceptedIntegrationCandidate({
      rootDir: fixture.projectRoot,
      workFile: "data/work/pilot-task.json",
      handoffId: "workflow-economy-handoff-0",
      repository: fixture.repositoryRoot,
      baseRef: fixture.baseCommit,
    })).rejects.toMatchObject({ code });
  });
});

it("exposes persistence failures as coded errors", () => {
  expect(new CoordinationPersistenceError("TEST", "message")).toMatchObject({
    name: "CoordinationPersistenceError",
    code: "TEST",
  });
});
