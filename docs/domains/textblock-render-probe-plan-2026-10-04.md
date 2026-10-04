# แผนรอบแรก: เลือกตัววาด TextBlock และวัดต้นทุนหลาย node

> For agentic workers: use superpowers:executing-plans inline, task by task.
> No subagent dispatch. Checkboxes record actual completion, not intent.

## Authority Boundary

Owner: Project Control. Role: Planning Partner. เป็นแผนข้ามขอบเขต Core/Editor
สำหรับการทดลองแบบจำกัด ยังไม่ใช่หลักฐานว่าผลิตภัณฑ์พร้อมใช้หรือ WYSIWYG gate ผ่าน
ใช้แบบที่เจ้าของอนุมัติ: [TextBlock single surface](textblock-single-surface-design-2026-10-04.md)
รอบนี้ไม่เปิด execution เก่าที่ cancelled; Phase/Checklist/registry IDs: N/A.

**Goal:** เลือกวิธีวาดข้อความจาก Core ที่รักษาภาพเดียวกันตอนดู/แก้
และมีต้นทุนเหมาะกับหลาย node ก่อนต่อ input และ persistence จริง

**Architecture:** Core สร้าง frame ชุดเดียวให้ Canvas และ SVG วาดเปรียบเทียบ
การเปลี่ยนสถานะเลือกเพิ่ม overlay เท่านั้น ตัวทดลองอยู่แยกจากหน้าเอกสารผู้ใช้
เมื่อได้ผล จะกำหนดตัววาดและงบ cache ในแผน implementation ถัดไป

**Tech Stack:** TypeScript, React, Vitest, browser Canvas2D/SVG, Core adapter เดิม
ไม่เพิ่ม editor framework หรือ dependency สำหรับ benchmark

## ขอบเขตและข้อจำกัด

- ขนาดงาน medium; risk routine สำหรับ probe ที่ไม่แก้เอกสารผู้ใช้
- เจ้าของโค้ด Editor; Core อ่านผ่าน coreAdapter และ API ที่มีอยู่
- อ่าน AGENTS ของ Editor และตรวจ HEAD/สถานะก่อนเริ่ม
- ใช้ checkout แยกเมื่อการเปลี่ยนแปลงอาจรบกวน Vite4017 หรือ draft ของผู้ใช้
  ตรวจ worktree ที่แนบอยู่ก่อนสร้างใหม่; ห้ามย้าย/ลบ local diagnostics เดิม
- ห้าม reload, reset, seed ทับ หรือ restart server ที่ผู้ใช้มีข้อความค้างอยู่
- ห้ามแก้ Core/Backend semantics, main ผลิตภัณฑ์, save path, word-break policy
- หาก API เดิมวาด frame ไม่ได้ ให้รายงานข้อจำกัดและกำหนดงาน Core เพิ่ม
  ห้ามแก้ semantics เงียบ ๆ เพื่อให้ benchmark รันผ่าน
- หลักฐานอยู่ในไฟล์ผลทดลองที่ระบุ candidate/runtime/font identities
  หนึ่งสรุปผลในเอกสารนี้เพียงพอ ไม่สร้าง audit หรือ DOCUMENT_MAP
- ผล probe ไม่แทนการทดสอบแป้นจริง, IME, accessibility หรือ editor readiness

## Review Focus

1. ฟอนต์ไม่ตรงกับ glyph IDs: ต้องปฏิเสธหรือโหลด asset ชุดถูกต้อง
2. ภาษาไทย สระซ้อน อีโมจิ และบรรทัดว่าง: ไม่ตัด corpus กลางกลุ่มอักษร
3. zoom/DPR และ border: ไม่เปลี่ยนความกว้าง authored content ตอนเลือก
4. สลับ node/เลื่อนกลับซ้ำ: session/cache ไม่สะสมโดยไร้ขอบเขต
5. กล่องสูงเปลี่ยน: เลื่อน node อื่นได้โดยไม่ shape ข้อความเดิมซ้ำ

## ชุดวัดที่ตรึงไว้

เมทริกซ์ 3 x 3: 300/900/1,800 กลุ่มอักษรต่อ node กับ 1/20/100 node
ใช้ corpus ไทยที่มีความหมายผสม Latin และ corpus คำยาวไม่มีช่องว่างแยกกัน
fixture บันทึกข้อความจริง, UTF-16 length, code-point count, grapheme count
และ hash; ใช้ fixture เดิมทั้งสองตัววาดและทุกรอบ ไม่สร้างข้อความสุ่มใหม่
มี fixture correctness ขนาดเล็กแยกสำหรับ emoji/combining marks/empty lines
การแบ่ง grapheme เกิดตอนสร้าง fixture ไม่รันซ้ำใน timed loop

กำหนด content width 432pt, Sarabun Regular 12pt ตามข้อจำกัด bridge ปัจจุบัน
บันทึก line height ที่ frame ให้จริง ไม่ให้ตัววาดคิดบรรทัดเอง
viewport 1280x900 CSS px; zoom100%; บันทึก DPR จริงและทดสอบ parity ที่ zoom125%
node หลายตัวใช้ข้อความเหมือนกันแต่คนละ ID; frame ต่อ node นับเป็นคนละรายการ
แยก cold asset/layout time จาก warm paint/update time
จำนวน warm-up 3 รอบและ measured 10 รอบต่อกรณี ใช้ลำดับสลับ Canvas/SVG
ถ้าช่วงค่าแกว่งจนจัดอันดับไม่ได้ รายงาน inconclusive ไม่เพิ่มรอบไปเรื่อย ๆ

## Task 1: สร้าง corpus และ runner ที่ทำซ้ำได้

**ไฟล์ใหม่ใน Editor (ชื่อเสนอสำหรับรอบทดลอง):**
- src/editor/textBlockRenderProbe/corpus.ts
- src/editor/textBlockRenderProbe/probeTypes.ts
- src/tests/textBlockRenderProbeCorpus.test.ts

**Interfaces:**
- `createProbeCorpus(size: 300 | 900 | 1800, kind: 'mixed' | 'unbroken'): ProbeCorpus`
- `ProbeCorpus`: text, graphemeCount, utf16Length, codePointCount, fixtureId
- `ProbeCase`: corpus, nodeCount (1 | 20 | 100), contentWidthPt (432)
- Core frame type ใช้ exported type จาก coreAdapter; ห้ามสร้าง geometry model คู่ขนาน

- [ ] ทดสอบจำนวน/ข้อความคงที่และไม่ตัดสระหรือ surrogate pair; รันให้เห็น failure
- [ ] สร้าง fixture และ metadata ตาม interface ข้างต้น
- [ ] รัน `npm test -- src/tests/textBlockRenderProbeCorpus.test.ts`
- [ ] ผลผ่านจึง commit เฉพาะไฟล์รอบนี้

## Task 2: ตัววาดสองแบบจาก frame เดียวกัน

**ไฟล์ใหม่ใน Editor:**
- src/editor/textBlockRenderProbe/canvasPainter.ts
- src/editor/textBlockRenderProbe/svgPainter.ts
- src/editor/textBlockRenderProbe/frameFixture.ts
- src/tests/textBlockRenderProbePainter.test.ts

**Interfaces:**
- `paintCanvasFrame(context, frame, outlines, transform): PaintStats`
- `buildSvgFrame(frame, outlines, transform): SvgFrame`
- `PaintStats`: glyphCount, drawCount; `SvgFrame`: paths grouped by paint style
- transform ระบุ scale และ origin; glyph offsets/advances มาจาก frame เท่านั้น
- ใช้ glyph outlines จาก provider ที่ตรงกับฟอนต์ ไม่ใช้ fillText จัดรูปซ้ำ
- เส้นทาง SVG รวม path ตาม style; ห้ามสร้าง React element ต่อ glyph

- [ ] เขียน failure tests สำหรับ origin/scale, empty glyph และ font identity mismatch
- [ ] ใช้ Core API ผ่าน adapter สร้าง frame fixture; ไม่ import controller/render loop ของ trial
- [ ] ทำ painter ทั้งสองและตรวจ geometry bounds/จำนวน glyph ตรง frame
- [ ] รัน painter tests กับ corpus tests และ `npm run type-check`
- [ ] commit หลังผลผ่าน; unit tests ยังไม่พิสูจน์ภาพจริง

## Task 3: หน้า probe แยกและการวัดหลาย node

**ไฟล์ใหม่ใน Editor:**
- text-block-render-probe.local.html
- src/editor/textBlockRenderProbe/main.tsx
- src/editor/textBlockRenderProbe/runner.ts
- src/tests/textBlockRenderProbeRunner.test.ts

**Interfaces:**
- `runProbe(case, backend: 'canvas' | 'svg'): Promise<ProbeResult>`
- result เก็บ fixture/font/runtime/commit IDs, viewport/DPR, cold/warm timings,
  layoutCalls, paintCalls, liveSessionCount, mountedNodeCount, cacheEntries
- เวลาแยก layout, paint submission และ next-frame wait; ไม่เรียก rAF ว่าเวลาภาพขึ้นจอ
- memory ใช้ข้อมูลที่ browser เปิดให้เท่านั้น; หากไม่มีระบุ unavailable
  resource counters ไม่ใช่จำนวน byte ของหน่วยความจำจริง

- [ ] ทดสอบ runner แยก warm-up/measured, reset counters และ cleanup ใน failure
- [ ] สร้างหน้าเลือก case/backend, เริ่มรอบ และ export JSON โดยไม่ต่อ Backend
- [ ] แสดงเฉพาะช่วงมองเห็นพร้อม overscan และ placeholder heights จาก fixture
- [ ] เปลี่ยน overlay ต้องเพิ่ม layoutCalls=0; เคลื่อนกล่องที่ข้อความไม่เปลี่ยนเช่นกัน
- [ ] เลื่อนครบ100nodeแล้วกลับต้นซ้ำ20ครั้ง ตรวจ resource count กลับขอบเขตเดิม
- [ ] รัน runner tests, type-check และ build; ตรวจ diff ก่อนเริ่ม browser verification
- [ ] ตรวจภาพทั้งสองแบบที่ zoom100%/125% และเลือก/ยกเลิกเลือกผ่าน CUA
- [ ] รันเมทริกซ์ที่กำหนดและ export ผลนอก repository ใต้ profiling directory ใหม่

## Task 4: ตัดสินใจและปิด probe

- [ ] ตรวจ coverage: ทั้ง9ขนาด, สองcorpus, สองpainter และ correctness fixtures
- [ ] คัดตัวที่ภาพ/ตำแหน่งผิดออกก่อนเปรียบเทียบความเร็ว
- [ ] เทียบ warm timings กับ layout/paint counts; ระบุ browser/machine ที่วัด
- [ ] เลือก painter ด้วยผลจริง หากสูสีใช้ความเรียบง่ายและต้นทุน lifecycle ตัดสิน
- [ ] กำหนด cache budget เป็นตัวเลขพร้อมหน่วยจากผล resource measurement;
  ถ้าวัด bytes ไม่ได้ให้ใช้ขอบเขตจำนวน frame/glyph และบอกข้อจำกัด
- [ ] เก็บผล/ข้อจำกัดและตัวเลือกในเอกสารนี้ อ้างไฟล์ JSON/screenshot และ commit
- [ ] เตรียมแผนถัดไปสำหรับ retained bridge + input + draft/save ตามแบบที่ผ่านแล้ว

## เกณฑ์ปิดงานและสิ่งที่ยังไม่อ้าง

จบเมื่อมีผลเปรียบเทียบที่ตรวจย้อนกลับได้และตัดสินตัววาด/งบcacheได้
หรือพบข้อจำกัด API ที่ชัดเจนพอจะกำหนดงานแก้เฉพาะจุด ไม่ต้องทดลองแบบที่สาม
ไม่อ้างว่า100nodeหรือ1,800ตัวอักษรพิมพ์ลื่นจาก paint-only probe
การต่อ input, physical-key tests, draft retention และ Columns ยังเป็นงานถัดไป

สถานะ: ปิด probe แบบมีข้อจำกัดตามผลด้านล่าง 2026-10-04; execution inline

## Execution ledger

- Task 1 complete: Editor a8b20ca; corpus 7 tests RED (missing module) -> GREEN.
- Task 2 complete: Editor 35b9317; combined corpus/painter 9 tests GREEN,
  type-check PASS. Baseline glyph/assets 3 tests PASS. Painter test RED captured.
- Task 3 complete with documented coverage limits: runner tests RED -> 11 combined tests GREEN; browser probe
  separate HTML on existing isolated Editor worktree, no imports from live app.
- Ruling: reuse existing isolated checkout; new probe-only modules cannot change
  the user's document route. Native managed worktree tool targets Project Control,
  so no unrelated checkout was created. User tab/document remains untouched.
- Ruling: share existing asset loader (not trial controller or render loop).
  Probe remains development-only; normal production build keeps trial gate closed.
- Ruling: Canvas and SVG use a common outline-to-path compiler to avoid a geometry
  confound. Timings include path construction and full visible-window remount,
  not incremental active-node updates. Do not extrapolate them to typing latency.
- Ruling: run 20 full traversals only for mixed/1800/100 per backend; other matrix
  cases one traversal. LRU test additionally covers20x100 accesses. Initial broader
  traversal attempt discarded; retained partial files are not final evidence.
- Known difference: window traversal uses known equal-height fixtures, not native
  scroll/variable-height placeholders. Cache8 is an experimental capacity, not an
  empirically accepted product byte budget. Memory bytes unavailable.
- Core raw session fixture check: empty text and Thai/combining marks create frames;
  emoji and raw newlines reject unsupported-font-script. This is not a claim that
  the TextBlock explicit-break bridge is unsupported; that path is outside probe.
- No subagents: approved plan explicitly uses inline execution without dispatch.
- Owner decision 2026-10-04: reduce full-node traversals to one for all36cases;
  retain20x100 pure cache test and explicitly leave long-run native memory
  unverified. Owner approved after measured cold1800frame cost about0.3s made
  repeated traversals disproportionate. Sixteen completed cases retained in
  profiling/textblock-render-probe/resume.json; remaining cases continue without
  rerunning unchanged measurements. Interrupted stress case is not counted.

## ผลปิดรอบ 2026-10-04

Task1–4 ปิดในขอบเขต probe ที่ปรับตาม owner decision แล้ว ข้อจำกัดด้าน
native scrolling และหน่วยความจำจริงยังไม่ใช่ PASS และไม่ได้ถูกยกเลิกไป
รายการ checklist ด้านบนเป็นขั้นตอนแผนต้นฉบับ; ledger และผลส่วนนี้เป็นสถานะจริง

**ตัวเลือกถัดไป: SVG รวม path ตามสี** เป็นตัวตั้งต้นสำหรับ Paragraph slice
ผล median paint-submission ต่ำกว่า Canvas15จาก18คู่ ไม่ใช่เร็วกว่าเสมอ
ใช้ painter interface เดิมเพื่อเปลี่ยน backend ได้หากงานจริงให้ผลต่าง
ห้ามนำตัวเลข full-window remount นี้ไปอ้างเป็นเวลาพิมพ์หรือ screen-paint latency

**ขอบเขต cache ตั้งต้น: 8 frame ต่อ view ของการทดลอง** จากการแสดงสูงสุด6node
รวม overscan ในชุดนี้ เหลือ2ช่องสำหรับการเลื่อนช่วงใกล้เคียง เป็นขอบเขตจำนวน
ไม่ใช่งบbytesที่ผ่านการพิสูจน์ การใช้งานจริงต้องเพิ่ม active-node pin และ
การเก็บ path/ภาพของ node ที่ไม่เปลี่ยน เพื่อไม่สร้าง path ทุกครั้งเหมือน probe

| ชุดข้อความผสม | node | Canvas median ms | SVG median ms |
| --- | ---: | ---: | ---: |
| 300 | 1 | 9.75 | 10.25 |
| 900 | 1 | 40.55 | 34.80 |
| 1800 | 1 | 82.40 | 58.50 |
| 1800 | 100 (แสดงพร้อมกัน4) | 315.65 | 231.70 |

ค่าด้านบนรวมการสร้าง path และ remount ช่วงที่แสดง ไม่รวม Core layout
ใน warm loop; 100node ไม่ได้หมายถึงวาด100พร้อมกัน ผลทั้งหมดใน summary.json
มี3คู่ที่Canvasต่ำกว่า รวมกรณีunbroken300/100ที่ต่างมาก จึงไม่อ้างอันดับสากล
หรือผลproductionจากการทดลองบน Vite development mode นี้

### หลักฐานและ coverage

- Editor commits: a8b20ca,35b9317,d02445b,e462da4 บน codex/core-editor-trial-20261004
- Core unchanged a47cd4b26c3fcc22dc798406d574680871427ab5; Backend unchanged
- Focused tests11 PASS; baseline glyph/assets3 PASS; type-check PASS
- Application build PASS (existing chunk warning); probe entry compilation PASS
  แต่ production runtime gate ยังปิดตามเดิม ไม่อ้างว่า probe ใช้ใน production ได้
- Browser:36 uniquecases = 2corpora x3sizes x3nodecounts x2painters,
  3warmups+10samples, one forward/back traversal percase, viewport1280x900
- ทุกกรณี warmExtraLayouts=0, overlayExtraLayouts=0, cachePeak<=8,
  cacheAfterCleanup=0, mountedAfterCleanup=0; maximum mounted6
- LRU unit test20x100 accesses PASS; ไม่ใช่หลักฐานว่าไม่มี native/WASM/GPU leak
- Visual100%/125% inspected: matching line breaks/positions for300mixed;
  visual inspection ไม่ใช่ pixel-exact equivalence สำหรับทุกfixture
- Browser console error sample empty; emoji/raw newline limitations retained
- Byte memory, long-task observer, real variable-height scroll anchoring,
  active typing/IME and end-to-end save are unverified/outside this probe

Artifacts (local, outside source repos):
`C:/Users/nekot/Documents/FlowDoc-dev/20261004/profiling/textblock-render-probe/`

- results.json: raw36case results including full corpus and samples
- summary.json: completeness/invariant checks and18paired medians
- identity.json: commits/WASM/font/environment/reuse boundaries
- correctness.json: actual raw-session capability checks
- compare-100.png,compare-125.png: browser comparison screenshots
- resume.json: first16cases reused after owner-approved traversal reduction

No product-main merge/push, document mutation, service restart or map promotion.
Only separate probe tab used; user document tab not explicitly reloaded/edited.

## งานถัดไปที่เตรียมไว้จากผลนี้

1. Core retained TextBlock bridge: expose caret/hit-test/selection/composition
   while preserving inline IDs and explicit line breaks. First prove that a local
   replacement does not recreate every line session; rejection is atomic.
2. Editor Paragraph view: use retained grouped SVG paths and a separate caret/
   selection overlay. Focus/blur changes no text geometry and no path compilation.
   Pin the active view; idle visible nodes reuse frames and paths.
3. Connect browser input to that bridge, then per-node drafts/save acknowledgement
   handling. Keep native input/composition acceptance separate from painter tests.
4. Recheck300/900/1800 and1/20/100 on the actual editing path before Columns.

These are next implementation boundaries, not completed code or a reopened
historical WYSIWYG gate. No additional renderer comparison is required absent a
new correctness or product-performance finding.
