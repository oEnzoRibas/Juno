# PostgreSQL runtime and migrations

The first migration creates `juno_runtime.schema_version`. The API readiness endpoint checks it through Drizzle and the runtime login. The Compose database has no published ports. Only the API and migration services join the private database network.

The Compose database initializes with `juno_migrator`. The one-shot migration process uses it to install ordered SQL migrations and provision `juno_app`. That runtime login lacks superuser, role and database creation, replication and row-level security bypass privileges. The runtime receives only the application database password. The first migration grants the runtime schema access and read access to its version table.

The migration command serializes changes with a PostgreSQL advisory lock and applies the committed Drizzle migration journal. On failure, inspect the migration service status and reconcile the database with its journal before retrying. Preserve the database named volume during ordinary restarts. For an existing database, take a recoverable backup before applying an upgrade. The development superuser arrangement belongs to this Compose environment.

The initial migration contains runtime metadata only. Tenant schema, identity, row-level policies, authorization and recovery verification are tracked separately under [database](../development/tasks/JUNO-0021.md), [isolation](../development/tasks/JUNO-0025.md) and [authorization](../development/tasks/JUNO-0026.md). See [development commands](../development/docker.md).
