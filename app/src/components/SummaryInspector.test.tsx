import type { ComponentProps } from "react";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { IndexDocument, IndexNode, WorkRecord } from "../../../src/model/types.js";
import { SummaryInspector } from "./SummaryInspector.js";

const longMarkdownParagraph = "# Heading\n\nThis Markdown must never become inspector content.";
const node: IndexNode = {
  kind: "node",
  id: "project-control",
  title: "Project Control",
  parentId: null,
  summary: "A concise project-control summary that is available in full to assistive technology.",
  truthState: "planned",
  order: 0,
  documentIds: ["decision", "risk", "retired"],
  evidenceIds: [],
  repositoryIds: [],
  childIds: ["core", "editor", "backend", "docs"],
  workIds: ["queued", "review", "blocked"],
};

const work: WorkRecord[] = [
  workItem("queued", "queued", "Second queued detail"),
  workItem("review", "in-review", "Review detail"),
  workItem("blocked", "blocked", "Blocked issue"),
];

const documents: IndexDocument[] = [
  document("retired", "risk", "retired", "Retired risk"),
  document("risk", "risk", "active", "Risk document issue"),
  document("decision", "decision", "active", longMarkdownParagraph),
];

function renderInspector(overrides: Partial<ComponentProps<typeof SummaryInspector>> = {}) {
  const onOpenDetails = vi.fn();
  const props = {
    node,
    childCount: 4,
    work,
    documents,
    onOpenDetails,
    ...overrides,
  };

  return { onOpenDetails, ...render(<SummaryInspector {...props} />) };
}

describe("SummaryInspector", () => {
  it("keeps queue and documents as separate summaries", () => {
    renderInspector();

    expect(screen.getByText("Work queue").nextSibling).toHaveTextContent("3");
    expect(screen.getByText("Documents").nextSibling).toHaveTextContent("2");
    expect(screen.queryByRole("list", { name: "All work" })).not.toBeInTheDocument();
    expect(screen.queryByText(longMarkdownParagraph)).not.toBeInTheDocument();
  });

  it("counts only active documents in the compact inspector", () => {
    renderInspector({
      documents: [
        document("active", "current-state", "active", "Active document body"),
        document("superseded", "current-state", "superseded", "Superseded document body"),
        document("retired", "current-state", "retired", "Retired document body"),
      ],
    });

    expect(screen.getByText("Documents").nextSibling).toHaveTextContent("1");
  });

  it("shows only the highest-priority blocker and invokes View all", async () => {
    const user = userEvent.setup();
    const { onOpenDetails } = renderInspector();

    expect(screen.getByText("Blocked")).toBeVisible();
    expect(screen.getByText("Blocked issue")).toBeVisible();
    expect(screen.queryByText("Second queued detail")).not.toBeInTheDocument();
    expect(screen.getByTestId("node-summary")).toHaveClass("summary-clamp");
    expect(screen.getByTestId("node-summary")).toHaveAttribute("title", node.summary);
    expect(screen.getByText("Child nodes").nextSibling).toHaveTextContent("4");
    await user.click(screen.getByRole("button", { name: "View all" }));
    expect(onOpenDetails).toHaveBeenCalledOnce();
  });

  it("uses the work priority independently from the node truth state", () => {
    renderInspector({
      node: { ...node, truthState: "unknown" },
      work: [workItem("queued", "queued", "Queued detail"), workItem("review", "in-review", "Review detail")],
    });

    expect(screen.getByText("Unknown")).toBeVisible();
    expect(screen.getByText("In review")).toBeVisible();
  });

  it("uses the first active risk document by ID when no work is blocked", () => {
    renderInspector({
      work: [workItem("queued", "queued", "Queued detail")],
      documents: [
        document("z-risk", "risk", "active", "Later risk"),
        document("a-risk", "risk", "active", "First risk"),
        document("unknown", "unknown", "active", "Unknown detail"),
      ],
    });

    expect(screen.getByText("a-risk title")).toBeVisible();
    expect(screen.queryByText("z-risk title")).not.toBeInTheDocument();
    expect(screen.queryByText("unknown title")).not.toBeInTheDocument();
  });

  it("uses an unknown document only when no active risk document exists", () => {
    renderInspector({
      work: [workItem("queued", "queued", "Queued detail")],
      documents: [document("unknown", "unknown", "active", "Unknown detail")],
    });

    expect(screen.getByText("unknown title")).toBeVisible();
  });
});

function workItem(id: string, workState: WorkRecord["workState"], summary: string): WorkRecord {
  return {
    kind: "work",
    id,
    title: `${id} title`,
    nodeId: node.id,
    repositoryIds: [],
    workState,
    summary,
    requiredEvidence: [],
    createdAt: "2026-08-12T00:00:00.000Z",
    updatedAt: "2026-08-12T00:00:00.000Z",
  };
}

function document(
  id: string,
  role: IndexDocument["role"],
  lifecycle: IndexDocument["lifecycle"],
  content: string,
): IndexDocument {
  return {
    kind: "document",
    id,
    title: `${id} title`,
    path: `docs/${id}.md`,
    nodeIds: [node.id],
    role,
    authority: "test",
    lifecycle,
    repositoryRefs: [],
    content,
  };
}
