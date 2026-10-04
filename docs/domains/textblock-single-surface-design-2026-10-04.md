# TextBlock single-surface design

## Authority Boundary

Owner: FlowDoc Project Control. This is a proposed cross-repository design
derived from the owner's approved discussion on 2026-10-04, including the
multi-node rendering constraint. It is not implementation Evidence, a passed
WYSIWYG gate, a DOCUMENT_MAP update, or permission to merge product main.
Written design approved by the owner in this conversation on 2026-10-04,
explicitly confirming the 300/900/1,800-character and 1/20/100-node matrices.
This approval authorizes implementation planning, not a claim of runtime PASS.
Historical cancelled execution stays closed.

## Context and scope

- Request: retain read-only nodes and one active editing node, with identical
  text presentation before, during and after editing.
- Mode: single-room discovery/design; execution, Phase and Checklist IDs N/A.
- Role: Planning Partner / Project Control Steward.
- Owners: Core for text semantics/geometry; Editor for input, rendering and
  draft lifecycle; existing Backend revision/commit path remains authoritative.
- Size: medium first slice; risk: bounded (draft loss and input correctness).
- Document budget: this design and subsequent implementation plan only.
- Proof budget: focused behavior tests, controlled browser comparisons and
  physical input acceptance. No additional audit or map promotion.
- Preserve user tabs, unsaved input and pre-existing local profiling files.
- Existing candidate roots: C:/Users/nekot/Documents/FlowDoc-dev/20261004/
  flowdoc-vnext-core, flowdoc-vnext-editor and flowdoc-vnext-backend.
- Reference bases inspected: Core a47cd4b, Editor c1814e3, Backend b6fe291.
  Recheck exact HEAD and working tree before implementation.

## ข้อกำหนดที่ตกลงกัน

1. TextBlock ใช้ผลจัดข้อความและตัววาดชุดเดียวทั้งขณะดูและขณะแก้
2. เปิด input, caret, selection และ composition เฉพาะ node ที่กำลังแก้
3. เปลี่ยน focus แล้วข้อความล่าสุดต้องยังอยู่ แม้ยังไม่ได้บันทึก
4. การพิมพ์ไม่ทำให้ node ที่ไม่เกี่ยวข้องจัดข้อความใหม่
5. เป้าหมายแรกคือ Paragraph ธรรมดา 1,800 ตัวอักษรต่อ TextBlock
   เป็นขนาดทดสอบ ไม่ใช่เพดานตัดข้อมูล และยังไม่ใช่คำรับรองประสิทธิภาพ
6. ทดสอบหลาย node ตั้งแต่เริ่ม ไม่รอเพิ่ม Columns จึงตรวจต้นทุน

## Rendering contract

TextBlockView consumes a frame identified by node ID, content revision, font
asset identity, style identity and content width. Focus, caret blink and node
selection are not text-layout invalidation keys. Zoom changes coordinate
transforms and raster resolution; do not change authored width accidentally.

Inactive and active modes use the same frame painter. Selection/caret are a
separate overlay. Selection borders must not change content width. Block height
comes from actual frame bounds; remove the textarea row estimate for this new
surface. A height change may reposition following blocks without reshaping them.

First bounded renderer decision is a comparison of glyph-outline Canvas and
batched SVG using identical Core frames and fonts. Avoid a DOM element per glyph.
Choose by correctness, paint/update cost and retained memory on the same corpus;
do not claim one backend is inherently faster. Extract reusable production
primitives through approved boundaries; never copy the lab/debug render loop.

## Input and Core contract

Editor converts pointer coordinates into node-local Core coordinates. Core owns
hit testing, caret positions, movement and selection geometry. Preserve Unicode
cluster boundaries; UTF-16 offsets are transport coordinates, not user-visible
character counts. Enter produces explicit line breaks in the same TextBlock.

Extend the product TextBlock bridge to expose retained edits, range replacement,
movement, hit testing, selection and composition. Keep inline identities and
atomic rejection. The lower product session already exposes relevant primitives;
this does not prove the TextBlock integration or cross-break edits are complete.

Use one focusable browser input host for the active node. It receives input/IME
but never independently paints the visible document. Anchor composition UI near
the Core caret. Do not hide the host with display:none or overwrite its value
during composition. Normalize input/beforeinput/composition/paste into one edit
sequence so a single insertion is never applied twice. Keydown handles commands,
not character synthesis. EditContext is optional future work, not a prerequisite.

Composition is provisional until committed once; cancellation restores its base.
Node switching waits for composition resolution, never silently discards it.
Define and test clipboard, undo/redo and accessible text/selection behavior before
calling the surface generally usable. Native input alone does not prove access.

## Draft and save contract

Separate one active editing session from per-node drafts. Display a draft when
present, otherwise the saved snapshot. Deactivation preserves draft and last
frame. A save response acknowledges only its submitted draft revision; newer
typing remains dirty and visible. On failure retain draft and expose retry.
On stale document revision retain draft and report conflict; do not silently
overwrite, drop or automatically merge it. Explicit Cancel discards only the
chosen draft. Backend writes keep the existing mutation/revision path.

Initial storage is in-memory; refresh/restart recovery is not promised. Pending
drafts must not be mistaken for saved data. Automatic save is not required for
the first slice. Maintain explicit save and visible unsaved/error status.

## Multi-node lifecycle

Keep editing resources only for the active node. Inactive visible nodes reuse
frames. Distant nodes can release paint resources while retaining document data
and measured dimensions; overscan prevents visible blanking near the viewport.
Pin active/composing nodes so viewport eviction cannot destroy an edit.

Cache keys include font/content/style/width identities. Eviction may discard
derived frames, never drafts. Bound cache by measured resource size and evict
inactive least-recently-used entries first. The first implementation plan must
choose a concrete cache budget from the renderer probe, not an arbitrary unlimited
cache. Unknown initial heights need a stable placeholder and scroll anchoring;
test reveal and remeasure behavior rather than assuming offscreen layout is free.

## Delivery sequence and acceptance

1. Renderer/lifecycle probe: same Core corpus on both painters; compare focus
   parity, resource growth, paint counts and offscreen behavior. Return concrete
   renderer and cache-budget decisions before implementing the full surface.
2. Core bridge: retained editing and identity-preserving cross-break operations;
   caret/selection and composition use the same frame revision. Rejected edits
   leave node and frame unchanged; disposal releases sessions.
3. Single-node surface: click-to-caret, typing, deletion, Enter, range replacement
   and focus transitions on the same painter. Keep unsupported styled/atomic
   nodes explicitly unavailable without flattening their data.
4. Draft/save lifecycle: A -> B -> A, failed save, late acknowledgement after
   more typing, revision conflict and explicit Cancel retain correct content.
5. Input acceptance: real Thai input, composition commit/cancel, paste, held keys,
   undo/redo and keyboard accessibility. No general readiness claim before these.
6. Controlled scaling: 300/900/1,800-character corpora at beginning/middle/end;
   1/20/100-node documents with matched viewport and active content. Record
   event-to-frame timing, long tasks, shapes/paints and memory after repeated
   scrolling. Editing A must produce zero new shaping calls for unchanged B.
   Compare equal workloads with diagnostics off. rAF alone is not screen-paint
   evidence; include physical user observation. Numeric timing acceptance is
   chosen with the target machine baseline before optimization, not retrospectively.
7. Columns follows only after the standalone slice passes: reuse the same view
   and session contract with parent-supplied width/position, not a second editor.

## Risks and exclusions

Blocking design-to-code decisions: painter selection/cache budget, bounded
WYSIWYG entry scope, input event ownership, retained bridge identity mapping.
Resolve these within the first implementation planning/probe scope.
Deferred: styled rich text, atomic inline editing, table, pagination, resizing,
PDF parity, durable draft recovery and 3,600-character admission.
Thai word-break policy changes remain deferred by owner; single-surface parity
does not itself improve the chosen Core line-break policy.

The existing Editor WYSIWYG gate must be reconciled explicitly for this bounded
Paragraph entry; approval of this design is not evidence that all historical
prerequisites passed. Preserve all broader readiness limitations.

## Inspected implementation references

- Core: src/authoring/textBlockProductBridgeV1.ts
- Core: packages/text-engine-rust-wasm/src/productSessionV1.ts
- Editor: src/components/paper/PaperTextBlockEditor.tsx
- Editor: src/components/paper/PaperBlock.tsx
- Editor: src/editor/draft/activeTextBlockIsland.ts
- Editor: src/app/useActiveTextBlockEditing.ts
- Editor: src/editor/draft/textBlockGeometrySession.ts (diagnostic only)

No product behavior or readiness is changed by this document.

## Implementation slice: retained replacement prerequisite (2026-10-04)

Owner authorized continuing after renderer probe. Inline Product Implementation
role; Core owner; execution IDs N/A. Bounded scope: prepare/commit/discard a
retained single-paragraph replacement, then adopt it in TextBlock.replace only
after full node validation. Existing apply remains immediate and compatible.
Enter/join/resize and browser input remain unchanged for this slice.

Acceptance: preparing/discarding never changes current frame/history; a stale,
already-closed or disposed transaction cannot commit; disposal releases pending
WASM candidates; repeated TextBlock replacements do not call runtime.create and
retain unaffected line frame identities; rejected edits keep node and frame.
Proof: real product-WASM tests, existing bridge/session suites, Core type-check
and Editor consumers. No physical typing or 1,800-character admission claim.

Sequence: failing transaction/bridge tests -> retained transaction implementation
-> atomic bridge adoption -> focused verification and commit -> record result.
Reason for scoped first step: directly mutating the retained session before
TextBlock schema validation would remove the existing rollback safety.

### Result and evidence

PASS for this prerequisite only. Core commit `c20d592` on
`codex/product-frame-shape-reuse-20261004` adds prepared retained replacements
and adopts them only after TextBlock validation. Immediate `apply` uses the same
prepare/commit path. Discard, stale revision, repeated commit and parent disposal
are covered; rejected node validation preserves the published node and frame.
Repeated replacements reuse the existing line session and preserve the frame
identity of unaffected lines. Structural operations still rebuild candidates.

Verification against the unchanged product WASM:

- Core: 48 tests passed across productSessionV1, textBlockProductBridgeV1,
  productWidthV1, productFrameReuse, productTimingV1 and
  productEditorIntegrationSmoke. Session and bridge tests assert zero remaining
  live WASM sessions and retained inverse pairs after cleanup.
- Editor consumers: 21 tests passed across textBlockGeometryBinding,
  coreEditingTrial and the three textBlockRenderProbe suites.
- Core and Editor type-checks passed; Core diff whitespace check passed.

The earlier type-check failure in candidate break access was corrected before
the final passing checks. No Editor UI, Backend, Rust or WASM binary changed;
no product main merge or push. Existing local profiling files were preserved.
This does not establish browser typing speed, long-term process memory, or
1,800-character acceptance. The next bounded step is bridge caret/selection
and composition support before connecting the single-surface Editor.

## Implementation slice: bridge geometry queries (2026-10-04)

Owner requested continuing the implementation and parking further cost analysis.
Inline Product Implementation, Core owner, execution IDs N/A. Bounded scope:
read-only caret, hit testing, movement and selection queries on existing retained
frames. Composition remains the next slice; no browser input or draft mutation
was added here. Existing isolated Core branch and local files were preserved.

PASS for this geometry prerequisite: Core commit `229b249`. Implementation is
in `src/authoring/textBlockGeometryV1.ts`, exposed by the existing bridge and
verified by `tests/textBlockProductBridgeV1.test.ts`.

- Every new query requires the current bridge revision and rejects disposed
  bridges. Core caret validation preserves shaping-cluster boundaries.
- Position lineIndex identifies an explicit-break segment; geometry lineIndex
  identifies a wrapped visual line inside that segment's frame. Coordinates and
  page indexes stay frame-local, including frame margins; they are not yet a
  unified node-local layout. The painter must apply the same placement transform
  to glyphs, pointer input and overlays.
- Movement traverses explicit breaks and empty lines, while wrapped-line
  movement delegates to Core. Up/down crossing chooses the closest x coordinate
  on the adjacent segment's boundary visual line. Persistent preferred-column
  behavior across multiple key presses is not provided by this stateless API.
- Selection returns per-frame rectangles and explicit following-break flags,
  preserving anchor/focus direction. Break markers have no invented glyph width.
- Queries consume existing frames; they do not publish edits or create sessions.

Proof: four new tests initially failed because the query API was absent. Final
Core bridge/session/integration suites passed 41 tests, including wrapped-line,
empty-line, cross-break, reverse-selection, stale-revision and disposal cases.
Editor geometry binding and editing trial suites passed 10 tests. Core and
Editor type-checks and Core diff whitespace check passed.

Remaining: composition lifecycle and atomic rejection, cross-break replacement,
single-surface browser placement/input, drafts and physical input acceptance.
No UI parity, typing performance, 1,800-character admission or product-main
readiness claim is made. No Backend, Editor source, Rust or WASM binary changed;
no product main merge or push and no map promotion.

## Implementation slice: bridge composition lifecycle (2026-10-04)

Owner authorized continuing composition after geometry. Inline Product
Implementation, Core owner, execution IDs N/A. Scope is one explicit-break
segment in one plain TextBlock: begin, provisional update, commit, cancel and
disposal. Browser event normalization, cross-break replacement and Backend
publication remain outside this slice. Existing design is the work authority;
this section records bounded acceptance against durable code/tests, not a map
or general WYSIWYG readiness promotion.

PASS for this prerequisite: Core commit `a5c2af7` changes productSessionV1,
textBlockProductBridgeV1 and their tests. Product session exposes a prepared
composition update; immediate update remains compatible via prepare/commit.
Bridge validates the candidate node before publishing the provisional frame.
Every update uses the original composition range and inline owners, not the
previous provisional text. Cancel restores exact original inline children;
commit records one changed-text history entry, or none for unchanged text.

The bridge read result now includes composition `{id, lineIndex}` or null.
While active, its textBlock and frames are provisional; consumers must resolve
composition before treating that snapshot as committed input for persistence.
Queries use the current provisional frame and bridge revision. Ordinary replace,
Enter, join, resize and a second begin are blocked while composition is active.
Newlines in composition updates remain unsupported; explicit breaks require the
separate structural path. Reversed start/end ranges are rejected at begin.

Verification: new lifecycle tests first failed on the absent methods. Final
Core product session, TextBlock bridge, integration smoke, frame reuse and timing
suites passed 54 tests. Coverage includes repeated Thai provisional updates,
commit once, cancel/ID restoration, empty composition, stale/invalid commands,
malformed projection rejection with successful retry and active disposal.
Real product-WASM cleanup assertions report no live sessions or inverse pairs
after each session/bridge test. Editor geometry binding and editing trial suites
passed 10 tests; Core and Editor type-checks and Core diff check passed.

Existing local profiling files and user browser state were preserved. No Editor
source, Backend, Rust or WASM binary changes; no product main merge or push.
This does not prove physical IME behavior, event deduplication, composition UI
placement, typing speed or long-term memory. Next work is identity-preserving
cross-break replacement, then the bounded single-surface Editor integration.

## Browser connection trial (2026-10-04)

Owner requested connecting the browser before further work, and explicitly
requested click-out to retain/display the draft without a confirmation button.
Inline Product Implementation; Editor owner, Core adapter consumer; execution
IDs N/A. Scoped entry is a local development trial, not reopening the broad
WYSIWYG gate or claiming its historical prerequisites. Implementation keeps the
existing document route and its unsaved input untouched. No product main merge.

Editor commit `d108ba4` adds `text-block-surface.local.html` and
`src/editor/textBlockSurface/{input,session,trial}.ts[x]` plus styles/tests.
URL: `http://127.0.0.1:4017/text-block-surface.local.html`.
Two seeded plain TextBlock nodes use the actual retained Core bridge. The native
textarea is the input/IME host only; the visible text uses the same batched SVG
outline primitive in active and inactive states. Frame-local coordinates are
stacked consistently for paint, pointer hit testing and overlays. Inactive nodes
retain their draft/frame and release the editing session; blur does not reshape.
Click-out requires no confirmation. There is no Backend save on this page, and
reload loses these trial drafts. This is not yet integration into the document
route or its persistence/draft-conflict lifecycle.

Input handles same-segment replacements, a single Enter, deletion of an explicit
break, cluster-safe diff boundaries and composition begin/update/end. Duplicate
composition payloads and unchanged subsequent input do not reapply text.
Composition counters expose whether browser composition events occurred. Empty
compositionend payload currently means cancel; physical platform behavior must
validate this bounded policy. Node switching waits while composition is active.
Unsupported multi-line paste/range replacement is rejected with an explanation.
Full pointer-drag selection, accessibility, undo/redo, variable widths and large
node counts are not accepted by this trial.

Automated evidence: 6 tests passed across input diff, actual-WASM surface session
and shared SVG painter suites. Editor type-check and normal application build
passed (existing large-chunk warning); the standalone development HTML is not a
production bundle entry. Staged diff check passed after whitespace cleanup.
Browser smoke via the in-app browser verified Thai text, Enter, Backspace joining,
A -> B -> A draft retention and click-out without confirmation. SVG path strings
for the tested text were identical before and after blur. Those interactions
generated zero composition events; physical IME acceptance is still pending,
not inferred from synthetic input or unit tests.

Screenshot: `C:/Users/nekot/Documents/FlowDoc-dev/20261004/profiling/textblock-surface-trial.png`.
Result: PASS for bounded connection/smoke, UNKNOWN for physical composition and
full document-route readiness. Next: owner physical input observations, resolve
any event-order failures, then cross-break editing and the actual document
draft/save integration. No DOCUMENT_MAP or global WYSIWYG promotion.

### Owner observation and composition adapter checks

Owner reported A/B typing behaved alike and completed the requested switching
exercise. Read-only browser inspection showed both nodes in display mode with
the owner's Thai text retained; both composition counters remained zero. This
supports the observed ordinary-input trial only, not physical IME acceptance.

At the owner's request to continue checking, Editor test-only commit `0cb91e1`
extends the actual-WASM surface-session tests with finalization without an
intermediate update, a changed final payload, rejection/recovery/cancel, duplicate
end notifications and committed-draft teardown/reopening independently of node B.
The input/session suites passed 8 tests and Editor type-check/diff check passed.
No runtime files, browser input or user drafts changed in this check.

These are controlled adapter calls, not dispatched DOM events or physical IME
events. Actual browser ordering, focus switching during composition and the
empty-end-as-cancel policy remain unverified. Do not ask the owner to repeat
ordinary Thai typing as proof of those paths. Cross-break replacement remains
the next implementation prerequisite for the real document surface.

### Cross-break replacement connection (2026-10-04)

Owner approved implementing range replacement, multiline paste and Enter over a
selection now. Inline Product Implementation, Core semantics / Editor adapter,
execution IDs N/A. Core `51e7477` adds atomic replaceRange: Core-valid endpoints,
ordered ranges, fresh affected-line candidates and whole-node validation before
publication. Unaffected line sessions, surviving inline IDs and external breaks
are retained; splitting one inline allocates a new ID for its second fragment.
Inserted text/breaks receive fresh IDs. Structural edits rebuild affected lines;
this does not promise retained per-line history across structural replacement.
Single-line typing still uses the retained replace path. Composition-active
structural replacement remains blocked by the existing command boundary.

Editor `fbb0c26` connects the new operation in the local surface session. Core
bridge/integration suites passed 24 tests; Editor input/session suites passed
8 tests. Both type-checks and diff checks passed. New tests first failed on the
missing range API/old adapter rejection. Coverage includes cross-break
replacement, same-inline splitting, empty lines, complete deletion, unchanged
tail-frame identity and atomic rejection after unsupported shaping.

In a separate browser test tab: pasted ABC/DEF/GHI on three lines, selected from
offset 1 with Shift+Down and typed X, yielding AXEF/GHI. Enter over the next
cross-line selection yielded A/HI with collapsed native selection at UTF-16
offset 2 (start of the second line). Select-all and Backspace cleared the node.
This is browser automation evidence, not a physical held-key/IME performance
claim. Mouse dragging remains unimplemented and is explicitly stated in the UI.

Before HMR, saved the owner's two visible drafts to
`C:/Users/nekot/Documents/FlowDoc-dev/20261004/profiling/before-range-user-drafts.json`.
HMR reset the trial; restored both via its input path and verified exact visible
text equality to the backup. Screenshot:
`C:/Users/nekot/Documents/FlowDoc-dev/20261004/profiling/textblock-range-ready.png`.
No Backend, original document-route, main merge, physical IME or global WYSIWYG
acceptance changes. Next bounded interaction gap is pointer-drag selection.

### Pointer selection trial (2026-10-04)

Owner authorized the proposed mouse selection slice. Inline Editor implementation,
execution IDs N/A; Core geometry is unchanged. Editor commit `1ce804a` introduces
a pointer gesture helper and connects capture/move/up/cancel to the existing Core
hit-test and native textarea selection. Anchor/focus direction survives reversed
dragging, and activation can resolve a gesture begun on an inactive node. Text
layout and the visible painter remain the same. Composition-active pointer starts
do not initiate a selection gesture. No auto-scroll, touch or physical IME claim.

Verification: pointer helper, input diff and actual-WASM surface session suites
passed 10 tests; type-check and staged diff check passed. Helper tests cover
anchor reversal, deferred activation, pointer identity and cancellation.
In a separate browser tab, dragging across ABC/DEF/GHI selected offsets 1..10
(`BC\nDEF\nGH`); clipboard text matched exactly. Reverse dragging preserved
offsets with backward direction, and typing yielded `AแทนI`. Starting the same
drag from an inactive node and pressing Backspace yielded `AI`.
Screenshot: `C:/Users/nekot/Documents/FlowDoc-dev/20261004/profiling/textblock-drag-selection.png`.

HMR reset the owner's test tab; restored both texts from
`C:/Users/nekot/Documents/FlowDoc-dev/20261004/profiling/before-drag-user-drafts.json`
and verified exact equality. Kept that tab open. No original document-route,
Backend, Core source or product-main changes. PASS is limited to the bounded
mouse interaction and stated checks; actual IME and document persistence remain
pending as previously recorded.

### Article paste slowdown: bounded diagnosis (2026-10-04)

Owner reported a long freeze after pasting an article and typing. Inline
discovery, execution IDs N/A; Editor surface and Core frame cost are the bounded
owners under this existing record. No runtime fix or readiness promotion in this
step. Acceptance here is preservation of the actual draft and measured stage
costs; explaining the complete browser freeze remains unresolved.

Read-only inspection found the page responsive again, both nodes inactive, no
returned warning/error console entries, and composition counters zero. Preserved
both exact visible drafts locally at
`C:/Users/nekot/Documents/FlowDoc-dev/20261004/profiling/article-hang-drafts.json`.
The article in A contains 3,118 UTF-16 units / 2,592 grapheme clusters and one
explicit line. These units are not interchangeable with the 1,800-grapheme
milestone; that milestone is not an input limit. User text is not committed.

At Editor `1ce804a` / Core `51e7477`, local diagnostic
`src/tests/articleCost.local.test.ts` uses the actual WASM, font, surface session
and SVG builder with prefixes of the saved draft. It measures session creation,
six sequential single-character appends, read and SVG preparation separately.
Subsequent append results are checked for exact text equality. Vitest passed
one diagnostic test; this is CPU profiling in Node, not physical browser input
or browser paint timing. Measurements are local observations, not a statistical
benchmark or performance acceptance. The test remains an untracked local probe.

Latest local numeric output:
`C:/Users/nekot/Documents/FlowDoc-dev/20261004/profiling/article-hang-cost.json`.
The 3,118-unit case takes 153.5–166.7 ms per edit and 51.3–61.1 ms to build SVG
paths, totaling 209.5–218.0 ms per append across six calls. The first resulting
SVG path data contains 4,935,602 characters. A separate bridge read is under
0.04 ms in all three prefix cases. At 1,800 UTF-16 units (1,474 graphemes), edits
take 84.0–92.5 ms and SVG preparation 28.7–35.9 ms. The short run does not show
progressive cost growth; it does show substantial repeated work after warmup.

Core stage totals for all six full-draft edits: Rust edit roundtrip 253.9 ms,
frame build 675.6 ms; frame layout 432.4 ms and fingerprint 222.1 ms are nested
within frame build, not additional totals. Inspection of `trial.tsx` and
`svgPainter.ts` confirms that snapshot changes rebuild outline paths across all
frames, while the affected explicit-line Core session rebuilds its frame. These
are measured contributors, not proof of a specific browser event backlog or
the entire reported long stall. React, SVG parsing/paint, native event ordering,
GC and sustained input were not measured here.

Next bounded diagnosis: measure the browser input-to-frame path on a separate
trial using the preserved corpus, including paint preparation and selection
geometry, before choosing an incremental-frame/painter repair. Preserve the
owner's live drafts and the single display/edit geometry contract. Do not mask
the issue by truncating text or claiming the prior interaction tests established
long-text typing performance. Product code, user tab contents and main branches
remain unchanged in this diagnosis.
