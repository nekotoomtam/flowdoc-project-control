# Service Worker Launcher/Broker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans`
> for separately authorized inline implementation. Do not dispatch another room
> or agent merely because this plan has several steps.

**Status:** PROPOSED for product implementation. P0 copy mechanism passed on
2026-11-02 (22/22 final cases). P1 component candidate passed on 2026-11-02;
P2–P5 and actual Service integration are not started.
**Review completed:** 2026-11-02; source/evidence baselines are the revisions below.
**Goal:** Connect Service-owned worker launches to verified per-worker memory
envelopes without changing document contracts, allocation policy, or Core.
**Architecture:** Preserve direct-child execution and the existing credit owners.
A minimal blocked bootstrap authenticates to a narrowly scoped privileged broker;
the document payload starts only after kernel placement is independently checked.
**Tech Stack:** Existing Node/TypeScript Service, Python standard library, Linux
cgroup v2, Unix-domain sockets, existing Oracle lab and cached native Core package.
**Spec:** [Current M20 plan and copy evidence](flowdoc-service-model20-support-plan-2026-11-01.md).

## Authority, scope, and budgets

Authority Boundary: Project Control owns this cross-boundary implementation plan;
it is not implementation Evidence or permission to install a privileged service.
The explicit user request governs this single-room planning task. Execution,
Phase, and Checklist IDs are not applicable; no closed execution is reopened.
Roles: Planning Partner / Cross-Repo Boundary Reviewer; documentation owner is
Project Control. Future product owner is Service. No Core change is proposed.

Planning inspected canonical PC `2d73cc0`, clean Service candidate
`codex/service-model20-m1-20261101` at `257bdd5`, and the retained copy receipts.
Candidate path: `C:/Users/nekot/Documents/GitHub/flowdoc-service-worktrees/service-model20-m1-20261101`.
Resolve a fresh isolated Service candidate and exact base before implementation;
this plan does not authorize writing either development checkout or the dirty C1
Core lane. Reconcile the plan if these inputs change.

- Current work: read implementation/evidence and write this plan plus a short link
  in the existing M20 plan. No new lab run or Core/Service mutation.
- Future scope: launcher/broker boundary, its callers, lifecycle/readiness, and
  focused tests. No document-stage codec, Core refactor, model mapping change,
  DB migration, Core/package pin change, or business recovery operation.
- Keep `512 MiB = 536870912` bytes per worker, swap allowance zero, existing
  `1g-2cpu` aggregate `1 GiB / 2 CPU`, and existing coordinator/allocation budget.
  The aggregate includes coordinator and worker descendants; two 512 MiB limits
  do not promise that two full-size workers plus coordinator can fit at once.
- Broker control-plane memory must be accounted inside that aggregate without
  increasing the existing base credit. P0 must prove placement and restart order;
  an additional unaccounted host daemon budget is not an accepted shortcut.
- Keep XML/drawing/output/file limits, credits, pressure thresholds, slot policy,
  native pins, deadlines, fencing, delivery evidence and reservation rules.
  Lab helper PID limits are not new product limits.
- No real data, real service stop, push, release, installation, production compose
  modification, dependency installation, or silently privileged app container.
- Work size: substantial, one product owner. Current task is read-only planning;
  future implementation risk is **critical** because a privileged process can
  migrate/terminate processes if its identity boundary is wrong.
- Proof Budget: reuse the existing receipts; one bounded copy security suite P0,
  then focused tests per implementation step, then one integrated acceptance
  suite. Repeat only after a relevant failure/change. No large-document capacity
  experiment or new audit/report series is needed for launcher acceptance.
- Document Budget: this reusable contract/plan and one existing-status link.
  No new Work/Evidence registry, generated projection or system map promotion.
- Model decision: no new WORK is dispatched here. A new PLAN defaults to
  `gpt-6-astra` / `medium`; authorized implementation must record its own model
  decision from the then-current host availability snapshot, not inherit PLAN's
  choice. This document makes no claim about an unavailable host snapshot.

## Implementation facts and connection points

Paths/lines below are at Service `257bdd5`, not proposed implementation.

| Path | Existing behavior | Required connection / ownership |
| --- | --- | --- |
| `src/jobs/render.ts:10-25` | `renderPinnedJob` / `renderDocumentJob` directly spawn Node; binary stdin/stdout, detached process group; input serialized before suspended frames | Bound renderer factory; preserve serialization lifetime and full-group stop proof |
| `src/tasks/render.ts:245-296` | Python file-limit launcher execs Node; advanced IPC FD3, fence FD4; child tracked and DB PID recorded | Two-phase blocked launch; track/record before binding/start; retain RPC, lease and file limiter |
| `src/jobs/processor.ts:29-44,80` | Legacy execution obtains/relinquishes its existing worker grant; render fallback exists | Inject bound renderer; required mode must reject a missing injection rather than use the fallback |
| `src/tasks/processing.ts:265-342` | Queue hands worker grant into execution; `releaseWorker` follows settlement | Keep this owner; launcher must not reserve another worker credit |
| `src/fonts/preflight-gate.ts:25-43`, `src/fonts/readiness.ts:72` | Font preflight uses nonblocking DB permit and existing worker grant; readiness invokes renderer | Bind a renderer to the gate dependency; native call remains inside `.run` |
| `src/fonts/review.ts:26-42`, `src/fonts/lifecycle.ts:29` | Font-admin review inspects fonts and directly renders specimens while a transaction holds advisory lock 60430416 | Inject inspector and per-render preflight wrapper using that existing client; no ungated specimen bypass |
| `src/images/prepare.ts:25`, `src/images/job.ts:56` | Image child fork uses JSON IPC, receives input immediately; serial preparation | Bind before sending paths; reuse legacy job's grant; preserve image limits and JSON transport |
| `src/fonts/inspection.ts:9-21` | Serial Python `execFile`; parser timeout/output bounds, no governor worker grant | Bound inspector; preserve parser queue and allocation policy; do not invent another 320 MiB grant |
| `src/fonts/service.ts:97`, `src/fonts/heightProfiles.ts:63`, `src/fonts/review.ts:33` | Three inspector callers, plus nested library construction in `lifecycle.ts:27` | Thread the inspector through all factories, including nested construction |
| `src/server.ts:43-54`, `src/tasks/intake.ts:164`, `src/http/server.ts:27-44` | Composition, processing context, readiness and shutdown; font-admin currently receives a different ready predicate | One explicit launcher instance; include its readiness everywhere and close admission before drain |

`rg` inventory of Service child-process imports also finds `src/tasks/ownership.ts`.
Its owner helper is coordinator control-plane/fence management, not a document
worker; moving it into a worker envelope would couple fence survival to worker OOM.
The font CLI calls HTTP rather than constructing a native renderer locally.

There is another explicit control-plane exception: `src/server.ts:40` calls
`loadBundledResources` before listening. Read directly from the pinned
`vendor/flowdoc-core-0.5.2.tgz`, `dist/runtime/probeRuntime.js` executes fixed native
protocol probes and a Python/fontTools version query. It does not receive document
input. Keep it in the existing coordinator budget and test that classification;
do not claim every native subprocess is a document worker. Archive SHA-256 remains
`ed876f4d011ad943ead937307af9123581c231124cab198de34f60b832f6a532`.

## Reusable proof and its limits

Reuse `C:/Users/nekot/Documents/FlowDoc-recovery/`:

- `service-model20-m4-delegation-20261101/verification.json`:
  `PASS_DELEGATION_SPIKE_ONLY`; permissions, child OOM isolation and cleanup.
- `service-model20-m4-handoff-20261101/verification.json`:
  `PASS_COPY_PRE_EXEC_IPC_FENCE_ONLY`; all ten final copy cases pass, including
  direct PID/FD continuity, advanced IPC and owner/fence behavior.

These are synthetic helpers, not authenticated production broker, real document
outputs, actual Service wiring, DB reservation recovery or six governor tests.
The delegation spike intentionally OOM-killed a child; the handoff spike did not.
Its helper-crash case is not broker-daemon death. Lab UID 65534 must not become a
product constant: current Dockerfile uses UID/GID 10001.

## Proposed contract: application ownership stays in Service

Create `src/workers/{contracts,config,broker-client,launcher}.ts` and a minimal
`runtime/python/worker_gate.py`. Add host-side code under `runtime/broker/` only
after P0 passes. The broker never renders, reads document bodies, commits DB
status, chooses delivery outcomes, acquires queue credits, or launches an
arbitrary executable. Its journal owns enforcement leases, not business state.

```ts
type WorkerKind = 'legacy-render' | 'font-preflight' | 'task-render'
  | 'image-prepare' | 'font-inspect';
interface WorkerLauncher {
  isReady(): boolean;
  spawnBlocked(spec: ApprovedLaunchSpec): Promise<BlockedWorker>;
  closeAdmissions(): void;
  drain(): Promise<void>;
}
interface BlockedWorker {
  readonly child: import('node:child_process').ChildProcess;
  readonly identity: { pid: number; pgid: number; startTime: string };
  bind(): Promise<BoundProof>;
  start(): Promise<void>;
  stop(reason: string): Promise<StoppedProof>;
  waitStopped(): Promise<StoppedProof>;
}
```

`ApprovedLaunchSpec` is internal, constructed by fixed-kind adapters with existing
signal/deadline/file-limit inputs. It does not accept untrusted executable/cgroup
paths or memory limits. Document/image/font paths travel to unprivileged workers,
never to broker commands. No global mutable renderer/launcher singleton.

Required ordering:

1. Existing admission owner obtains its existing credit/permit.
2. Launcher arms a bounded one-use launch and creates the direct child, blocked
   on gate FD5. Attach error/close cleanup before returning the handle.
3. Task caller tracks ownership and records existing child PID/host fields.
   Failure here stops the blocked child; no native payload has run.
4. `bind()` lets the bootstrap claim its own authenticated peer identity. Broker
   authorizes race-safe self-placement in a root-owned worker envelope. Parent and bootstrap
   independently verify membership, PID/start identity, memory and swap limits.
5. `start()` commits that binding in the current broker epoch and sends GO. Only
   then send legacy stdin, task `init`, or image JSON. No test-only `bound` message
   is added to the task application IPC protocol.
6. Run existing protocol and limits. On finish/cancel, stop the whole worker
   scope and await direct-child close/reap, existing full process-group checks
   including zombies, and broker scope-empty confirmation.
7. Only confirmed stop permits ownership untrack, workspace/reservation cleanup
   and existing-owner credit return. A timeout/unknown result quarantines the
   scope and readiness; it does not count as stopped or trigger resubmission.

Task FD3 remains Node advanced serialization, FD4 remains the exact fence open
file description. Legacy has no application IPC FD3. Image IPC retains JSON
serialization. Gate FD5/6 close before payload exec; broker credentials must not
leak to Core, native descendants, argv, environment or logs. The existing task
file-bound wrapper remains inside the bound group. Owner helper stays outside it.

## Proposed privileged broker boundary

P0 must prove this proposal on copies before product implementation:

- Root-owned Unix stream socket directory and immutable operator anchor manifest;
  Service only connects. Socket peer credentials are obtained from the kernel,
  not JSON. UID/GID match alone is insufficient: anchor the exact coordinator
  PID/start identity, process namespace and owned cgroup root. App/worker get no
  Docker socket, host-root cgroup write mount, controller/common-ancestor write,
  root app user or privileged mode.
- Trusted lab/deployment bootstrap pins that anchor, executable/gate digests,
  allowed kinds, unchanged profile and existing deadline maxima. Broker is not
  given arbitrary root paths/PIDs from HTTP or worker payloads. Anchor rotation
  requires old scopes fenced and empty. No production installation is part of
  this plan or its lab proof.
- Coordinator `REGISTER` keeps a live authenticated control connection and gets
  an epoch capability. `ARM` authorizes a one-use launch ID/kind/nonce. The
  blocked child `CLAIM`s over its own socket: target PID comes exclusively from
  that peer, must be the registered coordinator's direct child and match the
  armed identity. Use a stable peer pidfd; prove `SO_PEERPIDFD` availability and
  semantics. No unreviewed raw-PID fallback or caller-specified PID migration.
- Peer pidfd authentication alone does **not** make a subsequent numeric
  `cgroup.procs` write atomic with identity validation. P0 must close that gap.
  Preferred copy experiment: bootstrap writes `0` (itself) to a one-use target
  descriptor received over its authenticated Unix socket, then closes it before
  GO. This avoids selecting a recycled numeric PID. The descriptor must be opened
  under a dedicated non-root delegation identity confined to this owned root,
  not unrestricted root opener credentials. Neither the coordinator nor payload
  gets that descriptor or a writable common-ancestor handle. No source
  implementation is allowed until credential containment, descriptor lifetime
  and cancellation are proven; otherwise revise the placement design first.
- Broker supports only `REGISTER`, `ARM`, `CLAIM`, `COMMIT`, `CANCEL`, `WAIT_EMPTY`
  with version, epoch and opaque lease IDs. Four-byte length framing, maximum
  8192-byte JSON frame, strict keys/types, bounded connections/pending arms,
  monotonic expiry not extended by retry, no document bytes. Unknown commands,
  stale epoch, traversal, arbitrary argv/limit/PID fields and replays fail closed.
  Proposed transport safeguards: one registered coordinator; at most two document
  arms/scopes and one serial inspector arm/scope; at most 16 unauthenticated
  connections; five-second frame timeout and ten-second arm timeout, each clamped
  to the existing remaining execution deadline. These bound the new control
  protocol, not the document/XML/runtime budgets. Validate load behavior in P0.
- An identical retry can return its existing binding only while peer pidfd,
  epoch and nonce match. A lost acknowledgement cannot cause another scope,
  another payload start, a renewed deadline or a reused-PID migration.
- Use anchored directory FDs and symlink-safe operations; create opaque worker
  names internally. Limits and directories stay root-owned; do not copy lab
  permission delegation into the product. Worker descendants inherit the same
  envelope, including native subprocesses. Keep parser serialization separate
  from the two existing document slots; an inspector does not create a third
  document slot or silently consume another worker credit.
- Trusted bootstrap runs with an isolated Python startup (`-I -S` or demonstrated
  equivalent), sanitized loader environment, no document input and closed GO.
  Python site customization/preloads must not execute a payload before binding.
  This preserves the proven pre-exec model; it is not placement from the child's
  first instruction. Bootstrap allocations before migration remain within the
  coordinator/aggregate budget; payload work starts after binding.
- A supervised broker death closes admission and causes worker cancellation.
  A root-owned, narrowly scoped stop/restart reaper handles only recorded owned
  scopes and verifies emptiness before a new epoch; app never guesses that
  broker death implies worker death. No broad host/container/process scan/delete.
  If broker is unavailable and stop cannot be confirmed, keep grants and fence
  protection. Reject automatic reconnect-and-resume of an old active scope.
- A kernel-empty cgroup or exited pidfd alone is not proof that every child was
  reaped. Combine broker scope proof with existing Service group/owner checks and
  the namespace init reaper; test escaped descendants and zombies explicitly.
- Broker/reaper mount and capability restrictions and aggregate accounting need
  measurement in P0. Never add broad privileges to the app or raise the
  coordinator budget to make this pass. An unsupported boundary is a blocker.

Security assumption: the operator/kernel and immutable bootstrap are trusted;
document inputs are not. `argv`/script-path checks alone are not executable
attestation. The placement descriptor must remain kernel-confined even if a peer
misuses it: test an attempted nonzero write targeting a disposable foreign-root
lab helper, `/proc` descriptor theft, inherited/duplicated socket descriptors,
and attempted capability inheritance into payload/native children. Do not open a
general migration descriptor as root and rely only on a cooperative Python script.

External API facts informing this proposal, not runtime evidence:
[Linux unix(7)](https://man7.org/linux/man-pages/man7/unix.7.html) documents
connected-peer credentials; [kernel cgroup-v2 documentation](https://www.kernel.org/doc/html/latest/admin-guide/cgroup-v2.html)
documents hierarchical limits, delegation containment and migration accounting.
In particular, moving a process does not move already charged memory; count the
bootstrap separately rather than treating a membership string as complete proof.
The proposed self-placement/FD constraint comes from inspection of
[Linux v6.17 cgroup implementation](https://github.com/torvalds/linux/blob/v6.17/kernel/cgroup/cgroup.c):
`cgroup_procs_write_start` resolves zero as the current task, while
`__cgroup_procs_write` checks delegation using the file opener's credentials.
That is support for a proposed experiment, not proof on the Oracle kernel build.

## Readiness, failure, and compatibility decisions

Propose `FLOWDOC_WORKER_ISOLATION=disabled|required`, validated in new
`src/workers/config.ts`. `disabled` preserves the explicit old behavior and makes
no 512 MiB isolation claim. In `required`, Linux/cgroup/broker/governor/DI
prerequisites are mandatory before admission; no fallback direct spawn, even if
task credentials or the governor are absent. Initially support only the tested
`1g-2cpu` topology; other profiles need explicit review, not an automatic downgrade.

Readiness is existing ownership/storage/governor/font-gate readiness AND launcher
readiness. Broker loss, invalid placement or uncertain stop makes admission
unready; process liveness and readiness remain distinct. Validate settings before
allocating resources; initialize launcher before starting processors/listeners.
On shutdown close admissions, abort/drain processing, prove groups stopped, then
close owner/fence and pool. Do not remove an occupied cgroup or scratch directory.

Preserve existing API vocabulary where it fits: broker absence is infrastructure
unavailability, not invalid font/document content. `WORKER_STOP_UNCONFIRMED` must
reach the credit/permit owner even when a public font report normalizes errors.
Do not let `review.ts` or `inspection.ts` catch/finally release a live writer's
permit or continue to the next parser/specimen. Internal poison state survives
public error mapping. No business retry or delivery-status inference is added.

Font-admin specimen rendering currently bypasses the worker grant: in required
mode propose running each specimen render through the existing preflight gate,
using the already checked-out transaction client. Inspection finishes before
acquiring that render grant. This extends existing admission enforcement to an
admin path and may report busy/unavailable where it previously overlapped work;
it is an explicit behavior change for implementation review, not an unchanged
behavior claim. Do not add a second blocking advisory lock; preserve nonblocking
60430407 while 60430416 is held and test contention/rollback.

## Implementation sequence and acceptance

Every product step below is **not started**. First write the named failing tests,
confirm the intended failure, implement only that step, read the final diff,
then run focused tests and commit the Service candidate. No source repair occurs
inside verification; a failed check returns to implementation. Freeze scope after
its acceptance passes. Do not merge/push/install as an implied final step.

### P0 — Copy-only broker security/topology gate

- [ ] Prepare a bounded copy fixture outside Core/Service, reusing the current
  handoff inputs, cached image and isolated Oracle lab. Prove UID/GID 10001,
  authenticated Unix socket/peer pidfds, exact root/namespace identity and
  root-FD containment with no app privilege or controller writes.
- [ ] RED/GREEN cases: same UID but wrong coordinator/cgroup; forged peer fields;
  expired/replayed nonce; PID exit/reuse; malformed/oversized/partial frames;
  forbidden PID/path/argv/limit fields; ack lost after binding; cancellation
  before/during bind; broker daemon SIGKILL/restart; coordinator death; child
  escapes process group; zombie; stale epoch after container recreation.
- [ ] Prove self-placement and constrained opener credentials, ancillary FD
  framing/closure, foreign-root migration denial, descriptor theft/duplication
  containment, and no placement capability after exec. A check-then-write numeric
  PID implementation is not accepted as a race-safe solution.
- [ ] Measure broker/bootstrap accounting under the unchanged aggregate and
  confirm runtime-root cleanup/restart order. Kill only owned lab processes.
  Verify fixed startup probes and owner helper remain coordinator control-plane.
- [ ] Accept only if all security and stop proofs pass, bootstrap exec cannot
  precede binding, root/worker limits stay unchanged and cleanup is scoped. If
  pidfd, supervision or budget topology fails, stop and revise this plan; do not
  start P1 or weaken assertions. This gate does not close M20-4.

### P1 — Launcher, strict client, gate and scoped broker

- [x] Add `src/workers/{contracts,config,broker-client,launcher}.ts`,
  `runtime/python/worker_gate.py`, `runtime/broker/{worker_broker,worker_reaper}.py`
  and tests `tests/worker-{broker-protocol,launcher}.test.mjs`. Preserve P0's
  verified privilege/profile boundary; no automatic host-service installer.
- [x] RED: missing broker, invalid proof, bind timeout/cancel/error, frame limits,
  same-request retry, FD leakage, early input and exit-before-ready. Demonstrate
  a blocked direct child before writing the adapters.
- [x] GREEN: exact state transitions, stable PID/PGID/start identity, 512 MiB/swap0
  proof before GO, closure of gate/capability FDs, bounded cleanup and explicit
  stop-unknown result. Launcher contains no call to `tryAcquire` or `releaseWorker`.
- [x] Run build and those tests; commit `feat(workers): add verified blocked launcher`.

### P2 — Legacy, font preflight and image worker adapters

- [ ] Edit `src/jobs/render.ts`, `src/jobs/processor.ts`,
  `src/fonts/{preflight-gate,readiness}.ts`, `src/images/{prepare,job}.ts`.
  Use a renderer factory bound to launcher and a renderer dependency bound to
  the font gate; readiness executes it only within the existing gate `.run`.
  Thread an injected image preparer through `ImageJobDependencies`.
- [ ] Add `tests/worker-legacy-wiring.test.mjs` and
  `tests/worker-image-wiring.test.mjs`. RED: data sent before bind, required-mode
  missing renderer injection, double credit, early refund and changed image IPC.
- [ ] GREEN: binary legacy roundtrip, exact result/error codes, existing output
  limit, cancellation/reap before refund; image JSON and limits unchanged;
  serialize before suspension so large input is not retained across launcher
  waits. Preserve disabled-mode compatibility without a required-mode escape.
- [ ] Build and run focused new tests plus `font-preflight-gate` and
  `fonts-readiness`; commit `feat(workers): bind legacy and image execution`.

### P3 — Task transport, ownership and existing reservations

- [ ] Edit `src/tasks/{render,intake,processing}.ts` only for launcher injection
  and ordering. Keep `runtime/python/{task_launcher,task_python,task_owner}.py`
  unchanged unless a separately reviewed contract need is demonstrated.
- [ ] Add `tests/worker-task-wiring.test.mjs`. RED: init before bind, DB PID update
  failure while blocked, fence FD replaced/closed, JSON replacing advanced IPC,
  cancellation racing bind, owner untrack/refund before full stop.
- [ ] GREEN: real task child advanced Buffer/BigInt/Map/typed-array RPC, exact
  FD4 file identity and stale fence rejection, existing file limiter, stream
  backpressure/reader-closed credit behavior, group kill/reap, failed DB save and
  reservation cleanup without duplicate execution. A lost broker ack does not
  spawn/start a second child. Reuse F1/INT-01 behavior; do not rewrite recovery.
- [ ] Build and run new tests plus affected task ownership/render/governor tests;
  commit `feat(workers): bind task execution without changing ownership`.

### P4 — Font-admin/inspection injection and fail-closed composition

- [ ] Edit `src/fonts/{inspection,service,heightProfiles,review,lifecycle}.ts`,
  `src/http/{fonts-admin,server}.ts`, `src/server.ts` and the intake/context
  injection touched in P3. Carry bound inspector through all three callers and
  nested `createFontLibrary` construction. Retain parser queue, timeout and
  maxBuffer; launcher does not charge an inspector worker grant.
- [ ] Inject per-specimen preflight wrapper from `fonts-admin` into lifecycle/
  review using the existing transaction client. Normalize public errors only
  after preserving stop-unknown/poison state. No mutable global renderer.
- [ ] Add `tests/worker-{font-wiring,readiness}.test.mjs`. RED: any remaining
  required-mode direct-spawn/default-gate path, admin ready while launcher is
  down, parser advances after uncertain stop, wrong transaction client or
  nested factory loses injection. GREEN: no bypass across enabled HTTP routes;
  lock contention fails promptly; rollback and public error semantics hold.
- [ ] Startup fails before processor/listener when required prerequisites are
  missing; broker loss blocks new work. Shutdown drains workers before owner
  close; restart cannot rebind an old active lease. No hidden budget increase.
- [ ] Build; run new tests plus affected `fonts-admin`, `fonts-lifecycle`,
  `fonts-height-profiles`, `fonts-intake` and `font-quota-lock-order` tests;
  commit `feat(workers): enforce scoped launch readiness across Service`.

### P5 — Actual Service acceptance in the isolated Oracle lab

- [ ] Use a lab-only topology/overlay and the exact built candidate/pinned Core.
  Non-root app, no Docker socket/host-root cgroup write, no production compose
  changes. Capture exact source/image/config/kernel/limits and before/after owned
  scope inventory. No new package install or production connection.
- [ ] Run actual Service launches for legacy PDF, task PDF/DOCX, image preparation,
  actual-input font preflight, admin specimen, and font inspection. Include
  model18/19 compatibility and supported M20-1/2/3 contracts. Verify valid output
  artifacts and representative content; synthetic `%PDF-LAB` is insufficient.
- [ ] Run all **six unchanged** cases in
  `tests/font-preflight-admission.test.mjs`: queue rejection before native launch;
  serialized native work/one 320 MiB grant; headroom reject/recover; abort group
  before credit return/retry; cross-DB permit prevents native work; authoring
  queue/receipt idempotency. The aggregate must enable the real governor while
  each data worker is independently capped at 512 MiB.
- [ ] The current suite creates `gate=createFontPreflightGate(resources)` directly
  at line 6; running that old setup could exercise disabled/direct-spawn behavior.
  Update only its setup/teardown to inject the real bound renderer/launcher and
  lab anchor, preserving all six bodies and assertions. Record the setup diff;
  add placement observations without weakening old expectations. Keep this real
  native component suite distinct from the actual HTTP Service runs above.
- [ ] Re-run the ten handoff scenarios through real launcher wiring where
  applicable and P0's broker-death/restart cases. Inspect limits and descendants,
  stop/reap order, credit baseline and actual DB reservations. On intentional
  worker OOM, confirm no root-local OOM/coordinator death, other work isolation,
  no automatic resend and recovery only after teardown. One unexpected OOM:
  stop; do not increase RAM/caps or continue into large documents.
- [ ] Accept this integration only with complete criteria-to-evidence coverage,
  unchanged source during verification and no unsupported fallback. Original
  M20-4 and broader M20-5/full-suite gates remain separate until their full
  criteria pass; selected tests/native screenshots do not close them by proxy.

### Reproducible command boundary for authorized execution

Use existing cached lab tooling; these are future commands, not results from this
planning turn. Do not run `npm install`/`npm ci` or regenerate tracked files during
verification. Build outputs and temporary test outputs belong to the isolated
candidate/lab output area. Record the exact compiled tree used for native runs.

```text
# Each implementation step: confirm its new tests fail for the intended reason,
# then rebuild and run the same command after implementation.
npm run build
npm test -- tests/worker-broker-protocol.test.mjs tests/worker-launcher.test.mjs
npm test -- tests/worker-legacy-wiring.test.mjs tests/worker-image-wiring.test.mjs tests/font-preflight-gate.test.mjs tests/fonts-readiness.test.mjs
npm test -- tests/worker-task-wiring.test.mjs tests/task-ownership.test.mjs tests/task-processing.test.mjs tests/task-queue-resources.test.mjs tests/task-runtime-recovery.test.mjs tests/task-delivery-finalization.test.mjs tests/task-artifact-receipt.test.mjs
npm test -- tests/worker-font-wiring.test.mjs tests/worker-readiness.test.mjs tests/fonts-admin.test.mjs tests/fonts-lifecycle.test.mjs tests/fonts-height-profiles.test.mjs tests/fonts-intake.test.mjs tests/font-quota-lock-order.test.mjs
# P5, in its owned Oracle/native topology with a disposable DB identity:
npm test -- tests/font-preflight-admission.test.mjs
npm test -- tests/model20-assembly.test.mjs tests/model20-contract.test.mjs tests/model20-storage-db.test.mjs tests/model20-migration.test.mjs tests/model20-authoring-api.test.mjs
```

The final command preserves the M20-1/2/3 cases, including their model18/19 checks.
The original M20-4 `model20-tasks-api.test.mjs` target remains the separate current
plan's gate; this launcher plan does not invent a PASS for that not-yet-added test.
Do not turn an absent prerequisite or skipped case into PASS.
P0's new copy harness must expose one bounded command and a machine-readable
case receipt before execution; its root/bootstrap setup is outside product repos.

## Review focus and stop conditions

| Failure class | Required review/test |
| --- | --- |
| Wrong process/root or privilege escape | P0 peer identity, pidfd lifetime, immutable anchor, root-FD/path/field rejection, P1 strict framing |
| Native work before placement or broken ABI | P1 blocked state/FD closure, P2 stdin/image JSON, P3 advanced IPC/fence, P5 real child/native output |
| Duplicate allocation, false stop or leaked credit/reservation | P2/P3 existing grant owners, uncertain-stop poison, lost ack, DB failure, P5 six admission tests |
| Missing caller/default fallback or misleading health | Full import/call inventory, P2/P4 DI assertions, admin/inspector paths, startup and shutdown tests |
| Hidden resource increase or incomplete recovery | P0 broker/bootstrap accounting, P4 no new grant policy, P5 root/worker limits and broker/container restart |

Self-review of this planning change: mapped both primary renderer launches and
the image/inspector/admin paths; distinguished fixed startup/owner control-plane;
kept enforcement ownership separate from credits/DB; required broker security
proof before privileged integration. No claim of runtime PASS is added here.

Remaining verification gaps: authenticated broker/pidfd support, restricted host
supervision/accounting, real Service ABI/DI, parser/admin contention under the
unchanged budget, original six governor cases and actual reservation outcomes.
These are explicit prerequisites/tests, not defects proven by this review.
The next authorized action should be **P0 copy-only**, then review its terminal
result before Service P1. No product branch integration is authorized by this plan.

## P0 execution result — 2026-11-02, copies only

User authorized P0 in this same room, retaining 512 MiB per worker and the existing
coordinator budget; Core/Service edits, real data/service operations and
push/release/install remained forbidden. Active role: Cross-Repo Boundary
Reviewer / discovery, then PC Steward for this status update. Execution IDs N/A.
The preceding next-action paragraph is retained as planning history; P0 now has
the following bounded copy result. It does not authorize P1 implementation.

**PASS_P0_COPY_ONLY — accepted attempt a4, 22/22 cases.** Verifier:
`C:/Users/nekot/Documents/FlowDoc-recovery/service-worker-broker-p0-20261102/verify.py`.
Artifacts are outside product repositories. The verifier checks frozen fixture
hashes, case assertions, exact resource/container state, production identity
metadata, unchanged Service/Core development/candidate and retained C1 hashes.
Canonical PC base for execution was `a28a341`; Service stayed at `257bdd5`.

| Criterion | Observed proof / scope |
| --- | --- |
| Actual PID reuse | Namespace PID **11** reused, start time **48163963 → 48164493**. Original peer pidfd remained exited; old claim denied, stale cancel did not kill replacement; fresh binding and payload succeeded |
| Race-safe placement | Bootstrap self-writes zero through a descriptor opened as delegated UID/GID **65532**, then closes original/duplicate before exec. Peer pidfd remains identity/liveness proof, not a numeric migration shortcut |
| Scope/permission containment | Foreign-root lab helper migration denied **EACCES**. App UID10001/CapEff0 could not open seven controller/common-ancestor/procs paths for write; parent `/proc` descriptor theft denied; payload inherited no migration/socket descriptor |
| Connection authentication | Wrong same-UID coordinator, forged/forbidden fields, wrong nonce, expired/replayed leases, oversize/partial/deep malformed frames rejected. A child inheriting the registered socket/capability was rejected using **per-message SCM_CREDENTIALS**, not only connect-time SO_PEERCRED |
| Cancellation | Before bind, during live migration-descriptor handoff, and before GO: no payload. Cancel is irreversible; late PLACED cannot restore bound state; stop proof requires peer exit and empty scope |
| Broker fault/restart | SIGKILL before GO and with an escaped-process-group writer; restricted reaper observed all tracked PIDs reaped and scopes empty before new epoch. Four distinct epochs in final run; fresh work succeeded and stale epoch was rejected |
| Coordinator death | Broker drained workers after coordinator SIGKILL; host observed empty scopes/tracked PIDs gone **without issuing worker kills to make that case pass** |
| Resource accounting | Worker kernel cap **536870912**, swap **0**; aggregate **1073741824 / 2 CPU**, including broker/opener/reaper/coordinator. Fixture aggregate peak **37.1171875 MiB**, no OOM events; this is not native document capacity evidence |
| Privilege roles | App UID/GID10001, CapEff0. Host-injected broker copy had CHOWN/KILL/SETGID/SETUID only (mask225); reaper CapEff0; both no-new-privileges and charged inside aggregate. Injector is a privileged test controller, not a product broker role |
| Cleanup / protected systems | Final accepted container exited0, all owned attempts stopped. Three protected Docker identity records unchanged; no production API/SQL/storage read or mutation. Service/Core/C1 source boundaries passed |

The PID counter adjustment occurred only after verifying the injector's private
PID namespace matched the owned container and differed from host. It was not a
forced host-global PID reuse experiment. The root operator prepared only a new
labelled lab scope; no service-manager unit, software or account was installed.
The VM is the Oracle/OCI lab; these process-control tests do not connect to Oracle
Database or constitute a database test.

### Retained failures and resulting contract requirements

All attempts remain available; earlier failures are not relabelled PASS:

- **a1 FAIL**, 15 completed cases: the inherited Python socket wrapper did not
  restore timeout on a nonblocking descriptor. Corrected only test transport;
  per-message rejection assertions retained.
- **a2 RED**, 17 completed cases: `CANCELLED_BIND_REACHED_BOUND` confirmed a
  **prototype** race. After target FD handoff but before self-migration, CANCEL
  saw an empty target scope; the later PLACED reply could restore bound state.
  This is not a newly confirmed Service defect: the broker is not in Service.
- Fix only the copy: latch stopping before kernel actions, pidfd-kill the known
  bootstrap even while it is still in coordinator, require `state == binding`
  for PLACED, and require peer exit plus scope empty before final cleanup. Same
  cancel-during-bind case passes in a3 and a4; no assertion weakened.
- **a3 GREEN**, 22/22. **a4 GREEN**, same22/22 plus explicit app-controller write
  denial/capability observations and reaper peak metadata, closing a permission
  coverage gap. No further lab workload was needed after this acceptance.

These findings refine P1's implementation requirements: stable peer identity,
kernel-confined opener credentials, per-message writer identity, irreversible
cancel, descriptor closure and combined exit/scope/reap proof are mandatory.
Do not copy a numeric-PID migration or connect-time-only authentication adapter.

### Evidence locators and remaining boundary

Base: `C:/Users/nekot/Documents/FlowDoc-recovery/service-worker-broker-p0-20261102/`.
Use `verification.json`, `postflight.json`, `accepted-attempt.json`, `packet.json`, `progress.json`,
and `attempts/a4/{packet.json,*.py,oracle/receipt.json,oracle/out/*}`.
`attempts/a1`, `a2`, `a3` retain exact source/receipts for transport failure,
cancellation RED and preceding GREEN. Read the accepted packet's hashes before
reuse; the fixture is a discovery artifact, not an installable Service package.
Report: `C:/Users/nekot/.codex/visualizations/2026/10/27/01a17da5-b6ab-7ff0-a66c-e46d7e2cf42d/flowdoc-oracle-broker-p0-20261102/verification-report.html`.

No actual Service worker, Core/native document, API/DB task, reservation/delivery
or original six governor test was executed. Prior direct-child/advanced IPC/fence
evidence remains only its unchanged prior copy proof; real wiring remains P1–P5.
Fixed resource probes/owner helper retain their source-defined control-plane
classification; they were not executed through this new broker fixture.
Production supervision/packaging, portability, explicit bootstrap loader-env
allowlisting/adversarial preload tests, bounded terminal-cache/pidfd retention
and reconnect/backpressure hardening still require P1 review/tests. The copy
launch used isolated/no-site Python with trusted fixture environment; it did not
prove rejection of malicious loader configuration or every product worker kind.
P0 passes only the bounded kernel/authentication/lifecycle copy proof above;
it is not production readiness, M20-4 closure or permission to begin P1.

## 2026-11-02 — P1 component candidate result

The owner subsequently authorized P1 in a separate Service candidate. Inline
Product Implementation / Evidence Review, then Project Control Steward;
registered execution IDs are not applicable. Scope is P1 only, with no Core,
existing application wiring, DB, migration, dependency or package changes.

Candidate: `codex/service-worker-launcher-p1-20261102`, commit `2f6cf43`,
base `257bdd521dc2298dbb714308363b1b0d432809da`, worktree
`C:/Users/nekot/Documents/GitHub/flowdoc-service-worktrees/service-worker-launcher-p1-20261102`.
Fifteen new files implement strict framed RPC, fixed-kind blocked launcher,
isolated Python gate, scoped broker, delegated-FD opener and recovery reaper,
plus regression tests. No consumer imports the launcher yet. There are no
launcher calls to resource acquisition/refund owners.

### Evidence and coverage

Durable repository tests: `tests/worker-broker-protocol.test.mjs`,
`tests/worker-launcher.test.mjs`, `tests/helpers/worker-broker-policy.py` at the
candidate commit. Machine-local evidence root:
`C:/Users/nekot/Documents/FlowDoc-recovery/service-worker-launcher-p1-20261102`.
`verification.json` independently matches all307 bundled source/test/config
hashes across final `green4`, final `native5` and the candidate; the15 new staged
Git blobs also matched. Protected Core/Service development checkouts, M20 base
candidate, C1 source hashes and Core vendor archive remained unchanged.

- Initial RED records missing implementation. Helper-FD cleanup and empty
  partially configured scope recovery each have a retained failing regression
  followed by GREEN. Earlier compilation, namespace and claim failures remain
  under their original attempts; none are relabelled as passing.
- `green4`: build passed; protocol5 and launcher boundary2 passed, native14
  skipped in that unprivileged test context. Skips are not acceptance evidence.
- `native5`: native launcher file16/16 passed, no skips, on the isolated
  Oracle/OCI Linux VM. Together these are21 unique Vitest cases, not23.
  This is Docker/kernel component proof, not Oracle Database proof.
- Coverage includes blocked child/early-input rejection, stable PID identity,
  512 MiB/swap0 verification before GO, repeated bind/start, cancellation before
  and after binding, escaped descendants, advanced IPC and exact fence FD4,
  silent-gate timeout, forged receipt rejection, broker loss, drain racing ARM
  and identity acquisition, and unknown teardown before handle registration.
- Python policy checks cover bounded slots/cache, evicted replay rejection,
  helper failure FD cleanup/reaping and empty partial-scope recovery. Actual
  kernel negative probes reject nested PID peers and ancestor procfs views;
  an actual crash/reaper probe removes an empty unconfigured journalled scope.
- Worker scopes ended empty; aggregate memory events report zero OOM/kill.
  Lab aggregate1 GiB, swap total1 GiB,2 CPU; observed aggregate peak438,194,176
  bytes is fixture evidence only. App UID10001 drops all capabilities; broker
  retains caps225, reaper drops all. Final lab container exited0, no owned
  container remained running, and known production container identities were
  unchanged (metadata comparison only).

One fresh review found drain/start and broker-loss bootstrap races plus a helper
FD leak on wait failure. These were repaired and covered by the final runs.
Unknown stop remains latched and closes readiness; it does not reconnect,
silently retry work or claim confirmed resource release.

### Deployment constraint and remaining gates

Preserving the P0 capability boundary requires the broker to share the pinned
Service PID namespace and matching procfs view. Cross-UID nondumpable namespace
symlinks were unavailable under the original caps; the implementation checks
its own namespace identity plus kernel NSpid vectors and rejects nested/ancestor
views instead of adding SYS_PTRACE. This is a narrow topology requirement;
production placement/packaging remains P4, not demonstrated portability.
See the Linux [proc status](https://man7.org/linux/man-pages/man5/proc_pid_status.5.html)
and [PID namespace](https://man7.org/linux/man-pages/man7/pid_namespaces.7.html)
semantics for that restriction.

P1 component scope is PASS. The fixed default legacy entry was reached with
invalid input (expected failure), not a successful document render. No API job,
DB/reservation/delivery test, image/font adapter integration or original six
governor acceptance tests ran. P2–P5, application startup/health composition,
M20-4 closure, product integration and production readiness remain open. Nothing
was merged, pushed, released, installed or changed in real data/services.
Next recommended authorized scope is P2 adapters; do not bypass grant owners.
