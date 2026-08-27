# FlowDoc System Map

## Purpose

This is the product-wide entry map for the FlowDoc system as known by Project
Control. It summarizes registered systems and points to their canonical maps or
overview documents. It is not a work plan and does not claim product readiness.

This map should change only when Project Control has a reviewed document,
Evidence record, or deliberately bounded registry update to point at.

## System inventory

| System | Repository | Current registry state | Canonical reference |
| --- | --- | --- | --- |
| Project Control | `repo-project-control` | `current` for the file-first registry, generated read model, and read-only control GUI boundary. | [Project Control Overview](project-control.md) |
| FlowDoc Browser Backend Compatibility | `repo-editor`, `repo-backend`, `repo-core` | `current` only for the bounded local loopback headless Chrome smoke where the rendered Editor product routes load a Core-backed document through a live Backend server, apply migration, and commit one UI reorder mutation. This does not promote product readiness, deployed Backend compatibility, cross-browser coverage, broad corpus coverage, accessibility, visual regression, or broad repository truth. | [Bounded Browser Compatibility Promotion](flowdoc-bounded-browser-compatibility-promotion-2026-08-27.md) |
| Core | `repo-core` | `unknown` for broader Core. The bounded `core-route` child is current; Text Engine, Template Builder, Live Draft, and Text Block documentation syntheses are registered but their families remain unknown. Core also has a registered Project Control entrypoint pointer in `AGENTS.md`; this does not promote runtime state. | [Core Document Map](../versions/V0_1_0a_1/core/DOCUMENT_MAP.md) |
| Editor | `repo-editor` | `unknown` for broad Editor runtime and UI state. A registered `AGENTS.md` entrypoint pointer routes broad FlowDoc work through Project Control, and the bounded browser compatibility child records one accepted local product-route smoke without promoting product-wide Editor truth. | No product-wide Editor map is registered yet. |
| Backend | `repo-backend` | `unknown` for broad Backend service and production state. A registered `AGENTS.md` entrypoint pointer routes broad FlowDoc work through Project Control, and the bounded browser compatibility child records one accepted local live Backend smoke without promoting product-wide Backend truth. | No product-wide Backend map is registered yet. |

## Core registered families

Core currently has one active document map for the `V0_1_0a_1` release line.
That map is the canonical Core-level reference and remains partial until
broader Core synthesis, coverage, reference repair, publication review, and
authorized cleanup are complete.

The registered Core families are:

- `core-route`: current bounded family closure with cleanup Evidence.
- `text-engine`: documentation synthesis complete; family truth remains
  unknown.
- `template-builder`: documentation synthesis complete; family truth remains
  unknown.
- `live-draft`: documentation synthesis complete; family truth remains
  unknown.
- `text-block`: documentation synthesis complete; family truth remains
  unknown.

## Work and truth boundary

Plan / Work records intent. They describe what a round is trying to do and what
must be checked.

System maps record verified or deliberately bounded registry truth. A planned
task does not enter this map as completed system state. After work finishes,
Project Control should register documents, Evidence, and node changes first;
then the appropriate system map can be updated to point at that reviewed state.

## Update rule

When new product work completes:

1. Keep the work plan in Work, spec, or implementation-plan documents.
2. Verify the owning repository with fresh tests or durable Evidence.
3. Register or update the bounded Project Control document and Evidence
   records.
4. Update the narrowest map that changed first, such as a Core family map.
5. Update this FlowDoc system map only when the product-wide inventory or
   canonical reference list changes.

This keeps plans from becoming truth and keeps maps useful as stable entry
points for future work.
