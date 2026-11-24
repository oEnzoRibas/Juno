# Architecture diagram index

Last meaningful update: 2026-11-24 in [JUNO-0002](../../development/tasks/JUNO-0002.md). The six views are design references. Each master carries the creator credit and AI disclosure. See the [editable-source and export standard](../../development/visual-documentation.md). The [original exports](references/README.md) are preserved separately.

| View and formats | Scope, status and boundary |
| --- | --- |
| System architecture ([Draw.io](juno-architecture-overview.drawio), [SVG](juno-architecture-overview.svg), [PDF](juno-architecture-overview.pdf)) | Proposed. The split web and API option links access roles, internal modules, private persistence and optional integrations. Names are candidates. [ADR-0003](../adr/0003-application-topology.md). |
| Tenant isolation ([Draw.io](juno-multi-tenant-isolation.drawio), [SVG](juno-multi-tenant-isolation.svg), [PDF](juno-multi-tenant-isolation.pdf)) | Proposed. Tenant context, scoped authorization and database policies form separate checks. Platform administration does not grant tenant content access. [ADR-0001](../adr/0001-tenant-data-isolation.md). |
| Gamification events ([Draw.io](juno-gamification-event-flow.drawio), [SVG](juno-gamification-event-flow.svg), [PDF](juno-gamification-event-flow.pdf)) | Proposed. Validated events feed tenant-scoped rules and auditable awards. Durable dispatch and outbox adoption require review. [ADR-0004](../adr/0004-durable-domain-events.md). |
| Development queue ([Draw.io](juno-development-fifo-queue.drawio), [SVG](juno-development-fifo-queue.svg), [PDF](juno-development-fifo-queue.pdf)) | Illustrative. Example work enters FIFO and passes completion gates. The [live queue](../../development/QUEUE.md) governs actual work and exceptions. |
| Platform workspaces ([Draw.io](juno-platform-workspaces.drawio), [SVG](juno-platform-workspaces.svg), [PDF](juno-platform-workspaces.pdf)) | Proposed. One platform hosts separate organizations, branding, and permitted modules. Access remains tenant-scoped. [Tenancy requirements](../tenancy.md) and [tenant branding](../../design/tenant-branding.md). |
| Containerized development ([Draw.io](juno-containerized-development.drawio), [SVG](juno-containerized-development.svg), [PDF](juno-containerized-development.pdf)) | Docker requirement accepted. Service split and CI are proposed. Separate developer projects use private persistence and optional jobs or storage. [ADR-0005](../adr/0005-mandatory-containerization.md) and [container design](../containers.md). |

The [textual architecture sketches](../diagrams.md) cover additional proposed access, entity and business workflows. Promote significant sketches to Draw.io and synchronized exports as the corresponding scopes become active.
