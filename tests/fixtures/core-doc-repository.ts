import { execFile as execFileCallback } from "node:child_process";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";

const execFile = promisify(execFileCallback);

export interface CoreDocRepositoryFixture {
  root: string;
  commit: string;
}

async function runGit(root: string, args: string[]): Promise<string> {
  const { stdout } = await execFile("git", args, { cwd: root, encoding: "utf8" });
  return stdout.trim();
}

export async function createCoreDocRepository(): Promise<CoreDocRepositoryFixture> {
  const root = await mkdtemp(join(tmpdir(), "flowdoc-core-doc-"));

  await runGit(root, ["init"]);
  await runGit(root, ["config", "user.name", "Flowdoc Test"]);
  await runGit(root, ["config", "user.email", "flowdoc-test@example.invalid"]);
  await mkdir(join(root, "docs"), { recursive: true });
  await writeFile(
    join(root, "README.md"),
    [
      "# Repository overview",
      "",
      "[route](docs/CORE_ROUTE_SAMPLE.md#summary)",
      "[route with query](docs/CORE_ROUTE_SAMPLE.md?view=full)",
      "[external](https://example.invalid/guide.md)",
      "[mail](mailto:docs@example.invalid)",
      "![image](docs/CORE_ROUTE_SAMPLE.md)",
      "[reference][route-reference]",
      "[route-reference]: docs/CORE_ROUTE_SAMPLE.md",
      "",
      "`src/generation/runtime.ts` `tests/runtime.test.ts` `schemas/runtime.schema.json`",
      "",
      "```md",
      "[ignored](docs/CORE_ROUTE_SAMPLE.md)",
      "`src/ignored.ts`",
      "```",
    ].join("\n"),
    "utf8",
  );
  await writeFile(
    join(root, "docs", "CORE_ROUTE_SAMPLE.md"),
    "# Core route sample\n\n[anchor](#summary)\n",
    "utf8",
  );
  await writeFile(join(root, "runtime.ts"), "export const runtime = true;\n", "utf8");
  await runGit(root, ["add", "."]);
  await runGit(root, ["commit", "-m", "fixture"]);

  return { root, commit: await runGit(root, ["rev-parse", "HEAD"]) };
}
