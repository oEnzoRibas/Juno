# Isolated pull request review

[JUNO-0041](https://github.com/oEnzoRibas/Juno/issues/105) adds an exact-source review workflow. Use this tooling branch or a checkout that includes it. Use a trusted Juno PR, Git, authenticated GitHub CLI, Node 24, the pinned pnpm, and local Docker Compose with Linux containers. Review commands build and execute the chosen pull request's code.

## Persistent manual review

Run the commands from the checkout that contains this tooling. Pass the full head SHA from the current pull request when you need a repeatable review. The optional pin is checked against the live head before the ref is fetched. The detached checkout is separate from your working directory.

```powershell
pnpm review:start --pr 40 --sha bcf3b5cdf54912ee19b9456e0e24c8cd9aba8184 --web-port 18614 --api-port 18615
pnpm review:status --pr 40
pnpm review:credentials --pr 40
pnpm review:directory --pr 40
pnpm review:stop --pr 40
```

The same commands work from a Linux shell. Choose distinct free IPv4 loopback ports or omit them for automatic selection. The PR number and SHA in the example identify the historical member directory review. If the head has moved, check the new revision and pass its SHA. Start builds the chosen checkout, waits for migrations and health, and seeds two fictional organizations plus a platform operator, an Alpha administrator, an Alpha member, and a Beta administrator. Credentials appear only through the explicit credentials command. Run it in a private terminal. Never paste its output into a PR, screenshots, or logs.

Review status identifies the checkout SHA, Git tree and dirty state, Compose project, URLs, both runtime image IDs and available image revision labels, schema version and the readiness response fetched by the web container through its configured API origin. When the chosen revision contains the archive build helper, start builds that immutable tracked tree and checks both containers' OCI revision and tree labels. Older revisions use their existing build and may report `runtimeProvenance: unavailable`. The CLI does not backfill labels or infer compiled revisions from historic image IDs.

The directory check expects scoped member metadata and `no-store` for the Alpha administrator, an empty next page, 400 for a malformed cursor, 401 without authentication and 404 for the Alpha member, Beta administrator and unassigned platform operator. The helper exercises the API and requires a PR with the corresponding backend contract. The isolated #40 checkout does not include the directory UI from #43.

The persistent project stays up until stopped. Stop refuses a changed checkout, an unexpected Docker engine, or containers associated with a different Compose working directory. It removes that review's synthetic database volume, resources, image tag and worktree. Preserve inspection edits and copy any results you need before stopping. A forced process interruption can leave a review and lock directory in local temporary storage. Verify that the command is no longer running before manually clearing only the stale lock. Preserve all other Compose projects and volumes.

## Disposable automated review

```powershell
pnpm review:test --pr 40 --sha bcf3b5cdf54912ee19b9456e0e24c8cd9aba8184 --web-port 18616 --api-port 18617
```

This creates a fresh detached worktree, installs frozen dependencies and Chromium, runs lint, types and Vitest, and invokes that revision's existing Compose validator. The validator defines the available HTTP, migration, SQL and browser checks. At the stated #40 revision, it runs the member directory browser test and the tenant isolation, invitation expiry and onboarding audit SQL fixtures. It does not run `member-directory.sql`. The PR-specific instructions should document additional checks and clarify which scenarios require an integrated snapshot.

An exit code of zero means all invoked commands and cleanup passed. A non-zero code names the failing command or cleanup step. The stock validator manages its own disposable Compose project. The review tool removes the disposable worktree if it still matches the selected commit and contains only recognized tool outputs. Unexpected user or test output is preserved for inspection.

## Scope

This tooling targets Juno's development Compose shape, which publishes only the web and API on IPv4 loopback and uses separate project-scoped database storage. It keeps state and generated synthetic credentials outside the checkout in the account's local temporary directory. Use a private temporary directory on Windows with its normal user ACLs. The tool does not use a production deployment or a previously built integrated UAT. It does not choose or revise the maintainer's integrated candidate.
