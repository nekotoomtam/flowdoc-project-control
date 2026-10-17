# FlowDoc Export MVP R2-A Runtime Prerequisite Plan

> **For agentic workers:** Use `superpowers:executing-plans` for the proposed
> inline execution after owner review. No separate WORK room or subagent is
> dispatched by this document. Steps use checkboxes to record actual results.

## Authority Boundary

Owner: Project Control. Role: Planning Partner / Documentation Synthesizer.
Authority: owner's request to continue toward starting the MVP, 2026-10-07.
Status: owner authorized inline execution on 2026-10-07. Runtime discovery
Tasks 1–3 passed after restart and bounded Docker socket recovery. Task 4
records the result. The owner subsequently authorized P1–P3 inline implementation;
that package/resource foundation passed as recorded below. The public PDF engine
and remaining R2 work are still open.
Registered execution IDs: not applicable. Work Size: small; Risk Tier: routine.
Work authority for this first slice: discovery. The old Core is read-only input.
No product-repo scaffolding, migration or map/Evidence promotion is authorized
by a passing runtime probe alone.

**Goal:** Establish whether the existing text/PDF primitives and Sarabun run in
an isolated Linux/amd64 environment before committing the new package layout.

**Architecture:** Build and run a disposable probe from a bounded copy of the
existing implementation. Record runtime dependencies and exact image identity.
Use its results to finalize the Core package implementation plan; do not
silently turn the probe into the new product or claim that a probe is a package.

**Tech Stack:** Docker Linux/amd64, Node/TypeScript, Rustybuzz 0.20.1,
ICU4X segmenter 2.2.0, Python/fontTools, existing measured PDF renderer, Sarabun.

**Spec:** [R1 sections 8.1–8.4](flowdoc-export-mvp-r1-design-2026-10-07.md)
and [locked MVP](flowdoc-export-mvp-v1-2026-10-07.md).

## Global constraints

- First runtime target: Linux/amd64 with glibc, not Windows-native or musl/ARM.
- Sarabun Regular/Bold/Italic/BoldItalic and OFL.txt are the font input.
- Existing product repositories and their fixtures remain unchanged.
- Probe writes go to a fresh task-specific scratch directory outside repositories;
  final PDF/result may be copied to a new named output directory without overwrite.
- Containers receive files through a declared build context, not host runtime,
  Downloads or source directory mounts. No Windows executable is an input.
- No network activity during generation; build-time dependency retrieval is allowed.
- No public publish, registry setup, CI, API, PostgreSQL installation or deployment
  in this first slice. PostgreSQL readiness is handled in R3, not bundled into R2.
- Reuse passing results unless the input, build context or environment changes.
- Completion is runtime discovery, not R2/MVP acceptance or an elapsed-time promise.

## Review focus

1. Hidden host dependency: runtime must succeed with declared image files only.
2. Wrong architecture/missing shared library: detect before rendering.
3. Font mapping/subset mismatch: preserve measured glyph IDs and original TTF bytes.
4. Missing resource: fail explicitly instead of substituting another font/tool.
5. Output correctness: visual Thai marks, complete extracted text and embedded fonts.

## Task 1 — Establish Docker access and bounded inputs

**Files:** Create scratch `inputs.json` and `runtime-versions.json`; no repo edits.

**Inputs:** old Core source at the inspected commit, four Sarabun files, R1 design.
**Outputs:** actual source commit/hashes, Linux engine readiness, pinned candidate
runtime versions and image digests used by Task 2.

- [x] Read owner Core AGENTS.md and confirm current commit/status before copying.
      Preserve existing changes; record them rather than assuming old HEAD is current.
- [x] Inspect Docker context and engine with `docker version` / `docker info`.
      If Docker Desktop is stopped, start the existing application without installing
      a replacement. If a Windows prompt, WSL setup or restart is required, report
      the exact prerequisite and ask the owner for that action; do not reset Docker.
- [ ] Confirm engine supports Linux/amd64 and there is room for a bounded build.
      If unavailable, stop this slice as BLOCKER; Windows success is not substitute proof.
- [ ] Record exact available source/tool candidates. Existing Windows probe used
      Node 24.15.0, Rust 1.96.0, Python 3.10.11 and fontTools 4.58.2; these are inputs
      for compatibility evaluation, not a claim that corresponding Linux images exist.
      Resolve supported glibc image tags to digests before building. Preserve Cargo.lock
      and Node lockfile from the bounded source input; do not update to latest.
- [ ] Inventory native binary source files, renderer and only the contract/types
      needed to invoke it. Include source license notices. Exclude editor, UAT-specific
      lifecycle, old PDFs, node_modules, target outputs and credentials from build context.
      Record required dependency closure in inputs.json; if it expands into product
      architecture, report the finding before copying additional subsystems.

**Check:** every input is traceable to a path/hash, and no product file changed.

## Task 2 — Build native tools and prove resources in Linux

**Files:** scratch `Dockerfile`, `runtimeProbe.mjs`, `fontSubset.py`,
`runtime-versions.json`; native source copy under scratch `native/`.

**Consumes:** pinned inputs and engine from Task 1.
**Produces:** one identified runtime probe image and `runtime-result.json`.

- [ ] Define `runtimeProbe.mjs` checks for executable platform, source font hashes,
      successful shaping of all four styles, no glyph ID 0 for the sample, and
      segmentation offsets aligned to UTF-8 scalar boundaries.
- [ ] Build Rust shaper/segmenter from copied source in a Linux builder with
      `cargo build --locked --release` for the declared binary targets only.
      Copy resulting binaries and required shared libraries into runtime stage;
      no Cargo/compiler in final runtime stage.
- [ ] Prepare Python/fontTools from pinned requirements. Adapt only scratch helper
      path handling where the old script assumes repository-relative fonts.
      Keep subset algorithm and retain_gids behavior; log every adaptation.
- [ ] Run the image as a non-root user with writable scratch output/temp locations.
      Check linked libraries and execute each tool, not merely its presence.
- [ ] Run with `--network none` and no bind mounts. Write results inside the test
      container and retrieve with `docker cp`; retain the image ID for Task 3.
- [ ] Negative probe in disposable copies: missing font and missing executable each
      yield a resource error identifying the missing ID; no fallback or PDF success.

**Check:** four styles shape with no missing glyphs, resources match hashes,
native executables run on the target and explicit missing-resource cases fail.

## Task 3 — Render and inspect Sarabun PDF with the existing renderer

**Files:** scratch `renderProbe.mjs`, `request.json`, `expected-text.json`,
`probe.pdf`, `result.json`; temporary rendered page images and extracted text.

**Consumes:** same runtime image and measured glyph/segmentation results from Task 2.
**Produces:** one-page four-style PDF and bounded correctness result.

- [ ] Create fresh measured draw facts using Sarabun, not the IBM Plex fixture's
      saved glyph positions. Use 18 pt sample headings, 14 pt body, 25 pt body
      baseline spacing and A4 portrait for comparison with the accepted Windows probe.
- [ ] Generate subsets from glyph IDs for each font and invoke the existing
      local-measured-document renderer. The probe may use an isolated build/loader
      to invoke the source; explicitly record this and do not call it package proof.
- [ ] Verify source TTF hashes unchanged and no font substitution/missing glyphs.
      Record image ID, input hashes, tool versions, output checksum and page count.
- [ ] Inspect PDF fonts and text using `pdffonts` and `pdftotext`; require four
      embedded subset fonts with Unicode mapping and exact expected text after
      ignoring layout whitespace only. Do not normalize away missing Thai marks.
- [ ] Render with `pdftoppm` and inspect the page: readable four styles, no clipping,
      overlapping lines, displaced Thai marks or missing characters. Retrieval and
      inspection on the host are allowed; generation must have happened in Linux.
- [ ] Compare candidate repository status with Task 1; account for all scratch
      outputs and remove only containers created by this probe if safe. Do not prune
      other images/volumes or delete original fonts/PDFs.

**Check:** PASS only for this Linux runtime sample when all above results pass.
Failure is a finding with the failing layer identified, not license to replace engines.

## Task 4 — Close discovery and prepare the actual package work

- [ ] Return PASS / FAIL / BLOCKER with exact inputs, output location, checks and
      limitations. Update the existing R1 plan context narrowly after appropriate
      documentation checks; do not mark any MVP checkbox complete from this probe.
- [ ] If runtime passes, write the next bounded Core implementation plan: public
      result/resource contracts, package bootstrap, runtime adapter, generic PDF path,
      and a consumer test that installs the produced tarball. That test must not use
      the probe's source loader or old repo. Then plan binding/layout/table work from
      the R1 contract, using fixtures already specified there.
- [ ] If runtime fails, identify the smallest dependency/path/ABI correction and
      obtain the necessary scope decision before product implementation. Do not
      scaffold the full MVP while a runtime architecture decision remains open.

## Proof and document budgets

One Docker readiness inspection, one candidate runtime build with bounded fixes
justified by failures, one four-style PDF, two missing-resource negatives, and
one visual/text inspection of the final output. No full old-repo test suite or
load benchmark. New document budget: this plan; R1 links to it rather than
duplicating tasks. Proof records are scratch JSON/output, not new Work registries.

The runtime/PDF success from Windows is reusable background only. Database
readiness remains unresolved until R3. A one-day MVP is the owner's planning
target, not an acceptance waiver or a completion estimate established by this plan.

## Execution checkpoint — 2026-10-07

Historical checkpoint; superseded by the successful resumed run below.

- Core input: `fa76c74356e5cfc9296f6a86c0bfac690e8416f6`, clean working tree;
  source inspected only, no copy or modification made. About 195 GB free on C:.
- Docker client 28.1.1, Windows/amd64, context `desktop-linux`. Initial engine
  connection failed because the named pipe was unavailable. Started the existing
  Docker Desktop application; no installer, reset or feature change was run.
- BLOCKER: Docker Desktop backend reported `Virtual Machine Platform not enabled`
  at 2026-10-07T12:51:49Z in
  `C:/Users/nekot/AppData/Local/Docker/log/host/com.docker.backend.exe.log`.
  Its error dialog requires enabling the Windows optional feature with administrator
  rights and restarting the computer before Docker Desktop can start.
- Interrupted the pending read-only engine status command after identifying the
  blocker. No image build, container, volume, PostgreSQL or Linux PDF was created.
- Resume: owner enables VirtualMachinePlatform and restarts at a suitable time;
  reopen Docker Desktop, verify engine and Linux/amd64, then continue Task 1.
  Do not treat startup of the desktop UI as proof the Linux engine is healthy.
  [Microsoft prerequisite instructions](https://learn.microsoft.com/en-us/windows/wsl/install-manual#step-3---enable-virtual-machine-feature)
  describe the feature enablement and restart. No Windows restart is initiated by this task.

## Resumed result — 2026-10-07

PASS for the bounded Linux runtime probe, not Core package/R2/MVP acceptance.
Task checkboxes above preserve the pre-execution plan; the following result is
the task-level completion record. No product or map state is promoted.

- Task 1: host reboot observed at 20:38:42 local time; WSL 2 responded. Docker
  then crashed on inaccessible temporary `dockerInference` socket. After normal
  stop failed, stopped only this attempt's Docker processes and renamed the
  two-socket directory to
  `C:/Users/nekot/AppData/Local/Docker/run-before-flowdoc-20261007-2045`.
  Backup retained; no factory reset, images, volumes or Docker settings changed.
  Restarted Desktop; engine confirmed `linux/x86_64`, server 28.1.1.
- Task 2: built native tools from unchanged Core source and Cargo.lock; retained
  source commit `fa76c74356e5cfc9296f6a86c0bfac690e8416f6`. Core working tree remained
  clean. Scratch build context was about 489 KB, excluding node_modules/target/editor.
- Exact tested runtime: Node 24.21.0, Python 3.11.17, fontTools 4.58.2,
  rustc 1.99.0; Rustybuzz 0.20.1 and ICU segmenter/data 2.2.0 via original lock.
  Base images pinned to digests in archived Dockerfile; these are tested candidates,
  not a promise to support every release of these version families.
- Ruling: retained only Zod's existing 4.4.3 resolved URL/integrity in a minimal
  scratch npm lock, rather than install the old application's entire dependency
  tree. Original lock untouched. Three TypeScript source modules were invoked via
  Node type stripping, not the old index barrel/Vite or a new Core package.
- Scratch-only adaptations: relative contract import, subset helper path metadata,
  Linux executable paths and explicit missing-executable diagnostics. Added scalar
  boundary assertions before final build. No text/PDF algorithm repair was needed.
- Task 3: final image
  `sha256:0097d4d06a86291ee97ea5fa15f7e101d810d5c851aad8a939b64ca8c7320e36`
  generated one A4 page, 20 glyph runs, 983 glyphs, 4 embedded subset fonts,
  143987 bytes. Ran as `10001:10001`, network `none`, mounts `[]`, exit 0.
- Positive: extracted text matches all 20 lines ignoring layout whitespace;
  visual inspection found no clipping/overlap/displaced Thai marks. Final PDF
  hash equals the visually inspected output:
  `c01bceb9ce706bdb0817d81843c6de885c24648dd556a9a84168329943316f01`.
  Source font/license hashes remained unchanged. No generic layout/table claim.
- Negative copies: missing Regular font fails ENOENT naming its path; missing
  shaper fails RESOURCE_UNAVAILABLE naming executable. Both exit 2, no PDF success.
  These are probe diagnostics; public product error normalization is still future work.
- Artifacts: `C:/Users/nekot/Downloads/flowdoc-linux-runtime-2026-10-07/`
  contains PDF, checks.json, inputs.json, result.json and disposable-probe-source.zip.
  Source archive makes the declared build inputs retrievable beyond temporary storage.
- Scratch: `C:/Users/nekot/AppData/Local/Temp/flowdoc-linux-5b12c7cc7e484287a2f6000eea37515d`.
  Images retained for reuse; only named completed probe containers may be removed.
- Task 4: proceed to the package-foundation implementation slice below. API/DB,
  generic binding/layout/table export and isolated full Service acceptance remain open.

## Next implementation slice — Core package and resource boundary

Authorized inline by the owner's request to continue on 2026-10-07; P1–P3
implemented and verified below. Owner repository: `flowdoc-core`; Core owner
AGENTS.md must be read or established from Project Control before writing product
code in the currently empty repository. No edits to old Core or Service in this slice.
Use inline work and an isolated checkout if concurrent work exists. Do not create
separate execution rooms or registry records merely for this package foundation.

### P1 — Package skeleton and shared result contract

Files to create: `package.json`, `package-lock.json`, `tsconfig.json`, `.gitignore`,
`src/index.ts`, `src/result.ts`, `tests/packageContract.test.ts`,
`scripts/checkPackedConsumer.mjs`. Package: `@flowdoc/core@0.1.0-dev.1`, ESM.

- [ ] Define `Issue = {code: string; path: string; message: string}` and
  `Result<T> = {ok:true; value:T; warnings:Issue[]} | {ok:false; issues:Issue[]; warnings:Issue[]}`.
  This is the base envelope; later binding tasks add the R1 source context fields.
- [ ] Write failing package consumer checks: root import/type declarations exist,
  unlisted internal subpaths cannot be imported, and packed files exclude source,
  tests, secrets and editor artifacts. Do not assert the complete PDF API exists yet.
- [ ] Implement build/exports/files boundaries and runnable `npm run build`,
  `npm test`, `npm run check:package` commands. Pin exact tool versions in the
  initial lock after checking Node 24.21.0 compatibility; no unbounded latest.
- [ ] Run the focused checks, review packaged contents and commit passing foundation.

### P2 — Bundled resources and native runtime build

Files to create: `src/runtime/exportResources.ts`, `src/runtime/loadBundledResources.ts`,
`runtime/python/fontSubset.py`, `runtime/requirements.txt`, `assets/fonts/*`,
`scripts/buildNative.mjs`, `scripts/buildResourceManifest.mjs`,
`tests/resources.test.ts`, plus minimal native crate source/Cargo.lock and
`Dockerfile.package` for Linux build. Native output goes to `runtime/linux-x64/`.

- [ ] Define `loadBundledResources({pythonExecutable,tempRoot}): Promise<Result<ExportResources>>`;
  ExportResources contains explicit shaper/segmenter/helper paths, tempRoot and
  the four font IDs/paths/hashes. Resolve bundled paths relative to the installed
  module location, not process.cwd() or a caller repository.
- [ ] Write failing tests for missing font/executable, hash mismatch, wrong platform,
  unavailable Python/fontTools and an unwritable temp location. Assert stable
  RESOURCE_UNAVAILABLE issues; no silent fallback or source-font modification.
- [ ] Reuse only the now-proven native source/subset helper and Sarabun licenses;
  build under the tested glibc target and generate a deterministic resource manifest.
  Preserve Cargo.lock. Do not put a compiler or download/build postinstall in package.
- [ ] Test successful resolution from a different cwd and failure cases in disposable
  package copies; check resources match generated hashes, then commit.

### P3 — Install the actual tarball in an isolated consumer

Files to create: `tests/consumer/package.json`, `tests/consumer/package-lock.json`,
`tests/consumer/checkResources.mjs`, `Dockerfile.consumer`; extend P1 package script.

- [ ] Pack once from the passing Linux build. Stage that exact tarball and checksum
  into the consumer build context and install using its recorded lock/integrity.
- [ ] Consumer receives no Core source checkout. Import the root package, load all
  resources, and execute bundled shaper/segmenter on Thai text using an explicitly
  provided Python runtime. Run without network, mounts or root privileges.
- [ ] Require no missing glyphs, UTF-8-aligned break offsets, correct font hashes,
  stable resource errors and no source-file mutation; retain tarball/version/checks.
- [ ] Stop this slice when package/resource criteria pass; record it as foundation
  only. This slice deliberately does not satisfy the R1 public PDF engine gate.

Next slice after P3: first close R1 section 8.4's public PDF engine prerequisite
using resolved TextBlocks as specified in P4 below, then implement
validate/prepare/compose and table fixtures. The earlier summary grouped those
steps too broadly; it did not waive the PDF package prerequisite. No fake
generatePdf stub or extra public low-level renderer API is introduced merely to
claim the package gate passed.

### P1–P3 result — 2026-10-07

PASS for package/resource foundation only. This result closes P1–P3 criteria
above, not the public PDF engine, R2 as a whole, or the MVP.

- Core commit: `9256ab695ec067ee070cb7898d6ffa2de3b1ae14` on
  `codex/core-package-foundation`; original empty checkout used because there was
  no concurrent work. No merge/push, old Core changes or Service changes.
- P1: root ESM resource API and Result/Issue contracts, declarations, locked build
  dependencies, explicit package file list and private subpath restrictions.
  No PDF stub, install hooks, editor or database dependency. README/AGENTS describe
  only repo-owned boundaries. Declaration presence checked, not standalone consumer
  TypeScript compilation.
- P2: bundled Sarabun four styles/OFL, locked native source and portable Python
  helper. Installed-module-relative paths, SHA-256 resource checks, actual native
  and Python probes, writable-temp validation and structured RESOURCE_UNAVAILABLE.
  Subsetting selects glyphs per font and rejects identical input/output paths.
- P3: `npm run check:package` completed with exit 0. Linux build/type-check and
  15 focused tests passed. Installed the actual tarball using a generated exact
  integrity lock; consumer executed as 10001:10001, network none, no mounts.
  Node 24.21.0, Python 3.11.17/fontTools 4.58.2, pinned Bookworm image digests.
- Consumer proof: root import, internal import rejection, declaration presence,
  excluded source/tests/native source/node_modules/secrets, different cwd, four
  font shaping/subsetting, valid UTF-8 boundaries, unchanged source fonts,
  missing font/executable/Python, changed hash, unwritable temp and cleanup.
  Tarball inventory inspected: 24 intended files, about 1.3 MB compressed.
- Artifact directory:
  `C:/Users/nekot/Documents/GitHub/flowdoc-core/artifacts/1791381845724/`.
  Contains `flowdoc-core-0.1.0-dev.1.tgz`, `consumer-package-lock.json`, `result.json`.
  Tarball SHA-256:
  `c12ed3d13787c84f5e590be90c21c8688eb5c5735d4c632ddb2e40f9809be4e6`.
  Consumer image:
  `sha256:1d286595ef5f68495171168cfcdfd032e09f22f9c760e616713804c930b8c2b1`.
- Ruling: consumer lock is generated beside the specific tarball, not committed
  under tests/consumer, because its integrity binds the produced artifact. Build
  and consumer scripts are committed; generated artifacts remain ignored locally.
- Read-only code review found no critical/important issues. Staged whitespace
  check passed excluding untouched upstream OFL.txt's original trailing space;
  license bytes retained. Added Git attributes to preserve font/license bytes and
  source LF endings; this metadata is not packaged and does not invalidate the
  passing artifact/runtime proof. No additional runtime change after verification.
- No shared map or MVP checkbox promoted. HTTP/DB, binding/layout/table behavior,
  public PdfEngine export, complete document generation and full Service Docker
  acceptance remain future slices. Stop this foundation at its passing boundary.

## P4 — Public PDF engine implementation plan

> For agentic workers: use `superpowers:executing-plans` for inline execution
> after written-plan review. Owner approved this plan with "ok โคตามนี่เลยนะ";
> execution and final evidence are recorded below.

**Goal:** An installed Core tarball generates a PDF from resolved TextBlocks
through `createPdfEngine(...).generatePdf(...)`, without source-repo access.

**Architecture:** Preserve the graph-based R1 boundary. Build a small text-only
resolved document fixture directly for this prerequisite; later composeDocument
will produce that same graph. Native adapters measure and break text, a private
layout produces draw commands, and extracted PDF primitives emit bytes. Do not
make callers construct glyph runs or reuse the old probe's fixed draw commands.

**Spec:** R1 sections 3, 6, 7 and 8.1–8.4; the locked MVP remains unchanged.
**Stack:** Existing pinned Node/TypeScript, Rustybuzz/ICU, Python/fontTools and
Sarabun resources. Reuse the existing PDF writer, not jsPDF or a new PDF library.

### Scope, authority and acceptance

- Owner: flowdoc-core. Planning Partner prepares this plan; Product Implementation
  Agent implements only after review. Medium work size, routine risk. Work/Phase/
  Checklist/registered execution IDs are not applicable to this inline slice.
- Base: Core `9256ab695ec067ee070cb7898d6ffa2de3b1ae14`. Inspect current status before
  execution and isolate if concurrent work appears. Old Core stays read-only.
- Allowed: Core composition types, runtime adapters, text layout, PDF writer,
  tests/fixtures, package metadata and consumer scripts; this PC plan for status.
- Forbidden: Service/DB/API/frontend, actual template/data binding, table layout,
  DOCX/images, queue/load work, public publishing or copying the old app wholesale.
- P4 accepts real PDF bytes from the public package, four embedded Sarabun styles,
  correct Thai text extraction and visual appearance, generic text flow over a
  page boundary, structured failure and cleanup. Table support remains mandatory
  for the eventual MVP, but unsupported table input must fail explicitly in P4.
- Reuse P1–P3 resources/native proof. Proof budget: focused adapter/layout/engine
  tests, one final tarball consumer run with bounded failure repairs, one four-style
  PDF and one overflow PDF inspected for text/fonts/visuals. No full old-repo suite.
- Document budget: this existing plan plus Core code-adjacent README/API notes.
  Return in this chat; no dispatch/registry or additional report artifacts.
- Blocking unknown: extracting the generic writer may reveal hidden dependencies
  on old proof profiles. Read its bounded dependency closure first; stop and report
  if preserving rendering requires a contract or algorithm redesign. Performance
  claims, other platforms and table seams are deferred, not prerequisites here.

### P4.1 — Resolve the public input and private writer boundary

Files: create `src/composition/resolvedDocument.ts`, `src/pdf/drawContract.ts`,
`src/pdf/writePdf.ts`, `tests/pdf/writePdf.test.ts`,
`fixtures/pdf/four-styles.resolved.json`; modify `src/index.ts` only as needed.

- [ ] Define the text slice of ResolvedDocument: `schemaVersion:1`,
  `nodeModelVersion:4`, template identity `{templateId,docKey,version}`, R1 `book`,
  `styles`, ordered `rootIds`, `nodes` map and `sourceMap`. Retain R1 text-block
  shape (`id`, `type`, `role`, `props.textStyleId`, optional content sizing,
  inline text/line-break children). No tags, repeats or format invocation remain.
  Source entries contain contentIndex/format/sourceId and optional itemIndex.
  No coordinates or glyph arrays appear in this public document.
- [ ] Validate this supported resolved shape at the engine boundary: finite
  positive page/font/line metrics, usable margins, unique IDs, complete references,
  known styles and no unsupported node. Return LAYOUT_FAILED with nodeId when
  available; never silently omit a node. Runtime inputs can arrive from JSON.
- [ ] Inspect the private dependency closure of old
  `packages/pdf-renderer-pilot/src/index.ts` at input commit fa76c74, especially
  font validation, glyph cluster mapping, ToUnicode/ActualText, PDF objects/xref
  and page drawing used by renderFlowDocLocalMeasuredDocumentPdf. Extract only
  text/font/multipage logic behind `writePdf(draw, fontResources): Uint8Array`.
  Keep glyph positions and Unicode semantics unchanged. Do not copy report
  markers, image modes, proof IDs, fixed fingerprints or old public imports.
- [ ] Write failing tests for generated PDF structure, mixed font resources,
  missing font mapping and glyph offsets before implementation. Run
  `npx vitest run tests/pdf/writePdf.test.ts`, implement and require PASS.
  The fixture is resolved content, not the old measured request.

### P4.2 — Measure, flow and manage one generation

Files: create `src/runtime/textRuntime.ts`, `src/runtime/subsetFonts.ts`,
`src/layout/textFlow.ts`, `src/pdf/createPdfEngine.ts`,
`tests/layout/textFlow.test.ts`, `tests/pdf/createPdfEngine.test.ts`.

- [ ] Define public `PdfArtifact = {bytes:Uint8Array; mediaType:'application/pdf';
  pageCount:number}`, `PdfEngine.generatePdf(document:ResolvedDocument):
  Promise<Result<PdfArtifact>>` and `createPdfEngine(resources:ExportResources):
  Promise<Result<PdfEngine>>`. Export these types and factory at the package root.
  Extend Issue with optional nodeId/contentIndex/format without breaking P1.
- [ ] Write failing layout tests: explicit newline and empty block, several
  inline leaves forming one paragraph, Thai marks, non-BMP characters, exact-fit
  line, narrow line/long word and a page overflow. Require all text retained in
  order and glyph bounds within printable area. Never wrap by character count.
- [ ] Implement native shaping and ICU break adapters using async execFile,
  argument arrays, 30-second timeout and 16-MiB output cap per child. Verify byte
  offsets are UTF-8 scalar boundaries, convert clusters to UTF-16 safely and
  reject glyph zero. Select fonts from explicit weight/style, never fallback.
- [ ] Implement text flow: convert mm to pt with 72/25.4; traverse root order,
  resolve styles and measure candidate lines at ICU boundaries. Re-shape each
  final line rather than slicing paragraph glyphs. If no break fits, try complete
  grapheme boundaries and measure; if no whole grapheme fits, return LAYOUT_FAILED.
  Explicit line-break creates a line, including blank lines. Empty TextBlock
  consumes one line height. Page transition retains the entire overflowing line.
  Unsupported styling/node geometry fails instead of being ignored.
- [ ] Engine allocates mkdtemp under resources.tempRoot per generation, subsets
  only used fonts with retained glyph IDs and distinct derivative names, then
  invokes the private writer. Cleanup belongs in finally for success/failure;
  concurrent calls use separate directories. No package/font file is modified.
- [ ] Test two overlapping generations and inject native/subset/writer failure:
  no shared temp state, no false success, no leaked outputs. Map resource failures
  to RESOURCE_UNAVAILABLE, layout failures to LAYOUT_FAILED and writer failures
  to PDF_RENDER_FAILED without stack traces/internal paths in public messages.
- [ ] Run `npm run build` and focused/full Core tests (small current suite),
  review the diff and retain passing results. Do not optimize without a failure.

### P4.3 — Prove the installed public API

Files: create `tests/consumer/checkPdf.mjs`,
`fixtures/pdf/overflow.resolved.json`; modify `Dockerfile.consumer`,
`scripts/checkPackedConsumer.mjs`, `tests/packageContract.test.ts`,
`package.json`, `package-lock.json` and `README.md`.

- [ ] Bump delivered prerelease to `0.1.0-dev.2`; remove hardcoded dev.1 values
  in packaging/consumer scripts by reading the package metadata. Keep the dev.1
  artifact/checksum unchanged. Verify only intended root exports and packed files.
- [ ] Consumer installs the new exact tarball and calls loadBundledResources,
  createPdfEngine and generatePdf on the two JSON fixtures. It receives fixtures
  as test inputs, never source modules or precomputed glyph/draw commands.
- [ ] Run as non-root with network none and no host mounts. Retrieve generated
  PDFs, expected text and result JSON from the completed consumer for inspection;
  do not delete the container until evidence retrieval succeeds.
- [ ] Verify four embedded subset fonts/Unicode mappings with pdffonts and exact
  extracted text with pdftotext (ignore layout whitespace only). Render and inspect
  all pages of the bounded fixtures with pdftoppm. Require no clipped glyphs,
  misplaced marks, overlap or missing/duplicated text at the page seam.
- [ ] Verify missing resource and failed generation do not report an artifact;
  temp root is empty afterwards. Record tarball SHA-256, image identity, versions,
  page counts, PDF hashes and check results beside the artifact.
- [ ] Review coverage and commit passing Core changes; update this plan with
  exact evidence. Stop at P4 acceptance. Next plan is schema/prepare/compose and
  simple table flow, preserving this public API rather than adding a second path.

### P4 execution ledger — 2026-10-07

- Owner authorized inline execution of the written P4 plan. Core started clean
  from 9256ab6 on a new `codex/public-pdf-engine` branch in the existing checkout;
  no concurrent work or real separate WORK dispatch. A fresh read-only code
  reviewer covered the whole candidate as required by executing-plans.
- Ruling: retain extracted PDF primitives as private JavaScript behind a typed
  TypeScript writer facade — avoids rewriting existing font/Unicode/PDF-object
  algorithms solely for strict array indexing — cost is no static type checking
  inside that private extracted module; writer and actual PDF tests cover it.
  Old report markers, proof profiles, image code and source imports are excluded.
- Ruling: add glyph ink boxes and face ascent/descent to native JSON while keeping
  Rustybuzz invocation and Cargo.lock unchanged — actual ink extents are needed
  to reject clipping/overlap — native ABI consumers retain all old fields.
- Ruling: use explicit A4 text-only resolved graph with strict unsupported-node/
  style rejection; no public glyph-command escape hatch and no generatePdf stub.
  Earlier foundation helper remains public; tables and binding stay future work.
- TDD: writer, layout/validation, runtime decoding and engine tests first failed
  on absent implementation, then passed. Engine tests cover isolated overlapping
  generations, partial-output cleanup, native/subset/writer failures and immutable
  input. Native decoder tests include UTF-8/non-BMP boundaries and invalid glyphs.
- Runtime finding: 12-pt overflow sample needs 18.36 pt of actual Thai ink; initial
  18-pt lineHeight correctly returned LAYOUT_FAILED. The fixture now requests
  20 pt rather than weakening the no-overlap check. R1's illustrative 12/18 style
  is not a guarantee for every input; template/layout acceptance must account for
  real ink when binding is implemented. Four-style body remains 14/25 pt.
- Review found one Important issue: non-string textStyleId could be coerced or
  throw during validation. Added a string guard and red-to-green array/object/null
  regressions, including the engine JSON boundary. Minor offset-test weakness was
  corrected by asserting the exact PDF text matrix. No other Critical/Important
  finding was reported; the reviewer did not self-promote runtime evidence.
- Host build and six test files passed 46 tests before the final packed run.
  Final package/visual acceptance and commit identity are recorded in the result
  below rather than treating this execution ledger as product Evidence.

### P4 result — 2026-10-07

PASS for the public resolved-TextBlock PDF engine/package prerequisite. All
P4.1–P4.3 criteria are covered by the following result; plan checkboxes retain
their original form. This is not table, binding, Service or full MVP acceptance.

- Core commit `04d7a1e7ec985f0b0e8a87d038f95f80a35eb623` on
  `codex/public-pdf-engine`, clean after commit. No merge or push performed.
- Package `@flowdoc/core@0.1.0-dev.2`; 42 allowed files inspected. Native resource
  JSON adds real ink metrics; font bytes/license and dependency lock versions
  retained. Public engine returns PDF bytes/pageCount through the R1 Result envelope.
- Final `npm run build`, `npm test`: PASS, six files / 46 tests. Final Linux
  package build ran the same checks, built native tools and generated manifest.
  Installed exact tarball in an isolated Node 24.21.0 Linux/amd64 consumer,
  user 10001, network none, mounts empty; consumer exit 0.
- Consumer: root resources/engine import; four styles; two-page flow; unsupported
  table rejection; concurrent calls; missing resource rejection; no artifact on
  failure; empty temp directory after calls; unchanged input and source fonts.
- Artifacts:
  `C:/Users/nekot/Documents/GitHub/flowdoc-core/artifacts/1791383680551/` contains
  exact tarball/consumer lock, result JSON, host-checks.json, inventory.txt,
  generated PDFs, expected/extracted text, font reports and rendered PNGs.
  Tarball SHA-256:
  `8cc546db34eb8e3b8186b155d80d1443cf219c8c6054347b4c681fb7efeb92d5`.
  Consumer image:
  `sha256:5a3f32ffa8578e137c05c6237aa3c08f942cb1b5091fd2fc338818f57d109904`.
- `four-styles.pdf`: one page, 143131 bytes,
  SHA-256 `d614f99db9f2155de1832f7e638d84c8637341c84c3db2c73c80e67f3bb011f5`.
  `overflow.pdf`: two pages, 133288 bytes,
  SHA-256 `b1d820a605af6830361f4bc32b89e501b55b5b70ca6c3a43c61c0fc5903f760d`.
- Host pdftotext matched expected text exactly ignoring whitespace only;
  pdffonts confirmed four / one embedded subset fonts with Unicode maps. Inspected
  all three pdftoppm-rendered pages: no clipping, line overlap, displaced Thai marks
  or missing text; page seam keeps entries 036 then 037. Final PDF bytes exactly
  match the visually checked candidate from artifacts/1791383480379, so visual,
  font and text checks were reused for those identical PDFs after validation repair.
- Verification-only inventory helper initially treated Windows CRLF as part of
  filenames; corrected its line splitting and confirmed 42 allowed entries.
  No source repair or artifact rebuild was needed for that helper correction.
- Completed consumer containers removed by the script after output retrieval.
  Failed diagnostic container b426f88bd53422fde50f5b76523035d0722ff707622202e79f3b073993b983de
  is retained with the initial line-height failure; no broad Docker cleanup.
- Known limits: text-only graph, fixed supported styles, no font fallback,
  line-height too small for actual ink fails, 65535 CIDs/font/document limit,
  30-second/16-MiB child-process limits. These are explicit failures rather than
  claims of arbitrary document capacity. No performance or API responsiveness gate.
- Next: a separately scoped validateTemplate/prepareGeneration/composeDocument
  implementation using R1 global/local/item policies, then table flow. Preserve
  this engine's public resolved-graph boundary; no new editor/import scope or
  shared map/MVP readiness promotion from this result.
  That subsequent slice is now implemented and verified in the
  [binding and composition result](flowdoc-export-mvp-r2-binding-plan-2026-10-07.md#b1b4-execution-and-result--2026-10-07).
  This does not alter the historical P4 boundary above. The subsequent
  [simple table PDF slice](flowdoc-export-mvp-r2-table-plan-2026-10-07.md) now has
  its own bounded result; Service/DB integration remains subsequent work.
