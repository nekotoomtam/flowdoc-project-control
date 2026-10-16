# Draft selection and resumable preview

## Authority Boundary

Owner: FlowDoc Project Control. Scope: flowdocmake 0.1.7 client workflow over
Service/Core 0.3.0 draft-only tools. No new Core schema, permission grant or
publication path. The user's task determines allowed mutations.

## Separate the candidate from the target

Choose the goal and stage route in the workflow guide before using this chapter.
Raw-data extraction stops before draft creation. A reusable-template/sample
request uses representative previews and reports structure, content, behavior
and visual differences separately; it does not require full expansion. Only a
requested full reconstruction proceeds through the full-stage gate and strict
whole-document delivery review. Structural acceptance alone never accepts
visual differences for that route.

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
Initialize the time-bounded task first (see Task progress and Representative
pages below). The first candidate is a small representative request; full data
expansion requires the representative gate and uses stage full.
Package 0.1.6 corrects the earlier plan example to include the required stage
and task path, and aligns the mechanical step list with image alias ordering;
the representative/deadline implementation is unchanged from 0.1.5.

```json
{
  "stage":"representatives",
  "taskPath":"C:/task/task.json",
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
   target, uploads/finalizes images and resolves aliases, validates, saves, queues the exact revision,
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

`review` and the progress file's `complete` currently implement strict
full-document coverage; they have no structural-sample or extraction goal mode.
Use a scoped result to accept the requested sample/data deliverable, and report
the tool's narrower applicability honestly. Do not set `complete:true` yourself,
invent full-document evidence, or turn that field into a requirement to expand
a sample the user did not request. Full-reconstruction completion still requires
the actual strict review.

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

Package 0.1.4 fixes image alias ordering: after obtaining the target ID, the
helper uploads/finalizes original assets and substitutes resource IDs before
Core validates sample data. A failed validation can therefore leave an owned
upload, retained in checkpoint receipts for unchanged retries. When upgrading
from an older failed alias run, preserve that run and start a fresh run directory;
do not rewrite its recorded validation intent.

When the user authorizes Goal, call the host's `create_goal` in the authoring
thread with the selected deliverable and its review objective. For full
reconstruction this means the full PDF and whole-book review; for a structural
sample it means the checked reusable structure/sample with disclosed differences.
Do not invent a token budget.
If a Goal is already active, inspect it and continue within its authorized scope.
Maintain per-part progress across Goal continuations. Complete the Goal only
after verification and delivery at that selected scope. A full-reconstruction
Goal requires actual full-PDF inspection and passing comparison; sample/data
completion never satisfies that larger Goal.
Follow host blocker, budget and pause rules; repairable template errors are not
external blockers. Goal does not authorize publication. Without Goal support,
report the limitation honestly; this MCP tool cannot schedule future turns.

If an existing room's native catalogue is stale after an upgrade, packaged
`call_tool_file.mjs` opens a fresh MCP client to the installed server and can call
`manage_document_task` with argument/result files. This is a real fresh MCP call,
not evidence that the native catalogue refreshed. Never bypass tools with direct
database/template-storage writes.

## Representative pages before expansion

This gate applies when expanding a reconstruction to the full source document;
it is not the completion contract for extraction-only or structural-sample work.
Do not fabricate passing comparisons to fit a different goal. The current
helper still requires source coverage, stage/taskPath and a bounded task even
for representative runs; these are tool prerequisites, not proof that every
user request needs a full reconstruction. Documentation does not relax them.
Choose and disclose a compatible authoring path before mutation if the tool's
prerequisites conflict with the requested scope or time arrangement.

In package 0.1.5, every candidate plan requires `stage` (representatives or full)
and `taskPath`. Initialize a fresh task with `timeLimitMinutes` matching the
owner's bounded trial (default 20). The deadline starts at task initialization,
not at package installation. Keep the same task/deadline across all candidate
runs and Goal turns. Read-only investigation and evidence retention can continue
after expiry, but authoring must stop. The helper checks before every tool step;
an already-running external call may finish. Atomic tools do not enforce this
local deadline, so do not bypass it through them. The supervising room must also
pause the Goal at the agreed deadline. `TRIAL_TIME_LIMIT` has category `stop`:
call `update_goal` paused under the owner's time-limit authorization. Never label
an expired trial complete, reset the clock, or extend it without owner approval.

The 20-minute default is a helper limit, not a universal deadline for finishing
every document. Establish the applicable time arrangement in stage 0 before
initializing authoring state; do not silently impose a short trial on an
ordinary finish-the-document request or imply this guide removed the limit.

Use the whole-source inventory to classify distinct visual/semantic families,
not only broad chapter names. Add `layoutFamilies: ["family-name"]` to every
coverage part; use multiple entries or split parts when layouts differ. Examples
across documents include cover, signatures, revision table, linked TOC, borderless
definitions, narrative, grouped records, feature cards and requirement tables.
These are examples, not a fixed SRS-only list. Inspect difficult cases too:
long rows/text, continuation pages, mixed alignment, missing borders and differing
header/footer rules. A layout family is not accepted merely by assigning a name.

Build a representative request with real unshortened selected data, small enough
to inspect before repeating it across the book. Declare the complete native
formats needed for the eventual document in this definition. Use
`stage: "representatives"` for those sample previews. This is a prerequisite,
not a substitute for the requested full document. Keep the representative PDF
and checkpoint. Render source and output pages to paired PNGs and open them.
Compare measured font sizes, widths, borders, spacing, page rules, assets,
alignment, header/footer, content and native semantics. Explicitly check that
observations agree with the source, rather than copying earlier assumptions.

Write a representative report locally, using this shape:

```json
{
  "sourceSha256": "<source PDF hash from inventory>",
  "definitionSha256": "<SHA-256 of exact candidate template.json bytes>",
  "checkpointPath": "C:/work/reps/candidate-checkpoint.json",
  "representatives": [{
    "family": "borderless-definitions", "sourcePage": 10, "outputPages": [3],
    "sourceImage": "C:/work/source/page-10.png",
    "outputImage": "C:/work/reps/page-03.png",
    "observations": {
      "borders": {"source": "No rules around entries", "output": "No rules around native rows", "verdict": "pass"}
    },
    "differences": []
  }]
}
```

Include every observed family exactly once. `observations` requires all ten
keys: font, columns, borders, spacing, pageRules, assets, alignment, headerFooter,
content, structure. Each needs concrete source/output descriptions and verdict
pass; do not write generic "matches" without actually measuring/looking. A
non-applicable feature still needs a concrete explanation. Keep real differences
open until repaired; never clear them to make the checker pass.

For expansion, use `stage: "full"`, `representativeReviewPath` pointing to that
report and the same `taskPath`. First run mode=check. The helper verifies family
coverage, PDF identity/page bounds, PNG evidence files, comparisons, source and
exact definition hash, and the definition recorded in the render checkpoint.
It returns REPRESENTATIVES_REQUIRED with reasons when proof is missing/stale.
Once it passes, expand the request data using those verified formats. A changed
definition requires fresh representative inspection/report; changing only request
data does not waive the eventual whole-book pagination/data/visual checks.

This gate validates declared evidence and mechanics, not visual correctness.
An independent reviewer should inspect the paired images before accepting the
trial. If source classification or comparisons are wrong, reject the gate and
repair the representative set before expanding, even if the tool returns checked.
