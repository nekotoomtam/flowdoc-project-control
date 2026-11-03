# DOCX1800 budget diagnosis and proposed repair plan

## Authority Boundary

Owner: FlowDoc Project Control for this diagnosis and cross-repository plan;
Core owns rendering/measurement/XML changes and Service owns API propagation.
This is a new single-room discovery scope under the explicit2026-11-03 request,
not a reopening of the completed model20 transition or a product-readiness map.
Execution IDs are not applicable. Role: Evidence Reviewer, then Planning Partner
and Project Control Steward. Work size medium; risk routine for isolated,
read-only discovery. No product implementation is authorized by this document.

The owner requested exact diagnosis and a repair plan first,512MiB/worker and
unchanged budgets, with no original data access/change, original service stop,
merge, push, release or installation. Only original-container identity metadata
was compared. Oracle here means the OCI VM; this Core-only proof uses no DB
connection. The earlier Service lab uses PostgreSQL18, not Oracle Database.

Current immutable inputs: Core6f36c42e51f7dc04fe42b837430f8369541ba707;
Service db15e9d45973fb3f7682ee8b6bae37c5d82124a4;
PC0024234d76c68ece741e9ed2cc5fdfc02a3de53f before this plan.
The exact262-file installed Core tree is47cdac6d28661e1e98e02603e04e5a80e6e6d6254adaf3f9d16e65016f9cb427,
from archiveef82f85163be57159c89dd64a535efd11a8791d4c7274f16ae5bb1670cf7aba8.

Evidence directory:
`C:/Users/nekot/Documents/FlowDoc-recovery/docx1800-budget-20261103/`.
Primary evidence: `diagnosis.json`, `measurement4/oracle/receipt.json`,
`measurement4/oracle/observe/result.json`,
`measurement4/oracle/native-observe/result.json`, and its `parts/` XML/rels.
The earlier API refusal is retained under
`model20-only-20261103/model20-runtime-faults4-child-probe/`; it establishes
the Core error code but lacks the exact underlying budget/path.

## Confirmed diagnosis

This is the current model20 text-only synthetic fixture, not the older
72000-run historical1800-row fixture and not full UAT/SRS. It has1800 authored
paragraphs,36 UTF-16 units each,64800 authored units total, one Section and no
images. Its validated template fingerprint is
705aedd73be735a3b2b5cd39efa3a1b18cfd9fc7b4e911df757eba6bb0383001,
exactly the earlier Service task pin. Input hashes are in the packet/results.

### Gate1: source shaping requests, before any XML serialization

Default `generateDocxTo` returns:
`DOCX_OUTPUT_BUDGET_EXCEEDED`, path `source-layout.measurement`, message
`Source shaping budget exceeded`; outputBytes0 and staged-output abort.

An external inspector reads the original guard at row1171:

| Counter | Observed at refusal | Existing limit |
| --- | ---: | ---: |
| Document shape requests |8193 |8192 |
| Document shaped UTF-16 units |216502 |1048576 |
| Current block requests |3 |2048 |
| Current block shaped units |52 |262144 |

The failing block is
`section-instance-first~area-parts~entry-1170~format-item~text`, containing
`RESOURCE-ROW-1171 before-full ไทย EN`. Only the document request counter
exceeds its limit. The65536 authored-unit source-guide budget is also not the
cause: this entire fixture contains64800 units.

Implementation path:

1. `flowdoc-core/src/docx/engine.ts:176–178` prepares source layout by default.
2. `src/docx/source-layout.ts:55–90` selects eligible ordinary paragraphs and
   charges requests/units before invoking the text runtime. The guard at86 is
   intentional work protection and must remain effective.
3. `src/layout/measureText.ts:20–21` caches candidate shapes only within one
   measurement. Its boundary-search loop at49–67 shapes growing prefixes to
   locate a line. Many short, fitting paragraphs still spend multiple calls.
4. `flowdoc-service/src/tasks/render-child.ts:243–248` propagates the first Core
   issue code; `src/tasks/public.ts:31` maps this shared code to LIMIT_EXCEEDED.
   The public code alone cannot identify which budget failed.

Classification: confirmed capacity refusal and identified work amplification;
the protective guard itself is not a proven defect. Improving the algorithm
without altering layout/bound semantics remains a proposed change.

### Gate2: native-policy diagnostic reaches the XML guard and also refuses

The existing public option `textLayout:'native'` was used solely as a
diagnostic to expose the next gate, without changing Core/Service files,
thresholds or template data. It is not an accepted repair or Word-fidelity
result. It returns the same code at `word/document.xml`, outputBytes0.

| XML metric | Actual |
| --- | ---: |
| Complete package XML plus rels nodes |97411 |
| `word/document.xml` nodes |96797 |
| Cumulative counter when document guard fails |96809 |
| XML node cap |50000 |
| Drawings |0 of10000 |
| Authored paragraphs retained |1800 |
| Text runs |5912 |
| Run-property subtree nodes under actual runs |56160 |
| Paragraph-mark property subtree nodes |16200 |

The cumulative96809 includes12 document-relationship nodes; it must not be
reported as the document part's own count. Every XML/rels part was independently
parsed with ElementTree and its element count matched the writer's regex rule.
All1800 paragraph strings match input exactly and in order in the captured
private XML. These are diagnostic package parts, not a published valid DOCX.

Repeated `w:rPr` has font, size, bold/italic and complex-script properties;
there are6 exact actual-run property groups. Simple arithmetic for sharing
only those run properties still projects53155 total nodes, above the cap.
Paragraph/paragraph-mark ownership and inheritance must therefore be included
in a repair study. This projection is not transformed XML or semantic proof.

`src/docx/writer.ts:147–174` invokes current compaction only after
`sourceSerialized` is true; the native diagnostic observes false. The private
planner additionally rejects absent source ownership at
`src/docx/compaction/package.mjs:16`. It is incorrect to merely set that flag
true, remove the ownership check, or claim that UAT/SRS source-layout
compaction already covers this path.

## Bounded proof and limitations

Actual Linux/amd64 worker containers use512MiB, memory-swap512MiB (swap0),
2CPU, network none, read-only product/input mounts and no Docker socket.
Accepted shaping observation peaks102834176 bytes (98.07MiB); the native XML
diagnostic peaks200835072 bytes (191.53MiB). Both have zero OOM/oom_kill.
The original control's error, warnings, input hashes and outputBytes match the
shaping observation. The Core package tree remains exactly unchanged before
and after; all owned containers stop, original identities remain stable.

Failed observation namespaces are retained, not passes: the initial XML
breakpoint could not see an earlier refusal; subsequent probes attempted to
read optimized-away lexical locals. Accepted measurement4 reads only live
counters. The final counter/result agrees with the uninstrumented control.
No full-suite rerun is justified because product code has not changed.

The default path never produced XML, so its eventual XML count and DOCX/Word
layout after a future shaping repair remain unknown.97411 is specifically the
existing native-policy diagnostic. It cannot be relabelled as default XML.
This round does not test API recovery, universal document capacity, actual
Oracle Database compatibility, font activation/legal approval or native Word
visual fidelity. Earlier full UAT/SRS acceptance is not invalidated by this
different fixture, but is not proof of1800-row capacity either.

## Proposed ordered repair, not implemented

Goal: complete the generic1800-row DOCX path under existing shaping/XML/image/
byte limits and512MiB, preserving authored content and agreed Word layout.
No fixture names, record-number branches, lowered content or larger limits.

### R0 — prove measurement reduction before choosing a product algorithm

2026-11-03 outcome: evaluated on copies; **NOT ACCEPTED**. The tested generic
whole-line-fit-first method changes line layout for a real native contextual
font. See the R0 outcome below. R1 remains gated; these acceptance boxes are
intentionally not marked complete.

- [ ] On external copies, compare the current prefix search with a proposed
  whole-line-fit-first or equivalent line-selection strategy. The primary
  candidate would shape a fitting paragraph once and reuse that exact result,
  reducing this fixture's repeated prefix requests without raising8192.
- [ ] Prove behavior for fitting/overflowing Latin, Thai marks, mixed scripts,
  contextual glyphs, ligatures, ink overhang, tabs, line breaks, grapheme-sized
  frames, fixed/cover/table/heading/keep/link/field boundaries and cancellation.
- [ ] Do not assume prefix width is monotonic or that whole-string glyphs can
  be sliced into equivalent prefix shapes. If equivalence is unproven, retain
  the old path for that class or return for design review; do not silently
  switch the document to native layout.
- [ ] Verify resource accounting still charges real retained/expensive work
  before it is performed; preserve all4 shaping limits and authored-unit cap.
  A cache alone or moving a counter after a cache does not meet this criterion.

This is the next recommended work. If it cannot establish a safe strategy,
discuss an explicitly disclosed, Word-tested native fallback for optional
guides as an alternative. Automatic fallback is not preapproved and does not
remove Gate2.

### R1 — implement the proven shaping change in an isolated Core candidate

2026-11-03: the bounded measurement/runtime candidate is accepted; see the
Linux package and whole-change review closure below. Affected Word regressions
here are the repository DOCX/Word-XML tests. Native Word rendering/pagination
and full-document acceptance remain the explicit R3 gate.

- [x] Add a regression that reproduces the exact8193-request failure before
  implementation, then proves successful completion of measurement within
  the unchanged limits, with equivalent measured output for eligible cases.
- [x] Implement only the R0-proven strategy in the actual measurement owner;
  preserve guarded fallback, failure and cancellation behavior. Core is owner;
  Service changes are unnecessary unless separate evidence proves otherwise.
- [x] Re-run affected line/source-layout/reading-plan/Word regressions, then
  the1800 case under512MiB. Stop OOM; record the next actual gate and its counters
  rather than claiming XML success when only measurement passes.

### R2 — original native generated-style proposal, superseded as the primary source-path strategy

2026-11-03 R2 discovery below establishes that style-only sharing cannot make
the actual source-guided fixture fit. The following original proposal is
retained as history and a possible subordinate optimization; it is not the
current implementation instruction. Use the latest R2 discovery/proposed plan
at the end of this document. No R2 implementation has been authorized.

- [ ] On captured external native XML, study sharing exact run properties AND
  repeated paragraph/mark properties. Preserve all text, language, `w:cs`,
  complex-script faces, explicit zeros, spacing, baseline, links, fields,
  bookmarks, relationships and unknown extensions; do not merge semantic
  barriers just because some properties look alike.
- [ ] Prefer generation-time reuse in `src/docx/text.ts` plus an explicit
  internally owned style registry. If extending the ZIP compactor instead,
  define genuine native-generation provenance separately from source-layout
  ownership; never forge `sourceSerialized:true` or accept caller claims.
- [ ] Require count-before/apply-after validation, no-op byte preservation,
  collision/refusal/rollback tests, and bounded memory. XML plus rels must
  independently satisfy50000 nodes; target<=49000 for useful margin, without
  changing the actual hard cap. Run-only arithmetic53155 is insufficient.
- [ ] Prove effective style/cascade equality and complete ordered content,
  and compare Word rendering against a valid declared reference. Since the
  default1800 export currently fails, agree the reference before claiming
  full default-layout equivalence; smaller passing pieces alone are not
  whole-document pagination proof.

### R3 — integrated acceptance and package proof

- [ ] Exercise default1800 DOCX end to end, actual published ZIP/CRC/parts/rels/
  font/image identity, all1800 records, limits, cancellation/failure cleanup
  and Word review under512MiB. A copied/native diagnostic is not this pass.
- [ ] Re-run UAT/SRS full DOCX and their declared Word baselines, plus affected
  Core suites and exact packed-archive consumer checks. Under-budget unchanged
  paths must remain unchanged where promised; source compaction must not regress.
- [ ] Pin the checked package only in a separately authorized Service candidate;
  use real private-DB/API PDF/DOCX, diagnostics/reservations and prior failure
  cases as affected. Preserve public error compatibility; richer private budget
  evidence may be planned separately without exposing paths/data to clients.
- [ ] Report exact commits/digests/evidence and unresolved cases. No automatic
  merge, push, release, installation or original-data work.

## Stop and return conditions

Current discovery is complete; implementation remains unauthorized. The next
bounded request should start R0 proof on copies, not skip directly to a cache,
native-policy switch or new XML cap. Stop on unexpected OOM, source/package
mutation, incomplete content, unproven layout/ownership assumptions or a change
requiring architecture/contract expansion. No further experiments are required
to close this diagnosis.

## R0 outcome,2026-11-03: measurement reduction found, equivalence fails

This follow-up is the owner's explicitly authorized R0 copy-only proof. Core
and Service stay at the exact commits/tree above; PC plan input was9b8dbd9.
Single-room discovery IDs remain not applicable. No separate agent room or
implementation authority was created. The candidate is an external copy of the
exact packed `dist/layout/measureText.js`, with imports rebound to the unchanged
Core and one whole-line-fit-first branch before its original prefix search.
It does not alter counters, limits, source layout mode or product files.

Evidence:
`C:/Users/nekot/Documents/FlowDoc-recovery/docx-r0-line-measurement-20261103/`:
`verification.json`, `copy-only-diff.txt`,
`wiring2/oracle/proof/result.json`, and
`line-counterexample/oracle/proof/result.json` plus the two actual receipts.
The initial missing relative import in the external harness is a retained failed
prerequisite, not an algorithm test pass. Only the repaired external wiring is
used for the following results.

### Positive evidence, with its exact scope

- 17 bounded function comparisons agree, including fitting/overflowing Latin,
Thai marks, mixed text, a regular-font ligature sample, overhang-sensitive text,
tabs, line breaks, empty paragraphs, grapheme-sized frames, short first-line
width, and fixed/heading guards. This does not certify routing through all
protected source-layout owner contexts.
- All1800 fixture paragraphs return exactly the original per-paragraph measured
structures, including glyph/ink/line fields, on the tested bundled regular font.
The independent per-paragraph references require12600 requests across1800
separate bounded comparisons; they are not a successful unmodified full1800
document. Its original aggregate guard still refuses at row1171/request8193.
- The candidate sequence measures all1800 paragraphs with1800 requests and64800
shaped units. Its maxima are1 request/36 units per block, with736 authored units
remaining. All4 shaping limits and the65536 authored-unit budget stay unchanged.
This is a request-count reduction, not a measured7x latency claim or DOCX pass.

### Confirmed counterexample: both paths succeed, layout differs

A small self-authored lab-only font contains a valid contextual Latin GSUB
ligature for `a space b space a`. No original/product font is edited or claimed
to have this behavior. The actual pinned native shaper and segmenter process
the same text `a b a`,12pt font and10pt frame:

| Legal prefix | Actual native extent |
| --- | ---: |
| `a ` |9.6pt |
| `a b ` |19.2pt |
| `a b a` |6pt |

Actual ICU breaks are[0,2,4,5]. The old greedy prefix path sees19.2pt exceed
the frame and emits3 lines: `a `, `b `, `a` (60pt total). The candidate sees
the complete6pt shape fit and emits1 line: `a b a` (20pt). All authored text is
retained, but line count/height differs, violating the owner's same-layout
criterion. No glyph slicing or fabricated widths are used.

The contextual font's SHA, native glyph results and independent binary GSUB
inspection are in `verification.json`. Its actual5-component substitution is
authoritative; a copied metadata description still abbreviated the earlier
3-component fixture and is explicitly corrected in that derived record, while
raw evidence remains unchanged. This is not evidence that bundled Sarabun has
the same issue or that this font has passed a product font-import/Word gate.

An earlier native contextual case also changes rejection into successful
layout. The successful3-line→1-line case above is sufficient to reject the
generic shortcut, independently of whether the earlier rejection should one
day be treated as a separate layout bug.

### Disposition and next decision

**FAIL_R0_EQUIVALENCE_DO_NOT_START_R1.** Lab execution/isolation succeeded; the
candidate method did not meet acceptance. Preserve the old path and return to
design review as required by R0. Do not patch around this font, silently switch
to native policy, assume prefix monotonicity, count work after a cache, or raise
a budget. A subsequent scope must establish a genuine conservative eligibility
proof for a shortcut or another algorithm before any Core implementation.

Not proved: complete fixed/cover/table/keep/link/field/cancellation integration,
all supported font behaviors, whole-document source guides/pagination, full
DOCX/Word equivalence, Service API acceptance or a repair of the separate97411
XML-node refusal. These are not waived by the1800 positive comparisons. Further
experiments were stopped after recording the decisive counterexample.

Both successful proof lanes run in fresh Oracle/OCI containers at512MiB,
swap0, network none and read-only product mounts. Actual cgroup peaks are
58765312 bytes (56.04MiB) and49201152 bytes (46.92MiB), no OOM/oom_kill. They
measure the function-level workload, not full DOCX memory capacity. The Core
package tree remains47cdac6d..., owned containers are stopped and original
container identities remain stable. No original API/SQL/storage data access,
original service stop, Core/Service edit, merge, push, release or installation.

## Pre-R1 review,2026-11-03: preserve decisions, exact reuse is insufficient

The owner's next request authorized review and external-copy experiments,
not Core/Service implementation. PC input is21dba8f; Core6f36c42 and Service
db15e9d remain unchanged. Single-room discovery IDs are not applicable. This
review preserves the previous whole-line-first rejection; it does not reopen
or relabel that failed R0 method as accepted.

### Reviewed alternative

The external copy keeps the original legal-prefix loop, first-overflow stop,
grapheme fallback, normalization, first-line width and actual glyph emission.
Only successful scalar extents of exactly the same shaped text can be reused
under a private lab-owned font/runtime context, selected font ID and size.
Every current width comparison still occurs in the old order. No whole-line
shortcut, glyph slicing or source/native-layout policy switch is introduced.

The proof limits retained entries to128 and aggregate key content to16384
UTF-16 units; retained values are scalar extents, not shared glyph arrays.
These are explicit count/content bounds, not exact V8 heap-byte claims.
The existing8192/1048576 document and2048/262144 block shaping guards remain
before actual runtime shaping;65536 authored units also remain unchanged.
`spacingProbe` opts out because its shaped extent can depend on node ID.
The lab owner/epoch is not a production cache API or accepted trust contract.

### Actual Oracle/OCI result

External evidence directory:
`C:/Users/nekot/Documents/FlowDoc-recovery/docx-r0-order-preserving-review-20261103/`:
`verification.json`, `packet.json`, `copy-only-diff.txt`,
`oracle/receipt.json` and `oracle/proof/result.json`.

- All19 bounded function cases agree. The earlier contextual-font case stays
  at3 lines in both methods, with complete returned measurement structures
  equal. Independent font-table comparison confirms the same semantic font
  tables as the earlier counterexample, excluding only timestamps/checksum
  adjustment. It is still a self-authored lab font, not original/product data.
- The capped1800-row attempt produces1365 paragraph measurements exactly equal
  to their independent original references, then refuses row1366 at request8193.
  Shaped units are240292; the other shaping budgets are not the failing guard.
- The original1800 independent reference paragraphs make12600 high-level
  `TextRuntime.shape` requests. The exact query corpus contains10801 distinct
  (font ID,size,text) keys. Only `RESOURCE-` repeats,1800 times. Even ideal
  unlimited exact reuse saves1799 requests, leaving2609 more than8192.
- The actual bounded memo peaks at128 entries and15133 key UTF-16 units.
  The aggregate refusal is not a completed1800 document or published DOCX.

10801 is a limit of this exact-reuse strategy on this corpus, not a theorem
that all algorithms require that many shapes. These counters are logical
`TextRuntime.shape` calls; a mixed-script call can issue multiple native IPC
requests and must not be confused with a packet count.

The one fresh worker has512MiB, swap0, network none, read-only product mounts,
actual cgroup peak61927424 bytes (59.06MiB), no OOM/oom_kill. Core package tree
47cdac6d... and source packet hashes remain unchanged; owned containers stop
and original container identities remain stable. No DB, original API/SQL/
storage data access, original service stop, merge, push, release or install.

### Decision and proposed next proof

**Review complete; NOT_READY_RESOURCE_ACCEPTANCE_FAILED. Do not start R1.**
The bounded successes support retaining original decision order, but exact
reuse alone cannot solve this1800-row budget. No production cache is approved.
Live native-session failure/epoch invalidation, cancellation during cache hits
and actual source-layout owner integration remain unproved. In particular,
the no-op abort check in the stable-session throughput fixture is not evidence
of cancellation correctness. No full source-guide, DOCX, Word or Service/API
acceptance is claimed.

Proposed next discovery, R0-B (not implementation authority): investigate a
conservative **per-prefix fit proof**. For each prefix in the unchanged order,
skip exact shaping only if a justified upper bound proves that same prefix
fits the current frame; otherwise use the old exact measurement and stop rule.
This would not infer prefix behavior from the final full-line width or assume
monotonic shaping.

Before such a method could enter R1 it needs:

1. A clear proof source owned by Core's runtime/font snapshot, covering the
   actual shaper, selected font bytes/features, size, script and ink/advance
   context. `SourceFontMetrics.advance/ink` exposes nominal TrueType glyph
   metrics; it does not establish a contextual GSUB/GPOS prefix bound.
2. Outward-safe numeric bounds, unknown/unsupported-case fallback, explicit
   probe/session/cancellation handling and bounded proof computation/storage.
   The proof work itself must be accounted before it is performed.
3. Adversarial contextual-font and boundary comparisons, full returned-line
   equivalence for eligible cases, and a real capped1800 measurement pass.
   Sampled font calibration or a font/fixture-name whitelist is insufficient.
4. Separate later acceptance for the remaining XML guard and Word/full-document
   behavior. A successful fit-proof spike would still not complete those gates.

Do not substitute a larger counter, reset8192 between chunks, charge many
logical shapes as one batched request, or silently fall back to native guide
policy. Those choices change accounting or layout contracts. R0-B feasibility
is currently unknown and belongs in a bounded discovery scope before R1; this
review makes no claim that the proposed bounds already exist or will suffice.

## R0-B outcome,2026-11-03: bounded prefix-fit proof succeeds on copies

The owner explicitly authorized the proposed copy-only prefix-fit study. Its
input is PC68c2e8f, Core6f36c42 and Service db15e9d. Role remains discovery/
Evidence Reviewer; single-room execution IDs are not applicable. No product
implementation, old-round reactivation or integration is performed.

**PASS_R0B_BOUNDED_COPY_PROOF_NO_PRODUCT_CHANGE.** The proof is limited to its
declared eligibility profile and function-level integration. It is not a full
Core/Service/DOCX/Word acceptance, a general font theorem or a completed R1.
The earlier whole-line-first failure and exact-reuse insufficiency remain true.

Evidence directory:
`C:/Users/nekot/Documents/FlowDoc-recovery/docx-r0-prefix-fit-proof-20261103/`.
Primary records: `verification.json`, `proof-run2/packet.json`,
`proof-run2/oracle/receipt.json`, `proof-run2/oracle/proof/result.json`,
`proof-run2/oracle/proof/certificate.json` and `certified-prefixes.json`.
`audit/` retains the initial font audit; `proof-run1/` retains the cancellation
RED. Existing cached fontTools/native resources were used, with no installation.

### Criterion and why it preserves the original decisions

The external copy still visits each legal prefix/grapheme in the old order and
stops at the first actual overflow. It uses an upper bound only when that bound
itself fits the current frame plus the original epsilon. Otherwise it executes
the original exact measurement. Chosen lines always obtain their actual native
glyphs; proof values are never used as output advances, heights or glyph data.

The private laboratory compiler:

1. Derives an ASCII alphabet from the document input, not a font/fixture-name
   whitelist. Selected Unicode cmap mappings must agree. Unknown text, sizes,
   font identity and node-dependent spacing probes use the old path.
2. Computes a conservative glyph closure across all GSUB primitive actions.
   Reachable glyph growth/deletion, missing glyphs and mark classes refuse the
   profile. Thus an eligible N-character prefix emits no more than N glyphs.
3. Bounds non-contextual GPOS advance/placement effects per glyph. Lookup-stage
   multiplicity is conservatively bounded by distinct feature tags plus the
   required-feature allowance, using pinned rustybuzz0.20.1 `ot_map.rs` and
   pair-position source. Device/variation, contextual positioning, reachable
   mark/cursive, legacy kern/AAT and unknown profiles refuse. Negative advance
   cannot be permitted by a certificate.
4. Uses TrueType ink boxes and outward IEEE-754 rounding to bound the complete
   cursor/ink extent. If A bounds nonnegative advance, P bounds absolute x
   placement, and L/R bound glyph ink, an N-glyph envelope includes both N*A
   and (N-1)*A+P+R, plus any possible negative left ink. Every floating operation
   is rounded outward with `nextUp`; nominal advances alone are insufficient.

The target regular font certificate has50 reachable glyphs, unitsPerEm1000,
max advance831, min advance231, x-placement bound0, left-ink bound0 and
right-ink bound803. Its compiler records1374 bounded work units, below1000000.
These facts are tied to actual font bytes b8150084..., Core package tree47cdac6d...
and pinned native behavior. The laboratory certificate object is not a trusted
client-supplied JSON option or an approved product contract.

### Actual measurement and independent checks

| Metric | Result |
| --- | ---: |
| Complete candidate measurement sequence |1800 paragraphs |
| Complete returned measurement structures equal to original references |1800/1800 |
| Actual `TextRuntime.shape` requests |7918 of8192 |
| Native shaped UTF-16 units |237033 |
| Precharged proof-work units |498490 |
| Combined charged units |735523 of1048576 |
| Authored input units |64800 of65536 |
| Distinct regular-font certified prefixes checked by separate native oracle |3531 |
| Independent Python outward-arithmetic comparisons |3531 |

Original references require12600 requests across1800 separately bounded
paragraph comparisons; they are not an unmodified full1800-document pass.
The candidate attempt keeps one unchanged document-wide native request budget.
It has274 native requests of headroom; this is not broad capacity headroom.

Proof attempts are themselves capped at8192. Each reserves2*N+8 work units
before alphabet scanning and N outward cursor steps, charged conservatively
alongside native units under the existing global/block unit ceilings. Once
proof work is exhausted, the old measurement resumes; no counter is reset and
no collection of logical shapes is charged as one batch. The verification
oracle has its own bounded test budget and is not hidden production work.

All22 ordinary/opt-out/cancellation cases agree. Three contextual-font frames
give3/3/1 lines in both methods, preserving the former3-line counterexample.
Six further comparisons cover positive GPOS placement/advance, explicit GSUB
growth refusal and negative-advance refusal. Unsupported profiles really fall
back; they are not reported as eligible proofs. No observed certified prefix
exceeds its computed bound. The oracle uses actual native measurements, not
sampled widths to construct a certificate.

### Cancellation correction and remaining ownership gate

The first run's cancellation test was RED: its copy guard threw signal.reason,
whereas pinned `createTextRuntime` closes synchronously on abort and checks
`closed` before signal.reason. The second copy guard mirrors that existing
closed-runtime behavior and matches the original error. The failed run is
retained, not relabelled PASS. Product R1 must share the actual runtime owner's
check/epoch/invalidation mechanism, not duplicate an error string or introduce
a second cancellation policy. Arbitrary native-session failure recovery is not
established by this one deterministic cancellation comparison.

The final worker uses512MiB/swap0,2CPU, network none and read-only product mounts;
actual cgroup peak62943232 bytes (60.03MiB), no OOM/oom_kill. Its packet and exact
262-file Core package tree stay unchanged, owned containers stop and original
container identities remain stable. No original API/SQL/storage data access,
original service stop, Core/Service edit, merge, push, release or installation.

### Proposed R1 boundary, still not started

This evidence supports preparing a bounded Core candidate implementation of
the declared prefix-proof/fallback policy. Before product acceptance, R1 must
prove the real private owner, native generation/failure lifecycle, cancellation,
all protected source-layout routing, work accounting and cleanup. Unknown cases
must retain the original path and the source-of-truth resource snapshot.

After that integration, re-run the actual1800 source-guide pipeline and observe
its next real XML/drawing gate under512MiB. The earlier97411-node count belongs
to a native-policy diagnostic, not this now-measurable default path. Full DOCX,
Word/pagination, package consumers and Service/API acceptance remain separate.
Do not infer that this R0-B proof completes R1/R2/R3 or authorizes product edits.

## R1 partial outcome,2026-11-03: measurement passes; stop on test-worker OOM

The owner subsequently authorized R1 Core candidate implementation and real
runtime cancellation/failure checks, keeping512MiB/worker, original caps and
the no-original-data/service/no-merge/push/release/install boundary. This is
single-room implementation; execution IDs are not applicable. Base Core6f36c42,
Service db15e9d, PC9eec480. The existing clean isolated Core candidate is reused.

**STOPPED_R1_INCOMPLETE_TEST_WORKER_OOM.** R1 acceptance boxes remain open.
The Core candidate has eight uncommitted changed/new files. Do not promote it,
commit it as verified, start R2/R3, or infer cancellation/failure readiness.

External evidence:
`C:/Users/nekot/Documents/FlowDoc-recovery/docx-r1-prefix-runtime-20261103/`.
See `verification.json`, `progress.txt`, `candidate-tracked.diff`,
`untracked-source/` and `green3/oracle/receipt.json`. File hashes preserve the
unfinished local candidate. Service is not edited.

### Candidate behavior and confirmed bounded results

- Runtime-private capabilities hold font certificates compiled by packaged
  Python/fontTools code from owned DOCX font snapshots. Documents cannot supply
  a certificate. The existing explicit `pythonExecutable` resource is optional;
  if unavailable, unsupported or exhausted, measurement uses the original path.
  `DocxResources` admits that existing optional resource key; no required public
  option or new installed dependency is introduced. This additive boundary
  still needs final package/consumer review.
- `measureText` retains prefix order, first-overflow behavior and actual output
  shaping. Source measurement charges proof work alongside native units without
  raising or resetting the original global/block limits. The owner connects
  close/abort and observed native-shaper failure checks; full lifecycle
  acceptance remains incomplete.
- RED on the frozen original completed1170 paragraphs and refused request8193.
  The real compiled candidate then completed all1800 function-level comparisons
  with complete returned structures equal to independent original references:
  7918 actual shape calls,735523 combined charged units, including498490 proof
  units. The original references are independently bounded, not a successful
  unmodified full-document baseline.
- The native oracle validates3531 certified prefixes. Twelve generated-font
  comparisons preserve success or refusal, including the contextual3/3/1-line
  case. The real default public DOCX engine proceeds past source measurement
  and refuses `word/document.xml` with `DOCX_OUTPUT_BUDGET_EXCEEDED`; it writes
  zero output bytes. This is not full DOCX/Word acceptance, and no exact new
  default-path XML count was collected.
- That proof worker exits0 with peak379908096 bytes (362.31MiB), no OOM. The
  separate Linux Vitest worker then reaches536870912 bytes, exits137, and records
  one `oom`/`oom_kill`. The final test report is unavailable. Stop further lab
  runs under the declared OOM rule; do not raise RAM, silently restart, or call
  the suite PASS. These facts establish test-worker OOM, not its precise cause
  or an application-worker OOM.

Earlier retained attempts are not relabelled: `green1` comparison harness failed
to capture an expected narrow-frame LayoutError; `green2` reached serialization
but lacked xmldom in its tool-module mount. `green3` uses already cached
xmldom0.9.12 read-only. No installation was performed.

### Coverage gaps and proposed return route

The local TypeScript build and diff check pass. A selected local runtime/source
word suite passed53 tests with14 skipped. The Windows full suite has1255 passes,
16 failures and49 skips:14 failed native metric/geometry assertions lack their
Linux executable runtime; two concurrent-run failures in rowGroups and
composeTaskDocument pass when rerun separately (39 tests). This is not a passing
full suite. The Linux interrupted suite does not close those gaps.

The candidate contains tests for close/abort, native-shaper death, compiler-child
cleanup and fallback, but their complete Linux results are unverified. Three
additional lifecycle tests (segmentation failure, pending-request abort and
missing compiler) were added locally after the `green3` snapshot and have not
run. Code inspection suggests the prefix guard may miss failed segmenter state;
this is a probable gap, not a confirmed runtime finding. Do not fix it without
observing the regression and then proving the correction.

Next proposed work, not executed: inspect test-runner overhead and split the
acceptance suite into bounded fresh workers, each retaining512MiB and the
unchanged actual document-wide budgets. This is test isolation, not document
batching or budget reset. Confirm/fix the segmenter guard if reproduced, finish
cancellation/failure/cleanup and protected-source-route checks, then verify the
packed consumer and obtain one independent whole-change review. Product commit
and R1 acceptance remain gated on that evidence. Current original container
identities and frozen package tree are unchanged; no owned lab container remains
running. No map, old execution registry or completed acceptance was rewritten.

## R1 grouped continuation,2026-11-03: lifecycle fixed; stop on isolated writer-suite OOM

The owner explicitly resumed OOM diagnosis and grouped R1 tests, keeping
512MiB/worker, original document-wide caps and the no-original-data/service/
no-merge/push/release/install boundary. Stop on any further OOM. This remains
single-room Core implementation followed by verification; IDs are not
applicable. Input Core6f36c42 and unfinished candidate, PC8a7cb53, Service db15e9d.
The preserved candidate matched its prior tenable eight-file input manifest.

**STOPPED_R1_GROUPED_OOM_ACCEPTANCE_INCOMPLETE.** The new OOM stop is active.
Core now has ten uncommitted changed/new files. Lifecycle evidence improves;
R1 acceptance, package readiness, final review and product commit remain open.

Evidence root:
`C:/Users/nekot/Documents/FlowDoc-recovery/docx-r1-grouped-20261103/`.
Use `verification.json`, `progress.txt`, `candidate-tracked.diff`,
`untracked-source/` and each run's immutable packet/receipt. In particular,
`remaining2/oracle/docx-nativeRunBudget.test/` retains the new OOM's log,
per-process samples, cgroup counters and telemetry. Prior failed runs are
retained with their actual outcomes, not relabelled PASS.

### Confirmed lifecycle defects and bounded fixes

1. **Failed segmentation could leave an admissible prefix proof.** The first
   lifecycle RED returned `true` after the real segmenter failed. Core now
   exposes its actual session failure check to the same runtime guard used by
   breaks, shaping and prefix proof. The regression subsequently rejects the
   proof. This is actual runtime evidence, superseding the earlier probable
   risk; it does not rewrite that earlier evidence as confirmed at the time.
2. **Compiler cancellation returned before its child exited.** With executable
   lab fixtures, both ordinary and TERM-ignoring compilers remained alive when
   `runtime.close()` returned. Core now waits for the real child `close` event
   and explicitly sends SIGKILL on owner cancellation. `execFile`'s timeout
   killSignal is not forwarded to spawn's AbortSignal behavior; the initial
   attempted fix still timed out on the TERM-ignoring case and is retained.
   Both variants now close within the regression's two-second bound, and the
   child PID no longer exists before the close operation is accepted.

The lifecycle GREEN has nine executed passes: closed/aborted owner, unsupported
or exhausted proof fallback, killed idle real shaper and fresh-runtime use,
compiler cleanup with and without TERM handling, failed segmentation, abort of
a pending native request, and unavailable compiler fallback. The1800 case was
selected separately and passes; its skip in the lifecycle group is not a gap.
A new public-engine regression cancels after real prefix initialization,
receives `DOCX_CANCELLED`, writes zero bytes and removes the owned font snapshot
directory. It passes within the25-test source-layout group.

Lab setup issues were resolved without product workarounds: `/tmp` was
confirmed `noexec` with an EACCES execution probe; only fresh test-container
tmpfs mounts permit the trusted executable fixtures. A required explicit old
segmenter fixture was initially omitted, then found non-executable in the
cache. Its cached bytes/mode remain untouched. A fresh private copy verifies
SHA256 b80f4e94bc52d38477f11070ade15f97781aa0eeb5927afa8b4d37dedbc7644d
and has executable mode. The compatibility regression then passes. No install
or original-service action was involved.

### Coverage achieved before the new OOM

There are575 distinct passing test cases across27 accepted groups, excluding
failed setup groups and duplicate reruns. The evidence manifest identifies each
case by file, index and name. This count is not a passing complete suite.

- Lifecycle9, complete1800 measurement1, source-layout25, runtime-1 group37.
- The accepted continuation contributes503 cases: corrected runtime
  compatibility, all seven layout groups, and DOCX groups through metricPairs.
- Measurement1800 retains the complete equivalent-output assertion and original
  request/unit ceilings. Prior compiled real-runtime proof records7918 requests;
  no counter is reset or document split to manufacture capacity.
- The source-layout group peaks at481607680 bytes (459.30MiB) with no OOM;
  lifecycle peaks at136241152 bytes (129.93MiB). Each group gets a fresh worker
  but every actual document keeps its original counters and caps.

### New OOM and what the evidence does and does not establish

The single-file `docx-nativeRunBudget.test` group reaches536870912 bytes,
records `oom 1`/`oom_kill 1`, and exits137. Execution stops immediately; fifteen
later groups are unrun and this group is incomplete. No named test completed
before its log ended. Do not infer which assertion or allocation triggered it.

Telemetry establishes that coordinator Node PID8 terminated, while its child
Node PID23 remained running briefly (reparented to PID1) before the container
namespace exited. At the highest sampled summed RSS, their RSS values were
328536KiB and203056KiB, alongside the monitor/shell. Summed RSS double-counts
shared pages and is not cgroup usage. The sampled cgroup maximum451899392 bytes
misses the actual512MiB peak between samples; use `memory.peak` for the cap.

This supports combined runner/child overhead as a contributor, not a claim
that Vitest alone caused all allocation or that the workload alone would pass.
The precise allocation and the old all-suite OOM's failing file remain unknown.
Code inspection establishes this test uses `createDocxEngine(fonts())` without
shaper/segmenter/Python, so its workload does not enter R1 prefix compilation.
That does not make the OOM irrelevant to acceptance or prove the writer's own
standalone capacity. Source changes stop at this boundary.

### Preserved candidate and next discussion

The local build passed before the grouped runs, and the final product-file
hashes still match the immutable `remaining2` packet. Core is not committed as
verified. The remaining DOCX groups, native compatibility group, composition/
data group, refreshed compiled-engine proof, exact Linux packed consumer and
independent whole-change review remain unfinished.

Linux packaging was prepared but never launched after the OOM. A preliminary
local Windows npm pack has correct file bytes but native mode0644; it is
explicitly rejected as an accepted runtime package. It is not released,
installed or pinned in Service. No fresh packed-artifact acceptance is claimed.

Next discussion should decide a bounded way to separate runner overhead from
the native writer workload, retaining512MiB for the processing worker and any
existing coordinator budget. This is a proposed investigation, not authorization
to raise RAM, bypass the failing case, reset document budgets or continue past
the OOM stop. All original container identities, the frozen package tree and
Service remain unchanged; no owned lab container remains running. No shared
map or closed execution record is promoted or reopened.

## Core-alone nativeRunBudget proof,2026-11-03: three original cases pass

The owner explicitly authorized separation of the test coordinator and proof
of nativeRunBudget on Core alone, keeping512MiB/worker and existing caps, with
an immediate stop on OOM. Scope is bounded verification only; Core/Service are
read-only, no remaining R1 groups or implementation are authorized by this
result. Single-room execution IDs are not applicable. Input PC4ba2001,
Core6f36c42 plus its unchanged ten-file unfinished candidate, Service db15e9d.

**PASS_NATIVE_RUN_BUDGET_CORE_ALONE_BOUNDED.** This passes the requested
three-case scope, not the complete R1 suite or original Vitest command. The
earlier OOM records remain failures with their original evidence.

Evidence root:
`C:/Users/nekot/Documents/FlowDoc-recovery/docx-r1-core-alone-20261103/`.
See `verification.json`, `transpile-proof.json`, `adapter-check.json` and
`run2/oracle/receipt.json`. The three DOCX files, case/assertion results and
external per-process/cgroup samples are retained in `run2/oracle/proof/`.

### Separation and preservation of the actual test contract

The processing container runs a single Node24.21 process against the existing
compiled Core candidate. Generation, original assertions and their ZIP/XML
inspection all remain inside its512MiB/swap0 cgroup, with2CPU,128pids,
network none and read-only product/input mounts. There is no Vitest coordinator,
compiler/transpiler or Python monitor process inside the worker.

The host Python coordinator only launches, observes and collects. Its own soft
virtual-address bound is128MiB and observed peak RSS20184KiB. Docker CLI retains
its original host virtual-address limits. An initial pre-worker setup failure
incorrectly inherited the Python address bound into the Go CLI, which could
not reserve its virtual page-summary area. That attempt never created a Core
worker; it is preserved as infrastructure failure, not a Core OOM or a pass.

The original `tests/docx/nativeRunBudget.test.ts` and helper are copied and
transpiled outside the worker using the existing TypeScript compiler. Only
imports change: compiled Core, copied helpers and a small node:assert adapter.
Restoring those imports reproduces the original transpiled bodies byte for
byte. All three cases and24 original assertions execute; the1800 workload is
not split, reduced or given reset counters. Matcher controls reject eight
deliberately invalid checks and accept six valid checks. A wrapper captures
the original staged output objects for retention, without changing their
write/abort behavior. This is an explicit alternate test harness, not a claim
that the original Vitest invocation has now passed.

### Results and independent file verification

Worker cgroup peak is194740224 bytes (185.71875MiB), exit0, `oom 0` and
`oom_kill 0`. External cgroup process samples establish a maximum of one process.

| Original case | Result | XML plus rels nodes | Drawings | DOCX bytes |
| --- | --- | ---: | ---: | ---: |
| Complete1800 plain-text records | PASS |49227 |0 |215076 |
| Authored spans, whitespace and line break | PASS |687 |0 |188521 |
| Thai runs separate from adjacent Latin/Common text | PASS |677 |0 |188525 |

Each output contains25 XML/rels parts. A separate parser after worker exit
checks ZIP CRC, parses every XML/rels part and independently confirms the
counts, all1800 ordered record texts, preserved spaces/newline, and isolated
Thai run with its complex-script marker. Its count agrees with the original
test's counter. The unchanged XML cap is50000 and byte cap33554432. The first
file is retained with SHA256
afd4ac10aef4431299545df679c4eec20e37a5c4cab2982d19e5139ddf5bfdd4.
No native Word rendering or pagination claim is made.

### Interpretation and stopping boundary

This establishes that this exact nativeRunBudget workload and its assertions
fit512MiB when run on compiled Core without the in-worker Vitest coordinator.
Together with the prior combined-worker OOM, it supports separating test-runner
overhead from processing-worker capacity. It does not identify every allocation
in the old OOM, establish that Vitest alone caused it, or prove arbitrary
documents fit this budget.

This fixture invokes the fonts-only native writer. The separate default source-
guide1800 XML refusal remains open; do not merge the two1800 workload claims.
The fifteen later R1 groups, refreshed compiled-source-guide proof, accepted
Linux packed consumer and independent whole-change review are still pending.
No further R1 group was run after the requested bounded proof passed.

Core/Service files and the exact candidate hashes remain unchanged. Core is
still uncommitted pending broader R1 acceptance. Original container identities
and frozen package tree are stable; owned running lab containers are zero.
No original API/SQL/storage access, service stop, merge, push, release,
installation, map promotion or old execution-context mutation was performed.

## Remaining15 R1 groups,2026-11-03: bounded external-coordinator verification passes

The owner explicitly authorized the fifteen remaining groups using the same
external-coordinator arrangement,512MiB/worker, original caps and immediate
stop on OOM. This is verification only: owner Core, Evidence Reviewer role,
single-room execution IDs not applicable. Input PCd31c341, Core6f36c42 plus the
unchanged ten-file unfinished candidate, Service db15e9d. No product repair,
package promotion or integration is part of this result.

**PASS_FIFTEEN_REMAINING_R1_GROUPS_BOUNDED.** This closes the requested group
execution, not complete R1 acceptance, an original full Vitest invocation,
Word/PDF/API readiness, or the separate source-guide XML problem.

Evidence root:
`C:/Users/nekot/Documents/FlowDoc-recovery/docx-r1-remaining-alone-20261103/`.
Use `verification.json`, `groups.json`, `transpile-proof.json`, assertion and
registration controls, `vitest-list.json`, `oracle/receipt.json` and
`run2/oracle/receipt.json`. Per-case results, assertion counts and external
cgroup/process samples remain under each group's output directory.

### Contract preservation and coverage

Twenty-seven original test/helper files are externally transpiled with only
module-specifier changes. Product imports target the existing compiled Core;
fixtures remain the originals in the read-only candidate snapshot. Original
Vitest4.1.9 assertion and spy libraries are reused without loading Vite or its
coordinator inside processing workers. A small registration adapter preserves
tuple expansion, conditional registration and scoped afterEach cleanup. Eleven
negative matcher checks, valid promise/subset/spy checks and registration/hook
controls pass. This is an explicit standalone test harness, not an assertion
that the old memory-constrained Vitest command now passes.

Independent original Vitest collection outside the processing workers finds168
portable cases, matching actual executed per-file counts. The eleven native
Linux cases are excluded by the local Windows collector's runIf condition;
their original file has two direct cases and nine native input-array entries,
all executed on Linux. There are179 executed cases,1495 original assertions
and zero skips across the fourteen original-test groups.

| Group | Cases passed | Worker peak bytes |
| --- | ---: | ---: |
| pageFieldPosition |3 |40296448 |
| paginationRules |29 |106790912 |
| public port |4 |56631296 |
| resources |23 |156286976 |
| sectionAssembly |1 |48603136 |
| sourceFrameBudget |2 |19939328 |
| sourceShapeContainers |4 |25600000 |
| sourceShapeStyles |4 |25788416 |
| sourceWordBoundaries |7 |19001344 |
| strokeStyles |13 |62668800 |
| tableBorderStyle |12 |59097088 |
| writer |27 |63369216 |
| composition/data |39 |213504000 |
| native compatibility |11 |54124544 |

Existing per-test options, including explicit expanded-XML option contract
tests, are preserved exactly; Core's defaults/hard bounds are not raised.
Each fresh worker retains all work and assertions for its actual documents;
no document is split or given reset counters to manufacture a pass. Native
children belong to the same512MiB/swap0 worker cgroup. There is no in-worker
test coordinator, while genuine native helpers can add processing children.

### Fifteenth group: refreshed compiled-native proof

The initial attempt at this last group fails during module loading because
the frozen original `/baseline` mount was omitted. Its FAIL receipt is retained.
The lab-only correction mounts that exact frozen Core read-only and runs only
the final group in a new namespace; the fourteen passing groups are reused
without repetition. No candidate file is repaired or changed.

The refreshed proof passes all1800 complete measurement comparisons against
the original, with7918 native requests under8192 and735523 combined charged
units under1048576. The separate native oracle validates3531 certified
prefixes, and contextual/unsupported font comparisons remain equivalent.

The real default public engine proceeds past measurement and retains its
`DOCX_OUTPUT_BUDGET_EXCEEDED` refusal at `word/document.xml`, with zero output
bytes. This expected refusal is part of the proof result; the source-guide
document has not become a successful full DOCX. Its exact expanded XML count
remains unmeasured here.

That group's cgroup peak is376897536 bytes (359.4375MiB), the largest of these
fifteen groups. Exit codes and all `oom`/`oom_kill` counters are zero for the
accepted runs. The external coordinator's observed Python RSS stays below
its128MiB address-space bound. All Core generation, native children and original
assertions remain inside the512MiB workers; no installed tool, dependency or
runtime budget is increased.

### Scope close and remaining work

The fifteen requested groups are now verified within this declared harness.
Stop here. The accepted exact Linux packed artifact/consumer and independent
whole-change review remain pending before broader R1 closeout or verified
product commit. The default source-guide XML refusal and Word/Service/API
acceptance remain separate work. The earlier Core-alone nativeRunBudget pass
also remains distinct from this source-guide workload.

Candidate hashes still match the immutable input packets. Core remains dirty/
uncommitted; Service is unchanged. Original container identities and frozen
package tree are stable; no owned lab container remains running. No original
API/SQL/storage access, original service stop, merge, push, release,
installation, map promotion or old execution-context mutation was performed.

## R1 bounded candidate closure,2026-11-03: Linux archive and review accepted

The owner authorized the remaining exact Linux package checks and Core review
before R1 closure, with512MiB/worker, unchanged caps and immediate OOM stop.
This was single-room verification/review, IDs not applicable, input PC63c3960,
Core6f36c42 plus the exact ten-file candidate and Service db15e9d. No product
file changed during verification. Only the already verified candidate was
locally committed after acceptance; no integration/promotion occurred.

**R1_ACCEPTED_BOUNDED_MEASUREMENT_RUNTIME_CANDIDATE.** This closes R1's shaping/
runtime repair and repository regression scope. It does not complete R2/R3,
deliver the default source-guide1800 DOCX, prove native Word rendering, establish
Service/API readiness or authorize installation/release. Earlier failures and
OOM stops retain their original outcomes; qualified current acceptance does
not turn them into passes.

Core candidate commit:
`582f141566d1dd0cc4df53a7779818cab9c3d111`, branch
`codex/model20-only-20261103`. The ten reviewed/tested file hashes are unchanged
through commit and the Core worktree is clean. No merge or push was performed.

Evidence root:
`C:/Users/nekot/Documents/FlowDoc-recovery/docx-r1-linux-package-review-20261103/`.
Use `verification.json`, `review.txt`, `candidate-manifest.json`,
`fresh-build-verification.json`, the initial Linux build receipt,
`run2/oracle/receipt.json` and `xml-counter/oracle/receipt.json`. The accepted
archive is retained in `artifacts/flowdoc-core-0.5.2-r1-linux-candidate.tgz`.

### Exact Linux package gate

An offline Linux `npm pack --ignore-scripts` produces265 files. Every packaged
file hash matches the candidate inputs, including the new private compiler;
the two frozen native binaries retain mode0755 and their resource hashes.
An external fresh TypeScript source build emits252 dist files, all byte-equal
to the accepted archive's dist. Native binaries are reused unchanged, not
rebuilt or downloaded.

Archive SHA256:
`32484c0eac1f4dbbd578d05d7d2d04142bd7a0095a43471a777a736236f4e357`.
This is a private candidate archive, not a new release/tag or installed build.

Isolated consumers extract that exact tarball and resolve the public package
root to `file:///target/dist/index.js`. They do not mount the current Core
source tree. Cached runtime dependencies match the package's exact declarations:
docx9.13.0, jszip3.10.2, pngjs7.0.0 and xmldom0.9.12. No dependency install,
network acquisition, image build or original-service change is performed.
This is an execution check against the retained dependency graph, not a fresh
installation claim.

| Packed consumer | Verified result |
| --- | --- |
| Public-root native DOCX |3 original nativeRunBudget cases; all1800 ordered records; independent ZIP CRC/XML/rels checks |
| Runtime lifecycle |10 original cases, including complete1800 measurement, abort/close, failed segmenter, killed shaper, unavailable compiler and compiler reaping including TERM refusal |
| Public PDF API |actual four-style one-page and overflow two-page files; concurrent generation; immutable inputs; invalid model rejection; temporary cleanup; basic PDF structure/page-count crosscheck |
| Compiled source measurement |1800 equivalent measurements;7918 requests;735523 charged units;3531 independent native-prefix checks; contextual/unsupported font equivalence |

The native DOCX's full25-part XML/rels count is49227, zero drawings and215076
bytes, within unchanged50000/33554432 caps. This remains the fonts-only
nativeRunBudget fixture, not the separate source-guide fixture.

The first consumer attempt fails in the test metadata reader because docx does
not export package.json. Only that reader is corrected to inspect metadata
from the resolved dependency entry. The passing Linux archive is reused byte
for byte; no repack or product repair masks the failed setup. The failure
receipt remains retained.

All processing/native children and assertions remain inside512MiB/swap0 workers
with the test coordinator outside. All accepted workers have zero OOM/oom_kill.
Including the final counter observation, the maximum cgroup peak is
385458176 bytes (367.6015625MiB). The archive and package tree remain unchanged
through every consumer. PDF smoke is not visual rendering/text-fidelity proof.

### Whole-change review and coverage decision

The independent read-only reviewer `/root/r1_core_review` examines all ten
files against base6f36c42 and the immutable manifest. It reports no confirmed
Critical, Important or Minor finding and no bounded-R1 blocker. It reviews
GSUB/GPOS closure/bounds against cached Rustybuzz, outward ink arithmetic,
private ownership, unchanged limits, failure/invalidation/cleanup and optional
Python compatibility. No reviewer file or Git mutation occurs.

The parent checks results as well as coverage. R1's8193-request RED, current
equivalent1800 measurement, guarded fallback and lifecycle repair are supported
by the earlier and freshly packed evidence. Affected line/source/reading-plan
and DOCX/Word-XML repository regressions are covered by the recorded groups;
native Word visual/pagination acceptance remains R3, not relabelled PASS.

The review does not establish exhaustive malformed-font/scheduler/process-tree
proof, hypothetical future callers' immutable files, full original Vitest
execution, arbitrary document capacity or Word/Service/API readiness. Those
scope dispositions are recorded in `review.txt`; none is promoted by the
bounded package result. Current production certificate setup remains through
DOCX-owned snapshots and supported font profiles; unknown cases fall back.

### R1 next-gate counters and R2 handoff

R1's original acceptance asks for the next actual gate and counters. One final
read-only inspector observation on the accepted package fills that prerequisite
without rewriting package/source, retaining the ZIP or overriding options.
It reads live locals at the existing XML guard and compares the full error/
warnings/output/abort result with the accepted unobserved run; they match.

At `word/document.xml`, cumulative counters are:

- XML nodes158426 against50000;
- drawings0 against10000;
- output bytes0, abort `DOCX_OUTPUT_BUDGET_EXCEEDED`.

This is the guard's cumulative count when that part is visited, not an
independent all-part census or a claim that document.xml alone has158426 nodes.
The source template fingerprint remains705aedd73be735a3b2b5cd39efa3a1b18cfd9fc7b4e911df757eba6bb0383001.
The old97411 count belongs to the different native-policy diagnostic and must
not replace this source-path evidence.

R2 must be assessed against this actual source-guide gate before choosing a
reduction strategy. No XML repair, limit increase, R2 implementation or Word
verification was performed here. Stop with the bounded R1 candidate accepted.
Original identities/frozen package tree and Service remain unchanged, and no
owned lab container remains running. No original data/API/SQL/storage access,
service stop, merge, push, release, installation, map promotion or old execution
context mutation occurred.

## R2 discovery and proposed reduction plan,2026-11-03

Status: **R2_DISCOVERY_COMPLETE_REPAIR_FEASIBILITY_OPEN**. This completes only
the explicit read-only analysis/planning request. R1 remains accepted in its
bounded scope. R2 repair, R3, Word fidelity and Service integration are open.

### Scope, authority and reproducible inputs

Owner: Core for any future implementation; Project Control for this plan.
Roles: Evidence Reviewer, then Planning Partner/Project Control Steward.
Single-room execution IDs: not applicable. Risk routine for read-only lab
discovery; no product change is authorized. The generated October4 Current
Truth Snapshot concerns another Editor round and is not R2 authority; this
request and the current bounded plan/retained R1 evidence resolve this work.

Pinned Core candidate582f141566d1dd0cc4df53a7779818cab9c3d111; Service remains
db15e9d45973fb3f7682ee8b6bae37c5d82124a4. Reuse the exact accepted R1 Linux
archive32484c0eac1f4dbbd578d05d7d2d04142bd7a0095a43471a777a736236f4e357,
without rebuilding, installing dependencies or changing package files.
The template fingerprint is705aedd73be735a3b2b5cd39efa3a1b18cfd9fc7b4e911df757eba6bb0383001.
This is the current synthetic1800-paragraph/64800-UTF16-unit model20 fixture,
not the historical72000-run fixture, fonts-only nativeRunBudget or full UAT/SRS.
Oracle means the isolated OCI VM; no database is used in this Core-only work.

Proof budget: one actual public-root generation with read-only inspector
snapshots, then one offline independent XML census worker. Both workers have
512MiB memory/swap0,2CPU,128pids,network none and read-only product mounts;
the coordinator remains outside with its existing128MiB address-space budget.
Stop on any OOM, input mutation or original-container identity drift. Only
existing plan prose is updated; no new registry, map or product Markdown.

Evidence root:
`C:/Users/nekot/Documents/FlowDoc-recovery/docx-r2-xml-analysis-20261103/`.
Read `verification.json`, `packet.json`, `oracle/receipt.json`,
`oracle/xml-counter/result.json`, `oracle/xml-counter/snapshots.json`,
`census/oracle/receipt.json` and `census/oracle/xml-counter/census.json`.
Raw XML/rels copies for all three stages are under `oracle/xml-counter/`.
`run.py`/`remote.py`, `prepare.py` and `census.py` retain the bounded method.

The observer retains existing ZIP-entry references before source serialization,
after it and before the final guard, then reads each part after generation
returns. It does not edit XML, rewrite Core, override options, generate another
ZIP or publish a DOCX. This deliberately retains extra diagnostic references;
its memory result is observation-specific, not a production memory guarantee.
The complete error/warnings/output/abort result equals the prior unobserved
result: `DOCX_OUTPUT_BUDGET_EXCEEDED`, `word/document.xml`, zero output bytes.

### Confirmed counts and amplification path

Independent Python ElementTree expanded-element counts equal the writer's
lexical counter for every captured `.xml` and `.rels` part. All three stages
contain the exact ordered1800 expected records and64800 UTF16 units, with text
SHA2566abfad9bbd0c1106190d767aa095f966370c5f3d4cb47b22df8d9bacafc2bd6c.
Text equality here does not prove Word rendering, reading order or pagination.

| Stage in this same default generation | XML/rels parts | Whole-package nodes | document.xml nodes | VML textboxes |
| --- | ---: | ---: | ---: | ---: |
| Native package before source serialization |25 |99627 |99013 |0 |
| After source serialization, before compaction |26 |195111 |190813 |10800 |
| Final private staging, before guard |26 |162741 |158413 |10800 |

The158426 R1 counter is the cumulative guard prefix:13 nodes in the preceding
document relationship part plus158413 in document.xml. The newly established
complete package total is162741, not158426. The old97411 native-policy count
belongs to another diagnostic and is not replaced or reused as this baseline.

Implementation evidence against the pinned Core candidate:

- `src/docx/source-layout-xml.ts:66-78`: `wordRuns` emits alternating runs for
  required native advance/spacing corrections and shares equal adjacent run
  styles only within one SourceWord. These runs must not be flattened blindly.
- `src/docx/source-layout-xml.ts:87-105`: each source line loops over
  `line.words`, creates one independently positioned VML shape/textbox per
  segment, then records its source range. In this fixture there are1800 source
  lines and10800 boxes:6 segments per record. Examples are `RESOURCE-`,
  `ROW-0001 ` and `before-`; SourceWord is a segmentation boundary, not
  necessarily a linguistic word. Shape positions, padding, baseline, script,
  spacing and source maps are part of the current representation.
- `src/docx/source-layout-xml.ts:122-145`: existing compaction shares outer
  `w:r/w:pict` wrappers and combines supported uniform paragraph/run styles.
  Measured savings are32370 nodes net:18000 wrapper nodes plus14400 run-style
  reference nodes, offset by30 added style-definition nodes. Only
  `word/document.xml` and `word/styles.xml` change between the last two stages.
- `src/docx/writer.ts:147-184`: source compaction remains conditional on real
  source serialization and an over-budget count; the final unchanged guard
  still rejects before publishing. `src/docx/compaction/package.mjs:13-24,58`
  and `src/docx/compaction.ts:18-21` conservatively refuse ineligible or
  still-over-budget plans. This run did not observe the generic planner's
  internal refusal reason, so do not claim a specific one.

Classification: **Confirmed capacity refusal and structural amplification**;
the protective guard is not itself a confirmed defect. The earlier R2
native-style-only proposal is an insufficient primary strategy for this path.

### Why repeated-style or footer cleanup alone cannot meet the cap

Final document.xml contains18000 text nodes,19800 runs,12600 paragraphs and
10800 VML shapes/textboxes. Its shape subtrees alone contain90000 nodes even
after hypothetically removing every nested paragraph/run property subtree.
That is a structural lower-bound diagnostic, not a valid transformation.

A stronger deliberately invalid arithmetic test removes every document
`w:pPr/w:rPr` subtree once (union54000 nodes) and the entire268-node styles
part. The package would still have108473 nodes, above50000. Therefore merely
sharing/removing those repeated properties cannot solve the observed case
while retaining the existing box/run topology. Actual valid style sharing
saves less than this impossible upper bound. The custom source map is3601
nodes; deleting it would lose required facts and also cannot close the gap.

Drawing guard0 is the `wp:docPr` counter. It does not mean there are no text
shapes:10800 VML shapes are independently counted by the XML budget. Attribute
deduplication, shared VML shape attributes or a smaller compressed ZIP would
primarily reduce bytes, not the element count that currently refuses.

### Proposed approaches and recommended next request

1. **Study a compact source-line/compatible-span representation on copies
   first (recommended).** Reduce independently positioned containers and
   coalesce only provably equivalent adjacent run fragments. Keep source
   measurement/line choices unchanged. Carry all original segment offsets and
   source ranges into an explicit mapping, including multiple ranges per
   container if the design supports them. A single box per line is only a
   hypothesis: retaining all existing runs/references may still exceed the cap.
   No complete projection or Word-equivalence proof exists yet.
2. **Native generated-style sharing** remains useful as a subordinate
   optimization or a separately designed explicit native-layout mode. Turning
   off source layout changes the layout policy and is not an approved repair.
   Do not infer source fidelity from the smaller native intermediate above.
3. **More style/footer/attribute deduplication with the current source-word
   topology** is rejected as the primary remedy by the measured lower bound.
   Do not spend another implementation round on it alone or increase caps.

Before Core implementation, the next bounded copy-only request should do:

- [x] **R2-A: define a general grouping contract and non-writing projection.**
  Assessment completed with a refused projection, not an accepted repair; see
  the current R2-A result below. The requested49000-node target is not met.
  Read SourceWord/font/line facts and the mapping consumer. Specify continuity,
  exact source ranges, font/script/spacing/position/ink/baseline compatibility,
  semantic barriers and an exact accounting rule. Use current1800 and the
  retained UAT/SRS as separate fixtures; never special-case text, counts or IDs.
  Review `source-word/1`, generatedControls and paragraphMap receipt semantics
  (`src/docx/source-layout.ts:34-35`), not just XML appearance. No runtime
  reader was found by the bounded Core/Service-src marker search, but external
  consumers remain unknown. Reusing a shape ID for multiple ranges or changing
  a control's meaning must not silently retain an incompatible map version;
  an unavoidable contract change returns for explicit design/scope review.
  Count every proposed XML/rels part plus new styles/maps. Target<=49000,
  hard cap50000, output32MiB and512MiB/worker unchanged. If the projection
  cannot fit while preserving facts, return for design review before coding.
- [ ] **R2-B: prove the eligible representation on external copies.** Only
  after a valid projection, construct a diagnostic candidate with strict
  ownership, count-before/apply-after and no-op/refusal/rollback semantics.
  Verify Unicode/source ranges, all text/style and glyph-advance corrections,
  layout coordinates and package graph independently. Cover mixed Thai/Latin,
  combining marks, zero/negative adjustments, line wraps, links/fields,
  bookmarks, tables/cells, unknown extensions and partial/unsupported cases.
  Preserve the original path for unsupported cases and fail safely at caps.
- [ ] **R2-C: establish Word fidelity before approving the Core design.**
  Compare with a declared valid reference, not a failed export or small slices
  treated as whole-document proof. Check line/page breaks, Thai shaping,
  positions, clipping, editing/navigation and source-map roundtrip. If Word is
  unavailable in OCI, the native-Word gate remains open for a separate review
  on the existing Word host; do not install it or substitute XML text equality.
- [ ] **R2-D: only after separate implementation authorization**, implement
  the proven general representation in a Core candidate. Expected owners are
  `src/docx/source-layout-xml.ts` for emission, `src/docx/source-layout.ts` for
  facts only if required, and source-map consumers/tests located in R2-A.
  Do not change `measureText`, R1 budgets, public API or Service without new
  evidence and scope approval. Test negative compatibility/ownership,
  cancellation/failure cleanup, under-budget no-op and exact Linux package;
  then proceed to the existing R3 end-to-end/Word/Service acceptance.

R2-A/B/C are proposed next work, not performed in this request. Their outcome
can reject the grouping design. Production implementation is intentionally
deferred until compatibility, memory, Word/reference and useful-budget-margin
questions have evidence.

### Verification limits and stop

Capture peak379834368 bytes (362.23828125MiB); census peak176881664 bytes
(168.6875MiB). Both workers have zero OOM/oom_kill and no remaining owned
running container. Packaged bytes, frozen installed-package tree, Core/Service
candidate Git state and original container identities remain unchanged.
No real API/SQL/storage was accessed; identity metadata alone was compared.

No XML was edited and no successful DOCX output is claimed. No native Word,
full UAT/SRS, Service/API, new representation, concurrency or production-memory
acceptance follows from this census. No Core/Service code change, original
data/service action, limit increase, merge, push, release, install or map
promotion occurred. Stop after the discovery/plan and focused documentation
checks; request the next copy-only feasibility scope before proceeding.

## R2-A copy-only assessment,2026-11-03: target not met

Status: **R2_A_ASSESSMENT_COMPLETE_TARGET_NOT_MET_RETURN_TO_DESIGN**.
The bounded discovery is complete; the proposed line-box grouping is refused.
This is not R2 acceptance and does not satisfy the R2-B prerequisite.

Owner remains Core for any eventual implementation and Project Control for
this plan. Roles Evidence Reviewer/Planning Partner; single-room execution
IDs not applicable. Explicit owner authorization permits copy-only grouping
analysis, not Core/Service edits or contract promotion. The active model is
used inline without another room/agent. Core remains582f141, Service db15e9d;
the source packet records their full identities and this plan's starting
commit6575784. The stale October4 generated snapshot is not current R2-A truth.

### Reproducible copies and diagnostic contract

Evidence root:
`C:/Users/nekot/Documents/FlowDoc-recovery/docx-r2a-group-projection-20261103/`.
Use `verification.json` and the corrected `general/packet.json`,
`general/oracle/receipt.json`, and each fixture's `projection.json` and
`group-plan.json` under `general/oracle/{current,uat,srs}/`.
`project.py`, `prepare-general.py`, `general/run.py` and `general/remote.py`
retain the copy-only method. No XML, ZIP, product source or limit is changed.

The current fixture reuses the exact R2 final-stage XML/rels snapshots, whose
complete162741-node input identities are checked. The two historical full
Word baseline copies are independently pinned, never regenerated or installed:

- UAT `uat-full-baseline.docx`, SHA256
  bb473945f03f4abdc528aa51ccb23159bbad4179b08d6668ab52948be8fab6a1;
- SRS `srs-existing-baseline.docx`, SHA256
  4c024b28e4572c2396f1284852b00185d49494c7c8cd7bf67e9bd6106a83c144.

Each virtual-plan artifact has schema `flowdoc.r2a.group-plan/0`: a diagnostic
ledger, not an approved runtime checkpoint or source-map version. It retains
original shape IDs, owner tag/line, all visible run text and resolved-property
signatures, original VML geometry attributes and inner paragraph properties,
plus the complete original source map and property-signature registry.
Roundtrip manifest checks preserve these serialized facts, not hidden Core
glyph/ink facts or native Word behavior.

The bounded grouping proposal is: within one owned source line, concatenate
the ordered member runs; coalesce only adjacent equal property signatures and
equal xml:space. Never cross source paragraph/line ownership or a semantic
barrier. A future implementable contract would additionally require actual
font/glyph/cluster continuity, exact common coordinate frame and member
offsets, baseline/ink/clipping equivalence, unsupported-style refusal and
native Word evidence. Resolving property signatures here is planning data,
not a theorem about all OOXML toggle/cascade or shaping behavior.

Every original source-word/1 map range is validated against its existing shape,
UTF16 text length, complete per-paragraph text digest and ordered coverage.
Original geometry and styles remain attached to members in the virtual plan.
Eight manifest-tamper controls per fixture reject missing/duplicate controls,
changed text/style/geometry/ranges/map coverage and altered style registry.
These are integrity controls, not native-rendering or general schema tests.

### Count result and refusal

| Fixture | Original whole-package nodes | Mapped source lines / shapes | Specified one-box-per-line/run-sharing projection |
| --- | ---: | ---: | ---: |
| Current1800 |162741 |1800 /10800 |92541 |
| Historical full UAT baseline |39191 |63 /519 |35513 |
| Historical full SRS baseline |49965 |39 /146 |49192 |

Each projection retains the other original package parts and original map/style
counts, but does not pay for new style definitions or a revised map/control
contract. It is optimistic arithmetic for a specified representation, not a
serialized valid DOCX count or Word acceptance. The UAT/SRS projections cover
their mapped source-line subsets; the whole-package count includes all parts,
including other protected/native content. The UAT arithmetic is below target;
the SRS explicit strategy is192 nodes above target even before new definitions.
Neither is a newly generated or Word-reviewed export.

For current1800 every source line has6 boxes and10 runs. Equal adjacent
property signatures reduce10 runs to7, not one. The specified representation
needs a7-node shared shape/paragraph/wrap skeleton plus4 nodes per remaining
explicit run, giving92541 across the complete package before new definitions.

An intentionally invalid lower-bound calculation removes ALL document pPr/rPr
properties and the entire styles part, and counts just5 structural nodes per
new line box plus2 nodes per retained run. Its independently checked formula
is108473 -90000 +1800*(5+2*7) = **52673**. It still exceeds both49000 and50000.
It is not a proposal to remove formatting. This rules out the assessed
one-box-per-line/seven-run topology, not every imaginable representation.

The virtual ledger preserves original map facts, but it cannot make removed
shape IDs resolve in a new DOCX. Replacing them with shared IDs or aliases
requires explicit source-word/1 semantics and consumer/version review. The
`source-word-layout` receipt still describes editable word boxes. Neither this
receipt nor a map version is silently changed. External consumers remain
unknown, and no grouped XML or new map is emitted.

### Preserved corrections and verification scope

The initial historical-fixture branch incorrectly claimed UAT/SRS lacked a
current map without testing their schema. That conclusion is withdrawn:
both contain source-word/1 with line-paragraphs-word-boxes. Initial results
remain retained but are excluded from acceptance. The generalized projector
actually reads each map and validates its mapped controls and ranges; it passes
on both baseline copies. No product change was needed for this harness repair.
An intermediate facts-only rerun also fixes the diagnostic artifact's omission
of full original geometry facts; the corrected generalized artifacts retain
them durably along with the style registry.

All seven sequential diagnostic workers across retained attempts use512MiB,
swap0,network none and the external coordinator's existing128MiB budget.
No OOM/oom_kill occurs; maximum peak267583488 bytes (**255.1875MiB**).
Original container identities and input/package trees remain stable, all
owned lab containers are stopped, and Core/Service candidates remain clean.
Oracle here is the OCI lab VM; no database or original API/SQL/storage is used.

### Return to design, not implementation

Do not start R2-B, Word comparison or Core implementation on this refused
projection. A new design request should assess the source-line representation
and encoding of the remaining spacing/style runs together, including the
outer control structure and versioned mapping semantics. Measure each option
against the same complete-package49000 target before constructing a copy.
Removing spacing runs, switching layout mode or dropping original mapping
facts is not an approved shortcut. Retaining the current conservative budget
refusal remains the fallback if no faithful compact representation is proven.

No native Word/new grouped-file geometry, ligatures, page breaks, clipping or
source-map ABI compatibility is claimed. No Core/Service edits, real-data or
service actions, merge, push, release, installation or map promotion occurred.
Only this existing canonical plan and external diagnostic artifacts change.

## Source-line alternatives after R2-A,2026-11-03: proposed design only

Status: **COMPARATIVE_DESIGN_COMPLETE_PROPOSED_NOT_APPROVED_OR_RENDERED**.
The owner's continuation authorizes bounded comparison of source-line,
spacing/run and mapping alternatives. It does not authorize product changes,
new DOCX construction, adopting a new contract or reopening R2-A as PASS.
Owner Core for any eventual renderer; Project Control for this comparison.
Roles Evidence Reviewer/Planning Partner; single-room execution IDs not
applicable. Inline active model, no separate agents/rooms. Core582f141 and
Service db15e9d remain unchanged; the packet pins full hashes and PC9047d3a.
The October4 generated snapshot remains unrelated to this bounded round.

Evidence root:
`C:/Users/nekot/Documents/FlowDoc-recovery/docx-r2-line-design-20261103/`.
Use `verification.json`, `packet.json`, `oracle/receipt.json`, and
`oracle/{current,uat,srs}/design.json` plus `design-plan.json`.
The input is the corrected R2-A complete original-fact ledgers and pinned
XML/rels/Word baseline copies; no source Word file or package is overwritten.
Three sequential offline512MiB/swap0 workers enumerate alternate node ledgers
and preserve the complete old member/map/style facts in their virtual plans.
The coordinator stays outside with its128MiB address-space budget. No Core
generation, new XML/DOCX, Word process or new environment installation runs.

### Compared alternatives and explicit accounting

All changed representations below are hypothetical and require new mapping
semantics. Counts retain every unaffected original package part and old style
definition, add enumerated paragraph/character style nodes, retain the original
source-map element count and add one provenance metadata element. The model
does not move visible text or visible formatting into metadata to evade caps.
Text remains in ordered w:r/w:t runs; the metadata retains original member
facts only. No actual serialized count or ZIP-size claim is made.

| Representation | Current1800 | UAT baseline | SRS baseline |
| --- | ---: | ---: | ---: |
| Current source-word/1 unchanged |162741 |39191 |49965 |
| One VML line box, shared styles, attribute anchor (optimistic) |62005 |35223 |48908 |
| Inline source-line paragraph, shared styles, attribute anchor (hypothetical) |45805 |34656 |48557 |
| Inline source-line paragraph with two bookmark nodes per line instead |49405 |34782 |48635 |

For current1800,7 adjacent property groups remain per line. Choosing the most
frequent group as the paragraph's default run formatting leaves4 plain and3
explicit exception runs per line. The paragraph model is3 structural nodes
(p/pPr/pStyle) plus2 per default run and4 per exception run:23 per line.
It replaces158400 owned control nodes with41400 line/run nodes, keeps4341
other original nodes, adds63 style nodes (1 paragraph and3 character
definitions) and1 metadata node: **45805**. No spacing/cs/position run is
discarded. Bookmark anchors would add3600 nodes, missing the49000 target.

The inline/attribute model has3195 nodes of margin to49000 for current1800,
14344 for UAT and443 for SRS. That is useful planning evidence, not a guaranteed
valid package. Correct style ordering/cascade, unsupported attributes,
relationship or mapping requirements may change a real serialization count.
The VML line model still misses the current1800 cap and is not recommended
as the primary solution. The unchanged path retains its existing safe refusal.

### Proposed source-line contract and unresolved behavior

The promising option is ordinary inline paragraphs with exact source-measured
line boundaries and shared complete paragraph/run formatting. Original owned
source controls would be replaced, not silently relabelled as equivalent word
boxes. Proposed `source-line/2` is a new version, not an implementation decision.
It would identify each emitted source line, preserve every original UTF16
range/member ID as provenance and bind those ranges to a verified new line
target plus character offsets. Removed shape IDs must not remain live targets.
The receipt's generatedControls/policy must truthfully describe the new
representation; old source-word/1 continues to mean the original word boxes.
No existing file or caller is migrated by this comparison.

The budget model uses candidate paragraph attribute anchors. Microsoft exposes
`w14:paraId` on Paragraph for Office2010+ in its
[official Open XML API reference](https://learn.microsoft.com/en-us/dotnet/api/documentformat.openxml.wordprocessing.paragraph.paragraphid?view=openxml-3.0.1).
This confirms the attribute exists, not that it is an immutable application ID.
Actual schema validation, collision allocation across the relevant parts,
native Word save/edit identity behavior and supported Word versions remain
prerequisites. Bookmark targets are the separately counted alternative, not
a cost-free substitute. Unknown external map consumers remain a contract risk.

Preserving the old resolved property signatures in a plan does not establish
Word style-toggle/cascade, kerning/ligatures or baseline equivalence after
removing textbox boundaries. Normal paragraph baselines, ink/clipping and
line/page breaks must be checked against an agreed valid reference. The old
native Word baseline documents are distinct inputs, not proof that a newly
generated candidate renders the same. Protected/native sections, links,
fields, bookmarks, merged cells and unknown extensions must retain their
original path or trigger refusal; grouping cannot cross their barriers.

Straight retention of full original geometry/member/map provenance would add
15096915 escaped metadata bytes for current1800 (UAT760933, SRS227558).
This is roughly15MB of additional metadata, not a measured final ZIP size.
The next design/proof must reduce repeated provenance losslessly, measure
actual source-map and styles part bytes, and include real Core working sets
under512MiB. Keeping useful metadata is not permission to grow memory without
measurement or raise any cap. Raw Core glyph/ink facts are not recoverable
from these serialized snapshots alone and remain required for geometry proof.

### Recommended next bounded choice and checks

Recommend the inline source-line/shared-style option for a separately approved
copy-only feasibility proof, with an explicit source-line/2 mapping contract.
It is the only assessed option below49000 on all three fixtures with a margin
on current1800. This is a proposal for owner review, not an approved design or
permission to implement Core. Keep the earlier failed projection and evidence.

Before constructing a diagnostic DOCX, settle the anchor/version/receipt
contract, exact spacing and common baseline model, valid reference, and a
lossless bounded provenance encoding. Then enumerate actual style/map XML,
independently parse/recount all XML/rels, test negative ownership/collision/
schema cases and no-op/refusal semantics. Only an eligible count permits a
copy-only layout/Word check and later real-Core memory/cleanup proof. A failed
schema, geometry, anchor or budget check returns to design rather than erasing
facts, switching layout policy silently or increasing limits.

Current proof is limited to independent virtual-ledger arithmetic and retained
input-fact integrity. Four manifest-integrity controls per fixture are scoped
to altered provenance, not native rendering tests. Maximum worker peak is
286273536 bytes (**273.01171875MiB**); no OOM/oom_kill, mutation or original
identity drift occurs. All owned lab containers stop. Oracle denotes the OCI
VM, no DB or original API/SQL/storage access. Product candidates remain clean.
Only this plan and external comparison evidence change. No Core/Service edits,
new DOCX/XML, Word run, merge, push, release, install or truth-map promotion.

## source-line/2 lab contract and lossless metadata proof,2026-11-03

Status: **PASS_SOURCE_LINE2_LAB_CONTRACT_AND_LOSSLESS_METADATA_ONLY**.
The owner explicitly authorized defining source-line/2 and proving lossless
metadata reduction on copies. This accepts only the lab contract/transport
scope below, not the proposed renderer, a production profile or R2/R3 as PASS.
Project Control owns this shared lab contract; Core owns any later runtime
implementation. Roles Planning Partner/Evidence Reviewer; single-room execution
IDs not applicable. Active host model inline, no separate room/agent. Core
582f141 and Service db15e9d remain unchanged; the packet pins full hashes and
starting PC41820a3. The stale generated October4 snapshot is not this authority.

Evidence root:
`C:/Users/nekot/Documents/FlowDoc-recovery/source-line2-metadata-20261103/`.
`contract.json` is the compact machine-readable companion; use
`verification.json` for independent acceptance. The corrected complete-map
proof is under `map/packet.json`, `map/oracle/receipt.json`, and
`map/oracle/{encode,decode}-{current,uat,srs}/`. Producers retain
`source-line2.xml`, `provenance.xml`, `metadata-envelope.json`, `reference.json`
and `encode.json`; consumers retain `restored-body.json`,
`readable-primary-map.json` and `decode.json`. `codec.py`, `mapxml.py`,
`encode.py`, `decode.py`, `prepare-map.py` and `verify.py` explain the method.
The first carrier-only round remains supporting evidence, not a complete-map
claim. Adding the readable index was a bounded missing contract prerequisite;
neither round retries an OOM or changes a product candidate.

### Defined contract: identity, offsets and ownership

The standalone part is `flowdocSourceLines`, version `source-line/2`, profile
`lab-copy`, targetEvidence `virtual-plan`. The body schema is also
`source-line/2`; its exact top-level fields are schema, profile, sourceDigest,
sourcePlanSha256, targetPlanSha256, primaryMap and provenance. A production
`core-generation` profile is not implemented and is explicitly refused by the
lab decoder. Unknown schema versions/profiles must not fall back to v1.

- Root sourceDigest binds the original source; sourcePlanSha256 binds the
  exact retained original-fact ledger and targetPlanSha256 the proposed line
  plan. The lab binds against independent producer references. SHA256/CRC
  checks prove integrity, not producer authentication or genuine Core ownership.
  Production must obtain trusted bindings from its actual owned generation
  context and validate the emitted targets, not trust caller strings/ID prefixes.
- Each readable paragraph names sourceNodeId, sourceTag and
  textSha256Utf16le. Each line names index, sourceStart/sourceEnd, targetPart,
  anchorKind/anchorValue, targetStart/targetEnd, textSha256Utf16le and members.
  `members` is readable JSON, with provenanceShapeId, sourceRange and
  targetRange for every original segment. Unknown schema-owned attributes or
  elements are refused; opaque nested provenance remains preserved as data.
- Source ranges are half-open UTF16 code-unit offsets in the original source
  paragraph. Target ranges are half-open offsets local to one emitted line
  paragraph. No holes, overlaps, duplicated members/owners/anchors or missing
  mapped data are permitted. Member order, full line coverage and text digests
  are checked. The new text digest is SHA256 over UTF16LE code units, without
  normalization or surrogate replacement. Original UTF8 digest fields retain
  their original meaning inside provenance; they are not silently redefined.
- The target is word/document.xml plus a candidate w14:paraId and local range.
  Former shape IDs are provenance only and cannot be treated as surviving Word
  shapes. Lab IDs refer to a virtual line plan, not an emitted DOCX. Actual
  paragraph lookup, geometry/style identity and Word-save/edit persistence
  remain unverified. The earlier Word-version/anchor concerns remain open.
- Legacy source-word/1 files, maps and receipts are unchanged. Any future
  source-line receipt must truthfully identify line paragraphs rather than
  editable word boxes, keep wordVerified false and never infer layout evidence
  from a successful metadata decode. No migration is performed by this contract.

### Defined contract: readable index and bounded provenance codec

The map part contains paragraph/line index elements followed by exactly one
provenance element. The index stays readable without decompressing metadata.
The provenance body contains a complete copy of the primary index, original
member text, geometry attributes, resolved style registry, original maps and
source facts available in the serialized copies. The reader must cross-check
the readable and decoded indexes and source/target bindings before accepting
the aggregate. A checksum alone does not establish target validity.

Metadata version `source-line-metadata/1`, codec `gzip-json/1`: compact ASCII
JSON, one gzip member and strict Base64. The envelope/provenance attributes
declare profile, sourceDigest, targetPlanSha256, uncompressedBytes,
compressedBytes and SHA256 of the original uncompressed JSON. Full original
unknown nested provenance is retained, never executed or interpreted as paths,
runtime options or commands. Rendered text/styles are not moved into metadata
to evade XML limits; the planned Word line/run/style structure remains separate.

The Python lab encoder uses deterministic compact ASCII JSON and gzip headers.
The prototype checks its own canonical byte roundtrip; this is not an RFC8785
or JavaScript interoperability claim. Unicode is checked by UTF16 code units,
including supplementary characters, combining marks and isolated surrogates.
No normalization occurs. Integers outside the exact JavaScript-safe range and
nonfinite numbers are refused. Core/Node serializer/decoder interoperability,
including number formatting, remains a separate prerequisite before integration.

All raw/inflated JSON, XML/carrier and declared byte sizes must remain within
the existing33554432-byte bound. Decompression reads bounded128KiB chunks and
detects a one-byte-over-limit sentinel; it never trusts a claimed length to
allocate unbounded output. Single-member EOF, exact lengths, gzip CRC and
payload SHA256 must pass. Trailing/concatenated/truncated data, invalid Base64,
wrong bindings, unknown fields, duplicate JSON keys, unsafe/nonfinite numbers,
depth above128 or above2000000 preflight JSON token sentinels are refused.

XML is parsed incrementally with node/depth checks, rejects DTD/entity
declarations, unknown elements/attributes and index/payload drift. The hard
XML cap50000, target49000, byte cap32MiB and worker512MiB are not raised.
The JSON/reader guards are additional conservative bounds, not a replacement
for the original whole-package XML guard. A final runtime consumer must return
only an aggregate whose index, payload, ownership and actual targets all pass;
atomic staging/publication/abort behavior is not implemented by these lab scripts.

### Closed-producer and malformed-input evidence

Each fixture has a producer container followed by a different consumer
container. The host verifies the producer has exited successfully before
copying only the carriers and reference digests into a fresh read-only delivery.
The consumer mounts decoder code/carrier/reference, not original plan/fixture
ledgers or snapshots. It reconstructs all original provenance after producer
exit, validates ranges and compares both readable/decoded indexes. Independent
verification then compares the reconstructed data with the retained originals
in full, including canonical bytes and every original geometry/style/map fact.

| Fixture | Uncompressed transport body | Gzip/Base64 XML carrier | Complete readable map part | Actual map XML nodes |
| --- | ---: | ---: | ---: | ---: |
| Current1800 |16818429 bytes |789515 bytes |2939461 bytes |3602 |
| UAT baseline |847040 bytes |61564 bytes |155490 bytes |123 |
| SRS baseline |259562 bytes |21472 bytes |58622 bytes |80 |

The raw bodies include the new primary index and all old provenance, so they
are larger than the earlier provenance-only byte estimate. Complete-map sizes
include the readable index outside the compressed payload, not just gzip bytes.
Exact preserved member counts are10800,519 and146. Actual map-node counts equal
the prior budget model's old-map-plus-one counts. This confirms the metadata
component only;45805/34656/48557 remain renderer/style/full-package projections.

Per fixture,23 payload controls refuse bad versions/profiles/codecs, wrong
bindings/hash/length, invalid Base64, gzip truncation/trailing/concatenation/
CRC damage, duplicate JSON keys, excessive depth/tokens, unsafe/nonfinite
numbers, lost members, range drift, anchor collision and a32MiB+1 inflate bomb.
Eight XML controls refuse DTD, wrong version, unknown attributes/children,
duplicate provenance, readable-index drift and depth/node exhaustion. Total
negative cases93; all refuse. Twelve UTF16 edge vectors per fixture roundtrip.
These are scoped transport/schema controls, not an exhaustive hostile-input
theorem or native Word/rendering tests.

Twelve sequential workers across the supporting carrier and complete-map
rounds use512MiB/swap0/network none. The external coordinator keeps its existing
128MiB address-space budget. Maximum worker peak353681408 bytes
(**337.296875MiB**); all OOM/oom_kill counters remain zero. This includes
negative tests but not a simultaneous real Core renderer. Input/package trees,
Core/Service candidates and original container identities stay unchanged; no
owned lab container remains running. Oracle is the OCI VM; no DB or original
API/SQL/storage is used.

### Remaining gates and stop

The metadata losslessness/size and lab-contract scope is accepted. Do not
claim actual source-line Word targets, native glyph/baseline/ink fidelity,
JavaScript/Core interoperability, integrated memory/publication lifecycle or
full DOCX acceptance. Raw Core glyph/ink facts absent from these snapshots
still need the actual owned producer. The next useful bounded proof is the
same codec/contract in Node on copies, then actual style/line XML and target
binding, before Word comparison or Core implementation authorization.
No Core/Service code edits, DOCX construction, Word run, original-data/service
action, merge, push, release, installation or map-truth promotion occurred.
Only this canonical plan and external lab contract/proof artifacts change.
