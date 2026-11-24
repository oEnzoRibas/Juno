import { resolve } from 'node:path';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { createDatabasePool, databasePassword } from './connection';

async function run(): Promise<void> {
  const secret = databasePassword('JUNO_DATABASE_PASSWORD');
  const migrationPassword = databasePassword('JUNO_MIGRATION_PASSWORD');
  if (secret === migrationPassword) throw new Error('Use distinct database passwords');
  const pool = createDatabasePool('juno_migrator', migrationPassword);
  try {
    const client = await pool.connect();
    try {
      await client.query('SELECT pg_advisory_lock(2580060268)');
      const exists = await client.query("SELECT 1 FROM pg_roles WHERE rolname = 'juno_app'");
      const command = exists.rowCount ? 'ALTER' : 'CREATE';
      // The command comes from the fixed alternatives above. PostgreSQL quotes the credential.
      const statement = await client.query<{ ddl: string }>(
        `SELECT format('${command} ROLE juno_app LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION NOBYPASSRLS PASSWORD %L', $1::text) AS ddl`,
        [secret],
      );
      await client.query(statement.rows[0].ddl);
      await migrate(drizzle(client), { migrationsFolder: resolve(__dirname, '../../drizzle') });
    } finally {
      client.release(true);
    }
  } finally {
    await pool.end();
  }
}

run().then(
  () => console.info('Database migrations applied'),
  () => {
    console.error('Database migration failed. Check database availability and migration configuration.');
    process.exitCode = 1;
  },
);
