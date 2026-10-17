# FlowDoc Product Evidence Refresh - 2026-08-26

## Scope

This packet records the first product evidence refresh after Project Control gained executable Work path, Phase, Checklist, and Evidence target records. It is intentionally bounded to repository heads, local verification gates, promotion blockers, and next remediation targets.

It does not promote FlowDoc, Core, Editor, or Backend to product-wide `current`.

## Work Context

- Work path: `flowdoc-product-development-resumption > flowdoc-product-evidence-refresh`
- Phase: `phase-flowdoc-product-evidence-refresh-readiness`
- Checklist: `checklist-flowdoc-product-evidence-refresh-readiness`
- Active role: Evidence Reviewer
- Owner repositories: Project Control, Core, Editor, Backend

## Repository Heads

| Repository | Status | Commit | Subject |
| --- | --- | --- | --- |
| Project Control | `main...origin/main [ahead 1]` | `3cfab24a85d1335033105b3d8c12d9a84ae88509` | `chore: open product evidence refresh work path` |
| Core | `main...origin/main` | `501caec1fe3317309d0f6c18c2dec118fb6994e7` | `chore: integrate core route cleanup history` |
| Editor | `main...origin/main` | `baa871c378a313e8f0c402ea33e3aa480953ce1f` | `docs: route FlowDoc work through Project Control` |
| Backend | `main...origin/main` | `7ebb973b07962c35c627fb5bc2f2f7eafda2ea8a` | `docs: route FlowDoc work through Project Control` |

Core, Editor, and Backend were clean at the captured heads.

## Verification Results

| Repository | Command | Result |
| --- | --- | --- |
| Core | `npm run type-check --silent` | PASS |
| Core | `npm run test --silent` | PASS: 458 test files, 2,938 tests |
| Editor | `npm run type-check --silent` | PASS |
| Editor | `npm run test --silent` | PASS: 76 test files, 278 tests |
| Backend | `npm run type-check --silent` | PASS |
| Backend | `npm run test --silent` | PASS: 88 passed test files, 312 passed tests, 1 skipped file, 24 skipped tests |

Earlier same-day review observed one Core full-suite timeout in `tests/textBlockUnifiedLayoutTextStyleSourceV1.test.ts:829`; the targeted rerun and whole-file rerun passed, and this evidence refresh full-suite run also passed. Treat this as a monitoring risk, not a current gate failure.

## Supported Claims

- Project Control can now point future FlowDoc rooms at an executable product evidence refresh Work path with Phase, Checklist, and Evidence targets.
- Current clean local Core, Editor, and Backend heads pass their local type-check and test gates.
- The evidence supports a product resumption review lane, not product-wide readiness.

## Not Promoted

- FlowDoc remains `planned`.
- Core remains `unknown` for broader Core.
- Editor remains `unknown`.
- Backend remains `unknown`.
- Core-Editor compatibility remains unaccepted by Project Control.
- Core-Backend compatibility remains unaccepted by Project Control.
- Production activation and service readiness remain unaccepted.

## Promotion Blockers

1. Core public package boundary remains broad relative to the incomplete release boundary.
2. Editor still has a fixture boot/fallback path that can mask backend unavailability unless status surfaces are unmistakable.
3. Backend default server and storage paths remain local/dev readiness surfaces, not production service evidence.
4. Project Control has local evidence for current gates, but no accepted cross-repository compatibility Evidence yet.

## Next Remediation Targets

| Target | Owner | Role | Evidence Target |
| --- | --- | --- | --- |
| Core public export boundary review | `repo-core` | Cross-Repo Boundary Reviewer | A narrower export/adoption boundary or a documented no-go decision with tests proving consumer imports stay inside approved surfaces. |
| Editor backend-unavailable honesty review | `repo-editor` | Evidence Reviewer | UI/contract evidence that product routes cannot mistake fixture fallback or partial backend reads for a loaded backend document. |
| Backend service readiness boundary review | `repo-backend` | Evidence Reviewer | A documented boundary that separates local dev server, file JSON storage, PDF export candidate routes, and production service readiness. |
