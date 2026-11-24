# Container architecture

**Status:** Docker and Compose are mandatory under [ADR-0005](adr/0005-mandatory-containerization.md). The Compose starter implements web, API, PostgreSQL and one-shot migrations. Worker, object storage and production ingress remain planned. Juno remains a modular monolith. See the [containerized development diagram](diagrams/README.md).

| Service candidate | Role and boundary |
| --- | --- |
| `web` | Browser-facing frontend. Next.js serves localized pages. Route external traffic through ingress. |
| `api` | Tenant-aware use cases and authorization. NestJS serves REST and OpenAPI. A combined topology can use one application image. |
| `worker` | Optional process for durable jobs with authorized use cases and a restricted identity. |
| `database` | PostgreSQL on the private network with a named volume. Use distinct runtime, migration and backup roles. |
| `object-storage` | Optional S3-compatible service. Keep storage endpoints and volumes private. |
| `migration` | One-shot Drizzle migration service. Wait for database health, serialize schema changes and gate dependent startup on success. |

Use Compose service names for discovery. Attach ingress only to public-facing services. Keep persistence ports private and local debug ports on loopback. Separate readiness from liveness, including schema readiness. Services must tolerate dependency restarts. [Docker startup and readiness](https://docs.docker.com/compose/how-tos/startup-order/)

## Compose and Dockerfile design

| Proposed file | Intended content |
| --- | --- |
| `compose.yaml` | Shared service, network, volume and health definitions. |
| `compose.dev.yaml` | Development watch overlay for frontend source sync and API rebuilds. |
| `compose.prod.yaml` | Approved runtime images, private volumes, ingress and mounted runtime secrets. Keep development mounts and servers out of production. |
| Component Dockerfiles | Add when an executable component exists. Document dependency, build and runtime stages, configuration and maintenance. |
| `.dockerignore` | Exclude local secrets, Git history, caches and unrelated outputs when a build context exists. |

Use explicit base image versions, digest pinning where appropriate, dependency lockfiles, effective layer caching, and minimal runtime images. Run with a non-root user and appropriate filesystem permissions. Ensure graceful shutdown. Keep build-time public configuration separate from runtime settings. Use secret mounts for authorized build inputs. Pin and test image variants before advertising amd64 or arm64 support. [Multi-stage builds](https://docs.docker.com/build/building/multi-stage/) · [Compose merge rules](https://docs.docker.com/compose/how-tos/multiple-compose-files/merge/)

## Configuration and data

Separate development, testing, production, tenant settings, integration credentials and infrastructure secrets. Keep tenant settings behind application authorization. Limit each integration or infrastructure secret to the service that needs it. Document each supported variable's purpose, required status, default, format and security implications. Put safe examples in [.env.example](../../.env.example). The [development runbook](../development/docker.md) describes current settings.

Use named project-scoped volumes and separate developer and test projects. Initialize only an empty database and apply controlled migrations. Trigger synthetic seeds explicitly in development. A failed migration blocks startup or rollout. Document approved recovery, restore and rollback procedures. Volume removal is a separately authorized destructive operation.

See [developer setup](../development/docker.md), [self-hosting](../deployment/README.md), and [testing](../testing/README.md).
