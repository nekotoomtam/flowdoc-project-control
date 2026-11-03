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
