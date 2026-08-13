import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join, resolve } from "node:path";

import type { CoreFamilyMap, CoreMarkdownInventory, FamilyCoverage } from "../../src/migration/types.js";
import { formatProjectDiagnostics, ProjectValidationError } from "../lib/errors.js";
import {
  collectCoveredPathMentions,
  type CoveredPathMention,
  type DeletionReadiness,
  evaluateFamilyDeletionReadiness,
  validateStoredCoreMigration,
  verifyFamilyCleanup,
} from "./lib/validate-migration.js";

interface CoreDocsCliOptions {
  storedOnly: boolean;
  sourceRoot?: string;
  family?: string;
  cleanupCandidate: boolean;
  closed: boolean;
  reportMentions: boolean;
}

export interface MentionReport {
  readiness: DeletionReadiness;
  mentions: CoveredPathMention[];
}

export type CoreDocsCheckResult = DeletionReadiness | MentionReport | undefined;

const valueFlags = new Map([
  ["--source-root", "sourceRoot"],
  ["--family", "family"],
] as const);
const booleanFlags = new Map([
  ["--stored-only", "storedOnly"],
  ["--cleanup-candidate", "cleanupCandidate"],
  ["--closed", "closed"],
  ["--report-mentions", "reportMentions"],
] as const);

function parseArgs(args: string[]): CoreDocsCliOptions {
  const options: CoreDocsCliOptions = {
    storedOnly: false,
    cleanupCandidate: false,
    closed: false,
    reportMentions: false,
  };
  const seen = new Set<string>();
  for (let index = 0; index < args.length; index += 1) {
    const flag = args[index]!;
    if (seen.has(flag)) {
      throw new Error(`Duplicate flag: ${flag}`);
    }
    seen.add(flag);
    const booleanName = booleanFlags.get(flag as never);
    if (booleanName !== undefined) {
      options[booleanName] = true;
      continue;
    }
    const valueName = valueFlags.get(flag as never);
    if (valueName === undefined) {
      throw new Error(`Unknown flag: ${flag}`);
    }
    const value = args[index + 1];
    if (value === undefined || value.startsWith("--")) {
      throw new Error(`Missing value for ${flag}.`);
    }
    options[valueName] = value;
    index += 1;
  }
  if (options.storedOnly) {
    if (
      options.sourceRoot !== undefined ||
      options.family !== undefined ||
      options.cleanupCandidate ||
      options.closed ||
      options.reportMentions
    ) {
      throw new Error("--stored-only is exclusive with every external checkout option.");
    }
    return options;
  }
  if (options.sourceRoot === undefined) {
    throw new Error("Choose --stored-only or --source-root with explicit --family.");
  }
  if (options.family === undefined) {
    throw new Error("External mode requires explicit --family core-route.");
  }
  if (options.family !== "core-route") {
    throw new Error("External mode currently supports only --family core-route.");
  }
  if (options.cleanupCandidate && options.closed) {
    throw new Error("--cleanup-candidate and --closed are exclusive phases.");
  }
  if (options.reportMentions && (options.cleanupCandidate || options.closed)) {
    throw new Error("--report-mentions may be combined only with normal readiness.");
  }
  return options;
}

async function readStoredArtifacts(projectRoot: string, familyId: string): Promise<{
  inventory: CoreMarkdownInventory;
  familyMap: CoreFamilyMap;
  coverage: FamilyCoverage;
}> {
  const root = join(projectRoot, "migrations", "V0_1_0a_1", "core");
  const [inventory, familyMap, coverage] = await Promise.all([
    readFile(join(root, "inventory.json"), "utf8"),
    readFile(join(root, "family-map.json"), "utf8"),
    readFile(join(root, "families", familyId, "coverage.json"), "utf8"),
  ]);
  return {
    inventory: JSON.parse(inventory) as CoreMarkdownInventory,
    familyMap: JSON.parse(familyMap) as CoreFamilyMap,
    coverage: JSON.parse(coverage) as FamilyCoverage,
  };
}

export async function runCoreDocsCheck(
  args: string[],
  projectRoot = resolve(process.cwd()),
): Promise<CoreDocsCheckResult> {
  const options = parseArgs(args);
  const diagnostics = await validateStoredCoreMigration(projectRoot);
  if (diagnostics.length > 0) {
    throw new ProjectValidationError(diagnostics);
  }
  if (options.storedOnly) {
    return undefined;
  }
  const familyId = options.family!;
  const artifacts = await readStoredArtifacts(projectRoot, familyId);
  const input = {
    projectRoot,
    sourceRoot: options.sourceRoot!,
    ...artifacts,
  };
  const readiness = options.closed
    ? await verifyFamilyCleanup(input)
    : await evaluateFamilyDeletionReadiness({
        ...input,
        phase: options.cleanupCandidate ? "cleanup-candidate" : "normal",
      });
  if (options.reportMentions) {
    return {
      readiness,
      mentions: await collectCoveredPathMentions(
        options.sourceRoot!,
        artifacts.coverage.sources
          .filter((source) => source.disposition !== "repo-local-keep")
          .map((source) => source.path),
      ),
    };
  }
  return readiness;
}

async function runCli(): Promise<void> {
  try {
    const result = await runCoreDocsCheck(process.argv.slice(2));
    if (result !== undefined) {
      process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
      const readiness = "readiness" in result ? result.readiness : result;
      if (!readiness.ready) {
        process.exitCode = 1;
      }
    }
  } catch (error: unknown) {
    if (error instanceof ProjectValidationError) {
      process.stderr.write(`${formatProjectDiagnostics(error.diagnostics)}\n`);
    } else {
      process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    }
    process.exitCode = 1;
  }
}

if (process.argv[1] !== undefined && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  void runCli();
}
