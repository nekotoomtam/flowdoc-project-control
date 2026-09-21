import type {
  CoordinationCleanupState,
  CoordinationCleanupStateV2,
  CoordinationHandoff,
  CoordinationHandoffV2,
  CoordinationRegistryV1,
  CoordinationRegistryV2,
  CoordinationRoomRun,
  CoordinationRoomRunV2,
  CoordinationTerminalPayload,
  CoordinationTerminalPayloadV2,
} from "./types.js";
import {
  CoordinationTransitionError,
  applyLegacyCoordinationCommand,
  validateLegacyCoordinationRegistry,
  type CoordinationCommand,
  type CoordinationCommandContext,
  type CoordinationValidationIssue,
} from "./coordination.js";

export interface RoundCommandIdentity {
  planTaskId: string;
  roundId: string;
}

export type CoordinationCommandV2 = RoundCommandIdentity & (
  | { type: "activate-room"; roomRunId: string; revisionAttempt: number }
  | { type: "supersede-attempt"; roomRunId: string; revisionAttempt: number }
  | {
      type: "authorize-revision";
      roomRunId: string;
      priorAttempt: number;
      expectedHandoffId: string;
      livenessDeadline: string;
    }
  | {
      type: "record-send";
      handoffId: string;
      payload: CoordinationTerminalPayloadV2;
      outcome: "sent" | "failed";
      attemptedAt: string;
    }
  | {
      type: "receive-handoff";
      handoffId: string;
      payload: CoordinationTerminalPayloadV2;
      senderThreadId: string;
      receivedAt: string;
    }
  | { type: "acknowledge-receipt"; handoffId: string; acknowledgedAt: string }
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
  | { type: "release-round" }
);

export function applyCoordinationV2Command(
  registry: CoordinationRegistryV2,
  command: CoordinationCommandV2,
  context: CoordinationCommandContext = {},
): CoordinationRegistryV2 {
  ensureRoundIdentity(registry, command);
  const legacy = toLegacyRegistry(registry);
  const result = applyLegacyCoordinationCommand(legacy, toLegacyCommand(command), context);
  return fromLegacyRegistry(result, registry.round);
}

export function validateCoordinationV2Registry(
  workId: string,
  registry: CoordinationRegistryV2,
  evidenceById: ReadonlyMap<string, { repositoryId: string; commit: string }>,
): CoordinationValidationIssue[] {
  const issues: CoordinationValidationIssue[] = [];
  const add = (code: string, message: string) => issues.push({ code, message, workId });

  for (const claim of registry.integrationClaims) {
    if (claim.planTaskId !== registry.round.planTaskId || claim.roundId !== registry.round.roundId) {
      add("COORDINATION_INTEGRATION_OWNER_MISMATCH", "Integration claims must belong to the current PLAN round.");
    }
  }
  for (const room of registry.roomRuns) {
    if (room.roundId !== registry.round.roundId) {
      add("COORDINATION_ROOM_ROUND_MISMATCH", `Room ${room.roomRunId} does not belong to the current round.`);
    }
    if (
      room.returnRoute.planTaskId !== registry.round.planTaskId ||
      room.returnRoute.monitorOwner !== registry.round.planTaskId
    ) {
      add("COORDINATION_RETURN_ROUTE_OWNER_MISMATCH", `Room ${room.roomRunId} does not return to the current PLAN.`);
    }
  }
  for (const handoff of registry.handoffs) {
    if (
      handoff.payload.planTaskId !== registry.round.planTaskId ||
      handoff.payload.roundId !== registry.round.roundId
    ) {
      add("COORDINATION_HANDOFF_ROUND_MISMATCH", `Handoff ${handoff.handoffId} does not belong to the current PLAN round.`);
    }
  }
  for (const cleanup of registry.cleanup) {
    if (cleanup.planTaskId !== registry.round.planTaskId || cleanup.roundId !== registry.round.roundId) {
      add("COORDINATION_CLEANUP_ROUND_MISMATCH", `Cleanup for ${cleanup.repositoryId} does not belong to the current PLAN round.`);
    }
  }

  return [
    ...issues,
    ...validateLegacyCoordinationRegistry(workId, toLegacyRegistry(registry), evidenceById),
  ];
}

function ensureRoundIdentity(registry: CoordinationRegistryV2, identity: RoundCommandIdentity): void {
  if (
    registry.round.state !== "active" ||
    registry.round.planTaskId !== identity.planTaskId ||
    registry.round.roundId !== identity.roundId
  ) {
    throw new CoordinationTransitionError(
      "PLAN_ROUND_MISMATCH",
      "Only the active owning PLAN round can advance coordination state.",
    );
  }
}

function toLegacyCommand(command: CoordinationCommandV2): CoordinationCommand {
  switch (command.type) {
    case "activate-room":
    case "supersede-attempt":
      return {
        type: command.type,
        roomRunId: command.roomRunId,
        ownershipGeneration: 1,
        revisionAttempt: command.revisionAttempt,
      };
    case "authorize-revision":
      return {
        type: command.type,
        roomRunId: command.roomRunId,
        priorAttempt: command.priorAttempt,
        expectedHandoffId: command.expectedHandoffId,
        livenessDeadline: command.livenessDeadline,
      };
    case "record-send":
      return {
        type: command.type,
        handoffId: command.handoffId,
        payload: toLegacyPayload(command.payload),
        outcome: command.outcome,
        attemptedAt: command.attemptedAt,
      };
    case "receive-handoff":
      return {
        type: command.type,
        handoffId: command.handoffId,
        payload: toLegacyPayload(command.payload),
        senderThreadId: command.senderThreadId,
        receivedAt: command.receivedAt,
      };
    case "acknowledge-receipt":
      return {
        type: command.type,
        handoffId: command.handoffId,
        planTaskId: command.planTaskId,
        acknowledgedAt: command.acknowledgedAt,
      };
    case "accept-handoff":
      return {
        type: command.type,
        handoffId: command.handoffId,
        reviewer: command.reviewer,
        reviewedAt: command.reviewedAt,
        evidenceIds: command.evidenceIds,
        requiredChecks: command.requiredChecks,
        remainingScope: command.remainingScope,
      };
    case "resolve-handoff":
      return {
        type: command.type,
        handoffId: command.handoffId,
        reviewer: command.reviewer,
        reviewedAt: command.reviewedAt,
        decision: command.decision,
        reviewNote: command.reviewNote,
        remainingScope: command.remainingScope,
      };
    case "release-round":
      return { type: command.type, planTaskId: command.planTaskId };
    default: {
      const unknown = command as { type?: unknown };
      throw new CoordinationTransitionError(
        "UNKNOWN_COMMAND",
        `Unknown coordination command: ${String(unknown.type)}.`,
      );
    }
  }
}

function toLegacyRegistry(registry: CoordinationRegistryV2): CoordinationRegistryV1 {
  return {
    version: 1,
    revision: registry.revision,
    scopeOwnership: {
      scopeId: registry.round.scopeId,
      scopeKeys: registry.round.scopeKeys,
      allowedFiles: registry.round.allowedFiles,
      planTaskId: registry.round.planTaskId,
      generation: 1,
      state: registry.round.state,
      transfers: [],
    },
    integrationClaims: registry.integrationClaims.map(({ roundId: _roundId, ...claim }) => ({
      ...claim,
      generation: 1,
    })),
    returnOrderPolicy: registry.returnOrderPolicy,
    roomRuns: registry.roomRuns.map(toLegacyRoom),
    handoffs: registry.handoffs.map(toLegacyHandoff),
    completionQueue: registry.completionQueue,
    cleanup: registry.cleanup.map(toLegacyCleanup),
  };
}

function fromLegacyRegistry(
  registry: CoordinationRegistryV1,
  round: CoordinationRegistryV2["round"],
): CoordinationRegistryV2 {
  return {
    version: 2,
    revision: registry.revision,
    round: { ...round, state: registry.scopeOwnership.state },
    integrationClaims: registry.integrationClaims.map(({ generation: _generation, ...claim }) => ({
      ...claim,
      roundId: round.roundId,
    })),
    returnOrderPolicy: registry.returnOrderPolicy,
    roomRuns: registry.roomRuns.map((room) => fromLegacyRoom(room, round.roundId)),
    handoffs: registry.handoffs.map((handoff) => fromLegacyHandoff(handoff, round.roundId)),
    completionQueue: registry.completionQueue,
    cleanup: registry.cleanup.map((cleanup) => fromLegacyCleanup(cleanup, round.roundId)),
  };
}

function toLegacyRoom({ roundId: _roundId, ...room }: CoordinationRoomRunV2): CoordinationRoomRun {
  return { ...room, ownershipGeneration: 1 };
}

function fromLegacyRoom(
  { ownershipGeneration: _ownershipGeneration, ...room }: CoordinationRoomRun,
  roundId: string,
): CoordinationRoomRunV2 {
  return { ...room, roundId };
}

function toLegacyPayload(
  { roundId: _roundId, ...payload }: CoordinationTerminalPayloadV2,
): CoordinationTerminalPayload {
  return { ...payload, ownershipGeneration: 1 };
}

function fromLegacyPayload(
  { ownershipGeneration: _ownershipGeneration, ...payload }: CoordinationTerminalPayload,
  roundId: string,
): CoordinationTerminalPayloadV2 {
  return { ...payload, roundId };
}

function toLegacyHandoff(handoff: CoordinationHandoffV2): CoordinationHandoff {
  return { ...handoff, payload: toLegacyPayload(handoff.payload) };
}

function fromLegacyHandoff(handoff: CoordinationHandoff, roundId: string): CoordinationHandoffV2 {
  return { ...handoff, payload: fromLegacyPayload(handoff.payload, roundId) };
}

function toLegacyCleanup(
  { roundId: _roundId, ...cleanup }: CoordinationCleanupStateV2,
): CoordinationCleanupState {
  return { ...cleanup, ownershipGeneration: 1 };
}

function fromLegacyCleanup(
  { ownershipGeneration: _ownershipGeneration, ...cleanup }: CoordinationCleanupState,
  roundId: string,
): CoordinationCleanupStateV2 {
  return { ...cleanup, roundId };
}
