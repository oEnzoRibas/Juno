# PR #40 runtime review correction

On 2026-11-25 the maintainer reported that the independent review instructions used a clean detached checkout at `bcf3b5cdf54912ee19b9456e0e24c8cd9aba8184`, then directed browser testing to an already running Organization UAT. The original directions created `juno-review-40-*`, installed the frozen workspace, ran `node scripts/quality/validate-compose.mjs`, then linked the manual walkthrough to port 3302. The instructions did not make the different build sources sufficiently explicit.

| Observation | Maintainer's evidence |
| --- | --- |
| Intended Git revision | `bcf3b5cdf54912ee19b9456e0e24c8cd9aba8184` |
| Observed frontend | `juno-uat-org-web-1`, project `juno-uat-org`, Compose working directory `work/juno-uat-org` |
| Observed frontend image | `sha256:18726648d4ce539693c821d3f3bdb5c37a2bf262e912e46472b3f411729c4355` |
| Runtime API origin | `http://api:3001`, published frontend/API 3302/4302 |
| Separate UAT pin | `72ba6be66715178a750b042fa97c1320d2b7fb1e`, includes older #40 at `7d7f7a447e56159bbdc7eb6587e7fcaaa564c23d` |

The maintainer inspected Git worktree and HEAD, Compose labels, image IDs and the web container's configured API origin. The minimal equivalent diagnostic commands are:

```powershell
git worktree list
git rev-parse HEAD
docker inspect juno-uat-org-web-1 --format '{{.Image}} {{index .Config.Labels "com.docker.compose.project"}} {{index .Config.Labels "com.docker.compose.project.working_dir"}}'
docker exec juno-uat-org-web-1 node -p 'process.env.JUNO_API_ORIGIN'
```

Compose recorded deployment ownership. Git recorded checkout identity. The historical build did not embed the compiled revision, so neither observation independently established it. The stock validator's `finally` removed its disposable environment, while the long-running preview on 3302 was intentionally kept. The guide did not distinguish those lifecycles or provide a persistent backend-only procedure. The stock runner explicitly selected three PostgreSQL fixtures and omitted the directory fixture even though the file was present.

## Evidence after discovery

- **Independent maintainer:** Successful startup, web locales, liveness, readiness, OpenAPI, migration stability, `tenant-isolation.sql`, `invitation-expiry.sql` and `onboarding-audit.sql`. Seven Playwright tests passed in 6.5 seconds, including the directory authorization test in 538 ms. Disposable resources and image were removed. The overall exit code was not captured. No final acceptance or merge approval was granted.
- **Hosted CI:** The synchronized revision's [Actions run](https://github.com/oEnzoRibas/Juno/actions/runs/45607648307) passed workspace and Compose jobs using GitHub merge refs.
- **Agent reproduction:** A fresh exact-head disposable run returned `0`, with seven Playwright tests in 11.5 seconds and the three listed SQL fixtures. A separate fresh exact-head persistent build of Git tree `1d99a4b82c6f2a4d301e55296305bf7b5e8174b5` used project `juno-review-40-5e4c3fc72652`. The observed image ID for web/API was `sha256:a21114cf5f55d1a93a6cfda2b9f9c253c86a5fa12628cbd88e958d6351fb0b3d`. It validated schema 6, retrieved readiness from `http://api:3001/api/ready` inside the web container, seeded two fictional tenants and three accounts, and checked 200/401/404/400 cases. Explicit `psql -v ON_ERROR_STOP=1` on `member-directory.sql` returned `0` and rolled back. The review project, volume, image and clean worktree were removed afterward. Existing UATs remained available.

## Corrective actions

[PR #40](https://github.com/oEnzoRibas/Juno/pull/40) now includes separate exact-head automated and manual backend instructions and labels the historical integrated frontend preview. The branch was unchanged. Exact-open-head review procedures were checked across the remaining PRs, including the missing frontend API dependencies and the locally archived benchmark prerequisite. Earlier records retain the evidence they collected. Current descriptions explain source limitations and separate human and hosted evidence.

The [review standard](../git-workflow.md#maintainer-review-standard) now requires startup, verified runtime/source identification, actual API connectivity, fixtures, expected results and safe shutdown before readiness. [ADR-0013](../../architecture/adr/0013-review-build-provenance.md) describes the reproducible build path. The reproducibility work is tracked in [#103](https://github.com/oEnzoRibas/Juno/issues/103), the persistent review tooling in [#105](https://github.com/oEnzoRibas/Juno/issues/105), and the development/UAT UI in [#104](https://github.com/oEnzoRibas/Juno/issues/104). The directory task remains [JUNO-0028 / #89](https://github.com/oEnzoRibas/Juno/issues/89).

Historical UAT images remain on their original snapshots and cannot retroactively attest their compiled SHA. The #40 browser membership UI belongs to #43. Independent execution, final maintainer acceptance and security review remain distinct checkpoints.

Original project creator: Enzo Ribas. Developed with AI assistance.
