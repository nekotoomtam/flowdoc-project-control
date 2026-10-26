# โครงสร้าง Template และตัวแปร

งานสร้างโครงและตัวอย่างใหม่ใช้ **Model19 (Section19 Stage3)**;
Model18 เก็บไว้เฉพาะซ่อม/อ่านงานเดิมที่ระบุให้คงรุ่น18 ไม่ใช่ตัวเลือกเริ่มงานใหม่.
ดู [คู่รุ่น/ขอบเขต DOCX](verification.md). การเปลี่ยนคู่มือไม่เปลี่ยนรุ่นติดตั้ง.

Section19 Stage3 ใน FlowDocMake 0.3.0 / Service 0.5.0 / Core 0.5.0
(เริ่มใน candidate `0.4.2-dev.3`): ใช้ `sections[]` พร้อม UUID `id`, `label`,
`nameBase`; ไม่มี Section.key/formats. Request ส่ง `sections:[{id,data,header?,footer?}]`
ครบทุก saved ID และพิมพ์ตาม definition order. เปลี่ยนชื่อ/ลำดับคง ID;
clone/import/แยกสำเนาสร้างใหม่ก่อนบันทึก ไม่ต่อโครงใน generation request.
รายละเอียดเฉพาะนี้ดู [สัญญา Section–Area](../../domains/flowdoc-area-document-transition-2026-10-14.md).
ช่วง2 ให้ text-block `heightMode:fixed` ใน Format ของ Area ที่วางตรง flow หลัก
ของ Section ได้; ห้ามใน cell/repeat/Area ซ้อน. ข้อความต้องพอดีกรอบและกรอบต้องพอดี
พื้นที่ body ที่เหลือ; overflow ล้มเหลว ไม่ตัด/ย่อ/เลื่อนหน้าให้กรอบอัตโนมัติ.
ปกเป็นองค์ประกอบภายใน Section; ตั้ง headerMode/footerMode `continuation` เพื่อ
ซ่อนหัว–ท้ายหน้าแรก แต่ยังนับหน้านั้น. Area เปลี่ยน pageLayout/หัว–ท้ายไม่ได้.
ช่วง3 ให้ TOC ระบุ `props.scope:{kind:"section"}` (Section เจ้าของ node) หรือ
`{kind:"document"}`; หนึ่งต่อ Section และหนึ่งต่อเอกสารอยู่ร่วมกันได้.
scope ซ้ำหลังขยาย Area ไม่ผ่าน; scope ว่างไม่สร้างหน้าว่าง.
เลขและลิงก์ตาม numbering ของหน้าเป้าหมายจริง ไม่กรอกเลขใน data.
ส่วนต่อไปนี้เป็นสัญญา Model19 สำหรับงานใหม่. Model18 เดิมยังอ่านได้ตาม
contract ของรุ่นนั้น แต่ไม่ใช้ object-keyed request หรือ Section.key/formats
มาปนกับ19. ตัวอย่างคู่ที่ใช้ได้จริง: [CLIS template](../../examples/clis-model19/template.json),
[20รายการ](../../examples/clis-model19/request-20.json), [60รายการ](../../examples/clis-model19/request-60.json).

Authority Boundary: Project Control document-authoring reference ของ Area18 และ
Section19 Stage3 สำหรับงานใหม่ และขอบเขต compatibility ของ18;
ข้อกำหนดมาจาก Core/Service ตาม [baseline](README.md) ไม่ใช่ contract ของรุ่นอื่น.

## 1. Template root

| Field | ชนิด / Required | ความหมายและผลเมื่อละ |
| --- | --- | --- |
| schemaVersion | integer `1` หรือ `2`, Required | 1 ใช้ Sarabun เดิม; 2 ใช้คลังฟอนต์ตาม [TextStyle](layout.md#2-textstyle-และความสูงข้อความ) |
| nodeModelVersion | integer `19`, Required สำหรับงานใหม่ | Runtime ยังอ่าน18เดิม; ห้ามผสมโครงสองรุ่น |
| templateId | string, Required | ใช้ ID ที่ create คืนมา ห้ามสร้างเองสำหรับ save |
| docKey | string, Required | key ที่สร้างไว้ ต้องตรงกับ request และ identity |
| version | positive integer, Required | authoring draft ต้องเป็น `1`; ไม่ใช่ revision |
| name | nonblank string, Required | ชื่อโครง |
| book | object, Required | `{contentSlot:"body",defaultPageLayoutId:"normal"}` |
| pageLayouts | object map, Required/nonempty | key → `{label?,page}`; book ต้องอ้าง key ที่มีจริง |
| styles | object map, Required | key → TextStyle; node ต้องอ้าง style ที่มีจริง |
| globalSchema | ObjectSchema, Required | ตัวแปรระดับทั้งเล่ม; ถ้าไม่มีใช้ fields ว่าง |
| sections | Section[], Required/nonempty | ลำดับ Section จริง ไม่ใช่หนึ่งสมาชิกต่อหน้ากระดาษ |
| areaFormats | object map, Optional | หากมี Area ต้องมี Format ของ Area นั้นอย่างน้อยหนึ่งแบบ |
| examples | array, Required | ปกติใช้ `[]`; ถ้ามีเป็น `{name,request}` ชื่อไม่ซ้ำ |

ไม่มี top-level `formats`, `header`, `footer` สำหรับ Model19.
Examples ใน definition ต้องมี request.version ตรงกับ definition.version;
อย่าใส่ uploadId ใน examples เพราะเป็นข้อมูล transport ของ Service.
`page` และ `TextStyle` ดู [Layout](layout.md).

## 2. Section

| Field | ชนิด / Required | ความหมายและข้อจำกัด |
| --- | --- | --- |
| id | UUID string, Required | identity ไม่ซ้ำใน sections; request จับด้วย id |
| label | nonblank string, Required | ชื่อแสดงผล ไม่ใช่เนื้อหาที่เรนเดอร์ |
| nameBase | nonblank string, Required | ชื่อฐานของ Section instance |
| key / formats | Forbidden | เป็น property ของ18 ห้ามใส่ใน19 |
| pageLayoutId | string, Optional | ละแล้วใช้ book.defaultPageLayoutId |
| role | Forbidden | Model19 ไม่ใช้ Section.role; ปกเป็นเนื้อหาภายใน Section |
| source | object, Required | `{kind:"authored",fragment,repeats,cellRepeats?,rowGroups?}` หรือ `{kind:"blank"}` |
| inputSchema | ObjectSchema, Required | ข้อมูลในสมาชิก `request.sections[]` ที่มี id ตรงกัน; Format อยู่ areaFormats |
| header / footer | PageBand, Optional | ถ้าไม่ระบุ ไม่มี band นั้น ไม่สืบทอดจาก Section ก่อน |
| headerMode / footerMode | all/first/continuation/none, Optional | default all; first/continuation อิงหน้าภายใน Section |
| numbering | object, Optional | continue/restart/exclude; ดู Layout |

`source.kind:"content"` ไม่อยู่ในสัญญา Model19.
Section กำหนดกระดาษ/หัวท้าย/การนับหน้า และเนื้อหาอาจไหลหลายหน้า.
อย่าสร้าง Section ใหม่ทุกครั้งที่ต้องการขึ้นหน้า ใช้ `page-break` ในกราฟ.
Blank Section ไม่ใส่ fragment/repeats ใน source.

## 3. Fragment และลำดับ

`Fragment = {rootIds:string[], nodes:Record<string,Node>}`.
rootIds เป็นลำดับเนื้อหาระดับบน; ลำดับ key ใน nodes ไม่ใช่ลำดับแสดงผล.
ทุก node ต้องมี key เท่ากับ `node.id`, ถูกอ้างโดย parent หรือ root เพียงครั้งเดียว,
ไม่มีวงจร ไม่มี node ลอย ไม่มี reference ที่ไม่พบ. IDs ของ node และ inline
ต้องไม่ชนกันภายใน fragment และห้าม `~` ซึ่งระบบใช้สำหรับ identity หลัง compose.

ตารางอ้างลูกด้วย rowIds → cellIds → childIds;
TextBlock ใช้ children เป็น inline object โดยตรง ไม่ใช้ ID ไปชี้ inline ใน nodes.
Fragment ของ authored Section ยอมให้ roots ว่างได้ แต่เอกสารที่ compose แล้วไม่มี
เนื้อหาที่ใช้ได้อาจล้มด้วย EMPTY_CONTENT. อย่าตีความ `[]` ผ่าน schema ว่าออก PDF ได้.

## 4. Area และ Format

ประกาศ Area ใน globalSchema หรือ Section.inputSchema เช่น:

```json
{"type":"object","fields":{"details":{"type":"area","areaId":"main-details","required":true}}}
```

วาง node ณ จุดที่ต้องการขยาย:

```json
{"id":"body-area","type":"area","props":{"areaId":"main-details"}}
```

แล้วประกาศ `areaFormats.chapterDefinition` มี `key:"chapter"`,
`ownerAreaId:"main-details"`, `inputSchema`, `fragment`, `repeats:[]`.
`chapterDefinition` คือ key ของ definition; request ใช้ **`chapter`** ซึ่งเป็น
Format.key ไม่ใช่ key ของ map. key ของ Format ต้องไม่ซ้ำภายใต้ Area เจ้าของเดียวกัน.

| Format field | Required | ความหมาย |
| --- | --- | --- |
| key | yes | ชื่อที่ request เลือก |
| ownerAreaId | yes | Area ที่อนุญาตให้วาง Format นี้ |
| inputSchema | yes | ObjectSchema ของ local data |
| fragment | yes | กราฟที่จะขยายต่อหนึ่ง entry |
| repeats | yes | ใช้ `[]` เมื่อไม่มี row repeat |
| cellRepeats / rowGroups | no | การทำซ้ำเฉพาะชนิด; ดูบทข้อมูลซ้ำ |
| label / description | no | metadata string ไม่เรนเดอร์เอง |

Area แต่ละ areaId ต้องไม่ซ้ำในนิยามตัวแปร และมีตำแหน่งวางตรงเจ้าของ **ครั้งเดียว**.
Section Area ห้ามไปวางใน Section อื่น. AreaFormat.inputSchema ไม่รองรับ Area ซ้อน.
Area ใน cell วางได้แบบจำกัด: ห้ามอยู่หัวตาราง/แถว repeated หรือ cellRepeat;
Format ที่เสียบเข้าไปต้องมี root เป็น text-block/image เท่านั้น ไม่ใช่ตารางซ้อน.

Request:

```json
{"docKey":"my-document","version":1,"data":{},"sections":[
  {"id":"10000000-0000-4000-8000-000000000001","data":{"details":[
    {"format":"chapter","data":{"title":"บทหนึ่ง","requirements":[]}},
    {"format":"new-page","data":{}}
  ]}}
]}
```

Area รับ array ของ `{format,data}` ตามลำดับเท่านั้น ไม่รับ object map แทน array.
Unknown Format หรือข้อมูล entry ไม่ถูกต้องเป็น error หยุดสร้าง ไม่ข้ามเงียบ.

## 5. ObjectSchema และชนิด field ทุกแบบ

ObjectSchema มีเพียง `{type:"object",fields:{ชื่อ:field}}`.
ชื่อ field เป็น nonblank string ไม่มีจุด; ไม่ใช่ JSONPath. ไม่มี arbitrary nested
object field; object ใช้เป็น schema ของชุดข้อมูลหรือสมาชิก array.
ทุก field มี `required?:boolean`, `label?:string`, `description?:string`.

| type | เพิ่มเติมที่ประกาศได้ | ค่าใน request | เมื่อละ field ที่ optional และไม่มี default |
| --- | --- | --- | --- |
| string | default:string, allowEmpty:boolean | string เท่านั้น | `""` |
| image | default:string | resource UUID ที่ upload แล้ว; optional อาจใช้ `""` | `""` |
| link | default:BoundLink | `{type:"url",value}` / `{type:"link",text,url}` / `{type:"reference",text,target}` | ค่าว่างภายใน; ไม่ใช่ link ปลอม |
| array | default:object[], items:ObjectSchema | array ของ object | `[]` |
| area | areaId:string Required, default:AreaEntry[] | array ของ `{format,data}` | `[]` |

**required ตรวจการมี field ก่อน default**: required:true ที่ไม่ส่งมายังเป็น
MISSING_REQUIRED แม้ประกาศ default ไว้. required ไม่ได้แปลว่า string ต้องไม่ว่าง;
ใช้ allowEmpty:false ร่วมกับ required:true หากห้ามข้อความว่าง/ช่องว่างล้วน.
allowEmpty ละแล้วไม่ได้ห้าม empty string. null, number และ boolean ไม่ถูกแปลงเป็น string.
String ต้องเป็น Unicode ที่ถูกต้องและไม่มี control characters ที่ validator ห้าม;
newline/tab ใช้ได้ตาม validation แต่ไม่ใช่คำสั่งขึ้นหน้า.

Array ซ้อนได้ลึก 2 ชั้นใน Model19 (เช่น companies[].members[]);
items ต้องเป็น object schema และไม่ใช่ primitive string[].
Area ไม่อยู่ใน array items. Header/footer schema รับเฉพาะ string/image/link.
Default ต้องผ่านชนิดและ validation เดียวกับค่าปกติ.
Model19 ปฏิเสธ unknown data field เป็น INVALID_DATA; ไม่ละตัวแปรเงียบ.
Section ID ไม่รู้จัก/ซ้ำ/ขาดเป็น SECTION_INPUT_UNKNOWN/DUPLICATE/MISSING.

## 6. Scope และการ binding

| ตำแหน่ง | scope ที่อ่านได้ |
| --- | --- |
| authored Section | global, section; item/group เฉพาะบริบท repeat ที่ประกาศ |
| AreaFormat | global, section ของตำแหน่ง Area, local; item/group เมื่อประกาศ repeat |
| Section.header | global, section, header |
| Section.footer | global, section, footer |

`field-ref` อ่าน string หรือ link field; image ใช้ image.props.source;
array อ่านผ่าน repeat; area อ่านผ่าน area node. ห้าม field-ref ไปยัง array/image/area.
`ScalarBinding` ใน anchor หรือส่วนประกอบ inline link เป็น literal string หรือ
`{scope,key}` ที่อ่าน **string field**; ไม่ใช่ template interpolation.

```json
{"id":"title-value","type":"field-ref","scope":"global","key":"projectName"}
```

ห้าม `key:"company.name"`, `"${projectName}"`, scopeที่ไม่ได้ประกาศ หรือคาดว่า
item จะใช้ได้ทุกที่. ภายใน rowGroups ใช้ group สำหรับบริษัท และ item สำหรับสมาชิก.
หาก Version ต้องตรงกันบนปกและ footer ให้ประกาศ global `documentVersion`
แล้ว bind สองตำแหน่ง อย่าฝัง `Version 3.0` สองที่.

## 7. Request กับ definition เป็นคนละสัญญา

Core Model19 request root รับ docKey, version?, data?, sections (required array).
แต่ละสมาชิกเป็น `{id,data,header?,footer?}`; ส่งทุก saved ID ครั้งเดียว.
ลำดับที่พิมพ์มาจาก definition ไม่ใช่ลำดับใน request. ไม่รับ content หรือสร้าง
Section ใหม่ผ่าน generation request. ข้อมูล header/footer ส่งที่
`sections[i].header` / `sections[i].footer` โดยตรง ไม่ซ้อน `.header.data`.
header/footer ส่งได้เมื่อ Section ประกาศ band นั้นไว้เท่านั้น.
Service preview เพิ่ม uploadId ได้ แต่ validate_template.sampleRequest
ต้องเอา uploadId ออก. ไม่ส่ง prepared_input/sourceMap/resources แบบภายใน.
