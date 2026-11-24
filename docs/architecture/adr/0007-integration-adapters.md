# ADR-0007 — Integration adapters, registry and failure isolation

| Field | Value |
| --- | --- |
| Status | Proposed |
| Date | 2026-11-24 |
| Decision owner | Enzo Ribas, architecture and security review pending |
| Prepared by | Codex, as AI-assisted decision preparation |
| Related task | [JUNO-0004](../../development/tasks/JUNO-0004.md) |
| Related ADRs | [ADR-0001](0001-tenant-data-isolation.md), [ADR-0004](0004-durable-domain-events.md), [ADR-0006](0006-optional-integrations.md) |

## Problem and alternatives

Providers differ in capabilities and credential models. Direct SDK use couples core behavior to SaaS. A universal provider interface produces unsupported methods and broad dependencies. Runtime plugins introduce untrusted code and operating complexity. Separate integration services impose deployment overhead. A reviewed adapter registry inside the modular backend keeps capabilities explicit and operations small.

## Recommendation and rationale

Use compile-time registration of capability-specific ports and tenant-scoped connections. Resolve adapter and connection independently. Inject reviewed adapters at the composition root. Prefer provider-supported scoped authorization, protected credentials, and background work through the existing durable-job decision. Keep provider failure outside core transactions and forbid credentials on client surfaces. Resolve provider-specific permission, capability and OAuth details before adoption.

## Consequences and validation

Adapters can be mocked and providers added incrementally. The Hub owns connection, credentials, sync metadata and failure handling. Provider code needs version and permission maintenance. Add schema, constraints and credential rotation in the implementation ADRs. Test two tenants, absent and failing adapters, OAuth state and revocation, retry and duplicate delivery, response redaction and safe disconnect. See the [integration architecture](../../integrations/integration-architecture.md), [security](../../integrations/security.md) and [synchronization](../../integrations/synchronization.md).
