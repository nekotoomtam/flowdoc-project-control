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

- [ ] Core0.5.2 package/lock/manuals, build and Linux checks covering template,
  data, composition, layout, DOCX and PDF consumers; create a new immutable
  archive after committing source, retaining previous packages and provenance.
- [ ] Service0.5.2 package/lock/vendor/manuals with exact Core0.5.2 pin;
  build/vendor checks and isolated real DB/API tests of output naming,
  historical migrations, legacy18/19, B style and authoring consumers at1GiB.
  Reuse unchanged layout/Word proof only within its original scope.
- [ ] Canonical authoring API/metadata guidance, explicit Service18/19 vs
  experimental Core20 and installed plugin boundaries; refresh source guidance
  snapshot only after canonical commit. Leave installed plugin and its strict
  compatibility profile unchanged; its next release remains separate work.
- [ ] Review final diff/coverage, commit and fast-forward clean development
  branches; reuse proof only for identical accepted trees. Preserve ignored
  output before retiring only merged, clean current-round temporary lanes.

Proof budget: affected checks once on the final pair plus bounded repairs for
actual failures; no automatic complete Service/I6 acceptance claim. Document
budget: this existing record, four owner manuals and the relevant canonical API
page plus generated guide copies; no new Work/Phase/report or map promotion.
Existing evidence under output-file-names is reused; new package/version proof
will be placed in a separate integration-052 subdirectory.
