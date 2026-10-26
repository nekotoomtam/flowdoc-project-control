import {test} from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {createHash} from 'node:crypto';
test('guide snapshots use canonical LF bytes across Windows checkouts and preserve hashes',()=>{const file='skills/flowdocmake/references/docs/developer/authoring/nodes.md',bytes=readFileSync('plugins/flowdocmake/'+file),canonical=Buffer.from(readFileSync('docs/developer/authoring/nodes.md','utf8').replace(/\r\n/g,'\n'));assert.deepEqual(bytes,canonical);const snapshot=JSON.parse(readFileSync('plugins/flowdocmake/snapshot.json','utf8'));assert.equal(snapshot.files[file],createHash('sha256').update(canonical).digest('hex'));});
test('every packaged guide/example matches canonical sources, including Model19 CLIS',()=>{
 const snapshot=JSON.parse(readFileSync('plugins/flowdocmake/snapshot.json','utf8'));
 const prefix='skills/flowdocmake/references/';
 assert(Object.hasOwn(snapshot.files,prefix+'docs/examples/clis-model19/template.json'));
 for(const [file,hash] of Object.entries(snapshot.files)){
  const canonical=Buffer.from(readFileSync(file.slice(prefix.length),'utf8').replace(/\r\n/g,'\n'));
  assert.deepEqual(readFileSync('plugins/flowdocmake/'+file),canonical,file);
  assert.equal(createHash('sha256').update(canonical).digest('hex'),hash,file);
 }
});
