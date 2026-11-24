# Onboarding API contract handoff

| Field | Value |
| --- | --- |
| Source and recipients | JUNO-AGENT-01 → JUNO-AGENT-02 and JUNO-AGENT-03 |
| Task, branch and revision | JUNO-0036, `feat/juno-0036-onboarding-openapi`, `6706bb5628269556f0737757128b232725fd6882` |
| Review | [PR #29](https://github.com/oEnzoRibas/Juno/pull/29), native [stack #14](https://github.com/oEnzoRibas/Juno/stack/14), base [PR #27](https://github.com/oEnzoRibas/Juno/pull/27) |
| Contract | OpenAPI `0.1` at `GET /api/openapi.json`. Opaque bearer sessions, typed provision, invite and activate bodies, active memberships, tenant read and denial statuses. |
| Changed files | API bootstrap, auth and onboarding controllers, onboarding schema classes, runtime smoke script and onboarding docs. |
| Validation | Frozen lockfile install, lint, type checks, four Vitest, Linux amd64 Compose build and empty migration, HTTP/OpenAPI smoke and two Playwright flows passed. |
| Known limits | The contract awaits human review. GitHub Actions publication still needs workflow scope. The frontend can consume existing routes from #27 and consult this schema while the PR is open. |
| Required next action | Frontend uses the existing server action and session boundary. Platform QA uses the existing Compose baseline and judges any contract changes against this published schema. Ask Agent 01 before changing shared files. |
| Acknowledgement | [Agent 02 checkpoint](https://github.com/oEnzoRibas/Juno/blob/15219bb0f001feb0b370c4d84ec2a31f5c431f83/docs/development/agents/agent-02/status/JUNO-0035.md) records review of the exact #29 contract. No acknowledgement of the new design claim is verified. |
