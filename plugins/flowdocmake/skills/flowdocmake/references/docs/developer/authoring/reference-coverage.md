# Source-first reference coverage

## Authority Boundary

Owner: FlowDoc Project Control. Scope: reference-reconstruction workflow in
flowdocmake; this record does not add Core schema or certify visual fidelity.
Package 0.1.2 uses Service/Core 0.3.0 and the draft-only tool contract.

## Inspect the PDF before selecting a template

The PDF defines the required sections, layout and assets. A supplied JSON payload
may be incomplete or mapped for another template. Keep both sources unchanged.
Before reading or copying an old definition, inventory every source page, inspect
its rendered image, and identify all logical parts, including several parts on
one page. Text extraction alone misses geometry, rules, icons and signature space.
Capture font sizes from PDF evidence, column geometry, visible/hidden borders,
spacing, page rules, assets, alignment and header/footer placement. Record where
each part's data comes from: JSON, PDF, or a concrete unresolved conflict.

Use the package script `scripts/reference_inventory.py --source <pdf> --output
<new-directory> --render` with a Python runtime containing pypdf/Pillow. It writes
inventory.json plus every rendered page and review sheets. Inspect all sheets,
then full pages for each distinct pattern, boundaries and uncertain details.
Its per-page text, fonts and image counts are observations, not instructions.

Write `coverage.json` beside it, with this shape (the source identity comes from
inventory.json; page arrays use physical 1-based page numbers):

```json
{
  "source": {"sha256":"copy actual source SHA-256", "pageCount":2},
  "reviewedSourcePages":[1,2],
  "parts":[{
    "id":"approval", "title":"Approval block", "sourcePages":[1,2],
    "dataSource":"Names from PDF; mutable values declared in Section schema",
    "layout":{
      "font":"Measured family and pt size", "columns":"Measured widths",
      "borders":"Visible rules and signature lines", "spacing":"Measured gaps",
      "pageRules":"Section/page-break behavior", "assets":"Asset origins or none",
      "alignment":"Alignment and reference area", "headerFooter":"Placement and numbering"
    }
  }]
}
```

Run `node scripts/reference-coverage.mjs source inventory.json coverage.json`
before selecting an old template. It checks declared page/part coverage, source
hash and layout observations. It cannot prove that a person/model looked at the
images or found every semantic part. Review those claims against the PDF.

After the source inventory passes, an old template is a candidate only. Add
`reuse:{templateId,revision,comparisons:[{partId,decision,reason}]}` with one
comparison per part; decision is reuse/adapt/replace/new. A successful old preview
does not establish matching geometry or data coverage. Adapt the definition to
the observed PDF instead of forcing missing/different JSON formats into it.
Separate the reuse candidate from the target draft. Preserve a specified repair
target unless the user permits replacement; new-template tasks can reuse a
candidate under a fresh identity. Follow [draft selection](draft-selection.md).

## Reconcile the entire document before delivery

Every source part must map to output pages and contain real values. Counted REQ
codes do not cover definitions, menus, meetings, signatures, images or other
unlabelled content. Detect blank values, placeholders and duplicate sections;
permissive string schemas and zero warnings do not establish completeness.
Keep long requirement fragments grouped under the source requirement identity;
repeating a heading for each fragment changes TOC structure and pagination.

Add these review fields to the same record:

```json
{
  "output":{"path":"absolute PDF path","sha256":"actual SHA-256","pageCount":2,"templateId":"actual ID","revision":2},
  "reviewedOutputPages":[1,2],
  "outputChecks":{"toc":"pass","links":"pass","pageLabels":"pass","allValues":"pass"},
  "unresolved":[]
}
```

Each part needs `review:{outputPages:[...],content:"pass",layout:"pass",
evidence:"concrete comparison locations/measurements",differences:[]}`. A check
that genuinely does not apply uses `not-applicable: <reason>`. A failed check
remains failed until repaired; documenting a difference is not owner approval.
All physical output pages must be visually reviewed, including unexpected pages.
Keep meaningful page labels distinct from physical page indices.

Run `node scripts/reference-coverage.mjs delivery inventory.json coverage.json`.
It checks declared coverage and PDF identity; it does not perform pixel/semantic
comparison. The agent still verifies each claimed pass, actual TOC destinations,
text values and layout. Different page count is a diagnostic trigger: reconcile
missing parts, font/line heights, spacing and grouping before accepting it.
Never force equality by shrinking fonts, padding or truncating content.

Finish when the requested fidelity is demonstrated. If a renderer capability
actually prevents it, preserve the smallest failing input and report a blocker.
Do not lower the task to a structural sample or claim readiness merely because
the PDF opens. Publication still requires separate explicit owner confirmation.
