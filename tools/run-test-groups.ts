import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { readdir } from "node:fs/promises";
import { join } from "node:path";

import {
  defaultTestGroupIds,
  getTestGroup,
  groupContainsTestFile,
  testGroups,
  type TestGroupDefinition,
} from "./lib/test-groups.js";

const args = process.argv.slice(2);

if (args.includes("--help") || args.length === 0) {
  printUsage();
  process.exit(args.includes("--help") ? 0 : 1);
}

const selectedGroupIds = args.includes("--all") ? defaultTestGroupIds : args;
const selectedGroups = selectedGroupIds.map((groupId) => {
      const group = getTestGroup(groupId);
      if (group === undefined) {
        throw new Error(
          `Unknown test group "${groupId}". Known groups: ${testGroups
            .map(({ id }) => id)
            .join(", ")}`,
        );
      }
      return group;
    });

for (const group of selectedGroups) {
  const testFiles = await collectGroupTestFiles(group);
  if (testFiles.length === 0) {
    throw new Error(`Test group "${group.id}" did not match any files.`);
  }
  console.log(
    `[test-group] ${group.id}: ${group.description} (${testFiles.length} files)`,
  );
  const exitCode = await runVitestGroup(testFiles);
  if (exitCode !== 0) {
    process.exit(exitCode);
  }
}

function printUsage() {
  console.log(`Usage: tsx tools/run-test-groups.ts --all | ${testGroups
    .map(({ id }) => id)
    .join(" | ")}`);
}

async function collectGroupTestFiles(
  group: TestGroupDefinition,
): Promise<string[]> {
  const allUnitTestFiles = [
    ...(await collectTestFiles("tests")).filter(
      (testPath) => !testPath.startsWith("tests/e2e/"),
    ),
    ...(await collectTestFiles("app/src")),
  ];

  return allUnitTestFiles.filter((testPath) =>
    groupContainsTestFile(testPath, group.id),
  );
}

async function collectTestFiles(root: string): Promise<string[]> {
  const files: string[] = [];

  async function walk(directory: string) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) {
        await walk(path);
        continue;
      }
      if (/\.(test|spec)\.tsx?$/u.test(entry.name)) {
        files.push(path.replace(/\\/g, "/"));
      }
    }
  }

  await walk(root);
  return files.sort((left, right) => left.localeCompare(right));
}

function runVitestGroup(testFiles: readonly string[]): Promise<number> {
  return new Promise((resolve, reject) => {
    const vitestArgs = ["run", ...testFiles, "--maxWorkers=1"];
    const child =
      process.platform === "win32"
        ? spawn(
            [getVitestExecutable(), ...vitestArgs]
              .map((argument) => quoteWindowsShellArgument(argument))
              .join(" "),
            { shell: true, stdio: "inherit" },
          )
        : spawn(getVitestExecutable(), vitestArgs, { stdio: "inherit" });

    child.on("error", reject);
    child.on("close", (code) => resolve(code ?? 1));
  });
}

function getVitestExecutable(): string {
  const executable = process.platform === "win32" ? "vitest.cmd" : "vitest";
  const localExecutable = join(
    process.cwd(),
    "node_modules",
    ".bin",
    executable,
  );
  return existsSync(localExecutable) ? localExecutable : executable;
}

function quoteWindowsShellArgument(argument: string): string {
  return `"${argument.replace(/"/g, '\\"')}"`;
}
