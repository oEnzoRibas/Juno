# ADR-0003 — Application topology

| Field | Value |
| --- | --- |
| Status | Proposed |
| Date | 2026-11-24 |
| Decision owner | Enzo Ribas, with architecture and security review pending |
| Prepared by | Codex, as AI-assisted decision preparation |
| Related task | [JUNO-0001](../../development/tasks/JUNO-0001.md) |
| Related ADRs | [ADR-0001](0001-tenant-data-isolation.md), [ADR-0004](0004-durable-domain-events.md) |

## Context and problem

Juno needs a reproducible MVP for independent operators. Choose a boundary between UI and server-side use cases while keeping transaction and tenant policy in one backend.

## Drivers and requirements

Prioritize predictable authorization, secure session handling, accessibility and localization, explicit module contracts, contributor setup, low operational complexity and MIT-compatible distribution.

## Alternatives and trade-offs

- A single full-stack modular application reduces the number of processes and simplifies same-origin sessions. Require module-boundary checks and a path to publish a stable API if needed.
- A separate frontend and modular API make the contract explicit and support independent UI work. Each runtime adds setup, release coordination, and security configuration.
- A managed backend can speed provisioning but needs an independent deployment path, export and restore evidence, and a cost review.

## Recommendation and rationale

Evaluate a modular monolith as the common backend model. Compare the single-runtime and separate web/API variants using the same tenant workflow. Accept the smallest topology that meets the requirements and add a worker process only when durable work or isolation warrants it. Technology selection is pending.

## Consequences

A shared transaction boundary simplifies tenant-sensitive writes and reporting. Boundaries need explicit enforcement through imports, adapters and review. A split topology needs origin and session policy plus contract compatibility. If packaging changes later, preserve stable contracts and rehearse migration with repeatable data and recovery.

## Validation strategy

Record clean setup time, operating footprint and recovery, accessibility and localization, and policy and tenancy results for the same synthetic invite and access workflow. Verify session and authorization threats before acceptance. No implementation evidence is available. See the [architecture evaluation](../overview.md) and [technology comparison](../technology-evaluation.md).
