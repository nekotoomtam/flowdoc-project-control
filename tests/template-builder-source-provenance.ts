import { execFile as execFileCallback } from "node:child_process";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { promisify } from "node:util";
import { expect } from "vitest";

interface Inventory {
  sourceCommit: string;
  files: Array<{ path: string; blobId: string }>;
}

interface SourceProvenanceContract {
  projectRoot: string;
  coreEvidenceRoot: string;
  sourcePaths: readonly string[];
  expectedCount: number;
  expectedFingerprint: string;
  frozenCommit: string;
  currentCommit: string;
}

const execFile = promisify(execFileCallback);

function sourceFingerprint(
  sourcePaths: readonly string[],
  blobsByPath: ReadonlyMap<string, string>,
): string {
  const rows = sourcePaths.map((path) => `${path}\0${blobsByPath.get(path) ?? ""}`);
  return createHash("sha256").update(rows.join("\n"), "utf8").digest("hex");
}

async function coreGit(coreEvidenceRoot: string, args: string[]): Promise<string> {
  const { stdout } = await execFile("git", args, { cwd: coreEvidenceRoot, encoding: "utf8" });
  return stdout.trim();
}

export async function expectFrozenCurrentSourceProvenance(
  contract: SourceProvenanceContract,
): Promise<void> {
  const inventory = JSON.parse(
    await readFile(join(contract.projectRoot, "migrations/V0_1_0a_1/core/inventory.json"), "utf8"),
  ) as Inventory;
  const blobsByPath = new Map(inventory.files.map(({ path, blobId }) => [path, blobId]));

  expect(inventory.sourceCommit).toBe(contract.frozenCommit);
  expect(contract.sourcePaths).toHaveLength(contract.expectedCount);
  expect(new Set(contract.sourcePaths).size).toBe(contract.expectedCount);
  expect(sourceFingerprint(contract.sourcePaths, blobsByPath)).toBe(contract.expectedFingerprint);
  expect(await coreGit(contract.coreEvidenceRoot, ["rev-parse", "--verify", `${contract.frozenCommit}^{commit}`]))
    .toBe(contract.frozenCommit);
  expect(await coreGit(contract.coreEvidenceRoot, ["rev-parse", "--verify", `${contract.currentCommit}^{commit}`]))
    .toBe(contract.currentCommit);
  expect(await coreGit(contract.coreEvidenceRoot, ["rev-parse", "HEAD"]))
    .toBe(contract.currentCommit);

  await Promise.all(contract.sourcePaths.map(async (path) => {
    const expectedBlob = blobsByPath.get(path);
    expect(expectedBlob).toMatch(/^[0-9a-f]{40}$/);
    const [frozenBlob, currentBlob] = await Promise.all([
      coreGit(contract.coreEvidenceRoot, ["rev-parse", `${contract.frozenCommit}:${path}`]),
      coreGit(contract.coreEvidenceRoot, ["rev-parse", `${contract.currentCommit}:${path}`]),
    ]);
    expect(frozenBlob).toBe(expectedBlob);
    expect(currentBlob).toBe(expectedBlob);
  }));
}
