# Flowdoc Glossary

The terms below use stable English IDs. They describe the Project Control model and do not make product-state claims.

## Node

`node` is a durable topic in the primary navigation tree. It has one primary parent or is a root.

## Truth State

`truth-state` says whether the statement about a Node is `current`, `planned`, `risk`, or `unknown`. `current` requires supporting Evidence; it is not inferred from Work.

## Work State

`work-state` says whether a temporary Work item is `queued`, `in-progress`, `blocked`, or `in-review`. It is separate from Truth State.

## Document

`document` is durable Markdown metadata with a role, authority boundary, lifecycle, and optional pinned repository references.

## Evidence

`evidence` links a limited claim to an exact repository commit and a checked path or contract ID. It does not verify unrelated changes in that commit.

## Repository Registry

`repository-registry` identifies approved repositories by HTTPS remote, checkout alias, default branch, and ownership summary. It never stores a machine-local checkout path.

## Focus Stack Map

`focus-stack-map` is the read-only navigation view that shows ancestor Nodes, the current Node, and its children.

## Summary Inspector

`summary-inspector` is the compact read-only side panel for a Node summary, status, and selected references.

## Full Detail Modal

`full-detail-modal` is the overlay for fuller Node details without replacing the current map position.
