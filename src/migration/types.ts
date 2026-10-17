export type MigrationReleaseLine = "V0_1_0a_1";
export type FamilyReviewState = "candidate" | "pilot-reviewed";
export type CoreDocumentClass =
  | "design"
  | "plan"
  | "decision"
  | "risk"
  | "unknown"
  | "status-or-closeout"
  | "migration"
  | "verification-or-audit"
  | "contract-or-code-adjacent-reference"
  | "operational-readme"
  | "historical-working-record";
export type ProvisionalDisposition =
  | "candidate-current"
  | "historical-input"
  | "duplicate"
  | "repo-local-keep"
  | "needs-review";
export type CoverageStatus = "draft" | "content-reviewed" | "ready-for-deletion" | "closed";
export type CoverageDisposition =
  | "canonical-section"
  | "historical-note"
  | "repo-local-keep"
  | "discarded-duplicate";

export interface InventoryLink {
  rawTarget: string;
  resolvedPath: string | null;
}

export interface InventoryRepositoryReference {
  kind: "code" | "test" | "contract";
  target: string;
}

export interface CoreInventoryFile {
  path: string;
  blobId: string;
  title: string;
  candidateFamily: string;
  outboundMarkdownLinks: InventoryLink[];
  inboundMarkdownReferences: string[];
  repositoryReferences: InventoryRepositoryReference[];
}

export interface CoreMarkdownInventory {
  kind: "core-document-inventory";
  schemaVersion: 1;
  releaseLine: MigrationReleaseLine;
  repositoryId: "repo-core";
  sourceCommit: string;
  expectedFileCount: number;
  sourceDigest: string;
  files: CoreInventoryFile[];
}

export interface CoreFamilyAssignment {
  familyId: string;
  reviewState: FamilyReviewState;
  sources: Array<{
    path: string;
    documentClass: CoreDocumentClass;
    authorityAssessment: string;
    provisionalDisposition: ProvisionalDisposition;
    canonicalDestination: string | null;
    migrationStatus: "classified" | "migrated" | "removed-from-core";
  }>;
}

export interface CoreFamilyMap {
  kind: "core-document-family-map";
  schemaVersion: 1;
  releaseLine: MigrationReleaseLine;
  inventoryDigest: string;
  families: CoreFamilyAssignment[];
}

export interface FamilyCoverageSource {
  path: string;
  blobId: string;
  disposition: CoverageDisposition;
  destinationPath: string | null;
  destinationSection: string | null;
  rationale: string;
}

export interface HistoricalReferenceAllowance {
  sourcePath: string;
  line: number;
  targetPath: string;
  lineSha256: string;
  rationale: string;
}

export interface FamilyCoverage {
  kind: "core-document-family-coverage";
  schemaVersion: 1;
  releaseLine: MigrationReleaseLine;
  familyId: string;
  sourceCommit: string;
  inventoryDigest: string;
  status: CoverageStatus;
  canonicalDocumentIds: string[];
  sources: FamilyCoverageSource[];
  activeReferences: Array<{ sourcePath: string; line: number; targetPath: string }>;
  retainedHistoricalReferences: HistoricalReferenceAllowance[];
  projectControlPublicationCommit: string | null;
  coreCleanupCommit: string | null;
}
