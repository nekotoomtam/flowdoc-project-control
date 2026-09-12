# Core Incremental Typing Feasibility Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans`
> to implement this plan task-by-task inside one real FlowDoc Core WORK task.
> FlowDoc PLAN/WORK rules override the generic internal-subagent option: the WORK task
> edits Core; PLAN reviews, accepts, records, and integrates.

**Goal:** พิสูจน์บน FlowDoc vNext Text Engine จริงว่า common localized typing สามารถ
shape และจัดบรรทัดเฉพาะช่วงที่เกี่ยวข้อง ให้ผลตรงกับ full-layout oracle ทุก revision
และเข้าเกณฑ์เวลาโดยไม่ใช้ browser-shaped text

**Architecture:** เพิ่ม candidate-only provider-owned paragraph state บน MR1 range
Rust/WASM แล้วให้ Core เก็บ paragraph facts และ line traces ข้าม revision การแก้ไขหนึ่ง
ครั้งสร้าง range patch, reflow ทีละบรรทัดจน reconverge และคืน metric row; full oracle
ทำหลัง candidate timing เพื่อพิสูจน์ correctness เท่านั้น รอบนี้ไม่เปิด production binding
และไม่แตะ Editor

**Tech Stack:** TypeScript, Vitest 4, Rustybuzz/ICU4X MR1 range WASM ที่ pin อยู่,
Sarabun Regular ที่ pin อยู่, Node.js 24.15.0 บน Windows x64

**Spec:**
`docs/domains/flowdoc-core-authoritative-incremental-typing-architecture-2026-09-12.md`

## Authority Boundary และ Work context

เจ้าของแผน: `repo-project-control`

เจ้าของ implementation: `repo-core`

Work path: `flowdoc-product-development-resumption > flowdoc-frontend-expert-roadmap`

PLAN task: `01a08a25-13d9-7090-8d91-1c32242988d8`

Core WORK task ที่เตรียมใช้: `01a07584-49dc-7602-b662-6033c1469517`

Phase: `phase-core-text-layout-roadmap`

Checklist item: `incremental-admission` ใน `checklist-core-text-layout-roadmap`

Evidence target: `evidence-core-incremental-admission`

แผนนี้เป็น Project Control canonical implementation plan สำหรับ Gate 1 เท่านั้น
ไม่มี dispatch จากการเขียนแผน ไม่มี Core/Editor product change ไม่มี production
admission และไม่มี map promotion Gate 2–7 ต้องมีแผนของตนหลังผล Gate 1 ได้รับการยอมรับ

## Global Constraints

- เริ่มจาก exact Core source pin
  `4e3b0c9aa4a4d916c78ea5da8e9bac4cffdc4224` ใน worktree ใหม่ ห้ามแก้ retained
  evidence worktree เดิม
- ใช้ MR1 range WASM และ Sarabun assets ที่ repository pin อยู่ ห้ามเปลี่ยน dependency,
  font, WASM ABI, artifact หรือ digest ใน lane นี้
- `productionBinding` และ `mayPublishLayout` ต้องเป็น `false` ทุก candidate result
- full-shape, full-segment, full-layout oracle, canonical serialization และ SHA-256
  ต้องอยู่นอก candidate timed interval
- Core เป็น layout authority เพียงรายเดียว ไม่มี DOM, browser wrapping, Editor overlay,
  React, Backend, save หรือ network code ใน lane นี้
- Common edit set คือ append, backspace, mid-line insert, localized selection replacement
  ไม่เกิน 16 UTF-16 units, terminal Enter split, trailing-LF Backspace merge และ
  contract-level Thai composition revisions
- Candidate ต้อง fail closed ด้วย `full-context-required` เมื่อพิสูจน์ bounded context หรือ
  reconvergence ไม่ได้ ห้ามเดา cluster, grapheme, Thai syllable หรือ break boundary
- ทุก revision ต้องเท่ากับ full-layout oracle แบบ exact สำหรับ line membership, source
  offsets, glyph facts และ explicit-break placement ก่อนนับเป็น valid timing sample
- Node-count/pagination ทั้งเอกสาร, OS IME UI และ Editor key-to-visible behavior อยู่นอก
  Gate 1
- `estimatedRebuiltGeometryLineCount` เป็นเพียงขอบเขตงานที่คาดจาก changed lines สำหรับ
  วาง Gate 3 ไม่ใช่ geometry patch, caret parity หรือ Editor readiness

## Reference environment และเกณฑ์ตัดสิน

WORK บันทึกค่าจริงจากเครื่องที่รันลง artifact ได้แก่ `process.version`, `process.arch`,
`process.platform`, CPU model, logical CPU count, total memory, exact Core commit,
WASM SHA-256, font SHA-256 และ measurement profile ใช้ process เดียวและห้ามรัน test
suite อื่นขนานกับ measured corpus

Corpus ใช้ข้อความ `thai`, `latin`, `mixed` ขนาด 256, 1024 และ 2048 UTF-16 units
แต่ละ case warm-up 5 ครั้งและวัดอย่างน้อย 50 ครั้ง ลำดับ candidate-first/oracle-first
สลับกันเพื่อแยก order bias โดยจับเวลา candidate และ oracle คนละช่วง นอกจากนี้ต้องมี
continuous burst 180 ordered revisions บน session เดียวโดยไม่ reset เพื่อจับความช้า
หรือ retained-state drift ที่สะสมตามการพิมพ์

Gate 1 เป็น `PASS` เมื่อทุกข้อผ่าน:

1. correctness: valid revisions 100% เท่ากับ full-layout oracle; ไม่มี invalid หรือ
   censored sample
2. responsiveness: candidate p95 ไม่เกิน 16.7 ms และ max ไม่เกิน 33.4 ms สำหรับ
   common localized edits ทุก language family/size บน reference environment
3. scaling: p95 ของ size 2048 หาร size 256 ไม่เกิน 1.50 สำหรับ operation เดียวกัน
4. bounded work: accepted localized edit มี context ต่อ call ไม่เกิน 256 UTF-16 units,
   `shapeUtf16 + segmentUtf16 <= 1024` และ `replannedLineCount <= 4`; terminal Enter
   split/trailing-LF merge ยอมให้ `replannedLineCount <= 6`
5. admission: common localized edit อย่างน้อย 95% เป็น `incremental-exact`; fallback
   ทุกตัวมี reason code และไม่มี fallback ถูกนับเป็น timing PASS
6. isolation: candidate advance ไม่เรียก `shapeFull`, `segmentFull`, full layout,
   full-result fingerprint หรือ canonical serialization
7. sustained state: continuous burst 180 revisions มี exact final text/lines, exact oracle
   ทุก revision, ไม่มี session reset และ p95/max ผ่านข้อ 2

คืน `BLOCKER` หาก correctness ต้องพึ่ง full oracle ใน candidate hot path, bounded shaping
ไม่เสถียรสำหรับ common Thai edits, หรือ common cases ยังเพิ่มเวลาตาม unrelated text แม้
implementation ถูกต้องแล้ว คืน `FAIL` สำหรับ bug/test/gate failure ที่แก้ได้ใน lane เดิม
และ `RISK` เมื่อ mechanism ผ่านแต่ environment หรือ corpus provenance ไม่ครบ ห้ามคืน
`PASS` พร้อม RISK ที่ทำให้ข้อ 1–6 ไม่จริง

## File map

| File | Responsibility |
| --- | --- |
| `src/creatorPreview/incrementalTypingFeasibilityContractV1.ts` | Candidate-only edit, state token, patch, certificate, metric และ fallback types |
| `packages/text-engine-rust-wasm/src/creatorIncrementalParagraphProviderV1.ts` | Provider-owned WeakMap state, MR1 range calls, bounded context expansion และ fact splice |
| `src/creatorPreview/layoutFactsV1.ts` | Extract pure cluster conversion and one-line planning from existing full planner without behavior change |
| `src/creatorPreview/incrementalLineReflowFeasibilityV1.ts` | Reflow one line at a time from affected line until exact reconvergence |
| `src/creatorPreview/incrementalTypingFeasibilityV1.ts` | Authentic candidate session, delta validation, paragraph selection, retained facts, result metrics |
| `src/index.ts` | Export explicit candidate contracts/functions; no default-path wiring |
| `packages/text-engine-rust-wasm/src/index.ts` | Export the explicit candidate provider factory |
| `tests/creatorIncrementalParagraphProviderV1.test.ts` | Real MR1 range provider, Thai/Latin/mixed, forgery, bounded work and no-full-oracle tests |
| `tests/creatorPreviewIncrementalLineReflowFeasibilityV1.test.ts` | Full planner parity and reconvergence tests |
| `tests/creatorPreviewIncrementalTypingFeasibilityV1.test.ts` | End-to-end Core candidate session/oracle parity and invalidation tests |
| `tests/fixtures/creator-preview/incremental-typing-feasibility.v1.json` | Fixed corpus definitions and expected operation sequences |
| `scripts/run-creator-incremental-typing-feasibility.mjs` | Isolated measured runner and immutable JSON artifact writer |
| `scripts/verify-creator-incremental-typing-feasibility.mjs` | Schema, pins, accounting, thresholds and raw-row verifier |
| `tests/creatorIncrementalTypingFeasibilityArtifactV1.test.ts` | Verifier negative cases for tampering, missing rows and threshold failure |

---

### Task 1: Candidate contract and provider-owned MR1 range state

**Files:**

- Create: `src/creatorPreview/incrementalTypingFeasibilityContractV1.ts`
- Create: `packages/text-engine-rust-wasm/src/creatorIncrementalParagraphProviderV1.ts`
- Modify: `src/index.ts`
- Modify: `packages/text-engine-rust-wasm/src/index.ts`
- Test: `tests/creatorIncrementalParagraphProviderV1.test.ts`

**Interfaces:**

- Consumes: `FlowDocTextEngineMr1RangeWorkerRuntimeV1.shapeFull`, `segmentFull`,
  `shapeRange`, `segmentRange`; pinned runtime identity
- Produces:

```ts
export interface VNextCreatorIncrementalEditV1 {
  kind: "append" | "backspace" | "replace" | "enter" | "composition-update" | "composition-commit"
  previousStartUtf16: number
  previousEndUtf16: number
  insertedText: string
  nextStartUtf16: number
  nextEndUtf16: number
}

export interface VNextCreatorIncrementalParagraphStateV1 {
  stateVersion: "creator-incremental-paragraph-feasibility/1"
  immutable: true
  textLengthUtf16: number
  productionBinding: false
}

export type VNextCreatorIncrementalParagraphAdvanceV1 =
  | {
      status: "candidate-range"
      state: VNextCreatorIncrementalParagraphStateV1
      previousRange: { startUtf16: number; endUtf16: number }
      nextRange: { startUtf16: number; endUtf16: number }
      shape: VNextCreatorPreviewShapeFactsV1
      breakOffsetsUtf16: number[]
      certificate: {
        policy: "successive-context-stability/1" | "bounded-complete-paragraph/1"
        contextStartUtf16: number
        contextEndUtf16: number
        stableExpansionCount: 2
        oracleVerified: false
        mayPublishLayout: false
      }
      work: {
        shapeCalls: number; shapeUtf16: number; segmentCalls: number; segmentUtf16: number
        fullShapeCalls: 0; fullSegmentCalls: 0; maxContextUtf16: number
      }
    }
  | {
      status: "candidate-noop"
      state: VNextCreatorIncrementalParagraphStateV1
      work: { shapeCalls: 0; shapeUtf16: 0; segmentCalls: 0; segmentUtf16: 0;
        fullShapeCalls: 0; fullSegmentCalls: 0; maxContextUtf16: 0 }
      mayPublishLayout: false
    }
  | {
      status: "full-context-required"
      reasonCode: "invalid-edit" | "stale-state" | "unsafe-cluster-boundary" |
        "context-did-not-stabilize" | "full-text-reached" | "runtime-failure"
      mayPublishLayout: false
    }

export interface VNextCreatorIncrementalParagraphProviderV1 {
  create(input: { text: string; fontFaceId: "sarabun-regular" }): VNextCreatorIncrementalParagraphStateV1
  advance(input: {
    state: VNextCreatorIncrementalParagraphStateV1
    previousText: string
    nextText: string
    edit: VNextCreatorIncrementalEditV1
  }): VNextCreatorIncrementalParagraphAdvanceV1
}

export function createFlowDocCreatorIncrementalParagraphProviderV1(input: {
  runtime: FlowDocTextEngineMr1RangeWorkerRuntimeV1
  initialContextUtf16: 32
  maximumContextUtf16: 512
  requiredStableExpansionCount: 2
}): VNextCreatorIncrementalParagraphProviderV1
```

Factory signature นี้อยู่ใน external package file และ import runtime type จาก
`./workerMr1Range.js`; Core contract file ห้าม import external package กลับเข้า `src/**`.

- [ ] **Step 1: Write failing contract and provider tests**

Add tests that require frozen authentic states, reject `structuredClone(state)`, reject
surrogate-splitting offsets and stale `previousText`, and use counters to prove an advance
does not call `shapeFull` or `segmentFull`.

```ts
const calls = { shapeFull: 0, segmentFull: 0, shapeRange: 0, segmentRange: 0 }
const state = provider.create({ text: thai1024, fontFaceId: "sarabun-regular" })
calls.shapeFull = 0; calls.segmentFull = 0
const result = provider.advance({
  state,
  previousText: thai1024,
  nextText: `${thai1024.slice(0, 511)}ก${thai1024.slice(511)}`,
  edit: { kind: "replace", previousStartUtf16: 511, previousEndUtf16: 511,
    insertedText: "ก", nextStartUtf16: 511, nextEndUtf16: 512 },
})
expect(result.status).toBe("candidate-range")
expect(calls.shapeFull).toBe(0)
expect(calls.segmentFull).toBe(0)
```

- [ ] **Step 2: Run the focused test and preserve RED output**

Run:

```powershell
npx vitest run tests/creatorIncrementalParagraphProviderV1.test.ts
```

Expected: FAIL because both new modules/exports are absent. Save the command, exit code
and failing import in the WORK evidence directory.

- [ ] **Step 3: Implement the contract and authentic state boundary**

Use a module-local `WeakMap<object, ParagraphStateInternals>` keyed by the frozen state
token. `create` performs the only full shape/segment for initial state. `advance` verifies
the exact edit relation and state identity before any range call and returns an immutable
successor token without invalidating the old token. The Core session promotes that successor
only after range splice and line reflow both succeed; a failed downstream step drops the
successor and keeps the prior session/token current. Session revision identity rejects stale
or branching edits, while the provider token remains reusable for one retry from the same
authenticated previous text. Abandoned successors are reclaimed through the `WeakMap`.
A `composition-commit` with unchanged text returns `candidate-noop`, supplies a successor
token for the same text and records zero shaping/segmentation.

```ts
const paragraphs = new WeakMap<object, ParagraphStateInternals>()

function requireEditRelation(previousText: string, nextText: string, edit: VNextCreatorIncrementalEditV1) {
  const expected = previousText.slice(0, edit.previousStartUtf16)
    + edit.insertedText
    + previousText.slice(edit.previousEndUtf16)
  if (expected !== nextText || edit.nextStartUtf16 !== edit.previousStartUtf16
    || edit.nextEndUtf16 !== edit.nextStartUtf16 + edit.insertedText.length) {
    return false
  }
  return true
}
```

- [ ] **Step 4: Implement bounded context expansion without full oracle calls**

Start at scalar-safe retained cluster boundaries around the edit. A paragraph no longer
than 64 UTF-16 units may use one complete range call with
`bounded-complete-paragraph/1`; this remains bounded and does not call the full APIs.
For longer paragraphs, expand context lengths `32, 64, 128, 256, 512`; accept only after
shape facts, target break facts and one guard cluster on each available side are identical
for two consecutive expansions. Return
`full-context-required` when context reaches the full paragraph or 512 UTF-16 units without
two stable expansions. Convert range glyph clusters to `VNextCreatorPreviewShapeFactsV1`
with cluster offsets relative to `nextRange.startUtf16`.

- [ ] **Step 5: Compare provider output to full oracles in tests outside advance timing**

For Thai combining marks, Latin ligatures, mixed script, insert/delete and replacement,
splice the candidate facts and compare them to `runtime.shapeFull(nextText)` plus
`runtime.segmentFull(nextText)` after `advance` returns. Require exact glyph IDs, cluster
offsets, advances, offsets and break offsets.

- [ ] **Step 6: Run focused tests and commit Task 1**

Run:

```powershell
npx vitest run tests/creatorIncrementalParagraphProviderV1.test.ts tests/textEngineMr1RangeFactsV1.test.ts tests/textEngineIncrementalRangeExecutionV1.test.ts
git diff --check
```

Expected: all selected tests PASS. Commit only Task 1 files with message:

```text
feat(core): add incremental paragraph feasibility provider
```

### Task 2: Extract one-line planning without changing full layout

**Files:**

- Modify: `src/creatorPreview/layoutFactsV1.ts`
- Create: `tests/creatorPreviewIncrementalLineReflowFeasibilityV1.test.ts`

**Interfaces:**

- Consumes: `CreatorPreviewParagraphPlanningFactsV1`, raw measurement provider and the
  existing `CreatorPreviewLineTraceV1`
- Produces:

```ts
export function createCreatorPreviewClustersFromShapeFactsV1(input: {
  text: string
  facts: VNextCreatorPreviewShapeFactsV1
  inlineIndex: number
  offsetUtf16: number
}): CreatorPreviewClusterV1[]

export function planCreatorPreviewNextLineV1(input: {
  facts: CreatorPreviewParagraphPlanningFactsV1
  provider: VNextCreatorPreviewRawMeasurementProviderV1
  startClusterIndex: number
  existingLineCount: number
  work?: CreatorPreviewLayoutWorkV1
}): CreatorPreviewLineTraceV1
```

- [ ] **Step 1: Write planner equivalence tests**

For empty, Thai, Latin, mixed, near-width, exact-width and overwide-cluster fixtures,
iterate `planCreatorPreviewNextLineV1` until the end and require the lines/traces to equal
one call to `planCreatorPreviewParagraphLinesV1({ captureTrace: true })`.

- [ ] **Step 2: Run focused test and preserve RED output**

```powershell
npx vitest run tests/creatorPreviewIncrementalLineReflowFeasibilityV1.test.ts
```

Expected: FAIL because the two exports do not exist.

- [ ] **Step 3: Extract the pure cluster conversion and next-line function**

Move the existing validation/conversion from `shapeClusters` into
`createCreatorPreviewClustersFromShapeFactsV1`. Make `shapeClusters` call the pure helper.
Move exactly one iteration of the current line loop into `planCreatorPreviewNextLineV1`;
make the full planner call that function repeatedly. Preserve current error codes,
line-final shaping, trace fields and 100-page guard.

- [ ] **Step 4: Run regressions and commit Task 2**

```powershell
npx vitest run tests/creatorPreviewIncrementalLineReflowFeasibilityV1.test.ts tests/creatorNativeTailExperimentV1.test.ts tests/creatorStageATrialBridgeV1.test.ts
git diff --check
```

Expected: equivalence and existing Stage A tests PASS. Commit:

```text
refactor(core): expose exact one-line Creator planning
```

### Task 3: Retained Core paragraph session and reflow-to-reconvergence

**Files:**

- Create: `src/creatorPreview/incrementalLineReflowFeasibilityV1.ts`
- Create: `src/creatorPreview/incrementalTypingFeasibilityV1.ts`
- Modify: `src/index.ts`
- Test: `tests/creatorPreviewIncrementalTypingFeasibilityV1.test.ts`

**Interfaces:**

- Consumes: Task 1 paragraph provider, Task 2 one-line planner, existing paragraph
  partitioning/materialization facts, authentic Creator engine
- Produces:

```ts
export interface VNextCreatorIncrementalTypingSessionV1 {
  mode: "creator-incremental-typing-feasibility/1"
  stateVersion: "creator-incremental-layout-state/1"
  immutable: true
  productionBinding: false
  requestRevision: number
}

export type VNextCreatorIncrementalTypingSessionCreationV1 =
  | { status: "ready"; session: VNextCreatorIncrementalTypingSessionV1; initialLineCount: number }
  | { status: "blocked"; reasonCode: "invalid-source" | "engine-mismatch" |
      "provider-mismatch" | "initial-layout-failed" }

export type VNextCreatorIncrementalTypingFallbackCodeV1 =
  | "invalid-edit" | "non-increasing-revision" | "engine-mismatch" | "provider-mismatch"
  | "source-context-changed" | "inline-boundary-changed" | "paragraph-topology-unsupported"
  | "provider-full-context-required" | "cluster-splice-invalid" | "reflow-limit-exceeded"

export type VNextCreatorIncrementalTypingAdvanceV1 =
  | {
      status: "incremental-exact"
      session: VNextCreatorIncrementalTypingSessionV1
      lines: CreatorPreviewClusterV1[][]
      affected: {
        paragraphIndex: number
        firstChangedLineIndex: number
        reconvergedLineIndex: number
        replannedLineCount: number
        affectedPageIndexes: number[]
        estimatedRebuiltGeometryLineCount: number
      }
      work: CreatorPreviewLayoutWorkV1 & {
        rangeShapeUtf16: number
        rangeSegmentUtf16: number
        fullShapeCalls: 0
        fullSegmentCalls: 0
        maxContextUtf16: number
        candidateMs: number
      }
      mayPublishLayout: false
    }
  | {
      status: "full-context-required"
      reasonCode: VNextCreatorIncrementalTypingFallbackCodeV1
      mayPublishLayout: false
    }

export function createVNextCreatorIncrementalTypingFeasibilitySessionV1(input: {
  engine: VNextCreatorPreviewMeasurementEngineV1
  paragraphProvider: VNextCreatorIncrementalParagraphProviderV1
  source: VNextCreatorTextResolvedV1
  requestRevision: number
}): VNextCreatorIncrementalTypingSessionCreationV1

export function advanceVNextCreatorIncrementalTypingFeasibilitySessionV1(input: {
  engine: VNextCreatorPreviewMeasurementEngineV1
  paragraphProvider: VNextCreatorIncrementalParagraphProviderV1
  session: VNextCreatorIncrementalTypingSessionV1
  nextSource: VNextCreatorTextResolvedV1
  requestRevision: number
  edit: VNextCreatorIncrementalEditV1
}): VNextCreatorIncrementalTypingAdvanceV1
```

- [ ] **Step 1: Write RED tests for authentic state and operation coverage**

Require at least one bounded `incremental-exact` positive case for append, backspace,
middle Thai insert, localized selection replacement, terminal Enter split, trailing-LF
Backspace merge and the sequence `"" → "ก" → "กำ" → "กำ" commit`. Also retain long
Thai, Latin and mixed cases that exceed reflow or combined-work limits as explicit
`full-context-required` tests; they must preserve the prior session and remain in the fixed
corpus rather than being rewritten, discarded or counted as timing PASS.
Require rejection of copied sessions, wrong engine/provider, repeated or decreasing revision,
prefix/suffix/style drift and edit/source mismatch.

- [ ] **Step 2: Run the new test and preserve RED output**

```powershell
npx vitest run tests/creatorPreviewIncrementalTypingFeasibilityV1.test.ts
```

Expected: FAIL because the session and reflow modules are absent.

- [ ] **Step 3: Implement retained session initialization**

Use module-local `WeakMap` internals holding source, paragraph provider tokens, paragraph
planning facts, full line traces and global line offsets. Initial creation may perform full
layout once. Public tokens contain identity/revision only and are frozen; copied tokens fail.

- [ ] **Step 4: Apply one edit to the affected paragraph**

Validate the complete source/edit relation. Retain untouched paragraphs by identity. For
terminal Enter split or trailing-LF Backspace merge, retain the prior paragraph state and
create/remove the bounded empty trailing paragraph token; nonterminal topology edits return
`full-context-required`. Keep unaffected prefix/suffix paragraphs. Apply the provider patch to clusters/breaks with
UTF-16 offset shifting; reject any splice that crosses a retained cluster or inline boundary.

- [ ] **Step 5: Reflow until exact reconvergence**

Start at the first previous line intersecting `previousRange`. Call
`planCreatorPreviewNextLineV1` one line at a time. A line reconverges only when normalized
cluster source ranges, inline indexes, glyph facts, advance, break status and shifted next
start offset equal the retained line. Require two consecutive equal lines before retaining
the suffix; if the paragraph ends first, use text-end convergence. Before planning the next
line, stop when its conservative work bound would cross the Gate threshold; do not perform
unbounded candidate work and label it fallback afterward. Return `full-context-required`
with `reflow-limit-exceeded` instead of publishing a partial result. Oracle-only diagnostics
may inspect farther outside candidate timing to explain why reconvergence did not occur.

```ts
while (cursor < nextFacts.clusters.length) {
  const trace = planCreatorPreviewNextLineV1({
    facts: nextFacts, provider: rawProvider, startClusterIndex: cursor,
    existingLineCount: globalLineIndex, work,
  })
  changed.push(trace.acceptedLine)
  cursor = trace.acceptedEndClusterIndex
  if (sameShiftedLine(trace.acceptedLine, retained[candidateIndex], offsetDelta)) {
    stable += 1
    if (stable === 2) return reconverged(changed, retained.slice(candidateIndex + 1))
  } else stable = 0
  candidateIndex += 1
}
```

- [ ] **Step 6: Compare every candidate result to current full Creator layout**

In tests only, call `createVNextCreatorTextPreviewLayoutV1` after candidate timing and
normalize its paint commands into line cluster/source facts. Require exact equality and
verify the session atomically promotes the successor only after a successful advance. A
fallback must leave the old session/token current and permit the same authenticated edit to
be retried without full initialization.

- [ ] **Step 7: Run focused and neighboring tests, then commit Task 3**

```powershell
npx vitest run tests/creatorPreviewIncrementalTypingFeasibilityV1.test.ts tests/creatorPreviewIncrementalLineReflowFeasibilityV1.test.ts tests/creatorNativeTailExperimentV1.test.ts tests/creatorStageATrialBridgeV1.test.ts tests/creatorTextEditGeometryV1.test.ts
git diff --check
```

Expected: all focused and neighboring tests PASS. Commit:

```text
feat(core): prove retained Creator reflow feasibility
```

### Task 4: Fixed corpus, isolated timing and admission verifier

**Files:**

- Create: `tests/fixtures/creator-preview/incremental-typing-feasibility.v1.json`
- Create: `scripts/run-creator-incremental-typing-feasibility.mjs`
- Create: `scripts/verify-creator-incremental-typing-feasibility.mjs`
- Create: `tests/creatorIncrementalTypingFeasibilityArtifactV1.test.ts`
- Modify: `package.json`
- Test: `tests/creatorPreviewIncrementalTypingFeasibilityV1.test.ts`

**Interfaces:**

- Consumes: Task 3 session functions and full Creator layout oracle
- Produces one immutable JSON artifact with:

```ts
interface CreatorIncrementalFeasibilityArtifactV1 {
  schemaVersion: "creator-incremental-typing-feasibility/1"
  environment: Record<string, string | number>
  pins: { coreCommit: string; wasmSha256: string; fontSha256: string; measurementProfileId: string }
  policy: {
    warmup: 5
    repetitions: number
    p95Ms: 16.7
    maxMs: 33.4
    maxAcceptedContextPerCallUtf16: 256
    maxExploratoryContextPerCallUtf16: 512
    maxAcceptedShapeAndSegmentUtf16: 1024
  }
  rows: Array<{
    caseId: string; burstRevision: number | null
    language: "thai" | "latin" | "mixed"; sizeUtf16: 256 | 1024 | 2048
    operation: string; order: "candidate-first" | "oracle-first"
    result: "incremental-exact" | "full-context-required" | "invalid"
    candidateMs: number; oracleMs: number; exact: boolean
    shapeUtf16: number; segmentUtf16: number; fullShapeCalls: number; fullSegmentCalls: number
    maxContextUtf16: number; replannedLineCount: number
    affectedPageIndexes: number[]; fallbackReason: string | null
    diagnosticGeometryMs: number; reusedGeometryGroupCount: number; rebuiltGeometryGroupCount: number
  }>
  summary: { validRows: number; invalidRows: number; fallbackRows: number; admissionRate: number; gate: "PASS" | "BLOCKER" }
}
```

`maxExploratoryContextPerCallUtf16: 512` อนุญาตให้ candidate ตรวจว่าบริบทที่เล็กกว่า
ไม่เสถียรและคืน `full-context-required` อย่างมีเหตุผลเท่านั้น ผล localized edit ที่ใช้
context เกิน `maxAcceptedContextPerCallUtf16: 256` ใน call ใด call หนึ่งห้ามนับเป็น
`incremental-exact` หรือ timing PASS แม้ผลจะตรง oracle ส่วนเพดาน
`maxAcceptedShapeAndSegmentUtf16: 1024` นับผลรวมงาน shape และ segment ทุก range call
ใน revision ที่รับเข้า Gate 1 ทั้งสามค่าเป็นคนละมิติและ verifier ต้องตรวจแยกกัน

- [ ] **Step 1: Add the fixed corpus**

Define deterministic base strings and edit offsets for all three language families and
sizes. Add a 180-revision chain mixing append/backspace, mid-line Thai insert, localized
replacement, terminal Enter/trailing-LF merge and composition update/commit while keeping
one authentic session. Include one declared adversarial full-context case outside common
admission rate. Store content construction rules and expected UTF-16 sizes; do not store
browser output.

- [ ] **Step 2: Add verifier RED assertions**

Write table-driven tests requiring the verifier to reject wrong commit/digest, missing
case/repetition/order, duplicate row, non-finite timing, oracle mismatch, hidden fallback,
threshold failure, a candidate row that records full-shape/full-segment calls, and summary
values that do not recompute from rows.

```powershell
npx vitest run tests/creatorIncrementalTypingFeasibilityArtifactV1.test.ts
```

Expected: FAIL because the verifier export is absent. After implementation, each mutated
in-memory artifact must return the first precise invariant failure.

- [ ] **Step 3: Implement runner with separate candidate and oracle clocks**

Alternate call order by repetition. Collect candidate metrics before invoking the oracle.
After oracle parity, build admitted geometry and collect actual retained/rebuilt geometry
group counts in a separate diagnostic interval; do not add that interval to `candidateMs`.
Write raw rows first, derive summary from raw rows, write a temporary file, reread and
verify it, then atomically rename to the requested output path. Print artifact path and
SHA-256 after verification; SHA generation occurs after measured rows.

- [ ] **Step 4: Add scripts and run one calibration corpus**

Add:

```json
{
  "scripts": {
    "evidence:creator-incremental-typing-feasibility": "node scripts/run-creator-incremental-typing-feasibility.mjs",
    "verify:creator-incremental-typing-feasibility": "node scripts/verify-creator-incremental-typing-feasibility.mjs"
  }
}
```

Run the corpus with output outside the repository under the Core WORK evidence directory.
Do not tune thresholds after seeing results. A calibration that misses a gate remains raw
evidence and receives `BLOCKER` or `FAIL` classification according to the decision rules.

- [ ] **Step 5: Run verifier mutation checks and commit Task 4**

```powershell
npx vitest run tests/creatorPreviewIncrementalTypingFeasibilityV1.test.ts
npx vitest run tests/creatorIncrementalTypingFeasibilityArtifactV1.test.ts
npm run verify:creator-incremental-typing-feasibility -- C:/Users/nekot/.codex/visualizations/2026/09/06/01a07584-49dc-7602-b662-6033c1469517/text-policy-examples/core-incremental-typing-feasibility-g1-a1.json
git diff --check
```

Expected: genuine artifact PASSes structural verification; each mutated copy fails its
target invariant. Commit:

```text
test(core): add incremental typing feasibility gate
```

### Task 5: Full Core gate and terminal evidence return

**Files:**

- Modify only if required by final focused failures: files already owned by Tasks 1–4
- Evidence outside repository: raw artifact, verifier log, full-gate log, source inventory,
  `git status`, commit and artifact SHA-256

**Interfaces:**

- Consumes: Tasks 1–4 at one exact commit
- Produces: one immutable Terminal Handoff to PLAN with `PASS`, `FAIL`, `BLOCKER`, `RISK`
  or `UNKNOWN`

- [ ] **Step 1: Run the final isolated corpus once**

Stop other Core test processes first. Record pre-run pins and clean status. Run the full
fixed corpus once and verify its artifact. Do not discard slow or fallback rows.

- [ ] **Step 2: Run the full Core gate**

```powershell
npm run check
git diff --check
git status --short
```

Expected: type-check and all Core tests PASS; worktree is clean after the final commit.

- [ ] **Step 3: Review public/default-path boundaries**

Search `src/index.ts`, Creator default layout call sites and `productionBinding` guards.
Confirm exports require the explicit feasibility mode, no default Creator path calls the
new session, no Editor/Backend file changed, no artifact/digest changed and no repository
Markdown was added.

- [ ] **Step 4: Return the terminal handoff automatically**

Send the terminal handoff through `mcp__codex_app__send_message_to_thread` to PLAN task
`01a08a25-13d9-7090-8d91-1c32242988d8` before or with the WORK final answer. Include:

- exact commit and clean worktree/branch locator
- changed files and behavior summary
- RED/GREEN commands, focused/full gate totals and logs
- artifact path, SHA-256, complete environment/pins and row accounting
- p50/p95/max by language/size/operation, scaling ratios, admission rate and fallback reasons
- exact oracle parity result and proof that oracle/full fingerprint work is outside timing
- `PASS`, `FAIL`, `BLOCKER`, `RISK` or `UNKNOWN` plus remaining risks/unknowns

The WORK must not update Project Control, merge Core, change a map, dispatch Editor or
clean any retained candidate.

## Kickoff Packet prepared for Gate 1

- Dispatch set: `dispatch-core-incremental-typing-feasibility-2026-09-13`
- Lane: `lane-core-incremental-typing-feasibility`
- Work Type: `product-implementation`, candidate-only feasibility mechanism
- Owner: `repo-core`; PLAN remains integration owner and acceptance authority
- Real WORK locator: task `01a07584-49dc-7602-b662-6033c1469517` on host `local`
- Starting state: new dedicated worktree/branch
  `codex/core-incremental-typing-feasibility-20260913` from exact
  `4e3b0c9aa4a4d916c78ea5da8e9bac4cffdc4224`; preserve the source worktree
- `parallelLimit: 1`; no Editor or Backend WORK while Gate 1 is active
- Context Capsule: this plan, approved architecture spec, Core `AGENTS.md`,
  `evidence-core-incremental-admission`, source pin and existing MR1 range/Stage A files
- Context Acknowledgement: WORK repeats scope, owner, phase, checklist/evidence target,
  source pin, no-production-binding rule, model decision, return route and stop conditions
  before editing
- Return handoff ID: `handoff-core-incremental-typing-feasibility-g1-a1`
- Active Return Command: `mcp__codex_app__send_message_to_thread` to PLAN task
  `01a08a25-13d9-7090-8d91-1c32242988d8`
- Liveness: progress checkpoint every 10 minutes; renewable deadline 20 minutes from last
  evidenced progress; silence or inaccessible task is not acceptable output
- Resource budget: normal context, focused checks per task, full Core gate once at terminal,
  mandatory source review, full raw evidence, compact terminal handoff
- Model: `gpt-6-astra`, effort `high`
- Model reason: boundary certification, Thai shaping, retained state, reconvergence and
  measurement isolation cross multiple contracts after three rejected UX approaches
- Availability source: Codex host model allowlist observed by PLAN on 2026-09-13
- Smaller-option assessment: Sol high is suitable after the contract is proven; it is not
  selected for the first feasibility gate because a false safe-boundary decision has high
  correctness and architecture cost
- Escalation trigger: raise Astra effort only after a bounded revision fails from unresolved
  reasoning rather than missing runtime evidence; runtime inability returns `BLOCKER`
- Contract Change Request trigger: dependency/font/WASM/ABI change, production binding,
  Editor/Backend edit, new public default behavior, scope outside one active paragraph, or
  a need to weaken any numerical/correctness gate

## PLAN acceptance after return

PLAN receives the automatic handoff, stages it in `handoffInbox`, preserves arrival order
and runs one `acceptanceGate`. PLAN checks the exact commit, source boundaries, artifact
hash/accounting, raw threshold calculations, oracle isolation, focused/full gate and clean
worktree. A correctable defect returns as a Revision Packet to the same Core WORK and keeps
the lane boundary. PLAN does not repair Core files.

Only an accepted `PASS` may complete checklist item `incremental-admission` and authorize
writing the separate Gate 2/3 production-contract plan. `BLOCKER` records the Text Engine
limit and returns to architecture review. No result from Gate 1 authorizes Editor work,
merge to Core main, cleanup or map update by itself.

## Spec coverage review

| Approved spec requirement | Gate 1 coverage | Later boundary |
| --- | --- | --- |
| Core is the only visible layout authority | Global constraint and Task 5 default-path review; no browser/Editor code | Visible integration in Gate 4 |
| Provider-owned state and bounded shaping | Task 1 authentic WeakMap state, range calls and candidate certificate | Production-safe certificate in Gate 2 |
| Reflow until reconvergence | Task 2 one-line parity and Task 3 retained reflow | Versioned page patch in Gate 3 |
| Geometry work is bounded and measurable | Task 3 affected-line scope plus Task 4 untimed actual geometry diagnostics | Incremental geometry patch/caret parity in Gate 3 |
| Thai composition | Task 1 no-op commit and Task 3 contract-level revision sequence | Real OS IME/candidate window in Gate 5 |
| Exactness and typing responsiveness | Task 4 full oracle on every revision, fixed thresholds and 180-revision burst | Browser key-to-visible and user trial in Gates 5–6 |
| Backend persistence outside typing path | No Backend code in this plan | Persistence boundary remains unchanged |
| Node-count performance stays separate | Explicitly excluded | Gate 7 after user acceptance |

## Deferred plans

- Gate 2: production incremental shaping contract and authenticated safe-boundary policy
- Gate 3: versioned line/page/geometry patch and retained scene contract
- Gate 4: Editor Worker/session/hidden-input integration
- Gate 5: real Windows Thai IME and browser verification
- Gate 6: ตูม user acceptance on 12+ lines with no geometry swap
- Gate 7: separate 30+ Node pagination and downstream invalidation lane
