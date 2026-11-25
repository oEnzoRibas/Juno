# Independent installation handoff

The approved independent distribution model is in [ADR 0012](../../../architecture/adr/0012-self-hosted-distribution.md). The governing task is [JUNO-0038](../../../development/tasks/JUNO-0038.md). Agent 01 owns architectural decisions and the central queue. Publication of a claim does not establish an executing session.

| Owner | Branch and authorized base | Scope and acceptance |
| --- | --- | --- |
| Agent 01 | `docs/juno-0038-self-hosted-distribution` from `main` at `c93ca1c7a372396cce1880b01d55171db3262a84` | ADR, operator/upstream responsibilities, distribution visual, task and assignments. Coordinate the bootstrap and configuration contract. |
| Agent 02 | `docs/juno-0038-first-run-guidance` from `main` at `c93ca1c7a372396cce1880b01d55171db3262a84` | Own `docs/deployment/first-run.md` and scoped frontend evidence. Document the existing operator bootstrap and localized first-organization flow. Test one and two independent workspaces. Further setup UI shall reuse authenticated onboarding and requires an approved recovery and initial setup contract. |
| Agent 03 | `feat/juno-0038-production-compose` from the published ADR review head recorded in the registry | Own production Compose, Docker packaging, installation validator, operator runbooks, and release artifact validation. Verify private networking, HTTPS and secure cookies, local bootstrap and data persistence. Detailed upgrade and restore tests can reuse #46 at `ef8a1dfc2c44779721de3daf187ac40e561dbc47` in a separate test composition. |

Use a disposable Compose project and fresh installation credentials for verification. Keep the three maintainer UAT worktrees and databases independent. Official release and OCI publication require explicit authorization.
