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
