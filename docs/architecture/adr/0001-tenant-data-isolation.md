# ADR 0001 — Tenant data isolation

**Status:** Proposed. **Review:** Architecture and security maintainers before Phase 1 implementation. **Proposal updated:** 2026-11-24 in [JUNO-0001](../../development/tasks/JUNO-0001.md).

## Context

A small project needs a reproducible self-hosting path and strong isolation for independent Junior Enterprises. Tenants share product capabilities and may have different backup or data-location requirements. No persistence stack has been accepted.

| Option | Benefits | Costs |
| --- | --- | --- |
| Shared database and schema with tenant-scoped rows | One schema and deployment, straightforward migrations, low baseline operator effort. | A missing or stale tenant constraint can cross boundaries. Requires layered controls and care with per-tenant restore. |
| Schema per tenant | Separate table namespaces with a shared server. | Correct schema selection and pool handling remain critical. More migration and restore work as tenant count grows. |
| Database per tenant | Stronger administrative separation and simpler single-tenant restore boundaries. | More connection, credentials, migration, backup, and provisioning overhead. Shared operations require coordination. |

## Recommendation

Evaluate a shared relational schema with required tenant keys, composite constraints on tenant-owned relationships, and tenant-aware application authorization. Require a database-enforced second boundary. For PostgreSQL, evaluate row-level security using a runtime role without bypass privileges. Keep tenant scope scoped to a transaction where possible, and verify cleanup across pooled connections. Use a separate migration role. Document the backup implications and an exit path if data residency or dedicated isolation becomes necessary.

## Evidence required for acceptance

Use two synthetic organizations with overlapping identifiers in different scopes. Verify list, direct object, mutation, nested reference, export, job and cache isolation. Check counts and other surfaces where resource existence can be inferred. Exercise privileged access and, if row policies are used, evaluate missing context, bypass privileges and context reuse under connection pooling. Validate constrained writes, restoration and tenant export before adopting the design. See the [tenancy requirements](../tenancy.md).
