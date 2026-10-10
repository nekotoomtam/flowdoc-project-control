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
User approved design and inline implementation; accepted delivery is recorded below.
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

- [x] Write RED tests for scope isolation, defaults/required/types, old gates,
  duplicate/cyclic graph, unsupported band nodes and nested Columns.
- [x] Implement validation and composition, reuse field rules; scalar image/link
  handling must retain scoped diagnostic paths and resource references.
- [x] Test prepared/resolved JSON round-trip and forged prepared/resolved data.
- [x] Run build + affected data/template/composition tests, inspect diff, commit.

## Task2 — Measure bands and Columns

Create Core src/layout/pageBands.ts; tests/layout/pageBands.test.ts.
Consume Resolved bands, styles, TextRuntime and PdfImageResources.
Export measurePageBand(band,styles,widthPt,runtime,images) -> measured height and
local drawing commands; export selectPageBands(modes,role,sectionPageIndex).
Measurements key on band identity/style/width/resources; no cross-job cache.

- [x] Write RED tests for Thai wrapping, one-line minimum, empty/image-only,
  columns weights/gaps, long column, fixed overflow, min/max and bad combinations.
- [x] Implement shared measureText/image contain behavior, no new wrapping engine.
  Clone/translate local commands on placement, never mutate reusable measurements.
- [x] Check exact and over-boundary sizes and image missing behavior per old policy.
- [x] Run build + focused layout/image tests and commit.

## Task3 — Per-page available area and repeated paint

Modify Core src/layout/{documentFlow,cellTableFlow,mergedTableFlow,pageNumbers}.ts
and src/pdf/drawContract.ts as needed; create tests/layout/pageBandFlow.test.ts.
Page geometry computes contentTop/contentBottom from selected bands + gaps.
Pass top/bottom as live getters to table continuation sinks, not captured numbers.
Placement uses page-local unique draw IDs; anchor/TOC collection excludes bands.

- [x] RED tests all/first/continuation/none in portrait/landscape; cover/blank/empty.
- [x] Test 40% aggregate exact/overflow, hidden gaps and no overlap with legacy
  temporary page numbers; footer ends at inner bottom edge.
- [x] Test row/cell spans and repeated table header across changing page budgets,
  first-page-too-short but next-page-fits; impossible row terminates with error.
- [x] Implement next-page geometry before new-page y; keep old-model branches.
- [x] Run affected table/image/contents/link/page-section regressions and commit.

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

- [x] RED round-trip test: identical key across three scopes; separate IDs/values.
- [x] Forward migration test populated009 ->010; freshDB ->010; preserve snapshot
  rendering and IDs; constraints reject bad owner/duplicate schema.
- [x] Implement decomposition/assembly/storage/publish/load with cloned scoped rows.
  Keep band graph payload but extract inputSchema into normalized schema rows.
- [x] Propagate header/footer through direct and staged jobs, request hash/idempotency,
  bounded uploads and image discovery; same key in separate scopes stays isolated.
- [x] Real API import/save/publish/generate/download; missing variable/overflow fails
  with scoped diagnostics and no partial output; current edits leave snapshot intact.
- [x] Build + affected current/version/Area/resource/job tests on disposable DB.

## Task5 — Packed delivery, acceptance and cleanup

Core fixtures/page-bands/{template,request}.json, tests/consumer/checkPageBands.mjs,
scripts/checkPackedConsumer.mjs; Service examples and vendor package/manifest/lock.

- [x] Build sample: cover -> portrait first/continuation bands -> landscape merged
  table + images -> explicit blank -> closing section. Include long Thai fields,
  same key different values, image+Columns and missing/overflow negative cases.
- [x] Final review/fix, Core affected suite, commit runtime and pack Linux consumer.
- [x] Install verified0.1.11 artifact in Service, verify SHA/sourceCommit/integrity,
  run freshDB affected API suite with real image inputs and record exact counts.
- [x] Render/inspect sample and request owner PDF acceptance for position/continuation.
- [x] Only after passing: commit/fast-forward development; reuse unchanged proof,
  archive artifacts, remove clean merged worktrees/branches and disposable Docker.
- [x] Update design/roadmap status and limitations; keep release0.1.8 untouched.

## Stop conditions

Return to design for any scope expansion or incompatible API/storage semantics.
Do not implement band repeats/Area or body Columns to make a test fixture easier.
End when coverage passes; no full-system claims from scoped tests.


## Accepted delivery — 2026-10-10

R3 accepted in development 0.1.11. Core `d7533c1`, Service `55f7aad`;
packed runtime source `a3ac83450c5814afccdc1c6d6c7f2129a9bbd7a9`.
Owner accepted the short/long PDF. Final packed PDFs are byte-identical to that set.

- Core full suite: 386 passed, 43 files; build passed.
- Packed Linux/amd64 consumer: PASS, including legacy groups and page bands.
  Archive: `flowdoc-core/artifacts/worktree-archive/flowdoc-core-page-bands/1791623860781/result.json`.
  SHA256: `81c46dd09fb921b38f379c10004d6b9feacbdfe5c79a4972a6932fd7453d1912`.
  Short10/long11/empty2 pages; overflow fails with header/section diagnostic.
- Service affected coverage: 68 distinct tests. Initial final run passed67/68;
  the remaining old Area upgrade assertion expected only migration009. Updated
  that assertion to include010; all3 tests in its file then passed. Other67 results
  reused without runtime changes. No skipped checks counted as PASS.
  Archive: `flowdoc-service/artifacts/worktree-archive/flowdoc-service-page-bands/page-bands-r3/result.json`,
  `final-tests.json` and `area-upgrade-recheck.json` preserve both outcomes.
- Migration010 checked populated current and published schemas, existing IDs,
  scoped owner constraints, and restored immutable snapshot protection.
- Whole-change review found four issues: immutable snapshot backfill, completed
  protected table rows checked against later page capacity, schema scope identity
  moves, and model14 Area deletion. All fixed with regression evidence.
- PDF/API proof covers scoped values and images, defaults/required fields,
  section modes, portrait/landscape, cover/blank exclusion, variable page capacity,
  overflow rejection, save/publish/load and old-model consumers.

Integration: fast-forwarded existing development branches; build and vendor
identity passed in primary checkouts. Archived182 Core and16 Service artifact files
with matching hashes before removing clean merged page-bands worktrees/branches.
Removed only Docker project flowdoc-page-bands-r3 and its disposable volumes.
Release refs unchanged: Core7b5161c / Service78c9491 (0.1.8); no push/deploy.
Local template/API guides updated. No maps or shared runtime claims promoted.

Known limitation: R1 migration004 baseline test debt remains before combined
release. This result is not a full Service suite, clean-machine or load acceptance.
Next: R4 formal page numbering under the roadmap; no automatic scope expansion.
