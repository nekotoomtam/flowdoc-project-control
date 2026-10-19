import {test} from 'node:test';
import assert from 'node:assert/strict';
import {assess} from '../plugins/flowdocmake/scripts/compatibility.mjs';
const good={contract:{nodeModelVersions:[18,19],formatSizing:{version:2,nodeModelVersions:[19],fontSchemaVersions:[1,2],modes:['auto','fixed'],fixedContexts:['section-flow-root'],diagnosticsVersion:1},sectionInstances:{model:19,input:'array-by-id',assembly:'saved-definition',stage:3,coverArea:true,scopedToc:true},draftDefinitionVersion:1,publicationEnabled:false,schemaVersions:[1,2],fonts:{selection:'exact-release-weight-style',syntheticFaces:false,automaticFallback:false,adminSeparate:true,heightAdjustment:{methodId:'thai-bo-baseline-top-v1',optIn:true,proposalTtlSeconds:900,precisionDecimals:6,layoutCheck:'not_checked'}}},runtime:{service:'0.4.8',core:'0.4.7',coreArtifactSha256:'e79726b50f8aa2d8436d003aaf0727f87ed86b8e615ee8dc0a59b041c2dc2d5a',port:'3018'},pdf:true};
test('exact release is required; unknown and newer builds fail closed',()=>{
 assert.equal(assess(good).ready,true);
 for(const runtime of [null,{service:'0.3.1',core:'0.3.0',port:'3018'},{service:'0.3.0',core:'0.3.0',port:'9999'}]) assert.equal(assess({...good,runtime}).ready,false);
});
test('publication, legacy models, unavailable reader cannot pass',()=>{
 for(const contract of [{...good.contract,publicationEnabled:true},{...good.contract,nodeModelVersions:[17,18]},{...good.contract,draftDefinitionVersion:2}]) assert.equal(assess({...good,contract}).ready,false);
 assert.equal(assess({...good,pdf:false}).code,'PDF_READER_MISSING');
});

test('font contract and pinned Core artifact are mandatory; configured isolated ports must match inspected mappings',()=>{assert.equal(assess({...good,runtime:{...good.runtime,port:'3028'},expectedPort:'3028'}).ready,true);assert.equal(assess({...good,runtime:{...good.runtime,coreArtifactSha256:'a'.repeat(64)}}).ready,false);assert.equal(assess({...good,contract:{...good.contract,fonts:undefined}}).ready,false);});

test('height candidate requires both the advertised helper and the exact new runtime artifact',()=>{const contract={...good.contract,fonts:{...good.contract.fonts,heightAdjustment:{methodId:'thai-bo-baseline-top-v1',optIn:true,proposalTtlSeconds:900,precisionDecimals:6,layoutCheck:'not_checked'}}},runtime={service:'0.4.8',core:'0.4.7',coreArtifactSha256:'e79726b50f8aa2d8436d003aaf0727f87ed86b8e615ee8dc0a59b041c2dc2d5a',port:'3018'};assert.equal(assess({...good,contract,runtime}).ready,true);assert.equal(assess({...good,runtime:{...runtime,core:'0.4.0'}}).ready,false);assert.equal(assess({...good,contract,runtime:{...runtime,coreArtifactSha256:'a'.repeat(64)}}).ready,false);});
