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

- [ ] Add a regression that reproduces the exact8193-request failure before
  implementation, then proves successful completion of measurement within
  the unchanged limits, with equivalent measured output for eligible cases.
- [ ] Implement only the R0-proven strategy in the actual measurement owner;
  preserve guarded fallback, failure and cancellation behavior. Core is owner;
  Service changes are unnecessary unless separate evidence proves otherwise.
- [ ] Re-run affected line/source-layout/reading-plan/Word regressions, then
  the1800 case under512MiB. Stop OOM; record the next actual gate and its counters
  rather than claiming XML success when only measurement passes.

### R2 — prove and implement native generated-style sharing

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
