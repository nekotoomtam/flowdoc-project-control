# Work Tree, Phase, Checklist, and SQLite Projection Design

Status: Draft for user review

Date: 2026-08-25

Scope: Project Control work-shaping model, Work tree semantics, phase/checklist separation, evidence target rules, SQLite projection strategy, GUI read model implications, and agent workflow contract.

## 1. Purpose

Project Control must reduce the context cost of starting or resuming FlowDoc work. A new Codex room should not rediscover product state by rereading Core, Editor, Backend, and Project Control from scratch. It should start from Project Control, identify where the conversation sits, understand what has already been recorded, then continue in the owning repository only after the work context is clear.

The current model already separates Node, Work, Document, Repository, and Evidence. The loose point is execution flow. Current Work records describe active roadmap cards, but they do not encode the nested shape of a real work discussion: a broad topic can split into smaller topics, then into a task with phases, checklists, stop conditions, and evidence targets.

This design adds that missing layer without turning Project Control into a product runtime, hosted task tracker, or opaque database. Project Control remains the shared table of work and understanding. Product code still belongs in the owning product repositories.

## 2. Design Goals

1. Keep the Node tree and Work tree separate.
2. Let Work form a topic/task tree before execution starts.
3. Keep phases and checklists out of both trees.
4. Make executable tasks explicit and measurable.
5. Make evidence targets visible before implementation starts.
6. Give future agents a strict workflow to follow.
7. Preserve file-first reviewability for humans and agents.
8. Add SQLite as a generated query/index layer, not the first canonical store.
9. Preserve existing V1 records while allowing staged migration.
10. Avoid treating Work, Phase, or Checklist progress as system truth.

## 3. Non-Goals

- Do not build GUI editing.
- Do not create a hosted task tracker.
- Do not store product implementation state inside Project Control.
- Do not replace product repository tests or contracts.
- Do not infer Node `truthState` from Work completion, Phase completion, Checklist completion, or SQLite query results.
- Do not require every existing Work record to become a fully planned task in one migration.
- Do not make SQLite the canonical authoring surface in the first implementation.
- Do not add multi-agent scheduling, locking, or an event log in this design.

## 4. Core Concepts

### 4.1 Node Tree

The Node tree is the durable knowledge map. It answers:

- What area of the FlowDoc system is this about?
- Where does this topic sit in the product or knowledge hierarchy?
- Which Documents, Repositories, and Evidence records describe that area?

Example:

```text
FlowDoc
  Project Control
  Core
    Text Engine
```

Node records should remain stable and knowledge-oriented. A Node is not a phase, checklist item, or temporary execution step.

### 4.2 Work Tree

The Work tree is the durable work/discussion map. It answers:

- What work or discussion is active?
- How has a broad topic split into smaller work topics?
- Which leaf is ready to execute?

Example:

```text
FlowDoc Product Development Resumption
  Project Control Hardening
    Work Tree, Phase, and Checklist Contract
```

Work records form a tree through `parentWorkId`. This tree is separate from the Node tree. Every Work record still points to one primary `nodeId` so agents can move from work context back to the durable knowledge map.

### 4.3 Work Topic

A Work topic is a grouping or planning item inside the Work tree. It may have child Work records. It is not directly executable unless it is later refined into a Work task.

A Work topic should identify:

- primary Node context;
- related repositories;
- context documents;
- why the topic exists;
- what kind of child topic or task should be created next.

### 4.4 Work Task

A Work task is an executable Work leaf. It represents the point where an agent can start a bounded round after reading the required context.

A Work task should identify:

- owner repository or bounded repository set;
- active role;
- context documents;
- expected output;
- stop conditions;
- active or next Phase;
- Checklist items;
- evidence targets.

A Work record should avoid having both executable Phases and child Work tasks at the same time. If a task must be decomposed further, convert it back into a topic or create a child task and pause execution on the parent.

### 4.5 Phase

A Phase is an ordered execution round for one Work task. It answers:

- What step of the task are we in?
- What kind of action happens here?
- What must be true before the next phase starts?

Phases are not tree nodes. They are separate records linked by `workId`.

Example:

```text
Phase 1: Define contract
Phase 2: Add schema and semantic validation
Phase 3: Add read model and SQLite projection
Phase 4: Add read-only GUI visibility
```

### 4.6 Checklist

A Checklist is the measurable gate set for one Phase. A Checklist item is concrete enough that an agent can report PASS, FAIL, BLOCKER, RISK, or UNKNOWN against it.

Checklist state does not prove product truth. It records progress through a work round. Evidence records remain the durable support for strong claims.

### 4.7 Evidence Target

An Evidence target describes what would be enough to support or close a claim. It is not the same as an existing Evidence record.

Evidence targets should say:

- which repository should produce the evidence;
- which command, path, contract, or document would count;
- which claim the evidence would support;
- which claims must stay unknown even if the task succeeds.

The current `requiredEvidence` field points at Evidence records that already exist. New execution flow needs target fields so work can say what evidence should be produced before that evidence exists.

### 4.8 Context Document

A Context document is an existing Document record that must be read before executing a Work task or Phase. Context documents keep agent reading paths explicit instead of forcing each room to rediscover the same operating rules.

## 5. Canonical Storage Decision

Use JSON/Markdown as canonical source and SQLite as a generated projection.

Project Control should remain file-first in the first implementation:

- canonical records live under `data/`;
- canonical prose lives under `docs/`;
- `generated/project-index.json` remains deterministic generated output;
- a new SQLite database can be generated from the same validated source set for query-heavy UI and agent lookup.

This chooses the conservative path:

```text
data/*.json + docs/*.md
  -> schema validation
  -> semantic validation
  -> generated/project-index.json
  -> generated/project-control.sqlite
```

SQLite is a projection, not authority. If SQLite and canonical files disagree, canonical files and validation win. The SQLite generator must be deterministic and disposable.

## 6. Why Not SQLite Canonical Yet

SQLite is a better shape for relation-heavy queries, but making it canonical immediately would add review and merge risk:

- Git diffs become harder to inspect.
- Agents cannot easily read the source by eye.
- Merge conflicts become less transparent.
- Migrations need stricter versioning before the model has been tested.
- Project Control would become less useful as a shared context folder.

The record shape should still be SQLite-ready. IDs and references should map cleanly into tables so the projection can become canonical later if the project proves it needs that.

## 7. Proposed Record Shape

This design keeps existing record kinds and adds Phase and Checklist records as first-class canonical JSON records.

### 7.1 Work Record

Work remains the work/discussion tree. It does not embed phases or checklist items.

```ts
type WorkKind = "topic" | "task";

interface WorkRecord {
  kind: "work";
  id: string;
  title: string;
  nodeId: string;
  parentWorkId?: string;
  workKind?: WorkKind;
  repositoryIds: string[];
  workState: "queued" | "in-progress" | "blocked" | "in-review";
  summary: string;
  contextDocumentIds?: string[];
  activeRole?: string;
  expectedOutput?: string;
  riskSummary?: string;
  blockedBy?: string;
  unblockOwner?: string;
  requiredEvidence: string[];
  createdAt: string;
  updatedAt: string;
}
```

Compatibility rule: existing Work records without `workKind` remain valid in the first implementation and are treated as legacy topic-like records by the read model.

### 7.2 Phase Record

Phase is a separate execution record linked to one Work task.

```ts
type PhaseState = "queued" | "in-progress" | "blocked" | "in-review" | "done";

interface PhaseRecord {
  kind: "phase";
  id: string;
  workId: string;
  title: string;
  phaseState: PhaseState;
  order: number;
  repositoryIds: string[];
  activeRole: string;
  stopConditions: string[];
  verificationTarget: string;
  summary: string;
  createdAt: string;
  updatedAt: string;
}
```

### 7.3 Checklist Record

Checklist is a separate gate record linked to one Phase.

```ts
type ChecklistItemState =
  | "pending"
  | "in-progress"
  | "passed"
  | "failed"
  | "blocked"
  | "risk"
  | "unknown";

interface ChecklistRecord {
  kind: "checklist";
  id: string;
  phaseId: string;
  title: string;
  items: ChecklistItem[];
  createdAt: string;
  updatedAt: string;
}

interface ChecklistItem {
  id: string;
  label: string;
  state: ChecklistItemState;
  evidenceTarget: string;
  evidenceIds?: string[];
  verificationNote?: string;
}
```

Checklist items use `evidenceTarget` text because the target often exists before an Evidence record exists. When an Evidence record is later produced, `evidenceIds` can link the item to durable proof.

## 8. Validation Rules

### 8.1 Work Validation

Every Work record must:

- reference an existing Node through `nodeId`;
- reference existing Repositories through `repositoryIds`;
- keep `requiredEvidence` references valid when present;
- keep `parentWorkId` absent or pointing to an existing Work record;
- avoid parent cycles in the Work tree.

New contract Work records should also:

- declare `workKind`;
- declare at least one `contextDocumentId`;
- reference existing Documents through `contextDocumentIds`;
- declare `activeRole` when `workKind` is `task`;
- declare `expectedOutput` when `workKind` is `task`.

Initial compatibility rule: missing new Work fields on legacy roadmap Work records should be reported as warnings or risk diagnostics, not hard failures.

### 8.2 Phase Validation

Every Phase record must:

- reference an existing Work record through `workId`;
- have at least one repository;
- reference existing Repositories through `repositoryIds`;
- declare `activeRole`;
- declare at least one `stopCondition`;
- declare `verificationTarget`;
- have a stable numeric `order`.

Only one Phase should be `in-progress` for a Work record unless a later design explicitly adds parallel phases.

### 8.3 Checklist Validation

Every Checklist record must:

- reference an existing Phase through `phaseId`;
- contain at least one item;
- require every item to have `id`, `label`, `state`, and `evidenceTarget`;
- require `evidenceIds` to reference existing Evidence records when present.

If an item state is `passed`, it must have either:

- at least one existing `evidenceId`; or
- a `verificationNote` that points to a bounded command, path, review, or explicit non-evidence result.

The stricter final target is Evidence-backed `passed` items. `verificationNote` exists only so early planning and read-only review phases can close without inventing fake Evidence.

### 8.4 Truth Boundary

Validation must not derive Node truth from:

- `workState`;
- `workKind`;
- `phaseState`;
- Checklist item state;
- evidence target text;
- expected output text;
- SQLite projection content.

Node `current` still requires existing Evidence records linked through Node `evidenceIds`.

## 9. SQLite Projection

The SQLite projection should make relationships cheap to query without changing authority.

Suggested tables:

```text
nodes
work
work_closure
phases
checklists
checklist_items
documents
repositories
evidence
work_context_documents
work_repositories
phase_repositories
work_required_evidence
checklist_item_evidence
diagnostics
```

Important query targets:

- selected Work subtree;
- active or highest-priority Phase for a Work task;
- Checklist items missing evidence targets;
- Checklist items marked passed without Evidence;
- Work records missing context documents;
- Work records linked to a Node branch;
- Evidence coverage for one Work/Phase/Checklist path;
- cross-repository work requiring owner confirmation.

The projection should include schema metadata:

```text
projection_meta(schema_version, source_digest, generated_at)
```

Consumers must compare `source_digest` with the generated JSON index or canonical source digest before trusting the SQLite file.

## 10. Tooling Candidates

Use the lightest tool that keeps Project Control reviewable.

Recommended first path:

- Use plain SQL migrations for the generated SQLite schema.
- Prefer the Node runtime SQLite facility if it is available and stable in the local Node version.
- If the built-in SQLite API is not sufficient, consider `better-sqlite3` for deterministic local generation.
- Keep the first projection generator small and file-local; do not introduce an ORM until queries become hard to maintain.
- Add a small inspection script only if it helps agents answer common questions, such as `work path`, `active phase`, and `missing evidence targets`.

Tools to postpone:

- ORM or query builder: useful later, but likely too much for the first projection.
- Event-sourcing framework: out of scope until multiple writers or audit replay become real needs.
- Browser-side SQLite/WASM: unnecessary while Project Control is a local generated read model.
- Hosted database: conflicts with file-first Project Control review.

## 11. Agent Workflow Contract

Project Control needs an agent-facing workflow so new rooms do not improvise the model.

Required sequence:

1. Read Project Control entry documents.
2. Identify the requested Node path or Work path.
3. If a Work item is a topic, inspect child Work records before treating it as executable.
4. If no executable task exists, propose a child task instead of adding execution Phases to a broad topic.
5. If a Work item is a task, read context documents, active role, stop conditions, Phase, Checklist, and evidence targets.
6. Identify the owner repository before editing product behavior.
7. Read the owner repository `AGENTS.md`.
8. Execute only the approved task scope.
9. Report Phase and Checklist status without promoting Node truth.
10. Register Evidence records only after fresh verification exists.
11. Regenerate JSON and SQLite projections after canonical records change.
12. End with PASS, FAIL/BLOCKER, RISK, UNKNOWN, files changed, tests run, evidence or map updates, intentionally not changed, and next recommended work.

This workflow should live in a domain document, likely:

```text
docs/domains/work-tree-operating-rules.md
```

`AGENTS.md`, `docs/domains/flowdoc-round-workflow.md`, and `docs/domains/flowdoc-global-codex-guidance.md` should link to it before product implementation rounds.

## 12. GUI Read Model Implications

The GUI should remain a read-only control surface.

Minimum useful GUI changes:

- show Work tree separately from System tree;
- distinguish topic-like Work and executable Work tasks;
- when a Work topic is selected, show child Work items and the next decomposition hint;
- when a Work task is selected, show Phases, Checklist, stop conditions, context documents, and evidence targets;
- show Review when evidence targets are missing;
- show Risk/Invalid when an item is passed without Evidence or a verification note;
- keep Checklist state visually separate from Truth State;
- keep full detail available for longer context.

The GUI should not edit Phases or Checklist state in this design.

## 13. Migration Strategy

Migration should be staged to avoid breaking current Project Control records all at once.

### Stage 1: Schema Skeleton

- Add Phase and Checklist record schemas.
- Extend Work fields as optional.
- Add source discovery for new record directories.
- Keep existing Work records valid.

### Stage 2: Semantic Validation

- Add Work tree parent/cycle checks.
- Add Phase reference and single-active-phase checks.
- Add Checklist evidence target and passed-item checks.
- Report missing new Work context as warnings for legacy records.

### Stage 3: Read Model and SQLite Projection

- Expose Work children and Work path in the JSON read model.
- Expose Phases and Checklists in the JSON read model.
- Generate `generated/project-control.sqlite` from validated canonical sources.
- Add projection integrity checks.

### Stage 4: First Executable Task

- Choose one Project Control self-improvement Work topic.
- Add one child executable Work task.
- Add one Phase and one Checklist record.
- Use this as the first live drill for a new Codex room.

### Stage 5: Agent Workflow Document

- Add `docs/domains/work-tree-operating-rules.md`.
- Add a Document record for it under Project Control.
- Update agent entry documents to require it.

### Stage 6: GUI Readout

- Add Work tree display and task detail readout.
- Keep editing file-first.

## 14. Initial Candidate Task

The safest first task is Project Control self-improvement, not product behavior.

Candidate Work path:

```text
FlowDoc Product Development Resumption
  Project Control Hardening
    Work Tree, Phase, Checklist, and SQLite Projection Contract
```

Candidate first Phase:

```text
Define Contract and Validation Targets
```

Candidate Checklist:

- Define glossary terms without conflicting with Node and Truth State.
- Add schema contract for Work, Phase, and Checklist records.
- Add semantic checks for references, cycles, and missing targets.
- Add SQLite projection design without making it canonical.
- Add UI readout requirements without adding editing.

## 15. Risks and Implementation Decisions

Risks:

- If every broad topic becomes a task too early, Phases will become vague and Checklists will lose value.
- If evidence targets are too strict for early exploration, agents may create fake precision.
- If Checklist state is treated as truth, Project Control will recreate the original plan/truth mixing problem.
- If SQLite becomes canonical too early, Project Control will lose readable git-first review.
- If GUI readout leads the design, the model may optimize for presentation instead of agent workflow reliability.
- If Work tree and Node tree merge, future rooms will not know whether a branch represents system structure or execution planning.

Implementation decisions for the first plan:

1. Keep `activeRole` as a string in the first migration, but validate non-empty values against the role catalog text later after the role IDs are normalized.
2. Require `workKind` for new Work records created under the new contract. Legacy Work records without `workKind` remain valid and are treated as topic-like records.
3. Allow `verificationNote` only for planning, read-only review, or non-promotional Checklist items. Product-truth or completion claims should use Evidence records.
4. Do not check `generated/project-control.sqlite` into git in the first implementation. Regenerate it locally and keep JSON/Markdown plus `generated/project-index.json` as the reviewable committed surface.
5. Route SQLite projection warnings through the same diagnostics shape as schema and semantic checks, with severity added only if the first implementation needs non-blocking legacy warnings.

## 16. Acceptance Criteria

The design is ready to implement when:

- Node tree, Work tree, Phase, Checklist, Context Document, and Evidence Target have separate meanings.
- Existing Work records can remain valid without pretending to be executable tasks.
- At least one child task can demonstrate Phase and Checklist behavior.
- Validator rules prevent missing context on executable tasks.
- SQLite is clearly a generated projection and not the first canonical store.
- Agent workflow documentation tells a new Codex room exactly how to proceed.
- No rule allows Work, Phase, Checklist, or SQLite state to promote Node truth without Evidence.
