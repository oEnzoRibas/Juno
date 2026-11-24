import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

export function databasePassword(key: 'JUNO_DATABASE_PASSWORD' | 'JUNO_MIGRATION_PASSWORD'): string {
  const value = process.env[key];
  if (!value || value.length < 16) throw new Error(`${key} must contain at least 16 characters`);
  return value;
}

export function createDatabasePool(user: 'juno_app' | 'juno_migrator', password: string): Pool {
  return new Pool({
    user,
    password,
    host: process.env.JUNO_DATABASE_HOST ?? '127.0.0.1',
    database: 'juno',
    connectionTimeoutMillis: 2_000,
    statement_timeout: 2_000,
    max: 8,
  });
}

export function runtimeDatabase(pool: Pool) {
  return drizzle(pool);
}
