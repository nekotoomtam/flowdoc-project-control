import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,readFileSync,writeFileSync,existsSync,cpSync,mkdirSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve,dirname} from 'node:path';
import {spawnSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
const profile=resolve('tests/fixtures/flowdocmake-050-profile.json');
const expected=JSON.parse(readFileSync(profile));
const root=mkdtempSync(join(tmpdir(),'flowdocmake-candidate-'));
function build(out,extra=[],selectedProfile=profile){return spawnSync(process.execPath,['tools/build-flowdocmake.mjs','--candidate-profile',selectedProfile,'--out',out,...extra],{encoding:'utf8'});}
test('candidate build fails closed before writing without reviewed archive or on bad profile',()=>{
 const out=join(root,'absent');assert.notEqual(build(out).status,0);assert.equal(existsSync(out),false);
 const bad=join(root,'bad.json');writeFileSync(bad,JSON.stringify({...expected,supported:{...expected.supported,core:'99.0.0'}}));
 const result=build(out,['--core-archive',process.env.FLOWDOCMAKE_CORE_ARCHIVE],bad);assert.notEqual(result.status,0);assert.match(result.stderr,/Unknown candidate profile/);assert.equal(existsSync(out),false);
 for(const change of [{...expected,supported:{...expected.supported,coreArtifactSha256:null}},{...expected,id:'unknown'}]){writeFileSync(bad,JSON.stringify(change));assert.notEqual(build(out,['--core-archive',process.env.FLOWDOCMAKE_CORE_ARCHIVE],bad).status,0);assert.equal(existsSync(out),false);}
 const overlap=build(resolve('plugins/flowdocmake'),['--core-archive',process.env.FLOWDOCMAKE_CORE_ARCHIVE]);assert.notEqual(overlap.status,0);assert.match(overlap.stderr,/new isolated directory/);
 const cache=join(root,'plugins/cache');mkdirSync(cache,{recursive:true});const installed=build(join(cache,'candidate'),['--core-archive',process.env.FLOWDOCMAKE_CORE_ARCHIVE]);assert.notEqual(installed.status,0);assert.match(installed.stderr,/new isolated directory/);assert.equal(existsSync(join(cache,'candidate')),false);
});
test('default release packaging retains the release profile and canonical guide bytes',()=>{
 const fixture=join(root,'release-source');mkdirSync(fixture);
 const paths=['tools/build-flowdocmake.mjs','plugins/flowdocmake','docs/examples/clis-model19','docs/examples/section-area-contract-20261017','docs/developer/authoring','docs/examples/ai-template-authoring','docs/domains/flowdoc-ai-template-authoring-guide.md','docs/domains/flowdoc-area-document-transition-2026-10-14.md','docs/domains/flowdoc-template-authoring-tools-plan.md','tools/check-developer-authoring.mjs','tools/check-developer-authoring-pdf.py'];
 for(const p of paths){mkdirSync(dirname(join(fixture,p)),{recursive:true});cpSync(resolve(p),join(fixture,p),{recursive:true});}
 for(const args of [['init','-q'],['add','.'],['-c','user.name=Fixture','-c','user.email=fixture@local.invalid','commit','-qm','fixture']]){const r=spawnSync('git',args,{cwd:fixture,encoding:'utf8'});assert.equal(r.status,0,r.stderr);}
 const run=spawnSync(process.execPath,['tools/build-flowdocmake.mjs'],{cwd:fixture,encoding:'utf8'});assert.equal(run.status,0,run.stderr);
 assert.equal(readFileSync(join(fixture,'plugins/flowdocmake/scripts/compatibility-profile.mjs'),'utf8'),readFileSync(resolve('plugins/flowdocmake/scripts/compatibility-profile.mjs'),'utf8'));
 const actual=JSON.parse(readFileSync(join(fixture,'plugins/flowdocmake/snapshot.json'))),original=JSON.parse(readFileSync(resolve('plugins/flowdocmake/snapshot.json')));
 assert.equal(actual.packageVersion,JSON.parse(readFileSync('plugins/flowdocmake/.codex-plugin/plugin.json')).version);assert.deepEqual(actual.files,original.files);
});
test('candidate bundle preserves release pin, exact candidate profile and reproducible inventory',async()=>{
 assert.ok(process.env.FLOWDOCMAKE_CORE_ARCHIVE,'explicit reviewed archive required');
 const outputs=[join(root,'one'),join(root,'two')];
 for(const out of outputs){const r=build(out,['--core-archive',process.env.FLOWDOCMAKE_CORE_ARCHIVE]);assert.equal(r.status,0,r.stderr);}
 const release=await import('../plugins/flowdocmake/scripts/compatibility-profile.mjs');
 assert.deepEqual(release.supported,JSON.parse(readFileSync('tests/fixtures/flowdocmake-052-profile.json')).supported);
 const candidate=await import(pathToFileURL(join(outputs[0],'scripts/compatibility-profile.mjs')));
 assert.deepEqual(candidate.supported,expected.supported);
 assert.equal(JSON.parse(readFileSync(join(outputs[0],'.codex-plugin/plugin.json'))).name,expected.id);
 const inventories=outputs.map(out=>JSON.parse(readFileSync(join(out,'candidate-inventory.json'))));
 for(const out of outputs){const mcp=JSON.parse(readFileSync(join(out,'.mcp.json'))).mcpServers[expected.id];assert.deepEqual(mcp.args,[join(out,'scripts/server.mjs')]);}
 for(const inventory of inventories)delete inventory.files['.mcp.json'];
 assert.deepEqual(inventories[0],inventories[1]);
 assert.notEqual(build(outputs[0],['--core-archive',process.env.FLOWDOCMAKE_CORE_ARCHIVE]).status,0);
 const wrong=join(root,'wrong.tgz');writeFileSync(wrong,'wrong bytes');const out=join(root,'wrong');assert.notEqual(build(out,['--core-archive',wrong]).status,0);assert.equal(existsSync(out),false);
 const noConfig=spawnSync(process.execPath,[join(outputs[0],'scripts/server.mjs')],{encoding:'utf8',env:{...process.env,FLOWDOCMAKE_CONFIG:''}});
 assert.notEqual(noConfig.status,0);assert.match(noConfig.stderr,/explicit absolute FLOWDOCMAKE_CONFIG/);
});
