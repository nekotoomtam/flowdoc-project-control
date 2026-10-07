# FlowDoc Export MVP R2-A Runtime Prerequisite Plan

> **For agentic workers:** Use `superpowers:executing-plans` for the proposed
> inline execution after owner review. No separate WORK room or subagent is
> dispatched by this document. Steps use checkboxes to record actual results.

## Authority Boundary

Owner: Project Control. Role: Planning Partner / Documentation Synthesizer.
Authority: owner's request to continue toward starting the MVP, 2026-10-07.
Status: proposed plan for review; no tasks executed under this plan.
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

- [ ] Read owner Core AGENTS.md and confirm current commit/status before copying.
      Preserve existing changes; record them rather than assuming old HEAD is current.
- [ ] Inspect Docker context and engine with `docker version` / `docker info`.
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
