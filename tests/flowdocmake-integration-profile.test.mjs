import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,mkdtempSync,writeFileSync,existsSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const profile=resolve('tests/fixtures/flowdocmake-integration-profile.json');
const expected=JSON.parse(readFileSync(profile)),archive=process.env.FLOWDOCMAKE_INTEGRATION_CORE_ARCHIVE;
const digest=p=>createHash('sha256').update(readFileSync(p)).digest('hex');
function build(out,selected=profile,core=archive){return spawnSync(process.execPath,['tools/build-flowdocmake.mjs','--candidate-profile',selected,'--out',out,'--core-archive',core],{encoding:'utf8'});}
test('builds the integration archive candidate while preserving prepared and previous pins',()=>{
 assert.equal(digest(archive),expected.supported.coreArtifactSha256);
 const sourcePin=digest('plugins/flowdocmake/scripts/compatibility-profile.mjs'),sourceSnapshot=digest('plugins/flowdocmake/snapshot.json');
 const previousProfile=digest('tests/fixtures/flowdocmake-docx-run-profile.json');
 const out=join(mkdtempSync(join(tmpdir(),'flowdocmake-integration-')),'candidate'),r=build(out);
 assert.equal(r.status,0,r.stderr);
 const inventory=JSON.parse(readFileSync(join(out,'candidate-inventory.json'))),meta=JSON.parse(readFileSync(join(out,'.codex-plugin/plugin.json')));
 assert.deepEqual(inventory.profile,expected);assert.equal(meta.name,expected.id);assert.equal(meta.version,expected.version);
 for(const [path,hash]of Object.entries(inventory.files))assert.equal(digest(join(out,path)),hash,path);
 const snapshot=JSON.parse(readFileSync(join(out,'snapshot.json')));assert.equal(snapshot.guideRelease,'0.5.2');assert.equal(snapshot.packageVersion,expected.version);
 assert.equal(digest('plugins/flowdocmake/scripts/compatibility-profile.mjs'),sourcePin);assert.equal(digest('plugins/flowdocmake/snapshot.json'),sourceSnapshot);assert.equal(digest('tests/fixtures/flowdocmake-docx-run-profile.json'),previousProfile);
});
test('rejects wrong archive and unreviewed pins before creating any candidate output',()=>{
 const root=mkdtempSync(join(tmpdir(),'flowdocmake-integration-deny-')),wrong=join(root,'wrong.tgz');writeFileSync(wrong,'not the reviewed Core archive');
 const a=join(root,'wrong-output'),r=build(a,profile,wrong);assert.notEqual(r.status,0);assert.match(r.stderr,/Reviewed Core archive hash mismatch/);assert.equal(existsSync(a),false);
 const previous=process.env.FLOWDOCMAKE_PREVIOUS_CORE_ARCHIVE;assert(previous);const previousOut=join(root,'previous-output'),v=build(previousOut,profile,previous);assert.notEqual(v.status,0);assert.match(v.stderr,/Reviewed Core archive hash mismatch/);assert.equal(existsSync(previousOut),false);
 const altered=join(root,'altered.json');writeFileSync(altered,JSON.stringify({...expected,supported:{...expected.supported,coreArtifactSha256:'a'.repeat(64)}}));
 const b=join(root,'altered-output'),s=build(b,altered);assert.notEqual(s.status,0);assert.match(s.stderr,/Unknown candidate profile/);assert.equal(existsSync(b),false);
 const overlap=build(resolve('plugins/flowdocmake'));assert.notEqual(overlap.status,0);assert.match(overlap.stderr,/new isolated directory/);
});
