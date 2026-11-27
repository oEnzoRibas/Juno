import { UnauthorizedException } from '@nestjs/common';
import type { SQL } from 'drizzle-orm';
import { PgDialect } from 'drizzle-orm/pg-core';
import { describe, expect, it, vi } from 'vitest';
import type { AuthService } from '../auth/auth.service';
import type { DatabaseService } from '../database/database.service';
import { DirectoratesController } from './directorates.controller';
import { DirectoratesService } from './directorates.service';

const tenant = '10000000-0000-4000-8100-000000000001';
const actor = '20000000-0000-4000-8100-000000000002';
const id = '30000000-0000-4000-8100-000000000003';
const bearer = 'Bearer synthetic-session';

function fixture(result: unknown) {
  const identity = vi.fn().mockResolvedValue({ id: actor, platformAdmin: true });
  const execute = vi.fn<(query: SQL) => Promise<{ rows: Array<{ value: unknown }> }>>().mockResolvedValue({
    rows: [{ value: result }],
  });
  const transaction = vi.fn(async (work: (tx: { execute: typeof execute }) => Promise<unknown>) => work({ execute }));
  const database = { db: { transaction } };
  const service = new DirectoratesService(
    database as unknown as DatabaseService,
    { identity } as unknown as AuthService,
  );
  const controller = new DirectoratesController(service);
  const dialect = new PgDialect();
  const statements = () => execute.mock.calls.map(([query]) => dialect.sqlToQuery(query));
  return { controller, identity, execute, transaction, statements };
}

describe('organization directorates', () => {
  it('reads one bounded database page with actor, tenant, and cursor bindings', async () => {
    const page = { items: [{ id, name: 'Projetos' }], nextCursor: id };
    const f = fixture(page);
    await expect(f.controller.list(bearer, tenant, id)).resolves.toEqual(page);
    expect(f.identity).toHaveBeenCalledExactlyOnceWith(bearer);
    expect(f.transaction).toHaveBeenCalledTimes(1);
    expect(f.statements()[0]).toMatchObject({
      sql: expect.stringContaining("set_config('juno.tenant_id', $2, true)"),
      params: [actor, tenant],
    });
    expect(f.statements()[1]).toMatchObject({
      sql: 'SELECT juno.list_directorates($1::uuid) AS value',
      params: [id],
    });
  });

  it('passes a trimmed display name as a parameter and returns the created identity', async () => {
    const created = { id, name: "Diretoria d'Água 🤝" };
    const f = fixture(created);
    await expect(f.controller.create(bearer, tenant, { name: '\u00a0' + created.name + '\u3000' })).resolves.toEqual(
      created,
    );
    expect(f.statements()[1]).toMatchObject({
      sql: 'SELECT juno.create_directorate($1) AS value',
      params: [created.name],
    });
  });

  it('rejects invalid bodies before calling the database and counts Unicode code points', async () => {
    const f = fixture({ id, name: '🤝'.repeat(120) });
    for (const body of [
      null,
      {},
      { name: ' ' },
      { name: 42 },
      { name: 'A\u0000B' },
      { name: 'A\ud800B' },
      { name: 'x', tenant },
      { name: '🤝'.repeat(121) },
    ]) {
      expect(() => f.controller.create(bearer, tenant, body)).toThrow('directorate name');
    }
    expect(f.identity).not.toHaveBeenCalled();
    await expect(f.controller.create(bearer, tenant, { name: '🤝'.repeat(120) })).resolves.toMatchObject({ id });
  });

  it('preserves authorization failures and hides unavailability of a particular organization', async () => {
    const f = fixture(null);
    f.identity.mockRejectedValueOnce(new UnauthorizedException());
    await expect(f.controller.list(undefined, tenant)).rejects.toMatchObject({ status: 401 });
    expect(f.transaction).not.toHaveBeenCalled();
    await expect(f.controller.list(bearer, tenant)).rejects.toMatchObject({ status: 404 });
    await expect(f.controller.create(bearer, tenant, { name: 'Research' })).rejects.toMatchObject({ status: 404 });
  });

  it('returns a conflict only for the scoped normalized-name outcome', async () => {
    const f = fixture({ duplicate: true });
    await expect(f.controller.create(bearer, tenant, { name: 'Projetos' })).rejects.toMatchObject({ status: 409 });
    expect(f.execute).toHaveBeenCalledTimes(2);
  });

  it('maps connection failures to 503 and preserves unexpected database errors', async () => {
    const f = fixture(null);
    const cause = Object.assign(new Error('unreachable'), { code: 'ECONNREFUSED' });
    f.execute.mockRejectedValueOnce(new Error('query failed', { cause }));
    await expect(f.controller.list(bearer, tenant)).rejects.toMatchObject({ status: 503 });
    const unexpected = new Error('unexpected database failure');
    f.execute.mockRejectedValueOnce(unexpected);
    await expect(f.controller.list(bearer, tenant)).rejects.toBe(unexpected);
  });

  it.each(['Connection terminated due to connection timeout', 'Connection terminated unexpectedly'])(
    'maps the PostgreSQL driver error %s to 503 during session lookup',
    async (message) => {
      const f = fixture(null);
      f.identity.mockRejectedValueOnce(new Error('query failed', { cause: new Error(message) }));
      await expect(f.controller.list(bearer, tenant)).rejects.toMatchObject({ status: 503 });
      expect(f.transaction).not.toHaveBeenCalled();
    },
  );
});
