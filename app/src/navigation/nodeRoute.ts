import type { IndexNode, ProjectReadModel } from "../../../src/model/types.js";

export function readNodeId(location: Location): string | null {
  const nodeId = new URLSearchParams(location.search).get("node");
  return nodeId === null || nodeId === "" ? null : nodeId;
}

export function nodeUrl(id: string): string {
  return `?${new URLSearchParams({ node: id }).toString()}`;
}

export function resolveNodePath(model: ProjectReadModel, nodeId: string): IndexNode[] {
  const nodesById = new Map(model.nodes.map((node) => [node.id, node]));
  const path: IndexNode[] = [];
  const visited = new Set<string>();
  let currentNode = nodesById.get(nodeId);

  while (currentNode !== undefined) {
    if (visited.has(currentNode.id)) {
      return [];
    }

    visited.add(currentNode.id);
    path.unshift(currentNode);

    if (currentNode.parentId === null) {
      return path;
    }

    currentNode = nodesById.get(currentNode.parentId);
  }

  return [];
}

export function nodePathDiagnostic(model: ProjectReadModel, nodeId: string): string | null {
  if (!model.nodes.some((node) => node.id === nodeId)) {
    return `Node “${nodeId}” was not found. Showing the project root instead.`;
  }

  if (resolveNodePath(model, nodeId).length === 0) {
    return `Node “${nodeId}” has an invalid ancestor path. Showing the project root instead.`;
  }

  return null;
}
