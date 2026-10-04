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
