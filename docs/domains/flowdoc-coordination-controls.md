# FlowDoc coordination controls

## Authority Boundary

Project Control owns this coordination contract under
flowdoc-product-development-resumption > agent-and-skill-design,
phase-agent-and-skill-design-coordination-six and
checklist-agent-and-skill-design-coordination-six. Evidence target:
evidence-flowdoc-coordination-six-2026-09-10. This contract defines agent
workflow, not Core, Backend, Editor, typing performance, or map truth.

This is a supporting contract for the six controls below when PLAN uses a real
separate WORK room. The current workflow authority is
`docs/domains/flowdoc-workflow-economy-policy.md`; it decides whether a room is
needed and owns size, risk, authority, proof, document, context, completion, and
stopping policy. Existing historical evidence remains bounded to its recorded
revision. This contract never authorizes an unrelated new task.

## 1. Ownership before dispatch and integration

### New PLAN round isolation

One PLAN task owns exactly one execution round. New PLAN task means a new
delivery round and a fresh execution context. A new PLAN creates a new Work
execution record and version 3 registry with a fresh round ID, dispatch set,
room run, handoff ID, WORK task, worktree or branch, and Return Channel before
dispatch. Version 1 coordination is historical and read-only. Version 2 is also
historical and read-only. Cross-PLAN
ownership transfer is not supported. The current PLAN must not send, wait,
revise, resume, or hand off through an older PLAN or WORK task. Missing history
is recovered through separate read-only Historical Recovery Work; it never
reactivates the inspected PLAN or WORK task. An older PLAN or WORK task remains
historical and read-only; receiving a correction request does not reactivate it.

The same WORK room may receive a Revision Packet only while the same PLAN task
and delivery round remain active. After a new PLAN task starts, unfinished or
incorrect work becomes a newly defined lane in the new round. Prior accepted
commits, Evidence, and Project Control records may be referenced only as
immutable input. An unmerged candidate, dirty worktree, branch, room registry,
conversation, liveness state, or Return Channel is not reusable execution
state. Reconcile retained value separately, then materialize any approved input
into the fresh round without attaching the older task or worktree.

An older task may be inspected only for an explicit audit or evidence-recovery
request and never regains execution authority. Before every dispatch, compare
the active task identity with the packet's PLAN task ID, monitor owner, and
Return Channel. Any mismatch stops dispatch; do not repair it by sending a
message to the older task.

Resolve a stable Work scope, owner repository, PLAN task, current round ID,
lane, Phase, Checklist and Evidence target before dispatch. The
same scope cannot have two active PLAN owners. Overlapping scope must be
explicitly split or assigned to one PLAN; different lane names alone do not
make edits independent. Record the overlap decision and allowed files.

One integration owner holds the merge turn for each repository across PLANs.
Before taking that turn, read the latest canonical registry on main and verify
that the expected PLAN/round identity and base commit still match. A stale
worktree cannot authorize its own merge. Serialize integration, verify the
candidate against current main, merge, run the main gate, then release the
turn. A failed gate freezes further integration for that repository while the
same-round WORK receives a Revision Packet. If a new PLAN task has started,
open a new round and fresh WORK context instead. Preserve the failed round's
worktree and evidence as historical material pending reconciliation.

Cross-PLAN ownership transfer is not supported. A new PLAN creates a distinct
Work execution record and version 3 registry without moving live execution
context from an older PLAN. Older PLAN and room records remain reviewable
history, but their late output cannot be accepted by the new round. Cancellation
similarly removes acceptance authority; it does not erase unique code or
authorize deletion.

The file-first registry provides validation and local write-conflict checks.
It is not a distributed mutex or proof that an uncooperative room obeyed the
contract. A different host, stale clone or unregistered PLAN must synchronize
with the designated integration owner before writing shared scope. On an
unresolved collision, stop integration and report RISK or BLOCKER.

## 2. Sent, received and accepted are different

Each terminal handoff identifies PLAN, round, room, lane, owner,
revision attempt, stable handoff ID and payload. A resend uses the identical
ID and content. One attempt has one terminal handoff. Corrected terminal content
requires a PLAN-authorized new attempt and new handoff ID; the old attempt is
superseded before the replacement is dispatched. Compare canonical payload
content (or its digest), not JSON key order. Different content under an existing
ID is an error, never a harmless duplicate.

WORK actively pushes the handoff to PLAN with send_message_to_thread when
available. A successful send is transport evidence only. PLAN records receipt
in the durable inbox before acknowledging the handoff ID. Receipt is not
acceptance. WORK may finish locally after a successful push and must state
receipt-pending until PLAN acknowledges; it must not wait in an endless loop.

For a failed or ambiguous send, retry the same payload at most twice (three
total attempts), after 10 seconds and then 30 seconds. If still unsuccessful,
record return-channel-failed and preserve the local handoff locator. Never
invent a receipt. On a pending receipt, PLAN checks its inbox and task state;
WORK does not generate new IDs to try to force progress.

Each packet supplies a concrete liveness deadline and monitor owner. Default
code-lane deadline is 20 minutes from dispatch; no-edit probes use 5 minutes.
PLAN may extend only after observing new progress, recording the observation
and next deadline. Checkpoints are not an always-on scheduler: if PLAN is
inactive, these deadlines are evaluated on resumption. A future unattended
monitor must be separately configured and evidenced before claiming timely
wakeups. Missing acknowledgement or progress after deadline is classified
before recovery, not silently treated as success.

Inbox arrival order is assigned once on first valid receipt. Exact duplicates
reuse that receipt and do not create another completionQueue item. Process
BLOCKER, FAIL and Contract Change Request ahead of ordinary PASS, then the
recorded acceptance order and arrivalSequence. Only the current round and
attempt can advance acceptance. Wrong-room, wrong-PLAN and superseded returns
are rejected/quarantined with a reason; retain their locator for reconciliation.

Acceptance records the reviewer, decision, exact evidence, required checks and
remaining scope. A rejected transition must leave the active registry state
unchanged. PLAN separately records the rejection reason and locator in durable
audit notes; that audit must not advance the room or acceptance state.
Restart reads persisted state instead of reconstructing room status from chat.
Persist the observed sender and return channel with the receipt. This is a
retrievable provenance declaration checked against the registered task, not
cryptographic authentication of manually edited files.

For a current policy v2 room, acceptance also runs the workflow policy's Scope
Lock verifier against the registered worktree. PLAN persists only a passing
verification containing the exact base and terminal commits, packet and
manifest digests, changed-file set, verification time, and clean-state marker.
Missing, dirty, stale, or mismatched verification rejects acceptance without a
registry write. This section defines the separate-room command mechanics; the
Workflow Economy Policy remains authority for when Scope Lock applies and what
it means.

## 3. Durable registry and validation boundary

New dispatched rounds use the optional `coordination` object on the canonical
Work record in `data/work/`, validated by the normal Project Control pipeline.
Record ownership, room attempts, return state,
context acknowledgement, usable locator, model decision, UX gate and evidence
requirements before activation. Preserve sent and received distinctions and
explicit superseded/closed states. Historical Work without this registry stays
readable; it does not gain validated orchestration status retroactively.

The standard Project Control gate must reject structurally malformed and
semantically conflicting stored registries, including states written by hand.
Behavior tests exercise transitions, persistence/resumption, duplicate content,
stale PLAN/round identities, missing evidence and competing ownership. Text-presence
tests protect documentation routing only; they do not prove room behavior.

Local write operations use an exclusive short-lived writer guard and expected
revision comparison before atomic replacement. A conflicting write fails for
the caller to reload and retry deliberately. Never force-unlock an unknown live
writer. These checks protect cooperating processes on one shared filesystem;
manual Git edits, multiple clones and distributed races still require the
integration ownership protocol above.

### Local registry commands

From the Project Control checkout, run `npm run coordination -- validate` to
validate canonical sources, including stored and cross-Work coordination state.
For a transition, place the command JSON inside that checkout and run:

```text
npm run coordination -- apply --work data/work/<work>.json --expected-revision <revision> --command <command.json>
```

Before integrating an accepted current candidate, run the read-only preflight:

```text
npm run coordination -- preflight-integration --work data/work/<work>.json --handoff <id> --repository <path> --base-ref <ref>
```

It rejects a non-accepted handoff, changed base or HEAD, changed packet or
manifest digest, unexpected repository root, missing verification, or dirty
worktree. It does not merge, edit, or promote truth.

Read the current Work revision before constructing the command. Supported
operations activate or supersede an attempt, authorize a revision, record
send/receipt/acknowledgement, accept or resolve a handoff,
and release a completed round. `release-round` requires the current PLAN,
resolved room attempts and handoffs, an empty queue, resolved cleanup decisions,
and no frozen integration claim. It closes accepted rooms and releases ownership
while preserving their accepted evidence history. Operationally release only
after the integration/main gate and cleanup decision; the command does not run
Git or infer gate results from the filesystem.
The typed command contract lives in `src/model/coordination.ts`. Packet creation
and initial registry setup remain Project Control record maintenance subject
to schema and semantic validation; the CLI does not open Codex tasks or send
messages. A revision conflict requires reloading current state. A held writer
guard requires inspecting its owner; the command never force-unlocks it.
Regenerate the read models after a successful canonical update.

## 4. User experience acceptance

Before dispatch, classify user-facing behavior as UX-applicable or explicitly
not-applicable with a reason. UX-applicable lanes declare:

- the user action sequence and expected visible behavior;
- the fixture/corpus, input method, browser/device and relevant environment;
- a measurable criterion and measurement method for each claimed outcome;
- a durable evidence target and the actor who will inspect it;
- which mechanism checks and regression checks also must pass.

The registry must distinguish a declared visible behavior change from a UX
exemption. A visible change cannot use not-applicable. UX acceptance records
pending, passed or failed measured checks and, when user trial is required,
pending, accepted or rejected user acceptance with actor and evidence. An
unprovided result is pending, never passed. Only measured PASS plus actual
user acceptance when required can close UX acceptance.

Mechanism PASS can be recorded while UX remains pending. It cannot close the
user-facing Checklist item or promote UX readiness. If user trial is required,
record the actual user's acceptance separately from automated verification;
never substitute agent approval for it. User acceptance identifies the actor as
a user and cites the source of their decision; an agent actor cannot satisfy it.
An explicit not-applicable decision
is appropriate for internal record tools, but not as a way to bypass a visible
behavior change.

For the later typing-latency lane, agree document sizes, typing/Enter sequence,
test duration, hardware/browser, key-to-visible measurement, percentile and
maximum delay limits, and no-loss/no-reordering checks before execution. This
phase does not set arbitrary performance thresholds or claim that typing is
fixed. Demonstrating eventual complete text alone does not prove responsive
typing. Scope or threshold changes require PLAN review before acceptance.

## 5. Cleanup and approval scope

Approval to execute an ordinary delivery round includes cleanup of that
round's clean, fully merged worktree and branch after worktree and main gates
pass. The designated integration owner performs or explicitly delegates it;
WORK never merges or removes a lane merely because its local tests passed.

Before removal verify exact repository, branch, worktree path, clean tracked
and untracked state, merged ancestry or reviewed patch equivalence, required
main gate, and whether a live user trial/process still needs the worktree.
If any condition fails, retain and report the blocker. Never recursively delete
a path to bypass a failed Git cleanup; inspect residual files first.

Historical, abandoned, unmerged, dirty or unknown lanes require reconciliation
and a recorded retain/merge/discard decision. Current-round cleanup authority
does not grant blanket permission to delete them. Ask for an owner decision
only when the retained value or authorization is unresolved; preserve existing
user authorizations instead of repeatedly asking.

## 6. Deliberate WORK model selection

PLAN may use GPT-6 to retain cross-lane context and acceptance responsibility.
WORK does not inherit that choice. Before opening or revising each WORK, record
the actual model ID and reasoning effort plus:

- task complexity and scope size;
- uncertainty and the missing context, if any;
- consequence and recoverability of an error;
- why this model/effort is sufficient for this particular deliverable;
- why a cheaper/smaller available option is or is not adequate;
- the observed host capability source and time, plus `availableModelEfforts`
  containing observed model IDs and their valid effort values; the selected
  pair must be present in that snapshot;
- measurable escalation triggers and the unchanged acceptance requirements.

Start with a smaller available model for bounded, explicit, readily checked
work. Consider a midrange model for multi-file implementation with known
contracts. Consider GPT-6 for unresolved cross-boundary reasoning or repeated
demonstrated limitations after fixing missing context. These are routing
hypotheses, not a guarantee that models are interchangeable or a permanent
ranking. Choose effort independently; maximum effort is not a default.

Review failure first for unclear scope, missing input, environment, acceptance
criteria and packet quality. Correct those before attributing failure to the
model. After two bounded revisions fail for the same reasoning limitation,
PLAN records evidence and changes model/effort on the same usable WORK task,
or splits the lane. Record every change and invalidate superseded attempts.
If the selected model is unavailable, reassess from the actual host choices;
never silently fall back to GPT-6 or claim a model switch that did not occur.

The host tool's model/effort capability list is the dispatch authority. Official
[model guidance](https://developers.openai.com/api/docs/models) and
[reasoning guidance](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.5)
inform evaluation, but API availability or price is not evidence of this
account's Codex availability, billing, or task quality. Evaluations and fresh
acceptance results govern continued selection. No pricing table is frozen here.

## Kickoff and acceptance additions

A packet includes PLAN/round identity, integration owner, current attempt,
model decision, UX applicability and criteria, retry/receipt rules, deadline,
expected handoff ID and acceptance evidence. Context Acknowledgement repeats
these boundaries. An acceptance review verifies current ownership and attempt,
authentic locator/sender, received payload, required evidence and UX status.

Close each round with coverage of all six controls, exact code/evidence refs,
which scenarios were simulated versus live, gate results, cleanup state and
unresolved limits. Do not promote product maps from coordination success.
