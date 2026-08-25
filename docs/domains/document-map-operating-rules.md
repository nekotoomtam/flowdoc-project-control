# Document Map Operating Rules

## Purpose

This document defines how Project Control separates planning documents from
system truth maps. It keeps broad FlowDoc work readable while preventing
unfinished intent from being presented as verified system state.

## Core rule

Plan / Work records intent.

DOCUMENT_MAP records verified system truth.

The same round of work can use both document types, but at different moments.
The plan comes first and describes the target. A document map changes later,
after the target state has been checked and Project Control has a bounded
reference to point at.

## Planning documents

Planning documents answer:

- What are we trying to do in this round?
- Which repository owns the work?
- Which tasks, checks, and evidence targets belong to this round?
- Which risks or stop conditions should prevent promotion?
- What map entry should be updated if the work succeeds?

Planning documents may contain expected outcomes. Expected outcomes are not
current system truth until the work is implemented, verified, and registered.

`docs/superpowers/plans/` files are historical execution traces. They can
preserve the exact assumptions, branch-local commits, and review loops from a
past round, but they do not override active `data/` records, Evidence, coverage
files, generated index content, or the narrowest current DOCUMENT_MAP.

## System truth maps

System truth maps answer:

- What exists in the system according to Project Control right now?
- Which subsystem or family is represented?
- Which document is the canonical entry point?
- Which state is current, planned, risk, or unknown?
- Which authority is explicitly excluded?

A map entry should point at canonical overview, contract, version, or evidence
records. It should not absorb the detailed content of those records.

## Update timing

Use this order for broad work:

```text
Plan
  -> implement in the owning repository
  -> test or gather durable Evidence
  -> synthesize bounded Project Control documents
  -> update node, document, and evidence records
  -> update the narrowest DOCUMENT_MAP or system map
  -> report the result
```

Do not update a map at the start of work except to record an explicitly
bounded registry fact, such as a new map document that says a system remains
unknown.

## Map hierarchy

Project Control uses maps at the narrowest useful level:

- `docs/domains/flowdoc-system-map.md`: product-wide entry inventory.
- `docs/versions/V0_1_0a_1/core/DOCUMENT_MAP.md`: Core release-line document
  map.
- Future Editor or Backend maps should live near their own domain or versioned
  documentation once they have reviewed material.

Higher-level maps should link down. Lower-level maps should hold the precise
family or release-line details.

## Handoff requirement

When an agent finishes a round that might affect a map, the handoff must say:

- whether a map changed;
- which map changed;
- which verification or Evidence supports the change;
- which planned entries intentionally did not move into the map;
- which system states remain unknown.

This makes the GUI and future agent handoffs depend on the same durable source
of truth.
