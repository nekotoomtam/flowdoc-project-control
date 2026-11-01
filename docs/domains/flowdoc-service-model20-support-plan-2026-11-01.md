# Service model20 support — proposed design and phased plan

Authority Boundary: Project Control canonical PROPOSED Service support design.
Service owns persistence, API/capabilities, admission and lifecycle; Core owns
model20 definition/request/composition semantics. This document is not product
acceptance, implementation authorization, a release plan or a migration runbook
for real data. It does not change the existing stage/checkpoint contract.

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

## Phased implementation and proof plan — not started

Future work is primarily one isolated Service candidate; Core and its pin stay
unchanged unless a concrete missing Core API is separately demonstrated. Medium
to large implementation, routine planning risk; persistence/integrity failures
escalate on evidence. Future PLAN defaults to Astra/medium; WORK must independently
record actual host tooling/model availability. No dispatch/model switch now.

### M20-1 — Preserve definitions and expose the right request contract

- [ ] Add failing focused tests in tests/model20-assembly.test.mjs and
  tests/model20-contract.test.mjs for20 decomposition, record validation,
  assembly and reconcileDefinition; unchanged18/19 fixtures stay exact.
- [ ] Implement the mapping above in src/templates/assembly.ts and review
  src/authoring/adapter.ts. Preserve fingerprints, formats, row groups, sizing,
  images, links, headers/footers, numbering, schema1/2 and font references.
- [ ] Extend src/templates/contract.ts. Return nodeModelVersion20, definition
  IDs/sectionKeys and request-defined instance semantics; leave18/19 response
  shapes intact. Include one A,B,A example with distinct instanceKeys.
- [ ] Distinguish public raw requests from internal encodings: /documents uses
  sections array with sectionKey,instanceKey,data and supported header/footer/
  assets; preview and /jobs use the existing Core prepared-generation input
  shape, which is not the raw section-assets task shape. Prepared schema3,
  normalized Core flowdoc-task-input/2 and Service normalization_version2 are
  different contracts; do not rename Service task/job envelopes for model20.
- [ ] Check roundtrip and source identity assertions, not type equality or
  merely absence of exceptions. Do not enable capabilities at this partial stage.

### M20-2 — Database ownership and pinned input integrity

- [ ] Add tests/model20-storage-db.test.mjs and tests/model20-migration.test.mjs
  against synthetic model18/19 data in an isolated source-schema027 PostgreSQL.
- [ ] Add a NEW migration, proposed028_model20_section_definitions.sql if the
  slot is still free. Never edit applied021/025/027. Extend ownership functions
  to recognize20 with the existing section ownership rules and retain deferrable
  FK/unique constraints for current AND published records.
- [ ] Extend protect_preview_input from021 and the LATEST protect_job_input
  from025 with exact Core20 pin/prepared-schema3 checks. Preserve19/schema2 and
  all existing18 behavior. Copying the old021 job function would lose task pins
  and PDF/DOCX output-format immutability; regression tests must detect that.
- [ ] Exercise freshRecord/writeCurrent/writeSnapshot, registerTemplate,
  publishCurrent/loadTemplate and font-retention snapshots in real transactions.
  Assert record ownership, stable IDs and immutable published fingerprints after
  draft edit/reorder/key rename, including header/footer/area-format ownership.
- [ ] Prove registration/publication retries and concurrent saves keep existing
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
