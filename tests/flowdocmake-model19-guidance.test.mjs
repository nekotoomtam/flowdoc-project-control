import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const read=p=>readFileSync(p,'utf8');
const json=p=>JSON.parse(read(p));
const root='docs/examples/clis-model19/';

test('new-authoring entrypoints select19 while retaining explicit legacy maintenance',()=>{
 for(const p of ['plugins/flowdocmake/skills/flowdocmake/SKILL.md','docs/developer/authoring/workflow-start.md','docs/developer/authoring/README.md','docs/developer/authoring/structure-and-data.md','docs/developer/authoring/draft-selection.md']){
  const text=read(p);assert.match(text,/Model19|nodeModelVersion.?[: ]+19/,p);
  assert.match(text,/Model18/,p);
 }
 assert.doesNotMatch(read('docs/developer/authoring/draft-selection.md'),/Definition must use schemaVersion 1,\s*nodeModelVersion 18/);
 assert.doesNotMatch(read('docs/developer/authoring/structure-and-data.md'),/Sections เป็น object keyed/);
 assert.match(read('tools/build-flowdocmake.mjs'),/docs\/examples\/clis-model19/);
});

test('CLIS examples pair19 definitions and array requests without legacy Section fields',()=>{
 const t=json(root+'template.json');assert.equal(t.nodeModelVersion,19);assert.equal(t.schemaVersion,2);
 const ids=t.sections.map(s=>s.id);assert.equal(new Set(ids).size,ids.length);
 for(const s of t.sections){
  assert.match(s.id,/^[0-9a-f-]{36}$/i);assert(s.label&&s.nameBase);
  for(const key of ['key','formats','role'])assert(!Object.hasOwn(s,key),key);
 }
 for(const count of [20,60]){
  const r=json(root+`request-${count}.json`);assert.equal(r.docKey,t.docKey);assert.equal(r.version,t.version);
  assert(Array.isArray(r.sections));assert.deepEqual(r.sections.map(s=>s.id),ids);
  assert.equal(r.sections[0].data.containers[0].data.items.length,count);
  assert.equal(r.sections[0].footer.total,String(count));
 }
 assert.match(read('docs/developer/authoring/examples.md'),/Core0\.5\.1/);
});
