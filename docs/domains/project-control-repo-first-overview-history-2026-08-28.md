# Project Control Repo-First Overview and History Direction

Status: approved design direction.
Date: 2026-08-28.
Scope: Project Control read-only GUI information architecture and
agent-facing operating guidance.

## Authority Boundary

This document locks the approved direction for the next Project Control GUI
orientation work. It does not claim that the GUI implementation is complete,
does not promote Core, Backend, Editor, or cross-repository truth, and is not
Evidence by itself.

Project Control remains the owner of this decision. Product repositories remain
the owners of runtime behavior, tests, and implementation-local contracts.

## First implementation evidence

The first bounded implementation of this direction is recorded separately in
`doc-project-control-overview-history-gui-2026-08-29` and supported by
`evidence-project-control-overview-history-gui-2026-08-29`.

That evidence covers the Project Control read-only GUI Home Overview, separate
Work History View, History-to-focused-Overview return flow, and agent-facing
guidance update. It does not promote Core, Backend, Editor, compatibility, or
product readiness truth.

## Decision

Project Control should present a repo-first entry experience before it presents
record detail.

The first screen should be a `Repo Directory Overview`. It should help the user
choose which repository or bounded area to inspect. It must not behave like a
single large dashboard that renders every Work record, Project Control Node,
Evidence record, Checklist item, or relationship at once.

Home shows repository or area headings before Work, Project Control Node,
Evidence, or Checklist detail. Detail appears only after the user chooses a
repository, area, Work item, Project Control Node, or Evidence target.

## Repo Directory Overview

`Repo Directory Overview` is the first Project Control GUI surface for broad
orientation.

Overview answers where an area lives in the system.

It should show only the smallest useful entry set, such as:

- Project Control
- Core
- Backend
- Editor
- Cross-repository or compatibility work, when that area has a registered
  Project Control Node

Each entry may show compact state signals such as truth state, active Work
count, evidence gap count, or a highest-priority risk marker. It should not
render long Work lists, full Node trees, full Evidence lists, or Checklist
content on the first screen.

The Overview is a directory and map entry point, not the place where the user
reads the system.

## Work History View

`Work History View` is the Project Control GUI surface for reviewing recorded
work over time.

History answers what has been recorded over time.

History should be chronological or grouped by time. Each row should be concise
and identify the related repository or area, Project Control Node, Work path,
and available Evidence target or Evidence record. It should not replace the
Evidence model.

History is not Evidence. A History row may point at an Evidence target or an
Evidence record, but it cannot by itself promote a Node to `current`, prove a
product behavior, or close an unknown state.

A History item returns to the Overview and focuses the related repository or
area. The user should land in the same conceptual map they would have reached
by entering through the repo or area card directly.

## Focused Repository View

After the user chooses a repository or area, Project Control may show a focused
repository view. This is where the GUI can reveal more structure without
overloading the Home surface.

A focused repository view may show:

- the selected repository or area summary;
- child Project Control Nodes for that area;
- active Work lanes attached to that area;
- Work lineage for a selected Work item;
- Evidence targets and Evidence records for the selected claim;
- risks and unknowns scoped to the selected area.

The focused view should still preserve the distinction between Overview,
History, and Detail. It should not collapse them back into one large surface.

## Required Navigation Flow

The approved flow is:

```text
Home Repo Directory Overview
  -> choose repository or area
  -> focused repository overview
  -> choose Work, Project Control Node, or claim
  -> detail or Evidence inspection
```

The approved History return flow is:

```text
Work History View
  -> choose recorded item
  -> Repo Directory Overview focused on the related repository or area
  -> open detail only if the user asks for it
```

## Data and Performance Rule

The first Overview should render from aggregated read-model facts and stable
IDs. It should not need to render every Work record, Project Control Node,
Evidence record, Checklist item, or full relation to be useful.

Detailed lists should be lazy or scoped by selection. This keeps the first
screen readable when Project Control contains many Work records, Evidence
records, or Nodes.

## Agent Operating Rule

Any agent changing Project Control GUI behavior, Project Control GUI docs, or
agent-facing guidance for the GUI must classify the surface as `Overview`,
`History`, or `Detail` before implementation.

- `Overview` is for repo or area entry and compact state only.
- `History` is for time-ordered recorded work and must link back to focused
  Overview.
- `Detail` is for full Work, Project Control Node, Evidence, Checklist,
  document, or risk inspection.

Agents must not treat History as Evidence. Agents must not promote planned GUI
behavior into a system map until implementation, verification, document records,
and bounded Evidence support that claim.

When a Project Control GUI round finishes, the handoff must state which surface
changed: Overview, History, Detail, or agent guidance. If navigation or agent
workflow changed, the agent-facing documents must be updated in the same round
or the handoff must report a `RISK`.

## Terminology Decisions

- `Repo Directory Overview`: `define`.
- `Work History View`: `define`.
- `Node`: `split`; use `Project Control Node` in this Project Control GUI
  context.
- `History`: `define`; it means a GUI record of work over time and is not
  Evidence.
- `Overview`: `define`; it means repo or area orientation, not a full dashboard.

