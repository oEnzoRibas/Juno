# Architecture diagram index

**Last meaningful update:** 2026-11-24. [JUNO-0002](../../development/tasks/JUNO-0002.md) established the initial kit. [JUNO-0005](../../development/tasks/JUNO-0005.md) added the integration views and updated system architecture, gamification, and tenancy. See the [visual standard](../../development/visual-documentation.md) and [export tooling](../../../scripts/diagrams/README.md).

## System and infrastructure views

| View and status notes | Source | Web | Print |
| --- | --- | --- | --- |
| [System architecture](juno-architecture-overview.md) | [Draw.io](juno-architecture-overview.drawio) | [SVG](juno-architecture-overview.svg) | [PDF](juno-architecture-overview.pdf) |
| [Multi-tenant data isolation](juno-multi-tenant-isolation.md) | [Draw.io](juno-multi-tenant-isolation.drawio) | [SVG](juno-multi-tenant-isolation.svg) | [PDF](juno-multi-tenant-isolation.pdf) |
| [Gamification event flow](juno-gamification-event-flow.md) | [Draw.io](juno-gamification-event-flow.drawio) | [SVG](juno-gamification-event-flow.svg) | [PDF](juno-gamification-event-flow.pdf) |
| [Persistent development queue](juno-development-fifo-queue.md) | [Draw.io](juno-development-fifo-queue.drawio) | [SVG](juno-development-fifo-queue.svg) | [PDF](juno-development-fifo-queue.pdf) |
| [Platform and organization workspaces](juno-platform-workspaces.md) | [Draw.io](juno-platform-workspaces.drawio) | [SVG](juno-platform-workspaces.svg) | [PDF](juno-platform-workspaces.pdf) |
| [Containerized development and deployment](juno-containerized-development.md) | [Draw.io](juno-containerized-development.drawio) | [SVG](juno-containerized-development.svg) | [PDF](juno-containerized-development.pdf) |
| [Organization profile](juno-organization-profile.md) | [Draw.io](juno-organization-profile.drawio) | [SVG](juno-organization-profile.svg) | [PDF](juno-organization-profile.pdf) |

## Development workflow

- [Stacked pull request workflow](development/juno-stacked-pull-request-workflow.md)
- [Multi-agent development architecture](development/juno-multi-agent-development-architecture.md)
- [Multi-agent coordination workflow](development/juno-multi-agent-coordination-workflow.md)

## Integration views

The [approved Integration Hub architecture visual](integrations/juno-integration-hub-architecture.md) is the visual benchmark for the proposed Hub architecture.

| View and status notes | Source | Web | Print |
| --- | --- | --- | --- |
| [Approved Integration Hub architecture](integrations/juno-integration-hub-architecture.md) | [Draw.io](integrations/juno-integration-hub-architecture.drawio) | [SVG](integrations/juno-integration-hub-architecture.svg) | [PDF](integrations/juno-integration-hub-architecture.pdf) |
| [Integration ecosystem](integrations/juno-integration-ecosystem.md) | [Draw.io](integrations/juno-integration-ecosystem.drawio) | [SVG](integrations/juno-integration-ecosystem.svg) | [PDF](integrations/juno-integration-ecosystem.pdf) |
| [Integration adapter architecture](integrations/juno-integration-adapter-architecture.md) | [Draw.io](integrations/juno-integration-adapter-architecture.drawio) | [SVG](integrations/juno-integration-adapter-architecture.svg) | [PDF](integrations/juno-integration-adapter-architecture.pdf) |
| [Tenant integration isolation](integrations/juno-tenant-integration-isolation.md) | [Draw.io](integrations/juno-tenant-integration-isolation.drawio) | [SVG](integrations/juno-tenant-integration-isolation.svg) | [PDF](integrations/juno-tenant-integration-isolation.pdf) |
| [Integration authorization flow](integrations/juno-integration-authorization-flow.md) | [Draw.io](integrations/juno-integration-authorization-flow.drawio) | [SVG](integrations/juno-integration-authorization-flow.svg) | [PDF](integrations/juno-integration-authorization-flow.pdf) |
| [Integration synchronization flow](integrations/juno-integration-synchronization-flow.md) | [Draw.io](integrations/juno-integration-synchronization-flow.drawio) | [SVG](integrations/juno-integration-synchronization-flow.svg) | [PDF](integrations/juno-integration-synchronization-flow.pdf) |
| [Integration notification flow](integrations/juno-integration-notification-flow.md) | [Draw.io](integrations/juno-integration-notification-flow.drawio) | [SVG](integrations/juno-integration-notification-flow.svg) | [PDF](integrations/juno-integration-notification-flow.pdf) |
| [Integration security boundaries](integrations/juno-integration-security-boundaries.md) | [Draw.io](integrations/juno-integration-security-boundaries.drawio) | [SVG](integrations/juno-integration-security-boundaries.svg) | [PDF](integrations/juno-integration-security-boundaries.pdf) |

The [supplied reference exports](references/README.md) remain available. The [Mermaid sketches](../diagrams.md) provide additional textual workflow examples. Promote significant views to the [accepted Draw.io standard](../adr/0008-editable-diagrams.md).

## Maintainer preview

- [Maintainer acceptance preview](development/juno-maintainer-uat.md)
