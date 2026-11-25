# PostgreSQL recovery validation

**Status:** Validated with synthetic data in disposable Compose projects. **Last meaningful update:** 2026-11-24.

The upper path shows the controlled outage rehearsal from [JUNO-0022 database recovery](../../../testing/juno-database-recovery.md). The lower path shows the [logical backup rehearsal](../../../testing/juno-database-backup-restore.md) with a separate destination. The destination restores the archived schema and data after bootstrapping its own database roles, then verifies the migrated revision and access policies. See [ADR-0005](../../adr/0005-mandatory-containerization.md) for the Compose baseline.

[Editable Draw.io master](juno-database-recovery-validation.drawio) · [SVG](juno-database-recovery-validation.svg) · [PDF](juno-database-recovery-validation.pdf)

The diagram uses the approved Juno identity and the brand stencils from the CI validation diagram. Juno was created by Enzo Ribas. This diagram was developed with AI assistance.
