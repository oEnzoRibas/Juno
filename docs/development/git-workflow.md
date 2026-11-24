# Git and pull request workflow

**Status:** Approved through the [owner brief](history/JUNO-0003-request.md). Use the [FIFO queue](QUEUE.md) and [task record](TASK_TEMPLATE.md). A Git branch, pull request, human approval and merge each have distinct evidence.

## Inspect and branch

Verify the current branch, staged, unstaged and untracked files, local history, configured push destination, authorized identity and remote permissions. Inspect available PRs, default branch and protections. Preserve unrelated work with explicit staging or an isolated worktree. Start from the correct base or resume the recorded task branch. Never commit directly to `main`.

Use lowercase `<category>/<task-id>-<short-description>`, for example `docs/juno-0003-git-workflow`. Use actual task IDs. For a large task, document separate scopes and dependencies. Related tests and documentation belong with the implementation they validate. One PR should have one primary responsibility.

## Stage and commit

Review the explicit diff, license and attribution, local files, links, secret findings and validation. Stage selected paths. Check the staged diff, then create one logical change per commit. Use the configured authorized Git identity. Include `Task: JUNO-NNNN`, relevant `Related-ADR: ADR-NNNN` and meaningful `AI-Assisted: Yes` disclosure. Preserve third-party and contributor authorship.

Use English Conventional Commits and an imperative subject in the form `<type>(<scope>): <description>`. Supported types include feat, fix, docs, style, refactor, perf, test, build, ci, chore and revert. Introduce the optional design type only with explicit validation and release support. Use `!` or `BREAKING CHANGE:` for incompatible changes. Example: `docs(architecture): document tenant isolation`. [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)

## Review and remote operations

Verify the push URL and repository, branch and base, tooling credentials, complete change set and absence of secrets. Push only the task branch. Create or update a focused PR with an English Conventional Commit-style title and the [PR template](../../.github/pull_request_template.md). Mark completed, locally validated scope ready even with open prerequisites or a proposed ADR. Keep a draft only for unfinished implementation, documentation or validation, or a review diff that obscures its intended scope.

Independent PRs target main. For genuine dependencies, use the preceding PR's head as base and prefer native GitHub metadata. Use `gh stack link` with PR URLs to adopt eligible existing PRs without replacing them. Verify their order, heads and bases first. Record native stack ID and position, root, parent and child URLs, predecessors, review scope, readiness and current merge gates. Manual chains require the same explicit ancestry checks and bottom-up merge discipline. After each parent merges, fetch current refs and verify new base, merge base, incremental diff, duplicate patches, conflicts, approval and CI. Do not run a cascading rebase or force-push without authorization that covers rewritten published heads.

Human approval controls merges. Preserve shared history and branch protection, and avoid direct pushes to main. Releases, deployments, permissions, visibility and remote branch deletion require separate authorization. If credentials or network access fail, preserve local commits, record the precise blocker and the prepared PR text, and capture the commands still required.

## Review policy

Recommend required PRs, checks, resolved conversations, and protection against force pushes and unauthorized deletion. Evaluate CODEOWNERS only with confirmed owners. The owner-approved Rebase and merge preference is documented in [ADR-0009](../architecture/adr/0009-stacked-pull-requests.md). Prefer preserving meaningful atomic commits. Reserve squash for an explicitly reviewed reason. See [release governance](../governance/release.md).

Evaluate commitlint, advisory local hooks and authoritative GitHub Actions checks for branch, title and message formats. Add [quality gates](../testing/README.md) only when executable. Record URL, base, branch, actual commit hashes, CI, review and merge status in the task or linked publication record, and keep [STATE](STATE.md) and [WORKLOG](WORKLOG.md) current.
