import { access, appendFile, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  generateProjectIndex,
  generateToString,
} from "../tools/generate.js";
import { checkProjectIndex } from "../tools/check.js";
import {
  createProjectFixture,
  mutateNodeIntoCycle,
} from "./fixtures/project-source.js";

describe("project index generation", () => {
  it("produces byte-identical output for identical sources", async () => {
    const root = await createProjectFixture({ valid: true });

    const first = await generateToString(root);
    const second = await generateToString(root);

    expect(second).toBe(first);
    expect(JSON.parse(first)).not.toHaveProperty("generatedAt");
    expect(first.endsWith("\n")).toBe(true);
  });

  it("preserves the last valid index when later validation fails", async () => {
    const root = await createProjectFixture({ valid: true });
    await generateProjectIndex(root);
    const indexPath = join(root, "generated", "project-index.json");
    const before = await readFile(indexPath, "utf8");

    await mutateNodeIntoCycle(root);

    await expect(generateProjectIndex(root)).rejects.toThrow();
    expect(await readFile(indexPath, "utf8")).toBe(before);
    expect(
      JSON.parse(
        await readFile(join(root, "generated", "project-diagnostics.json"), "utf8"),
      ).diagnostics,
    ).toEqual(expect.arrayContaining([expect.objectContaining({ code: "NODE_CYCLE" })]));
  });

  it("writes an actionable diagnostic when publishing a valid index fails unexpectedly", async () => {
    const root = await createProjectFixture({ valid: true });
    await generateProjectIndex(root);
    const indexPath = join(root, "generated", "project-index.json");
    const before = await readFile(indexPath, "utf8");

    await rm(indexPath);
    await mkdir(indexPath);

    await expect(generateProjectIndex(root)).rejects.toThrow();
    expect(await readFile(join(root, "generated", "project-diagnostics.json"), "utf8"))
      .toContain("PROJECT_GENERATION_FAILED");
    expect(await readFile(join(root, "generated", "project-diagnostics.json"), "utf8"))
      .not.toContain(root);
    expect(before).toContain('"schemaVersion": 1');
  });

  it("sorts records, embeds Markdown, and changes digest only when source changes", async () => {
    const root = await createProjectFixture({ valid: true, shuffledCreationOrder: true });

    const first = JSON.parse(await generateToString(root));

    expect(first.nodes.map((node: { id: string }) => node.id)).toEqual(["flowdoc"]);
    expect(first.nodes[0].childIds).toEqual([]);
    expect(first.nodes[0].workIds).toEqual(["pilot"]);
    expect(first.documents[0].content).toContain("# Overview");
    await appendFile(join(root, "docs", "overview.md"), "\nChanged.\n");
    const second = JSON.parse(await generateToString(root));

    expect(second.sourceDigest).not.toBe(first.sourceDigest);
  });

  it("normalizes Markdown line endings before indexing and hashing", async () => {
    const root = await createProjectFixture({ valid: true });
    const markdownPath = join(root, "docs", "overview.md");
    await writeFile(markdownPath, "# Overview\r\n");

    const first = JSON.parse(await generateToString(root));
    await writeFile(markdownPath, "# Overview\n");
    const second = JSON.parse(await generateToString(root));

    expect(first.documents[0].content).toBe("# Overview\n");
    expect(second.sourceDigest).toBe(first.sourceDigest);
  });

  it("distinguishes source tuples that collide without content framing", async () => {
    const firstRoot = await createProjectFixture({ valid: true });
    const secondRoot = await createProjectFixture({ valid: true });
    const secondPath = "docs/second.md";
    const firstContent = `prefix${secondPath}\0suffix`;
    const secondContent = `suffix${secondPath}\0tail`;

    await Promise.all([
      addSecondDocument(firstRoot),
      addSecondDocument(secondRoot),
    ]);
    await Promise.all([
      writeFile(join(firstRoot, "docs", "overview.md"), firstContent),
      writeFile(join(firstRoot, "docs", "second.md"), "tail"),
      writeFile(join(secondRoot, "docs", "overview.md"), "prefix"),
      writeFile(join(secondRoot, "docs", "second.md"), secondContent),
    ]);

    const first = JSON.parse(await generateToString(firstRoot));
    const second = JSON.parse(await generateToString(secondRoot));

    expect(first.documents.map((document: { content: string }) => document.content)).not.toEqual(
      second.documents.map((document: { content: string }) => document.content),
    );
    expect(first.sourceDigest).not.toBe(second.sourceDigest);
  });

  it("detects a stale byte without rewriting it", async () => {
    const root = await createProjectFixture({ valid: true });
    await generateProjectIndex(root);
    const target = join(root, "generated", "project-index.json");
    await appendFile(target, " ");
    const stale = await readFile(target, "utf8");

    await expect(checkProjectIndex(root)).rejects.toMatchObject({ code: "PROJECT_INDEX_STALE" });
    expect(await readFile(target, "utf8")).toBe(stale);
  });

  it("clears diagnostics only after a valid index is published", async () => {
    const root = await createProjectFixture({ valid: true });
    await mkdir(join(root, "generated"), { recursive: true });
    await writeFile(
      join(root, "generated", "project-diagnostics.json"),
      JSON.stringify({
        schemaVersion: 1,
        diagnostics: [
          {
            code: "NODE_CYCLE",
            message: "cycle",
            file: "data/nodes/flowdoc.json",
            hint: "Break the cycle.",
          },
        ],
      }),
    );

    await generateProjectIndex(root);

    await expect(access(join(root, "generated", "project-diagnostics.json"))).rejects.toThrow();
    await expect(checkProjectIndex(root)).resolves.toBeUndefined();
  });
});

async function addSecondDocument(root: string): Promise<void> {
  const nodePath = join(root, "data", "nodes", "flowdoc.json");
  const node = JSON.parse(await readFile(nodePath, "utf8")) as { documentIds: string[] };
  node.documentIds.push("doc-second");
  await Promise.all([
    writeFile(nodePath, JSON.stringify(node)),
    writeFile(
      join(root, "data", "documents", "doc-second.json"),
      JSON.stringify({
        kind: "document",
        id: "doc-second",
        title: "Second",
        path: "docs/second.md",
        nodeIds: ["flowdoc"],
        role: "current-state",
        authority: "Project Control",
        lifecycle: "active",
        repositoryRefs: [],
      }),
    ),
  ]);
}
