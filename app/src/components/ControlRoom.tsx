import { useMemo, useState } from "react";
import type {
  ChecklistRecord,
  IndexDocument,
  IndexNode,
  IndexWork,
  PhaseRecord,
  ProjectReadModel,
  RepositoryRecord,
  WorkState,
} from "../../../src/model/types.js";
import { StatusBadge } from "./StatusBadge.js";
import "../styles/control-room.css";

interface ControlRoomProps {
  model: ProjectReadModel;
  currentNodeId: string;
  onNavigate: (nodeId: string) => void;
  onOpenDetails: () => void;
}

const workStates: WorkState[] = ["blocked", "in-progress", "in-review", "queued"];

const workStateLabels: Record<WorkState, string> = {
  blocked: "Blocked",
  "in-progress": "In progress",
  "in-review": "In review",
  queued: "Queued",
};

type ControlSurface = "overview" | "history";

export function ControlRoom({
  model,
  currentNodeId,
  onNavigate,
  onOpenDetails,
}: ControlRoomProps) {
  const [surface, setSurface] = useState<ControlSurface>("overview");
  const view = useMemo(() => buildControlRoomView(model, currentNodeId), [model, currentNodeId]);

  if (view.currentNode === undefined) {
    return <p role="alert">The selected node is unavailable.</p>;
  }

  const showRootOverview = surface === "overview" && view.currentNode.parentId === null;

  function navigateToOverview(nodeId: string) {
    setSurface("overview");
    onNavigate(nodeId);
  }

  return (
    <>
      <header className="control-room__header">
        <div>
          <p className="control-room__eyebrow">Project Control</p>
          <h1>FlowDoc control room</h1>
        </div>
        <p>{view.currentNode.summary}</p>
      </header>

      <OverallWorkStatus counts={view.overallCounts} />

      <SurfaceSwitch surface={surface} onChange={setSurface} />

      {surface === "history" ? (
        <WorkHistoryView
          items={view.historyWork}
          nodesById={view.nodesById}
          repositoriesById={view.repositoriesById}
          onFocusOverview={navigateToOverview}
        />
      ) : showRootOverview ? (
        <RepoDirectoryOverview
          nodes={view.directoryNodes}
          childrenByParentId={view.childrenByParentId}
          work={model.work}
          repositoriesById={view.repositoriesById}
          onNavigate={navigateToOverview}
        />
      ) : (
        <div className="control-room__columns">
          <SystemTree
            rootNodes={view.rootNodes}
            childrenByParentId={view.childrenByParentId}
            currentNodeId={currentNodeId}
            activePathIds={view.activePathIds}
            onNavigate={navigateToOverview}
          />
          <WorkTree
            currentNode={view.currentNode}
            workTree={view.branchWorkTree}
            totalWorkCount={view.branchWork.length}
            workById={view.workById}
            phasesByWorkId={view.phasesByWorkId}
            checklistsByPhaseId={view.checklistsByPhaseId}
            repositoriesById={view.repositoriesById}
          />
          <ControlDetail
            node={view.currentNode}
            childCount={view.directChildCount}
            branchWorkCount={view.branchWork.length}
            nodeWork={view.nodeWork}
            documents={view.nodeDocuments}
            evidenceCount={view.nodeEvidenceCount}
            repositories={view.nodeRepositories}
            onOpenDetails={onOpenDetails}
          />
        </div>
      )}
    </>
  );
}

function SurfaceSwitch({
  surface,
  onChange,
}: {
  surface: ControlSurface;
  onChange: (surface: ControlSurface) => void;
}) {
  return (
    <nav className="control-room__surface-switch" aria-label="Control room surfaces">
      <button
        type="button"
        aria-pressed={surface === "overview"}
        onClick={() => onChange("overview")}
      >
        Overview
      </button>
      <button
        type="button"
        aria-pressed={surface === "history"}
        onClick={() => onChange("history")}
      >
        Work History
      </button>
    </nav>
  );
}

function OverallWorkStatus({ counts }: { counts: Record<WorkState, number> }) {
  return (
    <section className="control-room__status" aria-label="Overall work status">
      {workStates.map((state) => (
        <div key={state} className={`control-room__metric control-room__metric--${state}`}>
          <span>{workStateLabels[state]}</span>
          <strong>{counts[state]}</strong>
        </div>
      ))}
    </section>
  );
}

function RepoDirectoryOverview({
  nodes,
  childrenByParentId,
  work,
  repositoriesById,
  onNavigate,
}: {
  nodes: IndexNode[];
  childrenByParentId: Map<string | null, IndexNode[]>;
  work: IndexWork[];
  repositoriesById: Map<string, RepositoryRecord>;
  onNavigate: (nodeId: string) => void;
}) {
  return (
    <section className="control-room__directory" aria-label="Repo Directory Overview">
      <header>
        <div>
          <p className="control-room__eyebrow">Overview</p>
          <h2>Repo Directory Overview</h2>
        </div>
        <span>{nodes.length} areas</span>
      </header>

      {nodes.length === 0 ? (
        <p className="control-room__empty">No repository or area entries are recorded yet.</p>
      ) : (
        <ol className="control-room__directory-grid">
          {nodes.map((node) => (
            <li key={node.id}>
              <RepoDirectoryCard
                node={node}
                work={work}
                childrenByParentId={childrenByParentId}
                repositoriesById={repositoriesById}
                onNavigate={onNavigate}
              />
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

function RepoDirectoryCard({
  node,
  work,
  childrenByParentId,
  repositoriesById,
  onNavigate,
}: {
  node: IndexNode;
  work: IndexWork[];
  childrenByParentId: Map<string | null, IndexNode[]>;
  repositoriesById: Map<string, RepositoryRecord>;
  onNavigate: (nodeId: string) => void;
}) {
  const branchIds = collectBranchIds(node, childrenByParentId);
  const branchWork = work.filter((item) => branchIds.has(item.nodeId));
  const blockedCount = branchWork.filter((item) => item.workState === "blocked").length;
  const repositories = node.repositoryIds
    .map((repositoryId) => repositoriesById.get(repositoryId)?.name ?? repositoryId)
    .sort(compareText);

  return (
    <article className="control-room__directory-card">
      <button
        type="button"
        aria-label={`${node.title} overview`}
        onClick={() => onNavigate(node.id)}
      >
        <span>{node.title}</span>
        <StatusBadge kind="truth" value={node.truthState} />
      </button>
      <p className="control-room__directory-summary">{node.summary}</p>
      {repositories.length === 0 ? null : (
        <p className="control-room__directory-repos">{repositories.join(", ")}</p>
      )}
      <dl className="control-room__directory-counts">
        <div><dt>Work</dt><dd>{branchWork.length}</dd></div>
        <div><dt>Blocked</dt><dd>{blockedCount}</dd></div>
        <div><dt>Evidence</dt><dd>{node.evidenceIds.length}</dd></div>
      </dl>
    </article>
  );
}

function WorkHistoryView({
  items,
  nodesById,
  repositoriesById,
  onFocusOverview,
}: {
  items: IndexWork[];
  nodesById: Map<string, IndexNode>;
  repositoriesById: Map<string, RepositoryRecord>;
  onFocusOverview: (nodeId: string) => void;
}) {
  return (
    <section className="control-room__history" aria-label="Work History View">
      <header>
        <div>
          <p className="control-room__eyebrow">History</p>
          <h2>Work History View</h2>
        </div>
        <span>{items.length} records</span>
      </header>

      {items.length === 0 ? (
        <p className="control-room__empty">No work history is recorded yet.</p>
      ) : (
        <ol className="control-room__history-list">
          {items.map((work) => {
            const node = nodesById.get(work.nodeId);
            const repositories = repositoryNamesForWork(work, node, repositoriesById);
            return (
              <li key={work.id}>
                <article className="control-room__history-row">
                  <div>
                    <header>
                      <h3>{work.title}</h3>
                      <StatusBadge kind="work" value={work.workState} />
                    </header>
                    <p>{work.summary}</p>
                    <p className="control-room__history-meta">
                      <span>{formatDate(work.updatedAt)}</span>
                      <span>{node?.title ?? work.nodeId}</span>
                      {repositories.length === 0 ? null : <span>{repositories.join(", ")}</span>}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onFocusOverview(work.nodeId)}
                  >
                    Focus {node?.title ?? work.nodeId} in Overview
                  </button>
                </article>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}

function SystemTree({
  rootNodes,
  childrenByParentId,
  currentNodeId,
  activePathIds,
  onNavigate,
}: {
  rootNodes: IndexNode[];
  childrenByParentId: Map<string | null, IndexNode[]>;
  currentNodeId: string;
  activePathIds: Set<string>;
  onNavigate: (nodeId: string) => void;
}) {
  return (
    <nav className="control-room__system-tree" aria-label="System tree">
      <h2>System tree</h2>
      <ul>
        {rootNodes.map((node) => (
          <SystemTreeNode
            key={node.id}
            node={node}
            childrenByParentId={childrenByParentId}
            currentNodeId={currentNodeId}
            activePathIds={activePathIds}
            onNavigate={onNavigate}
          />
        ))}
      </ul>
    </nav>
  );
}

function SystemTreeNode({
  node,
  childrenByParentId,
  currentNodeId,
  activePathIds,
  onNavigate,
}: {
  node: IndexNode;
  childrenByParentId: Map<string | null, IndexNode[]>;
  currentNodeId: string;
  activePathIds: Set<string>;
  onNavigate: (nodeId: string) => void;
}) {
  const children = childrenByParentId.get(node.id) ?? [];
  const selected = node.id === currentNodeId;
  const active = activePathIds.has(node.id);
  const branchLabel = selected ? "selected branch" : active ? "active branch" : "system node";

  return (
    <li>
      <button
        type="button"
        className={active ? "control-room__tree-button control-room__tree-button--active" : "control-room__tree-button"}
        aria-current={selected ? "page" : undefined}
        aria-label={`${node.title}, ${branchLabel}`}
        onClick={() => onNavigate(node.id)}
      >
        <span>{node.title}</span>
        <StatusBadge kind="truth" value={node.truthState} />
      </button>
      {children.length === 0 ? null : (
        <ul>
          {children.map((child) => (
            <SystemTreeNode
              key={child.id}
              node={child}
              childrenByParentId={childrenByParentId}
              currentNodeId={currentNodeId}
              activePathIds={activePathIds}
              onNavigate={onNavigate}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

function WorkTree({
  currentNode,
  workTree,
  totalWorkCount,
  workById,
  phasesByWorkId,
  checklistsByPhaseId,
  repositoriesById,
}: {
  currentNode: IndexNode;
  workTree: IndexWork[];
  totalWorkCount: number;
  workById: Map<string, IndexWork>;
  phasesByWorkId: Map<string, PhaseRecord[]>;
  checklistsByPhaseId: Map<string, ChecklistRecord[]>;
  repositoriesById: Map<string, RepositoryRecord>;
}) {
  return (
    <section className="control-room__work-tree" aria-label="Work tree">
      <header>
        <div>
          <p className="control-room__eyebrow">Selected branch</p>
          <h2>{currentNode.title}</h2>
        </div>
        <span>{totalWorkCount} work items</span>
      </header>

      {workTree.length === 0 ? (
        <p className="control-room__empty">No active work is recorded under this branch.</p>
      ) : (
        <ol className="control-room__work-groups" aria-label={`${currentNode.title} work items`}>
          {workTree.map((item) => (
            <li key={item.id}>
              <WorkCard
                work={item}
                workById={workById}
                phasesByWorkId={phasesByWorkId}
                checklistsByPhaseId={checklistsByPhaseId}
                repositoriesById={repositoriesById}
              />
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

function WorkCard({
  work,
  workById,
  phasesByWorkId,
  checklistsByPhaseId,
  repositoriesById,
  depth = 0,
}: {
  work: IndexWork;
  workById: Map<string, IndexWork>;
  phasesByWorkId: Map<string, PhaseRecord[]>;
  checklistsByPhaseId: Map<string, ChecklistRecord[]>;
  repositoriesById: Map<string, RepositoryRecord>;
  depth?: number;
}) {
  const repositories = work.repositoryIds
    .map((repositoryId) => repositoriesById.get(repositoryId)?.name ?? repositoryId)
    .sort(compareText);
  const phases = [...(phasesByWorkId.get(work.id) ?? [])].sort(comparePhases);
  const childWork = work.childWorkIds
    .flatMap((workId) => {
      const child = workById.get(workId);
      return child === undefined ? [] : [child];
    })
    .sort(compareWork);

  return (
    <article className={depth === 0 ? "control-room__work-card" : "control-room__work-card control-room__work-card--nested"}>
      <header>
        <div className="control-room__work-heading">
          <h4>{work.title}</h4>
          <span className="control-room__work-kind">
            {work.workKind === "task" ? "Task" : "Topic"}
          </span>
        </div>
        <StatusBadge kind="work" value={work.workState} />
      </header>
      <p>{work.summary}</p>
      {work.workState !== "blocked" ? null : (
        <p className="control-room__blocker">
          <strong>Blocked by:</strong> {work.blockedBy ?? "Not recorded"}
          {work.unblockOwner === undefined ? null : <> <strong>Owner:</strong> {work.unblockOwner}</>}
        </p>
      )}
      {phases.length === 0 ? (
        <ul className="control-room__checklist" aria-label={`${work.title} checklist`}>
          <ChecklistItem done={true} label="Task is recorded" />
          <ChecklistItem done={repositories.length > 0} label={repositoryChecklistLabel(repositories)} />
          <ChecklistItem
            done={work.requiredEvidence.length > 0}
            label={work.requiredEvidence.length === 0
              ? "Evidence requirement needed"
              : `${work.requiredEvidence.length} evidence item required`}
          />
        </ul>
      ) : (
        <ol className="control-room__phases" aria-label={`${work.title} phases`}>
          {phases.map((phase) => (
            <li key={phase.id}>
              <PhaseSummary
                phase={phase}
                checklists={checklistsByPhaseId.get(phase.id) ?? []}
              />
            </li>
          ))}
        </ol>
      )}
      {childWork.length === 0 ? null : (
        <ol className="control-room__work-children" aria-label={`${work.title} child work`}>
          {childWork.map((child) => (
            <li key={child.id}>
              <WorkCard
                work={child}
                workById={workById}
                phasesByWorkId={phasesByWorkId}
                checklistsByPhaseId={checklistsByPhaseId}
                repositoriesById={repositoriesById}
                depth={depth + 1}
              />
            </li>
          ))}
        </ol>
      )}
    </article>
  );
}

function PhaseSummary({
  phase,
  checklists,
}: {
  phase: PhaseRecord;
  checklists: ChecklistRecord[];
}) {
  const checklistItemCount = checklists.reduce((total, checklist) => total + checklist.items.length, 0);
  const issue = checklistIssueLabel(checklists);

  return (
    <section className="control-room__phase" aria-label={`${phase.title} phase`}>
      <header className="control-room__phase-header">
        <h5>{phase.title}</h5>
        <div className="control-room__phase-meta">
          <span>{phase.phaseState}</span>
          <span>{checklistItemLabel(checklistItemCount)}</span>
        </div>
      </header>
      <p>{phase.summary}</p>
      {issue === null ? null : <p className="control-room__phase-risk">{issue}</p>}
    </section>
  );
}

function checklistItemLabel(count: number): string {
  return `${count} ${count === 1 ? "checklist item" : "checklist items"}`;
}

function checklistIssueLabel(checklists: ChecklistRecord[]): string | null {
  for (const checklist of checklists) {
    for (const item of checklist.items) {
      if (item.evidenceTarget.trim().length === 0) {
        return "Evidence target missing";
      }
      if (
        item.state === "passed"
        && (item.evidenceIds ?? []).length === 0
        && item.verificationNote === undefined
      ) {
        return "Passed item lacks support";
      }
    }
  }

  return null;
}

function repositoryChecklistLabel(repositories: string[]): string {
  if (repositories.length === 0) {
    return "Repository link needed";
  }

  return repositories.length === 1
    ? repositories[0]!
    : `${repositories.length} repositories linked`;
}

function ChecklistItem({ done, label }: { done: boolean; label: string }) {
  return (
    <li className={done ? "control-room__checklist-item control-room__checklist-item--done" : "control-room__checklist-item"}>
      <span aria-hidden="true">{done ? "Ready" : "Review"}</span>
      <span>{label}</span>
    </li>
  );
}

function ControlDetail({
  node,
  childCount,
  branchWorkCount,
  nodeWork,
  documents,
  evidenceCount,
  repositories,
  onOpenDetails,
}: {
  node: IndexNode;
  childCount: number;
  branchWorkCount: number;
  nodeWork: IndexWork[];
  documents: IndexDocument[];
  evidenceCount: number;
  repositories: RepositoryRecord[];
  onOpenDetails: () => void;
}) {
  const activeDocuments = documents.filter((document) => document.lifecycle === "active");
  const issue = priorityIssue(nodeWork, activeDocuments);

  return (
    <aside className="control-room__detail" aria-label="Control detail">
      <h2>{node.title}</h2>
      <p>{node.summary}</p>

      <section className="control-room__detail-states" aria-label="Selected node status">
        <div>
          <h3>Truth</h3>
          <StatusBadge kind="truth" value={node.truthState} />
        </div>
        <div>
          <h3>Work</h3>
          {nodeWork.length === 0
            ? <span>No direct work</span>
            : <StatusBadge kind="work" value={highestPriorityWork(nodeWork).workState} />}
        </div>
      </section>

      <dl className="control-room__detail-counts">
        <dt>Child nodes</dt><dd>{childCount}</dd>
        <dt>Branch work</dt><dd>{branchWorkCount}</dd>
        <dt>Documents</dt><dd>{activeDocuments.length}</dd>
        <dt>Evidence</dt><dd>{evidenceCount}</dd>
      </dl>

      {repositories.length === 0 ? null : (
        <section className="control-room__repo-list" aria-label="Related repositories">
          <h3>Repos</h3>
          <ul>
            {repositories.map((repository) => <li key={repository.id}>{repository.name}</li>)}
          </ul>
        </section>
      )}

      {issue === null ? null : (
        <section className="control-room__priority-issue" aria-label="Priority issue">
          <h3>Marked risk</h3>
          <p>{issue}</p>
        </section>
      )}

      <button type="button" onClick={onOpenDetails}>View all</button>
    </aside>
  );
}

function buildControlRoomView(model: ProjectReadModel, currentNodeId: string) {
  const nodesById = new Map(model.nodes.map((node) => [node.id, node]));
  const workById = new Map(model.work.map((work) => [work.id, work]));
  const repositoriesById = new Map(model.repositories.map((repository) => [repository.id, repository]));
  const phasesByWorkId = groupRecords(model.phases, (phase) => phase.workId);
  const checklistsByPhaseId = groupRecords(model.checklists, (checklist) => checklist.phaseId);
  const childrenByParentId = buildChildrenByParentId(model.nodes);
  const currentNode = nodesById.get(currentNodeId);
  const branchIds = currentNode === undefined ? new Set<string>() : collectBranchIds(currentNode, childrenByParentId);
  const activePathIds = currentNode === undefined ? new Set<string>() : collectPathIds(currentNode, nodesById);
  const branchWork = model.work
    .filter((work) => branchIds.has(work.nodeId))
    .sort(compareWork);
  const branchWorkTree = buildBranchWorkTree(branchWork, workById);
  const nodeWork = currentNode === undefined ? [] : recordsForIds(currentNode.workIds, model.work);
  const nodeDocuments = currentNode === undefined ? [] : recordsForIds(currentNode.documentIds, model.documents);
  const nodeRepositories = currentNode === undefined ? [] : recordsForIds(currentNode.repositoryIds, model.repositories);

  return {
    nodesById,
    rootNodes: rootNodes(model.nodes),
    childrenByParentId,
    currentNode,
    directoryNodes: currentNode === undefined ? [] : (childrenByParentId.get(currentNode.id) ?? []),
    activePathIds,
    branchWork,
    branchWorkTree,
    historyWork: [...model.work].sort(compareHistoryWork),
    nodeWork,
    nodeDocuments,
    nodeRepositories,
    workById,
    phasesByWorkId,
    checklistsByPhaseId,
    repositoriesById,
    overallCounts: countWorkStates(model.work),
    directChildCount: currentNode?.childIds.length ?? 0,
    nodeEvidenceCount: currentNode?.evidenceIds.length ?? 0,
  };
}

function groupRecords<T>(records: T[], readKey: (record: T) => string): Map<string, T[]> {
  const grouped = new Map<string, T[]>();
  for (const record of records) {
    const key = readKey(record);
    const items = grouped.get(key) ?? [];
    items.push(record);
    grouped.set(key, items);
  }

  return grouped;
}

function buildBranchWorkTree(work: IndexWork[], workById: Map<string, IndexWork>): IndexWork[] {
  const branchIds = new Set(work.map((item) => item.id));
  return work
    .filter((item) => (
      item.parentWorkId === undefined
      || !branchIds.has(item.parentWorkId)
      || !workById.has(item.parentWorkId)
    ))
    .sort(compareWork);
}

function rootNodes(nodes: IndexNode[]): IndexNode[] {
  return nodes
    .filter((node) => node.parentId === null)
    .sort(compareNodes);
}

function buildChildrenByParentId(nodes: IndexNode[]): Map<string | null, IndexNode[]> {
  const childrenByParentId = new Map<string | null, IndexNode[]>();
  for (const node of nodes) {
    const siblings = childrenByParentId.get(node.parentId) ?? [];
    siblings.push(node);
    childrenByParentId.set(node.parentId, siblings);
  }

  for (const siblings of childrenByParentId.values()) {
    siblings.sort(compareNodes);
  }

  return childrenByParentId;
}

function collectBranchIds(node: IndexNode, childrenByParentId: Map<string | null, IndexNode[]>): Set<string> {
  const ids = new Set<string>([node.id]);
  const remaining = [...(childrenByParentId.get(node.id) ?? [])];
  while (remaining.length > 0) {
    const next = remaining.shift();
    if (next === undefined || ids.has(next.id)) {
      continue;
    }
    ids.add(next.id);
    remaining.push(...(childrenByParentId.get(next.id) ?? []));
  }

  return ids;
}

function collectPathIds(node: IndexNode, nodesById: Map<string, IndexNode>): Set<string> {
  const ids = new Set<string>();
  let current: IndexNode | undefined = node;
  while (current !== undefined) {
    ids.add(current.id);
    current = current.parentId === null ? undefined : nodesById.get(current.parentId);
  }

  return ids;
}

function countWorkStates(work: IndexWork[]): Record<WorkState, number> {
  const counts: Record<WorkState, number> = {
    blocked: 0,
    "in-progress": 0,
    "in-review": 0,
    queued: 0,
  };
  for (const item of work) {
    counts[item.workState] += 1;
  }
  return counts;
}

function highestPriorityWork(work: IndexWork[]): IndexWork {
  return [...work].sort(compareWork)[0]!;
}

function priorityIssue(work: IndexWork[], documents: IndexDocument[]): string | null {
  const blockedWork = work.find((item) => item.workState === "blocked");
  if (blockedWork !== undefined) {
    return blockedWork.summary;
  }

  const riskDocument = documents
    .filter((document) => document.role === "risk" || document.role === "unknown")
    .sort((left, right) => compareText(left.id, right.id))[0];
  return riskDocument?.title ?? null;
}

function recordsForIds<T extends { id: string }>(ids: string[], records: T[]): T[] {
  const recordsById = new Map(records.map((record) => [record.id, record]));
  return ids.flatMap((id) => {
    const record = recordsById.get(id);
    return record === undefined ? [] : [record];
  });
}

function compareWork(left: IndexWork, right: IndexWork): number {
  const priority = workStates.indexOf(left.workState) - workStates.indexOf(right.workState);
  if (priority !== 0) {
    return priority;
  }

  const updated = right.updatedAt.localeCompare(left.updatedAt);
  return updated !== 0 ? updated : compareText(left.title, right.title);
}

function compareHistoryWork(left: IndexWork, right: IndexWork): number {
  const updated = right.updatedAt.localeCompare(left.updatedAt);
  return updated !== 0 ? updated : compareText(left.title, right.title);
}

function comparePhases(left: PhaseRecord, right: PhaseRecord): number {
  return left.order - right.order || compareText(left.title, right.title) || compareText(left.id, right.id);
}

function compareNodes(left: IndexNode, right: IndexNode): number {
  return left.order - right.order || compareText(left.title, right.title) || compareText(left.id, right.id);
}

function compareText(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function repositoryNamesForWork(
  work: IndexWork,
  node: IndexNode | undefined,
  repositoriesById: Map<string, RepositoryRecord>,
): string[] {
  const repositoryIds = work.repositoryIds.length === 0
    ? node?.repositoryIds ?? []
    : work.repositoryIds;
  return repositoryIds
    .map((repositoryId) => repositoriesById.get(repositoryId)?.name ?? repositoryId)
    .sort(compareText);
}

function formatDate(value: string): string {
  const [date] = value.split("T");
  return date ?? value;
}
