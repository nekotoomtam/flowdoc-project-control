import { createHash } from "node:crypto";
import { posix, win32 } from "node:path";
import type {
  CompactCoordinationModelDecision,
  CoordinationModelAvailabilitySnapshot,
  ScopeLockVerification,
} from "./types.js";
import type { WorkflowEconomyPacketV2 } from "./workflow-economy.js";

export interface ScopeLockIssue {
  code: string;
  message: string;
}

export interface GitChangeEntry {
  source: "committed" | "staged" | "unstaged" | "untracked" | "submodule";
  kind: "added" | "modified" | "deleted" | "renamed" | "copied" | "untracked" | "submodule";
  path: string;
  previousPath?: string;
}

export interface GitScopeManifest {
  repositoryRoot: string;
  baseCommit: string;
  headCommit: string;
  entries: GitChangeEntry[];
  dirty: boolean;
}

export interface ScopeLockEvaluationInput {
  packet: WorkflowEconomyPacketV2;
  manifest: GitScopeManifest;
  payloadChangedFiles: string[];
  completionChangedFiles: string[];
  terminalCommit: string;
  packetDigest: string;
  expectedPacketDigest: string;
  verifiedAt: string;
}

export interface ScopeLockEvaluation {
  issues: ScopeLockIssue[];
  verification?: ScopeLockVerification;
}

export function normalizeRepositoryPath(value: string): string {
  const replaced = value.trim().replaceAll("\\", "/");
  if (
    replaced.length === 0 ||
    posix.isAbsolute(replaced) ||
    win32.isAbsolute(replaced) ||
    replaced.split("/").includes("..")
  ) {
    throw new Error(`Invalid repository-relative path: ${value}`);
  }
  const normalized = replaced
    .split("/")
    .filter((segment) => segment !== "" && segment !== ".")
    .join("/");
  if (normalized.length === 0) throw new Error(`Invalid repository-relative path: ${value}`);
  return normalized;
}

export function pathWithinScope(path: string, scope: string): boolean {
  const normalizedPath = normalizeRepositoryPath(path);
  const normalizedScope = normalizeRepositoryPath(scope);
  return normalizedPath === normalizedScope || normalizedPath.startsWith(`${normalizedScope}/`);
}

export function collectScopeDefinitionIssues(packet: WorkflowEconomyPacketV2): ScopeLockIssue[] {
  const issues: ScopeLockIssue[] = [];
  const allowed = normalizeList("allowed", packet.allowedScope, issues);
  const forbidden = normalizeList("forbidden", packet.forbiddenScope, issues);

  for (const allowedPath of allowed) {
    for (const forbiddenPath of forbidden) {
      if (pathWithinScope(allowedPath, forbiddenPath) || pathWithinScope(forbiddenPath, allowedPath)) {
        issues.push({
          code: "SCOPE_OVERLAP",
          message: `Allowed scope ${allowedPath} overlaps forbidden scope ${forbiddenPath}.`,
        });
      }
    }
  }
  return deduplicateIssues(issues);
}

export function resolveModelAvailability(
  decision: CompactCoordinationModelDecision,
  snapshots: readonly CoordinationModelAvailabilitySnapshot[] | undefined,
  expectedHostId: string,
): ScopeLockIssue[] {
  const snapshot = snapshots?.find(({ id }) => id === decision.availabilitySnapshotRef);
  if (snapshot === undefined) {
    return [{
      code: "MODEL_SNAPSHOT_MISSING",
      message: `Model availability snapshot ${decision.availabilitySnapshotRef} is missing.`,
    }];
  }
  if (snapshot.hostId !== expectedHostId) {
    return [{
      code: "MODEL_SNAPSHOT_HOST_MISMATCH",
      message: `Model snapshot host ${snapshot.hostId} does not match dispatch host ${expectedHostId}.`,
    }];
  }
  const available = snapshot.availableModelEfforts.some(({ modelId, reasoningEfforts }) =>
    modelId === decision.modelId && reasoningEfforts.includes(decision.reasoningEffort));
  return available ? [] : [{
    code: "MODEL_EFFORT_UNAVAILABLE",
    message: "Selected model and effort are absent from the referenced host capability snapshot.",
  }];
}

export function canonicalScopeManifestDigest(manifest: GitScopeManifest): string {
  const canonical = {
    repositoryRoot: normalizeLocatorPath(manifest.repositoryRoot),
    baseCommit: manifest.baseCommit,
    headCommit: manifest.headCommit,
    entries: manifest.entries
      .map(canonicalizeEntry)
      .sort((left, right) => JSON.stringify(left).localeCompare(JSON.stringify(right))),
    dirty: manifest.dirty,
  };
  return createHash("sha256").update(JSON.stringify(canonical)).digest("hex");
}

export function evaluateScopeLock(input: ScopeLockEvaluationInput): ScopeLockEvaluation {
  const issues: ScopeLockIssue[] = [];
  let actualChangedFiles: string[];
  try {
    actualChangedFiles = changedFilesFromManifest(input.manifest);
  } catch {
    return { issues: [{ code: "SCOPE_MANIFEST_PATH_INVALID", message: "The Git manifest contains an invalid repository path." }] };
  }

  if (input.packet.workAuthority !== "implementation" && actualChangedFiles.length > 0) {
    issues.push({ code: "WORK_AUTHORITY_READ_ONLY", message: `${input.packet.workAuthority} WORK cannot mutate repository files.` });
  }
  for (const path of actualChangedFiles) {
    if (input.packet.forbiddenScope.some((scope) => pathWithinScope(path, scope))) {
      issues.push({ code: "CHANGED_FILE_FORBIDDEN", message: `Changed file ${path} is inside forbidden scope.` });
    } else if (!input.packet.allowedScope.some((scope) => pathWithinScope(path, scope))) {
      issues.push({ code: "CHANGED_FILE_OUTSIDE_SCOPE", message: `Changed file ${path} is outside allowed scope.` });
    }
  }
  if (
    !samePathSet(actualChangedFiles, input.payloadChangedFiles) ||
    !samePathSet(actualChangedFiles, input.completionChangedFiles)
  ) {
    issues.push({ code: "CHANGE_MANIFEST_MISMATCH", message: "Reported changed files do not equal the authoritative Git manifest." });
  }
  if (input.manifest.dirty) {
    issues.push({ code: "SCOPE_WORKTREE_DIRTY", message: "The returned worktree contains staged, unstaged, untracked, or dirty-submodule state." });
  }
  if (input.terminalCommit !== input.manifest.headCommit) {
    issues.push({ code: "SCOPE_TERMINAL_COMMIT_MISMATCH", message: "The reported terminal commit does not equal the inspected HEAD." });
  }
  if (input.packet.scopeLock.baseCommit !== input.manifest.baseCommit) {
    issues.push({ code: "SCOPE_BASE_COMMIT_MISMATCH", message: "The inspected base commit does not equal the packet Scope Lock base." });
  }
  if (normalizeLocatorPath(input.packet.scopeLock.worktree) !== normalizeLocatorPath(input.manifest.repositoryRoot)) {
    issues.push({ code: "SCOPE_WORKTREE_MISMATCH", message: "The inspected Git root does not equal the packet Scope Lock worktree." });
  }
  if (input.packetDigest !== input.expectedPacketDigest) {
    issues.push({ code: "SCOPE_PACKET_DIGEST_MISMATCH", message: "The current packet digest differs from the dispatched packet digest." });
  }

  const deduplicated = deduplicateIssues(issues);
  if (deduplicated.length > 0) return { issues: deduplicated };
  return {
    issues: [],
    verification: {
      version: 1,
      status: "passed",
      baseCommit: input.manifest.baseCommit,
      terminalCommit: input.manifest.headCommit,
      packetDigest: input.packetDigest,
      manifestDigest: canonicalScopeManifestDigest(input.manifest),
      changedFiles: actualChangedFiles,
      verifiedAt: input.verifiedAt,
      clean: true,
    },
  };
}

function normalizeList(
  label: "allowed" | "forbidden",
  values: readonly string[],
  issues: ScopeLockIssue[],
): string[] {
  const normalized: string[] = [];
  const seen = new Set<string>();
  for (const value of values) {
    let path: string;
    try {
      path = normalizeRepositoryPath(value);
    } catch {
      issues.push({ code: "SCOPE_PATH_INVALID", message: `${label} scope path ${value} is invalid.` });
      continue;
    }
    if (seen.has(path)) {
      issues.push({ code: "SCOPE_PATH_DUPLICATE", message: `${label} scope path ${path} is duplicated.` });
      continue;
    }
    seen.add(path);
    normalized.push(path);
  }
  return normalized;
}

function canonicalizeEntry(entry: GitChangeEntry): GitChangeEntry {
  return {
    source: entry.source,
    kind: entry.kind,
    path: normalizeRepositoryPath(entry.path),
    ...(entry.previousPath === undefined ? {} : { previousPath: normalizeRepositoryPath(entry.previousPath) }),
  };
}

function changedFilesFromManifest(manifest: GitScopeManifest): string[] {
  const paths = new Set<string>();
  for (const entry of manifest.entries) {
    paths.add(normalizeRepositoryPath(entry.path));
    if (entry.previousPath !== undefined) paths.add(normalizeRepositoryPath(entry.previousPath));
  }
  return [...paths].sort();
}

function samePathSet(actual: readonly string[], reported: readonly string[]): boolean {
  let normalized: string[];
  try {
    normalized = [...new Set(reported.map(normalizeRepositoryPath))].sort();
  } catch {
    return false;
  }
  return actual.length === normalized.length && actual.every((path, index) => path === normalized[index]);
}

function normalizeLocatorPath(value: string): string {
  return value.replaceAll("\\", "/").replace(/\/+$/, "");
}

function deduplicateIssues(issues: ScopeLockIssue[]): ScopeLockIssue[] {
  return [...new Map(issues.map((issue) => [`${issue.code}\u0000${issue.message}`, issue])).values()];
}
