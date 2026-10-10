# R4 System Page Fields Implementation Plan

> For agentic workers: use superpowers:executing-plans task-by-task inline.
> Checkboxes track execution; tests and artifacts establish acceptance.

**Goal:** ผู้สร้างวาง current/total ในหัวท้าย โดยระบบนับและเติมเองหลังจัดหน้า.
**Architecture:** model16 extends scoped model15. Fixed-width inline slots reserve
geometry before pagination; a final fill uses real page metadata without relayout.
Service preserves the authored structure and never accepts system values as inputs.
**Tech Stack:** existing TypeScript/Node24, text runtime, PDF writer, PostgreSQL/Docker.
**Spec:** [approved R4 design](flowdoc-page-system-r4-design-2026-10-10.md).

## Authority Boundary

Owner: Project Control, Planning Partner; implementation owners Core and Service.
Status: written implementation plan for owner review; no R4 code changed.
Owner accepted written design, including its three technical proposals, in this chat.
Bases: Core b0657ee / Service6729964, development0.1.12. Release0.1.8 stays unchanged.
Medium overall, routine risk; inline, no registered execution IDs or separate rooms.
Document budget: this plan, approved design and existing roadmap; local guides at delivery.
Proof budget: focused RED/GREEN, impacted suites, one fresh final review, packed Linux
consumer, isolated real DB/API tests and owner PDF acceptance. No load benchmark.
Execution method remains inline. Worktree isolation at implementation time, not for prose.
Target next usable development delivery0.1.13; documentation alone does not bump version.

## Global Constraints

- Only model16 gains policy/system inline; model4–15 fingerprints/behavior preserved.
- Default continue/show; restart default1; positive safe integers, checked increments.
- total counts participating physical pages, not largest displayed number.
- Cover excluded/hidden; blank counted/hidden; exclude does not advance counter.
- No token means no automatic number. API never needs current/total or new input fields.
- System inline allowed only in header/footer TextBlocks. No body/Area/table/formulas.
- hide suppresses the whole TextBlock containing tokens but retains geometry.
- current on exclude is invalid even when hidden. total alone on exclude is legal.
- Fixed slot width, no wrap/shrink/truncate; overflow reports Section/node/field.
- One full layout; fill before font subsetting; cache never retains per-page values.
- Physical page/link identity stays independent of displayed numbers.
- No release/push/deploy, unrelated DB repair, new migration without demonstrated need.

## Concrete interfaces

Authored model16 preserves model15 request/scopes/storage identity. Add:

```ts
type PageNumbering =
  | {mode:'continue';visibility?:'show'|'hide'}
  | {mode:'restart';startAt?:number;visibility?:'show'|'hide'}
  | {mode:'exclude';visibility?:'show'|'hide'};
type SystemPageField = {
  id:string; type:'system-page-field'; field:'current'|'total'; width:Length
};
```

`Section16.numbering?:PageNumbering`; omitted means continue/show on body/blank.
Cover normalizes to exclude/hide; incompatible explicit settings fail validation.
Blank policy still controls counting, but page role always suppresses band rendering.
Keep width positive finite mm/pt. No scope/key/default on a system token.
Retain tokens through binding and resolved validation rather than convert to strings.
Use explicit model15/16 scoped predicates; do not widen unsupported future models.

Resolved section stores normalized policy. Extend DrawPage with
`pageNumbering?:{current:number|null;total:number;visibility:'show'|'hide'}` for16;
preserve countedPageNumber compatibility for old paths. DrawDocument carries
`pageFieldSlots?:PageFieldSlot[]` with pageIndex, sectionId, nodeId, fieldId, field,
xPt/yPt/widthPt and TextStyle. Coordinates are final page coordinates.

Counting helper `assignSystemPageNumbers(document:ResolvedDocument,draw:DrawDocument):void`
is model16-only; legacy assignCountedPages remains unchanged.
Filling helper `fillPageFields(draw:DrawDocument,runtime:TextRuntime):Promise<void>`
shapes each visible value, appends commands, then removes transient slots.
Both helpers throw LayoutError with source context on invalid state/overflow.

## Review Focus

1. Same cached band across many pages must yield different current values (Task3).
2. Restart→exclude→continue resumes the last counted number, not physical index (Task2).
3. hide suppresses literals/links in token block but keeps other band blocks and space (Task3).
4. Same-named API variables cannot override system tokens; reload preserves policy (Task4).
5. New model must not leak into legacy scoped storage/layout or TOC null fallback (Tasks1,3,4).

## Task1 — Model16 validation, binding and composition

Files: Core src/template/{types,validateTemplate,sectionOwnership,pageBands,validateGraph}.ts;
src/composition/{resolvedDocument,validateResolvedDocument,composeSections,composePageBand}.ts;
src/binding/bindInlines.ts; src/data/{prepareGeneration,prepareSections}.ts; src/index.ts.
Create src/template/pageNumbering.ts for policy/token checks;
tests/template/pageNumbering.test.ts and tests/composition/pageNumbering.test.ts.

- [ ] RED: model16 policy/token accepted only in bands; model15 token rejected;
  malformed width/startAt, unknown fields, body token, current-on-exclude fail.
  Run `npm test -- tests/template/pageNumbering.test.ts tests/composition/pageNumbering.test.ts`.
- [ ] Implement types above and model gates; share scoped15 paths without mutating
  the incoming template/model or recomputing fingerprints from a downgraded copy.
- [ ] Preserve token identity/width/sourceMap through composition/prepared reload;
  examples normalize without requesting page fields. User data current/total stays separate.
- [ ] Run build plus template/data/composition suites; inspect diff and commit when PASS.

## Task2 — Counting metadata independent of rendering

Files: create Core src/layout/systemPageCounting.ts, tests/layout/systemPageCounting.test.ts;
modify src/pdf/drawContract.ts and src/layout/documentFlow.ts.
Consumes normalized Section16 policy; produces per-page metadata through helper above.

- [ ] RED numeric assertions: cover +2body +blank +hidden2 +excluded2 +restart10(2pages)
  +continue1 gives currents null,1,2,3,4,5,null,null,10,11,12; total8 on every page.
  Physical order/sectionPageIndex unchanged. A Section with no physical pages cannot reset.
- [ ] Implement one ordered page traversal and total accumulation; no repeated Section
  scans per page (index policy once). Check safe-integer overflow before increment.
- [ ] Test default, restart1, start10, all-excluded total0, invalid unresolved owner,
  no-TOC/no-token documents and legacy counting unchanged.
- [ ] Run `npm run build` and `npm test -- tests/layout/systemPageCounting.test.ts tests/layout`;
  inspect diff and commit independent counting behavior when PASS.

## Task3 — Measure slots, fill numbers and keep links correct

Files: create Core src/layout/{measurePageFieldText,fillPageFields}.ts;
tests/layout/pageFields.test.ts; modify src/layout/{pageBands,documentFlow,pageNumbers,fillContentsNumbers}.ts,
src/pdf/createPdfEngine.ts and src/composition/linkContract.ts where token traversal requires it.

- [ ] RED: mixed literal/text-variable/system-token band, two tokens on one line,
  Thai text, explicit newline, wrap around atomic slot, Columns and font variants.
  `measurePageFieldText(node,style,width,runtime)` returns lines/static runs and
  relative token slots; preserve existing measureText path for blocks without tokens.
- [ ] Implement token-aware line measurement using existing runtime.breaks/shape and
  grapheme-safe fallback for text; atomic slots occupy declared widths and normal line height.
  Shape adjacent text together within a text run; do not split Thai into individual glyph requests.
  Preserve link offsets/rectangles, literal spacing and source IDs across slots.
- [ ] Cache measured static runs/relative slots, copy/offset per page. Hide token blocks'
  text, links and slots while retaining measured height; other blocks still render.
- [ ] Fill real numbers after pagination/counting and before subset/write, right aligned
  in slots; check ink and height with existing measureNumber. Legacy automatic footer
  runs only for models4–15; model16 never inserts a number not authored by the creator.
- [ ] Pin 9→10/99→100, slot overflow, same-width Sections, per-page cache isolation,
  blank/cover exclusion, unchanged body pagination show vs hide and exactly one layout.
- [ ] For model16 TOC use current even when hidden; null destination gives LayoutError,
  not physical fallback. Repeated displayed numbers must keep distinct physical links.
- [ ] Run build and layout/pdf/composition tests; inspect diff and commit on PASS.

## Task4 — Service persistence and unchanged caller contract

Files: Service src/templates/{assembly,current,contract}.ts and impacted model gates;
tests/page-numbering-{assembly,api}.test.mjs; examples/page-numbering-{template,request}.json.
Use interim Core artifact only until Task5 final pin. No product implementation copied into Service.

- [ ] RED: decompose/assemble model16 keeps section numbering and inline tokens;
  schemas contain no system fields, no DB IDs change on save, old published version stable.
- [ ] Extend explicit scoped model gates to16; preserve policy/token JSON in existing
  section payload. Audit migration011 owner triggers for15-only assumptions; if16
  requires schema behavior change, report contract impact before adding migration.
- [ ] API test import/publish/contract → POST jobs using data/sections only → worker
  reload → PDF download. Inject same-named user data and prove page fields remain computed.
  Required validation should never ask for page.current or page.total.
- [ ] Verify overflow yields failed job/no PDF, unknown Section still rejected, and
  legacy15 request/current/version paths unchanged. Run build and affected suites on
  isolated Docker database; preserve migration004 debt outside this scope. Commit on PASS.

## Task5 — Package, sample acceptance and development integration

Files: Core fixtures/page-numbering/{template,request}.json,
tests/consumer/checkPageNumbering.mjs, scripts/checkPackedConsumer.mjs, Dockerfile.consumer;
both package versions/local guides, Service vendor artifact/manifest/lock;
this plan and existing roadmap delivery records.

- [ ] One fresh whole-change review; fix correctness findings with targeted regressions.
  Final Core full suite/build and Service impacted tests cover changed areas, not test count alone.
- [ ] Set candidate0.1.13 after usable behavior; packed Linux consumer creates cases
  with/without TOC and without tokens. PDF includes cover, mixed orientations,
  continued/hidden/blank/excluded/restart sections, current/total beside normal text.
- [ ] Assert actual counting, links, absence of auto-numbering and no leaked placeholders;
  compare old model15 output with archived0.1.12. Pin exact final tarball SHA/source commit
  in Service and rerun affected real DB/API checks against that installed package.
- [ ] Render/inspect all sample pages and ask owner to inspect PDF. Only after acceptance,
  fast-forward development branches, reuse unchanged proof, archive verified artifacts,
  remove clean merged current-round lanes/branches and disposable Docker.
- [ ] Record exact results/commits/remaining R5/R6 work. Never claim release readiness
  or full Service-suite PASS while old migration004 debt remains.

## Self-review and handoff

Coverage: authored/API boundary Task1+4; counting Task2; geometry/cache/visibility
and minimum TOC compatibility Task3; runtime/package/legacy/owner sample Task5.
Review Focus is covered by named assertions above. No design requirement unassigned.
Remaining prerequisite: owner reviews this written plan before inline implementation.
No product source edits, dependency installation or worktree creation in planning.
