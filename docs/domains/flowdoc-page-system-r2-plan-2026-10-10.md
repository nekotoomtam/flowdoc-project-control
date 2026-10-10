# FlowDoc R2 Implementation Plan

> For agentic workers: use superpowers:executing-plans to implement task-by-task inline. Checkboxes track execution, not acceptance evidence.

**Goal:** ปกหน้าเดียวพร้อม TextBlock จองความสูง หน้าเปล่าที่สั่งได้ และเลขพื้นฐานที่ไม่นับปก.
**Architecture:** ขยาย section contract เป็น model13; Core ประกอบ/จัดหน้าและคำนวณเลขร่วมกัน ส่วน Service ใช้ packed Core และเก็บสัญญาเดิมผ่าน payload. ไม่เพิ่ม renderer ใน Service.
**Tech Stack:** TypeScript, Node24, Vitest, existing text/PDF runtime, PostgreSQL and Docker Linux/amd64.
**Spec:** [R2 design](flowdoc-page-system-r2-design-2026-10-10.md).

## Authority Boundary

Owner: Project Control; role Planning Partner, execution Product Implementation Agent.
Inline work, no registry/Work/Phase IDs. Medium-sized/routine implementation follows
Core7134894 and Service27e7a3b; inspect bases and owner AGENTS before editing.
This plan is intent, not proof or release approval. Existing R1 acceptance stays intact.
User accepted design and requested speed; preserve native inline execution used in R1.
No product implementation starts before the written plan review required by writing-plans.

Planning document budget: this plan, R2 design status and roadmap pointer only.
Implementation documentation: those records plus Core template-guide/README and Service
usage/README as needed. No new maps, registries or reports solely for ceremony.
Proof budget: failing/passing targeted tests per task, affected regressions, one packed
Linux consumer, one Service container run against a fresh named database, one final
review and PDF visual acceptance. Repeat only after relevant changes/failures.
Model selection: preserve this inline session; no new WORK room/model dispatch.

## Global Constraints

- model4–12 preserve behavior and published snapshots; new contract is model13.
- Cover: first section, at most one, authored source, exactly one physical page,
  no count/no number/no automatic TOC entry; references may still point to cover anchors.
- Fixed-height only directly authored root TextBlock on cover; >0 mm/pt,
  top(default)/center/bottom; no padding/shrink/clip; overflow is LAYOUT_FAILED.
- Blank: one physical page per blank section; counts but draws no page number.
- Request stays docKey/version/data/content/uploadId as applicable, no layout graph.
- Page numbers and TOC share counted number; anchors retain physical pageIndex.
- No header/footer UI, restart/roman/total numbering, DOCX, fixed cells or release changes.
- Versions move to Core/Service0.1.10 only after usable verified implementation;
  model13 and package0.1.10 are separate version concepts. Preserve old tarballs.
- Use isolated worktrees and fresh disposable DB; retain PDFs before clean merged cleanup.

## Review Focus

1. Empty fixed text versus explicit line-break: task2 asserts different occupied text height.
2. Area-expanded root must not acquire fixed permission: task1 rejects template and resolved tampering.
3. Cover with individually fitting boxes but overflowing total: task2 must reject second-page attempt.
4. Cover heading nested inside table: task3 excludes it from TOC but retains anchor/reference.
5. Section without source node (blank/empty cover): tasks1/2 preserve section identity without fake node IDs.

## Task 1 — Contract, preparation and composition

Files: Core src/template/{types,pageSections,validateTemplate,validateGraph,areas}.ts;
src/data/prepareGeneration.ts; src/composition/{resolvedDocument,composeDocument,
composeSections,validatePreparedInput,validateResolvedDocument}.ts;
tests/template/coverPages.test.ts, tests/composition/coverPages.test.ts and helper fixture.
Inspect binding consumers before editing: preserve existing props/section provenance.

Interfaces: TemplateSection model13 adds role?:'body'|'cover', source:{kind:'blank'}.
Model12 keeps its narrower accepted fields. Resolved section model13 requires normalized
role:'body'|'cover', sourceKind:'content'|'authored'|'blank', plus existing page/rootIds.
TextBlock props add heightMode?:'content'|'fixed', height?:Length,
verticalAlign?:'top'|'center'|'bottom'; validation enforces the discriminated constraints.
Existing prepareGeneration/composeDocument signatures stay unchanged.

- [ ] Write tests: accept model13 cover/blank; reject duplicate/misplaced cover,
  invalid source, wrong fixed location/units/height; model12 rejects new fields.
  Assert empty cover and blank compose with rootIds=[] but explicit sections; empty
  body alone still EMPTY_CONTENT; missing/wrong content and required data still fail.
  Assert Area origin cannot masquerade as a directly authored fixed TextBlock.
- [ ] Run `npm test -- tests/template/coverPages.test.ts tests/composition/coverPages.test.ts`;
  confirm failures are missing intended behavior, not broken fixture setup.
- [ ] Implement model gates and normalized section metadata, preserve sources/IDs and
  JSON round-trip. Do not add fabricated nodes to make empty-page commands pass.
  Review every `nodeModelVersion===12`/`!==12` consumer before changing it.
- [ ] Run build and the new tests plus template/pageSections, composition/pageSections,
  preparation/Area validation affected by changed gates; review diff then commit.

## Task 2 — Fixed boxes and one-page cover layout

Files: Core src/layout/documentFlow.ts; create src/layout/fixedTextBlock.ts;
src/layout/textFlow.ts and src/pdf/createPdfEngine.ts only for diagnostic propagation;
tests/layout/coverPages.test.ts, tests/pdf/createPdfEngine.test.ts.

Interface: fixedTextBlock.ts exports measureFixedTextBlock(node:TextBlock,
style:TextStyle, widthPt:number, runtime:TextRuntime):Promise<{
lines:MeasuredLine[];heightPt:number;offsetPt:number}>. Consumes validated fixed props.
It uses measureText once, reserves height, and returns offset for the same measured lines.
LayoutError may add optional sectionId/path context; existing calls remain valid.

- [ ] Write tests asserting following-node y is identical for 1-line/multiline/fitting
  title; excess fails; top/center/bottom offsets exact within existing epsilon1e-6.
  Test empty text with a small positive frame, explicit newline, mm/pt, existing
  content-height behavior, total cover overflow, table/image continuation rejection.
  Test empty cover/blank/body distinctions and exact previous-page boundary.
- [ ] Run `npm test -- tests/layout/coverPages.test.ts` and observe intended failures.
- [ ] Implement fixed measurement without changing wrap. A cover-internal nextPage
  attempt throws with actual failing node/section; entering a new section remains legal.
  Blank creates exactly one empty DrawPage. Reject before returning successful PDF;
  no partially successful document when any box or total cover overflows.
- [ ] Run build/new tests and existing pageSections/table/image layout tests affected
  by nextPage handling; confirm source diagnostics through engine and commit.

## Task 3 — Counted numbers, TOC and packed PDF

Files: Core src/pdf/drawContract.ts; create src/layout/pageCounting.ts;
src/layout/{documentFlow,pageNumbers,fillContentsNumbers}.ts;
src/composition/contents.ts; src/pdf/createPdfEngine.ts;
tests/layout/coverNumbers.test.ts; fixtures/cover-pages/{template,request}.json;
tests/consumer/checkCoverPages.mjs, scripts/checkPackedConsumer.mjs, Dockerfile.consumer.

Interfaces: DrawPage model13 adds pageRole:'body'|'cover'|'blank',
countedPageNumber:number|null. pageCounting exports
assignCountedPages(draw:DrawDocument):void; call after page creation before numbering.
Cover gets null; others consecutive1…N. Legacy absence falls back to physical index+1.
collectContents keeps its signature and excludes cover roots before traversal,
including descendant headings; anchor collection does not use that filter.

- [ ] Tests: cover/TOC/body display1 after cover, blank increments but has no ink,
  TOC numbers agree with footer, destinations use physical index, cover references
  work and cover headings (including in cells) are excluded; model12 unchanged.
- [ ] Run `npm test -- tests/layout/coverNumbers.test.ts`, confirm intended failures.
- [ ] Implement shared counted metadata and consumers. Build section indexes once
  where needed; avoid per-heading scans of every section. Do not introduce numbering options.
- [ ] Run build, new tests and existing contents/link/pageSections/PDF regressions.
  Add real Thai title short/long/overflow and blank fixtures with known expected page
  sequence and compare next-node positions, not merely page counts. Commit runtime
  candidate at0.1.10, run `npm run check:package` on Linux/amd64, retain artifact/hash/PDF.
  Request visual acceptance for cover/title placement/blank/TOC and reference behavior.

## Task 4 — Service integration and bounded delivery

Files: Service vendor/flowdoc-core-0.1.10.tgz and existing vendor metadata,
package.json/package-lock.json; src/templates/assembly.ts if model13 Area normalization
needs a gate update; examples/cover-pages-{template,request}.json;
tests/cover-pages-api.test.mjs and tests/page-sections-assembly.test.mjs.
Docs: Core guide/README, Service usage/README and Project Control existing R2/roadmap.
Interfaces: import only @flowdoc/core root; HTTP/DB shapes unchanged unless a concrete
storage failure requires returning to design. No speculative migration.

- [ ] Before changing production dependency, add model13 assembly/API tests and
  observe rejection with0.1.9. Import/save/publish/load must preserve fixed and blank
  metadata; renaming current leaves old snapshot unchanged. Cover Area deletion
  follows existing owned-row behavior. API contract exposes fields, not graph.
- [ ] Install the verified0.1.10 artifact, record checksum/source commit and update
  Service version. Make only proven integration repairs; no copied Core validation.
- [ ] Build and run `npm test -- tests/cover-pages-api.test.mjs tests/page-sections-api.test.mjs tests/page-sections-assembly.test.mjs`
  in the existing test container setup against a fresh isolated named DB, then affected
  current/version/Area/image/contents/link API regressions on that same fresh candidate.
  Test successful download plus a long real variable causing failed job with source
  diagnostic and no downloadable partial PDF. Preserve evidence outside disposable volume.
- [ ] Review final diff and acceptance coverage, obtain one whole-change code review,
  fix in-scope findings with targeted rechecks. Report old migration004 failure separately;
  never label a failing full suite PASS. Await required user PDF acceptance if pending.
- [ ] Commit/integrate verified development work only, reuse unchanged fast-forward
  proof, update roadmap with exact evidence and remaining scope. Archive outputs and
  remove clean merged temporary branches/worktrees/disposable DB. Leave release untouched.

## Completion boundary

R2 passes only with runtime, real packed consumer, Service integration and visual
acceptance. Planning complete does not check roadmap implementation boxes.
R3 header/footer details stay with the user; R4/R5 remain open beyond the minimal
numbering/TOC bridge here. Stop after covered acceptance; no performance redesign.
