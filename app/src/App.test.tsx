import { StrictMode } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
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
    expect(screen.queryByTestId("focus-stack-map")).not.toBeInTheDocument();
  });

  it("reports a network failure without rendering the map", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));

    render(<App />);

    expect(await screen.findByText(/Could not load project data/)).toBeVisible();
    expect(screen.queryByTestId("focus-stack-map")).not.toBeInTheDocument();
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

  it("renders the shell from a valid injected read model", () => {
    render(<App initialModel={model} />);

    expect(screen.getByTestId("focus-stack-map")).toBeVisible();
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
    expect(screen.getByRole("button", { name: /Flowdoc, Current/ })).toBeVisible();

    history.pushState(null, "", "/?node=project-control");
    dispatchEvent(new PopStateEvent("popstate"));

    expect(await screen.findByRole("button", { name: /Project Control, Current/ })).toBeVisible();
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
    expect(screen.queryByTestId("focus-stack-map")).not.toBeInTheDocument();
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
    await user.click(screen.getByRole("button", { name: "Project Control" }));
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
