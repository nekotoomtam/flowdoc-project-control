import { realpath, stat } from "node:fs/promises";
import { extname, isAbsolute, relative, resolve } from "node:path";
import type { ProjectDiagnostic } from "../../src/model/diagnostics.js";
import type {
  DocumentRecord,
  EvidenceRecord,
  NodeRecord,
  PhaseRecord,
  ProjectRecord,
  RepositoryRecord,
} from "../../src/model/types.js";
import { compareCodeUnits, ProjectValidationError } from "./errors.js";
import { validateCoordinationRegistries } from "../../src/model/coordination.js";
import {
  loadProjectSources,
  type LoadedProjectSources,
  type LoadedRecord,
} from "./load-sources.js";

declare const validatedProject: unique symbol;

export type ValidatedProjectSources = LoadedProjectSources & {
  readonly [validatedProject]: true;
};

export async function validateProjectSemantics(
  loaded: LoadedProjectSources,
): Promise<ValidatedProjectSources> {
  const diagnostics = (
    await Promise.all([
      checkGlobalIds(loaded),
      checkNodeHierarchy(loaded.nodes),
      checkNodeReferences(loaded),
      checkWorkReferences(loaded),
      checkWorkTree(loaded),
      checkTaskContracts(loaded),
      checkHistoricalRecoveryWork(loaded),
      checkCoordination(loaded),
      checkPhaseReferences(loaded),
      checkSingleActivePhase(loaded),
      checkChecklistReferences(loaded),
      checkDocumentPathsAndReferences(loaded),
      checkDocumentSupersession(loaded),
      checkEvidenceReferences(loaded),
      checkWorkflowEvidenceValidity(loaded),
      checkReciprocalOwnership(loaded),
      checkCurrentEvidence(loaded),
    ])
  ).flat();

  if (diagnostics.length > 0) {
    throw new ProjectValidationError(diagnostics);
  }

  return loaded as ValidatedProjectSources;
}

function checkDocumentSupersession(loaded: LoadedProjectSources): ProjectDiagnostic[] {
  const documents = recordMap(loaded.documents);
  const diagnostics: ProjectDiagnostic[] = [];
  const successorsByOldId = new Map<string, LoadedRecord<DocumentRecord>[]>();

  for (const document of loaded.documents) {
    const value = document.value;
    if ((value.supersededBy !== undefined || value.supersedes !== undefined) && value.contextClass === undefined) {
      diagnostics.push(recordDiagnostic(
        "DOCUMENT_CONTEXT_CLASS_REQUIRED",
        `Document "${value.id}" participates in supersession without a context class.`,
        document,
        "Classify supersession participants as current or historical; legacy documents may omit contextClass only while they remain outside this policy.",
      ));
    }
    if (value.contextClass === "historical" && value.lifecycle === "active") {
      diagnostics.push(recordDiagnostic(
        "HISTORICAL_DOCUMENT_ACTIVE",
        `Historical document "${value.id}" cannot remain active authority.`,
        document,
        "Mark the document superseded or retired, or classify the active authority as current/supporting.",
      ));
    }
    if (value.supersededBy !== undefined) {
      const successor = documents.get(value.supersededBy);
      if (successor === undefined) {
        diagnostics.push(recordDiagnostic(
          "DOCUMENT_SUCCESSOR_MISSING",
          `Document "${value.id}" names missing successor "${value.supersededBy}".`,
          document,
          "Point supersededBy to one existing current Document.",
        ));
      } else {
        if (!(successor.value.supersedes ?? []).includes(value.id)) {
          diagnostics.push(recordDiagnostic(
            "DOCUMENT_SUPERSESSION_ASYMMETRIC",
            `Successor "${successor.value.id}" does not list "${value.id}" in supersedes.`,
            document,
            "Make supersedes and supersededBy reciprocal.",
          ));
        }
        if (successor.value.contextClass !== "current" || successor.value.lifecycle !== "active") {
          diagnostics.push(recordDiagnostic(
            "SUPERSESSION_SUCCESSOR_NOT_ACTIVE",
            `Successor "${successor.value.id}" is not active current authority.`,
            successor,
            "Classify the successor as current and keep lifecycle active.",
          ));
        }
      }
      if (value.contextClass !== "historical" || value.lifecycle !== "superseded") {
        diagnostics.push(recordDiagnostic(
          "SUPERSEDED_DOCUMENT_NOT_HISTORICAL",
          `Superseded document "${value.id}" must be historical with superseded lifecycle.`,
          document,
          "Set contextClass to historical and lifecycle to superseded.",
        ));
      }
    }

    for (const oldId of value.supersedes ?? []) {
      const candidates = successorsByOldId.get(oldId) ?? [];
      candidates.push(document);
      successorsByOldId.set(oldId, candidates);
      const old = documents.get(oldId);
      if (old === undefined) {
        diagnostics.push(recordDiagnostic(
          "DOCUMENT_SUPERSEDED_TARGET_MISSING",
          `Document "${value.id}" supersedes missing document "${oldId}".`,
          document,
          "Reference an existing historical Document.",
        ));
      } else if (old.value.supersededBy !== value.id) {
        diagnostics.push(recordDiagnostic(
          "DOCUMENT_SUPERSESSION_ASYMMETRIC",
          `Document "${oldId}" does not point back to successor "${value.id}".`,
          document,
          "Make supersedes and supersededBy reciprocal.",
        ));
      }
    }
  }

  for (const [oldId, successors] of successorsByOldId) {
    if (successors.length > 1) {
      for (const successor of successors) {
        diagnostics.push(recordDiagnostic(
          "DOCUMENT_SUPERSESSION_FORK",
          `Document "${oldId}" has multiple current successor candidates.`,
          successor,
          "Keep exactly one successor for each superseded Document.",
        ));
      }
    }
  }

  const reportedCycles = new Set<string>();
  for (const start of loaded.documents) {
    const chain: string[] = [];
    const positions = new Map<string, number>();
    let current: LoadedRecord<DocumentRecord> | undefined = start;
    while (current !== undefined) {
      const position = positions.get(current.value.id);
      if (position !== undefined) {
        const cycle = chain.slice(position);
        const key = [...cycle].sort(compareCodeUnits).join("\u0000");
        if (!reportedCycles.has(key)) {
          reportedCycles.add(key);
          diagnostics.push(recordDiagnostic(
            "DOCUMENT_SUPERSESSION_CYCLE",
            `Document supersession contains a cycle: ${[...cycle, cycle[0]].join(" -> ")}.`,
            current,
            "Break the cycle and retain one directional path to active current authority.",
          ));
        }
        break;
      }
      positions.set(current.value.id, chain.length);
      chain.push(current.value.id);
      current = current.value.supersededBy === undefined
        ? undefined
        : documents.get(current.value.supersededBy);
    }
  }

  for (const work of loaded.work) {
    for (const documentId of work.value.contextDocumentIds ?? []) {
      const document = documents.get(documentId);
      if (document?.value.contextClass === "historical") {
        diagnostics.push(recordDiagnostic(
          "HISTORICAL_DEFAULT_CONTEXT",
          `Work default context names historical document "${documentId}".`,
          work,
          "Remove historical content from contextDocumentIds and load it only for a named audit or recovery mode.",
        ));
      }
    }
  }
  return diagnostics;
}

function checkWorkflowEvidenceValidity(loaded: LoadedProjectSources): ProjectDiagnostic[] {
  const evidence = recordMap(loaded.evidence);
  const diagnostics: ProjectDiagnostic[] = [];

  for (const record of loaded.evidence) {
    const validity = record.value.validity;
    if (validity === undefined) continue;
    if (validity.repositoryId !== record.value.repositoryId) {
      diagnostics.push(recordDiagnostic(
        "EVIDENCE_VALIDITY_REPOSITORY_MISMATCH",
        `Evidence "${record.value.id}" validity names a different repository.`,
        record,
        "Match validity.repositoryId to the Evidence owner repository.",
      ));
    }
    if (validity.sourceRevision !== record.value.commit) {
      diagnostics.push(recordDiagnostic(
        "EVIDENCE_VALIDITY_REVISION_MISMATCH",
        `Evidence "${record.value.id}" validity does not match its source commit.`,
        record,
        "Use the verified source commit as sourceRevision.",
      ));
    }
    if (validity.supersedesEvidenceId !== undefined && !evidence.has(validity.supersedesEvidenceId)) {
      diagnostics.push(recordDiagnostic(
        "EVIDENCE_SUPERSEDED_TARGET_MISSING",
        `Evidence "${record.value.id}" supersedes missing Evidence "${validity.supersedesEvidenceId}".`,
        record,
        "Reference an existing Evidence record.",
      ));
    }
  }

  for (const work of loaded.work) {
    if (work.value.coordination?.version !== 3) continue;
    for (const room of work.value.coordination.roomRuns) {
      for (const evidenceId of room.packet.relevantEvidenceIds) {
        const referenced = evidence.get(evidenceId);
        if (referenced === undefined) {
          diagnostics.push(recordDiagnostic(
            "MISSING_EVIDENCE",
            `Version 3 packet references missing Evidence "${evidenceId}".`,
            work,
            "Reference a canonical Evidence record.",
          ));
        } else if (referenced.value.validity === undefined) {
          diagnostics.push(recordDiagnostic(
            "WORKFLOW_EVIDENCE_VALIDITY_REQUIRED",
            `Version 3 packet Evidence "${evidenceId}" has no validity boundary.`,
            work,
            "Add claim, scope, source revision, verification method, and freshness triggers before reuse.",
          ));
        }
      }
    }
  }
  return diagnostics;
}

function checkHistoricalRecoveryWork(loaded: LoadedProjectSources): ProjectDiagnostic[] {
  const diagnostics: ProjectDiagnostic[] = [];
  const readOnlyRoles = new Set(["evidence-reviewer", "lane-reconciliation-reviewer"]);

  for (const work of loaded.work) {
    if (work.value.executionMode !== "historical-recovery") continue;
    if (work.value.coordination !== undefined) {
      diagnostics.push(recordDiagnostic(
        "HISTORICAL_RECOVERY_COORDINATION_FORBIDDEN",
        "Historical Recovery Work cannot own a coordination registry or execution authority.",
        work,
        "Remove coordination and keep recovery limited to read-only historical inspection.",
      ));
    }
    if (work.value.workKind !== "task") {
      diagnostics.push(recordDiagnostic(
        "HISTORICAL_RECOVERY_TASK_REQUIRED",
        "Historical Recovery Work must be a bounded task.",
        work,
        "Set workKind to task and keep the recovery scope explicit.",
      ));
    }
    if (work.value.activeRole === undefined || !readOnlyRoles.has(work.value.activeRole)) {
      diagnostics.push(recordDiagnostic(
        "HISTORICAL_RECOVERY_READ_ONLY_ROLE_REQUIRED",
        "Historical Recovery Work must use an approved read-only role.",
        work,
        "Use evidence-reviewer or lane-reconciliation-reviewer.",
      ));
    }
  }
  return diagnostics;
}

function checkCoordination(loaded: LoadedProjectSources): ProjectDiagnostic[] {
  const workById = recordMap(loaded.work);
  const repositoryById = recordMap(loaded.repositories);
  const phaseById = recordMap(loaded.phases);
  const checklistById = recordMap(loaded.checklists);
  const evidenceById = new Map(loaded.evidence.map(({ value }) => [
    value.id,
    { repositoryId: value.repositoryId, commit: value.commit },
  ]));
  const diagnostics = validateCoordinationRegistries(
    loaded.work.map(({ value }) => value),
    evidenceById,
  ).flatMap((coordinationIssue) => {
    const work = workById.get(coordinationIssue.workId);
    return work === undefined
      ? []
      : [recordDiagnostic(
          coordinationIssue.code,
          coordinationIssue.message,
          work,
          "Repair the stored coordination registry before generation or publication.",
        )];
  });

  for (const work of loaded.work) {
    const registry = work.value.coordination;
    if (registry === undefined) continue;
    for (const claim of registry.integrationClaims) {
      if (!repositoryById.has(claim.repositoryId)) {
        diagnostics.push(recordDiagnostic(
          "COORDINATION_MISSING_REPOSITORY",
          `Integration repository "${claim.repositoryId}" does not exist.`,
          work,
          "Reference a canonical Repository record.",
        ));
      }
    }
    for (const room of registry.roomRuns) {
      if (!repositoryById.has(room.ownerRepositoryId)) {
        diagnostics.push(recordDiagnostic(
          "COORDINATION_MISSING_REPOSITORY",
          `Room owner repository "${room.ownerRepositoryId}" does not exist.`,
          work,
          "Reference a canonical Repository record.",
        ));
      }
      if (!phaseById.has(room.phaseId)) {
        diagnostics.push(recordDiagnostic(
          "COORDINATION_MISSING_PHASE",
          `Room Phase "${room.phaseId}" does not exist.`,
          work,
          "Reference a canonical Phase record.",
        ));
      }
      if (!checklistById.has(room.checklistId)) {
        diagnostics.push(recordDiagnostic(
          "COORDINATION_MISSING_CHECKLIST",
          `Room Checklist "${room.checklistId}" does not exist.`,
          work,
          "Reference a canonical Checklist record.",
        ));
      }
      if (registry.version === 3 && "packet" in room && room.packet.ownerRepositoryId !== room.ownerRepositoryId) {
        diagnostics.push(recordDiagnostic(
          "WORKFLOW_PACKET_OWNER_ROOM_MISMATCH",
          `Room "${room.roomRunId}" and its workflow packet name different owner repositories.`,
          work,
          "Make the packet owner match the room owner before dispatch.",
        ));
      }
      if (registry.version === 3 && "packet" in room && !work.value.repositoryIds.includes(room.packet.ownerRepositoryId)) {
        diagnostics.push(recordDiagnostic(
          "WORKFLOW_PACKET_OWNER_WORK_MISMATCH",
          `Workflow packet owner "${room.packet.ownerRepositoryId}" is outside the containing Work repository boundary.`,
          work,
          "Choose an owner repository already declared by the containing Work.",
        ));
      }
    }
  }
  return diagnostics;
}

export async function loadAndValidateProject(rootDir: string): Promise<ValidatedProjectSources> {
  return validateProjectSemantics(await loadProjectSources(rootDir));
}

function checkGlobalIds(loaded: LoadedProjectSources): ProjectDiagnostic[] {
  const seen = new Map<string, LoadedRecord>();
  const diagnostics: ProjectDiagnostic[] = [];

  for (const record of loaded.records) {
    const first = seen.get(record.value.id);
    if (first === undefined) {
      seen.set(record.value.id, record);
      continue;
    }
    diagnostics.push(
      recordDiagnostic(
        "DUPLICATE_ID",
        `ID "${record.value.id}" is also declared by ${first.relativePath}.`,
        record,
        "Give every canonical record a globally unique ID.",
      ),
    );
  }

  return diagnostics;
}

function checkNodeHierarchy(nodes: LoadedRecord<NodeRecord>[]): ProjectDiagnostic[] {
  const nodeById = recordMap(nodes);
  const diagnostics: ProjectDiagnostic[] = [];

  for (const node of nodes) {
    if (node.value.parentId !== null && !nodeById.has(node.value.parentId)) {
      diagnostics.push(
        recordDiagnostic(
          "MISSING_NODE_PARENT",
          `Parent Node "${node.value.parentId}" does not exist.`,
          node,
          "Set parentId to an existing Node ID or null for a root Node.",
        ),
      );
    }
  }

  const reportedCycles = new Set<string>();
  for (const startId of [...nodeById.keys()].sort(compareCodeUnits)) {
    const positions = new Map<string, number>();
    const chain: string[] = [];
    let currentId: string | null = startId;

    while (currentId !== null) {
      const position = positions.get(currentId);
      if (position !== undefined) {
        const cycle = canonicalCycle(chain.slice(position));
        const cycleText = [...cycle, cycle[0] ?? ""].join(" -> ");
        if (!reportedCycles.has(cycleText)) {
          reportedCycles.add(cycleText);
          const source = nodeById.get(cycle[0] ?? startId) ?? nodeById.get(startId);
          if (source !== undefined) {
            diagnostics.push(
              recordDiagnostic(
                "NODE_CYCLE",
                `Node hierarchy contains a cycle: ${cycleText}.`,
                source,
                "Set parentId values so every Node eventually reaches a root Node.",
              ),
            );
          }
        }
        break;
      }

      const current = nodeById.get(currentId);
      if (current === undefined) {
        break;
      }
      positions.set(currentId, chain.length);
      chain.push(currentId);
      currentId = current.value.parentId;
    }
  }

  return diagnostics;
}

function checkNodeReferences(loaded: LoadedProjectSources): ProjectDiagnostic[] {
  const documents = recordMap(loaded.documents);
  const evidence = recordMap(loaded.evidence);
  const repositories = recordMap(loaded.repositories);
  const diagnostics: ProjectDiagnostic[] = [];

  for (const node of loaded.nodes) {
    diagnostics.push(
      ...missingReferences(node, node.value.documentIds, documents, "MISSING_DOCUMENT", "Document"),
      ...missingReferences(node, node.value.evidenceIds, evidence, "MISSING_EVIDENCE", "Evidence"),
      ...missingReferences(node, node.value.repositoryIds, repositories, "MISSING_REPOSITORY", "Repository"),
    );
  }

  return diagnostics;
}

function checkWorkReferences(loaded: LoadedProjectSources): ProjectDiagnostic[] {
  const nodes = recordMap(loaded.nodes);
  const evidence = recordMap(loaded.evidence);
  const repositories = recordMap(loaded.repositories);
  const diagnostics: ProjectDiagnostic[] = [];

  for (const work of loaded.work) {
    if (!nodes.has(work.value.nodeId)) {
      diagnostics.push(
        recordDiagnostic(
          "MISSING_NODE",
          `Node "${work.value.nodeId}" does not exist.`,
          work,
          "Set nodeId to an existing Node ID.",
        ),
      );
    }
    diagnostics.push(
      ...missingReferences(work, work.value.requiredEvidence, evidence, "MISSING_EVIDENCE", "Evidence"),
      ...missingReferences(work, work.value.repositoryIds, repositories, "MISSING_REPOSITORY", "Repository"),
    );
  }

  return diagnostics;
}

function checkWorkTree(loaded: LoadedProjectSources): ProjectDiagnostic[] {
  const workById = recordMap(loaded.work);
  const diagnostics: ProjectDiagnostic[] = [];

  for (const work of loaded.work) {
    const parentWorkId = work.value.parentWorkId;
    if (parentWorkId !== undefined && !workById.has(parentWorkId)) {
      diagnostics.push(
        recordDiagnostic(
          "MISSING_WORK_PARENT",
          `Parent Work "${parentWorkId}" does not exist.`,
          work,
          "Set parentWorkId to an existing Work ID or remove it for a root Work item.",
        ),
      );
    }
  }

  const reportedCycles = new Set<string>();
  for (const startId of [...workById.keys()].sort(compareCodeUnits)) {
    const positions = new Map<string, number>();
    const chain: string[] = [];
    let currentId: string | undefined = startId;
    while (currentId !== undefined) {
      const position = positions.get(currentId);
      if (position !== undefined) {
        const cycle = canonicalCycle(chain.slice(position));
        const cycleText = [...cycle, cycle[0] ?? ""].join(" -> ");
        if (!reportedCycles.has(cycleText)) {
          reportedCycles.add(cycleText);
          diagnostics.push(
            recordDiagnostic(
              "WORK_CYCLE",
              `Work hierarchy contains a cycle: ${cycleText}.`,
              workById.get(cycle[0] ?? startId) ?? workById.get(startId)!,
              "Set parentWorkId values so every Work item eventually reaches a root Work item.",
            ),
          );
        }
        break;
      }
      const current = workById.get(currentId);
      if (current === undefined) break;
      positions.set(currentId, chain.length);
      chain.push(currentId);
      currentId = current.value.parentWorkId;
    }
  }

  return diagnostics;
}

function checkTaskContracts(loaded: LoadedProjectSources): ProjectDiagnostic[] {
  const documents = recordMap(loaded.documents);
  const phaseCountByWorkId = new Map<string, number>();
  for (const phase of loaded.phases) {
    phaseCountByWorkId.set(phase.value.workId, (phaseCountByWorkId.get(phase.value.workId) ?? 0) + 1);
  }

  return loaded.work.flatMap((work) => {
    if (work.value.workKind !== "task") return [];
    const diagnostics: ProjectDiagnostic[] = [];
    const contextDocumentIds = work.value.contextDocumentIds ?? [];
    if (contextDocumentIds.length === 0) {
      diagnostics.push(
        recordDiagnostic(
          "TASK_MISSING_CONTEXT_DOCUMENT",
          "A task Work record must list at least one context document.",
          work,
          "Add contextDocumentIds with existing Document IDs before execution starts.",
        ),
      );
    }
    diagnostics.push(
      ...missingReferences(work, contextDocumentIds, documents, "MISSING_DOCUMENT", "Document"),
    );
    if (work.value.activeRole === undefined) {
      diagnostics.push(
        recordDiagnostic(
          "TASK_MISSING_ACTIVE_ROLE",
          "A task Work record must declare activeRole.",
          work,
          "Set activeRole to the current FlowDoc role for this task.",
        ),
      );
    }
    if (work.value.expectedOutput === undefined) {
      diagnostics.push(
        recordDiagnostic(
          "TASK_MISSING_EXPECTED_OUTPUT",
          "A task Work record must declare expectedOutput.",
          work,
          "Set expectedOutput to the bounded deliverable for this task.",
        ),
      );
    }
    if ((phaseCountByWorkId.get(work.value.id) ?? 0) === 0) {
      diagnostics.push(
        recordDiagnostic(
          "TASK_WITHOUT_PHASE",
          "A task Work record must have at least one Phase.",
          work,
          "Add a Phase record with workId set to this task ID.",
        ),
      );
    }
    return diagnostics;
  });
}

function checkPhaseReferences(loaded: LoadedProjectSources): ProjectDiagnostic[] {
  const work = recordMap(loaded.work);
  const repositories = recordMap(loaded.repositories);
  const diagnostics: ProjectDiagnostic[] = [];

  for (const phase of loaded.phases) {
    if (!work.has(phase.value.workId)) {
      diagnostics.push(
        recordDiagnostic(
          "MISSING_WORK",
          `Work "${phase.value.workId}" does not exist.`,
          phase,
          "Set workId to an existing Work ID.",
        ),
      );
    }
    diagnostics.push(
      ...missingReferences(phase, phase.value.repositoryIds, repositories, "MISSING_REPOSITORY", "Repository"),
    );
  }
  return diagnostics;
}

function checkSingleActivePhase(loaded: LoadedProjectSources): ProjectDiagnostic[] {
  const activeByWorkId = new Map<string, LoadedRecord<PhaseRecord>[]>();
  for (const phase of loaded.phases) {
    if (phase.value.phaseState !== "in-progress") continue;
    const phases = activeByWorkId.get(phase.value.workId) ?? [];
    phases.push(phase);
    activeByWorkId.set(phase.value.workId, phases);
  }
  return [...activeByWorkId.values()].flatMap((phases) =>
    phases.length <= 1
      ? []
      : phases.map((phase) =>
          recordDiagnostic(
            "MULTIPLE_ACTIVE_PHASES",
            `Work "${phase.value.workId}" has more than one in-progress Phase.`,
            phase,
            "Keep only one in-progress Phase per Work record.",
          ),
        ),
  );
}

function checkChecklistReferences(loaded: LoadedProjectSources): ProjectDiagnostic[] {
  const phases = recordMap(loaded.phases);
  const evidence = recordMap(loaded.evidence);
  const diagnostics: ProjectDiagnostic[] = [];

  for (const checklist of loaded.checklists) {
    if (!phases.has(checklist.value.phaseId)) {
      diagnostics.push(
        recordDiagnostic(
          "MISSING_PHASE",
          `Phase "${checklist.value.phaseId}" does not exist.`,
          checklist,
          "Set phaseId to an existing Phase ID.",
        ),
      );
    }
    for (const item of checklist.value.items) {
      if (item.evidenceTarget.trim().length === 0) {
        diagnostics.push(
          recordDiagnostic(
            "CHECKLIST_ITEM_MISSING_EVIDENCE_TARGET",
            `Checklist item "${item.id}" must describe an evidence target.`,
            checklist,
            "Add evidenceTarget text before the item can guide execution.",
          ),
        );
      }
      diagnostics.push(
        ...missingReferences(checklist, item.evidenceIds ?? [], evidence, "MISSING_EVIDENCE", "Evidence"),
      );
      if (
        item.state === "passed" &&
        (item.evidenceIds ?? []).length === 0 &&
        item.verificationNote === undefined
      ) {
        diagnostics.push(
          recordDiagnostic(
            "CHECKLIST_PASSED_WITHOUT_SUPPORT",
            `Checklist item "${item.id}" is passed without Evidence or verificationNote.`,
            checklist,
            "Add an Evidence ID or a bounded verificationNote.",
          ),
        );
      }
    }
  }
  return diagnostics;
}

async function checkDocumentPathsAndReferences(
  loaded: LoadedProjectSources,
): Promise<ProjectDiagnostic[]> {
  const repositories = recordMap(loaded.repositories);
  const root = await resolveRoot(loaded.rootDir);
  const diagnostics: ProjectDiagnostic[] = [];

  for (const document of loaded.documents) {
    diagnostics.push(...checkDocumentReferences(document, repositories));
    const pathDiagnostic = await checkDocumentPath(document, loaded.rootDir, root);
    if (pathDiagnostic !== undefined) {
      diagnostics.push(pathDiagnostic);
    }
  }

  return diagnostics;
}

function checkEvidenceReferences(loaded: LoadedProjectSources): ProjectDiagnostic[] {
  const nodes = recordMap(loaded.nodes);
  const repositories = recordMap(loaded.repositories);
  const diagnostics: ProjectDiagnostic[] = [];

  for (const evidence of loaded.evidence) {
    diagnostics.push(
      ...missingReferences(evidence, evidence.value.nodeIds, nodes, "MISSING_NODE", "Node"),
    );
    if (!repositories.has(evidence.value.repositoryId)) {
      diagnostics.push(
        recordDiagnostic(
          "MISSING_REPOSITORY",
          `Repository "${evidence.value.repositoryId}" does not exist.`,
          evidence,
          "Set repositoryId to an existing Repository ID.",
        ),
      );
    }
  }

  return diagnostics;
}

function checkReciprocalOwnership(loaded: LoadedProjectSources): ProjectDiagnostic[] {
  const nodes = recordMap(loaded.nodes);
  const documents = recordMap(loaded.documents);
  const evidence = recordMap(loaded.evidence);
  const diagnostics: ProjectDiagnostic[] = [];

  for (const node of loaded.nodes) {
    for (const documentId of node.value.documentIds) {
      const document = documents.get(documentId);
      if (document !== undefined && !document.value.nodeIds.includes(node.value.id)) {
        diagnostics.push(
          recordDiagnostic(
            "DOCUMENT_OWNERSHIP_MISMATCH",
            `Document "${documentId}" does not list Node "${node.value.id}" in nodeIds.`,
            node,
            "Keep Node documentIds and Document nodeIds synchronized in both directions.",
          ),
        );
      }
    }
    for (const evidenceId of node.value.evidenceIds) {
      const item = evidence.get(evidenceId);
      if (item !== undefined && !item.value.nodeIds.includes(node.value.id)) {
        diagnostics.push(
          recordDiagnostic(
            "EVIDENCE_OWNERSHIP_MISMATCH",
            `Evidence "${evidenceId}" does not list Node "${node.value.id}" in nodeIds.`,
            node,
            "Keep Node evidenceIds and Evidence nodeIds synchronized in both directions.",
          ),
        );
      }
    }
  }

  for (const document of loaded.documents) {
    for (const nodeId of document.value.nodeIds) {
      const node = nodes.get(nodeId);
      if (node !== undefined && !node.value.documentIds.includes(document.value.id)) {
        diagnostics.push(
          recordDiagnostic(
            "DOCUMENT_OWNERSHIP_MISMATCH",
            `Node "${nodeId}" does not list Document "${document.value.id}" in documentIds.`,
            document,
            "Keep Node documentIds and Document nodeIds synchronized in both directions.",
          ),
        );
      }
    }
  }

  for (const item of loaded.evidence) {
    for (const nodeId of item.value.nodeIds) {
      const node = nodes.get(nodeId);
      if (node !== undefined && !node.value.evidenceIds.includes(item.value.id)) {
        diagnostics.push(
          recordDiagnostic(
            "EVIDENCE_OWNERSHIP_MISMATCH",
            `Node "${nodeId}" does not list Evidence "${item.value.id}" in evidenceIds.`,
            item,
            "Keep Node evidenceIds and Evidence nodeIds synchronized in both directions.",
          ),
        );
      }
    }
  }

  return diagnostics;
}

function checkCurrentEvidence(loaded: LoadedProjectSources): ProjectDiagnostic[] {
  const evidence = recordMap(loaded.evidence);
  return loaded.nodes.flatMap((node) => {
    if (node.value.truthState !== "current") {
      return [];
    }
    const hasEvidence = node.value.evidenceIds.some((evidenceId) =>
      evidence.get(evidenceId)?.value.nodeIds.includes(node.value.id),
    );
    return hasEvidence
      ? []
      : [
          recordDiagnostic(
            "CURRENT_WITHOUT_EVIDENCE",
            "A current Node must reference at least one existing Evidence record.",
            node,
            "Add an existing Evidence ID to evidenceIds or use a non-current truthState.",
          ),
        ];
  });
}

function checkDocumentReferences(
  document: LoadedRecord<DocumentRecord>,
  repositories: Map<string, LoadedRecord<RepositoryRecord>>,
): ProjectDiagnostic[] {
  return document.value.repositoryRefs.flatMap((reference) =>
    repositories.has(reference.repositoryId)
      ? []
      : [
          recordDiagnostic(
            "MISSING_REPOSITORY",
            `Repository "${reference.repositoryId}" does not exist.`,
            document,
            "Set repositoryRefs to existing Repository IDs.",
          ),
        ],
  );
}

async function resolveRoot(rootDir: string): Promise<string | undefined> {
  try {
    return await realpath(resolve(rootDir));
  } catch {
    return undefined;
  }
}

async function checkDocumentPath(
  document: LoadedRecord<DocumentRecord>,
  rootDir: string,
  realRoot: string | undefined,
): Promise<ProjectDiagnostic | undefined> {
  const extension = extname(document.value.path).toLowerCase();
  if (extension !== ".md" && extension !== ".markdown") {
    return recordDiagnostic(
      "DOCUMENT_NOT_MARKDOWN",
      `Document path "${document.value.path}" is not a Markdown file.`,
      document,
      "Use a .md or .markdown document path.",
    );
  }

  const target = resolve(rootDir, document.value.path);
  if (isOutsideRoot(resolve(rootDir), target)) {
    return recordDiagnostic(
      "DOCUMENT_PATH_ESCAPE",
      "Document path resolves outside the project root.",
      document,
      "Keep the document path inside the project root.",
    );
  }

  let realTarget: string;
  try {
    realTarget = await realpath(target);
  } catch {
    return recordDiagnostic(
      "MISSING_DOCUMENT_FILE",
      `Document file "${document.value.path}" does not exist.`,
      document,
      "Create the Markdown file at the declared relative document path.",
    );
  }

  if (realRoot === undefined || isOutsideRoot(realRoot, realTarget)) {
    return recordDiagnostic(
      "DOCUMENT_PATH_ESCAPE",
      "Document path resolves outside the project root.",
      document,
      "Keep the document path inside the project root without symlink escapes.",
    );
  }

  let targetStatus;
  try {
    targetStatus = await stat(realTarget);
  } catch {
    return recordDiagnostic(
      "DOCUMENT_PATH_UNREADABLE",
      `Document file "${document.value.path}" could not be inspected.`,
      document,
      "Check that the Markdown file is readable inside the project root.",
    );
  }

  if (!targetStatus.isFile()) {
    return recordDiagnostic(
      "DOCUMENT_NOT_FILE",
      `Document path "${document.value.path}" must identify a file.`,
      document,
      "Set the document path to a Markdown file inside the project root.",
    );
  }

  return undefined;
}

function missingReferences<T extends ProjectRecord>(
  source: LoadedRecord,
  references: string[],
  targetRecords: Map<string, LoadedRecord<T>>,
  code: string,
  targetName: string,
): ProjectDiagnostic[] {
  return references.flatMap((referenceId) =>
    targetRecords.has(referenceId)
      ? []
      : [
          recordDiagnostic(
            code,
            `${targetName} "${referenceId}" does not exist.`,
            source,
            `Reference an existing ${targetName} ID.`,
          ),
        ],
  );
}

function recordMap<T extends ProjectRecord>(records: LoadedRecord<T>[]): Map<string, LoadedRecord<T>> {
  return new Map(records.map((record) => [record.value.id, record]));
}

function canonicalCycle(cycle: string[]): string[] {
  const first = cycle.reduce((smallest, id, index) =>
    compareCodeUnits(id, cycle[smallest] ?? id) < 0 ? index : smallest,
  0);
  return [...cycle.slice(first), ...cycle.slice(0, first)];
}

function isOutsideRoot(root: string, target: string): boolean {
  const pathFromRoot = relative(root, target);
  return (
    pathFromRoot === ".." ||
    pathFromRoot.startsWith("../") ||
    pathFromRoot.startsWith("..\\") ||
    isAbsolute(pathFromRoot)
  );
}

function recordDiagnostic(
  code: string,
  message: string,
  record: LoadedRecord,
  hint: string,
): ProjectDiagnostic {
  return {
    code,
    message,
    file: record.relativePath,
    recordId: record.value.id,
    hint,
  };
}
