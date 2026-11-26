import { randomBytes } from 'node:crypto';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { sql } from 'drizzle-orm';
import { AuthService } from '../auth/auth.service';
import { digest, hashPassword } from '../auth/credentials';
import { DatabaseService } from '../database/database.service';
import type { OnboardingAuditEvent } from './onboarding.contract';

type Role = 'administrator' | 'member';

@Injectable()
export class OnboardingService {
  constructor(
    private readonly database: DatabaseService,
    private readonly auth: AuthService,
  ) {}

  private get db() {
    if (!this.database.db) throw new ServiceUnavailableException();
    return this.database.db;
  }

  async provision(authorization: string | undefined, input: { slug: string; name: string; accent: string }) {
    const actor = await this.auth.identity(authorization);
    const result = await this.db
      .execute<{ id: string | null }>(
        sql`
      SELECT juno.provision_tenant(${actor.id}::uuid, ${input.slug}, ${input.name}, ${input.accent}) AS id
    `,
      )
      .catch((error: unknown) => {
        if (
          error instanceof Error &&
          'cause' in error &&
          error.cause &&
          typeof error.cause === 'object' &&
          'code' in error.cause &&
          error.cause.code === '23505'
        )
          throw new BadRequestException('Workspace slug is unavailable');
        throw error;
      });
    const id = result.rows[0].id;
    if (!id) throw new ForbiddenException();
    return { id };
  }

  async invite(authorization: string | undefined, id: string, email: string, role: Role) {
    const actor = await this.auth.identity(authorization);
    const token = randomBytes(32).toString('hex');
    const result = await this.db.execute<{ issued: boolean }>(sql`
      SELECT juno.issue_invitation(${actor.id}::uuid, ${id}::uuid, ${email}, ${role}, ${digest(token)}) AS issued
    `);
    if (!result.rows[0].issued) throw new ForbiddenException();
    return { token, expiresInHours: 24 };
  }

  async accept(authorization: string | undefined, token: string, password: string | undefined, source: string) {
    await this.auth.limitActivation(source);
    const actor = authorization ? await this.auth.identity(authorization) : undefined;
    const hash = !actor && password ? await hashPassword(password) : null;
    const result = await this.db.execute<{ id: string | null }>(sql`
      SELECT juno.accept_invitation(${digest(token)}, ${hash}, ${actor?.id ?? null}::uuid) AS id
    `);
    const id = result.rows[0].id;
    if (!id) throw new BadRequestException('Invitation could not be activated');
    return { id };
  }

  async list(authorization: string | undefined) {
    const actor = await this.auth.identity(authorization);
    const result = await this.db.execute<{ id: string; name: string; role: Role }>(sql`
      SELECT * FROM juno.workspaces_for_account(${actor.id}::uuid)
    `);
    return result.rows;
  }

  async audit(authorization: string | undefined, id: string) {
    const actor = await this.auth.identity(authorization);
    return this.db.transaction(async (tx) => {
      await tx.execute(
        sql`SELECT set_config('juno.account_id', ${actor.id}, true), set_config('juno.tenant_id', ${id}, true)`,
      );
      const result = await tx.execute<{ events: OnboardingAuditEvent[] | null }>(
        sql`SELECT juno.recent_onboarding_audit() AS events`,
      );
      const events = result.rows[0].events;
      if (!events) throw new NotFoundException();
      return { events };
    });
  }

  async read(authorization: string | undefined, id: string) {
    const actor = await this.auth.identity(authorization);
    return this.db.transaction(async (tx) => {
      await tx.execute(
        sql`SELECT set_config('juno.account_id', ${actor.id}, true), set_config('juno.tenant_id', ${id}, true)`,
      );
      const result = await tx.execute<{ id: string; name: string; slug: string; accent: string; role: Role }>(sql`
        SELECT tenant.id, tenant.name, tenant.slug, tenant.accent_hex AS accent, membership.role
        FROM juno.tenant JOIN juno.membership ON tenant.id = membership.tenant_id
        WHERE tenant.id = ${id}::uuid
      `);
      const workspace = result.rows[0];
      if (!workspace) throw new NotFoundException();
      const isTenantAdministrator = workspace.role === 'administrator';
      return {
        ...workspace,
        capabilities: {
          inviteMember: isTenantAdministrator,
          readOnboardingAudit: isTenantAdministrator,
        },
      };
    });
  }
}
