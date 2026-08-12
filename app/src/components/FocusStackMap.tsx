import type { IndexNode, ProjectReadModel } from "../../../src/model/types.js";
import { resolveNodePath } from "../navigation/nodeRoute.js";
import "../styles/map.css";

interface FocusStackMapProps {
  model: ProjectReadModel;
  currentNodeId: string;
  onNavigate: (nodeId: string) => void;
}

export function FocusStackMap({ model, currentNodeId, onNavigate }: FocusStackMapProps) {
  const path = resolveNodePath(model, currentNodeId);
  const currentNode = path.at(-1);

  if (currentNode === undefined) {
    return <section aria-label="Focus Stack Map" data-testid="focus-stack-map"><p role="alert">The focus path is unavailable.</p></section>;
  }

  const ancestors = path.slice(0, -1);
  const children = childrenOf(model, currentNode);

  return (
    <section className="focus-stack-map" aria-label="Focus Stack Map" data-testid="focus-stack-map">
      <h1>Focus Stack Map</h1>
      <section aria-label="Ancestors">
        <h2>Ancestors</h2>
        <ol className="focus-stack-map__nodes">
          {ancestors.map((node) => (
            <li key={node.id}>
              <button type="button" aria-label={`${node.title}, Ancestor`} onClick={() => onNavigate(node.id)}>
                {node.title}
              </button>
            </li>
          ))}
        </ol>
      </section>
      <Connector />
      <section aria-label="Current node">
        <h2>Current</h2>
        <button type="button" className="focus-stack-map__current" aria-label={`${currentNode.title}, Current`}>
          {currentNode.title}
        </button>
      </section>
      <Connector />
      <section aria-label="Children">
        <h2>Children</h2>
        <ul className="focus-stack-map__nodes">
          {children.map((node) => (
            <li key={node.id}>
              <button type="button" data-testid="child-node" onClick={() => onNavigate(node.id)}>{node.title}</button>
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
}

function childrenOf(model: ProjectReadModel, currentNode: IndexNode): IndexNode[] {
  const nodesById = new Map(model.nodes.map((node) => [node.id, node]));
  return currentNode.childIds
    .map((childId) => nodesById.get(childId))
    .filter((node): node is IndexNode => node !== undefined && node.parentId === currentNode.id)
    .sort((left, right) => left.order - right.order || compareIds(left.id, right.id));
}

function compareIds(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function Connector() {
  return (
    <svg className="focus-stack-map__connector" viewBox="0 0 1 24" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <line x1="0.5" x2="0.5" y1="0" y2="24" />
    </svg>
  );
}
