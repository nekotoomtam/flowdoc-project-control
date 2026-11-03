import {readFile,mkdir,writeFile,rename,rm,rmdir,realpath} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {createHash,randomUUID} from 'node:crypto';
import {convertLegacyBundle} from './convert-legacy.mjs';

// Deliberately local/offline. SDK dependency/native archive attestation belongs
// to the frozen lab receipt; an entrypoint hash alone cannot certify its tree.
const args=process.argv.slice(2),options={};
try{
 for(let i=0;i<args.length;i++){
  const key=args[i];if(key==='--dry-run'){options.dryRun=true;continue;}
  if(!['--input','--output','--legacy-core','--target-core'].includes(key)||!args[i+1]||args[i+1].startsWith('--')||key in options)throw Error('Invalid CLI arguments');
  options[key]=args[++i];
 }
 for(const key of ['--input','--legacy-core','--target-core'])if(!options[key])throw Error('Required: --input --legacy-core --target-core, and --output unless --dry-run');
 if(!options.dryRun&&!options['--output'])throw Error('Required --output');
 const input=await realpath(options['--input']),legacy=await realpath(options['--legacy-core']),target=await realpath(options['--target-core']);
 const legacyCore=await import(pathToFileURL(legacy).href),targetCore=await import(pathToFileURL(target).href);
 const result=await convertLegacyBundle(JSON.parse((await readFile(input,'utf8')).replace(/^\uFEFF/,'')),{legacyCore,targetCore});
 if(!result.ok){console.log(JSON.stringify(result,null,2));process.exitCode=2;}
 else{
  const sha=x=>createHash('sha256').update(x).digest('hex');
  const manifest={input,sourceDigest:result.value.sourceDigest,targetDigest:result.value.targetDigest,mapping:result.value.mapping,validation:result.value.validation,
   sdkEntrypoints:{scope:'entrypoints only; complete dependency/archive identity requires the external lab receipt',legacy:{path:legacy,sha256:sha(await readFile(legacy))},target:{path:target,sha256:sha(await readFile(target))}}};
  if(options.dryRun)console.log(JSON.stringify({ok:true,dryRun:true,manifest},null,2));
  else{
   const destination=resolve(options['--output']);
   // mkdir without recursive refuses existing output. A failed run leaves no
   // partial conversion that another process could mistake for a complete one.
   await mkdir(destination);let staging;
   try{
    staging=join(destination,'.pending-'+randomUUID());await mkdir(staging);
    for(const [name,value]of Object.entries({'bundle.json':result.value,'manifest.json':manifest}))await writeFile(join(staging,name),JSON.stringify(value,null,2)+'\n',{flag:'wx'});
    await rename(staging,join(destination,'complete'));
    console.log(JSON.stringify({ok:true,output:join(destination,'complete'),manifest}));
   }catch(e){if(staging)await rm(staging,{recursive:true,force:true});await rmdir(destination).catch(()=>{});throw e;}
  }
 }
}catch(e){console.error(JSON.stringify({ok:false,error:e.message}));process.exitCode=1;}
