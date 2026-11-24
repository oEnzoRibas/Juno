# JUNO — Permanent Git, Commit, Branch and Pull Request Protocol

## 1. Instruction precedence and authorization

This document supplements all previously approved Juno development instructions.

Preserve all existing requirements concerning:

- MIT licensing.
- Original creator attribution to Enzo Ribas.
- AI-assisted development transparency.
- Persistent FIFO development.
- Documentation-first engineering.
- Architectural Decision Records.
- Docker containerization.
- Multi-tenant architecture.
- Official brand identity.
- Draw.io architectural diagrams.
- Automated testing.
- Open-source contribution standards.

This instruction explicitly supersedes previous restrictions against creating Git commits, branches, remote branches, and pull requests.

The project owner authorizes the coding agent to perform these operations as part of the standard development workflow.

The agent is authorized to:

- Create task-specific branches.
- Stage relevant files.
- Create atomic Git commits.
- Push task-specific branches to the authorized Juno repository.
- Open draft pull requests.
- Open ready-for-review pull requests.
- Update existing pull requests.
- Respond to validation failures.
- Add documented corrections to existing branches.

This authorization does not include:

- Direct pushes to main.
- Merging pull requests without human approval.
- Force-pushing shared branches.
- Rewriting published Git history.
- Deleting remote branches without authorization.
- Creating releases without authorization.
- Publishing production deployments.
- Modifying repository visibility.
- Modifying access permissions.
- Bypassing branch protection rules.
- Publishing secrets or private information.

Verify the authorized repository and remote destination before pushing.

Never publish project files to an unrelated repository.

## 2. Permanent development workflow

Every development task must follow a structured Git workflow.

The standard sequence is:

1. Inspect the repository.
2. Read AGENTS.md.
3. Read the persistent development queue.
4. Identify the active task.
5. Review related requirements and ADRs.
6. Inspect existing branches and pull requests.
7. Identify the appropriate base branch.
8. Create or resume a task-specific branch.
9. Implement the task.
10. Update relevant documentation.
11. Create atomic commits.
12. Execute required validation.
13. Push the branch.
14. Create or update its pull request.
15. Record the pull request in the development queue.
16. Address automated validation failures.
17. Mark the pull request as ready for human review when appropriate.
18. Preserve the task state and continue with the next eligible independent task.

Never silently abandon an active task because a new development request was received.

New requests must be registered in the persistent FIFO queue.

Tasks that depend on unmerged work must remain blocked or use explicitly documented stacked pull requests.

Independent tasks may proceed while previous pull requests await human review.

Do not merge pull requests merely to unblock subsequent work without authorization.

## 3. Repository inspection

Before creating branches or commits, inspect:

- Current branch.
- Git working tree.
- Staged changes.
- Unstaged changes.
- Untracked files.
- Existing commit history.
- Configured remotes.
- Open pull requests, when accessible.
- Existing branch protection requirements.
- Current task records.
- Existing documentation.
- Related architecture decisions.

Do not assume the repository is empty.

Do not overwrite or discard existing human work.

Do not delete unrelated files.

Do not use destructive Git commands to obtain a clean working tree.

If unrelated changes exist, preserve them and isolate the intended task safely.

## 4. Separation of responsibilities

Every pull request must have a single primary responsibility.

Do not combine unrelated changes merely because they were developed during the same session.

Separate work into coherent reviewable units.

Licensing changes must not be mixed with application implementation.

Brand identity changes must not be mixed with unrelated backend functionality.

Architectural decisions must not be mixed with unrelated design assets.

Infrastructure changes must not be mixed with unrelated product functionality.

Documentation changes must not become a dumping ground for unrelated modifications.

Database migrations must be associated with their corresponding functional or architectural scope.

Refactoring must not be mixed with unrelated feature implementation.

Dependency updates must have a clear purpose.

Related implementation, tests, configuration, and documentation may belong to the same pull request when required to deliver a coherent and independently reviewable change.

Separation must be based on logical responsibility, not exclusively on filesystem boundaries.

## 5. Pull request categories

Use the following conceptual pull request categories:

### Licensing

- MIT license.
- Copyright attribution.
- License compliance.
- Third-party notices.

### Governance

- Contribution guidelines.
- Code of conduct.
- Maintainer responsibilities.
- Community participation.
- Security reporting.

### AI transparency

- AI disclosure.
- Human review requirements.
- AI-assisted contribution policies.

### Development methodology

- AGENTS.md.
- Persistent development queue.
- Task templates.
- Development worklogs.
- Definition of done.

### Product documentation

- Product vision.
- Functional requirements.
- Non-functional requirements.
- Roadmap.
- Business rules.

### Architecture

- Architecture proposals.
- Accepted ADRs.
- Domain boundaries.
- Multi-tenancy.
- Integration strategies.
- Technical decisions.

### Brand identity

- Official Juno logos.
- Wordmarks.
- Standalone symbols.
- SVG assets.
- PDF assets.
- PNG assets.
- Brand guidelines.

### Design system

- Color tokens.
- Typography.
- Components.
- Accessibility.
- Tenant-specific theming.

### Visual architecture documentation

- Draw.io diagrams.
- SVG exports.
- PDF exports.
- Architecture diagram indexes.

### Infrastructure

- Dockerfiles.
- Docker Compose.
- Networking.
- Persistent storage.
- Deployment configuration.

### CI/CD

- GitHub Actions.
- Automated quality checks.
- Container validation.
- Security scanning.

### Application development

- Frontend.
- Backend.
- Database.
- Domain functionality.
- Integrations.
- Automated tests.

These categories establish separation guidelines, not rigid organizational restrictions.

## 6. Initial repository organization

Inspect all currently available changes and classify them before committing.

Prepare separate pull requests for the existing foundational work whenever the repository state allows it.

Suggested initial pull requests:

1. Establish MIT licensing and copyright attribution.
2. Establish open-source governance and contribution guidelines.
3. Establish AI-assisted development disclosure.
4. Establish the persistent FIFO development protocol.
5. Document the product vision and requirements.
6. Document the proposed system architecture.
7. Establish the official Juno brand assets.
8. Establish the visual design system.
9. Establish architectural diagrams and Draw.io standards.
10. Establish mandatory Docker containerization.
11. Establish GitHub Actions and quality gates.
12. Establish the application foundation.

Do not create empty or artificial pull requests.

Do not duplicate work already committed or merged.

If existing published commits contain mixed responsibilities, do not rewrite their history without authorization.

Document the situation and apply the new protocol to future work.

## 7. Branch naming convention

Use descriptive branch names.

Preferred format:

`<category>/<task-id>-<short-description>`

Examples:

- docs/juno-0001-mit-license
- docs/juno-0002-project-governance
- docs/juno-0003-ai-disclosure
- docs/juno-0004-development-protocol
- docs/juno-0005-system-architecture
- design/juno-0006-brand-identity
- design/juno-0007-centered-symbol
- infra/juno-0008-docker-foundation
- ci/juno-0009-quality-gates
- feat/juno-0010-authentication
- fix/juno-0011-tenant-isolation
- refactor/juno-0012-gamification-engine

Use actual task identifiers from the persistent development queue.

Never invent identifiers that conflict with existing tasks.

Use lowercase names and hyphen-separated words.

Avoid generic branch names such as:

- changes
- update
- test
- final
- new-version
- development-stuff

Use one primary task branch per coherent pull request.

## 8. Conventional Commits

All Git commit messages must follow Conventional Commits.

Standard format:

`<type>(<scope>): <description>`

Use English for all commit messages.

Supported commit types include:

- feat
- fix
- docs
- style
- refactor
- perf
- test
- build
- ci
- chore
- revert

The project may additionally define `design` as a documented project-specific commit type, provided that the commit validation and release tooling explicitly support it.

Use meaningful scopes, such as:

- license
- governance
- architecture
- brand
- design-system
- docker
- database
- auth
- tenancy
- members
- projects
- gamification
- rewards
- learning
- github
- sharepoint
- security

Use clear, imperative descriptions.

Examples:

```text
docs(license): establish MIT licensing policy
docs(governance): define contributor responsibilities
docs(ai): document AI-assisted development practices
docs(architecture): propose modular monolith architecture
docs(architecture): record tenant isolation strategy
design(brand): add official Juno vector logo assets
fix(brand): center standalone Juno symbol variants
build(docker): configure development containers
ci(github): introduce automated quality checks
feat(auth): implement member authentication
test(tenancy): verify cross-tenant access restrictions
```

Never use vague messages such as:

```text
update
changes
fix
stuff
final version
working now
miscellaneous changes
```

## 9. Atomic commit policy

Every commit must represent one logical change.

Commits should be independently understandable and, whenever practical, leave the repository in a consistent state.

Do not create one enormous commit containing unrelated modifications.

Do not create meaningless individual commits merely to increase commit counts.

Group files by technical responsibility and logical intent.

A feature pull request may contain commits for:

- Domain implementation.
- Persistence implementation.
- API implementation.
- Frontend integration.
- Automated tests.
- Technical documentation.
- Related ADRs.

However, do not intentionally leave insecure or inconsistent intermediate states when combining related changes would produce a safer atomic commit.

Before every commit:

1. Review the relevant diff.
2. Confirm the intended scope.
3. Check for unrelated changes.
4. Check for secrets.
5. Check attribution requirements.
6. Check documentation consistency.
7. Stage only relevant files.
8. Create the commit.
9. Verify the resulting commit.

Avoid indiscriminate staging through `git add .` or `git add -A`.

Use explicit file paths or carefully reviewed staging operations.

Never commit temporary files, local credentials, generated dependency directories, private configuration, or irrelevant artifacts.

## 10. Commit traceability

Every meaningful commit must be traceable to a development task.

Use commit message bodies or footers when additional context is required.

Example:

```text
docs(architecture): document multi-tenant isolation

Describe the proposed tenant-aware database architecture,
authorization boundaries, and validation requirements.

Task: JUNO-0005
Related-ADR: ADR-0009
AI-Assisted: Yes
```

Use actual task and ADR identifiers.

Do not reference nonexistent records.

For breaking changes, use the appropriate Conventional Commits breaking-change notation.

Do not falsely claim that a proposed decision has been accepted.

## 11. Git authorship and attribution

Enzo Ribas is the original creator and project founder of Juno.

Preserve creator attribution in:

- README.md.
- AUTHORS.md.
- LICENSE.
- Source code attribution headers.
- Architecture documentation.
- Design documentation.
- Official diagrams.
- Project metadata.
- Relevant release documentation.

Use the authorized Git identity configured in the development environment.

Do not invent an email address or impersonate Enzo Ribas or other contributors.

Do not overwrite global Git identity settings without explicit authorization.

Do not rewrite commit authorship to manufacture contributions.

Preserve legitimate human and third-party attribution.

Record AI assistance transparently in development records and pull requests.

Use the approved project attribution:

"Juno was created by Enzo Ribas and is developed with the assistance of artificial intelligence."

The official software license remains MIT.

## 12. Pull request size and scope

Pull requests must remain reasonably sized and reviewable.

Prefer focused pull requests over large batches of unrelated work.

When a task becomes too large:

- Identify independent implementation boundaries.
- Split the task into documented subtasks.
- Register dependencies.
- Create focused branches and pull requests.
- Preserve traceability to the parent task.

Do not split tightly coupled changes in a manner that creates broken intermediate states.

Do not use arbitrary file counts or line counts as the only measure of pull request quality.

The primary objective is meaningful, safe, understandable review.

## 13. Pull request titles

Use concise Conventional Commit-style pull request titles.

Examples:

- docs(license): establish MIT licensing
- docs(governance): establish open-source contribution policy
- docs(architecture): document Juno system architecture
- design(brand): introduce official Juno brand assets
- fix(brand): correct standalone symbol alignment
- build(docker): establish containerized development
- ci(github): establish automated quality gates
- feat(gamification): implement experience scoring

Use English exclusively.

Ensure pull request titles describe their actual scope.

## 14. Mandatory pull request template

Create or update:

`.github/pull_request_template.md`

Every pull request must include the following sections:

### Summary

Explain the purpose of the pull request.

### Motivation

Explain why the change is necessary.

### Development task

Identify the associated JUNO task.

### Scope

Describe included and excluded responsibilities.

### Changes introduced

List meaningful implementation changes.

### Files and modules affected

Identify the relevant directories, files, and business domains.

### Architectural decisions

Reference related ADRs and describe architectural implications.

### Documentation

Identify created or updated documentation.

### Database changes

Describe schema changes, migrations, and rollback considerations.

### API changes

Describe new or modified contracts.

### Security considerations

Describe security implications and authorization requirements.

### Multi-tenancy

Describe tenant isolation considerations.

### Accessibility and internationalization

Describe relevant validation and limitations.

### Testing

Describe tests added and executed.

### Validation results

Report actual execution results.

### Visual evidence

Include relevant screenshots or diagram references when applicable.

### Dependencies

Identify dependent tasks, branches, and pull requests.

### Breaking changes

Identify compatibility implications.

### Known limitations

Disclose unresolved issues and incomplete behavior.

### AI-assisted development

Describe relevant AI involvement and human review status.

### Review checklist

Include the applicable definition-of-done requirements.

Do not fabricate validation results.

Sections that do not apply may be explicitly marked as not applicable.

## 15. Draft pull requests

Use draft pull requests for unfinished work when a meaningful checkpoint exists.

A draft pull request may represent:

- Work in progress.
- Architecture proposals.
- Incomplete implementations.
- Pending validation.
- Pending architectural approval.
- Pending dependencies.
- Partial documentation.

Draft pull requests must clearly disclose their current limitations.

Do not mark unfinished work as ready for review.

Do not create draft pull requests for empty branches.

Update existing draft pull requests rather than creating duplicates.

## 16. Ready-for-review pull requests

A pull request may be marked ready for review when:

- Its scope is implemented.
- Required documentation is updated.
- Relevant ADRs are recorded.
- Required tests have been executed successfully.
- Known limitations are documented.
- Security implications are evaluated.
- Tenant isolation requirements are validated where applicable.
- The branch contains only relevant changes.
- Required local quality gates have passed.
- No unexplained critical failures remain.

The pull request must accurately reflect its review status.

Human approval remains a separate requirement.

## 17. Persistent queue integration

Extend the existing FIFO development protocol to track Git and pull request lifecycle information.

Use appropriate task states, including:

- QUEUED
- IN_PROGRESS
- BLOCKED
- IMPLEMENTED
- VALIDATING
- DOCUMENTING
- PR_DRAFT
- AWAITING_REVIEW
- CHANGES_REQUESTED
- APPROVED
- MERGED
- COMPLETED
- CANCELLED

Reconcile these states with the existing task lifecycle instead of creating incompatible duplicate systems.

Every task record must include, when applicable:

- Branch name.
- Base branch.
- Commit references.
- Pull request number.
- Pull request URL.
- Pull request status.
- Review status.
- CI status.
- Dependencies.
- Merge status.
- Remaining work.

A task with an open pull request is not equivalent to a merged task.

Independent queued tasks may continue while previous pull requests await human approval.

Dependent tasks must remain blocked unless a documented stacked pull request strategy is used.

## 18. Stacked pull requests

When a task depends on unmerged work, evaluate whether it should remain blocked or use stacked pull requests.

A stacked pull request must:

- Identify its dependency.
- Use the correct base branch.
- Contain only its own incremental changes.
- Document the dependency relationship.
- Avoid unrelated commits.
- Be retargeted appropriately after its parent is merged.

Never create hidden dependencies between branches.

Do not duplicate parent changes in child pull requests.

Prefer independent pull requests whenever practical.

## 19. Documentation separation

Maintain the established repository organization.

Use the appropriate directories:

```text
assets/brand/
docs/design/
docs/architecture/
docs/architecture/adr/
docs/architecture/diagrams/
docs/development/
docs/product/
docs/security/
docs/integrations/
docs/governance/
docs/deployment/
infrastructure/
.github/
apps/
packages/
```

Do not place architecture documentation inside brand asset directories.

Do not place governance documents inside application modules.

Do not mix unrelated design and infrastructure changes.

Preserve local module documentation near its implementation when appropriate.

Update documentation indexes and cross-references.

Related documentation and implementation must remain synchronized.

## 20. Architecture Decision Record workflow

Significant architectural decisions must be documented through ADRs.

Architecture proposals must be marked Proposed until explicitly accepted.

Accepted ADRs must identify the approval authority.

When feasible, architectural decisions should be reviewed before dependent implementation begins.

Do not use a merged documentation pull request alone as proof that every proposed architectural decision was explicitly accepted.

Preserve historical decisions.

When replacing an ADR, create a new record and reference the superseded decision.

Associate ADR changes with the relevant task and pull request.

## 21. Official brand asset workflow

The approved Juno brand identity must be preserved.

Organize existing assets under:

`assets/brand/logos/`

Maintain the official full logo, standalone symbol, and wordmark variants.

Preserve available formats:

- SVG.
- PDF.
- PNG.

Use the corrected, centered standalone Juno symbol assets when provided.

The corrected symbol assets must supersede the earlier misaligned variants.

Do not redesign the approved symbol.

Do not combine brand asset corrections with unrelated architectural or application changes.

Validate:

- Canvas dimensions.
- Horizontal alignment.
- Vertical alignment.
- Color consistency.
- Transparency.
- Vector rendering.
- PNG resolution.
- Filename consistency.

Document the replacement of outdated assets.

Use a dedicated brand identity or brand correction pull request.

## 22. Visual architecture documentation workflow

Store architectural diagrams under:

`docs/architecture/diagrams/`

Preserve matching formats:

- Editable .drawio source.
- SVG export.
- PDF export.

Diagrams must follow the approved icon-driven, AWS-inspired visual style.

Preserve appropriate creator attribution and AI disclosure.

Keep diagram exports synchronized with editable sources.

Do not mix unrelated logo modifications into architectural diagram pull requests.

Do not claim proposed architecture is already implemented.

Associate diagrams with relevant architecture documents and ADRs.

## 23. Docker and infrastructure workflow

Docker containerization remains mandatory.

Create focused infrastructure pull requests for:

- Development containerization.
- Production container configuration.
- Docker Compose.
- Persistent storage.
- Container security.
- Deployment documentation.

Infrastructure implementation must include relevant validation and documentation within its scope.

Do not separate required configuration or documentation in a manner that renders the infrastructure change unusable.

Do not introduce unrelated application features into infrastructure pull requests.

## 24. Branch protection and main branch policy

The main branch must represent reviewed, stable project history.

Never commit directly to main as part of normal development.

Never push directly to main.

Never bypass required checks.

Recommend repository protection rules requiring:

- Pull requests before merging.
- Required status checks.
- Resolution of review conversations.
- Protection against force pushes.
- Protection against unauthorized branch deletion.

Evaluate CODEOWNERS for future ownership and review responsibilities.

Do not create invalid CODEOWNERS entries or invent GitHub usernames.

Configure remote repository protection settings only when explicitly authorized.

## 25. Merge strategy

Recommend squash merging as the default strategy for ordinary focused pull requests, subject to the project owner's approval.

Preserve the review history and detailed commit history within the pull request.

Use a different merge strategy when preserving individual commits in main is important and explicitly justified.

Document the selected repository merge strategy.

Never merge a pull request without human authorization.

Never approve a pull request while impersonating the project owner.

Never bypass GitHub review requirements.

## 26. Automated quality gates

Evaluate and incrementally establish validation for:

- Conventional Commit formatting.
- Branch naming.
- Pull request title formatting.
- Source code formatting.
- Linting.
- Type checking.
- Unit testing.
- Integration testing.
- End-to-end testing.
- Documentation links.
- Documentation generation.
- License compliance.
- Secret detection.
- Docker builds.
- Docker Compose validation.
- Architectural dependency boundaries.
- Tenant isolation.
- Security scanning.

Evaluate tools such as commitlint, Git hooks, and GitHub Actions.

Local Git hooks must not replace authoritative CI checks.

Do not introduce workflows requiring nonexistent application files.

Never disable failing checks merely to make a pull request pass.

## 27. Remote GitHub operations

Use available authenticated Git and GitHub tooling.

Prefer GitHub CLI or supported GitHub integrations when available.

Before pushing or opening a pull request:

- Verify the repository destination.
- Verify the current branch.
- Verify the base branch.
- Verify authentication availability.
- Review the complete change set.
- Confirm that no secrets are included.
- Confirm that the operation is within the granted authorization.

If GitHub authentication or network access is unavailable:

- Preserve local branches and commits.
- Document the blocker.
- Prepare the complete pull request title and description.
- Record the exact remaining operations.
- Do not claim that a remote branch or pull request was created.

Never fabricate GitHub URLs, pull request numbers, or CI results.

## 28. Development history

Maintain accurate development history through:

- Git commit history.
- Individual task records.
- Pull requests.
- Architectural Decision Records.
- Development worklogs.
- Changelog.
- Release notes when applicable.

Each record must describe meaningful engineering activity.

Avoid unnecessary duplication between records.

Keep the repository as the authoritative source of truth.

Public development records must not contain credentials, sensitive personal information, private organization data, or confidential conversation content.

## 29. Permanent AGENTS.md update

Update AGENTS.md with mandatory Git workflow instructions.

All future coding agents must follow:

- Persistent FIFO task execution.
- Task-specific branches.
- Atomic commits.
- Conventional Commits.
- Logical separation of pull requests.
- Continuous documentation.
- ADR traceability.
- Accurate authorship.
- AI-assisted development transparency.
- Automated validation.
- Docker requirements.
- Human-controlled merging.
- Preservation of existing contributor work.

Link to detailed Git workflow documentation.

Create a dedicated document such as:

`docs/development/git-workflow.md`

Create additional documentation when necessary, without unnecessary duplication.

## 30. Immediate assignment

Register this instruction in the persistent development queue.

Preserve the currently active implementation task.

Treat the newly granted Git operation authorization as effective immediately.

When the repository organization task becomes eligible:

1. Inspect the entire repository.
2. Inspect existing local and remote history.
3. Inventory all existing uncommitted changes.
4. Classify changes by responsibility.
5. Identify logical pull request boundaries.
6. Establish the Git workflow documentation.
7. Establish the branch naming policy.
8. Establish the commit message policy.
9. Establish the pull request template.
10. Update AGENTS.md.
11. Update contribution guidelines.
12. Update the persistent development queue.
13. Create appropriate task-specific branches.
14. Create atomic commits for existing changes.
15. Push authorized branches.
16. Open focused pull requests.
17. Record their dependencies and review status.
18. Continue eligible development tasks according to the persistent queue.

Do not create one monolithic pull request containing all previously generated project files.

Do not rewrite existing published history.

Do not create unnecessary duplicate commits.

Do not create meaningless branches merely to satisfy the proposed categorization.

## 31. Mandatory execution report

At the end of every development session, provide and persist:

- Current task ID.
- Current task status.
- Current branch.
- Files created.
- Files modified.
- Commits created.
- Actual commit hashes.
- Remote branches pushed.
- Pull requests created or updated.
- Actual pull request URLs.
- Pull request dependencies.
- Documentation updates.
- ADR updates.
- Validation results.
- CI status, when available.
- Known limitations.
- Remaining work.
- Next eligible task.

Never fabricate completed operations.

The development workflow must remain continuous, transparent, reviewable, documented, and reproducible across sessions.

Juno is a professional open-source project.

Every meaningful change must have a clear purpose, documented history, and reviewable implementation.

Created by Enzo Ribas.

Developed with AI assistance.

Licensed under MIT.

**Juno — Manage. Engage. Evolve.**
