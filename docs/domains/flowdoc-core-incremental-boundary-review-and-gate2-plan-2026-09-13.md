# Core Incremental Boundary Review and Gate 2 Plan

## Authority Boundary

Owner: `repo-project-control`

Work path: `flowdoc-product-development-resumption > flowdoc-frontend-expert-roadmap`

PLAN task: `01a08a25-13d9-7090-8d91-1c32242988d8`

Active roles: `planning-partner`, `project-control-steward`,
`cross-repo-boundary-reviewer`, and `evidence-reviewer`

Phase: `phase-core-text-layout-roadmap`

Checklist: `checklist-core-text-layout-roadmap`

Gate 2 checklist item: `incremental-boundary-admission`

Evidence target: `evidence-core-incremental-boundary-admission`

This Project Control document records the architecture review required after
the accepted Gate 1 `BLOCKER` and defines one bounded Core-owned Gate 2. The
user authorized continuation on 2026-09-13. It does not authorize Editor
integration, production binding, browser-shaped visible text, map promotion,
or the later line/geometry and Node-count lanes. Core remains authoritative for
its implementation, tests, and runtime contracts.

## Decision

Gate 1 combined several costs behind one result. Gate 2 must isolate the
retained text and shaping-provider boundary before Core changes line reflow or
geometry.

The next Core candidate must stop passing and validating the complete
paragraph on every edit. A Worker-owned Core session will retain a versioned
paragraph buffer, offset index, paragraph properties, and provider facts. Each
edit will extract one bounded context window and send only that window across
the JavaScript/WASM boundary. The externally visible session token remains
revisioned and immutable while the process-local store uses structural sharing.

Gate 2 is a feasibility and contract gate. Its output remains
`productionBinding: false` and `mayPublishLayout: false`.

## What Gate 1 proved

The accepted negative evidence is `evidence-core-incremental-admission` at
Core commit `3b0c4183362bc7c1ea2596db3e9912318bdb63ac`, measured source commit
`efef6c899e2ca6efca7c231a72f4486232955091`, and artifact SHA-256
`4723ab417a021a7c2e32bf6518f2fda4632a0967a021a4ec08d050e9fbac37d3`.

- 3,180 accepted revisions matched the full oracle; there were zero invalid or
  oracle-mismatch rows.
- The 180-revision retained burst completed without session reset and passed
  its burst timing target.
- Common admission was 80%, below the fixed 95% threshold.
- 600 fallbacks were line-reflow limits, 150 were provider safe-boundary
  failures, and 50 were unsupported nonterminal paragraph topology.
- 28 timing groups and 18 scaling groups failed even when measured shaping and
  segmentation windows stayed bounded.

These results support retained incremental work but reject the current
foreground boundary. They do not prove that the Text Engine approach is
impossible.

## Root-cause review

### 1. Session state performs whole-object work

`src/creatorPreview/incrementalTypingFeasibilityV1.ts` mints every revision by
`structuredClone`-ing the resolved source and recursively freezing the source
and paragraph graph. It also compares large source structures recursively,
repartitions the resolved source, joins complete paragraph parts, maps suffix
clusters, maps suffix breaks, flattens every paragraph line, and constructs a
new frozen graph. These operations grow with retained content even when the
edit is one character.

The older retained range path also clones requests, shaping runs, break arrays,
affected windows, results, and JSON fingerprints during the foreground call.
It is useful correctness scaffolding but is not evidence of a bounded hot path.

### 2. The range runtime still receives and scans full text

`packages/text-engine-rust-wasm/src/workerMr1Range.ts` converts UTF-16 ranges to
UTF-8 bytes twice for shape and twice for segmentation, sends
`rangeInput.text` in full to both WASM calls, and normalizes both results against
the full text.

`packages/text-engine-rust-wasm/src/runtimeMr1Range.ts` rebuilds complete
byte-to-UTF-16 and UTF-16-to-byte maps, recounts the full string, validates
full-text metadata, and stores the full text in each normalized result.

`packages/text-engine-rust-wasm/rust-live-draft-engine/src/lib.rs` receives the
full string. Range shaping pushes the full string into a Rustybuzz buffer to
guess properties and recounts all scalars for metadata. Range segmentation
segments only the context slice but still receives, marshals, and recounts the
full string.

The measured range size is therefore not a proof of bounded foreground work.

### 3. Provider facts are rebuilt as flat suffix arrays

`packages/text-engine-rust-wasm/src/creatorIncrementalParagraphProviderV1.ts`
retains the complete text, glyph array, and break array. Each advance scans
cluster boundaries and creates new prefix/range/suffix arrays. The Creator
session repeats similar suffix mapping when it splices paragraph facts.

This explains why append, backspace, and composition-update timings still grow
between 256 and 2,048 UTF-16 units even when the reported shaping context stays
small.

### 4. Line reflow is a separate failure class

`src/creatorPreview/incrementalLineReflowFeasibilityV1.ts` caps reflow at four
lines and searches prior lines linearly for reconvergence. A middle edit can
legitimately shift multiple following line breaks, so the four-line cap causes
600 deterministic fallbacks. Fixing the provider boundary cannot by itself
prove line or geometry performance.

Gate 3 will own checkpointed reflow, suffix reconvergence, line identity,
retained placement, and geometry patches after Gate 2 passes.

## Gate 2 target architecture

### Retained paragraph store

The Core session owns a process-local paragraph store with:

- a balanced piece tree or rope whose leaves record UTF-16 length, UTF-8 byte
  length, scalar boundaries, and a content digest;
- versioned text revisions with structural sharing between revisions;
- a paragraph-property identity containing direction, script, language, font,
  style, measurement profile, and runtime identity;
- interval-indexed shaping clusters and line-break facts;
- lazy suffix displacement, so one edit does not rewrite every following
  cluster or break offset;
- a bounded retention policy for prior revisions needed by in-flight requests.

Applying an edit may touch the edit leaves and `O(log n)` index nodes. It must
not rebuild or serialize the complete paragraph.

### Bounded window runtime V2

The new experimental runtime contract receives:

```text
shapeWindow({
  contextText,
  targetStartUtf16Local,
  targetEndUtf16Local,
  contextBaseUtf16,
  paragraphProperties,
  fontFaceId,
  revisionIdentity
})

segmentWindow({
  contextText,
  targetStartUtf16Local,
  targetEndUtf16Local,
  contextBaseUtf16,
  paragraphProperties,
  revisionIdentity
})
```

WASM receives only `contextText`. It returns local UTF-16 cluster and break
offsets plus a context digest and property identity. Core converts to global
paragraph positions by adding `contextBaseUtf16`; it does not construct a map
for text outside the window.

Paragraph direction, script, and language are retained session facts. An edit
that can invalidate those facts returns an explicit
`paragraph-properties-rebuild-required` fallback. The hot path must not guess
properties by scanning the complete paragraph.

### Safe-boundary certificate

The provider owns the boundary choice and returns a versioned certificate with:

- previous and next target ranges;
- local context range and global base offset;
- left and right retained cluster anchors;
- paragraph-property and runtime identities;
- context digest;
- exact reason when a bounded window cannot be certified.

Core validates the certificate against the retained store. Editor never chooses
language, grapheme, cluster, or shaping boundaries.

### Hot path and cold QA path

The measured foreground path contains edit application, bounded window
extraction, window shaping/segmentation, local fact validation, and retained
fact splicing. Complete text materialization, complete layout oracle,
serialization, artifact hashing, and deep diagnostic freezing belong to a
separate QA path and must not be timed as user-visible work.

Cold-path oracle checks remain mandatory in the corpus. Moving them outside the
foreground measurement does not remove correctness verification.

## Fixed Gate 2 corpus

The corpus uses the pinned Sarabun font and the same Windows reference
environment as Gate 1.

- Languages: Thai, Latin, and mixed Thai/Latin.
- Sizes: 256, 1,024, 2,048, 4,096, and 8,192 UTF-16 units.
- Common operations: append, backspace, middle insertion, selection
  replacement, composition update, and composition commit.
- Five warmups and 50 measured repetitions per case.
- One authentic 180-revision mixed burst using the same session without reset.
- Adversarial cases: unsafe surrogate boundary, property-changing first-strong
  edit, stale revision, identity mismatch, and a context that cannot certify
  both anchors.

Enter, paragraph splitting/merging, line reflow, geometry, pagination, Editor
events, and Node-count behavior are outside Gate 2. They remain explicit later
gates rather than being counted as provider failures.

## Required instrumentation

Every measured revision records:

- UTF-16 and UTF-8 units read from the retained store;
- piece-tree leaves and index nodes touched;
- bytes passed into and returned from WASM;
- units shaped and segmented;
- clusters and breaks inserted, retained, and lazily displaced;
- full-text materializations, scans, clones, freezes, serializations, and
  hashes in the foreground path;
- phase durations and total foreground duration;
- certificate status, fallback code, and oracle equality.

The runner must fail if a counter is absent, if a measured source is dirty, or
if artifact source hashes do not match the measured commit.

## Admission criteria

Gate 2 is `PASS` only when all of the following hold:

1. Every accepted result is exactly equal to the full shaping and segmentation
   oracle for glyph IDs, advances, offsets, unsafe-to-break facts, and trusted
   break offsets. Invalid or oracle-mismatch rows must be zero.
2. All fixed common cases are admitted. A common fallback is a Gate 2
   `BLOCKER`; adversarial fallbacks must use the expected explicit code.
3. The authentic 180-revision burst completes exactly with one session and no
   reset.
4. Per measured common edit, full-text foreground materializations, scans,
   clones, freezes, serializations, hashes, full shape calls, and full
   segmentation calls are all zero.
5. Text passed to any one WASM window is at most 512 UTF-16 units, and combined
   shaped plus segmented input is at most 1,024 UTF-16 units per revision.
6. The 8,192-to-256 p95 foreground-time ratio for each language and operation
   is at most 1.50.
7. Provider foreground time is at most 8.0 ms p95 and 16.7 ms maximum for each
   common group. This reserves frame budget for Gate 3 line/geometry work and
   Gate 4 transport/paint rather than allowing the provider to consume the
   complete visible frame.
8. The repository full gate passes from a clean candidate commit and the final
   artifact independently verifies against its pinned sources.

Any threshold or corpus change requires PLAN review before measurement. A
result cannot drop rows, silently reset the session, hide fallback work outside
timing, or count a cached oracle answer as foreground work.

## Implementation sequence

1. Add failing characterization tests that expose full-text scans, marshalling,
   cloning, freezing, and suffix-array rewriting in the current candidate.
2. Add the retained paragraph store and offset index behind an experimental V2
   contract. Keep V1 behavior and production exports unchanged.
3. Add Rust and TypeScript bounded-window runtime V2. Generate and pin a new
   experimental WASM artifact through the repository-owned build process.
4. Add the provider-owned safe-boundary certificate and retained fact splice.
5. Add the fixed corpus, raw-row writer, summary, immutable verifier, and phase
   instrumentation. Run a calibration artifact before the single final run.
6. Run focused tests, the full Core gate, the final corpus, and the independent
   verifier from a clean commit. Return an immutable terminal handoff to PLAN.

Production binding, existing default-path replacement, Editor changes, public
readiness claims, and map updates are forbidden in this lane.

## WORK packet

- Dispatch set: `dispatch-core-incremental-boundary-g2-2026-09-13`
- Lane: `lane-core-incremental-boundary-g2`
- Work Type: `implementation`
- Owner repository: `repo-core`
- Active role: `product-implementation-agent`
- Base candidate: retained clean Gate 1 worktree at
  `3b0c4183362bc7c1ea2596db3e9912318bdb63ac`
- PLAN task: `01a08a25-13d9-7090-8d91-1c32242988d8`
- Expected handoff: `handoff-core-incremental-boundary-g2-a1`
- Automatic return command: `mcp__codex_app__send_message_to_thread`
- Evidence target: `evidence-core-incremental-boundary-admission`
- UX applicability: not applicable; this is a non-publishing Core mechanism
  gate. Visible typing acceptance remains pending for Gate 4 and Gate 6.

### Model decision

Use `gpt-6-astra` with `high` reasoning effort. The lane crosses retained data
structures, UTF-8/UTF-16 indexing, Rust/WASM ABI, shaping correctness,
performance instrumentation, and immutable evidence. An error could admit an
incorrect text boundary and later produce visible geometry corruption. The
candidate is recoverable because it remains isolated and non-publishing, but
the unresolved cross-boundary reasoning is not a small bounded edit. A smaller
model is not selected for attempt 1 because Gate 1 already demonstrated that
locally bounded range calls can conceal complete-text work. Escalate to
`xhigh` only if one bounded revision still cannot reconcile exact oracle facts
with the no-full-text foreground contract; do not change the acceptance gate.

Capability source: current Codex host task tools observed on 2026-09-13.
Available selected pair: `gpt-6-astra` supports `high`.

## Acceptance and next gate

PLAN accepts `PASS`, `BLOCKER`, `FAIL`, `RISK`, or `UNKNOWN` with exact commits,
raw and summarized artifacts, hashes, focused and full test output, changed
files, fallback distribution, and all instrumentation counters. Receipt is not
acceptance.

A Gate 2 `PASS` authorizes drafting Gate 3 for checkpointed line reflow and
retained geometry only. It does not authorize Editor integration. A `BLOCKER`
preserves the candidate and records the failed boundary without weakening the
UX contract.
