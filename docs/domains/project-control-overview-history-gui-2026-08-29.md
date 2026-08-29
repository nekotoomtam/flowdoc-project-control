# Project Control Overview and History GUI Implementation

Status: implemented bounded Project Control GUI behavior.
Date: 2026-08-29.
Scope: Project Control read-only GUI Overview, Work History, focused area
return flow, and matching agent guidance.

Work path: `flowdoc-product-development-resumption > project-control-overview-history-gui`
Owner repository: `flowdoc-project-control`
Active role: `product-implementation-agent`
Phase: `phase-project-control-overview-history-gui`
Checklist: `checklist-project-control-overview-history-gui`
Evidence target: `evidence-project-control-overview-history-gui-2026-08-29`

## Authority Boundary

This document records the first implemented Project Control GUI behavior for
the repo-first Overview and separated History direction at Project Control
commit `97e9d234d2bb1e2d294463a395604d5f0ec75348`.

It supports only the bounded read-only Project Control GUI claim described
below. It does not promote Core, Backend, Editor, compatibility, or product
readiness truth. Product repositories remain the authority for product runtime
behavior, contracts, tests, and readiness claims.

History remains navigation context, not Evidence. A History row may help the
user return to a related repository or area, but it cannot prove a claim or
close an unknown state.

## Implemented Behavior

- Home renders `Repo Directory Overview` as the first broad orientation
  surface.
- The Overview shows repository or area entry cards with compact truth, Work,
  blocked Work, Evidence, and repository signals.
- Home no longer renders the raw Work tree, Project Control Node tree,
  Evidence list, Checklist list, or full relationship graph before selection.
- Work History View is a separate surface for time-ordered Work records.
- History rows show concise Work context, related area, repository names, and a
  focus action that returns to the related Overview area.
- Focused repository or area views keep Detail behind selection and continue to
  expose the existing scoped Work tree, child Project Control Nodes, Evidence,
  Checklist, and View all overlay behavior.

## Verification

- RED check: `npx vitest run tests/project-control-overview-history-gui-implementation.test.ts --project node --reporter verbose` failed before the Work, document, evidence, and guidance records existed.
- GUI behavior check: `npm run check` passed in the Project Control worktree
  after implementation with 48 unit test files, 319 unit tests, production
  build, and 6 Playwright e2e tests.
- Covered surfaces: Home Overview, Work History, History-to-focused-Overview
  return flow, selected branch detail, URL synchronization, full detail overlay,
  accessibility labels, and desktop readability.

## Risks

- The History list still renders all Work records. Current volume is small
  enough for this implementation slice, but grouping, filtering, pagination, or
  virtualization should be considered when Project Control grows.
- The focused repository or area view still uses the existing branch-detail
  layout. This round does not complete the later frontend redesign.
- A baseline `npm run check` attempt earlier in the worktree observed a
  Vitest worker-pool startup timeout. A serialized UI probe and later full gate
  passed; the timeout remains a load-sensitive test-runner risk, not a known
  product behavior failure.

## Unknown

- Hosted deployment behavior and non-local browser environments are not
  verified by this evidence.
- Very large Project Control record sets have not been profiled.
- Product Editor frontend redesign, Core behavior, Backend behavior, and
  cross-repository compatibility are outside this claim.
