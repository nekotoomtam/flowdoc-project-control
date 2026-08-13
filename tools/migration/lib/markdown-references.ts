import { posix } from "node:path";

import type { InventoryLink, InventoryRepositoryReference } from "../../../src/migration/types.js";
import { compareCodeUnits } from "../../lib/errors.js";

interface MarkdownDestination {
  rawTarget: string;
}

function withoutFencedCode(markdown: string): string {
  const visibleLines: string[] = [];
  let fence: { marker: "`" | "~"; length: number } | null = null;
  for (const line of markdown.split(/\r?\n/)) {
    const match = /^(?: {0,3})(`{3,}|~{3,})/.exec(line);
    if (fence === null && match !== null) {
      fence = { marker: match[1]![0] as "`" | "~", length: match[1]!.length };
      continue;
    }
    if (
      fence !== null &&
      match !== null &&
      match[1]![0] === fence.marker &&
      match[1]!.length >= fence.length
    ) {
      fence = null;
      continue;
    }
    if (fence === null) {
      visibleLines.push(line);
    }
  }
  return visibleLines.join("\n");
}

function markdownDestinations(markdown: string): MarkdownDestination[] {
  const destinations: MarkdownDestination[] = [];
  const visible = withoutFencedCode(markdown);
  const linkPattern = /(^|[^!])\[[^\]\n]*\]\(\s*(<[^>\n]+>|[^\s)\n]+)(?:\s+[^)]*)?\)/gm;
  for (const match of visible.matchAll(linkPattern)) {
    const target = match[2];
    if (target === undefined) {
      continue;
    }
    const rawTarget = target.startsWith("<") ? target.slice(1, -1) : target;
    if (rawTarget.length > 0) {
      destinations.push({ rawTarget });
    }
  }
  return destinations;
}

function normalizeTarget(target: string): string | null {
  const pathPart = target.split(/[?#]/, 1)[0] ?? "";
  if (
    pathPart.length === 0 ||
    pathPart.startsWith("/") ||
    pathPart.startsWith("\\") ||
    /^[a-z][a-z0-9+.-]*:/i.test(pathPart)
  ) {
    return null;
  }
  const normalized = posix.normalize(pathPart.replaceAll("\\", "/"));
  if (normalized === "." || normalized === ".." || normalized.startsWith("../")) {
    return null;
  }
  return normalized;
}

function resolveMarkdownTarget(sourcePath: string, rawTarget: string): string | null {
  const target = normalizeTarget(rawTarget);
  if (target === null || !/\.(?:md|markdown)$/i.test(target)) {
    return null;
  }
  const resolved = posix.normalize(posix.join(posix.dirname(sourcePath), target));
  return resolved === ".." || resolved.startsWith("../") ? null : resolved;
}

function normalizeRepositoryReference(target: string): string | null {
  const normalized = normalizeTarget(target);
  if (normalized === null) {
    return null;
  }
  return /^(?:src|tests|packages|schemas|contracts|fixtures)\//.test(normalized)
    ? normalized
    : null;
}

function classifyRepositoryReference(target: string): InventoryRepositoryReference["kind"] {
  if (target.startsWith("tests/") || target.endsWith(".test.ts")) {
    return "test";
  }
  if (
    target.startsWith("schemas/") ||
    target.startsWith("contracts/") ||
    target.startsWith("fixtures/")
  ) {
    return "contract";
  }
  return "code";
}

export function extractMarkdownLinks(sourcePath: string, markdown: string): InventoryLink[] {
  return markdownDestinations(markdown)
    .map(({ rawTarget }) => ({ rawTarget, resolvedPath: resolveMarkdownTarget(sourcePath, rawTarget) }))
    .sort(
      (left, right) =>
        compareCodeUnits(left.rawTarget, right.rawTarget) ||
        compareCodeUnits(left.resolvedPath ?? "", right.resolvedPath ?? ""),
    );
}

export function extractRepositoryReferences(markdown: string): InventoryRepositoryReference[] {
  const visible = withoutFencedCode(markdown);
  const targets = [
    ...markdownDestinations(markdown).map(({ rawTarget }) => rawTarget),
    ...Array.from(visible.matchAll(/`([^`\r\n]+)`/g), (match) => match[1] ?? ""),
  ];
  const references = new Map<string, InventoryRepositoryReference>();
  for (const target of targets) {
    const normalized = normalizeRepositoryReference(target);
    if (normalized === null) {
      continue;
    }
    const kind = classifyRepositoryReference(normalized);
    references.set(`${kind}\0${normalized}`, { kind, target: normalized });
  }
  return [...references.values()].sort(
    (left, right) =>
      compareCodeUnits(left.target, right.target) || compareCodeUnits(left.kind, right.kind),
  );
}
