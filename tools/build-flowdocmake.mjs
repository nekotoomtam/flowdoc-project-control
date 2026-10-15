import {readFileSync,writeFileSync,mkdirSync,readdirSync,copyFileSync} from 'node:fs';
import {resolve,join,dirname,relative} from 'node:path';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const repo=resolve(import.meta.dirname,'..'),plugin=join(repo,'plugins/flowdocmake');
const roots=['docs/developer/authoring','docs/examples/ai-template-authoring','docs/domains/flowdoc-ai-template-authoring-guide.md','docs/domains/flowdoc-area-document-transition-2026-10-14.md','docs/domains/flowdoc-template-authoring-tools-plan.md','tools/check-developer-authoring.mjs','tools/check-developer-authoring-pdf.py'];
const sourceCommit=execFileSync('git',['rev-parse','HEAD'],{cwd:repo,encoding:'utf8'}).trim();
const dirty=execFileSync('git',['status','--porcelain','--',...roots],{cwd:repo,encoding:'utf8'}).trim();
if(dirty)throw Error('Commit canonical guide sources before snapshotting');
const files={};
function copy(path){
 const abs=join(repo,path);
 if(!/\.(md|json|mjs|py)$/.test(path)){for(const entry of readdirSync(abs,{withFileTypes:true}))copy(path+'/'+entry.name);return;}
 const target='skills/flowdocmake/references/'+path;
 mkdirSync(dirname(join(plugin,target)),{recursive:true});copyFileSync(abs,join(plugin,target));
 files[target]=createHash('sha256').update(readFileSync(abs)).digest('hex');
}
for(const root of roots)copy(root);
writeFileSync(join(plugin,'snapshot.json'),JSON.stringify({packageVersion:'0.1.0',guideRelease:'0.3.0',sourceCommit,files},null,2)+'\n');
console.log(JSON.stringify({sourceCommit,files:Object.keys(files).length}));
