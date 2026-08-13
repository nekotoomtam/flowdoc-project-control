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

const FAMILY_OVERRIDES: Readonly<Record<string, string>> = {
  ".superpowers/sdd/2026-07-31-unified-incremental-root-transition-5b-1-corrective/collision-fix-report.md": "live-draft",
  ".superpowers/sdd/2026-07-31-unified-incremental-root-transition-5b-1-corrective/delivery-fix-report.md": "live-draft",
  ".superpowers/sdd/2026-07-31-unified-incremental-root-transition-5b-1-v3-corrective/final-review-verdict.md": "live-draft",
  ".superpowers/sdd/2026-07-31-unified-incremental-root-transition-5b-1-v3-corrective/final-verification.md": "live-draft",
  ".superpowers/sdd/2026-07-31-unified-incremental-root-transition-5b-1-v3-corrective/source-envelope-verification.md": "live-draft",
  "AGENTS.md": "repository-operations",
  "README.md": "vnext-core",
  "docs/CURRENT_STATUS.md": "project-state",
  "docs/DOCUMENT_MAP.md": "canonical-documentation",
  "docs/FIVE_LANE_PROJECT_PROGRESS_INDEX.md": "project-state",
  "docs/GLOSSARY.md": "glossary",
  "docs/GLOSSARY_TH.md": "glossary",
  "docs/NEXT_PHASE_POINTER.md": "project-state",
  "docs/PHASE_18_IMPLEMENTATION_ROADMAP.md": "project-state",
  "docs/PHASE_LEDGER.md": "project-state",
  "docs/VERSION_POLICY.md": "versioning",
  "docs/coordination/BOUNDARY.md": "workspace-boundary",
  "docs/project/CURRENT_STATE.md": "project-state",
  "docs/project/KNOWN_UNKNOWNS.md": "project-state",
  "docs/project/RISK_REGISTER.md": "project-state",
  "docs/project/ROADMAP.md": "project-state",
  "docs/superpowers/plans/2026-07-21-text-block-complete-geometry-boundary.md": "live-draft",
  "docs/superpowers/plans/2026-07-22-persistent-text-block-flow-tree-foundation.md": "live-draft",
  "docs/superpowers/plans/2026-07-27-core-spatial-wrapping-3a.md": "live-draft",
  "docs/superpowers/plans/2026-07-27-initial-text-block-authored-box-geometry-4a.md": "live-draft",
  "docs/superpowers/plans/2026-07-27-inline-image-line-box-geometry-4b.md": "live-draft",
  "docs/superpowers/plans/2026-07-28-unified-text-block-retained-root-5a.md": "live-draft",
  "docs/superpowers/plans/2026-07-30-unified-incremental-root-transition-5b.md": "live-draft",
  "docs/superpowers/plans/2026-07-31-unified-incremental-root-transition-5b-1-corrective.md": "live-draft",
  "docs/superpowers/plans/2026-07-31-unified-incremental-root-transition-5b-1-prebinding-source-envelope-amendment.md": "live-draft",
  "docs/superpowers/plans/2026-07-31-unified-incremental-root-transition-5b-1-v3-corrective.md": "live-draft",
  "docs/superpowers/plans/2026-08-01-unified-incremental-root-transition-5b-2-v3.md": "live-draft",
  "docs/superpowers/plans/2026-08-02-unified-incremental-root-transition-5b-2-evidence-v2.md": "live-draft",
  "docs/superpowers/plans/2026-08-03-producer-invocation-authority-boundary.md": "live-draft",
  "docs/superpowers/plans/2026-08-03-unified-incremental-root-transition-5b-2-rebaseline-review-th.md": "live-draft",
  "docs/superpowers/plans/2026-08-03-unified-incremental-root-transition-5b-2-rebaseline.md": "live-draft",
  "docs/superpowers/plans/2026-08-09-unified-incremental-root-transition-5b2-plan-a-review-th.md": "live-draft",
  "docs/superpowers/plans/2026-08-09-unified-incremental-root-transition-5b2-plan-a-source-authority.md": "live-draft",
  "docs/superpowers/plans/2026-08-11-canonical-documentation-d0-d2.md": "canonical-documentation",
  "docs/superpowers/plans/2026-08-11-source-commit-transaction-seam-revised.md": "live-draft",
  "docs/superpowers/plans/2026-08-11-source-commit-transaction-seam.md": "live-draft",
  "docs/superpowers/specs/2026-07-21-persistent-text-block-spatial-flow-design.md": "live-draft",
  "docs/superpowers/specs/2026-07-27-initial-text-block-authored-box-geometry-design.md": "live-draft",
  "docs/superpowers/specs/2026-07-27-inline-image-line-box-geometry-design.md": "live-draft",
  "docs/superpowers/specs/2026-07-28-unified-incremental-live-draft-product-readiness-design.md": "live-draft",
  "docs/superpowers/specs/2026-07-30-unified-incremental-root-transition-5b-design.md": "live-draft",
  "docs/superpowers/specs/2026-07-31-unified-incremental-root-transition-5b-1-corrective-design.md": "live-draft",
  "docs/superpowers/specs/2026-07-31-unified-incremental-root-transition-5b-1-prebinding-source-envelope-amendment-design.md": "live-draft",
  "docs/superpowers/specs/2026-08-01-unified-incremental-root-transition-5b-2-v3-amendment-design.md": "live-draft",
  "docs/superpowers/specs/2026-08-02-unified-incremental-source-topology-and-fallback-target-design-correction.md": "live-draft",
  "docs/superpowers/specs/2026-08-02-unified-incremental-transition-evidence-v2-design-correction.md": "live-draft",
  "docs/superpowers/specs/2026-08-03-producer-invocation-authority-boundary-design.md": "live-draft",
  "docs/superpowers/specs/2026-08-03-unified-incremental-root-transition-5b-2-plan-lock-design-correction-review-th.md": "live-draft",
  "docs/superpowers/specs/2026-08-03-unified-incremental-root-transition-5b-2-plan-lock-design-correction.md": "live-draft",
  "docs/superpowers/specs/2026-08-09-unified-incremental-root-transition-5b2-continuation-rebaseline-design.md": "live-draft",
  "docs/superpowers/specs/2026-08-10-source-commit-transaction-glossary-th.md": "live-draft",
  "docs/superpowers/specs/2026-08-10-source-commit-transaction-glossary.md": "live-draft",
  "docs/superpowers/specs/2026-08-10-source-commit-transaction-seam-design.md": "live-draft",
  "docs/superpowers/specs/2026-08-11-canonical-documentation-versioning-design.md": "canonical-documentation",
  "docs/superpowers/specs/2026-08-11-source-commit-transaction-seam-review-amendment-design.md": "live-draft",
  "docs/versions/0_1/CAPABILITY_SET.md": "versioning",
  "docs/versions/0_1/COMPATIBILITY.md": "versioning",
  "docs/versions/0_1/VERSION_OVERVIEW.md": "versioning",
  "examples/template-builder-sandbox/README.md": "template-builder",
  "packages/pdf-renderer-pilot/README.md": "pdf-renderer",
  "packages/text-engine-rust-wasm/README.md": "text-engine",
  "packages/uat-realdoc/README.md": "pdf-export",
};
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
