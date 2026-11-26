# Branching and release proposal

**Status:** Branch and PR protocol approved. Review and release settings remain proposed. Keep `main` as the integration branch. Create short-lived, focused branches and use pull requests with human review. Require relevant status checks once they exist, and establish branch protections with owner approval. Keep documented exceptions and their reasons.

Use the approved [Git workflow](../development/git-workflow.md) and Conventional Commits now. Evaluate semantic versioning once a public interface exists. Prefer Rebase and merge when supported and compatible with the native stack. Human approval remains mandatory. See [ADR-0009](../architecture/adr/0009-stacked-pull-requests.md) for commit-preserving options and their ancestry trade-offs. Use pre-release versions for previews when useful and record breaking changes and migration guidance. A maintainer prepares the changelog and candidate. The project owner approves the first public release after verifying the accepted [MIT decision](../architecture/adr/0002-mit-licensing.md), applicable notices, artwork provenance and scope, private security reporting, conduct escalation, and validation. Changing remote protections, permissions, repository visibility or release settings requires separate authorization. A designated maintainer records the approved revision, version and validation, then tags or publishes only when authorized.

See [governance](../../GOVERNANCE.md), [maintainer responsibilities for security](../../SECURITY.md), and the [decision register](../product/decisions.md).

## Self-hosted distribution

Publish a pinned source revision, installation and upgrade instructions, and validation evidence with any authorized GitHub release. A release may include versioned OCI images on GitHub Container Registry after independent verification. Provide the version and image digest where applicable. Installation and core operation remain independent of the release registry through a versioned source build. Operator infrastructure, credentials, costs and data remain operator responsibilities. See [ADR 0012](../architecture/adr/0012-self-hosted-distribution.md).
