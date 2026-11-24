# Tenant integration isolation

**Status:** Proposed. **Last meaningful update:** 2026-11-24.

Two illustrative organizations use independent configurations, credentials, jobs and provider grants.

Every lookup and worker operation validates tenant scope and connection revision. Cross-tenant tests await runtime.

[Editable master](juno-tenant-integration-isolation.drawio) · [SVG](juno-tenant-integration-isolation.svg) · [PDF](juno-tenant-integration-isolation.pdf)

Prepared with Codex assistance for the Integration Hub proposal. See [JUNO-0005](../../../development/tasks/JUNO-0005.md), [decision record](../../adr/0001-tenant-data-isolation.md), [related ADR](../../adr/0007-integration-adapters.md), and [technical context](../../../integrations/security.md). Juno was created by Enzo Ribas and is developed with the assistance of artificial intelligence.
