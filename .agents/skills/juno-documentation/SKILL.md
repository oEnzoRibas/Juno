---
name: juno-documentation
description: Prepare Juno ADRs, editable architecture diagrams and operational evidence. Use for changes to architecture, contracts or review artifacts that require durable documentation, rather than routine prose changes.
license: MIT
metadata:
  version: '1.0.0'
---

# Juno documentation

## Inputs and outputs

Use the agreed decision or implementation scope, exact source revision, audience and existing documentation. Deliver the updated canonical page or ADR and any applicable editable diagram with synchronized exports.

1. Locate the authoritative records through [documentation standards](../../../docs/development/DOCUMENTATION.md) and the [ADR index](../../../docs/architecture/adr/README.md). Mark observed behavior, proposals and accepted decisions with their own evidence.
2. For a meaningful architecture view, follow the [visual standard](../../../docs/development/visual-documentation.md). Keep an editable Draw.io master, SVG and PDF rendered from it, and a companion with the source and attribution. Inspection verifies labels, arrows and readability as well as file type.
3. Run link and repository format checks. Respect the approved brand, MIT license and AI disclosure. If the export tool is unavailable, preserve the editable source and show which export and visual checks remain open.

A diagram communicates system behavior. It cannot establish runtime state, deployment, test success or acceptance. Local export tools are needed only when producing visuals.
