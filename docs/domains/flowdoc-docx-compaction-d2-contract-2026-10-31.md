# FlowDoc DOCX compaction D2 design and implementation contract

Authority Boundary: Project Control canonical D2 design, owned by the Planning
Partner / Cross-Repo Boundary Reviewer. Status **LIVE CORE SPIKE FAILED WITH NODE HEAP OOM; COPY PROOF RETAINED; WORD PENDING**,
not Core implementation authorization or Core runtime acceptance. Single-room execution
IDs are not applicable. Core owns prospective code; Service is a later consumer.
This document is the narrow authority for the D2 mechanism and R1 interfaces.
The queue/concurrency record retains status/history and D1 evidence authority.
The memory/lazy-serialization revision at the end supersedes the original
resource assumptions and formalizes the unchanged-bytes rule. The raw no-op
roundtrip is a retained R1a diagnostic, not a required production path.
The production design remains proposed; later bounded copy experiments below
do not authorize a Core port or substitute for Core/Word acceptance.

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

## D2 snapshot before the authorized R1a attempt

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
No JSZip or sink mutation during planning. The original one-story-DOM assumption
is not an admission guarantee; the revision below requires measured headroom,
dirty-part serialization and a safe decision before expensive allocation.

After validation, apply the complete plan to the PRIVATE staging ZIP, then run
the existing final guard and final ZIP-byte check, then sink.write/commit with
the existing cancellation/abort contract. A mid-apply failure discards that
private ZIP; it does not promise an in-memory rollback, and no partial artifact
is published. A semantic/parse/serialization failure maps to existing
DOCX_SERIALIZATION_FAILED; cancellation stays DOCX_CANCELLED. Unsupported rules
leave bytes alone; if still too large the existing guard produces
DOCX_OUTPUT_BUDGET_EXCEEDED. No retry that silently relaxes a predicate/cap.
Sanitize diagnostics to part/rule/reason/hash, not complete document text.

## Original resource envelope and cancellation — not a safety guarantee

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

- [ ] **R1a adapter/dependency gate (blocked by the memory review below):**
  Once that prerequisite is resolved, tests/docx/packageXml.test.ts first, then
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

D2 was ready for review as a proposed mechanism/contract. The subsequent R1a
attempt below blocks adoption; the original design snapshot above is retained.
D1's Word batch-export/control
failures stay in its evidence; future proof uses isolated Word exports with real
file, pixel/text and complete navigation gates, not API return alone.

Unknown runtime/API/serializer incompatibility must return to this design; do
not substitute a regex engine, Python subprocess, broader sharing or raised
limits without review. D1 remains bounded evidence; MIX-01/R1/R2 are open.
Current document budget: this focused design, one status link in the existing
record and a read-only source/census ledger. No new Work/room/registry/map.
Read-only ledger: C:/Users/nekot/Documents/FlowDoc-recovery/docx-d2-20261031/design-evidence.json.

## R1a result — 2026-10-31: return to design before an adapter/Core port

Owner authorized isolated parser/package proof, preserving limits, and explicitly
required returning to design if it failed. The first phase was discovery because
resource feasibility can change the mechanism. **FAIL: the configured whole-part
DOM plus serializer path does not meet the current 512 MiB / 1 CPU default-Node
lab gate for the actual raw SRS part.** No adapter, dependency, lockfile, rule
engine or writer changes were made in Core; R1a is not complete and R1b/R2 did
not start. No package candidate was promoted or installed.

Evidence/reproduction:

- Exact standalone @xmldom/xmldom 0.9.12 in a private lab npm project; registry
  integrity/lock and MIT file retained. Pure dependency feasibility, not the
  production adapter. Linux/amd64, pinned Node image from the Core Dockerfile;
  the previously stated Linux Node minor was not captured in that failure trace
  (see the runtime-metadata correction below). No DB, external network during
  execution, real-service access or
  output-budget change. Existing explicit XML1.0 normalization/prolog handling
  and requireWellFormed serializer options were used.
- Windows broad probe: 100 raw UAT/SRS XML/rels parts passed independent Python
  XML1.0 semantic digest comparisons before AND after serialization. Five
  synthetic cases passed; numeric-CR text was deliberately not serialized.
  One initial namespace oracle mismatch was a Python minidom representation:
  the xmlns="" attribute value is None there, empty string in xmldom. Preserve
  the initial artifacts; normalize only that oracle representation to the XML
  empty-string value, then the namespace case passes. This is NOT a demonstrated
  xmldom namespace defect. Windows peak RSS was 864,840 KiB without a container
  memory limit; it is not a minimum required-memory claim.
- The initial 512 MiB / 1 CPU Linux sequence aborted with JavaScript heap OOM.
  A fresh container with ONLY srs:word/document.xml reproduced the failure:
  input 5,183,340 bytes, parse and independent digest comparison completed,
  then serialization never completed. Trace: heap limit 271,581,184 bytes;
  after parse RSS 322,703,360 and heap used 257,192,688 bytes. Fatal log says
  Reached heap limit / JavaScript heap out of memory; container exit 139 and
  OOMKilled=false. This is a Node/V8 heap exhaustion under the stated limits,
  not evidence that the kernel killed the container or that 512 MiB physical
  RAM can never suffice with another design. No heap flag/resource increase
  was used to turn the failure green.
- This was an unchanged/raw-part roundtrip feasibility probe, NOT the planned
  compaction engine or generateDocxTo. It does not prove that serializing a
  successfully reduced <=49,000-node package would OOM, or that the current
  unchanged Core crashes. A reduced DOM may have a different peak. The design
  must now state and prove how unchanged, still-over-budget and rewritten paths
  avoid this demonstrated raw-serialization failure before adoption.
- Baseline-only Core build/native/resources and DOCX tests on Linux pass
  239/239 at 2 GiB / 2 CPU. Windows baseline had 14 failures/24 skips before any
  dependency changes because the Linux-only metric helper was not prepared;
  the Linux run resolves that platform prerequisite without product fixes.
  These are unchanged-Core results, not new-parser packed-consumer proof.

Stop decision and next design review:

1. The proposed byte/node eligibility envelope admits the failing SRS input;
   it does not bound actual DOM/serializer heap. Do not adopt it as a safety
   guarantee or wire this path into a request process: synchronous OOM cannot
   be recovered by the planned JS catch/abort contract.
2. Review a way to bound BOTH parsing and serialization working memory before
   implementing R1a's adapter. Candidates for review are an audited bounded
   serializer and/or smaller-subtree/streaming processing with complete
   namespace and inheritance coverage. No replacement is selected or coded
   here. An existing input guard fallback remains safe rejection, but does not
   prove the full SRS <=49,000 goal. Merely reducing this private envelope is
   insufficient to close that goal.
   Also review serializing only a successfully reduced DOM: unchanged parts
   retain their original bytes; a still-over-budget plan can reject before
   allocating a raw serialization. This must include parse/transform working
   memory and real-Core headroom, not infer safety from the smaller final ZIP.
3. Do not silently raise Node heap/container resources, public XML/drawing/ZIP
   limits, add a worker/subprocess or replace the mechanism with broad regex.
   Any revised mechanism needs a reviewed D2 change and this same-case resource
   proof before adapter implementation/package adoption resumes.
4. Remaining R1a strict-rejection/envelope/cancellation, NodeNext adapter and
   new-parser packed-consumer gates are **unverified/deferred by this blocker**.
   No full UAT/SRS new-Core normalization or native Word claim follows.

Retained scripts, independent oracle, initial/corrected outputs, exact lockfile,
container state/limits and logs:
C:/Users/nekot/Documents/FlowDoc-recovery/docx-r1a-20261031/.

## D2 memory and lazy-serialization revision — proposed 2026-10-31

Authority: owner-authorized review only, Planning Partner / Cross-Repo Boundary
Reviewer and Project Control Steward. Single-room IDs not applicable; routine
risk, medium design scope. Product ownership remains Core; Service is a later
consumer. No new runtime proof, install, lab execution or product edits in this
review. Proof budget: existing R1a trace/source inspection and documentation
checks. Document budget: this contract and a status pointer in the queue record.
Use the current host model; no dispatch/model switch or new Work/registry/map.

### Decision and alternatives

Recommend a **decision-first, dirty-part-only pipeline** as the next hypothesis
to prove. Unchanged bytes must bypass serialization; a proven over-budget result
must reject without serializing it. A rewritten part serializes only after the
complete rule plan and package count allow it. This preserves atomic validation
and the old final guard. It does NOT yet approve a large-part whole-DOM parser.

Two mechanisms remain alternatives for the blocking large-part case: an audited
bounded serializer/transform over a reduced DOM, or bounded subtree/streaming
processing with complete namespace/style coverage. The latter changes the
mechanism more substantially and needs a separate reviewed design before any
replacement parser/serializer is selected. Keep the proposed exact dependency
selection provisional; no automatic new library, worker or Python fallback.

### What the previous failure establishes

The fresh SRS-only trace reached about 245 MiB heap after parsing against about
259 MiB allowed heap, leaving about 14 MiB at that instant. RSS was about
308 MiB inside a 512 MiB container. These are different budgets. Unused container
RAM does not automatically increase V8's heap limit. Skipping serialization
addresses its allocation peak, not the already expensive raw parse or space
needed by Core's real generation objects. A raw no-op roundtrip is therefore a
retained diagnostic failure, not the required production path or proof that a
compacted DOM cannot work. R1a stays blocked pending that distinction's proof.

Do not infer a safe input ceiling by scaling this one measurement. The former
8 MiB/250,000-node envelope admits the failure and is only a coarse input screen.
No new numerical safe DOM threshold or RSS reserve is declared from static
inspection; both require measurements with Core's existing working set.

### Required branches before publishing any replacement

| Condition | Required action | New normalizer serialization |
| --- | --- | --- |
| Under the effective budget after current compaction, or non-source layout | Bypass the new stage; retain existing writer behavior | None |
| No proven owned edits / all eligible families are disabled | Return original part bytes and unchanged/ineligible result | None |
| Unsupported XML, unknown ownership or inadequate working-memory proof | Decline optimization; retain original bytes; existing guard decides | None |
| Complete plan proves post-transform total still above budget | Discard the speculative plan; original over-budget package follows existing budget failure | None |
| Post-transform count is unknown or straddles the cap | Do not guess that it fits; return ineligible for this first slice | None |
| Proven candidate fits the effective package budget and its memory envelope is validated | Transform/serialize only dirty parts, validate overlay, then old final guard | Dirty parts only |

This concerns only the NEW optimizer. It does not skip existing Packer,
source-layout serialization, font corrections, or required final ZIP generation.
An unchanged optimizer result also does not imply the writer has no prior changes.
The writer still regenerates ZIP bytes whenever its existing conditions require
it. Existing normal native/under-budget behavior must stay unchanged.

Establishing "no edits" must use provenance and a validated semantic edit ledger,
not serialize-then-compare, speculative XML cleanup or a global DOM hash that
already incurred the allocation. A family may not turn defaults on before
discovering that a dependent story is unsupported. A later change in one part
must invalidate all affected style/graph/equivalence summaries before approval.
If determining eligibility itself requires an unproved large DOM, refuse that
path until a bounded read/transform method is proved; lazy serialization alone
does not authorize parsing it.

### Count and transaction contract

Add private preflight decision metadata, not a public option/receipt. CountProof
is exact(value), interval(lower,upper) or unknown; bounds must be nonnegative
integer counts and validated against the immutable snapshot/edit ledger. An
unbounded upper end cannot establish a fit. DirtyParts and disabled-family
reasons come from the complete plan. An exact value above the effective cap,
or a sound lower bound above it, proves rejection. Only exact <= cap or a sound
upper bound <= cap can proceed to the memory gate. Unknown/overlapping intervals
are ineligible in this first slice; safe rejection is not fixture acceptance.

Counts must cover ALL XML/rels parts, inserted style/property nodes, removed
footer parts and relationship/content-type edits, with overlapping edits counted
once. Use the existing writer counter's definition, not just DOM element count.
An optimistic estimate or partial ledger cannot authorize serialization. The
actual unchanged final guard remains authoritative after serialization, including
drawings, relationships and final ZIP bytes; no public error/cap change.

Only actual validated structural mutations mark a part dirty. No-op setters,
an aborted family and edits reverted to the original XML structure do not
justify rewriting it. This does not mean original effective formatting must
change: valid compaction changes structure while preserving that formatting.
Preserve original bytes/hash for clean and unsupported parts.
For dirty parts, compare protected content/effective formatting against the
INTENDED edit ledger, not whole-document identity that would reject valid edits.
Reparse serialized replacements and verify the complete overlaid package graph.
Only then apply to private ZIP and execute the old final guard/sink contract.
No partial style-family application or publication if any replacement fails.

### Working-set contract to prove, not an implemented memory monitor

Measure separate peaks for existing Core preparation, census/preflight, parse,
transform, serialization, replacement reparse, overlay validation and final ZIP.
Account for the original packed buffer/JSZip data, decoded strings, DOM, genuine
intent/font/native-helper state, summaries/edit metadata, pending replacement
bytes and compression buffers. UTF-8 bytes on disk are not a JS heap bound.
Container memory includes helpers and buffers outside the Node heap.

Keep summaries plain and bounded; they must not retain DOM nodes, ownerDocument,
detached-node arrays, old traversals or full-story text copies. Do not hold an
original and replacement DOM simultaneously for equivalence: keep a compact
validated summary, release strong references, and validate the replacement in
its own scope. Sequential scopes do not promise immediate garbage collection;
measure the actual peak without forced-GC rescue. Replacement buffers retained
for atomic application and style summaries still count across parts.

Neither polling process.memoryUsage nor catching an allocation error prevents
fatal synchronous OOM. Do not use either as the safety proof. The allocation
shape and measured admission envelope must be bounded BEFORE risky work. If
raw parse/transform is not feasible with existing Core state, a serialization
bypass cannot close the gate: return to mechanism design.

Acceptance environment stays 512 MiB / 1 CPU, swap capped to the same memory
amount, default Node heap/options and the pinned Linux/amd64 image. Record heap
limit/options and container limits so an accidental heap/RAM increase cannot
turn the test green. No new concurrency/readiness promise follows from a single
generation; Service behavior and concurrent resource contention remain R2 scope.

### Bounded next proof proposal — not executed in this review

1. **Decision/bypass:** instrument parser/serializer/allocation boundaries on
   immutable lab copies. Prove early unchanged/ineligible cases return byte-
   identical original parts with zero new serialization, and zero DOM parsing
   where the preflight can decide. Also test a no-op discovered after a safe
   parse: it must not serialize, but its parse cost remains in the resource result.
2. **Over-budget and counts:** prove exact/interval/unknown branch decisions,
   all-part overhead, shared-footer and inserted-style counts, overlapping edits
   and compensation rollback. A still-over-budget plan must not serialize or
   publish; the existing error remains DOCX_OUTPUT_BUDGET_EXCEEDED. Unknown
   memory/formatting/count eligibility must decline before expensive work.
3. **Changed bounded part:** use frozen D1 reduced copies and small owned edits
   to isolate transform/serialization/reparse memory and independent XML1.0
   equivalence. This is not proof that raw full Core input can be transformed.
   Keep strict namespace/Unicode/CR-safe-skip negative cases from R1a.
4. **Actual raw-to-reduced feasibility:** only after reviewing a bounded method,
   replay frozen UAT/SRS source JSON to reproduce the raw generation state;
   baseline DOCX files are comparison artifacts, not public Core API inputs.
   Prove raw generation -> complete planned reduction -> dirty serialization under
   512 MiB including Core's real retained state, with cancellation/failure and
   final ZIP peaks. Both unchanged and negative paths must survive too. A smaller
   output file, a standalone parser success or a conservative rejection is not
   acceptance of full SRS <=49,000 with preserved content/formatting.

Stop on OOM, unbounded retention, invalid count/equivalence or an unsafe bypass;
do not increase limits or proceed to package adoption/R1b. No numbered step above
is PASS or execution authorization. After memory feasibility, the remaining
R1a adapter/NodeNext/packed-consumer prerequisites and R1b/R1c fidelity tests still
apply. D1 evidence and the R1a failure remain immutable. Current status is a
reviewable revision with the large raw parse/transform method unresolved.

## Oracle/OCI bypass proof — 2026-10-31: bounded PASS, not R1a closure

Owner authorized copy-only proof of unchanged and still-over-budget paths, with
Oracle lab preferred if available. Discovery spike only; original Core/Service
candidates are read-only. Single-room IDs not applicable. Node image was already
present on the existing OCI x86_64 host. A fresh labeled lab directory and three
separate containers were used: intentional RED, GREEN and unchanged GREEN repeat.
No DB, production API/storage, deployment or real-service lifecycle action.

Acceptance environment: Linux/amd64, actual Node **24.21.0**, default heap limit
271,581,184 bytes, no NODE_OPTIONS, 512 MiB memory AND total memory/swap, 1 CPU,
network none, input mount read-only. GREEN and repeat each pass **10/10**, zero
skips and no OOM. Measured whole-container cgroup memory peaks are **138.72 MiB**
and **138.37 MiB**, including the test runner. These are prototype measurements,
not a Core generation memory envelope. No heap/RAM/output-limit increase.

| Actual frozen-copy case | Observed branch and guard | DOM parse / XML serialize / sink publication |
| --- | --- | --- |
| UAT reduced baseline, 39,191 nodes | Unchanged output is byte-identical; ZIP CRC and all XML/rels hashes independently match | 0 / 0 / 1 lab copy |
| Raw SRS, 182,250 nodes, no edits | Unchanged bytes still encounter original budget rejection | 0 / 0 / 0 |
| Raw SRS plus 383 attested empty rect-adjustment deletions | Projected total 181,867, still above 50,000; plan discarded before applying/serializing; original guard gives DOCX_OUTPUT_BUDGET_EXCEEDED | 0 / 0 / 0 |
| Raw UAT, 110,767 nodes, no edits | Original budget rejection, not fixture-specific SRS handling | 0 / 0 / 0 |

The 10-case suite additionally checks a forged count, overlapping edits, stale
snapshot, unknown-count fallback, live instrumentation using a tiny real XML
parse/serialize control, and original-input/output-directory integrity. Only the
unchanged UAT file exists in each output directory; no rejected-work artifact.
Traps fail the selected branches if either instrumented DOM entrypoint is called.
The tiny control observes two parses and one serialize, proving counters are live;
it is not full changed-document resource/fidelity acceptance.

The final XML/drawing/relationship guard block is extracted byte-preservingly
from current Core src/docx/writer.ts, hash-pinned, and executed externally with
default options. This is not the complete writer/generateDocxTo or a new Core
package. No public exports, dependencies, options, limits or product source
changed. All original copy hashes match; real runtime identities before/after
match and the lab has zero owned running containers after completion.

Limits of acceptance, retained explicitly:

- The experiment uses an independently attested, snapshot-bound IR prepared
  OUTSIDE the constrained runtime. Python validates namespace/rect/empty-leaf
  predicates on the frozen copies; the runtime rechecks hashes, literal spans,
  nonoverlap and exact all-part count deltas. Only this D1 leaf family is active;
  width/styles/defaults/footer families are disabled. This does not prove full
  production ownership/planning inside 512 MiB, or that full SRS cannot fit.
- Interval proofs, inserted-style/shared-footer count interactions, no-op
  discovery after a real large parse, cancellation, raw-to-reduced transformation,
  reparse/final-ZIP Core peaks and packed-consumer/fidelity gates are still
  unverified. The previous large-DOM OOM remains a blocker; these zero-parser
  paths do not resolve its working-memory requirement.
- Runtime metadata correction: this OCI execution directly reports Node 24.21.0.
  The old Windows probe explicitly reported 24.15.0, whereas the old Linux fatal
  trace did not record its actual minor. The earlier Linux 24.15.0 narrative was
  an unsupported inference and is corrected to unverified. Keep the old traces
  immutable; do not claim version identity or an OOM fix from this bypass proof.
- Failed setup attempts are retained: wrong baseline copy locator corrected
  before test execution; guard hash mismatch due to Windows newline conversion
  corrected by preserving source bytes. Neither is a product defect. The
  intentional RED used an unimplemented placeholder and failed as expected.

Proof budget is consumed: RED -> GREEN -> unchanged repeat plus independent
hash/CRC/resource/boundary verification. Stop here. Next proposed work remains
bounded real plan/transform memory proof before adopting an adapter or package;
R1a/R1b/R1c/R2 and full SRS <=49,000 acceptance remain open.

Local immutable-input experiment/scripts/logs/oracles:
C:/Users/nekot/Documents/FlowDoc-recovery/docx-bypass-20261031/.
Verification: verification.json; raw OCI receipt/logs and round-specific files
under oracle/. Report:
C:/Users/nekot/.codex/visualizations/2026/10/27/01a17da5-b6ab-7ff0-a66c-e46d7e2cf42d/flowdoc-oracle-docx-bypass-20261031/verification-report.html.

## 2026-11-01 — Online Node copy planning and reduction: bounded PASS

Authority Boundary: owner-authorized discovery spike on immutable UAT/SRS copies
in Oracle/OCI. Evidence Reviewer / lab experiment owner, then Project Control
Steward for this status. Single-room IDs not applicable; routine risk, medium
scope. Core remains the implementation owner and is unchanged; no product
package, dependency or Service changes, real-data/API/SQL/storage access,
real-service stop, push/release/install. No new Work/registry/map.

Unlike the bypass experiment, this run uploads NO prepared edit plan. The Node
prototype derives style inheritance, width/cell defaults, paragraph/run
compensation, table/default/conditional alignment, inactive grid properties,
drawing candidates, section-scoped footer pairs and complete graph/count plans
from raw XML while inside the constrained container. The source-band metadata
is original template provenance, not a list of edits/count deltas. Frozen hashes
and source/native section reconciliation gate reuse; both distinct first/default
relationship IDs/types and explicit references remain present.

The implementation is experimental JavaScript outside all product repositories,
using the same @xmldom/xmldom0.9.12. Python is NOT a planner/transform fallback;
it only independently checks the produced files afterwards, outside the measured
runtime. Original inputs were the raw packages with110767/182250nodes, not D1
pre-reduced copies. No automatic parser/serializer replacement or worker added.

| Fixture | Original total XML/rels nodes | Final total | Reserve below50,000 | Final cgroup peak |
| --- | --- | --- | --- | --- |
| UAT |110,767|36,631|13,369|281.32MiB |
| SRS |182,250|48,817|1,183|340.77MiB |

SRS meets the<=49,000 fixture target (183nodes below that target). Actual final
guard results:190/383drawings, default10,000 cap; ZIP bytes2,967,654/792,939,
default32MiB cap. Predicted complete counts equal the exact extracted unchanged
Core final scanner's counts. All memory limits remain512MiB total memory/swap,
1CPU, Node24.21.0/default heap271,581,184bytes and no NODE_OPTIONS; network none,
read-only input mount. No OOM/skip/resource tuning. Property tests pass4/4.

Memory method and evidence limits:

1. Build compact style/paragraph summaries and an actual base plan in-process.
   Private working DOMs may change, but the ZIP/input snapshot and sink do not.
2. Replay against raw parts to complete the full default/table/drawing/footer
   plan; keep plain facts/digests, not a retained whole-package DOM. Count added
   styles, changed relationships/content types and removed parts before output.
3. Only after the entire plan meets the original budget/fixture goal, replay
   deterministically, serialize retained changed parts and reparse EVERY
   replacement (including styles.xml). Apply the complete validated overlay to
   the private ZIP, run the unchanged guard, generate and byte-check the ZIP,
   then publish the lab candidate. No forced-GC rescue or raised heap.

The preliminary base gate reached39,473/58,587nodes without serialization. It
was not accepted as full reduction. Completing row false no-ops/empty-container
cleanup and the remaining recipe produced the totals above. Retained first
full-run results were followed by a new full run after review added the missing
styles replacement reparse. Only that final revision is the accepted experiment.
All stages and source archives are retained; no source/data history is erased.

Independent XML1.0 verification on the final artifacts passes all38 original
story parts (7UAT/31SRS), mapping removed footers to their retained same-section
counterparts:4,463paragraph cascades,21,205runs/marks and2,524cells. It checks
protected content/structure/CS/sections/grid/spans/merges, run/paragraph style
inheritance including toggles, conditional table alignment, cell width/margins/
borders, original styles except permitted no-ops/default flag, unchanged
docDefaults and non-story resources, CRC and internal relationships. Original
hashes match; production runtime identity before/after matches and zero owned
lab containers remain running. The validator initially rejected ZIP directory
entries added by JSZip; the correction excludes directory metadata only, never
an OPC document part. That setup rejection is retained, not a product defect.

This closes ONLY the online copy-planner/reduction feasibility gap for these
two frozen fixtures under512MiB. It does not establish a universal safe input
envelope, actual Core/generateDocxTo working-set headroom (intent/layout/fonts/
native helpers were NOT loaded), cancellation/concurrency/growth behavior,
TypeScript adapter/packed consumer/Service compatibility, or native Word
pagination/edit/navigation fidelity for these new candidates. R1a is not closed;
R1b/R1c/R2 and production acceptance remain open. The old raw no-op serialization
OOM is retained; success here depends on reducing before serialization, not on
proving raw whole-part roundtrip safe. Next proof must combine real Core state
and native Word validation before adopting the method.

Proof budget consumed: base gate, complete recipe run, corrected final run for
the missing validation prerequisite, independent artifact/format-model checks.
Stop without further runtime changes. Scripts/packets/telemetry/candidates:
C:/Users/nekot/Documents/FlowDoc-recovery/docx-liveplan-20261031/.
Accepted result: verification.json; oracle-full/ is final; oracle-prefix/ and
oracle-full-attempt1/ are retained preliminary results. Report:
C:/Users/nekot/.codex/visualizations/2026/10/27/01a17da5-b6ab-7ff0-a66c-e46d7e2cf42d/flowdoc-oracle-liveplan-20261101/verification-report.html.

## 2026-11-01 — Real Core retained-state spike: FAIL, stopped at first OOM

Authority Boundary: owner-authorized single-room discovery/verification of the
copy reducer with real Core in the isolated Oracle/OCI VM Docker lab at512MiB,
then native Word comparison only if a new valid candidate exists. Evidence
Reviewer / lab owner; Project Control Steward for status. IDs N/A, medium scope,
routine risk. No Core/Service source/package edits, dependency installation,
real-data/DB/API/storage access, real-service stop, push/release/install. This is
not Oracle Database engine testing or a Service API test.

Unchanged pinned Core0.5.2 SHA256:
ed876f4d011ad943ead937307af9123581c231124cab198de34f60b832f6a532,
matching the current Service vendor artifact. Every packed dist file is checked
against it before execution. Core3e74f98 and Servicea572025 remain clean and all
Core source hashes match the initial snapshot. Existing runtime image106a0c8 is
reused, not rebuilt/installed. Actual Node24.21.0, V8 heap271581184bytes(259MiB),
no NODE_OPTIONS,512MiB memory AND total memory/swap,1CPU, network none, readonly
inputs/rootfs, scoped lab output/temp. No resource/limit increase.

An external dependency-resolution wrapper redirects ONLY writer.js's
source-layout-xml import. It reexports the unchanged implementation, calls
original serializeSourceLayout and existing container/style compactors, then
the experimental reducer on that SAME live ZIP before returning to the
unchanged writer/final guard. No Core files/public options are patched. The real
public path is normalizeTaskInput -> composeTaskDocument -> createDocxEngine ->
generateDocxTo, including native layout/metric helpers, font/image resources and
retained writer intent/built state. This is test-only wiring, not an adopted
TypeScript adapter or packed consumer of a new Core version.

| Case | Observed result | Exit | Cgroup peak |
| --- | --- | --- | --- |
| UAT default rejection control |110767raw XML/rels nodes; original50000guard rejects;0sink chunks,1abort |0|364.99MiB |
| SRS default rejection control |182250raw nodes; original guard rejects;0sink chunks,1abort |0|361.82MiB |
| UAT live reduction |Node fatal heap exhaustion after document.xml parse/width planning |134|431.48MiB |
| SRS live reduction |NOT RUN: stop at first actual OOM |N/A|N/A |
| Native Word comparison |NOT RUN: no completed live-Core reduced candidate |N/A|N/A |

The UAT reducer starts with heapUsed102863560bytes(98.10MiB); the last event
after parse/width planning records heapUsed254428320bytes(242.64MiB),
RSS493617152bytes, followed by fatal Node heap out of memory. Docker reports
OOMKilled=false: this is a V8/native Node abort, not a Docker kernel kill; that
flag does not negate the fatal trace. No complete plan, reduced serialization,
final candidate/receipt or Core sink publication. Raw diagnostic ZIP counts/CRC
are independently checked. Successful baseline processes verify all Core dist
files unchanged after their expected rejection controls. Input hashes match,
real runtime metadata identity is stable and zero owned lab containers run.

Measurement limitation: the wrapper creates an EXTRA raw diagnostic ZIP before
reduction while the Core stack remains live, for an exact same-run Word
baseline. The harness also retains fixture payload/template/prepared-image
buffers instead of the full Service reader/spool lifecycle. Failure is CONFIRMED
for this instrumented process. It does not prove every512MiB Core design fails,
isolate all retained-memory ownership or establish a production Service crash.
The prior standalone copy PASS remains valid only within its original scope.

Setup rejections are retained: wrong historical artifact locator (local
prerequisite), sharp entrypoint, Windows path separators, UUID image-adapter
contract, section-scoped SRS assetKey resolution and bundled-font inventory.
Only harness prerequisites were corrected. Final default controls pass before
live reduction. After actual OOM there is NO retry, resource/cap tuning,
forced-GC rescue or older candidate substitution. Prepared Word scripts were
not executed. R1a remains failed/open; R1b/R1c/R2, TypeScript/package/Service,
cancellation/concurrency and new-candidate Word fidelity remain unverified.

Return to D2 memory/lifetime review: avoid overlapping raw XML DOM with retained
Core section/packer/source-layout state; separate diagnostic ZIP capture and
harness-owned buffers before a new authorized proof. Preserve necessary
source/layout/font/image state and verify lifecycle correctness. Word needs a
valid same-run reduced candidate first. No product implementation authorization
is implied. Proof budget consumed: corrected prerequisites, both default
controls, first live-reduction OOM, raw-package/integrity/boundary validation.

Evidence/scripts/immutable packets/setup attempts/logs/receipts:
C:/Users/nekot/Documents/FlowDoc-recovery/docx-core-live-20261101/.
Final remote project:flowdoc-corelive-8f5368b0def0; result:verification.json.
Report:
C:/Users/nekot/.codex/visualizations/2026/10/27/01a17da5-b6ab-7ff0-a66c-e46d7e2cf42d/flowdoc-oracle-core-live-20261101/verification-report.html.

## 2026-11-01 — Memory ownership and diagnostic ZIP review: complete, causal proof open

Authority Boundary: owner requested review BEFORE another experiment. Inline
Evidence Reviewer / Planning Partner, then Project Control Steward; IDs N/A,
routine risk. This section reviews existing sealed Oracle evidence and unchanged
implementation; it does NOT authorize a harness repair, product port or runtime
retry. No Oracle/SSH/container/Word execution this review, no Core/Service edits,
real-data access/service stop, push/release/install. The lab contract remains
512MiB memory AND total memory/swap,1CPU, default Node heap and unchanged
50000XML/10000drawings/32MiB caps, SRS target<=49000.

Observed heapUsed from the existing UAT logs (MiB, NOT retained-owner sizes):

| Checkpoint | Standalone copy | Live Core with wrapper | Difference |
| --- | --- | --- | --- |
| Base planning starts |15.51|98.10|82.59 |
| Raw document DOM parsed |155.70|241.53|85.83 |
| Width planning ends |156.27|242.64|86.38 |

Both logs report Node24.21.0 and V8 heap259MiB. After width planning, only about
16.36MiB remains below that heap limit in the failed process; container512MiB is
not a512MiB JavaScript heap. The observed parse-stage increases are140.19/143.43
MiB, including allocation/collection effects, not exact DOM retained sizes. The
same fixture node counts and document.xml byte lengths match across runs
(UAT3526613/SRS5183340bytes), but their document.xml hashes differ. These are
distinct workloads, NOT a controlled diagnostic-ZIP A/B comparison. Do not
attribute the82.59MiB starting difference to ZIP alone.

Ownership/lifetime traced from implementation (Core paths at3e74f98; lab paths
below refer to the sealed docx-core-live-20261101 payload):

| Layer / evidence | What overlaps at the reduction boundary | Review conclusion |
| --- | --- | --- |
| Lab worker.mjs:11-21,32 | Raw payload/template, asset lookup maps; a refs Map owns prepared image Buffers and provider.open closes over it | Explicit harness references; reachable-byte totals unmeasured. normalized is already reset at17, so do not claim the normalized string is deliberately retained. |
| Core src/docx/engine.ts:134-176; profile.ts:435-444 | Pinned document, image preparation, preflight capsule, cloned intent document/texts/tables; intentOrigins maps live intent to preflight, capsules maps that live preflight to owned resources/document | WeakMap does not free the associated values while their keys remain live. Validation/ownership snapshots cannot be removed to obtain a pass. |
| Core writer.ts:115-135,186-236; sections.ts return value | Native built.sections/footnotes plus receipt data; packed bytes and loaded JSZip; intent and source-layout guides are used again for receipts after reduction | Code reference paths support overlapping native/package/XML lifetimes. Exact heap ownership still requires runtime reachability evidence; lexical scope alone is not a retained-size measurement. |
| Lab source-wrapper.mjs:18-20 | An extra generateAsync nodebuffer/DEFLATE runs before reduceLive; raw diagnostic ZIP is3020331bytes(2.88MiB) | Confirmed extra work, not a2.88MiB heap-cost estimate or a proven memory leak. |
| Lab reduce-live.mjs:8-12; planner.mjs:48-69 | Part census, raw XML string and full DOM; table margin/border planning allocates arrays/plain property trees/JSON signatures after the width checkpoint | The last successful checkpoint is width planning; no cell-defaults-complete event. Exact failing allocation/owner is unverified. |
| Lab reduce-live.mjs:40-46; worker.mjs:32-34 | Replacement strings, reparse/final ZIP and output chunk accumulation would create later peaks | NOT causes of this observed failure: these stages/sink writes were never reached. They remain later acceptance concerns. |

ZIP review against the archived JSZip3.10.2 implementation:

- lib/object.js:369 calls StreamHelper.accumulate; stream/StreamHelper.js:81-103
  collects chunks and Buffer.concat creates the completed output. Default
  streamFiles=false(object.js:320), so generate/ZipFileWorker.js also buffers
  the current entry while constructing headers. Compression, chunks, XML data
  and the final Buffer can overlap transiently; file size is not the peak.
- StreamHelper clears its chunk array at end; GenericWorker.cleanUp clears
  listener state and DataWorker.cleanUp sets data=null. The wrapper diagnostic
  local Buffer loses its explicit reference when that function returns. This
  is evidence AGAINST asserting a permanent diagnostic-Buffer leak from code
  alone. The old comment "released here" means scope completion, not proof of
  immediate GC or RSS/heap reclamation. No before/after diagnostic checkpoint or
  heap ownership sample exists, so its exact contribution remains UNVERIFIED.
- ZipObject._data retains its original string/promise or CompressedObject;
  generateAsync does not replace it with the newly generated diagnostic ZIP.
  CompressedObject.compressedContent can reference slices of the original
  packed Buffer(NodeBufferReader.js:13-16). Clearing only writer bytes would
  not guarantee release of aliased backing storage. Do not add overlapping
  Buffer/slice lengths as if they were distinct allocations.
- process.memoryUsage arrayBuffers is included in external; neither may be
  added again to RSS as unique ownership. Cgroup peak/RSS/heapUsed have different
  accounting. Docker OOMKilled=false remains compatible with fatal V8 heap OOM.

Recommended NEXT proof, not performed or authorized by this review:

1. Change ONLY the lab reduced-case diagnostic ZIP generation to metadata-only,
   keeping Core/intent/native sections/font/image ownership and all other
   harness state unchanged. Add scalar checkpoints immediately before/after
   that boundary and before DOM parse. First UAT only, same sealed inputs,
   default heap and512MiB/1CPU container/caps; no forced GC/heap snapshot or tuning.
   Do not simultaneously scope away fixture objects, spool images or add new
   raw-part capture: that would confound this hypothesis. If OOM, stop and return
   to review; if PASS, that establishes only the tested no-diagnostic variant.
2. Fixture/setup lifetime cleanup and a file-backed prepared-image provider are
   separate later variables if justified. Existing Service render-child.ts
   closes its reader/task at143-145 and spools prepared bytes at77-83, opening
   file-backed image chunks at236-239. Reuse those lifecycle semantics in a lab
   harness; do not delete Core snapshots/resources or assume unchanged results.
3. Only after memory feasibility, evaluate bounded SAME-RUN raw-part capture
   separately. Save one part at a time with hashes/counts, reconstruct the
   diagnostic baseline ZIP outside the measured process, then independently
   verify every XML/rels/resource, CRC and relationship. This avoids a second
   full ZIP build in the critical path but introduces I/O/part-buffer overhead
   that must itself pass the same cap. Old baselines cannot silently replace
   this evidence. Final guard/byte caps/receipt and Word prerequisites remain.

Confirmed: extra ZIP work and overlapping reference paths; prior instrumented
OOM. Probable: overlapping Core/native state plus DOM limits headroom. Unverified:
per-owner retained bytes, diagnostic ZIP causal share, no-ZIP UAT/SRS runtime
and Word fidelity. No fix/512MiB runtime PASS is claimed. R1a/R1b/R1c/R2 remain
open. Source/archive/input hashes and current Core/Service clean HEADs rechecked.
Offline census/review output and reproducible analysis:
C:/Users/nekot/Documents/FlowDoc-recovery/docx-core-live-20261101/memory-review/review.json
and analyze.py in that directory. The prior failure packet/report stays immutable.

## 2026-11-01 — UAT with wrapper diagnostic ZIP disabled: FAIL, stopped at OOM

Authority Boundary: owner authorized ONLY the proposed UAT no-diagnostic-ZIP
experiment at512MiB, keeping all other state/caps and stopping at OOM. Inline
Evidence Reviewer / lab owner, then Project Control Steward; IDs N/A, routine
risk. Isolated Oracle/OCI VM Docker; no Oracle Database/Service API test, product
edit, real-data/DB/API/storage access, real-service stop, push/release/install.

The old sealed347-file runtime payload is copied to a fresh lab directory.
Hash comparison finds ONLY source-wrapper.mjs changed: diagnostic() is no longer
called, scalar before/after boundary logs are added, and comments/metadata state
that capture is disabled. The unused diagnostic function stays identical. No
replacement ZIP/raw-part capture, fixture lifetime cleanup or image spooling.
worker/reducer/planner/advanced/loader/dependencies/inputs remain byte-identical.
The same pinned runtime image106a0c8 and Core artifact SHAed876f4 are used; Core
dist hashes are checked by the unchanged worker before generation. Current
Core3e74f98/Servicea572025 remain clean and all Core source/input hashes match.

Exactly ONE UAT reduced container ran. Actual Node24.21.0/default V8 heap259MiB,
no NODE_OPTIONS,512MiB memory AND total memory/swap,1CPU, network none, readonly
rootfs/inputs and the original64MiB temp mount. The XML/drawing/ZIP caps remain
50000/10000/32MiB. Logs show both diagnostic-boundary flags=false, hook metadata
extraDiagnosticZip=false, and output contains ONLY hook.json and cgroup-peak.txt:
no raw.docx, complete plan, reduced candidate, receipt or sink publication.

| UAT checkpoint / result | Prior diagnostic ZIP enabled | This no-ZIP run |
| --- | --- | --- |
| Base planning starts, heapUsed MiB |98.10|99.17 |
| Raw document DOM parsed, heapUsed MiB |241.53|238.91 |
| Width planning ends, heapUsed MiB |242.64|238.92 |
| Cgroup peak MiB |431.48|428.33 |
| Result |Fatal Node heap OOM, exit134|Fatal Node heap OOM, exit134 |

The new census is110767XML/rels nodes, matching the prior UAT insertion stage.
Last completed checkpoint is document.xml width planning; no cell-defaults-
complete event. V8 reports ineffective mark-compacts / JavaScript heap out of
memory. Docker OOMKilled=false: native Node abort, not a kernel OOM kill. The
controller stops after this sole case; zero owned lab containers remain running.
Real runtime identity metadata before/after is unchanged. No retry, GC/heap/RAM/
swap/cap tuning, SRS/Word execution or additional repair followed the OOM.

Confirmed conclusion: removing this extra ZIP step ALONE did not make the
tested UAT/Core/reducer harness fit. It is not sufficient within the unchanged
limits. Do not treat the3.15MiB cgroup peak difference as the exact ZIP cost:
these are single runs with different allocation/GC timing and added scalar
checkpoints. This does not prove zero ZIP overhead, identify all retained-memory
owners, prove every512MiB Core design impossible or establish a production
Service crash. R1a/R1b/R1c/R2, SRS and Word remain open; no old copy substituted.
Return to memory-lifetime review before another authorized experiment or port.

Independent verification checks source/result archives, the one-file delta,
all fixture hashes, container limits/state, fatal trace, skipped-capture logs,
absent output, unchanged Core/Service source/HEAD and runtime metadata. The one
Python command-string quoting error while preparing transport was local-only,
before remote execution; the script-based preparation corrected it. There was
no failed runtime setup or runtime retry in this round. Proof budget consumed.
Evidence/scripts/packet/diff/logs/receipts:
C:/Users/nekot/Documents/FlowDoc-recovery/docx-core-nozip-20261101/verification.json.
Remote project:flowdoc-nozip-826212ad4c63. Report:
C:/Users/nekot/.codex/visualizations/2026/10/27/01a17da5-b6ab-7ff0-a66c-e46d7e2cf42d/flowdoc-oracle-uat-nozip-20261101/verification-report.html.
