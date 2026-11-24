# ADR-0008 — Editable architecture diagrams

| Field | Value |
| --- | --- |
| Status | Accepted diagram standard. Optional container export remains proposed. |
| Date | 2026-11-24 |
| Decision owner and approver | Enzo Ribas in [JUNO-0002](../../development/history/JUNO-0002-request.md) and the [integration brief](../../development/history/JUNO-0004-request.md) |
| Prepared by | Codex with owner-supplied visual references |
| Related tasks | [JUNO-0002](../../development/tasks/JUNO-0002.md), [JUNO-0005](../../development/tasks/JUNO-0005.md) |
| Related ADRs | [ADR-0005](0005-mandatory-containerization.md), [ADR-0007](0007-integration-adapters.md) |

## Context and alternatives

Diagrams must be editable, version controlled and usable in a browser or print. Flattened exports lose editability. Text diagrams are useful for quick sketches but provide limited layout control. Editable Draw.io files preserve the visual model and permit matching portable exports.

## Decision and rationale

Use native Draw.io masters, preferably uncompressed XML, with SVG, PDF, and Markdown companions. Keep nodes, boundaries, icons and connectors editable, and retain creator and contributor credits. Use a local optional Python wrapper and Draw.io CLI for verification and export. Consider a separately pinned documentation container if a repeatable headless environment is needed. Keep all of this outside runtime images.

## Consequences and evidence

Update the master first, regenerate both exports, and record status and related decisions. Content may render differently across tool versions. Reproduce with documented tools and review both formats. Supplied legacy diagram references remain preserved. See the [diagram index](../diagrams/README.md), [visual standard](../../development/visual-documentation.md), and [tooling guide](../../../scripts/diagrams/README.md).
