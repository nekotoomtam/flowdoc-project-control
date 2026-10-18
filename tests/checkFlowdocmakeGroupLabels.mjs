import assert from 'node:assert/strict';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';import {pathToFileURL} from 'node:url';import {randomUUID} from 'node:crypto';
const config=JSON.parse(readFileSync(process.env.FLOWDOCMAKE_CONFIG)),root=config.serviceRoot;
const {Client}=await import(pathToFileURL(join(root,'node_modules/@modelcontextprotocol/client/dist/index.mjs')));
const {StdioClientTransport}=await import(pathToFileURL(join(root,'node_modules/@modelcontextprotocol/client/dist/stdio.mjs')));
const {fixture}=await import(pathToFileURL(join(root,'tests/groupLabelFixture.mjs')));
const wiring=JSON.parse(readFileSync(join(config.pluginRoot,'.mcp.json'))).mcpServers.flowdocmake,client=new Client({name:'group-label-native-proof',version:'1'}),transport=new StdioClientTransport({...wiring,command:process.execPath,env:{...process.env},stderr:'pipe'});
const invoke=async(name,args)=>{const r=await client.callTool({name,arguments:args}),body=JSON.parse(r.content[0].text);assert(!r.isError&&body.ok!==false,JSON.stringify(body));return body.value??body;};
await client.connect(transport);const out=process.env.GROUP_LABEL_PROOF_DIR;mkdirSync(out,{recursive:true});const results=[];
try{
 const context=await invoke('get_flowdocmake_context',{});assert.equal(context.ready,true);assert.equal(context.contract.groupLabelSpans.version,1);assert.equal(context.contract.formatSizing.version,2);
 const tools=(await client.listTools()).tools;assert(!tools.some(t=>/publish|activate|retire|import_font/.test(t.name)));
 for(const [name,options] of [['auto',{height:160,members:8}],['fixed',{fixed:true,height:120,members:12}],['impossible',{height:100,members:0,name:Array(9).fill('NAME').join('\n')}]]){
  const {t,q}=fixture(options),draft=await invoke('create_template_draft',{name:'Group trial',docKey:'group-trial-'+randomUUID(),idempotencyKey:randomUUID()});Object.assign(t,{templateId:draft.templateId,docKey:draft.docKey});q.docKey=draft.docKey;
  if(name==='auto'){const f=t.areaFormats.meeting;f.key='examples';t.areaFormats={examples:f};q.sections[0].data.content[0].format='examples';}
  const validated=await invoke('validate_template',{definition:t,sampleRequest:q});assert.equal(validated.fontReadiness.status,'ready');
  await invoke('update_template_draft',{templateId:t.templateId,definition:t,expectedRevision:0,idempotencyKey:randomUUID()});assert.deepEqual((await invoke('get_template_draft',{templateId:t.templateId})).definition,t);
  const job=await invoke('preview_template_draft',{templateId:t.templateId,expectedRevision:1,sampleRequest:q,idempotencyKey:randomUUID()});let status;
  for(let i=0;i<300;i++){status=await invoke('get_preview_status',{jobId:job.jobId});if(['succeeded','failed'].includes(status.status))break;await new Promise(r=>setTimeout(r,100));}
  if(name==='impossible'){assert.equal(status.status,'failed');assert.equal(status.errors[0].reason,'group-label-does-not-fit');assert.equal(status.errors[0].groupId,'companies');assert.equal(status.errors[0].groupIndex,0);}
  else{assert.equal(status.status,'succeeded',JSON.stringify(status));if(name==='fixed')assert(status.warnings.some(w=>w.code==='FORMAT_CONTENT_OMITTED'&&w.formatOmission.pending[0].groupId==='companies'));const pdf=await invoke('save_preview_pdf',{jobId:job.jobId});assert.equal(readFileSync(pdf.path).subarray(0,5).toString(),'%PDF-');results.push({name,status,pdf,input:q,definition:t});continue;}
  results.push({name,status,input:q,definition:t});
 }
 writeFileSync(join(out,'results.json'),JSON.stringify({context,results},null,2));console.log(JSON.stringify({status:'PASS',cases:results.map(r=>({name:r.name,status:r.status.status,pdf:r.pdf?.path}))}));
}finally{await client.close();await transport.close();}
