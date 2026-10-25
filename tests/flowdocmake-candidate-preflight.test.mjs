import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile,writeFile,mkdtemp,mkdir,cp} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {createServer} from 'node:http';
import {execFileSync} from 'node:child_process';
const service=process.env.FLOWDOCMAKE_SERVICE_ROOT,candidate=process.env.FLOWDOCMAKE_CANDIDATE_ROOT;
assert.ok(service&&candidate,'Explicit isolated Service and candidate roots required');
const {Client}=await import(pathToFileURL(join(service,'node_modules/@modelcontextprotocol/client/dist/index.mjs')));
const {StdioClientTransport}=await import(pathToFileURL(join(service,'node_modules/@modelcontextprotocol/client/dist/stdio.mjs')));
const root=await mkdtemp(join(tmpdir(),'i5c-preflight-')),authoring=join(root,'authoring.env'),task=join(root,'task.env');
await writeFile(authoring,'AUTHORING_TOKEN=i5c-local-authoring-only-00000000000000000000');await writeFile(task,'TASK_TOKEN='+'t'.repeat(40));
const base={serviceRoot:service,pluginRoot:candidate,credentialFile:authoring,taskCredentialFile:task,previewDirectory:root};
async function withClient(config,callback){
 const path=join(root,Math.random()+'.json');await writeFile(path,JSON.stringify(config));
 const client=new Client({name:'i5c-proof',version:'1'}),transport=new StdioClientTransport({command:process.execPath,args:[join(config.pluginRoot,'scripts/server.mjs')],env:{...process.env,FLOWDOCMAKE_CONFIG:path},stderr:'pipe'});
 try{await client.connect(transport);return await callback(client);}finally{await client.close();await transport.close();}
}
const value=r=>JSON.parse(r.content[0].text);
test('both static profiles enforce exact task capability before allocation',async()=>{
 const release=await import('../plugins/flowdocmake/scripts/compatibility.mjs'),selected=await import(pathToFileURL(join(candidate,'scripts/compatibility.mjs')));
 let advertised,calls=0;
 const server=createServer(async(req,res)=>{res.setHeader('content-type','application/json');if(req.url==='/authoring/contract')return res.end(JSON.stringify({ok:true,value:{documents:advertised}}));calls++;req.resume();res.end(JSON.stringify({ok:true,task:{status:'failed'},findings:[],nextCursor:null}));});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 try{for(const [plugin,tuple] of [[resolve('plugins/flowdocmake'),release.supported],[candidate,selected.supported]]){
  await withClient({...base,pluginRoot:plugin,url:'http://127.0.0.1:'+server.address().port},async client=>{
   for(const advertisedTuple of [release.supported,selected.supported,{...tuple,coreArtifactSha256:'a'.repeat(64)},{...tuple,service:'0.4.10'},null]){
    advertised=advertisedTuple?{version:1,route:'/documents',input:'section-assets-multipart-v1',response:'task-v1',lookup:'exact-record-only',serviceVersion:advertisedTuple.service,coreVersion:advertisedTuple.core,coreSha256:advertisedTuple.coreArtifactSha256}:null;
    const before=calls,result=value(await client.callTool({name:'inspect_document_task',arguments:{taskId:'10000000-0000-4000-8000-000000000001'}}));
    if(JSON.stringify(advertisedTuple)===JSON.stringify(tuple)){assert.equal(result.ok,true);assert.equal(calls,before+1);}else{assert.equal(result.code,'TASK_CAPABILITY_UNSUPPORTED');assert.equal(calls,before);}
   }
  });
 }}finally{server.closeAllConnections();await new Promise(r=>server.close(r));}
});
test('candidate entry refuses redirected roots, nonloopback URLs and tampered local vendor bytes',async()=>{
 const {validateCandidateConfig}=await import(pathToFileURL(join(candidate,'scripts/candidate-entry.mjs')));
 const configPath=join(root,'guard.json');
 for(const config of [{...base,url:'http://127.0.0.1:3018',pluginRoot:service},{...base,url:'http://example.com:3018'}]){await writeFile(configPath,JSON.stringify(config));assert.throws(()=>validateCandidateConfig(configPath,candidate));}
 assert.throws(()=>validateCandidateConfig('relative.json',candidate),/explicit absolute/);
 const clone=join(root,'service-clone');await mkdir(join(clone,'vendor'),{recursive:true});await mkdir(join(clone,'node_modules/@flowdoc/core'),{recursive:true});
 for(const p of ['package.json','node_modules/@flowdoc/core/package.json','vendor/manifest.json'])await cp(join(service,p),join(clone,p));
 const manifest=JSON.parse(await readFile(join(clone,'vendor/manifest.json')));await writeFile(join(clone,'vendor',manifest.file),'tampered');
 await writeFile(configPath,JSON.stringify({...base,url:'http://127.0.0.1:3018',serviceRoot:clone}));assert.throws(()=>validateCandidateConfig(configPath,candidate),/identity mismatch/);
 const pluginClone=join(root,'profile-clone');await cp(candidate,pluginClone,{recursive:true});
 const profilePath=join(pluginClone,'scripts/compatibility-profile.mjs');await writeFile(profilePath,(await readFile(profilePath,'utf8')).replace('2bec67cf379d5913cd8d6881b7eeb973b7b4159b95231e07cd04db4faf1c43b1','0'.repeat(64)));
 const altered=await import(pathToFileURL(join(pluginClone,'scripts/candidate-entry.mjs')));await writeFile(configPath,JSON.stringify({...base,pluginRoot:pluginClone,url:'http://127.0.0.1:3018'}));assert.throws(()=>altered.validateCandidateConfig(configPath,pluginClone),/identity mismatch/);
});
test('real Docker preflight checks actual archive, loopback mapping and guides',async()=>{
 const url=process.env.FLOWDOCMAKE_TEST_URL,container=process.env.FLOWDOCMAKE_TEST_CONTAINER,python=process.env.FLOWDOCMAKE_TEST_PYTHON;
 assert.ok(url&&container&&python,'Actual isolated Docker endpoint and reader required');
 assert.match(container,/^flowdoc-prep050-api$/);
 const config={...base,url,container,python};
 const call=cfg=>withClient(cfg,async client=>value(await client.callTool({name:'get_flowdocmake_context',arguments:{}})));
 const first=await call(config);assert.equal(first.ready,true,JSON.stringify(first));assert.equal(first.runtime.coreArtifactSha256,'2bec67cf379d5913cd8d6881b7eeb973b7b4159b95231e07cd04db4faf1c43b1');assert.match(first.runtime.identitySource,/Docker/);
 assert.equal((await call({...config,container:'flowdoc-docx-i5c-does-not-exist'})).ready,false);
 const proxy=createServer(async(req,res)=>{const response=await fetch(new URL(req.url,url),{headers:{authorization:req.headers.authorization}});res.writeHead(response.status,{'content-type':'application/json'});res.end(await response.text());});await new Promise(r=>proxy.listen(0,'127.0.0.1',r));
 try{assert.equal((await call({...config,url:'http://127.0.0.1:'+proxy.address().port})).ready,false);}finally{proxy.closeAllConnections();await new Promise(r=>proxy.close(r));}
 const clone=join(root,'plugin-clone');await cp(candidate,clone,{recursive:true});const snapshot=JSON.parse(await readFile(join(clone,'snapshot.json'))),guide=Object.keys(snapshot.files)[0];await writeFile(join(clone,guide),'tampered');
 assert.equal((await call({...config,pluginRoot:clone})).code,'GUIDE_INTEGRITY_FAILURE');
 // Only the disposable test container is mutated, never the accepted archive.
 const command=['exec',container,'node','-e',"const fs=require('fs'),m=require('./vendor/manifest.json');fs.renameSync('./vendor/'+m.file,'/tmp/i5c-original.tgz');fs.writeFileSync('./vendor/'+m.file,'tampered')"];
 execFileSync('docker',command);
 try{assert.equal((await call(config)).ready,false);}finally{execFileSync('docker',['exec',container,'node','-e',"const fs=require('fs'),m=require('./vendor/manifest.json');fs.renameSync('/tmp/i5c-original.tgz','./vendor/'+m.file)"]);}
 assert.equal((await call(config)).ready,true);
});
