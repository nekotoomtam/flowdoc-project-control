# FlowDoc Project Control

FlowDoc Project Control is a file-first, read-only local view of shared project records. Canonical JSON records and approved Markdown are validated, then compiled into the deterministic read model used by the GUI.

## Run locally

1. Install dependencies: `npm install`
2. Build the validated read model: `npm run generate`
3. Start the local application: `npm run dev`
4. Open [http://127.0.0.1:5173](http://127.0.0.1:5173)

Before committing, run `npm run check`. It checks the generated index, TypeScript, unit/component tests, production build, and Chromium end-to-end flow.

The development server binds to `127.0.0.1`; this V1 application is local-only and does not send telemetry or project content to a service.

## Source of truth and generated output

Canonical sources:

- `data/nodes/` — the primary project hierarchy and concise node summaries.
- `data/work/` — active work queue records, separate from durable truth.
- `data/phases/` and `data/checklists/` — execution gates for Work tasks; these do not establish Node truth.
- `data/documents/` and `docs/` — validated document metadata and long-form project documentation.
- `data/repositories/` — registered repository identities and checkout aliases.
- `data/evidence/` — scoped verification records that support claims.
- `schemas/` and `src/` — the validator, generated-model contract, and generation implementation.

Generated outputs:

- `generated/project-index.json` — tracked deterministic JSON read model generated from canonical sources.
- `generated/project-control.sqlite` — ignored local SQLite projection generated from canonical sources.

Never edit `generated/project-index.json`; it is deterministic output from the canonical sources. Never commit `generated/project-control.sqlite`; it is disposable local output. Run `npm run generate` after canonical changes and `npm run check:data` to detect stale generated output. If generation fails, read the generated diagnostics, fix the canonical record, and run generation again; the last valid index is retained rather than replaced with partial output.

Project Control owns cross-repository hierarchy, shared definitions, work coordination, repository registration, and evidence indexing. Core, Editor, and Backend own their source code, runtime behavior, tests, and implementation-local contracts. A work state never establishes a truth state: durable `current` claims require the appropriate recorded evidence.

## Local checkout configuration

`.flowdoc.local.example.json` documents the portable mapping reserved for future cross-checkout tooling. Copy it to `.flowdoc.local.json` only when that mapping is needed by a future approved workflow; V1 commands do not read it. The four keys match the repository registry's checkout aliases. The local file is ignored and must not be committed; absolute checkout paths do not belong in tracked data.

```json
{
  "checkouts": {
    "project-control": ".",
    "core": "../flowdoc-vnext-core",
    "editor": "../flowdoc-vnext-editor",
    "backend": "../flowdoc-vnext-backend"
  }
}
```

## Commands

- `npm run generate` validates canonical sources and publishes the deterministic local read model.
- `npm run check:data` validates sources and verifies that the committed read model is current.
- `npm run dev` starts the local GUI on the loopback interface.
- `npm run test:e2e` runs the Chromium browser workflow against a loopback development server.
- `npm run check` runs the complete pre-commit gate.

## V1 boundaries

This release has no GUI editing, canonical database, cloud or network-hosted service, account system, public document API, release orchestration, drag-and-drop graph editing, or infinite canvas. The generated SQLite projection is disposable local output, not an authoring surface. The closed `CORE_ROUTE_*` documentation pilot does not change those product boundaries. GUI/product-repository mutation and AGENTS/Skill redesign remain deferred work, not claims made by this release.
