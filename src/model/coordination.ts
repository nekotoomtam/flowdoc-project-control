import { createHash } from "node:crypto";
import type {
  CoordinationCleanupState,
  CoordinationHandoff,
  CoordinationIntegrationClaim,
  CoordinationRegistry,
  CoordinationRoomRun,
  CoordinationTerminalPayload,
  CoordinationUxGate,
  WorkRecord,
} from "./types.js";

export interface CoordinationValidationIssue {
  code: string;
  message: string;
  workId: string;
}

export interface CoordinationCommandContext {
  evidenceById?: ReadonlyMap<string, { repositoryId: string; commit: string }>;
}

export interface CoordinationCleanupContext {
  planTaskId: string;
  generation: number;
  scopeState: "active" | "released" | "cancelled";
  integrationClaims: readonly CoordinationIntegrationClaim[];
  evidenceById: ReadonlyMap<string, { repositoryId: string; commit: string }>;
}

export type CoordinationCommand =
  | {
      type: "activate-room";
      roomRunId: string;
      ownershipGeneration: number;
      revisionAttempt: number;
    }
  | {
      type: "supersede-attempt";
      roomRunId: string;
      ownershipGeneration: number;
      revisionAttempt: number;
    }
  | {
      type: "authorize-revision";
      roomRunId: string;
      priorAttempt: number;
      expectedHandoffId: string;
      livenessDeadline: string;
    }
  | {
      type: "transfer-ownership";
      fromPlanTaskId: string;
      toPlanTaskId: string;
      fromGeneration: number;
      newGeneration: number;
      reason: string;
      affectedRoomRunIds: string[];
      transferredAt: string;
    }
  | {
      type: "record-send";
      handoffId: string;
      payload: CoordinationTerminalPayload;
      outcome: "sent" | "failed";
      attemptedAt: string;
    }
  | {
      type: "receive-handoff";
      handoffId: string;
      payload: CoordinationTerminalPayload;
      senderThreadId: string;
      receivedAt: string;
    }
  | {
      type: "acknowledge-receipt";
      handoffId: string;
      planTaskId: string;
      acknowledgedAt: string;
    }
  | {
      type: "accept-handoff";
      handoffId: string;
      reviewer: string;
      reviewedAt: string;
      evidenceIds: string[];
      requiredChecks: Array<{ name: string; status: "pending" | "passed" | "failed" }>;
      remainingScope: string[];
    }
  | {
      type: "resolve-handoff";
      handoffId: string;
      reviewer: string;
      reviewedAt: string;
      decision: "needs-revision" | "rejected" | "blocked";
      reviewNote: string;
      remainingScope: string[];
    }
  | {
      type: "release-round";
      planTaskId: string;
    };

export class CoordinationTransitionError extends Error {
  constructor(readonly code: string, message: string) {
    super(message);
    this.name = "CoordinationTransitionError";
  }
}

export function canonicalPayloadDigest(payload: CoordinationTerminalPayload): string {
  return createHash("sha256").update(JSON.stringify(canonicalize(payload))).digest("hex");
}

export function applyCoordinationCommand(
  registry: CoordinationRegistry,
  command: CoordinationCommand,
  context: CoordinationCommandContext = {},
): CoordinationRegistry {
  switch (command.type) {
    case "activate-room":
      return activateRoom(registry, command);
    case "supersede-attempt":
      return supersedeAttempt(registry, command);
    case "authorize-revision":
      return authorizeRevision(registry, command);
    case "transfer-ownership":
      return transferOwnership(registry, command);
    case "record-send":
      return recordSend(registry, command);
    case "receive-handoff":
      return receiveHandoff(registry, command);
    case "acknowledge-receipt":
      return acknowledgeReceipt(registry, command);
    case "accept-handoff":
      return acceptHandoff(registry, command, context);
    case "resolve-handoff":
      return resolveHandoff(registry, command);
    case "release-round":
      return releaseRound(registry, command);
    default: {
      const unknownCommand = command as { type?: unknown };
      throw new CoordinationTransitionError(
        "UNKNOWN_COMMAND",
        `Unknown coordination command: ${String(unknownCommand.type)}.`,
      );
    }
  }
}

export function assessCleanupEligibility(
  candidate: CoordinationCleanupState,
  context: CoordinationCleanupContext,
): { eligible: boolean; reasons: string[] } {
  const reasons: string[] = [];
  if (candidate.planTaskId !== context.planTaskId) reasons.push("CLEANUP_OWNER_MISMATCH");
  if (candidate.ownershipGeneration !== context.generation) reasons.push("CLEANUP_GENERATION_MISMATCH");
  if (
    candidate.executor !== context.planTaskId &&
    candidate.delegatedBy !== context.planTaskId
  ) reasons.push("CLEANUP_EXECUTOR_UNAUTHORIZED");
  if (
    candidate.preflightEvidenceIds.length === 0 ||
    candidate.preflightEvidenceIds.some((id) => !context.evidenceById.has(id)) ||
    !candidate.preflightEvidenceIds.some((id) => context.evidenceById.get(id)?.repositoryId === candidate.repositoryId)
  ) reasons.push("CLEANUP_EVIDENCE_MISSING");
  const matchingClaim = context.integrationClaims.find((claim) =>
    claim.repositoryId === candidate.repositoryId &&
    claim.planTaskId === candidate.planTaskId &&
    claim.generation === candidate.ownershipGeneration);
  const validIntegrationClaim = matchingClaim?.state === "active" ||
    (candidate.disposition === "removed" &&
      context.scopeState === "released" &&
      matchingClaim?.state === "released");
  if (!validIntegrationClaim) reasons.push("CLEANUP_INTEGRATION_CLAIM_MISSING");
  if (Object.values(candidate.preflightSources).some((source) => source.trim() === "")) {
    reasons.push("CLEANUP_PREFLIGHT_SOURCE_MISSING");
  }
  if (!candidate.currentRound) reasons.push("NOT_CURRENT_ROUND");
  if (!candidate.worktreeClean) reasons.push("WORKTREE_DIRTY");
  if (!candidate.merged) reasons.push("BRANCH_UNMERGED");
  if (candidate.worktreeGate !== "passed") reasons.push("WORKTREE_GATE_NOT_PASSED");
  if (candidate.mainGate !== "passed") reasons.push("MAIN_GATE_NOT_PASSED");
  if (!candidate.liveProcessClear) reasons.push("LIVE_PROCESS_PRESENT");
  return { eligible: reasons.length === 0, reasons };
}

export function validateCoordinationRegistries(
  workRecords: Array<Pick<WorkRecord, "id" | "coordination">>,
  evidenceById: ReadonlyMap<string, { repositoryId: string; commit: string }>,
): CoordinationValidationIssue[] {
  const issues: CoordinationValidationIssue[] = [];
  const activeScopes = new Map<string, { workId: string; planTaskId: string }>();
  const activeIntegrators = new Map<string, { workId: string; planTaskId: string }>();
  const activeFileScopes: Array<{ workId: string; planTaskId: string; path: string }> = [];

  for (const work of workRecords) {
    const registry = work.coordination;
    if (registry === undefined) continue;
    issues.push(...validateRegistry(work.id, registry, evidenceById));

    if (registry.scopeOwnership.state === "active") {
      for (const scopeKey of registry.scopeOwnership.scopeKeys) {
        const existing = activeScopes.get(scopeKey);
        if (existing !== undefined && existing.planTaskId !== registry.scopeOwnership.planTaskId) {
          issues.push(issue(
            "COORDINATION_SCOPE_CONFLICT",
            `Scope key "${scopeKey}" is actively owned by ${existing.planTaskId} in ${existing.workId}.`,
            work.id,
          ));
        } else {
          activeScopes.set(scopeKey, {
            workId: work.id,
            planTaskId: registry.scopeOwnership.planTaskId,
          });
        }
      }
      for (const allowedPath of registry.scopeOwnership.allowedFiles) {
        const normalized = normalizeScopePath(allowedPath);
        for (const existing of activeFileScopes) {
          if (
            existing.planTaskId !== registry.scopeOwnership.planTaskId &&
            pathsOverlap(existing.path, normalized)
          ) {
            issues.push(issue(
              "COORDINATION_FILE_SCOPE_CONFLICT",
              `Allowed path "${allowedPath}" overlaps active path "${existing.path}" in ${existing.workId}.`,
              work.id,
            ));
          }
        }
        activeFileScopes.push({
          workId: work.id,
          planTaskId: registry.scopeOwnership.planTaskId,
          path: normalized,
        });
      }
    }

    for (const claim of registry.integrationClaims.filter(({ state }) => state === "active")) {
      const existing = activeIntegrators.get(claim.repositoryId);
      if (existing !== undefined && existing.planTaskId !== claim.planTaskId) {
        issues.push(issue(
          "COORDINATION_INTEGRATION_OWNER_CONFLICT",
          `Repository "${claim.repositoryId}" has active integration owners ${existing.planTaskId} and ${claim.planTaskId}.`,
          work.id,
        ));
      } else {
        activeIntegrators.set(claim.repositoryId, { workId: work.id, planTaskId: claim.planTaskId });
      }
    }
  }

  return issues;
}

function activateRoom(
  registry: CoordinationRegistry,
  command: Extract<CoordinationCommand, { type: "activate-room" }>,
): CoordinationRegistry {
  ensureCurrentGeneration(registry, command.ownershipGeneration);
  const index = findRoomIndex(
    registry,
    command.roomRunId,
    command.ownershipGeneration,
    command.revisionAttempt,
  );
  const room = registry.roomRuns[index]!;
  ensure(room.status === "prepared", "ROOM_NOT_PREPARED", "Only a prepared room can become active.");
  ensureActivationReady(registry, room);

  const next = clone(registry);
  next.roomRuns[index]!.status = "active";
  return incrementRevision(next);
}

function supersedeAttempt(
  registry: CoordinationRegistry,
  command: Extract<CoordinationCommand, { type: "supersede-attempt" }>,
): CoordinationRegistry {
  const index = findRoomIndex(
    registry,
    command.roomRunId,
    command.ownershipGeneration,
    command.revisionAttempt,
  );
  const room = registry.roomRuns[index]!;
  ensure(
    room.status === "prepared" || room.status === "active" || room.status === "returned",
    "ROOM_CANNOT_BE_SUPERSEDED",
    "Only a prepared, active, or returned attempt can be superseded.",
  );
  const next = clone(registry);
  next.roomRuns[index]!.status = "superseded";
  next.completionQueue = next.completionQueue.filter((item) => {
    const handoff = next.handoffs.find(({ handoffId }) => handoffId === item.handoffId);
    return handoff === undefined || !sameAttemptPayload(handoff.payload, room);
  });
  return incrementRevision(next);
}

function authorizeRevision(
  registry: CoordinationRegistry,
  command: Extract<CoordinationCommand, { type: "authorize-revision" }>,
): CoordinationRegistry {
  const priorIndex = findRoomIndex(
    registry,
    command.roomRunId,
    registry.scopeOwnership.generation,
    command.priorAttempt,
  );
  const prior = registry.roomRuns[priorIndex]!;
  ensure(prior.status === "superseded", "PRIOR_ATTEMPT_NOT_SUPERSEDED", "Supersede the old attempt first.");
  ensure(
    !registry.handoffs.some(({ handoffId }) => handoffId === command.expectedHandoffId) &&
      !registry.roomRuns.some(({ expectedHandoffId }) => expectedHandoffId === command.expectedHandoffId),
    "HANDOFF_ID_ALREADY_USED",
    "A revision needs a new, unused handoff ID.",
  );
  ensure(
    !registry.roomRuns.some((candidate) =>
      candidate.roomRunId === command.roomRunId &&
      candidate.ownershipGeneration === registry.scopeOwnership.generation &&
      candidate.revisionAttempt === command.priorAttempt + 1),
    "REVISION_ATTEMPT_EXISTS",
    "The next revision attempt already exists.",
  );

  const next = clone(registry);
  const revised: CoordinationRoomRun = {
    ...clone(prior),
    revisionAttempt: prior.revisionAttempt + 1,
    expectedHandoffId: command.expectedHandoffId,
    status: "prepared",
    contextAcknowledgement: { status: "pending" },
    returnRoute: { ...prior.returnRoute, livenessDeadline: command.livenessDeadline },
  };
  next.roomRuns.push(revised);
  return incrementRevision(next);
}

function transferOwnership(
  registry: CoordinationRegistry,
  command: Extract<CoordinationCommand, { type: "transfer-ownership" }>,
): CoordinationRegistry {
  ensure(registry.scopeOwnership.state === "active", "SCOPE_NOT_ACTIVE", "Only active ownership can transfer.");
  ensure(
    registry.scopeOwnership.planTaskId === command.fromPlanTaskId &&
      registry.scopeOwnership.generation === command.fromGeneration,
    "OWNERSHIP_TRANSFER_SOURCE_MISMATCH",
    "Transfer source must match the current PLAN and generation.",
  );
  ensure(
    command.newGeneration === command.fromGeneration + 1,
    "OWNERSHIP_GENERATION_INVALID",
    "Ownership transfer must increment generation by one.",
  );
  ensureNonBlank(command.toPlanTaskId, "OWNERSHIP_TRANSFER_TARGET_MISSING");
  ensureNonBlank(command.reason, "OWNERSHIP_TRANSFER_REASON_MISSING");
  ensure(
    !registry.roomRuns.some((room) =>
      room.ownershipGeneration === command.fromGeneration &&
      (room.status === "prepared" || room.status === "active" || room.status === "returned")),
    "ACTIVE_ATTEMPT_BLOCKS_TRANSFER",
    "Supersede active generation attempts before ownership transfer.",
  );

  const next = clone(registry);
  next.scopeOwnership.planTaskId = command.toPlanTaskId;
  next.scopeOwnership.generation = command.newGeneration;
  next.scopeOwnership.transfers.push({
    fromPlanTaskId: command.fromPlanTaskId,
    toPlanTaskId: command.toPlanTaskId,
    fromGeneration: command.fromGeneration,
    newGeneration: command.newGeneration,
    reason: command.reason,
    affectedRoomRunIds: [...command.affectedRoomRunIds],
    transferredAt: command.transferredAt,
  });
  for (const claim of next.integrationClaims) {
    if (claim.state === "active") {
      claim.planTaskId = command.toPlanTaskId;
      claim.generation = command.newGeneration;
    }
  }
  return incrementRevision(next);
}

function recordSend(
  registry: CoordinationRegistry,
  command: Extract<CoordinationCommand, { type: "record-send" }>,
): CoordinationRegistry {
  const room = roomForPayload(registry, command.handoffId, command.payload);
  ensureCurrentAttempt(registry, room);
  ensure(room.status === "active" || room.status === "returned", "ROOM_NOT_ACTIVE", "The attempt is not active.");
  const digest = canonicalPayloadDigest(command.payload);
  const existingIndex = registry.handoffs.findIndex(({ handoffId }) => handoffId === command.handoffId);

  if (existingIndex >= 0) {
    const existing = registry.handoffs[existingIndex]!;
    ensure(existing.payloadDigest === digest, "HANDOFF_PAYLOAD_MISMATCH", "A stable handoff ID cannot change payload.");
    if (existing.transport.status === "sent" || existing.receipt.status === "received") return registry;
    ensure(existing.transport.attempts < room.returnRoute.maxSendAttempts, "SEND_ATTEMPTS_EXHAUSTED", "Maximum send attempts reached.");
    const next = clone(registry);
    const handoff = next.handoffs[existingIndex]!;
    enforceRetryDelay(handoff.transport.attemptHistory, command.attemptedAt);
    handoff.transport.attempts += 1;
    handoff.transport.attemptHistory.push({
      attemptedAt: command.attemptedAt,
      outcome: command.outcome,
    });
    handoff.transport.lastAttemptAt = command.attemptedAt;
    handoff.transport.status = command.outcome === "sent"
      ? "sent"
      : handoff.transport.attempts >= room.returnRoute.maxSendAttempts
        ? "return-channel-failed"
        : "pending";
    return incrementRevision(next);
  }

  const handoff: CoordinationHandoff = {
    handoffId: command.handoffId,
    payloadDigest: digest,
    payload: clone(command.payload),
    transport: {
      status: command.outcome === "sent" ? "sent" : "pending",
      attempts: 1,
      attemptHistory: [{ attemptedAt: command.attemptedAt, outcome: command.outcome }],
      lastAttemptAt: command.attemptedAt,
    },
    receipt: { status: "pending" },
    acceptance: {
      status: "pending",
      evidenceIds: [],
      requiredChecks: [],
      remainingScope: [],
    },
  };
  const next = clone(registry);
  next.handoffs.push(handoff);
  return incrementRevision(next);
}

function receiveHandoff(
  registry: CoordinationRegistry,
  command: Extract<CoordinationCommand, { type: "receive-handoff" }>,
): CoordinationRegistry {
  const room = roomForPayload(registry, command.handoffId, command.payload);
  ensureCurrentGeneration(registry, room.ownershipGeneration);
  ensureCurrentAttempt(registry, room);
  ensure(
    room.status === "active" || room.status === "returned" || room.status === "accepted",
    "SUPERSEDED_ATTEMPT",
    "A superseded or inactive attempt cannot advance receipt.",
  );
  ensure(
    command.senderThreadId === room.locator.threadId,
    "HANDOFF_SENDER_MISMATCH",
    "Handoff sender does not match the registered room thread.",
  );
  const index = registry.handoffs.findIndex(({ handoffId }) => handoffId === command.handoffId);
  ensure(index >= 0, "HANDOFF_NOT_SENT", "Record a successful send before receipt.");
  const handoff = registry.handoffs[index]!;
  ensure(
    handoff.payloadDigest === canonicalPayloadDigest(command.payload),
    "HANDOFF_PAYLOAD_MISMATCH",
    "A stable handoff ID cannot change payload.",
  );
  ensure(handoff.transport.status === "sent", "HANDOFF_NOT_SENT", "A failed or pending send cannot be received.");
  if (handoff.receipt.status === "received") return registry;

  const nextSequence = Math.max(
    0,
    ...registry.handoffs.map(({ receipt }) => receipt.arrivalSequence ?? 0),
  ) + 1;
  const next = clone(registry);
  next.handoffs[index]!.receipt = {
    status: "received",
    receivedAt: command.receivedAt,
    senderThreadId: command.senderThreadId,
    channel: room.returnRoute.automaticChannel,
    arrivalSequence: nextSequence,
  };
  const roomIndex = next.roomRuns.findIndex((candidate) => sameAttempt(candidate, room));
  next.roomRuns[roomIndex]!.status = "returned";
  next.completionQueue.push({ handoffId: command.handoffId, arrivalSequence: nextSequence });
  return incrementRevision(next);
}

function acknowledgeReceipt(
  registry: CoordinationRegistry,
  command: Extract<CoordinationCommand, { type: "acknowledge-receipt" }>,
): CoordinationRegistry {
  ensure(
    command.planTaskId === registry.scopeOwnership.planTaskId,
    "RECEIPT_ACKNOWLEDGER_NOT_OWNER",
    "Only the current PLAN owner can acknowledge receipt.",
  );
  const index = registry.handoffs.findIndex(({ handoffId }) => handoffId === command.handoffId);
  ensure(index >= 0, "HANDOFF_NOT_FOUND", "The handoff is not stored.");
  const handoff = registry.handoffs[index]!;
  const room = roomForPayload(registry, command.handoffId, handoff.payload);
  ensureCurrentAttempt(registry, room);
  ensure(handoff.receipt.status === "received", "HANDOFF_NOT_RECEIVED", "Receipt must exist before acknowledgement.");
  if (handoff.receipt.acknowledgedAt !== undefined) return registry;
  const next = clone(registry);
  next.handoffs[index]!.receipt.acknowledgedAt = command.acknowledgedAt;
  return incrementRevision(next);
}

function acceptHandoff(
  registry: CoordinationRegistry,
  command: Extract<CoordinationCommand, { type: "accept-handoff" }>,
  context: CoordinationCommandContext,
): CoordinationRegistry {
  const handoffIndex = registry.handoffs.findIndex(({ handoffId }) => handoffId === command.handoffId);
  ensure(handoffIndex >= 0, "HANDOFF_NOT_FOUND", "The handoff is not stored.");
  const handoff = registry.handoffs[handoffIndex]!;
  const room = roomForPayload(registry, command.handoffId, handoff.payload);
  ensureCurrentGeneration(registry, room.ownershipGeneration);
  ensureCurrentAttempt(registry, room);
  ensure(room.status === "returned", "HANDOFF_NOT_RETURNED", "Receipt must be recorded before acceptance.");
  ensure(handoff.receipt.status === "received", "HANDOFF_NOT_RECEIVED", "Receipt must be recorded before acceptance.");
  ensure(handoff.receipt.acknowledgedAt !== undefined, "RECEIPT_NOT_ACKNOWLEDGED", "PLAN must acknowledge receipt before acceptance.");
  ensure(
    command.reviewer === registry.scopeOwnership.planTaskId,
    "ACCEPTANCE_REVIEWER_NOT_OWNER",
    "Only the current PLAN owner can accept a handoff.",
  );
  ensureQueuePriority(registry, command.handoffId);
  ensure(handoff.payload.status === "PASS", "TERMINAL_STATUS_NOT_PASS", "Only PASS can be accepted.");
  ensureCommitEvidence(handoff.payload);
  ensure(
    command.requiredChecks.length > 0 && command.requiredChecks.every(({ status }) => status === "passed"),
    "ACCEPTANCE_CHECK_FAILED",
    "Every required acceptance check must pass.",
  );
  const evidence = new Set(command.evidenceIds);
  ensure(
    room.requiredEvidence.every((id) => evidence.has(id)) && handoff.payload.evidenceIds.every((id) => evidence.has(id)),
    "REQUIRED_EVIDENCE_MISSING",
    "Acceptance must include room and payload evidence requirements.",
  );
  const evidenceById = context.evidenceById ?? new Map<string, { repositoryId: string; commit: string }>();
  ensure(
    command.evidenceIds.every((id) => evidenceById.has(id)),
    "EVIDENCE_NOT_CANONICAL",
    "Accepted evidence must resolve to canonical Evidence records.",
  );
  ensureEvidenceMatchesPayload(handoff.payload, command.evidenceIds, evidenceById);
  ensureUxComplete(room.ux, command.evidenceIds, evidenceById);

  const next = clone(registry);
  next.handoffs[handoffIndex]!.acceptance = {
    status: "accepted",
    reviewer: command.reviewer,
    reviewedAt: command.reviewedAt,
    evidenceIds: [...command.evidenceIds],
    requiredChecks: clone(command.requiredChecks),
    remainingScope: [...command.remainingScope],
  };
  const roomIndex = next.roomRuns.findIndex((candidate) => sameAttempt(candidate, room));
  next.roomRuns[roomIndex]!.status = "accepted";
  next.completionQueue = next.completionQueue.filter(({ handoffId }) => handoffId !== command.handoffId);
  return incrementRevision(next);
}

function resolveHandoff(
  registry: CoordinationRegistry,
  command: Extract<CoordinationCommand, { type: "resolve-handoff" }>,
): CoordinationRegistry {
  ensure(
    command.reviewer === registry.scopeOwnership.planTaskId,
    "ACCEPTANCE_REVIEWER_NOT_OWNER",
    "Only the current PLAN owner can resolve a handoff.",
  );
  ensureNonBlank(command.reviewNote, "REVIEW_NOTE_MISSING");
  const handoffIndex = registry.handoffs.findIndex(({ handoffId }) => handoffId === command.handoffId);
  ensure(handoffIndex >= 0, "HANDOFF_NOT_FOUND", "The handoff is not stored.");
  const handoff = registry.handoffs[handoffIndex]!;
  const room = roomForPayload(registry, command.handoffId, handoff.payload);
  ensureCurrentAttempt(registry, room);
  ensure(handoff.acceptance.status === "pending", "HANDOFF_ALREADY_REVIEWED", "A reviewed handoff cannot be resolved again.");
  ensure(room.status === "returned", "HANDOFF_NOT_RETURNED", "Only returned output can be resolved.");
  ensure(handoff.receipt.status === "received", "HANDOFF_NOT_RECEIVED", "Receipt must exist before review.");
  ensure(handoff.receipt.acknowledgedAt !== undefined, "RECEIPT_NOT_ACKNOWLEDGED", "Acknowledge receipt before review.");
  ensureQueuePriority(registry, command.handoffId);

  const next = clone(registry);
  next.handoffs[handoffIndex]!.acceptance = {
    status: command.decision,
    reviewer: command.reviewer,
    reviewedAt: command.reviewedAt,
    reviewNote: command.reviewNote,
    evidenceIds: [],
    requiredChecks: [],
    remainingScope: [...command.remainingScope],
  };
  const roomIndex = next.roomRuns.findIndex((candidate) => sameAttempt(candidate, room));
  next.roomRuns[roomIndex]!.status = command.decision === "needs-revision" ? "superseded" : "closed";
  next.completionQueue = next.completionQueue.filter(({ handoffId }) => handoffId !== command.handoffId);
  return incrementRevision(next);
}

function releaseRound(
  registry: CoordinationRegistry,
  command: Extract<CoordinationCommand, { type: "release-round" }>,
): CoordinationRegistry {
  ensure(registry.scopeOwnership.state === "active", "SCOPE_NOT_ACTIVE", "Only active scope ownership can be released.");
  ensure(
    command.planTaskId === registry.scopeOwnership.planTaskId,
    "RELEASE_OWNER_MISMATCH",
    "Only the current PLAN owner can release the round.",
  );
  ensure(
    registry.roomRuns.every(({ status }) =>
      status === "superseded" || status === "accepted" || status === "closed") &&
      registry.handoffs.every(({ acceptance }) => acceptance.status !== "pending") &&
      registry.completionQueue.length === 0 &&
      registry.cleanup.every(({ disposition }) => disposition !== "eligible"),
    "ROUND_NOT_RESOLVED",
    "All room attempts, handoffs, queues, and cleanup decisions must be resolved before release.",
  );
  ensure(
    registry.integrationClaims.every(({ state }) => state !== "frozen"),
    "INTEGRATION_FROZEN",
    "A frozen integration claim must be resolved before release.",
  );

  const next = clone(registry);
  next.scopeOwnership.state = "released";
  for (const claim of next.integrationClaims) {
    if (claim.state === "active") claim.state = "released";
  }
  for (const room of next.roomRuns) {
    if (room.status === "accepted") room.status = "closed";
  }
  return incrementRevision(next);
}

function validateRegistry(
  workId: string,
  registry: CoordinationRegistry,
  evidenceById: ReadonlyMap<string, { repositoryId: string; commit: string }>,
): CoordinationValidationIssue[] {
  const issues: CoordinationValidationIssue[] = [];
  const seenAttempts = new Set<string>();
  const seenHandoffAttempts = new Set<string>();
  const seenHandoffIds = new Set<string>();

  validateTransferHistory(workId, registry, issues);

  for (const claim of registry.integrationClaims) {
    if (registry.scopeOwnership.state !== "active" && claim.state === "active") {
      issues.push(issue(
        "COORDINATION_INTEGRATION_CLAIM_MISMATCH",
        `Active integration claim for ${claim.repositoryId} cannot outlive active scope ownership.`,
        workId,
      ));
    }
    if (
      claim.state === "active" &&
      (claim.planTaskId !== registry.scopeOwnership.planTaskId ||
        claim.generation !== registry.scopeOwnership.generation)
    ) {
      issues.push(issue(
        "COORDINATION_INTEGRATION_CLAIM_MISMATCH",
        `Active integration claim for ${claim.repositoryId} does not match current scope ownership.`,
        workId,
      ));
    }
  }

  for (const room of registry.roomRuns) {
    const attemptKey = roomAttemptKey(room);
    if (seenAttempts.has(attemptKey)) {
      issues.push(issue("COORDINATION_DUPLICATE_ROOM_ATTEMPT", `Duplicate room attempt ${attemptKey}.`, workId));
    }
    seenAttempts.add(attemptKey);

    if (room.status === "active" || room.status === "returned" || room.status === "accepted") {
      collectActivationIssues(workId, registry, room, issues);
    }
    if (
      room.ownershipGeneration !== registry.scopeOwnership.generation &&
      (room.status === "prepared" || room.status === "active" || room.status === "returned")
    ) {
      issues.push(issue("COORDINATION_STALE_ACTIVE_ATTEMPT", `${attemptKey} uses a stale ownership generation.`, workId));
    }
  }

  for (const handoff of registry.handoffs) {
    if (seenHandoffIds.has(handoff.handoffId)) {
      issues.push(issue("COORDINATION_DUPLICATE_HANDOFF_ID", `Duplicate handoff ID ${handoff.handoffId}.`, workId));
    }
    seenHandoffIds.add(handoff.handoffId);
    const exactRoom = findRoomForStoredHandoff(registry, handoff);
    const room = exactRoom ?? registry.roomRuns.find(({ expectedHandoffId }) => expectedHandoffId === handoff.handoffId);
    if (room === undefined || !handoffIdentityMatches(registry, room, handoff.handoffId, handoff.payload)) {
      issues.push(issue(
        "COORDINATION_HANDOFF_IDENTITY_MISMATCH",
        `Handoff ${handoff.handoffId} does not match its registered room attempt.`,
        workId,
      ));
    }
    if (room === undefined) continue;
    const attemptKey = roomAttemptKey(room);
    if (seenHandoffAttempts.has(attemptKey)) {
      issues.push(issue(
        "COORDINATION_MULTIPLE_HANDOFFS_FOR_ATTEMPT",
        `Room attempt ${attemptKey} has more than one terminal handoff.`,
        workId,
      ));
    }
    seenHandoffAttempts.add(attemptKey);
    if (handoff.payloadDigest !== canonicalPayloadDigest(handoff.payload)) {
      issues.push(issue("COORDINATION_HANDOFF_DIGEST_MISMATCH", `Handoff ${handoff.handoffId} digest is stale.`, workId));
    }
    if (handoff.receipt.status === "received" && handoff.transport.status !== "sent") {
      issues.push(issue("COORDINATION_RECEIPT_WITHOUT_SEND", `Handoff ${handoff.handoffId} was received without sent state.`, workId));
    }
    if (
      handoff.receipt.status === "received" &&
      (handoff.receipt.senderThreadId !== room.locator.threadId ||
        handoff.receipt.channel !== room.returnRoute.automaticChannel)
    ) {
      issues.push(issue(
        "COORDINATION_RECEIPT_SENDER_MISMATCH",
        `Handoff ${handoff.handoffId} receipt provenance does not match its room locator and return channel.`,
        workId,
      ));
    }
    collectTransportIssues(workId, room, handoff, issues);
    if (handoff.acceptance.status === "accepted") {
      collectStoredAcceptanceIssues(workId, registry, room, handoff, evidenceById, issues);
    }
  }

  for (const room of registry.roomRuns) {
    const handoff = registry.handoffs.find((candidate) => sameAttemptPayload(candidate.payload, room));
    if (room.status === "returned" && (handoff?.receipt.status !== "received" || handoff.acceptance.status !== "pending")) {
      issues.push(issue(
        "COORDINATION_RETURNED_ROOM_MISSING_HANDOFF",
        `Returned room ${roomAttemptKey(room)} lacks a received pending handoff.`,
        workId,
      ));
    }
    if (room.status === "accepted" && handoff?.acceptance.status !== "accepted") {
      issues.push(issue(
        "COORDINATION_ACCEPTED_ROOM_MISSING_HANDOFF",
        `Accepted room ${roomAttemptKey(room)} lacks an accepted handoff.`,
        workId,
      ));
    }
  }

  const queuedIds = new Set<string>();
  const arrivalSequences = new Set<number>();
  for (const item of registry.completionQueue) {
    const handoff = registry.handoffs.find(({ handoffId }) => handoffId === item.handoffId);
    if (
      queuedIds.has(item.handoffId) ||
      arrivalSequences.has(item.arrivalSequence) ||
      handoff?.receipt.status !== "received" ||
      handoff.receipt.arrivalSequence !== item.arrivalSequence ||
      handoff.acceptance.status !== "pending"
    ) {
      issues.push(issue("COORDINATION_QUEUE_MISMATCH", `Invalid completion queue item ${item.handoffId}.`, workId));
    }
    queuedIds.add(item.handoffId);
    arrivalSequences.add(item.arrivalSequence);
  }
  for (const handoff of registry.handoffs) {
    const room = findRoomForStoredHandoff(registry, handoff);
    const queueCount = registry.completionQueue.filter(({ handoffId }) => handoffId === handoff.handoffId).length;
    const shouldBeQueued = handoff.receipt.status === "received" &&
      handoff.acceptance.status === "pending" &&
      room?.status === "returned";
    if (shouldBeQueued && queueCount !== 1) {
      issues.push(issue(
        "COORDINATION_RECEIVED_HANDOFF_NOT_QUEUED",
        `Received pending handoff ${handoff.handoffId} must be queued exactly once.`,
        workId,
      ));
    }
    if (!shouldBeQueued && queueCount !== 0) {
      issues.push(issue(
        "COORDINATION_REVIEWED_HANDOFF_STILL_QUEUED",
        `Non-pending handoff ${handoff.handoffId} must not remain queued.`,
        workId,
      ));
    }
  }

  for (const candidate of registry.cleanup) {
    if (candidate.disposition !== "retain") {
      const assessment = assessCleanupEligibility(candidate, {
        planTaskId: registry.scopeOwnership.planTaskId,
        generation: registry.scopeOwnership.generation,
        scopeState: registry.scopeOwnership.state,
        integrationClaims: registry.integrationClaims,
        evidenceById,
      });
      if (!assessment.eligible) {
        issues.push(issue(
          "COORDINATION_UNSAFE_CLEANUP",
          `Cleanup disposition ${candidate.disposition} is unsafe: ${assessment.reasons.join(", ")}.`,
          workId,
        ));
      }
    }
  }
  return issues;
}

function collectActivationIssues(
  workId: string,
  registry: CoordinationRegistry,
  room: CoordinationRoomRun,
  issues: CoordinationValidationIssue[],
): void {
  try {
    ensureActivationReady(registry, room);
  } catch (error) {
    if (error instanceof CoordinationTransitionError) {
      issues.push(issue(`COORDINATION_${error.code}`, error.message, workId));
    } else {
      throw error;
    }
  }
}

function collectStoredAcceptanceIssues(
  workId: string,
  registry: CoordinationRegistry,
  room: CoordinationRoomRun,
  handoff: CoordinationHandoff,
  evidenceById: ReadonlyMap<string, { repositoryId: string; commit: string }>,
  issues: CoordinationValidationIssue[],
): void {
  if (
    (room.status !== "accepted" && room.status !== "closed") ||
    handoff.receipt.status !== "received" ||
    handoff.receipt.acknowledgedAt === undefined ||
    handoff.payload.status !== "PASS" ||
    room.ownershipGeneration !== registry.scopeOwnership.generation ||
    !isCurrentAttempt(registry, room) ||
    handoff.acceptance.reviewer !== registry.scopeOwnership.planTaskId
  ) {
    issues.push(issue("COORDINATION_ACCEPTANCE_STATE_MISMATCH", `Handoff ${handoff.handoffId} has invalid accepted state.`, workId));
  }
  if (
    handoff.acceptance.requiredChecks.length === 0 ||
    handoff.acceptance.requiredChecks.some(({ status }) => status !== "passed")
  ) {
    issues.push(issue("COORDINATION_ACCEPTANCE_CHECK_FAILED", `Handoff ${handoff.handoffId} has an unpassed acceptance check.`, workId));
  }
  const acceptedEvidence = new Set(handoff.acceptance.evidenceIds);
  if (
    handoff.acceptance.evidenceIds.some((id) => !evidenceById.has(id)) ||
    room.requiredEvidence.some((id) => !acceptedEvidence.has(id)) ||
    handoff.payload.evidenceIds.some((id) => !acceptedEvidence.has(id))
  ) {
    issues.push(issue("COORDINATION_EVIDENCE_NOT_CANONICAL", `Handoff ${handoff.handoffId} lacks canonical required evidence.`, workId));
  }
  try {
    ensureCommitEvidence(handoff.payload);
    ensureEvidenceMatchesPayload(handoff.payload, handoff.acceptance.evidenceIds, evidenceById);
    ensureUxComplete(room.ux, handoff.acceptance.evidenceIds, evidenceById);
    ensureQueuePriority(registry, handoff.handoffId, handoff.acceptance.reviewedAt);
  } catch (error) {
    if (error instanceof CoordinationTransitionError) {
      issues.push(issue(`COORDINATION_${error.code}`, error.message, workId));
    } else {
      throw error;
    }
  }
}

function ensureActivationReady(registry: CoordinationRegistry, room: CoordinationRoomRun): void {
  ensure(registry.scopeOwnership.state === "active", "SCOPE_NOT_ACTIVE", "Room activation requires active scope ownership.");
  ensureCurrentGeneration(registry, room.ownershipGeneration);
  ensureNonBlank(room.locator.threadId, "ROOM_LOCATOR_MISSING");
  ensure(
    room.contextAcknowledgement.status === "acknowledged" && room.contextAcknowledgement.acknowledgedAt !== undefined,
    "CONTEXT_NOT_ACKNOWLEDGED",
    "Room activation requires a recorded Context Acknowledgement.",
  );
  ensure(
    room.returnRoute.planTaskId === registry.scopeOwnership.planTaskId,
    "RETURN_PLAN_MISMATCH",
    "Return route PLAN must own the current scope.",
  );
  const modelFields = {
    modelId: room.modelDecision.modelId,
    reasoningEffort: room.modelDecision.reasoningEffort,
    taskComplexity: room.modelDecision.taskComplexity,
    scopeSize: room.modelDecision.scopeSize,
    uncertainty: room.modelDecision.uncertainty,
    missingContext: room.modelDecision.missingContext,
    failureImpact: room.modelDecision.failureImpact,
    recoverability: room.modelDecision.recoverability,
    reason: room.modelDecision.reason,
    smallerOptionAssessment: room.modelDecision.smallerOptionAssessment,
    availabilitySource: room.modelDecision.availabilitySource,
    availabilityObservedAt: room.modelDecision.availabilityObservedAt,
  };
  for (const [name, value] of Object.entries(modelFields)) {
    ensure(
      value.trim() !== "",
      "MODEL_RATIONALE_MISSING",
      `Model decision field ${name} is required.`,
    );
  }
  ensure(
    room.modelDecision.escalationTriggers.length > 0 &&
      room.modelDecision.escalationTriggers.every((item) => item.trim() !== ""),
    "MODEL_RATIONALE_MISSING",
    "Model decision escalation triggers are required.",
  );
  ensure(
    room.modelDecision.availableModelEfforts.some(({ modelId, reasoningEfforts }) =>
      modelId === room.modelDecision.modelId && reasoningEfforts.includes(room.modelDecision.reasoningEffort)),
    "MODEL_EFFORT_UNAVAILABLE",
    "Selected model and effort are absent from the observed host capability snapshot.",
  );
  ensureUxDeclared(room.ux);
  ensure(room.requiredEvidence.length > 0, "EVIDENCE_REQUIREMENT_MISSING", "Room activation requires evidence targets.");
}

function ensureUxDeclared(ux: CoordinationUxGate): void {
  if (ux.applicability === "not-applicable") {
    ensure(!ux.visibleChange, "VISIBLE_CHANGE_UX_EXEMPT", "A visible change cannot be UX not-applicable.");
    ensureNonBlank(ux.reason, "UX_EXEMPTION_REASON_MISSING");
    return;
  }
  ensure(ux.criteria.length > 0, "UX_CRITERIA_MISSING", "UX-applicable work requires measurable criteria.");
  ensure(ux.mechanismChecks.length > 0, "UX_MECHANISM_CHECKS_MISSING", "UX-applicable work requires mechanism checks.");
  ensure(ux.regressionChecks.length > 0, "UX_REGRESSION_CHECKS_MISSING", "UX-applicable work requires regression checks.");
}

function ensureUxComplete(
  ux: CoordinationUxGate,
  acceptedEvidenceIds: string[],
  evidenceById: ReadonlyMap<string, { repositoryId: string; commit: string }>,
): void {
  ensureUxDeclared(ux);
  if (ux.applicability === "not-applicable") return;
  const acceptedEvidence = new Set(acceptedEvidenceIds);
  const measured = ux.criteria.every(({ status, evidenceIds }) =>
    status === "passed" &&
    evidenceIds.length > 0 &&
    evidenceIds.every((id) => acceptedEvidence.has(id) && evidenceById.has(id)));
  const mechanisms = ux.mechanismChecks.every(({ status }) => status === "passed");
  const regressions = ux.regressionChecks.every(({ status }) => status === "passed");
  const userAccepted = ux.userAcceptance.required
    ? ux.userAcceptance.status === "accepted" &&
      ux.userAcceptance.actor?.kind === "user" &&
      isNonBlank(ux.userAcceptance.actor.id) &&
      ux.userAcceptance.evidenceIds.length > 0 &&
      ux.userAcceptance.evidenceIds.every((id) => acceptedEvidence.has(id) && evidenceById.has(id))
    : ux.userAcceptance.status === "not-required";
  ensure(measured && mechanisms && regressions && userAccepted, "UX_ACCEPTANCE_INCOMPLETE", "Measured UX and required user acceptance must pass.");
}

function ensureEvidenceMatchesPayload(
  payload: CoordinationTerminalPayload,
  acceptedEvidenceIds: string[],
  evidenceById: ReadonlyMap<string, { repositoryId: string; commit: string }>,
): void {
  if (!payload.behaviorChanged && payload.changedFiles.length === 0) return;
  const matchingEvidence = acceptedEvidenceIds.some((id) => {
    const evidence = evidenceById.get(id);
    return evidence?.repositoryId === payload.ownerRepositoryId && evidence.commit === payload.exactCommit;
  });
  ensure(
    matchingEvidence,
    "EVIDENCE_OWNER_COMMIT_MISMATCH",
    "Changed behavior requires canonical evidence for the payload owner repository and exact commit.",
  );
}

function ensureCommitEvidence(payload: CoordinationTerminalPayload): void {
  if (payload.behaviorChanged || payload.changedFiles.length > 0) {
    ensure(
      payload.exactCommit !== undefined && /^[a-fA-F0-9]{40}$/u.test(payload.exactCommit),
      "EXACT_COMMIT_REQUIRED",
      "Changed behavior or files require an exact owner-repository commit.",
    );
  }
}

function roomForPayload(
  registry: CoordinationRegistry,
  handoffId: string,
  payload: CoordinationTerminalPayload,
): CoordinationRoomRun {
  const room = registry.roomRuns.find((candidate) =>
    candidate.roomRunId === payload.roomRunId &&
    candidate.ownershipGeneration === payload.ownershipGeneration &&
    candidate.revisionAttempt === payload.revisionAttempt);
  ensure(room !== undefined, "ROOM_ATTEMPT_NOT_FOUND", "The handoff room attempt is not registered.");
  ensureCurrentGeneration(registry, room.ownershipGeneration);
  ensure(
    handoffIdentityMatches(registry, room, handoffId, payload),
    handoffId === room.expectedHandoffId ? "HANDOFF_IDENTITY_MISMATCH" : "UNEXPECTED_HANDOFF_ID",
    "Handoff identity does not match the registered attempt.",
  );
  return room;
}

function handoffIdentityMatches(
  registry: CoordinationRegistry,
  room: CoordinationRoomRun,
  handoffId: string,
  payload: CoordinationTerminalPayload,
): boolean {
  return handoffId === room.expectedHandoffId &&
    payload.planTaskId === room.returnRoute.planTaskId &&
    payload.planTaskId === registry.scopeOwnership.planTaskId &&
    payload.roomRunId === room.roomRunId &&
    payload.laneId === room.laneId &&
    payload.ownerRepositoryId === room.ownerRepositoryId &&
    payload.ownershipGeneration === room.ownershipGeneration &&
    payload.revisionAttempt === room.revisionAttempt;
}

function findRoomForStoredHandoff(
  registry: CoordinationRegistry,
  handoff: CoordinationHandoff,
): CoordinationRoomRun | undefined {
  return registry.roomRuns.find((room) =>
    room.roomRunId === handoff.payload.roomRunId &&
    room.ownershipGeneration === handoff.payload.ownershipGeneration &&
    room.revisionAttempt === handoff.payload.revisionAttempt);
}

function ensureCurrentGeneration(registry: CoordinationRegistry, generation: number): void {
  ensure(
    registry.scopeOwnership.state === "active" && registry.scopeOwnership.generation === generation,
    "STALE_OWNERSHIP_GENERATION",
    "Only the active ownership generation can advance lifecycle state.",
  );
}

function ensureCurrentAttempt(registry: CoordinationRegistry, room: CoordinationRoomRun): void {
  ensure(isCurrentAttempt(registry, room), "SUPERSEDED_ATTEMPT", "Only the latest non-superseded attempt can advance.");
}

function isCurrentAttempt(registry: CoordinationRegistry, room: CoordinationRoomRun): boolean {
  return room.status !== "superseded" &&
    !registry.roomRuns.some((candidate) =>
      candidate.roomRunId === room.roomRunId &&
      candidate.ownershipGeneration === room.ownershipGeneration &&
      candidate.revisionAttempt > room.revisionAttempt);
}

function findRoomIndex(
  registry: CoordinationRegistry,
  roomRunId: string,
  ownershipGeneration: number,
  revisionAttempt: number,
): number {
  const index = registry.roomRuns.findIndex((room) =>
    room.roomRunId === roomRunId &&
    room.ownershipGeneration === ownershipGeneration &&
    room.revisionAttempt === revisionAttempt);
  ensure(index >= 0, "ROOM_ATTEMPT_NOT_FOUND", "The room attempt is not registered.");
  return index;
}

function roomAttemptKey(room: CoordinationRoomRun): string {
  return `${room.roomRunId}@g${room.ownershipGeneration}:r${room.revisionAttempt}`;
}

function sameAttempt(left: CoordinationRoomRun, right: CoordinationRoomRun): boolean {
  return left.roomRunId === right.roomRunId &&
    left.ownershipGeneration === right.ownershipGeneration &&
    left.revisionAttempt === right.revisionAttempt;
}

function sameAttemptPayload(payload: CoordinationTerminalPayload, room: CoordinationRoomRun): boolean {
  return payload.roomRunId === room.roomRunId &&
    payload.ownershipGeneration === room.ownershipGeneration &&
    payload.revisionAttempt === room.revisionAttempt;
}

function ensureQueuePriority(registry: CoordinationRegistry, handoffId: string, reviewedAt?: string): void {
  const target = registry.handoffs.find((handoff) => handoff.handoffId === handoffId);
  ensure(target !== undefined, "HANDOFF_NOT_FOUND", "The handoff is not stored.");
  const candidates = registry.handoffs.filter((queued) => {
    if (queued.handoffId === handoffId) return true;
    if (reviewedAt !== undefined) {
      // Later arrivals cannot invalidate an earlier acceptance. A handoff
      // resolved after that acceptance was still pending at review time.
      return queued.receipt.status === "received" &&
        Date.parse(queued.receipt.receivedAt!) <= Date.parse(reviewedAt) &&
        (queued.acceptance.status === "pending" ||
          (queued.acceptance.reviewedAt !== undefined &&
            Date.parse(queued.acceptance.reviewedAt) > Date.parse(reviewedAt)));
    }
    const room = findRoomForStoredHandoff(registry, queued);
    return queued.receipt.status === "received" &&
      queued.acceptance.status === "pending" &&
      room?.status === "returned";
  });
  candidates.sort((left, right) =>
    handoffPriority(left) - handoffPriority(right) ||
    (left.receipt.arrivalSequence ?? Number.MAX_SAFE_INTEGER) -
      (right.receipt.arrivalSequence ?? Number.MAX_SAFE_INTEGER) ||
    left.handoffId.localeCompare(right.handoffId));
  ensure(
    candidates[0]?.handoffId === handoffId,
    "QUEUE_PRIORITY_VIOLATION",
    "Review handoffs by severity and then recorded arrival sequence.",
  );
}

function enforceRetryDelay(
  history: Array<{ attemptedAt: string; outcome: "sent" | "failed" }>,
  attemptedAt: string,
): void {
  const previous = history.at(-1);
  if (previous === undefined) return;
  const requiredDelayMs = history.length === 1 ? 10_000 : 30_000;
  const elapsedMs = Date.parse(attemptedAt) - Date.parse(previous.attemptedAt);
  ensure(
    Number.isFinite(elapsedMs) && elapsedMs >= requiredDelayMs,
    "RETRY_TOO_EARLY",
    `Retry ${history.length + 1} must wait at least ${requiredDelayMs / 1_000} seconds.`,
  );
}

function collectTransportIssues(
  workId: string,
  room: CoordinationRoomRun,
  handoff: CoordinationHandoff,
  issues: CoordinationValidationIssue[],
): void {
  const history = handoff.transport.attemptHistory;
  let invalid = handoff.transport.attempts !== history.length ||
    history.length === 0 ||
    history.length > room.returnRoute.maxSendAttempts ||
    handoff.transport.lastAttemptAt !== history.at(-1)?.attemptedAt;
  for (let index = 1; index < history.length; index += 1) {
    const requiredDelayMs = index === 1 ? 10_000 : 30_000;
    const elapsed = Date.parse(history[index]!.attemptedAt) - Date.parse(history[index - 1]!.attemptedAt);
    if (!Number.isFinite(elapsed) || elapsed < requiredDelayMs) invalid = true;
  }
  const lastOutcome = history.at(-1)?.outcome;
  if (handoff.transport.status === "sent" && lastOutcome !== "sent") invalid = true;
  if (
    handoff.transport.status === "return-channel-failed" &&
    (history.length !== room.returnRoute.maxSendAttempts || lastOutcome !== "failed")
  ) invalid = true;
  if (
    handoff.transport.status === "pending" &&
    (lastOutcome !== "failed" || history.length >= room.returnRoute.maxSendAttempts)
  ) invalid = true;
  if (invalid) {
    issues.push(issue(
      "COORDINATION_TRANSPORT_HISTORY_MISMATCH",
      `Handoff ${handoff.handoffId} transport state does not match its retry history.`,
      workId,
    ));
  }
}

function validateTransferHistory(
  workId: string,
  registry: CoordinationRegistry,
  issues: CoordinationValidationIssue[],
): void {
  let previousTo: string | undefined;
  let previousGeneration: number | undefined;
  for (const transfer of registry.scopeOwnership.transfers) {
    const affectedExist = transfer.affectedRoomRunIds.every((roomRunId) =>
      registry.roomRuns.some((room) =>
        room.roomRunId === roomRunId && room.ownershipGeneration === transfer.fromGeneration));
    if (
      transfer.newGeneration !== transfer.fromGeneration + 1 ||
      (previousTo !== undefined && transfer.fromPlanTaskId !== previousTo) ||
      (previousGeneration !== undefined && transfer.fromGeneration !== previousGeneration) ||
      !affectedExist
    ) {
      issues.push(issue(
        "COORDINATION_TRANSFER_HISTORY_MISMATCH",
        `Ownership transfer ${transfer.fromGeneration}->${transfer.newGeneration} is not a continuous explicit transfer.`,
        workId,
      ));
    }
    previousTo = transfer.toPlanTaskId;
    previousGeneration = transfer.newGeneration;
  }
  if (
    previousTo !== undefined &&
    (previousTo !== registry.scopeOwnership.planTaskId || previousGeneration !== registry.scopeOwnership.generation)
  ) {
    issues.push(issue(
      "COORDINATION_TRANSFER_HISTORY_MISMATCH",
      "Latest ownership transfer does not match current PLAN and generation.",
      workId,
    ));
  }
}

function handoffPriority(handoff: CoordinationHandoff): number {
  if (handoff.payload.status === "BLOCKER") return 0;
  if (handoff.payload.status === "FAIL") return 1;
  if (handoff.payload.contractChangeRequest !== undefined) return 2;
  return 3;
}

function normalizeScopePath(value: string): string {
  return value.replaceAll("\\", "/").replace(/^\.\//u, "").replace(/\/+$/u, "").toLowerCase();
}

function pathsOverlap(left: string, right: string): boolean {
  return left === right || left.startsWith(`${right}/`) || right.startsWith(`${left}/`);
}

function incrementRevision(registry: CoordinationRegistry): CoordinationRegistry {
  registry.revision += 1;
  return registry;
}

function canonicalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (typeof value === "object" && value !== null) {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([left], [right]) => left < right ? -1 : left > right ? 1 : 0)
        .map(([key, child]) => [key, canonicalize(child)]),
    );
  }
  return value;
}

function clone<T>(value: T): T {
  return structuredClone(value);
}

function issue(code: string, message: string, workId: string): CoordinationValidationIssue {
  return { code, message, workId };
}

function ensure(condition: unknown, code: string, message: string): asserts condition {
  if (!condition) throw new CoordinationTransitionError(code, message);
}

function ensureNonBlank(value: string, code: string): void {
  ensure(isNonBlank(value), code, `${code} requires a non-blank value.`);
}

function isNonBlank(value: string | undefined): value is string {
  return value !== undefined && value.trim() !== "";
}
