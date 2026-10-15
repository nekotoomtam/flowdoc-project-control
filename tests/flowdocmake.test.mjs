import {test} from 'node:test';
import assert from 'node:assert/strict';
import {assess} from '../plugins/flowdocmake/scripts/compatibility.mjs';
const good={contract:{nodeModelVersions:[18],draftDefinitionVersion:1,publicationEnabled:false},runtime:{service:'0.3.0',core:'0.3.0',port:'3018'},pdf:true};
test('exact release is required; unknown and newer builds fail closed',()=>{
 assert.equal(assess(good).ready,true);
 for(const runtime of [null,{service:'0.3.1',core:'0.3.0',port:'3018'},{service:'0.3.0',core:'0.3.0',port:'9999'}]) assert.equal(assess({...good,runtime}).ready,false);
});
test('publication, legacy models, unavailable reader cannot pass',()=>{
 for(const contract of [{...good.contract,publicationEnabled:true},{...good.contract,nodeModelVersions:[17,18]},{...good.contract,draftDefinitionVersion:2}]) assert.equal(assess({...good,contract}).ready,false);
 assert.equal(assess({...good,pdf:false}).code,'PDF_READER_MISSING');
});
