# อภิธานศัพท์ Flowdoc

คำอธิบายภาษาไทยนี้ใช้ ID เดียวกับอภิธานศัพท์ภาษาอังกฤษ ไม่สร้างตัวตนคำศัพท์ภาษาไทยแยกต่างหาก และไม่ได้ยืนยันสถานะของ product repository

## Node

`node` คือหัวข้อถาวรในต้นไม้นำทางหลัก มี Node แม่หลักได้หนึ่งตัว หรือเป็นรากของต้นไม้

## Truth State

`truth-state` บอกสถานะของข้อความเกี่ยวกับ Node ว่าเป็น `current`, `planned`, `risk` หรือ `unknown` โดย `current` ต้องมี Evidence รองรับ และห้ามอนุมานจาก Work

## Work State

`work-state` บอกสถานะของงานชั่วคราวว่าเป็น `queued`, `in-progress`, `blocked` หรือ `in-review` ซึ่งแยกจาก Truth State

## Work Tree

`work-tree` คือลำดับชั้นของ Work record ที่เชื่อมกันด้วย `parentWorkId` ใช้บอกว่าเรื่องกว้างแตกเป็นหัวข้อหรืองานที่ทำได้อย่างไร แต่แยกจาก Node tree และไม่ได้ยืนยัน Truth State

## Phase

`phase` คือรอบการทำงานตามลำดับสำหรับ Work task ที่ลงมือทำได้ ใช้บันทึกขั้นปัจจุบัน บทบาท เงื่อนไขหยุด และเป้าหมายการตรวจสอบ โดยไม่กลายเป็น Node หรือ Work ลูก

## Checklist

`checklist` คือชุดเกตที่วัดได้สำหรับ Phase หนึ่ง สถานะของ Checklist item บันทึกความคืบหน้าการทำงานเท่านั้น ไม่ได้พิสูจน์ product truth หรือเลื่อน Node เป็น `current`

## Context Document

`context-document` คือ Document record ที่ agent ต้องอ่านก่อนทำ Work task หรือ Phase เพื่อให้เส้นทางอ่านเอกสารที่จำเป็นชัดเจน

## Evidence Target

`evidence-target` อธิบาย command, path, contract, document หรือ Evidence record ในอนาคตที่จะรองรับคำกล่าวแบบมีขอบเขต เป็นเป้าหมายสำหรับการตรวจสอบ ไม่ใช่หลักฐานด้วยตัวเอง

## Document

`document` คือ metadata ของ Markdown ถาวร มีบทบาท ขอบเขตอำนาจ lifecycle และอาจมี repository reference ที่ตรึง commit

## Evidence

`evidence` เชื่อมคำกล่าวขอบเขตจำกัดกับ commit ที่แน่นอนและ path หรือ contract ID ที่ตรวจได้ ไม่ได้ยืนยันว่าสิ่งอื่นใน commit เดียวกันถูกตรวจแล้ว

## Repository Registry

`repository-registry` ระบุ repository ที่อนุมัติด้วย HTTPS remote, checkout alias, default branch และ ownership summary โดยไม่เก็บ path checkout เฉพาะเครื่อง

## Repo Directory Overview

`repo-directory-overview` คือหน้าของ Project Control GUI ที่แสดงหัวข้อ repository หรือ area ก่อนรายละเอียด Work, Project Control Node, Evidence หรือ Checklist ใช้ตอบว่าส่วนหนึ่งอยู่ตรงไหนของระบบ

## Work History View

`work-history-view` คือหน้าของ Project Control GUI ที่แสดงงานที่ถูกบันทึกตามเวลา และพาผู้ใช้กลับไปยัง Overview ที่ focus repository หรือ area ที่เกี่ยวข้อง มันไม่ใช่ Evidence

## Focus Stack Map

`focus-stack-map` คือมุมนำทางแบบอ่านอย่างเดียวที่แสดง Node บรรพบุรุษ Node ปัจจุบัน และ Node ลูก

## Summary Inspector

`summary-inspector` คือแถบสรุปแบบอ่านอย่างเดียวสำหรับ summary, status และ reference ที่เลือกของ Node

## Full Detail Modal

`full-detail-modal` คือหน้าต่างซ้อนสำหรับรายละเอียด Node โดยไม่แทนที่ตำแหน่งปัจจุบันบนแผนผัง
