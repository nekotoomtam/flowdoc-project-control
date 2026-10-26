import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,mkdtempSync,existsSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {supported} from '../plugins/flowdocmake/scripts/compatibility-profile.mjs';
const expected={service:'0.5.2',core:'0.5.2',coreArtifactSha256:'647235de33308ecf99aa201c63ff1e663e15c17c3b9259bde0ecf5f6dc819318'};
test('0.3.1 source profile pins the final documented Core0.5.2 exactly',()=>{
 assert.equal(JSON.parse(readFileSync('plugins/flowdocmake/.codex-plugin/plugin.json')).version,'0.3.1');
 assert.deepEqual(supported,expected);
 assert.equal(createHash('sha256').update(readFileSync(process.env.FLOWDOCMAKE_052_CORE_ARCHIVE)).digest('hex'),expected.coreArtifactSha256);
});
test('reviewed0.5.2 candidate builds outside source with its exact profile and guide identity',()=>{
 const parent=mkdtempSync(join(tmpdir(),'flowdoc052-')),out=join(parent,'bundle');
 const r=spawnSync(process.execPath,['tools/build-flowdocmake.mjs','--candidate-profile',resolve('tests/fixtures/flowdocmake-052-profile.json'),'--out',out,'--core-archive',process.env.FLOWDOCMAKE_052_CORE_ARCHIVE],{encoding:'utf8'});
 assert.equal(r.status,0,r.stderr);assert(existsSync(join(out,'candidate-inventory.json')));
 const snapshot=JSON.parse(readFileSync(join(out,'snapshot.json')));assert.equal(snapshot.guideRelease,'0.5.2');assert.equal(snapshot.packageVersion,'0.3.1-candidate.1');
 const inventory=JSON.parse(readFileSync(join(out,'candidate-inventory.json')));assert.deepEqual(inventory.profile.supported,expected);
});
