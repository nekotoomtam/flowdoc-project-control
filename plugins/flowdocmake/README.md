# FlowDoc Make local package

## Authority Boundary

Owner: FlowDoc Project Control. Scope: this local authoring integration and its
installation; Core/Service release behavior remains owned by those repositories.
The current implementation record is
`docs/domains/flowdoc-template-authoring-tools-plan.md` in Project Control.
Copied references are generated, immutable inputs, not separately maintained truth.

Package **0.2.0** targets **Service/Core 0.4.0 / Area18**. Invoke
`$flowdocmake` (the plugin-qualified skill may appear as
`flowdocmake:flowdocmake`). It includes 12 existing authoring tools plus
`get_flowdocmake_context`, `upload_preview_image_file`, `run_candidate_preview`
and `manage_document_task` (16 tools). There is no publish tool.

Choose the requested endpoint before authoring: checked source data, reusable
structure with a sample, or full reconstruction. Extract source data separately,
then map observed layouts, design native structures and derive request data.
Use only stages needed for that endpoint and continue between them without
inventing approval stops. Package 0.1.7 changes guidance only; helper gates,
deadlines and Service/Core contracts are unchanged.
Package 0.2.0 adds active-font catalog, draft readiness and retained cloning; it keeps stage-based reading and classifies fixed-form limitations,
fallbacks and unfinished repairs in existing references; no extra startup reading.

## Local installation

Requires Node, an installed Service 0.4.0 checkout with built `dist` and dependencies,
the authenticated local Service container on its configured loopback port, Docker CLI, Poppler
`pdftoppm`, and Python with pypdf/Pillow. This first package is for that local
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
