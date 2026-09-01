# FlowDoc Project Control Skill Installation - 2026-09-01

## Authority Boundary

This document records installation and bounded validation of the local personal
Codex skill `flowdoc-project-control`. It is owned by Project Control under
`flowdoc-product-development-resumption > agent-and-skill-design`.

The skill is an agent entrypoint guard. It is not a FlowDoc product behavior
claim, not a generated Project Control read model, not a source of map truth,
and not a replacement for Project Control records. Canonical FlowDoc shared
understanding still lives in Project Control `data/` and `docs/` records.

This document does not promote Core, Backend, Editor, compatibility, release
readiness, frontend readiness, FlowDoc product truth, or map truth.

## Work Context

- Work path: `flowdoc-product-development-resumption > agent-and-skill-design`
- Owner repository: `repo-project-control`
- Active role: `project-control-steward`, with Documentation Authority Steward
  and Evidence Registrar responsibilities for this phase
- Current Phase: `phase-agent-and-skill-design-flowdoc-project-control-skill`
- Checklist target:
  `checklist-agent-and-skill-design-flowdoc-project-control-skill`
- Evidence target: `evidence-flowdoc-project-control-skill-2026-09-01`
- Known risks: local personal skills may not be installed or surfaced in every
  future environment, and generic planning defaults can still be present
- Unknown state: bounded validation does not prove future agent compliance
  outside this machine, future Codex skill routing, or all possible prompt
  pressure cases

## Installed Skill

The local skill is installed at:

```text
C:\Users\nekot\.codex\skills\flowdoc-project-control\SKILL.md
```

Its trigger description starts:

```text
Use when working on FlowDoc
```

The skill routes any FlowDoc, Project Control, Core, Backend, Editor, document
map, evidence, Work record, product terminology, or `flowdoc-*` repository work
through Project Control first. It requires the agent to identify the Work path,
owner repository, active role, current Phase, Checklist target, Evidence target,
known risks, and unknown state before treating repository state as current or
editing behavior.

For FlowDoc Markdown work, it points to
`docs/domains/flowdoc-agent-documentation-authority-operating-rules.md` and
states that Project Control override wins over generic planning or writing
skills. It blocks FlowDoc-wide plans, role definitions, cleanup decisions,
product terminology, cross-repository readiness, and map-truth boundaries from
being written into product-repository `docs/superpowers/plans` or
`docs/superpowers/specs` paths.

If Project Control cannot identify the required context, the skill requires the
agent to stop before editing and report exactly:

```text
BLOCKER: FlowDoc Project Control unavailable or unresolved.
```

## Validation

Structural validation passed for the local skill package:

```text
python C:\Users\nekot\.codex\skills\.system\skill-creator\scripts\quick_validate.py C:\Users\nekot\.codex\skills\flowdoc-project-control
```

The RED Project Control guard failed before these records existed:

```text
npx vitest run tests/flowdoc-project-control-skill.test.ts tests/agent-documentation-authority-operating-rules.test.ts --maxWorkers=1
```

The failure showed that `agent-and-skill-design` still lacked the skill
packaging Phase, required Evidence, and installation document.

Historical RED evidence remains the product-repository Markdown drift already
recorded by Project Control: generic `docs/superpowers` planning defaults were
usable before Project Control documentation authority policy, role overlays,
guards, and global guidance were explicit.

A live no-skill pressure scenario did not reproduce the old failure because
the current global guidance already routes FlowDoc-wide planning through
Project Control. The agent chose Project Control Work/Phase/Checklist/Evidence
instead of the generic product-repository plan path, which means the global
control layer is now helping.

The GREEN skill pressure scenario attached this skill directly. The agent chose
Project Control first, listed the required pre-action fields, rejected the
generic `docs/superpowers/plans` path for FlowDoc-wide truth, and gave the
Project Control unresolved blocker phrase.

This is bounded validation. It confirms the skill structure and one pressure
case; it does not prove future agent compliance for every environment, missing
skill installation, disabled skill routing, or adversarial prompts.

## Limits

- The skill is local to `C:\Users\nekot\.codex\skills` and is not stored inside
  Core, Backend, Editor, or the Project Control repository.
- Project Control `AGENTS.md` and global Codex guidance remain the primary
  durable entrypoint rules.
- Product repositories still own behavior and their own `AGENTS.md` files.
- Work records, glossary wording, plans, GUI history, generated indexes, and
  this skill are not product evidence by themselves.
