# FlowDoc Design Workspace Usability Acceptance

## Authority Boundary

Owner repository: `repo-project-control`.

Work path: `flowdoc-product-development-resumption > flowdoc-frontend-expert-roadmap > flowdoc-frontend-product-map > flowdoc-design-workspace-usability`.

This document is the Project Control PLAN acceptance record for `lane-design-workspace-usability`. It records the accepted Editor-owned implementation evidence returned by the WORK room and the PLAN acceptance gate that reviewed it.

This record is evidence registration and coordination context, not broad FlowDoc product truth. It does not prove frontend readiness, WYSIWYG readiness, Preview readiness, Publish readiness, Backend readiness, Core readiness, production readiness, compatibility readiness, release readiness, FlowDoc product truth, or map truth.

Project Control owns this acceptance record. Editor owns the implemented browser runtime and UI behavior at the accepted commit.

## Work Context

- Dispatch set: `dispatch-frontend-design-and-wysiwyg-2026-09-03-01`
- Lane ID: `lane-design-workspace-usability`
- Work ID: `flowdoc-design-workspace-usability`
- Work Type: `product-implementation` plus `ux-design-exploration`
- Owner repository: `repo-editor`
- Active role: `product-implementation-agent`, reviewed by PLAN as `evidence-reviewer`
- Current Phase: `phase-flowdoc-design-workspace-usability-acceptance-v1`
- Checklist target: `checklist-flowdoc-design-workspace-usability-acceptance-v1`
- Evidence target: `evidence-editor-design-workspace-usability-2026-09-03`
- PLAN task/chat ID: `01a0637c-bc37-7cb1-8655-362695c4c6f7`
- WORK task/chat ID: `01a066b4-6040-7e42-95d6-ac09d36a385f`
- Review task/chat ID: `01a066d6-2c0a-78c0-ab83-2f2e448ef37a`
- Accepted Editor commit: `e78ae4160d1ab1759961dbeb3d646beb3490ec46`

Known risks:

- The new status strip may be mistaken for Preview or Publish activation even though both remain gated.
- The Design workspace may be mistaken for broad WYSIWYG readiness even though the WYSIWYG gate remains closed.
- Next dev can re-add an uncommitted `AGENTS.md` generated block during local verification; PLAN and WORK must keep that local noise out of accepted product commits unless a later repository decision says otherwise.
- Browser and visual checks support this bounded UI strip only; later authoring, Preview, Publish, Backend, Core, integration, and production lanes still need separate evidence.

Unknown state:

- Direct page editing, rich editor package adoption, broad contenteditable, direct Preview typing, table/cell surface editing, media surface editing, and Publish submission remain unproven and unavailable.
- Backend persistence, Core runtime mutation behavior, API keys, PDF output, artifact storage, and end-to-end integration remain outside this lane.
- Production readiness remains NO-GO until a later evidence-backed decision changes it.

## Handoff Inbox

PLAN received `WORK RETURN EVENT: handoff-design-workspace-usability-2026-09-03-01` through the automatic Return Channel using `send_message_to_thread`.

The first returned handoff reported PASS, exact Editor commit `e78ae4160d1ab1759961dbeb3d646beb3490ec46`, changed files, behavior changed, tests run, claims not promoted, risks, and no Contract Change Request.

PLAN acceptanceGate then found a dirty uncommitted `AGENTS.md` change in the WORK worktree. The dirty file was outside the reported file set and prevented acceptance.

PLAN sent Revision Packet `revisionAttempt: 1` back to the same WORK room. WORK returned `WORK RETURN EVENT: handoff-design-workspace-usability-2026-09-03-01-r1`, restored the accidental `AGENTS.md` generated block, kept the same Editor commit, and reported a clean lane branch.

This satisfies the expected revision loop: PLAN did not patch the Editor product lane on the WORK room's behalf. The same WORK room repaired the returned lane state before acceptance.

## Accepted Editor Behavior

Editor commit `e78ae4160d1ab1759961dbeb3d646beb3490ec46` changes the bounded Design workspace usability surface:

- Adds a compact Editor workspace status strip beneath the existing toolbar commands.
- Shows the current document title and Editor draft save state from existing document metadata and autosave status.
- Shows Design as the current workspace.
- Shows Preview as unavailable.
- Shows Publish as blocked.
- Keeps Preview and Publish non-interactive and unactivated.
- Renders the workspace stages as accessible status items, not no-op buttons.
- Updates the browser smoke helper so flow-table internals can be read from nested table nodes or normalized section graph nodes.

Changed Editor paths:

- `src/app/editor/_components/shell/EditorToolbar.tsx`
- `src/app/editor/_components/EditorShell.tsx`
- `src/app/editor/_components/__tests__/EditorToolbar.test.ts`
- `scripts/editor-smoke.mjs`

## Verification

WORK reported these passing checks before the revised handoff:

- `npm.cmd run test:app -- src/app/editor/_components/__tests__/EditorToolbar.test.ts`
- `npm.cmd run review:gate`
- `npm.cmd run review:browser`
- Desktop and mobile visual geometry QA at 1440x900 and 390x844
- Read-only reviewer pass after one Important accessibility/usability issue was fixed

PLAN independently checked the returned locator and reran Editor owner gates.

On the lane branch before merge, PLAN ran:

- `npm.cmd run review:gate`: PASS
- `npm.cmd run review:browser`: PASS

After fast-forwarding Editor `main` to `e78ae4160d1ab1759961dbeb3d646beb3490ec46`, PLAN ran:

- `npm.cmd run review:gate`: PASS
  - Core tests: 54 files passed, 837 tests passed, 6 skipped
  - App tests: 127 files passed, 1147 tests passed
  - Production build completed
- `npm.cmd run review:browser`: PASS
  - Editor smoke passed
  - WYSIWYG stage4c smoke returned `ok: true`
  - `ignoredConsoleErrors`: `[]`
  - `ignoredResourceErrors`: `[]`

PLAN restored only the uncommitted `AGENTS.md` local generated block caused by the verification run. That cleanup did not change the accepted Editor commit or product behavior.

## Acceptance Decision

PLAN accepts `lane-design-workspace-usability` at Editor commit `e78ae4160d1ab1759961dbeb3d646beb3490ec46`.

Acceptance is limited to the bounded Editor workspace status strip and smoke-helper compatibility described above.

The lane is accepted because:

- The WORK room returned through the automatic Return Channel.
- The WORK room acknowledged and preserved the lane boundary.
- A review issue was sent through the WORK room and fixed before commit.
- PLAN found and rejected a dirty returned state, sent a Revision Packet, and accepted only after the same WORK room cleaned the lane.
- The accepted commit stayed inside `repo-editor`.
- PLAN reran Editor owner-repository gates on merged `main`.

## Claims Not Promoted

This acceptance does not promote:

- FlowDoc product truth.
- FlowDoc system map truth.
- Frontend readiness.
- WYSIWYG readiness.
- Preview readiness.
- Publish readiness.
- Backend readiness.
- Core readiness.
- API key readiness.
- PDF output readiness.
- Production readiness.
- Compatibility readiness beyond the specific smoke paths listed above.

## Next Recommended Work

PLAN may use this accepted lane as context for the next frontend roadmap split.

Recommended next lanes remain separate:

- Design workspace selected-region and command affordance cleanup.
- Preview evidence lane that keeps Preview separate from WYSIWYG.
- Publish evidence lane that keeps submission unavailable until Backend/Core contracts are accepted.
- Progressive authoring lane only after Project Control confirms the WYSIWYG prerequisites remain satisfied or blocked by design.
