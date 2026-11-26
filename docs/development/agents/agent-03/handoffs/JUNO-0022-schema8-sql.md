# JUNO-0022 schema 8 SQL coverage

Agent 03 acknowledged the [cycle handoff at 549db0c](https://github.com/oEnzoRibas/Juno/blob/549db0cf7d9350d7c0d702eb29de20933554d4e7/docs/development/agents/agent-01/handoffs/juno-organizational-cycle.md) and added three existing implementation fixtures to the reusable runner.

The branch is `test/juno-0022-schema8-sql-regression`, based on [PR #45](https://github.com/oEnzoRibas/Juno/pull/45) at `588489f6ef2ef7bb141d868d097f0761bcec8f65`. Changes are confined to the runner and documentation. If PR #36 lands first, reconcile the shared fixture list with one onboarding audit entry. See the [platform verification runbook](../../../../testing/juno-0022-platform-validation.md#schema-8-sql-coverage).

Local validation passed frozen install, lint, types, four Vitest tests, fresh and repeated migrations, HTTP and OpenAPI smoke, five SQL fixtures, eight Playwright cases, and disposal of the isolated project.

## Stack #42 corrective handoff

[JUNO-0044](https://github.com/oEnzoRibas/Juno/issues/110) retains the published #49 history at `6f5c65681ed3f54df189d2f7760ba508cea929cf` and synchronizes it with #45 at `9283547d93935ad744e639502e0390a319fe97c8`. The incremental contract tests lock the five-fixture order and enforce distinct credentials for the platform and profile administrators. The profile browser test uses its own provisioned administrator and run marker. The profile audit is checked after the concurrent requests complete.

Independent Windows/Chrome validation against Docker's Linux engine reached schema versions 6, 7 and 8 at the three corrected parent revisions. Each run passed frozen install, lint, type checks, four Vitest tests and HTTP/OpenAPI smoke. The actual web-to-API readiness returned HTTP 200. The #45 run verified one persisted audit event from the authorized actor. Docker inventory after each run showed that its disposable resources were removed.

| Parent | Exact revision                             | Playwright | SQL |
| ------ | ------------------------------------------ | ---------: | --: |
| #40    | `e43cfb3f7fccadb6d8de116ad68ed76a36aec068` |          7 |   4 |
| #41    | `1a459a2e52de6973a566b0391a24b20395d1559b` |          7 |   4 |
| #45    | `9283547d93935ad744e639502e0390a319fe97c8` |          8 |   5 |

See [the #49 review instructions and exact-head results](https://github.com/oEnzoRibas/Juno/pull/49).
