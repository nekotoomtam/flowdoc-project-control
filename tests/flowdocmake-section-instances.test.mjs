import {test} from 'node:test';
import assert from 'node:assert/strict';
import {assess,supported} from '../plugins/flowdocmake/scripts/compatibility.mjs';
const contract={nodeModelVersions:[18,19],formatSizing:{version:2,nodeModelVersions:[19],fontSchemaVersions:[1,2],modes:['auto','fixed'],fixedContexts:['section-flow-root'],diagnosticsVersion:1},sectionInstances:{model:19,input:'array-by-id',assembly:'saved-definition',stage:3,coverArea:true,scopedToc:true},draftDefinitionVersion:1,publicationEnabled:false,schemaVersions:[1,2],fonts:{selection:'exact-release-weight-style',syntheticFaces:false,automaticFallback:false,adminSeparate:true,heightAdjustment:{methodId:'thai-bo-baseline-top-v1',optIn:true,proposalTtlSeconds:900,precisionDecimals:6,layoutCheck:'not_checked'}}};
test('candidate accepts Section19 contract only with exact instance semantics and runtime pin',()=>{
 const good={contract,runtime:{...supported,port:'3018'},pdf:true};assert.equal(assess(good).ready,true);
 for(const sectionInstances of [undefined,{...contract.sectionInstances,input:'map-by-name'},{...contract.sectionInstances,assembly:'request'},{...contract.sectionInstances,stage:2},{...contract.sectionInstances,coverArea:false},{...contract.sectionInstances,scopedToc:false}])assert.equal(assess({...good,contract:{...contract,sectionInstances}}).ready,false);
 assert.equal(assess({...good,contract:{...contract,nodeModelVersions:[18]}}).ready,false);
});
test('requires Format sizing v2, supported contexts and diagnostic version',()=>{
 const sizing={version:2,nodeModelVersions:[19],fontSchemaVersions:[1,2],modes:['auto','fixed'],fixedContexts:['section-flow-root'],diagnosticsVersion:1};
 const good={contract:{...contract,formatSizing:sizing},runtime:{...supported,port:'3018'},pdf:true};assert.equal(assess(good).ready,true);
 for(const formatSizing of [undefined,{...sizing,version:1},{...sizing,version:3},{...sizing,modes:['auto']},{...sizing,fixedContexts:['cell']},{...sizing,diagnosticsVersion:2}])assert.equal(assess({...good,contract:{...good.contract,formatSizing}}).ready,false);
});
