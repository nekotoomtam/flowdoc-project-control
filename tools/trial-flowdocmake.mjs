import {Client} from '../../flowdoc-service/node_modules/@modelcontextprotocol/client/dist/index.mjs';
import {StdioClientTransport} from '../../flowdoc-service/node_modules/@modelcontextprotocol/client/dist/stdio.mjs';
import {readFileSync,mkdirSync,writeFileSync,existsSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {homedir} from 'node:os';
import assert from 'node:assert/strict';
const kind=process.argv[2]??'reference',out=resolve('artifacts/flowdocmake/'+kind);mkdirSync(out,{recursive:true});
const record=join(out,'checkpoint.json');
const state=existsSync(record)?JSON.parse(readFileSync(record,'utf8')):{key:'flowdocmake-'+kind+'-'+Date.now()};
const save=()=>writeFileSync(record,JSON.stringify(state,null,2));save();
const plugin=join(homedir(),'.codex/plugins/cache/flowdoc-local/flowdocmake/0.1.0');
const client=new Client({name:'flowdocmake-trial',version:'0.1.0'}),transport=new StdioClientTransport({command:process.execPath,args:[join(plugin,'scripts/server.mjs')],stderr:'pipe'});
const call=async(name,args)=>{const r=await client.callTool({name,arguments:args});const p=JSON.parse(r.content[0].text);assert(!r.isError&&p.ok!==false,JSON.stringify(p));return p.value??p;};
try{
 await client.connect(transport);assert((await call('get_flowdocmake_context',{})).ready);
 const source=kind==='full'?resolve('../flowdoc-service/artifacts/release030/area98'):resolve('docs/examples/ai-template-authoring');
 let definition=JSON.parse(readFileSync(join(source,kind==='full'?'template.json':'reference-template.json'),'utf8'));
 let request=JSON.parse(readFileSync(join(source,kind==='full'?'request.json':'reference-request.json'),'utf8'));
 // Use the exact release acceptance fixture: its established rocket substitution is explicit.
 if(kind==='full')request=JSON.parse(JSON.stringify(request).replaceAll('🚀','จรวด'));
 const create={name:'Flowdocmake verification '+kind,docKey:state.key,idempotencyKey:state.key+'-create'};
 state.createPayload=create;save();
 if(!state.draft){state.draft=await call('create_template_draft',create);save();}
 assert.equal((await call('create_template_draft',create)).templateId,state.draft.templateId);
 definition.templateId=state.draft.templateId;definition.docKey=request.docKey=state.draft.docKey;
 const images=kind==='full'?JSON.parse(readFileSync(join(source,'upload-files.json'),'utf8')).map(f=>({...f,bytes:readFileSync(join(source,f.file))})):[{id:request.data.headerBanner,bytes:readFileSync(resolve('artifacts/flowdocmake/banner.png'))}];
 if(!state.upload){state.upload=await call('create_preview_upload',{requestKey:state.key,items:images.map((f,i)=>({key:'image'+i,source:'upload',mediaType:'image/png',byteSize:f.bytes.length}))});save();
 }
 if(!state.uploadReady){for(let i=0;i<images.length;i++)await call('upload_preview_image_file',{uploadId:state.upload.uploadId,resourceId:state.upload.items[i].resourceId,path:kind==='full'?join(source,images[i].file):resolve('artifacts/flowdocmake/banner.png')});await call('finalize_preview_upload',{uploadId:state.upload.uploadId});state.uploadReady=true;save();}
 for(let i=0;i<images.length;i++)request=JSON.parse(JSON.stringify(request).replaceAll(images[i].id,state.upload.items[i].resourceId));
 state.validation=await call('validate_template',{definition,sampleRequest:request});save();
 if(!state.saved){const fresh=await call('get_template_draft',{templateId:state.draft.templateId});state.updatePayload={templateId:fresh.templateId,expectedRevision:fresh.revision,definition,idempotencyKey:state.key+'-save'};save();state.saved=await call('update_template_draft',state.updatePayload);save();}
 assert.equal((await call('update_template_draft',state.updatePayload)).revision,state.saved.revision);
 if(!state.job){state.previewPayload={templateId:state.saved.templateId,expectedRevision:state.saved.revision,sampleRequest:{...request,uploadId:state.upload.uploadId},idempotencyKey:state.key+'-preview'};save();state.job=await call('preview_template_draft',state.previewPayload);save();}
 assert.equal((await call('preview_template_draft',state.previewPayload)).jobId,state.job.jobId);
 for(let i=0;i<120;i++){state.status=await call('get_preview_status',{jobId:state.job.jobId});save();if(state.status.status==='succeeded')break;assert.notEqual(state.status.status,'failed',JSON.stringify(state.status));await new Promise(r=>setTimeout(r,2000));}
 assert.equal(state.status.status,'succeeded');
 if(!state.pdf){state.pdf=await call('save_preview_pdf',{jobId:state.job.jobId});save();}
 console.log(JSON.stringify({kind,templateId:state.saved.templateId,revision:state.saved.revision,pdf:state.pdf}));
}finally{await client.close();await transport.close();}
