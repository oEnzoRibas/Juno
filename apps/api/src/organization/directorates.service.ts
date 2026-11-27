import { ConflictException, Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { sql, type SQL } from 'drizzle-orm';
import { AuthService } from '../auth/auth.service';
import { DatabaseService } from '../database/database.service';

interface Directorate {
  id: string;
  name: string;
}

interface DirectoratePage {
  items: Directorate[];
  nextCursor: string | null;
}

const disconnected = new Set([
  'ECONNREFUSED',
  'ECONNRESET',
  'ENOTFOUND',
  'EAI_AGAIN',
  'ETIMEDOUT',
  'EPIPE',
  'EHOSTUNREACH',
  'ENETUNREACH',
  '57P01',
  '57P02',
  '57P03',
]);

const driverDisconnectMessages = new Set([
  'timeout exceeded when trying to connect',
  'Connection terminated due to connection timeout',
  'Connection terminated unexpectedly',
]);

function databaseUnavailable(error: unknown): boolean {
  // Drizzle wraps driver failures as causes. Unexpected query errors stay distinguishable.
  for (let failure = error; failure instanceof Error; failure = failure.cause) {
    const code = 'code' in failure ? failure.code : undefined;
    if (typeof code === 'string' && (code.startsWith('08') || disconnected.has(code))) return true;
    if (driverDisconnectMessages.has(failure.message)) return true;
  }
  return false;
}

@Injectable()
export class DirectoratesService {
  constructor(
    private readonly database: DatabaseService,
    private readonly auth: AuthService,
  ) {}

  private async query<T>(authorization: string | undefined, tenantId: string, statement: SQL): Promise<T> {
    try {
      const actor = await this.auth.identity(authorization);
      const db = this.database.db;
      if (!db) throw new ServiceUnavailableException();
      return await db.transaction(async (tx) => {
        await tx.execute(sql`
          SELECT set_config('juno.account_id', ${actor.id}, true), set_config('juno.tenant_id', ${tenantId}, true)
        `);
        const result = await tx.execute<{ value: T | null }>(statement);
        const value = result.rows[0].value;
        if (!value) throw new NotFoundException();
        return value;
      });
    } catch (error) {
      if (databaseUnavailable(error)) throw new ServiceUnavailableException();
      throw error;
    }
  }

  /** Return a bounded page after PostgreSQL confirms active membership. */
  list(authorization: string | undefined, tenantId: string, after?: string): Promise<DirectoratePage> {
    return this.query(authorization, tenantId, sql`SELECT juno.list_directorates(${after ?? null}::uuid) AS value`);
  }

  /** Create a directorate and its audit event within the database transaction. */
  async create(authorization: string | undefined, tenantId: string, name: string): Promise<Directorate> {
    const result = await this.query<Directorate | { duplicate: true }>(
      authorization,
      tenantId,
      sql`SELECT juno.create_directorate(${name}) AS value`,
    );
    if ('duplicate' in result)
      throw new ConflictException('This organization already has a directorate with that name.');
    return result;
  }
}
