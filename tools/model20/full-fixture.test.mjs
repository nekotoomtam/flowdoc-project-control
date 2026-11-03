import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {convertLegacyBundle} from './convert-legacy.mjs';
import {compose,documentFacts} from './parity.mjs';
const legacyCore=await import(pathToFileURL(process.env.LEGACY_CORE).href);
const targetCore=await import(pathToFileURL(process.env.TARGET_CORE).href);
for(const name of ['uat-full','srs-existing'])test(name+' full immutable bundle converts',async()=>{
 const read=async suffix=>JSON.parse(await readFile(new URL(`./${name}.${suffix}.json`,import.meta.url),'utf8'));
 const bundle={template:await read('template'),request:await read('payload'),requestKind:'task',imageParts:await read('images')};
 const r=await convertLegacyBundle(bundle,{legacyCore,targetCore});assert.equal(r.ok,true,JSON.stringify(r));
 assert.equal(r.value.template.sections.length,bundle.template.sections.length);
 assert.equal(r.value.imageParts.length,bundle.imageParts.length);
 assert.deepEqual(r.value.template.styles,bundle.template.styles);
 if(process.env.PARITY==='1'){
  const before=documentFacts(await compose(legacyCore,bundle.template,bundle.request,bundle.imageParts),r.value.mapping,bundle.template.nodeModelVersion);
  const after=documentFacts(await compose(targetCore,r.value.template,r.value.request,r.value.imageParts),r.value.mapping,bundle.template.nodeModelVersion,true);
  assert.deepEqual(after,before);
  console.log(JSON.stringify({fixture:name,compositionParity:true,nodes:after.graph.length,sections:after.sections.length}));
 }
 console.log(JSON.stringify({fixture:name,sourceDigest:r.value.sourceDigest,targetDigest:r.value.targetDigest,definitions:r.value.mapping.length,imageParts:r.value.imageParts.length,validation:r.value.validation}));
});
