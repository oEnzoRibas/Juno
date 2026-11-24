# Multi-tenant data isolation

**Status:** Proposed. **Last meaningful update:** 2026-11-24.

Proposed organization workspaces with independent configurations and credentials. Tenant context, server authorization, and database policy each contribute to isolation.

Platform provisioning does not authorize tenant data reads. PostgreSQL role and pool behavior remain unvalidated.

[Editable master](juno-multi-tenant-isolation.drawio) · [SVG](juno-multi-tenant-isolation.svg) · [PDF](juno-multi-tenant-isolation.pdf)

Prepared with Codex assistance from the owner-supplied visual references. See [JUNO-0005](../../development/tasks/JUNO-0005.md), [decision record](../adr/0001-tenant-data-isolation.md), [related ADR](../adr/0007-integration-adapters.md), and [technical context](../tenancy.md). Juno was created by Enzo Ribas and is developed with the assistance of artificial intelligence.
