# แผนพัฒนาคลังฟอนต์ FlowDoc ตามช่วงงาน

## Authority Boundary

Owner: FlowDoc Project Control. บทบาท Planning Partner / Documentation Synthesizer.
อ้างอิง [ข้อตกลงที่เจ้าของอนุมัติ](flowdoc-font-library-design-2026-10-16.md).
เอกสารนี้กำหนดลำดับ ผลส่งมอบ และการตรวจ ไม่ใช่หลักฐานว่าพัฒนาแล้วหรือสิทธิ์ deploy.
การจัดทำแผนเป็น single-room; execution/Phase/Checklist IDs ไม่เกี่ยวข้อง.
ยังไม่แก้ product code, migration, ฐานจริง, user draft หรือแพ็กเกจ FlowDocMake.
ช่วง 0 ต้องจบก่อนทำช่วง 1–6 เพราะข้อค้นพบอาจเปลี่ยนสัญญาและเจ้าของส่วนเชื่อมต่อ.
รายละเอียดงานย่อยและ interface ของช่วงหลังต้องเติมจากผลช่วง 0 ก่อนส่งลงมือ.

> สำหรับผู้ลงมือ: ใช้ superpowers:executing-plans เมื่อเลือกทำในแชตเดียว;
> ใช้ subagent-driven-development เฉพาะเมื่อได้รับอนุญาตให้ใช้วิธีนั้น.
> แผนและสัญญาร่วมอยู่ Project Control ไม่สร้างสำเนาใน product docs/superpowers.

**Goal:** ผู้ดูแลจัดชุด TTF คงที่ ออกใช้เป็นรุ่น และให้เอกสารอ้างรุ่นนั้นเพื่อสร้าง PDF
โดยคงการใช้ Sarabun เดิมและยอมให้ draft มีปัญหาฟอนต์ที่ระบุได้.

**Architecture:** เสนอให้ Service เป็นเจ้าของคลัง ไฟล์ สิทธิ์ สถานะ และงานสร้าง PDF;
Core เป็นเจ้าของสัญญาโครงสร้าง การเลือก/วัด/จัดอักษร และฝังฟอนต์จากชุดที่ยืนยันแล้ว.
FlowDocMake และส่วนติดต่อใช้ API เดียวกัน ไม่สร้างคลังหรือกฎอนุมัติซ้ำในแต่ละ client.
เจ้าของเลือกเครื่องมือผู้ดูแลก่อน; ไม่มีหน้า admin ในรอบแรกและไม่แก้ Editor/Backend อีกสาย.
Service เป็นเจ้าของ API/เครื่องมือผู้ดูแล; FlowDocMake เป็น client สำหรับผู้เขียนเอกสาร.

**Tech Stack ที่พบ:** Core/Service 0.3.0, TypeScript/Node 24, PostgreSQL,
Python/fontTools, ตัวจัดอักษรของ Core และ MCP draft-only; frontend เลื่อนไปภายหลัง.

## ขอบเขตและวิธีทำงาน

- รักษากฎ TTF คงที่ ผู้ดูแลนำเข้า ปกติ 400 ขั้นต่ำ น้ำหนักสามค่า และหกสถานะตาม spec.
- ไม่เพิ่ม custom/variable font, OTF, automatic fallback, synthetic bold/italic หรือ style เส้น/กรอบ.
- รุ่นที่ออกใช้แล้วเปลี่ยนไฟล์/สมาชิก/การจับคู่ไม่ได้; ผลตรวจต้องผูกชุดและ hash จริง.
- บันทึก draft ไม่เท่ากับพร้อม PDF; โครงสร้างผิด/สิทธิ์ผิดยังต้องปฏิเสธอย่าง atomic.
- ไม่มีการแทนไฟล์ Sarabun หรืออัปเกรดเอกสารเดิมเงียบ ๆ.
- Core ไม่รับ HTTP/DB และ Service ไม่คัด renderer/validator ของ Core มาเขียนซ้ำ.
- migration ใหม่เป็น forward-only; ไม่แก้ migration ที่ใช้แล้วหรือฐานผู้ใช้เพื่อให้ผ่าน test.
- แผนงานรวมขนาด large, ความเสี่ยง routine; แตกเป็นช่วงเพื่อจำกัดผลกระทบต่อสัญญา/ข้อมูลเดิม.
- งบพิสูจน์: test เฉพาะส่วนที่เปลี่ยนและผู้ใช้สัญญานั้น, ฐานทดสอบแยก, PDF สั้น
  สำหรับรูปแบบที่ออกใช้ และการทดสอบ Core package ใน consumer จริง. ไม่ใช้ SRS 98 หน้าเป็นค่าเริ่มต้น.
- งบเอกสาร: spec และแผนนี้เป็นหลัก เติมผล/ลิงก์หลักฐานในช่วงที่เกี่ยวข้อง;
  ไม่เพิ่มคู่มือเริ่มต้นบังคับของ FlowDocMake หรือสร้าง Work/Evidence จำลอง.
- ยังไม่ dispatch หรือเลือกโมเดล WORK; ต้องตัดสินใน kickoff ของงานจริงตาม workflow policy.
  งานแผนครั้งนี้ใช้ session ปัจจุบัน ไม่อ้างว่าเป็น registered PLAN/WORK round.
- แนะนำทำตามลำดับในแชตเดียว ตรวจรับทีละช่วง; แยก worktree ของ repo ที่แก้เมื่อเริ่มลงมือ
  ตามความเสี่ยง/งานพร้อมกัน การแยก checkout ไม่บังคับเปิดอีกแชต.

## ฐานที่ตรวจและสิ่งที่มีผลต่อลำดับ

ตรวจแบบอ่านอย่างเดียว 2026-10-16: Core `6d2a9b7` และ Service `0c57eec`
เป็น 0.3.0 และ checkout สะอาด ณ ตอนจัดทำแผน; ตรวจ base ใหม่ก่อนลงมือ.

| ที่พบ | ผลต่อแผน |
| --- | --- |
| Core TextStyle รับ sarabun และ normal/bold; การวัดเลือก font-regular/bold/italic/bold-italic | ต้องเปลี่ยนสัญญาและเลือกไฟล์ทุกทาง ไม่ใช่เพิ่มแถว DB อย่างเดียว |
| loader คาด resource IDs เดิม; subset helper ระบุข้อมูล license ของชุดเดิม | ต้องรักษา legacy route และส่งตัวตน/ใบอนุญาตจากไฟล์จริง |
| authoring save เรียก validateTemplate; preview เรียกตัวตรวจเดียวกันก่อน prepare/compose | ต้องแยกโครงสร้างที่บันทึกได้จาก readiness ไม่ปิด validator เดิมทั้งหมด |
| Service มี migration 001–015 และใช้ Core จาก packed artifact | เพิ่ม migration ใหม่/packed release ตามสัญญาที่ตกลง ไม่แก้ vendor/dist โดยตรง |
| authoring access ปัจจุบันมี token/principal ไม่ได้พิสูจน์สิทธิ์ผู้ดูแลคลัง | ต้องกำหนด admin authorization ก่อนเปิดทางนำเข้า/ออกใช้ |
| Editor ปัจจุบันอิง @flowdoc/vnext-core และ Backend อีกสาย | ห้ามถือว่า Editor เชื่อม Service Area18 ได้แล้ว |
| FlowDocMake 0.1.9 ตรวจรุ่น Service/Core 0.3.0 แบบตรงรุ่น | การปล่อยรุ่นใหม่ต้องอัปเดต compatibility หลังพิสูจน์ ไม่ข้าม preflight |

## ลำดับและจุดตรวจรับ

| ช่วง | เจ้าของหลัก | ต้องได้ก่อนเดินต่อ |
| --- | --- | --- |
| 0 ปิดสัญญาและทางเชื่อม | Project Control พร้อมตรวจ Core/Service/clients | แบบสัญญาและ ownership ชัด พร้อมงานย่อยที่ลงมือได้ |
| 1 คลังและรับไฟล์เข้าเตรียม | Service | รับ/อ่าน/ตรวจซ้ำ/เก็บชุดเตรียมได้อย่างปลอดภัย ยังไม่เปิดออกใช้ |
| 2 Core ใช้ชุดฟอนต์ที่ระบุ | Core | วัดและฝังด้วยไฟล์ที่ตรงกัน พร้อมทาง Sarabun เดิม |
| 3 Draft readiness และงาน PDF | Service ร่วม Core | บันทึกค้างได้ แต่ PDF ใช้ snapshot ที่ตรวจแล้วเท่านั้น |
| 4 ตรวจและออกใช้คลังครบวงจร | Service | หกสถานะ สิทธิ์ ค่าเริ่มต้น และประวัติทำงานจริง |
| 5 เชื่อมเครื่องมือ | Service และ FlowDocMake | ผู้ดูแล/ผู้เขียนใช้ API จริงและเข้าใจปัญหาได้; UI เลื่อนไปภายหลัง |
| 6 ตรวจร่วมและเตรียมส่งมอบ | verification ตามเจ้าของส่วน | วงจรจริงผ่าน มีหลักฐานความครบและข้อค้างชัดเจน |

### ช่วง 0 ปิดสัญญาก่อนเปลี่ยนระบบ

Authority: discovery-only ต่อ product; บันทึกการตัดสินใจใน spec/แผนนี้ได้.
อ่านจุดเชื่อมจากไฟล์ในตารางข้างล่าง ไม่อ่านประวัติทั้งโครงการหรือทดสอบ capacity ใหม่.

- [x] ระบุสัญญา TextStyle ใหม่ รูปแบบยังไม่เลือก ช่วงน้ำหนักและ schema/model version
  รวม rule สำหรับ reference ชนิดถูกต้องแต่ยัง resolve ไม่ได้ กับ reference ผิดโครงสร้าง.
- [x] กำหนด catalog/release/face/asset/import-audit และผล readiness ที่แยกจาก save receipt;
  เขียนตัวอย่างผ่าน/ไม่ผ่านและ issue code/path ที่ clients ใช้ร่วมกัน.
- [x] ระบุ interface: ตรวจไฟล์ → ชุดเตรียม → review snapshot → เปิดใช้ →
  resolve style → font snapshot ของ job → Core; ให้ชื่อ/type/สิทธิ์แน่นอนก่อนเขียนงานย่อย.
- [x] ยืนยันสิทธิ์ผู้ดูแล ขอบเขต API/CLI/MCP และ owner ของหน้า admin/ตัวเลือกฟอนต์.
  แยกการเลือก UI ใหม่กับการแก้ Editor อีกสาย; ไม่เพิ่ม frontend ใหม่โดยปริยาย.
- [x] ตัดสินกรณีคัดลอกเอกสารที่อ้างรุ่นเลิกให้เลือก: new reference หรือ retained reference;
  กำหนดผลเมื่อ restore/ไฟล์ไม่พร้อมและการอนุมัติทดสอบรุ่นเตรียมที่แยกจาก normal PDF.
- [x] ทำชุดข้อทดสอบตัวอย่าง: Sarabun เดิม, IBM/Pridi, น้ำหนักต่างจากต้นทาง,
  มี/ไม่มี italic, ขาด glyph, invalid structure, stale revision, สิทธิ์ไม่พอ.

**ตรวจรับ:** แต่ละกรณีบอกได้ว่า save/PDF/activate ผ่านหรือไม่ ใช้รุ่น/ไฟล์ใด และใครเป็นเจ้าของ;
ไม่มีสัญญาหรือ owner สำคัญที่ผู้ลงมือต้องเดา. ผลใหม่ที่เปลี่ยนข้อตกลงกลับให้เจ้าของทบทวน.
เติม exact interface, รายชื่อไฟล์ใหม่และคำสั่ง test ของช่วง 1–5 ในแผนก่อนอนุญาต implementation.
ไม่ใช้การเขียน API ตัวอย่างหรือ migration ทดลองเป็นวิธีข้ามช่วง discovery.

#### ผลปิดช่วง 0 — 2026-10-16

สถานะ: ปิด discovery/รายละเอียดสัญญาตามคำขอเจ้าของแล้ว; งานถัดไปคือช่วง 1.
สัญญาด้านล่างเป็นเป้าหมายสำหรับพัฒนา ไม่ใช่ API ที่เรียกใช้ได้ใน 0.3.0.
ข้อตกลงเพิ่มที่เจ้าของยืนยัน: เครื่องมือผู้ดูแลก่อน UI และสำเนาคงรุ่นเลิกให้เลือกได้.
ยังไม่เปลี่ยน product code/ฐาน/ไฟล์ฟอนต์ และไม่เพิ่มเอกสารบังคับให้ AI อ่าน.

**ขอบเขตเจ้าของ:** Service ดูแล catalog, bytes, provenance, admin authorization,
retained references, review และ job snapshot; Core ดูแล JSON grammar, การวัด/จัดอักษร/
subset/ฝัง PDF. การตรวจชนิด draft อยู่ Core และไม่ต้องต่อ DB; การตรวจว่ารุ่นมีจริงอยู่ Service.
เครื่องมือผู้ดูแลเรียก Service API ไม่ต่อ DB โดยตรง; credential แยกจาก AUTHORING_TOKEN.
ไม่เพิ่ม font-admin MCP ลง FlowDocMake ซึ่งเป็นช่องทางผู้เขียนเอกสาร.

**ข้อค้นพบที่ต้องรักษา:** `sectionOwnership.ts` ตรวจ schemaVersion=1 แบบ strict;
`assembly.ts` เก็บ styles ใน payload และประกอบกลับก่อน Core ตรวจ. ดังนั้นต้องทดสอบ
round-trip ทั้ง current และ published snapshot ไม่เปลี่ยนเพียง type ของ TextStyle.
`render-child.ts` โหลด bundled resources เองและกรอง error เหลือ LAYOUT_FAILED;
ต้องส่ง font snapshot เข้ากระบวนการลูกและรักษา font issue ทั้งขา child และ parent.

**สัญญาเอกสารสำหรับพัฒนา:** ใช้ schemaVersion=2 สำหรับโครงสร้างใหม่ แต่คง nodeModelVersion=18
เพราะไม่ได้เปลี่ยน ownership/Area model. อ่าน schemaVersion=1 ตาม grammar เดิมต่อ;
ห้ามผสม field ฟอนต์เดิม/ใหม่ใน style เดียวกันหรือเปลี่ยน fingerprint ของ v1 ตอนอ่าน.
ขอบเขตการเปลี่ยนนี้รวม TemplateDefinition และ ResolvedDocument ของ Core.

```ts
type FontSelection = {kind:'unselected'} | {
  kind:'library'; releaseId:string; weight:number; style:'normal'|'italic'
};
type TextStyleV2 = {
  font:FontSelection; fontSize:{value:number;unit:'pt'}; lineHeightPt:number
};
```

`releaseId` เป็น UUID รูปแบบ canonical ที่ Service สร้าง; `weight` เป็นจำนวนเต็ม 1–1000.
ไม่รับ path/URL, string น้ำหนัก, null, field ส่วนเกิน หรือ library ที่ขาดรหัส;
unselected ไม่มี releaseId/weight/style. เกณฑ์ขนาดและระยะบรรทัดยังใช้ validator เดิม.
draft v2 ที่มี unselected เก็บได้ แต่การส่งเข้า layout/PDF ต้องคืน FONT_NOT_SELECTED.
การอ่าน v1 ใช้ legacy binding ที่ผูก hash ของ Sarabun สี่ไฟล์ ไม่แก้ payload เมื่ออ่าน;
คำสั่งแปลงเป็น v2 ต้องสร้าง revision ใหม่และยังคงตัวตน template ตามกติกา Service.

**ข้อมูลคลังสำหรับพัฒนา:** รหัส entity เป็น UUID; hash เป็น SHA-256 ของ bytes; เวลาเป็น UTC.
ทุก entity มี createdAt; รายการแก้ได้มี updatedAt/revision; event เป็น append-only.

| Entity | field หลัก/ข้อบังคับ |
| --- | --- |
| FontFamily | id, displayName, internalNames, sourceIdentity, defaultReleaseId nullable; ชื่อไม่ unique key |
| FontAsset | id, sha256 unique, byteLength, format='ttf-static', storageKey, parsedMetadata, coverageDigest; bytes immutable |
| FontRelease | id, familyId, version, state, revision, manifestDigest, everActivatedAt nullable; unique(familyId,version) |
| FontFace | id, releaseId, assetId, rawWeight, sourceWeight nullable, approvedWeight, style, sourceEvidenceId; unique(releaseId,approvedWeight,style) |
| FontSourceEvidence | id, provider, locator, retrievedAt, metadataHash, fileHashBinding, licenseAssetIds, conflictResolution; ตรวจสิทธิ์/ที่มาแยกจาก dedup |
| FontReview | id, releaseId, manifestDigest, rendererIdentity, testSuiteDigest, results, reportDigest, artifactHashes, reviewedBy/reviewedAt nullable จนยืนยัน; ผลผูก input ที่ตรวจจริง |
| FontAuditEvent | id, actor, at, action, reason, releaseId nullable, requestId, before/after digest, outcome; ไม่เก็บ credential |

state codes: preparing / in_review / needs_changes / ready / active / retired ตามหกสถานะใน spec.
approvedWeight ต้องกำหนดก่อนส่ง review; ข้อมูลขัดกันคง preparing/needs_changes.
manifest ครอบคลุม face bindings, hashes, ที่มา/ใบอนุญาต และขอบเขตภาษา;
activated content แก้ไม่ได้ แม้เปลี่ยนสถานะกลับมา. เก็บ asset license แยก ไม่ใช้ OFL ของ Sarabun แทนทุกไฟล์.

**Interface สำหรับพัฒนา:** ชื่อด้านล่างเป็น service/domain methods; route/CLI adapter ต้องเรียกกฎชุดเดียวกัน.
admin mutation รับ requestId และ expectedRevision เมื่อมีเป้าหมายเดิม;
authoring รักษาชื่อ idempotencyKey/expectedRevision เดิม ไม่เปลี่ยนชื่อเพื่อให้ตรงกับ admin.
retry payload เดิมคืน receipt เดิม, payload ต่างปฏิเสธ, stale ไม่เขียนบางส่วน.

| Method | Input → Output / สิทธิ์ |
| --- | --- |
| inspectFont | bounded bytes + source evidence → parsed metadata/hash/coverage/conflicts; admin, ไม่เปิดใช้ |
| stageFontRelease | familyId + version + inspected assets/face bindings → releaseId/revision/manifestDigest; admin |
| submitFontReview | releaseId + expectedRevision → frozen reviewId/manifestDigest; admin |
| reviewFontRelease | reviewId + exact runtime/test inputs → persisted result; admin runner, ทดสอบทุก face |
| activateFontRelease | releaseId + reviewId + manifestDigest → active receipt; admin, ตรวจ snapshot ใน transaction |
| retireFontRelease / setFamilyDefault | exact IDs + reason → audited receipt; admin, ห้ามเดา default แทน |
| listSelectableFonts | active catalog → release IDs/face choices; authoring, ไม่มี storage path |
| checkFontReadiness | exact definition/revision + optional sample input → FontReadiness; authoring |
| resolveJobFonts | exact composed content + server-held retention → FontSnapshot หรือ issues; internal |
| cloneDraft | authorized sourceId + sourceRevision + target identity → new draft + inherited bindings; authoring |

admin credential เป็นค่ากำหนดเฉพาะใน Service และปิด admin routes หากไม่ตั้งค่า;
token ผู้เขียนใช้แทนไม่ได้. CLI ส่ง bytes/JSON ไป API และรับ diagnostics ที่ไม่มี local server paths.
ขีดจำกัด file bytes/count/parse timeout กำหนดด้านล่าง; negative tests อยู่ช่วง 1.

**Readiness สำหรับพัฒนา:** save receipt ยืนยัน saved revision แยกจาก
`{status:'ready'|'blocked'|'incomplete', checkedScope:'styles'|'actual_input', definitionFingerprint, inputFingerprint?, issues, total, truncated}`.
ready ที่ไม่มี input เป็นผลเฉพาะโครงสร้าง/style ไม่ใช่รับรองข้อความจริง; PDF ตรวจ actual input เสมอ.
issues ใช้ `{code,path,message,remedy,styleIds,occurrences,samples}`; จำกัดรายการและแจ้ง total/truncated.
path ใช้ JSON Pointer เช่น `/styles/body/font`; ไม่ส่งข้อความทั้งเอกสารหรือ server path ใน error.

| รหัส | ผล |
| --- | --- |
| INVALID_FONT_SELECTION | โครงสร้างผิด → save ปฏิเสธโดยไม่ขยับ revision |
| FONT_NOT_SELECTED / FONT_RELEASE_NOT_FOUND / FONT_RELEASE_NOT_ACTIVE | save ได้, blocked |
| FONT_REFERENCE_NOT_RETAINED | รุ่น retired ที่ไม่มีต้นฉบับอ้างอิงยืนยัน → save ได้, blocked |
| FONT_FACE_UNAVAILABLE / FONT_GLYPH_MISSING / FONT_SHAPING_FAILED | save ได้, blocked |
| FONT_ASSET_UNAVAILABLE / FONT_ASSET_HASH_MISMATCH / FONT_CHECK_UNAVAILABLE | save ได้, incomplete; หยุด PDF |

revision/สิทธิ์/idempotency failure ยังเป็น operation error เดิมและไม่คืน saved receipt.
หาก catalog ล่มหลังบันทึก ให้คืน saved + incomplete ไม่ rollback สิ่งที่บันทึกสำเร็จแล้ว.

**Snapshot/retention สำหรับพัฒนา:** FontSnapshot มี version=1, definition/input fingerprints,
rendererIdentity, manifestDigest และ bindings `{styleId,releaseId,faceId,assetId,sha256,weight,style}`.
Service เติม path ภายในจาก storageKey เท่านั้นและตรวจ bytes เมื่อ worker ใช้; Core รับ FontResource
ที่มี identity/hash/license ชัดเจน ไม่ค้นคลัง/HTTP. ใช้ asset hash เป็นส่วนหนึ่งของ runtime font ID/cache key.
การเปลี่ยน default หรือ retire ระหว่างรอคิวไม่เปลี่ยน snapshot; bytes หาย/เสียยัง fail.
admin trial มี purpose='font-review', reviewId/digest และสิทธิ์เฉพาะ แยกจาก ordinary preview.

สำเนาที่สร้างผ่าน cloneDraft สืบทอดชุด `(releaseId,weight,style)` จาก revision ต้นฉบับที่ตรวจสิทธิ์แล้ว;
ผู้ใช้ส่ง retained=true เองไม่ได้. การเปิด/บันทึกต่อในเอกสารเดิมคง bindings เดิมได้;
การเลือก retired ใหม่ที่ไม่มี lineage เก็บ draft ได้พร้อม issue แต่สร้าง PDF ไม่ได้.
restore ต้องคืน bytes hash เดิมพร้อม metadata/lineage; ขาดส่วนใดให้ incomplete ไม่เลือกตัวแทน.

**กรณีตรวจรับสัญญา:** ทุกกรณีต้องทดสอบผ่าน public Core exports และ Service adapter จริง.

| กรณี | save / PDF / activate ที่ต้องได้ |
| --- | --- |
| Sarabun v1 เดิม | อ่าน/บันทึกตาม grammar เดิม; PDF ใช้สี่ hash ที่ยืนยัน, เทียบ layout baseline |
| v2 unselected หรือ UUID ถูกแต่ไม่พบ | save ได้ + blocked; PDF หยุด |
| weight='400', 0, 1001, URL หรือ mixed v1/v2 | atomic reject; ไม่ขยับ revision |
| IBM/Pridi ไม่มี italic | normal ที่มีจริงใช้ได้; ขอ italic save ได้แต่ PDF หยุด |
| raw/source weight ขัดกัน | stage ได้; activate ไม่ได้จน admin resolve และตรวจใหม่ |
| ขาด glyph/จัดอักษรไม่ได้ใน actual input | save ได้; PDF หยุดพร้อมตำแหน่งและตัวอย่าง |
| retired ที่เดิมอ้าง/สำเนายืนยันต้นฉบับ | ใช้ต่อได้; การอ้างเพิ่มที่ไม่มี lineage ถูก blocked |
| stale revision / authoring token เรียก admin | ปฏิเสธ; catalog/draft/audit ไม่แสดงความสำเร็จปลอม |
| review digest เก่า / เพิ่ม face ภายหลัง | activate ปฏิเสธ; รุ่นที่ออกใช้แล้วต้องสร้างรุ่นใหม่ |
| queued job แล้ว default เปลี่ยน/ไฟล์เสีย | default ไม่เปลี่ยนผล; hash ผิดหยุดก่อนส่ง PDF |

**ขอบเขต transport ที่เสนอ:** `/admin/fonts` ตรวจ FONT_ADMIN_TOKEN/FONT_ADMIN_PRINCIPAL
ต่างจาก authoring; ห้ามตั้ง token เท่ากัน. actor มาจาก credential ไม่รับจาก request.
ทุก JSON route ใช้ duplicate-aware reader เดิม; action mutation รับ
`{requestId,expectedRevision,reason,...actionFields}`; ผลสำเร็จใช้ `{ok:true,value:...,warnings:[]}`.
POST สร้าง family/import ไม่ต้อง expectedRevision เมื่อยังไม่มี entity; การแก้ entity เดิมต้องมี.

| เส้นทางที่วางไว้ | หน้าที่และ actionFields |
| --- | --- |
| POST /admin/fonts/imports | สร้าง bounded intake session: files[{clientKey,byteLength,sha256}], sourceEvidence |
| PUT /admin/fonts/imports/:id/files/:clientKey | binary bytes ทีละไฟล์; ตรวจ session/size/hash, retry ไฟล์เดิมได้ |
| POST /admin/fonts/imports/:id/inspect | finalize และ parse ครบชุด → inspection receipt; ไม่มี auto activate |
| POST /admin/fonts/families | displayName, internalNames, sourceIdentity → familyId |
| POST /admin/fonts/releases | familyId, version, importId, faceBindings, languageScope → preparing |
| PATCH /admin/fonts/releases/:id | candidate fields เดียวกับตอนสร้าง; เฉพาะ preparing/needs_changes |
| POST /admin/fonts/releases/:id/submit-review | manifestDigest → in_review + reviewId |
| POST /admin/fonts/releases/:id/withdraw-review | reviewId → preparing; invalidate review result |
| POST /admin/fonts/reviews/:id/run | runner ตรวจ snapshot จริง → needs_changes เมื่อไม่ผ่าน; ผ่านยัง in_review จนผู้ดูแลตรวจภาพ; reactivation คง retired |
| POST /admin/fonts/reviews/:id/approve | reportDigest, artifactHashes → ready สำหรับรุ่นใหม่; admin ยืนยันภาพ/ขอบเขตตรงรายงาน; reactivation คง retired แต่ review ผ่าน |
| POST /admin/fonts/releases/:id/activate | reviewId, manifestDigest → active |
| POST /admin/fonts/releases/:id/retire | replacementDefaultReleaseId หรือ clearDefault=true เมื่อเป็น default → retired |
| POST /admin/fonts/releases/:id/reactivation-review | retired คง retired ระหว่างตรวจ; ชุดเดิม immutable → review ใหม่ก่อน activate |
| PUT /admin/fonts/families/:id/default | releaseId หรือ null; active ของ family เดียวกันเท่านั้น |
| DELETE /admin/fonts/releases/:id | เฉพาะ preparing ที่ไม่เคย active/ไม่มี review หรือ reference; ไม่ลบ shared bytes |
| GET /admin/fonts/releases/:id และ /imports/:id | metadata, review/audit summary; ไม่คืน server paths/token |
| GET /authoring/fonts | selectable active families/releases/faces |
| POST /authoring/drafts/:id/clone | sourceRevision, idempotencyKey, target docKey/name → server-created identity + inherited bindings |

readiness อยู่ใน save/validate/preview ของ authoring เดิม; ไม่สร้าง font validation กฎอีกชุดใน client.
preview ของ review ใช้ `/admin/fonts/reviews/:id/previews` และ job purpose เฉพาะ;
ordinary preview ไม่ยอมใช้ preparing/in_review/ready. การ reactivate ไม่เปลี่ยน retained eligibility
ของรุ่น retired ระหว่างตรวจ. การ reopen ready เพื่อแก้ชุดใช้ withdraw-review และยกเลิกผลเดิม.

CLI ใหม่ `node dist/fonts/cli.js <command> --request <json-file>` ใช้ FONT_ADMIN_BASE_URL/TOKEN;
commands: import, family-create, release-stage, release-edit, review-submit, review-withdraw,
review-run, review-approve, activate, retire, reactivation-review, default-set, release-delete, show.
import request ระบุ local files; CLI อ่านแล้วส่ง bytes แต่ Service ไม่รับ client filesystem path เป็น resource.
receipt และสถานะเป็น JSON; ไม่มี credential ใน argument/log. `show` ใช้ id จาก request และไม่เขียนข้อมูล.

ค่าจำกัดเริ่มต้นที่เสนอและต้องมี boundary tests: 10 MiB/TTF, 64 TTF/import,
128 MiB/import, metadata JSON 1 MiB, session 24 ชั่วโมง, parse 30 วินาที/ไฟล์ และครั้งละหนึ่ง parser.
เก็บ upload แบบ streaming; ไม่เพิ่ม body limit JSON ของทั้ง Service เพื่อรับ font bytes.
diagnostics สูงสุด 100 issues, 20 occurrence/issue, 3 sample/issue, sample 80 code points;
ส่ง total/truncated และไม่ถือว่ารายการที่ตัดออกผ่าน. readiness blocked มีลำดับเหนือ incomplete
เมื่อพบทั้งสองประเภท; เก็บ issue ครบตามขีดจำกัดและ PDF หยุดทั้งคู่.
manifest ใช้ canonical JSON แบบ sorted keys, face เรียงตาม weight/style/asset hash;
ไม่รวม state/default/review result/เวลา เพื่อไม่ให้การ retire เปลี่ยนตัวตนชุด.

**รายละเอียดงานย่อยสำหรับลงมือ:** เส้นทางใหม่เป็นเป้าหมายที่เสนอ ไม่ใช่ไฟล์ที่มีอยู่แล้ว;
ก่อนเริ่มแต่ละช่วงตรวจ base และเลข migration ที่ยังว่างอีกครั้ง. ไม่จอง migration 016 ล่วงหน้า.

| ช่วง | ไฟล์ใหม่ที่กำหนด / การตรวจเฉพาะ |
| --- | --- |
| 1 | Service `src/fonts/types.ts`, `repository.ts`, `files.ts`, `inspection.ts`, `service.ts`, `runtime/python/inspectFont.py`, migration ใหม่; `tests/fonts-intake.test.mjs`, `fonts-repository.test.mjs` |
| 2 | Core `src/fonts/types.ts`, `selection.ts`, `validateSelection.ts`, `tests/fonts/selection.test.ts`, `tests/fonts/legacy.test.ts`; แก้ contract/runtime/layout/subset ตามตารางเดิม และ export จาก root |
| 3 | Service `src/fonts/readiness.ts`, `snapshot.ts`, `retention.ts`, `tests/fonts-readiness.test.mjs`, `fonts-jobs.test.mjs`, `fonts-retention.test.mjs`; เปลี่ยน save/assembly/job transport เดิม |
| 4 | Service `src/fonts/review.ts`, `lifecycle.ts`, `src/http/fonts-admin.ts`, `tests/fonts-lifecycle.test.mjs`, `fonts-admin.test.mjs`; authorization/snapshot CAS/real review runner |
| 5 | Service `src/fonts/cli.ts`, `src/http/fonts-authoring.ts`, `tests/fonts-cli.test.mjs`; FlowDocMake เพิ่ม catalog/readiness tools ใน server และ focused tests เดิม; ไม่มี Editor/UI |

แต่ละแถว Service ตรวจ `npm run build` ก่อน tests ใน isolated DB; คำสั่ง tests ใหม่:

- ช่วง 1: `npm test -- tests/fonts-intake.test.mjs tests/fonts-repository.test.mjs`.
- ช่วง 3: `npm test -- tests/fonts-readiness.test.mjs tests/fonts-jobs.test.mjs tests/fonts-retention.test.mjs`.
- ช่วง 4: `npm test -- tests/fonts-lifecycle.test.mjs tests/fonts-admin.test.mjs`.
- ช่วง 5: `npm test -- tests/fonts-cli.test.mjs tests/authoring-tools.test.mjs`;
  Project Control ใช้ `node --test tests/flowdocmake.test.mjs tests/flowdocmake-integration.test.mjs`.

ช่วง 2: `npm run build`, `npm test -- tests/fonts/selection.test.ts tests/fonts/legacy.test.ts`
ร่วม tests เดิม resources/subset/cache/template/pageBands/PDF ที่ได้รับผล และ `npm run check:package`.
ช่วง 3 ต้องรวม `authoring.test.mjs`, `authoring-adapter.test.mjs`, `jobs.test.mjs`, `processor.test.mjs`;
ช่วง 4 รวม `npm run check:database`/`npm run check:api` หลัง build และพร้อม prerequisites.
parser dependency ต้อง pin ใน Service image ตอน build และ COPY helper; ไม่ติดตั้งตอน import/render.

#### สิทธิ์สืบทอดที่ปิดรายละเอียดแล้ว

หน่วยสิทธิ์เป็น tuple `(releaseId,weight,style)` ไม่ใช่ชื่อ family, styleId หรือสิทธิ์ใช้ทั้งคลัง.
Service เก็บ `FontReferenceSet` แยกจาก definition: ownerKind=draft_revision/template_version,
ownerId, revision สำหรับ draft, definitionFingerprint, bindings และ createdAt.
แต่ละ binding มี tuple, origin=active_selection/inherited/verified_legacy,
sourceReferenceSetId nullable, sourceBindingKey nullable; unique(ownerKind,ownerId,revision)
โดย template_version ใช้ ownerId ของ version และ revision เป็น null พร้อม unique แยก.
record ผูก definition ที่เก็บสำเร็จและแก้ย้อนหลังไม่ได้; FK ห้ามลบชุดรุ่น/ไฟล์ที่ยังถูกอ้าง.
binding ที่ค้นไม่พบ/ยังไม่ออกใช้/ไม่มี face เก็บใน definition ได้ แต่ไม่ให้สิทธิ์เพราะเคย save.

| การกระทำ | กติกาสิทธิ์ที่แน่นอน |
| --- | --- |
| save ปกติ | สร้าง reference set ของ revision ใหม่จาก tuple ที่ยังอยู่ใน definition และมีสิทธิ์จาก revision ก่อน หรือ tuple ที่ active/มี face จริงขณะ save |
| เปลี่ยนชื่อ style/ใช้ tuple เดิมอีกตำแหน่ง | คงสิทธิ์ได้ เพราะไม่เพิ่ม tuple; เพิ่ม weight/italic/release อื่นต้องตรวจเป็นการเลือกใหม่ |
| ถอด tuple แล้ว save สำเร็จ | tuple นั้นไม่อยู่ในสิทธิ์ revision ใหม่; พิมพ์กลับจาก JSON ขณะ retired ไม่ได้สิทธิ์คืน |
| clone ผ่าน Service | สืบทอดเฉพาะ tuple ใน definition และ reference set ต้นฉบับที่ยืนยัน; สำเนามีชุดสิทธิ์ของตนเอง |
| นำเข้า JSON/ส่ง retained=true | JSON ไม่ใช่หลักฐาน lineage; field retained ถูกปฏิเสธตาม strict grammar; retired ที่ไม่มีสิทธิ์ save ได้แต่ blocked |
| ต้นฉบับไม่ใช่ของ principal | ตอบ TEMPLATE_NOT_FOUND เช่น draft ที่ไม่มี; ไม่เปิดเผยว่าต้นฉบับ/ฟอนต์มีอยู่หรือไม่ |
| sourceRevision ไม่ตรง current | STALE_CURRENT; รอบแรก clone เฉพาะ current ที่ระบุ ไม่เพิ่ม API คัดลอกประวัติย้อนหลัง |
| ฟอนต์ retired หลังคัดลอก/ก่อนทำ job | สำเนาคงสิทธิ์ของตน; ต้นฉบับเปลี่ยนภายหลังไม่เพิกถอนย้อนหลัง; ตรวจ bytes/readiness ใหม่ก่อน PDF |
| legacy v1 | ใช้ verified legacy binding ของสี่ hash เดิม; version ใหม่ไม่แก้ payload/fingerprint v1; ไม่ยืนยันจากชื่อ Sarabun อย่างเดียว |
| published version/สำรองกู้คืน | ตรึง reference set แยกตาม version; backup ต้องรวมชุดสิทธิ์/lineage/catalog/bytes; ขาดข้อมูลไม่สร้างสิทธิ์จาก JSON ใหม่ |

ลำดับ clone ใน transaction เดียว: ตรวจ principal → lock ต้นฉบับด้วย owned() → ตรวจ receipt
โดย key `(principal,clone,sourceId,idempotencyKey)` → ตรวจ sourceRevision/definitionFingerprint/
reference set → สร้าง target identity/owner → clone definition แล้วแทน templateId/docKey/name/version=1
ด้วย identity เป้าหมายและตรวจ Core → reconcileDefinition โดยไม่ส่ง previous ของต้นฉบับ →
writeCurrent เป้าหมาย revision=1 → ผูก reference set ใหม่ → audit ทั้งผลสำเร็จ/ที่มาและเก็บ receipt → commit.
ใช้ sourceRevision ใน request digest; retry ที่เคย commit คืน target เดิมก่อนตรวจ revision ปัจจุบัน
แต่ยังต้องผ่านการตรวจสิทธิ์ต้นฉบับ. docKey ชน/ขั้นใดล้ม rollback ทั้ง target/owner/graph/grants/receipt.
save ใช้ lock/expectedRevision/receipt เดิม และเขียน reference set หลังรู้ revision ใหม่ใน transaction เดียวกัน.
lock release rows ตามลำดับ ID ให้ selection กับ retire มีจุดตัดชัดเจน; default mutation lock family ก่อน release.
ถ้า DB transaction ล้ม save ไม่สำเร็จ; incomplete ใช้เมื่อส่วนตรวจฟอนต์ล้มหลัง persistence สำเร็จ
ไม่ใช่กลืน database error แล้วตอบว่าบันทึกแล้ว.

job admission ตรวจ reference set ตรงกับ saved fingerprint แล้วตรึง definition/input/font snapshot
ในธุรกรรมเดียวกับ job/receipt; การส่ง font snapshot หรือ lineage จาก client ไม่ใช่อำนาจอนุมัติ.
preview ที่ส่ง definition ชั่วคราวตรวจเป็น new selection ยกเว้น tuple ที่ Service ยืนยันกับ saved revision ได้.
การเปิดใช้ภายหลังไม่รับรองคำขอเดิมอัตโนมัติ: retry save คืน receipt เดิม; ตรวจใหม่ผ่าน validate/preview
ที่อ่านสถานะจริง และ PDF ต้องตรวจ input/hash จริงอีกครั้ง. ไฟล์หายไม่ทำให้ lineage หายแต่ต้องหยุด PDF.
admin review ใช้ purpose แยก; approve ต้องตรง reportDigest + artifactHashes + manifestDigest
และผล automated checks ทุก face; activate ยัง recheck snapshot/version ไม่ใช้คำว่า ready จาก client.

#### ตัวอย่างข้อมูลรับ–ส่งและกฎร่วม

ตัวอย่างทั้งหมดเป็นข้อมูลสมมติสำหรับ contract tests ไม่ใช่รหัส/hash/ผลสำเร็จของ runtime จริง.
UUID เป็น lowercase canonical; SHA-256 เป็น lowercase hex 64 ตัว; revision เป็น safe integer >=0;
release version เป็น integer >=1; weight 1–1000. requestId/idempotencyKey เป็น string 1–200 ตัว,
reason เป็น string trim แล้ว 1–500 ตัว. field ที่ไม่อยู่ในสัญญาปฏิเสธ ไม่ละทิ้งเงียบ ๆ.
ตัวอย่าง response ใช้ projection ของ field ที่เกี่ยวกับกรณีนั้น; save ยังคืน definition/fingerprint/diff เดิมด้วย.
`state:'ready'` ของ draft view เดิมหมายถึงมี definition; clients ต้องอ่าน fontReadiness แยก.

| กลุ่มรับเข้า | field-level schema ที่ใช้กับ routes ด้านบน |
| --- | --- |
| SourceEvidence | provider='google-fonts', locator เป็น URL ที่บันทึกที่มาแต่ไม่ auto fetch, retrievedAt เป็น UTC ISO, metadataHash, fileHashBinding เป็น SHA-256; licenseAssetIds เป็น UUID[] หลัง inspect; conflictResolution nullable หรือ {reason,sourceWeight,approvedWeight} โดย Service เติม reviewer จาก auth |
| Import | files[{clientKey:string 1–100 ตัวตาม `[A-Za-z0-9_-]+`,byteLength:integer>0,sha256}], licenseFiles รูปแบบ entry เดียวกัน, sourceEvidence เป็น array ของ {clientKey,provider,locator,retrievedAt,metadataHash,fileHashBinding,licenseClientKeys}; clientKey unique ทั้ง session; license files เป็น text UTF-8 สูงสุด 1 MiB/ไฟล์ สูงสุด 16 ไฟล์ ไม่ parse เป็นฟอนต์ และนับในงบ 128 MiB |
| Family | displayName:string 1–200, internalNames:string[] ไม่ว่าง, sourceIdentity:{provider,providerFamilyKey}; identity conflict ต้อง review ไม่ merge จาก displayName |
| Release candidate | familyId:UUID, version, importId:UUID, faceBindings[{assetId:UUID,sourceEvidenceId:UUID,sourceWeight:integer 1–1000 หรือ null,approvedWeight:integer 1–1000 หรือ null,style}], languageScope:string[] จาก th/en ที่ suite รองรับ; rawWeight อ่านจาก asset ไม่รับค่าทับจาก client |
| Edit release | expectedRevision + candidate fields ครบชุด; familyId/version คงเดิม; approvedWeight=null ได้เฉพาะก่อน submit; submit ต้องมี normal 400 และไม่มี conflict |
| Review commands | release revision เป็น expectedRevision ของ parent; run/approve/preview รับ reviewId จาก URL และ manifestDigest; approve เพิ่ม reportDigest/artifactHashes; renderer/test inputs มาจาก runner ที่ตรึง ไม่รับ client เขียนผลผ่าน |
| Retire/default | family revision กับ release revision แยกกัน: retire รับ expectedRevision และ expectedFamilyRevision เมื่อต้องเปลี่ยน default; set-default ใช้ expectedRevision ของ family และตรวจ release active ภายใน transaction |
| Binary PUT | Content-Type application/octet-stream, bytes ต้องตรง entry ที่ประกาศ; session/entry lock, digest เดิม retry ได้; digest ต่าง 409; ไม่ใช้ JSON requestId กับ binary; finalize/run ใช้ requestId |
| Result | success `{ok:true,value:{...},warnings:[]}`; failure `{ok:false,issues:[{code,path,message}],warnings:[]}`; font readiness ใช้ส่วนขยาย remedy/styleIds/occurrences/samples/total/truncated ตามขีดจำกัด |

intake ที่ยังไม่มี asset ID เก็บ license ไว้ใน session ก่อน; inspect สร้าง asset IDs และคืน sourceEvidenceId
ที่ผูก licenseAssetIds จริงก่อน stage. ประวัติน้ำหนักต้นทางอยู่ evidence ที่ตรึง; client ยืนยัน mapping
ใน faceBindings/conflictResolution ได้แต่เปลี่ยน raw metadata/source snapshot ไม่ได้.
GET admin/readiness คืน metadata ที่จำเป็น; POST ใหม่คืน 201, action/save/read 200, preview job 202.
401 ไม่มี/ผิด credential; 403 authoring credential ที่ถูกต้องเรียก admin; 404 ไม่พบ/ไม่เป็นเจ้าของ;
409 stale/idempotency/digest/state conflict; 413 เกินขนาด; 422 โครงสร้าง/เกณฑ์ไม่ผ่าน; 503 ตรวจ/บริการไม่พร้อม.
operation error เดิมรักษา path เดิม; เฉพาะ font issues ใหม่ใช้ JSON Pointer.

ตัวอย่าง A — POST `/authoring/drafts/10000000-0000-4000-8000-000000000001/clone`.
server fixture: source revision 8 อ้าง retired release ด้านล่างด้วย tuple 400/normal ที่มีสิทธิ์.

```json
{"sourceRevision":8,"idempotencyKey":"clone-sample-01","docKey":"font-copy","name":"สำเนาทดสอบ"}
```

```json
{"ok":true,"value":{"templateId":"10000000-0000-4000-8000-000000000002","docKey":"font-copy","revision":1,"fontReadiness":{"status":"ready","checkedScope":"styles","definitionFingerprint":"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa","issues":[],"total":0,"truncated":false}},"warnings":[]}
```

retry คำขอเดิมคืน templateId เดิม; เปลี่ยน docKey โดยใช้ key เดิมตอบ 409 IDEMPOTENCY_CONFLICT.
source ขยับเป็น revision 9 ก่อนคำขอแรกตอบ 409 STALE_CURRENT และไม่มี target/receipt สำเร็จ.

ตัวอย่าง B — style fragment ที่แทน `/styles/body` ใน
[base definition](../../../flowdoc-service/examples/area-document-template.json):
เปลี่ยน schemaVersion=2, templateId/docKey เป็น identity ที่ create คืน, version ยังคง 1,
แล้วส่ง definition ทั้งก้อนกับ `{expectedRevision:1,idempotencyKey:"save-font-02"}` ผ่าน PUT draft เดิม.
release นี้มีจริงแต่ retired และ draft นี้ไม่มีสิทธิ์จากต้นฉบับ.

```json
{"font":{"kind":"library","releaseId":"20000000-0000-4000-8000-000000000001","weight":400,"style":"normal"},"fontSize":{"value":12,"unit":"pt"},"lineHeightPt":20}
```

```json
{"ok":true,"value":{"revision":2,"fontReadiness":{"status":"blocked","checkedScope":"styles","definitionFingerprint":"bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb","issues":[{"code":"FONT_REFERENCE_NOT_RETAINED","path":"/styles/body/font","message":"รุ่นนี้เลิกให้เลือกใหม่และไม่มีการอ้างอิงเดิมที่ยืนยันได้","remedy":"เลือกรุ่นที่เปิดใช้ หรือคัดลอกจากต้นฉบับที่มีสิทธิ์ผ่าน Service","styleIds":["body"],"occurrences":[],"samples":[],"total":1,"truncated":false}],"total":1,"truncated":false}},"warnings":[]}
```

`checkedScope` บังคับเป็น styles/actual_input; actual_input ต้องมี inputFingerprint;
ready/styles ไม่ผ่าน PDF admission แทน actual_input. ตัวอย่าง A สมมติ metadata/asset checks พร้อมเท่านั้น.
เปลี่ยน font เป็น `{kind:"unselected"}` ได้ save + FONT_NOT_SELECTED;
เปลี่ยน weight เป็น string "400" ได้ 422 INVALID_FONT_SELECTION และ revision คง 1.
เพิ่ม retained=true ใน request หรือ style ได้ 422 INVALID_DATA/INVALID_FONT_SELECTION ตามตำแหน่ง;
valid UUID ที่ไม่มีได้ save + FONT_RELEASE_NOT_FOUND; ไม่มี italic ได้ save + FONT_FACE_UNAVAILABLE.

ตัวอย่าง C — POST `/admin/fonts/releases/20000000-0000-4000-8000-000000000001/activate`.
server fixture: release revision 5 แต่ review ตรวจชุด revision 4; ต้องไม่เปิดใช้ด้วยผลเก่า.

```json
{"requestId":"activate-sample-01","expectedRevision":5,"reason":"ออกใช้ชุดที่ตรวจแล้ว","reviewId":"30000000-0000-4000-8000-000000000001","manifestDigest":"cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc"}
```

```json
{"ok":false,"issues":[{"code":"FONT_REVIEW_STALE","path":"manifestDigest","message":"ผลตรวจไม่ตรงกับชุดฟอนต์ปัจจุบัน"}],"warnings":[]}
```

เมื่อ review/digest/runtime identity ตรงและผู้ดูแล approve แล้ว activate คืน
`value:{releaseId,state:"active",revision:6,receipt:{requestId:"activate-sample-01"}}`;
retry คืน receipt เดิม. authoring credential ได้ 403 FORBIDDEN ก่อนแตะ release/audit สำเร็จ.
review report ที่ไม่ผ่านทุก face ได้ 422 FONT_REVIEW_FAILED; state ผิดได้ 409 FONT_STATE_CONFLICT.

#### ตรวจรับช่วง 0 และจุดเริ่มพัฒนา

ทบทวนโค้ด Core/Service ณ base ที่ระบุซ้ำ: strict checks ของ schema/ResolvedDocument ต้องแยก v1/v2,
assembly เก็บ schema/styles ใน payload ได้โดยไม่ต้องแปลง v1 ตอนอ่าน; fingerprint ใช้ grammar เดิม
สำหรับ v1. เพิ่ม public exports ของ font types/selection และใช้ Core package จริงใน Service;
ไม่ import private source ข้าม repo. `definition.version=1` ของ draft แยกจาก schemaVersion=2/revision.

| เกณฑ์ช่วง 0 | ผลและหลักฐานขอบเขต |
| --- | --- |
| TextStyle/version/unselected | ปิดสัญญา v1/v2 และตัวอย่าง B; compatibility tests เป็น acceptance ช่วง 2–3 |
| Catalog/readiness/interfaces | ตาราง entity/routes/field schemas/A–C; อ่านจุดเชื่อมจริง ไม่อ้างว่ารัน endpoint ใหม่แล้ว |
| Owner/admin/UI | Service + Core + FlowDocMake แยกหน้าที่; CLI ก่อน UI ตามเจ้าของยืนยัน |
| Clone/restore/retired | reference set ต่อ revision/version + atomic clone/save; JSON ไม่ให้สิทธิ์เอง; backup ขาดข้อมูลหยุด PDF |
| Test matrix | ตารางกรณีเดิมร่วม A–C ครอบคลุม save/PDF/activate/สิทธิ์/stale; implementation ต้องพิสูจน์จริงต่อ |
| งบเอกสาร/unknowns | ใช้ spec+แผนเดิม; UI/custom/variable fonts deferred; ไม่มี unknown ที่บล็อกเริ่มช่วง 1 |

การปิดช่วง 0 เป็นผลตรวจรับงานออกแบบ/discovery; checks ของระบบที่ยังไม่พัฒนาไม่ใช่ PASS.
ตรวจเอกสารรอบปิด: `npm run check:data`, `git diff --check`, JSON examples 6 ชุด
(parse/duplicate keys/field shape/UUID/hash/readiness scope/base fixture) และ local links 6 จุดผ่าน.
ทบทวน coverage ของเกณฑ์ทั้งหกกับส่วนสัญญาที่ระบุแล้ว; ยังไม่เรียก API ใหม่หรือทดสอบ PDF ฟอนต์ใหม่.
ช่วง 1 เริ่ม Service types/intake/repository และ failing tests ตามไฟล์/คำสั่งข้างบนในพื้นที่ทดสอบแยก;
เพิ่ม schema fixtures จาก A–C ใน tests ที่เป็นเจ้าของช่วง 2–4 ไม่คัดไปใช้เป็น validator อีกชุด.
มุ่งรับเข้าเป็น preparing เท่านั้น; admin transport/lifecycle เปิดจริงในช่วง 4–5 ตามแผน.
หาก implementation พบข้อเท็จจริงที่เปลี่ยนสัญญานี้ ให้รายงานขอบเขตผลกระทบก่อนเปลี่ยนกฎ.

### ช่วง 1 สร้างคลังและรับเข้าเป็นชุดเตรียม

Scope ที่เสนอ: เพิ่ม module `flowdoc-service/src/fonts/` แยก metadata/repository/files/service;
เพิ่ม forward migration ใหม่ และ tests ใน `tests/fonts-*.test.mjs` ตามสัญญาช่วง 0.
ใช้รูปแบบจัดเก็บจาก `src/storage/resource-files.ts` เป็นบริบท ไม่ใช้ image-upload contract แทนฟอนต์.

- [ ] เพิ่ม failing tests แล้วทำ migration/repository สำหรับตัวตนรุ่น น้ำหนักสามค่า
  รูปแบบ ไฟล์ และประวัติ พร้อมข้อบังคับ unique/reference/เวลา.
- [ ] ทำการรับ TTF คงที่และอ่าน metadata โดยจำกัดขนาด/เวลา ตรวจ bytes/hash จริง
  แยกต้นฉบับ ค่าต้นทาง และค่าที่อนุมัติ ไม่ใช้ filename ตัดสินหรือแก้ bytes อัตโนมัติ.
- [ ] ทำ dedup/idempotency และการเก็บไฟล์ร่วมกัน รวม cleanup เมื่อ transaction/การเก็บไฟล์ล้ม.
  ยังไม่เปิดให้สถานะออกใช้ผ่านก่อนมีผลตรวจจากช่วง 2–4.

**ตรวจ:** ทั้ง 29 ไฟล์อ่านเป็นชุดเตรียมได้; Sarabun สี่ไฟล์หลัก reuse ได้;
เปลี่ยนชื่อไฟล์ไม่ทำให้ซ้ำ, same slot/different hash ไม่ทับของเดิม, metadata ขัดกันค้างให้ยืนยัน,
TTF ปลอม/variable/OTF ถูกปฏิเสธ, retry/concurrent import ไม่สร้างซ้ำหรือทิ้งไฟล์ผิดสถานะ.
ทดสอบฐานใหม่และฐานที่มีข้อมูลเดิมใน environment แยก ไม่แก้เลข migration เก่า.

### ช่วง 2 ให้ Core เลือก วัด และฝังฟอนต์จากชุดที่ยืนยันแล้ว

แก้ contract/validator, resource adapter, text measurement/cache และ subset ตามสัญญาช่วง 0.
Service ส่ง resource ที่ resolve แล้ว; Core ไม่ค้น DB, Google Fonts หรือ system fonts เอง.

- [ ] เพิ่ม failing tests สำหรับ style อ้างรุ่น/น้ำหนัก/รูปแบบ และ legacy mapping
  รวม body, table, header/footer, TOC และเลขหน้า ไม่แก้เฉพาะทางข้อความธรรมดา.
- [ ] ส่ง resource identity ที่แยกไฟล์/รุ่นได้ถึง shaper, cache และ PDF;
  ป้องกัน font-regular ของคนละตระกูล/รุ่นชนกัน และตรวจ hash ก่อนใช้.
- [ ] ขยาย loader/subset metadata ให้ใช้ตัวตนและ license ของไฟล์จริง;
  รักษาเส้นทาง bundled Sarabun เดิมตาม hash ไม่แทนไฟล์หรือแก้เนื้อเอกสารเก่า.

**ตรวจ:** font เดียวกันถูกใช้วัดและฝัง; เปลี่ยน default ไม่เปลี่ยนงานที่ pin;
สองตระกูล/สองรุ่นในเอกสารเดียวไม่ปน cache; ตัวหนาเอียงต้องมี face จริง;
ขาด glyph/รูปแบบ/ไฟล์และ hash ผิดต้องไม่แทนเงียบ ๆ. ใช้ PDF สั้นตรวจทุก face ที่จะออกใช้.
เปรียบเทียบ Sarabun เดิมกับ baseline ด้านข้อความ ตัดบรรทัด ตำแหน่ง และหน้า;
การทดสอบเฉพาะ hash ไฟล์ไม่ใช่หลักฐาน layout parity.
build และตรวจ packed consumer Linux/amd64 ก่อน Service เปลี่ยน dependency.

### ช่วง 3 แยกการบันทึก draft ออกจากความพร้อม PDF

ต่อ Core package ที่พิสูจน์แล้วเข้ากับ Service authoring และ job pipeline.
ไม่ลดกฎสิทธิ์ identity ownership stale revision หรือ idempotency เดิม.

- [ ] เพิ่ม failing tests ให้โครงสร้างผิด/สิทธิ์ผิดปฏิเสธแบบไม่เขียนบางส่วนหรือเพิ่ม revision;
  font reference ที่ผิดความพร้อมแต่โครงสร้างถูกต้องต้อง save/read กลับได้.
- [ ] ส่ง save receipt แยกจาก readiness พร้อม issue code/path/reason/remedy;
  รวมปัญหาระดับ style และตำแหน่งอักษรอย่างมีขอบเขต ไม่เปิดเผย filesystem path/credentials.
- [ ] preview/generation ตรวจ revision และข้อความจริงก่อนรับงาน แล้ว pin font snapshot
  ให้ worker ใช้ชุดเดียวกัน; ตรวจ bytes อีกครั้งเมื่อใช้จริงและไม่ resolve latest ระหว่างงาน.
  บันทึกตัวสร้าง/ไฟล์ที่ใช้ รวม recovery/retry โดยไม่ย้ายไปฟอนต์อื่น;
  issue ของฟอนต์ต้องผ่าน render-child/render กลับมาถึง client โดยไม่ถูกกลืนเป็น error ทั่วไป.

**ตรวจ:** draft มีปัญหาฟอนต์ยังบันทึกได้แต่ไม่มี PDF ที่ผิด;
ผลเก่าไม่รับรอง revision/ข้อมูลใหม่, preview กับ generation ใช้กฎเดียวกัน,
activation/default/retirement ที่เกิดระหว่าง queue ไม่เปลี่ยนไฟล์ของงาน,
ไฟล์หายหลังรับงานต้องล้มอย่างชัดเจน. Legacy draft/version/identity ยังอ่านและทำงานตามข้อยืนยันเดิม.

### ช่วง 4 ทำการตรวจและออกใช้หกสถานะ

Service เพิ่มคำสั่งผู้ดูแล/transport ที่ตกลง โดยใช้ Core จากช่วง 2 และ snapshot จากช่วง 3.
เพิ่มกลไก review/activate ใน `src/fonts/` และ tests ของ authorization/transaction.

- [ ] บังคับ transition, revision ของชุด และผลตรวจที่ตรงกับ manifest/hash ปัจจุบัน;
  เตรียม PDF ทดสอบได้เฉพาะทางผู้ดูแล ไม่เปิด normal generation ให้รุ่นเตรียม.
- [ ] ตรวจปกติ 400 และทุก face ก่อน activate ทั้งชุด; เปิดใช้/ตั้ง default แบบ atomic.
  แก้ชุดเตรียมให้ invalidate ผลที่ได้รับผล ไม่อนุมัติด้วยผลจากชุดเก่า.
- [ ] ทำ retirement/reactivation, default replacement/clear, audit และ deletion guards;
  รุ่นออกใช้แล้วแก้สมาชิกไม่ได้ ไฟล์ร่วม/ข้อมูลอ้างอิงเดิมไม่ถูกลบตามรุ่น.

**ตรวจ:** ทั้งหกสถานะและ transition ที่ห้าม; user ปกติ activate/import ไม่ได้;
review ชนกับการแก้ชุดต้องไม่ผ่านผิดชุด, เปิดใช้สองครั้งไม่สร้างสองรุ่น,
ไม่มีปกติ 400 หรือมี face ไม่ผ่านทั้งชุดยังออกใช้ไม่ได้;
retire ไม่เปลี่ยนเอกสารเดิมและต้องจัดการ default ชัดเจน, restore ไม่เปิดให้แก้รุ่นเดิม.

### ช่วง 5 เชื่อมเครื่องมือผู้ดูแลและผู้เขียนเอกสาร

FlowDocMake ใช้ catalog/readiness API จาก Service; ไม่ทำสิทธิ์ admin ผ่าน token authoring โดยปริยาย.
Service เป็นเจ้าของ CLI/API ผู้ดูแล; Project Control เป็นเจ้าของ FlowDocMake adapter.
หน้าจอ admin และการเชื่อม Editor อีกสายเลื่อนไปภายหลังตามเจ้าของยืนยัน.

- [ ] เพิ่มการอ่าน catalog และ readiness ผ่าน HTTP/MCP adapter และ schemas ที่ตรงสัญญา;
  ทดสอบจริงกับ Service พร้อมแยกสิทธิ์อ่าน/นำเข้า/ออกใช้.
- [ ] เครื่องมือผู้ดูแลคืนชุดเตรียม ความต่างน้ำหนักสามค่า ผลตรวจ และหกสถานะ;
  เครื่องมือผู้เขียนอ่านรุ่นที่มีสิทธิ์เลือก บันทึกรุ่นจริง และคืน save/readiness แยกกัน.
- [ ] คืนตำแหน่งปัญหาและคำแนะนำเลือกแก้ และทดสอบ retained reference ตามกติกาช่วง 0;
  ไม่ผูก preview font จากเครื่องผู้ใช้แทนไฟล์ที่ Core ใช้.

**ตรวจ:** API/CLI/MCP ให้ผลตรงกัน; ไม่มี italic/bold-italic ให้เลือกปลอม;
ปัญหาซ้ำไม่ท่วมผลตอบกลับและ draft กลับมาแก้ได้; stale revision ไม่ถูกเขียนทับ.
ทดสอบ user flow กับ runtime จริง ไม่ใช้ mock เป็นหลักฐานจบการเชื่อมต่อ.
ปรับ package compatibility และคู่มือ FlowDocMake ตามรุ่น Core/Service ที่สร้างจริง
พร้อมรักษาการอ่านตามช่วง; ห้ามแก้เลขรุ่นเพื่อหลอก preflight โดยไม่มี proof.
ตรวจรับ CLI/API/MCP ตามขอบเขตนี้; ไม่ใช้ผลผ่านแทนหลักฐานว่ามีหน้าจอจัดการคลังแล้ว.

### ช่วง 6 ตรวจร่วมและเตรียมส่งมอบ

Authority: verification ต่อ candidate ที่ตรึงแล้ว; ซ่อม source กลับเจ้าของช่วงที่เกี่ยวข้อง.

- [ ] ทดสอบรับเข้าจากโฟลเดอร์ผู้ใช้ในพื้นที่ทดสอบ ตรวจซ้ำ ยืนยันน้ำหนักที่ขัดกัน
  ตรวจทุก face ในชุดที่เลือกออกใช้ แล้วสร้าง PDF ไทย/อังกฤษจากหลายตระกูลในเอกสารเดียว.
- [ ] ทดสอบวงจรเพิ่มรูปแบบเป็นรุ่นใหม่ เปลี่ยน default, retire/restore, retry/restart,
  ไฟล์หาย/hash ผิด และเอกสาร Sarabun เดิม; ไม่มีการแก้ฐานหรือ draft ผู้ใช้จริง.
- [ ] ตรวจทุกหน้าใน PDF ตัวอย่าง พร้อมข้อความ/อักษรซ้อน/เส้นฐาน/การตัดบรรทัด/ไฟล์ที่ฝัง;
  เชื่อมเกณฑ์ spec กับผลตรวจและขอบเขตที่ยังไม่ผ่าน ก่อนส่งเจ้าของตัดสินใจใช้รุ่นใหม่.

**ตรวจรับ:** เป็นวงจรจริงตั้งแต่ admin ถึง saved draft/job/PDF พร้อม immutable font identity;
ไม่มี unresolved ที่จำเป็นต่อขอบเขตส่งมอบ. ผล parser 29 ไฟล์ไม่เท่ากับ 29 face ผ่าน PDF;
รายงานแยกจำนวนรับเข้า จำนวนออกใช้ และจำนวนที่ตรวจ PDF แล้ว.
ตรวจ packed Core, real DB/API และ actual FlowDocMake preflight ของ release ที่จะส่งมอบ.
การทดสอบผ่านไม่อนุญาต deploy/เปลี่ยน default ของระบบใช้งานจริงโดยอัตโนมัติ.

## จุดในโค้ดและคำสั่งตรวจสำหรับเติมงานย่อย

เส้นทางอ้างจาก Project Control; ไฟล์ใหม่ของช่วงหลังต้องยืนยันในช่วง 0.
คำสั่งด้านล่างเป็นชุดตรวจเมื่อพัฒนา ไม่ใช่ผล PASS ในงานจัดทำแผนนี้.

| ส่วน | ไฟล์เดิมที่กระทบ |
| --- | --- |
| Core contract | `../flowdoc-core/src/composition/resolvedDocument.ts`, `src/template/validateTemplate.ts`, `src/template/sectionOwnership.ts`, `src/composition/validateResolvedDocument.ts` |
| วัด/จัดหน้า | Core `src/layout/measureText.ts`, `measurePageFieldText.ts`, `pageBands.ts`; ตรวจ caller อื่นที่เลือก font ID ด้วย |
| Runtime/ฝัง PDF | Core `src/runtime/exportResources.ts`, `loadResources.ts`, `textRuntime.ts`, `cacheTextRuntime.ts`, `subsetFonts.ts`, `runtime/python/fontSubset.py` |
| Draft/API/tools | Service `src/authoring/service.ts`, `adapter.ts`, `src/templates/contract.ts`, `assembly.ts`, `storage.ts`, `src/http/authoring.ts`, `src/tools/authoring.ts` |
| Job/worker | Service `src/jobs/types.ts`, `admission.ts`, `repository.ts`, `processor.ts`, `render.ts`, `render-child.ts` |
| Storage/deploy package | Service `migrations/`, `src/storage/resource-files.ts`, `src/cli.ts`, `package.json`, `vendor/`; Core `scripts/buildResourceManifest.mjs`, `scripts/checkPackedConsumer.mjs` |
| FlowDocMake | `plugins/flowdocmake/scripts/compatibility.mjs`, `server.mjs`, packaged skill/references ตามผลสัญญา |

- Core: `npm run build`, `npm test -- <affected test paths>`, `npm run check:package`.
  ใช้ `tests/resources.test.ts`, `tests/subsetRequest.test.ts`, `tests/runtime/cacheTextRuntime.test.ts`,
  `tests/template/validateTemplate.test.ts`, `tests/layout/pageBands.test.ts` และ tests ใหม่ตามสัญญา.
- Service: `npm run build`, `npm test -- <affected test paths>` ในฐานทดสอบแยก;
  ใช้ `tests/authoring.test.mjs`, `authoring-adapter.test.mjs`, `authoring-tools.test.mjs`,
  `current.test.mjs`, `jobs.test.mjs`, `queue-admission.test.mjs`, `processor.test.mjs` และ tests ใหม่.
  `npm run check:database` / `npm run check:api` สำหรับจุดตรวจ migration/package/API ที่กระทบ.
- Project Control/FlowDocMake: focused `tests/flowdocmake*.test.mjs`,
  `npm run check:data`, link/hash checks และ `node tools/check-flowdocmake.mjs` หลังติดตั้งรุ่นที่ตรวจแล้ว.
  ไม่ใช้ wildcard path ที่ shell ไม่รองรับ ต้องส่งรายชื่อ test จริงตอนลงมือ.

## Review Focus และความครบของหลักฐาน

| ความเสี่ยงสำคัญ | จุดพิสูจน์ |
| --- | --- |
| ชื่อเหมือน/ไฟล์ต่าง/ค่าต้นทางต่างทำให้ overwrite หรือจับคู่ผิด | ช่วง 1: concurrent dedup, conflict review และ immutable hash |
| ผล review เก่าหรือสิทธิ์ authoring ถูกใช้ activate ผิดชุด | ช่วง 4: manifest/revision race, admin authorization และ idempotency |
| ปนฟอนต์ใน cache/worker หรือ default ใหม่เปลี่ยนงานเก่า | ช่วง 2–3: multi-font identity, queued snapshot และ worker failure |
| การยอม draft มีปัญหาทำให้ข้อมูลเสียถูกบันทึกหรือ PDF ผ่านทั้งที่ผิด | ช่วง 3: atomic reject/save-with-issues และ actual-input readiness |
| Legacy/UI ดูเหมือนรองรับแต่ใช้ Core คนละสาย/ฝังไฟล์คนละตัว | ช่วง 0, 2, 5–6: ownership, Sarabun parity, real consumer และ visual proof |

Spec ข้อ 1–5 ครอบคลุมในช่วง 0–1/4; ข้อ 6–7 ในช่วง 2–3/5;
ข้อ 8–9 ในช่วง 4/6; ข้อ 10 ในช่วง 3/5; สัญญาจากช่องว่างข้อ 11 ปิดในช่วง 0 แล้ว.
ทุก implementation task ต้องเริ่มจาก failing test ของพฤติกรรมที่เป็นเจ้าของ
แล้วแก้ขั้นต่ำ ตรวจผลและ affected consumers ก่อน commit. ใช้ผลเดิมซ้ำเฉพาะเงื่อนไขไม่เปลี่ยน.
ก่อนเริ่มช่วงใหม่ตรวจ base/ownership/หลักฐาน prerequisite; หยุดเมื่อ acceptance ของช่วงผ่าน.
ถ้าพบข้อจำกัดจริงหรือ scope ขยาย ให้กลับทบทวนสัญญา ไม่แก้ข้าม owner หรือข้าม gate.

## จุดเริ่มถัดไป

ช่วง 0 ปิดรายละเอียดแล้ว; เริ่มช่วง 1 ใน Service ตาม acceptance/ขอบเขตที่ระบุเมื่อเดินงานพัฒนาต่อ.
การปิดช่วง 0 ไม่ใช่ผลตรวจรับ runtime หรือเหตุให้ข้าม tests ของช่วง 1–6.
ถ้าจะใช้ห้อง WORK แยกจริง ต้องตั้งรอบและ return controls ตาม Project Control ก่อนส่งงาน;
แผนนี้ไม่สร้าง registry/locator/สิทธิ์ส่งข้อความแทนผู้ใช้.
