# Core Stage 2 Semantic Oracle Plan — 2026-09-14

## Purpose

The Stage 2 semantic oracle is a temporary, Core-private proof tool. It turns
the approved run-owned semantic contract into deterministic fixtures before a
mutable Rust session is written. Its purpose is to answer whether a caret
boundary has a provider-backed exact result, or must be rejected without
changing the committed revision.

It exists to prevent the next engine from inheriting the blocked candidate's
paragraph-wide first-strong property rule. It is not a second production text
engine and it does not prove Gate 2 performance by itself.

## What Uses It

The oracle is used only by Core-owned tests and proof commands during the
following stages:

1. Stage 2 derives `AnalysisRun` facts and classifies boundaries.
2. Stage 3 Rust-session construction consumes the accepted fixture meanings.
3. Later command tests compare a private session result to the oracle's fixed
   expected result.

The oracle may use complete text and provider output as a reference while
testing. The future mutable session must not call it as a foreground fallback,
copy its full facts into TypeScript, or publish a result that it cannot certify
within the fixed command limits.

## Explicit Scope

Inputs are committed text, `AuthoredSpan` values, `ParagraphContext`, a caret
or structural split position, and reviewed Unicode/shaping-provider output.
Outputs are an ordered list of derived `AnalysisRun` descriptors and exactly
one boundary decision:

```text
certified(seam facts) | not-admissible(reason)
```

Required fixtures are same-property Enter, Thai-left/Latin-right Enter,
`off|ice`, Thai base plus combining marks, surrogate and ZWJ boundaries,
active composition, RTL/first-strong changes, and a missing seam certificate.
Every fixture records expected source, run keys, accepted or rejected boundary,
and the reason from provider facts or a typed conservative fallback.

## Explicit Exclusions

The oracle does not own mutable committed source, revisions, receipts, cached
layout shards, browser state, DOM geometry, rendering, Editor or Backend
integration, public exports, production binding, Gate 3, Node-count claims,
or Gate 2 latency/scaling admission. It never repairs a failed command,
schedules whole-paragraph work, or supplies provisional visible text.

## Stop Gate

No mutable session work starts until every required fixture has an exact,
provider-backed accepted result or an exact typed rejection. If the provider
cannot prove a local seam, the fixture remains
`not-admissible(uncertified-seam)` and the session must preserve its old
revision and receipt.
