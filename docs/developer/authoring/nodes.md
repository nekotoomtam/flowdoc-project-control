# Node และ Inline Reference

Authority Boundary: Project Control reference ของ Area18 และ Section19 Stage3
ตาม [baseline ปัจจุบัน](README.md); ข้อยกเว้นของแต่ละ model ระบุแยกด้านล่าง.
อ่าน [โครงสร้าง](structure-and-data.md) และ [baseline](README.md) ประกอบ.
ทุก node มี id/type Required; property ที่ไม่อยู่ในรายการไม่ใช่ช่อง CSS อิสระ.

## 1. Node catalog และตำแหน่ง

| Node type | Root ของ Section/Format | ภายใน table-cell | Header/footer | หน้าที่ |
| --- | --- | --- | --- | --- |
| text-block | yes | yes | yes | ข้อความ/หัวข้อ; role ยังเป็น paragraph |
| table | yes | no | no | ตารางกริดตามความกว้างคอลัมน์ |
| table-row | ลูก table เท่านั้น | no | no | แถว |
| table-cell | ลูก table-row เท่านั้น | — | no | ช่องและ content stack |
| image | yes | yes | yes | ภาพจาก resource ในกรอบ |
| line | yes | no | yes | เส้นแนวนอน |
| page-break | yes ใน Area18 | no | no | ขึ้นหน้าอย่างชัดเจน |
| area | authored Section | จำกัดตามเจ้าของ/ชนิด Format | no | ตำแหน่งขยายข้อมูล Area |
| table-of-contents | yes | no | no | สารบัญจาก heading anchors |
| columns | no | no | root ของ band เท่านั้น | แบ่งช่องหัวท้ายตาม weight |

ไม่รองรับ nodeชื่อ heading, paragraph, div, spacer, html หรือ section ใน fragment.
Table/cell ไม่มี arbitrary x/y, flex, percentage หรือ nested table.
ชื่อ node ที่ถูกต้องไม่ได้หมายความว่าทุก property ใช้ได้ทุกตำแหน่ง.

## 2. text-block

```json
{"id":"chapter-title","type":"text-block","role":{"role":"paragraph"},
 "props":{"textStyleId":"heading","anchorId":{"scope":"local","key":"anchor"},"toc":{"level":1}},
 "children":[{"id":"chapter-title-value","type":"field-ref","scope":"local","key":"title"}]}
```

| Field / props | ชนิด | Required / default / เงื่อนไข |
| --- | --- | --- |
| role | `{role:"paragraph"}` | Required แม้ใช้เป็นหัวข้อ |
| children | Inline[] | Required; ไม่มี inline styles ที่รับ CSS |
| props.textStyleId | string | Required; อ้าง styles ที่มีจริง |
| props.sizing | `{mode:"content"}` | Optional; content sizing ตามข้อความ |
| props.textAlign | left/center/right | Optional default left; **เฉพาะใน cell หรือ band** |
| props.anchorId | string หรือ ScalarBinding | Optional; anchor หลัง compose ต้องไม่ซ้ำและไม่ว่าง |
| props.toc | `{level:1..3}` integer | Optional; ต้องมี anchorId; ไม่รับใน band |
| props.heightMode | content/fixed | Optional; content เมื่อไม่ fixed |
| props.height | Length positive | ต้องมีเมื่อ fixed; authored root ของ cover หรือ flow root ของ Section19 รวม root ใน Area Format ที่วางตรง flow |
| props.verticalAlign | top/center/bottom | Optional default top ใน fixed text block |
| props.pageFieldLayout | `compact` | Optional; band เท่านั้นและต้องมี system-page-field |

fixed ไม่ใช่กล่องตัดข้อความทิ้ง ถ้าไม่พอให้แก้ขนาด/โครงและตรวจ preview.
fixed ห้ามใช้ร่วม sizing; height/verticalAlign ห้ามใส่เมื่อไม่ fixed.
นี่คือกรอบ text-block `props.heightMode` ไม่ใช่ Area Format `sizing.mode`:
Format fixed ใช้เพดานความสูงและแจ้งส่วนที่ไม่แสดงตาม layout.md;
text-block fixed ยังต้องวางเนื้อหาครบกรอบ มิฉะนั้นล้มเหลว.
root textAlign:center ในเนื้อหาทั่วไปจะถูกปฏิเสธ แม้ interface ของ TextBlock
แสดง property นี้อยู่. ไม่มี direct bold/color/fontSize ใน children;
เลือกรูปแบบด้วย TextStyle ที่ block อ้าง.

## 3. Inline ทุกแบบ

ทุก inline มี id ที่ไม่ชนใน fragment และอยู่ใน children ของ text-block.

| type | ฟิลด์นอก id/type | ผล |
| --- | --- | --- |
| text | text:string nonempty | ข้อความ literal; ถ้าค่าว่างจากข้อมูลใช้ field-ref แทน text ว่าง |
| line-break | ไม่มี | ขึ้นบรรทัดใน block ไม่ใช่ page-break |
| field-ref | scope,key | แทนค่า string หรือ BoundLink ตาม schema |
| url | value:ScalarBinding | แสดง URL และทำลิงก์ภายนอก |
| link | text:ScalarBinding,url:ScalarBinding | แสดงชื่อกับ URL |
| reference | text:ScalarBinding,target:ScalarBinding | ลิงก์ภายในไป anchor |
| system-page-field | field:current/total,width:Length positive | ระบบเติมเลขหน้า; **band เท่านั้น** |

External URL รับ http/https ที่มี hostname ไม่มี user/password, whitespace,
backslash หรือ control characters. ไม่รับ javascript:, file:, data: เป็นลิงก์.
reference.target ต้องตรงกับ anchor ที่มีจริงหลัง compose.
ชื่อ link ต้องไม่ว่าง. BoundLink ของตัวแปรไม่มี id; inline ในกราฟมี id.
เลขหน้าอย่าเขียนเป็น field-ref จากข้อมูลที่คำนวณเอง.
หาก band จัดกลาง/ขวาและมีเลขหน้า ต้องใช้ pageFieldLayout:compact.

## 4. table

| Field / props | ชนิด | Required / default |
| --- | --- | --- |
| columns | `{width:Length}[]` nonempty | Required; แต่ละ width > 0 |
| rowIds | string[] | Required; แต่ละ ID ต้องเป็น table-row |
| props.headerRowCount | integer 0 หรือ 1 | Required; ไม่เกินจำนวนแถว |
| props.repeatHeaderRows | boolean | Required; ไม่เพิ่มแถวหัวเอง ต้องมี headerRowCount |
| props.headerFillColor | hex RGB 6 ตัวไม่มี # | Optional; ไม่สั่งเติมสีหัวเมื่อไม่มีค่า |
| props.borderColor | hex RGB 6 ตัวไม่มี # | Optional; default black `000000` |
| props.borderStyle | `single` / `none`; ชุดพัฒนา0.5.2 เพิ่ม `dashed`, `dotted`, `double`, `dashSmallGap`, `thickThinWideGap` | Optional default single; ขอบเขตแบบใหม่อยู่ด้านล่าง |
| props.borderWidth | Length, เฉพาะชุดพัฒนา0.5.2 | Optional default0.5pt; ช่วง0.25–12pt ตามชนิดเส้น |
| props.borders | object, เฉพาะชุดพัฒนา0.5.2 | Override แต่ละด้าน `{style?,width?:Length,color?}` |

ความกว้างตารางคือผลรวม widths ไม่ใช่ 100% ของพื้นที่อัตโนมัติ.
ไม่มี width/align บน table.props และไม่มี columnAutoFit.
`borderStyle:"none"` ใช้แทนการวาดเส้นสีขาวเมื่อจงใจซ่อนเส้น; ไม่เปลี่ยน
`borderColor:"FFFFFF"` เดิมอัตโนมัติ สีขาวยังเป็นเส้นที่วาดจริง.
DOCX ส่ง rowSpan/group-label เป็นเซลล์รวมแนวตั้ง; การอนุญาตแบ่งแถวไม่ทำให้
ทุก merged group แบ่งได้เหมือน PDF ต้องตรวจผล Word ตามเนื้อหาจริง.
หัวคอลัมน์คือ cell/text-block จริง ไม่ใช่ชื่อ metadata ของ columns.
หัวตารางซ้ำไม่ใช่หัว Section; ต้องตรวจทั้งสองอย่างเมื่อแถวข้ามหน้า.

### รูปแบบเส้นในชุดพัฒนา0.5.2

ใช้เฉพาะ target ที่รับรูปแบบนี้; FlowDocMake0.3.0 ยังตรึง Service/Core0.5.0
ซึ่งไม่รับคุณสมบัติใหม่เหล่านี้ การแก้คู่มือไม่เพิ่ม capability ให้ชุดติดตั้ง
PDF/DOCX ใช้ชื่อชนิด/สี/ความกว้างจากโครงเดียวกัน แต่ขีด/รอยต่อหน้าใน Word
อาจต่างจาก PDF ต้องตรวจผลจริง ไม่ใช้ชื่อชนิดเป็นหลักฐานความเหมือน

`borders` รับเฉพาะ `top`, `right`, `bottom`, `left`, `insideHorizontal`,
`insideVertical`, `headerBottom` ไม่ใช่ props ของแต่ละ cell สมาชิกที่ละ
สืบจากระดับ table แล้วจึง default single0.5pt black ถ้าไม่ระบุ object
`headerBottom` เลย จะใช้ override ของ `insideHorizontal` เมื่อมี
เส้นภายในเซลล์รวมไม่ถูกวาด; fills/padding และโครงข้อมูลยังเดิม

```json
{"borderStyle":"dotted","borderWidth":{"value":0.5,"unit":"pt"},
 "borderColor":"000000","borders":{"insideHorizontal":{"style":"none"},
 "headerBottom":{"style":"single","width":{"value":0.5,"unit":"pt"}}}}
```

ชนิด native ที่วาดเส้นต้องใช้ความกว้างเป็นขั้น1/8pt ในช่วง0.25–12pt;
รับหน่วย mm ที่แปลงได้เทียบเท่า `double` คือสองเส้นหนาเท่าค่าที่กำหนด
และช่องว่างเท่ากัน จึงกินกรอบรวม3เท่า `dashSmallGap` ใช้ชนิด native
ของ Word; PDF เป็นรูปแบบประมาณจากตัวอย่าง E ไม่รับประกันทุกน้ำหนัก/จุดตัด

แบบ B ใช้ `thickThinWideGap` เฉพาะตาราง: width คือกรอบรวม ไม่ใช่แต่ละเส้น
รับค่า EMU ที่แทนได้พอดีในช่วง0.25–12pt จึงใช้0.35pt ได้; `none` ไม่วาดเส้น
และยอมรับความละเอียด EMU เช่นกัน B แบ่งเป็นหนา0.6w/ช่อง0.2w/บาง0.2w
ขีดยาว4w/ช่อง12w ที่0.35pt ได้เส้น0.21/0.07pt ช่อง0.07pt ขีด1.4pt/ช่อง4.2pt

```json
{"borderStyle":"thickThinWideGap","borderWidth":{"value":0.35,"unit":"pt"},
 "borderColor":"000000","borders":{"headerBottom":{"style":"thickThinWideGap"}}}
```

DOCX แบบ B เป็น DrawingML ทับตารางข้อความที่แก้ไขได้ จำกัดเซลล์ไม่รวม/ไม่ลงสีพื้น
มี text-block เดียวซึ่งหลัง bind เป็น literal ASCII; แถวข้อมูลต้องไม่ wrap และอยู่บรรทัดเดียว
หัวตารางยอมให้กำหนดขึ้นบรรทัดเองได้ไม่เกิน8บรรทัด เส้นที่เห็นทุกด้านต้องเป็น B
ส่วนที่ซ่อนได้ใช้ none ไม่ผสม native ชนิดอื่น การตัดสินว่าใส่ได้ใช้ค่าฟอนต์จริง
กรณีไม่เข้าเกณฑ์จะล้มเหลวชัดเจน ไม่แปลงเป็นภาพหรือเปลี่ยนชนิดเส้นเงียบ ๆ
เส้นปิดตารางระหว่างหน้าของ Word และ phase ขีดแต่ละแถวยังเป็นข้อจำกัดที่รับรู้
แก้ข้อความ/ฟอนต์ใน Word อาจต้องสร้างไฟล์ใหม่ ดูสัญญาละเอียดใน
[คู่มือ Core](../../../../flowdoc-core/docs/template-guide.md#docx-development-output-in-050)

## 5. table-row และ table-cell

table-row ต้องมี `props:{allowBreak:boolean}` และ `cellIds:string[]`.
allowBreak เป็นการอนุญาต ไม่ใช่การรับรองว่าทุกเนื้อหา/merged group จะแบ่งได้.
ห้ามใช้ข้อความย่อเป็นทางแก้ layout failure.

| Cell props | ชนิด | เมื่อละ / ข้อจำกัด |
| --- | --- | --- |
| columnIndex | integer >= 0 | grid จัดตำแหน่งตามลำดับและช่องที่ว่าง; ใช้ index เริ่ม 0 |
| rowSpan | integer >= 1 | default 1; ต้องไม่ออกนอกแถว/กริด |
| colSpan | integer >= 1 | default 1; ต้องไม่ออกนอกคอลัมน์/ชนช่องอื่น |
| padding | object มี top/right/bottom/left แต่ละด้าน optional Length >=0 | ด้านที่ละเป็น **4 pt** |
| fillColor | hex RGB 6 ตัวไม่มี # | Optional; สีเฉพาะ cell |

Cell ต้องมี props (ใช้ `{}` ได้), childIds. Children วางต่อกันตามลำดับ:
text-block/image และ Area ตามข้อจำกัดในบทโครงสร้าง.
พื้นที่ข้อความ = ผลรวมความกว้างคอลัมน์ที่ span − padding.left − padding.right.
ต้องเหลือ >0. สี cell มีผลแยกจาก header fill; ตรวจสีจาก PDF จริง.
rowSpan ที่ครอบแถว repeat หรือ rowGroup ถูกปฏิเสธ; merged cells ต้องเป็นกริดถูกต้อง
ไม่มีช่องซ้อน/ขาด. อย่าใส่ cell เพิ่มทุกคอลัมน์แล้ว colSpan ทับกัน.
จัดกลางหัวตาราง/รหัสด้วย textAlign:center บน text-block ใน cell ไม่ใช่บน row/cell.

## 6. image

```json
{"id":"banner","type":"image","props":{
 "source":{"scope":"global","key":"headerBanner"},
 "width":{"value":190,"unit":"mm"},"height":{"value":19,"unit":"mm"},"align":"center"}}
```

source,width,height Required; align optional left/center/right default left.
source.scope/key ต้องอ้าง image field ที่อยู่ในบริบทนั้นจริง.
Request value คือ resource UUID ไม่ใช่ path/URL/base64.
กรอบ width/height เป็นขนาดจัดวาง ภาพภายใน **รักษาสัดส่วนแบบ contain**.
align จัดกรอบในพื้นที่; ภาพถูกจัดกลางภายในกรอบอีกชั้น.
ไม่มี `fit`, `cover`, `stretch`, `crop`, `object-fit` property ใน node รุ่นนี้.
เตรียม crop asset ก่อน upload ถ้าต้องการเปลี่ยนสัดส่วน และอย่า crop เนื้อหาสำคัญ.
Frame กว้างเกินพื้นที่ cell/band เป็น layout error ไม่ใช่ลดขนาดอัตโนมัติ.

## 7. line

มี props Required (ใช้ `{}` ได้).

| props | ชนิด | Default |
| --- | --- | --- |
| align | left/center/right | left |
| width | Length >0 | ความกว้างพื้นที่ที่ได้รับ |
| thickness | Length >0 | 0.5 pt |
| color | RGB hex ไม่มี # | 000000 |
| lineStyle | `single` / `none` / `dashed` / `dotted` / `double` / `dashSmallGap` เฉพาะชุดพัฒนา0.5.2 | single; ไม่รับ B `thickThinWideGap` |
| spaceBefore / spaceAfter | Length >=0 | 0 |

เส้นใช้ความสูง spaceBefore+thickness+spaceAfter; width เกินพื้นที่เป็น error.
สูตรข้างต้นเป็นของ single; double ต้องเผื่อกรอบเส้นรวม3เท่า ชนิดใหม่ที่ไม่ใช่
single ใช้ความหนาที่แทนได้ตาม native1/8pt ในช่วง0.25–12pt
none ซ่อนการวาดแต่คงระยะที่เส้นจองไว้ ไม่ใช้แทนการลบ node
ไม่มี vertical-line node; เส้นตารางมาจากตารางเอง.

## 8. page-break, area, table-of-contents, columns

- page-break: `{id,type:"page-break"}` **ไม่มี props**; root เท่านั้น.
  วางก่อนหัวบทใน Format หรือเลือก new-page Format ใน request.
- area: `{id,type:"area",props:{areaId}}`; ไม่มี width/height หรือ data ใน node.
- table-of-contents: `{id,type:"table-of-contents",props:{textStyleId}}`;
  Section19 Stage3 ต้องมี `props.scope:{kind:"section"|"document"}`;
  kind section อ้าง Section เจ้าของ ไม่รับ Section ID ใน scope. Model18ใช้รูปเดิม.
  ไม่รับ items/pageNumbers/title/maxLevel. ชื่อ “สารบัญ” เป็น text-block แยก.
  ดู [สารบัญ](contents-and-repetition.md) เรื่องระดับและลิงก์.
- columns: band-only node มี props:{gap?:Length>=0} และ
  columns:[{weight:number>0,childIds:string[]}]. gap default 0;
  childIds รับ text-block/image/line ไม่รับ columns ซ้อนหรือตาราง.

## 9. สิ่งที่ไม่ควรเดา

ไม่ใส่ CSS margin/width:%/position/fontSize ลง node ที่ไม่ได้ประกาศ.
ไม่ใช้ HTML ใน string เพื่อสร้างรูปแบบ. ไม่ใช้ newline แทน page-break.
ไม่เพิ่มตัวแปรระบบที่ไม่มีสัญญา เช่น pageNumber ใน data แล้วหวังให้ระบบเติมเอง.
ไม่อนุมานว่าระบุความกว้าง 190mm หมายถึงภาพและตารางทุกชนิดจะเต็ม 190mm เหมือนกัน.
