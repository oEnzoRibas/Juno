# ADR-0013 — Build provenance for isolated reviews

- Status: Proposed implementation for the maintainer's 2026-11-25 reproducibility requirement
- Prepared by: JUNO-AGENT-01
- Scope: [JUNO-0042](../../development/tasks/JUNO-0042.md), [ADR-0005](0005-mandatory-containerization.md), [ADR-0012](0012-self-hosted-distribution.md)

## Context

The [PR #40 review incident](../../development/history/JUNO-0042-pr-40-runtime-review.md) demonstrated that a Git checkout, an integrated preview and a container image can refer to different source. A runtime environment variable or Compose label alone cannot identify the source compiled into an image.

## Decision

The review build command rejects dirty worktrees and streams a pinned Git archive as the image build context. Git revision, tree, build timestamp and any explicitly listed reachable PR heads are written at image build time. The Dockerfile computes a digest of the actual copied source input before compilation. The runtime image carries standard OCI source, revision and creation labels and Juno tree and candidate component labels. Inspect Docker for the actual running image and project identity. Record the Git tree and copied-source digest separately, since Docker context filtering excludes files such as documentation and local credentials.

The API serves opt-in metadata with a separately observed database schema. Compose development loopback gates this endpoint. Production Compose never injects the opt-in. No path, host name, secret, tenant or account data appears in the metadata. Build attestations identify the supported local build pipeline and are not cryptographic publisher attestations. Development watch and unpinned direct Docker builds disclose unavailable Git metadata where their source cannot be established. Persistent UAT updates require a new explicit pin, retaining the old project and database.

Injecting revision strings at container launch was rejected because a restart could misreport an unchanged image. Sending `.git` with the Docker context was rejected because worktree Git metadata can reside outside the checkout and its contents are broader than the build needs. Treat prior images without embedded metadata as historical evidence.

## Verification

Check image labels and running IDs, service-level metadata and readiness, a mismatch case, and stable results after a restart. Confirm startup with the flag off returns 404 and Swagger omits the route. Compare with the [review guide](../../testing/juno-review-runtime.md).
