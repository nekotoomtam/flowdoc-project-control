# FlowDoc Make local package

## Authority Boundary

Owner: FlowDoc Project Control. Scope: this local authoring integration and its
installation; Core/Service release behavior remains owned by those repositories.
The current implementation record is
`docs/domains/flowdoc-template-authoring-tools-plan.md` in Project Control.
Copied references are generated, immutable inputs, not separately maintained truth.

Package **0.2.7** targets **Service0.4.8 / Core0.4.7 / models18,19 Stage3**; release identity requires its annotated component tag; installation is separate. Format sizing v2 is optional per definition; inspect
FORMAT_* warnings in status and saved-PDF responses and report partial output. Invoke
`$flowdocmake` (the plugin-qualified skill may appear as
`flowdocmake:flowdocmake`). It includes 12 existing authoring tools plus
`get_flowdocmake_context`, `upload_preview_image_file`, `run_candidate_preview`
and `manage_document_task` plus the three font tools and two opt-in height tools (25 tools total; including create_draft_section/import_draft_sections). There is no publish tool.

The exact new Core artifact and `formatSizing.version:2` are required; v1 or
unknown capabilities fail preflight. Fixed caps the current page remainder,
reserving that effective height; only zero space skips the whole frame.
Diagnostic envelopes remain version1. See the existing layout chapter as needed.

Delivery: Core source `8f8a739aea5597b6d8c9932c790f9bd716e8ebc7`, artifact SHA-256
`13673f22cca9667e88125dd4631b0b398c912b8e96c6734a2932b5ff27f3a8ad`. Service0.4.8 and this plugin pin that exact
artifact. Earlier candidate archives/packages remain immutable. Context returns
`groupLabelSpans` v1.
Definitions using groupLabel require its exact model/schema/suffix contract;
validate/save and candidate runs reject unsupported engines without stripping
fields. Existing definitions keep their path. See the existing repetition chapter.

Choose the requested endpoint before authoring: checked source data, reusable
structure with a sample, or full reconstruction. Extract source data separately,
then map observed layouts, design native structures and derive request data.
Use only stages needed for that endpoint and continue between them without
inventing approval stops. Package 0.1.7 changes guidance only; helper gates,
deadlines and Service/Core contracts are unchanged.
Package 0.2.0 adds active-font catalog, draft readiness and retained cloning; it keeps stage-based reading and classifies fixed-form limitations,
fallbacks and unfinished repairs in existing references; no extra startup reading.


Package 0.2.1 pins the Core 0.4.0 delivery artifact with updated package documentation
(SHA-256 `6e8b71976de35456eed8cdb88a3c42305947e20e900944e3108cb0cc5c36d7e8`).
Use the matched Service 0.4.0 image containing that exact artifact; package 0.2.0
continues to identify the prior artifact and is not silently overwritten.

## Local installation

Requires Node, a matching Service 0.4.8 checkout with built `dist` and dependencies,
the authenticated local Service container on its configured loopback port, Docker CLI, Poppler
`pdftoppm`, and Python with pypdf/Pillow. This candidate package is for that local
deployment, not a remote or public plugin distribution.

1. Build the documentation snapshot from committed canonical inputs with
   `node tools/build-flowdocmake.mjs` in Project Control. `snapshot.json` records
   the source commit and each copied file hash, using UTF-8 LF bytes across host platforms. Preserve the full relative tree.
2. Register this repository with `codex plugin marketplace add <repository-path>`;
   install with `codex plugin add flowdocmake@flowdoc-local`.
3. Create machine-local `~/.codex/flowdocmake.local.json` using these keys:
   `pluginRoot` (installed package directory returned by install), `serviceRoot`,
   `credentialFile` (existing protected env file containing AUTHORING_TOKEN),
   `url`, `container`, `python`, and `previewDirectory` (absolute local paths).
   Do not put credentials in this package or source control. Preserve an existing
   configuration rather than silently replacing it. Node must be on the host PATH.
4. Run `node tools/check-flowdocmake.mjs` to check the actual manifest launcher,
   tools, authenticated contract, documentation hashes, runtime and PDF reader.
5. Open a fresh chat and verify `get_flowdocmake_context` is actually available.
   If the app retains an old tool catalog, reload the desktop app before retesting.
   Installed/enabled CLI state alone is not proof of chat discovery. Do not start
   authoring while context is missing or `ready` is false.

The context tool uses read-only Docker inspection to associate the loopback port
with its running image ID and Service/Core package versions. HTTP font capability and the pinned Core artifact must match; Docker inspection
supplies the runtime identity; remote runtime identity remains unsupported.
It does not change or reissue the released 0.3.0 packages.

## Verification and limits

For reference reconstruction, first render the source using
`scripts/reference_inventory.py` and complete source/part coverage before reading
an old template. `scripts/reference-coverage.mjs` validates the source and
delivery evidence records; its checks establish declared coverage and identity,
not visual correctness. See the packaged `reference-coverage.md` chapter.

`node --test tests/flowdocmake.test.mjs tests/flowdocmake-integration.test.mjs`
checks compatibility and negative preflights without draft mutation.
`tools/trial-flowdocmake.mjs` is an explicitly mutating, checkpointed local trial;
do not run it as a connection check. It creates named draft-only test identities,
checks idempotent retries and saves PDFs. Private full-fixture files stay outside
the package. `tools/check-flowdocmake-pdf.py` compares all 98 pages against the
release fixture and creates review sheets.

Service's existing image preparation can resample images and slightly alter
their dimensions compared with direct-Core rendering. This package preserves
uploaded original bytes but does not promise pixel-identical output between
those two paths. Model persistence and complete visual fidelity require actual
per-document review, not merely a successful preflight.

## Streamed document tasks

The two opt-in tools are `generate_document_task` and `inspect_document_task`.
Set taskCredentialFile in this candidate's local config to a private text file
containing `TASK_TOKEN=<explicit-task-credential>`. It is separate from authoring
configuration; absence never falls back to the authoring token. No installation
or current user config changes are performed by candidate verification.

Generation takes docKey, absolute payloadPath/outputPath and optional images array
of `{pointer,path,type?}`. The payload keeps Section assets/assetKey; file pointers
name image source objects in the original JSON. Both payload and images are read
incrementally. Exact old/new task capability and package identities are required
before upload. Existing authoring/preview calls keep their original contracts.

The development client opts into `queue-v1` when the authenticated Service
advertises that capability. It uploads the whole body while reading early feedback;
Services without that capability retain the existing task path. This source update
does not reissue the tagged plugin or change its installed copy.
This export tool uses an already authorized registered template; it does not publish
or convert an unpublished draft. Draft preview remains the bounded legacy path.

Feedback becomes MCP progress notifications when requested and a bounded warning
summary in the result. A PDF is published to a new local path only after complete
framing, length and hash checks. The result says response-complete, while the final
server receipt remains unconfirmed until an optional exact-task lookup. Local save
failure cancels reading; do not automatically retry a generation call.
