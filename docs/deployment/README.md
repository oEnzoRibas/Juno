# Container-based self-hosting

**Status:** Reference deployment approved. Implementation and operator commands are planned. [ADR-0005](../architecture/adr/0005-mandatory-containerization.md) requires Docker Compose as the initial deployment baseline. Junior Enterprises may operate it on their own Linux container host or a provider of their choice. Determine host capacity, disk, supported CPU architectures and operator effort from the first tested deployment.

## Operator runbook requirements

1. **Install and configure.** Document supported Git, Docker and Compose prerequisites, image acquisition or build, per-instance environment, separate production configuration, and secret rotation. Use named volumes for persistence and scope operator access.
2. **Network and identify.** Document domain and DNS setup, reverse proxy and HTTPS certificate renewal. Expose only the ingress and necessary public endpoints. Keep databases and storage private and enforce trusted proxy settings.
3. **Deploy and monitor.** Verify image provenance and health before accepting traffic. Monitor readiness, uptime, error rate, queue depth, volume capacity, integration failures and backup age. Redact sensitive logs and document escalation.
4. **Back up and restore.** Back up database and object storage with protected, encrypted copies. Record retention and recovery objectives. Rehearse restoration to an isolated deployment and check tenant scope, asset consistency and recovery time. Never purge routine persistence during shutdown.
5. **Upgrade and roll back.** Back up before schema changes. Review compatibility, execute controlled migrations, and verify readiness. Roll back only to an image compatible with the migrated schema, or use the approved database recovery procedure. Obtain explicit authorization for destructive production actions.
6. **Troubleshoot.** Document how to identify failed migrations, readiness problems, routing or certificate errors, full disks, stalled jobs and restore failures using verified commands.

For each external provider, record requirements, permissions, cost and a portable or disabled workflow. Include the [MIT License](../../LICENSE) and required third-party notices with distribution. See [container design](../architecture/containers.md), [threat model](../security/threat-model.md), and [release policy](../governance/release.md).
