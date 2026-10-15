// Mechanical draft-only reuse after source inspection. Never certifies fidelity.
import {readFileSync,writeFileSync,mkdirSync,existsSync,copyFileSync,constants} from 'node:fs';
import {join,resolve} from 'node:path';
import {homedir} from 'node:os';
import {pathToFileURL} from 'node:url';
import {createHash,randomUUID} from 'node:crypto';
import {checkCoverage} from './reference-coverage.mjs';
const read=p=>JSON.parse(readFileSync(p,'utf8'));
const hash=v=>createHash('sha256').update(v).digest('hex');
const plan=read(process.argv[2]),inventory=read(plan.inventoryPath),coverage=read(plan.coveragePath);
const sourceCheck=checkCoverage(coverage,inventory.source,'source');
if(!sourceCheck.ok||hash(readFileSync(inventory.source.path))!==inventory.source.sha256)throw Error('Source inspection/coverage must pass before reuse');
if(!plan.docKey||!plan.name||!plan.workDirectory||!plan.candidateDirectory)throw Error('Missing plan identity/paths');
const directory=resolve(plan.candidateDirectory),definition=read(join(directory,'template.json'));
let request=read(join(directory,'request.json'));
if(definition.schemaVersion!==1||definition.nodeModelVersion!==18)throw Error('Only schema1/Area18 supported');
for(const change of plan.replacements??[]){
 if(!change.from||!change.to||!change.evidence)throw Error('Replacement requires exact source, target and PDF evidence');
 const text=JSON.stringify(request);if(!text.includes(change.from))throw Error('Replacement source not found');
 request=JSON.parse(text.replaceAll(change.from,change.to));
}
const assets=existsSync(join(directory,'upload-files.json'))?read(join(directory,'upload-files.json')):[];
const identity=hash(JSON.stringify({plan,source:inventory.source.sha256,definition,request,assets:assets.map(a=>({id:a.id,hash:hash(readFileSync(join(directory,a.file)))}))}));
if(process.argv.includes('--check')){console.log(JSON.stringify({ready:true,sourcePages:inventory.source.pageCount,parts:coverage.parts.length,assets:assets.length,planHash:identity,mutated:false}));process.exit(0);}
const out=resolve(plan.workDirectory);mkdirSync(out,{recursive:true});const checkpoint=join(out,'candidate-checkpoint.json');
const state=existsSync(checkpoint)?read(checkpoint):{planHash:identity,key:randomUUID(),calls:{},source:inventory.source};
if(state.planHash!==identity)throw Error('Plan/candidate changed; preserve this checkpoint and reconcile before resuming');
const save=()=>writeFileSync(checkpoint,JSON.stringify(state,null,2)+'\n');save();
const config=read(join(homedir(),'.codex/flowdocmake.local.json'));
const load=p=>import(pathToFileURL(join(config.serviceRoot,p)).href);
const {Client}=await load('node_modules/@modelcontextprotocol/client/dist/index.mjs');
const {StdioClientTransport}=await load('node_modules/@modelcontextprotocol/client/dist/stdio.mjs');
const wiring=read(join(config.pluginRoot,'.mcp.json')).mcpServers.flowdocmake;
const client=new Client({name:'flowdocmake-verified-reuse',version:'0.1.1'}),transport=new StdioClientTransport({...wiring,command:process.execPath,stderr:'pipe'});
async function call(step,tool,args,cache=true){
 if(cache&&state.calls[step]?.value)return state.calls[step].value;
 if(cache){const old=state.calls[step];if(old&&JSON.stringify(old.args)!==JSON.stringify(args))throw Error('Mutation payload changed: '+step);state.calls[step]={...old,tool,args};save();}
 const response=await client.callTool({name:tool,arguments:args});
 let parsed;try{parsed=JSON.parse(response.content.find(x=>x.type==='text')?.text??'{}');}catch{throw Error('Non-JSON tool failure: '+step);}
 if(response.isError||parsed.ok===false){state.failure={step,response};save();throw Error('Authoring failed at '+step+'; inspect checkpoint');}
 const value=parsed.value??parsed;if(cache){state.calls[step].value=value;save();}
 console.log(JSON.stringify({step,ok:true,templateId:value.templateId,revision:value.revision,jobId:value.jobId,status:value.status}));return value;
}
try{
 await client.connect(transport);const context=await call('context','get_flowdocmake_context',{},false);if(!context.ready)throw Error('Preflight not ready');state.context=context;save();
 const draft=await call('create','create_template_draft',{name:plan.name,docKey:plan.docKey,idempotencyKey:state.key+'-create'});
 definition.templateId=draft.templateId;definition.docKey=request.docKey=draft.docKey;definition.version=1;
 await call('validate','validate_template',{definition,sampleRequest:request});
 let current;
 if(state.calls.save?.args)current={revision:state.calls.save.args.expectedRevision};else current=await call('current','get_template_draft',{templateId:draft.templateId},false);
 const saved=await call('save','update_template_draft',{templateId:draft.templateId,expectedRevision:current.revision,definition,idempotencyKey:state.key+'-save'});
 let upload;
 if(assets.length){
  upload=await call('upload','create_preview_upload',{requestKey:state.key+'-images',items:assets.map((a,i)=>({key:'asset'+i,source:'upload',mediaType:a.file.toLowerCase().endsWith('.png')?'image/png':'image/jpeg',byteSize:readFileSync(join(directory,a.file)).length}))});
  for(let i=0;i<assets.length;i++)await call('image'+i,'upload_preview_image_file',{uploadId:upload.uploadId,resourceId:upload.items[i].resourceId,path:resolve(directory,assets[i].file)});
  await call('finalize','finalize_preview_upload',{uploadId:upload.uploadId});
  for(let i=0;i<assets.length;i++)request=JSON.parse(JSON.stringify(request).replaceAll(assets[i].id,upload.items[i].resourceId));
 }
 const job=await call('preview','preview_template_draft',{templateId:draft.templateId,expectedRevision:saved.revision,sampleRequest:{...request,...(upload?{uploadId:upload.uploadId}:{})},idempotencyKey:state.key+'-preview'});
 for(let i=0;i<120;i++){state.status=await call('status','get_preview_status',{jobId:job.jobId},false);save();if(state.status.status==='succeeded')break;if(state.status.status==='failed')throw Error('Render failed; preserve checkpoint and failing input');await new Promise(r=>setTimeout(r,2000));}
 if(state.status.status!=='succeeded')throw Error('Preview still pending; resume the same checkpoint');
 const pdf=await call('pdf','save_preview_pdf',{jobId:job.jobId});
 const copy=join(out,'preview.pdf');if(!existsSync(copy))copyFileSync(pdf.path,copy,constants.COPYFILE_EXCL);if(hash(readFileSync(copy))!==pdf.sha256)throw Error('Saved PDF identity changed');
 state.output={...pdf,path:copy,templateId:draft.templateId,revision:saved.revision};save();
 console.log(JSON.stringify({pdfReady:true,reviewRequired:true,checkpoint,output:state.output,warnings:state.status.warnings??[]}));
}finally{await client.close();await transport.close();}
