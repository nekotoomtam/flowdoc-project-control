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

## Node/Python interoperability,2026-11-03: stopped on V8 heap OOM

Status: **STOPPED_V8_HEAP_OOM_NODE_1800_NO_RETRY**.
The owner explicitly required stopping on OOM. The full interoperability gate
is not accepted. No further codec/lab run, repair, heap/cap increase or retry
occurs after the observed OOM. This records the stop, not a new execution round.
Owner remains Core for any future implementation and Project Control for
status. Role Evidence Reviewer; single-room IDs not applicable. Product pins
remain Core582f141 and Service db15e9d; the packet records full identities and
starting PCa79e80c. No product files or Python reference contract are changed.

Evidence root:
`C:/Users/nekot/Documents/FlowDoc-recovery/source-line2-node-interop-20261103/`.
Use `verification.json`, `oracle/preflight/preflight.json`,
`oracle/receipt.json`, `matrix/packet.json`, `matrix/oracle/receipt.json`,
`matrix/oracle/node-current/run.log` and `host-samples.jsonl`.
`record-stop.py` only reconciles retained logs/receipts/artifact hashes and
candidate state; it does not execute another codec test.

The bounded external Node prototype preserves parsed object key order,
UTF16 string units and numeric literal kind for the existing Python lab JSON
dialect, and checks a single gzip member/CRC/length with bounded inflate.
The unchanged Python codec/map/encoder files are byte-hash checked against the
accepted prior proof. No Python protocol was changed to force compatibility.
All prototype files live outside Core/Service; the Node codec worker itself
does not launch Python (one process sampled in its cgroup).

### Accepted small proof, not full acceptance

One512MiB preflight worker passes85 Python-generated cases:82 finite float64
values (targeted edges and64 deterministic samples), Unicode/UTF16 edge
strings, ordered/numeric-looking keys including data-only __proto__, and
safe integers. The Node decoder/re-encoder matches Python's canonical body
hashes. Fresh Node float values also match the expected IEEE754 bits and
serialized hashes for these cases. A direct raw-inflate consumed-byte probe
checks the gzip member boundary on the pinned Node24.21.0 runtime.
This is finite scoped evidence, not an exhaustive float64/canonicalizer proof.

The subsequent full matrix planned fresh Python producer -> fresh Node
decoder/encoder -> fresh unchanged Python decoder for each of current1800,
UAT and SRS, with31 payload/XML refusal cases per full Node worker.
Execution stops after these two groups:

| Group | Outcome | Peak cgroup bytes |
| --- | --- | ---: |
| py-encode-current |completed, exit0 |188067840 |
| node-current |V8 heap OOM, exit139 |481464320 |

The fatal log states `Allocation failed - JavaScript heap out of memory` after
GC near a roughly256MB heap. Maximum total worker memory is459.16015625MiB
under the unchanged512MiB/swap0 cap. Docker OOMKilled is false and cgroup
oom/oom_kill counters are0: this is a confirmed V8 heap OOM, not a cgroup kill.
Zero cgroup OOM counters must not be reported as a no-OOM PASS.

The Node group has partial envelopes, source-line2.xml, restored-body.json and
node-vectors.json, but no final node-result.json/result.json. Source ordering
and these artifacts indicate progress through the base/vector output path;
there are no phase markers establishing the exact failing allocation. Do not
promote partial outputs to a completed worker or assume the codec alone,
rather than retained harness data/refusal workloads, caused the allocation.
The end-to-end Python->Node acceptance remains incomplete.

py-decode-current and every UAT/SRS matrix group are unrun. Therefore actual
full-fixture Node->Python consumption, complete refusal coverage and the
full UAT/SRS interop paths remain unverified. The collector's missing-directory
tar warnings refer to those unrun groups; they are not the OOM's cause.

### Stop disposition

No retry or larger heap is attempted. All owned lab containers are stopped;
original container identities, source/package trees and Core/Service Git state
remain stable. Oracle is the isolated OCI VM; no original API/SQL/storage or
DB access, original service stop, merge, push, release or installation occurs.
The prior Python-only metadata proof remains valid in its prior scope; it
does not cover this failed full Node worker.

Recommended next request: read-only review of object lifetimes in the Node
codec and its harness, using these artifacts, then agree a bounded new proof.
Keep512MiB and all existing caps. Do not infer that raising V8's heap solves
the design or that a product defect is proven. Following the stop condition,
only evidence reconciliation and this status update are performed; no further
Node/Python codec/lab tests run. The status-only Markdown change uses a static
diff check and direct receipt/log review, not a new runtime test claim.

## Node codec/harness lifetime review and proposed proof,2026-11-03

Status: **READ_ONLY_LIFETIME_REVIEW_AND_PROPOSED_PROOF_PLAN_COMPLETE_NOT_EXECUTED**.
The runtime gate remains STOPPED_V8_HEAP_OOM_NODE_1800_NO_RETRY. The explicit
request permits reviewing retained evidence and planning only: no rerun,
instrumentation, codec/harness repair or Core/Service edit is performed.
Owner Project Control for this review/plan; Core for any eventual product
implementation. Roles Evidence Reviewer/Planning Partner; single-room IDs not
applicable. Active host model inline; no separate room/agent. Product pins
remain Core582f141 and Service db15e9d, with PCefc9952 at review start. The old
generated October4 snapshot concerns other Work and is not current lab truth.

Evidence root:
`C:/Users/nekot/Documents/FlowDoc-recovery/source-line2-node-lifetime-review-20261103/`.
Read `review.json`; `record-review.py` only reads frozen source, existing
receipts/samples/archive mtimes, artifact metadata/hashes and Git state.
No codec is imported/executed. No Node, Oracle/SSH/Docker/API or lab test is
run. Prototype hashes remain unchanged, as do the earlier evidence inputs.

### Confirmed implementation facts and their practical limits

Source references below are the immutable prior matrix copies under
`source-line2-node-interop-20261103/matrix/harness/node/`, not product files.

| Source | Lifetime/overlap established by implementation |
| --- | --- |
| node-worker.mjs:4-5,10-18 |The positive body is needed again at line18; generated.raw and xml also have final uses. They therefore span refusal testing. Semantic negatives decode a second complete body while the original good body still has a future use. |
| node-codec.mjs:20-29,31-46,65 |decode holds inflated bytes and builds a parsed graph, then canonical validation builds chunks/joined JSON/a Buffer. strictParse also creates ASCII text and per-object order metadata. Several representations can overlap; their total heap cost is not the JSON byte count. |
| node-map.mjs:12-15; node-worker.mjs:4,16 |parseMap builds a complete XML DOM and another index. rejectXml decodes a complete body before comparing that index. The outer good body is still available to the harness, making duplicate live graphs a plausible peak path. |
| node-worker.mjs:12-13,17 |Arrays eagerly construct4 compressed,5 raw-JSON and8 XML variants before iteration. Several XML variants represent complete maps. Future array entries remain referenced; physical string copies may share storage and cannot be inferred from logical lengths alone. |

A separate **confirmed lab-prototype contract deviation** exists in
node-map.mjs:12: DOMParser.parseFromString builds the full DOM before the
traversal checks50000 nodes/depth128. The Python mapxml.py XMLPullParser
checks incrementally, as required by the existing lab contract. Node's input
byte cap still applies, but does not make the node/depth checks pre-allocation
guards. This is not a confirmed cause of the observed OOM or a Core defect.
A passing finite test set must not waive this known reader-ordering gap.

This is confirmed allocation/lifetime structure, not confirmation of the exact
OOM allocation. The order/floatFields WeakMaps are not by themselves evidence
of a leak: weak keys do not establish a persistent root. Actual retained
strings, dead top-level bindings, GC reclamation, per-object overhead and the
heap/external split were not measured. No leak or product defect is proven.

The retained restored-body is16818429 bytes and its SHA256 remains
6b3e268ae44fb56219ad87f58f3f320ac04bca28a52649eed8fdada08b1aa6ea.
The node-vectors artifact is complete JSON with85 entries. Archive mtimes
place the base/vector outputs around2-3 seconds after container start, with
one-second precision. Existing host samples rise after that interval and peak
at481464320 bytes in the roughly5-second bucket; fatal GC occurs near the
end of the13-second run. Host and archive timing origins differ slightly.

These observations support **Probable Risk: later refusal workloads overlap
retained positive data**. They do not identify the failing case or distinguish
codec internals from the harness's additional live data. No phase markers,
heapUsed/external samples, heap snapshot or isolated full-size terminal PASS
exist. The partial files are still not accepted producer outputs or a passing
worker, and cannot bypass the previous stop condition.

### Proposed proof sequence, not authorized execution in this review

Keep the original Node codec/map modules and Python reference byte-identical
for the first proof. Change only a separately scoped future lab driver/case
preparation lane. No product branch or runtime architecture changes follow
from reorganizing the lab. Keep the same cached image/Node version, default
heap configuration,512MiB/swap0 per worker, existing coordinator128MiB budget,
50000 hard XML nodes,49000 target and32MiB byte cap. No GC forcing, larger
heap, heap snapshots, smaller corpus/bomb, weakened canonical/CRC checks or
dropped refusal cases.

1. **L0: prove the measurements on small cases first (2 workers).** Add
   bounded driver-boundary begin/end/case markers, emitted synchronously as
   compact numeric JSONL. Record process.memoryUsage (rss, heapUsed, heapTotal,
   external, arrayBuffers), v8 heap_size_limit and only relevant Node flags.
   arrayBuffers is included in external; do not add them as disjoint memory.
   Keep host cgroup current/peak/events alongside the worker trace. No values,
   glyphs, full JSON/XML, env dump or in-memory sample history belongs in the
   trace. The first worker rechecks all85 pinned Python->Node vectors and
   emits Node vectors; the fresh unchanged Python consumer checks those85
   outputs after the Node producer exits successfully. Compare bytes/hashes,
   IEEE754 bits, Unicode units, key order and selected small refusal reasons
   with the prior scope. A changed result/fixture/configuration stops L1.
2. **L1: isolate the full positive interop path (2 workers per fixture).**
   Start with current1800. Reuse only successful immutable pinned Python
   producer inputs; do not reuse the failed Node worker as an accepted producer.
   A fresh Node worker performs decode, index validation and re-encode only,
   writes a terminal result and exits0 before a fresh Python consumer checks
   its complete data. It contains no golden-vector or refusal loops. Scope
   XML/index comparison to a function returning only compact results, and
   do not retain redundant graph/raw/XML objects for a later final report.
   Function scopes permit collection but do not guarantee it; successful
   process exit is the resource-release boundary. Codec modules stay frozen.
   Do not clone decoded objects through ordinary JSON/structuredClone to
   discard state: that can lose numeric-literal/key-order metadata and change
   the canonical wire bytes. Current1800 must pass before later fixtures.
3. **Reader-contract prerequisite before acceptance.** After the L0/L1
   current1800 diagnostic milestone, review the Node DOM-before-guard gap
   separately. A lab-only reader repair must establish node/depth/resource
   checks during bounded parsing or before large DOM allocation, preserve
   complete schema/entity/namespace validation and be verified against the
   Python reference. Do not substitute a naive tag-count regex or change
   the original contract/limits. This is not repair permission in the
   driver-only proof. The unchanged reader cannot receive full contract
   acceptance even if a reorganized harness happens to pass.
4. **L2: preserve every refusal case with separate input lifetimes.** Only
   after that known contract gap is resolved, a fresh bounded preparation
   worker for each fixture creates pinned malformed
   input files without editing the good input; it then exits. Five fresh Node
   consumer groups handle envelope/wire10 cases, gzip/JSON9, semantic-map3,
   XML8 and inflate-bomb1. Consume one file at a time using small path/case
   descriptors, not arrays of full payload variants. Refusal consumers must
   not first decode/retain a good baseline body merely to construct bad data.
   Prepare lost-member/range/collision cases with valid CRC/hash so the
   intended semantic guard is exercised. XML index-drift still requires real
   payload comparison. The32MiB+1 inflate bomb gets its own worker with no
   unrelated positive graph. Return only case ID/error category/counts;
   do not accumulate errors or parsed objects between cases. Collection is
   not assumed; stop on OOM in any group rather than silently splitting or
   retrying that failed group again.
5. **L3: close coverage conditionally.** Finish current1800 positive and
   refusal coverage first, then the same UAT and SRS paths if prerequisites
   pass. Preserve all85 vectors in both directions and31 refusal cases for
   each fixture (93 total). L1 alone is not full codec acceptance. The coverage
   ledger must distinguish reused immutable inputs, newly passing terminal
   results, failed cases and unrun groups. The prior Python-only proof and
   small preflight are not substitutes for the remaining matrix.

Proposed first diagnostic budget:4 workers, L0's2 small workers plus the
current1800 L1 Node/Python pair. Later, once the known reader gap and its
separately agreed repair checks are resolved, the complete matrix has a
conditional ceiling of26 sequential worker invocations:2 small workers plus,
per fixture,2 positive workers,1 case-preparation worker and5 refusal workers.
Reuse unchanged passing evidence where valid;26 does not include a reader
repair's separate budget or require repeating passing scopes. At most one
processing worker runs at a time; the coordinator stays outside.
These are ceilings, not permission to run now or repeat passed work. Stop on
the first V8/cgroup OOM, timeout, unexpected mutation, fixture/binding mismatch
or failed semantic prerequisite. Preserve case/phase traces and unrun coverage;
no automatic retry, new grouping, dependency install or heap adjustment.

### Interpretation and conditional repair route

If unchanged codec L1 fails on its own, return to codec design with the last
bounded function marker and memory split. Potential later lab-only work is
incremental canonical hashing/writing or reducing parse/DOM overlap, preserving
all Unicode/number/order/budget/CRC/ownership rules. Do not implement those
changes inside a driver-only verification scope; they need a separate request
and full affected interop revalidation. Internal per-allocation hooks, if later
needed, must be an explicitly instrumented scratch copy checked for semantic
equivalence, not silently substituted for the frozen codec.

If frozen-code L1 passes, it supports the baseline-alone fit hypothesis but
does not isolate the original bad case or settle the XML reader contract gap.
If the later conforming reader and every isolated L2 group pass, the result
supports the proposed lifetime organization while incorporating that separate
reader repair. It must not be attributed to a harness-only fix. It still
does not establish the exact original failing allocation, every hostile input, integrated Core
working-set memory, Word geometry or production readiness. Actual line/style
XML, target binding and the remaining R2/R3 gates stay open.

This review changes only this existing canonical plan and external static
analysis. Verification is direct source/receipt/timestamp/hash review plus a
static documentation diff check, not a new runtime test. No prototype/harness,
Python reference, Core/Service or original data/service is changed. No remote
lab/Oracle/Docker request, rerun, merge, push, release, installation or map-truth
promotion occurs in this review. The proposed proof awaits a new instruction.

## Node lifetime proof and labelled OOM localization (2026-11-03)

The owner's subsequent instruction authorized following the diagnostic plan to
find the cause. This single-room scope changed only external lab drivers and
metrics; the Node codec/map and Python reference remained frozen. Execution IDs
are not applicable. Evidence Reviewer/Planning Partner owns this checkpoint;
Project Control owns this bounded status append. No Core/Service implementation
or map-truth change follows from it.

Evidence root:
`C:/Users/nekot/Documents/FlowDoc-recovery/source-line2-node-isolated-20261103/`.
The reconciled `verification.json` links the packets, source/input hashes,
terminal receipts, phase traces and coverage. The three receipt scopes are
`oracle/receipt.json`, `control/oracle/receipt.json` and
`labelled-original/oracle/receipt.json`. All workers retained512MiB/swap0,
the cached runtime image, default V8 heap and unchanged contract budgets. The
coordinator remained outside the processing worker. Oracle denotes the isolated
OCI VM, not an Oracle Database exercise.

### Accepted bounded results

- L0:85 small vectors passed in both directions through the instrumented Node
  driver and a fresh unchanged Python consumer;3 small refusals also passed.
- L1 current1800: the frozen Node codec completed decode/index validation/
  re-encode and exited0 before the fresh Python consumer. Both restored the
  exact16,818,429-byte body/hash,1,800 paragraphs/lines and10,800 members.
  Observed Node cgroup peak was308,957,184 bytes (294.64MiB); Python peak was
  183,013,376 bytes. This establishes baseline-alone fit for this fixture only.
- Controlled cohorts: the same3 semantic JSON refusals and1 XML index-drift
  refusal passed when isolated, after a positive prefix with references released,
  and with a minimal positive context retained for later use. Respective
  observed cgroup peaks were321.81,316.63 and400.40MiB. Retaining that minimal
  baseline alone was therefore not sufficient to reproduce the OOM.

Because all controlled cohorts passed, a further bounded diagnostic packet
preserved the original full driver's factories, retention and execution order
and added phase markers only. This was a diagnostic extension before the first
OOM in this round, not a retry after an OOM. The source-text inverse of the
metric insertions matches the frozen original driver. Metrics can still affect
timing/GC, so this is not proof of identical runtime allocation behavior.

### Confirmed failure interval and stop

The labelled full-workload worker failed with V8 heap exhaustion, exit139.
Its observed cgroup peak was522,858,496 bytes (498.64MiB); Docker reported
OOMKilled:false and the retained cgroup OOM counters were0. The V8 heap limit
was271,581,184 bytes (259MiB), with no added heap flags or NODE_OPTIONS.

The final marker was `xml:index-drift:decode:begin`. XML parsing had returned;
the call `decode(m.envelope, reference)` did not return, so readable-index
comparison was not reached. At the last marker, heapUsed was145,170,352 bytes,
rss440,455,168, external62,123,605 and arrayBuffers48,229,761. ArrayBuffers is
part of external, not an additional disjoint total. These samples localize an
interval; they do not identify the exact internal failing allocation.

All23 payload refusals and the first4 XML refusals emitted rejection markers
before the OOM. These27 observations are not a terminal passing full worker.
XML child/depth/node-limit cases remained unrun. All experiments stopped on
this first OOM; there was no retry, heap adjustment, reader repair or further
runtime test. Partial output from the failed worker is not an accepted producer.

### Interpretation, limits and next boundary

Confirmed: the full positive fixture fits alone, the controlled refusal cohorts
pass, and the labelled original composition exhausts V8 heap while decoding the
embedded payload in XML index-drift after XML parsing. The leading explanation
is overlapping working sets/allocation pressure from positive state, earlier
variants, parsed XML/index and another full JSON decode/canonical representation.
No individual retained object or factory is proven necessary or sufficient;
strict JSON parsing versus canonical serialization inside decode remains
unresolved. The exact case/instruction of the earlier uninstrumented OOM is
also not proven by this labelled reproduction. This is not evidence of a
general memory leak.

The independent known Node reader gap remains: DOM construction precedes
node/depth guards. It was neither fixed nor proved to cause this OOM. Full
reader/codec acceptance, UAT/SRS coverage, integrated Core memory and Word
content/geometry gates remain open. R2 is not closed.

Next proposed scope: retain separate worker/input lifetimes for refusals;
separately authorize a lab-only reader candidate with early bounded XML/schema
guards and preserve genuine payload/index comparison. The existing index-drift
fixture changes an anchor to invalid syntax; future acceptance must also include
a valid-looking unique anchor swap so an early syntax rejection cannot replace
the actual index/payload comparison. Then complete the affected matrix without
repeating unchanged passing scopes. No repair or additional run is authorized
by this status entry.

Instrumentation evidence caveat: `instrumentation-manifest.json` hashes the
instrumented source with LF normalization; the archived packet separately hashes
the actual CRLF file bytes. Source-text reversal was checked with universal
newline normalization. Do not interpret those two different digests as a
byte-exact reversible archive claim. The frozen codec/map hashes are recorded
in `verification.json` and match across these runs.

Closure of this diagnostic checkpoint uses receipt/trace/hash reconciliation,
independent read-only review, documentation diff review and `git diff --check`.
No Node documentation/test process was started after the OOM. Core and Service
remain unchanged and clean; original service identities stayed stable. No
original data/service action, merge, push, release or installation occurred.

## Lab reader repair and isolated refusal matrix (2026-11-04 checkpoint)

The owner next explicitly authorized splitting test-data lifetimes and repairing
the external lab XML reader to check the same budgets before DOM construction,
then continuing tests with512MiB/worker and first-OOM stop. This is a new bounded
implementation/verification scope, not permission to change Core/Service or
reopen an old registered round. Single-room execution IDs remain not applicable.
Role: external lab implementer, then Evidence Reviewer/Project Control Steward.
Authority for product implementation remains with its owner repositories; this
entry records lab evidence only. The evidence namespace retains20261103 because
it was opened before the local date changed; this checkpoint is2026-11-04.

Evidence root:
`C:/Users/nekot/Documents/FlowDoc-recovery/source-line2-node-reader-20261103/`.
`verification.json` reconciles immutable per-stage packets, receipts, hashes,
case results, passing output body hashes, non-OOM failures and unproven claims.
Relevant external source files are `xml-preflight.mjs`, `node-map.mjs`,
`negative.mjs`, `prepare-negatives.py`, `guard-test.mjs` and `reader-test.mjs`.
The Node codec/Python reference remain unchanged; all worker mounts are read-only
apart from dedicated lab outputs. No dependency installation is used.

### Repair and regression proof

The RED test instruments actual DOM document/element creation. The old reader
created1 document and50,001 elements before rejecting the node case, and1
document/129 elements before rejecting excessive depth. This confirms that the
test exposes the old DOM-before-guard behavior rather than merely checking an
error string.

The lab candidate first runs the pinned xmldom0.9.12 SAX parser through a custom
counting handler that allocates no DOM document/elements. It retains only a
depth-bounded stack of open tag names and parser state, and checks50000 element
starts/depth128/32MiB before calling the original DOM/schema reader. This is a
parser pass, not regex tag counting. XML warnings/errors, invalid UTF-8 and
declarations remain refusals; the unchanged second pass still validates the
map schema, namespace/attribute shape, members and envelope bindings. This
strategy preserves the existing element-count contract; it does not introduce
a new total count across all attributes, comments or text nodes.

Final guard tests reject over-limit inputs with0 DOM documents and0 DOM elements
created.20 reader checks pass, including exact node/depth boundaries, schema/
index/envelope preservation, escaped delimiters, comments/PI/CDATA, declarations,
unknown entities, duplicate attributes, malformed tags, multiple roots, trailing
text, namespace/prefix errors, duplicate provenance, invalid UTF-8 and byte cap.

The refusal harness now prepares immutable bad inputs in a separate worker that
exits before consumers launch. Five fresh Node consumer groups read one case
file at a time: wire10, gzip/JSON9, semantic3, XML9 and inflate-bomb1. Consumers
hold no positive baseline merely to manufacture bad inputs and retain only
compact result rows. The original31 cases per fixture remain; a32nd case swaps
two valid-looking unique anchors. All3 swap cases reached embedded decode and
real payload/index comparison before returning MAP_INDEX_DRIFT. Early syntax
rejection is therefore not being substituted for that comparison.

### Passing scope and memory

| Fixture | Exact Node-to-fresh-Python body/coverage | Refusals | Node positive peak | Highest fixture worker peak |
| --- | --- | --- | --- | --- |
| current1800 |1800 paragraphs/1800 lines/10800 members |32/32 |303.04MiB |329.09MiB |
| UAT metadata |58 paragraphs/63 lines/519 members |32/32 |63.89MiB |78.06MiB |
| SRS metadata |39 paragraphs/39 lines/146 members |32/32 |39.75MiB |72.85MiB |

All3 positive Node producers exited0 before unchanged fresh Python consumers;
restored raw-body SHA256 and complete map/coverage match on both sides. All96
refusals pass (the prior93 plus3 valid-anchor swaps). The frozen codec's earlier
85 bidirectional vectors are reused from the preceding checkpoint; they were
not needlessly rerun. These UAT/SRS objects are complete source-line metadata
fixtures from the pinned prior Python proof, not newly rendered full DOCX files.

Every launched worker retained512MiB memory with equal memory+swap (swap0),
default V8 heap and unchanged caps. The coordinator stayed outside with its
128MiB address-space bound. No V8/cgroup OOM occurred in this scope. There were29
worker invocations including RED and non-OOM development failures; no two
processing workers ran concurrently.

### Recorded failures, review and evidence limits

Two non-OOM failures are retained rather than relabelled as passes. The first
GREEN stage passed its guard, then its coordinator attempted a duplicate
node_modules symlink when reusing a harness folder; the next reader worker was
not launched. A separate immutable stage then exposed missing open-tag context
for CDATA in the new counting handler. That context was repaired using bounded
name-only state. The final candidate passed the reader suite and a repeated
zero-DOM guard before all3 fixture matrices. These bounded corrective runs
account for the extra worker invocations; they were not OOM retries. Earlier
failed packets/results remain immutable.

The current1800 positive driver's inherited `readerConformance` summary still
names the old reader gap. Its functional checks used the final candidate; the
dedicated guard/source hashes and `verification.json` explicitly reconcile this
stale summary. UAT/SRS use the same assertions with only that summary label
corrected. Do not silently rewrite the original result or infer a second parser
failure from its inherited prose.

The private xmldom handler API is pinned lab machinery, not a supported product
interface. The preflight still holds bounded input text and per-tag attributes;
it is not a constant-memory streaming reader or proof against every possible
hostile XML. This result supports the tested resource/lifetime organization,
not an exact explanation of every historical failing allocation, a general
memory-leak claim or product-wide XML security acceptance. Final independent
static read-only review returned PASS for this bounded lab proof with no
actionable correctness findings. `review.json` preserves its scope and declined
items: arbitrary hostile XML, full XML conformance, other/private parser APIs,
all DOM allocation types, historical OOM/leaks, integrated product memory,
actual DOCX/Word fidelity, R2/production readiness and unrecorded external side
effects. All remain unverified or outside scope; none is promoted to PASS.

PASS is limited to the lab pre-DOM guard and the3-fixture codec/refusal scope.
Static source/input/receipt reconciliation, coverage review and documentation
diff checks support that checkpoint. R2 actual renderer/XML reduction, integrated Core working-set
memory, true rendered target binding, Word content/geometry and Core/Service
integration remain open. Next proposed work is to review the source-line/2
representation and lifetime contract for an actual Core candidate before any
product changes; do not treat this lab reader as integration permission.

Only this existing PC plan is updated. Core/Service heads and clean state are
unchanged; receipts compare stable original container identities and show no
owned running lab workers at completion. No original API/SQL/storage access,
service stop, merge, push, release, installation or map promotion occurs.

## R2 reviewed route from lab evidence to Core and Word (2026-11-04)

Status: **R2_PLAN_REVIEW_COMPLETE_COPY_RENDERER_PREREQUISITES_OPEN**.
The owner requested a plan review/preparation only. No Core/Service changes,
new DOCX, Oracle/OCI/Docker call, Word launch or runtime experiment is performed
in this review. The preceding lab checkpoint is retained as accepted in its
bounded scope; this section does not reopen its verification or promote R2.

Owner: Project Control for this canonical plan; Core for future renderer,
mapping/receipt and resource-lifetime changes. Role: Evidence Reviewer then
Planning Partner/Project Control Steward. Single-room IDs: not applicable.
Work size medium, risk routine for read-only planning. Active host model inline;
no new room/agent/model dispatch is needed. Document budget: this existing plan
only. Current proof budget: source/evidence/reference review and static diff
checks, zero runtime workers. The stale October4 Editor snapshot is not R2
authority; the explicit request and these current records resolve the scope.

Rechecked bases: Core582f141566d1dd0cc4df53a7779818cab9c3d111 and Service
db15e9d45973fb3f7682ee8b6bae37c5d82124a4 are clean; PC starts this review at
2d6250280b9a0cd9b4603203736b6289b92c2ba7. The accepted Linux archive remains
32484c0eac1f4dbbd578d05d7d2d04142bd7a0095a43471a777a736236f4e357.
Do not substitute an installed/main package or overwrite prior lab evidence.

### What the latest lab result changes

The lossless source-line metadata codec, guarded lab XML reader and separated
refusal lifetimes now have3-fixture Node/Python evidence. Reuse
`source-line2-node-reader-20261103/verification.json` under the external recovery
root and its immutable receipts, plus the earlier85-vector proof. The96
refusals include3 genuine payload/index comparisons using valid-looking anchor
swaps. This removes the previous tested lab-reader/lifetime prerequisite; it
does not prove actual emitted line geometry, actual target lookup, a supported
Core codec dependency, whole-renderer512MiB fit or Word fidelity.

Keep inline source-line paragraphs with shared complete styles as the proposed
primary representation. Do not revive style-only cleanup or one-VML-box-per-line
as the primary repair: their measured/projected current1800 counts do not fit.
The following remain projections until actual serialization of every XML/rels
part, including all styles, maps and relationship/content-type entries:

| Fixture | Projected complete-package nodes | Margin to49000 | Actual rendered result |
| --- | ---: | ---: | --- |
| current1800 |45805 |3195 |Unverified |
| retained UAT baseline |34656 |14344 |Unverified |
| retained SRS baseline |48557 |443 |Unverified |

The3 source-map counts3602/123/80 are measured metadata components; they are
not complete DOCX counts. A compressed payload is not a substitute for visible
Word text/styles. Never add isolated lab peaks to estimate combined memory or
treat512 minus329.09MiB as proven headroom for the Core renderer.

### Rechecked owner paths and contract gaps

- `src/docx/source-layout.ts:19-35` owns SourceWord/SourceLine/SourceGuide,
  genuine private guide identity and the current receipt. It explicitly reports
  editable word boxes, `source-word-layout`, regenerate-after-edit and the old
  map path. A line representation cannot silently keep those descriptions.
- `src/docx/source-layout-xml.ts:25-116` consumes genuine applied guides,
  quantizes eligible table row frames, emits glyph-advance/spacing corrections,
  computes ink padding/baselines and writes the existing source-word/1 map.
  Removing boxes changes positioning/shaping context even when strings and
  resolved property signatures are equal. Snapshot metadata lacks some raw
  glyph/ink facts; preserve this gap rather than inventing them from XML.
- `src/docx/writer.ts:147-184` serializes source layout before counting and
  attempting compaction; the final loop checks all XML/rels and relationship
  targets before publication. Do not simply append a full decoder/DOM/reducer
  to that peak working set or weaken this final guard to make a plan pass.
- The lab profile remains `lab-copy`/`virtual-plan`. Its targetPlanSha256 does
  not yet bind an emitted Word paragraph. Product version/profile, actual
  target digest basis, mixed old/new controls and consumer compatibility need
  explicit review before Core adoption. Neither a decoded checksum nor a
  known tag name proves that the actual target exists and owns that range.

### Ordered next work, not execution authorization

Each item below needs its own bounded kickoff before execution. Preserve
R2-A's refused result; these steps continue R2-B/C/D without relabelling it.

- [ ] **R2-B0: settle actual facts, anchors and reference eligibility.**
  Freeze a fixture manifest with input/template/resource/package hashes and
  the complete visible-text/section/table/source-map coverage for current1800,
  UAT and SRS. Specify a plain bounded fact record produced by the real owned
  SourceGuide path: exact UTF16 text/ranges, ordered members, glyph clusters,
  advances/offsets/ink, line origins/frames/baselines, table insets, section
  ownership and effective font/style identities. No functions, font adapters,
  caller XML hints or live producer handles may be transported. First resolve
  how these missing raw facts can be observed in an explicitly instrumented
  scratch copy; do not edit the product checkout or assume a public API exists.
  Keep data within the unchanged byte/worker bounds; inability to fit returns
  to design, not truncation or a larger cap.

  Define source-line/2 actual-target lookup and truthful receipt fields before
  emitter work. A target key includes its part and legal noncolliding paraId;
  allocate against existing paragraphs, not just new lines. Bind the map to
  actual visible target/style facts without a self-referential whole-ZIP hash.
  Reject absent/ambiguous targets, overlaps, stale digests and collisions.
  Specify whether old box maps and new line maps can coexist and how each
  control is counted/owned; otherwise refuse a mixed case. Do not announce a
  new product profile or migrate old source-word/1 consumers in a lab proof.

  Microsoft specifies paraId as unique within the document part with values
  greater than0 and below0x80000000; this does not establish save/edit stability.
  See the [official paraId contract](https://learn.microsoft.com/en-us/openspecs/office_standards/ms-docx/a0e7d2e2-2246-44c6-96e8-1cf009823615).
  Keep lab acceptance separate from this actual-target/Word identity gate.

- [ ] **R2-B1: build and count a line/style/map candidate on external copies.**
  Owner files for a later Core port are `src/docx/source-layout-xml.ts` and
  `src/docx/source-layout.ts`; the first implementation stays outside those
  repos. Start with small regression fixtures that expose style/geometry and
  ownership errors before running current1800, then UAT and SRS sequentially.
  Preserve R1 measurement and line decisions; no document-specific IDs, counts
  or string rules. Keep section properties on the actual final paragraph,
  exact whitespace, source order, table/cell/row frames and protected content.
  Do not coalesce across fields, links, bookmarks, ownership or shaping barriers.
  A matching style alone is not permission to change kerning/ligature context.

  Build shared paragraph and character styles with valid ordering, explicit
  off/toggle semantics and all required font/script/spacing/position settings.
  Test paragraph-mark properties separately from text defaults: putting rPr
  under pPr is not a general text-run default. Use the paragraph style's run
  properties where applicable, then prove the resolved styles and Word result.
  Microsoft's [paragraph-style guidance](https://learn.microsoft.com/en-us/office/open-xml/word/how-to-create-and-add-a-paragraph-style-to-a-word-processing-document)
  and [Open XML primer, paragraph/run properties](https://download.microsoft.com/download/e/1/4/e14fb96f-83b8-4a2a-84db-7fa8acbe061a/Office%20Open%20XML%20Part%203%20-%20Primer.pdf)
  distinguish these mechanisms; the old arithmetic does not validate inheritance.

  Emit real XML/style/map/relationship/content-type changes into private staging.
  Independently parse/recount every .xml and .rels part, not document.xml alone;
  validate part ownership, style references and actual map targets. Require
  <=49000 nodes on every complete fixture, unchanged hard50000/32MiB/drawing
  bounds and all visible content/styles retained. SRS's443-node projected
  margin is not a waiver: any required extra structure must be recounted.
  A49001..50000 result misses the chosen acceptance target even if it passes
  the hard guard. Over-target or geometry-ineligible cases return to design.

  Preserve no-op bytes for unchanged/ineligible content; an unsupported case
  retains its old path only if the complete package still passes its budgets.
  Otherwise retain the existing safe refusal. Cover no-op, stale ownership,
  forged index, wrong part, duplicate anchor/style IDs, partial mixed controls,
  malformed input and abort/rollback without publishing a partial candidate.
  Codec support for isolated surrogate code units is not permission to emit
  illegal XML characters or silently replace/normalize source text.

- [ ] **R2-C: native Word comparison after B0/B1 pass.**
  Use existing Word on a separately identified review host, not a new install in
  OCI. The512MiB ceiling applies to each OCI processing worker; do not claim
  the native Word application was constrained or proved under that ceiling.
  Record Word version/build, fonts, compatibility mode, page setup and render
  settings for reference/candidate. Word outputs are new disposable copies;
  baseline hashes remain unchanged. Availability is not rechecked in this review.

  Reference inventory: the retained line-design harness has
  `harness/legacy/uat-full-baseline.docx` and
  `harness/legacy/srs-existing-baseline.docx`, under the external recovery
  `docx-r2-line-design-20261103/` root. Their exact bytes are pinned in that
  packet's inputEvidence, and both file hashes were rechecked in this review.
  Recheck full-document coverage and successful native Word open before
  designating them valid comparison references; their
  existence is not current candidate-fidelity proof. For current1800 no valid
  whole-document Word reference has been established by the retained R2 run:
  its default export refused with zero bytes. Failed/staged XML, a bypassed
  oversized ZIP or successful smaller slices are not a whole-document reference.
  Settle a valid reference and its acceptance basis before closing that case.

  Compare all pages, not selected previews: text/UTF16 order and coverage,
  fonts/Thai marks and Latin shaping, line/page breaks, baselines/ink clipping,
  paragraph spacing, indentation, columns, tables/merged/protected cells,
  headers/footers/page fields, section boundaries and preserved native content.
  Establish geometry measurement tolerance from the reference/repeatability
  before inspecting candidate differences; do not enlarge it after a mismatch.
  No missing/duplicated text, changed intended line/page break, clipping or font
  substitution may be hidden by a whole-page similarity score.

  Open with no repair prompt, capture native rendering and close without saving
  the original. Separately Save As a copy, reopen, revalidate actual target
  lookup/map ownership/part identity and recount the saved package. Exercise
  navigation/selection plus an edit that makes old offsets stale: a changed
  target must invalidate/rebind explicitly, never remain falsely verified.
  The existing regenerate-after-edit behavior is not live-edit map stability.
  An unchanged Save As must meet the declared persistence contract. A repaired
  or changed file is not a pass merely because Word can display it. A Word-saved
  artifact that exceeds the unchanged budget is not accepted for bounded reuse.

- [ ] **R2-D: port only the proven design to a separately authorized Core candidate.**
  After copy/schema/Word gates, define a narrow product implementation scope.
  Expected change owners: line emission/styles in `source-layout-xml.ts`,
  genuine facts/receipt in `source-layout.ts`, staging/count/cleanup integration
  in `writer.ts`, and focused source-layout/mapping/codec tests. Select an
  internal version-pinned XML/codec implementation deliberately; do not blindly
  ship the lab's private xmldom handler hook, metrics or fixture drivers.
  No measureText/R1/native-budget/public API/Service change is included by default.

  Plan lifetimes before porting: do not retain the native ZIP, old full word-box
  XML, new full line XML, complete fact graph, decode graph and DOM concurrently
  by default. Choose the representation before materializing unnecessary old
  containers where safe; maintain the byte-identical no-op path. Release scopes
  using real ownership/process boundaries, not forced GC or assumed collection.
  Measure the integrated producer->serialize->map->ZIP->sink path under512MiB,
  default heap/swap0 with the coordinator outside. Standalone329.09MiB is not
  integrated acceptance. A new OOM stops the whole proof without retries.

  Write failing regression tests first, then port the minimum change. Reuse
  unchanged R1 evidence while rerunning changed/affected source layout, style,
  source-frame, mapping, compaction and writer/sink lifecycle checks. Include
  cancellation/failure at each new boundary, exactly-once abort/cleanup,
  no partial commit, no-op repeat generation and unchanged budgets. Verify the
  exact Linux packed archive and public-root generation before the final R3
  end-to-end Word/package/consumer gate. Service wiring remains a later scope.

### Prerequisites and stopping decisions

Blocking before actual-copy fidelity acceptance: raw owned glyph/ink facts,
actual target/profile/receipt/mixed-map contract, exact serialized totals/styles
and eligible whole-document Word reference. Blocking before Core adoption:
those copy/Word results plus integrated512MiB resource/lifecycle/package evidence
and a separately authorized implementation. Unknown external consumers are a
compatibility blocker for product adoption, not evidence that one exists or
permission to migrate it. Resolve this through bounded consumer inventory or
an explicit owner disposition of the unsupported/deprecated contract; do not
demand an unbounded proof that no external reader can exist. Other Word
versions/hostile XML universality/general
memory-leak diagnosis remain deferred claims, not newly required broad tests.

Proposed first execution budget after a new instruction: B0 only, contract and
immutable input/reference/fact-capture preparation; no full renderer/Word/Core
port until its missing prerequisites are resolved. B1 then starts with one
small RED/GREEN scope, one current1800 candidate worker and one independent
fresh package verifier, followed conditionally by the same UAT/SRS pairs.
Case-specific schema/refusal checks belong to the small scope. Freeze concrete
commands/timeouts and captured inputs in that kickoff; this plan does not
invent passing outputs or authorize an unlimited investigation. No repeated
85/96-case matrix is needed unless codec/reader/contracts change.

At every future stage:512MiB per processing worker, swap0, existing coordinator
budget, hard50000 nodes/target49000/32MiB and existing shaping/drawing limits;
stop on first V8/cgroup OOM, changed inputs/ownership, unsupported geometry,
source-target drift, count mismatch or original-container identity drift.
Do not raise caps, hide formatting in metadata, silently switch layout policy,
truncate text, run a larger-heap retry or promote partial output.

Review closure: this section is a proposed ordered route, not a product contract
approval. Self-review covered scope, task dependencies, owner paths, unsupported
geometry/styles, mixed ownership, stale maps, references and lifecycle gates.
Static source/evidence/reference-hash review and `git diff --check`
verify only the plan update. Core/Service remain clean and unchanged. No real
data/service access, merge, push, release, installation or map change occurs.

## R2-B0 owned facts, source-map draft and Word references (2026-11-04)

Status: **B0_FACTS_AND_REFERENCE_PREPARATION_PASS_CURRENT_WORD_REFERENCE_OPEN**.
This closes the bounded preparation/capture proof, not all reference eligibility,
B1, R2 or Word acceptance. The owner explicitly authorized B0 only in isolated
OCI lab with512MiB/worker, unchanged caps and first-OOM stop. Core/Service edits,
original data/services, merge, push, release and installation remain forbidden.
Role: lab observer implementer, then Evidence Reviewer/Project Control Steward;
single-room execution IDs not applicable. The existing plan is the sole prose
authority. Core582f141566d1dd0cc4df53a7779818cab9c3d111, Service
db15e9d45973fb3f7682ee8b6bae37c5d82124a4 and PC96c257cd were the starting bases.
The stale Editor snapshot remains unrelated. No B1 emitter or Core port starts.

Evidence root:
`C:/Users/nekot/Documents/FlowDoc-recovery/docx-r2-b0-20261104/`.
`verification.json` reconciles all9 immutable stage packets/receipts, source
hashes, producer/consumer results, reference hashes, failures and limitations.
`fixture-manifest.json` pins reusable ledger paths/hashes and complete producer
input inventories. Legacy Word references are comparison inputs, not automatic
new model20 staging bases: B1 must bind actual native base parts, genuine new
guide tags/context and target identities without relabelling old source IDs.
`source-map-contract.json` is the lab draft for the next copy-only scope, not
adoption of a product profile or public API. `review.json` records independent
static read-only review. No new Work registry or map-truth entry is created.

### Genuine producer capture and closed-producer checks

Node Inspector observes the unchanged packed Core at the real
`serializeSourceLayout` boundary after eligible table-row quantization, before
source XML serialization. The observer reads genuine applied SourceGuides,
calls the owned font's read-only ink/advance methods and writes an explicit
bounded JSONL ledger synchronously. It retains no extra complete ZIP/guide
graph and never changes Core files, caller options, caps or source guides.
The frozen Linux archive remains
32484c0eac1f4dbbd578d05d7d2d04142bd7a0095a43471a777a736236f4e357.

Records contain guide identity/text/effective font/style, section/container IDs,
line text/ranges/frame/baseline, member text/ranges/x/advance and11 declared
glyph fields including actual native advances/offsets/clusters plus independent
font advances and ink bounds. Missing ink is null, not a zero box. Coordinates
are source-guide-local: they are not absolute Word page positions. Cumulative
local Y derives from prior line frameTwips; native paragraph/section/table
context stays in pinned package XML and must be bound by B1. This is a plain
numeric-value/geometry record, not a heap-identity or arbitrary IEEE-bit clone.

Each producer exited successfully before its fresh Python consumer received
only immutable ledgers, original font bytes and the applicable reference/map.
The consumer imports no Core and reads TrueType hmtx/loca/glyf/OS2 directly.
Current1800 matches all10800 members/ranges against the original captured map;
text UTF8 and UTF16LE digests are checked separately. UAT/SRS additionally match
all original applied-guide texts/line/member ranges and reconstruct every
retained source-word outer box against the original DOCX. Margin/width/height
tolerance is1.0001e-6pt, accounting only for the old six-decimal serialization.
Core glyph values are captured from the real producer; this is not independent
reshaping of each glyph or proof of every inner baseline/run property.

| Fixture | Guides / lines / members | Captured glyphs | Ledger bytes | Producer peak |
| --- | --- | ---: | ---: | ---: |
| current1800 |1800 /1800 /10800 |64800 |7584776 |375.80MiB |
| UAT |58 /63 /519 |2234 |337493 |340.27MiB |
| SRS |39 /39 /146 |969 |137137 |445.21MiB |

These UAT/SRS counts cover applied source guides, not every paragraph in the
full document. The complete retained reference packages independently count
39191 and49965 XML/rels elements respectively, unchanged. SRS still needs the
new representation to meet the49000 target; this is not a new reduction result.
All processing workers used512MiB memory and equal memory+swap (swap0), cached
runtime/default heap, network none and unchanged shaping/XML/byte/drawing caps.
The coordinator stayed outside with its existing128MiB address-space bound.
There was no V8/cgroup OOM; no owned lab worker remains running.

UAT/SRS use the complete immutable earlier legacy bundles, accepted offline
converter and original verified image/font adapter. Conversion target digests
match the prior accepted results. Legacy SDK is mounted read-only only for
conversion/image preparation; actual glyph measurement uses the exact new
packed Core. No legacy template is edited, no subset replaces a full fixture,
and no original API/SQL/storage is accessed. The current1800 complete engine
result equals the earlier expected default budget refusal with zero output.
UAT/SRS outcome bytes are counted/discarded by the B0 sink; no new source-line
DOCX is emitted. Their inherited capture status string says unchanged result,
but only current1800 performs that full prior-result equality assertion.
Do not infer byte-identical UAT/SRS exports from the inherited label.

### Lab source-map contract decisions

The external draft fixes source-guide-local units, UTF16 half-open ranges,
ordered coverage, null ink semantics, resource/source identities and the exact
ordered fields of `flowdoc.actual-line-targets/1`. targetPlanSha256 covers the
canonical target manifest, actual text/ranges/resolved properties, frame/inset
facts and owned base context hashes; it excludes the carrier itself, ZIP
timestamps/compression and declared Word rsid noise. Missing/ambiguous styles
or context refuse; no guessed values or self-referential ZIP digest is allowed.

The target key is exact allowlisted part + legal unique w14:paraId + line-local
range. Collision allocation inventories every paragraph in the part. Source
text/member ownership and readable/decoded index must agree with actual targets;
former shape IDs remain provenance only. The first B1 draft converts all applied
eligible guides together or keeps the complete old source-word path. Native or
protected content outside those guides remains unchanged. Partial applied-guide
migration, unknown map entries/extensions or ownership collisions refuse.

The proposed new map part is `customXml/flowdoc-source-lines.xml`, with distinct
relationship/content-type registration included in the full-package count.
A proposed receipt reports `source-line-layout`/native-source-line-paragraphs,
regenerate-after-edit and wordVerified:false. Product adoption and consumer
migration are not authorized. Existing files and source-word/1 semantics stay
unchanged. A saved/edited target must not remain falsely verified.

Actual-copy maps must distinguish emitted-copy from virtual-plan. The frozen
lab XML reader currently accepts only virtual-plan; therefore B1 must implement
and exercise this explicit reader/contract delta and rerun affected positive/
refusal cases. The prior96/85 results cannot silently certify the new binding.
No new actual-target XML or reader was implemented in B0. Resolved styles,
actual target lookup and final manifest application remain B1 proof obligations.

### Word reference preparation and open eligibility

Lab-only copies of the pinned UAT/SRS DOCX were opened in existing native Word
16.0.20527.20112 on Windows. Both displayed without an observed repair step.
Both asked whether fields referring to other files should update; No was
selected. They were closed without saving and their hashes still exactly match
the originals/pinned packet. UI endpoint evidence is under `word/*-open-state.json`.
These are recorded operator observations with endpoint/hash support, not an
independent reconstruction of every UI interaction. Word was then closed;
no installation, external field update or original-reference write occurred.
Native Word runs outside OCI; no512MiB Word-host claim is made.

This establishes reference-file identity/native-open preparation, plus applied
guide/outer-box compatibility. It does not certify full native/protected text,
headers/footers/table/section coverage, all-page pagination, font substitution,
editing, Save As persistence or equivalence to a new inline candidate. Those
remain before full Word comparison acceptance. Current1800 still has no valid
whole-document Word reference: the original default run refused with zero
bytes. No oversized bypass package or smaller slice is substituted for one.

### Preserved failures, review and next boundary

Three non-OOM failures remain visible. The first independent verifier applied
the old census's UTF8 digest to UTF16LE bytes; code inspection established the
encoding mismatch, and a fresh consumer now checks both explicit digests.
Producer facts were unchanged. The first UAT preflight rejected an intentionally
needed legacy SDK /candidate mount; relocating it then broke its absolute
/candidate/vendor/installed-core/package symlink. Bounded read-only inspection
identified that dependency. The final packet preserves the original read-only
mount and scopes only that absence assertion out of the lab environment guard;
/target source/test absence and exact packed-Core file/dependency checks remain.
No actual UAT generation had started in those failed preflights. These were
bounded prerequisite corrections, not OOM retries or Core/Service repairs.

Independent static review returned PASS for bounded B0 preparation with no
blocking defect, retaining the shaping/inner-geometry/reference/UI-observation
limits above. B1 emission/counts, actual targets, style fidelity, Word/save-edit,
integrated lifecycle and Service behavior were not judged or promoted to PASS.
Source/input/receipt/font/map/reference hashes and coverage were reconciled;
the documentation change receives static diff review and `git diff --check`.

Next recommended request is B1's small copy-only renderer/actual-target test
scope, including the explicit emitted-copy reader delta. It must retain the
complete-package49000 target/hard50000/32MiB and512MiB/default heap, prove styles
and target/context ownership before full fixtures, and stop on first OOM.
Current1800's whole-document reference and full native/protected reference
eligibility must be resolved before claiming Word fidelity. No B1, R2-C or
Core implementation begins under this B0 authorization.

Core/Service remain clean at the starting hashes; original container identities
are stable across all stages. No original data/service action, merge, push,
release, installation, public contract promotion or DOCUMENT_MAP change occurs.

## R2-B1 small structural/binding proof; geometry admission refused (2026-11-04)

Status: **SMALL_STRUCTURE_AND_BINDING_PASS_GEOMETRY_BLOCKED_FULL_NOT_RUN**.
The owner's continuation after B0 authorizes the next bounded B1 small-copy
proof. It does not close B1/R2 or approve a Core renderer. Role: external lab
implementer, then Evidence Reviewer/Project Control Steward; single-room IDs
not applicable. Owner remains Core for future product behavior and PC for this
shared status. Starting PCfa9e287955b0d186beef9bf9ad46529597a09320; Core582f141
and Service db15e9d remain unchanged and clean. The unrelated historical Editor
snapshot supplies no execution authority here. No product files are edited.

Evidence root:
`C:/Users/nekot/Documents/FlowDoc-recovery/docx-r2-b1-small-20261104/`.
Use `verification.json`, `review.json` and the per-stage immutable packets,
receipts and results. Final producer tests are `review-green/oracle/current/`;
the fresh Node check is `review-consumer/oracle/current/consumer-result.json`.
`baseline/` contains the original default-path small DOCX and observed facts.
This is a separate2-record/2-line/12-member/72-glyph document; none of its
results represents the full1800, UAT or SRS acceptance matrix.

### What was exercised

The unchanged packed public Core generated the small source-word baseline
under default caps; receipt bytes/hash match the captured DOCX. The real guide
observer exited before any copy transformer/reader launched. A RED passthrough
control exposed the missing emitted-copy map before implementation.

The external Python structural probe replaces12 owned VML boxes with2 actual
line paragraphs, adds4 shared paragraph/character styles and a new versioned
source-line map. It preserves exact visible text/order, source ranges and old
member/shape/style XML provenance. It never moves visible text/formatting into
metadata. Paragraph text defaults are defined by paragraph-style run properties;
paragraph-mark properties remain separate. Shared character styles contain
relative deltas so common bold/italic toggles are not applied twice. Only
equal-property ASCII fragments with kerning disabled are merged; other shaping
boundaries are retained. This is a restricted structural experiment, not proof
that all Word inheritance or shaping contexts are supported.

The probe uses actual part/paraId/range targets, a canonical target manifest
bound to the closed producer's fact hash, source-owner tags and source/target
digests. It creates a distinct source-line relationship ID, preserves root
namespace bindings referenced by mc:Ignorable, and checks part/ID collisions.
Only dedicated private XML/map/rels/binding files are emitted. No inline DOCX
is committed or opened in Word because geometry admission remains refused.

Final35 Python checks cover text, targets, the16 bold/italic toggle combinations,
formatting/anchor corruption, part/relationship collisions, conservative profile
refusals and geometry/no-DOCX disposition. A fresh Node consumer uses the frozen
codec with an explicit emitted-copy-only XML-reader delta. It decodes the map,
cross-checks readable/primary indexes, actual target text/ranges, resolved-style
fingerprints and paragraph/section context hashes. It checks source-owner tags,
source fact text/font identities, exact manifest field sets and known profiles.
Its16 refusal cases include virtual-plan substitution, declaration/attribute/
index drift, manifest defects and direct formatting/style/ancestry/owner drift.

The independent Node check reconstructs only a private part set from the closed
baseline plus delivered changed parts. All XML/rels parts parse; total expanded
elements are800, drawings0, and internal relationship targets resolve with unique
IDs. This is a measured small-package total, not an extrapolation to49000 on
the large fixtures. No final new-DOCX ZIP byte-size/Word claim is made.

### Geometry block and stopping decision

The source-word implementation computes w:position together with the padded,
shifted textbox and its own inner paragraph frame. The small case has:

| Value | Observed/model value |
| --- | ---: |
| Original inner paragraph line frame |463twips |
| Original textbox vertical displacement |-1pt |
| Ordinary line paragraph frame |400twips |
| Copied w:position |5 half-points |
| SourceGuide baseline |15.016pt |
| Existing Core adapter arithmetic, old context |15.02pt |
| Same arithmetic naively applied to ordinary frame |13.5pt |

The last two rows use the Core adapter's4/5 model and are **not native Word
measurements**. They demonstrate why equal run properties are insufficient
evidence of a valid baseline translation; they do not prove Word will render
an exact1.516pt discrepancy. No ordinary-paragraph baseline/ink translation has
been established, so admission is `REFUSE_UNTRANSLATED_TEXTBOX_BASELINE`.
Full1800/UAT/SRS runs were not started. No larger heap, cap increase, forced GC,
shaping change or publication bypass follows from the small structural pass.

The eligible prototype profile is deliberately narrow: section-root applied
guides, empty Normal/default contexts and no existing paraIds. It checks actual
XML ancestry as well as supplied fact types. Unsupported table, inherited-style,
existing-anchor or direct-formatting contexts refuse. This does not implement
the future general collision allocator or mixed/native-context renderer.

### Failures, review corrections and coverage limits

Seventeen sequential worker invocations include RED and non-OOM development
failures. Peak was47.55MiB; every worker retained512MiB memory with equal
memory+swap (swap0), default heap/network none and the old XML/byte/shaping caps.
The coordinator stayed outside with its existing128MiB address-space bound.
No V8/cgroup OOM occurred and no owned processing worker remains running.

Retained failures exposed a wrong provenance member key, missing distinct
relationship ID, lost mc:Ignorable-only namespace bindings during serialization,
missing expected target digest in the first Node handoff, and overbroad profile
acceptance. Fixes addressed those implementation causes in new immutable stages;
none was an OOM retry, cap change or product-repository repair. The reused remote
driver's terminal PASS_B0_CAPTURE_STAGE label is historical wrapper prose, not
reopening B0; stage-specific results/packets determine this B1 scope.

Independent static review returned RISK for two guard gaps: direct paragraph/
run formatting could bypass verification, and style/default/XML-ancestry
rejection was broader in prose than code. One bounded correction pass added
nine regressions; `review-red` showed all9 accepted incorrectly, then
`review-green` rejected them and passed the final35 checks. A fresh Node check
also rejects those relevant target profile changes. There was no second
independent re-review; `review.json` preserves the initial findings, fix evidence
and unjudged areas rather than changing the initial verdict to PASS.

The six private document/styles/map/rels/content-types/binding artifacts remain
byte-identical across checks2, profile-green and review-green. Hash reconciliation
allows the same bytes to be consumed independently while changed rejection paths
receive their own tests. This reuses artifact evidence, not unrun behavior tests.
Full emitted-copy interoperability/refusal coverage, generic OOXML/XSD validity,
Word rendering, save/edit behavior, complete native/protected content, integrated
Core memory/lifecycle and Service wiring remain unverified. The original85/96
proofs do not certify this changed reader/profile automatically.

### Return route before a full fixture

Return to the geometry design on the small valid old-path reference. Define
how inline line frames, before/after spacing, font/ink extents and run position
map to the measured source baseline without changing total source row budgets,
line choices or glyph corrections. A separately bounded copy-only native Word
calibration can test that model against the small reference before admitting
full fixtures. Preserve all source facts and full context; do not select a
convenient property value or tolerance after seeing the desired result.

Only after that mapping has evidence should B1's complete1800 candidate and
independent whole-package verifier resume, followed conditionally by UAT/SRS.
The current1800 whole-document Word reference gap also remains. This checkpoint
does not authorize that calibration, full-fixture retries or any Core/Service
implementation; the present continuation stops at the declared geometry gate.

Only this existing PC plan is updated. Source/input/output hashes, immutable
receipts, independent review disposition and coverage were reconciled; final
documentation verification is diff review plus `git diff --check`. Original
container identities and Core/Service heads stay unchanged. No original data/
service action, merge, push, release, installation or DOCUMENT_MAP update occurs.


## Baseline reference-chain review and proposed calibration plan (2026-11-04)

Status: **REVIEW_COMPLETE_OLD_FORMULA_REJECTED_NEW_FORMULA_NOT_PROVEN**.
Owner request: review the textbox/parent-paragraph reference and plan the next
formula before more execution. Active roles: Planning Partner and Evidence
Reviewer, then PC Steward for this existing canonical note. Product owner: Core;
shared planning owner: PC. Single-room Work/Phase/Checklist execution IDs are
not applicable. This is bounded discovery/planning, routine risk; it authorizes
no implementation or further runtime/Word calibration. Current PC base5c2676c;
Core582f141 and Service db15e9d remain read-only. The generated October4 Editor
snapshot is unrelated to this request; the explicit scope and this plan govern.

Document budget: this section only; no new Work, map or product documentation.
Proof budget: static inspection of the retained small DOCX/PDF/facts and one
bounded local measurement reconciliation using two existing PDF parsers. No
remote connection, new lab worker, app control or original-service access.
The correction preserves B1's structural pass and geometry refusal; it does
not reopen a historical registered execution or turn its proof into readiness.

### Reconciled result of the interrupted small Word round

Evidence root:
`C:/Users/nekot/Documents/FlowDoc-recovery/docx-r2-baseline-word-20261104/`.
Use `protocol.json`, `produce/oracle/receipt.json`,
`produce/oracle/current/geometry-result.json`, the three DOCX/PDF pairs and
`baseline-review.json`. The new JSON records static remeasurement of existing
outputs, not a new Word or Oracle test. All three DOCX SHA256 values still match
the immutable Oracle producer result. Word's interrupted close action remains
unverified; no app action was attempted in this review.

| Existing Word export | Line1 baseline from page top | Line2 | Pitch |
| --- | ---: | ---: | ---: |
| Original source-word reference |91.70pt |111.62pt |19.92pt |
| Inline, copied position5 |70.20pt |90.26pt |20.06pt |
| Inline, former formula position2 |71.76pt |91.82pt |20.06pt |

Both PDF parsers independently agree on the first RESOURCE text origin of each
line: pdfplumber/pdfminer character matrices and pypdf text visitors. All66
non-whitespace characters occupy the expected two baselines in each export;
non-whitespace text/order and12pt size agree. Embedded PDF font-stream hashes
agree across all three exports; settings/fontTable part bytes are unchanged.
The prior Oracle producer used39.0625MiB peak without OOM, unchanged512MiB
memory and equal memory+swap (swap0). This is reused receipt evidence, not a
current live Oracle state assertion or a512MiB native-Word-host claim.

The translated variant is19.94pt and19.80pt above the reference. Its pitch error
is0.14pt, above the already-declared0.05pt criterion; the first-line baseline
error also exceeds0.25pt. Non-whitespace glyph x-origin differences reach0.12pt
within the declared0.25pt small-case horizontal criterion. XML preserves exact
source whitespace, but PDF non-whitespace measurement alone is not complete
whitespace/shaping/ink fidelity proof. All variants have one equal-sized page.
No clipping or full source-map acceptance is inferred from these measurements.

The original prediction15.02pt was adapter-local arithmetic, not a native Word
page coordinate. Do not compare it directly with91.70pt or treat the residual
as a universal20pt correction. The previous round's UI was stopped by physical
Escape after exports; this section reconciles its retained results without
claiming a completed UI cleanup or reopening UI control.

### Confirmed reference facts and limits

Implementation owner evidence:
`flowdoc-core/src/docx/source-layout-xml.ts:85-105`, especially96-102.
The serializer retains the parent paragraph properties, replaces its text with
owned VML shapes and assigns an exact outer frame. Each shape uses
`mso-position-vertical-relative:text`, `margin-top=-top-cellInsetPt`, zero textbox
insets and a top-anchored inner paragraph. Its inner frame and w:position are
computed together from padded font/ink geometry. The small reference has400twip
outer frames,463twip inner frames, margin-top=-1pt, position5, and no preceding
body paragraph; the body has two SDTs followed by sectPr. There is no XML proof
of an extra blank20pt body paragraph. The section margin top is1134twips and
compatibilityMode15. Section grid linePitch360 is present, but exact lineRule is
also present on both relevant frames.

Microsoft's [shape implementation notes](https://learn.microsoft.com/en-us/openspecs/office_standards/ms-oi29500/edfd844d-bf1a-4109-81cd-4caa788f1449)
define vertical `text` relative to the paragraph owning the anchor, whereas
`line` is relative to the anchor line; margin-top offsets that reference area.
Neither means that the origin is the glyph baseline or SourceGuide line top.
Its horizontal `char` basis is separately relative to the object anchor.
The [run position definition](https://learn.microsoft.com/en-us/dotnet/api/documentformat.openxml.wordprocessing.position?view=openxml-3.0.1)
raises positive values and lowers negative values relative to surrounding
non-positioned text in half-points. It does not define the initial baseline as
four-fifths of exact line height. The4/5 factor is the existing Core adapter's
model, not a guaranteed Word layout law.

The [grid line-pitch definition](https://learn.microsoft.com/en-us/dotnet/api/documentformat.openxml.wordprocessing.docgrid.linepitch?view=openxml-3.0.1)
allows exact paragraph line spacing to override grid pitch. Therefore missing
paragraph snapToGrid=false is a possible controlled diagnostic only, not proof
that grid caused this discrepancy. No docGrid removal or style normalization
is proposed as an automatic repair.

Confirmed defect is in the lab translation hypothesis: it treats old/new local
origins/default-baseline functions as interchangeable. The exact native cause
of the large residual and0.14pt pitch difference remains unverified. Parent
anchor layout, paragraph-mark metrics, inherited context and Word rounding are
candidate contributors, not confirmed product defects. Equal font bytes rule
out a changed embedded font stream in this comparison, but not every shaping
or layout effect. The old Word reference itself is not yet proved to match the
source/PDF design; preserving legacy geometry and matching SourceGuide intent
must remain separate acceptance questions.

### Proposed formula: compose coordinate systems before solving position

Use a page-downward point coordinate system. For line i define:

- A_old[i]: native Word page coordinate of the parent reference area used by
  the original shape, including flow/section/cell/paragraph context;
- m[i]: emitted shape margin-top; q[i]: textbox top inset, zero here;
- T_in(C_in,L_in,p_old): actual inner default-line layout plus run positioning,
  returning baseline relative to textbox content origin;
- A_new[i]: page coordinate of the new inline paragraph reference area;
- T_out(C_out,H,p_new): actual inline baseline relative to that area;
- C: font/style/paragraph-mark, inherited formatting, compatibility, grid and
  first-line/page/table context. Geometry-affecting context must be explicit.

The required equality is:

    Y_old[i] = A_old[i] + m[i] + q[i] + T_in(C_in,L_in,p_old)
    Y_new[i] = A_new[i] + T_out(C_out,H,p_new)
    Y_new[i] = Y_old[i]

Only if calibration proves a stable position response without changing line
flow may T(C,L,p) be represented as U(C,L)-p/2 plus bounded renderer rounding.
Then the conditional closed-form candidate is:

    p_new = round(p_old + 2*((A_new-A_old) + (U_out-U_in) - m - q))

This is a proposed equation, not a selected numeric correction. Round only the
final representable half-point value; retain source values and separate
quantization residual from Word/PDF measurement uncertainty. If the position
response or parent flow changes with p, solve the measured bounded response
instead of forcing this linear form. No U=0.8*lineHeight substitution is admitted
without evidence. No new numeric p or per-template lookup table is adopted.

Baseline equality is insufficient: require equality of Y[i+1]-Y[i] as well.
A first-line shift cannot remove the observed pitch drift. Keep every400twip
outer frame and total source row/section budget unchanged. If exact baseline,
pitch, ink and budget cannot coexist, refuse the representation and return to
design rather than introducing cumulative spacing or altering line choices.

### Approaches considered and recommended next proof

1. Add a constant20pt correction or select position from this output: rejected.
   Two lines already show different errors; it would fit observed data without
   explaining anchor layout or generalizing to page/table/font contexts.
2. Separate the native reference origins and position response: recommended.
   It preserves the inline target and existing caps while exposing the unknown
   terms. It requires a small Word calibration before there is a numeric formula.
3. Retain one positioned textbox per source line: fallback to assess only if the
   inline origin/pitch cannot be represented. It may retain the old anchor model,
   but shared-line text can change shaping and adds drawing/XML costs. Neither
   the49000-node target nor Word fidelity is proved; this is not an approved
   renderer or automatic fallback.

Proposed future copy-only stages, not executed by this review:

- **G0: recover observation reliability.** Reconcile original paragraphs,
  paragraph-mark properties, source owner tags, frame/section/style context and
  exact fonts. Use copies of the same small base and retain hashes. Repeat the
  unmodified reference and inline control once in the same Word build/export
  settings to quantify baseline and pitch repeatability before judging0.05pt.
  If exporter variation exceeds the criterion, stop and review measurement;
  never widen tolerance silently. Verify baseline extraction through both
  parsers and page context. Probe markers/outlines must not be assumed inert:
  compare probe and control layouts first and reject perturbing probes.
- **G1: isolate the anchor reference.** On separate diagnostic copies change
  only margin-top by a predeclared+1pt, and separately change `text` to `line`
  while retaining old inner geometry. Measure all lines, glyph baselines,
  any measurable shape/parent origins and next-paragraph positions. These are
  response experiments, not outputs claiming preserved geometry. If a shape
  outline is used to locate the box, establish that it leaves text/flow intact.
  Do not infer absolute A_old from a baseline residual alone.
- **G2: isolate baseline response and pitch.** With anchor context fixed,
  independently vary p=0,+2,-2 in inner and inline copies; keep font/mark,
  line frames and every other property unchanged. These test points are chosen
  by units/symmetry, not tuned to the desired result. Measure one-step response,
  first versus later lines and pitch. If paragraph-mark/default context must
  be changed, make it a separate one-factor probe; do not combine it with p.
  Do not extrapolate the400twip/12pt result to other frames or fonts.
- **G3: derive, freeze and validate.** Use G1/G2 calibration only to derive
  context-bound U/origin rules. Freeze the equation and expected errors before
  a held-out small document with at least three equal-frame lines and a changed
  preceding-context position. Check first and subsequent baselines, all glyph
  coordinates, pitch and unchanged total budget. Additional font/style/page or
  table contexts need their own bounded eligibility evidence. If the narrow
  case fails, stop; do not tune/retry full1800/UAT/SRS.

Keep the existing small-case criteria: exact source text/ranges/styles/font,
equal page count, baseline error<=0.25pt, pitch error<=0.05pt, horizontal
error<=0.25pt, no missing/changed/clipped glyph or ink and unchanged source frame
budget. These tolerances do not certify full-document fidelity. Small passes
must precede re-binding emitted source-line targets and full-package XML/rels,
drawing/byte-cap validation. Full fixtures and source-map admission remain held.

Future Oracle processing workers remain512MiB each, equal memory+swap (swap0),
the existing coordinator budget and unchanged default heap/runtime. Hard caps
remain50000 XML/rels nodes and32MiB, with49000-node target and old drawing/
shaping limits. Stop at the first V8/cgroup OOM. Native Word/export observation
is on the Windows host and is not represented as a512MiB worker proof.

### Disposition

Planning acceptance is complete: references, failed assumption, conditional
formula, alternatives, staged proof, stopping criteria and unknowns are explicit.
The numeric renderer formula, exact residual cause and general Word fidelity are
**not proven**. No new calibration, Core/Service edit, original-data/service
operation, remote inspection, merge, push, release or installation occurred.
Only this existing PC plan and one external measurement JSON are added to the
current scope. Existing producer/codecs/maps/artifacts remain unchanged. No
DOCUMENT_MAP or generated shared truth promotion. Verification for this prose
is evidence reconciliation, final diff review and git diff --check; no runtime
suite is applicable to a read-only design review.


## Owner-authorized XML budget override: original full DOCX server proof (2026-11-04)

Status: **PASS_SERVER_GENERATION_AND_SCOPED_PACKAGE_CHECKS_WORD_NOT_RUN**.
The owner explicitly requested removing the50000-node restriction for a server
retest. This supersedes the earlier keep-XML-cap constraint for these isolated
lab calls only. The R2 inline-reduction/baseline route is held; no new reducer
or numeric baseline correction is used. This is a fresh single-room bounded
lab experiment, not reactivation of a historical execution. IDs not applicable.
Core owns runtime behavior; PC owns shared status. Roles: external lab implementer,
Evidence Reviewer, PC Steward. Risk routine, bounded read-only product mounts.
Acceptance: original full fixtures complete under512MiB, artifact/receipt hashes
agree, XML/rels/relationships and source-guided content independently validate;
record failures, memory, time and remaining Word gaps. Document budget: this
existing section; evidence reused from frozen package and fixture manifests.

Evidence root:
`C:/Users/nekot/Documents/FlowDoc-recovery/docx-node-override-20261104/`.
Use `verification.json`, `verification-report.html`, per-stage immutable
packets/run scripts/receipts and actual output files. PC starting base3b94ddf;
Core582f141 and Service db15e9d remain clean and unchanged. The unrelated
October4 Editor snapshot grants no authority for this experiment.

### What changed for the test

The unchanged public API already supports `maxXmlNodes:300000`. Each DOCX call
uses that explicit option in place of its default50000; this is not unlimited
XML, a product patch, a new release, or a changed Service/default configuration.
The source-node cap50000, output cap32MiB, drawing/shaping caps, default heap,
512MiB worker memory with equal memory+swap (swap0),2CPU,128pids, network none,
read-only product mounts and existing128MiB coordinator budget remain unchanged.
The first V8/cgroup OOM would stop further work; none occurred.

Generation uses the original source-word renderer. No inspector/guide capture,
new XML reducer, forced GC or DOM verifier runs inside the generation worker.
Each format/fixture has a fresh worker. Output is written to lab files rather
than retained again in harness chunk arrays. UAT/SRS reuse the accepted full
legacy-to-model20 fixture conversion and original font/image adapters; expected
conversion digests match, and bounded/trimming mode is absent.

| Actual generation | Worker peak MiB | Elapsed seconds | Final XML/rels nodes | File bytes |
| --- | ---: | ---: | ---: | ---: |
|1800 DOCX |260.63 |5.80 |195111 |540129 |
|1800 PDF |108.52 |3.31 |not applicable |923287 |
|Full UAT DOCX |313.63 |6.29 |112084 |3019602 |
|Full SRS DOCX |421.25 |11.23 |182587 |875521 |

These are one-run observations, not capacity guarantees or benchmark
percentiles. Matched1800 PDF and DOCX use the same template/request, Core archive,
resources and worker limits; DOCX peak is152.11MiB higher, about2.40times PDF.
UAT/SRS timings include their fixture conversion/image/font setup and must not
be compared directly to1800 generation complexity. Native Word is not run here.

Existing writer compaction is conditional on xmlBudget
(`src/docx/writer.ts:152-170`). Therefore the higher override changes which
already-existing compaction branches run.195111 is the independently measured
final count for this delivered1800 file, not the earlier162741 default-rejection
count or a projection. This is still original product behavior under an option;
no experimental source-line or ordinary-paragraph representation is enabled.

### Independent checks, failures and practical boundary

Fresh separate512MiB workers validate all XML and rels parts with ElementTree,
ZIP CRC/unique entries, internal relationship targets/IDs and final node counts
against the Core receipt. File SHA256 and byte lengths match the generator.
The1800 check validates exact text and UTF16 member ranges for all1800 paragraphs
and10800 word boxes. UAT/SRS verify every retained source-guided line and member
against the closed producer's genuine facts, including owner tags/text digests
and UTF16 source slices. This is not a full native unguided-content or visual
comparison. Full native text, all-page layout/ink, edit/save behavior and native
Word opening remain unverified for these outputs.

Seven actual processing workers exit0 with no cgroup/V8 OOM. Independent verifier
peaks are133.95MiB for1800,88.11MiB for UAT and120.25MiB for SRS; these are
separate from generation peaks. Every receipt confirms unchanged original
container identities, source/package/input hashes and no owned running worker.
Only identity metadata is inspected for the original containers; no original
API, SQL, storage or service action occurs.

The first coordinator reused one harness folder for two groups and failed
before PDF launch on an existing node_modules symlink. Its DOCX worker had
already completed successfully. That failed driver receipt and unlaunched PDF
entry are preserved; the first stage is not reported as an overall driver PASS.
PDF then ran in a fresh stage; DOCX was not repeated. No OOM retry or candidate
repair occurred. The inherited terminal label PASS_B0_CAPTURE_STAGE is driver
prose only; new namespaces and generation/independent results govern this scope.

The former50000 XML limit was a confirmed blocker for these cases, while the
retained original renderer can complete all three under512MiB in this test.
This removes the current evidence-based need to continue the new baseline/XML
reduction route solely to satisfy50000. It does not establish unlimited growth,
production/concurrent capacity or a correct full Word visual result.

Next appropriate work is native Word review of these actual successful full
outputs, then choosing an explicit product XML policy and any Service HTTP
wiring based on measured workload/capacity. Do not silently remove all guards
or promote this override as the permanent default. No further stress/repeat/
concurrency experiment is required to close this bounded generation request.

Only the existing PC plan is changed in Git. Final coverage: reconciled actual
receipts/artifacts, independent package/source-map checks, unchanged Core/Service
heads and clean status, final prose diff review and git diff --check. No
DOCUMENT_MAP promotion, merge, push, release or installation.


## Matched full PDF companions for delivered DOCX (2026-11-04)

Status: **PASS_MATCHED_PDF_GENERATION_SELECTED_PREVIEWS_WORD_COMPARISON_OPEN**.
Owner asked to generate PDF companions to inspect alongside the successful
original-renderer DOCX. Single-room IDs not applicable; roles external lab
implementer/Evidence Reviewer/PC Steward. Core owns rendering; PC shared status.
Scope: two full PDF workers (UAT/SRS), reuse the already-passing matched1800 PDF,
inspect retained outputs, and deliver paired files. No product source repair,
DOCX regeneration, new Word control or permanent XML-policy change.

Evidence root extends the prior experiment:
`C:/Users/nekot/Documents/FlowDoc-recovery/docx-node-override-20261104/pdf-pairs/`.
Use `verification.json`, `verification-report.html`, `files/`, `previews/` and
`uat-pdf/`/`srs-pdf/` immutable harnesses/packets/Oracle receipts. Prior DOCX and
1800 PDF artifacts remain unchanged; user-facing copies are SHA256 verified.

| Full fixture | PDF pages | PDF worker peak MiB | PDF seconds | Paired prior DOCX peak MiB |
| --- | ---: | ---: | ---: | ---: |
|1800 |50 |108.52 |3.31 |260.63 |
|UAT |70 |217.35 |5.62 |313.63 |
|SRS |98 |204.09 |5.90 |421.25 |

The two new workers use unchanged512MiB memory/equal memory+swap (swap0), default
heap/runtime,2CPU,128pids, network none, read-only product mounts and existing
coordinator budget. Both exit0 without V8/cgroup OOM; original container identities,
product/package/input bytes remain unchanged; no owned worker remains running.
PDF creation changes only the chosen engine/generate call and output extension.
Static identity checks confirm identical fixture inputs/fonts/assets/conversion
helpers and frozen Core archive versus each DOCX run; the fixture setup differs
only at createPdfEngine versus createDocxEngine. One run per format, not a load
or repeatability guarantee. UAT/SRS elapsed time includes fixture preparation.

Local independent pypdf checks match generator byte/hash/page-count receipts;
all50/70/98 pages contain extractable text. All1800 row identifiers occur once
in order in the existing PDF. All three document pairs are delivered together;
the DOCX XML override remains300000 in the prior lab calls only and does not
apply to PDF. No claim that PDF was converted from DOCX through Word.

Poppler renders page1,2,middle,last of each PDF for inspection (1800:1/2/25/50,
UAT:1/2/35/70, SRS:1/2/49/98). These selected views were inspected, with no obvious
rendering break at contact-sheet scale. This is not all-page clipping, full
semantic fidelity, source-layout or Word/DOCX parity acceptance. Local parser/
preview work runs outside the Oracle generation workers and is not represented
as capped512MiB generator memory. Native Word opening/visual comparison remains
open; no further stress test is necessary for this PDF delivery request.

Only this existing PC plan changes in Git; external report/files/previews carry
bounded evidence. Verification: matched input/package identity, runtime receipts,
artifact hashes and independent page counts, selected rendered views, final diff
review and git diff --check. No Core/Service edit, original data/API/SQL/storage/
service change, DOCUMENT_MAP promotion, merge, push, release or installation.

Automatic report opening in the in-app browser was blocked by its file-protocol
policy. The report was not opened; direct PDF/DOCX artifact links are delivered
to the user instead. No alternate-browser/server workaround was attempted.


## Fresh Core PDFs overlaid with owner-converted Word PDFs (2026-11-04)

Status: **COMPARISON_COMPLETE_OUTPUT_DIFFERENCES_CONFIRMED_CAUSES_OPEN**.
The owner explained that the currently named UAT-full.pdf/SRS-full.pdf had been
replaced by their Word conversions and requested fresh Core PDFs plus overlays.
Roles: external lab implementer/Evidence Reviewer/PC Steward; single-room IDs
not applicable. Owner Core for future renderer changes; PC shared comparison.
This is bounded discovery, not a product repair or fidelity acceptance.

Evidence root:
`C:/Users/nekot/Documents/FlowDoc-recovery/docx-node-override-20261104/pdf-pairs/word-overlay-20261104/`.
Use `reference-manifest.json`, `docx-source-identity.json`, `verification.json`,
`verification-report.html`, `compare.py`, `overlay.py`, text-anchor JSONs,
page alignment/text JSONs, `overlays/`, `files/` and the new generation receipts.
The HTML offers original PDF pairs, selected raw-origin cyan/magenta overlays,
and an opacity slider. Direct links are the delivery route; no attempt to bypass
the known browser file-protocol restriction is made.

### Provenance and fresh generation

Both user-named PDFs have Microsoft Word365 creator/producer metadata and
hashes different from the prior Core files. They were snapshotted before any
new generation; their originals remain byte-identical after comparison. The
current paired DOCX hashes still equal the prior delivered originals. The user
identifies these as Word conversions; metadata and hashes do not constitute a
cryptographic proof of the source DOCX/export options. No new Word UI is used.

Fresh Core PDF output matches the prior Core PDF byte-for-byte for each full
fixture, including matching expected model20 conversion digest and unchanged
Core package/assets/fonts. Each fresh worker retains512MiB, swap0, default heap,
network none and read-only product mounts. Coordinator budget remains128MiB.
No OOM, original-container identity change, source/package/input mutation or
owned running worker is observed. No database is involved.

| Fixture | Fresh Core PDF | Owner Word-converted PDF | Fresh Core peak MiB | Seconds |
| --- | ---: | ---: | ---: | ---: |
|UAT |70pages |73pages |208.65 |5.68 |
|SRS |98pages |101pages |198.20 |5.79 |

UAT's generation/artifact receipt is PASS, but its host sampler encountered
errno19 (cgroup disappeared after worker exit), before recording the final
Docker state. The failed driver receipt is preserved. A separate read-only
Docker inspect confirms exit0, non-OOM, stopped state and512MiB/equal memory-swap;
worker memory files show zero OOM. UAT is not rerun. SRS uses a fresh2 namespace
with only errno19-at-sampling handling added; final exit/OOM/identity checks stay
unchanged. Its driver and worker pass. The original unlaunched SRS packet is
retained. Neither condition is a product failure or an OOM retry.

### Confirmed output differences

1. **Pagination:** Word has3 additional pages for each fixture. This is directly
   counted, not inferred from footer text or same-index page matching.
2. **Nonuniform vertical displacement:** matched initial-glyph PDF text matrices
   show Word lower than Core on UAT p1 by5.925pt at User Acceptance Record,
   16.472pt at Version,16.992pt at Author and17.567pt at Updated Date. SRS p10
   differs by11.351pt at Non-Functional,37.521pt at Minutes of Meeting and
   39.551pt at Agreement. These are measured glyph-origin differences in the
   delivered PDFs, not proof of a particular source-layout formula or cause.
   A single constant page translation does not explain them.
3. **Table flow/wrapping:** UAT Core p5 content spans Word p5/p6; visible line
   wraps/row heights differ. SRS Core p49 and Word p50 share REQ0030 onward,
   but Word p50 starts at REQ0029 and reaches about REQ0037, while Core p49
   reaches REQ0039. This is different page/row placement, not proof of omission.
4. **TOC presentation/page references:** Word has dot leaders where Core does
   not, and references follow their differing pagination; for example UAT
   Basic Feature points to6 in Core versus7 in Word. SRS TOC pages4-9 also
   differ. Renderer/field-refresh behavior remains a possible explanation;
   this observation alone is not classified as a data defect.

### Method, coverage and limits

All pages are read for candidate content alignment using Unicode NFKC,
whitespace-free character4gram TF-IDF cosine and monotone1:1/1:2/2:1/gap grouping.
Page counters and generated dot leaders/trailing TOC page numbers are ignored
only for alignment, not hidden from original text/images or the findings.
The first mapping was dominated by Word dot leaders and yielded near-zero TOC
similarities; it is retained under alignment-v1-retained. The corrected mapping
is an inspection aid, not full semantic equality or a missing-page verdict.

Seventeen selected image pairs are rendered at the same120dpi and page origin,
with white padding only; no translation, rotation or resizing to force agreement.
All paired raster dimensions agree. Cyan is Core-only darkness, magenta is
Word-only darkness, black is shared darkness. Pixel difference fractions measure
raster disagreement, not percentages of lost content. Key cover/TOC/table/flow
comparisons were inspected; complete page-by-page visual fidelity remains open.
Local parsing/raster/overlay work is outside the measured Oracle generation
workers and is not claimed as a512MiB generator test.

Extraction differences alone are not findings of missing content: e.g. UAT
Module Scope is visible in the Word-rendered image despite not appearing in its
first-page text extraction. No complete text-loss conclusion is made. Exact
root causes in font metrics, paragraph/row spacing, fields or Word export
settings remain unverified; this round does not edit any renderer or choose a
baseline correction. The obsolete50000 XML gate is not a cause of these
successful-file layout differences.

Only the existing PC plan changes in Git; the original user PDFs/DOCX and prior
proof artifacts are preserved. Report links/images and JS syntax validate;
final evidence/prose diff review plus git diff --check close this comparison.
No Core/Service edit, original data/API/SQL/storage/service change, map promotion,
merge, push, release, installation or new native Word control occurs.


### Inline correction: report images require no script (2026-11-04)

Owner reported images not displaying. The original HTML's five img elements
had no src and depended entirely on JavaScript initialization; actual PNG files
exist. Script suppression in the host viewer is plausible, not directly proved.
The external report now embeds17 static comparison JPEGs as data URIs with no
script/external image requests. The interactive original is preserved separately,
and original PDF/full-resolution overlays are unchanged. `image-display-fix.json`
records hashes and scope. Validation decodes/verifies all17 embedded images and
confirms zero script tags. Browser display itself is not claimed verified because
the known local-file browser restriction remains; a direct local image is also
delivered in chat. No runtime re-test or Core/Service/data change is involved.


## UAT cell-ending paragraph copy probe; owner Word export pending (2026-11-04)

Owner authorized trying DOCX adjustments from the visible UAT table difference,
then steered delivery to supplying the DOCX files for their own conversion.
Status: **STRUCTURAL_COPY_CHECKS_PASS_NATIVE_WORD_EXPORT_PENDING_OWNER**.
Roles external lab implementer/Evidence Reviewer/PC Steward; IDs not applicable.
No Core/Service implementation. Evidence root:
`C:/Users/nekot/Documents/FlowDoc-recovery/docx-cell-terminator-20261104/`.

The selected UAT tables8-11 have source-guided SDT-ending cells. A hypothesis
is that Word supplies additional paragraph/line space at that boundary; this
is not yet a confirmed cause. The copy-only probe adds an explicit empty1twip
paragraph with controlled tiny paragraph-mark formatting at9 such cells, leaving
all existing widths, margins, text, styles, VML shapes/maps and other ZIP parts
unchanged. Removing those9 additions restores the original semantic XML tree.
ZIP CRC/text/other-part byte identity checks pass; actual XML/rels total112174.
The512MiB/swap0 Oracle worker peaks232.85MiB, exits0 with no OOM; original
container identities and product/package/input hashes stay stable.

`files/UAT-control.docx` is byte-identical to the original delivered full UAT.
`files/UAT-explicit-cell-end.docx` is the probe; `delivery.json` and the Oracle
probe/receipt records retain hashes and scope. Owner will convert both using
the same Word settings and separate PDF names before geometry/flow acceptance.
Native Word rendering is not verified. GUI preparation did not reach a verified
conversion; no text was typed and no document save/export occurred before the
owner redirected to file delivery. No more UI action is taken. No original
PDF/DOCX overwrite, product change, merge/push/release/install or map promotion.


## Owner-exported UAT control/probe comparison: no useful improvement (2026-11-04)

Status: **COMPARISON_PASS_PROBE_DOES_NOT_IMPROVE_ROW_HEIGHT_OR_PAGINATION**.
Owner supplied both Word-converted PDFs and requested comparison only, with no
Core/Service changes or integration. Roles Evidence Reviewer/PC Steward; IDs
not applicable. Evidence extends `docx-cell-terminator-20261104/` under
`owner-pdf-comparison/`: reference manifest/snapshots, verification.json/report,
measure.py, raster-compare.py, all-page character/raster JSONs, border measurement
JSON and visuals. Owner source PDFs remain unchanged after the comparison;
DOCX hashes still match the delivered control/probe. Both PDFs identify Word365.
Export options/source binding are owner-provided context, not cryptographically
attested. No new Word UI or Oracle runtime is used in this verification.

Both exports have73pages; the original matched Core PDF has70. Non-whitespace
text/order, page dimensions and font names ignoring subset prefixes agree for
all73 pages. Character-box differences occur only on p5, maximum0.36pt;
272p5 non-whitespace character boxes move by more than0.01pt. Font sizes agree
within floating-point precision. This compares the two supplied Word outputs,
not complete semantic correctness against all source content.

Independent border geometry on p5 reads the first six black horizontal border
centers crossing x=400pt: stroked lines in Core, thin filled black rectangles
in Word; nonpainted clipping rectangles are excluded. First target table:

| Variant | Table height pt | Row heights pt, header through total |
| --- | ---: | --- |
|Core PDF |195.80 |28.00 /33.30 /50.60 /50.60 /33.30 |
|Word control |245.43 |28.56 /49.80 /66.60 /66.63 /33.84 |
|Word probe |245.55 |28.56 /49.80 /66.72 /66.63 /33.84 |

The probe table is0.12pt taller, and remains49.75pt taller than Core. There is
no improved pagination or removal of the roughly16pt excess in the body rows.
All73 pages were independently rendered with Poppler at96dpi without alignment:
72pages are pixel-identical; only p5 changes (9094RGB pixels, difference bbox
48,423–746,950). Finite raster resolution is not unlimited-precision equality;
unchanged pages also do not certify the already-different baseline layout.
A144dpi p5 overlay and same-coordinate first-table comparison were inspected.

Decision: do not implement/adopt this explicit-empty-paragraph addition as the
fix on this evidence. The proposed useful repair is unsupported; this does not
prove all implicit-paragraph or VML layout hypotheses false. The main height
cause remains open. Any next experiment should first isolate actual source-guided
textbox/paragraph/cell row-height ownership rather than tune unrelated spacing.
No further adjustment is made in this comparison request.

The static report embeds its images (no JavaScript dependency); image decoding
and evidence links validate. Only this existing PC plan changes in Git. Review
coverage/results and final diff plus git diff --check close the request. No
Core/Service edit, original data/service action, merge/push/release/install or
map promotion. The prior512MiB copy-building proof remains scoped to that prior
worker; local PDF analysis is not represented as a new512MiB runtime proof.


## Separate UAT cell-padding and textbox-height copies for owner export (2026-11-04)

Status: **STRUCTURAL_FACTOR_COPIES_PASS_OWNER_WORD_EXPORT_PENDING**.
Owner authorized separate-factor copies and requested DOCX delivery for their
own PDF conversion, explicitly no Core/Service change or integration. Roles
external lab implementer/Evidence Reviewer/PC Steward; IDs not applicable.
Evidence root: `C:/Users/nekot/Documents/FlowDoc-recovery/docx-cell-padding-box-20261104/`;
use delivery.json, files/, build2 immutable harness/packet/Oracle receipt and
variants.json. Original control SHA256 remains09c7d8a3fa8899eeb6e423c3d9f31581304d2b47aa097de2a8fc33e9cfbe8ed4.

Each variant independently starts from that full original UAT, without the
previous unsuccessful tiny cell-ending paragraphs. Target cohort is8 content/
menu cells (column1) in tables8-11 with explicit8pt top/bottom padding. The
special group-label cell at table9,row1,column0 has24/4pt padding and is retained
unchanged. Outputs:

- P0 control: byte-identical original.
- P1 padding-top-0: only top160→0twips on8 selected cells; bottom unchanged.
- P2 padding-bottom-0: only bottom160→0twips on8 cells; top unchanged.
- P3 box-height-17p3: only VML height18.3→17.3pt on36 shapes in those8 cells,
  matching existing346twip outer frames; all padding, positions, font/runs and
  inner paragraph geometry unchanged.

The first build's precondition rejects the broad9-cell SDT-ending cohort on
special group-label padding; it exits1 at84.62MiB without OOM before outputs.
That failure is retained. Corrected build2 narrows to the8 matching content
cells and exits0 with294.98MiB peak under512MiB/equal memory-swap (swap0),
default heap/network none and the existing coordinator budget. Final exit/OOM/
identity checks pass; original containers/product/package/input bytes unchanged,
no owned processing worker remains. This is copy-building memory, not renderer
or native Word performance.

Validation: source hash, exact target preconditions, independent variants;
reverting only each named factor restores the entire original semantic XML
tree; existing visible text and all other ZIP parts (styles/fonts/media/maps)
are byte-identical. ZIP CRC and every XML/rels part parse; actual nodes112084
for each modified copy, unchanged from source and below the authorized300000
lab budget. Files delivered with checked hashes and distinct P0/P1/P2/P3 names.

These are diagnostic response probes, not accepted fixes. Zero padding or a
smaller textbox can affect glyph position/ink clipping; Word PDF review must
check text/ink and row/page geometry, not height alone. Owner should export all
four with the same settings and retain their distinct PDF names. No Word
rendering, improved row height or root cause is claimed before those exports.

Only this existing PC plan changes in Git. External proof/delivery manifests
record scope; final evidence/diff review and git diff --check close file delivery.
No Core/Service edit, original data/service action, new Word control,
merge/push/release/install or map promotion. Stop pending owner PDFs rather
than inventing an outcome or making a further adjustment.

## Owner Word P0-P3 comparison (2026-11-04)

Status: **COMPARISON_COMPLETE_NO_HEIGHT_IMPROVEMENT_CAUSE_OPEN**.
Owner supplied all four Word PDF exports and requested row-height, text-position
and clipping comparison only; no Core/Service edits or integration. Roles
Evidence Reviewer/PC Steward, inline execution IDs not applicable. Existing
plan remains the canonical bounded result; no map or readiness promotion.
Evidence: `C:/Users/nekot/Documents/FlowDoc-recovery/docx-cell-padding-box-20261104/owner-pdf-comparison/`;
verification.json, reference-manifest.json, row-borders.json,
row-padding-inventory.json, all-page-characters.json,
all-page-raster-comparison.json, detail-raster-comparison.json,
p3-changed-characters-page5.json and static verification-report.html.

Confirmed results:

- Owner exports identify Microsoft Word365 and each has73pages. Current DOCX
  hashes match delivery; original and snapshot PDF hashes recheck unchanged.
- First table page5: all four have border centers106.22,134.78,184.58,251.18,
  317.81,351.65pt and height245.43pt. Core reference table is195.80pt, so all
  retain49.63pt excess. Corresponding row heights are28.56/49.80/66.60/66.63/
  33.84pt versus Core28.00/33.30/50.60/50.60/33.30pt.
- Every page's extracted non-whitespace character sequence agrees with P0 for
  P1/P2/P3, with unchanged font sizes. P1/P2 character boxes agree exactly.
  P3 extraction boxes differ on40characters only on page5 (top/bottom-.12pt),
  but this is not evidence of a visible glyph displacement: raster ink agrees.
- Poppler96dpi, whole-page origins/dimensions unchanged and exact RGB comparison:
  P1/P2/P3 each have73/73 pixel-identical pages versus P0. Additional240dpi
  checks of pages5-6 are pixel-identical for each variant (6 comparisons).
  Visual inspection of page5 and text-detail crops finds no incremental ink
  clipping; equality at tested resolutions supports no new visible clipping
  versus P0. This does not certify absence of pre-existing clipping everywhere,
  equality with Core throughout, or native Word performance under512MiB.

Interpretation: changing only the selected Menu top/bottom padding or the1pt
textbox excess did not reduce row heights/page count in these exports. Do not
adopt these changes as a fix, and do not infer that all cell padding is harmless.

**Probable Risk, not confirmed cause:** table8 body-row group-label cells,
including vertical-merge continuations, retain24pt top/4pt bottom padding;
other content cells retain8pt top/bottom. P1/P2 modified only Menu cells, leaving
these and other row cells unchanged. Row-level margin interaction may therefore
mask the Menu probe. The24-8=16pt difference closely matches the approximately
16pt extra body-row height but correlation is not causal proof. Existing
merged-cell/paragraph ownership remains an alternative needing isolation.

Next recommended work is a separately authorized one-factor copy probe of the
group-label top margin and merged continuation margins, retaining all other
geometry/text and repeating native Word text/ink/row checks. No additional probe
is built in this verification-only turn. No new Oracle worker execution; prior
512MiB copy-building receipt is reused only for its original scope. Source
PDFs/DOCX and Core/Service candidates unchanged; no original data/service action,
merge/push/release/install. Static report embeds both images without JavaScript;
image/link validation, result coverage review and final diff/check close this
bounded comparison. Only this existing Project Control prose changes in Git.

## Menu versus Req field and DOCX representation inspection (2026-11-04)

Status: **REPRESENTATION_DIFFERENCE_CONFIRMED_HEIGHT_CAUSALITY_OPEN**.
Owner requested read-only inspection of Menu/Req variables after P0-P3 comparison.
Roles Evidence Reviewer/PC Steward; inline IDs not applicable. This existing plan
owns the bounded result. No Core/Service change or integration is authorized.
Evidence: owner-pdf-comparison/menu-req-representation.json and inspect-menu-req.py
under the same docx-cell-padding-box-20261104 evidence root. Retained UAT full
fixture template/payload and generation.json are the inputs; generation output
SHA256 matches P0 control, so these are matched generation records, not an
unrelated current fixture or a fresh render claim.

Confirmed: Menu binds item.menu (summary-dynamic/v15); Req no. binds item.id
and Features List binds item.description (requirements variants). All are plain
string fields, not HTML/rich-text data. Menu and Req description/id reference
textStyleId8e34188f-52fe-4299-b167-4aa523dc0ead: same library font release, normal,
weight300, authored8.4pt and lineHeight17.3pt. Req ID is center-aligned, Menu left,
Req description default-left. Thus a different authored base font/line-height
is not supported by this fixture.

The resulting Word representation does differ. All8Menu body cells contain
36generated VML word boxes in total, exact346twip outer line frames, and8/8pt
vertical cell padding. All60Req ID and60Req description cells contain0VML
shapes; sampled native body paragraphs use346twip atLeast line spacing and
5/5pt cell padding. Native paragraphs and source-guided exact-line word boxes
have different text-position/row-height ownership; equal authored style alone
does not imply equal Word layout behavior.

Matched input/receipt evidence explains routing: all8Menu strings lack authored
newlines. Of60Req descriptions,43contain newlines. bindInlines.ts:21-25 expands
string newlines into line-break inlines; source-layout.ts:62 excludes non-text
spans from generated word-box guides. The receipt records43Req descriptions as
protected-or-nonplain-native-content, with the remaining17 protected by the
reading plan. sourceParagraph/source-layout-xml.ts:20-22 retains native Word
paragraphs when no eligible guide exists. This is intentional guarded routing,
not proof of incorrect binding or a reason to remove the guards.

The representation difference is confirmed; its contribution to the excess
Menu row height is not isolated from24pt group-label padding and merged-cell
geometry. Next comparison should explicitly distinguish native paragraph versus
word-box behavior while preserving content/line breaks/reading-plan protections,
and isolate group-label margins. No new probe, renderer run or product repair
in this inspection. Read-only JSON/XML/receipt checks and final diff/check are
sufficient for this bounded result; no512MiB runtime or native Word acceptance
is claimed. Product repositories remain unchanged; no data/service action,
merge/push/release/install or map promotion.

## Module-only top-margin copy for owner Word export (2026-11-04)

Status: **COPY_DELIVERY_PASS_OWNER_WORD_EXPORT_PENDING**. Owner explicitly
requested a copy changing only Module top margin while retaining Menu textboxes,
then DOCX handoff for owner PDF export. Scope: first summary table8, merged
Module group Cut Length/Cut Beam System, rows1-3 column0 (zero-based). Use8pt
rather than24pt to match Menu top margin. All other Module groups and properties
remain unchanged. Roles external lab implementer/Evidence Reviewer/PC Steward;
inline IDs not applicable. Existing PC plan remains the bounded authority.

Evidence root: `C:/Users/nekot/Documents/FlowDoc-recovery/docx-module-margin-20261104/`.
Use delivery.json, build2/packet.json, immutable build.py/remote.py,
build2/oracle/receipt.json, outputs/verification.json and files/. Retain the
first failed run: its precondition found both border and margin top tags and
exited before output, without OOM. Corrected build2 selects tcMar/top only.
No failed output is delivered or represented as passing.

The fresh Oracle-host worker exits0, OOMKilled=false, peak154.074MiB under
512MiB memory/equal memory-swap (swap0), network none/read-only mounts; host
Python coordinator address-space bound128MiB. Original container identities,
start times/restart counts and proof inputs remain unchanged; no owned worker
running. This is copy-building proof only, not Core rendering performance.

P0 control remains09c7d8a3fa8899eeb6e423c3d9f31581304d2b47aa097de2a8fc33e9cfbe8ed4.
P4 UAT-P4-module-top-8pt.docx SHA256 is
d169bb3391e1a82ae8abbb3f33e9e063ebaa696eaea85c2c87bba0bf47f82e38.
Exactly three w:tcMar/w:top/@w:w values change480→160twips: restart plus two
vertical-merge continuation cells. Surgical byte replacement preserves all
other document.xml bytes; restoring the values recovers the original XML bytes.
All other ZIP parts are byte-identical; ZIP CRC and every XML/rels parse pass;
actual XML/rels nodes remain112084. Independent local received-file verification
checks the three-cell-only semantic diff, all VML shape XML, ordered text and
output/source hashes. Menu textbox positions/sizes/styles and paragraph frames,
cell bottom/side margins, merges, fonts, media and source maps are unchanged.

Deliver both P0 and P4 under files/ with distinct names for owner export using
the same Word settings; existing P0 PDF may be reused if settings unchanged.
Native Word rendering intentionally remains pending the owner's conversion;
no height improvement, clipping safety or root cause is claimed yet. Compare
the first table (P0 page5), Module text top, Menu text positions and row borders,
then pagination/ink/text integrity. Stop at delivery. No Core/Service edits,
original data/service action, merge/push/release/install or map promotion.
Only this existing PC prose changes in Git; evidence coverage/final diff and
git diff --check close the file-preparation scope.

## Owner Word P4 versus P0 Module-margin comparison (2026-11-04)

Status: **TARGET_MARGIN_EFFECT_CONFIRMED_TEXT_INTACT_COVER_DIFFERENCE_OPEN**.
Owner supplied new P0/P4 PDFs and requested comparison only. Roles Evidence
Reviewer/PC Steward; inline IDs not applicable. Evidence root:
`C:/Users/nekot/Documents/FlowDoc-recovery/docx-module-margin-20261104/owner-pdf-comparison/`.
Use verification.json, verification-report.html,
reference-manifest.json, row-borders.json, target-text-positions.json,
global-character-inventory.json, changed-text-extraction.json,
all-page-characters.json, all-page-raster-comparison.json and detail/240dpi crops.

Both owner exports identify Word365 and retain73pages. P0 was re-exported11:21:30,
P4 at11:21:04; new P0 matches previous P0 non-whitespace text/character boxes
and all73page rasters96dpi. All current original/snapshot PDF hashes and both
DOCX delivery hashes recheck unchanged. No further DOCX edits in this turn.

Confirmed controlled-copy effect: only Module group top margins24→8pt change,
while Menu VML remains unchanged, and table8 page5 height drops245.43→198.39pt
(47.04pt reduction). Core reference195.80pt: excess falls49.63→2.59pt.
P0 row heights28.56/49.80/66.60/66.63/33.84pt become
28.56/33.84/51.00/51.15/33.84pt in P4. This proves a material causal contribution
of the merged Module margins in this cohort; the earlier implication that Menu
textboxes were the main established cause was too strong. It does not prove
all remaining geometry matches Core or every document shares this cause.

Module text top moves167.83664→151.87664pt (up15.96pt). Menu rows1/2/3 move
up16.08/31.56/47.07pt. Independently matched target strings have identical
horizontal coordinates, font sizes and text/line content.240dpi visual review
of target text and pages5-6 finds no newly clipped target text. The25/25/0 row
with Scan Change Grade text moves intact from page6 to5; total72/72/0 stays
page6. Page count therefore stays73; no full-document pagination fix is claimed.

Whole-file96dpi comparison:70pages pixel-identical; changed pages1,5,6.
Per-page extraction is intentionally not called all-text-equal: page5/6 content
moves. Global character inventory shows no removed character occurrences and
one additional asterisk on P4 page1: Times New Roman0.96pt atx36/top106.06736pt,
one weak changed pixel96dpi. Cause of this cover export difference remains
unverified despite unchanged DOCX delivery hashes and three-attribute-only
source diff. Preserve it as an open difference, not a clean whole-file fidelity
PASS. Global character counts alone do not prove ordering or absence of clipping;
target cell matches, extraction differences and visual review supply the scoped
proof. No universal absence of pre-existing clipping is claimed.

Static report embeds images (side-by-side, same-origin red/blue overlay, target
text detail); embedded image decoding/evidence link checks pass. Existing plan
only changes in Git; final diff/check and coverage review close this comparison.
No new Oracle worker or512MiB runtime claim, further probe, Core/Service edit,
original data/service action, merge/push/release/install or map promotion.
Remaining scoped gaps: residual2.59pt versus Core and tiny cover export mark.
Stop at reporting; no fix adopted.

## Merged Module top-margin investigation and proposed Core plan (2026-11-04)

Status: **DISCOVERY_COMPLETE_PLAN_PROPOSED_NO_IMPLEMENTATION**.
Authority: owner's request to trace Core's merged-cell margin construction and
plan from P4, retaining Menu textboxes; explicitly no Core/Service edits or
integration. Roles Planning Partner/Evidence Reviewer/PC Steward. Owner of a
future runtime change is Core, not Service; this existing PC document owns the
shared plan. Inline IDs not applicable; Work Size bounded, Risk Tier routine
for this read-only planning scope. Future geometry implementation requires a
fresh scope/base check and its own implementation authorization. No separate
room/agent/dispatch or synthetic records. Planning/proof budget: targeted code,
matched retained inputs and P0/P4/Core PDF evidence only, no new runtime trial.
Document budget: this section only. Active host model used for inline discovery;
future execution must resolve its own model decision through current policy.

### Actual construction path, pinned to Core582f141

1. Retained model19 UAT template already declares summary-dynamic/v14 padding
   top24pt, bottom4pt, sides5pt; Menu/v16 has its own8pt top/bottom. The exact
   template is under docx-node-override-20261104/uat-full/harness/capture/
   uat-full.template.json, v14 around3848 and Menu text v15 around3922.
   This is an authored fixture value, not a24pt constant introduced by DOCX.
   convert-legacy.mjs:52 clones the template; version/identity conversion does
   not rewrite cell padding. P4 was a diagnostic override, not source semantics.
2. src/binding/expansionSteps.ts:38-42 clones the declared group-label cell into
   the first member and sets rowSpan=memberCount; the generic clone at52-59
   preserves its props. One logical cell represents the three-row label.
3. src/docx/profile.ts:267-270 validates the grid and converts padding with
   toTwips:24pt becomes480twips. The mapped cell retains source geometry.
4. src/docx/geometry-policy.ts:21-24 adjusts only its proven4/4pt case.24/4pt
   retains native values; tables.ts:74-77 and108 store480 as nativeTopTwips.
5. tables.ts:112-119 excludes every vertically merged table from the existing
   row-minimum-margin/paragraph-offset mapper; source-guided Menu paragraphs
   also fail that ordinary-cell eligibility. Do not remove these guards blindly.
6. tables.ts:130-139 builds occupancy entries carrying the SAME logical cell ID
   into all physical rows. Continuations get an empty structural paragraph at
   149-154, but margins at163 always read that logical cell's nativeTopTwips.
   Thus RESTART and both CONTINUE cells all receive top480twips. This exactly
   matches retained XML and the3attribute-only P4 patch.
7. PDF is different: src/layout/cellTableFlow.ts:27 and45-61 account for padding
   in a logical merged label's total extent, then76 emits its text at top plus
   padding once. It does not instantiate a24pt margin on each physical row.

Confirmed defect scope: native DOCX representation of this merged-label inset
produces materially different row geometry than Core's logical layout. P4 proves
that lowering the three physical top margins removes47.04pt of excess while
Menu boxes remain byte-identical. Authored24pt itself is NOT proven erroneous.
No blanket conclusion about all merged cells or arbitrary Word margin behavior.

### Important acceptance distinction

P4 table height198.39pt is close to Core195.80pt, but P4 is not a complete visual
golden. Absolute Module text top: Core161.71, P0167.83664, P4151.87664pt.
Relative to each first-table top: Core57.71, P061.61664, P445.65664pt. P4 therefore
puts Module12.05336pt higher than Core after table-origin alignment; P0 was
3.90664pt lower. A global clamp24→8 would improve rows but discard authored
inset and worsen label placement. Prior claims of height improvement remain
valid; do not promote P4 to full text-position parity.

### Approaches and recommendation for review

- Template-only24→8: valid only if owner explicitly wants a new authored inset;
  changes PDF/source layout too and does not repair generic DOCX mapping. Not
  the recommended Core fix and not implicitly authorized by this request.
- Recommended: retain logical source24pt, use a proven peer-row physical top
  margin for the merged native cell, and move the remaining logical offset
  into the FIRST label paragraph exactly once. For this fixture the hypothesis
  is physical8pt plus label-before16pt, with no offset on CONTINUE paragraphs.
  Preserve bottom/side margins, merge/border/keep policies and all Menu XML.
  This is a proposed representation rule, NOT a proved Word result.
- Converting/removing Menu textboxes is outside this plan; P4 already demonstrates
  a height improvement without doing so.

### M0: mandatory copy proof before Core implementation

- [ ] On a fresh copy of matched P0, apply only the proven three Module margin
  changes plus a16pt before-offset on its existing first label paragraph.
  No text/runs/line height/font baseline/Menu/other ZIP part changes. Emit a
  reversible edit manifest. Validate the24=8+16 inset accounting, source hash,
  every XML/rels/CRC and byte-identical Menu boxes/paragraphs/media/maps.
- [ ] Build/check under the same Oracle-host512MiB worker, swap0 and previous
  coordinator budget; network none, immutable inputs, no service/data access.
  Keep the retained fixture's existing XML-budget option unchanged; no new cap
  increase or global default change. Stop on OOM, retain failure, do not rerun
  unchanged. Owner exports using the same Word settings as P0/P4.
- [ ] Compare first-table borders, label position relative to table/cell origins,
  every Menu line, relocated rows/pages and actual glyph clipping at240dpi.
  Proposed gates: table height within1pt of P4 (no recurrent~16pt row excess),
  Module table-relative position no worse than P0's3.90664pt Core error, same
  target text/line breaks/x/font sizes, no new clipped/duplicated/missing text.
  This explicitly permits the existing residual baseline/height gap; it is NOT
  pixel parity. Record exact residuals. Isolate the tiny P4 cover asterisk as an
  unresolved export difference; never report all-file exact-text equality PASS.
- [ ] If the paragraph offset itself inflates rows, collapses or repeats at page
  breaks, or label alignment requires new baseline behavior, return to design.
  Do not touch Core to force the proposed representation through this gate.

### M1: future bounded Core candidate, only after M0 and authorization

Proposed files: new src/docx/merged-cell-top-insets.ts (pure guarded decision
helper), src/docx/tables.ts (adapter/receipt wiring), new
 tests/docx/mergedCellTopInsets.test.ts plus focused existing regression tests.
No source-layout.ts/source-layout-xml.ts/Service/template/layout/PDF changes.

- [ ] Pure decision input: validated group-label identity/row span, logical inset,
  peer physical row tops and label paragraph capability. Output sourceTopTwips,
  physicalTopTwips, firstLabelBeforeTwips, covered row IDs and eligible/fallback
  reason. Enforce sourceTop=physicalTop+offset, nonnegative finite integer twips.
- [ ] Initial eligibility is deliberately narrow: genuine validated groupLabel,
  span>1, one plain native auto-height label paragraph, columnSpan1, body rows,
  established legacy borders; all non-label peer tops across the covered rows
  must be present and equal. Derive the shared value from those peers, never
  from UAT names or a hard-coded8pt. Require source top>=peer top. Preserve all
  peer cell/Menu padding and guides. Complex/nested/image/fixed label content,
  headers/ending areas, crossing merges, mixed peer tops or unsuitable paragraph
  keep/fragment conditions retain the previous path with an explicit reason.
- [ ] Add the accepted decision only to this logical label's LOCAL spacePolicy:
  physical margin then naturally applies to restart/continues; paragraph-before
  offset adds to the first actual label fragment only. Never put it on empty
  continuation paragraphs, never mutate resolved/template/source data. Keep
  existing ordinary-cell mapper guards; avoid double applying offsets.
- [ ] Add an additive per-label receipt recording source/native top, single
  offset, merge rows and fallback reason; keep wordVerified=false until actual
  Word evidence. Existing source/native receipt fields must remain truthful.

### M2: focused acceptance and integration remains separate

- [ ] Pin24/8/three-member reproduction, uniform/no-op,0/1/3/80member groups,
  different peer inset values, fractional-unit/twip conversion, zero padding,
  multiple groups, long/multiline labels, page-spanning merges and repeated
  headers. Unsupported shapes must retain their previous representation.
- [ ] Test merged and ordinary tables together; group-label count/source map,
  input immutability, merge perimeter, reading keeps, no repeated label text,
  source Menu shape XML/text/line frames and source-line maps unchanged.
  Relevant existing files: groupLabels.test.ts, cellVerticalOffsets.test.ts,
  sourceLayout.test.ts, sourceFrameBudget.test.ts, tableBorderStyle.test.ts.
  Add bounded cancellation/output-abort/cleanup checks for the new export path.
- [ ] Only after focused tests: packed Linux consumer and actual full UAT on the
  retained runtime in Oracle lab512MiB, same inputs/fonts/options, followed by
  owner Word PDF comparison. Inspect SRS/other retained fixture applicability;
  run affected merge cases where present, record non-applicability otherwise.
  No automatic unrelated full-system suite or repeat after unchanged PASS.
- [ ] Candidate acceptance must meet M0 gates and regression coverage. Inspect
  residual2.59pt height and baseline errors as separate open gaps, not evidence
  of full parity. Any need to alter Menu/PDF/schema/caps or broader authoring
  semantics returns to scope/design before implementation.

This turn performs none of M0-M2: no candidate code/test/fixture edit, new render,
Oracle access or service operation. Only this existing PC plan is changed, with
source/P4 evidence review and final diff/check. No merge/push/release/install or
map promotion. Next proposed work is M0 copy proof, not an automatic Core patch.

## M0 copy preparation and owner Word handoff (2026-11-04)

Status: **M0_STRUCTURAL_DELIVERY_PASS_WORD_GEOMETRY_PENDING**. Owner authorized
M0 copy building on the isolated Oracle host512MiB worker: top8pt plus first
Module paragraph-before16pt once, preserving Menu boxes. Roles external lab
implementer/Evidence Reviewer/PC Steward; inline IDs not applicable. Existing
M0 plan and explicit request govern; no Core/Service implementation or integration.

Evidence root: `C:/Users/nekot/Documents/FlowDoc-recovery/docx-module-offset-m0-20261104/`.
Use packet.json, build.py, remote.py, oracle/receipt.json,
oracle/outputs/verification.json, verify-delivery.py and delivery.json.
Delivery: files/UAT-M0-module-top-8pt-before-16pt.docx,3019611bytes, SHA256
2313ba8d8653a0ec255a71700905adc40005a0a3ace3ac388d7ade0ff8b111ef.
Matched P0 source remains09c7d8a3fa8899eeb6e423c3d9f31581304d2b47aa097de2a8fc33e9cfbe8ed4.

Four attribute values only in document.xml: table8 rows1/2/3 column0 Module top
480→160twips (RESTART and two CONTINUE cells), and existing first label paragraph
spacing before0→320twips.24pt=8pt+16pt accounting passes; no new paragraph, text,
font/run, line-height, merge, border, bottom/side margin or continuation-paragraph
change. Surgical edit manifest includes original/modified offsets and values;
reversal restores the entire source document.xml bytes. Other ZIP parts are
byte-identical, XML/rels parse and ZIP CRC pass, nodes remain112084 with no cap
change. Independent local received-file verification confirms source diff,
ordered text, all Menu cell/shape XML, all other parts and hashes. Against P4,
reverting only the first label before-offset recovers the complete P4 semantic
XML tree; no other difference is hidden by that comparison.

Fresh worker exits0 first run, OOMKilled=false, peak156.707MiB under512MiB memory
and equal memory-swap (swap0), network none/read-only proof mount. Coordinator
Python address-space bound128MiB. Original container identities/start/restart
counts and input hashes stable; no owned worker remains running. No Core runtime,
renderer performance or native Word512MiB claim: this receipt proves copy building.

M0 preparation gates pass; native geometry/text/ink gates remain unchecked until
owner Word PDF export using previous settings. Compare M0 with retained P0/P4:
row heights, Module relative position, Menu lines, page flow and actual clipping;
apply existing M0 stop/return-to-design rules if offset inflates/collapses/repeats.
Keep the P4 cover asterisk/export difference visible in review. Do not mark M0
complete or start M1 from a structurally valid DOCX alone. No automatic rendering
via another application replaces the owner's requested Word export.

Only this existing PC prose changes in Git. Final source/evidence coverage review
and git diff --check close copy delivery. Core/Service, original data/services
and authoring inputs remain unchanged; no merge/push/release/install, further
probe or map promotion. Stop at file handoff pending owner PDF.

## Owner Word M0 comparison against P0/P4 (2026-11-04)

Status: **M0_BOUNDED_NATIVE_PROOF_PASS_RESIDUAL_CORE_GAPS_REMAIN**.
Owner requested read-only comparison of the exported M0 PDF; no Core/Service
edits/integration. Roles Evidence Reviewer/PC Steward, inline IDs not applicable.
Evidence root: `C:/Users/nekot/Documents/FlowDoc-recovery/docx-module-offset-m0-20261104/owner-pdf-comparison/`.
Use verification.json, verification-report.html, reference-manifest.json,
row-borders.json, target-text-positions.json, target-ink-checks.json,
global-character-inventory.json, all-page-characters.json and
all-page-raster-comparison.json. Reference PDF hashes match retained P0/P4/Core;
original/snapshot PDF hashes and M0 DOCX delivery hash recheck unchanged.

M0 Word365 export11:40:36 retains73pages. First-table border centers exactly
match P4:106.22/134.78/168.62/219.62/270.77/304.61pt. Heights are
28.56/33.84/51.00/51.15/33.84pt, total198.39pt: no extra height from the once-only
16pt paragraph offset. P0245.43pt is47.04pt taller; Core195.80pt remains2.59pt
shorter. The M0 within1pt-of-P4 height gate passes (actual difference0).

Module text top returns to167.83664pt, exactly P0, versus P4151.87664pt. Table-
relative positions: Core57.71, P0/M061.61664, P445.65664pt. Error versus Core
improves from12.05336pt too high in P4 to3.90664pt too low in M0, matching the
pre-existing P0 error and passing the explicit no-worse-than-P0 gate. This is
not perfect baseline parity and does not solve the remaining text-position gap.

Independent matched target character boxes (text/x/y/size) verify Module=M0/P0
and all three Menu lines=M0/P4. At240dpi Module ink cropx40-185/y163-178pt is
pixel-identical M0/P0; non-Module first-table regionx188-558/y107-304pt is
pixel-identical M0/P4. Visual review of target text, overlay and pages5-6 finds
no newly clipped target glyphs. The label may extend below a peer first-row
border because its own cell spans3rows; this is not clipping at that peer line.

Whole-file non-whitespace character counts show no additions/removals versus
P0. Per-page differences5/6 identify exactly the intact25/25/0 Scan Change Grade
row moved to5, as in P4.96dpi full-file rasters: M0/P0 have71identical pages,
differences5/6; M0/P4 have71identical pages, differences1/5. The P4 tiny extra
cover asterisk is absent in M0; M0 cover matches P0. Cause of that earlier P4
export difference remains unverified, but it is not reproduced in M0.

M0's scoped single-group gates pass: same P4 row heights, restored logical label
placement no worse than P0, unchanged Menu flow, text/ink checks and no observed
new target clipping. This does not prove long/cross-page groups, other labels,
SRS, generic adapter behavior, universal pre-existing clipping absence or Core
readiness. M1 remains unimplemented and needs separate authorization/scope check.
No further probe after passing the bounded gate.

Static report embeds four-panel comparison, same-origin P4-red/M0-blue overlay
and target text detail; image decoding and all evidence links pass. No new
Oracle worker or512MiB runtime claim: current work is local PDF analysis; prior
512MiB receipt remains copy-building proof only. Final coverage/diff review and
git diff --check close this comparison. Only existing PC prose changes in Git;
Core/Service and source files unchanged, no original data/service action,
merge/push/release/install, extra implementation or map promotion.

## M1 Core candidate implementation and Oracle lab proof (2026-11-04)

Status: **M1_IMPLEMENTED_ORACLE_PROOF_PASS_NATIVE_WORD_ACCEPTANCE_PENDING**.
Authority: owner explicitly authorized isolated Core candidate M1 plus long/
cross-page Oracle-host512MiB lab tests, preserving Menu boxes; no Service,
original data/services or merge/push/release/install. Roles Product Implementation
Agent, then Evidence Reviewer/PC Steward. Single-room IDs not applicable; reviewer
subagent performed read-only review, no separate WORK dispatch/registry. Work
Size bounded, Risk Tier routine for isolated reversible candidate; no promotion.

Scope/base: Core582f141566d1dd0cc4df53a7779818cab9c3d111. Candidate worktree
`C:/Users/nekot/Documents/GitHub/flowdoc-core-worktrees/m1-merged-inset-20261104`,
branch codex/m1-merged-inset-20261104, terminal42008134b67107cff78185fb12e155ef3008cad1.
Actual Git manifest exactly src/docx/tables.ts,
src/docx/merged-cell-top-insets.ts, tests/docx/mergedCellTopInsets.test.ts.
No source-layout, PDF/layout, template, schema, resources, caps, Service or
version changes. Source/RAM/input constraints from the approved M0/M1 plan stay.
The managed-worktree tool could not target Core from this PC chat; explicit
owner isolation authorization was fulfilled with a separate Git worktree.
Existing base lane and Service remain clean at their prior heads.

Pure helper derives physical top from validated uniform peer tops, preserving
sourceTop=physicalTop+firstLabelBefore. No UAT IDs or8pt constant in production.
Adapter changes only local space-policy entries for proven merged group labels;
logical source stays intact and offset reaches first real label paragraph only,
not continuation empty paragraphs. Additive per-label receipts record source,
physical inset, offset, covered rows, policy/reason and wordVerified=false.
Mixed/missing peers, single/empty groups, multiline or protected label content,
ending Areas, custom borders/other unsuitable cases retain their existing path.
Ordinary mapper guards, Menu guides, text frames and PDF path are not relaxed.

Evidence root: `C:/Users/nekot/Documents/FlowDoc-recovery/core-m1-merged-inset-20261104/`.
Use verification.json/report (verification-report.html), source manifests,
run4/oracle/receipt.json and run5/oracle/receipt.json, full/generation.json,
public package-resolution.json, long/long-proof.json, final merged/vitest.json,
verify-outputs.py and srs-applicability.json. Native source artifacts are frozen
and hashed; exact product source hashes match the tested snapshots before commit.

TDD: retained m1-red-local.log observes480twip merged margins where160 expected;
three mapped cases fail on that actual defect. A fourth nonmerged assertion was
corrected because the existing ordinary mapper already supplies an offset there;
no production behavior was changed to satisfy that mistaken assertion. Initial
GREEN and later local focused tests pass. Linux package build passes at234.46MiB.
Oracle final coverage is71tests across6groups: merged22(final run5), groupLabels6,
cellVerticalOffsets4, sourceLayout25, sourceFrameBudget2, tableBorderStyle12.
Final tests include fractional/zero insets,0/1/3/80members, long and multiline
labels, multiple groups, repeated headers, custom borders, ending Area fallback,
input immutability, pre-cancel and cancellation after serialization writes with
staged-output discard. Highest focused-test peak304.39MiB; final merged279.27MiB.

Packed public-root full-UAT generation succeeds at321.82MiB. First table semantic
XML equals approved M0; ordered text and all519VML shapes match P0. Source-line
maps/styles/media are byte-identical. Exactly7physical Module cells in3merged
groups change; single-member case stays on prior path. Non-XML random package
differences are not hidden: docProps/core.xml has generation metadata, fontTable
keys/odttf files have docx9.13 random embedding obfuscation GUIDs. Decoded font
SHA256s and normalized font table equal baseline; this is verified font identity,
not byte-identical regenerated font containers.

Synthetic long-label group80members produces DOCX and actual CorePDF at189.52MiB.
CorePDF has9pages and each ROW-000-END through ROW-079-END occurs exactly once,
covering pages1-9. Generated DOCX has80physical merge cells with8pt top and one
16pt before-offset; complete member texts occur once. Core PDF reference pages
1/5/9 rendered; middle page visually inspected. This proves an actual multi-page
INPUT and structural DOCX export, not native Word continuation geometry. The
retained SRS fixture has0groupLabel declarations; no new SRS runtime claim.

Every worker512MiB memory, equal memory-swap(swap0), network none, image pinned;
coordinator Python address-space128MiB. All passing workers exit0/OOMKilledfalse;
no owned worker remains running. Original container ID/image/start/restart
snapshots, immutable inputs, candidate source and retained native baseline hashes
unchanged. Retained harness failures precede passing rounds: initial dangling
container-only node_modules link, run2 scratch-dist ownership, run3 dependency
mount hierarchy. No OOM and no service mutation. Run4 passes build/tests/consumers;
run5 reruns only the changed guard test file, reusing identical product/dependency/
configuration build and consumers rather than repeating full generation.

Two fresh-context read-only reviews find no actionable code defect. Follow-up
adds header/border/multiple-group/ending-Area/mid-output-cancel assertions; native
Word gap is explicitly retained. Final tsc(noEmit), diff/check and source hash
coverage pass. Candidate is committed locally, not merged, pushed or released.

Delivery files under files/: UAT-M1-candidate.docx, M1-long-group-80.docx and
M1-long-group-80-Core-reference.pdf; hashes in verification.json. Static report
embeds a clearly-labelled CorePDF reference image; links/images/hashes validate.
Native Word PDF export of BOTH DOCX files remains mandatory to assess actual
merged continuation, row geometry and glyph clipping. Keep wordVerified=false;
M0's residual2.59pt table-height/3.91pt Module-position gaps remain known. No
claim that Word, SRS, Service or whole-system acceptance passed. Next step is
owner Word comparison; do not start integration or auto-close that gate.

Only this existing PC prose changes here; no map/record promotion or synthetic
Work. Final PC diff/check closes status recording. Stop with frozen candidate
and reviewable exports pending Word evidence.

## Owner native Word exports for M1 UAT and long80 comparison (2026-11-04)

Status: **SCOPED_NATIVE_M1_CHECKS_PASS_KNOWN_LAYOUT_DIFFERENCES_RETAINED**.
Owner supplied both PDFs and requested read-only comparison, no Core/Service
edits or integration. Roles Evidence Reviewer/PC Steward; inline IDs not
applicable. Candidate4200813 stays frozen. Evidence root:
`C:/Users/nekot/Documents/FlowDoc-recovery/core-m1-merged-inset-20261104/owner-pdf-comparison/`.
Use verification.json, verification-report.html, reference-manifest.json,
uat-target-geometry.json, uat-first-table-ink.json,
uat-all-summary-module-positions.json, uat-aligned-character-comparison.json,
uat-aligned-raster-comparison.json, toc-page-numbers.json,
long-comparison.json and long-row-text-and-bounds.json. All original/snapshot
PDF hashes and prior delivered DOCX/CorePDF hashes recheck unchanged.

Word365 owner exports12:47:28 UAT and12:48:13 long case. UAT M1 has72pages versus
M073. First table198.39pt and borders106.22/134.78/168.62/219.62/270.77/304.61pt
exactly match M0. Module absolute top167.83664pt/table-relative61.61664pt also
matches. First-table crop240dpi is pixel-identical. Other summary Module
relative positions are unchanged in tables9/10 and differ by0.12pt in table11
following row-height quantization; no repeated16pt displacement is observed.

Page reduction is accounted for: total72/72/0 moves from M0p6 to M1p5, eliminating
one continuation header and leaving downstream M1p6-72 aligned with M0p7-73.
Body85-765pt is identical in text/character boxes and96dpi RGB on70aligned pages.
Only body pages3 and5 differ:18TOC entries show first2unchanged and remaining16
page values decreased by1; page5 adds the moved total. Body character counts
match after exactly accounting for that repeated header and TOC page digits.
Native summary page visually reviewed: all4summary tables/totals now fit page5.
Do not describe this as unexplained content loss or blanket whole-file equality.

Long Word and Core both9pages, same80members exactly once and on exactly the
same pages (9members on each page1-8,8onpage9). Every member's normalized Menu
text equals the synthetic source string, not merely matching a marker. All80
Menu character bounds stay within their physical row. First Menu text position
relative to table top is42.05664pt on every Word page, versus41.71pt Core;
no page-continuation16pt offset reapplication. Word body row heights68.40-68.43pt
versus67.90pt Core (extra0.50-0.53pt; mean0.509pt). First Module relative top
61.61664pt versusCore57.71pt retains the known3.90664pt lower baseline.

240dpi Word first/last row crops on all9pages visually inspected; no clipped
head/tail glyphs found. Complete target strings/bounds and same page allocation
supply complementary checks. UAT first table exact ink and70unchanged bodies
support the no-new-clipping result there. This is evidence for supplied fixtures,
not universal Word/font/content fidelity or every pre-existing defect's absence.

Known design difference is now demonstrated natively: Word prints the complete
Module label once on page1, blank merged-label continuation cells onpages2-9;
Core prints it9times with8continuation suffixes. Source label content on page1
matches exactly in both exports. src/docx/writer.ts:206 explicitly declares
native-rowspan/continuationLabel:not-repeated. Classify this as an existing
format-policy Design Concern if visual parity is desired, not evidence of an
M1 inset defect or text being clipped. Do not claim full Core visual parity.
No change to label repetition policy is authorized or performed.

Initial strict single-word marker detection missed Word's fragmented extracted
words (R OW etc). That analysis failure is corrected using contiguous nonspace
character sequences with original coordinates; raw results are not promoted as
missing members. Source-aware80string checks and visible glyph review confirm
coverage. No runtime retry or product change was involved.

The native-export gap for these two supplied fixtures is now observed and
reported: scoped inset/row/data/page-break checks pass, with row/baseline and
label-repetition differences explicitly retained. This does not set product
receipt wordVerified=true, prove all documents, approve integration or silently
waive known differences. Static report embeds UAT target, continuation comparison
and all9page-end crops; image decoding/evidence links pass. Only existing PC
prose changes in Git; final coverage/diff check closes comparison. No new Oracle
worker or512MiB claim (this is local PDF analysis), Core/Service edit, original
data/service action, further probe, merge/push/release/install or map promotion.

## MR plan for repeated Module continuation labels in DOCX (2026-11-04)

Status: **REVIEW_AND_PROOF_PLAN_ONLY_NO_PRODUCT_CHANGE**.
Owner requests a plan for DOCX Module repetition with the literal suffix
" (ต่อ)" on continuation pages, preserving M1 geometry and Menu textboxes;
explicitly no Core/Service implementation or integration. Roles Planning
Partner/Evidence Reviewer/PC Steward; inline IDs not applicable. This existing
PC plan is the work authority, Core is the prospective owner. Candidate4200813
is immutable input. Work Size medium for the prospective planning problem;
Risk Tier routine for read-only planning, future implementation risk/scope to
be reassessed when page-fact ownership is resolved. Proof budget this turn is
targeted code/spec/evidence review only; no lab/Word run or copy mutation.
Document budget: this section only, no new Work or product-repo planning files.

### Findings and constraints

- tables.ts:160-183 emits source label text only in the first physical cell;
  continuations contain structural empty paragraphs. writer.ts:203-206 explicitly
  declares native-rowspan with continuationLabel:not-repeated. M1 changes local
  inset representation, not label occurrence or pagination ownership.
- engine.ts:38/193 returns pageCount:null. buildBodyFlow assembles native Word
  flow; tables.ts:55 receives full bodyHeightPt but not actual current-page
  remaining Y. sections.ts:134/137 calls it for body and ending Areas. A general
  per-page label emitter needs page-boundary facts that this path does not own.
- cellTableFlow.ts already handles label.active continuation text, label minimum
  extent, repeat headers and line/page cuts for Core layout. That is relevant
  source-logic evidence, not permission to call generatePdfTo from DOCX or import
  rendered PDF coordinates/cuts as production authority.
- Source guides explicitly use source-only facts and regenerate-after-edit
  (source-layout.ts:32-35); paragraph control/map ownership remains unique in
  source-layout-xml.ts:53-115. These invariants stay. Proposed scope targets the
  regenerated export, not live automatic re-pagination after arbitrary Word edits.
- Native Word evidence already proves long80 has9pages with equal member-page
  allocation, row68.40-68.43pt versusCore67.90, and first-row positions unchanged
  acrosspages. UAT M1 is72pages with first table198.39pt and label relative61.62pt.
  Those are immutable regression inputs, not universal rows-per-page constants.

Primary specification support (reviewed2026-11-04):

- Microsoft OpenXML TableHeader: tblHeader repeats contiguous leading table rows,
  not an arbitrary merged body cell; an isolated nonleading header row is ignored.
  https://learn.microsoft.com/en-us/dotnet/api/documentformat.openxml.wordprocessing.tableheader?view=openxml-3.0.1
- Microsoft Word Support warns manual page breaks inside a table do not repeat
  its automatic header. Any explicit-fragment design must provide its own real
  header row per fragment and prove boundary placement, not insert an in-table
  break and assume native repetition.
  https://support.microsoft.com/en-us/word/repeat-table-header-on-subsequent-pages
- lastRenderedPageBreak records a prior paginating application's saved result;
  it is not an instruction that makes Word generate a label on its next page.
  https://learn.microsoft.com/en-us/dotnet/api/documentformat.openxml.wordprocessing.lastrenderedpagebreak

### Alternatives for review

1. Turn Module into repeated table header content: native header mechanics exist,
   but this changes row/location ownership, may repeat the wrong group on a page
   containing several groups, and violates the requested merged-cell appearance.
   Not the recommended default.
2. Let Word paginate, then rewrite its output in a second layout-aware pass:
   potentially observes actual Word boundaries, but requires Word runtime and
   a stable export/update loop. Oracle Linux Core currently has no such owner;
   no installation, deployment or Service dependency is authorized. Cached
   lastRenderedPageBreak and conditional fields are not equivalent proof.
3. Recommended direction to PROVE: private DOCX page-fragment planning plus
   explicit native table/merge fragments. Each page fragment carries a label
   restart and its own header, using the same source row/cell content and M1
   inset. This may require controlled page boundaries; Word fit and separator
   paragraph effects must be proven before choosing a production design.

Recommendation is a proposed approach, not an owner-approved implementation
or a proved generic pagination solution. If native live-reflow behavior after
editing is required, return to design; do not silently substitute this snapshot/
regenerate-after-edit approach.

### Display and ownership contract

- Fragment0 of EACH logical group prints the exact source label, even if that
  group first starts on page2 or later. Fragment1+ prints the source label plus
  one generated " (ต่อ)" suffix. A new group on an existing page is not itself
  a continuation. Append as generated display data, never mutate business text.
- Match Core's suffix composition rather than stripping literal source text
  which happens to end in "(ต่อ)". XML escaping/native text runs remain mandatory.
- One label per visible group/page fragment, not one per member or physical row.
  Multiple groups on one page may each have one label. Empty/single-row groups
  and non-crossing tables keep current M1 output unchanged.
- For every emitted visible label, preserve M1's physical peer top plus single
  paragraph offset accounting (24=8+16 in this fixture). The16pt offset is once
  PER LABEL FRAGMENT, not on all continuation rows; new visible continuation
  label has its own single inset. No offset accumulation or new Menu offsets.
- Move each existing Menu SDT/paragraph/shape exactly once; do not regenerate,
  duplicate or rasterize its word boxes. Preserve font/run/line/X-Y anchoring
  properties, source ranges and unique tags/IDs. Header clones and generated
  label fragments need collision-free derived identities/bookmarks, not copied
  duplicate IDs or invented source business nodes.
- Record logical table/group/source-cell IDs, fragment index, source row range,
  label role/origin and suffix provenance separately. Source paragraph maps
  retain source ownership; generated continuation display must not pretend to
  be extra source text. No caller-supplied page/cut hints or UAT/name/80/9 constants.

### MR0: copied-document representation feasibility gate (next proposed work)

- [ ] On fresh copies only, use the observed long80 member/page boundaries as
  LAB FIXTURE DATA. Build native table fragments per observed page, close/restart
  merges within each fragment, repeat the actual column header, emit the original
  first label and8continuation labels with suffix. Keep every Menu XML block and
  data cell/row content exactly once. Keep a reversible manifest and immutable
  M1 source; do not import these recorded boundaries into Core.
- [ ] Isolate the separator/boundary mechanism: any page break sits BETWEEN
  physical fragment tables, not inside an old table. Prevent Word from silently
  coalescing adjacent tables. Measure any mandatory paragraph height, top inset,
  border and section/header/footer effects; do not hide it by resizing Menu or
  changing page margins. Reuse M1 geometry, style, grid and resources.
- [ ] Test the base80/9page case plus a continuation label whose suffix wraps,
  a final fragment with very few rows, and two groups sharing a page. Native
  label height must fit the fragment; if it cannot, stop rather than clip text,
  keep an entire long group or raise budgets. Do not insert a page-number-only
  rule that puts "ต่อ" on the first fragment of a later-starting new group.
- [ ] Oracle-host512MiB/worker, swap0, existing coordinator and budget options,
  immutable fonts and inputs, no network/data/services; stop on OOM. Check ZIP/
  XML/rels/IDs, every source member exactly once, original Menu shape/XML hashes,
  source-map coverage and generated-label provenance before owner Word export.
- [ ] Native Word PDF must retain9pages and the same member allocation for the
  long80 fixture, original label once plus8suffixed labels, label near each
  fragment start and complete visible text, no new row-height/first-line shifts
  beyond measured twip rounding. Compare against M1 and Core at240dpi, including
  every page start/end. UAT M1's non-crossing groups must retain72pages and the
  first198.39pt table/Module position. No whole-document pixel-parity claim.
- [ ] Failure returns to representation design. Passing proves only display/
  fragments on copies, not how a production exporter discovers page boundaries.

### MR1: source-owned page-fact feasibility, before product implementation

- [ ] Define private input/output facts: validated source/group/row/line IDs,
  column widths, owned font/fit hashes, M1 native row/label/header extents, section
  band reservations, current remaining page capacity and fragment cuts. Require
  ordered gap-free single coverage, forward progress and capacity proof that
  includes the repeated label plus suffix and headers/separators.
- [ ] Reuse measured source facts when genuinely available; inspect whether a
  renderer-neutral row/group planner can share logic without changing PDF output.
  Do not call the PDF engine or retain a second PDF draw/glyph/ZIP working set.
  Do not subtract a universal0.5pt or assume the9rows observed in this fixture.
- [ ] The current DOCX builder lacks actual Word page positions and current-flow
  remaining height. Prove partial-page starts, preceding text/tables, multiple
  sections and different first/default header/footer reservations. If solving
  those needs wider shared-layout/source-guide changes, return a scope/contract
  proposal first; do not widen this plan's Core mutation allowance implicitly.
- [ ] Start with proven whole-row cuts only. Core can split long rows at line
  boundaries, whereas moving Menu as an unchanged SDT assumes no internal split.
  Rows taller than a page, images/complex merges or intra-row cuts are a separate
  prerequisite: either derive a validated line-fragment map preserving boxes and
  source spans under a newly reviewed contract, or mark them unsupported. Never
  claim generic continuation support while silently dropping their labels.
- [ ] Choose explicit unsupported/overflow behavior before M2 (capability issue
  versus clearly reported native-no-repeat fallback). No silent partial feature,
  stale cached cuts, arbitrary Word font substitution or unbounded update loops.
- [ ] Compare source-predicted plans and actual owner Word page allocation on
  several boundary-sensitive fixtures. If added labels cause Word to spill or
  create blank pages, reject the plan rather than keep republishing/retrying.

### MR2: prospective Core implementation only after MR0/MR1 and authorization

Potential private files: src/docx/group-fragment-plan.ts (facts/validation),
src/docx/group-fragment-tables.ts (native fragment emission), tests/docx/
groupLabelContinuations.test.ts. tables.ts/buildBodyFlow would need a deliberate
multi-FileChild path rather than assuming one logical table returns one native
Table; sections.ts uses that flow for BOTH ordinary body and ending Areas.
Ending-Area/header/protected cases stay out until specifically proven. writer.ts
must describe the actual continuation policy instead of unconditional
not-repeated. M1 helper stays the inset authority; no generic schema/Service/API
or default-cap change is approved by this plan.

- [ ] Test0/1/many members, multi-page labels, new groups starting on later pages,
  several groups on one page, repeated headers, near-bottom starts, one-row final
  fragments, suffix wrapping, Unicode and literal source suffix, number/TOC/
  bookmark integrity, source-map ID uniqueness, and unsupported row-split cases.
- [ ] Pin non-crossing M1 XML/Menu/geometry and all supported80member page/label
  invariants. Add cancellation, timeout, staged sink abort/cleanup and resource
  limits; preserve partial-failure containment. Budget repeated headers/labels
  within unchanged node/byte/drawing caps before construction/publication.
- [ ] Packed Linux consumer and representative UAT/long fixtures in isolated
  Oracle512MiB, then native Word PDFs; keep receipt wordVerified=false as a
  general export claim, record bounded verification as separate Evidence.
  Local/unit/copy/CorePDF results alone do not close native pagination gates.

Unknowns deliberately open: stable Word fit/cuts under unchanged Menu content,
separator space, label-fit rebalance, partial-page cursor facts, intra-row
fragment ownership, edited-Word reflow contract, unsupported-policy choice and
metadata/node-growth limits. No final Core design or implementation is claimed.
This turn changes only this existing PC prose, after spec/code/evidence review
and final diff/check; no new copies, Oracle access, Core/Service changes,
merge/push/release/install or map promotion. Next proposed task is MR0 copy
feasibility, not an automatic implementation of page fragmentation.


## MR0 base80 copy pilot — 2026-11-04, native Word pending

Owner authorized the base80 copy experiment only, preserving M1 and Menu
textboxes. Active roles: isolated lab copy implementer, Evidence Reviewer and
Project Control Steward; inline execution IDs not applicable. This section
records bounded evidence and does not close the full MR0 checklist above.

- Artifact root: `C:/Users/nekot/Documents/FlowDoc-recovery/docx-module-repeat-mr0-20261104`.
  Durable receipts: `oracle/receipt.json`, `oracle/outputs/verification.json`,
  `delivery.json`; reproduction: `build.py`, `remote.py`, `run.py` and packet.
- Delivered copy: `files/M1-MR0-repeat-Module-long-80.docx`,174800bytes,
  SHA256 `a7f8181ef03c0fd1b91a28d8d598765dce75e4514831c5b584474118736579d1`.
  Immutable M1 source SHA256
  `5845bae5e5452b7a8a29dc494da180c18b6e615e2a50c169b0beec22fec6e253`.
- Copy-only builder used observed Word cuts as fixture data: nine physical
  table fragments, nine members per fragment1–8 and eight in fragment9.
  Original Module label appears in fragment1; the other eight append generated
  ` (ต่อ)` in a native text run. Original header is cloned per fragment; original
  total row appears only once at the end. This is not a production cut algorithm.
- Preserved M1 physical top160twips and label paragraph-before320twips once
  per visible fragment label. Continuation rows retain zero paragraph-before.
  Closed/restarted Module merges and fragment bottom borders; inserted eight
  between-table page-break paragraphs with1twip exact line height. Their native
  layout effect remains unverified; unchanged row/page geometry is not claimed.
- Oracle-host worker512MiB, swap0, coordinator128MiB: exit0, OOMKilled=false,
  observed cgroup peak42987520bytes (40.996MiB). Original three container
  identities/start times/restart counts remained stable; inputs unchanged and
  no owned worker remained running. No SQL or original data was accessed.
- Builder and independent post-download checks passed:80member markers exactly
  once in source order,80unique original control IDs, all320non-Module cells
  preserved, Menu SDT and VML shape blocks byte-identical on independent check,
  every other ZIP part byte-identical, ZIP CRC and XML/rels parse valid. Replacing
  the nine fragments with the immutable original table recovers original XML.
  XML/rels count27676nodes; existing lab option300000unchanged. Source-map
  blocks remain unchanged; generated-label roles/ranges are separate manifest
  provenance, not a newly implemented Core source-map contract.

Status: PASS for base80 copy structural/resource checks; WORD PENDING, not full
MR0 PASS. Owner should export this exact DOCX in native Word with the prior
settings and retain its filename. Then compare all page starts/ends against
M1/Core: nine pages and original member allocation, nine complete Module labels
including eight suffixes, table/Module/Menu baselines, borders, blank pages and
clipping. Do not infer these from the structural receipt. Suffix wrapping,
few-row final fragment, multiple groups sharing a page and non-crossing UAT
regression remain unverified. If Word reflows or clips, return to representation
design before implementation; no automatic retry or cap increase.

Core M1 candidate42008134 and Service candidate db15e9d remain read-only;
no Core/Service edits, code integration, original service stop, merge, push,
release or installation are part of this pilot. Next action is owner Word PDF
conversion, then bounded comparison; MR1/MR2 remain gated.


## MR0 base80 owner Word PDF comparison — 2026-11-04

Owner supplied `files/M1-MR0-repeat-Module-long-80.pdf` and authorized read-only
comparison with M1/Core, not further copy construction or product changes.
Active role: Evidence Reviewer with Project Control Steward for this append;
inline IDs not applicable. Existing MR0 checklist is the acceptance target.
The preceding WORD PENDING result remains historical; this bounded result
supersedes that pending state for the base80 fixture only.

Evidence root is the same MR0 artifact directory's `owner-pdf-comparison/`:
`references/` pins all three PDFs; `comparison.json` records hashes, metadata,
per-page markers, text coordinates and edges; `text-and-geometry-summary.json`,
`raster-comparison.json`, `bounded-ink-check.json` and `result.json` hold the
checks. Reproduction scripts are `compare-mr0.py`, `render-mr0.py` and
`visual-check-mr0.py` in the MR0 root. PDF rendering/comparison ran locally;
there was no Oracle connection or rerun of the prior memory test this turn.

- PASS: MR0, M1 and Core each have9pages, members9/9/9/9/9/9/9/9/8,
  all80markers once in original order and exactly the same page allocation.
- PASS: MR0 Module label once on each of9pages; original label on page1,
  exact original plus generated ` (ต่อ)` on pages2–9. All label text extracted
  completely and all nine rendered label regions inspected. Suffix fits the
  existing last line here; this does not prove a forced-extra-line suffix case.
- PASS: every member's complete Menu text matches the fixture and lies inside
  its row bounds. All non-Module data-character coordinates and horizontal
  row-edge centers are exactly equal to M1 on all9pages. Member row heights
  remain68.40–68.43pt, compared with Core67.90pt (existing0.50–0.53pt delta).
- PASS within fixture: MR0 labels share the original M1 page1 position on every
  page: top167.83664pt,61.61664pt below table top. Core label top161.71pt,
 57.71pt below its table top: existing relative difference3.90664pt and absolute
  difference6.12664pt remain; this is not coordinate parity with Core. Menu
  first-line top148.27664pt remains unchanged from M1, versus Core145.71pt.
- Rendered all27reference pages at240dpi. MR0/M1 non-Module table interiors
  x188–565pt,y85–765pt are pixel-identical on all9pages. No changed pixels lie
  outside the bounded Module area x30–188pt,y134–752pt. Broader crop starting
  x186pt includes a3pixel border-join difference on pages1–8: the Module's
  bottom border is explicitly closed at each fragment end. Do not call the
  entire table or entire page pixel-identical.
- Inspected all9Module starts, all18first/last member rows, full9page sheet
  and page2M1/MR0/Core comparison. No new visible clipping, missing suffix,
  blank page, header/footer displacement or total-row loss observed in this
  fixture. Existing text/geometry differences from Core remain visible.

Result: PASS_BASE80_NATIVE_WORD_COMPARISON_ONLY. Useful visual evidence:
`MR0-all-module-starts.png`, `MR0-all-page-ends.png`, `MR0-all-pages.png`,
`page2-M1-MR0-Core.png`, and same-origin overlay
`page2-M1-magenta-MR0-cyan-overlay.png` (coincident ink black; new MR0 ink cyan).
This closes the base80 Word-pending comparison, not full MR0/MR1 or generic
DOCX continuation support. Few-row final fragments, multiple groups per page,
forced suffix wrapping and non-crossing UAT regression remain open. Production
page-fact discovery still needs MR1; no product implementation is authorized.
Core/Service candidates remain clean/read-only, no original data/service access,
merge/push/release/install, product map or shared readiness promotion.


## MR0 three edge-fixture copies — 2026-11-04, Word pending

Owner authorized three additional copy-only Oracle512MiB cases, preserving M1
and Menu textboxes, for owner Word PDF conversion. Active role: isolated copy
implementer/Evidence Reviewer; Project Control Steward for this existing-plan
append. Inline execution IDs not applicable. Scope is the three open MR0
representation cases, not MR1 pagination discovery or a product implementation.

Artifact root: `C:/Users/nekot/Documents/FlowDoc-recovery/docx-module-repeat-mr0-edges-20261104`.
Reproduction: immutable `original.docx`, `build.py`, `remote.py`, `run.py`,
`packet.json`, and independent `verify-local.py`. Evidence: `oracle/receipt.json`,
`oracle/outputs/verification.json`, cgroup files, `transport.log`, `delivery.json`.
Source remains SHA256
`5845bae5e5452b7a8a29dc494da180c18b6e615e2a50c169b0beec22fec6e253`.

- E1 `files/MR0-E1-last-page-2-rows.docx`: selected original members0–19,
  fixture cuts9/9/2, three Module labels and two continuation suffixes. The last
  two-row fragment tests original long-label fit. XML/rels8440nodes; SHA256
  `8847192c38debd623c0d738d8372c12580e0c6b8e92391e0252d650559122e6c`.
- E2 `files/MR0-E2-multiple-groups.docx`: members0–19 partitioned into synthetic
  A0–3, B4–13, C14–19. Target page1 A then B; page2 B (ต่อ) then newly starting
  C WITHOUT suffix; page3 C (ต่อ). Five visible labels, two suffixes, cuts9/9/2.
  XML/rels8470nodes; SHA256
  `0fb352454eedc3d6b6d41963bf2393d4054e821616468e4854f8ca9102d76382`.
- E3 `files/MR0-E3-suffix-wrap.docx`: members0–17, cuts9/9. Source label is the
  original long label plus `label wordslabel iii`, chosen to leave less than
  suffix width at the end of its predicted last line. Continuation appends the
  normal ` (ต่อ)` run: NO forced break/no-break-space/paragraph change inside
  the label. Two labels, one suffix. XML/rels7594nodes; SHA256
  `2ffe3493e535e8ac823155fa24e646acbff5fe3a5cb7f3e732d1ddd102d89f09`.
  Automatic wrapping is a TARGET, not a confirmed Word outcome; compare source
  page1 and continuation page2 after owner export. If it does not wrap, this
  gate remains open rather than being reported as a passing wrap case.

These are intentionally smaller synthetic fixtures, not replacements for the
original80member document. Excluded member indices are explicit in the manifest;
retained row order/values are unchanged. Fixture totals are recomputed210/210/0
for20members and171/171/0 for18. Synthetic grouping changes native Module
merges/labels only; original selected Menu SDT source group0 lineage is retained
byte-for-byte. External manifest maps fixture partitions back to original row
indices; it does not pretend Core emitted new A/B/C source-map identities.

Oracle-host worker512MiB/swap0, coordinator128MiB, pinned prior image,
network-none/read-only input: exit0, OOMKilled=false, observed peak34742272bytes
(33.133MiB), cgroup oom_kill0, inputs unchanged. Original three container
identities/images/start times/restart counts unchanged, no owned worker running
at return. No SQL, old business data or original service operation was performed.

PASS structural checks in worker and independent downloaded-package checks:
all selected members once/in order, unique control IDs20/20/18, raw Menu SDT/VML
blocks unchanged, selected non-Module cells unchanged, every non-document ZIP
part byte-identical, CRC/XML/rels valid, section/header/footer/style resources
unchanged. Each visible label keeps M1 physical top160twips plus before320twips
once; continuing rows before0. Merges close/restart per fragment or group;
only between-table page-break paragraphs use the prior1twip separator. All
options remain unchanged, including current lab XML option300000. Internal
continuous-table controls for each fixture are retained under `oracle/outputs/`
for comparison; only the three requested candidate DOCX files are delivered.

Independent verifier initially searched raw XML for contiguous markers; Menu
text is split across runs, yielding zero raw matches. Corrected only the local
verifier to concatenate native text nodes before marker checks; all six candidate/
control packages then passed. No document repair or Oracle rerun was needed.

Result: PASS_MR0_EDGES_STRUCTURAL_WORD_PENDING. Owner deliberately performs
native Word export; no substitute renderer result or native layout PASS is
claimed. Actual page counts, labels/headers/borders at page/group boundaries,
row heights, first-line position, clipping, forced-extra-line fit and field
refresh remain pending. Expected pages3/3/2 are fixture targets, not observations.
Compare all three PDFs with preserved M1 geometry and their manifests before
closing the three MR0 cases. Non-crossing UAT regression and MR1 remain open.
No Core/Service edits or integration, original service stop, merge, push,
release/install or map promotion. Product candidates remain read-only.


## MR0 E1–E3 owner Word PDF review — 2026-11-04

Owner supplied all three PDFs and requested read-only layout/content checks,
not candidate edits or integration. Active role Evidence Reviewer/Project
Control Steward; inline IDs not applicable. Existing MR0 edge checklist is the
acceptance target. This append supersedes Word-pending for the reviewed facts,
while retaining the prior two-page E3 target and its failure in history.

Evidence directory: prior MR0-edges root's `owner-pdf-comparison/`. Immutable
PDF copies/hashes/metadata and detailed measurements in `references/` and
`comparison.json`; assertions, pixel checks and E3 capacity in `checks.json`;
bounded outcome in `result.json`. Reproduction: `compare-pdfs.py` and
`check-pdf-results.py` at artifact root. All9owner pages rendered at240dpi;
all-page contact sheets and every Module-label crop visually inspected.
PDF and delivered DOCX SHA256 values rechecked unchanged after analysis.
No Oracle connection or memory-test rerun was needed for this local review.

- E1 PASS within fixture:3pages,9/9/2members. All20members and3complete
  Module labels, suffix on pages2–3 only. The final two-row merged cell contains
  the entire five-line continuation label with26.01336pt below its text bounds.
  Total210/210/0 remains on page3. No visible clipping or missing text observed.
- E2 PASS within fixture:3pages,9/9/2members. Exact labels in order are A, B,
  B (ต่อ), C, C (ต่อ). A/B share page1; B continuation/C share page2. Newly
  starting C on page2 correctly has NO suffix. All20members and5labels complete;
  total210/210/0 remains on page3. Native label origin is33.05664pt below its
  group top, except B on page1 at33.07664pt (0.02pt rounding); no cumulative inset.
- E3 WRAP PASS / PAGE TARGET FAIL: actual3pages against target2, members9/9/0.
  All18members, two Module labels and one generated suffix complete. Source
  label has5lines; continuation has6, with exact ` (ต่อ)` on the new last line
  at254.35664pt top,17.28pt below the preceding line. No manual label break in
  DOCX. Six-line label remains well inside its merged cell; no clipping observed.

E3 third page is NOT blank: it has repeated column header and total171/171/0,
with no source member or Module fragment. The copy plan mistakenly reserved no
space for the total after9last-page members: last member bottom750.46pt,
unchanged section body bottom750.90pt, remaining0.44pt; measured total-row height
33.84pt would place its bottom784.30pt. Word moved that row and repeated the
header on page3. Candidate has only ONE explicit break between two physical
tables, so page3 is native overflow, not an extra inserted page break. All member
row heights/coordinates remain M1-exact, with no label-driven row expansion.
This proves a fixture capacity-planning omission, not a newly established Core
bug. Do not silently change expectedPages to3 or call the whole E3 case PASS.

For all three fixtures: row heights68.40/68.42/68.43pt, horizontal row edges and
all non-Module data-character coordinates match original M1 rows exactly.
Every Menu text is complete and within row bounds; every label complete and
within its merged bounds. All58selected member-row interiors are pixel-identical
to original native M1 at240dpi (x188–565pt, each row trimmed0.6pt at both edges).
This is a bounded interior check, not whole-page parity; grouping, labels,
footer page counts and totals intentionally differ. No observed new text cut,
wrong suffix, missing total, blank page or header/footer damage in the9pages.
Existing M1/Core geometry differences are not fixed or reclassified by this review.

Overall PARTIAL_PASS_E3_PAGE_TARGET_NOT_MET. E1/E2 native edge cases and E3
natural suffix wrapping are proven in these copies; retain E3 capacity as open
before claiming full MR0 acceptance. Proposed next copy-only revision, not
executed: E3 with17members9/8 plus total (153/153/0), identical long label and
Menu geometry, to exercise wrapping AND fit the two-page target. Preserve the
18member overflow evidence. MR1 must include totals/repeated headers/section
reservations in capacity facts. Non-crossing UAT regression and generic source-
owned pagination remain unverified. No Core/Service edits, merge/integration,
push/release/install, original data/service changes or map promotion.


## MR0 E3R1 17member copy — 2026-11-04, Word pending

Owner authorized the proposed copy-only17member E3 revision in Oracle512MiB,
keeping M1/Menu and the exact proven wrapping label, for owner Word export.
Scope/role: isolated fixture implementer then Evidence Reviewer; Project
Control Steward for this append, inline IDs not applicable. Existing MR0 E3
page-capacity criterion stays open pending native evidence; no product lane.

Artifact root `C:/Users/nekot/Documents/FlowDoc-recovery/docx-module-repeat-mr0-e3-17-20261104`.
Immutable source plus `build.py`, `remote.py`, `run.py`, `packet.json` reproduce
this bounded worker; `verify-local.py` independently checks downloaded output.
Receipts: `oracle/receipt.json`, `oracle/outputs/verification.json`, cgroup files,
`transport.log`, `delivery.json`. Prior18member E3 documents/PDF/results remain
unchanged and retain their three-page capacity failure.

Delivered `files/MR0-E3R1-17-members-suffix-wrap.docx`, SHA256
`5829498c7136dd526a4f49ec12ed96712433a0e2b095f6efe6722b60419382ce`.
Fixture selects original members0–16 once, in order; cuts9/8, two Module labels,
one generated suffix, total153/153/0. Original excluded indices17–79 are explicit
in the manifest. No change to long source-label text, suffix run/font/spacing,
M1 physical top160twips/paragraph-before320twips or native Menu textboxes.
Both fragment-start Module cells are byte-equivalent after parsing to the
18member E3 counterparts. No manual line break inside either label; one
between-table page-break paragraph, two physical tables. Internal continuous
17member control copy is retained under `oracle/outputs/`, not delivered.

PASS worker and independent checks:17unique controls/member markers, all17
selected raw Menu SDT/VML blocks identical, all68non-Module data cells unchanged,
every other ZIP part byte-identical, CRC/XML/rels valid. XML/rels7299nodes with
unchanged lab option300000. Source/section/header/footer/style parts unchanged.
Oracle worker512MiB/swap0 and coordinator128MiB: exit0, OOMKilled=false,
cgroup oom_kill0; observed peak30736384bytes (29.3125MiB). Inputs and original
three container identities/start times/restart counts unchanged; no owned worker
running at return. No SQL, old business-data access or original-service action.

Projection only, from previous native E3 positions: member17bottom682.06pt plus
prior total height33.84pt =715.90pt against unchanged body bottom750.90pt,
leaving35.00pt. This is not a newly rendered two-page result or a clipping PASS.
Actual page count, automatic suffix wrapping, row/label positions, totals/footer
refresh and clipping remain PENDING_OWNER_WORD_EXPORT. Owner should convert
this exact file using previous Word settings, keep its name, then compare both
pages with M1/E3 and verify the entire total row stays on page2. No automatic
closing of E3/MR0. No Core/Service edits or integration, merge/push/release/install,
original data/service changes or map promotion; product candidates remain clean.


## MR0 E3R1 owner Word PDF acceptance — 2026-11-04

Owner supplied the17member E3R1 PDF and authorized read-only comparison, not
product changes/integration. Active role Evidence Reviewer/Project Control
Steward; inline IDs not applicable. Existing E3R1 native page/total/wrap checks
are the bounded acceptance target. Prior E3R1 WORD PENDING is superseded by
this result; original18member E3 page-target failure remains historical evidence.

Evidence: E3R1 artifact root's `owner-pdf-comparison/` contains immutable
`references/`, `comparison.json` (PDF hash/metadata, text/row/group coordinates),
`checks.json` (automated assertions), `result.json` (post-visual-review outcome)
and240dpi `renders/`. Reproduction scripts: `compare-pdf.py`, `check-pdf.py`.
Native owner PDF SHA256
`8ab5d1d82dc115e7e3c2b5b0df8cf3a13c46afa8186d05193cc554b94d6c15ad`.
Source PDF and delivered DOCX hashes rechecked unchanged after review. No
Oracle session or memory-test rerun was needed for local PDF inspection.

PASS_E3R1_BOUNDED_NATIVE_WORD_FIXTURE:

- Exactly2pages,9/8members, all17markers once in order. Footer fields read
  Page1of2 and Page2of2; no third/blank page.
- Two complete Module labels. Source label5lines on page1; page2continuation
  6lines with exact `(ต่อ)` alone on the new last line. Text/line positions and
  bounded label ink are identical to previously verified E3, including suffix.
  No manual break was added in the DOCX.
- Every Menu text complete and inside its native row bounds; both Module labels
  complete and within merged-cell bounds. All17non-Module data-character lists
  and coordinates match original M1 rows exactly. Horizontal row edges match;
  member heights remain68.40/68.42/68.43pt. All17member interiors are pixel-
  identical to M1 at240dpi (x188–565pt, row edges trimmed0.6pt). No whole-page
  parity or removal of existing M1/Core geometry differences is claimed.
- Total153/153/0 appears once on page2, entirely inside its row: top682.06pt,
  bottom715.90pt, height33.84pt; text699.15664–707.67664pt. Unchanged section
  body bottom750.90pt leaves35.00pt. This confirms the prior fit projection for
  this exact fixture, not a universal Word pagination formula.
- Inspected both complete-page240dpi renders plus detailed continuation and
  final-member/total crops. No visible clipping, overlap, missing text, blank
  page or header/footer damage observed. Visuals: `E3R1-both-pages.png`,
  `E3R1-page2-wrap.png`, `E3R1-page2-final-row-and-total.png`.

E3R1 native acceptance is closed for this copy, alongside the previously proven
E1/E2 edge cases and base80 rendering. Full MR0/generic continuation acceptance
is not promoted: non-crossing UAT regression and source-owned page-fact/MR1
requirements remain outside this proof. Retain total/header/section capacity
accounting and the18member overflow evidence. Stop this bounded verification;
no Core/Service edits, code integration, merge/push/release/install, original
data/service changes or map promotion. Product candidates remain clean.


## MR0 UAT non-crossing preservation regression — 2026-11-04

Owner authorized UAT non-crossing copy regression against M1 in Oracle512MiB,
not Core/Service mutation or integration. Active role isolated lab implementer /
Evidence Reviewer, Project Control Steward for this append; inline IDs not
applicable. Existing MR0 non-crossing preservation criterion is the target.

Important evidence boundary: MR0 has no product transformer wired into Core.
This tests a LAB-ONLY representation selector and its unchanged-package branch,
using trusted fixture facts from the existing native M1 Word PDF. It is not a
Core regression suite, a new UAT render/export or proof of generic page discovery.

Artifact root `C:/Users/nekot/Documents/FlowDoc-recovery/docx-module-repeat-mr0-uat-regression-20261104`.
Inputs `original.docx`, `original.pdf`, `facts.json`, `crossing-control.json` are
packet-hashed. Reproduction `prepare-facts.py`, `build.py`, `remote.py`, `run.py`,
`verify-local.py`. Evidence `oracle/receipt.json`, `oracle/outputs/verification.json`,
cgroup files, `result.json`; native visual `native-evidence/M1-UAT-four-noncross-tables.png`.
DOCX input/output SHA256
`32f3fb82a0be71d0ea707e8bf3483ee2759e4210bacab11dfe72394bf6f85f91`;
existing native PDF SHA256
`ec1b60796e9351339221c3aa9b53facec5f499531874fdf68cf963eecf0d5fc9`.

- Independently matched all four Module/Menu summary tables (source indices8–11)
  and all8member rows to native M1 page5. Every Menu/numeric cell text matches
  source after whitespace removal; all4Module labels complete inside the
  corresponding table bands. Three groups use vertical merges and one is a
  single-member group. All members of each group occupy page5.
- Lab selector chooses PASSTHROUGH_UNCHANGED for those four groups. Actual
  native long80 facts exercise the opposite branch NEEDS_FRAGMENTATION without
  passing it through. Six invalid-fact checks (missing/duplicate/unknown group,
  missing members, changed member text, invalid page) reject before publishing.
  All8checks passed; the selector consumes fixture facts, not a Word page API.
- Oracle output `files/UAT-MR0-noncross-regression.docx` is WHOLE-FILE BYTE-
  IDENTICAL to M1; all171ZIP parts independently equal,95tables and59SDT controls
  unchanged, ZIP CRC/XML/rels parse valid. No serialization, labels, suffixes,
  row fragments or page breaks added. XML/rels112084nodes, no limit changes.
  All layout/source-map/font/image/header/footer/style data remain exact.
- Native layout proof is REUSED M1 evidence, enabled by exact package identity:
  72pages, first summary table198.39pt and first Module61.61664pt below its table
  top. Other summary heights112.20/147.26/129.99pt, relative Module origins
  58.13664/61.63664/61.64664pt. Rendered pinned M1 page5 at240dpi and inspected
  all four groups; no new appearance/clipping change is introduced by no-op.
  Do not report72freshly exported pages, a new native A/B pixel comparison, or
  a Core MR0 acceptance based on this identity proof.
- Oracle worker512MiB/swap0, coordinator128MiB, pinned image: exit0,
  OOMKilled=false, oom_kill0, observed peak106270720bytes (101.348MiB).
  Inputs unchanged; original three container identities/start/restart counts
  unchanged, no owned worker left running. No SQL, old business-data access,
  original service stop, release or installation.

PASS_LAB_NONCROSS_PASSTHROUGH_REGRESSION closes this copy-level UAT preservation
check. Prior base80/E1/E2/E3R1 evidence remains bounded to copied representations;
MR1 source-owned page facts/capacity, row-split/unsupported behavior and any future
Core integration still require their own work and authorization. Stop this
regression here. Core/Service candidates remain clean; no code integration,
merge/push/release/install, original data/service changes or map promotion.


## MR1 source-only first proof — 2026-11-04, bounded PASS / MR1 incomplete

Owner authorized MR1 copies in Oracle512MiB without old-PDF cut inputs, preserving
M1/Menu and product repositories. Role discovery/proof implementer and Evidence
Reviewer; Project Control Steward for this existing-plan append. Inline IDs not
applicable. Work authority remains lab discovery; no Core/Service implementation.

Artifact root `C:/Users/nekot/Documents/FlowDoc-recovery/docx-module-repeat-mr1-source-20261104`.
Final proof is `run2/`: packet/source hashes, `build.py`, `remote.py`, `run.py`,
`oracle/receipt.json`, `oracle/outputs/verification.json`, `verify-local.py`,
`verification-local.json`, `node-budget-check.json`, `verify-native-reuse.py`,
`native-reuse-verification.json` and `files/`. Initial run is retained/superseded
for separator review: its page-break paragraph omitted MR0's1pt run defaults.
Run2 restores the exact MR0 separator; only the lab wrapper changed. Models and
cut calculations stayed unchanged. Do not deliver/reuse the initial outputs.

### Input and computation boundary

No PDF, PDF engine, captured native page facts, observed boundaries or earlier
fragment-cut manifest was admitted to either producer. Inputs are continuous
M1-derived DOCX sources (no table page breaks or lastRenderedPageBreak), owned
TTF/license catalog bytes, original summary template and80member request.
The request's label and all80Menu/numeric values independently match the source
DOCX; template label padding24pt is retained as M1 physical8+before16.
17/20member sources are continuous controls, not prior fragmented candidates.

Source font hashes: Sarabun Light
`d6b2e60fb81aa933aaf61564e41732a5ab2cdcaafffac5242ea72cbc1f9e2722`, Sarabun
`b8150084e25734e6f31696c57ff009f5564efa09d295848b717d9e2328c0311d`.
The lab model reads TrueType cmap/hmtx/OS2 metrics, declared paragraph line rules,
cell margins/widths/borders and section margins. Source guide outer paragraphs
supply Menu line extents; no textboxes are regenerated. Native label wrapping
is a prediction from font advances, not certified Word shaping/kerning.

For this profile: body capacity644.9pt, header28.5pt, member68.4pt, total33.8pt.
Member cost comes from three exact17.3pt paragraphs +8pt top/bottom +source
border halves, not a measured PDF row or universal0.5pt correction. Label minima
include M1 inset and generated suffix: long label115pt, wrapped continuation
132.3pt. Repeated header and1twip separator charged per fragment; total once on
final fragment with members. Ordered gap-free whole-row coverage, label fit,
forward progress and nonnegative spare capacity are asserted. Search selects
cuts from these costs; no9-row/9-page rule or UAT/name special case is used.

### Observed final-run result and independent verification

| Source copy | Derived member cuts | Pages | Label lines source/continued |
| --- | --- | --- | --- |
| long80 |9/9/9/9/9/9/9/9/8|9|5/5|
| wrap17 +total153 |9/8|2|5/6|
| last20 +total210 |9/9/2|3|5/5|
| multi20 A/B/C +total210 |9/9/2|3|1/1|

Oracle worker512MiB/swap0, coordinator128MiB: exit0, OOMKilled=false,
oom_kill0; final peak69128192bytes (65.926MiB), initial peak69529600bytes
(66.309MiB). Inputs and original three container identities/start/restart counts
unchanged; no owned workers running. No SQL, original data or service operations.
All member SDTs/VML and non-Module cells preserved, source controls unique,
all other ZIP parts unchanged, CRC/XML/rels valid. Final node counts
27676/7299/8440/8470 remain within unchanged lab option300000.

AFTER producer completion and hashed output freeze, independent verification
compared final outputs with the previously owner-Word-verified MR0/E3R1 files.
All four WHOLE DOCX files are byte-identical, with hashes respectively
`a7f8181ef03c0fd1b91a28d8d598765dce75e4514831c5b584474118736579d1`,
`5829498c7136dd526a4f49ec12ed96712433a0e2b095f6efe6722b60419382ce`,
`8847192c38debd623c0d738d8372c12580e0c6b8e92391e0252d650559122e6c`,
`0fb352454eedc3d6b6d41963bf2393d4054e821616468e4854f8ca9102d76382`.
Prior native PDF hashes and member allocations were rechecked; existing visual/
clipping/total/wrap proof is reusable for these exact files. This is independent
convergence of source-only cuts with frozen native evidence, not feeding prior
cuts into the model or a fresh Word export. Source cost estimates are not claimed
identical to every native coordinate; observed twip/device rounding remains.

### Open MR1 criteria and proposed private fact contract

UAT is explicitly UNSUPPORTED_FLOW_CURSOR_REQUIRED, with no output: its95tables
and preceding paragraphs/sections do not fit this single-table profile. Half-
page capacity and100pt-smaller following-page capacity produce different cuts
in synthetic arithmetic probes; those probes do NOT prove Word preceding-flow,
multiple-section behavior or first/default header/footer extents.

Core implementation evidence: tables.ts163–198 builds native paragraphs and
TableRow without an explicit source-owned row-height/page-cursor contract;
text.ts142–147 retains native AtLeast where no exact source baseline applies.
SourceGuide data in source-layout.ts21–42 remains an intent-owned private
capsule. The proof extracts native DOCX/source-guide representation facts and
checks matching template/request; it does not expose Core checkpoint facts or
prove complete source/group/line ownership beyond preserved SDT lineage.

Before broader MR1 or any product mutation, proposed contract review must cover:
source section/group/row/line IDs, resolved font/fit hashes and confidence;
ordered source-flow cursor with consumed/remaining capacity; actual first/default
header/footer reservation/overlap; repeated-header/separator/total and per-label
suffix extents; whole-row eligibility and explicit tall-row/row-split failure.
Caller cuts, prior PDF page facts and a universal rounding correction stay out.
Unknown shaping/rounding or unbounded preceding blocks must fail closed rather
than silently generating partial continuation behavior. A renderer-neutral source
fact adapter may be needed; this is a proposal, not an approved Core change.

Status PASS_BOUNDED_SOURCE_ONLY_CUTS_WITH_REUSED_NATIVE_EVIDENCE_MR1_INCOMPLETE.
Four whole-row single-table copies are proven within their fixture/environment;
full MR1, native complex-flow proof, generic pagination and Core integration
remain open. Product heads42008134/db15e9d stayed clean/read-only. No merge,
push/release/install, original data/service changes or map promotion.


## MR1 source remaining-page contract — 2026-11-04

Owner authorized contract definition and a copy-only Oracle512MiB lab spike,
not product changes. Reusable proposal and bounded evidence are canonical in
`flowdoc-docx-source-flow-cursor-lab-contract-2026-11-04.md` (new document budget
justified by the source/spacing/ownership contract that must precede an adapter).
Role Planning Partner/Evidence Reviewer, Project Control Steward; inline IDs N/A.

The proposal separates source registry/snapshot, measured footprint confidence,
first/continuation frame reservations, ordered preceding-text/table replay,
pending spacing/reservations and derived cursor/checkpoint. The prefix subset
cannot accept caller remaining-height/page-cut overrides or promote estimates.
Generated structural items require an explicit derived-reference variant; they
must not impersonate new business source nodes. M1/Menu remain untouched.

Final artifacts are
`C:/Users/nekot/Documents/FlowDoc-recovery/docx-mr1-flow-contract-20261104/run2/`.
Strict schema,44synthetic acceptance/rejection cases and6checkpoint checks
passed in Oracle512MiB/swap0, coordinator128MiB; peak61599744bytes (58.746MiB),
exit0, no OOM. Independent dimensional arithmetic confirms402.2pt remaining
before a target after preceding text, spacing and a whole-fit table. The full
44cases are model/contract checks, NOT44native Word or real-UAT layout passes.
An isolated total-reservation probe checks one-time commitment, not a production
reservation transaction. Schema hash and locators are recorded in the contract.

Review preserved two confirmed initial lab-reducer failures (zero-height logical
roots incorrectly lost authored breaks/next spacing); final run tracks logical
progress separately and both added cases pass. Initial42-case results remain
historical/superseded. No Core bug or product fix is claimed from this lab repair.

Source inventory preserves M1 DOCX bytes and reads95tables,58mapped paragraphs /
63lines. Existing Core sections/root order/sourceMap and source-guide/band facts
must be projected by a genuine private adapter; no such adapter is implemented
by this contract. Real UAT cursor status remains NEEDS_SOURCE_FACTS. Native
preceding flow/section transitions, split handling, Word fit, actual bands and
renderer cancellation are not established by this lab. Full MR1 remains open.

Contract status: PASS_PROPOSED_CONTRACT_LAB_ONLY, ready for review and a separately
bounded source-adapter proof on copies. No DOCX output, PDF/renderer execution,
SQL, original data/service change, Core/Service edit, integration/merge,
push/release/install or map promotion. Product candidates remain clean.

## MR1 genuine Core read-adapter proof — 2026-11-04

Owner authorized the next copy-only source-adapter proof in Oracle512MiB,
preserving M1/Menu with no Core/Service edits or integration. Inline role:
Evidence Reviewer/Project Control Steward; execution IDs N/A. Proof budget:
one genuine UAT generation with a one-shot read observer and independent local
verification. Reuse the existing source-flow contract; no new shared document.

Artifacts:
`C:/Users/nekot/Documents/FlowDoc-recovery/docx-mr1-core-read-adapter-20261104`.
Detailed implementation/provenance, comparison limits and evidence locators are
in `flowdoc-docx-source-flow-cursor-lab-contract-2026-11-04.md`, section Genuine
Core read-adapter proof. An inspector observation reads the actual Core-branded
intent and built-section receipts without patching any Core/package file.

Read1section/179ordered roots/3315source-map entries/95tables/4grouped tables,
58applied guides/63lines and54owned derived between-table boundaries. Eight
in-worker checks pass; independent20checks cover the emitted source map,
immutable snapshots, XML/.rels and package/boundary evidence. Worker peak
333.758MiB, exit0, oom_kill0; no retry or OOM. All127tracked Core source files
and267compiled package files match immutable M1 inputs.

Initial remote comparison FAIL is retained: embedded fonts have new random
obfuscation GUIDs. Independent decoding confirms identical full font bytes;
167of171parts are byte-identical. Remaining differences are font GUIDs/their
first32obfuscated bytes and creation/modification timestamps. M1 geometry,
Menu textbox and source-map parts are preserved; whole-DOCX byte equality or a
fresh Word rendering is not claimed.

Status PASS_GENUINE_READ_ADAPTER_WITH_CURSOR_GAPS. This advances availability
of genuine facts beyond the preceding synthetic-only proof, but does not close
MR1. `remainingSafe:null`: native automatic row advances, preceding boundary/
keep projection, explicit total roles, bounded bands and special/split flows
remain unresolved. Next discovery should project/classify preceding-flow
footprints without promoting estimated capacities or unknown heights to exact.
Source/product/baseline inputs and original container identities stay unchanged;
Core42008134/Servicedb15e9d clean. No original data/service operation, SQL,
Core/Service change, merge/push/release/install or map promotion.

## MR1 source row/boundary constraint proof — 2026-11-04

Owner authorized one additional copy-only Oracle512MiB UAT generation to prove
row-height and inter-content facts, preserving M1/Menu without product edits.
Inline discovery role Evidence Reviewer/Project Control Steward, IDs N/A;
document budget reuse this plan and the existing source-flow contract.

Artifacts:
`C:/Users/nekot/Documents/FlowDoc-recovery/docx-mr1-row-boundary-proof-20261104`.
The source-flow contract's Genuine row and inter-content constraints section
records implementation anchors, raw JSON/script/receipt locators and limits.
Genuine cached Core/source observation matches95tables/181rows/526physical
cells,2104margin attributes,511ordinary text paragraph decisions and13guided
table line frames. All181native rows remain automatic without `w:trHeight`.
699cell flow paragraphs use AtLeast;13guided frames and4continuation-cell
structural paragraphs are Exact. These settings do not give native row heights.

54generated between-table paragraphs are Exact1pt with zero before/after.
Nine other table-paragraph-table adjacencies retain authored source ownership:
5headings,1break and3rules, including155pt/142pt authored before gaps. An initial
local verifier failed by treating all such adjacencies as generated separators;
the retained initial script and corrected source-owned comparison distinguish
them. No worker rerun or output/source modification. M1's three merged labels
retain8pt physical top+16pt first-label offset once; Menu markup stays unchanged.

Oracle worker peak366.5625MiB, swap0, exit0/no OOM,7033.290ms. Eight in-worker
checks and independent20base+11row/boundary checks pass.167of171package parts
are byte-identical to the previously reviewed M1; timestamps/font GUIDs explain
the remaining4with complete decoded fonts identical. No fresh Word/page fit or
clipping claim. Source/package/harness/baseline inputs and original container
identities unchanged; Core42008134/Servicedb15e9d clean, no owned worker running.

Status PASS_SOURCE_ROW_AND_BOUNDARY_CONSTRAINTS_NATIVE_HEIGHT_UNKNOWN.
Native row upper bounds and `remainingSafe` remain null: complete wrapping,
image/box/merge footprints and split/keep transitions are still missing. The
next bounded step is a complete row-footprint contract/proof with unsupported
cases, before replaying preceding flow. Full MR1 remains open. No original data/
service change, Core/Service edit, merge/push/release/install or map promotion.

## MR1 proposed row footprint/page-transition contract — 2026-11-04

Owner authorized contract-first design with copy-only Oracle512MiB validation,
preserving M1/Menu and excluding Core/Service edits/integration. Inline Planning
Partner/Evidence Reviewer, Project Control Steward; IDs N/A. Reuse the existing
source-flow contract for required text-wrap/image/merge/spacing/role facts,
span constraints and native-confidence/page-transition conditions.

Proposed private contract flowdoc-row-footprint/1 separates line/inline-image
flow from Menu word-box overlays, takes the maximum across ordinary cells, and
requires explicit valid row allocation under every merged-cell constraint.
M1's8pt+16pt label inset is included once in its span, not recharged per member.
Unknown wrapping/overflow/native upper bounds stop fit claims. Whole-row moves
recompute frame-specific headers/gaps/labels; allowBreak does not supply an
intra-row plan. Full split ownership/coverage, atomic images, keep/total and
continuation-label rules are proposed prerequisites, not implementation.

Artifacts:
`C:/Users/nekot/Documents/FlowDoc-recovery/docx-mr1-row-contract-20261104`.
Final run2 has45synthetic contract cases matching expected verdicts/extents in
Oracle512MiB/swap0; peak9.5859375MiB, exit0/no OOM. Independent15checks pass.
This small arithmetic checker does not measure full Core memory or native Word
rendering. Initial failed tuple-vs-JSON-array harness comparison is preserved;
one corrective run adds serialization before comparison with reducer unchanged.
No product repair or memory-limit increase.

The executable lab/1 subset handles an atomic row/keep group and unchanged
aggregate current/fresh overhead. It does not implement the full proposed
source/grid/role proof, differing page-class costs, row fragmentation, native
Word mapping, authentication or cancellation/checkpoint publication. The prior
genuine181row inventory stays byte-identical with unknown native upper bounds
and remainingSafe=null; it is not promoted by synthetic cases.

Status PASS_PROPOSED_ROW_CONTRACT_LAB_ONLY, ready for review. Next bounded work:
source-wrap/image/merge fact coverage and native-confidence proof on selected
rows before full preceding-flow replay. Full MR1 remains open. Core/Service
heads clean, M1 DOCX unchanged, original3container identities/start/restart counts
stable, no owned worker running. No new DOCX/PDF or renderer, original data/
service operation, Core/Service edit, merge/push/release/install or map promotion.

## MR1 genuine representative-row facts — 2026-11-04

Owner authorized representative text-wrap/image/merge proof on copies in
Oracle512MiB, preserving M1/Menu and excluding product edits/integration. Inline
Evidence Reviewer/Project Control Steward, IDs N/A. Proof budget one genuine
UAT generation plus independent checks; reuse this plan/source-flow contract.

Artifacts:
`C:/Users/nekot/Documents/FlowDoc-recovery/docx-mr1-representative-rows-20261104`.
The source-flow contract's Genuine representative text/image/merge facts section
records selection roles, source identities, coverage table and executable/raw
evidence locators. Actual intent observation covers7rows/5tables,24text blocks,
3guides/5line frames,2aggregate cached extents and5inline images, including a
3member Module merge. Text/line spans and inline media bytes/geometry match the
emitted DOCX; source/native widths and M1's8pt+16pt offset are checked.

Requirement text with8authored newlines has a Core cached11line/190.3pt aggregate
at212pt width key, but no line-range cursor. Module label has neither a guide
nor cached extent; ordinary peer/image-carrier bounds and merge allocation
are also incomplete. All7native row advances and remainingSafe remain null.
Do not infer row heights from paragraph count, image frame or aggregate text.

Oracle peak348.86328125MiB, swap0, exit0/no OOM,7009.196ms; one generation/no
retry. Eight in-worker checks and independent20base+11row+15representative
checks pass. M1/Menu content parts remain byte-identical to the reviewed M1;
timestamps/font obfuscation explain the4differing parts, decoded fonts identical.
No fresh Word/native fit/clipping assertion. Core/Service source/package inputs
and original container identities unchanged; candidates clean, no owned worker.

Status PASS_GENUINE_REPRESENTATIVE_FACTS_WITH_NATIVE_HEIGHT_GAPS, MR1 still open.
Next bounded discovery: Module/peer source line-flow facts, then carrier-inclusive
image/paragraph footprints, before complete native row bounds or page replay.
No original data/service operation, SQL, Core/Service edit, merge/push/release/
install or map promotion.

## MR1 Module/peer copied Core line plans — 2026-11-04

Owner authorized copy-only Oracle512MiB Module/peer wrap proof, preserving
M1/Menu without product changes/integration. Inline Evidence Reviewer/Project
Control Steward, IDs N/A. One genuine capture/generation then one independent
measurement worker, sequential512MiB/swap0 each; reuse the existing contract.

Artifacts:
`C:/Users/nekot/Documents/FlowDoc-recovery/docx-mr1-module-peer-wrap-20261104`.
The source-flow contract's Module and peer source line-plan proof section
records snapshots, unmodified Core entrypoints, exact coverage and limitations.
SourceLayout intentionally skips the merged Module, reason
native-merged-or-unresolved-cell; this is not a confirmed defect. Additional
lab measurement does not inject a guide or change native DOCX flow.

Unchanged Core measureText over13genuine captured text nodes/styles/widths gives
15source lines: Module26UTF16units at141pt fits one17.3pt line; Menu reproduces
the existing1/2/2line guides exactly;9ordinary peers each fit one source line.
All text/ranges/font identities and selected width fit checked. Source stacks
33.3/50.6/50.6pt sum134.5pt; Module overlay requires45.3pt once, not an extra row
charge. These are source constraints, not certified native row advances.

Generation peak354.796875MiB; separate measurement17.94921875MiB, runtime closed
after36shape calls/425UTF16units. Both exit0/no OOM, no retry. Independent12new
checks plus20base/11row/15representative checks pass. M1/Menu content preserved;
timestamps/font obfuscation explain non-content differences, decoded fonts equal.
No fresh native Word/PDF/fit/clipping test, no general long/empty/Unicode proof.

Status PASS_MODULE_PEER_CORE_LINE_PLANS_COPY_ONLY_NATIVE_HEIGHT_UNKNOWN.
Source-plan gap closed for these13copied sample blocks only. Native paragraph/
merged-row allocation and remainingSafe remain unresolved, full MR1 open. Next
bounded work: compare these source plans against native flow on the same span.
Core/Service candidates/source/package/harness/baseline unchanged; original
container identities stable; no owned workers running. No original data/service
operation, SQL, Core/Service edit, integration/merge/push/release/install or map
promotion.

## MR1 reused Word row comparison — 2026-11-04

Owner authorized native Word comparison on copies, preserving M1/Menu without
product edits/integration. Inline Evidence Reviewer/Project Control Steward,
IDs N/A. Reuse the already owner-exported M1 Word365 PDF and exact reviewed
DOCX, not a new export. Proof budget desktop extraction/render plus one isolated
Oracle512MiB comparison worker; reuse this plan and source-flow contract.

Artifacts:
`C:/Users/nekot/Documents/FlowDoc-recovery/docx-mr1-word-row-comparison-20261104`.
The contract's Reused native Word row comparison section records immutable
hashes, raw events, scripts, native image, numerical results and limitations.
Oracle image lacks a PDF parser; desktop bundled pdfplumber/PDFium reads the
existing page5 and Oracle validates immutable exported coordinates/text. No
installation or new native Word/Core generation. Word PDF is verification
evidence only, never an input to the source cut planner.

All13sample blocks match native/source line counts and line content ignoring
PDF-extraction whitespace: Module1, Menu1/2/2, peers1each. Rendered crop inspected,
no visible clipping in this group. Actual native stroke-center row heights are
33.84/51.00/51.15pt versus source stacks33.30/50.60/50.60pt: differences
0.54/0.40/0.55pt, sum1.49pt. These source/native reference quantities are not
interchangeable. No confirmed cause or universal correction is established.

Oracle22sample+independent11checks pass, worker512MiB/swap0, peak13.8203125MiB,
exit0/no OOM. Peak covers comparison only, not desktop extraction or Core.
Source inputs/baseline/product candidates unchanged; original container
identities stable, no owned worker running. Status
PASS_REUSED_WORD_SAMPLE_COMPARISON_WITH_ROW_DELTAS. Sample line-agreement gap
closed; safe native upper-bound model/remainingSafe and full MR1 remain open.
Next bounded work: resolve native reference-plane/paragraph/stroke contribution
to the observed residual before applying a row bound. No original data/service
operation, SQL, Core/Service edit, integration/merge/push/release/install or map
promotion.

## MR1 controlled native border-cause proof — 2026-11-04

Owner authorized copy-only residual-cause proof in Oracle512MiB, preserving
M1/Menu and excluding product/original data/service changes/integration. Inline
Evidence Reviewer/Project Control Steward, IDs N/A. Reuse existing contract/plan;
two final Oracle phases, four native desktop Word exports, independent review.

Artifacts:
`C:/Users/nekot/Documents/FlowDoc-recovery/docx-mr1-row-delta-cause-20261104`.
The source-flow contract's Controlled native Word border-cause experiment
section records controlled copy changes, native API version, raw events,
reference-plane definition, retained failures and complete evidence locators.
Installed Word20527 exports read-only copies on desktop; Oracle builds/checks
copies/events under512MiB. The cap does not include desktop Word or PDF parsing.

All4copies retain text/Menu textbox bytes and M1 top8pt+before16pt. Common
numeric-cell markers are proven geometry-neutral against the original Word PDF.
A/control native span135.99001pt; B/zero-border134.55pt; C/1pt-border137.55pt;
D/ten ordinary AtLeast-toExact paragraphs135.99001pt. All13blocks retain source
line membership; target crops visually inspected without clipping. D shifts
ordinary glyph baselines and is not a proposed product change.

Confirmed:1.44001of1.49001pt is the border/reference-plane component omitted
from the source-stack comparison. A paints about0.48pt per row; B removes this
component while preserving total interior. D excludes ordinary AtLeast expansion
as row-height cause for this sample. Residual0.05pt is localized to native
interior mapping, but its internal algorithm remains Unverified. C redistributes
interior by0.12pt, so no universal+0.5pt/residual correction or Core defect claim.
Word Cell.Height's automatic9999999values are unusable, not actual measurements.

Final Oracle peaks127.09765625MiB build/41.26953125MiB comparison, swap0,
exit0/no OOM. Ten analysis+8independent checks pass. Failed ZipInfo metadata and
overstrict PDF-coordinate precision checks remain archived; corrective lab-only
runs do not alter source files, native PDFs or product code. Original baselines/
container identities unchanged, product candidates clean, no owned lab workers.

Status PASS_CONFIRMED_BORDER_COMPONENT_WITH_UNVERIFIED_INTERIOR_RESIDUAL.
Next bounded decision: define native stroke/reference-plane ownership and handle
the remaining native-interior uncertainty before a safe row bound. RemainingSafe
null/full MR1 open. No original data/service operation, SQL, Core/Service edit,
integration/merge/push/release/install or map promotion.

## MR1 native origin-dependent interior residual — 2026-11-04

Owner authorized remaining0.05pt proof on copies, preserving M1/Menu, no product
or original data/service changes/integration. Inline Evidence Reviewer/Project
Control Steward, IDs N/A; one Oracle copy-build, four desktop native Word exports
and one Oracle comparison worker. Reuse this plan and source-flow contract.

Artifacts:
`C:/Users/nekot/Documents/FlowDoc-recovery/docx-mr1-interior-origin-proof-20261104`.
The contract's Native page-origin sensitivity section records controlled changes,
exact PDF operators, scripts/receipts, native crops and remaining limitations.
Only section top margin changes by0/1/2/3twips. Y0 is byte-identical to the prior
marked control; every cell/text/style/border/M1/Menu property stays identical.

Four native Word20527 exports retain72pages and all13line memberships. Interior
sums are134.55/134.67/134.55/134.55pt against unchanged134.50pt source stack,
giving residuals0.05/0.17/0.05/0.05pt. One0.05pt origin perturbation changes the
native residual by0.12pt. Decimal arithmetic on literal PDF rectangle operands
and independent PDF-reader agreement exclude Python binary-float/OCR artifacts.
Confirmed: residual is native position/coordinate-phase dependent, not a justified
fixed missing-content correction. The exact internal split between Word layout
grid and painting/PDF export remains Unverified; no universal0.05/0.12/0.17bound.

Seven Oracle+9independent checks pass; four target crops inspected without visible
truncation. Oracle512MiB/swap0, peaks59.78125MiB build/41.5859375MiB analysis,
exit0/no OOM, no reruns. Desktop Word/PDF parsing is outside those peaks. Original
baselines/container identities stable, candidates clean, no owned lab workers.

Status PASS_NATIVE_ORIGIN_DEPENDENCE_AND_EXACT_DECIMAL_CHECK. Native-profile/
frame/origin-aware bounds remain necessary before a safe cursor; remainingSafe
null/full MR1 open. No original data/service operation, SQL, Core/Service edit,
integration/merge/push/release/install or map promotion.

## MR1 row-height interval plan after the Word origin probes — 2026-11-04

Status: PLAN READY FOR REVIEW; no new experiment or product implementation.
Owner request: plan safe row-height intervals from the retained Word evidence,
preserving M1 and Menu textbox, Oracle512MiB per worker, no original data/service
operation or integration. Project Control owns this plan; Core owns any eventual
adapter. Active role Planning Partner/Evidence Reviewer, prose stewardship here;
single-room IDs N/A. Work size small planning increment, risk routine: no runtime
change authorized. A wrong future upper bound could cause false page fits, so
the acceptance gate below stays strict. Reuse the two current documents and
immutable evidence; no new Work/registry/map or product-repository Markdown.
The generated snapshot is dated2026-10-04 and concerns another workstream; it
does not override this request or the current MR1 contract/evidence sections.

### Decision: scoped intervals, with unknown outside justified coverage

Reject a universal +0.05pt correction and reject using the observed maximum
+0.17pt as a safety margin. Also defer a full Word-compatible pagination engine:
the present evidence does not justify that scope. Proposed approach: separate
source arithmetic, native painted observations and predictive flow bounds;
bind every bound to its supported profile and explicit proof obligation.
No assumption of a0.12pt periodic grid, independence or cancelling row errors.

The current four probes establish only these observed painted-interior ranges:

| Quantity | Observed interval pt | Meaning |
| --- | ---: | --- |
| Member1 |[33.24,33.36] |Same first member in four origin probes |
| Member2 |[50.52,50.64] |Same second member in four origin probes |
| Member3 |[50.55,50.67] |Same third member in four origin probes |
| Actual three-member interior sum |[134.55,134.67] |Joint observations, source stack134.50 |
| Sum of separate member intervals |[134.31,134.67] |Conservative hull of those observations only |

These are neither native layout-advance guarantees nor bounds for another row,
page origin, group length, document or Word build. Lower values can be below
source stacks; do not clamp signed residuals to zero. The joint group range must
not be reused for an arbitrary subset or repeated per row. The prior approximately
1.44pt border contribution is also sample-specific, not a fixed group charge.

### Proposed bound record and accounting rules

Keep this a private lab proposal, not a Core/Service API. Each record binds:

- source snapshot/map, row and fragment identities, measurement revision;
- Word executable/build, compatibility/settings, exact font files/digests,
  section/frame and table policy, M1/Menu revision and tested origin domain;
- quantity/reference plane: source stack, painted interior, stroke-center
  interval, outer fragment envelope or predictive flow advance; never mix them;
- integer micro-point [lo,hi], outward rounding and evidence/proof locator;
- qualification: observed-only, justified-profile-bound or unknown, with covered
  input domain and limitations. The second status requires an explicit bound
  derivation or exhaustive finite-domain coverage, not a sampled maximum.

Preserve the contract's confidence vocabulary: source arithmetic remains
exact-source where justified; observed-only native data stays estimated for
prediction. Only a justified predictive interval may become bounded-source for
the cursor. Exact decimal PDF operands establish painted coordinates, not exact
Word layout extents or glyph ink. Extraction comparison tolerance0.00003pt is
a verifier tolerance for the existing evidence, not a native layout allowance.

Assign every border/gap one ledger owner, keyed by physical boundary and its
plane conversion. Reconcile internal shared boundaries, fragment top/bottom,
header/body/total interfaces and continuation boundaries once; do not charge
the same stroke in two rows or omit outer edges. Establish this conversion
before adding interior and border intervals. Keep terminal cell paragraphs,
spacing and textbox anchor effects explicit, not absorbed into an unexplained
epsilon. M1's8pt physical top and16pt before apply once per visible Module label;
the label shares the member area and is not extra member-row advance.

Accumulate row advances with outward interval arithmetic, including preceding
flow, repeated header, total and disjoint reservations. Preserve correlation
when justified; otherwise add individual upper bounds without cancellation.
For merged labels require member-area lower bound >= label-extent upper bound
in the same plane. Existing remainingSafe formulas still apply. A justified
upper cost <= safe capacity permits a model fit; a justified lower cost above
capacity permits no-fit; overlap/unsupported/missing bounds return
NEEDS_SOURCE_FACTS, remainingSafe=null where the prefix itself is unresolved.
Unknown must never become zero, an invented margin or a forced break decision.

### Bounded discovery sequence; future execution requires owner authorization

- [x] **HB0 — Reconcile existing observations, no new Word export.** On copies
  under a new lab artifact directory, replay the four origin probes plus the
  earlier border controls. Produce a row/boundary ledger and the bound-record
  proposal above. Verify the table's individual/joint ranges, outer-edge closure,
  signed residuals, no double charges and stale/profile mismatch rejection.
  Oracle512MiB worker, existing pinned runtime/image, no Core/Service build.
  Gate: every observed measurement reconciles; undocumented native conversion
  remains unknown. Stop for review if a predictive bound cannot yet be derived.
- [ ] **HB1 — Challenge a derivation, not fit a constant.** Only after HB0 yields
  a concrete, reviewable bound argument and supported domain, freeze it before
  native holdouts. Budget at most8 desktop Word exports: fresh unchanged control;
  three origin-only probes +4/+7/+11twips relative to the original; one short
  final-fragment case; one80-member continuation; one wrapped-"ต่อ" plus total;
  one preceding-text/table case near the predicted page boundary. Reuse existing
  fixtures where possible, keep M1/Menu unchanged, and prepare source-based
  expectations before export. Origins challenge a proposed model, not prove an
  assumed period. Bind source hashes and all intentional copy differences.
  Check all relevant fragment edges, line membership, row/label coverage, totals,
  page transitions and visual clipping. PDFs are comparison evidence only, never
  page-cut input. If a bound is exceeded, FAIL and return to review; do not tune
  and call the same holdout an independent pass or automatically add exports.
- [ ] **HB2 — Prove decision behavior in a lab-only replay.** For any justified
  intervals test capacity just below lo, inside [lo,hi], and just above hi using
  integer micro-points; exact equality with hi must follow the defined fit rule.
  Include many-row accumulated error, shared borders, first/continuation frames,
  header/total ownership, preceding text/table gaps, M1 once, empty cells, unknown
  images/metrics, stale fonts/profile and interval overlap. No false-fit verdict;
  unsupported cases must stay unresolved. Physical near-page behavior in HB1
  is separate from these arithmetic tests. A replay PASS alone is not native
  Word pagination acceptance or permission to implement the adapter.

### Acceptance, resources and stopping rule

This planning increment passes when evidence versus proposals are distinct,
bound provenance/planes/ownership and rejection behavior are specified, staged
proof is finite, and product edits remain excluded. Review formulas/units,
evidence locators, final diff and whitespace; no runtime suite needed for this
prose-only increment. Reuse prior results only within their documented scope.

Future lab budget: HB0 one worker; HB1 at most one copy-build and one analysis
worker plus8 native exports; HB2 one replay worker, sequential.512MiB per worker,
swap0, coordinator128MiB unchanged; stop on OOM, preserve receipt and review,
never raise memory/limits or retry automatically. Native Word and PDF parsing
remain desktop work outside that cap. Pin the environment anew before execution.
No live SQL/API/storage or original service control is required by this plan.

A future discovery PASS needs a justified domain-specific bound, holdout coverage,
ledger closure and honest unknowns. Finite successful samples alone only earn
an observed envelope. If the derivation is unavailable, the valid result is
RISK/UNKNOWN with remainingSafe=null; stop rather than pursue unlimited rounding
experiments. Full MR1 remains open. No Core/Service code, original data/service,
merge/push/release/install, or shared map promotion is authorized here.

Planning review complete: the interval table was independently recalculated
from the retained Oracle result, individual extrema and hull arithmetic agree;
scope/units/decision gates reviewed and git diff --check passes. Only these two
Project Control prose files change; no Oracle/Word runtime test was run anew.

## HB0 accounting complete; predictive promotion blocked — 2026-11-05

Owner authorized only HB0 in Oracle512MiB, retained M1/Menu, no new Word export
or product/original data/service changes/integration. Inline discovery Evidence
Reviewer/Project Control Steward, IDs N/A; no new registered round or map truth.
The source-flow contract's "HB0 retained row/border ledger replay" section owns
the complete result, artifacts, original failure/collection correction and gaps.

Artifact root:
`C:/Users/nekot/Documents/FlowDoc-recovery/docx-mr1-hb0-ledger-20261105`.
All8retained cases close their row/fragment ledgers. One shared-stroke owner
allocates half to adjacent rows; center span and outer painted span differ by
the remaining outer halves. Original-control interior134.55pt / center135.99001pt
/ outer136.47pt stay distinct. Signed coordinate bridges and negative residuals
are explicit. Observed joint range[134.55,134.67] differs from separate-row hull
[134.31,134.67]; neither becomes a predictive native-flow guarantee.

Oracle15checks/10initial mutation rejections pass; independent10checks confirm
the ledger and reveal a lab-only prototype guard gap: a forged qualification
string can bypass its predictive branch without accepted proof. This is not
a Core/Service finding. Actual records stay observed-only; no predictive bound
or safe cursor was emitted. Do not adopt this validator. A trusted immutable
accepted derivation/coverage record must gate promotion, and none exists now;
this contract revision remains unimplemented/unverified on Oracle.

HB0 accounting complete, with predictive-bound/schema readiness RISK/UNKNOWN;
HB1Ready=false, remainingSafe=null/full MR1 open. Do not proceed to HB1 merely
because accounting passes. Next review must address the trusted-proof gate and
justify source-to-native-flow bounds or explicitly retain unsupported status.
No new native experiments or implementation are authorized by this result.

One512MiB/swap0 worker, coordinator128MiB, peak19.390625MiB, exit0/no OOM or
Oracle retries. Desktop archive collection needed a Python3.10 compatibility
correction only; worker evidence was reused unchanged. All18original DOCX/PDF
hashes and original3container identities stable; product candidates clean.
No Word/PDF processing, live SQL/API/storage, original service control,
Core/Service edit, integration/merge/push/release/install or map promotion.

## HB0 prototype evidence-gate gap closed in isolated lab — 2026-11-05

Owner authorized the lab-only repair and Oracle512MiB tests, preserving M1/Menu,
no new Word export or Core/Service/original data/service changes/integration.
Inline lab implementation/Evidence Reviewer and Project Control stewardship,
IDs N/A. The contract's "HB0 lab evidence gate repaired and Linux-verified"
section owns the full implementation boundary, test coverage and evidence.

Artifacts:
`C:/Users/nekot/Documents/FlowDoc-recovery/docx-mr1-hb0-proof-gate-fix-20261105`.
Old AST regression fails on label-only promotion before the repair. The new
gate verifies operator-pinned artifacts and observation-only review, replays
raw coordinate-derived intervals, and binds document/plan/M1/Word/plane/rows/
origin and endpoints. Caller labels, evidence paths, proof IDs or rehashed files
cannot grant native prediction. Genuine retained evidence yields observation
acceptance only. No accepted native-flow proof/verifier exists, so predictive
requests remain rejected; no hypothetical future native-bound checker is claimed.

Oracle37tests pass (6positive/31rejections), including internally consistent
hashes with false derivations or wrong proof/review purpose. Independent12checks
confirm results and original boundaries. One512MiB/swap0 worker, coordinator
128MiB, peak18.9140625MiB, exit0/no OOM, no Oracle retries. Local archive
collection succeeds without rerun. All18original files, product heads/clean
state and original3container identities remain unchanged.

The earlier HB0 lab qualification-forgery defect is now closed in this candidate;
the actual source-to-native-flow bound remains UNKNOWN. PredictiveBound and
remainingSafe remain null, HB1Ready=false/full MR1 open. Operator-pinned read-only
inputs are a bounded lab trust assumption, not writer authentication or product
integration. No new Word/PDF processing, Core/Service edit, original live
SQL/API/storage/service operation, merge/push/release/install or map promotion.
