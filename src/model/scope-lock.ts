import { posix, win32 } from "node:path";
import type {
  CompactCoordinationModelDecision,
  CoordinationModelAvailabilitySnapshot,
} from "./types.js";
import type { WorkflowEconomyPacketV2 } from "./workflow-economy.js";

export interface ScopeLockIssue {
  code: string;
  message: string;
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

function deduplicateIssues(issues: ScopeLockIssue[]): ScopeLockIssue[] {
  return [...new Map(issues.map((issue) => [`${issue.code}\u0000${issue.message}`, issue])).values()];
}
