import { describe, expect, it } from "vitest";
import {
  canonicalScopeManifestDigest,
  collectScopeDefinitionIssues,
  evaluateScopeLock,
  normalizeRepositoryPath,
  pathWithinScope,
  resolveModelAvailability,
  type GitScopeManifest,
} from "../src/model/scope-lock.js";
import type { CompactCoordinationModelDecision } from "../src/model/types.js";
import type { WorkflowEconomyPacketV2 } from "../src/model/workflow-economy.js";
import { createCoordinationRegistryV3Fixture } from "./fixtures/coordination-registry-v3.js";

function currentPacket(): WorkflowEconomyPacketV2 {
  const packet = structuredClone(createCoordinationRegistryV3Fixture().roomRuns[0]!.packet);
  if (packet.policyId !== "flowdoc-workflow-economy-v2") throw new Error("Expected current packet fixture.");
  return packet;
}

function currentModelDecision(): {
  decision: CompactCoordinationModelDecision;
  registry: ReturnType<typeof createCoordinationRegistryV3Fixture>;
} {
  const registry = createCoordinationRegistryV3Fixture();
  const packet = registry.roomRuns[0]!.packet;
  if (packet.policyId !== "flowdoc-workflow-economy-v2") throw new Error("Expected current packet fixture.");
  return { decision: packet.modelDecision, registry };
}

describe("Scope Lock path definitions", () => {
  it("normalizes repository-relative separators and preserves segment boundaries", () => {
    expect(normalizeRepositoryPath("./src\\model//nested/")).toBe("src/model/nested");
    expect(pathWithinScope("src/model/file.ts", "src/model/")).toBe(true);
    expect(pathWithinScope("src/model-old/file.ts", "src/model/")).toBe(false);
  });

  it.each([
    "C:/repo/file.ts",
    "/repo/file.ts",
    "../outside.ts",
    "src/../outside.ts",
    ".",
    "./",
    "",
  ])("rejects invalid scope path %j", (scope) => {
    const packet = currentPacket();
    packet.allowedScope = [scope];

    expect(collectScopeDefinitionIssues(packet)).toContainEqual(
      expect.objectContaining({ code: "SCOPE_PATH_INVALID" }),
    );
  });

  it("rejects duplicate normalized paths and allowed/forbidden ancestry overlap", () => {
    const duplicate = currentPacket();
    duplicate.allowedScope = ["src/model/", "src\\model"];
    expect(collectScopeDefinitionIssues(duplicate)).toContainEqual(
      expect.objectContaining({ code: "SCOPE_PATH_DUPLICATE" }),
    );

    const overlap = currentPacket();
    overlap.allowedScope = ["src/model/"];
    overlap.forbiddenScope = ["src/model/private/"];
    expect(collectScopeDefinitionIssues(overlap)).toContainEqual(
      expect.objectContaining({ code: "SCOPE_OVERLAP" }),
    );
  });
});

describe("compact model availability", () => {
  it("resolves the selected pair through the referenced host snapshot", () => {
    const { decision, registry } = currentModelDecision();

    expect(resolveModelAvailability(decision, registry.modelAvailabilitySnapshots, "local")).toEqual([]);
  });

  it("rejects a missing snapshot, host mismatch, and unavailable effort", () => {
    const { decision, registry } = currentModelDecision();
    expect(resolveModelAvailability(decision, undefined, "local")).toContainEqual(
      expect.objectContaining({ code: "MODEL_SNAPSHOT_MISSING" }),
    );
    expect(resolveModelAvailability(decision, registry.modelAvailabilitySnapshots, "remote")).toContainEqual(
      expect.objectContaining({ code: "MODEL_SNAPSHOT_HOST_MISMATCH" }),
    );

    decision.reasoningEffort = "high";
    expect(resolveModelAvailability(decision, registry.modelAvailabilitySnapshots, "local")).toContainEqual(
      expect.objectContaining({ code: "MODEL_EFFORT_UNAVAILABLE" }),
    );
  });
});

function manifest(
  entries: GitScopeManifest["entries"] = [{ source: "committed", kind: "modified", path: "src/model/file.ts" }],
  dirty = false,
): GitScopeManifest {
  return {
    repositoryRoot: "C:/worktrees/workflow-economy",
    baseCommit: "c".repeat(40),
    headCommit: "d".repeat(40),
    entries,
    dirty,
  };
}

function evaluation(overrides: Partial<Parameters<typeof evaluateScopeLock>[0]> = {}) {
  const packet = currentPacket();
  const actualManifest = manifest();
  return evaluateScopeLock({
    packet,
    manifest: actualManifest,
    payloadChangedFiles: ["src/model/file.ts"],
    completionChangedFiles: ["src/model/file.ts"],
    terminalCommit: actualManifest.headCommit,
    packetDigest: "packet-current",
    expectedPacketDigest: "packet-current",
    verifiedAt: "2026-09-26T08:00:00.000Z",
    ...overrides,
  });
}

describe("canonical Scope Lock manifest evaluation", () => {
  it("sorts deterministically before digesting", () => {
    const entries: GitScopeManifest["entries"] = [
      { source: "committed", kind: "deleted", path: "src/model/z.ts" },
      { source: "committed", kind: "modified", path: "src/model/a.ts" },
    ];
    expect(canonicalScopeManifestDigest(manifest(entries))).toBe(
      canonicalScopeManifestDigest(manifest([...entries].reverse())),
    );
  });

  it("covers both rename and copy endpoints plus deleted paths", () => {
    const actualManifest = manifest([
      { source: "committed", kind: "renamed", path: "src/model/new.ts", previousPath: "src/model/old.ts" },
      { source: "committed", kind: "copied", path: "tests/copy.ts", previousPath: "tests/source.ts" },
      { source: "committed", kind: "deleted", path: "schemas/old.json" },
    ]);
    const changedFiles = [
      "schemas/old.json",
      "src/model/new.ts",
      "src/model/old.ts",
      "tests/copy.ts",
      "tests/source.ts",
    ];
    expect(evaluation({ manifest: actualManifest, payloadChangedFiles: changedFiles, completionChangedFiles: changedFiles }).issues).toEqual([]);
  });

  it("rejects read-only mutation", () => {
    const packet = currentPacket();
    packet.workAuthority = "verification";
    expect(evaluation({ packet }).issues[0]?.code).toBe("WORK_AUTHORITY_READ_ONLY");
  });

  it("reports forbidden scope before outside scope", () => {
    const packet = currentPacket();
    packet.allowedScope = ["src/model/"];
    packet.forbiddenScope = ["secrets/"];
    const actualManifest = manifest([{ source: "committed", kind: "added", path: "secrets/key.txt" }]);
    const result = evaluation({ packet, manifest: actualManifest, payloadChangedFiles: ["secrets/key.txt"], completionChangedFiles: ["secrets/key.txt"] });
    expect(result.issues.map(({ code }) => code)).toEqual(["CHANGED_FILE_FORBIDDEN"]);
  });

  it.each([
    ["omitted", ["src/model/file.ts"], []],
    ["added", ["src/model/file.ts"], ["src/model/file.ts", "tests/not-actual.ts"]],
  ])("rejects a %s reported manifest path", (_name, payloadChangedFiles, completionChangedFiles) => {
    expect(evaluation({ payloadChangedFiles, completionChangedFiles }).issues).toContainEqual(
      expect.objectContaining({ code: "CHANGE_MANIFEST_MISMATCH" }),
    );
  });

  it("rejects dirty state", () => {
    expect(evaluation({ manifest: manifest([{ source: "unstaged", kind: "modified", path: "src/model/file.ts" }], true) }).issues).toContainEqual(
      expect.objectContaining({ code: "SCOPE_WORKTREE_DIRTY" }),
    );
  });

  it.each([
    ["terminal commit", { terminalCommit: "e".repeat(40) }, "SCOPE_TERMINAL_COMMIT_MISMATCH"],
    ["packet digest", { packetDigest: "packet-other" }, "SCOPE_PACKET_DIGEST_MISMATCH"],
  ] as const)("rejects a changed %s", (_name, overrides, code) => {
    expect(evaluation(overrides).issues).toContainEqual(expect.objectContaining({ code }));
  });

  it("returns a durable verification for a clean in-scope candidate", () => {
    const result = evaluation();
    expect(result).toEqual({
      issues: [],
      verification: {
        version: 1,
        status: "passed",
        baseCommit: "c".repeat(40),
        terminalCommit: "d".repeat(40),
        packetDigest: "packet-current",
        manifestDigest: canonicalScopeManifestDigest(manifest()),
        changedFiles: ["src/model/file.ts"],
        verifiedAt: "2026-09-26T08:00:00.000Z",
        clean: true,
      },
    });
  });
});
