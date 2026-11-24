# JUNO-0022 platform validation

Agent 03 verified [PR #27](https://github.com/oEnzoRibas/Juno/pull/27) at `e6546726e23f7b0eee36be42b4a8de851c2f29c8` under the [published assignment and transfer](https://github.com/oEnzoRibas/Juno/pull/28). The runner reuses the existing Compose services, HTTP smoke script, SQL regressions, and Playwright suite.

## Run locally

Use the pinned workspace toolchain and Docker with the Compose plugin. Install frozen dependencies and Chromium.

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
node scripts/quality/validate-compose.mjs
```

Set `JUNO_BROWSER_CHANNEL=chrome` to use installed Chrome. Web and API default to loopback ports 18500 and 18501. Set `JUNO_WEB_PORT` and `JUNO_API_PORT` to distinct free ports for concurrent sessions. Assign each persistent developer deployment a unique Compose project name, local configuration file, credentials and port pair. [Compose project naming](https://docs.docker.com/compose/how-tos/project-name/)

The runner generates a unique project and synthetic credentials for every invocation and loads `.env.example` instead of the checkout's `.env`. The bootstrap command reads a synthetic administrator from standard input. A normal run or check failure removes only the generated project's containers, test volume, networks and image tag. After a forced interruption, inspect resources with the logged project name and confirm that no runner is active before clearing any disposable resources. Preserve persistent developer volumes. Browser test output can contain synthetic account or invitation details.

## Independent evidence on 2026-11-24

Windows host, Node 24.12.0, pnpm 11.25.0, Docker Engine 29.9.3 on Linux amd64, Compose 5.7.0 and installed Chrome.

| Check | Result |
| --- | --- |
| Recovery and exact revision | The first session was interrupted while Compose was building. The CLI later exited 0. Its project was recovered with a new volume, a successful migration, and healthy database, API and web containers. A separate in-flight QA run was observed and allowed to exit before rerunning the harness. Recovery refs were preserved. |
| Compose and HTTP | Base and development overlay configuration passed. The recovered environment and a second project passed HTTP smoke on distinct loopback ports. PostgreSQL had no published port. API and web both ran as UID 1000. |
| Independent environments | `juno-agent-03-audit` used ports 19300 and 19301. `juno-agent-03-peer` used ports 19400 and 19401, reused the built artifact and initialized its own database. Both used distinct internal network IDs, named volumes and generated credentials. A synthetic account inserted in the first database was absent from the second. |
| Migration and PostgreSQL | Fresh startup reached schema version 4. A second migration run exited 0 with the same journal count. Existing SQL checks passed for tenant visibility, restricted writes, transaction cleanup, invitation expiry and direct table privileges. |
| Browser and tooling | Two Playwright flows and four Vitest tests passed. ESLint and Node script syntax checks passed. The runner rejected duplicate ports with exit 1 before starting Compose. |
| Outage and unverified environments | The execution environment rejected the planned database-stop command. The outage behavior was skipped. ARM64 runtime, production deployment, live file watching, current-schema restore and GitHub Actions remain unverified in this validation. |

## CI handoff

The prepared workflow is on `local/juno-0022-initial-workflows` at `2fa7bf1b29bd8b185a97cdc2db0ca367dbe8e8ec`. GitHub rejected its earlier publication because the OAuth credential lacked `workflow` scope. The current credential still lacks that scope. The reviewed PR had no Actions results.

| ID | Priority and routing | Evidence and next validation |
| --- | --- | --- |
| JUNO-0022-CI-01 | Blocking for CI publication. Maintainer credentials, then Agent 03. | With an authorized credential, update the existing workflow draft, keep read-only permissions and the `pull_request` event, and invoke the local runner after installing the pinned dependencies and Chromium. Verify the first exact-head workflow result and fork policy. [GitHub Actions event security](https://docs.github.com/en/actions/reference/security/securely-using-pull_request_target) |
| JUNO-0022-CI-02 | Medium quality gap. Agent 03 with Agent 01 coordination. | The draft checks `git diff --check HEAD` after checkout. A clean worktree can pass even when the committed change has whitespace errors. Validate the applicable event base-to-head range and prove that an intentionally malformed committed patch fails in an isolated test. |
| JUNO-0022-OPS-01 | Production readiness follow-up. Agent 03 with Agent 01 coordination. | The starter runtime inherits the workspace stage with development dependencies. Validate a minimal production image, SBOM and vulnerability scan before recommending production deployment. Validate an HTTPS ingress configuration, ARM64 execution and recovery at schema version 4 separately. |
