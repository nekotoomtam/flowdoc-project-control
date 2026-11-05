# Model20 candidate API and tools

## Authority Boundary

Owner: FlowDoc Project Control. This guide is for the private model20 candidate
only: Core0.6.0 / Service0.6.0 / schema029 and its exact reviewed archive.
It does not describe the currently installed package or authorize publication,
installation, real-data access or a release. Core owns validation/rendering and
Service owns persistence/admission. Runtime discovery and verified output take
precedence over prose. The old prepared18/19 guide sources remain historical
inputs; they are not shipped as model20 examples in this candidate.

## Authoring preflight

Read authenticated /authoring/contract and get_flowdocmake_context. Require
nodeModelVersions:[20], sectionDefinitions.model20, array-by-section-key input,
required-unique-per-request instanceKey, request assembly, reuseDefinitions:true
and whole-definition authoring. createSection/importSections/cloneTemplate are
false and sectionInstances is absent. Font sizing/group labels advertise20.

create_template_draft creates templateId/docKey/revision0 without a definition.
update_template_draft saves a complete model20 definition with expectedRevision
and an idempotencyKey. definition.version stays1; revision is independent.
get_template_draft reads the owned revision. validate_template does not save;
preview_template_draft pins an exact saved revision and queues layout. Inspect
get_preview_status and save_preview_pdf. No publish tool or route is added.
The removed /clone, /sections and /sections/import routes return404; there is
no implicit conversion or substitute granular mutation. Use whole definitions.

Do not retry ambiguous task POSTs automatically. Successful authoring receipts
replay only identical payloads; a stale/conflicting revision needs a fresh read.
Cancellation/timeout is not evidence that no work happened. A preview snapshot
and its repeatable download remain separate from later edits and output TTL.

## Fonts, inputs and resources

get_font_catalog lists active exact release/weight/style faces. Unselected
schema2 styles may be saved but do not imply readiness. get_draft_font_readiness
binds expectedRevision and optional actual sampleRequest. Read ready/blocked/
incomplete, checkedScope, issues and remedies. Copied JSON/new identities cannot
inherit retired-font tuples; valid retention belongs to the same owned draft.
Font administration uses separate credentials. Height proposals remain opt-in:
propose_font_height_adjustment then confirm_font_height_adjustment; layout is
not checked by a successful metric adjustment. A normal font change keeps pt.

Upload preview images serially, finalize the owned upload, then use its IDs in
the sample. Direct task multipart pointers use actual occurrence indexes, e.g.
/sections/0/assets/0/image. Preserve escaped JSON pointers and instance ownership.
Unbound/missing resources can create partial completeness findings; never erase
their rows or claim full delivery from status alone.

## Direct Service PDF/DOCX versus PDF MCP tasks

/documents accepts the selected authorized docKey, multipart input and separate
task credential. Output-Format:PDF or DOCX selects the Service writer. Parse
feedback and artifact headers/length/checksum and validate actual file bytes;
HTTP200 alone is not success. DOCX returns buffered artifact bytes and no PDF
page count. These MCP task tools remain PDF-only; they have no outputFormat
argument and must reject DOCX/invalid PDF, not relabel or fall back silently.

Permanent task outcome, delivery evidence and DB finalization are separate.
Inspect exact owned task/findings; a failed DB finalization may follow completed
delivery. Never automatically resend a file whose delivery cannot be established.

## Format sizing and names

formatSizing v2 applies to20 with font schema1/2. Fixed height reserves the
effective remainder, warns on omitted content/frames, and is not a guarantee of
complete text. Read FORMAT_* diagnostics even when a PDF exists. Group labels
require groupLabelSpans v1 and the declared continuation suffix; preserve fields
on capability refusal. defaultFileName is template metadata; direct /documents
fileName is an override; a client's local outputPath is separate. Keep original
source text, file names, resource rights and the unchanged expansion/XML caps.
