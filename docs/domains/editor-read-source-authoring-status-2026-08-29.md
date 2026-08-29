# Editor Read Source Authoring Status - 2026-08-29

Status: in-review with bounded implementation evidence.

This document records a small Editor frontend honesty lane opened after live
loopback inspection showed that the Editor could look more editable than it
currently is. The lane separates the visible read source from authoring
capability: a backend-backed document can now show `Source: Backend read` while
still showing `Authoring: limited`.

This lane does not promote Editor truth, Backend readiness, Core truth, command
readiness, WYSIWYG readiness, text input readiness, frontend design readiness,
Preview parity, accessibility readiness, visual regression readiness, durable
storage readiness, PDF export readiness, production readiness, bundle-size
readiness, or FlowDoc product readiness.

## Work Identity

- Work path: `flowdoc-product-development-resumption > editor-read-source-authoring-status`
- Owner repository for implementation: `repo-editor`
- Record repository for this lane: `repo-project-control`
- Evidence source repositories: `repo-backend`, `repo-core`
- Active role: `product-implementation-agent`
- Phase: `phase-editor-read-source-authoring-status`
- Checklist target: `checklist-editor-read-source-authoring-status`
- Evidence target: `evidence-editor-read-source-authoring-status-2026-08-29`

## Terminology

The canonical English product terminology remains the authority source for
records, code, tests, contracts, and evidence. The Thai terminology companion
is coordination context only.

- `Backend read source`: define. A visible Editor shell status for an Editor
  browser session whose current Core envelope came from a Backend document read.
  It does not prove full Backend persistence or production readiness.
- `authoring status`: define for this lane as a compact Editor shell fact about
  whether the current screen exposes full authoring. It is not Core authoring
  contract truth and not Backend persistence truth.
- `limited authoring`: define. The current Editor can show the document and run
  some bounded command paths, but free text input and full WYSIWYG authoring are
  not enabled by this lane.
- `disabled authoring control`: define. Insert, Text, Fields, and Table remain
  disabled toolbar controls. Their tooltip and accessibility label can explain
  `authoring not enabled`, but the controls still do not own command behavior.
- `live Backend mode`: define for verification as Editor Vite calling a real
  Backend server on a local loopback URL while Core remains dependency-only.
- `ready` and `live`: context-only unless qualified by route, server, corpus,
  browser, and evidence boundary.

## Component Scope

StatusBar owns:

- presenting `Source: Backend read` for API envelopes;
- presenting `Authoring: limited` for non-read-only runtime modes;
- keeping those facts separate from `Core`, `Versions`, and `Mode`.

WorkspaceEditingCommandGroup and EditorToolbar own:

- passing disabled authoring reasons into the current Insert, Text, Fields, and
  Table controls;
- exposing aria labels and titles such as `Insert: authoring not enabled` and
  `Insert block: authoring not enabled`;
- preserving disabled command presentation without adding command callbacks.

This lane does not own:

- WYSIWYG, text input, caret, selection editing, free-form document editing, or
  full authoring;
- command activation, command readiness, or new mutation operations;
- Core document package semantics, Core runtime nodes, Core mutation results,
  or Core authoring contracts;
- Backend document record persistence, Backend revision gates, migration,
  mutation, auth, tenancy, storage, deployment, or production readiness;
- Preview lifecycle, PDF export, visual regression, accessibility, or map truth
  promotion.

## Implementation Evidence

Editor commit `b34fa44a25113359004706f32ecdd1d694dbf3e3` changes only the
Editor shell honesty surface:

- `src/components/shell/StatusBar.tsx` adds source and authoring status facts.
- `src/components/shell/WorkspaceEditingCommandGroup.tsx` accepts disabled
  reasons and applies them to aria labels and titles.
- `src/components/shell/EditorToolbar.tsx` passes `authoring not enabled` to
  the disabled Insert, Text, Fields, and Table controls.
- `src/tests/workspaceStatusStrip.test.ts` and
  `src/tests/workspaceEditingCommandGroup.test.ts` cover the new behavior.

The focused RED test failed after test setup because the current UI did not
render `Source: Backend read`, `Authoring: limited`, or disabled authoring
aria/title labels. After implementation, focused GREEN passed for
`src/tests/workspaceStatusStrip.test.ts` and
`src/tests/workspaceEditingCommandGroup.test.ts`: 2 test files passed and 5
tests passed.

Shell-adjacent regression tests passed for
`src/tests/workspaceEditingCommandGroup.test.ts`,
`src/tests/workspaceToolbar.test.ts`, `src/tests/workspaceFrame.test.ts`,
`src/tests/workspaceHeader.test.ts`, `src/tests/workspaceViewTabs.test.ts`,
`src/tests/workspaceStatusStrip.test.ts`,
`src/tests/documentWorkspaceRoute.test.ts`,
`src/tests/realdocDocumentWorkspaceTabs.test.ts`, and
`src/tests/editorBackendUnavailableHonesty.test.ts`: 9 test files passed and 20
tests passed.

Editor worktree `npm run check` passed type-check, 87 test files, 299 tests,
and Vite build. Editor merged main `npm run check` also passed type-check, 87
test files, 299 tests, and Vite build.

Live Backend mode verification:

- `npm run dev:local-loopback:smoke` passed in the Editor worktree with Backend
  and Editor on random loopback ports while Core remained dependency-only.
- A Chrome browser check opened the worktree Editor through live Backend mode,
  observed Backend `GET /documents?limit=24`, `GET /capabilities/versions`, and
  `GET /documents/product-report-vnext-minimal` with status 200, then confirmed
  the design route showed `Source: Backend read`, `Authoring: limited`,
  `Core: api r3`, and `Insert block: authoring not enabled`.
- The browser check wrote no evidence fixture and clicked no mutation control.

Project Control registration keeps the Editor Project Control Node at
`unknown` and does not add this evidence to `editor.documentIds` or
`editor.evidenceIds`.

## Risks

- This lane improves honesty, not authoring capability. Users still cannot type
  and edit the full document as a WYSIWYG editor.
- `Mode: active` remains a Core runtime mode fact; `Authoring: limited` is added
  to prevent reading that as full UI authoring readiness.
- Local loopback evidence does not prove deployed Backend compatibility,
  production storage, auth, tenancy, rate limits, telemetry, backup, rollback,
  cross-browser behavior, visual regression, or accessibility readiness.
- Backend `/health` still reports production blocked.
- Editor dependency installation still reports 5 high severity vulnerabilities.
- Vite still reports the existing chunk-size warning during Editor build.
- The primary Core checkout still has unrelated deleted
  `packages/pdf-renderer-pilot/fixtures/**` files. They were not edited or
  reverted by this lane.

## Unknowns

- Which full authoring path should be opened first: text input, structured
  insert, fields, tables, or a narrower command gate.
- Whether the final frontend redesign should keep these labels in the status
  bar, move them into a denser header state, or replace them with a richer
  document/session badge model.
- The ownership and test shape for WYSIWYG, caret, IME, clipboard, undo/redo,
  collaborative edits, and Backend persistence remain unresolved.
- Production Backend readiness, broad Editor runtime truth, broad Core truth,
  and FlowDoc product readiness remain unknown.

## Next Work

Continue the component-by-component Editor redesign, but treat any slice that
touches document loading, mutation, persistence, or visible source/authoring
claims as live Backend mode work. For low-risk visual slices, the next smallest
toolbar candidates remain `WorkspacePaperControlGroup` and
`WorkspaceZoomControlGroup`. For product behavior, the next larger planning
topic is an authoring gate that chooses the first real editable path and its
Core/Backend evidence boundary before enabling controls.
