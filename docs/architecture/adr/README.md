# Architecture decision records

| ID | Status | Subject |
| --- | --- | --- |
| [ADR-0001](0001-tenant-data-isolation.md) | Accepted isolation requirement | Tenant data isolation |
| [ADR-0002](0002-mit-licensing.md) | Accepted | MIT licensing for Juno |
| [ADR-0003](0003-application-topology.md) | Accepted | Application topology |
| [ADR-0004](0004-durable-domain-events.md) | Proposed | Durable domain events |
| [ADR-0005](0005-mandatory-containerization.md) | Accepted | Mandatory Docker and Compose |
| [ADR-0006](0006-optional-integrations.md) | Accepted | Optional integration ecosystem |
| [ADR-0007](0007-integration-adapters.md) | Proposed | Integration adapters and failure isolation |
| [ADR-0008](0008-editable-diagrams.md) | Accepted | Editable architecture diagram standard |
| [ADR-0009](0009-stacked-pull-requests.md) | Accepted | Native stack and review-readiness workflow |

Development process decision: [ADR-0011](0011-three-agent-development.md), accepted three-agent engineering and coordination.

Assign the next unused ID and use `NNNN-short-title.md`. Use the [ADR template](TEMPLATE.md) for every significant architectural or technical decision. Record actual dates, decision owners and preparers, affected tasks and decisions, alternatives, requirements, risks, migration, and verification. Use Proposed, Accepted, Rejected, Deprecated, or Superseded. Record actual human approval before marking an ADR Accepted. Historical records may have used an earlier format.

When a decision changes, create a new ADR and document its relationship to the older record. Mark the older record superseded and link its successor while preserving the historical decision and rationale. Minor changes belong in their [task record and worklog](../../development/PROTOCOL.md). See the [decision candidates](../decision-candidates.md) for the unresolved backlog.

[ADR-0010](0010-phase-one-platform.md) records the accepted Phase 1 platform and technologies.
