import { createHash } from "node:crypto";
import {
  CoordinationTransitionError,
  canonicalPayloadDigest,
  type CoordinationCommandContext,
  type CoordinationValidationIssue,
} from "./coordination.js";
import {
  applyCoordinationV2Command,
  validateCoordinationV2Registry,
  type CoordinationCommandV2,
  type RoundCommandIdentity,
} from "./coordination-v2.js";
import type {
  CoordinationHandoffV2,
  CoordinationHandoffV3,
  CoordinationRegistryV2,
  CoordinationRegistryV3,
  CoordinationRoomRunV3,
  ScopeLockVerification,
  CoordinationTerminalPayloadV3,
} from "./types.js";
import {
  collectScopeDefinitionIssues,
  normalizeRepositoryPath,
  pathWithinScope,
  resolveModelAvailability,
} from "./scope-lock.js";
import type {
  WorkflowCompletionReport,
  WorkflowEconomyPacket,
  WorkflowUnknown,
} from "./workflow-economy.js";

export interface WorkflowEconomyIssue {
  code: string;
  message: string;
}

export interface ReopenTrigger {
  kind: "safety-correctness" | "authority-violation" | "missing-prerequisite" | "scope-escape";
  fact: string;
  matchedEscalationTrigger: string;
}

export type CoordinationCommandV3 = RoundCommandIdentity & (
  | { type: "activate-room"; roomRunId: string; revisionAttempt: number }
  | { type: "supersede-attempt"; roomRunId: string; revisionAttempt: number }
  | {
      type: "authorize-revision";
      roomRunId: string;
      priorAttempt: number;
      expectedHandoffId: string;
      livenessDeadline: string;
      reopenTrigger?: ReopenTrigger;
    }
  | {
      type: "record-send";
      handoffId: string;
      payload: CoordinationTerminalPayloadV3;
      outcome: "sent" | "failed";
      attemptedAt: string;
    }
  | {
      type: "receive-handoff";
      handoffId: string;
      payload: CoordinationTerminalPayloadV3;
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

export function packetDigest(packet: WorkflowEconomyPacket): string {
  return createHash("sha256").update(JSON.stringify(canonicalize(packet))).digest("hex");
}

export function validateWorkflowPacket(packet: WorkflowEconomyPacket): WorkflowEconomyIssue[] {
  const issues: WorkflowEconomyIssue[] = [];
  const add = (code: string, message: string): void => { issues.push({ code, message }); };

  if (packet.risk.tier === "critical" && !nonBlank(packet.risk.escalationReason)) {
    add("CRITICAL_REASON_REQUIRED", "Critical work requires a recorded escalation reason.");
  }
  const closeRank = { none: 0, "acceptance-summary": 1, "formal-audit": 2 } as const;
  const tierLimit = { routine: 0, bounded: 1, critical: 2 } as const;
  if (closeRank[packet.proofBudget.closeForm] > tierLimit[packet.risk.tier]) {
    add("CLOSE_FORM_EXCEEDS_TIER", "The close form exceeds the selected Risk Tier.");
  }
  for (const [name, value] of [
    ["maxNewEvidence", packet.proofBudget.maxNewEvidence],
    ["maxDurableDocuments", packet.proofBudget.maxDurableDocuments],
    ["maxReviewCycles", packet.proofBudget.maxReviewCycles],
  ] as const) {
    if (!Number.isInteger(value) || value < 0) {
      add("PROOF_BUDGET_INVALID", `${name} must be a non-negative integer.`);
    }
  }
  for (const artifact of packet.proofBudget.authorizedArtifacts) {
    if (!nonBlank(artifact.failurePrevented) || !nonBlank(artifact.existingProofInsufficient)) {
      add("PROOF_ARTIFACT_JUSTIFICATION_REQUIRED", "Every authorized artifact must name the failure prevented and why existing proof is insufficient.");
    }
  }
  validateUnknowns(packet.unknowns, issues);
  if (packet.fallback !== undefined && (
    !nonBlank(packet.fallback.behavior) ||
    !nonBlank(packet.fallback.performanceBudget) ||
    !nonBlank(packet.fallback.verification)
  )) {
    add("FALLBACK_VERIFICATION_REQUIRED", "A fallback requires behavior, performance budget, and verification.");
  }
  if (packet.policyId === "flowdoc-workflow-economy-v2") {
    issues.push(...collectScopeDefinitionIssues(packet));
  }
  return issues;
}

export function validateWorkflowCompletion(
  packet: WorkflowEconomyPacket,
  completion: WorkflowCompletionReport,
): WorkflowEconomyIssue[] {
  const packetIssues = validateWorkflowPacket(packet);
  const issues = [...packetIssues];
  const add = (code: string, message: string): void => { issues.push({ code, message }); };

  if (!nonBlank(completion.behaviorChanged)) add("COMPLETION_BEHAVIOR_REQUIRED", "Completion must state the behavior change.");
  if (completion.proof.length === 0 || completion.proof.some(({ reference }) => !nonBlank(reference))) {
    add("COMPLETION_PROOF_REQUIRED", "Completion must reference at least one test or Evidence item.");
  }
  if (!nonBlank(completion.downstreamInformation)) add("COMPLETION_DOWNSTREAM_REQUIRED", "Completion must state downstream information or none.");

  if (packet.policyId === "flowdoc-workflow-economy-v2") {
    const validCriteria = new Set(packet.acceptanceCriteria.map((_criterion, index) => `AC-${index + 1}`));
    const coveredCriteria = new Set<string>();
    for (const proof of completion.proof) {
      if (proof.criterionRefs === undefined || proof.criterionRefs.length === 0) {
        add("ACCEPTANCE_CRITERION_REFERENCE_REQUIRED", "Every current-profile proof requires at least one AC-* reference.");
        continue;
      }
      for (const reference of proof.criterionRefs) {
        if (!validCriteria.has(reference)) {
          add("ACCEPTANCE_CRITERION_UNKNOWN", `Proof references unknown acceptance criterion ${reference}.`);
        } else {
          coveredCriteria.add(reference);
        }
      }
    }
    for (const reference of validCriteria) {
      if (!coveredCriteria.has(reference)) {
        add("ACCEPTANCE_CRITERION_UNPROVEN", `Acceptance criterion ${reference} has no proof reference.`);
      }
    }
  }

  validateUnknowns(completion.remainingUnknowns, issues);
  if (completion.remainingUnknowns.some(({ disposition }) => disposition === "blocking")) {
    add("BLOCKING_UNKNOWN_REMAINS", "A blocking unknown prevents acceptance.");
  }

  if (completion.createdEvidenceIds.length > 0 && !hasArtifactAuthorization(packet, "evidence")) {
    add("PROOF_ARTIFACT_UNAUTHORIZED", "New Evidence was not authorized by the proof budget.");
  }
  if (completion.createdDocumentIds.length > 0 && !hasArtifactAuthorization(packet, "document")) {
    add("PROOF_ARTIFACT_UNAUTHORIZED", "A durable document was not authorized by the proof budget.");
  }
  if (completion.createdEvidenceIds.length > packet.proofBudget.maxNewEvidence) {
    add("EVIDENCE_BUDGET_EXCEEDED", "Created Evidence exceeds the packet budget.");
  }
  if (completion.createdDocumentIds.length > packet.proofBudget.maxDurableDocuments) {
    add("DOCUMENT_BUDGET_EXCEEDED", "Created durable documents exceed the packet budget.");
  }
  if (completion.reviewCyclesUsed > packet.proofBudget.maxReviewCycles) {
    add("REVIEW_BUDGET_EXCEEDED", "Review cycles exceed the packet budget.");
  }

  if (packet.workAuthority !== "implementation" && completion.changedFiles.length > 0) {
    add("WORK_AUTHORITY_READ_ONLY", `${packet.workAuthority} WORK cannot return changed files.`);
  }
  const scopeDefinitionIsValid = !packetIssues.some(({ code }) => code.startsWith("SCOPE_"));
  if (scopeDefinitionIsValid) {
    for (const changedFile of completion.changedFiles) {
      if (packet.forbiddenScope.some((scope) => pathWithinScope(changedFile, scope))) {
        add("CHANGED_FILE_FORBIDDEN", `Changed file ${changedFile} is inside forbidden scope.`);
      } else if (!packet.allowedScope.some((scope) => pathWithinScope(changedFile, scope))) {
        add("CHANGED_FILE_OUTSIDE_SCOPE", `Changed file ${changedFile} is outside allowed scope.`);
      }
    }
  }
  return deduplicateIssues(issues);
}

export function applyCoordinationV3Command(
  registry: CoordinationRegistryV3,
  command: CoordinationCommandV3,
  context: CoordinationCommandContext = {},
): CoordinationRegistryV3 {
  if ((command as { type: string }).type === "transfer-ownership") {
    throw new CoordinationTransitionError(
      "OWNERSHIP_TRANSFER_REMOVED",
      "A PLAN round cannot transfer execution authority to another PLAN.",
    );
  }
  ensureRoundIdentity(registry, command);
  ensureStoredPacketProfiles(registry);

  if (command.type === "activate-room") {
    const room = findRoom(registry, command.roomRunId, command.revisionAttempt);
    ensure(
      room.packet.policyId === "flowdoc-workflow-economy-v2",
      "HISTORICAL_WORKFLOW_PACKET_READ_ONLY",
      "Policy v1 packets remain readable but cannot activate a new round.",
    );
    throwFirstIssue(validateWorkflowPacket(room.packet));
    throwFirstIssue(collectRoomProfileIssues(registry, room));
  }
  if (command.type === "record-send" || command.type === "receive-handoff") {
    const room = findRoom(registry, command.payload.roomRunId, command.payload.revisionAttempt);
    ensurePayloadIdentity(command.payload, registry);
    throwFirstIssue(validateWorkflowCompletion(room.packet, command.payload.completion));
  }
  if (command.type === "accept-handoff") {
    const handoff = registry.handoffs.find(({ handoffId }) => handoffId === command.handoffId);
    ensure(handoff !== undefined, "HANDOFF_NOT_FOUND", "The handoff is not stored.");
    const room = findRoom(registry, handoff.payload.roomRunId, handoff.payload.revisionAttempt);
    throwFirstIssue(validateWorkflowCompletion(room.packet, handoff.payload.completion));
    if (room.packet.policyId === "flowdoc-workflow-economy-v2") {
      ensure(context.scopeLockVerification !== undefined, "SCOPE_VERIFICATION_REQUIRED", "Current-profile acceptance requires a passing Scope Lock verification.");
      throwFirstIssue(collectScopeVerificationIssues(room, handoff, context.scopeLockVerification));
    }
  }
  if (command.type === "authorize-revision") {
    const prior = findRoom(registry, command.roomRunId, command.priorAttempt);
    if (prior.status === "accepted") return reopenAcceptedRoom(registry, prior, command);
  }
  if (command.type === "supersede-attempt") {
    const room = findRoom(registry, command.roomRunId, command.revisionAttempt);
    ensure(room.status !== "accepted", "ACCEPTED_WORK_MUST_STOP", "Accepted work cannot start another proof or revision cycle.");
  }

  const nextV2 = applyCoordinationV2Command(
    toV2Registry(registry),
    toV2Command(command),
    context,
  );
  return fromV2Registry(nextV2, registry, command, context);
}

export function validateCoordinationV3Registry(
  workId: string,
  registry: CoordinationRegistryV3,
  evidenceById: ReadonlyMap<string, { repositoryId: string; commit: string }>,
): CoordinationValidationIssue[] {
  const issues = validateCoordinationV2Registry(workId, toV2Registry(registry), evidenceById);
  const add = (code: string, message: string): void => { issues.push({ code, message, workId }); };

  for (const room of registry.roomRuns) {
    for (const packetIssue of validateWorkflowPacket(room.packet)) add(packetIssue.code, packetIssue.message);
    if (room.packetDigest !== packetDigest(room.packet)) {
      add("PACKET_PROFILE_CHANGED", `Room ${room.roomRunId} packet no longer matches its stored digest.`);
    }
    if (room.packet.ownerRepositoryId !== room.ownerRepositoryId) {
      add("WORKFLOW_PACKET_OWNER_ROOM_MISMATCH", `Room ${room.roomRunId} and its packet name different owner repositories.`);
    }
    if (registry.round.state !== "active" && (room.status === "prepared" || room.status === "active" || room.status === "returned")) {
      add("WORKFLOW_ACTIVE_ROOM_ROUND_INACTIVE", `Room ${room.roomRunId} remains executable under an inactive round.`);
    }
    if (room.packet.policyId === "flowdoc-workflow-economy-v2") {
      for (const profileIssue of collectRoomProfileIssues(registry, room)) add(profileIssue.code, profileIssue.message);
    }
  }
  for (const handoff of registry.handoffs) {
    const room = registry.roomRuns.find((candidate) =>
      candidate.roomRunId === handoff.payload.roomRunId &&
      candidate.revisionAttempt === handoff.payload.revisionAttempt);
    if (room !== undefined) {
      for (const completionIssue of validateWorkflowCompletion(room.packet, handoff.payload.completion)) {
        add(completionIssue.code, completionIssue.message);
      }
      if (room.packet.policyId === "flowdoc-workflow-economy-v2" && handoff.acceptance.status === "accepted") {
        if (handoff.acceptance.scopeLockVerification === undefined) {
          add("SCOPE_VERIFICATION_REQUIRED", `Accepted handoff ${handoff.handoffId} lacks Scope Lock verification.`);
        } else {
          for (const issue of collectScopeVerificationIssues(room, handoff, handoff.acceptance.scopeLockVerification)) {
            add(issue.code, issue.message);
          }
        }
      }
    }
  }
  return deduplicateCoordinationIssues(issues);
}

function validateUnknowns(unknowns: WorkflowUnknown[], issues: WorkflowEconomyIssue[]): void {
  const allowed = new Set(["blocking", "accepted", "deferred", "irrelevant"]);
  for (const unknown of unknowns) {
    if (!allowed.has(unknown.disposition)) {
      issues.push({ code: "UNKNOWN_DISPOSITION_REQUIRED", message: `Unknown ${unknown.id} requires a disposition.` });
    } else if (unknown.disposition === "deferred" && !nonBlank(unknown.returnTrigger)) {
      issues.push({ code: "DEFERRED_UNKNOWN_TRIGGER_REQUIRED", message: `Deferred unknown ${unknown.id} requires a return trigger.` });
    }
  }
}

function hasArtifactAuthorization(packet: WorkflowEconomyPacket, kind: "evidence" | "document"): boolean {
  return packet.proofBudget.authorizedArtifacts.some((artifact) => artifact.kind === kind);
}

function nonBlank(value: string | undefined): boolean {
  return value !== undefined && value.trim().length > 0;
}

function collectRoomProfileIssues(
  registry: CoordinationRegistryV3,
  room: CoordinationRoomRunV3,
): WorkflowEconomyIssue[] {
  if (room.packet.policyId !== "flowdoc-workflow-economy-v2") return [];
  const issues: WorkflowEconomyIssue[] = [];
  const add = (code: string, message: string): void => { issues.push({ code, message }); };
  const claim = registry.integrationClaims.find(({ repositoryId }) => repositoryId === room.ownerRepositoryId);
  if (registry.round.policyId !== room.packet.policyId) {
    add("WORKFLOW_POLICY_ROUND_MISMATCH", "The round and room packet name different workflow policies.");
  }
  if (room.locator.worktree !== room.packet.scopeLock.worktree) {
    add("SCOPE_WORKTREE_MISMATCH", "The room locator and packet bind different worktrees.");
  }
  if (claim === undefined || claim.baseCommit !== room.packet.scopeLock.baseCommit) {
    add("SCOPE_BASE_COMMIT_MISMATCH", "The integration claim and packet bind different base commits.");
  }
  if (JSON.stringify(room.modelDecision) !== JSON.stringify(room.packet.modelDecision)) {
    add("MODEL_DECISION_ROOM_PACKET_MISMATCH", "The room and packet contain different model decisions.");
  }
  if (room.locator.hostId === undefined || room.locator.hostId.trim() === "") {
    add("MODEL_DISPATCH_HOST_MISSING", "Current-profile rooms require a dispatch host ID.");
  } else {
    issues.push(...resolveModelAvailability(
      room.packet.modelDecision,
      registry.modelAvailabilitySnapshots,
      room.locator.hostId,
    ));
  }
  return issues;
}

function collectScopeVerificationIssues(
  room: CoordinationRoomRunV3,
  handoff: CoordinationHandoffV3,
  verification: ScopeLockVerification,
): WorkflowEconomyIssue[] {
  if (room.packet.policyId !== "flowdoc-workflow-economy-v2") return [];
  const issues: WorkflowEconomyIssue[] = [];
  const add = (code: string, message: string): void => { issues.push({ code, message }); };
  if (verification.baseCommit !== room.packet.scopeLock.baseCommit) {
    add("SCOPE_BASE_COMMIT_MISMATCH", "Scope verification and packet bind different base commits.");
  }
  if (handoff.payload.exactCommit === undefined || verification.terminalCommit !== handoff.payload.exactCommit) {
    add("SCOPE_TERMINAL_COMMIT_MISMATCH", "Scope verification and handoff bind different terminal commits.");
  }
  if (verification.packetDigest !== room.packetDigest || verification.packetDigest !== packetDigest(room.packet)) {
    add("SCOPE_PACKET_DIGEST_MISMATCH", "Scope verification does not bind the immutable dispatched packet.");
  }
  if (
    !sameRepositoryPathSet(verification.changedFiles, handoff.payload.changedFiles) ||
    !sameRepositoryPathSet(verification.changedFiles, handoff.payload.completion.changedFiles)
  ) {
    add("CHANGE_MANIFEST_MISMATCH", "Scope verification changed files differ from the returned payload.");
  }
  if (verification.status !== "passed" || verification.clean !== true) {
    add("SCOPE_VERIFICATION_NOT_PASSING", "Scope verification must be passed and clean.");
  }
  return deduplicateIssues(issues);
}

function sameRepositoryPathSet(left: readonly string[], right: readonly string[]): boolean {
  try {
    const normalize = (values: readonly string[]): string[] => [...new Set(values.map(normalizeRepositoryPath))].sort();
    const normalizedLeft = normalize(left);
    const normalizedRight = normalize(right);
    return normalizedLeft.length === normalizedRight.length && normalizedLeft.every((value, index) => value === normalizedRight[index]);
  } catch {
    return false;
  }
}

function ensureRoundIdentity(registry: CoordinationRegistryV3, identity: RoundCommandIdentity): void {
  ensure(
    registry.round.state === "active" &&
    registry.round.planTaskId === identity.planTaskId &&
    registry.round.roundId === identity.roundId,
    "PLAN_ROUND_MISMATCH",
    "Only the active owning PLAN round can advance coordination state.",
  );
}

function ensureStoredPacketProfiles(registry: CoordinationRegistryV3): void {
  for (const room of registry.roomRuns) {
    ensure(room.packetDigest === packetDigest(room.packet), "PACKET_PROFILE_CHANGED", "A WORK packet cannot change after creation or activation.");
  }
}

function ensurePayloadIdentity(payload: CoordinationTerminalPayloadV3, registry: CoordinationRegistryV3): void {
  ensure(
    payload.planTaskId === registry.round.planTaskId && payload.roundId === registry.round.roundId,
    "PLAN_ROUND_MISMATCH",
    "Terminal payload must belong to the active owning PLAN round.",
  );
}

function findRoom(registry: CoordinationRegistryV3, roomRunId: string, revisionAttempt: number): CoordinationRoomRunV3 {
  const room = registry.roomRuns.find((candidate) =>
    candidate.roomRunId === roomRunId && candidate.revisionAttempt === revisionAttempt);
  ensure(room !== undefined, "ROOM_ATTEMPT_NOT_FOUND", "The room attempt is not registered.");
  return room;
}

function reopenAcceptedRoom(
  registry: CoordinationRegistryV3,
  prior: CoordinationRoomRunV3,
  command: Extract<CoordinationCommandV3, { type: "authorize-revision" }>,
): CoordinationRegistryV3 {
  const trigger = command.reopenTrigger;
  ensure(trigger !== undefined, "ACCEPTED_WORK_MUST_STOP", "Accepted work must stop unless a declared blocker-grade trigger fires.");
  ensure(
    new Set(["safety-correctness", "authority-violation", "missing-prerequisite", "scope-escape"]).has(trigger.kind),
    "REOPEN_TRIGGER_KIND_INVALID",
    "A reopen trigger must use one of the four global blocker categories.",
  );
  ensure(nonBlank(trigger.fact), "REOPEN_FACT_REQUIRED", "A reopen trigger requires a new blocker-grade fact.");
  ensure(
    prior.packet.escalationTriggers.includes(trigger.matchedEscalationTrigger),
    "REOPEN_TRIGGER_NOT_DECLARED",
    "The reopen fact must match a declared escalation trigger.",
  );
  ensure(
    !registry.roomRuns.some((room) => room.roomRunId === prior.roomRunId && room.revisionAttempt === prior.revisionAttempt + 1),
    "REVISION_ATTEMPT_EXISTS",
    "The next revision attempt already exists.",
  );
  ensure(
    !registry.handoffs.some(({ handoffId }) => handoffId === command.expectedHandoffId) &&
    !registry.roomRuns.some(({ expectedHandoffId }) => expectedHandoffId === command.expectedHandoffId),
    "HANDOFF_ID_ALREADY_USED",
    "A revision needs a new, unused handoff ID.",
  );
  const next = structuredClone(registry);
  const priorIndex = next.roomRuns.findIndex((room) =>
    room.roomRunId === prior.roomRunId && room.revisionAttempt === prior.revisionAttempt);
  next.roomRuns[priorIndex]!.status = "superseded";
  next.roomRuns.push({
    ...structuredClone(prior),
    revisionAttempt: prior.revisionAttempt + 1,
    expectedHandoffId: command.expectedHandoffId,
    status: "prepared",
    contextAcknowledgement: { status: "pending" },
    returnRoute: { ...prior.returnRoute, livenessDeadline: command.livenessDeadline },
  });
  next.revision += 1;
  return next;
}

function toV2Registry(registry: CoordinationRegistryV3): CoordinationRegistryV2 {
  return {
    version: 2,
    revision: registry.revision,
    round: {
      planTaskId: registry.round.planTaskId,
      roundId: registry.round.roundId,
      workId: registry.round.workId,
      scopeId: registry.round.scopeId,
      scopeKeys: [...registry.round.scopeKeys],
      allowedFiles: [...registry.round.allowedFiles],
      state: registry.round.state,
    },
    integrationClaims: structuredClone(registry.integrationClaims),
    returnOrderPolicy: registry.returnOrderPolicy,
    roomRuns: registry.roomRuns.map(({ packet: _packet, packetDigest: _packetDigest, ...room }) => structuredClone(room)),
    handoffs: registry.handoffs.map(toV2Handoff),
    completionQueue: structuredClone(registry.completionQueue),
    cleanup: structuredClone(registry.cleanup),
  };
}

function toV2Handoff(handoff: CoordinationHandoffV3): CoordinationHandoffV2 {
  const { completion: _completion, ...payload } = handoff.payload;
  const copiedPayload = structuredClone(payload);
  return {
    ...structuredClone(handoff),
    payload: copiedPayload,
    payloadDigest: canonicalPayloadDigest(copiedPayload),
  };
}

function toV2Command(command: CoordinationCommandV3): CoordinationCommandV2 {
  if (command.type === "record-send" || command.type === "receive-handoff") {
    const { completion: _completion, ...payload } = command.payload;
    return { ...command, payload } as CoordinationCommandV2;
  }
  if (command.type === "authorize-revision") {
    const { reopenTrigger: _reopenTrigger, ...v2Command } = command;
    return v2Command;
  }
  return command;
}

function fromV2Registry(
  next: CoordinationRegistryV2,
  previous: CoordinationRegistryV3,
  command: CoordinationCommandV3,
  context: CoordinationCommandContext,
): CoordinationRegistryV3 {
  const roomRuns = next.roomRuns.map((room): CoordinationRoomRunV3 => {
    const existing = previous.roomRuns.find((candidate) =>
      candidate.roomRunId === room.roomRunId && candidate.revisionAttempt === room.revisionAttempt);
    const source = existing ?? previous.roomRuns.find((candidate) => candidate.roomRunId === room.roomRunId);
    ensure(source !== undefined, "ROOM_PACKET_MISSING", "Every version 3 room requires an immutable packet.");
    return { ...structuredClone(room), packet: structuredClone(source.packet), packetDigest: source.packetDigest };
  });
  const handoffs = next.handoffs.map((handoff): CoordinationHandoffV3 => {
    const existing = previous.handoffs.find(({ handoffId }) => handoffId === handoff.handoffId);
    const commandPayload = (command.type === "record-send" || command.type === "receive-handoff") && command.handoffId === handoff.handoffId
      ? command.payload
      : undefined;
    const completion = commandPayload?.completion ?? existing?.payload.completion;
    ensure(completion !== undefined, "COMPLETION_REPORT_MISSING", "Version 3 handoffs require a completion report.");
    const payload: CoordinationTerminalPayloadV3 = { ...structuredClone(handoff.payload), completion: structuredClone(completion) };
    const result: CoordinationHandoffV3 = { ...structuredClone(handoff), payload, payloadDigest: canonicalPayloadDigest(payload) };
    if (
      command.type === "accept-handoff" &&
      command.handoffId === handoff.handoffId &&
      context.scopeLockVerification !== undefined
    ) {
      result.acceptance.scopeLockVerification = structuredClone(context.scopeLockVerification);
    }
    return result;
  });
  return {
    version: 3,
    revision: next.revision,
    round: { ...structuredClone(next.round), policyId: previous.round.policyId },
    ...(previous.modelAvailabilitySnapshots === undefined
      ? {}
      : { modelAvailabilitySnapshots: structuredClone(previous.modelAvailabilitySnapshots) }),
    integrationClaims: structuredClone(next.integrationClaims),
    returnOrderPolicy: next.returnOrderPolicy,
    roomRuns,
    handoffs,
    completionQueue: structuredClone(next.completionQueue),
    cleanup: structuredClone(next.cleanup),
  };
}

function throwFirstIssue(issues: WorkflowEconomyIssue[]): void {
  const first = issues[0];
  if (first !== undefined) throw new CoordinationTransitionError(first.code, first.message);
}

function ensure(condition: unknown, code: string, message: string): asserts condition {
  if (!condition) throw new CoordinationTransitionError(code, message);
}

function deduplicateIssues(issues: WorkflowEconomyIssue[]): WorkflowEconomyIssue[] {
  const seen = new Set<string>();
  return issues.filter((issue) => {
    const key = `${issue.code}\u0000${issue.message}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function deduplicateCoordinationIssues(issues: CoordinationValidationIssue[]): CoordinationValidationIssue[] {
  const seen = new Set<string>();
  return issues.filter((issue) => {
    const key = `${issue.code}\u0000${issue.message}\u0000${issue.workId}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function canonicalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, nested]) => [key, canonicalize(nested)]),
    );
  }
  return value;
}
