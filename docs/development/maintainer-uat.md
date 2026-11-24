# Maintainer acceptance testing

The maintainer preview combines reviewed or locally validated candidate revisions into an isolated, local-only environment. Maintain a dedicated Git worktree, Compose project, volume, networks and credentials. Keep the primary checkout and agent worktrees separate. CI and agent development continue on their existing branches.

## Create or update a preview

1. Fetch the remote and record each candidate PR, base and exact head SHA. Verify dependency ancestry and the intended incremental scopes.
2. Compose the pinned trees in a dedicated local branch. Use a three-way comparison and surface conflicts to their owners. Record the resulting Git tree and commit, all inputs and any excluded work. Approval to prepare a preview does not authorize merging or publishing a release.
3. Check existing Compose labels and host ports. On Windows, store environment settings outside the repository with a restricted ACL. Use unique random synthetic credentials, access them through the local user account, and keep invitations and passwords out of Git, reports and shell history.
4. Start only the dedicated project and check migration success, loopback bindings, private database networking, readiness and the actual UI. Exercise a second synthetic tenant and verify denied access. For destructive or repeatable checks, use the existing disposable QA runner in a separate project and ports.
5. Publish the maintainer runbook and a preview record without secrets. Keep the current preview and its volume in place until an explicit update request. Ask Agent 03 to review changes to isolation or recovery. A new agent branch, successful CI run or new staging build never advances the maintainer preview on its own.

Before an authorized update, record the old preview revision and take a private database backup if a schema change is planned. Verify migration compatibility using a disposable volume. Reuse the maintainer volume only after confirming the intended update and rollback strategy. Normal shutdown preserves data. A reset requires explicit authorization and must target only the recorded UAT project and volume.

See the [editable workflow](../architecture/diagrams/development/juno-maintainer-uat.md) and [first preview record](history/JUNO-0037-uat-preview.md).
