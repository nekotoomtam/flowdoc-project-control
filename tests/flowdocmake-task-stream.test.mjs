import {test} from 'node:test';import assert from 'node:assert/strict';import {mkdtemp,readFile,readdir} from 'node:fs/promises';import {tmpdir} from 'node:os';import {join} from 'node:path';import {createHash} from 'node:crypto';
import {createServer} from 'node:http';
const boundary='flowdoc-'+'b'.repeat(64),type='multipart/mixed; boundary='+boundary+'; flowdoc=task-v1',id='10000000-0000-4000-8000-000000000001';
function sample({badHash=false,truncated=false,error=false}={}){
 const pdf=Buffer.from('%PDF-1.7\n\0\xffraw\r\n--strange boundary\r\n%%EOF','latin1'),hash=createHash('sha256').update(pdf).digest('hex');
 const event=(seq,kind,detail)=>Buffer.from(JSON.stringify({version:1,seq,type:kind,taskId:id,at:'2026-10-19T00:00:00Z',status:kind==='artifact'?'sending':'validating',eventSeq:null,detail}));
 const part=(t,b)=>Buffer.concat([Buffer.from('--'+boundary+'\r\nContent-Type: '+t+'\r\nContent-Length: '+b.length+'\r\n\r\n'),b,Buffer.from('\r\n')]);
 const pieces=[part('application/json',event(1,'task',{}))];if(error)pieces.push(part('application/json',event(2,'error',{code:'INVALID_DATA',stage:'validating',message:'Cannot complete'})));else pieces.push(part('application/json',event(2,'artifact',{mediaType:'application/pdf',bytes:pdf.length,sha256:badHash?'a'.repeat(64):hash,pageCount:1,completeness:'partial'})),part('application/pdf',pdf));pieces.push(Buffer.from('--'+boundary+'--\r\n'));const all=Buffer.concat(pieces);return {all:truncated?all.subarray(0,-3):all,pdf,hash};
}
test('incremental task parser saves exact binary and hash across every one-byte split',async()=>{
 const {consumeTaskResponse}=await import('../plugins/flowdocmake/scripts/task-client.mjs'),s=sample(),dir=await mkdtemp(join(tmpdir(),'task-client-')),path=join(dir,'out.pdf'),events=[];
 const bytes=(async function*(){for(const b of s.all)yield Buffer.from([b]);})();const r=await consumeTaskResponse(bytes,type,{outputPath:path,onFeedback:e=>events.push(e)});
 assert.equal(r.sha256,s.hash);assert.equal(r.completeness,'partial');assert.equal(r.taskId,id);assert.deepEqual(await readFile(path),s.pdf);assert.equal(events.length,2);
});
for(const [name,opts] of [['bad digest',{badHash:true}],['truncated final delimiter',{truncated:true}],['closed error envelope',{error:true}]])test('task parser rejects '+name+' without publishing a partial PDF',async()=>{
 const {consumeTaskResponse}=await import('../plugins/flowdocmake/scripts/task-client.mjs'),s=sample(opts),dir=await mkdtemp(join(tmpdir(),'task-client-'));
 await assert.rejects(consumeTaskResponse((async function*(){yield s.all;})(),type,{outputPath:join(dir,'out.pdf')}));assert.deepEqual(await readdir(dir),[]);
});
test('request producer uses an RFC-sized boundary with streamed local parts',async()=>{
 const {generateDocumentTask}=await import('../plugins/flowdocmake/scripts/task-client.mjs'),dir=await mkdtemp(join(tmpdir(),'task-request-')),payloadPath=join(dir,'p.json');await (await import('node:fs/promises')).writeFile(payloadPath,'{}');const s=sample();
 await generateDocumentTask({baseUrl:'http://127.0.0.1',token:'test',docKey:'example',payloadPath,outputPath:join(dir,'out.pdf'),fetch:async(_url,init)=>{const b=init.headers['content-type'].split('boundary=')[1];assert(b.length<=70,'RFC2046 limits multipart boundary to70 characters');let bytes=0;for await(const chunk of init.body)bytes+=chunk.length;assert(bytes>2);return new Response(s.all,{headers:{'content-type':type}});}});
});
test('task transport waits for a slow completed upload within its explicit header budget and enforces that budget',async()=>{
 const {taskRequest}=await import('../plugins/flowdocmake/scripts/task-client.mjs');assert.equal(typeof taskRequest,'function');const server=createServer(async(req,res)=>{try{for await(const _ of req){}res.end('ok');}catch{res.destroy();}});await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const slow=async function*(){for(let i=0;i<4;i++){await new Promise(r=>setTimeout(r,40));yield Buffer.from('a');}};
 try{const response=await taskRequest(new URL('http://127.0.0.1:'+server.address().port),{method:'POST',body:slow(),timing:{headersMs:400,idleMs:200,totalMs:1000}});let text='';for await(const b of response.body)text+=b;assert.equal(text,'ok');await assert.rejects(taskRequest(new URL('http://127.0.0.1:'+server.address().port),{method:'POST',body:slow(),timing:{headersMs:20,idleMs:200,totalMs:1000}}));}finally{server.closeAllConnections();await new Promise(r=>server.close(r));}
});
test('lookup has a total deadline even when response bytes keep arriving',async()=>{
 const {inspectDocumentTask}=await import('../plugins/flowdocmake/scripts/task-client.mjs');const server=createServer((req,res)=>{req.resume();res.writeHead(200,{'Content-Type':'application/json'});res.write('{');const timer=setInterval(()=>res.write(' '),10),end=setTimeout(()=>res.end('}'),300);res.once('close',()=>{clearInterval(timer);clearTimeout(end);});});await new Promise(r=>server.listen(0,'127.0.0.1',r));const start=Date.now();
 try{await assert.rejects(inspectDocumentTask({baseUrl:'http://127.0.0.1:'+server.address().port,token:'test',taskId:id,timeoutMs:50}));assert(Date.now()-start<200);}finally{server.closeAllConnections();await new Promise(r=>server.close(r));}
});
