import { createHash } from "node:crypto";
import { posix } from "node:path";

import type {
  CoreFamilyMap,
  CoreMarkdownInventory,
  InventoryLink,
  InventoryRepositoryReference,
  MigrationReleaseLine,
} from "../../../src/migration/types.js";
import { compareCodeUnits } from "../../lib/errors.js";
import { readGitMarkdownSnapshot } from "./git-snapshot.js";
import { extractMarkdownLinks, extractRepositoryReferences } from "./markdown-references.js";

export interface CoreMarkdownInventoryInput {
  repositoryRoot: string;
  repositoryId: "repo-core";
  releaseLine: MigrationReleaseLine;
  sourceCommit: string;
}

const FAMILY_OVERRIDES: Readonly<Record<string, string>> = {};
const UNREVIEWED_AUTHORITY =
  "Unreviewed candidate; executable evidence is required before authority or deletion decisions.";

function titleFor(path: string, markdown: string): string {
  const heading = markdown.match(/^ {0,3}#(?!#)\s+(.+?)\s*#*\s*$/m)?.[1]?.trim();
  return heading && heading.length > 0
    ? heading
    : posix.basename(path).replace(/\.(?:md|markdown)$/i, "");
}

function familyFor(path: string): string {
  const override = FAMILY_OVERRIDES[path];
  if (override !== undefined) {
    return override;
  }
  const basename = posix.basename(path).replace(/\.(?:md|markdown)$/i, "");
  const match = /^([A-Z0-9]+_[A-Z0-9]+)(?:_|$)/.exec(basename);
  return match === null ? "long-tail" : match[1]!.toLowerCase().replace("_", "-");
}

function updateFrame(hash: ReturnType<typeof createHash>, value: string): void {
  const bytes = Buffer.from(value, "utf8");
  const length = Buffer.allocUnsafe(4);
  length.writeUInt32BE(bytes.length);
  hash.update(length);
  hash.update(bytes);
}

function sourceDigest(
  files: Array<{
    path: string;
    blobId: string;
    title: string;
    inboundMarkdownReferences: string[];
    outboundMarkdownLinks: InventoryLink[];
    repositoryReferences: InventoryRepositoryReference[];
  }>,
): string {
  const hash = createHash("sha256");
  for (const file of files) {
    updateFrame(hash, "file");
    updateFrame(hash, file.path);
    updateFrame(hash, file.blobId);
    updateFrame(hash, file.title);
    for (const inbound of file.inboundMarkdownReferences) {
      updateFrame(hash, "inbound");
      updateFrame(hash, inbound);
    }
    for (const outbound of file.outboundMarkdownLinks) {
      updateFrame(hash, "outbound");
      updateFrame(hash, outbound.rawTarget);
      updateFrame(hash, outbound.resolvedPath ?? "");
    }
    for (const reference of file.repositoryReferences) {
      updateFrame(hash, "repository-reference");
      updateFrame(hash, reference.kind);
      updateFrame(hash, reference.target);
    }
  }
  return hash.digest("hex");
}

export async function buildCoreMarkdownInventory(
  input: CoreMarkdownInventoryInput,
): Promise<CoreMarkdownInventory> {
  const snapshot = await readGitMarkdownSnapshot(input.repositoryRoot, input.sourceCommit);
  const paths = new Set(snapshot.map((file) => file.path));
  const outboundByPath = new Map(
    snapshot.map((file) => [file.path, extractMarkdownLinks(file.path, file.content)]),
  );
  const inboundByPath = new Map(snapshot.map((file) => [file.path, new Set<string>()]));

  for (const [sourcePath, links] of outboundByPath) {
    for (const link of links) {
      if (link.resolvedPath !== null && paths.has(link.resolvedPath)) {
        inboundByPath.get(link.resolvedPath)!.add(sourcePath);
      }
    }
  }

  const files = snapshot.map((file) => ({
    path: file.path,
    blobId: file.blobId,
    title: titleFor(file.path, file.content),
    candidateFamily: familyFor(file.path),
    outboundMarkdownLinks: outboundByPath.get(file.path)!,
    inboundMarkdownReferences: [...inboundByPath.get(file.path)!].sort(compareCodeUnits),
    repositoryReferences: extractRepositoryReferences(file.content),
  }));

  return {
    kind: "core-document-inventory",
    schemaVersion: 1,
    releaseLine: input.releaseLine,
    repositoryId: input.repositoryId,
    sourceCommit: input.sourceCommit,
    expectedFileCount: files.length,
    sourceDigest: sourceDigest(files),
    files,
  };
}

export function buildCandidateFamilyMap(inventory: CoreMarkdownInventory): CoreFamilyMap {
  const byFamily = new Map<string, string[]>();
  for (const file of inventory.files) {
    const paths = byFamily.get(file.candidateFamily) ?? [];
    paths.push(file.path);
    byFamily.set(file.candidateFamily, paths);
  }
  return {
    kind: "core-document-family-map",
    schemaVersion: 1,
    releaseLine: inventory.releaseLine,
    inventoryDigest: inventory.sourceDigest,
    families: [...byFamily.entries()]
      .sort(([left], [right]) => compareCodeUnits(left, right))
      .map(([familyId, paths]) => ({
        familyId,
        reviewState: familyId === "core-route" ? "pilot-reviewed" : "candidate",
        sources: paths.sort(compareCodeUnits).map((path) => ({
          path,
          documentClass: "historical-working-record",
          authorityAssessment: UNREVIEWED_AUTHORITY,
          provisionalDisposition: "needs-review",
          canonicalDestination: null,
          migrationStatus: "classified",
        })),
      })),
  };
}
