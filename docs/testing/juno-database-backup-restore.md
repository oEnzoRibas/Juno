# Logical PostgreSQL backup and restore validation

Run with Node 24, Docker Engine using Linux containers, and the Compose plugin.

```sh
node scripts/quality/validate-database-backup-restore.mjs
```

The validator creates two uniquely named Compose projects with separate database volumes and credentials. Only PostgreSQL and the one-shot migration task run. The validator writes a synthetic record in the source and captures a PostgreSQL custom-format dump in memory. It confirms the destination lacks the marker before restoring, checks the archive table of contents, and applies the dump in one transaction. Both projects are discarded after validation.

On 2026-11-24, the rehearsal passed on Linux amd64 Compose. The restored schema version, migration journal IDs, hashes and timestamps matched the source. The synthetic marker appeared in the restored database and remained in the source. The tenant isolation and audit access regressions both passed against the restored database.

This procedure uses disposable data and a bounded 16 MiB in-memory buffer. A production backup procedure still needs protected archive storage, retention, access control, compatible database versions, and measured recovery objectives. See the [editable recovery diagram](../architecture/diagrams/development/juno-database-recovery-validation.md).
