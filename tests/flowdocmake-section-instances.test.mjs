import {test} from 'node:test';
import assert from 'node:assert/strict';
import {assess,supported} from '../plugins/flowdocmake/scripts/compatibility.mjs';
const contract={nodeModelVersions:[18,19],sectionInstances:{model:19,input:'array-by-id',assembly:'saved-definition',stage:2,coverArea:true,scopedToc:false},draftDefinitionVersion:1,publicationEnabled:false,schemaVersions:[1,2],fonts:{selection:'exact-release-weight-style',syntheticFaces:false,automaticFallback:false,adminSeparate:true,heightAdjustment:{methodId:'thai-bo-baseline-top-v1',optIn:true,proposalTtlSeconds:900,precisionDecimals:6,layoutCheck:'not_checked'}}};
test('candidate accepts Section19 contract only with exact instance semantics and runtime pin',()=>{
 const good={contract,runtime:{...supported,port:'3018'},pdf:true};assert.equal(assess(good).ready,true);
 for(const sectionInstances of [undefined,{...contract.sectionInstances,input:'map-by-name'},{...contract.sectionInstances,assembly:'request'},{...contract.sectionInstances,stage:1},{...contract.sectionInstances,coverArea:false},{...contract.sectionInstances,scopedToc:true}])assert.equal(assess({...good,contract:{...contract,sectionInstances}}).ready,false);
 assert.equal(assess({...good,contract:{...contract,nodeModelVersions:[18]}}).ready,false);
});
