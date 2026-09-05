# FlowDoc Preview Confidence Probe

## Historical scope / corrected requirement — 2026-09-05

The probe below is historical, bounded inspection/PDF lifecycle context.
Use `flowdoc-preview-definition-correction-2026-09-05.md` for new Preview
acceptance: the user must edit permitted simulation values on the document
itself. Passing the older probe or PDF generation checks does not meet that
requirement. Historical results are preserved without product promotion.

## Authority Boundary

This document records PLAN acceptance of the no-edit `lane-preview-confidence-probe` handoff.

It is planning and evidence-review context for the next Preview validation lane. It does not prove Preview readiness, frontend readiness, WYSIWYG readiness, Publish readiness, Backend readiness, Core readiness, renderer readiness, PDF artifact readiness, production readiness, FlowDoc product truth, or map truth.

## Work Context

- Work path: `flowdoc-product-development-resumption > flowdoc-frontend-expert-roadmap > flowdoc-frontend-product-map > lane-preview-confidence-probe`
- Dispatch set ID: `dispatch-frontend-continuation-2026-09-03-01`
- Room run ID: `room-preview-confidence-probe-2026-09-03-01`
- Handoff ID: `handoff-preview-confidence-probe-2026-09-03-01`
- PLAN task/chat ID: `01a0637c-bc37-7cb1-8655-362695c4c6f7`
- WORK task/chat ID: `01a06786-7d05-7be3-b939-8ff6e7917e61`
- Owner repository: `repo-project-control` for the probe
- Product repositories: read-only for this probe
- Active role: `evidence-reviewer` with `planning-partner` responsibility
- Phase target: `phase-flowdoc-frontend-product-map-preview-confidence-probe-v1`
- Checklist target: `checklist-flowdoc-frontend-product-map-preview-confidence-probe-v1`
- Evidence target: `evidence-flowdoc-preview-confidence-probe-2026-09-03`

## Acceptance Decision

PASS / RISK / UNKNOWN: PLAN accepted the probe as a bounded no-edit finding set and next-lane recommendation.

The probe changed no files and no product behavior. It is accepted only as evidence that the PLAN room now has a clearer Preview validation scope. It is not accepted as product implementation or product readiness.

## Preview Vocabulary

Use these terms in the next lane until product evidence narrows them further:

- `Draft Preview`: Editor-visible rendering or inspection of the current Editor draft or working copy.
- `stale preview`: Preview output that no longer corresponds to the current Editor draft, Backend revision, or source document reference.
- `failed preview`: Preview request or rendering path that ends in an explicit error state.
- `unavailable preview`: Preview function not currently usable in the active screen or mode.
- `blocked preview`: Preview is intentionally stopped because required state, admission, permission, route, renderer, or artifact support is missing.
- `Published Preview`: Preview of a published or publish-bound document state.

These terms stay separate from WYSIWYG, Publish readiness, export parity, renderer parity, Backend persistence, and product readiness.

## Evidence Needed Before Preview Readiness

The next evidence-bearing lane should be `lane-preview-confidence-validation` with `parallelLimit: 1`.

The lane should start as evidence-review. Product edits should happen only if PLAN opens or approves a later owner-repository implementation lane.

Before any Preview readiness claim, evidence should include:

- Editor evidence for target switching, lifecycle labels, stale gating, retry/cancel/download gating, diagnostics, no WYSIWYG bypass, and browser checks.
- Backend evidence for draft and published context, admissions, PDF export request/status/cancel/download, auth, idempotency, revision pins, route mounting mode, and local-only versus production boundary.
- Core evidence for source document, draft snapshot, published structure, generation or admission contracts.
- Renderer and artifact evidence for execution, terminal status, artifact ID, operation or job ID, storage/download path, byte length, sha256, content type, and physical byte verification.

## Progressive Authoring Boundary

Progressive Authoring can proceed independently only when bounded to managed cards or text islands and when Preview is treated as unavailable or diagnostic-only.

If Progressive Authoring depends on Preview freshness, PDF artifact availability, or Published Preview parity, it should wait for accepted Preview validation evidence.

## Risks And Unknowns

- Preview is still overloaded as a product word and can be confused with WYSIWYG or Publish readiness.
- No dedicated accepted Preview Confidence validation evidence exists yet.
- Backend and Core Preview-related states remain bounded by local-only, contract-only, or production-false evidence unless a later lane proves more.
- End-to-end browser-to-backend Preview behavior has not been accepted.
- Renderer execution, PDF bytes, artifact persistence, download behavior, production route mounting, and Published Preview parity remain unknown.
