# Core inter-stage handoff — proposed data contract v1

Authority Boundary: Project Control canonical PROPOSED cross-repository contract.
Core owns emission, proof/fact schemas, format semantics and receipts; Service
owns trusted execution bindings, allocation, file grants, fencing and publication.
Status: CONTRACT FOR REVIEW; NOT A CORE API OR IMPLEMENTATION ACCEPTANCE.
The dated copy-only codec proof below verifies its test matrix, not full Core
schema/producer closure or adoption readiness.
Governed by [generic stage/resource design](flowdoc-document-stage-resource-design-2026-11-01.md).

## Scope, decisions and evidence budget

Owner 2026-11-01 requests complete Core data-dependency review before product
edits. Keep 512 MiB PER WORKER/BUNDLE and all current policy/output/source caps.
No Core/Service/C1 edit, Oracle connection/workload, real data/service stop or
push/release/install. Cross-Repo Boundary Reviewer / Planning Partner, then PC
Steward; inline Work/Phase/Checklist IDs N/A. Medium design, routine read-only
risk. Proof budget: owner-code/field closure, prior-lab size counterexample,
static contract checks and PC document validation. No generation/OOM rerun.
Document budget: this reusable contract, one link in the existing generic
design, and local source/closure inventory. No new map or execution registry.

Evidence bases: Core 3e74f98, Service a572025; C1 is the unchanged dirty two-file
candidate, NOT accepted main. Source locators below are relative to those owner
roots. This contract defines what must survive, not proof that serialization,
the producer or the consumer already meets 512 MiB.

Recommendation: finish all genuine-intent-dependent work in the producer;
transfer a sealed generated package and Core-owned fact/provenance streams.
Do not serialize ExportIntent/Preflight, duplicate the source/font/shaper graph
in the consumer or reconstruct WeakMaps. Reconstructing that state would need
fresh genuine preflight and repeat heavy work; a JSON flag cannot replace it.

Terminology: split writer receipt, engine artifact, Service transport receipt,
emission facts, optimization provenance and final validation. These proposed
internal terms do not add public task/job states or promote product truth.

## 1. Exact cut and responsibility

The DOCX cut is AFTER native packing, ending-area/font corrections, source
layout serialization and applied-source coverage, but BEFORE the proposed
bounded general XML optimization/final package guards. All remaining writer
receipt calculations depending on intent/document/styles/tables/private state
must have immutable equivalents available before producer exit. Do not move
the cut to C1 prepareNativePackage: C1 still needs intent later.

Producer success is only `emitted`, never `generated/succeeded/sent`. Consumer
uses a NEW versioned Core generated-package capability, not writeDocx(JSON).
It must not need source document, native constructors, glyph arrays, parsed
font objects, runtime sessions, image callbacks or original resource bytes.
If any are still required, the cut is NOT valid and cannot be enabled.

Producer finishes generated digit/TOC glyph checks, image verification, font/
license identity checks, section/reading/compound-stroke decisions, embedding,
ending-area rewrite and font-table correction. serializeSourceLayout can adjust
guide frames and marks applied guides: freeze its receipts/provenance AFTER
serialization succeeds, not merely after measurements were prepared.

Service alone accepts the sealed checkpoint after current binding validation,
file close/hash verification and producer/descendant reaping. One worker grant
continues across stages. A sealed checkpoint is private staging, not a call to
DocxSink.commit or publication into document_outputs. No transaction spans it.

## 2. Descriptor and sealed artifact graph

The following is the proposed v1 logical envelope; wire identifiers are ASCII,
not source/business IDs. Unknown/missing fields, duplicates and wrong types
fail; no coercion, unsigned wrap, fallback or caller-selected version downgrade.

| Field | Required shape / validation |
| --- | --- |
| contract | Literal `flowdoc-core-stage/1`; stage API capability negotiated against exact package build |
| stage | `docx-emitted`, `docx-processed`, `docx-validated`, or `pdf-emitted` / `pdf-validated`; format-specific discriminant |
| producer | Package SHA256, package version (≤128), capability ID (≤64). Tokens use ASCII letters/digits/dot/underscore/plus/hyphen only. Package version alone is insufficient: candidate builds can share a version |
| executionDigest | Host-issued opaque execution binding SHA256; binds task/job attempt/runtime/output/input/template/resources/policy/options. No raw DB lease, path or client-supplied genuine flag |
| acceptedInputDigest | Host frozen-input digest; preserve its actual algorithm/encoding via contract binding |
| sourceDigest | Existing Core intent sourceDigest for DOCX. It hashes Core's renderer-owned snapshot, which the engine may quantize; NEVER substitute acceptedInputDigest. PDF has no equivalent current public field: use an explicitly separate host input binding |
| resourceManifestDigest / policyDigest / optionsDigest | SHA256 references to the exact parent-authorized identities/options/policy, not permission for the worker to change them |
| sequence / predecessorDigest | Positive safe-integer monotonic sequence and expected preceding sealed descriptor digest; first predecessor is the host accepted-input manifest, not an arbitrary zero digest |
| packageRef / factsRef / provenanceRef | Exactly three role-bound references: opaque key≤128 ASCII letters/digits/underscore/hyphen, byteLength positive safe integer, SHA256 64 lower-hex. No caller path, URL, inline ZIP or array of arbitrary blobs. PDF provenanceRef identifies the explicit identity/no-optimization record |

Control frame maximum 4096 bytes: 4-byte unsigned big-endian payload length,
at most 4092 UTF-8 payload bytes and exactly one completion frame. Reject extra
or trailing bytes before acceptance. Descriptor uses
only fixed fields/three bounded references, never receipt arrays or business
names. This chooses the prior LAB framing bound for the new internal contract,
not an existing public input limit. Its worst-case encoding and real transport
must be checked before implementation acceptance. The descriptor digest is
computed over exact bytes; it is held in trusted parent state outside worker-
writable files and passed to the next owned channel. No self-signed manifest.

Facts and provenance files have a format/schema version, role, execution/source/
resource/options binding, original producer sequence/predecessor and declared
counts in their headers. packageRef stays RAW DOCX ZIP/PDF bytes: its binding
is in the sealed descriptor/catalog, never an injected header, wrapper or new
package part. Every file's bytes/hash/counts must match the sealed reference.
Catalog/index
roots identify every chunk and its order/count; there is no unbounded entry
list in the control frame. A chunked stream with a missing tail/end-count is
incomplete even when every available chunk hashes correctly. Package and fact
streams cannot be swapped between attempts, stages or formats.

Immutable emission facts reused by later descriptors keep their ORIGINAL
producer header/sequence and original trusted lineage. Validate them against
the parent-retained prior descriptor/catalog, not by retagging the file to a
new stage. New processed provenance deltas have the new stage header and link
the original facts/catalog. The current completion sequence still advances
exactly once; artifact reuse is not permission to accept stale completion.

Input/resource/options manifests remain host-authorized. Emitted resource
identities and prepared variants are derived facts bound to those authorized
input bytes and the host-sealed derivative ledger; they cannot replace original
font/license/input pins. Host execution context owns the current cancellation,
original absolute deadline and file/read grants. A fresh stage receives scoped
readers and the current abort channel, not a serialized AbortSignal, raw lease
or reset full processing timeout.

The frozen options manifest records the call surface as well as effective
values and own-property presence. Low-level WriteOptions contains profile,
signal,maxOutputBytes,maxPackageNodes,maxXmlNodes,maxImageReferences; engine
DocxOptions contains signal,maxBytes,maxXmlNodes,textLayout; PDF streaming
contains signal,maxBytes. Store signal presence only; the host owns the live
signal. Preserve provided profile and its limits versus default profile, every
smaller caller budget, explicit/absent textLayout and actual source/native
capability selection. Hash-pin helper/package/runtime identities through the
authorized resource/launch manifests, never serialize executable paths as a
consumer capability. Direct low-level writer and resource-owning engine remain
different entrypoints; do not apply engine size adaptations to a direct writer.

Seal after all writes, observed close/fsync and directory/rename semantics
supported by the host IO adapter. Retain a parent-owned immutable handle or
enforce exclusive immutable ownership until consumer verification completes.
Check actual EOF, byte ceiling, file identity/type/link policy and digest while
streaming; fstat followed by unrestricted readFile is insufficient against
concurrent growth. Consumer validates independently before acting; parent-only
rejection in the 28-case lab is not consumer-negative coverage.

No cross-restart resume in v1: loss of trusted parent expectation causes fenced
interruption/reconciliation, not discovery-and-resume from arbitrary files.

## 3. DOCX facts — every current receipt dependency

Two current Core APIs must remain distinguishable. Low-level DocxReceipt
(writer.ts:33-54) and DocxArtifact(engine.ts:31-39,187-188) are different shapes.
Service projectArtifactReceipt intentionally projects a THIRD small shape.
None is a substitute for the others or an authoritative resume manifest.

### 3.1 Writer reconstruction recipe

| Final DocxReceipt field | Origin to freeze before exit / consumer action |
| --- | --- |
| mediaType | Exact DOCX literal, checked against frozen format |
| sha256 / bytes | NOT producer's intermediate ZIP values: consumer streams final bytes and recomputes both |
| sourceDigest / profileId | Genuine preflight/intent values; keep existing digest semantics and profile ID |
| fieldRefresh / wordVerified / buffered | Preserve required / false / true disclosures; do not infer Word validation or unbuffered compatibility from new orchestration |
| resources | Exact ordered intent.resourceIdentities: font identity/nativeFamily/release/weight/style/hash/licenseSha256/full embedding; image id/hash/kind/dimensions/rgbaSha256 where present. No parsed font methods or resource Buffers |
| autoFormats | Exact intent.document.formatInstances ?? [], including order and existing nested values; do not regenerate from template names |
| sections | Exact ordered buildSections receipts, including omitted/included distinctions. Preserve all geometry/numbering/header/footer/table decisions, not only section IDs |
| bookmarks | Exact built.anchors ordered source/name mapping; no renaming after producer exit |
| numbering | leadingExcludedSections from buildSections and fieldDigitEnvelope computed while intent/source still exists |
| adaptations | Ordered recipe below; no deduplication/sorting/truncation, estimates do not become measured truth |

Section facts include sectionId,role,sourceKind,numbering (including visibility/
nativeStart presence),header/footer band receipts,sourceMarginTwips,
reservedMarginTwips,nativeMarginTwips,estimatedMaximumMarginTwips,
capacityByPageType,maximumBandReservation,bodyHeightBasis,bodyHeightPt,
structuralScopeParagraphs,tableSpaces,tableSeparators,wordPaginationVerified.
Band facts preserve mode/sourceMode,reservedHeightTwips,offsetTwips,spacePolicy,
shape,fallbackReason,gapTwips,wordFootprintVerified,quantization,
nativeDistanceTwips,emptySpace. Preserve optional presence, not just values.

TableSpaceReceipt preserves nodeId,scope,cellBorderPolicy,policy,reason,
horizontalPolicy,verticalOffsetPolicy,baselinePolicy,baselineMatchVerified,
terminalStrokeCompensationPt and ordered cells. Every cell keeps nodeId,
sourceTopPt/sourceBottomPt, source/native top/bottom/left/right Twips and
paragraphBeforeTwips/paragraphAfterTwips. The native Table/Paragraph/Run objects,
reading plan and source measurements used to reach those decisions do NOT cross.

### 3.2 Adaptation order is part of compatibility

Freeze these ordered recipe segments from the current writer (writer.ts:186-233;
C1 writer.ts:202-249). For each family preserve every current variant/property,
including reason,scope/path/node/section identities, source/native values,
policy, error/delta, estimated and verification flags. The pinned Core producer
owns these schemas; `unknown[]` in a current TypeScript receipt is not permission
for callers to inject arbitrary wire objects.

1. endingAreas; baselineReceipts (baseline decisions, Thai boundaries, pair
   spacing); sourceLayoutReceipts (applied counts/lines, map path and ordered
   fallbacks); empty-section-omission; table-space-policy.
2. Per intent table: group-label-native-merge, column-grid-quantization in current
   table/group/column order; keep column paths so scalar traversal skips them.
3. Per style: native-weight-family and minimum-line-quantization, current order.
4. scalar-quantization from the exact current document traversal; preserve source
   length/unit/path and rounding, not just a numeric total.
5. Section header/footer quantization in current order; maximum-band-reservation.
6. source-reading-measurement summary, including its false Word-verification flag.
7. Reserved consumer slot for expanded-xml-budget ONLY when maxXmlNodes was
   explicitly present. Consumer supplies final actualNodes; configured limits
   and sourceNodeLimit come from frozen options, not worker preference.
8. rule-thickness-quantization; per-section empty-footer/header policies and
   native-visible-header-space OR maximum-header-space-fallback, current order.

Do not invent a new public compaction adaptation to advertise success. Internal
optimization lineage belongs in provenance unless a later API change approves
new public diagnostics. A provenance transform may update references only by
explicit validated aliases; it cannot silently falsify the frozen receipt.

### 3.3 Engine, Result and Service projection

- Engine adds sizeAdaptations BEFORE writer adaptations; optional docx-text-layout
  sits between them only when textLayout was explicitly supplied. Record option
  presence as well as effective value: absent versus explicit native/source,
  and absent versus explicit maxXmlNodes=50000 are observable distinctions.
- Engine DocxArtifact has mediaType,byteLength,sha256,pageCount=null,
  fieldRefresh=required,wordVerified=false,buffered=true,adaptations. byteLength
  maps final writer.bytes; do not drop sizeAdaptations or leak writer-only fields.
- Preserve the entire ordered Result warnings, and on failure ordered issues/
  warnings with every current Issue field (result.ts:1-3), including structured
  format omissions and source/group/section/content attribution. No filesystem
  paths/native exception bodies in Service-facing diagnostics.
- Service retains its own warning filtering, counts/first100 projection and
  completeness/finding summaries (render-child.ts:252-258). Core does not own
  their DB acknowledgements. Parent keeps that Service state/fence outside Core
  facts; do not replay finding writes or reset omission counts between stages.
- Service small receipt remains byteLength,sha256,pageCount,mediaType and DOCX
  disclosures (artifact.ts:10-24). It neither carries full Core diagnostics nor
  proves producer facts are complete. Keep all three projections explicit.

## 4. Optimization provenance — separate from public receipts

The producer derives the following from its actual successful emission and
the generated package. No bands.json, external fixture maps, template IDs or
client-supplied tags establish authority. Stream large maps into bounded disk
indexes; unknown ownership means preserve unchanged or fail a required transform.

| Record family | Required identity / information |
| --- | --- |
| Package inventory | Canonical confined part name, content type, byte hash/length and ownership class; every .xml AND .rels included; complete relationship graph/targets/modes and incoming users. Include protected media/fonts/custom parts |
| Applied source paragraph | Source scope/node, source text digest, exact emitted tag/control identity, story part, source-map part and sourceDigest, fragment/line/word/shape mapping. Cross-check customXml/flowdoc-paragraphs.xml and its rel/content type, exact applied coverage/uniqueness |
| Native or protected content | Explicit native/no-source ownership and preserve policy; absence of an applied tag never grants edit permission |
| Section/band mapping | Source section identity and included emitted ordinal, raw sectPr location, header/footer variant default/first/even, requested/effective mode, explicit target/rId or inherited-from-section or no band; emitted part hash, source binding and every incoming use |
| Generated drawing identity | Story part plus local identity/context, owner/scope and original graph references; distinguish generated VML source shapes, native drawings and protected content. No counter copied from a WeakMap |
| Table/style context | Actual grids/spans/inheritance contexts and generated style ownership needed by safe rules. Large global defaults/census/indexes may be DERIVED afresh from the sealed package, not copied as a full DOM |

Current buildSections receipts alone do not identify actual ZIP part/rId
ownership. Producer must reconcile emitted section order with real sectPr and
relationships, including omitted sections and previous-section inheritance;
fail ambiguity. Same bytes do not prove two footer uses have identical semantics.
Any footer/drawing sharing rule must prove all incoming uses and same semantic
scope before aliasing/removing a part; final graph and provenance aliases must
agree. No invented missing footer relationship or guessed layout ownership.

Consumer output creates a new bound descriptor/hash chain and a bounded
optimization delta: rule/version, changed part identities/hashes, counts and
approved aliases. Static facts stay linked to the ORIGINAL emission; final
validation facts bind FINAL bytes. No rewrite of history to claim that the
producer emitted the compacted package. No-op retains exact package bytes.

## 5. Private-state closure inventory

| Current dependency / source locator | Finish before exit / surviving plain data |
| --- | --- |
| profile.ts:18-19,435-448 capsules,intentOrigins,glyph/resource functions | Genuine input/resource/glyph checks and identities; no Preflight/Intent/private font parser transfer |
| source-layout.ts:18-35 guides/applied/fallbacks; source-layout-xml.ts:27-118 | Complete serialization, row-frame adjustments, applied coverage and source map, then source-layout recipe/provenance. No SourceFontMetrics/glyph/guide object |
| metric-baseline.ts:20-60 proofs,pairProofs,thaiWords,tableWidths | Native emission consumes spacing/boundaries/width proof; baselineReceipts records survive, raw pair maps do not |
| reading-measurements.ts:9-16 records | Reading/extents consumed in section/table/ending geometry; receipt summary survives, no live runtime/cache |
| groups.ts:39-44 measuredPlans | Reading/keep/fragment/separator decisions consumed by native body/table/field construction; retain public emitted facts only |
| compound-table-strokes.ts:12 ids; font-envelope.ts; images.ts:64-76 | Complete stroke/image/font use and generated identity assignment. Downstream allocator derives collisions from actual package census |
| sections.ts:16-34,149-165; fields.ts:12-33; ending-area.ts | Complete native objects/notes/anchors/numbering and freeze plain section/ending/bookmark/digit facts. No Bookmark/Table/Paragraph objects |
| writer.ts:104-135,186-234; engine.ts:145-188 | Generated glyph checks and source serialization complete; every later intent-dependent receipt field covered by sections 3.1-3.3 above |

All downstream consumers of these stores must be checked when the package
changes. A count/hash alone cannot replace source ownership or receipt contents.
Completeness rule: each post-cut read resolves only to sealed facts, a frozen
option, final observed bytes or a bounded package-derived index. Any other read
is a closure failure; do not solve it by retaining the producer or duplicating
its heap in the parent. This table is static coverage, not runtime closure proof.

## 6. Encoding, bounds, errors and finalization

Fact streams preserve type, array/property traversal order, numbers, optional
presence and source semantics. Plain JSON.stringify is insufficient for exact
legacy JS receipts: own property with undefined differs from absent, and -0
differs under Object.is. Use versioned typed structural events with explicit
undefined/presence and faithful finite-number encoding; reject prototypes,
getters, functions, cycles, handles, Buffers/Maps and nonfinite numbers. Do not
restore authority/capabilities from events. Exact codec and schema conformance
remain proof gates, not an implemented serializer.

UTF-8 framing must be fatal on malformed input, handle multibyte boundaries,
reject duplicate keys/unknown variants and preserve escaped content. Source
digests keep their existing JSON.stringify semantics; do not recompute them
with a new canonicalizer and substitute a different digest. New stream hashes
identify the exact new encoding bytes only.

Prior lab engine result: 780656 bytes, 664 adaptations; the largest compact JSON
adaptation is source-word-layout at 102035 UTF-8 bytes. This disproves a 64-KiB
logical-record ceiling, not all other sizes. No 1-MiB public receipt limit follows.
Stream structural/scalar fragments with bounded IO/backpressure and charged
disk indexes; a logical record/string may cross chunks. Never accumulate a
whole record, source graph, ZIP/base64 or all adaptations merely to JSON.parse/
stringify them. Exact parser buffer/depth/index budgets and whole-stage 512-MiB
fit must be proved; no new content truncation or silently stricter source cap.

Reserve native ZIP + emitted checkpoint + facts/indexes + candidate + atomic
seal coexistence under existing host task/pool/free-floor budgets BEFORE writes.
Do not apply final XML/byte limits prematurely to a private intermediate, or
assume internal copies are free. Preserve the existing native-pack byte check,
source/resource admission and final-byte/XML/drawing guards at their proper
positions. Checkpoint grants need a separately proven bounded storage plan;
no limit is raised here to permit an intermediate. No memory spill to tmpfs,
parent Buffers or DB BLOBs presented as a RAM saving.

Final consumer independently validates schema/provenance/graph/counters and
preserved content/effective formatting, then computes final byte hash/length.
Count all XML/rels and preserve the current wp:docPr drawing metric and frozen
effective XML budget (50000 in this scope). Do not replace it with an unrelated
w:drawing or VML count. Existing public optional maxXmlNodes semantics remain
distinct from this owner's unchanged 50000 lab policy. Bind option presence,
configured limits, profile and package version; child cannot request 300000.

Before publishing, preserve signal/deadline checks and cancellation before and
after writes. Missing facts, partial seal, wrong binding, typed decode failure
or changed bytes cannot yield a successful receipt. Retain original primary
issue plus applicable cleanup issues/order; failed cleanup cannot become PASS.
Killed process/OOM/IO failure is runtime evidence, not an invented Core layout
error or a recoverable JSON Result. Never infer a kernel victim from the known
unreliable lab expectedOomPid field.

Moving receipt calculations before final guards can change first-error timing.
Do NOT silently assume they are total: prove derivations total for validated
inputs or retain original ordering; any unavoidable semantic error-precedence
change requires an explicit versioned API decision before implementation
acceptance. No fabricated successful facts or dropped error to force a cut.

Only complete validated Core output/receipt crosses the existing Service
registration boundary, after confirmed stop/cleanup; worker release precedes
sender acquisition. Storage/read/queue holds remain separately owned. No auto
retry/resend or cross-restart checkpoint replay. The unchanged public APIs keep
their receipts/atomic sink obligations; a new staged capability may return
Core-owned stream/reference receipts. Returning references in place of an old
adaptations array is NOT backward compatible, and materializing it in the
Service parent is NOT proof of 512-MiB staged operation.

## 7. PDF contract — emission first, no new layout checkpoint

V1 deliberately cuts PDF AFTER draw/fields/links, font subsetting and complete
writePdfTo emission, including EOF/xref and the existing cleanup result. Keep
draw graphs, font subsets, text sessions/cache and image provider inside that
producer. An earlier DrawDocument/subset checkpoint would need a separate
contract, not a DOCX intent codec.

PDF facts preserve byteLength/sha256,mediaType=application/pdf,pageCount and
fontUsage when it currently exists (schemaVersion2): fontId/hash/selection and
ordered license id/hash records. Preserve optional presence and complete
Result warnings/issues. Final identity validator verifies final bytes/format
and frozen limits; no DOCX XML operation, DOCX pageCount=null or Word flags.
Streaming and legacy buffered APIs remain distinct. No public sourceDigest is
invented for PDF. Current 2000 pages/10000 placements/256-MiB streaming cap and
all smaller caller limits remain unchanged. Engine cleanup can invalidate an
otherwise emitted PDF; no checkpoint success before that result is known.

## 8. Acceptance matrix and remaining gates

| Gate | Required proof / current status |
| --- | --- |
| Static field/store closure | Defined above against pinned code, low-level writer / engine / Service projections separated. Read-only inventory retained; not runtime acceptance |
| Codec exactness | Copy-only R2 matrix 57/57 PASS, including undefined/absence/-0, order, large data, UTF-8/FEFF and malformed frames. Full nested Core schemas and actual Core object capture remain OPEN; see dated proof below |
| Real producer closure | Fresh consumer with no intent/native/resource graph or helper rehydration; no loader/private-map mutation. All post-cut reads covered. NOT IMPLEMENTED |
| Provenance and semantic scope | Core-emitted source/band/drawing lineage, omitted/inherited sections, shared parts, field/map/relationship preservation; unsupported ambiguity fails. NOT IMPLEMENTED |
| Guards/error compatibility | No-op exact bytes and complete writer/engine Result parity, option-presence, failure/cancel/cleanup ordering, current caps, existing packed consumers/regressions. NOT RUN |
| Full 512-MiB bundle | Include producer, processing, FINAL Core validation, supervisors/cache/indexes/overlap; actual envelope/credit/launch and source/codec bounds. Prior lab Docker control is NOT this proof |
| Adoption | Service storage/fencing/diagnostic continuity, trusted transport/consumer negatives, launch containment and package-root API/pin compatibility. No product change authorized |

Next recommendation: review this contract, then authorize an isolated codec/
schema and source-closure proof BEFORE any Core implementation or UAT/SRS run.
No fresh runtime result or SRS memory closure is claimed by this document.

## Source locators

Core root:C:/Users/nekot/Documents/GitHub/flowdoc-core-worktrees/development.
Service root:C:/Users/nekot/Documents/GitHub/flowdoc-service-worktrees/development.
C1 root:C:/Users/nekot/Documents/GitHub/flowdoc-core-worktrees/docx-c1-20261101.
PDF:createPdfEngine.ts:29-42,91-145 and writePdfTo.ts:8-29,56-61 under src/pdf.
Core issue schema:src/result.ts. Service projection:src/tasks/artifact.ts:10-24;
completion:src/tasks/render-child.ts:241-258; lifecycle:src/tasks/render.ts.
Current source hashes/size observation:
C:/Users/nekot/Documents/FlowDoc-recovery/core-stage-contract-20261101/inspection.json.
Static checks:contract-check.json in that folder names all 14 current top-level
writer receipt fields, all 8 engine artifact fields and the 6 private-store
modules. A compact maximum-token reference descriptor plus 4-byte prefix is 1784
bytes under 4096; this is encoding arithmetic, NOT an actual IPC/parser pass.
One independent builder check found no important unanswered contract-review
question after clarifying raw package bytes and immutable reused-fact lineage.
Exact nested codec/schema and runtime closure gates above remain unproven.
Prior lab proof:stage-handoff-ram-20261101-r3/verification.json in the same
recovery parent. No system/DOCUMENT_MAP promotion or product file change.

## 2026-11-01 — Copy-only codec proof on Oracle

Following the owner's explicit new request, isolated Oracle lab execution is
authorized for this copy-only codec spike. Earlier design-only rounds remain
historical; no Core/Service/C1 editing, real data/service stop or push/release/
install is authorized. Evidence Reviewer then PC Steward, inline IDs N/A,
medium/routine work. Existing image/runtime only, no dependency installation.

Proof budget: focused local prerequisites, JSON-loss RED control, one original
Linux matrix, then one corrected affected matrix after a confirmed codec
defect. Preserve original artifacts and use an exact-old-codec regression RED
control. No rendering/XML/Word or deliberate RAM/OOM test; unexpected OOM stops
work. Document budget: this addendum plus a narrow generic-design link and local
code/raw evidence/report. No new canonical document, Work registry or map.

### Result and exact scope

R2 **57/57 cases PASS**, including 2 EXPECTED-RED controls. Category counts:
13 exact-data cases, 2 nonmaterializing scans, 10 encoder rejections without seal,
22 decoder rejections, 1 valid descriptor and 7 control-frame rejections.
The measured worker bundle includes supervisor and sequential codec children:
peak **99,966,976 bytes / 95.3359375 MiB** under 512 MiB; no OOM/oom_kill. Default
259-MiB V8 heap, Node 24.21.0, no heap/GC tuning, memory+swap 512 MiB (actual
swap.max 0), CPU 1, 64-MiB tmpfs, network none, readonly root/input. All 61 known
child groups and the owned lab container stopped; no pressure test repeated.

Encoder and decoder run in separate fresh processes. An independent recursive
oracle loads the original fixture anew and checks typeof,Object.is,
Reflect.ownKeys/order/presence, plain/null prototypes and frozen flags. A
handwritten binary vector is not generated by the encoder. Decoder success is
reported only after counts, EOF/trailer, internal digest and trusted file hash
match; valid prefixes/partial data are not published as success.

Covered data: own undefined versus absent, -0/finite doubles, null/booleans,
Thai/emoji/combining/escaped/NUL text, leading U+FEFF values AND keys, sparse
arrays/custom enumerable data keys, frozen containers, 128 nesting levels,
10000 metadata records, simulated writer/PDF facts and absent/explicit options.
The large-text fixture preserves 8000000 UTF-16 units across chunk boundaries;
wire 17,005,456 bytes. These are codec data fixtures, not new rendered documents.

Prior lab UAT parsed Core Result and all **664 adaptations** round-trip exactly.
Its original JSON file is 780656 bytes; this typed wire is **1,061,712 bytes**,
13,136 bytes OVER 1 MiB. Therefore the former prototype's 1-MiB sidecar ceiling
cannot be imported as a generic codec limit. No product limit has been raised.
The large logical adaptation 102035 bytes need not fit one physical frame.
The UAT wire has 72336 representation events; those are NOT XML/source nodes and
must not be charged against the 50000 XML cap as if they were the same metric.

Malformed tests cover duplicate keys, invalid/unfinished UTF-8, unknown event,
nonfinite number, wrong scalar/bool/string/count/digest, truncation/missing tail,
extra trailing data, frame-length rejection BEFORE payload allocation, missing
key/array length misuse, wrong file/execution binding and cancellation. The
in-flight abort occurs after 32 input chunks, separate from pre-aborted input.
Control tests cover the maximum-token 4096-byte-contract example (1784 actual
frame bytes), duplicate JSON keys, partial/extra frame, bad binding, oversized
prefix, malformed UTF-8 and unexpected BOM outside JSON.

### Confirmed defect and preserved corrections

R1 passed its 52 cases but an independent read-only reviewer found a missing
case: default TextDecoder behavior strips leading U+FEFF from a logical key/
string. That is a data-fidelity defect in the LAB codec, not a Core defect.
Do not promote R1 as general Unicode acceptance. Its code, packet and runtime
results are preserved at core-codec-20261101/oracle in the recovery parent.

R2 uses ignoreBOM:true for logical text and strict-control UTF-8: fact U+FEFF
is preserved, whereas a BOM outside the control JSON grammar is rejected. An
exact hash-checked R1 reference-old.mjs reproduces lost key/value data in Oracle
as EXPECTED RED, before corrected key/value/split/large cases pass. This rerun
is justified by the actual codec change; no unchanged passing suite is rerun
for additional confidence. Local Windows preflight also recorded EPERM when
fsync used a read-only handle; staging uses r+ rather than skipping the flush.
No product repository was repaired to obtain a passing codec result.

### Implementation details exercised, not an adopted wire API

The demonstrator uses 8-byte magic FDCODEC1, a bounded JSON binding header, typed
length-framed structural/scalar/text events and a counts+SHA256 trailer. Data
frames have 5-byte headers and at most 65531 payload bytes; logical keys/strings
can span TEXT chunks. IEEE754 binary doubles retain -0; undefined has an
explicit event. Containers carry plain/null/sparse/frozen data semantics.
The completion descriptor stays the separate 4096-byte length-framed JSON.
These copied files do not add a package export, validate real Core provenance,
or silently change the proposed product schema/version.

### Remaining gates / no overclaim

- Actual Core producer and complete private facts are still unimplemented.
  Prior UAT JSON has already lost any original JS-only identity/presence not
  serialized then; independent JS fixtures test the codec's handling, not a
  capture of the original live Core graph.
- Full descriptor/nested Core semantic schemas remain open. Control JSON is
  duplicate-aware and matched against a trusted expectation, not a complete
  schema/provenance validator. Generic typed facts do not confer genuine-intent
  authority or make forged receipt fields acceptable to a future consumer.
- Tested equality includes values, own key order/presence, prototypes, sparse
  shape and frozen flags. Shared-object alias identity, general property
  descriptors/extensibility and concurrent mutation/hostile Proxy inputs are
  not claimed; future producer facts must be owned/immutable.
- Encoder retains its input graph/key lists; decoder keeps nesting and
  duplicate-key sets. Scan avoids collecting value strings, but universal
  key/depth/index working-set bounds are unproved. Parity collection deliberately
  materializes decoded data INSIDE the measured bundle. 95.34 MiB is not a proof
  that every valid Core source or complete producer/optimizer/validator fits.
- No generation, SRS/XML reduction, Word/fidelity, real Service allocation/
  accounting/launch/DB/storage fencing or delivery test ran. Current source/
  XML/drawing/output/profile caps stay unchanged. Existing SRS heap OOM remains
  open; codec passage does not close it.

Protected Core/Service HEADs/status and 29 inspected source hashes match the
baseline; C1 remains the same dirty two-file candidate. Three real-runtime
metadata identities are unchanged. No production mounts/API/DB/storage reads,
service stop, push, release or install. Stop this codec proof here.

Evidence:C:/Users/nekot/Documents/FlowDoc-recovery/core-codec-20261101-r2/verification.json.
Same folder:packet.json,codec.mjs,reference-old.mjs,fixtures.mjs,case.mjs,
suite.mjs,oracle/receipt.json,oracle/out-codec/suite.json and verify-report.py.
Report:C:/Users/nekot/.codex/visualizations/2026/10/27/01a17da5-b6ab-7ff0-a66c-e46d7e2cf42d/flowdoc-oracle-core-codec-20261101/verification-report.html.
Next: review/prove actual Core fact schemas and producer closure on copies
before authorizing product integration or any new UAT/SRS generation.
