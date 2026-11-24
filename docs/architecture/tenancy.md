# Tenant isolation and scoped authorization

**Status:** PostgreSQL tenant and membership read policies implemented in [migration 0001](../../apps/api/drizzle/0001_tenant_schema.sql). The [onboarding slice](tenant-onboarding.md) resolves the actor from a verified local session, authorizes provisioning and invitation actions, and uses transaction-local scope for dashboard reads. Each Junior Enterprise is a tenant. Tenant data includes members, placements, directorates, teams, projects, subprojects, roles, permissions, integrations, reports, learning, challenges, gamification rules, currency, rewards, branding, settings, and audit records.

| Data scope | Examples |
| --- | --- |
| Global | Identity and credential or session records, tenant directory and platform provisioning audit. |
| Tenant-owned | Memberships, scoped grants, org charts, projects, domain events, rewards, data exports, integration mappings, operational audit and branding. |

- Distinguish global identity from tenant membership. If an identity belongs to several tenants, each membership has its own status, permissions, and lifecycle. Deactivation revokes the affected membership and preserves historical attribution as authorized.
- Resolve the requested organization using a server-validated context. A slug, hostname, or route identifies the requested tenant only. Use a restricted actor-and-tenant membership lookup to check active membership and scope before opening objects, including references supplied in request bodies. Deny by default. Authorize listing, reading, modifying, approval and export independently.
- Model permissions as actions on resources and bind grants to applicable organization, directorate, team, or project scope. Define inheritance and conflict handling explicitly. Prevent delegated administrators from granting powers they lack. Test actor, permission, tenant, and scope together.
- Require tenant scope on every durable child association and uniqueness rule where relevant. Carry validated scope into cache keys, storage paths, signed download grants, background jobs, webhook routing, audit events, exports, queues, and restore operations. Avoid accidental scope inheritance across requests or async operations.
- Keep platform provisioning separate from tenant content access. Any later support access needs a defined purpose, target tenant, least privilege, time limit, audit, and approval criteria.
- Require a database-enforced isolation boundary in addition to server authorization and query predicates. The runtime uses forced PostgreSQL row-level security with a non-bypassing API role and separate migration credentials. Future worker roles must honor the same boundary. Scope context to each transaction, verify cleanup under pooling and deny on missing scope.
- Apply isolation to read paths, mutation paths, counts and other metadata, and internal operators. Keep cross-tenant product metrics subject to an explicit separate policy and privacy review.

See [ADR 0001](adr/0001-tenant-data-isolation.md) for persistence alternatives and [testing](../testing/README.md) for release evidence.
