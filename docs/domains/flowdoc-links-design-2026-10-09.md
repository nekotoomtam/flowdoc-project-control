# URL, labelled links and internal references — design proposal

## Authority Boundary

Project Control owns this proposed cross-repository contract. Core owns binding,
layout and PDF; Service owns variable masters, registration and its pinned Core
consumer. Role: Planning Partner; explicit request, execution IDs N/A. The owner
approved three distinct commands in conversation and requested starting. This
document is for written design review, not implemented capability or release
readiness. Existing baseline: Core 7313fd2 / Service 6415dcb, development 0.1.3.
No release/tag/push, frontend, DOCX, automatic TOC or page-number substitution.
Owner approved this written design on 2026-10-09. Execution planning:
[implementation plan](flowdoc-links-plan-2026-10-09.md).

## Intent

Provide clickable external URLs and internal destinations. Internal references
primarily establish the foundation for a later automatic table of contents.
Keep display text separate from destination semantics. A reference jumps to the
top of the first laid-out line of its target TextBlock, even if the block continues
on subsequent pages. Never choose a later continuation or repeated header copy.

## Three explicit commands

Use inline commands, allowing ordinary text before and after each link:

```json
{"id":"site","type":"url","value":"https://example.com"}
{"id":"help","type":"link","text":"Open website","url":"https://example.com"}
{"id":"jump","type":"reference","text":"Go to chapter 2","target":"chapter-2"}
```

The first displays its exact URL value; the second displays its label. The third
targets an internal destination ID, never an external URL or page number. Each
command validates its own fields; do not overload one ambiguous string.

These are proposed authored/resolved shapes, not an API already accepted by Core.
Template command values may be literal or a scoped field reference, using the
existing global/local/item binding concepts. Resolve fields before layout; do
not evaluate scripts, interpolation expressions or URLs during rendering.

## Variable proposal

Keep ordinary strings unchanged. Add one public variable type `link` with a
discriminated value matching the three commands: url carries value, link carries
text/url, reference carries text/target. The explicit discriminator preserves
separate validation and caller intent. A template field-ref can insert this value
inline; it must not silently stringify the object or turn arbitrary strings into
links. Literal inline commands remain possible without defining a variable.

An additive Service master entry is needed for this new type; choose its unused
ID from the actual master at implementation planning, not by guessing here.
Support the same link type in declared array item fields where repeated rows
already bind item values. Missing required values fail admission. Optional absent
link values emit nothing; malformed supplied links fail rather than disappearing.

## Destination identity proposal

Add an optional `anchorId` to TextBlock props. It is the public document destination
ID; it does not replace the existing graph node ID. A template may supply it as a
literal or bind it to a string field. A reference's target names that anchorId.

Graph IDs remain namespaced by the existing content invocation/item cloning.
Public anchor IDs must be unique in the composed document. Repeated formats
therefore supply distinct anchor values through their data, such as chapter-2
and chapter-3, even when their authored TextBlock has the same node ID. This
lets references from a different format address them without knowing generated
content-index IDs. Reject duplicate anchors with both relevant source locations;
never pick the first duplicate. This identity proposal requires owner review.

Initially anchors belong only to TextBlocks (including those already inside table
cells). Container/image destinations are out of scope. Missing targets fail before
PDF delivery. A target with no nonempty laid-out text line fails explicitly; a
leading blank line is not silently chosen as a visible heading. If there are
multiple physical copies of a header TextBlock, record only its first occurrence.

## Layout and PDF boundary

Introduce a new node-model version for these commands; preserve models 4–6 and
their existing PDF fixtures. Preserve the current text shaping and line wrapping.
Track normalized character ranges through binding and measurement so each visible
portion of a link retains its destination after wrapping and page splitting.

Derive clickable rectangles from positioned glyph clusters, respecting Thai marks,
ligatures and line boundaries. Do not reshape fragments independently merely to
measure a click area, and do not use character-count estimates. If a link boundary
crosses a single inseparable glyph cluster, the hit area covers that whole cluster.
Adjacent links must not acquire overlapping ownership of an inseparable cluster;
reject an ambiguous boundary rather than route a click unpredictably.

Build internal destinations from actual positioned line records, not a second
pre-render or a guessed page count. Resolve forward and backward references after
layout; convert coordinates once in the PDF writer. External link annotations and
internal reference annotations are separate actions with separately validated data.

Initial URL policy: absolute HTTP/HTTPS only, no embedded credentials or control
characters. Preserve the authored display text; do not fetch the URL. Other schemes
and PDF executable actions are out of scope. Link values are not PDF syntax.
Use the writer's proper escaping/encoding boundary for all annotation strings.

Initial visual treatment: preserve surrounding font, black text and no automatic
underline, keeping this slice about navigation and avoiding new style controls.
Link styling is independently extensible later.

## Acceptance and next step

Require test-first validation/binding/layout/writer coverage, installed Linux Core
consumer, Service master publication/snapshot compatibility and API export. Inspect
PDF annotations and render pages; additionally activate both external and internal
links in an agreed available PDF viewer. Annotation presence alone is not a claim
that interactive navigation was tested. Do not navigate private/sensitive URLs.

Cases: plain URL, labelled URL inside a sentence, Thai/English wrapped link,
multi-page link, forward/back reference, target after reflow, target spanning
pages, repeated header first occurrence, repeated format with unique anchors,
missing/duplicate/empty targets, malformed fields/URLs and legacy PDF parity.
Use controlled public example URLs for activation checks. No automatic TOC list,
automatic numbering, final page-count fixpoint or Word-equivalence claim.

After written design review, prepare the implementation plan with exact files,
interfaces, package/master decisions and bounded proof. Do not change product
behavior while the public variable/destination contract remains proposed.
