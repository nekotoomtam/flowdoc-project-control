# FlowDoc model20 candidate authoring

## Authority Boundary

Owner: FlowDoc Project Control. This guide is for the private model20 candidate
only: Core0.6.0 / Service0.6.0 / schema029 and its exact reviewed archive.
It does not describe the currently installed package or authorize publication,
installation, real-data access or a release. Core owns validation/rendering and
Service owns persistence/admission. Runtime discovery and verified output take
precedence over prose. The old prepared18/19 guide sources remain historical
inputs; they are not shipped as model20 examples in this candidate.

This candidate accepts nodeModelVersion20 only, with font schema1/2 and draft
definition.version1. Migration029 is mandatory. The reviewed Core SHA256 is
`145af7ff91416094e35ff9d283e350e6f86f7f7e2bb1707783591c877185e3fb`.
The installed267-file Core tree must also match its reviewed identity. Matching
version strings or a vendor archive alone is insufficient. This is a private
candidate; full integration, native wiring and whole-suite acceptance are separate.

- Start with [workflow](workflow-start.md), then [structure/data](structure-and-data.md).
- Read [API](api.md) before a mutation, [layout](layout.md), [nodes](nodes.md) and
  [contents/repetition](contents-and-repetition.md) only for the current task.
- Use [examples](examples.md) and [verification limits](verification.md).

Definitions are reusable Section designs, not execution occurrences or pages.
The request supplies an ordered array with sectionKey and unique instanceKey.
Actual request order owns output order, including A-B-A. There is no model18 map,
model19 id-array decoder, granular Section create/import or server clone route.
Save complete definitions under server-created identities. JSON copying cannot
grant another draft's retained font rights.

Use get_flowdocmake_context ready:true, the live /authoring/contract and tool
schemas before authoring. Save success is separate from font readiness, layout,
delivery and visual acceptance. PDF-only MCP tasks remain PDF-only; DOCX uses
the separate Service API and must never enter a PDF-only parser.
