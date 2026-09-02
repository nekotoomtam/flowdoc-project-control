import { execFileSync } from "node:child_process";
import { dirname, resolve, sep } from "node:path";

function resolveProjectControlRoot(projectRoot: string): string {
  const absoluteProjectRoot = resolve(projectRoot);
  const gitCommonDir = resolveGitCommonDir(absoluteProjectRoot);
  if (gitCommonDir?.endsWith(`${sep}.git`) === true) {
    return dirname(gitCommonDir);
  }

  const worktreeMarker = `${sep}.worktrees${sep}`;
  const worktreeMarkerIndex = absoluteProjectRoot.lastIndexOf(worktreeMarker);
  return worktreeMarkerIndex === -1
    ? absoluteProjectRoot
    : absoluteProjectRoot.slice(0, worktreeMarkerIndex);
}

function resolveGitCommonDir(projectRoot: string): string | null {
  try {
    const output = execFileSync(
      "git",
      ["-C", projectRoot, "rev-parse", "--path-format=absolute", "--git-common-dir"],
      { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
    ).trim();
    return output.length === 0 ? null : resolve(output);
  } catch {
    return null;
  }
}

export function resolveCoreEvidenceRoot(projectRoot: string): string {
  const projectControlRoot = resolveProjectControlRoot(projectRoot);

  return resolve(
    projectControlRoot,
    "..",
    "flowdoc-vnext-core",
  );
}
