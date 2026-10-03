import type {
  ChecklistRecord,
  CompletionMilestones,
  CurrentTruthSnapshot,
  EvidenceRecord,
  GovernanceCostSnapshot,
  IndexDocument,
  NodeRecord,
  PhaseRecord,
  WorkRecord,
  WorkState,
} from "./types.js";
import type { WorkflowUnknown, WorkAuthority } from "./workflow-economy.js";

export interface CurrentTruthSource {
  generatedAt: string;
  nodes: NodeRecord[];
  work: WorkRecord[];
  phases: PhaseRecord[];
  checklists: ChecklistRecord[];
  documents: IndexDocument[];
  evidence: EvidenceRecord[];
}

const workStateOrder: Record<WorkState, number> = {
  blocked: 0,
  "in-progress": 1,
  "in-review": 2,
  queued: 3,
};

export function buildCompletionMilestones(source: CurrentTruthSource, workId?: string): CompletionMilestones {
  const work = workId === undefined
    ? orderedWork(source.work)[0]
    : source.work.find((candidate) => candidate.id === workId);
  if (work === undefined) return emptyMilestones();

  const phases = source.phases.filter((phase) => phase.workId === work.id);
  const phaseIds = new Set(phases.map((phase) => phase.id));
  const checklists = source.checklists.filter((checklist) => phaseIds.has(checklist.phaseId));
  const planningPhases = phases.filter(isPlanningPhase);
  const planningComplete = planningPhases.length > 0
    ? planningPhases.every((phase) => phase.phaseState === "done")
      && checklistsForPhases(checklists, planningPhases).every(allChecklistItemsPassed)
    : work.coordination?.version === 3;

  const authorities = requestedAuthorities(work);
  const deliveryPhases = phases.filter((phase) => !isPlanningPhase(phase));
  const inlineMilestones = phaseMilestones(source, deliveryPhases, checklists);
  return {
    planning: planningComplete ? "complete" : "pending",
    implementation: authorities.has("implementation")
      ? authorityMilestone(work, "implementation", authorities)
      : inlineMilestones.implementation,
    verification: authorities.has("verification")
      ? authorityMilestone(work, "verification", authorities)
      : inlineMilestones.verification,
    truthPromotion: isTruthPromoted(source, work.nodeId) ? "complete" : "pending",
  };
}

function phaseMilestones(
  source: CurrentTruthSource,
  phases: PhaseRecord[],
  checklists: ChecklistRecord[],
): Pick<CompletionMilestones, "implementation" | "verification"> {
  if (phases.length === 0) return { implementation: "not-required", verification: "not-required" };
  const evidenceIds = new Set(source.evidence.map(({ id }) => id));
  const covered = (targets: PhaseRecord[]) => targets.length > 0 && targets.every((phase) => {
    const criteria = checklists.filter(({ phaseId }) => phaseId === phase.id);
    return phase.phaseState === "done" && criteria.length > 0
      && criteria.every((checklist) => allChecklistItemsPassed(checklist)
        && checklist.items.every((item) => (item.verificationNote?.trim().length ?? 0) > 0
          || (item.evidenceIds?.length ?? 0) > 0
            && item.evidenceIds!.every((id) => evidenceIds.has(id))));
  });
  // Legacy review/discovery prose does not establish implementation scope.
  // Keep ambiguous delivery pending rather than infer completion from Done.
  const implementationPhases = phases.filter(({ activeRole }) => activeRole === "product-implementation-agent");
  const implementationKnown = phases.every(({ activeRole }) =>
    activeRole === "product-implementation-agent" || activeRole === "evidence-reviewer");
  return {
    implementation: !implementationKnown ? "pending"
      : implementationPhases.length === 0 ? "not-required"
        : covered(implementationPhases) ? "complete" : "pending",
    verification: implementationKnown && covered(phases) ? "complete" : "pending",
  };
}

export function buildCurrentTruthSnapshot(source: CurrentTruthSource): CurrentTruthSnapshot {
  const workIdsWithPhases = new Set(source.phases.map(({ workId }) => workId));
  const allWork = orderedWork(source.work)
    .filter((item) => workIdsWithPhases.has(item.id) && !isOperationallyComplete(source, item.id));
  const work = allWork.filter(isExecutionOpen).slice(0, 5);
  const primary = work[0];
  const unknowns = collectUnknowns(allWork);
  const criticalUnknowns = unknowns.filter(({ disposition }) => disposition === "blocking");
  const deferredWork = unknowns.filter(({ disposition }) => disposition === "deferred");
  const blockedPhase = primary === undefined
    ? undefined
    : source.phases
      .filter((phase) => phase.workId === primary.id && phase.phaseState === "blocked")
      .sort((left, right) => left.order - right.order || compareText(left.id, right.id))[0];
  const primaryUnknown = collectUnknowns(primary === undefined ? [] : [primary])
    .find(({ disposition }) => disposition === "blocking");
  const currentBlocker = primary?.blockedBy ?? blockedPhase?.summary ?? primaryUnknown?.summary ?? null;
  const nextDecision = primaryUnknown?.ownerAction
    ?? primaryUnknown?.returnTrigger
    ?? (currentBlocker === null ? (primary?.expectedOutput ?? null) : `Resolve: ${currentBlocker}`);
  const evidenceIds = new Set(source.evidence.map(({ id }) => id));

  return {
    generatedAt: source.generatedAt,
    currentGoal: primary === undefined ? null : workflowGoal(primary) ?? primary.expectedOutput ?? primary.summary,
    currentBlocker,
    activeWork: work.map((item) => ({
      workId: item.id,
      title: item.title,
      milestones: buildCompletionMilestones(source, item.id),
    })),
    unresolvedWork: allWork.filter((item) => !isExecutionOpen(item)).map((item) => ({
      workId: item.id, title: item.title,
      roundState: closedRoundState(item)!,
    })),
    acceptedTruth: source.nodes
      .filter((node) => node.truthState === "current")
      .map((node) => ({
        nodeId: node.id,
        evidenceIds: node.evidenceIds.filter((id) => evidenceIds.has(id)).sort(compareText),
      }))
      .filter(({ evidenceIds: ids }) => ids.length > 0)
      .sort((left, right) => compareText(left.nodeId, right.nodeId)),
    criticalUnknowns,
    deferredWork,
    nextDecision: primary === undefined ? null : nextDecision,
    repositoryIds: [...new Set(allWork.flatMap(({ repositoryIds }) => repositoryIds))].sort(compareText),
    authorityDocumentIds: source.documents
      .filter((document) => document.contextClass === "current" && document.lifecycle === "active")
      .map(({ id }) => id)
      .sort(compareText),
  };
}

function isOperationallyComplete(source: CurrentTruthSource, workId: string): boolean {
  const phases = source.phases.filter((phase) => phase.workId === workId);
  if (phases.length === 0 || phases.some((phase) => phase.phaseState !== "done")) return false;
  const phaseIds = new Set(phases.map(({ id }) => id));
  return source.checklists
    .filter((checklist) => phaseIds.has(checklist.phaseId))
    .every(allChecklistItemsPassed);
}

function isExecutionOpen(work: WorkRecord): boolean {
  return closedRoundState(work) === undefined;
}

function closedRoundState(work: WorkRecord): "released" | "cancelled" | undefined {
  const registry = work.coordination;
  return registry === undefined || registry.version === 1 || registry.round.state === "active"
    ? undefined : registry.round.state;
}

export function buildGovernanceCostSnapshot(source: CurrentTruthSource, workId?: string): GovernanceCostSnapshot {
  const selectedId = workId ?? buildCurrentTruthSnapshot(source).activeWork[0]?.workId;
  const selectedWork = source.work.find(({ id }) => id === selectedId);
  if (workId !== undefined && selectedWork === undefined) throw new Error(`Work ${workId} does not exist.`);
  const contextIds = new Set(selectedWork?.contextDocumentIds ?? []);
  const selectedDocuments = source.documents.filter((document) =>
    contextIds.has(document.id) && document.contextClass !== "historical");
  const declaredEvidence = new Set<string>();
  const createdDocuments = new Set<string>();
  const returnedCommits: Array<{ key: string; inputIds: string[] }> = [];
  const referencedEvidence = new Set(selectedWork?.requiredEvidence ?? []);
  const inputEvidence = new Set<string>();
  let implementationCommitCount = 0;
  let reviewCycleCount = 0;
  let reopenCount = 0;

  for (const work of selectedWork === undefined ? [] : [selectedWork]) {
    const registry = work.coordination;
    if (registry?.version !== 3) continue;
    // A terminal return consumes resources even when review ends in BLOCKER/revision/rejection.
    const seenHandoffs = new Set<string>();
    for (const room of registry.roomRuns) {
      for (const id of room.packet.relevantEvidenceIds) inputEvidence.add(id);
    }
    for (const handoff of registry.handoffs) {
      if (handoff.receipt.status !== "received" || seenHandoffs.has(handoff.handoffId)) continue;
      seenHandoffs.add(handoff.handoffId);
      for (const id of handoff.payload.completion.createdEvidenceIds) declaredEvidence.add(id);
      for (const id of handoff.payload.completion.createdDocumentIds) createdDocuments.add(id);
      for (const id of [...handoff.payload.evidenceIds, ...handoff.acceptance.evidenceIds]) referencedEvidence.add(id);
      const returningRoom = registry.roomRuns.find((room) => room.roomRunId === handoff.payload.roomRunId
        && room.revisionAttempt === handoff.payload.revisionAttempt);
      if (handoff.payload.exactCommit !== undefined && returningRoom !== undefined) {
        returnedCommits.push({ key: `${handoff.payload.ownerRepositoryId}:${handoff.payload.exactCommit}`,
          inputIds: returningRoom.packet.relevantEvidenceIds });
      }
      implementationCommitCount += handoff.payload.completion.implementationCommitCount;
      reviewCycleCount += handoff.payload.completion.reviewCyclesUsed;
    }
    const roomIdsWithRevisions = new Set(
      registry.roomRuns.filter(({ revisionAttempt }) => revisionAttempt > 0).map(({ roomRunId }) => roomRunId),
    );
    reopenCount += roomIdsWithRevisions.size;
  }

  const contextCharacters = selectedDocuments.reduce((sum, document) => sum + document.content.length, 0);
  // Canonical records have no creator/round provenance. Commit matches are explicitly
  // an attribution proxy; prior inputs and pre-existing records are never inferred new.
  const commitMatched = source.evidence.filter((evidence) =>
    referencedEvidence.has(evidence.id) && !declaredEvidence.has(evidence.id)
      && Date.parse(evidence.verifiedAt) >= Date.parse(selectedWork?.createdAt ?? "")
      && returnedCommits.some(({ key, inputIds }) => key === `${evidence.repositoryId}:${evidence.commit}`
        && !inputIds.includes(evidence.id))).map(({ id }) => id);
  const attributed = new Set([...declaredEvidence, ...commitMatched]);
  return {
    selectedWorkId: selectedWork?.id ?? null,
    contextCharacters,
    attribution: {
      method: "declared-and-commit-matched-proxy",
      declaredEvidenceIds: [...declaredEvidence].sort(compareText),
      commitMatchedEvidenceIds: commitMatched.sort(compareText),
      reusedEvidenceIds: [...inputEvidence].filter((id) => !attributed.has(id)).sort(compareText),
      unattributedEvidenceIds: [...referencedEvidence].filter((id) => !attributed.has(id) && !inputEvidence.has(id)).sort(compareText),
    },
    approximateContextTokens: Math.ceil(contextCharacters / 4),
    contextDocumentCount: selectedDocuments.length,
    evidenceCreated: attributed.size,
    durableDocumentsCreated: createdDocuments.size,
    implementationCommitCount,
    reviewCycleCount,
    reopenCount,
  };
}

function orderedWork(work: WorkRecord[]): WorkRecord[] {
  return [...work].sort((left, right) =>
    workStateOrder[left.workState] - workStateOrder[right.workState]
      || right.updatedAt.localeCompare(left.updatedAt)
      || compareText(left.id, right.id));
}

function emptyMilestones(): CompletionMilestones {
  return { planning: "pending", implementation: "not-required", verification: "not-required", truthPromotion: "pending" };
}

function isPlanningPhase(phase: PhaseRecord): boolean {
  return phase.activeRole === "planning-partner" || /plan/i.test(phase.title);
}

function checklistsForPhases(checklists: ChecklistRecord[], phases: PhaseRecord[]): ChecklistRecord[] {
  const ids = new Set(phases.map(({ id }) => id));
  return checklists.filter(({ phaseId }) => ids.has(phaseId));
}

function allChecklistItemsPassed(checklist: ChecklistRecord): boolean {
  return checklist.items.length > 0 && checklist.items.every(({ state }) => state === "passed");
}

function requestedAuthorities(work: WorkRecord): Set<WorkAuthority> {
  if (work.coordination?.version !== 3) return new Set();
  return new Set(work.coordination.roomRuns.map(({ packet }) => packet.workAuthority));
}

function authorityMilestone(
  work: WorkRecord,
  authority: Exclude<WorkAuthority, "discovery">,
  requested: ReadonlySet<WorkAuthority>,
): "not-required" | "pending" | "complete" {
  if (!requested.has(authority)) return "not-required";
  if (work.coordination?.version !== 3) return "pending";
  const complete = work.coordination.roomRuns
    .filter(({ packet }) => packet.workAuthority === authority)
    .every((room) => roomAccepted(work, room.roomRunId, room.revisionAttempt));
  return complete ? "complete" : "pending";
}

function roomAccepted(work: WorkRecord, roomRunId: string, revisionAttempt: number): boolean {
  if (work.coordination?.version !== 3) return false;
  return work.coordination.handoffs.some((handoff) =>
    handoff.payload.roomRunId === roomRunId
      && handoff.payload.revisionAttempt === revisionAttempt
      && handoff.payload.status === "PASS"
      && handoff.acceptance.status === "accepted");
}

function isTruthPromoted(source: CurrentTruthSource, nodeId: string): boolean {
  const node = source.nodes.find(({ id }) => id === nodeId);
  if (node?.truthState !== "current" || node.evidenceIds.length === 0) return false;
  const evidenceIds = new Set(source.evidence.map(({ id }) => id));
  return node.evidenceIds.some((id) => evidenceIds.has(id));
}

function workflowGoal(work: WorkRecord): string | undefined {
  if (work.coordination?.version !== 3) return undefined;
  return work.coordination.roomRuns[0]?.packet.goal;
}

function collectUnknowns(work: WorkRecord[]): WorkflowUnknown[] {
  const byId = new Map<string, WorkflowUnknown>();
  for (const item of work) {
    if (item.coordination?.version !== 3) continue;
    const latestAttempts = new Map<string, number>();
    for (const room of item.coordination.roomRuns) {
      latestAttempts.set(room.roomRunId, Math.max(latestAttempts.get(room.roomRunId) ?? -1, room.revisionAttempt));
    }
    const rooms = item.coordination.roomRuns.filter((room) => latestAttempts.get(room.roomRunId) === room.revisionAttempt);
    for (const room of rooms) {
      for (const unknown of room.packet.unknowns) byId.set(`${item.id}:${unknown.id}`, structuredClone(unknown));
    }
    const reviewed = item.coordination.handoffs
      .filter((handoff) => handoff.receipt.status === "received"
        && (handoff.acceptance.status === "accepted" || handoff.acceptance.status === "blocked")
        && latestAttempts.get(handoff.payload.roomRunId) === handoff.payload.revisionAttempt)
      .sort((a, b) => a.payload.revisionAttempt - b.payload.revisionAttempt
        || compareText(a.acceptance.reviewedAt ?? "", b.acceptance.reviewedAt ?? ""));
    for (const handoff of reviewed) {
      for (const unknown of handoff.payload.completion.remainingUnknowns) {
        byId.set(`${item.id}:${unknown.id}`, structuredClone(unknown));
      }
    }
  }
  return [...byId.values()].sort((left, right) => compareText(left.id, right.id));
}

function compareText(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}
