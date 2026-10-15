# Draft selection and resumable preview

## Authority Boundary

Owner: FlowDoc Project Control. Scope: flowdocmake 0.1.3 client workflow over
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

## Task progress and continuation

Package 0.1.3 adds `manage_document_task`. Its local progress file is independent
of immutable preview checkpoints and never writes template storage. Keep it in
the authoring workspace, separate from template, plan and coverage files.

1. `init`: absolute `taskPath`, `inventoryPath`, `coveragePath` after source
   inspection. Every part begins pending. Refuses an existing file. Correct
   wrongly classified parts first; a changed inventory needs a new task file.
2. `read`: `taskPath` on resumption. Returns `revision`, `pendingParts`, notes,
   PDF identity and `complete`.
3. `update`: `taskPath`, `expectedRevision`, `partId`, `status`, concrete `note`
   naming the next repair/check. Writable statuses: pending, authoring,
   needs-repair, needs-review. Read again after a revision conflict. Callers
   cannot set pass or complete directly.
4. `review`: `taskPath`, `expectedRevision`, `coveragePath`, succeeded run's
   `checkpointPath`. Verifies PDF bytes/page count, source identity, unchanged
   part mapping and delivery coverage. Only comparisons for that exact PDF
   path/hash/template/revision can pass. Every new artifact re-evaluates all
   parts; old passes never carry over implicitly. Bind/review each new PDF before
   claiming completion. Local progress cannot detect an unrelated newer Service
   revision until given that revision's checkpoint.

Example initialization:

```json
{"action":"init","taskPath":"C:/work/task.json","inventoryPath":"C:/work/source/inventory.json","coveragePath":"C:/work/coverage.json"}
```

This checks declared evidence, not visual truth. Actually inspect pages before
entering pass evidence. Identify meaningful native parts: rows/columns, TOC,
assets, alignment and PDF-only content. A whole page wrapped in a table cell
does not demonstrate a reconstructed table. Keep omissions/mismatches as repairs
until fixed or explicitly accepted by the owner; never invent an acceptance.

Workflow errors return `category` and `nextAction`:

| Category | Meaning and continuation |
| --- | --- |
| needs-repair | Own JSON/grammar/layout/render input or unfinished comparison. Diagnose, repair and continue, preserving source and receipts. |
| retry | Busy/transient Service or stale revision. Read current state; retry uncertain mutations unchanged, use a fresh run for changed input. |
| needs-diagnosis | Unclear preflight/unreadable response. Inspect evidence before claiming an external blocker. |
| blocked | Credentials, ownership or essential owner choice missing. State the exact external requirement; do not bypass it. |

`check` reports `validation: local-input-only`, `coreValidationRun: false`;
Core grammar is validated in run. `pending` needs polling; `pdf-ready` needs
comparison. Neither is completion. A render failure alone does not establish
an unfixable renderer defect: preserve and diagnose its input before escalating.

When the user authorizes Goal, call the host's `create_goal` in the authoring
thread with the full PDF-and-review objective. Do not invent a token budget.
If a Goal is already active, inspect it and continue within its authorized scope.
Maintain per-part progress across Goal continuations. Complete the Goal only
after actual full-PDF inspection, passing comparison and review-ready delivery.
Follow host blocker, budget and pause rules; repairable template errors are not
external blockers. Goal does not authorize publication. Without Goal support,
report the limitation honestly; this MCP tool cannot schedule future turns.

If an existing room's native catalogue is stale after an upgrade, packaged
`call_tool_file.mjs` opens a fresh MCP client to the installed server and can call
`manage_document_task` with argument/result files. This is a real fresh MCP call,
not evidence that the native catalogue refreshed. Never bypass tools with direct
database/template-storage writes.
