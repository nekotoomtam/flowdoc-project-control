# FlowDoc Export MVP R2 — Binding and composition implementation plan

> For agentic workers: use `superpowers:executing-plans` for inline execution
> after owner review. Owner authorized continuous inline execution; the bounded
> B1–B4 result and evidence are recorded below. Original task lists retain the plan.

## Authority Boundary

Owner: Project Control. Role: Planning Partner / Documentation Synthesizer.
Authority: owner's request to continue after the P4 PDF trial, 2026-10-07.
Product owner: flowdoc-core. Registered Work/Phase/Checklist IDs: not applicable
to this single-room scope. Work Size: medium; Risk Tier: routine. This plan does
not reopen an old registered round or promote product/map truth.

**Goal:** Validate creator-defined templates and caller data, resolve values and
compose an independent node graph in caller order, then send text-only results
through the existing public PDF engine.

**Architecture:** Three public operations with separate responsibilities:
validateTemplate checks reusable definitions, prepareGeneration resolves request
data/defaults and warnings, composeDocument clones/binds the accepted invocations.
All three are pure with respect to filesystem/DB and caller-owned input. Extend
the resolved graph with simple table nodes, but keep PDF table support explicitly
unsupported until the next layout slice. No second rendering path is introduced.

**Spec:** [R1 sections 3–7](flowdoc-export-mvp-r1-design-2026-10-07.md),
[locked MVP](flowdoc-export-mvp-v1-2026-10-07.md), and
[verified package/PDF prerequisite](flowdoc-export-mvp-r2-runtime-plan-2026-10-07.md).
**Stack:** Existing TypeScript/ESM, Vitest and the pinned Linux consumer runtime.
Use Node crypto for definition fingerprints; no new service or runtime dependency.

## Scope and proof budget

- Base: Core `04d7a1e7ec985f0b0e8a87d038f95f80a35eb623`, clean at planning.
  Inspect state again before execution; preserve the P4 commit and dev.2 artifact.
  Use a new branch and isolate the checkout if concurrent work appears.
- Allowed: Core template/data/binding/composition modules, resolved-node types,
  shared validation, public exports, fixtures/tests, package/consumer metadata,
  code-adjacent README/AGENTS; this plan for status and rulings.
- Excluded: table drawing/pagination, PDF algorithm changes, native optimization,
  HTTP/DB/job persistence, frontend, DOCX/images, form runtime, public publishing.
- Acceptance: full R1 template/data policy matrix, A/B/A graph composition with
  table row repeats, no input/default aliasing, complete source mapping, stable
  diagnostics; installed dev.3 package generates a bound text PDF using existing
  engine. Composed table input still fails explicitly at the PDF boundary.
- Reuse P4 font/shaper/renderer proof. Proof budget: focused red/green tests,
  one final build/Core suite, one packed consumer with bounded failure repair,
  one bound text PDF checked for text/fonts/visual appearance. Reuse unchanged
  P4 PDFs by exact hash where possible; no load benchmark or old-repo full suite.
- Document budget: this plan plus a link from the R2 runtime plan and Core local
  usage notes. No Work registry, synthetic room records, map or new Evidence index.
- Inline planning uses the current chat; no separate WORK model/dispatch is
  activated by this document. Reassess model availability/effort before actual
  separate-room work if the owner later chooses that arrangement.
- Stop after the acceptance criteria pass. Escalate only if R1 semantics, the
  public engine contract or ownership must change. Table rendering is deferred;
  malformed persisted prepared data and duplicate JSON keys are blocking concerns
  addressed in the tasks, not optional later hardening.

## Contract decisions for this slice

1. `validateTemplate(input: unknown): Result<ValidatedTemplate>` accepts a raw
   JSON string or an already parsed definition. Raw text is the registration
   boundary: detect duplicate decoded property names before accepting it. Parsed
   objects cannot reveal keys discarded by someone else's JSON.parse; document
   this and require raw text in the future Service registration command.
2. `ValidatedTemplate` contains a detached, deeply frozen validated definition
   and deterministic SHA-256 fingerprint. Canonical serialization sorts object
   keys and preserves array order; exact template identity/version is included.
   This fingerprint prevents accidental cross-template prepared-input use; it
   is not authentication or an authorization mechanism.
3. `PreparedInput` is JSON-serializable: schemaVersion, pinned template identity
   and fingerprint, prepared global data, accepted content entries with their
   originalIndex/format/data, originalContentCount, skippedContentIndices and
   warnings. Service will separately retain original request bytes/JSON.
4. `prepareGeneration(template, input)` allows omitted request version because
   the supplied validated template is already selected. An explicit version or
   docKey mismatch is INVALID_DATA. It never selects latest or queries storage.
5. Envelope fields are strict. Each content entry needs a nonempty string format
   and a data key; unknown format skips validation of that data value and produces
   UNKNOWN_FORMAT. Known-format data must be an object. Unknown envelope keys are
   errors, not the UNKNOWN_VARIABLE policy for business data.
6. Missing global/known-local data container reports MISSING_REQUIRED at that
   container and its discoverable required children. A present wrong-type
   container reports TYPE_MISMATCH only there, while siblings are still checked.
   Required means presence; optional defaults apply only to absent keys.
7. Binding normalizes CRLF/CR to LF, creates text/line-break leaves and drops
   empty text leaves. It preserves all other whitespace. Styling is inherited
   from the containing TextBlock's textStyleId as in P4; no inline style overrides
   are added here. Empty optional output may leave an empty TextBlock.
8. `ResolvedDocument.nodes` becomes the R1 simple-node union: TextBlock, Table,
   TableRow and TableCell. The engine keeps a text-only capability validation
   before textFlow. Structural validation must not silently imply table render
   capability. No public alternative document/glyph API is introduced.
9. `composeDocument(template, prepared)` revalidates the serializable prepared
   envelope, pin/fingerprint, index order, known formats and complete normalized
   data before binding. It does not trust a TypeScript brand after persistence or
   apply new defaults to malformed prepared data. Return INVALID_DATA on mismatch.
   Prepared validation recognizes canonical empty values introduced for absent
   optional fields: an optional string with no default can be empty even when
   allowEmpty=false would reject a caller-supplied empty string. Do not re-run
   raw-request presence rules on an already normalized snapshot.

## Global constraints and review focus

- Only string fields and one business level of array<object>; item fields are
  strings. No optional nested object fields, number/date/boolean coercion, nested
  formats, expression lookup, script execution or arbitrary imports.
- Required missing is an error even with default; optional missing uses valid
  default or empty string/array. Provided null/wrong type is an error even when
  optional/defaulted. allowEmpty=false rejects supplied empty/whitespace strings.
  Optional absent string with no default still becomes empty per R1; this rule
  must remain distinguishable from a caller explicitly supplying an invalid value.
- UNKNOWN_VARIABLE is ignored with warning; UNKNOWN_FORMAT is skipped with
  warning. Preserve warnings even when errors exist; no accepted content gives
  EMPTY_CONTENT. Warnings are never printed into document content.
- Graphs have complete references, one parent, no cycles/orphans, unique IDs
  including inline IDs inside a fragment. Source IDs cannot contain `~`.
- Review escaped duplicate JSON keys, keys such as `__proto__`/`constructor`,
  aliases across defaults/invocations, wrong scope inside repeats, and tampered
  persisted prepared inputs. Tests below must exercise all five classes.

## Task B1 — Template schema, graph and registration checks

Files: create `src/template/types.ts`, `readTemplateJson.ts`,
`validateTemplate.ts`, `validateGraph.ts`, `validateSchemas.ts`;
`tests/template/validateTemplate.test.ts`, `tests/template/readTemplateJson.test.ts`;
`fixtures/srs-basic/template.json`. Extend `src/composition/resolvedDocument.ts`
and preserve strict text-only validation in `validateResolvedDocument.ts`.

Interfaces: `validateTemplate(input:unknown):Result<ValidatedTemplate>`;
internal duplicate-aware JSON reader returns Result<unknown>;
`validateGraph(fragment, context)` returns Issue[] with source paths.

- [ ] Write failing tests against the R1 example plus mutations: bad schema/default,
  unsupported field type, style/tag reference, duplicate ID, missing child, cycle,
  orphan, shared parent, unequal cells/columns, header reused as row template,
  nested repeat/format, item tag outside its repeat, non-string text tag target.
- [ ] Test raw duplicate format key and escaped equivalent key (`a`/`\u0061`),
  duplicate nested properties, malformed JSON and valid escaped string values.
  Use a token/structure-aware reader, never regex replacement of JSON. No eval.
- [ ] Run `npx vitest run tests/template` and observe meaningful failures.
- [ ] Implement strict R1 grammar and graph validation; record normalized defaults
  only after validation. Use own-property access and safe map construction for
  arbitrary declared keys. Object envelopes/items are distinct from field types.
- [ ] Keep example validation as the final registration step using B2's internal
  prepare operation; it must produce neither errors nor warnings and must match
  the template docKey/version. Do not create a recursive public validate loop.
- [ ] Run focused tests and build. B1 can remain uncommitted until B2 supplies the
  shared example check; do not claim complete template registration before then.

## Task B2 — Request validation, preparation and diagnostics

Files: create `src/data/types.ts`, `prepareGeneration.ts`, `validateValues.ts`,
`tests/data/prepareGeneration.test.ts`; extend `src/result.ts` and `src/index.ts`.
Create `fixtures/srs-basic/request.json` and test-only negative cases.

Interfaces: `prepareGeneration(template:ValidatedTemplate,input:unknown):
Result<PreparedInput>`. Add optional Issue fields expectedType/actualType and
action (`ignored`/`skipped`) while preserving existing P4 diagnostics.

- [ ] Write failing tests covering every R1 section 4 policy and unknown-format
  policy, including several missing keys at once, missing despite default,
  empty vs absent, null/wrong type, unknown plus missing required, wrong container
  with valid sibling, unknown-only/empty content and explicit identity mismatch.
- [ ] Assert actualType uses JSON type names and errors never echo invalid values.
  Assert paths/original indices, warnings accompanying errors, unchanged original
  input, unknown-variable removal and no mutable sharing of array/item defaults.
- [ ] Run `npx vitest run tests/data tests/template`; observe the expected failures.
- [ ] Implement one shared data walker used by prepare and example registration.
  Never use truthiness for presence. Validate item fields for each array index;
  arrays inside items and wrong typed known fields fail. Aggregate independent
  issues and warnings, never return ok:true with partial erroneous data.
- [ ] Store all resolved fields in the prepared snapshot. Test special object keys
  as normal declared/unknown data without prototype mutation. Validate normal
  examples through the same walker, treating any warning as registration failure.
- [ ] Run focused tests plus build, review B1/B2 coverage and commit passing work.

## Task B3 — Independent graph composition and row expansion

Files: create `src/binding/bindInlines.ts`, `expandRows.ts`,
`src/composition/composeDocument.ts`, `validatePreparedInput.ts`,
`tests/composition/composeDocument.test.ts`, `tests/binding/bindInlines.test.ts`.

Interface: `composeDocument(template:ValidatedTemplate,input:PreparedInput):
Result<ResolvedDocument>`. It returns the node union from B1 with no unresolved
tags, repeat instructions or row-template leftovers. Return prepared warnings.

- [ ] Write failing A/B/A tests: A text, B repeated table, A text with different
  data. Assert content order, exact bound text, unique IDs and no shared objects.
  Reorder caller content and confirm only output order/derived indices change.
- [ ] Test global/local/item same-named fields without scope leakage; item tags
  only use their row item. Test zero/one/many items and a row with multiple text
  children. Empty array keeps header only; template row and descendants disappear.
- [ ] Test newline/empty insertion alongside static text, preserved whitespace,
  generated inline IDs, source-map coverage for every output node/inline and original
  indices after a skipped unknown format. Frozen caller template/data stay intact.
- [ ] Test tampered template pin/fingerprint, missing prepared field, wrong type,
  duplicate/out-of-order accepted index and overlap with skipped indices. Reject
  malformed snapshots before producing a document; no repair/default fallback.
- [ ] Run `npx vitest run tests/binding tests/composition`; observe failures.
- [ ] Implement cloning with R1 IDs `content-<originalIndex>~<sourceId>`, repeated
  subtree suffix `~item-<index>`, generated inline suffix `~part-<index>`. Rewrite
  all row/cell/child references. Do not mutate node definitions or concatenate
  caller strings into executable template expressions.
- [ ] Compose, then validate resolved structural graph. Preserve book/styles and
  pinned template identity. Keep table capability rejection in PDF generation,
  while text-only compositions go through unchanged P4 engine semantics.
- [ ] Run build/focused tests, review diff and commit passing composition.

## Task B4 — Installed-package integration and closeout

Files: create `tests/consumer/checkBinding.mjs`,
`fixtures/binding-text/template.json`, `fixtures/binding-text/request.json`;
modify consumer Dockerfile/script, package exports/tests, README/AGENTS and versions.

- [ ] Bump the delivered prerelease to `0.1.0-dev.3`; keep dev.2 output unchanged.
  Consumer must import validateTemplate/prepareGeneration/composeDocument from the
  installed root package, never source files or a pre-bound replacement fixture.
- [ ] Validate raw SRS JSON, prepare A/B/A input and inspect table composition in
  the consumer. Verify the engine still returns LAYOUT_FAILED for that table graph;
  this result proves composition, not table PDF support.
- [ ] Use two creator-defined text-only formats for an A/B/A bound PDF. Include a
  global variable, repeated invocation with different local values, optional
  default, newline and unknown-variable warning. Use the original engine after
  compose. Also check a missing required input fails before engine invocation.
- [ ] Run `npm run build`, `npm test`, `npm run check:package`; require all affected
  areas and installed consumer to pass. Check the bound PDF's exact extracted
  text, embedded fonts and rendered pages; warnings must not appear in the PDF.
- [ ] Record tarball/version/checksum/image, graph assertions and PDF evidence.
  Review once across the whole slice and fix concrete acceptance defects.
- [ ] Commit passing code, update this plan and the R2 next-step link, and stop.
  No merge/push or MVP completion claim is implied. Next work is simple table
  layout and row continuation using the now-bound graph, before Service/DB work.

## B1–B4 execution and result — 2026-10-07

**PASS for this bounded binding/composition slice.** Owner authorized continuous
inline implementation in this conversation. Product Implementation Agent worked
in Core, then Documentation Synthesizer recorded this result. Execution IDs remain
not applicable. No separate WORK dispatch, shared map promotion or full MVP claim.

- Core branch: `codex/template-binding`, base
  `04d7a1e7ec985f0b0e8a87d038f95f80a35eb623`.
  Commits: `1f702a6` schema/data checks, `5ff0dec` composition,
  `3a99ec4` installed dev.3 integration and review repairs.
  Retained on that branch; no merge or push in this request.
- Public operations: `validateTemplate`, `prepareGeneration`, `composeDocument`.
  Template registration checks raw decoded duplicate keys, supported schemas,
  defaults, graph references/scopes/styles and examples; validated definitions
  are detached/frozen with deterministic fingerprints. Preparation applies the
  agreed missing/type/unknown policies. Composition accepts a validated persisted
  snapshot, expands independent fragments/rows and records complete source maps.
- Existing native/font/PDF algorithms unchanged. Shared book/style validation
  was extracted; textFlow explicitly narrows supported node types. Simple tables
  are composable but still return LAYOUT_FAILED at the PDF capability boundary.

### Acceptance coverage

| Criteria | Durable proof |
| --- | --- |
| Raw JSON, graph, schemas/defaults/examples, prototype keys | Core `tests/template/` and `tests/data/prepareGeneration.test.ts` |
| Presence/type/unknown policy, independent defaults, diagnostics | Core `tests/data/prepareGeneration.test.ts` |
| A/B/A order, zero/one/many rows, scopes, newlines, source maps | Core `tests/composition/composeDocument.test.ts`, `tests/binding/bindInlines.test.ts` |
| Persisted snapshot pin, completeness and index integrity | Core `tests/composition/composeDocument.test.ts` |
| Non-JSON arrays, deep JSON and no getter execution | Core `tests/data/jsonBoundary.test.ts` |
| Installed public APIs, actual binding to PDF, table rejection | Core `tests/consumer/checkBinding.mjs`, `scripts/checkPackedConsumer.mjs` |

Observed RED before implementation, then focused GREEN for B1/B2 and B3.
Final `npm run build` passed and `npm test` passed **111 tests in 13 files**.
`npm run check:package` passed on the repaired final candidate. Checks cover the
shared validation and existing layout/PDF consumers as well as the new binding.
No load/throughput benchmark or Service test was run or claimed.

One fresh-context read-only review found two P2 issues: sparse arrays with named
properties could produce an uncomposable prepared result, and deep ordinary JSON
could exhaust the recursive guard's stack. Three failing reproductions were
observed, then fixed with exact array-index validation and an iterative JSON
walk. Both public data boundaries now pass those tests; the complete suite and
installed consumer were rerun after the repair. No minor findings were reported.

### Installed artifact and PDF evidence

Final artifact directory in Core: `artifacts/1791387642523/`.

- Package: `@flowdoc/core@0.1.0-dev.3`, `flowdoc-core-0.1.0-dev.3.tgz`.
  SHA-256 `9b6fe96d205c3b51f1e9ad6940887e606836f95bd6a9f3c3676b3d4eadfd2e38`.
- Consumer image:
  `sha256:3ac74973855ca57ede4d1fe200f1a46f8f128377379f6f3e1a188edc90249bf0`.
  Linux/amd64, Node v24.21.0, pinned Python/fontTools; non-root execution with
  network disabled and no host source mounts. Final tar inventory: 68 entries,
  no source, tests, fixtures or scratch workspace shipped.
- `result.json`, `binding-result.json`, `host-checks.json`, `inventory.txt`,
  `consumer-package-lock.json`, `binding.prepared.json`, `srs.composed.json` retain
  package/runtime/graph evidence and inspectable output.
- `bound-text.pdf`: one page, 27575 bytes, SHA-256
  `70cc16b281c72a67196727a70b7439c60af4182cdc6500eefc2e8fb30f9878ec`.
  Generated from raw template + request through installed root APIs, not a
  pre-bound fixture. Contains global/local values, default and explicit newline
  in A/B/A order; unknown-variable warning remains outside document text.
- Host pdftotext matched the independent expected text exactly ignoring only
  whitespace; pdffonts showed the embedded subset font and Unicode mapping.
  Inspected the rendered page: expected Thai/English lines, no overlap or clipping.
  Final bytes exactly match the visually checked candidate in
  `artifacts/1791387452622/`, so those checks were reused after the guard repair.
  Rendered PNG, text and font reports are copied into the final artifact directory.
- P4 `four-styles.pdf` and `overflow.pdf` remain byte-identical to the previous
  dev.2 acceptance hashes. Existing font/render evidence remains applicable.
  Completed consumer containers were removed after output retrieval; dev.2
  artifacts and unrelated Docker state were preserved.

### Rulings and remaining scope

- Reviewer deferred independent Docker/PDF execution to the implementing room;
  this room performed installed, extracted-text, font and visual checks. No
  unverified substitution was accepted. Reuse is limited to identical PDF bytes.
- Table rendering, Service persistence and broad resource/load limits remain
  outside this slice as originally agreed. Cost of that boundary: a composed
  table is not yet an exportable table PDF, and this is not API/MVP readiness.
- Parsed-object registration cannot recover duplicate keys discarded upstream;
  future Service registration must call the raw-text boundary. Fingerprints and
  prepared validation detect structural mismatch, not malicious authenticated edits.
- **Next bounded work:** simple table layout/row continuation using the composed
  graph. Then Service/DB integration within the locked MVP. No frontend, DOCX,
  image processing or queue-capacity expansion was added here.
