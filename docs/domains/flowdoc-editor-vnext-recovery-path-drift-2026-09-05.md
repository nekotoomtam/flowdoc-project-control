# FlowDoc Editor vNext Recovery From Old Repo Path Drift

## Authority Boundary

Owner repository: Project Control.
Scope: Project Control recovery and evidence-boundary record for Editor work that drifted into the old `FlowDocEditor` repository and the first recovered replacement commits now present in canonical `flowdoc-vnext-editor`.
This document does not promote Core, Backend, Editor, compatibility, release readiness, frontend readiness, Preview readiness, Publish readiness, WYSIWYG readiness, FlowDoc product truth, Project Control terminology authority, or map truth.

## Work Context

- Work path: `flowdoc-product-development-resumption > flowdoc-frontend-expert-roadmap > flowdoc-frontend-product-map > flowdoc-design-workspace-usability`
- Owner repository: `repo-project-control` for this recovery record; `repo-editor` for the product commits being reviewed
- Active role: `project-control-steward` with `evidence-reviewer` and `lane-reconciliation-reviewer` responsibilities
- Current Phase: recovery overlay for the existing Design workspace usability and Structure Pattern Build/Preview evidence paths
- Checklist target: identify the first path-drift round, mark old-repo evidence as suspect for vNext purposes, accept only replacement commits that exist in canonical `flowdoc-vnext-editor`, and preserve boundaries
- Evidence target: `evidence-flowdoc-editor-vnext-recovery-path-drift-2026-09-05`
- Known risks: old Project Control records still contain accepted wording for old `FlowDocEditor` commits; recovery must not turn bounded UI status affordances into broad frontend readiness
- Unknown state: Structure Pattern Build/Preview recovery is not complete in this record; Preview readiness, Publish readiness, WYSIWYG readiness, runtime submission persistence, generated PDF files, production readiness, and release readiness remain unverified

## Drift Finding

PLAN audited Project Control Editor records by checking whether each cited Editor commit exists in canonical `C:\Users\nekot\Documents\GitHub\flowdoc-vnext-editor` or only in the old `C:\Users\nekot\Documents\GitHub\FlowDocEditor` repository.

The earliest confirmed drift is 2026-09-03 17:46 +0700:

| Status | Commit | Old subject | Project Control meaning |
| --- | --- | --- | --- |
| wrong-repo evidence | `e78ae4160d1ab1759961dbeb3d646beb3490ec46` | Add editor workspace status strip | first `lane-design-workspace-usability` acceptance used an old `FlowDocEditor` commit |
| wrong-repo evidence | `cb3c1ca4e35973c3bd4f89d969826911e109e55c` | Add selected-region command summary | continuation selected-region command summary acceptance used an old `FlowDocEditor` commit |
| wrong-repo evidence | `65ab5b149c5aad10b36bbaa23650b9fce7070dff` | Build preview structure pattern foundation | Structure Pattern Build/Preview foundation used an old `FlowDocEditor` commit |
| wrong-repo evidence | `3ac90724a5dd6ea92f1d7a9cde11dfb19fa0b48c` | Harden Preview structure pattern entry simulation | first Preview simulation attempt used an old `FlowDocEditor` commit |
| wrong-repo evidence | `78dbae50e234487e64c58eae5480d8a8f1c16f97` | Improve build authoring focus | Build usability lane used an old `FlowDocEditor` commit |
| wrong-repo evidence | `76e32076a6588fb48def07daaf08825c41afa334` | Harden Preview structure pattern entry simulation | revised Preview simulation lane used an old `FlowDocEditor` commit |
| wrong-repo evidence | `715dd2e7edf0e7a3592ab7ff7e55cced361c836a` | Merge branch `codex/editor-preview-entry-simulation-contract` into `codex/editor-build-preview-usability-integration-r1` | integration acceptance used an old `FlowDocEditor` commit |

These commits remain historical source context only. They must not be treated as canonical vNext Editor evidence.

## Recovered vNext Evidence

PLAN opened real Editor WORK rooms targeted only at `flowdoc-vnext-editor`.

The workspace status strip recovery room returned PASS at vNext commit `9e0097d87e91923218825021d4b7f0f9c60b7930`. PLAN verified that commit exists in `flowdoc-vnext-editor` and does not exist in old `FlowDocEditor`, reviewed the diff, ran focused workspace shell tests, fast-forwarded Editor main, and ran `npm run check` on Editor main. The main gate passed with 110 test files and 398 tests plus production build.

The selected-region command summary recovery room first returned a mistyped full hash. PLAN sent a Revision Packet back to the same WORK room instead of correcting the handoff silently. The corrected handoff returned PASS at vNext commit `8b966ee30f6a978a3c20d8b2abf640d3d3eac86e`. PLAN verified that commit exists in `flowdoc-vnext-editor` and does not exist in old `FlowDocEditor`, reviewed the diff, ran focused selected-region tests, merged it to Editor main as `8bcc17563daa91780dc01fbb8a7bf90eedc0cbea`, and ran `npm run check` on Editor main. The main gate passed with 111 test files and 403 tests plus production build.

## Pending Recovery

The Structure Pattern Build/Preview and Build/Preview usability records remain pending recovery. The old `FlowDocEditor` commits from `65ab5b149c5aad10b36bbaa23650b9fce7070dff` through `715dd2e7edf0e7a3592ab7ff7e55cced361c836a` are not accepted as vNext evidence by this record.

A Structure Pattern recovery WORK room was opened from current vNext Editor main, but this document does not accept any Structure Pattern replacement commit yet.

## Boundaries

This recovery record accepts only bounded Editor UI evidence for the two recovered Design workspace affordance lanes. It does not activate Preview, Publish, direct page editing, WYSIWYG/contenteditable behavior, Backend calls, Core semantics, runtime submissions, generated PDF files, artifact storage, production behavior, or release readiness.

No system map changed in this record.
