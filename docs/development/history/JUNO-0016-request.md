# JUNO — Mandatory Stacked Pull Request Workflow

## 1. Instruction precedence

This instruction updates the previously established Juno Git and Contribution Protocol.

Preserve all existing requirements concerning:

- MIT licensing.
- Original creator attribution to Enzo Ribas.
- AI-assisted development transparency.
- Persistent FIFO development.
- Atomic commits.
- Conventional Commits.
- Focused pull requests.
- Documentation-first engineering.
- Architectural Decision Records.
- Mandatory Docker containerization.
- Human-controlled merging.

The project creator explicitly approves stacked pull requests as the preferred workflow for dependent development tasks.

## 2. Mandatory stack strategy

Whenever multiple pull requests have genuine technical, architectural, or implementation dependencies, organize them into a stack.

Prefer GitHub's native Stacked Pull Requests functionality whenever available.

Do not merely simulate stacks through branch naming conventions when native stack management is supported.

A stack must represent an ordered chain of independently reviewable changes.

Example:

- PR A targets main.
- PR B targets the head branch of PR A.
- PR C targets the head branch of PR B.
- PR D targets the head branch of PR C.

Each pull request must contain only its incremental changes.

Never duplicate parent changes in child pull requests.

Independent pull requests must target main directly.

Do not create artificial dependencies between unrelated work.

## 3. Native GitHub stack management

Evaluate GitHub's native stacked pull request functionality and the official GitHub CLI stack extension.

Official references:

- https://docs.github.com/en/pull-requests/get-started/about-stacked-prs
- https://docs.github.com/en/pull-requests/how-tos/create-pull-requests/creating-stacked-pull-requests
- https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/merging-stacked-pull-requests

Evaluate supported commands such as:

- gh stack init
- gh stack add
- gh stack submit
- gh stack rebase
- gh stack push

Inspect the current tooling and authoritative documentation before executing commands.

Reuse existing pull requests whenever possible.

Do not create replacement pull requests merely to establish a native stack.

Verify that GitHub recognizes the stack and displays the corresponding dependency relationships.

If native stack functionality is unavailable, preserve the correct branch dependency relationships and document the limitation.

## 4. Pull requests must not remain drafts unnecessarily

A dependency on another pull request is not a valid reason, by itself, to keep a pull request in draft status.

The default status for completed and locally validated work must be Ready for review.

A pull request may remain a draft only when:

- Its implementation is incomplete.
- Its required documentation is incomplete.
- Mandatory local validation has not been completed.
- Significant unresolved technical problems remain.
- Its change set is not yet suitable for review.

A proposed ADR may be submitted as a regular pull request for review without being marked Accepted.

Distinguish review readiness from merge eligibility.

A pull request can be ready for review while still being blocked from merging by its dependencies.

Do not use draft status as a dependency management mechanism.

## 5. Existing pull requests

Inspect all existing pull requests in:

https://github.com/oEnzoRibas/Juno

The latest reported state contains 13 focused pull requests:

- PR #1 is ready for review.
- PRs #2 through #13 are drafts.
- The pull requests are stacked on their immediate dependencies.

Verify the actual current repository state before making changes.

For each existing pull request:

1. Inspect its scope.
2. Inspect its base and head branches.
3. Inspect its commits.
4. Identify actual dependencies.
5. Inspect implementation completeness.
6. Inspect documentation completeness.
7. Inspect validation results.
8. Determine whether draft status is justified.
9. Convert completed and validated pull requests to Ready for review.
10. Establish or preserve the appropriate native stack.
11. Document the resulting dependency structure.

Do not blindly preserve the existing thirteen-layer stack if some pull requests are logically independent.

Evaluate whether licensing, governance, branding, architecture, infrastructure, and integration documentation should form separate stacks or independent pull requests.

Preserve existing pull request numbers, comments, review history, and commit history whenever possible.

Do not rewrite published history without authorization.

## 6. Review readiness and merge eligibility

Maintain separate concepts for:

- Implementation status.
- Documentation status.
- Validation status.
- Review readiness.
- Review approval.
- Dependency status.
- Merge eligibility.
- Merge status.

All completed pull requests should be available for review as early as possible.

A dependent pull request must not merge ahead of its prerequisites.

For native GitHub stacks, ensure that all required lower layers satisfy applicable merge requirements.

For manually managed stacks, establish explicit dependency validation before merging into main.

Never merge a child pull request directly into its parent's development branch merely to bypass the required integration order.

Human approval remains mandatory for merging.

Do not enable automatic merging without explicit authorization.

Do not submit an entire stack for merging unless every included pull request has received the required human authorization.

## 7. Pull request dependency documentation

Every stacked pull request description must include:

### Stack information

- Stack name.
- Position within the stack.
- Root branch.
- Immediate parent pull request.
- Required predecessor pull requests.
- Dependent pull requests.
- Recommended merge order.
- Current dependency status.

### Review instructions

Explain which changes reviewers should focus on.

Clarify that the pull request contains only the incremental changes introduced by its corresponding layer.

Use actual pull request numbers and URLs.

Never fabricate dependency information.

## 8. Dependency validation

Evaluate automated dependency validation using GitHub Actions and native GitHub stack requirements.

The validation strategy must prevent:

- Incorrect base branches.
- Missing prerequisite pull requests.
- Duplicate parent changes.
- Circular dependencies.
- Premature merges.
- Accidental inclusion of unrelated commits.
- Integration of unapproved architectural changes.

Evaluate required status checks and branch protection rules.

Do not modify repository-wide protection settings without explicit authorization.

Document any enforcement limitations.

## 9. Stack maintenance after merges

Whenever a parent pull request is merged:

1. Inspect the remaining stack.
2. Verify the next pull request's base branch.
3. Verify that the remaining incremental diffs are correct.
4. Check for duplicated commits.
5. Check for merge conflicts.
6. Verify review and CI status.
7. Update dependency records.
8. Update the persistent development queue.
9. Update the stack documentation.

Prefer native GitHub stack maintenance capabilities.

Pay particular attention to merge commit, squash merge, and rebase behavior.

Do not perform unauthorized force pushes.

If resolving the stack requires rewriting published branch history, document the situation and obtain the necessary authorization.

## 10. Merge strategy

The project must preserve a meaningful, professional Git history.

Evaluate the supported merge strategies:

- Merge commit.
- Rebase and merge.
- Squash and merge.

Because atomic commits are an important part of Juno's engineering history, prefer a strategy that preserves individual meaningful commits.

Document the trade-offs through an ADR.

Do not automatically squash every pull request.

The definitive merge strategy remains subject to project owner approval.

## 11. Development queue integration

Extend the persistent FIFO development records with:

- Stack identifier.
- Stack position.
- Parent task.
- Parent pull request.
- Child pull requests.
- Review readiness.
- Merge eligibility.
- Dependency status.
- CI status.
- Review status.

Do not confuse the development queue with the merge order.

The development queue determines which implementation task is eligible for execution.

The stack dependency structure determines the valid integration order.

Independent eligible development tasks may proceed while existing stacks await human review.

## 12. Permanent documentation

Update the following files when applicable:

- AGENTS.md
- CONTRIBUTING.md
- docs/development/git-workflow.md
- docs/development/QUEUE.md
- docs/development/STATE.md
- docs/development/WORKLOG.md
- .github/pull_request_template.md

Create or update an ADR documenting the stacked pull request strategy.

Create a visual diagram documenting:

- Independent pull requests.
- Dependent pull request stacks.
- Native stack relationships.
- Review readiness.
- Merge dependency validation.
- Human approval.
- Integration into main.

Store the diagram under:

`docs/architecture/diagrams/development/`

Provide:

- juno-stacked-pull-request-workflow.drawio
- juno-stacked-pull-request-workflow.svg
- juno-stacked-pull-request-workflow.pdf
- juno-stacked-pull-request-workflow.md

Follow the approved Juno visual identity and editable Draw.io documentation standards.

All official documentation must be written in English.

## 13. Immediate assignment

Register this request in the persistent development queue.

Apply the updated pull request readiness policy immediately to existing reviewable work without abandoning the current implementation task.

Inspect the thirteen existing pull requests.

Convert eligible drafts to Ready for review.

Establish native GitHub stacks for related pull requests whenever possible.

Keep independent pull requests separate.

Update pull request descriptions to make dependencies explicit.

Preserve existing work and history.

Create focused documentation commits and pull requests for the permanent workflow changes.

Do not merge any pull request.

Do not create unnecessary replacement branches or duplicate pull requests.

## 14. Execution report

Provide an accurate report containing:

- Pull requests inspected.
- Pull requests converted from draft to Ready for review.
- Pull requests remaining in draft and their justification.
- Native GitHub stacks established.
- Independent pull requests.
- Stack dependency relationships.
- Recommended merge order.
- Actual pull request URLs.
- Review status.
- CI status.
- Merge blockers.
- Documentation updates.
- ADR updates.
- Commit hashes.
- Tooling limitations.
- Next eligible development task.

Never fabricate completed GitHub operations.

The objective is to ensure that Juno's pull requests remain focused, independently reviewable, correctly ordered, transparently documented, and safe to integrate.

Created by Enzo Ribas.

Developed with AI assistance.

Licensed under MIT.

**Juno — Manage. Engage. Evolve.**
