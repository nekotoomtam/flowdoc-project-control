import { resolveCurrentDocument } from "./context-routing.js";
import type { IndexDocument } from "./types.js";
import type { CurrentTruthSource } from "./current-truth-snapshot.js";
import { buildCompletionMilestones } from "./current-truth-snapshot.js";

/** A retrieval view, never a dispatch, acceptance, or authority grant. */
export function buildWorkContext(
  source: CurrentTruthSource,
  selection: { workId: string; roomRunId?: string },
) {
  const work = source.work.find(({ id }) => id === selection.workId);
  if (work === undefined) throw new Error(`Work ${selection.workId} does not exist.`);
  const registry = work.coordination;
  const room = registry?.version === 3 && selection.roomRunId !== undefined
    ? registry.roomRuns.filter(({ roomRunId }) => roomRunId === selection.roomRunId)
      .sort((a, b) => b.revisionAttempt - a.revisionAttempt)[0]
    : undefined;
  if (selection.roomRunId !== undefined && room === undefined) {
    throw new Error(`Room ${selection.roomRunId} does not belong to V3 Work ${work.id}.`);
  }
  const handoffs = registry?.version === 3 && room !== undefined
    ? registry.handoffs.filter(({ payload }) => payload.roomRunId === room.roomRunId
      && payload.revisionAttempt === room.revisionAttempt)
    : [];
  const documentsById = new Map(source.documents.map((document) => [document.id, document]));
  const documents = new Map<string, IndexDocument>();
  for (const id of work.contextDocumentIds ?? []) {
    const referenced = documentsById.get(id);
    if (referenced === undefined) throw new Error(`Document ${id} does not exist.`);
    const resolved = referenced.supersededBy === undefined
      ? referenced : documentsById.get(resolveCurrentDocument(id, documentsById).id)!;
    if (resolved.contextClass === "historical" || resolved.lifecycle !== "active") continue;
    documents.set(resolved.id, resolved);
  }
  const evidenceIds = new Set(room === undefined ? work.requiredEvidence : [
    ...room.packet.relevantEvidenceIds,
    ...room.requiredEvidence,
    ...handoffs.flatMap(({ payload, acceptance }) => [...payload.evidenceIds, ...acceptance.evidenceIds]),
  ]);
  const workPhases = source.phases.filter(({ workId }) => workId === work.id);
  const phaseIds = new Set(workPhases.map(({ id }) => id));
  const workChecklists = source.checklists.filter(({ phaseId }) => phaseIds.has(phaseId));
  return {
    generatedAt: source.generatedAt,
    executionAuthority: registry === undefined ? "unregistered-request-required" as const
      : registry.version === 3 && registry.round.state === "active"
        ? "current-round" as const : "historical-read-only" as const,
    work: {
      id: work.id, title: work.title, nodeId: work.nodeId,
      repositoryIds: work.repositoryIds, state: work.workState,
      summary: work.summary, expectedOutput: work.expectedOutput ?? null,
      blockedBy: work.blockedBy ?? null, unblockOwner: work.unblockOwner ?? null,
      parentWorkId: work.parentWorkId ?? null,
      milestones: buildCompletionMilestones(source, work.id),
    },
    round: registry === undefined || registry.version === 1 ? null : registry.round,
    // Work-level reads return an index; only an explicit room selection expands its packet.
    rooms: registry?.version === 3 ? [...new Set(registry.roomRuns.map(({ roomRunId }) => roomRunId))]
      .sort().map((id) => {
        const latest = registry.roomRuns.filter(({ roomRunId }) => roomRunId === id)
          .sort((a, b) => b.revisionAttempt - a.revisionAttempt)[0]!;
        return { roomRunId: id, revisionAttempt: latest.revisionAttempt, status: latest.status };
      }) : [],
    room: room === undefined ? null : {
      roomRunId: room.roomRunId, revisionAttempt: room.revisionAttempt,
      ownerRepositoryId: room.ownerRepositoryId, status: room.status,
      laneId: room.laneId, dispatchSetId: room.dispatchSetId,
      activeRole: room.activeRole, phaseId: room.phaseId, checklistId: room.checklistId,
      evidenceTarget: room.evidenceTarget, expectedHandoffId: room.expectedHandoffId,
      locator: room.locator, returnRoute: room.returnRoute,
      contextAcknowledgement: room.contextAcknowledgement, ux: room.ux,
      packetDigest: room.packetDigest, packet: room.packet,
      returns: handoffs.map(({ handoffId, payload, receipt, acceptance }) => ({
        handoffId, status: payload.status, exactCommit: payload.exactCommit ?? null,
        receiptStatus: receipt.status, acceptance,
        completion: payload.completion,
      })),
    },
    documents: [...documents.values()].sort((a, b) => a.id.localeCompare(b.id)).map((document) => ({
      id: document.id, path: document.path, authority: document.authority,
      role: document.role, contextClass: document.contextClass ?? null,
      repositoryRefs: document.repositoryRefs,
    })),
    evidence: source.evidence.filter(({ id }) => evidenceIds.has(id)).map((evidence) => ({ ...evidence })),
    phases: workPhases.filter(({ id }) => room === undefined || id === room.phaseId),
    checklists: workChecklists.filter(({ id, phaseId }) => room === undefined
      || (id === room.checklistId && phaseId === room.phaseId)),
    relatedPhases: room === undefined ? [] : workPhases.filter(({ id }) => id !== room.phaseId)
      .map(({ id, title }) => ({ id, title, path: `data/phases/${id}.json` })),
    relatedChecklists: room === undefined ? [] : workChecklists.filter(({ id }) => id !== room.checklistId)
      .map(({ id, title }) => ({ id, title, path: `data/checklists/${id}.json` })),
    // Packet constraints and canonical source locators remain authoritative. This view
    // intentionally omits document bodies, other Work, and superseded room attempts.
  };
}
