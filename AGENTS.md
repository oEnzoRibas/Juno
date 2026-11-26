# Instructions for AI coding agents

## Start every session

1. Read [STATE](docs/development/STATE.md), [QUEUE](docs/development/QUEUE.md), and the [development protocol](docs/development/PROTOCOL.md). Inspect tracked, staged, and untracked changes. Preserve existing work and reconcile claims with evidence.
2. Read the active task and related requirements, ADRs, security and testing docs. Resume its verified checkpoint. Register each new owner implementation request with a sequential ID, source requirements, dependencies and acceptance criteria. Append it in FIFO order and document any exception or blocker.
3. Work documentation-first. Keep changes traceable to the task. Record significant decisions in ADRs and obtain required human approval. Follow the [Git workflow](docs/development/git-workflow.md). Use task branches, atomic Conventional Commits, scoped staging and focused PRs. Target main for independent work. Use native stacks for genuine dependencies where available, and mark locally validated work ready even while merge dependencies are open. Verify the authorized destination. Never push directly to main or merge without human approval.

## Worktree hygiene

Fetch the remote and keep the primary worktree on `main` fast-forwarded to `origin/main`. Preserve unpublished changes before updating it. When leaving a task worktree, verify that its commits are on the authorized remote and remove the local worktree once no unpublished changes remain. After a task PR merges, verify its published tip and open dependents before deleting its remote branch. Preserve shared branches. Keep `staging` available for reviewed pre-release integration. See the [Git workflow](docs/development/git-workflow.md).

## Licensing, attribution, and community

- Keep the [MIT License](LICENSE), SPDX identifier `MIT`, and project metadata consistent. Check code, dependency, media, and font provenance and terms for open-source compatibility. Preserve copyright and license notices. See the [licensing decision](docs/architecture/adr/0002-mit-licensing.md).
- Preserve Enzo Ribas's founder credit and legitimate contributor authorship. Use the [source attribution and documentation standard](docs/development/DOCUMENTATION.md). Disclose meaningful AI assistance. Never claim human review or assign authorship or copyright to AI tools. Follow the [AI disclosure](AI_DISCLOSURE.md).
- Keep setup reproducible and maintainable for contributors with different skill levels and independent operators. Document dependencies, service costs and alternatives. See the [community strategy](docs/governance/community.md).
- Preserve the [approved identity](docs/design/brand-identity.md) and source artwork. Use semantic tokens and validated, accessible, tenant-scoped overrides. See [tenant branding](docs/design/tenant-branding.md).

## Coordination and task ownership

For owner-authorized parallel work, read the [agent protocol](docs/development/agents/PROTOCOL.md) and verify the current [assignment registry](docs/development/agents/ASSIGNMENTS.md). Only Agent 01 controls IDs, assignments and the central queue. Use one isolated worktree per agent, honor reserved paths, and publish handoffs before changing a shared contract.

## During implementation

- For frontend changes, follow the [approved Design System V2](docs/design/design-system-v2-implementation.md). Reuse shared components and tokens, and verify responsive, accessible, localized states before presenting a change.

- Review security and privacy implications, including trust boundaries, authorization, secret handling, data lifecycle, and audits. Never expose or commit secrets. Use synthetic data.
- Resolve tenant context on the server and enforce resource and membership scope. Add and run negative isolation tests for affected routes, jobs, storage, exports, caches, integrations, and branding. Read the [tenancy requirements](docs/architecture/tenancy.md).
- Write or update appropriate automated tests, including failure and concurrency cases. Synchronize requirements, design, configuration, API, migration, security and operator documentation with the change. Updated documentation is required for completion.
- Keep source, identifiers, and official technical documentation in English. Use translation keys and locale-aware formatting for English and Brazilian Portuguese. Verify accessibility in affected flows.
- Docker and Compose are mandatory. Design reproducible, independent development and test environments and provider-independent production deployment. Validate infrastructure with the same containers when runnable. See [ADR-0005](docs/architecture/adr/0005-mandatory-containerization.md).
- Maintain editable Draw.io masters, synchronized SVG and PDF exports, and Markdown companions for significant views. Record their status, source attribution, task and ADR links. Update diagrams and infrastructure documentation with the affected changes. Preserve official branding and attribution. See the [visual standard](docs/development/visual-documentation.md). Use the [approved Integration Hub interface mockup](docs/design/mockups/juno-integration-hub-ui.md) as a quality benchmark for future mockups. Use the [approved Integration Hub architecture reference](docs/architecture/diagrams/integrations/juno-integration-hub-architecture.md) as a benchmark for diagrams.
- Keep providers optional and tenant-scoped. Use capability contracts and reviewed adapters, protect credentials, and isolate failures from core behavior. Keep the [provider catalog](docs/integrations/provider-registry.md), security docs and affected diagrams accurate.
- Enforce [architecture boundaries](docs/architecture/overview.md). Treat proposed ADRs and tools as candidates. Apply the [quality gates](docs/testing/README.md) as they become applicable and report actual results.

## Handoff

After meaningful milestones, validation and blockers, checkpoint the task and [STATE](docs/development/STATE.md) and log transitions in [WORKLOG](docs/development/WORKLOG.md). Persist changed files, decisions, security and tenant impact, actual checks and failures, limitations, remaining approvals, queue state, and the next action. Apply the [definition of done](docs/development/DEFINITION_OF_DONE.md) before closing a task.


## Pull request readiness

Complete the [maintainer review standard](docs/development/git-workflow.md#maintainer-review-standard) and the [PR template](.github/pull_request_template.md) before requesting review. Human and AI contributors follow the same requirements. Prioritize reproducible evidence on exact commits, declare open gates, and keep coordinated UAT snapshots pinned.


## Issue linkage and labels

Before creating an implementation branch, verify the registered task, issue, acceptance criteria and owner with Agent 01. Apply the shared labels and include the issue in the pull request. Follow the [issue and PR traceability workflow](docs/development/git-workflow.md#issue-and-pr-traceability). Keep review state and CI evidence current, and update an issue's disposition only after its verified closure criteria are satisfied.
