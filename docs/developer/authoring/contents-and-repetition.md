# สารบัญ ลิงก์ และการทำซ้ำ

Authority Boundary: Project Control reference สำหรับ Area18 และ Section19 Stage3 ตาม [baseline](README.md).
บทนี้อธิบายการประกอบความสามารถ ไม่ใช่การสร้างข้อมูลหน้าคงที่จาก PDF.

Candidate19ช่วง3: TOC ต้องเพิ่ม `props.scope:{kind:"section"}` หรือ
`{kind:"document"}`. section หมายถึงเจ้าของ node; หนึ่งต่อ Section และหนึ่งต่อ
เอกสารอยู่ร่วมกันได้ แต่ scope ซ้ำหลังเลือก Format/ขยาย Area ไม่ผ่าน.
Clone ใช้ Section ID ใหม่และคง scope ตามเจ้าของใหม่. Scope ว่างไม่เพิ่มหน้า;
ถ้าทั้งเอกสารไม่มีเนื้อหาจัดหน้าให้ error ไม่สร้าง PDF ว่าง.
เลขตาม continue/restart/exclude ของหน้าเป้าหมาย: hide ยังมีเลขใน TOC,
exclude คงลิงก์ชื่อโดยไม่มีเลข. จัดหน้าเพียงหนึ่ง pass เพราะกันช่องเลขกว้างคงที่
แล้วเติมภายหลังโดยไม่ reflow; เลขล้นช่องให้ error. ตัวอย่างด้านล่างเป็น baseline18.

## 1. สารบัญอัตโนมัติต้องมีสามส่วน

1. หัวข้อจริงในเนื้อหาเป็น text-block มี anchorId ที่ไม่ซ้ำ.
2. หัวข้อที่ต้องการเข้าสารบัญมี `toc:{level:1|2|3}`.
3. วาง node `table-of-contents` ในตำแหน่งสารบัญ.

```json
{"id":"contents","type":"table-of-contents","props":{"textStyleId":"body"}}
```

```json
{"id":"chapter-heading","type":"text-block","role":{"role":"paragraph"},
 "props":{"textStyleId":"heading","anchorId":{"scope":"local","key":"anchor"},"toc":{"level":1}},
 "children":[{"id":"heading-value","type":"field-ref","scope":"local","key":"title"}]}
```

Format.inputSchema ต้องประกาศ `anchor` และ `title` เป็น string Required;
request แต่ละ entry ส่ง anchor คนละค่า เช่น chapter-overview, chapter-requirements.
การ clone node ID ของระบบไม่ใช่ใบอนุญาตให้ anchorId จากข้อมูลซ้ำภายใน Section19
เดียวกัน (model18ตรวจทั้งเอกสาร). คนละ Section19 ใช้ anchor ท้องถิ่นชื่อเดียวกันได้.
Anchor เป็น identity ปลายทาง ไม่ใช่ชื่อ heading ที่เปลี่ยนตามภาษา.

ระบบเก็บ heading ตามลำดับเนื้อหาที่ compose แล้ว รวม heading ที่อยู่ใน cell;
ไม่เรียงใหม่ตามชื่อ. Cover ถูกยกเว้น. ชื่อหัวข้อถูกสร้างจาก inline text/link label
โดยรวม whitespace; หัวข้อว่างใช้ไม่ได้. ไม่มีปุ่มให้ใส่เลขหน้าของ PDF ต้นฉบับ.
ไม่ใช้ `toc-list` เป็นตารางข้อความแทน เพราะไม่มีเลขหน้า/ลิงก์อัตโนมัติ.

## 2. ขอบเขตรูปแบบสารบัญปัจจุบัน

- รองรับระดับ1–3; ระดับ4ไม่ผ่าน validator.
- node props มีเพียง textStyleId; ชื่อ “สารบัญ” ใส่ text-block แยกก่อน node.
- Runtime ย่อหน้าต่อระดับ12pt, ช่องว่างก่อนเลขหน้า12pt, ช่องเลขหน้า36pt.
  เป็นค่าระบบปัจจุบัน ไม่ใช่ properties ที่ปรับผ่าน JSON ได้.
- ชื่อแต่ละรายการเป็น internal reference ไป anchor และเลขหน้าผูกกับผล layout.
- อย่าวางหลายสารบัญใน fragment; validatorจำกัดหนึ่ง และไม่ควรคาดเดาว่าสารบัญ
  หลายจุดคนละfragmentใช้แยกหมวดได้ถ้าไม่ได้ทดสอบทั้งเอกสาร.
- หัวข้อ continuation หรือรหัส requirement ย่อยไม่ควรติด toc เพียงเพราะใช้ heading style.
  Style และความเป็นรายการสารบัญเป็นคนละการตัดสินใจ.

## 3. ทดสอบว่าสารบัญทำงานจริง

Baseline: สองบท มี page-break ก่อนบทสอง → ตรวจชื่อ เลขหน้า และกด link.
เพิ่มข้อความ/แถวก่อนบทสองจนขึ้นหน้าเพิ่ม → เลขหน้าบทสองต้องเปลี่ยนตาม PDF.
เปลี่ยน title → สารบัญต้องเปลี่ยนตาม. เพิ่มบท → มีรายการเพิ่มหนึ่งรายการ.
ส่ง anchorซ้ำ → ต้องพบ error ไม่ใช่ลิงก์ไปหัวข้อผิดแบบเงียบ.
ตรวจเลขหน้าใน footer เทียบกับ numbering policy ไม่ใช้ PDF index อย่างเดียว.
หลักฐานทั้งชื่อ198รายการโดยไม่มีเลขหน้าไม่ผ่าน acceptance สารบัญ.

## 4. Link variables

```json
{"documentation":{"type":"link","required":true}}
```

อยู่ภายใน ObjectSchema.fields. Request:

```json
{"documentation":{"type":"link","text":"คู่มือ","url":"https://example.com/manual"}}
```

อ่านด้วย field-ref. หากจะผูกชื่อและURLจากคนละ string ให้ใช้ inline type:link
พร้อม ScalarBinding ของ text/url. ลิงก์ภายในใช้ reference/target ไม่ใช่ URLปลอม.
Anchor ที่ประกาศกับ target ที่อ้างต้องตรงกันหลัง compose; missing/duplicate
destination เป็น INVALID_DATA. เห็นข้อความลิงก์ใน PDF อย่างเดียวไม่พิสูจน์ปลายทาง.

## 5. repeats — หนึ่งรายการต่อหนึ่งแถว

```json
{"tableId":"req-table","rowTemplateId":"req-row","source":{"scope":"local","key":"requirements"}}
```

source key ต้องเป็น array schema. tableId ต้องเป็น tableจริงและ rowTemplateId
อยู่ใน rowIds ของ table. ห้ามเลือกแถวหัวตาราง; ห้ามประกาศ repeatซ้ำให้แถวเดียว.
ภายใน cell ของแถวนี้อ่าน `item.code`, `item.description` ผ่าน scope:item/key
ไม่เขียน `key:"item.code"`.
Scope source ใช้ global/section/local ตามเจ้าของ fragment;
authored Section ไม่มี local ของ Format.
arrayว่าง → ไม่มีแถวข้อมูลที่ขยายออกมา แต่แถว static ก่อน/หลังยังอยู่.

## 6. cellRepeats — หลายข้อความ/ภาพใน cell เดียว

```json
{"id":"attachments-repeat","cellId":"attachments-cell",
 "childTemplateIds":["attachment-label","attachment-image"],
 "source":{"scope":"local","key":"attachments"}}
```

childTemplateIds ต้องเป็นช่วงที่ติดกันใน cell.childIds, ไม่ว่างและไม่ซ้ำ,
childเป็น text-block/image. แต่ละ item ขยายชุด children ตามลำดับ.
ห้ามใช้ใน cell ของแถว header/row repeat และห้ามหลาย cellRepeatแย่ง cellเดียวกัน.
นี่ไม่ใช่การทำซ้ำทั้งแถว และไม่ใช่ tableซ้อน. item image field ใช้ได้เมื่ออยู่ใน
บริบท itemที่ประกาศจริง; อย่าใช้ Arrayของresource UUIDเปล่าแทน object items.

## 7. rowGroups — กลุ่มกับสมาชิก

ข้อมูลตัวอย่าง:

```json
{"companies":[{"name":"บริษัท ก","members":[{"name":"คนที่หนึ่ง"},{"name":"คนที่สอง"}]},
 {"name":"บริษัท ข","members":[]}]}
```

ประกาศบริษัทเป็น array.items object; members เป็น arrayซ้อนชั้นที่สอง.
แถวชื่อบริษัทอ่าน scope:group/key:name; แถวคนอ่าน scope:item/key:name.

```json
{"id":"companies","tableId":"meeting-table",
 "rowTemplateIds":["company-row","labels-row","member-row","empty-row"],
 "source":{"scope":"local","key":"companies"},
 "memberRepeat":{"rowTemplateId":"member-row","source":{"scope":"group","key":"members"},
 "emptyRowTemplateId":"empty-row"},"pagination":{"keepStart":true}}
```

| Field | Required / ความหมาย |
| --- | --- |
| id | Required, ไม่ซ้ำกับประกาศ repeatอื่นที่เกี่ยวข้อง |
| tableId | Required; tableจริง |
| rowTemplateIds | Required; ชุดแถวต่อเนื่องของกลุ่มใน rowIds ไม่ใช่หัวตาราง |
| source | Required; arrayกลุ่มใน global/section/local |
| memberRepeat.rowTemplateId | Required; แถวสมาชิกในชุด |
| memberRepeat.source | Required; scope:group และ keyของ nested array |
| memberRepeat.emptyRowTemplateId | Required; แถวสำรองเมื่อสมาชิกว่าง |
| pagination.keepStart | Optional boolean; ตั้ง true เมื่อต้องรักษาชื่อกลุ่มกับจุดเริ่มสมาชิก |

ต้องมีอย่างน้อย3แถวในrowTemplateIds; memberต้องเป็นแถวรองสุดท้ายและemptyแถวสุดท้าย.
ต้องมี member และ empty template ในกลุ่ม; อย่าใส่แถวเดียวกันทั้ง repeats และ rowGroups.
Empty group ยังแสดงชื่อบริษัทและempty row ไม่ใช่หายทั้งกลุ่ม.
keepStart ไม่ใช่ keepTogetherทั้งกลุ่ม และไม่มี recursive groupไม่จำกัดระดับ.
ใช้ [ตัวอย่าง grouped](../../examples/ai-template-authoring/grouped-template.json)
คู่กับ [request](../../examples/ai-template-authoring/grouped-request.json) ซึ่งผ่าน
validatorจริงเป็นฐาน แทนการเดาลำดับ rowTemplateIds.

## 8. เลือกโครงข้อมูลให้แก้ต่อได้

| ความหมาย | วิธีเก็บที่เหมาะ |
| --- | --- |
| ผู้เข้าร่วมเพิ่มลดรายคน | members[] + rowGroups ไม่ใช่ participants:stringก้อนเดียว |
| แถว Requirement | requirements[] + repeats |
| ไอคอนประเภท | type/codeในข้อมูลและimage bindingตามสัญญา ไม่เดาจากข้อความ |
| รูปหลายใบใน cell | array of objects + cellRepeats |
| รายการสารบัญ | ให้ระบบ deriveจากheading ไม่ให้APIส่งสำเนารายการชื่ออีกชุด |
| รุ่นเอกสารใช้หลายหน้า | global.documentVersion + field-ref |

เก็บ source mapping เมื่อกู้ข้อมูลจากPDF: หน้า/หัวข้อ/field/ค่าที่กู้/ความมั่นใจ.
ถ้าPDFมีไอคอนแต่JSONไม่มี ต้องตรวจว่ากู้ประเภทจากPDFได้หรือไม่ ไม่สรุปว่าไม่มี
ความสามารถเพียงเพราะJSONเดิมไม่มีfield. แต่ห้ามสร้างข้อมูลประเภทขึ้นเองโดยไม่มีหลักฐาน.
