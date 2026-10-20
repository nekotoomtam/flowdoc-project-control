import {open,stat,link,unlink} from 'node:fs/promises';import {createReadStream} from 'node:fs';import {createHash,randomBytes} from 'node:crypto';import {isAbsolute} from 'node:path';import {TextDecoder} from 'node:util';
import {request as httpRequest} from 'node:http';import {request as httpsRequest} from 'node:https';
const fail=(code='TASK_STREAM_INVALID',taskId=null)=>Object.assign(Error(code),{code,taskId});
const integer=n=>Number.isSafeInteger(n)&&n>=0;
/** Native request with explicit long-upload header budget; no implicit fetch/Undici 300s cap. */
export function taskRequest(url,{method='POST',headers={},body,signal,timing={},continueUpload=false}={}){
 const {headersMs=31*60*1000,idleMs=60000,totalMs=3*60*60*1000}=timing;
 const target=new URL(url);if(!['http:','https:'].includes(target.protocol))throw fail('TASK_REQUEST_INVALID');
 return new Promise((resolve,reject)=>{
  let responded=false,stopUpload=false,headerTimer,totalTimer;
  const timeout=()=>req.destroy(fail('TASK_REQUEST_TIMEOUT'));
  const clear=()=>{clearTimeout(headerTimer);clearTimeout(totalTimer);};
  const req=(target.protocol==='https:'?httpsRequest:httpRequest)(target,{method,headers,signal},res=>{
   responded=true;stopUpload=!continueUpload||res.statusCode<200||res.statusCode>=300;clearTimeout(headerTimer);res.once('end',clear);res.once('close',clear);res.on('error',()=>{});
   resolve({ok:res.statusCode>=200&&res.statusCode<300,status:res.statusCode,headers:{get:name=>{const v=res.headers[name.toLowerCase()];return Array.isArray(v)?v.join(','):v??null;}},body:res});
  });
  req.on('error',e=>{clear();if(!responded)reject(e);});req.setTimeout(idleMs,timeout);
  headerTimer=setTimeout(timeout,headersMs);totalTimer=setTimeout(timeout,totalMs);headerTimer.unref?.();totalTimer.unref?.();
  void(async()=>{try{const source=typeof body==='string'||Buffer.isBuffer(body)?[Buffer.from(body)]:body??[];for await(const raw of source){if(stopUpload)break;const bytes=Buffer.from(raw);for(let at=0;at<bytes.length;at+=65536){if(stopUpload)break;await new Promise((done,failed)=>req.write(bytes.subarray(at,at+65536),e=>e?failed(e):done()));}}if(!req.writableEnded)req.end();}catch(e){req.destroy(e);}})();
 });
}
/** Exact-length multipart reader; only headers/events and one <=64KiB binary slice retained. */
export async function consumeTaskResponse(source,contentType,{outputPath,onFeedback=()=>{},signal}={}){
 const match=/^multipart\/mixed\s*;\s*boundary=([A-Za-z0-9_-]{16,100})\s*;\s*flowdoc=task-v1$/i.exec(contentType??'');
 if(!match||!isAbsolute(outputPath))throw fail();const boundary=match[1],iterator=(async function*(){for await(const raw of source){const b=Buffer.from(raw);for(let at=0;at<b.length;at+=65536)yield b.subarray(at,at+65536);}})()[Symbol.asyncIterator]();let pending=Buffer.alloc(0),ended=false;
 async function more(){signal?.throwIfAborted();const r=await iterator.next();if(r.done){ended=true;return false;}const next=Buffer.from(r.value);if(pending.length+next.length>1024*1024)throw fail('TASK_STREAM_LIMIT');pending=pending.length?Buffer.concat([pending,next]):next;return true;}
 async function take(n){while(pending.length<n)if(!await more())throw fail();const b=pending.subarray(0,n);pending=pending.subarray(n);return b;}
 async function exact(text){if(!(await take(Buffer.byteLength(text))).equals(Buffer.from(text)))throw fail();}
 async function header(){while(true){const at=pending.indexOf('\r\n\r\n');if(at>=0){if(at>8192)throw fail();return (await take(at+4)).subarray(0,at).toString('ascii');}if(pending.length>8192||!await more())throw fail();}}
 let file,temp=outputPath+'.'+randomBytes(8).toString('hex')+'.part',taskId=null,artifact=null,seq=0,pdfSeen=false,error=null,totalEvents=0;
 try{
  await exact('--'+boundary);
  while(true){const separator=(await take(2)).toString();if(separator==='--'){await exact('\r\n');break;}if(separator!=='\r\n')throw fail();
   const lines=(await header()).split('\r\n'),headers=new Map();for(const line of lines){const at=line.indexOf(':');if(at<1)throw fail();const key=line.slice(0,at).toLowerCase();if(headers.has(key))throw fail();headers.set(key,line.slice(at+1).trim());}
   const rawLength=headers.get('content-length');if(!/^(0|[1-9]\d*)$/.test(rawLength??''))throw fail();const length=Number(rawLength),type=headers.get('content-type');if(!integer(length))throw fail();
   if(type==='application/json'){
    if(length>32768||pdfSeen||++totalEvents>100000)throw fail();let event;try{event=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(await take(length)));}catch{throw fail();}
    if(event.version!==1||event.seq!==seq+1||!/^[-a-f0-9]{36}$/.test(event.taskId)||taskId&&event.taskId!==taskId||!['task','progress','heartbeat','warning','artifact','error'].includes(event.type))throw fail();seq=event.seq;taskId=event.taskId;
    if(seq===1&&event.type!=='task'&&event.type!=='error')throw fail();
    if(event.type==='artifact'){if(artifact||event.status!=='sending'||event.detail?.mediaType!=='application/pdf'||!integer(event.detail.bytes)||event.detail.bytes<1||event.detail.bytes>256*1048576||!integer(event.detail.pageCount)||event.detail.pageCount<1||!/^[a-f0-9]{64}$/.test(event.detail.sha256)||!['complete','partial'].includes(event.detail.completeness))throw fail();artifact=event.detail;}
    if(event.type==='error')error=event.detail;
    await onFeedback(event);
   }else if(type==='application/pdf'){
    if(pdfSeen||error||!artifact||length!==artifact.bytes)throw fail();pdfSeen=true;file=await open(temp,'wx',0o600);const hash=createHash('sha256');let left=length;
    while(left){if(!pending.length&&!await more())throw fail();const b=await take(Math.min(left,pending.length,65536));hash.update(b);let offset=0;while(offset<b.length){const w=await file.write(b,offset,b.length-offset);if(!w.bytesWritten)throw fail('PDF_SAVE_FAILED');offset+=w.bytesWritten;}left-=b.length;}
    if(hash.digest('hex')!==artifact.sha256)throw fail('PDF_INTEGRITY',taskId);await file.sync();await file.close();file=undefined;
   }else throw fail();
   await exact('\r\n--'+boundary);
  }
  if(pending.length||!ended&&await more())throw fail();if(error)throw fail(error.code??'TASK_FAILED',taskId);if(!pdfSeen||!artifact)throw fail();
  // Atomic exclusive publication: never replace a caller's existing file.
  await link(temp,outputPath);await unlink(temp);temp=null;
  return {ok:true,taskId,path:outputPath,bytes:artifact.bytes,sha256:artifact.sha256,pageCount:artifact.pageCount,completeness:artifact.completeness,delivery:'response-complete',serverReceipt:'not-confirmed'};
 }catch(e){if(e.taskId==null)e.taskId=taskId;throw e;}finally{await file?.close().catch(()=>{});if(temp)await unlink(temp).catch(()=>{});await iterator.return?.();}
}
export async function generateDocumentTask({baseUrl,token,docKey,payloadPath,images=[],outputPath,onFeedback,signal,queueMode=false,queueCapability,fetch:request=taskRequest}){
 if(queueMode&&(queueCapability?.mode!=='queue-v1'||queueCapability.earlyResponse!==true||queueCapability.continuedUpload!==true))throw fail('TASK_CAPABILITY_UNSUPPORTED');
 if(!isAbsolute(payloadPath)||!isAbsolute(outputPath)||typeof docKey!=='string'||!docKey||/[\r\n,]/.test(docKey)||images.length>1000)throw fail('TASK_INPUT_INVALID');
 const payload=await stat(payloadPath);if(!payload.isFile()||payload.size>64*1048576)throw fail('TASK_INPUT_LIMIT');
 const names=new Set();for(const image of images){if(!isAbsolute(image.path)||typeof image.pointer!=='string'||!image.pointer.startsWith('/')||/[\x00-\x1f\x7f]/.test(image.pointer)||Buffer.byteLength(image.pointer)>2048||names.has(image.pointer))throw fail('TASK_INPUT_INVALID');names.add(image.pointer);}
 const boundary='flowdoc-'+randomBytes(32).toString('base64url');let bytes=0;
 async function* body(){for(const item of [{pointer:'payload',path:payloadPath,type:'application/json'},...images]){
  const quote=item.pointer.replaceAll('\\','\\\\').replaceAll('"','\\"');yield Buffer.from('--'+boundary+'\r\nContent-Disposition: form-data; name="'+quote+'"\r\nContent-Type: '+(item.type??(/\.png$/i.test(item.path)?'image/png':'image/jpeg'))+'\r\n\r\n');
  for await(const b of createReadStream(item.path,{highWaterMark:65536,...(signal?{signal}:{})})){bytes+=b.length;if(bytes>512*1048576)throw fail('TASK_INPUT_LIMIT');yield b;}yield Buffer.from('\r\n');}yield Buffer.from('--'+boundary+'--\r\n');}
 const stop=new AbortController(),operation=AbortSignal.any([stop.signal,...(signal?[signal]:[])]);
 try{const response=await request(new URL('/documents',baseUrl),{method:'POST',headers:{authorization:'Bearer '+token,'doc-key':docKey,'content-type':'multipart/form-data; boundary='+boundary,accept:'multipart/mixed',...(queueMode?{'task-mode':'queue-v1'}:{})},body:body(),continueUpload:queueMode,duplex:queueMode?'full':'half',redirect:'error',signal:operation});
 if(!response.ok){let size=0,chunks=[];for await(const b of response.body){size+=b.length;if(size>32768)throw fail();chunks.push(b);}let result;try{result=JSON.parse(Buffer.concat(chunks).toString());}catch{throw fail('TASK_REQUEST_FAILED');}throw fail(result.error?.code??'TASK_REQUEST_FAILED',result.taskId);}
 return await consumeTaskResponse(response.body,response.headers.get('content-type'),{outputPath,onFeedback,signal:operation});
 }finally{stop.abort();}
}
export async function inspectDocumentTask({baseUrl,token,taskId,findingsCursor,findingsLimit,signal,timeoutMs=15000,fetch:request=taskRequest}){
 if(!Number.isInteger(timeoutMs)||timeoutMs<1||timeoutMs>15000)throw fail('TASK_INPUT_INVALID');const stop=new AbortController(),operation=AbortSignal.any([stop.signal,AbortSignal.timeout(timeoutMs),...(signal?[signal]:[])]);
 try{const response=await request(new URL('/documents',baseUrl),{method:'POST',headers:{authorization:'Bearer '+token,'content-type':'application/json'},body:JSON.stringify({taskId,...(findingsCursor?{findingsCursor}:{}),...(findingsLimit?{findingsLimit}:{})}),redirect:'error',signal:operation,timing:{headersMs:timeoutMs,totalMs:timeoutMs,idleMs:timeoutMs}});let size=0,chunks=[];for await(const b of response.body){size+=b.length;if(size>256*1024)throw fail();chunks.push(b);}return JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(Buffer.concat(chunks)));}finally{stop.abort();}
}
