import { StrictMode, useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { EvidenceRecord, IndexDocument, IndexNode, RepositoryRecord, WorkRecord } from "../../../src/model/types.js";
import { FullDetailModal } from "./FullDetailModal.js";

const node: IndexNode = {
  kind: "node",
  id: "project-control",
  title: "Project Control",
  parentId: null,
  summary: "The shared project-control repository.",
  truthState: "planned",
  order: 0,
  documentIds: ["design", "retired", "risk"],
  evidenceIds: ["evidence-design", "unowned-evidence"],
  repositoryIds: ["control"],
  childIds: [],
  workIds: ["pilot", "blocked"],
};

const work: WorkRecord[] = [
  {
    kind: "work",
    id: "pilot",
    title: "CORE_ROUTE pilot",
    nodeId: node.id,
    repositoryIds: ["control"],
    workState: "queued",
    summary: "Migrate the pilot records.",
    requiredEvidence: [],
    createdAt: "2026-08-12T00:00:00.000Z",
    updatedAt: "2026-08-12T00:00:00.000Z",
  },
  {
    kind: "work",
    id: "blocked",
    title: "Resolve source scope",
    nodeId: node.id,
    repositoryIds: ["control"],
    workState: "blocked",
    summary: "The source scope needs an owner decision.",
    blockedBy: "Source records are incomplete.",
    unblockOwner: "Project control owner",
    requiredEvidence: [],
    createdAt: "2026-08-12T00:00:00.000Z",
    updatedAt: "2026-08-12T00:00:00.000Z",
  },
];

const documents: IndexDocument[] = [
  makeDocument("design", "Architecture and GUI Design", "active", "decision", "Read the [approved design](docs/design.md), [safe site](https://example.test/design), and [unsafe file](file:///secret). <script>ignored</script>"),
  makeDocument("retired", "Retired note", "retired", "historical-note", "Historical context."),
  makeDocument("risk", "Unknown migration scope", "active", "risk", "Scope is currently unknown."),
];

const evidence: EvidenceRecord[] = [
  {
    kind: "evidence",
    id: "evidence-design",
    nodeIds: [node.id],
    repositoryId: "control",
    commit: "bc2e1efb60c7391b2d4b0978cf7c4b1105ef7444",
    pathOrContractId: "docs/design.md",
    verificationSummary: "Design record verified.",
    verifiedAt: "2026-08-12T00:00:00.000Z",
  },
  {
    kind: "evidence",
    id: "unowned-evidence",
    nodeIds: [],
    repositoryId: "control",
    commit: "0000000000000000000000000000000000000000",
    pathOrContractId: "ignored.md",
    verificationSummary: "This must not appear.",
    verifiedAt: "2026-08-12T00:00:00.000Z",
  },
];

const repositories: RepositoryRecord[] = [{
  kind: "repository",
  id: "control",
  name: "Project Control",
  remote: "https://example.test/project-control.git",
  checkoutAlias: "project-control",
  defaultBranch: "main",
  ownershipSummary: "Cross-repository truth.",
}];

const modalProps = { node, work, documents, evidence, repositories, onClose: vi.fn() };

describe("FullDetailModal", () => {
  it("separates work, documents, risks, and evidence", async () => {
    const user = userEvent.setup();
    render(<FullDetailModal open {...modalProps} />);

    await user.click(screen.getByRole("tab", { name: "Work" }));
    expect(screen.getByRole("tabpanel")).toContainElement(screen.getByText("CORE_ROUTE pilot"));
    expect(screen.queryByText("Architecture and GUI Design")).not.toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "Documents" }));
    expect(screen.getByText("Architecture and GUI Design")).toBeVisible();
    expect(screen.getByText("Retired note")).toHaveAccessibleDescription(/Historical/);

    await user.click(screen.getByRole("tab", { name: "Risks" }));
    expect(screen.getByText("Unknown migration scope")).toBeVisible();
    expect(screen.getByText("Resolve source scope")).toBeVisible();

    await user.click(screen.getByRole("tab", { name: "Evidence" }));
    expect(screen.getByText("bc2e1ef")).toHaveAccessibleDescription(/bc2e1efb60c7391b2d4b0978cf7c4b1105ef7444/);
    expect(screen.queryByText("0000000")).not.toBeInTheDocument();
  });

  it("allows only HTTPS and validated document links in Markdown", async () => {
    const user = userEvent.setup();
    render(<FullDetailModal open {...modalProps} />);

    await user.click(screen.getByRole("tab", { name: "Documents" }));
    expect(screen.getByRole("link", { name: "approved design" })).toHaveAttribute("href", "docs/design.md");
    expect(screen.getByRole("link", { name: "safe site" })).toHaveAttribute("rel", "noreferrer noopener");
    expect(screen.queryByRole("link", { name: "unsafe file" })).not.toBeInTheDocument();
    expect(screen.queryByText("ignored")).not.toBeInTheDocument();
  });

  it("keeps tab focus, selection, and panel content synchronized for ARIA keyboard navigation", async () => {
    const user = userEvent.setup();
    render(<FullDetailModal open {...modalProps} />);

    const overview = screen.getByRole("tab", { name: "Overview" });
    const workTab = screen.getByRole("tab", { name: "Work" });
    const documentsTab = screen.getByRole("tab", { name: "Documents" });
    const evidenceTab = screen.getByRole("tab", { name: "Evidence" });
    expect(overview).toHaveFocus();

    await user.keyboard("{ArrowRight}");
    expect(workTab).toHaveFocus();
    expect(workTab).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toContainElement(screen.getByText("CORE_ROUTE pilot"));

    await user.keyboard("{ArrowRight}");
    expect(documentsTab).toHaveFocus();
    expect(documentsTab).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toContainElement(screen.getByText("Architecture and GUI Design"));

    await user.keyboard("{End}");
    expect(evidenceTab).toHaveFocus();
    expect(evidenceTab).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toContainElement(screen.getByText("bc2e1ef"));

    await user.keyboard("{ArrowRight}");
    expect(overview).toHaveFocus();
    expect(overview).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveTextContent(node.summary);

    await user.keyboard("{ArrowLeft}");
    expect(evidenceTab).toHaveFocus();
    expect(evidenceTab).toHaveAttribute("aria-selected", "true");

    await user.keyboard("{Home}");
    expect(overview).toHaveFocus();
    expect(overview).toHaveAttribute("aria-selected", "true");
  });

  it("resets to and focuses Overview when reopened after closing another tab", async () => {
    const user = userEvent.setup();
    render(<StrictMode><ModalHarness /></StrictMode>);

    await user.click(screen.getByRole("tab", { name: "Documents" }));
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Open details" }));
    const overview = screen.getByRole("tab", { name: "Overview" });
    expect(overview).toHaveFocus();
    expect(overview).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveTextContent(node.summary);
  });

  it("traps focus, locks scroll, and closes on Escape", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<FullDetailModal open {...modalProps} onClose={onClose} />);

    expect(document.body).toHaveClass("modal-open");
    await user.tab({ shift: true });
    expect(screen.getByRole("dialog")).toContainElement(document.activeElement as HTMLElement);
    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledOnce();
    expect(document.body).not.toHaveClass("modal-open");
  });

  it("closes from the close button", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<FullDetailModal open {...modalProps} onClose={onClose} />);

    await user.click(screen.getByRole("button", { name: "Close details" }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("closes when the dialog backdrop is clicked", () => {
    const onClose = vi.fn();
    render(<FullDetailModal open {...modalProps} onClose={onClose} />);

    fireEvent.click(screen.getByRole("dialog"));
    expect(onClose).toHaveBeenCalledOnce();
  });
});

function ModalHarness() {
  const [open, setOpen] = useState(true);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>Open details</button>
      <FullDetailModal open={open} {...modalProps} onClose={() => setOpen(false)} />
    </>
  );
}

function makeDocument(
  id: string,
  title: string,
  lifecycle: IndexDocument["lifecycle"],
  role: IndexDocument["role"],
  content: string,
): IndexDocument {
  return {
    kind: "document",
    id,
    title,
    path: `docs/${id}.md`,
    nodeIds: [node.id],
    role,
    authority: "Project Control",
    lifecycle,
    repositoryRefs: [],
    content,
  };
}
