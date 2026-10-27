# Output File Names Implementation Plan

> Execute inline with the executing-plans skill after the owner's approval in
> this conversation. No merge, push, release, install or publication authorized.

## Authority Boundary and agreed scope

Project Control owns this cross-repository plan/result. Core owns optional
template metadata validation; Service owns request transport, persistence and
download naming. Single-room implementation; execution/Phase/Checklist IDs are
not applicable. Existing isolated Core/Service lanes are clean at10eeb89 and
1c39a9d; preserve their prior Section/style work and all artifact baselines.
Risk routine; size medium. No Editor/UI feature or installed FlowDocMake change.
Use the current inline model; no separate implementation room. One final fresh
read-only review covers the whole feature before completion.

**Goal:** request fileName overrides template defaultFileName, else document;
both are base names without extension. Output-Format retains its existing
PDF/DOCX meaning and supplies the extension.

**Architecture:** optional defaultFileName is beside docKey in the definition,
versioned/fingerprinted with the template. Optional fileName is at the top of the
existing multipart payload JSON (beside data/sections); Doc-Key remains its
existing HTTP header. Naming is Service metadata, removed by a streaming root
view before Core task normalization, not injected into business data or rendering.
Freeze the selected default at task creation and resolve/freeze the actual name
at seal before queuing. Use UUID storage keys as before. Return the base name in
task/artifact metadata and the full name in Content-Disposition, including a
UTF-8 filename parameter for Thai names. Do not rename internal storage paths.

**Spec:** owner approved fileName/defaultFileName plus existing Output-Format.
Missing/blank request uses configured default; missing/blank configured default
uses document. Proposed normalization: trim/NFC, well-formed Unicode, maximum
200 code points and240 UTF-8 bytes; reject control/format characters, path and
Windows forbidden characters/reserved device names/trailing dot, and supplied
.pdf/.docx suffixes. Invalid non-string values fail explicitly, not fallback.
Old templates without the field retain their fingerprint and default wire name.

## Tasks and acceptance

- [x] Core: failing tests for valid/blank/invalid optional metadata, canonical
  normalization, unchanged legacy fingerprints/composition, and public helper.
  Implement a pure normalizeOutputName helper and optional defaultFileName on
  TemplateBase/strict admission, with no renderer or Model20 semantic changes.
  Build and run affected template/data/composition tests. Pack a distinctly
  versioned development candidate; retain the prior package and exact checksum.
- [x] Service: failing unit tests for streamed payload parsing, request-only
  metadata filtering, precedence, extension and UTF-8 disposition handling.
  Add a forward-only026 migration for frozen default/resolved task names and
  immutable guards. Wire default capture, seal resolution, public status/event
  naming and artifact headers. Existing format/job pin contracts stay unchanged.
- [x] Real isolated DB/API: PDF/DOCX request override and configured default,
  missing/blank legacy fallback, invalid/duplicate/non-string inputs, queued
  default pin across template-version change, name immutability, authoring
  save/read/clone/publish retention, and additive lookup/event data. Verify real
  artifact bytes and identity; do not assert delivery from a job status alone.
- [x] Update Core/Service code-adjacent guidance and exact vendored identity.
  Review final diff and coverage, obtain one fresh read-only review, repair any
  concrete defects, commit isolated candidates and record results here. Do not
  claim full Service/I6 acceptance from impact-scoped checks.

## Proof and document budget

One plan/result document, relevant existing local manuals and machine-readable
reports under the existing recovery root/output-file-names. No synthetic Work
records. Reuse existing native runtime images and build only the updated sources.
All real render/test containers stay at1GiB; use a new named isolated PostgreSQL
container/database/network and never touch the installed0.5.0 containers. Initial
targeted runs plus responsible repairs only for actual failures; no full-suite,
native Word automation, CLIS spacing tuning or new document baseline is needed.

## Execution ledger

Source inspection confirms current Service returns document.pdf/document.docx
and payload roots accept only data/sections/meta. Template admission is strict;
simply adding arbitrary JSON fields would fail. Therefore the narrow optional
Core metadata plus Service-owned request view is required. Current Section20
integration remains separate and is not implicitly accepted by a new Core pin.


## Result — PASS, isolated candidate only

Core commit `df75a0d613c394e476dc59650fd6b6ba8612374a`; Service commit
`48024eeb7fd8ec6f42668079598b84e10be008a2`. Both lanes are clean after commit.
Service vendors Core `0.5.1-dev.section-assembly.2`, archive SHA256
`ab0c8a1de372d5d5e528ed7b39b3671028d33f88424b2149c37e6fbd4b99b57e`.
Build and vendor verification passed. Existing prior archives remain intact.

Evidence root:
`C:\Users\nekot\Documents\FlowDoc-recovery\shared-stroke-table-styles-2026-10-26\output-file-names`.
`verification.json` indexes hashes, reports and six saved real PDF/DOCX artifacts.
Core RED:22 cases,5 failed/17 passed; Core GREEN:429 passed/0 failed/0 skipped.
Service initial RED:14 cases,4 failed/10 passed. Final impact run:109 passed,
0 failed/0 skipped across12 files, with a real isolated PostgreSQL database,
HTTP uploads/lookup, PDF/DOCX render children, and memory capped at1GiB.
Intermediate failures remain in their original reports; they are not PASS.

Coverage:

- Optional template names: all admitted Core models18/19/20; normalization,
  fingerprint changes, unchanged legacy fingerprints and composition.
- Streamed request names: Thai/ASCII, missing/blank, duplicate/non-string/path/
  suffix/device/length rejection, root-only filtering preserving nested business
  fields, legacy ASCII header compatibility and UTF-8 filename* encoding.
- Real PDF/DOCX override/default/blank requests, normal and queued delivery,
  additive task/output metadata, extension selection, stored SHA/byte identity;
  saved DOCX ZIP integrity and expected Thai text independently checked.
- Queued default frozen before a later immutable template version is registered;
  delivered attachment retains the old default. SQL guards reject mutation of
  both the frozen default and resolved name.
- Authoring save/read/clone retains defaultFileName. Immutable registration/load
  was tested only in the disposable schema, without publishing real documents.
- Historical schema22/24 upgrades preserve prior columns, task events, original
  files, pins/digests and old jobs/outputs; sealed rows gain document. Repeated
  migration is a no-op. Migration026 explicitly drains the deferred terminal
  trigger around backfill so ALTER TABLE works with populated tasks.
- Existing intake/normalization, PDF/DOCX wire/processing/lifecycle and authoring
  consumer checks pass. Fresh read-only whole-feature review:PASS, no blocker.

Repairs during proof were confined to migration026 and test fixtures/assertions:
backfill initially left deferred trigger events pending; DOCX naming fixture
initially omitted an optional image that the old fixture still placed; historical
migration expectation lists needed the additive026 entry. No renderer/layout or
image capability behavior was changed to make these checks pass.

Only the dedicated filename-test DB container/network was removed after tests.
Installed Service/Core0.5.0 and FlowDocMake0.3.0, PDF baselines, CLIS trials,
Model20 Service admission and prior accepted limitations remain unchanged.
This is impact-scoped acceptance, not a full-suite/I6 PASS, release, installation
or permission to merge. Next owner decision may cover integration separately.


## Owner-authorized development integration /0.5.2 preparation

The owner now authorizes local development integration, one patch increment
from0.5.1 to0.5.2 and updating manuals before any release. This supersedes only
the preceding no-merge restriction; no push/tag/release/install/publication is
authorized. Reuse these existing clean isolated Core/Service/PC lanes. Roles:
Product Implementation Agent, Documentation Synthesizer, then integration and
Evidence Reviewer inline. Routine risk, medium size; execution/Phase/Checklist
IDs N/A. The generated snapshot remains about unrelated Editor work; this
explicit export request and existing feature records govern this bounded scope.

Target development branches verified against GitHub HEAD: Core
codex/template-binding, Service codex/template-registry, Project Control main.
Core has two additional commits including previously tested experimental20;
Service has the accepted output-name implementation. Integrate their complete
accepted candidates without implying that Core20 is Service-ready. Preserve
release chains, tags, baselines, installed0.5.0 and FlowDocMake0.3.0. No new
Service20 integration, renderer tuning, frontend work or plugin runtime changes.

Acceptance/checklist:

- [x] Core0.5.2 package/lock/manuals, build and Linux checks covering template,
  data, composition, layout, DOCX and PDF consumers; create a new immutable
  archive after committing source, retaining previous packages and provenance.
- [x] Service0.5.2 package/lock/vendor/manuals with exact Core0.5.2 pin;
  build/vendor checks and isolated real DB/API tests of output naming,
  historical migrations, legacy18/19, B style and authoring consumers at1GiB.
  Reuse unchanged layout/Word proof only within its original scope.
- [x] Canonical authoring API/metadata guidance, explicit Service18/19 vs
  experimental Core20 and installed plugin boundaries; refresh source guidance
  snapshot only after canonical commit. Leave installed plugin and its strict
  compatibility profile unchanged; its next release remains separate work.
- [x] Review final diff/coverage, commit and fast-forward clean development
  branches; reuse proof only for identical accepted trees. Preserve ignored
  output before retiring only merged, clean current-round temporary lanes.

Proof budget: affected checks once on the final pair plus bounded repairs for
actual failures; no automatic complete Service/I6 acceptance claim. Document
budget: this existing record, four owner manuals and the relevant canonical API
page and authoring entrypoint plus generated guide copies; no new Work/Phase/report or map promotion.
Existing evidence under output-file-names is reused; new package/version proof
will be placed in a separate integration-052 subdirectory.


### Integration outcome —2026-10-27

PASS for local development integration and manual preparation. Core
`a132c5de7a4f167305e48de0dbf0cdf36b288e8d` is integrated into the existing default
`codex/template-binding`; Service `d3d1db6426ac1207754a2990094d21f854e5369d`
is integrated into `codex/template-registry`. Both package/lock versions are
0.5.2. Fast-forwards were conflict-free; clean primary trees match the accepted
candidate trees exactly. Product release branches/tags are unchanged. Nothing
was pushed, released, installed or published.

Service vendors `flowdoc-core-0.5.2.tgz`, SHA256
`ee085d2291394750b34750e262f74eb80bd57786cef7dd43fd55f58d29c0c0ca`,
with exact Core source a132c5d and matching SHA512 lock integrity. Previous
0.5.0/0.5.1/development archives remain intact. Four owner manuals and canonical
authoring API/entrypoint now distinguish0.5.2 development, installed0.5.0,
Service18/19 and opt-in direct-Core20; migration026, backup/recovery and real
post-install checks are explicit. The source guidance snapshot was regenerated
from canonical guide commit37db50f; all33 packaged reference files match their
canonical LF bytes. Installed FlowDocMake0.3.0 and its strict0.5.0 compatibility
profile were not changed or bypassed.

Evidence root is the existing recovery folder's `integration-052/`.
`verification.json`, `pre-integration.json`, Core/Service JSON reports, build
logs and guidance-checks.log retain identities/results. Core Linux impact tests
passed1086/1086; final Service tests passed120/120 across16 affected files,
including actual PDF/DOCX naming, queue pinning, SQL guards, historical schema
upgrades, B rendering, source/stored-version PDF equality and legacy18/19
consumers. Guidance/workflow/CLIS/packaging checks passed15/15. Zero skipped.
Fresh read-only pre-merge review passed with no important findings. All real
test containers were capped at1GiB and used a dedicated disposable PostgreSQL
network/database; that DB/network was removed after checks.

Initial Service stored-version test failed because the newly created disposable
public schema had not been migrated; bootstrap was corrected using the existing
CLI migration API, without changing product behavior. The original119/120 report
is retained beside final120/120. Initial plugin packaging checks lacked the
explicit reviewed0.5.0 archive; supplying the retained matching archive produced
15/15, without changing compatibility expectations. Final Core repack corrected
a stale package-version sentence; the first0.5.2 archive is preserved under
pre-guide-correction and tar comparison proves README was the only changed
member. Runtime/test source remained identical, so Core test proof is reused
within that identity; final Service tests used the final exact package/hash.

Normal cleanup removed only the clean, fully merged current Core/Service
shared-stroke-table-styles worktrees/branches. Ignored contents were inventoried:
Core dist/node_modules and PC node_modules are reproducible build/dependency
outputs, not unique evidence. All needed archives, reports and artifacts are
retained outside the worktrees. Current package locators are
`C:/Users/nekot/Documents/GitHub/flowdoc-service/vendor/flowdoc-core-0.5.2.tgz`
and the recovery integration-052 archive. The manifest's sourceArtifact records
the original packing location; it is historical provenance, not the current
lookup path. The PC worktree is retained as this chat's active workspace; other
historical/unmerged lanes were not swept.

Remaining release prerequisites are deliberately separate: complete Service/I6
acceptance where required, next FlowDocMake compatibility/package preparation,
release snapshot/tag/push authorization and actual installation/restore checks.
There is no new native Word visual acceptance or Service20 admission claim.
This completes the owner's development merge/version/manual request; it does
not declare a public release ready or installed.


## Documentation completion before release —2026-10-27

Owner requests finishing the manuals before release. Single-room documentation
maintenance; role Documentation Synthesizer / Project Control Steward. Scope:
canonical authoring structure/nodes/layout/API/index/verification and plugin
README, generated reference copies, four Core/Service code-adjacent manuals,
and this existing record. No new Work/Phase/Checklist IDs, shared map promotion,
product source/configuration/package/archive/version changes, Docker/test renders,
release/tag/push/install or installed plugin mutation. Main product checkouts are
clean; documentation-only changes may use them. Current PC lane remains clean
and equal to main at afd82a8; generated snapshot is unrelated Editor context.

Acceptance: fill shared stroke/B profile and file-name contract gaps, correct
current setup/migration pointers while retaining labeled historical proof, show
Service18/19 vs experimental Core20 vs pinned plugin boundaries, and state
remaining release/package prerequisites without claiming readiness. Check source
contracts, Markdown/link/JSON examples and the existing guide/snapshot/workflow
checks; regenerate references only after canonical commit and verify LF hashes.
Proof budget is one targeted documentation pass with repairs for concrete issues;
no new runtime testing or full-suite acceptance. Existing integration-052 proof
is historical input, not new test output. If Core README changes, the currently
pinned a132c5d archive remains immutable; a future release package must contain
the final manuals and have new source/checksum/consumer verification.


### Documentation completion result —PASS

Core manual commit `0401b87fa1d6e4202d81974f28184871d69d7200`; Service manual
commit `fbbec43bccfe897809ee4e2cdd3a84ccca6f0896`. Product branches remain the
existing development defaults. PC canonical guide commit
`e6df1eb65307804e7fd59174db22c30be22a6d4d` supplies all33 generated references;
source snapshot/package version and compatibility profile remain0.3.0/0.5.0.

Completed gaps: shared stroke kinds, table edge inheritance and B's supported
DOCX profile/known Word differences; optional output naming in the root schema;
real Section19 payload preparation separating Doc-Key/version from multipart
root keys; multipart receipt/client-path semantics; current image selection and
migrations001–026; consistent backup/recovery/post-install directions; explicit
18/19 Service vs experimental direct-Core20 and plugin boundaries. Historical
0.5.0 tests/pins remain labeled rather than silently rewritten as0.5.2 results.

Proof under the existing recovery root `docs-052/`: doc-audit.json checks9 new
local links/anchors and2 new JSON examples; powershell-parse.json checks2 new
PowerShell blocks without executing them. Existing guidance/snapshot/CLIS/
workflow/packaging checks pass15/15, zero skipped. Fresh read-only source review
passed without important findings. Final diffs change only allowed Markdown and
generated reference snapshot; vendor archive/source/hash/lock/version, runtime,
release refs and tags are unchanged. No product suite, Docker, API or PDF run
was performed. Prior1086/120 integration results are retained input only.

Core README now advances beyond the pinned a132c5d archive, explicitly stated
in the manuals. Release preparation still needs a newly packed final documented
Core source, exact Service pin/consumer checks, next plugin compatibility and
applicable complete-suite/release gates. This is a completed documentation
request, not a release-ready or installed declaration. All current changes are
committed locally; source guidance is integrated into PC main by unchanged
fast-forward, with no push/tag/release/install. The PC lane remains this chat's
active workspace; no unrelated historical worktree was cleaned.


## Final package and prerelease verification scope —2026-10-27

Owner approved continuing through the previously proposed final packing,
FlowDocMake compatibility and prerelease gates. Goal: reviewed Core/Service0.5.2
and FlowDocMake0.3.1 artifacts, real isolated matched preflight/authoring PDF and
paired Service PDF/DOCX proof, with applicable complete Service acceptance.
No release snapshot/tag/push/install/publication is authorized. Retain old
packages, PDFs, installed0.5.0/0.3.0 and historical evidence.

Single-room inline implementation: Product Implementation Agent, Evidence
Reviewer and Documentation Synthesizer. Medium size, routine risk with exact
package/profile and data-isolation controls. Execution/Phase/Checklist IDs N/A;
current generated Editor snapshot is unrelated. Reuse this record, no synthetic
Work room. Use current host model inline, one final fresh read-only review.
Planning/execution use writing-plans/executing-plans; scope overrides their
generic docs/superpowers location. No separate implementer dispatch.

Bases: Core codex/template-binding0401b87, Service codex/template-registryfbbec43,
PC current634b459. Service primary is currently checked out at release0.5.0;
do not switch or mutate it. Create one Service preparation worktree from the
verified development ref. Native tool targets only this chat's PC repository,
so Git worktree fallback is necessary for that separate owner. Core source is
read-only unless an actual source defect requires an isolated repair.

- [x] Build/pack frozen documented Core source into a new external artifact,
  compare contents against retained previous archive and run isolated Linux
  packed-consumer checks. Reuse unchanged runtime tests only with exact proof.
- [x] Pin that exact artifact/commit/hash/lock in isolated Service0.5.2; build
  runtime/test candidates, bootstrap new named DB/network, supply reviewed font
  and legacy-client prerequisites and run the mandatory combined suite at1GiB.
  Fix only actual candidate/test prerequisite defects; no guard weakening,
  invented PASS, user data reset or Service20 scope expansion.
- [x] Prepare source FlowDocMake0.3.1 with exact0.5.2 profile, metadata/guide
  snapshot and a distinct staged bundle. RED/GREEN compatibility/build tests,
  complete applicable plugin checks and isolated live matched preflight/preview.
  Keep0.3.0 artifacts and installed config/cache unchanged; PDF-only task tools
  remain PDF-only, direct Service DOCX stays separately verified.
- [x] Update manuals to identify staged0.3.1 vs installed0.3.0, retain limitations,
  review final whole candidate, commit local preparation and record readiness/
  remaining gates. No new product version beyond Core/Service0.5.2/plugin0.3.1.

Proof budget: one initial build/full applicable run for each final candidate,
plus repairs/rechecks tied to concrete failures or changed inputs. Live session
uses only owned test containers with init,1GiB and isolated loopback/DB resources;
no arbitrary experiment loop. Full-suite/I6 prerequisite is not replaced by an
aggregate selected-test count. Document budget: existing record and directly
affected owner/plugin/authoring guides. If genuine permissions/data-loss risk
or an unresolvable requirement appears, stop with precise evidence.


### Prerelease progress and bounded storage correction

New Core archive647235de33308ecf99aa201c63ff1e663e15c17c3b9259bde0ecf5f6dc819318
from0401b87 contains final README; all runtime members match the retained
previous archive (package.json differs only by line endings). Installed Linux
consumer passed18/19/20 PDF/DOCX; all4 PDF pages were reviewed. Source plugin
0.3.1 exact-profile/build tests passed6 after valid RED2. Full plugin checks
passed46,0 failed,4 optional font-session cases not run. Actual matched
preflight, authoring save/read and production-image PDF completed.

Initial Service full run exposed missing italic I6 fixtures, six stale migration
expectations and a reproducible test-only5-second queue deadline. Four I6 faces
now match prior accepted hashes exactly; queue tests retain all assertions and
product timeouts while using a30-second test budget (actual11/12seconds).
Second complete run passed609,0 failed,5 optional not run; mandatory I6 passed
all18. Reports remain separate and immutable under release-prep-052-2026-10-27.

Ruling: actual production smoke exposed a Service storage bug for Core-valid
empty areaFormats:{}: decompose discards presence, assemble omits it, so the
stored definition fingerprint fails reload. Fix only empty-root presence in new
current/snapshot records, with explicit ownership guard and18/19 RED→GREEN
unit/real-DB tests. Do not weaken fingerprint/font/reference checks or rewrite
immutable history. Already-invalid historical snapshots are not automatically
repaired; an explicitly registered corrected version is the recovery route.
This is within the responsible prerelease Service correction scope, not Model20
admission, new layout behavior or a migration. Repeat affected and complete
Service checks because product storage code changes; keep earlier PASS scoped
to its exact pre-correction candidate.

The original complex legacy company/member authoring example produces PDF but
DOCX fails DOCX_REQUIRED_RELATION_UNSUPPORTED; retain this bounded relation
limitation, with no renderer relaxation. Use an independent supported simple
fixture for positive normal/queued production PDF/DOCX checks. Both original
fixture/draft/PDF and negative result remain retained. Staging network also
required an owned non-internal bridge for actual loopback publishing; installed
containers and their networks were never changed.


### Final prerelease closure —2026-10-27

PASS within this bounded preparation scope; no release/tag/push/install/publication.
Core source0401b87 remains unchanged. Service storage/package candidateca3876d
plus documentation-only06d1940 is committed in the isolated preparation lane.
PC canonical guide commit84a58bb and plugin/profile commit9780461 are retained.
Local development fast-forward is allowed by the prior integration request;
Service primary release0.5.0 is not switched, reset or modified. Keep the Service
preparation worktree because the staged client configuration references its
compiled runtime. Cleanup of unrelated or historical lanes is out of scope.

Final combined Service report service-combined-storage-final.json:621 total,
616 passed,0 failed,5 optional pending; success:true,exit0,OOMKilled:false.
Mandatory task-docx-api I6 passed18/18. Init/1GiB memory+swap/2CPU and new named
DB release_052_r3 were enforced. Optional cases are the same three external
font-delivery binding checks, real Pridi height proposal and supplied font set
checks as the prior baseline; they are NOT PASS and do not replace I6.
Final Service docs changed after this image only; no runtime/deps/config/test
changes. Its README artifact/migration guard passed1 with3 external cases
not run on the final README. Existing complete proof is reused for unchanged
runtime. Core1086 previous affected tests are reused only after exact runtime/
deps/resource member identity proof; new installed packed-consumer18/19/20
PDF/DOCX and all4 PDF pages passed separately.

Final FlowDocMake suite plugin-delivery-final.log:46 passed,0 failed,4 optional
font-session cases not run. Delivered normal bundle has54 members,33 canonical
guide members from84a58bb. Every zip member and guide hash verified. Final
bundle get_context reports ready:true,0.3.1,Service/Core0.5.2,exact647235de pin,
25 tools and production image84b3837d. Saved delivered-plugin.pdf exactly
matches the visually reviewed production PDF. Production pairs include default
DOCX,queued PDF/DOCX,Thai override/default names,complete bytes/hash and
wordVerified:false. No native Word conversion was claimed.

FlowDocMake archive: flowdocmake-0.3.1.zip SHA256
3b922aec961235b1c311f03f0fc42a30c655968134a7dbabfe428d3a5dbb08e4.
Core archive SHA256 remains647235de33308ecf99aa201c63ff1e663e15c17c3b9259bde0ecf5f6dc819318.
All artifacts/receipts are in the existing external release-prep-052-2026-10-27
root. Final I6 PDF review covers36 files/54 pages;3 production PDF pages and
4 Core-consumer pages reviewed separately. 64 manual links checked with2
explicit sibling-repository resolutions. PC check:data exited0. Diff checks
passed. A fresh read-only whole-candidate review found no actionable findings;
its then-pending final combined gate is now closed by the621-case report.

Preserved limitations: legacy nested relation DOCX envelope failure reproduces
on0.5.0 and0.5.2; old invalid empty-map snapshots require a corrected new
version; Core20 is experimental and Service accepts18/19; B/native Word border
and edit/reflow limits remain documented. Original PDFs/packages and installed
0.5.0/0.3.0 remain untouched. Owned temporary API/DB may be stopped after proof;
this captured preflight is a verification-time result, not an installed endpoint.
Next step is owner authorization for release snapshots/component tags/push and
separate installation, under the existing release rules. No additional features
or proof are needed to close this preparation scope.

### Authorized Git release scope —2026-10-27

Owner now explicitly authorizes Core/Service0.5.2 and FlowDocMake0.3.1 release
snapshots, annotated tags and GitHub push; installation remains forbidden.
Single-room release stewardship; execution/Phase/Checklist IDs N/A. This is a
new bounded release action using the completed preparation as immutable input,
not a reopening of a registered execution. Reuse exact unchanged passing proof.
No product edits, version change, repack, package/image registry publication or
GitHub Release-page creation. Preserve all known limitations and optional skips.

Acceptance: clean accepted source, exact archive/profile/bundle checksums;
verified actual GitHub default branches and current remote tips; recoverable
Git bundles; full-tree snapshot equality, one preceding release parent and
annotated tags for every reachable release commit; atomic per-repository push
of development/snapshot/tag and remote peeled-target readback. Old tags must not
move. Service currently checks out release in the primary checkout: advance it
by clean fast-forward to the new snapshot, never directly move a checked-out
ref or merge development history. Retain staging worktree/config and old PDFs.
Proof/document budget: reuse existing tests plus one bounded Git/package audit,
dry-run and readback per repository; update this existing record only. Any
concurrent remote change or source/checksum mismatch stops promotion for that
repository without force. No new implementation or separate agent is needed.

### Git release completed —2026-10-27

PASS: owner-authorized atomic pushes and GitHub readback completed for all
three repositories. Development history remains on the verified default branches.

| Component | Source commit | Release snapshot | Annotated tag |
| --- | --- | --- | --- |
| Core0.5.2 |0401b87fa1d6e4202d81974f28184871d69d7200 |55315ca6a9e478422ae135496ade39988f7bbe7f |v0.5.2 |
| Service0.5.2 |06d1940b764a10b5d5d3b4f28213438a2d33e703 |25e912fdeb396151bbf8a3b206554ce3f1d619b0 |v0.5.2 |
| FlowDocMake0.3.1 |c23e4071ec2af2255bce4c278c48b98dc379b6d5 |04a227f1e56b0a862335762bb2e07d48e9e2498a |flowdocmake-v0.3.1 |

Each release tree equals its accepted source tree exactly and has only its
previous release snapshot as parent. Complete release ancestry has13Core,
14Service and5FlowDocMake commits, all with annotated tags verified on GitHub.
All pre-existing tag objects/peeled targets remain unchanged. Both source and
release branches plus the new tag were pushed atomically per repository after
dry-run. Remote objects and peeled targets match the recorded local snapshots.

Core archive647235de and FlowDocMake zip3b922aec remain byte-identical to the
accepted artifacts. Plugin package/source comparison additionally records only
Git newline normalization; no repacking or semantic changes. Backups, preparation
manifest, tag text, dry-run/push logs and remote verification are retained under
`C:/Users/nekot/Documents/FlowDoc-recovery/release-prep-052-2026-10-27/git-release/`.
The two early preparation checks stopped before release mutation because they
initially read the older Service checkout and treated Git newline conversion as
a byte difference; corrected checks use the frozen source and retained archive.

Checks reused without candidate changes: Service616passed/0failed/5optional
not run including mandatoryI6 18/18; plugin46passed/0failed/4optional not run;
packed Core consumer and prior runtime-identity proof. Limitations appear in
every release annotation and remain in the manuals/preparation record above.
No native Word claim, registry/package/image publication, GitHub Release page,
installation, user DB/draft change or template publication. Running installed
Service/Core remains0.5.0; installed plugin remains0.3.0. Staging worktree is
retained because the staged client config references it. Next action, only when
authorized separately, is backup/install/post-install verification of the new
exact package tuple. The following PC main-only metadata commit records these
results without moving the already published component snapshot/tag.

### Authorized installation scope —2026-10-27

Owner authorizes installing the released Service/Core0.5.2 and FlowDocMake0.3.1,
after backing up the previous installation, with actual connection and short
PDF/DOCX checks. Single-room operator/evidence role; execution IDs N/A. Existing
release tags/packages and limitations are immutable input. No product change,
template publication or user-template repair. Retain backups/config/secrets
privately under external install-052-2026-10-27; update this record only.

Acceptance: cold DB/staging/output plus old image/config/host-adapter backups,
hash verification and separate restore test before migration; explicit0.5.2
image/migration026 and replay; existing data retained; exact plugin/profile/
guide verification, local config update, fresh SDK preflight and real short
PDF/DOCX from the installed image with content/hash/page review. Keep1GiB+init,
loopback and credentials. Use a disposable named DB for task smoke; authoring
trial remains draft-only. App chat-tool discovery is a separate observable gate;
do not claim an old in-chat tool process refreshed automatically. One bounded
backup/restore/build/install/smoke pass plus repairs for actual prerequisites.

### Installation completed —2026-10-27

PASS for installed runtime/package and fresh-client connection; current-chat
tool discovery remains separately unverified until an app reload/fresh chat.
Service/Core0.5.2 runs from released snapshot25e912f with image
84b3837d4a4f8850516af2c177c6c672ae4a0e05b0307220108929a727ede804,
exact Core647235de archive,1GiB memory/swap and init. Migration
026_task_file_names.sql applied once and replay applied nothing. Original
output/staging/database volumes and authentication/loopback settings retained.

Backup/restore evidence lives privately under
`C:/Users/nekot/Documents/FlowDoc-recovery/install-052-2026-10-27/`.
Cold copies cover all3 volumes, old images, host dist/dependencies, deployment
configuration and local client settings. The old configured0.3.0 cache was
already absent; the retained released0.3.0 package was backed up, along with
the existing0.3.1 cache. Separate logical DB restore matched49tables/1241rows;
file restore matched96staging files (including32hardlinks) and6output PDFs.
The first file checker omitted tar hardlinks; its failures are retained and
the corrected checker verifies every restored file without changing backups.
No migration started until this restore passed. Post-migration projection of
all48 pre-existing data tables matched exactly, apart from expected migration
history/new columns. After smoke,135 existing template/font rows across14
tables still match, excluding only the new named acceptance draft.

The existing enabled FlowDocMake0.3.1 cache matches the accepted bundle after
Git newline normalization (8files differ only in newlines, snapshot JSON values
identical; all33 guide hashes verified). Only pluginRoot changed in the local
client config, from the absent0.3.0 path to0.3.1; other paths/credentials remain.
Host dependencies/dist rebuilt from the released locked Service source.
Actual installed manifest launcher and fresh SDK report ready:true,0.3.1,
Service/Core0.5.2, exact pin and25 tools, again after Service restart. The new
draft remains revision1 after restart. No claim that this chat's already-loaded
tool catalog refreshed: FlowDocMake tools are absent here; reload app/open a
fresh chat and perform get_flowdocmake_context before further authoring.

Installed authoring PDF passed without warnings. A disposable named smoke DB
and narrowly scoped credential used the exact installed image for short PDF
and DOCX, without publishing a user template. Both complete task receipts,
bytes/hashes and source text passed. All3 one-page outputs were rendered and
visually inspected; DOCX ZIP/Thai source text/4embedded Sarabun faces passed.
LibreOffice preview Thai PDF extraction has positioned-glyph mapping differences;
that extraction is not exact-source proof, and native Word is not asserted.
Full-page review found no clipping/missing visible content. Existing DOCX/layout
limitations remain unchanged. Smoke/restore helpers are stopped; installed
API/database remain running. No product source, release tag, original PDF or
user template was rewritten. Artifacts: final-check.json, restore-check.json,
upgrade.json, restart-check.json, installed-preflight.log, smoke-pair.json and
smoke-output/ under the installation root. Next step is app reload/chat discovery,
not another installation or product change.
