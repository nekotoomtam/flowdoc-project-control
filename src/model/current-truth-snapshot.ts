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
  return {
    planning: planningComplete ? "complete" : "pending",
    implementation: authorityMilestone(work, "implementation", authorities),
    verification: authorityMilestone(work, "verification", authorities),
    truthPromotion: isTruthPromoted(source, work.nodeId) ? "complete" : "pending",
  };
}

export function buildCurrentTruthSnapshot(source: CurrentTruthSource): CurrentTruthSnapshot {
  const allWork = orderedWork(source.work);
  const work = allWork.slice(0, 5);
  const primary = work[0];
  const unknowns = collectUnknowns(allWork);
  const criticalUnknowns = unknowns.filter(({ disposition }) => disposition === "blocking");
  const deferredWork = unknowns.filter(({ disposition }) => disposition === "deferred");
  const currentBlocker = primary?.blockedBy ?? criticalUnknowns[0]?.summary ?? null;
  const nextDecision = criticalUnknowns[0]?.ownerAction
    ?? criticalUnknowns[0]?.returnTrigger
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

export function buildGovernanceCostSnapshot(source: CurrentTruthSource): GovernanceCostSnapshot {
  const selectedWork = orderedWork(source.work)[0];
  const contextIds = new Set(selectedWork?.contextDocumentIds ?? []);
  const selectedDocuments = source.documents.filter((document) =>
    contextIds.has(document.id) && document.contextClass !== "historical");
  let evidenceCreated = 0;
  let durableDocumentsCreated = 0;
  let implementationCommitCount = 0;
  let reviewCycleCount = 0;
  let reopenCount = 0;

  for (const work of selectedWork === undefined ? [] : [selectedWork]) {
    const registry = work.coordination;
    if (registry?.version !== 3) continue;
    for (const handoff of registry.handoffs) {
      if (handoff.acceptance.status !== "accepted") continue;
      evidenceCreated += handoff.payload.completion.createdEvidenceIds.length;
      durableDocumentsCreated += handoff.payload.completion.createdDocumentIds.length;
      implementationCommitCount += handoff.payload.completion.implementationCommitCount;
      reviewCycleCount += handoff.payload.completion.reviewCyclesUsed;
    }
    const roomIdsWithRevisions = new Set(
      registry.roomRuns.filter(({ revisionAttempt }) => revisionAttempt > 0).map(({ roomRunId }) => roomRunId),
    );
    reopenCount += roomIdsWithRevisions.size;
  }

  const contextCharacters = selectedDocuments.reduce((sum, document) => sum + document.content.length, 0);
  return {
    approximateContextTokens: Math.ceil(contextCharacters / 4),
    contextDocumentCount: selectedDocuments.length,
    evidenceCreated,
    durableDocumentsCreated,
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
    for (const room of item.coordination.roomRuns) {
      for (const unknown of room.packet.unknowns) byId.set(unknown.id, structuredClone(unknown));
    }
    for (const handoff of item.coordination.handoffs) {
      if (handoff.acceptance.status !== "accepted") continue;
      for (const unknown of handoff.payload.completion.remainingUnknowns) {
        byId.set(unknown.id, structuredClone(unknown));
      }
    }
  }
  return [...byId.values()].sort((left, right) => compareText(left.id, right.id));
}

function compareText(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}
