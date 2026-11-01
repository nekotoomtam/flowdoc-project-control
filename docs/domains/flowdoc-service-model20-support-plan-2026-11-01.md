# Service model20 support — proposed design and phased plan

Authority Boundary: Project Control canonical PROPOSED Service support design.
Service owns persistence, API/capabilities, admission and lifecycle; Core owns
model20 definition/request/composition semantics. This document is not product
acceptance, implementation authorization, a release plan or a migration runbook
for real data. It does not change the existing stage/checkpoint contract.

Current scoped status 2026-11-01: M20-1 passed in candidate9f20506; M20-2 DB
ownership/pins/migration and selected regressions passed in candidate85a4d0e.
Both commits remain only in the separate Service candidate. M20-3 through M20-5
are not started and full model20 support is NOT accepted.

## Request, baseline and scope

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

## What actually blocks support

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

- [ ] Add tests/model20-authoring-api.test.mjs for new model20 save/get/validate,
  origin/reference ownership, font readiness and preview on an exact revision.
  Modify src/authoring/service.ts without weakening principal, revision, receipt,
  template identity or same-model guards.
- [ ] Guard unsupported20 clone/create/import paths explicitly; preserve model19
  implementations in sectionOperations.ts/sectionInstances.ts. A generic clone
  fallback is not acceptance of definition-aware cloning.
- [ ] Update src/http/authoring.ts capability discovery only for verified20
  features. Keep sectionInstances model19/array-by-id distinct from model20
  request assembly; qualify groupLabelSpans/formatSizing per tested model.
  Review src/tools/authoring.ts descriptions without claiming plugin/Editor
  adoption. Whole-definition tools must point to the route-specific contract.

### M20-4 — Real input/lifecycle and native output in Oracle-host lab

- [ ] First prove that the lab can bind the512MiB hard limit to each actual
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
  retained output or reservations. Verify limits and errors remain authoritative
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
worker/bundle, CPU1/pids96 as prior lab. DB/Service coordinator totals are separate
and recorded. Native rendering uses real processes/fonts with measured peak,
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
