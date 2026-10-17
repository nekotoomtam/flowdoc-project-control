// CLI compatibility; MCP clients should call run_candidate_preview directly.
import {runCandidatePlan} from './candidate-workflow.mjs';
try{
 const result=await runCandidatePlan(process.argv[2],{checkOnly:process.argv.includes('--check'),waitMs:15000,log:value=>console.log(JSON.stringify(value))});
 console.log(JSON.stringify(result));
}catch(e){console.error(JSON.stringify({ok:false,code:e.code??'WORKFLOW_FAILED',step:e.step,checkpoint:e.checkpoint,nextAction:e.nextAction}));process.exitCode=1;}
