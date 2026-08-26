import { describe, expect, it } from "vitest";
import type { ProjectReadModel } from "../../../src/model/types.js";
import { nodeUrl, readNodeId, resolveNodePath } from "./nodeRoute.js";

const model: ProjectReadModel = {
  schemaVersion: 1,
  sourceDigest: "test-digest",
  rootNodeIds: ["flowdoc"],
  nodes: [
    node("flowdoc", "FlowDoc", null, 0, ["project-control"]),
    node("project-control", "Project Control", "flowdoc", 1, []),
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

describe("node routes", () => {
  it("resolves the complete ancestor path", () => {
    expect(resolveNodePath(model, "project-control").map((node) => node.id))
      .toEqual(["flowdoc", "project-control"]);
  });

  it("returns no path for an unknown node or a runtime parent cycle", () => {
    const cyclic = {
      ...model,
      nodes: [
        node("flowdoc", "FlowDoc", "project-control", 0, ["project-control"]),
        node("project-control", "Project Control", "flowdoc", 1, ["flowdoc"]),
      ],
    };

    expect(resolveNodePath(model, "missing")).toEqual([]);
    expect(resolveNodePath(cyclic, "project-control")).toEqual([]);
  });

  it("reads and creates an encoded node query URL", () => {
    expect(readNodeId({ search: "?node=project-control" } as Location)).toBe("project-control");
    expect(readNodeId({ search: "?other=value" } as Location)).toBeNull();
    expect(nodeUrl("project control/ไทย")).toBe("?node=project+control%2F%E0%B9%84%E0%B8%97%E0%B8%A2");
  });
});
