# FlowDoc R3 Implementation Plan

> For agentic workers: use superpowers:executing-plans task-by-task inline.
> Checkboxes record execution, not acceptance evidence.

**Goal:** Scoped API header/footer data, reusable band layout and page selection
without overlap or changes to old models.
**Architecture:** Core model14 owns band validation/binding/measurement/PDF.
Service persists scoped schemas and prepares images through the existing pipeline.
**Tech Stack:** TypeScript, Node24, PostgreSQL, existing PDF/text runtime, Docker.
**Spec:** [R3 design](flowdoc-page-system-r3-design-2026-10-10.md).

## Authority Boundary

Project Control owns this plan. Inline Planning Partner/Product Implementation
roles; no registry execution IDs. Medium/routine cross-repository implementation.
User approved the written design to proceed; this plan is for review before code.
Bases: Core3e85fd2 / Service7ea6150. Read owner guides before changing each repo.
Retain current inline session; no separate WORK dispatch or synthetic records.
Use isolated sibling worktrees for implementation; do not change release.

Allowed: R3 contract/layout/binding/image/storage/API consumers, migration010,
focused tests/fixtures, package metadata and existing local guides.
Forbidden: body Columns, nested bands, Table/Area/repeats in bands, formulas,
last-page closing placement, DOCX/frontend, broad DB/performance redesign.
Version target0.1.11 only on verified usable delivery, not per partial task.

Document budget: design, this plan, roadmap plus owner-local usage updates.
Proof budget: RED/GREEN feature tests, affected regressions, one packed Linux
consumer, isolated Service DB migration/API run, whole-change review, owner PDF.
Repeat checks only after relevant changes/failure. Existing migration004 test debt
is not a R3 PASS claim; new010 upgrade checks must actually pass.

## Global Constraints

- data binds body/cover; header and footer bind only their own scope.
- One header/footer definition per template; independent section modes all/first/
  continuation/none. Cover and explicit blank never reserve or draw bands.
- TextBlock/Image/one-level weighted Columns only in bands, scalar schemas.
- Default content height, minimum one required base-style line, fixed alternative,
  gap0 default, 40% aggregate inner-page height cap; no shrink/clip.
- mm/pt, finite lengths, top alignment; invalid fixed/min/max combinations reject.
- No repeated TOC entries/duplicate anchor definitions. Legacy models4–13 unchanged.
- Template versions clone scoped rows with new IDs and preserve source references.
- Do not discard bands at request acceptance, staging, persistence or job reload.

## Review Focus

1. Same field/resource name in three scopes cannot overwrite or fall back.
2. Long row spans across a first/continuation height change must progress safely.
3. All-empty band still reserves one line; hidden band reserves nothing.
4. Migration preserves old published snapshots and existing IDs.
5. Repeated link/image drawing cannot mutate reusable measured commands across pages.

## Task1 — Model14 and scoped binding

Modify Core src/template/{types,validateTemplate,validateGraph,pageSections}.ts,
src/data/{readGenerationJson,types,prepareGeneration,validateValues}.ts,
src/composition/{resolvedDocument,composeDocument,composeSections,
validatePreparedInput,validateResolvedDocument}.ts and public exports if needed.
Create src/template/pageBands.ts and tests/template/pageBands.test.ts,
tests/composition/pageBands.test.ts.

Interfaces: PageBandDefinition={inputSchema,fragment,baseTextStyleId,sizing?,gap?};
sizing is {mode:'content',minHeight?,maxHeight?}|{mode:'fixed',height}.
Template14 header/footer optional. Section headerMode/footerMode as spec enums.
Request/prepared header/footer optional scoped objects. Resolved bands contain
rootIds, independently prefixed nodes/sourceMap, baseTextStyleId and sizing/gap.
Band Columns type is {id,type:'columns',props:{gap?},columns:{weight,childIds}[]}.

- [ ] Write RED tests for scope isolation, defaults/required/types, old gates,
  duplicate/cyclic graph, unsupported band nodes and nested Columns.
- [ ] Implement validation and composition, reuse field rules; scalar image/link
  handling must retain scoped diagnostic paths and resource references.
- [ ] Test prepared/resolved JSON round-trip and forged prepared/resolved data.
- [ ] Run build + affected data/template/composition tests, inspect diff, commit.

## Task2 — Measure bands and Columns

Create Core src/layout/pageBands.ts; tests/layout/pageBands.test.ts.
Consume Resolved bands, styles, TextRuntime and PdfImageResources.
Export measurePageBand(band,styles,widthPt,runtime,images) -> measured height and
local drawing commands; export selectPageBands(modes,role,sectionPageIndex).
Measurements key on band identity/style/width/resources; no cross-job cache.

- [ ] Write RED tests for Thai wrapping, one-line minimum, empty/image-only,
  columns weights/gaps, long column, fixed overflow, min/max and bad combinations.
- [ ] Implement shared measureText/image contain behavior, no new wrapping engine.
  Clone/translate local commands on placement, never mutate reusable measurements.
- [ ] Check exact and over-boundary sizes and image missing behavior per old policy.
- [ ] Run build + focused layout/image tests and commit.

## Task3 — Per-page available area and repeated paint

Modify Core src/layout/{documentFlow,cellTableFlow,mergedTableFlow,pageNumbers}.ts
and src/pdf/drawContract.ts as needed; create tests/layout/pageBandFlow.test.ts.
Page geometry computes contentTop/contentBottom from selected bands + gaps.
Pass top/bottom as live getters to table continuation sinks, not captured numbers.
Placement uses page-local unique draw IDs; anchor/TOC collection excludes bands.

- [ ] RED tests all/first/continuation/none in portrait/landscape; cover/blank/empty.
- [ ] Test 40% aggregate exact/overflow, hidden gaps and no overlap with legacy
  temporary page numbers; footer ends at inner bottom edge.
- [ ] Test row/cell spans and repeated table header across changing page budgets,
  first-page-too-short but next-page-fits; impossible row terminates with error.
- [ ] Implement next-page geometry before new-page y; keep old-model branches.
- [ ] Run affected table/image/contents/link/page-section regressions and commit.

## Task4 — Service scoped schema persistence and API resources

Create migrations/010_page_band_schemas.sql. Modify src/templates/{assembly,
storage,current,publish,registry}.ts, src/http/server.ts, src/images/{job,prepare}.ts
and job/upload request consumers only where inspection proves propagation needed.
Create tests/page-band-assembly.test.mjs, page-band-migration.test.mjs,
page-band-api.test.mjs. Inspect both storage clone/load SQL before editing.

SchemaRow scope global|format|header|footer; formatId nonnull iff scope=format.
Version table mirrors scope with format_version_id. Unique owners include scope;
retain same-template composite FK. Backfill existing null references global and
nonnull format. Legacy record inputs infer omitted scope; validate canonical form.

- [ ] RED round-trip test: identical key across three scopes; separate IDs/values.
- [ ] Forward migration test populated009 ->010; freshDB ->010; preserve snapshot
  rendering and IDs; constraints reject bad owner/duplicate schema.
- [ ] Implement decomposition/assembly/storage/publish/load with cloned scoped rows.
  Keep band graph payload but extract inputSchema into normalized schema rows.
- [ ] Propagate header/footer through direct and staged jobs, request hash/idempotency,
  bounded uploads and image discovery; same key in separate scopes stays isolated.
- [ ] Real API import/save/publish/generate/download; missing variable/overflow fails
  with scoped diagnostics and no partial output; current edits leave snapshot intact.
- [ ] Build + affected current/version/Area/resource/job tests on disposable DB.

## Task5 — Packed delivery, acceptance and cleanup

Core fixtures/page-bands/{template,request}.json, tests/consumer/checkPageBands.mjs,
scripts/checkPackedConsumer.mjs; Service examples and vendor package/manifest/lock.

- [ ] Build sample: cover -> portrait first/continuation bands -> landscape merged
  table + images -> explicit blank -> closing section. Include long Thai fields,
  same key different values, image+Columns and missing/overflow negative cases.
- [ ] Final review/fix, Core affected suite, commit runtime and pack Linux consumer.
- [ ] Install verified0.1.11 artifact in Service, verify SHA/sourceCommit/integrity,
  run freshDB affected API suite with real image inputs and record exact counts.
- [ ] Render/inspect sample and request owner PDF acceptance for position/continuation.
- [ ] Only after passing: commit/fast-forward development; reuse unchanged proof,
  archive artifacts, remove clean merged worktrees/branches and disposable Docker.
- [ ] Update design/roadmap status and limitations; keep release0.1.8 untouched.

## Stop conditions

Return to design for any scope expansion or incompatible API/storage semantics.
Do not implement band repeats/Area or body Columns to make a test fixture easier.
End when coverage passes; no full-system claims from scoped tests.
