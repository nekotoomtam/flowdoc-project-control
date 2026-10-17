# FlowDoc — Array-driven cell content implementation plan

> For agentic workers: after owner review, execute sequentially inline using
> executing-plans. Do not dispatch a new WORK room or reopen a closed execution.

**Goal:** ผู้สร้างเลือกชุด TextBlock/Image ในเซลล์หนึ่งครั้ง ผู้เรียกส่ง array
แล้วได้ชุดเนื้อหาตามลำดับจริง พร้อม PDF ที่ไม่มีชุดต้นแบบหลงเหลือหรือเนื้อหาซ้ำ

**Architecture:** เพิ่ม cell repeat declaration ในแม่แบบ model 10 และผูกภาพจาก
item scope; ขยายรายการก่อน layout เป็นลูก TextBlock/Image ปกติ ใช้ paginator
0.1.6 ต่อ Service ขยายการยอมรับ image child ของ array แล้วใช้ upload/job เดิม

**Tech Stack:** TypeScript/Vitest, Core PDF runtime, Service/PostgreSQL/Sharp เดิม

**Spec:** [พาร์ต 5: array ทำซ้ำชุดลูกในเซลล์](flowdoc-export-node-structure-draft-2026-10-09.md#ช่วงถัดไป-array-ทำซ้ำชุดลูกในเซลล์)

## Authority Boundary / kickoff

Owner: Project Control; product owners: flowdoc-core and flowdoc-service.
Role: Planning Partner. Status: implementation authorized; technical checks passed, final review and owner visual acceptance pending;
Written design and plan approved in this conversation on 2026-10-09.
Single-room inline; Work/Phase/Checklist IDs N/A. Work Size medium, Risk routine.
Base Core `4546a1899bcdf2defe2a0c9976cdf90250c309d1` (`codex/template-binding`),
Service `eb41b697085a66a7123313572024285436e0acde` (`codex/template-registry`), both0.1.6.
Recheck clean state/base before implementation; use isolated current-slice lanes.

PLAN model policy: gpt-6-astra/medium; this document does not claim to change this
chat's model. WORK decision: inline implementer with bounded tasks; resolve actual
host model availability at implementation kickoff, independently of PLAN. Current
host tool metadata lists gpt-6-astra and gpt-6.1-sol with medium support; do not
invent a model switch or another room to satisfy a label. Return route: this chat.

Document budget: this plan, approval/link in existing spec, and final status in
existing handoff. No task reports, new map records or synthetic execution registry.
Proof budget: focused RED/GREEN per task; final Core suite/build/package Linux proof;
Service impacted real-DB/container checks; one PDF sample and owner visual review;
one final review per executing-plans, reuse unchanged proof after fast-forward.
New proof only for changed candidate, failure, missing prerequisite or uncovered impact.

## Global constraints

- Only fixed TextBlock/Image sequences in cells; one declaration per cell, multiple
  cells allowed. No cell repeat inside row repeat or table header; no nested arrays,
  arbitrary objects, area, Columns, nested tables, frontend or DOCX.
- New fields gated at nodeModelVersion10; old4–9 acceptance/rejection unchanged.
  schemaVersion stays1; existing row `repeats` wire shape remains unchanged.
- `Format.cellRepeats?: CellRepeat[]`; omitted or [] means no cell repetition.
  `CellRepeat={id:string,cellId:string,childTemplateIds:string[],source:{scope:'global'|'local',key:string}}`.
  IDs are nonempty authored IDs without `~`; repeat IDs unique within their Format.
- childTemplateIds is a nonempty contiguous ordered range of direct TextBlock/Image
  children of the named cell, no duplicates; replace that range in place, never append
  clones while retaining original prototypes. Keep static children before/after once.
- Model10 array item schemas have at least one field, types string/link/image only.
  Image source may use item only inside a validated repeat scope; no implicit fallback.
  Existing row repeats may bind image items in model10; no nested repeat context.
- [] expands to no repeated nodes; preserve cell/row/padding/static content. Missing
  required rejects before default; optional absent uses validated default or [].
  Type/required errors reject request with indexed paths; unknown keys keep existing
  ignore/warning rules. Image preparation failures retain existing warning/frame policy.
- API callers send ordinary data and finalized upload resource IDs, not raw graphs.
  No new media intake, limits, master type or DB migration planned.
- IDs/sourceMap preserve source identity without mutating inputs. New repeat identity
  includes contentIndex/repeatId/itemIndex/sourceId; reorder is not stable item identity.
- Text lines/image frames/allowBreak/oversize/padding follow0.1.6. No group gap,
  container, keep-with-caption rule, or layout geometry stored in the template.
- Keep release0.1.5 unchanged. Candidate delivery proposed0.1.7 only when usable and
  verified; software version != model10 != published template version. Never replace
  an existing artifact with new bytes under the same filename/version.

## Review focus

1. Wrong cell/range/header or row-repeat ancestry introduces ambiguous item scope — Task1.
2. [] removes static content or prototypes survive; IDs collide across cells/content — Task2.
3. Same key in global/local/item picks wrong value; invalid/default item image escapes — Tasks1–2.
4. New model accidentally disables links/TOC or loses sourceMap on persisted input — Tasks2–3.
5. Service rejects child images or current edits leak into published versions/resources — Task3.

## Task 1 — Validate model10, item images and cell repeat ownership

**Files (Core):** modify `src/template/types.ts`, `validateSchemas.ts`,
`validateTemplate.ts`, `validateGraph.ts`, `src/composition/resolvedDocument.ts`,
`validateResolvedDocument.ts`, `composeDocument.ts`, `src/index.ts`.
New `tests/template/cellRepeats.test.ts`, shared fixture `tests/helpers/cellRepeats.ts`.
Reuse `src/data/validateValues.ts`; change it only if an explicit new test exposes a gap.

**Interfaces:** export CellRepeat from package root and optional Format.cellRepeats;
ArrayField.items includes ImageField, image source adds item. PreparedItem already
supports resource IDs as strings, so do not broaden it to arbitrary objects.
GraphContext gains `cellRepeats?:CellRepeat[]` and `itemImages?:boolean`; wire these
only for model10. Extend validateSchemas with a trailing optional itemImages=false
flag; thread it recursively and require nonempty item fields only for this flag.
SourceEntry gains optional repeatId (model10 only; requires valid itemIndex).
These are declarations/validation, not a promise Task1 alone can compose new repeats.

- [x] RED tests: accept model10 local/global array with image+caption and valid range;
  reject empty item schema, nested array/object, image item/source in models4–9,
  cellRepeats even [] in models4–9, duplicate/invalid repeat ID and duplicate cell.
- [x] RED ownership cases: empty/reversed/noncontiguous/duplicate child range,
  wrong-parent/missing/non-content child, missing/non-array source; cell under row
  repeat or header rejects. Item reference outside the range rejects; static siblings
  cannot see item scope. Same named global/local/item fields remain distinct.
- [x] Add model10 gates and carry features forward with >= gates. Validate repeat
  ancestry from graph relationships, not node naming. Validate item image source
  using the resolved traversal scope like text bindings, before composition.
- [x] RED/GREEN value cases via validateTemplate→prepareGeneration: []/one/many,
  required overrides default, valid/invalid defaults, null/type mismatch and missing
  photo return exact item paths; unknown item key warns. Preserve old empty schema
  behavior for old models rather than applying the new rule retroactively.
- [x] SourceMap validation rejects repeatId on old models and repeatId without
  itemIndex; supports JSON round-trip of valid model10 resolved metadata.
- [x] Run `npm test -- tests/template tests/data tests/composition tests/binding`
  and `npm run build`; inspect diff and commit after PASS. Existing tests plus new
  rejection cases prove old model contract, not an unsupported global compatibility claim.

## Task 2 — Expand cell ranges and preserve source mapping

**Files (Core):** modify `src/binding/expandRows.ts`, `bindInlines.ts` as needed;
`src/composition/composeDocument.ts` only for necessary wiring. New
`tests/binding/cellRepeats.test.ts`, `tests/layout/cellRepeatFlow.test.ts`.
Reuse Task1 fixture and existing `src/layout/cellTableFlow.ts` unchanged unless a
reproducible new failure requires a narrowly justified repair.

**Interfaces:** keep expandRows signature and return type unchanged. Build maps once
per format expansion: row declarations by row ID, cell declarations by cell ID.
Internal clone context carries item/itemIndex and optional repeatId. For new cell
instances use ID prefix `content-{contentIndex}~repeat-{repeatId}~`, then source ID
and `~item-{index}`; source IDs/repeat IDs cannot contain ~. Preserve legacy IDs for
old row repeats and static nodes. bindInlines keeps its signature; feed the new
prefix and origin.repeatId so newline-expanded leaves get the same provenance.
Output remains existing ResolvedDocument nodes, with repeatId metadata only.

- [x] RED tests with static heading/photo/caption/footer: [] yields heading/footer;
  1 and3 items yield exactly2+2*n children in order. No template-only orphan nodes.
- [x] RED tests: two cells share array, two content instances share Format; all node
  and inline IDs unique, all emitted leaves carry correct sourceId/contentIndex/
  format/itemIndex/repeatId. Same request twice produces equivalent graph. Inputs
  and prepared snapshots unchanged; resource reuse does not share node IDs.
- [x] Implement range replacement when cloning a cell, binding global/local/item
  explicitly. Image source selects the named scope including item. Existing model10
  row image repeat works independently; never overwrite outer item silently.
- [x] Verify string/newline/link item binding, unique item-bound anchors and internal
  references. Duplicate authored anchor values still fail existing destination checks;
  do not rewrite external anchor semantics merely to avoid an error.
- [x] Persist prepared input to JSON and compose again; malformed image values and
  altered template fingerprint still reject. No new shortcut bypasses prepared validation.
- [x] Layout tests: ordinary/merged cells with repeated children and Thai text longer
  than a page; images remain whole, body instances appear once, static siblings retain
  order, zero/default padding and row allowBreak rules still hold. Header outside
  repeated body cell remains repeated normally; no template re-expansion per page.
- [x] Run `npm test -- tests/binding tests/composition tests/layout tests/template`
  and build; review diff and commit after PASS. Do not add benchmarks or caching here.

## Task 3 — Immutable versions, resource/API and packed PDF proof

**Files (Core):** new `tests/consumer/checkCellRepeats.mjs`; wire
`scripts/checkPackedConsumer.mjs` and `Dockerfile.consumer` to retain result/PDF.
**Files (Service):** modify `src/templates/assembly.ts`; new
`tests/cell-repeat-assembly.test.mjs`, `tests/cell-repeat-api.test.mjs`,
`scripts/checkCellRepeats.mjs`; package/lock/vendor manifest/artifact at delivery.
Reuse current/publish/load APIs, isolatedDatabase, cell-content API upload/job helpers.

**Interfaces:** existing decompose/assemble/checkRecord signatures unchanged.
Allow child variable type110004 only when record.payload.nodeModelVersion>=10;
retain string/link and same-schema/parent/cycle rules. Format payload carries
cellRepeats without a new table. Use published Core root exports, never source imports.

- [x] Core packed fixture: 0/1/many cases with static markers, Thai long captions,
  images of three distinct resources reused across items, ordinary and merged cells,
  two content instances, link/TOC to a heading after the table. Count output instances
  from sourceMap; do not guess page count. Preserve generated PDF/result for review.
- [x] Run final Core `npm test`, build, `npm run check:package`; Linux/amd64 consumer
  installed solely from tarball and without network at rendering. Test legacy package
  consumers already wired by the script; new model must preserve links/TOC/page numbers.
- [x] Pin unique candidate tarball/checksum in Service. RED assembly tests: image
  child round-trip with schema/parent IDs, reject old-model image child, cross-schema
  parent and nested array. Implement only the required parent type gate.
- [x] Real-DB tests: import model10→publish v1→load; modify current caption/default/
  repetition→publish v2; v1 keeps its own variables, references, cellRepeats and content.
  New version IDs and source document ref follow current behavior; do not alter migrations.
- [x] API tests finalize upload→submit data array→job→download PDF with actual images;
  verify repeated resource reuse and original_input unchanged. Invalid required/type
  item fails admission without creating a job; wrong-upload resource still rejects;
  corrupt image bytes retain IMAGE_UNUSABLE behavior. Empty array with only static
  text needs no image upload when no other image nodes remain.
- [x] New checkCellRepeats script follows checkCellContent isolation/cleanup pattern.
  Select cell-repeat-assembly, cell-repeat-api, assembly, current, version-render,
  cell-content-api, image-api, contents-api, link-api, processor, render suites with
  real DB. Docker build must pass and zero skipped tests; cleanup own project only.
- [x] Render all pages of the new PDF; verify text/image order, no prototypes/duplicates,
  continuation borders and destinations. Have owner review one sample. If package
  version only changes later and PDF is byte-identical, reuse visual review by SHA256.
- [x] On acceptance, version deliverable (proposed0.1.7), rebuild immutable package and
  refresh Service pin/proof for changed artifact. Commit then integrate development
  per owner authority; no release/push/tag implicitly. Preserve ignored evidence
  with checksum before removing only clean merged current-slice lanes/branches.

## Stop / escalation / closeout

Stop and propose an amended scope if DB migration, nested repeat context, node
container, changed layout rules, altered area policy or image resource budgets become
necessary. Missing one of these deferred features does not itself block this slice.
Do not silently make validation permissive to pass a fixture.

Completion evidence must cover model contract, expansion identity/order, old-model
regression, real PDF and versioned API/resource behavior; skipped checks are not PASS.
Record commits/artifact paths/checks/owner acceptance here and refresh existing
handoff. No DOCUMENT_MAP promotion without separately registered Evidence.

Status at plan handoff: plan reviewed and inline execution authorized. See ledger
below for current technical/owner acceptance; execution stays in this chat.

## Inline execution ledger

Owner authorized inline execution. Initial bases: Core4546a18; Service eb41b69.
Worktrees: ../flowdoc-core-cell-array and ../flowdoc-service-cell-array, codex/cell-array.
Task1 contract feeds Task2 clone scope; Task2 resolved graph feeds Task3 existing image jobs.
Ruling: use manual cross-repository worktrees because native tool targets Project Control.
Ruling: retain ledger here, not product-local scratch Markdown, per documentation authority.
WORK runs in current host session; no model switch claimed. Final fresh review uses host gpt-6-astra/medium.

Task 1 complete: observed 4 expected model10 RED failures, then 152/152 focused tests and build PASS. Contract includes model10 nonempty item schemas/image scope and cell range ownership; no expansion yet.
Task 2 complete: 7 binding failures observed RED then GREEN; 220/220 impacted tests and build PASS. Multiple cells/content instances, static siblings, empty lists and persisted input covered.
Ruling: protected-row test targets the ending row of a rowspan, matching existing geometry; protecting its starting row does not promise the spanning cell is indivisible. No pagination change.
Task 3 execution history: Service image-child assembly reproduced RED then 2/2 GREEN after bounded type gate. Core full suite 287/287 PASS. Packed fixture check corrected to inspect canonical hex-encoded PDF URI (existing serializer), not literal URL bytes; no runtime defect/change. Shared JSON fixture added in Core fixtures and Service examples to exercise the same authored envelope.
Ruling: fixture lineHeight18pt could not contain the new Thai sample (measured ascent14.4+descent3.984=18.384pt at font12). Set this new fixture to22pt, keeping runtime fit checks unchanged. Cost: fixture is not a proof of arbitrary authored line heights. Diagnostic stored in Core artifacts/diagnose-ink.mjs; actual runtime metrics observed in isolated Linux consumer.

Task 3 technical checks PASS: Core full287/287, build, packed Linux/amd64 consumer
(ef9d937, artifacts/1791537994245); Service35/35 real-DB/API tests, zero skipped,
build and vendor check (8851c1e, artifacts/1791538084761). Isolated Docker project
cleaned by script. No runtime pagination or DB migration change.
Three PDFs: empty1page, one1page, long5pages (5items/cell, two content instances,
10image placements, 3resources). All rendered pages inspected; 20 BEGIN/END markers
appear exactly once. Owner visual acceptance and independent review were pending at this candidate checkpoint;
both are completed in the closeout below. SourceMap proofs include node/inline identity, persisted prepared inputs,
explicit scopes, independent cell/row repeats and bad input; Service proves version
isolation, finalized resource claims, wrong-upload rejection, empty no-upload job,
bad-image warnings and unchanged original request.
Candidate tarball metadata0.1.6 is isolated and uniquely named
flowdoc-core-0.1.6-cell-array-candidate.tgz, SHA256
9b62ff4694146733a8921dc9c175451a1a4f9e5c8802c384bff7d10eb34b608f.
Do not deliver it as release0.1.6 or overwrite its existing artifact. Primary
branches remain0.1.6, release0.1.5; no new version, merge, push or tag yet.
Ruling: shared DB suites require running existing migrations before tests; isolated
checkCellRepeats does this explicitly so result does not depend on test file order.


## Development closeout — 0.1.7

PASS, 2026-10-09. Owner accepted the five-page PDF: “รูปแบบนี้ใช้ได้”.
Fresh independent review of Core4546a18..ef9d937 and Serviceeb41b69..8851c1e
returned PASS with no Critical, Important or Minor findings; no repairs required.
The documented row protection, line-height and image/caption limitations remain.

Final Core commit `203765599ee6e310b8c7553c1cebce4418c05c15` is integrated by
unchanged fast-forward into `codex/template-binding`. Service commit
`b908b374d55257936b54cedba0e71d41456438bb` is integrated by unchanged fast-forward
into `codex/template-registry`. Both package versions are0.1.7. No release, push
or tag; release remains0.1.5 in both repositories.

Coverage and durable local evidence:
- Core287/287 tests cover contract, expansion, scope/identity/provenance, prepared
  input and layout regressions. Runtime code unchanged after the passing suite.
- Rebuilt0.1.7 package/build and isolated Linux/amd64 packed consumers PASS:
  `flowdoc-core/artifacts/worktree-archive/flowdoc-core-cell-array/1791538416586/result.json`.
  Tarball SHA256 `b637ba643b6d361baa8a606fd55a47ac6df54cdec0917c3157e3160f7e04e248`.
- Final Service Docker/build/vendor and real-DB/API checks35/35, zero failed/skipped:
  `flowdoc-service/artifacts/worktree-archive/flowdoc-service-cell-array/1791538501618/result.json`.
  This covers immutable version clones, item images, finalized resources, warnings,
  empty data, admission validation and prior API consumers.
- Final five-page PDF is byte-identical to the owner-accepted candidate: SHA256
  `274f31e98e703305acbcb4e7ae3cd57cdad3d67a5e8330a71ebd6a9af622cf68`.
  `1791538416586/visual-review.json` records accepted visual-proof reuse; automated
  result's pending visual field is a generation-time observation, not final status.
- Evidence archived and every file hash verified:167 Core files and16 Service
  files, manifests at each archive root. Only clean merged current-slice worktrees
  and their `codex/cell-array` branches were removed. Isolated Docker cleanup passed.

Execution IDs N/A for this inline work. Existing plan/handoff updated, no map
promotion or new registry. Acceptance and impact coverage complete. Nested arrays,
area, Columns in cells, DOCX and new pagination policies remain outside this slice;
next work is an owner-selected remaining design part, not another tuning pass here.
