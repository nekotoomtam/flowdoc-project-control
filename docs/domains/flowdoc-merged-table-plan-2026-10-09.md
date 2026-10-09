# Merged Table Implementation Plan

> For agentic workers: use superpowers:executing-plans for inline execution after
> owner review of this plan. No separate agent rooms are planned.

**Goal:** Export explicitly merged table cells with correct measurement, page
continuations and compatibility with existing document models.

**Architecture:** Core validates cell occupancy, measures logical cells once and
places page fragments referencing the same content owners. Service consumes only
the checked versioned Core package. Preserve the existing ordinary-table path.

**Tech Stack:** Existing TypeScript, Vitest, Core text/PDF pipeline, Node24,
Linux/amd64 packed consumer and Service PostgreSQL/Docker acceptance tools.

**Spec:** [Approved design](flowdoc-merged-table-design-2026-10-08.md).

## Authority Boundary and execution scope

Project Control owns this shared plan and approval status; Core and Service own
implementation and tests. Role: Planning Partner, then Product Implementation
Agent. Explicit request and approved design are work authority; execution IDs N/A.
Multi-step work, routine risk. Design approval received 2026-10-09; this plan awaits
review. Recommend inline execution because grid, measurement and pagination share
interfaces and are sequential. No dispatch or synthetic execution registry.

Before product edits, read each owner AGENTS.md and inspect clean development
state. Current inspected bases: Core 1790f26e, Service 1fc97fa. Use an isolated
worktree for the Core layout experiment; keep Service changes bounded to its
package consumer and tests. Preserve release/tag refs and unrelated changes.

Allowed: named Core contract/layout/tests/package files, Service pin/API fixture,
existing code-adjacent READMEs and these Project Control design/plan records.
No DB migration, frontend, new decoder, native shaping changes, release/tag/push,
shared map promotion, images in cells or general cell containers.

## Global constraints

- nodeModelVersion 6 enables explicit placement; model 4/5 remain compatible.
- columnIndex is zero-based; rowSpan and colSpan default to 1.
- Every authored cell in an explicit table supplies columnIndex.
- Fully covered rows may have empty cellIds; uncovered empty slots need real cells.
- Single header only; no rowspan crossing header/body or touching a repeated row.
- Colspan within repeated rows is supported, including zero-item expansion.
- Add spanning-height deficit to the last covered row, in deterministic order.
- Preserve existing multiple TextBlock children; richer cell containers are deferred.
- No full-document double render or Word-pagination equivalence claim.

## Review focus

1. Huge/malformed spans must fail before occupancy allocation (Task 1).
2. Fully covered rows and zero-repeat collections must not create false holes (Task 1).
3. Different line heights must never cause clipping or no-progress loops (Task 2).
4. A protected row inside a rowspan must preserve allowBreak=false (Task 2).
5. Repeated headers must leave room for body progress and never duplicate body text
   (Tasks 2 and 3).

## Task 1 — versioned cell contract, occupancy and binding

Files: modify Core src/composition/resolvedDocument.ts,
src/composition/validateResolvedDocument.ts, src/composition/composeDocument.ts,
src/template/types.ts, src/template/validateTemplate.ts and validateGraph.ts.
Create src/composition/tableGrid.ts and tests/template/mergedTable.test.ts.
Modify src/binding/expandRows.ts only if tests expose a required binding change.

Interface: `resolveTableGrid(table: Table, nodes: Record<string, DocumentNode>):
TableGrid`, internal only. TableGrid contains rowIds, columnCount, explicit flag
and cells `{id,row,column,rowSpan,colSpan}`. Throw a typed grid error with cell ID
and property on bounds/overlap/coverage failures. validateGraph first checks raw
node shapes, then maps grid errors into its existing Issue contract. Layout
consumes the same checked grid. Repeat-boundary validation remains contextual
to validateGraph, since resolved graphs no longer contain repeat declarations.

- [ ] Write failing cases for mixed spans, omitted span=1, overlap/hole, null/string/
  zero/unsafe-integer spans, bad column, mixed implicit/explicit cells, fully
  covered rows, header crossing and all repeat-touching rowspan positions.
- [ ] Add binding cases: repeated colspan with 0/1/3 items, props and unique source
  IDs retained, model 4/5 rejection of new props, model 6 image support retained.
- [ ] Run `npx vitest run tests/template/mergedTable.test.ts`; confirm missing
  capability failures before changing production code.
- [ ] Implement model 6 and grid validation. Bound work using actual rows/columns,
  never the submitted span. Preserve legacy validation for old models.
- [ ] Rerun focused tests and `npm run build`; review diff and commit when passing.

## Task 2 — logical measurement and merged pagination

Files: create Core src/layout/mergedTableFlow.ts and
tests/layout/mergedTableFlow.test.ts; modify src/layout/documentFlow.ts to delegate
explicit tables. Reuse measureText.ts, MeasuredLine, LayoutError and DrawPage.
Keep ordinary-table behavior in its established path.

Interface: `mergedTableFlow(document: ResolvedDocument, table: Table,
runtime: TextRuntime, sink: TablePageSink): Promise<void>`.
TablePageSink exposes `top`, `bottom`, `left`, `availableWidth`, current `y`,
`nextPage(): void`, `emitLine(line: MeasuredLine,x:number,y:number): void` and
`border(x1:number,y1:number,x2:number,y2:number,nodeId:string): void`.
documentFlow owns pages/run IDs; the helper updates sink.y and emits commands.

- [ ] Write failing geometry tests: merged-width wrapping, deficit added only to
  ending row, order-independent anchors, empty/fully covered rows and combined spans.
- [ ] Add pagination tests with body-line identity assertions, unequal line heights,
  exact page ends, multi-page rowspan, repeated/nonrepeated colspan header,
  allowBreak=false fit/failure and text/image/table neighbors.
- [ ] Run `npx vitest run tests/layout/mergedTableFlow.test.ts` and observe failure.
- [ ] Implement measurement via Task 1 grid. Measure once, initialize normal row
  minima, process spans by ending row/start row/column and add ending-row deficits.
- [ ] Implement page fragments with independent pending cell-line cursors. Legal
  cuts cannot bisect lines or protected rows; merge border segments so shared
  edges are drawn once and interior row separators exclude rowspan regions.
  Emit closed page fragments and continued empty regions for exhausted content.
  Require body progress with each repeated header; fail explicitly when impossible.
- [ ] Run focused tests and existing tests/layout/documentFlow.test.ts; inspect
  final diff, then `npm test` and `npm run build`. Commit passing Core behavior.

## Task 3 — real PDF and installed Core consumer

Files: create Core tests/consumer/checkMergedTable.mjs and bounded JSON fixture;
extend scripts/checkPackedConsumer.mjs using its existing invocation pattern.
Update Core package.json/package-lock.json and README.md for the new capability.
Target Core development 0.1.3; do not create tags.

- [ ] Exercise public validate/prepare/compose/PDF APIs with a short mixed-span
  fixture and long Thai/English multi-page fixture. Assert required tokens once
  per body occurrence, header repetition, page bounds and source-aware failures.
- [ ] Run `npm run check:package` after final build; require passing Linux/amd64
  installed consumer and existing text/image/ordinary-table checks.
- [ ] Render every page of the bounded fixture set and inspect border junctions,
  cell continuations, wrapping and neighbors. Reuse artifacts; only failures or
  changes justify reruns. Record package SHA256 and source commit.
- [ ] Commit checked package/consumer changes. A successful file write alone is
  not visual acceptance.

## Task 4 — Service integration and closeout

Files: Service vendor/flowdoc-core-0.1.3.tgz, vendor/manifest.json,
package.json/package-lock.json, README.md and tests/merged-table-api.test.mjs.
Use existing current/version and HTTP test helpers; no schema migration.

- [ ] Add a test registering/publishing a model 6 template, submitting data and
  downloading a merged-table PDF. Reject a malformed grid before job creation;
  prove old published templates remain loadable. Run first against old pin to
  observe the new capability failure.
- [ ] Pin the Task 3 artifact/checksum and set Service development version 0.1.3.
- [ ] Run `node scripts/verifyVendor.mjs`, build and `npm run check:database`;
  inspect actual results and fixture output. Do not count skipped tests as passing.
- [ ] Commit after final diff/impact review. Remove only current-run stopped test
  containers/networks; preserve volumes, evidence and unrelated worktrees.
- [ ] Update this plan with criteria-to-proof coverage, commits and limits;
  keep release/tag unchanged. Stop when the defined acceptance passes.

## Self-review and stop conditions

Spec coverage: contract/validation/binding -> Task 1; measurement/pagination ->
Task 2; visual/package compatibility -> Task 3; Service/snapshots -> Task 4.
Review-focus cases are assigned above. Grid output and sink interfaces are
internal and have a single owner. No new dependency or public HTTP API is needed.
If legal pagination cannot preserve the agreed height/line rules, report the
specific failing fixture before changing the design. Do not silently fall back
to moving an entire merged group or flattening cells.
