# Work Tree, Phase Checklist, and Agent Workflow Design

Status: Draft for user review

Date: 2026-08-25

Scope: Project Control work-shaping model, Work tree semantics, phase/checklist separation, evidence target rules, GUI read model implications, and agent workflow contract.

## 1. Purpose

Project Control must reduce the context cost of starting a FlowDoc room. A new Codex room should not rediscover product state by rereading Core, Editor, and Backend from scratch. It should start from Project Control, identify where the conversation sits in the system, understand what has already been recorded, then continue in the owning repository only after the work context is clear.

The current Project Control model already separates Node, Work, Document, Repository, and Evidence. The loose point is Work. Current Work records describe active roadmap cards, but they do not yet encode the nested shape of a real work discussion: a broad topic can split into smaller topics, then into a task that has phases, checklists, stop conditions, and evidence targets.

This design adds that missing layer without turning Project Control into a product runtime or task manager. Project Control remains the shared table of work and understanding. Product code still belongs in the owning product repositories.

## 2. Design Goals

1. Keep the Node tree and Work tree separate.
2. Let Work form a topic tree before it becomes an executable task.
3. Keep phases and checklists out of the tree.
4. Make executable tasks explicit and measurable.
5. Make evidence targets visible before work starts.
6. Give future agents a strict workflow to follow.
7. Preserve the current V1 data model while allowing staged migration.
8. Avoid treating checklist progress as system truth.

## 3. Non-Goals

- Do not build GUI editing.
- Do not create a hosted task tracker.
- Do not store product implementation state inside Project Control.
- Do not replace product repository tests or contracts.
- Do not infer Node `truthState` from Work completion, phase completion, or checklist completion.
- Do not require every existing Work record to become a fully planned task in one migration.

## 4. Core Concepts

### 4.1 Node Tree

The Node tree answers:

- What area of the FlowDoc system is this about?
- Where does this topic sit in the product or knowledge hierarchy?
- Which Documents, Repositories, and Evidence records describe that area?

Examples:

```text
FlowDoc
  Core
    Text Engine
      Rustybuzz Shaping
```

Node tree records should remain stable and knowledge-oriented. A Node is not a phase, a checklist item, or a temporary execution step.

### 4.2 Work Tree

The Work tree answers:

- What work or discussion is active under this area?
- How has the broad topic split into smaller work topics?
- Which leaf is ready to execute?

Examples:

```text
FlowDoc Product Development Resumption
  Core Product Readiness
    Text Engine Wrap Accuracy
      Compare document wrapping against product expectations
```

Work records may form a tree through `parentWorkId`. This tree is separate from the Node tree. A Work item still points to one primary `nodeId`, and may reference additional context Nodes when needed.

### 4.3 Work Topic

A Work topic is a grouping or planning node inside the Work tree. It can have child Work items. It does not need phases or checklists because it is not directly executable yet.

A Work topic must still be useful to a new room. It should identify:

- primary Node context;
- related repositories;
- context documents;
- why the topic exists;
- what kind of child task should be created next.

### 4.4 Work Task

A Work task is an executable Work leaf. It represents the point where an agent can start a bounded round after reading the required context.

A Work task must have:

- owner repository or bounded repository set;
- active role;
- context documents;
- expected output;
- stop conditions;
- phases;
- checklist items;
- evidence targets.

A task may have child tasks only if it is being decomposed further. Once a task has executable phases, child tasks should be avoided unless the work is reclassified and the current task becomes a topic.

### 4.5 Phase

A Phase is a stage inside a Work task. It answers:

- What step of the task are we in?
- What kind of action happens here?
- What must be true before the next phase starts?

Phases are not tree nodes. They are ordered execution stages under one task.

Examples:

```text
Phase 1: Inspect current state
Phase 2: Define mismatch cases
Phase 3: Patch owner repository
Phase 4: Register evidence and handoff
```

### 4.6 Checklist

A Checklist item is a measurable condition inside a Phase. It should be concrete enough that an agent can report PASS, FAIL, BLOCKER, RISK, or UNKNOWN.

Checklist items should not claim product truth by themselves. They record progress through a work round. Evidence records remain the durable support for strong claims.

### 4.7 Evidence Target

An Evidence target describes what would be enough to support or close a claim. It is not the same as an existing Evidence record.

Current `requiredEvidence` points to Evidence records that already exist. New tasks need a separate target field so work can say, before execution:

- which repository should produce the evidence;
- which command, path, contract, or document would count;
- which claim the evidence would support;
- which claims must stay unknown even if the task succeeds.

## 5. Proposed Record Shape

This design extends Work records while preserving the current fields.

```ts
type WorkKind = "topic" | "task";
type ChecklistState = "pending" | "passed" | "failed" | "blocked" | "risk" | "unknown";

interface WorkRecord {
  kind: "work";
  id: string;
  title: string;
  nodeId: string;
  parentWorkId?: string;
  workKind: WorkKind;
  repositoryIds: string[];
  workState: "queued" | "in-progress" | "blocked" | "in-review";
  summary: string;
  contextDocumentIds: string[];
  activeRole?: string;
  expectedOutput?: string;
  stopConditions: string[];
  evidenceTargets: EvidenceTarget[];
  phases?: WorkPhase[];
  blockedBy?: string;
  unblockOwner?: string;
  requiredEvidence: string[];
  createdAt: string;
  updatedAt: string;
}

interface EvidenceTarget {
  id: string;
  repositoryId: string;
  summary: string;
  requiredFor: string;
  acceptedEvidence: string[];
  excludedClaims: string[];
}

interface WorkPhase {
  id: string;
  title: string;
  summary: string;
  checklist: ChecklistItem[];
}

interface ChecklistItem {
  id: string;
  label: string;
  state: ChecklistState;
  evidenceTargetIds: string[];
}
```

## 6. Validation Rules

### 6.1 All Work Records

Every Work record must:

- reference an existing Node through `nodeId`;
- reference existing Repositories through `repositoryIds`;
- have at least one `repositoryId`;
- reference existing Documents through `contextDocumentIds`;
- have at least one `contextDocumentId`;
- have at least one `stopCondition`;
- keep `requiredEvidence` references valid when present;
- keep `parentWorkId` either absent or pointing to an existing Work record;
- avoid parent cycles in the Work tree.

### 6.2 Work Topics

A `workKind: "topic"` record:

- may have child Work records;
- does not require phases;
- should not include checklist progress;
- must describe what smaller topic or task should be created next.

### 6.3 Work Tasks

A `workKind: "task"` record:

- must have `activeRole`;
- must have `expectedOutput`;
- must have at least one `evidenceTarget`;
- must have at least one Phase;
- every Phase must have at least one Checklist item;
- every Checklist item must reference a valid evidence target when it supports a closable claim;
- should be a Work leaf unless the task is being decomposed and converted back into a topic.

### 6.4 Evidence and Truth Boundary

Validation must not derive Node truth from:

- `workState`;
- `workKind`;
- phase completion;
- checklist state;
- evidence target presence;
- expected output text.

Node `current` still requires existing Evidence records linked through Node `evidenceIds`.

## 7. Agent Workflow Contract

Project Control needs an agent-facing workflow document so new rooms do not improvise the model.

The required sequence should be:

1. Read Project Control entry documents.
2. Identify the requested Node path or Work path.
3. If a Work item is a topic, inspect its children before treating it as executable.
4. If no executable task exists, create or propose a child task instead of adding phases to a broad topic.
5. If a Work item is a task, read its context documents, active role, stop conditions, phases, checklist, and evidence targets.
6. Identify the owner repository before editing product behavior.
7. Read the owner repository `AGENTS.md`.
8. Execute only the approved task scope.
9. Report phase/checklist status without promoting Node truth.
10. Register Evidence records only after fresh verification exists.
11. Update Project Control records and generated index only when shared knowledge changed.
12. End with PASS, FAIL/BLOCKER, RISK, UNKNOWN, files changed, tests run, evidence or map updates, intentionally not changed, and next recommended work.

This workflow should live in a domain document, likely:

```text
docs/domains/work-tree-operating-rules.md
```

`AGENTS.md` and `docs/domains/flowdoc-round-workflow.md` should link to it before product implementation rounds.

## 8. GUI Read Model Implications

The GUI should remain a read-only control surface.

Minimum useful GUI changes:

- show Work tree separately from the Node tree;
- distinguish `topic` and `task`;
- when a topic is selected, show child Work items and the next decomposition hint;
- when a task is selected, show phases, checklist, stop conditions, context documents, and evidence targets;
- keep checklist state visually separate from truth state;
- keep existing modal detail available for full context.

The GUI should not edit phases or checklist state in this design.

## 9. Migration Strategy

This should be staged to avoid breaking current Project Control records all at once.

### Stage 1: Schema Support

- Add Work fields to TypeScript types and JSON schema.
- Add semantic validation for Work tree references and task requirements.
- Keep existing Work records valid by migrating them to `workKind: "topic"`.

### Stage 2: Current Work Migration

- Add `contextDocumentIds`, `stopConditions`, and topic-oriented summaries to the four active Work records.
- Keep `requiredEvidence: []` until real Evidence records exist.
- Add `evidenceTargets: []` only for topics, not tasks.

### Stage 3: First Executable Task

- Choose one current Work topic.
- Add one child Work task with phases, checklist, and evidence targets.
- Use this as the first live drill for a new Codex room.

### Stage 4: Agent Workflow Document

- Add `docs/domains/work-tree-operating-rules.md`.
- Add a Document record for it under Project Control.
- Update `AGENTS.md` and `flowdoc-round-workflow.md` to require it.

### Stage 5: GUI Readout

- Add Work tree display and task detail readout.
- Keep editing file-first.

## 10. Initial Candidate Task

The safest first task is not product behavior. It should be a Project Control self-improvement task under:

```text
Project Control
  Work Tree and Agent Workflow Model
```

Candidate phases:

1. Define model and validation.
2. Migrate current Work topics.
3. Add one child executable task.
4. Register workflow document and agent instructions.
5. Verify Project Control gate.

This avoids touching Core, Editor, or Backend while proving the control model.

## 11. Risks and Open Questions

- If every broad topic becomes a task too early, phases will become vague and checklists will lose value.
- If evidence targets are too strict for early exploration, agents may create fake precision. Topics should remain topics until a real task exists.
- If checklist state is treated as truth, Project Control will recreate the original problem of mixing plan and verified state.
- If GUI readout leads the design, the model may optimize for presentation instead of agent workflow reliability.
- If Work tree and Node tree are allowed to merge, future rooms will not know whether a branch represents system structure or execution planning.

Open questions for review:

1. Should `activeRole` be a fixed enum matching `flowdoc-role-catalog.md`, or remain a string in the first migration?
2. Should checklist state start as `pending` only in committed records, with PASS/FAIL/BLOCKER kept in handoff text until a later editing workflow exists?
3. Should task leaf enforcement be hard from Stage 1, or introduced only after the first migrated task exists?

## 12. Acceptance Criteria

The design is ready to implement when:

- Node tree, Work tree, Phase, Checklist, and Evidence target have separate meanings.
- Existing Work records can migrate without pretending to be executable tasks.
- At least one child task can demonstrate phase/checklist behavior.
- Validator rules prevent missing context on executable tasks.
- Agent workflow documentation tells a new Codex room exactly how to proceed.
- No rule allows Work progress to promote Node truth without Evidence.
