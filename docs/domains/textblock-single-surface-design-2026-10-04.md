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

### Owner interaction observations and browser cost baseline (2026-10-04)

Owner reports successful pointer selection across multiple lines, replacement,
select-all/delete/retype, multiline paste, Enter/Backspace split/join, and node
switching without layout jumps for short text. These are owner observations,
not physical IME evidence or long-text performance acceptance. Owner initially
deferred long-text repair, then explicitly authorized resuming that bounded
performance work before full document-route integration. The overall design
remains incomplete; retain IME and persistence limitations above.

Inline discovery continued with a separate local browser page copied from the
current surface, instrumenting Core edit, SVG preparation, selection geometry,
React layout-effect commit and the second rAF. The user tab was neither reloaded
nor edited. Latest drafts were separately backed up to
`C:/Users/nekot/Documents/FlowDoc-dev/20261004/profiling/before-browser-cost-drafts.json`
and exact equality was checked afterward. The copied instrumentation remains
untracked as Editor `src/editor/textBlockSurface/trialProfile.local.tsx` and
`text-block-profile.local.html`; it does not modify the delivered trial.

The saved 3,118-unit article was filled through the browser textarea, then six
characters were entered sequentially through browser automation. All six
appeared in the native value. Excluding initial paste, Core edits took
303.5–493.8 ms, SVG construction 84.2–102.1 ms, selection geometry about
3.1–4.2 ms, and input-handler start to DOM commit 430.7–634.7 ms. Second-rAF
elapsed times were 453.5–662.7 ms. DOM commit and rAF are not proof of presented
pixels; automated sequential typing does not reproduce physical key repeat or
measure pre-handler input queue delay. This establishes substantial synchronous
input-path cost, not complete attribution of the owner's original long freeze.

A prefix of exactly 1,800 grapheme clusters (2,167 UTF-16 units) was also tested
with three additional characters. Core edit durations were 247.1, 209.7 and
231.7 ms; input-to-commit durations were 408.1, 294.5 and 331.3 ms. The remaining
cost therefore also affects the agreed milestone, not just larger articles.
These are instrumented DEV observations with a small sample; no production
timing guarantee or physical-input acceptance is implied.

Numeric logs: `profiling/article-browser-before.json` and
`profiling/article-browser-1800-before.json`, relative to the local
`C:/Users/nekot/Documents/FlowDoc-dev/20261004/` directory. The latter includes
preceding samples: only its last three edit/commit pairs are the 1,800-grapheme
typing sample. Screenshot: `profiling/article-browser-cost.png`. Temporary
browser tab was closed. No runtime repair, product commit, main integration or
readiness promotion occurred. Next repair should address measured Core
frame/layout work first, with SVG reconstruction as a second measured contributor;
preserve exact shaping, wraps, selection, atomic edits and frame identity rules.

### First suspect: repeated UTF-16 prefix counting (2026-10-04)

Owner requested proceeding carefully one item at a time. This step is inline
Core discovery (execution IDs N/A), limited to offset conversion; no product
runtime edits, WASM replacement or browser reload. Inspection at Core `51e7477`
finds repeated `text[..byte].encode_utf16().count()` in product shaping per glyph
and product segmentation per break. The former revisits increasingly long
prefixes; with a number of positions proportional to text length, cumulative
scanning is quadratic. This is a concrete repeated-work finding, not yet an
attribution of the measured whole-edit browser latency.

A standalone optimized native Rust probe compares that expression with a
byte-boundary-to-UTF-16 table built in one pass. It checks exact mapping equality
at every scalar boundary for actual article prefixes of 300, 900, 1,800 and
3,118 Unicode scalars (equal UTF-16 counts for this corpus), plus Thai combining
marks, Latin combining marks, astral characters, CR/LF and the end boundary.
Invalid interior-byte entries retain a sentinel. All assertions passed.
This experiment does not expand supported shaping scripts.

Local source/results are `profiling/offset-profile.rs` and
`profiling/offset-profile-result.txt` under
`C:/Users/nekot/Documents/FlowDoc-dev/20261004/`. Each case repeats 1,000 times
with black-box inputs/outputs, including table allocation in the candidate.
Observed mean milliseconds for prefix scanning/table respectively: 300 scalars
0.0855/0.0008; 900 0.6023/0.0029; 1,800 2.6684/0.0677; 3,118 19.6333/0.0699.
Only one process/sample batch was run, native optimized execution rather than
WASM, using all scalar boundaries rather than actual glyph/break arrays. Do not
derive browser speedup percentages or a main-bottleneck claim from these numbers.

Result: repeated prefix work and candidate mapping equivalence are established
for the tested corpus. The production path remains unchanged. Next within this
same item: test equivalent actual shaping/segmentation outputs, integrate the
bounded mapping change if those checks pass, then compare the actual WASM edit
path with the same corpus before moving to fingerprint or SVG work. Full
long-text performance acceptance remains open.

### UTF-16 offset repair delivered (2026-10-04)

Owner authorized continuing this single item. Inline Core implementation,
execution IDs N/A, bounded to product shaping/segmentation offset conversion.
Core `bb12386` constructs a byte-boundary lookup once per call rather than
rescanning every prefix. It preserves the existing source limit, script policy,
layout algorithm and fingerprint contract. The temporary table uses linear
memory in input bytes and is released with the call; it is not a retained cache.
Rebuilt the product WASM and its digest pin together (new SHA-256
`eeec2a5e9610004ea17c8263f6707797cb5e802eea88114f8a9168aef399b3e4`).
No product-main merge or push.

Verification: new boundary test first failed to compile because the helper was
missing, then native product tests passed 9 tests. Existing shaping comparison
against the creator raw provider passed. Product-session and TextBlock bridge
WASM suites passed 47 tests; Editor surface input/session/pointer suites passed
10 tests. Core type-check and diff check passed. Candidate release build passed
with unused/dead-code warnings in shared Rust modules.

Local old/new WASM comparison (`profiling/offset-wasm-compare.mjs`) passed
36 shaping/segmentation result comparisons including stale revision rejection,
empty text, mixed Thai/Latin, combining marks and unsupported scripts. Ten
measured calls per operation followed two warmups, alternating build order.
At 1,800 graphemes, median shaping was 9.59 -> 4.52 ms and segmentation
24.05 -> 23.10 ms. At 2,592 graphemes, shaping was 17.14 -> 6.48 ms and
segmentation 36.49 -> 35.15 ms. These are Node WASM operation times, not browser
typing latency. Output: `profiling/offset-wasm-results.json`.

Local frame comparison (`tests/offsetFrames.local.test.ts`) passed at 1,800 and
2,592 graphemes before and after six appends. All frame fields outside diagnostic
`work` matched, including fingerprint, source, paint, wraps, carets and spans.
The first comparison exposed differences only in diagnostic canonical-encoding
and receipt-hash byte counters; these were excluded explicitly, not treated as
render differences. Local runtimes/probes remain untracked; original WASM is
retained under `profiling/offset-old-wasm` for reproducibility. Whole-edit timings
were noisy and do not establish a general speedup percentage.

After adoption, the separate instrumented browser page accepted the same
1,800-grapheme corpus and three appended characters. Core edit times were
180.7/235.4/203.5 ms and input-to-DOM-commit 283.7/333.7/295.4 ms (initial fill
excluded), versus prior 247.1/209.7/231.7 and 408.1/294.5/331.3 respectively.
Small sequential DEV samples overlap substantially; the end-to-end performance
target remains unmet. Logs: `profiling/offset-browser-1800-after.json`;
screenshot: `profiling/offset-browser-after.png`. All profiling paths here are
relative to `C:/Users/nekot/Documents/FlowDoc-dev/20261004/`.

Saved latest A/B drafts to `profiling/before-offset-fix-drafts.json` before
adoption. HMR reset the user trial; restored both through normal input and
verified exact equality. User tab retained; separate measurement tab closed.
PASS only for this offset repair and stated correctness coverage. Frame build,
fingerprint, SVG cost, physical IME, and document persistence remain open;
continue one measured contributor at a time rather than declaring the long
freeze fixed.

### Next contributor: frame and fingerprint breakdown (2026-10-04)

Owner authorized inspecting the next contributor, one item at a time. Inline
Core discovery at `bb12386`, execution IDs N/A; no runtime modification or browser
interaction in this step. Local probe `tests/frameStageCurrent.local.test.ts`
uses the current release WASM and saved article at 900/1,800/2,592 graphemes,
six sequential append edits per size. Existing stage instrumentation separates
layout, fingerprint, freeze and Rust edit. A second, separately timed canonical
serialization + actual WASM SHA-256 of each resulting frame verifies its digest
against the published fingerprint. All 18 digest comparisons passed (one Vitest
test). Local numeric evidence: `profiling/frame-stage-current.json` under
`C:/Users/nekot/Documents/FlowDoc-dev/20261004/`.

Median stage milliseconds for 900/1,800/2,592 graphemes respectively:
layout 21.59/41.67/58.26; fingerprint 13.08/24.29/36.84; freeze
0.41/0.85/1.23; complete frame build 36.20/68.49/96.65. These stages are nested;
do not sum frame build with its children. Independent reserialization medians
were 10.33/23.52/27.83 ms, with actual WASM hash 2.94/6.46/8.95 ms. Separate
calls and medians need not sum to the original fingerprint stage. This is Node
WASM profiling, not browser or physical-input timing, with six samples per size.

For the first append at 1,800 graphemes, frame identity serialization contains
966,384 UTF-16 units, 28 visual lines and 3,604 caret records. Layout invokes
shaping 56 times covering 6,479 UTF-16 input units and segmentation once. The
large serialization is geometry-rich frame identity, not the authored string
alone. Source projection is under 0.1 ms median in these cases; freeze is also
small. Raw Rust edit timings vary by size/path, so this breakdown does not prove
all Core work is linear or explain all of the user's original stall.

Finding: layout and fingerprint both remain substantial; serialization is a
larger measured fingerprint contributor than hashing. Next bounded experiment
should evaluate canonical serialization allocation/key traversal with exact
byte-for-byte output parity. Do not remove fingerprint, omit identity fields,
change hash semantics, or skip required line-final shaping to improve timings.
No fix, new performance acceptance, map promotion, main integration or user
retest request in this discovery step.

### Product frame canonical serialization repair (2026-10-04)

Owner authorized continuing the fingerprint item. Inline Core implementation,
execution IDs N/A, scope limited to product-session frame serialization. Added
`productFrameCanonicalV1.ts`: direct traversal avoids intermediate mapped arrays
and reuses escaped field-name strings within one invocation. It retains ordinal
key ordering, finite-number/string encoding and all identity fields. No data is
cached across invocations; generic canonical JSON and WASM/hash are unchanged.
The input contract is plain acyclic frame JSON, not arbitrary JS objects.

New tests first failed on the missing module, then verified nested geometry,
ordinal numeric-looking keys, escaping/lone surrogates, negative zero, numeric
extremes, unsupported values and mutation between calls. Actual release-WASM
frames for three corpora across three revisions match reference canonical bytes
and reference-derived fingerprints. Core serializer/session/bridge tests passed
50 tests, plus one local benchmark; Editor input/session/pointer tests passed
10 tests. Core type-check passed. Staged diff check found CRLF-related whitespace
in the newly written test; normalized that test before the final amended commit
and confirmed the staged check clean (no semantic code change).

The local benchmark alternates old/new order, discards two warmups and measures
ten calls per encoder on the same frame. Medians old/new at 900, 1,800 and 2,592
graphemes are 13.55/5.07, 24.72/8.82 and 30.54/12.32 ms respectively. Exact output
equality passed for each frame. Evidence: Core untracked
`tests/serializeCandidate.local.test.ts` and local
`C:/Users/nekot/Documents/FlowDoc-dev/20261004/profiling/serialize-candidate.json`.
These isolate serialization, not complete fingerprint or typing latency.

After adoption, the same separate instrumented browser trial at 1,800 graphemes
plus `xyz` reports Core edit 166.4/202.7/186.0 ms and input-to-DOM-commit
291.3/289.4/321.1 ms, excluding initial fill. These overlap the prior browser
samples; no clear end-to-end improvement or physical-input acceptance is claimed.
Logs/screenshot: `profiling/fingerprint-browser-after.json` and `.png`, relative
to the directory above. Native value retained all appended characters.

Saved the user's latest drafts to `profiling/before-fingerprint-drafts.json`;
HMR reset the trial, so restored A/B through ordinary input and verified exact
equality. Kept user tab open and closed the measurement tab. No SVG, layout,
Backend, persistence, main merge or push. This serialization item is complete
within the stated proof; long-text performance remains open, with layout and
SVG costs still pending.

### Product cluster-layout avoids unused word-break queries (2026-10-04)

Owner authorized the next bounded performance item. Inline Core discovery then
implementation, execution IDs N/A. Inspection found the current B cluster-fit
policy requests and validates ICU word-break offsets, but never uses those
offsets to choose a visual line end. Local actual-WASM provider timing at 1,800
graphemes measured total layout 44.45 ms, shape calls 18.96 ms and segmentation
23.30 ms (six samples, medians; components need not sum exactly). Valid endpoint-
only break facts gave identical lines for 18 saved-article cases at 900/1,800/
2,592 graphemes with appended characters. This was a diagnostic comparison,
not the shipped implementation.

Introduced a named `prepareClusterWrappedLinesV1` path with a shaping-only
provider contract and connected product-frame construction to it. The existing
`prepareSoftWrappedLinesV1` path still queries and validates break facts. Both
share the same actual line-end shaping, width/cluster/field-boundary validation,
pagination limits and cluster-fit choices. Product frame no longer depends on
segment-provider success: malformed/throwing segment providers remain rejected
by the legacy path but are irrelevant to the new shaping-only path. This is an
explicit narrowing of product layout's required inputs, not fake break data or
a change to Thai word-wrap policy. Rust authored-edit validation and segmentation
elsewhere remain intact; layout work counters now correctly report zero segment
calls. Full affected-text shaping still occurs.

Tests first failed on the absent cluster entry point, then Core product cluster,
frame reuse, session, bridge and canonical suites passed 58 tests. The existing
creator line-planning suite passed 5 tests; Editor input/session/pointer suites
passed 10. Core type-check and staged diff checks passed. Existing golden frame
fingerprints remain unchanged; no snapshot regeneration. Local actual-WASM
old/new layout comparison passed all 18 cases, and current-frame timing probe
passed 18 reference fingerprint comparisons (two diagnostic tests). Local probes
are untracked `tests/layoutProviderCost.local.test.ts` and
`tests/frameStageCurrent.local.test.ts`.

After adoption, median layout at 1,800 graphemes is 17.04 ms (earlier frame-stage
baseline 41.67 ms); frame build 39.00 ms. The separate browser trial using the
same 1,800-grapheme article plus `xyz` reports Core edits 111.2/98.9/87.1 ms and
input-handler-to-DOM-commit 217.1/185.4/176.7 ms, excluding initial fill. Prior
three browser samples were 291.3/289.4/321.1 ms. These are short sequential DEV
samples, not physical held-key input, paint presentation or a guaranteed speedup.
Long-text performance acceptance remains open.

Evidence under `C:/Users/nekot/Documents/FlowDoc-dev/20261004/profiling/`:
`layout-provider-cost.json`, `frame-stage-before-cluster.json`,
`frame-stage-current.json`, `cluster-layout-browser-after.json` and `.png`.
Saved latest drafts as `before-cluster-layout-drafts.json`; after HMR reset,
restored A/B via ordinary input and verified exact equality. User tab retained;
measurement tab closed. No Backend/persistence, WASM change, SVG repair, product
main merge/push or global readiness promotion. Next measured contributor is SVG
construction; Core full affected-text work is reduced but not eliminated.

### SVG command reuse in the single surface (2026-10-04)

Owner accepted later real-use tuning and authorized moving to SVG. Inline Editor
implementation, execution IDs N/A. Added a per-surface `svgFrameCache.ts`, keyed
by the complete paint command, page placement, transform and font identity.
An outline-provider change invalidates reuse. Only commands from the latest
successful build are retained; failed builds do not publish a partial cache.
Unchanged commands reuse exact path strings; changed/repositioned commands use
the original SVG builder. Color aggregation/order and glyph counts stay intact.
No persistent global glyph/path cache, Core geometry change or renderer switch.

The cache is bounded by the current surface content, not a fixed byte budget;
it adds retained path/key memory alongside the displayed paths. Multiple-node
memory tuning remains unverified. Commands whose source/position changes may
miss even if some glyphs look alike. Reflow affecting all commands can require
a complete rebuild. The renderer still joins color paths and publishes a whole
path attribute; browser parsing/painting is not made incremental by this change.

New tests first failed on the missing module, then checked exact cold output,
one-command rebuild on tail change, placement/provider invalidation, retired
entry removal, font rejection, empty-outline color ordering and multiple frames.
Editor cache/painter/input/session/pointer coverage totals 15 passing tests.
A local actual-WASM article probe compares exact ordered SVG path strings and
glyph counts for six append revisions each at 1,800 and 2,592 graphemes (12
comparisons passed). Its first comparator incorrectly depended on object property
insertion order; corrected it to compare the actual paths and glyph count.
No rendering difference was suppressed. Local benchmark:
`src/tests/svgCacheCost.local.test.ts` -> `profiling/svg-cache-cost.json`.
Median cold/cached preparation in that run: 110.27/7.51 ms at 1,800 and
162.71/9.81 ms at 2,592 graphemes. This is same-run Node preparation timing,
not a cross-run browser speedup claim.

In the separate instrumented browser trial, the same 1,800-grapheme corpus plus
`xyz` yielded SVG build 5.5/6.8/7.0 ms and input-to-DOM-commit
135.0/153.4/146.2 ms, excluding initial fill (which built SVG cold in 63.7 ms).
Core edits still took 101.5/110.7/107.0 ms. Prior three browser commit samples
were 217.1/185.4/176.7 ms. These short DEV automation samples do not prove
physical held-key smoothness, presented-pixel latency or all-edit performance.
Browser cross-line replacement selected offsets 1..5 in ABC/DEF/GHI, typed X,
and retained `AXEF\nGHI` after blur/reactivation.

Evidence under `C:/Users/nekot/Documents/FlowDoc-dev/20261004/profiling/`:
`svg-cache-cost.json`, `svg-cache-browser-after.json` and `.png`.
Saved live drafts as `before-svg-cache-drafts.json`; restored A/B after HMR and
verified exact equality. User tab retained; measurement tab closed. No product
main merge/push, Backend/persistence or Core changes. SVG preparation reuse is
bounded progress; long-text overall performance and multi-node memory remain
open. Original general-purpose probe painter is unchanged as the cold reference.

### Browser Core stage diagnosis after SVG reuse (2026-10-04)

Owner authorized measurement before selecting the next optimization. Inline
discovery, execution IDs N/A; Core 08d3005 / Editor 5776acd unchanged. Separate
local diagnostic entry `text-block-stages.local.html` uses a copy of the current
instrumented surface and subscribes to the existing public product timing hook.
No edits to imported runtime files or live user drafts were required.

Same saved article prefix (1,800 graphemes / 2,167 UTF-16 units), then append
`xyz` through browser input. Exact displayed text matched; no visible alerts.
Milliseconds for x / y / z, excluding initial fill:

| Stage | x | y | z |
| --- | ---: | ---: | ---: |
| Rust edit roundtrip | 13.0 | 4.1 | 3.6 |
| Frame layout | 80.2 | 39.5 | 43.9 |
| Frame fingerprint | 62.8 | 41.2 | 30.8 |
| Frame freeze | 1.9 | 2.7 | 2.0 |
| Frame build (includes the three frame stages above) | 153.3 | 91.9 | 79.0 |
| Core edit total | 175.0 | 103.6 | 89.9 |
| SVG preparation | 7.2 | 7.7 | 5.8 |
| Input handler to DOM commit | 213.5 | 138.5 | 124.5 |

Do not sum parent/child timings. Three DEV samples with synchronous diagnostic
logging are a stage-selection probe, not a regression verdict against earlier
runs, physical held-key proof, or presented-pixel latency. Layout and fingerprint
dominate this run; their relative ranking varies. Source projection was at most
0.7 ms. Whole-frame reconstruction remains a measured contributor.

Source inspection: `productFrameV1.ts` retains raw shape facts only within one
build. `layoutFactsV1.ts` shapes the whole text for boundaries, prepares per-inline
clusters, then reshapes candidate line ranges with their actual line ends. The
single-inline product case repeats cluster preparation despite raw-fact reuse.
Next bounded candidate: retain exact-input shape facts across adjacent edits,
scoped to the same font/provider and session, with bounded retirement. This can
reuse unchanged candidate line text; it does not justify copying a shaped prefix
across changed contextual text, skipping line-end shaping, or promising complete
incremental layout. Measure hit rate and cost before adopting; compare full frame
geometry/fingerprints against cold construction for append, middle replacement,
deletion and wrapping changes. Fingerprint cost remains a separate open target.

Local evidence: `profiling/core-browser-stages-after-svg.json` and `.png` under
`C:/Users/nekot/Documents/FlowDoc-dev/20261004/`. Diagnostic tab closed; existing
user tabs remain. No runtime change, main merge/push, map or readiness promotion.

### Bounded raw shape reuse across edits (2026-10-04)

Owner authorized the next bounded optimization. Inline Core implementation,
execution IDs N/A; routine risk, existing isolated development checkout. Scope:
exact-input raw shape reuse only; frame geometry, line-end shaping, fingerprint
contract, Rust/WASM and Editor behavior unchanged. Acceptance: cold frame parity
across editing/structural/composition cases, bounded retention and disposal,
reduced shaping calls, browser measurement. One existing record is the document
budget; targeted Core/Editor checks and the existing corpus are the proof budget.

`productShapeCacheV1.ts` retains immutable raw facts per product session. Keys
include the entire provider binding (font, provider revision, policy) and exact
requested text. Rust `product.rs::shape` uses the session font and request text;
it does not shape against surrounding stored paragraph text. Contextual prefixes
are never copied into changed requests. Existing per-build reuse and unchanged
paragraph layout reuse remain. Work counters count actual provider misses.

LRU retention is limited to 256 entries, 65,536 combined key/text UTF-16 units
and 32,768 glyph facts. Oversized requests are measured without retention; this
is not a text input cap. Disposal clears the cache. Failed measurements are not
stored. Valid raw facts from a subsequently rejected frame may remain as bounded
performance-only data; they cannot publish a frame or bypass edit validation.
These structural budgets are not a measured browser heap limit. Multiple active
sessions and many-node memory remain unverified.

Tests first failed because the cache module did not exist. New tests cover exact
text/provider isolation, frozen facts, entry/volume eviction, oversized bypass,
clear and failed measurement retry. Actual-WASM frame comparison covers append,
middle replacement, deletion, growth and shrink/reflow; existing checks cover
split/join, IME cancellation, blocked edits and golden fingerprints. All 74
targeted Core tests pass after correcting an old width-test expectation from
one segmentation call to zero (cluster-fit removal predates this change).
Core type-check passed; Editor surface/session/input/pointer/SVG tests: 13 passed.
No assertion on geometry or fingerprint was weakened.

Saved-article probe at 900/1,800/2,592 graphemes, six append revisions each:
provider calls per revision reduced from 28/56/80 to 2/2/2. Current layout upper
middle sample of six: 4.31/7.84/10.92 ms, versus prior saved 10.48/17.17/25.70 ms.
This is sequential Node evidence, not a same-run speedup guarantee. Eighteen
reference canonical fingerprint comparisons passed. Local probe:
`tests/shapeStage.local.test.ts`, output `profiling/shape-cache-stage.json`.

Browser same 1,800-grapheme prefix plus `xyz`: frame layout 16.5/22.0/19.6 ms;
fingerprint 38.7/46.8/40.0 ms; Core edit 84.3/94.6/79.5 ms; input-to-DOM-commit
115.2/135.7/117.1 ms. Exact displayed text matched, no alerts. Prior stage probe
layout was 80.2/39.5/43.9 ms. Three DEV automation samples with instrumentation
do not prove physical held-key performance, presented-pixel latency or all-edit
speed. Whole affected-text cluster preparation/reflow and full-frame identity
work remain; fingerprint is the next measured contributor to investigate.

Evidence under `C:/Users/nekot/Documents/FlowDoc-dev/20261004/profiling/`:
`shape-cache-stage.json`, `shape-cache-browser-after.json` and `.png`.
Core implementation commit: `16dce19` (development branch only).
Saved drafts in `before-shape-cache-drafts.json`, restored A/B after HMR reset
and verified exact equality. Diagnostic tab closed. No product main merge/push,
Backend/persistence, DOCUMENT_MAP or readiness promotion.

### Fingerprint investigation, step 1: serialization only (2026-10-04)

Owner requested the two fingerprint stages be examined one at a time. This
bounded inline discovery measures only frame-to-canonical-text conversion;
WASM transfer/hash investigation is deferred. Core candidate remains 16dce19.
Execution IDs N/A; acceptance is isolated current-serializer timing and exact
output parity on the established corpus, with one existing-record update.

Local `tests/serializationOnly.local.test.ts` creates actual current-WASM frames
from saved article prefixes of 900/1,800/2,592 graphemes, each after appending x.
Frame creation/editing, reference serialization, comparison and reporting are
outside the measured region. Each case has two warmups and ten measured calls
to `stringifyProductFrameIdentityV1`. All 36 outputs match the independent
canonical serializer byte-for-byte as JavaScript strings. Diagnostic test passed.

The probe generates a standalone local browser page using the production
serializer transpiled by TypeScript, with prebuilt identity fixtures and exact
reference strings. Source SHA-256:
`8d79565846a3379c61bcaaf486933d4daa6c20ba571b4252248b8aa033feade0`.
Browser runs the same two-warmup/ten-sample protocol; all cases match reference.
No Core runtime file, Editor import graph or live user tab was changed.

| Prefix graphemes | Canonical UTF-16 units | UTF-8 bytes | Node median ms | Browser median ms |
| --- | ---: | ---: | ---: | ---: |
| 900 | 481,112 | 485,120 | 3.71 | 7.80 |
| 1,800 | 966,404 | 974,492 | 10.69 | 17.75 |
| 2,592 | 1,394,014 | 1,405,494 | 11.68 | 23.85 |

At 1,800, browser samples range 14.9–29.2 ms. Serialized section sizes:
carets 490,414 units (~50.7%), spans 263,245 (~27.2%), pages/paint 205,217
(~21.2%); paragraph source is only 3,148 units. These are data-volume shares,
not measured CPU-time shares. The current serializer walks every nested object,
sorts its keys and concatenates the complete canonical representation. Reusing
raw shaping facts does not remove this work. This establishes substantial
serialization cost without proving that sorting or concatenation individually
dominates it.

Limits: isolated repeated serialization of a fixed prebuilt frame differs from
interactive editing, allocation pressure and physical input. The timed call ends
when the JS string is returned; any lazy string flattening during later use is
not isolated here. Do not subtract this median from earlier fingerprint timings
to infer WASM/hash cost. No serializer optimization or fingerprint contract
change was made. Step 2 remains unmeasured in this round, per owner sequencing.

Evidence under `C:/Users/nekot/Documents/FlowDoc-dev/20261004/profiling/`:
`serialization-only-node.json`, `serialization-only-browser.json` and `.png`.
Reproduction page: Editor-local untracked `serialization-only.local.html`;
contains private local corpus fixtures and must not be committed or published.
Measurement tab closed. No product main merge/push or readiness promotion.

### Fingerprint investigation, step 2: WASM transfer and hash (2026-10-04)

Owner authorized continuation after step 1. Inline discovery, execution IDs N/A;
Core remains 16dce19. No runtime changes. Reuse the exact three step-1 identity
fixtures. Local `tests/hashOnly.local.test.ts` verifies the actual WASM result
against Node SHA-256 for all three and generates `hash-only.local.html` in Editor.
The diagnostic initially omitted the public `sha256:` prefix in its expectation;
after matching the documented Rust return format, all three independent checks
passed. Production hash code was not changed.

Browser page embeds the unchanged generated WASM JS glue and actual binary;
binary SHA-256 is the runtime-pinned
`eeec2a5e9610004ea17c8263f6707797cb5e802eea88114f8a9168aef399b3e4`.
The artifact also records the glue digest. Initialization, fixture parsing and
serialization are outside timing. Two warmups plus ten samples per size/mode:
prepared reference string, and a freshly returned production-serializer string.
The latter is not compared or encoded before entering the timed wrapper.

Total times use the original `product_session_fingerprint` wrapper. Separate
diagnostic calls reproduce its allocation/encoding, WASM invocation, returned
string decode and output free, with timestamps bracketing the first two stages.
They reuse the glue's actual private functions, not an alternative encoder/hash.
Every wrapper and split-call result equals the independently computed reference
(144 browser calls including warmups). Medians, milliseconds:

| Graphemes | String preparation | Original wrapper total | Encode/allocate/copy | WASM call |
| --- | --- | ---: | ---: | ---: |
| 900 | Prepared | 8.40 | 4.15 | 5.00 |
| 900 | Freshly serialized | 10.35 | 6.10 | 4.50 |
| 1,800 | Prepared | 16.50 | 6.80 | 9.30 |
| 1,800 | Freshly serialized | 23.05 | 14.00 | 10.00 |
| 2,592 | Prepared | 22.75 | 10.45 | 12.85 |
| 2,592 | Freshly serialized | 30.60 | 18.80 | 13.15 |

Do not sum medians from separate calls or subtract step-1/previous-run medians.
The WASM interval includes call boundary and Rust result construction as well as
SHA-256, not pure hash CPU. Transfer includes allocation, string access, UTF-8
encoding/copy and any delayed string work. Fresh strings are measurably more
costly in this short run, but rope flattening, GC and allocation contributions
were not independently proven. These are fixed-frame synchronous DEV probes,
not a physical input or end-to-end latency acceptance. The UI click tool timed
out while the batch ran; the completed result was read without rerunning it.

Finding: serialization and transfer are both substantial; hashing is not the
only remaining contributor. Next recommended bounded investigation is the
serializer-to-UTF-8 transfer boundary, preserving the exact canonical bytes and
SHA-256 contract. Do not remove identity fields or substitute a hash algorithm
based on this measurement. No optimization adopted in this round.

Local evidence under `C:/Users/nekot/Documents/FlowDoc-dev/20261004/profiling/`:
`hash-only-browser.json` and `.png`. Reproduction test/page remain untracked,
with private local corpus fixtures; do not publish them. Diagnostic tab closed;
live drafts untouched. No product main merge/push or readiness promotion.

### Transfer-boundary alternatives: no adoption (2026-10-04)

Owner authorized further exploration. Bounded inline discovery, execution IDs
N/A, Core candidate unchanged at 16dce19. Scope: compare transfer strategies
with exact canonical bytes and the same WASM SHA-256; no production mutation.
Local `tests/transferBoundary.local.test.ts` generates a separate browser page
from the step-2 artifact. Generator check passed. User drafts/import graph remain
untouched. Evidence target is this existing record, not a new Work or map.

Source inspection: generated `passStringToWasm0` first allocates by string length
and copies ASCII via a JS loop, then slices at the first non-ASCII character,
expands the allocation, encodes the suffix with TextEncoder.encodeInto, and
shrinks to the actual byte count. Two diagnostic alternatives were measured:
the glue's existing no-realloc branch (encode entire string into a temporary
Uint8Array, allocate exact bytes and copy); and direct encodeInto into a
three-times-length WASM allocation followed by shrink-to-written-size.
All strategies call the same original WASM function and decode/free its result.
No alternate hash, omitted identity field, or reusable mutable buffer was used.

The first two-method probe showed full encoding slower at every corpus size;
this motivated the direct-write variant to check the temporary-copy hypothesis.
Final same-run experiment rotates three-method order, with two warmups and ten
samples per method/size. Each call freshly serializes before transfer. Timing
covers serialization, transfer, hash/return and their complete combined duration.
Actual transferred bytes were checked separately against TextEncoder(reference)
for all nine size/method pairs. All fingerprints match the independent reference
(108 timed/warmup calls plus nine byte-check calls). No parity failures.

| Graphemes | Transfer method | Median transfer ms | Median serialize-through-hash ms |
| --- | --- | ---: | ---: |
| 900 | Original | 5.85 | 19.30 |
| 900 | Encode whole then copy | 7.20 | 19.95 |
| 900 | Direct encodeInto | 5.70 | 19.05 |
| 1,800 | Original | 11.00 | 35.85 |
| 1,800 | Encode whole then copy | 15.85 | 39.25 |
| 1,800 | Direct encodeInto | 13.05 | 36.00 |
| 2,592 | Original | 16.95 | 50.55 |
| 2,592 | Encode whole then copy | 24.95 | 60.50 |
| 2,592 | Direct encodeInto | 19.30 | 53.15 |

Decision: retain original transfer implementation. Neither alternative shows a
useful improvement at the 1,800 target; the tiny 900 direct-write difference is
insufficient evidence of benefit. ASCII scanning alone is not established as
the bottleneck. Fresh-string representation, allocator behavior and GC remain
unisolated; this probe does not establish their individual costs. Fixed-frame
DEV measurements do not prove live input performance or heap behavior.

Next candidate, if authorized: investigate canonical serialization's repeated
object/key work with exact-output checks; do not keep tuning transfer merely
because it has measurable cost. Direct frame-to-byte serialization would be a
larger separate design change, not an accepted outcome of this experiment.

Local evidence under `C:/Users/nekot/Documents/FlowDoc-dev/20261004/profiling/`:
`transfer-boundary-browser.json` (first two-method run),
`transfer-boundary-three-browser.json` and corresponding `.png` files.
Untracked reproduction: `tests/transferBoundary.local.test.ts`, Editor
`transfer-boundary.local.html` (private local fixtures, do not publish).
Diagnostic tab closed. No runtime optimization adopted or main merge/push.

### Canonical key-order reuse probe (2026-10-04)

Owner authorized the next exploration. Bounded inline Core discovery, execution
IDs N/A; production remains 16dce19. Scope: reduce repeated sorting without
altering canonical bytes, UTF-8 transfer, WASM or hash identity. No implementation
adopted. Existing record is the document budget; one local parity/generator test
and one same-run browser comparison are the proof budget.

Diagnostic candidate keeps one key-order plan per recursion depth within a
single serialization. It still calls Object.keys for each object and checks
the complete unsorted key sequence before reusing a sorted array. A shape change
replaces that depth's plan. Existing escaped-key cache, ordinal ordering,
undefined omission, number/string encoding and concatenation are unchanged.
No input values or plans survive a serialization call. This isolates one
optimization; it does not skip walking every value or shrink the frame.

`tests/keyPlan.local.test.ts` passed exact comparison to the independent canonical
reference for all three actual frame fixtures plus edge cases: numeric keys,
different insertion order, changed same-sized shapes, undefined values, escaped
keys, Thai/surrogate strings and finite number encoding. Invalid numbers/bigint/
symbol values are rejected. Candidate source is a local diagnostic artifact,
not a production module. Full runtime acceptance remains unperformed.

Browser fresh-serializes each call, then invokes the original WASM wrapper.
Alternated baseline/candidate order, two warmups and ten measured samples each
at 900/1,800/2,592. All 72 outputs and hashes including warmups match reference.
Medians, milliseconds:

| Graphemes | Original serialization | Candidate serialization | Original serialize-through-hash | Candidate serialize-through-hash |
| --- | ---: | ---: | ---: | ---: |
| 900 | 8.15 | 6.70 | 18.05 | 17.50 |
| 1,800 | 15.10 | 12.70 | 35.85 | 34.05 |
| 2,592 | 21.50 | 17.20 | 52.85 | 48.70 |

At the 1,800 target, observed serialization saving is 2.4 ms (~16%), while total
fingerprint pipeline median improves 1.8 ms (~5%). These are separately computed
medians, not an additive cost decomposition. This short fixed-frame DEV probe
shows a modest opportunity, not a major explanation of typing stalls or proven
live-input improvement. Transfer/hash remain unchanged and significant.

Decision: keep as a measured candidate; do not claim it deployed or expand into
a new fingerprint contract. If adopted later, require normal production parity
and affected-consumer checks. Further substantial gains likely require reducing
more whole-frame work; that is a hypothesis needing a separate bounded design,
not justification for an unmeasured rewrite.

Local evidence under `C:/Users/nekot/Documents/FlowDoc-dev/20261004/profiling/`:
`key-plan-candidate.local.ts`, `key-plan-browser.json` and `.png`.
Reproduction: untracked `tests/keyPlan.local.test.ts`, Editor `key-plan.local.html`
(contains private local fixtures; do not publish). Diagnostic tab closed; user
drafts untouched. No runtime change, product main merge/push or map promotion.

### Changed-line versus reconstructed-frame inventory (2026-10-04)

Owner agreed to investigate whole-frame work and address design gaps from
evidence. Inline discovery, execution IDs N/A; Core remains 16dce19. Bounded
scope: one existing article prefix, 1,800 graphemes / 2,167 UTF-16 units, one
paragraph inside a TextBlock, width 432pt. Nine independent sessions perform
insert/delete/replace at start, a middle shaping-cluster boundary, and end.
Insert/replacement is ASCII x; deletion removes one existing shaping cluster.
This is not a claim about all Thai input or multi-paragraph TextBlocks.

`tests/frameChangeScope.local.test.ts` passed all nine accepted edits and exact
source-text assertions. Before/after frames each contain 28 lines. Exact line
comparison includes the complete line record, paint commands, carets and spans
at the same line index. Diagnostic visual comparison removes only sourceRange
and glyph clusterUtf16 offsets from paint commands; it retains text, glyphs,
positions and all other paint fields. It is not screenshot/pixel evidence.

| Position | Edit | Exactly unchanged line bundles | Visually unchanged paint lines | Exact unchanged prefix |
| --- | --- | ---: | ---: | ---: |
| Start | Insert | 0 | 22 | 0 |
| Start | Delete | 0 | 26 | 0 |
| Start | Replace | 27 | 27 | 0 |
| Middle | Insert | 13 | 13 | 13 |
| Middle | Delete | 13 | 27 | 13 |
| Middle | Replace | 27 | 27 | 13 |
| End | Insert | 27 | 27 | 27 |
| End | Delete | 27 | 27 | 27 |
| End | Replace | 27 | 27 | 27 |

Despite equal data, every case retains zero object references from the prior
frame's line, caret, span and paint-command collections. Tail insertion emits
28 new line records, 3,604 caret records, 1,801 spans and 2,182 positioned glyph
records, even though only one complete line bundle differs. Raw-shape caching
still works (two provider calls for each tail edit); that cache does not avoid
frame geometry allocation, full canonical serialization or hashing. This is an
allocation/data-change inventory, not a measured speedup opportunity in ms.

Finding: visual equality and editing-position equality must remain separate.
Insert/delete can leave glyph geometry unchanged while shifting source offsets;
blind reuse would risk stale caret/selection mapping. Conversely exact complete
line equality exposes real reuse candidates. A future bounded implementation
should first test immutable line-bundle reuse while keeping final frame bytes
and fingerprint identical. Reusing objects only after rebuilding and comparing
them would not by itself avoid reconstruction work; early reuse requires a
validated layout/input dependency boundary, including line-end shaping context.

Recommended design sequence: (1) define dependencies for paragraph-local line
shaping/geometry versus source offsets and document placement; (2) prototype
safe reuse of unaffected lines with fallback on uncertain boundaries/reflow;
(3) verify middle edits, Thai clusters, wrapping, split/join, IME and selection
against the cold reference; (4) measure whether savings survive remaining full
serialization/hash costs. Do not assume 27/28 equal lines means a 96% speedup.
Changing fingerprint composition is a separate contract decision, not authorized
by these observations alone. No runtime implementation adopted in this round.

Evidence: `C:/Users/nekot/Documents/FlowDoc-dev/20261004/profiling/frame-change-scope.json`;
reproduction is untracked `tests/frameChangeScope.local.test.ts`. Existing user
tabs/drafts untouched. No product main merge/push or map/readiness promotion.

### Immutable line-bundle prototype and cost boundary (2026-10-04)

Owner approved the recommended exploration. Inline discovery, execution IDs N/A;
Core candidate remains 16dce19. A generated untracked copy of the current frame
materializer experiments with retaining complete frozen line/caret/span/paint
bundles before geometry reconstruction. Production imports and live tabs were
not changed. One local test and this existing record bound proof/document scope.

Dependency inventory for this fixed-profile, single-inline product path:
raw shaping uses exact isolated line text and provider/font binding; geometry
also depends on paragraph-relative start/end offsets, paragraph/line/page index,
baseline/placement, and whether the line ends the paragraph (caret affinities).
These must all match before reusing the complete bundle. Layout and actual
line-end shaping still run first. The prototype does not infer reuse solely
from unchanged text prefixes or paint similarity. It retains only the latest
successful frame's bundles; no cross-session global cache.

The first candidate included all shaped cluster/glyph facts in its comparison
key. This preserved frames but made geometry work slower: tail-edit median
0.914 ms cold versus 2.864 ms cached, despite reusing 27/28 lines. This candidate
was rejected. The second candidate keys only the dependencies listed above;
its validity is restricted to the current fixed provider and single-inline
line-shaping path, not a general arbitrary-provider/rich-style API guarantee.

Both experiments use the actual 1,800-grapheme article and eight successive
insertions each at start/middle/end (alternating x and Thai ก). Each of 24 frames
is compared in full, excluding diagnostic work counters, against both cold
materialization and the actual runtime frame. Full geometry, source metadata,
caret affinities and fingerprint match. Both test runs pass. Independent shape
caches serve cold/candidate paths; measurement order alternates per revision.
After excluding the first two revisions, six-sample median geometry-loop cost
for the smaller-key candidate (Node, includes key checking and assembly):

| Edit location | Reused lines / 28 | Cold geometry ms | Candidate geometry ms |
| --- | ---: | ---: | ---: |
| Start | 0 | 1.007 | 1.088 |
| Middle | 13 | 0.728 | 0.581 |
| End | 27 | 1.023 | 0.335 |

Decision: do not adopt a geometry cache on the strength of this probe. Tail
geometry allocation can be reduced, but the measured saving is only ~0.69 ms
in Node. It does not remove whole-text layout, serialization or SHA-256. Total
frame times fluctuate materially across revisions/runs, including GC/allocation
effects not isolated here; a production or browser speedup is not established.
Previously equal line counts were opportunity counts, not evidence that geometry
construction dominated latency. This experiment prevents conflating the two.

No production-ready acceptance is claimed: deletion, replacement, split/join,
IME, changed widths/providers, multi-page transitions, memory lifetime and
browser interaction would need coverage before adoption. Given the small local
benefit, those checks are deferred rather than expanding this experiment.
Recommended next investigation is the dependency/consumer contract for full
frame fingerprinting on each input: determine what must be synchronous and what
could safely be reused without changing validation. This is read-only discovery,
not permission to defer integrity checks or replace the hash contract.

Local evidence under `C:/Users/nekot/Documents/FlowDoc-dev/20261004/profiling/`:
`geometry-reuse-full-key.json` and `geometry-reuse-probe.json`. Reproduction:
untracked `tests/makeGeometryProbe.local.mjs`, `tests/geometryReuse.local.test.ts`
and `src/creatorPreview/frameGeometryProbe.local.ts`; diagnostic artifacts only.
No runtime change, product main merge/push, user draft or map/readiness changes.

### Product-frame fingerprint consumer audit (2026-10-04)

Owner authorized read-only investigation of synchronous fingerprint consumers.
Inline discovery, execution IDs N/A; product runtime unchanged. Scope is the
current product-session/TextBlock single-surface path, not every similarly named
fingerprint elsewhere in FlowDoc. Initial broad searches were noisy; conclusions
below use narrowed type/import/call paths and a local observed-read probe.

Producer: `productFrameV1.ts:93–95` excludes work/fingerprint from frame identity,
then eagerly computes its canonical fingerprint and deep-freezes the frame.
`productSessionV1.ts:62` supplies the actual canonical serializer/WASM SHA-256.
Public `ProductFrameV1` requires a string fingerprint, and the product-session
package exports the type. Regression tests pin frame fingerprints and compare
full frames; callers requesting/exporting that identity must still get the same
value for the same immutable frame. This is a real contract, not unused data
that may simply be deleted.

Consumer findings:
- Product editing, prepared commits, stale-command checks and caret/selection
  queries use session liveness, expected revision, Rust receipts and validated
  positions, not a comparison of the product frame fingerprint. Publication
  history records paragraph IDs/sourceBinding, not this geometry fingerprint.
- `textBlockProductBridgeV1.ts` validates schema/inline IDs, prepares candidate
  Core edits and commits atomically; it reads frame source/geometry/revision.
  `read()` clones the TextBlock source but returns frames by reference.
- Editor surface session, trial controller and geometry queries use source text,
  revisions and geometry. Direct SVG painter consumes page/paint data only.
- `svgFrameCache.ts:24` spreads the entire frame when building a single command
  on a cache miss. That implicitly reads an enumerable fingerprint even though
  the painter does not need it. The cache key itself uses paint/placement/font,
  not the product frame fingerprint.
- `productFrameV1.ts` deep-freeze uses Object.values, which would invoke an
  enumerable lazy fingerprint getter. JSON serialization and spread likewise
  remain legitimate observable consumers of such a getter.
- No direct ProductFrameV1/product-session type or authority-tag consumer was
  found in the searched Backend src tree. This does not prove all generic
  serialization or external callers absent; other Backend fingerprints serve
  different contracts and are outside this audit.

Untracked Editor `src/tests/frameFingerprintReads.local.test.ts` wraps real frozen
frames in transparent proxies that return unchanged values and count fingerprint
reads. Actual-WASM 1,800-grapheme corpus, 28 lines, original painter/cache:

| Operation | Observed fingerprint reads |
| --- | ---: |
| Direct SVG painting | 0 |
| SVG cache cold build | 28 |
| SVG cache unchanged build | 0 |
| SVG cache after tail insertion | 1 |
| Object.values(frame) | 1 |
| JSON.stringify(frame) | 1 |

Probe passed. Counts are property reads, not repeated hashes in today's eager
runtime; a memoized lazy design would compute at most once but would still be
forced on the typing path by these consumers. Evidence:
`C:/Users/nekot/Documents/FlowDoc-dev/20261004/profiling/frame-fingerprint-reads.json`.

Recommended bounded design candidate: defer only product-frame identity hashing
until an explicit read/export, memoize per deeply immutable frame and retain
the exact string/serialization contract. Freeze data without invoking that
getter, and pass only required paint fields rather than spreading the frame.
Keep revision/receipt/schema/atomicity checks synchronous and unchanged.
Acceptance must include old retained-frame reads after later edits/disposal,
JSON/spread compatibility, immutability, first-read failure/timing semantics,
exact hashes and proof that normal edits/painting do not accidentally force
hashing. This is a cross-owner Core/Editor implementation proposal, not an
approved runtime change or a measured speedup. The cost is deferred, not erased.
No production changes, main merge/push, live-draft or readiness/map changes.

### Demand-computed immutable frame fingerprint (2026-10-04)

Owner approved proceeding and offered physical-input help when needed. Bounded
inline implementation across Core and its Editor painter consumer, execution
IDs N/A. Core `195a0e3`; Editor `da0ead2`, development branches only. Scope is the
audited product frame identity, not Rust receipts, sourceBinding, other FlowDoc
fingerprints, Backend admission or persistence. Existing record reused.

Core freezes all frame data before installing an enumerable, non-configurable
fingerprint getter, then freezes the frame itself. The getter holds a frozen
identity and computes the exact existing canonical/SHA-256 value once on its
first successful read. It requires no live paragraph receipt; old frames remain
readable after edits and session disposal. No background queue or asynchronous
publication was added. Fingerprint failure now occurs on first read, not frame
publication; failed computations are not memoized and a later read retries.
Revision/liveness/receipt/schema/position and atomic candidate checks remain
synchronous and unchanged. Property descriptor changes from frozen data property
to getter are intentional; the string value, enumerability and serialized output
are preserved. External descriptor-reflection compatibility is not claimed.

Editor SVG painter now accepts only page data. Cache misses pass only those
pages rather than spreading the full frame, avoiding incidental fingerprint
reads. Drawing output and cache identity inputs are unchanged. JSON export,
structuredClone, object spread or direct fingerprint reads still synchronously
force calculation when requested; repeated reads of that frame reuse the value.
Hashing cost is deferred, not eliminated. Consumers that serialize all frames
on each input could reintroduce the cost.

New Core tests first failed on eager computation, then passed: zero hashes during
creation/edit/caret queries, stale revision rejection, exact independent Node
SHA-256, memoization, retained frames after disposal, JSON/spread/structuredClone,
deep immutability and failure/retry semantics. New Editor test first observed
23 incidental reads on cold drawing, then zero after repair; warm and tail-edit
painting also read zero, while explicit enumeration/export reads remain visible.
Core affected coverage: 76 tests passed; Editor surface/painter/cache/input/
pointer coverage: 16 passed. Both type-checks passed. Editor type-check initially
caught an implicit-array type in the prior untracked read-count diagnostic;
annotated that local diagnostic and reran successfully. No runtime workaround.

Separate browser stage trial, saved 1,800-grapheme article plus xyz: exact text,
zero alerts, zero frame-fingerprint timing events through create/fill/append.
Core edits 74.7/61.2/40.6 ms; input-handler-to-DOM-commit 118.5/105.9/73.9 ms.
Earlier eager three samples were 115.2/135.7/117.1 ms. Sequential DEV samples
are not a controlled speedup guarantee, physical held-key acceptance or presented
paint latency. A/B switching retained A's exact text and B's ABC/DEF/GHI lines.
Physical held-key typing and Backspace remain for owner testing; overall 1,800
performance acceptance stays open.

Evidence under `C:/Users/nekot/Documents/FlowDoc-dev/20261004/profiling/`:
`lazy-fingerprint-browser.json` and `.png`; regression tests are committed in
their owner repositories. Live tab contained the default A/B texts on entry;
saved `before-lazy-fingerprint-drafts.json` and verified these exact values
unchanged at exit. Did not restore older backups over current state. Measurement
tab closed; live tab retained. No product main merge/push or map promotion.

### Owner physical-input follow-up (2026-10-04)

Owner reports the live single-surface trial still feels unchanged after the
demand-computed fingerprint change. Treat the visible typing symptom as unresolved;
the earlier measured stage reductions do not establish physical-input acceptance.
Read-only inspection of retained live tab 21 found A at 3,935 UTF-16 code units
and B at 25. These are final DOM text lengths, not a measured input workload or
grapheme counts; this is not a controlled comparison with the earlier 1,800-
grapheme sample. No SURFACE_COST entries were returned by the live tab log query,
so this run cannot locate the delay within event delivery, processing or paint.
No draft edits, reloads or product changes were made for this follow-up.

Inline Project Control Steward update to this existing record; execution IDs N/A.
Next bounded diagnostic should capture the remaining end-to-end cost on the same
retained corpus before selecting another optimization. Root cause remains unknown;
do not infer that the prior optimization failed to reduce its measured work, or
that it resolved the owner-visible symptom. No readiness/map promotion.

### Fixed-corpus physical timing probe (2026-10-04)

Owner requested a timing instrument before physical testing. Bounded local
Editor diagnostic, inline execution IDs N/A; product runtime unchanged. Reuses
the stage-trial copy with a start/stop recorder and no per-event console or
statistics UI updates. Owner-supplied paragraph repeated three times with a
single space separator: 3,848 UTF-16 units / 3,170 graphemes. A is preloaded;
original live tabs and drafts are untouched. Local URL:
`http://127.0.0.1:4017/text-block-physical-timing.local.html`.

Untracked diagnostic files: `text-block-physical-timing.local.html`,
`src/editor/textBlockSurface/trialPhysicalTiming.local.tsx`,
`physicalTiming.local.tsx` and `timingCorpus.local.json` in that same directory.
Recorder captures event timestamp age, repeat/trusted flags, input type, Core
stages, SVG building, geometry, DOM commit, second rAF and supported long tasks.
Bounded 12,000 rows with explicit dropped count; no key values or typed text in
recorded rows. Results are rendered only on stop. Stage durations overlap and
must not be summed. Event age excludes unknown hardware/OS latency; rAF/commit
are not presented pixels; trusted flags do not establish physical input.

Editor type-check passed. Browser smoke appended xyz then Backspace: four input
records, four Core-edit/commit/second-rAF records, zero dropped. Maximum measured
Core edit 347.1 ms; input-to-commit 442.4 ms; long task 499 ms. This is instrumented
automated DEV input, not physical acceptance or a before/after benchmark.
Saved `profiling/physical-timing-smoke.json` under the existing local evidence
directory. Reloaded only this diagnostic tab to discard smoke input/results;
verified exact original three-copy corpus and ready status. Physical trial is
pending. No main product integration or readiness promotion.

### Owner held-key capture: repeat backlog (2026-10-04)

Read the owner's completed capture from tab 39 without changing the page.
Saved raw data to existing local evidence directory as
`profiling/physical-timing-owner-68.json`. 68 inputs (33 insertText, 35
deleteContentBackward), 66 repeat keydowns, zero dropped rows; final A length
3,846 UTF-16 units. Each input has a Core edit, DOM commit and second-rAF record.
Adjacent repeat keydown event timestamps have median spacing 30.1 ms (derived
as at minus event age; not hardware timestamps). Keydown age grows through each
held burst, reaching 2,240.3 ms. This supports input backlog in this instrumented
run, rather than treating the nearly immediate beforeinput/input delivery as
proof that no queue exists.

Medians: Rust-edit roundtrip 52.9 ms, total Core edit 67.8 ms, frame build
12.3 ms (nested in Core edit), SVG build 3.0 ms, input-to-DOM-commit 86.4 ms.
Second-rAF callbacks bunch together: median delay 1,700.3 ms, max 3,242.8 ms;
12 observed long tasks, max 1,884 ms. These are scheduling signals, not a
presented-pixel measurement. Zero fingerprint timing events. The measured
per-input work exceeds the repeat timestamp spacing, supporting accumulated
work and delayed rendering opportunities. Instrumentation overhead and exact
internal attribution within Rust-edit roundtrip remain unmeasured.

Next narrow investigation: inspect and split the Rust-edit roundtrip boundary
before another optimization; its name alone does not prove all 52.9 ms is Rust
computation. No product changes or acceptance promotion. Owner need not repeat
this captured case merely to recover evidence.

### Apply-boundary reproduction on fixed corpus (2026-10-04)

Read-only runtime investigation with untracked Core diagnostic
`tests/ownerApplyBoundary.local.test.ts`; no runtime or WASM changes. Actual
pinned WASM, owner three-copy text, separate sessions for six tail insertions
then six deletions of Thai ก and Latin x. Mirrors candidate branching, checks
every accepted response and exact projected text, disposes sessions. One test
passed. Raw result: existing local `profiling/owner-apply-boundary.json`.

Thai: all 12 edits return full-context-required / uncertified-seam; wrapper
call durations 49.06–67.09 ms. Cold-rebuild counters show shaping the entire
3,848–3,854 UTF-16 source, plus segmentation and facts construction. Latin:
first insertion returns full-context-required / budget-exhaustion (50.60 ms);
remaining 11 use retained-command (1.00–2.53 ms). JS command encoding around
0.01 ms and response JSON parsing 0.03–0.26 ms are small in this probe.
Wrapper measurement includes JS/WASM transfer and return conversion; it is
not Rust-only time and Node timings do not replace physical browser evidence.

Source chain: productSessionV1.ts editCandidate measures stringify + exported
apply + parse. Rust cold_session/product.rs apply first attempts rt.apply,
then fallback on uncertified-seam (among other conservative rejection reasons).
Fallback materializes source/spans and calls runtime.rs create_product_fallback,
which constructs a new session without warmed shaping plans. Thus the fixed
Thai reproduction identifies full-context fallback as a concrete large-work
path, consistent with but not retrospectively proving the unlogged execution
reason of each physical capture event. Exact internal fallback stage timing
and which seam certification condition rejects this tail remain unresolved.
Next inspect that certification boundary before proposing a repair; do not
bypass it merely for speed. Existing correctness and physical acceptance stay
open. No product main merge/push or map promotion.

### Thai admission boundary inspection (2026-10-04)

Owner approved the staged approach: inspect rejection, design a bounded repair,
then compare against full rebuild before physical acceptance. Source inspection
only in this step; no product edits. Core commands.rs existing_plan admits the
special Thai tail path only when !edge, final run length <=24 UTF-16, replacement
bytes <=24 and range lies within that run. tail_seam.rs thai_edit additionally
requires a whole-run final shard, bounded replacement/new length, Thai scalars,
an ASCII-letter outer witness when not at source start, exact old provider facts
and matching contextual segmentation. This is a narrow certificate, not a
general Thai paragraph incremental editor.

The fixed-corpus cold summary reports one run over roughly 3,848 units, so it
cannot enter that <=24 path. Generic insertion admission in commands.rs rejects
non-Latin run insertion even at the tail; generic range editing rejects a shard
that does not span the whole run before provider replay. These source conditions
explain the missing admitted route for this long Thai case; exact dynamic branch
instrumentation has not been added. No claim of arbitrary Thai locality follows.

Repair direction must certify a bounded suffix/context window inside a long run,
not merely raise the 24-unit cap or remove seam checks. It must preserve both
shaping and dictionary segmentation context and retained prefix facts; if such
a boundary cannot be established within the budget, retain full fallback.
Whole-run length and authoring-node length are distinct from the safe context
window. This discovery changes the size of the repair beyond a constant tweak;
implementation and oracle comparison remain pending. Existing runtime unchanged.

### Bounded suffix candidate feasibility (2026-10-04)

Owner approved trying the proposed boundary approach. Local-only discovery probe
`tests/ownerSuffixWindow.local.test.ts` uses the unchanged pinned WASM's public
product shape/segment exports. Candidate finder searches backward at most 128
UTF-16 units for an ASCII space; this is a candidate, not a production safety
certificate. On the supplied three-copy corpus it selects offset 3,802, leaving
46 units before editing. Reuses old prefix glyphs/breaks and computes only the
candidate suffix; compares the merged result with full new-text provider output.

15 comparisons passed for consonant, tone mark, vowel, Latin insertion and final
grapheme deletion across original corpus and two Thai-tail variants. Compared
complete glyph records (IDs, cluster offsets, advances and offsets) and line
break arrays. A tail of 200 Thai consonants with no space in the search budget
explicitly returned no candidate; it is not admitted. Actual-WASM Vitest probe
passed with assertions for all 15 comparisons and the fallback case. Evidence:
existing local `profiling/owner-suffix-window.json`. Initial corpus suffix-only
shape/segment samples were about 0.8–1.1 ms in Node, not total edit latency and
not directly comparable to full retained-session rebuild timings.

This establishes sample feasibility only. Public product shaping differs from
the retained-session shard provider; its exact metadata, unsafe concat flags,
grapheme boundaries, run ownership and persistence must be certified separately.
No caret/layout/session integration or physical improvement is proven. No claim
that every space or 128-unit window is safe. Runtime unchanged; next stage is a
retained-provider certificate/oracle probe before production implementation.

### Retained-provider suffix oracle findings (2026-10-04)

Native Rust test-only probe calls commands::facts with the real retained run,
language/features/font/provider and compares merged old prefix plus local suffix
against newly constructed sessions. Three insertion cases (Thai consonant,
tone mark, vowel) plus 50 successive final-grapheme deletion variants: 53 rows.
40 candidates remain within the chosen boundary; all 40 match glyph records,
line breaks and grapheme boundaries after semantic boundary deduplication.
39 match concat flags; one does not. 13 cross the candidate boundary and are
explicitly classified must-expand-or-fallback, not accepted.

Crucially, the original chosen seam immediately after the space carries
unsafe-to-concat=true in both retained and local provider facts. Matching sample
output does not grant a valid safe-concat certificate. Therefore this candidate
must not be admitted with the existing safety predicate. This refines the earlier
public-provider feasibility result rather than promoting it to implementation.
Next candidate investigation must include more left context and inspect the
actual concat-safe boundary; shrinking a suffix to empty also needs explicit
retained endpoint/flag handling. No safety flags are to be overwritten.

Probe: untracked cold_session/suffix_probe.local.rs; temporary cfg(test) hook in
product.rs removed after the run, verified zero diff in that file. Native test
completed in 126.55 seconds; it asserts case count and records comparisons,
not universal equivalence. Initial probe itself failed on a UTF-8 byte slice;
corrected its space lookup before the completed run. No WASM rebuild, browser
reload, product behavior change or main integration. Raw results saved at
existing local profiling/retained-suffix-probe.json. Physical acceptance pending.

### Expanding left context to an observed safe shaping boundary (2026-10-04)

Owner requested continuation of the bounded probe. Including the last space
(offset 3,801) repairs the prior empty-tail concat-flag mismatch in sampled
deletions, but both old and new starting concat flags remain unsafe for normal
insertions. Native retained-provider probe: seven within-boundary cases match
all compared arrays; one crossing case requires expansion/fallback. Evidence:
local `profiling/retained-suffix-left-context.json`.

Inspected retained glyph flags within the last 128 UTF-16 units; found actual
safe shaping candidates, not a uniformly unsafe tail. Selected observed offset
3,796, which is also a retained grapheme and line-break boundary, before the
last space. This leaves 52 units of context before insertion. Eight comparisons
(consonant/tone/vowel insertion and deletion of 1/36/37/38/39 final graphemes)
match full cold-session glyphs, concat flags, grapheme and line-break arrays.
Both retained and local first concat flags are false in all eight. Evidence:
`profiling/retained-safe-boundaries.json` and `retained-suffix-safe-left.json`.
Native diagnostic completed; a separate result check asserts all eight matches
and safe flags. Temporary test-only inclusion removed; product.rs zero diff.
No WASM rebuild, runtime edits, user-page reload or physical acceptance claim.

Offset 3,796 is a discovered fixture candidate, not a hard-coded production
algorithm. An automatic bounded finder and dictionary-context certificate,
including edits beyond this new boundary and source-tree/shard publication,
remain unimplemented. Safe shaping flags alone do not certify ICU line-break
locality. The result supports continuing design but does not establish general
Thai correctness or remove conservative fallback.

### Automatic fixture candidate and dictionary context inspection (2026-10-04)

Local-only suffix_auto_probe.local.rs chooses a preceding ASCII space within
128 UTF-16 units of the tail edit, then searches retained glyph metadata backward
for a grapheme boundary with safe concat/break flags before that separator.
No hard-coded offset: insertions and initial deletions choose 3,796; deletions
past the old separator choose 3,794 automatically. All eight native retained
provider comparisons match cold glyphs, concat flags, line breaks and grapheme
boundaries, with old/new start concat flags false. Result assertions checked
all eight after the native diagnostic. Raw: profiling/retained-suffix-auto.json.
Diagnostic uses pre-collected full oracle arrays, not a production bounded tree
lookup; repeated scans and publication costs are not optimized or measured.

Inspected installed/pinned ICU segmenter 2.2.0 src/line.rs,
line_handle_complex_language_utf8: it collects contiguous complex-language
input until use_complex_breaking returns false or EOF, then invokes the complex
segmenter. This supports preserving complete affected complex-language input,
not treating arbitrary old line breaks as dictionary reset points. It does not
prove all outer Unicode line-break rules local. The shaping candidate can start
inside an earlier complex-language sequence; its guard-area segmentation must
not automatically replace retained prefix segmentation just because sampled
arrays match. A production design needs separately owned shaping and segmentation
boundaries and explicit unchanged-prefix guarantees.

Temporary cfg(test) hook removed; product.rs unchanged. No WASM build or browser
edits. Automatic selection is demonstrated only on these fixtures; admission
certificate, indexed search/publication, wider script/mark edge coverage and
runtime integration remain pending. No physical improvement or readiness claim.

### Approved completion plan: Thai tail editing (2026-10-04)

Owner approved proceeding through implementation and a usable browser trial
without requesting permission for each diagnostic. One inline work authority per
step; execution IDs N/A. Work size large, routine risk with concrete correctness
risk at shaping/segmentation seams. Owners Core and Editor; Project Control owns
this plan/evidence record. No separate rooms or main integration authorized by
this plan. Reuse current development branches, pinned font/WASM and corpus.

1. Design/admission: reuse existing certified local-window machinery where
   possible; specify separate shaping and segmentation ownership, bounded
   candidate search, counters, fallback, and deletion across a moving boundary.
2. Core implementation: tail insertion/deletion only; preserve receipts,
   revisions, atomic publication, cancellation and metered work. Compare retained
   output with cold reconstruction including unsafe flags and boundary metadata.
3. Editor integration: build/verify the matching WASM, preserve live drafts,
   test fixed three-copy corpus plus 1,800-grapheme baseline, capture identical
   event/stage metrics and confirm actual optimized route use.
4. Physical acceptance: owner held typing/Backspace, switching nodes and content
   integrity; no increasing repeat backlog or second-scale stalls in the target
   case. Automated tests alone cannot close this criterion. Main integration
   remains conditional on owner usability acceptance.

Scope excludes general middle-edit acceleration, multi-node scalability, Enter,
pagination, resize and broad rich-text behavior. Existing operations must not
regress. Proof budget: targeted admission/cold-oracle tests, affected Rust/WASM
and adapter tests, type-checks, one controlled instrumented browser comparison,
then owner physical trial; expand only for a concrete failure or coverage gap.
Document budget: this existing record and local raw results, no new Work/report
tree. Return to owner with implemented scope, evidence and remaining limits.

Implementation-entry inspection found existing local_window.rs already has a
space/context certificate and tree splice publication. commands.rs currently
dispatches it only for range/middle edits, not plain tail insertion. Its backward
search is capped at 24 units and its source-work reservation stays within 512
units including repeated scans; the ~52-unit fixture window can exceed this
reservation before provider execution. Therefore changing dispatch/search alone
is insufficient. Next implementation must either reduce repeated source reads
and tighten justified reservations or explicitly review a bounded tail budget;
do not silently weaken global meter guarantees. No production behavior changed
at this checkpoint. Plan task 1 remains in progress; tasks 2–4 pending.

### Thai tail continuation: bounded implementation design (2026-10-04)

Owner requested continuation in the current chat. Single-room work, execution
IDs N/A; Product Implementation Agent for Core/Editor, Project Control Steward
for this canonical record. Existing development worktrees retained: Core base
`195a0e3`, Editor base `da0ead2`; pre-existing local probes/drafts are preserved.
Markdown pre-action gate: existing canonical record, same approved scope and
document budget, no new Work/registry/map or separate-room execution.

Task 1 design: use a bounded source-tree window (96 UTF-16 lookbehind), select
an authentic retained concat/break-safe grapheme cluster before an unchanged
ASCII space, and require the new shaping output to certify the same cut.
Shaping publication starts at that cluster; line-break publication starts only
after the unchanged space. Retain guard segmentation through the space so a
truncated earlier dictionary segment never replaces the unchanged prefix.
Admit only Thai SA/SP in the shaped suffix, with an SA predecessor to the
separator; exclude arbitrary Unicode context, script/style boundaries, oversized
edits/windows and unsafe cuts. Keep the global 512 source/property and 1024
provider budgets; charge executed lookups, scans, copies and provider work.
Fallback remains available when this certificate cannot be established.

Ruling: the previous diagnostic's old/new full suffix replay is test evidence,
not an extra production provider pass. Production uses retained safe-concat
facts plus a new safe-concat witness and the separately owned segmentation
boundary. Cold-oracle tests must compare all glyphs, flags and semantic
boundaries, including repeated edits and moving cuts; a mismatch blocks this
certificate. This avoids repeated scans without raising any meter limit.

Task 2 in progress: the initial native regression first failed with
NotAdmissible/budget-exhaustion; the bounded candidate now passes the five
consonant/mark/vowel/space insertion cases against full cold reconstruction.
Repeated deletion, negative contexts, faults, affected-suite and actual WASM
checks remain pending. Task 3 awaits the matching verified artifact; task 4
still requires the owner's physical trial. No main integration or readiness
claim. This record is the continuation ledger under the existing document
budget instead of generic skill plan/ledger artifacts.

### Thai tail candidate implemented; physical acceptance pending (2026-10-04)

Core development commit `0ef3a78` implements `cold_session/thai_tail.rs`,
dispatches eligible long-Thai EOF edits through it, and adds five native test
groups. No global work cap, receipt, cancellation or publication contract was
relaxed. Runtime and test files only; no product main integration or map
promotion. The implementation remains bounded to the certified Thai-SA/space
suffix profile; numbers, punctuation, opposite scripts, missing safe cuts and
excessive windows can still require full-context fallback.

One read-only fresh-context code review found a real endpoint bug: preserving
the old line break AT the space endpoint could preserve an obsolete EOF break
when appending another space. A new cold-oracle regression failed, then passed
after publication was corrected to retain breaks strictly BEFORE that endpoint
and use new segmentation AT/AFTER it. This corrects the preceding design note's
"through the space" wording. Tests cover repeated spaces and suffix replacement
beginning with a space. Appending a combining mark after a trailing space can
invalidate the shaping witness; this remains an atomic conservative rejection,
not an obligation to admit unsafe shaping. No deferred minor review findings.

Verification: final `cargo test --release --lib --features product-session`
passed all 132 tests. Coverage includes complete cold parity (glyphs, concat
flags, grapheme/line boundaries and run/shard integrity), 48 sequential edits,
24 deletions across spaces, cumulative meters, negatives, cancellation/failure
retry, and existing sustained/structural suites. Initial debug run exposed three
pre-existing assertions fixed at 95 fields although HEAD already had 100; those
tests now validate the current field inventory and still compare every field.
The final release suite passed after this repair. During verification one
premature overlapping native build hit a Windows executable lock; it was not a
passing result. Subsequent native verification waited for the running binary.

Matching local WASM SHA-256:
`35b8994039fffcb510f26a97bccf37e24bd0ff25cc22ede0b84f969a7654cf44`.
Built with the existing wasm-pack product-session command into
`packages/text-engine-rust-wasm/pkg-thai-tail-local`; local
`productSessionThaiTail.local.ts` differs from the production wrapper only in
artifact paths/checksum. Candidate Core adapter/frame tests: 44 passed in seven
files; Editor surface/input/painter/assets/pointer tests: 16 passed in six files.
Core and Editor type-checks passed. Standard tracked WASM/pin remains unchanged
(`eeec2a5e...`), so existing live tabs and drafts are not hot-reloaded. Regular
package artifact promotion is pending owner trial acceptance; only the isolated
candidate trial currently consumes the new binary.

Controlled static production browser comparison used the same recorder, font,
three-copy corpus and six Thai insertions/six Backspaces. Original used full
fallback 12/12; final candidate used retained-command 12/12. Median Rust-edit
roundtrip: 163.0 → 6.3 ms; Core edit: 215.5 → 54.4 ms; input-handler to DOM commit:
249.1 → 111.9 ms. Exact text restored, zero alerts; A/B edited drafts survived
switching. These are sequential automated samples, not held-key backlog or
presented-pixel proof. Frame layout/painting still costs material time.

Additional 1,800-grapheme baseline (first 1,800 graphemes of the fixed corpus)
ends near numbers and stays on fallback 12/12 in both versions. Initial separate
tab timings varied strongly; one same-tab follow-up found median Core edit
116.5 → 116.2 ms and DOM commit 152.7 → 157.3 ms. Text remained exact. This is
no demonstrated speedup for that context, nor a universal regression-free timing
guarantee. Do not extend admission merely to make this sample faster.

Local raw results under the existing `profiling/` directory:
`thai-tail-apply-boundary.json`, `thai-tail-1800-boundary.json`,
`thai-tail-browser-final.json`, `thai-tail-browser-1800.json`,
`thai-tail-browser-1800-same-tab.json`, `thai-tail-draft-switching.json`, and
`thai-tail-{wasm-build,adapter-tests,editor-tests,core-typecheck,editor-typecheck}.log`.
Native final log: Core `packages/text-engine-rust-wasm/rust-live-draft-engine/`
`thai-tail-final-suite.local.log`. Existing probes were preserved; new trial
wrappers/configs and raw artifacts remain local, not shared product authority.

Tasks 1–2 complete for the bounded candidate; task 3's isolated browser
integration/automated checks complete, normal artifact promotion held. Task 4
is OPEN: owner must hold typing/Backspace and assess stalls, repeat backlog,
switching and content integrity. Candidate URL:
`http://127.0.0.1:4022/text-block-thai-tail.local.html`.
Keep development worktrees and source commit; do not merge/push product main,
replace old live drafts, or claim physical usability acceptance yet.

### Owner physical trial: NOT PASSED (2026-10-04)

Owner tried the candidate and explicitly requested that acceptance remain not
passed. Task 4 is FAIL / OPEN for repair, not completed or cancelled. Earlier
automated correctness checks remain evidence for their tested scope; they do
not override this physical usability result. Main integration and normal
artifact promotion remain held.

Read-only inspection of the existing candidate tab captured 168 inputs over
17.85 seconds: 92 insertText and 76 deleteContentBackward; 165 of 168 keydown
events were repeats. Recorder dropped zero rows; no rendered alerts. Final
reported A/B lengths are 3,864 / 25 UTF-16 units. The page and user drafts were
left unchanged. Raw recorder JSON is saved locally at
`C:/Users/nekot/Documents/FlowDoc-dev/20261004/profiling/thai-tail-owner-physical-20261004.json`.

Observed failure evidence:

- Keydown event age grew from about 1–2 ms initially to 7,025.6 ms at the end;
  median 3,385.3 ms. This measures event timestamp age, not hardware latency.
- Twelve long tasks were captured, with the longest lasting 6,123 ms.
- Input-to-second-rAF median 4,916.5 ms, maximum 12,326.6 ms. This is delayed
  callback evidence, not proof of when pixels were actually presented.
- Retained-command handled 69/168 inputs; full-context-required handled 99/168,
  including a continuous fallback stretch at input IDs 44–140.
- Grouped by matching input ID, retained Rust roundtrip median was 2.3 ms and
  Core edit 18.1 ms; fallback medians were 54.3 ms and 69.4 ms respectively.
- Across all inputs, input-handler-to-DOM-commit median was 77.4 ms, maximum
  148.6 ms. This shorter per-input metric does not include the already queued
  keydown delay and must not be presented as proof of responsive held typing.

Conclusion: the bounded optimization works for some edits but does not meet
the approved no-increasing-repeat-backlog/no-second-scale-stalls criterion.
Fallback cost and the remaining per-edit work are investigation targets;
these timing markers alone do not identify the exact admission rejection or
attribute every long task. Keydown rows use input ID zero, so no per-input
keydown association is claimed. Content integrity was not independently
reconstructed from this trial; absence of alerts does not establish it.

Next bounded repair investigation: reproduce the held insertion/deletion
sequence, identify why the sustained fallback stretch begins, and account for
remaining synchronous work even on retained edits. Preserve admission safety
and work budgets; do not weaken certificates to improve timing. Reuse this
failed trial as the acceptance regression, then request owner physical
acceptance only after a corrected candidate demonstrates bounded backlog.
This checkpoint changes only the existing canonical record; no product source,
runtime artifact, Evidence index or system map was changed.

### Thai tail fallback investigation: step 1 (2026-10-04)

Owner authorized investigation of the 97-input fallback stretch first. Inline
discovery under the existing plan; Core owns the investigated behavior, Project
Control Steward/Evidence Reviewer owns this record; execution IDs N/A. Scope:
reproduce route selection, distinguish budget and certificate rejection, assess
repair direction. No candidate source/runtime changes or step-2 rendering work.
Proof budget: one actual-WASM sequence replay and fresh-session controls at the
transition lengths; document budget remains this record plus local probes/results.

The visible final A draft equals the original corpus plus sixteen U+0E01
characters. Replaying captured input types (92 insertions, 76 Backspaces), with
U+0E01 as the inferred inserted character, against unchanged candidate WASM
`35b8994039fffcb510f26a97bccf37e24bd0ff25cc22ede0b84f969a7654cf44`
matches ALL 168 recorded routes, including IDs 31, 41 and 44–140 falling back.
Every accepted projected string matches the expected edit sequence. The recorder
did not store inserted characters/caret positions; this is a strongly matching
reconstruction, not a recovered exact input payload log.

Of the 97 consecutive fallbacks, IDs 44, 45 and 140 report budget-exhaustion;
the other 94 report uncertified-seam. Source inspection of `thai_tail.rs`
explains the finite admission boundary: SEARCH is 96 UTF-16 units, the retained
safe shaping cut must precede an unchanged space, and both old/new suffixes
must fit 96 units. Continued unspaced insertion moves that witness outside the
admitted window. Raising only the search size would still encounter work limits
and would not establish a new segmentation certificate.

A separate control cold-creates the same text before each edit. At 30, 40 and
43 appended characters, it admits insertion although the sustained sequence
falls back at those same text lengths (IDs 31, 41, 44). At 44 appended characters
it rejects for budget-exhaustion; at 45, 49, 50 and 92 it rejects for
uncertified-seam even from a fresh session. Thus resetting retained state removes
the early cost issue but cannot remove the certificate/window limit.

The early cost issue is consistent with retained source-piece fragmentation:
at ID 31 the rejected attempt reports 114 source-offset lookups versus six in
the corresponding successful fresh control. `Source::window` visits intersecting
pieces and performs offset reads for each; `local_window::reserve` charges those
reads together with source/property scans against 512. Fallback rebuilds compact
state, explaining why later edits can temporarily return to the retained route.
No internal per-return trace was added, so the exact rejecting reserve call is
not claimed; public reasons, measured costs and controlled outcomes are retained.

Local probes: Core `tests/ownerThaiReplay.local.test.ts` (asserts every route and
projected string), `tests/ownerThaiColdControl.local.test.ts` (eight fresh-session
length controls). Results: `profiling/thai-tail-owner-replay.json` and
`profiling/thai-tail-cold-length-controls.json`. Final focused run passed both
tests (two files, 14.91 seconds). These diagnose admission, not
held-key responsiveness or new cold-oracle correctness. Product acceptance
remains NOT PASSED; the live page/drafts and tracked Core source are unchanged.

Step 1 finding: bounded source-window access can address premature budget
rejection, but sustained unspaced Thai needs a separately justified segmentation
boundary strategy. Do not claim reducing reads alone solves held typing, simply
raise caps, or admit a shaping-safe cut as if it also certified segmentation.
Implementation requires that bounded design/proof before extending admission.

### Owner acceptance clarification and bounded next investigation (2026-10-04)

Owner approved one end-to-end path investigation and one isolated prototype,
with a stop/review if that approach fails. The immediate goal is ordinary-feeling
TextBlock typing and held insertion/Backspace on the failed long corpus, with
correct text, caret and wrapping. DOC export, cross-page behavior, nested nodes
and tables are deferred for this slice. Owner explicitly cautions that prior
automated tests did not predict physical experience and offers physical testing.
Physical owner acceptance is mandatory; automated timing/correctness cannot
substitute for it. Do not ask for another capture merely to repeat known failure.

Scope remains inline, IDs N/A; Core/Editor own behavior, Project Control owns this
record. Discovery is read-only for the candidate. Reuse captured failures and
historical checks; no broad benchmark rerun. Before implementing a change to a
core contract, present its concrete design and impact to the owner, as agreed.
An isolated prototype must preserve every edit, correct visible geometry and
caret mapping; a temporarily incorrect visible layout is not an accepted shortcut.

Initial current-source path inspection:
- Editor `textBlockSurface/trial.tsx` onInput calls `session.applyValue`
  synchronously before publishing the snapshot.
- `session.ts` computes replacement and invokes the Core bridge; the product
  wrapper `productSessionV1.ts` builds a candidate frame before publication.
- Rust `cold_session/product.rs` falls back to `create_product_fallback`;
  `runtime.rs::construct` validates policy, derives runs/shards, hashes source,
  descriptors and facts, builds trees and publishes a new session.
- The product frame then projects text and requests shaping for the changed
  paragraph through `prepareClusterWrappedLinesV1`. Existing exact-input shape
  reuse and lazy frame fingerprinting already apply; they are not new proposals.

This establishes two synchronous stages with separate derived data, not proof
that either can safely be removed or that their shaping results are interchangeable.
Next design question is which validated results can serve both edit admission
and final geometry without weakening boundaries or duplicating full-paragraph
work. Consumer/dependency proof is required before selecting that prototype.
No new speedup, prototype completion or physical acceptance is claimed here.

Owner help is needed at the meaningful physical comparison, once a candidate
passes correctness checks and is ready for the same held-input workload. Keep
the failed baseline available and inspect timing separately from subjective
smoothness. If the owner still observes stutter, acceptance remains NOT PASSED
even when automated measurements improve. Current checkpoint changes only this
record; no product source, WASM, live page or drafts changed, and no tests rerun.

### One isolated prototype: no demonstrated input-path gain (2026-10-04)

Owner explicitly authorized starting the bounded investigation/prototype. Role:
Core discovery/prototype, Project Control Steward for this record; execution
IDs N/A. Existing candidate and user page remain untouched. Isolated detached
checkout `C:/Users/nekot/Documents/FlowDoc-dev/20261004/typing-prototype-core`
at base `0ef3a78` retains the uncommitted experiment for inspection.

Source inspection rules out blindly sharing glyph arrays: retained derivation
explicitly sets script/language/direction/features and unsafe-concat flags,
whereas product display shaping uses its own buffer/features path and actual
line-end requests. These are not established interchangeable providers. No
admission check, segmentation certificate or visible layout was removed.

One current actual-WASM diagnostic (`tests/typingPathAudit.local.test.ts` in
the existing Core development checkout) measured the fixed corpus plus 16 or
92 repeated Thai characters, four rounds of three appends. After the first
round, nine samples per case show retained edit roundtrip median 2.01 ms versus
fallback 52.50 ms; frame build medians 16.38 / 16.44 ms. Both use existing lazy
frame fingerprints and exact-input shape reuse. Source checks pass. These are
Node observations, not a physical responsiveness claim. Raw artifact:
`profiling/typing-path-audit.json`.

Chosen disposable prototype targets cold retained-fact encoding, distinct from
the already optimized product-frame fingerprint. `runtime.rs` calls a new local
`facts_encode_probe.rs` serializer that writes shard/glyph fields in canonical
key order directly, avoiding the temporary serde_json Value tree. Exact bytes,
fact hashes, validations, segmentation, receipts and frame provider remain;
work counters honestly omit the eliminated Value pass. No global budget raised.

Native focused parity test passes empty, 1/129/4000-glyph fixtures including
negative offsets and unsafe flags. Matching prototype WASM built successfully.
Paired actual-WASM comparison alternates baseline/candidate order over eight
rounds on the original corpus plus 92 Thai characters, inserting a consonant,
adding a mark, then deleting their complete grapheme. All 24 paired operations
match projected text/spans, complete display shape facts, retained facts digest
and execution route. Initial probe incorrectly tried deleting only the mark;
unchanged baseline rejected invalid-grapheme-range, so the probe was corrected
to remove the whole grapheme. No product boundary was weakened.

After two warmup rounds, 18 calls per variant: apply median baseline 92.68 ms,
prototype 103.68 ms. These paired-run absolute times differ from the preceding
diagnostic and must not be compared across runs as a regression percentage.
The measured allocation count in bytes decreased, but no useful timing gain was
demonstrated. Do not claim the prototype definitively slows all workloads or
that encoding is costless; this experiment simply fails the adoption criterion.
Evidence: Core local `tests/factsEncodingPrototype.local.test.ts` and
`profiling/facts-encoding-prototype.json`. Native parity and paired comparison
are correctness/diagnostic evidence, not owner usability acceptance.

Decision: stop this prototype and do not deploy it or request another owner
trial. No new test page is ready. Retain the failed physical baseline; overall
TextBlock typing remains NOT PASSED. Further implementation is not silently
added to this one-prototype budget. Next review must distinguish reducing the
cold reconstruction obligation itself from optimizing its representation;
no revised admission/state contract is approved by this negative experiment.

### Validation dependency audit: proposed separation (2026-10-04)

Owner chose option 1: inspect what each check depends on, what invalidates it,
and who consumes it before changing product behavior. Inline discovery,
execution IDs N/A; Core owns validation/state, Editor owns input/publication,
Project Control owns this table. Acceptance for this audit is a source-backed
dependency map and explicit safe/unsafe separation boundaries, not faster typing.
Current source inspected at Core `0ef3a78`, with no tracked changes. Existing
negative prototype remains isolated and is not the candidate for this audit.

Paths below are relative to Core. Rust prefix R is
`packages/text-engine-rust-wasm/rust-live-draft-engine/src/cold_session/`;
wrapper W is `packages/text-engine-rust-wasm/src/productSessionV1.ts`.

| Check/data | Dependencies and invalidation | Current consumers | Separation ruling |
| --- | --- | --- | --- |
| Provider/font validation | Exact font bytes, policy, versions, routes and features; changing any invalidates validation | R/policy.rs:38 validates; R/runtime.rs:197 calls it on construction; derive resolves coverage/routes | Candidate for once-per-validated-context reuse, with a private validated identity bound to exact immutable configuration. A digest supplied by a caller is not proof. Shaping-plan cache state is separate. |
| Command authority | Live receipt, expected revision, composition, range and ownership; each command changes the relevant state | R/commands.rs:353 onward; R/product.rs apply/fallback; W check/prepare/commit | Must remain checked for each command and again at prepared commit where required. No stale-revision or ownership bypass. |
| Text validity and editing boundaries | Authored spans, Unicode scalars, grapheme boundaries, scripts, font coverage and neighboring context | R/derive.rs build; R/product.rs boundary/fallback; R/commands.rs range checks | Changed text needs validation before acceptance. Font validity does not prove glyph coverage for new text. A frame caret boundary cannot silently replace a grapheme boundary. Reuse requires an explicit context/offset proof. |
| Retained runs/shards | Source revision, script/language/style/font/features, shaping flags, grapheme and line segmentation | R/commands.rs, local_window.rs, thai_tail.rs, structural.rs, maintenance.rs | Needed by the current retained editing algorithms; not directly consumed as the display glyph stream. Invalid facts must be unavailable, never treated as current. Making them optional requires a new explicit state contract and a complete edit path that does not immediately rebuild them. |
| Display layout and caret geometry | Current source, actual display provider/font, width, line-end shaping, placement and revision | W frameFor; src/creatorPreview/productFrameV1.ts:38 and caret/hitTest/selection/move at 107 onward | Must be correct for the published revision. Source-stable layout may reuse existing caches; changed text cannot use stale geometry. Retained glyphs and display glyphs have different shaping setup, so direct substitution is unproven. |
| Identity and reports | Source identity, receipt binding, descriptors/facts, immutable frame | R/runtime.rs construct; R/commands.rs:788 finish_candidate; W publication journal; coldSessionStage3.ts ColdSummary | Source bindings/receipts participate in history and authority, so preserve them. Cold facts/descriptor digests are exposed report contracts; absence of a display consumer does not authorize deletion. Frame fingerprint is already lazy. |

Important implementation facts:
- `Session` already stores its provider under Arc, but the configuration is not
  represented by a dedicated validated-context type. Product fallback clones
  provider configuration and starts cold construction/validation again
  (R/runtime.rs:118). Reusing trusted configuration is a proposed invariant,
  not an existing public guarantee or a measured solution to the full stall.
- `derive::build` constructs both grapheme and line boundaries across source
  (R/derive.rs:143 onward). Product display's cluster-fit path does not use ICU
  line boundaries to choose wraps (`layoutFactsV1.ts`), yet retained seam checks
  compare them. This explains why rendering and retained-admission requirements
  differ; it does not make retained segmentation safe to discard today.
- `derived_missing` is not an existing fast typing mode: commands reject it
  with recovery-required, structural operations also guard it, and maintenance
  recovery has a bounded profile. Simply evicting shards or ignoring the flag
  cannot implement the proposed separation.
- W stages candidate edit, complete frame, then explicit commit. SourceBinding
  enters the journal. The publish boundary must continue to prevent exposing
  new text with old frame/caret state and preserve the old state on failure.

Audit outcome: there are two distinct separation scopes. Reusing validated
configuration is narrower but leaves full changed-text derivation intact, so
it must not be sold as the typing fix. The substantive design direction is to
separate accepted authored state from optional retained-optimization facts,
while deriving/validating the exact visible frame before atomic publication.
That is an architectural contract proposal, not approval to skip validation.

Required design obligations before implementation: define proof of valid new
text and grapheme/ownership boundaries without requiring all retained shards;
bind each derived set to source/provider revision; specify every ordinary,
structural and composition command when retained facts are absent; preserve
rejection/rollback, source binding and receipt semantics; define honest report
semantics; and demonstrate that this path does not rebuild the same full facts
under another name. Repeated missing-facts recovery per key is a failed design.

No product edits, builds, benchmarks or browser interaction in this audit.
Verification is targeted producer/consumer source inspection and document diff
review; no new timing or correctness PASS claim. Unknown: whether the proposed
new admission contract can meet physical responsiveness while preserving all
required semantics. Physical owner acceptance remains NOT PASSED. The table
and obligations complete this discovery request; the architectural design is
the next reviewable deliverable, not another minor optimization or ready trial.

### Authored-state typing path: reviewable design (2026-10-05)

Owner requested starting the detailed design after the dependency audit. This
section is the proposed architectural contract, not implemented behavior or
performance evidence. Single-room Planning Partner, Core/Editor owners,
execution IDs N/A. Scope is the existing plain TextBlock profile and same
visible painter/geometry, with physical held typing and deletion as acceptance.
DOC, tables, nested nodes, new pagination behavior and persistence are outside
this slice. Keep the failed candidate and user drafts available for comparison.

#### Decision and state ownership

Introduce an isolated product editing path, rather than teaching legacy
`cold_session::Session` to pretend missing shards are complete. The old retained
runtime and its cold/structural/QA contracts remain intact as reference code.
Do not reuse its `derived_missing` switch for this path. Do not merge or replace
the public default until compatibility and physical acceptance are satisfied.

The proposed product state has three separately owned components:

1. ValidatedContext: privately created by full font/policy validation, with an
   immutable owned configuration and exact identity. Sharing this internal
   object reuses validation; accepting a caller-supplied digest does not.
   Font/script/language/feature/profile changes create a new context. Mutable
   shaping-plan caches cannot change the validated configuration.
2. AuthoredRevision: owned source text, authored span IDs/ranges, paragraph
   defaults, scalar-to-UTF16 offsets, grapheme boundaries, revision and source
   binding. This contains enough information to validate/edit without retained
   glyph shards. An owned flat source is acceptable for the bounded prototype;
   account for copies and O(n) scans explicitly rather than adding another tree.
3. DisplayFrame: exact layout, glyph geometry, caret/selection and source for
   that authored revision and width. Existing display shaping and line-end
   layout remain the reference. Existing exact-input shape reuse can assist;
   it is never required for correctness. No stale frame is published with new
   text and no optimistic native-text rendering is introduced.

Retained optimization facts are absent in the first prototype. They are not
rebuilt in the background or before the next edit. Any later optional cache
needs its own source/context validity proof. This deliberate baseline tests
whether the product editing path can stand without the previous obligation.

#### One replacement transaction, without retained derivation

1. Check live session/candidate ownership, exact expected revision, composition
   state, safe integer limits, valid range and anchor ownership. Check both edit
   endpoints against the current authored grapheme index, not display carets.
2. Construct candidate text and spans, preserving owner IDs/remapping rules.
   Build a scalar/byte/UTF16 index in one pass. Retain the existing 8,192 UTF16
   product source cap for comparability; do not truncate user input or change it
   into a new product promise.
3. Validate candidate span order/coverage/identity, allowed Unicode/scripts,
   controls, defaults, resolved language/style/font routes and font coverage.
   Run the same ICU grapheme semantics over candidate source and validate span
   boundaries. Initially scan the whole candidate where context can propagate;
   no unproven local grapheme shortcut. Text-dependent validation still runs.
4. Build the exact display frame with the existing display provider, width and
   line-final shaping checks; reject missing glyphs, invalid facts or layout
   failure. No retained unsafe-concat flag generation, ICU line-break array,
   shard construction, retained-fact serialization/hash or cold-session rebuild
   is performed merely to prepare future edits.
5. Return a prepared candidate, not a visible commit. The TextBlock bridge
   validates the complete node and IDs. At commit recheck the base revision;
   publish source, frame, caret mapping and history together. On error or stale
   commit dispose candidate and retain original source/frame. No partial state.

This is not O(1) or fully incremental: whole-source copying/grapheme checks,
changed-paragraph display shaping/layout, frame allocation and painting remain.
The hypothesis is removal of an entire retained reconstruction obligation,
not elimination of all work proportional to text length. If remaining costs
still fail held input, this design has not met product acceptance.

#### Operations and identity when no retained facts exist

| Operation | Required behavior |
| --- | --- |
| Insert/delete/replace/paste | Use the replacement transaction; commands never invoke retained recovery. Multi-line paste stages all affected explicit paragraphs under one bridge commit. |
| Enter/join/range across explicit lines | Split/combine authored ranges and preserve/remap IDs under existing bridge rules; validate affected authored candidates and frames atomically. Do not delegate to legacy shard-dependent split/join. |
| Composition | Keep base authored revision/frame; each provisional replacement derives from that base, not the previous provisional text. Commit once; cancellation restores base. Preserve current node-switch resolution. |
| Move/select/hit-test | Query only the published matching frame. Validate returned offsets against the authored coordinate contract; do not use an old frame after revision change. |
| No-op/reject/dispose | Preserve documented wrapper revision semantics; rejection publishes nothing. Dispose releases candidates/resources; old immutable frames remain readable where currently promised. |
| Width change | Rebuild display frame; do not pretend authored text changed or revalidate unchanged provider bytes. |

Session identity is independent of the numerical revision; old-session commands
cannot become valid after another session starts at zero. Use a separate opaque
handle domain for the new path, checked safe integer counters and explicit
candidate lifecycle. Do not manufacture legacy Rust receipts. Retain a
versioned source-binding derivation for the journal (initial source identity,
then prior binding plus exact command/revision); document its namespace and
never present a chained binding as a raw-text hash. No new persistence or Undo
claim. Prototype integration uses a separately named runtime adapter through
the existing Core adapter boundary, not an in-place public ABI substitution.

Report the new execution mode and actual scans/copies/provider work honestly.
Legacy coldSummary/factsDigest are not fabricated as zero or cached success.
They belong to the old API; a versioned new report states retained facts absent.
This reporting/handle separation is part of the architectural change to review.

#### Correctness and stopping proof

Reuse current display functions and reference frames. For commands admitted by
both paths compare text/spans, exact glyphs, line ends, placement, caret and
selection, excluding only declared identity/work namespace differences. Keep
known expected fixtures so reference agreement is not the sole oracle.
Test stale revisions, ambiguous ownership, invalid scalars/scripts, font
coverage, combining marks, cross-span boundaries, rejection rollback, compound
edits and composition. Legacy rejection caused solely by inability to construct
retained shards is NOT automatically a text-invalid result: classify it
explicitly under the new contract; do not silently expand script/style support.

Assert the new path never calls legacy apply/fallback/derive/recovery, including
after many consecutive edits and structural operations. Forced empty optional
caches must preserve correctness. No permissive 'always valid' test adapter.
Before physical comparison, verify full-frame parity and failure atomicity on
the fixed failed corpus and sequence, without a new broad benchmark campaign.

Then supply a separate production trial with matching font/width/corpus and
minimal optional recording. Owner held input and Backspace remain decisive.
No queue-growth or responsiveness PASS may come from Node parity tests. If the
baseline is still visibly slow, stop this design for review; do not silently add
Worker batching, stale pictures, extra cache projects or broaden the scope.

Design-source checks: current product fallback/source checks, derive validation,
frame provider/layout, wrapper prepared commit and TextBlock bridge node commit
were inspected. No runtime mutation, build or timing experiment in this design
step. The remaining unknown is performance of the specified authored-only path;
neither safety of an implementation nor physical usability is established by
this specification. Written implementation breakdown follows design review.

### Authored-only implementation in progress (2026-10-05)

Owner authorized implementation after design discussion. Product Implementation
Agent, inline execution IDs N/A, routine risk, bounded Core/Editor trial;
physical acceptance remains NOT PASSED. Core base 0ef3a78, isolated branch
codex/authored-typing-20261005 at FlowDoc-dev/20261004/flowdoc-authored-core.
The failed 4022 trial and its drafts remain untouched.

Implementation breakdown and proof budget:
1. Factor shared authored validation from retained derivation. Test identical
   text admission, grapheme/span checks and absence of line/shard shaping work.
2. Add a separate authored runtime with private validated context, replacement,
   structural and composition support; preserve atomic candidate publication.
3. Reuse exact display/layout through an opt-in adapter; compare complete
   frames and rejection behavior on the recorded long Thai sequence.
4. One whole-change review, targeted affected tests/typechecks, then a separate
   production trial for owner physical typing. No automatic usability PASS.

Document budget: this existing record only. Evidence: named source tests,
recorded test results and separate browser trial; no map promotion. Provider
configuration is immutable; scalar/grapheme validation remains O(n). No retained
fact reconstruction, export, persistence, tables or default-runtime replacement.
Pre-flight: validator returns source/spans/graphemes to authored runtime; runtime
projects the same display-source contract but versioned authored work reports.
Display consumers must not require legacy receipts or coldSummary. Existing
bridge prepared-commit boundary remains the publication boundary.

### Authored-only fixed-width candidate (2026-10-05)

Implemented opt-in Core authored runtime and isolated Editor trial; not promoted
as the default and physical acceptance remains UNKNOWN / NOT PASSED.

- Shared authored validator performs scalar/script/font-route/coverage and ICU
  grapheme admission without retained shaping, line-break derivation or shards.
- Private validated context and separate authored handle namespace; replacement,
  provisional composition and direct split/join preserve candidate publication.
- Existing display shaping/layout remains exact. No native-text overlay or
  asynchronous old-frame publication. Report namespace states retained facts
  absent; validation counters cover validation, not total allocation cost.
- Flat source/span reconstruction, full grapheme scan, source binding encoding,
  layout and painting remain. This is not a constant-time typing claim.

Proof: 135 Rust release tests passed. Initial debug-suite run was stopped after
long-running stress tests; it is not counted as PASS. The complete release run
replaces that attempt. Five final authored WASM tests passed, including the
3848-UTF16 corpus at the trial's 432pt width, 92 appended Thai characters and 76
Backspaces with exact visible-frame parity after all 168 edits. Reference
fixture and no-legacy-dependency checks passed. The six-file TS acceptance run
passed 65 tests (including those five before the final width alignment), with
60 unchanged bridge/reference/reuse/width checks. Core, WASM package and Editor
typechecks and production trial build passed. These are correctness evidence,
not physical responsiveness evidence.

Fresh reviewer found composition admission still consulting shaping-cluster
carets: added failing `ffi` boundary-2 composition test, removed that gate, and
verified green. Authored grapheme endpoints now govern composition admission.
No atomic publication or retained-recovery defect was found in that review.

Ruling: the 432pt physical candidate is bounded to fixed-width typing; do not
claim the entire design complete. Existing bridge resize and some structural
paths recreate line sessions, revalidating context and replacing source
bindings. Width-only context reuse is an open design gap before broader
integration, not a prerequisite for testing the fixed-width typing hypothesis.
Cost if deferred incorrectly: expensive resize/structural operations and binding
changes outside this trial's ordinary typing path. No default promotion.

Browser smoke: separate 4023 page loaded A=3848/B=25 UTF16 without alerts;
Thai/Latin typing, Enter, Backspace and A/B switching succeeded. Automated input
is not physical held-key evidence. Reset only this agent-created candidate page
to the fixed corpus after smoke; failed 4022 user draft untouched.

Candidate URL: http://127.0.0.1:4023/text-block-authored.local.html .
WASM SHA-256: 13da11941a04ba84c1576f35407ee4a5b6637d76e21fae24934d0ce1e4b068d2.
Build command: Core package `npm run wasm:build:authored-session` (verified).
Screenshots/logs live under FlowDoc-dev/20261004/profiling; retained source tests
and isolated commits are the durable correctness locators. No system-map update,
new registry, persistence, export, table or pagination claim.
Next acceptance: owner physical held typing and Backspace in the new page.

Candidate commits: Core `12e5fe3` on `codex/authored-typing-20261005`;
Editor `9b0fe6f` on `codex/authored-typing-trial-20261005`. Both isolated
checkouts clean after moving this run's logs to `profiling/authored-20261005`.
Neither candidate was merged or pushed. Broader design remains partial;
fixed-width physical-trial preparation is complete.

### Owner physical authored-path capture: responsiveness fails (2026-10-05)

Owner performed the new 4023 trial and requested inspection; no repeat needed
for data completeness. Evidence Reviewer, inline IDs N/A. Captured the result
read-only from the existing page without reload, typing or draft mutation.
Saved full 478777-character JSON to
`FlowDoc-dev/20261004/profiling/authored-owner-physical-20261005.json` and computed
`authored-owner-analysis-20261005.json` beside it. No product edits or promotion.

Capture integrity: 237 inputs (101 insertText, 136 deleteContentBackward), 235
repeat keydowns, 3591 rows, zero dropped rows. Each input ID has one Rust edit,
Core edit, commit and second-rAF measurement. All 238 route marks (initial
activation plus 237 edits) are authored-only/1. No old fallback route appears.
Page reports no alerts; final A/B lengths 3813/25 match capture metadata.

Measured results (milliseconds): Rust edit median 1.2/p95 1.6/max 3.5; complete
Core edit median 14.7/p95 21.3; input-to-commit median 33.6/p95 43.8. Repeated
keydown event timestamps advance about 30.1ms, while delivered events are
47.1ms apart during insertion and 45.7ms during deletion (medians, excluding
initial repeat delay). Keydown age rises to 1876.4ms for insertion and 2282.3ms
for deletion. This shows processing falls behind this held-input stream even
though authored editing itself is now small.

Second-rAF median 2057.1/max 4128.8ms is a scheduling-delay signal, not proof of
pixel presentation time. Long tasks reach 1795ms; that interval contains 38
inputs, and the 1740ms interval contains 36. Do not misattribute either to a
single Rust edit or one frame rebuild. Keydown-to-input-entry median 8.3ms and
input-to-commit minus Core-edit median 18.5ms show material work outside the
Rust command; these gaps do not alone identify React, browser layout, SVG,
garbage collection, or input-host work as the root cause.

Decision: fixed-width candidate does NOT meet held-typing responsiveness
acceptance. Data is usable and sufficient to retain this failure; do not ask
owner to repeat merely to obtain the same evidence. Removing retained
reconstruction succeeded as a mechanism, but did not achieve product readiness.
As the design's stopping rule requires, stop this prototype for review rather
than silently adding batching, stale frames or a new architecture. Next bounded
discovery should identify the remaining input/event/commit cost and presentation
starvation before choosing another change. Physical feedback on perceived
behavior can supplement these measurements but is not required to see backlog.

Verification: parsed complete capture; checked input-ID coverage, operation and
route counts, per-burst timestamp intervals and long-task containment; source
inspection confirms Core stage ends before the React/DOM commit marker. No
runtime test suite rerun was needed for this read-only evidence assessment.

### Bounded SVG commit-cost trial (2026-10-05)

Owner authorized risk-controlled measurement after the physical failure above.
Inline Product Implementation Agent / Evidence Reviewer; execution IDs N/A.
Owner: Editor. Scope: identify one remaining measured cost, opt-in paint change,
and separate physical trial. Core, layout contracts, persistence, pagination,
tables and export excluded. Routine risk; physical acceptance remains pending.
Existing record is the work authority and sole documentation update; no map
promotion or new registry. Original 4023 user draft and capture preserved.

Discovery on separate 4024/4025 diagnostic pages found same-color commands joined
into one SVG path, forcing native path parsing for the entire paragraph on each
edit. After 40 appended characters, both pages had 3888 UTF16 source units and
identical viewBox, color, concatenated path length 6117763 and FNV32 signature
2661428956; baseline had one path, candidate 49. These signatures establish
ordered path-data agreement, not raster equivalence.

Change: Editor c703581 adds preserveCommandPaths opt-in to svgFrameCache; default
behavior stays unchanged. Trial 4026 enables it, retaining separate command
paths so unchanged lines need no new path attribute. Source, selection and Core
remain on the previous authored candidate 12e5fe3. Diagnostic entrypoints record
native SVG path setter and React timing; the physical entrypoint excludes that
extra instrumentation and uses the existing physical capture only.

Paired automated 20-character repeated comparison (milliseconds, medians):
SVG path setter 14.6 before / 0.1 after; input-to-commit 38.5 / 25.9; Core edit
18.8 / 22.2. Input-to-commit p95 48.0 / 32.6. The first pair had substantial
warmup/environment variation, so retain both pairs and do not generalize these
numbers into a physical held-key PASS. Raw captures: profiling/svg-detail-before,
svg-detail-after, svg-detail-before-repeat and svg-detail-after-repeat, all with
suffix -20261005.json under FlowDoc-dev/20261004.

Proof: regression test failed with one merged path, then passed after the
opt-in change. Four affected suites passed 13 tests (SVG cache, paint fingerprint,
surface input and surface session). Editor typecheck and physical production
build passed; staged diff check passed. Separate 4026 browser loaded, one Thai
character changed A length 3848 to 3849 and Backspace restored 3848. Automated
input is smoke evidence only. Source review found no isolated-trial blocker.
Review risk before broader promotion: splitting overlapping contours into
separate paths may affect fill/antialiasing; geometry concatenation is not pixel
proof. Inspect Thai marks and line boundaries during physical use; broader
raster coverage is deferred, not passed. Existing resize/structural reuse gap
remains outside this fixed-width trial.

Candidate: http://127.0.0.1:4026/text-block-paint.local.html . Screenshot and
logs: profiling/paint-ready-20261005.png, svg-command-tests.local.log,
paint-typecheck.local.log and paint-build.local.log. Editor isolated commit
c703581 is not merged or pushed. Next: owner presses Start, holds Thai input and
Backspace in A, then Stop; inspect captured event backlog and perceived behavior.
Status: preparation PASS; physical responsiveness UNKNOWN / NOT PASSED.

### Owner physical paint trial: usable improvement, not final acceptance (2026-10-05)

Owner tested 4026 and reports typing is now smooth enough to use, but still not
at the desired quality. Preserve this as partial acceptance of improvement;
not product readiness or full typing acceptance. Inline Evidence Reviewer,
execution IDs N/A. No product changes, map promotion or additional test request.
Existing canonical record remains the sole status update.

Read captured UI without reload or draft mutation. Saved complete 768992-character
JSON, 5754 rows, to FlowDoc-dev/20261004/profiling/paint-owner-physical-20261005.json;
computed paint-owner-analysis-20261005.json beside it. Capture has 382 inputs:
190 insertText, 192 deleteContentBackward; 379 repeat keydowns, zero dropped
measurement rows. Each input ID has exactly one Rust edit, Core edit, commit and
second-rAF record. All 383 route marks remain authored-only/1. Final A/B UTF16
lengths 3846/25 agree with the net two deletions from the initial corpus.

Physical comparison against previous 4023 capture (milliseconds):
- Input-to-commit median 33.6 -> 18.1; p95 43.8 -> 23.2; current max 33.5.
- Maximum keydown event age 2282.3 -> 48.7; current median 2.9, p95 29.4.
- Long-task maximum 1795 -> 70; current capture contains 11 long tasks.
- Second-rAF median 2057.1 -> 76.2; current p95 131, max 228.5. This measures
  scheduling delay, not presented-pixel latency.

Three physical bursts contain 108 and 82 insertion events, then 192 deletions.
Generated repeat cadence median 30.1ms in all bursts; delivered medians 29.4,
29.3 and 30.0ms, excluding the initial repeat delay. Burst maximum event ages
38.9, 48.7 and 18.6ms; final ages 18.2, 0.5 and 7.9ms. Thus this capture does
not show the prior accumulating seconds-long input queue. It still shows short
stalls and scheduling variability; this is one physical run, not a universal
latency guarantee. No dropped measurement rows is not independent proof of all
possible hardware events or source correctness.

Remaining measured cost: Core edit median 14.8ms, frame-build 12.8ms (including
layout 9.7 and freeze 2.4), Rust edit 1.1ms. Commit minus Core median is now
3.1ms versus 18.5ms previously; keydown-to-input entry remains 8.4ms versus
8.3ms. Nested stages overlap and must not be summed. Next bounded discovery
should examine layout/frame preparation and the pre-input gap before selecting
another change. Do not remove correctness checks or defer visible truth solely
to improve these numbers. Thai raster overlap and broader structural/resize
coverage remain unverified as recorded above.

Verification: parsed full capture, checked per-input stage coverage, operations,
route count, burst cadence and age recovery; preserved user feedback verbatim in
meaning. No runtime suite rerun for read-only capture analysis. Status: measured
improvement supported; owner says usable but insufficient; full acceptance open.

### Owner-authorized local main integration (2026-10-05)

Owner explicitly requested main integration of the improved baseline. Inline
integration / Project Control Steward; execution IDs N/A. This accepts landing
the current bounded implementation, not completion of latency work or broader
product readiness. Core main fast-forwarded from 2f0f1e4 to 12e5fe3; Editor main
fast-forwarded from d1a9670 to c703581, including prerequisite commits. Both main
checkouts were clean before integration; no conflicts or unrelated changes.

Integration found the authored trial adapter depended on the isolated sibling
folder name. Replaced those two imports with the already exported package
subpath @flowdoc/text-engine-rust-wasm/authored-session. No runtime semantics,
default activation or typing algorithm changed. The authored runtime and command
path painting remain explicitly opt-in; main integration is not default rollout.

Fresh main-checkout verification: Core six affected authored/bridge/frame/width
suites passed 60 tests. Editor typecheck passed; five surface/cache/fingerprint/
input/pointer suites passed 15 tests; production paint-trial build passed using
the main package dependency. Main initially lacked installed test tools; npm ci
--ignore-scripts restored each lockfile environment, with no tracked lockfile
change. Prior Rust correctness evidence is retained, not claimed as a fresh run.
Editor portability fix committed after checks. Final diff whitespace check passed.

Existing 4026 physical trial server, owner draft, and isolated checkouts retained
for continued comparison. No push or branch/worktree deletion. Existing physical
assessment remains usable improvement, insufficient final quality. No system map
promotion. Next work remains bounded layout/frame and pre-input cost discovery.
`Editor main terminal commit: 191a4eb; Core main terminal commit: 12e5fe3.`

### Bounded layout discovery and rejected freeze experiment (2026-10-05)

Owner requested continuation of the recommended layout/frame discovery after
main integration. Inline discovery, then bounded reversible experiment; Core
owner, execution IDs N/A, routine risk. Main baseline remains Core 12e5fe3 and
Editor 191a4eb. Existing isolated Core checkout reused on new branch
codex/frame-freeze-cost-20261005; no changes to main or the physical browser.
Scope excluded layout-policy changes, stale frames, pagination and export.

Reproduced 80 authored edits (40 Thai insertions, 40 deletions) on the same
3848-UTF16 corpus and 432pt width using Node CPU sampling at 100 microseconds.
This is instrumented CPU discovery, not browser latency or physical acceptance.
Initial stage medians: layout 12.58ms, freeze 3.59ms, frame-build 17.84ms.
Sampled inclusive totals: prepareWrappedLines 963.9ms, shapeClusters 868.7ms,
shape provider/cache path 741.8ms; self totals freeze 287.9ms, shapeClusters
126.3ms, garbage collection 171.1ms. Nested totals overlap. Evidence points to
provider shaping/conversion as the larger layout cost, not line-fit iteration
alone. The full-paragraph request changes on each edit; existing exact-text
shape cache cannot reuse that request. Reusing shaped prefixes would require
separate correctness investigation and must not be assumed safe for Thai.

Tested one smaller hypothesis: replace recursive Object.values allocation in
freeze with own-property traversal while keeping recursive freezing. Four
suites including the probe passed 13 checks, but freeze median was 3.94ms
versus 3.59ms, frame-build 17.55ms versus 17.84ms. This single noisy instrumented
comparison does not support a useful improvement. Rejected and reverted the
entire source change; isolated Core is clean and identical to main. No new
physical trial requested and no performance fix promoted.

Local reusable evidence under FlowDoc-dev/20261004/profiling:
layout-freeze-before-20261005.json, layout-freeze-after-20261005.json,
layout-discovery-summary-20261005.json (initial sampled attribution),
layout-freeze-after-20261005.cpuprofile, frame-freeze-rejected-20261005.patch,
and layoutDiscovery.local.test.ts. The probe source was moved out of candidate
tests after the experiment. No persistent product or test changes remain.

Next bounded investigation: split the authored shape-provider roundtrip into
actual shaping, serialization and JS decoding costs before selecting any
contract-preserving optimization. Avoid another freeze micro-optimization or
new cross-edit cache without evidence. Discovery complete; implementation
improvement not established. Physical baseline and remaining acceptance unchanged.

### Direct shape serialization candidate (2026-10-05)

Owner authorized continuation of the shape/transfer investigation and bounded
optimization. Inline Core implementation and Editor trial preparation; routine
risk, execution IDs N/A. Existing record remains work authority. Allowed scope:
shape result transport preserving all facts, errors and revision checks, tests,
rebuilt authored WASM, and isolated physical trial. No shaping policy, prefix
reuse, batching, layout semantics, persistence or default activation changes.

Discovery: 80 warmed whole-paragraph WASM shape calls measured median 7.89ms
and p95 9.18ms; separate JSON.parse median 1.08ms. Native diagnostic comparator
(100 iterations) averaged 10.34ms for shape_provider including serde Value
construction, 2.17ms for serializing that Value, and 1.71ms for shaping-only
script runs. Native comparison is diagnostic, not browser latency and not an
exact subtraction of all overhead. It supports avoiding per-glyph JSON maps.

Core candidate 2762bb9 on codex/frame-freeze-cost-20261005: typed Serialize
ShapeFacts/ShapeGlyph replace intermediate per-glyph maps. Authored export emits
JSON directly; old product export retains Value compatibility. Field names,
integer values, glyph order, script runs, UTF16 offsets, limits, font checks,
handle/revision validation and Blocked envelope preserved. No shaped prefix
reuse or deferred visual truth. Rebuilt authored WASM SHA-256:
a737deb8cdab6b2402a0cff3f7308170a94f3fe32302e1557e1690995ac2bac5.

TDD: new wire comparison first failed because the direct wire function was
absent; implementation then passed. Initial test incorrectly required control
characters to shape successfully; corrected it to require the same rejection
as the existing provider. Native affected product/authored suites pass 12 tests.
Seven TS suites passed 41 checks including one local timing probe (40 retained
correctness tests); existing authored test compares all 168 edit frames with
legacy output. Fresh review found no blocker and requested coverage of the
candidate's legacy export too. Added that parity to authoredShapeWire.test.ts;
it passes against unchanged legacy WASM for both candidate exports, Thai marks,
mixed scripts, escaping, input limits, stale and disposed handles. Core and
WASM-package typechecks pass. A temporary probe caused one initial typecheck
failure; it was moved to profiling and clean candidate typecheck rerun passed.

After change, same whole-paragraph probe median WASM cost 3.21ms, p95 4.19ms;
JSON.parse median 1.06ms. Browser automated 20-edit samples show layout median
31.8ms baseline / 18.0ms candidate and input-to-commit 63.2 / 47.0ms, but all
stages were substantially slower than the owner's physical run and ordering/
warmup was not controlled. Do not compare those browser numbers to physical
18.1ms or call this physical acceptance. Raw captures retained; new owner trial
is the acceptance step.

Editor trial uses prior paint baseline plus heading/entry/config only; typecheck
and production build pass. New URL http://127.0.0.1:4027/text-block-shape.local.html
loaded correctly and accepted 20 automated insertions with no dropped timing
rows. Reset only this agent-created page to corpus for owner. Existing physical
4026 draft/capture and main baselines preserved. No merge or push this turn.

Local evidence under FlowDoc-dev/20261004/profiling: shape-wire-before-20261005.json,
shape-wire-after-20261005.json, shapeWire.local.test.ts, shape-cost-probe-20261005.rs,
shape-browser-first-20261005.json, shape-browser-baseline-20261005.json and
shape-ready-20261005.png. Temporary diagnostic code removed from candidate.
The shared-source change is covered by native tests and both exports in the new
authored artifact; legacy product artifact is intentionally unchanged for reference.
Status: candidate correctness/preparation PASS; physical responsiveness UNKNOWN.
Next: owner held Thai input and Backspace on 4027, compare backlog and perceived
response against the retained 4026 baseline. Broader raster and resize gaps remain.

### Owner physical direct-wire trial accepted as provisional baseline (2026-10-05)

Owner tested 4027 and says it is usable and can be used for now provided this
responsiveness can be maintained. Treat this as acceptance of the current
fixed-width typing baseline, with consistency still a condition; not evidence
for every document size, editing mode, device or duration. Inline Evidence
Reviewer; IDs N/A. No runtime changes or further optimization in this assessment.
Candidate Core 2762bb9 / Editor 74ba3b6 remains separate from main.

Read-only capture saved without reload or draft edits to
FlowDoc-dev/20261004/profiling/shape-owner-physical-20261005.json (1316459 characters,
9839 rows), with shape-owner-analysis-20261005.json alongside. Duration 30.22s;
655 inputs: 326 insertions and 329 backward deletions, 651 repeats, zero dropped
measurement rows. Every input ID has exactly one Rust edit, Core edit, commit,
and second-rAF record. All 656 routes are authored-only/1. Final A/B lengths
3845/25 agree with net three deletions; no UI alerts. This coverage does not
independently prove all hardware events or all source/caret correctness.

Physical comparison with retained 4026 capture (milliseconds):
- Input-to-commit median 18.1 -> 13.7; p95 23.2 -> 18.9; max 33.5 -> 25.1.
- Keydown event age median 2.9 -> 0.7; p95 29.4 -> 5.4; max 48.7 -> 17.6.
- Frame layout median 9.7 -> 5.7; frame build 12.8 -> 8.7; Core edit 14.8 -> 10.6.
- Second-rAF median 76.2 -> 19.5; p95 131 -> 75.4; max 228.5 -> 112.1.
  These are scheduling signals, not actual presented-pixel latency.
- One 51ms long task occurred before typing and contains zero input entries;
  no observed long task during the typing bursts in this capture.

Four bursts contain 228, 28, 70 and 329 events. Generated repeat medians
30.2/30.3/30.2/30.2ms, delivered 30.0/29.8/29.8/30.1ms (excluding initial repeat
delay). End-of-burst event ages 0.5/1.7/2.2/0.4ms. No accumulating input backlog
appears, including the longest 329-event deletion burst. Evidence supports
maintained cadence within this run, not an always-smooth guarantee.

Decision: retain this version as the owner-accepted provisional typing baseline;
stop chasing further micro-optimizations now. Preserve the physical corpus,
capture, commit identities and existing correctness tests as regression reference.
Future affected changes must compare correctness and responsiveness against this
baseline; middle edits, IME, larger inputs, resizing and structural expansion
remain outside this physical capture. Existing raster/resize unknowns stay open.
No automatic default rollout, merge, push or wider readiness/map promotion.
Verification: full JSON parse, per-ID coverage, operation/route counts, burst
cadence and recovery, long-task timing; no runtime suite rerun for read-only
assessment. Owner feedback and evidence now agree on provisional usability.

### Document integration and draft lifecycle (2026-10-05, in progress)

Owner approved continuing the real-document connection and per-node drafts.
Inline Product Implementation Agent; Editor owns changes, Core 2762bb9 is the
unchanged accepted dependency. Execution IDs N/A; routine risk, bounded medium
work. Existing document is sole plan/ledger; no map promotion. Implementation
uses existing isolated Editor checkout on codex/textblock-document-drafts-20261005
from 74ba3b6. Original 4027 built trial and user capture remain untouched.

Goal: reuse the accepted painter/input on eligible plain paragraph TextBlocks in
the document surface, retaining node drafts through focus changes and safe saves.
Existing Backend rich-inline mutation and revision gate remain authoritative.
No schema, Backend semantics, pagination, Columns, rich inline flattening,
durable unsaved recovery, export, or further typing optimization changes.

Architecture: retain drafts keyed by node within the document runtime; only one
active editing session. Route replies by pending request identity, not focus.
Preserve newer draft revisions and current selection. Compare saved node content
before rebasing unaffected drafts after an accepted local mutation; changed
remote content remains a conflict. Shared SVG surface uses authored Core assets
through coreAdapter, with exact Core-produced children sent to existing save.

Implementation sequence (executed inline, user already authorized):
- [x] Draft lifecycle: activeTextBlockIsland.ts, commit runner, runtime mutation
  apply and useActiveTextBlockEditing.ts; regressions in existing hook/runner
  suites for A-B-A, late ack while B selected, newer A typing, rejected/thrown
  saves, conflict, duplicate save and Cancel while pending.
- [x] Document surface: extract reusable input/painter from accepted trial into
  textBlockSurface; connect PaperBlock/PaperTextBlockEditor to unchanged Core
  frame/children. Eligible plain paragraphs only; explicit unsupported boundary.
  Preserve frame on deactivation and use measured layout width. Test source
  admission and rendering boundary; typecheck/build plus browser interaction.
- [x] Review affected changes once, resolve correctness blockers, retain checks
  and commit candidate. Physical typing acceptance remains with the owner.

Proof budget: targeted lifecycle/adapter/render suites, typecheck/build, one
fresh whole-change review, browser A-B-A/save and physical handoff. No full
cross-repository suites or new timing campaign absent an affected-area reason.
Review focus: document identity change; ack after focus switch; rejection and
retry; unsupported styled/atomic content; composition during focus/save. These
are correctness boundaries, not evidence of broad readiness.

Candidate result: Editor fa874cf on the isolated branch above, clean after commit.
Core remains 2762bb9. The production build contains the exact accepted authored
WASM SHA-256 a737deb8cdab6b2402a0cff3f7308170a94f3fe32302e1557e1690995ac2bac5.
No Core/Backend source edits, main integration or push in this slice.

Implemented per-node retained drafts, request-correlated replies, newer-draft
preservation, unchanged-node base advancement after accepted local mutations,
conflict retention, failed/thrown/invalid-response pending release, pending-save
Cancel/duplicate-save guards, and composition gating. Paragraph input publishes
Core-produced inline children with their IDs rather than rebuilding from text.
Plain standalone paragraphs use the same SVG surface active and inactive;
unsupported roles/styles/atomic content and embedded descendants keep existing
behavior. Browser width uses untransformed ResizeObserver content measurements.
Only the active surface retains a Core editing session; inactive painted frames
are retained. Inactive dirty nodes show Unsaved. This is not many-node evidence.

Fresh review identified an acknowledgement clearing a still-active composition
and loss of keyboard activation/reordering in the new block wrapper. Both were
reproduced with failing regressions and fixed. Expanded affected checks caught
an over-broad selection preservation change: generic rich-inline mutations still
select their targets; only replies to pending drafts preserve current selection.

Ruling: the existing paper flow clips long content. Local browser proof showed
1443px content in a 936px viewport with overflow hidden. The bounded integration
now permits scrolling inside paper flow containing the new surface and follows
the active caret. This prevents clipping without claiming automatic page
continuation. Afterward 1467px content was reachable with overflow auto; typing
at offset 3848 advanced to 3852 and scrolled to the caret. Actual pagination,
page count, nested layout and export alignment remain deferred.

Verification PASS: 18 affected Editor suites / 90 tests, typecheck, production
build, diff whitespace check. Suites cover island/hook/commit lifecycle,
draft rebase/source admission, paper rendering, surface session/input/SVG cache,
render partition, Backend integration, v4 reads, compatibility and boundaries.
Build retains non-blocking large-chunk/static-and-dynamic-import warnings.
Dependencies were installed in this isolated Editor checkout (no longer sharing
the experiment node_modules junction) and bound locally to the accepted Core;
Vite/Vitest resolve the installed Core real path. Observed tooling: Vite 8.3.2,
Vitest 4.1.11. Package/lockfile dependency declarations were not changed.

Browser proof uses an isolated unchanged local Backend process on 4038 with its
opt-in blank-authoring seed, not an owner's existing document. Created two plain
blocks, typed Thai plus explicit break, switched A-B-A preserving both drafts,
saved A, cancelled only B, saved B, and reloaded to read both saved values back.
Keyboard Enter activated an inactive block; sequential input appended correctly.
Long-corpus check used 3848 characters from the accepted trial corpus. This
confirms lifecycle/visible integration, not physical held-key responsiveness.

Prepared production preview (no hot reload):
http://127.0.0.1:4028/documents/blank-authoring-trial/design
Preview session 43056; isolated Backend session 67442. A contains the unchanged
3848-character corpus, B a short saved sample. Screenshot:
FlowDoc-dev/20261004/profiling/document-surface-ready-20261005.png.
The trial Backend stores packages in memory: reload can retrieve saved content
while that process lives; restart durability is not claimed. Unsaved drafts stay
in the current document runtime only. Original 4027 built trial/capture untouched.

Status: bounded implementation/checks PASS; owner physical acceptance UNKNOWN.
Next: owner tries held typing/deletion, A-B-A and Save/Cancel in the document
surface. Stop optimization until that feedback; no automatic main promotion.
Project Control record checks: source-docs:text-block 4 files / 18 tests PASS;
diff whitespace check PASS. No generated record projection changed.

### Early insertion owner feedback and reusable glyph trial (2026-10-05)

The owner rejected early insertion responsiveness in document preview 4028:
position remained correct, but insertion in the first three lines stalled.
Returning to unchanged standalone 4027 reproduced the failure with physical
typing. Capture `FlowDoc-dev/20261004/profiling/shape-early-insert-owner-20261005.json`
contains 302 inputs (163 insert, 139 backward-delete), no dropped diagnostic
rows. Median repeat timestamp spacing was 30.1ms, input-to-commit 59.5ms,
SVG build 38.2ms, Core edit 13.3ms. Keydown timestamp age peaked at 5616ms;
long tasks peaked at 4711ms. Timestamp age and second-rAF are diagnostic signals,
not hardware-to-pixel latency. Earlier tail-typing acceptance does not establish
early-insertion acceptance. Both owner drafts and the full capture were saved
locally; neither existing browser tab was reloaded or edited by the agent.

Owner approved step 1 only: reuse glyph outlines and change placements in the
standalone trial before returning to document integration. Inline owner: Editor;
role: Product Implementation Agent; execution IDs not applicable. Routine,
bounded scope: painter/cache, opt-in trial and separate build, related tests,
this existing record. Core, Backend, document surface, input queue/scheduling,
save lifecycle, and main integration are outside this correction. Acceptance:
unchanged Core geometry/text/caret semantics, affected checks and browser
inspection, then owner physical insertion/deletion feedback. Proof budget:
focused renderer/input/session tests, typecheck, trial build, bounded browser
inspection, one fresh review and repairs. No new Work or map promotion.

An initial SVG-use implementation reused 68 outlines for 3681 placed glyphs,
but per-glyph DOM work remained expensive. It was replaced before delivery.
The candidate retains only currently used raw outlines and Path2D objects,
draws Core placements into one device-pixel-scaled canvas per surface, and keeps
the existing SVG selection/caret/hit geometry and input/session logic. Trial-only
opt-in: `?painter=glyphs`. The document surface remains unchanged.

Fresh review found short-block canvas stretching at narrow widths and selection
layer ordering. Repairs bind canvas aspect ratio to the SVG viewBox and place
glyphs above selection as before. At a 480x700 browser viewport, A canvas/SVG
bounds both measured 389.600006 x 856.650024; B both 389.600006 x 32.462502,
independent of the body's minimum height. Viewport override was reset.
Reviewer confirmed both repairs with no remaining scoped finding.

Checks: 5 affected suites / 16 tests PASS; typecheck PASS; separate production
trial build PASS; whitespace check PASS. Build warnings concern config import
extension and mixed static/dynamic import. Core WASM SHA256 remains
`a737deb8cdab6b2402a0cff3f7308170a94f3fe32302e1557e1690995ac2bac5`.
Browser insertion at offset 160 of `กิ้` produced the expected complete text,
selection 163, matching SVG accessible text, and no alert.

Automation-only sample: scene preparation median 0.6ms, canvas command issue
3.8ms, input-to-commit 40.1ms. The sequential-input tool hit its deadline after
17 inputs; second-rAF remained high. These observations neither establish
physical throughput nor a controlled comparison with the owner's prior run;
canvas command issue does not measure completed raster/presentation.
Evidence: `glyph-canvas-browser-sequential-20261005.json` and
`glyph-canvas-narrow-geometry-20261005.json` in the same profiling directory.
Status: candidate checks PASS, owner physical acceptance UNKNOWN. Next: owner
tests early/middle/tail insertion and held deletion on standalone 4029. Do not
advance to queue/scheduling work or document integration without that result.
Candidate Editor commit: `b9d729e`. Trial URL:
http://127.0.0.1:4029/text-block-shape.local.html?painter=glyphs
Preview process session: 3875. Original 4027 baseline and 4028 document drafts
remain open. Project Control text-block source-doc checks: 4 files / 18 tests
PASS; no generated projection or document map changed.
