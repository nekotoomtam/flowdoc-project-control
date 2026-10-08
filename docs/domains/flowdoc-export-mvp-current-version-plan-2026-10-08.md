# Current/version storage implementation plan

> For agentic workers: use superpowers:executing-plans for inline execution,
> task by task. Do not dispatch implementers or revive previous execution rooms.

## Authority Boundary

Project Control owns this plan; Service owns the eventual implementation.
Role: Planning Partner / Documentation Synthesizer. Owner read the design and
requested the next plan on 2026-10-08. This turn writes the plan only.
Single-room, execution/Phase/Checklist IDs not applicable; no product changes yet.
Work size: medium implementation, routine risk; this planning edit is small.
One authority at a time: Task 0 discovery before implementation Tasks 1–5.
No migration against existing user DB, data deletion, merge or push authorized here.

**Goal:** ให้ข้อมูลปัจจุบันแก้ได้ และสร้างชุดเวอร์ชันแยกอย่างครบถ้วนโดยรักษา R3 เดิม
**Architecture:** relational current scopes/variables, separate version rows with
JSONB snapshots, stable master IDs, immutable Core-compatible assembled versions.
**Tech stack:** existing Node24/TypeScript/pg/PostgreSQL18/Docker; Core dev.4 unchanged.
**Spec:** [แบบที่เจ้าของอ่านแล้ว](flowdoc-export-mvp-current-version-design-2026-10-08.md).
**Baseline:** Service `da79f00`, Core `a2fcce4`; verify actual branch/dirty state
again before execution. Preserve unrelated files. Isolate if concurrent changes
or migration experiments need it; room arrangement alone does not require a worktree.

## Constraints and decisions for this plan

- No UI, permissions, created_by, media, node tree/master, new Core types or R4 HTTP.
- Preserve template/version identity, old definition content/fingerprint and job FK.
  Do not edit applied `001_initial.sql`, reset a DB, or silently regenerate old IDs.
- New entities use UUID v7; legacy text template IDs need an explicit compatibility
  mapping. The owner-approved design does not authorize changing old Core envelope IDs.
- Master INTEGER IDs: group 11; proposed seeds `110001=string`, `110002=object`,
  `110003=array`. These are plan selections for review, not previously locked values.
- All rows have created_at; editable current rows have updated_at. Immutable rows
  use clone time. Master code/ID meaning stays fixed; name can change.
- Publish validates current before clone. Current deletion can leave unresolved
  content references; publication then fails with a path, old versions remain readable.
- Proposed ownership deletion: format → owned schema/variables, variable → children;
  no automatic deletion of textual references or version rows. Whole-template hard
  deletion is restricted once versions exist. These choices are explicit proposals.
- Stop after DB/current/version acceptance. R4 follows as another bounded plan.

Document budget: this plan plus design decisions and existing R3 follow-up links;
Service README/AGENTS changes only for delivered commands. Proof: focused RED/GREEN,
real PostgreSQL upgrade + fresh install + concurrency/restart tests, one final review.
No synthetic Work records, broad benchmark, repeated reviews or full PC suite.
Current host implementation continues inline; no model override or new room in
this planning turn. Resolve compact WORK model choice under current workflow policy
if execution arrangements change; do not inherit PLAN choice for a separate WORK.

## Task 0 — Resolve compatibility before touching product files

**Read:** Service migrations/001_initial.sql, src/templates/registry.ts,
src/cli.ts, tests/database.test.mjs, examples/srs-template.json; installed Core
public type declarations and validateTemplate contract. No production DB mutation.

- [x] Inspect data shape and ID/fingerprint behavior using the known R3 fixture.
- [x] Record a concrete current-row/old-version mapping in the design: keep old
  templateId and version row IDs stable, allocate new internal UUID identities if
  needed, and keep source identity separate from Core-facing templateId.
- [x] Specify import identity matching: ID-bearing current records preserve ID
  through key rename; never infer a rename merely from matching a new key.
  Initial raw Core-template import allocates IDs and returns an editable ID-bearing
  current representation. Subsequent updates must supply those IDs.
- [x] Specify owned snapshot payload boundaries and exact FK mapping. No full
  variable schema duplicated as independently editable data in both header and rows.
- [x] Close migration of old versions and initialization of current from latest
  registered version. No new version or changed historical fingerprint is generated
  merely by upgrading. Corrupt/incompatible input aborts with a useful diagnostic.

Deliverable: short resolved mapping in existing design, not a new report. If this
cannot preserve R3 identities/contract, stop and explain the concrete conflict.
Task 0 is a real dependency; later tasks must not guess around it.

## Task 1 — Master and storage foundation

**Files:** add migrations/002_current_version.sql;
tests/current-schema.test.mjs, tests/upgrade.test.mjs; adapt src/db/migrate.ts only
if the resolved upgrade requires an application backfill hook. Keep 001 unchanged.

- [x] Write tests for fresh migration and upgrading a populated 001 fixture with
  multiple versions, a pinned job and output metadata. Observe failure before code.
- [x] Add current formats/schemas/variables, variable_types and version child tables
  from the design, plus the identity mapping settled in Task 0.
- [x] Enforce owner FK, same-schema parent, root/sibling key uniqueness, version
  ownership, immutable version rows, type master FK, timestamps and indexes.
  Cycles need explicit validation beyond a simple parent FK.
- [x] Test duplicate root key with NULL parent, cross-owner refs, deleted referenced
  master and incompatible upgrade rollback. Assert old IDs/fingerprints/pins unchanged.
- [x] Run build and focused tests on an isolated DB, inspect diff, commit foundation.

## Task 2 — Current records and Core assembly

**Files:** add src/templates/current.ts, assembly.ts, types.ts;
tests/current.test.mjs, tests/assembly.test.mjs; modify registry.ts at integration.

**Interfaces proposed:** importCurrent(pool, rawJson): Promise<Result<CurrentRecord>>;
loadCurrent(pool, templateId): Promise<Result<CurrentRecord>>;
saveCurrent(pool, record, expectedRevision): Promise<Result<CurrentRecord>>;
assembleDefinition(record, version): Result<TemplateDefinition>.
CurrentRecord contains stable IDs, owned rows and a revision for stale-write checks;
the revision is internal concurrency metadata, not a document version number.

- [x] Write failing round-trip tests for Thai/quotes/newlines, defaults, array item
  children, identical keys in global/A/B and multiple invocations sharing a definition.
- [x] Implement import/load/save and pure assembly to the existing Core envelope.
  Accept structurally consistent current drafts even if field references are not
  ready for publication. All mutations lock the same template identity as publish.
- [x] Test rename preserves ID; delete affects current only; malformed ownership,
  cycle and stale revision cannot silently overwrite records. No arbitrary string
  rewriting or new {{...}} syntax; preserve existing key/path scope binding.
- [x] Run build, focused assembly/current tests and affected R3 tests; commit.

## Task 3 — Atomic publication with retry handling

**Files:** add src/templates/publish.ts, tests/publish.test.mjs;
modify registry.ts/loadTemplate to assemble from immutable version rows.

**Interface:** publishCurrent(pool, {templateId, requestId}):
Promise<Result<Registration>>. Same canonical command/request ID returns the
original registration. Conflicting reuse returns a structured conflict.

- [x] Write failing tests: version starts 1, increments per template, duplicate
  request returns same ID, concurrent distinct requests get unique sequential
  numbers, and current mutation cannot change the validated snapshot mid-clone.
- [x] Use one checked-out client/transaction and per-template lock; inspect token
  receipt, load/validate, allocate next version, map new IDs, insert all snapshot
  rows, retain master IDs, store fingerprint/receipt, commit, then return.
- [x] Test forced failure after header insertion rolls back children/header/receipt;
  retry after response loss and later current edits returns original version.
  Never advance version before validation or load current when executing an old job.
- [x] Test current rename/delete/new publication leaves every old envelope and pinned
  job intact, and unknown variable reference blocks publication without changing data.
- [x] Run build plus publication/concurrency/integration tests; commit.

## Task 4 — Local commands and legacy entrypoint compatibility

**Files:** modify src/cli.ts, src/templates/registry.ts, tests/cli.test.mjs,
README.md, AGENTS.md; add examples/current-edit.json once IDs/shape are settled.

- [x] Add command tests before handlers: draft import/show/save and publish with
  request ID. Lock exact syntax in --help; JSON diagnostics and exit codes stay stable.
- [x] Keep `show docKey [version]` compatible. Retain old `register` as explicit
  immutable import compatibility, not a bypass creating header-only versions.
  It must populate the new version structure atomically and leave current drafts
  unchanged except the explicitly defined first-time initialization.
- [x] Test legacy register versus publish concurrency under the same identity lock,
  idempotent registration, identity/content conflicts and latest/exact selection.
- [x] Document a reproducible CLI sequence: import → inspect IDs → edit → save →
  publish → edit/delete → failed publish → repair → publish → show old version.
- [x] Run build and focused CLI/registry tests; commit only after passing.

## Task 5 — Upgrade/container acceptance and bounded closure

**Files:** scripts/checkDatabase.mjs, tests/checkPersisted.mjs,
tests/upgrade.test.mjs, tests/version-render.test.mjs, package.json/lock only for
Service version bump to dev.2; Dockerfile if required by delivered files.

- [x] Extend isolated check to cover both fresh latest schema and populated 001
  upgrade, retaining artifacts and original test DBs; never clear user volumes.
- [x] Verify assembled historical and newly published definitions with packaged
  Core. Render the known SRS fixture through original and assembled envelopes;
  compare semantic/fingerprint and deterministic PDF results. Investigate any
  change, do not relabel different output as equivalent without evidence.
- [x] Run `npm run build` and `npm run check:database`; capture tests, image IDs,
  migration checksums and restart persistence. Source mounts remain absent.
- [x] One fresh read-only final review of the complete candidate; fix concrete
  failures with RED/GREEN and rerun affected checks. No automatic second audit.
- [x] Commit Service, update this plan/design with outcomes and remaining issues,
  verify Markdown links/diff, commit PC. No merge/push or promotion of system maps.

## Review focus and finish line

Review focuses on renamed keys versus stable IDs (Task 2), NULL-root uniqueness
(Task 1), old provenance after deletion (Tasks 1/3), lost-response retry after
current edits (Task 3), and old register bypass (Task 4). Each has an owning test.

This slice finishes when current edits, version clones, master references,
compatibility and isolated upgrade/restart acceptance pass. It does not prove
HTTP-to-PDF MVP readiness. Next R4: accept data through API, pin version, execute
job, report state and download PDF; do not start that code inside this DB slice.

Planning verification: checked Service baseline and design references; tasks
cover the design's lifecycle/identity/type/scope cases. Runtime tests above are
future acceptance, not claims of tests executed during this planning turn.

## Execution checkpoint — 2026-10-08

Owner authorized inline execution after reading this plan. Task 0 compatibility
mapping is recorded in the design. Candidate changes exist on Service branch
codex/template-registry but are deliberately NOT committed or accepted yet.

- Implemented candidate: migration 002, current relational records, snapshot child
  tables, assembly, current import/save/load, publish with lock/receipt, legacy
  registration/load integration and draft/publication CLI handlers.
- RED observed for missing assembly/current modules and absent CLI commands;
  example-version binding test then exposed a real version1→2 mismatch and passed
  after assembly rebinding. Current payload is not mutated by that binding.
- `tsc -p tsconfig.json` passed; assembly/CLI/version-boundary tests: 7 passed.
- PostgreSQL, upgrade, concurrency, restart and PDF candidate tests have NOT passed.
  Docker check artifacts/1791423220843 failed before build because the Linux engine
  pipe was unavailable. Attempted normal Docker Desktop startup; its log reports
  dockerInference socket file inaccessible. Asked owner to restore Docker. No reset,
  factory reset, volume deletion or Docker settings repair was performed by this agent.
- One fresh read-only review found no confirmed important defect but identified
  UUID v4 still used by legacy register, import identity-conflict diagnostic mismatch,
  and synthetic legacy source provenance needing explicit treatment.
- Review also found remaining proof coverage: multi-version/output upgrade and
  failed-upgrade rollback; actual save/publish and register/publish concurrency;
  direct SQL root/cross-owner constraints; CLI happy path and expanded restart checks.
  PDF comparison test is now written but unexecuted. These are required follow-up,
  not accepted limitations or a reason to declare the slice complete.

Resume: restore engine, finish the identified test coverage, observe failures and
repair the concrete findings, then run real DB/container acceptance. Finish README,
Service dev.2 versioning and task commits only after their relevant checks pass.
No R4 work, DB migration against user data, merge/push or system map promotion.

## Acceptance — 2026-10-08, completed

Docker recovered after the owner opened it. Service `138269c` on
`codex/template-registry`, package `0.1.0-dev.2`, completes this bounded slice.
Core stays unchanged at dev.4. No merge/push or R4 implementation was performed.
Prior blocked checkpoint is retained as history, not current status.

| Scope | Final evidence |
| --- | --- |
| Current decomposition/assembly/scopes | assembly.test.mjs: round trip, duplicate root/cross-schema/cycle rejection, examples rebound without mutating current |
| Current edit and immutable publication | current.test.mjs: ID retained on edit, deletion does not change old version, stale revision rejected, fresh snapshot IDs, same-token replay, unique concurrent publication |
| Transactions and relationships | current.test.mjs: failed receipt insertion rolls back whole publication, real template lock wait, actual save/publish and register/publish overlap, direct SQL root uniqueness and parent owner FK |
| Upgrade compatibility | upgrade.test.mjs: two historical versions, old fingerprint/IDs, job/prepared data/output preserved, current seeded from latest; incompatible historical fingerprint rolls back migration 002 |
| CLI and persistence | checkCurrentCli.mjs and checkPersisted.mjs: import/show/save, retry, invalid publication, repair/publication2, exact old load, current revision and receipts after DB restart |
| Renderer boundary | version-render.test.mjs: original and DB-assembled SRS definitions have equal fingerprints and produce byte-identical PDF, page count >0 |
| Package/runtime | final isolated Docker acceptance builds pinned images from vendor/lockfile; same image across restart; no host source mounts/public DB ports |

Final command `node scripts/checkDatabase.mjs` exited 0. Artifact:
`flowdoc-service/artifacts/1791425182195/result.json` — **27 passed, 0 failed,
0 skipped**, plus CLI and restart assertions. Public-schema restart counts:
17 templates, 21 versions, 1 fixture job, 1 output metadata row. Upgrade fixtures
are isolated schemas within the test DB. No fixture rows claim production jobs.

- Runtime image: `sha256:42232f8340202821f20ad429567bd8ab38f51f2e83596e493c793e2f1c0052e0`.
- Verification image: `sha256:cb454bcc08615eb4d01b7e0c3e2366f4703bf613e35099312842cb05b89d5e2c`.
- Migration 002 SHA256: `75672db3b387da2f0c2be30f95d8cec50e4d654afba2ca3d4f4393a8bfdd4d53`.
- Build passed locally and in Docker. Final Service staged diff check passed.
- Earlier real-DB run 1791424869137 passed 22 tests; review regression run
  1791424958251 correctly failed on UUID v4 versus v7. Manual conflict probe also
  showed TEMPLATE_NOT_FOUND instead of TEMPLATE_IDENTITY_CONFLICT before repair.
  Final coverage closes those defects and the review's missing-proof items.

One fresh review was used; no repeated audit. Its provenance concern was resolved:
legacy raw import/backfill has NULL source child IDs because historical current
rows never existed. Actual current publication records real source IDs. New
registered version headers now use v7; existing historical IDs remain unchanged.

Execution rulings/limitations:
- A single final product commit was used because real DB acceptance was blocked
  during intermediate tasks; no task was committed as passing before DB checks.
- Existing templates.id remains text for Core/R3 compatibility; no silent UUID
  conversion or second public identity. New child/version IDs use UUID v7.
- ID-bearing draft-save requires callers to remove owned descendants together.
  SQL ownership cascades exist; no inferred text cleanup or general editing API.
  This respects the owner's deferred automatic-deletion workflow.
- Current mutation operations take the common lock. Arbitrary administrator SQL
  bypassing these commands is outside the concurrent publication guarantee.
- Draft-save uses JSON.parse for an ID-bearing serialized record; duplicate raw
  keys in that edit format are not a newly promised contract. Raw Core template
  import/register retain Core's duplicate-aware validation.
- Object master entry does not add arbitrary object-field support. Type seeds
  110001/110002/110003 are the plan's implemented choices for string/object/array.
- Example request version is derived at assembly; old-version assembly produces
  its original version/fingerprint. Snapshot source payload is never mutated.
- tests/checkCurrentCli.mjs supplies a generated ID-bearing edit example, replacing
  a static example file whose IDs would misleadingly belong to another DB.
- Only isolated DBs were migrated. All created test environments are stopped,
  including the failed regression project; volumes/networks/artifacts remain.
  Initial Docker-start failure did not lead to reset or deletion by this agent.

No mandatory acceptance gap remains for the delivered slice. No permission/media/
node-master/HTTP functionality added. Next work is the separate R4 API/job plan.
