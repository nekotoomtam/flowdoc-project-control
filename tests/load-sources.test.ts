import { mkdir, writeFile } from "node:fs/promises";
import type { PathLike } from "node:fs";
import { join } from "node:path";
import { describe, expect, it, vi } from "vitest";

const readFailure = vi.hoisted(() => ({
  sourcePath: undefined as string | undefined,
}));

vi.mock("node:fs/promises", async (importOriginal) => {
  const actual = await importOriginal<typeof import("node:fs/promises")>();

  return {
    ...actual,
    readFile: async (path: PathLike, options?: "utf8") => {
      if (readFailure.sourcePath !== undefined && path.toString() === readFailure.sourcePath) {
        throw new Error(`EACCES: permission denied, open '${readFailure.sourcePath}'`);
      }
      return actual.readFile(path, options);
    },
  };
});

import { loadProjectSources } from "../tools/lib/load-sources.js";
import { createProjectFixture } from "./fixtures/project-source.js";

describe("loadProjectSources", () => {
  it("discovers one record per file in stable path order", async () => {
    const root = await createProjectFixture({ valid: true });

    const loaded = await loadProjectSources(root);

    expect(loaded.records.map((entry) => entry.relativePath)).toEqual([
      "data/documents/doc-overview.json",
      "data/evidence/evidence-design.json",
      "data/nodes/flowdoc.json",
      "data/repositories/project-control.json",
      "data/work/pilot.json",
    ]);
  });

  it("reports malformed JSON with file and repair hint", async () => {
    const root = await createProjectFixture({ valid: true, malformedNodeJson: true });

    await expect(loadProjectSources(root)).rejects.toMatchObject({
      diagnostics: [
        expect.objectContaining({
          code: "JSON_PARSE_ERROR",
          file: "data/nodes/flowdoc.json",
          hint: "Fix the JSON syntax before generating the project index.",
        }),
      ],
    });
  });

  it("reports a source read failure without leaking the absolute source path", async () => {
    const root = await createProjectFixture({ valid: true });
    const sourcePath = join(root, "data", "nodes", "flowdoc.json");
    readFailure.sourcePath = sourcePath;

    try {
      await expect(loadProjectSources(root)).rejects.toMatchObject({
        diagnostics: [
          expect.objectContaining({
            code: "SOURCE_READ_ERROR",
            file: "data/nodes/flowdoc.json",
            hint: "Check that the source file is readable before generating the project index.",
          }),
        ],
      });

      await loadProjectSources(root).catch((error: unknown) => {
        const serialized = JSON.stringify(error);
        expect(serialized).not.toContain(root);
        expect(serialized).not.toContain(sourcePath);
      });
    } finally {
      readFailure.sourcePath = undefined;
    }
  });

  it("orders source paths and diagnostics by Unicode code units", async () => {
    const root = await createProjectFixture({ valid: true });
    const node = await import("node:fs/promises").then(({ readFile }) =>
      readFile(join(root, "data", "nodes", "flowdoc.json"), "utf8"),
    );
    await Promise.all([
      writeFile(join(root, "data", "nodes", "Z.json"), node),
      writeFile(join(root, "data", "nodes", "a.json"), node),
    ]);

    const loaded = await loadProjectSources(root);
    expect(loaded.nodes.map((entry) => entry.relativePath)).toEqual([
      "data/nodes/Z.json",
      "data/nodes/a.json",
      "data/nodes/flowdoc.json",
    ]);

    await Promise.all([
      writeFile(join(root, "data", "Z.json"), "{}"),
      writeFile(join(root, "data", "a.json"), "{}"),
    ]);

    await expect(loadProjectSources(root)).rejects.toMatchObject({
      diagnostics: [
        expect.objectContaining({ file: "data/Z.json" }),
        expect.objectContaining({ file: "data/a.json" }),
      ],
    });
  });

  it("rejects nested and unexpected JSON files in stable path order", async () => {
    const root = await createProjectFixture({ valid: true });
    await mkdir(join(root, "data", "nodes", "nested"));
    await Promise.all([
      writeFile(join(root, "data", "nodes", "nested", "other.json"), "{}"),
      writeFile(join(root, "data", "unexpected.json"), "{}"),
    ]);

    await expect(loadProjectSources(root)).rejects.toMatchObject({
      diagnostics: [
        expect.objectContaining({
          code: "UNEXPECTED_JSON_FILE",
          file: "data/nodes/nested/other.json",
        }),
        expect.objectContaining({
          code: "UNEXPECTED_JSON_FILE",
          file: "data/unexpected.json",
        }),
      ],
    });
  });

  it.each([
    ["unknown property", { unknownNodeProperty: true }, "SCHEMA_ADDITIONAL_PROPERTY"],
    ["wrong directory kind", { nodeFileContainsWork: true }, "RECORD_KIND_MISMATCH"],
    ["unsupported truth state", { invalidTruthState: true }, "SCHEMA_ENUM"],
    [
      "tracked localPath field",
      { repositoryLocalPath: "C:/private/core" },
      "SCHEMA_ADDITIONAL_PROPERTY",
    ],
  ])("rejects %s", async (_name, mutation, code) => {
    const root = await createProjectFixture({ valid: true, ...mutation });

    await expect(loadProjectSources(root)).rejects.toMatchObject({
      diagnostics: expect.arrayContaining([expect.objectContaining({ code })]),
    });
  });
});
