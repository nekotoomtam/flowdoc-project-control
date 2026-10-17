import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  ContextRoutingError,
  isEvidenceReusable,
  resolveCurrentDocument,
  selectDefaultContext,
} from "../src/model/context-routing.js";
import { packetDigest } from "../src/model/coordination-v3.js";
import type {
  DocumentRecord,
  EvidenceValidity,
  IndexDocument,
  WorkRecord,
} from "../src/model/types.js";
import { loadProjectSources } from "../tools/lib/load-sources.js";
import { validateProjectSemantics } from "../tools/lib/validate-semantics.js";
import { createCoordinationRegistryV3Fixture } from "./fixtures/coordination-registry-v3.js";
import { createProjectFixture } from "./fixtures/project-source.js";

function document(
  id: string,
  contextClass: "current" | "supporting" | "historical",
  overrides: Partial<IndexDocument> = {},
): IndexDocument {
  return {
    kind: "document",
    id,
    title: id,
    path: `docs/${id}.md`,
    nodeIds: [],
    role: "contract",
    authority: "Project Control",
    lifecycle: contextClass === "historical" ? "superseded" : "active",
    repositoryRefs: [],
    contextClass,
    content: `# ${id}\n`,
    ...overrides,
  };
}

function validity(overrides: Partial<EvidenceValidity> = {}): EvidenceValidity {
  return {
    claim: "The parser accepts one current contract.",
    repositoryId: "repo-project-control",
    pathScope: ["src/model/"],
    sourceRevision: "a".repeat(40),
    verificationMethod: "npm run test:records",
    freshnessTriggers: ["schema changes"],
    ...overrides,
  };
}

describe("context routing", () => {
  it("loads current packet references but excludes historical documents by default", () => {
    const documents = new Map<string, IndexDocument>([
      ["doc-current", document("doc-current", "current")],
      ["doc-supporting-explicitly-referenced", document("doc-supporting-explicitly-referenced", "supporting")],
      ["doc-historical", document("doc-historical", "historical")],
      ["doc-supporting-not-referenced", document("doc-supporting-not-referenced", "supporting")],
    ]);
    const work = {
      contextDocumentIds: ["doc-current", "doc-supporting-explicitly-referenced", "doc-historical"],
    } satisfies Pick<WorkRecord, "contextDocumentIds">;

    expect(selectDefaultContext(work, documents).map((item) => item.id))
      .toEqual(["doc-current", "doc-supporting-explicitly-referenced"]);
    expect(selectDefaultContext(work, documents, "audit").map((item) => item.id))
      .toEqual(["doc-current", "doc-supporting-explicitly-referenced", "doc-historical"]);
  });

  it("follows one reciprocal supersession chain to its active current successor", () => {
    const old = document("doc-old", "historical", { supersededBy: "doc-current" });
    const current = document("doc-current", "current", { supersedes: ["doc-old"] });
    expect(resolveCurrentDocument("doc-old", new Map([[old.id, old], [current.id, current]]))).toEqual(current);
  });

  it.each([
    ["missing successor", new Map([["doc-old", document("doc-old", "historical", { supersededBy: "missing" })]]), "DOCUMENT_SUCCESSOR_MISSING"],
    ["cycle", new Map([
      ["doc-a", document("doc-a", "historical", { supersededBy: "doc-b", supersedes: ["doc-b"] })],
      ["doc-b", document("doc-b", "historical", { supersededBy: "doc-a", supersedes: ["doc-a"] })],
    ]), "DOCUMENT_SUPERSESSION_CYCLE"],
  ])("rejects a %s while resolving authority", (_name, documents, code) => {
    expect(() => resolveCurrentDocument("doc-old" === [...documents.keys()][0] ? "doc-old" : "doc-a", documents))
      .toThrowError(expect.objectContaining({ code } satisfies Partial<ContextRoutingError>));
  });
});

describe("Evidence reuse", () => {
  it("reuses Evidence only while the complete validity boundary still matches", () => {
    expect(isEvidenceReusable(validity(), validity(), new Set())).toBe(true);
    expect(isEvidenceReusable(validity(), validity(), new Set(["schema changes"]))).toBe(false);
  });

  it.each(["claim", "pathScope", "sourceRevision", "verificationMethod", "freshnessTriggers"] as const)(
    "rejects evidence reuse when %s differs",
    (field) => {
      const mismatches: Record<typeof field, unknown> = {
        claim: "A different claim.",
        pathScope: ["app/"],
        sourceRevision: "b".repeat(40),
        verificationMethod: "manual inspection",
        freshnessTriggers: ["dependency changes"],
      };
      expect(isEvidenceReusable(validity(), validity({ [field]: mismatches[field] }), new Set())).toBe(false);
    },
  );
});

type SupersessionMode = "valid" | "missing" | "fork" | "cycle" | "active-historical" | "inactive-successor" | "historical-context" | "missing-context-class";

async function installSupersessionFixture(root: string, mode: SupersessionMode): Promise<void> {
  const documentPath = join(root, "data", "documents", "doc-overview.json");
  const nodePath = join(root, "data", "nodes", "flowdoc.json");
  const workPath = join(root, "data", "work", "pilot-task.json");
  const current = JSON.parse(await readFile(documentPath, "utf8")) as DocumentRecord;
  const node = JSON.parse(await readFile(nodePath, "utf8")) as Record<string, any>;
  const work = JSON.parse(await readFile(workPath, "utf8")) as Record<string, any>;
  const old: DocumentRecord = {
    ...current,
    id: "doc-old",
    title: "Old contract",
    path: "docs/old.md",
    lifecycle: "superseded",
    contextClass: "historical",
    supersededBy: mode === "missing" ? "doc-missing" : "doc-overview",
  };
  current.contextClass = mode === "active-historical" ? "historical" : "current";
  current.lifecycle = mode === "inactive-successor" ? "retired" : "active";
  current.supersedes = ["doc-old"];
  if (mode === "missing-context-class") delete current.contextClass;
  if (mode === "cycle") {
    current.contextClass = "historical";
    current.lifecycle = "superseded";
    current.supersededBy = "doc-old";
    old.supersedes = ["doc-overview"];
  }
  node.documentIds = ["doc-overview", "doc-old"];
  if (mode === "historical-context") work.contextDocumentIds = ["doc-old"];
  await writeFile(documentPath, JSON.stringify(current));
  await writeFile(join(root, "data", "documents", "doc-old.json"), JSON.stringify(old));
  await writeFile(nodePath, JSON.stringify(node));
  await writeFile(workPath, JSON.stringify(work));
  await writeFile(join(root, "docs", "old.md"), "# Old\n");

  if (mode === "fork") {
    const second: DocumentRecord = {
      ...current,
      id: "doc-second",
      title: "Second successor",
      path: "docs/second.md",
      supersedes: ["doc-old"],
    };
    node.documentIds.push("doc-second");
    await writeFile(nodePath, JSON.stringify(node));
    await writeFile(join(root, "data", "documents", "doc-second.json"), JSON.stringify(second));
    await writeFile(join(root, "docs", "second.md"), "# Second\n");
  }
}

describe("document supersession semantics", () => {
  it("accepts one reciprocal current successor", async () => {
    const root = await createProjectFixture({ valid: true, newContractTask: true });
    await installSupersessionFixture(root, "valid");
    await expect(validateProjectSemantics(await loadProjectSources(root))).resolves.toBeDefined();
  });

  it.each([
    ["missing successor", "missing", "DOCUMENT_SUCCESSOR_MISSING"],
    ["two successors", "fork", "DOCUMENT_SUPERSESSION_FORK"],
    ["cycle", "cycle", "DOCUMENT_SUPERSESSION_CYCLE"],
    ["active historical authority", "active-historical", "HISTORICAL_DOCUMENT_ACTIVE"],
    ["inactive current successor", "inactive-successor", "SUPERSESSION_SUCCESSOR_NOT_ACTIVE"],
    ["historical default context", "historical-context", "HISTORICAL_DEFAULT_CONTEXT"],
    ["supersession without context classification", "missing-context-class", "DOCUMENT_CONTEXT_CLASS_REQUIRED"],
  ] as const)("rejects %s", async (_name, mode, code) => {
    const root = await createProjectFixture({ valid: true, newContractTask: true });
    await installSupersessionFixture(root, mode);
    await expect(validateProjectSemantics(await loadProjectSources(root))).rejects.toMatchObject({
      diagnostics: expect.arrayContaining([expect.objectContaining({ code })]),
    });
  });

  it("requires validity metadata for Evidence referenced by a version 3 packet", async () => {
    const root = await createProjectFixture({ valid: true, newContractTask: true });
    const workPath = join(root, "data", "work", "pilot-task.json");
    const work = JSON.parse(await readFile(workPath, "utf8")) as Record<string, any>;
    const registry = createCoordinationRegistryV3Fixture();
    registry.round.workId = "pilot-task";
    registry.integrationClaims[0]!.repositoryId = "project-control";
    const room = registry.roomRuns[0]!;
    room.ownerRepositoryId = "project-control";
    room.phaseId = "phase-contract";
    room.checklistId = "checklist-contract";
    room.requiredEvidence = ["evidence-design"];
    room.packet.ownerRepositoryId = "project-control";
    room.packet.relevantEvidenceIds = ["evidence-design"];
    room.packetDigest = packetDigest(room.packet);
    work.coordination = registry;
    await writeFile(workPath, JSON.stringify(work));

    await expect(validateProjectSemantics(await loadProjectSources(root))).rejects.toMatchObject({
      diagnostics: expect.arrayContaining([
        expect.objectContaining({ code: "WORKFLOW_EVIDENCE_VALIDITY_REQUIRED" }),
      ]),
    });
  });
});
