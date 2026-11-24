# Development state

**Checkpoint:** 2026-11-24. The owner merged PRs through #20. PRs #21 and #22 were replayed onto the new main lineage and verified clean. See the [recovery record](history/JUNO-0032-stack-repair.md).

| Work | Review |
| --- | --- |
| Phase 1 architecture approval | [#21](https://github.com/oEnzoRibas/Juno/pull/21), `2e665a43ebea7762a34dcc4a3a2396afe56afd33` |
| Application workspace and test discovery | [#22](https://github.com/oEnzoRibas/Juno/pull/22), `3e7051ee50c54bdfb4d5780e6eb4c4d126ec965a` |
| Compose and migration baseline | `feat/juno-0020-compose-database`, stacked on #22 |

A clean Compose project on Linux amd64 built and started the web, API and PostgreSQL containers. The migration succeeded on an empty database and on rerun. HTTP smoke checks verified both locales, OpenAPI, liveness and database-backed readiness. PostgreSQL role checks verified that the runtime lacks elevated role flags. Frozen install, lint, type checks, build and Vitest passed locally. GitHub rejected the separate workflow push because the active OAuth token lacks workflow scope. The workflow is retained on local branch `local/juno-0022-initial-workflows`.

The next database increment establishes tenant-owned schema, forced row-level security and isolation evidence. Authentication, invitations, provisioning and dashboard work follow their [tracked dependencies](phase-1-dependencies.md). The [queue](QUEUE.md) remains authoritative. Verify live review and CI state before additional branch changes.
