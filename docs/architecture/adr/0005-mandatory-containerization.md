# ADR-0005 — Mandatory Docker and Compose

| Field                       | Value                                                                                                                          |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Status                      | Accepted                                                                                                                       |
| Date                        | 2026-11-24                                                                                                                     |
| Decision owner and approver | Enzo Ribas, in the [owner brief](../../development/history/JUNO-0002-request.md)                                               |
| Prepared by                 | Codex, as AI-assisted decision preparation                                                                                     |
| Related task                | [JUNO-0002](../../development/tasks/JUNO-0002.md)                                                                              |
| Related ADRs                | [ADR-0001](0001-tenant-data-isolation.md), [ADR-0003](0003-application-topology.md), [ADR-0004](0004-durable-domain-events.md) |

## Context and problem

Junior Enterprises need reproducible development and independent self-hosting. Installation and testing should share runtime and infrastructure versions without host-level language tooling or databases.

## Decision and rationale

Docker and Docker Compose are required. Use Compose as the reference development and initial production environment. Developers need Git, a Docker-compatible Linux container environment, and the Compose plugin. Each contributor runs a separate stack with local configuration, synthetic data and private volumes. CI will exercise the same service definitions when the runnable stack exists.

Host-installed services require more host setup and create drift risk. A hosted-only baseline would reduce autonomy. Kubernetes or distributed orchestration would add maintenance before its benefits are demonstrated. Compose preserves the modular backend.

## Consequences

Maintain explicit base versions, lockfiles, non-root runtime images, health checks, platform validation, and recovery procedures. Separate development behavior, networks, secrets and data from production. Choose the service split, image registry and optional worker or object store in later work. Test WSL2 and macOS mount behavior and native ARM64 dependencies.

Phase 0 has no runtime to migrate. Introduce working images and migration procedures in the first production-capable implementation. Rehearse compatible upgrades and restore before changing the reference deployment.

## Validation and references

Verify cold startup, policies, migrations, reload, debugging, test and data isolation, shutdown, and restore on supported hosts. Check image provenance, architecture support, vulnerabilities and SBOM. See [container architecture](../containers.md), [deployment](../../deployment/README.md), and [Docker Compose](https://docs.docker.com/compose/).
