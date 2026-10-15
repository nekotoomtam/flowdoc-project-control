# Draft selection and resumable preview

## Authority Boundary

Owner: FlowDoc Project Control. Scope: flowdocmake 0.1.2 client workflow over
Service/Core 0.3.0 draft-only tools. No new Core schema, permission grant or
publication path. The user's task determines allowed mutations.

## Separate the candidate from the target

A candidate supplies reusable structure. The target is the draft being edited.
Reading an old candidate does not require editing that candidate or retaining
its templateId. Inspect and compare every PDF part before selecting a candidate.

| User's task | Target policy | Continue without another approval when |
| --- | --- | --- |
| Create a new template from PDF/data, no target ID specified | `new` | Create/edit/validate/preview are within the requested task. Obtain an empty ID first; preserve unrelated drafts. |
| Repair a specified existing ID | `preserve` | Save compatible repairs under that ID with the expected revision. A failed ownership move does not authorize replacing the ID. |
| Repair an existing ID with permission to create a replacement if incompatible | `replace-if-conflict` | An actual `OWNERSHIP_CONFLICT` prevents the save. Create one new empty ID, save the complete candidate there, and report old/new IDs. Do not delete the old draft. |

Do not add a preserve-ID constraint merely because an old template is available.
Conversely, do not infer permission to replace an explicitly fixed ID. If the
user has already authorized the applicable branch, use that authorization;
do not ask again after every revision, format, or job receipt. An agent's claim
of authority is not a substitute for an actual user instruction. For delegated
trials, put the user's permitted branches into the initial task, avoiding later
contradictory instructions.

Only an ownership conflict can trigger the authorized replacement branch.
`STALE_CURRENT` requires a fresh read and reconciliation; authentication,
validation, render and transport failures need their own repair. Never remove
stable variable identities or bypass Service guards to force an existing save.

## Mechanical steps through the tool

`run_candidate_preview({planPath, mode:"check"|"run", waitMs?:0..20000})`
is a local package tool. `planPath` is an absolute UTF-8 JSON file path. Prepare
the complete candidate using the developer schemas; this tool does not design
the document or read the PDF visually. Local candidate/argument files are input
and checkpoint files; all persisted template changes go through authoring MCP.

```json
{
  "candidateDirectory":"C:/task/candidate",
  "inventoryPath":"C:/task/source-review/inventory.json",
  "coveragePath":"C:/task/coverage.json",
  "workDirectory":"C:/task/run-1",
  "name":"Requested document",
  "docKey":"requested-document-draft-unique",
  "draftPolicy":"new"
}
```

Candidate directory contains `template.json` and `request.json`. Optional
`upload-files.json` is an array of `{id,file}` for original local PNG/JPEG assets;
`file` resolves relative to that directory. Definition must use schemaVersion 1,
nodeModelVersion 18, definition.version 1. For existing policies add
`existingTemplateId`. `docKey` is the fresh identity key when creation is allowed;
existing saves retain the Service-returned docKey. If you already created the
empty target before preparing the definition, use `preserve` and its returned ID.

Optional `replacements:[{from,to,evidence}]` makes exact string substitutions in
the request only when the source PDF establishes the target value. It is not a
license to abbreviate, invent, remove or make source text render-friendly.

1. Call `mode:"check"`. It validates source coverage/hash, policy, candidate and
   asset inputs without creating a draft or checkpoint.
2. Call `mode:"run"` with the same path. It checks live readiness, chooses the
   target, validates, saves, uploads/finalizes images, queues the exact revision,
   and saves the PDF after success. It never publishes or deletes drafts.
3. A `pending` result contains `nextAction` naming the same tool and plan. Call
   it again; this is continuing the current work, not asking the user to restart.
   Each call bounds polling and returns the job/checkpoint. Do not send a final
   merely because a preview is queued.
4. `pdf-ready` contains `reviewRequired:true` and `complete:false`. Render and
   compare every page, reconcile all parts/values, TOC destinations and page
   labels, then finish the delivery coverage record. A saved PDF is not approval.

The checkpoint saves intent before a mutation and the receipt afterward.
Uncertain retries use the same plan, directory and keys. Changed candidate,
request, assets or plan are rejected as `CHECKPOINT_INPUT_CHANGED`: preserve the
old run and use a new workDirectory for the repair. To repair the same target,
set `preserve` and its actual ID; the new run reads its current revision. Do not
create another identity merely because the PDF needs visual repair.

`WORKFLOW_BUSY` means another call holds the run lock. Wait for that call; never
delete an active lock. An interrupted process with a genuinely abandoned lock
requires reconciliation before resuming. Errors include a code and checkpoint;
inspect them instead of treating every error as permission to fork. No helper
can guarantee that an agent continues after it ends its own turn.
