import { Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { sql } from 'drizzle-orm';
import { AuthService } from '../auth/auth.service';
import { DatabaseService } from '../database/database.service';
import { type DirectoryQuery } from './directory-query';

interface DirectoryPage {
  items: Array<{
    accountId: string;
    email: string;
    role: 'administrator' | 'member';
    active: boolean;
    joinedAt: string;
  }>;
  nextCursor: string | null;
}

@Injectable()
export class MemberDirectoryService {
  constructor(
    private readonly database: DatabaseService,
    private readonly auth: AuthService,
  ) {}

  /** Returns bounded membership metadata after PostgreSQL verifies the active administrator scope. */
  async list(authorization: string | undefined, tenantId: string, query: DirectoryQuery): Promise<DirectoryPage> {
    const actor = await this.auth.identity(authorization);
    const db = this.database.db;
    if (!db) throw new ServiceUnavailableException();
    return db.transaction(async (tx) => {
      await tx.execute(sql`
        SELECT set_config('juno.account_id', ${actor.id}, true), set_config('juno.tenant_id', ${tenantId}, true)
      `);
      const result = await tx.execute<{ directory: DirectoryPage | null }>(
        sql`SELECT juno.search_member_directory(
          ${query.after ?? null}::uuid, ${query.emailPrefix ?? null}::text, ${query.role ?? null}::text,
          ${query.active ?? null}::boolean, ${query.accountId ?? null}::uuid
        ) AS directory`,
      );
      const directory = result.rows[0].directory;
      if (!directory) throw new NotFoundException();
      return directory;
    });
  }
}
