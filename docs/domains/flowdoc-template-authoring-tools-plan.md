# Template authoring tools implementation plan

## Authority Boundary

Owner: FlowDoc Project Control. Status: proposed implementation plan, not implemented.
Owner requested planning on2026-10-14 for create/update/validate/preview tools;
publication requires explicit owner confirmation. Service owns implementation;
Core public APIs remain validation/layout authority. No release-readiness claim.
Spec: [AI authoring guide](flowdoc-ai-template-authoring-guide.md), especially
sections3–9, and [Area transition](flowdoc-area-document-transition-2026-10-14.md).

Goal: ให้ Luna/Terra สร้างและแก้โครงผ่าน structured tools ตรวจข้อผิดพลาดและดู
PDF preview ได้ โดยไม่เขียนไฟล์ repository/SQL และไม่เผยแพร่เอง

Architecture: add an authoring application layer in Service, narrow authenticated
HTTP routes, then a thin MCP adapter for the model. Reuse current draft storage,
Core public validation/preparation/composition and the existing renderer/storage
primitives. Preview has its own immutable input snapshot and output lifecycle;
it never creates a template_versions row. No new renderer or deployment required.

Tech stack: existing TypeScript/Node24/Fastify/PostgreSQL and packed Core Area18;
MCP transport dependency/version selected and locked during adapter work after
checking host support. Do not claim an MCP connection exists yet.

Working arrangement: single-room planning only; execution IDs N/A. Active role
Planning Partner, owner Service with Project Control documentation. Size medium,
risk routine; concrete risks are draft loss, unauthorized publication, stale
preview, unbounded input and duplicate work after retries. This plan does not
dispatch rooms, authorize publication, or begin product implementation.
Use inline implementation in the existing suitable isolated Area lane only after
checking current ownership/status. Preserve all pre-existing Area migration work.
No model/session switch is requested; resolve the implementation model against
host availability when starting execution, without inventing another room.

## Global constraints and decisions

- Initial target is candidate nodeModelVersion18, not release0.2.14. Finish and
  verify against the exact packed candidate; do not switch the production branch.
- Phase1 ends at draft preview. There is no publish tool or publish route in the
  model's allowlist. Existing admin CLI remains outside the model's permissions.
- Model sends complete valid Template definitions, not SQL, shell commands,
  filesystem paths, internal CurrentRecord IDs or arbitrary JSON patches.
- create is create-only. update replaces a whole definition atomically with
  expectedRevision; unknown fields and unintended omissions must be visible in diff.
- Internal normalized IDs must survive unchanged logical entities. Matching uses
  existing ownership and stable definition IDs/keys. Ambiguous rename/move is
  rejected with a structured issue in v1, not guessed or delete-and-recreated.
- Read-only validate does not persist. Invalid updates leave draft and revision
  unchanged. Preview never publishes, even temporarily.
- No parallel rendering increase. Preview and generation share one execution
  budget/serial scheduling boundary; no second independent renderer worker.
- Keep existing body/expansion/time/output/image limits unless a concrete
  requirement demonstrates a necessary change. Advertise effective limits through
  the contract; do not create a new arbitrary large memory allowance.
- Model host must expose only authoring tools and reference reads. HTTP/MCP alone
  does not revoke shell/filesystem tools available elsewhere in that host.
- No queue auto-scaling, memory optimization,483-page benchmark or public deployment.

## Proposed tool and HTTP contract

Names/routes below are planned, not currently callable. All authoring routes use
the same server-side principal and allowed-template check, including reads and
preview download. Never trust actor/tenant fields supplied by the model.

| Tool | Proposed HTTP | Input / outcome |
| --- | --- | --- |
| get_authoring_contract | GET /authoring/contract | supported models, schema, limits, known examples, capabilities |
| validate_template | POST /authoring/validate | definition, optional sampleRequest; issues/warnings and fingerprint; no writes |
| create_template_draft | POST /authoring/drafts | definition, idempotencyKey; templateId, revision, canonical definition |
| get_template_draft | GET /authoring/drafts/:id | definition, revision, fingerprint, editable identity contract |
| update_template_draft | PUT /authoring/drafts/:id | definition, expectedRevision, idempotencyKey; revision and explicit added/removed/changed diff |
| preview_template_draft | POST /authoring/drafts/:id/previews | expectedRevision, sampleRequest, optional supported upload handle, idempotencyKey; jobId/revision/fingerprint |
| get_preview_status | GET /authoring/previews/:jobId | queued/running/succeeded/failed/expired, bounded issues/warnings, artifact handle |
| get_preview_pdf | GET /authoring/previews/:jobId/pdf | authorized PDF bytes/download handle; no host path |

Use existing Result-style ok/value/warnings or ok=false/issues envelopes with
stable code/path/nodeId where available. Distinguish validation failure, stale
revision, idempotency conflict, access denial, expired output and resource failure.
MCP adapter translates bytes/artifact handles to what the actual host supports;
do not return an inaccessible container URL as though the user can open it.

Proposed retry rule: scope keys by authenticated principal + operation + target.
Same key + same canonical request digest returns the original outcome, including
revision/jobId; same key + different digest returns conflict. Persist receipt and
write in one transaction. A retry must not create a second revision or renderer job.
Choose documented retention at implementation using the existing job/output policy;
receipt lifetime must cover the advertised retry window and duplicate prevention.

## Review focus / proof obligations

1. Two writers at the same revision: exactly one successful update, no silent loss.
2. Edit immediately after enqueue: preview still renders its pinned snapshot.
3. Retry after response loss: same result, not duplicate draft/job or revision.
4. Group/Area rename/removal: preserve retained identities; surface removals and
   reject ambiguous ownership moves. PDF content must not silently disappear.
5. Preview image expiry/access: job only uses authorized pinned resources and
   releases them on success/failure; PDF download cannot cross principal scope.

## Work packages, in dependency order

Use inline task-by-task execution (superpowers:executing-plans) when implementation
is authorized. Each task starts with a meaningful failing behavior test, then the
smallest implementation, scoped checks, diff review and a scoped commit. No
automatic delegation or docs/superpowers artifacts are required.

### 1. Resolve implementation seams and freeze the contract

- [ ] Read Service AGENTS and trace src/templates/{current,assembly,storage}.ts,
  src/jobs/{admission,repository,processor}.ts, images/job.ts, storage outputs and
  upload lifecycle. Current processor loads template_versions by versionId, so
  preview cannot simply call submitJob with an unpublished template.
- [ ] Confirm existing authorization and scheduler seams. Inspected HTTP factory
  currently has no authoring principal layer; do not presume tenant/auth support.
- [ ] Set local prototype access: loopback by default, authenticated tool principal
  with explicit allowed template IDs/create permission, credentials outside model
  arguments/logs. No remote/multi-tenant deployment in this phase. Fail closed if
  a reliable host identity/credential channel is unavailable.
- [ ] Select the least invasive shared serial scheduler approach. Keep a single
  owner lock; define ordering/fairness and outstanding limits for both job kinds.
  Resolve uploaded image pinning/reuse before writing preview runtime code.
- [ ] Return to owner only for actual contract/ownership expansion. Routine module
  choices stay within this plan. Record findings here, not another broad report.

Deliverable: frozen tool schemas and storage/scheduler design. This discovery is
read-only to runtime. Acceptance: no unresolved auth, identity or snapshot seam.

### 2. Contract and read-only validation

Planned new files: Service src/authoring/contract.ts, validate.ts;
tests/authoring-contract.test.mjs, authoring-validation.test.mjs.

- [ ] Describe exact supported Area18 schema/capabilities from verified Core rules;
  no permissive generic JSON schema that claims unsupported placements work.
- [ ] Call public Core validateTemplate, prepareGeneration and composeDocument.
  Return missing sample data separately from structural failure. Preserve warnings.
- [ ] Test both guide examples, unknown/duplicate keys, invalid ownerAreaId,
  missing required values, oversized/deep input and errors without private paths.
- [ ] Verify no DB writes or published-version changes occur during validation.

### 3. Atomic draft create/read/update and receipts

Planned new files: Service src/authoring/service.ts, definitionAdapter.ts,
receipts.ts; tests/authoring-drafts.test.mjs. Reuse/change templates/current.ts,
assembly.ts and storage.ts only where the adapter/transaction boundary requires.
Add a forward-only migration after014 (tentatively015_authoring_previews.sql;
recheck unused sequence before creating it). Do not rewrite014 or released migrations.

- [ ] Add create-only flow using importCurrent semantics; return stable identity
  and revision. Reserve template identity and receipt atomically.
- [ ] Implement definition round-trip and identity reconciliation, then validate
  assembled output before save. Ensure full-definition update doesn't erase
  retained normalized IDs or bypass existing ownership/deletion controls.
- [ ] Lock/check expectedRevision and write/receipt in one transaction. Return
  diff including deleted variables, Formats and Areas. No last-writer-wins.
- [ ] Test round-trip equality, stable IDs, reorder, add/remove, ownership move
  rejection, duplicate identity, stale update, rollback and response-loss retry.

### 4. Revision-pinned preview jobs and output

Planned files: Service src/authoring/preview.ts, previewRepository.ts;
modify jobs/processor.ts and shared job/scheduler seams identified in task1;
reuse jobs/render.ts and storage/pdf-files.ts/outputs.ts through narrow adapters.
Tests: authoring-preview.test.mjs, authoring-preview-lifecycle.test.mjs.

- [ ] Snapshot canonical definition + revision + fingerprint and validated sample
  data at admission, bound to principal. Do not hold a DB transaction during render.
- [ ] Store preview jobs/snapshots separately from template_versions; use the same
  Core and isolated renderer path. Share serial execution and global admission
  capacity with published jobs; no extra worker that doubles RAM concurrency.
- [ ] Define image-resource ownership/pinning under existing upload contracts,
  status transitions, restart failure handling, TTL, cancellation if already
  supported, and cleanup on error. Do not claim new cancellation support implicitly.
- [ ] Return actionable validation/layout errors and download handles. Authorize
  status/PDF access. Define repeated downloads for the preview policy explicitly;
  do not accidentally inherit a single-use generation output contract.
- [ ] Test draft changed/deleted after enqueue, corrupt pinned data, restart,
  timeout, missing/expired images, repeat download/expiry and cross-principal denial.
- [ ] Assert no new published versions/receipts after all preview paths. Compare
  preview PDF with generation from the same definition/data in an isolated fixture.

### 5. Authenticated HTTP surface

Planned new files: Service src/http/authoring.ts, src/authoring/access.ts;
modify src/http/server.ts and server.ts for explicit configuration;
tests/authoring-http.test.mjs.

- [ ] Implement only the eight planned phase1 routes and strict schemas with
  effective request limits, principal checks, no filesystem-path inputs, bounded
  diagnostics and proper conflict/validation/expiry HTTP outcomes.
- [ ] Test unauthorized access, wrong template scope, invalid JSON, large payload,
  unknown properties, prototype keys and idempotency through real HTTP.
- [ ] Keep authoring disabled unless configured. Existing generation routes and
  contract behavior must retain their previous tests and behavior.

### 6. Thin model tool adapter and room setup

Planned files: Service src/tools/authoring.ts, src/tools/server.ts,
tests/authoring-tools.test.mjs; package manifest only for the verified MCP dependency
and explicit entry command. Hosting may use another adapter only if target host
support requires it; keep domain rules in Service, not duplicated in transport.

- [ ] Advertise small descriptions/schemas and contract-first usage. Adapt existing
  authenticated authoring HTTP calls; no subprocess CLI or direct SQL fallback.
- [ ] Credential supplied by host configuration, not model-generated arguments.
  Bounded artifact handling; no unrestricted URL fetch/file read tool.
- [ ] Check host can connect and present PDF output. Configure the eventual trial
  room with reference-read + authoring tools only and no repo/shell/DB write tools.
- [ ] Verify publication is absent from tool catalog and cannot be reached through
  an arbitrary HTTP-call escape hatch. A natural-language publish request alone
  must not grant the adapter a publication capability.

### 7. End-to-end acceptance and guide update

- [ ] Core example checker and scoped Service tests pass against exact packed
  candidate; real isolated DB/migration/HTTP tests cover added/affected surfaces.
- [ ] Execute create → get → update → validate → preview → status → download,
  retry/conflict, invalid data and corrected retry; zero template_versions writes.
- [ ] Inspect rendered examples and altered data (long Thai, extra rows, empty
  group/Area), text completeness, header/footer, page breaks and link destinations.
  New preview-vs-generation parity does not prove similarity to a user's PDF.
- [ ] Owner-supplied PDF + actual Luna OR Terra trial is a separate final usability
  criterion: record model, supported tools, reference file, assumptions, corrections
  and remaining visual differences. Until supplied/connected, mark this NOT RUN,
  never replace it with success from a stronger model or synthetic reference.
- [ ] Update existing guide/this plan with actual callable schemas and evidence.
  Stop at acceptance; do not add broad optimization/benchmark work automatically.

## Publication boundary: later, owner-controlled

Phase1 contains no publication implementation or automatic approval. Future
publication request must present templateId, exact draft revision/fingerprint,
preview job/artifact, important diff and warnings to the human. Confirmation
must come through a trusted human channel, never a model-supplied approved=true.

Future backend must atomically check that current revision/fingerprint matches
the confirmed preview, reject an edited draft, and call publication with an
idempotency requestId. Current publishCurrent accepts templateId/requestId only;
revision pinning must be added before connecting it to that approval flow.
No owner confirmation is collected now for an artifact that does not yet exist.

## Proof budget, document budget and stop conditions

Proof: targeted unit/integration tests per task, one isolated Linux packed-consumer
end-to-end sequence, parity/visual checks for representative preview fixtures,
one actual model trial once prerequisites exist. Reuse prior unchanged renderer
tests; no automatic full Core rerun or three-run RAM benchmark for API wrappers.
Run affected checks if renderer/scheduler behavior changes. Preserve shared
host RAM start/stop guards for real rendering; avoid concurrent heavy jobs.

Documents: this plan plus existing AI guide/Area transition record only. Product
README may gain a code-adjacent setup section with its Authority Boundary when
actual tool setup exists. Test evidence belongs to repository tests/artifacts,
not prose claims. No new Work/Phase IDs merely to enter this inline workflow.

Open prerequisites: exact target host MCP setup, supported credential/approval
channel, reference PDF and choice of model for the usability trial. They do not
block writing this plan; runtime exposure and model acceptance must not be claimed
until resolved. Package candidate is not yet release-integrated. No production
DB write, release merge, publication or new task creation is authorized by this plan.
