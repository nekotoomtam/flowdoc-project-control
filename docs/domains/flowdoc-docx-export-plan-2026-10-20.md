# FlowDoc DOCX Export Implementation Plan

Current route (2026-10-22): E0 baseline preparation is closed. The independently
authorized E1 [B1 on P/T/Q](#e1-b1-ptq-result-2026-10-22) and
[C on W/R](#e1-c-wr-result-2026-10-22) experiments are complete in separate Core
worktrees. The subsequently authorized [D B1+C on all five packets](#e2-d-b1c-ptqwr-result-2026-10-22)
is also complete in a third isolated worktree: all32 combined pages match the
respective independent B1/C results in pixels and character/image geometry.
The subsequently authorized [four-case I6 regression](#e2-preferred-b1c-four-case-i6-regression-2026-10-22)
is complete for bounded content/pagination verification, with a recorded0.48pt
TOC numeral alignment difference and provenance/Word-procedure qualifications.
Retain B1+C as the preferred experimental candidate with those limitations.
B2, main integration, release and push remain unauthorized. Full parity and
integration/I6 NOT ACCEPTED dispositions remain unchanged. Older
I-stage status/authority paragraphs below are historical, not current permission.
The subsequent [I6 full-suite diagnosis and closure proposal](#i6-full-suite-blocker-diagnosis-and-proposed-closure-2026-10-22)
led to authorized [F0–F1 targeted diagnosis](#i6-f0-f1-targeted-diagnosis-result-2026-10-22):
F0 passed; F1 stopped after17 cases because a live child and processor lock
persisted after task-api. F3 full-suite execution remains unauthorized.
The requested [F2 cleanup and memory investigation plan](#i6-f2-cleanup-and-memory-headroom-plan-2026-10-22)
was subsequently authorized and reached a [partial F2 checkpoint](#i6-f2-partial-result-2026-10-22)
at its36-execution cap. Targeted cleanup and four critical API cases pass;
that checkpoint left complete-file/resource coverage and memory attribution open.
F3 has not begun.
The subsequently authorized [17-case unchanged-candidate verification](#i6-f2-seventeen-case-followup-result-2026-10-22)
completed: complete task-api8/14 pass,6 fail; resource-wait3/3 pass. Its end
boundaries are clean, while memory admission blocks generation in observed
failure windows. F2/I6 remain NOT ACCEPTED; no further code change or F3 run.
The owner subsequently requested the [harness and cache attribution proposal](#i6-harness-and-cache-memory-attribution-plan-2026-10-22).
It is planning only; its proposed measurement budget is not execution permission.
The owner subsequently authorized that bounded discovery. Its
[M0/M1 result](#i6-memory-attribution-m0-m1-result-2026-10-22) stops after2/12
cache probes because the comparison controls are invalid; M2/M3 were not run.
Harness/cache attribution remains UNKNOWN and F2/I6 remain NOT ACCEPTED.
The owner next requested the [reader coverage and cache repeatability revision](#i6-reader-coverage-and-cache-repeatability-revision-plan-2026-10-22).
That revision is planning only: no helper edit or additional probe is authorized.
The owner subsequently authorized the revised reader and five cache-only
scenarios. The [persistent-group cache result](#i6-candidate-reader-and-persistent-cache-result-2026-10-22)
passes the bounded CACHE-CONDITION-STABLE criterion at5/5 executions. This is
not a harness/Service comparison or F2/I6 acceptance; M2/M3 were not started.
The owner's next request is the [controlled harness/Service comparison proposal](#i6-controlled-harness-service-memory-comparison-plan-2026-10-22).
It is a readiness-only diagnostic plan, not permission for another run or repair.
The owner subsequently authorized the seven-scenario comparison. Its
[preparation result](#i6-harness-service-comparison-preparation-stop-2026-10-22)
stops on an external network-metadata parser error before any live cache or
readiness arm. Charge the failed preparation as1/7; no retry occurred.
The previous cache-only PASS remains limited to its recorded topology.
The owner next requested the [network-parser and budget-repair proposal](#i6-network-parser-and-budget-repair-plan-2026-10-22).
It specifies offline fixture checks and a separate fresh live budget; no repair
or further experiment is authorized by this planning checkpoint.
The owner subsequently authorized only that external repair and its offline
fixtures. The [offline repair result](#i6-network-parser-and-budget-offline-repair-result-2026-10-22)
passes all16 cases on the second of at most3 passes (32 named executions total),
with zero real Docker/subprocess calls in the fixture suite. Historical failed
preparation remains charged1; a fresh live7-scenario comparison is still
unauthorized. F2/I6 remain NOT ACCEPTED and B1+C/PDF baselines are preserved.
The owner next authorized a fresh7-scenario live comparison using those repaired
helpers. Its [observer-placement preparation stop](#i6-repaired-comparison-observer-preparation-stop-2026-10-22)
consumes1/7 and stops before cache reading or any A/B arm: observer database-PID
membership verification fails. Owned resources are removed, no retry occurs,
and cache matching/memory attribution remain UNKNOWN. F2/I6 are NOT ACCEPTED.
The owner now requests the [offline observer PID/cgroup diagnosis proposal](#i6-offline-observer-pid-cgroup-diagnosis-plan-2026-10-22).
This authorizes saved-source/evidence review and planning only, with no helper
repair, fixture execution, Docker call or additional comparison. Historical
charges and the failed observer receipt remain intact.
The owner subsequently authorized the pure offline unit and sixteen fixtures.
The [offline observer diagnosis result](#i6-offline-observer-placement-diagnosis-result-2026-10-22)
passes16/16 on pass2/3,32 named executions total, with zero external/process
or live procfs/cgroup operations in the suite. Observer/product bytes remain
unchanged. Historical runtime cause and live readiness remain unverified;
F2/I6 and memory attribution are unchanged. No Docker retry follows.
The owner's next request is the [missing identity evidence and observer acceptance proposal](#i6-pid-namespace-cgroup-evidence-and-observer-acceptance-plan-2026-10-22).
It specifies a bounded capture-only checkpoint and subsequent observer criteria;
no collector/observer edit, fixture execution, Docker or additional live round
is authorized by this planning request.
The owner subsequently authorized capture tooling and eight offline cases only.
The [capture-tool offline result](#i6-identity-capture-tool-offline-result-2026-10-22)
passes8/8 on pass2/2 (16 named executions total), with no Docker/procfs/cgroup
access in the suite and no live capture. Observer/product bytes and old proofs
remain unchanged. Dormant runtime paths and unsupported cross-view binding
remain unverified; no live capture or A/B retry is authorized by that result.
The owner subsequently authorized one capture-only attempt up to120 seconds.
The [live identity capture result](#i6-one-shot-identity-capture-result-2026-10-22)
charges1/1 and stops UNKNOWN after18.375 seconds: all three local receipts are
retained, while cross-cgroup-namespace counter binding is unsupported. Cleanup
is clean; no retry, observer repair or A–B–B–A follows. The original baselines
and all previous proofs remain unchanged; F2/I6 are NOT ACCEPTED.
The owner next requests the [saved-evidence cross-view counter binding proposal](#i6-saved-evidence-cross-view-counter-binding-plan-2026-10-22).
This is planning only: no validator/observer change, fixture run, Docker or
new capture/comparison. The original UNKNOWN receipt is retained; proposed
object/route adjudication does not confer observer or live-sampling acceptance.
The owner subsequently authorized the new offline verifier and twelve cases.
The [saved-evidence verifier result](#i6-saved-evidence-cross-view-verifier-result-2026-10-22)
passes12/12 on pass2/2 (24 named executions total). Both retained target/DB
pairs support bounded captured object/counter-route binding under the new
profile. The original as-run UNKNOWN and observer/liveReady=false remain;
no source/runtime repair, Docker or further live work follows.

> For agentic workers: execute only the authorized stage. Use
> `superpowers:executing-plans` for inline implementation, or
> `superpowers:subagent-driven-development` when that execution method is selected.
> Execute only the stage subsequently authorized by the owner; latest authorization (2026-10-22) is I3 in the isolated actual flowdoc-core lane: verify the installed candidate package with small PDF/DOCX documents before Service integration. I3 package/consumer checks and final bounded review pass; I4/Service, the98-page SRS and release promotion remain unauthorized. I1/I2 evidence is preserved. No registered execution round is opened.

**Goal:** ใช้โครงสร้างเอกสารและข้อมูลชุดเดียวกันสร้าง PDF หรือ DOCX;
`Output-Format` ที่ไม่ส่งมาต้องให้ PDF ตามเดิม.

**Architecture:** ประกอบ template และข้อมูลเป็น `ResolvedDocument` ด้วยทางเดิม
แล้วเลือก PDF renderer หรือ DOCX writer. Core เป็นเจ้าของการแปลงเอกสาร;
Service เป็นเจ้าของตัวเลือกในคำขอ การตรึงงาน คิว การเก็บ และการส่งผลลัพธ์.
FlowDocMake เป็น consumer ที่ต้องรับชนิดไฟล์ตามที่ขอได้.

**Tech Stack:** TypeScript/Node.js, Core document composition, Service/Fastify,
PostgreSQL, multipart task transport และ DOCX/OOXML. Stage 0 เลือก
`docx@9.13.0` เป็น candidate ที่ทดลองในพื้นที่แยกแล้ว;
ยังไม่ติดตั้งหรือรับรองความครอบคลุมของ dependency ในระบบจริง.

**Spec:** ข้อกำหนดเจ้าของและสัญญาในเอกสารนี้ โดยเฉพาะ
[Agreed design](#agreed-design) และ [API contract](#api-contract).
รวม design และ staged plan ไว้ไฟล์เดียวตาม Document Budget.
แผนรอบปัจจุบันคือ
[Core and Service integration repair plan](#core-and-service-integration-repair-plan).
[Unified DOCX mapping contract and consolidation plan](#unified-docx-mapping-contract-and-consolidation-plan)
เป็นแผนต้นแบบและหลักฐานเดิม ไม่ใช่การรับรองการเชื่อมเข้าระบบจริง.

## Authority Boundary

Owner: FlowDoc Project Control สำหรับข้อตกลงและลำดับงานร่วม;
`flowdoc-core` สำหรับ document semantics/writer, `flowdoc-service` สำหรับ
HTTP/task/storage และ `plugins/flowdocmake` สำหรับตัวเรียกใช้.

Role: Planning Partner / Documentation Synthesizer. คำขอเจ้าของวันที่
2026-10-20 เริ่มจากบันทึกแผน ต่อมาอนุญาต Stage 0 สำรวจ mapping/เลือกเครื่องมือ
และ bounded prototype ด้วย `docx@9.13.0` ในพื้นที่แยก พร้อมตรวจใน Word.
สถานะ: **I1–I3 pass in the isolated Core candidate. The actual Linux/amd64 package builds native resources, passes939 tests and installs through a real dependency lock; all existing PDF consumers and six paired installed PDF/DOCX cases pass offline. Fresh I3 review has no findings. This is not Service, Word visual, SRS or release acceptance.**
ผลสำรวจอยู่ใน [Stage 0 discovery results](#stage-0-discovery-results);
ผลทดลองอยู่ใน [Prototype checkpoint](#prototype-checkpoint).
ผลทดสอบ SRS เดิมอยู่ใน [Existing SRS checkpoint](#existing-srs-checkpoint).
Work/Phase/Checklist/execution IDs: N/A สำหรับ single-room work นี้.
ไม่เปิด execution context ที่ปิดแล้วกลับมา.

Work Size: medium สำหรับการวางแผน; implementation แบ่งตาม stages ด้านล่าง.
Risk Tier: routine สำหรับเอกสารนี้; product stages มีความเสี่ยงเรื่องความครบถ้วน
และ compatibility ซึ่งต้องตรวจตามขอบเขต ไม่ใช่เหตุให้ประกาศ critical โดยอัตโนมัติ.
Work authority รอบปัจจุบัน: implementation เฉพาะ I3 ใน Core worktree แยก;
role ปฏิบัติ: Product Implementation Agent / Evidence Reviewer และ Documentation
Synthesizer สำหรับ checkpoint ในแผนนี้. Work/Phase/Checklist/execution IDs: N/A
สำหรับ single-room work; ใช้ I3 checklist และ evidence path ที่ระบุด้านล่าง.

Allowed mutation: Core package-check script, Docker consumer/package build,
consumer checks/fixtures และ package-contract checks โดยไม่เปลี่ยน renderer ใน
`C:/Users/nekot/Documents/Codex/2026-10-22/docx-core-service-integration/core`
และ checkpoint ในแผน Project Control นี้. ใช้ development branch
`codex/docx-core-integration` จาก Core `8f8a739aea5597b6d8c9932c790f9bd716e8ebc7`.
อนุญาต dependency install ที่ตรึงเวอร์ชันเฉพาะ worktree และ disposable Linux checks.

Forbidden: Core checkout หลัก, PDF implementation/ต้นแบบ, Service, plugin/runtime
ที่ติดตั้งใช้งาน, DB, SRS, prototype/evidence เดิม, release/tag/push/production
install และ system/DOCUMENT_MAP. I4 และขั้นถัดไปยังต้องรอเจ้าของอนุญาต.
เอกสารนี้เป็น work plan/status พร้อม locators; durable code/tests/logs รองรับผล
เฉพาะ checkpoint ที่ตรวจแล้ว ไม่ใช่คำรับรอง DOCX readiness ทั้งระบบ.

## Agreed design

ข้อตกลงจากบทสนทนากับเจ้าของ:

1. โครงสร้างและข้อมูลชุดเดียวกันใช้ได้ทั้ง PDF และ DOCX; ไม่ต้องบำรุง template
   หรือชุดข้อมูลอีกชุดสำหรับ DOCX.
2. DOCX เน้นส่งมอบเอกสารให้หน้าตาใกล้ PDF มากที่สุด โดยรักษาเนื้อหา ลำดับ
   ความสัมพันธ์ โครงสร้าง ตาราง รูปภาพ และรูปแบบให้ครบ.
3. ยอมให้จุดตัดบรรทัดและจุดแบ่งหน้าต่างจาก PDF ได้. การหายของข้อความ รูปภาพ
   การรวมช่อง หรือความสัมพันธ์ในเอกสาร ไม่ใช่ความต่างที่ยอมรับจากข้อนี้.
4. ใช้ Microsoft Word บน Windows เป็นเป้าหมายหลักของการตรวจหน้าตา.
   บันทึกรุ่น Word, ฟอนต์ และวิธีอัปเดต fields ที่ใช้ตรวจจริง.
5. ตัวเลือกชนิดไฟล์อยู่ระดับ request: `Output-Format`; ภายในใช้ `outputFormat`.
   หนึ่งคำขอสร้างหนึ่งชนิดไฟล์. เมื่อไม่ส่ง header ให้เป็น PDF ตามเดิม.

เส้นทางเป้าหมาย:

```text
template + data + assets
        -> validation / normalization / composition เดิม
        -> ResolvedDocument + resource identities
             -> PDF renderer เดิม
             -> DOCX writer ใหม่
```

ทางเลือกที่พิจารณา: (1) writer จากเอกสารกลาง เป็นแนวทางที่เลือก;
(2) แปลง PDF ที่สร้างแล้วเป็น DOCX เพิ่มขั้น reconstruct โครงสร้างที่มีอยู่แล้ว;
(3) บำรุง Word template แยก เพิ่มภาระรักษาความตรงกันสองชุด.
แนวทางที่เลือกตรงกับการใช้โครงสร้างและข้อมูลชุดเดียวกันมากที่สุด.
ไม่ใช้ภาพเต็มหน้าแทนข้อความ/ตารางเพื่อทำให้ดูเหมือน PDF.

## API contract

ใช้กับคำขอ generation แบบ multipart ของ `POST /documents` ทั้งทางเดิมและ
`task-mode: queue-v1`; การ lookup สถานะงานยังอ่านชนิดไฟล์จากงานที่บันทึกไว้.
ไม่ใส่ตัวเลือกลง `data`, `sections` หรือ template `formats`.

| Request header | ค่า normalized | พฤติกรรม |
| --- | --- | --- |
| ไม่ส่ง `Output-Format` | `pdf` | ใช้ PDF path เดิม |
| `Output-Format: PDF` หรือ `pdf` | `pdf` | สร้าง PDF |
| `Output-Format: DOCX` หรือ `docx` | `docx` | สร้าง DOCX |
| ตัวพิมพ์ผสม เช่น `Docx` | `docx` | normalize แบบไม่แยกตัวพิมพ์ |
| ค่าว่าง/มีแต่ whitespace/ค่าอื่น/list/ส่งซ้ำ | ไม่มี | HTTP 400, `INVALID_REQUEST` |

ชื่อ header ไม่แยกตัวพิมพ์ตาม HTTP. ตัดเฉพาะ whitespace ขอบค่าก่อนตรวจ;
การส่ง header ซ้ำยังผิดแม้ค่าทั้งสองเหมือนกัน. ค่า `null` แบบข้อความไม่ใช่การละค่า.
รักษาการตรวจ authentication/authorization เดิม และตรวจค่าก่อนสร้าง durable task
หรือรับ payload ขนาดใหญ่. ไม่ fallback เป็น PDF เมื่อขอ DOCX แล้วทำไม่ได้.

ผลลัพธ์ภายนอกยังใช้ multipart feedback ตาม task protocol เดิม:

| Output | Media type | ชื่อไฟล์เริ่มต้น | Page count |
| --- | --- | --- | --- |
| PDF | `application/pdf` | `document.pdf` | จำนวนหน้าจริงตามเดิม |
| DOCX | `application/vnd.openxmlformats-officedocument.wordprocessingml.document` | `document.docx` | `null` หากยังไม่ได้จัดหน้าด้วย Word |

ตรึง `outputFormat` ตั้งแต่ admission; task/job/worker/result ต้องใช้ค่าเดียวกัน.
หลังสร้างงานแล้วเปลี่ยนชนิดไฟล์ผ่าน lookup ไม่ได้. เก็บชนิดไฟล์กับงานและ
ผลลัพธ์เพื่อแยกจาก template format และป้องกัน reuse ผลลัพธ์ผิดชนิด.
metadata ของ DOCX ต้องมีชนิดไฟล์ bytes และ SHA256 ตรง binary ที่ส่งจริง;
ห้ามคัดลอกจำนวนหน้า PDF หรือ cached Word properties มาอ้างเป็นจำนวนหน้าที่ตรวจแล้ว.
ค่าจำนวนหน้าจากการ review ใน Word เป็นหลักฐานการ review แยกต่างหาก.

PDF ที่ไม่ส่ง header และ PDF ที่ส่งชัดเจนต้องยังมี field/feedback/delivery
ที่ consumer เดิมพึ่งพา. การเพิ่ม metadata ต้องตรวจ old-client compatibility.
consumer ที่รองรับ DOCX ต้องตรวจ media type ให้ตรงชนิดที่ขอ รวมถึงนามสกุล
และ checksum ก่อนยืนยันส่งไฟล์สำเร็จ.

## Global Constraints

- ใช้ `ResolvedDocument` ก่อน PDF pagination; DOCX ไม่เรียก PDF glyph/draw output
  เป็นแหล่งโครงสร้างหลัก และไม่เขียน normalization/binding อีกชุด.
- ไม่เปลี่ยน schemaVersion/nodeModelVersion เพียงเพราะเพิ่ม output format;
  fixture ต้องครอบคลุม node models 18 และ 19 ที่รองรับปัจจุบัน.
- PDF behavior, warnings และข้อจำกัดเดิมไม่เปลี่ยนโดยปริยาย.
- DOCX ห้ามข้าม node/feature/asset โดยเงียบเพื่อให้ไฟล์สำเร็จ. กรณีที่ยังรองรับ
  ไม่ได้ต้อง fail ด้วย issue ที่ระบุตำแหน่งและเปิดเผย error ที่เหมาะสมใน Service.
- เป้าหมาย DOCX รอบนี้ไม่รับ success แบบ `completeness: partial` จากการ omit
  content/image. ถ้า normalization/preparation ทิ้ง image placements หรือ writer
  ทิ้ง content ต้อง fail พร้อม findings; warning ที่ไม่ทำเนื้อหาหาย เช่น low resolution
  แสดงตามจริงได้. ไม่เปลี่ยน partial-output policy ของ PDF เดิม.
- ข้อความภาษาไทย/อังกฤษ ตัวเลข ลำดับ และ source relationships ต้องรักษาไว้.
  ตารางต้องรักษา logical topology, spans, groups, labels และรูปภาพใน cell.
- ใช้ page geometry, margins, font selection, ขนาด, alignment, spacing, borders,
  fills และ image dimensions จากนิยามเดิม. ความต่างต้องระบุเป็นรายการ.
- ฟอนต์ต้องรักษา release/face/weight/style และ identity; ประเมินการฝังและสิทธิ์
  จากข้อมูลจริง. ไม่อ้างว่าใช้ชื่อฟอนต์แล้วหน้าตาตรงกันโดยไม่ตรวจใน Word.
- เลขหน้า สารบัญ และ internal destinations ต้องสอดคล้องกับ DOCX ของตัวเอง.
- ทรัพยากร ภาพ และ document snapshot ต้องคง caller-mutation isolation,
  bounded IO, cancellation และ integrity checks.
- ใช้ queue, quotas, task identity, cleanup และ expiry เดิมร่วมกัน.
  ไม่เพิ่ม worker count หรือผ่อน resource limits เพื่อให้ DOCX ผ่าน.
- Runtime export ไม่ติดตั้งโปรแกรมหรือดาวน์โหลด dependency/font เพิ่มเอง.
  การใช้ Word เพื่อ review ไม่เท่ากับกำหนดให้ server ต้องมี Word.
- รักษา package runtime floor ปัจจุบัน `node >=24.15.0 <25`;
  dependency ที่เลือกต้องรองรับ environment นี้.
- DB migration เป็น forward-only; ห้ามแก้ migrations 001–024 ที่ปล่อยแล้ว.

## Inspected baseline and ownership

Inspection locators วันที่ 2026-10-20; ไม่ใช่ immutable execution base ของงานอนาคต.
ก่อน execution ต้องอ่าน AGENTS และตรวจ branch/head/status ใหม่.

| Owner | Source identity / จุดที่เกี่ยวข้อง |
| --- | --- |
| Project Control | planning baseline `787de63404d1f4140c92f2bd99b08246699663fa` |
| Core | 0.4.7, `8f8a739aea5597b6d8c9932c790f9bd716e8ebc7`; `src/index.ts`, `src/composition/{composeTaskDocument,composeDocument,resolvedDocument}.ts` |
| Core PDF path | `src/pdf/createPdfEngine.ts`, `src/pdf/{imageResources,streamResources}.ts`, `src/layout/` |
| Service | 0.4.9, released snapshot `ca66f605b02a41d1bc3b05894fbc75f5224d4900`; `src/http/documents.ts`, `src/tasks/{intake,repository,normalize,render,render-child,processing,public,wire}.ts` |
| Service storage | `migrations/001_initial.sql` จำกัด media type เป็น PDF; `024_task_processing.sql` เพิ่ม nullable `page_count`; ตรวจ trigger identity ใน `022_task_intake.sql` ด้วย |
| Other Service consumers | `src/jobs/{render,render-child,processor}.ts`, `src/templates/contract.ts`, tools/authoring/preview ที่อาศัย PDF |
| FlowDocMake | development `plugins/flowdocmake/scripts/task-client.mjs` ตรวจรับเฉพาะ PDF และ pageCount บวก; installed package 0.2.8 เป็น released snapshot แยกจาก development |

Core guide: [flowdoc-core/AGENTS.md](../../../flowdoc-core/AGENTS.md).
Service guide: [flowdoc-service/AGENTS.md](../../../flowdoc-service/AGENTS.md).
Workflow: [flowdoc-workflow-economy-policy.md](flowdoc-workflow-economy-policy.md).

## Review Focus

1. คำขอเก่าที่ไม่ส่ง header ต้องได้ PDF พร้อมสัญญาที่ client เดิมตรวจผ่าน (Stage 3–4).
2. งานคิวสองชนิดใช้ input เหมือนกันต้องไม่สลับ format, resource pins หรือ output (Stage 3).
3. fixed frame/overflow และ merged/grouped table ต้องไม่ทำเนื้อหาหาย (Stage 0–2).
4. Word จัดหน้าใหม่แล้วสารบัญ/เลขหน้า/link ต้องยังถูกต้อง (Stage 2 และ 5).
5. ฟอนต์หาย ภาพมี alpha หรือ connection ขาดต้องไม่เกิดไฟล์สำเร็จที่ผิด/ไม่ครบ (Stage 1, 3–5).

## Stage 0 — Mapping and dependency decision

Authority: discovery ก่อน implementation; ผลที่เปลี่ยน contract กลับมาแก้แผนนี้.
Stage นี้ป้องกันการประกาศรองรับ DOCX ทั้งระบบจากตัวอย่างง่ายเพียงไฟล์เดียว.

- [x] ทำ matrix จาก node/props ใน `src/composition/resolvedDocument.ts` และ
  semantics ใน template/layout ที่เกี่ยวข้อง; ระบุ direct mapping, adaptation,
  หรือ unsupported พร้อม fixture. รวม text/inlines/line/page break, tables,
  spans/rowGroups/group labels, images, Section18/19, cover/blank,
  header/footer/columns/placement, fixed sizing, links/anchors, scoped TOC และ page fields.
- [x] ตรวจ fixed formats และ overflow: PDF ปัจจุบันมีบางกรณี omit พร้อม warning
  แต่ fixed text บางกรณี fail. DOCX ต้องไม่คัดลอกการ omit มาโดยเงียบ.
  ถ้ารักษาเนื้อหาครบในข้อจำกัดเดิมไม่ได้ ให้รายงาน unsupported/failure;
  การเปลี่ยน sizing semantics ต้องเป็นข้อตกลงที่ระบุใน matrix ก่อน implementation.
- [ ] พิสูจน์ทางทำ Word sections/bands, row-group continuation และ page fields/TOC
  โดยเฉพาะ total ที่ไม่นับบางหน้า, restart/hide และ scope. ไม่ hard-code หน้า PDF.
  ระบุวิธีให้ค่า fields ที่เห็นใน Word ถูกต้อง รวมการ refresh อัตโนมัติหรือ
  ขั้นตอนที่ผู้รับต้องทำ; ขั้นตอนเพิ่มเติมต้องเปิดเผยก่อนรับการรองรับนั้น.
- [x] ประเมิน dependency จาก official documentation และ version จริง:
  API coverage, OOXML validity, licenses, supported Node/runtime, image/font handling,
  ZIP buffering/peak memory, output limit และ abort. `docx` เป็น candidate แรก;
  ถ้าขาดความสามารถให้เสนอ adapter/OOXML เฉพาะจุดหรือทางเลือกพร้อมเหตุผล.
- [ ] ตรึง dependency/version และ interfaces ของ Stage 1 ในเอกสารนี้ก่อนเริ่ม code.
  กำหนด resource contract สำหรับ DOCX PNG/JPEG และ font identities โดยรักษา
  alpha/dimensions/source association; ไม่บังคับใช้ raw PDF RGB-deflate เป็น DOCX media.
- [x] เลือก hash-pinned input ชุดเดียวกันสำหรับสอง output พร้อม hashes และ coverage map.
  ใช้ fixtures/หลักฐานที่มีได้; gap เพิ่มเฉพาะกรณีที่ matrix ยังไม่ครอบคลุม.

Deliverable: matrix + dependency/interface decision ในแผนนี้จาก source/docs.
Discovery ไม่แก้ product candidate. ถ้าต้องสร้าง prototype หรือรัน library probe
ให้ระบุ bounded experimental implementation scope และพื้นที่แยกก่อนเริ่ม;
ไม่ถือว่า discovery authority อนุญาตเขียนหรือทดลอง product code.
Exit: ทุก feature ปัจจุบันมี mapping/วิธีพิสูจน์ หรือมี blocker ชัดเจน.
ห้ามลดขอบเขตความครบถ้วนเอง. Blocking unknown ทำให้ stage ที่พึ่งพาหยุด;
ส่วนอื่นที่ไม่พึ่งพาทำตามขอบเขตได้.

## Stage 1 — Core DOCX writer foundation

Depends on accepted Stage 0 decisions. Proposed files:
`src/docx/{createDocxEngine,types,resources,writeDocx}.ts`, `src/index.ts`,
dependency/lockfile, `tests/docx/{engine,resources,package}.test.ts`,
Core `README.md` / `docs/template-guide.md` เฉพาะ contract ที่ทำแล้ว.

Interfaces: consumes `ResolvedDocument`, existing resource identities and
Core `Result`; produces a DOCX engine with `generateDocxTo` sink-based entry,
checked image provider and a receipt containing media type, byte length and SHA256.
Names/types freeze in Stage 0; ไม่เปลี่ยน `createPdfEngine` signature เพื่อบังคับ migration.

- [ ] เพิ่ม failing tests: text/style/order ไทย–อังกฤษ, repeated composition,
  source snapshot isolation, image dimensions/alpha, output checksum/media type,
  unsupported node, cancellation, max output bytes และ malformed resources.
- [ ] รัน focused tests ยืนยัน failure ที่ตรงกับความสามารถที่ยังไม่มี.
- [ ] ทำ writer เริ่มจาก paragraphs/styles/images/simple tables โดยใช้ document
  กลางเดิม. Validate ทุก node ก่อนสำเร็จ; stage ยังไม่ครบต้อง fail ส่วนที่ไม่รองรับ.
- [ ] ตรวจ OOXML package/relationships และ absence ของภาพเต็มหน้าแทนโครงสร้าง;
  พิสูจน์ memory/cancellation ตามขนาด fixture ที่ตั้งใจรองรับ ไม่อนุมานจาก API ว่า stream.
- [ ] รัน `npm run build`, focused DOCX tests และ affected PDF/composition tests;
  packed consumer ต้องใช้ public package root ได้ใน Linux/amd64 ตาม Core guide.
  ตรวจ diff แล้ว commit เมื่อ checks ผ่าน.

## Stage 2 — Complete current document coverage

Depends on Stage 1. Proposed files: DOCX-only mapping modules
`src/docx/{tables,sections,bands,fields,links}.ts` และ matching `tests/docx/`;
reuse helpers ใน `tests/helpers/` แทนคัดลอก binding/composition logic.

Interfaces: consumes Stage 1 writer/resources; produces matrix-complete DOCX
mapping with the same source ids/order/relationships, plus explicit issues for failures.

- [ ] เพิ่ม failing tests สำหรับ spans/cell content, row break preferences,
  repeated headers, rowGroups/keep-start/group labels, fixed heights และ overflow.
- [ ] เพิ่ม failing tests สำหรับ mixed page geometry, cover/blank/Section18/19,
  explicit non-inherited/first/continuation bands, columns/placement และ page numbering.
- [ ] เพิ่ม failing tests สำหรับ three-level/scoped TOC, headings ในตาราง,
  bookmarks, internal/external links และระบบเลขหน้าหลัง Word repagination.
- [ ] ทำ mapping ตาม Stage 0; แยก semantic checks จาก Word layout checks.
  ไม่ใช้ผลลัพธ์ PDF pagination มาเติมเลขหน้า DOCX.
- [ ] รัน tests ที่เพิ่มและ affected existing suites; ตรวจ representative DOCX ใน Word.
  อัปเดต matrix ด้วยผลจริง/ข้อแตกต่าง แล้ว commit เมื่อ checks ที่ stage ต้องใช้ผ่าน.

## Stage 3 — Service request, persistence and delivery

Depends on Core package candidate from Stages 1–2 and frozen API contract.
Files: `src/http/documents.ts`, `src/tasks/{intake,repository,normalize,render,
render-child,processing,public,wire}.ts`, new `src/tasks/output-format.ts`,
shared output metadata/job paths ที่ได้รับผล, forward migration ถัดจากรุ่นล่าสุด,
`package.json`/lockfile/vendor artifact และ code-adjacent usage/API guidance.

Tests: existing `tests/task-{api,intake,processing,wire,record-reuse}.test.mjs`,
`task-queue-api.test.mjs`, `task-queue-scheduler.test.mjs` และ focused new output-format tests.

Interfaces: `OutputFormat = 'pdf' | 'docx'`; header parser returns normalized
format or existing `INVALID_REQUEST`. Persisted tasks expose immutable
`outputFormat`; output writer/transport use one format-to-media-type/filename mapping.

- [ ] เพิ่ม failing tests สำหรับ API table ทั้งหมด รวม absent/explicit PDF,
  case/OWS/empty/duplicates/lists, invalid-before-task และ lookup ที่แก้ format ไม่ได้.
- [ ] ทำ parser และตรึง format ใน task/job. Migration backfills/defaults งานเดิม
  เป็น PDF, ขยาย output media-type constraint และรักษา nullable page count.
  ขยาย immutable identity checks ให้ครอบคลุม format; ไม่แก้ migration เก่า.
- [ ] ต่อ worker dispatch ตาม format; รักษา fonts/template/assets pins,
  reservation/accounting และ cleanup. PDF jobs/authoring preview ที่มีอยู่ยังเป็น PDF
  เว้นแต่ระบุ consumer change ชัดเจน. ไม่ขยายไปทุก legacy endpoint โดยไม่จำเป็น.
- [ ] ตรวจ omission summaries จาก normalization/preparation/composition ก่อนส่ง DOCX;
  ถ้าเนื้อหา/รูปหายให้ failure พร้อม findings ไม่ส่ง partial artifact เป็น success.
- [ ] ทำ artifact event/binary headers/status metadata ให้ format และ SHA256 ตรงกัน;
  DOCX pageCount เป็น `null`; map unsupported DOCX issues โดยไม่กลบเป็น `PDF_FAILED`.
- [ ] ทดสอบ DB migration/replay กับ isolated DB, existing PDF rows,
  immutable-format tampering, restart/recovery, mixed PDF/DOCX queue,
  concurrent jobs, disconnect/cancel/output-limit และ partial-file cleanup.
- [ ] รัน Service build และ affected task/database/container checks.
  เทียบ PDF output/warnings กับ baseline ที่ input/resources เดิม; ไม่มี data loss
  และไม่มี quota/accounting leak. ตรวจ diff แล้ว commit เมื่อ checks ผ่าน.

## Stage 4 — Consumer and capability compatibility

Depends on Stage 3. Scope starts with `plugins/flowdocmake/scripts/task-client.mjs`
and its callers; discover exact caller list before edits. Update only the tool/contract
surfaces needed to request DOCX. PDF preview tools remain named and scoped as PDF.
ห้ามนำ DOCX ไปผ่าน PDF-only visual review/checker แล้วเรียกว่าตรวจแล้ว.

Tests: `tests/flowdocmake-task-stream.test.mjs`,
`flowdocmake-task.test.mjs`, affected preflight/integration tests and caller tests.

Interfaces: task client gets optional `outputFormat` with PDF default; sends
`Output-Format` when explicitly chosen, validates requested versus received media type,
and accepts `pageCount:null` only for DOCX. Capability advertises formats only after
server support; DOCX against an older server fails explicitly, never silently returns PDF.

- [ ] เพิ่ม failing tests: old PDF caller, explicit PDF, DOCX bytes/media/naming,
  null page count, media mismatch, interrupted ZIP และ old-server capability.
- [ ] ส่งตัวเลือกจาก caller ถึง API และยืนยัน binary/checksum ก่อน atomic local save;
  รักษา output-path ownership และไม่ overwrite ไฟล์เดิมโดยเงียบ.
- [ ] ปรับ capability/version checks, human-facing errors และคู่มือที่ได้รับผล.
  เลือก package/version ตอน release preparation ภายหลัง; ไม่กำหนด installed version ใหม่ในแผนนี้.
- [ ] รัน focused tests ด้วย `node --test` ตาม files ที่เปลี่ยน และ
  controlled API-to-client integration. ตรวจ diff แล้ว commit เมื่อ checks ผ่าน.

## Stage 5 — Word acceptance and PDF regression

Authority: verification ของ exact candidate; writes จำกัดที่ output area ใหม่.
การแก้ source/template/data เป็นงาน implementation กลับไป owner แล้ว refresh
เฉพาะ affected proof. ไม่แก้ candidate เพื่อให้ verification ผ่าน.

- [ ] ใช้ frozen input/resources/templates จาก Stage 0 สร้าง PDF และ DOCX
  โดยเปลี่ยนเฉพาะ output choice; ตรวจผล absent header เทียบ explicit PDF ด้วย.
- [ ] ตรวจ semantic inventory: ข้อความ/ตัวเลขครบและลำดับตรง, Section และ
  table topology/spans/groups/labels, image placements/alpha, styles,
  anchors/link destinations, header/footer และ TOC coverage.
- [ ] เปิดใน Microsoft Word บน Windows รุ่นที่บันทึกไว้; refresh fields ตาม
  วิธีที่ตกลงและตรวจผลที่ผู้รับเห็น. เก็บต้นฉบับกับไฟล์หลัง refresh คนละไฟล์.
  ห้ามแก้เอกสารด้วยมือเพื่อซ่อน writer defect.
- [ ] เก็บ DOCX/PDF/hashes และ rendered full pages จากเส้นทาง review ที่ระบุ;
  ตรวจทุกหน้าของ output ในขอบเขต. รีวิวตัวแทนทุก layout family ก่อนขยาย
  ไป full representative documents; ไม่จบด้วยการ unzip/validator ผ่านอย่างเดียว.
- [ ] บันทึกความต่างเป็นรายการ: line/page variation ที่อนุญาต,
  visual deviations ที่ยังต้องแก้ และ missing/incorrect content ที่เป็น FAIL.
  ไม่มีเปอร์เซ็นต์ความเหมือนที่ตั้งขึ้นโดยไม่มี metric.
- [ ] PDF regression ต้องรักษา semantic/visual/warning behavior ภายใต้ฐาน
  และ inputs ที่เทียบได้; reuse proof ได้เมื่อ identity/prerequisites ไม่เปลี่ยน.
  การมี DOCX ไม่ได้พิสูจน์ throughput/capacity หรือ SLA ใหม่.

Exit: ทุก acceptance criterion ด้านล่างมีหลักฐานครบ ไม่มี mandatory gap.
ปิดด้วยผลย่อในแผนนี้และอ้าง artifact/test receipts ที่ durable.
หลังผ่านแล้วหยุด; release/install เป็นคำขอแยก.

## Acceptance coverage

| Criterion | Owner/stage | Required evidence |
| --- | --- | --- |
| Input/template เดียวกันและ composition ไม่แตกเป็นสองชุด | Core 0–2 | Frozen hashes, composition/source-map checks, semantic inventory |
| Header/default/error contract | Service 3 | API tests รวม invalid/duplicate และ old-call PDF |
| ครบทั้ง content/table/image/style/Section | Core 1–2, review 5 | Feature matrix, OOXML/semantic tests และ full-page Word review |
| หน้าตาใกล้ PDF ตามข้อตกลง | Review 5 | Same-input pair, Word version/fonts, page images, exact difference list |
| TOC/page numbers/navigation ตรง DOCX | Core 2, review 5 | Fields/bookmarks tests และผลหลัง Word layout/refresh |
| ส่งและเก็บไฟล์ถูกชนิดครบ bytes | Service 3, consumer 4 | DB/API/stream tests, SHA256, correct media/filename/nullable page count |
| PDF เดิมไม่ถอยหลัง | Core/Service/consumer 1–5 | Affected regression suites, old-client test และ reviewed PDF baseline |
| คิว/resource/cancel/recovery ยังถูกต้อง | Service 3 | Mixed-format isolated task tests และ cleanup/usage receipts |

## Budgets, unknowns and next action

Document Budget: หนึ่งเอกสารนี้สำหรับ design, plan และ stage decisions.
อัปเดต API/package usage เฉพาะเมื่อ implementation จริงเปลี่ยน contract.
ไม่สร้าง Work/Phase/Checklist/report เพื่อเลียนแบบ separate-room workflow.

Proof Budget: focused tests ตาม impact, feature coverage matrix, frozen paired
artifacts และ Word full-page review; หนึ่ง acceptance pass หลัง repairs ที่จำเป็น,
ศูนย์ formal audit. Broad/capacity stress ไม่อยู่ในงบนี้. Recheck เพิ่มเมื่อมี
change/failure/stale prerequisite/unresolved affected area ตาม workflow policy.

| Unknown | Disposition / resolution |
| --- | --- |
| DOCX dependency/version และ complex-feature mapping | เลือก candidate 9.13.0 จาก source แล้ว; complex mapping ยังมี blockers ตามผลสำรวจ |
| Fixed/overflow และ PDF omission ต่างจากเป้าหมายครบถ้วน | ยืนยัน source conflict แล้ว; fail-closed เป็นข้อเสนอจนกว่าจะพิสูจน์ adaptation ที่ไม่ตัดเนื้อหา |
| Word field refresh และ page-total semantics | Blocking ต่อ fields/TOC acceptance; B3 ในผลสำรวจและ Stage 5 proof |
| Font embedding/resource conversion และ ZIP memory peak | API embedding พบแล้ว; resource acceptance และ memory/cancel ยังต้องพิสูจน์ B5–B6 |
| Word รุ่น/font environment ที่ใช้ review | Blocking ต่อ visual acceptance; บันทึกก่อน Stage 5 |
| Google Docs, LibreOffice, Word บนระบบอื่น | Deferred; ไม่อยู่ใน acceptance รอบนี้ |
| DOCX import/round-trip editing, frontend UI, both formats in one request | Deferred; ไม่อยู่ในขอบเขต |

Model decision: เอกสารนี้เป็น inline planning ภายใต้คำขอปัจจุบัน ไม่สร้าง
registered execution/model snapshot. ก่อนเริ่ม product stages ให้ resolve
model/effort จาก host availability จริงตาม workflow policy; PLAN สำหรับงาน
ข้าม owner มี default `gpt-6-astra` / `medium`, แต่ WORK เลือกแยกตาม stage
และไม่ inherit. ไม่อ้างว่าเปลี่ยน model ของ chat นี้แล้ว.

Next action หลัง review ผลสำรวจ: bounded experimental implementation เฉพาะ
blocking mappings/resource behavior ตามข้อเสนอท้ายผลสำรวจ ก่อนเปิด Stage 1.
ยังไม่มี authorization สำหรับ probe/implementation จากการสำรวจครั้งนี้.
ห้องเดียวเป็นค่าเริ่มต้นที่เพียงพอ; worktree isolation เลือกตาม concurrent changes และ risk.
ถ้าจะเปิด separate WORK room จริง ต้องมีเหตุผลและ return/ownership controls
ตาม workflow policy ก่อน dispatch. ไม่มี return route ที่สังเคราะห์ในรอบแผนนี้.

## Planning verification — 2026-10-20

ตรวจ source locators และ contract dependencies ระหว่างวางแผนแล้ว.
Self-review ครอบคลุม agreed requirements, dependencies/interfaces, defaults,
consumer/storage impact, acceptance coverage และ discovery/implementation boundary.
ตรวจ local Markdown links/anchors, `git diff --check` และ `npm run check:data` ผ่าน.
เปลี่ยนเฉพาะเอกสารนี้; ไม่มี canonical record หรือ generated projection เปลี่ยน.
Product feature stages ทั้งหมดยังไม่รัน; ไม่มี DOCX artifact หรือ runtime PASS ในรอบนี้.

## Stage 0 discovery results

ส่วนนี้เก็บ checkpoint ของ source/docs discovery ก่อนอนุญาตทดลอง;
ข้อจำกัดและคำว่า "ยังไม่รัน" ในส่วนนี้เป็นสถานะ ณ checkpoint นั้น.
ผลรอบทดลองที่ตามมาอยู่ใน [Prototype checkpoint](#prototype-checkpoint).

Observation date: 2026-10-20. ผู้ใช้อนุญาตให้สำรวจและสรุปก่อนแก้ระบบจริง.
Core/Service heads ยังตรง baseline ด้านบนและ working trees สะอาดระหว่างสำรวจ.
Project Control เริ่มที่ planning commit `e646f2b`.

ขอบเขตหลักฐาน: อ่าน source/tests/JSON/font headers, คำนวณ hashes และตรวจ
published metadata/source ของเครื่องมือ. ไม่รัน Core/Service/library, ไม่ติดตั้ง
dependency, ไม่สร้าง DOCX/PDF, ไม่เปิด Word และไม่แก้ product candidate.
ผลต่อไปนี้เป็น **source-backed mapping / design recommendation**;
API ที่ library มีอยู่ยังไม่ใช่หลักฐานว่า FlowDoc writer หรือ Word parity ผ่านแล้ว.

### Selection and alternatives

เลือก **`docx@9.13.0`** สำหรับ bounded proof ถัดไป. เหตุผล: สร้าง native OOXML
โดยตรงจากเอกสารกลางได้ และมี primitive สำหรับ text/runs/styles, tables/spans,
Section/bands, PNG/JPEG, hyperlinks/bookmarks, scoped TOC และ embedded fonts.
ไม่ต้องสร้าง Word template หรือ HTML model อีกชุดเพื่อเป็นแหล่งนิยามหลัก.

Published metadata ที่ตรวจจริง:

- Version `9.13.0`, license `MIT`, declared Node engine `>=10`.
- Published `gitHead`: `c98bc7351b76333d84c0cf8c2cddc538f7b37bf5`;
  source references ด้านล่างตรึงที่ commit นี้ ไม่ใช้ `master` ที่เปลี่ยนต่อได้.
- npm integrity:
  `sha512-MofrvX7rzwCe1xUFXnwneQHzv2p1lIUIDPD01DueOnKGw+TSKxAAcK5Beo69bTyqKUYsX8d49Co03Bcntc60WQ==`.
- Direct runtime dependencies ระบุ ranges `jszip:^3.10.1`, `nanoid:^6.0.1`,
  `hash.js:^1.1.7`; package ยังมี `@types/node:^26.6.2`.
  ตรวจ metadata ของ nanoid6.0.1 พบ engine `^22 || ^24 || >=26`, จึงรวม Node24.
  ยังไม่มี resolved lockfile/install; การ compile กับ Core types24/TS6 และ
  packed Linux/amd64 consumer เป็นหลักฐานที่ต้องทำในขั้นทดลอง/Stage 1.
- เมื่ออนุญาต implementation ให้ใช้ exact direct version และตรึง transitive
  resolution ใน lockfile. Version/integrity นี้เป็น selection record;
  ยังไม่อ้างว่า archive ที่ติดตั้งถูกตรวจหรือ dependency graph ทั้งชุดผ่านแล้ว.

| ทางเลือกที่ตรวจ | ความเหมาะสมกับโจทย์ | ผลเลือก |
| --- | --- | --- |
| `docx@9.13.0` | Native document object -> OOXML, มี primitives ใกล้ `ResolvedDocument`; ยังต้องทำ adapters และพิสูจน์ Word | เลือกแบบมี prerequisites |
| `docxtemplater@3.71.1` | Word-template engine; เพิ่ม Word template และการ map อีกชั้น ขณะที่เรามี semantic document อยู่แล้ว; ไม่คำนวณ pagination | ไม่เลือกเป็นแกนรอบนี้ |
| `@turbodocx/html-to-docx@1.23.1` | HTML -> native DOCX; เพิ่ม HTML/CSS translation และยังไม่พิสูจน์ complex group/field semantics ของเรา | ไม่พบข้อได้เปรียบเหนือ direct mapping |

Sources: [published docx metadata](https://registry.npmjs.org/docx/9.13.0),
[pinned package manifest](https://github.com/dolanmiu/docx/blob/c98bc7351b76333d84c0cf8c2cddc538f7b37bf5/package.json),
[docxtemplater documentation](https://docxtemplater.com/docs/),
[docxtemplater pagination FAQ](https://docxtemplater.com/faq/),
[TurboDocx repository](https://github.com/TurboDocx/html-to-docx).

### Mapping matrix

Classification: **D** = มี native primitive ที่ตรงกับข้อมูลพื้นฐาน;
**A** = ต้องมี adapter และทดสอบ semantics/visuals;
**B** = ยังไม่พิสูจน์พฤติกรรมที่จำเป็น จึงเป็น blocker ของ feature ที่พึ่งพา.
แม้ D ก็ยังไม่ใช่ implemented/tested support.
Core source paths ต่อไปนี้อ้าง baseline ที่ระบุด้านบน.

| Source feature / facts | DOCX mapping ที่เสนอ | Class / coverage |
| --- | --- | --- |
| `ResolvedDocument` และ `sourceMap` (`composition/resolvedDocument.ts:28`, `composeTaskDocument.ts`) มีโครงสร้างหลัง binding และก่อน PDF pagination | ใช้ composition เดิม; writer เดิน roots/nodes โดยลำดับเดิมและเก็บ provenance แยกจาก layout metadata | A; same-input invariant |
| `TextBlock` / inline text / explicit line-break (`resolvedDocument.ts:8–13`) | Paragraph/TextRun/Break; รักษา whitespace, literal newlines, Thai/English และ empty strings | D/A; srs/table + whitespace gap cases |
| Legacy Sarabun 4 faces และ Library font selection (`fonts/selection.ts`) | Run font/size/bold/italic รวม complex-script properties และ `th-TH`; ไม่พึ่ง Word Normal defaults | A; resource proof B5 |
| `lineHeightPt`, left/center/right, fixed text height/verticalAlign | ตั้ง line spacing/paragraph spacing ชัดเจน, แปลงหน่วยและตรวจ rounding. ใช้ `LineRuleType.EXACT` ไม่ใช้ค่าชื่อ `EXACTLY` ที่ source library ระบุว่า invalid | A/B; Thai marks และ fixed overflow B4 |
| `LineBlock` มี width/thickness/color/alignment/before/after | Paragraph border หรือ native line element พร้อม adapter คำนวณ width/indent/spacing; ไม่แปลงทั้งหน้าเป็นภาพ | A; ต้องตรวจ minimal paragraph height |
| `PageBreak` (`layout/documentFlow.ts:190–203`) ถูก defer และไม่สร้างหน้าว่างซ้ำที่ page top | คง empty/break semantics ก่อน emit native page break; ไม่ serialize node ตามตัวอักษรทุกกรณี | A; blank/break tests |
| `Table`, column widths, borders/header fills (`resolvedDocument.ts:18–20`) | Native table + fixed grid widths; repeated headers เฉพาะ leading rows | D/A; table short/long/empty |
| `TableRow.allowBreak` และ `headerRowCount/repeatHeaderRows` | `cantSplit = !allowBreak`, `tableHeader` ตาม leading header count; manual page break ในตารางไม่ให้ผล repeat เหมือน auto break | A; protected rows และ multi-page headers |
| `TableCell.columnIndex/rowSpan/colSpan/padding/fillColor/childIds` | Cell grid/span/vertical merge และ native cell children; reconcile fully covered rows และ terminal paragraphs โดยไม่เพิ่มเนื้อหาปลอม | A; merged tests |
| `rowGroups`, `keepStart`, empty member groups (`cellTableFlow.ts:42–56,124–136`) | เก็บสมาชิก/group identities/order; paragraph keep-next/cantSplit เป็น candidate สำหรับ soft keep-start | A; ไม่ใช่ guarantee ของ pagination เดิม |
| `groupLabel` ถูกวาดครบทุก member fragment และเติม “(ต่อ)” เฉพาะ continuation (`cellTableFlow.ts:93,138`; `tests/layout/groupLabelFlow.test.ts`) | Native vertical merge/tableHeader อย่างเดียวไม่รู้ continuation ของแต่ละกลุ่มหลัง Word จัดหน้า | B1; ห้ามประกาศครบจาก ordinary table test |
| `ImageBlock.width/height` เป็น frame; PDF contain ตาม aspect ratio แล้ว center ใน frame (`tests/pdf/images.test.ts:21`) | `ImageRun` PNG/JPEG + คำนวณ contain จาก dimensions จริง พร้อมรักษาพื้นที่ frame และ alignment; ไม่ stretch ให้เท่ากรอบโดยตรง | A; stream-image JPEG/alpha PNG |
| Service ทำ orientation/sRGB/200-DPI variants ก่อน PDF (`tasks/render-child.ts:83–109,165`) | ใช้ verified normalized renditions/transform identity เดียวกัน; DOCX เก็บ encoded PNG/JPEG, PDF มี packaging RGB/alpha ของตัวเอง | A; ไม่ส่ง RGB-deflate เป็น DOCX media |
| Section18/19 order/identity/geometry (`template/pageSections.ts:38–48`, `composition/composeSections.ts:13–17`) | Native sections/page geometry; model19 UUID/label/nameBase ไม่ใช่เปลี่ยนเพียงชื่อ key. Model19 ห้าม `role`; ไม่ใส่ cover role ให้ model19 | A; page-sections/area-cover |
| Empty ordinary sections ถูก skip; explicit blank/cover คงอยู่ และ empty scoped TOC ไม่เพิ่มหน้า | Emit sections/blank pages ตาม semantic source; ตรวจ trailing paragraph และ next-page break ของ Word | A; cover/scoped fixtures |
| Section bands **ไม่ inherit จาก section ก่อน** (`composeSections.ts:19–22`) | เขียน explicit references หรือ empty header/footer parts ต่อ section; ป้องกัน Word Link to Previous เพิ่ม inheritance เอง | A; เป็นการแก้ความเข้าใจจากคำว่า inherited ใน draft เดิม |
| `all/first/continuation/none` อิง physical section-page index; header/footer เป็นอิสระ (`layout/pageBands.ts:11–13`) | `titlePage` + first/default parts พร้อม explicit empty parts; ไม่ผูก mode กับค่าที่พิมพ์เป็นเลขหน้า | A; independent mode combinations |
| Band weighted columns และ content/fixed sizing (`layout/pageBands.ts:17–29`) | Borderless fixed-width table; คำนวณ weight/gaps/padding และตรวจขั้นต่ำของ cell/paragraph | A/B; band exact heights B2/B4 |
| Band page-relative left/right/top-or-bottom offset และการลด body budget ตาม overlap ของแต่ละหน้า (`documentFlow.ts:70–80`) | Positioned native content + section distances เป็น candidate; first/continuation body height เปลี่ยนได้ใน Core แต่ Word section margins ปกติคงที่ | B2; ยังไม่พิสูจน์ safe mapping |
| Covers/blank/current sequence/hidden/excluded (`layout/systemPageCounting.ts:9–28`) | Section numbering restart/continue/hidden parts. Blank นับโดย default แต่ซ่อน fields; cover defaults exclude+hide แยกจากการ suppress bands | A/B; visibility ไม่เท่ากับ exclusion |
| `current/total` มี width; compact hidden block suppress ทั้งข้อความ; total นับทุก physical page ที่ไม่ excluded ไม่ใช่ last displayed number | `PAGE` สำหรับ current; `NUMPAGES`/`SECTIONPAGES` ล้วนไม่ตรง selective total. ต้องพิสูจน์ formula/bookmark/refresh strategy และ preserve hidden compact block | B3; numbering/compact tests |
| TOC1–3, section/document scope, heading ใน table, whitespace folding, cover exclusion (`composition/contents.ts:5–16`) | Section bookmark ranges + `entriesFromBookmark`; อาจใช้ explicit hyperlink/PAGEREF entries เพื่อคง flattened titles/excluded target behavior | A/B3; generic TOC ยังไม่พอ |
| Model19 anchor namespace เป็น JSON pair; internal refs local/cross-section (`composeSections.ts:24–29`, `composition/linkContract.ts`) | Stable legal Word bookmark names + logical-to-Word map; external hyperlink relationships ใช้ URL ที่ validate แล้ว | A; link/section-instance tests |
| Model19 fixed format เป็น capped remainder frame; overflow omit พร้อม warning และไม่ move frame ไปหน้าใหม่ (`documentFlow.ts:274–282`) | ไม่ทำ native clipping แล้วบอกว่าครบ. ข้อเสนอคือ fail-closed จนมี content-preserving adaptation ที่พิสูจน์และตกลงแล้ว | B4; sizing fixture เป็น negative/decision case |

Primary library capability references:
[run properties](https://github.com/dolanmiu/docx/blob/c98bc7351b76333d84c0cf8c2cddc538f7b37bf5/src/file/paragraph/run/properties.ts),
[spacing](https://github.com/dolanmiu/docx/blob/c98bc7351b76333d84c0cf8c2cddc538f7b37bf5/src/file/paragraph/formatting/spacing.ts),
[table cells](https://github.com/dolanmiu/docx/blob/c98bc7351b76333d84c0cf8c2cddc538f7b37bf5/src/file/table/table-cell/table-cell-properties.ts),
[table rows](https://github.com/dolanmiu/docx/blob/c98bc7351b76333d84c0cf8c2cddc538f7b37bf5/src/file/table/table-row/table-row-properties.ts),
[section properties](https://github.com/dolanmiu/docx/blob/c98bc7351b76333d84c0cf8c2cddc538f7b37bf5/src/file/document/body/section-properties/section-properties.ts),
[image options](https://github.com/dolanmiu/docx/blob/c98bc7351b76333d84c0cf8c2cddc538f7b37bf5/src/file/paragraph/run/image-run.ts),
[scoped TOC switches](https://github.com/dolanmiu/docx/blob/c98bc7351b76333d84c0cf8c2cddc538f7b37bf5/src/file/table-of-contents/table-of-contents-properties.ts),
[Microsoft repeated-header rules](https://support.microsoft.com/en-gb/word/repeat-table-header-on-subsequent-pages).

### Fonts, packaging and resource limits

`docx9.13.0` รองรับ embedding regular/bold/italic/boldItalic และสร้าง ODTTF/
relationships/font-table entries. การ obfuscate เพิ่ม buffer ขนาดเท่าฟอนต์;
ไม่ได้ subset glyphs หรือพิสูจน์ permission ให้. Source:
[font options](https://github.com/dolanmiu/docx/blob/c98bc7351b76333d84c0cf8c2cddc538f7b37bf5/src/file/fonts/font-table.ts),
[obfuscation](https://github.com/dolanmiu/docx/blob/c98bc7351b76333d84c0cf8c2cddc538f7b37bf5/src/file/fonts/obfuscate-ttf-to-odttf.ts).

อ่าน OS/2 header ของ bundled Sarabun ทั้งสี่ face พบ `fsType=0`; มี
`assets/fonts/OFL.txt`. นี่เป็น static inspection ของ bundled files เท่านั้น.
Library font ปัจจุบันยอมรับ numeric weight 1–1000 (`fonts/validateSelection.ts:4`)
และ select exact face ตาม release/weight/style. DOCX embedding API มีสี่ face slots;
ต้องพิสูจน์ alias/family strategy สำหรับหลาย release และน้ำหนัก เช่น 500/600
โดยไม่ synthetic bold หรือเปลี่ยนเป็นคนละ face. ต้องคง license/hash checks ของแต่ละ font.
Source/library acceptance ยังไม่ผ่านจากการอ่าน flags เพียงอย่างเดียว.

สำคัญ: `Packer.toStream()` ของรุ่นที่เลือก compile document แล้วเรียก
`zip.generateAsync({type:'nodebuffer'})` จากนั้น emit ZIP ทั้งก้อนเป็น data event.
จึงยังมีทั้ง document/media model และ compressed output ใน RAM.
Source ของ method ไม่มี AbortSignal หรือ maxBytes;
การจำกัด sink หลัง pack ไม่จำกัด peak memory ตอน pack และการทำลาย exposed stream
ไม่เท่ากับยกเลิก compression. Source:
[pinned Packer lines166–182](https://github.com/dolanmiu/docx/blob/c98bc7351b76333d84c0cf8c2cddc538f7b37bf5/src/export/packer/packer.ts#L166-L182),
[compiler](https://github.com/dolanmiu/docx/blob/c98bc7351b76333d84c0cf8c2cddc538f7b37bf5/src/export/packer/next-compiler.ts).

ข้อเสนอ: generation อยู่ใน Service-owned child process เดิม มี input/media/font
bounds และ parent-controlled termination ตาม policy. ไม่ใช้ `Promise.race` แล้ว
คืน error ขณะที่ compressor ยังทำงานหลุด ownership. ยังไม่อนุมานว่า 2 workers
ภายใน 1-GiB profile ปัจจุบันปลอดภัยกับ DOCX; ต้องวัดเฉพาะ bounded probe ที่กำหนด.
หากต้องทำ ZIP adapter จริงให้เป็น implementation scope ที่ตกลงแยก;
เปลี่ยนเป็น JSZip generateNodeStream ก็ยังไม่ลบ retained document/media model.

Word refresh: pinned documentation ระบุว่า TOC page numbers รอ Word update และ
`updateFields:true` อาจมี prompt เมื่อเปิด. `docx/layout` มี estimator แต่ยังไม่มี
หลักฐานว่าตรง Word/FlowDoc; ไม่เลือกเป็น authority ของเลขหน้ารอบนี้.
ตรวจและเปิดเผยทั้ง initial view และผลหลัง refresh; ห้ามอ้าง cached PDF numbers.
[Pinned TOC guidance](https://github.com/dolanmiu/docx/blob/c98bc7351b76333d84c0cf8c2cddc538f7b37bf5/docs/usage/table-of-contents.md),
[Microsoft field-update procedure](https://support.microsoft.com/en-us/word/update-fields).

### Proposed interfaces and unresolved contracts

Proposal สำหรับ bounded proof; **ยังไม่ freeze เป็น accepted implementation API**:

- `createDocxEngine(resources: DocxResources): Promise<DocxEngine>`;
  `DocxResources` ใช้ existing `FontResource[]`/license identities และ private temp root,
  ไม่บังคับพ่วง Python shaper paths ของ PDF ให้ DOCX.
- `generateDocxTo(document: ResolvedDocument, images: DocxImageProvider,
  output: DocxOutput, options: DocxOptions): Promise<Result<DocxArtifact>>`.
- Provider อ้าง PNG/JPEG, byteLength/SHA256, pixel dimensions และ immutable resource id;
  reads ผูกกับ verified private copies/chunk bounds; document props คง frame dimensions.
- `DocxOutput` มี awaited `write(Uint8Array)`/`abort(reasonCode)`;
  receipt มี media type/byteLength/SHA256/fontUsage และไม่สร้าง pageCount เทียม.
- Options ต้องมี byte/resource bounds และ abort semantics ที่ตรง source จริง.
  Signal checks ก่อน/หลัง packing ไม่ใช่ in-process immediate cancellation ระหว่าง pack;
  hard stop เป็นหน้าที่ owned process boundary. Numeric memory/input caps ยังไม่เลือก
  ก่อนมี bounded measurements. เพราะเหตุนี้ Stage 0 interface-freeze checkbox ยังเปิด.

| Blocker | ข้อเสนอ/หลักฐานที่ต้องได้ก่อนเปิด dependent implementation |
| --- | --- |
| B1 group label ต่อหน้า | ทดลอง native strategy กับหลายกลุ่มชื่อซ้ำ, single member ยาว, empty group, repeated headers; label/suffix ต้องตาม Word fragment จริงโดยไม่ duplicate สมาชิก |
| B2 page-relative bands/body budget | ทดลอง first/continuation modes กับ protected row ที่ต้องย้ายหน้าและ body budget ต่างกัน; ตรวจ explicit no-inheritance และไม่ทับ/ตัดเนื้อหา |
| B3 counted totals/scoped TOC | ทดลอง excluded cover/section, restart/hide, blank และ headings ในตาราง; ตรวจ Word refresh ทั้งก่อน/หลังและ exclusion semantics ของ target page |
| B4 fixed frame completeness | ข้อเสนอ fail-closed เมื่อยังรักษา frame และเนื้อหาทั้งหมดพร้อมกันไม่ได้; adaptation ต้องเป็นข้อตกลงใหม่ที่ชัดก่อน implement ไม่ตัด tail ให้เหมือน PDF |
| B5 exact font/image resources | พิสูจน์ exact face หลายน้ำหนัก/หลาย release, embedded Thai marks, PNG alpha/contain, stable private identity และ resource failure behavior; normalizer ที่ omit รูปต้องเป็น DOCX failure พร้อม findings ไม่ใช่ partial success |
| B6 packing memory/cancel | วัด document/media/font/ZIP lifetime บน bounded fixture, terminate เฉพาะ owned child ระหว่าง pack, ตรวจ no partial artifact/process leak และยังรักษา queue/resource policy |

การพบ blocker ไม่ได้แปลว่าเปลี่ยนไปใช้ library อื่นแล้วหาย; จุดหลักผูกกับ
Word pagination และ semantics ที่ FlowDoc กำหนด. ขณะนี้ไม่มีหลักฐานพอให้สัญญา
ครบทุก feature ด้วย `docx` หรือด้วย alternatives ที่ตรวจ.

### Hash-pinned inputs and coverage

เลือก source set ที่ commit Core `8f8a739aea5597b6d8c9932c790f9bd716e8ebc7`:
11 groups / 26 files. ยังไม่ copy ไปสร้าง export run และไม่ execute fixture builders.
Group digest คำนวณจาก raw working-copy bytes ณ inspection; ตาม file order ในตาราง:

```text
fileHash = lowercase SHA256(raw file bytes)
groupHash = SHA256(UTF8(concat(relativePath + NUL + fileHash + LF)))
```

ต้องตรวจ hash ซ้ำก่อน replay; ถ้า line endings หรือ bytes เปลี่ยนให้รายงาน mismatch
แทนการอ้างว่าเป็น input เดิม. ผล output สองชนิดต้องใช้ exact paired bytes/resources
จาก set เดียวกันในขั้นทดลองที่ได้รับอนุญาต.

| Group / Core-relative files ตามลำดับ | Coverage | Group SHA256 |
| --- | --- | --- |
| `fixtures/table/{template,short,long,empty}.json` | model18, grid/header, input length/empty | `b5bc6769de9d517d91eee9881300fa39b91202dd9ad72541c0c9bd0e45e02d80` |
| `fixtures/srs-basic/{template,request}.json` | model18 representative text/data | `f4cd737509e6eab2a349ca73b28668051a2e2581d3c68708de38904bc44ba50f` |
| `fixtures/row-groups/{template,request}.json` | model18 groups/repeats | `f2fba76c6e7fe580d016150789bc41fa189e641b1af62f7cfe730309cd208d71` |
| `fixtures/page-bands/{template,request}.json` | model18 weighted band columns | `4c1b4910ae22e87b9efdd375fa1326f5dc27f7585a21ec808edd984991adfeda` |
| `fixtures/page-numbering/{template,request}.json` | model18 numbering policies | `80fa7ffe6b137b12440438e96a33f6d791bc383fe5460c76857629ab8826a9b3` |
| `fixtures/cover-pages/{template,request}.json` | model18 cover/blank | `055ac62ecaddaf4dd3ef81ab0fb9dac114012cdaac3e415fb4e2d1bbcbb39301` |
| `fixtures/scoped-contents/{template,short,long}.json` | model19 scoped TOC and repagination | `1a7752677bd1f3c2260147b96f7cd1bbf5797b7e70ed979701c6cfaae077dc0f` |
| `fixtures/format-sizing/{template,request}.json` | model19 fixed/auto and negative completeness cases | `d37a4188a5ac3a3be62ea379be03369d389d5b79c5963f55b232d54f50ba6de8` |
| `fixtures/area-cover/{template,request}.json` | model19 authored area composition; ไม่ใช่ cover role | `e4bf4ed70b9dc2e89aba5ea35ca751b700c61e24cf225c276f29de4cb45061ba` |
| `fixtures/page-sections/{template,request}.json` | model18 per-section geometry/order | `3984ebcf26c8c3b9eda90a04a6602c063f38df681f176cb55d83574278bf9c10` |
| `fixtures/stream-images/{manifest.json,image-0.jpg,image-1.png}` | JPEG + alpha PNG encoded sources; resource fixture ไม่ใช่ complete document | `66b5fa6afcf05ed09edca2976997587e1bd8dabcb63b885c3157ad3150f3010b` |

Resource source SHA256: `resources.json` =
`7d32ef190b43587f35d3b6a04755558aaa629b8e77859f7d28a47cb4d46c6ede`;
`assets/fonts/OFL.txt` =
`be28652aa304594809e7174cd0206f8b9381a719a581fc429955c04de0f3ad1a`.
Bundled Sarabun font bytes inspected:

| Face under `assets/fonts/` | fsType | SHA256 |
| --- | --- | --- |
| `Sarabun-Regular.ttf` | 0 | `b8150084e25734e6f31696c57ff009f5564efa09d295848b717d9e2328c0311d` |
| `Sarabun-Bold.ttf` | 0 | `5d1fc1ee63ab861fb2022a212b5ff270848582bb9d9cba73b2d2aaabb16d0a18` |
| `Sarabun-Italic.ttf` | 0 | `fb86138e0cf99786db40715a84df51508766371e2f1f2822faf22cba6563acc7` |
| `Sarabun-BoldItalic.ttf` | 0 | `a497ef98fad371e04bc64076b213da00c05a84881494ee36a4c61922c65ff7ef` |

Coverage gaps: ยังไม่มี serialized group-label request ใน Service fixture
(`tests/fixtures/group-label/template.json` มี examples ว่าง); ใช้
Core `tests/helpers/groupLabels.ts` และ `tests/layout/groupLabelFlow.test.ts`
เป็น recipes สำหรับขั้นทดลองที่ได้รับอนุญาต. Helper SHA256:
`c266e2adbd977bc69d48ff57404faa9aa2c574613d939db4ca01987658d3932d`.
Merged/links/fixed Thai marks/band-intrusion/omitted-anchor cases บางส่วนยังอยู่
ใน existing test builders; ยังไม่ได้ serialize เป็น paired candidate inputs.
Hash ของ helper ไม่ใช่ hash ของ input ที่ยังไม่ได้สร้าง.

### Discovery closeout and proposed next checkpoint

**Completed:** source matrix, published tool selection, static resource/packing
limitations และ hash-pinned starter input set. **Not completed:** prototype,
accepted resource/interfaces contract, Word behavior/rendering, performance/memory
proof และ product integration. Stage 0 source/docs discovery สิ้นสุดได้พร้อม blockers;
Stage 1 implementation-entry prerequisites ยังไม่ผ่าน.

ข้อเสนอรอบถัดไปเพื่อ review: bounded experimental implementation ในพื้นที่แยก
เฉพาะ six blocker cases B1–B6, ตรวจผลจริงใน Word และ packing lifecycle.
เลือก contract ที่รักษาเนื้อหาครบจากผลทดลองแล้ว freeze interfaces/limits ในแผนนี้.
ไม่เริ่ม product integration, DB migration หรือเปลี่ยน installed plugin ระหว่าง probe.
ถ้าพฤติกรรมใดทำไม่ได้ตามสัญญา ให้รายงานทางเลือกและความต่างก่อนขยาย scope.

Verification ของเอกสารผลสำรวจ: `git diff --check`, local links/anchors,
`npm run check:data` และการคำนวณ group hashes ย้อนกลับจากตารางทั้ง
11 groups / 26 files ผ่าน. Source inspection รวม font headers/metadata
เป็น read-only; Core และ Service ไม่มี tracked/untracked changes.
ไม่มี runtime/library/rendering test จึงไม่อ้าง DOCX/PDF regression PASS.

## Prototype checkpoint

Owner authorization: ทดลอง six blocker cases B1–B6 ด้วย `docx@9.13.0`
ในพื้นที่แยก ตรวจใน Microsoft Word และสรุปก่อนเอาเข้าระบบจริง.
Checkpoint date: 2026-10-20. **ทดลองและตรวจครบตาม bounded sample;
ยังไม่ผ่าน feature acceptance ทั้งระบบและไม่เริ่ม product integration**.

Experiment root:
`C:/Users/nekot/Documents/Codex/2026-10-20/docx-prototype-9130`.
พื้นที่นี้แยกจาก product checkout; การเขียนผลทดลองจำกัดอยู่ใน root นี้.
Work Size medium / Risk routine; role Planning Partner + Evidence Reviewer.
Work/Phase/Checklist/execution IDs N/A ตาม single-room rules.
Proof Budget: 9 original DOCX, B3 diagnostic derivatives ที่เก็บแยก,
9 Word-exported PDF / 16 pages และ Core reference PDF / 1 page;
package/resource checks และ bounded pack/cancel probes. ตรวจภาพครบทั้ง 17 หน้า.
Document Budget: อัปเดตแผนเดิมนี้หนึ่งไฟล์; ไม่สร้าง Work/report/map records ใหม่.

Environment: Node `24.19.0`, local `docx` exact `9.13.0`, released Core `0.4.7`,
Windows Word file/product version `16.0.20430.20182`.
Package lock อยู่เฉพาะ experiment root; ไม่รัน install scripts.
Core tarball SHA256 `13673f22cca9667e88125dd4631b0b398c912b8e96c6734a2932b5ff27f3a8ad`.
PDF reference รันจาก installed image identity
`sha256:9d76527509c0bed79350dc823e34d7e5fa1ab7ea4176e95277bb57af5a06b723`
ใน disposable container, network none / 256 MiB / 1 CPU / read-only inputs.
ไม่เรียก generation API หรือ DB; container ถูกลบหลังจบ.

### Evidence boundary and replay locators

Paths ต่อไปนี้ relative ต่อ experiment root. นี่เป็น local experimental evidence,
ไม่ใช่ registered production Evidence และไม่ใช่ source of product truth:

| Locator | สิ่งที่ตรวจย้อนกลับได้ |
| --- | --- |
| `evidence/generation.json`, `inputs/` | source descriptors, expected tokens, original output hashes และ exact shared Core resolved document |
| `outputs/`, `outputs/diagnostics/` | 9 original DOCX, Core reference PDF และ B3 candidates ที่ไม่เขียนทับต้นฉบับ |
| `word/` | Word-exported PDFs และ B3 Word-saved DOCX หลังอัปเดตสารบัญ |
| `renders/`, `evidence/word-render-manifest.json` | PDF source hashes และ full-page PNGs ที่ตรวจทุกหน้า |
| `evidence/independent-package-audit.json` | ZIP/XML integrity, content/order, decoded font hashes และ original image bytes |
| `evidence/independent-word-text-audit.json`, `evidence/independent-visual-review.json` | extraction เทียบ source และผลตรวจภาพ; extraction ไม่ใช้แทน visual completeness |
| `evidence/b3-word-audit.json`, `evidence/word-font-subset-audit.json`, `evidence/word-image-audit.json` | fields/links, actual font subset metadata และ image placement/alpha |
| `evidence/b6-*-receipt.json`, `logs/b6-*.jsonl` | pack lifecycle, memory observations, failed attempt และ corrected cancellation |
| `evidence/prototype-review.json`, `evidence/artifact-manifest.json` | root review observations, coverage gaps และ file hashes ของ review package |

B0 ใช้ actual public Core validate → prepare → compose จาก exact
`fixtures/table/{template,short}.json`; resolved JSON เดียวกันป้อน Core PDF
และ disposable DOCX subset mapper. B1–B5 เป็น source-backed experimental
recipes ที่แปลงเป็น native Word constructs โดยตรง; **ไม่ใช่ full Core writer**.
ไม่ได้ replay starter groups ทั้ง 11 groups / 26 files ผ่าน writer ครบทุก feature.
การที่ Word เปิด recipes ได้จึงไม่พิสูจน์ mapping ของทั้ง node models 18/19.

### Six blocker results

| Case | ผลใน Word / probe | ผลต่อการตัดสินใจ |
| --- | --- | --- |
| B1 group label continuation | Native vertical merge 2 หน้า: member tokens ทั้ง 75 อยู่ครบครั้งเดียวตามลำดับ, header columns ซ้ำ, same-name groups แยกกันและ empty group อยู่ครบ; แต่ label ของ G0 บนหน้าต่อว่าง. One-table-per-group ซ้ำหัวกลุ่มได้ แต่ย้าย label ไปเป็นหัวตารางและยังไม่มี continuation-only `(ต่อ)` | **FAIL exact continuation semantics**; มีทางเลือกที่รักษาเนื้อหา แต่ต้องตกลงรูปแบบก่อนใช้. ไม่ duplicate สมาชิกเพื่อแก้ label |
| B2 bands/body budget | 3 หน้า: first-header เฉพาะหน้าแรก, continuation-footer เฉพาะหน้าต่อ; protected row 6 บรรทัดย้ายไปหน้าที่ 2 ทั้งแถว; section ถัดไปไม่ inherit bands. ไม่เห็น overlap/clip ในตัวอย่าง | **PASS bounded recipe**; ยังไม่พิสูจน์ general first/continuation body-budget solver หรือ arbitrary columns/bands จาก Core |
| B3 numbering / scope / links | Corrected candidate 4 หน้า: cover ซ่อน fields, PAGE เป็น hidden/1/5/6, raw NUMPAGES 4, counted total 3; หลัง Word update TOC มีเฉพาะ 3 scoped headings รวม heading ใน table ด้วยเลข 5/5/6. PDF links 5 จุด resolve ถูก; native Word jump ไป body-two และกลับ table target ถูก | **PASS bounded Word behavior / RISK cached fields**; สูตรนี้หัก cover ที่กำหนดไว้ 1 physical page เท่านั้น. Arbitrary excluded/blank pages และ general counted-total policy ยัง UNKNOWN |
| B4 fixed-frame completeness | exact 60-pt row เห็นเพียง tokens 01–03, tokens 04–18 ถูกตัด แม้ XML และ PDF extraction ยังพบทั้ง 18. แบบ at-least height เห็นครบทั้ง 18 และ sentinel ไม่ทับกัน | **FAIL exact fixed height + complete content**; auto-height เป็น explicit adaptation ที่เปลี่ยน sizing contract. Preflight reject ใน prototype เป็น conservative check ของ recipe ไม่ใช่ proof ของ Core overflow detector |
| B5 fonts / images | normal Thai marks ครบ, bundled regular/bold/italic/boldItalic และ exact 500/600 + old/current release เป็น distinct embedded faces จริงตาม PDF font metadata. DOCX font payloads ถอดแล้วตรง source hashes; PNG alpha เห็น checkerboard, JPEG 3:2 อยู่กลาง frame พร้อมช่องบน/ล่างประมาณ 32 px | **PASS bounded visual/resource identity**; tight 8-pt diagnostic lines overlap. ยังไม่พิสูจน์ generic font fallback, corrupt/missing-resource failure, atomic private snapshot หรือ normalizer omission guards |
| B6 pack / memory / cancel | 9-doc generation child exit 0/reaped, sampled working set 92 MiB. Small 400-paragraph probe self-reported RSS สูงสุดที่ log 64.46 MiB, output 26,733 bytes. Corrected IPC cancellation หยุด owned child ที่ ZIP start, reaped และไม่มี final/partial artifact | **PASS process-boundary cancel / UNKNOWN capacity**; ไม่ใช่ in-process AbortSignal, peak-memory ceiling, concurrency หรือ 2-worker / 1-GiB acceptance |

B0 เพิ่มหลักฐาน shared-input path: ข้อความและ topology ตารางอยู่ครบ แต่ Word
row height ประมาณ 20.53 pt เทียบ Core 28 pt เพราะ subset mapper ยังไม่ map
cell padding/row sizing ครบ. จึงไม่อ้าง near-PDF geometry acceptance จาก B0.

### Failed attempts and Word update limits

- Original B3 เปิดใน Word ไม่ผ่านเพราะ prototype ใช้
  `ImportedXmlComponent.fromXmlString()` แล้วเกิด invalid `<undefined>` wrappers
  ใน footer3/footer4. XML parsing เพียงอย่างเดียวตรวจไม่เจอ schema defect นี้.
  เก็บ original ไม่เปลี่ยน; minimal derivative แก้เฉพาะ wrappers สอง footer parts.
  Corrected source ใช้ public component constructors และสร้าง footer XML ตรง
  minimal derivative. Word เปิด corrected-source candidate ได้; ไม่ใช่ข้อสรุปว่า
  Word ไม่รองรับสูตรหรือว่า production writer ถูกแก้แล้ว.
- B3 เปิดโดยตอบ No ต่อ update prompt เพื่อดู initial TOC: entries ยังไม่มีเลขหน้า.
  ใช้ Ctrl+A → F9 → Update entire table; ได้ 5/5/6 แล้ว Save As เป็นสำเนาใหม่
  และ export PDF ด้วย Word. Word PDF แสดง fields ถูก แต่ Word-saved DOCX ยังมี
  `REFRESH` caches ของ PAGE/NUMPAGES ในบาง footers; complex formula cache เป็น 3.
  ห้ามสัญญาว่าผู้รับทุก viewer เห็นค่าถูกก่อน refresh หรืออ้าง cached PDF page count.
- Word save ขยาย B3 จาก 193,799 เป็น 1,809,394 bytes และเพิ่ม style/default font
  embeddings; PDF ยังใช้ Sarabun. ไม่ใช้ Word-saved bytes แทน generator output
  โดยไม่เปิดเผย และไม่กำหนดให้ export server ต้องมี Word.
- Initial B6 cancellation แบบ polling ช้าเกินไป: child exit 0 และมี final ZIP.
  Receipt แม้เขียนเหตุผล cancel ก็ยัง **FAIL**. Corrected IPC attempt แยก receipt:
  child SIGTERM/reaped, จบที่ ZIP start, ไม่มี ZIP end/output, 352.16 ms รวม;
  self-reported RSS ล่าสุด 108.12 MiB. ค่านี้ไม่ใช่ peak working set.
- Host safety floor 1,536 MiB และ child cap 384 MiB ใช้เฉพาะ bounded experiment;
  ไม่ใช่ production limits ที่ freeze แล้ว. ไม่ปิดโปรแกรมหรือเอกสารที่ไม่เกี่ยวข้อง.
- `render_docx.py` ผ่าน LibreOffice ไม่สร้าง PDF และจบด้วย render/profile-lock error;
  ไม่ใช้เป็น PASS. Primary visual evidence มาจาก Word export แล้ว render ด้วย Poppler.
  ไม่มีการทดสอบ LibreOffice/Google Docs/viewer อื่นผ่านรอบนี้.

### Decision and remaining entry prerequisites

คง `docx@9.13.0` เป็น implementation candidate ได้จาก primitive/resource behavior
ที่เห็นจริง; **ยังไม่เปิด product integration**. สิ่งที่ต้องตกลง/ทำก่อน dependent stage:

1. เลือก semantics ของ group label ต่อหน้า: รักษาด้านข้างแบบเดิมยังไม่ผ่าน;
   repeated group header เปลี่ยนหน้าตาและไม่มี suffix เฉพาะหน้าต่อ.
2. จำกัดหรือพิสูจน์ counted-total policy ที่กว้างกว่าสูตร one-page excluded cover;
   ระบุ field-refresh requirement และ initial-view behavior ให้ชัด.
3. ยืนยัน fail-closed สำหรับ fixed content ที่ตรวจความครบไม่ได้;
   auto-height ต้องเป็น adaptation ที่ตกลง ไม่ใช่ implicit fallback.
4. ทำ writer/provider จาก actual ResolvedDocument พร้อมครบถ้วน/identity/negative
   checks และ freeze resource bounds/interfaces จากหลักฐานที่เหมาะกับ runtime.

Stage 0 semantic/interface prerequisites ที่ยังไม่ผ่านคง checkbox เปิด;
Stages 1–5, API/header/default-PDF regression, DB migration, queue/consumer
และ production capacity ยังไม่รัน. ข้อตกลง `Output-Format` omitted → PDF เดิมคงอยู่.
ไม่มีการเปลี่ยน system map, DOCUMENT_MAP หรือ promoted production Evidence.

Closeout: checkpoint **PASS as an experiment with explicit FAIL/RISK/UNKNOWN results**.
Core/Service source heads และ clean status ไม่เปลี่ยน; original 9 DOCX hashes คงเดิม.
ปิดเฉพาะหน้าต่างต้นแบบหลังเก็บหลักฐาน และคงเอกสาร Word ของผู้ใช้ที่เปิดอยู่ก่อน.
Verification ของแผน: diff/whitespace, local links/anchors และ `npm run check:data`.
ไม่มี canonical data เปลี่ยนจึงไม่ regenerate projections; ไม่อ้าง product test PASS.

## Existing SRS checkpoint

Owner authorization: ทดสอบกับโครง SRS ที่มีอยู่ในระบบประมาณ 98 หน้า;
เจ้าของยืนยันว่าไม่สร้างโครงใหม่. Checkpoint date: 2026-10-21.
**ผล: shared-input composition และ static DOCX coverage ผ่าน;
Word/layout acceptance FAIL จึงยังไม่เริ่ม product integration.**

Experiment root:
`C:/Users/nekot/Documents/Codex/2026-10-21/docx-srs-9130`.
Role: Planning Partner / Evidence Reviewer. Work Size medium / Risk routine;
Work/Phase/Checklist/execution IDs N/A สำหรับ single-room disposable experiment.
Allowed mutation: experiment root และแผนเดิมนี้หนึ่งไฟล์.
ไม่แก้ template/draft, product source, DB, API, installed runtime หรือ maps.
Proof Budget: exact existing SRS input freeze, public Core composition,
paired Core PDF เทียบครบ 98 หน้า, two DOCX candidates และ actual Word attempts;
หยุดหลัง Word ไม่ตอบสนองซ้ำ ไม่ขยายเป็น unbounded repair/integration.

### Exact existing source and shared path

- Live draft `008980f5-dd0d-4f7d-86be-2fc3f300e08d`, docKey
  `ttt-spaceship-srs-native-full-011-20261015`, name
  `SpaceShip SRS complete source trial (explicit Areas)`;
  revision 1, model 18, 7 sections. Fingerprint
  `ffcde8736980748a950fb56c2c786b66ef0f52d482ac383a7e31a91ef0a62f02`.
- เลือก original input เฉพาะ preview identity/revision/fingerprint ที่ตรงกันจาก
  installed 0.4.9/0.2.8 backup; ไม่ใช้ capacity-030 หรือ derived two-section queue fixture.
  Canonical original-request serialization SHA256
  `b8ea15e30f0c90d53f81b74c8250b8f3a89d55ad0dc336c24f32c22cfa049aa0`;
  ค่านี้ไม่ใช่ raw backup-file hash. สำเนาสำหรับ offline composition เอาออกเฉพาะ
  transport `uploadId`; business data/sections/resource IDs คงเดิม.
- Existing reference PDF: 98 pages / 2,559,955 bytes, SHA256
  `cd2fde00ea5273c889498eb490ff2e1fa945f7e4fbdc74cd65f25bbb9643ebf1`.
  ตรึง raw PNG ต้นทางครบ 13 resources พร้อม source paths และ hashes.
- ใช้ released Core 0.4.7 public `validateTemplate` → `prepareGeneration` →
  `composeDocument` เหมือน Service; ทุก stage OK, warnings ว่าง.
  Exact ResolvedDocument raw-file SHA256
  `920976069d27da172193fb253e1c3b313299327a6f7994755fb2b927bfdfa301`
  เป็น input ร่วมของ PDF และ disposable DOCX adapter.
- ใช้ installed Service image เดิมและ `prepareImage` helper สร้าง 13 prepared
  variants ในพื้นที่แยก; ไม่เรียก DB-owned preparation helper หรือ HTTP generation.
  มี `IMAGE_LOW_RESOLUTION` 4 รายการ; ไม่ข้ามรูปและไม่แสดงว่า warnings นี้หายไป.
  DOCX embeds exact prepared PNG bytes; paired PDF ใช้ RGB/alpha จาก bytes ชุดเดียวกัน.
- Existing SRS นี้ระบุ `continue` ทุก section และ cover `visibility: hide`;
  จึงนับหน้าปกรวมด้วย. ไม่ใช้สูตร `NUMPAGES - 1` หรือ restart body จาก B3.

### Results and acceptance coverage

| Criterion | Evidence / result | Boundary |
| --- | --- | --- |
| Existing SRS identity and no template rebuild | `evidence/source-freeze.json`, `compose-result.json`, `input-immutability.json`; frozen 19 files unchanged and live revision/fingerprint checked again | ไม่ได้เปลี่ยน draft หรือสร้าง SRS ใหม่ |
| Paired PDF from exact resolved/resource set | `outputs/srs-paired-core.pdf`, SHA256 `e368da46a89ca81b07931a30366a0210fbc6e4cd4a7c771969fbaf12df13cfb2`; `evidence/paired-core-alpha-retained-comparison.json` | 98/98 pages: decoded content/resources, text, geometry, link targets/coordinates และ 80-dpi pixels ตรง reference; ไม่ใช่ DOCX visual proof |
| Native DOCX content/order | `evidence/audit-mapping-v2.json`, `docx-inline-v2-package-audit.json` | 1,814 nonempty body paragraphs ตรง source ทุกข้อความและลำดับ; 198 heading texts/levels/order และ native TOC entries ครบ; เป็น XML/package proof |
| Tables and pictures | Same static audits plus `docx-generation.json` | 200 tables / 933 rows / 1,932 cells / 197 column spans; body images 371 placements, 13 exact prepared media; section order 7 และ internal link targets 198 resolve. ยังไม่พิสูจน์ว่า Word แสดงครบโดยไม่มี overlap/clip |
| Actual Word opening / stable layout / export | Two actual Word attempts on `16.0.20430.20182`, `evidence/srs-review.json` | เปิดผ่าน field/TOC prompts และเห็นหน้าปก แต่ค้างระหว่าง Save As DOCX รอบแรกและ PDF export รอบสอง; ไม่มี completed Word PDF หรือ Word-saved DOCX ที่ใช้ตรวจทุกหน้าได้: **FAIL** |
| Near-PDF appearance, Thai shaping, table continuation, TOC/page fields after refresh | No completed Word rendering | **UNVERIFIED**, ไม่ใช้ static content checks หรือ PDF parity มาแทน |
| Production/API behavior | No product mutation/tests in this checkpoint | `Output-Format` omitted → PDF ยังเป็นข้อตกลง; ไม่ใช่ tested API implementation |

### Two candidates and observed limits

1. V1 `outputs/diagnostics/srs-floating-v1.docx` (same bytes also in
   `outputs/srs.docx`): 1,080,150 bytes, SHA256
   `a00a41fd3c3deb17255a1ff40bede02b46a2453955fc384a73aa13114156da2a`.
   ใช้ native floating body images และ page-relative floating band canvases.
   Word เปิดและเริ่ม update entire TOC ได้; Save As ค้างต่อเนื่องหลายนาที,
   observed process working set 564 MiB. `word/srs-refreshed-v1.docx` เป็น 0 bytes
   จึงเป็น failed output ไม่ใช่ deliverable. เจ้าของช่วยปิดเฉพาะหน้าต่างทดลอง.
2. V2 `outputs/srs-inline-v2.docx`: 1,078,500 bytes, SHA256
   `e91797dec4fafc29d8ac90fc53d5ada58acc640c093d1d3bf322b25bb5f77223`.
   เปลี่ยน body images เป็น inline พร้อม minimum line height เพื่อทดสอบสมมติฐาน
   เรื่อง image anchors; source contain ratio คงเดิม แต่ Word baseline อาจเพิ่ม
   frame/row height. PAGE/NUMPAGES result runs แก้ให้ระบุ Sarabun 9pt ชัดเจนทั้ง
   font slots และ complex-script size; static audit ยืนยันครบ 36 fields.
   Band canvases ยังเป็น floating tables. Word เปิดได้ แต่ PDF export ค้างซ้ำ
   เกินสองนาทีและไม่มี PDF สำเร็จ. เจ้าของช่วยปิดรอบสอง;
   **ยังไม่พิสูจน์ root cause และห้ามสรุปว่า inline images แก้ Word hang ได้**.

การแปลงนี้รองรับ actual node/property set ของ SRS นี้ ไม่ใช่ full generic writer.
Table group keep-start ใช้ Word paragraph keep rules ซึ่งไม่ใช่ Core measured
fragment algorithm. Fixed blocks ที่พบเป็นเพียง empty cover spacers สองจุด;
ไม่มี nonempty fixed-frame, row spans, per-fragment group labels หรือ selective
excluded-page policy ใน SRS นี้ จึงไม่เพิ่ม coverage ของช่องว่างเหล่านั้น.
Band sizing วัดจาก source recipe และยังไม่ใช่ arbitrary Word-wrap solver.
Unknown types/properties/resources ที่ตัวทดลองตรวจพบต้อง fail แทนการข้าม.

Failed-attempt provenance คงไว้ใน receipts/logs: package metadata import ครั้งแรก
ชน package exports; subsequent diagnostic output rename ชนไฟล์ที่ Word ยังล็อก.
แก้เฉพาะ disposable scripts/output naming. Initial paired PDF elided fully opaque
alpha planes จึงต่างเพียง image-edge raster pixels; independent audit ยืนยัน alpha
ทั้งหมดเป็น 255 แล้ว rerender โดยคง SMask ได้ exact all-page parity ตามตาราง.
ไม่ได้แก้ต้นทางเพื่อให้ comparison ผ่าน.

Generation child เป็น owned process, 512-MiB sampled working-set cap,
1,536-MiB host floor / 90-second deadline; successful V2 generation exit 0/reaped,
sampled working set 323 MiB, pack ประมาณ 671 ms. เป็นหนึ่งการสังเกตของ full SRS;
ไม่ใช่ production capacity, Word memory bound, concurrency หรือ peak-memory proof.
Disposable containers network none / 1 CPU; image prep cap 256 MiB,
paired PDF cap 768 MiB; ลบ containers หลังจบ.

### Checkpoint decision

**FAIL Word/layout acceptance; input reuse and static mapping PASS within this SRS.**
ไม่ควร promote DOCX เหล่านี้เป็นเอกสารพร้อมส่งหรือเอา writer เข้าระบบจริง.
Next recommended work คือ bounded Word-layout diagnosis โดยแยก band canvases,
TOC refresh และ table pagination ทีละปัจจัย พร้อม reproducer และเกณฑ์หยุด;
ยังไม่ถือว่าส่วนใดเป็นสาเหตุจนมีผลทดลองแยกยืนยัน.
เมื่อ Word จัดหน้า/export สำเร็จ จึงตรวจภาพทุกหน้าและเทียบ source ก่อนตัดสิน
near-PDF acceptance. ไม่เพิ่มหลักฐานซ้ำของ PDF/input ที่ผ่านและไม่เปลี่ยน SRS structure.

Core/Service working trees clean และ source heads คงเดิม:
`8f8a739aea5597b6d8c9932c790f9bd716e8ebc7` /
`ca66f605b02a41d1bc3b05894fbc75f5224d4900`.
ไม่มี production Evidence/map updates. ตรวจแผนด้วย diff/whitespace,
local links/anchors และ `npm run check:data`; canonical data ไม่เปลี่ยน
จึงไม่ regenerate projections. เก็บ two candidates เป็น diagnostics เท่านั้น.

## Word diagnosis pause checkpoint

วันที่ 2026-10-21 เจ้าของอนุญาตให้แยกหัวหน้า ท้ายหน้า สารบัญ และการแบ่งตาราง
โดยใช้ SRS เดิมในพื้นที่ทดลองเท่านั้น แล้วสั่ง **หยุดการทดลองไว้ก่อน** ระหว่าง
กรณี `d-footer-only`. สถานะปัจจุบันคือ owner-paused; ไม่ใช่ completed/cancelled
และไม่เปิด registered execution เก่ากลับมา. IDs N/A ตาม single-room scope.
Owner/role/boundary เดิมคงอยู่; หลักฐานรอบนี้อยู่ใน experiment root เดิมใต้
`diagnosis/`. ไม่มี product/template/DB/API/runtime mutation.

การแยกปัจจัยใช้ ZIP derivatives ของ exact V2 SHA256 `e91797dec4fafc29d8ac90fc53d5ada58acc640c093d1d3bf322b25bb5f77223`.
ตรวจอิสระว่าคง body XML, margins, source text, 200 tables / 933 rows / 1,932 cells,
371 body images, media bytes, headings/bookmarks และ 7 sections ตามที่แต่ละ
factor ประกาศ. การปิด band stories เป็น diagnostic omission ที่ตั้งใจไว้;
ไม่ใช่เอกสารพร้อมส่ง. Proof scope คือ diagnosis เท่านั้น ไม่ใช่ production fix.

| Actual Word case | ผลที่วัดได้ | ความหมายที่ยืนยันได้ |
| --- | --- | --- |
| D00: ไม่มี band stories และล็อก outer TOC | PDF 99 pages / 923,215 bytes; write end 13,406 ms หลังคลิก export | เป็น positive control; outer lock ยังเหลือ 198 nested PAGEREF fields จึงไม่ใช่ fully static TOC |
| D01: ไม่มี band stories, native TOC active และ update entire table | PDF 99 pages / 969,611 bytes; write end 13,285 ms หลังคลิก export | การอัปเดตสารบัญและ original body-table pagination ทำงานได้ในกรณีนี้; นอก TOC pages 4–9 ข้อความ/geometry/image counts ตรง D00 ครบ 93 pages |
| Header only: คืนเฉพาะหัวหน้า, body/TOC เดิม | Word แจ้งทันทีว่า “การส่งออกล้มเหลว ไม่สามารถเตรียมเอกสารดังกล่าวเพื่อส่งออกได้”; ไม่มี completed PDF | Header mapping family ทำให้เกิด explicit export error ในการทดลองนี้; ยังไม่ยืนยันว่า nested image anchor หรือ floating canvas เป็นกลไกที่ผิด |
| Footer only: คืนเฉพาะท้ายหน้า, body/TOC เดิม | ไม่มี completed PDF ภายใน 300 seconds; Word ไม่ตอบสนอง, Escape request timeout; เจ้าของสั่งหยุด | เป็น bounded timeout ไม่ใช่ proof ของ infinite loop; ยังไม่ได้ทดสอบ footer-flow correction ใน Word |

D00 image audit: 371 placements ตรง asset identity/order/counts และ contained
dimensions; decoded RGB ของ 12 body variants ตรง prepared bytes.
แถวยาว REQ0041 (source lower bound 1,470.32 pt, allowBreak=true) แบ่งข้าม
Word pages 50–53 ได้ โดยตรวจภาพครบทั้ง 4 fragments เห็นท้ายข้อความ/icon และ
REQ0042 ถัดไป ไม่พบ clipping/overlap ที่จุดนี้. ไม่ได้ตรวจภาพทุกหน้าของเอกสาร.
Thai SARA AM บางตำแหน่งแสดงถูกในภาพแต่ PDF extraction ทำเครื่องหมายหาย;
เก็บ strict mismatches และแยก lossy text corroboration ไว้ ไม่เรียกเป็น glyph PASS.

ข้อสังเกตทางเทคนิค: V2 มี floating band canvases 36 ตัว และ header picture
anchors 18 ตัว; header-only จึงยังมีวัตถุลอยซ้อนกัน. Microsoft ระบุว่า floating
tables ใน footer สามารถมีผลต่อการแบ่ง body-table rows ได้
([OOXML reference](https://learn.microsoft.com/en-us/dotnet/api/documentformat.openxml.wordprocessing.donotbreakconstrainedforcedtable?view=openxml-3.0.1)).
นี่เป็น supporting hypothesis ไม่ใช่คำยืนยันสาเหตุภายใน Word.
ไม่พบ obvious malformed ZIP/relationships/IDs หรือ table-grid defect จาก
targeted structural screen; ไม่อ้างว่า full XSD validation ผ่าน.

เตรียม single-factor corrections ไว้แล้ว แต่ **ยังไม่เปิดใน Word**:
`d-header-only-inline.docx`, `d-full-header-inline.docx` เปลี่ยนเฉพาะ
18 header pictures จาก anchor เป็น inline; และ `d-footer-only-flow.docx`,
`d-full-inline-header-flow-footer.docx` เอาออกเฉพาะ outer footer `tblpPr` 18 จุด
จากฐานที่ระบุ. ตรวจอิสระว่าการเปลี่ยนตรง factor และส่วนอื่นไม่เปลี่ยน;
inline baseline/centering และ native footer-flow position เป็น geometry deviations
ที่ยังต้องตรวจ. `d10-all-bands-locked-toc.docx` และ `d-footer-flow.docx`
ที่เตรียมไว้ก็ยังไม่ได้รัน Word เช่นกัน. ไม่เปลี่ยน candidate ที่เคยวัดแล้ว.

Locators: `diagnosis/evidence/variant-manifest.json`, `independent-variant-audit.json`,
`header-inline-manifest.json`, `footer-flow-manifest.json`, `independent-*-audit.json`,
`d00-completion.json`, `d01-completion.json`, `d-header-word-error.json`,
`d-footer-completion.json` และ `checkpoint-paused.json`.
D00 completion monitor ที่เรียกย้อนหลังครั้งแรกตรวจ deadline ก่อน existing file
จึงให้ผลผิด; เก็บเป็น `d00-monitor-late-call-error.json` แล้วแก้ monitor และใช้
validated PDF/file write time ในผลด้านบน. ไม่ใช้ false timeout นั้นเป็น Word result.

จุดกลับมาต่อ: ตรวจว่า task-owned Word `d-footer-only` ปิดแล้วก่อนเริ่มใหม่;
ขณะหยุดยังไม่มีหลักฐาน cleanup และไม่สั่ง UI เพิ่มหลังเจ้าของสั่งหยุด.
จากนั้นใช้ Word process ใหม่ ทดสอบ header-inline / footer-flow ทีละปัจจัย
แล้วจึงยืนยัน combined candidate หากทั้งคู่ผ่าน. รักษา source เดิมและผลก่อนหน้า;
ไม่สรุปว่าตัวแก้ได้ผลก่อนวัดจริง ไม่เริ่ม production integration.
การไม่ตอบสนองชั่วคราวอย่างเดียวไม่เพียงพอให้สรุปว่าค้างไม่จบ: D00/D01
กลับมาส่งออกสำเร็จ จึงใช้ explicit error/ครบกรอบเวลา/validated output แยกผล.

## Owner manual Word export checkpoint

วันที่ 2026-10-21 เจ้าของเปิด `outputs/srs-inline-v2.docx` แล้วช่วยแปลงเป็น
`outputs/srs-inline-v2.pdf` ด้วย Word สำเร็จ. ตรวจไฟล์ที่มีอยู่แบบ read-only;
ไม่ได้เริ่ม Word automation หรือ corrective-candidate experiments กลับมา.
Role: Evidence Reviewer / Documentation Synthesizer; single-room IDs N/A.
เอกสารแผนนี้ยังเป็น Project Control canonical checkpoint ไม่ใช่ production Evidence.

DOCX ที่เจ้าของเปิดยังมี SHA256 เดิม
`e91797dec4fafc29d8ac90fc53d5ada58acc640c093d1d3bf322b25bb5f77223`
/ 1,078,500 bytes. อ่าน hash ด้วย Python ได้ขณะ Word เปิดอยู่; PowerShell
`Get-FileHash` ครั้งแรกถูก file sharing lock ปฏิเสธ จึงไม่ใช้เป็นผล corruption.
PDF ใหม่มี 99 pages / 1,005,937 bytes, SHA256
`c461b314bb449da1f86fdfd2a9ba8c4d38daae498ac70a354dcd4dc8bbdea29c`;
metadata ระบุ Microsoft Word for Microsoft 365, creation time
2026-10-21 01:20:37 +07:00. ไม่ได้จับเวลาหรือสังเกตขั้นตอน manual export โดยตรง.

ผลนี้ยืนยันว่า full SRS V2 ส่งออกผ่าน Word ได้ในการใช้งานของเจ้าของ.
เก็บ prior explicit header error และ bounded footer/V2 timeouts ตามเดิม;
ไม่ขยายเป็นข้อสรุปว่าไฟล์เต็มส่งออกไม่ได้เสมอ หรือ bands เป็นสาเหตุแน่นอน.
ความต่างระหว่าง manual session กับ automation ยัง unknown; การวินิจฉัยที่พักไว้
และ corrective candidates ยังไม่มีผลใหม่จาก Word.

| Read-only check | Result and limit |
| --- | --- |
| File and visual coverage | PDF เปิดอ่านได้ครบ 99 pages; render 96 dpi แล้ว review ทุกหน้า แบ่งช่วง 1–33 / 34–66 / 67–99 และ zoom จุดสงสัย. ไม่พบ visible clipping, body/header/footer overlap, blank-page anomaly หรือ obvious broken glyph ในการตรวจนี้; ไม่ใช่ per-glyph หรือ pixel-parity proof |
| Body text against D01 | หลังตัด exact source-defined band prefixes ข้อความ normalized ของ 93 non-TOC pages ตรง D01 ทุกหน้า. TOC pages 4–9 ต่างที่ leader dots และบาง Thai extraction. Strict source-string probes ยังเหลือ 134 absent candidates เทียบ D01 139; newly absent 0. เก็บผลไว้ ไม่แสดงเป็น strict text PASS. Explicitly lossy Thai/source corroboration พบ absent 0/1,160 distinct non-contents strings; ไม่พิสูจน์ ordered instances/multiplicity หรือความถูกต้องของทุก glyph |
| Images | 469 painted occurrences = 371 body placements + 98 identical header banners บน pages 2–99. Body images ตรง D01 ทุก page/order/dimensions/decoded-image hash/soft-mask hash; 12 distinct body variants. เป็น image data/sequence proof ร่วมกับ visual review ไม่ใช่ complete source-layout parity |
| TOC and page fields | Internal links resolve 198/198; printed page numbers ตรง link destinations 198/198 และ destinations ตรง D01. Source headings พบที่ปลายทาง 198/198 ด้วย explicitly lossy Thai normalization. Pypdf TOC labels ตรง strict 194/198 และ lossy 198/198. Page fields เป็น 2/99 ถึง 99/99; cover ไม่มีเลขแสดง ตาม source policy |

พบ mapping defect ที่ต้องเก็บไว้ก่อน near-PDF acceptance:
Word pages 18–26 ใช้ repeated meeting-table header ของ “ครั้งที่ 1” ข้ามไปยัง
การประชุมครั้งถัด ๆ ไป. ตัวอย่าง Word page 18 ขึ้น header ครั้งที่ 1 ก่อนเนื้อหา
ครั้งที่ 2/3 ขณะที่ Core reference page 18 ใช้ header ครั้งที่ 2; Word page 19
ยังขึ้นครั้งที่ 1 ขณะที่ Core reference page 19 ใช้ครั้งที่ 3.
Frozen DOCX มี meeting tables แยกกัน 15 ตารางพร้อม first-row repeat flags
และ title ของแต่ละครั้ง; source เดิมข้ามครั้งที่ 11 อยู่แล้ว จึงไม่รายงานเป็น
เนื้อหาที่ DOCX ทำหาย. มี adjacent-table runs 3 ชุด / 26 pairs รวม approval,
legend และ meetings; Word table coalescence เป็น supporting hypothesis
ที่ยังไม่ได้พิสูจน์ด้วย corrective experiment.

Pagination polish ที่มองเห็น: หัวข้อแยกจากตาราง/เนื้อหาไปหน้าถัดไปที่ท้าย
pages 28, 33, 35–44, 74 และ 83. Icon-only continuation rows ที่ pages
46, 49, 50, 54, 55, 59, 64, 80 และ 89. ไม่พบว่าข้อมูลตรงจุดเหล่านี้หาย;
ยังไม่ได้จัดประเภททุกกรณีว่าเป็น regression จาก Core หรือความต่างที่เจ้าของยอมรับ.
99 pages เทียบ Core 98 pages ไม่ใช่ failure เพียงเพราะจำนวนหน้าต่างกัน.

Locators ใต้ experiment root เดิม: `user-pdf-review/review.json`,
`user-pdf-review/renders/`, `user-pdf-review/sheets/`,
`user-pdf-review/visual-b/review-pages-34-66.json` และ
`user-pdf-review/semantic-agent/` สำหรับ text/image/TOC และ
`table-adjacency-and-meeting-headers.json`.

Checkpoint: **PASS owner manual full-SRS Word export; near-PDF acceptance
ยังมี wrong repeated-table-header defect และ pagination findings; ไม่ใช่
production readiness.** ไม่ลดเนื้อหา/รูป ไม่แก้ source template, Core, Service,
API, DB หรือ installed runtime และไม่ทดสอบ corrective candidates เพิ่มในรอบนี้.
การแก้ prototype หรือเริ่มระบบจริงต้องยึด scope ที่เจ้าของอนุญาตต่อไป.

## DOCX-first alignment and wrap tuning

เจ้าของยืนยันวันที่ 2026-10-21 ให้ใช้ PDF ปัจจุบันเป็น reference แล้วแก้ DOCX
ก่อน โดยเน้นแนวชิดซ้าย/ขวา ตำแหน่งตาราง ระยะ และ wrap. พิจารณาจูน PDF
ร่วมกันเฉพาะเมื่อมีหลักฐานว่าติดข้อจำกัดจริงของ DOCX/Word; รอบนี้ไม่แก้ PDF.
ความหน่วงที่พบตอน Word แปลง PDF แยกเป็น observation ของขั้นตอนตรวจ:
ยังไม่ตัดสินว่าเป็น product DOCX stability failure หรือบั๊กของ Core/Service.
ผู้ใช้แจ้งว่า manual export ก็หน่วงเกือบค้าง จึงไม่อธิบายด้วย automation เพียงอย่างเดียว.
หากต้องใช้ manual conversion ให้บอกเจ้าของตรง ๆ พร้อมไฟล์ที่พร้อมตรวจ.

Scope: bounded inline prototype tuning; owner Project Control สำหรับ checkpoint,
Core สำหรับ future writer semantics; role Planning Partner / Evidence Reviewer;
Work/Phase/Checklist/execution IDs N/A. ใช้ experiment root เดิม ไม่เปิด registered
execution หรือ product lane. Allowed: `tuning-v3/`, fresh experimental DOCX,
เอกสารแผนนี้. Frozen inputs/PDFs/V2, product repositories/API/template/DB/runtime
อยู่นอก mutation scope. Proof budget: one full-SRS V3 candidate, package preservation
checks, independent package audit และ Word re-export เมื่อเจ้าของช่วยแปลง;
ไม่เริ่มชุด header/footer/performance experiments เก่ากลับมา.

Read-only spot comparison pages 2, 3, 10, 11 และ 27 อยู่ใน
`user-pdf-review/alignment-wrap/`. ตัวอย่าง first intro paragraph หน้า 11:
Core 4 lines, Word 5 lines ทั้งที่ขอบซ้าย 28.35 / 28.32 pt ใกล้กัน.
First source text run มี 391 characters, ordinary spaces 9 จุด ไม่มี internal
line break/ZWSP/joiner; Word line 1/2 ตรง space-delimited chunks.
พบ `w:lang val=th-TH` จริง จึงแก้ข้อสงสัยก่อนหน้าว่า language ถูก ignore:
ช่องที่ยังขาดคือ complex-script language (`w:bidi`). การเพิ่มช่องนี้ยังเป็น
hypothesis ต่อ Thai wrap ไม่ใช่ผล Word ที่ยืนยันแล้ว.

Table mapper เพิ่ม `tblInd` เท่ากับ source first-cell padding ทั้งที่ padding
อยู่ใน `tcMar` แล้ว. ตัวอย่าง cover: Version x ของ Core 191.532 pt เทียบ
Word 320.95 pt; offset 129.418 pt สอดคล้อง explicit indent 129.15 pt.
Page 27 เมื่อเทียบ vertical-border centers แบบเดียวกัน offset +5.25 pt
สอดคล้อง indent 5 pt. Center-to-center table width จริง 538.5 / 538.56002 pt;
ไม่ใช้ความต่าง 0.42 pt จากการเทียบ horizontal stroke/rectangle คนละรูปแบบ
เป็นเหตุเพิ่มความกว้างตาราง. ยังต้องวัด candidate ใน Word ก่อนปรับเศษระยะ.

V3 `outputs/srs-tuned-v3.docx`, 1,078,002 bytes, SHA256
`cf656c2b6fb6998b633dd02d6b79d571b69a5dcc65d7042769798bd70f622526`:

1. Body table indents เป็น 0 ตาม flow origin ทั้ง 200 tables;
   เปลี่ยนจริง 189 จุด อีก 11 จุดเดิมเป็น 0. คง widths/grids/padding/borders เดิม.
2. เพิ่ม `w:bidi=th-TH` ใน existing Thai language elements 6,010 จุด;
   API equivalent คือ `language:{value:'th-TH',bidirectional:'th-TH'}` ใน
   `docx@9.13.0`. ไม่ใช่ RTL direction และไม่เพิ่ม CJK rules/forced line breaks.

สร้างเป็น lossless ZIP derivative ของ frozen V2 เพื่อให้วัดเฉพาะ mapping changes;
receipt ระบุ source adapter fixes สำหรับการนำไปใช้กับ writer ภายหลัง.
ไม่เปลี่ยนข้อความ ลำดับ run/breaks รูป ฟอนต์ styles เดิม (นอก language metadata),
TOC/bookmarks/fields, sections/margins, table rows/cells หรือ asset bytes.
Static regression check FAIL บน V2 แล้ว PASS บน V3; canonical XML comparison
อนุญาตเฉพาะสอง changes ข้างต้น. Body counts คง 200 tables / 933 rows /
1,932 cells; nonchanged ZIP members คง byte-identical.

Wrong meeting-header repetition ยังไม่แก้ใน V3 นี้. ตรวจเพิ่มพบ adjacent body
tables 26 boundaries; Microsoft OOXML ระบุว่าตารางติดกันที่ใช้ style เดียวกัน
และไม่มี paragraph คั่นถือเป็น table เดียว
([Table reference](https://learn.microsoft.com/en-us/dotnet/api/documentformat.openxml.wordprocessing.table?view=openxml-2.20.0)).
ทางแก้ถัดไปคือ empty structural separator ระหว่าง logical tables โดยต้องตรวจ
pagination ใหม่. Approval/legend `tblHeader val=off` คือ disabled;
15 meeting tables เท่านั้นที่เปิด repeat first row ในกลุ่มนี้. ไม่ใช้แค่ tag presence นับ enabled.

Locators: `tuning-v3/scripts/make_candidate.py`, `check_candidate.py`,
`tuning-v3/evidence/{red-baseline,green-candidate,generation}.json`,
`tuning-v3/table-diagnosis/` และ `tuning-v3/wrap-diagnosis/`.
Packaged `render_docx.py` ลองแล้วไม่มี `soffice.exe` บน PATH;
เก็บ log ใน `tuning-v3/evidence/packaged-render.log`. ไม่ติดตั้ง renderer เพิ่ม.
ขอเจ้าของเปิด V3 ใน Word และบันทึก `srs-tuned-v3.pdf` ในโฟลเดอร์เดียวกันแล้ว.
**Word alignment/wrap verification pending**; ไม่ส่งเป็น final-ready DOCX และ
ไม่ claim ว่า wrap ดีขึ้นจาก package PASS เพียงอย่างเดียว.

### V3 owner Word verification result

เจ้าของช่วยแปลง V3 แล้ววันที่ 2026-10-21. `outputs/srs-tuned-v3.pdf`
มี 99 pages / 1,001,269 bytes, SHA256
`118ffee934290fd96e7e6ad600bdd05fd4a771037b2522d38ef8847b9d599dfb`;
Word metadata creation time 08:31:12 +07:00. V3 DOCX ยังตรง hash เดิม
`cf656c2b6fb6998b633dd02d6b79d571b69a5dcc65d7042769798bd70f622526`.
ตรวจแบบ read-only; ไม่มี Word automation หรือ candidate repair ระหว่าง verification.

| Targeted measurement, pt | Core PDF | Word V2 | Word V3 | Result |
| --- | ---: | ---: | ---: | --- |
| Cover Version left | 191.532205 | 320.950000 | 191.810000 | Large offset removed; residual +0.277795 |
| Cover value 3.0 left | 308.125984 | 437.860000 | 308.690000 | Large offset removed; residual +0.564016 |
| Page 3 left/right border centers | 28.350000 / 566.925591 | 32.880000 / 571.439990 | 28.560000 / 567.239990 | Residual +0.210000 / +0.314399 |
| Page 27 left/right border centers | 28.350000 / 566.850000 | 33.600000 / 572.160020 | 28.560000 / 567.239990 | Residual +0.210000 / +0.389990 |
| Page 11 first intro paragraph | 4 lines | 5 lines | 5 lines | V3 line texts and coordinates exact V2; language hypothesis did not improve wrap |

เทียบ vertical-border centers ชนิดเดียวกัน: V3 page 27 center span 538.679990 pt
เทียบ Core 538.500000 pt; ยังต่าง +0.179990 pt แม้ declared grids/widths ไม่เปลี่ยน.
ไม่เพิ่ม arbitrary width correction. Page 3 cell left insets คงประมาณ 4.32 pt
เทียบ Core 4.25 pt; page 27 Features List center offset ภายใน cell +0.024805 pt.
ตำแหน่งชิดซ้าย/กลางในตัวอย่างดีขึ้นพร้อม padding เดิม; ไม่มี right-aligned paragraph
ในตารางที่สุ่มวัด จึงไม่ขยายเป็น right-alignment PASS ทั้งระบบ.
ความต่างแนวตั้งยังอยู่: cover Version ต่ำกว่า Core +1.741280 pt, page 3 table
bottom 231.500000 เทียบ Core 229.150841 pt; page 27 row heights ประมาณ
28.32 เทียบ Core 27.84 pt. ขนาด glyph ที่ PDF ระบุ Word 11.04 เทียบ Core 11 pt.

All-page data check เทียบ V2: raw pypdf text ตรง 99/99 pages, media boxes ตรง
99/99, painted image identities/order ตรงทุกหน้า 469 occurrences = 371 body
+ 98 header. TOC links resolve และ printed page ตรง destination 198/198;
rectangles/destinations ตรง V2. Page fields แสดงครบ 98 non-cover pages.
ผลเหล่านี้เป็น preservation checks เทียบ V2 ไม่ใช่ strict source/glyph parity.
Render V3 ครบ 99 pages ที่ 96 dpi; visual comparison รอบนี้ตรวจเฉพาะ pages
1, 2, 3, 10, 11 และ 27 ไม่อ้าง full all-page visual acceptance รอบใหม่.

**PARTIAL: table-position hypothesis supported; complex-script language alone
does not fix Thai wrap.** Page 10 legend wrap ก็ยังตรง V2. ไม่มีหลักฐานว่าถึง
ข้อจำกัดจริงที่จำเป็นต้องแก้ PDF แล้ว. Next diagnosis ควรแยก Thai word-boundary
behavior และแนวตั้ง/line metrics ฝั่ง DOCX; ไม่เดา RTL/CJK flags หรือเติม forced
line breaks เพื่อให้ภาพตัวอย่างดูผ่าน. Wrong repeated meeting header ยังเป็น
known defect ตาม scope เดิม. ไม่สร้าง V4 หรือแก้ PDF/product ใน verification รอบนี้.

Locators ใต้ `tuning-v3/word-review/`: `review.json`, `renders/`,
`comparisons/compare-*.jpg`, `geometry-agent/geometry-review.json` และ
`content-agent/comparison.json`. สถานะนี้แก้ pending เฉพาะการตรวจ V3;
ไม่ได้ promote generic DOCX readiness หรือปิดงานจูนทั้งหมด.

## V4 Thai wrapping and table-height experiments

เจ้าของอนุญาตวันที่ 2026-10-21 ให้ตรวจ native Word paragraph ก่อน แล้วแยก
ทดลอง Thai word boundaries และความสูงแถวด้วย SRS เดิมในพื้นที่ทดลอง.
เป็น bounded inline discovery/prototype ต่อจาก checkpoint เดิม; owner Project
Control สำหรับบันทึกนี้, Core สำหรับ future writer semantics; role Evidence
Reviewer / Planning Partner / Documentation Synthesizer; execution IDs N/A.
Allowed: `tuning-v4/`, fresh experimental DOCX และแผนนี้. ไม่แก้ reference PDF,
frozen resolved input, template/data, Core/Service/API/plugin/DB/runtime.
Proof budget: native paragraph control หนึ่งชุดพร้อม font-confound correction,
full-SRS wrap-only และ height-only อย่างละหนึ่งไฟล์, package checks และ
targeted Word PDF review พร้อม preservation checks. Document budget: แผนเดิม
หนึ่งไฟล์; JSON/scripts/images ใต้ experiment root เป็น supporting diagnostics.
ไม่รวมสอง changes เป็น candidate ใหม่ และไม่เริ่มระบบจริง.

### Native Word paragraph control

พิมพ์ first intro paragraph จาก source ลง blank Word โดยตรง: 391 characters,
SHA256 `78a39a63bc3ba663ea8e0030d3929f73658b5e0ec7dae19c7ebb75bd7da11a89`,
ไม่มี forced break หรือ U+200B; A4, margins 567 twips, Sarabun 11 pt,
exact line 397 twips, after 0 และ snap-to-grid off. Word แจ้งว่า Sarabun ไม่ได้
ติดตั้งในเครื่อง และแทน Thai run เป็น Angsana New ในการพิมพ์ครั้งแรก;
ไม่ใช้ผลนั้นเปรียบเทียบกับ SRS ที่ฝังฟอนต์.

แก้เฉพาะ control โดยนำ embedded Sarabun variants/font keys เดิมจาก V3
มาใส่ใน font carrier แล้วเปิดใหม่และเลือก Sarabun ให้ Thai run ผ่าน Word.
ขั้น font-carrier ไม่แตะ native document/styles/settings/text; เป็น control
ที่เขียนด้วย Word และควบคุมฟอนต์ ไม่ใช่ pristine untouched Word package.
ไม่ได้ติดตั้งฟอนต์หรือเปลี่ยน OS configuration. หลัง Word บันทึกตรวจ source
text ยังตรงทั้ง 391 characters และ Sarabun outlines/metrics/shaping tables
12 SFNT tables ตรง V3 byte-for-byte; ต่างเฉพาะ head/name หลัง Word save.
PDF font name ภายในเป็น Sarabun-Regular ทั้งคู่; export ระบุ 11.04 pt เท่ากัน.

| First intro source break ends, exclusive UTF-16 offsets | Result |
| --- | --- |
| Core reference | 103, 210, 312, 391: 4 lines |
| V3 generated DOCX in Word | 50, 145, 210, 300, 391: 5 lines |
| Native Word control with same Sarabun | 103, 210, 312, 391: 4 lines |

Break offsets ผูก PDF extraction กลับไปยัง exact source ด้วย normalization
เพื่อการวัด ไม่ใช่ raw PDF text/source equality. Control เป็น standalone paragraph;
ข้อความเดียวกันใน V3 เป็นช่วงแรกของ paragraph ยาวที่มี BR คั่นส่วนถัดไป.
Paragraph structure และ font-table metadata จึงเป็นปัจจัยต่างที่ต้องเก็บร่วมกับ
run/settings differences ไม่สรุปว่ามีเพียง flags ที่เป็นไปได้.

ตรวจ rendered paragraph แล้วไม่พบ missing-glyph boxes/visible clipping.
ผลนี้ยืนยันว่า Word session นี้ตัดย่อหน้าเดิมใกล้ Core ได้โดยไม่ต้องแทรก
จุดตัดคำในข้อความ; ยังไม่ชี้ว่า property ใดเป็นสาเหตุ. Native run มี `w:cs`
ขณะที่ V3 document/styles ไม่มี explicit `w:cs`; compatibility settings,
grid และ defaults ก็ยังต่างกัน. `w:cs` เลือก complex-script formatting;
`useFELayout` เกี่ยวกับ complex-script layout ตาม
[Microsoft reference](https://learn.microsoft.com/en-us/dotnet/api/documentformat.openxml.wordprocessing.compatibility.usefareastlayout?view=openxml-3.0.1).
ยังไม่เพิ่ม flags เหล่านี้ใน SRS หรืออ้างว่าเป็น root cause โดยไม่มี isolated test.

Native control final DOCX ใต้ `tuning-v4/native-control/` มี SHA256
`d47d80f8357254a5c8adb7db26f20c9406c38f53b874ee63388871f101dec7c4`;
one-page Word PDF SHA256
`7f7d83bd2954c71b4a40a61eba38b8782587d06276427dcc6f0656d94543fccd`.
Locators: `native-control/native-word-comparison.json`, font-carrier receipt,
`native-paragraph-detail.png` และ `after-word-identities.json` ใต้ `tuning-v4/`.

### Wrap-only candidate

ใช้ exact Core native binary จาก commit
`8f8a739aea5597b6d8c9932c790f9bd716e8ebc7`, ICU4X 2.2.0,
`LineSegmenter::new_auto(Default::default()).segment_str` ผ่าน Ubuntu WSL.
Binary SHA256 `55347fc74ffe268bc37eecd71ae09f5dd9e4993e53a52615b00120eb98e59bb9`;
ไม่ใช้ word segmenter ตัวอื่นแทน และไม่ build/install/start Docker.
Manifest ผูกตำแหน่ง OOXML กับ exact text/hash และ source candidates;
repeated source strings ที่คลุมเครือ 402 จุดถูกระบุ ไม่อ้าง unique source mapping.

`outputs/srs-wrap-v4.docx`, SHA256
`1a9e08de7ee4b806e675c0fbc3baca70bf9772973eecd38ea5e831a24b8cf0c9`:
เพิ่มเฉพาะ U+200B 6,034 จุดใน 1,206 text nodes ตาม internal Thai boundaries
จาก Core. Exclude fields/TOC/textboxes/deleted content. ไม่เพิ่ม forced breaks,
ไม่เปลี่ยน font/style/table/band/margin. การลบเฉพาะ inserted bytes ที่บันทึก
ใน receipt คืน raw XML เดิมได้ตรง byte-for-byte; actual text ใน DOCX มี
invisible characters เพิ่ม จึงไม่เรียกว่า raw text unchanged และยังต้องตรวจ
search/copy/caret effects ก่อนพิจารณาใช้วิธีนี้.

เจ้าของแปลงเป็น Word PDF แล้ว: 100 pages / 1,212,164 bytes, SHA256
`4574f434281cbeb8cf0c993ddb90c4abf4b2fafb4eca2dd5b0e9633ebf6cf4fb`.
**FAIL visible Thai glyphs:** first intro paragraph และ heading มี missing-glyph
boxes จำนวนมากใน rendered PDF. ย่อหน้าแรกยังเป็น 5 lines; ไม่ถือว่า wrap
ผ่านจากจำนวนหน้า/ตัวอักษรใน package. นี่เป็นผลเสียของ candidate/export รอบนี้;
ยังไม่พิสูจน์ว่า Word ไม่รองรับ U+200B โดยทั่วไปหรือแยก font/shaping mechanism ได้.
เก็บ failed artifact ตามเดิม ไม่ใช้เป็น production candidate และไม่แก้ PDF.
ตรวจภาพ pages 10, 11 และ 27 พบอาการเดียวกัน. Body images คง 371 placements
ครบ decoded data และลำดับ; painted total 470 = 371 body + 99 header banners.
TOC links resolve และ printed page ตรง destinations 198/198; cover ซ่อนเลข
และ pages 2–100 แสดง physical page ถูกต้อง. Text/glyph preservation **FAIL**;
ไม่เพิ่ม strict source probes เพื่อทำให้ผลที่เห็นล้มเหลวดูเป็น PASS.
Locators: `wrap/{manifest,core-boundaries,generation,green-candidate}.json`,
`audit/independent-package-audit.json`, `word-review/wrap/comparison.json`
และ `word-review/wrap/intro-detail.png`.

### Height-only candidate

`outputs/srs-height-v4.docx`, SHA256
`bafe549ac45b2ac57df8eccd47dbd0cb65237c964456b1c53c3f37b9489bf33a`:
เปลี่ยนเฉพาะ border value `single` เป็น `nil` 42 attributes ในตาราง metadata
บนปก 3 rows / 9 cells: 6 table edges และ 36 cell edges. Source ใช้ vertical
padding 0, line 17 pt และ white borders. คง text/fonts/widths/padding/spacing
เดิมทั้งหมด; ไม่ใช้ exact row height และไม่ลบ authored white borders ทั่ว SRS.
เจ้าของแปลงเป็น `outputs/srs-height-v4.pdf`, 99 pages / 1,002,897 bytes, SHA256
`c8111bf66deccf28bfa014f975ae5da8abce9e2220e9a2414a9dcedcfb196563`.

| Cover measurement, pt | Core | V3 | Height V4 |
| --- | ---: | ---: | ---: |
| Version left | 191.532205 | 191.81 | 191.57 |
| Value 3.0 left | 308.125984 | 308.69 | 308.21 |
| Version text top | 444.650000 | 446.391280 | 445.911280 |
| Author text top | 461.650000 | 463.911280 | 462.831280 |
| Updated text top | 478.595000 | 481.431280 | 479.871280 |
| Successive text-top advances | 17.000 / 16.945 | 17.52 / 17.52 | 16.92 / 17.04 |

**PASS narrow cover-border contribution hypothesis:** เปลี่ยน border อย่างเดียว
ทำให้ row text advances ลด 0.48–0.60 pt และตำแหน่งชิด Core ขึ้น. Text-top
advances รวม glyph/export quantization จึงไม่ประกาศ exact row height 17.04
ทุกแถว. Later cover content ขยับขึ้นสูงสุด 2.04 pt; ยังมี residual vertical offset
และ glyph metrics difference. ไม่หัก line height 0.5 pt ทั้งเอกสาร และไม่ขยาย
ผลนี้เป็นคำสั่งลบ authored white borders ทั่ว SRS.

Preservation เทียบ V3: raw pypdf text ตรง 99/99 pages, media boxes ตรงทุกหน้า,
469 painted images คง decoded data/soft mask/page/order, TOC destinations
และ rectangles ตรง 198/198, cover hidden และ page fields 2–99 ถูกต้อง.
Body geometry 12 pages ยังมี Latin horizontal deltas สูงสุด 0.09624 pt;
body Y และ font sizes ตรงเดิม จึงไม่อ้าง all-body geometry identical.
Visual review เฉพาะ cover, intro crop page 11 และ feature tables page 27:
ไม่พบ glyph boxes/obvious clipping ในจุดที่ตรวจ; intro ยัง 5 lines เท่า V3.
ไม่ใช่ all-99-page visual หรือ strict source-glyph acceptance.
Locator: `word-review/height/height-review.json` และภาพในโฟลเดอร์เดียวกัน.

Static regression checks FAIL บน V3 แล้ว PASS บน candidate ที่ถูกชนิด;
independent audit ยืนยันแต่ละไฟล์เปลี่ยนเฉพาะ `word/document.xml`, อีก 124 ZIP
payloads และ compressed records ตรง V3. คง 200 tables / 933 rows / 1,932 cells /
371 body drawings / 198 hyperlinks. Frozen resolved/reference/V3 PDF และ V3
DOCX hashes ยังคงเดิมหลัง owner export. Package PASS ไม่ทดแทน Word appearance.

ทิศทางถัดไปจาก native control คือแยก native run/compatibility/font metadata
และ paragraph structure ทีละปัจจัยก่อนเพิ่ม invisible characters ทั่วเอกสาร. ยังไม่สรุปว่าต้อง
เปลี่ยน PDF. Wrong repeated meeting header และ pagination polish เป็น known
findings เดิมที่อยู่นอกสอง candidate นี้; ไม่ promote DOCX readiness.
Checkpoint นี้ปิดเฉพาะสามการทดลองที่อนุญาต: native Word control ผ่าน,
wrap-hint candidate ล้มเหลวด้าน visible glyphs และ cover-border height
hypothesis มีผลวัดสนับสนุน. ยังไม่เลือกแนวทางแก้ Thai wrap เข้า writer จริง;
ต้องแยกปัจจัย native/generated ที่ต่างกันในพื้นที่ทดลองรอบถัดไป.

## V5 language font and paragraph isolation

เจ้าของอนุญาตวันที่ 2026-10-21 ให้ทดลองภาษา ฟอนต์ และโครงสร้างย่อหน้า
ทีละปัจจัยต่อด้วย SRS เดิม. เป็น new bounded inline experimental scope;
ไม่เปิด registered execution หรือย้อนแก้ acceptance ของ V4. Owner/roles
ตาม checkpoint เดิม; execution IDs N/A. Allowed: `tuning-v5/`, fresh SRS
experimental outputs และแผนนี้. PDF reference, frozen V3/V4 artifacts,
source template/data และ product/dependency/runtime/OS settings อยู่นอก mutation.

Proof budget: focused intro baseline + five one-factor variants, Word export
หนึ่งรอบต่อไฟล์, package invariants และ rendered comparison. Focused baseline
ต้อง reproduce first intro chunk 5 lines ก่อนใช้สรุปผล. หากได้ผลที่ชัดเจนจึง
ยืนยันปัจจัยนั้นกับ full SRS ได้อีกหนึ่ง candidate; ไม่รวมหลายปัจจัยโดยไม่มี
ผลแยก และไม่เพิ่ม invisible characters. Document budget: update แผนเดิม;
scripts/JSON/QA images เก็บใต้ experiment root. Candidate generation กับ
read-only verification แยกขั้น; ไม่แก้ candidate ระหว่างตรวจ.

Fixture ใช้ exact intro heading และ whole paragraph เดิมทั้งสาม text chunks,
run formatting และ double-BR boundaries ไม่ใช้ native control มาแทน source.
คง section geometry ของ SRS บทนำ; ตัด body ส่วนอื่นและ header/footer references
เฉพาะ common fixture ที่ใช้ร่วมกันทุก probe จึงไม่ใช่ full-SRS acceptance.
ห้าปัจจัยที่ทดสอบ: `applyBreakingRules`, `useFELayout`, first Thai run `w:cs`,
Sarabun `w:sig` จาก actual embedded font และ paragraph boundaries.
ผล Word อยู่ใน checkpoint ด้านล่าง; การต่างจาก native Word เพียงอย่างเดียว
ไม่ใช่หลักฐานสาเหตุ.

### V5 focused Word results

สร้าง baseline และห้า variants ใน `tuning-v5/probes/` แล้วเจ้าของช่วยแปลง
ครบหก PDF รวม baseline. ทุกไฟล์หนึ่งหน้า. Baseline SHA256
`e4e43271ce053cca95e14c023f7a44cba527143e88bea8a0ed12165b40b2e771`
reproduce original first-chunk break ends 50, 145, 210, 300, 391 ได้จริง.
Independent package check 50 checks ผ่าน: baseline retained subtrees ตรง source,
อีก 124 ZIP payloads ตรง V3, แต่ละ variant เปลี่ยนเฉพาะหนึ่งปัจจัย และ exact
ordered text/fonts คงเดิม. Paragraph split เก็บ 2 BR เดิม + 2 P boundaries
แทน 4 BR จึงคง logical newlines และ run formatting ไม่เปลี่ยนช่องว่างในข้อความ.

| Probe | Sole difference from focused baseline | First chunk in Word |
| --- | --- | --- |
| 00 baseline | Common extracted fixture only | 5 lines; reproduces V3 |
| 01 apply-breaking-rules | Add one compatibility flag | 5 lines; unchanged |
| 02 use-fe-layout | Add one compatibility flag | 5 lines; unchanged |
| 03 complex-script | Add `w:cs` to first 391-character Thai text run | 4 lines; ends 103, 210, 312, 391 match Core/native control |
| 04 font-signature | Correct Sarabun `w:sig` from embedded font OS/2 | 5 lines; unchanged |
| 05 paragraph-split | Replace the two double-BR logical boundaries with paragraphs while retaining newline count | 5 lines; unchanged |

Root inspected all six full-page renders: ไม่มี visible glyph boxes/clipping
ในจุดที่ตรวจ. Pixels ของ 01/02/04/05 ตรง baseline ทั้งหน้า; เฉพาะ 03 ต่าง.
ทุก PDF ฝัง Sarabun-Regular/Sarabun-Bold และ painted sizes 11.04/12.96 pt
ตรงกัน; ไม่ใช่การใช้ฟอนต์คนละ family หรือย่อขนาดเพื่อให้บรรทัดผ่าน.
Source-to-PDF break alignment ยังเป็น explicitly lossy Thai normalization;
exact source text preservation พิสูจน์จาก DOCX แยกกัน ไม่เรียก raw PDF text PASS.

**PASS bounded single-factor effect:** `w:cs` ทำให้ Word ใช้ complex-script
formatting กับ run นี้และได้จุดตัดคำตามเป้าหมาย โดยไม่เพิ่ม U+200B/forced BR,
ไม่เปลี่ยน text/font/paragraph structure. ผลนี้แยกปัจจัยที่มีผลกับข้อความ
ตัวอย่างได้ ไม่อธิบาย internal Word mechanism ทุกขั้นหรือรับรองทั้ง writer.
การเปลี่ยนภาษา compatibility flags, font signature หรือ paragraph split
เพียงอย่างเดียวไม่แก้ตัวอย่างนี้ใน export รอบที่ตรวจ.

### Separate font metadata finding

อ่าน actual OS/2 ของ embedded Sarabun ทั้ง regular/bold/italic/boldItalic
แล้วได้ six signature fields ตรงกัน: USB `21000007,00000001,00000000,00000000`,
CSB `20010193,00000000`. Declared values ใน V3 กลับเป็น USB
`E0002AFF,C000247B,00000009,00000000`, CSB `000001FF,00000000`;
ขาด Thai Unicode bit 24 และ code-page 874 bit 16. ตาม
[OpenType OS/2](https://learn.microsoft.com/en-us/typography/opentype/spec/os2)
และ [OOXML font signature](https://learn.microsoft.com/en-us/dotnet/api/documentformat.openxml.wordprocessing.fontsignature?view=openxml-3.0.1)
ข้อมูลนี้ควรมาจากฟอนต์จริง.

Trace ต้นทางพบ pinned experimental `docx@9.13.0` ใน
`docx-prototype-9130/node_modules/docx/dist/index.cjs` function `createEmbeddedFont`
lines 12629–12638 hardcode ค่าเดิม; prototype caller `scripts/generate-srs.mjs:26`
ส่ง Sarabun ผ่าน font embedding path นี้. ยังไม่แก้ vendor, package หรือระบบจริง.
Native control เดิมก็เก็บ signature ผิดนี้ไว้ แต่ตัดเป็น 4 lines ได้; probe 04
แก้ signature อย่างเดียวก็ไม่เปลี่ยน wrap. จึงเป็น metadata defect ที่แยกไว้
ไม่ใช่ demonstrated standalone cause ของ line-breaking failure นี้.

### Full SRS one-run confirmation

หลัง focused result ผ่าน สร้าง `outputs/srs-cs-confirm-v5.docx`,
1,078,009 bytes, SHA256
`621e4cbefde1614276cdff244bb8f15fa7a96b070921bd034dfdb955ba92eb24`.
เพิ่ม `<w:cs/>` 7 bytes ที่ first intro run เดิมเพียงจุดเดียวใน frozen V3 เต็ม;
ไม่ใส่ให้ Thai runs อื่น ไม่รวม V4 height change หรือ font-signature correction.
ลบ recorded insertion คืน entire raw document.xml เดิมได้ตรง byte-for-byte.
Independent check 24 checks ผ่าน: อีก 124 ZIP payloads/compressed records,
text order, 200 tables / 933 rows / 1,932 cells / 371 drawings / 198 hyperlinks /
922 BR / 2,761 paragraphs / 7 sections / 396 bookmarks ตรง baseline.
เจ้าของช่วยแปลง full Word PDF แล้ว: 99 pages / 1,013,098 bytes, SHA256
`3543ead63755ba3e0b01da9af8b688dccba48e6bd128719648c0ab28ccb292cf`.
DOCX ยังตรง hash ที่ตรึงไว้. Page 11 first chunk มี 4 lines และ source break ends
103, 210, 312, 391 ตรง focused probe/Core/native control. Root ตรวจ full pages
11–16 และ intro detail: ไม่พบ visible glyph boxes/clipping ในภาพที่ตรวจ.
**PASS full-SRS confirmation of the one-run effect**; ไม่อ้างว่าแก้ Thai wrap
ทุกส่วนของ SRS หรือรับรองทุก glyph ทุกหน้าแล้ว.

All-page checks: 469 painted images = 371 body placements + 98 header banners;
body image decoded data/soft masks/order/page/bounding boxes ตรง V3 ทั้งหมด.
Media boxes ตรง, TOC links resolve และ printed page ตรงปลายทาง 198/198,
page-field policy cover hidden แล้ว pages 2–99 ถูกต้อง. Destination coordinates
11 จุดเปลี่ยนเฉพาะ XYZ-Y +19–27 pt ตาม reflow; target physical pages,
link rectangles และ names ตรงทั้ง 198 links. ไม่รายงานว่า TOC geometry identical.

Raw pypdf text ตรง V3 83/99 pages; pages 11–26 ต่างกันและมี text reflow.
Per-page whitespace/lossy Thai checks ก็ไม่ตรงทั้งหมด; ไม่ยกระดับเป็น strict
PDF text-preservation PASS จาก DOCX package preservation. รอบนี้ render/review
เฉพาะ pages 11–16; changed pages 17–26 ไม่ได้ทำ visual review ใหม่.
Known repeated-meeting-header defect เดิมยังไม่แก้และต้องแยกจาก text reflow.
Bounded reconciliation หลังตัด exact source-defined bands: normalized body
streams มี 96,454 characters และ character counts ตรง แต่ ordered stream
ยังต่าง. First difference คือ repeated meeting-1 header แทรกระหว่าง participant
rows 2/3 ใน V3 เทียบ rows 3/4 ใน candidate. เป็น supporting explanation ของ
ความต่างลำดับจุดหนึ่ง ไม่ใช่ proof ว่าทุกความต่างหรือทุก glyph ถูกต้องแล้ว.
เก็บข้อจำกัดนี้ไว้โดยไม่เพิ่ม corrective candidate นอก proof budget.

Checkpoint: จบ five-factor isolation และ one-run full SRS confirmation ตาม
scope. ขั้นถัดไปต้องวาง mapping สำหรับ Thai/mixed-script runs พร้อมรักษา
bold/italic/complex-script style inheritance ก่อนขยายทั่ว SRS; การใส่ `w:cs`
ให้ทุก run โดยไม่ตรวจ `bCs/iCs/szCs` ไม่อยู่ในผลพิสูจน์นี้. Font-signature defect
เป็นอีกเรื่องที่ต้องจัดการตามขอบเขตของ writer ไม่รวมแก้เงียบใน candidate นี้.
ไม่แก้ PDF, source template/data, installed dependencies หรือระบบจริง.

Locators ใต้ `tuning-v5/`: `probe-manifest.json`,
`research/settings-research.json`, `audit/independent-package-audit.json`,
`word-review/{comparison,root-review}.json`, `full-srs/generation.json` และ
`scripts/{v5_probe_suite,analyze_word_probes,full_srs_cs_confirmation}.py`.
Full Word evidence อยู่ที่ `full-srs/word-review/comparison.json` และ renders
ในโฟลเดอร์เดียวกัน; initial observation และ root visual acceptance แยกกัน.
Supplement: `toc-reflow-summary.json`, `text-stream-reconciliation.json`
และ `root-review.json` ในโฟลเดอร์ full Word evidence เดียวกัน.

## V6 mixed script and emphasis scope

เจ้าของอนุญาตวันที่ 2026-10-21 ให้ตรวจข้อความไทยปนอังกฤษ ตัวหนาและตัวเอียง
ด้วย SRS เดิมในพื้นที่ทดลอง แล้วสรุปก่อนขยายทั้งเอกสาร. เป็น bounded inline
discovery ใหม่; ไม่เปิด registered execution หรือเปลี่ยน acceptance ของ V5.
Owner: Project Control สำหรับแผนนี้; experiment writer เป็น disposable input
สำหรับ Core owner เท่านั้น. Roles: Planning Partner / Evidence Reviewer /
Documentation Synthesizer; Work/Phase/Checklist/execution IDs N/A.

Allowed: new `tuning-v6/` artifacts, section นี้ และ current status ของแผน. Frozen V3/V5 candidates,
PDF reference, source template/data, product repositories, installed dependencies,
runtime/OS settings และ maps อยู่นอก mutation. ใช้ isolated experiment root
เดิม; small separable plan update ใช้ Project Control checkout ที่สะอาด.
Model decision: retain current host model for this bounded diagnostic continuation;
ไม่ dispatch registered product WORK หรือเปลี่ยน model setting.

Acceptance: inventory actual script/emphasis coverage และ effective formatting;
สร้าง common fixture จากข้อความ/ย่อหน้า SRS เดิม; แยก baseline, `w:cs` only
และ `w:cs` พร้อม explicit complex-script formatting ที่รักษารูปแบบเดิม;
ตรวจ exact text/package invariants แล้วเปรียบเทียบ Word fonts, line breaks,
ขนาด และ glyphs. หาก source ไม่มี italic/boldItalic ต้องระบุ coverage gap
และแยก controlled formatting overlays จาก actual SRS cases อย่างชัดเจน.
ไม่ถือ XML-only checks เป็น Word rendering PASS.

Proof budget: source inventory หนึ่งชุด, comparison DOCX ไม่เกินสามไฟล์
ไฟล์ละไม่เกินหกหน้า, Word export หนึ่งรอบต่อไฟล์ และ review ทุกหน้าของ
compact fixture. อนุญาต focused read-only check/research สำหรับ script-slot
และ style-inheritance failure; ไม่สร้าง full-SRS candidate หรือขยาย mapping
ทั่วเอกสารในรอบนี้. Candidate generation กับ verification แยกขั้น.
Document budget: update section เดิมนี้; machine-readable observations/scripts/
QA images อยู่ใต้ `tuning-v6/`; ไม่มีรายงานหรือ Work records เพิ่ม.

Current status: **PASS bounded V6 comparison**, with the scope and limitations
below. Mixed-script/emphasis behavior is demonstrated for this compact fixture;
general mapping and full-SRS pagination remain unverified. Absence of actual
italic source remains an explicit coverage limitation.

### V6 source coverage and common fixture

Frozen V3/source identities remain those in V5. Inventory of active text-bearing
main-document runs found regular and bold Thai/Latin/mixed text, but no natural
italic, boldItalic or inline emphasis transitions. Unused italic style definitions
are not coverage. The source style named `bold` has `fontWeight: normal`;
this checkpoint does not rename or repair existing source styles.

Natural specimens: original mixed heading paragraph 297 and full introduction
paragraph 298, plus definition table 16 rows 0–7. Paragraph indices are zero-based
`//w:p` indices in the frozen `word/document.xml`. In the common baseline, the
first two retain exact qualified XML structure/properties/text; table properties
and the eight selected rows are also source-identical. Existing section geometry/fonts/settings are
retained, with header/footer references removed from the common extracted section.

Three comparison files share five diagnostic pages:

| Page | Coverage | Provenance limit |
| --- | --- | --- |
| A / 1 | Natural mixed bold heading and three intro chunks | Exact existing source paragraphs |
| B / 2 | Natural Latin, Thai and mixed text in definition table | Eight existing rows; not the complete source table |
| C / 3 | Regular / bold / italic / boldItalic | Controlled paired standard/CS formatting on the existing 312-character mixed intro chunk |
| D / 4 | Inherited boldItalic with direct regular / bold / italic / boldItalic overrides | Controlled character style; CS off flags deliberately absent in baseline |
| E / 5 | Inline regular → bold → italic → boldItalic transitions | Controlled common segmentation of the same exact source text; no candidate-specific splitting |

The natural paragraphs keep their original run boundaries. Controlled page E
introduces the same four run boundaries in every candidate to exercise a missing
source case; this is not evidence that arbitrary script-boundary splitting is
layout-equivalent or needed by the writer.

Files under `tuning-v6/probes/`: `00-baseline.docx`, `01-cs-only.docx`, and
`02-cs-preserve-emphasis.docx`. The latter SHA256 is
`a5ccf65f334ea309f3de4915633ae0dded7121b2e751d77158dbe216eff35415`.
All three contain 125 ZIP payloads; 123 remain byte-identical to frozen V3.
Only common document/style fixture parts differ from V3. Between candidates,
exact text, paragraph/table/run boundaries, font resources and all non-target
properties remain identical. Pure Latin control runs remain unchanged.
Independent saved-package check passed 331 focused assertions; candidate hashes
and frozen inputs remain unchanged after Word export and verification.

### V6 Word comparison results

The owner exported all three PDFs through Word: five pages each. Root rendered
and reviewed all 15 complete pages. No visible clipping, overlap or box/replacement
glyphs was found in these specimens; the deliberately failing emphasis control
is recorded separately below and is not a deliverable-ready candidate.

Both CS variants add `w:cs` to 24 Thai-containing text runs, including whole
mixed runs; they do not force RTL. The synchronized variant additionally writes
explicit `bCs/iCs` true **and false**, with `szCs` matching the original intended
size. Every target has direct `b/i/sz` and all font slots resolve to Sarabun.
This known-fixture rule is not a general style-inheritance or font resolver.

| Check | Baseline | CS only | CS with formatting preservation |
| --- | --- | --- | --- |
| Natural intro wrapping | Reproduces V5 differences | All three chunks match Core reference endpoints | Same match |
| Natural mixed bold heading | Bold retained | Bold retained | Bold retained |
| Paired direct four-style controls | All requested faces retained | All retained | All retained |
| Inherited-on/direct-off controls | All requested faces retained | Regular, bold and italic incorrectly become boldItalic | All requested faces retained |
| Inline transitions | Measured segments retained | Retained | Retained |

Source-relative intro break ends, after the same explicitly lossy PDF alignment
used in V5:

| Chunk | Baseline ends | Both CS variants and Core PDF ends |
| --- | --- | --- |
| First Thai chunk | 50, 145, 210, 300, 391 | 103, 210, 312, 391 |
| First mixed chunk | 96, 202, 246, 312 | 96, 202, 304, 312 |
| Second mixed chunk | 73, 176, 272, 330 | 114, 219, 315, 330 |

The table excerpt also retains its normalized text sequence; its Kick-Off row
wraps differently when CS is selected. This does not certify table wrapping
against every source PDF row. Natural heading PDF size stays 12.96 pt and
controlled text paints at 11.04 pt across variants; DOCX intended sizes remain
13/11 pt. Font stream metadata (name tables, OS/2 weight/style, head style and
italic angle) supports Sarabun regular/bold/italic/boldItalic selection, rather
than relying only on Word's temporary PDF font labels. Full outline identity
and fallback behavior outside these specimens were not checked.

CS-only and synchronized rendered pixels are identical on pages 1, 2, 3 and 5;
only page 4 differs. On page 4 the CS-only candidate paints every controlled
body row as boldItalic, including the three rows requesting another style.
Both Thai and Latin show the same failure. Explicit off values in the
synchronized candidate restore the requested four styles. This proves a
controlled inheritance risk; it does **not** demonstrate an emphasis defect
in the natural SRS, whose existing standard/CS effective values already agree.
Page E's regular segment contains only Thai, so Latin regular at that particular
transition is absent coverage; regular Latin is covered on pages C/D.

### V6 decision and limits

**PASS bounded mixed-script/emphasis experiment:** retain the CS selector
together with the original effective emphasis/size/font policy as the next
experimental mapping candidate. Selecting CS alone is insufficient for a writer
that must preserve inherited formatting. Resolve effective values before mapping;
do not equate a missing property with an explicit false or introduce RTL as a
substitute. Research of pinned `docx@9.13.0` also found that explicitly passing
false to its CS emphasis options can omit the XML element; inspect emitted XML
or use a verified emission path when an inherited true must be overridden.
See [CS formatting](https://learn.microsoft.com/en-us/dotnet/api/documentformat.openxml.wordprocessing.complexscript?view=openxml-3.0.1)
and [CS italic inheritance](https://learn.microsoft.com/en-us/dotnet/api/documentformat.openxml.wordprocessing.italiccomplexscript?view=openxml-3.0.1).

No global/full-SRS candidate is created in V6. General paragraph/character/table/
numbering inheritance, differing font slots, fallback, arbitrary run splitting,
whole-document reflow/pagination and strict raw Thai PDF text/glyph fidelity
remain outside this acceptance. The font-signature defect, repeated meeting
header and line/row-height work remain separate existing findings. No PDF
reference, source template/data, product repository, dependency/runtime/OS setting
or map is changed. Stop after this comparison and summarize before expanding.

Locators under `tuning-v6/`: `inventory/srs-style-inventory.json`,
`research/mapping-rules.json`, `probe-manifest.json`, `package-check.json`,
`inventory/saved-package-check.json`, `word-review/comparison.json`,
`word-review/emphasis-observations.json` and `word-review/root-review.json`.
The last separates root visual acceptance from raw observations; initial
package/research records retain their original pre-export status. Reproduction
helpers are `scripts/build_mixed_emphasis.py`, `scripts/observe_word.py` and
`word-review/measure_emphasis.py`. These are disposable experiment helpers,
not installed writer or product tests.

## V7 full SRS formatting-preserving CS comparison

เจ้าของอนุญาตวันที่ 2026-10-21 ให้ใช้ complex script พร้อมรักษารูปแบบเดิม
กับ SRS เต็มในพื้นที่ทดลอง แล้วตรวจการตัดบรรทัด ตาราง และการแบ่งหน้าเทียบ
PDF เดิมก่อน. เป็น bounded inline experimental scope ใหม่; ไม่เปลี่ยน
acceptance ของ V5/V6 หรือเปิด registered execution. Roles: Planning Partner /
Evidence Reviewer / Documentation Synthesizer; Work/Phase/Checklist IDs N/A.
Owner: Project Control สำหรับบันทึกนี้; disposable writer experiment สำหรับ
Core owner. Product repositories ไม่ใช่ mutation target ของรอบนี้.

Allowed: new `tuning-v7/`, fresh `outputs/srs-cs-preserved-v7.docx` และ owner
Word PDF ชื่อเดียวกัน, section นี้และ current status. Frozen V3/V5/V6 artifacts,
PDF reference, source template/data, dependency/runtime/OS settings และ maps
คงเดิม. ใช้ isolated experiment root เดิมและ clean separable PC checkout.
Work Size medium; Risk Tier routine. Model decision: retain current host model
สำหรับ bounded same-chat continuation; ไม่ dispatch registered product WORK.

Acceptance: preflight ทุก active story part; apply CS เฉพาะ text runs ที่มีไทย
โดยรักษา effective font/emphasis/size และ explicit off, ไม่เปลี่ยน text/runs/
tables/images/fields/section/page-break policies. Unsupported font slots หรือ
style semantics ต้องเป็น finding ไม่ใช่ silent fallback. ตรวจ package invariants
ก่อน Word export; หลัง export เทียบ intro line breaks, semantic content order,
tables/table splits, images/TOC/page fields และ whole-document pagination กับ
98-page Core PDF โดยใช้ V3 Word PDF เป็น regression context. Review output
ทุกหน้า พร้อม source-aligned comparison; ความต่างที่ยอมรับและ gaps ต้องแยก
จาก missing content หรือ source/structure defects.

Proof budget: full-SRS candidate หนึ่งไฟล์และ owner Word export หนึ่งรอบ;
focused package checks และ one all-page comparison/review cycle. Render QA
candidate ทุกหน้าและ source pages ที่ใช้เทียบ; parallel read-only reviewers
อาจแบ่งช่วงหน้าได้ แต่ไม่สร้าง corrective candidate เพิ่มในรอบนี้. ไม่ตั้ง
สมมติฐานว่า page numbers ต้องเท่ากัน และไม่ใช้ lossy Thai normalization แทน
strict text/glyph proof. Document budget: update แผนนี้; scripts/JSON/PNG อยู่
ใน experiment root. Generation และ verification แยกขั้น; checks ไม่แก้ candidate.

Current status: **COMPLETED WITH LAYOUT FINDINGS**. Full candidate และ Word
comparison เสร็จแล้วตามผลด้านล่าง; ไม่รับรอง whole-document layout fidelity.
General writer readiness และ other-font coverage ยัง deferred. ไม่มี corrective
candidate เพิ่มใน scope นี้ และไม่มีการเปลี่ยน PDF หรือระบบจริง.

### V7 full candidate and preservation checks

Preflight ตรวจ 45 active story parts: main document, 21 headers, 21 footers,
footnotes และ endnotes. พบ Thai-containing text runs 1,420 จุดทั้งหมดใน
`word/document.xml`: 1,405 จุดมี direct formatting; อีก 15 จุดเป็น cached
TOC hyperlink labels ที่ไม่มี `rPr`. ตรวจ chain จริงของ TOC1/2/3 → Normal
ที่ไม่มี run properties → docDefaults แล้วได้ normal, non-italic, 11 pt และ
Sarabun ทุก font slot ตรงกัน. ไม่สร้าง general style resolver หรือข้ามจุดนี้
โดยไม่แจ้ง. ไม่มี Thai target ใน story อื่น ไม่มี unsupported target, font-slot
mismatch, target character style, revision หรือ existing CS/RTL selector.

สร้าง `outputs/srs-cs-preserved-v7.docx`, 1,083,034 bytes, SHA256
`e5ba0793924984d52c9ded04c7b82e57b4a6f21d75ec17384e182ffa92045a73`.
เปลี่ยนเฉพาะ CS run properties ของทั้ง 1,420 จุด: เลือก CS พร้อม explicit
`bCs/iCs` true/false และ size ที่รักษาค่าเดิม; TOC 15 จุดเพิ่ม `rPr` เฉพาะ
CS values จาก known chain. ไม่เปลี่ยน ordinary inherited formatting, text,
run boundaries, section geometry หรือ page-break policies. XML เพิ่ม 72,615
bytes; inverse เฉพาะ allowed changes คืน entire raw source XML ได้ตรงทุก byte.

Independent saved-package check ผ่าน 33,835 assertions: อีก 124 ZIP payloads
และ compressed local records ตรง frozen V3 ทุก byte. Exact ordered text,
fields และโครงสร้างคงเดิม: 2,761 paragraphs / 4,609 runs / 200 tables /
933 rows / 1,932 cells / 371 drawings / 198 hyperlinks / 922 breaks /
7 sections / 396 bookmarks. Main complex fields 199 และ footer simple fields
36 คงเดิม. Styles/settings/fonts/media ไม่เปลี่ยน. นี่คือ DOCX package proof;
ไม่ใช้แทน rendered PDF content หรือ layout acceptance.

เจ้าของแปลงผ่าน Microsoft Word for Microsoft 365 เป็น
`outputs/srs-cs-preserved-v7.pdf`, 99 pages / 1,015,353 bytes, SHA256
`57af67fa9dc998fd9a7ad0719bfe32d9f701ab16c181dcdd87120d366c269d9f`.
Frozen Core PDF มี 98 หน้า; frozen Word V3 มี 99 หน้าเช่นกัน. Refresh ของ
TOC อาจสร้าง cached run properties ใหม่ใน Word จึงตรวจผล PDF จริง ไม่อ้าง
ว่า selector บน cache ต้องคงอยู่หลัง refresh. Original DOCX hash ไม่เปลี่ยน.

### V7 all-page reference comparison

Render ที่ 120 dpi และตรวจ full page ทุกหน้า: candidate 1–99 และ Core 1–98.
แบ่งช่วง reviewer เป็น 1–25 / 26–50 / 51–75 / 76–99 พร้อม source-aligned
comparison; manually align หน้าไม่มี unique anchors และ long-row continuations.
ไม่มี source page หรือ candidate page ที่หลุดจาก visual coverage. ไม่พบ visible
glyph boxes, clipping, overlap, blank pages หรือ incomplete ending ในรอบนี้;
ไม่อ้างว่าตรวจ raw Unicode หรือทุก glyph program ตรงกันแล้ว.

| Area | Observed result | Acceptance boundary |
| --- | --- | --- |
| Intro Thai/mixed wrapping | ทั้งสาม chunks มี break ends ตรง Core ตาม V6: 103/210/312/391; 96/202/304/312; 114/219/315/330 | PASS จุดที่วัด; ไม่ใช่ universal line-break parity |
| Other wrapping | ตัวอย่างนิยาม SRS หน้า 13 และ requirements หลายจุดยังตัดต่างจาก Core | Readable; บันทึก exact examples ไม่เปลี่ยน PDF ให้ตาม Word |
| DOCX structure/content | Exact source package invariants ผ่าน | ไม่เท่ากับ strict rendered PDF text preservation |
| Body images | 371 placements มี decoded identity/soft mask/order ตรง Word V3 | PASS identity/order; 78 placements ขยับตาม reflow บน pages 53–61 |
| TOC | 198/198 resolve, printed page ตรง destination และ source label corroborates ที่ link/target | PASS functional; 16 destination/geometry differences ตาม reflow, ไม่อ้าง identical geometry |
| Header/page fields | 98 banners; cover ไม่แสดงเลข แล้ว pages 2–99 แสดง Page p of 99 ถูกต้อง | PASS policy; ไม่ต้องบังคับ page count เท่ากับ Core |
| Whole pagination | Word 99 เทียบ Core 98; offset เปลี่ยนตามช่วง ไม่ใช่ +1 คงที่ | เป็น recorded difference; fidelity ยังมี findings ด้านการจับกลุ่มตาราง |

Semantic alignment ใช้ 463 eligible unique paragraph anchors; candidate map
ได้ 429 จุด. จาก source 933 rows ยังมี 532 rows ที่ไม่มี unique text anchor
เช่น short/repeated/image-only cells; ใช้ manual source comparison ช่วย แต่ไม่
ประกาศ automated cell-by-cell equality. Raw pypdf page text ตรง V3 เพียง
48/99 หน้า. Lossy Thai normalization ใช้จัดตำแหน่งเท่านั้น ไม่ใช่ raw text/glyph
proof หรือหลักฐานว่าจุดที่ map ไม่ได้เป็น missing content.

### V7 remaining table and pagination findings

1. **Persistent wrong meeting header:** Word V3 และ V7 แสดงหัวประชุมครั้งที่ 1
   บน pages 17–26 ขณะที่ Core แสดงครั้งที่ 1 เฉพาะ 17 แล้วใช้เลขของการประชุม
   ที่กำลังต่อหน้า. ตัวอย่าง V7 page 18 เป็นเนื้อหาครั้งที่ 2 แต่หัวซ้ำเป็น 1;
   page 26 ต่อครั้งที่ 15 ก็ยังหัว 1. ไม่ถือเป็นปัญหาตัดคำที่ CS แก้แล้ว.
2. **Persistent heading/table separation:** เช่น V7 pages 28, 33, 35–44,
   74 และ 83 มีหัวข้อหรือคำอธิบายอยู่ท้ายหน้าแต่ตารางเริ่มหน้าถัดไป.
   ตรวจ V3 supporting evidence แล้วพบปัญหาเดิมในตัวอย่างที่รายงาน;
   ไม่ยกทั้งหมดเป็น regression จาก CS.
3. **Persistent detached icons/text:** เช่น REQ0003/0026/0034 ที่ pages
   46/49/50 และ REQ0270, REQ0293, REQ0331 ในช่วงท้าย. V3 visual comparison
   ยืนยัน representative cases เดิม; บาง continuation เหลือเฉพาะ blue icon
   หรือ `-Image` บนหน้าใหม่ ทำให้ความสัมพันธ์กับข้อความอ่านยากขึ้น.
4. **New reflow instance:** REQ0074 text อยู่ท้าย V7 page 55 แต่ blue icon
   อยู่ลำพังต้น 56. Core page 55 และ Word V3 page 56 เก็บ text+icon ร่วมกัน.
   จึงเป็นจุดแบ่งใหม่จากรอบนี้ แม้ general row/image splitting policy มีปัญหา
   เดิมอยู่แล้ว (เช่น V3 page 55 มี icon continuation ของ REQ0063).
   ไม่อ้างว่ารอบนี้ปราศจาก layout regression ทุกจุด.
5. **Other splits with unresolved regression status:** icons ของ REQ0113/
   REQ0133 แยกบน V7 pages 61/64 ต่างจาก Core; ไม่ได้ตรวจ V3 counterpart
   สองจุดนี้แยกอีก จึงรายงานเป็น confirmed Core difference และ unknown ว่า
   เป็นจุดใหม่หรือเดิม ไม่เพิ่ม proof นอก budget เพื่อบังคับ classification.
6. **Residual spacing/wrap/TOC appearance:** overview 7.5 ลงท้ายด้วยคำ
   `รายงาน เป็นต้น` บน V7 page 15 แทน Core 14; scope 10.4.1 เลื่อนไป 17.
   ตารางนิยาม/Element มี vertical drift และบางข้อความตัดบรรทัดต่าง.
   TOC มี dotted leaders และเลขหน้าที่ดูต่าง: วัด page-4 digits พบ AngsanaNew
   11.04 pt ในทั้ง V3/V7 เทียบ Core font label FlowDocSubset-0 ที่ 11 pt.
   เป็น face difference ที่มีอยู่เดิม ไม่ใช่หลักฐานว่ารอบนี้ลดขนาดเลขหน้า.

**Decision:** completed the authorized full-SRS comparison with findings;
ไม่รับรอง layout fidelity หรือ product readiness. เก็บ CS พร้อม formatting
preservation เป็นแนวทางของ prototype ต่อได้ แต่ต้องจูน meeting-header semantics,
การจับหัวข้อกับตาราง และ row/text/icon page grouping ก่อนนำเข้าระบบจริง.
ยังไม่จำเป็นต้องแก้ PDF จากผลนี้ และไม่เปลี่ยน PDF/source/runtime จริง.
ไม่มี corrective candidate หรือ product repair ใน checkpoint นี้.

Locators ใต้ `tuning-v7/`: `generation.json`, `package-check.json`,
`preflight/{full-srs-mapping-preflight,target-plan,saved-package-check}.json`,
`comparison/{design.json,compare_v7.py}`, `word-review/comparison.json`,
`word-review/root-observations.json`, `word-review/root-review.json`,
`qa/reviews/pages-{001-025,026-050,051-075,076-099}.json` และ full-page renders
ใน `qa/{reference,candidate}/`. Root summary ตรวจ union ของ visual coverage
และ immutable input/candidate hashes อีกครั้ง; observation records ที่เขียนก่อน
Word export คงสถานะ pre-export เดิม ไม่ย้อนแก้ให้ดูเหมือนผ่าน Word มาก่อน.

## V8 meeting headers and content grouping trial

### Bounded scope and acceptance

คำขอเจ้าของ 2026-10-21 อนุญาตแก้เฉพาะ candidate ทดลองจาก V7 ให้หัวตาราง
ประชุมใช้เลขของครั้งที่กำลังต่อหน้า หัวข้อ/คำอธิบายอยู่กับต้นตาราง และไอคอน
อยู่กับข้อความที่สัมพันธ์กัน. ใช้ SRS/source เดิมใน experiment root เดิม;
PDF ต้นแบบ, resolved data, V7 และ product/runtime ทั้งหมด frozen.
นี่เป็น scope ใหม่ต่อจากผล V7 ที่คงประวัติไว้ ไม่ย้อนเปลี่ยน acceptance เดิม.

Owner: Project Control สำหรับแผน; prototype writer ใน experiment root
สำหรับ candidate. Role: Planning Partner / Evidence Reviewer /
Documentation Synthesizer. Single-room, unregistered; execution IDs N/A.
Work Size: small; Risk Tier: routine. Work authority: bounded prototype
implementation หลัง read-only discovery แล้ว verification ที่ไม่แก้ candidate.
Model decision: ใช้ host/session model ปัจจุบันกับ bounded inline task;
ไม่มี separate WORK หรือ model override. Helpers แยก read-only discovery
และ verification ไม่รับ ownership ของ product lane.

Document Budget: อัปเดตแผนนี้ไฟล์เดียว. Proof Budget: หนึ่ง full-SRS candidate,
source mapping, package/inverse preservation checks, หนึ่ง manual Word export
และ all-page review เทียบ frozen Core PDF พร้อม targeted comparison V7.
หากยังมี finding ให้บันทึกก่อนเริ่ม candidate/review cycle เพิ่ม.
ข้อเท็จจริงจาก V7 ที่ยังไม่เปลี่ยนใช้ผลเดิม ไม่ทดสอบ controls V5/V6 ซ้ำ.

Acceptance: หัวประชุมไม่ซ้ำผิดเลข; representative headings/descriptions
และไอคอนที่แยกเดิมอยู่กับ content ที่เกี่ยวข้อง; long rows ยังแบ่งหน้าได้;
text/runs/fields/images/section geometry/CS formatting และ package parts
นอกขอบเขตคงเดิม. ตรวจ all-page output ว่าไม่มี visible clipping, overlap,
glyph boxes หรือ missing ending พร้อม functional TOC/page fields หลัง reflow.
Page count/line breaks อาจต่างจาก Core ตามข้อตกลง; ไม่ปรับ typography,
TOC appearance, general row heights, PDF หรือ production เพื่อบังคับจำนวนหน้า.
ความเสี่ยงคือ grouping อาจเปลี่ยน pagination หรือถูก Word ตีความต่างจาก XML;
static checks จึงไม่แทน Word rendering. สถานะเริ่มต้น: discovery in progress;
ผลสิ้นสุดและข้อจำกัดอยู่ด้านล่าง.

### V8 source diagnosis and candidate

Read-only discovery แก้ความเข้าใจเรื่องสาเหตุให้แม่นขึ้น: V7 มีตารางประชุม
แยกอยู่แล้ว 15 ตาราง (source indexes 19–33), ครั้งที่ 1–10 และ 12–16.
แต่ละตารางมีหัวแถวแรกและเลขของตัวเองถูกต้อง; ไม่มีครั้งที่ 11 ใน source.
ทุกตารางมี `tblPr/tblGrid` ตรงกันและวางเป็น adjacent `w:tbl` ไม่มี paragraph
คั่น 14 จุด. ไม่ใช่ source รวมทุกครั้งเป็นตารางเดียวหรือข้อมูลหัวผิดเลข.
ข้อสันนิษฐานคือ Word รวมตารางที่ติดกันและใช้หัวแรก; V8 ยืนยันเชิงผลลัพธ์ว่า
เพิ่มตัวคั่นแล้วหัวต่อหน้าถูกเลข ไม่อ้างว่า trace internal Word implementation.

สร้าง `outputs/srs-grouped-v8.docx`, 1,084,106 bytes, SHA256
`972b987f758df41d8c2dbf1970cc2faa89b2c85d8fd031634c6ee33784727bbb`.
เปลี่ยนเฉพาะ main document part จาก frozen V7:

- เพิ่ม empty paragraph 14 จุดระหว่างตารางประชุมเดิม; before/after 0,
  exact line 1 twip, paragraph-mark size 1 pt และ keep-with-next.
  ไม่มี visible blank separator line ใน Word output; ไม่ split/rewrite ตาราง
  หรือแก้ `tblHeader`, row/cell properties.
- จับ 172 heading/table chains รวม 221 paragraphs (189 headings + 32
  descriptions) ด้วย `keepNext`; เพิ่ม `keepLines` เฉพาะ headings.
  ไม่มี chain ข้าม section/page break หรือเข้า TOC/list/hyperlink.
- จับ 363 text/icon pairs (361 requirement rows + 2 unnumbered note rows)
  ด้วย `keepNext` บน text paragraph ก่อน icon; คง `keepLines=false`
  เพื่อให้ข้อความยาวแบ่งหน้าได้. ไม่เปลี่ยน 8 legend images ที่ไม่มี text
  ก่อนหน้าใน cell; ไม่ใช้ blanket `cantSplit` หรือจับทั้งตารางไว้หน้าเดียว.

การเลือก targets อิง source paragraph/table/row/cell identity ไม่อิงเลขหน้า
หลัง render. [Microsoft KeepNext semantics](https://learn.microsoft.com/en-us/dotnet/api/documentformat.openxml.wordprocessing.keepnext?view=openxml-3.0.1)
รองรับการให้บางส่วนของย่อหน้าอยู่หน้าเดียวกับย่อหน้าถัดไปและยังแบ่งกลุ่มที่ยาว
เกินหน้าได้; จึงยังต้องดู Word จริง. ตารางประชุมคงกติกา
[repeat-header ของแถวแรก](https://learn.microsoft.com/en-us/dotnet/api/documentformat.openxml.wordprocessing.tableheader?view=openxml-3.0.1)
เดิม ไม่สร้างข้อความหัวต่อหน้าขึ้นเอง.

Builder raw inverse คืน source XML ทุก byte ได้; independent saved-package
check ผ่าน 19,818 assertions และ derive targets จาก topology แยกจาก manifest.
มีเพียง 584 paragraph-property targets และ 14 separators; raw XML ลด 8,428
bytes จากการเขียน true แบบ empty element. อีก 124 ZIP payloads และ compressed
local records ตรง V7 ทุก byte. ลบเฉพาะ separators และย้อน target properties
แล้วได้ entire V7 canonical XML เดิม. คง ordered text, 4,609 runs/CS formatting,
200 tables/933 rows/1,932 cells/371 drawings/198 hyperlinks/922 breaks/
7 sections/396 bookmarks/199 main field instructions. Paragraphs เพิ่ม
2,761 → 2,775 เท่านั้น; styles/settings/fonts/media/header/footer ไม่เปลี่ยน.
ขนาด serialized XML นี้ไม่ใช่ผลวัด RAM หรือ Word performance.

### V8 Word rendering and comparison results

เจ้าของแปลงด้วย Word for Microsoft 365 เป็น `outputs/srs-grouped-v8.pdf`,
100 pages / 1,017,481 bytes, SHA256
`2d129ea6348ef047216bb917a55977b3e11a124f59f046b6336c9572d11d53ab`.
Word V7 มี 99 หน้า; frozen Core PDF มี 98 หน้า. Render 120 dpi และเปิด
full-page candidate 1–100 / Core 1–98 ครบทุกหน้า พร้อม V7 supporting pages
สำหรับจุดเดิม. ไม่พบ visible glyph boxes, clipping, overlap, blank pages หรือ
incomplete ending ในรอบนี้; ไม่ใช้แทน raw Unicode/every-glyph/every-cell proof.

| Authorized target | Observed result | Boundary |
| --- | --- | --- |
| Meeting header numbers | Pages 18–26 ใช้ 2/3/5/7/8/10/12/14/15 ตามการประชุมที่ต่อหน้า; ครั้ง 16 เริ่มต่อบน 26 ถูกต้อง | แก้การซ้ำเลข 1 แล้ว; meeting 2 ย้ายไปเริ่ม 18 และ meeting 7 ยังแบ่ง 20–21 |
| Heading + description + table | จุดที่รายงานเดิมอยู่ด้วยกัน: 4.4 ที่ 29; 7.5 ที่ 34; 9.6 ที่ 36; 9.14 ที่ 37; 10.6 ที่ 38; 11/11.1 ที่ 39; 11.9 ที่ 40; 11.17 ที่ 41; 12.4 ที่ 42; 13.5 ที่ 43; 14/14.1 ที่ 44; 15.3 ที่ 45; 16.19 ที่ 76; 16.24 ที่ 85 | ไม่พบ orphan headings ใน all-page review; ไม่บังคับ table/whole-row ให้อยู่หน้าเดียว |
| Nine previously reported icon cases | REQ0003/0026/0034/0074/0113/0133/0270 อยู่กับข้อความที่ 46/49/50/56/61/64/81; REQ0293 รายการ Subject/Description/Image + icon อยู่ 84; REQ0331 สองบรรทัดท้าย + icon อยู่ 90 | สองกรณีท้ายยังมีส่วนต้น row อยู่หน้าก่อน; ไม่มี icon-only continuation ในจุดเหล่านี้ |
| Images | 371 ordered decoded body placements/soft masks ตรง V3/V7/V8 | PASS identity/order; ตำแหน่งเปลี่ยนตาม reflow ไม่ใช่ equal geometry |
| TOC and page policy | 198/198 links resolve และ printed page ตรง destination; cover ซ่อนเลข, pages 2–100 แสดง Page p of 100; 99 banners ถูก policy | Functional PASS; รูปแบบ TOC/font face ยังต่างจาก Core |
| Intro CS wrapping | Relevant frontmatter/intro body pixels pages 1–4 และ 10–16 ตรง V7 (ยกเว้น footer/page total) | ใช้ V7 wrap findings เดิมต่อได้; ไม่อ้าง wrap parity ทั้งเอกสาร |

Automated suffix indicators สำหรับ 363 text/icon pairs: V7 มี 324 unique
suffixes อยู่หน้าเดียวกับ icon, 8 อยู่ต่างหน้า, 6 short/19 repeated/6 unresolved.
V8 มี 324 same-page, 0 different-page indicators, 6 short/19 repeated และ
14 unresolved. บาง suffix ยาวคร่อมหน้าเมื่อ reflow; จำนวน unknown ที่เพิ่ม
ไม่ใช่หลักฐานว่าเนื้อหาหาย และ 0 indicators ไม่ใช่ automatic all-pass.
ใช้ all-page visual review และ source-specific known cases ประกอบ.
Generic paragraph/row anchors ยังไม่ครอบคลุมทุก cell: รอบนี้ 549/933 rows
ไม่มี unique candidate text anchor; ไม่ประกาศ automated cell equality.

### V8 remaining limits and checkpoint decision

- **Requirement-column header repetition ยังมีปัญหา:** บาง continuation pages
  ไม่แสดง `Req no. / Features List / Remark` ซ้ำ เช่น V8 52, 56, 57,
  60, 61, 64, 65, 67, 72, 73, 75. ยืนยัน general behavior เดิมใน V7
  52/57; V8 56 เป็น reflow instance ใหม่ (REQ0065 ขึ้นหน้าใหม่หลังตาราง
  16.5 เริ่มที่ 55). ไม่ปะปนกับ meeting-number defect ที่แก้แล้ว และไม่อ้าง
  ว่าไม่มี layout regression instance ใดเลย.
- Long rows ยังแบ่งต่างจาก Core เช่น REQ0019: V8 48–49 เทียบ Core 47;
  REQ0241: V8 76–77 เทียบ Core 75. การจับ icon รักษาท้ายข้อความร่วมกัน
  ไม่ใช่การรับรอง whole-row non-splitting หรือ identical pagination.
- General line/row height, บาง gray-header border edges, ordinary wrapping,
  overview 7.5 ที่ต่อ 14–15, outline 10.4 ที่ต่อ 16–17 และ TOC dotted
  leaders/number face ยังต่าง. ไม่ tune นอกสามเป้าหมายเพื่อบังคับ 98 หน้า.
  Core เองมี icon-only continuations บางจุด เช่น REQ0280/0290/0357/0362;
  semantic grouping ที่ดีขึ้นจึงไม่เท่ากับ copy ทุก page break จาก Core.
- Discovery `grouping.json` บาง `requirementIds` ได้จาก concatenated row text
  จึงอาจติดเลขต้น content. ตัวเลือก paragraph targets ไม่กระทบ; observation
  helper ใช้ exact first-cell REQ label แทน และเก็บ discovery เดิมไว้ไม่ย้อนแก้.

**Decision:** COMPLETED WITH REMAINING LAYOUT FINDINGS สำหรับ bounded V8
trial. ยืนยันผลแก้สามเป้าหมายตามตัวอย่างเดิมและ all-page inspection แล้ว;
full layout fidelity/product readiness ยัง NOT ACCEPTED. คง candidate และ
ข้อจำกัดไว้ให้เจ้าของประเมิน. งานถัดไปที่เหมาะคือแยกจูน repeated requirement
column headers ก่อน general spacing/typography; ไม่แก้ PDF หรือระบบจริง.
ไม่มี candidate/review cycle เพิ่มหลังจุดตรวจนี้.

Locators ใต้ `tuning-v8/`: `discovery/{meeting,grouping}.json`,
`generation.json`, `scripts/{build_grouping_trial,check_package,observe_grouping}.py`,
`preflight/independent-package-check.json`,
`word-review/{comparison,grouping-observations,root-review}.json`,
`qa/candidate/manifest.json`, `qa/reviews/pages-{001-025,026-050,051-075}.json`,
`qa/reviews/pages-076-end.json`,
`qa/reviews/reference-001-025-completion.json`. Original source, V7 and V8
candidate hashes ตรวจซ้ำหลัง QA; checks เขียนเฉพาะ outputs ใหม่ใน lane.

## V9 repeated requirement-header trial

### Scope and corrected discovery

คำขอเจ้าของ 2026-10-21 อนุญาตหาสาเหตุและจูนหัวคอลัมน์ตารางที่ไม่แสดงซ้ำ
ใน SRS เดิม พื้นที่ทดลองเดิม แล้วเทียบ PDF อีกครั้ง. Frozen base คือ V8
`srs-grouped-v8.docx/pdf`; source/resolved/Core PDF และ product/runtime
ทั้งหมดไม่เปลี่ยน. Owner/roles และ single-room unregistered mode ตาม V8;
execution IDs N/A. Work Size small / Risk routine; current host/session model,
ไม่มี override หรือ separate WORK. ขั้นแรก read-only discovery ก่อน candidate
implementation แล้ว verification แยกที่ไม่แก้ candidate.

Document Budget: แผนนี้ไฟล์เดียว; raw diagnostics/scripts/artifacts อยู่ใต้
`tuning-v9/`. Proof Budget: minimal full-SRS candidate จากการวินิจฉัย,
package containment/inverse check, manual Word PDF export และ all-page
comparison; หาก single-property experiment ยืนยันสาเหตุแต่ทำ icon แยก
อนุญาตหนึ่ง bounded paragraph-boundary fallback พร้อมบันทึกเหตุผลก่อนสร้าง.
ไม่ทดลอง header flags, row heights, fonts หรือ whole-row non-splitting
หลายปัจจัยพร้อมกัน. Acceptance: หัวคอลัมน์แสดงในทุก requirement table page,
รวมช่วงกลาง REQ0041; icon/heading/meeting fixes ของ V8 ยังคงได้ผล;
เนื้อหา/รูป/fields/geometry คงเดิมตามขอบเขตที่ระบุ และไม่มี visible clipping,
overlap, missing ending. ยังยอมให้ line/page breaks ต่างจาก Core.

**Correction to V8 reporting:** retained V8 review เคยระบุ pages 52, 56,
57, 60, 61, 64, 65, 67, 72, 73, 75 ว่าขาดหัว และยก V7 52/57 ว่าเป็น
ปัญหาเดิม. ตรวจ current PDFs ทั้งหมดใหม่ด้วย source-bounded header geometry
และภาพ full-page/pixel corroboration พบว่า **V8 ขาดจริงเฉพาะ 52**:
54/55 requirement pages มีหัว; V7 มีครบ 55/55 และ Core ครบ 54/54.
รายงาน V8 ที่กว้างกว่านี้และการจัดเป็น pre-existing general behavior ผิด.
เก็บ original reports ไว้พร้อม correction นี้ ไม่ย้อนแก้ให้เหมือนตรวจถูกตั้งแต่แรก.
ไม่มีเหตุสรุปว่าเป็น generic Word bug จากรายงานเดิม.

Source/header checks: requirement tables 26 ชุดมี `repeatHeaderRows=true`,
header count 1 และ row0 `tblHeader` enabled ถูกต้อง; ไม่มี manual page break,
floating/nested table, vertical merge หรือ oversized header. จุดจริงคือ
table177 / row2 / cell1 / global paragraph1395, REQ0041: 2,012 chars,
73 text segments และ 72 line breaks ภายใน paragraph เดียว. Exact line
397 twips ทำให้ minimum text height 1,449.05 pt เทียบ body 689.7 pt.
V8 paragraph นี้ `keepNext=true` ต่อ icon; V7 เดิม false. V8 row คร่อม 51–53
และหัวหายช่วงกลาง 52. Hypothesis: oversized keep-with-next group ทำให้ Word
เลือก pagination path ที่ไม่ repeat header. ยังต้องยืนยัน causal effect ใน Word.

Minimal trial จะคืน `keepNext=false` เฉพาะ paragraph นี้ก่อน โดยไม่แก้ header
flag/row/table หรือโครงสร้าง. หากหัวและ icon อยู่ถูกที่ทั้งคู่ ไม่ต้องเปลี่ยน
paragraph structure. หากจำเป็น fallback จะแบ่งเฉพาะข้อความนี้ตาม existing
semantic boundaries เป็น native paragraphs และผูกเฉพาะท้ายข้อความกับ icon.
ไม่ใช้ `cantSplit` กับแถวยาวเกินหน้า: Microsoft
[implementation note](https://learn.microsoft.com/en-us/openspecs/office_standards/ms-oi29500/a55188f7-2443-4c17-ba5a-75999085bab4)
ระบุข้อจำกัดการแสดง overflowing row ซึ่งไม่เหมาะเป็นทางแก้กรณีนี้.

Discovery locators: `tuning-v9/discovery/{header-source,pdf-header-map}.json`,
source-bounded scanner `tuning-v9/scripts/scan_requirement_headers.py` และ
fresh corroboration renders ที่ไม่ทับ V7/V8. Header ROI ของ V7 52 / V8 53/56
มี gray fill 38,609 pixels; V8 52 มี 0. Fresh images ตรง retained PNG bytes;
ไม่มี render-cache inconsistency. สถานะเริ่มต้น: one-property trial pending;
ผลทดลองและการรับผลอยู่ด้านล่าง.

### V9 single-property candidate and preservation

สร้าง `outputs/srs-header-repeat-v9.docx`, 1,084,112 bytes, SHA256
`a23be445751f2fdf593f9fc37a966da898a98c9318e4abb8459a77876afe4743`.
คืน `keepNext=false` เฉพาะ paragraph1395 ของ REQ0041; ไม่แก้ paragraph
boundaries, line breaks, header flags, row/table properties หรือ fonts.
Raw XML เพิ่ม 14 bytes จาก explicit false. การผูกข้อความกับ icon อีก 362 จุด
และ heading/meeting changes ของ V8 คงเดิมทั้งหมด.

Independent saved-package check ผ่าน 9,787 assertions. เลือก target จาก
REQ0041 first-cell identity แยกจาก builder manifest; inverse one property
คืน entire V8 canonical XML ได้. อีก 124 ZIP payloads และ compressed records
ตรง V8 ทุก byte; raw splice inverse คืน source XML ทุก byte. โครงสร้างเดิม
2,775 paragraphs / 4,609 runs / 200 tables / 933 rows / 1,932 cells /
371 drawings / 198 hyperlinks / 922 breaks / 7 sections / 396 bookmarks /
199 main field instructions คงเดิม. Ordered text, all run/CS formatting,
fields, media และ story parts ไม่เปลี่ยน.

### V9 rendered acceptance and comparison

เจ้าของแปลงผ่าน Word for Microsoft 365 เป็น
`outputs/srs-header-repeat-v9.pdf`, 100 pages / 1,014,742 bytes, SHA256
`30f5e154bfec2c698fc2fc55f839b3ecef7203cee8bb39bb76d1bbab2e92abbd`.
จำนวนหน้าเท่า V8; Core reference ยัง 98 หน้า. ไม่สร้าง fallback candidate
เพราะ single-property trial ผ่านทั้ง header และ icon behavior.

| Criterion | Evidence and result |
| --- | --- |
| Repeat requirement-column headers | Source-bounded geometry scan พบครบ 55/55 pages 46–100, ไม่มี missing page; gray header bands ใน rendered PNG corroborate ทุกหน้านี้ |
| Actual defect at 52 | V8 header ROI gray pixels 0 → V9 38,609; crop/full-page inspection ยืนยัน Req no./Features List/Remark อยู่เหนือ continuation text และไม่ทับกัน |
| REQ0041 content/icon | ยังคร่อม 51–53; ท้ายข้อความและ blue icon อยู่ร่วมกันบน 53. ไม่ต้องเพิ่ม paragraph หรือบังคับ row ให้อยู่หน้าเดียว |
| Other V8 fixes | Meeting numbers/headings/known icon cases คงผลเดิม; changed-page review ไม่พบ visible glyph boxes, clipping, overlap หรือ icon-only ending ที่เกิดใหม่ |
| Body images | 371 ordered decoded placements/soft masks คง identity/order; 24 placements เปลี่ยนตำแหน่งเฉพาะ 53–55 เมื่อข้อความ reflow |
| TOC/page fields/banner | 198/198 links resolve, printed pages และ source labels corroborate; cover ซ่อนเลข, pages 2–100 เป็น Page p of 100 และ 99 banners ถูก policy |

เปรียบเทียบ rendered raster ทั้ง 100 หน้า: 87 หน้าเหมือน V8 ทุก pixel.
ใช้ V8 visual evidence ของหน้าที่ไม่เปลี่ยนซ้ำได้ตาม workflow evidence reuse;
ไม่อ้างว่าเปิดใหม่ครบ 100 หน้า. ตรวจ full V9/V8 ทุก 13 หน้าที่ภาพต่าง และ
Core counterparts สำหรับช่วงที่เปลี่ยน. Changed pages คือ 52–55 และ
60/61/64/68/69/72/77/79/86. สี่หน้าแรกมี header/row reflow; อีกเก้าหน้ามี
ความต่างแคบใน feature text: character sequences/font names/sizes/Y positions
ตรง V8 และ Latin-word X positions ต่างสูงสุด 0.0312 pt
(ประมาณ 0.052 pixel ที่ 120 dpi, 26–102 changed pixels ต่อหน้า).
ไม่พบ visible regression ในการตรวจภาพคู่. Raw pypdf page text ตรง V8
96/100 หน้า; ต่างเฉพาะ 52–55. เป็น corroboration ไม่ใช่ every-glyph proof.
Header acceptance ใช้ geometry + rendered pixel/visual evidence ใหม่แทน
classification ผิดในรายงาน V8 ไม่ใช้ evidence reuse เพื่อคงข้ออ้างผิดนั้น.

### V9 decision and limits

**Decision: PASS for this bounded repeated-header correction.** เปลี่ยน property
เดียวแล้วหัวหน้า 52 กลับมา ขณะที่ text/icon relation ยังถูกต้อง จึงยืนยัน trigger
เชิงทดลองจาก oversized keep-with-next group ที่ V8 เพิ่ม; ไม่สรุป internal
Word algorithm หรือ universal limit. ไม่ต้องเปลี่ยน PDF หรือ source structure.

V9 เป็น specific frozen-SRS prototype; ยังไม่ใช่ generic oversized-paragraph
policy หรือ product implementation. General wrapping/row height/border/TOC
appearance และความต่าง 100 vs Core 98 หน้ายังมีตามผลก่อนหน้า; full layout
fidelity/product readiness ยัง NOT ACCEPTED. ไม่มี Word performance benchmark
หรือข้อสรุปสาเหตุการประมวลผลช้าจากผลรอบนี้. หยุด candidate/review cycles
หลัง acceptance; งานถัดไปจึงค่อยจูน spacing/typography ตาม scope ใหม่.

Locators ใต้ `tuning-v9/`: `generation.json`,
`scripts/{build_header_trial,check_package,scan_requirement_headers}.py`,
`preflight/independent-package-check.json`,
`word-review/{header-geometry,comparison,render-diff,root-observations,root-review}.json`,
`qa/candidate/manifest.json`, `qa/details/` สำหรับ header corroboration และ
`qa/reviews/{changed-pages,tiny-diff-pages}.json`. Verification เขียนเฉพาะ
fresh QA outputs; source/V8/V9 hashes ตรวจซ้ำหลัง review.

## V10 separate line-spacing and row-height trials

คำขอเจ้าของ 2026-10-21 อนุญาตวัดและจูนระยะบรรทัดกับความสูงแถวทีละปัจจัย
ใน SRS เดิม แล้วเทียบ PDF. ทั้งสอง branches ใช้ frozen V9 DOCX/PDF เป็น
baseline เดียวกัน; ไม่สร้าง combined candidate หรือแก้ PDF/reference/data/product.
Owner/roles/single-room unregistered mode ตาม V9; execution IDs N/A.
Work Size medium / Risk routine. Work authority: read-only measurement ก่อน
bounded prototype implementation แล้ว verification ที่ไม่แก้ candidate.
ใช้ current host/session model ไม่มี override หรือ separate WORK.

Document Budget: แผนนี้ไฟล์เดียว; scripts/measurements อยู่ `tuning-v10/`.
Proof Budget: สอง independent full-SRS candidates (line-only / row-only),
package containment/inverse checks, manual Word export อย่างละรอบ, source-
aligned spacing metrics และ full-output QA พร้อม evidence reuse เฉพาะภาพ
ที่ตรง baseline. เก็บ/ปฏิเสธแต่ละ factor จากผลจริง ไม่จำเป็นต้องรับทั้งสอง.
ไม่ปรับจนได้ 98 หน้า ไม่รวมผลก่อนรู้ผลของแต่ละตัว ไม่แก้ font size/width/
CS formatting หรือ grouping fixes ของ V8/V9.

Discovery ระบุ body lineHeightPt 19.84; nearest integer twip คือ397=19.85 pt
ซึ่งใกล้ค่าที่ source กำหนดแล้ว. LINE branch จึงเป็น calibration control ลด
เพียงหนึ่ง twip 397→396=19.80 pt ใน1,574 nonempty direct-text paragraphs
(1,530 table +44 body), ไม่มี pStyle/drawing/instrText; ไม่แก้368 empty
paragraphs ที่อาจกำหนด minimum row content. Prediction: อาจไม่ดีขึ้นและ
ควรคง397 หาก measured pitch/visual fidelity แย่ลง.

ROW branch: V9 ไม่มี `trHeight` ทั้ง933rows. แถวสั้นหลาย families สูงกว่า
Coreราว0.44–0.60 pt จาก natural content/padding/border budget; ไม่สามารถ
ลดด้วย minimum row height ที่ต่ำกว่าความสูงธรรมชาติ. ทดลองลด explicit
cell top/bottom padding อย่างละ5twips=0.25pt ใน1,830cells/887rows/183tables
ที่มี four visible `single` borders size4, color666666/000000 และ padding
มากกว่า5twips. รวม revision/meeting/emptyfeature/requirement families;
ไม่รวม white/decorative cover/approval/legend/definition tables. คง line
properties และ borders เดิม; rows auto-expand ได้ ไม่ใช้ exact height/cantSplit.

Acceptance: วัด line pitch และ row-border height ของ source-matched content
แยกจาก glyph ink height; ระบุ factor ที่ใกล้ Coreขึ้น/แย่ลงและข้อจำกัดให้ชัด.
Ordered content/run properties/fields/images/source structure คงเดิม;
header/heading/icon fixes ยังคงได้ผล และไม่มี visible clipping/overlap/
missing ending. Page/line breaks เปลี่ยนได้. Unknowns: Word quantization,
glyph centering, long-row reflow และ inline-image baseline growth อาจทำให้
row/pitch ไม่ตรงทุก family; ห้ามอ้าง universal geometry หรือ product readiness.

### V10 saved candidates and preservation

เจ้าของส่งออกผ่าน Word for Microsoft 365 ครบทั้งสองไฟล์แล้ว. แต่ละไฟล์แยก
จาก V9 โดยตรง ไม่ได้นำ LINE และ ROW มารวมกัน.

| Factor | DOCX / bytes | Word PDF / bytes / pages |
| --- | --- | --- |
| LINE | `outputs/srs-line-spacing-v10.docx` / 1,084,593 | `outputs/srs-line-spacing-v10.pdf` / 1,017,453 / 100 |
| ROW | `outputs/srs-row-height-v10.docx` / 1,084,286 | `outputs/srs-row-height-v10.pdf` / 1,014,540 / 99 |

SHA256 ของ LINE DOCX/PDF ตามลำดับ:
`2fa77bf326af5e6dc91da31af2f977a1af7f4d550d23e53677ca4b2d531d1215` /
`ab8f32d9698cf252486d780db5393ae7e7e143161c18a996d9170771b35b881e`.
SHA256 ของ ROW DOCX/PDF:
`4f4f899d2721775438728924d3a10ad166bf19445b8beb26b4332a29fb329057` /
`6c9ed7824972ee5a71878c63854e73f8c9ae6926639c60db9013a02fde665fd4`.
Baseline V9 ยัง 100 หน้า และ Core reference ยัง 98 หน้า; จำนวนหน้าอย่างเดียว
ไม่ใช่เกณฑ์รับ factor.

Independent package checks ผ่าน LINE 13,717 / ROW 20,563 assertions.
LINE เปลี่ยนเฉพาะ 1,574 line attributes; ROW เปลี่ยนเฉพาะ 3,660 padding
attributes ใน 1,830 cells. กลับค่าปัจจัยที่เปลี่ยนแล้วคืน V9 canonical XML
ได้ทั้งเอกสาร; raw splice inverse คืน source XML ทุก byte. อีก 124 ZIP
payloads/ compressed records ตรง V9 ทุก byte. โครงสร้างเดิม 2,775 paragraphs /
4,609 runs / 200 tables / 933 rows / 1,932 cells / 371 drawings คงเดิม
พร้อม ordered text, CS/font/emphasis, fields และ relationships. V9 paragraph1395
ยัง `keepNext=false`; grouping properties จุดอื่นทั้งหมดไม่เปลี่ยน.

### V10 measurements and rendered comparison

| Criterion | LINE result | ROW result |
| --- | --- | --- |
| Matched line pitch | คลาดกว่า V9: ผลรวม absolute mean-pitch error ของ Customer/Company สองกลุ่ม 0.009 → 0.087 pt | line policy ไม่เปลี่ยนทั้งเอกสาร; measured mean pitch ต่าง V9 ไม่เกิน 0.004 pt ในสามกลุ่ม เป็น export/position phase ไม่ใช่ line-setting change |
| Whole-row border height | 27 common rows: mean error 0.457 pt / max 0.56 pt เทียบ V9 0.514 / 0.64 pt | mean error 0.022 pt / max 0.12 pt; ดีขึ้นใน revision, meeting, empty-feature, requirement header และ short/multiline requirement samples |
| Requirement headers | geometry + rendered gray-band corroboration ครบ 55 pages 46–100 | ครบ 55 pages 45–99 |
| Functional fields/images | TOC 198/198 resolve และ printed page/labels corroborate; page fields/banner ถูก policy; body images 371 ordered decoded identities/soft masks คงเดิม | ผ่านเกณฑ์เดียวกัน โดย footer เป็น Page p of 99 |
| Visual content safety | ไม่พบ visible clipping, overlap, glyph boxes หรือ missing ending ใน full-page review | ไม่พบปัญหาดังกล่าว แต่มี grouping regression ตามรายละเอียดด้านล่าง |

Row metrics ใช้ source-matched content และ border centers ไม่ใช่ glyph ink
height หรือ same-index page assumption. Samples เป็น 27 whole rows ร่วมกัน
จาก revision 4 / meeting1 16 / empty-feature 2 / requirement 4 / header 1.
REQ0004 ถูกตัดออกจาก aggregates ของทุก branch เพราะ ROW split 45→46;
ห้ามใช้ความสูง fragment แรกแทน whole logical row. `row-height-v2.json`
แก้ aggregate ของรายงานแรกและเก็บรายงานเดิมไว้. Line metrics ใช้กลุ่มเดียวกัน
ทั้งสองฝั่ง; Development list ของ LINE คร่อม 51→52 จึงไม่รวม full-span
aggregate ของทั้ง LINE/V9. ใช้ `line-pitch-final.json` แทน aggregate แรก.
ตัวเลขนี้เป็น sample evidence ไม่ใช่การวัดครบทุก paragraph/row.
Row-border height ที่ใกล้กันไม่ได้แปลว่า text baseline ตรงกัน: Latin R ของ
REQ labels สี่แถวที่วัดใน ROW ยังต่ำกว่า Core เฉลี่ย 1.321 pt เทียบ V9
1.591 pt. จึงยังไม่รับรอง vertical text alignment หรือทุก glyph metric.

ตรวจ full candidate pages ใหม่ครบ LINE 1–100 และ ROW 1–99 ที่ 120 dpi;
ใช้คู่ Core/V9 ตาม source content สำหรับจุดเปลี่ยน. ไม่อ้างว่าเปิด Core ใหม่
ครบ 98 หน้า: reuse frozen source QA เดิมร่วมกับ new paired views/metrics.
Raster comparison พบ LINE ตรง V9 ทั้งหน้า 8 หน้า; ROW ตรงเพียง cover.
ส่วน body-only ที่ตรงไม่นับเป็น whole-page equality เพราะ footer/reflow ต่าง.
Repeated meeting numbers คงถูกต้อง รวม source ที่ไม่มี meeting11.
REQ0041 และ known icon endings ยังคงมีข้อความท้ายอยู่กับ icon; long rows
ข้ามหน้าได้และ repeat headers ไม่หาย. Short-row pagination ยังมี tradeoffs:
LINE แยก REQ0043/0055/0116 เพิ่ม; ROW แยก REQ0004/0209 แต่เก็บ REQ0190/0270/
0293/0331 ไว้ทั้งแถวได้ในจุดที่ตรวจ. ไม่ถือทุก row split เป็น content loss.

**พบ regression ที่ ROW 44→45:** หัวข้อ `15.4 Element SRS` และคำอธิบาย
บรรทัดแรกอยู่ท้าย 44; คำอธิบายที่เหลือกับตารางอยู่ 45. Core 44 และ V9 45
เก็บหน่วยนี้ครบหน้าเดียว. เนื้อหายังครบและไม่ใช่ title-only orphan แต่
heading-description-table relationship แย่ลงจาก V9. Lower padding ทำให้
cumulative pagination เปิดเผยว่าการผูกข้าม multi-line description ยังไม่ครบ;
source inspection ยืนยัน description ยัง `keepNext=true` แต่ `keepLines=false`
เหมือน V9 จึงไม่ได้ป้องกันการแยกภายในย่อหน้า. ไม่อ้างว่า grouping properties
ถูกเปลี่ยน. ไม่มีรอบแก้ grouping เพิ่มใน V10.

### V10 decision and evidence boundary

**PASS for bounded measurement/comparison; LINE rejected; ROW geometry
improvement confirmed, whole-document replacement NOT ACCEPTED.** คง line397
ของ V9; เก็บ ROW compensation เป็นผลทดลองสำหรับพัฒนาต่อเมื่อแก้และยืนยัน
grouping regression แล้ว. V9 ยังเป็น baseline ล่าสุดที่รับ bounded fixes ก่อนหน้า;
ไม่ได้อ้างว่า V9 หรือ V10 พร้อมเข้าระบบจริง. ไม่รวมสอง factors ไม่ปรับ PDF
ต้นแบบ ไม่แก้ source data/template หรือ product runtime. หยุดสอง candidate
cycles ตาม Proof Budget หลังบันทึกผลและข้อจำกัด.

Locators ใต้ `tuning-v10/`: `scripts/{build_factors,check_factors,compare_line_pitch}.py`,
`discovery/{line-spacing,row-height}.json`, `discovery/measure_row_height.py`,
`row/scripts/measure_rendered_rows.py`, `{line,row}/generation.json`,
`{line,row}/preflight/independent-package-check.json`,
`{line,row}/word-review/{comparison,header-geometry,line-pitch-final}.json`,
`row/word-review/row-height-v2.json`, `{line,row}/qa/candidate/manifest.json`,
`qa/{render-diff,header-pixel-corroboration,15.4-source-properties}.json`, `qa/reviews/` และ
`word-review/root-review.json`. Original intermediate reports คงไว้พร้อม
superseding observations; verification เขียน fresh QA outputs และตรวจ hashes
หลัง review. Source anchors ที่หาไม่ได้ 550/933 LINE และ 549/933 ROW เป็น
ข้อจำกัดของ unique-text mapping ไม่ใช่หลักฐานว่า content หาย. ไม่มี claim
every-glyph equality, complete border/TOC appearance parity หรือ Word speed.

## V11 cell baseline and semantic grouping investigation

เจ้าของอนุญาตเริ่มสองก้อนแรกหลังทบทวนความต่าง: แยก row extent ออกจาก
text baseline และรักษา heading–short description–table เป็นหน่วยตามโครงสร้าง.
เป็น bounded disposable prototype ในห้องเดิม ไม่ใช่ product implementation.
Owner/roles: Project Control Planning Partner / Evidence Reviewer /
Documentation Synthesizer; future writer owner คือ Core แต่ไม่แก้ Core รอบนี้.
Work Size medium / Risk routine; execution/Phase/Checklist IDs N/A.
ใช้ current host/session model ไม่มี override; helpers อยู่ภายในงานห้องเดียว.

Allowed mutation: แผนนี้, `tuning-v11/` และ candidate outputs ใหม่ใต้ experiment
root เดิม. ห้ามเปลี่ยน source/resolved/reference/V9/V10, production dependencies,
PDF behavior, runtime, maps หรือ published state. Document Budget: แผนเดิมไฟล์เดียว.
Work authority เริ่ม discovery แยกสองสาเหตุ ก่อน bounded candidate creation และ
verification ที่ไม่เปลี่ยน candidate. Current Truth Snapshot อ่านใหม่จาก validated
canonical model แล้ว; DOCX ใช้ explicit request และแผนนี้เป็น inline authority.

Proof Budget: ไม่เกินหนึ่ง full-SRS grouping candidate จาก frozen V10 ROW
และหนึ่ง short baseline probe document จาก SRS เดิม, Word export อย่างละรอบ.
Grouping เลือกตาม heading/paragraph/table properties และ estimated height guard;
ไม่เลือกด้วยชื่อ SRS, เลขหัวข้อ/REQ หรือ global paragraph index. ต้องมี positive
และ negative controls สำหรับ long text/oversized group. Baseline ต้อง trace
font/line placement ก่อนเลือกปัจจัย; ไม่ยกข้อความทั้งหมดด้วยค่าแก้เฉลี่ย 1.32 pt
และไม่ลด line397 ที่ V10 ปฏิเสธ. หากยังแยกสาเหตุไม่ได้ ให้เก็บเป็น unknown
แทนการสร้าง full-SRS baseline correction ที่ไม่มีหลักฐาน.

Acceptance: ตรวจ selector และ mutation containment, ordered content/formatting/
fields/images คงเดิมใน full candidate, ไม่ทำให้ oversized REQ0041 chain กลับมา;
หลัง Word export ตรวจ 15.4 และ counterparts, all repeated requirement headers,
known icon endings และ full output coverage ตาม reuse boundary. Short baseline
probe ต้องวัดกรอบแถว/line pitch/text baseline แยกกัน พร้อมข้อความไทย/อังกฤษ
และรูปแบบที่มีใน SRS. Package PASS ไม่ใช่ rendered acceptance. Word rendering
ยังใช้เจ้าของช่วย export ตามทางที่ตกลงไว้ ไม่รัน conversion อัตโนมัติซ้ำ.

### V11 discovery and prepared Word checkpoint

Baseline trace จาก frozen Core package พบการคำนวณ
`A+(max(lineHeight,A+D)-A-D)/2` โดยเริ่ม A/D จาก face ascender/descender
แล้วขยายตาม shaped ink. Sarabun ทั้งสี่ faces มี hhea/Typo1068/-232 ที่ UPM1000.
Body11pt / source line19.84pt / source top padding3pt ให้ baseline17.518pt,
ตรง Core label ที่วัด17.51884pt. DOCX mapper ส่ง font/line/padding แต่ไม่มี
การคำนวณ baseline นี้; Word เป็นผู้เลือกตำแหน่งภายในบรรทัด. จึงยืนยันความต่าง
ของ baseline policy ที่ boundary ได้ แต่ยังไม่ระบุ internal Word font metrics.
ไม่สรุปว่า OS2Win metrics เป็นสาเหตุจากการเห็นค่าใน font table เพียงอย่างเดียว.

Short probe ใช้หนึ่ง DOCX วาง control3หน้าและ adjusted3หน้า. เปลี่ยนเฉพาะ
cell top/bottom55/55→30/80twips: ย้าย origin ขึ้น1.25pt โดยคง nominal sum
110twips. มี32 controlled cases ต่อชุด: single/multiline, Latin/Thai/mixed,
regular/bold/italic/boldItalic, 11pt line397 และ controlled13pt line480;
มี natural SRS header+REQ0001/0002/0005 และ icons แยกไว้. Font13/emphasis
บางกรณีเป็น labelled controls ไม่ใช่ claim ว่าพบทุกกรณีตามธรรมชาติใน SRS.
Core nominal13pt baseline20.434pt ยังต้องแยกวัดจาก11pt หลัง export.
การคงผลรวม padding ไม่รับรอง rendered row height: ต้องตรวจ border extent,
line pitch, base-letter baseline และ ink clipping แยกกันหลัง Word.

Grouping selector พบ32 plain direct-body descriptions ระหว่าง protected
heading chain กับ table โดยไม่ใช้ข้อความหัวข้อ/เลขREQ/source node ID/index
เป็นเกณฑ์. Source correspondence ของ32จุดตรง resolved sequence ตามลำดับ;
index/node IDs เป็น locator/annotation ภายหลังเท่านั้น. มี nominal multiline
ปัจจุบันหนึ่งจุดคือ15.4; อีก31จุดเป็น counterparts ที่เลือกด้วยกฎเดียวกัน.
Guard ใช้ frozen Sarabun advance estimates +25% reserve +หนึ่งบรรทัดต่อ
paragraph; description group ไม่เกิน¼ body และ heading+description+leading
table group ไม่เกิน½ body. เป็น conservative heuristic ไม่ใช่ formal Word
fit bound. ไม่รองรับ unresolved fonts/complex content; table-cell paragraphs
ถูก exclude จึงไม่แตะ oversized REQ0041. Meaningful RED จาก frozenROW
ยืนยัน15.4ยังไม่ protected;16 structural/source controls PASS รวม renamed
labels, long/broken/field/drawing/list/section/nested-table/oversized groups.

สร้าง full trial `outputs/srs-semantic-grouping-v11.docx`, 1,084,318 bytes,
SHA256 `39a7de89643f901c40a995364b5e8848af73c19b8152035e9178f9ad10d5e0ff`.
เปลี่ยน32 `keepLines=false→true` ตาม selector เท่านั้น; existing keepNext,
V10ROW padding/line/font/fields/media และ V9 oversized-cell correction คงเดิม.
Short trial `outputs/srs-cell-baseline-probes-v11.docx`, 974,943 bytes,
SHA256 `851e448458769c4cfa04fd79d83cad862c8dd6c01abde1ccb33d90e19740bdf5`.
6 planned pages; ไม่มี active band references/TOC ใน probe. สอง candidate
เป็นคนละการทดลอง ไม่เพิ่ม baseline redistribution ลง full SRS.

Locators ใต้ `tuning-v11/`: `discovery/cell-baseline.json`,
`grouping/{structural_selector,build_candidate,test_structural_selector}.py`,
`grouping/{discovery,baseline-red,selector-controls-final,generation}.json`,
`baseline/scripts/build_probe.py`, `baseline/generation.json` และ
`verification/` สำหรับ independent saved-package checks. Word-rendered
acceptance ยัง PENDING; ห้ามใช้ package/static checks ประกาศ15.4หายหรือ
baselineใกล้ขึ้นแล้ว. Source/Core reference/V9/V10 และ production คงเดิม.

Independent review พบ initial probe มีลำดับ CT_PPr ของ diagnostic captions
ผิดห้าจุด (`pageBreakBefore` มาก่อน `keepNext`). เก็บไฟล์/รายงาน FAIL เดิมไว้
และแก้โดย authoring owner ก่อนส่ง Word เป็น
`outputs/srs-cell-baseline-probes-v11-r1.docx`, 974,938 bytes, SHA256
`26407a9ac3677b695db8991ad7442aa42937aabc7a407d191365e9eacb70841b`.
**ให้ใช้ r1 เท่านั้นสำหรับ owner export.** Repair ย้าย child order เฉพาะป้าย
ห้าจุด; measurement tables และทุก run ตรง original canonical XML. อีก124
ZIP payloads คงเดิม. ไม่ใช่ baseline factor ใหม่หรือ Word export cycle เพิ่ม.
Reference สำหรับ child sequence:
[python-docx schema excerpt](https://github.com/python-openxml/python-docx/blob/master/docs/dev/analysis/features/text/paragraph-format.rst#schema-excerpt).

Saved-package checks: `verification/grouped-package.json` PASS4,996 assertions;
`verification/baseline-probe-package-r1.json` PASS300 assertions. Grouping มี
exact raw/canonical XML inverse และอีก124 payload/compressed records ตรง ROW;
ordered text/runs/CS/fonts/fields/images คงเดิม. Probe มี4table pairs: undo
padding/caption/start-marker differences แล้วตรงกัน รวม natural excerpts
ที่ normalize เฉพาะ unique nonvisual drawing IDs; image data/size/order คงเดิม.
มี6unique icon appearances, one section, six logical page blocks/five later
page starts, ไม่มี active header/footer references หรือ unsafe row/keep chain.
Unused source story relationships42รายการยัง valid และคงเดิม; ไม่ตีความว่า
มี active band จาก relationship presence. `cantSplit=off` ไม่ใช่ enabled.
Original verifier reports เก็บไว้พร้อม semantic correction สองข้อนี้.

ยังไม่ตรวจภาพ DOCX ผ่าน Word ใน checkpoint นี้. ต้องรับ PDF ของ full SRS
และ r1 probe ก่อนวัด/ตรวจจริง; ไม่แสดง static checks เป็นผล layout PASS.
Additional locators: `baseline/{generation-r1.json,scripts/repair_probe_order.py}`,
`verification/baseline-probe-package-sequence.json` สำหรับ pre-repair failures
และ `preflight/root-review.json` สำหรับ input/font/Core hashes และ pending criteria.

### V11 owner Word results and acceptance

เจ้าของแปลงทั้งสองชุดผ่าน Word for Microsoft 365 แล้ว. ใช้ full SRS
`outputs/srs-semantic-grouping-v11.pdf`, 99 pages / 1,014,548 bytes, SHA256
`f6bd6bdbcf6227a10c95cae7b9eb9bbc9bd8b8274a285ac24f24d2476aa44f11`
และ final probe `outputs/srs-cell-baseline-probes-v11-r1.pdf`, 6 pages /
85,110 bytes, SHA256
`3b7121b1449d626b37bbab0385661647f75ebd9e0a447c1fb563966fea99d638`.
DOCX ยังตรง hashes ก่อนส่ง Word; ไม่มี candidate repair ระหว่าง verification.

**Grouping: PASS for this bounded structural policy.** Locate target relations
ได้ครบ32/32ตาม source/base/candidate โดยแยกการหา text แบบ lossy ออกจาก
package/visual proof. ทั้ง32มี heading chain, complete short description,
paired table header และ first body line อยู่หน้าเดียวกัน. อีก31จุดตรง V10ROW
geometry เดิม; จุด15.4เปลี่ยนจาก heading44/description44–45/table45 เป็น
ทั้งหัวข้อ คำอธิบาย2บรรทัด และตารางทั้งชุดอยู่45. Core เก็บหน่วยนี้บน44;
ไม่ได้อ้าง physical page parity. Source บางกลุ่มเองแยกหน้าเดิมอยู่แล้ว จึง
บันทึก source relations ไม่ใช้ชื่อหัวข้อเป็นตัวบังคับเลขหน้าหรือผลลัพธ์.

Rendered RGB ทั้ง99หน้าเทียบ V10ROW:95หน้าเหมือนทุก pixel รวม bands;
reuse full-page QA ของ V10ROW เฉพาะ95หน้านี้. เปิด full candidate ใหม่ครบ
4หน้าที่ต่างคือ8/44/45/46 พร้อม source/base counterparts และ32target pairs.
หน้า8เปลี่ยน TOC15.4 printed page44→45 ถูกต้อง;44เหลือพื้นที่ท้ายหลัง15.3
ตามการย้ายหน่วย;45ไม่มี orphan description;46รับ item2ของREQ0004เพิ่มจาก
45 แล้วตามด้วย item3+icon. REQ0004ยัง split45–46เหมือนเดิมแต่ fragment
boundary ต่างหนึ่งบรรทัด ไม่พบ visible clipping/overlap/glyph boxes หรือ
icon-only ending ใหม่. ไม่อ้างว่าเปิด candidate ใหม่ทุก99หน้า.

Functional checks PASS:198/198 TOC links resolve/printed page match และ
source labels corroborate ที่ link/target ผ่าน declared lossy normalization;
coverซ่อนเลข,98 non-cover page fields/banners ถูก policy;371 ordered body
image data/soft masks ตรง frozen WordV3. Requirement headers geometry และ
actual pixels ครบ55pages45–99/76bands. Meeting headers24occurrences คงเลข
source1–10,12–16. REQ0041 text2012codepoints corroborate across50–52ภายใต้
lossy normalization, final text+iconอยู่52;50–53ตรง V10ROW ทุก pixel.
ไม่มี raw Unicode/every-glyph claim หรือเอา unknown anchors มาเรียก content loss.

**Baseline probe: PASS empirical origin-shift calibration; uniform Core parity
NOT ACCEPTED.** ตรวจ6full pages144dpiและ6detail crops288dpi. เปรียบเทียบ
32controlled cases/4table pairs พร้อม native SRS rows: row-border height delta
ทุกคู่0.000pt, text baselines ขึ้น1.20หรือ1.32pt, pitch deltaสูงสุด0.12pt
ภายใน declared export precision. Font identity/face, paired text/CS/emphasis
และ images คงเดิม; Word subset font sizes ที่วัด11.04/12.96pt. ไม่พบ Thai
upper/lower marks clipping, overlap หรือ icon หาย. Native icons ยังคง100×16pt
และขยับขึ้น1.25pt โดย decoded resource ตรงกันทั้งสองชุด.

| Probe stratum | First-line residual after redistribution | Final-line residual | Boundary |
| --- | ---: | ---: | --- |
| 11pt / line397, 18 controlled cases | +0.00199…+0.142005pt | +0.00199…+0.182005pt | เทียบ nominal Core formula; Thai regular3line เป็น worst case ไม่เฉลี่ยซ่อน |
| 13pt / line480, 14 controlled cases | +0.56599…+0.596pt | +0.56599…+0.596pt | controlled style, ยังไม่ตรง Core model; แยกจาก11pt |
| Native REQ0001/0002/0005 Latin R labels | +0.00115 / +0.12115 / +0.12115pt | single line | เทียบ actual Core baseline17.51884pt ที่วัดไว้ |

บาง11pt residualและทุก13pt residualยังเกิน0.12pt; เก็บ individual findings
ใน `nominalAlignmentResidualsOutsideTolerance` ไม่ตีเป็น exact alignment PASS.
Probe พิสูจน์ว่าการกระจาย padding เปลี่ยน origin โดยไม่เปลี่ยนความสูงแถวใน
ชุดนี้ แต่ไม่ได้ระบุ internal Word metric algorithm หรือให้ universal shift.
Core nominal formula อาจต้องขยาย ascent/descent เมื่อ shaped ink เกิน face
metrics; Thai PDF extraction จัด combining marks ใหม่ได้ จึงใช้ paired paint
order และภาพแยกจาก normalization. ไม่อ้าง font subset bytes เท่าต้นฉบับ.

Decision: ใช้ V11 grouping เป็น latest bounded-fix experimental baseline ต่อ
จาก V9/V10ROW ได้ในขอบเขตที่ตรวจ. ยังไม่รับ full document fidelity/product
readiness. Baseline redistribution ยังอยู่เฉพาะ short probe ไม่ใส่ full SRS.
งานถัดไปควรแยก calibration ตาม font size/line style และผล multiline ก่อน
ขยาย; ไม่ลด line397, ไม่บังคับ98หน้า และไม่ปรับ PDF/source/runtime.
หยุดรอบทดลองตาม Proof Budget หลังบันทึกผลจริง; ไม่สร้าง candidate เพิ่ม.

Word locators ใต้ `tuning-v11/`: `grouping/qa/candidate/manifest.json`,
`grouping/word-review/{render-diff,target-relations-inventory}.json`,
`grouping/qa/reviews/{target-and-pages-044-045,root-changed-pages}.json`,
`baseline/word-review/baseline-word-review.json`, `baseline/qa/candidate/`,
`word-review/functional/{functional-review,comparison,header-geometry,header-pixel-corroboration,source-target-observations}.json`
และ `word-review/root-review.json` สำหรับ acceptance coverage/input hashes.
Pre-export reports คงสถานะเดิม ไม่แก้ย้อนหลังให้ดูเหมือนตรวจ Word แล้ว.

## V12 font size and line spacing calibration

Owner request: แยกจูนตำแหน่งข้อความตามขนาดฟอนต์กับระยะบรรทัด โดยคง
ความสูงแถว ใช้ SRS เดิมในพื้นที่ทดลอง แล้วเทียบ PDF อีกครั้ง. ไม่แก้ PDF
ต้นแบบ ข้อมูลต้นฉบับ หรือระบบจริง. ใช้ latest bounded-fix full SRS
`outputs/srs-semantic-grouping-v11.docx` เป็น immutable excerpt source;
ไม่ใส่ redistribution ลง full SRS ก่อนพิสูจน์ short probe.

Authority/owner: bounded explicit request + แผนเดิมนี้; Planning Partner /
Evidence Reviewer / Documentation Synthesizer. Project Control owns this
record; future product writer owner remains Core without product edits here.
Execution/Phase/Checklist IDs N/A for this single-room continuation. Work Size
medium, Risk Tier routine. Model decision: retain current host/session model
for bounded inline discovery/prototype and inherited helper review; no new
registered PLAN/WORK room or model override.

Markdown gate: update this existing canonical plan only; do not create a second
shared plan/report, change maps, or promote prototype findings into runtime truth.
Allowed mutations: this plan, new `tuning-v12/` diagnostics/scripts, and one new
`outputs/srs-font-line-calibration-v12.docx`. Forbidden: source/Core reference,
prior candidates/evidence, production repositories/packages/configuration, DB,
template, global guidance, releases/tags/push/install. Existing experiment is
already isolated; helper discovery and verification do not repair the candidate.

### V12 diagnosis and bounded design

V11 observed only11pt/397 and13pt/480, so font size and line spacing were
confounded. V12 uses a crossed2×2 matrix with all other fixture properties
held constant, followed by paired padding hypotheses for the two measured
strata only. Font size/line changes occur between discovery strata; within
each adjusted A/B pair only top/bottom padding distribution changes.

| Planned page | Font size | Exact line twips | Top/bottom twips | Purpose |
| --- | ---: | ---: | --- | --- |
| 1 | 11pt | 397 | 55/55 | Control; native header+REQ0001 excerpt appended |
| 2 | 11pt | 480 | 55/55 | Crossed line-only control |
| 3 | 13pt | 397 | 55/55 | Crossed size-only control |
| 4 | 13pt | 480 | 55/55 | Control |
| 5 | 11pt | 397 | 28/82 | Pair with1, nominal origin up1.35pt |
| 6 | 13pt | 480 | 19/91 | Pair with4, nominal origin up1.80pt |

Every measured cell keeps total vertical padding110twips and top alignment;
no exact/minimum row-height override, font shrink, line-height reduction,
run baseline/superscript shift, or page-count forcing. Word must still confirm
actual row heights; a constant padding sum alone is not rendered proof.
Crossed11/480 and13/397 controls receive no guessed correction.

Each controlled page contains15cases: Latin/Thai/mixed×four faces as12single
lines, plus explicit3-line Thai regular, mixed italic and mixed boldItalic.
These retain V11's Thai worst final residual and mixed-italic final minimum.
Text comes verbatim from frozen SRS; emphasis/13pt overlays are labelled
controls rather than natural-SRS coverage. Native table174 rows0/1 only
(header+REQ0001) repeat on1/5, preserving sibling cells, source text/run/image
properties and icon size; only nonvisual drawing IDs are made globally unique.
The four-native-row V11 excerpt would exceed the six-page budget, so no new
V12 REQ0002/0005 coverage is claimed. Estimated1/5content614.34pt leaves
75.38pt within689.72pt body; actual fit remains pending Word.

Grounding uses every measured V11 line rather than only a mean.11/397 control
residual range1.272…1.442pt has continuous minimax shift1.357pt; choose27twips
(1.35pt), not an asserted universal correction.13/480 range1.76599…1.796pt
has midpoint1.780995pt; choose36twips(1.80pt). Word export previously moved
a nominal1.25pt by1.20/1.32pt, so predicted ideal residuals are not PASS.
Keep source19.84pt versus DOCX397twips=19.85pt distinct; use traced nominal
Core font/line-box formula and existing actual native baseline where available,
without changing/re-rendering the Core PDF or claiming Word internal metrics.

Proof Budget: one six-page probe/one manual owner Word export, saved-package
verification before export, per-line/per-row paired measurements and all-six-page
visual QA after export. Compare the four controls to distinguish size/line
effects; retain every residual outside0.12pt rather than average it away.
Require no new wrapping/clipping, font/CS/emphasis/image changes, row-border
height delta<=0.12pt (target0), and pitch delta<=0.12pt within each paired
comparison. Actual page count/content presence must match the fixture.
No full-SRS correction is accepted from this short fixture; any later expansion
must select by effective properties/family, include all affected sibling cells,
and recheck SRS pagination/tables against frozen PDF. Never select by document
title, requirement ID, physical page number or a special global paragraph index.

Document Budget: this plan only; machine-readable discovery, builder,
generation, preflight and independent verification live under `tuning-v12/`.
Unknowns: actual Word quantization/pagination and crossed-pair effects are
blocking for calibration acceptance; exact internal Word metric algorithm is
deferred. Product/API implementation remains outside this experiment.

Discovery locator: `tuning-v12/discovery/calibration-design.json`.
Status at planning checkpoint: **prepared design; no V12 Word acceptance**.

### V12 generated probe and pre-export checks

Actual main-story inventory is `tuning-v12/discovery/style-inventory.json`,
matched to frozen source nodes and direct/effective OOXML rather than available
style definitions.200tables/933rows/1,932cells contain2,305paragraphs:
1,566text,371image-only and368empty. Natural text pairs are11/397=1,530,
11/340=9,11/400=18,11/500=2,18/520=3 and9/340=4paragraphs;13/480 is absent
from natural cells. All2,383text runs explicitly specify both sizes and four
Sarabun font slots. Regular/nonitalic is natural in these cells; source style
name `bold` itself specifies normal weight, so probe emphasis remains a control.
This is not proof of Word fallback/shaping or a reason to change source styles.

The gray-border55/55vertical and85/85horizontal margin family spans26tables /
1,167cells:802text-bearing (363also contain images) plus365empty siblings.
A future row-level change must account for siblings, mixed-pair front matter,
image-only `atLeast` paragraphs and available top-padding budget. A successful
font/line pair alone does not authorize every cell/margin family.

Generated `outputs/srs-font-line-calibration-v12.docx`,974,868bytes, SHA256
`e05a31e00b91d2fab56c2e922211420a663d427497aa4b3e33f41c2574abf32b`.
Builder `tuning-v12/scripts/build_probe.py`; generation metadata records all
page cases, nominal model, pair shifts and boundaries. Eight tables comprise
90controlled rows and four native row appearances; total102cells and two
unique source icon appearances. Six pages are planned, not yet confirmed.

Independent saved-package report
`tuning-v12/verification/saved-package-cross-factor.json`: PASS2,129assertions,
zero failures. Actual four-way control XML differs only in declared font size
and line spacing; paired1/5 and4/6 tables invert exactly after restoring margins
and normalizing only declared captions/start flags/nonvisual drawing IDs.
All124other ZIP payloads and compressed bytes match V11; native rows, image
resources/dimensions/order, paragraph/run/CS/emphasis properties and section
geometry are preserved. CT_PPr/CT_RPr ordering passes, including captions;
there are no active band/TOC references, exact row-height overrides or run
baseline shifts. Dormant source story relationships remain valid.

Root preflight is `tuning-v12/preflight/root-review.json`, covering frozen
source/reference/font/Core-trace hashes, final candidate/generation, discovery,
verification, plan scope and local anchors. Project Control validation is
`check:data` plus plan-link/whitespace review; this is prose-only and does not
regenerate projections. Only this existing plan is committed in Project Control.

**Checkpoint: ready for owner Word export; layout acceptance PENDING.**
Save `srs-font-line-calibration-v12.pdf` beside the new DOCX. No TOC update is
needed in this focused fixture. After export, inspect every page and measure
every paired row/line, including native icon placement, before claiming constant
rendered heights or improved Core alignment. No full-SRS redistribution,
reference PDF edit or production change has occurred.

### V12 owner Word results and acceptance

เจ้าของแปลงผ่าน Word for Microsoft365 แล้ว: `outputs/srs-font-line-calibration-v12.pdf`,
6pages /85,349bytes, SHA256
`a4d346ef5bb7fbd98c9fb11f25a621c1829bbd15c40e924a6a769ab0becf38e9`.
DOCX ยังตรง hash ก่อนส่ง; frozen20source/reference/font/Core-trace/candidate
inputs คงเดิม. Verification ไม่แก้ candidate หรือสร้าง full-SRS derivative.

**PASS bounded two-pair origin calibration; not full-SRS acceptance.**
วัด30paired cases/42lines และ native header+REQ0001. Row-border height delta
ทุกคู่0.000pt; paired line-pitch delta สูงสุด0.12pt. ไม่พบ measurement failures
หรือ adjusted-line residual เกิน±0.12pt. ใช้ทุก first/intermediate/final line
และ base-letter PDF text matrices; combining-mark offsets ไม่ถูกเอามาปน
baseline. ในแต่ละ line ทุก base-letter matrix origin ตรงกัน(spread0.000pt).

| Corrected pair | Requested upward shift | Measured text shift | All-line nominal Core residual | Row-height delta |
| --- | ---: | --- | --- | ---: |
| 11pt /397,15cases /21lines | 1.35pt | 1.32หรือ1.44pt | −0.11801…+0.08199pt | 0.000pt |
| 13pt /480,15cases /21lines | 1.80pt | 1.80pt | −0.03401…−0.004pt | 0.000pt |

ค่าคลาดเคลื่อนนี้เทียบ **nominal traced Core formula** สำหรับ controls,
ไม่ใช่ newly rendered Core PDF ทุก style. Native REQ0001 Latin R เทียบ
prior actual Core baseline17.51884pt ได้ error+0.00115pt. Native icon ยังคง
100×16pt, decoded RGBตรง sourcePNG และเลื่อนขึ้น1.35pt โดยกรอบแถวคงเดิม.
Source reference PDF/hash และ Core baseline evidence เดิมใช้ซ้ำแบบ immutable.

**Crossed finding:** ขนาดจริงใน PDF เป็น11.04ptบน1/2/5 และ12.96ptบน3/4/6,
จึงไม่ได้เกิดจาก fixture เผลอใช้ font size เดียว. ที่ exact line เดียวกัน
เปลี่ยน11→13แล้ว actual Word base-letter origin เปลี่ยน0.000ptครบ21samples
ทั้ง397และ480; observed font/line interaction0.000pt. เปลี่ยน397→480แล้ว
first baseline เลื่อน3.24…3.39ptเท่ากันทั้งสองขนาด. Nominal Core target
เพิ่ม0.836ptเมื่อเพิ่มขนาด และ first-line targetเพิ่ม2.08ptเมื่อเพิ่ม line.
จึงต้องแยก actual Word response ออกจากส่วนต่างระหว่างสอง layout models;
V11 diagonal residual ไม่พิสูจน์ว่า font size เป็นเหตุให้ Word origin เปลี่ยน.
ไม่อ้าง internal metric algorithm ของ Word. Crossed11/480และ13/397ยังไม่ได้
จูน/รับรอง: unadjusted residual2.60199…2.632และ0.40599…0.606ptตามลำดับ.

เทียบเฉพาะ matched V11 cases:11pt worst absolute residualลด0.182005→0.11801pt,
แต่4/21individual linesคลาดมากขึ้นเล็กน้อย,15ลด,2เท่าเดิม.13pt matched15lines
ดีขึ้นทั้งหมดและ worstลด0.596→0.034pt. ไม่กล่าวว่าทุกบรรทัดดีขึ้นจากV11;
11pt mixed boldItalic first-line−0.11801ptอยู่ใกล้ขอบ0.12pt ต้องคงข้อจำกัด
เรื่อง export quantization/ตำแหน่งบรรทัด ไม่ยกระดับเป็น universal padding rule.

Functional review PASS432assertions/zero failures:90controlled casesและ126
logical linesตรง source ภายใต้ declared NFKD+whitespace normalization.
Paired encoded glyph/TJ-advance streams และทุก char font/size/advance/X/
linear transform/color ตรงกันโดยยกเว้นYที่เป็นปัจจัยทดลอง. Embedded SFNT
PostScript identities ครบสี่Sarabun facesตรง emphasis; native image source
pixels/ขนาด/ลำดับครบ. ไม่อ้าง raw Unicode/every-glyph equality จาก normalization.

Root เปิดภาพ full-page144dpiครบ6หน้า และ detail288dpiสี่ภาพของ1/4/5/6;
ทุกกรณีอยู่ครบ ไม่เกิด overflow, visible Thai upper/lower-mark clipping,
overlap, glyph boxes, new wrapping หรือ icon-only ending. ตำแหน่งกรอบแถว
ตรงก่อน–หลังและ native text/iconอยู่ด้วยกัน. ภาพเต็มครอบคลุมส่วนที่ detail
crop จงใจตัดออก; ไม่ใช้ crop boundary เป็นข้อสรุปเรื่อง text clipping.

Acceptance coverage/input freeze: `tuning-v12/word-review/root-review.json`
PASS43root checks. Supporting locators:
`word-review/measurements/{word-measurements,measurement-summary}.json`,
`word-review/functional/functional-review.json`, `qa/candidate/manifest.json`
และ `qa/reviews/root-visual-review.json` ภายใต้ `tuning-v12/`.
Pre-export reports คงสถานะเดิมเพื่อรักษาประวัติ. Project Control checks:
`check:data`, local anchors and `git diff --check`; prose-only, no projection change.

Decision: ยอมรับเฉพาะ measured two-pair calibration ใน short fixture นี้.
หยุดตาม Proof Budget หลัง owner export/measurement/visual QA ครบ.
Next recommended work คือ bounded full-SRS trial ของ natural11/397 gray-border
55/55-margin family พร้อม sibling-cell/row guards แล้วตรวจ pagination,
table splits/repeated headers, heading groups และ icons. ยังไม่สร้าง candidate
รอบถัดไป, ไม่จูนทุกfamily, ไม่แก้ PDF/source/runtime และไม่รับ product readiness.

## V13 full SRS eligible-family trial

Owner authorizes one full-SRS experiment before proceeding to later difference
categories: use accepted values only in eligible tables, then compare pagination,
repeated column headers, headings and icons against frozen PDF. Same isolated
experiment, no reference PDF/source/runtime change. Existing V11 full candidate
remains immutable input; V12 two-pair findings are bounded calibration evidence,
not an already accepted full-document policy.

Authority: explicit request + this existing canonical plan. Roles Planning
Partner / Evidence Reviewer / Documentation Synthesizer; Project Control owns
this record, future product writer owner remains Core with no product edits.
Execution/Phase/Checklist IDs N/A in this unregistered single-room continuation.
Work Size medium / Risk Tier routine. Model decision: retain current session
model for inline authoring and inherited read-only discovery/final verification
helpers, no new PLAN/WORK room or model override. Current Truth Snapshot was
rebuilt read-only; unrelated roadmap state does not override this explicit task.

Markdown gate: update this Project Control canonical plan only. Document Budget
one existing plan; machine-readable selection/generation/verification/acceptance
targets under `tuning-v13/`. Allowed mutations: this plan, new `tuning-v13/`
files and one `outputs/srs-cell-origin-v13.docx`. Preserve all prior evidence,
DOCX/PDF outputs and source inputs. Forbidden: Core/reference PDF, resolved
data/assets/template, product repositories/dependencies/configuration/DB,
maps/global guidance/releases/tags/push/install. Experiment isolation already
exists; no new checkout or destructive cleanup.

### V13 scope and acceptance

Source `outputs/srs-semantic-grouping-v11.docx`, SHA256
`39a7de89643f901c40a995364b5e8848af73c19b8152035e9178f9ad10d5e0ff`.
Retain V11 heading/short-description/table grouping and all V9 icon/oversized
paragraph safeguards. Use accepted27twip upward redistribution for natural
Sarabun11pt/exact397 only; no13/480 overlay or guessed crossed-pair correction.

Select by table/row/cell properties, never SRS title, requirement ID, heading
name, paragraph index or physical page. Expected family:26whole tables /
389logical rows /1,167cells, fixed three-column10770twip grid, gray666666
0.5pt borders, top alignment, explicit55/55vertical and85/85horizontal margins.
All sibling cells must satisfy guards; preserve original text/empty/image
paragraph policies, widths, row splitting, header flags and keep properties.
Only `tcMar/top@w:w`55→28 and `tcMar/bottom@w:w`55→82 change; total110twips
and minimum top padding>=20twips remain. Other style/margin families stay intact.
Source paragraph/run/CS/font/line/field/image properties and all non-document
ZIP resources must match baseline exactly after inverse margin restoration.

Proof Budget: one full-SRS candidate/one manual owner Word export; before export
run structural positive/negative selector controls, exact raw/canonical XML
inverse, independent saved-package preservation checks and frozen-input guards.
Static package PASS does not certify rendered row-height/pagination parity.
After Word export compare source-matched rows/line origins and full output:
TOC links/printed page labels, page fields/bands, repeated header continuation,
32heading-description-table relations including15.4, known REQ0004/REQ0041
splits and text/icon endings, plus all371ordered body image identities.

Baseline Word99pages versus Core98 is retained as an observation, not a target.
Recompute header/page coverage from actual continuations; do not hard-code V11
55requirement pages/76bands or24meeting-header occurrences as fixed V13counts.
Inspect every new output page, reusing prior full-page QA only where new raster
comparison proves identical pixels. No averaging away content/relationship
loss, clipping, changed row height, hidden header or icon-only ending.

Unknowns blocking acceptance: full-document row/fragment/pagination response to
padding redistribution and any text-position quantization near the V12.12pt
boundary. Exact Word internal font metrics remain deferred; scope does not
include changing PDF line placement to chase parity. Stop after the declared
single candidate/export review, preserving any regression as a result rather
than silently authoring extra revisions or promoting product readiness.

### V13 generated candidate and owner Word checkpoint

Generated `outputs/srs-cell-origin-v13.docx`,1,084,303bytes, SHA256
`ed65d2e0c551af6e2bdf7af45a7123c4c81caf62bf147b31f06b728264f7e262`.
Only2,334equal-length margin-attribute replacements in `word/document.xml`;
raw inverse restores every source byte and canonical inverse matches as well.
All174unselected tables remain unchanged. Main-story counts remain2,775p /
4,609r /200tables /933rows /1,932cells /371drawings /198hyperlinks /922breaks /
7sections /396bookmarks /199field-instruction nodes. No drawing ID reassignment,
line/font/CS/emphasis/keep/header/field/section/asset change.

Independent source discovery identifies26tables /389rows (26header,363body).
Cell counts are439text only +363text with image +365empty =1,167; image-only
cells0. Paragraph counts are802text +363image only +365empty =1,530. Image
paragraphs retain0.5pt marks and `atLeast320`; all empty siblings retain11/397.
These are separate cell/paragraph counts, not interchangeable layout units.
Selected2,012-codepoint oversized text retains72breaks, `keepNext=false` and
`keepLines=false`; no oversized chain is reintroduced.

Root selector controls PASS19 including renamed-content independence and
one-sibling font/CS-size/line/margin/border/alignment/span/image-spacing mismatch,
enabled non-splitting, row-height, merge and nesting exclusions. Initial test
records remain: unimplemented guard RED; next detached synthetic-table fixture
failed direct-body eligibility. Corrected fixture restores body context and
passes before candidate authoring; final report `verification/selector-controls-r1.json`.

Independent saved-package verification PASS4,955assertions/zero failures:
membership matches source family, all row siblings receive28/82, total110,
raw/canonical XML inverse is exact, and all124other ZIP payloads/compressed
local records remain identical. Ordered text/runs/paragraph/row/section
properties, images, fields, header flags and oversized keep guards are frozen.
This is package acceptance only; actual Word row heights/continuations remain
unverified. No extra candidate or automatic Word conversion was started.

Locators under `tuning-v13/`: `scripts/{select_family,check_selector,build_full_srs}.py`,
`generation.json`, `discovery/{eligible-family-final,acceptance-targets}.json`,
`verification/{selector-controls-r1,saved-package}.json` and
`preflight/root-review.json`. Independent discovery/hash agrees with root
selection; root preflight PASS40checks covers22frozen input/candidate hashes,
calibration/source/candidate freeze and pending
acceptance. Reuse V11 baseline/Core QA only within declared identity/content
boundaries after actual V13 comparison. Pre-export checks for this prose-only
Project Control update: `check:data`, local anchors and `git diff --check`;
no generated projection changes or product/map promotion.

**Ready for one owner Word export; V13 rendered acceptance PENDING.**
Open the new DOCX and save `srs-cell-origin-v13.pdf` in the same output folder;
update the entire TOC if Word asks. Next review uses the prepared32groups,
26requirement-table continuation rules,15meeting tables,198TOC entries,
371images, known long-row/icon endings and all-page QA. Actual page/header
counts are measured from V13, not copied as required numbers from V11.

### V13 owner Word results and candidate decision

เจ้าของส่ง Word for Microsoft365 export แล้ว: `outputs/srs-cell-origin-v13.pdf`,
99pages /1,013,849bytes, SHA256
`a8d4ca5c440fa920106949236703478b312af3224fbdaed3df04a0587d47d3c0`.
Candidate DOCX ยังตรง pre-export hash; frozen22input/candidate paths คงเดิม.
Verification ไม่แก้ DOCX/PDF, source, prior evidence หรือ product files.

**Trial complete; reject V13 uniform cell-origin shift as the replacement for
V11.** โครงสร้างและการแบ่งหน้าคงเดิม แต่ actual Core alignment ของข้อความ
บางส่วนและไอคอนแย่ลง. เก็บ V13 เป็น experiment/evidence; คง
`srs-semantic-grouping-v11.docx` เป็น bounded experimental baseline ซึ่งยัง
ไม่ใช่ product-ready DOCX หรือคำรับรองว่าเหมือน Core ทุกจุด.

Functional review R1 PASS171checks/zero failures:198TOC links resolve พร้อม
printed labels/destinations,98visible page fieldsและ98header bannersตรง policy.
Actual requirement continuation coverage คือ55pages /76header bands; geometry
และ fill/ink pixelsครบ.15source meeting tablesมี24header occurrences พร้อม
เลข1–10,12–16ตาม source; ไม่เติมเลข11ที่ source ไม่มี. Ordered371body images
ตรง V11ทั้ง decoded image/softmask identity; ตำแหน่งแนวตั้งเป็นปัจจัยทดลอง.
All99pages encoded glyph paints/font programs/ToUnicode/sizes/advances/Xและ
linear text stateตรง V11โดยแยกY;6,979relative `TD` operandsตรงกันทั้งหมด.
ไม่ใช้ lossy Thai normalization อ้าง raw Unicode/every-glyph source equality.

Geometry covers363logical body rowsใน26tables:361REQ labelsและ2blank-label
source notes (`ขอเพิ่มสีเขียว`, `มีเรื่องของ template`), ไม่ใช่363REQ IDs.
Wordยัง99pagesเท่า V11 เทียบ Core98;30logical split rowsและ394physical data
fragmentsเหมือนเดิม. All99gray-border arraysตรงภายใน declared0.01pt precision;
333whole Word rowsมีheight delta0.000pt. Feature line-pitch deltaสูงสุด0.12pt.
Height errorต่อ Coreของ305rowsที่wholeทั้งสามไฟล์ยัง−19.8…+0.25ptจาก retained
wrapping/layout differences; ผลนี้ไม่รับรอง Core row-height parity ทั้งเอกสาร.

Grouping PASS32/32heading-description-table relations;31groupsมีgeometry
ตรง V11.16.14ยังอยู่ครบpage67แต่first body lineเลื่อนตามปัจจัยทดลอง;
15.4ยังอยู่ครบpage45. Source correspondence64checksครอบคลุมheader+first
body prefixของ32groupsภายใต้ declared normalization. REQ0004ครบpages45–46
และจบtext+icon46; REQ0041ครบ2,012source codepointsภายใต้ normalization
pages50–52และจบ `dates to tasks*` +icon52ก่อนREQ0042page53. Package-level
exact inverseและ unchanged source text/keep guardsรองรับความครบถ้วนแยกต่างหาก.

### V13 actual Core alignment limits

วัดแต่ละตำแหน่งเทียบ row topของตัวเองจาก actual Core/V11/V13 PDF จึงไม่ใช้
physical page indexหรือ absolute page Yเป็นเป้าเดียวกัน. Strict comparison
เลือก173whole rowsที่ feature textครบและอยู่บรรทัดเดียวเหมือนกันทั้งสามไฟล์;
ไม่ปน changed wrapping/split context. All363first-line comparisonsเก็บเป็น
observationเท่านั้น. Base-letter matricesภายในแต่ละบรรทัดมีspread0.000pt;
แยก combining-mark offsetsออกจากbaseline.

| Actual Core target | Result after V13 shift | Decision boundary |
| --- | --- | --- |
| Latin R labels,361rows | Improved361;360within±0.12pt;new error−0.122841…+0.031159pt | REQ0035page49ยัง−0.122841pt;คง marginal outlier ไม่ขยาย toleranceเงียบๆ |
| Strict same-line feature text,173rows | Improved141,worsened32;81within±0.12pt;new error−1.456341…+0.581159pt | Uniform shiftไม่ทำให้ทุกข้อความใกล้ Coreขึ้น |
| Matched icon tops in strict173rows | Worsened173/173;new error−1.490841…−1.300841pt;0within±0.12pt | เดิม168/173within±0.12pt;การยกทั้งเซลล์ทำให้ไอคอนสูงเกินเป้า |

Native REQ0001แสดงความต่างชัด: Core R baseline17.518841ptจากrow top แต่
mixed feature baseline18.244841pt; Wordทั้งสองroleเดิม18.84→17.52pt.
Rดีขึ้นแต่feature error+0.595159→−0.724841pt. Icon100×16ptเดิมerror−0.030841
กลายเป็น−1.380841pt โดย image identityและtext/icon relationshipยังครบ.
Worst strict feature REQ0064: error−0.136341→−1.456341pt, Corepage54/Word55.
Three-way native288dpi detail reviewยืนยันภาพตำแหน่งต่างนี้; crop boundaries
จงใจตัดเนื้อหาข้างเคียง ไม่ใช่ clipping ของเอกสาร.

สรุปได้ว่า whole-cell margin redistributionย้ายlabel/text/iconพร้อมกัน
ทั้งที่ actual Core target originsต่างกัน. ยังไม่พิสูจน์ internal Word
font-metricหรือshaped-ink cause; ไม่อ้างว่าสาเหตุเป็นWordbug. V12ยังผ่านเฉพาะ
nominal traced-formula/two-pair short-fixture boundตามที่บันทึกไว้เดิม;
V13 actual mixed-text/icon evidenceขัดขวางการขยายเป็นfull-document policy.

### V13 coverage and closure

Rasterized99pages at120dpi. Pages1–44ตรง V11แบบexactRGBจึงใช้prior full-page
QAแบบtransitiveภายในidentity boundary. Changed55pages45–99เปิดตรวจภาพเต็ม
ใหม่ครบ:root45–60/91–99(25pages),functional helper61–75(15),grouping helper
76–90(15). ไม่มีหน้าขาด/ซ้ำในcoverage; ไม่พบnew clipping,overlap,glyph boxes,
missing repeated headers,heading orphanหรือicon-only ending. Visual integrity
PASSนี้ไม่เปลี่ยน actual Core vertical-alignment FAILให้เป็นPASS.

Final root report `tuning-v13/word-review/root-review-r1.json`:63verification
checks PASS/zero failures,99-page coverage complete; status
`TRIAL_COMPLETE_CANDIDATE_REJECTED_ALIGNMENT_REGRESSIONS`, SHA256
`00de4821d27a8877b3282dca05a0cacae77e5516a995661fd930ab2ffb207153`.
Candidate criteriaแยก functional/pagination PASSจาก alignment-regression FAIL.
Supporting evidence under `tuning-v13/`: `word-review/functional/functional-review-r1.json`,
`word-review/functional/text-state-review.json`, `word-review/grouping/{grouping-review,table-start-source-correspondence}.json`,
`word-review/geometry/{geometry-review,actual-core-role-comparison}.json`,
`word-review/render-diff.json`, `qa/candidate/manifest.json`,
`qa/reviews/{root-visual-review,root-core-native-detail}.json`และhelper visual
reports061–075/076–090. Root report binds supporting report and frozen-input hashes.

Retain verifier history: original functional/glyph reports failed a short-probe
assumption that relative text operations were absent; independent text-state
review proves operand identity and freshfunctional R1supersedes that method
limitation. Initial root aggregation compared locator+hash dictionariesกับ
hash-only dictionaries; retained `word-review/root-review.json` records those
two schema-assumption failures, R1 compares explicit SHA256maps and passes.
ไม่มีcandidate repair. Pre-export/pending manifestsคงสถานะประวัติ; finalroot
reportเป็นcoverage/decision aggregation, ไม่เขียนทับ checkpoint เดิม.

Project Control closure checks for this prose-only update: `check:data`, local
anchors and `git diff --check`; no generated projection or map promotion.
Stop after the authorized one candidate/export. Next recommended workคือ
bounded discoveryเพื่อแยกlabel/feature-text/image origin policiesโดยใช้actual
Core renderingก่อนสร้างcandidateถัดไป; ยังไม่เริ่มรอบใหม่หรือไปข้อ3–4.
PDF reference, resolved structure/data/assetsและระบบจริงคงเดิม.

## Shared mapping discovery — SRS tuning paused

Owner request: พักการจูน SRS ตรวจ mapping จากโครงสร้างกลางไป PDF/DOCX
แล้วสรุปสาเหตุและแนวทางที่ใช้ได้หลายเอกสารก่อนทดลองต่อ. This is a new bounded
read-only discovery scope in the same unregistered conversation; it does not
reopen V13 candidate authoring or rewrite its acceptance. Work/Phase/Checklist/
execution IDs N/A. Roles Evidence Reviewer / Planning Partner / Documentation
Synthesizer; Project Control owns this record, future Core writer owns product
implementation. Work Size medium / Risk routine; current session model for
inline inspection, no separate WORK or model override.

The validated Current Truth Snapshot was rebuilt read-only from canonical
sources, digest `e9bacb313ae72de8f57dee468e4723f051a28572561b27b373d00764085e2300`.
Its unrelated frontend roadmap does not replace this explicit request. Markdown
gate: classify this update as Project Control canonical, retain one existing
plan; no new Work/Phase/Evidence record or map promotion. Machine evidence under
`mapping-audit/` prevents promoting nominal calibration or SRS-only assumptions
as general writer semantics; prior rendered reports do not inventory this
cross-path contract, so they are immutable supporting inputs rather than a
substitute for this discovery.

Allowed writes: this plan and new `mapping-audit/{inspect_mapping.py,mapping-review.json}`
inside the existing isolated experiment. No new DOCX/PDF, Word interaction,
renderer execution, source/template/resolved-data modification, PDF reference
edit, product/dependency/configuration/DB change, global guidance, release or
push. Proof Budget: one source/OOXML mapping inspection, saved-package inventory,
source/evidence hashes and22frozen input checks before/after; then documentation
validation. Stop after findings/recommendations; no automatic V14 or new probe.

### Inspected routes and identity

Shared input is frozen `inputs/resolved.json`, schema1/nodeModel18, SHA256
`920976069d27da172193fb253e1c3b313299327a6f7994755fb2b927bfdfa301`.
Inspected PDF implementation is the experiment's installed Core0.4.7 package
under `docx-prototype-9130/node_modules/@flowdoc/core/dist/`, not an assertion
about every current Core checkout. The existing paired-PDF receipt binds that
same resolved hash and98pages; no PDF was generated or newly reviewed here.

PDF route: `createPdfEngine` → `documentFlow` / `measureCellContent` /
`measureText` → concrete font selection + native segmentation/shaping → measured
line/frame/row/page geometry → glyph/image coordinates in PDF writer.

DOCX route: `scripts/generate-srs.mjs` with `tables.mjs` / `bands.mjs` consumes
the same resolved structure, emits Word paragraphs/tables/fields with
`docx@9.13.0`, then Word performs text shaping/wrapping/layout. Current reviewed
V11 is not a direct fresh output of that generator: V2 → V3 indent/language →
V7 CS/emphasis → V8 relationships/separators → V9 oversized keep → V10ROW
padding → V11 description keep. V13 is a rejected derivative of V11. These
postprocessors remain frozen experimental evidence, not the implementation
contract for a reusable writer.

### Confirmed mapping differences

| Topic | PDF interpretation | Current DOCX prototype | General implication |
| --- | --- | --- | --- |
| Line height and baseline | `H=max(requested,A+D)`; baseline `A+(H-A-D)/2`; A/D expand to actual positioned glyph ink | Text uses rounded `lineHeightPt` with `lineRule=exact`; Word chooses baseline | Source height acts as a safe minimum in PDF, but is encoded as fixed spacing in Word; equal numbers do not preserve the same typography policy |
| Font and script | Concrete legacy face or library release/weight/style; missing face/glyph fails explicitly | Four Sarabun faces/all font slots, hardcoded th-TH; rejects other legacy families/library styles; V7 applies forced CS to Thai-containing runs only | Other-font/language support is an unimplemented prototype scope, not evidence of a DOCX limitation; effective style/script policy needs a general mapping |
| Wrapping and normalization | Native break opportunities + shaped ink width + grapheme fallback; CRLF/CR normalize to LF and tabs to display spaces | LF becomes explicit Word breaks; Word owns remaining wrapping, with no equivalent explicit CR/tab normalization in this generator | Keep authored breaks and define normalization; do not bake PDF physical wrapping into reusable content |
| Block images | Independent authored frame contributes exact frame height; contain pixels centered inside frame | Body image becomes inline drawing in its own paragraph with minimum line height and0.5pt paragraph mark; optional source image alignment rejected | Word inline/paragraph metrics are an extra layout budget; image framing needs its own adapter rather than cell-wide compensation |
| Cell geometry | Padding defaults4pt; row height comes from child line/frame stack plus padding; borders drawn0.5pt at resolved coordinates | Initial80twip default agrees, but V10ROW subtracts5twips from both margins in1,830cells; V13 redistributes27twips in1,167cells | Authored padding and renderer overhead have become mixed in experiments; prior compensation must not become the shared style definition |
| Horizontal alignment | Cell alignment uses actual occupied ink width and negative-ink correction; image frame alignment supported | Word paragraph alignment and fixed grid; V3 corrects table indent to0; image align is outside current allowlist | Table origin, cell padding, text alignment and frame alignment are separate concerns; indent fix does not prove universal text-edge parity |
| Grouping and pagination | Measured row fragments, group prefix/first-member capacity and keepStart relaxation | Native tblHeader/cantSplit plus keepNext/keepLines approximations and bounded inferred heading/icon relationships | Same logical relationships need format-specific mapping with oversized relaxation; never a per-REQ or per-title offset rule |
| Sections and bands | Text-runtime measurement and actual first/continuation band footprint per page | One-line/explicit-break estimates, floating band tables, maximum footprint reserved in section margins; A4portrait/continued numbering guard | Wrapped bands, arbitrary numbering and other page geometries are not established by this SRS recipe |
| General model coverage | Types include library fonts, page-break, content/fixed text height, verticalAlign, image.align, TOC scope and formatInstances | Several are explicitly rejected; heightMode checks `auto` although model enum is `content`; formatInstances is not interpreted | Establish a capability matrix and fail on unsupported input; missing mappings are not evidence that the source cannot represent the case |
| Units and generated fields | Point floats and measured coordinates; page/TOC values filled after layout | Integer twips, half-point run size inputs and native Word fields requiring refresh | Quantization and each format's own numbering are expected adaptations; one rounded length differs by at most0.025pt, not an explanation for the1.3pt icon shift |

Source detail: Core A/D can change with actual content even if total line height
does not grow. Therefore font size/line height alone cannot establish one
baseline target for Latin and mixed text. This confirms the PDF-side rule; it
does not establish which internal Word metric causes its observed origins.
Likewise Word's inline object participates in line layout according to
[Microsoft Inline documentation](https://learn.microsoft.com/en-us/dotnet/api/documentformat.openxml.drawing.wordprocessing.inline?view=openxml-3.0.1),
and exact/atLeast spacing and font-slot semantics are documented in
[line spacing](https://learn.microsoft.com/en-us/dotnet/api/documentformat.openxml.wordprocessing.spacingbetweenlines.line?view=openxml-3.0.1)
and [run fonts](https://learn.microsoft.com/en-us/dotnet/api/documentformat.openxml.wordprocessing.runfonts?view=openxml-3.0.1).
These references support the format semantics, not a newly verified fix.

Saved-package corroboration: V11/V13 both2,775paragraphs /4,609runs /
200tables /933rows /1,932cells /371inline body drawings /7sections; no explicit
row-height nodes. Both have1,942paragraphs at exact397twips,195at exact480 and
363image paragraphs at atLeast320. V11 has1,183cells at55/55twips; V13 changes
1,167of them to28/82, leaving16unchanged. The source requirement family has
3pt/3pt padding (=60/60twips), so even V11's55/55 is retained experimental
compensation, not a value to copy back into source or a future general writer.
There are1,420forced-CS main-story run properties and all200table indents are0.
Fixture has no formatInstances/page-break nodes and only Sarabun styles;
absence is not acceptance coverage for those general capabilities.

### Cause boundary and proposed general correction

Confirmed: common structure/data is preserved, but the two paths do not share
final line boxes, baselines or pagination. Prototype mapping changes the
meaning of minimum line spacing and block-image framing, adds inferred Word
grouping, and accumulates spacing compensation. Existing V13 actual-rendered
evidence confirms that translating a whole cell moves already-close images
along with text having different Core targets. This is enough to reject that
abstraction; it is not proof of an internal Word/docx-library defect.

Recommended design direction, **not implemented or rendered-accepted**:

1. Resolve an effective style/capability layer from the existing shared input:
   concrete font face identity/weight/style, normalization, minimum line height,
   block-image frame, authored padding and genuine grouping. PDF behavior stays
   frozen. Derive existing intent where possible; any new language/direction/
   fallback or relationship metadata needs a separately reviewed contract.
2. Map that intent into native Word behavior per element/property, without
   R/REQ/title/page/fixture-index rules or magic offsets per font. Preserve
   source spacing; account for Word border/paragraph/image overhead separately.
   `atLeast` is a candidate for minimum spacing, **not** a proven one-property
   fix for Core baselines. Font-metric reading alone cannot guarantee parity.
3. Before a replacement writer, validate actual Core/Word outputs on a small
   same-input set across more than one supported font and Thai/Latin/mixed text
   with block images. Measure line box, baseline, image frame and row extent
   separately; accept individual failures, not nominal-formula averages.
4. Only after a policy is supported, consolidate accepted mappings into one
   isolated writer with explicit unsupported handling. Use full SRS later as
   regression coverage. Do not chase another SRS-specific correction first.

Still unresolved before implementation: effective minimum-line/baseline policy,
acceptable native Word fidelity difference, concrete font/script disposition
and supported generic feature scope. Exact internal Word metrics, arbitrary
scripts/fonts, wrapped bands and pixel/page parity remain unverified. This
inspection does not diagnose Word conversion performance. V12's bounded
nominal calibration and V13's rejection retain their original evidence meaning.

### Discovery evidence and stopping point

`mapping-audit/mapping-review.json`: status
`DISCOVERY_COMPLETE_IMPLEMENTATION_AND_NEW_RENDERING_NOT_STARTED`, SHA256
`f08f707d7429fdf80809b7bb3ff3eae48d1e47291d2bff8eafa06f7925a1c0b3`.
Ten mapping topics have exact source locators;29source/evidence files are
hash-bound before/after;22prior frozen inputs remain identical. Read-only
inspection covers two saved DOCX packages and the existing same-input PDF
receipt. No new DOCX/PDF, Word interaction, candidate repair or runtime change.
All reported new verification is source/package inspection, not rendered proof.

Acceptance: mapping differences, confirmed causes versus unknowns, reusable
correction direction and unsupported boundaries are recorded for owner review.
Documentation checks: `check:data`, local anchors, scope/diff/whitespace review.
No projection regeneration is needed for this prose-only change. SRS tuning
remains paused; no follow-up experiment starts under this discovery authority.

## Unified DOCX mapping contract and consolidation plan

Owner request: กำหนดกติกา mapping กลางและขอบเขต DOCX ให้ชัด พร้อมแผนรวมเป็น
ตัวแปลงเดียวก่อน; ยังไม่ทดลอง SRS หรือแก้ PDF ต้นแบบ/ระบบจริง. **Status:
DESIGN_AND_PLAN_FOR_REVIEW; no implementation or new rendering.** MUST below
defines the proposed acceptance target, not a claim of present support. This
section governs the next isolated-writer proposal; it does not supersede the
product ownership/API/transport constraints in Stages0–5 or historical evidence.

Authority/Markdown gate: existing Project Control canonical plan only; role
Planning Partner / Documentation Synthesizer, future Core writer owner.
Work/Phase/Checklist/execution IDs N/A for single-room planning. Work Size
medium / Risk routine. Current session model retained for this inline design;
no registered execution or model change. Validated Current Truth Snapshot was
rebuilt read-only with the same canonical digest recorded above. New execution
will choose its model/base/isolation under the workflow policy, not inherit
an earlier PLAN or experimental acceptance.

Document Budget one existing plan. Allowed mutation this turn: this Markdown
only. Proof Budget: reuse the hash-verified mapping audit and22frozen inputs,
design self-review/cross-reference coverage, `check:data`, anchors/scope/diff
checks. No new source/report/candidate, dependency install, Word/PDF execution,
product/configuration/data/DB/map/global-guidance edit, commit outside Project
Control, release or push. Stop with the reviewable design and staged plan.

### Design choice and fidelity contract

Choose a **native Word flow writer from shared semantic input**. Alternative
PDF-coordinate reconstruction would couple DOCX to final PDF pagination and
require position-based text/frame placement. Maintaining Word templates
separately would duplicate structure and styles. These alternatives add final-
layout coupling or duplicated authoring beyond the chosen flow; neither is selected.

Preserve logical content/order, table topology, links, concrete font/style,
authored lengths/alignment, image frames and reading relationships. Word owns
shaping, natural line wrapping, line origins and pagination. Different line/
page breaks are allowed; clipping, missing content, changed image identity,
wrong emphasis, hidden repeated headers, incorrect navigation or arbitrary
font/padding compensation are not. Pixel-identical baselines, exact PDF page
counts and one offset valid for all fonts are not acceptance promises.

Derived values remain output-specific and carry source locators. PDF receives
the original `ResolvedDocument` through its existing route unchanged. A pure
derived export-intent view describes the semantics the DOCX adapter must
preserve; it is not a new authored template, replacement public schema, shared
final coordinate tree, or a prerequisite refactor of the PDF renderer.

```text
existing composition -> ResolvedDocument + verified resource snapshot
                          |-> existing PDF route (unchanged)
                          |-> support preflight -> derived ExportIntent
                              -> one native DOCX writer -> staged DOCX + receipt
```

The future isolated implementation takes one public entry, proposed
`generateDocxTo(document, resources, sink, options)`; all helper modules are
internal. It reads source input and creates a new package directly. It never
reads V2/V3/V7/V8/V9/V10/V11/V13 output files to construct the new document,
patches a serialized old package, or selects behavior by SRS/REQ/title/node
identity/paragraph index/page. Source IDs remain traceability locators only.

### Central mapping rules: docx-native-flow/1

| Rule | Proposed normative behavior | Difference handling / proof |
| --- | --- | --- |
| C1 Input and normalization | Validate the complete reachable body/band graph and selected profile before output. Derive from an immutable snapshot. Normalize CRLF/CR to LF and tabs to single display spaces as the inspected PDF text path does; retain explicit authored breaks and all other characters | Never inject PDF physical line breaks, recompose from an SRS-specific source or mutate the caller. Normalization has before/after source offsets for links |
| C2 Effective style | Resolve actual style properties, not names such as `bold`. Legacy font aliases and library release/weight/style resolve to concrete verified faces/resources. Preserve size, weight and italic in ordinary/CS formatting and generated/inherited Word styles | No forced Sarabun/th-TH default for unrelated input. Source face missing, unresolved or glyph coverage missing is fatal; no silent fallback or font shrinking |
| C3 Script and language | Classify supported Unicode text without cutting grapheme clusters. Use appropriate Word font slots and preserve the same effective face/emphasis across mixed runs. Language tags come from explicit writer context when supplied; otherwise do not invent a document-wide locale. Script selection is not RTL direction | Profile initially targets Thai, Latin and their mixtures, including numbers/punctuation. CS mapping for Thai/mixed text must be proved independently of pure Latin; no unconditional forced-CS rule for every script |
| C4 Lines and fixed frames | Interpret `lineHeightPt` as minimum safe text line height, matching inspected PDF behavior. Default Word text spacing is `atLeast` at the converted value; before/after0 unless another actual source property supplies spacing. Do not encode a target glyph baseline by moving the cell | This selects semantic behavior, not a claim that atLeast solves baseline parity. Empty fixed spacers may use exact authored height. Nonempty fixed text/format frames are outside profile1 until a no-loss fit mapping is accepted |
| C5 Units and grid | Convert scalar point/mm lengths once to nearest integer twip, recording any quantization. For columns, round cumulative boundaries and derive adjacent widths so total equals rounded source total. Keep positive usable widths and separate table origin from cell margins | Scalar position error <=0.025pt; a derived column width may differ <=0.05pt. No5/27twip or font-specific correction. Font sizes must be representable in half-points; otherwise profile1 fails explicitly rather than rounding/shrinking silently |
| C6 Cells and borders | Preserve authored/default4pt padding and logical spans, fills, widths and0.5pt table borders. Keep row heights content-driven. Account for mandatory empty/terminal Word paragraphs and border footprint as adapter structure, without adding source text | Word paragraph overhead is not permission to change padding. No exact row heights or font shrinking to force content to fit. Validate merge/header boundaries before serialization |
| C7 Images | Preserve verified image identity/alpha, authored frame size and left/center/right frame alignment; contain pixels within that frame. Treat block images as independent flow units even if implemented using a native inline drawing paragraph | Map and report the paragraph mark/line footprint separately. Choose one documented block-image wrapper in taskU2; reject its adoption if it needs cell-wide compensation or separates a required tail/image group |
| C8 Reading groups | Preserve rowGroups.keepStart, header counts, row break preferences and explicit/source-derived heading/description/table and same-cell trailing-image relations. Derive relations by structure, never text identity. Default to short keeps; a long paragraph/row may split | Never attach an entire oversized text paragraph to its image or force all rows not to split. A trailing-image relation may bind only a bounded final tail at existing authored boundaries. If no safe mapping exists, return a located unsupported result; do not silently waive the relationship |
| C9 Sections and bands | Derive A4 portrait/landscape, margins, section order, cover/blank roles, band placement/modes and numbering from source. Keep independent adjacent tables separate with explicit structural separation where Word requires it | Wrapped/weighted bands need their own measured acceptance; maximum band footprint reserved by Word is a reported adaptation, not hidden margin drift. Different first/continuation body capacity is an explicit profile limitation |
| C10 Fields and links | Generate bookmarks, internal/external links, scoped/document TOC and native page fields from source relationships. Page numbers refer to the DOCX after Word pagination/field refresh; retain source section numbering/visibility policies | No copied PDF page labels or unverified REFRESH placeholders in accepted output. Numbering modes and refreshed TOC/destinations require actual Word proof |
| C11 Unsupported and findings | Classify every reachable feature as supported, supported-conditionally or unsupported before successful output. Findings contain code, source node/style/section/resource path, reason and required capability | Unsupported content, missing resources, invalid topology, unrepresentable required geometry or uncertified required grouping are fatal. Publish no successful/partial DOCX on fatal; warnings are reserved for quantified allowed adaptations |
| C12 Output and resources | Verify resource hashes/licenses, bounds, package relationships and output SHA256/media type. Use existing runtime floor `node >=24.15.0 <25` and pinned `docx@9.13.0` in isolation. No runtime downloads/installations | Buffer/ZIP memory and cancellation must be measured; a sink API is not evidence of bounded streaming. Stage output and discard/abort on failure; do not expose an incomplete package |

These rules do not introduce authoring-schema language, direction or grouping
fields. Any need for new shared metadata becomes a separate contract proposal;
the implementation cannot silently add it to `ResolvedDocument` or the PDF
path. Normalized offset mappings and layout-only paragraph segmentation must
preserve links/anchors and exact normalized logical text, including empty lines.

### Support profile and refusal boundary

Here **Required** means needed before the isolated writer can be called
profile1-complete. **Conditional** means explicit preconditions plus applicable
tests; it is not blanket support. **Deferred** means a located fatal result if
requested, never dropping it. Every row is **PLANNED / NOT IMPLEMENTED** now.

| Capability | Profile1 target | Boundary |
| --- | --- | --- |
| Shared schema | Required: valid schema1/2 and nodeModel18/19 combinations under Core validation | Complete reachable-graph preflight, not only a fixture inventory; unselected library fonts fail |
| Text/styles | Required: Thai/Latin/mixed, four ordinary emphasis combinations, explicit breaks, content-height text, empty fixed spacers, horizontal alignment | Font faces and glyphs must resolve; no promise of arbitrary script/direction or fractional half-point size |
| Fonts | Required: legacy face aliases and concrete library release/weight/style; at least two resource-distinct families in acceptance | Family names are data, not a hardcoded whitelist. Coverage/license/embedding identity and actual Word face use must pass. Embedding prohibited or not effective requires a separately agreed environment contract; no silent substitution |
| Other scripts | Deferred: RTL/bidirectional layout, CJK layout/locale-specific behavior and other unverified script profiles | Detect and report unsupported script/direction before success. Unsupported is not a claim that Word itself cannot render it |
| Images and rules | Required: block images with contain/alpha/frame alignment, horizontal line node, missing-resource refusal | No full-page raster replacement of native text/tables; supported image resources obey existing preparation policy |
| Tables | Required: logical rows/cells, widths/padding/fills/borders, valid colSpan/rowSpan, repeat header rows, allowBreak, independent adjacent tables | Conditional: native merge continuation and repeated-header interaction must pass Word cases; invalid/cross-header spans rejected. Nested tables are outside the inspected Core cell-content contract |
| Groups and long content | Required: short heading/description/table groups, row-group starts, explicit-break multiline text, oversized rows and trailing text/image endings | Conditional: bounded tail grouping without an oversized keep chain. Per-fragment groupLabel re-emission is deferred; nonempty groupLabel metadata is fatal in profile1 |
| Sections/numbering | Required: A4 portrait/landscape, continued/restarted numbering, hidden numbering, body/cover/blank section roles and explicit page-break nodes | Empty sections/blank pages and numbering resets must be exercised; no filename/page-index recipes |
| Bands | Required: absent/none/all/first/continuation bands, weighted columns and explicit placement, line/image/compact-page-field content | Conditional: automatic wrapping, fixed/min/max sizing and maximum-footprint reservation are supported only within a tested source/Word fit envelope; outside it fails instead of clipping |
| Navigation | Required: anchors/bookmarks, source links/references/URLs, document/scoped TOC and page fields | Scope and refresh must work after actual DOCX pagination; field-update requirement is visible in the receipt, not treated as verification |
| Format sizing | Conditional: auto formatInstances whose semantics can be retained without omission/truncation | Nonempty fixed format budgets and nonempty fixed text frames with verticalAlign are deferred; no silently ignored formatInstances or conversion to auto |
| Engine safety | Required: immutable input/resource snapshot, cancellation, output/placement/node budgets, cleanup, deterministic semantic receipt | Visual Office-version differences and ZIP byte nondeterminism are recorded; no reproducible-package claim without proof |
| External surfaces | Deferred: DOCX import/round-trip, LibreOffice/Google Docs equivalence, Word server automation, UI, production API/storage/queue | Existing `Output-Format` absent→PDF contract remains the future Service requirement; this plan does not implement it |

Required features are incremental task deliverables. Until every applicable
Required row passes, a partially implemented writer is labelled incomplete and
must fail on features beyond its actually verified capabilities. A support
matrix entry cannot become PASS from package generation or a unit test alone
when the row also requires Word-rendered evidence.

### Consolidation structure and interfaces

Future isolated target directory (not created this turn):
`C:\Users\nekot\Documents\Codex\2026-10-21\docx-srs-9130\unified-docx-writer`.
New local files only; existing candidates/source/reference and frozen package
remain immutable. Do not add product-repository files during these tasks.
Checkpoint future isolated sources/receipts by hash. Git integration is not
assumed for this external experiment directory; do not initialize or attach a
repository merely to satisfy a generic commit step. Project Control record
updates retain their own checked-commit requirement.

| Proposed files relative to that target | Responsibility |
| --- | --- |
| `package.json`, local lockfile, `tsconfig.json` | Isolated runner/type checking and exact dependency/resource identities; no product package changes |
| `src/types.ts`, `src/profile.ts` | Internal readonly contracts, capability/refusal classification, source-located findings and immutable snapshot |
| `src/intent.ts`, `src/fonts.ts`, `src/units.ts` | Effective styles/resources, grapheme/script-safe text and logical relationships, normalization offsets and deterministic units |
| `src/text.ts`, `src/images.ts`, `src/tables.ts` | Native paragraphs/image block wrapper/table topology; same normalized intent and no old-package patches |
| `src/sections.ts`, `src/bands.ts`, `src/fields.ts` | Source-driven section geometry, numbering/bands, bookmarks/links/TOC/fields |
| `src/writer.ts`, `src/index.ts` | Single orchestration/serialization entry, staging, cancellation/budgets and receipt |
| `tests/{profile,intent,text-images,tables-groups,sections-fields,writer}.test.ts` | Positive/negative behavior assertions owned by corresponding task |
| `fixtures/`, `evidence/`, `qa/` | Small source-defined cases, frozen receipts and later rendering coverage; no alternate authored Word templates |

Proposed internal names/signatures to keep task boundaries consistent:

```typescript
preflightDocx(document: Readonly<ResolvedDocument>, resources: ResourceSnapshot,
  profile: DocxProfile): Result<Preflight>;
deriveExportIntent(preflight: Preflight): Result<ExportIntent>;
writeDocx(intent: ExportIntent, sink: DocxSink,
  options: WriteOptions): Promise<Result<DocxReceipt>>;
generateDocxTo(document: Readonly<ResolvedDocument>, resources: ResourceSnapshot,
  sink: DocxSink, options: WriteOptions): Promise<Result<DocxReceipt>>;
```

`DocxProfile` identifies `docx-native-flow/1` plus actually enabled capabilities;
`ResourceSnapshot` contains verified immutable font/image bytes and identities,
font licenses and optional explicit language context. `Preflight` binds that
snapshot, the source graph and findings. `ExportIntent` is readonly normalized
flow/style/frame/group data with source/offset locators and resource references,
not copied final PDF geometry. `DocxSink` supports write/abort; `WriteOptions`
contains profile, signal and explicit budgets. `DocxReceipt` contains media type,
bytes/SHA256, input/resource identities, profile/capabilities, quantified
adaptations, field-refresh state and evidence references. `Result` uses Core's
success/failure shape; no new public Core API is introduced in isolation.
Private findings distinguish `DOCX_CAPABILITY_UNSUPPORTED`,
`DOCX_GEOMETRY_UNREPRESENTABLE`, `DOCX_REQUIRED_RELATION_UNSUPPORTED`,
`DOCX_RESOURCE_INVALID`, `DOCX_OUTPUT_BUDGET_EXCEEDED`, `DOCX_CANCELLED` and
`DOCX_SERIALIZATION_FAILED`; reuse existing font identity/glyph failure codes
where they apply. Quantization, native band footprint and pending field refresh
are separate adaptation records, never success aliases for a fatal finding.

### Tasks for a separately authorized isolated implementation

All tasks below are pending. No task, including fixture construction or Word
export, starts from approval to write this plan. Task steps use the earliest
incomplete prerequisite; do not import the old tuning patches as the writer.

**U1 — Profile, resources and normalized intent.** Files: local runner/configuration,
types/profile/intent/fonts/units plus `tests/{profile,intent}.test.ts`. Consumes frozen public model
and verified resource contracts; produces `Preflight`/`ExportIntent` above.

- [x] Establish the isolated package/lockfile with audited local Core0.4.7
  resource identity, `docx@9.13.0`, `tsx@4.23.12`, `typescript@7.0.2` and the
  declared Node floor. The latter two pins reuse inspected Project Control
  tool versions, not a latest-version claim. Define `type-check` as
  `tsc --noEmit` and use the named Node test commands below. Inventory a second
  licensed font family from authorized resources; if unavailable, return a
  located resource prerequisite before U5, without downloading or substituting.
- [x] Add failing cases for both schema variants, legacy/library face identity,
  missing glyph/face/resource, unsupported script/size/fixed content, unknown
  reachable property, CRLF/tab normalization with links, inherited emphasis,
  source mutation during async work and cumulative-grid rounding.
- [x] Implement preflight and derivation; no output side effects on failure.
  Verify every unsupported case has source location and every supported node
  retains normalized logical order/identity. Save a checkpoint after focused checks.

**U2 — Text and block-image contract.** Files: text/images plus
`tests/text-images.test.ts`; consumes U1 intent and produces native paragraphs.

- [x] Add failing Thai/Latin/mixed, regular/bold/italic/boldItalic, available
  concrete faces/sizes, explicit/empty lines, aligned text and frame/alpha image
  cases. Assert C2–C7 without V11/V13 offsets or inherited-style loss. The second
  resource-distinct family branch remains unverified: carry the U1 resource
  prerequisite to U5; this check does not certify multi-family support.
- [x] Implement minimum-line mapping and one image-block wrapper; state its
  structural paragraph footprint/settings in the receipt. Adoption is conditional
  on U5 Word checks; the measured footprint is not yet known. U3 still owns
  required tail/group relationships, with no whole-paragraph keep workaround.
- [x] Run focused semantic/OOXML checks. Later taskU5 must confirm Word line
  origins/image footprint; unit/package PASS is not visual acceptance.

**U3 — Table topology and bounded reading groups.** Files: tables and group
derivation in intent, `tests/tables-groups.test.ts`; consumes U1/U2.

- [x] Add failing spans/header boundaries, adjacent-table separation, empty
  cells, source padding, repeat headers, allowBreak/rowGroups, short heading
  groups and oversized paragraph/row with trailing-image cases.
- [x] Implement source-driven tables and bounded group/tail mapping using
  structural/authored boundaries. Keep text split offsets/anchors stable;
  never bind an entire oversized paragraph to its following image. Refuse
  groupLabel or unsafe mandatory groups, rather than weaken preservation.
- [x] Verify text/image identity, topology and keep-chain bounds, plus renamed
  content/IDs and reordered counterpart cases proving no fixture selector.
  Save a checkpoint after checks; actual split/header/endings await U5.

**U4 — Sections, bands, fields and single writer entry.** Files: sections/bands/
fields/writer/index, `tests/{sections-fields,writer}.test.ts`; consumes U1–U3.

- [x] Add failing portrait/landscape, continued/restarted/hidden numbering,
  cover/blank/page-break, first/continuation/absent bands, scoped TOC/links and
  unsupported fit/format cases. Assert staged output aborts on fatal/cancel,
  resource mutation or budget exhaustion and exposes no successful partial file.
- [x] Implement `generateDocxTo` using the one intent path and public entry;
  account for empty paragraphs/section boundary requirements and field refresh.
  Verify package/resource relationships, receipt hash/media type and no imports
  of prior raw XML patch helpers. Save a checkpoint after focused checks.

**U5 — Small cross-document acceptance before SRS.** Files: small fixtures,
evidence/qa and only repairs in U1–U4 owner modules. Consumes unified writer;
produces coverage results, not a generic support declaration from one sample.

- [x] Freeze three independent source cases: typography with Thai/Latin/mixed
  text/two resource-distinct supported font families/four emphasis states;
  tables with short groups/oversized content/images/header continuation;
  sections with geometry/band modes/numbering/scoped navigation. Reuse structure
  and resources for the existing PDF path and unified DOCX. No SRS/REQ titles.
- [x] When separately authorized, generate new comparison artifacts without
  altering the PDF implementation/reference. Owner Word export remains the
  established review route; no automatic Word conversion or retries. Record
  actual Word/font environment and refresh fields before navigation acceptance.
- [ ] Inspect every output page or prove exact pixel reuse from reviewed input.
  Check source/normalized text, emphasis/faces, image identity/frame, logical
  rows/groups, real repeated headers and long endings. Measure row extent,
  line pitch, base-letter origin and image footprint independently against
  actual paired outputs; no nominal-formula-only or average-only acceptance.
- [ ] Review each capability and all differences. Visible clipping/loss, unsafe
  keeps, wrong emphasis/resources/navigation or padding compensation fails.
  Different wrapping/pages or native baseline positions may remain only as
  disclosed fidelity limitations accepted by the owner; no invented universal
  point tolerance and no silent downgrade of required semantic relationships.

**U6 — Consolidation decision and return checkpoint.** Consumes U5 evidence;
changes only necessary isolated modules and this existing canonical record.

- [ ] Reconcile required/conditional/deferred matrix against actual evidence;
  unfinished rows stay unverified, not PASS. Reuse evidence only for unchanged
  code/resources/environment. Stop if required support cannot be implemented
  safely and return the specific contract/capability issue before extra cycles.
- [ ] Preserve old scripts/candidates as historical evidence; mark their roles,
  do not delete them or use them in the new runtime. Confirm the new entry
  regenerates outputs solely from shared source/resources, with no SRS files
  or output-package dependency and no source/PDF change.
- [ ] Return the concrete isolated result for review. Full-SRS regression needs
  a later explicit request; product Core/Service/consumer integration remains a
  separate future scope under Stages1–5, including PDF regression/default API
  checks. Passing U6 does not start those stages.

Future isolated task commands (after its local runner exists):
`node --import tsx --test tests/profile.test.ts tests/intent.test.ts` for U1;
use the owning named test file(s) for U2–U4, and all six named files before U5.
Expected meaningful failures precede implementation, then the same cases PASS.
The runner/dependencies must resolve from pinned isolated resources; no install
or package/lockfile mutation is authorized this turn. Product commands, exact
checkout/base and integration tests are resolved only in their future scope.
Run isolated `npm run type-check` with each owning task and before U5; passing
transpiled runtime tests does not substitute for interface/type consistency.

### Review focus, acceptance and current handoff

Five failure families have explicit owners above: (1) missing/replaced font or
unsupported script and inherited emphasis — U1/U2; (2) CR/tab/line splitting
that changes text/link offsets — U1/U3/U4; (3) oversized keeps, header loss or
trailing icon orphan — U3/U5; (4) section/band/field refresh changing body flow
or numbering — U4/U5; (5) partial output/resource mutation/cancel or hidden
capacity assumptions — U1/U4. These checks close the design review focus,
not a claim that tests have been written or run.

Self-review maps C1–C3/C5 to U1; C4/C7 to U2; C6/C8 to U3; C9–C12 to U4;
rendered requirements across all rules to U5 and capability/no-patch decision
to U6. Interfaces use the same names throughout. Required/conditional/deferred
is a support target, while actual statuses remain unimplemented/unverified.
The new plan selects a semantic/native-flow boundary, not acceptance of the
unverified atLeast/image wrapper/Word baseline behavior. Prior results remain
historical evidence, with V13 rejection unchanged and SRS tuning still paused.

Current-turn acceptance is the written mapping rules/profile, isolated module
and task plan, refusal/fidelity boundaries and proof coverage for owner review.
Checks are Project Control `check:data`, local anchors and scope/diff/whitespace,
plus unchanged audit/frozen-input verification. No product tests or Word trials
are claimed. Completion of this planning request does not authorize U1–U6;
reviewable design is the return point, with no implementation method dispatched.


## U1 isolated mapping checkpoint — 2026-10-21

### Authority and acceptance boundary

Owner subsequently authorized the first step only: inspect data/fonts/resources
and implement the shared mapping layer in the existing isolated experiment,
then return results before proceeding. This authorization supersedes the earlier
planning-only restriction for U1 only; it does not authorize U2–U6, SRS trials,
PDF reference/runtime changes or product integration. The older planning and
SRS findings above remain historical, not reopened execution.

Active roles: Planning Partner / isolated implementation / Evidence Reviewer /
Documentation Synthesizer. Work Size medium; Risk Tier routine; execution IDs
N/A for this single-room bounded request. Project Control owns this status;
future product writer ownership remains Core. Markdown pre-action gate:
update this existing canonical plan only, preserve historical evidence, create
no product Markdown or new Work/Phase/Checklist/Evidence/map records.

Allowed writes: this plan and
`C:/Users/nekot/Documents/Codex/2026-10-21/docx-srs-9130/unified-docx-writer`.
The latter is an isolated private package, not a product checkout or release.
It has no Git initialization; durable source/resource hashes form its checkpoint.
No separate WORK room/return route is opened. One read-only fresh subagent
review was used as required by the selected inline execution skill.

### Implemented and checked

**PASS within U1's intent-only boundary.** The public isolated entry exports
`preflightDocx`, `deriveExportIntent`, profile and unit helpers. It exposes no
`generateDocxTo` or serializer. A genuine preflight owns defensive copies of
source/resource bytes; intent retains normalized logical text and source offset
mapping, inline/link identity, concrete effective font/style, source document,
section provenance, table grid/padding and resource identities. Caller mutation
cannot alter the captured candidate. No content-dependent baseline correction,
SRS selector, font shrinking or padding compensation was introduced.

The local profile checks schema1/2 and node model18/19 fixtures; authored section
membership, reachable graph/unknown fields, fonts/glyphs, image frames (including
cell width), source geometry and selected unsupported capabilities. It quantizes
minimum line spacing and cumulative column boundaries for later native output.
These are intent decisions, not evidence that Word uses the same line origins.

Pinned isolated dependencies: audited local Core0.4.7 archive, docx9.13.0,
tsx4.23.12, TypeScript7.0.2, @types/node24.10.0 and pngjs7.0.0. The latter is a
bounded addition for actual PNG decoding and CRC verification. Runtime tests and
type checking used Node24.15.0; package engine is >=24.15.0 <25. Dependencies
were installed only in the isolated package with install scripts disabled.

Resources: four Sarabun faces and OFL bytes match frozen copies. All13 prepared
PNG resource variants decode and match manifest byte hashes, dimensions and
byte counts. Resource-only inventory did not map or render the SRS document.
No second licensed family was found in the authorized resource inventory;
this is a located **U5 resource prerequisite**, not permission to substitute or
download a font, and multi-family acceptance remains unverified.

Validation tests were written to fail first. Initial24 cases, five self-review
cases and three fresh-review cases now total **32 PASS / 0 FAIL**. The fresh
review reproduced: a legacy alias pointing to the wrong emphasis face, source
provenance pointing to another existing section, and TrueType resources missing
outline tables. Fixes bind legacy selection to concrete weight/style, require
complete matching authored member provenance, and require static outline tables
with bounded glyph locations. The same regression cases pass after correction.
`npm run type-check` also passes. These checks include no renderer or Word call.

### Contract findings and explicit limits

The pinned Core package has no public `validateResolvedDocument` export. The
isolated runtime therefore uses a strict local supported-profile guard, with
no deep import of the private validator and no PDF render merely to validate.
Source inspection found public resolved-section typings permit `content` and
optional modes, while the inspected pinned runtime validator requires
`authored`/`blank`, explicit header/footer modes, and complete authored member
provenance matching section membership. Positive synthetic fixtures were
corrected accordingly. Private validator bytes match the frozen installed
package. **Full Core-validator equivalence is not established**; the mismatch
must be revisited when choosing the future product boundary. It does not prove
an old SRS output invalid, and no historical SRS artifact was re-evaluated here.

Enabled resource/text scope is intentionally bounded: prepared PNG, standalone
static TrueType with Unicode cmap4/12, and Thai/Latin/Common/Inherited script
text with explicit unsupported-script refusal. JPEG, variable fonts and other
font containers are not implemented. The font parser checks metadata, embedding
flags, Unicode coverage and outline extents; it is not a complete font sanitizer
or proof of actual shaping/embedding in Word. License permission is an explicit
caller-supplied resource contract backed by captured license bytes/hash.

U1 does not prove native paragraph/image/table layout, repeated headers, scoped
field behavior, pagination, line origins, actual font embedding, output budgets
or transactional serialization. Those remain U2–U5 obligations. No DOCX/PDF was
created, no Word automation/export was attempted, and no SRS trial, PDF reference,
production dependency/configuration/data/template or product source was changed.

### Durable checkpoint and return point

Isolated evidence paths under the workspace above:

- `evidence/u1-checkpoint.json` — source/test/package-lock/resource hashes,
  review dispositions, validation boundary and unchanged-input receipt;
  SHA256 `ab1cb77d5d05b5a04094e095c5c26893d6772e0f8cf4d898d824ee3aeb981997`.
- `evidence/u1-example-intent.json` — independent tiny authored fixture intent;
  contains no SRS input and is not an output document.
- `evidence/u1-resource-inventory.json` — four concrete faces and13 decoded PNGs.
- `evidence/u1-red.txt`, `u1-review-red.txt`, `u1-final-review-red.txt` and
  their green receipts — failing-before-fix history; final result is
  `evidence/u1-final-green.txt` (32/32) and `evidence/u1-type-check.txt`.

All22 frozen inputs and29 mapping-audit source/evidence files retain their
recorded hashes; the mapping-audit receipt hash is unchanged. The isolated
checkpoint includes all51 comparisons and a reproducible recording script.
Project Control impact is this plan only: check:data passed; all7 local fragment
links resolve; final diff/scope review and whitespace checks passed. No projection
regeneration is needed because no canonical data record changed. Product tests and full
Project Control system checks are outside this documentation-only impact.

**Return point: U1 finished with disclosed limits; stop before U2.** Next planned
step remains native text/image mapping from this intent, after owner review.
Full SRS regression and production/API integration remain separately authorized
future work; absent `Output-Format` must continue to mean PDF in that future API.


## U2 native text and image checkpoint — 2026-10-21

Owner authorized U2 only using small independent fixtures in the existing
isolated workspace, returning before the next step. U1's stop remains historical;
this request opens no registered execution or production scope. Roles: isolated
implementation / Evidence Reviewer / Documentation Synthesizer; Work Size medium,
Risk routine, execution IDs N/A. Current session inline model, no product lane.
The validated Current Truth Snapshot was rebuilt read-only before implementation;
its unrelated frontend roadmap does not authorize this export experiment.

Markdown gate: Project Control canonical update to this existing plan only.
Allowed code writes remain inside `unified-docx-writer` under the experiment root
recorded above; no product Markdown or new Work/Phase/Checklist/Evidence/map
records. Preserve all historical receipts and the U1 checkpoint unchanged.

**PASS for bounded native component and OOXML checks; visual acceptance pending.**
`src/text.ts` and `src/images.ts` consume genuine immutable U1 intent.
`src/profile.ts` adds private intent-to-snapshot binding and defensive resource
access; public `src/index.ts` still exposes no writer. Only the two existing U1
files `src/profile.ts` and `package.json` changed; U1 source/test/resource/lockfile
hash comparisons otherwise match. The test script now includes the U2 cases.
No dependency/lockfile installation or upgrade was needed.

Text mapping preserves normalized logical text, explicit/empty lines, source
alignment, half-point size, concrete face and ordinary/CS emphasis. Native run
and paragraph-mark formatting is explicit, including false bold/italic against
hostile inherited defaults. Thai segments alone receive forced `w:cs`; Latin
and neutral segments retain the same font slots without unconditional CS.
Explicit language context is retained; no document-wide Thai locale is invented.
Content paragraphs use minimum `atLeast` spacing, before/after0. Empty fixed
spacers use the authored exact height. Navigation/fields are refused with a
source path pending U4 instead of being stripped.

Image wrapper: one native inline-drawing paragraph per block, with the original
PNG bytes/alpha, authored frame quantized once to twips/EMU, centered contained
picture geometry, and source left/center/right frame alignment. It is built
before serialization using public `Run`, `BuilderElement` and `Media.addImage`
APIs; no existing DOCX, serialized XML patch or historical tuning helper is read.
The wrapper has before/after0, a1pt paragraph mark and minimum line equal to the
frame height. These are adapter settings, not measured Word line/descent space.
The receipt exposes frame/picture geometry and `wordFootprintVerified:false`.
It introduces no cell-padding shift, raised image run or keep-chain compensation.
Actual Word interpretation of the separate frame/picture extents and offsets,
and whether the wrapper is acceptable, remain U5 obligations before adoption.

### Evidence and review

- Meaningful U2 RED preceded implementation; full isolated suite now **51/51
  PASS**, comprising32 U1 and19 U2 cases. `npm run type-check` PASS.
- A10-paragraph independent fixture includes four emphasis combinations,
 11/12/13/15pt sizes, Thai/Latin/mixed text, explicit/empty lines, an empty fixed
  spacer and three differently aligned PNG frames. It uses no SRS source graph.
- Its small package probe passes a separate Python/lxml inspection: all XML
  parts parse, exact normalized logical text and10 paragraphs retained, three
  drawings, valid media relationships, original PNG byte hashes retained.
  This is structural verification, not a rendered Word result.
- One fresh read-only reviewer independently ran51 tests and type checking;
  no Important/Critical defect or U2 repair was requested. No deferred minors.
- All22 frozen inputs and29 mapping-audit source/evidence files retain hashes.

Durable paths beneath the isolated workspace:
`fixtures/u2-text-images.json`, `qa/generate-u2-probe.mjs`,
`qa/u2-text-images-unverified.docx`, `tests/text-images.test.ts`,
`evidence/u2-red.txt`, `evidence/u2-green-r1.txt`,
`evidence/u2-independent-package-check.json`, `evidence/u2-probe-receipt.json`,
`evidence/u2-final-review.json` and `evidence/u2-checkpoint.json`.
The checkpoint hashes source/tests/fixture/package files and records limits;
SHA256 `dbba7813cc740100704cf1fd684058cca03cebe369ad131d723d08aaa8a4caaa`.
The DOCX is an internal unverified package probe, not a delivered/accepted writer
output. The test harness's minimal section is not U4 section implementation.

### Decisions, limitations and stopping point

Rulings for this bounded stage: retain the explicitly pinned local docx9.13.0
and isolated hash-checkpoint workflow; do not replace them with generic artifact
runtime/cleanup rules. Keep Word/rendered acceptance in U5 and serialize only
small component probes through the test harness. Wrong calls would require
adapter revision in this workspace; package PASS cannot authorize integration.
No public serializer, font embedding, sink/cancel/output-budget contract or
complete DOCX profile is claimed.

Only licensed Sarabun resources were available. The second resource-distinct
family branch remains a U5 prerequisite; multiple-family acceptance is not PASS.
Native extensions and image-footprint behavior need the later Word check.
U4's consolidated receipt must also report source/converted geometry and allowed
quantization adaptations; U2 currently exposes converted settings and retains
original source lengths in the intent. U3 owns table/group/tail preservation;
U4 owns navigation/sections/resources/serialization, and U5 owns actual layout.
These are deferred stage obligations, not waived requirements.

Project Control impact is this plan only. Scope/diff/whitespace and all7 local
fragment links passed; check:data passed. No canonical data record changed,
so projection regeneration is not needed. No SRS document trial,
Word export, PDF reference/render/implementation edit, product source or package
change, DB/template mutation, release or push occurred.

**Stop after U2.** U3 has not started. Owner review is the return point; do not
advance to full SRS or integration from this component checkpoint.


## U3 table and reading-group checkpoint — 2026-10-21

### Authority and implementation boundary

Owner explicitly authorized U3 only: tables and heading/text/image grouping,
small independent fixtures, existing isolated workspace, return before U4.
Prior U1/U2 checkpoints remain immutable historical inputs; no registered
execution is resumed. Roles: isolated implementation / Evidence Reviewer /
Documentation Synthesizer; Work Size medium / Risk routine / execution IDs N/A.
Current session inline model; one fresh read-only final reviewer under the
selected execution skill. Validated Current Truth Snapshot was rebuilt read-only;
its unrelated frontend roadmap grants no product authority here.

Markdown pre-action gate: update this existing Project Control canonical plan
only; no product Markdown, new Work/Phase/Checklist/Evidence/map records or
projection change. Allowed code writes remain in `unified-docx-writer` beneath
the experiment root above. No Git initialization, dependency/lockfile change,
product source/configuration/data/template/DB mutation, release or push.

**PASS for bounded table/group native components and package structure, with
two declared minor metadata gaps; no rendered/full-profile acceptance.** New
`src/groups.ts` derives a frozen reading plan from the genuine immutable central
intent; `src/tables.ts` builds native tables/body-flow components. `src/text.ts`
adds authored-line fragments, bounded keep settings and source heading outline
levels. The existing public index still exports no complete writer. Only
`src/text.ts` and `package.json` changed among the hashed U2 checkpoint files.

Tables preserve source order/grid and cumulative widths, horizontal spans,
vertical restart/continuation cells without duplicate source text, authored or
default4pt padding, fills,0.5pt borders, header-repeat flags and row allowBreak.
No exact row height, font shrinking or padding compensation is introduced.
Native empty/continuation cells receive a structural1pt paragraph; independent
adjacent tables receive a reported1pt separator paragraph, with no source text
invented. Their actual Word/border/paragraph footprint remains unverified.

### Bounded grouping and refusal rules

Heading recognition uses existing `props.toc.level`, never title text, a style
name, SRS identity or output coordinates. A heading and at most one following
description can keep with a bounded first table row. Source outline metadata
is emitted; bookmarks/links/references/page fields remain located refusals
pending U4. The U3 body-flow harness refuses multiple sections instead of
flattening their semantics; U4 still owns real section serialization.

Same-container text followed by an image creates a bounded tail relation.
Long text remains splittable; only the final tail at an existing normalized
authored LF may become a separate kept paragraph. The removed LF is recorded
as a logical separator, and intersected nonzero inline/link ranges retain
original, source and local positions. Original source text/offsets/anchors stay
in the immutable central intent. No physical PDF breaks or new authoring fields
are injected. A long unbroken tail without a suitable authored boundary fails
with `DOCX_REQUIRED_RELATION_UNSUPPORTED` and source location.

Eligibility uses the concrete face's maximum advance/bounding-box and vertical
metrics, actual font size, source content width and section body height. This
is a restrictive **provisional candidate envelope**, not a universal shaping or
Word-fit theorem: combined kept candidates must fit within the lesser of120pt
and one third of section body height. Row starts allow at most two prefix rows
plus the first member. Fixed spacer heights participate; unsafe required groups
fail rather than force oversized keeps. Any vertical merge intersecting a
required row-start window, including an origin in an earlier row, is refused.
Repeated fragment labels and malformed/overlapping/noncontiguous groups are
refused. Real Word grouping and repeated-header behavior still require U5.

### Verification and final review

- Tests were written RED before implementation; four self-review cases also
  failed before correction. Final suite **71/71 PASS**:51 prior U1/U2 cases
  plus20 U3 cases. Type checking passed.
- Cases cover source padding/fills/borders, empty cells, horizontal/vertical
  merges, invalid/cross-header spans, header/split markup, adjacent tables,
  oversized ungrouped text, safe/unsafe trailing images, authored tail ranges,
  heading/description/table starts and group prefixes. Renamed IDs and reversed
  node-object order produce equivalent behavior without fixture selectors.
- Fresh final review found two Important defects: explicit paragraph false
  overrode row keepStart in fully populated prefix cells; incoming vertical
  merges escaped group-window accounting. Both were reproduced by new failing
  tests, fixed in one correction pass, and the whole71-case suite passed.
  No second review was substituted for regression proof.
- Small independent package probe: three tables,12 physical cells including one
  vertical continuation, two native table separators, heading/description and
  an authored long-text/tail/image case. Separate Python/lxml inspection checks
  every physical cell against source grid/span/padding/fill, logical text/tail
  separator, all relevant prefix paragraphs, header/split flags and original
  PNG bytes/relationships. All XML parts parse. Structural check PASS.
- All22 frozen inputs and29 mapping-audit source/evidence files retain hashes;
  old U1/U2 receipts/probes and resource identities remain unchanged.

Paths beneath the isolated workspace: `src/{groups,tables}.ts`,
`tests/tables-groups.test.ts`, `fixtures/u3-fixtures.ts`,
`fixtures/u3-tables-groups.json`, `qa/generate-u3-probe.mjs`,
`qa/check-u3-package.py`, `qa/u3-tables-groups-unverified.docx`,
`evidence/u3-final-review-red.txt`, `evidence/u3-final-green.txt`,
`evidence/u3-type-check.txt`, `evidence/u3-independent-package-check.json`,
`evidence/u3-probe-receipt.json`, `evidence/u3-final-review.json` and
`evidence/u3-checkpoint.json`. The checkpoint hashes37 files;
SHA256 `6849c7121c60bc4f9d8b1bb1c13a53524ad24cbf664cce5a51788b007c180489`.
The DOCX is an internal unverified package probe, not accepted output.

### Deferred minors and return point

Two reviewer-reproduced **minor** metadata issues are deliberately visible:

1. Table ID `__proto__` is not an own serializable key in the plain-object
   `keptRows` dictionary. Current in-memory construction works, but its JSON
   receipt may omit that special ID. Use a prototype-safe dictionary before
   arbitrary-ID receipt completeness or full profile acceptance is claimed.
2. Zero-width page-field spans are omitted from fragment span descriptors.
   Original intent retains them and U2/U3 refuse field serialization, so no
   current emitted DOCX field-loss claim is made. U4 must define point-boundary
   ownership and preserve descriptors before enabling navigation/fields.

These are deferred obligations, not passing checks. The final review skill's
one correction pass fixes Important findings; minor details are recorded for
owner review. U3's checked task boxes certify only the bounded behavior above,
not zero-width field/anchor serialization or special-ID receipt completeness.
No other minor finding or declined judgment is hidden.

Rulings: retain pinned local dependencies and hash-based external isolation;
keep the conservative grouping envelope provisional; allow U3 source outline
mapping but defer navigation; stop at component/package proof. If these calls
prove unsuitable in Word or another supported resource, revise the adapter
within the future stage instead of compensating source/PDF geometry. No universal
font, page-fit, capacity, actual header-repeat or image-ending claim is made.

Project Control impact is this existing plan only: check:data, all7 local
fragment links, final diff/scope and whitespace checks passed. No canonical
data record changed; projection regeneration is unnecessary. No Word/PDF run,
SRS trial, PDF reference edit, real API/writer/embedding/sink/cancel/budget work
or product integration occurred. **Stop after U3; U4 has not started.**


## U4 unified writer checkpoint — 2026-10-21

### Authority and bounded result

Owner authorized U4 only, explicitly including the two U3 metadata fixes:
headers/footers, TOC, page fields, one writer entry, small independent fixtures,
then return before U5. No SRS/Word/PDF reference or product changes. Prior
checkpoints remain historical; no closed execution context is resumed.

Roles: isolated implementation / Evidence Reviewer / Documentation Synthesizer;
Work Size medium, Risk routine, execution IDs N/A for this single-room scope.
Current session inline model and existing external isolation retained. Validated
Current Truth Snapshot was rebuilt read-only; its unrelated roadmap authorizes
no export/product mutation. One fresh read-only final reviewer was used under
the selected execution skill, with regression-based corrections by the owner.

Markdown gate: this existing Project Control canonical plan only. Code writes
remain beneath the recorded `unified-docx-writer` directory. No Work/Phase/
Checklist/Evidence/map records, product Markdown, installed dependency changes,
Git initialization, release, push or global guidance change. Package lock,
resource/vendor copies and prior receipts remain unchanged.

**PASS for isolated unified writer, semantic tests and package structure only.**
The experimental public `generateDocxTo(document, resources, sink, options)` now
runs the single genuine preflight/immutable intent/native-adapter route. Internal
`writeDocx` is not an additional public index entry. No old candidate DOCX,
serialized XML patch helper, SRS selector or PDF coordinates are runtime inputs.
New modules: `fields.ts`, `font-envelope.ts`, `bands.ts`, `sections.ts`,
`writer.ts`; existing adapters and metadata helpers were updated narrowly.

### Implemented native mapping

- Sections: A4 portrait/landscape dimensions and authored margins, continued/
  restarted/hidden numbering, cover/blank roles, native page breaks, explicit
  empty-section paragraphs and body/table/text/image adapters. Exact landscape
  dimensions are checked, accounting for docx's constructor orientation swap.
- Bands: explicit default/first references for both header and footer in every
  section prevent inheritance from leaking. All/first/continuation/none modes
  map independently. Cover/blank bands are suppressed by source role. Weighted
  columns use borderless native tables with source weights/gaps; explicit page
  placement, image frames and horizontal rules use the same verified resources.
- Navigation: hashed legal bookmark names retain source identity; native external
  hyperlinks and internal references retain labels/style. Document TOC and
  section TOC use native fields, source outline levels and section-range bookmarks.
  TOC styles derive from the selected source style, including ordinary/CS emphasis.
- Page fields: compact band PAGE/NUMPAGES fields remain native. Hidden numbering
  suppresses the complete number block while preserving its reserved layout.
  Leading excluded cover/blank sections restart the first included native page
  label correctly; total uses a nested native NUMPAGES subtraction formula.
- Fonts/resources: full verified TrueType faces are embedded through docx's four
  native face slots. Each package's four obfuscated embedded files were independently
  decoded and matched to original byte hashes. This proves package identity,
  not Word's actual face selection. Missing generated digits, TOC heading text or
  leader glyphs are fatal against their effective concrete style face.
- Metadata: prototype-safe `keptRows` retains special table IDs as own serialized
  keys; zero-width spans have explicit terminal/empty fragment ownership and
  original/local ranges. Both U3 carryovers are now **CLOSED by tests**, without
  rewriting their historical review. Auto-format provenance is retained in the
  receipt; roots must belong in ordered sequence to their owning section.

Native section-boundary/section-scope/empty-cell/table-separator and image-mark
paragraph footprints remain structural adaptations. The four-section probe has
three native section-boundary paragraphs; scoped TOC adds two1pt marker paragraphs
per section. These are recorded evidence, not a promise of identical PDF capacity.

### Staging, limits and receipts

`DocxSink.write` stages privately; `commit(receipt, signal)` is the publication
point and must be atomic and honor cancellation; `abort` discards staged bytes.
The writer validates the candidate and complete ZIP before staging, checks
cancellation at async boundaries, then stages and commits. Failures/cancellation
abort; cleanup failures are explicit issues. Tests show no published partial file
with a conforming sink. A caller-provided sink that violates this contract is not
made safe by the writer. ZIP compression itself is not preempted.

Source/resources and write controls are captured before async work. Caller mutation
cannot replace captured content/font bytes or loosen output budgets. Defaults are
32MiB serialized bytes,50000 expanded XML elements and10000 package drawing
references; callers may lower them. Actual produced XML/relationships/drawings are
inspected before commit. These are package bounds, not paginated Word placement,
streaming or peak-RAM guarantees; complete ZIP creation/inspection remains buffered.

Receipt includes output media type/bytes/SHA256, input/resource identities,
sections/bookmarks/numbering/auto formats and `fieldRefresh:required`,
`wordVerified:false`, `buffered:true`. Unit adaptations report actual cumulative
column widths, derived weighted-band grids and minimum-line rounding, alongside
scalar conversions and maximum band reservations. Scalar rounding is not falsely
reported as the applied width of each cumulative-grid column.

### Verification and correction evidence

**106/106 tests PASS**:71 prior U1–U3 plus35 U4 cases; type checking PASS.
RED cases preceded implementation. Focus includes both metadata fixes, native
section geometry/modes/numbering/navigation, fixed-fit refusals, package/font
relationships, cancellation, source/resource/control mutation, real XML/drawing/
byte budget exhaustion, sink failure and cleanup failure. Auto-format ownership
and actual unit-adaptation records are also covered.

Fresh review reproduced two Important defects: generated page digits escaped font
coverage checks, and fixed empty cover spacers escaped the one-page envelope.
Both now have failing-before-fix regression proof and pass. The same correction
pass also protects generated TOC text, derives field-digit width from source/
restart bounds, counts authored cover heights, refuses intrinsic line/image
frames larger than the reserved body, and refuses a required authored-heading
split that would duplicate/truncate native TOC entries. Exact landscape geometry,
async budget capture and receipt/auto-format consistency have their own RED→GREEN
cases. No deferred minor finding remains from this review.

Three small source-only smoke packages use the same public entry: existing U2
`fixtures/u2-text-images.json`, existing U3 `fixtures/u3-tables-groups.json`, and
new `fixtures/u4-sections-fields.json`. This is U4 integration smoke proof, not
U5 paired PDF/Word acceptance. Independent Python/lxml inspection passes all XML
parts, internal relationships, exact source section dimensions/margins, band-mode
references, native field balance, scoped bookmark destinations, unique drawing
IDs, original PNG identity and four decoded font hashes per package. The new
fixture has four sections, both TOC scopes, links, weighted/header-image/rule
content, first/continuation bands, leading cover exclusion, restart, blank section
and a page break. No precomputed PDF page labels are used.

Durable paths beneath the isolated workspace:
`tests/{sections-fields,writer}.test.ts`, `tests/u4-helpers.ts`,
`fixtures/u4-sections-fields.json`, `qa/generate-u4-probes.mjs`,
`qa/check-u4-packages.py`, `qa/u4-*-unverified.docx`,
`evidence/u4-final-tests.txt`, `evidence/u4-final-type-check.txt`,
`evidence/u4-independent-package-check.json`, `evidence/u4-probes.json`,
`evidence/u4-*-receipt.json`, `evidence/u4-final-review.json` and
`evidence/u4-checkpoint.json`. The checkpoint hashes52 files;
SHA256 `850a74a42325f24695bd4d9708bbc8755af681c09fe6a74dcb6b23bdafb00261`.
All22 frozen inputs and29 mapping-audit source/evidence files retain their hashes;
local resource/vendor copies and lockfile also retain identity.

### Refusal boundaries and return point

U4 does not enable every planned profile row. Explicit located refusals remain:
noncompact/body fixed-width page-field slots; fixed/min/max band fit without
accepted Word proof; wrapped band/cover content outside the provisional concrete-
font envelope; interleaved/multipage exclusions; nonempty fixed text/format budgets;
unsafe required groups and split authored headings; multiple distinct TOC styles;
font weights outside the four native400/700 normal/italic slots or incompatible
releases for one family. These are candidate-profile limits, not claims that
Word itself lacks those features. Leading excluded cover/blank one-page behavior,
source-derived field digit bounds and band footprint estimates remain conditional
on actual Word verification.

Band reservation uses the maximum estimated footprint on every section page and
is disclosed even when first/continuation modes show different content. Word must
still confirm field refresh, actual numbering/TOC destinations, font use, wrapping,
header repeats, table/group/image endings and page capacity. Fonts remain the
licensed Sarabun family only; a second resource-distinct family remains a U5
prerequisite. Full Core-validator equivalence, actual memory capacity and byte-
reproducible packages remain unproven. No claim of generic DOCX readiness follows.

Rulings: retain pinned local dependencies and external hash checkpoints; use a
buffered staged writer with an explicit sink contract; require Word field refresh;
refuse unproved fit/numbering mappings instead of silent loss. If actual Word
behavior differs, repair the DOCX adapter under the next authorized stage rather
than alter source/PDF geometry or waive preservation requirements.

Project Control impact is this existing plan only: check:data, all7 local
fragment links, final diff/scope and whitespace checks passed. No canonical data
record changed, so no projection regeneration is needed. No Word/PDF rendering/export,
SRS trial, real API/default-format/storage/runtime/package change or integration
occurred. Absent `Output-Format` remains the future Service PDF-default requirement.
**Stop after U4; U5 has not started.** Owner review is the return point.


## U5 small paired comparison checkpoint

**2026-10-21 — REVIEWED_WITH_GAPS_NOT_ACCEPTED.** This later owner-authorized
checkpoint supersedes the U4 stop point only for the bounded U5 activity below.
U4 remains package-only historical evidence. Return these findings before any
further repair/experiment or U6. No generic DOCX support declaration follows.

### Scope, resources and repeatability

Single-room execution IDs remain N/A. Governing request: prepare a licensed
second family, run small independent documents from the same source/resources,
and summarize before proceeding. Roles: isolated implementation, Evidence
Reviewer and Documentation Synthesizer; Work Size medium, Risk routine. Allowed:
existing external experiment resources/fixtures/QA/evidence and this canonical
plan. No `src/` writer, package/lockfile, product, source PDF reference, SRS,
API/default-format, DB, system map or DOCUMENT_MAP change occurred. No new Work,
Phase, Checklist or registered Evidence record was created.

Root remains `C:/Users/nekot/Documents/Codex/2026-10-21/docx-srs-9130/`;
all following experimental paths are under `unified-docx-writer/`.

Second family is **Bai Jamjuree**, static Regular/Bold/Italic/BoldItalic,
400/700 normal/italic, from google/fonts commit
`c936464ebf3a837c3f9e4164f81a707bf9231dcb`.
[Upstream license](https://github.com/google/fonts/blob/c936464ebf3a837c3f9e4164f81a707bf9231dcb/ofl/baijamjuree/OFL.txt)
is OFL-1.1 and permits embedding subject to its terms. Unmodified font bytes,
OFL copyright/license and METADATA are preserved in `resources/fonts/BaiJamjuree/`;
URLs/hashes are in `evidence/u5-font-provenance.json`. No global fonts were
installed. All8 concrete faces across Sarabun/Bai Jamjuree pass the local font
parser, embedding flags and the actual Thai/Latin test sample glyph coverage.

Shared source JSON is `u5/sources/{01-typography,02-tables-groups,
03-sections-navigation}.json`; resource identities are `u5/resources.json`.
DOCX uses the existing public `generateDocxTo`; PDF uses the existing public
Core0.4.7 engine in the installed `flowdoc-service:0.4.9` image
`sha256:9d76527509c0bed79350dc823e34d7e5fa1ab7ea4176e95277bb57af5a06b723`,
network disabled and no runtime installation. Only resource adapters differ;
source hashes and concrete font/image/license identities are shared.

The owner manually exported all3 DOCX files in Word. Original exported PDFs
remain alongside `u5/docx/`; hash-identical review copies are in `u5/word-pdf/`.
Core comparison PDFs are separate in `u5/core-pdf/`. PDF producer metadata confirms
Microsoft Word for Microsoft365. Read-only local Office registry reports
O365HomePremRetail, installed16.0.20430.20182 x64; that is an installed-build
observation, not independent attestation of the exact running build. Document and
section TOCs contain refreshed labels and correct actual PDF destinations.

`u5/evidence/paired-run-lock.json` freezes31 source/resource/artifact identities.
Preparation and generators refuse a locked run; inventory/measurement check the
lock before pairing. This binds the observed outputs, not a cryptographic Word
export attestation. No source/output regeneration occurred after the Word exports.

### Actual comparison and limitations

All11 Core pages and11 Word pages were rendered and visually reviewed. Page
counts match: typography2/2, tables3/3, sections6/6. Counts alone are not acceptance.

| Area | Verified observation | Remaining difference or coverage limit |
| --- | --- | --- |
| Fonts/emphasis | Two families, four emphasis states visibly preserved;16 Word typography font subsets match all nontrivial glyph outlines of the8 frozen faces. Times New Roman only supplies whitespace. | This proves the observed subset faces; it is not universal shaping/font coverage. |
| Source text | Every source body text block survives in DOCX XML ignoring whitespace; no visible clipping/loss found on reviewed pages. | Both PDF extractors read source `น้ำ` as `น้า` in the Word export, although enlarged page rendering shows the marks. Word PDF Unicode/search/copy fidelity remains an open issue; DOCX XML preservation does not waive it. Thai extraction order and repeated headers also cause raw whole-block search flags. |
| Body flow | Authored breaks and blank line retained; first regular baseline is4.352pt lower in Word for Sarabun and4.651pt for Bai Jamjuree. | Wrapping differs at14pt. Measured11pt line1-to-line2 pitch is19.84pt Core/19.92pt Word. PDF-reported Word sizes include11.04/14.04pt versus authored/Core11/14pt. No font-name correction factors applied. |
| Tables | All33 logical rows including header present; Code/Description genuinely repeats on all3 pages; Long01–48, END LONG, final row and ending icon survive. | R01 baseline121.565pt Core/126.62pt Word. R01→R02 extent27.84/28.32pt; the0.48pt difference accumulates. First break followsR25 Core/R24 Word. Long-row page3 startsLong30 Core/Long29 Word. Final-row baseline510.685/536.35pt. |
| Required grouping | Heading/description/header and authored long-text tail/icon stay together in these outputs. | Short prefix/member rows12/13 are away from a boundary in both outputs; boundary-sensitive row-group keeping is **UNVERIFIED**. No all-group support claim. |
| Images | All8 actual PDF image occurrences recover identical29×34 RGBA pixels to the original PNG;24pt visible height retained. | Typography page1 visible x is37.764706pt Core/36pt Word despite the source frame; internal centering differs. Actual table-ending image top is464.64/486.70pt. Word image/frame geometry needs a general adapter investigation. |
| Sections/bands | Cover,2 portrait pages,2 landscape pages and intentional blank page; first/continuation visibility correct. | Maximum native section reservation remains when that page suppresses its header. Portrait continuation body baseline51.623736/75.72pt, delta24.096264; landscape first body50.045/76.46pt, delta26.415. This is the U4 disclosed reservation policy now observed, not a PDF defect or accepted fidelity waiver. |
| Numbering/navigation | Excluded cover; labels1,2,7,8; counted hidden blank; total5. Document TOC1/7 and local TOC1; reference reaches physicalpage4; external URI correct. | Native Word TOC adds dotted leaders and different spacing. Footer baselines differ about2.83pt. No promise beyond these refreshed outputs. |

Mapping causes are different mechanisms, not SRS-specific cases: Core uses
measured glyph extents for baseline/line geometry; DOCX delegates its minimum line
and paragraph metrics to Word. Actual native table row extent differs; the contribution from borders versus
other Word paragraph metrics has not been isolated. The two renderers account
for band capacity differently. Original pixels survive but native inline image placement differs.
The exact measured results are the evidence; these explanations do not authorize
PDF changes, arbitrary padding/row-height offsets or per-font compensation.

Preparation also exposed a profile-contract gap: body `textAlign` is accepted by
the isolated DOCX guard but rejected by Core outside cells/bands; row-group source
provenance must carry group identity on every descendant for Core. Current shared
fixtures were corrected consistently for both paths. The guard was not changed;
Core-validator equivalence remains unproven. Longer natural heading/description
and cover samples also hit the conservative no-wrap/group envelope. Short supported
fixtures retain the required relations; they do not erase the refusal limitation.
Preparatory error logs/snapshots are diagnostic history, not accepted paired runs.

### Evidence, checks and return

Durable experimental evidence: `u5/evidence/comparison-results.json`,
`measurements.json`, `pdf-inventory-summary.json`, per-case page inventories,
`word-font-outline-check.json`, `pdf-image-check.json`, `font-check.json`,
`independent-package-check.json`, `docx-probes.json`, `core-probes.json`,
`word-inputs.json`, `review-resolution.json` and `paired-run-lock.json`.
All full-page PNGs/contact sheets are under `u5/rendered/{core,word}/`.
Preparation/generation/independent-review helpers are `qa/*u5*`.

Checks:106/106 existing tests PASS; type-check PASS; all3 independent package
checks PASS with8 original embedded faces each, image identity, relationships,
bookmarks/fields and positive expected-band text/field assertions. Prior U4's52
hashed files remain unchanged. One fresh read-only review identified stale-run
mixing, missing positive band assertions and missing boundary-group coverage;
the first two are closed for the frozen checkpoint and the third remains open.
Regeneration refusal was actually exercised without changing the frozen outputs.
Project Control check:data, local fragment links and diff/whitespace checks pass;
only this existing canonical plan changed, so no projection regeneration is needed.

`u5/evidence/checkpoint.json` hashes109 experimental files;
SHA256 `c7e40969530ed32d36d2607f31f7f9b9292dbe782855303303da0d4630c848b6`.
It records a **reviewed checkpoint with gaps**, not U5 acceptance. U5's acceptance
checkboxes remain open where coverage/resource/search fidelity or owner decisions
are unresolved. U6 and SRS regression remain unstarted.

Return proposal: first reconcile the shared supported-profile guard and exercise
short-group behavior at a boundary, then decide general DOCX mapping repairs for
row/border extent, band reservation and image frame placement. Keep Word PDF
Unicode extraction separate from DOCX source preservation. Do not resume
SRS tuning, modify the reference PDF, integrate the writer or advance U6 as part
of this checkpoint. Absent `Output-Format` remains the future Service PDF-default
requirement; no real API behavior changed.


## H1 header-space feasibility checkpoint

**2026-10-21 — FEASIBILITY_SUPPORTED_SIMPLE_HEADERS_WORD_VERIFIED_NOT_INTEGRATED.**
Owner authorized one isolated header-space probe using a small document, then a
summary before proceeding. This supersedes the preceding stop point only for
this probe. U5 acceptance remains open; U6/SRS/runtime work remains unauthorized.

Scope: single-room discovery experiment, execution IDs N/A, roles Evidence
Reviewer/Documentation Synthesizer, routine risk, one existing canonical record.
Experiment-only scripts and artifacts are under the existing isolated writer
workspace; no writer source/dependency, original source, original reference PDF,
Core/Service/plugin, system map or real API/default-format change was made.

### Question, controlled variables and actual Word export

Can native Word keep the source positive top margin and expand around visible
headers, so hidden-header pages reclaim space without synthetic per-page sections?
Microsoft's [PageMargin documentation](https://learn.microsoft.com/en-us/dotnet/api/documentformat.openxml.wordprocessing.pagemargin?view=openxml-3.0.1)
identifies margins as section properties. Actual dynamic behavior below is
measured in Word, not inferred
from that API documentation alone.

Root: `C:/Users/nekot/Documents/Codex/2026-10-21/docx-srs-9130/unified-docx-writer/header-space-h1/`.
Reuse the exact frozen U5 six-page sections/navigation source and Core PDF,
original DOCX and owner-exported Word PDF. No new source structure or PDF render
implementation. SHA-verified copies are `source.json`, `core-pdf/reference.pdf`
and `control/00-reserved.docx` / `control/00-reserved-word.pdf`.

Two disposable DOCX probes are `docx/01-auto-top.docx` and
`docx/02-auto-top-source-gap.docx`:

- 01 changes exactly the two header-bearing sections' positive `w:pgMar/@top`
  from1168twips/58.4pt to the source720twips/36pt. Header distance36pt stays the
  same. Footer reservation and all other package parts remain unchanged.
- 02 differs from01 only by mapping the source2pt header gap to40twips
  after-spacing on the last paragraph of the two visible header parts.
  No font-dependent compensation, negative margin or section splitting.

`qa/header-space-h1.py` proves the exact allowed XML-attribute differences and
refuses overwriting an existing experiment. These are disposable package edits
for causal isolation, not a new public writer path or raw-patch runtime dependency.
The owner manually exported both candidates to Word PDF and refreshed TOCs;
original exports remain alongside DOCX and identical review copies in `word-pdf/`.
Microsoft365 producer metadata is consistent with the preceding observed setup.

### Measured result and remaining differences

Both candidates retain6 pages. All12 candidate pages were rendered and visually
reviewed;6 Core and6 control Word pages reuse previously reviewed exact PDF bytes.
Actual base-letter baselines, measured downward from page top:

| Page and header mode | Core PDF | Old Word control | 01 auto top | 02 auto top + source gap |
| --- | ---: | ---: | ---: | ---: |
| 3 portrait continuation, header hidden | 51.6235pt | 75.72pt | 54.24pt | 54.24pt |
| 4 landscape first page, header hidden | 50.045pt | 76.46pt | 55.08pt | 55.08pt |
| 5 landscape continuation, header visible | 73.4635pt | 75.74pt | 73.10pt | 75.14pt |

Hidden pages recover21.48pt and21.38pt relative to old Word, with residual
Core differences reduced from24.0965→2.6165pt and26.415→5.035pt. This supports
removing unconditional maximum top reservation for these simple headers. It does
not isolate or eliminate the remaining baseline/structural-paragraph differences.

Visible header baseline53.28pt stays unchanged. No header/body overlap observed.
Actual header-ink to next-text-ink gaps differ from the authored layout gap:
page2 Core10.84pt/control12.36pt/01=9.84pt/02=11.76pt;
page5 Core11.9455pt/control11.42pt/01=8.78pt/02=10.82pt.
Adding2pt source gap changes observed Word placement by about2pt; matching
ink-box distances is not a universal source-gap acceptance rule.

Page2's first TOC baseline is73.639pt Core/76.68pt control/74.16pt 01/76.08pt 02.
The introduction below the native TOCs still differs from Core by23.997pt in01
and26.037pt in02 (control26.517pt). TOC spacing is an existing separate contributor;
this header probe does not isolate that residual's entire cause. Do not label it
as an uncorrected26pt hidden-header reservation or silently compensate the body.

Across all candidate pages, extracted page text equals the Word control ignoring
whitespace; this preserves the prior Word PDF Unicode limitations rather than
fixing them. Header visibility, footer text and geometry, labels1/2/7/8 and total5,
link destination pages and URI, orientations and blank page stay unchanged.
Both actual candidate PDF image occurrences retain the original29×34 RGBA bytes.

### Limits, proof and return point

This proves feasibility for the observed short single-paragraph header with
explicit authored page breaks. It does **not** prove wrapped/multiline headers,
logo/table/rule headers, unequal first/default heights, dense automatic text/table
flow, recovered page capacity, or general writer readiness. Footer reservation,
row extent, image-frame offset, TOC formatting and Word PDF Unicode extraction
remain outside this probe. No follow-on repair or experiment started.

Evidence beneath this root: `evidence/{manifest,package-check,measurements,
comparison-checks,results,final-review,checkpoint}.json`, plus all page PNGs and
contact sheets in `rendered/`. Helpers outside the root are
`qa/header-space-h1.py` and `qa/header-space-h1-review.py`.
Independent review confirms exact attribute containment, unchanged U5 lock31 /
checkpoint109 and U4 checkpoint52, and qualified conclusions. No unexpected
package mutation or frozen-input drift found. Existing106-test results are reused
only as unchanged-writer evidence; they were not rerun or claimed as a new Word
layout test. XML/relationship and actual Word/PDF checks are the pertinent proof.

Checkpoint hashes50 experiment files;
SHA256 `c57ff870979212252a3d9c3b68bd2176b726a957a91307a33b50e068fcb9cb36`.
Project Control impact remains this plan only; check:data, local fragment links
and final diff/whitespace checks pass. No canonical data/projection update needed.

Recommendation returned for owner review: positive source margins plus explicit
source header gap are a viable candidate mapping for this bounded family. A later
authorized adapter change must revise receipt/body-capacity checks as well as
margins, and verify complex headers and automatic flow before broadening support.
Do not choose between probes solely by smallest baseline error or insert per-font
point offsets. Stop here; no SRS, PDF reference change, runtime integration or U6.


## H2 complex headers and automatic-flow checkpoint

**2026-10-21 — FEASIBILITY_SUPPORTED_OBSERVED_COMPLEX_HEADERS_AND_AUTOMATIC_FLOW_NOT_INTEGRATED.**
Owner authorized small isolated multiline/image/table-header and automatic-flow
experiments, followed by a summary before writer integration. This later scope
extends H1's proof only as stated; U5 is not accepted and U6/SRS remain unstarted.
Single-room IDs N/A; roles Evidence Reviewer/Documentation Synthesizer; routine
risk. Allowed: new experiment scripts/artifacts and this existing canonical plan.
No writer source, dependency/lockfile, product, original PDF reference, source SRS,
DB, system/DOCUMENT_MAP or real API/default-format behavior changed.

### Shared source, controls and containment

Root: `C:/Users/nekot/Documents/Codex/2026-10-21/docx-srs-9130/unified-docx-writer/header-space-h2/`.
`sources/complex-auto-flow.json`, SHA256
`204a50cc6a311a2c11ed0f59dbbcff1a2d4b525273e5cdeaf07e4146ac0a10f7`,
contains three authored semantic sections with two inter-section boundaries and
**zero authored body page breaks**:

- Three authored header paragraphs, first-page-only;48 unique M body paragraphs.
- Original PNG in a42pt frame then caption, continuation-only;48 unique I paragraphs.
- Two equal weighted header columns, two paragraphs per column, all-pages; body
  table with41 logical rows including a repeated heading and40 unique T data rows.

The source header gap is6pt throughout. Header source columns become a native
borderless DOCX layout table; this does not establish arbitrary semantic table
nodes in page bands. Multiple authored lines are distinct from width-induced
header wrapping, which remains untested. Body paragraphs fit their line widths;
automatic page flow is exercised without a width-wrapping claim.

`docx/00-reserved-control.docx` comes from the unchanged public experimental
writer. `docx/01-auto-top-source-gap.docx` changes only three positive top margins
to720twips/36pt, and after-spacing to120twips/6pt in the four visible header parts.
All body content, fonts, images, footer settings, styles and native section
structure remain identical. Disposable package edits isolate this mechanism;
they are not a writer implementation or a new runtime dependency.

`core-pdf/reference.pdf` is a new comparison artifact from unchanged public
Core0.4.7 using the same JSON and concrete resources in the existing service0.4.9
image, network disabled and no runtime installation. Original U5/H1 PDF references
remain untouched. The owner manually exported both DOCX files through Word;
Microsoft365 producer metadata is present. Originals remain beside DOCX, with
identical review copies in `word-pdf/`. `evidence/dispatched.json` freezes source,
resource manifest, Core reference and both DOCX hashes before Word review.

### Actual results

All three outputs have6 pages; all18 pages were rendered and visually reviewed.
Each contains all136 body markers exactly once (48M+48I+40T), correct header
visibility and all header lines. PNG RGBA pixels match the original resource in
all outputs. No overlap/clipping observed; candidate header-to-body ink gaps are
positive, minimum14.76pt. Ink-box gaps are not the authored6pt layout gap.

| Observed page | Core body baseline | Old Word control | Candidate | Candidate minus Core |
| --- | ---: | ---: | ---: | ---: |
| 1 multiline header visible | 116.038pt | 120.50pt | 118.82pt | +2.782pt |
| 2 multiline header hidden | 50.518pt | 120.50pt | 54.24pt | +3.722pt |
| 3 image header hidden | 50.518pt | 122.66pt | 54.24pt | +3.722pt |
| 4 image header visible | 118.358pt | 122.66pt | 121.10pt | +2.742pt |
| 5–6 header layout table visible | 128.038pt | 133.94pt | 132.86pt | +4.822pt |

Hidden pages recover66.26pt and68.42pt relative to the old maximum-reservation
control. Automatic paragraph pagination is M01–35/M36–48 in all outputs. Image
section control breaks I01–35/I36–48; candidate becomes I01–38/I39–48, matching
Core. This is actual automatic-flow evidence beyond H1's authored page breaks.

The body table still breaks T01–25/T26–40 in Core versus T01–24/T25–40 in both
Word variants. Its heading genuinely repeats on the second table page in every
output. Actual T01→T02 baseline pitch remains27.84pt Core and28.32pt Word, with
candidate identical to control. Header correction does not resolve this separate
row-extent difference; no row-height/font/padding offsets were applied.

### Limits, evidence and return

Evidence supports the header direction for the observed authored multiline, PNG
and weighted-column families with natural paragraph/table page flow. It does not
certify width-induced header wrapping, arbitrary header tables, unequal first/
default heights, all fonts/orientations/sizes, or exact baseline equivalence.
The residual2.742–4.822pt active-header and3.722pt hidden-header differences remain
real; this probe does not isolate their full cause. Existing image-frame placement,
Word PDF Unicode extraction and bounded group acceptance are not repaired here.

Durable evidence: `evidence/{manifest,control-receipt,core-probes,package-check,
dispatched,measurements,acceptance-checks,results,final-review,checkpoint}.json`;
all page PNGs/contact sheets in `rendered/`. Helpers in the parent workspace:
`qa/header-space-h2-{prepare.mjs,core.mjs,variant.py,review.py}`.
Package checks parse41 XML parts per candidate/control, validate internal resource
relationships, three sections, zero authored page breaks and41 body table rows.
One fresh independent review rechecked exact attribute containment, actual PDF
markers/header columns/visibility/positive gaps/image pixels, and prior frozen
U4(52), U5(109), H1(50), paired lock(31) hashes. No blocking finding for the
qualified feasibility conclusion; no additional experiment or repair started.
Existing106 tests remain unchanged-writer evidence, not a newly run layout test.

Checkpoint hashes55 experiment/helper files;
SHA256 `42c3847b5ed76237e458fe39b867aa26262e1ab15dae61e8233306bf6976b96d`.
Project Control check:data, local fragment links and final diff/whitespace checks
pass; only this canonical plan changed, so no data/projection update is needed.

Return recommendation: evidence now supports considering a bounded isolated
adapter change for the observed profile, including source gap, receipts and body-
capacity/validation policy together. Broader cases must stay conditional or be
refused until verified. Do not promote this package probe to generic support,
change source/PDF geometry, tune document/font-specific offsets or integrate it
without the next owner-authorized scope. Stop here before writer/SRS/product/U6.


## H3 bounded isolated writer integration checkpoint

**2026-10-21 — PASS_ISOLATED_BOUNDED_HEADER_MAPPING_AND_WORD_REGRESSION.**
Owner authorized integrating the observed header-space mapping in the experimental
writer, revising capacity checks/receipts and repeating small Word documents,
then returning before further scope. This does not accept all of U5 or authorize
SRS, U6, PDF reference or product integration. Execution IDs N/A; one-room isolated
implementation/Evidence Reviewer/Documentation Synthesizer, medium size/routine
risk. Only the new isolated copy and this existing canonical plan changed.

### Isolation and selected mapping

New sibling workspace:
`C:/Users/nekot/Documents/Codex/2026-10-21/docx-srs-9130/unified-docx-writer-h3/`.
The original `unified-docx-writer/` and its frozen U4(52), U5(109), H1(50), H2(55)
files retain all hashes. Source/tests/fixtures/fonts/vendor/configuration were
copied before editing. `node_modules` is a junction to unchanged pinned parent
dependencies, with no install/update. Dependency lock and all resource bytes stay
identical; package.json changes only the local test command to include H3 tests.
No product repository, DB, source template/PDF, real API/default format, release,
system map or DOCUMENT_MAP change occurred.

`src/header-space.ts` selects a structural envelope, without document titles or
font-name offsets:1–3 plain authored text paragraphs; one PNG frame no greater
than42pt followed by caption; or two equal weighted columns with two plain text
paragraphs each. Existing concrete-font/no-wrap/fit validation still runs. Fields,
links, embedded authored LF/CR/tab, fixed text, rules, explicit placement and
other graphs do not enter the new policy. Unselected otherwise-supported shapes
retain maximum reservation with a located fallback reason; existing unsafe-fit
refusals remain. This is a bounded structural policy, not a full font/geometry
acceptance matrix or permission to silently drop unsupported relationships.

For selected headers, `src/sections.ts` keeps the source positive top margin and
native header distance. `src/bands.ts` maps the source gap into the final header
paragraph's after-spacing, including the terminal structural paragraph of the
native layout table. Small internal after-spacing options in `src/text.ts` and
`src/tables.ts` default to0 for existing consumers. No output-package patch is
used by the generator. Footer construction, source gap and maximum reservation
remain unchanged.

### Capacity and receipt contract

Serialization and conservative checks are now distinguished:

- `nativeMarginTwips` records the margins actually serialized. The existing
  `reservedMarginTwips` field remains an alias for these native margin values.
- `estimatedMaximumMarginTwips` records the conservative source/band envelope.
  `capacityByPageType.first/continuation` records estimated top/bottom/body height
  and header visibility. Visible selected headers use the conservative band
  envelope for checking; hidden pages use source top. Unselected headers retain
  the same maximum estimate on both page types.
- `bodyHeightPt` is the minimum of both estimates, explicitly identified by
  `bodyHeightBasis: minimum-estimated-page-type`. Intrinsic line/fixed-spacer/
  image checks use that minimum; restoring a smaller native top does not bypass
  the guard. Maximum estimated reservation growth still cannot exceed40% of
  original body height. No speculative extra capacity is accepted.
- Per-band `spacePolicy` distinguishes native-visible-header, maximum-reservation
  and none, with source gap/shape/fallback reason. Whole-section
  `maximumBandReservation:false` signals selected dynamic header policy; footer
  still explicitly reports its own maximum-reservation policy. Writer adaptations
  disclose dynamic selection and legacy fallback. Estimates remain marked as
  estimates; receipt `wordVerified:false` and native-footprint verification flags
  remain false. Actual Word review is separate evidence, not a global receipt claim.

A regression also fixes the new capacity visibility flag when source mode is all
but no header band exists: it reports false. This receipt-only fix was made after
dispatch; fresh final-code generation into memory confirms H1/H2 persisted section
and adaptation receipts exactly match dispatched receipts. User outputs were not
replaced or sent for an unnecessary second conversion.

### Tests and actual Word regression

TDD evidence: initial H3 focused run had4 intended failures/1 retained guard pass;
then the missing-band receipt regression was observed failing before its fix.
Final **112/112 tests PASS**, type-check PASS. Existing106 regression cases remain
passing. Tests cover positive native margins/source gaps for H1/H2, per-page
conservative capacities, unverified-shape fallback, unsafe spacer abort/no publish,
unchanged footer policy and absence visibility. A fresh static review found no
blocker and rechecked the receipt-only fix; it did not claim to rerun Word/tests.

`qa/generate-h3.mjs` uses only public `generateDocxTo` and the copied shared sources/
resources to create `outputs/01-h1-integrated.docx` and `02-h2-integrated.docx`.
H1/H2 source SHA256 values remain respectively
`e80f81677bf224af8bc885ca9cf0c92456a2734fbbced8798dfffc7db4aa1b42` and
`204a50cc6a311a2c11ed0f59dbbcff1a2d4b525273e5cdeaf07e4146ac0a10f7`.
Original Core comparison PDFs are reused by their unchanged identities.

The owner manually exported both new DOCX files in Word, refreshing H1 TOCs.
Both new PDFs have6 pages. Every one of12 new full-page RGB rasters is exactly
identical at90dpi to the corresponding already-reviewed H1/H2 candidate raster.
Actual PDF character text, matrices, font sizes and boxes also match exactly;
link destination pages and external URI match. Thus review reuses exact pixel
coverage from the previously reviewed bounded probes, rather than asserting a fresh broader
visual acceptance. Source DOCX hashes remain identical to dispatch.

Package checks parse49/41 XML parts, check relationships/margins/conservative
receipts, and compare full document/header XML to the Word-tested probes. Only
balanced generated bookmark/TOC/drawing counters and external relationship IDs
with the same URI are normalized for that comparison. No layout/content mismatch
is hidden by package-date/font-key differences.

### Durable evidence, limitations and stop

Evidence under the H3 workspace: `evidence/{baseline,scope-check,dispatched,
independent-package-check,word-review,word-geometry-check,word-navigation-check,
final-receipt-consistency,final-review,results,checkpoint}.json`, red/final test
logs, type-check log, `implementation.diff`, per-document writer receipts and
full-page/contact PNGs in `evidence/rendered/`. Checkpoint hashes91 files;
SHA256 `8e3bdf7b6cc4e4b65ece00ed8822fd2405123aae3fe849229b47cb0cf9488148`.
Project Control check:data, local fragments and final diff/whitespace checks pass;
no canonical data record or projection changed.

H1/H2 measured differences are retained exactly, including H2's one-row table
break difference and residual baseline offsets. Header width-induced wrapping,
arbitrary semantic header tables, unequal first/default heights, broader font/
geometry coverage, Word PDF Unicode, image-frame placement and required-group
boundary proof remain outside acceptance. No row-height/padding/font compensation
was added. Stop at this bounded writer checkpoint; no further trial, SRS, product
installation/integration or U6 work is included.

## R1 isolated row-height cause discovery checkpoint

**2026-10-21 — PASS_BOUNDED_CAUSE_DISCOVERY_NO_WRITER_CHANGE.**
Owner authorized isolating horizontal borders and paragraph spacing in small
documents, then reporting before modifying the writer. Execution IDs N/A;
single-room discovery/Evidence Reviewer/Documentation Synthesizer, medium size,
routine risk. Canonical status belongs here; experimental evidence stays under
`C:/Users/nekot/Documents/Codex/2026-10-21/docx-srs-9130/unified-docx-writer-h3/row-height-r1/`.
No new Work/Phase/Checklist/Evidence registry or map record is created.

### Controlled experiment and actual Word evidence

One shared source `sources/panels.json` contains five sections, each with12 rows
and two columns. Text, regular Sarabun11pt, source line-height19.84pt,4pt cell
padding, widths and vertical borders remain fixed. There are no merged cells,
headers, fields, images or forced row heights. Public unchanged writer generation
produces `outputs/00-unmodified-control.docx`; a diagnostic copy
`outputs/row-height-r1-factors.docx` changes only the listed attributes in
`word/document.xml`. Reverting those attributes reproduces control XML exactly;
all other ZIP parts are identical. This package intervention is discovery, not
an implemented writer policy or a fidelity candidate.

Core0.4.7 generates a new five-page `outputs/core-reference.pdf` from the unchanged
source/resources in the existing network-disabled Docker image. All five Core
panels intentionally retain baseline semantics: their labels name DOCX factors,
not changes to Core. No existing PDF reference or PDF implementation is modified.
The owner exported `row-height-r1-factors.pdf` in Word. Source, control, candidate
and Core PDF hashes still match their pre-export dispatch identities.

All five Word and five Core pages were rendered at120dpi and visually reviewed;
the Exact-line page was also inspected at full render size. All12 row markers
per page are present in order, with no visible overlap or clipped text in this
probe. Measurements use actual PDF character baselines, all11 row-to-row
intervals and separately extracted horizontal border geometry.

| DOCX-only factor | Word pitch range, pt | Mean pitch, pt | Change from Word baseline, pt |
| --- | --- | --- | --- |
| Baseline: horizontal borders0.5pt, atLeast19.85pt, after0 |28.32–28.46|28.35727|0|
| Horizontal borders nil; vertical borders retained |27.84–27.96|27.85545|−0.50182|
| Horizontal borders1pt; vertical borders unchanged |28.80–28.94|28.85909|+0.50182|
| Exact19.85pt instead of atLeast; all else unchanged |28.32–28.46|28.35727|0|
| Paragraph after1pt instead of0; all else unchanged |29.28–29.42|29.36091|+1.00364|

Core baseline pitch is27.84pt at every interval, consistent with19.84+4+4.
Baseline Word–Core mean difference is0.51727pt; no-horizontal-border residual is
0.01545pt. The earlier0.48pt description is not an exact universal per-row delta.
Actual Word horizontal border thickness measures0.48pt for nominal0.5pt and
0.96pt for nominal1pt; interval variation remains visible in the evidence.
First-to-last baseline spans are311.93pt baseline,306.41pt no-horizontal-border,
317.45pt thick-border,311.93pt Exact and322.97pt after-spacing; these are11
interval spans, not complete outer table heights.

### Cause, limits and next decision

Horizontal-border accounting is the dominant observed contributor for this
fixture: removing borders reduces mean pitch by about0.502pt and doubling them
adds the same amount. Read-only inspection of installed Core
`dist/layout/cellTableFlow.js:79–84` shows row geometry sums measured content and
padding without a border term; its painting path emits edges separately. Native
Word table borders therefore do not share the same effective row-box behavior.
This is a mapping mismatch supported by controlled intervention, not a claim
that Word is defective or a reason to alter PDF geometry.

Exact line spacing leaves row pitch unchanged and shifts the first text baseline
up1.44pt; it is not a row-height fix. Existing paragraph after-spacing is already0;
adding1pt predictably adds about1pt per row. Removing required borders, shrinking
font/padding, forcing row heights or adding font/document-specific offsets is
not accepted as a correction. A future mapping design should explicitly define
the content/padding/border box contract and preserve visible border semantics,
then prove any DOCX adaptation independently before integration.

Only regular Sarabun11pt, single-line unmerged tables are measured here. Other
fonts/languages, multiline content, merged cells, repeated headers and pagination
are not newly accepted. The small periodic interval variation/residual is not
causally isolated; do not attribute it conclusively to rounding or extrapolate a
fixed0.48pt deduction. Broader support requires structural tests, not SRS patches.

### Evidence coverage and preservation

Evidence: `evidence/{manifest,package-check,dispatched,measurements,results,
final-review,checkpoint}.json`; `rendered/{core,word}/` full-page/contact PNGs;
source and all three dispatched output artifacts; scripts
`qa/row-height-r1-{prepare,core}.mjs` and
`qa/row-height-r1-{variant,review,finalize}.py` in the H3 workspace.
Package purity, all55 Word intervals, all55 Core intervals,10-page visual review,
actual border drawing geometry and an independent read-only review cover the
bounded discovery criteria. Independent review re-extracted baselines and
verified factor reversal plus all91 H3 and four dispatched hashes; no blocker
or important finding. Original stage status labels remain immutable history;
the final result/review record carries this checkpoint's completion.

All91 H3 checkpoint files and original U4(52), U5(109), H1(50), H2(55) files
retain their hashes. H3's112/112 tests/type-check are reused only as historical
proof for byte-identical writer inputs, not reported as a new test execution.
Project Control check:data, seven local fragments and final diff/whitespace
checks pass. No data/projection, writer source, dependency, SRS, PDF reference,
product runtime/API/default format, release or system map changed. U5 full
acceptance remains open. Stop here before writer changes or further trials.

## R2 isolated border-area mapping probe checkpoint

**2026-10-21 — PASS_BOUNDED_ROW_EXTENT_PROBE_WITH_LIMITS; NO_WRITER_CHANGE.**
Owner authorized preserving original borders while trying a border-area mapping
on multiline tables and another font family, then reporting before converter
changes. Scope is disposable discovery in the existing isolated H3 workspace;
Core owns eventual document mapping, Project Control owns this shared status.
Role: Evidence Reviewer / Documentation Synthesizer. Medium size, routine risk;
execution/Phase/Checklist IDs N/A for single-room work. Proof budget: one six-page
paired Word export, corresponding unchanged Core source, package purity,
all-page visual/geometry review and one bounded independent review. Document
budget: this existing plan plus machine-readable local evidence; no new registry
or map. No production implementation or further SRS trial is authorized.

### Hypothesis and factor boundary

Workspace: `C:/Users/nekot/Documents/Codex/2026-10-21/docx-srs-9130/unified-docx-writer-h3/border-space-r2/`.
The proposed interpretation measures source vertical padding from the border
centre; Word's native inner margin is provisionally mapped as source padding
minus half of that horizontal stroke. For nominal0.5pt borders and source4pt,
native top/bottom margins become3.75pt (80→75twips). This derives from declared
border width, not an empirical0.48pt/font/document offset. The source remains
4pt; this is an unaccepted box-model hypothesis whose effective geometry must
be measured. It does not overturn R1's rejection of arbitrary padding reduction.

`qa/border-space-r2-prepare.mjs` uses unchanged public `generateDocxTo` to build
the control. Six sections pair tables A(original) and B(mapped), each with three
rows. Sarabun and Bai Jamjuree regular11pt each cover single-line, authored
three-line and natural-wrap mixed Thai/English text. Both families reuse the
already approved hashed font/OFL resources; no install or font substitution is
introduced by the probe. Columns70/280pt, line-height19.84pt, source padding4pt,
and every border/style/text relationship remain fixed.

`qa/border-space-r2-variant.py` changes only top/bottom `tcMar` values in B tables;
reversing exactly those values restores the original document XML. All other ZIP
parts and all border XML are unchanged; no forced row height or Exact-line rule.
The diagnostic mapper refuses negative margins or a half-stroke that cannot be
represented exactly in twips. Mixed/merged edges and broader border sizes are
not tested or accepted. No reusable writer source is edited.

### Actual Word and Core comparison

Unchanged Core0.4.7 in the existing offline Docker image generates a new six-page
`outputs/core-reference.pdf` from the same source/font identities. Core retains
original geometry in both A/B tables; B's label describes the DOCX intervention,
not a Core source change. The owner exported `outputs/border-space-r2-pairs.pdf`;
metadata identifies Microsoft Word for Microsoft365. Both PDFs have six pages.
All12 pages were rendered110dpi and visually inspected, with Word's final page
also inspected at full render size. All36 row markers per PDF remain present;
no visible overlap or clipped content was found in this probe.

Mean row-to-row ASCII marker baseline pitch, pt; both font families yield these
same displayed values (two measured intervals per table):

| Case | Core | Word A | Word B | A−Core | B−Core |
| --- | --- | --- | --- | --- | --- |
| Single line |27.840|28.320|27.840|+0.480|0.000|
| Authored three lines |67.520|68.040|67.570|+0.520|+0.050|
| Natural wrapping, four lines |87.360|87.915|87.370|+0.555|+0.010|

Separately measured border-centre row heights retain residual variation:
mapped single-line27.84/27.84/27.87pt, authored67.56/67.56/67.58pt and
natural87.50/87.36/87.39pt, compared with Core27.84/67.52/87.36pt respectively.
Thus the near-zero mean pitch is not proof of exact equality for every row or
outer table extent. The largest measured mapped row-height residual is0.14pt.

Word A/B right-cell line strings match for all18 row pairs: the intervention
does not change wrapping in this sample. Core and Word retain three authored
lines and four natural lines. Sarabun natural-wrap word boundaries visibly
differ: Core puts English at the start of line3; Word keeps it at the end of
line2. Bai Jamjuree's visible line boundaries appear the same in this probe;
raw inequality does not establish a wrap mismatch. Extracted Thai strings contain
shaping/Unicode artifacts, so raw cross-PDF equality is not a wrap/content oracle.
Package text invariance and visual evidence are retained separately.

Text origin is still different: the mapped ASCII row-marker baseline remains
below Core by per-table means of2.72–2.76pt for Sarabun and2.96–3.00pt for
Bai Jamjuree, measured from each top border centre; individual rows reach
2.84/3.08pt respectively. Improved row extent does not accept vertical text
alignment. No per-font correction is inferred, and no font-metric cause is
claimed proven. Automatic pagination, merged cells, repeated headers, mixed
borders and small-padding behavior are outside this six-panel experiment.

### Evidence and stopping point

Local `evidence/{package-check,control-receipt,core-probes,dispatched,pdf-geometry,
measurements,final-review,results,checkpoint}.json`, source `sources/panels.json`,
control/candidate DOCX, Core/Word PDFs and `rendered/{core,word}/` retain the
probe. Reproduction scripts are H3 `qa/border-space-r2-*`; writer source,
dependencies, original source and previous PDF references remain unchanged.

All91 H3 and original U4(52), U5(109), H1(50), H2(55) frozen files retain hashes.
R1's34 durable checkpoint files also retain hashes. Its historical checkpoint
accidentally included a transient Word `~$` owner lock which has since disappeared;
the missing lock is explicitly excluded/classified in R2 preservation evidence,
and the historical manifest is preserved rather than silently rewritten.
No claim is made that this transient lock remains byte-identical.

A fresh read-only reviewer independently verified72 margin-only XML edits,
reversal, frozen/dispatch/PDF hashes, numerical results and all12 contact-sheet
pages. Review found no blocker; it corrected the interpretation of Bai Jamjuree
raw PDF text inequality and distinguished mean marker offsets from individual
row maxima. Project Control check:data, seven local fragments and final
diff/whitespace checks pass. No canonical data/projection changes are needed.

The result supports continued consideration of a shared border-box mapping,
not generic acceptance or incorporation into the converter. Any later writer
change needs its own explicit bounds and checks for border geometry, text
origin and wrapping independently. No font-specific offset, SRS trial, original
PDF modification, product/API/default-format change, install or release occurred.
Stop at this report; U5 full acceptance remains open.

## R3 isolated text-origin cause discovery checkpoint

**2026-10-21 — PASS_BOUNDED_CAUSE_DISCOVERY_WITH_CONTEXT_RESIDUAL; NO_WRITER_CHANGE.**
Owner authorized diagnosing the remaining2.7–3.1pt row-text offset using small
documents and the same two fonts, then reporting causes before converter changes.
Core owns eventual text mapping; Project Control owns shared status. One-room
discovery/Evidence Reviewer/Documentation Synthesizer; medium size, routine risk;
execution/Phase/Checklist IDs N/A. Proof budget: one six-page Word export,
unchanged Core generation, source/shape/formula inspection, all-page geometry and
visual review, one independent review. Document budget: this existing plan and
local machine-readable evidence. No production implementation is authorized.

### Probe and source path

Workspace: `C:/Users/nekot/Documents/Codex/2026-10-21/docx-srs-9130/unified-docx-writer-h3/text-origin-r3/`.
Six panels combine regular Sarabun/Bai Jamjuree11pt with source line heights
14.5,19.84,24pt. Each section begins with three authored outside-table lines
O01–O03 at source body top36pt, followed by two simple two-row tables. Each row
has a Latin R01/R02 marker and three authored mixed Thai/English content lines.
Both tables retain original border/font/text/column/source-padding semantics;
the diagnostic DOCX uses R2's75twip native vertical margins in both. Table A
retains AtLeast; table B changes only lineRule to Exact. Core retains original
content-flow semantics for both tables, including ink-height expansion.

Unchanged public `generateDocxTo` generates `outputs/control.docx`; diagnostic
`outputs/text-origin-r3-factors.docx` changes only allowed margins and B lineRule.
Reversing those attributes restores the complete control document XML; other
package parts, all borders, font resources and text remain unchanged. No writer
source, dependency or prior artifact is modified. The owner exported its matching
PDF in Word; both Word and newly generated Core PDFs have six pages.

Read-only installed Core inspection locates the baseline path in
`dist/runtime/textRuntime.js:25–42`, `dist/layout/measureText.js:34–35` and
`dist/pdf/primitives.js:202`. The runtime starts from font ascent/descent and
expands them for shaped glyph ink; layout sets effective line height to the
larger of requested height and shaped ascent+descent. Baseline offset is
`A + (effectiveL - A - D)/2`. Painting uses that offset. A separate diagnostic
call into the installed internal text runtime records actual shaping metrics;
this is evidence inspection, not a new supported public API dependency.

For the Latin markers at11pt, actual shape A/D are11.748/2.552pt for Sarabun and
11.000/2.750pt for Bai Jamjuree. Reading immutable TTF tables confirms hhea/typo
1068/−232 and1000/−250 respectively at1000 units/em. Formula predictions match
actual Core marker baselines within0.002pt for all six panels.

### Actual measurements and cause

Mean Word AtLeast marker-baseline offset minus Core offset, measured from each
row's top border centre; line heights are source values:

| Source line height, pt | Sarabun gap, pt | Bai Jamjuree gap, pt |
| --- | --- | --- |
|14.50|0.112|0.345|
|19.84|2.842|3.075|
|24.00|4.902|5.135|

Increasing line height by9.5pt moves the Core marker down4.75pt and the actual
Word AtLeast marker down9.54pt for both fonts. The Word table result fits the
empirical model `sourcePadding + L - D` within0.112pt for every measured row;
Core uses `sourcePadding + A + (L-A-D)/2` for these markers. This supports different
allocation of surplus line space as the dominant cause of the earlier offset:
Core splits it above/below the natural font box, while observed Word AtLeast
behavior places approximately the surplus above the baseline. The Word formula
is an empirical fit to this probe, not a claim to have verified Word internals
or a complete standard. Twip/PDF quantization residuals are not causally isolated.

The difference grows with line height and changes with actual font metrics.
It is not a universal fixed2.7–3.1pt shift and is not explained by the retained
border thickness alone. No font-name or document-specific offset is justified.

Exact changes the baseline but does not match Core consistently: its mean gaps
are−0.248/1.282/2.622pt for Sarabun and0.225/1.755/3.095pt for Bai Jamjuree across
the three line heights. Replacing AtLeast with Exact is not accepted as a fix.
Outside-table lines show the same approximate slope difference, but carry an
additional0.88–1.00pt context residual compared with the table content origin.
That residual's cause remains unresolved; it is not absorbed into a correction
or attributed conclusively to paragraph settings/font metrics.

At source14.5pt, shaped Thai ink exceeds the requested line budget in Core;
the three-line right cells expand. Core row heights52.697pt Sarabun and52.246pt
Bai Jamjuree differ from Word's roughly51.48pt rows. This is a separate ink-fit
limit exposed by the stress panel, not proof that shrinking line height safely
fixes alignment. No fixed row height or clipping-based correction is adopted.

### Coverage, limits and stop

All12 complete Core/Word pages were rendered110dpi and reviewed, with Word's
14.5pt Sarabun page additionally inspected at full render size. Each PDF retains
all18 outside markers and24 table row markers. No obvious clipped marks or
overlap was seen in this limited sample; this is not general clipping acceptance.
The measurement uses actual Latin marker matrices and separately measured border
centres, avoiding PDF Thai shaping/Unicode text-extraction ambiguity.

Local evidence: `evidence/{package-check,control-receipt,core-probes,
core-shape-metrics,pdf-geometry,measurements,final-review,results,checkpoint}.json`,
source/control/candidate/Core/Word artifacts and `rendered/{core,word}/` PNGs;
reproduction scripts are H3 `qa/text-origin-r3-*`. Source and candidate identities
match their generation/package receipts. Frozen H3/R2 and prior durable probe
files remain unchanged; the already classified historical R1 Word owner lock is
excluded without rewriting its manifest. Existing112 H3 tests/type-check remain
historical proof for unchanged writer inputs; no new test execution is claimed.

A fresh independent read-only review verified91 H3 and38 R2 frozen files,
package entry equality/factor reversal, all marker formula matches, measured
Word fit and12 contact-sheet pages; no important issue found. It explicitly
retains the empirical/inferred Word-model boundary and unresolved context term.
Project Control check:data, seven local fragments and final diff/whitespace
checks pass. No canonical data/projection record changes are needed.

The next design question is how to express a common line-box/baseline/ink-fit
contract without changing row extent or hiding glyph overflow. No mapping fix
is selected by this cause report. Generic fonts, emphasis, merged tables,
pagination and the paragraph/table context residual remain outside acceptance.
No SRS trial, existing PDF source/reference/implementation, writer source,
product/API/default format, dependency, resource, map, install or release change
occurred. Stop before converter changes; U5 overall acceptance remains open.

## R4 isolated paragraph-cell residual cause checkpoint

**2026-10-21 — PASS_EMPTY_HEADER_INTRUSION_CAUSE_CONFIRMED; NO_WRITER_CHANGE.**
Owner authorized isolating R3's0.9–1pt paragraph/cell context residual using
small documents and the same two fonts, then reporting before converter changes.
Core owns eventual section/text mapping; Project Control owns this result.
Single-room discovery/Evidence Reviewer/Documentation Synthesizer, medium size,
routine risk; execution/Phase/Checklist IDs N/A. Document budget remains this
existing plan plus local machine-readable evidence. No product integration.

### Identical-text context probe

Workspace: `C:/Users/nekot/Documents/Codex/2026-10-21/docx-srs-9130/unified-docx-writer-h3/paragraph-cell-r4/`.
Six sections use regular11pt Sarabun/Bai Jamjuree and source line heights
14.5/19.84/24pt. Identical paragraphs occur before, inside and after a single
three-row table: Latin single line, mixed Thai/English single line and three
authored mixed lines. No preceding label changes the first paragraph's origin;
the section label follows all measured content. Cell margins retain R2's75twip
diagnostic mapping; all borders, fonts, AtLeast settings and source padding4pt
remain fixed. Only diagnostic cell margins differ from unchanged writer output;
reversing them restores the full control XML, with all other ZIP parts unchanged.

The first six-page Word export reproduces the first-line outside/cell residual:
1.00/0.88/0.88pt respectively across the three line heights, identical in both
font families. The table's top border also begins about1.21–1.32pt below the
nominal preceding five-line budget. Comparing identical text removes the former
Latin-marker versus mixed-text confound; same-row English and Latin matrices in
the prior R3 output also share the same baseline.

### Source cause and one-factor confirmation

Read-only inspection locates the source in unchanged experimental writer code:

- `src/sections.ts:8` initializes native header distance to source top margin,
 36pt here, even when the authored header mode is none.
- `src/sections.ts:11–13` still creates empty first/default header parts.
- `src/tables.ts:4` makes each empty structural paragraph exactly1pt high.

The12 empty header parts in this six-section DOCX contain no authored text,
image or table, but their1pt paragraphs start at the body top36pt. They therefore
extend into the body region. This is a concrete no-header serialization/footprint
issue in the experimental writer, not a generic font offset or a Word defect.

The first context probe exposed this candidate cause, justifying one additional
six-page Word export to confirm it. `qa/paragraph-cell-r4-header-zero.py` creates
`outputs/paragraph-cell-r4-header-zero.docx` from the unchanged first candidate.
It changes exactly six `pgMar/@header` values720→0twips. Body top remains720;
all12 empty header payloads, body XML/text/font/paragraph/table/border settings,
relationships and other package parts remain unchanged. Reversing the six
attributes restores the complete original XML. No source/writer repair occurs.

The owner exported both candidates in Word. All90 marker baselines in the
second PDF move upward0.96–1.08pt; all24 table-border centres also move upward
by that range. This controlled movement confirms the empty-header intrusion as
the main cause of the earlier context residual.

| Source line height, pt | First-line residual before, pt | After header-distance intervention, pt |
| --- | --- | --- |
|14.50|1.00|+0.04|
|19.84|0.88|−0.08|
|24.00|0.88|+0.04|

Values are identical for both fonts and compare the first outside baseline from
source page top with the first cell baseline from its actual top border minus
source padding. Across all five matched lines, per-panel mean residuals become
0.028/−0.066/−0.032pt. These are specific first-line/mean measures, not a claim
that every coordinate is within0.08pt. After intervention, table top minus the
nominal preceding five-line budget becomes0.24/0.25/0.26pt; the border origin and
paragraph flow origin must remain explicitly distinguished.

### What the result changes and leaves open

R3's0.9–1pt residual was largely an absolute body-start displacement measured
against a cell-relative origin. Its historical report remains unchanged; this
checkpoint resolves that stated unknown. R3's separate surplus-leading allocation
finding remains supported by cell-relative measurements and is not removed by
moving the whole body. No extra paragraph/cell font correction is justified.

Raw after-table offsets still differ0.16–0.28pt when measured against the bottom
border centre. Their size is compatible with an origin/footprint question, but
this experiment does not prove a half-stroke explanation. Small row-height and
coordinate variations remain visible; no particular rounding mechanism is
asserted. These residuals are not the confirmed1pt empty-header cause.

An eventual policy must ensure semantically absent headers do not consume body
space and that footprint/capacity reporting agrees. Setting header distance0 is
only a diagnostic for sections where both first/default headers are empty. It
must not be applied blindly to visible headers or mixed first/continuation modes
sharing section geometry. Footer/bottom-page intrusion and automatic continuation
pagination are untested; no generic header policy or writer fix is accepted here.

### Evidence coverage and preservation

All18 complete pages (Core6, original Word6, header-distance Word6) were rendered
110dpi and visually reviewed through complete-page contact sheets. All90 markers
per PDF/270 total remain in order; content and borders remain visible without
observed overlap/clipping in this sample. Both DOCX identities and source/Core
identities match frozen dispatch/package receipts. No existing PDF is regenerated.

Local evidence: `evidence/{package-check,control-receipt,core-probes,dispatched,
header-zero-dispatched,pdf-geometry,measurements,final-review,results,checkpoint}.json`,
source/control/two candidate DOCX, Core/two Word PDFs and complete-page PNGs in
`rendered/{core,word,word-zero}/`; scripts are H3 `qa/paragraph-cell-r4-*`.
Initial proof budget was one context export; the one extra export directly
tested the newly found collision. Stop after this confirmation, without broader
Word settings, fonts or SRS trials.

A fresh read-only reviewer independently verified both package factor reversals,
all dispatch identities and identical context texts, freshly extracted baselines
from all18 PDF pages, recomputed the context/intervention values and inspected
all18 contact-sheet pages. No important finding; stated residuals/acceptance
limits remain. Project Control check:data, seven local fragments and final
diff/whitespace checks pass.

All frozen H3(91), R2(38), R3(37), R1 durable(34) and original U4(52), U5(109),
H1(50), H2(55) files retain hashes. The already classified historical R1 transient
Word owner lock remains excluded without rewriting its manifest. Prior112 H3
tests/type-check remain historical proof for byte-identical writer inputs; no
rerun is represented as new execution. No canonical data/projection/map record
is promoted. No writer source, PDF reference/source/implementation, SRS,
product/API/default format, dependency, resource, install or release changed.
Stop at this cause report before converter changes; U5 overall acceptance is open.

## R5 isolated after-table residual cause checkpoint

**2026-10-21 — PASS_BOUNDED_BOTTOM_BORDER_FOOTPRINT_CAUSE; NO_WRITER_CHANGE.**
Owner authorized isolating R4's0.16–0.28pt after-table residual using small
documents and the same two fonts, then reporting before converter changes.
Core owns eventual geometry mapping; Project Control owns this status. One-room
discovery/Evidence Reviewer/Documentation Synthesizer, medium size, routine risk;
execution/Phase/Checklist IDs N/A. Proof budget: one six-page Word export,
corresponding unchanged Core generation, package factor reversal, all-page
geometry/visual review and one independent review. Document budget: existing
plan plus local machine-readable evidence. No product integration.

### Bottom-border-only experiment

Workspace: `C:/Users/nekot/Documents/Codex/2026-10-21/docx-srs-9130/unified-docx-writer-h3/after-table-r5/`.
Six sections combine regular11pt Sarabun/Bai Jamjuree with three DOCX bottom
border variants: nil, nominal0.5pt and nominal1pt. All use source line-height
19.84pt/native397twips, the same three-row single-column table and identical
Latin/mixed/three-line paragraphs before/in/after it. Source vertical padding
remains4pt; all diagnostic DOCX panels share native75twip vertical margins and
R4's empty-header distance0. Other border edges, text, font, AtLeast line rule,
paragraph before/after spacing0 and reading relationships stay fixed.

Public unchanged writer generation creates the control. Diagnostic package edits
change only the shared vertical margins/empty-header distances and listed bottom
border values; complete reversal restores control document XML. All other ZIP
parts remain identical. Nil/thick borders are causal interventions, not proposed
changes to required document borders. No reusable writer source is edited.

All Core panels intentionally retain original0.5pt borders/source4pt padding and
no authored header. Newly generated `outputs/core-reference.pdf` is a baseline,
not the corresponding nil/thick factor output. The owner exported
`outputs/after-table-r5-factors.docx` to the matching PDF in Word; both PDFs have
six pages and retain pinned source/candidate/Core identities.

### Measurements and origin distinction

Both fonts produce the same measured values. The first comparison uses actual
last-cell R05 to after-table R01 character baselines and needs no invented
border centre for the nil case:

| DOCX bottom | Baseline gap, pt | Gap−19.85pt line−3.75pt native bottom margin |
| --- | --- | --- |
|nil|23.55|−0.05|
|0.5pt|24.03|+0.43|
|1pt|24.63|+1.03|

This controlled sequence supports a bottom-border footprint contribution. It is
not exact full-stroke accounting:0.5→1pt increases the baseline gap0.60pt while
actual painted thickness increases0.48pt, leaving0.12pt unexplained in that
comparison. No Word rounding/grid mechanism is claimed proven.

The metric that produced R4's residual was measured from the bottom border's
centre. For the two present-border cases:

| Nominal bottom | Actual PDF stroke, pt | Centre-based after/cell residual, pt | Residual measured from outer ink edge, pt |
| --- | --- | --- | --- |
|0.5pt|0.48|0.19|−0.05|
|1pt|0.96|0.43|−0.05|

The centre-based residual increases0.24pt, exactly half the measured0.48pt stroke
increase. Changing the measurement origin from stroke centre to its lower outer
ink edge subtracts0.24/0.48pt respectively; both residuals become−0.05pt. The
same result holds using either first-cell or last-cell first-line local offset.
The nil case has no painted horizontal bottom centre; its centre metric is
explicitly null. Only the baseline-to-baseline comparison is used there.

This confirms outer-stroke footprint versus centre-origin interpretation as the
dominant cause of the earlier small residual for this shape. It does not prove
all residuals vanish or justify inserting negative paragraph spacing. Installed
Core `dist/layout/cellTableFlow.js` computes row heights from measured content
and padding, strokes edges separately and advances the flow by consumed geometry.
All six baseline Core panels show zero centre-based reduced after-table gap.
The layout/measurement contract must distinguish content/padding geometry,
stroke centre, outer ink edge and the following paragraph origin.

### Coverage, limitations and stop

All12 complete Core/Word pages were rendered110dpi and reviewed through complete
page contact sheets. Each PDF retains90 markers in order,180 total; intended
borders and text remain visible without observed overlap/clipping. Package text
invariance and Latin marker matrices avoid Thai PDF extraction ambiguity.

Local evidence: `evidence/{package-check,control-receipt,core-probes,dispatched,
pdf-geometry,measurements,final-review,results,checkpoint}.json`, source/control/
candidate/Core/Word artifacts, `rendered/{core,word}/` PNGs and H3
`qa/after-table-r5-*` reproduction scripts. Original PDFs are not regenerated.

A fresh read-only reviewer verified source/DOCX/Core hashes, ZIP isolation/full
factor reversal, shared settings/fonts, independent extraction from all12 PDF
pages and all12 contact-sheet pages. No important issue; the0.12pt baseline-gap
nuance remains explicit. Project Control check:data, seven local fragments and
final diff/whitespace checks pass. No canonical data/projection change is needed.

This is a single unmerged three-row shape, two regular fonts at11pt and one
line height, without page boundaries. No merged/mixed border style, repeated
header, pagination, footer or generic tolerance is accepted. The−0.05pt residual
and baseline comparison's0.12pt difference remain observed but unexplained.
R2 row extent, R3 leading and R4 empty-header findings remain separate; no
font-name/document offset, border removal or writer repair is selected here.

All frozen H3(91), R4(49), R3(37), R2(38), R1 durable(34), U4(52), U5(109),
H1(50), H2(55) files retain hashes; the historical R1 transient Word lock remains
classified/excluded without rewriting its manifest. Existing112 H3 tests/type-
check remain historical unchanged-input proof, not rerun. No canonical data/map
promotion, writer source, PDF reference/source/implementation, SRS, product/API/
default format, font/dependency, install or release change occurred. Stop at
this cause report before converter changes; U5 overall acceptance remains open.

## R6 isolated coordinate-step cause checkpoint

**2026-10-21 — PASS_BOUNDED_WORD_COORDINATE_STEP_RESPONSE; NO_WRITER_CHANGE.**
Owner authorized isolating R5's remaining0.12pt component using small documents
and the same two fonts, then reporting before converter changes. Core owns
eventual geometry mapping; Project Control owns this status. Single-room
discovery/Evidence Reviewer/Documentation Synthesizer, medium size, routine risk;
execution/Phase/Checklist IDs N/A. Proof budget: read-only R5 raw-PDF audit, one
six-page Word phase export, matching Core controls, package reversal, all-page
review and one independent review. Document budget: this existing plan plus
local machine-readable evidence. No production implementation is authorized.

### Raw audit localizes the old component

Workspace: `C:/Users/nekot/Documents/Codex/2026-10-21/docx-srs-9130/unified-docx-writer-h3/coordinate-r6/`.
R5 PDFs and their manifests remain unchanged. Decimal analysis of their actual
`re` and `Tm` operands, independently matched to PDF character matrices, gives
the same decomposition for Sarabun and Bai Jamjuree:

- nominal0.5pt bottom: outer PDF Y582.94; thickness0.48001; inner Y583.42001;
- nominal1pt bottom: outer PDF Y582.34; thickness0.96002; inner Y583.30002;
- after-table baseline moves downward0.60pt, exactly as the outer edge does;
- inner edge movement0.11999 + stroke increase0.48001 =0.60000pt, balance0.

The outer-edge-to-following-baseline gap remains unchanged within each font.
Thus the old0.12pt component belongs to the table's inner edge/footprint movement,
not an unexplained extra paragraph gap or a raster-measurement artifact. This
arithmetic localizes the component; by itself it does not prove a rounding rule.

### Controlled phase and width probe

Six sections combine regular11pt Sarabun/Bai Jamjuree with authored top-margin
shifts0/0.05/0.10pt (720/721/722twips). Each section contains eight one-row,
three-line tables with a following paragraph, using DOCX bottom sizes3–10 in
eighth-points (0.375–1.25pt). Source line-height stays19.84pt/native397twips;
other borders, font/text/spacing and widths are fixed. All diagnostic tables
share R2 native75twip vertical margins and R4 empty-header distance0.

`qa/coordinate-r6-prepare.mjs` uses unchanged public writer generation. The
diagnostic package changes only shared margins/header distances and selected
bottom sizes; reversing them restores the full control XML. No source/candidate
runtime is edited. Top-margin phases are authored source data and apply to both
outputs. Core0.4.7 retains baseline0.5pt borders/source4pt padding in all tables;
its PDF is not a corresponding border-width-factor output. Source and output
identities are pinned before the owner exports the candidate in Word.

Both PDFs have six pages/48 tables/192 markers. Word PDF text matrices were
matched directly to actual serialized `Tm` operands for every marker. Therefore
the following response is present in vector/text coordinates, independent of
the110dpi visual review. Each font produces the same counts:

| Source top shift | Core32 marker shifts | Word32 marker shifts | Word24 sampled border-coordinate shifts |
| --- | --- | --- | --- |
|0.05pt|all0.05pt|20 unchanged;12 move0.12pt|14 unchanged;10 move0.12pt|
|0.10pt|all0.10pt|8 unchanged;24 move0.12pt|2 unchanged;22 move0.12pt|

All24 corresponding Core border coordinates also move exactly by the authored
phase. This controlled non-continuous response supports coordinate quantization
in the observed Word layout/export pipeline: a small authored movement may
leave an output point stationary or move it by0.12pt. It explains why a0.12pt
component can appear when adjacent border widths/positions cross a step; it is
not a universal per-row spacing term to subtract.

The evidence does not distinguish which internal Word layout or PDF-serialization
stage performs this rounding. No printer/device setting, universal600dpi rule,
all-version behavior or generic0.12pt tolerance is accepted. R5's−0.05pt residual
is not separately eliminated. R2 border-area, R3 leading and R4 empty-header
findings remain distinct; their broader acceptance is not promoted by this test.

### Coverage, preservation and stop

All12 complete Core/Word pages were rendered110dpi and visually reviewed through
complete-page contact sheets; Word's final page was additionally inspected at
full render size. All48 tables and192 markers per PDF/384 total remain present;
no clipping, overlap or unexpected pages were observed in this bounded sample.
No SRS, emphasis, merged cells, automatic page boundaries or arbitrary fonts are
newly accepted.

Local evidence: `evidence/{package-check,control-receipt,core-probes,dispatched,
r5-raw-audit,pdf-geometry,measurements,final-review,results,checkpoint}.json`,
source/control/candidate/Core/Word artifacts and `rendered/{core,word}/` PNGs;
reproduction scripts are H3 `qa/coordinate-r6-*`. No prior PDF is regenerated.

A fresh read-only reviewer verified dispatch hashes, ZIP isolation/full factor
reversal, source phases/native margins, settings/font resources, all384 raw
marker positions, phase histograms, exact R5 operator decomposition and all12
contact-sheet pages. No blocking finding; the layout-versus-export stage limit
remains explicit. Project Control check:data, seven local fragments and final
diff/whitespace checks pass. No canonical data/projection changes are needed.

Frozen H3(91), R5(37), R4(49), R3(37), R2(38), R1 durable(34), U4(52), U5(109),
H1(50), H2(55) files retain hashes. The historical R1 transient Word owner lock
remains explicitly excluded without rewriting its manifest. Prior112 H3 tests/
type-check remain historical unchanged-input proof, not rerun. No canonical data/
projection/map promotion, writer source, PDF reference/source/implementation,
SRS, product/API/default-format, font/dependency/resource, install or release
change occurred. Stop at this cause report; no fixed correction or converter
integration is selected, and U5 overall acceptance remains open.

## Consolidated geometry mapping rules and M1 isolated change plan

**2026-10-21 — PLAN_READY_FOR_OWNER_REVIEW; NO_IMPLEMENTATION.** This section
consolidates the preceding R1–R6 evidence; it supersedes no historical result.
The owner requested rules and a plan before changing the converter. Project
Control owns this plan; Core owns eventual semantics/writer implementation.
Role: Planning Partner / Documentation Synthesizer; medium size, routine risk;
Work/Phase/Checklist/execution IDs N/A for this single-room planning checkpoint.
No new runtime, source contract, supported-font claim or production acceptance
is established here. Service/API and absent `Output-Format` → PDF stay unchanged.

### Evidence to decision

| Concern | Established observation | Proposed decision and limit |
| --- | --- | --- |
| Border area, R1/R2 | Horizontal strokes contribute to native Word row extent. With source padding4pt and nominal0.5pt strokes, native3.75pt vertical margins reduce row-pitch differences to0/0.05/0.01pt across the three bounded shapes/two fonts; individual row residual reaches0.14pt. | Adapt the coordinate convention, preserving the stroke and source padding. Accept only after direct writer/Word verification; this is not a universal exact-height result. |
| Text origin, R3 | Core centers shaped metrics within effective leading; changing leading moves its baseline differently from the observed Word AtLeast behavior. A fixed3pt shift and Exact spacing do not generalize. | Preserve native text flow for now. Describe the unresolved baseline policy; require a separate feasibility decision before any displacement. |
| Empty header, R4 | A serialized empty1pt header at the body boundary shifts content approximately1pt; setting only its distance to0 removes that bounded cause. | Set header distance0 only when both effective first/default headers are empty; retain explicit empty references to prevent inheritance. Mixed visible/hidden headers retain H3 policy. |
| Following text, R5 | Measuring from a border centre conflates half its thickness with spacing. Outer-edge normalization leaves−0.05pt in the bounded sample. | Compare explicit coordinate landmarks; do not turn a QA normalization into a paragraph-spacing correction. |
| Small residuals, R6 | Raw coordinates show0/0.12pt step responses to0.05/0.10pt source shifts in both fonts; R5's old0.12pt component decomposes into footprint and stroke movement. | Record local quantization separately from systematic drift. No fixed0.12pt compensation, universal tolerance, device-resolution claim or attribution to a particular internal Word stage. |

Evidence locators remain the R1–R6 checkpoint sections and their existing local
manifests. These are disposable package probes, not fixes already present in
the writer. In particular, R1's missing transient Word owner lock is excluded
from durable coverage without rewriting its historical manifest. This planning
turn reuses those findings; it does not rerun or re-certify their artifacts.

### Proposed shared coordinate contract

1. Keep `ResolvedDocument`, resource identities and source lengths immutable.
   The two outputs consume the same values; only the DOCX-native representation
   changes. Store source points separately from rounded native twips. Preserve
   the existing20twips/pt and eighth-point border representation and disclose
   their conversion errors. Do not change PDF measurements to fit Word.
2. Name distinct landmarks: content line box, glyph baseline/ink bounds, source
   padding measured from the border centre, border centre, outer stroke edge,
   native inner cell margin and following paragraph start. The border-centre
   convention is the proposed DOCX adaptation contract inferred from R2, not a
   newly verified product-wide source specification. The PDF stays the reference.
3. For an eligible table, derive each vertical native margin as source vertical
   padding minus half the corresponding horizontal stroke. For the proven
   shape,4pt −0.5pt/2 =3.75pt =75twips. Keep left/right padding and all border
   appearance unchanged. Eligibility is structural, never a font-name or SRS
   identifier branch: full unmerged grid, plain text, uniform SINGLE0.5pt
   borders, source4pt vertical padding, exact native representation and
   nonnegative derived margins. Two fonts provide bounded validation, not
   acceptance of arbitrary fonts. Existing writer borders are fixed size4;
   adding authored border width/style to the public source is out of scope.
4. Ineligible tables retain existing supported native behavior and a reason in
   the receipt. Do not silently clamp a negative margin, round an unsupported
   half-stroke into an accepted match, drop borders, change fonts, shrink text
   or force a source-independent row height. Existing capability errors still
   apply where safe serialization is unavailable. Merges and continuation
   cells must not become newly rejected merely because this adaptation skips them.
5. Header absence is semantic and section/page-type specific. Apply zero
   distance only when both effective first/default headers are empty after
   cover/blank/mode resolution. A shared section header distance cannot be
   zeroed just because one page type hides its header. Keep visible-header
   source gap, H3 reservation/capacity guards, explicit inheritance barriers,
   body top margin and all footer behavior. Mixed cases get a fallback reason.
6. Separate actual serialized distances from estimated body capacity and source
   offsets in receipts. Never mark `wordVerified:true` from generation, unit
   tests or estimated fit. Report an empty-header footprint as unresolved when
   a mixed case keeps its old native distance; do not describe it as zero cost.

### Text baseline policy and unresolved boundary

For the actual shaped run/line, Core uses ascent A, descent D and
`effectiveL = max(requestedL, A + D)`, with baseline origin
`A + (effectiveL - A - D)/2` before cell padding. Glyph ink can expand the
metrics. Font hhea values alone are insufficient. R3's Word approximation
`padding + L - D` is empirical, not a proven Word algorithm.

The first implementation must retain AtLeast, complex-script font selection,
bold/italic true **and false**, source line breaks and current overflow guards.
Its receipt describes `native-at-least-unmatched` with baseline matching
unverified. It must not pretend that `src/font-envelope.ts` supplies shaped
ascent/descent: that module currently returns conservative maxWidth/maxHeight.
No new shaping dependency, Core hook, negative padding, run position, forced
Exact spacing or global/font-specific offset is selected by this plan.

A later baseline feasibility stage must first show a native method preserving
ink, row extent, wrapping and mixed emphasis across two fonts. If it cannot,
retain correct native flow and report the difference. This unknown blocks a
general baseline-match claim; it does not block testing the two independent
border/header corrections. No feasibility probe is dispatched by this plan.

### M1 scope, interfaces and sequence after authorization

Proposed new root:
`C:/Users/nekot/Documents/Codex/2026-10-21/docx-srs-9130/unified-docx-writer-m1/`.
All relative paths in the following tasks resolve inside that root, not in a
product repository. Frozen input is sibling `unified-docx-writer-h3/`, including
its91-file checkpoint; H3 checkpoint SHA256 is
`8e3bdf7b6cc4e4b65ece00ed8822fd2405123aae3fe849229b47cb0cf9488148`.
Keep H3 and R1–R6 untouched. No installation, dependency/lock/font changes,
release, API integration or canonical map/data promotion.

**M1.0 — establish the isolated candidate.** Verify the proposed target is
unused and the frozen source identities match. Copy source/tests/fixtures,
resources/vendor and configuration/lock needed by public generation; exclude
old outputs, Word lock files and probe folders. Reuse the existing dependency
junction read-only. Record copied-file hashes and actual runtime/resource
identities in `evidence/base.json`. Stop on a mismatch rather than repairing
the frozen input. Room arrangement is independent of this filesystem isolation.
Future WORK records its own model/host availability decision when authorized;
this plan does not assert a model switch or create a separate execution room.

**M1.1 — define one native-space policy.** Add `src/geometry-policy.ts` with
the following internal interfaces; no change to the public source schema:

```ts
type TableSpaceInput = {
  unmergedPlainGrid: boolean;
  uniformSingleHalfPointBorder: boolean;
  sourceTopTwips: number;
  sourceBottomTwips: number;
};
type TableSpaceDecision = {
  policy: 'border-centre-inset' | 'retain-native';
  nativeTopTwips: number;
  nativeBottomTwips: number;
  reason: string;
};
function deriveTableSpace(input: TableSpaceInput): TableSpaceDecision;
type HeaderSpaceInput = {
  effectiveFirstEmpty: boolean;
  effectiveDefaultEmpty: boolean;
  previousDistanceTwips: number;
};
type HeaderSpaceDecision = {
  policy: 'empty-header-zero' | 'retain-h3';
  nativeDistanceTwips: number;
  reason: string;
};
function deriveHeaderSpace(input: HeaderSpaceInput): HeaderSpaceDecision;
```

Add `tests/geometry-policy.test.ts` to the explicit `package.json` test list.
First demonstrate the new tests fail for the missing policy. Assert eligible
80/80twips maps75/75, source input unchanged; nonmatching padding/borders or
merged/nonplain grids return original margins plus reason. Assert both empty
returns0, all other emptiness combinations retain their supplied distance.
The bounded inputs intentionally prevent general half-stroke arithmetic from
silently extending support. Implement only these decisions, then run the
targeted tests to PASS.

**M1.2 — integrate border space and auditable receipts.** In `src/tables.ts`,
derive eligibility from the actual table/cell structure and call M1.1 for the
whole eligible table; never adapt only some cells of an otherwise ineligible
grid. Preserve borders, widths, header rows, split/keep rules and structural
paragraphs. Retain source `paddingTwips` in `ExportIntent`; native margins are
a writer decision. Extend `src/writer.ts` adaptations with
`kind:'table-space-policy'`, table node/scope, policy/reason, source/native
vertical margins and `baselinePolicy:'native-at-least-unmatched'`. Compute the
decision once and carry the same decision through serialization and receipt;
do not recompute a separately guessed receipt after packing. Thread that typed
result through `buildBodyFlow`/`buildSections` as needed, preserving callers.

Add assertions to `tests/tables-groups.test.ts` and `tests/writer.test.ts`:
generated XML has75 margins and unchanged size4 borders for eligible tables;
ineligible/merged/continuation cases preserve their old XML behavior; source
digest/data remain unchanged; receipt matches serialized margins and records
fallbacks. Consecutive-table separators remain explicit, not silently removed.
Run targeted tests before moving on.

**M1.3 — integrate wholly empty headers.** In `src/sections.ts`, apply M1.1
after effective header modes are resolved, preserving explicit first/default
parts/references. Add actual native header distance and the decision/reason to
the existing section receipt; `src/writer.ts` emits the matching adaptation.
Keep `sourceMarginTwips`, `nativeMarginTwips`, capacity estimates and existing
compatibility aliases consistent; do not add a fictitious capacity gain.
Extend `tests/header-space.test.ts`, `tests/sections-fields.test.ts` and
`tests/writer.test.ts`: both empty → native distance0/body top unchanged;
first-hidden/default-visible and the reverse → retain H3; no prior-section
header leaks through; cover/blank modes resolved first; footer XML/receipts
unchanged. Existing visible multiline/image/table header policies remain intact.

**M1.4 — public-path verification and stop.** Generate directly through
`generateDocxTo` without post-pack XML patches. Keep evidence in new-root
`evidence/`, `outputs/` and `rendered/`. Use at most four small Word exports:
two-font border/text matrix, header absence/inheritance matrix, and the existing
H1/H2 small-document regression inputs generated by the changed writer. Reuse
frozen source fixtures and PDF references; do not regenerate original PDFs.
Ask the owner to convert these DOCX files only when they are ready and paths
are concrete. One repair/recheck is budgeted for an actual failure; unresolved
behavior returns a bounded report, not automatic expansion or SRS testing.

Compare all pages and each table: row extent, first/last baseline, wrapping,
border centre/outer edge and following-paragraph origin separately. Include
natural multiline Thai/English and emphasis, table page boundaries/repeated
headers, headings/icons and mixed/visible/empty headers. Use at least one
auto-flowing small table sample; do not infer page-break safety from one-row
tables. Confirm content/resource identities, no repair prompt, clipping,
overlap, missing headers/content or new unexpected page breaks. Compare
eligibility/fallback paths, not just corrected examples or average heights.

Run the expanded explicit test list via `node --import tsx --test` using the
files in `package.json` (including `tests/geometry-policy.test.ts`), and
`node node_modules/typescript/bin/tsc --noEmit`; both must exit0. Historical
112 H3 tests are the starting regression set, not a promised new test count.
Record commands/runtime, actual counts and every skipped check. Package tests
must assert unchanged source/font identities and exact policy/receipt/XML
agreement. Visual verification is separate from successful serialization.

### Acceptance, review focus and return boundary

Proposed M1 acceptance: all old/new automated checks pass; eligible generated
XML and receipts agree with the two rules; ineligible behavior is retained with
reasons; small Word outputs preserve content/flow and reproduce the bounded
R2/R4 improvements without an unexplained systematic regression. Compare row
residuals to the matched frozen samples, including R2's0.14pt individual maximum;
that observation is not a universal tolerance. Record quantization by landmark
and accumulated drift. Do not accept clipping, changed wrap/page boundaries
or accumulating error merely because a mean difference is small. R5's−0.05pt
and unmatched baselines remain explicit limitations. Any acceptance threshold
beyond this matched comparison needs owner review; none is silently granted.

Review Focus (each assigned above):

- Tiny/zero or other padding and unsupported stroke shapes: M1.1 retain-native
  assertions plus M1.2 receipt/XML checks; never negative/clamped adaptation.
- Merged/continuation cells and repeated headers: M1.2 regression tests and
  M1.4 flowing-table comparison; no partial-grid adaptation.
- Mixed first/default visibility and inheritance across cover/blank sections:
  M1.3 section tests and M1.4 header matrix.
- Thai combining ink, mixed language and explicit emphasis-off: M1.4 two-font
  matrix plus retained text tests; no font substitution/Exact workaround.
- Nonaccumulating coordinate steps versus cumulative flow/page changes:
  M1.4 per-landmark/raw-coordinate comparison, all-page review and drift report.

Planning self-review completed: all three requested subjects have rules and
owning tasks; baseline displacement is deliberately unproven/deferred rather
than disguised as implementation. Interfaces above share consistent names;
five likely missed input classes have explicit tests/checkpoints. Scope is two
bounded adaptations and their receipts, not a general layout-engine rewrite.
Future baseline feasibility requires its own reviewed proposal after M1 results.

Current-turn proof/document budget: update this existing canonical plan only,
self-review, Project Control `check:data`, local fragments and final diff/
whitespace inspection; no runtime/projection generation or historical tests
rerun. Commit only after these checks pass. Recommended execution method after
owner review is inline in this chat with the isolated M1 filesystem copy,
because the policy/receipt/header changes share interfaces. This recommendation
does not authorize implementation or a separate room. Return the plan for
review now; SRS, PDF reference and product changes remain prohibited.

Planning verification: Project Control `check:data` exits0; all seven existing
local fragments resolve; final diff/whitespace review covers this plan only.
No converter files or experiment outputs changed and no historical runtime
test result is presented as rerun. No data/projection regeneration is needed.

## M1 isolated implementation and Word handoff checkpoint

**2026-10-21 — PASS_AUTOMATED_PACKAGE_WORD_PENDING.** Owner authorized M1
implementation in the isolated area and small two-font documents, including
asking for Word exports when ready. This checkpoint is not completed visual
acceptance. Core owns eventual writer semantics; Project Control owns status.
Single-room Product Implementation Agent / Evidence Reviewer / Documentation
Synthesizer; medium size, routine risk; Work/Phase/Checklist/execution IDs N/A.
The existing M1 scope and four-Word-export proof budget apply. Shared document
budget remains this plan; no new Work/map/data/projection record is created.

Candidate root:
`C:/Users/nekot/Documents/Codex/2026-10-21/docx-srs-9130/unified-docx-writer-m1/`.
Verified all91 frozen H3 manifest entries before copying49 required files;
reused the pinned dependency junction read-only. Runtime is bundled Node24.19.0;
no dependency installation/lock/font/resource change. Inline implementation
uses the current host session without claiming a model switch. One read-only
final review used gpt-6-astra/medium as explicitly required by executing-plans;
no implementer subagent or separate execution room was opened.

### Implemented behavior and evidence

- `src/geometry-policy.ts` owns bounded native-space decisions. An entire
  unmerged plain content-height grid is adapted only when all original source
  vertical padding values are exactly4pt (including omitted4pt defaults and
  equivalent mm) and their native values are80twips. Native vertical margins
  become75twips; left/right margins, fixed SINGLE size4 borders and source stay
  unchanged. Other tables retain native behavior and a located reason.
- `src/tables.ts` carries the decisions used by serialization through body/
  section results into `src/writer.ts` adaptations. Receipts retain original
  source points, source twips and actual native margins, with
  `baselinePolicy:'native-at-least-unmatched'` and matching unverified. Existing
  merging, continuation, repeated-header, split/keep and separator behavior
  remains covered. No text/font/leading displacement was added.
- `src/sections.ts` zeros header distance only when both effective first/default
  headers are absent after mode/cover/blank resolution. Explicit first/default
  header references remain. Source body top, footer and H3 visible-header
  policy/capacity guards remain. Mixed visibility retains its old distance
  with reason. Section/adaptation receipts expose actual native distance;
  source offsets and estimated capacities remain separate and unverified.

Tests observed RED before implementing each policy/integration, then GREEN.
One Important final-review finding showed that source3.98/4.01/4.02pt could round
to80twips and incorrectly qualify. Added failing integration regressions,
then required original resolved points as well as native twips and checked
whole-grid fallback. Added original point values to receipts. Equivalent-mm
and omitted-default cases pass. This corrects a boundary defect, not an
expansion of the accepted geometry envelope. No Minor findings were deferred.

Final fresh suite: **130/130 PASS, zero failures/skips**, explicit test list in
`package.json`, using bundled Node with `--import tsx --test`; TypeScript
`node node_modules/typescript/bin/tsc --noEmit` exits0. Logs and RED/GREEN proof
are in `evidence/`. Tests do not prove Word pagination or visual parity.

Four documents are generated directly with `generateDocxTo`; no package XML
post-patching. All XML/relationships parse; receipt distances/margins match
serialized XML; new-matrix body text matches source; frozen H1/H2 footer XML
is unchanged. All91 H3 entries and15 immutable copied resource/vendor/lock/
configuration inputs were rechecked unchanged. These checks cover packages,
not a rendered document. No SRS or original PDF was regenerated.

### Files ready for owner Word conversion

All paths are under the candidate root's `outputs/`:

| DOCX | Purpose | Word action |
| --- | --- | --- |
| `01-border-flow-two-fonts.docx` | Eight sections: original R2 table shapes for both fonts, natural/authored wrapping, flowing tables with emphasis/repeated headers and image-table fallback. Ten tables total; eight adapted. | Save as same-name PDF. |
| `02-empty-header-matrix.docx` | Six sections: cover, visible-all, none after visible, first-only, continuation-only and blank; visible/mixed sections deliberately flow across pages. | Save as same-name PDF. |
| `03-h1-regression.docx` | Exact frozen H1 small source; four sections. | Update whole TOC and fields, then same-name PDF. |
| `04-h2-regression.docx` | Exact frozen H2 small source; three sections with multiline/image/columns headers and automatic flow. | Save as same-name PDF. |

The generator initially encountered existing conservative group/cover fit
guards on verbose new test labels/bodies. Shortened only the new fixture labels
and cover body; no fit guard or reference changed. Pre-review generated files
were superseded before human handoff and retained under `evidence/pre-review/`.
The final dispatch manifest identifies the four current hashes; do not export
the archived candidates. Generic skill task-parser/Git-branch scripts were not
used for this external snapshot: task evidence lives in `evidence/ledger.json`.
Keep artifacts for pending Word inspection rather than deleting them at finish.

Evidence: `evidence/{base,ledger,dispatched,package-check,final-review,results,
checkpoint}.json`, `full-tests-final.log`, `type-check.log`, task RED/GREEN logs,
sources and `qa/{generate-m1.mjs,check-m1-package.py}`. Frozen current checkpoint
contains93 files; SHA256:
`1f88d97b28bbc8d303cb74a739abf80321fe43b369df64d6d4fec8c33abb5677`.

### Pending acceptance and stop

Await owner exports in the same output folder. Then inspect every page and
compare row/baseline/border-centre/outer-edge/after-table landmarks, content,
wrapping, repeated headers, headings/icons and inheritance/flow against the
frozen references. R2 matched table comparisons are relative geometry because
the new matrix changes surrounding titles/positions. New flowing/header
matrices are regression inputs without a corresponding full Core reference;
do not claim full pixel parity for them. H1/H2 retain exact source references.

Word repair prompts, ink clipping, overlap, page boundaries, accumulated drift
and visual parity remain unverified; `wordVerified` stays false. General font
support/baseline matching is outside this checkpoint. R5's−0.05pt remains an
explicit bounded residual. No universal0.12pt tolerance/compensation is added.
No re-review dispatch is required after the covered RED→GREEN boundary fix.
SRS, original PDF/source/runtime, Core/Service/plugin product repositories,
API/default format, release/install remain untouched. Stop at Word handoff;
do not promote M1/U5 acceptance before receiving and examining the exports.

Project Control handoff checks: `check:data` exits0; seven local fragments
resolve; final diff/whitespace review is restricted to this existing plan.
No canonical data/projection generation or product map update is required.

## M1 bounded Word geometry and flow verification

**2026-10-21 — PASS_BOUNDED_WORD_GEOMETRY_AND_FLOW_FULL_PARITY_OPEN.** Owner
returned all four requested Word PDFs. This is verification of the frozen M1
candidate, not a converter-repair stage or generic DOCX acceptance. Role:
Evidence Reviewer / Documentation Synthesizer; Core owns eventual implementation,
Project Control owns this bounded status. Single room, medium size, routine
risk; Work/Phase/Checklist/execution IDs N/A. No new experiment/Word export was
requested. Proof budget: the four returned files, their frozen references,
all-page renders, geometry/flow checks and this existing canonical plan.

Current root remains
`C:/Users/nekot/Documents/Codex/2026-10-21/docx-srs-9130/unified-docx-writer-m1/`.
Reports/images are new verification outputs under `word-review/`, with the
read-only review script `qa/review-m1-word.py` and `evidence/word-render.log`.
No candidate source, fixture, prior report, PDF reference or product file was
modified. All93 M1 checkpoint entries,91 H3 entries and38 R2 reference entries
were rechecked unchanged. R2 manifest paths are relative to H3, not its nested
R2 folder. Prior130/130 tests/type-check are reused against those unchanged
inputs; no repeated product test suite or package regeneration was needed.

### Received files and visual coverage

| Returned PDF in `outputs/` | Pages | SHA256 |
| --- | --- | --- |
| `01-border-flow-two-fonts.pdf` |10| `d93ee632a0e3ec272fd3b2adc4a6d49eb000a484e008d7c199eff80bf77d5d15` |
| `02-empty-header-matrix.pdf` |9| `afa1c06a6cc7cc2087fc4e981784490b89b23044bd23d204cc367fc9a2304cf6` |
| `03-h1-regression.pdf` |6| `9b5fce515b3e7e0153b16028a6bba50293fe55840ab1f3fff9d456ed06b0d07f` |
| `04-h2-regression.pdf` |6| `8626ab52c4d4230abffdf77bee38074de5324437dccc054f009c92c8e0b4418c` |

PDF metadata identifies Microsoft Word for Microsoft365; it does not identify
the exact build. All31 complete pages were rendered120dpi and inspected through
11 complete-page contact sheets. Four candidate pages were additionally viewed
at full render size: Sarabun natural wrapping, Bai Jamjuree emphasis/continuation,
first-only visible header and H2 repeated-header table. Core R2 natural-wrap
reference pages3/6 were also viewed directly. No clipping, overlap or missing
glyph was observed in these bounded samples. The owner reported completion
without reporting repair; absence of a repair prompt was not independently
instrumented and is not newly certified.

### Border-area rule and remaining text differences

For each font, three matched tables preserve the original R2 B-table text,
widths, source4pt padding and nominal0.5pt borders. Compare relative row/baseline
geometry because surrounding titles/positions differ from R2. Native generation
now applies the mapping directly; these files were not patched after packing.

| Shape, both fonts | Core mean baseline pitch pt | M1 mean pitch pt | Difference pt |
| --- | --- | --- | --- |
| Single line |27.84|27.85|+0.01|
| Authored three lines |67.52|67.57|+0.05|
| Natural four lines |87.36|87.43|+0.07|

Individual row-height differences range from approximately0 to+0.15pt. The new
maximum0.15pt is explicitly above the old observed0.14pt maximum; neither number
is a universal tolerance. In the natural-wrap case, first-marker-normalized
movement versus the old mapped Word probe is exactly0/0/+0.12pt for both fonts.
The prior intervals87.38/87.36 become87.38/87.48, explaining the0.06pt increase
in the mean of two intervals. This is consistent with the bounded R6 coordinate
step response; it does not establish a universal rounding stage or license a
fixed compensation/threshold expansion. All18 measured markers independently
match raw PDF `Tm` operands.

All18 right-cell line groups (one per source row) remain identical to the prior R2 mapped Word
sample. This proves no new wrapping change in those comparisons, not equality
to Core: Sarabun still breaks the English words differently from Core within
its four-line sample. Bai Jamjuree's visible boundaries match this sample.
Raw Thai extraction contains shaping/Unicode ordering differences; those are
not silently classified as content loss or normalized into exact-match proof.

The marker baseline remains lower than Core by **2.722–3.075pt**. No general
baseline adaptation was implemented; AtLeast/complex-script/emphasis behavior
is retained. Row-extent improvement must not be reported as baseline parity.
R5's−0.05pt residual also remains outside this correction's claims.

### Empty headers and automatic flow

- H1 remains six pages. Pages2–6 are pixel-identical to frozen H3 at120dpi;
  only cover-page content moves upward1.08pt, consistent with removing its
  empty-header footprint. All per-page extracted line strings remain identical.
  Five PDF links and the external URI remain. Source `startAt:7` intentionally
  yields the retained7/8 labels; it is not a new physical-page numbering defect.
- The nine-page header matrix shows its three header lines on pages2/3/5/8
  only, exactly matching effective all/first/continuation modes. The following
  wholly empty section does not inherit the prior visible header. Cover and
  wholly empty Sarabun sections share baseline53.28pt. Mixed hidden headers
  deliberately retain H3 distance; a matched Sarabun mixed-hidden page starts
  at54.24pt, retaining approximately0.96pt footprint. That case is disclosed,
  not described as recovered space. The last blank page is explicitly authored.
- Each new two-font flowing table preserves F01–F18 once, split10/8 across two
  pages; its header repeats once on each page. Bold/italic/regular examples and
  both following text/icon pairs remain visibly intact. These are regression
  samples without full corresponding Core PDFs, not proof of generic flow parity.
- H2 remains six pages; pages1–4 are pixel-identical to H3. Its columns-header
  table keeps the same T01–T24 / T25–T40 page ranges and repeated headings.
  Mean pitch changes28.3546→27.8537pt and28.3553→27.8513pt on the two pages,
  removing approximately0.50pt per row. Later baselines rise progressively by
  up to12.24/8.28pt as expected from the smaller row extents; this is intended
  cumulative correction, not unexplained drift. Header/footer content and
  per-page line strings remain. H1's final blank page is also explicitly authored.

### Evidence and return boundary

New evidence is `word-review/{pdf-geometry,measurements,flow-and-raw-checks,
residual-analysis,preservation,results,checkpoint}.json`, all rendered pages,
and reproduction scripts. Its checkpoint contains69 files including the four
returned PDFs; SHA256:
`7e842316140fa4d6110c14e683204e5242336437e7811fa2f90beccf8def8ede`.
The original93-file candidate checkpoint remains immutable and separate.

The two implemented mapping rules now have bounded Word geometry/flow evidence.
Full M1/U5 layout parity, arbitrary fonts/languages, general text-origin matching,
mixed-header space recovery and any broader tolerance remain unaccepted/open.
No new universal threshold is adopted to label0.15pt an exact match. Stop and
return this result before another experiment; recommend a separately bounded
baseline/leading feasibility decision next. No automatic SRS, PDF reference/
runtime, product repository, API/default-format, dependency, install or release
change is authorized or performed. No map/data/projection promotion is needed.

Coverage limit: this batch does not provide a newly matched Core following-
paragraph landmark after a table. The preserved table separator/icon cases
and R5 evidence do not establish generic after-table paragraph parity; that
claim remains open rather than prompting another unrequested probe.

Project Control verification: `check:data` exits0, all seven local fragments
resolve, final diff/whitespace inspection passes, and both M1 manifests
(93 candidate /69 Word-review entries) pass identity checks. Only this existing
canonical plan changes in Git; no projection generation is required.

## Core and Service integration repair plan

**2026-10-22 — PLAN_ONLY_FOR_OWNER_REVIEW; IMPLEMENTATION_NOT_STARTED.**
The owner requests an ordered repair/verification plan in isolated Core and
Service checkouts, with additional inspection before proceeding. This request
does not authorize product edits, worktree creation, installation, SRS testing,
or commits/integration into `release`. This section is the proposed next-work
authority; earlier experiment checkpoints remain historical evidence.

**Goal:** use the real Core composition/resource contracts to generate PDF or
DOCX, then deliver the requested artifact through both `/documents` modes;
absent `Output-Format` preserves PDF. Integration proof precedes further layout
tuning and the98-page SRS trial.

**Architecture:** one Core composition result and pinned resources feed separate
PDF and DOCX writers. Core owns validation, capability mapping, native writing
and byte receipts; Service owns admission/immutable format pins, resource
preparation, process limits, staged publication, storage and transport. Service
imports only a built candidate Core package root. The standalone M1 package is
immutable input/evidence, not the future runtime or a dependency of Service.

**Spec:** owner agreements and API contract earlier in this file, bounded M1
rules/limits, plus the proposed integration decisions below. Changes beyond
these decisions return for review; no source repair is implied by planning.
Terminology: `outputFormat` is separate from a template `format`; artifact
receipts are distinguished from PDF page receipts. Reusing `PdfImageProvider`
for prepared-image bytes is context-only reuse of an existing contract, not
reuse of PDF layout or a second source-data model.

**Authority and budgets:** Project Control owns this shared plan; Core and
Service own their respective files. Role: Planning Partner / Cross-Repo Boundary
Reviewer; planning medium size, implementation split into independently checked
slices below; routine risk with concrete PDF-regression and immutable-task risks.
Single-room planning, Work/Phase/Checklist/execution IDs N/A. Document Budget:
this existing plan only, local machine-readable test evidence during future
execution, no new shared Markdown in product repositories. Future execution
method is proposed inline with two isolated checkouts; no separate room is
created here. Before execution, resolve its compact model decision against a
fresh host availability snapshot; current planning does not claim a model switch.
Proposed WORK capability is gpt-6-astra/medium for the cross-owner contract,
resource and immutable-SQL boundaries. The next smaller gpt-6-sol/medium is
sufficient for mechanical import fixes but is not selected for responsibility
for the combined contract review. An unavailable model or newly required
architecture decision returns for review rather than fabricated availability.
Stop after each slice's mandatory acceptance, not after an output file merely
exists. Failed prerequisite blocks dependants. Additional checks are required
for changed/affected boundaries and actual failures; no endless pixel-offset
search or broad unrelated proof is budgeted.

### Inputs, isolation and fixed boundaries

Read-only audit:
`C:/Users/nekot/Documents/Codex/2026-10-21/docx-srs-9130/core-compat-audit-2026-10-21/report.json`.
It establishes identical Core0.4.7 archives in M1 and Service (SHA256
`13673f22cca9667e88125dd4631b0b398c912b8e96c6734a2932b5ff27f3a8ad`),
172 unchanged installed archive entries, three passing small public-composition
to standalone-writer probes, and the real integration gaps. Those probes do
not prove a packaged Core DOCX entry, schema2/model19 task integration or Linux
Service delivery. TypeScript6 itself passed the prototype's old configuration;
87+58 are compiler diagnostics, not145 independently established runtime bugs.

Pinned proposed bases, refreshed before implementation:

| Owner | Base HEAD | Protected local release ref |
| --- | --- | --- |
| Core | `8f8a739aea5597b6d8c9932c790f9bd716e8ebc7` | `ad91e1888835c0ebc31d03c0ef9593d0bd735233` |
| Service | `32d78570b5c2dc8940efd3452bf5d4dffc55c081` | `ca66f605b02a41d1bc3b05894fbc75f5224d4900` |

After execution approval, reuse suitable active worktrees if ownership/scope
matches; otherwise create two owner-repository worktrees, never standalone
copies masquerading as integration. Proposed new branches are
`codex/docx-core-integration` and `codex/docx-service-integration`, under
`C:/Users/nekot/Documents/Codex/2026-10-22/docx-core-service-integration/{core,service}/`.
Confirm unused paths and exact bases; preserve unrelated work. Record HEAD,
actual changed files, dependency/resource hashes and protected refs at each
checkpoint. A base change requires impact review, not silent rebasing.

Global constraints:

- Keep Node `>=24.15.0 <25`, Core/Service TypeScript6.0.3 and existing strict
  flags. Do not disable `noUncheckedIndexedAccess`/`exactOptionalPropertyTypes`,
  upgrade TypeScript merely to hide failures, or add blanket casts/suppressions.
  Commands below use the bundled runtime resolved at execution and the isolated
  Linux/DB environment where required; a system/global runtime is not a substitute.
- Port imports to Core's `.js` emitted-module convention and use Core-local
  types internally. No Core self-import against stale installed declarations.
- Use `docx@9.13.0`, `pngjs@7.0.0` and directly declared `jszip@3.10.2` where
  retained; regenerate a real exact lock in the isolated owner checkout.
  Do not depend on M1's junction, a global install or transitive hoisting.
- Core PDF writer/layout source, original PDFs, M1/H3/R1–R6 evidence and resource
  bytes remain unchanged. Shared resource changes require PDF-impact evidence.
- No production DB/storage, installed service, release-version bump/tag/push,
  merge into main/release or deployment. Future passing development commits
  belong only to approved `codex/` branches. Planning permits none of those
  product commits. Do not overwrite the existing release tarball or manifest.
- `/jobs`, authoring previews/font-review PDFs and their legacy `.pdf` storage
  remain PDF-specific. This round adds formats to `/documents` and its queue
  path. Its task-file store already uses `.bin`; changing legacy `pdf-files.ts`
  wholesale is unnecessary. Preserve consumers of shared tables/helpers.
- Unsupported DOCX capabilities fail explicitly before publication; never
  silently drop content, fall back to PDF or fabricate page counts. Full
  baseline matching/arbitrary-font support remains outside this repair.

### Proposed interfaces and invariants

Core creates `src/docx/{types,resources,engine}.ts` and private writer modules;
its existing PDF API stays unchanged. Proposed public contracts:

```ts
type PreparedImageProvider = PdfImageProvider; // same verified prepared-byte contract
type DocxResources = Pick<ExportResources, 'fonts'>;
interface DocxOptions { signal?: AbortSignal; maxBytes?: number }
interface DocxOutput {
  write(bytes: Uint8Array): Promise<void>;
  abort(reasonCode: string): Promise<void>;
}
interface DocxArtifact {
  mediaType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  byteLength: number; sha256: string; pageCount: null;
  fieldRefresh: 'required'; wordVerified: false; buffered: true;
  adaptations: readonly unknown[];
}
interface DocxEngine {
  generateDocxTo(document: ResolvedDocument, images: PreparedImageProvider,
    output: DocxOutput, options?: DocxOptions): Promise<Result<DocxArtifact>>;
}
function createDocxEngine(resources: DocxResources): Promise<Result<DocxEngine>>;
```

Only `createDocxEngine` is a new runtime package-root export; associated types
are exported there. No `ResourceSnapshot` requiring a caller to assert embedding
permission becomes the product API. Core verifies pinned font/license bytes,
existing face selection and TTF embedding restrictions; bundled fonts already
carry the hashed OFL resource through `loadResources.ts`. Library font readiness
and renderer identities must remain valid, not be bypassed for a candidate hash.
Use existing `validateResolvedDocument` inside Core, then DOCX-specific checks;
remove duplicated general-model validation from the port after equivalent
coverage exists. Keep source identity, explicit false emphasis, complex script,
line breaks, spans, source maps and unsupported-capability diagnostics.

Service reuses its current prepared `jpeg` or `rgb-deflate` images. Core's DOCX
adapter verifies refs/hashes, passes JPEG bytes to a native JPEG run, and converts
verified RGB/alpha planes to PNG internally. It preserves resource IDs, pixels,
frame geometry and alpha. Do not create a second Service decoder/orientation/
resize policy or send raw RGB as if it were PNG. Internal encoding has bounded
buffers and aggregate resource accounting. Reuse the verified-stream helpers;
keep their PDF behavior unchanged. Initial DOCX bounds remain32MiB output,
16MiB aggregate snapshot resources,4million pixels/image and existing M1 node/
package limits. Exceeding a bound returns an explicit error; never quietly raise
it to pass a sample. Buffered packing is disclosed and is not advertised as
PDF-like constant-memory streaming. Check cancellation before/after packing;
Service process-group termination covers uninterruptible packing.

Core writes only staged output in chunks at most65536bytes; it does not publish
or own Service's final commit. On failure/abort it aborts staging. Service seals
and verifies bytes/SHA256 before making an artifact available, then sends the
stored file. Its internal result is discriminated by `outputFormat`:
PDF requires positive actual `pageCount`; DOCX requires `pageCount:null` and the
DOCX MIME/filename. No copied PDF count, cached DOCX property or `0` surrogate.
Snapshot the validated document and resource identities before asynchronous
work; later caller mutation cannot change bytes, selected fonts or receipts.

Service creates `src/tasks/output-format.ts`:
`readOutputFormat(rawHeaders:readonly string[]):{format:'pdf'|'docx';provided:boolean}`.
It implements the existing API table exactly, including duplicate raw-header
rejection before task allocation. JSON lookup rejects a supplied format header
with `TASK_REQUEST_CONFLICT`; absent header reads the stored format and never
defaults an existing DOCX task to PDF.

New tasks use a Service-owned normalized envelope version2 containing
`outputFormat`, the pinned Core identity and the unchanged Core normalized
`input`. New task job/request receipts use `flowdoc-task-job/2` and
`flowdoc-task-request/2`, including the same immutable format. Both PDF and DOCX
use this path; the format does not enter template/data/section semantics.
Existing version1 task/job records remain immutable and mean PDF. A worker
checks task/job/envelope/Core pins agree before rendering. Never rewrite an old
normalized file, original input or prepared input during migration. An old job
with a different renderer hash is not silently repinned/retried under the new
package; production queue-upgrade strategy remains a separate release decision.

New forward-only Service migration (proposed next file
`025_document_output_formats.sql`, recheck numbering at execution) adds immutable
`output_format DEFAULT 'pdf'` to tasks, generation jobs and document outputs.
Replace the existing PDF-only media-type check with coherent format/MIME/page
rules. Historical PDF outputs may retain nullable page counts; newly completed
task PDFs still require real positive counts at the worker boundary. DOCX counts
must be null. Extend `protect_job_input` to validate version1 PDF or version2
format pins without relaxing legacy non-task job guards. Existing migration
files/checksums are never edited. Freeze format in admission, normalization,
job creation, worker IPC, storage, lookup and multipart delivery.

### Ordered repair slices and required proof

Every implementation slice follows failing test → confirm intended failure →
minimal owner change → passing targeted checks → changed/affected regression →
review actual diff and evidence. No slice may claim its dependants passed.

#### I0 — establish the real owner bases and comparison inputs

Files: future isolated checkout metadata and local evidence only; no product
behavior yet. I0 is discovery/verification only; source repairs belong to later
authorized slices. Recheck base commits, protected refs, current owner guides,
artifact/dependency identities and audit manifests. Freeze M1 sources and four
Word outputs as references. Select small existing Core fixtures for
`validateTemplate → prepareGeneration → composeDocument`, plus schema2/model19
`normalizeTaskInput → composeTaskDocument`. Include two licensed font families,
plain/merged tables, JPEG/RGB-alpha images, groups and page fields. No98-page SRS.

- [ ] Run Core baseline `npm run build` / `npm test` in the prepared isolated
  Linux environment, and the relevant Service baseline build/tests with a
  uniquely named isolated DB/storage. Save environment and actual results.
- [ ] Freeze default-PDF output from the unchanged released package and exact
  fixture/resource hashes. Test deterministic output once; if bytes differ,
  locate nondeterministic metadata before selecting a narrowly defined comparison.
- [ ] Map each audit gap to I1–I6 and each source fixture to a capability/error
  expectation. Record candidate package SHA implications for font readiness.
- [ ] Read the existing frozen Core-composed SRS JSON by its recorded identity
  only to inventory required node/format/font/resource capabilities. Count and
  locate unsupported constructs; do not generate or open a new SRS artifact.
  If a required construct is outside the proposed profile, resolve that scope
  before I1 rather than discovering it after the whole integration is built.

Expected: clean known bases, reproducible inputs and attributed baseline failures.
A missing runtime/DB fixture or unresolved baseline defect blocks only affected
dependants; skipped mandatory checks cannot become PASS. **Stop I0 if these
identities cannot be established.** A target-required capability gap is a
blocking design finding; do not silently narrow the SRS criteria or repair the
source document to hide it. Baseline builds/tests write only to designated
scratch outputs or exact baseline scratch copies, preserving candidate inputs.

#### I1 — make the writer a buildable Core component

Files: Core `src/docx/` port of M1 writer/types/profile/groups/text/images/
tables/sections/fields/bands/geometry modules; `src/index.ts`, `package.json`,
`package-lock.json`, `tests/docx/{port,capabilities}.test.ts`,
`tests/packageContract.test.ts`. Do not copy M1's tests/configuration wholesale
and count130 as Core tests. Migrate useful cases to the existing Vitest suite.

- [x] Add tests importing the proposed package-root API and asserting exact
  source preservation, supported small text/table output and explicit unsupported
  fixed-text/fixed-format rejection. Confirm missing API fails first.
- [x] Port `.ts` imports, use real Core types, retain strict flags and implement
  the entry with existing Core validation plus DOCX-specific capability checks.
  Resolve undefined-index/optional-field invariants instead of suppressing them.
  Directly declare used runtime dependencies and a pinned lock.
- [x] Run `npm run build`,
  `npm test -- tests/docx/port.test.ts tests/docx/capabilities.test.ts tests/packageContract.test.ts`.
  Expected exit0, intended export list, emitted `.js` modules and declarations,
  no prototype/global dependency or accidental Core self-dependency.

Acceptance: zero compiler diagnostics under actual Core configuration. A
working standalone invocation does not close I1. **Do not start Service edits
while this build prerequisite fails.**

#### I2 — implement the Core resource/output bridge without layout retuning

Files: Core `src/docx/{resources,images,engine,types}.ts`, private port modules;
tests `tests/docx/{resources,writer,geometry}.test.ts`. Existing font selection/
validation and prepared-stream helpers are consumed; modify shared code only
for a demonstrated required extraction with dedicated PDF regressions.

- [x] Failing tests: real Core bundled/library resources are accepted without
  fabricated release IDs; wrong font/license/image hashes and prohibited
  embedding fail before publication; JPEG and RGB/alpha become valid native
  images preserving prepared pixels and frame identity.
  Oversized byte/pixel metadata must fail before opening/decompressing streams,
  not after an unbounded allocation. Invalid maxBytes/options cannot loosen caps.
- [x] Assert whole-grid exact authored4pt→75twips rule, near4pt/mm/default cases,
  mixed-header fallback/zero-only-when-both-empty, CS/emphasis-off and unchanged
  source. Assert no general baseline offset or forced Exact spacing is added.
- [x] Adapt output to `byteLength`/SHA256/null-page receipt and staged
  write/abort lifecycle. Test chunk ceiling65536, cancellation, sink failure,
  corrupt/truncated resources, caller mutation during async work and each
  declared byte/pixel/node cap.
- [x] Run `npm run build` and
  `npm test -- tests/docx/resources.test.ts tests/docx/writer.test.ts tests/docx/geometry.test.ts`.
  Expected exit0; compare canonical XML/text/font hashes with frozen M1 after
  excluding only identified package timestamps/random relationship identities.

Acceptance: actual Core composition results feed both writers from the same
frozen source object/resources. JSON fixtures alone cannot replace composition
proof. Record unsupported semantics as explicit failures, not missing content.

#### I3 — prove the packed Core artifact on Linux before Service consumes it

Files: Core `scripts/checkPackedConsumer.mjs`, `Dockerfile.consumer`,
`tests/consumer/{package.json,checkDocx.mjs}` and lock generation; package exports/
files checks. Keep all existing PDF consumer checks. The consumer script's
current no-runtime-dependency lock assumption must be replaced with a real
resolved graph for the candidate archive and pinned runtime dependencies.

- [x] Add failing isolated consumer checks that import only `@flowdoc/core`,
  compose schema1/model18 and schema2/model19 inputs, load bundled/library
  fonts and prepared JPEG/alpha images, then write DOCX and PDF.
- [x] Build/install the candidate in a clean Linux/amd64 consumer with no M1
  junction, source-tree imports, globally supplied docx or install-time builds.
  Permit dependency acquisition only during isolated image preparation; run
  the consumer with network disabled. Keep exact archive/lock/image identities.
- [x] Run `npm test` and `npm run check:package` in that isolated environment.
  Expected all required tests/consumer results PASS; exercise cancellation and
  caps, and verify PDF bytes or the I0 justified comparison remain unchanged.

Produce a uniquely named candidate tarball/hash; never overwrite
`flowdoc-core-0.4.7-release.tgz`. New Core hash may invalidate Service font
readiness reviews: revalidate in the isolated normal workflow, never manually
mark a stale font review approved. **No passing packed artifact means no I4.**

#### I4 — persist and protect format selection in Service

Files: Service `src/tasks/output-format.ts`, `src/http/documents.ts`,
`src/tasks/{intake,repository,normalize,processing}.ts`, the new migration;
tests `tests/{output-format,output-format-migration}.test.mjs` and affected
`task-{api,intake,normalization,queue-api,queue-intake}.test.mjs`.

- [ ] Failing header tests: absent→PDF; PDF/DOCX/mixed case/edge whitespace;
  reject blank, unknown, comma-list and duplicate headers even if equal before
  durable allocation. Preserve authentication, authorization and accept checks.
- [ ] Add isolated-DB migration tests for old PDF records/unchanged normalized
  digests, forward schema checks, immutable format, coherent output MIME/page
  counts, version1 compatibility and version2 task/job/envelope agreement.
- [ ] Implement new-task version2 envelope/receipts and checks in one path for
  both formats. Add tampering/restart tests and lookup-header conflict tests.
  Legacy `/jobs` and preview behavior remain intact.
- [ ] Run `npm run build` and targeted Service Vitest files above. Expected
  exit0 with actual DB assertions, not mocked queries or skipped DB suites.

Acceptance: task format is frozen once; every later boundary can prove its
identity. No changes to old migrations or old immutable records. Stop on any
weakening of existing task ownership/input guards.

#### I5 — connect the candidate Core package and generic task artifacts

Files: Service `vendor/flowdoc-core-docx-candidate.tgz`, isolated candidate
manifest, package/lock pin and vendor-identity reader as required; new
`src/tasks/artifact.ts`, `src/tasks/{render-child,render,processing,wire,public,
output-buffer,policy}.ts`. Tests `tests/{task-docx-processing,task-docx-wire,
task-output-format-lifecycle}.test.mjs` and existing task processing/wire/buffer
regressions. No source-path import from the Core worktree.

- [ ] Failing tests: DOCX delivered as DOCX with verified bytes/hash and null
  page count; PDF still uses real positive count, original MIME/filename and
  existing multipart behavior. Wrong format/MIME/receipt combinations fail.
- [ ] Call only the packed Core `createDocxEngine` for DOCX and existing PDF
  engine for PDF. Use the same composed source and current prepared image
  providers; no second resize/orientation route. Add a trusted32MiB DOCX output
  bound to the frozen policy without changing PDF limits/queue mode detection.
- [ ] Let Service staging/sealing own publication. Preserve65536byte IPC,
  quotas/backpressure, hash validation, process-group abort and cleanup; do not
  represent the internally buffered DOCX writer as constant-memory streaming.
- [ ] Keep old PDF public errors; map DOCX unsupported/failed cases safely with
  no file paths leaked. Async failures use the existing multipart error/task
  terminal contract; they do not fall back to a PDF artifact.
- [ ] Run Service build and named lifecycle/processing/wire/buffer tests against
  the isolated DB/storage and packed artifact. Expected exit0; no artifact is
  available after cancellation, worker death, disk-full, hash mismatch or a
  partial send. Quota/retention/TTL cleanup and lookup retain the frozen format.

Acceptance: both `/documents` modes use the actual candidate package through
the real parent/child/stored-artifact route. A direct Core call is not I5 proof.
If package pinning causes stale font readiness, resolve it through the existing
isolated readiness APIs before claiming generation passed.

#### I6 — end-to-end acceptance, PDF regression and Word checkpoint

Files: Service `tests/task-docx-api.test.mjs`, affected task queue/client tests;
small template/request fixtures in existing Core/Service fixture folders,
code-adjacent owner README/usage docs with Authority Boundary where required;
local results/coverage manifests. No plugin implementation or SRS expansion.

- [ ] Submit paired raw multipart requests to the real candidate service:
  no format header, explicit PDF and DOCX, both normal and queue-v1. Cover two
  font families/four faces, JPEG/alpha, multiline/mixed Thai-English, merged
  tables, repeated headers, heading/icon groups, visible/empty/mixed headers,
  TOC/page fields and explicit unsupported capabilities.
- [ ] Compare the no-header and explicit-PDF outcomes to I0 and retain old
  PDF/queue/authoring client regressions. For paired Service jobs, check exact
  business input/template/resource hashes and account individually for generated
  per-task resource IDs; never normalize away content/layout differences.
  The Core consumer additionally proves literal same-document-object branching.
- [ ] Run `npm run build`, complete Service `npm test` with isolated DB/env,
  and affected API/container checks. Run `npm run check:api` with candidate-only
  addresses/credentials and required scratch fixtures; if its helper cannot
  isolate state, run its equivalent requests in the isolated integration harness
  and record why. Required assertions may not be replaced with skipped tests.
- [ ] Final Word budget: at most four small DOCX files, two from packed Core and
  two from Service, selected for complementary coverage rather than duplicates.
  Request owner PDF conversion only after concrete paths/packages pass checks.
  Inspect every output page and structured content; compare frozen M1 behavior
  and paired unchanged PDF references. No baseline/pixel tuning in this slice.
- [ ] Verify cold-start/restart, wrong pins and hash tampering, disconnect during
  intake/render/send, expiry/TTL and failed cleanup retry. Capture peak worker/
  parent RSS under the bounded DOCX trial separately from file bytes; stop on
  actual Service memory limits. Smaller serialized files do not prove less RAM.

Acceptance: criterion-to-evidence coverage includes compiler, packed consumer,
real DB/process/transport, PDF compatibility and all-page Word review. Partial
PASS or an owner-accepted visual limitation does not waive mandatory integration
prerequisites. One bounded repair/recheck pass is allowed for actual failures;
an architectural/contract expansion returns for review rather than another
unbounded experiment. Freeze candidate identities after passing; subsequent
repairs invalidate affected proof and must be retested.

#### I7 — review result and decide whether to authorize SRS

Review actual diffs and coverage in both owner checkouts. Separate PASS / FAIL /
BLOCKER / RISK / UNKNOWN; list intentionally unsupported semantics and retained
M1 text-origin/wrapping limits. When the chosen execution skill requires a fresh
reviewer, budget one whole-change read-only review, not one agent per probe.
No automatic SRS run or release integration follows a passing I6.

Return a recommendation only: either identify a concrete remaining blocker,
or propose the existing98-page SRS as the next compatibility trial through the
real Core/Service path. Reconcile the I0 read-only SRS capability inventory
against the final supported profile before its generation; it is not first
deferred until this last slice.
Production queue upgrades, old pinned-worker draining, release versioning,
tagging/pushing, plugin DOCX support and deployment remain separate decisions.

### Review Focus and planning self-review

Five failure classes assigned to explicit tests above:

1. Omitted/duplicate format headers and stale version1 jobs: I4 parsing,
   migration/restart and mismatch tests; old PDF records remain immutable.
2. Source formats valid in Core but unsupported by DOCX: I1 capability failures,
   I2 source preservation and I6 no-silent-fallback cases.
3. JPEG versus RGB/alpha and font/license hash/readiness mismatch: I2 provider
   tests, I3 clean consumer and I5 real resource snapshot tests.
4. Buffered packing, cancellation,64KiB acknowledgements and cleanup under caps:
   I2 sink tests, I5 lifecycle checks and I6 measured process/resource failures.
5. Legacy PDF consumers, page counts and database format/MIME inconsistencies:
   I4 SQL constraints, I5 discriminated receipts and I6 full PDF/API regression.

Self-review: each audit gap has an owning slice and a mandatory proof; producers
and consumers use the same Core artifact and format/receipt types. The shared
composition, image preparation and immutable task pins are inspected beyond
the original compiler audit. No step depends on a package merely being present,
on old130 tests being relabeled Core tests, or on a generated Word file alone.
Unknowns about packed Linux integration, schema2/model19 and Service lifecycle
are blocking at I3/I5/I6, not presumed solved by the three small audit probes.
General baseline matching/remaining visual differences are deferred and cannot
silently expand this integration repair. Document volume is one existing plan;
no separate room, implementation or dependency change is performed now.

Planning verification (2026-10-22): Project Control `tools/check.ts` and
`git diff --check` passed. The only changed file is this existing plan.
Core and Service working trees are clean; their HEAD and protected local
`release` refs still match the pinned values above. No product compilation,
package installation, integration test or Word conversion was run in this
planning checkpoint; those remain explicit future acceptance requirements.

## I0 real-owner baseline and source inventory checkpoint

2026-10-22 — **PARTIAL_BASELINE_SERVICE_NOT_PASS; I1_NOT_STARTED.**
Owner authorized only the first step. Role: Evidence Reviewer / Cross-Repo
Boundary Reviewer / Documentation Synthesizer. Single-room discovery and
verification, execution IDs N/A, routine risk. Scope: exact owner-source scratch
copies, frozen inputs, isolated Linux/DB tests and this existing status record.
No product source, release ref, original PDF or SRS input was changed.

Evidence root:
`C:/Users/nekot/Documents/Codex/2026-10-22/docx-integration-i0/`;
machine-readable result `report.json`, original attempts retained in logs.
These new results are distinct from the historical compatibility audit.

### Inputs and isolation actually used

- The pinned Core and Service HEAD/release values above were rechecked; their
  `src`, package metadata and tsconfig still match local release content.
  Both owner working trees remained clean. `owner-identities.json` binds exact
  `git archive HEAD` scratch copies and lockfile hashes. No feature worktree,
  product commit or dependency update was made.
- Tests installed each owner's exact lockfile into disposable container scratch
  directories, then built the unchanged source. Linux runtime image:
  `sha256:cea4f320f199914fbb56387f172244b1b2f41c499d072d2b4a2b631a67213261`;
  Node24.21.0, TypeScript6.0.3, Vitest4.1.9. The Core native/font resources came
  from the unchanged released tarball whose SHA is recorded above.
- PostgreSQL18.6 image
  `sha256:2e182ed2ff8f5d0835353864264437a26dffc542a9a6c677ec495aa54e491627`
  ran in a newly named DB/container/network with tmpfs storage. Existing user
  containers/databases were not started or reused. The test DB and network were
  removed after results were retained. Core/M1 and Word checkpoints preserved
  all93/69 files; all15 original audit files also match their saved hashes.
- Current Truth Snapshot was rebuilt read-only from validated canonical sources;
  its unrelated frontend roadmap provides no DOCX execution authority. The
  current explicit request and this plan govern I0. No model override or agent
  dispatch was made; the available host model metadata was already provided in
  session context, and this bounded discovery remained in the current session.

### Actual results and attribution

| Criterion | Result and retained evidence |
| --- | --- |
| Core baseline build | PASS, `core-build.log` |
| Core baseline tests | PASS,87 files/878 tests, `core-tests.log` |
| Service baseline build | PASS, `service-build.log` |
| Relevant Service baseline tests | NOT PASS:10 files,7 passed/3 failed;111 passed/16 failed tests, `service-tests.log` |
| Small unchanged PDF references | PASS: binding text and table each generated twice, including a delay; bytes/SHA identical, source object unchanged; `pdf-baseline.json` and saved PDF pairs |
| Frozen source/resources | PASS for checked identities; `preservation.json`, `fonts.json`, `srs-font-package-identity.json`, `srs-capabilities.json` |
| Audit gaps mapped to owner slices | `audit-gap-routing.json`; package SHA change still requires font readiness revalidation through the normal isolated path |

Core's first run lacked the explicit old native-helper fixture. Supplying the
real Core0.4.0 helper in scratch closed that harness failure; no test/source was
edited. Service's initial invalid DB mount, missing fixed1GiB cgroup, stale image
plugin and absent legacy-plugin path were identified and corrected in scratch.
The last run used a1GiB limit, current FlowDocMake source mounted read-only and
the image's historical plugin at the legacy path. Its result still failed.
No observed OOM/OOM-kill explains the final run.

The last run includes four processing timeout failures (disconnect during send,
transport finish rejection, processing deadline and changed normalized bytes),
real API timeouts/disconnect observation failure, and subsequent
`Processor already active` advisory-lock failures. Those are not sixteen
independently proven product bugs. Earlier harness attempts and their differing
results are retained; remaining source-versus-harness causality is **UNKNOWN**.
No source, timeout constant or assertion was repaired to obtain PASS.

### Read-only SRS capability inventory

Frozen `inputs/resolved.json` matched SHA
`920976069d27da172193fb253e1c3b313299327a6f7994755fb2b927bfdfa301`:
schema1/model18,7 sections,5658 nodes including bands,200 tables,197 merged cells,
377 image placements,13 unique image resources, one TOC and12 page-field inlines.
No missing image/hash mismatch, nonempty fixed text frame, fixed format budget
or unknown node/inline family was identified by this inventory. This is not a
claim of complete DOCX geometry/glyph support or native Word acceptance.

SRS fonts match the released Core faces. The two retained small-fixture families
are Sarabun and Bai Jamjuree,8 faces total; font/license hashes match and every
checked OS/2 fsType is0. Fixture identities and the actual schema2/model19 test
and example locators are in `fixtures.json` and `task-font-fixtures.json`.

One original PNG is2048x2048 (4194304 pixels), above M1's4000000-pixel cap.
Its authored frame becomes33x33 at Service's existing200dpi image preparation;
the largest conservative frame bound across SRS placements is317568 pixels.
Thus an original-image-size rejection would be the wrong boundary for the
Service path. Preserve its shared preparation and check the prepared provider
bytes/dimensions in I2/I5; no resizing or fresh SRS generation was done here.
Retain the Core-only behavior as an explicit resource contract, not a hidden
second resizing pipeline. Service can prepare up to8000000 pixels while the
proposed DOCX cap is4000000: exceeding the DOCX cap must fail explicitly, and
that narrower supported limit must remain visible to consumers.

### Exit decision

I0 is not an overall PASS. Core source/build prerequisites and reproducible
small PDF references are established. The Service lifecycle/API/queue baseline
is unresolved and blocks those dependent integration claims in I4–I6. The next
recommended action is bounded read-only isolation of the final Service timeout
and processor-lock failures, with test profiles/prerequisites recorded, before
any Service implementation. Do not infer a general Service defect or repair it
under discovery authority. I1 remains unstarted because this authorization is
I0 only. No new SRS DOCX/PDF, PDF layout change, installed service change, commit,
release integration or push was performed.

## I0 Service timeout and processor-lock diagnosis

2026-10-22 — **DIAGNOSIS_COMPLETE_NO_PRODUCT_EDIT; I1_NOT_STARTED.**
The owner authorized read-only cause isolation and a report before step2.
Roles: Evidence Reviewer / Cross-Repo Boundary Reviewer / Documentation
Synthesizer; single-room discovery/verification, execution IDs N/A. Reused the
existing I0 exact Service archive and pinned Linux/runtime/package identities;
fresh scratch container,1GiB cgroup and dedicated temporary databases. No
product source, repository tests, assertions, quotas or timeout constants were
edited. The Current Truth Snapshot was rebuilt read-only; this explicit request
governs the bounded diagnosis. No agent dispatch or model override was made.

Evidence:
`C:/Users/nekot/Documents/Codex/2026-10-22/docx-service-i0-diagnosis/report.json`,
with34-file `checkpoint.json`, logs and externally collected observations.
The original I0 report and failed attempts were preserved unchanged.

### Timeout: memory admission under the test environment

Service's `src/tasks/queue-resources.ts` reserves320MiB per worker and permits
admission only when `max(observed current memory, reserved credits)+cost` is at
most768MiB. With no other credit limiting the request, measured current memory
above448MiB therefore prevents another worker from starting. The valid1GiB
cgroup limit by itself does not guarantee that the test has this headroom.

An isolated verbose run reproduced a queued image job for approximately57s.
Across274 snapshots of that stalled job, cgroup memory was452.54–464.81MiB;
there were zero observed PostgreSQL lock waits and zero traced SQL errors.
The processor still held its expected leader lock and polled normally.
`processing-monitor.jsonl` and `processing-pg.jsonl` retain these observations.

A controlled environment-only intervention advised the disposable container's
scratch/npm file cache out of memory using per-file `posix_fadvise(DONTNEED)`.
Observed current memory dropped from488247296 to332468224 bytes, without
changing file contents or using a host-wide cache flush. The same queued job
resumed and passed in59.15s; all four previously failing processing cases then
passed in that run. This establishes a concrete memory-admission cause for the
reproduced wait, rather than merely increasing the test's timeout.

This is actual Service admission policy reacting to the harness's memory use.
Production pressure could also cause waiting, so these findings do not waive
the policy or prove production capacity. The prior run's individual timing is
not reconstructed as sixteen independent defects.

### Processor lock: singleton ownership and timeout cleanup

`src/jobs/processor.ts` uses session advisory key60430404 for one processor per
database. `tests/isolatedDatabase.mjs` isolates schemas, which does not isolate
this database-wide key. Two explicit controls used the unchanged Service:

- `lock-control.json`: processor A in schema A holds the key; processor B in
  schema B is rejected with `Processor already active`. After A's normal stop,
  zero such locks remain and B starts successfully.
- `timeout-lock-control.json`: an observer timeout leaves a real Service
  processor child running and its key held. A second processor is rejected;
  awaiting child shutdown releases the lock and a new processor starts.

This explains the cascade consistent with the earlier observed live native
Service child after a timed-out test. Timing out a test does not cancel its
pending promise or automatically stop its subprocess; its normal `finally`
cleanup may not yet have run. A live holder is expected singleton contention,
not evidence of a permanently leaked PostgreSQL lock. These controls do not
claim every historical timeout followed identical scheduling.

### Clean verification and scope of the result

The final verification removed the diagnostic preload, retained the real1GiB
limit, used a fresh test process and dedicated DB per independent file, and
started from low-cache disposable scratch state. No source/test repair or
relaxed resource bound was needed.

| Previously failing file | Clean result | Evidence |
| --- | --- | --- |
| `tests/task-processing.test.mjs` |28/28 PASS | `processing-clean.log`, exit0 |
| `tests/task-api.test.mjs` |14/14 PASS | `api-clean.log`, exit0 |
| `tests/task-queue-api.test.mjs` |8/8 PASS | `queue-clean.log`, exit0 |

All50 tests in those files passed. This is focused clean verification, not a
retroactive PASS for the old combined127-test invocation. One diagnostic run
was27/28: its inherited `NODE_OPTIONS` preload conflicted with the separate
native4096-byte file-ceiling test before the target file was created. The clean
run without the preload passed28/28; the traced run is not acceptance evidence.

Exit decision: the requested timeout/processor-lock diagnosis is complete.
The observed symptoms are attributable to test memory state/admission and
subprocess/singleton isolation; no product-code repair is supported by these
findings. Future Service proofs must record the real memory profile, use
dedicated DBs for independent singleton-processor runs, and await process
cleanup before reuse. Do not add hidden fixture-specific product branches or
disable memory/lock controls. Broad baseline/integration acceptance still uses
the planned checks at the appropriate later stage.

Core/Service working trees, HEADs and protected release refs remain unchanged.
Only this existing Project Control record and new local diagnostic evidence
were written; the temporary diagnosis containers/network/DBs were removed.
No step2/I1, SRS generation, product commit, release integration or push occurred.

## I0 RAM-only trial at1.5GiB

2026-10-22 — **TRIAL_COMPLETE_QUEUE_PROFILE_INCOMPATIBLE.**
The owner requested increasing RAM to1.5 and trying again. Scope was interpreted
as1.5GiB (1536MiB) on the disposable Service container only. Discovery/verification
roles and single-room IDs N/A continue; no product guard, policy, test or source
change was authorized or made. Evidence:
`C:/Users/nekot/Documents/Codex/2026-10-22/docx-service-ram-1536/report.json`
and its checkpoint/logs.

The same built source/runner was probed first at1073741824 bytes, then changed
to1610612736 bytes using Docker's memory limit. Combined memory/swap limit
remained2147483648 bytes. Dedicated DBs isolated the selected HTTP/PDF tests.

| Probe/check |1GiB control |1.5GiB trial |
| --- | --- | --- |
| Real cgroup read / coordinator | enabled and ready | disabled and unready, `invalid_sample` |
| Existing queue-capability HTTP test |1 selected PASS |1 selected FAIL: capability is null |
| Existing real-child PDF/delivery test | not repeated |1 selected PASS |

Queue checks intentionally selected one test and left seven unselected; the
PDF check selected one and left27 unselected. These are targeted behavioral
checks, not a full-suite result or a throughput/memory improvement measurement.

Cause: `src/tasks/queue-resources.ts` rejects a memory sample when
`v.max !== 1024 * MiB`. Thus the current two-worker queue trial is validated for
exactly1GiB. Increasing the container limit does not scale the fixed768MiB
admission budget or320MiB worker credit either. Ordinary PDF delivery passing
does not establish queue compatibility at1.5GiB.

Conclusion: RAM increase alone cannot be used with this queue profile. Supporting
1.5GiB requires a separately authorized memory-profile design/change and tests;
do not merely remove the max guard or assume a new capacity. No product repair
or step2 began. Core/Service HEADs, working trees and protected release refs
remain unchanged. The trial containers, DBs and network were removed after
retaining results; installed/production settings were not changed. No commit
or release integration occurred.

## I0 per-case timeout phases and retained-memory findings

2026-10-22 — **READ_ONLY_DIAGNOSIS_COMPLETE; NO_PRODUCT_REPAIR.**
The owner asked where each timeout occurs, whether the test improperly includes
queue wait, and why memory does not become available. Roles: Evidence Reviewer /
Cross-Repo Boundary Reviewer / Documentation Synthesizer; single-room IDs N/A,
routine risk. Authority remains discovery/verification, with this existing
Project Control record as the only repository mutation. Current Truth Snapshot
was rebuilt read-only; explicit request and relevant plan govern this work.

Evidence root:
`C:/Users/nekot/Documents/Codex/2026-10-22/docx-service-timeout-phases/`.
`report.json`, `matrix-results.json`, per-case logs, memory-profile measurements
and `observations.jsonl` bind14 independent selected-test invocations. Source
archive SHA remained
`5127093d99632c2c56e82ad680d2a3eb7a084ce450cb0293ed717cf086af20c6`.
Each invocation had its own DB and a fresh test process; source, tests,
assertions, dependency lock and1GiB cgroup limit were unchanged.

### What was observed for each named case

Seven cases from the original failure log were replayed first with the natural
cache remaining after install/build, without artificial cache filling. They
were then replayed after per-file cache advice confined to disposable scratch
and npm cache. The observer ran in a separate container, reading the runner's
actual cgroup/processes and each test DB every50ms; its memory was outside the
runner limit. No runtime preload or product instrumentation was injected.

**In all seven retained-cache replays, a task reached `queued` but neither
`processing_started_at` nor `send_started_at` was set.** Every resulting error
was Vitest's wall-clock timeout. Each cold-cache replay passed the original
assertions and had an observed processing start.

| Named test / intended check | Test wall limit | Retained-cache observed failure point | Cold-cache control |
| --- | --- | --- | --- |
| Disconnect during sending |30s | queued; PDF write/abort callback not reached | PASS, processing/sending observed |
| Reject transport finish |30s | queued; response end not reached | PASS, processing/sending observed |
| Enforce processing deadline |5s | queued; explicit50ms processing timer not yet armed | PASS, processing then failure observed |
| Detect modified normalized bytes |30s | queued; renderer integrity check not yet reached | PASS, processing observed and expected integrity rejection asserted |
| Stream real PDF over HTTP |30s | queued; no PDF generation/delivery start | PASS, processing/success observed |
| FlowDocMake stdio/proxy integration |60s | first direct generation request queued, before later MCP generation assertions | PASS, processing/sending/success observed |
| Start real Service entrypoint and deliver PDF |30s | Service had started; its document task was queued | PASS, processing/success observed |

These are7 intentional failure reproductions plus7 passing controls, not a
14/14 suite PASS. Other tests were unselected, not silently passed. The old I0
run had no per-task phase trace; its exact historical failure phases remain
retrospectively UNKNOWN. This new evidence establishes each named replay's
phase and must not be used to rewrite the original record.

### Which clock expires, and whether counting queue wait is wrong

The5/30/60-second clocks belong to the selected Vitest test callback and cover
fixture work, queue wait, rendering, transport and assertions. Service instead
has an absolute task expiry of3h from creation (including queue wait), a normal
processing budget of90min armed after worker admission/processing start, a
sending budget of30min armed after its send grant/start, and a per-write60s
budget. The deadline test overrides processing to50ms; that timer cannot expire
while its job has not started. Source: `processing.ts`121/259/284,
`policy.ts`7 and `022_task_intake.sql`13/19.

The FlowDocMake client also has its own defaults (total3h, headers31min,
idle60s). These replay logs specifically report Vitest wall timeout, not
`TASK_REQUEST_TIMEOUT` from the client or `TASK_TIMEOUT` from Service. Some
observed `WORKER_INTERRUPTED` terminal records occur during teardown after the
test times out; they are not the original timer firing.

Counting queue time is legitimate for a whole-request/end-to-end budget: the
request really did not complete in that budget. The mistake is using that
failure to claim that a processing or sending deadline malfunctioned. Tests
intended to isolate a particular stage need a bounded and observable admission
precondition, followed by the stage-specific timer/assertion. Preserve a
separate overall end-to-end limit and queue/expiry checks; neither deleting
the overall timeout nor simply enlarging every timeout resolves the issue.

### Why RAM stayed charged despite no PDF worker starting

Before any test, with only setup shell/sleep processes left after build, one
observed sample had anonymous memory0.21MiB, file cache261.25MiB and kernel
memory25.63MiB, including205.19MiB of inactive file pages. That charge was
therefore not a live PDF worker retaining its document.

During the seven queued replays, median cgroup current memory ranged from
488.3 to575.8MiB. Service counts `memory.current`, including file cache, and
requires `max(current,credits)+320MiB <= 768MiB` to admit a worker. All those
medians exceed the448MiB single-worker admission boundary. The report retains
the per-case anonymous/file/active/inactive/kernel breakdown and process RSS;
RSS values are not summed as unique memory because pages can be shared.

No cgroup high/max/OOM events or reclaim scans were observed during these
queued intervals. With the container still below its1GiB hard limit, there
was no observed kernel pressure to evict the clean cache. Service paused
admission at a lower threshold and waited; its admission loop neither creates
that allocation pressure nor requests cache reclamation. After scoped cache
advice, all seven original tests passed under the same source and RAM limit.

**Correction to earlier attribution:** the test harness/cache state exposes
a real conservative Service accounting/liveness risk: counting reclaimable
cache as busy memory can prevent otherwise bounded work from starting. It is
incomplete to call this only an environmental problem. This is not evidence
of a PDF worker memory leak, and this diagnostic does not prove that every
production workload will stall. It does identify a policy/precondition that
needs design review before treating the baseline as generally ready.

### Remaining boundary and next decision

Independent DBs prevented cross-case singleton-lock contention. The retained
native-entry replay still left a live `dist/server.js` child after the test
timed out; its PID/owned cleanup and leader lock were observed. Explicit
cleanup kept that from contaminating later cases, consistent with the prior
lock controls. One sampled native-entry relation-lock wait occurred while the
test was dropping its schema and the remaining processor still queried it;
there were no task rows in that snapshot. This is teardown contention, not
the earlier queued stall. No PostgreSQL lock wait explains the seven queued
intervals.

Recommended next design scope: decide how Service memory admission should
account for reclaimable cache while preserving real hard bounds; separately
define stage-test admission preconditions, overall queue/test budgets and
awaited child cleanup. No cache-subtraction formula, automatic cache eviction,
threshold increase, production fix or revised test was implemented here.
Do not conflate that policy review with I1/step2 DOCX porting.

Core/Service source trees, HEADs and protected release refs remain unchanged.
Temporary observer/runner/DB containers and their network were removed after
capturing evidence. No SRS generation, product commit, release integration or
push occurred. Earlier evidence is retained; this checkpoint supersedes only
the overbroad environment-only explanation, not the historical test results.

## I0 phase-aware diagnostic waiting harness

2026-10-22 — **DIAGNOSTIC_HARNESS_VERIFIED_NO_PRODUCT_CHANGE.**
The owner approved treating the prior time limits as diagnostic observation
points, then requested execution. Scope: verification helper instrumentation
and derivative tests in disposable scratch only, existing record update;
Core/Service source, repository tests/assertions and resource limits unchanged.
Roles: Evidence Reviewer / Cross-Repo Boundary Reviewer / Documentation
Synthesizer; single-room execution IDs N/A, no separate room or model override.
Current Truth Snapshot was rebuilt read-only; the explicit request governs.

Artifact/evidence root:
`C:/Users/nekot/Documents/Codex/2026-10-22/docx-service-phase-aware-wait/`.
Reusable runner `run-observed.py`, wrapper `observed-it.mjs`, exact copy recipe
`prepare-copies.py`, `report.json`, callback/control events and DB/cgroup trace
are retained. Reviewable diagnostic test copies are under `review-copies/`.

### Implemented diagnostic behavior

- Scratch copies preserve the original callback bodies/assertions and relative
  imports; only Vitest `it` registration is wrapped. Provenance hashes bind the
  original source archive and generated copies. Git archive uses CRLF here;
  diagnostic copies normalize line endings to LF without changing callback
  text. The original archive and repository files remain unchanged.
- Crossing the old5/30/60s wall threshold records actual task state, identity
  and RAM; it does not cancel the request or produce a failed assertion.
- Queue wait is reported until `processing_started_at`. Processing-to-send and
  send-to-terminal intervals use the corresponding DB timestamps, separately
  from total callback duration. These are lifecycle intervals, not CPU timings.
  Diagnostic stage advisories remain observable after processing starts.
- Product processing/send/write timers, task expiry,1GiB cgroup limit,
  768MiB admission budget and320MiB worker credit are unchanged. The original
  explicit50ms processing-deadline assertion still passes.
- The scratch callback has a10min emergency watchdog and controller observation
  window150s. An unfinished observation would be reported as unfinished, not
  as Service timeout/PASS. Neither limit was reached. A maximum2s post-assertion
  latch lets the external observer read terminal rows before normal teardown;
  this latch is outside the reported callback end.

### Actual verification

All seven selected diagnostic copies passed their original callback assertions.
This is not an unmodified-timing baseline or a full127-test PASS. Each case used
an independent DB and fresh test process; other tests were unselected.

| Selected case | Callback duration | Observed queue wait(s) | Result |
| --- | --- | --- | --- |
| Disconnect during sending |37.857s |36.957s | PASS; old30s threshold became advisory |
| Reject transport finish |0.885s |0.036s | PASS |
| Processing deadline |0.255s |0.022s | PASS, expected50ms Service timeout asserted |
| Modified normalized bytes |0.394s |0.020s | PASS, expected integrity rejection asserted |
| HTTP PDF stream |1.033s |0.019s | PASS |
| FlowDocMake stdio/proxy |105.819s |89.905s,11.499s,0.010s | PASS; old60s threshold became advisory |
| Native Service entrypoint/PDF |1.281s |0.039s | PASS |

At30.014s in the first case, the observer recorded the task still queued with
no processing start and no cancellation. After capturing that cause, scoped
cache advice allowed the same task ID to proceed and finish the original
disconnect assertions. The FlowDocMake case similarly crossed60s, recorded its
queued state and eventually passed after a separately recorded scoped cache
control. Its waiting task retained its identity; requests were not restarted.

### What remains unresolved

Queue waiting is now distinguished from a processing timeout in this diagnostic
workflow. Removing the old wall cutoff did not itself cure memory admission:
cache/readiness advice was used before later cases and for the two live waits.
Those actions affect disposable scratch/npm cache only; no production cache
eviction or recovery behavior was installed. Autonomous queue recovery and the
memory-accounting/liveness concern remain unproven/unfixed.

The reusable driver generalizes the same evidence-first cache intervention
rule after an advisory; in this run the first was automatic and the stdio
intervention was recorded externally during live observation. This is explicit
experiment control, not an accepted production remedy. Historical failures and
their original time limits remain available as evidence.

Core/Service HEADs, protected release refs and working trees remain unchanged.
Temporary runner/observer/DB containers and network were removed after evidence
capture. No I1/step2 DOCX port, SRS generation, product commit, release integration
or push occurred.


## I1 actual Core integration checkpoint — 2026-10-22

Authority: owner authorized “ไปข้อ 2” after I0/phase-aware diagnostic results.
This closes I1 only. It does not reopen old execution contexts or authorize I2,
Service, SRS, packed publication or release integration. Markdown gate: existing
Project Control canonical plan; Product Implementation Agent / Evidence Reviewer
with Documentation Synthesizer for this checkpoint; single-room IDs N/A.

### Candidate and containment

- Actual owner repository: flowdoc-core, isolated worktree
  `C:/Users/nekot/Documents/Codex/2026-10-22/docx-core-service-integration/core`.
- Branch `codex/docx-core-integration`, base
  `8f8a739aea5597b6d8c9932c790f9bd716e8ebc7`, terminal development commit
  `76d6c106f54da9e9e6eac3f603ec170dc774ef5b`. Clean after commit; retained for I2.
- Changed25 files: private `src/docx/` modules and root entry; pinned
  package/lock; three new `tests/docx/` files and package export assertion.
  Dependencies: docx9.13.0, pngjs7.0.0, jszip3.10.2. TS6.0.3, Node range and
  strict/noUncheckedIndexedAccess/exactOptionalPropertyTypes remain unchanged.
- No Core self-import, prototype junction/global-module dependency, compiler
  suppression, shared PDF implementation edit or duplicated fixture model.
  Local imports emit `.js` and real declarations under `dist/docx/`.
- Core main checkout HEAD `8f8a739aea5597b6d8c9932c790f9bd716e8ebc7` and
  release `ad91e1888835c0ebc31d03c0ef9593d0bd735233` remain unchanged.
  Service HEAD `32d78570b5c2dc8940efd3452bf5d4dffc55c081` and release
  `ca66f605b02a41d1bc3b05894fbc75f5224d4900` remain unchanged/clean.

### Implemented boundary and recorded ruling

Only new runtime root export: `createDocxEngine`; associated API types are
exported deliberately. It accepts actual Core font resources and
`ResolvedDocument`, calls existing Core document validation/font selection,
then DOCX capability/preflight mapping. Legacy font resources retain actual
Core identities without invented release UUIDs; bytes/license hashes and font
embedding flags are checked. The public API does not accept prototype
`embeddingPermitted:boolean` as evidence.

Ruling: I1 includes the minimum private font/staged-output adapter needed to
exercise this real API. Full prepared JPEG/RGB-alpha conversion and robustness
matrices remain I2; any source image in body or section bands is explicitly
rejected in this slice. This prevents a pretend factory or silently omitted
content. Cost if wrong: private adapter refactoring in I2, with no release
promotion yet. Output is staged in chunks at most65536 bytes and returns
byteLength/SHA256, pageCount:null, fieldRefresh:required, wordVerified:false.

### Evidence and acceptance coverage

Durable local evidence directory:
`C:/Users/nekot/Documents/Codex/2026-10-22/docx-core-service-integration/i1-evidence`.
`coverage.json`, `candidate-manifest.json`, `final-manifest.json` and
`final-review.json` connect the criteria, tested input and terminal candidate.

| Criterion | Evidence | Result |
| --- | --- | --- |
| Missing API observed before port | red.log | Intended failure before implementation |
| Actual Core strict build | build-final.log; linux-build.log | PASS, zero diagnostics, JS+d.ts emitted |
| Root API / actual composition / complete text and table / unchanged source | targeted-final.log; tests/docx/port.test.ts | 2 port cases PASS; text checked inside DOCX XML, table/header flags and embedded family checked |
| Fixed text/fixed format / malformed resolved document rejected before writes | tests/docx/capabilities.test.ts | 3 cases PASS |
| Root export contract | tests/packageContract.test.ts | 2 cases PASS;7 targeted total |
| Existing Core regressions | linux-tests.log | 89 files,883/883 PASS; baseline878 plus5 new cases |
| Built entrypoint, actual composition and bundled resources used by both writers | smoke-results.json; smoke.mjs | PASS for binding-text and table fixtures; source unchanged |
| PDF regression comparison | core-binding-text.pdf; core-table.pdf; smoke-results.json | Both outputs byte-identical to I0 saved PDF references |
| Fresh read-only review | final-review.json | zero Critical/Important; one deferred Minor |

Linux uses the same pinned baseline image
`sha256:cea4f320f199914fbb56387f172244b1b2f41c499d072d2b4a2b631a67213261`,
Node24.21.0 and the pinned legacy helper required by the existing suite.
Verification extracted a frozen candidate archive into disposable scratch;
released runtime inputs were read-only. Initial Docker entrypoint/LF/cache
setup errors were test-environment issues, followed by the successful final
run; no product/configuration repair resulted. Containers were removed.
After review, only an extra trailing test-file blank line was removed;
final-manifest proves the tested and terminal inputs text-equivalent after
LF/EOF normalization. No behavioral change invalidated Linux proof.

### Explicit remaining limits and next step

The reviewer reproduced one Minor: a plain sink.write failure returns
DOCX_SERIALIZATION_FAILED but passes DOCX_RESOURCE_INVALID to output.abort.
It still cleans up and reports failure; carry reason-code alignment into I2
output diagnostics. No broader failure-handling acceptance is inferred.

The saved `core-binding-text.docx` and `core-table.docx` are structural/API smoke
artifacts, not newly Word-verified layout evidence. Full prepared images,
malformed/truncated resource and cancellation/budget/mutation matrices,
geometry/XML equivalence with frozen M1 and library-font breadth remain I2.
Packed installation and consumer-lock changes remain I3; `check:package` was
not run or claimed PASS in I1. Service changes start only in later authorized
stages; the earlier RAM/cache admission-liveness concern remains unresolved.
No SRS trial, prototype change, PDF source edit, main/release merge, tag, push
or installed production change occurred. Project Control canonical data/maps
are unchanged; this plan update passes `check:data` and whitespace checks.

Decision: **PASS I1 only, with one deferred Minor.** Recommended next: owner may
authorize I2 resource/image/output bridge and its bounded tests; do not begin it
from this checkpoint alone.


## I2 resource and staged-output checkpoint — 2026-10-22

Authority: owner explicitly authorized I2 images/fonts/output and the pending
failure-code fix in the existing isolated Core lane. No Service, SRS or release
integration. Role: Product Implementation Agent / Evidence Reviewer and
Documentation Synthesizer for this canonical plan checkpoint; single-room IDs
N/A. Same named development branch/worktree as I1, I2 base
`76d6c106f54da9e9e6eac3f603ec170dc774ef5b`; terminal commit
`89a5d4bda12a731a34e048c1d0e5d73db407681b` on `codex/docx-core-integration` only.

### Changes and ownership

Core13 files: six private DOCX modules; existing private PDF module now exports
its unchanged JpegCheck class for synchronous JPEG snapshot verification;
four DOCX test/helper files; Bai Jamjuree regular font and its OFL fixture.
Public root API, package/lock/compiler policy and PDF behavior stay unchanged.
No new decoding/orientation policy was added to Service.

- Uses existing snapshotImageProvider/verifiedImageStream. Native JPEG retains
  the verified prepared bytes. Verified RGB and optional alpha are encoded to
  PNG internally; tests compare exact decoded RGBA pixels, dimensions and native
  drawing frame. Body and header image cases pass; source graphs are retained.
- Checks4million pixels/image and16MiB aggregate prepared/encoded resources
  before opening referenced streams and before packing. Checks source50000
  nodes and10000 image references before image IO. Byte/pixel/XML/output caps
  fail explicitly;32MiB output cannot be raised through options.
- Reads verified font/license files through bounded owned handles, checking
  identities, hashes, UTF-8 licenses, concrete weight/style and embedding flags.
  Every license hash is checked. Real Core library selection for Sarabun and
  Bai Jamjuree works; no invented legacy release ID or caller permission flag
  becomes the Core API.
- Pins source document, prepared metadata, options and output methods before
  asynchronous work. Output remains staged, buffered, chunks<=65536 bytes,
  SHA256/byteLength verified, pageCount:null, fieldRefresh:required and
  wordVerified:false. Cancellation and write/abort failure preserve cleanup.
- The I1 pending diagnostic is fixed: ordinary sink-write failure gives
  DOCX_SERIALIZATION_FAILED consistently to caller and staging abort. A failing
  cleanup preserves the primary issue and adds DOCX_CLEANUP_FAILED.

### Mapping ruling and cost

Actual Core composition omits heightMode for ordinary content-height text;
Core's TextBlock makes it optional and layout branches only on fixed mode.
The port had required an explicit content value for table eligibility.
Tests first reproduced the default/exact4pt table fallback, then verified the
correction: omitted and explicit content use the same whole-grid rule.
Eligible cells now use75twip vertical margins instead of the prior80twip
fallback; if that interpretation were wrong, default table spacing would be
wrong. Source fields are not rewritten, and Word visual acceptance is still
required later. This is a semantic-default correction, not a general text
baseline offset or a new Exact-line rule.

Near4pt, mm and one-mismatching-cell cases retain native margins for the entire
table. Header distance is zero only when both effective headers are empty;
mixed visibility retains its conservative policy. CS and explicit bold/italic
true/false tests pass. No forced row heights or baseline shifts were added.

### Verification and durable proof

Evidence directory:
`C:/Users/nekot/Documents/Codex/2026-10-22/docx-core-service-integration/i2-evidence`.
`coverage.json`, `candidate-manifest.json`, `final-manifest.json`,
`proof-reuse.json` and `final-review.json` connect each criterion to its proof.

| Check | Result / locator |
| --- | --- |
| Actual strict Core build | PASS; build-current.log and linux-build.log |
| Resource/writer/geometry matrix plus existing PDF stream tests |64/64 PASS; targeted-3.log (56 new I2 cases,8 existing stream cases) |
| Full Core Linux regression |92 files,939/939 PASS; linux-tests.log |
| Same actual composed graph, prepared provider and resources through both writers | PASS for native JPEG, RGB, RGB-alpha and real Bai library selection; shared-resource-results.json / shared-smoke.log |
| PDF regression | Both I0 text/table reference hashes unchanged; smoke-results.json |
| Frozen M1 canonical comparison |6 small cases PASS; m1-equivalence.json and m1-compare-2.log |
| Fresh independent review | PASS; no Critical/Important/Minor findings; final-review.json |

M1 comparison checks all XML/relationship parts, logical text and media, plus
SHA256 of original embedded fonts after reversing per-file obfuscation.
Normalizations are limited to created/modified timestamps, font GUIDs and
native drawing numeric package identities. Cases: plain, bold, italic,
bold+italic, explicit-content table and native RGBA drawing. The table uses
explicit content supported by both; the omitted-mode difference is the
intentional correction tested separately above, not silently normalized away.
Historical M1-only release/permission fields exist only in the read-only
comparison adapter, never in the candidate public API.

The Linux candidate was frozen into an archive and verified in disposable
scratch with the pinned I0 image/runtime/helper. Three files were subsequently
returned to existing formatting to minimize diff; identical TypeScript syntax
trees are recorded in proof-reuse.json, with a fresh current build. No semantic
change invalidated the passing Linux run. The copied OFL is byte-identical to
its licensed source; its original line21 trailing space is retained, and only
that license is excluded from the otherwise passing code-whitespace check.
No candidate changes were made after the final independent review.

### Remaining boundaries and decision

**PASS I2 only.** No findings remain from the I2 review, and the I1 Minor is
resolved. Saved DOCX/PDF files are small structural/integration artifacts;
no new Word visual inspection or SRS trial occurred. Existing static-TTF,
Thai/Latin, native face-slot and geometry capability limits remain; this is
not support for every font, script, layout or document size. Packing remains
bounded buffered work and does not become constant-memory streaming.

Next recommended work is I3: isolated packed Core consumer and lock graph,
while retaining PDF consumer checks. No passing packed artifact is claimed;
check:package is not an I2 PASS. Service and its earlier RAM/cache admission
concern remain untouched. No original Core/Service checkout, protected release,
prototype/source evidence, installed production package, main/release merge,
tag or push changed. Canonical maps/data remain unchanged; the existing plan
is the only Project Control prose update.


## I3 installed-package checkpoint — 2026-10-22

Authority: owner authorized I3 verification of installed Core with small PDF
and DOCX documents before Service. Role: Product Implementation Agent / Evidence
Reviewer; Documentation Synthesizer for this existing canonical checkpoint;
single-room Work/Phase/Checklist/execution IDs N/A. Same isolated Core worktree,
branch `codex/docx-core-integration`; base
`89a5d4bda12a731a34e048c1d0e5d73db407681b`, terminal development commit
`e53e4a284d5eb2596b531b55a12a83ab74ba8528`. No I4/Service,98-page SRS or release authority.

### Package candidate and immutable identities

Artifact directory:
`C:/Users/nekot/Documents/Codex/2026-10-22/docx-core-service-integration/core/artifacts/1792638992048`.

- Archive: `flowdoc-core-0.4.7-docx-candidate-1792638992048.tgz`.
- Archive SHA256:
  `067b7678c410e7413968159f7495fb3b0e6f3909f9c14d51eae20f7e5b7f4c3e`.
- Offline consumer image:
  `sha256:9508d3ba4027d5443426fd14a47dfad9f488c8deb76a746a17e25bc55cd01374` (Linux/amd64).
- Consumer-lock SHA256:
  `01456c322e2d5018254329922f4717e31b8276cb603b328caf56d537e63a78b2`.
- Version remains0.4.7 in this isolated candidate; its unique filename/hash
  identifies it. No release archive was overwritten and no version/tag/release
  promotion is inferred.

The result.json in that directory contains the consumer outputs and actual
checked isolation (`network:none`, no mounts). consumer-package-lock.json has
22 real resolved entries and the exact Core runtime dependencies; the installed
npm graph is retained as consumer-dependency-graph.json. Dependency acquisition
occurs during preparation; npm ci disables install scripts. Final consumers
run offline against installed @flowdoc/core, with no source/M1/global-module
or host-folder dependency. Existing package root exports/files policy remains.

### Changes and packaging prerequisite ruling

Exactly4 files changed: scripts/checkPackedConsumer.mjs, Dockerfile.consumer,
Dockerfile.package and tests/consumer/checkDocx.mjs. Runtime src, package
version/dependency declarations and renderers are unchanged.

The original harness fabricated a lock assuming zero runtime dependencies.
It now resolves the immutable candidate archive and its real graph with npm
inside the pinned preparation image, preserves the lock, installs it with
scripts disabled, records npm ls, and checks actual final network/mount state.
All prior PDF consumer checks remain in the command sequence and result gate.

Ruling: expand the bounded packaging edit to Dockerfile.package. The initial
actual run failed13 native cases because it ran tests before building their
native binaries/resources. Reorder those prerequisites before the unchanged
full suite and supply its explicitly required prior helper through a build-only
named context. Cost if wrong: package-build plumbing would need revision;
rendering/source/release behavior was not changed. Skipping the native tests
would not establish package correctness.

The prior helper is extracted to scratch from the retained0.4.0 archive, with
SHA256 `b80f4e94bc52d38477f11070ade15f97781aa0eeb5927afa8b4d37dedbc7644d`.
Reproduction supplies FLOWDOC_LEGACY_SEGMENTER explicitly; the script copies
and hashes its owned bytes into build proof. The helper is not shipped in the
Core archive or final consumer. Package inspection also verifies no source-tree
or node_modules entries in the archive.

### Verification and coverage

Evidence directory:
`C:/Users/nekot/Documents/Codex/2026-10-22/docx-core-service-integration/i3-evidence`.
coverage.json, candidate-manifest.json, final-manifest.json, package-summary.json
and final-review.json connect the passing candidate to the final commit.

| Criterion | Result and evidence |
| --- | --- |
| Consumer detects missing installed API | Intended RED against prior package; red-installed-api-valid.log |
| Original native packaging failure | Preserved in red-package-baseline.log; prerequisite repair verified by final run |
| Actual strict build, native/resources build and full npm test |92 files,939/939 PASS in package-2.log |
| npm run check:package | Final exit0; package-2.log and artifact result.json |
| Actual schema1/model18 text/table and images, schema2/model19 library composition |6 paired PDF/DOCX cases PASS; docx-result.json |
| Bundled and real Bai library resources, JPEG/RGB/alpha provider | Installed public root API PASS; same frozen source/provider through both writers |
| ByteLength/SHA256, immutable source, cancellation/output cap/write-abort failure | PASS; docx-result.json |
| ZIP/XML/relationships and embedded fonts |6 DOCX packages PASS structural inspection; docx-result.json |
| Prior PDF consumers including streamed/task/memory cases | All retained checks PASS; artifact result.json and individual results |
| I0 baseline preservation | Binding and table PDF hashes remain exact; docx-result.json / prior PDF results |
| Actual isolation, archive identity and resolved graph | network:none, mounts:[]; result.json and saved lock/graph |
| Fresh independent final review | PASS with no Critical/Important/Minor findings; final-review.json |

First candidate preparation installed successfully and passed text/table/library
cases; its new image fixture contained a dangling old Area schema. Only that
fixture was corrected. Initial syntax/fixture setup errors are preserved and
not counted as intended RED or Core rendering defects. The failed container's
state/logs/output were captured before removal. Final successful containers
were removed by the harness; archive, image and lock remain for reproduction.

No candidate edits followed final review; final manifest hashes match the
reviewed/tested files. All old PDF tests remain, including small automated
fixtures named srs-basic; the owner's98-page SRS was not run or generated.
The Project Control change is only this existing plan; canonical data/maps
are unchanged and check:data plus whitespace checks pass.

### Decision and limits

**PASS I3 only.** A real installed package now supports the bounded PDF/DOCX
cases. Artifacts include the six small DOCX/PDF pairs; wordVerified remains
false, fields require Word refresh, and DOCX pageCount remains null. Word visual
layout/pagination and SRS fidelity remain unaccepted. This is a development
candidate, not a published/released or installed production package.

Next recommended stage is I4 format selection/task persistence in Service,
subject to a new owner authorization. Service checkout/configuration/DB and
protected releases remain unchanged. A different Core archive hash can invalidate
Service font-readiness reviews; revalidate through the normal isolated workflow,
never manually approve stale review rows. The prior Service RAM/cache admission
finding remains unresolved and is not discharged by this Core package result.

## I4 Service output-format persistence checkpoint — 2026-10-22

Authority: owner explicitly authorized I4 only. Owner flowdoc-service; active
role Product Implementation Agent and Evidence Reviewer; single-room execution
IDs N/A. Existing I4 scope and checklist above remain authoritative. No I5,
SRS98, production installation or release/main integration was authorized.

Service lane: `C:/Users/nekot/Documents/Codex/2026-10-22/docx-core-service-integration/service`,
branch `codex/docx-service-integration`, base
`32d78570b5c2dc8940efd3452bf5d4dffc55c081`, terminal development commit
`b9ce2f7f9b4572bde2bdd1ad74a0b5d9366b6ef3`. Clean retained worktree.

### Behavior and migration

- `/documents` accepts one Output-Format header: PDF or DOCX, case-insensitive,
  with optional surrounding ASCII spaces/tabs. Absence selects PDF. Blank,
  unknown, comma lists and duplicates, including equal duplicates, fail before
  task allocation. Existing authentication, access and Accept checks remain.
- Format is frozen in task metadata, normalization summary and the hashed V2
  normalized envelope. Both V2 request/job descriptors carry the same format;
  the database rejects disagreements and later format/version changes. Lookup
  returns the frozen selection and rejects any attempt to select it again.
- Forward-only `025_task_output_format.sql` preserves old immutable data and
  checksummed migrations. Existing tasks/jobs/outputs backfill PDF; old tasks
  retain normalization V1. New tasks default to V2. Output format, MIME and page
  count constraints are coherent; historical PDF rows with no page count remain
  valid, new V2 PDF outputs require a positive count, DOCX count must be null.
- Existing legacy job ownership/input guards are retained. No dependency,
  package lock, vendor archive or Core identity changed.

Bounded ruling: include `src/tasks/render.ts`, `render-child.ts` and `public.ts`
so the real consumer verifies envelope version/format and lookup exposes the
frozen value. Without this, DOCX intent could fall through the PDF writer.
This is not I5: the actual child explicitly returns UNAVAILABLE for DOCX before
composition/output. The real-process test proves no PDF artifact is published.

Migration-list assertions in affected historical tests append025. The Stage1
upgrade fixture now seeds its historical schema directly instead of executing
current intake against an unmigrated database. It verifies unchanged original
rows/events/files and actual V1 normalization after upgrading. Product code does
not add an obsolete-schema fallback to accommodate a test fixture.

### Evidence and acceptance coverage

Evidence directory:
`C:/Users/nekot/Documents/Codex/2026-10-22/docx-core-service-integration/i4-evidence`.
`coverage.json`, `candidate-manifest.json`, `proof-reuse.json`, `final-manifest.json`
and `final-review.json` connect criteria, files, immutable identities and review.
Final Linux image:
`sha256:0570a9264a2a91a270c135fd119816f6ba813026a9da5a0cdaa667b439cf7ef1`.

| Criterion | Passing evidence |
| --- | --- |
| Header selection, no allocation, HTTP normal/queue modes, restart/lookup and envelope tampering | format-confirm.log; output-format26/26 |
| Real DB migration, immutable format/version/job pins, MIME/page coherence and unchanged historical metadata/digests | format-confirm.log; output-format-migration1/1 with DB assertions |
| Historical V1 and current normalization including existing integrity/limits | format-confirm.log; task-normalization16/16 |
| Intake, queue intake, DB/upgrade and affected migration/font repository checks | affected-db-1.log; other9 files69/69 unchanged |
| Actual child PDF processing and DOCX refusal without fallback | affected-runtime-1.log; task-processing29/29 |
| Real API and current/historical clients | task-api-confirm.log14/14; task-queue-api-confirm.log8/8 |
| Legacy jobs/render/output, wire/buffer/client | legacy-regressions.log; other6 files24/24 |
| Preview/authoring and upload acceptance | authoring-upload-confirm.log; authoring7/7 and upload6/6 |
| Strict build and final diff | candidate-image.log; TypeScript build exit0; git diff --check exit0 |
| Fresh whole-candidate review | final-review.json; no Critical/Important/Minor findings |

Union: **200 unique tests across23 files PASS**, using the final passing result
for each affected file. This is several focused invocations, not a claim that
full `npm test` ran. Earlier failed attempts are retained rather than relabeled.
The prior and final image differ only in two revised test files, both retested
in the final43/43; product files and other test hashes are unchanged.

Initial baseline fixture errors were corrected separately from intended RED.
The first API run used the image's stale plugin and lacked its historical path;
preparation now copies current Project Control plugin sources and preserves the
image plugin at `/legacy-plugin`. API14/14 and queue8/8 then pass unchanged.
A parallel legacy run collided with the API processor's database-wide advisory
lock despite isolated schemas. Serial authoring rerun passes7/7. These are test
environment corrections; no processor lock, queue timeout or RAM policy changed.
Runtime verification remains at1GiB, with a dedicated scratch PostgreSQL DB and
an explicitly non-overlapping task network. No unrelated Docker state changed.

### Decision and next boundary

**PASS I4 only.** All four I4 checklist acceptance bullets above are satisfied
by the coverage table; their earlier unchecked planning text is retained as
history. No source edits followed final review. The Service primary checkout
stays clean at32d7857 and protected Service/Core release refs are unchanged.
Only the existing Project Control plan is updated; no map/product truth or
canonical data promotion. Development commit only; no merge, push or release.

Next recommended work is I5, requiring owner authorization: install the exact
I3 packed Core candidate in this isolated Service lane and connect generic
artifact generation/delivery. Actual Service DOCX creation remains unavailable
until then. SRS98, Word visual acceptance, full Service-suite acceptance and
production/mixed-version fleet rollout remain outside this checkpoint.

## I5 installed Core and actual DOCX delivery candidate — 2026-10-22

**Status: implementation candidate available; I5 acceptance NOT PASS.**
Owner authorized I5 only in the existing isolated Service lane, with small
PDF/DOCX documents; no SRS98 or release/main integration. Active role Product
Implementation Agent and Evidence Reviewer; single-room execution IDs N/A.
Service base remains `b9ce2f7f9b4572bde2bdd1ad74a0b5d9366b6ef3` on
`codex/docx-service-integration`. I5 changes are retained uncommitted because an
affected compatibility regression is still failing. Do not treat this as I6
execution authority or a production-ready candidate.

### Implemented and exercised

- The Service vendors the exact I3 archive as `vendor/flowdoc-core-docx-candidate.tgz`,
  SHA256 `067b7678c410e7413968159f7495fb3b0e6f3909f9c14d51eae20f7e5b7f4c3e`.
  package/lock and the isolated vendor manifest identify it. npm ci installs
  the actual package graph including docx9.13.0. Existing released archive
  SHA13673f22cca9667e88125dd4631b0b398c912b8e96c6734a2932b5ff27f3a8ad is unchanged.
- Both formats share composition, font snapshots and the existing prepared
  JPEG/RGB-alpha image provider. The child invokes only installed package-root
  APIs. No Core source/layout implementation was edited or imported directly.
- Actual DOCX traverses child process,64KiB IPC, owned staging, sealing/hash
  verification, DB output metadata and stored-file multipart delivery in both
  normal and queue modes. DOCX uses its own trusted32MiB output bound, exact
  MIME/document.docx and null page count; PDF retains its original bound,
  filename/MIME and positive count. Public receipts disclose buffered packing,
  required Word field refresh and wordVerified:false.
- Parent/transport reject inconsistent format/MIME/count/hash observations.
  Failure usage and public errors retain format instead of naming DOCX as PDF.
  Additional repository.ts/documents.ts edits are bounded dependencies for
  that failure accounting/transport context; existing ownership guards remain.

### Checked evidence

Evidence directory:
`C:/Users/nekot/Documents/Codex/2026-10-22/docx-core-service-integration/i5-evidence`.
Final tested image:
`sha256:7ad080b9a0d48136ca5a571a349b07789659ea98bc4a3b77f7c810f9d203a26a`.
`candidate-manifest.json` freezes all18 changed/untracked files. No product
changes followed the fresh final review.

| Check | Result |
| --- | --- |
| Strict TypeScript build, archive verification and installed dependency graph | PASS; image-5.log, installed-package-identity.log |
| New DOCX/wire/lifecycle suites |21/21 PASS; final-docx.log |
| Existing actual child PDF/processing and retained library-font checks |29/29 PASS; final-task-processing.log |
| Intake/normalization/output-format/DB/wire/buffer/client contracts |98/98 PASS; final-contracts.log |
| Actual queue and historical direct client |8/8 PASS; final-task-queue-api.log |
| Legacy jobs/render/output, preview and font pipelines |22/22 PASS; final-legacy.log |
| Actual API suite including FlowDocMake MCP tool |13/14; one FAIL, final-task-api.log |
| Fresh whole-candidate review | No concrete changed-source defect; Important1 failed API acceptance gate, final-review.json |

Union:191 passed /1 failed,192 unique tests across20 files. Full Service npm test,
I6 matrix and Word visual review were not run. This is not an overall PASS.
Real failure tests cover wrong format/MIME/page count after the real child,
Core pin mismatch, output budget, parent storage ENOSPC, stored-byte tampering,
output cancellation, killed process group, partial-send deletion retry and TTL.
Failures leave no available artifact, and cleanup accounting is checked.

Saved small artifacts: child-small.docx, child-small.pdf, http-normal.docx and
http-queue.docx. The three DOCX packages passed ZIP/XML/relationship/font/image
inspection in artifact-inventory.json; none has been visually verified in Word.

### Attributed compatibility failure and held acceptance

The failing API test calls the unchanged FlowDocMake generate_document_task
MCP tool. Current plugin scripts/compatibility.mjs pins released Core SHA
`13673f22cca9667e88125dd4631b0b398c912b8e96c6734a2932b5ff27f3a8ad`.
Its task-tools.mjs line14 requires that exact hash. The I3 candidate has a
different hash, so the tool correctly returns TASK_CAPABILITY_UNSUPPORTED with
taskId:null before allocating its job. Service direct HTTP and historical
direct PDF clients pass; this is an intentional plugin compatibility guard,
not an unlocated rendering timeout. Attribution is saved in
plugin-compatibility-attribution.json; the original failing test is unchanged.

No plugin runtime, compatibility allowlist or test expectation was changed to
force acceptance. Its owner scope is outside the authorized I5 paths. I5 stays
unaccepted until compatible candidate-plugin handling is reviewed/authorized
and the affected positive check passes. No commit was made while this check
remains failed. The final review's Important finding is retained.

### Retained limits and next decision

The exact Core package has two explicit limits encountered here: required
text/image groups need a bounded authored tail, and unavailable image placements
cannot be written through its complete-resource DOCX API. The measured long
line envelope is523.848pt against481.89pt available width; it is retained as an
unsupported/no-artifact test. A supported short Thai/Latin fixture exercises
actual image delivery. Missing/unusable placements return DOCX_UNSUPPORTED;
Service neither fabricates placeholders nor silently deletes source nodes.
PDF's omission behavior remains covered and unchanged. No Core guard was
weakened to pass a fixture. Details: group-envelope-diagnosis.json and failure
logs; initial raw XML text-run assertion was corrected to parsed joined text.

Next recommended work is an explicitly bounded candidate compatibility plan for
FlowDocMake before further acceptance/I6. Preserve the released plugin pin and
package; do not auto-bless or bypass an unknown Core hash. SRS98, Word fidelity,
full semantic coverage, production/mixed-worker rollout, main/release merge and
publishing remain unaccepted and untouched. Isolated scratch containers/network
are removed after proof capture; the worktree, candidate image and evidence are
retained for the next authorized decision.

## I5 scope amendment plan — isolated FlowDocMake candidate compatibility

Status: **PLAN ONLY, 2026-10-22**. The owner asked to finish the compatibility
blocker inside I5 and see scope/tests before implementation. This amendment
replaces the earlier prohibition on candidate-plugin implementation only for
the isolated paths below. It does not authorize I6, SRS, installation or release.
I5 remains NOT ACCEPTED until its failed positive API regression passes.

Goal: a separately built FlowDocMake candidate accepts exactly the reviewed I3
Core artifact and passes the original MCP/PDF integration check, while release
FlowDocMake keeps its existing exact pin and refusal behavior.

Architecture: retain one compatibility checker for preflight and task tools;
extract its expected version/hash tuple into a small fixed profile module.
Release source keeps the release profile. The existing package builder gains
an explicit candidate-output mode which emits a separate bundle with the
reviewed candidate profile. Selection happens when building that bundle, never
from HTTP claims, request arguments, a runtime allowlist or an environment hash.

Spec: this plan's I3 archive identity, I5 acceptance/checkpoint and this owner's
2026-10-22 scope amendment. Owner Project Control for FlowDocMake runtime/tests
and packaging; Service is the unchanged I5 integration consumer. Active role
Planning Partner, with Cross-Repo Boundary Reviewer responsibility. Single-room
execution/Phase/Checklist IDs N/A; target is the existing I5 checklist. Work Size
M; Risk Tier bounded because compatibility trust changes are confined to a
non-installed artifact. No production trust decision is implied.

### Exact bases and isolation

- Project Control verified base: `c950688823a9fc436e0302045d9319a389f4bf6a`.
  Planned development branch `codex/docx-flowdocmake-i5`; worktree
  `C:/Users/nekot/Documents/Codex/2026-10-22/docx-core-service-integration/project-control`.
  Verify/reuse a suitable attached lane or create this isolated owner worktree
  at implementation time; do not edit runtime in the primary main checkout.
- Keep using Service lane `.../docx-core-service-integration/service`, HEAD
  `b9ce2f7f9b4572bde2bdd1ad74a0b5d9366b6ef3` plus the18 frozen I5 files in
  `i5-evidence/final-manifest.json`. Recheck every hash before work. Preserve
  the uncommitted candidate; no reset, stash replacement or blanket copy.
- Reviewed tuple: Service0.4.9 / Core0.4.7 / SHA256
  `067b7678c410e7413968159f7495fb3b0e6f3909f9c14d51eae20f7e5b7f4c3e`.
  Archive remains `vendor/flowdoc-core-docx-candidate.tgz`.
- Release tuple remains Service0.4.9 / Core0.4.7 / SHA256
  `13673f22cca9667e88125dd4631b0b398c912b8e96c6734a2932b5ff27f3a8ad`.
- Output/proof root: a new `i5-evidence/compatibility/` directory. Candidate
  package id/version: `flowdocmake-docx-i5-candidate` /
  `0.2.8-candidate.docx-i5.1`; no tag/publish/install or global MCP registration.
  Configuration, credentials, scratch DB/storage/network and loopback port are
  separate. Require explicit FLOWDOCMAKE_CONFIG; no home-config fallback for
  the candidate entry. Primary plugin/cache/global config remain untouched.

### Allowed files and interfaces

Project Control isolated source lane only:

- Add `plugins/flowdocmake/scripts/compatibility-profile.mjs` exporting the
  existing three-field `supported` tuple with unchanged release values, plus
  separate candidate metadata. Do not put channel/id into supported: existing
  assess() deliberately compares every tuple field against runtime identity.
- Modify `plugins/flowdocmake/scripts/compatibility.mjs` only to import/re-export
  that tuple. Preserve exact equality, contract, port, font and reader checks.
  task-tools.mjs and server.mjs continue consuming this same checker/profile;
  do not weaken their checks or independently maintain two hash lists.
- Add `plugins/flowdocmake/scripts/candidate-entry.mjs`, a thin entry used only
  by the generated candidate bundle. Require explicit absolute config, verify
  config.pluginRoot resolves to that bundle and its URL is loopback, and check
  the selected Service's vendor archive against the reviewed profile before
  loading the existing server runtime. No global defaults or automatic retry.
- Extend `tools/build-flowdocmake.mjs` with explicit
  `--candidate-profile <path> --out <new-directory>` mode. The reviewed input
  fixture is `tests/fixtures/flowdocmake-docx-i5-profile.json` containing the
  exact tuple/id/version above. Hash actual archive bytes and compare with
  that supplied expected pin; never derive approval from observed bytes.
- Candidate output contains the same server/task/client/checker code, its fixed
  profile module, and a thin server.mjs wrapper around the copied original
  server runtime. Candidate entry is not used by default release packaging.
  Generate package metadata and guide snapshot through this builder, including
  source/provenance and per-file hashes. Reject an existing output, source
  package, installed-cache destination, or unknown/malformed profile before
  writing. Do not patch generated guide snapshots manually.
- Add `tests/flowdocmake-candidate-compatibility.test.mjs` and
  `tests/flowdocmake-candidate-preflight.test.mjs`; extend
  `tests/flowdocmake-task-tools.test.mjs` only for the new strict negative cases.
  Existing release assertions remain intact. No unrelated authoring changes.

Service source, Core code/archive and `tests/task-api.test.mjs` remain unchanged.
Select the built candidate through STAGE5_PLUGIN_ROOT in the verification image;
retain independent release/historical plugin copies for negative/old-client
checks. This change is to the test environment's selected package, not to the
positive assertion that failed. Keep the actual Service source/package hashes
identical to the frozen I5 candidate when reusing results.

### Execution order and test contract

Required execution skill: executing-plans with TDD, inline in this chat. Do not
spawn implementers or create separate Work-room ceremony. Future implementation
records its current host/model decision; one fresh final reviewer may use the
available gpt-6-astra/medium independently. This turn makes no model override.

1. **Freeze inputs and reproduce the blocker.** Inventory the two owner lanes,
   approved archive, primary release-plugin/cache/config hashes and existing
   I5 proof. Start only dedicated scratch resources. Run the unchanged failing
   MCP/API case with release plugin against candidate Core: expect
   TASK_CAPABILITY_UNSUPPORTED, taskId:null, no additional job/output. Record
   this RED; do not change the test's success expectation.
2. **Build the candidate with failing-first tests.** Tests require distinct
   package metadata and exact supported tuples; reject wrong/missing hash,
   incorrect versions, invalid profile, absent explicit config, redirected
   pluginRoot and overlapping/existing output. Implement the small profile,
   wrapper and builder changes above. Assert default release outputs/behavior
   and canonical guide bytes remain unchanged; candidate inventory binds the
   approved profile, Core archive and actual emitted files. Build twice into
   fresh directories to detect accidental dependence on global configuration.
3. **Prove both profile boundaries.** Run the existing release compatibility and
   task-tool tests plus the new candidate tests. Set their Service dependency
   environment explicitly; a skipped native/MCP suite is not PASS. Exercise:

   | Plugin profile | Core identity in isolated Service | Expected |
   | --- | --- | --- |
   | Release | Released pin13673... | Accept unchanged contracts |
   | Candidate | Reviewed pin067b... | Accept unchanged contracts |
   | Release | Candidate pin067b... | Reject before allocation |
   | Candidate | Released pin13673... | Reject before allocation |
   | Either | Unknown hash, wrong version or missing capability | Reject before allocation |

   Representative command in the owner lane:
   `node --test tests/flowdocmake.test.mjs tests/flowdocmake-snapshot.test.mjs tests/flowdocmake-task-tools.test.mjs tests/flowdocmake-candidate-compatibility.test.mjs`.
4. **Check actual preflight, not only advertised HTTP metadata.** Start the
   frozen candidate Service on a dedicated loopback port. Call the candidate
   MCP get_flowdocmake_context with explicit config and verify ready:true,
   actual Docker identity/port, computed vendor hash and guide integrity before
   mutation. Test a mismatched advertised hash, wrong port/container identity,
   corrupted guide/profile and tampered vendor archive in disposable runtime
   clones; require ready:false and no task creation. Never alter the accepted
   worktree/archive or real installed plugin for negative tests. Check source
   equality, restore/remove the disposable clone, then repeat the positive
   preflight. Do not claim Docker inspection happens on every task request;
   retain the existing independent preflight and task capability checks.
5. **Close the original I5 regression.** Prepare a test image from the unchanged
   I5 Service with the built candidate at the selected plugin root. Run the
   complete `tests/task-api.test.mjs`: require14/14, including the original
   MCP/proxy generation, keyed/anonymous images, partial findings, model18,
   lookup and cancellation assertions. Keep release-profile rejection as an
   additional negative test, never replace this positive test with rejection.
   Run affected queue/client checks with the selected package. Retain old PDFs
   and actual DOCX HTTP normal/queue outputs. Reuse the earlier21 DOCX,29
   processing,98 contracts and22 legacy results only when corresponding files,
   dependencies, configuration and relevant environment are demonstrably equal;
   otherwise rerun the affected file, without broadening to I6/full SRS.
6. **Review and finish I5.** Map every criterion to final passing evidence and
   the exact built plugin/Service/Core identities. One whole-extension review
   covers the new owner paths and trust boundary; no reviewer per probe. If
   Important findings need repair, allow one bounded correction/recheck, then
   stop for scope review rather than growing a compatibility framework.
   Commit only tested bounded changes on the two development lanes after
   affected checks pass. Leave main/release, tags, installed cache and global
   configuration unchanged. Update this existing checkpoint to PASS I5 only
   after the positive regression and required new guards all pass.

### Acceptance, limits and stop rules

Required: release behavior unchanged; candidate build/config isolated; exact
archive checks still active at preflight and exact capability matching active
at task tools; positive MCP/API14/14; negative cross-profile/tamper cases;
source-to-proof identity and relevant regression coverage; no skipped mandatory
checks; one final review with no unresolved Important finding.

I5 closes compatibility for existing FlowDocMake PDF task/lookup tools and the
already implemented Service DOCX API. It does not add a DOCX argument/parser to
FlowDocMake's PDF client. Service DOCX normal/queue support remains covered by
I5 tests. Broader tool-level DOCX UX, Word/all-page fidelity and I6 remain separate
scope. Retain the existing DOCX limits for required text/image relations and
unavailable image placements; no source deletion, placeholders or Core retuning.

Proof Budget: one initial RED, focused profile/build/preflight/MCP tests, one
complete affected API run and necessary queue/client regressions, identity-based
proof reuse, one final review and at most one bounded repair pass. Document
Budget: this existing plan plus the existing I5 proof directory; no new Work,
Evidence/map records or release guide promotion. Canonical data/maps unchanged.
Docker CLI, Poppler and Python pypdf/Pillow are available in this planning
inspection; Engine readiness and isolated host/container wiring must still pass
at execution. If a guard can pass only by trusting HTTP's claimed hash, changing
the release profile, changing the accepted Service/Core candidate or weakening
an old assertion, stop and return the concrete conflict. No silent scope growth.

Planning disposition: scope is defined for completing I5; no runtime, package,
worktree, database, installed plugin or release change is performed by this
amendment. The owner requested this summary before implementation.

## I5 compatibility execution checkpoint — PASS, 2026-10-22

Authority Boundary: Project Control owns this bounded cross-repository status.
This checkpoint accepts I5 in isolated development only. It does not establish
release, SRS, Word fidelity, I6 or production readiness. The earlier rejected
I5 checkpoint and planning amendment above remain historical evidence.

The owner authorized implementation of the I5 amendment in this chat. Active
roles Product Implementation Agent / Evidence Reviewer; execution IDs N/A for
single-room work. No separate execution registry or map promotion was created.

Implemented and committed on isolated development branches:

- Project Control `codex/docx-flowdocmake-i5`, commit
  `ac8b6103f43c04a88d4f5c6d54a0f154d0f877ee`, seven files: fixed compatibility
  profile extraction, candidate entry, existing builder extension, reviewed
  profile fixture and two focused test files. Actual native-managed checkout:
  `C:/Users/nekot/.codex/worktrees/docx-flowdocmake-i5/flowdoc-project-control`.
  Same approved base; only the proposed checkout locator changed.
- Service `codex/docx-service-integration`, commit
  `8690193b73b14554c63a9aebe5c888edcf780946`, exactly the18 previously frozen
  I5 files. All18 byte hashes still match `i5-evidence/final-manifest.json`;
  this extension changed no Service/Core source or original API assertion.
- Core remains the reviewed I3 archive SHA256
  `067b7678c410e7413968159f7495fb3b0e6f3909f9c14d51eae20f7e5b7f4c3e`.
  Released profile still requires `13673f22...`; exact equality is preserved.

Proof root (local durable files):
`C:/Users/nekot/Documents/Codex/2026-10-22/docx-core-service-integration/i5-evidence/compatibility/`.
Final identity/coverage inventory: `final-verification.json`. Built package:
`candidate-final/`, id `flowdocmake-docx-i5-candidate`, version
`0.2.8-candidate.docx-i5.1`; all52 emitted-file hashes verified.
Guide snapshot identifies the canonical guide base; final-verification also
binds the actual seven committed source/test file hashes, so it does not
misrepresent that guide base as the candidate implementation commit.

Acceptance evidence:

- Reproduced original release-plugin/candidate-Core refusal in
  `red-original-api-repeat.log`: TASK_CAPABILITY_UNSUPPORTED, taskId:null.
  The first fresh run timed out and remains inconclusive, not hash evidence.
- Unchanged complete `tests/task-api.test.mjs` **14/14** in `task-api.log`;
  queue/API and client checks **11/11** in `queue-client.log`.
- Native release, snapshot, task gates, builder and actual Docker preflight
  **12/12**, no skipped checks, in `final-native.log`. Review corrected two
  negative probes to supply a valid archive and assert the intended failure;
  affected builder tests rerun **3/3** in `final-builder-guards.log`.
- Both exact profile pairs accept; opposite/unknown hash, wrong version and
  missing capability refuse task tools before allocation. Config redirection,
  nonloopback URL, absent explicit config, wrong archive/profile, existing or
  source/cache output are rejected. Default release packaging retains guide
  bytes and release values. Two fresh candidate builds agree except the
  intentional absolute launcher location.
- Real preflight verifies Docker identity/computed archive hash and loopback
  port. Wrong container/port, guide corruption and disposable-container archive
  tampering refuse readiness; original bytes restored and positive repeated.
- Fresh whole-extension review: no Critical/Important finding. One Minor test
  coverage issue corrected and checked. `final-verification.json` records it.
- Reused prior DOCX21, processing29, contracts98 and legacy22 checks only after
  confirming frozen source/package/image equality. These are bounded affected
  checks, not a claim that the full Service suite or Word acceptance ran.
- Final bundle generated real MCP/model18 PDFs in `artifacts/`; the focused
  capture selected one test and left13 unselected. It does not replace the
  complete14/14 run. Full run and final capture use identical consumed runtime
  bytes; only the generated launcher locator differs.

Explicit plan interpretation: the existing independent checks are preserved.
Preflight verifies actual Docker/archive/port/guide identity. Advertised
`documents` hash/version mismatch is checked by task capability before task
allocation. Step4's literal request for preflight ready:false on that HTTP field
is not claimed as passed; it was corrected to the architecture's two distinct
checks, with the fresh reviewer finding no material safety defect. No HTTP hash
was promoted to runtime authority and no compatibility guard was weakened.

The generated MCP launcher binds its absolute build location so configuration
cannot redirect loading to a different plugin. Rebuild to relocate it. The
builder requires explicit `--core-archive` input and compares actual bytes to
the reviewed expected profile; it does not learn an allowed hash from the input.

Boundary verification: both development checkouts clean after commits; all99
primary release-plugin/cache/global-config file hashes unchanged. Primary
runtime/release branches, installed plugin and global MCP config are untouched.
This status append remains in the existing Project Control plan; no main/release
integration, publish, install, tag or push was performed.

I5 is now accepted. FlowDocMake's existing task client still produces PDF;
Service's normal/queue API supports DOCX from the same Core input, with omitted
Output-Format retaining PDF. Existing DOCX required text/image envelope and
unavailable-image limitations remain explicit. SRS, Word/all-page comparison and
broader tool-level DOCX UX remain outside this checkpoint. Stop here as requested.

## I6 execution checkpoint — IN PROGRESS / WORD PENDING, 2026-10-22

Authority Boundary: Project Control owns this bounded acceptance status under
this existing plan. Owner authorized I6 only and explicitly forbids I7, SRS98
and release integration. This entry does not accept I6 or promote product maps.
Single-room execution IDs N/A; active roles Product Implementation Agent for
the acceptance harness, then Evidence Reviewer. Runtime candidate stays frozen.

Service lane remains at I5 commit8690193b73b14554c63a9aebe5c888edcf780946 with
six uncommitted I6-owned files: README.md, docs/usage.md,
tests/task-docx-api.test.mjs and three tests/fixtures/docx-i6 JSON files. No
Core/Service runtime or plugin code changed. Owner docs retain Authority Boundary;
README installed-artifact pin and latest migration now match candidate/025.
All18 frozen I5 source/package/archive hashes and99 protected plugin/cache/config
hashes match. Release branches and installed/global configuration are untouched.
No commit until mandatory I6 acceptance checks are resolved.

Proof root:
`C:/Users/nekot/Documents/Codex/2026-10-22/docx-core-service-integration/i6-evidence`.
`current-checkpoint.json` binds the actual files, frozen verification image,
per-file test evidence, limits and pending Word paths. Verification image
sha256:d32cd52be9cce3eff30296fd31304b6d606ba8c73a915ed1b1667fcc6b0ce0f0
contains a copied immutable harness; subsequent checks did not edit it.

Completed bounded checks:

- Actual paired Service HTTP/DB/parent-child path:18/18. Three small fixtures
  cover Bai Jamjuree four real faces with mixed Thai/English multiline text,
  headings/images (JPEG and alpha PNG), merged table cells, and model19 TOCs,
  visible/empty headers and compact page fields. Each uses default PDF,
  explicit PDF and DOCX in both normal and queue-v1 modes. Original business,
  template and multipart hashes match within each pair; per-task generated
  image IDs and original-image checksums remain individually recorded.
- Packed Core consumer exports four paired small fixtures through the literal
  same frozen document object; unchanged I0 binding/table PDF byte hashes pass.
  Sarabun four faces and a24-row table exercise repeated column headers across
  two PDF pages. This uses existing small Core fixtures, not the98-page SRS.
- Every small DOCX ZIP/XML/relationship graph passes; actual embedded fonts,
  image drawings, enabled repeated headers, horizontal/vertical merges and
  fields are inventoried. ZIP directories and OOXML false properties are not
  counted as images/enabled headers. Nine selected paired-PDF reference pages
  were rendered and visually reviewed. No Word appearance claim yet.
- Six default/explicit-PDF pairs are either exactly byte-identical or differ
  only in the recorded PDF trailer IDs for image-bearing tasks. All bytes
  outside those exact ID ranges are identical. Full raw hashes/IDs retained
  in pdf-pair-identity.json; no content/layout difference was normalized away.
- npm run build passes. Actual npm run check:api passes three distinct PDFs,
  consumption410, queued/running/succeeded restart handling, retained repeat
  downloads and post-restart consumption. Default Docker subnet allocation
  first failed because available pools were exhausted; only this trial received
  explicit10.250.248/249 subnets. No unrelated network was removed. Actual
  runtime image's Core archive independently hashes to reviewed067b...f4c3e.
- Sampled Linux VmRSS separates Service-manager parent and real render workers;
  raw samples/peaks in isolated/task-docx-api/rss.json. These are not output
  file sizes or a whole-machine memory guarantee. Supported paired jobs used
  actual1GiB containers without changing memory/worker guards.

Full-suite result must not be flattened into PASS:

The first one-process npm test at1GiB failed60 tests (452passed,56skipped) after
an MCP timeout and an orphaned native Service holding the DB-wide processor
lock. The diagnostic1.5GiB run was also not green:11failed,552passed,23skipped,
8errors. It cannot qualify the queue path because queue-resources.ts checks
memory.max equals exactly1GiB; extra RAM makes that capability unavailable.
Some skips in those failed runs are failed-hook fallout, not acceptance proof.
The I6 harness was being prepared during the diagnostic and its failed setup
is superseded only by the final frozen18-test run, not represented as passing.

Seven affected files were then checked independently in fresh1GiB containers
and dedicated DBs: new API18, output-format26, DOCX processing6, processing29,
queue API8, scheduler13 all pass. CLI's unchanged assertions pass3/3 with an
explicit15s runner budget: its existing test includes a5s DB connection timeout
plus multiple child starts, exceeding the default5s test budget. Product
connection/render/queue deadlines were not changed. Existing owner authorization
to relax the checker timer is reused; no production timeout was removed.

Source-matched aggregate coverage across122files is581passed/5optional skipped
using the documented runs. This is per-file coverage, not a claim that the
one-process default command passed. The five optional external-fixture tests
remain skipped, never PASS. Monolithic-suite setup remains a reported limitation
for I6 acceptance; no guard or assertion was weakened to hide it.

Existing capability limits remain explicit. The original long scoped-header
fixture fails the conservative band envelope without publishing bytes, and
fixed-width page-field slots remain unverified. Their original inputs/failures
are retained. The short-header/empty-header/compact-field fixture is separately
authored and hashed; it is not a rewrite or claimed successful export of the
rejected original. No Core/PDF baseline tuning or silent content deletion.

Word checkpoint requested from owner, max four files, in
`.../i6-evidence/word-review/`:01-core-navigation.docx,02-core-table-flow.docx,
03-service-typography.docx,04-service-merged.docx. Owner should update every TOC
and page field in01, then save same-name PDFs beside these DOCX files. Frozen
paired references remain separately under reference-pdf/ to prevent overwrite.
No Word PDFs have been received at this checkpoint. All-page/content comparison,
I6-only fresh final review, explicit full-suite limitation disposition and
acceptance/commit remain pending. This does not start I7.

Dedicated trial containers/networks/volumes were stopped/removed after saving
proof. Frozen source/image and evidence remain recoverable. No SRS98, installation,
main/release integration, publish, push or tag was performed. Resume only the
remaining I6 work when the owner returns Word PDFs; stop before I7.

## I6 Word return and acceptance disposition — NOT ACCEPTED, 2026-10-22

Authority Boundary: bounded I6 verification status only, owned by Project
Control under this existing plan. The owner returned the four requested Word
PDFs. This completes their inspection; it does not waive an integration gate,
start I7, authorize SRS98, or promote release/map truth.

All four PDFs identify Microsoft Word for Microsoft365 as producer. Every one
of their9 pages was rendered and visually inspected against the preserved paired
PDFs. Physical page counts agree: navigation5, table-flow2, typography1, merged1.
The24 table rows keep the14/10 page split and repeated column header. Horizontal
and vertical merges, cell text, mixed Thai/English, four visible face styles,
JPEG and alpha PNG remain present. Whole-document/Section TOCs retain their
entries, displayed targets3/8,12 valid links to physical pages3/5, and logical
footer sequence1,2,3,7,8. Empty headers remain empty. Raw PDF text and all source/
returned/reference hashes are saved; no reference or DOCX input was overwritten.

Recorded differences are not hidden or tuned away:

- Word adds dot leaders after native TOC refresh; the reference has none.
- Sample ROW01/14/15/24 extracted word boxes are2.511–2.627pt lower and0.291pt
  right of reference. These are Poppler word bounds, not glyph baselines.
- The empty-header Section title on physical page4 has word-box yMin86.444pt
  versus79.892914pt reference, delta6.551086pt. Footer bounds differ1.283149pt.
- The last bolditalic Thai descender sits very close to the first image, closer
  than reference. Paired high-resolution crops were inspected; this supports
  reporting tight spacing, not a definitive clipping or pixel-equivalence claim.
- Word text extraction can separate combining marks with spaces. Visible text
  was reviewed independently. TimesNewRoman appears only for whitespace in the
  PDF resources; it is not evidence of a visible main-text fallback. Embedded
  Word subset aliases alone do not establish the original family identity.

Evidence lives in the existing i6-evidence directory: word-review-result.json,
word-inspection.json, word-geometry-links.json, word-font-usage.json and rendered
word-inspection/ pages/crops. current-checkpoint.json now points to this receipt;
its earlier pending-Word state remains in pre-word-current-checkpoint.json.
The two Core files use existing small fixtures, including the historical table
fixture label containing SRS; no98-page SRS document was run.

One fresh whole-I6 read-only review (executing-plans requirement, not I7) found
no Critical source issue and two Important findings. The missing test setup
instructions were corrected in Service README/usage: dedicated DATABASE_URL,
exact1GiB Linux memory.max, reviewed Bai Jamjuree four-face/OFL input folder,
existing writable FLOWDOC_TASK_PROOF_DIR and explicit candidate plugin roots.
The15s checker budget leaves product deadlines intact. Existing setup/artifact/
migration documentation check passes1 test;3 optional external-height tests
remain skipped, not PASS. No test, runtime, Core or plugin behavior changed in
this bounded documentation correction; earlier affected test evidence is retained.

The other Important finding remains OPEN: I6 explicitly requires a passing
complete Service npm test. Actual combined runs failed;581 passing aggregate
assertions from source-matched runs across122files do not replace that mandatory
gate. The owner has supplied no waiver, and Word inspection does not provide one.
I6 is therefore NOT ACCEPTED, with its Word small-case checkpoint completed and
the complete-suite prerequisite blocking closure. No I6 commit was made.

All18 frozen runtime/package/archive files and99 protected plugin/cache/config
files still match their earlier hashes. Only the six I6-owned test/fixture/docs
files remain uncommitted. No broad retry, converter/PDF tuning, SRS98, I7, release
integration, install, publish, push or tag follows this disposition. The remaining
issue belongs to I6's test-runner/environment setup; it must not be relabelled as
an accepted limitation to report a false I6 PASS.

## Local development integration and lane cleanup — 2026-10-22

Authority Boundary: Project Control records the owner's explicit local integration
and cleanup request in this conversation. Single-room inline scope; execution IDs
are not applicable. This is development integration, not I6 acceptance or release.

The previously accepted commits were integrated by exact fast-forward:

- Core primary `codex/template-binding`: `8f8a739` to `e53e4a2`.
- Service primary `codex/template-registry`: `32d7857` to `8690193`.
- Project Control `main`: `c950688` to `ac8b610` before this status checkpoint.

There were no merge conflicts or runtime source repairs. Primary Core and Service
lockfile dependencies were installed with scripts disabled; both TypeScript builds
passed. The selected Core DOCX/package checks passed63 assertions, Service DOCX
receipt checks passed3, and Project Control candidate packaging checks passed3.
A Windows invocation of two DB-dependent Service files failed at their explicit
DATABASE_URL prerequisite; it is not PASS and does not replace Linux evidence.
I5 evidence is reused against unchanged Git candidate trees and the exact pinned
Core archive. All18 frozen Service file hashes matched before restoring native
checkout line endings; the archive hash remains unchanged. This check establishes
identity, not a new complete Linux/DB test run.

I6 remains NOT ACCEPTED: the combined Service suite gate is still unresolved.
Its six uncommitted test/fixture/documentation files were copied byte-for-byte to
`C:/Users/nekot/Documents/GitHub/flowdoc-service` and independently preserved under
`C:/Users/nekot/Documents/Codex/2026-10-22/docx-core-service-integration/integration-preserved/i6-pending`.
They remain uncommitted in the primary Service checkout; no I6 PASS or waiver is
inferred from the integration request.

Before removing product worktrees,583 files (ignored artifacts/dist and pending
I6 inputs) were preserved and SHA-256 verified. The preservation manifest is
`C:/Users/nekot/Documents/Codex/2026-10-22/docx-core-service-integration/integration-preserved/manifest.json`.
Existing i1–i6 evidence directories and the location-bound candidate bundle remain
at their original sibling paths. Historical source locators ending in `/core` or
`/service` now refer to removed trial checkouts: use the primary repositories for
current source, immutable commit IDs for history, and integration-preserved for
saved local outputs. Historical test configuration may require explicit root
rebinding before reuse; installed plugin/global configuration was not changed.

Only the three fully merged DOCX task lanes are cleanup targets. Core/Service
worktrees and local task branches were removed normally after transferring I6;
Project Control's managed lane is archived through the native worktree tool.
Primary development/release branches, tags, unrelated work, Docker evidence
images and original Word/PDF artifacts are retained. No SRS98, I7, release,
installation, remote push or remote branch deletion is authorized by this closure.

## Pagination rules parity experiment plan

Date: 2026-10-22. Status: **PLAN ONLY — NOT EXECUTED**.

> For agentic workers: execute only a subsequently authorized experiment stage.
> This planning request authorizes the Project Control prose below, not Core
> patches, fixture generation, package builds, exports or Word automation.
> Use the workflow-economy policy for future execution; no closed I0–I6 context
> is reopened. The generic planning-skill product-repo output path does not apply.

**Goal:** ทดสอบว่าการแปลง explicit page breaks และการระบุ widow/orphan policy
ของ DOCX ทำให้ขอบเขตหน้าใกล้ PDF เดิมขึ้นหรือไม่ โดยรักษาเนื้อหาและโครงสร้างครบ.

**Architecture:** ตรึง template/request, ResolvedDocument, fonts/assets และ PDF
reference ก่อนทดลอง. เปลี่ยนเฉพาะ DOCX writer ทีละปัจจัย; Word ยังเป็นผู้จัดบรรทัด
และแบ่งหน้าจริง. ไม่อ่าน PDF coordinates/page cuts กลับไปสร้าง DOCX และไม่เพิ่ม
ตัวเลือกใน public API หรือ authored schema เพื่อเปิดโหมดทดลอง.

**Tech Stack:** Core TypeScript, pinned docx9.13.0/JSZip, existing PDF engine,
Microsoft Word on Windows และการตรวจ OOXML/ข้อความ/ภาพทุกหน้าของเอกสารสั้น.

**Spec:** Agreed design, Global Constraints และ docx-native-flow/1 ในเอกสารนี้;
กฎ page-break ของ Section–Area และ workflow-economy policy ยังคงใช้.
Reference สำหรับค่าเริ่มต้น Word คือ
[OOXML widowControl](https://learn.microsoft.com/en-us/dotnet/api/documentformat.openxml.wordprocessing.widowcontrol?view=openxml-3.0.1).
การแยก policy ออกจาก measured lines ดู
[React-pdf splitText](https://github.com/diegomura/react-pdf/blob/f765c957902eb1f0d15b1571d6f61e5818e8bc50/packages/layout/src/text/splitText.ts);
reference เป็นแนวทางออกแบบ probe ไม่ใช่ผลพิสูจน์ Word parity.

### Authority, scope and preconditions

- Writing classification: Project Control canonical plan; owner Project Control,
  role Planning Partner/Documentation Synthesizer. Single-room execution IDs,
  Phase/Checklist IDs: N/A. Work Size small for this plan, routine risk.
- Document Budget: เพิ่มในเอกสารเดิมนี้เท่านั้น. ไม่มี Work/registry/map/Evidence
  record ใหม่เพื่อวางแผน. แผนไม่เปลี่ยน I6 NOT ACCEPTED หรืออนุญาต SRS98/I7.
- Inspected source: Core `e53e4a284d5eb2596b531b55a12a83ab74ba8528`,
  Service `8690193b73b14554c63a9aebe5c888edcf780946`. ก่อนทดลองต้องตรวจ base,
  dependencies และ unrelated changes อีกครั้ง; ถ้าเปลี่ยนให้ทบทวนผลกระทบก่อน.
- Future code owner: Core. ใช้ isolated candidate เมื่อได้รับอนุญาต;
  ไม่แก้ primary checkout, Service/plugin/cache/config/DB, PDF source, package
  dependencies, font resources หรือ templates/data เดิมของผู้ใช้.
- ปัจจุบัน `src/layout/documentFlow.ts` รวม pending breaks และละ break ที่ต้นหน้า;
  `src/docx/sections.ts` เขียน break แต่ละตัวเป็น paragraph. `src/docx/text.ts`
  ยังไม่ระบุ widowControl. นี่เป็น source findings ไม่ใช่ผลทดลองใน Word.
- Native widowControl ที่ไม่ระบุสืบทอดจาก style; เมื่อไม่มีที่ใดระบุ OOXML ใช้
  การป้องกันบรรทัดเดียวโดดหน้า. ตรวจ settings/styles/paragraph ของ baseline
  จริงก่อนทดลอง ไม่อนุมานจาก constructor อย่างเดียว.
- Word build, font identities/embedding, page setup, field-refresh และ PDF-export
  procedure ต้องบันทึกก่อน freeze. ไม่ถือว่า producer ชื่อ Microsoft365 ระบุ build
  ครบแล้ว และไม่กำหนดให้ Service/server ต้องมี Word.
- Unknowns: native breaks หน้า table/ขอบหน้าพอดี และผล widow ใน cell เป็นคำถาม
  ของการทดลอง. วิธีทำให้ Word ตรงทุกฟอนต์/ทุก layout และ SRS เป็น deferred.

### Global constraints and review focus

- ใช้ source graph เดียวกัน; logical text, authored newlines, spans, relationships,
  table topology, images, numbering และ intentional blank sections ต้องคงเดิม.
- ไม่เพิ่ม forced line breaks/U+200B เพื่อเลียนแบบ physical wrapping ของ PDF.
  ไม่ย่อฟอนต์ เปลี่ยน leading/margins/padding ขยับ baseline หรือแก้ PDF ให้ผ่าน.
- ไม่ปิด keepNext/keepLines ของกลุ่มที่ตั้งใจไว้ และไม่ผ่อน allowBreak/repeated
  headers/merged-cell หรือ unsupported-content policy เพื่อให้จำนวนหน้าตรง.
- แยก authored blank section/cover ออกจากหน้าว่างที่เกิดจาก redundant break.
  Empty TextBlock, authored empty line และ fixed spacer ยังใช้พื้นที่จริง;
  ห้ามถือว่าเป็น non-rendering เพียงเพราะไม่มีตัวอักษรที่มองเห็น.
- ใช้ scalar source IDs/offsets เป็น locators ไม่ใช้ชื่อเอกสาร/node ID เลือก behavior.
  งบ runtime/output/cancellation เดิมคงไว้; ไม่มี download/install ตอน export.
- Review Focus: table ตามหลัง break; break ที่ section edge/หน้าเต็ม; blank/cover
  ที่ตั้งใจไว้; authored LF เทียบกับ natural wrap; protected keep chains/cell split.
  แต่ละข้อมี probe/เกณฑ์ด้านล่าง ไม่ขยายการทดลองไปปรับ renderer เรื่องอื่น.

### Controlled variants and proposed file boundary

| Variant | ความต่างจาก A ที่อนุญาต | คำถาม |
| --- | --- | --- |
| A baseline | Core ปัจจุบัน ไม่มี patch | ความต่างเดิมอยู่ตรงไหนและเกิดซ้ำได้หรือไม่ |
| B1 break-only | รวม leading/consecutive/trailing break requests ภายใน Section เมื่อพิสูจน์จาก source ว่า redundant; คงวิธี emit break เดิมสำหรับ boundary ที่เหลือ | หน้าว่าง/ขอบเขตที่ผิดลดลงจากการรวมคำขอหรือไม่ |
| B2 native-boundary probe | จาก B1 เปลี่ยนเฉพาะ boundary ก่อน ordinary TextBlock เป็น native pageBreakBefore บน paragraph ถัดไป; table ใช้ B1 เดิม | การลด break paragraph ช่วยและไม่สร้างหน้าว่างเมื่อ Word ขึ้นหน้าเองแล้วหรือไม่ |
| C widow-only | จาก A ระบุ widowControl:false เฉพาะ ordinary body/cell paragraphs ที่ไม่ได้เป็น protected group; explicit breaks และ keep flags คงเดิม | Default widow เป็นเหตุของการเลื่อนบรรทัด/หน้าหรือไม่ |
| D combined | รวม break variant ที่ผ่านกับ C เท่านั้น | มี interaction หรือ regression เมื่อใช้ร่วมกันหรือไม่ |

B2 เป็น optional probe หลัง B1; ไม่สรุปผล paragraph เป็นผลของ table.
ถ้า B2 ไม่ดีกว่า B1 ให้คง B1. ถ้า C ไม่ดีกว่า A ให้คง widow policy เดิม.
D ทำเมื่อทั้งสองปัจจัยมีผลที่เข้าใจและไม่ถดถอย; อาจเลือกเพียงปัจจัยเดียวหรือไม่เลือกเลย.
C จำกัด scope `nodes`, whole unsplit text fragment, ไม่มี TOC/page fields และ
ไม่มี effective keepNext/keepLines; ไม่เปลี่ยน band/TOC/generated image paragraphs
หรือ fragments ของ protected reading group. ตรวจ eligibility ก่อน emit flags.
แต่ละ variant มาจาก base เดียวกับ scoped patch manifest ที่บันทึกไว้ ไม่ใช้ public
feature flag, environment fallback หรือแก้ OOXML ใน package เก่าหลัง serialize.

Future allowed Core targets, only after stage authorization:

| Path | Responsibility |
| --- | --- |
| `src/docx/sections.ts` | break emission; ห้ามเปลี่ยน section geometry/numbering/bands |
| `src/docx/tables.ts` | body-flow pending break และส่ง context ว่า paragraph เป็น ordinary/protected; ห้ามเปลี่ยน grid/padding/allowBreak |
| `src/docx/text.ts` | optional internal pageBreakBefore/widowControl emission; คง text/style/run/keep semantics |
| `tests/docx/paginationRules.test.ts` (new) | source immutability, OOXML policy, break normalization และ protected controls |
| `tests/fixtures/docx-pagination-rules/` (new) | public synthetic definitions/requests/expected logical boundaries เท่านั้น |
| `scripts/probeDocxPagination.mjs` (new) | เรียก public Core APIs, freeze inputs และเขียน experiment artifacts; ไม่เป็น runtime dependency |

ไม่มี planned change ใน `src/layout/`, `src/pdf/`, `native/`, composition/binding,
Service หรือ schema. ถ้าต้องแก้ส่วนเหล่านี้เพื่อให้ probe ผ่าน ให้คืนผลพร้อมเหตุผล
และหยุดรับขอบเขตใหม่ก่อน ไม่ซ่อมขยายเอง.

### Probe packets

ใช้เอกสารสั้นสาม packets; scenario markers เป็นข้อความสังเคราะห์ใน source
เดียวกันทุก variant. เลือก font จาก resource bytes เดิมที่ตรวจได้ ไม่ใช้ fallback.

| Packet | กรณีที่ต้องครอบคลุม | สิ่งที่ต้องดู |
| --- | --- | --- |
| P — paragraph boundaries | ไม่มี break เป็น control; leading break; A→BR→BR→B; trailing break; เนื้อหาก่อน boundary ต่ำกว่า/พอดี/เกินพื้นที่ PDF เล็กน้อย | A/B อยู่ครบหนึ่งครั้ง, boundary ตามคำขอ, ไม่มีหน้าว่างเพิ่ม; บันทึก Word edge จริงแยกจาก PDF |
| T — table/section controls | BR ก่อน table; table→BR ท้าย Section; trailing+leading BR รอบ Section transition; next section เปลี่ยน orientation/numbering/bands; authored blank/cover และ consecutive blanks | ไม่เพิ่ม paragraph แล้วดัน table/terminal mark ไปอีกหน้า; รักษาหัวตาราง spans และ intentional blanks |
| W — widow isolation | ย่อหน้า3–5บรรทัดที่เหลือหนึ่งบรรทัดต้น/ท้ายหน้า; body และ cell ของแถว allowBreak=true; authored-LF และ natural-wrap แยกกัน; heading/table และ tail/image เป็น protected controls | เปรียบเทียบ line-to-page assignment โดยไม่เปลี่ยน wrap/text/font/keeps; ตารางไม่ถูกบังคับรวมทั้งก้อน |

ใช้ Thai/Latin/mixed ใน packets โดยมีหนึ่ง mixed-emphasis control; ไม่เปิด full
font×layout Cartesian matrix. Existing PDF tests ที่เป็น source expectations:
`tests/composition/areaDocument.test.ts` (leading/repeated/trailing breaks,
empty TOC และ breaks-only EMPTY_CONTENT), `tests/layout/pageSections.test.ts`
(exact fill/section transition), `tests/layout/coverPages.test.ts` (intentional blanks).
อ่านและ reuse ที่ตรงขอบเขต ไม่แก้ expected PDF เพื่อรองรับ candidate.

Breaks-only input ต้องยังปฏิเสธ EMPTY_CONTENT ก่อน export. Empty scoped TOC
และ empty ordinary Section เป็น diagnostic controls: field refresh/serialization
อาจมีพฤติกรรมเดิมต่างจาก PDF. บันทึกเป็น pre-existing gap ถ้าเกี่ยวข้อง;
ห้ามลบ bookmarks/TOC/Sections เพื่อทำให้คะแนนดีขึ้น. หาก gap ทำให้แยกผล break
ไม่ได้ ให้กรณีนั้นเป็น INCONCLUSIVE และคืนข้อเสนอแยก ไม่ขยาย scope แอบแก้.

Source-only normalizer ไม่รู้ตำแหน่งหน้าจริงใน Word. PDF y-position หรือการวัด
ข้อความของ Core ใช้ระบุกรณีทดสอบได้ แต่ใช้ตัดสินใจ suppress break ของ DOCX ไม่ได้.
Retained boundary ต้องใช้ native semantics และพิสูจน์ใน Word ตามชนิด next node.

### Experiment stages, artifacts and checks

- [x] **E0 — freeze baseline.** Closed for baseline preparation, with recorded
  differences and contract-bound exclusions; see E0 W mixed natural mapping and
  closure below. เมื่อได้รับอนุญาต ให้สร้างสาม packets กับ public
  validate/prepare/compose APIs; freeze template/request/ResolvedDocument และ
  font/image/package hashes. สร้าง PDF reference ด้วย renderer เดิมครั้งเดียว
  และ DOCX A. Word export A ด้วย build/ขั้นตอนเดียวกัน ตรวจทุกหน้าให้ baseline
  เกิดซ้ำได้โดย repeat A ของ W หนึ่งครั้งก่อนแก้ candidate. เลือก source-supported
  controls ก่อน freeze; baseline ที่ error/ไม่ exercise treatment ยังไม่เป็นผลลบ
  ของ candidate. เก็บ hashes ของ PDF references เดิมและใหม่ ตรวจคงเดิมหลังจบรอบ;
  candidate diff ต้องไม่มี PDF/layout/native changes. Existing I6 artifacts เป็น immutable regression
  inputs ไม่เขียนทับ ไม่เรียกเป็น baseline ของ synthetic source คนละชุด.
- [ ] **E1 — independent probes.** เพิ่ม targeted checks ก่อน patch ใน candidate;
  B1 ใช้ P/T, B2 ใช้ P เพิ่มหนึ่ง packet และตรวจว่า table fallback OOXML คง B1,
  C ใช้ W พร้อม protected controls. Check OOXML และ input hashes
  ก่อนเปิด Word. Native flags ต่างได้เฉพาะที่ variant ระบุ; styles/font/spacing/
  geometry/relationships ต้องคงเดิม. ไม่เชื่อ unit test แทน Word pagination.
- [ ] **E2 — decision and interaction.** ประเมินแต่ละ variant ตามกฎด้านล่าง;
  ทำ D เฉพาะเมื่อมีเหตุจากผล E1 และตรวจครบ P/T/W เดิมทั้งสาม packets เพื่อไม่ให้
  interaction ที่ไม่อยู่ใน subset หลุดการตรวจ. ไม่สร้าง source ชุดใหม่ให้ D.
  เทียบ preferred candidate กับ four retained small I6 cases โดยคง PDF เดิม;
  baseline discrepancies ที่บันทึกแล้วต้องไม่ถูกซ่อนหรือใช้ยกเว้น regression ใหม่.
- [ ] **E3 — report and stop.** ลงผลใน section นี้พร้อม evidence locators,
  rejected variants, known gaps และ recommendation. ไม่ integrate/release/
  install/push และไม่เปิด SRS98 จากผลทดลองนี้. I6 complete-suite blocker คงเดิม.

Proof Budget: first comparison มี A/B1 ของ P/T และ A/C ของ W =6 Word DOCX inputs;
B2 เพิ่มได้หนึ่ง packet, D สาม packets และ baseline repeat หนึ่งครั้ง
รวมไม่เกิน11 inputs ก่อน regression. ไม่รัน Cartesian product ทุก variant×packet.
เป้าหมายรวมไม่เกิน60 rendered pages ในช่วงนี้; กำหนด packet sizes จาก A ก่อน freeze.
ถ้าผลจริงเกินงบให้บันทึกและหยุดปรับแผน ไม่ตัดหน้าที่ไม่ผ่านออกจากการตรวจ.
Preferred-candidate regression ใช้ I6 เดิม4cases/9reference pagesอีกหนึ่งรอบ;
ไม่มีการทดสอบ performance หรือ full Service suite สำหรับ experiment นี้.

Artifacts ใน future isolated Core `artifacts/docx-pagination-rules-20261022/<run-id>/`:
`manifest.json` (base/patch/package/input/resource/Word identities), frozen inputs,
PDF reference, variant DOCX, Word-exported PDFs, rendered pages และ `results.json`.
บันทึก variant และ source locators ในผล ไม่ encode ปลายทางตามชื่อเอกสาร.
ห้ามแก้ต้นฉบับ DOCX หลัง Word refresh; ใช้สำเนาสำหรับ review และเก็บ hash ก่อน/หลัง.

Future automated checks: targeted DOCX paginationRules tests ร่วมกับ
`tests/docx/geometry.test.ts`, `tests/docx/port.test.ts`,
`tests/docx/capabilities.test.ts`; build/type check ตาม Core contract.
ก่อนอ้าง packaged behavior ต้องตรวจ installed Linux/amd64 consumer ของ exact
candidate archive โดย reuse inputs เดิมและคู่ PDF/DOCX. Passing focused checks
ไม่แทน mandatory gates ของการ integrate/release ซึ่งยังไม่อยู่ในคำขอนี้.

### Measurement and decision rules

1. **Validity** = PASS / FAIL / INCONCLUSIVE แยกจาก **Effect** = IMPROVED /
   UNCHANGED / REGRESSED / TRADEOFF / INCONCLUSIVE. ไม่มีคะแนนเฉลี่ยถ่วงน้ำหนัก
   หรือเปอร์เซ็นต์ที่กลบ content/structure regression.
2. Mandatory invariants: source hashes คงเดิม; exact ordered normalized logical
   text และ authored newline events จาก OOXML/source map; newline ที่แทนด้วย
   paragraph boundary ต้องนับตาม source relation ไม่ใช่นับเฉพาะ w:br;
   ไม่มีข้อความ/ภาพหายหรือซ้ำ;
   table cells/spans/repeated headers/allowBreak และ protected relationships
   คงเดิม; ไม่มี clipping/overlap; intentional blanks, Section geometry,
   logical numbering/TOC/link destinations ถูกต้องตาม DOCX ของตัวเอง.
3. รายงาน unintended blank pages และ explicit-boundary violations แยกกัน.
   Match pages ด้วย source intervals `(sectionId,nodeId,sourceStart,sourceEnd)`;
   หัวตารางซ้ำเป็น decoration ที่คาดได้ ไม่ถือเป็น business-text duplication.
   แยก physical-page displacement จาก boundary mismatch เพื่อไม่ให้หน้าว่าง
   หนึ่งหน้าถูกนับเป็นข้อผิดพลาดข้อความทุกชิ้นที่ตามมา.
4. เก็บ physical line-wrap signatures เป็น source end offsets แยกจาก authored LF
   และเก็บ page-cut offsets ของแต่ละ block/cell. ถ้าจับคู่ไทยจาก PDF extraction
   ไม่ชัด ให้ตรวจภาพกับ source map; ห้ามลบวรรณยุกต์/ยุบช่องว่างเพื่อสร้าง PASS.
5. Widow attribution ใช้เฉพาะกรณีที่ A/C และ PDF มี line-wrap signature เดียวกัน
   และต่างกันที่ page assignment. ถ้า wrapping ต่างอยู่แล้ว ให้บันทึกเป็น
   INCONCLUSIVE สำหรับ widow ไม่แก้ leading/font/text เพื่อบังคับให้ทดลองได้.
6. **IMPROVED** ต้องมี predeclared boundary error อย่างน้อยหนึ่งจุดลดลงจาก A,
   ไม่มี boundary/blank/table-fragment regression ในกรณี eligible อื่น และ
   mandatory invariants ผ่านทั้งหมด. **UNCHANGED** ไม่เป็นเหตุให้เพิ่ม patch.
   มีข้อดีและข้อเสียคนละกรณี = **TRADEOFF**, ยังไม่เลือกใช้. Content/relationship
   regression = **FAIL/REGRESSED**; Word proof ที่ขาด = **INCONCLUSIVE**, ไม่ใช่ PASS.
   Scoped target PASS ต้องแก้ครบทุก target ที่ประกาศก่อนเห็น candidate และไม่มี
   regression; IMPROVED บางจุดยังไม่เท่ากับปิด target ทั้งชุดหรือรับรอง I6.
7. จำนวนหน้ารวมใช้รายงานประกอบ ไม่เป็นเกณฑ์ชนะ. เปรียบเทียบตำแหน่งเนื้อหาก่อน/
   หลัง boundary และ whitespace ที่เพิ่มจาก wrapper ด้วย แต่ไม่ตีความ word-box
   yMin เป็น glyph baseline หรืออ้าง pixel equivalence จาก extraction.

Stop เมื่อได้คำตอบที่แยกปัจจัยได้ หรือพบว่า native Word semantics ใน scope นี้
ทำให้เหมือนขึ้นไม่ได้อย่างปลอดภัย. ผลที่ยอมรับได้ของการทดลองรวมถึง
**ไม่เลือกเปลี่ยนโค้ด**. Product source, PDF behavior และ I6 status ยังไม่เปลี่ยน
จากการบันทึกแผนนี้.

### E0 baseline capture 2026-10-22

Status: **baseline captured and repeatable; coverage-qualified, E1 on hold**.
E0 checkbox above remains open for its coverage gaps; this is not full experiment
acceptance. Owner request authorizes baseline preparation and reporting only.
Active role: Planning Partner / Evidence Reviewer; Core owns runtime behavior,
Project Control owns this status. Single-room execution IDs are not applicable.
No product source, pagination rule, PDF renderer, dependency, Service, DB, or
installed plugin changed. No E1 probe, integration, release, install, or push.

Evidence root:
`C:/Users/nekot/Documents/Codex/2026-10-22/docx-pagination-e0/baseline-01/`.
Reuse `manifest.json`, `results.json`, `generation-results.json`,
`installed-package-files.json`, `inspection.json`, `source-intervals.json`, and
`word-results.json`; frozen templates/requests/prepared inputs/ResolvedDocuments,
three `*-A.pdf` references, three `*-A.docx` files, Word review copies/PDFs and
all rendered pages are in that root. This external artifact-only lane replaces
the proposed future Core artifact directory: no product edits require a new
checkout. It uses an immutable offline installed consumer rather than rebuilding
or installing anything in a primary checkout.

Pinned Core source HEAD: `e53e4a284d5eb2596b531b55a12a83ab74ba8528` (clean).
Installed Core 0.4.7 archive SHA-256:
`067b7678c410e7413968159f7495fb3b0e6f3909f9c14d51eae20f7e5b7f4c3e`.
All 208 installed package files match that retained archive. Manifest also pins
container ID, native/runtime files, four Sarabun faces/licenses and synthetic
image bytes. Public validate/prepare/compose APIs feed the same frozen resolved
object to the unchanged PDF and DOCX branches. Each successful reference PDF
was retained from its first generation and not overwritten. P/T engine receipts
were not checkpointed before later fixture validation interrupted the harness;
their retained output hashes were recovered from bytes, not regenerated.
The four old I6 PDF references still match their retained receipt hashes.

| Packet | Frozen PDF pages | Word pages | Recorded baseline difference |
| --- | ---: | ---: | --- |
| P | 6 | 11 | Leading/repeated/trailing breaks add displacement; below/at/above boundary spacer cases differ too. PDF content pages 1,2,3,4,6 versus Word 3,5,7,9,11. |
| T | 5 | 7 | Table PDF2 versus Word3; wide body PDF3 versus Word5, with header-only Word4. Cover remains page1 and two intentional blank Sections remain two pages. |
| W | 9 | 9 | First authored-LF paragraph splits 1/4 lines in PDF versus 0/5 in Word; last splits 4/1 versus 3/2; cell splits 1/4 versus 0/5. Protected controls remain page9. |

Word executable version `16.0.20430.20182`; COM Version `16.0`, Build
`16.0.20430`. `word-export.ps1` records printer/options and exact export steps:
private hidden instance, read-only review copies, document fields/TOC update,
repagination, print-quality all-page PDF export, close without saving. No fields
were present. Original and review DOCX bytes remain identical. W repeat has
identical extracted text/geometry and all nine rendered-page PNG hashes; PDF
bytes differ, so byte identity is not claimed for Word exports.

All **56 rendered pages** were visually reviewed, including blank pages and W
repeat. No body clipping or overlap observed; source-to-body OOXML ordered text
and authored LF events match all three graphs. QA initially omitted resolved
`line-break` inline events; fixing that reader, without changing source or DOCX,
resolved its false mismatch. Source interval evidence records physical pages
separately from displacement. Natural Thai wrap extraction cannot yet establish
exact source end offsets; that case remains **INCONCLUSIVE for widow attribution**.

Coverage limitations remain explicit: P lacks an isolated ordinary no-break
Section; T uses supported model18 because model19 forbids the cover role;
numbering restart is structural without a visible field; rowSpan and an actually
repeated header across a page boundary are not exercised; natural wrap covers
mixed Thai/Latin but not separate Thai-only/Latin-only or mixed emphasis in one
paragraph. Four separate font-face blocks are controls, not that missing case.
Fixture authoring errors (unsupported cover/model placement and missing heading
anchor) were corrected before final freeze, without product changes. These gaps
must not be silently treated as tested or generalized to model19 cover support.

Budget decision: E0 used 4 Word exports and 56/60 rendered pages. At baseline
sizes, just B1(P/T) and C(W) would bring the total to **83 pages**, before B2/D or
I6 regression. **Stop before E1**: first revise the proof budget and missing
control coverage, or agree separately versioned smaller complete packets;
preserve this frozen baseline and never replace its PDF references. No candidate
effect is measured yet, and the existing I6 complete-suite blocker stays open.

### Proposed E0 coverage completion and revised proof budget 2026-10-22

**PROPOSAL ONLY — NOT EXECUTED.** This owner request authorizes this plan
addendum only. It does not authorize supplemental generation, Word automation,
E1, candidate patches, or a budget spend. Earlier stage descriptions and the
60-page/11-export estimate remain historical planning context; the replacement
budget below becomes operational only under a subsequent authorized stage.
Owner: Project Control; role Planning Partner / Documentation Synthesizer.
Work Size small, Risk Tier routine for this documentation-only task. Execution,
Phase and Checklist IDs: N/A. Document Budget: this existing document only;
no new Work, registry, map, or Evidence record. Runtime owner remains Core.
Acceptance for this proposal: every recorded gap has a test or an explicit
contract-bound exclusion, the variant matrix has a cumulative budget, and the
old baseline remains immutable. No product acceptance or I6 status changes.

#### Preserve and extend the reference set

Keep `baseline-01/` entirely immutable, including inputs, manifests, results,
PDFs, DOCX files and scripts; do not regenerate or relabel P/T/W. Future additions
go into sibling `supplement-01/` under the existing evidence root's parent.
Its manifest references the original manifest SHA-256
`ca401ace5e6b4d38fb51397e170d67ba8dfce21db8989076ab38c221ec360fc3`
and names each reused original packet. Verify all 37 frozen file hashes and four
retained I6 reference hashes before and after any authorized execution.

Use the same immutable Core archive, fonts/native tools, Word executable build
and recorded export procedure as E0. Drift requires a compatibility ruling before
combining evidence, not a silent baseline replacement. Produce new reference
PDFs only for the new sources, once per successfully admitted source; retain
their first successful bytes. Log invalid fixture attempts separately before
freeze. No source, font, geometry or text changes after a packet is frozen.

#### Two supplemental packets and contract rulings

| Packet/control | Future source and check | Page planning envelope PDF / Word |
| --- | --- | ---: |
| Q — missing P/T controls, model19 | An isolated ordinary Section without explicit breaks; a two-page table with repeated header, stable cell IDs, colSpan and a bounded rowSpan; two short Sections exposing current-page fields across continue/restart7 and portrait/landscape/band transition. | at most5 /7 |
| R — missing W language controls, model19 | One Thai-only naturally wrapping body paragraph near a first-line boundary, and one Latin-only naturally wrapping paragraph in an allowBreak cell near a last-line boundary. Use3–5 physical lines when naturally admitted, plus short stable source markers. Reuse W's mixed-language authored-LF, natural-body and protected controls. | at most5 /7 |

For Q, put the merged row group wholly on one page and put a later ordinary-row
boundary across pages. This checks rowSpan preservation and actual repeated
headers without claiming support for a vertical merge split across a page.
Record row/cell/span identities, header occurrences and page-source intervals.
The no-break control must keep its source interval on one page and introduce no
blank page in its own Section; unrelated later displacement is a separate metric.
Visible compact page-field output must show the declared restart7 and continuation
sequence after the same field refresh. Do not infer numbering from section XML
alone or substitute a literal digit for a field.

Include empty ordinary Section and empty scoped TOC diagnostics within Q's
envelope, retaining their bookmarks/Sections. Existing differences are recorded,
not fixed; if they obscure treatment attribution, isolate that case as
INCONCLUSIVE. A breaks-only request is a separate zero-export negative check:
EMPTY_CONTENT and no published bytes. Admission checks must finish before freeze.

For R, choose text and boundary placement from declared synthetic source inputs
before examining candidate output. Preserve all Thai marks, spaces and authored
LF events. Do not insert artificial line breaks or retune text/geometry until
Word matches PDF. If a natural paragraph does not yield the intended line count
or boundary, record it as non-exercising; return the fixture-design issue before
freezing it as evidence for that treatment. Do not count it as a candidate failure.

Two apparent gaps are **contract-bound exclusions**, not fixture tasks:

- Model19 forbids an authored `role`, including cover
  (`src/template/pageSections.ts`). Keep T's model18 cover/intentional blanks
  as compatibility controls; no model19 cover or schema-extension claim.
- `TextInline` has no per-run font/emphasis property; `textStyleId` belongs to
  the whole TextBlock (`src/composition/resolvedDocument.ts`). Mixed bold/italic
  inside one paragraph is unsupported in this contract. Correct the earlier
  mixed-emphasis requirement to a deferred contract extension. Retain W's four
  separate font-face blocks as the supported control; do not call them inline
  emphasis coverage or modify schema/writer to manufacture that case.

#### Close E0 before any treatment

- [ ] Capture Q/R through public validate/prepare/compose and the unchanged
  PDF/DOCX engines; checkpoint receipts per packet immediately. Freeze source,
  prepared/resolved graph, source map, package/resources and outputs in the new
  manifest. Original baseline files must remain byte-identical.
- [ ] Export Q/R A in the pinned Word procedure; repeat R A once because the
  new natural/cell probes were absent from the original repeat. Compare text,
  geometry and rendered-page hashes; Word PDF byte identity is not required.
- [ ] Inspect every new PDF/Word/repeat page. Verify exact logical text/LF,
  visible numbering, actual header repetition, topology/spans and protected
  relationships. Assign a source end offset to each natural physical line;
  preserve extraction order versus logical order as separate evidence. Use
  image/source-map review for ambiguous Thai glyph order; never drop marks or
  collapse spaces to obtain a match. If exact offsets remain unresolved, report
  that natural case INCONCLUSIVE for widow attribution.
- [ ] Return an E0 completion report first. Covered controls must exercise their
  stated boundary, and all exclusions/inconclusive cases remain visible. Do not
  silently mark the full E0 target PASS if a required control is unexercised.
  Any narrower acceptance needs an explicit scope decision. E1 requires its own
  authorization even if the supplemental baseline passes.

#### Cumulative budget and the minimal variant matrix

The recommendation is **150 pages through supplemental E0 and independent E1**,
with a conditional **240-page cumulative ceiling** if optional B2/D and preferred
candidate regression are later chosen. These are proposed ceilings, not results
or authorization. The 240 includes the 150; neither resets the spent56 pages.
Counts below budget new/reviewed physical pages once, plus required repeat review;
unchanged hash-verified reference pages may be reused without rendering again.

| Stage | Incremental page estimate/envelope | Cumulative before contingency | Word exports, cumulative |
| --- | ---: | ---: | ---: |
| E0 already retained | 56 actual | 56 | 4 actual |
| Supplemental A: Q PDF5+Word7, R PDF5+Word7, R Word repeat7 | 31 | 87 | 7 |
| Independent E1: B1 on P/T/Q (11+7+7), C on W/R (9+7) | 41 | 128 | 12 |
| Optional B2 on P/Q only; verify unchanged table fallback on Q | 18 | 146 | 14 |
| Conditional D on all P/T/W/Q/R, only after independent benefit | 41 | 187 | 19 |
| Preferred-candidate I6 regression:9 retained reference pages reviewed plus up to13 candidate Word pages | 22 | 209 | 23 |

The first ceiling leaves22 contingency pages (150−128). The complete optional
path leaves31 (240−209). Contingency is shared, not added anew per stage, and
does not grant extra Word attempts: through independent E1 the limit is12 total
Word exports; optional path19 before I6,23 including its four inputs. No Cartesian
variant-by-packet matrix. R does not need a B1 export and Q does not need a C
export; D must cover all five packets if both factors are combined.

Actual candidate pagination may grow: estimates use A sizes, not promised maxima.
Before starting each export reserve room for its A-sized estimate plus remaining
contingency. If a packet exceeds its envelope, Word repeat fails, or actual output
would exceed the cumulative ceiling, retain the entire output and stop before
another export; report the overrun and replan. Never omit a failed or blank page
from accounting/review. No automatic retries or post-freeze fixture shrinking.
Do not spend optional B2/D/regression allowances after a clear rejection or
UNCHANGED result merely to fill the budget.

Future preferred-package PDF reproduction, if required by the existing packed
consumer check, uses temporary comparison output and must match the frozen
reference hash; it never overwrites a reference. Identical bytes reuse reviewed
pages; a hash difference blocks acceptance and requires a new scope decision.
No performance run, full Service suite, SRS98, integration or release is included.
The next proposed action is supplemental E0 only, followed by its report and stop.

### E0 Q and R supplemental capture result 2026-10-22

**Executed scope:** owner subsequently authorized supplemental Q/R E0 only,
with at most31 additional pages and a report before E1. The preceding proposal's
not-executed permission notice remains historical; only this bounded baseline
stage was authorized. No E1, product patch, new pagination rule, package rebuild,
install, Service/DB/plugin change, integration, release or push occurred.
Role: Planning Partner / Evidence Reviewer; runtime owner Core, prose owner
Project Control. Single-room execution/Phase/Checklist IDs: N/A. Evidence target
is the supplemental artifact set, not a new Work or product map promotion.

**Result: supplemental capture and exercised controls PASS, with recorded
baseline differences.** This does not declare DOCX/PDF parity or a successful
candidate effect. Original W's mixed-language natural offsets remain unverified;
the overall E0 checkbox remains qualified/open rather than claiming full target
acceptance. The contract-bound model19 cover and inline-emphasis exclusions stay.

Evidence root:
`C:/Users/nekot/Documents/Codex/2026-10-22/docx-pagination-e0/supplement-01/`.
Use `manifest.json`, `results.json`, `inspection.json`, `Q-receipts.json`,
`R-receipts.json`, `negative-breaks-only.json` and `word-results.json`, with
frozen source/prepared/resolved graphs, paired PDF/DOCX files and page renders.
The same immutable Core0.4.7 image/archive, exact resource identities and Word
16.0.20430.20182/options match baseline-01. Receipts were checkpointed per output.
No invalid source retry or post-freeze input adjustment was needed. QA initially
counted explicit `tblHeader off` elements as enabled; correcting only the reader
to respect OOXML booleans verified one active header row, consistent with images.

| Output | Reference PDF pages | Word PDF pages | Repeat Word pages | Added review pages |
| --- | ---: | ---: | ---: | ---: |
| Q | 5 | 7 | none | 12 |
| R | 4 | 4 | 4 | 12 |
| Total | 9 | 11 | 4 | **24 of31** |

All24 pages were rendered and visually inspected, including blank and generated
field-result pages; no body clipping or overlap observed. Seven budgeted pages
remain unused. Cumulative E0 review is80 pages (56 original+24 supplement), with
seven total Word exports (four original+three supplement). The proposed150/240
future ceilings were not activated or spent by this request.

**Q controls:** isolated no-break content stays on physical page1 in both outputs
without a blank page in its own Section. Both repeat the header on pages2/3 and
retain all32 ordinary rows exactly once, plus the two-row merged group, colSpan
and rowSpan. The merged group remains on page2; no cross-page vertical-merge claim.
The table cut differs: PDF rows1–26 /27–32, Word rows1–25 /26–32. This is a retained
baseline difference with no page-break/widow causal attribution. Native PAGE
fields visibly show7 then8 on pages4/5, with portrait/landscape geometry and
distinct headers intact. Empty ordinary Section produces Word blank6; empty
scoped TOC produces Word7 with localized field result `ไม่พบรายการสารบัญ`.
The PDF adds neither diagnostic page. These outputs remain untouched and separate
from authored business-text invariants. Breaks-only negative returns EMPTY_CONTENT
before export and publishes zero bytes.

**R natural-line controls:** raw PDF character-stream order permits an exact
source mapping where geometric text extraction reordered Thai marks. No Unicode
normalization, mark removal, space collapsing, forced LF or source edit was used.
Source offsets are Unicode code points within each logical block:

| Probe | Full wrap signature, PDF and Word | PDF page assignment | Word page assignment |
| --- | --- | --- | --- |
| Thai-only body,360 code points | 89,180,269,360 (4 lines) | page1:line1; page2:lines2–4 | page1:empty; page2:lines1–4 |
| Latin-only allowBreak cell,198 code points | 46,92,138,178,198 (5 lines) | page3:lines1–4; page4:line5 | page3:lines1–3; page4:lines4–5 |

Every source code point and space maps contiguously. An additional Word extraction
space after the complete Latin source is recorded separately, not substituted
for or removed from source text. Authored LF count is zero for both probes.
Source-to-body OOXML logical text/LF checks pass for Q/R. The localized TOC result
is generated by Word field refresh, not authored source content. R repeat has
identical extracted text/geometry and all four rendered-page PNG hashes; Word PDF
bytes differ. These two R cases are eligible for a future C comparison only if
C preserves the same line signatures, source hashes and ordinary-cell/body
eligibility/keep constraints. This baseline alone proves no widow-rule effect.

Preservation: all37 original frozen files, the original manifest digest and four
retained I6 reference PDF hashes match before and after. Supplemental manifest
freezes61 files including all24 page renders and the new references. Primary
Core remains clean at `e53e4a284d5eb2596b531b55a12a83ab74ba8528`; pre-existing
Service changes are untouched. I6 complete-suite blocker and acceptance stay as
recorded. **Stop and report here; E1 is not authorized.**

### E0 W mixed natural mapping and closure 2026-10-22

**E0 BASELINE PREPARATION COMPLETE WITH RECORDED DIFFERENCES.** The owner
authorized read-only matching of original W and an E0 close assessment only.
The last blocking E0 unknown is resolved. This closes preparation of the agreed
P/T/W+Q/R reference set under the documented contract-bound exclusions, not
DOCX/PDF parity, candidate effectiveness, I6 acceptance or permission for E1.
Earlier frozen reports and the qualified/open statuses above remain historical;
this result supersedes only the unresolved-W/E0-close assessment. No original
or supplemental artifact was overwritten.

Role: Planning Partner / Evidence Reviewer. Owner: Project Control for this
record, Core for unchanged runtime behavior. Single-room execution/Phase/Checklist
IDs: N/A. No new Work, map or registry record. Evidence:
`C:/Users/nekot/Documents/Codex/2026-10-22/docx-pagination-e0/w-line-review-01/`
contains `results.json`, `e0-closure.json`, verification helpers and a hash manifest.

The original authored template and resolved `w-natural` text are exactly equal:
**426 Unicode code points**, with zero authored LF. Fresh reads of the original
PDF and both original Word-exported PDFs match their frozen inspection records.
Reading original character-stream order avoids geometric extraction reordering
of Thai marks. No normalization, mark deletion, whitespace collapse or source
change was used; every code point and source space maps contiguously.

| Physical line | Source interval, code points | PDF page | Word page | Word repeat page |
| --- | --- | ---: | ---: | ---: |
| 1 | [0,93) | 5 | 5 | 5 |
| 2 | [93,187) | 5 | 5 | 5 |
| 3 | [187,283) | 6 | 6 | 6 |
| 4 | [283,377) | 6 | 6 | 6 |
| 5 | [377,426) | 6 | 6 | 6 |

Thus all three wrap signatures are **93,187,283,377,426**, with the same page
cut at187 and the same2/3 line split. Source locators, extracted text, physical
coordinates, PDF identities and separately recorded whitespace-only structural
extraction lines are in `results.json`. Existing full-page PNGs for PDF5/6 and
Word5/6 were visually reviewed; all nine original W Word/repeat page-PNG hash
pairs also match on fresh verification. Physical y positions differ, so this is
line/source/page equivalence, not pixel or vertical-position equivalence to PDF.

W mixed natural is an **unchanged control**, not a first/last-single-line boundary
target. R's Thai-only body and Latin-only cell provide the exercised natural-wrap
boundary targets. Any future C still needs preserved signatures and correct
eligibility/keep semantics before causal attribution. No candidate was created.

Closure coverage in `e0-closure.json` connects seven criteria to the existing
evidence: frozen source/reference/resource identities; unchanged same-resolved-
object PDF/DOCX branches; pinned Word procedure and repeat; supported P/T/W+Q/R
controls and authored text/LF; full80-page visual coverage; exact natural-wrap
source intervals; scope/budget containment. Original P/T recovered receipt-hash
limitations remain explicit, not silently upgraded to original engine receipts.
The prior no-break, visible numbering, repeated-header and rowSpan gaps are
covered by Q; language-specific targets by R. Unsupported model19 cover and
per-run emphasis remain exclusions under the agreed plan.

Known baseline differences remain: P extra blank displacement; Q's one-row table
cut difference and Word-only empty-Section/empty-TOC diagnostic pages; existing
font/band/vertical-position differences. They are recorded reference behavior,
not failed baseline reproducibility or waived future regression criteria. I6's
complete-suite blocker stays open.

Fresh preservation checks pass for37 original files,61 supplemental files, both
manifests and four retained I6 reference PDFs. This review launched no Word,
generated no PDF/DOCX, and rendered no new pages. Cumulative review remains80
unique exported pages and seven Word exports; Q/R used24 of its31-page allowance.
Only this Project Control prose and external analysis outputs changed. **E0 is
closed for baseline preparation; stop here. E1 and product code changes remain
unauthorized, and no future proof budget is activated.**

### E1 B1 PTQ result 2026-10-22

**Authorized B1-only experiment complete. Validity: PASS within P/T/Q;
effect: IMPROVED; full boundary-parity target: PARTIAL.** The owner authorized
implementation in isolated Core and a report before B2/C. No B2/C/D or integration
acceptance follows from this result. The E1 checkbox remains open for unexecuted
variants. No release, push, merge or primary product checkout mutation occurred.

Owner Core; role Product Implementation Agent / Evidence Reviewer inline, with
Project Control owning this prose. Execution/Phase/Checklist IDs: N/A. Work Size
medium for this bounded experiment, Risk Tier routine. Evidence target is the
artifact set below; no synthetic Work/registry/map record was added. The approved
experiment supplied scope and acceptance; `brief.json` records the exact base,
allowed/forbidden paths, budget and execution rulings.

Isolated checkout:
`C:/Users/nekot/Documents/Codex/2026-10-22/docx-pagination-e1-b1/core-worktree`.
Branch `codex/docx-pagination-b1-e1`; base
`e53e4a284d5eb2596b531b55a12a83ab74ba8528`; retained candidate commit
`bd09ed0a9cf209acf906dfec814abc007258e9d0`. Only two tracked files changed:
`src/docx/tables.ts` and `tests/docx/paginationRules.test.ts`.

The body writer now queues source page-break requests per Section: leading
requests are omitted, consecutive interior requests emit one original native
break paragraph, and pending trailing requests are discarded at that Section's
end. No measured positions, PDF coordinates or text-dependent heuristics are used.
Every non-break root conservatively retains its footprint, including empty text,
LF, fixed spacers and native TOC. Adjacent table separators, intentional blank
Sections and original native Section geometry/numbering/bands remain intact.
There is no pageBreakBefore or widowControl treatment and no schema/API change.

Evidence root:
`C:/Users/nekot/Documents/Codex/2026-10-22/docx-pagination-e1-b1/`.
Use `results.json`, `source-intervals.json`, `ooxml-proof.json`,
`preword-results.json`, `package-proof.json`, per-packet receipts,
`word-results.json`, candidate DOCX/Word PDFs, all19 page renders, and the final
hash manifest. Old E0 files are referenced read-only, never overwritten.

| Packet | Frozen PDF pages | Baseline Word A | B1 Word | Result |
| --- | ---: | ---: | ---: | --- |
| P | 6 | 11 | 7 | IMPROVED: body markers move from pages3,5,7,9,11 to1,2,3,5,7; exact-fit/spacer difference remains. |
| T | 5 | 7 | 5 | IMPROVED: cover1, table2, wide body3, intentional blanks4/5 now match source-page assignment. |
| Q | 5 | 7 | 7 | UNCHANGED: full extracted text/geometry equal A, including numbering7→8, repeated header, merged group and empty diagnostics. |

P native page-break paragraphs reduce6→1, T3→0, Q0→0. Source interval evidence
maps all114 body TextBlocks to their physical pages; repeated header occurrences
are explicit decorations, not duplicated business text. P's remaining blank
pages4/6 and Q's one-row table cut difference, empty Section and localized empty
TOC output are retained; source-relative boundary gaps distinguish these from
removed leading/repeated/trailing displacement. No body clipping or overlap
observed in full review of all19 new pages, including blanks and diagnostics.

Proof: before the patch, the new targeted suite failed7/8 cases for the expected
extra-break counts; after the patch, targeted+affected checks pass26/26. All six
DOCX test files pass69/69 and the TypeScript build passes. No full Service suite,
performance trial, SRS98 or I6 regression was run for this independent probe.
Fresh bounded whole-candidate review reported no material findings; it inspected
the diff, evidence and frozen hashes without rerunning exports or claiming a
second visual review.

The exact installed Linux/amd64 candidate archive has SHA-256
`8c941a7e2494ed42102fa798a3ec4f23d2825f8f4bb2eca25ef09d3e3fbcc794`.
All208 installed files match the archive. Only `dist/docx/tables.js` differs from
the original package; all other bytes and file modes match. Recomposition from
the same templates/requests exactly matches each frozen serialized graph. The
same frozen object feeds both branches; all three generated PDF hashes exactly
match the retained P/T/Q references. Comparison bytes were discarded, not saved
as replacement references or rendered again.

Before Word, OOXML comparison verifies identical content and ordered Section
properties after removing redundant break paragraphs and accounting explicitly
for native Section-marker attachment/empty carrier relocation. Word measures
that carrier footprint; the XML comparison does not assume it costs no space.
Bookmarks are matched by unchanged names, random font keys are deobfuscated to
identical Sarabun hashes, timestamps are recorded as metadata exceptions, and
all other package parts match exactly. The Word build/options/procedure match E0;
review copies and originals remain byte-identical after close without saving.

Preparation rulings remain visible in `results.json`: writable container npm
cache; Linux packing to preserve executable modes lost by a preliminary Windows
archive; serialized-graph equality for null-prototype maps after JSON round trip;
and source matching that treats repeated headers as decorations and uses token
boundaries so LEFT2 does not match LEFT20. These affected only harness checks or
the failed preliminary package; no reference or product repair was introduced.

Budget: three Word exports, **19 new rendered pages** against the nominal25 for
B1, no contingency used. Cumulative E0+B1 is**99 pages and10 Word exports**;
the remaining independent-stage allowance is not permission to execute C. All37
original and61 supplemental frozen files, four I6 reference PDFs and the primary
Core checkout remain unchanged. Keep the clean committed worktree and report:
**retain B1 as an experimental candidate with evidence of improvement, not full
target acceptance. Stop before B2/C, regression expansion or merge.**

### E1 C WR result 2026-10-22

**Authorized C-only experiment complete. Validity: PASS within W/R;
effect: IMPROVED for all five exercised boundary targets. Full DOCX/PDF parity
is not claimed.** The owner authorized C independently of B1, using frozen W/R
and the existing PDF references. No B2, combined candidate, merge, release or
push was performed. B1 results above remain immutable and independent. The
broader E1 checkbox is not promoted to full target acceptance.

Owner Core; role Product Implementation Agent / Evidence Reviewer inline, with
Project Control owning this prose. Work Size medium, Risk Tier routine.
Execution/Phase/Checklist IDs: N/A for this single-room bounded experiment.
Evidence target is the external set below; no Work, registry, map or new shared
Markdown artifact was created. Markdown classification: existing Project Control
canonical plan/status, with implementation claims limited to retained evidence.

Isolated checkout:
`C:/Users/nekot/Documents/Codex/2026-10-22/docx-pagination-e1-c/core-worktree`.
Branch `codex/docx-pagination-c-e1`, based directly on original A Core commit
`e53e4a284d5eb2596b531b55a12a83ab74ba8528`, not the B1 branch. Retained C commit:
`69d0018e1924dc7c2a9e0d1c5c6764385e4efbd9`. Seven tracked files changed:
`src/docx/text.ts`, `src/docx/tables.ts`, `tests/docx/paginationRules.test.ts`, and
four W/R template/request fixtures. The four fixture files match frozen E0 bytes.

C explicitly emits `widowControl:false` only for whole unsplit ordinary body
or plain breakable-cell paragraphs with no effective keeps, TOC or page fields.
Semantic context excludes fixed spacers, bands, generated image/TOC paragraphs,
header/nonbreaking rows, merged cells, both endpoints of protected reading-plan
relations and cells of heading-associated tables. Entire required prefix-row
groups are conservatively excluded, including their first member even when it
has no effective keep-next itself. Existing keep flags, breaks, source text/LF,
styles, runs, Section carriers and geometry remain unchanged. No source-ID/text
heuristic, API/schema/environment switch or PDF/layout change was introduced.

Evidence root:
`C:/Users/nekot/Documents/Codex/2026-10-22/docx-pagination-e1-c/`.
Use `manifest.json`, `results.json`, `source-intervals.json`, `ooxml-proof.json`,
`package-proof.json`, `preword-results.json`, per-packet receipts,
`word-results.json`, candidate DOCX/Word PDFs, all13 page renders and
`review-result.json`. E0 and B1 are referenced read-only, never overwritten.

| Probe | Frozen PDF line distribution | Word A | Word C | Effect |
| --- | --- | --- | --- | --- |
| W first authored lines, pages1/2 | 1 /4 | 0 /5 | 1 /4 | IMPROVED |
| W last authored lines, pages3/4 | 4 /1 | 3 /2 | 4 /1 | IMPROVED |
| W ordinary cell, pages7/8 | 1 /4 | 0 /5 | 1 /4 | IMPROVED |
| R Thai natural body, pages1/2 | 1 /3 | 0 /4 | 1 /3 | IMPROVED |
| R Latin natural cell, pages3/4 | 4 /1 | 3 /2 | 4 /1 | IMPROVED |
| W mixed natural control, pages5/6 | 2 /3 | 2 /3 | 2 /3 | UNCHANGED |

W stays9 pages and R stays4; improvement is demonstrated by exact source-line
page assignment, not page counts. All six probes preserve their full source
interval and line signatures across original PDF, Word A and Word C. Natural
signatures remain W **93,187,283,377,426**, R Thai **89,180,269,360**, and R Latin
**46,92,138,178,198**. Every source code point, space and authored LF is retained.
Original character-stream order avoids Thai-mark reordering; no normalization or
whitespace collapse is used. Extraction-only trailing spaces and structural
whitespace are recorded separately. W ordinary right-cell text also moves8→7,
matching the original PDF. This is a change within the split ordinary row.

All13 new pages were inspected individually, including intentionally large
fixed-spacer whitespace and split-table continuations. No clipping, body overlap,
missing glyphs or source loss observed. W pages5/6 and protected page9 retain
identical character/image geometry and rendered PNG hashes against Word A;
R's right-cell control retains its text and geometry. W protected heading/table,
tail/image and all four Sarabun faces remain intact. These controls do not prove
full geometry equivalence to the original PDF.

Proof: initial policy tests fail7/9 for the expected missing widow settings;
two protection/break tests already pass. An additional valid required-row-group
case fails with3 flags instead of1 before its protection guard, then passes.
All six affected DOCX files pass**71/71** and the TypeScript build passes.
`git diff --check` passes. No full suite, Service, SRS98, performance trial,
B1+C regression or I6 acceptance check was run for this independent probe.
A fresh read-only whole-candidate review found no Critical, Important or Minor
issues. It reviewed the diff, fixtures and package/OOXML/PDF receipts; the parent
owns the actual71-test/build execution, page review and source-line attribution.

Candidate Linux/amd64 package SHA-256:
`119ac368da57680861be4f34c6f5b4edc9dd57ce38248da48db3f2fd3ade7e43`.
All208 installed package files match the archive. Only internal compiled
`dist/docx/tables.js`, `dist/docx/text.js` and `dist/docx/text.d.ts` differ from A;
all other bytes and all file modes match, including PDF/native/font resources.
The same frozen resolved object feeds both installed engines. Recomposition
exactly matches each original serialized graph and both newly generated PDF
hashes exactly match their retained W/R references. Comparison PDF bytes were
discarded without saving replacement references or rendering them again.

Before Word, XML proof permits only9 W and3 R eligible widow-false additions.
All other body/Section properties and package parts are equal, apart from
verified stable-name bookmark IDs, timestamps and random font-obfuscation keys
whose deobfuscated font hashes match. No break/Section relocation normalization
is allowed for this C proof. Word16.0.20430.20182, printer/options and field-refresh
procedure match E0. Review copies close without saving and retain their hashes.

Execution rulings: retain A's original break emission; use the Core-specific
external worktree because the native chat worktree tool targets Project Control;
exclude whole required prefix-row groups conservatively; treat explicit false
keep properties as disabled in the proof reader; preserve extraction-only spaces
without source normalization; use the approved Word render procedure instead of
an additional generic LibreOffice export. These choices neither alter baselines
nor consume extra Word exports. The fixture setup initially failed source-map
validation; its test-only group identities were corrected before the meaningful
RED result. No production validator was changed. No deferred review minors.

Budget: **2 Word exports and13 new rendered pages of16**, no contingency used.
Cumulative E0+B1+C is**112 reviewed pages and12 Word exports**, below the150-page
independent-stage ceiling. All37 original and61 supplemental frozen files,
four retained I6 PDFs, and all57 frozen B1 artifacts retain their hashes. Primary
Core stays clean at its original base; pre-existing Service edits remain intact.

Remaining limits: native vertical/font/band/border geometry differences remain;
W natural is an unchanged control; P/T/Q were not rerun under C; combined B1+C
behavior remains unknown. Conservatively excluded cell/group classes have no
new visual parity claim. Original contract-bound exclusions, P/Q residual gaps
and I6 complete-suite blocker remain unchanged. **Retain the clean committed C
worktree as an experimental candidate and stop here before B2 or code integration.**

### E2 D B1C PTQWR result 2026-10-22

**Authorized combined B1+C experiment complete. Validity: PASS within the five
frozen packets; effect against A: IMPROVED; interaction: NO REGRESSION OBSERVED.**
The owner explicitly authorized P/T/Q/W/R in a new isolated worktree, with the
original PDFs and planned budget. This is the plan's conditional D probe. It is
not B2, preferred-candidate I6 regression, main integration or release authority.
The prior independent B1/C results and their stop notices remain historical and
unchanged. The broader E2 checklist stays open for the unexecuted I6 component.

Owner Core; role Product Implementation Agent / Evidence Reviewer inline, with
Project Control owning this existing canonical prose. Work Size medium, Risk Tier
routine. Execution/Phase/Checklist IDs: N/A for single-room bounded work. No new
Work, registry, map or product Markdown. Scope, acceptance, proof budget and
execution rulings are retained in the external `brief.json`.

Isolated checkout:
`C:/Users/nekot/Documents/Codex/2026-10-22/docx-pagination-e2-b1c/core-worktree`.
Branch `codex/docx-pagination-b1c-e2`; retained commit
`b79f426649e65eadb3fb29e410250395a6d65faa`. Starting revision is immutable C
`69d0018e1924dc7c2a9e0d1c5c6764385e4efbd9`, with only the original B1 body-flow
delta from `bd09ed0a9cf209acf906dfec814abc007258e9d0` applied. Original common A
base remains `e53e4a284d5eb2596b531b55a12a83ab74ba8528`.

`runtime-union-proof.json` verifies that `text.ts` retains C and `tables.ts` is
exactly C's semantic context plus B1's original per-Section pending-break flow.
There is no new pagination heuristic, pageBreakBefore, feature flag, geometry,
keep, schema, public API, PDF/native/composition/resource or dependency change.
Relative to C, only `src/docx/tables.ts` and the combined
`tests/docx/paginationRules.test.ts` change. Relative to A, seven tracked paths
include the inherited C text writer and four byte-identical W/R source fixtures.

Evidence root:
`C:/Users/nekot/Documents/Codex/2026-10-22/docx-pagination-e2-b1c/`.
Use `manifest.json`, `results.json`, `runtime-union-proof.json`,
`source-intervals.json`, `wr-source-intervals.json`, `page-comparison.json`,
`ooxml-proof.json`, `package-proof.json`, `preword-results.json`, per-packet
receipts, `word-results.json`, `review-result.json`, test/build logs, new DOCX/Word
PDFs and all32 page PNGs. Existing E0/B1/C artifacts are read-only dependencies.

| Packet | Frozen PDF pages | Word A | B1+C Word | Comparison with independent result |
| --- | ---: | ---: | ---: | --- |
| P | 6 | 11 | 7 | Exact7-page B1 result retained; marker pages1,2,3,5,7. |
| T | 5 | 7 | 5 | Exact5-page B1 result retained; cover/table/wide body and two intentional blanks. |
| Q | 5 | 7 | 7 | Exact7-page B1/A control retained, including numbering and diagnostics. |
| W | 9 | 9 | 9 | Exact9-page C result retained, including three improved authored-line targets. |
| R | 4 | 4 | 4 | Exact4-page C result retained, including both improved natural-line targets. |

All32 new page PNGs have the same hashes as their respective previously reviewed
independent B1 P/T/Q or C W/R PNGs. Full extracted page text, words/lines, dimensions,
character/font coordinates, image geometry and annotation counts also match.
All10 new contact sheets covering every page were visually reviewed; exact pixel
identity permits reuse of the original individual full-page reviews. This is
32-page review coverage, not a claim of32 new individual full-page visual passes.
No new clipping, overlap, missing glyph or lost image was observed. Blank,
fixed-spacer and localized diagnostic pages are counted and retained.

All114 PTQ body TextBlocks map to source intervals and physical pages; repeated
headers remain explicit decorations. WR exact character-stream matching preserves
all source code points, spaces, authored LF and full line signatures. W natural
remains93,187,283,377,426; R Thai89,180,269,360; R Latin46,92,138,178,198.
The five target line splits remain W first1/4, W last4/1, W cell1/4, R Thai1/3,
R Latin4/1, all matching their original PDF assignments. W mixed natural remains
2/3 and protected heading/table/tail/image/font controls remain unchanged.
No extra benefit beyond the independent results is claimed.

Installed Linux/amd64 candidate archive SHA-256:
`bc9e038fdc54b3b24c9e087d401640a5f710c4ccd78fa8c9364b8df10eef7125`.
All208 installed files match the exact archive. Compared with A, only compiled
`dist/docx/tables.js`, `dist/docx/text.js` and `dist/docx/text.d.ts` differ;
compared with C, only `dist/docx/tables.js` differs. Other bytes and all original
file modes match, including PDF/native/font resources. Five public-API
recompositions exactly match the frozen serialized graphs; the same frozen object
feeds both engines. All five generated PDF hashes match the retained originals;
comparison bytes were discarded without replacing references or rendering them.

Before Word, PTQ body/Section XML differs from B1 only by5/4/99 eligible ordinary
widow-false additions, checked against whole source blocks and protected cell
exclusions. WR body/Section XML equals C, including its9/3 flags. All other ZIP
parts match the relevant independent output after verifying stable bookmark
names, timestamp exceptions and deobfuscated identical font hashes. No break or
Section relocation normalization is needed between D and its independent
comparators. Word16.0.20430.20182/options/procedure match E0, with read-only review
copies closed without saving and original/review DOCX hashes unchanged.

Tests: new worktree affected baseline18/18 passes. Before applying B1, the combined
18-case policy suite fails8 and passes10 for the expected missing break handling
while C is active. Final six DOCX files pass**79/79** and build passes. Additional
assertions require both an interior coalesced break and ordinary widow flags,
while the fixed-spacer case correctly expects only the ordinary body's flag.
All original eight B1 and ten C scenarios remain represented. `git diff --check`
passes. Fresh read-only final review reports no Critical, Important or Minor
findings. It reviewed code/design/tests/package/XML; actual execution and visual
acceptance remain parent-owned evidence, not independently rerun by the reviewer.

Execution rulings: create a Core-specific external worktree because the native
chat tool targets PC; start from C and apply exactly B1, rather than merging old
lanes or changing their history; replace isolated-variant absence assertions
with joint-policy expectations; correct test-helper renaming of Object.freeze
before meaningful RED; keep fixed spacers excluded when strengthening flag-count
assertions; reuse prior full-page QA only after all32 PNG hashes match. These
harness/test corrections did not change production behavior or frozen inputs.
No deferred review minors. The user-authorized D activates the conditional
240-page ceiling, but does not authorize B2 or I6 attempts.

Budget: **5 new Word exports;32 new rendered pages of the41-page D allowance**,
no contingency used. Cumulative E0+B1+C+D is**144 pages and17 Word exports**.
No automatic retries, baseline rerenders, B2 exports or I6 regression exports.
The unchanged hashes cover98 E0 files,57 B1 artifacts,45 C artifacts, all prior
manifests and four I6 PDFs before/after. Primary Core and both independent
worktrees remain clean at their original commits; pre-existing Service edits
remain intact. The combined clean committed worktree is retained without merge.

Recommendation: keep B1+C as the **preferred experimental candidate within these
five short packets**. Retained gaps remain P's exact-fit/spacer blank4/6 and7
versus6 PDF pages; Q's table cut1–25/26–32 versus PDF1–26/27–32, empty Section and
localized empty-TOC pages; native font/band/border/vertical differences and prior
contract exclusions. This matrix does not prove every possible break/widow
interaction in other documents. Preferred-candidate I6 regression, the existing
I6 complete-suite blocker, SRS/full-suite verification and integration/release
acceptance are still unexecuted. **Report and stop before B2 or main integration.**

### E2 preferred B1C four case I6 regression 2026-10-22

**Authorized four-case regression complete. PASS for bounded content/pagination
and exercised structural controls, with recorded TOC alignment and provenance
qualifications. Effect here: UNCHANGED pagination/content versus original I6
Word. This is not pixel equivalence, a full I6 PASS, or main integration approval.**
The owner authorized the retained B1+C candidate against the original four small
I6 cases with original PDF references and the planned regression budget only.
B2, Service/full-suite/SRS/performance retries, product repair and main merge
remain outside this verification.

Owner Core for the frozen package; active role Evidence Reviewer; Project Control
owns this existing canonical prose. Work Size medium, Risk Tier routine.
Execution/Phase/Checklist IDs N/A for single-room verification. No new Work,
registry, map or product Markdown; no product code, configuration, dependencies
or candidate files changed. This does not reopen the old I6 execution authority.

Candidate remains clean at `b79f426649e65eadb3fb29e410250395a6d65faa`, branch
`codex/docx-pagination-b1c-e2`, in the retained D worktree. Reused exact package
SHA-256 `bc9e038fdc54b3b24c9e087d401640a5f710c4ccd78fa8c9364b8df10eef7125`
and image `sha256:4c6d16c21cb4984e50b98ef3879a6f8f116fb9f10dc7d75e8d37c52e18c19f09`.
No rebuild or new implementation branch was needed. Fresh generation verifies
all208 installed package files against the retained D archive receipt. Its
79-test/build and exact runtime-union proof are reused for unchanged content and
environment, not represented as a new unit/full-suite run.

External verification evidence:
`C:/Users/nekot/Documents/Codex/2026-10-22/docx-pagination-e2-i6-regression/`.
Use `brief.json`, `input-manifest.json`, `preword-results.json`, per-case receipts,
`ooxml-proof.json`, `inspection.json`, `page-hashes.json`,
`geometry-differences.json`, `word-results.json`, `results.json`, final
`manifest.json`, original-derived inputs/resources and all nine new page PNGs.
All writes are outside the candidate; original I6/E0/B1/C/D evidence is read-only.

| Original selected I6 case | Original PDF | Original Word | B1+C Word | Regression observations |
| --- | ---: | ---: | ---: | --- |
| 01 Core navigation | 5 | 5 | 5 | All text, six whole-document and three per-Section TOC entries, targets3/8,12 links and footer sequence1,2,3,7,8 retained. |
| 02 Core table flow | 2 | 2 | 2 | All24 rows exactly once,14/10 split, repeated header and four Sarabun faces retained. |
| 03 Service typography/images | 1 | 1 | 1 | Mixed Thai/English authored multiline text, four Bai Jamjuree faces, JPEG and alpha PNG retained. |
| 04 Service merged table | 1 | 1 | 1 | Cell text, horizontal/vertical merges and table structure retained. |

All nine new Word pages and nine original PDF pages were inspected individually;
reference review reused existing1500px renders without regenerating PDFs. All
page text and raw ordered character sequences exactly match the original I6 Word
PDFs, preserving Thai marks, source spaces and existing field-result text. Source
LF and business structure are additionally protected by exact body/Section XML
comparison after the explicitly verified metadata/policy exceptions below.
There is no new blank/displacement, missing content/image or table-fragment
regression. No new clipping or overlap observed; the existing tight Thai
bolditalic-descender/image spacing remains, not relabelled a definitive
no-clipping or pixel-parity result.

**Recorded appearance difference:** six of nine new PNG hashes equal the original
Word PNGs. Navigation pages1/2/4 differ only around the12 TOC target numerals and
their trailing extraction spaces. Numerals move **0.48pt left**; their y position,
text, page assignments and link targets do not change. Trailing-space geometry
also changes; all other characters and all image geometry match. Example first
TOC numeral x0: original PDF531.982677pt, old Word532.06pt, new Word531.58pt.
This is a recorded small horizontal difference, not an improvement or a claim
that every visual metric is unchanged. Cause remains **INCONCLUSIVE**: the
owner-returned original Word build/options were not captured. The new export
uses the same pinned16.0.20430.20182/options/procedure as E0/D. No additional
original-package Word export was authorized or spent to isolate that cause.

All12 PDF link destinations and destination coordinates match original Word,
pointing to physical pages3/5 while displaying logical3/8. The empty header remains
empty. The complete24-row split and repeated header are checked from raw
character-stream lines, avoiding geometric extraction reordering of Thai marks.
No Unicode normalization, mark deletion or whitespace collapse creates a PASS.

Original source/resource recovery is explicit. The two Core cases reuse their
retained template/request files and reproduce the exact original PDF hashes;
comparison bytes are discarded, not saved as new references or rendered again.
The two Service cases reuse the original selected
`isolated/task-docx-api` template/business inputs, not a newer Service fixture or
HTTP/DB run. Add the existing template docKey required by the Core API; normalize
two upload descriptors to explicit local image IDs. Every text/style/layout value
is unchanged. Original post-render Service graphs and random derivative UUIDs
were not retained, so exact recovery of those identifiers is not claimed.

Typography uses exact encoded JPEG/RGB/alpha image streams retained inside its
original paired PDF, without reprocessing/re-encoding source images. The resulting
DOCX media bytes equal the original I6 DOCX media. Original library font resource
IDs are recovered from PDF subset unique names, and all four full Bai Jamjuree
fonts match the old I6 font manifest hashes. The original OFL text is reused.
Original database asset IDs are not claimed; local adapters use face IDs as
locators. These are transparent resource-identity substitutions, not new business
fixtures. The Service PDFs remain original hash-verified references; no new
Service PDF or claim of exact random-ID/HTTP reproduction is made. Unchanged D
PDF implementation/resource proof remains reusable.

Before Word, strict XML proof permits only5/74/4/2 eligible widow-false additions
for navigation/table/typography/merged respectively. Original source page breaks
remain3/0/0/0; none is redundant in these inputs, and their XML locations remain
unchanged. All other body/Section properties, full deobfuscated fonts, media,
bands, table rules, fields, ZIP/XML/relationship targets and package parts match
the original I6 DOCX. Timestamps and random font keys are separately verified.
Automatic `_Toc` names vary with the writer's global counter: the checker maps
unique names by unchanged bookmark location and consistently maps every related
hyperlink/PAGEREF, then requires exact whole XML. It does not remove links,
bookmarks, content, breaks or Section carriers to manufacture equality. Numeric
user bookmark IDs are matched by stable names; user bookmark names stay intact.
Read-only Word copies close without saving and retain their source hashes.

Verification preparation corrections affected readers/adapters only: normalize
Core image fields as UUID strings rather than upload objects; correct a relative
Path-dot preflight reader; compare automatic TOC identities consistently; and
read exact raw Thai header lines instead of geometrically reordered text.
Original sources were checked during preparation and installed package identity
before any generation; the corrected D preservation reader confirms all retained
hashes. No production or original-evidence repair occurred. The observed0.48pt
TOC difference is retained without extra export, cosmetic tuning or hidden retry.

Budget: **four Word exports, nine new Word pages plus nine reference-review pages
=18 of22 allowed review pages**, four nominal pages unused, no contingency.
Cumulative experiment review is**162 pages and21 Word exports**, below240.
The original references were not regenerated. All29 source/font/reference receipt
files,96 D artifacts, prior98 E0/57 B1/45 C artifacts and all related manifests
remain unchanged. Primary Core, D worktree and prior worktrees remain clean;
pre-existing Service edits retain their original status. The final manifest
freezes72 external regression artifacts. No product commit or merge was made.

Recommendation: retain B1+C as the preferred **experimental** candidate with the
recorded TOC/provenance qualifications. This four-case check supplies no new
pagination improvement and does not erase prior P/Q or PDF/native geometry,
TOC-dot and spacing differences. The old I6 complete Service-suite prerequisite
remains OPEN and I6 remains **NOT ACCEPTED**; these small-case results do not waive
it. Full pixel parity, the0.48pt cause, wider documents and production readiness
are not proven. **Report and stop before B2 or main integration.**

### I6 full-suite blocker diagnosis and proposed closure 2026-10-22

**Disposition: diagnosis/proposal complete; full-suite blocker OPEN, I6 NOT
ACCEPTED.** Owner request authorizes investigating causes and proposing closure,
not code changes, another test run, B2 or main integration. Active roles: Evidence
Reviewer / Planning Partner / Documentation Synthesizer. Owner is Service for
tests/process/queue behavior and Project Control for this shared proposal. Work,
Phase, Checklist and execution IDs are N/A for this single-room continuation.
Risk Tier: routine. This section is canonical planning/status, not passing
product Evidence. Historical receipts remain intact.

Inspection receipt:
`C:/Users/nekot/Documents/Codex/2026-10-22/i6-full-suite-diagnosis-20261022/inspection-and-preservation.json`.
It freezes inspected source/log hashes and preservation checks. Original logs
and receipts are under
`C:/Users/nekot/Documents/Codex/2026-10-22/docx-core-service-integration/i6-evidence`.
This inspection did not start containers, change a database, run tests, export
Word/PDF, or change product files.

#### Findings and confidence

1. **Confirmed environment mismatch in the retry:**
   `src/tasks/queue-resources.ts:72` rejects a real cgroup memory maximum other
   than exactly1GiB. The diagnostic retry used1.5GiB, so its queue capability
   rejection/HTTP503 failures cannot establish a valid queue regression. The
   retry had7 failed files,11 failed tests and8 unhandled errors. Its recorded
   peak943656960 bytes and zero OOM kills do not prove the earlier1GiB run
   exhausted memory. Scheduler tests that inject their own1GiB samples must be
   assessed separately; real container size alone does not explain them.
2. **Confirmed CLI checker budget mismatch:** the CLI error-sanitization case
   includes an unavailable database whose configured connection timeout is5s,
   plus several child CLI launches. Both old full runs used the default5s test
   limit. The retained15s isolated recheck passed3/3, with this case taking5127ms.
   Service README already documents `npm test -- --testTimeout 15000` for I6.
   This is a checker budget, not permission to increase production deadlines or
   the tests' explicit MCP/native deadlines.
3. **Confirmed shared-lock failure mechanism; initiating hang unresolved:**
   the first full run timed out in the task-api MCP case at60s and native-server
   case at30s, then many cases reported `Processor already active`.
   `src/jobs/processor.ts:22` acquires PostgreSQL advisory key60430404 and releases
   it during stop. `tests/isolatedDatabase.mjs` creates separate schemas in the
   same database; these schemas do not isolate that database-wide lock. A live
   leftover processor can therefore block subsequent files. Both task-api paths
   already have `finally` cleanup; missing cleanup code is not an established
   cause. An unbounded health fetch or transport wait, timeout/cleanup overlap,
   or child-exit race remains a hypothesis. Old logs do not identify the owning
   child PID/PG session or the exact stalled stage. The recheck helper also lacks
   the production compose `init:true` equivalent; using an init process reaps
   dead orphans but does not itself stop a live server or release its lock.
4. **Confirmed reservation ordering; scheduler failure unresolved:** the
   scheduler's storage-wait case observed one worker while the task stayed queued
   and no renderer had entered. `src/tasks/processing.ts:246` reserves a worker
   before awaiting the database storage/quota transaction, and releases it on
   rejection/finally. A snapshot can therefore see a temporary reservation.
   Whether the full-run observation is a sampling assumption, slow transaction,
   cleanup interference, or a product contract defect needs timing evidence.
   Isolated scheduler13/13 passing does not settle this combined-run failure.
5. **Historical fixture failure already superseded:** the retry's invalid TOC
   fixture preceded the final frozen fixture. The retained final I6 API18/18
   result covers that corrected fixture; no validator relaxation is proposed.
   Comparing143 frozen test/helper files to the current Service files found no
   textual differences:14 raw hash differences are line-ending differences only.

The first full run failed33/121 files and60/568 tests; the retry failed7/122 files
and11/586 tests. Neither is a complete passing run on the final frozen snapshot
under all required conditions. The previously collected581 passes and5 optional
skips across isolated files remain supporting evidence, not a full-suite PASS.
The initiating MCP/native hang and the scheduler timing question are the two
principal unknowns; this inspection does not assert that all remaining faults
are only test infrastructure.

#### Proposed bounded closure sequence — not executed

**F0 — freeze and preflight the original I6 candidate.** Target Service base
`8690193b73b14554c63a9aebe5c888edcf780946` plus its retained pending I6 files,
original Core archive SHA256
`067b7678c410e7413968159f7495fb3b0e6f3909f9c14d51eae20f7e5b7f4c3e`,
and final frozen checks image
`sha256:d32cd52be9cce3eff30296fd31304b6d606ba8c73a915ed1b1667fcc6b0ce0f0`.
Record actual hashes, dependencies, configuration and environment before running.
Do not install B1+C to close an older I6 prerequisite. Use disposable test
database/network/storage and a fresh proof directory; never user data or old
proof outputs. Require Linux/amd64, exact1GiB memory limit with1GiB swap setting,
an init process consistent with compose, and a recorded fixed CPU allocation.
Verify actual cgroup limits, pressure/OOM counters, absence of the processor lock
at entry, original vendor/build/migrations, both candidate plugin roots, reviewed
four-face Bai Jamjuree/OFL hashes read-only, and writable proof output. Keep the
documented15s default test limit and existing explicit60s/30s deadlines.

**F1 — capture the first cause with bounded diagnostics.** At most three targeted
invocations: CLI3 cases; task-api14 cases including MCP/native and their cleanup
transitions; then the processing resource-wait case and the two scheduler
memory/storage-wait cases. This is at most20 targeted cases, not full-suite
acceptance. Preserve serial ordering/shared database conditions where relevant;
per-file disposable databases may diagnose isolation but cannot substitute for
the final invocation. Capture owned PID/parent/process-group and PG advisory-lock
holder/session state at start, failure and completion; record transport/readiness
stages and cleanup timing. Capture worker acquisition, quota transaction,
storage rejection/release, assertion times and task terminal reason for the
scheduler question. Use external observation first; any temporary test
instrumentation requires the later authorized test/harness scope and must leave
the product candidate unchanged. Collect bounded cgroup/process samples at most
once per second, no secrets/full environment dumps. Verify no owned live child
or held processor lock before the next case. Budget:10 minutes total diagnostic
time,10MiB evidence, last4KiB stderr per owned child. Stop on budget exhaustion
with the first failure preserved; no automatic retries. One failing-case replay
requires a concrete new observation or authorized repair.

**F2 — repair only a demonstrated cause, if separately authorized.** If the
evidence proves a test-owned lifecycle defect, propose a narrow change in
`tests/task-api.test.mjs` and its necessary helper: owned abort/deadline,
idempotent awaited cleanup and safe child-exit handling, with a reproducing
check. Apply the CLI budget through the existing invocation. Do not add arbitrary
sleeps, weaken assertions, hide unhandled errors or relax the final fixture's
validation. If timing reveals a runtime scheduling/reservation defect, return
the evidence and a new Service repair scope before changing runtime code.
Processor lock semantics, queue1GiB guard, quotas, production timeouts, Core and
PDF/DOCX renderers are outside the proposed harness repair. If targeted checks
pass with clean preconditions, omit F2 rather than invent a repair.

**F3 — one complete full-suite gate after prerequisites pass.** Run the final
frozen candidate with `npm test -- --testTimeout 15000`, preserving the existing
serial file setting, exact1GiB conditions and one dedicated database for the
whole invocation. Verify the discovered inventory against the frozen snapshot
(expected122 files/586 cases); explain any discrepancy before accepting. No
filter, `.only`, sharding, reordered subset, or aggregate of separate runs may
replace this result. Proposed external watchdog:15 minutes, without increasing
explicit case deadlines. Save the source manifest, safe environment identity,
complete structured result/log, resource counters and owned-process/lock checks
at entry/exit. On failure preserve the earliest cause and stop; a second full
run needs a concrete repair plus passing affected checks, not unused budget.

Acceptance requires exit0, every mandatory case passing in that one invocation,
zero unhandled errors, unexpected skips, timeouts, owned live children or held
processor lock at exit. The existing five optional external font-height skips
must remain separately named: `fonts-height-proposals`1,
`fonts-height-supplied`1 and `fonts-height-delivery-guard`3; skips are not PASS.
Hook-failure fallout is not an optional skip. Retain the exact candidate and
review evidence coverage before changing the I6 disposition. Until that result
exists and is accepted, I6 remains NOT ACCEPTED. Closing original I6 does not
authorize B1+C Service integration, B2, release or merge.

#### Preservation, budget and handoff

B1+C remains clean at `b79f426649e65eadb3fb29e410250395a6d65faa` in
`C:/Users/nekot/Documents/Codex/2026-10-22/docx-pagination-e2-b1c/core-worktree`.
The inspection reverified all96 D artifacts,72 regression artifacts and29
original source/font/reference files against their retained hashes. Original
PDF baselines were not regenerated or modified. Service retains its pre-existing
README/usage edits and untracked I6 test/fixture; no product change was made.

Proof Budget this inspection: zero suite invocations, zero Word exports and zero
new document-review pages; cumulative162 pages/21 exports unchanged. The proposed
closure uses ordinary disposable test outputs only, with no new Word review or
replacement reference PDF. A renderer/runtime scope expansion needs its own
impact/proof decision. Document Budget: this existing Project Control plan plus
the external inspection receipt; no new Work/map/registry record. Proposed F0–F3
execution and any repair require subsequent owner authorization. Report this
diagnosis and stop at the current read-only boundary.

### I6 F0 F1 targeted diagnosis result 2026-10-22

**F0 PASS / F1 BLOCKER at the clean-boundary gate; I6 NOT ACCEPTED.** The owner
authorized F0–F1 only, at most20 targeted cases, preserving B1+C and original PDF
baselines. No code repair, full suite, B2 or main integration was authorized or
performed. This result supplements the preceding proposal without rewriting its
historical findings. Active roles: Evidence Reviewer / Documentation Synthesizer;
owner: Service for behavior, Project Control for this checkpoint. Execution IDs
remain N/A for this bounded single-room verification/discovery continuation.

Evidence directory:
`C:/Users/nekot/Documents/Codex/2026-10-22/i6-f0-f1-20261022-161434`.
`receipt.json`, `analysis-summary.json`, the two structured test reports/logs,
per-second process/cgroup/PG samples and boundary snapshots support this result.
Manifest SHA256:
`6ed128465bf1b6c226f5f5fb62922061f2d28cd89514adb850c2a8cb42334e46`;
20 frozen evidence files,633234 bytes before the manifest, below10MiB.

#### F0 identity and environment

The checks used the exact original I6 image
`sha256:d32cd52be9cce3eff30296fd31304b6d606ba8c73a915ed1b1667fcc6b0ce0f0`
and original Core archive
`067b7678c410e7413968159f7495fb3b0e6f3909f9c14d51eae20f7e5b7f4c3e`.
Image inputs were hashed and compared with current Service sources; raw
differences in29 text files were line endings only. No dependency was installed
or upgraded. Original vendor verification, build and migration passed inside
the disposable container; expected build outputs stayed inside that scratch
container. Service host sources and its pre-existing dirty state were preserved.

Actual inspected settings: Linux/amd64, Node24.21.0, init enabled,2 CPUs,
memory1073741824 bytes, Docker memory+swap setting1073741824 bytes and actual
`memory.swap.max=0`. Both plugin roots remained `/candidate`. All four reviewed
Bai Jamjuree faces and OFL hashes matched; fonts were mounted read-only and the
only writable host mount was the new proof output. The database used a new isolated container
and temporary storage, with no host ports. No processor lock/live test child was
present at the initial boundary or after CLI.

The first setup attempt created no network and executed no cases because Docker's
automatic subnet pool was exhausted. After inspecting existing networks/host
routes, a new private10.250.246.0/28 subnet was selected. Existing networks and
containers were not deleted to make room. Its zero-case setup receipt remains at
`C:/Users/nekot/Documents/Codex/2026-10-22/i6-f0-f1-20261022-161351/receipt.json`.

#### F1 results and stopping point

| Invocation | Executed | Passed | Failed | Observations |
| --- | ---: | ---: | ---: | --- |
| CLI, default checker timeout15s | 3 | 3 | 0 | Sanitized-error case9022.5ms; product deadlines unchanged. |
| task-api, default15s plus existing explicit deadlines | 14 | 5 | 9 | Real-PDF30s and MCP60s timeouts; worker-disconnect assertion failure; native30s timeout; five subsequent processor-lock failures. |
| Resource-wait processing/scheduler subset | 0 of3 | — | — | Not run: task-api left a live child and held lock. Not PASS or optional skips. |

Total:17 executed cases,8 passed and9 failed, with3 unspent. The two invocations
took145.687 seconds including runner/observation overhead, within the10-minute
diagnostic budget. There was no retry or third invocation, and no full suite.
No `.only`, assertion change or hidden timeout increase was used.

**Confirmed cleanup failure:** after `npm test` returned exit1, the saved
`task-api-after.json` still shows live Node `server.js` PID1201, stateS, reparented
to init PID1. PostgreSQL session968 remained connected and held advisory
key60430404. The last five cases failed with `Processor already active`.
This establishes an actual live-child/lock leak in the failing test sequence,
including with init enabled; init alone does not fix it. The retained snapshots
do not directly map that Node socket to the PG session, so that exact correlation
is not claimed. Cleanup did not reliably finish before the runner ended, despite
the source's existing `finally`; the exact suspended await remains unproven.

**Strong memory-admission lead, not a complete hang diagnosis:** source worker
admission requires `max(memory.current/MiB, credits)+320 <= 768`, so a new worker
needs total sampled current at or below448MiB. External samples during the first
real-PDF wait were approximately468–471MiB and during MCP approximately538MiB.
A live task-state snapshot also retained a queued task/job with no child, while
earlier interrupted tasks were marked failed. This is consistent with worker
admission waiting before rendering, independently of the old1.5GiB mismatch.
Recorded cgroup peak was589455360 bytes (about562MiB), with zero OOM/oom_kill and
zero memory-pressure totals: this is not evidence of OOM. Aggregate cgroup
current includes the test runner, other processes and file cache. We have not
isolated their individual causal contribution, the observer's contribution, or
the exact coordinator sample/waitReason/freshness at each tick. No memory guard,
worker credit or product timeout is proposed changed from this evidence alone.

The native case then timed out and left its server alive; the saved process/lock
timeline supports the cascade into subsequent cases. It does not prove every
MCP/native wait or every historical full-suite failure has the same cause.
The scheduler's transient-reservation question remains untested because the
clean-boundary prerequisite failed. Remaining budget is not a reason to run it
against contaminated state.

#### Verification limitations, preservation and next boundary

Observation remained outside product/test code. The external reader was adjusted
to include `memory.stat` and classify Node by `/proc/exe`, because Node24 reports
its process name as `MainThread`; raw names remain recorded. This avoids a false
clean-process result. No test instrumentation or runtime source was inserted.
A later attempt to capture PG client-port correlation occurred after automatic
cleanup and failed; that failed observation is retained, not counted as proof.
The post-test in-container input rehash was not reached after the failed gate;
do not label that check PASS. The immutable original image remains available,
and inspected host source hashes/status passed preservation checks afterwards.

Before removing only this run's disposable resources, the failing boundary was
saved. Both owned containers and the new network were removed successfully;
no live owned container remains. This cleanup ends the test environment and does
not hide the recorded live-child/lock failure. No pre-existing container, user
database, original evidence or network was removed.

B1+C stayed clean at `b79f426649e65eadb3fb29e410250395a6d65faa`. All96 D files,
72 regression files and29 original source/font/reference files were reverified
against their manifests before and after execution. Original PDFs were not
regenerated or modified; the new artifact folder is empty. No Word export or
document review was spent; cumulative162 pages/21 exports remains unchanged.
Document Budget remains this existing plan and external evidence; no Work/map
promotion or product commit was made.

Next recommended scope is a narrow proposal for test-owned timeout/child cleanup,
plus a bounded way to observe the existing memory-admission diagnostics and
separate runner overhead from product behavior before changing any resource
policy. A lifecycle repair would not by itself establish that memory admission
or MCP behavior is correct. F2, another targeted invocation, the remaining three
cases and F3 have not started. **Report the causes and stop; no code change,
full-suite run, B2 or integration.**

### I6 F2 cleanup and memory headroom plan 2026-10-22

**PROPOSED ONLY; no implementation or new Service test invocation.** The owner
requested an F2 plan after F0–F1, preserving B1+C and original PDFs, without
full-suite execution, B2 or integration. This plan separates a Service test-owned
cleanup repair from discovery of memory headroom. It does not authorize a runtime
resource-policy change. Owner: Service; roles: Planning Partner / Evidence
Reviewer, with Documentation Synthesizer for this existing canonical PC plan.
Work Size: medium; Risk Tier: routine; execution IDs N/A for single-room work.
No separate WORK room is proposed. Future execution needs owner authorization;
keep implementation and subsequent unchanged-candidate verification distinct.

**Goal:** a timed-out test must cancel its owned operations and finish bounded
cleanup before another case starts; separately explain the observed admission
wait using measured coordinator state and memory attribution. I6 remains NOT
ACCEPTED even if F2 succeeds. The preceding F1 manifest/results remain immutable
input, including its17 executed cases and3 unexecuted cases.

#### F2 scope, alternatives and preparation

Recommended approach: use Vitest4.1.9's existing test-context `signal` (the installed
runner aborts it on timeout) and `onTestFinished` for independently registered,
idempotent cleanup. Pass the signal into existing cancellable APIs instead of
relying on reaching the end of an awaited test body. A process-only kill wrapper
would miss in-process HTTP/MCP waits; a larger timeout would defer the leak.
Container teardown remains emergency containment, never proof that test cleanup
succeeded. Do not add a dependency or change the test runner version.

Future allowed Service paths:

| Path | Responsibility |
| --- | --- |
| `tests/task-api.test.mjs` | Register cleanup before acquiring resources, wire cancellation to current requests/clients/children, retain all existing assertions. |
| `tests/helpers/taskTestLifecycle.mjs` (new) | Test-owned abort, resource registration and bounded idempotent disposal. |
| `tests/task-test-lifecycle.test.mjs` (new) | Four focused lifecycle regressions, including controlled child runner fixtures. |
| `tests/fixtures/task-test-lifecycle/` (new, at most4 small `.mjs` fixtures) | Exercise actual runner timeout/exit behavior without adding document fixtures. |

Opt-in memory probes/controllers are temporary files in a new external proof
directory, mounted read-only into disposable checks, with output written only to
that directory. Narrow test-only observation wiring may be added in the already
allowed task-api file, disabled unless its proof option is explicitly supplied.
No product source, existing fixture, package/lock/vendor pin, migration, plugin,
production configuration, Core or PDF/DOCX renderer changes are in scope.

Create a separate Service worktree at original I6 base
`8690193b73b14554c63a9aebe5c888edcf780946`, using a `codex/` branch. Copy only the
six retained pending I6 files from their frozen receipt, preserving their hashes;
do not stash/reset/commit the primary Service checkout's existing edits. Freeze
the resulting starting input manifest. Retain original Core archive SHA256
`067b7678c410e7413968159f7495fb3b0e6f3909f9c14d51eae20f7e5b7f4c3e`.
Use the same Linux/amd64, Node/dependency pins,2 CPUs, exact1GiB/no swap,
init, plugin roots and read-only fonts as F0. Each diagnostic scenario starts
with disposable storage and an unheld processor lock; the14-case task-api check
shares one database and runs serially so cross-case leaks remain observable.
Build outputs go to scratch; capture source identity before and after checks.

#### F2-A — test lifecycle repair and its proof

- [ ] Define one test lifetime interface: `createTaskTestLifecycle({signal})`
  returns `{signal, own(dispose), dispose()}`. `own` registers a disposer as soon
  as a resource is acquired, before the next asynchronous operation; `dispose`
  returns one shared completion promise on repeated calls. Resource closures
  capture the actual acquired instance, not a mutable variable reused by the
  next case. Registration after cancellation must dispose immediately.
- [ ] Cover four cases with small real-process/runner regressions: timeout
  during a pending native HTTP operation; timeout during a pending MCP operation;
  a child that already exited plus repeated disposal; and a child that ignores
  SIGTERM and requires escalation. Controlled children may acquire the real
  test-database advisory key to prove release. Keep those fixtures distinct from
  the mandatory happy-path document tests. Demonstrate the leak against existing
  wiring before the repair; an import error is not a valid failing reproduction.
  Expected failures in nested runner fixtures are asserted by outer tests and
  reported explicitly, never applied to the existing task-api cases.
- [ ] Register an explicit `onTestFinished` disposer before connecting MCP or
  spawning native Service. Combine the runner signal with a local lifetime
  controller. Wire current HTTP fetch/body consumption and Node requests, direct
  `generateDocumentTask`/`inspectDocumentTask`, and SDK connect/call requests using
  their existing cancellation interfaces. Preserve the deliberately canceled
  lookup's own controller while also honoring the enclosing lifetime. Check
  cancellation between sequential operations to prevent late work after timeout.
- [ ] Abort owned I/O first, clear owned timers, then close client/transport and
  proxy sockets without allowing one failed disposer to skip the others. Observe
  every in-flight rejection. Await settlement within the cleanup budget; if an
  operation cannot settle, fail the boundary and stop successors rather than
  detach it or call it cleaned. Retain the initiating failure and cleanup errors.
- [ ] For native children, install close/error listeners at spawn; check both
  `exitCode` and `signalCode` before waiting, never `child.killed` alone. On Linux
  use an owned detached process group and recorded start identity; terminate only
  that group, with SIGTERM grace at most3s, then SIGKILL and bounded close/reap
  wait at most2s. For SDK-managed stdio use its owned transport/process lifecycle;
  do not signal the runner's shared process group. If the pinned SDK cannot
  expose sufficient ownership/termination control, stop with that finding before
  expanding to plugin/SDK code. Do not search for or kill arbitrary matching PIDs.
- [ ] Close the test's app/manager/processor/intake and await owned sessions after
  aborting requests. Budget total cleanup at most8s, with an explicit test-only
  finish-hook ceiling10s; a cleanup overrun is FAIL. Keep the existing30s/60s case
  deadlines and15s default. Verify no live owned descendant, processor advisory
  lock or owned session persists **before** test database/container teardown and
  before starting a successor; never force-release another session's lock.

Acceptance A: controlled timeout remains a visible failure in its nested fixture,
but its outer regression proves owned I/O stopped, children reaped and lock/session
released. Already-exited/repeated cleanup succeeds without hanging; forced
termination is recorded. Original task-api assertions are unchanged. Happy-path
generation can still fail for an unresolved admission wait; report cleanup and
generation outcomes separately, never promote that partial result to task-api PASS.

#### F2-B — discover memory headroom without changing admission

- [ ] Add bounded observation of the existing `flowdoc.task.queue.memory`
  diagnostics channel and `intake.queueSnapshot()` in test-owned code. The channel
  provides counts/timing/failure, not the exact memory reading; use the snapshot
  for sampled `memoryBytes`, credits, health, pressure and timing. In native
  Service, a read-only preload may subscribe to existing events; external cgroup
  values remain external samples, not an invented internal snapshot. Record phase
  markers before/after readiness, direct generation, MCP connect/call/lookup and
  cleanup to identify the last completed stage without changing plugin code.
- [ ] Capture at most1Hz: cgroup current/peak/stat/events/pressure and CPU throttle;
  per-process PID/start/parent plus RSS/PSS from `smaps_rollup` where available;
  owned sockets and PG client ports/session/lock identity. Separate anonymous,
  file-cache and kernel categories. PSS is approximate and must not be added to
  total cgroup memory as if independent. Buffer diagnostics and flush bounded
  records; no synchronous heavy logging in the scheduling callback or secrets.
- [ ] Run at most three new comparable scenarios: the unchanged real-PDF task-api
  case under Vitest with observation; the same definition, payload, package,
  fonts, HTTP contract and substantive output checks through a direct Service
  process with the controller outside the1GiB cgroup; and that same Vitest case
  with only start/end passive counters to assess observer overhead. Hash semantic
  inputs and hold CPU/build/cache preparation and resource settings constant;
  record any unavoidable topology difference. The direct scenario is capacity
  diagnosis, not a substitute for a mandatory Vitest PASS. Avoid full-document
  exports, cache dropping and global host tuning.
- [ ] Classify the result: correlate internal admission/health data, task state
  and stage timing. A worker requires `max(currentMiB,credits)+320 <= 768`; keep
  current, credit and freshness constraints separate. If only the test topology
  consumes headroom, propose a later harness arrangement with the original gate
  retained. If ordinary Service operation also stalls, or the result points to
  accounting/freshness policy, return evidence for a new Service runtime scope.
  If observer-off changes the outcome or samples cannot distinguish causes,
  report INCONCLUSIVE and propose the next single-variable probe; do not retry
  until green. Never subtract file cache from production admission, increase RAM,
  lower worker credits or relax the queue guard under this F2 scope.

Acceptance B is an evidence-backed attribution or an explicit remaining unknown
with the exact missing observation; an unexplained lower memory number is not a
fix. Direct generation passing or cleanup passing alone does not close I6.

#### Proposed proof budget, checkpoint and stop rules

New proposed cap: **36 case/scenario executions**, inclusive of nested fixtures:
four lifecycle regressions before/after at most8 outer executions plus at most8
nested fixture executions;3 memory scenarios; one14-case task-api invocation;
and the3 previously unexecuted resource-wait cases, only after clean boundaries.
This is a new F2 budget proposal, not reuse of the earlier20-case authorization.
Count every executed nested case; no parameter expansion, hidden replay or
contingency. If implementing the regressions requires more cases, return the
revised budget before execution. Reuse retained CLI3/3 unless relevant changes
invalidate it. Failed intended-red fixtures are retained in disposable isolated
contexts; repaired-green acceptance must pass before teardown removes anything.

Maximum20 minutes aggregate check time and10MiB proof output, zero new Word
exports/reference PDF regeneration/document-review pages. Normal tiny test
artifacts go only to new proof output. Preserve current162 pages/21 exports.
Stop dependent checks on any unexpected live child/lock, mutation or budget
overrun. Resource-wait cases are deferred, not skipped/PASS, if their clean
prerequisite is absent. Do not automatically run F3 even if all F2 checks pass.

Report separately: lifecycle repair result; memory attribution/confidence;
mandatory task-api result; remaining resource-wait result or reason unexecuted;
source/package identity and B1+C/reference preservation. Commit a future narrow
test-only candidate only after affected acceptance checks pass; otherwise retain
its isolated failing state without integration. Final F2 completion needs the
cleanup criteria and adequate memory evidence; an inconclusive probe is a partial
checkpoint with the gap visible. I6 remains OPEN until its separate full-suite
gate is authorized, run and accepted.

This planning turn changes only this existing canonical plan. No source/test
instrumentation, worktree creation, container launch, Service test run or new PDF
generation was performed. B1+C, all baseline/evidence files, production behavior,
B2 and main integration remain outside its mutation scope.

### I6 F2 partial result 2026-10-22

**PARTIAL / RISK / UNKNOWN — F2 not accepted; I6 NOT ACCEPTED.** The owner
authorized the preceding F2 plan in a separate worktree, at most36 executions,
preserving B1+C and original PDFs, with no full suite/B2/main integration.
Role: Product Implementation Agent for test-only repair, then Evidence Reviewer
for the unchanged candidate, and Documentation Synthesizer for this checkpoint.
Service owns the test code; Project Control owns this shared status. Work/Phase/
Checklist/execution IDs remain N/A for this single-room continuation.

Worktree:
`C:/Users/nekot/Documents/Codex/2026-10-22/i6-f2/service-worktree`, branch
`codex/i6-f2-cleanup`, base `8690193b73b14554c63a9aebe5c888edcf780946`.
The six frozen pending I6 files were copied with exact hashes before editing.
The candidate remains **uncommitted, dirty and unmerged** because affected
acceptance coverage is incomplete; retain it for review, do not clean/reset it.

Evidence:
`C:/Users/nekot/Documents/Codex/2026-10-22/i6-f2/proof`.
`ledger.json`, `analysis-summary.json`, per-invocation reports, process/cgroup/PG
snapshots, `candidate-source-manifest.json`, `preservation.json` and `review.json`
separate implementation, measured outcomes and unknowns. The final manifest
includes the earlier manifest/summary correction so that the serial coverage
requirement is not silently replaced by adding separate subsets.
Final manifest SHA256:
`0be100cdebead04f7065f852e8992b6be2b8d170a4b791a8da664b8b9538e5c6`;
165 frozen evidence files,1048241 bytes before the manifest. Recorded environment
and scenario boundary intervals total approximately160 seconds.

#### Changes and targeted outcomes

Only five test sources were changed/added beyond the retained pending I6 files:
`tests/task-api.test.mjs`, `tests/helpers/taskTestLifecycle.mjs`,
`tests/task-test-lifecycle.test.mjs`, and fixture `child.mjs`/`runner.fixture.mjs`
under `tests/fixtures/task-test-lifecycle/`. No production source, package/lock,
vendor, migration, plugin or renderer changed.

The test lifetime now propagates runner cancellation to owned HTTP/MCP calls,
body reads and polling; registers cleanup independently before resource awaits;
shares idempotent disposers for manually stopped resources; and bounds cleanup
at8s. Native children have early close listeners, start-identity checks and owned
group SIGTERM/SIGKILL escalation. The pinned SDK's public close/pid lifecycle
owns MCP teardown. Existing business assertions and30s/60s deadlines remain.
Optional memory snapshots and phase markers are test-only and disabled by default.

The fresh review identified outer nested-runner timeout ownership, invisible late
disposer failures and reusable stale fixture markers. One repair pass added outer
lifetime ownership, invalidated a completed boundary on new late registration,
and created unique per-execution directories. Read-only follow-up found those
three issues resolved; it ran no tests and does not cover unexecuted cases.

| Checkpoint | Counted executions | Outcome |
| --- | ---: | --- |
| Initial lifecycle red | 4 outer +4 nested =8 | Four outer failures retained; already-exited child exposes the old late `once(exit)` hang. Three timeout-report readers failed before completing the leak assertion, so their red proof is qualified. |
| Initial lifecycle green | 4 outer +4 nested =8 | Three outer passes; native outer failed on an asynchronous timeout-marker write race, not a product assertion. |
| Native diagnostic-reader repair check | 1 outer +1 nested =2 | Pass; waits for the timeout marker to finish writing. |
| Vitest memory case with observation | 1 | Original real-PDF case passes. |
| First direct-Service scenario | 1 | PDF generated, but controller incorrectly required exact creator equality instead of the original partial field match; scenario FAIL retained. |
| Corrected direct-Service scenario, fresh database | 1 | Same semantic inputs and substantive HTTP/output assertions pass. |
| Late-disposer red after review | 1 outer +1 nested =2 | Reproduces a fulfilled cached boundary hiding the late disposal error. |
| Final lifecycle green after review repair | 4 outer +4 nested =8 | All four outer regressions pass. Three intentional nested timeouts stay visible; the already-exited/repeated/late-disposal case passes normally. |
| Vitest memory case with passive counters | 1 | Original real-PDF case passes. |
| Critical original task-api subset, serial/shared DB | 4 | Real PDF, actual MCP, actual native Service, and the following fixed-omission case all pass. |

Total **36/36 executions**, including nested cases, failed attempts and diagnostic
rechecks. Filtered tests are unexecuted, not optional skips or PASS. The final
task-api report contains4 passes and10 filtered cases; it is not a14-case pass.
There was no full-suite invocation. Existing CLI3/3 evidence is reused because
its source, deadlines and dependencies did not change.

To remain within the cap, recorded rulings reallocated the3 resource-wait cases
to the native/direct diagnostic repairs, and later replaced the planned14-case
API invocation with review regression proof plus4 critical cases. These are
coverage losses, not completion waivers. They are disclosed here rather than
expanding budget or silently rerunning until green.

The last lifecycle/critical-API boundaries show no live owned Node process,
advisory lock or owned PG session **before** teardown. The actual native case and
its successor pass without the F1 lock cascade in this run. This is bounded
evidence for cleanup, not proof that every F1 timeout condition was reproduced
under the same memory/cache state or that all existing API cases are unaffected.

#### Memory outcome and remaining unknowns

All live scenarios retain exact1GiB/no swap,2 CPUs, Linux/amd64, init and the
original Core archive/plugin/font identities. The external direct controller
runs outside the constrained Service cgroup; that topology difference is explicit.

Observed current maxima during the brief scenarios were approximately308MiB for
instrumented Vitest and107MiB for the successful direct recheck. At those samples,
file charges were approximately14MiB versus1MiB; F1 had much larger file charges
(approximately157MiB in its late sampled window). These are sample observations,
not comparable process-only peaks, guaranteed overhead savings or production RAM
capacity results. PSS is retained separately and is not added to cgroup current.
Cgroup lifetime peaks also include the preparation build and are not render peaks.

Internal test snapshots show coordinator health/timing and sampled current; native
preloads observe the existing channel without inventing an internal memory
snapshot. Neither live scenario reproduced the original long admission stall.
The passive scenario also passes, but at most1Hz sampling undersamples these
short generations, and cache charging was not held identical. Host cache dropping
or global tuning was not performed. Therefore the causal attribution of F1's
headroom failure remains **INCONCLUSIVE**. No OOM was recorded. The admission
formula/credits/guard and production timeouts remain unchanged; lower measured
memory alone does not establish a fix.

#### Preservation, coverage and handoff

The final in-container source/package/vendor hash check matches the original
image for all non-test inputs. Host comparisons confirm only the five allowed
test sources differ from the starting candidate; the six pending I6 files retain
their copied hashes. The preservation reader needed Windows path separator
normalization before evaluating allowed paths; no candidate repair was performed
to satisfy that check. Direct-controller preparation also needed the image's
shell builtin `kill`; its failed scenario and cleanup are retained, not counted
as a passing generation scenario.

B1+C stays clean at `b79f426649e65eadb3fb29e410250395a6d65faa`. All96 D artifacts,
72 regression artifacts,29 source/font/reference files and20 frozen F1 evidence
files pass their retained hashes. Primary Service status is unchanged. Original
PDFs were neither regenerated nor edited. Normal tiny PDF outputs exist only in
the new proof directory; no Word exports or page reviews were spent, retaining
162 review pages/21 exports. Saved scenario and preparation/build boundary
intervals are separately recorded in `timing-boundaries.json`, including the
failed direct scenario's delayed cleanup, within the20-minute check budget;
proof output remains below10MiB. Implementation/planning wall time is separate.

Final boundary was saved, then only this run's two containers and network were
removed. The unmerged worktree and all evidence remain. No release, push, merge,
B2 or system/DOCUMENT_MAP promotion occurred. Only this Project Control prose is
eligible for a documentation commit after its checks; product code is not committed.

Remaining mandatory coverage: a **fresh complete14-case task-api invocation on
one shared database**, then3 resource-wait cases after clean boundaries. A later
10-case subset plus the four selected passes cannot manufacture that gate.
That is a proposed17 additional executions if separately authorized, alongside
a separately bounded memory probe design before claiming the original root cause.
Do not spend them now. F3/full-suite acceptance is a separate future prerequisite,
even if those checks pass. **Stop at36; report partial results and gaps.**

### I6 F2 seventeen case followup result 2026-10-22

**FAIL complete task-api gate / PASS bounded resource-wait subset; F2 and I6
NOT ACCEPTED.** The owner authorized17 additional case executions against the
same F2 worktree: one complete serial14-case task-api invocation, followed by
the3 resource-wait cases only after a clean boundary. No code change, retry,
full-suite run, B2 or integration was authorized or performed. Role: Evidence
Reviewer / Documentation Synthesizer; Service owns the candidate, Project
Control owns this verification checkpoint. Work/Phase/Checklist/execution IDs
remain N/A for this single-room verification continuation.

Candidate remains the uncommitted `codex/i6-f2-cleanup` worktree at
`C:/Users/nekot/Documents/Codex/2026-10-22/i6-f2/service-worktree`, base
`8690193b73b14554c63a9aebe5c888edcf780946`. Its complete tracked/untracked input
manifest, HEAD and dirty status match before/after; all five F2 source hashes
match the preceding frozen candidate. No source, fixture, package, configuration
or production input was repaired to obtain a passing result.

Evidence directory:
`C:/Users/nekot/Documents/Codex/2026-10-22/i6-f2-followup17/proof`.
Manifest SHA256:
`dbe26698b1816988dde72c25c2db64a28c6c07ee1eb76c4a24ba2bcc5eb7c972`;
25 frozen files,2535406 bytes before the manifest. `receipt.json`, `ledger.json`,
both structured reports/logs, test-owned memory snapshots/phase markers,
external process/cgroup/PG samples, the read-only live task-state capture and
`analysis-summary.json` support the findings. No prior evidence file was overwritten.

#### Environment and exact result

The original Linux/amd64 I6 checks image remains
`sha256:d32cd52be9cce3eff30296fd31304b6d606ba8c73a915ed1b1667fcc6b0ce0f0`.
The tests were mounted read-only from the same worktree; only the new proof host
mount was writable. A new isolated PostgreSQL container/database/network and
temporary storage were used, with no host ports or user-data mutation. Settings
remain2 CPUs, init enabled, exact1GiB memory/no swap, reviewed read-only fonts,
original Core archive/plugins, default checker15s and unchanged explicit case
deadlines. Vendor verification, scratch build and migrations passed before tests.

| Invocation | Executed | Passed | Failed | Filtered |
| --- | ---: | ---: | ---: | ---: |
| Complete `tests/task-api.test.mjs`, no name filter, serial/shared database | 14 | 8 | 6 | 0 |
| Processing resource-wait plus scheduler storage/memory-wait subset | 3 | 3 | 0 | 39 |

Exactly17/17 executions, verified independently from report assertion statuses;
there were no nested tests or retries in this follow-up. The39 filtered cases in
the two resource files were not executed and are not optional skips/PASS.
Recorded invocation time was approximately181s; output is below10MiB. This closes
the earlier missing-execution gap with actual failing/passing evidence, not with
acceptance or an aggregate of the earlier four selected passes.

The six failures are retained with their original assertions/deadlines:

| Case | Result |
| --- | --- |
| Actual streaming-proxy/MCP compatibility | 60s timeout. Last generation marker is `direct-generate`; `mcp-generate` is never reached. |
| Confirmed processing-disconnect cleanup | After approximately10.9s, no processing task ID was observed (`undefined` assertion). |
| Actual native Service entrypoint | 30s timeout, after readiness and the `native-generate` marker. |
| Backpressured PDF receiver disconnect | After approximately22.1s, the expected PDF-cut flag remains false. |
| Preparation-finding/paginated-warning sequences | Default15s timeout. |
| Shared normalization/preparation finding-detail cap | 30s timeout. |

The fixed-omission case immediately following the failed native case passes.
There is no `Processor already active` error. After the complete14-case run,
before the resource subset, and after that subset, saved boundaries show no live
owned Node, PG session or advisory lock. The subset therefore ran after a clean
boundary without repairing/resetting the candidate. This supports the bounded
cleanup result; it does not turn the six generation/assertion failures into PASS.

#### Admission evidence and its limits

This run supplies internal sampled memory/health data that the earlier F1
investigation lacked. For five failed in-process cases, periodic snapshots show
`healthy=true`, `workers=0`, `creditsMiB=128`, `waiters=0`, `pressure=false` and
`lastFailure=null`. All the listed samples exceed the necessary current-memory
ceiling for admitting a new320MiB worker under the existing768MiB formula:

| Failed case | Healthy worker0 samples over admission ceiling | Sampled current MiB |
| --- | ---: | ---: |
| Streaming-proxy/MCP case | 59 | 513.20–523.41 |
| Processing-disconnect case | 10 | 485.67–486.44 |
| Backpressured receiver case | 22 | 459.12–471.90 |
| Finding-sequence case | 15 | 471.39–472.83 |
| Finding-cap case | 29 | 474.38–479.78 |

At these readings, `max(currentMiB,credits)+320 > 768` is a sufficient reason
for worker admission to refuse; no slot/FIFO/pressure/read failure is needed to
explain refusal in those snapshots. This is a confirmed mechanism in this run,
not a conjecture based only on external memory or the old1.5GiB mismatch.
The MCP case is waiting in direct generation **before** invoking the MCP
generation tool; do not label this proof of an MCP transport defect.

For native Service,30 existing-channel samples show worker0 with external current
approximately507–547MiB; phase markers show readiness completed and generation
started. These remain external readings correlated with the native publisher,
not an invented native internal snapshot. A live read-only task-state capture
also shows a queued task/job with no child. No OOM is recorded.

The passing fixed-omission case has a worker1 sample at approximately472MiB:
the448MiB condition is for **admitting a new worker**, not a requirement that an
already-running worker always remain below that level. This distinction remains
part of interpretation; no guard, credit or timeout was changed.

Memory attribution is still incomplete. For example, the failed MCP window has
approximately345–355MiB anonymous memory and143MiB file charge, plus kernel memory.
The source of retained allocations/cache charges and the reproducible split
between test harness and ordinary Service load have not been causally isolated.
The new data strengthens the admission diagnosis without proving a safe resource
policy change, a production-only capacity result or a complete explanation of
all historical failures. The three resource-wait passes likewise do not rule
out earlier intermittent scheduler-reservation observations in a complete suite.

#### Preservation and stop

The original runtime source/scripts/vendor/package/configuration hashes match
the retained image after checks. Before/after preservation verifies B1+C clean
at `b79f426649e65eadb3fb29e410250395a6d65faa`, all96 D artifacts,72 regression
artifacts,29 original source/font/reference files,20 F1 and165 F2 evidence files.
Primary Service status and the complete candidate input manifest are unchanged.
The candidate remains dirty/uncommitted/unmerged; no product commit was made.

Original PDF baselines were not regenerated or modified. Ordinary new test PDF
outputs stay in the new proof directory. No Word export or document-review page
was spent; cumulative162 pages/21 exports is unchanged. After recording clean
boundaries, only this follow-up's two containers and network were removed.
The worktree and all old/new evidence remain.

The requested17-case verification is complete, but the complete task-api gate
fails and F2/I6 are not accepted. Next work, if separately authorized, should
plan a controlled attribution of harness/module/cache memory around the now
observed admission wait; there is no automatic code repair, repeat run, F3,
B2 or integration from this result. **Report and stop at17.**

### I6 harness and cache memory attribution plan 2026-10-22

**PROPOSED / NOT EXECUTED.** The owner requests a plan to distinguish test-harness
memory from cache while keeping the exact1GiB rule, B1+C and original PDF
baselines. Current authorization covers this plan and its documentation checks
only. No new Service run, diagnostic container, source repair, full suite, B2
or integration is authorized. F2/I6 remain NOT ACCEPTED.

Project Control owns this shared plan; Service owns any later test-boundary
change. Role: Planning Partner / Evidence Reviewer / Documentation Synthesizer.
Work/Phase/Checklist/execution IDs: N/A, single-room planning continuation.
Work Size: small; Risk Tier: routine. Document Budget: this existing document
only; no new Work, Evidence registration, map, product Markdown or package change.
The current model prepares the bounded proposal; a later execution must resolve
its own model decision under the current policy rather than inherit this one.

#### Question, frozen inputs and accounting

The17-case receipt above is the starting evidence, not a passing gate. In its
failed MCP/direct-generation window, current memory was513–523MiB, including
approximately345–355MiB anonymous and143MiB file charge. The existing admission
formula refuses a new320MiB worker above448MiB when credits are128MiB. These
figures explain sampled refusal; they do not assign all anonymous memory to
Vitest, all file memory to build residue, or all failures to the same cause.

Reuse the unchanged F2 worktree/base, original checks image, original Core A
archive, fonts and fixture bytes identified in the preceding result. B1+C stays
frozen separately at `b79f426649e65eadb3fb29e410250395a6d65faa`; do not substitute
it into the diagnostic Service image. Hash the complete candidate inputs and
retained evidence before/after. Preserve the uncommitted F2 lane and all prior
failures; do not reset it to manufacture a clean baseline.

Every measured Service cgroup retains `memory.max=1073741824`, no swap,2 CPUs,
the unchanged768MiB admission formula/320MiB worker credits, health/freshness,
pressure and recovery rules. Keep deadlines, payload, output validation and
serial order unchanged. PostgreSQL and the read-only observer remain outside
that cgroup in every arm. Record their placement and memory separately; moving
work outside the measured group is a topology experiment, not reduced total RAM.

No larger memory limit, cache subtraction in admission, forced GC, new heap
flags, host cache flush, Docker/VM restart, unrelated-process termination or
production/storage modification. A fresh container is not proof of cold cache.

#### M0: inventory and feasibility before a live budget is requested

Read the frozen17-case phase markers, memory samples, process tree and original
test/controller sources. Produce an attribution table from existing evidence:
before imports/build, application ready, preceding cases complete, generation
requested, admission wait, cleanup and final boundary. Mark missing readings
UNKNOWN rather than interpolate a brief worker that was not observed.

Separate three accounting views:

- cgroup total and `memory.stat` anonymous/file/kernel components explain the
  quantity the queue actually gates; retain component residuals and timestamps;
- per-PID role, RSS and PSS where available locate resident processes/shared
  mappings; never add these values to cgroup total or sum RSS as private RAM;
- optional per-process Node heap/external/array-buffer readings describe only
  those processes and overlap other views. Existing readings are preferred;
  any later external preload must have its overhead and PID recorded.

Vitest and the in-process Service share a process, so OS process metrics cannot
divide their heaps. Record module retention as a hypothesis, not a measured
Vitest-only allocation. File charge is not automatically disposable memory or
proven reclaimable headroom. Lifetime cgroup peak includes setup/build and must
not be reported as the renderer's isolated peak.

Before execution, prepare one reviewed external observer/controller in a new
proof location, leaving the candidate read-only. Reuse the existing controller
and its original partial-field assertions where possible. Review exact payload,
request path and cleanup against the original direct-generation phase; do not
silently replace assertions with whole-object equality or extend deadlines.
If reproducing the required boundary needs a test-source edit, return a bounded
test-only proposal first; this plan does not authorize that edit.

#### Proposed live experiment: at most12 scenario executions

This is a proposed ceiling, not permission to spend it now. Count every started
scenario, including failures/setup failures; no hidden retries or nested tests.
There are at most10 functional case/request executions plus2 cache probes.

| Step | Proposed allocation | Controlled comparison and stopping rule |
| --- | ---: | --- |
| M1 cache feasibility | 2 non-generation probes | In disposable groups with the frozen input inventory, observe initial file charge and the change after a designated reader accesses those same bytes. Record reader placement, read order, files and charge before/after; no document request. |
| M2 same-harness comparison | 8 cases | Two serial runs of original task-api cases1–4, preserving their order/shared database within each run. The only intended difference is the validated cache-preparation condition from M1. Each run uses its own isolated database and unchanged Vitest/application topology. |
| M3 external-controller comparison | 2 direct-generation requests | Two repetitions of the MCP case's direct-generation payload against the frozen Service entrypoint, with the controller outside its1GiB group. Retain the original response/content assertions, limits and cleanup. Compare measured memory/admission at the matching generation boundary. |

M1 does not promise charge transfer or a cold/warm pair. Cached shared file pages
may already be charged elsewhere. Record source/artifact identities, global
read history known to the experiment, preparation/build placement and measured
charge. Choose the two conditions only if M1 demonstrates a useful file-charge
contrast without changing application input bytes or retaining another workload.
Otherwise stop: cache attribution is UNKNOWN, and M2 must not be relabelled as
a controlled cache test. Do not compensate with global cache eviction.

For M2, build/preparation must finish before the measured request in both arms;
verify identical compiled/runtime bytes and no preparation child remains.
Use the same observer and sampling settings. Compare application/process
anonymous memory as well as file charge: if the intended cache contrast also
changes retained application state substantially, report a confounded result.
Two arms are a bounded diagnostic comparison, not a statistically established
effect. Do not repeatedly rebuild until the preferred outcome appears.

The cases1–4 prefix is chosen because the first long admission wait in the
complete-file evidence occurs in case4 before the MCP generation call. If that
prefix does not reproduce an admission wait, retain the negative result and
stop causal extrapolation to the complete14-case file. Do not add the remaining
ten cases, reorder cases or run the suite to chase reproduction within this plan.

M3 deliberately changes the execution boundary: standalone Service replaces
Service inside Vitest. It can test whether that topology admits the same direct
request at1GiB; it cannot by itself measure an exact Vitest-only cost, preserve
prior-case retention, or prove streaming-MCP compatibility. Compare it only
when file charge and setup are sufficiently comparable to interpret; otherwise
label its result standalone capacity evidence with unresolved confounders.
If exact same-process heap separation remains necessary, propose a later
test-harness isolation change rather than infer a subtraction from two totals.

Keep external samples at the existing1Hz during long waits and reuse existing
internal phase/admission snapshots. Capture request/cleanup boundaries without
introducing a high-frequency observer inside the constrained group. A sampling
gap remains a gap. Native channel events must not be described as internal
memory snapshots when they contain no such fields.

#### Result and stop criteria

Return one table per arm containing input hashes, PID/role placement, preparation
condition, phase-aligned total/anonymous/file/kernel memory, available process
metrics, queue health/credits/workers/admission reason, request outcome, elapsed
time and cleanup state. Report observer/controller memory separately. Show
ranges and overlap; do not invent a precise harness/cache percentage.

Classify each claim independently as supported, suggestive or UNKNOWN:

1. Is the original admission refusal reproduced under the same1GiB policy?
2. With harness topology fixed, does an observed file-charge difference explain
   crossing the existing admission boundary, or are other terms confounded?
3. Does the separate-controller topology change measured headroom/admission for
   the same direct payload, and which differences prevent Vitest-only attribution?
4. Are all owned children, database sessions and advisory locks gone after each
   run, with candidate and retained evidence hashes unchanged?

Stop immediately on source/input drift, policy mismatch, orphan/lock, OOM,
observer-induced disruption or exhausted budget. An invalid cache control or
failed reproduction is a useful bounded finding; it does not justify more runs.
Proposed additional ceilings:20 minutes active checks and10MiB new diagnostic
output, with bounded lifecycle cleanup retained. No Word export or manually
reviewed page is allocated; cumulative162 pages/21 exports stays unchanged.
Ordinary future test output is isolated from the original PDF baselines.

Completion of attribution requires an honest control/coverage assessment, not
all cases passing. Any recommendation to isolate the harness, relocate build
work or investigate another term returns as a proposal. A memory-policy change,
test repair, complete-file acceptance, F3/full suite, B2 and integration each
remain outside this plan. This planning checkpoint launches no experiment.

Planning verification: Project Control `tools/check.ts` and `git diff --check`
pass. Read-only hash checks preserve408 prior source/evidence files and all358
candidate inputs; F2 HEAD/status are unchanged and B1+C remains clean at its
frozen commit. This checkpoint changes only this Project Control plan.

### I6 memory attribution M0 M1 result 2026-10-22

**STOP / UNKNOWN attribution.** The owner authorized the preceding discovery
plan up to12 executions, exact1GiB, with an explicit stop if controls cannot
be established. M0 used saved evidence; M1 executed2 cache-only probes. No
functional test, generation request, M2, M3, source repair, full suite, B2 or
product integration followed. The remaining10 executions were not spent.
F2/I6 remain NOT ACCEPTED; neither a passing capacity result nor a policy defect
is established by these probes.

Role: Evidence Reviewer / Documentation Synthesizer. Service owns the unchanged
candidate, Project Control owns this shared checkpoint. Work/Phase/Checklist/
execution IDs: N/A, single-room discovery in the retained isolated lane.
The current host model performed this bounded read-only execution without a
model override or dispatch; its availability basis is the current host tool
contract. No historical registry or separate WORK room was reopened.

New evidence:
`C:/Users/nekot/Documents/Codex/2026-10-22/i6-memory-attribution/proof`.
Manifest SHA256:
`150c3695bfd3926e86bc3821bba2d5e2c1c3d911db01e4e8f16f6ea5f06bd21f`;
28 files,1129508 bytes before the manifest. The manifest also binds the external
`../run.py` observer/reader orchestrator. `ledger.json`, `receipt.json`,
`m0-analysis.json`, both inventories/content digests, per-second target/observer
samples and environment/placement receipts retain the result. External probe
scripts are proof tooling, not changes to Service, its tests or runtime inputs.

#### M0: saved evidence and observer correction

M0 groups existing phase readings and records a nearby per-process sample at
the original direct-generation marker. These are historical samples, not new
case executions. OS metrics cannot split the Vitest/Service heap inside their
shared process; pre-import/build decomposition and native internal snapshots
remain missing. Do not turn summed RSS, anonymous memory or a cross-topology
subtraction into a measured harness-only allocation.

Review found a methodological qualification to the preceding17-case record:
the old `observe.py` was invoked with `docker exec` inside the target's memory
group. It was external to the application, not external to its cgroup. At the
nearby saved sample it had10MiB RSS and8.29MiB PSS. Those values overlap the
existing accounting views and are not a justified subtraction from queue input.
The old measured admission refusal and failed gate remain recorded; that
observer overhead does not establish what an observer-free run would do.

The new observer uses a separate verified cgroup while reading the target PID
namespace/cgroup read-only. Saved target and observer paths differ; observer
memory is recorded separately, approximately12.42–12.47MiB current in probe1
and5.36–5.65MiB in probe2. These are complete observer-group readings, not the
observer's isolated heap. No observer work was silently counted as free RAM.

#### M1: two probes, invalid runtime comparison controls

Both target groups use the exact retained Linux/amd64 checks image
`sha256:d32cd52be9cce3eff30296fd31304b6d606ba8c73a915ed1b1667fcc6b0ce0f0`,
1GiB memory/no swap,2 CPUs, init, read-only image/fonts and no network. No
Service, database, build or renderer was started. The existing admission policy
source is unchanged; the cache probes do not exercise queue admission.

Each probe traversed the same inventory and read/hash-checked it twice with a
bounded streaming buffer. Both cycles and both probes have identical aggregate
path/content digests:5399 files,170391052 bytes (approximately162.50MiB).
The reader then exited; settled readings contain only target init/sleep.

| Probe | Initial total MiB | Initial file MiB | Settled total MiB | Settled anonymous MiB | Settled file MiB | Settled kernel MiB |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| 1 | 44.36 | 16.25 | 209.43 | 0.15 | 192.32 | 16.65 |
| 2 | 18.82 | 0.00 | 6.50 | 0.15 | 0.00 | 5.85 |

The predeclared80MiB file-contrast feasibility threshold was exceeded, but that
alone is insufficient: the same read preparation yielded different settled
charges, not two independently selectable/reproducible application-ready
conditions. Container order/global cache history are confounders. The first
target was removed before the second probe; no claim is made about which
ancestor/other group subsequently owns the pages. Zero target file charge
does not mean zero physical cache, absent file reads or lower total host RAM.
The charge also includes reader/OS file activity, so192.32MiB is not an exact
application-file-only allocation.

Control review found a second concrete coverage defect: the external reader
looked for relative `plugins`, which the inventory reports missing, while the
frozen image's two plugin-root variables point to `/candidate`. Thus byte
equality is established only for the probed inventory, not the entire MCP
runtime footprint. This is a diagnostic-tool coverage error, not a candidate
defect. It was retained and reported rather than repaired/rerun after the stop
condition fired. The preliminary contrast-found receipt is preserved as a
field within the final receipt; final disposition is STOP_CACHE_CONTROL_UNKNOWN.

M2/M3 would compare uncontrolled states, so they were not started. No cache
flush, memory-policy adjustment, extra preparation run or source edit was used
to force a comparable/passing condition. Approximately47.4 seconds elapsed
across discovery/probe execution; output stayed below10MiB. No OOM was observed.

#### Preservation, coverage and next proposal boundary

Before/after checks preserve408 prior source/evidence files and all358 candidate
inputs. F2 HEAD/status and primary Service status are unchanged; B1+C is clean
at `b79f426649e65eadb3fb29e410250395a6d65faa`. Original PDF baselines and all
old D/regression/F1/F2/followup17 evidence remain intact. No Word export or page
review was spent; cumulative162 pages/21 exports stays unchanged. The four owned
probe/observer containers were removed; no owned container remains. No database,
network, user data or product commit was created by this experiment.

Coverage: policy/input containment and bounded cleanup pass; attribution and
controlled cache preparation are UNKNOWN; functional admission, prefix
reproduction and standalone capacity are NOT RUN. The discovery budget stops
at2/12, not at a fabricated10-case PASS or a demand to exhaust the remaining cap.

A later proposal should first correct the external inventory to the actual
runtime/plugin roots and define a repeatable preparation/charge ownership
method without changing the1GiB rule, file bytes or host cache globally. If
that cannot be done within scope, use process-topology observations only with
explicit confounding limits; do not promise an exact harness/cache split.
No follow-up measurement, harness refactor or policy change is authorized by
this result. Report the controlled-comparison blocker and stop.

Checkpoint verification: Project Control `tools/check.ts` and `git diff --check`
pass. Independent read-only checks verify all28 new evidence files, the bound
external runner, all358 candidate inputs, the2/12 ledger, actual separate
observer placement and no remaining owned containers. Only this Project
Control document changes in a repository; product code and maps do not change.

### I6 reader coverage and cache repeatability revision plan 2026-10-22

**PROPOSED / NOT EXECUTED.** The owner's next request covers a plan to include
`/candidate` and establish repeatable cache preparation, retaining exact1GiB,
B1+C and original PDF baselines. No reader/orchestrator edit, container/probe,
functional test, build, B2 or product integration is authorized now. The prior
2/12 STOP remains historical evidence, not an automatically reusable10-run
allowance. M2/M3 and F2/I6 acceptance remain closed to execution/not accepted.

Project Control owns the shared proposal; Service owns any later test-boundary
change. Role: Planning Partner / Evidence Reviewer / Documentation Synthesizer.
Work/Phase/Checklist/execution IDs: N/A, single-room planning. Work Size: small;
Risk Tier: routine. Document Budget: this existing document only, no map or new
Work/registry. Any later WORK resolves its model decision from host availability
at authorization; it does not inherit a model choice from this plan.

#### R0: correct coverage before another measurement

If separately authorized, create revised external proof tooling in a new
`C:/Users/nekot/Documents/Codex/2026-10-22/i6-memory-repeatability` directory.
Keep `i6-memory-attribution/run.py`, its28-file proof and all earlier evidence
immutable. Proposed units are an inventory/reader, external observer and bounded
orchestrator/ledger. They must not import the old orchestrator as a module:
its top-level code launches probes. Service/Core source, tests, configuration,
packages, image layers and original baseline files are forbidden edit targets.

Derive plugin roots from the retained image's `STAGE5_PLUGIN_ROOT` and
`FLOWDOCMAKE_PLUGIN_ROOT`; both currently resolve to `/candidate`. Resolve
absolute paths and deduplicate that shared root. Do not assume that relative
`plugins` is its substitute. Both configured roots must exist/read successfully;
a missing configured root is a hard preflight failure, never a skipped entry.
Require at least `/candidate/scripts/server.mjs` and
`/candidate/scripts/task-client.mjs`, which the frozen case actually invokes.
Record their content digests and the image/root-variable evidence.

Inventory the actual frozen application roots: `/candidate`,
`/work/service/dist`, `/work/service/node_modules`, `/work/service/vendor`,
`/work/service/src`, `/work/service/scripts`, the three package/TypeScript
configuration files and the reviewed `/i6-fonts` mount. Classify any absent path
against the retained runtime/build contract before proceeding; do not silently
skip it or run a build to fill it. Separate application coverage from reader/OS
activity: this inventory is not proof of every operating-system page accessed.
Keep reader/runtime versions and their dependencies constant and retain whole
cgroup accounting rather than attributing every file-charge byte to the inventory.

For each declared entry, record logical path, resolved target, type, size and
SHA256. Resolve directory/file symlinks with a visited-target set; include an
actual external dependency only when its target is explicitly added to the
reviewed root set. Missing/unreadable targets, cycles, unresolved escapes or
special files cause a recorded stop. Deduplicate content reads while retaining
all logical aliases. Do not silently omit a dependency or traverse unrelated
host/proof/storage paths. Content equality must include the newly covered
plugin files; the old5399-file digest cannot certify the corrected inventory.

The future helper review must check required-root failure, duplicate plugin-root
deduplication, symlink/escape handling and aggregate-digest construction before
live execution. These are prospective checks, not claimed passes today.

#### R1: one persistent memory group, one measured cache condition

The proposed change is to match one prepared cache state across repetitions,
not to manufacture a high/low or cold/warm pair. Use one disposable target
container/cgroup for the entire cache-only sequence. Retain that same cgroup,
image layers, mounts, file identities and idle init/sleep until the final
measurement; do not remove/recreate it between repetitions. Do not copy files
to fresh inodes, place a priming reader in another cgroup, move the reader
between groups or perform extra host reads to obtain a desired charge.

The rationale is supported by the Linux kernel's
[cgroup v2 Memory Ownership documentation](https://docs.kernel.org/admin-guide/cgroup-v2.html#memory-ownership):
memory is charged when instantiated and process migration does not move prior
charges; shared-page charging can be indeterminate. Keeping the target alive
removes the old deletion/recreation step as an experimental variable. It is
an experimental control proposal, not a guarantee of cache ownership or
residency. Existing globally cached pages may still be charged elsewhere;
stable zero target file charge must be reported as such, not as zero RAM use.

The target stays at `memory.max=1073741824`, `memory.swap.max=0`,2 CPUs and the
same init/idle topology. No pressure/admission/worker-credit rule changes:
768MiB and320MiB retain their original meaning. The observer stays in its own
verified cgroup; log both paths and both groups' memory, never subtract the
observer from a recorded target total. No Service, database, renderer or build
starts in this cache-only proposal.

One counted preparation scenario inventories and streams/hash-checks the full
reviewed root set twice inside the target, with the same bounded buffer and
reader process lifecycle as the later repetitions. Both passes must match.
The reader then exits. Keep only init/sleep in the target, with no open reader,
background warmer or resident helper masking the final anonymous footprint.
Capture the initial/preparation history; exclude it from claims about a cold
baseline or isolated renderer peak.

Run four counted repetitions with that same reader, file order, bytes and
process placement, in the same surviving target group. Each repetition reads
the complete inventory twice, verifies its digest and exits. No mutation,
between-round cleanup of caches, adaptive preparation, forced GC or retry is
allowed. A first inconsistent repetition stops the sequence; do not keep warming
until four favorable readings can be selected.

After preparation and after every repetition, obtain five consecutive1Hz
post-reader samples, starting only after the reader has exited. Allow at most
15 seconds per boundary to collect them; do not search indefinitely for a quiet
window. All expected target processes must be init/sleep. The observer records
total, anonymous, file, kernel, events and pressure plus available process
RSS/PSS, while its own measurements remain separate.

Proposed tolerances, frozen before results: across all accepted post-reader
windows including preparation, max-minus-min must be at most8MiB for file,
4MiB for anonymous,4MiB for kernel and12MiB for total memory. Require identical
root/content digests, cgroup identity, limits, process topology and no OOM,
unexpected process or inventory error. These are operational repeatability
criteria, not statistical confidence or a Linux guarantee. Any violation means
STOP/UNKNOWN with the raw readings retained; do not adjust tolerances afterward.

The old80MiB contrast threshold addressed a different high/low experiment and
does not apply to this proposed single-condition matching test. Preserve that
old failed result. Four repeats here establish only bounded stability in one
surviving group; they do not establish reproducibility in fresh containers or
transferability to an application that subsequently loads more files.

#### Budget, acceptance and return boundary

Propose a fresh ceiling of5 cache-only scenarios:1 preparation plus4 repeats,
at most5 minutes active execution and10MiB new output. Every started scenario,
including setup/read failure, counts; observer setup failure belongs to the
preparation scenario. There are zero functional case/generation executions and
no nested/automatic retry. Unspent budget after a stop is not permission for
M2/M3. These proposed limits do not authorize any execution in this planning turn.

Acceptance of a future repeatability probe requires complete declared-root
coverage including `/candidate`, four valid repeats under the frozen tolerances,
verified observer separation, no remaining owned process after final cleanup,
and before/after candidate/B1+C/baseline/evidence preservation. A quiet file
counter with incomplete coverage is not PASS. Return the manifest/file count,
bytes, absolute/configured roots, digest, exact cgroup lifetime, every boundary's
ranges/deltas, event/pressure data, failures and actual ledger use.

If these controls pass, report CACHE-CONDITION-STABLE within this limited
cache-only topology and stop for a separate proposal for application/harness
comparison. That later comparison would have to reuse the same live target or
revalidate preparation, bracket each arm with new measurements, keep all
preparation memory charged in the1GiB group, and preserve request/order/cleanup
semantics. Do not move cache outside the budget to make worker admission pass.
If memory differs by enough to affect admission or an arm loads additional files,
the cache-only result cannot by itself certify that application comparison.

If repeatability fails, report the first failing control and propose observation
with explicit confounders rather than a percentage split. No `drop_caches`,
`memory.reclaim`, file eviction advice, page pinning, host/VM restart, synthetic
memory pressure, new file copies, larger limit or production-policy change is
part of this plan. Neither a stable condition nor a tool correction accepts
F2/I6, proves an exact Vitest-only heap, or authorizes M2/M3, B2, full suite or
integration. Original PDF baselines and the clean frozen B1+C candidate remain
immutable; no additional Word export/page review is allocated.

Planning preservation checks confirm the old28-file proof and bound runner
unchanged,408 prior source/evidence files retained, all358 F2 inputs unchanged,
B1+C clean and primary Service status unchanged. This turn changes only the
shared Project Control plan and launches no additional probe.

Documentation verification: Project Control `tools/check.ts` and
`git diff --check` pass; the only repository diff is this plan. Tooling/source
changes and all five proposed live scenarios remain unexecuted.

### I6 candidate reader and persistent cache result 2026-10-22

**PASS CACHE-CONDITION-STABLE in the declared cache-only topology; F2/I6 remain
NOT ACCEPTED.** The owner authorized the revised external reader plus at most5
cache scenarios, exact1GiB, stopping on an invalid control. Preparation1 plus
repeats4 completed; no extra scenario, retry, generation request, Service test,
full suite, B2 or product integration was performed. Stop at the authorized
cache checkpoint; this does not authorize M2/M3.

Role: Evidence Reviewer / Documentation Synthesizer; Service owns the preserved
candidate and Project Control owns this shared checkpoint. Work/Phase/Checklist/
execution IDs: N/A, single-room work using the retained isolated lane. The
current host model performed the bounded helper implementation and observation
without a model override; its availability basis is the current host capability
contract. One static helper review was performed under executing-plans; there
was no separate product WORK dispatch or historical registry reactivation.

New external helper directory:
`C:/Users/nekot/Documents/Codex/2026-10-22/i6-memory-repeatability`.
`reader.py`, `observer.py` and `run.py` implement only the proof tooling;
`test_reader.py` checks its guard behavior. No product repository file, test,
configuration, package, image layer or original baseline was edited.

Evidence: the directory's `proof/manifest.json`, SHA256
`c17966c2fba085ba89a15b0a26ad233ba6d2842bfb88edf27402ac9feabbd6e7`,
binds18 output files/2166816 bytes before the manifest and6 external helper/
review records. `receipt.json`, `ledger.json`, the full inventory, five reader
receipts/logs, raw observer samples, placement and Linux guard-test log retain
the run. The independent `../verify-proof.py` checks the saved proof without
launching a scenario. No previous evidence directory was overwritten.

#### Reader coverage and preflight

The two frozen image plugin-root variables resolve to `/candidate` and are
deduplicated. Both required plugin entries are present and hash-bound:
`/candidate/scripts/server.mjs` and `/candidate/scripts/task-client.mjs`.
Coverage also includes the declared Service dist/node_modules/vendor/src/scripts,
package/configuration files and reviewed fonts. There are5452 unique file
targets/171131670 bytes, with5464 logical file entries retained for aliases.
This is declared application-root coverage, not a claim to inventory every
operating-system page or the reader's entire runtime activity.

Metadata/content identity matches preparation and all four repeats. Each of the
five scenarios streams the same inventory twice with a64KiB buffer; all ten
passes have content digest
`cfd750fda734a0570b26a45f5574e73bb85a264aafb18fc7269533e7bae538ca`.
No configured root was skipped, no dependency escape was added silently and no
build filled missing inputs.

Host helper checks initially could not create symlinks on Windows (WinError1314):
three checks passed and the symlink check was explicitly unavailable, not PASS.
All four helper guard checks then passed unskipped in Linux inside the counted
preparation: configured roots/deduplication, missing-root failure, alias/escape/
cycle handling and content-change/missing-file detection. Fixture files used an
8MiB `/tmp` scratch mount and were removed before measurement; the same mount
persisted unchanged through the sequence. These are helper checks within setup,
not additional cache scenarios or Service functional cases.

Fresh static review found two external-orchestrator failure-path issues before
launch: ownership registration after container creation, and finalization
exceptions suppressing later cleanup/receipt writing. Both were corrected and
the fixes were statically confirmed before the first counted scenario. Their
review record is hash-bound. This run did not inject cleanup failures; it shows
normal bounded cleanup with no errors, not fault-injection coverage of every
orchestrator failure path.

#### Same target group, frozen tolerances, observed result

One target container/cgroup survived preparation and all four repeats using
the retained Linux/amd64 image
`sha256:d32cd52be9cce3eff30296fd31304b6d606ba8c73a915ed1b1667fcc6b0ce0f0`.
It retained1GiB memory/no swap,2 CPUs, init, the same read-only source/fonts and
no network. Only proof output and the bounded fixture scratch space were
writable. No Service, database, renderer or build was started. Production
admission/health/credit/pressure rules are unchanged and were not exercised.

The observer ran in a separate verified cgroup sharing only the target PID
view for inspection. Its group current memory is separately recorded at
approximately5.52–5.62MiB; it is not silently deducted from target readings.
After each reader exited, the first five subsequent1Hz samples were captured,
with only init/sleep remaining in the target. All25 post-reader samples support
the table;38 raw samples retain preparation/reading activity as well.

| Measurement across preparation and four repeats | Observed MiB | Max-minus-min MiB | Frozen allowed spread MiB |
| --- | ---: | ---: | ---: |
| File charge | 202.015625 in every post-reader sample | 0 | 8 |
| Anonymous | 0.16015625 in every post-reader sample | 0 | 4 |
| Kernel | 17.3359375–17.359375 | 0.0234375 | 4 |
| Total current | 219.51953125–220.6640625 | 1.14453125 | 12 |

Every frozen spread criterion passes. Root/content digests, target lifetime,
limits and post-reader topology match. No OOM, unexpected post-reader process,
adaptive cache preparation, cache eviction, forced GC, copied input inode or
host/VM restart was used. Execution elapsed approximately54.9 seconds and
output stayed below10MiB, within the5-minute/5-scenario ceilings.

This establishes bounded stability of the observed prepared condition in one
surviving group. It does not establish a cold/warm contrast, cache ownership
for every page, stability in fresh groups, exact harness-only memory, or a safe
headroom claim after an application loads additional files. The unchanged
202MiB file charge remains part of the target's1GiB accounting; it was not
subtracted from admission or moved elsewhere to obtain a passing request.

#### Preservation, independent verification and stop

Before/after preservation and the independent saved-proof check confirm all408
prior source/evidence files, all358 F2 inputs, the old28-file cache proof and
its runner unchanged. Primary Service status is unchanged. B1+C remains clean
at `b79f426649e65eadb3fb29e410250395a6d65faa`; the dirty/uncommitted F2 worktree
is preserved. Original PDF baselines, prior failed/qualified results and all
old artifacts remain intact. Cumulative162 reviewed pages/21 Word exports is
unchanged; this round generated no document output.

Both owned containers were removed, no owned container remains and the observer
exited0 without OOM. There are no cleanup/preservation errors. All18 proof files,
six bound helper/review records, ten content passes,25 post-reader samples and
the5/5 ledger were independently checked from saved bytes; no extra live case
was used for verification.

The authorized reader correction and cache-repeatability checkpoint is complete.
Any next application/harness comparison needs a separate proposal. The target
group has been cleaned up, so a future run must revalidate preparation rather
than inherit a live/stable state from this receipt. M2/M3, F2/I6 acceptance,
full suite, product-code repair, B2 and product integration remain unperformed.

Project Control documentation checks: `tools/check.ts` and `git diff --check`
pass. The only repository change is this bounded plan/result update; no product
commit, map promotion or runtime installation was made.

### I6 controlled harness Service memory comparison plan 2026-10-22

**PROPOSED / NOT EXECUTED.** The owner requests a plan to compare test-harness
and Service memory under a controlled cache condition, keeping exact1GiB,
B1+C and original PDF baselines. This turn permits source/evidence inspection
and this document only. No helper or product code is changed and no diagnostic
workload/container/probe is launched; only documentation/preservation checks
run. B2/integration remain unauthorized.
F2/I6 remain NOT ACCEPTED. This is a new bounded diagnostic proposal, not an
automatic resumption of the historical M2/M3 generation experiments.

Owner: Project Control for the shared proposal; Service for any later test/
runtime change. Role: Planning Partner / Evidence Reviewer / Documentation
Synthesizer. Work/Phase/Checklist/execution IDs: N/A, single-room planning.
Work Size: small; Risk Tier: routine. Document Budget: this existing plan only,
no new Work, map or registry. A later execution resolves its own host/model
decision rather than inheriting PLAN's choice.

#### H0: answer a narrower question with matched application work

Compare the same frozen `dist/server.js` native entrypoint in two launch
topologies, while both remain charged to the same1GiB target group:

| Arm | Target-group process topology | Fixed application work |
| --- | --- | --- |
| A: Vitest harness | Pinned Vitest4.1.9 runner/test worker, shared diagnostic module/client dependencies, native Service child | Start Service, observe HTTP readiness and fixed idle plateaus, stop Service |
| B: plain Node | Plain Node runner, the same shared diagnostic module/client dependencies, the same native Service child | Exactly the same lifecycle and plateaus |

Both launchers call one shared external scenario module with identical inputs,
imports, child arguments, environment, readiness requests, timing and cleanup.
Keep their controller/client and all Service children inside the target1GiB;
only the identical read-only observer/orchestrator and isolated PostgreSQL live
outside it, with their memory reported separately. Do not move the B client or
preparation memory outside the limit to improve its apparent headroom.

Choose this controlled readiness experiment first because the original
task-api file loads Service inside its test worker; its native case also starts
and stops an in-process Service before spawning the native entrypoint. An A/B
subtraction using that case versus an arbitrary direct controller changes
retained imports/lifecycle as well as Vitest. The old F2 direct controller also
uses different credentials and more assertions than the native case. Neither
is an interchangeable comparison arm without qualification.

The new A fixture is external diagnostic code, not a repaired or replayed
original task-api case. It does not recreate the full14-case retention history,
the MCP/proxy path or the in-process Service topology. Its result can estimate
the runner/topology difference for this shared lifecycle, and locate native
Service versus parent processes; it cannot assign an exact Vitest-only heap
or explain all six original failures. No generation request is included in
this first comparison. Application load/admission needs a later proposal.

#### H1: freeze inputs and revalidate cache in the new round

If separately authorized, use new external tools/fixtures/proof directories
under `C:/Users/nekot/Documents/Codex/2026-10-22/i6-harness-service-memory`.
Proposed files: one shared lifecycle module, thin A/B launchers, an external
single-case Vitest configuration, a read-only observer, an inventory reader and
a bounded orchestrator/ledger. Do not edit existing product tests/configuration,
old helper directories, image layers or any original baseline.

Freeze the retained image/Core A package, F2 test/source state, font bytes,
Node/runtime versions and the known native-entrypoint environment contract.
Use the same credential meaning, connection settings, storage policy and
PYTHON_EXECUTABLE in both arms; private path/schema/port differences must be
listed and limited to owned temporary resources. No heap/GC/timeout tuning,
queue-policy substitution or dependency installation is allowed. No template
or data variation is needed for an empty-job readiness observation.

Expand the reviewed frozen inventory before preparation to include both arms'
tools/fixtures, required test helpers, examples and runtime inputs, in addition
to the corrected `/candidate` and Service/font roots. Both plugin entries and
all transitive symlink targets must meet the existing required-root/escape
checks. Do not assert that the old5452-file digest covers these additions.
Keep proof/output/scratch paths outside the immutable inventory. Missing built
artifacts require a stop/proposal, not an unbudgeted build or live repair.

Use one new persistent target group for the complete round, exact1GiB/no swap,
2 CPUs and fixed mounts/idle init topology. The preceding stable target was
removed; neither its group nor its202.02MiB reading can be inherited. A new
cache value is acceptable if the new condition is measured and repeatable.
The shared database is disposable and isolated from user data, outside the
target group with no host port. Give each arm an equivalent empty schema and
the same readiness prerequisites. Before/after arms require clean owned session/
lock boundaries; active Service connections during measurement are expected.
Stop on an unexpected job. Database setup uses the same helper/placement in both
arms and is complete
before measuring the runner; include its file activity in preparation history.

Preparation reads the full expanded inventory twice inside the target, exits
the reader and collects five subsequent1Hz idle samples. Then perform two
cache-only verification repetitions in that same surviving group. Use the same
guarded reader and immutable file identities; no new inode copies, cache
eviction, global flush, memory.reclaim or external warmer. Verify the observer's
separate cgroup and record its overhead. Linux helper guards belong to counted
preparation, not additional hidden scenarios.

Across these three idle cache windows, retain the established spread limits:
file8MiB, anonymous4MiB, kernel4MiB, total12MiB, identical inputs/idle process
topology and no OOM. Any failure stops before A/B. Two new verification repeats
are a bounded revalidation for this comparison, not another claim of stability
across arbitrary fresh containers or hosts.

#### H2: two paired comparisons, A–B–B–A, with phase gates

After H1 passes, execute exactly one diagnostic A or B case per arm in the
fixed A1–B1–B2–A2 order. This gives paired differences A1-minus-B1 and
A2-minus-B2 while reversing order; two pairs are a diagnostic check, not
statistical confidence. Do not retry, reorder, extend to the old task-api file
or choose the most favorable pair.

The A configuration contains exactly one external readiness case, no discovery
of the original tests, serial file execution and the same pinned runner mode.
Its reviewed include/root/invocation must make a full-suite run impossible by
construction. B uses plain Node on the same lifecycle module. Both have a
new diagnostic-case30s deadline; no original case/deadline is edited. A common
outer scenario60s watchdog includes setup and final boundary checks, not extra
application retries. Stop if the agreed plateaus cannot fit their deadlines.

The shared module emits timestamps and gates these phases for both arms:

1. Common module/client dependencies loaded, Service not yet started: collect
   five1Hz runner-only samples.
2. Spawn identical native Service child, wait at most6s for the same `/health`
   readiness condition, then collect five1Hz Service-ready idle samples.
3. Stop the owned Service within5s, verify no child remains, then collect
   five1Hz runner-after-Service samples before the runner exits.
4. After runner exit, collect five1Hz init-only samples, check owned DB sessions/
   locks/jobs and release only that arm's temporary resources.

The observer reads existing process/cgroup data and phase markers; do not add
per-process memory collectors inside the target. A successful `/health` poll
proves only that observed readiness condition, not an invented healthy native
queue snapshot or available worker credit. No document task is submitted.

Before/after each arm, the init-only window must remain within the H1 idle
spread limits. Across matched loaded phases, require file-charge spread at
most8MiB with unchanged inventory. Record mapped application inputs outside
the declared root set as a coverage gap and stop rather than silently rewarm
or expand the inventory. Record operating-system mappings separately: the
bounded inventory does not certify every OS access; that remains an attribution
qualification even if measured file matching passes. Residual file/output changes stay
charged to the target; do not delete caches/artifacts to restore a good reading.

Anonymous/kernel/total changes while A/B are loaded are measured outcomes;
do not apply the idle4/4/12MiB limits to them, since that would reject the effect
being measured. A larger native-Service footprint, readiness/pressure difference
or order effect qualifies interpretation and may prevent runner attribution.
If cache matching fails, retain observations as confounded and stop, not PASS.

#### Accounting, proposed budget and result boundary

Report phase-aligned target current/anonymous/file/kernel ranges, PID/parent/
script roles, Service-child RSS/PSS and parent/runner RSS/PSS, plus separate
observer/database overhead. PSS is a proportional process view; it is not
added to cgroup totals, and RSS sums are not private allocation. Show residuals
and missing readings instead of forcing the process and cgroup views to agree.
Keep all actual cache charge in the1GiB admission accounting.

Calculate each pair's total/anonymous difference at matched phases and show
both individual pairs, their ranges and any disagreement. Differences similar
to within-window variation or reversing between pairs remain inconclusive.
Compare the native
Service PID's own readings across A/B before attributing a group delta to the
runner. Name any supported delta a difference between these launch topologies,
including their runner/client retention and process costs. Do not label it a
universal Vitest tax, heap attribution, production saving or an original-case
fix. Repeatable HTTP readiness without a task does not establish worker admission.

Proposed new ceiling:7 scenarios total, comprising preparation1, cache-only
verification2 and readiness arms4; at most10 minutes active execution and10MiB
new output. Count every started scenario/setup failure, including failed
readiness; no uncounted pilot, native-case run or nested application test. This
includes two new diagnostic Vitest cases and two plain-Node lifecycle runs,
but zero original Service cases and zero generation requests. There is no
carry-over from the exhausted5-run cache budget or the earlier2/12 stop.

Stop at the first input/policy/cache drift, unknown ownership, missing phase,
unexpected child/job, lock/session leak, OOM, observer disruption or budget
limit. Return the exact ledger, manifest/root/input hashes, phase gates, both
pair comparisons, native-Service versus runner process evidence, limitations
and cleanup/preservation result. Clean up only owned temporary resources;
never reset the dirty F2 lane or alter unrelated containers/applications.

Completion is a controlled comparison with explicit coverage, not a requirement
that A use more memory or that a worker fit. The report may support, fail to
support or leave UNKNOWN the runner/topology hypothesis. No product fix,
memory-policy relaxation, exact harness/cache percentage, F2/I6 acceptance,
MCP/generation claim, full suite, B2 or integration follows automatically.
Preserve clean B1+C, the original PDF baselines and all older failed/qualified
evidence. No Word export or reviewed page is allocated.

This planning turn verifies the existing18-file cache proof and six bound
helper/review files unchanged, together with408 prior source/evidence files,
358 F2 inputs, the earlier28-file proof/runner, clean B1+C and unchanged primary
Service status. No new helper or experiment was created by this proposal.

Documentation verification: Project Control `tools/check.ts` and
`git diff --check` pass. Only this Project Control plan changes; all seven
proposed scenarios and any external fixture/tooling implementation remain
unexecuted in this planning turn.

### I6 harness Service comparison preparation stop 2026-10-22

**STOP_PREPARATION_TOOL_ERROR / comparison UNKNOWN.** The owner authorized the
readiness-only A–B–B–A proposal up to7 scenarios, exact1GiB, preserving B1+C and
the original PDF baseline and stopping when controls cannot be established.
External helper implementation completed, but its preparation preflight failed
before creating a network/container/database or starting a cache/readiness
scenario. No A/B memory result exists. This is not a failed cache measurement
or a Service readiness failure; neither was exercised. F2/I6 remain NOT ACCEPTED.

Role: Evidence Reviewer / Documentation Synthesizer; Service owns the preserved
candidate, Project Control owns the checkpoint. Work/Phase/Checklist/execution
IDs: N/A, single-room work in the retained isolated lane. The current host
model performed bounded inline tooling/discovery without a model override;
availability basis is the current host capability contract. One fresh static
helper review and confirmation of its fixes occurred under executing-plans;
no product WORK room or old execution registry was reopened.

#### External tooling and actual failure

External directory:
`C:/Users/nekot/Documents/Codex/2026-10-22/i6-harness-service-memory`.
New source is only its `run.py` and `tools/` reader, observer, control guards,
shared lifecycle, A/B wrappers, external single-case configuration and frozen
fixtures. The native child environment is explicitly fixed for both arms,
excluding Vitest-injected values; no task-creation method is called. Product
source/tests/configuration, installed packages, image layers and prior helper
directories are unchanged.

Three local synthetic control-guard checks passed, including the distinction
between idle tolerance and anonymous-memory differences during loaded phases.
Python syntax, JavaScript syntax and fixture credential shape checks passed.
The copied reader guards and Linux fixture/Service lifecycle were NOT RUN in
the target environment. Static review identified seven issues in child
environment, readiness deadline, mapping events, process-exit races, arm
watchdog, finalization and network ownership; all were corrected and statically
confirmed before the preparation attempt. That review is not a claim of live
acceptance or exhaustive tooling correctness.

At external `run.py:106`, the subnet-inventory expression iterates
`n['IPAM'].get('Config',[])`. Docker's built-in `host` and `none` networks have
the `Config` key with value `null`, so `dict.get` returns `None` rather than its
default empty list. Iteration raises `'NoneType' object is not iterable`.
Read-only post-stop inspection confirmed precisely those two normal records
(drivers `host` and `null`). No network collision,1GiB mismatch, cache drift,
OOM or candidate defect is established by this preparation-tool error.

The helper stopped before its preparation reservation and before the first
infrastructure mutation. No helper repair, retry, extra preparation, cache
verification, native Service launch or original test run followed. This was an
avoidable external-tool parser defect, retained as a failed attempt rather
than silently fixed/rerun. Execution elapsed approximately15.1 seconds.

#### Raw evidence and conservative budget reconciliation

The as-run `proof/manifest.json` SHA256 is
`77a19554f1f35bb826fbcaec5f4e7b3802409d6c099bd0c64feb6a580d1e2bc9`.
It binds the raw receipt/ledger and13 external helper/review files. The raw
ledger records0 because its reservation was incorrectly placed after the
metadata preflight. Preserve that ledger and source rather than rewriting the
failure as a successfully reserved/executed cache case.

Under the owner's rule that failed setup counts, the authoritative accounting
for this checkpoint is **1 charged preparation attempt / cap7; zero live cache
scenarios, zero readiness arms and zero generation requests**. Six unspent
units are not permission to retry or compress the planned seven-scenario
sequence. `postrun/budget-reconciliation.json` explicitly connects this charge
to the raw0 ledger and its hash. The too-late reservation is a second external
accounting defect, not an excuse to treat the failed setup as free.

The supplemental `postrun/manifest.json` SHA256 is
`df43b304b0a54283e6f1f5adabf02ccd1eef17374fc7065e0e070e8c6a7f7a56`.
It binds the original as-run manifest and three read-only diagnosis/accounting/
verification records. No post-stop cache or readiness experiment was used to
diagnose the normal null metadata. Both failed raw evidence and the explicit
accounting correction remain retrievable.

#### Preservation, coverage and return boundary

Before/after preservation and saved-file checks confirm408 prior source/
evidence files,358 F2 inputs, the earlier28-file proof/runner, the stable-cache
18-file proof and its six bound helper/review records unchanged. B1+C remains
clean at `b79f426649e65eadb3fb29e410250395a6d65faa`, primary Service status is
unchanged and the uncommitted F2 lane is retained. The original PDF baselines
and all earlier failed/qualified results remain intact. No document output,
Word export or review page was produced; cumulative162 pages/21 exports is
unchanged. The as-run13 helper hashes match after stopping.

No owned container/network/database was created and none remains; no unrelated
resource was removed. Read-only inspection confirms the proposed network name
is absent. The intended1GiB settings remain in the frozen invocation, but this
round supplies no live1GiB/cgroup or cache validation. Preparation controls,
pair comparisons, Service/runner attribution and workload acceptance are NOT
RUN/UNKNOWN, not PASS. The old bounded CACHE-CONDITION-STABLE result is not
invalidated or promoted into a new application comparison by this failure.

Next recommended proposal: correct only the external metadata parser so the
known built-in non-subnet networks can have null config, while malformed/
unknown bridge or custom-network subnet data remains a stop. Add bounded
synthetic cases for those normal null values, valid/invalid CIDRs and existing
network ownership; reserve/count preparation before its first Docker preflight
so any future setup failure is recorded. Do not apply that repair or launch a
new attempt from this checkpoint. A fresh execution/budget decision is needed
before a complete seven-scenario sequence; do not bypass a cache-verification
step to fit the remaining six units.

Report the preparation-tool failure and stop. No product repair, document
generation, full suite, B2, product merge or acceptance promotion occurred.

Checkpoint verification: Project Control `tools/check.ts` and
`git diff --check` pass. Independent read-only verification confirms all five
as-run/supplemental records,13 unchanged helper files, conservative1/7 accounting
and all preservation locators above. Only this shared document changes in a
repository; external evidence/tooling is retained separately.

### I6 network parser and budget repair plan 2026-10-22

**PROPOSED / NOT EXECUTED.** The owner requests a repair plan for the external
network reader and preparation budget boundary, including synthetic tests and
a new-round budget. Current scope is this plan and read-only preservation/
documentation checks only. No helper/product source edit, synthetic test run,
Docker command, cache probe, Service launch, generation request, B2 or product
integration is authorized now. F2/I6 and the A/B comparison remain unaccepted/
UNKNOWN. Retain the previous charged1/7 preparation failure and raw0 ledger.

Project Control owns this shared proposal; Service owns any later product/test
change. Role: Planning Partner / Evidence Reviewer / Documentation Synthesizer.
Work/Phase/Checklist/execution IDs: N/A, single-room planning, no registry
reactivation. Work Size: small; Risk Tier: routine. Document Budget: this existing
document only; no new Work, map or product Markdown. A later execution resolves
its own model decision using current host availability.

#### N0: contain the repair and preserve the failed attempt

If separately authorized, create a fresh external directory such as
`C:/Users/nekot/Documents/Codex/2026-10-22/i6-harness-network-repair`.
Keep the failed `i6-harness-service-memory` source, raw proof and postrun
reconciliation immutable. Use two small helper units for pure network parsing
and phase-budget persistence, deterministic fixture tests, and narrow call-site
changes in a new orchestrator copy. Preserve the existing observer, reader,
shared lifecycle, A/B fixture, frozen native environment, deadlines and cache
tolerances; do not use this fix to redesign the experiment.

Allowed future edits are external proof tooling/fixtures only. Forbidden:
Service/Core source/tests/configuration, old evidence/helpers, package/image
contents, B1+C, original PDF baselines, installed runtime, product maps and
unrelated resources. Updated helper bytes must be included in any later frozen
inventory and source manifest. No build/install/live pilot is needed to test
these two pure metadata/accounting defects.

#### N1: classify network metadata before deciding overlap/ownership

The parser takes a saved/synthetic inspect-result list, intended network name
and candidate subnet; it performs no Docker or filesystem mutation. Validate
the record and IPAM shapes explicitly. Return parsed subnets and an auditable
list of recognized non-subnet records, or a typed failure/UNKNOWN.

Accept an explicitly present `IPAM.Config=null` as no subnet only for the exact
built-in pairs `Name=host, Driver=host` and `Name=none, Driver=null`, matching the
retained diagnosis. Record why those entries were excluded. A matching name
with another driver is not the exemption. Missing IPAM/Config, wrong shapes,
unknown bridge/custom null/empty subnet information, malformed entries or an
invalid CIDR remain a stop; do not normalize every false-like value to `[]`.

For bridge/custom records with actual subnet lists, parse each required Subnet
as a valid canonical IPv4/IPv6 network and preserve its family. Deduplicate
without discarding ownership context. Compare overlap only between the same
address family; a valid IPv6 entry must not crash an IPv4 check or be treated
as malformed. Reject the proposed name if it already exists, and reject an
overlapping same-family candidate. Never allocate a different subnet or remove
an existing network merely to pass preflight.

Retain the established ownership boundary: prove the intended name absent
before claiming it, register intended ownership before an uncertain create,
and use the returned network ID for normal cleanup. A timeout may use a
name-based cleanup path only where prior absence/ownership was established;
unknown ownership stops cleanup of that object. Failed metadata inspection
does not grant ownership. No unrelated network may be removed.

#### N2: reserve preparation before the first Docker preflight

After offline source/preservation/fixture prerequisites pass and before the
first Docker image/network/container inspection, durably record preparation
STARTED with `used=1` and the fixed cap. Confirm the saved reservation before
allowing the Docker adapter to execute. Metadata-only setup failures therefore
consume the same preparation unit as later infrastructure failures.

Use a single-writer ledger and a same-directory temporary write/flush/replace
so readers see either the last valid state or the new valid reservation. Do
not claim power-loss durability beyond the verified platform behavior. If
reservation persistence cannot be confirmed, invoke zero Docker operations,
report the accounting failure/attempt explicitly and stop; never continue from
an in-memory counter or call it a free successful0-run preflight.

Preparation encompasses image/network checks, owned resource setup, database
provisioning/migration, Linux helper guards and the initial cache preparation;
it is reserved once. Every later cache/readiness scenario reserves exactly one
additional unit before it starts. Finishing/failing/cleanup changes status,
not the charged count. Duplicate phase starts, a used-up cap, an existing proof
directory or an attempted resume must not reset/refund the budget or silently
reuse an earlier reservation. A failed attempt stops; no automatic new directory
or retry follows. Keep cleanup and its errors visible within the charged phase.

The unchanged intended sequence is preparation1, cache checks2, then A1–B1–B2–A2
readiness arms4. A first Docker-inspection exception must leave a retrievable
STARTED/failed preparation charged1, no created resources and no later phase.
Do not retrospectively rewrite the previous raw0 ledger: its supplemental
charged1 record remains the authority for that historical attempt.

#### N3: sixteen named offline fixture cases

Use deterministic Python fixtures and injected fake Docker/persistence adapters.
The test process must prohibit real Docker/subprocess calls; no daemon, image,
network, database, container, Service or document is needed. Preserve fixtures
and per-case results so the failing inputs can be replayed.

| ID | Synthetic input or injected fault | Required result |
| --- | --- | --- |
| N01 | Built-in host/host with explicit Config null | Recognized non-subnet entry, audited, no exception |
| N02 | Built-in none/null with explicit Config null | Same narrow exemption, no exception |
| N03 | Valid bridge IPv4 plus custom-network IPv6 records | Canonical family-aware subnet collection; IPv4 comparison does not error on IPv6 |
| N04 | Name host but driver bridge, Config null | Stop; no name-only exemption |
| N05 | Ordinary bridge Config null | Stop/UNKNOWN, no empty-list shortcut |
| N06 | Missing IPAM metadata | Explicit metadata failure, no implicit no-overlap result |
| N07 | Config object instead of list/null | Explicit shape failure |
| N08 | List entry without a usable Subnet | Stop rather than silently skip |
| N09 | Invalid subnet/CIDR | Explicit parse failure, no network allocation |
| N10 | Candidate overlaps a valid existing same-family subnet | Stop before create, no adaptive alternate subnet |
| N11 | Intended network name already exists | Stop with ownership false; zero create/remove calls |
| N12 | Absent name proved, fake create times out after possible creation | Charged preparation1; bounded cleanup uses only established ownership, never unrelated objects; no retry |
| N13 | Fake first Docker image-inspect callback raises | Callback observes saved used1 beforehand; failure remains charged1; no resource creation or later phase |
| N14 | Fake successful seven-phase sequence | Exact counts1 through7 and A1–B1–B2–A2 order; completion/cleanup never double-charge preparation |
| N15 | Reservation attempted with used7/cap7 | Rejected before callback; no reset, refund or external invocation |
| N16 | Reservation persistence fails before replace/confirmation | Zero Docker callbacks; previous ledger remains valid, accounting failure reported; no resume from an unsaved counter |

These are sixteen named fixture checks, not sixteen live experiments or an
exhaustive claim about all Docker drivers/crash modes. Preserve the initial
regression failure before repairing the helper; then run the complete fixture
set against the fix. A proposed offline proof ceiling is three complete passes
(at most48 named fixture executions, with collection failures also consuming
a pass),5 minutes active checks and2MiB output. Stop once all16 pass; a third
pass is available only for a demonstrated failing repair, not extra reassurance.
If the offline ceiling is exhausted or a guard remains unresolved, report and
stop with zero live work. No hidden parameterized/live pilot cases are allowed.

#### N4: separate repair acceptance from a new live budget

First proposed checkpoint: accept only the external tool repair after the
sixteen cases pass, the narrow diff/ownership/counting boundaries are reviewed,
and all old hashes remain unchanged. This acceptance does not launch Docker
or confer cache/Service acceptance. Report the exact offline pass/case counts,
changed helper hashes, retained failed regression and remaining limitations.

A subsequent owner-authorized complete comparison needs a **fresh7-scenario
budget**, not the previous unused6: preparation1, cache verification2 and the
four A–B–B–A readiness arms. The historical failed preparation remains charged1;
if the complete new round uses7, cumulative attempts across those two rounds
are8. Never refund that historical attempt, reuse its cap or omit a cache check
to make the new round appear to fit6.

Retain the proposed live ceilings of10 minutes active execution and10MiB new
output, the same persistent target at1GiB/no swap/2 CPUs, exact idle spread
limits8/4/4/12MiB and matched loaded file limit8MiB. Preserve30s fixture/6s
readiness/5s Service cleanup and60s arm deadlines, frozen child environment,
same in-budget caller placement, separate observer/database accounting,
no-generation workload and first-invalid-control stop. Include the repaired
tooling in a new reviewed inventory; revalidate cache instead of inheriting
the old202.02MiB state. The current request authorizes neither repair nor this
fresh live budget; both are proposals for review.

When that future live work is authorized, any metadata/cache/ownership/budget/
phase failure consumes its reservation and stops; no uncounted retries. Return
UNKNOWN where controls fail rather than a harness-memory delta. Completion of
the offline repair or a later controlled readiness comparison does not accept
F2/I6, explain the original complete-file retention history, authorize document
generation, change worker/admission policy, run full suite, perform B2 or merge
product code. B1+C and original PDF baselines remain immutable; no Word export
or reviewed page is allocated.

Planning preservation checks confirm all five failed as-run/supplemental
records and13 helper files unchanged,408 prior source/evidence files and358
F2 inputs preserved, the earlier28-file proof/runner and18-file stable cache
proof with six helpers retained, clean B1+C and unchanged primary Service
status. This turn changes only this shared plan; no proposed test is executed.

Documentation verification: Project Control `tools/check.ts` and
`git diff --check` pass. The only repository change is this bounded proposal;
no helper source, fixture, old receipt/ledger or runtime input changes.

### I6 network parser and budget offline repair result 2026-10-22

Disposition: **PASS for the external offline repair only.** The owner's latest
instruction authorized network parsing, preparation accounting and the sixteen
synthetic cases, with at most3 complete passes. No Docker command, live cache
probe, A–B–B–A arm, document request or product change was authorized or executed.
F2/I6 remain NOT ACCEPTED; harness/Service memory attribution remains UNKNOWN.

Authority: single-room inline external proof-tool implementation and Evidence
review; Project Control owns this checkpoint, Service owns the untouched
candidate. Work/Phase/Checklist execution IDs are not applicable. Scope is small,
routine and bounded by N0–N4 above; no separate product dispatch or new Work
record is opened. Existing recorded evidence and owner constraints are reused.

New external tooling and proof root:
`C:/Users/nekot/Documents/Codex/2026-10-22/i6-harness-network-repair`.
The failed original `i6-harness-service-memory` directory remains immutable.
Only `run.py` differs among the13 copied original helper files; the other12
copies are byte-identical. New files are `tools/network_preflight.py`,
`tools/proof_budget.py`, `tools/test_network_budget.py` and `offline_checks.py`.
The old copied `tools/helper-review.json` is historical; the current repair
review is separately retained as `proof/review.json`.

The parser accepts explicit null Config only for the exact host/host and
none/null built-in pairs and records the exclusion. It rejects malformed or
unknown subnet metadata, existing intended names and same-family overlap;
canonical IPv4/IPv6 parsing preserves deduplicated subnets and owner context.
No parser failure grants network ownership or selects another subnet.

The new accounting unit persists and confirms preparation STARTED/used1 before
the first Docker adapter call. It uses a same-directory temporary file,
flush/fsync and atomic replacement, with readback confirmation; this does not
claim platform power-loss durability. Unconfirmed reservation stops explicitly,
preserves the last valid ledger and invokes zero Docker callbacks. Duplicate,
exhausted or resumed budgets cannot reset the fixed seven-phase sequence.
Status/finalization never adds another preparation charge. The static review
found a finalization census that could still call Docker after a failed
reservation; it was gated by established infrastructure ownership, and N16 was
strengthened through `main()` with failed replacement and zero adapter calls.
The same reviewer confirmed that finding resolved without executing code.

| Offline proof | Result |
| --- | --- |
| Pass1, retained RED snapshot | 16 executed:2 pass,8 fail,6 error |
| Pass2, repaired helpers | 16 executed:16 pass,0 fail,0 error |
| Budget used | 2/3 complete passes;32/48 named case executions |
| Active fixture-check time | 1.156 seconds /300 seconds |
| Saved proof | 68,795 bytes /2MiB;15 files including manifest |
| Real subprocess attempts within fixture suite | 0; subprocess APIs and os.system forbidden |
| Actual Docker/live scenarios/document requests | 0/0/0 |

Pass1 reproduced the old null-reader crash and late preparation charge with
baseline adapters and the unchanged old orchestrator. Its other missing guard
assertions are not fourteen separate product failures. The RED source/test
snapshot and initial results are retained. N16's later integration assertion
strengthened the same named case; no hidden parameterized or extra live cases
were run. Pass2 covers all N01–N16 from the approved table: narrow null
exemptions, malformed metadata, dual-family parsing, overlap/name ownership,
uncertain creation cleanup, first-inspection charge, exact seven phases,
exhaustion/reuse rejection and unconfirmed persistence. Testing stopped after
all16 passed; the third pass was not spent.

Durable proof is `proof/manifest.json`, SHA-256:
`984444160531d3b9b640e08c89019b6449dc5b7710e8b90fa05867c82faded60`.
It binds17 helper files and14 evidence files, including per-case pass logs,
offline ledger, retained RED sources, preservation receipts, result and review.
Changed/new helper SHA-256 values:

| Helper | SHA-256 |
| --- | --- |
| run.py | `9e1ed7cfbce0ef70c26926d4913b1472f4b8fee19163e556fefa625e64e1eb40` |
| tools/network_preflight.py | `d0e05c6ecd505ebbdeeaf0db467bff3685cd1c738848dab443e61866b563b3c7` |
| tools/proof_budget.py | `d797cd260419a61759477840683851115eef08587391a53f963d042448f1d840` |
| tools/test_network_budget.py | `00284b76fb65ce208a036d4952b9f142e08e4d6177936477edfbe5c34c1f894a` |
| offline_checks.py | `cf2db3eac990b97499e23244a8ec080e450b481a571bcd95737d98886afca89f` |

Final read-only preservation checks match the initial receipt:408 prior
source/evidence files,358 F2 candidate inputs, earlier28-file proof/runner,
18-file stable-cache proof with6 helpers, and all5 failed-round raw/supplemental
records with13 helpers remain unchanged. B1+C remains clean at
`b79f426649e65eadb3fb29e410250395a6d65faa`; primary Service status is unchanged.
Original PDF baselines remain within the preserved evidence chain. The copied
1GiB/no-swap/2-CPU arguments, observer/reader, cache tolerances and deadlines
remain unchanged; no live cgroup or cache-state confirmation is claimed.

The historical failed preparation is still charged1/7 by its supplemental
reconciliation; its raw0 ledger is not rewritten or refunded. Any subsequent
live comparison needs separate owner authorization for a fresh7-scenario budget
and a new reviewed inventory incorporating these helper bytes. Revalidate cache
in that future round; no old cache plateau is inherited. This checkpoint does
not authorize Docker, A–B–B–A, full suite, product repair, B2, integration,
release or push. No Word export or reviewed page budget was spent.

Repository impact is limited to this existing canonical plan/result document;
no runtime, product map or generated record changes. Documentation verification:
Project Control `tools/check.ts` and `git diff --check` pass.

### I6 repaired comparison observer preparation stop 2026-10-22

**STOP_PREPARATION_OBSERVER_PLACEMENT_UNKNOWN / comparison UNKNOWN.** The owner
explicitly authorized a fresh seven-scenario A–B–B–A readiness comparison with
the repaired external helpers, exact1GiB, unchanged B1+C and original PDFs,
and first-invalid-control stop. This round stops in preparation at1/7 after
43.468 seconds; no cache reader, cache-verification scenario, readiness arm,
original Service case or document request starts. F2/I6 remain NOT ACCEPTED.
The prior offline16/16 repair acceptance remains limited to its fixtures.

Role: Evidence Reviewer / Documentation Synthesizer; authority: discovery with
no candidate mutation. Project Control owns this result; Service owns the
preserved candidate. Work/Phase/Checklist IDs are N/A for this single-room
scope. Work Size small, Risk Tier routine. The current host model/capability
availability is used inline without override or separate dispatch. Proof cap
is fresh7 scenarios,600 active seconds and10MiB new output. Document Budget is
this existing canonical result document only; no new Work/map or product file.

New isolated external root:
`C:/Users/nekot/Documents/Codex/2026-10-22/i6-harness-service-memory-repaired`.
All17 helper files were copied byte-for-byte from the accepted repair manifest
`984444160531d3b9b640e08c89019b6449dc5b7710e8b90fa05867c82faded60`;
no implementation or fixture change was made. The live source manifest binds16
helpers (the standalone offline suite runner is not used by the live runner).
`prelaunch.json` records the current authority and complete copied source set.

The fixed ledger reserves and confirms preparation STARTED/used1 before the
first Docker inspection. Network metadata preflight now succeeds, auditing
host/host and none/null exclusions. Intended network/container names were
absent before ownership was claimed. The target is created with inspected
Memory=MemorySwap=1,073,741,824 bytes,2 CPUs, init and read-only rootfs;
no cgroup sample was obtained, so a measured no-swap claim is not made.
Both Linux reader/control guard files pass in counted preparation. Four empty
private databases are provisioned/migrated and each prepared boundary records
zero sessions, advisory locks, tasks and jobs. These are preparation steps,
not four readiness arms or additional uncounted scenarios.

The separate observer exits1 with OOMKilled=false before writing its ready
marker. Retained `proof/observer.log` identifies `observer.py:7`:
`PROBE_DB_HOST_PID` is absent from the database `cgroup.procs` values read by
the observer. The orchestrator then reaches its20-second missing-ready-marker
stop. The raw receipt status is `STOP_FINALIZATION_UNKNOWN`, retaining the
nonzero observer-exit error; this is not a successful finalization receipt.
A host PID versus observer-visible PID namespace mismatch is a hypothesis,
not confirmed mechanism: raw membership and namespace values were not retained
before cleanup. No live repair, diagnostic pilot or retry follows this failure.

The ledger remains preparation STOP,used1/cap7. Cache windows, A1/B1/B2/A2
arms, target/process samples and document requests are all zero. Cache is
**NOT ESTABLISHED**, rather than a measured unstable plateau. There is no
expanded runtime inventory/content digest, pair delta, Service/runner RSS/PSS
or observer/database overhead measurement from which to infer attribution.
The previously stable cache-only topology cannot substitute for these missing
controls. No memory policy/admission change or Service failure is established.

All three owned containers and the owned network were removed. A bounded
read-only status check confirms no owned container and the exact network ID
absent. This cleanup verification does not launch another workload or consume
another phase. The observer error remains visible even though resources are
absent; cleanup success does not convert the comparison to PASS.

Saved as-run proof: `proof/manifest.json`, SHA-256
`2200fbf0586f37a6c6e37aa8acf6e807cb5df6d921462d124eb6fd1d84c4944b`.
It binds13 evidence files and16 helpers. Supplemental saved-proof/cleanup
verification: `postrun/manifest.json`, SHA-256
`55a0825a5a574145b4e4ca2ef34a0f8f0005d4d57aaacda5b366b8958fe9cf21`.
It binds two supplemental records, the prelaunch digest and as-run manifest.
Proof/scratch/supplemental output totals24,313 bytes, below10MiB. No raw
receipt, ledger, failed trace or earlier proof is rewritten.

Saved-proof checks confirm both preservation receipts agree:408 prior
source/evidence files,358 F2 inputs, old28-file proof/runner and18-file cache
proof with6 helpers remain intact. All5 original failed-round records and13
helpers, and the offline repair proof/source, are hash-verified unchanged.
B1+C stays clean at `b79f426649e65eadb3fb29e410250395a6d65faa`; primary Service
status is unchanged and original PDF baselines remain preserved. No product
source/test/configuration, package/image contents, full suite, B2 pagination
rule or integration is changed. No Word export or reviewed page is allocated.

The earlier failed preparation remains charged1 independently; this fresh
failed preparation charges another1 (two started preparations across the two
live rounds). No refund, resume or automatic use of the unused6 occurs.
Recommended next work is an offline proposal to diagnose observer PID/cgroup
membership and add relevant fixture coverage before any repair or new live
attempt. This result grants no further execution. Repository impact is only
this current result update; Project Control `tools/check.ts` and
`git diff --check` pass.

### I6 offline observer PID cgroup diagnosis plan 2026-10-22

**PROPOSED / NOT EXECUTED.** The latest owner request permits a plan for offline
PID/cgroup investigation and synthetic cases only. This turn reads retained
sources/evidence and authoritative Linux documentation; it does not change
helpers, create/run fixtures, invoke Docker (including inspect/status), inspect
live Linux procfs/cgroups, or start cache/A–B–B–A work. Exact1GiB, B1+C, original
PDFs and all prior evidence remain fixed. F2/I6 remain NOT ACCEPTED; memory
attribution remains UNKNOWN. This is not permission to remove the placement
check or resume the stopped live round.

Owner: Project Control for the shared plan, Service for the preserved candidate.
Role: Planning Partner / Evidence Reviewer / Documentation Synthesizer.
Work/Phase/Checklist execution IDs: N/A, single-room planning. Work Size small;
Risk Tier routine. Document Budget: this existing canonical plan only, no new
Work/map/report. Any later execution resolves its own current host/model
availability; no product dispatch, architecture change or model override is
implied. Acceptance here is an evidence-backed diagnosis plan with explicit
unknowns, named fixture expectations, scope and proof ceilings.

#### O0: separate saved facts, missing evidence and hypotheses

Retained failure: `i6-harness-service-memory-repaired/proof/observer.log` stops
at observer.py:7, comparing the Docker inspect host PID to the database
`cgroup.procs` list. The observer is launched with the target's PID namespace
(`--pid=container:...`) and the host cgroup namespace (`--cgroupns=host`), but
those settings do not make its PID view the host PID view. Its database path
is inferred by replacing the target container ID in the target path. These
are two assumptions to examine independently: comparable PID numbering and
correct database cgroup location. Neither assumption was proved by a retained
ready marker or raw namespace/membership snapshot.

The earlier working cache-only observer uses the same target PID placement
but does not perform the added database-PID membership assertion. Its PASS
therefore does not validate this new cross-container check. The latest trace
establishes a failed comparison, not whether the database was in the wrong
group, had exited, or was invisible through the observer's PID namespace.
No old snapshot may be reconstructed from invented PID values.

Primary semantic references, consulted for this proposal:
[Linux PID namespaces](https://www.man7.org/linux/man-pages/man7/pid_namespaces.7.html)
defines process visibility and namespace-dependent PID numbers;
[proc_pid_status](https://www.man7.org/linux/man-pages/man5/proc_pid_status.5.html)
defines NSpid ordering relative to the procfs mount's PID namespace;
[Linux cgroup v2](https://www.kernel.org/doc/html/latest/admin-guide/cgroup-v2.html)
defines membership files, possible repeated/recycled PIDs and namespace-relative
cgroup paths. These explain why separate PID and cgroup identity evidence is
needed; they do not supply the missing facts from this Docker run.

Hypothesis H-PID: the observer cannot compare the database host PID in its
current PID view. Alternative H-PATH: the inferred database path is wrong or
uses a different cgroup/mount view. Alternative H-LIFETIME: identity changed,
process exited or the snapshot crossed a restart. Classify each as supported,
contradicted or unresolved from saved inputs. H-PID is plausible from the
source topology; the exact as-run mechanism stays unresolved offline because
no raw namespace/membership capture survived. Do not promise an offline test
will prove the historical runtime condition.

#### O1: proposed pure diagnosis boundary, not an observer repair

If separately authorized, use a fresh external directory such as
`C:/Users/nekot/Documents/Codex/2026-10-22/i6-observer-placement-offline`.
Proposed files: `placement_diagnosis.py` for pure parsing/identity decisions,
`test_placement_diagnosis.py` with sixteen named cases, immutable JSON/text
fixtures and `offline_checks.py` for bounded execution and saved results.
Do not import the old observer: it performs procfs reads at module load.
Keep its source as an immutable fixture/reference, not executable test setup.
No edits to run.py, observer.py, accepted network/budget helpers, old evidence,
Service/Core/tests/config, image/package contents or installed dependencies.

Proposed interface: `diagnose_placement(snapshot)` accepts supplied text/JSON
only and returns a typed result with source provenance, per-role identity
checks, reasons and missing evidence. Proposed statuses are
CONSISTENT_SNAPSHOT, NAMESPACE_NOT_COMPARABLE, IDENTITY_MISMATCH and
SNAPSHOT_INCOMPLETE. They describe offline inputs, never live readiness.
Even CONSISTENT_SNAPSHOT cannot write observer-ready.json, launch an adapter,
set the old databasePidMembershipVerified flag, or authorize cache/A/B.

Snapshot contract separates Docker/container IDs and host PIDs from each
reader's PID and cgroup namespace IDs, procfs mount view, cgroup2 mount/root,
raw `/proc/.../cgroup`, status/NSpid and stat start-time fields, and membership
read results/errors with capture order. Use role-labelled origin, schema
version and content digests; fabricated fixtures must say synthetic. Missing
values from the failed run remain missing. Never infer host PID from the
first/last NSpid value without establishing the mount/namespace relationship.
Same numeric PID across two namespaces is not an identity match.

A positive synthetic identity result needs compatible views or an explicit,
uniquely established namespace mapping, stable process start identity and
matching full container/cgroup identity. Parse cgroup v2 paths and mount roots;
reject ambiguous hierarchy or path resolution. Do not use unrestricted string
replacement, container-ID substring matches, a directory's existence or any
nonempty membership list as proof. Unreadable data, process races, stale
bindings and unsupported views produce an explicit stop/unknown result.
Keep target, observer and database distinct; target memory.max must equal
1073741824 and memory.swap.max must equal0 in a complete synthetic snapshot.

The future evidence specification may describe a role-local database snapshot
bound to an exact container ID and stable before/after inspect identity, but
this proposal does not collect it or accept it as a replacement live guard.
If the current observer cannot observe the sibling database PID, report that
limitation. Any choice to change namespace placement, introduce another live
collector or change the database membership proof needs a subsequent scoped
proposal after these findings. No privileged observer, host-PID switch, new
mount, cgroup migration/write or weakened guard is selected here.

#### O2: sixteen deterministic offline cases, pending authorization

Each row is one named case with one fixed fixture/fault; no hidden parameterized
cases or live setup. “Expected stop” means the diagnosis test passes by refusing
unsupported evidence, not by making the experiment proceed.

| ID | Fixed synthetic condition | Required diagnosis |
| --- | --- | --- |
| O01 | Complete same-PID-view snapshot, correct three groups and target limits | CONSISTENT_SNAPSHOT; exact role membership and evidence retained |
| O02 | Observer shares target PID namespace; database is in a sibling namespace with no comparable PID | NAMESPACE_NOT_COMPARABLE; no wrong-group conclusion from invisibility |
| O03 | Explicit verified ancestor/descendant PID mapping, stable identity and compatible procfs origin | CONSISTENT_SNAPSHOT using the evidenced mapping, without assuming host equals innermost PID |
| O04 | Procfs PID-view origin missing while NSpid values are present | SNAPSHOT_INCOMPLETE; no guessed first/last-column mapping |
| O05 | Malformed nonnumeric NSpid field | SNAPSHOT_INCOMPLETE with typed field error |
| O06 | Same numeric PID in two explicitly unrelated namespaces | NAMESPACE_NOT_COMPARABLE; no false identity match |
| O07 | Database cgroup identifies a different full container ID | IDENTITY_MISMATCH; substring similarity cannot pass |
| O08 | Snapshot binding uses an obsolete database inspect identity after restart | IDENTITY_MISMATCH; stale receipt cannot certify new process |
| O09 | Ambiguous/missing cgroup2 mount-root mapping | SNAPSHOT_INCOMPLETE; no assumed global-root path |
| O10 | Database path inferred by replacement disagrees with explicit role-bound path | IDENTITY_MISMATCH; never auto-select a replacement path |
| O11 | Target memory.max differs from1073741824 in otherwise complete snapshot | IDENTITY_MISMATCH with limit violation; no relaxation |
| O12 | Observer and target resolve to the same memory cgroup | IDENTITY_MISMATCH; observer overhead must remain separate |
| O13 | Injected process disappearance between membership and identity read | SNAPSHOT_INCOMPLETE; no retry or silent success |
| O14 | Same PID now has a different stat start-time during capture | IDENTITY_MISMATCH; reject PID reuse |
| O15 | Injected PermissionError reading membership | SNAPSHOT_INCOMPLETE; retain operation/error instead of treating as empty |
| O16 | Injected diagnostic-receipt write fails on the non-comparable-view path | Stop remains stop, zero ready-marker/adapter calls; output failure explicit, no fallback success |

Proposed implementation sequence after separate authorization: preserve sources
and fixtures; record the old comparison behavior on the synthetic sibling-view
case without running/importing observer.py; then add the pure diagnostic unit
and check all sixteen cases. Keep the initial failing/incorrect classification
and its source snapshot. The old raw AssertionError is a reproduced behavior,
not a diagnosed live cause. Include per-case expected/actual status and evidence
coverage; positive fixtures cannot certify unseen kernels, drivers or mounts.

Proposed Proof Budget: at most3 complete sixteen-case passes,48 named executions,
5 minutes active checks and2MiB new proof. Reserve each pass before collection;
collection failure consumes a pass. Stop once all16 expected outcomes pass;
a third pass requires a demonstrated failing repair, not reassurance. Forbid
subprocess APIs, os.system and real /proc or /sys/fs/cgroup access throughout
fixtures; use injected text/read/write/error adapters and isolated temporary
outputs only. No Docker/Service/network/database, Linux namespace creation,
live collector or extra network/budget regression suite is needed. This turn
allocates no executed fixture pass and creates no proposed external directory.

#### O3: checkpoint and any future live boundary

Offline checkpoint, if authorized later: all sixteen named outcomes, bounded
ledger, source/fixture hashes, initial regression, retained diagnostics/errors,
zero external/procfs operations and unchanged older manifests. Report explicitly
whether the available evidence identifies a source assumption only or confirms
a real runtime mechanism. Return remaining unknowns and the smallest proposed
next measurement/repair; do not claim the observer is fixed or live-ready.

Any later observer repair needs explicit authorization, a fresh isolated helper
copy and review of readiness/ownership/error persistence before execution. Any
later live comparison needs separate authorization and its own budget, including
preparation and both cache checks. Preserve the two historical charged
preparations; do not resume either failed ledger, refund counts or treat the
remaining6 as automatic permission. Keep1GiB/no swap/2 CPUs, cache limits,
shared lifecycle, deadlines, no-generation boundary and first-invalid-control
stop. F2/I6 acceptance, full suite, B2 and integration remain out of scope.

Planning preservation checks reverify all15 latest as-run/supplemental records,
16 live-bound helpers and prelaunch digest, accepted offline-repair source and
proof, original failed-round manifests,408 prior source/evidence files,358 F2
inputs, earlier28-file proof/runner and18-file cache proof with6 helpers. B1+C
is clean and primary Service status unchanged; PDF baselines remain preserved.
No Docker command, fixture case or additional live scenario is executed.
Only this existing Project Control document changes. Documentation verification:
`tools/check.ts` and `git diff --check` pass.

### I6 offline observer placement diagnosis result 2026-10-22

**PASS for the bounded offline diagnostic unit only.** The owner authorized
O0–O3's new external helper and sixteen synthetic cases within three complete
passes. All16 expected outcomes pass on pass2; testing stops with no third
pass. The existing observer, live orchestrator, network/accounting tools and
product source/tests/configuration are unchanged. No Docker command, live
procfs/cgroup read, Service, cache or A–B–B–A scenario is executed. F2/I6 remain
NOT ACCEPTED; the historical observer failure's exact runtime cause and the
harness/Service memory difference remain UNKNOWN.

Owner/role: Project Control for this checkpoint; Evidence Reviewer /
Documentation Synthesizer implementing external offline tooling. Service owns
the untouched candidate. Execution IDs N/A, single room; Work Size small,
Risk Tier routine. Current host model/capability availability used inline,
without override or separate product dispatch. Proof Budget3 complete passes,
48 named executions,300 active-check seconds and2MiB proof; Document Budget
this existing canonical result only. No new Work, Phase, map or shared report.

New external root:
`C:/Users/nekot/Documents/Codex/2026-10-22/i6-observer-placement-offline`.
New files are `placement_diagnosis.py`, `test_placement_diagnosis.py`,
`offline_checks.py`, sixteen fixed synthetic JSON fixtures and bounded proof.
The old observer source is copied as inert `proof/observer-source.txt`; it is
never imported or executed. The pure helper accepts supplied text/JSON, parses
identity/namespace/mount/membership evidence and returns typed diagnostics.
Its sole optional output effect is an injected diagnostic writer; no ready
writer, Docker adapter, namespace/cgroup operation or live execution interface
exists. Every diagnosis has liveReady=false and omits the observer's old
databasePidMembershipVerified success flag.

| Proof stage | Result |
| --- | --- |
| Pass1 retained RED | 16 executed,0 pass,12 fail,4 error |
| Pass2 diagnostic unit | 16 executed,16 pass,0 fail,0 error |
| Charged offline budget | 2/3 passes;32/48 named executions |
| Active fixture checks | 0.297 seconds /300 seconds |
| Retained proof | 87,098 bytes /2MiB;17 files including manifest |
| Fixed fixture hashes | 16 unchanged JSON inputs |
| Real process/system-filesystem attempts in suite | 0; subprocess/os.system and live procfs/cgroup file access guarded |
| Live scenarios / observer changes / product changes | 0/0/0 |

RED uses a supplied-data adapter of the literal old host-PID membership
comparison, never the live observer. It reproduces an unclassified assertion
for sibling visibility and lacks the new typed/evidence contract; its sixteen
nonpassing tests do not mean sixteen original runtime defects. RED source,
tests, suite runner and results remain preserved. The same sixteen GREEN
cases retain expected/actual diagnoses and fixture provenance. The only test
instrumentation addition after RED is per-case diagnosis retention, without
weakening assertions or adding named/parameterized cases. The fresh static
review reports no actionable issue within this synthetic scope and performs
no import, execution, tests, edits or live access.

GREEN outcomes:2 CONSISTENT_SNAPSHOT,3 NAMESPACE_NOT_COMPARABLE,
6 IDENTITY_MISMATCH and5 SNAPSHOT_INCOMPLETE. The three non-comparable outcomes
include sibling visibility, numeric PID collision across namespaces and the
receipt-write-error path. A passing test for a stop means the checker refused
unsupported identity, not that placement passed. Missing procfs origin,
malformed NSpid, ambiguous cgroup mount, process disappearance, PID reuse,
permissions, stale inspect binding, wrong path/ID, wrong target limit and
observer overlap all give their required explicit results. O16 retains the
non-comparable diagnosis and reports OSError; no ready marker or adapter call
occurs. Per-case reasons/provenance are in `proof/pass-2-diagnoses.json`.

The fixture schema explicitly models its namespace graph's unique root as
the supplied Docker-host PID view. The two complete positives use that reader
view, including one explicit ancestor/descendant NSpid chain. Other root/view
bindings require evidence or stop; the helper does not discover a real host
namespace or trust a PID column as host by position alone. Namespace ancestry,
role bindings and capture order remain supplied model inputs. Content hashes
protect their identity, not their real-world truth. General kernels/drivers,
unsupported views, actual cgroup permissions and crash durability are outside
this sixteen-case proof. No live1GiB/no-swap confirmation is claimed; exact
1073741824/0 target limits remain in the synthetic contract without relaxation.

The saved source supports identifying two assumptions in the failed observer:
comparing Docker's host PID in the observer's PID view, and deriving a database
path by container-ID replacement. Synthetic sibling/collision inputs establish
why absence or equal numbers cannot independently prove placement. They cannot
choose between H-PID, H-PATH and H-LIFETIME for the old run: raw as-run namespace,
mount, membership and process-start observations were not retained. The old
error is not rewritten into a confirmed namespace diagnosis or a fixed observer.

Manifest: `proof/manifest.json`, SHA-256
`d597300be0e41428db465b376d2bc6d5f31f2f911f3b793764fac0a09a0f0d40`.
It binds3 helper files,16 fixture files and16 proof files. Helper SHA-256:

| File | SHA-256 |
| --- | --- |
| placement_diagnosis.py | `1038a30416ba13d21efecba4bdcd530a12bde8d41d3e85693c570ebbc19af1a9` |
| test_placement_diagnosis.py | `f6238d76e0e0a32c5e2b43867731fbb513c0c81c759cf0ada96f39a8b51b20a4` |
| offline_checks.py | `aa166c3198a57e7a67bd01302aef2997aa6e1249afc10b62dab173b5d41fe0dc` |

Before/after preservation agrees:408 prior source/evidence files,358 F2 inputs,
28-file earlier proof/runner,18-file cache proof with6 helpers, the latest15
as-run/supplemental records and16 live helpers, all original failed-round
manifests, accepted network-repair proof/source and prelaunch digest remain
unchanged. The old observer hash is identical. B1+C remains clean at
`b79f426649e65eadb3fb29e410250395a6d65faa`; primary Service status and original
PDF baseline evidence remain unchanged. No Word export/reviewed page allocated.

Both historical live preparations stay charged1 each. This offline checkpoint
uses no live budget and does not resume/refund either ledger. Recommended next
work is a proposal for the minimum future namespace/cgroup identity capture
and an explicit observer-proof contract before repair or any live retry.
No further helper/observer repair, Docker, A–B–B–A, full suite, B2, integration,
release or push is authorized by this result. Repository change is limited to
this existing canonical result document. Project Control `tools/check.ts` and
`git diff --check` pass; no runtime/package/map change is made.

### I6 PID namespace cgroup evidence and observer acceptance plan 2026-10-22

**PROPOSED / NOT EXECUTED.** The owner asks for the missing-evidence collection
plan and observer acceptance criteria first. Current authority permits retained
file/source inspection and this plan only. No collector, observer, orchestrator,
fixture or product code is changed; no fixture suite, Docker command (including
status/inspect), live procfs/cgroup access, cache or A–B–B–A work is run.
Exact1GiB, B1+C, original PDFs and all prior receipts remain fixed. F2/I6 and
harness/Service attribution remain NOT ACCEPTED / UNKNOWN respectively.

Owner: Project Control for this shared plan, Service for the untouched product
candidate. Role: Planning Partner / Evidence Reviewer / Documentation
Synthesizer. Execution IDs N/A, single room. Work Size small, Risk Tier routine.
Reuse the current O0–O3 contract and offline16/16 proof; do not reopen its
passing budget. Document Budget: this existing canonical plan only, no new
Work, map or shared report. Any later execution makes a fresh compact model/
host availability decision. Blocking unknowns are comparable PID provenance,
actual database cgroup identity and process lifetime at the failed boundary.
Missing historical observations cannot be recovered by manufacturing values
or by a new run: a later capture describes that new run only.

#### P0: evidence contract and collection origins

A future capture must retain raw values and the reader's view before evaluating
membership. Do not infer the host PID view from --cgroupns=host, assign the
namespace graph's root by convention, or reuse synthetic identities as runtime
facts. The prior offline helper supports a supplied host-view model; it cannot
be fed invented root/ancestry fields to turn this target-PID-view topology into
CONSISTENT_SNAPSHOT. Keep its diagnostic result and limitations visible.

| Evidence | Required origin and binding | What it resolves |
| --- | --- | --- |
| Container identity before/after | Orchestrator records exact full IDs, role, image digest, running state, Docker-reported host PID, StartedAt/restart state and relevant PID/cgroup/memory/mount configuration | Wrong container, restart, resource configuration drift |
| PID/cgroup/mount views | Each role-local reader records its own PID namespace and cgroup namespace identifiers, raw init/self status including NSpid, raw cgroup entries, relevant procfs/cgroup2 mountinfo and explicit read errors | Which PID numbers and cgroup paths are actually comparable |
| Stable process identity | Init/reader PID in its declared view, raw stat start-time fields and capture ordering before/after; bind to the same full-ID before/after inspection | Exit, PID reuse or identity change during collection |
| Target membership | Target-local init membership, plus observer-visible target init/process membership in the shared target PID view | Correct target group and process-list interpretation |
| Observer separation | Observer-local membership and cgroup identity distinct from target and database; record namespace sharing separately | Observer may share target PID visibility while its memory remains outside target |
| Database membership | Database-local init membership and stable identity, collected by an invocation addressed to that exact full database container ID | Positive database membership within a view that can observe that database PID |
| Counter-path binding | Raw observer-visible candidate paths and mount context, independently bound to the role-local cgroup object; retain applicable filesystem/object identifiers and mapping evidence | Correct target/observer/database counter files rather than an assumed sibling path |
| Failure/persistence record | Reader origin, capture ID/sequence, raw bytes/errors, exit code, write/confirmation result and manifest hashes retained before cleanup | Distinguishes visibility, path, lifetime and collection/output failures |

All three role-local observations must say where they were read, not just what
numbers they contain. Collect only allowlisted identity/cgroup/mount fields,
not credentials, complete process environments or unrestricted host procfs.
NSpid column position alone does not establish host ancestry. No same-number
PID match across unrelated views is evidence. Do not replace absence with
wrong-group certainty, accept an arbitrary nonempty membership list, or infer
namespace ancestry solely from inode numbering.

For database membership, use the database-local PID and its local membership
file in the same proved view; record observer inability to see that PID as a
separate visibility result. This is a proposed composite proof, not permission
to silently set the old databasePidMembershipVerified boolean. A role-local
receipt must be anchored by an exact-ID invocation and stable before/after
inspection; an unbound self-report cannot certify the expected database.

Counter-path verification is independent of PID visibility. The current
container-ID replacement path may be retained as an untrusted candidate for
comparison, never promoted because the directory exists. Require a documented
mount/root translation or independently comparable cgroup-object identity
between the role-local group and observer-visible counter directory. Record
filesystem/mount context; equal path text or an unexplained inode/device pair
alone is insufficient. If the supported topology cannot establish that binding,
return UNKNOWN and stop; do not change namespaces, grant privilege, mount host
procfs or select a different group to obtain PASS.

#### P1: proposed bounded capture-only round, separately authorized

Use a new isolated external copy and proof root, for example
`C:/Users/nekot/Documents/Codex/2026-10-22/i6-observer-identity-capture`.
Retain the failed observer/run.py and both accepted offline tools byte-for-byte.
Proposed additions are a small role-local identity reader, host orchestration
for this capture only, pure receipt binding/validation and deterministic
fixtures. Do not replace the measurement observer or weaken its existing guard
as part of evidence collection. A diagnostic observer-context container may
hold the existing PID/cgroup placement while the allowlisted reader executes;
its receipt must say diagnostic capture, not successful measurement observer.

Proposed live cap: **one started preparation/capture scenario**, at most120
active seconds and2MiB new proof, including provisioning, role-local reads,
validation and owned cleanup. Reserve and confirm the fresh one-scenario
capture ledger before the first Docker call; keep the accepted fixed-seven
comparison budget helper unchanged. No uncounted preflight or retry. Record
both capture and cleanup errors; failed persistence permits zero Docker work.
This dedicated ledger is not a resumed comparison or a modified seven-arm cap.

Use the pinned image/database and original PID/cgroup/mount settings with a
new target at1073741824 bytes, no swap and2 CPUs. Observer and private database
remain separately accounted, with no host ports or unrelated resource access.
Record their actual limits; do not move caller/application work outside the
target. Start no Service or document workload, run no cache warmer/full inventory,
and collect no A/B arm. This is identity discovery, not a memory delta or cache
stability measurement. The original native lifecycle and application policy
are not changed.

Collection order is fixed: (1) inspect identities/configuration; (2) collect one
bounded snapshot from each of target, observer context and database; (3) confirm
stable identities and reader completion; (4) validate and persist raw/derived
receipts, with errors intact; (5) clean owned resources and verify ownership
boundaries. Per-role process identity must be bracketed inside its snapshot;
sequential role reads are not claimed to be simultaneous. No automatic
resnapshot after a race. Each short reader exits, stays in its role's accounting
and is included in the preparation history; no reader survives into any later
measurement. Confirm receipt persistence before cleanup when possible; a write
failure remains an explicit failure even if cleanup succeeds. Never prevent
necessary owned cleanup merely to retain a broken collector.

Stop before further work on any namespace/path/identity ambiguity, restart,
permission failure, unreadable counter, OOM, reader timeout, output/budget
failure or unknown ownership. Keep partial evidence and the charged attempt.
The capture checkpoint reports H-PID/H-PATH/H-LIFETIME as supported,
contradicted or unresolved for the captured attempt. It cannot retrospectively
confirm the old failure's mechanism. No observer-ready marker is written and
no comparison follows automatically, even if all capture bindings are complete.

#### P2: proposed offline validation for capture tooling

If tooling implementation is separately authorized, add eight fixed cases:
C01 complete anchored role receipts; C02 receipt bound to another full ID;
C03 restart between inspections; C04 database-local membership valid but
observer PID view non-comparable; C05 missing counter-path object/view binding;
C06 unexplained path-text/inode match across mount views; C07 role reader
permission/exit failure; C08 receipt persistence failure before external work.
C04 must retain both the local proof and visibility limitation, never change
the existing offline diagnosis to live-ready. C05/C06 must stop rather than
use container-ID replacement as proof. C08 permits zero fake external calls.

Proposed new offline budget: at most2 complete eight-case passes,16 named
executions,300 active-check seconds and2MiB proof; preserve RED then expected
outcomes, stop on PASS or exhaustion. Inject filesystem/Docker/write errors
with real process/procfs/cgroup access forbidden. Reuse the immutable prior
16/16 evidence; no extra reassurance run or alteration of that helper's contract.
These proposed cases and the one capture scenario are separate budgets and
both remain unexecuted/unallocated by the current request.

#### P3: observer acceptance contract, distinct from evidence completion

Complete identity capture is an input to an observer repair proposal. It does
not verify the existing observer or authorize a namespace switch. Before any
repair, choose an explicit proof contract from the captured supported topology.
For the current target-PID placement, the preferred proposed contract requires
all of: target process-view verification, observer memory-group separation,
anchored database-local membership, and independent observer database-counter
path verification. If any component cannot be proved, the outcome is UNKNOWN,
not a blanket exemption for an invisible database PID. Any replacement of the
old scalar success flag must name these checks and retain their evidence.

A future candidate observer can be accepted only within its stated coverage:

1. Source/receipt hashes identify the exact reviewed candidate; required raw
   identities persist before any ready marker, and failure to confirm output
   produces stop with no stale ready-marker reuse.
2. Target/observer/database bindings meet P0 and remain distinct and stable.
   Target memory.max=1073741824 and memory.swap.max=0 are read from the bound
   group; inspected configuration alone is not the measured proof. Same image,
   2 CPUs and placement remain fixed; no privilege or budget relaxation.
3. The real candidate reads all required counters from the proved paths and
   at least five subsequent1Hz samples survive with valid timestamps, no OOM
   and complete required fields. Observer/database overhead is recorded
   separately. Process data is labelled with its actual PID view; unavailable
   cross-view RSS/PSS is explicit, never fabricated or added to group totals.
4. Identity is rechecked at the sampling boundary, role-local capture readers
   are gone, target init-only topology is confirmed and no unexpected child/job
   exists. Read/permission/identity/output failures in offline fault checks
   stop safely rather than continue using a previously valid path or marker.
5. Saved-proof review covers results and missing evidence; owned cleanup and
   unchanged product/B1+C/PDF hashes are documented. Clean cleanup cannot
   overwrite an observer sampling failure as PASS.

A five-sample idle pass supports only placement/counter/idle-sampling coverage;
Service-ready process attribution, matched loaded phases and cache matching
remain separate comparison prerequisites. Initial observer verification can be
included in a later explicitly authorized fresh7-scenario comparison's counted
preparation, rather than an uncounted pilot. Failure stops that charged round.
No such observer candidate or live verification is created by this plan.
After a future observer passes, both fresh cache checks and all original
A–B–B–A controls still apply. Do not inherit old cache state or infer worker
admission/document generation/F2/I6 acceptance from observer readiness.

Both historical failed live preparations remain charged1 each. A later
capture-only attempt would add its own charge; it does not consume or unlock
the previous unused6, and cannot be reused as a comparison's preparation.
Any subsequent complete comparison still needs separately authorized fresh7.
B2, full suite, product repair, merge, release and push remain outside scope.

Planning verification: accepted offline manifest
`d597300be0e41428db465b376d2bc6d5f31f2f911f3b793764fac0a09a0f0d40`,
its16 proof files,3 helpers and16 fixtures are unchanged; all five earlier
manifest chains and the observer source are reverified. Preservation still
covers408 prior source/evidence files,358 F2 inputs,28-file earlier proof/runner,
18-file cache proof with6 helpers, clean B1+C and unchanged primary Service.
PDF baselines are preserved. This turn changes only this existing Project
Control plan. No proposed test, collector, directory or live run is created.
Project Control `tools/check.ts` and `git diff --check` pass.

### I6 identity capture tool offline result 2026-10-22

**PASS for the bounded offline capture-tool checkpoint only.** The owner's
latest instruction authorizes the new capture tooling and eight P2 fixtures
within two complete passes, followed by this result. All8 expected outcomes
pass on pass2/2; the16-execution budget is exhausted and testing stops. No
observer/product repair, Docker command, live procfs/cgroup read, live capture,
cache/A–B–B–A, B2 or integration is performed. Exact1GiB/no swap, B1+C and
original PDFs remain fixed. F2/I6 remain NOT ACCEPTED; historical failure cause
and harness/Service memory attribution remain UNKNOWN.

Authority: external-tool implementation and Evidence review, single room;
Project Control owns this checkpoint, Service owns the untouched candidate.
Execution IDs N/A; Work Size small, Risk Tier routine. Current host model/
capability availability used inline without override. Document Budget is this
existing canonical record; no new Work, Phase, map or shared report. Proof
Budget2 complete passes,16 named executions,300 active-check seconds,2MiB proof.
The separate proposed one-scenario live budget remains unauthorized and unused.

New external root:
`C:/Users/nekot/Documents/Codex/2026-10-22/i6-observer-identity-capture`.
New tools are an allowlisted role-local reader (`identity_reader.py`), pure
composite receipt binder (`receipt_binding.py`), one-attempt coordinator and
confirmed atomic receipt store (`capture.py`), explicit synthetic IO/test suite
and bounded offline runner. Dormant `docker_capture.py` and `shell_reader.py`
provide the separate future capture adapter/role-local shell transport; neither
is executed or runtime-verified here. The shell transport avoids requiring a
new Python installation in the pinned database image and labels each reader's
own PID rather than a transient utility PID. Its actual utilities/permissions,
framing and Docker lifecycle remain unverified runtime prerequisites.

The coordinator reserves/confirms a fresh cap1/used1 capture ledger before
calling any adapter, persists before/after identity and raw receipts, records
partial errors, and performs only owned cleanup. Confirmed output uses the
same encoded bytes for2MiB accounting and binary atomic replacement/readback;
no power-loss/crash-durability claim is made. The dormant adapter requires
explicit --live plus separate owner authorization, fresh proof, frozen image
receipts and accepted network parser bytes. It reserves60 seconds of the
proposed120-second ceiling for bounded cleanup, uses per-attempt ownership
labels and removes only IDs whose label is confirmed. No --live invocation,
live-proof/live-scratch directory or ready marker exists from this checkpoint.

| Offline evidence | Result |
| --- | --- |
| Pass1 retained RED | 8 executed:0 pass,6 fail,2 error |
| Pass2 new tooling | 8 executed:8 pass,0 fail,0 error |
| Budget | 2/2 passes;16/16 named executions |
| Active fixture checks | 0.219 seconds /300 seconds |
| Saved proof | 368,134 bytes /2MiB;18 files including manifest |
| Fixed fixtures | 8 JSON inputs, hashes unchanged |
| Forbidden real operations attempted in suite | 0 |
| Live capture / Docker / observer or product edits | 0/0/0 |

C01 exercises shared role-reader interpretation through the coordinator and
synthetic IO, anchored receipts, raw target/observer PID-view and init-membership
proof, confirmed charge and cleanup. C02/C03 reject wrong-ID/restarted bindings.
C04 retains valid database-local membership while labelling the observer PID
view NAMESPACE_NOT_COMPARABLE; EVIDENCE_COMPLETE does not assert comparable
host PIDs or observer acceptance. C05 rejects missing counter binding; C06
rejects unexplained cross-view path/object matches. C07 retains the injected
PermissionError/nonzero reader result and stops without retry. C08 rejects
unconfirmed reservation with zero fake external calls. Every result retains
observerVerified=false and liveReady=false; no old scalar observer success
flag is synthesized. Expected/actual results, raw inputs and fake-call order
are in `proof/pass-2-diagnoses.json`.

RED is the unimplemented new-tool scaffold, not eight alleged product defects.
Its source/tests/runner are retained. Before GREEN, static review found and
confirmed fixes for output-size accounting, missing raw shared-PID/init proof,
and uncertain-create cleanup ownership. C01's existing assertion was
strengthened, and filesystem guards extended, without adding cases, changing
fixtures or executing hidden negative scenarios. The same reviewer confirmed
those findings resolved by source inspection only; no imports/execution/tests
were performed by the reviewer. These guard/cleanup refinements do not create
additional dynamic fault coverage beyond the eight named cases.

The binder deliberately supports only a strict matching cgroup namespace and
mount context plus anchored full container ID and counter-object evidence.
It does not accept inode/device or equal path text alone. Unsupported private/
cross-view layouts remain UNKNOWN; actual placement may therefore still stop.
The old offline diagnosis16/16 helper and its supplied-host-view model are
unchanged and not coerced into a new proof contract. This fixture checkpoint
covers the shared reader/binder/coordinator with fake adapters; it does not
prove dormant shell/Docker behavior, actual permissions/mount support,
AtomicStore crash behavior or a future observer's five live samples. No
historical missing PID/namespace/cgroup values are manufactured.

Durable manifest: `proof/manifest.json`, SHA-256
`8746db0df258fec4d9fd657e5a267ca8d0deb4e01ff480a3a642cd46d34126c6`.
It binds8 helper files,8 fixtures and17 proof files, including RED/GREEN logs,
per-case receipts, ledger, frozen inputs, design rulings, review and before/
after preservation. All helper SHA-256 values are recorded in the manifest;
principal sources are capture.py
`7c4def670093ca29aa86db80796306baff05cfb797882365b1c11e03836c4ead`,
identity_reader.py
`30755cd8616645c5f506fb21a9a12a6ee409adbef3a5638d435dcb624d018360`
and receipt_binding.py
`4d94776a93e7515f2817289472c5d520f7e8f2e41b9f1ff0478d30d6ade6b4fc`.

Final preservation agrees with initial checks: prior offline16 proof files,
3 helpers and16 fixtures, latest15 live raw/supplemental records and16 helpers,
all five older manifest references and prelaunch digest,408 prior source/
evidence files,358 F2 inputs,28-file earlier proof/runner and18-file cache proof
with6 helpers remain unchanged. The original observer hash is unchanged.
B1+C stays clean at `b79f426649e65eadb3fb29e410250395a6d65faa`; primary Service
status and original PDF baseline evidence are unchanged. Both historical live
preparations remain charged1 each; this offline round adds no live attempt.
No Word export or reviewed page is allocated.

Next boundary is review of the offline result and remaining runtime/binding
prerequisites before separately authorizing any one-shot capture-only attempt.
Do not automatically enable the dormant adapter, switch namespace placement,
relax identity proof or continue to A–B–B–A. Observer repair/acceptance, product
changes, full suite, B2, merge/release/push remain outside this checkpoint.
Repository impact is only this existing Project Control result document;
`tools/check.ts` and `git diff --check` pass. No runtime/package/map changes.

### I6 one shot identity capture result 2026-10-22

**STOP_IDENTITY_BINDING_UNKNOWN.** The owner authorized exactly one capture-only
attempt within120 seconds, retaining exact1GiB, B1+C and original PDFs, and
stopping if evidence was insufficient. The attempt finishes in18.375 seconds
with raw status UNKNOWN and a cap1/used1 STOP ledger. All three role-local
readers exit0 and retain raw identity/cgroup/mount/counter observations.
The current strict binder cannot certify the counter paths across different
cgroup namespaces, so capture does not establish observer acceptance. No code
repair, retry, Service/document workload, cache/A–B–B–A, full suite, B2 or
integration is performed. F2/I6 remain NOT ACCEPTED; memory attribution UNKNOWN.

Authority: single-room discovery; Evidence Reviewer / Documentation Synthesizer.
Project Control owns this checkpoint; Service owns the unchanged candidate.
Work/Phase/Checklist IDs N/A, Work Size small, Risk Tier routine. Current host
model/capability used inline without override or product dispatch. Proof cap1
live capture,120 active seconds and2MiB output; Document Budget this existing
canonical result only. No new Work/map/shared report. Both prior live failed
preparations remain charged1 each; this distinct capture adds1, making three
charged live attempts across those rounds, with no reset/refund/resume.

Execution uses the immutable eight helpers from the accepted offline manifest
`8746db0df258fec4d9fd657e5a267ca8d0deb4e01ff480a3a642cd46d34126c6`
in `C:/Users/nekot/Documents/Codex/2026-10-22/i6-observer-identity-capture`.
`live-prelaunch.json` freezes the current owner authority, helper hashes,
budget and preservation state. The ledger is confirmed before the first
Docker command. No implementation/fixture change or additional test pass is
made. The shared reader, dormant adapter and shell transport now have this
one observed runtime execution; that does not establish general runtime
compatibility or expand the earlier eight-case fault coverage.

Before/after exact-ID inspection is identical, with no observed restart.
All three raw readers have exitCode0, no reader/counter errors and stable
captured process identities. Target/observer share the observed PID namespace;
observer-visible target init identity/membership matches the target receipt.
Target's inspected Memory=MemorySwap=1073741824 and2 CPUs agree with its
local memory.max=1073741824 and memory.swap.max=0; the observer's own group
has the same measured limits. Database limits are independently recorded as
max/max outside the target; its footprint is not subtracted from target charge.
All captured own-group OOM/oom_kill counts are0. These are bounded sequential
identity observations, not five1Hz observer acceptance samples or a matched
memory comparison.

| Role | Docker host PID | Local/shared PID namespace | Cgroup namespace | Local group view |
| --- | --- | --- | --- | --- |
| Target | 1000 | pid:[4026532422] | cgroup:[4026532423] | / |
| Database | 1059 | pid:[4026532498] | cgroup:[4026532499] | / |
| Observer | 1149 | pid:[4026532422] | cgroup:[4026531835] | /docker/25d199f033fcaad1e4a34c50a20967b87e4c2f0f02830c20722d3782a3687aec |

Each local membership check is true in its reader's declared view. The target
and database init PID is1 locally; observer's role-local reader PID is40 in
the shared target PID view. The observer's candidate database membership read
contains nine0 entries, not host PID1059 or the database-local PID1. This new
capture supports H-PID's non-comparable-view explanation for this topology;
it does not retrospectively prove the historical failed run's mechanism.
H-LIFETIME has no observed restart/start-identity drift in this new bounded
capture, but is not historically excluded.

The target and database local paths appear as / in their private cgroup
namespaces; observer paths include full Docker IDs in the host cgroup view.
The observed cgroup2 mount metadata is device0:23, root /, mount /sys/fs/cgroup.
Local and observer-view object observations match device/fsid/inode per role:
target inode429, database497, observer565, fsid87fb5972662524a3. These raw
matches are retained as evidence, not elevated into an unreviewed cross-view
proof rule. Different cgroup namespace identifiers remain outside the accepted
strict same-view profile. Both counterBindings are false with exact reasons
`target unsupported cross-view counter binding` and
`database unsupported cross-view counter binding`. A wrong path is not proved;
accepted cross-view path identity remains unresolved. The old scalar observer
success flag is not set; observerVerified/liveReady remain false.

Raw files are under `live-proof/`: three role receipts, before/after inspections,
ledger, pre-cleanup diagnosis and final result. Manifest SHA-256:
`9372a5e3e1ca6013ec1110e5441bc3a5429c1ca75ca657cb46effc43cf7ecf12`.
It binds eight as-run files and all8 unchanged helper hashes, with prelaunch
and offline-source manifest digests. Saved-proof diagnosis and verification
are separately bound by `live-postrun/manifest.json`, SHA-256
`48a29a132b8455462e0253dc38942f32417657437737f3e4a0a3bc9a02be6255`.
New capture/prelaunch/supplemental/scratch output totals215,497 bytes, below2MiB.
No raw observation, ledger, old helper or historical result is overwritten.

Owned cleanup confirms no remaining capture containers and the labelled owned
network removed/absent, with no cleanup errors. The saved receipt/source path
shows label-confirmed exact-ID cleanup. Verification uses saved files only,
with no additional Docker status/capture or fixture run after the attempt.
Readiness, cache stability and admission are not inferred from successful
reader exit or clean resource removal.

Before/after preservation matches:408 prior source/evidence files,358 F2 inputs,
28-file earlier proof/runner and18-file cache proof with6 helpers remain intact.
Accepted eight-case tooling/fixtures/proof, earlier16-case diagnosis proof,
all five older manifest chains and original observer bytes are unchanged.
B1+C stays clean at `b79f426649e65eadb3fb29e410250395a6d65faa`; primary Service
status and original PDF baseline evidence remain unchanged. No Word export,
reviewed page, Service request or document task is allocated.

The authorized one-shot capture is consumed and stopped. Recommended next
work is a proposal for a supported cross-view counter identity contract using
these saved raw bindings, before any validator/observer repair or additional
live capture/comparison. Do not relax the namespace check merely because
object tuples match. Observer acceptance still needs the P3 contract and
real sampling evidence; it is not granted by collecting these receipts.
No further live budget, A–B–B–A, full suite, B2, product change or merge is
authorized by this result. Only this existing Project Control document changes;
`tools/check.ts` and `git diff --check` pass, with no runtime/package/map edit.

### I6 saved evidence cross view counter binding plan 2026-10-22

**PROPOSED / NOT EXECUTED.** The owner requests a counter-binding plan based on
saved capture evidence first. This turn reads retained raw/source files and
primary Linux documentation and changes only this canonical plan. No validator,
reader, observer, fixture, product or runtime code changes; no fixture cases,
Docker (including status/inspect), live procfs/cgroup, capture, A–B–B–A or full
suite run. Exact1GiB/no swap, B1+C, original PDF baselines and historical
ledgers remain unchanged. F2/I6 are NOT ACCEPTED; memory attribution UNKNOWN.

Owner: Project Control for the shared proof contract, Service for the untouched
candidate. Role: Planning Partner / Evidence Reviewer / Documentation
Synthesizer. Single-room planning; execution IDs N/A. Work Size small, Risk
Tier routine. Document Budget this existing record only, no new Work/map or
shared report. Reuse current P0–P3, immutable offline16/16 and8/8 evidence,
and the consumed1/1 live capture. Later implementation resolves its own compact
model/host availability decision. The blocking issue is an unsupported binding
profile, not an observed mismatch of the captured object identities.

#### X0: retained evidence and semantic basis

Freeze the eight as-run files under `i6-observer-identity-capture/live-proof`
with manifest SHA-256
`9372a5e3e1ca6013ec1110e5441bc3a5429c1ca75ca657cb46effc43cf7ecf12`,
the prelaunch/source hashes and supplemental manifest
`48a29a132b8455462e0253dc38942f32417657437737f3e4a0a3bc9a02be6255`.
Raw role receipts, shell frames, full mountinfo, before/after IDs, local PID
membership and stat start brackets already exist. No fresh capture is proposed
as a prerequisite for this bounded offline object/route adjudication.

| Role | Private-view directory | Observer-view directory | Shared captured object data |
| --- | --- | --- | --- |
| Target | /sys/fs/cgroup | /sys/fs/cgroup/docker/95e3c0b2e4ad0f5c2548a751673488e10d179241d6872e624f346a7a0548bfb1 | device0:23, inode429, fsid87fb5972662524a3 |
| Database | /sys/fs/cgroup | /sys/fs/cgroup/docker/234b671ec4a06db2bb83d19c538ba8bbed69f60aa9bc8936fa5af66accbf03c2 | device0:23, inode497, same fsid |

All three relevant raw mountinfo records identify cgroup2, device0:23, root /,
mountpoint /sys/fs/cgroup. Their mount IDs463/540/631 are recorded per view,
not expected to be globally equal. Inspection identities are stable and every
role receipt is tied to its exact invoked full ID and capture ID. The prior
source review shows the current binder rejects different cgroup namespaces
before evaluating these object matches; do not simply remove that condition.

Primary references:
[Linux cgroup v2 namespace semantics](https://www.kernel.org/doc/html/latest/admin-guide/cgroup-v2.html#namespace)
explains that cgroup namespaces alter membership/mount views; a private root
can show / while another view shows the original hierarchy path.
[inode identity](https://www.man7.org/linux/man-pages/man7/inode.7.html)
limits inode-number uniqueness to its filesystem, requiring filesystem/device
context when comparing observations.
[mountinfo](https://www.man7.org/linux/man-pages/man5/proc_pid_mountinfo.5.html)
identifies per-reader mount roots, filesystem types/devices and stacked mounts.
These support the proposed explicit cross-view profile; namespace inequality
alone is not an object mismatch, and equal numeric inode alone is not proof.
The sources do not certify this experiment or its runtime continuity.

#### X1: proposed capture-cross-view-object-v1 contract

Propose a separate pure verifier that consumes only hash-bound saved receipts.
It must independently recompute its decisions from raw frames/mountinfo and
anchored metadata, not trust the old derived booleans or a hand-authored map.
For each target/database pair require every condition below:

1. **One trusted capture provenance:** all raw/derived inputs resolve to the
   frozen manifest, one capture ID, known reader/source bytes and the same
   recorded Docker invocation route. Full IDs, image bindings and before/after
   running/restart/StartedAt/PID metadata match. Reject mixed-session replays;
   device/inode/fsid values are not cross-host/boot/session persistent IDs.
2. **Role anchor:** the local reader was invoked against that exact full ID;
   its local membership and init/reader PID+start identity are intact. Preserve
   the raw private-cgroup-root view. The observer candidate contains the exact
   corresponding full ID as a supported path component; ID replacement only
   proposes a candidate and cannot authorize it. No substring or numeric-PID
   collision can establish identity.
3. **Filesystem/mount context:** parse the complete mountinfo for each reader,
   including root/point/device/type and stacked or nested mounts. Resolve only
   canonical allowlisted paths under the effective cgroup2 mount. Correlate
   raw stat device to mount major:minor; require matching cgroup2 filesystem
   context and consistent fsid. Mount IDs are interpreted locally, not compared
   as shared object IDs. Missing/ambiguous/escaped unsupported layouts stop.
4. **Directory object identity:** require matching nonempty device/inode/fsid
   for the role-local directory and independently anchored observer directory,
   after the provenance/mount checks. Neither path-text equality, directory
   existence nor object tuples stripped of context are sufficient. Record the
   differing cgroup namespaces and the specific cross-view profile used.
5. **Counter route:** bind the actual captured reads to that matched parent
   plus the fixed allowed child names: memory.max, memory.swap.max,
   memory.current, memory.events and cgroup.procs. Use the source-bound shell
   frame keys/read results and full mountinfo to exclude a mount that hides
   the parent or any selected child. Do not compare changing counter values
   for equality across sequential reads as an identity test. Require successful
   reads and keep errors visible. Target's inspected and captured limits remain
   exactly1073741824/0 with2 CPUs; preserve OOM/error checks and separate roles.
6. **Bounded time claim:** stable process/container brackets and known capture
   order support this18.375-second saved observation only. The artifact does
   not hold directory/file descriptors, stat each counter leaf, or bracket
   mount/group-object identity continuously. Do not claim atomic reads,
   absence of every possible migration/remount/inode-reuse race, or live
   continuity after cleanup. If a requested claim needs those missing facts,
   return UNKNOWN rather than infer them from a stable process PID.

The proposed result has separate object-match and counter-route decisions with
reasons/source locators. `CAPTURED_GROUP_OBJECT_MATCH` is scoped to directory
observations; `CAPTURED_COUNTER_ROUTE_SUPPORTED` is scoped to the recorded
fixed-child routes with the stated temporal limits. Contradictory identities
return BINDING_MISMATCH; absent/ambiguous evidence returns UNKNOWN. Each role
is adjudicated independently; one match cannot promote the other role.
All outcomes retain observerVerified=false and liveReady=false.

Target process-view proof, observer memory-group separation, database-local
membership and cross-view counter-object proof remain distinct. Database PID
visibility stays NAMESPACE_NOT_COMPARABLE where observed; a successful counter
route must not invent host PID membership from the recorded zero entries.
The original capture result remains UNKNOWN as run. A later reviewed derived
adjudication records its new profile/version and input hashes separately,
without editing raw ledgers, old booleans, historical acceptance or product maps.

#### X2: bounded offline implementation proposal and twelve named cases

If separately authorized, create a fresh external directory such as
`C:/Users/nekot/Documents/Codex/2026-10-22/i6-counter-crossview-offline`.
Proposed new files are `crossview_binding.py`, a saved-input loader, twelve
fixed cases and a bounded runner/proof manifest. Preserve all old helper
bytes; do not modify receipt_binding.py or the observer to obtain PASS.
Use the existing raw capture as immutable test input; only fault fixtures
may contain synthetic changes, explicitly labelled and separately hashed.

| ID | One fixed input/fault | Expected outcome |
| --- | --- | --- |
| X01 | Hash-bound saved target pair with complete role/mount/object/route evidence | Proposed captured object/route support within X1 limits, no live readiness |
| X02 | Hash-bound saved database pair with local membership and non-comparable observer PID view | Same bounded object/route support while retaining PID visibility limitation |
| X03 | Synthetic valid binding with a different cgroup namespace ID and intact independent anchors | Namespace inequality alone does not reject the object |
| X04 | Observer-side device differs from local anchored filesystem | BINDING_MISMATCH |
| X05 | Observer-side inode differs within the same established filesystem | BINDING_MISMATCH |
| X06 | Nonempty fsid conflicts across the two anchored observations | BINDING_MISMATCH |
| X07 | Object numbers present but raw mountinfo missing | UNKNOWN; no inode-only shortcut |
| X08 | Observer path contains a similar ID substring rather than the exact role ID component | BINDING_MISMATCH |
| X09 | Raw mountinfo has an overmount hiding a selected counter leaf | UNKNOWN; parent identity alone cannot authorize that read route |
| X10 | Recorded role restart/StartedAt changes across inspections | BINDING_MISMATCH |
| X11 | A captured role reader/frame records a read error | UNKNOWN, retaining the original error |
| X12 | Matching object numbers are supplied from another capture ID/session | Reject provenance; no cross-session object inference |

X01/X02 are the actual saved-input checks, included in the twelve-case budget,
not extra uncounted replays. They are proposed expectations: if raw parsing
reveals a missing prerequisite, preserve the discrepancy and report UNKNOWN;
never fabricate a field or weaken X1 to satisfy the expected support. Keep
initial RED behavior/contract failures and the final source/fixture identity.
No hidden parameterized cases, live pilots or reruns of the accepted older
8/16-case suites. Proposed ceiling2 complete passes,24 named executions,
300 active-check seconds and2MiB proof; collection failure consumes a pass,
stop on all expected outcomes or exhaustion. Prohibit real process/procfs/
cgroup operations. Current request authorizes no implementation/test pass.

#### X3: acceptance and future boundary

The offline checkpoint is a reviewed derived evidence decision with exact
coverage, all twelve expected outcomes, bounded accounting and immutable old
hashes. It does not make the original binder pass or accept a running observer.
No new Docker/capture budget is requested to reach that offline checkpoint.

Any later observer/validator implementation must receive separate scope and
carry the selected composite contract into a new isolated candidate. Live
observer acceptance still requires P3's actual bound-path sampling, error
handling, process placement and cleanup coverage. Identity must remain valid
at that sampling boundary; snapshot-only support cannot replace continuous
runtime evidence. No namespace/privilege switch, cgroup write/migration,
memory-policy relaxation or extra cache warmer is proposed. A later complete
comparison still needs separately authorized fresh7 and both cache checks.
All three historical charged live attempts remain charged; no resume/refund.
B2, full suite, product changes, merge, release and push stay out of scope.

Planning checks confirm the current offline/live/supplemental manifests,
all old helper/fixture chains and original observer source unchanged, with408
prior source/evidence files,358 F2 inputs,28-file earlier proof/runner,
18-file cache proof with6 helpers, clean B1+C and unchanged primary Service.
Original PDF baseline evidence remains preserved. No Docker/status command,
fixture case, proposed directory or code change is made. Only this existing
Project Control plan changes; `tools/check.ts` and `git diff --check` pass.

### I6 saved evidence cross view verifier result 2026-10-22

**PASS for the bounded offline verifier and derived saved-evidence decisions.**
The owner authorized X0–X3 implementation from the old capture and twelve
cases within two passes, followed by this checkpoint. All12 expected outcomes
pass on pass2/2,24 named executions total. Both actual retained role pairs
support CAPTURED_GROUP_OBJECT_MATCH and CAPTURED_COUNTER_ROUTE_SUPPORTED within
the new saved-observation profile. This is not a running observer acceptance
or continuous sampling result. The original as-run capture UNKNOWN, old
counterBindings=false and every original ledger remain unchanged. F2/I6 are
NOT ACCEPTED; harness/Service memory attribution remains UNKNOWN.

Authority: single-room external-tool implementation and Evidence review;
Project Control owns this result, Service owns the untouched candidate.
Execution IDs N/A; Work Size small, Risk Tier routine. Current host model/
capability used inline without override. Proof Budget2 complete passes,
24 named executions,300 active-check seconds,2MiB proof. Document Budget this
existing canonical result only; no new Work, Phase, map or shared report.
No observer/product/old-validator modification, Docker/status command, live
procfs/cgroup, capture, A–B–B–A/full suite, B2 or integration is performed.
Exact1GiB/no swap, B1+C and original PDFs are preserved.

New external root:
`C:/Users/nekot/Documents/Codex/2026-10-22/i6-counter-crossview-offline`.
New files are `crossview_binding.py`, `saved_input_loader.py`, twelve-case
tests and bounded runner. Twenty-one byte-identical input copies retain the
as-run capture/manifest, prelaunch, accepted helper bytes and image-source
receipt/manifest; they are hashed, never executed. Twelve fixed case specs
include two retained-pair checks and ten explicitly labelled synthetic faults.
The old receipt_binding.py and both prior offline tool suites remain intact.

The loader verifies the frozen capture manifest
`9372a5e3e1ca6013ec1110e5441bc3a5429c1ca75ca657cb46effc43cf7ecf12`,
raw-file/source/prelaunch/image hashes and sealed retained payload identity.
The new pure verifier independently parses raw shell frames, status/stat,
namespace labels and full mountinfo. It composes exact-ID invocation and
before/after lifetime anchors, local memberships, filesystem/device/fsid/inode,
selected-leaf effective mounts, counter-read success and1GiB/OOM checks.
It does not take the prior binder's booleans as proof, force namespaces equal,
use inode alone or use changing counter-value equality to establish identity.

| Offline proof | Result |
| --- | --- |
| Pass1 retained strict-policy RED adapter | 12 executed,0 pass,12 fail,0 error |
| Pass2 new profile | 12 executed,12 pass,0 fail,0 error |
| Charged proof budget | 2/2 passes,24/24 named executions |
| Active fixture checks | 0.485 seconds /300 seconds |
| Saved proof | 95,178 bytes /2MiB;20 files including manifest |
| Entire new root including input/source copies | 387,177 bytes |
| Forbidden real process/procfs/cgroup attempts in suite | 0 |
| New live attempts / observer/product changes | 0/0 |

X01/X02 adjudicate the hash-bound saved target/database pairs within the named
case count; no uncounted retained-pair replay follows. Both find matched
objects and supported recorded counter routes. Target object is device0:23,
inode429; database is device0:23,inode497; both have recorded
fsid87fb5972662524a3, corroborated by independent role/mount/provenance anchors.
Different cgroup namespace labels are retained. The database PID view remains
NAMESPACE_NOT_COMPARABLE: its observer-side zero PID entries are not transformed
into host/database PID membership. Exact target1073741824/0 and2 CPUs are
rechecked from captured metadata/raw counters, not a fresh live measurement.

X03's labelled namespace variant also supports the bounded route. X04–X06
reject device/inode/fsid conflicts; X08 rejects an ID substring path; X10
rejects restart metadata. X07/X09/X11 return UNKNOWN for missing mountinfo,
a selected-leaf overmount or a recorded read error. X12 rejects mixed-session
provenance. Overall:3 route-supported cases (two retained,one synthetic),
5 BINDING_MISMATCH,3 UNKNOWN and1 PROVENANCE_REJECTED. Passing refusal tests
mean the verifier stops correctly, not that faulty inputs become acceptable.

The new profile supports only the observed flat Docker/private-local-root
layout with complete canonical mount/object context. Object and counter-route
decisions are separate: the leaf-overmount fault retains a directory match
but refuses its route. All outcomes retain observerVerified=false and
liveReady=false. Results cover the original18.375-second sequential capture,
not atomic/continuous directory or mount identity, counter-leaf stat identity,
new-host/session persistent IDs, or present runtime state after cleanup.
If a claim needs those missing facts, the saved proof cannot supply them.

RED is an adapter of the old strict rejection and missing proposed result
contract, not twelve new product failures. RED source/tests/results remain
preserved. Static review identified mixed-up capture/source hash labels and
missing shared own-group OOM prerequisites; both were corrected before GREEN,
with existing provenance assertions corrected/strengthened, not relaxed.
The same reviewer confirmed resolution without import, test/verifier execution,
Docker, edits or live access. No additional cases or old8/16-case suite reruns.

Derived outcomes are retained separately in `proof/captured-adjudication.json`
from the already-counted GREEN diagnoses. They do not rewrite the original
UNKNOWN receipt or success flags. New proof manifest SHA-256:
`95caedcfcc5d56bd78b06d83b238948ad489f41acb623c03061606e0bf3b7aa7`.
It binds4 helpers,12 case specs,21 frozen inputs and19 proof files, including
RED/GREEN logs, per-case decisions, ledger, input/case manifests, review,
rulings, derived adjudication and preservation. Principal source hashes:

| Helper | SHA-256 |
| --- | --- |
| crossview_binding.py | `129aa5e3fbf823bd7a0880575faea539b9972ffde6cabfde5f5895135c67df77` |
| saved_input_loader.py | `690797fe93ffd21c18044a14a514db003f21a9907d3777e3be084952ac94c971` |
| test_crossview.py | `b591f6f4d644b1550c3a70e3fed27118b447fe7b6d66133e4cce2b58a9a4dbbf` |
| offline_checks.py | `2da95925d16e42c3778cf368d395eb0ec00a827adab38e9d5313a8288ded8119` |

Before/after preservation agrees: current capture raw/supplemental manifests,
all original capture helpers/fixtures/offline proof, earlier16-case diagnosis
and five older manifest/helper chains remain unchanged. This includes408
prior source/evidence files,358 F2 inputs,28-file earlier proof/runner and18-file
cache proof with6 helpers. Original observer bytes are unchanged; B1+C remains
clean at `b79f426649e65eadb3fb29e410250395a6d65faa`; primary Service status and
PDF baseline evidence remain unchanged. No Word export/reviewed page allocated.
All three historical live attempts stay charged, with no new live budget used.

The authorized offline checkpoint is complete and its two-pass budget exhausted.
Next work is review/scoping of any observer/validator integration of this profile,
followed only if authorized by P3's live sampling prerequisites. No old guard is
silently removed, no namespace/privilege/memory change is made, and captured
route support does not authorize Docker, another capture, A–B–B–A, full suite,
B2 or merge/release/push. Only this existing Project Control result document
changes; `tools/check.ts` and `git diff --check` pass. No runtime/package/map edit.

### I6 Plan1 observer and readiness comparison result 2026-10-22

**BLOCKER at A1 startup; Plan1 comparison is not complete.** The owner authorized
external-tool repair, current observer acceptance and fresh A–B–B–A within seven
live scenarios, stopping on the first blocker. Preparation and both cache
verifications PASS; A1 is charged and STOP. B1, B2-arm and A2 never execute.
Actual live budget4/7,62.703 seconds; no retry or use of the remaining three.
Observer acceptance is supported for this current bounded run; memory attribution
between the test harness and loaded Service remains UNKNOWN. F2/I6 are NOT ACCEPTED.

Authority: single-room external proof-tool implementation and Evidence review;
Project Control owns the shared checkpoint, Service owns the untouched candidate.
Execution IDs N/A, small/routine work; current host model/capability without an
override or product dispatch. Document Budget this existing canonical document
only. The loaded generated cockpit is an older overview; the explicit owner
request and this current DOCX/I6 record govern the narrow execution. No old room,
execution context or historical ledger is resumed. Original three charged live
attempts remain charged separately from this fresh4/7.

New external root:
`C:/Users/nekot/Documents/Codex/2026-10-22/i6-plan1-observer-memory`.
Only copied/new proof tools change: current-round binder, observer, launcher,
preservation checker and synthetic checks. Original helpers/validators and every
old capture/verdict remain intact. The current binder reuses the accepted raw
mount/object parsing in a separately named current-preparation profile; it does
not relabel old saved observations as current success. Exact role IDs, images,
before/after lifetime metadata, namespace/mount context, local membership and
cross-view device/inode/fsid bind this round. Database host PID membership is
explicitly not claimed across its noncomparable PID namespace.

The new observer holds21 counter descriptors across three distinct group objects.
Directory and leaf FD/path identities and effective mounts are checked at opening
and around each read. It checks current source hashes, sampler placement, target
init lifetime, exact target1073741824-byte/no-swap counters, and all three roles'
OOM counters. Actual target/observer metadata remains1GiB/no-swap/2CPUs; DB stays
outside the measured target. Five real post-ready samples pass before cache work.
The retained37 actual samples span36.049 seconds with valid bindings and no OOM;
sampler stop is exit0/error null. This is bounded continuous evidence for the
observed run, not an atomic kernel snapshot, new-host guarantee or loaded-Service
acceptance. No privilege/namespace or memory-policy relaxation is made.

| Live phase | Result |
| --- | --- |
| Preparation: empty private DB migrations, current binding, observer, initial cache | PASS;1 charged |
| Cache verification1 | PASS;1 charged |
| Cache verification2 | PASS;1 charged |
| A1: Vitest launcher | STOP before runner-only marker;1 charged |
| B1, B2 repetition arm, A2 | NOT RUN;0 charged |

The initial cache inventory and two verification windows retain identical file
charge243.84375MiB. Across all accepted idle windows including A1's pre-launch
boundary, spreads are file0,anon0,kernel0.015625,total1.1171875MiB, within the
unchanged8/4/4/12MiB limits. Pre-cache observer-validation samples are retained
but not mixed into warmed idle spreads. No loaded matched-phase window exists.
Separate observed observer memory.current is18.828125–20.19921875MiB and DB is
210.703125–214.40625MiB; these unpaired ranges do not establish harness overhead
or Service headroom. Four private databases were empty at their checked
boundaries; no Service launch or document request occurs.

The concrete blocker is saved in `proof/a1-launcher.log`: Vite/Vitest's default
bundled config loader attempts a timestamped `.mjs` beside
`/tools/vitest.config.mjs`; `/tools` is intentionally read-only, producing EROFS.
This happens before the runner-only marker and before native Service launch.
It is an external config-loading/startup failure, not a measured memory failure
or evidence of a product regression. The owner-directed stop is honored; no
live repair/retry follows. A next bounded remedy would address only external
config loading while preserving immutable tools/candidate inputs and1GiB.
The comparison remains pending; Plan2 and pagination rule B2 are not entered.

Offline validation is reported without hiding a planning deviation. Eight fixed
cases run twice: pass1 has2 PASS/6 FAIL against the initial adapter; pass2 has
7 PASS/1 ERROR. The error is a Windows mock reaching Linux-only `os.major`, not
a live observer failure. Repair only that mock and execute its single case once:
PASS. Final coverage reuses the other seven unchanged passing cases; there is no
claim of an all-green complete second pass. Actual named offline executions17,
one above the self-planned16, explicitly recorded before the targeted retry;
the owner's seven-live-scenario limit is unchanged. No old8/12/16-case suite is
replayed. One fresh static whole-change reviewer identified a held-FD coverage
gap; the fixed case keeps group/leaf paths stable and changes only the held leaf
FD inode. The reviewer confirmed resolution without tests/imports/live access.

Frozen evidence:

| Manifest | SHA-256 |
| --- | --- |
| `offline/manifest.json` | `463b9c0f389575b6326496d92293cb8c1275e171ac6b06b78a72a664d7a5f950` |
| As-run `proof/manifest.json` | `080043efce4f4b0c62b34d5eaa238ebd7d9f2e68c8b498c7d92611cac86b30a9` |
| Derived `postrun/manifest.json` | `21a7999727442fc050261f15bc5b4c9559b10aa15ace13ca761e4bd266ee48e4` |

The as-run manifest binds30 proof files and22 helper/source entries; proof plus
scratch is2,355,373 bytes within10MiB. The supplement independently verifies
as-run files/helpers, all retained sample bindings/limits/OOM counters and equal
before/after preservation. It clarifies one copied generic ledger sentence:
old Linux helper guards are reused by unchanged source hashes, as the actual
receipt states; those guards were not rerun during this preparation. As-run
ledger and manifests are not rewritten to correct this inherited wording.

Cleanup is clean: token-owned containers/network removed, no owned containers
remain, sampler stops normally, final container states have no OOM, and no
cleanup/preservation error. Preservation agrees before/after:408 prior files,
358 F2 candidate inputs, clean B1+C at
`b79f426649e65eadb3fb29e410250395a6d65faa`, unchanged primary Service,28-file old
probe/runner,18-file stable-cache proof with6 helpers, and ten later pinned
manifest/helper/input chains. Original PDF baseline evidence is unchanged.
No Word export or reviewed-page budget is used. No product change, document
generation, full suite, Plan2, pagination B2, integration, release or push.

The authorized stop checkpoint is complete; Plan1's A–B–B–A result remains
blocked by external config startup. Only this existing Project Control document
changes; `tools/check.ts` and `git diff --check` pass. No map/registry/package
truth is promoted.
