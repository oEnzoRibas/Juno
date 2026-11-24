# JUNO-0022 local Compose validation

This entry point runs the existing Docker Compose environment and the repository's smoke, SQL, and Playwright checks on the [onboarding baseline](https://github.com/oEnzoRibas/Juno/pull/27).

## Run

Use the pinned workspace toolchain and Docker Engine with the Compose plugin. Install frozen dependencies and Chromium. The web and API default to loopback ports 18500 and 18501. Set `JUNO_WEB_PORT` and `JUNO_API_PORT` to distinct free ports for concurrent sessions.

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
node scripts/quality/validate-compose.mjs
```

Set `JUNO_BROWSER_CHANNEL=chrome` to use installed Chrome. The runner verifies that PostgreSQL stays on an internal Docker network, the web and API bind only to loopback, and services become ready. It checks both web locales and OpenAPI, runs the PostgreSQL tenant isolation and invitation expiry regressions, and executes the login and onboarding browser flows.

The runner creates a unique Compose project and synthetic credentials and ignores the checkout's `.env`. Database credentials go to Compose subprocesses. The administrator credentials enter the bootstrap command through standard input and reach the browser test through environment variables. The runner removes its own containers, volume, networks and image tag after success or a check failure. A forced interruption can leave the named project active. Use the logged project name and the same Compose file to identify and clean up its resources. Playwright output can contain synthetic account or invitation details.

## Verification on 2026-11-24

The run used Node 24.12.0 and pnpm 11.25.0 on Windows, Docker Engine 29.9.3 on Linux amd64, Compose 5.7.0, and local Chrome. Compose validated the private database network and loopback host bindings. The runtime build reused cached layers. A new database volume initialized, the migration exited successfully, and the API and web services reached healthy status. The HTTP smoke, both SQL regressions and both Playwright flows passed. ESLint and four Vitest tests passed.

Identical ports caused the runner to exit before starting Compose. A separate run with an unavailable browser channel returned exit code 1. A Docker resource inventory confirmed that both the passing run and the browser failure removed their respective containers, volume, networks and image tag.

## GitHub Actions boundary

The existing workflow draft is on `local/juno-0022-initial-workflows` at `2fa7bf1`. GitHub previously rejected publication because the active OAuth credential lacked `workflow` scope. This runner can execute locally while workflow publication is blocked. GitHub Actions evidence, ARM64 runtime coverage, and production deployment remain pending.
