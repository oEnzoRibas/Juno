# JUNO — Mandatory Containerization, Visual Documentation and Brand Assets

## 1. Instruction precedence

This document supplements all previously approved Juno instructions.

Preserve the approved:

- MIT License.
- Original creator attribution to Enzo Ribas.
- AI-assisted development disclosure.
- Persistent FIFO development methodology.
- Documentation-first development.
- Multi-tenant architecture.
- Community-driven open-source philosophy.
- Official visual identity.

Register this request in the persistent development queue.

Do not abandon or replace an existing active task.

Containerization is now an explicit architectural requirement approved by the project creator.

## 2. Mandatory Docker architecture

Juno must be developed as a fully containerized application.

Docker and Docker Compose are mandatory architectural requirements, not optional technology candidates.

The project must support a reproducible development environment shared by contributors across different operating systems and hardware configurations.

A developer should be able to clone the repository and start the application without manually installing application runtimes, databases, or infrastructure dependencies on the host operating system.

The standard environment should require only documented prerequisites, such as:

- Git.
- Docker Engine or a compatible Docker environment.
- Docker Compose v2.

Avoid unnecessary host-level dependencies.

Document supported environments, including:

- Linux.
- Windows with WSL2.
- macOS.
- x86-64.
- ARM64, whenever supported.

## 3. Development environment

The local development environment must support:

- Hot reload.
- Source code bind mounts.
- Persistent development volumes.
- Reproducible dependency installation.
- Consistent runtime versions.
- Database migrations.
- Synthetic seed data.
- Automated testing.
- Debugging.
- Independent contributor environments.
- Configurable host ports.
- Service health checks.
- Internal Docker networking.
- Automatic service discovery.

Each developer must be able to run an independent instance without affecting other developers or real organizations.

Development environments must never depend on production databases or production credentials.

Provide simple, documented commands for common development operations.

The target startup experience should be equivalent to:

```bash
git clone <repository-url>
cd juno
cp .env.example .env
docker compose up --build
```

Adapt the actual commands to the supported operating systems and finalized architecture.

Do not document commands as functional until they have been validated.

## 4. Container boundaries

Evaluate the following proposed services:

- web: Next.js frontend.
- api: NestJS backend.
- worker: background job processing, when required.
- database: PostgreSQL.
- object-storage: optional S3-compatible local storage.
- migration: one-shot database migration service, when appropriate.

Additional infrastructure services must be justified by actual requirements.

Do not introduce Redis, Valkey, message brokers, or Kubernetes without documented reasons.

Container boundaries do not imply a microservices architecture.

Juno should preserve its modular monolith architecture unless explicitly changed through an accepted ADR.

## 5. Dockerfile standards

Create appropriate Dockerfiles for executable application components.

Use:

- Multi-stage builds.
- Minimal runtime images.
- Reproducible dependency installation.
- Explicit base image versions.
- Dependency lockfiles.
- Effective build-layer caching.
- Non-root runtime users.
- Appropriate filesystem permissions.
- Graceful process termination.
- Appropriate health checks.
- Build-time and runtime configuration separation.

Evaluate immutable image digests and controlled dependency updates.

Avoid using floating latest tags for reproducible production builds.

Do not store credentials in Dockerfiles, image layers, build arguments, or committed configuration files.

Use appropriate .dockerignore files.

Document each Dockerfile, its build stages, runtime behavior, and maintenance requirements.

## 6. Docker Compose strategy

Establish a clear strategy for development and production Compose configurations.

Evaluate:

```text
juno/
├── compose.yaml
├── compose.dev.yaml
├── compose.prod.yaml
├── .env.example
├── .dockerignore
├── apps/
│   ├── web/
│   │   └── Dockerfile
│   ├── api/
│   │   └── Dockerfile
│   └── worker/
│       └── Dockerfile
└── infrastructure/
    └── docker/
```

This structure is proposed and may be adapted through documented architectural decisions.

Development and production configurations must remain clearly separated.

Production containers must not depend on development bind mounts or development servers.

Use named volumes for persistent data.

Do not expose internal databases or infrastructure ports publicly by default.

Use health checks and explicit readiness mechanisms.

Do not assume that container startup order guarantees application readiness.

## 7. Configuration and secrets

Establish a documented environment configuration strategy.

Maintain an .env.example containing safe example values and descriptions.

Never commit real credentials.

Separate:

- Development configuration.
- Testing configuration.
- Production configuration.
- Tenant-level configuration.
- Integration credentials.
- Infrastructure secrets.

Document every supported environment variable.

Explain its purpose, required status, default value, expected format, and security implications.

Use appropriate secret management mechanisms in production.

## 8. Database lifecycle

The containerized environment must support:

- Database initialization.
- Schema migrations.
- Development seed data.
- Test database isolation.
- Persistent storage.
- Backup.
- Restore.
- Data recovery.
- Migration failure handling.

Document destructive commands clearly.

Never delete persistent volumes automatically.

Never execute destructive production database operations without explicit authorization.

Use synthetic data in public examples, tests, and development environments.

## 9. Containerized testing and CI/CD

GitHub Actions must eventually validate the same containerized environment used by contributors.

Evaluate automated pipelines for:

- Docker image builds.
- Docker Compose configuration validation.
- Application compilation.
- Type checking.
- Linting.
- Unit testing.
- Integration testing.
- End-to-end testing.
- Database migration validation.
- Container startup validation.
- Service health checks.
- Tenant isolation testing.
- Documentation validation.
- Container vulnerability scanning.
- Dependency vulnerability scanning.
- Secret detection.
- Software Bill of Materials generation.

Only introduce workflows that can run successfully against the current repository state.

Never fabricate CI results.

Evaluate GitHub Container Registry for future publication of official Juno images.

Do not publish images without explicit authorization.

## 10. Self-hosting requirements

Junior Enterprises must be able to deploy Juno independently.

The official application must not require infrastructure controlled by Enzo Ribas.

Provide comprehensive self-hosting documentation covering:

- System requirements.
- Installation.
- Configuration.
- Reverse proxy configuration.
- HTTPS.
- Domain configuration.
- Database persistence.
- Backups.
- Restoration.
- Upgrades.
- Rollbacks.
- Monitoring.
- Troubleshooting.
- Security considerations.

Production deployment must remain provider-independent.

Docker Compose should be the initial reference deployment mechanism.

Do not require Kubernetes or a specific commercial cloud provider.

## 11. Containerization documentation

Create or update documentation covering:

- Docker architecture.
- Development environment setup.
- Dockerfile design.
- Docker Compose configuration.
- Infrastructure networking.
- Persistent volumes.
- Environment variables.
- Secret management.
- Database migrations.
- Testing.
- Self-hosting.
- Production deployment.
- Backup and recovery.
- Contributor onboarding.

Record the mandatory containerization decision in an accepted ADR, preserving the existing ADR numbering.

Record implementation-specific decisions separately when appropriate.

## 12. Visual documentation standards

Juno must maintain professional visual documentation throughout its development lifecycle.

Use draw.io / diagrams.net as the primary editable visual diagram format for architectural documentation.

Every significant architectural diagram must have a version-controlled editable source.

Required formats:

- .drawio: editable master source.
- .svg: vector documentation export.
- .pdf: standalone distribution and printing export.

PNG exports may be generated when necessary.

Do not create diagrams consisting only of embedded raster screenshots.

Draw.io diagrams must contain individually editable nodes, connectors, icons, labels, containers, and boundaries.

Keep exported assets synchronized with their editable source.

## 13. Diagram visual style

Architectural diagrams must follow a professional, icon-driven style inspired by modern AWS architecture diagrams.

The objective is visual clarity, not AWS-specific infrastructure.

Use:

- Recognizable technology icons.
- Consistent icon sizes.
- Minimal text.
- Short component labels.
- Clean spacing.
- Strong visual hierarchy.
- Orthogonal connectors.
- Clear directional arrows.
- Dashed system boundaries.
- Logical component grouping.
- Subtle backgrounds.
- Consistent color semantics.
- Accessible contrast.
- Vector graphics.
- Landscape layouts where appropriate.

Avoid:

- Long paragraphs inside diagrams.
- Excessive explanations.
- Unnecessary labels.
- Decorative illustrations.
- Overlapping connectors.
- Excessive colors.
- Unreadable font sizes.
- Unnecessary visual complexity.
- Cloud provider symbols that imply infrastructure not actually used.

Prefer one-to-three-word component labels whenever possible.

Use separate Markdown documentation to explain architectural behavior, decisions, limitations, and implementation details.

Use official technology icons only when permitted by their respective licenses and brand guidelines.

Document third-party icon attribution when required.

## 14. Diagram color system

Use the official Juno identity as the primary visual reference.

Approved brand palette:

- Primary: #7565F5
- Accent: #A99BFF
- Dark: #10111A
- Light: #F7F7FB
- Success: #22C55E

Additional semantic architecture colors may be used consistently for:

- Infrastructure.
- Persistence.
- External integrations.
- Security boundaries.
- Asynchronous processing.
- Observability.

Document these additional color decisions in the design system.

Do not modify the official brand palette without approval.

## 15. Existing visual assets

The project creator has provided an initial visual documentation kit.

Inspect the files before making changes.

The kit contains PDF and SVG assets under:

- assets/brand/logos/
- docs/design/
- docs/architecture/diagrams/

Preserve the approved original logo concept and colors.

Do not automatically redesign existing visual assets.

Do not treat proposed architecture diagrams as evidence of implemented functionality.

## 16. Official logo assets

The project contains three logo compositions:

- Full logo: symbol and wordmark.
- Symbol: icon only.
- Wordmark: name only.

Each composition contains four variants:

- Light.
- Dark.
- White.
- Black.

Use the existing naming convention:

```text
assets/brand/logos/
├── juno-logo-light.svg
├── juno-logo-dark.svg
├── juno-logo-white.svg
├── juno-logo-black.svg
├── juno-symbol-light.svg
├── juno-symbol-dark.svg
├── juno-symbol-white.svg
├── juno-symbol-black.svg
├── juno-wordmark-light.svg
├── juno-wordmark-dark.svg
├── juno-wordmark-white.svg
└── juno-wordmark-black.svg
```

Matching PDF versions must be preserved.

The official wordmark is "juno."

The official tagline is "Manage. Engage. Evolve."

Use SVG assets in application interfaces and Markdown documentation.

Use PDF assets for distribution and visual reference.

Preserve transparent backgrounds where appropriate.

Create derived favicons and application icons from the approved symbol without redesigning it.

Document appropriate attribution and asset usage.

## 17. Initial architectural diagrams

The existing diagram references are:

- juno-architecture-overview
- juno-multi-tenant-isolation
- juno-gamification-event-flow
- juno-development-fifo-queue
- juno-platform-workspaces
- juno-containerized-development

For each diagram, establish the following structure:

```text
docs/architecture/diagrams/
├── diagram-name.drawio
├── diagram-name.svg
└── diagram-name.pdf
```

Recreate the existing references as native, editable Draw.io diagrams.

Do not replace their visual design unnecessarily.

Validate generated diagrams and exports.

If Draw.io export tooling is unavailable, document the limitation and preserve the editable source without claiming that exports were successfully generated.

## 18. Additional diagram requirements

Throughout development, create visual documentation for relevant architectural domains.

Expected diagrams include:

- System context.
- Container architecture.
- Backend component architecture.
- Frontend architecture.
- Docker Compose topology.
- Development environment.
- Production deployment.
- CI/CD pipeline.
- Authentication.
- Authorization.
- Tenant provisioning.
- Tenant isolation.
- Database architecture.
- Entity relationships.
- GitHub integration.
- GitHub webhook processing.
- External integration adapters.
- Domain event processing.
- Transactional Outbox.
- Gamification engine.
- Experience progression.
- Virtual currency ledger.
- Reward redemption.
- Challenge validation.
- Report approval.
- Learning platform.
- SharePoint integration.
- File storage.
- Backup and recovery.
- Observability.
- Security boundaries.

Create diagrams incrementally alongside their corresponding development tasks.

Do not generate speculative diagrams and present them as finalized architecture.

## 19. Diagram traceability

Every significant diagram must be associated with relevant documentation and architectural decisions.

Maintain accompanying Markdown documentation explaining:

- Diagram purpose.
- Scope.
- Status.
- Components.
- Relationships.
- Relevant ADRs.
- Related development tasks.
- Security implications.
- Known limitations.
- Last meaningful update.

Use a documentation index to make diagrams discoverable.

Distinguish proposed, accepted, implemented, deprecated, and superseded architecture.

Every diagram must preserve the original project attribution:

Juno — Original project creator: Enzo Ribas.

Developed with AI assistance.

Preserve legitimate third-party and contributor attribution.

## 20. Diagram automation

Evaluate a reproducible diagram export workflow using Draw.io-compatible tooling.

Prefer a documented script or optional containerized tooling capable of exporting diagrams into SVG and PDF.

Avoid requiring every contributor to manually install additional proprietary development tools.

Keep visual exports reproducible where technically feasible.

Validate the generated artifacts before considering the task complete.

The diagram generation tooling must not unnecessarily increase the runtime requirements of Juno.

## 21. Repository documentation

Use the official Juno logo in the README.

Embed relevant architecture diagrams using relative repository paths.

Example:

```markdown
![Juno Architecture](docs/architecture/diagrams/juno-architecture-overview.svg)
```

Maintain organized documentation indexes linking to:

- Architecture.
- Diagrams.
- ADRs.
- Development environment.
- Docker.
- Deployment.
- Design system.
- Brand assets.
- Contribution guidelines.

All official documentation must remain in English.

## 22. Permanent AGENTS.md requirements

Update AGENTS.md to enforce:

- Mandatory Docker containerization.
- Reproducible development environments.
- Independent contributor environments.
- Containerized validation.
- Self-hosting support.
- Documentation-first development.
- Persistent FIFO task execution.
- Architecture Decision Records.
- Editable Draw.io documentation.
- SVG and PDF exports.
- Official branding.
- Enzo Ribas creator attribution.
- Contributor attribution.
- AI-assisted development disclosure.
- MIT licensing.

Every significant infrastructure change must update its related architecture documentation.

Every significant architectural change must update its relevant diagram.

## 23. Immediate assignment

Register this request in the persistent development queue.

Preserve the existing active task.

When this assignment becomes eligible:

1. Inspect the current repository.
2. Inventory existing brand assets.
3. Inventory existing architectural diagrams.
4. Integrate the provided visual references.
5. Record mandatory Docker containerization in an ADR.
6. Evaluate development and production container architecture.
7. Document the proposed Docker implementation.
8. Establish Draw.io diagram standards.
9. Recreate existing diagrams as editable Draw.io sources.
10. Validate SVG and PDF exports when tooling is available.
11. Establish the diagram documentation index.
12. Update the README and relevant documentation.
13. Update AGENTS.md.
14. Update the development queue and worklog.

Do not interrupt existing work merely because new requirements have been received.

Do not introduce unnecessary dependencies.

Do not implement unrelated features.

Do not publish images, commit, push, deploy, or modify remote resources without explicit authorization.

## 24. Final validation

At the end of the assignment, report:

- Task identifier.
- Task status.
- Created files.
- Modified files.
- Docker architecture decisions.
- ADRs.
- Diagram sources.
- Generated exports.
- Documentation updates.
- Validation results.
- Missing tooling.
- Known limitations.
- Remaining work.
- Updated development queue.

Never claim that Docker builds, container startup, diagram exports, or tests succeeded unless they were actually executed and validated.

Juno must remain reproducible, accessible, well-documented, extensible, secure, and easy to contribute to.

Created by Enzo Ribas.

Developed with AI assistance.

Licensed under MIT.

**Juno — Manage. Engage. Evolve.**
