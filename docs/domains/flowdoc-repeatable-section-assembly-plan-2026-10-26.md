# Repeatable Section Assembly Implementation Plan

> Execution after owner approval: use superpowers:executing-plans for bounded inline implementation. This document authorizes planning only; no product changes have started.

## Authority Boundary

Owner: FlowDoc Project Control for this cross-repository proposal. Core owns
template/request contracts and composition/rendering; Service owns persistence,
transport, task pins and authoring discovery; consumer applications own their UI.
This is a single-room plan from the owner's explicit request. Execution, Phase
and Checklist IDs are not applicable. No map/product-readiness promotion.
Work size: medium; risk tier: routine, with explicit compatibility and identity
risks below. Scope is an isolated pilot, not a release or installed upgrade.
Current isolated PC lane: codex/shared-stroke-table-styles-pc at0e5efe9 before
this plan. Existing Core/Service lanes must be checked clean and revalidated
against their actual bases before implementation; do not reset unrelated work.
The current generated snapshot concerns unrelated Editor work; this request and
the retained CLIS correction are the applicable context, not a new Editor lane.

**Goal:** a caller can assemble a document by invoking saved Section definitions
in request order, including multiple uses of the same Section with independent
data, headers and footers, and obtain editable PDF/DOCX-compatible results.

**Architecture:** distinguish saved definitions from runtime uses. Give each
definition a unique public key within its document version; give each use its own
identity. Expand each use into an independently namespaced resolved Section,
then reuse the native PDF/DOCX Section renderers.

**Tech stack:** existing TypeScript Core/Service, versioned JSON contracts,
PostgreSQL authoring storage and task processing, existing PDF/DOCX renderers.

**Spec:** the owner's conversation establishes the semantics in the next section.
The version/field choices below are the recommended pilot design, not existing
capabilities or approved implementation truth.

## Agreed semantics and proposed public contract

- Authors may save any number of Section definitions under one docKey. A public
  Section key and internal definition UUID are unique; display labels need not be.
- Callers reference a saved definition by public sectionKey, not by display label
  or an internal UUID they must discover manually.
- Request order is output order, including A -> B -> A. Unused definitions are
  omitted; no mandatory-use/min/max policy is added in this pilot.
- Each use has a caller-supplied instanceKey unique within that request. It stays
  stable when the caller edits or reorders entries. Two uses may share sectionKey
  and display label, but cannot share instanceKey.
- Data/header/footer belong to a use. Schema, page settings, header/footer
  declarations and numbering rules belong to its saved definition.
- A use can flow over multiple pages. Each subsequent use starts a new page in
  the pilot; no continuous mid-page Section start is added.
- A header repeats according to the definition's band mode within that use.
  Final totals remain ordinary content when the definition places them there.
  Existing Inward CLIS footer behavior is not silently replaced with Outward's.
- Empty request assembly is rejected. Empty data in a selected use follows its
  authored content and existing empty-content rules; it does not silently select
  a different definition or manufacture an extra page.

Recommended contract isolation: add a new explicit model contract (provisionally
Model20) rather than changing Model19's saved-order/exactly-once meaning. Keep18
and19 readers and their manuals unchanged. Confirm the model/prepared/streamed
version matrix in Task1 before implementation; never infer a task-wire version
from a node-model number. New prepared input must pin the definition fingerprint,
resolved public keys, instance identities and request order.

Illustrative new request shape, not an API that is already accepted:

```json
{
  "docKey": "clis-outward-pilot",
  "version": 1,
  "data": {},
  "sections": [
    {"sectionKey":"containerList","instanceKey":"ningbo-1","data":{},"header":{"pod":"Ningbo"}},
    {"sectionKey":"containerList","instanceKey":"shanghai-1","data":{},"header":{"pod":"Shanghai"}},
    {"sectionKey":"containerList","instanceKey":"ningbo-2","data":{},"header":{"pod":"Ningbo"}}
  ]
}
```

This is schema-backed business data: pod/header must be declared by that saved
definition. The caller cannot override geometry or inject arbitrary definitions.
An explicit discovery response lists sectionKey, label and input/band schemas
for the selected docKey/version. Renaming label does not break callers; changing
sectionKey is an API contract change belonging to a new document version.

## Display and navigation rules

The creator's definition list shows each definition once. The caller's assembled
document list shows each use once, in request order, identified by instanceKey.
Display can show label plus use number or Port supplied by the application; no
new arbitrary label-expression language is introduced. Delete/reorder/data edit
acts on a use, while editing a definition is a separate authoring operation.

Namespacing must cover nodes, bands, Areas, bookmarks, TOCs, ending Areas, image
locators and diagnostics. Preserve both definition identity and instance identity
in source provenance. Local references resolve within the current use. A
cross-use reference requires an explicit target instance; never select the first
occurrence of a repeated definition. Existing cross-Section references must be
checked at admission; ambiguous unsupported input fails explicitly.
Section-scoped TOC means this use; document TOC follows the assembled document.
Numbering continues by default; existing explicit restart rules apply per use.

## Source findings that determine the implementation

- Core src/data/prepareInstances.ts rejects duplicate IDs and requires every
  saved Model19 Section exactly once; it cannot merely loosen one duplicate check.
- Core src/composition/composeSections.ts loops saved definitions and namespaces
  nodes/anchors with definition ID. Both iteration and identity need a new path.
- Core src/composition/resolvedDocument.ts carries Section identity in sections,
  sourceMap and formatInstances; provenance must keep definition and use separate.
- Core src/docx/sections.ts already consumes ordered resolved Sections, but its
  model-specific TOC/capability branches and native header links need verification.
- Service src/templates/assembly.ts stores sourceDefinitionId and saved positions;
  src/authoring/sectionInstances.ts currently imports/copies saved instances.
- Service src/tasks/normalize.ts and processing.ts pin/normalize/queue immutable
  input. Repeated use must survive JSON indexing, image ownership and job reload.
- FlowDocMake scripts pin runtime capabilities. They must advertise/accept the
  new contract only with a matching candidate, without changing installed0.3.0.

## Execution tasks and acceptance

### Task1: freeze the versioned definition/use contract

- [ ] Inspect the owning Core/Service guides and all affected strict model switches,
  authoring serialization, registry, prepared and streamed normalization readers.
- [ ] Freeze public sectionKey, instanceKey, request ordering, duplicate/error rules,
  band/data scopes, reference addressing and version matrix in this one document.
- [ ] Locate any real consumer of Section IDs before changing its display contract;
  no existing Editor/frontend is assumed to be a runtime-document composer.
- [ ] Acceptance:18/19 inputs retain current meaning; a paired new definition and
  A/B/A request are unambiguous. A required unapproved architecture/scope expansion
  is reported before product mutation.

### Task2: implement Core preparation and composition

Files: src/template/types.ts, sectionOwnership.ts, pageSections.ts,
src/data/types.ts, prepareInstances.ts and a focused new assembly reader;
src/composition/composeSections.ts, resolvedDocument.ts and affected reference/
contents/provenance validators. Audit direct and streamed normalization paths.

- [ ] First add rejection/acceptance cases: repeat key with distinct instances,
  duplicate instance, unknown key, label-only lookup, missing/wrong-scope data,
  reordered uses, unused definition, empty request and immutable source definition.
- [ ] Expand by request order with fresh instance namespaces; reuse definitions
  without mutating them. Charge every expansion to existing node/resource budgets.
- [ ] Verify local anchors, explicit cross-use links, scoped/document TOC, images
  in two uses, mixed page layouts and ending Area on only its owning use's last page.
- [ ] Acceptance: A/B/A produces independent content in both memory and streamed
  paths, with no duplicate nodes or data leakage;18/19 regressions still pass.

### Task3: prove PDF and native Word before wider transport rollout

Files: affected src/pdf, layout, src/docx/sections.ts, profile/fields/bands and
their focused tests. Modify only where new resolved semantics require it.

- [ ] Export one-page A, multi-page B and a different-length second A in one file.
  Add distinct per-use text, repeated header, page number, local bookmark and total.
- [ ] Inspect every PDF/Word-converted page: use starts, header inheritance,
  table-header repetition, last-use totals, links, numbering, ending Area, blank
  pages and editable native tables. Use native Word Sections, not table-header
  substitution for general Section headers.
- [ ] In a copy in Word, edit the first A enough to change its page count. Confirm
  its header follows its continuation pages and does not alter B or the second A.
- [ ] Acceptance: normal Word reflow preserves use boundaries and per-use bands;
  content is complete. Byte-identical pagination across renderers is not claimed.
  Stop and report if native Word cannot satisfy this behavior within the contract.

### Task4: connect Service, discovery and caller display identity

Files: src/templates/assembly.ts/registry.ts, src/authoring/sectionOperations.ts,
src/http/authoring.ts, src/tasks/normalize.ts, processing.ts and image-index
consumers; FlowDocMake compatibility/profile/contract readers when applicable.
Any DB change uses a new forward-only migration, never rewrites old definitions.

- [ ] Persist unique public keys per document definition/version and return their
  schemas through the supported discovery route. Reopening saves the same keys.
- [ ] Verify a real isolated task through intake, normalization, queue/reload and
  PDF/DOCX delivery; preserve assembly order and instance keys in diagnostics.
- [ ] Verify image pointers/access ownership across repeated uses, immutable
  fingerprints and candidate version pins. Do not shortcut via direct user DB edits.
- [ ] Provide a small display contract/example showing independent select/edit/
  remove/reorder by instanceKey. Existing frontend product changes are outside
  this pilot until its actual owner and consumers are traced.
- [ ] Acceptance: discovery -> submit -> queued delivery retains A/B/A exactly,
  and changing one use does not alter another. Old18/19 API cases remain valid.

### Task5: CLIS pilot and closeout

- [ ] Keep all original PDFs, CLIS Model18 evidence and migrated Model19 fixtures.
  Derive a separately named new-contract CLIS candidate; do not overwrite those.
- [ ] Use checked source records to make a small multi-Port Outward sample with
  at least one Port spanning pages. Preserve source field meanings and blanks;
  no invented dimensions or corrected totals. Each group total follows its items.
- [ ] Export both formats, convert DOCX through Word, inspect all sample pages
  and verify row-once coverage, group headings, totals and document page numbering.
- [ ] Run only affected Core/Service/FlowDocMake checks and unchanged-model CLIS
  regressions. Record coverage, failures and accepted limits in this plan's result
  section; no full-system PASS from selected tests.
- [ ] Stop when the sample and affected checks meet acceptance. Commit the isolated
  candidate, but do not merge, tag, release, push, install or publish in this scope.

## Proof and document budget

One canonical plan/result document and retained machine-readable test/artifact
outputs; no synthetic execution registry or per-step report files. Reuse unchanged
baselines. Initial render targets are A/B/A plus the bounded CLIS multi-Port sample
in both formats and only affected old-model controls. Review every output page.
Use at most three render batches (initial, responsible repair, confirmation) before
reassessing a persistent failure; do not spend iterations tuning unrelated spacing.
Keep real render/service experiments at1GiB and isolated from the running service.
No arbitrary performance claim follows from these functional samples.

## Current result

Planning only. No runtime, schema, DB, definition, request, plugin cache or UI has
been changed for repeatable Section assembly. The CLIS19 migration remains the
preserved baseline, not evidence that repeated calls are already supported.
