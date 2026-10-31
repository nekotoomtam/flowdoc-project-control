# FlowDoc DOCX compaction D2 design and implementation contract

Authority Boundary: Project Control canonical D2 design, owned by the Planning
Partner / Cross-Repo Boundary Reviewer. Status **PROPOSED — READY FOR REVIEW**,
not implementation authorization or runtime acceptance. Single-room execution
IDs are not applicable. Core owns prospective code; Service is a later consumer.
This document is the narrow authority for the D2 mechanism and R1 interfaces.
The queue/concurrency record retains status/history and D1 evidence authority.

**Goal:** turn the proven full-document copy recipe into a private Core stage,
preserving the default 50,000 XML / 10,000 drawing / 32 MiB limits and obtaining
SRS fixture output <= 49,000 with complete content and native Word fidelity.
**Architecture:** a strict namespace-aware XML adapter, a package-local style
planner and an atomic private-package patch plan, followed by the existing final
guard and staged sink. No new public options, receipt fields or plugin pins.
**Stack:** current TypeScript/NodeNext, Node >=24.15.0 <25, docx 9.13.0 and
JSZip 3.10.2, with a proposed direct runtime dependency @xmldom/xmldom 0.9.12.
**Spec:** [bounded plan and D1 result](flowdoc-task-queue-concurrency-plan-2026-10-20.md),
especially the D1 result at its end, and the linked immutable D1 report.
For future implementation use the executing-plans workflow in the authorized
room; no separate-agent dispatch or execution starts from this draft.

## Verified basis and current authorization

- Core base3e74f98b8a14cefea4dd147644318ea3108999b1 and Service base
  a572025b80fe932add664ca0b529633a3a091545 are clean and unchanged.
- D1 applies AFTER width/styles/defaults compaction. Its starting copies were
  UAT39191 and SRS49965 nodes. Drawing/footer rules alone do NOT make raw Core
  output fit: the raw rejected packages are110767/182250 nodes respectively.
- D1 combined copies reached38736/48701; SRS reserve1299. All five variants
  matched870 native Word page pairs;28 memory footer operations and two SRS
  save/reopen controls passed. This is copy evidence, not new Core execution.
- This D2 turn performs source/official-document inspection and local read-only
  XML census only. No dependency installed, selected runtime parser executed, DOCX rewritten,
  Oracle connection, Word launch, Core/Service edit, real-data access, service
  stop, push/release/install. R1/R2 remain unstarted.

## Mechanism decision and alternatives

**Recommend pinning @xmldom/xmldom to exactly 0.9.12 as a direct runtime dependency
when implementation is authorized.** Its tagged manifest declares MIT, bundled
TypeScript types, Node>=14.6 and no runtime dependencies. These declarations
fit the Core toolchain in principle; ESM/NodeNext import, build, runtime and
packed-consumer compatibility remain mandatory unrun gates. Do not vendor it,
use an unscoped xmldom package, float a semver range or install it this round.

This version is listed as patched for GHSA-965w-775f-mr7g, the namespace-memory
issue affecting earlier0.9 releases. Recheck official advisories/integrity at an
implementation start; a version change requires explicit design revision.
This selection is not a claim that the package has no remaining defects.

Alternatives considered: SAX plus byte-span patches retains lexical spelling
but needs a separate mutation/serializer and namespace machinery for stylesheet
moves; it is unnecessary complexity for this recipe. The inspected saxes repo
is archived. Python/minidom is the experiment oracle, not a new production
subprocess dependency. Broad regex XML rewriting is not the new rule engine.
Existing source-layout compaction stays in place initially; no unrelated rewrite.

Primary sources inspected, not a runtime dependency test:
[tagged manifest](https://raw.githubusercontent.com/xmldom/xmldom/0.9.12/package.json),
[MIT terms](https://raw.githubusercontent.com/xmldom/xmldom/0.9.12/LICENSE),
[typed API](https://raw.githubusercontent.com/xmldom/xmldom/0.9.12/index.d.ts),
[parser](https://raw.githubusercontent.com/xmldom/xmldom/0.9.12/lib/dom-parser.js),
[serializer](https://raw.githubusercontent.com/xmldom/xmldom/0.9.12/lib/dom.js),
[security advisory](https://github.com/xmldom/xmldom/security/advisories/GHSA-965w-775f-mr7g),
[SAX alternative](https://github.com/lddubeau/saxes).

## XML adapter contract

- Input is Core-generated XML1.0/UTF-8 from the private staging package only,
  not uploaded/arbitrary DOCX. Decode UTF-8 fatally; never replace invalid bytes.
  Capture an allowed UTF-8 BOM/XML1.0 declaration separately, validate and
  preserve that prolog, parse the remaining document, then restore it once.
  Do not feed an XML declaration back as a reserved xml processing instruction
  to the well-formed serializer. Unsupported declarations/encodings are ineligible.
- Parse application/xml with locator:false and onError throwing on EVERY
  warning/error/fatal error. Never use HTML recovery, deprecated errorHandler
  or private domHandler overrides. Reject DTD/entity declarations conservatively
  before parsing; never resolve external entities, access files or use network.
- Override the library's XML1.1-style line-end normalization with XML1.0-only
  CRLF/CR normalization. Preserve U+0085/U+2028/U+2029, Thai/combining characters,
  non-BMP text, whitespace and xml:space. Numeric/entity spelling may change;
  decoded text/attribute values and XML meaning may not.
- Serializer uses requireWellFormed:true, no pretty printing or HTML mode.
  This option is NOT a complete namespace/schema validator. Explicitly validate
  single root, attribute uniqueness, namespace bindings and supported node kinds.
  Use namespaceURI+localName and createElementNS/setAttributeNS, never prefix
  matching or unqualified w: attributes. Preserve prefixes/declarations used by
  mc:Ignorable/Requires and other QName-valued attributes; no global rebinding.
- Tagged serializer code emits text CR literally. First slice therefore leaves
  parts containing parsed CR text/CDATA unrevised, rather than risk changing
  a numeric CR reference into normalized LF. Opaque/unsupported constructs are
  not repaired. If any story part is ineligible, disable every global-default
  rule family that would affect it; do not merely skip the part after changing
  its inherited default elsewhere. The two frozen raw fixtures contain no
  parsed CR or Unicode line separators; synthetic preservation tests are required.
- Reparse every replacement and compare the protected XML/content model, text
  and attribute values plus effective formatting before accepting its edit
  ledger. Unchanged or ineligible parts retain EXACT original bytes. Preserve
  comments/processing instructions; features not safely round-trippable disable
  the affected family. No generic string escaping/replacement after serialization.

## Scope, ownership and pipeline

1. Keep current buildSections, Packer, ending-area/font correction, source-layout
   serialization and existing container/style sharing order. Recount the actual
   package after those stages; the old expanded variable must not be reused as
   the new decision count. New compaction is eligible only for still-over-budget
   Core source-layout output. Under-budget and non-source native paths stay on
   their existing byte path. Preserve existing nondefault WriteOptions semantics;
   never use expanded options to qualify full fixtures.
2. Gather a PRIVATE ownership context from this generation. Source serializer
   registration and existing source-style compaction return generated style IDs
   internally; a prefix such as fdc/fdp/fdx is not ownership by itself. Packer
   Normal/TOC metadata is read through known generation facts; unknown definitions
   stay opaque. No public receipt or src/index.ts export change.
3. buildSections additionally returns private provenance per EMITTED section:
   native ordinal, source section ID/index, band scope/identity and effective
   mode. It currently omits invisible sections. Never match final sectPr using
   the original source-array index. Reconcile native section boundaries/count
   and policies against provenance; ambiguity disables footer reuse.
4. Allow mutation only of owned document/styles/header/footer/story parts and
   narrowly required relationship/content-type entries. Fonts/media, numbering,
   custom XML, settings, metadata and unknown parts are unchanged. Global style
   changes require complete coverage of every affected paragraph story, including
   nested anchors and known note/separator parts; unsupported numbering/bidi or
   opaque inheritance disables the family, not its compensations alone.
5. Port the combined-copy base recipe first: exact fixed-grid width deduplication;
   identical cell margins/borders; scoped paragraph/run defaults with compensation;
   legal shared table properties; freeze implicit Normal before changing default;
   known style-only false-toggle no-ops; inactive run-level snapping and optional
   generated metadata. Do not move/elide direct CS, position/kern/spacing or
   authored run/span/field boundaries. Do not guess unknown font/style values.
   Table conditional alignment excludes ANY horizontal gridSpan>1 and unknown
   row-grid/bidi context. A partially eligible global style family is not applied.
   Seed the style registry with EVERY existing ID: reuse only identical owned
   definitions, allocate deterministic fresh IDs for different/opaque collisions,
   and never overwrite an authored definition. Validate uniqueness and all
   basedOn/next/link references; unresolved inheritance disables that family.
   Inserted properties follow OOXML child order checked against D1 particle
   expectations; preserve untouched child order.
6. Then port D1's narrow inline zero-extent/no-effects and empty rect-adjustment
   rules. Unknown effects/custom/adjusted geometry remain untouched. Footer reuse
   requires same emitted section, same authored band in mode all OR that section's
   explicit-empty placeholders, exact XML equality and absent/empty sidecars.
   Keep BOTH DISTINCT relationship IDs and explicit first/default references;
   redirect only Target, never infer linkage from equal bytes or share across
   sections. Retain the default part deterministically. Delete first part, its
   empty rels and matching override only after a complete reverse-reference
   graph proves no other consumer. Never remove a reference and activate inheritance.
7. Run the full validated rule set, not a greedy stop just below50000. Count added
   definitions/parts as well as savings; stable ordering/IDs, no global caches.
   The benchmark48701 is not a production byte/count promise: actual Core output
   must independently meet<=49000 with all overhead and current fidelity.
   No rule branches on fixture names, docKey values or the frozen content hashes.

## Private plan and publication contract

Proposed internal interfaces, not implemented or exported API:

```ts
planCoreDocxCompaction(parts: PackageSnapshot, context: CompactionContext):
  Promise<XmlCompactionPlan>;
// XmlCompactionPlan: status (ineligible | unchanged | ready),
// replacements {part, expectedBeforeSha256, bytes}[],
// removals {part, expectedBeforeSha256}[], per-rule reason/count ledger,
// before/after counts and ownership/equivalence validation evidence.
```

PackageSnapshot contains sorted part names and an async read(part) returning
owned bytes. CompactionContext contains xmlBudget, optional signal, generated
style-ID set and emitted-section provenance. Each section fact contains native
ordinal, source section ID/index, effective footer mode, qualified band scope/
identity and explicit-empty status; absence of a fact never grants ownership.
SourceSerializationInfo is the proposed private replacement for the serializer's
boolean return: changed plus generatedStyleIds. Writer retains a local boolean
from changed; existing compactSourceWordStyles also reports its added IDs.
None of these types enters the public receipt or root exports.

PackageSnapshot is a read-only view of the writer-owned entries; new buffers
must not alias/mutate original bytes. Context contains private provenance,
existing effective budget and AbortSignal, with no caller-configurable new knobs.
The planner builds a part overlay and validates hashes, namespace/text/protected
structure, effective known formatting and the complete relationship/type graph.
No JSZip or sink mutation during planning; at most one working DOM per large
story plus compact style metadata, not duplicate DOMs for the whole package.

After validation, apply the complete plan to the PRIVATE staging ZIP, then run
the existing final guard and final ZIP-byte check, then sink.write/commit with
the existing cancellation/abort contract. A mid-apply failure discards that
private ZIP; it does not promise an in-memory rollback, and no partial artifact
is published. A semantic/parse/serialization failure maps to existing
DOCX_SERIALIZATION_FAILED; cancellation stays DOCX_CANCELLED. Unsupported rules
leave bytes alone; if still too large the existing guard produces
DOCX_OUTPUT_BUDGET_EXCEEDED. No retry that silently relaxes a predicate/cap.
Sanitize diagnostics to part/rule/reason/hash, not complete document text.

## Resource envelope and cancellation

Proposed PRIVATE eligibility envelope: <=256XML/rels parts,16MiB total decoded
XML,8MiB largest part,250000elements; iterative post-parse traversal depth<=128
and<=64attributes/element before serialization. Pre-count with the existing
conservative element census and byte bounds before allocating DOMs. Unsupported
envelopes disable the optimizer; this is not a new public admission ceiling.
The stage only enters on an already-over-budget path, so the unchanged guard
remains decisive. An otherwise accepted under-budget document is not reparsed.

Raw UAT/SRS read-only census:26/74XML parts,3.68/5.43MB decoded, largest parts
3.53/5.18MB,110767/182250elements, max depth17/16, max attributes9. These fit the
proposal on paper only. Node RSS/time/cancellation performance is NOT measured.
Check AbortSignal between parts/rules and before/after parse, serialize and apply.
Synchronous parsing cannot guarantee immediate mid-parse cancellation. Measure
in the existing512MiB/1CPU lab; OOM, excessive blocking or cancellation failure
is a blocker requiring design review, not a silent worker/process addition.

## File ownership and implementation sequence

- New private src/docx/package-xml.ts: adapter/namespace/roundtrip/envelope checks.
- New private src/docx/package-style-compaction.ts: effective property resolution,
  defaults/style registry and all-or-nothing family compensation.
- New private src/docx/package-compaction.ts: patch overlay, rule order, D1
  drawing/footer rules and graph validation. No general DOCX optimizer API.
- Modify writer.ts only for stage wiring; source-layout-xml.ts for private style
  provenance; sections.ts for private emitted-section/band provenance. Layout,
  public receipts, numbering and sink behavior remain their existing owners.
- Future package.json/lockfile: exact runtime pin/integrity/license review.
  README/template-guide adjustments only for the implemented local contract,
  with their repository Authority Boundary. No Service/plugin/pin changes.

- [ ] **R1a adapter/dependency gate:** tests/docx/packageXml.test.ts first, then
  NodeNext build/import and Node24/Linux packed consumer. Test UTF-8/BOM/prolog,
  alternate/default prefixes, namespace collisions/mc bindings, entities/Thai/
  non-BMP/Unicode line separators, numeric CR safe skip, comments/PI/CDATA,
  invalid declarations/DTD/duplicate attrs/malformed XML and envelope boundaries.
  Compare the adapter's supported roundtrips against independent XML1.0/D1
  oracle expectations, not only two calls to the same parser. If an adapter
  guarantee fails, revise D2 before porting the rule engine.
- [ ] **R1b recipe gate:** tests/docx/packageCompaction.test.ts and existing
  nativeRunBudget/sourceShapeStyles/sectionAssembly/writer tests. Verify declared
  edit sets and protected/effective property equivalence, unknown safe skips,
  omitted-section mapping, owned/opaque ID collisions, defaults/cycles/toggles,
  merged/bidi exclusion,
  nonempty footer sidecars, reverse references, distinct first/default IDs,
  idempotence, deterministic parallel runs, cancellation and abort with zero
  publication. Build failing tests before implementing each bounded family.
- [ ] **R1c full proof:** npm test -- tests/docx; npm run build;
  npm run check:package after required prerequisites. Replay the frozen full
  UAT/SRS source JSON that produced the raw baseline packages through public
  generateDocxTo(default options), not edited D1 DOCX copies as inputs.
  Acceptance UAT<=39191, SRS<=49000, all-part counts/relationships,
  original content and native Word equivalence; actual safe overhead is counted.
  Exercise declared growth input and genuinely over-budget rejection, RSS/time/
  cancellation. External licensed/private full fixtures stay in the lab, not
  npm artifacts or ordinary unit tests that silently skip missing private data.
- [ ] **R2 consumer gate:** separate authorized fresh OCI Service lab with exact
  packed Core hash, actual fetched files/task-delivery-output evidence and
  reservations. No production rollout or automatic repository integration.

## Review status and limits

D2 is ready for review as a proposed mechanism/contract. No parser installation,
smoke test, TypeScript build, runtime resource proof or Core port occurred.
Those are R1 gates, not hidden PASS results. D1's Word batch-export/control
failures stay in its evidence; future proof uses isolated Word exports with real
file, pixel/text and complete navigation gates, not API return alone.

Unknown runtime/API/serializer incompatibility must return to this design; do
not substitute a regex engine, Python subprocess, broader sharing or raised
limits without review. D1 remains bounded evidence; MIX-01/R1/R2 are open.
Current document budget: this focused design, one status link in the existing
record and a read-only source/census ledger. No new Work/room/registry/map.
Read-only ledger: C:/Users/nekot/Documents/FlowDoc-recovery/docx-d2-20261031/design-evidence.json.
