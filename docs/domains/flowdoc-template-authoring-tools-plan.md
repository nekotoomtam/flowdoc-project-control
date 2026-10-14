# Template authoring tools implementation plan

## Authority Boundary

Owner: FlowDoc Project Control. Status: local candidate implemented; local MCP and full preview verified as recorded below. Cross-room full-task completion after guide clarification remains pending.
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
