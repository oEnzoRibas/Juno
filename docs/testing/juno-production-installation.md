# JUNO-0038 production installation qualification

[ADR 0012](../architecture/adr/0012-self-hosted-distribution.md) and the [installation handoff](../development/agents/agent-01/handoffs/juno-self-hosted-distribution.md) reserve this work for Agent 03. The installation under review is [PR #58](https://github.com/oEnzoRibas/Juno/pull/58) at `c91260a2a0e8ce2021f1ed5a29203d3b85dac2e8`, stacked on the distribution decision in [PR #57](https://github.com/oEnzoRibas/Juno/pull/57) at `a73cfc18c1961551b1df804741434951cf8cf24a`.

## Reproduce the rehearsal

Use a test machine with a Linux Docker Engine, the Compose plugin, Node 24, the pinned pnpm version, OpenSSL and Chromium. The test runner needs those tools. An operator running the packaged application uses the [production operator procedure](../deployment/production.md).

Run from the repository root of this qualification branch:

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
node scripts/quality/validate-production-installation.mjs
```

Set `JUNO_QA_OPENSSL` to the OpenSSL executable if it is outside the executable search path. The default web ports are 18612 and 18613 on IPv4 loopback. Set `JUNO_QA_SOURCE_PORT` and `JUNO_QA_RESTORE_PORT` to two distinct free ports to run alongside other tests. The script assigns unique Compose names, an image tag, volumes, networks, separate random database credentials and transient loopback TLS ports. It closes its browser and removes its instance resources. Chromium accepts the disposable self-signed certificate only in the isolated test context.

The helper checks the rendered production topology without printing its full configuration. It builds the source installation once, preloads the pinned PostgreSQL image, and uses `--no-build --pull never` at startup in both projects. It exercises private liveness and readiness, local administrator bootstrap, tenant creation, invitation activation, cross-tenant read and write denial, Chromium sign-in through a loopback TLS proxy, and the Secure, HttpOnly, SameSite=Strict host cookie. It repeats the data checks after an ordinary stop and start and compares journal hashes and timestamps.

The restore project starts with a fresh volume and the same schema, stops its application services, and restores a synthetic PostgreSQL custom archive in a single transaction. It then runs migrations with the destination's credentials and verifies the restored journal, tenant count, authorization boundaries, TLS sign-in and source data. The archive stays in memory with a 16 MiB subprocess output limit and has no retention or scheduling behavior.

## Operator recovery and version boundaries

The validated path is a same-revision restore to a separate disposable installation. The operator must choose an encrypted, access-controlled backup location and test that its copies can be restored. Keep the version or image digest, backup format, database major version, creation time and restore instructions with each backup. Define backup retention, restore intervals and recovery objectives for the installation.

Before an update, identify the source and target revisions and review their migration compatibility. Restore a pre-update backup into an isolated instance, run the target migrator before the application, and verify the journal, readiness, TLS sign-in and tenant access. An image rollback against the migrated database requires verified schema compatibility with the previous image. When that compatibility is absent, retain the current volume and rehearse recovery into a separate volume using the previous image and pre-update backup. Application writes after the backup may need operator reconciliation before traffic moves.

## Release artifact checks still required

Local reuse of a prebuilt image was exercised without a rebuild or registry pull during startup. A published release should verify its source version and digest, supported architectures and system requirements, fresh installation and an upgrade from each advertised predecessor. Optional OCI distribution adds authentication-free or operator-managed artifact acquisition, digest verification, license notices and an installation from the actual release artifact on a separate host. The default source-build path remains available.

Public DNS, certificate renewal, outbound-network restrictions, production retention and recovery objectives, registry publication, and a supported cross-version upgrade and rollback pair are outside the same-version rehearsal. Release and OCI publication require human authorization.

## Observed checkpoint

On 2026-11-25, the qualification used Windows 10 with Linux amd64 Docker Engine 29.9.3, Compose 5.7.0, Node 24.12.0, and the pinned Playwright Chromium. The first trial passed the source and restore assertions and removed both Docker projects. It exited 1 while removing the empty local certificate directory. The helper now removes its two certificate files and uses the directory-specific removal function.

The [production-profile review CI](https://github.com/oEnzoRibas/Juno/actions/runs/45527204848) passed both hosted jobs at the exact #58 head. That workflow uses the existing development Compose runner. This qualification exercises the production profile as a separate local check. The distribution Draw.io master and its exports passed the repository diagram exporter check.

The corrected run exited 0. Both projects passed the assertions, including login and cross-tenant denial after restore. Both temporary databases, application networks and the local image tag were removed.
