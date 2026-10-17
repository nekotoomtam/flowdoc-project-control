import { readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { Ajv2020 } from "ajv/dist/2020.js";

import { writeFileAtomically } from "../lib/write-atomic.js";
import { buildCandidateFamilyMap, buildCoreMarkdownInventory } from "./lib/inventory.js";

export const FROZEN_CORE_COMMIT = "76a2f2311a898e781f53773390d47b05812911e4";

interface InventoryCliOptions {
  sourceRoot: string;
  sourceCommit: string;
  outputRoot: string;
}

const FLAG_NAMES = {
  "--source-root": "sourceRoot",
  "--source-commit": "sourceCommit",
  "--output-root": "outputRoot",
} as const;

function assertCommit(value: string, label: string): void {
  if (!/^[0-9a-fA-F]{40}$/.test(value)) {
    throw new Error(`${label} must contain exactly 40 hexadecimal characters.`);
  }
}

function parseArgs(args: string[]): InventoryCliOptions {
  const values: Partial<InventoryCliOptions> = {};

  for (let index = 0; index < args.length; index += 2) {
    const flag = args[index];
    if (flag === undefined || !(flag in FLAG_NAMES)) {
      throw new Error(`Unknown flag: ${flag ?? "<missing>"}`);
    }
    const name = FLAG_NAMES[flag as keyof typeof FLAG_NAMES];
    if (values[name] !== undefined) {
      throw new Error(`Duplicate flag: ${flag}`);
    }
    const value = args[index + 1];
    if (value === undefined || value.startsWith("--")) {
      throw new Error(`Missing value for ${flag}.`);
    }
    values[name] = value;
  }

  for (const [flag, name] of Object.entries(FLAG_NAMES)) {
    if (values[name] === undefined) {
      throw new Error(`Missing required flag: ${flag}`);
    }
  }

  return values as InventoryCliOptions;
}

async function validateArtifacts(inventory: unknown, familyMap: unknown): Promise<void> {
  const moduleDirectory = dirname(fileURLToPath(import.meta.url));
  const schemaPath = resolve(moduleDirectory, "../../schemas/document-migration.schema.json");
  const schema = JSON.parse(await readFile(schemaPath, "utf8")) as object;
  const validate = new Ajv2020({ allErrors: true, strict: true }).compile(schema);

  for (const [name, artifact] of [["inventory", inventory], ["family map", familyMap]] as const) {
    if (!validate(artifact)) {
      throw new Error(`${name} failed schema validation: ${JSON.stringify(validate.errors)}`);
    }
  }
}

export async function runInventoryCli(
  args: string[],
  expectedSourceCommit = FROZEN_CORE_COMMIT,
): Promise<void> {
  const options = parseArgs(args);
  assertCommit(options.sourceCommit, "--source-commit");
  assertCommit(expectedSourceCommit, "expected source commit");
  if (options.sourceCommit.toLowerCase() !== expectedSourceCommit.toLowerCase()) {
    throw new Error(`--source-commit does not match the expected source commit ${expectedSourceCommit}.`);
  }

  const inventory = await buildCoreMarkdownInventory({
    repositoryRoot: options.sourceRoot,
    repositoryId: "repo-core",
    releaseLine: "V0_1_0a_1",
    sourceCommit: options.sourceCommit,
  });
  const familyMap = buildCandidateFamilyMap(inventory);
  await validateArtifacts(inventory, familyMap);

  const inventoryJson = `${JSON.stringify(inventory, null, 2)}\n`;
  const familyMapJson = `${JSON.stringify(familyMap, null, 2)}\n`;
  await writeFileAtomically(join(options.outputRoot, "inventory.json"), inventoryJson);
  await writeFileAtomically(join(options.outputRoot, "family-map.json"), familyMapJson);
}

async function runCli(): Promise<void> {
  try {
    await runInventoryCli(process.argv.slice(2));
  } catch (error: unknown) {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  }
}

if (process.argv[1] !== undefined && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  void runCli();
}
