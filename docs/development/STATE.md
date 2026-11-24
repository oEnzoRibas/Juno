# Development state

**Checkpoint:** 2026-11-24. The owner merged PRs through #20. PRs #21 and #22 were replayed onto the new main lineage and verified clean. See the [recovery record](history/JUNO-0032-stack-repair.md).

| Work | Review |
| --- | --- |
| Phase 1 architecture approval | [#21](https://github.com/oEnzoRibas/Juno/pull/21), `2e665a43ebea7762a34dcc4a3a2396afe56afd33` |
| Application workspace and test discovery | [#22](https://github.com/oEnzoRibas/Juno/pull/22), `3e7051ee50c54bdfb4d5780e6eb4c4d126ec965a` |
| Compose and migration baseline | [#23](https://github.com/oEnzoRibas/Juno/pull/23), `654d0268647352430586b9ca2052c6ebfc5806b2` |
| Database tenant schema and isolation | [#24](https://github.com/oEnzoRibas/Juno/pull/24), `f4ee6617861192691ac3cb8dfd4c9e72b5652d3d` |

A clean Compose project on Linux amd64 built and started the web, API and PostgreSQL containers. The migration succeeded on an empty database and on rerun. HTTP smoke checks verified both locales, OpenAPI, liveness and database-backed readiness. PostgreSQL role checks verified that the runtime lacks elevated role flags. Frozen install, lint, type checks, build and Vitest passed locally. GitHub rejected the separate workflow push because the active OAuth token lacks workflow scope. The workflow is retained on local branch `local/juno-0022-initial-workflows`.

The local authentication layer is in [PR #26](https://github.com/oEnzoRibas/Juno/pull/26), `38658bf2017417aa9fe1aeb485d702938b8ef254`. It provides a Compose operator command for platform admin bootstrap, a localized sign-in page, limited database credential reads, opaque sessions and logout revocation. Windows frozen installation, lint, types, build and four Vitest tests passed. Playwright verified browser sign-in, invalid credentials, cookie attributes, protected route redirects and session revocation against Linux amd64 Compose. The first onboarding workflow is complete on `feat/juno-0028-tenant-onboarding`, stacked on #26. Compose applied schema version 4. Two Playwright tests, four Vitest tests, HTTP smoke, both PostgreSQL policy regressions, type checks, lint and container builds passed locally. The browser test verified branding, invitation activation, dashboard access, role checks and cross-tenant denial. The SQL regression covered expired tokens and direct access to the invitation and audit tables.

The tenant database increment adds forced row-level security for reads. The SQL regression passed under the runtime role on the migrated and restored database, covering cross-tenant denial, inactive membership, restricted writes and scope cleanup. Next, complete the broader design, audit and organization-management checks recorded by the [task queue](QUEUE.md). Provider tasks retain their original gates. The [queue](QUEUE.md) remains authoritative. Verify live review and CI state before additional branch changes.
