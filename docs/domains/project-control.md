# Project Control Overview

## Current scope

Project Control is the shared, file-first registry for Flowdoc Nodes, Work, Documents, Repository Registry entries, and Evidence. Its generated index is a deterministic read model, and its first GUI is read-only.

This overview is current only for the Project Control architecture described by the approved design at commit `bc2e1efb60c7391b2d4b0978cf7c4b1105ef7444`. It does not claim that Core, Editor, or Backend is current.

## Evidence boundary

The current Project Control claim is supported by the approved design object at `docs/superpowers/specs/2026-08-12-flowdoc-project-control-design.md` in the Project Control repository. The Evidence record deliberately limits its verification to that object and commit.

## Product-repository inspection baselines

These approved preflight baselines identify exact revisions inspected before this seed was authored. They are not Evidence records and do not establish current truth for the product Nodes.

| Repository | HTTPS remote | Inspected commit |
| --- | --- | --- |
| Project Control | `https://github.com/nekotoomtam/flowdoc-project-control.git` | `d7bbb4cc2a8a30356a59e5d434b794cf357f233a` |
| Core | `https://github.com/nekotoomtam/flowdoc-vnext-core.git` | `76a2f2311a898e781f53773390d47b05812911e4` |
| Editor | `https://github.com/nekotoomtam/flowdoc-vnext-editor.git` | `43dcebb22735d7330fda0d57d4e7ce9a726e2454` |
| Backend | `https://github.com/nekotoomtam/flowdoc-vnext-backend.git` | `280c4ffbe075cd5391cce5219e8f9c40fed16527` |

## Queued pilot

`work-core-route-pilot` is future work for the `CORE_ROUTE_*` migration. Before it can update durable truth, it must produce and record a consolidated document commit, a migrated reference/test result, and a Project Control evidence record. Those artifacts do not exist in this seed and therefore are not represented as Evidence IDs.
