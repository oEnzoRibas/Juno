# Git and pull request workflow

**Status:** Approved through the [owner brief](history/JUNO-0003-request.md). Use the [FIFO queue](QUEUE.md) and [task record](TASK_TEMPLATE.md). A Git branch, pull request, human approval and merge each have distinct evidence.

## Inspect and branch

Verify the current branch, staged, unstaged and untracked files, local history, configured push destination, authorized identity and remote permissions. Inspect available PRs, default branch and protections. Preserve unrelated work with explicit staging or an isolated worktree. Start from the correct base or resume the recorded task branch. Never commit directly to `main`.

Use lowercase `<category>/<task-id>-<short-description>`, for example `docs/juno-0003-git-workflow`. Use actual task IDs. For a large task, document separate scopes and dependencies. Related tests and documentation belong with the implementation they validate. One PR should have one primary responsibility.

## Worktree lifecycle and staging

At the start and end of a session, fetch `origin` and check that the primary worktree tracks `origin/main`. Use a fast-forward-only update. If unpublished changes would block it, preserve and verify them in a recoverable local snapshot before advancing. Record the recovery reference in the handoff.

When development stops in a task worktree, confirm that its tip is reachable from the corresponding remote task branch. Check for unpublished changes and preserve any needed local files, then remove the finished worktree with `git worktree remove`. Remove only the verified task directory. Keep the remote task branch until the PR merges. After a merge, the owner authorizes deletion of its remote task branch. Confirm the remote tip matches the merged head, the merge is present on the intended shared branch, and all open dependent PRs have been retargeted. Use an exact lease to avoid removing concurrently published work. Preserve `main`, `staging` and any other shared branches.

The shared `staging` branch is the pre-release integration branch. It starts from the current remote default branch. Updates to `staging` follow review and human approval. Independent development pull requests still target `main`. See the [worktree and staging record](tasks/JUNO-0033.md).

## Stage and commit

Review the explicit diff, license and attribution, local files, links, secret findings and validation. Stage selected paths. Check the staged diff, then create one logical change per commit. Use the configured authorized Git identity. Include `Task: JUNO-NNNN`, relevant `Related-ADR: ADR-NNNN` and meaningful `AI-Assisted: Yes` disclosure. Preserve third-party and contributor authorship.

Use English Conventional Commits and an imperative subject in the form `<type>(<scope>): <description>`. Supported types include feat, fix, docs, style, refactor, perf, test, build, ci, chore and revert. Introduce the optional design type only with explicit validation and release support. Use `!` or `BREAKING CHANGE:` for incompatible changes. Example: `docs(architecture): document tenant isolation`. [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)

## Review and remote operations

Verify the push URL and repository, branch and base, tooling credentials, complete change set and absence of secrets. Push only the task branch. Create or update a focused PR with an English Conventional Commit-style title and the [PR template](../../.github/pull_request_template.md). Mark completed, locally validated scope ready even with open prerequisites or a proposed ADR. Keep a draft only for unfinished implementation, documentation or validation, or a review diff that obscures its intended scope.

Independent PRs target main. For genuine dependencies, use the preceding PR's head as base and prefer native GitHub metadata. Use `gh stack link` with PR URLs to adopt eligible existing PRs without replacing them. Verify their order, heads and bases first. Record native stack ID and position, root, parent and child URLs, predecessors, review scope, readiness and current merge gates. Manual chains require the same explicit ancestry checks and bottom-up merge discipline. After each parent merges, fetch current refs and verify new base, merge base, incremental diff, duplicate patches, conflicts, approval and CI. Do not run a cascading rebase or force-push without authorization that covers rewritten published heads.

Human approval controls merges. Preserve shared history and branch protection, and avoid direct pushes to main. Releases, deployments, permissions, visibility and remote branch deletions outside the merged-task policy require separate authorization. If credentials or network access fail, preserve local commits, record the precise blocker and the prepared PR text, and capture the commands still required.

## Review policy

Recommend required PRs, checks, resolved conversations, and protection against force pushes and unauthorized deletion. Evaluate CODEOWNERS only with confirmed owners. The owner-approved Rebase and merge preference is documented in [ADR-0009](../architecture/adr/0009-stacked-pull-requests.md). Prefer preserving meaningful atomic commits. Reserve squash for an explicitly reviewed reason. See [release governance](../governance/release.md).

Evaluate commitlint, advisory local hooks and authoritative GitHub Actions checks for branch, title and message formats. Add [quality gates](../testing/README.md) only when executable. Record URL, base, branch, actual commit hashes, CI, review and merge status in the task or linked publication record, and keep [STATE](STATE.md) and [WORKLOG](WORKLOG.md) current.


## Maintainer review standard

Every contribution uses the [PR template](../../.github/pull_request_template.md). Before presenting a PR as ready, record its scope, current native stack or independent base, exact head and base commits, reviewable incremental diff, owner and respective checks. Explain the delivery in accessible language and describe the changed boundaries or contracts. Preserve commit history and update the description in place.

Embed relevant, versioned and sanitized evidence. Use actual screenshots for implemented UI, labeled proposals for concept review, and diagrams or terminal and Actions evidence for backend, quality and infrastructure work. List copyable checkout commands, dependencies, prerequisites, a safe environment, acceptance and negative scenarios, expected results and cleanup. Link actual Actions jobs, and state their checked base. Separate local, integrated, independent and human results. A green historical run proves only its tested input. Record blockers and pending decisions and give the maintainer a concrete checklist. Native stack mergeability does not override review gates.

When several PRs implement one workflow, link an exact shared [UAT snapshot](uat-testing-guide.md#review-environment-inventory) so the maintainer can review it once. Preserve historical UAT and research evidence. A design approval covers the design, and a later interaction acceptance covers the specified runtime snapshot.


## Issue and PR traceability

1. Register the task in the canonical queue. Search existing issues by task ID and scope. Reuse an appropriate issue or register one with scope, acceptance criteria, dependencies and owner.
2. Apply one primary `type:` and the applicable `area:`, `docs:`, `agent:`, `priority:`, `review:` and `validation:` labels. Keep at most one lifecycle `status:` on an item. Use priority only when supported by the actual queue. Preserve the community labels. A feature with documentation uses its feature type plus the useful documentation labels.
3. Use issue-linked branches and atomic Conventional Commits. Open the associated PR, label it, link it from the issue, and include the canonical task and issue in the PR description. Use a non-closing reference for an increment. Use `Closes #N` only for the complete issue scope targeting the default branch.
4. Publish the [review evidence](#maintainer-review-standard). GitHub's current check and review results are authoritative. Use validation labels only for the corresponding verified revision. Use UAT acceptance labels only when a matching human record establishes the accepted scope. Merger status is separate from task completion.
5. Obtain explicit human authorization, then update or close the issue when its acceptance criteria are satisfied. The [traceability index](traceability.md) links originals, retrospective records, issues and deliveries. Retrospective creation and closure dates are GitHub administrative events. Preserve historical merge dates and evidence independently.
