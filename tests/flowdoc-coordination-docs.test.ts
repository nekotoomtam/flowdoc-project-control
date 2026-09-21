import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { loadAndValidateProject } from "../tools/lib/validate-semantics.js";

const read = (path: string) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

describe("coordination controls documentation boundary", () => {
  it("keeps the registered control and implementation plan discoverable", async () => {
    const sources = await loadAndValidateProject(process.cwd());
    const work = sources.work.find((entry) => entry.value.id === "agent-and-skill-design")?.value;
    expect(work?.contextDocumentIds).toEqual(expect.arrayContaining([
      "doc-flowdoc-coordination-controls",
      "doc-flowdoc-coordination-hardening-plan-2026-09-10",
    ]));
    expect(sources.phases.some((entry) => entry.value.id === "phase-agent-and-skill-design-coordination-six")).toBe(true);
  });

  it("routes operating entrypoints to one six-control authority", async () => {
    for (const path of [
      "AGENTS.md", "docs/domains/flowdoc-global-codex-guidance.md",
      "docs/domains/flowdoc-delivery-operating-model.md",
      "docs/domains/flowdoc-plan-room-orchestration-rules.md",
      "docs/domains/flowdoc-work-type-routing-model.md",
      "docs/domains/flowdoc-lean-dispatch-operating-rules.md",
      "docs/domains/flowdoc-role-catalog.md",
      "docs/domains/flowdoc-round-workflow.md",
      "docs/domains/work-tree-operating-rules.md",
      "docs/domains/agent-and-skill-operating-model.md",
    ]) {
      expect(await read(path), path).toContain("flowdoc-coordination-controls.md");
    }
  });

  it("does not retain the contradictory unconditional cleanup permission gate", async () => {
    expect(await read("docs/domains/flowdoc-role-catalog.md"))
      .not.toContain("Delete branch refs before the user approves branch cleanup.");
    const controls = await read("docs/domains/flowdoc-coordination-controls.md");
    expect(controls).toContain("Historical, abandoned, unmerged, dirty or unknown lanes");
    expect(controls).toContain("does not grant blanket permission");
    expect(controls).toContain("not a distributed mutex");
    expect(controls).toContain("Receipt is not");
    expect(controls).toContain("WORK does not inherit that choice");
    expect(controls).toContain("Mechanism PASS can be recorded while UX remains pending");
    expect(controls).toContain("One PLAN task owns exactly one execution round");
    expect(controls).toContain("Version 1 coordination is historical and read-only");
    expect(controls).toContain("Cross-PLAN ownership transfer is not supported");
    expect(controls).toContain("Historical Recovery Work");
    expect(controls).not.toContain("Ownership transfer names the old and new PLAN");
  });
});
