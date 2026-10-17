# Editor Local Loopback Dev Runner - 2026-08-28

Status: in-review with bounded implementation evidence.

This document records a short operational lane added during the component-by-component Editor frontend redesign work. It creates a one-command local development path for checking the rendered Editor against a live Backend loopback server while keeping Core as a package dependency.

This lane does not prove product readiness, deployed Backend compatibility, cross-browser behavior, accessibility readiness, visual regression readiness, durable storage readiness, PDF export readiness, npm audit remediation, bundle-size readiness, broad Editor truth, broad Backend truth, broad Core truth, or FlowDoc product truth.

## Work Identity

- Work path: `flowdoc-product-development-resumption > editor-local-loopback-dev-runner`
- Owner repository for implementation: `repo-editor`
- Record repository for this lane: `repo-project-control`
- Evidence source repositories: `repo-backend`, `repo-core`
- Active role: `product-implementation-agent`
- Phase: `phase-editor-local-loopback-dev-runner`
- Checklist target: `checklist-editor-local-loopback-dev-runner`
- Evidence target: `evidence-editor-local-loopback-dev-runner-2026-08-28`

## Terminology

The canonical English product terminology remains the authority source for records, code, tests, contracts, and evidence. The Thai terminology companion is coordination context only.

- `dev:local-loopback`: define. The Editor-owned local development command that starts Backend and Editor together for local inspection.
- `live Backend mode`: define for this lane as the Editor Vite dev server calling a real Backend server on a local loopback URL.
- `Core runtime dependency`: define. Core is dependency-only here; it is not started as a server process.
- `Editor browser session`: define as the browser-visible development session served by Vite.
- `ready`: define only as the runner observing Backend `/health` and Editor `/documents` over loopback. It is not product readiness.
- `runtime`: split. This lane names Backend loopback server process, Editor Vite dev server, and Core dependency separately.

## Runner Scope

The runner owns:

- local repository path resolution from the Editor checkout or an Editor worktree;
- Backend loopback server startup through the Backend `src/server.ts` entrypoint;
- Editor Vite dev server startup with `VITE_FLOWDOC_BACKEND_URL` pointed at Backend;
- readiness waits for Backend `/health` and Editor `/documents`;
- a dry-run JSON plan for tests and review;
- a smoke mode that starts both services and exits after readiness;
- cleanup of the two child Node processes when the runner exits.

The runner does not own:

- Core document semantics, package migration, mutation behavior, or runtime truth;
- Backend transport, revision gates, persistence records, migration logic, mutation logic, or service readiness truth;
- Editor product UI behavior, Editor draft behavior, Preview lifecycle, browser history, or route semantics;
- evidence fixture generation or Project Control map promotion;
- deployed, production, cross-browser, accessibility, visual, PDF export, or durable storage readiness.

Core is dependency-only. Backend runs as a loopback server process. Editor runs as a Vite dev server. The command is for local development convenience, not a broader compatibility claim.

## Implementation Evidence

Editor commit `a007817b0f21de758e93a7c0b63873ca0414d5a7` adds:

- `scripts/run-local-loopback-dev.mjs`
- `src/tests/localLoopbackDevRunner.test.ts`
- `package.json` scripts `dev:local-loopback` and `dev:local-loopback:smoke`

The focused RED test failed before implementation because `scripts/run-local-loopback-dev.mjs` did not exist. After implementation, `src/tests/localLoopbackDevRunner.test.ts` passed and verified that the dry-run plan:

- reports `runner: "flowdoc-local-loopback-dev"`;
- uses `live Backend mode`;
- marks Core as `dependency-only`;
- starts Backend and Editor as the only child processes;
- exposes Backend `/health` and Editor `/documents` URLs;
- keeps `localLoopbackOnly` true;
- keeps `evidenceFixtureWrite` false;
- keeps `productionReadinessClaim` false.

`npm run dev:local-loopback:smoke` passed in the Editor worktree by starting Backend and Editor on random loopback ports, reaching Backend `/health`, reaching Editor `/documents`, and exiting after readiness.

Verification:

- Editor focused RED: `npx vitest run src/tests/localLoopbackDevRunner.test.ts --reporter verbose` failed with `MODULE_NOT_FOUND` before the runner existed.
- Editor focused GREEN: `npx vitest run src/tests/localLoopbackDevRunner.test.ts --reporter verbose` passed 1 test.
- Editor smoke: `npm run dev:local-loopback:smoke` passed and reported Backend `/health` plus Editor `/documents` ready on random loopback ports.
- Editor worktree `npm run check`: type-check passed, 84 test files passed, 292 tests passed, and Vite build passed.
- Editor merged main `npm run check`: type-check passed, 84 test files passed, 292 tests passed, and Vite build passed.
- Project Control registration keeps the Editor Project Control Node at `unknown` and does not add this evidence to `editor.documentIds` or `editor.evidenceIds`.

## Risks

- This runner is local loopback only; it does not prove deployed Backend or hosted Editor behavior.
- It checks startup readiness, not a browser interaction path, cross-browser coverage, accessibility, or visual regression.
- It depends on local Backend and Editor dependencies being installed.
- The local Core checkout had unrelated deleted `packages/pdf-renderer-pilot/fixtures/**` files during this lane. They were not edited or reverted.
- Editor dependency installation still reports 5 high severity vulnerabilities.
- Vite still reports the existing chunk-size warning during Editor build.
- PDF export local infrastructure remains outside this runner.

## Unknowns

- Production Backend readiness and broad Backend truth remain unknown.
- Broad Editor runtime truth and product readiness remain unknown.
- Broad Core truth remains unknown.
- Durable storage, auth, tenancy, rate limits, telemetry, backup, rollback, hosted deployment, and PDF export readiness remain unknown.
- Whether future frontend redesign phases should require this runner as a standard visual-inspection preflight remains undecided.

## Next Work

Use `npm run dev:local-loopback` from the Editor repository when a frontend slice needs the rendered Editor calling a live Backend loopback server. Keep component work in small Editor-owned lanes, and use the existing browser/live Backend evidence runners only when the round needs retained evidence rather than a development session.
