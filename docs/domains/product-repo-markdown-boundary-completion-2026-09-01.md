# Product Repository Markdown Boundary Completion - 2026-09-01

This record closes the product-repository Markdown boundary lane for
`flowdoc-product-development-resumption >
flowdoc-documentation-authority-cleanup`.

It records that surviving Markdown in Core, Backend, and Editor now carries an
explicit `## Authority Boundary` section that points FlowDoc-wide authority
back to Project Control.

## Authority Boundary

Owner repository: Project Control for this cleanup record. Core, Backend, and
Editor own their repository-local Markdown files and tests.

Scope: Product repository Markdown boundary completion for tracked Markdown in
Core, Backend, and Editor after prior docs/superpowers retirement,
repo-local classification, and targeted Core boundary lanes.

Project Control remains the canonical home for FlowDoc-wide Work, Phase,
Checklist, Evidence, Risk, Unknown, Roadmap, documentation authority, product
terminology, compatibility promotion, and map truth.

This record does not make surviving product-repository Markdown active
FlowDoc-wide status, roadmap, risk, unknown, Phase, Checklist, Evidence,
terminology, compatibility, release-readiness, frontend-readiness, or map
authority. It does not promote Core, Backend, Editor, compatibility, release
readiness, frontend readiness, FlowDoc product truth, Project Control
terminology authority, or map truth.

## Source Snapshot

Project Control source commit:
`b36daa212bd94ceb66b1a6d70bd75c19831065df`.

Product repository source commits before this lane:

- Core: `661d0bb214db4c68b9403c3e5783e40123944d4a`
- Backend: `c24f7f000a8b8e9a181434dd95d7611afa026a75`
- Editor: `4927a0022dc8170b8cb386ede0129a69508a1d29`

Strict pre-lane Authority Boundary counts:

| Repository | Tracked Markdown | Already strictly bounded | Newly bounded |
|---|---:|---:|---:|
| Core | 339 | 20 | 319 |
| Backend | 39 | 1 | 38 |
| Editor | 54 | 0 | 54 |

Project Control tracked Markdown remains central authority material and is not
converted into product-repository boundary prose by this lane.

## Cleanup Result

Core commit `a89b02c3d2d0073ee7ef669de25b862d5534717e` adds Authority
Boundary wording to surviving tracked Core Markdown that did not already have
the strict section. Core commit
`87fab8061852a9a1c1c8886dfa029f72e15bf211` stabilizes the Core Markdown
authority guard timeout after merged-main verification showed the strict scan
can exceed the default test timeout on Windows.

Backend commit `d7b417451eac4b64cd68403290ead7e466102648` adds Authority
Boundary wording to surviving tracked Backend Markdown and adds a Backend
guard.

Editor commit `9936d3ff052df45826eb8bfc089a62de46c3d645` adds Authority
Boundary wording to surviving tracked Editor Markdown and adds an Editor guard.

Strict post-lane Authority Boundary counts:

| Repository | Result |
|---|---|
| Core | Core: 339 tracked Markdown files; 319 newly bounded; strict missing count 0 |
| Backend | Backend: 39 tracked Markdown files; 38 newly bounded; strict missing count 0 |
| Editor | Editor: 54 tracked Markdown files; 54 newly bounded; strict missing count 0 |

Each inserted product-repository boundary states the owning repository, limits
scope to repository-local documentation context, points FlowDoc-wide Work,
Phase, Checklist, Evidence, Risk, Unknown, Roadmap, documentation authority,
product terminology, compatibility promotion, and map truth back to Project
Control, and denies promotion of product truth or readiness claims.

## Cleanup Housekeeping

The lane used short worktree paths:

- `C:/w/fd-core-md-boundary`
- `C:/w/fd-backend-md-boundary`
- `C:/w/fd-editor-md-boundary`
- `C:/w/fd-pc-md-boundary`

Product cleanup branches were merged to main and deleted:

- `fd-core-md-boundary-complete-0901`
- `fd-backend-md-boundary-complete-0901`
- `fd-editor-md-boundary-complete-0901`

The temporary Core and Backend junctions under `C:/w` were removed. Core,
Backend, and Editor product worktrees for this lane were removed. Backend and
Editor worktree removal first left ignored `node_modules` shells behind after
Git had already unregistered the worktrees; those empty shells were deleted
from the verified `C:/w` lane paths.

Historical cleanup folders recorded by earlier evidence remain housekeeping
risks only. They are not active product worktrees and do not carry unmerged
documentation authority patches for this lane.

## Verification Target

The cleanup lane is verified only when:

- product-repository guards fail before the final boundary wording exists;
- all tracked Core, Backend, and Editor Markdown files carry strict
  `## Authority Boundary` wording;
- focused product-repository guards pass in worktrees and on merged main;
- full product-repository main gates pass;
- Project Control records the Work, Phase, Checklist, Document, and Evidence
  targets without promoting shared product truth.

Verification completed after the product main heads listed above:

- Core `npm run docs:check` passed on merged main.
- Core focused guard passed on merged main with 5 files and 32 tests.
- Core `npm run check` passed on merged main with 461 test files and 2954 tests.
- Backend focused guard passed on merged main with 1 file and 2 tests.
- Backend `npm run check` passed on merged main with 90 test files passed,
  1 skipped, 326 tests passed, 24 skipped, and build passed.
- Editor focused guard passed on merged main with 1 file and 2 tests.
- Editor `npm run check` passed on merged main with 109 test files and
  394 tests, and build passed with the existing Vite chunk-size warning.
- Project Control focused guard passed in the Project Control worktree with
  2 files and 20 tests.
- Project Control `npm run generate`, `npm run check:data`, and
  `npm run check` passed in the Project Control worktree. The full gate passed
  60 unit test files, 348 unit tests, build, and 6 e2e tests.

The Project Control full gate used temporary verified junctions
`C:/w/flowdoc-vnext-core`, `C:/w/flowdoc-vnext-backend`, and
`C:/w/flowdoc-vnext-editor` that pointed to the clean main product checkouts;
those junctions were removed after the gate passed.

This record preserves cleanup evidence only. It does not edit Core, Backend,
or Editor runtime behavior by itself and does not promote Core, Backend,
Editor, compatibility, release readiness, frontend readiness, FlowDoc product
truth, Project Control terminology authority, or map truth.
