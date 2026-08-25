import { useMemo } from "react";
import type {
  IndexDocument,
  IndexNode,
  ProjectReadModel,
  RepositoryRecord,
  WorkRecord,
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

export function ControlRoom({
  model,
  currentNodeId,
  onNavigate,
  onOpenDetails,
}: ControlRoomProps) {
  const view = useMemo(() => buildControlRoomView(model, currentNodeId), [model, currentNodeId]);

  if (view.currentNode === undefined) {
    return <p role="alert">The selected node is unavailable.</p>;
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

      <div className="control-room__columns">
        <SystemTree
          rootNodes={view.rootNodes}
          childrenByParentId={view.childrenByParentId}
          currentNodeId={currentNodeId}
          activePathIds={view.activePathIds}
          onNavigate={onNavigate}
        />
        <WorkTree
          currentNode={view.currentNode}
          groupedWork={view.groupedBranchWork}
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
    </>
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
  groupedWork,
  repositoriesById,
}: {
  currentNode: IndexNode;
  groupedWork: Array<{ node: IndexNode; work: WorkRecord[] }>;
  repositoriesById: Map<string, RepositoryRecord>;
}) {
  return (
    <section className="control-room__work-tree" aria-label="Work tree">
      <header>
        <div>
          <p className="control-room__eyebrow">Selected branch</p>
          <h2>{currentNode.title}</h2>
        </div>
        <span>{sumWork(groupedWork)} work items</span>
      </header>

      {groupedWork.length === 0 ? (
        <p className="control-room__empty">No active work is recorded under this branch.</p>
      ) : (
        <ol className="control-room__work-groups">
          {groupedWork.map(({ node, work }) => (
            <li key={node.id} className="control-room__work-group">
              <h3>{node.title}</h3>
              <ol>
                {work.map((item) => (
                  <li key={item.id}>
                    <WorkCard work={item} repositoriesById={repositoriesById} />
                  </li>
                ))}
              </ol>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

function WorkCard({
  work,
  repositoriesById,
}: {
  work: WorkRecord;
  repositoriesById: Map<string, RepositoryRecord>;
}) {
  const repositories = work.repositoryIds
    .map((repositoryId) => repositoriesById.get(repositoryId)?.name ?? repositoryId)
    .sort(compareText);

  return (
    <article className="control-room__work-card">
      <header>
        <h4>{work.title}</h4>
        <StatusBadge kind="work" value={work.workState} />
      </header>
      <p>{work.summary}</p>
      {work.workState !== "blocked" ? null : (
        <p className="control-room__blocker">
          <strong>Blocked by:</strong> {work.blockedBy ?? "Not recorded"}
          {work.unblockOwner === undefined ? null : <> <strong>Owner:</strong> {work.unblockOwner}</>}
        </p>
      )}
      <ul className="control-room__checklist" aria-label={`${work.title} checklist`}>
        <ChecklistItem done={true} label="Task is recorded" />
        <ChecklistItem done={repositories.length > 0} label={repositories.length === 0 ? "Repository not linked" : repositories.join(", ")} />
        <ChecklistItem
          done={work.requiredEvidence.length > 0}
          label={work.requiredEvidence.length === 0
            ? "Evidence requirement is empty"
            : `${work.requiredEvidence.length} evidence item required`}
        />
      </ul>
    </article>
  );
}

function ChecklistItem({ done, label }: { done: boolean; label: string }) {
  return (
    <li className={done ? "control-room__checklist-item control-room__checklist-item--done" : "control-room__checklist-item"}>
      <span aria-hidden="true">{done ? "OK" : "!"}</span>
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
  nodeWork: WorkRecord[];
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
  const repositoriesById = new Map(model.repositories.map((repository) => [repository.id, repository]));
  const documentsById = new Map(model.documents.map((document) => [document.id, document]));
  const childrenByParentId = buildChildrenByParentId(model.nodes);
  const currentNode = nodesById.get(currentNodeId);
  const branchIds = currentNode === undefined ? new Set<string>() : collectBranchIds(currentNode, childrenByParentId);
  const activePathIds = currentNode === undefined ? new Set<string>() : collectPathIds(currentNode, nodesById);
  const branchWork = model.work
    .filter((work) => branchIds.has(work.nodeId))
    .sort(compareWork);
  const nodeWork = currentNode === undefined ? [] : recordsForIds(currentNode.workIds, model.work);
  const nodeDocuments = currentNode === undefined ? [] : recordsForIds(currentNode.documentIds, model.documents);
  const nodeRepositories = currentNode === undefined ? [] : recordsForIds(currentNode.repositoryIds, model.repositories);
  const groupedBranchWork = groupBranchWork(branchWork, nodesById, activePathIds, currentNodeId);

  return {
    rootNodes: rootNodes(model.nodes),
    childrenByParentId,
    currentNode,
    activePathIds,
    branchWork,
    nodeWork,
    nodeDocuments,
    nodeRepositories,
    groupedBranchWork,
    repositoriesById,
    overallCounts: countWorkStates(model.work),
    directChildCount: currentNode?.childIds.length ?? 0,
    nodeEvidenceCount: currentNode?.evidenceIds.length ?? 0,
    documentsById,
  };
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

function groupBranchWork(
  work: WorkRecord[],
  nodesById: Map<string, IndexNode>,
  activePathIds: Set<string>,
  currentNodeId: string,
): Array<{ node: IndexNode; work: WorkRecord[] }> {
  const workByNodeId = new Map<string, WorkRecord[]>();
  for (const item of work) {
    const nodeWork = workByNodeId.get(item.nodeId) ?? [];
    nodeWork.push(item);
    workByNodeId.set(item.nodeId, nodeWork);
  }

  return Array.from(workByNodeId.entries())
    .flatMap(([nodeId, nodeWork]) => {
      const node = nodesById.get(nodeId);
      return node === undefined ? [] : [{ node, work: nodeWork.sort(compareWork) }];
    })
    .sort((left, right) => {
      if (left.node.id === currentNodeId && right.node.id !== currentNodeId) {
        return -1;
      }
      if (right.node.id === currentNodeId && left.node.id !== currentNodeId) {
        return 1;
      }
      const leftInPath = activePathIds.has(left.node.id);
      const rightInPath = activePathIds.has(right.node.id);
      if (leftInPath !== rightInPath) {
        return leftInPath ? -1 : 1;
      }
      return compareNodes(left.node, right.node);
    });
}

function countWorkStates(work: WorkRecord[]): Record<WorkState, number> {
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

function sumWork(groups: Array<{ work: WorkRecord[] }>): number {
  return groups.reduce((total, group) => total + group.work.length, 0);
}

function highestPriorityWork(work: WorkRecord[]): WorkRecord {
  return [...work].sort(compareWork)[0]!;
}

function priorityIssue(work: WorkRecord[], documents: IndexDocument[]): string | null {
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

function compareWork(left: WorkRecord, right: WorkRecord): number {
  const priority = workStates.indexOf(left.workState) - workStates.indexOf(right.workState);
  if (priority !== 0) {
    return priority;
  }

  const updated = right.updatedAt.localeCompare(left.updatedAt);
  return updated !== 0 ? updated : compareText(left.title, right.title);
}

function compareNodes(left: IndexNode, right: IndexNode): number {
  return left.order - right.order || compareText(left.title, right.title) || compareText(left.id, right.id);
}

function compareText(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}
