import { createHash, type Hash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type {
  IndexDocument,
  NodeRecord,
  ProjectRecord,
  ProjectReadModel,
} from "../../src/model/types.js";
import { compareCodeUnits } from "./errors.js";
import type { LoadedRecord } from "./load-sources.js";
import type { ValidatedProjectSources } from "./validate-semantics.js";

export async function buildProjectReadModel(
  validated: ValidatedProjectSources,
): Promise<ProjectReadModel> {
  const nodes = [...validated.nodes].sort(compareNodes);
  const work = sortById(validated.work).map(({ value }) => ({ ...value }));
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
    workIds: work.filter((item) => item.nodeId === node.id).map((item) => item.id),
  }));

  return {
    schemaVersion: 1,
    sourceDigest: await calculateSourceDigest(validated, documents),
    rootNodeIds: nodeValues.filter((node) => node.parentId === null).map((node) => node.id),
    nodes: indexNodes,
    work,
    documents,
    repositories,
    evidence,
  };
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
