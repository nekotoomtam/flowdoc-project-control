import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {mkdtempSync,readFileSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir,homedir} from 'node:os';
import {join,resolve} from 'node:path';
import {Client} from '../../flowdoc-service/node_modules/@modelcontextprotocol/client/dist/index.mjs';
import {StdioClientTransport} from '../../flowdoc-service/node_modules/@modelcontextprotocol/client/dist/stdio.mjs';
test('preflight distinguishes authentication, unavailable Service and reader; image rejects nonimage files',async()=>{
 const dir=mkdtempSync(join(tmpdir(),'flowdocmake-test-'));
 const config=JSON.parse(readFileSync(join(homedir(),'.codex/flowdocmake.local.json'),'utf8'));
 let requests=0;const mock=createServer((req,res)=>{requests++;res.writeHead(403);res.end('{}');});await new Promise(r=>mock.listen(0,'127.0.0.1',r));
 async function check(overrides,expected){
  const path=join(dir,'config.json');writeFileSync(path,JSON.stringify({...config,...overrides}));
  const client=new Client({name:'negative-check',version:'1'}),transport=new StdioClientTransport({command:process.execPath,args:[resolve('plugins/flowdocmake/scripts/server.mjs')],env:{...process.env,FLOWDOCMAKE_CONFIG:path},stderr:'pipe'});
  try{await client.connect(transport);const listed=(await client.listTools()).tools;assert(listed.some(t=>t.name==='run_candidate_preview'));assert(!listed.some(t=>/publish/.test(t.name)));
   const invalid=await client.callTool({name:'run_candidate_preview',arguments:{planPath:join(dir,'missing-plan.json'),mode:'check'}});assert.equal(invalid.isError,true);
   const r=await client.callTool({name:'get_flowdocmake_context',arguments:{}});assert.equal(JSON.parse(r.content[0].text).code,expected);
   const bad=await client.callTool({name:'upload_preview_image_file',arguments:{uploadId:'00000000-0000-4000-8000-000000000001',resourceId:'00000000-0000-4000-8000-000000000002',path}});assert.equal(bad.isError,true);
  }finally{await client.close();await transport.close();}
 }
 try{await check({url:'http://127.0.0.1:'+mock.address().port},'AUTHORIZATION_FAILED');assert.equal(requests,1);await new Promise(r=>mock.close(r));await check({url:'http://127.0.0.1:1'},'SERVICE_UNREACHABLE');await check({python:join(dir,'missing-python')},'PDF_READER_MISSING');}
 finally{mock.close();rmSync(dir,{recursive:true,force:true});}
});
