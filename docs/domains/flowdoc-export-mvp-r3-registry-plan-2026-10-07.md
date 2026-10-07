# Export MVP R3 — PostgreSQL and template registration

## Authority Boundary

Project Control owns this plan/status; flowdoc-service owns implementation.
Owner authorized continuing the locked MVP after accepting the R2 table result.
Role: Product Implementation Agent / Documentation Synthesizer. Execution IDs:
not applicable to inline work. Medium size, routine risk. Service is empty with
no AGENTS.md: bootstrap its narrow repository guide from this resolved ownership.
Use codex/template-registry in Service; Core's existing branch remains unchanged.
No merge/push, no release freeze, no old execution registry or shared map update.

## Goal and contract

Register raw template JSON using installed Core dev.4, persist immutable versions
in PostgreSQL, load exact/latest versions, and prove data survives DB restart.
Four domain tables stay as locked: templates, template_versions, generation_jobs,
document_outputs; schema_migrations is internal migration metadata, not a new
business entity. Job/output tables are foundations only; HTTP and worker are R4.

Ruling: Service version numbers use PostgreSQL positive int32 (1..2147483647).
Reject larger values before SQL instead of reporting a storage fault. Core stays
unchanged; this is the Service storage boundary and matches CLI lookup validation.

Use TypeScript strict/Node24, pg 8.23.1 with exact lockfile and SQL migrations.
Pin the official PostgreSQL18 Bookworm image digest after pulling it. Core is the
verified dev.4 tarball with SHA-256 recorded in vendor/manifest.json; import only
root APIs, never source/deep runtime code. First Service prerelease dev.1 is a
registry CLI image, not a completed HTTP release. Reuse pinned Node/Python runtime
images so the subsequent export path does not require an unrelated image family.

registerTemplate(pool,rawJson) validates before transaction. Insert template and
version atomically. Template id/docKey pairing is stable; unique conflicts return
TEMPLATE_IDENTITY_CONFLICT or TEMPLATE_VERSION_CONFLICT. Repeating the exact
same fingerprint for an existing version is idempotent. A different version can
be added without changing earlier rows. Display name remains first registered;
each version retains its own name inside its definition.

loadTemplate(pool,docKey,version?) selects once (highest version when omitted),
returns version row ID plus revalidated Core template/fingerprint. Never resolve
latest again for a pinned job. Missing key/version return separate errors.
Malformed persisted definition/fingerprint returns STORAGE_FAILED without SQL,
connection strings, paths or raw exception details in public issues.

DB enforces FK/unique/type/status bounds, version immutability and stable template
identity. Jobs preserve selected version and original/prepared/warnings/skips;
output is unique per job. No cleanup/delete workflow is introduced. A migration
transaction with an advisory lock and stored checksums prevents partial schema
and rejects changed/unknown applied migration files.

## Execution and proof

1. Bootstrap repository-owned AGENTS/package/build files and installed Core
   artifact. Write real-PostgreSQL tests before migration/registry code. Observe
   red, then implement migration and repository operations with one client per
   transaction and parameterized business values.
2. Cover registration/load/latest, raw duplicate JSON rejection, invalid-example
   rejection, concurrent same/different version collisions, all-or-nothing
   template insertion, immutable versions, FK/unique output and pinned jobs.
   Tests use a fresh isolated DB; never truncate/delete an existing user DB.
3. Provide migrate/register/show CLI, local Compose and pinned registry image.
   Fresh Docker acceptance uses artifact/lockfile only, its own named volume and
   internal network. Verify migration replay, checksum mismatch, registration,
   constraints, then restart the DB and inspect the same records with the same
   service image. No host source mounts or public DB port required.
4. One final fresh read-only review; fix concrete defects, rerun impacted proof,
   commit code and update this record. Stop at R3 criteria. No HTTP, serial worker,
   job execution/download, rendering changes, broad load tests or new queue stack.

Acceptance evidence: real DB tests, isolated acceptance JSON/image/tarball hashes,
CLI output and restart checks. Document budget: this plan, prior next-step link,
Service AGENTS/README. Runtime outputs are ignored artifacts. No Core edits.

Implementation references: node-postgres transactions require the same checked-out
client (https://node-postgres.com/features/transactions); values use parameters
(https://node-postgres.com/features/queries). Official PostgreSQL18 container volume
mount is /var/lib/postgresql (https://hub.docker.com/_/postgres).

## Result — R3 complete, 2026-10-07

Service commit `da79f00` on `codex/template-registry` implements this slice;
Core remains at `a2fcce4` and is consumed only through its dev.4 artifact.
No merge or push was performed. Work/Phase/Checklist execution IDs are not
applicable to this inline slice. No system map or full MVP readiness is promoted.

| Acceptance | Evidence and result |
| --- | --- |
| Raw registration and exact/latest lookup | `tests/database.test.mjs`: raw duplicate keys and invalid examples rejected, previous versions retained, missing key/version distinguished |
| Atomic, concurrent, immutable registration | Real SQL tests: eight identical simultaneous requests create one version; differing content conflicts; identity conflicts create no orphan; forced storage failure rolls back |
| DB relationships and pinned inputs | SQL tests enforce version immutability, stable identity, FK/output uniqueness and original/prepared job pin; adding v2 leaves accepted job on v1 |
| Migration integrity | Initial migration, unchanged replay, changed-checksum rejection; transactional runner and advisory lock reviewed |
| CLI and local container setup | Built from lockfile and hash-verified Core tarball, non-root runtime, CLI JSON/exit codes and sanitized diagnostics tested |
| Restart persistence | Same runtime image loads identical registered definition before/after DB restart; 7 templates, 10 versions, 1 fixture job and 1 output metadata row persisted |
| Service version bound | `tests/version-boundary.test.mjs`: observed RED with storage error, added pre-SQL int32 validation, then GREEN |

Final check: `npm run build` passed; local CLI/boundary tests 3/3 passed;
`npm run check:database` passed **11 tests, 0 failed, 0 skipped**, plus CLI and
restart assertions on real PostgreSQL 18.6 / Linux x86-64. One fresh read-only
whole-slice review returned no remaining important findings. Review probes also
confirmed stored invalid definitions/fingerprint mismatches fail safely.

Final durable reproduction entrypoint is Service `scripts/checkDatabase.mjs`.
Local proof is `flowdoc-service/artifacts/1791390540456/result.json` with per-step
logs. Earlier run `1791390139614` passed 10 tests before the version-boundary fix;
it is not substituted for the final candidate's evidence.

- Runtime image: `sha256:ca73ad0188ba1cafed619b6be83e3fa3530757636b38e79d5919d6ed48dddf01`.
- Verification image: `sha256:01c742e88819d9f61732aa8375abc8f3b4beaa3ccb3d6c7ee4d26004e88b1f1e`.
- Core artifact SHA-256: `96be5988714e44a95f2aa67c84c1be86ec7ba1c6b2ab2a7fe54d02d361cb5878`.
- Migration 001 SHA-256: `d111c1d82489af057eeae32d9698b1093eefcff5f01ff5c10df0cb0673cb906c`.

Both isolated test projects are stopped; their volumes/networks/images remain
for inspection. No published ports or host source mounts. Generated credentials
stay in ignored local artifacts and must not accompany shared reports.

No acceptance gaps remain for R3. Job/output rows here are fixture metadata,
not evidence of queued PDF execution. HTTP, worker state transitions, output
download, resource limits and end-to-end generation remain R4/subsequent locked
MVP work. Next: accept API input through Core, pin and store a queued job, execute
it with the packaged renderer, then expose status and the resulting PDF.

### Owner follow-up — 2026-10-08

R3 acceptance above remains complete for its original scope. Before R4 the owner
requested a revised persistence design separating mutable current records from
cloned version tables, variable definitions and a shared type master. See the
[current/version design](flowdoc-export-mvp-current-version-design-2026-10-08.md).
This is additional design work, not a reopened R3 implementation or a claim that
its database has changed. Review the draft and migration plan before R4 work.
