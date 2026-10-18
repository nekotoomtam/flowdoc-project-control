import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as api from '../plugins/flowdocmake/scripts/compatibility.mjs';
import {createServer} from 'node:http';
import {mkdtempSync,writeFileSync,rmSync,readFileSync} from 'node:fs';
import {join,resolve} from 'node:path';import {tmpdir,homedir} from 'node:os';import {pathToFileURL} from 'node:url';
const capability={version:1,nodeModelVersions:[19],schemaVersions:[1,2],continuationSuffix:' (ต่อ)',fixed:'formatSizing-v2',diagnosticsVersion:1};
const definition={nodeModelVersion:19,schemaVersion:1,areaFormats:{meeting:{rowGroups:[{groupLabel:{cellTemplateId:'label',emptyCellTemplateId:'empty'}}]}}};
test('group label preflight rejects missing/unknown capabilities without changing payload; old definitions stay usable',()=>{
 assert.equal(typeof api.checkGroupLabelCapability,'function');
 const before=JSON.stringify(definition),contract={groupLabelSpans:capability,formatSizing:{version:2}};
 assert.deepEqual(api.checkGroupLabelCapability(definition,contract),{ok:true});
 for(const groupLabelSpans of [undefined,{...capability,version:2},{...capability,nodeModelVersions:[18]},{...capability,nodeModelVersions:'19'},{...capability,nodeModelVersions:19},{...capability,schemaVersions:'12'},{...capability,schemaVersions:1},{...capability,schemaVersions:[2]},{...capability,continuationSuffix:'continue'},{...capability,diagnosticsVersion:2}]){
  assert.equal(api.checkGroupLabelCapability(definition,{...contract,groupLabelSpans}).code,'GROUP_LABEL_SPANS_UNSUPPORTED');
 }
 assert.equal(api.checkGroupLabelCapability({...definition,nodeModelVersion:18},contract).ok,false);
 assert.equal(api.checkGroupLabelCapability({nodeModelVersion:18},{ }).ok,true);
 assert.equal(api.checkGroupLabelCapability({nodeModelVersion:19,areaFormats:{}},{}).ok,true);
 const fixed=structuredClone(definition);fixed.areaFormats.meeting.sizing={mode:'fixed',height:{value:300,unit:'pt'}};
 assert.equal(api.checkGroupLabelCapability(fixed,{groupLabelSpans:capability,formatSizing:{version:1}}).ok,false);
 assert.equal(JSON.stringify(definition),before);
});
test('actual stdio guards validate/save before sending definitions to an old or unknown engine; old payload is unchanged',async()=>{
 const root=process.env.FLOWDOCMAKE_SERVICE_ROOT??JSON.parse(readFileSync(join(homedir(),'.codex/flowdocmake.local.json'))).serviceRoot;
 const {Client}=await import(pathToFileURL(join(root,'node_modules/@modelcontextprotocol/client/dist/index.mjs')));
 const {StdioClientTransport}=await import(pathToFileURL(join(root,'node_modules/@modelcontextprotocol/client/dist/stdio.mjs')));
 const dir=mkdtempSync(join(tmpdir(),'group-label-capability-')),credentialFile=join(dir,'credential.env'),configPath=join(dir,'config.json'),calls=[];
 let cap;
 const http=createServer(async(req,res)=>{
  if(req.url==='/authoring/contract'){res.setHeader('content-type','application/json');res.end(JSON.stringify({ok:true,value:{groupLabelSpans:cap,formatSizing:{version:2}}}));return;}
  let body='';for await(const c of req)body+=c;calls.push({method:req.method,path:req.url,body:JSON.parse(body)});res.setHeader('content-type','application/json');res.end(JSON.stringify({ok:true,value:{saved:true}}));
 });await new Promise(r=>http.listen(0,'127.0.0.1',r));writeFileSync(credentialFile,'AUTHORING_TOKEN='+'a'.repeat(40));
 writeFileSync(configPath,JSON.stringify({serviceRoot:root,pluginRoot:resolve('plugins/flowdocmake'),credentialFile,url:'http://127.0.0.1:'+http.address().port}));
 const client=new Client({name:'group-label-compatibility',version:'1'}),transport=new StdioClientTransport({command:process.execPath,args:[resolve('plugins/flowdocmake/scripts/server.mjs')],env:{...process.env,FLOWDOCMAKE_CONFIG:configPath},stderr:'pipe'});
 try{
  await client.connect(transport);
  for(cap of [undefined,{...capability,version:99}])for(const name of ['validate_template','update_template_draft']){
   const args={definition,...(name==='update_template_draft'?{templateId:'10000000-0000-4000-8000-000000000001',expectedRevision:0,idempotencyKey:'one'}:{})};
   const r=await client.callTool({name,arguments:args});assert.equal(r.isError,true);assert.equal(JSON.parse(r.content[0].text).code,'GROUP_LABEL_SPANS_UNSUPPORTED');
  }
  assert.equal(calls.length,0);
  const legacy={nodeModelVersion:18,schemaVersion:1};await client.callTool({name:'validate_template',arguments:{definition:legacy}});assert.deepEqual(calls[0].body.definition,legacy);
  cap=capability;const r=await client.callTool({name:'validate_template',arguments:{definition}});assert(!r.isError);assert.deepEqual(calls[1].body.definition,definition);
 }finally{await client.close();await transport.close();await new Promise(r=>http.close(r));rmSync(dir,{recursive:true,force:true});}
});
