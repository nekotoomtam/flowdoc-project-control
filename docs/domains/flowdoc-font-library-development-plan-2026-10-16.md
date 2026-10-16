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

- [ ] ระบุสัญญา TextStyle ใหม่ รูปแบบยังไม่เลือก ช่วงน้ำหนักและ schema/model version
  รวม rule สำหรับ reference ชนิดถูกต้องแต่ยัง resolve ไม่ได้ กับ reference ผิดโครงสร้าง.
- [ ] กำหนด catalog/release/face/asset/import-audit และผล readiness ที่แยกจาก save receipt;
  เขียนตัวอย่างผ่าน/ไม่ผ่านและ issue code/path ที่ clients ใช้ร่วมกัน.
- [ ] ระบุ interface: ตรวจไฟล์ → ชุดเตรียม → review snapshot → เปิดใช้ →
  resolve style → font snapshot ของ job → Core; ให้ชื่อ/type/สิทธิ์แน่นอนก่อนเขียนงานย่อย.
- [ ] ยืนยันสิทธิ์ผู้ดูแล ขอบเขต API/CLI/MCP และ owner ของหน้า admin/ตัวเลือกฟอนต์.
  แยกการเลือก UI ใหม่กับการแก้ Editor อีกสาย; ไม่เพิ่ม frontend ใหม่โดยปริยาย.
- [ ] ตัดสินกรณีคัดลอกเอกสารที่อ้างรุ่นเลิกให้เลือก: new reference หรือ retained reference;
  กำหนดผลเมื่อ restore/ไฟล์ไม่พร้อมและการอนุมัติทดสอบรุ่นเตรียมที่แยกจาก normal PDF.
- [ ] ทำชุดข้อทดสอบตัวอย่าง: Sarabun เดิม, IBM/Pridi, น้ำหนักต่างจากต้นทาง,
  มี/ไม่มี italic, ขาด glyph, invalid structure, stale revision, สิทธิ์ไม่พอ.

**ตรวจรับ:** แต่ละกรณีบอกได้ว่า save/PDF/activate ผ่านหรือไม่ ใช้รุ่น/ไฟล์ใด และใครเป็นเจ้าของ;
ไม่มีสัญญาหรือ owner สำคัญที่ผู้ลงมือต้องเดา. ผลใหม่ที่เปลี่ยนข้อตกลงกลับให้เจ้าของทบทวน.
เติม exact interface, รายชื่อไฟล์ใหม่และคำสั่ง test ของช่วง 1–5 ในแผนก่อนอนุญาต implementation.
ไม่ใช้การเขียน API ตัวอย่างหรือ migration ทดลองเป็นวิธีข้ามช่วง discovery.

#### ผลเริ่มช่วง 0 — 2026-10-16

สถานะ: ตรวจทางเชื่อมและร่างสัญญาด้านล่างแล้ว; เหลือทบทวนสัญญารอบสุดท้ายก่อนปิดช่วง 0.
เป็นข้อเสนอทางเทคนิคสำหรับพัฒนา ไม่ใช่ API ที่เรียกใช้ได้ใน 0.3.0.
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

**ร่างสัญญาเอกสาร:** ใช้ schemaVersion=2 สำหรับโครงสร้างใหม่ แต่คง nodeModelVersion=18
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
read-only v1 ใช้ legacy binding ที่ผูก hash ของ Sarabun สี่ไฟล์ ไม่แก้ payload;
คำสั่งแปลงเป็น v2 ต้องสร้าง revision ใหม่และยังคงตัวตน template ตามกติกา Service.

**ร่างข้อมูลคลัง:** รหัส entity เป็น UUID; hash เป็น SHA-256 ของ bytes; เวลาเป็น UTC.
ทุก entity มี createdAt; รายการแก้ได้มี updatedAt/revision; event เป็น append-only.

| Entity | field หลัก/ข้อบังคับ |
| --- | --- |
| FontFamily | id, displayName, internalNames, sourceIdentity, defaultReleaseId nullable; ชื่อไม่ unique key |
| FontAsset | id, sha256 unique, byteLength, format='ttf-static', storageKey, parsedMetadata, coverageDigest; bytes immutable |
| FontRelease | id, familyId, version, state, revision, manifestDigest, everActivatedAt nullable; unique(familyId,version) |
| FontFace | id, releaseId, assetId, rawWeight, sourceWeight nullable, approvedWeight, style, sourceEvidenceId; unique(releaseId,approvedWeight,style) |
| FontSourceEvidence | id, provider, locator, retrievedAt, metadataHash, fileHashBinding, licenseAssetIds, conflictResolution; ตรวจสิทธิ์/ที่มาแยกจาก dedup |
| FontReview | id, releaseId, manifestDigest, rendererIdentity, testSuiteDigest, results, reviewedBy, reviewedAt; ผลผูก input ที่ตรวจจริง |
| FontAuditEvent | id, actor, at, action, reason, releaseId nullable, requestId, before/after digest, outcome; ไม่เก็บ credential |

state codes: preparing / in_review / needs_changes / ready / active / retired ตามหกสถานะใน spec.
approvedWeight ต้องกำหนดก่อนส่ง review; ข้อมูลขัดกันคง preparing/needs_changes.
manifest ครอบคลุม face bindings, hashes, ที่มา/ใบอนุญาต และขอบเขตภาษา;
activated content แก้ไม่ได้ แม้เปลี่ยนสถานะกลับมา. เก็บ asset license แยก ไม่ใช้ OFL ของ Sarabun แทนทุกไฟล์.

**ร่าง interface:** ชื่อด้านล่างเป็น service/domain methods; route/CLI adapter ต้องเรียกกฎชุดเดียวกัน.
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
ข้อจำกัด file bytes/count/parse timeout ต้องกำหนดตัวเลขและ negative tests ก่อนเริ่ม intake implementation.

**ร่าง readiness:** save receipt ยืนยัน saved revision แยกจาก
`{status:'ready'|'blocked'|'incomplete', definitionFingerprint, inputFingerprint?, issues}`.
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

**ร่าง snapshot/retention:** FontSnapshot มี version=1, definition/input fingerprints,
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
`{requestId,expectedRevision,reason,...actionFields}` และคืน `{receipt,release,revision}`.
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
| POST /admin/fonts/reviews/:id/run | runner ตรวจ snapshot จริง → needs_changes หรือ ready สำหรับรุ่นใหม่; reactivation คง retired และเก็บผล review แยก; client ส่ง PASS แทนไม่ได้ |
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
review-run, activate, retire, reactivation-review, default-set, release-delete, show.
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

แต่ละแถว Service ตรวจ `npm run build` แล้ว `npm test -- tests/<ชื่อไฟล์ในแถวนั้น>`
โดยส่งทุก path แยกจริง ไม่ส่ง placeholder. ตัวอย่างช่วง 1:
`npm test -- tests/fonts-intake.test.mjs tests/fonts-repository.test.mjs` ใน isolated DB.
ช่วง 2: `npm run build`, `npm test -- tests/fonts/selection.test.ts tests/fonts/legacy.test.ts`
ร่วม tests เดิม resources/subset/cache/template/pageBands/PDF ที่ได้รับผล และ `npm run check:package`.
ช่วง 3 ต้องรวม `authoring.test.mjs`, `authoring-adapter.test.mjs`, `jobs.test.mjs`, `processor.test.mjs`;
ช่วง 4 รวม `npm run check:database`/`npm run check:api` หลัง build และพร้อม prerequisites.
parser dependency ต้อง pin ใน Service image ตอน build และ COPY helper; ไม่ติดตั้งตอน import/render.

**จุดทบทวนก่อนปิดช่วง 0:** ตรวจว่าการเพิ่ม schemaVersion=2 ไม่ทำให้ strict validator,
assembled current/version snapshot หรือ packed public API รับเพียงครึ่งทาง; ทบทวน
clone authorization/idempotency + inherited binding transaction ว่าต้อง persist อะไรเพิ่ม;
และทำ field-level request/response fixtures ของ transport ด้านบนก่อน implementation.
ตารางนี้กำหนดขอบเขตแล้ว แต่ยังไม่ทำเครื่องหมาย checklist ว่าผ่านแทนการทบทวนดังกล่าว.

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
ข้อ 8–9 ในช่วง 4/6; ข้อ 10 ในช่วง 3/5; ช่องว่างข้อ 11 ต้องปิดในช่วง 0.
ทุก implementation task ต้องเริ่มจาก failing test ของพฤติกรรมที่เป็นเจ้าของ
แล้วแก้ขั้นต่ำ ตรวจผลและ affected consumers ก่อน commit. ใช้ผลเดิมซ้ำเฉพาะเงื่อนไขไม่เปลี่ยน.
ก่อนเริ่มช่วงใหม่ตรวจ base/ownership/หลักฐาน prerequisite; หยุดเมื่อ acceptance ของช่วงผ่าน.
ถ้าพบข้อจำกัดจริงหรือ scope ขยาย ให้กลับทบทวนสัญญา ไม่แก้ข้าม owner หรือข้าม gate.

## จุดกลับมาคุยก่อนลงมือ

ทบทวนลำดับและขอบเขตแผนนี้ แล้วเลือกวิธีทำงาน; ข้อเสนอคือทำตามช่วงในแชตนี้.
จุดเริ่มถัดไปคือช่วง 0 เพื่อปิดสัญญาและเติมงานย่อย ไม่เริ่มเปลี่ยน DB หรือ Core ทันที.
ถ้าจะใช้ห้อง WORK แยกจริง ต้องตั้งรอบและ return controls ตาม Project Control ก่อนส่งงาน;
แผนนี้ไม่สร้าง registry/locator/สิทธิ์ส่งข้อความแทนผู้ใช้.
