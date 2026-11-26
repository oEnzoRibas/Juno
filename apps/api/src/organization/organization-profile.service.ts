import { Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { sql } from 'drizzle-orm';
import { AuthService } from '../auth/auth.service';
import { DatabaseService } from '../database/database.service';

interface Profile {
  id: string;
  name: string;
  accent: string;
}

@Injectable()
export class OrganizationProfileService {
  constructor(
    private readonly database: DatabaseService,
    private readonly auth: AuthService,
  ) {}

  /** Replaces the authorized tenant's name and decorative accent with an atomic audit record. */
  async replace(authorization: string | undefined, tenantId: string, input: Omit<Profile, 'id'>): Promise<Profile> {
    const actor = await this.auth.identity(authorization);
    const db = this.database.db;
    if (!db) throw new ServiceUnavailableException();
    return db.transaction(async (tx) => {
      await tx.execute(sql`
        SELECT set_config('juno.account_id', ${actor.id}, true), set_config('juno.tenant_id', ${tenantId}, true)
      `);
      const result = await tx.execute<{ profile: Profile | null }>(
        sql`SELECT juno.replace_organization_profile(${input.name}, ${input.accent}) AS profile`,
      );
      const profile = result.rows[0].profile;
      if (!profile) throw new NotFoundException();
      return profile;
    });
  }
}
