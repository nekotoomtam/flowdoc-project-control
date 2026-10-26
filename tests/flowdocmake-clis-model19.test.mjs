import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const read=p=>readFileSync(p,'utf8');
const json=p=>JSON.parse(read(p));
const root='docs/examples/clis-model19/';

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
 assert.equal(t.areaFormats.containers.fragment.nodes.containers.props.borderStyle,'thickThinWideGap');
});
