import { Injectable, Logger, type OnApplicationShutdown } from '@nestjs/common';
import { sql } from 'drizzle-orm';
import { createDatabasePool, databasePassword, runtimeDatabase } from './connection';

@Injectable()
export class DatabaseService implements OnApplicationShutdown {
  private readonly pool = process.env.JUNO_DATABASE_HOST
    ? createDatabasePool('juno_app', databasePassword('JUNO_DATABASE_PASSWORD'))
    : undefined;

  readonly db = this.pool ? runtimeDatabase(this.pool) : undefined;

  constructor() {
    const logger = new Logger(DatabaseService.name);
    this.pool?.on('error', () => logger.warn('An idle database connection closed unexpectedly'));
  }

  async isReady(): Promise<boolean> {
    try {
      const state = await this.db?.execute(sql`SELECT version FROM juno_runtime.schema_version WHERE version = 9`);
      return state?.rowCount === 1;
    } catch {
      return false;
    }
  }

  async schemaVersion(): Promise<number | null> {
    try {
      const result = await this.db?.execute<{ version: number | null }>(
        sql`SELECT max(version) AS version FROM juno_runtime.schema_version`,
      );
      return result?.rows[0]?.version ?? null;
    } catch {
      return null;
    }
  }

  async onApplicationShutdown(): Promise<void> {
    await this.pool?.end();
  }
}
