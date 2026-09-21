import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { loadAndValidateProject } from "../tools/lib/validate-semantics.js";
import { createCoordinationRegistryV2Fixture } from "./fixtures/coordination-registry-v2.js";
import { createProjectFixture } from "./fixtures/project-source.js";

async function mutateTask(
  mutate: (work: Record<string, unknown>) => void,
): Promise<string> {
  const root = await createProjectFixture({ valid: true, newContractTask: true });
  const path = join(root, "data", "work", "pilot-task.json");
  const work = JSON.parse(await readFile(path, "utf8")) as Record<string, unknown>;
  mutate(work);
  await writeFile(path, JSON.stringify(work));
  return root;
}

describe("Historical Recovery Work", () => {
  it("rejects coordination on Historical Recovery Work", async () => {
    const root = await mutateTask((work) => {
      const registry = createCoordinationRegistryV2Fixture();
      registry.round.workId = "pilot-task";
      work.executionMode = "historical-recovery";
      work.activeRole = "evidence-reviewer";
      work.coordination = registry;
    });

    await expect(loadAndValidateProject(root)).rejects.toMatchObject({
      diagnostics: expect.arrayContaining([
        expect.objectContaining({ code: "HISTORICAL_RECOVERY_COORDINATION_FORBIDDEN" }),
      ]),
    });
  });

  it("requires task scope and a read-only recovery role", async () => {
    const root = await mutateTask((work) => {
      work.executionMode = "historical-recovery";
      work.workKind = "topic";
      work.activeRole = "product-implementation-agent";
    });

    await expect(loadAndValidateProject(root)).rejects.toMatchObject({
      diagnostics: expect.arrayContaining([
        expect.objectContaining({ code: "HISTORICAL_RECOVERY_TASK_REQUIRED" }),
        expect.objectContaining({ code: "HISTORICAL_RECOVERY_READ_ONLY_ROLE_REQUIRED" }),
      ]),
    });
  });
});
