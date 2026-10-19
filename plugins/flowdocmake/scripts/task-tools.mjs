import {readFile} from 'node:fs/promises';
import {generateDocumentTask,inspectDocumentTask} from './task-client.mjs';
import {supported} from './compatibility.mjs';
export function registerTaskTools(server,{z,config,authoringToken}){
 async function credential(){
  if(!config.taskCredentialFile)throw Object.assign(Error(),{code:'TASK_CREDENTIAL_NOT_CONFIGURED'});
  const raw=await readFile(config.taskCredentialFile);if(raw.length>4096)throw Object.assign(Error(),{code:'TASK_CREDENTIAL_INVALID'});
  const token=raw.toString().match(/^TASK_TOKEN=([^\r\n]+)$/m)?.[1];if(!token||token.length<32)throw Object.assign(Error(),{code:'TASK_CREDENTIAL_INVALID'});return token;
 }
 async function capability(signal){
  const response=await fetch(new URL('/authoring/contract',config.url),{headers:{authorization:'Bearer '+authoringToken},redirect:'error',signal:AbortSignal.any([AbortSignal.timeout(10000),...(signal?[signal]:[])])});
  if(!response.ok)throw Object.assign(Error(),{code:'TASK_CAPABILITY_UNAVAILABLE'});
  const c=(await response.json()).value?.documents;
  if(c?.version!==1||c.route!=='/documents'||c.input!=='section-assets-multipart-v1'||c.response!=='task-v1'||c.lookup!=='exact-record-only'||c.serviceVersion!==supported.service||c.coreVersion!==supported.core||c.coreSha256!==supported.coreArtifactSha256)throw Object.assign(Error(),{code:'TASK_CAPABILITY_UNSUPPORTED'});
 }
 const result=async run=>{try{return {content:[{type:'text',text:JSON.stringify(await run())}]};}catch(e){return {isError:true,content:[{type:'text',text:JSON.stringify({ok:false,code:/^[A-Z_]+$/.test(e.code??'')?e.code:'TASK_REQUEST_FAILED',taskId:e.taskId??null})}]};}};
 server.registerTool('generate_document_task',{description:'Generate a PDF through one authenticated task request using an existing authorized document key. Stream a local payload JSON file and optional pointer-associated JPEG/PNG files; Section assets and assetKey remain in the payload. Incrementally verify and save PDF to a new absolute output path. Never retries automatically, publishes a template, resumes or downloads a prior task. A new call creates new work. Requires separate configured task credential.',inputSchema:z.object({docKey:z.string().min(1).max(200),payloadPath:z.string().min(1),images:z.array(z.object({pointer:z.string().min(1),path:z.string().min(1),type:z.enum(['image/jpeg','image/png']).optional()}).strict()).max(1000).optional(),outputPath:z.string().min(1)}).strict(),annotations:{readOnlyHint:false,destructiveHint:false,idempotentHint:false,openWorldHint:false}},(args,extra)=>result(async()=>{
  await capability(extra?.mcpReq?.signal);const token=await credential();let lastTask=null,lastWarning=null;
  const r=await generateDocumentTask({...args,baseUrl:config.url,token,signal:extra?.mcpReq?.signal,onFeedback:async event=>{if(event.type==='task')lastTask=event;if(event.type==='warning')lastWarning=event;const progressToken=extra?.mcpReq?._meta?.progressToken;if(progressToken!==undefined&&extra?.mcpReq?.notify)await extra.mcpReq.notify({method:'notifications/progress',params:{progressToken,progress:event.seq,message:event.type+': '+event.status+' ('+event.taskId+')'}});}});
  return {...r,task:lastTask?.detail??null,warning:lastWarning?.detail??null};
 }));
 server.registerTool('inspect_document_task',{description:'Read the exact owned task record, including permanent status and paginated findings. Does not create, renew, resume, regenerate or download a PDF.',inputSchema:z.object({taskId:z.string().uuid(),findingsCursor:z.string().max(512).optional(),findingsLimit:z.number().int().min(1).max(100).optional()}).strict(),annotations:{readOnlyHint:true,destructiveHint:false,idempotentHint:true,openWorldHint:false}},(args,extra)=>result(async()=>{await capability(extra?.mcpReq?.signal);return inspectDocumentTask({...args,baseUrl:config.url,token:await credential(),signal:extra?.mcpReq?.signal});}));
}
