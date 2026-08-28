# Flowdoc Glossary

The terms below use stable English IDs. They describe the Project Control model and do not make product-state claims.

## Node

`node` is a durable topic in the primary navigation tree. It has one primary parent or is a root.

## Truth State

`truth-state` says whether the statement about a Node is `current`, `planned`, `risk`, or `unknown`. `current` requires supporting Evidence; it is not inferred from Work.

## Work State

`work-state` says whether a temporary Work item is `queued`, `in-progress`, `blocked`, or `in-review`. It is separate from Truth State.

## Work Tree

`work-tree` is the hierarchy of Work records linked by `parentWorkId`. It shows how a broad topic splits into narrower topics or executable tasks, but it is separate from the Node tree and does not establish Truth State.

## Phase

`phase` is an ordered execution round for one executable Work task. It records the current step, role, stop conditions, and verification target without becoming a Node or Work child.

## Checklist

`checklist` is the measurable gate set for one Phase. Checklist item state records execution progress only; it does not prove product truth or promote a Node to `current`.

## Context Document

`context-document` is a Document record that an agent must read before executing a Work task or Phase. Context documents keep the required reading path explicit.

## Evidence Target

`evidence-target` describes the command, path, contract, document, or future Evidence record that would support a bounded claim. It is a target for verification, not proof by itself.

## Document

`document` is durable Markdown metadata with a role, authority boundary, lifecycle, and optional pinned repository references.

## Evidence

`evidence` links a limited claim to an exact repository commit and a checked path or contract ID. It does not verify unrelated changes in that commit.

## Repository Registry

`repository-registry` identifies approved repositories by HTTPS remote, checkout alias, default branch, and ownership summary. It never stores a machine-local checkout path.

## Repo Directory Overview

`repo-directory-overview` is the Project Control GUI surface that shows repository or area entry headings before Work, Project Control Node, Evidence, or Checklist detail. It answers where an area lives in the system.

## Work History View

`work-history-view` is the Project Control GUI surface that shows recorded work over time and returns the user to the focused Overview for the related repository or area. It is not Evidence.

## Focus Stack Map

`focus-stack-map` is the read-only navigation view that shows ancestor Nodes, the current Node, and its children.

## Summary Inspector

`summary-inspector` is the compact read-only side panel for a Node summary, status, and selected references.

## Full Detail Modal

`full-detail-modal` is the overlay for fuller Node details without replacing the current map position.
