import {execFileSync} from 'node:child_process';
import {readdirSync} from 'node:fs';
const files=readdirSync('tests').filter(n=>/^flowdocmake.*\.test\.mjs$/.test(n)).map(n=>'tests/'+n);
try{process.stdout.write(execFileSync(process.execPath,['--test','--test-concurrency=1',...files],{env:process.env,encoding:'utf8',maxBuffer:16*1024*1024,stdio:['ignore','pipe','pipe']}));}catch(e){process.stdout.write(String(e.stdout??''));process.stderr.write(String(e.stderr??''));process.exitCode=1;}
