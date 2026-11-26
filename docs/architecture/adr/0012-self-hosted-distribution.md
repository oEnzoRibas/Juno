# ADR 0012 — Independent self-hosted distribution

**Status:** Accepted by the project owner on 2026-11-24
**Task:** [JUNO-0038](../../development/tasks/JUNO-0038.md)

## Decision

Juno is an MIT-licensed Junior Enterprise Management Platform with a multi-tenant architecture and a SaaS-style user experience. Upstream distributes software and documentation. Enzo Ribas and upstream maintainers have no obligation to provide, finance, administer or operate adopter infrastructure.

The same installation architecture serves a single Junior Enterprise and independently operated deployments for several organizations. Federations, universities, networks and other operators may run a multi-organization instance. Each installation provisions its own platform administrators. The upstream creator and maintainers receive no automatic access.

Core operation requires no central Juno server, cloud account, hosted database, subscription, activation server, mandatory telemetry, proprietary service or creator-operated infrastructure. External integrations are optional. The MIT license and independent forkability remain in effect.

Operators can install from a versioned checkout or approved GitHub release artifacts and build reproducible Docker images. Approved versions may also offer versioned OCI images through GitHub Container Registry. An image mirrors the software artifact. The operator controls where to run it. An operator may mirror or build dependencies and artifacts.

## Responsibilities and consequences

Upstream maintains the code, documentation, optional release artifacts, upgrade guidance and vulnerability reporting process. The installation operator is responsible for infrastructure and costs, data protection, identity and access, HTTPS, operational security, backup retention and restoration, updates, monitoring and availability. Tenant data stays within the installation and its operator-configured services. Upstream receives no automatic tenant data.

[ADR 0005](0005-mandatory-containerization.md) establishes Docker Compose as the reference. A production profile must support private persistent data, HTTPS and secure cookies, initial administrator bootstrap, onboarding, health checks, backups, upgrades, rollback and troubleshooting. The [installation status](../../deployment/README.md) distinguishes exercised paths from planned gates.

A centrally operated service would add an upstream availability and data-governance dependency. The selected distribution model keeps operations with the party that controls the installation. Maintaining platform compatibility, documented upgrade paths and an independent install rehearsal are upstream release responsibilities.

## Acceptance

Test a clean installation from pinned source with no central Juno account or API, including two tenant workspaces with independent access. Exercise HTTPS, a local administrator, persistence, restoration on a separate instance, and a supported update from the preceding schema. Publish only after the applicable artifacts and procedures pass review. Existing independent UAT databases and release authorization are unaffected.
