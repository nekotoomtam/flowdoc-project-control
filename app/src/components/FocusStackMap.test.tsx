import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { ProjectReadModel } from "../../../src/model/types.js";
import { FocusStackMap } from "./FocusStackMap.js";

const model: ProjectReadModel = {
  schemaVersion: 1,
  sourceDigest: "test-digest",
  rootNodeIds: ["flowdoc"],
  nodes: [
    node("flowdoc", "FlowDoc", null, 0, ["editor", "project-control", "backend", "core"]),
    node("project-control", "Project Control", "flowdoc", 4, []),
    node("editor", "Editor", "flowdoc", 3, []),
    node("core", "Core", "flowdoc", 2, []),
    node("backend", "Backend", "flowdoc", 1, []),
  ],
  work: [],
  phases: [],
  checklists: [],
  documents: [],
  repositories: [],
  evidence: [],
};

function node(
  id: string,
  title: string,
  parentId: string | null,
  order: number,
  childIds: string[],
) {
  return {
    kind: "node" as const,
    id,
    title,
    parentId,
    summary: "Test node.",
    truthState: "planned" as const,
    order,
    documentIds: [],
    evidenceIds: [],
    repositoryIds: [],
    childIds,
    workIds: [],
  };
}

describe("FocusStackMap", () => {
  it("promotes a child and keeps all ancestors visible", async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();
    render(<FocusStackMap model={model} currentNodeId="flowdoc" onNavigate={onNavigate} />);

    await user.click(screen.getByRole("button", { name: "Project Control" }));

    expect(onNavigate).toHaveBeenCalledWith("project-control");
  });

  it("jumps to an ancestor and keeps children sorted", async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();
    const view = render(<FocusStackMap model={model} currentNodeId="project-control" onNavigate={onNavigate} />);

    await user.click(screen.getByRole("button", { name: /FlowDoc, Ancestor/ }));

    expect(onNavigate).toHaveBeenCalledWith("flowdoc");
    view.rerender(<FocusStackMap model={model} currentNodeId="flowdoc" onNavigate={onNavigate} />);
    expect(screen.getAllByTestId("child-node").map((node) => node.textContent))
      .toEqual(["Backend", "Core", "Editor", "Project Control"]);
  });

  it("uses keyboard-reachable buttons with explicit hierarchy labels and decorative connectors", async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();
    render(<FocusStackMap model={model} currentNodeId="project-control" onNavigate={onNavigate} />);

    await user.tab();
    expect(screen.getByRole("button", { name: /FlowDoc, Ancestor/ })).toHaveFocus();
    await user.keyboard("{Enter}");

    expect(onNavigate).toHaveBeenCalledWith("flowdoc");
    expect(screen.getByRole("button", { name: /Project Control, Current/ })).toBeVisible();
    expect(document.querySelectorAll("svg[aria-hidden='true']")).toHaveLength(2);
  });
});
