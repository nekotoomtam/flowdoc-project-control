import { execFile } from "node:child_process";
import { realpath } from "node:fs/promises";
import { resolve } from "node:path";
import type { GitChangeEntry, GitScopeManifest } from "../../src/model/scope-lock.js";

export class GitScopeInspectionError extends Error {
  constructor(
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "GitScopeInspectionError";
  }
}

export async function inspectGitScope(options: {
  worktree: string;
  baseCommit: string;
  expectedHead: string;
}): Promise<GitScopeManifest> {
  let worktree: string;
  try {
    worktree = await realpath(resolve(options.worktree));
  } catch {
    throw new GitScopeInspectionError("GIT_SCOPE_WORKTREE_INVALID", "The registered worktree cannot be resolved.");
  }

  const reportedRoot = text(await runGit(worktree, ["rev-parse", "--show-toplevel"]));
  let repositoryRoot: string;
  try {
    repositoryRoot = await realpath(reportedRoot);
  } catch {
    throw new GitScopeInspectionError("GIT_SCOPE_UNEXPECTED_ROOT", "Git reported a repository root that cannot be resolved.");
  }
  if (comparablePath(repositoryRoot) !== comparablePath(worktree)) {
    throw new GitScopeInspectionError("GIT_SCOPE_UNEXPECTED_ROOT", "The registered worktree is not the Git repository root.");
  }

  let baseCommit: string;
  try {
    baseCommit = text(await runGit(worktree, ["rev-parse", "--verify", `${options.baseCommit}^{commit}`]));
  } catch {
    throw new GitScopeInspectionError("GIT_SCOPE_BASE_MISMATCH", "The Scope Lock base commit does not resolve in this repository.");
  }
  if (baseCommit !== options.baseCommit) {
    throw new GitScopeInspectionError("GIT_SCOPE_BASE_MISMATCH", "The resolved base commit differs from the Scope Lock base commit.");
  }

  const headCommit = text(await runGit(worktree, ["rev-parse", "HEAD"]));
  if (headCommit !== options.expectedHead) {
    throw new GitScopeInspectionError("GIT_SCOPE_HEAD_MISMATCH", "The inspected HEAD differs from the expected terminal commit.");
  }

  const diffFlags = ["--name-status", "-z", "--find-renames", "--find-copies", "--find-copies-harder"];
  const committed = parseNameStatus(
    await runGit(worktree, ["diff", ...diffFlags, baseCommit, headCommit, "--"]),
    "committed",
  );
  const staged = parseNameStatus(
    await runGit(worktree, ["diff", "--cached", ...diffFlags, "--"]),
    "staged",
  );
  const unstaged = parseNameStatus(
    await runGit(worktree, ["diff", ...diffFlags, "--"]),
    "unstaged",
  );
  const untracked = nulTokens(await runGit(worktree, ["ls-files", "--others", "--exclude-standard", "-z"]))
    .map((path): GitChangeEntry => ({ source: "untracked", kind: "untracked", path }));
  const dirtySubmodules = await inspectDirtySubmodules(worktree);
  const entries = deduplicateEntries([...committed, ...staged, ...unstaged, ...untracked, ...dirtySubmodules]);

  return {
    repositoryRoot: repositoryRoot.replaceAll("\\", "/"),
    baseCommit,
    headCommit,
    entries,
    dirty: entries.some(({ source }) => source !== "committed"),
  };
}

async function inspectDirtySubmodules(worktree: string): Promise<GitChangeEntry[]> {
  const records = nulTokens(await runGit(worktree, ["ls-files", "--stage", "-z"]));
  const paths: string[] = [];
  for (const record of records) {
    const match = /^(\d{6}) [0-9a-f]+ \d+\t([\s\S]+)$/.exec(record);
    if (match === null) throw new GitScopeInspectionError("GIT_SCOPE_OUTPUT_MALFORMED", "Git index output is malformed.");
    if (match[1] === "160000") paths.push(match[2]!);
  }
  const dirty: GitChangeEntry[] = [];
  for (const path of paths) {
    let output: Buffer;
    try {
      output = await runGit(resolve(worktree, path), ["status", "--porcelain=v1", "-z", "--untracked-files=all"]);
    } catch {
      dirty.push({ source: "submodule", kind: "submodule", path });
      continue;
    }
    if (output.length > 0) dirty.push({ source: "submodule", kind: "submodule", path });
  }
  return dirty;
}

function parseNameStatus(buffer: Buffer, source: "committed" | "staged" | "unstaged"): GitChangeEntry[] {
  const tokens = nulTokens(buffer);
  const entries: GitChangeEntry[] = [];
  for (let index = 0; index < tokens.length;) {
    const status = tokens[index++];
    if (status === undefined || !/^[ACDMRTUXB][0-9]*$/.test(status)) {
      throw new GitScopeInspectionError("GIT_SCOPE_OUTPUT_MALFORMED", "Git name-status output is malformed.");
    }
    const statusKind = status[0]!;
    if (statusKind === "R" || statusKind === "C") {
      const previousPath = tokens[index++];
      const path = tokens[index++];
      if (previousPath === undefined || path === undefined) {
        throw new GitScopeInspectionError("GIT_SCOPE_OUTPUT_MALFORMED", "Git rename/copy output is incomplete.");
      }
      entries.push({ source, kind: statusKind === "R" ? "renamed" : "copied", path, previousPath });
      continue;
    }
    const path = tokens[index++];
    if (path === undefined) throw new GitScopeInspectionError("GIT_SCOPE_OUTPUT_MALFORMED", "Git name-status path is missing.");
    entries.push({ source, kind: changeKind(statusKind), path });
  }
  return entries;
}

function changeKind(status: string): GitChangeEntry["kind"] {
  if (status === "A") return "added";
  if (status === "D") return "deleted";
  return "modified";
}

function nulTokens(buffer: Buffer): string[] {
  if (buffer.length === 0) return [];
  if (buffer[buffer.length - 1] !== 0) {
    throw new GitScopeInspectionError("GIT_SCOPE_OUTPUT_MALFORMED", "Expected NUL-terminated Git output.");
  }
  return buffer.toString("utf8").slice(0, -1).split("\0");
}

function deduplicateEntries(entries: GitChangeEntry[]): GitChangeEntry[] {
  return [...new Map(entries.map((entry) => [JSON.stringify(entry), entry])).values()]
    .sort((left, right) => JSON.stringify(left).localeCompare(JSON.stringify(right)));
}

function comparablePath(value: string): string {
  const normalized = value.replaceAll("\\", "/").replace(/\/+$/, "");
  return process.platform === "win32" ? normalized.toLowerCase() : normalized;
}

function text(buffer: Buffer): string {
  return buffer.toString("utf8").trim();
}

function runGit(cwd: string, args: string[]): Promise<Buffer> {
  return new Promise((resolvePromise, reject) => {
    execFile("git", args, { cwd, encoding: "buffer", windowsHide: true, maxBuffer: 16 * 1024 * 1024 }, (error, stdout) => {
      if (error !== null) {
        reject(new GitScopeInspectionError("GIT_SCOPE_COMMAND_FAILED", `Git command failed: git ${args[0] ?? ""}`));
        return;
      }
      resolvePromise(stdout);
    });
  });
}
