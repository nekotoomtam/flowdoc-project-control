import {test} from 'node:test';
import assert from 'node:assert/strict';
import {assess} from '../plugins/flowdocmake/scripts/compatibility.mjs';
const good={contract:{nodeModelVersions:[18],draftDefinitionVersion:1,publicationEnabled:false,schemaVersions:[1,2],fonts:{selection:'exact-release-weight-style',syntheticFaces:false,automaticFallback:false,adminSeparate:true}},runtime:{service:'0.4.0',core:'0.4.0',coreArtifactSha256:'6e8b71976de35456eed8cdb88a3c42305947e20e900944e3108cb0cc5c36d7e8',port:'3018'},pdf:true};
test('exact release is required; unknown and newer builds fail closed',()=>{
 assert.equal(assess(good).ready,true);
 for(const runtime of [null,{service:'0.3.1',core:'0.3.0',port:'3018'},{service:'0.3.0',core:'0.3.0',port:'9999'}]) assert.equal(assess({...good,runtime}).ready,false);
});
test('publication, legacy models, unavailable reader cannot pass',()=>{
 for(const contract of [{...good.contract,publicationEnabled:true},{...good.contract,nodeModelVersions:[17,18]},{...good.contract,draftDefinitionVersion:2}]) assert.equal(assess({...good,contract}).ready,false);
 assert.equal(assess({...good,pdf:false}).code,'PDF_READER_MISSING');
});

test('font contract and pinned Core artifact are mandatory; configured isolated ports must match inspected mappings',()=>{assert.equal(assess({...good,runtime:{...good.runtime,port:'3028'},expectedPort:'3028'}).ready,true);assert.equal(assess({...good,runtime:{...good.runtime,coreArtifactSha256:'a'.repeat(64)}}).ready,false);assert.equal(assess({...good,contract:{...good.contract,fonts:undefined}}).ready,false);});
