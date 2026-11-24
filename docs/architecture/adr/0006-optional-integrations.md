# ADR-0006 — Optional integration ecosystem

| Field | Value |
| --- | --- |
| Status | Accepted product requirement |
| Date | 2026-11-24 |
| Decision owner and approver | Enzo Ribas, in the [owner brief](../../development/history/JUNO-0004-request.md) |
| Prepared by | Codex, as AI-assisted decision preparation |
| Related task | [JUNO-0004](../../development/tasks/JUNO-0004.md) |
| Related ADRs | [ADR-0001](0001-tenant-data-isolation.md), [ADR-0005](0005-mandatory-containerization.md), [ADR-0007](0007-integration-adapters.md) |

## Decision and alternatives

Provide an optional Integration Hub scoped to each tenant. Juno's core must remain usable in independent self-hosted deployments without external providers. Tenant administrators configure permitted integrations in the application. The roadmap requires GitHub, GitHub Projects, YouTube, SharePoint, Slack and Notion as optional capabilities.

A mandatory provider would simplify certain onboarding paths but introduce provider dependence and outages to core workflows. Per-feature direct connections would duplicate credential, permission and health handling. A central Hub provides discoverability and consistent controls while preserving manual alternatives.

## Consequences and validation

Provide internal alternatives and test no-provider operation. Preserve audit and historical rewards or report records on disconnection, subject to documented retention. Adopt providers incrementally and review their permissions, costs, feasibility and platform support independently. No runtime migration applies in Phase 0. See the [product specification](../../product/integration-hub.md), [catalog](../../integrations/provider-registry.md), and [architecture proposal](0007-integration-adapters.md).
