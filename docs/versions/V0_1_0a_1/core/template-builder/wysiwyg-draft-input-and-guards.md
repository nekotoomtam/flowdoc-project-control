# WYSIWYG Draft Input, Selection, and Browser Guards

## Authority and Scope

This canonical leaf consolidates the 15 sources assigned by the reviewed
Template Builder orientation subgroup: **15 assigned / 15 unique / 0 missing /
0 extra / 0 drift**. The frozen source commit is
`76a2f2311a898e781f53773390d47b05812911e4`; every assigned blob is identical
at the read-only current evidence commit
`c503a45c03e0ce3b7a6efba2b029ca842017faa0`. It documents browser-local draft
activation and guards only. Template Builder remains `unknown`.

## Responsibility Boundary

This leaf owns the active plain-text draft, textarea selection and caret,
browser-local text commands, composition guards, local layout summaries, and
planning-only toolbar, field, and history affordances before an accepted
commit. It does not own rich-inline segment capture or range mapping, canonical
rich-inline mutation, durable history, persistence, collaboration, renderer
output, export, or a replacement production primary input. Rich-inline
lifecycle contracts belong to [Rich Inline Capture, Commit, Replay, and Session
Lifecycle](rich-inline-commit-and-session-lifecycle.md).

## Textarea-first Active Draft

The current active input is textarea-first. Active draft text, its target, and
its dirty status remain browser-local until a deliberate plain-text bridge
commit is accepted. The current app renders `data-draft-editor` as a
`<textarea>`; its hidden contenteditable-style surface is bounded fallback and
hardening evidence, not the active primary input. An eligible plain-text draft
uses the existing packet bridge at commit time; rejected or stale commits retain
the local draft rather than changing package truth during typing.

`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:examples/template-builder-sandbox/public/app.js`
`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:examples/template-builder-sandbox/public/draftRuntime.js`
`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:tests/templateBuilderSandboxBoundary.test.ts`

## Browser-local Selection, Caret, and Text Commands

Selection start, end, direction, and caret controls are normalized and clamped
against the active textarea draft. Command context and insert or
replace-selection commands change only that local text and local selection.
They do not create package operations, history records, layout requests, DOM
range bindings, or renderer caret measurements. A rejected bridge packet
preserves local draft and selection facts; a successful packet application
clears the active draft. UTF-16 mapping for rich-inline segment facts is owned
by the downstream rich-inline leaf, not by this textarea caret contract.

`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:examples/template-builder-sandbox/public/draftRuntime.js`
`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:examples/template-builder-sandbox/public/app.js`
`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:tests/templateBuilderSandboxBoundary.test.ts`

## IME Composition Guard

Textarea composition stays browser-local. While composition is active, the
generic IME policy blocks commands, range controls, and both plain and rich
commit. Input can continue updating the local composing draft, but no commit or
range-based command treats intermediate composition state as final intent.
After composition ends, ordinary local commands and the explicit commit path
may be reconsidered. This is a bounded generic guard, not language-complete
IME behavior, persistent composition state, or per-keystroke transaction work.

`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:examples/template-builder-sandbox/public/draftImePolicy.js`
`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:examples/template-builder-sandbox/public/draftRuntime.js`
`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:examples/template-builder-sandbox/public/app.js`

## Pre-commit Local Layout Summary

Typing and local commands can update a browser-local pre-commit layout summary.
It reports only preview or deferred facts: no live layout request is made and
no exact generation runs while a draft is active. Accepted bridge mutation is
the earliest point at which the sandbox can report bounded dirty scope or stale
signals; those signals remain distinct from renderer output, pagination, and
export readiness. Viewport request and render-window ownership remains with
[Viewport, Scheduler, and Virtualized Rendering](viewport-and-virtualized-rendering.md).

`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:examples/template-builder-sandbox/public/draftLayoutPush.js`
`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:examples/template-builder-sandbox/public/draftRuntime.js`
`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:tests/templateBuilderSandboxBoundary.test.ts`

## Planning-only Toolbar, Field, and History Affordances

Toolbar readiness and dispatch, field-chip requests, style-patch summaries, and
style-aware history grouping are browser-local planning or execution evidence.
They do not by themselves insert canonical `field-ref` nodes, patch canonical
styled runs, create durable history, or produce layout or export output. A
ready indicator is still a plan, not production readiness. Local field and
style facts can be preserved as input to downstream rich-inline planning only
after the relevant IME and range guards permit it.

`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:examples/template-builder-sandbox/public/draftToolbarState.js`
`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:examples/template-builder-sandbox/public/draftToolbarCommandDispatch.js`
`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:examples/template-builder-sandbox/public/draftFieldChipInline.js`
`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:examples/template-builder-sandbox/public/draftInlineStylePatch.js`
`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:examples/template-builder-sandbox/public/draftStyleHistory.js`

## State and Failure Model

Local draft state comprises draft text, target and base revision, normalized
selection, command context, composition status, and bounded planning summaries.
Inactive, mixed, atomic, styled, composing, stale, or rejected cases remain
guarded according to their local policy. Local edits do not alter a canonical
package, and selection-only or planning-only actions do not advance history.
Plain draft acceptance uses the existing bridge; rich mutation requires the
downstream accepted fresh plan gate. No local state is a persistence or
collaboration protocol.

## Current Verified State

At the pinned Core evidence commit, the focused sandbox boundary suite covers
textarea-first activation, local selection/caret and text-command behavior,
composition guards, the planning boundaries, and the bridge handoff. The
implementation remains browser-local until accepted commit, with no production
editor claim.

`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:tests/templateBuilderSandboxBoundary.test.ts`
`flowdoc-vnext-core@c503a45c03e0ce3b7a6efba2b029ca842017faa0:tests/wysiwygPrimaryInputDecisionGate.test.ts`

## Known Limits and Unknowns

This leaf does not establish a production contenteditable editor, DOM caret or
renderer measurement contract, canonical typing truth, persistence,
collaboration, live renderer output, exact layout, or export parity. The active
input remains textarea-first. Browser-local draft, selection, commands,
planning, and style facts remain bounded until accepted commit; their durable or
multi-user behavior is unknown.

## Historical Design Notes

Historical design and close-audit material establishes the intent to separate
draft, cache, working-package, and canonical layers. Historical phase order or
`PASS` labels do not promote future cards or planning states into current
production behavior. The current executable anchors above control the bounded
wording used here.

## Canonical Cross-references

- [Sandbox Runtime, Mutation Packets, and Store-backed Render Model](sandbox-runtime-and-store.md)
- [Viewport, Scheduler, and Virtualized Rendering](viewport-and-virtualized-rendering.md)
- [Rich Inline Capture, Commit, Replay, and Session Lifecycle](rich-inline-commit-and-session-lifecycle.md)

## Evidence Anchors

All strong current claims are pinned to immutable Core commit
`c503a45c03e0ce3b7a6efba2b029ca842017faa0`. The reviewed orientation retains
the exact frozen assignment and provenance; this leaf deliberately does not
repeat former source paths.
