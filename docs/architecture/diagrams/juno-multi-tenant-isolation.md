# Multi-tenant data isolation

**Status:** PostgreSQL read isolation implemented. **Last meaningful update:** 2026-11-24.

The initial schema stores global identity separately from each tenant's membership and branding. PostgreSQL forces row-level security on tenant and membership reads. Policies require both transaction-local account and tenant context and an active membership. Authorized application context, platform provisioning, richer role checks and integration credentials are planned.

The database regression script covers missing scope, cross-tenant reads, inactive membership, restricted writes and cleanup on a reused connection.

[Editable master](juno-multi-tenant-isolation.drawio) · [SVG](juno-multi-tenant-isolation.svg) · [PDF](juno-multi-tenant-isolation.pdf)

Prepared with Codex assistance from the owner-supplied visual references. See [JUNO-0021](../../development/tasks/JUNO-0021.md), [ADR-0001](../adr/0001-tenant-data-isolation.md), and [tenant isolation](../tenancy.md). Juno was created by Enzo Ribas and is developed with the assistance of artificial intelligence.
