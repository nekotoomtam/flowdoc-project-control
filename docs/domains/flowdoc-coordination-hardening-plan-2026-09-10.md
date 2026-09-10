# Coordination hardening: six controls

## Authority Boundary

Project Control owns this approved implementation plan and its coordination
contract. Work path: flowdoc-product-development-resumption > agent-and-skill-design.
Phase: phase-agent-and-skill-design-coordination-six. Checklist:
checklist-agent-and-skill-design-coordination-six. Evidence target:
evidence-flowdoc-coordination-six-2026-09-10. PLAN role: project-control-steward
and planning-partner. No Core, Backend, Editor, typing-performance, or map truth
is promoted. The user approved implementation of the six-point draft in the
PLAN task on 2026-09-10.

## Architecture and scope

Keep the file-first architecture. Add a typed, validated coordination registry
to canonical Project Control data, with deterministic lifecycle operations and
negative tests. No cloud service, autonomous scheduler, GUI redesign, product
repository edit, or OS-level lock is included. Registry validation is a local
coordination guard, not a distributed lock. PLAN serializes writes and merges
through one designated integration owner; a competing PLAN must obtain an
explicit ownership transfer before dispatching overlapping scope.

## Deliverables and acceptance

1. Exclusive PLAN scope ownership and per-repository integration ownership.
   Transfer invalidates the old generation. Competing active claims fail.
2. Distinct sent/received/accepted return states; stable handoff IDs, receipt
   acknowledgement, bounded retry, duplicate idempotence, and rejection of
   late superseded attempts. A failed send never means received.
3. Durable typed registry with state validation and replay/resume checks.
   Required locators, generation/attempt identity, context acknowledgement,
   return route, deadlines, model decision and evidence are checked. Existing
   historical records remain readable and are not falsely migrated as verified.
4. UX-changing lanes require predeclared scenarios, environment, measurable
   acceptance criteria and evidence for those criteria. Mechanism PASS alone
   cannot close UX acceptance. Non-UX lanes explicitly mark not-applicable.
5. Current-round clean merged worktree cleanup is covered by approved delivery;
   unknown historical/unmerged/dirty work requires reconciliation. One
   integration owner merges after worktree gate, verifies main, then cleans.
6. PLAN may retain GPT-6. Each WORK records task complexity, uncertainty,
   failure impact, model, effort, reason, availability source and escalation
   trigger before dispatch. Do not inherit PLAN's model silently. Capability
   selection is a hypothesis evaluated by acceptance, not model equivalence.

## Ordered implementation

- PLAN registers Phase/Checklist and this plan, names the sole integration
  owner, and opens one code WORK. parallelLimit is 1 for implementation because
  schema and validation share files. PLAN prose edits and WORK code edits have
  disjoint file ownership in the same dedicated integration worktree.
- Code WORK writes failing lifecycle tests, implements registry types/schema,
  pure transition/validation functions and a usable local CLI, integrates the
  checks into the existing gate, and returns a code-only commit. Existing
  generated read model must be regenerated from canonical sources, never edited.
- PLAN updates authoritative operating documents and entrypoints, aligns the
  record shape with code, and registers accepted evidence after review.
- Read-only real WORK probes exercise active return and receipt, duplicate
  delivery and revision; automated fixtures cover failure, stale generation,
  competing ownership, restart, missing model reasoning and missing UX evidence.
- Run focused negative tests, independent review, full npm run check in the
  worktree, merge, full npm run check on main, then safe cleanup. Distinguish
  simulated behavior from actual app return-channel evidence at handoff.

## Dispatch registry (bootstrap until typed registry is available)

- dispatchSetId: coordination-six-code-20260910
- PLAN task: 01a08a25-13d9-7090-8d91-1c32242988d8
- integrationOwner: this PLAN; repository: repo-project-control
- laneId: coordination-registry; Work Type: product-implementation (Project
  Control-owned tooling only; no Core/Backend/Editor product scope)
- roomRunId: coordination-registry-01; status: running; locator: task 01a08a42-290d-7090-a192-7c11bae62db0
- generation: 1; revisionAttempt: 0; handoffId: coordination-registry-01-r0
- Return Channel: active send_message_to_thread to the PLAN task above
- Liveness: app task status/progress; deadline: 20 minutes after dispatch;
  inspect status at most once per minute, extend only from observed progress
- Death Signal: inaccessible task or deadline without progress; record failure
  before locator recovery; never accept silence
- returnOrderPolicy: blocker-first then arrival order; completionQueue: empty
- Model decision: gpt-5.6-sol, high. One repository, clear invariants and tests,
  but nontrivial lifecycle transitions. This is sufficient as a starting
  hypothesis; GPT-6 is not necessary by default. Escalate after two failed
  bounded revisions attributable to reasoning, after checking packet quality.
- Model availability: host create_thread tool schema observed 2026-09-10.
- Resource Budget: contextBudget normal, verificationTier full before
  acceptance, reviewTier mandatory, evidenceMode full-acceptance-record,
  handoffDetail compact, docReadPolicy triggered-full-read.
- Allowed WORK files: schemas, src/model, tools, tests, package.json, associated
  package-lock only if necessary. PLAN owns data and docs, AGENTS and generated.
- Stop: changing owner/product scope, unavailable required context, or registry
  design that needs a hosted service. Return a Contract Change Request.

## Risks and unknowns

The registry does not force other hosts or legacy rooms to cooperate. App
delivery receipt is not semantic acceptance. Model availability may change.
No ranking, pricing, or guaranteed equal model quality is claimed. Existing
historical smoke evidence is not proof of this revision. Rollback after a
failed main gate freezes further merges and returns repairs to the original
WORK; retained worktrees preserve evidence until the main gate passes.

## Review and liveness notes

2026-09-10: independent internal documentation review used gpt-5.6-terra/medium
for bounded consistency checking. It is an internal reviewer, not a real WORK
room. Three findings were reviewed and incorporated: rejected transitions keep
active state unchanged while separate audit preserves rejected results; one
terminal handoff per attempt; typed UX measured and user-acceptance states.
No model escalation was needed. Actual availability came from the host tool
allowlist; selection is a task hypothesis, not a comparative benchmark.

Code WORK task 01a08a42-290d-7090-a192-7c11bae62db0 was observed active at
2026-09-10T14:46:10+07:00; initial deadline is 2026-09-10T15:00:00+07:00.
Return remains pending; no handoff is accepted. Focused documentation routing
checks passed 3 tests. Baseline main records checks passed 70 files/156 tests;
remaining baseline groups are still running.

Context Acknowledgement was actively received from code WORK at
2026-09-10T14:47:29+07:00. PLAN acknowledged and accepted the bounded interface:
optional Work.coordination, semantic checks, pure transitions and local CLI.
Observed-progress deadline extended to 2026-09-10T15:15:00+07:00. This is context
acceptance only, not terminal code acceptance.

## Probe concurrency decision

PLAN permits two active rooms across two dispatch sets: one code WORK and one
no-edit return probe. Each set has parallelLimit 1. They share no writable
files; probe output is processed only by PLAN, and all returns are serialized
through the same inbox. Both have direct return routes and retrievable task
IDs. This bounded overlap avoids waiting for code to test app transport; it
does not authorize parallel product merges. During this bootstrap phase only,
this durable note holds room state until the typed registry is implemented,
then PLAN imports actual observed events without claiming retroactive checks.
Baseline main full npm run check passed before implementation acceptance.

Independent test/spec review identified coverage additions within the agreed
controls: in-flight stale return, persisted UX tampering, absent UX proof,
unsupported model/effort pair, partial file overlap, and acceptance authority/
queue order. PLAN sent these to the same code WORK before acceptance. This is
test coverage feedback, not a demonstrated implementation failure or a model
escalation. Work remains in progress.

Observed code progress at 2026-09-10T15:10:00+07:00: transition helper
implemented in src/model/coordination.ts and behavioral suite authored. PLAN
extends liveness deadline to 2026-09-10T15:30:00+07:00 on that evidence.
Acceptance remains pending.

Observed code progress at 2026-09-10T15:28:00+07:00: WORK actively reports 29 focused transition/schema/stored-gate/projection tests GREEN; CLI persistence suite RED at the intended missing module. PLAN extends the deadline to 2026-09-10T15:50:00+07:00. Independent review findings on lifecycle, receipt provenance, integration ownership, real-user acceptance, retry timing and cleanup authority were sent to the same WORK for bounded fixes before acceptance. No terminal PASS or model escalation.

2026-09-10T15:41:00+07:00: final review verified six previous registry findings resolved and sound atomic Work persistence within the cooperative-local boundary. Remaining cleanup repository-claim binding and command-input realpath confinement were fixed by the same WORK. PLAN also required round release to preserve accepted history without leaving active ownership behind. WORK actively reports registry/CLI 44 tests GREEN; neighboring checks and code commit pending. This remains pre-acceptance implementation review.

## Implementation acceptance

PLAN accepted code handoff coordination-registry-01-r0 at exact commit 0e28f4b906b263398a54a895cc1bcdd561e3a171 after the full worktree npm run check passed (205 records tests, 189 source-document tests, 60 app tests, build and six Chromium e2e scenarios). Evidence evidence-flowdoc-coordination-six-2026-09-10 is registered. Probe r1 and code r0 were accepted in arrival order through the persisted CLI queue. Post-acceptance data generation/check and 62 focused data/lifecycle/projection tests passed. Main integration gate and cleanup remain pending; ownership is retained until the main gate and cleanup decision. Product maps remain unchanged.

Initial main gate stopped at PROJECT_INDEX_STALE: PLAN appended the final acceptance prose after its last regeneration, so the generated document content lagged two source documents. No product repair was involved. PLAN regenerated from canonical sources in the original worktree and rechecked before retrying main. Further integration remained held during this repair.
