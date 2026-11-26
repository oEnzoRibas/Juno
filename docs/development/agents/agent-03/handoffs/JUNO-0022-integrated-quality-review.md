# JUNO-0022 independent integration and reliability review

| Field          | Value                                                                                                                            |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Reviewer       | JUNO-AGENT-03                                                                                                                    |
| Recipients     | JUNO-AGENT-01, JUNO-AGENT-02 and maintainer                                                                                      |
| Checkpoint     | 2026-11-24, America/Sao_Paulo                                                                                                    |
| Main at review | `c93ca1c7a372396cce1880b01d55171db3262a84`                                                                                       |
| Assignment     | [Organization cycle](../../agent-01/handoffs/juno-organizational-cycle.md), extended quality and operational reliability request |
| Task           | [JUNO-0022](../../../tasks/JUNO-0022.md)                                                                                         |

## Backup and restore

[PR #46](https://github.com/oEnzoRibas/Juno/pull/46) targets `main`. The review ran on `ef8a1dfc2c44779721de3daf187ac40e561dbc47`. The two backup patches matched their previous revisions in a Git range comparison after #44 merged. The incremental diff was the validator, runbook, handoff and four companion diagram files. [Both hosted jobs passed](https://github.com/oEnzoRibas/Juno/actions/runs/45522080896).

Use Node 24 and a running Linux Docker Engine with Compose. In a clean checkout of the exact head, run:

```sh
node scripts/quality/validate-database-backup-restore.mjs
```

The independent run exited 0. Source and restore projects both applied migrations. A bounded PostgreSQL custom archive was restored into a separate disposable target. The validator compared journal hashes and timestamps, verified committed synthetic records, and ran tenant visibility, write denial, transaction cleanup, and onboarding audit eligibility, redaction and integrity checks against the restored database. Both projects and their volumes, networks and image tags were removed. The [maintainer command and evidence](https://github.com/oEnzoRibas/Juno/pull/46#issuecomment-7149288503) are on the PR. The editable database recovery diagram and synchronized exports passed the repository diagram check. The rehearsal used synthetic data and a 16 MiB in-memory archive bound. Production storage, retention and recovery objectives remain open.

## Organization candidate and SQL reconciliation

The isolated candidate was `23934aca652cb00423900374f410d516bbf74a4e`, tree `73bb9effe11b3840c3f4d4e67fb0d54dbe6ab23e`. Every listed head was confirmed as an ancestor.

| Lane     | PR  | Exact head                                 |
| -------- | --- | ------------------------------------------ |
| Backend  | #40 | `7d7f7a447e56159bbdc7eb6587e7fcaaa564c23d` |
| Backend  | #41 | `46b1a9408077d1a2564bdc403d158a8ebb294ec6` |
| Backend  | #45 | `588489f6ef2ef7bb141d868d097f0761bcec8f65` |
| Frontend | #37 | `a7825a6b814013527414e7478fa77d5b2d3eb60c` |
| Frontend | #43 | `e5de071650154641b9f08e7c0ba212d5e71def0a` |
| Frontend | #48 | `145cb9f726cc8d34b2c4c416ef0c08624b6dd562` |
| Frontend | #51 | `789499350559776edeb4f98c921279e16172cc40` |
| QA       | #36 | `7c17cc435d863e5b43c4a8302b2ad8ec730828eb` |
| QA       | #49 | `43a3bce66191ed094ce3f5ea47fde1dc21aa422f` |

The runner blob `92697ddfcfe3d6dabd23fbc62f1ee111270096e2` also matches the Agent 01 reconciliation pin `6f685b06e8021ac5e7054d57464ee236c61dee8c`. It lists `tenant-isolation.sql`, `invitation-expiry.sql`, `onboarding-audit.sql`, `member-directory.sql` and `organization-profile.sql` once each. The five scripts passed under PostgreSQL with `ON_ERROR_STOP=1`. They cover audit eligibility and redaction, directory role rules, cursor pages, filter behavior and foreign detail exclusion, profile authorization and mutation isolation, audit integrity and rollback when audit persistence fails. The published [#36 run](https://github.com/oEnzoRibas/Juno/actions/runs/45464742726) and [#49 run](https://github.com/oEnzoRibas/Juno/actions/runs/45515889419) passed on their individual heads. When #36 is an approved ancestor, retain all five entries in the #49 reconciliation and qualify that exact resulting tree.

Local commands on the clean candidate included `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm typecheck`, `pnpm test` and `node scripts/quality/validate-compose.mjs`. The workspace checks passed, including four Vitest cases. Compose built, started a fresh isolated database and services, passed liveness/readiness and HTTP/OpenAPI smoke, and reapplied migrations with the journal unchanged. The first Compose command exited 1 after Playwright reported 10 passed and 2 failed. The profile UI stayed on the login page, and the profile API spec received HTTP 429 during sign-in. The runner bootstraps a shared synthetic platform account for all specs.

In a third disposable project, the schema 7 to 8 upgrade passed. The pinned #41 migration directory was extracted with `git archive` and mounted read-only into the candidate's unchanged migration driver. From a fresh PostgreSQL volume it applied seven migrations and seeded one tenant. Removing the mount and running the candidate's one-shot migration added an eighth journal record without changing the first seven hashes and timestamps or the tenant name and accent. An immediate rerun preserved the full journal. The profile SQL then passed, including audit failure rollback. The project and image tag were removed.

A clean second Compose project used a distinct synthetic platform account for each spec. Bootstrap with `docker compose run --rm -T migrate pnpm --filter @juno/api bootstrap-admin`, passing synthetic `email` and `password` as JSON on standard input. Set `JUNO_TEST_ADMIN_EMAIL` and `JUNO_TEST_ADMIN_PASSWORD` for each process, plus `JUNO_SMOKE_API` and `JUNO_SMOKE_WEB` to its own loopback origins. Run each of the nine `tests/browser/*.spec.mjs` files with `pnpm exec playwright test <file> --workers=1`. All 12 cases passed, including session revocation, role and tenant boundaries, directory UI and API authorization, invalid profile inputs, and concurrent matching profile writes. This diagnostic used the same source and authorization settings. Its separate fixture setup exposed the shared account limit and preserves the failed result for the existing runner. Agent 02 independently documented a separate account per browser group in [#54](https://github.com/oEnzoRibas/Juno/pull/54).

## Hosted cross-stack checks

The workspace gates passed but the Compose gates failed on the frontend review branches. The frontend tree did not include the separately reviewed backend capability. #51 shows missing member visibility and profile error text. The local integrated candidate exercised the actual backend routes with all front-end source heads present. No hosted run of the nine-PR composed revision was available at this checkpoint. The successful [#54 documentation CI](https://github.com/oEnzoRibas/Juno/actions/runs/45523761795) qualifies its own tree.

| Frontend PR | Actual hosted Compose result                                                           |
| ----------- | -------------------------------------------------------------------------------------- |
| #43         | [Failed](https://github.com/oEnzoRibas/Juno/actions/runs/45514092995/job/138868941359) |
| #48         | [Failed](https://github.com/oEnzoRibas/Juno/actions/runs/45515729690/job/138874533164) |
| #51         | [Failed](https://github.com/oEnzoRibas/Juno/actions/runs/45516545836/job/138877332260) |

[Agent 01 and Agent 02 handoff](https://github.com/oEnzoRibas/Juno/pull/51#issuecomment-7149288432). Request that Agent 01 publish a reviewed candidate with exact frontend, backend and QA parent SHAs and resulting tree, and release fixture isolation ownership. Run the existing workspace and real-API Compose checks on the published SHA. Keep the source PR results visible, and repeat hosted checks on the common base as the approved parents integrate. Separate synthetic accounts per spec or per explicitly bounded shard preserve the normal rate limits. Retargeting, branch updates and workflow edits require the coordinated release.

## Repository format baseline

[PR #52](https://github.com/oEnzoRibas/Juno/pull/52) at `77249b39d5c769b2762dedd2ea88055032efdc0c` installed reproducibly with a frozen lockfile and Prettier 3.10.1. `pnpm format:check`, lint, types and [hosted CI](https://github.com/oEnzoRibas/Juno/actions/runs/45520827776) passed. `pnpm format` changed zero files, and the next check also passed.

Prettier applies syntax-aware formatting where it infers a parser, including JavaScript, TypeScript, JSON, CSS, YAML and Markdown. Embedded-language formatting is off. Text without an inferred parser receives encoding, line-ending and whitespace checks. In a disposable checkout, the command rejected a valid but poorly formatted TypeScript file, invalid UTF-8, mixed endings, and trailing whitespace. The synthetic fixtures were removed after testing. The binary heuristic skips NUL-containing files, including a controlled `.txt` fixture. Known binary extensions and symlinks are skipped. Applied migration SQL, migration metadata, the generated lockfile, Draw.io masters and SVG exports are excluded through the documented configuration. PDF exports fall under the binary skip. The candidate formatter made no changes to these paths.

The local merge of #52 and the current main, commit `59f46527ea97953108a21efd63d9b540dd925106` and tree `fa2a058e9049a3d58333b6c812fd7080e3d33a39`, failed `pnpm format:check` on three files from merged #44:

- `docs/development/agents/agent-03/handoffs/JUNO-0022-integrated-cycle.md`
- `docs/testing/juno-database-recovery.md`
- `scripts/quality/validate-database-recovery.mjs`

[Format review handoff](https://github.com/oEnzoRibas/Juno/pull/52#issuecomment-7149288430). Refresh #52 on a coordinated base and repeat the hosted gate before approval. There were no changes to the published formatting or recovery branches during the composition check.

## Runtime hardening and operational review

| Area                             | Observed evidence and remaining scope                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Runtime image                    | Linux amd64 image config and Dockerfile use non-root `node` for web, API and migration. The image measures 1,676,212,190 bytes and inherits the build workspace, including source and development dependencies. The runtime user owns the web source and `.next` paths. A smaller runtime with deliberately writable paths requires verification of Next.js behavior and the separate migration command.                                                                                                                           |
| Network and privilege            | PostgreSQL ran only in the internal project network with no published host port. Web and API mapped only to loopback. The application and migration passwords are distinct; the development Compose config takes them from the environment. Production secret delivery and rotation still need an operator process.                                                                                                                                                                                                                |
| Shutdown and resources           | The API enables Nest shutdown hooks. The Compose configuration has no explicit dropped capabilities, read-only root filesystem, service resource limits or stop grace policy. Clean project teardown was observed. Timed in-flight request draining and constrained resource behavior were outside these checks.                                                                                                                                                                                                                   |
| Reproducibility and supply chain | Node and PostgreSQL images use digest references, pnpm has an exact version, and the workspace install uses the lockfile. `pnpm audit --prod` on the candidate reported no known vulnerabilities. Actions are pinned by full SHA and use read-only contents, checkout without persisted credentials, and a redacted digest-pinned Gitleaks scan on the committed diff. Image scanning, SBOM and transitive license inventory were not executed. No scanner verdict or new blocking gate is implied.                                |
| Observability                    | Liveness, database-backed readiness and project health ordering were exercised. Request correlation, structured redacted events, duration, error taxonomy and free-space/backup-age signals remain separately assignable. Application log schema and monitoring configuration were unchanged in this work.                                                                                                                                                                                                                         |
| Production                       | The [deployment requirements](../../../../deployment/README.md) cover HTTPS and trusted ingress, secrets, persistence and runbook scope. The starter uses a local insecure-cookie switch and is for loopback development. A production rehearsal still needs TLS and cookie validation, protected off-host backup storage, retention and restore targets, migration and rollback compatibility, upgrade and full-disk troubleshooting, and escalation for an incident. RTO/RPO require explicit operator targets and measurements. |

The rendering and review work reused the [container development diagram](../../../../architecture/diagrams/juno-containerized-development.md) and the recovery diagram outputs in #46. The tested architecture and infrastructure ownership remain as recorded in the current registry.

## Bounded local performance baseline

Use [the measurement helper](../../../../../scripts/quality/measure-organization-baseline.mjs) from a clean, disposable candidate checkout. After fetching the exact candidate, run from its root with Node 24 and Linux Docker Compose, substituting the absolute path of the helper in this review branch:

```sh
node /path/to/review/scripts/quality/measure-organization-baseline.mjs
```

The ports are loopback-only 18604 and 18605. Use a host where both are free. The helper refuses any other Git revision or a dirty checkout. It uses a uniquely named volume, network and image tag with random credentials and removes only those resources. It seeds two tenants and 800 synthetic ordinary memberships, plus one administrator in the measured tenant. Before the four GET samples it warms each operation five times, then records 30 sequential requests per case. It measures eight batches of two simultaneous profile PUT requests using the same desired data per pair. Timings include response parsing over loopback. The PostgreSQL statement runs once as the scoped application role and shows the SQL function boundary, with no inference about individual operations inside it.

The host was AMD Ryzen 5 3600X, 12 logical CPU threads, Windows 10 Pro 10.0.19045, Docker Engine 29.9.3, Compose 5.7.0 and Node 24.12.0. The Docker VM was Linux x86_64 with 12 CPUs and 15.59 GiB visible memory. The image was available before starting the timer. Fresh volume startup through healthy DB, migration, API and web measured 15.50 seconds, including Compose polling.

| Operation                                          | Requests | p50 (ms) | p95 (ms) | Max (ms) |
| -------------------------------------------------- | -------: | -------: | -------: | -------: |
| Readiness                                          |       30 |     4.00 |     5.32 |     6.48 |
| Member directory, first page                       |       30 |     9.78 |    11.79 |    13.20 |
| Member directory, cursor page                      |       30 |    10.05 |    12.60 |    13.50 |
| Member directory, prefix, role and inactive filter |       30 |     6.10 |     8.98 |     9.51 |
| Profile update, two concurrent requests            |       16 |    11.29 |    20.34 |    20.34 |

The filtered database statement took 3.073 ms execution time and recorded 570 shared buffer hits. After the workload, Docker reported PostgreSQL 40.5 MiB and 0.07% CPU, API 177 MiB and 0.02% CPU, and web 161.3 MiB and 0.00% CPU. These were single post-workload samples, with other local Docker workloads present. The benchmark did not measure sustained throughput, peak resource use or a production configuration.

## Checkpoint and next actions

Review evidence and reproducibility helper are ready for maintainer review. The integrated hosted result, fixture ownership and formatting refresh were requested from Agent 01. Independent operational review is recorded above. No production deployment, additional workflow gate or public release was performed. The [Agent 03 checkpoint](../JUNO-0022-STATUS.md) will track the next released platform task.

AI assisted with test scripting, analysis and documentation. Check results were reviewed against command output and GitHub checks. Human review is pending.

## Reconciliation on 2026-11-25

[PR #55](https://github.com/oEnzoRibas/Juno/pull/55) was synchronized with main at `1bed5952bc121b45d2be4e998ae1d256473919e9`. The [Agent 03 status](../STATUS.md) carries forward the production qualification checkpoint from [PR #60](https://github.com/oEnzoRibas/Juno/pull/60). The [corrective stack #42 record](../../../history/JUNO-0044-stack42-review.md) supersedes the historical shared-account constraint above for the integrated backend runner. The earlier composed frontend measurements and failures remain tied to their original source and setup.

Agent 03 compared the benchmark endpoints, database runtime and authentication sources, applied SQL migrations and journal, Compose configuration, and Dockerfile between the original candidate and this main revision. The comparison showed no changes in those paths. The benchmark helper remains pinned to the original candidate. The source commit and tree are available in the original local clone. The GitHub commit API returned HTTP 404 for that commit during reconciliation, so reproduction from GitHub alone could not be established. Use the exact existing local object or a trusted source archive with the exact Git commit. Keep a later measurement on a new revision in a separate result with its own workload and environment record.
