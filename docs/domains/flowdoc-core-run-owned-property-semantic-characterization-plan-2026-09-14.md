# Core Run-Owned Property Semantic Characterization Implementation Plan

> **For agentic workers:** This is one bounded Core WORK lane. It must return through the registered `send_message_to_thread` command before local completion. It must not edit Core, Project Control, or the retained candidate.

**Goal:** Decide whether a run-owned property model can preserve the current Gate 2 candidate's text, script/property facts, direction, and Enter behavior before any replacement session is implemented.

**Architecture:** The present candidate at Core commit `1540b7d71154e40b793c3c5ee0fffa90aa2569fc` holds paragraph property facts too broadly. The proposed model keeps paragraph direction as paragraph context while each run owns its script/property facts and can be split at an arbitrary UTF-16 boundary only when its local seams are certified. This lane characterizes those semantics against the existing candidate and independent oracle only; it creates no alternative implementation.

**Tech Stack:** Rust, private Rust/WASM QA adapter, TypeScript Vitest evidence, Unicode scalar and grapheme rules.

**Spec:** `docs/domains/flowdoc-core-run-owned-property-gate2-design-2026-09-14.md`

## Global Constraints

- Owner repository is `repo-core`; Work is `flowdoc-frontend-expert-roadmap`; Phase is `phase-core-text-layout-roadmap`; Checklist is `checklist-core-text-layout-roadmap`; evidence target remains `evidence-core-rust-paragraph-session-feasibility`.
- Inspect the retained clean Core candidate only: `C:/Users/nekot/.codex/worktrees/7c82/flowdoc-vnext-core` at `1540b7d71154e40b793c3c5ee0fffa90aa2569fc`.
- This lane is read-only. No Core files, tests, package metadata, generated WASM, branches, worktrees, public exports, product bindings, Editor, Backend, Gate 3, map, threshold, corpus, or Node-count changes are allowed.
- Preserve the fixed Gate 2 bounds: at most 512 source facts, at most 512 property facts, and at most 1024 combined shape-plus-segment work per admitted command.
- A split must preserve UTF-16 source order, never split a UTF-16 surrogate pair, and never claim a Thai grapheme or active composition can be divided without a supplied semantic rule.
- The WORK result is a semantic evidence candidate, not Gate 2 admission, UX acceptance, product readiness, or map truth.

---

## File Structure

- Read: `packages/text-engine-rust-wasm/rust-live-draft-engine/src/paragraph_enter_v2.rs` — current paragraph session ownership, raw facts, property derivation, and Enter path.
- Read: `tests/incrementalWindowRuntimeV2.test.ts` — exact oracle, admission RED, and same-property versus property-changing Enter cases.
- Read: `docs/domains/flowdoc-core-run-owned-property-gate2-design-2026-09-14.md` — approved ownership and fallback rules.
- Produce: one terminal handoff to PLAN. It must cite exact Core paths, function names, line ranges, command output, candidate commit, and an explicit semantic matrix. No repository file is produced by this lane.

### Task 1: Characterize property ownership and split equivalence

**Files:**

- Read: `packages/text-engine-rust-wasm/rust-live-draft-engine/src/paragraph_enter_v2.rs`
- Read: `tests/incrementalWindowRuntimeV2.test.ts`
- Read: `docs/domains/flowdoc-core-run-owned-property-gate2-design-2026-09-14.md`
- Modify: none
- Test: existing `tests/incrementalWindowRuntimeV2.test.ts` only, without edits

**Consumes:** The retained candidate commit and the approved design document.

**Produces:** A four-row semantic matrix for (1) same-property Enter, (2) Thai-left/Latin-right property-changing Enter, (3) arbitrary Latin mid-word split, and (4) Thai grapheme/active-composition boundary. Each row names the current fact owner, proposed fact owner, exact equivalence rule, bounded seam proof needed, and PASS/BLOCKER/UNKNOWN result.

- [ ] **Step 1: Verify immutable starting point**

Run:

```text
git -C C:/Users/nekot/.codex/worktrees/7c82/flowdoc-vnext-core rev-parse HEAD
git -C C:/Users/nekot/.codex/worktrees/7c82/flowdoc-vnext-core status --short
```

Expected: exact commit `1540b7d71154e40b793c3c5ee0fffa90aa2569fc` and no output from `status --short`. If either differs, return `BLOCKER` without inspection.

- [ ] **Step 2: Map the current property origin and Enter reconstruction**

Read the Rust session source and record the exact functions and line ranges that:

```text
1. receive raw source and raw property facts;
2. derive script or property facts for an edited paragraph;
3. split a paragraph on Enter;
4. build the right child's facts; and
5. publish or reject a child result.
```

Expected: identify whether the current right child receives one paragraph-wide property value or independently retained run facts. Do not infer behavior from names alone; cite data flow and the corresponding test oracle.

- [ ] **Step 3: Run the preserved characterization checks**

Run:

```text
npx vitest run tests/incrementalWindowRuntimeV2.test.ts --maxWorkers=1
npm run type-check
cargo test --manifest-path packages/text-engine-rust-wasm/rust-live-draft-engine/Cargo.toml
```

Expected: report the exact count of passing checks and retain the known property-changing Enter admission RED unchanged. A changed outcome, unexpected failure, or dirty tree is `BLOCKER`; never repair it in this lane.

- [ ] **Step 4: Evaluate the four semantic cases without implementing them**

Apply this decision table:

| Case | Required equivalence | Required bounded proof |
| --- | --- | --- |
| Same-property Enter | Left and right retain source/facts exactly as the existing oracle; paragraph direction stays unchanged. | Child seam reads only local predecessor/successor context. |
| Thai-left / Latin-right Enter | Thai facts remain only on Thai runs and Latin facts remain only on Latin runs; a child must not inherit one global script fact. | Right-child leading run plus seam certificate is sufficient within the fixed bounds. |
| `off|ice` | Two Latin run fragments retain the same property and recombine to the same source/facts. | The split seam is recertified locally and no word boundary is assumed. |
| Thai grapheme/composition | A valid grapheme boundary may split; a UTF-16 surrogate, combining cluster, or active composition may not be split by unsupported local logic. | A precise existing rule or a typed non-publishing fallback is named. |

Expected: mark PASS only with source-supported equivalence. Mark UNKNOWN when the source lacks a rule. Mark BLOCKER when any required current semantics require a full child-wide property relabel or exceed the fixed bounds.

- [ ] **Step 5: Send terminal handoff before local completion**

Use `mcp__codex_app__send_message_to_thread` to send PLAN task `01a08a25-13d9-7090-8d91-1c32242988d8` the registered handoff ID. The payload must include status, lane ID, Work Type, owner, Context Acknowledgement, exact candidate commit, semantic matrix, commands and results, files changed (`none`), behavior changed (`none`), evidence candidate, unpromoted claims, remaining UNKNOWNs, and a Contract Change Request if a new semantic contract is required.

Expected: a successful tool call is transport evidence only. State `receipt-pending` until PLAN records receipt; do not create another handoff ID or wait indefinitely.

## Acceptance Gate

PLAN accepts only a returned `PASS` when every matrix row is source-supported, no row requires paragraph-wide script relabeling, all fixed bounds remain intact, the retained candidate stayed clean, and the automatic return is received. `BLOCKER` or `UNKNOWN` freezes implementation design: no run-tree implementation, Core merge, Gate 3, Editor, Backend, public API, or map change follows.

## Model Selection

WORK uses `gpt-5.6-terra` at `high` effort. The scope is a bounded read-only comparison, so GPT-6 is disproportionate; however Luna is too small for tracing Rust ownership, TypeScript oracle behavior, Unicode boundary policy, and exact evidence citations across the ABI boundary. Escalate only if the semantic answer requires a new property ABI, ownership model, or source-of-truth contract rather than a documented equivalence result.

## Self-Review

- Spec coverage: ownership, arbitrary split, Thai boundary, fixed limits, non-publishing fallback, automatic return, and no-product-change limits are each assigned to Task 1.
- Placeholder scan: no deferred implementation placeholders remain; this plan deliberately has one read-only task.
- Type consistency: the candidate commit, lane, evidence target, and return destination match the active Project Control Work record.

## Execution Handoff

One real Core WORK room executes Task 1. It returns to PLAN automatically. PLAN alone records receipt, runs acceptance, and decides whether a later implementation plan may be written.
