# Branching and release proposal

**Status:** Branch and PR protocol approved. Review and release settings remain proposed. Keep `main` as the integration branch. Create short-lived, focused branches and use pull requests with human review. Require relevant status checks once they exist, and establish branch protections with owner approval. Keep documented exceptions and their reasons.

Use the approved Git workflow and Conventional Commits now. Evaluate semantic versioning once a public interface exists. Proposed default merge strategy is squash merging after human approval. Use pre-release versions for previews when useful and record breaking changes and migration guidance. A maintainer prepares the changelog and candidate. The project owner approves the first public release after verifying the accepted [MIT decision](../architecture/adr/0002-mit-licensing.md), applicable notices, artwork provenance and scope, private security reporting, conduct escalation, and validation. Changing remote protections, permissions, repository visibility or release settings requires separate authorization. A designated maintainer records the approved revision, version and validation, then tags or publishes only when authorized.

See [governance](../../GOVERNANCE.md), [maintainer responsibilities for security](../../SECURITY.md), and the decision register.
