import { createHash, type Hash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type {
  IndexWork,
  IndexDocument,
  NodeRecord,
  PhaseRecord,
  ProjectRecord,
  ProjectReadModel,
  WorkRecord,
} from "../../src/model/types.js";
import { compareCodeUnits } from "./errors.js";
import type { LoadedRecord } from "./load-sources.js";
import type { ValidatedProjectSources } from "./validate-semantics.js";

export async function buildProjectReadModel(
  validated: ValidatedProjectSources,
): Promise<ProjectReadModel> {
  const nodes = [...validated.nodes].sort(compareNodes);
  const workValues = sortById(validated.work).map(({ value }) => ({ ...value }));
  const phases = sortById(validated.phases).map(({ value }) => ({ ...value }));
  const checklists = sortById(validated.checklists).map(({ value }) => ({ ...value }));
  const childWorkIdsByParentId = groupIds(workValues, (work) => work.parentWorkId);
  const phaseIdsByWorkId = groupPhaseIdsByWorkId(phases);
  const indexedWork: IndexWork[] = workValues.map((work) => ({
    ...work,
    childWorkIds: childWorkIdsByParentId.get(work.id) ?? [],
    phaseIds: work.workKind === undefined ? [] : (phaseIdsByWorkId.get(work.id) ?? []),
    workPathIds: work.workKind === undefined ? [work.id] : collectWorkPathIds(work, workValues),
  }));
  const documents = await Promise.all(
    sortById(validated.documents).map(async ({ value }) => ({
      ...value,
      content: normalizeLineEndings(await readFile(join(validated.rootDir, value.path), "utf8")),
    })),
  );
  const repositories = sortById(validated.repositories).map(({ value }) => ({ ...value }));
  const evidence = sortById(validated.evidence).map(({ value }) => ({ ...value }));

  const nodeValues = nodes.map(({ value }) => value);
  const indexNodes = nodeValues.map((node) => ({
    ...node,
    childIds: nodeValues
      .filter((candidate) => candidate.parentId === node.id)
      .map((candidate) => candidate.id),
    workIds: indexedWork.filter((item) => item.nodeId === node.id).map((item) => item.id),
  }));

  const model = {
    schemaVersion: 1 as const,
    sourceDigest: await calculateSourceDigest(validated, documents),
    rootNodeIds: nodeValues.filter((node) => node.parentId === null).map((node) => node.id),
    nodes: indexNodes,
    work: indexedWork,
    phases,
    checklists,
    documents,
    repositories,
    evidence,
  };
  return model;
}

export function serializeProjectReadModel(model: ProjectReadModel): string {
  return `${JSON.stringify(model, null, 2)}\n`;
}

async function calculateSourceDigest(
  validated: ValidatedProjectSources,
  documents: IndexDocument[],
): Promise<string> {
  const markdownByPath = new Map(documents.map((document) => [document.path, document.content]));
  const sources = [
    ...validated.records.map((record) => ({
      relativePath: record.relativePath,
      content: canonicalJson(record.value),
    })),
    ...documents.map((document) => ({
      relativePath: document.path,
      content: markdownByPath.get(document.path) ?? "",
    })),
  ].sort((left, right) => compareCodeUnits(left.relativePath, right.relativePath));
  const hash = createHash("sha256");

  for (const source of sources) {
    updateFramedUtf8(hash, source.relativePath);
    updateFramedUtf8(hash, source.content);
  }

  return hash.digest("hex");
}

function updateFramedUtf8(hash: Hash, value: string): void {
  const bytes = Buffer.from(value, "utf8");
  const length = Buffer.alloc(8);
  length.writeBigUInt64BE(BigInt(bytes.byteLength));
  hash.update(length);
  hash.update(bytes);
}

function canonicalJson(value: unknown): string {
  return JSON.stringify(canonicalize(value));
}

function canonicalize(value: unknown): unknown {
  if (typeof value === "string") {
    return normalizeLineEndings(value);
  }
  if (Array.isArray(value)) {
    return value.map(canonicalize);
  }
  if (typeof value === "object" && value !== null) {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([left], [right]) => compareCodeUnits(left, right))
        .map(([key, child]) => [key, canonicalize(child)]),
    );
  }
  return value;
}

function normalizeLineEndings(source: string): string {
  return source.replaceAll("\r\n", "\n").replaceAll("\r", "\n");
}

function compareNodes(left: LoadedRecord<NodeRecord>, right: LoadedRecord<NodeRecord>): number {
  const parentOrder = compareCodeUnits(left.value.parentId ?? "", right.value.parentId ?? "");
  if (parentOrder !== 0) {
    return parentOrder;
  }
  if (left.value.order !== right.value.order) {
    return left.value.order - right.value.order;
  }
  return compareCodeUnits(left.value.id, right.value.id);
}

function sortById<T extends ProjectRecord>(records: LoadedRecord<T>[]): LoadedRecord<T>[] {
  return [...records].sort((left, right) => compareCodeUnits(left.value.id, right.value.id));
}

function groupIds<T extends { id: string }>(
  values: T[],
  readParentId: (value: T) => string | undefined,
): Map<string, string[]> {
  const grouped = new Map<string, string[]>();
  for (const value of values) {
    const parentId = readParentId(value);
    if (parentId === undefined) continue;
    const ids = grouped.get(parentId) ?? [];
    ids.push(value.id);
    grouped.set(parentId, ids.sort(compareCodeUnits));
  }
  return grouped;
}

function groupPhaseIdsByWorkId(phases: PhaseRecord[]): Map<string, string[]> {
  const grouped = new Map<string, PhaseRecord[]>();
  for (const phase of phases) {
    const workPhases = grouped.get(phase.workId) ?? [];
    workPhases.push(phase);
    grouped.set(phase.workId, workPhases);
  }

  return new Map([...grouped.entries()].map(([workId, workPhases]) => [
    workId,
    workPhases
      .sort(comparePhases)
      .map((phase) => phase.id),
  ]));
}

function comparePhases(left: PhaseRecord, right: PhaseRecord): number {
  if (left.order !== right.order) {
    return left.order - right.order;
  }
  return compareCodeUnits(left.title, right.title) || compareCodeUnits(left.id, right.id);
}

function collectWorkPathIds(work: WorkRecord, workValues: WorkRecord[]): string[] {
  const byId = new Map(workValues.map((item) => [item.id, item]));
  const path: string[] = [];
  let current: WorkRecord | undefined = work;
  while (current !== undefined) {
    path.unshift(current.id);
    current = current.parentWorkId === undefined ? undefined : byId.get(current.parentWorkId);
  }
  return path;
}
