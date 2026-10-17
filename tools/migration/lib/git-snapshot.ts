import { execFile as execFileCallback } from "node:child_process";
import { promisify } from "node:util";

import { compareCodeUnits } from "../../lib/errors.js";

const execFile = promisify(execFileCallback);

export interface GitMarkdownBlob {
  path: string;
  blobId: string;
  content: string;
}

interface TreeEntry {
  mode: string;
  type: string;
  blobId: string;
  path: string;
}

function snapshotError(): Error {
  return new Error("Unable to read the requested Git Markdown snapshot.");
}

function normalizeRepositoryPath(path: string): string | null {
  if (path.length === 0 || path.startsWith("/") || path.includes("\\")) {
    return null;
  }

  const segments: string[] = [];
  for (const segment of path.split("/")) {
    if (segment.length === 0 || segment === ".") {
      continue;
    }
    if (segment === "..") {
      if (segments.length === 0) {
        return null;
      }
      segments.pop();
      continue;
    }
    segments.push(segment);
  }
  return segments.length === 0 ? null : segments.join("/");
}

function isMarkdownPath(path: string): boolean {
  const lowerPath = path.toLowerCase();
  return lowerPath.endsWith(".md") || lowerPath.endsWith(".markdown");
}

function parseTreeEntries(output: Buffer): TreeEntry[] {
  const entries: TreeEntry[] = [];
  for (const record of output.toString("utf8").split("\0")) {
    if (record.length === 0) {
      continue;
    }
    const tab = record.indexOf("\t");
    const header = tab < 0 ? "" : record.slice(0, tab);
    const [mode, type, blobId] = header.split(" ");
    const path = tab < 0 ? "" : record.slice(tab + 1);
    if (mode === undefined || type === undefined || blobId === undefined || path.length === 0) {
      throw snapshotError();
    }
    entries.push({ mode, type, blobId, path });
  }
  return entries;
}

function decodeUtf8(content: Buffer): string {
  const decoded = content.toString("utf8");
  if (!Buffer.from(decoded, "utf8").equals(content)) {
    throw snapshotError();
  }
  return decoded;
}

async function runGit(repositoryRoot: string, args: string[]): Promise<Buffer> {
  try {
    const { stdout } = await execFile("git", args, {
      cwd: repositoryRoot,
      encoding: "buffer",
    });
    return stdout as Buffer;
  } catch {
    throw snapshotError();
  }
}

export async function readGitMarkdownSnapshot(
  repositoryRoot: string,
  commit: string,
): Promise<GitMarkdownBlob[]> {
  if (!/^[0-9a-f]{40}$/.test(commit)) {
    throw snapshotError();
  }

  const resolvedCommit = decodeUtf8(
    await runGit(repositoryRoot, ["rev-parse", "--verify", `${commit}^{commit}`]),
  ).trim();
  if (resolvedCommit !== commit) {
    throw snapshotError();
  }

  const treeOutput = await runGit(repositoryRoot, ["ls-tree", "-r", "-z", "--full-tree", commit]);
  decodeUtf8(treeOutput);
  const entries = parseTreeEntries(treeOutput);
  const paths = new Set<string>();
  const markdownEntries = entries
    .filter((entry) => isMarkdownPath(entry.path))
    .map((entry) => {
      const path = normalizeRepositoryPath(entry.path);
      if (path === null || entry.mode === "120000" || entry.type !== "blob") {
        throw snapshotError();
      }
      if (paths.has(path)) {
        throw snapshotError();
      }
      paths.add(path);
      return { ...entry, path };
    })
    .sort((left, right) => compareCodeUnits(left.path, right.path));

  return Promise.all(
    markdownEntries.map(async (entry) => ({
      path: entry.path,
      blobId: entry.blobId,
      content: decodeUtf8(await runGit(repositoryRoot, ["show", `${commit}:${entry.path}`])),
    })),
  );
}
