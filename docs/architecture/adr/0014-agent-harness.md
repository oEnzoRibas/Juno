# ADR-0014 — Agent harness ownership, reusable skills and local creative tooling

- **Status** Proposed on 2026-11-26. The maintainer authorized implementation experiments and selected Photoshop for mascot production. This ADR remains in review.
- **Decision owner** Juno maintainer.
- **Task** [JUNO-0046](../../development/tasks/JUNO-0046.md).
- **Related** [ADR-0011](0011-three-agent-development.md) and [ADR-0013](0013-review-build-provenance.md).

## Context

Juno's three ownership lanes already have a registry, exact-revision review tooling and independent QA. Historical review incidents show repeated gaps between expected and executed SQL, runtime identity and handoff evidence. Long sessions also make recovery and ownership checks expensive. Creative source files require native application verification.

## Proposed decision

Keep the three persistent ownership lanes and delegate bounded specialist work when it has a concrete benefit. Maintain compact project skills under `.agents/skills/` and verified standalone custom definitions under `.codex/agents/`. Reuse existing review, provenance, CI, documentation and fixture tools. Apply the parent permission profile, exact path ownership and human merger controls.

Use local Photoshop as the primary mascot production environment. Establish a reproducible native PSD proof before relying on a bridge. Prefer a local script or a constrained CLI over a new service until repeated use demonstrates a need for an MCP adapter. Preserve native editable and non-destructive source; vector illustration remains appropriate to independent vector deliverables.

## Alternatives and consequences

Keep all guidance in the root instructions. This has minimal setup but makes unrelated tasks carry the same operational detail. Creating many permanent specialist owners fragments responsibility. Pushing creative automation into the application or a managed provider adds dependencies, cost and data exposure without improving the first local proof.

The hybrid model adds reviewable skill and config artifacts. Maintain metadata, exact references, session tests and independent qualification to control drift. The [migration plan](../../development/harness/README.md#migration-and-gates) preserves existing runtime and development evidence. The [inventory and permissions](../../development/harness/capabilities.md) and matched evaluation define adoption evidence.
