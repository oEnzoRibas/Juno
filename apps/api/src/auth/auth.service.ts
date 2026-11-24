import { randomBytes } from 'node:crypto';
import { HttpException, Injectable, ServiceUnavailableException, UnauthorizedException } from '@nestjs/common';
import { sql } from 'drizzle-orm';
import { DatabaseService } from '../database/database.service';
import { bearerDigest, digest, passwordMatches } from './credentials';

interface CredentialsRow extends Record<string, unknown> {
  id: string;
  password_hash: string;
}

interface IdentityRow extends Record<string, unknown> {
  id: string;
  email: string;
  platform_admin: boolean;
}

@Injectable()
export class AuthService {
  constructor(private readonly database: DatabaseService) {}

  private get db() {
    if (!this.database.db) throw new ServiceUnavailableException();
    return this.database.db;
  }

  private async takeBudget(key: string, limit: number): Promise<void> {
    const bucket = Math.floor(Date.now() / (15 * 60 * 1_000));
    const result = await this.db.execute(sql`
      INSERT INTO juno.login_budget (key, bucket, attempts) VALUES (${digest(key)}, ${bucket}, 1)
      ON CONFLICT (key, bucket) DO UPDATE SET attempts = juno.login_budget.attempts + 1
      WHERE juno.login_budget.attempts < ${limit} RETURNING attempts
    `);
    if (!result.rowCount) throw new HttpException('Too many sign-in attempts', 429);
    await this.db.execute(sql`DELETE FROM juno.login_budget WHERE bucket < ${bucket - 1}`);
  }

  async limitActivation(source: string): Promise<void> {
    await this.takeBudget('activation:' + source, 120);
  }

  async signIn(email: string, password: string, source: string): Promise<{ token: string; expiresAt: string }> {
    await this.takeBudget(`source:${source}`, 120);
    await this.takeBudget(`email:${email}`, 12);
    const lookup = await this.db.execute<CredentialsRow>(sql`SELECT * FROM juno.credential_for_email(${email})`);
    const account = lookup.rows[0];
    if (!await passwordMatches(password, account?.password_hash) || !account) throw new UnauthorizedException();

    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1_000).toISOString();
    await this.db.transaction(async (tx) => {
      await tx.execute(sql`DELETE FROM juno.session WHERE expires_at <= now()`);
      await tx.execute(sql`
        INSERT INTO juno.session (token_hash, account_id, expires_at)
        VALUES (${digest(token)}, ${account.id}::uuid, ${expiresAt}::timestamptz)
      `);
    });
    return { token, expiresAt };
  }

  async identity(authorization: string | undefined) {
    const tokenHash = bearerDigest(authorization);
    if (!tokenHash) throw new UnauthorizedException();
    const session = await this.db.execute<IdentityRow>(sql`SELECT * FROM juno.identity_for_session(${tokenHash})`);
    const actor = session.rows[0];
    if (!actor) throw new UnauthorizedException();
    return { id: actor.id, email: actor.email, platformAdmin: actor.platform_admin };
  }

  async signOut(authorization: string | undefined): Promise<void> {
    const tokenHash = bearerDigest(authorization);
    if (tokenHash) await this.db.execute(sql`DELETE FROM juno.session WHERE token_hash = ${tokenHash}`);
  }
}
