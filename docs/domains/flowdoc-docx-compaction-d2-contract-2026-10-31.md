# FlowDoc DOCX compaction D2 design and implementation contract

Authority Boundary: Project Control canonical D2 design, owned by the Planning
Partner / Cross-Repo Boundary Reviewer. Status **REVISED PROPOSAL — MEMORY REVIEW; R1a STILL BLOCKED**,
not implementation authorization or runtime acceptance. Single-room execution
IDs are not applicable. Core owns prospective code; Service is a later consumer.
This document is the narrow authority for the D2 mechanism and R1 interfaces.
The queue/concurrency record retains status/history and D1 evidence authority.
The memory/lazy-serialization revision at the end supersedes the original
resource assumptions and formalizes the unchanged-bytes rule. The raw no-op
roundtrip is a retained R1a diagnostic, not a required production path.
This is proposed design only, not a successful retry or code change.

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
  production adapter. Node 24.15.0, Linux/amd64, pinned Node image from the Core
  Dockerfile. No DB, external network during execution, real-service access or
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
