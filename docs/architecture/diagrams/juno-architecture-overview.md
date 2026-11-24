# System architecture

**Status:** Proposed. **Last meaningful update:** 2026-11-24.

Proposed modular monolith. The web and API candidates sit beside a dedicated Integration Hub. The right column shows examples of optional external providers. Internal use cases retain local alternatives.

Provider connections cross a trust boundary. The Hub authorizes tenant resource and credential use. No named framework or provider implementation has been accepted.

[Editable master](juno-architecture-overview.drawio) · [SVG](juno-architecture-overview.svg) · [PDF](juno-architecture-overview.pdf)

Prepared with Codex assistance from the owner-supplied visual references. See [JUNO-0005](../../development/tasks/JUNO-0005.md), [decision record](../adr/0003-application-topology.md), [related ADR](../adr/0007-integration-adapters.md), and [technical context](../overview.md). Juno was created by Enzo Ribas and is developed with the assistance of artificial intelligence.
