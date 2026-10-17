import { execFile as execFileCallback } from "node:child_process";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { afterEach, describe, expect, it } from "vitest";
import { GitScopeInspectionError, inspectGitScope } from "../tools/lib/git-scope-verifier.js";

const execFile = promisify(execFileCallback);
const temporaryRoots: string[] = [];

afterEach(async () => {
  await Promise.all(temporaryRoots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

async function git(root: string, ...args: string[]): Promise<string> {
  const { stdout } = await execFile("git", args, { cwd: root, encoding: "utf8" });
  return stdout.trim();
}

async function repository(prefix = "flowdoc-scope-git-"): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), prefix));
  temporaryRoots.push(root);
  await git(root, "init");
  await git(root, "config", "user.name", "FlowDoc Test");
  await git(root, "config", "user.email", "flowdoc@example.invalid");
  return root;
}

async function commitAll(root: string, message: string): Promise<string> {
  await git(root, "add", "--all");
  await git(root, "commit", "-m", message);
  return git(root, "rev-parse", "HEAD");
}

describe("Git Scope Lock inspection", () => {
  it("returns committed, staged, unstaged, untracked, rename, deletion, and spaced paths", async () => {
    const root = await repository();
    await writeFile(join(root, ".gitignore"), "*.ignored\n", "utf8");
    await writeFile(join(root, "tracked.txt"), "base\n", "utf8");
    await writeFile(join(root, "delete.txt"), "delete\n", "utf8");
    await writeFile(join(root, "rename-old.txt"), "rename\n", "utf8");
    await writeFile(join(root, "space name.txt"), "base\n", "utf8");
    const baseCommit = await commitAll(root, "base");

    await writeFile(join(root, "tracked.txt"), "committed\n", "utf8");
    await writeFile(join(root, "space name.txt"), "committed space\n", "utf8");
    await git(root, "mv", "rename-old.txt", "rename-new.txt");
    const expectedHead = await commitAll(root, "candidate");

    await writeFile(join(root, "staged.txt"), "staged\n", "utf8");
    await git(root, "add", "staged.txt");
    await rm(join(root, "delete.txt"));
    await writeFile(join(root, "untracked.txt"), "untracked\n", "utf8");
    await writeFile(join(root, "hidden.ignored"), "ignored\n", "utf8");

    const manifest = await inspectGitScope({ worktree: root, baseCommit, expectedHead });
    expect(manifest.dirty).toBe(true);
    expect(manifest.entries).toEqual(expect.arrayContaining([
      expect.objectContaining({ source: "committed", kind: "modified", path: "tracked.txt" }),
      expect.objectContaining({ source: "committed", kind: "modified", path: "space name.txt" }),
      expect.objectContaining({ source: "committed", kind: "renamed", path: "rename-new.txt", previousPath: "rename-old.txt" }),
      expect.objectContaining({ source: "staged", kind: "added", path: "staged.txt" }),
      expect.objectContaining({ source: "unstaged", kind: "deleted", path: "delete.txt" }),
      expect.objectContaining({ source: "untracked", kind: "untracked", path: "untracked.txt" }),
    ]));
    expect(manifest.entries.some(({ path }) => path === "hidden.ignored")).toBe(false);
  });

  it("surfaces a dirty submodule as a changed path", async () => {
    const child = await repository("flowdoc-scope-submodule-child-");
    await writeFile(join(child, "child.txt"), "base\n", "utf8");
    await commitAll(child, "child base");

    const root = await repository("flowdoc-scope-submodule-parent-");
    await git(root, "-c", "protocol.file.allow=always", "submodule", "add", child, "vendor/child");
    const baseCommit = await commitAll(root, "parent base");
    await writeFile(join(root, "vendor", "child", "child.txt"), "dirty\n", "utf8");

    const manifest = await inspectGitScope({ worktree: root, baseCommit, expectedHead: baseCommit });
    expect(manifest.entries).toContainEqual({
      source: "submodule",
      kind: "submodule",
      path: "vendor/child",
    });
    expect(manifest.dirty).toBe(true);
  });

  it.each([
    ["unexpected root", "GIT_SCOPE_UNEXPECTED_ROOT"],
    ["wrong base", "GIT_SCOPE_BASE_MISMATCH"],
    ["wrong HEAD", "GIT_SCOPE_HEAD_MISMATCH"],
  ])("rejects %s", async (scenario, code) => {
    const root = await repository();
    await writeFile(join(root, "tracked.txt"), "base\n", "utf8");
    const baseCommit = await commitAll(root, "base");
    let worktree = root;
    let requestedBase = baseCommit;
    let expectedHead = baseCommit;
    if (scenario === "unexpected root") {
      worktree = join(root, "nested");
      await mkdir(worktree);
    } else if (scenario === "wrong base") {
      requestedBase = "a".repeat(40);
    } else {
      expectedHead = "b".repeat(40);
    }

    await expect(inspectGitScope({ worktree, baseCommit: requestedBase, expectedHead })).rejects.toEqual(
      expect.objectContaining<Partial<GitScopeInspectionError>>({ code }),
    );
  });
});
