import { parseArgs } from "node:util";
import { resolve } from "node:path";
import { buildWorkContext } from "../src/model/work-context.js";
import { buildGovernanceCostSnapshot } from "../src/model/current-truth-snapshot.js";
import { buildProjectReadModel } from "./lib/build-read-model.js";
import { loadAndValidateProject } from "./lib/validate-semantics.js";

try {
  const { values } = parseArgs({ options: {
    work: { type: "string" }, room: { type: "string" }, root: { type: "string" },
  } });
  if (values.work === undefined) throw new Error("Usage: npm run context -- --work <id> [--room <roomRunId>] [--root <path>]");
  // Always rebuild from validated canonical sources, never trust a stale generated index.
  const model = await buildProjectReadModel(await loadAndValidateProject(resolve(values.root ?? process.cwd())));
  const view = buildWorkContext({ ...model, generatedAt: model.currentSnapshot.generatedAt }, {
    workId: values.work, ...(values.room === undefined ? {} : { roomRunId: values.room }),
  });
  process.stdout.write(`${JSON.stringify({
    sourceDigest: model.sourceDigest,
    ...view,
    workCost: buildGovernanceCostSnapshot({ ...model, generatedAt: model.currentSnapshot.generatedAt }, values.work),
  }, null, 2)}\n`);
} catch (error) {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
}
