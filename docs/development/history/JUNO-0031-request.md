# JUNO — Stack Maintenance and Phase 1 Implementation Authorization

## 1. Context

Continue development from the current persistent project state.

Preserve all previously approved Juno requirements, including MIT licensing, Enzo Ribas creator attribution, AI-assisted development disclosure, comprehensive English documentation, FIFO task execution, mandatory Docker containerization, atomic commits, focused pull requests, and native GitHub stacks.

The latest execution report identifies:

- Native GitHub stack #14.
- PR #1 already merged.
- PR #12 as the only remaining draft.
- Seventeen open pull requests.
- Sixteen editable Draw.io masters.
- Fourteen Phase 1 foundation tasks.
- Six blocked provider integration tasks.
- JUNO-0017 as the next architectural approval gate.

Verify the actual repository state before proceeding.

## 2. Repair PR #12

Investigate the ancestry and comparison issue affecting PR #12.

The reported GitHub review diff contains 156 files, while the direct branch comparison identifies 22 files and two unique Integration Hub commits.

Determine the root cause before modifying history.

Evaluate the native GitHub stack maintenance capabilities and the available GitHub CLI tooling.

Preserve:

- Existing pull request numbers.
- Review history.
- Existing contributor work.
- Logical commit boundaries.
- Stack dependencies.
- Legitimate authorship.
- The main branch.

The project owner authorizes controlled rebasing of Juno task branches when necessary to maintain the existing pull request stack.

A force-with-lease push is permitted only when:

- The affected branch is a Juno development branch.
- The current remote commit has been explicitly verified.
- A recoverable reference to the previous branch head exists.
- No unrelated contributor changes will be lost.
- The operation is necessary to repair or maintain the stack.
- The resulting incremental diff has been validated.
- The operation and its rationale are documented.

Never use unrestricted force-push.

Never rewrite main.

Never delete unrelated commits.

Never merge without explicit human approval.

After repairing PR #12, validate its incremental diff and all affected descendants.

Convert PR #12 to Ready for review if all readiness requirements are satisfied.

If the repair cannot be performed safely, document the blocker and preserve the existing branches.

## 3. Stack organization

Continue using native GitHub stacked pull requests.

Do not keep completed pull requests in draft solely because dependencies remain open.

Maintain genuine dependency relationships.

Do not unnecessarily extend a single global stack when independent changes can safely target main.

Keep licensing, governance, design, architecture, infrastructure, and application changes logically separated.

Preserve atomic commits.

Use Rebase and merge as the preferred merge strategy when supported and compatible with the native stack workflow.

Document this decision through an ADR.

Human approval remains mandatory for merges.

## 4. Approved architectural direction

The project owner approves the following architectural direction:

- Modular monolith.
- Pragmatic Clean Architecture.
- Domain-Driven Design proportional to domain complexity.
- TypeScript monorepo.
- Independent frontend and backend applications.
- PostgreSQL persistence.
- REST API with OpenAPI.
- Tenant-aware authorization.
- Database-level tenant isolation.
- Internal domain events.
- Persistent asynchronous jobs where necessary.
- Optional integration adapters.
- Mandatory Docker and Docker Compose.
- Provider-independent self-hosting.

Avoid microservices and Kubernetes during the initial implementation unless a demonstrated requirement justifies them.

## 5. Approved technology direction

Use the following initial technology stack:

### Frontend

- TypeScript.
- React.
- Next.js.
- Tailwind CSS.
- shadcn/ui.
- next-intl.

### Backend

- TypeScript.
- NestJS.
- PostgreSQL.
- Drizzle ORM.
- REST.
- OpenAPI.

### Workspace

- pnpm Workspaces.
- Turborepo.

### Infrastructure

- Docker.
- Docker Compose.

### Testing

- Vitest.
- Playwright.
- Testcontainers.

### Documentation

- Markdown.
- TSDoc.
- TypeDoc.
- Docusaurus.
- Draw.io.
- Architecture Decision Records.

Validate compatibility, maintenance status, supported versions, dependency licensing, and operational requirements before installing dependencies.

Document the selected versions and technical rationale.

If a material incompatibility or security issue is discovered, document alternatives rather than blindly implementing an unsuitable technology.

## 6. Approve the first vertical workflow

The first functional milestone must be a secure, runnable, end-to-end tenant onboarding workflow.

The target workflow is:

1. Start Juno using Docker Compose.
2. Access the platform administration interface.
3. Provision a Junior Enterprise tenant.
4. Configure its initial branding.
5. Invite its first administrator or member.
6. Activate the invited account securely.
7. Authenticate.
8. Establish the authorized tenant context.
9. Validate role-based permissions.
10. Access the initial organization dashboard.
11. Verify that another tenant's protected resources cannot be accessed.

Use synthetic development data.

Do not implement unrelated business modules before the foundational requirements are satisfied.

## 7. Development continuity

Update the JUNO-0017 task with these architectural approvals.

Update the applicable ADRs and their statuses.

Do not mark unrelated proposed decisions as accepted.

Continue to the next eligible Phase 1 tasks according to the persistent dependency-aware FIFO queue.

Do not stop after creating another planning document.

Begin actual application implementation once the relevant architectural prerequisites are satisfied.

Preserve the six original integration tasks and their identifiers.

## 8. First implementation sequence

Implement incrementally:

1. Monorepo foundation.
2. Application workspace configuration.
3. Frontend and backend foundations.
4. Docker development environment.
5. PostgreSQL and database migrations.
6. Health checks.
7. Automated quality gates.
8. Authentication foundation.
9. Tenant isolation.
10. Authorization.
11. Initial design system.
12. Tenant provisioning.
13. Member invitations.
14. Organization dashboard.

Adjust task boundaries according to actual dependencies.

Create independently reviewable pull requests.

Do not combine the entire Phase 1 into a single pull request.

## 9. Mandatory validation

Every executable application milestone must include appropriate validation.

Prioritize:

- Reproducible Docker builds.
- Docker Compose configuration validation.
- Container startup.
- Database connectivity.
- Database migration execution.
- Health endpoints.
- Type checking.
- Linting.
- Automated tests.
- Tenant isolation tests.
- Secret detection.
- Documentation consistency.

Establish GitHub Actions incrementally.

The absence of CI runs must not be represented as successful CI validation.

Never fabricate test results.

## 10. Documentation and visual architecture

Continue maintaining:

- AGENTS.md.
- Persistent development queue.
- Worklog.
- Task records.
- ADRs.
- API documentation.
- Database documentation.
- Security documentation.
- Editable Draw.io diagrams.
- Synchronized SVG and PDF exports.
- Design system documentation.

Update architecture diagrams as actual components become implemented.

Clearly distinguish proposed architecture from implemented architecture.

Preserve the approved Integration Hub mockup and its visual identity.

All documentation, source comments, commit messages, and pull request descriptions must remain in English.

## 11. Git and publication

Continue creating atomic commits and focused pull requests throughout implementation.

Use native GitHub stacks for genuine dependencies.

Mark locally validated, reviewable work as Ready for review.

Maintain accurate task references, commit hashes, pull request URLs, validation records, and dependency relationships.

Do not merge without human approval.

Do not stop development merely because independent pull requests await review.

## 12. Expected outcome

The next meaningful milestone is not another extensive planning phase.

It is the first runnable Juno application with a reproducible Docker environment and a secure tenant onboarding foundation.

Document everything, but ensure that documentation supports implementation rather than replacing it.

At the end of each execution session, persist the current task, completed work, commits, pull requests, validation results, blockers, and next eligible task.

Created by Enzo Ribas.

Developed with AI assistance.

Licensed under MIT.

**Juno — Manage. Engage. Evolve.**
