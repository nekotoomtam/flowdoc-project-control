import {test} from 'node:test';
import assert from 'node:assert/strict';
import {checkCoverage} from '../plugins/flowdocmake/scripts/reference-coverage.mjs';
const source={sha256:'a'.repeat(64),pageCount:2};
const record=()=>({source:{...source},reviewedSourcePages:[1,2],parts:[{id:'body',title:'Content',sourcePages:[1,2],dataSource:'PDF + request',layout:{font:'11pt',columns:'two',borders:'none',spacing:'measured',pageRules:'flow',assets:'none',alignment:'left',headerFooter:'measured'}}]});
test('source inventory must precede reuse and cover every source page',()=>{
 assert(checkCoverage(record(),source,'source').ok);
 const missing=record();missing.reviewedSourcePages=[1];assert(!checkCoverage(missing,source,'source').ok);
 const stale=record();stale.source.sha256='b'.repeat(64);assert(!checkCoverage(stale,source,'source').ok);
 const layout=record();delete layout.parts[0].layout.font;assert(!checkCoverage(layout,source,'source').ok);
});
test('delivery cannot pass from source counts or a structurally valid PDF alone',()=>{
 assert(!checkCoverage(record(),source,'delivery').ok);
 const r=record();r.output={path:'result.pdf',sha256:'c'.repeat(64),pageCount:2,templateId:'id',revision:2};r.reviewedOutputPages=[1,2];
 r.parts[0].review={outputPages:[1,2],content:'pass',layout:'pass',evidence:'compared pages 1 and 2',differences:[]};r.outputChecks={toc:'not-applicable: no TOC',links:'not-applicable: no links',pageLabels:'pass',allValues:'pass'};r.unresolved=[];
 assert(checkCoverage(r,source,'delivery').ok);
 r.parts[0].review.content='fail';assert(!checkCoverage(r,source,'delivery').ok);
 r.parts[0].review.content='pass';r.parts[0].review.differences=['missing legend'];assert(!checkCoverage(r,source,'delivery').ok);
});
