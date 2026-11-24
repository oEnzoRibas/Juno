# Phase 1 application foundation plan

**Status:** Owner-approved direction and first milestone. Implementation staging under [JUNO-0015](tasks/JUNO-0015.md). No application, dependency install, migrations, or container builds were performed for this plan.

## Approval boundary

MIT and developer governance, mandatory Docker and Compose, multi-tenancy, optional providers, Juno visual identity, native Draw.io, and English documentation are existing accepted requirements. Resolve [ADR-0003](../architecture/adr/0003-application-topology.md), [ADR-0001](../architecture/adr/0001-tenant-data-isolation.md), identity sessions and invitations, authorization and audit policy, tooling, and the first workflow before implementation. [ADR-0004](../architecture/adr/0004-durable-domain-events.md) and [ADR-0007](../architecture/adr/0007-integration-adapters.md) remain proposals. They may be deferred without blocking unrelated core work.

Recommend evaluating a modular backend under one transaction scope. Compare Next.js and NestJS with an integrated Next.js candidate using the same vertical slice. Keep one provider-independent ingress and minimal infrastructure. Use a separate worker only when the approved event and failure model requires it. See the [technology evidence plan](phase-1-technology-comparison.md).

## Delivery increments

1. **Decisions.** The accepted workflow provisions a tenant and branding, issues and activates a one-time invitation, signs in the invited member, and opens an authorized dashboard while denying access to another tenant. Compare topology and data paths with synthetic tenants.
2. **Runnable baseline.** Create only real workspace entry points. Pin the runtime inside reproducible images. Document frontend, backend, PostgreSQL, migration, and optional-worker profiles with health checks, private networks, configurable loopback ports and separate data volumes.
3. **Data and quality.** Demonstrate repeatable migrations, synthetic data, restore and least-privilege database access. Add formatting, lint, type-check, tests, docs and secret checks plus image build and cold startup. Check architectural import direction in CI when the runtime and fixtures exist.
4. **Tenant and identity.** Establish global identity, invite activation and revocation, server-owned tenant context, non-bypassing database roles, tenant keys, scoped permissions, platform administration and redacted audit. Run two-tenant tests over direct and indirect data paths, storage, jobs and pooled context.
5. **Shell and organization work.** Add accessible theme-aware components, navigation, dashboard, organization switcher and settings. Establish departments/directorates, teams, members, projects, subprojects, roles and historical allocations. Keep authority on the server.
6. **Optional extension points.** Add the registry and reviewed capability ports with encrypted tenant credential references, disabled-by-default providers and synthetic fault checks. Add internal events, tenant rule versioning, XP and achievement tracking, and an auditable virtual currency ledger after the business decisions are accepted.

## Dependency rules

Presentation may call application use cases. Domain rules and ports cannot import presentation, provider SDKs or persistence adapters. Repositories, job consumers and providers implement service ports, and are wired at the composition root. Shared API packages carry schemas, transport contracts and client generation inputs, not application services or database models. Check that web and provider modules cannot query the database cross-domain or bypass authorization. Preserve auditable storage and credential scopes across the runtime.

## Evidence before adopting architecture

Capture independent cold install and startup, two-tenant behavioral and row-policy checks, explicit session and browser-origin policy, migration and restore, amd64 and arm64 feasibility, and measured host resource requirements. Estimate monthly cost using a documented provider-independent baseline and current hosting assumptions. Record breaking design trade-offs and review decisions in ADRs. Do not publish runtime claims before implementing and exercising the chosen stack.

## PR and queue strategy

Each row in the [dependency graph](phase-1-dependencies.md) is a proposed focused scope. Create actual PRs only after a meaningful increment. Use native stacks for true dependencies where possible, and base independent work directly on main. Provider work retains [JUNO-0006](tasks/JUNO-0006.md) through [JUNO-0011](tasks/JUNO-0011.md). These tasks wait on the executable foundations, contractual prerequisites and provider-specific feasibility.
