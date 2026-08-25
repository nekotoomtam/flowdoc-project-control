import { resolve, sep } from "node:path";

export function resolveCoreEvidenceRoot(projectRoot: string): string {
  const absoluteProjectRoot = resolve(projectRoot);
  const worktreeMarker = `${sep}.worktrees${sep}`;
  const worktreeMarkerIndex = absoluteProjectRoot.lastIndexOf(worktreeMarker);
  const projectControlRoot = worktreeMarkerIndex === -1
    ? absoluteProjectRoot
    : absoluteProjectRoot.slice(0, worktreeMarkerIndex);

  return resolve(
    projectControlRoot,
    "..",
    "flowdoc-vnext-core",
  );
}
