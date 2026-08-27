# FlowDoc Bounded Browser Compatibility Promotion - 2026-08-27

Status: bounded local loopback browser compatibility child claim promoted;
broader FlowDoc, Core, Editor, and Backend truth remains unpromoted.

Work path:
`flowdoc-product-development-resumption > flowdoc-bounded-browser-compatibility-promotion`

Owner repository: `repo-project-control`

Evidence source repositories: `repo-editor`, `repo-backend`, `repo-core`

Active role: `evidence-reviewer`

Phase: `phase-flowdoc-bounded-browser-compatibility-promotion`

Checklist: `checklist-flowdoc-bounded-browser-compatibility-promotion`

Evidence target:
`evidence-flowdoc-bounded-browser-compatibility-promotion-2026-08-27`

## Promotion Decision

Create a narrow child node:

- Node: `flowdoc-browser-compatibility`
- Title: `FlowDoc Browser Backend Compatibility`
- Truth state: `current`

The node is current only for the accepted bounded local loopback browser smoke:

1. A real headless Chrome session opens the rendered Editor product routes.
2. The Editor app uses a live loopback Backend URL.
3. Backend is seeded from the Core `product-report-vnext-minimal` fixture.
4. The browser path loads `/documents`.
5. The browser path opens `/documents/product-report-vnext-minimal/design`.
6. The UI observes `Core: api r3`, `Versions: compatible`, and `Mode: active`.
7. The UI clicks `Upgrade` and observes `Core: api r4` and `Mode: partial`.
8. The UI clicks `Move selected node down` and observes
   `Core: mutation-result r5`.
9. The retained outline order is
   `summary-columns > title > detail-table`.

This promotion does not mark the `flowdoc` parent, `core`, `editor`, or
`backend` nodes current.

## Supporting Evidence

Primary Project Control source:

- Project Control commit `739d19d452bdb5151ec030db96a9247da0a29ae5`
- Document:
  `docs/domains/editor-browser-live-backend-smoke-2026-08-27.md`
- Evidence:
  `evidence-editor-browser-live-backend-smoke-2026-08-27`

Source repository heads cited by that packet:

| Repository | Commit | Supporting path |
|---|---|---|
| Editor | `ad0dbf7b81f483cb73c19ed28c3fd8fcbd68c6e4` | `src/fixtures/editor-browser-live-backend-smoke.v1.json` |
| Backend | `42cc1040c959a16647b7e797929358c401ccfa38` | `src/http/server.ts` |
| Core | `77b9e181d1fb43bf69d725108ede664578a07a45` | `fixtures/product-report-vnext-minimal.flowdoc.json` |

The retained browser smoke fixture records 200 or 204 Backend statuses for:

- `GET /documents?limit=24`
- `GET /capabilities/versions`
- `GET /documents/product-report-vnext-minimal`
- `OPTIONS` and `POST /documents/product-report-vnext-minimal/migrations/package-v3-document-v4`
- `OPTIONS` and `POST /documents/product-report-vnext-minimal/mutations`

## Map Update

`docs/domains/flowdoc-system-map.md` now includes the bounded child claim in the
product-wide inventory while preserving the broad states:

- `FlowDoc` remains `planned`.
- `Core` remains `unknown` for broader Core.
- `Editor` remains `unknown` for broad runtime/UI state.
- `Backend` remains `unknown` for broad service or production state.
- `FlowDoc Browser Backend Compatibility` is `current` only for the accepted
  local loopback browser smoke path.

## PASS

- The accepted browser smoke evidence is durable and registered in Project
  Control.
- The promotion target is the narrowest useful child node rather than a broad
  repository node.
- The system map points at the bounded claim without changing product runtime
  behavior.
- Project Control generated index and roadmap tests guard the new child claim.

## FAIL / BLOCKER

- No blocker remains for this bounded promotion lane.

## RISK

- The promoted claim is local loopback headless Chrome evidence only.
- The promoted claim covers one fixture, one product route flow, one migration,
  and one UI reorder mutation.
- The accepted smoke retained a non-blocking Vite `/favicon.ico` 404 log entry,
  with no `console.error` and no page exception.
- Editor still has previously observed npm audit risk from the implementation
  worktree and the existing Vite chunk-size warning.

## UNKNOWN

- Deployed Backend and hosted Editor compatibility remain unknown.
- Cross-browser compatibility remains unknown.
- Broad document-corpus compatibility remains unknown.
- Accessibility and visual-regression status remain unknown.
- Product readiness remains unknown.

## Intentionally Not Changed

- No product repository file was changed.
- No broad Core, Editor, Backend, or FlowDoc truth state was promoted.
- No broad repository node received this evidence as a `current` claim.
- No Backend production readiness, auth, tenancy, deployment, or persistence
  claim was added.
- No npm audit remediation, favicon asset addition, or bundle splitting was
  attempted.

## Next Recommended Direction

Open a new owner lane for the next remaining unknown, preferably deployed
loopback-to-hosted parity or broader corpus coverage, before any product
readiness claim.
