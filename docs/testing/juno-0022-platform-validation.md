# JUNO-0022 platform validation

Agent 03 first verified [PR #27](https://github.com/oEnzoRibas/Juno/pull/27) at `e6546726e23f7b0eee36be42b4a8de851c2f29c8` under the [published assignment and transfer](https://github.com/oEnzoRibas/Juno/pull/28). The CI increment independently validated the typed onboarding contract from [PR #29](https://github.com/oEnzoRibas/Juno/pull/29) at `efc97bbf9172568ce2fea9ab44efa682cb0e5e07`. The runner reuses the existing Compose services, HTTP smoke script, SQL regressions, and Playwright suite.

## Run locally

Use the pinned workspace toolchain and Docker with the Compose plugin. Install frozen dependencies and Chromium.

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
node scripts/quality/validate-compose.mjs
```

Set `JUNO_BROWSER_CHANNEL=chrome` to use installed Chrome. Web and API default to loopback ports 18500 and 18501. Set `JUNO_WEB_PORT` and `JUNO_API_PORT` to distinct free ports for concurrent sessions. Assign each persistent developer deployment a unique Compose project name, local configuration file, credentials and port pair. [Compose project naming](https://docs.docker.com/compose/how-tos/project-name/)

The runner generates a unique project and synthetic credentials for every invocation and loads `.env.example` instead of the checkout's `.env`. The bootstrap command reads a synthetic administrator from standard input. A normal run or check failure removes only the generated project's containers, test volume, networks and image tag. After a forced interruption, inspect resources with the logged project name and confirm that no runner is active before clearing any disposable resources. Preserve persistent developer volumes. Browser test output can contain synthetic account or invitation details.

## Audit SQL regression

The runtime regression increment adds `onboarding-audit.sql` to the same disposable Compose runner as `tenant-isolation.sql` and `invitation-expiry.sql`. It uses [PR #34](https://github.com/oEnzoRibas/Juno/pull/34) at `0b31c5e22e7d64488340f454f6d6bf67d6d7f302` and applies migration `0004_onboarding_audit_read.sql` before running the SQL suite. The existing GitHub Actions Compose job picks up the new check through the runner.

The audit fixture uses the application database role with synthetic data. It checks that an active administrator sees only the current tenant's 50 most recent events, newest first, with only the event and timestamp fields. It verifies denial with missing tenant context, a different tenant, a member, a platform administrator without membership, or an inactive administrator. It also verifies that the runtime role cannot delete audit events. The SQL transaction rolls back its fixtures.

The runner still covers fresh migrations and a no-op rerun, tenant scope and write denial, invitation expiry, HTTP and OpenAPI smoke, and the Playwright suites. [PR #35](https://github.com/oEnzoRibas/Juno/pull/35) separately covers workspace capability flags and their OpenAPI schema.

Local validation on 2026-11-24 passed frozen install, lint, type checks, four Vitest tests, Linux amd64 Compose build and startup, fresh and repeated migrations, HTTP and OpenAPI smoke, all three SQL regressions and all three Playwright scenarios. The audit fixtures and disposable project were removed.

## Independent evidence on 2026-11-24

Windows host, Node 24.12.0, pnpm 11.25.0, Docker Engine 29.9.3 on Linux amd64, Compose 5.7.0 and installed Chrome.

| Check                              | Result                                                                                                                                                                                                                                                                                                                                   |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Recovery and exact revision        | The first session was interrupted while Compose was building. The CLI later exited 0. Its project was recovered with a new volume, a successful migration, and healthy database, API and web containers. A separate in-flight QA run was observed and allowed to exit before rerunning the harness. Recovery refs were preserved.        |
| Compose and HTTP                   | Base and development overlay configuration passed. The recovered environment and a second project passed HTTP smoke on distinct loopback ports. PostgreSQL had no published port. API and web both ran as UID 1000.                                                                                                                      |
| Independent environments           | `juno-agent-03-audit` used ports 19300 and 19301. `juno-agent-03-peer` used ports 19400 and 19401, reused the built artifact and initialized its own database. Both used distinct internal network IDs, named volumes and generated credentials. A synthetic account inserted in the first database was absent from the second.          |
| Migration and PostgreSQL           | Fresh startup reached schema version 4. A second migration run exited 0 with the same journal count. Existing SQL checks passed for tenant visibility, restricted writes, transaction cleanup, invitation expiry and direct table privileges.                                                                                            |
| Browser and tooling                | Two Playwright flows and four Vitest tests passed. ESLint and Node script syntax checks passed. The runner rejected duplicate ports with exit 1 before starting Compose. A deliberate missing-browser run returned exit 1 and removed its own containers, networks, volume and image tag. Gitleaks found no leaks in the scoped QA diff. |
| Outage and unverified environments | The execution environment rejected the planned database-stop command. The outage behavior was skipped. ARM64 runtime, production deployment, live file watching, current-schema restore and GitHub Actions were outside the initial local validation.                                                                                    |

## GitHub Actions

The [runtime workflow](../../.github/workflows/runtime.yml) is published in [PR #31](https://github.com/oEnzoRibas/Juno/pull/31), above the typed OpenAPI contract in [stack #14](https://github.com/oEnzoRibas/Juno/stack/14). See the [CI diagram](../architecture/diagrams/development/juno-ci-validation.md) and the GitHub Checks tab for the run tied to the reviewed head. The workflow starts on PRs and pushes to main. It runs on GitHub-hosted Ubuntu with read-only contents permission and without persisted Git credentials.

The workspace job checks the committed range for whitespace and scans the diff with redacted Gitleaks output. For a pull request it compares the head with its merge base. For a push it uses the before and after commits. The job also performs a frozen install, lint, type checks, builds and Vitest. The Compose job installs Chromium and runs the same QA entry point documented above. [GitHub Actions event security](https://docs.github.com/en/actions/reference/security/securely-using-pull_request_target)

The existing local draft at `2fa7bf1b29bd8b185a97cdc2db0ca367dbe8e8ec` was the starting point. GitHub accepted publication after the maintainer refreshed the OAuth credential with `workflow` scope. The preserved runner modification matched [PR #31](https://github.com/oEnzoRibas/Juno/pull/31)'s published runner before updating the base. The prior PR tip remains at `refs/juno-recovery/20261124T170607Z/pr-31-pre-ci`.

| ID               | Status                          | Evidence and next action                                                                                                                                                                                                                                                         |
| ---------------- | ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| JUNO-0022-CI-01  | Workflow published and verified | Both jobs passed in the [initial GitHub Actions run](https://github.com/oEnzoRibas/Juno/actions/runs/45445291466) for `8e418caaf5a618eb810b17d51b91c6a5be7a1d5f`. Check the PR for the latest head.                                                                              |
| JUNO-0022-CI-02  | Committed diff gate implemented | The workflow checks Git commits instead of the checked-out working tree. A committed whitespace fixture and a synthetic secret fixture each triggered the expected failure locally.                                                                                              |
| JUNO-0022-OPS-01 | Production readiness follow-up  | The starter runtime inherits the workspace stage with development dependencies. Validate a minimal production image, SBOM and vulnerability scan before recommending production deployment. Validate HTTPS ingress, ARM64 execution and recovery at schema version 4 separately. |

The workflow passed `actionlint` 1.7.12. Against the published PR #29 contract, the local run passed the frozen install, lint, type checks, four Vitest tests, Compose build and startup, empty PostgreSQL migration and rerun, OpenAPI smoke, both SQL regressions, and both Playwright flows. Synthetic Compose resources were removed after the run. Previous isolation, negative-run and outage outcomes are recorded above.

## Schema 8 SQL coverage

The disposable Compose runner applies migration 0007 on the [organization profile candidate](https://github.com/oEnzoRibas/Juno/pull/45) at `588489f6ef2ef7bb141d868d097f0761bcec8f65`. It executes the database fixtures for tenant reads, invitation expiry, onboarding audit, the member directory, and organization profile updates. Each fixture uses synthetic data and rolls back. A fixture error stops the run before browser checks.

The directory fixture covers paging, filters, member detail, and denial for regular members and foreign tenants. The profile fixture covers the active administrator requirement, denied cross-tenant writes, audit integrity, and one audit record for a repeated update. The onboarding audit fixture carries forward the [independently reviewed coverage](https://github.com/oEnzoRibas/Juno/pull/36) so the schema 8 candidate also exercises it.

## Stack #42 corrective validation

[JUNO-0044](https://github.com/oEnzoRibas/Juno/issues/110) synchronizes this runner with the [corrected profile review](https://github.com/oEnzoRibas/Juno/pull/45) at `9283547d93935ad744e639502e0390a319fe97c8`. The suite keeps the five SQL fixtures in order and fails before browser checks if any fixture exits unsuccessfully. The manifest test verifies that each fixture appears once. Keep the test and the manifest in sync when the suite changes.

The runner bootstraps a primary platform administrator and a dedicated profile administrator with different synthetic email addresses and passwords. The profile browser scenario requires `JUNO_TEST_PROFILE_ADMIN_EMAIL`, `JUNO_TEST_PROFILE_ADMIN_PASSWORD`, and `JUNO_TEST_PROFILE_RUN`. After the browser test sends both concurrent profile updates, the runner uses the migration role to verify the normalized persisted profile and exactly one audit event for the authorized actor. Application database grants remain the same. Composed Shell scenarios require their own test identities.

For review evidence, set `JUNO_REVIEW_REPORT` to a local path outside the checkout. The Playwright report records test status, duration and named assertion outcomes. Use a fresh detached checkout and an unused loopback port pair. When checking failure handling, an intentionally failing SQL fixture should stop before Playwright, and an unavailable browser channel should stop before the persisted-audit assertion. Each failure should exit with status 1 and clean up its own Compose resources.
