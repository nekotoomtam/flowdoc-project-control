# FlowDoc Design Selected Region Command Affordance Acceptance

## Authority Boundary

This document is the Project Control PLAN acceptance record for `lane-design-selected-region-command-affordance-cleanup`.

It accepts one bounded Editor-owned UI affordance at Editor commit `cb3c1ca4e35973c3bd4f89d969826911e109e55c`. It does not prove frontend readiness, WYSIWYG readiness, Preview readiness, Publish readiness, Backend readiness, Core readiness, API key readiness, PDF output readiness, production readiness, release readiness, FlowDoc product truth, or map truth.

PLAN did not patch Editor product files after dispatch. PLAN reviewed, verified, merged through an isolated Editor main verification worktree, and recorded Project Control evidence only.

## Work Context

- Work path: `flowdoc-product-development-resumption > flowdoc-frontend-expert-roadmap > flowdoc-frontend-product-map > flowdoc-design-workspace-usability > lane-design-selected-region-command-affordance-cleanup`
- Dispatch set ID: `dispatch-frontend-continuation-2026-09-03-01`
- Room run ID: `room-design-selected-region-cleanup-2026-09-03-01`
- Handoff ID: `handoff-design-selected-region-command-affordance-cleanup-2026-09-03-01`
- PLAN task/chat ID: `01a0637c-bc37-7cb1-8655-362695c4c6f7`
- WORK task/chat ID: `01a06786-74da-73e2-a852-64e9c7351aef`
- Owner repository: `repo-editor`
- Active role: `evidence-reviewer` for PLAN acceptance
- Phase target: `phase-flowdoc-design-selected-region-command-affordance-acceptance-v1`
- Checklist target: `checklist-flowdoc-design-selected-region-command-affordance-acceptance-v1`
- Evidence target: `evidence-editor-design-selected-region-command-affordance-cleanup-2026-09-03`

## Acceptance Decision

PASS: PLAN accepted the lane as a bounded Editor selected-region command summary.

The accepted Editor commit adds a read-only selected-region command summary below the existing top toolbar controls. The summary shows selected-region context from the existing resolver, an honest no-selection state, Text availability, List availability, Direct page edit unavailable, Preview unavailable, and Publish blocked.

The List availability row uses the resolved toolbar target:

```text
listToolbarNodeId ?? selectionAnchorNodeId ?? selectedNodeId
```

That matches the live toolbar target resolution reported by the WORK room after reviewer recheck.

## Verification

WORK reported:

- `npm.cmd run test:app -- src/app/editor/_components/__tests__/EditorTopToolbar.test.ts`: PASS, 4 tests.
- `npm.cmd run review:gate`: PASS; type-check, Core tests 54 files / 837 passed / 6 skipped, app tests 128 files / 1151 passed, and build succeeded.
- `npm.cmd run review:browser`: PASS; editor smoke passed, Stage 4C smoke ok true, ignored console errors empty, ignored resource errors empty.
- `git diff --check HEAD~1..HEAD`: PASS.
- Reviewer recheck: PASS.

PLAN independently verified:

- Editor WORK worktree at `C:\Users\nekot\.codex\worktrees\e543\FlowDocEditor` was clean at `cb3c1ca4e35973c3bd4f89d969826911e109e55c`.
- `git diff --check HEAD~1..HEAD`: PASS.
- `npm.cmd run review:gate`: PASS.
- `npm.cmd run review:browser`: PASS.
- An isolated Editor main verification worktree was fast-forwarded to `cb3c1ca4e35973c3bd4f89d969826911e109e55c`; `review:gate` and `review:browser` passed there as well.

## Boundaries Preserved

- Direct page edit remains unavailable.
- Preview remains unavailable and diagnostic-only in this accepted lane.
- Publish remains blocked and not a submission path.
- No Backend, Core, storage, credentials, renderer, PDF, or production behavior changed.
- No contenteditable shortcut or `dangerouslySetInnerHTML` shortcut was introduced.
- No frontend readiness, WYSIWYG readiness, Preview readiness, Publish readiness, FlowDoc product truth, or map truth is promoted.

## Risks And Unknowns

- No separate manual screenshot QA was captured by the WORK room.
- Existing npm audit findings in Editor dependency installation remain outside this lane.
- Broader Editor UI readiness, Preview execution, Published Preview parity, Backend persistence, Core renderer contracts, and PDF artifact bytes remain unknown.
