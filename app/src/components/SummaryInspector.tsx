import type { IndexDocument, IndexNode, WorkRecord, WorkState } from "../../../src/model/types.js";
import { StatusBadge } from "./StatusBadge.js";
import "../styles/inspector.css";

export interface SummaryInspectorProps {
  node: IndexNode;
  childCount: number;
  work: WorkRecord[];
  documents: IndexDocument[];
  onOpenDetails: () => void;
}

const workPriority: WorkState[] = ["blocked", "in-review", "in-progress", "queued"];

export function SummaryInspector({
  node,
  childCount,
  work,
  documents,
  onOpenDetails,
}: SummaryInspectorProps) {
  const activeDocuments = documents.filter((document) => document.lifecycle === "active");
  const workHeadline = highestPriorityWork(work);
  const issue = priorityIssue(work, documents);

  return (
    <aside className="summary-inspector" aria-label="Summary Inspector">
      <h2>{node.title}</h2>
      <p className="summary-clamp" data-testid="node-summary" title={node.summary}>
        {node.summary}
      </p>

      <section className="summary-inspector__states" aria-label="Node status">
        <div>
          <h3>Truth state</h3>
          <StatusBadge kind="truth" value={node.truthState} />
        </div>
        <div>
          <h3>Work state</h3>
          {workHeadline === undefined
            ? <span>No active work</span>
            : <StatusBadge kind="work" value={workHeadline.workState} />}
        </div>
      </section>

      <dl className="summary-inspector__counts">
        <dt>Child nodes</dt><dd>{childCount}</dd>
        <dt>Work queue</dt><dd>{work.length}</dd>
        <dt>Documents</dt><dd>{activeDocuments.length}</dd>
      </dl>

      {issue === null ? null : (
        <section className="summary-inspector__issue" aria-label="Priority issue">
          <h3>Priority issue</h3>
          <p>{issue.summary}</p>
        </section>
      )}

      <button type="button" onClick={onOpenDetails}>View all</button>
    </aside>
  );
}

function highestPriorityWork(work: WorkRecord[]): WorkRecord | undefined {
  for (const state of workPriority) {
    const match = work.find((item) => item.workState === state);
    if (match !== undefined) {
      return match;
    }
  }

  return undefined;
}

function priorityIssue(work: WorkRecord[], documents: IndexDocument[]): { summary: string } | null {
  const blockedWork = work.find((item) => item.workState === "blocked");
  if (blockedWork !== undefined) {
    return { summary: blockedWork.summary };
  }

  const riskDocument = firstActiveDocumentByRole(documents, "risk");
  if (riskDocument !== undefined) {
    return { summary: riskDocument.title };
  }

  const unknownDocument = firstActiveDocumentByRole(documents, "unknown");
  return unknownDocument === undefined
    ? null
    : { summary: unknownDocument.title };
}

function firstActiveDocumentByRole(
  documents: IndexDocument[],
  role: "risk" | "unknown",
): IndexDocument | undefined {
  return documents
    .filter((document) => document.lifecycle === "active" && document.role === role)
    .sort((left, right) => compareIds(left.id, right.id))[0];
}

function compareIds(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}
