# JUNO — Permanent Development Protocol, Documentation Standards and Architecture Proposal

## 1. Instruction precedence

This document supplements all previously approved Juno project instructions.

Preserve all existing approved product requirements, branding decisions, MIT licensing requirements, AI disclosure requirements, and creator attribution.

In case of conflicting development workflow instructions, this document takes precedence.

The project creator and original author is Enzo Ribas.

All official technical documentation, source code identifiers, technical comments, architecture records, and development records must be written in English.

## 2. Persistent development queue

Juno must follow a persistent, sequential, queue-based development methodology.

The development queue must use FIFO (First In, First Out) as its default execution policy.

Every new implementation request from the project owner must become a documented development task.

A new request must not automatically interrupt, replace, abandon, or erase an existing task.

When a new development request is received:

1. Read the current project state.
2. Inspect the persistent development queue.
3. Identify the currently active task.
4. Register the new request as a development task.
5. Assign a unique task identifier.
6. Document the original requirements.
7. Identify dependencies and acceptance criteria.
8. Append the task to the queue.
9. Continue the currently active task when execution is available.
10. Complete its implementation, documentation, testing, and validation.
11. Update the project state.
12. Select the next eligible queued task.

Never silently discard a previously requested task.

Never lose task history when a conversation ends or context is reset.

Do not maintain the development queue exclusively in conversation memory.

The repository is the authoritative source of project state.

Do not claim that work continues in the background when no execution environment is active.

Persist sufficient information to resume development in subsequent sessions.

## 3. Queue execution exceptions

The default execution order is FIFO.

Exceptions are allowed only when justified by:

- Explicit project owner reprioritization.
- Critical security vulnerabilities.
- Data integrity risks.
- Blocking technical dependencies.
- Broken builds preventing further development.
- Critical regression fixes.
- Explicit cancellation or suspension requests.

Every queue reordering must be documented.

Do not execute blocked tasks indefinitely.

Record blockers, attempted resolutions, dependency requirements, and the conditions necessary to resume the task.

When appropriate, proceed with the next eligible independent task while preserving the blocked task.

Never mark a blocked or partially implemented task as completed.

## 4. Persistent development files

Establish the following development management files:

- docs/development/QUEUE.md
- docs/development/STATE.md
- docs/development/WORKLOG.md
- docs/development/DEFINITION_OF_DONE.md
- docs/development/TASK_TEMPLATE.md
- docs/development/tasks/
- docs/development/history/

If machine-readable queue metadata is introduced, designate a single authoritative source and generate human-readable representations from it.

Avoid maintaining conflicting duplicated queue states.

QUEUE.md must describe pending and active work.

STATE.md must describe the current development state and resumption instructions.

WORKLOG.md must preserve meaningful chronological development activity.

Individual task documents must contain detailed task specifications and execution records.

Completed tasks must remain historically accessible.

Never delete historical records merely because a task has been completed.

## 5. Task identifiers and metadata

Use stable sequential task identifiers:

- JUNO-0001
- JUNO-0002
- JUNO-0003

Every task must include:

- Task ID.
- Title.
- Description.
- Original request.
- Request date.
- Requested by.
- Scope.
- Acceptance criteria.
- Current status.
- Queue position.
- Dependencies.
- Blocking conditions.
- Affected modules.
- Related architecture decisions.
- Related documentation.
- Implementation plan.
- Implementation progress.
- Changed files.
- Database changes.
- API changes.
- Security considerations.
- Accessibility considerations.
- Internationalization considerations.
- Tests required.
- Tests executed.
- Validation results.
- Remaining work.
- Completion date, when applicable.

Use actual dates and execution results.

Never fabricate timestamps, completed work, or validation results.

## 6. Task lifecycle

Use the following task states:

- QUEUED
- IN_PROGRESS
- BLOCKED
- IMPLEMENTED
- VALIDATING
- DOCUMENTING
- COMPLETED
- CANCELLED

A task may return to IN_PROGRESS when validation identifies problems.

An implemented task is not necessarily a completed task.

Documentation must be maintained throughout implementation, not postponed exclusively until completion.

Only one primary implementation task should be active by default.

Parallel execution may be considered only when explicitly justified and safe.

Record all significant task state transitions.

## 7. Session recovery protocol

At the beginning of every development session:

1. Read AGENTS.md.
2. Read the current development state.
3. Read the persistent development queue.
4. Inspect the Git working tree.
5. Identify uncommitted changes.
6. Read the active task specification.
7. Read relevant ADRs.
8. Review related module documentation.
9. Identify unfinished implementation work.
10. Identify existing blockers.
11. Resume from the last verified checkpoint.

Never overwrite unexplained local changes.

Preserve human and contributor work.

If the repository state differs from documented state, investigate and reconcile the discrepancy.

Do not blindly trust historical progress records without inspecting relevant implementation evidence.

## 8. Development checkpoints

Persist meaningful checkpoints throughout development.

Update the current task and STATE.md after significant changes, including:

- Architectural decisions.
- Implementation milestones.
- Database migrations.
- Dependency changes.
- Security changes.
- Integration changes.
- Failed validation.
- Successful validation.
- Newly discovered blockers.
- Task completion.

A checkpoint must provide enough information for another developer or AI agent to resume the work.

Do not update documentation for every individual keystroke or trivial edit.

Document every meaningful technical change and preserve implementation traceability.

## 9. Complete technical traceability

Every meaningful code change must be traceable to a documented task, defect, maintenance activity, or approved architectural decision.

Every development task must describe:

- What changed.
- Why it changed.
- How it was implemented.
- Which requirements it satisfies.
- Which alternatives were considered when relevant.
- Which files were affected.
- Which tests were executed.
- Which documentation was updated.
- Which limitations remain.

Significant changes must not exist without corresponding documentation.

Avoid vague statements such as "improved the code" or "fixed some bugs."

Documentation must be specific, actionable, accurate, and maintainable.

## 10. Architecture Decision Records

Every significant architectural or technical decision must be documented using an ADR.

Store ADRs under:

docs/architecture/adr/

Use stable sequential identifiers:

- ADR-0001
- ADR-0002
- ADR-0003

Each ADR must contain:

- Title.
- Status.
- Date.
- Decision owner or approver.
- Actual author or preparer.
- Context.
- Problem statement.
- Decision drivers.
- Requirements.
- Considered alternatives.
- Trade-offs.
- Selected solution.
- Decision rationale.
- Positive consequences.
- Negative consequences.
- Security implications.
- Operational implications.
- Migration considerations.
- Validation strategy.
- Related tasks.
- Related ADRs.
- References.

Use ADR statuses such as:

- Proposed.
- Accepted.
- Rejected.
- Deprecated.
- Superseded.

Never present proposed decisions as approved decisions.

Preserve accepted historical ADRs.

When an architectural decision changes, create a new ADR and reference the superseded decision.

Not every minor code change requires an ADR. Minor changes must remain documented in their associated task and worklog.

## 11. Original creator attribution

Juno was created by Enzo Ribas.

The project must preserve this attribution throughout relevant source files, documentation, project metadata, and official project assets.

Use the following project attribution:

"Juno was created by Enzo Ribas and is developed with the assistance of artificial intelligence."

The official software license is MIT.

Use the following initial copyright notice:

Copyright (c) 2026 Enzo Ribas.

Where appropriate, use SPDX license identifiers.

Every first-party human-maintained source file that supports comments must include a standardized project attribution header.

The preferred conceptual TypeScript header is:

```typescript
/**
 * @fileoverview Meaningful description of the file.
 *
 * @project Juno
 * @author Enzo Ribas (Original Project Creator)
 * @copyright 2026 Enzo Ribas
 * @license MIT
 * @remarks Developed with AI assistance.
 */
```

Adapt the syntax to each programming language and file format.

Configure documentation tooling for custom tags where necessary.

Preserve legitimate contributor attribution and copyright notices.

Do not falsely attribute independently authored contributions to Enzo Ribas.

Do not remove third-party authorship notices.

Do not modify generated files solely to insert attribution headers.

For formats that do not support comments, preserve attribution through associated metadata and documentation.

Do not assign legal authorship to AI tools.

## 12. Source code documentation standards

Juno must follow comprehensive source code documentation standards inspired by:

- Doxygen documentation principles.
- Google Developer Documentation Style Guide.
- Google TypeScript Style Guide.
- TSDoc.
- JSDoc.
- Language-specific documentation conventions.

For TypeScript, prefer TSDoc-compatible documentation and TypeDoc-generated references.

Use Doxygen-compatible documentation directly for languages where it is appropriate.

Do not force unsupported documentation syntax into unrelated languages.

Document:

- Public classes.
- Public interfaces.
- Public functions.
- Public methods.
- Exported types.
- Modules.
- Domain entities.
- Value objects.
- Domain events.
- Application services.
- Repository contracts.
- Integration contracts.
- Complex private implementations.
- Non-obvious algorithms.
- Business invariants.
- Security-sensitive behavior.
- Error conditions.
- Side effects.
- Configuration requirements.

Documentation must explain purpose, behavior, assumptions, constraints, and expected outcomes.

Document parameters, return values, exceptions, examples, and references whenever meaningful.

Avoid redundant comments that merely repeat the code or TypeScript type declarations.

Never generate meaningless documentation solely to satisfy a numerical coverage target.

Target complete meaningful documentation coverage for public interfaces and business-critical behavior.

## 13. Documentation architecture

Maintain comprehensive documentation covering:

- Product vision.
- Functional requirements.
- Non-functional requirements.
- Product roadmap.
- System architecture.
- Architectural decisions.
- Domain models.
- Database schema.
- Data dictionary.
- API contracts.
- Authentication.
- Authorization.
- Multi-tenancy.
- Security.
- Threat modeling.
- Integrations.
- Design system.
- Accessibility.
- Internationalization.
- Testing.
- Deployment.
- Operational procedures.
- Backup and recovery.
- Troubleshooting.
- Contribution guidelines.
- Project governance.
- Development history.
- AI-assisted development disclosure.
- Known limitations.
- Technical debt.

Evaluate Docusaurus as the official documentation website.

Keep version-controlled Markdown documentation as the primary documentation source.

Documentation must be accessible without requiring proprietary office software.

## 14. Documentation diagrams

Use diagrams whenever they materially improve technical understanding.

Evaluate Mermaid and the C4 Model as standard architectural documentation tools.

Maintain appropriate diagrams for:

- System context.
- Containers.
- Components.
- Deployment architecture.
- Database relationships.
- Authentication flows.
- Authorization flows.
- Tenant isolation.
- GitHub integration.
- Domain events.
- Gamification workflows.
- Virtual currency transactions.
- Reward redemption.
- Report submission and approval.
- Challenge validation.

Keep diagram source files version-controlled.

Ensure diagrams represent actual implementation or clearly identified proposals.

Do not document hypothetical features as existing functionality.

## 15. Proposed system architecture

Evaluate the following architectural direction for Juno:

- Modular monolith.
- Pragmatic Clean Architecture.
- Domain-Driven Design.
- Event-driven internal communication.
- Multi-tenant data architecture.
- REST API with OpenAPI.
- Monorepo.
- Independent web frontend.
- Modular backend.
- Optional background worker process.
- Self-hosting support.

The architecture must prioritize maintainability, accessibility, contributor experience, data security, and low operational complexity.

Do not introduce microservices without demonstrated technical requirements.

Do not introduce Kubernetes merely because the project may support multiple organizations.

Do not create unnecessary abstraction layers.

Apply architectural patterns proportionally to domain complexity.

## 16. Proposed technology stack

Evaluate the following initial technology candidates:

- TypeScript.
- React.
- Next.js.
- NestJS.
- PostgreSQL.
- Prisma or Drizzle ORM.
- Tailwind CSS.
- shadcn/ui.
- Zod.
- OpenAPI.
- Swagger.
- TSDoc.
- TypeDoc.
- Docusaurus.
- Mermaid.
- pnpm Workspaces.
- Turborepo.
- Docker.
- Docker Compose.
- GitHub Actions.
- Vitest.
- Playwright.
- Testcontainers.
- OpenTelemetry.
- next-intl.
- S3-compatible object storage.
- PostgreSQL-backed persistent job processing.

Evaluate Redis or Valkey only when supported by actual caching or job-processing requirements.

Compare alternatives before approving each foundational technology.

Evaluate dependency licensing and compatibility with the MIT project license.

Prefer actively maintained technologies with strong documentation and accessible contributor ecosystems.

Do not select arbitrary package versions.

Validate compatibility against authoritative technical documentation before installation.

Record major technology decisions through ADRs.

## 17. Proposed monorepo organization

Evaluate the following workspace boundaries:

### Applications

- apps/web
- apps/api
- apps/worker
- apps/docs

### Shared packages

- packages/ui
- packages/contracts
- packages/database
- packages/config
- packages/logger
- packages/i18n
- packages/design-tokens
- packages/testing

### Supporting directories

- assets/brand
- infrastructure
- docs
- scripts
- .github

Create directories only when they have a meaningful purpose.

Do not generate large amounts of empty architectural scaffolding.

Prevent unnecessary coupling between shared packages and business domains.

Use explicit dependency boundaries.

## 18. Domain boundaries

Evaluate the following bounded contexts:

- Identity and Access Management.
- Tenant Management.
- Organization Management.
- Membership.
- Directorates and Teams.
- Projects.
- Reporting.
- Gamification.
- Challenges.
- Virtual Economy.
- Rewards.
- Learning.
- Integrations.
- Analytics.
- Notifications.
- Branding.
- Audit.

Each complex domain may contain:

- domain/
- application/
- infrastructure/
- presentation/
- tests/

Domain logic must not depend directly on presentation frameworks, external APIs, or database implementations.

Application use cases must coordinate domain behavior.

Infrastructure adapters must implement external system and persistence contracts.

Presentation layers must expose authorized application functionality.

Use simpler structures for domains that do not require full DDD complexity.

## 19. Multi-tenant architecture

Evaluate a shared PostgreSQL database with explicit tenant identification and database-enforced isolation.

Every tenant-owned resource must be associated with an authorized organization.

Consider:

- Tenant-scoped database constraints.
- Tenant-scoped uniqueness.
- Tenant-aware relationships.
- PostgreSQL Row-Level Security.
- Restricted database roles.
- Server-side authorization.
- Tenant-aware caching.
- Tenant-scoped file storage.
- Tenant-aware background jobs.
- Tenant-specific integrations.
- Tenant-specific audit records.
- Tenant-aware analytics.
- Tenant-specific branding.

Do not trust tenant identifiers supplied by clients without validating authorization.

Do not rely exclusively on application-level query filtering.

Ensure database connections and connection pooling cannot leak tenant context.

Prevent ordinary application roles from bypassing database isolation policies.

Document which entities are global and which are tenant-owned.

Create automated tests proving that users cannot access, modify, or infer another tenant's protected resources.

The final tenancy model must be approved through an ADR.

## 20. Gamification architecture

Gamification is a core domain of Juno.

Evaluate a configurable event-driven gamification engine.

Potential domain events include:

- PullRequestMerged.
- CodeReviewValidated.
- CourseCompleted.
- ReportApproved.
- ChallengeValidated.
- AchievementUnlocked.
- ExperienceAwarded.
- CurrencyAwarded.
- RewardRedeemed.

Domain events must represent meaningful business occurrences.

Do not tightly couple integration modules to gamification rules.

The gamification engine must evaluate tenant-specific rules.

Persist sufficient information to explain why rewards were granted.

Consider:

- Idempotency.
- Event deduplication.
- Rule versioning.
- Event ordering where required.
- Historical traceability.
- Transactional consistency.
- Concurrent processing.
- Retry behavior.
- Failed event recovery.
- Manual adjustments.
- Auditability.

Evaluate the Transactional Outbox pattern for reliable persistent event processing.

Do not introduce distributed event infrastructure prematurely.

## 21. Virtual economy architecture

Evaluate an immutable or append-only transaction ledger for virtual currency.

Balances must be derived from or reconciled against authoritative transaction records.

Never modify user balances without a corresponding auditable transaction.

Support atomic reward redemption.

Prevent duplicate rewards and concurrent overspending.

Use database transactions where required.

Document business invariants, transaction semantics, reversal behavior, inventory consistency, and failure recovery.

Experience points and spendable virtual currency must remain conceptually separate unless a different model is explicitly approved.

## 22. Integration architecture

External integrations must be implemented behind explicit contracts and adapters.

Initial integration candidates:

- GitHub.
- GitHub Projects.
- YouTube.
- Microsoft SharePoint.

External integrations must not become direct dependencies of core business rules.

Support mocked or fake adapters for automated testing.

Document:

- Authentication.
- API permissions.
- Credential storage.
- Provider limitations.
- Rate limits.
- Webhook verification.
- Synchronization.
- Retry behavior.
- Idempotency.
- Error handling.
- Integration health.
- Tenant isolation.
- Operational costs.

Never publish private integration credentials or real tenant data.

## 23. Quality gates

Establish automated quality gates for:

- Formatting.
- Linting.
- Type checking.
- Unit tests.
- Integration tests.
- End-to-end tests.
- Documentation validation.
- Documentation generation.
- Public API documentation coverage.
- Broken documentation links.
- License consistency.
- Dependency vulnerabilities.
- Secret detection.
- Architectural dependency boundaries.
- Database migration validation.
- Tenant isolation.
- Authorization.

Introduce quality gates incrementally as the implementation becomes available.

Do not configure CI workflows that cannot execute against the current repository.

Never suppress failing checks without documenting the reason and receiving appropriate approval.

## 24. Definition of done

A task may be marked COMPLETED only when:

- All mandatory acceptance criteria are satisfied.
- Implementation is complete.
- Relevant source code is documented.
- Relevant technical documentation is updated.
- Architectural decisions are recorded when required.
- Required tests are implemented.
- Required tests have been executed successfully.
- Security implications are reviewed.
- Tenant isolation is validated where applicable.
- Accessibility is evaluated where applicable.
- Internationalization is evaluated where applicable.
- Known limitations are documented.
- Task records are updated.
- Development state is updated.
- Changelog is updated when appropriate.
- No unexplained critical failures remain.

If mandatory validation cannot be performed, retain an appropriate incomplete or blocked status.

Never claim completion based solely on generated code.

## 25. End-of-session protocol

Before ending an execution session, persist:

- Current task.
- Current task status.
- Completed work.
- Remaining work.
- Changed files.
- Architecture decisions.
- Documentation updates.
- Test results.
- Known failures.
- Unresolved questions.
- Next execution step.
- Queue state.
- Repository state considerations.

Ensure subsequent sessions can resume without relying on conversation history.

Do not claim that future work will occur automatically unless an actual execution mechanism supports it.

## 26. Permanent AGENTS.md integration

Update the root AGENTS.md with concise mandatory rules covering:

- Persistent FIFO development.
- Task registration.
- Session recovery.
- Development checkpoints.
- Documentation standards.
- Creator attribution.
- Contributor attribution.
- AI-assisted development disclosure.
- MIT licensing.
- Architecture boundaries.
- Security.
- Tenant isolation.
- Testing.
- Definition of done.
- Quality gates.
- Repository integrity.

Link to detailed version-controlled documentation instead of unnecessarily duplicating entire documents.

Every future AI coding agent must follow this protocol.

## 27. Immediate assignment

Treat this instruction as a development request and register it in the persistent queue.

Inspect the current repository before changing files.

If another task is active, preserve its current state and do not silently abandon it.

Queue the development protocol and architecture evaluation work according to existing dependencies and priorities.

The requested deliverables are:

1. Establish the persistent development queue.
2. Establish task identifiers and task templates.
3. Establish session recovery instructions.
4. Establish the development worklog.
5. Establish the definition of done.
6. Establish comprehensive documentation standards.
7. Establish source code attribution standards.
8. Establish ADR conventions.
9. Evaluate the proposed architecture.
10. Evaluate the proposed technology stack.
11. Create initial proposed architecture diagrams.
12. Establish architectural decision candidates.
13. Update AGENTS.md.
14. Review documentation consistency.
15. Document remaining decisions requiring approval.

Do not automatically approve the entire proposed technology stack.

Do not scaffold the full application before foundational architectural decisions are reviewed.

Do not perform unrelated work.

Do not commit, push, publish, deploy, or modify external resources without explicit authorization.

## 28. Execution report

At the end of the current execution, report:

- Current task ID.
- Current task status.
- Completed work.
- Files created.
- Files modified.
- Documentation created.
- ADRs created or updated.
- Validation executed.
- Validation failures.
- Unresolved decisions.
- Remaining work.
- Current queue.
- Next eligible task.

Persist this information in the repository.

The repository must remain the authoritative source of truth.

The development of Juno must be continuous across sessions, traceable, well-documented, technically consistent, and transparent.

Juno must remain a professional MIT-licensed open-source project.

Created by Enzo Ribas.

Developed with AI assistance.

Built for Junior Enterprises.

**Juno — Manage. Engage. Evolve.**
