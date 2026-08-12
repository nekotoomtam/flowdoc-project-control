import { useEffect, useState } from "react";
import type { ProjectReadModel } from "../../src/model/types.js";
import { DiagnosticView } from "./components/DiagnosticView.js";
import { loadProjectState, type ProjectState } from "./data/loadProjectState.js";

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

  return (
    <main>
      <section aria-label="Focus Stack Map" data-testid="focus-stack-map">
        <h1>Focus Stack Map</h1>
        <p>Project map data is ready.</p>
      </section>
    </main>
  );
}
