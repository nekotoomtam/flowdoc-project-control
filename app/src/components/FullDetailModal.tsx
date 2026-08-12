import { useEffect, useId, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { EvidenceRecord, IndexDocument, IndexNode, RepositoryRecord, WorkRecord } from "../../../src/model/types.js";
import { StatusBadge } from "./StatusBadge.js";
import "../styles/modal.css";

type DetailTab = "overview" | "work" | "documents" | "risks" | "evidence";

export interface FullDetailModalProps {
  open: boolean;
  node: IndexNode;
  work: WorkRecord[];
  documents: IndexDocument[];
  evidence: EvidenceRecord[];
  repositories: RepositoryRecord[];
  onClose: () => void;
}

const tabIds: DetailTab[] = ["overview", "work", "documents", "risks", "evidence"];
const tabLabels: Record<DetailTab, string> = {
  overview: "Overview",
  work: "Work",
  documents: "Documents",
  risks: "Risks",
  evidence: "Evidence",
};

export function FullDetailModal({
  open,
  node,
  work,
  documents,
  evidence,
  repositories,
  onClose,
}: FullDetailModalProps) {
  const [activeTab, setActiveTab] = useState<DetailTab>("overview");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const tabRefs = useRef(new Map<DetailTab, HTMLButtonElement>());
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const wasOpenRef = useRef(false);
  const idPrefix = useId();
  const headingId = `${idPrefix}-heading`;

  useEffect(() => {
    if (!open) {
      wasOpenRef.current = false;
      return;
    }

    if (!wasOpenRef.current) {
      wasOpenRef.current = true;
      setActiveTab("overview");
    }
    returnFocusRef.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    document.body.classList.add("modal-open");

    const dialog = dialogRef.current;
    if (dialog !== null) {
      if (typeof dialog.showModal === "function") {
        try {
          dialog.showModal();
        } catch {
          dialog.setAttribute("open", "");
        }
      } else {
        dialog.setAttribute("open", "");
      }
    }

    tabRefs.current.get("overview")?.focus();

    return () => {
      releaseDialog(dialogRef.current);
      restoreFocus(returnFocusRef.current);
    };
  }, [open]);

  if (!open) {
    return null;
  }

  const documentPaths = new Set(
    documents.flatMap((document) => {
      const path = normalizeRepositoryPath(document.path);
      return path === null ? [] : [path];
    }),
  );
  const ownedEvidence = evidence.filter(
    (item) => node.evidenceIds.includes(item.id) && item.nodeIds.includes(node.id),
  );

  function requestClose() {
    releaseDialog(dialogRef.current);
    restoreFocus(returnFocusRef.current);
    onClose();
  }

  function selectTab(tabId: DetailTab) {
    setActiveTab(tabId);
    tabRefs.current.get(tabId)?.focus();
  }

  function handleTabKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, tabId: DetailTab) {
    const currentIndex = tabIds.indexOf(tabId);
    const nextTabId = event.key === "ArrowRight"
      ? tabIds[(currentIndex + 1) % tabIds.length]
      : event.key === "ArrowLeft"
        ? tabIds[(currentIndex - 1 + tabIds.length) % tabIds.length]
        : event.key === "Home"
          ? tabIds[0]
          : event.key === "End"
            ? tabIds[tabIds.length - 1]
            : undefined;

    if (nextTabId !== undefined) {
      event.preventDefault();
      selectTab(nextTabId);
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDialogElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      requestClose();
      return;
    }

    if (event.key !== "Tab") {
      return;
    }

    const dialog = dialogRef.current;
    if (dialog === null) {
      return;
    }

    const focusable = focusableElements(dialog);
    if (focusable.length === 0) {
      event.preventDefault();
      dialog.focus();
      return;
    }

    const currentIndex = focusable.indexOf(document.activeElement as HTMLElement);
    const nextIndex = event.shiftKey
      ? currentIndex <= 0 ? focusable.length - 1 : currentIndex - 1
      : currentIndex === focusable.length - 1 ? 0 : currentIndex + 1;

    event.preventDefault();
    focusable[nextIndex]?.focus();
  }

  return (
    <dialog
      ref={dialogRef}
      className="full-detail-modal"
      aria-labelledby={headingId}
      aria-modal="true"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          requestClose();
        }
      }}
      onCancel={(event) => {
        event.preventDefault();
        requestClose();
      }}
      onKeyDown={handleKeyDown}
    >
      <article className="full-detail-modal__content">
        <header className="full-detail-modal__header">
          <div>
            <p className="full-detail-modal__eyebrow">Full detail</p>
            <h2 id={headingId}>{node.title} details</h2>
          </div>
          <button type="button" aria-label="Close details" onClick={requestClose}>×</button>
        </header>

        <div role="tablist" aria-label="Detail sections" className="full-detail-modal__tabs">
          {tabIds.map((tabId) => (
            <button
              key={tabId}
              ref={(element) => {
                if (element === null) {
                  tabRefs.current.delete(tabId);
                } else {
                  tabRefs.current.set(tabId, element);
                }
              }}
              id={`${idPrefix}-${tabId}-tab`}
              type="button"
              role="tab"
              aria-selected={activeTab === tabId}
              aria-controls={`${idPrefix}-${tabId}-panel`}
              tabIndex={activeTab === tabId ? 0 : -1}
              onClick={() => selectTab(tabId)}
              onKeyDown={(event) => handleTabKeyDown(event, tabId)}
            >
              {tabLabels[tabId]}
            </button>
          ))}
        </div>

        <section
          id={`${idPrefix}-${activeTab}-panel`}
          role="tabpanel"
          aria-labelledby={`${idPrefix}-${activeTab}-tab`}
          className="full-detail-modal__panel"
        >
          {activeTab === "overview" && (
            <Overview node={node} repositories={repositories} />
          )}
          {activeTab === "work" && <WorkList work={work} />}
          {activeTab === "documents" && (
            <DocumentGroups documents={documents} documentPaths={documentPaths} />
          )}
          {activeTab === "risks" && <RiskList work={work} documents={documents} documentPaths={documentPaths} />}
          {activeTab === "evidence" && (
            <EvidenceList evidence={ownedEvidence} repositories={repositories} />
          )}
        </section>
      </article>
    </dialog>
  );
}

function Overview({ node, repositories }: { node: IndexNode; repositories: RepositoryRecord[] }) {
  const involvedRepositories = repositories.filter((repository) => node.repositoryIds.includes(repository.id));
  return (
    <div className="full-detail-modal__overview">
      <p>{node.summary}</p>
      <div><strong>Truth state:</strong> <StatusBadge kind="truth" value={node.truthState} /></div>
      <section aria-label="Related repositories">
        <h3>Related repositories</h3>
        {involvedRepositories.length === 0 ? <p>No repository is recorded.</p> : (
          <ul>{involvedRepositories.map((repository) => <li key={repository.id}>{repository.name}</li>)}</ul>
        )}
      </section>
    </div>
  );
}

function WorkList({ work }: { work: WorkRecord[] }) {
  return (
    <section aria-label="Current work and queue">
      <h3>Current work and queue</h3>
      {work.length === 0 ? <p>No active work is recorded.</p> : (
        <ul className="full-detail-modal__records">
          {work.map((item) => (
            <li key={item.id}>
              <h4>{item.title}</h4>
              <StatusBadge kind="work" value={item.workState} />
              <p>{item.summary}</p>
              {item.workState !== "blocked" ? null : (
                <p><strong>Blocked by:</strong> {item.blockedBy} <strong>Unblock owner:</strong> {item.unblockOwner}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function DocumentGroups({ documents, documentPaths }: { documents: IndexDocument[]; documentPaths: Set<string> }) {
  const groups: Array<{ lifecycle: IndexDocument["lifecycle"]; title: string }> = [
    { lifecycle: "active", title: "Active documents" },
    { lifecycle: "superseded", title: "Historical: superseded documents" },
    { lifecycle: "retired", title: "Historical: retired documents" },
  ];
  return (
    <section aria-label="Reference documents">
      <h3>Reference documents</h3>
      {groups.map(({ lifecycle, title }) => {
        const groupedDocuments = documents.filter((document) => document.lifecycle === lifecycle);
        return (
          <section key={lifecycle} aria-label={title}>
            <h4>{title}</h4>
            {groupedDocuments.length === 0 ? <p>None.</p> : (
              <ul className="full-detail-modal__records">
                {groupedDocuments.map((document) => (
                  <li key={document.id}>
                    <h5
                      aria-describedby={lifecycle === "active" ? undefined : `${document.id}-history`}
                    >
                      {document.title}
                    </h5>
                    {lifecycle === "active" ? null : (
                      <span id={`${document.id}-history`} className="visually-hidden">Historical record: {lifecycle}</span>
                    )}
                    <p><strong>Role:</strong> {document.role}</p>
                    <ReactMarkdown skipHtml remarkPlugins={[remarkGfm]} components={{
                      a: ({ href, children }) => <SafeMarkdownLink href={href} documentPaths={documentPaths}>{children}</SafeMarkdownLink>,
                    }}>
                      {document.content}
                    </ReactMarkdown>
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </section>
  );
}

function RiskList({
  work,
  documents,
  documentPaths,
}: {
  work: WorkRecord[];
  documents: IndexDocument[];
  documentPaths: Set<string>;
}) {
  const riskDocuments = documents.filter(
    (document) => document.lifecycle === "active" && (document.role === "risk" || document.role === "unknown"),
  );
  const blockedWork = work.filter((item) => item.workState === "blocked");
  return (
    <section aria-label="Risks and unknowns">
      <h3>Risks and unknowns</h3>
      {riskDocuments.length === 0 && blockedWork.length === 0 ? <p>No active risks or unknowns are recorded.</p> : (
        <ul className="full-detail-modal__records">
          {riskDocuments.map((document) => (
            <li key={document.id}>
              <h4>{document.title}</h4>
              <ReactMarkdown skipHtml remarkPlugins={[remarkGfm]} components={{
                a: ({ href, children }) => <SafeMarkdownLink href={href} documentPaths={documentPaths}>{children}</SafeMarkdownLink>,
              }}>
                {document.content}
              </ReactMarkdown>
            </li>
          ))}
          {blockedWork.map((item) => <li key={item.id}><h4>{item.title}</h4><p>{item.summary}</p></li>)}
        </ul>
      )}
    </section>
  );
}

function EvidenceList({ evidence, repositories }: { evidence: EvidenceRecord[]; repositories: RepositoryRecord[] }) {
  const repositoriesById = new Map(repositories.map((repository) => [repository.id, repository]));
  return (
    <section aria-label="Evidence and short history">
      <h3>Evidence and short history</h3>
      {evidence.length === 0 ? <p>No reciprocal evidence is recorded.</p> : (
        <ul className="full-detail-modal__records">
          {evidence.map((item) => {
            const repository = repositoriesById.get(item.repositoryId);
            const commitDescriptionId = `${item.id}-commit`;
            return (
              <li key={item.id}>
                <h4>{repository?.name ?? `Unknown repository (${item.repositoryId})`}</h4>
                <p><code aria-describedby={commitDescriptionId}>{item.commit.slice(0, 7)}</code><span id={commitDescriptionId} className="visually-hidden">Full commit {item.commit}</span> · {item.pathOrContractId}</p>
                <p>{item.verificationSummary}</p>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

function SafeMarkdownLink({ href, children, documentPaths }: { href: string | undefined; children: React.ReactNode; documentPaths: Set<string> }) {
  if (href !== undefined && isHttpsUrl(href)) {
    return <a href={href} target="_blank" rel="noreferrer noopener">{children}</a>;
  }

  const internalPath = href === undefined ? null : normalizeRepositoryPath(href.split(/[?#]/, 1)[0] ?? "");
  return internalPath !== null && documentPaths.has(internalPath)
    ? <a href={href}>{children}</a>
    : <>{children}</>;
}

function isHttpsUrl(value: string): boolean {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

function normalizeRepositoryPath(value: string): string | null {
  if (value.length === 0 || value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return null;
  }
  if (/^[a-z][a-z0-9+.-]*:/i.test(value)) {
    return null;
  }

  const parts = value.split("/");
  if (parts.some((part) => part === "..")) {
    return null;
  }
  const normalized = parts.filter((part) => part.length > 0 && part !== ".").join("/");
  return normalized.length === 0 ? null : normalized;
}

function focusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(
    "a[href], area[href], button, input, select, textarea, [tabindex]",
  )).filter((element) => {
    const style = getComputedStyle(element);
    return element.tabIndex >= 0
      && !element.matches(":disabled, input[type='hidden']")
      && element.getAttribute("aria-disabled") !== "true"
      && element.closest("[aria-hidden='true'], [hidden], [inert]") === null
      && style.display !== "none"
      && style.visibility !== "hidden";
  });
}

function releaseDialog(dialog: HTMLDialogElement | null) {
  document.body.classList.remove("modal-open");
  if (dialog?.hasAttribute("open")) {
    if (typeof dialog.close === "function") {
      dialog.close();
    } else {
      dialog.removeAttribute("open");
    }
  }
}

function restoreFocus(element: HTMLElement | null) {
  if (element !== null && document.contains(element)) {
    element.focus();
  }
}
