import { useEffect, useState } from "react";
import type { ProjectReadModel } from "../../src/model/types.js";
import { ControlRoom } from "./components/ControlRoom.js";
import { DiagnosticView } from "./components/DiagnosticView.js";
import { FullDetailModal } from "./components/FullDetailModal.js";
import { loadProjectState, type ProjectState } from "./data/loadProjectState.js";
import { nodePathDiagnostic, nodeUrl, readNodeId, resolveNodePath } from "./navigation/nodeRoute.js";

export interface AppProps {
  initialModel?: ProjectReadModel;
}

type ShellState = { kind: "loading" } | ProjectState;

export function App({ initialModel }: AppProps) {
  const [state, setState] = useState<ShellState>(() => (
    initialModel === undefined
      ? { kind: "loading" }
      : { kind: "ready", model: initialModel }
  ));

  useEffect(() => {
    if (initialModel !== undefined) {
      return;
    }

    void loadProjectState().then(setState);
  }, [initialModel]);

  if (state.kind === "loading") {
    return <main><p>Loading project data…</p></main>;
  }

  if (state.kind === "diagnostic") {
    return <DiagnosticView diagnostics={state.diagnostics} />;
  }

  return <ProjectMap model={state.model} />;
}

function ProjectMap({ model }: { model: ProjectReadModel }) {
  const [currentNodeId, setCurrentNodeId] = useState(() => resolveCurrentNode(model).nodeId);
  const [routeDiagnostic, setRouteDiagnostic] = useState(() => resolveCurrentNode(model).diagnostic);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    function syncFromLocation() {
      const resolved = resolveCurrentNode(model);
      setCurrentNodeId(resolved.nodeId);
      if (resolved.diagnostic !== null && resolved.canonicalUrl !== null) {
        setRouteDiagnostic(resolved.diagnostic);
        history.replaceState(
          routeDiagnosticState(resolved.nodeId, resolved.diagnostic),
          "",
          resolved.canonicalUrl,
        );
        return;
      }

      setRouteDiagnostic(diagnosticFromHistory(resolved.nodeId));
    }

    syncFromLocation();
    addEventListener("popstate", syncFromLocation);
    return () => removeEventListener("popstate", syncFromLocation);
  }, [model]);

  if (currentNodeId === null) {
    return <main><p role="alert">The project map has no usable root node.</p></main>;
  }

  const currentNode = model.nodes.find((node) => node.id === currentNodeId);
  if (currentNode === undefined) {
    return <main><p role="alert">The selected node is unavailable.</p></main>;
  }

  const selectedWork = recordsForIds(currentNode.workIds, model.work);
  const selectedDocuments = recordsForIds(currentNode.documentIds, model.documents);

  function navigate(nodeId: string) {
    if (nodePathDiagnostic(model, nodeId) !== null) {
      return;
    }

    setCurrentNodeId(nodeId);
    setRouteDiagnostic(null);
    if (currentNodeId !== null && diagnosticFromHistory(currentNodeId) !== null) {
      history.replaceState(null, "", nodeUrl(currentNodeId));
    }
    history.pushState(null, "", nodeUrl(nodeId));
  }

  return (
    <main className="project-map">
      {routeDiagnostic === null ? null : <p role="alert">{routeDiagnostic}</p>}
      <ControlRoom
        model={model}
        currentNodeId={currentNodeId}
        onNavigate={navigate}
        onOpenDetails={() => setDetailsOpen(true)}
      />
      <FullDetailModal
        open={detailsOpen}
        node={currentNode}
        work={selectedWork}
        documents={selectedDocuments}
        evidence={model.evidence}
        repositories={model.repositories}
        onClose={() => setDetailsOpen(false)}
      />
    </main>
  );
}

function recordsForIds<T extends { id: string }>(ids: string[], records: T[]): T[] {
  const recordsById = new Map(records.map((record) => [record.id, record]));
  return ids.flatMap((id) => {
    const record = recordsById.get(id);
    return record === undefined ? [] : [record];
  });
}

interface RouteDiagnosticState {
  flowdocRouteDiagnostic: {
    nodeId: string;
    diagnostic: string;
  };
}

function routeDiagnosticState(nodeId: string | null, diagnostic: string): RouteDiagnosticState {
  return {
    flowdocRouteDiagnostic: {
      nodeId: nodeId ?? "",
      diagnostic,
    },
  };
}

function diagnosticFromHistory(nodeId: string | null): string | null {
  const state = history.state;
  if (!isRouteDiagnosticState(state) || state.flowdocRouteDiagnostic.nodeId !== nodeId) {
    return null;
  }

  return state.flowdocRouteDiagnostic.diagnostic;
}

function isRouteDiagnosticState(value: unknown): value is RouteDiagnosticState {
  if (typeof value !== "object" || value === null || !("flowdocRouteDiagnostic" in value)) {
    return false;
  }

  const diagnostic = value.flowdocRouteDiagnostic;
  return typeof diagnostic === "object"
    && diagnostic !== null
    && "nodeId" in diagnostic
    && "diagnostic" in diagnostic
    && typeof diagnostic.nodeId === "string"
    && typeof diagnostic.diagnostic === "string";
}

function resolveCurrentNode(
  model: ProjectReadModel,
): { nodeId: string | null; diagnostic: string | null; canonicalUrl: string | null } {
  const rootNodeId = model.rootNodeIds.find((nodeId) => resolveNodePath(model, nodeId).length > 0);
  if (rootNodeId === undefined) {
    return {
      nodeId: null,
      diagnostic: "The project map has no usable root node.",
      canonicalUrl: null,
    };
  }

  const requestedNodeId = readNodeId(window.location);
  if (requestedNodeId === null) {
    return { nodeId: rootNodeId, diagnostic: null, canonicalUrl: nodeUrl(rootNodeId) };
  }

  const diagnostic = nodePathDiagnostic(model, requestedNodeId);
  return diagnostic === null
    ? { nodeId: requestedNodeId, diagnostic: null, canonicalUrl: null }
    : { nodeId: rootNodeId, diagnostic, canonicalUrl: nodeUrl(rootNodeId) };
}
