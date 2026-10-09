# Links and Destinations Implementation Plan

> For agentic workers: use superpowers:executing-plans for inline execution after
> plan review. No separate implementation rooms are planned.

**Goal:** Support distinct url/link/reference commands, variable binding and
clickable PDF destinations based on actual layout.

**Architecture:** Keep typed link ranges through existing text shaping and line
placement. Resolve anchors and per-line hit rectangles after layout; serialize
safe external/internal PDF actions separately. Service stores the new variable
type and consumes the checked Core artifact.

**Tech Stack:** Existing TypeScript, Vitest, Core shaping/PDF writer, PostgreSQL,
Node24/Linux Docker acceptance and an available interactive PDF viewer.

**Spec:** [Approved links design](flowdoc-links-design-2026-10-09.md).

## Authority Boundary

Project Control owns this plan, Core/Service own implementation. Active role:
Product Implementation Agent / Documentation Synthesizer; execution IDs N/A. Multi-step, routine risk; untrusted URLs and
PDF action serialization require specific validation. Work authority: owner
approved design and written implementation plan; owner authorized execution in this chat.
Recommend same-room inline execution; preserve this method from the current flow.
Core base 7313fd2, Service base 6415dcb; both inspected clean. Use isolated Core
worktree for range/layout changes; Service consumer changes remain separately
scoped. Preserve unrelated state. No release/tag/push or shared map changes.
Proof budget: focused red/green tests, full affected suites, one final packed Core
consumer and Service database check, bounded visual and click fixtures. Repairs
justify relevant reruns; no unrelated capacity or typography investigation.
Document budget: this plan, approved design, existing roadmap and local READMEs.

## Global constraints and exact contract choices

- nodeModelVersion 7 enables links and anchors; models 4–6 retain prior behavior.
- Literal commands retain the approved shapes. BoundLink is the discriminated
  union `{type:'url',value:string} | {type:'link',text:string,url:string} |
  {type:'reference',text:string,target:string}`; inline graph nodes also have id.
- Template string-valued command properties and anchorId accept a string literal
  or `{scope:'global'|'local'|'item',key:string}` referring to a declared string.
- A field-ref to schema `{type:'link',required?,default?,label?,description?}`
  inserts a BoundLink; link is also allowed inside existing array item schemas.
  Do not add recursive arrays/objects or image fields inside arrays.
- Optional absent link emits nothing. Use the existing prepared-data empty-string
  convention only as an internal absent sentinel; supplied empty strings and null
  are invalid link values. Validate declared defaults as BoundLink objects.
- anchorId names a unique composed TextBlock destination. Require nonempty IDs,
  fail duplicate/missing/empty targets with source context, and preserve first
  nonempty positioned line as the destination. Repeated formats bind unique IDs.
- Only absolute HTTP/HTTPS URLs; reject credentials/control characters. No fetch,
  script actions, automatic TOC, numbering or page-reference text substitution.
- Preserve fonts/black text and no automatic underline; no new styling controls.
- Initial development package targets: Core and Service 0.1.4, independently
  versioned. Add unused master 110005/link with a forward-only migration.

## Review focus

1. Optional absence versus malformed supplied/default link objects (Task 1).
2. Same authored heading repeated with distinct or duplicate bound anchors (Task 1).
3. Thai combining marks/ligatures and adjacent links sharing a cluster (Task 2).
4. Forward references, repeated headers and multi-page targets (Task 2).
5. PDF string injection, coordinate inversion and real viewer activation (Task 3).

## Task 1 — contract, typed variables and binding

Files: Core src/composition/resolvedDocument.ts, validateResolvedDocument.ts,
validatePreparedInput.ts, composeDocument.ts; src/template/types.ts,
validateSchemas.ts, validateGraph.ts, validateTemplate.ts; src/data/types.ts,
validateValues.ts; src/binding/bindInlines.ts and expandRows.ts.
Create src/composition/linkContract.ts and tests/binding/linkFields.test.ts.

Interfaces: linkContract exports BoundLink, `validateLink(value:unknown):boolean`,
`linkLabel(value:BoundLink):string` and `validateExternalUrl(value:unknown):boolean`.
Graph validation maps boolean failures to existing Issue paths; retain source
mapping for every expanded link leaf. Binding resolves command scalar refs and
anchors before layout, then checks document-wide anchor uniqueness/target presence.

- [x] Write failing tests for all three literal/bound variants, global/local/item
  scope, valid defaults, optional omission, invalid supplied types/defaults,
  unknown fields, URL scheme/credentials/controls, duplicate and missing anchors.
  Assert legacy-model rejection and model 7 image/merged-table preservation.
- [x] Run `npx vitest run tests/binding/linkFields.test.ts`; observe missing
  capability failures before implementing the contract and binding above.
- [x] Preserve display/target identity across newline normalization. Do not turn
  arbitrary strings into links or stringify objects. Run focused tests/build,
  review diff and commit when passing.

## Task 2 — measured ranges and positioned destinations

Files: Core src/layout/measureText.ts, textFlow.ts, documentFlow.ts,
mergedTableFlow.ts; src/pdf/drawContract.ts. Create src/layout/linkGeometry.ts
and tests/layout/linkGeometry.test.ts.

Interface: GlyphRun gains optional normalized source character ranges and link
spans only for linked content. DrawPage gains optional annotations with a page-
local rectangle and typed destination. DrawDocument gains optional anchors
mapping ID to zero-based page index and top-left line coordinates.
`resolveLinkGeometry(document:ResolvedDocument,draw:DrawDocument):void` runs after
placement and before subsetting/writing. The engine owns this one invocation.
No extra optional fields are emitted into legacy draw data, preserving hashes.

- [x] Write failing tests asserting literal display text equals measured text;
  wrapped URLs/labels yield one hit area per visible line, across page and table
  fragments. Check surrounding text has no clickable area.
- [x] Add cluster-boundary tests with Thai marks, ligatures, ink bearings and
  adjacent links. Reject conflicting link ownership of a cluster explicitly.
- [x] Add forward/backward reference, leading blank lines, fully empty target,
  reflowed target, multi-page target and repeated-header-first-copy tests.
- [x] Run `npx vitest run tests/layout/linkGeometry.test.ts`; observe failure.
  Implement ranges alongside existing line shaping, deriving horizontal extents
  from positioned glyphs rather than reshaping slices or counting characters.
- [x] Run focused and existing text/table/image layout suites plus build. Verify
  every target has an actual nonempty line; commit after diff review.

## Task 3 — safe PDF actions, packaging and click evidence

Files: Core src/pdf/createPdfEngine.ts, writePdf.ts, primitives.js; extend
tests/pdf/writePdf.test.ts. Create tests/consumer/checkLinks.mjs and
fixtures/links/template.json; extend Dockerfile.consumer and
scripts/checkPackedConsumer.mjs; update package metadata and README.

Interfaces: writer consumes Task 2 annotations/anchors. Its internal object
allocator resolves actual page references before emitting internal destinations.
Link annotations use external URI actions or internal destinations, never raw
caller PDF fragments. Keep shared string/number escaping and finite rectangle
checks at the writer boundary; retain existing page/font/image object references.

- [x] Write failing writer tests for page-object destinations, per-page rectangles,
  Unicode labels/IDs and URLs containing PDF delimiters. Assert malicious schemes
  and invalid geometry cannot create actions or arbitrary objects.
- [x] Run focused tests, implement PDF action serialization and confirm green.
- [x] Run Core full tests/build, then `npm run check:package`. Inspect installed
  consumer outputs and compare legacy PDF hashes. Record artifact checksum/commit.
- [x] Render the bounded linked-document fixture and inspect wrapped labels and
  unchanged text geometry. Inspect annotations programmatically for every page.
- [ ] In an available controllable PDF viewer, activate a controlled external
  example URL and forward/back internal links, including after reflow. Record
  actual observed destination/page. If viewer control is unavailable, request the
  owner's bounded click check; keep interactive acceptance pending, not PASS.
- [x] Commit verified Core package changes; do not promote release or tag.

## Task 4 — Service master, immutable versions and API export

Files: Service migrations/008_link_variable_type.sql,
src/templates/assembly.ts; tests/link-api.test.mjs; affected master/migration
expectations in tests/current.test.mjs, tests/image-master.test.mjs and
scripts/checkDatabase.mjs; vendor artifact/manifest, package metadata and README.
Inspect exact migration assertions before editing; preserve applied migrations.

Interfaces: master 110005 maps to schema code link. Assembly preserves object
defaults and new graph props in current and published snapshots. Service imports
Core validation from the pinned root; never forks link validation or PDF logic.

- [x] Add failing tests for master/type roundtrip, link defaults/array items,
  publication isolation, old snapshot loads and invalid publication rejection.
- [x] Add API job/download test for a document with all three commands and a
  repeated-format destination; check output annotations and target mapping.
- [x] Add migration and assembly mapping; pin the exact checked Core artifact.
  Update Service to 0.1.4. Verify vendor identity/build and `npm run check:database`.
- [x] Review changes and coverage; commit only after affected checks pass.
  Remove current-run test containers/network, retain evidence/volumes.
- [x] Record commits, proof and interactive result in this plan, update the existing
  roadmap, and stop. Automatic TOC and general styling remain separate work.

## Self-review and handoff

Approved spec coverage: commands/variables/anchors -> Task 1; range/layout/first
occurrence -> Task 2; safe PDF and actual activation -> Task 3; master and consumer
-> Task 4. Task 2 consumes Task 1 BoundLink and bound anchors; Task 3 consumes
Task 2 placed annotations; Task 4 consumes Task 3 verified artifact. No conflicting
owners. High-impact unknown is cluster ownership: tests and explicit rejection
must prevent ambiguous clicks, not an unreviewed wrapping rewrite.
Recommended execution remains inline in this chat with one final fresh review;
written-plan review was accepted before implementation.

## Execution result — 2026-10-09

Status: automated checks PASS; interactive activation UNKNOWN/pending. This is a
local development candidate, not completed release acceptance. No registered
execution IDs apply. Core remains in the isolated links worktree pending the
owner's click check; Service consumes that exact committed artifact.

- Core commits: `15d0db0` (contract/binding), `18d66be` (positioned geometry),
  `0b119d9` (PDF actions/package), `e51ee7b` (ink-bearing review repair).
- Service commit: `b7bf7d9` (master 110005, migration 008, assembly, API tests/pin).
- Core version 0.1.4, Service version 0.1.4. Core source commit:
  `e51ee7b9b164c4e92d0bfa625eb4d39a5f386b18`.
- Checked tarball SHA-256:
  `c25c4d35c1ddb7a38dc5418de6c3bd1305e760ad004f49e0aa6338ce51a30e98`.
- Core tests/build: 186 passed. Final packed Linux consumer:
  `../flowdoc-core-links/artifacts/1791513405642/result.json`.
  `legacy-comparison.json` compares all previous text, binding, table, image and
  merged-table result groups with the accepted 0.1.3 artifact; all unchanged.
- Final PDF fixtures: `links-short.pdf` (1 page) and `links-reflow.pdf` (2 pages)
  in that artifact directory. All three pages rendered and visually inspected.
  `annotation-inspection.json` records parsed hit rectangles and destinations:
  external example.com URLs, short-document same-page targets, forward to page 2
  and backward to page 1 after reflow. Each fixture has eight annotations because
  internal labels wrap. Annotation inspection is not activation evidence.
- Service final database/container check:
  `../flowdoc-service/artifacts/1791513529496/result.json`: 99 passed, zero failed
  or skipped; real API job/download, publication isolation, master mapping,
  migration/replay and prior populated database preservation.
- Initial package attempt encountered a transient Docker context-file lock;
  retry succeeded. Initial Service check found an old migration-list expectation;
  added migration 008 and its expected master delta, then final check passed.
- Fresh read-only review found missing glyph ink bearings in hit rectangles.
  Added a failing deterministic reproduction; repaired geometry using the real
  per-glyph ink bounds, while omitting new metadata from legacy draw contracts.
  Tests, package and Service consumer were rerun after the repair.
- Current-round Service containers/networks from both checks removed; volumes and
  evidence retained. Core worktree retained for pending click review.
- Both release branches and v0.1.0 tags unchanged. No map promotion, frontend,
  automatic contents list, DOCX behavior or push.

Remaining acceptance: Windows Computer Use stopped because it could not establish
the browser URL confidently enough for policy enforcement. No automated PDF link
was clicked. Ask the owner to open links-reflow.pdf: click the first section's
internal label to reach the last heading on page 2, click its internal label to
return to page 1, and click the URL and labeled website link to example.com.
The written plan explicitly allows this bounded owner check when viewer control
is unavailable. Do not mark interactive acceptance PASS until observed/reported.
