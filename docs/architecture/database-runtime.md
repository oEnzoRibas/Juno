# PostgreSQL runtime and migrations

The first migration creates `juno_runtime.schema_version`. The API readiness endpoint checks it through Drizzle and the runtime login. The Compose database has no published ports. Only the API and migration services join the private database network.

The Compose database initializes with `juno_migrator`. The one-shot migration process uses it to install ordered SQL migrations and provision `juno_app`. That runtime login lacks superuser, role and database creation, replication and row-level security bypass privileges. The runtime receives only the application database password. The first migration grants the runtime schema access and read access to its version table.

The migration command serializes changes with a PostgreSQL advisory lock and applies the committed Drizzle migration journal. On failure, inspect the migration service status and reconcile the database with its journal before retrying. Preserve the database named volume during ordinary restarts. For an existing database, take a recoverable backup before applying an upgrade. The development superuser arrangement belongs to this Compose environment.

Migration 0001 adds global account, tenant and membership tables. PostgreSQL forces row-level security on tenant and membership reads. The runtime role can only read the claimed tenant and its matching active membership. It cannot query global accounts or change these tables. Authenticated application context, provisioning and authorization are tracked under [database](../development/tasks/JUNO-0021.md), [isolation](../development/tasks/JUNO-0025.md) and [authorization](../development/tasks/JUNO-0026.md). See [development commands](../development/docker.md).

Run the SQL isolation regression against a disposable Compose project. It inserts synthetic fixtures in a transaction, switches to the runtime role, asserts access and denial, rolls back, and verifies that a second transaction has no residual scope.

```sh
docker compose exec -T db psql -U juno_migrator -d juno -f - < apps/api/drizzle/test/tenant-isolation.sql
```

The two migrations were exercised on an existing database. A logical dump of the migrated schema was restored into a separate database, and the same isolation checks passed there.

Migration 0005 grants the non-login directory owner access to the membership and account metadata required for administrator reads. Migration 0006 retains that data dictionary and adds filtered and single-account lookups under the same forced tenant policy. The additive lookup requires schema version 7 and rewrites no tenant data. See [the directory contract](member-directory.md).
