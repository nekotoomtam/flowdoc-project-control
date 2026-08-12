import { lstat, readdir } from "node:fs/promises";
import { join, relative } from "node:path";
import type { ProjectDiagnostic } from "../../src/model/diagnostics.js";
import { compareCodeUnits } from "./errors.js";

export const CANONICAL_RECORD_DIRECTORIES = [
  "documents",
  "evidence",
  "nodes",
  "repositories",
  "work",
] as const;

export type CanonicalRecordDirectory = (typeof CANONICAL_RECORD_DIRECTORIES)[number];

const canonicalDirectorySet = new Set<string>(CANONICAL_RECORD_DIRECTORIES);

export interface DiscoveredSourceFile {
  absolutePath: string;
  relativePath: string;
  directory: CanonicalRecordDirectory;
}

export interface SourceDiscovery {
  files: DiscoveredSourceFile[];
  diagnostics: ProjectDiagnostic[];
}

export async function discoverCanonicalSourceFiles(rootDir: string): Promise<SourceDiscovery> {
  const dataDir = join(rootDir, "data");
  const files: DiscoveredSourceFile[] = [];
  const diagnostics: ProjectDiagnostic[] = [];

  try {
    const dataStatus = await lstat(dataDir);
    if (!dataStatus.isDirectory() || dataStatus.isSymbolicLink()) {
      return {
        files,
        diagnostics: [unexpectedJsonDiagnostic("data")],
      };
    }
  } catch (error: unknown) {
    if (isMissingPath(error)) {
      return { files, diagnostics };
    }
    throw error;
  }

  await scanDirectory(rootDir, dataDir, files, diagnostics);

  return {
    files: files.sort((left, right) => compareCodeUnits(left.relativePath, right.relativePath)),
    diagnostics: diagnostics.sort((left, right) => compareCodeUnits(left.file, right.file)),
  };
}

async function scanDirectory(
  rootDir: string,
  directoryPath: string,
  files: DiscoveredSourceFile[],
  diagnostics: ProjectDiagnostic[],
): Promise<void> {
  const entries = await readdir(directoryPath, { withFileTypes: true });
  entries.sort((left, right) => compareCodeUnits(left.name, right.name));

  for (const entry of entries) {
    const absolutePath = join(directoryPath, entry.name);
    const relativePath = toRelativePath(rootDir, absolutePath);

    if (entry.isSymbolicLink()) {
      if (entry.name.endsWith(".json")) {
        diagnostics.push(unexpectedJsonDiagnostic(relativePath));
      }
      continue;
    }

    if (entry.isDirectory()) {
      await scanDirectory(rootDir, absolutePath, files, diagnostics);
      continue;
    }

    if (!entry.isFile() || !entry.name.endsWith(".json")) {
      continue;
    }

    const segments = relativePath.split("/");
    const directory = segments[1];
    if (
      segments.length !== 3 ||
      segments[0] !== "data" ||
      directory === undefined ||
      !canonicalDirectorySet.has(directory)
    ) {
      diagnostics.push(unexpectedJsonDiagnostic(relativePath));
      continue;
    }

    files.push({
      absolutePath,
      relativePath,
      directory: directory as CanonicalRecordDirectory,
    });
  }
}

function unexpectedJsonDiagnostic(file: string): ProjectDiagnostic {
  return {
    code: "UNEXPECTED_JSON_FILE",
    message: "JSON records must be regular files directly inside a canonical data directory.",
    file,
    hint: "Keep JSON records directly in data/nodes, data/work, data/documents, data/repositories, or data/evidence.",
  };
}

function toRelativePath(rootDir: string, filePath: string): string {
  return relative(rootDir, filePath).replaceAll("\\", "/");
}

function isMissingPath(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT";
}
