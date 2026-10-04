# TextBlock single-surface design

## Authority Boundary

Owner: FlowDoc Project Control. This is a proposed cross-repository design
derived from the owner's approved discussion on 2026-10-04, including the
multi-node rendering constraint. It is not implementation Evidence, a passed
WYSIWYG gate, a DOCUMENT_MAP update, or permission to merge product main.
Written design review is pending. Historical cancelled execution stays closed.

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
