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

Control-header UTF-8 framing must be fatal on malformed input, handle multibyte
boundaries, reject duplicate keys/unknown variants and preserve escaped content.
The separate LAB V2 facts codec below uses raw UTF-16LE for keys/string values,
including lone surrogates: declared lengths are even byte counts, odd frame/IO
boundaries retain at most one carry byte, and no Unicode replacement or
normalization occurs. This does not change the control header encoding, source
caps or introduce a product stage API. Source
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
| Codec exactness | V1 57/57 controls retain their scope; later reachable surrogate gap reproduced. Separate LAB V2 now passes 66 codec controls plus 5 live Core completed-result transfers, closing that reproduced Unicode transport gap only. Full semantic schemas/preguard facts/universal bounds remain OPEN |
| Real producer closure | Live completed-output facts survive producer exit in 10 small controls; proposed BEFORE-guard cut remains BLOCKED_NO_API. No intent/private-map transfer or loader rewrite; see dated schema/closure proof |
| Provenance and semantic scope | Core-emitted source/band/drawing lineage, omitted/inherited sections, shared parts, field/map/relationship preservation; unsupported ambiguity fails. NOT IMPLEMENTED |
| Guards/error compatibility | No-op exact bytes and complete writer/engine Result parity, option-presence, failure/cancel/cleanup ordering, current caps, existing packed consumers/regressions. NOT RUN |
| Full 512-MiB bundle | Include producer, processing, FINAL Core validation, supervisors/cache/indexes/overlap; actual envelope/credit/launch and source/codec bounds. Prior lab Docker control is NOT this proof |
| Adoption | Service storage/fencing/diagnostic continuity, trusted transport/consumer negatives, launch containment and package-root API/pin compatibility. No product change authorized |

Next recommendation: use section 9's checkpoint/schema review and its ordered
prerequisites. The dated proofs retain their bounded outcomes; neither this
contract nor its review establishes SRS memory closure.

## 9. Checkpoint/facts and incomplete-schema review — 2026-11-01

Authority: PROPOSED contract refinement following the owner's explicit review
request, not authorization to implement a Core API. Planning Partner /
Cross-Repo Boundary Reviewer, then PC Steward; single-room execution IDs N/A.
Medium discovery, routine read-only risk. Base: PC 4ce98f2; Core 3e74f98,
Service a572025 and the unchanged two-file C1 candidate. Scope: existing
contract and one design link only. Acceptance: distinguish stage data, enumerate
schema decisions with implementation locators, define evidence and ordered
next work. Proof budget: one source review, reuse immutable prior lab evidence,
document checks; no new Oracle connection/generation/benchmark or product/lab
code changes. Preserve 512 MiB per worker/bundle, existing caps and all owner
production/push/release/install restrictions. No map or runtime promotion.

### 9.1 Recommended capability and checkpoint state

Three approaches were considered. These are review recommendations, not an
owner selection or implementation acceptance:

| Approach | Assessment |
| --- | --- |
| Reuse completed receipts/callbacks | Useful preservation control, already demonstrated for 10 cases. Cannot move optimization before final guards; cannot recover an over-budget generation that never reaches the callback |
| Serialize genuine intent/private maps or rebuild them in consumer | Reject for this design: native/resource graph, genuine identity checks and duplicate peak memory defeat the intended cut; raw JSON cannot restore authority |
| Separate versioned Core emission/final-validation capability | Recommended: keep current public APIs/atomic sink behavior unchanged; new staged surface emits sealed package, immutable recipe and provenance, with no claim of final success |

Logical lifecycle is emitted -> optionally processed -> validated. Failure,
cancellation or worker death ends that attempt without publication or automatic
resend. These are INTERNAL stage states, not new task/job statuses. Existing
Service release/fencing/delivery rules remain authoritative. No checkpoint
is accepted until files are closed and independently bound, producer and
descendants have exited, and the host still owns its original grant/deadline.

The exact cut stays AFTER applied source serialization/ending/font corrections
and all native work, BEFORE general optimization/final guards. API names,
signatures and schema identifiers are still proposed; no exported symbol is
invented as present. PDF retains section 7's complete-emission identity cut.

### 9.2 Split immutable facts, final observations and host authority

| Owner / record family | Content and consuming rule |
| --- | --- |
| Core immutable emission facts | Original sourceDigest/profile; exact ordered resources, autoFormats, sections, bookmarks and numbering; ordered adaptation recipe segments, engine size/text-layout prefix, complete warnings. Freeze after all source-guide applications, before intent disposal |
| Core provenance | Actual package inventory, all XML/rels and target ownership, source tags/maps and section/band inheritance, drawings/protected content and permitted aliases. Counts or completed receipts alone are insufficient; see section 4 |
| Core final observations | Recompute FINAL package sha256/bytes and XML/wp:docPr counters after processing. Fill expanded-xml-budget ONLY at its existing recipe position and only when maxXmlNodes value was defined; preserve the original limit/default/source-node-limit fields |
| Host/Service execution context | Trusted original descriptor digest, attempt/runtime/resource/input/policy/options bindings, read/write grants, live cancellation/deadline and publication fence. No DB lease, credentials, native executable path or serialized AbortSignal in facts |

Intermediate byte/hash/count fields are explicitly intermediate. Never copy
them into the final DocxReceipt. Keep the frozen original facts/header linked
when a later descriptor advances; do not relabel emission history. Consumers
derive only bounded indexes from sealed bytes. Unknown ownership preserves
unchanged content or fails a required transform; it never authorizes an edit.

Facts need distinct format/schema identity from the lab's
completed-output-only payload. A version/header mismatch rejects before work.
Do not pretend the R2 completed schema is the checkpoint schema. Public writer,
engine, streaming PDF and buffered PDF outputs also remain separate surfaces;
the current lab PDF validator covers PdfStreamArtifact, not PdfArtifact.bytes
(src/pdf/createPdfEngine.ts:30-41).

The options manifest retains both own-property presence and value. Absent,
own-undefined and defined values stay distinguishable even where current Core
branches behave alike. For example writer.ts:100-101,221 and engine.ts:180-188
test definedness before forwarding/inserting the XML-budget adaptation. Do not
insert it merely because an undefined property existed. Explicit native/source
layout versus no layout option preserves current engine projection/order.

### 9.3 Schema closure decisions and evidence still required

All rows below remain OPEN for acceptance. Source review specifies obligations;
it does not add cases to the prior 10/170 runtime results.

| Family / source | Required closure and next evidence |
| --- | --- |
| Structural data grammar; R2 schema.mjs shape/array helpers | Dense ordinary arrays with only indices/length; explicit object prototype/property-descriptor rules, no symbols/accessors/extra array properties, own-key/presence/order preservation. Test both decoder rejection and direct validator entry; codec rejection does not prove schema entry rejection |
| Strings; R2 str helper versus docx/resources.ts:38-50 and fonts.ts:151 | V1 isWellFormed restriction conflicts with three reachable real Core receipts. Separate LAB V2 below preserves raw UTF-16 in 66 codec controls and 5 fresh Core transfers; reproduced gap closed in V2 only. Full branch/schema acceptance remains OPEN. No replacement/normalization or stricter Core admission |
| FormatCursor / diagnostic; result.ts:1-3, layout/formatLayout.ts:3-14, documentFlow.ts:261,357-362, cellTableFlow.ts:87-97 | Text/image/node and eight table/group fixtures retain bounded PASS. Later matched public Core controls now prove a label cursor with absent lineIndex/itemIndex on a validator-admitted direct ResolvedDocument. Original composed fixture stays NOT_OBSERVED; Service/template equivalence, general semantics and other schema families remain OPEN |
| Format instances; composition/validateFormatInstances.ts:11-30 | Validate fixed/auto sizing, nonnegative safe indices, fixed rootStartIndex, root identity/order/ownership and omission boundaries. Consumer must use minimal Core-emitted lineage or sealed package evidence, not reload the original ResolvedDocument graph. Decide the minimal needed lineage before exporter implementation |
| Resources / PDF usage; docx/resources.ts:38-91, fonts.ts:151, pdf/createPdfEngine.ts:104 | Distinguish font, PNG (decoded RGBA hash) and JPEG identities; font weight/style/license/release/native family and PDF selection/license order. Check duplicate identity policy per actual producer namespace, positive dimensions/product limits and binding to authorized original/derived resources. Add genuine image/library/schemaVersion2 controls; the small PDF case does not cover them |
| Sections, bands, cells and quantities; docx/sections.ts:149-163, bands.ts:51,75,108 | Complete literal policy/shape/reason families from emitter branches and source formulas; units/ranges per field, not blanket nonnegative constraints (deltas/offsets may be signed). Preserve six-key reserved/native margins versus four-key source/estimated margins, page-type estimates and false verification flags. Add inheritance/omission/header/footer/merged-cell controls and source-based consistency checks |
| Adaptations; writer.ts:186-233, engine.ts:148-154,188, metric-baseline.ts:41-55 | Closed build-pinned variant definitions, every property/optional field/policy and order, including nested band quantization. Keep finite literal/range constraints such as Thai maxWordsPerGroup=4 or pair quantum=.025 where source guarantees them. Cover currently unexercised variants; keep inherited-name RED regression. No deduplication or sorting |
| Result/error/cleanup; result.ts, writer.ts:76-81, engine.ts:189 onward | Success/failure discriminants and output absence on failure, ordered warnings/issues and cleanup suffix, failure cardinality based on actual return paths. Don't require a stage Result field merely because a completed receipt has it, and don't turn OOM/kill into a layout Issue. Multiple simultaneous failure controls must establish first-error compatibility |
| Checkpoint completeness/provenance; sections 2,4,5 | Complete headers/chunk catalogs/end counts; empty-versus-missing families explicit, ordered recipe slots, section/source/part coverage. Verify missing/extra/swapped/duplicate facts, inherited/shared band uses, stale seal and wrong attempt before optimization; valid hash/shape alone is insufficient |

An external source field that cannot be checked without original document state
must be classified explicitly: (a) exporter-validated, sealed immutable fact,
(b) independently checkable package-derived fact, or (c) missing prerequisite.
Schema validation is not a substitute for producer correctness/provenance.
No full source/glyph/guide graph is added just to make a cross-check possible.

### 9.4 Compatibility and memory decisions not yet proved

The proposed cut requires moving intent-dependent derivations ahead of guards.
Those functions have not been proved total. Current final guards can fail first;
eager derivation can change the primary error. Recommendation: unchanged legacy
entrypoints plus a separately negotiated staged API; retain original precedence
where feasible using ordered, Core-owned derivation outcomes, never raw Error
objects. This is a DESIGN OPTION, not an approved deferred-error mechanism.
Before implementation, establish totality/ordering or explicitly review any
versioned behavioral difference. Infrastructure/OOM failure is never deferred
as an ordinary successful emission or hidden behind a recipe slot.

All producer objects, native descendants, stream queues, ZIP handles, decoder
fragments and disk-index caches belong to the measured 512-MiB stage bundle.
Parent cannot retain the old receipt/ZIP or materialize large arrays to hide
memory. Large logical strings/records may cross bounded frames; choose real
buffer/index/depth/backpressure limits from accepted-domain evidence, not a
new content cap. Checkpoint/candidate/index coexistence needs a charged storage
reservation before launch. Old cap ordering remains: source/native admission
before emission, final XML/drawing/bytes after processing. No added intermediate
50,000-node rejection that prevents the intended reduction.

### 9.5 Ordered next work and stop conditions

1. **Lab-only schema/domain closure design and proof:** resolve the table's
   enum/presence/string/numeric decisions, then genuine small branch captures
   plus adversarial codec AND schema controls outside product repositories.
   Keep old R2 results immutable; any wire change has its own negotiated version.
2. **Review the concrete Core capability proposal:** exact exporter/finalizer
   signatures, minimal lineage, failure precedence, caps, IO/storage budget and
   legacy API behavior. Missing schema/domain, provenance or bounded-reader
   decision blocks implementation acceptance. This review does not authorize
   candidate product changes or claim the first item has passed.
3. **Only after separate implementation authorization:** isolated Core candidate,
   genuine emission -> producer/descendant exit -> fresh consumer without Core
   source graph; missing-fact/binding/partial-write/cancel/error-order tests.
   Every post-cut read must resolve to frozen facts/options or final bytes.
4. **Then memory/workload proof:** unchanged Oracle runtime, 512 MiB per bundle,
   small parity/failure cases before UAT then SRS. Stop on OOM; no retry with
   larger RAM/caps, no hidden extra worker or success based only on exit code.
   Service integration, real recovery, Word fidelity and release remain separate.

Review outcome: contract refinement ready for owner review; full schemas,
exact-cut runtime closure and staged 512-MiB acceptance remain OPEN/BLOCKED.
No new Oracle runtime result, Core/Service edit or evidence/map promotion.

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

## 2026-11-01 — Live Core schemas and producer-exit proof: PARTIAL

Owner next authorized schema/fact proof on copies in isolated Oracle lab,
still 512 MiB per worker, unchanged caps and no Core/Service/C1 editing, real
data/service stop or push/release/install. Evidence Reviewer then PC Steward,
inline IDs N/A; medium/routine. Proof budget: source-authored candidate schemas,
old-JSON calibration, 10 small real-Core completed-output captures, fresh
consumers and bounded mutations. No UAT/SRS/Word, deliberate OOM or rewritten
Core/loader hook. One independent review and one schema-only correction/replay;
no producer/generation rerun after passing capture. Document budget: this
addendum, generic-design link and local code/raw evidence/report; no new map.

**Overall status: PARTIAL_PASS_COMPLETED_CORE_FACTS; PREGUARD_CUT_BLOCKED.**
Do not mark full Core schema, preguard closure or staged implementation accepted.

### Proven completed-output boundary

- 10 live cases finish: writer basic/table/ending/source, engine default/native/
  source, expected byte-budget failure and pre-aborted failure, PDF basic.
  Source/metric preparation uses genuine Core functions and state. Core's
  existing output guards execute; no limit bypass or fake success receipt.
- Package is the existing unchanged C1 candidate 0.5.2, tar SHA256
  3be3f511e6a58798504a7b486b031a48ffd708f2707a3422c22ffc77cae67aac.
  All 250 package files stay byte-identical. Public-export engine functions are
  called through their pinned dist entry. Low-level writer imports are labelled
  INTERNAL VERIFICATION CONTROLS, not a supported Service/deep-import API or a
  package export-resolution/wiring acceptance.
- Producer captures actual live Result and writer commit receipt BEFORE JSON.
  An independent SHA512 tree oracle records types, own-key order/presence,
  undefined, prototypes and frozen flags without using the codec's encoding.
  Receipt, output hash/length and source binding are retained in sealed facts.
- Producer close is awaited. Its namespace is checked for remaining processes
  (including native helpers), then a fresh consumer starts. It imports no Core,
  original template/font/fixture/native helper, and receives no intent/WeakMap/
  parsed font/glyph/native graph. Core files may physically exist in the first
  image; absence of every possible filesystem access is not claimed.
- Each consumer validates covered schemas and compares the complete decoded
  tree against its ORIGINAL live oracle, then verifies final artifact bytes/
  checksum and writer commit versus Result.value. Eight successful outputs and
  two expected failure Results match; no output is regenerated by the consumer.
- Writer payloads retain 10 own-undefined TREE occurrences, because the same
  receipt is captured as commit and Result.value. These are NOT 10 distinct
  receipt fields or alias-identity proof. Historical JSON-only writer receipts
  fail the expected nativeStart-presence check, demonstrating why that old
  evidence cannot establish live-field completeness.

### Candidate schema coverage and correction

Source-authored candidate validators cover 14 writer root fields, 8 engine
artifact fields, Result success/failure shapes, ordered resources/autoFormats/
section/header/footer/capacity/table-cell/numbering/bookmark facts and known
adaptation variants. Tested root/required fields, disclosure constants, nested
capacity/cell types and unknown variants are checked without learning field
allowlists from the same runtime fixture. This is not an exhaustive semantic
schema for every Core value.

An independent review found a LAB-schema defect: ordinary-object lookup of
variants[kind] admits inherited names (__proto__,constructor,toString). R1's
149 mutation checks missed that class. R2 uses typeof-string plus
Object.hasOwn; three exact-old-schema RED controls demonstrate admission by
the original and rejection by the correction. The corrected consumer rejects
**170 invalid mutations** across all 10 immutable captures, including 21 added
inherited-kind probes. Old schema/results retained; Core was not repaired.

R2 REUSES the original sealed outputs/facts and independently held live oracles
with hashes checked. Only the candidate validator/consumer changes; no Core
call or document generation repeats. This is read-only evidence verification,
NOT operational checkpoint resume across runtime restart or a new success
record in Service.

Live-capture bundle peak **68.703125 MiB**, corrected validation-replay bundle
**30.84375 MiB**, each enforced 512 MiB memory and memory+swap (swap.max 0), CPU 1,
64-MiB tmpfs, network none, readonly root/input, default 259-MiB V8 heap on
Node 24.21.0. No OOM/oom_kill, heap tuning or forced GC. These are separate
measured bundles; no summing or all-template/whole-stage performance claim.
Owned lab containers/processes stop; real-runtime metadata identities stay
unchanged. Protected Core/Service HEADs/status/source hashes and the dirty
two-file C1 candidate remain unchanged.

### Concrete blocker at the intended cut

The intended handoff is BEFORE general XML optimization/final guards. Current
C1 writer.ts:175-200 runs XML/relationship/final-byte guards; it then computes
intent-dependent adaptations at 202-249, constructs receipt at 250 and calls
sink.write/commit at 252/254. Protected development writer.ts:160-238 has the
same relevant order. Therefore existing callbacks cannot expose that earlier
checkpoint without changing product code or inserting a hook/loader rewrite.

Public engine.ts:187-188 projects the completed writer receipt into its smaller
artifact; writer-only sourceDigest/resources/sections/bookmarks are not exposed
there. source-layout.ts:28-35 yields summary counts/fallbacks, not complete
applied guides or section-to-ZIP-part/footer provenance. C1's private helper is
not an exported stage API and does not eliminate later intent reads.

Completed receipt preservation does NOT establish that all facts exist, are
bounded, or can be assembled BEFORE those guards after the original producer
is gone. No compact/continue/regenerate operation runs after exit in this proof.
Under the explicit no-Core-change boundary, **exact preguard closure cannot be
proved here**. This is an implementation/API constraint, not a Core runtime bug
or a reason to weaken genuine-intent checks.

### Remaining blocking/open work

1. **Full semantic schema remains OPEN:** FormatDiagnostic.pending/FormatCursor
   variants, unexercised image/library/resource cases, complete policy/enum/
   numeric-range/cross-field rules, array extra-property behavior and failure
   issue cardinality are not comprehensively constrained. Do not claim all
   invalid Core objects are rejected from 170 passing mutations.
2. **Preguard facts/provenance BLOCKED without a Core capability:** needs a
   separately reviewed/authorized candidate API for complete Core-owned facts,
   section/part/source ownership and sealed emission before consumer work.
   No ad-hoc snapshot of private maps or forged JSON intent is permitted.
3. **Memory/compatibility remain OPEN:** complete producer/optimizer/final
   validator 512-MiB envelope, universal schema/codec indexes, error-order
   compatibility, package-root staged API, Service grants/storage/DB/fencing,
   native Word and SRS generation. Existing SRS OOM is not closed by this result.

Next recommendation: review this PARTIAL result and close semantic schema
decisions alongside the proposed Core checkpoint/facts API contract. Actual
Core candidate implementation and exact-cut proof need separate authorization;
do not keep rendering or insert a hidden hook under this read-only boundary.

Evidence:C:/Users/nekot/Documents/FlowDoc-recovery/core-schema-closure-20261101-r2/verification.json.
Original live captures:C:/Users/nekot/Documents/FlowDoc-recovery/core-schema-closure-20261101/oracle/out-schema/suite.json.
Corrected schema/replay:schema.mjs,reference-old-schema.mjs,consumer.mjs,
oracle/out-schema/suite.json in the R2 folder. No original source/fixture graph
is supplied to those consumers; independent source fingerprints are preserved.
Report:C:/Users/nekot/.codex/visualizations/2026/10/27/01a17da5-b6ab-7ff0-a66c-e46d7e2cf42d/flowdoc-oracle-core-schema-closure-20261101/verification-report.html.

## 2026-11-01 — Unicode reachability and cursor schema proof: PARTIAL

Owner authorizes copy-only Unicode/cursor proof in isolated Oracle lab, 512 MiB
per worker and unchanged caps. Evidence Reviewer then PC Steward; inline IDs
N/A, medium/routine. Existing C1 package remains byte-identical (250 files,
SHA256 3be3f511e6a58798504a7b486b031a48ffd708f2707a3422c22ffc77cae67aac).
Proof budget: nine small controls, live capture, producer-exit consumer checks,
candidate cursor mutations, one fresh review and one harness correction.
Document budget: this addendum/design link and local raw proof/report only.
No Core/Service/C1/codec edit, real data/API/DB/storage access, service stop,
UAT/SRS/Word or push/release/install. Real-runtime metadata identity only is
checked before/after; no map or staged API acceptance is promoted.

**Outcome: PARTIAL_UNICODE_INCOMPATIBILITY_CONFIRMED_CURSOR_STRUCTURAL_PASS.**
The bounded experiment succeeded in finding the gap; the codec is NOT fixed.

### Confirmed Unicode incompatibility in the lab candidate

Genuine preflight/intent/writeDocx, without a source/loader rewrite, succeeds
with regular-font resource IDs containing each of: lone high surrogate U+D800,
lone low surrogate U+DC00, and reversed low/high pair U+DC00 U+D800. Actual live
receipt resource ID equals the requested string, including its exact UTF-16
code units. Fonts/licenses and original caps stay unchanged. Artifact hash/
length agree with Core receipt, but no Word fidelity claim follows.

The existing codec's encoder rejects all three with UNICODE and its completed
writer schema rejects resources.0.id:string. This is a CONFIRMED DEFECT in the
LAB candidate's all-Core data-domain compatibility, not evidence of production
Core Unicode corruption. Prior 57/57 codec controls remain true within their
tested domain; they did not include these reachable Core receipt values.

ASCII and a mixed Thai/FEFF/combining-mark/emoji ID are accepted and replay with
the exact independent live-tree fingerprint. The FEFF in this ID follows the
lab prefix; this is not a new leading-BOM control. For the three rejected
receipts, only diagnostic JSON-escaped leaf/code-unit/SHA512 evidence survives;
partial codec files are NOT accepted/replayed. That diagnostic oracle is not
a replacement lossless fact transport or a full-receipt roundtrip.

### Bounded cursor result

Three actual PDF generations yield text (height-limit, lineIndex=5), image
(image-does-not-fit) and node (explicit-page-break, nodeType=page-break)
FormatOmission cursors. Full Result facts match the producer's independent
live oracle after producer/native-helper exit; final PDF bytes/hash also match.

Four separately labelled INTERNAL_HELPER controls exercise real formatCursor
with supplied extra metadata: text without lineIndex, own-undefined lineIndex,
zero offsets/group/item index, table/group/repeat fields, image and node shapes.
These do NOT prove pending-label/table/group runtime reachability or identity
ownership; supplied attribution is not authoritative layout evidence.

A lab-only source-authored 13-field structural validator covers required
kind/nodeId/sourceNodeId and ten optional fields, including optional undefined.
It checks declared kind/type, safe nonnegative cursor indices, own keys/plain
objects/descriptors, unknown symbols/properties and getters without invoking
them. This is structural candidate coverage, not full diagnostic semantics.
Across seven captured cursors it rejects 70 mutations; 63 of those are admitted
by the unchanged old pending validator, which only checks object shape broadly.
The other seven are getter controls. These are direct schema-entry mutations,
not 70 independently exercised malformed wire frames.

### Original failure, correction and resource evidence

R1 stopped on INVALID_TEMPLATE in the image control: the lab used resolved
resourceId instead of template source binding and orphaned its text node.
No Core defect was inferred. Original Unicode five cases and PDF-text capture
are retained. A fresh reviewer also found a possible false PASS when a cursor
codec failed and the consumer skipped cursor checks. R2 requires codec ACCEPT,
expected cursor kind and exactly four helper cursors. A LOCAL Node pure-consumer
RED/GREEN calibration confirms old admission versus corrected rejection for
missing cursor payload; it is not an additional Oracle case.

R2 reuses all six original captures/oracles and renders only image/node plus
the helper control. The original container is already stopped before R2 starts;
fresh consumers verify original files, without retagging facts or rerendering
Unicode DOCX. This is evidence replay, not operational restart recovery.

Both runs enforce 512 MiB memory and memory+swap, CPU1, network none, readonly
input/Core and 64-MiB tmpfs, no increased heap or forced GC. R2 peak is
**47.94921875 MiB**, oom/oom_kill stay zero. R1 peak and final cgroup event counts
were not retained after its harness failure; its hard limit, successful earlier
children and OOMKilled=false are evidenced. Do NOT label R2's peak as original
Unicode-generation peak or full staged-memory acceptance. All owned containers
stop; real-runtime identities and protected product source hashes stay unchanged.

### Next work / remaining gates

1. Design and prove a separately versioned LAB codec that preserves the reachable
   UTF-16 string domain without replacement, normalization or stricter Core
   admission. Keep the small ASCII/UTF-8 control envelope distinct. No such wire
   format change is implemented or accepted here.
2. Cursor structural proof is bounded PASS; complete diagnostic/reason domains,
   actual table/group/pending-label attribution and source ownership remain OPEN.
   Other section/resource/adaptation schema families remain OPEN as in section 9.
3. Exact preguard API/provenance, error precedence, whole-stage 512-MiB envelope,
   UAT/SRS/Word, Service integration and production actions remain OPEN/BLOCKED.

Evidence:C:/Users/nekot/Documents/FlowDoc-recovery/core-unicode-cursor-20261101-r2/verification.json,
oracle/out-schema/suite.json and per-case producer-notice.json/facts.bin/consumer.json.
Original failed run:C:/Users/nekot/Documents/FlowDoc-recovery/core-unicode-cursor-20261101-r1.
Source/runtime scripts and old/new lab schemas retained in both folders.
Report:C:/Users/nekot/.codex/visualizations/2026/10/27/01a17da5-b6ab-7ff0-a66c-e46d7e2cf42d/flowdoc-oracle-unicode-cursor-20261101/verification-report.html.

## 2026-11-01 — Separate LAB V2 Unicode codec: bounded PASS

Owner authorizes fixing/proving a separate lab codec, 512 MiB per worker/bundle
and unchanged caps. Lab implementation then Evidence Reviewer / PC Steward;
single-room IDs N/A, medium/routine. Canonical base e16d211, protected Core
3e74f98/Service a572025 and unchanged two-file C1 candidate. Scope: new external
lab files, this contract and generic-design link. Proof budget: existing codec
matrix extended for raw UTF-16/version failures, five fresh genuine Core
captures, one fresh review and at most one scoped harness repair. No product
edits, UAT/SRS rendering, Word/pressure tests, real data/API/DB/storage access,
real-service stop or push/release/install. Document budget: two existing docs
plus local raw evidence/report; no new Work/map or product integration.

**PASS_BOUNDED_LAB_V2_UNICODE_CODEC: 71/71 checks = 66 codec matrix + 5 live Core.**
This closes the reproduced V1 surrogate-transfer defect in the separate lab
candidate only; completed-result transport is not preguard emission acceptance.

### Wire/schema decision implemented only in the lab

- New magic FDCODEC2 and header codec flowdoc/core-facts-events/2. Encoder,
  expected header and actual header all require V2. No implicit V1 fallback.
  V1 references stay byte-identical; product packages do not select V2.
- All fact KEY/STRING events encode the original JavaScript UTF-16 code units
  as little-endian pairs. No isWellFormed requirement on fact strings, no BOM
  stripping, NFC/NFD normalization or surrogate replacement. Encoder uses
  8192-code-unit chunks; decoder carries at most one odd byte across frames and
  decodes complete pairs with Buffer UTF-16LE, not replacement-prone TextDecoder.
- Control header stays duplicate-aware strict UTF-8, maximum 4092 payload bytes
  plus 4-byte length. Data frames stay maximum 65536 bytes including 5-byte prefix;
  no source/output/resource/RAM cap is increased. Fact declared string byte
  length must be even and equal actual data. Raw lone surrogates are valid V2
  facts, while odd/truncated byte sequences remain malformed.
- A separate completed-writer schema copy changes only its string-domain check
  to JavaScript string type. It retains the existing field/variant rules and
  all previously recorded semantic coverage gaps. No Core schema/API is edited.
- V2 textBytes counts UTF-16 wire octets. Wire lengths/hashes legitimately differ
  from V1; neither replaces existing Core sourceDigest/input binding. Private
  fact storage reservations and universal index/depth bounds remain unproved.

### Evidence and bounded acceptance

The 66-row codec matrix includes every one of the 65,536 UTF-16 unit values,
unpaired high/low/reversed sequences, surrogate keys, FEFF/NUL/combining marks,
distinct composed/decomposed strings, encoder and odd IO/frame boundaries.
Independent literal LE byte vectors and recursive Object.is/key/order/type/
prototype/frozen oracles check exact data. It retains undefined versus absent,
-0, sparse/ordered arrays, frozen data, 8-million-unit text, 10,000 records,
historical UAT-result fixture and non-materializing scan controls. Historical
receipt fixtures are data controls, not new UAT document-generation acceptance.

44 negative controls cover invalid source types/getters/cycles, malformed
lengths/counts/digest/duplicates/events, file/execution binding, before/inflight
cancellation and control UTF-8/JSON errors. Six specifically reject V1 reader
versus V2 wire, V2 reader versus V1 wire, wrong expected/encoder version, and
forged V1/unknown-version headers under V2 magic. Wrong-version encoding never
seals output. Old JSON-loss and original leading-FEFF regression RED controls
remain part of the matrix. Unit coverage is not every possible string/workload.

Five fresh genuine preflight/intent/writeDocx cases use ASCII, mixed Thai/FEFF/
combining/emoji and the three previously failing surrogate resource IDs. Capture
is BEFORE JSON; complete live Result trees pass the independent original
fingerprint after producer/descendant exit in fresh consumers with no Core/
template/font/native imports. Required package/execution/version/file bindings,
candidate schema, exact IDs/code units and final artifact hash/length all match.
The same live three surrogate Results still fail unchanged V1 codec/schema,
then transfer completely through V2. No diagnostic-only surrogate workaround
or Core/private-map/loader rewrite supplies the successful V2 data.

### Failure retained and resource boundary

R1 stopped at BINDING: its matrix packet omitted three required digest fields,
so child JSON dropped own-undefined properties while the direct vector oracle
retained them. This was correct rejection, not a codec defect. No Core generation
had started. R2 restores the pinned lab fixture digests and checks completeness
before matrix execution; codec/schema bytes remain identical to R1. Original
failed packet/log/results retained. A fresh bounded review found no Important
codec defect; no extra audit or unplanned generation followed passing proof.

R2 entire measured bundle peaks at **95.84765625 MiB** under 512 MiB memory and
memory+swap, CPU1, readonly inputs/Core, network none and 64-MiB tmpfs. Default
Node 24.21.0/259-MiB V8 heap, no tuning/forced GC; oom/oom_kill remain 0. Both
owned containers stop. Real-runtime metadata identities, protected source
hashes/HEADs and C1 changes remain unchanged; all 250 extracted Core package
files are byte-identical to the existing pinned tar.

Remaining work: complete diagnostic/cursor/table/group and other semantic
schemas, emission provenance and exact preguard API/error-order decisions,
bounded storage/index/depth and full producer/optimizer/finalizer 512-MiB proof,
then authorized candidate UAT/SRS/Word/Service integration. None is promoted
by this codec result. No release/installation or production action authorized.

Evidence:C:/Users/nekot/Documents/FlowDoc-recovery/core-codec-v2-20261101-r2/verification.json,
oracle/out-schema/matrix.json,suite.json and core/<case>/facts.bin/producer-notice.json/consumer.json.
Codec/schema sources:codec.mjs,schema-v2.mjs; original V1 references retained.
Original failed run:C:/Users/nekot/Documents/FlowDoc-recovery/core-codec-v2-20261101-r1.
Report:C:/Users/nekot/.codex/visualizations/2026/10/27/01a17da5-b6ab-7ff0-a66c-e46d7e2cf42d/flowdoc-oracle-codec-v2-20261101/verification-report.html.

## 2026-11-01 — Table/group/pending-text cursor proof: PARTIAL

Owner authorizes cursor schema proof on copies in isolated Oracle lab, 512 MiB
per worker and unchanged caps. Evidence Reviewer then PC Steward; inline IDs
N/A, medium/routine. Base PC 05bd1f4, Core 3e74f98/Service a572025, unchanged C1
package/source candidate. Scope: external lab verification files, this contract
and generic-design link. Proof budget: nine small genuine PDF cases, live V2
transport after producer exit, pre-layout source test oracle, bounded negative
mutations, one fresh review and one fixture repair. Two previously unrun cases
completed separately after a golden assertion failed; candidate scripts stayed
unchanged and the original FAIL remains. No Core/Service/C1/codec edits, fake
runtime/helper cursor substitution, real data/API/DB/storage access, service
stop, UAT/SRS/Word or push/release/install. No Work/map promotion.

**PARTIAL_TABLE_GROUP_CURSOR_PASS_PENDING_LABEL_UNVERIFIED:** eight complete
case PASS; one completed generation with schema-valid facts but original target
assertion FAILED / NOT_OBSERVED. Do not summarize as 9/9 or full schema PASS.

### Confirmed bounded results

Every producer uses real validateTemplate,prepareGeneration,composeDocument,
createPdfEngine.generatePdfTo and pinned bundled resources; no fake TextRuntime,
private store reconstruction or synthetic call to formatCursor. Existing C1
package is unchanged (250 files, tar SHA256
3be3f511e6a58798504a7b486b031a48ffd708f2707a3422c22ffc77cae67aac).

| Passing case | Actual evidence |
| --- | --- |
| table-split | Text cursor names table/row/cell and first remaining lineIndex 2 |
| table-protected | Protected row yields first pending lineIndex 0 with correct cell ownership |
| table-rowspan | Two simultaneously unfinished cells: source text line 4 and ctext line 2, distinct correct cell/row relationships |
| group-members | companies groupIndex 0,itemIndex 2,lineIndex 0 and correct source/format attribution |
| group-keep-start | First group remains identified at its protected start |
| group-later | Correct later groupIndex 1; no fallback to first group's identity |
| label-members | Actual labelled-group member remainder itemIndex 2,lineIndex 0, correct cell and group |
| multi-instance | Same group names in two Format invocations keep separate node/format identities and areaEntryIndex 0/1 |

Source catalog is made BEFORE engine layout from validated composed nodes,
sourceMap, Format instances and actual table/row/cell membership. It is never
learned from the pending cursors. A fresh consumer checks full Result and
catalog against independent live-tree fingerprints/file pins through unchanged
V2 codec, plus final PDF hash/length. It imports no Core/template/fonts/native;
it DOES receive a small source index/text subset as an explicitly labelled
**TEST ORACLE**, not a complete source document or Core checkpoint provenance.

Eight passing cases contain ten cursors. Across those, 90 structural mutations
and 96 source-oracle relationship mutations are rejected (186 total). 76 wrongly
joined cursor objects still pass the structural type validator and fail the
independent relationship check: types alone do not prove source/table/group
ownership. The other relationship probes change section/Format attribution.
No double-counting of six original/replayed captures. Golden exact line
positions apply to these short-line fixtures, not arbitrary text wrapping.

### Target not observed — retain the failed expectation

label-pending asks for memberLabelText with no own lineIndex. Actual successful
Core generation reports memberText,groupIndex 0,itemIndex 0,lineIndex 0. Full live
facts/hash/source catalog match and the observed cursor passes structural/
relationship validation. The original consumer still throws
GOLDEN_PENDING_LABEL; a separate read-only diagnostic records
SCHEMA_PASS_BUT_ORIGINAL_TARGET_NOT_OBSERVED. It is NOT a repaired/passing golden
case or a Core defect finding. No expected value was changed to obtain PASS.

Relevant static explanation: template/groupLabels.ts:17 requires a nonempty
label; composition/validateRowGroupMetadata.ts:34 requires keepStart for label
groups. cellTableFlow.ts:130-138 handles keepStart and rewinds bounded cuts
before the pendingLabel assignment at149-154 and its cursor emission at94.
This may explain why this valid public route reports the member first; it is
NOT proof of universal branch unreachability. Internal helper controls from the
earlier round do not establish this real runtime route. Preserve optional
lineIndex until the source/compatibility decision is resolved.

### Failures, continuation and resource evidence

R1 completed six cases then stopped on an INVALID_TEMPLATE lab fixture: it
omitted group-name allowEmpty=false required for groupLabel. R2 corrects only
that declaration and reuses the six complete captures with explicitly pinned
ORIGINAL execution headers; no rerender/retagging. R2 then stops on the genuine
target-oracle mismatch above. R3 runs only previously unrun label-members and
multi-instance, with byte-identical fixture/producer/consumer/schema/codec to
R2, plus read-only diagnostic replay. This is not operational restart resume.
The single fresh review found no Important harness defect; no further variants
or repeated failing generation were added to force the pending-label route.

All three containers enforce 512 MiB memory and memory+swap, CPU1, network none,
readonly input/Core and 64-MiB tmpfs. No heap tuning/forced GC; OOMKilled=false
for all. Last R3 bundle peak 64.82421875 MiB and oom/oom_kill=0. R1 progress peak
67.84765625 MiB is PARTIAL; R2 final peak/events were not retained after its
failure. Do not claim a measured maximum across all runs or full staged-memory
acceptance. Owned containers stop; real-runtime metadata identity, protected
Core/Service HEAD/source hashes and the dirty two-file C1 candidate stay intact.

Next: review reachability/intended disclosure for the pending-label branch
before another targeted proof or changing schema. General sourceOffset/wrapping,
repeat attribution, diagnostic reason/payload completeness and other schema
families remain OPEN. Test catalog is not a new Core emission API; provenance,
preguard/error-order, whole-stage 512-MiB/storage/index bounds, UAT/SRS/Word and
Service adoption remain OPEN/BLOCKED. No production action is authorized.

Evidence:C:/Users/nekot/Documents/FlowDoc-recovery/core-cursor-lineage-20261101-r3/verification.json,
oracle/out-schema/suite.json,label-diagnostic/diagnostic.json and original R1/R2
progress/per-case facts.bin,test-oracle.bin,producer-notice.json,consumer.json/logs.
Original failures retained under core-cursor-lineage-20261101-r1 and-r2.
Report:C:/Users/nekot/.codex/visualizations/2026/10/27/01a17da5-b6ab-7ff0-a66c-e46d7e2cf42d/flowdoc-oracle-cursor-lineage-20261101/verification-report.html.

## 2026-11-01 — Pending-label cursor reachability review

Authority: owner's read-only review request after the partial cursor proof.
Planning Partner / Cross-Repo Boundary Reviewer then PC Steward; inline IDs N/A,
medium/routine. Base PC 629548d, Core 3e74f98/Service a572025 and unchanged C1.
Scope: inspect current owner implementation and retained proof, update this
contract/design link only. Proof budget: one source/control-flow review and
document/source-identity checks, no new generation, Oracle connection, helpers,
benchmark or product/lab-code repair. No new report/map/Work; no Core/Service,
real data/service, push/release/install action. 512 MiB per worker and existing
caps remain the requirement for any separately authorized subsequent proof;
this review makes no new runtime or RAM claim.

### Confirmed implementation path and explanation of the failed case

1. Public createPdfEngine accepts a ResolvedDocument. generatePdfTo reaches
   validateResolvedDocument BEFORE its first await/snapshot (pdf/createPdfEngine.ts:
   50-66). Row-group validation runs at composition/validateResolvedDocument.ts:
   68-69; a labelled group with keepStart=false fails
   composition/validateRowGroupMetadata.ts:32-39. Disabling keepStart would
   bypass the relevant admission contract, not prove the public runtime route.
2. The template route also rejects explicit keepStart=false for group labels
   (template/groupLabels.ts:7), requires a nonempty group-name field (:17), and
   expansion defaults labelled groups to keepStart=true
   (binding/expansionSteps.ts:45). Name emptiness and cursor lineIndex are
   separate concerns; nonempty group names do not guarantee a label cursor.
3. documentFlow.ts:132-135 sets bounded only inside a fixed Format and supplies
   the page sink. cellTableFlow has one production caller under src, this
   documentFlow route. Stop emission at cellTableFlow.ts:94/97 prepends the
   label cursor only if pendingLabel was assigned; that call supplies table/
   row/cell fields but no lineIndex. Ordinary pending text gets lineIndex and
   optional sourceOffset at90-92. FormatStop becomes FORMAT_CONTENT_OMITTED
   at documentFlow.ts:362.
4. In cellTableFlow.ts:130-138, keepStart includes the FULL label height and the
   first member's first measured item (or full protected row). An insufficient
   bounded cut rewinds to the group start. The later label check at149-154
   skips labels at/after that cut. This explains why the earlier fixture with
   a measurable first member reported memberText,lineIndex 0 instead of the
   expected memberLabelText without lineIndex. The earlier golden expectation
   was not established for that fixture; it is not a confirmed Core bug.

### Conditional reachability criterion, not universal dead-code proof

At a bounded first window, let b be the label/first-member start, L its total
label height including padding, F the keepStart firstHeight, M the earliest
undrawn NON-label item end relative to b (including bottom padding), G the
label span end and C the current cut. Ignore only the already-defined eps
tolerance when reading these inequalities; real checks retain it.

- keepStart allows the cut past this group only if C >= b+F; F >= L.
- pendingLabel needs min(C,G) < b+max(L,M), with the label intersecting the cut.
- In the tested case, the first member itself has a measured item, so M <= F.
  Valid geometry also reserves the label/item height in its span. The later
  inequality cannot hold after keepStart admits the cut, or the rewound cut
  excludes the label. That is a conditional explanation of this case.
- A candidate route requires M > F: for example an empty first member cell
  with no measured children, followed by a later member with measurable content,
  while a cut lies between b+F and b+M. This has NOT been validated/executed.
  Unbounded pagination can assign pendingLabel too, but stop() is invoked only
  by bounded paths (:191,217); assignment alone does not prove an emitted
  public diagnostic. No universal unreachability/removal decision follows.

Important distinction: measureText.ts:23-25 emits a positive-height blank line
for empty text, and its paragraph loop calls that path even for an empty raw
string. Replacing member name with '' does NOT create the no-measured-item case.
measureCellContent.ts:15-17 instead returns no items when childIds is empty.
Graph refs accept empty arrays (template/validateGraph.ts:23,124). The resolved
row-group validator checks source identities, spans and keepStart, but does not
itself require identical child structure in every member row (:46-68).

Those static checks make an asymmetric direct ResolvedDocument a PROPOSED
candidate, not proof that all admission checks accept it. A composed-template
case and a directly supplied ResolvedDocument are distinct public entry paths;
success of the latter would not establish Service template-route reachability.
Cell repeats are not a shortcut: row-group admission excludes cell-repeat owners
inside the group (template/rowGroups.ts:22); do not disable that guard.

### Proposed next bounded proof and schema decision

One focused two-control proof is sufficient to investigate this candidate:

- Retain the known composed-template/member-with-line control and its original
  no-label-cursor outcome. Do not change the old golden assertion into a PASS.
- On a synthetic COPY of a composed ResolvedDocument, retain the valid label,
  two member rows, keepStart=true, group/source/Format identities and span2;
  remove the first NON-label member's text subtree/source entries and set only
  that cell's childIds empty. The second member keeps real content. No private
  intent or helper cursor is fabricated. Admission MUST occur through the
  unchanged public engine; reject/stop if invalid, without weakening Core.
- A small fixed frame should exercise the interval above if genuine measured
  geometry provides it. Illustrative relative values F=28,M=36,C-b=32 are
  design arithmetic ONLY, not measured native metrics or an accepted fixture.
  Bound any follow-up to 512 MiB, unchanged caps and one selected input; do not
  sweep heights/rewrite runtime or add broad stress to force a branch.
- If admitted and observed, verify label node/table/group identity, absent
  lineIndex and absent member itemIndex, exact V2 tree transport after producer
  exit and the final file binding. If not observed, retain NOT_OBSERVED and
  reconsider the path/contract; do not manufacture coverage using internal
  formatCursor or a sink that changes bounded behavior.

Schema decision remains: keep lineIndex optional; never default a label cursor
to lineIndex 0 or itemIndex 0. The source validator explicitly distinguishes
group-level label attribution from member ordinals (:48-55). Codec acceptance,
structural types and TEST-oracle ownership do not imply a real Core checkpoint
provenance capability. No product/schema change is authorized by this review.

Review outcome: source explanation for the old case is complete; a concrete
conditional candidate and admission-first proof are ready for review. Runtime
label-cursor reachability, full diagnostic semantics and all previously open
preguard/512-MiB/adoption gates remain UNVERIFIED/OPEN. Original eight PASS,
one target NOT_OBSERVED and all failed records stay unchanged.

## 2026-11-01 — Empty first member / public Core label cursor: bounded PASS

Owner authorizes the reviewed empty-cell/later-text proof on copies through
unchanged Core admission, Oracle lab 512 MiB per worker and unchanged caps.
Lab verification then Evidence Reviewer / PC Steward; single-room IDs N/A,
medium/routine. Base PC b94b9ac, protected Core 3e74f98/Service a572025 and unchanged
two-file C1 candidate. Scope: external lab harness/results and this contract/
design link only. Proof budget: two matched small controls at one selected
60-pt frame, genuine admission/public engine, producer-exit V2 parity and three
absence-to-zero negative controls; one fresh review, no repair or height sweep
needed. No Core/Service/C1/codec/schema code edits, private state reconstruction,
runtime/validator override, real data/API/DB/storage access, service stop or
push/release/install. No new Work/map or full-stage acceptance.

**PASS_BOUNDED_PUBLIC_RESOLVED_DOCUMENT_PENDING_LABEL:** the previously
unverified direct-input candidate is admitted and produces the real target.
This does not change the older composed fixture's NOT_OBSERVED/failed golden
record or establish Service template-route reachability.

### Matched input, admission and exact mutation containment

Both cases start with identical validated template/request and composition:
label G, two members FIRST/NEXT, fixed frame 60 pt, keepStart=true and label
rowSpan/memberCount 2. The composed-control is unmodified. The target uses a
structuredClone of that composed ResolvedDocument, empties ONLY the first
NON-label cell's childIds and removes that text block and its source entries.
The second member and valid label stay intact. No textual empty-string shortcut.

The retained on-disk resolved inputs independently differ at exactly four
allowed paths: first-cell childIds, one text-block node, its sourceMap entry
and its bound text-leaf sourceMap entry. Template and request files are byte-
identical between cases. Admission logs preserve the frame, group/label span,
first/second child IDs and exact removed-node/source ledger.

The existing compiled validateResolvedDocument returns issues=[] for BOTH.
This internal validator import is a labelled verification gate, not a newly
supported public export. Both then call the unchanged public-export PDF engine
function via its pinned dist entry; it independently validates before snapshot
and succeeds. No package-name export-resolution or Service wiring proof is
claimed. Producer also checks engine execution did not mutate its input tree.

### Observed cursor and transport result

- Composed control: memberText,itemIndex 1,lineIndex 0, no label cursor.
- Empty first cell: memberLabelText with correct node/source/table/first-member
  row/label-cell/group identity, groupIndex 0. Exactly one label cursor; lineIndex,
  itemIndex and sourceOffset are ABSENT own properties, not undefined or zero.
- Both outputs pass the unchanged lab structural cursor validator and independent
  pre-layout TEST catalog relationship checks. A fresh consumer after producer/
  descendant exit verifies complete live Result/catalog fingerprints, declared
  file pins and final PDF hash/length through unchanged V2. It loads no Core,
  original template/font/native resource; the small TEST source catalog is not
  product provenance or an implemented checkpoint fact API.
- Three lab role-oracle controls reject inserting lineIndex 0,itemIndex 0 or
  sourceOffset 0 into the observed label cursor. This is not a claim that Core
  has a public output-schema validator or was changed to reject such objects.

The source review's conditional empty-cell path is now CONFIRMED at runtime
through direct ResolvedDocument input. It is not dead code for all admitted
public Core inputs. Preserve optional cursor fields and group-level versus
member-level identity; do not synthesize a member ordinal/baseline line number.

### Resource/ownership boundary and remaining work

Single owned lab container enforces 512 MiB memory and memory+swap, CPU1,
network none, readonly input/Core and 64-MiB tmpfs. Entire two-case bundle peak
**63.1171875 MiB**, oom/oom_kill remain 0, no heap tuning/forced GC. Four child
processes exit normally with namespace clear before stage changes. Container
stops; real-runtime metadata identities stay unchanged. Pinned Core package
all 250 files and protected source/HEAD/C1 state stay unchanged.

A single fresh bounded review found no Important harness defect; stop after
acceptance, with no added sweeps/stress/Word/UAT/SRS work. Earlier eight case
passes and the original one NOT_OBSERVED remain their own historical outcomes;
do not relabel them 9/9 using this different matched input.

The no-lineIndex label-shape reachability question is closed for this direct
Core input. Whether an ordinary Service template can produce the asymmetric
member structure is still UNVERIFIED. General wrapping/sourceOffset/repeat
semantics, other diagnostic/resource/section/adaptation schemas, Core-emitted
provenance, preguard API/error order, whole-stage 512-MiB/storage/index bounds,
Word and Service adoption remain OPEN. No product repair is established or
authorized by this proof.

Evidence:C:/Users/nekot/Documents/FlowDoc-recovery/core-pending-label-20261101-r1/verification.json,
oracle/out-schema/suite.json and cases/<name>/{admission.json,resolved-input.json,
producer-notice.json,facts.bin,test-oracle.bin,consumer.json,artifact.pdf}.
Harness and unchanged copied codec/schemas retained with packet transport hashes.
Report:C:/Users/nekot/.codex/visualizations/2026/10/27/01a17da5-b6ab-7ff0-a66c-e46d7e2cf42d/flowdoc-oracle-pending-label-20261101/verification-report.html.
