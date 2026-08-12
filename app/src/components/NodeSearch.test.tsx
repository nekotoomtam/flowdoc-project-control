import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { IndexNode } from "../../../src/model/types.js";
import { NodeSearch } from "./NodeSearch.js";

const nodes: IndexNode[] = Array.from({ length: 10 }, (_, index) => ({
  kind: "node",
  id: `project-control-${index}`,
  title: index === 0 ? "Project Control" : `Project Control ${index}`,
  parentId: null,
  summary: "Test node.",
  truthState: "planned",
  order: index,
  documentIds: [],
  evidenceIds: [],
  repositoryIds: [],
  childIds: [],
  workIds: [],
}));

describe("NodeSearch", () => {
  it("searches by title and navigates through the shared callback", async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();
    render(<NodeSearch nodes={nodes} onNavigate={onNavigate} />);

    await user.type(screen.getByRole("searchbox"), "project con");
    await user.click(screen.getByRole("option", { name: "Project Control" }));

    expect(onNavigate).toHaveBeenCalledWith("project-control-0");
  });

  it("normalizes title and ID matches, caps results at eight, and clears after selection", async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();
    render(<NodeSearch nodes={nodes} onNavigate={onNavigate} />);
    const searchbox = screen.getByRole("searchbox");

    await user.type(searchbox, "  PROJECT-control  ");
    expect(screen.getAllByRole("option")).toHaveLength(8);
    await user.keyboard("{ArrowDown}{Enter}");

    expect(onNavigate).toHaveBeenCalledWith("project-control-0");
    expect(searchbox).toHaveValue("");
    expect(screen.queryByRole("option")).not.toBeInTheDocument();
  });
});
