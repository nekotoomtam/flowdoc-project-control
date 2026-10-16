# Template authoring tools implementation plan

## Authority Boundary

Owner: FlowDoc Project Control. Status: authoring tools included in Core/Service release 0.3.0 (Area18 only), verified 2026-10-15. See the current release acceptance in [Area transition](flowdoc-area-document-transition-2026-10-14.md). Local flowdocmake packaging through 0.1.2 and source-coverage trials are recorded below; candidate-specific entries are bounded evidence, not model-equivalence or pixel-fidelity claims.
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
MCP transport dependency/version is locked. Local Codex MCP connection has been
verified; each consuming room must verify its own tool availability with a real
contract call. Connection success alone does not prove full authoring-task completion.

Working arrangement: single-room implementation; execution IDs N/A. Active role
Product Implementation Agent, owner Service with Project Control documentation. Size medium,
risk routine; concrete risks are draft loss, unauthorized publication, stale
preview, unbounded input and duplicate work after retries. This plan authorizes bounded inline implementation, not publication or deployment.
Use inline implementation in the existing suitable isolated Area lane only after
checking current ownership/status. Preserve all pre-existing Area migration work.
No model/session switch is requested; resolve the implementation model against
host availability when starting execution, without inventing another room.

## Global constraints and decisions

- Initial target is candidate nodeModelVersion18, not release0.2.14. Finish and
  verify against the exact packed candidate; do not switch the production branch.
- Phase1 ends at draft preview. There is no publish tool or publish route in the
  model's allowlist. Existing admin CLI remains outside the model's permissions.
- Owner refinement: first create an empty identity from name/docKey and receive
  server-generated templateId with revision0. Then submit a complete definition
  (including global/section/Format variable schemas) under that identity. An empty
  identity cannot preview. Incremental node/Section authoring is deferred.
- Model sends complete valid Template definitions after identity creation, not SQL, shell commands,
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

Names/routes below are implemented on the local candidate, verified as recorded below. All authoring routes use
the same server-side principal and allowed-template check, including reads and
preview download. Never trust actor/tenant fields supplied by the model.

| Tool | Proposed HTTP | Input / outcome |
| --- | --- | --- |
| get_authoring_contract | GET /authoring/contract | supported models, schema, limits, known examples, capabilities |
| validate_template | POST /authoring/validate | definition, optional sampleRequest; issues/warnings and fingerprint; no writes |
| create_template_draft | POST /authoring/drafts | name, docKey, idempotencyKey; server-generated templateId, revision0, empty state |
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

- [ ] Add create-only identity flow; return server-generated templateId and
  revision0. Reserve template identity, ownership and receipt atomically. First
  complete definition save creates normalized current/schema/variable records;
  do not import a dummy document to manufacture an empty draft.
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

## Execution result — 2026-10-14

The checklist above retains the original detailed proof intentions; the following
coverage is the executed result, not a blanket claim that every listed scenario
or the future model trial ran. No Work/Phase/Checklist execution IDs apply.

- Implemented identity-first create/read/full-definition update, Core validation,
  revision-pinned previews, authenticated HTTP and an official MCP stdio adapter.
  Definition/schema storage reuses the normalized CurrentRecord model. New
  migration015 stores ownership, atomic retry receipts/audit and preview pins.
- Preview uses generation_jobs with a distinct immutable source, the same serial
  advisory lock and admission capacity, and no template_versions insertion.
  Status/PDF/uploads require the configured principal. Preview downloads repeat
  until existing output TTL; receipts/audit persist until administrative cleanup.
- Auth is a host-configured local token/principal, not a new multi-tenant login
  system. No host connection/credential installation or remote exposure performed.
- Contract includes complete Area18 definition/request examples and effective
  limits. Core remains the exhaustive validator; no claim of an independently
  complete JSON Schema. Adapter inputs are strict envelopes, with Core validating
  the nested definition. Relevant operations are grouped in service.ts and
  adapter.ts rather than the tentative per-operation filenames above.

Evidence:

- Service build PASS. Fresh Linux image + isolated PostgreSQL: 206 passed,
  0 failed, 0 pending; installed Core hashes match verified area.4 exactly.
  Local artifact: flowdoc-service/artifacts/authoring-tools-final-20261014/
  tests-result.json; cleanup.json confirms disposable DB/image cleanup.
- tests/authoring.test.mjs: create identity0, save schemas, stable IDs, invalid/stale
  update, retry/conflict, principal denial, edit-after-enqueue pin, zero published
  versions, actual renderer preview bytes equal direct pinned renderer bytes,
  repeated download, PDF expiry, concurrent writers, validation without writes,
  malformed/duplicate/prototype/oversized JSON, owned upload receipt/replay,
  cross-owner/public upload denial and expired-resource admission.
- tests/authoring-adapter.test.mjs and authoring-diff.test.mjs cover retained IDs,
  ambiguous group rename rejection, nested Section removals and diff truncation.
  Both review findings reproduced RED then fixed GREEN. Whole candidate reviewed
  once by a fresh reviewer; no remaining reported important findings.
- tests/authoring-tools.test.mjs uses an MCP client/transport: tool discovery,
  configured credentials, PDF resource reads, arbitrary file URI rejection and
  absent publish/shell/SQL tools. This is protocol testing, not a connected host trial.
- Existing migration/publication, scheduler, renderer, image failure/recovery and
  upload tests passed in the same 206-test run. Authoring image tests exercise
  upload ownership/admission, not a new full visual image-layout acceptance run.
- Project Control example checker passed requirements/grouped, long Thai/changed
  rows, empty Area/group and invalid inputs. That checker does not render PDFs.
  Preview byte parity reuses the unchanged renderer baseline; no new visual
  similarity claim against an owner-supplied PDF is made.

Ruling: preserve normalized variable identities only for unchanged keys/owners;
reject same-type replacement in the same schema or same-key moves as ambiguous,
including groups. This avoids silently reassigning IDs; the cost is that an
intentional simultaneous remove/add may need separate explicit edits. No rename
operation is introduced in this phase.

Ruling: reuse existing representative renderer/image failure evidence plus new
preview byte parity and ownership tests. Do not repeat the whole Core rendering
matrix or RAM benchmark. Cost: no fresh authoring-specific visual image-layout
comparison; actual PDF/model usability remains an explicit prerequisite below.

Area18 Service storage/migration/examples and exact area.4 packed dependency are
required by this feature. Preserve their existing contents in the candidate
snapshot so the authoring commit is reproducible; do not promote Core source or
release. Older area.1–3 local tarballs and the Core worktree are not modified.

Remaining NOT RUN: real Luna/Terra host connection, PDF display in that host,
owner-supplied reference reconstruction and its visual acceptance. Required input:
reference PDF and selected model/host with authoring-only permissions. These are
usability acceptance prerequisites, not automated implementation PASS claims.
Publication is deliberately absent and awaits a separate owner-confirmed flow.
No release merge/push, public deployment or production database changes occurred.

Service candidate commit: 2b1ab0f (codex/area-document-v18). Core packed source remains a candidate with sourceCommit=null; no release provenance is claimed.

## Codex hands-on trial — 2026-10-14

Owner requested testing by this assistant before a Luna/Terra trial. Result:
**PARTIAL / RISK**, not full authoring usability acceptance. The prior 206-test
result remains valid; this new scenario exposes a gap outside that fixture set.

A real MCP stdio client launched the shipped tool server and called the isolated
HTTP Service (candidate2b1ab0f), with real PostgreSQL and renderer. Codex assembled
a Thai SRS from the guide's requirements structure, received a fresh identity,
saved definition/schemas, validated, corrected missing required title, edited to
revision2, observed stale-revision rejection and replayed the same preview job.
No direct storage writes substituted for authoring tools. Template_versions count
was0 after the trial; no publication occurred.

Original full Thai introduction failed preview with LAYOUT_FAILED at
section-main~intro although validate/compose succeeded. Adding a newline while
retaining the introduction also failed. A short introduction moved failure to
the original Thai chapter heading. Shortening both produced a control PDF:
2 A4 pages,14 unique REQ codes, correct explicit page break and page numbering.
Both pages were visually inspected: Thai glyphs legible, labels and first-column
codes centered, no visible clipping. MCP resource retrieval and repeated download
were byte-identical. **The shortened control is not an equivalent repaired output
of the original full content.** Root cause of the layout failures is unresolved;
do not infer that Thai text in general is unsupported or that the tool is ready
for arbitrary SRS documents.

Local reproducible requests, MCP responses, PNGs, extracted text and result.json:
flowdoc-service/artifacts/authoring-self-trial-20261014/. Full-content input is
preview.json; shortened control is preview-short-headings.json. The final PDF is
preview-short-thai.pdf (SHA256
7ed3dacaf30ae42b04e2ba30ef92208a2b93eb49bbaa84f1d27197a52e923577).
The disposable DB/containers/image and credential file were removed afterward.
No product source changed. Next bounded work should diagnose the preserved
full-content layout failure before the actual Luna/Terra/reference-PDF trial.
This trial does not prove native host tool installation or reference reconstruction.

## Full Thai layout diagnosis and correction — 2026-10-14

The prior hands-on trial's unresolved layout issue is resolved for its exact full
input. Owner asked to retain all text and inspect every PDF page. Inline role:
Product Implementation Agent, owner Service examples and Project Control guide;
Core inspected read-only. Execution IDs N/A. This is a template configuration fix,
not a change to Core text shaping, wrapping, layout guards or Service runtime.

Native shaping of the original fixture measured body12 ink/font height18.984pt
against configured lineHeightPt18; bold16 chapter text required26.032pt against24.
Core correctly rejected the line's vertical fit. Length was correlated with
encountering the affected glyphs, not the direct cause. The Service's bounded
LAYOUT_FAILED message hid this distinction, so the prior trial could not diagnose
it from the public error alone. No diagnostic/API expansion in this scope.

Correction: body line height20pt and heading28pt; original font sizes, text,
Section/Area structure and page-break position unchanged. Service's advertised
Area example and both guide templates use the corrected spacing. Added Service
examples/thai-authoring-{template,request}.json from the preserved full trial and
tests/thai-authoring-layout.test.mjs, which executes the real isolated renderer.
Watched the new test fail at section-main~intro with the original spacing before
changing it; the corrected test passes.

Evidence: flowdoc-service/artifacts/thai-layout-fix-20261014/diagnostic.json,
metrics.json, pdf-verification.json, full-thai.pdf, full-page-{1,2}.png and
check-service.mjs/tests-result.json. Fresh Linux packed candidate verification:
10 affected authoring/Area/Thai tests PASS, no failed or pending tests; unchanged
Core area.4 installed hashes verified. Guide example checker PASS. No full Core
suite or new RAM benchmark required for these style-only changes.

PDF inspected visually on both A4 pages: no clipped/overlapping glyphs, centered
column headers/codes, second chapter starts page2, correct1/2 and2/2 footers.
Text extraction verifies32 values and14 requirement codes exactly once. Request
object equals the preserved original; restoring only the two line-height values
makes the corrected definition equal the original. Full PDF SHA256:
3a7156e758e8108648aef885b7150db93c5e808ff76752dbff4249ec4e7ef42e.
All original content is retained; the shortened control is not used for acceptance.

Actual Luna/Terra and owner-reference reconstruction remain separate NOT RUN
criteria. No publish or release promotion. Existing Core worktree has unrelated
uncommitted Area migration work; do not delete it or unmerged candidate lanes.
No additional worktree was created for this correction. Cleanup after integration
remains required under the owner's instruction and the worktree safety boundary.

## Direct PDF save correction — 2026-10-14

Bounded owner-requested inline correction; Service implementation, execution IDs
not applicable. The MCP host now offers `save_preview_pdf(jobId)`, downloading
through the existing authenticated preview endpoint and saving bytes directly.
It returns an absolute host path, byte size and SHA-256; model-supplied output
paths are rejected. Default directory is the MCP user's Downloads/FlowDoc-previews,
overridable by operator-only AUTHORING_PREVIEW_DIR. Each call creates a separate
file and local copies remain until the user removes them. Existing resource reads
remain supported. Restart the registered MCP process to load the new tool.

Evidence: Service tests/authoring-save-pdf.test.mjs observed missing-tool failure
before implementation, then passed with tests/authoring-tools.test.mjs (2 tests).
TypeScript build and diff whitespace checks passed. Coverage includes exact binary
bytes, digest, repeated saves preserving prior files, denied downloads leaving no
file, and rejecting arbitrary output paths. No HTTP/database/rendering changes.
Real stdio MCP call against retained job 01a139a1-ee4b-70b2-9a75-0d843aacee8d
saved 77341 bytes with SHA-256
325c8b275f6a340f9845c57e571334bcc3200ffbf7c996840df0ab00560ada66.
Poppler parsed/rendered both pages; both page images were inspected. Evidence
scripts/results remain in Service artifacts/pdf-resource-check-20261014.
No new preview, draft mutation, publication, release promotion or database changes.
Other-room live tool discovery after MCP restart remains unverified here.

## Stacked Thai marks renderer correction — 2026-10-14

Owner authorized renderer correction with original data retained, full revision3
preview verification and no publish. Inline scope: Core measureText and regression
tests, Service packed dependency, existing Project Control guide/record. IDs N/A.
Core fde34a9 now reserves max(configured leading, shaped ascent + descent) per
ordinary text line. Width and page/frame limits remain enforced; no normalization,
character removal, schema mutation or draft changes. Native Sarabun12 probe measured
21.528pt for the original duplicate-mark text versus configured20pt.

Core build and 210 layout/PDF tests passed (31 files), including RED->GREEN tall-ink
regression, unchanged text, pagination/no overlap and oversized-page rejection.
Service decec4a consumes Linux-packed area.5 SHA256
8cdb4c692d2066583f2626d5c86009c039e3fe3e3106099b6bfa0243b315926f.
Package comparison against area.4 proved only package.json and
 dist/layout/measureText.js changed; all other file hashes/modes unchanged.
Initial Windows repack lost executable permission and failed native probe; it was
replaced by the verified Linux pack before runtime rollout. Linux native original
marks check and 3 affected Service tests passed. Local API rebuilt/recreated only;
DB preserved. Existing candidate worktrees remain unmerged with unrelated changes.

Full preview job 01a139cf-9dde-7f20-be19-70a0c6ff3fc5 succeeded with no warnings or
skipped indices, template d7771add-58b3-4765-ab64-530a02e54b92 revision3. Database
JSONB comparison proves original_input and preview_definition identical to failed
job 01a139c8-bba6-7c9a-89f6-d231953dac5d. Direct save tool produced128 pages,
1109585 bytes, PDF SHA256
7eb8eee6104de9756d73a6d15db0a9264fa1a981ddce465b201c0d08f4fd1efd.
All128 pages rendered and visually reviewed in16 contact sheets; page108 inspected
separately for original stacked marks. No visible clipping/overlap observed.
Text extraction verified1229 nonempty data values,361 unique nonempty requirement
codes exactly once in payload order, original duplicate marks and all page numbers.
363 requirement entries include2 empty-code rows already in the payload. Extraction
check ignores whitespace and repeated page/table headers for cross-page values;
it does not normalize Thai marks. Evidence: Service artifacts/stacked-mark-fix-20261014
(original.json, check-native.mjs, verify.py, verification.json, page images).

This proves rendering of the unchanged supplied revision3 request, not fidelity to
the98-page reference. Many sparse pages remain from every-six-lines page breaks;
blank cells and out-of-table requirements are inherited authoring choices. No
publication, release promotion, global readiness or new performance claim.

## Full-document completion guide clarification — 2026-10-14

Owner requested a documentation-only inline correction after two rooms stopped
at intermediate draft milestones. Updated the authoring guide to distinguish
Area18 schema version from task scope, require full-data preview/download/all-page
inspection before successful completion, and reserve owner approval for publish.
Small samples are intermediate checks, not an implicit stop. Progress reports must
not claim background activity after ending a turn. Genuine blockers and host limits
must be reported with evidence and remaining work. Removed stale proposal-only and
unconnected-host statements; corrected existing-draft and expectedRevision steps.
Implementation/tests/runtime unchanged. Review covers scope, intermediate steps,
error handling, completion checklist, starter instructions and publication boundary.
Cross-room behavior with this revised guide is NOT RUN; owner will retry separately.
This clarification does not guarantee model persistence or certify reference fidelity.

## Developer reference split — 2026-10-14

Owner requested a detailed standalone developer reference after Sol produced a
static contents table and independently sized image/table frames. Added
[Developer Documentation](../developer/authoring/README.md) with structure/data,
node/property, layout/defaults, contents/repetition, API, examples and verification
chapters; the authoring guide now routes readers to the relevant chapter.
Authority is bounded to candidate Area18 and installed Core area.5. This is inline
documentation synthesis, not a registered execution or release promotion.

Added a reusable reference definition/request and checks. Installed-package
validate/prepare/compose and six negative cases pass. Native PDF render produces
2-page baseline and 4-page expanded data; PDF checks verify TOC page2→4, actual
internal destinations, external URI, global version bindings, and aligned190mm
header/table widths. All6 rendered pages visually inspected. Existing two example
pairs pass their original checker. Detailed sources, commands and untested
combinations are recorded in the reference verification chapter. No user draft,
runtime, source data or publication was changed. Model behavior and the reported
Sol continuation-layout issue are not certified or repaired by this work.

## Reference mapping guidance — 2026-10-14

Owner requested general guidance after reviewing the Sol revision 5 PDF, including
borderless alignment for symbol/description and term/definition lists. Added
reference-mapping.md and links from the developer index, layout and workflow guide.
Guidance preserves source rules, signature space, lines, assets and data provenance;
it separates data completeness, runtime behavior and visual fidelity. Candidate
Core validateGraph.ts permits borderColor but no border-disable property, and
documentFlow.ts emits 0.5pt strokes. White borders are therefore documented only
as a visual workaround on a uniform white background, not true borderless support.
Scope is inline documentation synthesis; no runtime, draft or publication changes.
Checks: property/source inspection, local links, JSON fragment parsing and diff
review. No new render or cross-model trial is claimed by this documentation update.

## Alignment and footer clarification — 2026-10-14

Read-only inspection of Sol template 3b65e476-12bd-4294-b833-ff1131f38403,
live revision 5, confirms approval title has no textAlign while role/person cell
blocks use center. Both approval/main footers order line before columns, with
weights 4:2:2, gap 8pt and a centered compact page-field block in column two.
This centers within that column, not the page. With a 190mm band its center is
about 23.04mm right of the page center. This corrects the earlier conversational
claim that the page label was horizontally centered on the page; it does not
infer the model's intent or change previous acceptance records.

Added general alignment-reference-area and footer-order guidance to the mapping
chapter, with links from layout/workflow guidance. Source inspection of Core
pageBands.ts and validateGraph.ts supports column geometry, stack order and
property boundaries. Checks cover arithmetic, local links, diff and Markdown
fences. No user template/runtime changes, new PDF render or publish in this update.

## Document-family routing — 2026-10-14

Owner approved three layers: shared principles, layout family and observed cases.
Moved the existing case-selection table into document-families/flowing-book.md,
retaining shared alignment/border/data/check rules in reference-mapping.md.
Added a compact observation-to-choice mapping and links from the developer index
and workflow guide. Business document names are examples, not automatic layout
rules; other families remain future scope until real differing requirements arise.
Inline documentation maintenance only. Verification covers preserved case rows,
local links, Markdown fences and final diff; no runtime or draft changes and no
new rendering/model trial claimed.

## flowdocmake package proposal — 2026-10-14

Historical proposal status (2026-10-14): planned, not installed or implemented.
See the 2026-10-15 implementation entry below for current status. Owner requested planning for a
single discoverable entrypoint combining authoring tools and routed documentation.
Scope of this update is Project Control planning prose, inline Documentation
Synthesizer; execution IDs are not applicable. Product implementation ownership
must be resolved against current owner guides before changing those repositories.
No new chat, configuration, runtime or draft mutation is part of this planning step.

### Intended experience and boundaries

User invokes flowdocmake with a source PDF/data or existing template ID. The
entrypoint checks connection and compatibility, loads only relevant guidance,
creates an empty draft identity first for new work (or reads the current revision
for existing work), then composes, validates, previews, saves and reviews the PDF.
It continues through authorized repairs until review-ready or a genuine blocker;
a saved revision/job ID is not completion. Publish remains separately authorized.
Keep publication absent from the default tool surface; do not add direct database
or file mutation as a fallback for unavailable authoring tools.

### Delivery sequence

1. **Package/discovery prototype.** Inspect host-supported plugin packaging and
   existing MCP installation. Prefer one local package with a flowdocmake skill,
   MCP configuration and versioned references. Reuse existing authoring tools.
   Prove discovery in a fresh chat before committing to the installation format;
   a standalone skill alone does not install or connect its tool dependencies.
   Keep machine credentials outside the package and avoid temporary worktree paths.
2. **Versioned guide routing.** Keep maintained documentation in Project Control.
   Package a reproducible, read-only snapshot with source commit and content hashes,
   preserving relative links. Do not maintain a second editable manual or silently
   read a moving latest revision during an existing run. Route shared principles
   → document family → cases → needed schema/API reference. Start with flowing books.
3. **Read-only preflight.** Check tool availability, successful authenticated
   get_authoring_contract, required tool schemas, compatible documentation and
   available local PDF saving/rendering/inspection capabilities. Distinguish
   missing installation, unreachable Service, authorization failure, incompatible
   contract and missing PDF reader. A reachable container is not readiness proof.
   Do not create a draft as a connection probe. Bound retries; return an actionable
   blocker rather than looping, reinstalling or restarting unrelated services.
4. **Authoring workflow.** Record source authority and observed layout cases;
   use existing draft lifecycle, expectedRevision and idempotency rules. Preserve
   input and identity across retries. Record template ID/revision/fingerprint,
   job ID, source locations, output path/hash and remaining checks in the working
   result so an interrupted run can resume without duplicating drafts. Read fresh
   state before updates. No claim of background work after the turn ends.
5. **Review delivery.** Save PDF directly, inspect every output page, reconcile
   unresolved source values, and verify applicable TOC links/alignment/tables/assets.
   Report data, behavior and visual results separately, with known differences.
   A render failure keeps its exact failing input; no shortening source text to pass.
6. **Acceptance trials.** Test a fresh chat invocation with no manual guide-path
   coaching; missing Service/tools; authorization failure; incompatible version;
   create and existing-draft workflows; interruption/retry; image and direct PDF
   saving; and a flowing-book fixture with TOC, alignment, border workaround and
   variable rows. Then run the owner's full reference case through review without
   publishing. Any separate chat dispatch requires explicit authorization and the
   applicable coordination route. Model persistence is measured, not guaranteed.

### Version contract proposal

Track independently: flowdocmake package version, documentation source commit/hash,
authoring contract version/capabilities, supported schemaVersion/nodeModelVersion,
Service/Core build identifiers, and template revision/fingerprint. Package version
must never substitute for schema version or draft revision. Use an explicit tested
compatibility set; a newer number is not assumed compatible. Missing runtime
identity is unknown, not evidence that the installed Core matches a guide.

Live get_authoring_contract on 2026-10-14 succeeded and advertises node model 18,
draftDefinitionVersion 1 and publicationEnabled false. This does not prove an
exact Service/Core build. Before implementing version enforcement, inventory the
full current response and add narrowly scoped contract/build/capability metadata
only where absent, through the Service owner. Proposed metadata names are not
current callable API fields. Unsupported versions stop dependent mutations and
identify the needed compatible package; no automatic migration or upgrade.

### Acceptance and proof budget

Success means a fresh room can discover both skill and tools, retrieve the correct
reference snapshot, diagnose connection failures before mutation, and produce a
reviewable saved PDF with traceable versions and complete scoped checks. Publish
must remain unavailable without a distinct authorized path. Validate package links,
snapshot freshness, credentials exclusion and compatibility tests, then focused
workflow fixtures and one full-document trial. Broaden checks only for a new failure
or affected behavior. Do not claim model equivalence from one successful trial.

Packaging references inspected for this proposal:
[skills](https://learn.chatgpt.com/docs/build-skills) and
[MCP](https://learn.chatgpt.com/docs/extend/mcp?surface=cli).
Host-specific single-package installation and exact metadata extensions remain
implementation discovery items, not verified features of flowdocmake.

## flowdocmake local implementation — 2026-10-15

Owner authorized implementation for released Service/Core 0.3.0. Single-room
Project Control implementation/documentation scope; execution IDs not applicable.
Sources are `plugins/flowdocmake`, `.agents/plugins/marketplace.json`, the snapshot
builder, focused tests and trial/check scripts. Core/Service release commits and
tags are unchanged. Package version 0.1.0 is independent of runtime 0.3.0.

Installed locally through Codex marketplace/installation commands. It bundles
the skill, 21 hash-pinned reference/example/checker files from source commit
5b4b7696f81e6d2074de973f31fac178c8ffd1b5, and existing draft-only authoring tools.
Added read-only `get_flowdocmake_context` and binary `upload_preview_image_file`.
Machine configuration/credential references are outside the package. No publish
tool or direct database mutation fallback exists.

Implementation decision: retain released HTTP contract unchanged. Exact local
runtime checks use Docker port association, image ID and installed package
versions; a remote deployment without this evidence stops as unknown. This is
local attestation, not a new Service contract/build field. Auth failure, unreachable
Service, incompatible contract/runtime, tampered guide and missing PDF reader
are distinguished before instructed authoring mutations.

Evidence: focused tests pass (3 tests, including real MCP negative preflight);
installed manifest launcher exposes 14 tools and ready=true against Service/Core
0.3.0. Skill validator passes. Snapshot links resolve. Reference trial created
draft f3b789af-9bce-4456-906e-7f87eb72783f revision 1 and a visually reviewed 2-page
PDF with TOC/table/header/footer. Create/save/preview identical-key retries retain
the same identity/revision/job. Full trial created a4317979-b681-4d38-80bd-dab235de52c0
revision 1, uploaded original images through binary transport, and saved 98 pages.
All page text and all non-image drawing commands match the release fixture;
all 98 pages were rendered and inspected via nine review sheets. The existing
Service image preparation slightly changes header image dimensions/resampling
versus direct-Core baseline (page 2 width 593.983 versus 595.276 pt); pixel parity
is NOT claimed. The release fixture's existing rocket-to-Thai substitution was
reused explicitly, not introduced as a workaround by this package.

Local evidence remains under `artifacts/flowdocmake`: preflight.json, per-trial
checkpoint.json, full/pdf-check.json and review sheets. Private source data and
PDFs are not distributed in the package. No user draft was changed or published.

Fresh-chat discovery remains an acceptance gap: user-authorized test chat
01a13e71-8c93-7621-9928-8f6533ed7fbc discovers the installed skill but its tool
catalog did not expose the new MCP tools. The initial unsupported plugin-root
placeholder was replaced with a machine-configured launcher and that exact
manifest is tested successfully through a fresh MCP client. The desktop chat
catalog must still be refreshed and verified; do not call cross-chat readiness
PASS until the context tool is callable there. This is not evidence of model
equivalence or of a fresh model reconstructing the entire reference document.

## Source coverage correction — 2026-10-15

Owner requested flowdocmake changes after the first full model trial: inspect all
source PDF parts before reusing an old template, then retry the same draft through
actual complete comparison, without publication. Discovery after desktop reload
passed in the test chat (skill plus 14 tools; Service/Core 0.3.0).

The first model output is a 64-page draft, not accepted visual reconstruction.
Read-only diagnosis found an unchanged copy of the earlier Sol revision-5
definition except identity/name, omitted PDF-only Element and menu sections,
8pt requirement-table text versus predominantly 11pt in the source, and blank
duplicated metadata/signatory tables. All 361 explicit REQ codes being present
did not establish full-document completeness. The mapping and acceptance process
is the demonstrated failure boundary; no renderer repair is authorized here.

Package 0.1.1 adds source-first inventory and coverage guidance plus scripts for
page text/font/image observations, rendered pages, and declared evidence coverage.
Source hashes and page coverage are checked before reuse; delivery also requires
per-part content/layout comparison, all output pages, TOC/link/page-label/value
checks and no unresolved differences. The checker is not a semantic/visual oracle;
the trial room and parent review must verify its claims against the actual PDF.
The existing full trial is the observed failing baseline for this correction.

Owner repository and active role: Project Control implementation/documentation;
single-room execution IDs not applicable. Acceptance requires focused script
checks, installed package integrity, and the authorized source-first retry with
complete source/output comparison. The initial repair used draft
6e9478b3-a3bf-45d8-9afa-a4909d4a865f; the later identity decision is recorded below.
Retain the first output as evidence. A generated receipt or coverage JSON alone
cannot establish reconstruction acceptance.

### Source-reviewed retry outcome

The test room completed the source inventory (98 pages, nine logical parts)
before retrieving a reuse candidate. Its repaired old draft reached 95 pages,
but cover and approval still differed. Whole-candidate replacement encountered
the existing variable-ownership guard; preserving that ID was a parent-selected
constraint, not an owner requirement. The parent withdrew that constraint. The
room nevertheless requested confirmation again and stopped. This is evidence of
an unresolved autonomous-execution limitation, not a Service failure.

The parent then used the installed draft-only MCP pipeline to create a new empty
identity and save the complete source-reviewed Area18 candidate. The new helper
`preview_candidate.mjs` checks source inspection first, saves exact checkpointed
calls and receipts, uploads original assets, polls the exact revision, and saves
the PDF. A repeat invocation reused the same identity/revision/job/PDF. The helper
does not certify fidelity and contains no publication path.

Draft `008980f5-dd0d-4f7d-86be-2fc3f300e08d`, revision 1, job
`01a14008-adb0-7567-a505-b853adc461ae` produced 98 pages. PDF SHA-256:
`230718afdae269a2d6be9408bb14a4dfa66f66a6f40c0950a00353cd128e5c64`.
The room independently reviewed all nine output sheets and representative full
pages after the parent created the preview. Parent review also inspected all
output sheets and reconciled every page's extracted text, all 361 explicit REQ
codes, all 396 internal-link destination pages and page labels against the source.
All link targets and labels match. Text matches after whitespace normalization
except source pages 36 and 42: an orphan `Features List` header remains with its
table on the following page in the candidate. This is an observed layout
difference, not lost requirement content. Service image preparation also changes
image geometry/resampling; four original inline icons retain low-resolution
warnings. Exact pixel identity and strict reconstruction acceptance are not PASS.

Review artifacts: test-room `work/native-full-011/preview.pdf`,
`candidate-checkpoint.json`, `review.md`, `coverage.json`, and rendered `review/`; parent
`artifacts/flowdocmake/native-comparison.json` and `native-links.json` preserve
per-page text differences and destination checks. This assisted retry proves
source-first candidate selection and complete comparison, not an independent
model reconstructing the reference from scratch. The final delivery checker
correctly remains FAIL for feature-catalogue layout, strict all-values equality,
and unresolved differences; source inspection and output-page coverage are
complete. No publication occurred.

Verification: five focused package/coverage/MCP tests pass; the installed
manifest exposes 14 tools with ready=true against Service/Core 0.3.0; skill
validation and guide integrity pass. Source-check dry run passed without mutation;
the real helper and its checkpoint resume succeeded. Core/Service code unchanged.

### Draft policy and independent retry — current bounded request

Owner now requests explicit draft selection plus a directly callable mechanical
tool, then one fresh chat repeating the original PDF/data assignment without
parent-created or parent-repaired drafts. Publication remains prohibited.
Owner repository: Project Control, implementation/documentation and reviewer;
single-room execution IDs not applicable. This consumer trial is not a separate
product-code WORK lane; it may author isolated unpublished document drafts only.
Scope: package scripts, versioned guidance, focused tests and a fresh consumer
trial. Core/Service schema, guards, release and unrelated drafts stay unchanged.

Package candidate 0.1.2 adds `run_candidate_preview` over the checkpointed MCP
mechanics. Draft policy is explicit: new, preserve, replace-if-conflict. Only a
real ownership conflict can take an owner-authorized replacement branch. Pending
returns the same plan/tool; PDF-ready requires visual/data review. Reuse candidate
and target identity are separate concepts. Existing guidance is corrected at its
canonical source and packaged as a fresh pinned snapshot.

Acceptance/proof budget: focused workflow tests for source gate, policy/fallback,
unchanged retries and continuation, stale conflicts and retained intent; MCP
discovery/negative checks without real parent draft mutations; installed package
and guide integrity; one fresh user-owned consumer chat, source/output inspection
and declared delivery coverage reviewed by parent. The parent may observe and
review but must not create, save, or prepare that chat's candidate or plan. A
successful assisted output from the previous round is not independent success.
Model setting for the consumer chat uses the user's configured default (no new
override requested); it is an artifact-use trial, not the registered PLAN/WORK
model-selection process. The observed trial outcome follows below.

#### Observed trial result: independent completion FAIL

Installed package 0.1.2 preflight returned ready=true, 15 tools and exact
Service/Core 0.3.0. The fresh chat is
`01a1401a-642f-77d0-b0ff-88d35f5f89a4`, titled
`ทดสอบ flowdocmake 0.1.2 จบเอกสารเอง`, with its own directory
`C:/Users/nekot/Documents/Codex/2026-10-15/flowdocmake-independent-012-trial`.
It received the original PDF/payload paths and explicit initial permission for
new drafts and an ownership-conflict replacement. No prepared candidate, plan,
fixture ID or corrected definition was supplied by the parent.

Actual MCP history proves discovery and use of `run_candidate_preview`, including
check/run, validation failures, successful saves, previews and local PDFs. The
chat created draft `080d97df-ce22-45bc-8c9d-3a97da168bab` itself, then repaired it
through revision 7 under the same ID. Parent actions were read-only observation,
review feedback and continuation messages; no parent draft creation/update or
candidate/request/plan editing occurred. Nine focused tests pass, including
source/policy guards, replacement only on an authorized ownership conflict,
pending-job resume, exact mutation-intent retention and MCP discovery/negative
checks. Installed guide integrity and skill validation pass.

The full-document acceptance still fails. The initial turn stopped at
agent-authored `INVALID_TEMPLATE` errors. After review it repaired the grammar
and produced a 62-page partial PDF, but stopped again while naming missing
parts. Subsequent previews reached 94 pages. The chat first flattened 26 source
pages into paragraphs, then wrapped some complete-page text in a single table
cell. Parent image review rejected this: approval/revision did not retain their
row/column semantics, copied TOC text separated names from page numbers, and
`Recovered source page` labels were added. The room later introduced separate
cover fields and system footer numbering itself, but still identified approval,
revision, TOC and header/banner fidelity as unfinished.

Five turns ended before full acceptance, despite four explicit continuation
reviews and two additional in-progress artifact reviews. The latest result is
revision 7, 94 pages; the room does not claim successful full delivery and no
whole-output comparison or passing delivery coverage is accepted. Repeated
status finals are the remaining observed execution boundary. No external Core
rendering limitation has been established. Source coverage is declared evidence
coverage, not proof of correct part classification or visual reconstruction.
Parent verified the saved PDF's 94 pages and SHA-256
`33a3979b8f18e1daf9bb2b1e2754a70b91c051eeb383ab0d3fb92dede651962a` at
the chat's `work/run-9/preview.pdf`. This identity check is not whole-document
visual acceptance.

This is a FAIL of the requested independent end-to-end trial, alongside passing
package mechanics. Do not reuse it as proof that another room completes full
reconstruction autonomously. Further repeating the same continuation prompt is
not additional acceptance evidence; improving model workflow/part-level authoring
needs a separate bounded design. Do not rescue the result by having the parent
author the missing document. No publication occurred.

### Owner-authorized per-part progress and Goal trial, 2026-10-15

Owner request: add persistent unfinished-part status and distinguish errors,
then have the existing consumer room use a host Goal to complete the full PDF
and actual comparison itself. Parent must not author its draft/candidate/plan;
publication stays prohibited. Owner: Project Control; implementation and evidence
review inline, execution IDs not applicable. Scope: package 0.1.3 scripts,
canonical authoring guidance, focused tests and the existing consumer trial.
Core/Service 0.3.0 and template schema remain unchanged.

Acceptance: persisted/CAS-protected progress; passes bound to actual saved PDF
and declared complete coverage; changed artifacts invalidate earlier reviews;
repairable errors are separated from retry, diagnosis and external blockers;
installed MCP discovery and guide integrity pass. Consumer must activate its own
Goal, complete the document without parent draft repairs and inspect all output
pages/data against source. Passing package tests alone does not satisfy consumer
acceptance. Proof budget: focused package tests, installed preflight/skill check,
Goal activation evidence and one continued consumer trial. No broad release/RAM
test or new Work/room records are needed. Remaining risk: declared review evidence
does not itself prove honest visual inspection; parent reviews the actual result.

Package implementation is installed as 0.1.4 (0.1.3 introduced task progress;
0.1.4 repairs a consumer-exposed image alias ordering defect). Twelve focused
tests pass, including stale task writers, retained part notes, exact-artifact
review binding, invalidated prior passes, incomplete-delivery rejection, error
categories and upload/finalize before sample validation. Installed preflight
confirms 16 tools, ready=true, guide integrity and exact Service/Core 0.3.0.
Skill validation passes. Source changes: `a53666a`, snapshot `3c164b4`, image
repair `2191b2b`, snapshot `b68cbb5`. The pinned guide snapshot precedes this
observed-outcome note intentionally; consumer instructions remain immutable.

The existing consumer room activated its own unbudgeted Goal on the owner's
explicit request. Its raw session records an active Goal and a subsequent turn
with trigger `goal` immediately after a status final, without another parent
continuation prompt. Thus automatic continuation is observed, not promised.
It called `manage_document_task` over a fresh MCP client; its native MCP process
still exposed older behavior, so discovery and fresh-client invocation remain
distinct evidence. It independently uploaded the embedded original header image,
advanced its target to revision 11, and began replacing flattened approval and
revision pages with native editable tables. No parent draft/candidate/plan writes
occurred. Parent changes were confined to package code/guidance and read-only
review; package-update notices and concrete source-review feedback were sent.

Consumer acceptance remains IN PROGRESS, not PASS. Parent reviewed output pages
1-3 from `work/run-15/preview.pdf` (revision 11, SHA-256
`0439aad419f976b33332a3e3c3702e467188c398fe8370f952150e020de2c675`).
Header width, cover placement, approval borders/spacing, native TOC and other
parts are unfinished. Its source-part notes also misidentified the cover title
alignment and grouped distinct feature/requirement layouts; parent returned
these observations for the room to verify and repair itself. Task progress stays
incomplete and the Goal stays active. This proves continued execution and some
independent repairs, not complete autonomous reconstruction or visual equivalence.
No publication occurred. Full output inspection and delivery acceptance remain
required before the consumer Goal can be completed.

### Representative-first bounded retry, 2026-10-16

Owner approves representative layout checks before full expansion, another
independent consumer trial, a clear time break, no parent draft repairs and no
publication. Previous Goal was paused on owner request after about 33 minutes,
revision 20 / 86 pages, still incomplete; continuation alone was not acceptance.
This is a bounded inline Project Control package/guidance change, not a new
registered product WORK lane; execution IDs are not applicable. Core/Service
remain 0.3.0. Scope: package 0.1.5, canonical guide, focused regression tests and
the same consumer room with a fresh task clock. Parent never writes its candidate,
plan, request, coverage or draft; inspection/review and stopping the trial remain
allowed. Reuse the existing paused room; no new room requested.

Acceptance: full-stage helper rejects absent/stale representative evidence for
every declared source layout family, binds comparisons to exact definition and
succeeded PDF, checks paired PNG files and page bounds. Representative passing
does not establish visual truth; inspect images before expanding. All native
formats must be demonstrated on representative real data before full data repeat.
Deadline is 20 minutes from trial task initialization, same across runs/turns;
parent pauses Goal at expiry or when further progress cannot meet the checkpoint.
The clock is not reset for repairs. Stop is unsuccessful acceptance if the
requested full PDF and whole-book review are not complete. No token budget was
requested. Proof budget: focused tests (including rejection before mutation),
installed guide/tool preflight, paired-image review and one bounded trial.
Limits: local helper cannot police direct atomic-tool calls or certify semantic
classification; instructions and supervising review cover those boundaries.

#### Observed bounded retry: package gate PASS, document objective FAIL

Runtime 0.1.5 was installed with ready=true, 16 tools, exact Service/Core 0.3.0
and valid pinned guidance. Sixteen focused tests pass, including missing/stale
representative proof, exact rendered-definition binding, deadline rejection
before mutation and between tool steps. Docker/Desktop and the existing DB/API
containers had been stopped; they were restarted before trial dispatch. No
runtime image, template source or database content was repaired by the parent.

The same room was dispatched at 08:53:37 Asia/Bangkok on 2026-10-16 with an outer
20-minute stop at 09:13:37. Its fresh task began at 08:56:30 and used 17 minutes,
ending 09:13:30, thus did not reset the outer clock. Host Goal remained paused
from the previous owner's stop; this retry is not evidence of Goal resumption.
The room was authorized to execute continuously in the current turn regardless.

First sample: revision 21, nine pages for 13 declared families. Parent image
review rejected flattened meeting text and missing native examples. The room's
own report retained differences, and full-stage check returned
REPRESENTATIVES_REQUIRED before a full mutation. It then ended a status turn at
about seven minutes. The parent acknowledged ambiguous checkpoint wording in its
dispatch and clarified once that failed checks require repair within the same
deadline. This supervised continuation prevents an independent-completion claim.

The room independently repaired samples through revision 27: separated meeting
participants, feature cards, three-column requirements/ISO and a cover rule.
It still reported zero of 13 families passing all visual/content/continuation
criteria. It began sleeping/waiting for the deadline while differences remained;
the parent stopped it early at 09:11:40 rather than consuming idle time. The room
ended idle at approximately 09:12:30, with Goal still paused. No full-document
expansion or publication occurred. Parent never wrote its draft, candidate,
request, coverage or plan; actions were tool implementation and read-only review.

Final sample: template 080d97df-ce22-45bc-8c9d-3a97da168bab, revision 27, nine
pages, 435349 bytes, SHA-256
fefc168ffab51087880c1f9b1b0d91a9b75392aa80e867b6e13791e99ebac731,
at the room's work/r015-run-7/preview.pdf. Parent viewed first/latest contact
sheets and selected source images, checked final PDF identity/page count and
read all family differences; no whole-book acceptance is claimed. A final
read-only full-stage check again returned REPRESENTATIVES_REQUIRED. The gate
prevents unsupported expansion; it does not make the model author correctly.

Documentation maintenance 0.1.6 corrects the older plan example's missing stage
and taskPath and the obsolete upload ordering in the step list. Runtime gate
logic is unchanged from tested 0.1.5; the trial's pinned snapshot is preserved as
historical input. Do not count this trial as an autonomous full-PDF success.

### Goal-scoped staged authoring guidance, 2026-10-16

Owner requested explicit guide rules after the two-file consumer trial: work
may continue to completion, but source extraction, layout discovery, structure
design and verification must proceed in distinct appropriate stages rather
than being interleaved or all required for every request. PDF-only input must
first produce separate source data; supplied JSON does not dictate the template.

Bounded inline documentation maintenance; owner Project Control, active role
Documentation Synthesizer. Execution/Phase/Checklist IDs are not applicable.
Markdown Authority Pre-Action Gate: these are existing Project Control canonical
authoring documents and the repository-owned packaged skill/installation guide;
their Authority Boundaries remain. No new Work/Evidence/map, runtime behavior,
user draft mutation or publication is part of this change. Risk is routine:
conflicting old full-PDF wording or stale packaged references could defeat routing.

Package 0.1.7 distinguishes extraction, reusable structure/sample and full
reconstruction endpoints, with stage outputs and progression conditions:
0 scope; 1 checked raw source data; 2 observed layout inventory/mapping;
3 native structure and derived request; 4 representative verification;
5 full expansion only when requested; 6 acceptance at the selected scope.
Stage boundaries are internal checks, not approval/turn stops. Repairs return
to their earliest responsible stage and refresh affected downstream evidence.
Raw data stays separate and unchanged by layout tuning. Missing sequence numbers
are not fabricated; repeated titles retain source locations. Data completeness,
structure/behavior and visual fidelity remain separately reported.

The current helper still enforces source coverage, stage/taskPath, bounded
deadline, strict representative evidence before full expansion, and strict
full-document progress review. It has no extraction/sample goal mode. This
guidance does not claim to add one, remove a deadline or relax a gate; a scoped
sample result does not fabricate full-document `complete:true` evidence.

Proof and document budget: update existing workflow, source-coverage,
draft-selection and developer entrypoint, plus skill/package metadata and this
record; regenerate pinned references from committed sources. Reuse the observed
consumer failure as context, then compare the same three read-only routing
scenarios before/after: PDF-only extraction, structural sample with visual
differences, and full reconstruction with incomplete JSON. Baseline lacked the
first two endpoints and distinct source/mapping/request stages. Revised routing
passed those scenarios; the remaining Goal wording was corrected to respect
the selected endpoint. The same review also checked automatic continuation and
unchanged tool prerequisites. This is instruction review, not a new model
end-to-end PDF success. Fifteen focused compatibility, coverage, representative,
task and candidate-workflow regressions plus the read-only transport integration
test pass (16 total); `npm run check:data` passes. Final instruction review
confirmed the Goal and strict task-review wording respects the selected scope.

### Read documentation by stage, 2026-10-16

Owner requested smaller reading units when FlowDocMake documentation is large.
This continues bounded inline Project Control documentation maintenance under
the same role and authority boundary above; execution IDs remain not applicable.
The retained detailed reference set is not removed or promoted as runtime proof.

Package 0.1.8 reduces the skill to active cross-stage rules and one short entry
page, `docs/developer/authoring/workflow-start.md`. Its stage table names the
sections to read now, their output and exit condition. A section link means
only that section through its next peer heading; a file link means locate the
relevant topic, not recursively load that file and every linked reference.
Full workflow/index/history/schema reading is deferred until actually needed.
Detailed authoring preflight/checkpoint and large-argument transport instructions
remain in draft-selection.md and are required on entering authoring.

The former skill/main-guide/index/mapping startup bundle was about 870 lines.
The new skill is 65 lines and workflow entry 39: 104 startup lines, followed by
only the current stage's reference section. This counts FlowDocMake entry text,
not total context, tokens, global guidance, task inputs or measured future cost.
One new short routing page is justified to prevent eager whole-reference loads;
other detail remains in existing chapters rather than duplicated phase files.

A read-only instruction probe using just the new entry selected only
reference-coverage.md's Extract source data section for a clearly scoped PDF-only
extraction request. It found no forced startup loading of full workflow, index,
mapping, schema, history or authoring preflight, and retained automatic stage
continuation plus the existing safety requirements. This is a routing probe,
not a claim that a new full-PDF reconstruction succeeded. Sixteen focused
compatibility/coverage/representative/task/workflow/transport tests pass, as do
46 checked canonical local links/anchors and whitespace checks. Package
references are regenerated from committed canonical sources before installation.

### Fixed-form feedback without more reading, 2026-10-16

Owner requested guidance repairs after the PDF-only ศ.บ.1 trial. Bounded inline
Project Control canonical/package documentation; Documentation Synthesizer,
routine risk; execution/Phase/Checklist IDs not applicable. Markdown authority
gate passed under the existing boundary. No runtime, draft, source PDF, map,
new Work/Evidence or new reference file is changed. The existing local trial
`C:/Users/nekot/Documents/Codex/2026-10-16/flowdocmake-sb1-trial/checks.json`
supplies feedback, not product-wide capability or successful delivery evidence.

Package 0.1.9 replaces redundant mapping prose with current-version evidence
classification: directly supported, fallback, confirmed limitation, and repair/
unknown. Missing parts stay pending; one failed attempt or absent property
does not rule out another valid composition. Fixed forms/mixed documents route
by part; font substitution requires measurements rather than a universal size
multiplier; original image transforms and graphics-only omissions are explicit.
Preflight allows the existing fresh packaged MCP client for stale chat wiring,
still requiring its actual ready:true. No new schema, gate or approval step.

Proof/document budget: existing entry, mapping, index, preflight and package
metadata only; this maintenance note is not startup reading. Entry stays 104
lines and shrinks 7112 to 7108 characters; mapping shrinks 147 to 134 lines and
7816 to 7604 characters. These are source-text counts, not measured AI tokens.
Four read-only before/after scenarios exposed the prior ambiguity and passed
revised routing without lost safety rules. Sixteen focused compatibility,
coverage, representative, task, workflow and read-only transport tests pass;
63 authoring local links/anchors, check:data and diff whitespace checks pass.
Pinned references are generated from committed canonical inputs and verified
before local installation; no new document reconstruction is claimed.
