---
name: juno-git-workflow
description: Synchronize Juno PR branches and native stacks with verified ancestry. Use for base changes, conflicts or worktree recovery. PR evidence and product acceptance have separate workflows.
license: MIT
metadata:
  version: '1.0.0'
---

# Juno git workflow

## Inputs and outputs

Take the PR or branch, exact remote head and base, and the owning lane. Produce an incremental diff, confirmed publish location, recovery reference and remaining merge gates.

1. Follow the [Git workflow](../../../docs/development/git-workflow.md). Fetch remote refs and compare the PR metadata, merge base, incremental files and native stack position. Check branch ownership and existing worktrees.
2. Preserve a recovery ref before changing history. Make the change in an isolated worktree. Reconcile each conflict based on the scoped increment and rerun checks against the new base.
3. Verify the live remote head just before publishing. Prefer history-preserving pushes where the PR stays incremental. Use an exact force-with-lease only for an authorized rewrite. Stop and recheck if the remote head or reservation changed.
4. After a parent merges, confirm the child's real merge base, the generated merge tree when relevant, review gates and fresh exact-head CI. Retire only the verified published task worktree according to repository policy.

Git and an authorized repository identity are required for publication. Capture a prepared local commit and blocker if credentials or a concurrent push prevent it. The skill grants no permission to merge or delete an unrelated worktree.
