# Service model20 support — proposed design and phased plan

Authority Boundary: Project Control canonical PROPOSED Service support design.
Service owns persistence, API/capabilities, admission and lifecycle; Core owns
model20 definition/request/composition semantics. This document is not product
acceptance, implementation authorization, a release plan or a migration runbook
for real data. It does not change the existing stage/checkpoint contract.

Current scoped status, reviewed2026-11-02: clean Service candidate
`7b25ff2` includes M20-1/2/bounded3, the runtime schema guard and the
P1–P5 launcher/broker integration. P5-01 is fixed; scoped P5 passed72 cases,
including all six unchanged governor cases and actual model18/19 HTTP delivery.
The original P5 failure and all earlier scoped results are retained below.
See the [focused launcher/broker result](flowdoc-service-worker-launcher-broker-plan-2026-11-01.md).

| Stage | Current evidence boundary | Remaining |
| --- | --- | --- |
| M20-1/2/3 | Definition/contract/storage/migration/authoring subset passed; five focused suites34 cases reran in P5-01 | No promotion to native20 task delivery or unsupported granular authoring |
| M20-4 | Actual worker isolation and six governors passed through P5-01; initial topology blocker resolved | Native20 /jobs/preview/documents, instance/asset isolation, same-pinned-Core output comparison and model20 interruption/retry |
| M20-5 | Genuine027→028 upgrade/failure rollback plus required-schema startup guard passed; missing028, bad checksum and matching028 verified | Old binary compatibility, recovery after20 writes and complete Service-suite case coverage |

Full model20 support remains NOT accepted. The next bounded plan is
[M20-4/M20-5 continuation](#m20-4m20-5-continuation-plan--2026-11-02).
Latest T0 result: **PASS schema guard correction**,61 selected checks including
all three actual startup controls. The [original T0 failure](#t0-execution-result--2026-11-02)
is preserved; the [correction result](#t0-schema-guard-correction-result--2026-11-02)
supersedes that blocker. Native20 T1/full model20 acceptance remains unrun/open.
No integration, push, release or installation was performed.

## Request, baseline and scope — initial 2026-11-01 planning context

Owner requests review and planning ONLY. Planning Partner / Cross-Repo Boundary
Reviewer then PC Steward; single-room execution IDs N/A. Current PC44d6bd2,
Servicea572025, Core3e74f98 checked locally; product checkouts clean. Service's
actual Core0.5.2 vendor pin is ed876f4d... from the preceding lab proof. Generated
Current Truth Snapshot is dated2026-10-04 and concerns unrelated registered Work;
this bounded request and referenced current contract govern this review.

Review outcome is a Service-owned plan; no Core/Service/C1 changes, new Oracle
connection/workload, real data/service stop or push/release/install in this round.
Keep512MiB PER WORKER/BUNDLE and every existing policy/output/XML/source cap.
Service coordinator/profile totals are a different budget and are not changed
to512MiB. Oracle lab means the isolated Oracle/OCI host with Service's pg-backed
database, not a new Oracle Database adapter.

Source owners: Service=C:/Users/nekot/Documents/GitHub/flowdoc-service-worktrees/development;
Core=C:/Users/nekot/Documents/GitHub/flowdoc-core-worktrees/development.
Implementation locators below are relative to those owners. Reusable evidence:
[TP1/TP2](flowdoc-core-stage-handoff-contract-2026-11-01.md#2026-11-01--tp1tp2-executed-bounded-structural-constraint),
including the real model20 task-compose success and Service decompose rejection.
That41.23MiB composition result is NOT renderer or full Service compatibility.

## Original baseline incompatibilities — retained diagnosis

The table below describes pre-M20 Servicea572025, not current candidatef23ed86.
M20-1/2/3 results below resolve their bounded rows; the current-status table and
continuation plan describe what remains. Retaining this diagnosis does not reopen
the original failures or invalidate the later passing evidence.

| Boundary | Implementation evidence | Status and consequence |
| --- | --- | --- |
| Relational assembly | templates/assembly.ts:14,25,31,74; decompose/checkRecord admit18/19, row.key comes from model19 ID or legacy key | Runtime-confirmed model20 rejection in TP2. Adding20 to an allow-list alone leaves model20 row.key undefined; the definition's sectionKey needs explicit mapping |
| Client input contract | templates/contract.ts:5 handles19 then rejects anything except18; http/server.ts:48-52 returns it | Source-confirmed missing20 branch. A successfully loaded template would still lack a valid advertised request contract |
| Draft save/validate and clone | authoring/service.ts:88-91,106,122 | Save/validate explicitly18/19; model changes require a new draft; clone special-cases19 and otherwise uses a generic fallback. Do not let20 silently enter that fallback |
| Granular Section operations | authoring/sectionOperations.ts:21,37; sectionInstances.ts:10 | Explicitly model19 saved-instance operations; they do not implement request-defined model20 instances |
| Current/published ownership in DB | migrations/021_section_instances.sql:20,34 | Latest ownership function definitions classify only15..19 as section-owned; model20 takes the incompatible legacy branch. Runtime PostgreSQL failure is not yet tested |
| Preview/legacy job prepared pin | migrations/021_section_instances.sql:45-67; latest protect_job_input in025_task_output_format.sql:18-61, especially50-56 | Only19 gets nodeModelVersion and prepared schema2 handling; Core20 produces prepared schema3 and a20 pin. Source mismatch; DB/runtime verification remains required |
| Capability publication | http/authoring.ts:34; tools/authoring.ts:29-35 | Advertises18/19 and array-by-id saved model19 Sections. Generic JSON tools are not proof of20 compatibility |
| Runtime composition | Core data/taskInput.ts:23,65-87; composition/composeSections.ts:16-20 | Core already resolves sectionKey/instanceKey, preserves request order and emits instance-scoped IDs. Service streaming, images, fonts and native PDF/DOCX remain integration proof gaps |

The SQL findings are implementation-derived incompatibilities, not newly
observed production failures. No claim that a database migration was run here.
Latest source migration is027;025 replaces protect_job_input from021, while021
still supplies the ownership and preview functions. Plan against the latest
function definitions, not whichever historical migration first introduced them.

## Proposed semantics and support boundary

Use the existing relational source of truth, with Core-validated model20 JSON
assembled from it. Do not add a second opaque model20 JSON side-store or silently
convert model20 to19: both would hide identity, ownership or request semantics.
A full rewrite of all Section tools in one change is unnecessary; split support.

| Identity | Proposed treatment |
| --- | --- |
| DB Section row UUID | Internal storage/ownership identity, retained by reconcileDefinition through source definition ID |
| Definition sections[].id | Persist in SectionRow.sourceDefinitionId; a reusable definition, not a runtime occurrence |
| Definition sections[].sectionKey | Persist in SectionRow.key for20; remove duplicate copy from row.payload and reassemble sectionKey explicitly. Keep18 key and19 ID mappings unchanged |
| Request sections[].instanceKey | Unique only within one request; reuse across different jobs is valid. Never persist occurrences as definition Section rows or cast instance-<key> to a UUID |
| Runtime Section | Core's instance-<instanceKey>, definitionId and source map remain authoritative; do not reconstruct them in Service |

The first support increment should allow a NEW model20 identity, full-definition
save/get, validation/font readiness, pinned preview, existing administrative
register/publish/load functions, contract discovery, /jobs PDF and /documents
PDF/DOCX. This is a proposed bounded capability set, not a claim it works today.
Public authoring publicationEnabled:false stays false; lab exercises existing
administrative publication functions rather than opening a new public route.

Keep model19 Section create/import and whole-template clone unavailable for20
with an explicit version/capability error in the first increment. Retain the
same-model save guard: no implicit18/19→20 conversion. Later definition-aware
create/import/clone and explicit conversion need their own small design for ID,
reference, font-provenance and deletion semantics. Never advertise those as20
features because full-definition save works.

For a retained20 definition ID, reconcile by ownership rather than array position.
A valid sectionKey rename is a new draft revision; previously published versions
keep their old key/fingerprint. Core must validate updated examples/references.
Do not reuse model19 section_instance_history for request instanceKeys. Preserve
server-owned origin/font provenance checks for20 as well as19.

## Phased implementation and proof plan

Future work is primarily one isolated Service candidate; Core and its pin stay
unchanged unless a concrete missing Core API is separately demonstrated. Medium
to large implementation, routine planning risk; persistence/integrity failures
escalate on evidence. Future PLAN defaults to Astra/medium; WORK must independently
record actual host tooling/model availability. No dispatch/model switch now.

### M20-1 — Preserve definitions and expose the right request contract

- [x] Add failing focused tests in tests/model20-assembly.test.mjs and
  tests/model20-contract.test.mjs for20 decomposition, record validation,
  assembly and reconcileDefinition; unchanged18/19 fixtures stay exact.
- [x] Implement the mapping above in src/templates/assembly.ts and review
  src/authoring/adapter.ts. Preserve fingerprints, formats, row groups, sizing,
  images, links, headers/footers, numbering, schema1/2 and font references.
- [x] Extend src/templates/contract.ts. Return nodeModelVersion20, definition
  IDs/sectionKeys and request-defined instance semantics; leave18/19 response
  shapes intact. Include one A,B,A example with distinct instanceKeys.
- [x] Distinguish public raw requests from internal encodings: /documents uses
  sections array with sectionKey,instanceKey,data and supported header/footer/
  assets; preview and /jobs use the existing Core prepared-generation input
  shape, which is not the raw section-assets task shape. Prepared schema3,
  normalized Core flowdoc-task-input/2 and Service normalization_version2 are
  different contracts; do not rename Service task/job envelopes for model20.
- [x] Check roundtrip and source identity assertions, not type equality or
  merely absence of exceptions. Do not enable capabilities at this partial stage.

### M20-2 — Database ownership and pinned input integrity

- [x] Add tests/model20-storage-db.test.mjs and tests/model20-migration.test.mjs
  against synthetic model18/19 data in an isolated source-schema027 PostgreSQL.
- [x] Add a NEW migration, proposed028_model20_section_definitions.sql if the
  slot is still free. Never edit applied021/025/027. Extend ownership functions
  to recognize20 with the existing section ownership rules and retain deferrable
  FK/unique constraints for current AND published records.
- [x] Extend protect_preview_input from021 and the LATEST protect_job_input
  from025 with exact Core20 pin/prepared-schema3 checks. Preserve19/schema2 and
  all existing18 behavior. Copying the old021 job function would lose task pins
  and PDF/DOCX output-format immutability; regression tests must detect that.
- [x] Exercise freshRecord/writeCurrent/writeSnapshot, registerTemplate,
  publishCurrent/loadTemplate and font-retention snapshots in real transactions.
  Assert record ownership, stable IDs and immutable published fingerprints after
  draft edit/reorder/key rename, including header/footer/area-format ownership.
- [x] Prove registration/publication retries and concurrent saves keep existing
  idempotency/expectedRevision rules; mid-transaction failure leaves no partial
  current graph, snapshot, receipt or reference set.

Existing tables have text key/source_definition_id and instance diagnostics use
text section_id (022:37,023:17), so a new occurrence table is not currently
justified. This is a schema-reuse proposal pending DB tests, not proof that no
additional constraint change can be needed.

### M20-3 — Bounded authoring support and accurate capability discovery

- [x] Add tests/model20-authoring-api.test.mjs for new model20 save/get/validate,
  origin/reference ownership, font readiness and preview on an exact revision.
  Modify src/authoring/service.ts without weakening principal, revision, receipt,
  template identity or same-model guards.
- [x] Guard unsupported20 clone/create/import paths explicitly; preserve model19
  implementations in sectionOperations.ts/sectionInstances.ts. A generic clone
  fallback is not acceptance of definition-aware cloning.
- [x] Update src/http/authoring.ts capability discovery only for verified20
  features. Keep sectionInstances model19/array-by-id distinct from model20
  request assembly; qualify groupLabelSpans/formatSizing per tested model.
  Review src/tools/authoring.ts descriptions without claiming plugin/Editor
  adoption. Whole-definition tools must point to the route-specific contract.

### M20-4 — Real input/lifecycle and native output in Oracle-host lab

- [x] First prove that the lab can bind the512MiB hard limit to each actual
  worker/process bundle through its launch/exit lifecycle. Do not lower the
  Service coordinator profile or treat a shared1GiB Service cgroup as a per-worker
  limit. The existing standalone worker lab does not prove this real-API wiring.
  If isolation cannot be established without unreviewed product/resource-control
  changes, BLOCK this stage and return a lab-topology proposal; do not run an
  unbounded API worker or invent a passing512MiB claim.
- [ ] Add tests/model20-tasks-api.test.mjs and cover legacy /jobs/preview plus
  actual /documents normalization/worker paths; no lab-only parent adapter may
  stand in for this acceptance. Keep library font/schema2 provenance checks.
- [ ] Use A(first),B(middle),A(last) with different values. Assert ordered output,
  distinct instance source IDs, correct repeated header/footer, numbering,
  local/cross-instance references and independent image/asset keys. Same asset
  key in different instances must not leak across instance-<key> ownership.
- [ ] Compare valid model20 output to the SAME pinned Core's native output for
  that input. Use semantic text/order, source/diagnostic identity and parsed DOCX
  package assertions, not ZIP/PDF byte equality affected by nondeterminism.
  Verify downloaded bytes/receipts and retain existing DOCX field-refresh and
  wordVerified status; do not imply native Word layout verification without it.
  Source identity from an independent reference composition remains a reference,
  not an in-worker object capture; use actual emitted diagnostics/output for
  assertions about the Service result.
- [ ] Invalid/empty/duplicate-instance/unknown-section input rejects without
  published output or leaked queue/storage reservations. Account for any input
  deliberately retained under the existing recovery TTL; see the continuation
  plan's held-versus-used checks. Verify limits and errors remain authoritative
  in Core; preserve current max2000 instances,50k expansion budget and Service
  record/image/XML/output caps. No new giant stress/SRS workload is required.
- [ ] Run one bounded interrupted request and retry using the existing lab
  lifecycle controls; check pinned revision/version, no duplicate delivery,
  no stuck task/reservations and accurate status. Reuse prior lifecycle evidence
  for unchanged mechanisms, but not as proof of new20 identity handling.

### M20-5 — Compatibility and rollback gates before any later integration

- [ ] Upgrade027→new migration with synthetic current/snapshot/model18/19/job
  fixtures, including pending work. Inject migration failure; function definitions
  and migration ledger must roll back atomically. Check old fingerprints/data
  and selected old behavior remain unchanged after a successful upgrade.
- [ ] Test old binary with upgraded schema and18/19-only data. Before admitting
  model20 writes, the new binary must confirm its required schema is present.
- [ ] Binary rollback BEFORE20 data is admitted can reuse that proven path.
  AFTER20 current/snapshot/job rows exist, old Service cannot be assumed to read
  them. Define the refusal/compatibility or forward-recovery route first; do not
  downgrade SQL, delete20 rows or coerce20→19 as an automatic rollback. Rehearse
  backup/restore or forward recovery on disposable lab data only.
- [ ] Build with the pinned toolchain and run focused new tests, then the full
  Service suite because shared persistence/triggers/admission changed. Review
  the final diff before checks. No full Core/PC suite is implied by unchanged
  owners; apply their consumer checks only for concrete changed interfaces.

Suggested commands after future dependencies/build prerequisites are verified:
`npm run build`; then `npm test -- tests/model20-assembly.test.mjs tests/model20-contract.test.mjs tests/model20-storage-db.test.mjs tests/model20-migration.test.mjs tests/model20-authoring-api.test.mjs tests/model20-tasks-api.test.mjs`;
then `npm test` in the isolated Service test environment. No auto-install or
passing claim when the Linux tooling, fonts, DB or native backend is unavailable.

## Resource, acceptance and stop rules

Lab/test fixtures only, existing limits; hard512MiB memory AND memory+swap per
worker/bundle. Current accepted P5 topology has aggregate/coordinator1GiB/2CPU
and app pids-limit128; worker memory.swap.max=0. Earlier CPU1/pids96 values describe
standalone proof bundles, not additional limits implemented by the current
broker. Do not claim a per-worker CPU/pids cap from them. DB/Service coordinator
totals are separate and recorded; lab PostgreSQL remains512MiB/1CPU. Native
rendering uses real processes/fonts with measured peak,
zero OOM and cleanup checks. OOM/timeout returns to design; no heap tuning,
forced GC, higher cap, alternative renderer or silent fallback to19.

Proof budget: the six focused test files above, one small shared fixture family
covering18/19 compatibility and20 A,B,A; one small PDF and one DOCX workload plus
one bounded interruption/retry. Migration failure/rollback checks are correctness
requirements, not an open stress/audit loop. One final review/fix cycle; stop
once scoped criteria pass. Document budget: this new canonical plan and one
link in the existing handoff contract; reusable lab JSON/results later. No new
Work/registry/map merely for this plan. Local evidence is not product truth.

Phase-one acceptance requires ALL: exact storage/fingerprint preservation,
real DB ownership/pin checks, route-specific contracts, saved-revision previews,
successful native task PDF/DOCX with instance isolation, rejected invalid input
without leaked resources,18/19 regression suite and a truthful rollback boundary.
Selected tests or a Core-only result cannot promote full Service support.

Open decisions: model20 granular definition create/import/clone and explicit
18/19 conversion are DEFERRED; plugin/Editor/native Word adoption is DEFERRED;
database trigger/runtime compatibility, real-API worker limit isolation,
512MiB native20 behavior and rollback
after20 writes are BLOCKING for implementation acceptance. They do not authorize
experiments in this planning-only round. A missing Core20 capability or changed
contract needs a separate owner decision, not an incidental Core patch.

This plan does not alter the TP1/TP2 structural constraint: model20 admission
alone does not add per-member conditional cell topology or establish the old
pending-label Service witness.

Planning self-review covers scope, ownership/type distinctions, latest-trigger
precedence, route-specific inputs, old-model compatibility, worker-limit isolation
and rollback after new data. No product tests or lab runs were performed in this
planning round; only the changed documentation is validated.

## 2026-11-01 — M20-1 candidate implementation result

Owner authorizes M20-1 only, separate Service candidate, no Core/real-data/service
stop/push/release/install; unchanged512MiB per worker/bundle and all caps. Inline
Product Implementation Agent then Evidence Reviewer/PC Steward; execution IDs
N/A. Canonical PC base073e64d and Service basea572025. Native worktree tool rejected
the Service sourceRoot because this chat's workspace is Project Control; explicit
git worktree fallback creates the authorized isolated candidate, not a new chat.

Candidate:C:/Users/nekot/Documents/GitHub/flowdoc-service-worktrees/service-model20-m1-20261101,
branch codex/service-model20-m1-20261101. Tested manifest exactly FIVE files:
src/templates/{assembly.ts,contract.ts}, tests/{model20-assembly.test.mjs,
model20-contract.test.mjs,helpers/model20.mjs}. No adapter edit was needed: tests
confirm reconcileDefinition already retains IDs by definition source ownership.
Candidate commit9f2050629d496b86ebefb2b461006416990e20b0 contains the tested content;
worktree is clean. No main/development/release integration was performed.

Implemented mapping: model20 definition sectionKey lives only in SectionRow.key;
its public definition ID lives in sourceDefinitionId. Reassembly restores
sectionKey, rejects duplicate sectionKey payload metadata and retains all checked
content/fingerprints. Existing18/19 mappings and their contract JSON stay exact.
The pure model20 contract now has definition id/sectionKey and additive metadata:
assembly={input:'array-by-section-key',instanceKey:'required-unique-per-request',
order:'request',reuseDefinitions:true}. Examples come from the validated template;
the function does not invent sample data. A-B-A is the tested template example.
No Core validation/renderer logic is copied, and no public capability list changes.

TDD evidence: first setup run stops before tests because Vite bundles config into
readonly node_modules. Lab runner uses native config loading and writable lab
cache. Second run finds one invalid schema2 fixture retaining legacy font fields;
that is not accepted as a feature RED. Correct fixture uses the genuine Core
schema2 font shape. All logs retained; no assertion weakened or cap changed.
Accepted RED:7 model20 failures from unsupported Service behavior,4 old-model
checks PASS, production source still unchanged. Exact new test/helper bytes then
run GREEN after the source patch: full Linux Service TypeScript build PASS and
48/48 tests PASS across13 files (11 new assertions plus37 existing pure assembly/
ownership/Section/area/page-band/numbering/group/cell-repeat/link regressions).

New checks cover schema1/2 rich roundtrip, group labels/sizing/image/link/font/
header/footer/numbering preservation, empty areaFormats, versioned examples,
reorder/key-rename identity retention, duplicate metadata/ownership rejection,
and real Core prepareGeneration/composeDocument for2 definitions→3 request
instances with distinct source/section IDs and FIRST/MIDDLE/LAST/header/footer.
Model18/19 contract JSON hashes match the unchanged pinned baseline function,
not newly generated expectations. No real DB, HTTP, native rendering/font
readiness or full Service-suite acceptance is claimed by these pure tests.

Oracle/OCI lab image07c7190 and existing dependencies reused with no install,
image build/pull or Core pin change (ed876f4d...). Full build/test bundle hard
limit512MiB memory and memory+swap; CPU1,pids96,networknone,readonly root/input.
GREEN peak373.296875MiB including compiler/tests; not native-render worker RAM.
Accepted RED peak153.27734375MiB. Zero OOM/timeout, successful process cleanup,
all owned containers stopped and real-runtime identity metadata stable. No real
SQL/API/log/storage access. All250 Core package files, protected Core/Service
HEAD/clean state and C1's original two dirty file hashes remain unchanged.

Acceptance is CANDIDATE-ONLY M20-1. M20-2 DB ownership/prepared-pin triggers still
block persisted20; M20-3 authoring/preview/capability, M20-4 real worker isolation/
native outputs and M20-5 rollback/full-suite gates remain OPEN. No merge to a
product main/development/release, push, tag, release or installation authorized.
One fresh-context read-only code/evidence review of all five files, unchanged
adapter, plan, harness and results found no Important/Critical actionable defect.

Evidence:C:/Users/nekot/Documents/FlowDoc-recovery/service-model20-m1-20261101/
{verification.json,red*/packet.json,red*/oracle/*,green/packet.json,
green/oracle/receipt.json,green/oracle/out-schema/{suite.json,test-results.json,
build.log,tests.log}}. Test outputs/compiled files stay outside the candidate.
Report:C:/Users/nekot/.codex/visualizations/2026/10/27/01a17da5-b6ab-7ff0-a66c-e46d7e2cf42d/flowdoc-oracle-service-model20-m1-20261101/verification-report.html.


## M20-2 scoped implementation and DB evidence — 2026-11-01

Subsequent explicit owner request authorizes M20-2 implementation in the existing
Service candidate and isolated PostgreSQL lab on Oracle/OCI. Role: Product
Implementation Agent, Evidence Reviewer, then PC Steward. Single-room execution
IDs remain N/A. This records DB-path acceptance only; it does not authorize or
complete M20-3+ or promote full Service model20 capability.

Candidate: C:/Users/nekot/Documents/GitHub/flowdoc-service-worktrees/service-model20-m1-20261101,
branch codex/service-model20-m1-20261101. Base9f2050629d496b86ebefb2b461006416990e20b0,
terminal85a4d0e314f96371e5d30e37c1969b06a370cdf1, clean after scoped commit.
Only new migrations/028_model20_section_definitions.sql, two DB test files,
tests/helpers/model20-db.mjs and eight exact migration-tail expectation updates
changed. Historical001-027 hashes, all src/package/vendor files, protected
Core/Service checkouts and the existing dirty C1 pair remain unchanged.

Migration028 reuses current/version ownership guards from021, preview guard
from021 and the LATEST job guard from025. Only modern-model membership20 and
exact model20/prepared-schema3 branches are added. Function-body comparison
confirms old18/19, Task-v1/v2, PDF/DOCX and immutable input/output-format branches
remain exact. No data rewrite, new occurrence table or constraint weakening.

Accepted RED on unmodified M20-1 source/schema027:5 passed (model18/19 registry
plus Task-v1 PDF and Task-v2 PDF/DOCX),4 intended model20 failures (registry,
current/publication, prepared pin, atomic write setup). Earlier lab controller/
network setup and incomplete Task fixtures were not accepted as feature RED;
logs retained. Existing Docker automatic network pools were exhausted; a new
internal /28 subnet was chosen after checking network-IPAM and host-route
metadata for overlap. No existing network/container was removed or changed.

GREEN: full Linux Service TypeScript build PASS;75/75 tests across15 selected
files PASS, plus1/1 selected font-height migration018 regression PASS. The other6
font-height cases were not selected and are not PASS claims. This is76 selected
tests, not a full Service-suite claim. Fresh read-only final review found zero
Critical/Important/Minor findings; it did not independently execute tests.

Coverage: real current/snapshot/registry/publication/font-reference transactions;
model20 exact roundtrip and stable definition/source IDs after reorder/key rename;
immutable old published fingerprint; current section/header/footer and published
ownership rejection; no20 request occurrences in the19 instance ledger; concurrent
registration idempotency and expectedRevision saves; publication retry receipts;
late font-reference failure rollback for current, publication and registration,
then successful retry. Genuine Core prepared schema3 drives exact preview and
published-job SQL pin fixtures, including schema/model/warnings tamper rejection.
Task-v1/v2 PDF/DOCX guards and legacy PDF-only behavior remain checked.

Upgrade proof uses fresh schema027 with synthetic18/19 current graphs, snapshots,
font-reference sets, instance history, publication receipts and pending jobs.
Applying028 once then replaying preserves their rows/pins and supports new old-model
jobs. An injected failure appended only to a temporary028 copy rolls back all four
function definitions, the checksum ledger and current graph; the real unchanged028
then applies successfully. Applied migration files are never edited.

Environment: cached immutable Service image07c71903922e..., unchanged Core0.5.2
vendor pin ed876f4d... (250 package files match), new PostgreSQL18.6 container,
new owned storage, internal network and no published ports. Worker/bundle memory=512MiB
and memory+swap total=512MiB (no extra swap); GREEN peak358.13671875MiB, cgroup oom=0/oom_kill=0,
no process left. DB has a separate512MiB cap and is stopped after each proof.
All owned proof containers stopped; protected runtime identity metadata stayed
exact. No real API/SQL/data/storage/log access, service stop, install, image pull,
push, release or main/development integration. Existing caps stay unchanged.

Remaining: M20-3 authoring/capability/font-readiness/API behavior, M20-4 admission/
normalization and M20-5 worker/native/full-flow proof. Model20 preview/job fixtures
here prove SQL input invariants, not native rendering, actual task dispatch or
end-to-end authoring support. Legacy font provenance is not native font readiness.

Artifacts: C:/Users/nekot/Documents/FlowDoc-recovery/service-model20-m2-20261101/
verification.json, review.json, verify.py, green/oracle/{receipt.json,
database-preflight.json,database-final.json,core-integrity.json,
out-schema/{suite.json,test-results.json,focused-0.json,build.log,tests.log}},
red6/oracle/out-schema/suite.json. Initial failed setup/fixture logs are retained.
Report: C:/Users/nekot/.codex/visualizations/2026/10/27/01a17da5-b6ab-7ff0-a66c-e46d7e2cf42d/flowdoc-oracle-service-model20-m2-20261101/verification-report.html.

No Work records, Evidence registry, system/DOCUMENT_MAP or generated projection
changed; this existing canonical plan/status is the sole prose update.


## M20-3 bounded authoring/API evidence — 2026-11-01

Explicit subsequent owner request authorizes Service candidate implementation
and synthetic Oracle/OCI lab checks. Owner Service; Product Implementation Agent,
Evidence Reviewer, then PC Steward. Single-room execution IDs N/A. Same512MiB per
worker/bundle, unchanged caps; no Core/real-data/real-service-stop/push/release/
install or product integration authority. Scope is the three M20-3 checklist
items, not M20-4 worker topology/native delivery or M20-5 full-suite acceptance.

Same candidate/branch as M20-1/2. Base85a4d0e314f96371e5d30e37c1969b06a370cdf1;
terminal257bdd521dc2298dbb714308363b1b0d432809da, clean. Four changed files only:
src/authoring/service.ts, src/http/authoring.ts, src/tools/authoring.ts and new
tests/model20-authoring-api.test.mjs. All28 migrations, packages/vendor and
protected Core/Service checkouts/C1 hashes remain unchanged.

Save/validate now admit20 alongside18/19 while preserving same-model revision,
identity, principal and receipt guards. Server-owned origin checks apply19/20.
Model20 clone explicitly returns VERSION_MISMATCH before creating an identity or
font-reference/receipt rows; existing model19 create/import implementations are
unchanged and reject20 on either side. Authoring discovery adds a bounded
sectionDefinitions contract: model20 array-by-section-key/request assembly,
unique instanceKey, reusable definitions, whole-definition authoring only and
createSection/importSections/cloneTemplate:false. Model19 sectionInstances and
groupLabelSpans/formatSizing capabilities remain19-only. Tool descriptions point
to /authoring/contract; no plugin/Editor adoption is claimed.

Accepted RED:1 passed/11 expected feature failures against unmodified M20-2
source. In the18/19 cases, save/get/validate succeed but conversion-to20 is still
classified INVALID_DATA by the old allow-list rather than VERSION_MISMATCH; the
whole cases are correctly RED, not PASS. Other failures expose20 save/validate,
origin-path protection, generic clone fallback and missing discovery/tool hints.
Exact new test bytes then run GREEN after the three-source-file patch.

Accepted GREEN2: full Linux TypeScript build PASS,73/73 selected tests across16
files PASS with0pending; includes12 new authoring/API cases plus61 existing
regressions. New checks exercise Fastify HTTP handlers via injection and MCP
contract discovery; TCP/network transport is not proven. Real PostgreSQL graph,
reference sets, receipts, schema3 preview pins and native font-probe children are
used without fake renderer substitutes. Model20 processor/output delivery is not
run. Existing model18 native preview regression also passes; that is not evidence
of model20 native generation.

Coverage:18/19/20 exact save/get/structural validate, new-draft-only model changes,
foreign principal hiding, identity rejection, exact retry, conflicting key and
concurrent revisions; valid client-origin forgery rejected and trusted retained
origin preserved; unsupported clone/create/import rejected atomically; schema2
unselected-font drafts can save but not preview; actual sample font readiness,
pinned schema3 definition/revision/fingerprint/font snapshot, retry after later
save and stale-preview rejection. Real staged font bytes/licenses plus synthetic
active/retired states prove retained tuple ownership and that copied JSON/foreign
validation cannot confer rights; this is not font release-approval proof.

Verification limitation/ruling: initial GREEN has73 passed assertions,0failed
assertions but one beforeAll failure in font-preflight-admission.test.mjs, leaving
6cases skipped. That run is NOT PASS and its logs are retained. Independent probe
confirms the unchanged default coordinator profile1g-2cpu requires1024MiB while
this worker/bundle cgroup is512MiB and resources.enabled() is false. Those six
cases remain unverified until M20-4 provides the proper coordinator/per-worker
topology. No product/profile/test assertion was weakened to hide this; GREEN2
selects the16 relevant files and does not count the six as passed. This does not
prove the precise failing assertion location in the initial beforeAll hook; the
JSON report gives only its assertion message. The resource prerequisite is
independently confirmed. This is not full Service-suite acceptance.

Environment: same cached immutable Service/Core pin as M20-2; package250files
match. New PostgreSQL18.6/storage/internal /28 network, no published ports or
existing network changes. Worker/bundle memory512MiB and memory+swap total512MiB,
GREEN2 peak365.265625MiB, cgroup oom=0/oom_kill=0; DB has a separate512MiB cap.
No processes left; owned DB/proof containers stopped; existing runtime identity
metadata stays exact. Fresh read-only final review found no actionable Critical,
Important or Minor findings; reviewer did not execute tests independently.

Evidence: C:/Users/nekot/Documents/FlowDoc-recovery/service-model20-m3-20261101/
verification.json, verify.py, scope-rulings.json, review.json,
green2/oracle/{receipt.json,database-preflight.json,database-final.json,
core-integrity.json,out-schema/{suite.json,test-results.json,
governor-prerequisite.json,build.log,tests.log}}. Initial GREEN and accepted RED
are retained under green/oracle and red/oracle respectively.
Report: C:/Users/nekot/.codex/visualizations/2026/10/27/01a17da5-b6ab-7ff0-a66c-e46d7e2cf42d/flowdoc-oracle-service-model20-m3-20261101/verification-report.html.

Next is the M20-4 topology prerequisite before actual model20 jobs/documents,
normalization and native worker delivery; M20-5 compatibility/rollback/full suite
remains open. No Work/Evidence registry, system/DOCUMENT_MAP or generated
projection change; this existing canonical status document is the only prose edit.


## M20-4 topology prerequisite — BLOCKED after bounded lab inspection, 2026-11-01

Owner explicitly asks to prove topology and collect the six governor cases first.
Authority is lab discovery/verification, not approval for unreviewed product or
resource-control changes. Service owner; Evidence Reviewer/Planning Partner then
PC Steward. Inline IDs N/A. Source candidate257bdd521dc2298dbb714308363b1b0d432809da
stays clean; no product edits or new migration. First M20-4 checklist stays open.

The M20-4 gate says: "If isolation cannot be established without unreviewed
product/resource-control changes, BLOCK this stage and return a lab-topology
proposal; do not run an unbounded API worker or invent a passing512MiB claim."
This condition is reached. Six governor cases are0run/6not-passed in this round;
no actual model20/native/API worker workload is started.

Implementation evidence in the current Service candidate: src/jobs/render.ts:25
spawns process.execPath directly for legacy/font preflight; src/tasks/render.ts:61
spawns runtime/python/task_launcher.py, which sets only RLIMIT_FSIZE then execs
Node (task_launcher.py:7-8). Neither entrypoint creates/enters a worker-specific
memory cgroup. Process groups/ownership support stop/reap, not a separate RAM cap.
queue-resources.ts:17 reads /sys/fs/cgroup/memory.*; its max must equal the default
profile1024MiB (queue-profile.ts:7; queue-resources.ts:82). No supported launch
isolation hook was found in these paths.

New bounded Oracle/OCI observations, sequential cached-image containers, no DB,
network:none, read-only root, user65534,2CPU, no added privileges/cgroup writes:

| Container budget | Default governor | Metadata child memory.max | Same cgroup | Peak |
| --- | --- | --- | --- | --- |
|512MiB total memory+swap|disabled|512MiB|yes|22.421875MiB|
|1024MiB total memory+swap|enabled|1024MiB|yes|22.2578125MiB|

The child only reads metadata; it does not import Core, open an API or render.
This proves the inspected spawn pattern inherits the container cgroup, not actual
Service worker isolation or full launch wiring. Cached image coordinator sources
match the candidate; all src/tasks files are unchanged from its image baseline.
Both probes exit0, descendants reaped, oom=0/oom_kill=0; all owned containers are
stopped. Runtime identity metadata stays exact. Protected Core/Service and C1
hashes stay unchanged. No real data/API/SQL/storage/log access, service stop,
image pull/install/push/release. No6-test PASS or full M20-4 claim.

### Proposed next decision — not implemented or approved

Recommended minimum: review a Service-owned per-worker cgroup launcher. Retain
the coordinator1g-2cpu/default credits and all current policies. Enter an owned
worker cgroup with memory.max512MiB/memory.swap.max0 BEFORE workload exec; all
Node/Python descendants inherit that bound until the group is empty. Preserve
IPC/fence FDs, process identity, abort/timeout/reap and output/reservation ownership.
Fail closed if isolation is unavailable; release credits only after confirmed
empty worker group. Both legacy/font preflight and task render need coverage.
Core stays untouched. Any schema/protocol expansion needs separate review.

First feasibility spike must establish narrowly delegated lab cgroup ownership,
not writable host-root cgroups, privileged containers or exposing a Docker socket
to Service. Kernel/permission/delegation support and production portability are
currently unverified. Do not implement the launcher on the strength of this
metadata-only proof. A container-per-worker broker is an alternative but changes
transport/mount/lifecycle contracts more; review separately if delegation fails.

Rejected shortcuts: a shared1GiB container as proof of512MiB per worker, lowering
the coordinator profile, mocking memory samples, a V8 heap-only limit, moving a
PID after heavy workload begins, or a lab-only parent adapter replacing Service
launch wiring. None satisfies this gate. After the launch design is reviewed,
prove actual worker limits before/cancel/after exit and preserve coordinator
charging, then execute the original six governor cases and continue M20-4.

Evidence: C:/Users/nekot/Documents/FlowDoc-recovery/service-model20-m4-topology-20261101/
{verification.json,packet.json,probe.mjs,child.mjs,remote.py,run.py,
oracle/{receipt.json,production-before.json,production-after.json,
out-512/probe.json,out-1024/probe.json}}.
Report: C:/Users/nekot/.codex/visualizations/2026/10/27/01a17da5-b6ab-7ff0-a66c-e46d7e2cf42d/flowdoc-oracle-service-model20-m4-topology-20261101/verification-report.html.
No Work/Evidence registry or system/DOCUMENT_MAP/generated projection changes.


## M20-4 delegated worker envelope spike and launcher review — 2026-11-01

Owner authorizes review and lab delegation proof only; no Core/Service source
change. Service owner, Evidence Reviewer/Planning Partner then PC Steward; inline
IDs N/A. Candidate257bdd5 stays clean. Kernel delegation feasibility is now
confirmed on this OCI host; actual Service launcher acceptance remains open and
the first M20-4 checklist stays unchecked. Original governor cases0run/6not-passed.

### Confirmed lab proof

One newly owned Docker cgroup, fullID/label/PID verified, retains1GiB memory and
memory+swap total1GiB,2CPU and the unchanged default governor module. A host-root
supervisor moves only this new container's idle coordinator into a leaf and
creates worker-a/worker-b sibling envelopes, each memory.max536870912,
memory.swap.max0,memory.oom.group1. It delegates directory/membership/subtree
controls toUID65534 while keeping root limit files and common-ancestor procs
root-owned. It changes no existing service's cgroup or host controller settings.
Container remains user65534,read-only,network:none,cap-dropALL,no cap-add or
privileged mode, no host-root cgroup bind and no Docker socket. No install/pull.

Two synthetic unprivileged host-namespace Python helpers can create their local
worker groups, place workload before exec and retain descendants in512MiB. Twelve
boundary attempts receiveEACCES: raising envelope/parent limits, moving to
coordinator/parent, creating outside delegation and cross-worker migration.
Cancellation via cgroup.kill empties and reaps the child group before reuse;
replacement workload still has512MiB. This is real kernel behavior, not a mocked
resource reader or a post-heavy-work PID watcher.

Intentional synthetic memory pressure exceeds only worker-a's enforced envelope:
peak512MiB,oom_group_kill1,oom_kill4. Whole simulated bundle is killed; parent-local
memory.events.local oom=0/oom_kill=0,coordinator andworker-b remain alive, and the
unchanged governor still reports ready/healthy. Docker's propagated OOMKilled flag
is true; DO NOT call this a no-OOM container run. Coordinator later exits0. All
helpers reap, worker envelopes are removed only after populated0, all owned
containers stop, and protected runtime identity metadata remains exact. Two512MiB
ceilings share the original1GiB aggregate budget; no guaranteed extra capacity or
changed credit policy is implied.

### Launcher review outcome — design still PROPOSED

Bounded delegation works AFTER trusted initial placement. It does not give an
unprivileged Service permission to move a new child from coordinator across the
common ancestor. Keep that denial; do not grant Service write access to the
aggregate root or resource-limit files. Service-owned means logical lifecycle
ownership, with a separately reviewed trusted bootstrap/placement boundary.

Proposed Service-facing launch contract: allowlisted worker kind/executable,
job/lease/deadline identity; report PID+process-start identity,cgroup identity,
verified512MiB/swap0 binding before payload exec and the original streams/IPC.
Fail closed before accepting workload if binding fails; retain credits until
empty group AND reaped ownership are confirmed. Preserve all task reservations,
output and delivery ownership and existing admission/credit/cap policies. Core
remains untouched. No product API/type/code implementing this contract exists yet.

Two mechanisms remain to compare before source approval: bounded placement broker
preserving direct-child PID/FD semantics, versus preplaced per-envelope supervisor
which reduces persistent privilege but changes parentage/transport. Neither is a
proven drop-in. Next recommended COPY-ONLY proof: pre-exec handshake plus legacy
stdin/stdout and task advanced IPC FD3/fence FD4, successful/failed bind, timeout,
cancel/reap and coordinator/helper crash. Authenticate/validate the narrow broker
surface; avoid arbitrary commands/paths/PIDs or host-root delegation. Only then
review the source change packet and prove actual Service wiring before the six
governor cases and model20 native workloads.

### Explicit evidence limits

These are host-namespace synthetic helpers in the new Docker memory hierarchy,
not real Service/container workers or Core/API/native/DB workloads. Host-root
supervisor performs initial placement; container privilege escalation, namespace/
mount delivery, broker authentication, actual IPC/fence transfer and restart
recovery are not proven. Bootstrap waits for placement before payload exec, but
initial fork is notCLONE_INTO_CGROUP; no claim of first-instruction placement.
Governor physically observes aggregate charge but no real worker grants are used:
credits remain128MiB baseline. Do not count this as governor-admission or full
M20-4 acceptance. Other host/kernel/rootless portability remains unverified.

Delegation criteria reference the primary kernel contract:
https://www.kernel.org/doc/html/latest/admin-guide/cgroup-v2.html#delegation .
Runtime claims above derive from the owned lab evidence, not the documentation.

Evidence:C:/Users/nekot/Documents/FlowDoc-recovery/service-model20-m4-delegation-20261101/
{verification.json,verify.py,packet.json,delegate.py,coordinator.mjs,remote.py,
run.py,oracle/{receipt.json,container-postflight.json,production-before.json,
production-after.json,out/heartbeat.json}}.
Report:C:/Users/nekot/.codex/visualizations/2026/10/27/01a17da5-b6ab-7ff0-a66c-e46d7e2cf42d/flowdoc-oracle-service-model20-m4-delegation-20261101/verification-report.html.
Protected Core/Service checkouts,C1 hashes and candidate257bdd5 stay unchanged;
no real data access/service stop/push/release/install. No Work/Evidence registry,
system/DOCUMENT_MAP or generated projection change; existing status document only.


## M20-4 copy-only pre-exec/IPC/fence proof — 2026-11-01

Explicit owner request authorizes copied lab proof only, not Core/Service edits.
Service owner; Evidence Reviewer/Planning Partner then PC Steward; inline IDs N/A.
Candidate257bdd5 stays clean. Bounded copies run on the isolated Oracle/OCI host;
no actual Core/native document/API/DB jobs. M20-4 actual-Service launch gate stays
open and original governor tests remain0run/6not-passed.

### Confirmed10-case copied-protocol proof

Final10/10 cases pass: legacy-success, task-advanced, bind-denied, forged-ack,
gate-timeout, pre-cancel, rpc-error, task-cancel, helper-crash, coordinator-crash.
Coordinator aggregate remains1GiB memory+swap total,2CPU. Each owned worker
cgroup has memory.max512MiB, memory.swap.max0. Host fixture validates the new
Docker fullID/label,owned parent,namespace PID, nonce and process-start identity;
parent independently checks actual membership/starttime/kernel limits beforeGO.
Bootstrap checks its own binding before exec. Five negative cases have no payload
marker and no IPC init. Timeout/cancel durations are bounded lab-fixture values,
not proof of production deadline policy. Initial fork precedes placement under
the coordinator budget; no CLONE_INTO_CGROUP/first-instruction placement claim.

Legacy JSON stdin/binary stdout transport retains exact bytes; synthetic %PDF-LAB
bytes are not a rendered/valid PDF. Task advanced IPC FD3 roundtrips Buffer64KiB,
BigInt, Map, Uint16Array and ack/error across Python bootstrap, unchanged copied
per-file-limit launcher and Node exec. Direct-child PID/PGID remains stable; FD4
remains the inherited fence-file identity before/after exec. Legacy copy carries
extra lab owner/fence plumbing; this is not product ABI integration acceptance.

Use unchanged createTaskOwnership/queue-resources modules from the cached image;
relevant src/tasks/runtime sources are identical to candidate. Runtime Python
copies stay unchanged and match image implementation after newline normalization.
Synthetic Python writer runs through unchanged task_python.py, which takes a
shared fence lock and checks runtime identity. No Core logic is copied or run.

Nine ordinary cases wait direct-child close, cgroup populated0 AND a full process-
group scan including zombies before untrack/refund. Real unchanged governor module
credits move448→128 and workers1→0 in these COPIED coordinator cycles. Task cancel
needs2 scan rounds before its group disappears. These are not the six native
Service governor tests, and no DB reservation/delivery recovery is implied.

For coordinator crash, the namespace-holder stays alive while the copied Service-
like coordinator is SIGKILLed. Existing ownership helper detects EOF and drains the
tracked group; writer fence stays locked while live. Root observer waits worker,
writer AND owner PID reaped before requesting restart. Actual ownership helper opens
new runtime identity; unchanged Python writer wrapper rejects old runtime exit75
without executing its stub. New governor starts baseline128; old grant was in the
killed coordinator heap, not an explicitly refunded persistent DB reservation.

Finalmaximum worker-cgroup charged peak16.27734375MiB for tinytransport stubs;
not RSS/capacity or actual document readiness. All cases memory events oom0/kill0,
container exit0, no OOM; all owned worker groups empty/removed,containers stopped,
protectedruntime identitymetadata exact. No extra privilege/containercapabilities,
host-rootcgroupbind orDocker socket. No real data/service stop/pull/install/push/
release. ProtectedCore/Service/C1 hashes unchanged.

### Review result and remaining source decision

Copied proof supports the bounded pre-exec placement approach which preserves the
existing direct-child/FD contract. It does not authorize production use of the
file-drivenrootplacement fixture. Before source changes,review the narrow broker
identity/authentication/peercredentials,allowlisted executable/paths/PIDs,root-FD
ownership, privilege packaging and broker crash/restart behavior. Helper crash tested
here meansbootstrap child before GO, not privileged broker daemon death. Keep
resource limits/common-ancestorwrites unavailable to Service andworkers.

Proposed integration scope for later review: Service-owned asynchronous launcher
returns a verifiedbound directChild plus existing stdio/advancedIPC/fence FDs;
legacy/font andtask callsites send input onlyafterbinding. Retain originalfile
bounds,lease/deadlines,childownership,credit/output/reservation semantics andall
caps. A missing/forged/late bind fails closed. Actual Service launch wiring andthe
six governor cases must pass after separately authorized candidate implementation.
No new source API,type,module ormigration has been implemented in this round.

### Retained failures and coverage refinement

Initial copied legacy attempt stopped beforeGO. Diagnostic attempt confirmed EBADF
because the fixture inspected FD3 even though legacy had no IPC. Fix only copy to
inspect FD3 for task; no source assertion/guard weakened. First10-casegreen retained,
then close acoveragegap by adding process-group/zombie scans before credit refund
and waiting all tracked PIDs before crash restart. Final 10-case rerun passes. Earlier
failedruns are not accepted as PASS. Privilegedbroker authenticity, actual native
Core output,Service/API/database behavior and deployment portability remain open.

Evidence:C:/Users/nekot/Documents/FlowDoc-recovery/service-model20-m4-handoff-20261101/
{verification.json,verify.py,packet.json,parent.mjs,bootstrap.py,payload.mjs,
native_stub.py,holder.py,remote.py,run.py,runtime/python/*,
oracle/{receipt.json,production-before.json,production-after.json,out/*},
attempts/{red1,red2,green1}/*}.
Report:C:/Users/nekot/.codex/visualizations/2026/10/27/01a17da5-b6ab-7ff0-a66c-e46d7e2cf42d/flowdoc-oracle-service-model20-m4-handoff-20261101/verification-report.html.
Only existing canonical status document changes; no Work/Evidence registry or
system/DOCUMENT_MAP/generated projection promotion. Next review a scoped Service
integration/privilege packet; do not claim M20-4 or full Service readiness yet.

## Launcher/broker integration planning — 2026-11-02

[Focused proposed implementation plan](flowdoc-service-worker-launcher-broker-plan-2026-11-01.md)
maps direct renderers, image preparation, font inspection, font-admin specimen
rendering and composition/health to the existing credit/permit owners. It keeps
512 MiB per worker, the existing aggregate/coordinator/allocation budget, pinned
Core and document limits. Startup resource probes and the owner helper remain
explicit coordinator control-plane exceptions, not capped-document-worker claims.

Next proposed action is P0 copy-only authentication/pidfd/root-scope and broker
death/restart/accounting proof, before Service implementation. The six admission
cases need real launcher injection in fixture setup; an old direct-spawn test
PASS would not prove this topology. All assertions remain acceptance criteria.

This review reads Service257bdd5 and retained receipts; it performs no new lab
workload or Core/Service edit. No real data/service operation, push, release or
installation. M20-4 and M20-5 status is unchanged; no product or map promotion.

## P0 copy proof — 2026-11-02

Bounded Oracle/OCI copy suite passed22/22 (accepted a4): actual private-namespace
PID11 reuse with different start identity, stale lease/cancel rejection, constrained
self-migration FD, per-message writer authentication, controller/FD-theft denial,
cancel before/during bind, broker death/restart with escaped writer and coordinator
death cleanup. Worker512MiB/swap0 and aggregate1GiB/2CPU unchanged; no OOM; all lab
attempts stopped and protected production identity metadata unchanged.

Retained a2 proves a cancellation race in the **prototype only**, fixed only on
copies before a3/a4 GREEN. The [focused plan's P0 result](flowdoc-service-worker-launcher-broker-plan-2026-11-01.md)
records the race, required contract refinements, evidence and remaining boundaries.
No Core/Service, real data/service, install/release/push operation; no actual
Service/native/API/DB job or six governor test was run. Next scope is P1 review
and separately authorized candidate implementation, not automatic execution.

## P5 actual Service acceptance — 2026-11-02

The [focused launcher plan](flowdoc-service-worker-launcher-broker-plan-2026-11-01.md)
now records **64 selected passes / 1 failure in12 files; P5 not accepted** on
Service8581644. Six unchanged governor cases passed with real capped workers;
actual TCP HTTP covered model18/19 legacy PDF, task PDF/DOCX/images, font admin
and client cancellation. M20-1/2/3's five suites passed34 cases. Intentional worker
OOM and actual task coordinator restart passed their scoped isolation/recovery
checks, with job-linked launch traces and DB reservation evidence. Worker512MiB
and aggregate1GiB/2CPU remain unchanged in the isolated OCI VM/PostgreSQL lab.

P5-01 is a confirmed reliability blocker: a bound gate dying before COMMIT closes
the broker control session and prevents CANCEL/WAIT_EMPTY stop proof; launcher
drain reports WORKER_STOP_UNCONFIRMED. The red native14 regression is retained;
no product repair was authorized in this verification round. Next scope is that
bounded correction and affected acceptance rerun, not integration. Existing
M20-4/M20-5/full-suite, native Word and deployment portability gates remain
separate. No Core/runtime source change, real data/service operation, merge,
push, release or installation. Test-only candidate changes remain uncommitted;
no Work/Evidence registry or map promotion.

Evidence: `C:/Users/nekot/Documents/FlowDoc-recovery/service-worker-launcher-p5-20261102/verification.json`.

## P5-01 correction accepted for candidate — 2026-11-02

The separately authorized correction is committed in Service candidate
`f23ed86`; [focused result](flowdoc-service-worker-launcher-broker-plan-2026-11-01.md)
records **72 selected passes,0 failures in13 files**. Broker COMMIT for an
authenticated bound child that has died now preserves the session for confirmed
stop proof, without changing invalid-session handling or returning grants early.
The original P5 FAIL64/1 record is preserved above, superseded by this scoped
candidate acceptance rather than rewritten as a historical PASS.

Gate-crash/sibling/next-work, real HTTP health/grant cleanup, unchanged six
governors, existing launcher/protocol, intentional worker/job OOM, coordinator
task recovery and M20-1/2/3 compatibility passed in the isolated OCI VM with fresh
PostgreSQL/Docker fixtures. Worker512MiB and aggregate1GiB/2CPU/Core pin unchanged.
Native-only suites explicitly skip17 cases outside the lab; skips are not PASS.

No Core/product-main integration, real data/service operation, push, release or
installation. Original M20-4/M20-5/full-suite, native Word and deployment
portability gates remain separate. No Work/Evidence registry or map promotion.
Evidence: `C:/Users/nekot/Documents/FlowDoc-recovery/service-worker-launcher-p501-fix-20261102/verification.json`.

## M20-4/M20-5 continuation plan — 2026-11-02

Planning only, authorized by the owner's latest review request. Owner: Service
for future test/lifecycle work; PC for this existing canonical plan. Roles:
Planning Partner / Cross-Repo Boundary Reviewer, then PC Steward. Inline execution
IDs not applicable. Work Size medium; Risk Tier routine, with concrete blockers
for identity/data-integrity failure, schema mis-admission or resource escape.
The2026-10-04 generated Current Truth Snapshot is unrelated and stale; current
request, live Git facts and the referenced scoped evidence govern this plan.

Baseline: Service candidatef23ed86, clean; product main/developmenta572025 remains
clean. Core0.5.2 pin SHA256
`ed876f4d011ad943ead937307af9123581c231124cab198de34f60b832f6a532` is unchanged.
No product source/test, Core/C1, migration, configuration or lab mutation is
authorized by this planning turn. Future test additions need the next explicit
execution instruction; product repairs found during verification return as a
separate bounded correction, not an automatic fix to obtain PASS.

### Evidence reuse and verified gaps

| Evidence/source checked | Reusable conclusion | Does not establish |
| --- | --- | --- |
| P5-01 verification.json, candidate/source manifests and native receipts |512MiB/swap0 bound workers; original1GiB/2CPU coordinator/aggregate; six governors,18/19 HTTP, fault cleanup/health, font/image/native wiring | Model20 request identity, images/fonts/output through actual task workers |
| tests/model20-migration.test.mjs:8–26; current migration028 | Upgrade genuine027 current/snapshot/published18/19 graphs and queued jobs; replay; injected failure restores functions and checksum ledger | Old executable on upgraded DB, pending task/file recovery, missing028 admission guard or backup/restore |
| tests/model20-authoring-api.test.mjs | Model20 authenticated save/validate/preview pin and bounded capabilities; model18/19 compatibility | Successful20 preview download or native task PDF/DOCX |
| tests/helpers/model20.mjs | Small A-B-A fixture exists; schema2 and rich roundtrip variants exist | rich=true clears examples; it has no valid task image uploads or complete native reference fixture |
| src/tasks/normalize.ts:10–39 and src/tasks/render.ts:43 onward | Production path loads exact published pin, calls Core normalizeTaskInput, persists bindings and uses injected task launcher | Actual20 runtime success; a source path or direct Core composition is not a result |
| src/server.ts:31–90 | Current startup/health composition can be located; this review found no explicit schema_migrations/028 preflight there | Runtime proof that missing028 is safely rejected; classify as blocking verification gap, not a confirmed defect |
| tests/model20-tasks-api.test.mjs | File is absent at reviewed HEAD | Any claim that original M20-4 task acceptance ran |

Keep the existing P5-01 receipt directory immutable. Reuse passing results only
when candidate content, relevant dependencies/configuration/environment and
criterion coverage still match. Any product repair re-evaluates affected evidence.

### T0 — Freeze the lab packet and schema prerequisite first

- [x] Prepare one new owned OCI lab prefix, private PostgreSQL/socket/storage and
  synthetic credentials; no published host ports, production connection, package
  install/pull, Docker socket in app or host-root cgroup write. Reuse the reviewed
  P5 holder/broker/reaper topology. Record source/build/Core/image/runtime/kernel
  hashes, UID/caps, worker/root limits and final owned-container inventory.
- [x] Bind actual Service workers at512MiB/swap0, preserve aggregate1GiB/2CPU and
  the existing coordinator accounting. Reference-Core native runs use their own
 512MiB bundles sequentially, not the Service coordinator heap. Compilation is a
  separate disposable build step using the already reviewed toolchain budget.
- [x] Create a027-only disposable schema and start the new candidate through
  the real launcher. Proposed acceptance: required028 must be confirmed before
  model20 admission/capability publication; a fail-fast startup or explicitly
  unavailable admission must leave no partial20 rows or document worker. Observe
  actual listener/health and capability behavior; do not assume migrate() runs
  during startService(). Also check checksum mismatch and successful028 startup.
- [x] If it starts/adopts20 against missing/incompatible schema, retain RED and
  stop dependent native20 proof. Report a Service startup/admission correction
  packet; do not edit src/server.ts or migrations inside verification. This is
  the first proposed experiment because the source inspection is not runtime
  proof of a schema guard.

Proposed new test owner/path: tests/model20-runtime-compatibility.test.mjs.
This is a test plan, not an existing test or approved implementation.

### T1 — M20-4: small real model20 requests, identities and native files

- [ ] Add tests/model20-tasks-api.test.mjs and a narrowly owned helper such as
  tests/helpers/model20-native.mjs after execution authorization. Reuse the small
  A(first),B(middle),A(last) family; preserve the existing rich roundtrip fixture.
  Pin real published version1 and a saved draft revision, not forged DB-only
  provenance. Derive supported reference/asset syntax from the pinned Core public
  contract before building the fixture; unsupported cross-instance references
  are a contract blocker, not an invented input or silent test omission.
- [ ] Exercise actual TCP HTTP /jobs PDF, saved-revision authoring preview PDF,
  /documents PDF and /documents DOCX. Keep legacy/preview GenerationRequest
  (input to prepareGeneration, not its PreparedInput result) distinct from raw
  task sections[{sectionKey,instanceKey,data,...}].
  Check prepared schema3, Core flowdoc-task-input/2 and Service normalization2
  independently. Repeated instanceKeys across different requests are legal;
  duplicates within one request reject.
- [ ] Use distinct FIRST/MIDDLE/LAST text, repeated A headers/footers, numbering,
  local/cross-instance references where supported, and same asset key with
  different tiny images in first/last. Assert text order, two distinct asset
  hashes/section_id bindings, no ownership leak and correct instance-scoped
  diagnostics in emitted files/findings. Independent Core composition/source IDs
  are a reference, not evidence of an in-worker object capture.
- [ ] Produce one small reference PDF and DOCX with the exact pinned Core under
  separate512MiB native bundles. Compare semantic text/order, numbering/bands,
  diagnostics/source identities, parsed DOCX XML/.rels/media/links and download
  hashes/receipts, not nondeterministic ZIP/PDF byte equality. Retain actual
  field-refresh/wordVerified metadata; no native Word layout claim from XML.
- [ ] Add a small schema2/library-font case using owned staged assets/licenses
  and actual bound inspection/preflight; copied or foreign tuples must reject
  without gaining font rights. Existing schema1-only native P5 output does not
  substitute for this provenance boundary. Keep draft-edit-after-admission
  preview pinned to the accepted revision; do not publish a new version during
  the interrupted-task retry case and accidentally change its expected pin.
- [ ] Invalid shape, empty assembly, duplicate instance and unknown section
  reject through actual routes. Pinned taskInput.js exposes SECTION_INPUT_SHAPE,
  SECTION_ASSEMBLY_EMPTY, SECTION_INSTANCE_DUPLICATE and SECTION_KEY_UNKNOWN;
  verify Service's documented public mapping rather than guessing HTTP codes.
  Exercise the2000-instance and50k expansion bounds with bounded validation/
  normalization fixtures; do not render a giant boundary document or raise caps.
- [ ] After failure: no published artifact, live worker or held queue slot.
  Failed input deliberately retained under current TTL is permitted only when
  storage held equals actual used bytes; assert that accounting explicitly.
  This clarifies the original "no reservations" phrase as no leaked reservation,
  not deletion of payloads that existing recovery policy intentionally retains.
- [ ] Run one bounded interrupted model20 request and a fresh explicit retry
  using existing lab controls. Verify original pinned version/revision, instance/
  asset identity, truthful generation/delivery status, stop proof, DB slot/storage
  accounting and job/task-linked launch counts. The old task must not resume/
  auto-deliver; a new request may reuse the same instanceKeys independently.

Document-workload budget: one small fixture family, the four Service route/output
cases above, two pinned-Core native references, one schema2 delivery, and one
interruption plus one successful retry. Native preflight/font checks required by
those paths remain real and measured. No UAT/SRS, large-doc/OOM stress expansion.

### T2 — M20-5: old executable and truthful recovery boundary

- [ ] Reuse the two passing027→028 migration cases if their files/dependencies
  remain unchanged. Add only the missing pending-task/file-state fixture when
  required for a claimed upgrade lifecycle; compare row/function/ledger/pin/file
  hashes, not just reassembled JSON. Never alter applied migrations or downgrade
  SQL. Migration-transaction rollback is distinct from binary rollback.
- [ ] Pin old Service sourcea572025 and its exact dependency/Core/build identity;
  build a scratch copy from existing cached dependencies without changing that
  checkout. Against a fresh upgraded18/19-only copy, exercise old metadata/API/
  persistence behavior. Keep its fixture free of runnable queued jobs and forbid
  generation admission: the old executable lacks the new launcher. Running its
  direct-spawn document workers under a1GiB app would violate the requested
  per-worker boundary and is not authorized by this plan.
- [ ] Report old-executable DB/metadata compatibility separately from operational
  rollback readiness. Before20 rows, that limited proof can support a database
  compatibility claim; it does not prove old native-worker isolation. An actual
  old-runtime rollback/generation rehearsal needs a separately reviewed envelope
  that preserves the current resource contract, not a lowered coordinator budget.
- [ ] After20 current/snapshot/task/job rows exist, the proposed default is
  forward recovery with the new compatible candidate. Treat old-binary use as
  refused unless a separately verified compatibility route exists. A lab script
  that refuses to launch an old executable is an operator/runbook safeguard,
  not proof that a product startup guard already exists. Do not delete/coerce20
  rows or assume an18/19-only filter makes the old runtime safe.
- [ ] Quiesce only the owned lab service and create a consistent PostgreSQL dump
  plus referenced task/font/output storage snapshot. Restore to new lab names/
  volumes; preserve storage identity and immutable pins, create a fresh runtime
  ownership identity under the real fence/recovery path. Compare input/font/
  license/output hashes and usage/delivery evidence, terminal job history and
  released/retained accounting. No automatic resend of restored completed work;
  verify one fresh small request on the restored new candidate.

### T3 — M20-5 complete-suite coverage and final acceptance

- [ ] Freeze the final candidate before verification. Run the six focused M20
  files (including the currently absent tasks API file once added), schema/
  compatibility/recovery additions, and then the complete Service test inventory.
  Use the existing cached toolchain, build and private DB; do not call the legacy
  scripts/checkDatabase.mjs blindly: it builds images and asserts an obsolete
  migration list ending018. Do not install dependencies to make verification run.
- [ ] Full ordinary Vitest run: one file/worker at a time inside a512MiB test
  bundle, with real native descendants inside that same cap. Actual Service
  coordinator remains in its separate1GiB/2CPU topology for native acceptance;
  do not shrink its profile to satisfy a test-bundle limit.
- [ ] Inventory every conditional/skip by case, not only aggregate counts.
  Native FLOWDOC_WORKER_LAB suites need their matching per-file owned topology/
  coordinator PID/anchor. A single global lab flag on full npm test cannot bind
  every fork to one fixed broker. Map ordinary and dedicated native results as
  a union; reuse exact P5-01 cases only within unchanged relevant dependencies.
  Refresh uncovered P2/P3/P4 native assertions when their older broker/runtime
  base differs; actual P5 representative output does not mark those assertions
  executed. Required skipped/missing cases keep the full-suite gate OPEN.
- [ ] Check final diff/scope, source stability during tests, case-to-criterion
  coverage, stop/reap/accounting, root-local events and final owned inventory.
  One final review/fix cycle; unexpected OOM, timeout, identity mismatch, schema
  mis-admission or unconfirmed stop halts dependent proof. No extra RAM, heap/GC
  tuning, higher cap, replacement renderer or fallback to19.

This plan's document budget is this existing canonical file only. Future proof
budget is T0 prerequisites, one small T1 family, the bounded T2 recovery chain,
one full ordinary suite plus necessary unmatched native cases, and one final
review/correction cycle. Stop after acceptance; no automatic integration. Future
PLAN defaults Astra/medium per workflow policy; the execution packet must record
its own available host/model choice. No model switch, dispatch or lab execution
was performed here.

Blocking unknowns: actual missing028 startup behavior; complete native20 assets/
references/library-font results; restore consistency; full-suite coverage; old
native runtime rollback envelope if that route is required. Deferred: granular20
authoring/clone/conversion, plugin/Editor/native Word adoption, large-document
capacity, deployment portability and the separate pending-label topology witness.
No full Core/PC suite, new Work/registry/map, Core edit, production action or
push/release/install is implied. This planning review checks documentation only.

## T0 execution result — 2026-11-02

**FAIL / dependent proof blocked.** This separately authorized T0 verification
used unchanged Servicef23ed86 and Core0.5.2 in a new private027-only PostgreSQL
on the owned OCI lab VM. Execution IDs not applicable; Evidence Reviewer then PC
Steward. No Core/Service source, repo test, configuration or migration edits.
The proposed tests/model20-runtime-compatibility.test.mjs was injected only into
the scratch lab archive from an external suite, not added to the candidate.

### T0-01 — ready/capability published without required028

Confirmed Defect in schema-dependent readiness/capability; High reliability
impact when new Service is launched against027. One primary test ran and failed.

| Actual TCP observation | Result |
| --- | --- |
| Applied migration ledger before/after/after shutdown | Exactly001–027; source checksums match;028 absent; no auto-migration |
| startService and GET /health | Started;200, value.ready=true, including after failed save |
| Authenticated GET /authoring/contract |200; nodeModelVersions=[18,19,20] |
| POST /authoring/validate with valid20 definition, no sampleRequest |200 ok:true, composed:false, fontReadiness styles ready; not a document generation result |
| Create blank draft then PUT model20 definition | Blank identity201; save503 STORAGE_FAILED; subsequent draft remains revision0/definitionnull |
| Recorded final counts | model20 current0, published0, generation_jobs0, tasks0; task_resource_reservations=[] |

Execution path: setup applies copied001..027 via existing migrate, then exact
src/server.ts:31–90 startup opens the real listener through the real broker.
src/http/authoring.ts:34 publishes20; src/authoring/service.ts:122–128 accepts
definition validation. Save enters the existing service/storage path at:83;
its503 is generic STORAGE_FAILED, not a recognized schema refusal. No DB error
trace was collected, so its exact cause remains UNKNOWN. Do not present a
probable old-trigger mismatch as a newly traced runtime cause.

The finding is limited to readiness/capability/validation exposure without028.
It does not prove successful20 persistence, task admission, document generation,
delivery or data corruption. Counts above cover the named entities; they are not
an exhaustive inventory of every possible partial entity. The intentionally
created blank draft identity remains ordinary lab fixture data.

Only one worker launched: startup font-preflight, with observed512MiB/swap0
before exec. No legacy/task document worker ran. Aggregate/coordinator1GiB/2CPU,
nonroot UID10001, capsdropALL and networknone remained unchanged. Final workers0,
credits128MiB, no OOM, scope empty; both owned app/DB containers are stopped.
All candidate tracked hashes, selected protected Core/Service development heads,
Core archive pin and copied source hashes stayed unchanged. Production check was
container identity metadata only; no real API/SQL/storage access or real service
operation, merge, push, release or installation.

Stop rule applied: checksum-mismatch negative, successful028 startup control and
T1 native20 output were not run. These are NOT PASS or executed skips; T0 full
acceptance remains open. P5-01's prior scoped passing result is not rewritten.

### Proposed correction packet — not implemented

Owner Service; smallest proposed change is a required-schema/checksum preflight
after DB-pool acquisition and before startup native probe, ownership/admission
and listener publication. Check required ledger prefix through028 against the
immutable migration files; missing/mismatched schema must yield a distinguishable
schema refusal and drain acquired resources. Do not auto-run migrations, edit
applied SQL, touch Core, raise limits or mask the failure as generic storage.
Exact helper/API design remains subject to the separately authorized correction.

Before future GREEN acceptance, tighten the external test: its !started branch
currently treats arbitrary startup failure as guard success. The present RED is
valid because started=true is independently asserted by verify.py. Future checks
must recognize schema refusal and exclude unrelated broker/font/credential/DB
failures. Then run027 missing028, wrong028 checksum and matching028 controls,
verify no premature worker/write/ready state and successful legitimate authoring
on matching028. Do not advance T1 until prerequisites pass.

Fresh independent read-only review confirmed the narrow RED conclusion and these
limits. No product repair was made. Retained evidence:
`C:/Users/nekot/Documents/FlowDoc-recovery/service-model20-t0-20261102/`
(`packet.json`, `suite.mjs`, setup/native runner, native1 packet/archive,
oracle receipts/logs/ledger/functions/HTTP observations, `review.json`, `verify.py`,
`verification.json`). Report:
`C:/Users/nekot/.codex/visualizations/2026/10/27/01a17da5-b6ab-7ff0-a66c-e46d7e2cf42d/flowdoc-oracle-model20-t0-20261102/verification-report.html`.
No new Work/Evidence registry, map or generated-truth promotion.

## T0 schema guard correction result — 2026-11-02

**PASS for the authorized correction and T0 controls.** Service candidate
commit `7b25ff2` contains only src/server.ts, new src/db/runtime-schema.ts and
two new test files. Explicit owner request supersedes the prior verification-only
boundary; original T0 RED remains immutable. Product Implementation Agent then
Evidence Reviewer/PC Steward, single-room execution IDs not applicable.

assertRuntimeSchema reads the shipped contiguous001–028 filenames/bytes and
compares exact names, ordering, count and SHA256 checksums with a single SELECT
from schema_migrations. Missing ledger or a missing/mismatched required row
throws RUNTIME_SCHEMA_REQUIRED; unrelated DB/permission/transport or incomplete
runtime-bundle failures throw RUNTIME_SCHEMA_UNAVAILABLE with safe messages.
It does not apply migrations, repair ledger rows, write domain data or change
existing SQL. This binary intentionally refuses unknown future ledger entries;
a future migration requires an explicit runtime contract update.

startService now creates its pool and checks the schema after required launcher
authentication, before native probes, temp/resource stores, ownership/processing
and the listener. Existing failure cleanup drains acquired launcher state and
closes the pool. MCP authoring remains an HTTP proxy to that guarded server;
CLI administrative workflows and direct test composition are unchanged. This is
startup ledger verification, not continuous monitoring or an attestation of every
DDL/function an operator might manually change without changing the ledger.

| Actual owned Oracle/OCI lab control | Result |
| --- | --- |
|027, no028 | Recognized RUNTIME_SCHEMA_REQUIRED; no health/capability listener, native launch or ownership; ledger/counts unchanged |
|028 applied, checksum deliberately wrong in fixture | Same recognized refusal; no listener/native/ownership; wrong checksum remains unchanged by the app |
|028 with source-matching checksums | HTTP health200/readytrue, model20 contract/validation and save200/revision1; current20=1, no jobs/tasks/reservations |

The test fixture explicitly restores the correct checksum before the positive
case; that restoration is not product behavior. Negative tests require the exact
schema error code/message/path and reject an arbitrary startup error, correcting
the old external test's !started weakness. They also prove no writers.lock or
early ownership exists. The positive case is authoring/storage, not model20
native PDF/DOCX generation; T1 remains a separate next scope.

Fresh native1 RED ran the new assertion against unchanged pre-fix runtime: the
first missing028 case started and failed, with two controls unexecuted. Native2
GREEN passed3/3. Additional affected checks passed: guard unit9 plus the five
M20-1/2/3 suites34 (focused43), native3 readiness/startup/shutdown8, native4 actual
HTTP5, native5 coordinator recovery1 and native6 actual-job OOM/recovery1.
Total **61 passed,0 failed across11 files**, not a full Service suite. Intentional
coordinator SIGKILL stage1 and child OOM are explicitly scoped fault controls,
not unhandled acceptance failures or root/coordinator OOM claims.

All worker bounds remain512MiB/swap0 and aggregate/coordinator1GiB/2CPU. Native
positive startup preflight placement was measured; negatives launched no worker.
Root-local OOM counters stayed0; native6's expected child OOM and Docker flag are
retained separately. All13 retained app/DB containers created in this round are
stopped, scopes empty, and known production identity metadata stable. Core0.5.2
archive pin, protected Core/Service development, Core C1 sources, migration files,
package/configuration and resource ceilings are unchanged. No real data/API/SQL/
storage access or real service stop, merge, push, release or installation.

Fresh independent whole-diff/evidence review found no Critical/Important issue
and compared native2–6 archive bytes with the final candidate. Candidate remains
isolated; no Work/Evidence registry, map or generated-truth promotion. All T0
bullets now pass within this scope. Next eligible work is separately authorized
T1 model20 routes/instance-assets/native outputs; M20-5 old-binary/restore/full-suite
acceptance and deployment/native Word/large-document gates remain open.

Evidence:
`C:/Users/nekot/Documents/FlowDoc-recovery/service-model20-schema-guard-fix-20261102/`
(`packet.json`, native1–6 archives/receipts/case JSON/logs, `focused`, `review.json`,
`verify.py`, `verification.json`, `final-audit.json` and bounded harness scripts).
Report:
`C:/Users/nekot/.codex/visualizations/2026/10/27/01a17da5-b6ab-7ff0-a66c-e46d7e2cf42d/flowdoc-oracle-model20-schema-guard-fix-20261102/verification-report.html`.

## T1 actual model20 API proof — 2026-11-02: OPEN / RED

User authorized T1 in the isolated Oracle/OCI Linux VM lab, using private
PostgreSQL Docker fixtures,512MiB per worker and the existing1GiB/2CPU aggregate.
This is not Oracle Database verification. Single-room execution IDs are not
applicable; owner is Service, role Evidence Reviewer. Service candidate base
is7b25ff224bc7b166428334f1bab6aa8f67cbf5ec in
`service-worker-launcher-p1-20261102`. Only
`tests/model20-tasks-api.test.mjs` and `tests/helpers/model20-native.mjs` were
added locally. No product source, Core, migration, package or ceiling changed.
The test additions remain uncommitted because acceptance is RED; do not merge
or describe the entire T1 suite as passing.

| T1 criterion | Evidence and disposition |
| --- | --- |
| Published model20 /jobs PDF | Native6 PASS; exact published version1/fingerprint and PreparedInput schema3 |
| Saved-revision preview PDF | Native6 PASS; admitted revision1 rendered after a visible draft edit to revision2; old definition retained and edited marker absent |
| /documents PDF and DOCX | Native6 PASS; same-key tiny red/blue images bound to instance-first/instance-last; Service normalization2 and Core flowdoc-task-input/2 separately checked |
| Independent pinned-Core references | Native2/reference-out PASS; standalone512MiB PDF and DOCX bundles; all250 package files match the vendored Core0.5.2 archive |
| Downloaded artifact semantics | artifact-verification.json PASS; FIRST/MIDDLE/LAST order, headers/footers, numbering1/2/1, local links and middle-to-last cross link, distinct image pixels; parsed DOCX XML/.rels/media/bookmarks and1856 XML nodes; receipts/hash/transport bytes match |
| Library font provenance | Native6 PASS; bound real inspection, owned font/license import, review/render/approve/activate, active selection retained by the owning draft; after retirement copied JSON has no retained rights and preview rejects; owning schema2 preview downloads successfully |
| Client disconnect and explicit retry | Native6 PASS; stopped child/group/scope, no failed-task output, released DB queue and settled held=used=actual787 bytes; fresh request reuses instance keys and exact input digest/published pin; one old-task launch, no resend observed for500ms, one fresh retry succeeds |
|2000-instance and50000 expansion bounds | Native7 selected check PASS; normalization accepts2000 and rejects2001; actual authoring validation rejects2001 and52000 source-block expansion; no giant native render, no extra native launch |
| Four invalid-input forms | Native7 RED for /jobs HTTP status; /documents rejects each with INVALID_DATA, no output/child/held queue and settled held=used=actual retained input |

### T1-01 — Confirmed Defect, Medium: model20 input errors become HTTP503

`src/http/server.ts:25` maps known legacy input errors to422 but omits
SECTION_INPUT_SHAPE, SECTION_ASSEMBLY_EMPTY, SECTION_INSTANCE_DUPLICATE and
SECTION_KEY_UNKNOWN. Actual POST /jobs returns each exact Core issue in its
body with503 through the fallback status. The invalid-input422 classification
in `docs/usage.md:379` and existing input mappings makes this a transport error
classification defect, not a transient service failure. Clients may retry an
unchanged invalid request unnecessarily. No data corruption was observed.

Reproduce using the four inputs in the final test's negative case against the
published small A-B-A fixture. Soft HTTP assertions intentionally retain all
four failures while allowing rejection/accounting assertions to run. Proposed
next repair: explicitly map the supported model20 client-input codes at the
Service HTTP boundary, preserve genuine overload/unavailability503, and rerun
the affected negative-route tests. This round does not implement that repair.

Native6's first five cases and Native7's corrected bounds case support six
individual passing cases; Native7's negative case contains four failing status
assertions. Both enclosing run receipts remain FAIL. The unchanged successful
native6 test prefix/helper was compared with native7 before result reuse. No
complete-suite PASS or broad M20 closure is claimed.

Earlier attempts are retained: native1's footer lacked the public compact page
field setting and DOCX correctly refused unsupported slots; native2 corrected
only that fixture. The initial standalone reference adapter used a non-UUID
asset marker and was corrected before reference generation. Native4/5 exposed
test observations taken before asynchronous sender/storage release; bounded
settlement checks passed in native6. Native6's bounds fixture duplicated inline
IDs and was corrected/validated in native7. None required a product repair.

All16 bound groups observed in native6/7 had memory.max536870912 and swap0.
Final controls found no OOM, changed archived candidate source or running owned
container across the seven projects and standalone reference bundles. Known
production container identity metadata stayed stable; no real API/SQL/storage
was accessed and no real service stopped. Lab containers are retained stopped.
No push, release, installation, merge or limit increase occurred.

Fresh independent read-only review confirmed T1-01 and the evidence reuse.
Limits: no native Word layout proof (fieldRefresh remains required and
wordVerified false), no in-worker composition capture, no nonempty
instance-scoped diagnostic attribution case, no long-term no-resend claim,
no full Service suite/T2/T3/production readiness. T1 remains open for the
confirmed status repair and these explicitly bounded coverage limits.

Evidence: `C:/Users/nekot/Documents/FlowDoc-recovery/service-model20-t1-20261102/`
(`packet.json`, native1–7 frozen archives/receipts, native2/reference-out,
`artifact-verification.json`, `terminal-db6.json`, `terminal-db7.json`,
`final-controls.json`, `review.json`, test and collection scripts).
Report:
`C:/Users/nekot/.codex/visualizations/2026/10/27/01a17da5-b6ab-7ff0-a66c-e46d7e2cf42d/flowdoc-oracle-model20-t1-20261102/verification-report.html`.

## T1-01 correction — 2026-11-02: PASS within the authorized fix scope

User authorized the Service candidate repair and four actual422 controls in
the same isolated Oracle/OCI VM/private PostgreSQL Docker envelope. This result
supersedes T1-01's unresolved status above; the earlier RED receipts remain
immutable. Single-room execution IDs are not applicable. Owner: Service; role:
Product Implementation Agent followed by Evidence Reviewer.

Service candidate commit f82d7c6840ca105cbfdc2d3f14bb3075b4c8282d adds exactly four
explicit422 entries at `src/http/server.ts:25`: SECTION_INPUT_SHAPE,
SECTION_ASSEMBLY_EMPTY, SECTION_INSTANCE_DUPLICATE and SECTION_KEY_UNKNOWN.
There is no broad SECTION-prefix catch; default503 and QUEUE_FULL503 remain
unchanged. The same commit retains the previously uncommitted T1 fixture/test
and strengthens exact-code, no-legacy-job-write and actual contention controls.

Fresh native1 RED ran the strengthened invalid-input test before the fix:
all four actual /jobs responses were503, with exact Core issue codes preserved.
Frozen native2 GREEN built successfully and passed **8/8 scoped T1 tests**:
published /jobs PDF, saved-revision preview, task PDF/DOCX, schema2 font rights,
interruption/retry, instance/expansion bounds, genuine preflight contention503,
and four invalid inputs422. The latter create no legacy job; /documents retains
its INVALID_DATA error stream with no published output/child/held queue and
settled held=used=actual storage. The genuine contention control holds the
private DB's existing preflight advisory permit, returns503 UNAVAILABLE and
starts no worker or job; it does not simulate a response or edit runtime code.

Downloaded outputs were independently checked again against the unchanged
standalone Core references: semantic PDF order/bands/numbering/links/pixels and
DOCX XML/.rels/media/bookmarks/receipts pass, with1856 XML nodes and the original
fieldRefresh required / wordVerified false disclosure. The cached Core's250
files again match the vendored archive. All15 observed bound worker scopes had
memory.max536870912 and swap0; aggregate/coordinator remains1GiB/2CPU, no OOM.
Both projects' four retained lab app/DB containers are stopped. Frozen source
hashes match the committed candidate; production identity metadata is stable.

Fresh read-only review found no material issue. Product changes are limited to
the HTTP mapping and the two T1 test/helper files. No Core, migrations, package,
configuration or limits changed; no real data/API/SQL/storage access, real
service stop, merge, push, release or installation. T1-01 is closed. This is not
a full Service suite, native Word layout proof, nonempty instance-scoped
diagnostic attribution proof, long-term no-resend proof or T2/T3 acceptance.
The previous coverage limits remain explicit; no additional gate is promoted.

Evidence:
`C:/Users/nekot/Documents/FlowDoc-recovery/service-model20-t101-fix-20261102/`
(`packet.json`, native1 RED/native2 GREEN frozen archives and receipts,
`artifact-verification.json`, `verification.json`, `final-controls.json`,
`terminal-db2.json`, `review.json` and bounded collection scripts).
Report:
`C:/Users/nekot/.codex/visualizations/2026/10/27/01a17da5-b6ab-7ff0-a66c-e46d7e2cf42d/flowdoc-oracle-model20-t101-fix-20261102/verification-report.html`.

## Nonempty instance diagnostics — 2026-11-02: attribution PASS, counts RED

User authorized the remaining nonempty-finding proof in the isolated Oracle/OCI
VM/private PostgreSQL Docker lab,512MiB/worker and existing1GiB/2CPU aggregate.
Single-room execution IDs are not applicable; Service owns the runtime, role is
Evidence Reviewer. Candidate stays at f82d7c6. Only the new local test
`tests/model20-diagnostics-api.test.mjs` was added; it remains uncommitted while
acceptance is RED. No Core or Service runtime source repair was performed.

Six small real /documents requests reused the A(first),B(middle),A(last) fixture
with the same asset key tiny in both A instances. The normalization controls
omit one multipart image source; preparation controls supply a PNG with valid
metadata but corrupted IDAT so actual pixel decoding fails. Fixture checks prove
metadata succeeds and decoding rejects before submitting the latter controls.
No finding, renderer result or lookup response is mocked.

| Actual case | Instance attribution | Overall case |
| --- | --- | --- |
| Missing source, first/last A, PDF (two requests) | Correct instance-first/instance-last, /sections/0 or2/data/photo, affected1 | PASS, partial PDF |
| Decode failure, first/last A, PDF (two requests) | Correct instance-first/instance-last, /sections/0 or2/assets/0, affected1; emitted preparation node sample identifies the same instance | PASS, partial PDF |
| Missing source, first A, DOCX | Correct instance-first in DB and public findings | PASS, DOCX_UNSUPPORTED with no artifact |
| Decode failure, first A, DOCX | Correct instance-first in DB and public findings | RED: aggregate public counters incorrectly0 |

All six durable findings have distinct IDs and match actual HTTP lookup details;
the unaffected counterpart is never blamed. Normalized source bindings and
available/unavailable markers were observed before worker launch; preparation
detail/node samples are emitted by the real worker and persisted by the parent.
This is not an in-worker composition-object capture. Independent PDF parsing
confirmed all four files retain ordered text/bands/numbering and only the
unaffected instance's correctly colored image. Download receipts match hashes.

### DIAG-01 — Confirmed Defect, Medium: failed DOCX loses aggregate counters

In the last control, task_findings and the actual lookup findings array both
contain one IMAGE_UNUSABLE for instance-first at /sections/0/assets/0, affecting
one placement. Yet task.counts.findingCount and omittedImagePlacements are both0.
`src/tasks/render-child.ts:215` persists the finding through RPC before the
DOCX omission rejection at line224. It never reaches the completion summary at
lines257–258. `src/tasks/public.ts:18` computes counts from normalization and
generation summaries, so the missing generation_summary hides the preparation
finding from totals. Detailed instance attribution remains correct.

Impact is inconsistent API diagnostics for a failed document, not observed data
corruption or a successful artifact with missing content. Proposed follow-up:
retain authoritative preparation totals through failure and make lookup totals
consistent without double-counting normalization or relying only on retained
detail-row counts (which may be capped). Repair requires separate authorization.

Native2 passed5/6 tests; the final assertion remains RED. Its generic harness
receipt says FAIL_P5_GOVERNOR, but the log identifies a diagnostic-count failure,
not a resource/governor failure. Native1 is retained as an earlier test-harness
type mismatch: PostgreSQL bigint was a string; only the SQL-boundary numeric
assertion was corrected before native2. Public numeric assertions stayed intact.

All seven native2 bound groups measured512MiB/swap0. Final controls verify both
projects' sources unchanged, no OOM, all four owned containers stopped, no held
queue and held=used storage; each case also checked actual retained file sizes.
Both DOCX failures publish no output and have confirmed child/group/scope stop.
Known production identity metadata is stable; no real API/SQL/storage access,
real service stop, merge, push, release, install or ceiling change occurred.
Fresh read-only review confirmed the defect and bounded evidence.

This closes the single-finding instance-attribution gap for the tested paths;
the diagnostics suite remains open for DIAG-01. It does not prove multiple
placements per finding, truncated-detail totals, DOCX last-instance failure,
native Word layout, full Service/T2/T3 acceptance or general production readiness.

Evidence: `C:/Users/nekot/Documents/FlowDoc-recovery/service-model20-diagnostics-20261102/`
(`packet.json`, native1–2 frozen archives/receipts, six case JSON/wires,
four PDFs, `verification.json`, `verify.py`, `final-controls.json`,
`terminal-db2.json`, `review.json`).
Report:
`C:/Users/nekot/.codex/visualizations/2026/10/27/01a17da5-b6ab-7ff0-a66c-e46d7e2cf42d/flowdoc-oracle-model20-diagnostics-20261102/verification-report.html`.

## DIAG-01 correction — 2026-11-02: PASS in Service candidate

User authorized the Service correction and isolated Oracle/OCI VM/private
PostgreSQL Docker proof, retaining512MiB/worker and1GiB/2CPU aggregate. Owner:
Service; implementation followed by frozen verification in one room; execution
IDs are not applicable. Commit83d7968385994291fe8bf1a9a0ecc75c9e21def4 changes
only `src/tasks/render.ts`, `src/tasks/public.ts` and the diagnostics test file.

The parent now commits cumulative preparation finding/omission observations into
the existing append-only task_events detail in the same locked transaction as
the capped finding detail insert. Existing preparation limits bound the ledger
to at most10000 observations per task. A DOCX failure or exhausted detail cap
therefore cannot discard totals already acknowledged by the parent. This does
not fabricate a completion summary, change schema or broaden worker messages.
Lookup selects these durable totals, falling back to existing completed-task
summaries when no ledger exists; it never adds two copies of the same totals.
The truncation flag compares observed totals with retained details.

Fresh native1 RED reproduced the original failed-DOCX zero counter. Native2
GREEN passed8 diagnostics cases at default bounds: the original six plus
one-finding/two-placement PDF and DOCX controls. The separate cap fixture is
explicitly skipped in that run. Native3 runs that fixture alone, lowering only
its test-owned retained-detail setting to1 through the existing intake policy
seam: one normalization and one preparation finding still report totals2 and
omitted placements2, with one retained detail and detailsTruncated true after
DOCX failure. Product default findingDetails10000 and all resource ceilings are
unchanged. Native4 passed the affected T1 real API suite8/8. Total **17 scoped
cases passed** across the three GREEN runs; selection skips are not passes.

Independent verification rechecked the original four partial PDFs, exact
instance attribution and counters, multi-placement totals and capped ledger.
Affected T1 downloaded PDF/DOCX artifacts again match the unchanged standalone
Core semantic references and transport receipts. DOCX remains fieldRefresh
required / wordVerified false. All26 observed GREEN worker scopes measured
512MiB/swap0; no OOM, sources match frozen candidates and all eight retained
round-owned app/DB containers are stopped. Reservations settled with no held
queue; failed inputs remain accounted at actual retained bytes.

Fresh read-only review found no material issue. DIAG-01 is closed for
observations made by this candidate. Historical failed tasks that have neither
the new observation ledger nor a completion summary are not backfilled; this
round does not recover absent historical totals or alter any real data. Legacy
completed-summary fallback remains in place. No Core, migration, package,
configuration, product ceiling or worker runtime change, real API/SQL/storage
access, real service stop, merge, push, release or installation occurred.
Full Service, native Word, T2/T3 and general readiness claims remain out of scope.

Evidence: `C:/Users/nekot/Documents/FlowDoc-recovery/service-model20-diag01-fix-20261102/`
(`packet.json`, native1 RED/native2–4 GREEN frozen archives and receipts,
`verification.json`, `verify.py`, `artifact-verification.json`,
`final-controls.json`, `terminal-db2/3/4.json`, `review.json`).
Report:
`C:/Users/nekot/.codex/visualizations/2026/10/27/01a17da5-b6ab-7ff0-a66c-e46d7e2cf42d/flowdoc-oracle-model20-diag01-fix-20261102/verification-report.html`.

## Legacy diagnostics recovery on copies — 2026-11-02: bounded proof PASS

User authorized planning and proof on copies only. Service owner, Evidence
Reviewer role, single-room execution IDs not applicable. Product candidate
83d7968 remains clean and unmodified. All planner/apply/test code is external
under the evidence directory; no recovery command was added to the product.

### Eligibility and proposed recovery sequence

1. Identify a trusted historical writer and pin its evidence. The proof uses the
   actual retained pre-DIAG model20 lab DB, source packet hash and known Core pin.
   Take a dump into an isolated DB; compare inventories before planning.
2. Read a consistent snapshot of the terminal task, normalization summary,
   findings, reservation and existing events. Require no child/held queue,
   settled storage accounting, known writer, no existing preparation ledger or
   completion summary, complete normalization details and valid preparation rows.
3. Recover exact preparation counts only when total retained details are
   strictly below the shared detail cap. At the cap, extra observations may have
   been discarded: refuse exact recovery rather than assume the retained total.
   Incomplete, malformed, active or unknown-writer histories also refuse writes.
4. Bind the plan to task allowlist, dump/writer hashes and snapshot digest.
   Re-lock and revalidate before applying. Append one provenance-labelled
   preparation-finding event with kind legacy-reconstruction/1; preserve the
   task outcome and existing findings, usage, jobs, files, outputs and reserves.
5. Verify the existing production taskSnapshot projection, idempotency and
   post-write inventories. A changed snapshot rejects; a failed transaction
   rolls back. Never render or resend a document to reconstruct observations.

### Evidence obtained

The source is the previously retained synthetic Oracle/OCI VM/private PostgreSQL
lab, not real user data or Oracle Database. All49 table counts/digests were stable
across source reads and matched the restored copy. Of its six original tasks,
four already have completion summaries, one has provably zero preparation
findings, and one failed DOCX has exactly one recoverable preparation finding.
Only the latter needs recovery. Its existing public projection changes from
findingCount0/omitted0 to1/1, retaining failed status, no output and the same
instance-first detail. This calls production taskSnapshot directly with a
read-only lab ownership adapter; it is not an HTTP authorization proof.

Ten initial checks passed: original-history classification, cap ambiguity,
incomplete normalization, active task refusal, unknown writer refusal, exact
recovery/idempotency, simultaneous apply yielding one event, injected rollback
with retry, stale-plan refusal and an expired terminal metadata-copy control.
Fresh review found no material defect, but identified the packet's malformed-row
branch as untested. One bounded follow-up supplied an invalid preparation row:
BLOCKED_FINDING_INTEGRITY, no ledger write and all49 post-fixture inventories
unchanged. Total **11 checks pass**; no skipped branch is counted as a pass.

The main proof appends four recovery events across separate target/copy cases,
plus one explicitly intentional stale-plan fixture event. The other48 tables
are unchanged after fixture setup. Derived cases are metadata fixtures, not
runnable storage restores; physical files and storage ownership are not proven.
Restored triggers remain enabled and immutable history is not rewritten.

Proof workers ran in separate512MiB/swap0/2CPU containers; compilation used the
existing1GiB/2CPU envelope. No OOM; all five retained round-owned containers are
stopped, source/proof hashes stable and known production identity metadata
unchanged. Earlier harness-only failures (inventory SQL quoting, waiting for DB
initialization, and freezing a host-inaccessible node_modules symlink) are
retained separately; they are not product findings or recovery success claims.

This proves the bounded copy-only recovery method, not production eligibility.
Before any real operation, separately resolve live-writer fencing, credentials,
actual historical provenance/caps and restore ownership. Capped or incomplete
histories remain unverified; do not convert their lower bounds into exact totals.
No Core/Service source, migration or ceiling change, real data/API/SQL/storage
access, real service stop, merge, push, release or installation occurred.

Evidence: `C:/Users/nekot/Documents/FlowDoc-recovery/service-model20-legacy-diag-20261102/`
(`packet.json`, retained attempt receipts, `run3/packet.json`, `proof.mjs`,
`results/result.json`, `results/invalid-result.json`, `receipt.json`,
`final-controls.json`, root `verification.json` and `review.json`).
Report:
`C:/Users/nekot/.codex/visualizations/2026/10/27/01a17da5-b6ab-7ff0-a66c-e46d7e2cf42d/flowdoc-oracle-model20-legacy-diag-20261102/verification-report.html`.
