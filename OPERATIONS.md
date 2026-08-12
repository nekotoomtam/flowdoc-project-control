# Local Operations

## Purpose and boundary

This repository validates and presents shared FlowDoc project records. The GUI is read-only: it does not edit canonical records, execute work in another repository, or publish data. It runs only on the loopback interface and has no hosted deployment, account system, telemetry, or public API.

Project Control owns the shared hierarchy, work queue, repository registry, documents, and evidence index. Product repositories own their implementation, tests, and local contracts. Do not treat a work state as evidence for a truth-state change.

## Initial local setup

1. Run `npm install`.
2. Copy `.flowdoc.local.example.json` to `.flowdoc.local.json` if a local checkout map is needed.
3. Adjust only the relative paths in `.flowdoc.local.json`; it is ignored and must not be committed.
4. Run `npm run generate`.
5. Start the local GUI with `npm run dev` and open `http://127.0.0.1:5173`.

The checkout aliases in the local file must match `data/repositories/`. Never add absolute machine paths to tracked JSON, Markdown, or generated output.

## Canonical editing and recovery

Edit canonical records in `data/`, supporting documentation in `docs/`, and validator/application code only when the change is in scope. Do not edit `generated/project-index.json` by hand.

Run `npm run generate` after canonical changes. It validates first and publishes the index only after successful generation. On failure it leaves the last valid index in place and writes ignored `generated/project-diagnostics.json`; the GUI shows those diagnostics instead of presenting a partial map. Fix the reported canonical file and record, then rerun `npm run generate` followed by `npm run check:data`.

## Verification before commit

Run `npm run check` before committing. It performs the data check, TypeScript check, unit/component suite, production build, and Chromium browser workflow. The unit suite excludes `tests/e2e/**`; `npm run test:e2e` runs only the Playwright browser specs against a loopback development server.

`dist/`, browser reports, local configuration, and generated diagnostics are transient local artifacts. No command in this repository changes Core, Editor, or Backend automatically.
