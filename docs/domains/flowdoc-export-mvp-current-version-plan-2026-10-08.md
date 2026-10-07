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

- [ ] Inspect data shape and ID/fingerprint behavior using the known R3 fixture.
- [ ] Record a concrete current-row/old-version mapping in the design: keep old
  templateId and version row IDs stable, allocate new internal UUID identities if
  needed, and keep source identity separate from Core-facing templateId.
- [ ] Specify import identity matching: ID-bearing current records preserve ID
  through key rename; never infer a rename merely from matching a new key.
  Initial raw Core-template import allocates IDs and returns an editable ID-bearing
  current representation. Subsequent updates must supply those IDs.
- [ ] Specify owned snapshot payload boundaries and exact FK mapping. No full
  variable schema duplicated as independently editable data in both header and rows.
- [ ] Close migration of old versions and initialization of current from latest
  registered version. No new version or changed historical fingerprint is generated
  merely by upgrading. Corrupt/incompatible input aborts with a useful diagnostic.

Deliverable: short resolved mapping in existing design, not a new report. If this
cannot preserve R3 identities/contract, stop and explain the concrete conflict.
Task 0 is a real dependency; later tasks must not guess around it.

## Task 1 — Master and storage foundation

**Files:** add migrations/002_current_version.sql;
tests/current-schema.test.mjs, tests/upgrade.test.mjs; adapt src/db/migrate.ts only
if the resolved upgrade requires an application backfill hook. Keep 001 unchanged.

- [ ] Write tests for fresh migration and upgrading a populated 001 fixture with
  multiple versions, a pinned job and output metadata. Observe failure before code.
- [ ] Add current formats/schemas/variables, variable_types and version child tables
  from the design, plus the identity mapping settled in Task 0.
- [ ] Enforce owner FK, same-schema parent, root/sibling key uniqueness, version
  ownership, immutable version rows, type master FK, timestamps and indexes.
  Cycles need explicit validation beyond a simple parent FK.
- [ ] Test duplicate root key with NULL parent, cross-owner refs, deleted referenced
  master and incompatible upgrade rollback. Assert old IDs/fingerprints/pins unchanged.
- [ ] Run build and focused tests on an isolated DB, inspect diff, commit foundation.

## Task 2 — Current records and Core assembly

**Files:** add src/templates/current.ts, assembly.ts, types.ts;
tests/current.test.mjs, tests/assembly.test.mjs; modify registry.ts at integration.

**Interfaces proposed:** importCurrent(pool, rawJson): Promise<Result<CurrentRecord>>;
loadCurrent(pool, templateId): Promise<Result<CurrentRecord>>;
saveCurrent(pool, record, expectedRevision): Promise<Result<CurrentRecord>>;
assembleDefinition(record, version): Result<TemplateDefinition>.
CurrentRecord contains stable IDs, owned rows and a revision for stale-write checks;
the revision is internal concurrency metadata, not a document version number.

- [ ] Write failing round-trip tests for Thai/quotes/newlines, defaults, array item
  children, identical keys in global/A/B and multiple invocations sharing a definition.
- [ ] Implement import/load/save and pure assembly to the existing Core envelope.
  Accept structurally consistent current drafts even if field references are not
  ready for publication. All mutations lock the same template identity as publish.
- [ ] Test rename preserves ID; delete affects current only; malformed ownership,
  cycle and stale revision cannot silently overwrite records. No arbitrary string
  rewriting or new {{...}} syntax; preserve existing key/path scope binding.
- [ ] Run build, focused assembly/current tests and affected R3 tests; commit.

## Task 3 — Atomic publication with retry handling

**Files:** add src/templates/publish.ts, tests/publish.test.mjs;
modify registry.ts/loadTemplate to assemble from immutable version rows.

**Interface:** publishCurrent(pool, {templateId, requestId}):
Promise<Result<Registration>>. Same canonical command/request ID returns the
original registration. Conflicting reuse returns a structured conflict.

- [ ] Write failing tests: version starts 1, increments per template, duplicate
  request returns same ID, concurrent distinct requests get unique sequential
  numbers, and current mutation cannot change the validated snapshot mid-clone.
- [ ] Use one checked-out client/transaction and per-template lock; inspect token
  receipt, load/validate, allocate next version, map new IDs, insert all snapshot
  rows, retain master IDs, store fingerprint/receipt, commit, then return.
- [ ] Test forced failure after header insertion rolls back children/header/receipt;
  retry after response loss and later current edits returns original version.
  Never advance version before validation or load current when executing an old job.
- [ ] Test current rename/delete/new publication leaves every old envelope and pinned
  job intact, and unknown variable reference blocks publication without changing data.
- [ ] Run build plus publication/concurrency/integration tests; commit.

## Task 4 — Local commands and legacy entrypoint compatibility

**Files:** modify src/cli.ts, src/templates/registry.ts, tests/cli.test.mjs,
README.md, AGENTS.md; add examples/current-edit.json once IDs/shape are settled.

- [ ] Add command tests before handlers: draft import/show/save and publish with
  request ID. Lock exact syntax in --help; JSON diagnostics and exit codes stay stable.
- [ ] Keep `show docKey [version]` compatible. Retain old `register` as explicit
  immutable import compatibility, not a bypass creating header-only versions.
  It must populate the new version structure atomically and leave current drafts
  unchanged except the explicitly defined first-time initialization.
- [ ] Test legacy register versus publish concurrency under the same identity lock,
  idempotent registration, identity/content conflicts and latest/exact selection.
- [ ] Document a reproducible CLI sequence: import → inspect IDs → edit → save →
  publish → edit/delete → failed publish → repair → publish → show old version.
- [ ] Run build and focused CLI/registry tests; commit only after passing.

## Task 5 — Upgrade/container acceptance and bounded closure

**Files:** scripts/checkDatabase.mjs, tests/checkPersisted.mjs,
tests/upgrade.test.mjs, tests/version-render.test.mjs, package.json/lock only for
Service version bump to dev.2; Dockerfile if required by delivered files.

- [ ] Extend isolated check to cover both fresh latest schema and populated 001
  upgrade, retaining artifacts and original test DBs; never clear user volumes.
- [ ] Verify assembled historical and newly published definitions with packaged
  Core. Render the known SRS fixture through original and assembled envelopes;
  compare semantic/fingerprint and deterministic PDF results. Investigate any
  change, do not relabel different output as equivalent without evidence.
- [ ] Run `npm run build` and `npm run check:database`; capture tests, image IDs,
  migration checksums and restart persistence. Source mounts remain absent.
- [ ] One fresh read-only final review of the complete candidate; fix concrete
  failures with RED/GREEN and rerun affected checks. No automatic second audit.
- [ ] Commit Service, update this plan/design with outcomes and remaining issues,
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
