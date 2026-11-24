# Instructions for AI coding agents

## Start every session

1. Read [STATE](docs/development/STATE.md), [QUEUE](docs/development/QUEUE.md), and the [development protocol](docs/development/PROTOCOL.md). Inspect tracked, staged, and untracked changes. Preserve existing work and reconcile claims with evidence.
2. Read the active task and related requirements, ADRs, security and testing docs. Resume its verified checkpoint. Register each new owner implementation request with a sequential ID, source requirements, dependencies and acceptance criteria. Append it in FIFO order and document any exception or blocker.
3. Work documentation-first. Keep changes traceable to the task. Record significant decisions in ADRs and obtain required human approval. Follow the [Git workflow](docs/development/git-workflow.md). Use task branches, atomic Conventional Commits, scoped staging and focused PRs. Verify the authorized destination. Never push directly to main or merge without human approval.

## Licensing, attribution, and community

- Keep the [MIT License](LICENSE), SPDX identifier `MIT`, and project metadata consistent. Check code, dependency, media, and font provenance and terms for open-source compatibility. Preserve copyright and license notices. See the [licensing decision](docs/architecture/adr/0002-mit-licensing.md).
- Preserve Enzo Ribas's founder credit and legitimate contributor authorship. Use the [source attribution and documentation standard](docs/development/DOCUMENTATION.md). Disclose meaningful AI assistance. Never claim human review or assign authorship or copyright to AI tools. Follow the [AI disclosure](AI_DISCLOSURE.md).
- Keep setup reproducible and maintainable for contributors with different skill levels and independent operators. Document dependencies, service costs and alternatives. See the [community strategy](docs/governance/community.md).
- Preserve the [approved identity](docs/design/brand-identity.md) and source artwork. Use semantic tokens and validated, accessible, tenant-scoped overrides. See [tenant branding](docs/design/tenant-branding.md).

## During implementation

- Review security and privacy implications, including trust boundaries, authorization, secret handling, data lifecycle, and audits. Never expose or commit secrets. Use synthetic data.
- Resolve tenant context on the server and enforce resource and membership scope. Add and run negative isolation tests for affected routes, jobs, storage, exports, caches, integrations, and branding. Read the [tenancy requirements](docs/architecture/tenancy.md).
- Write or update appropriate automated tests, including failure and concurrency cases. Synchronize requirements, design, configuration, API, migration, security and operator documentation with the change. Updated documentation is required for completion.
- Keep source, identifiers, and official technical documentation in English. Use translation keys and locale-aware formatting for English and Brazilian Portuguese. Verify accessibility in affected flows.
- Docker and Compose are mandatory. Design reproducible, independent development and test environments and provider-independent production deployment. Validate infrastructure with the same containers when runnable. See [ADR-0005](docs/architecture/adr/0005-mandatory-containerization.md).
- Maintain editable Draw.io masters and synchronized SVG and PDF exports for significant views. Update diagrams and infrastructure documentation with the affected changes. Preserve official branding and attribution. See the [visual standard](docs/development/visual-documentation.md).
- Keep providers optional and tenant-scoped. Use capability contracts and reviewed adapters, protect credentials, and isolate failures from core behavior. Keep the [provider catalog](docs/integrations/provider-registry.md), security docs and affected diagrams accurate.
- Enforce [architecture boundaries](docs/architecture/overview.md). Treat proposed ADRs and tools as candidates. Apply the [quality gates](docs/testing/README.md) as they become applicable and report actual results.

## Handoff

After meaningful milestones, validation and blockers, checkpoint the task and [STATE](docs/development/STATE.md) and log transitions in [WORKLOG](docs/development/WORKLOG.md). Persist changed files, decisions, security and tenant impact, actual checks and failures, limitations, remaining approvals, queue state, and the next action. Apply the [definition of done](docs/development/DEFINITION_OF_DONE.md) before closing a task.
