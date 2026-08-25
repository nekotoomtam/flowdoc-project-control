import { StrictMode } from "react";
import { render, screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { IndexNode, WorkRecord } from "../../src/model/types.js";
import { App } from "./App.js";
import { DiagnosticView } from "./components/DiagnosticView.js";
import { loadProjectState } from "./data/loadProjectState.js";
import { makeProjectReadModel } from "./test/projectModel.js";

const model = makeProjectReadModel();

describe("App", () => {
  it("shows a diagnostic instead of a partial map when the index is invalid", async () => {
    vi.stubGlobal("fetch", vi.fn()
      .mockResolvedValueOnce({ ok: false, status: 404 })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ schemaVersion: 99 }),
      }));

    render(<App />);

    expect(await screen.findByRole("heading", { name: "Project data needs attention" }))
      .toBeVisible();
    expect(screen.queryByRole("heading", { name: "FlowDoc control room" })).not.toBeInTheDocument();
  });

  it("reports a network failure without rendering the map", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));

    render(<App />);

    expect(await screen.findByText(/Could not load project data/)).toBeVisible();
    expect(screen.queryByRole("heading", { name: "FlowDoc control room" })).not.toBeInTheDocument();
  });

  it("prefers source diagnostics and does not fetch the retained old index", async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        schemaVersion: 1,
        diagnostics: [{
          code: "NODE_CYCLE",
          message: "cycle",
          file: "data/nodes/a.json",
          hint: "Break the cycle.",
        }],
      }),
    });

    await expect(loadProjectState(fetcher)).resolves.toMatchObject({ kind: "diagnostic" });
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it("classifies malformed received diagnostics as invalid without fetching the index", async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => {
        throw new SyntaxError("Unexpected token");
      },
    });

    await expect(loadProjectState(fetcher)).resolves.toMatchObject({
      kind: "diagnostic",
      diagnostics: [expect.objectContaining({ code: "PROJECT_DIAGNOSTICS_INVALID" })],
    });
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it("classifies an empty received diagnostics body as invalid without fetching the index", async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => {
        throw new SyntaxError("Unexpected end of JSON input");
      },
    });

    await expect(loadProjectState(fetcher)).resolves.toMatchObject({
      kind: "diagnostic",
      diagnostics: [expect.objectContaining({ code: "PROJECT_DIAGNOSTICS_INVALID" })],
    });
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it("reports a non-404 diagnostics response as unavailable without fetching the index", async () => {
    const fetcher = vi.fn().mockResolvedValue({ ok: false, status: 500 });

    await expect(loadProjectState(fetcher)).resolves.toMatchObject({
      kind: "diagnostic",
      diagnostics: [expect.objectContaining({ code: "PROJECT_DATA_UNAVAILABLE" })],
    });
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it("loads the index after a valid empty diagnostics response", async () => {
    const fetcher = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ schemaVersion: 1, diagnostics: [] }),
      })
      .mockResolvedValueOnce({ ok: true, status: 200, json: async () => model });

    await expect(loadProjectState(fetcher)).resolves.toEqual({ kind: "ready", model });
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it("loads the valid index after diagnostics return 404", async () => {
    const fetcher = vi.fn()
      .mockResolvedValueOnce({ ok: false, status: 404 })
      .mockResolvedValueOnce({ ok: true, status: 200, json: async () => model });

    await expect(loadProjectState(fetcher)).resolves.toEqual({ kind: "ready", model });
  });

  it("rejects an index with duplicate node IDs", async () => {
    const duplicateNodeModel = makeProjectReadModel({
      nodes: [model.nodes[0]!, { ...model.nodes[0]! }],
    });
    const fetcher = vi.fn()
      .mockResolvedValueOnce({ ok: false, status: 404 })
      .mockResolvedValueOnce({ ok: true, status: 200, json: async () => duplicateNodeModel });

    await expect(loadProjectState(fetcher)).resolves.toMatchObject({
      kind: "diagnostic",
      diagnostics: [expect.objectContaining({ code: "PROJECT_INDEX_INVALID" })],
    });
  });

  it("rejects an index whose root node ID does not exist", async () => {
    const missingRootModel = makeProjectReadModel({ rootNodeIds: ["missing"] });
    const fetcher = vi.fn()
      .mockResolvedValueOnce({ ok: false, status: 404 })
      .mockResolvedValueOnce({ ok: true, status: 200, json: async () => missingRootModel });

    await expect(loadProjectState(fetcher)).resolves.toMatchObject({
      kind: "diagnostic",
      diagnostics: [expect.objectContaining({ code: "PROJECT_INDEX_INVALID" })],
    });
  });

  it("rejects an index with an incomplete node instead of rendering a partial map", async () => {
    const incompleteNodeModel = {
      ...model,
      nodes: [{ id: "flowdoc" }],
    };
    const fetcher = vi.fn()
      .mockResolvedValueOnce({ ok: false, status: 404 })
      .mockResolvedValueOnce({ ok: true, status: 200, json: async () => incompleteNodeModel });

    await expect(loadProjectState(fetcher)).resolves.toMatchObject({
      kind: "diagnostic",
      diagnostics: [expect.objectContaining({ code: "PROJECT_INDEX_INVALID" })],
    });
  });

  it("renders the shell from a valid injected read model", () => {
    render(<App initialModel={model} />);

    expect(screen.getByRole("heading", { name: "FlowDoc control room" })).toBeVisible();
    expect(screen.getByRole("searchbox", { name: "Search Nodes" })).toBeVisible();
    expect(screen.getByRole("navigation", { name: "System tree" })).toBeVisible();
    expect(screen.getByRole("region", { name: "Work tree" })).toBeVisible();
  });

  it("routes node search selections through the shared control room navigation", async () => {
    const user = userEvent.setup();
    const routeModel = makeProjectReadModel({
      rootNodeIds: ["flowdoc"],
      nodes: [
        appNode("flowdoc", "FlowDoc", null, ["project-control"], []),
        appNode("project-control", "Project Control", "flowdoc", [], []),
      ],
    });

    history.replaceState(null, "", "/?node=flowdoc");
    render(<App initialModel={routeModel} />);

    await user.type(screen.getByRole("searchbox", { name: "Search Nodes" }), "project con");
    await user.click(screen.getByRole("option", { name: "Project Control" }));

    expect(window.location.search).toBe("?node=project-control");
    expect(screen.getByRole("button", { name: /Project Control, selected branch/ })).toBeVisible();
  });

  it("presents a control-room work tree for the selected system branch", async () => {
    const user = userEvent.setup();
    const flowdocNode = appNode("flowdoc", "FlowDoc", null, ["core", "editor"], []);
    const coreNode = appNode("core", "Core", "flowdoc", [], ["core-docs"]);
    const editorNode = appNode("editor", "Editor", "flowdoc", [], ["editor-polish"]);
    const controlModel = makeProjectReadModel({
      rootNodeIds: ["flowdoc"],
      nodes: [flowdocNode, coreNode, editorNode],
      work: [
        appWork("core-docs", "Core Documentation Closure", "core", "blocked", "Core docs need final evidence."),
        appWork("editor-polish", "Editor Polish", "editor", "in-progress", "Editor shell is being refined."),
      ],
    });

    history.replaceState(null, "", "/?node=flowdoc");
    render(<App initialModel={controlModel} />);

    expect(screen.getByRole("heading", { name: "FlowDoc control room" })).toBeVisible();
    const status = screen.getByRole("region", { name: "Overall work status" });
    expect(status).toHaveTextContent("Blocked1");
    expect(status).toHaveTextContent("In progress1");

    const systemTree = screen.getByRole("navigation", { name: "System tree" });
    expect(within(systemTree).getByRole("button", { name: /FlowDoc, selected branch/ })).toBeVisible();
    const workTree = screen.getByRole("region", { name: "Work tree" });
    expect(within(workTree).getByText("Core Documentation Closure")).toBeVisible();
    expect(within(workTree).getByText("Editor Polish")).toBeVisible();
    const coreChecklist = within(workTree).getByRole("list", { name: "Core Documentation Closure checklist" });
    expect(within(coreChecklist).getByText("Ready")).toBeVisible();
    expect(within(coreChecklist).getAllByText("Review")).toHaveLength(2);
    expect(within(coreChecklist).getByText("Repository link needed")).toBeVisible();
    expect(within(coreChecklist).getByText("Evidence requirement needed")).toBeVisible();
    expect(within(coreChecklist).queryByText("OK")).not.toBeInTheDocument();
    expect(within(coreChecklist).queryByText("!")).not.toBeInTheDocument();

    await user.click(within(systemTree).getByRole("button", { name: /Core/ }));

    expect(within(screen.getByRole("complementary", { name: "Control detail" })).getByRole("heading", { name: "Core" }))
      .toBeVisible();
    const filteredWorkTree = screen.getByRole("region", { name: "Work tree" });
    expect(within(filteredWorkTree).getByText("Core Documentation Closure")).toBeVisible();
    expect(within(filteredWorkTree).queryByText("Editor Polish")).not.toBeInTheDocument();
  });

  it("opens details without changing the selected node and restores focus on close", async () => {
    const user = userEvent.setup();
    const detailModel = makeProjectReadModel({
      nodes: [{ ...model.nodes[0]!, id: "project-control", title: "Project Control" }],
      rootNodeIds: ["project-control"],
    });
    history.replaceState(null, "", "/?node=project-control");
    render(<App initialModel={detailModel} />);

    const trigger = screen.getByRole("button", { name: "View all" });
    await user.click(trigger);
    expect(screen.getByRole("dialog", { name: "Project Control details" })).toBeVisible();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
    expect(window.location.search).toBe("?node=project-control");
  });

  it("falls back honestly from an unknown URL and follows popstate", async () => {
    const routeModel = makeProjectReadModel({
      nodes: [
        { ...model.nodes[0]!, childIds: ["project-control"] },
        {
          ...model.nodes[0]!,
          id: "project-control",
          title: "Project Control",
          parentId: "flowdoc",
          childIds: [],
        },
      ],
    });
    history.replaceState(null, "", "/?node=missing");
    render(<App initialModel={routeModel} />);

    expect(screen.getByText(/Node “missing” was not found/)).toBeVisible();
    expect(screen.getByRole("button", { name: /Flowdoc, selected branch/ })).toBeVisible();

    history.pushState(null, "", "/?node=project-control");
    dispatchEvent(new PopStateEvent("popstate"));

    expect(await screen.findByRole("button", { name: /Project Control, selected branch/ })).toBeVisible();
  });

  it("replaces an invalid deep-link with the canonical root URL while retaining the diagnostic", async () => {
    history.replaceState(null, "", "/?node=missing");
    const replaceState = vi.spyOn(history, "replaceState");
    render(<App initialModel={model} />);

    expect(await screen.findByText(/Node “missing” was not found/)).toBeVisible();
    expect(replaceState).toHaveBeenCalledWith(
      expect.objectContaining({
        flowdocRouteDiagnostic: expect.objectContaining({ nodeId: "flowdoc" }),
      }),
      "",
      "?node=flowdoc",
    );
    expect(window.location.search).toBe("?node=flowdoc");
  });

  it("retains an invalid-route diagnostic through StrictMode canonical replacement", async () => {
    history.replaceState(null, "", "/?node=missing");
    render(<StrictMode><App initialModel={model} /></StrictMode>);

    expect(await screen.findByText(/Node “missing” was not found/)).toBeVisible();
    expect(window.location.search).toBe("?node=flowdoc");
  });

  it("reports no usable root when the declared fallback root has an invalid ancestry", async () => {
    const unusableRootModel = makeProjectReadModel({
      nodes: [{ ...model.nodes[0]!, parentId: "missing-parent" }],
    });
    history.replaceState(null, "", "/?node=missing");
    render(<App initialModel={unusableRootModel} />);

    expect(await screen.findByText("The project map has no usable root node.")).toBeVisible();
    expect(screen.queryByRole("heading", { name: "FlowDoc control room" })).not.toBeInTheDocument();
  });

  it("pushes user navigation into history without pushing browser history changes again", async () => {
    const routeModel = makeProjectReadModel({
      nodes: [
        { ...model.nodes[0]!, childIds: ["project-control"] },
        {
          ...model.nodes[0]!,
          id: "project-control",
          title: "Project Control",
          parentId: "flowdoc",
          childIds: [],
        },
      ],
    });
    history.replaceState(null, "", "/?node=missing");
    const pushState = vi.spyOn(history, "pushState");
    const user = (await import("@testing-library/user-event")).userEvent.setup();
    render(<App initialModel={routeModel} />);

    expect(await screen.findByText(/Node “missing” was not found/)).toBeVisible();
    await user.click(screen.getByRole("button", { name: /Project Control, system node/ }));
    expect(pushState).toHaveBeenCalledWith(null, "", "?node=project-control");
    expect(screen.queryByText(/Node “missing” was not found/)).not.toBeInTheDocument();

    pushState.mockClear();
    history.pushState(null, "", "/?node=flowdoc");
    pushState.mockClear();
    dispatchEvent(new PopStateEvent("popstate"));
    expect(pushState).not.toHaveBeenCalled();
  });

  it("keeps the generate and data-check command visible for source diagnostics", () => {
    render(<DiagnosticView diagnostics={[{
      code: "NODE_CYCLE",
      message: "cycle",
      file: "data/nodes/a.json",
      recordId: "node-a",
      hint: "Break the cycle.",
    }]} />);

    expect(screen.getByText("Run npm run generate, then npm run check:data.")).toBeVisible();
  });
});

function appNode(
  id: string,
  title: string,
  parentId: string | null,
  childIds: string[],
  workIds: string[],
): IndexNode {
  return {
    kind: "node",
    id,
    title,
    parentId,
    summary: `${title} summary.`,
    truthState: id === "flowdoc" ? "planned" : "current",
    order: id === "flowdoc" ? 0 : id === "core" ? 1 : 2,
    documentIds: [],
    evidenceIds: [],
    repositoryIds: [],
    childIds,
    workIds,
  };
}

function appWork(
  id: string,
  title: string,
  nodeId: string,
  workState: WorkRecord["workState"],
  summary: string,
): WorkRecord {
  return {
    kind: "work",
    id,
    title,
    nodeId,
    repositoryIds: [],
    workState,
    summary,
    requiredEvidence: [],
    createdAt: "2026-08-24T00:00:00.000Z",
    updatedAt: "2026-08-24T00:00:00.000Z",
  };
}
