# Core Render API Contract Boundary - 2026-09-01

This record preserves the retained value and authority boundary for six Core
Render API contract and upstream sequencing documents before they are demoted
into explicit Core-local implementation context.

The boundary belongs to `flowdoc-product-development-resumption >
flowdoc-documentation-authority-cleanup` and follows the Core Markdown
classification recorded in
`docs/domains/core-repository-markdown-classification-2026-09-01.md`.

## Authority Boundary

Owner repository: Project Control for this cleanup record, with source
material owned by Core.

Scope: Core Render API contract docs boundary for
`docs/TEMPLATE_VARIABLE_RENDER_API_PLANNING_GATE.md`,
`docs/RENDER_API_REQUEST_ENVELOPE_CONTRACT_GATE.md`,
`docs/RENDER_READINESS_VALIDATION_POLICY_GATE.md`,
`docs/ARTIFACT_POINTER_JOB_STATUS_PLACEHOLDER_POLICY_GATE.md`,
`docs/RENDER_API_ERROR_BLOCKER_VOCABULARY_GATE.md`, and
`docs/RENDER_API_CONTRACT_CLOSE_AUDIT.md`.

This record does not make those Core Render API contract docs active
FlowDoc-wide status, roadmap, risk, unknown, Phase, Checklist, or Evidence
authority. It does not promote Core, Backend, Editor, compatibility, frontend
readiness, FlowDoc product truth, or map truth.

## Source Snapshot

Source Core commit:
`360ea384ba609dcceab502a5ea1ef55daf2b151a`.

Source files:

- `docs/TEMPLATE_VARIABLE_RENDER_API_PLANNING_GATE.md`
- `docs/RENDER_API_REQUEST_ENVELOPE_CONTRACT_GATE.md`
- `docs/RENDER_READINESS_VALIDATION_POLICY_GATE.md`
- `docs/ARTIFACT_POINTER_JOB_STATUS_PLACEHOLDER_POLICY_GATE.md`
- `docs/RENDER_API_ERROR_BLOCKER_VOCABULARY_GATE.md`
- `docs/RENDER_API_CONTRACT_CLOSE_AUDIT.md`

These files survive cleanup as Core-local implementation context because Core
tests and README references still use them as planning, metadata-contract,
readiness-policy, placeholder-policy, vocabulary, and close-audit anchors.

## Retained Value

| Source | Retained value |
|---|---|
| Template Publish / Variable Schema / Render API Planning Gate | Preserves the sequencing rule that Template Publish / Version Boundary comes before Variable Schema / Data Contract and Render API Contract work, while measurement remains mini-checkpoint-only. |
| Render API Request Envelope Contract Gate | Preserves JSON-safe request envelope metadata, variable payload container rules, candidate variable ids, correlation/idempotency policy names, and malformed-envelope blockers without implementing runtime validation. |
| Render-Readiness Validation Policy Gate | Preserves metadata-only readiness status vocabulary, required evidence checks, deferred runtime checks, blocker and warning vocabulary, and routing toward artifact/job placeholder policy. |
| Artifact Pointer / Job Status Placeholder Policy Gate | Preserves placeholder vocabulary for job status and artifact pointers, null/unproduced artifact facts, lifecycle deferrals, and blockers that should route future work to dedicated production gates. |
| Render API Error / Blocker Vocabulary Gate | Preserves JSON-safe boundary-grouped blocker/warning vocabulary across request, response, readiness, placeholder, and deferred production boundaries without implementing runtime error handling. |
| Render API Contract Close Audit | Preserves the close decision that the Render API Contract mini lane is closed only for mini infrastructure checkpoint scope and does not claim production Render API readiness. |

## Disposition

The six Core files should remain in Core for now, but they must carry an
Authority Boundary explaining that:

- Core owns the local implementation context.
- Project Control owns FlowDoc-wide Work, Phase, Checklist, Evidence, Risk,
  Unknown, Roadmap, and cleanup state.
- The Core files are not the canonical source for cross-repository status,
  release readiness, runtime readiness, or map truth.

Later cleanup may retire these files only after replacement Core-owned
contracts, tests, or Project Control synthesis preserve the retained value
above.

## Verification Target

The cleanup lane should add Core guards that require Authority Boundary wording
in each surviving Render API contract document and then record evidence after
Core verification passes.

This record preserves cleanup rationale only. It does not edit Core runtime
behavior by itself and does not promote Core, Backend, Editor, compatibility,
frontend readiness, FlowDoc product truth, or map truth.
