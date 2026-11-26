import { randomBytes, randomUUID } from 'node:crypto';
import { expect, test } from '@playwright/test';
import { verifyStatus } from './review-status.mjs';

test('only the tenant administrator can read the member directory', async ({ request }) => {
  const api = process.env.JUNO_SMOKE_API ?? 'http://127.0.0.1:3001';
  const root = `${api}/api`;
  const platformEmail = process.env.JUNO_TEST_ADMIN_EMAIL;
  const platformPassword = process.env.JUNO_TEST_ADMIN_PASSWORD;
  if (!platformEmail || !platformPassword) throw new Error('Bootstrap the synthetic platform account first.');

  async function login(email, password) {
    const res = await request.post(`${root}/auth/sign-in`, { data: { email, password } });
    expect(res.status()).toBe(200);
    return { authorization: `Bearer ${(await res.json()).token}` };
  }

  const platform = await login(platformEmail, platformPassword);
  const suffix = randomBytes(6).toString('hex');

  async function createTenant(slug) {
    const res = await request.post(`${root}/tenants`, {
      headers: platform,
      data: { slug, name: 'Synthetic directory fixture', accent: '#7565F5' },
    });
    expect(res.status()).toBe(201);
    return (await res.json()).id;
  }

  const own = await createTenant(`directory-${suffix}`);
  const other = await createTenant(`directory-other-${suffix}`);
  async function enableMember(role, tenant = own, lane = 'own') {
    const email = `directory-${role}-${lane}-${suffix}@example.invalid`;
    const password = randomBytes(18).toString('hex');
    const invitation = await request.post(`${root}/tenants/${tenant}/invitations`, {
      headers: platform,
      data: { email, role },
    });
    expect(invitation.status()).toBe(201);
    const activated = await request.post(`${root}/tenants/activation`, {
      data: { token: (await invitation.json()).token, password },
    });
    expect(activated.status()).toBe(201);
    return { email, headers: await login(email, password) };
  }

  const administrator = await enableMember('administrator');
  const member = await enableMember('member');
  const foreign = await enableMember('administrator', other, 'foreign');
  const endpoint = `${root}/tenants/${own}/members`;
  const res = await verifyStatus('Tenant administrator reads own directory', 200, () =>
    request.get(endpoint, { headers: administrator.headers }),
  );
  expect(res.headers()['cache-control']).toBe('no-store');
  const page = await res.json();
  expect(page.nextCursor).toBeNull();
  expect(page.items.map(({ email }) => email).sort()).toEqual([administrator.email, member.email].sort());
  for (const item of page.items) {
    expect(Object.keys(item).sort()).toEqual(['accountId', 'active', 'email', 'joinedAt', 'role']);
  }
  const memberEntry = page.items.find(({ email }) => email === member.email);
  expect(memberEntry).toBeDefined();
  const params = new URLSearchParams({
    emailPrefix: member.email.toUpperCase().slice(0, -4),
    role: 'member',
    active: 'true',
  });
  const filtered = await verifyStatus(
    'Tenant administrator combines case-insensitive prefix, role and activity in own directory',
    200,
    () => request.get(`${endpoint}?${params}`, { headers: administrator.headers }),
  );
  expect(await filtered.json()).toEqual({ items: [memberEntry], nextCursor: null });
  for (const [query, description] of [
    ['emailPrefix=%25', 'percent prefix is treated literally'],
    ['emailPrefix=directory_member', 'underscore prefix is treated literally'],
    ['active=false', 'there are no inactive members in the HTTP seed'],
  ]) {
    const response = await verifyStatus(`Tenant administrator filters own directory: ${description}`, 200, () =>
      request.get(`${endpoint}?${query}`, { headers: administrator.headers }),
    );
    expect(await response.json()).toEqual({ items: [], nextCursor: null });
  }
  for (const [query, description] of [
    ['role=owner', 'unsupported role'],
    ['active=1', 'unsupported activity'],
    ['emailPrefix=', 'empty prefix'],
    ['role=member&role=administrator', 'duplicate role'],
    ['active=true&active=false', 'duplicate activity'],
    ['emailPrefix=a&emailPrefix=b', 'duplicate email prefix'],
    [`after=${memberEntry.accountId}&after=${memberEntry.accountId}`, 'duplicate cursor'],
  ]) {
    await verifyStatus(`Tenant administrator supplies ${description} in own directory`, 400, () =>
      request.get(`${endpoint}?${query}`, { headers: administrator.headers }),
    );
  }

  const detail = await verifyStatus('Tenant administrator reads an existing member in own tenant', 200, () =>
    request.get(`${endpoint}/${memberEntry.accountId}`, { headers: administrator.headers }),
  );
  expect(detail.headers()['cache-control']).toBe('no-store');
  expect(await detail.json()).toEqual(memberEntry);
  await verifyStatus('Regular member requests own tenant member detail', 404, () =>
    request.get(`${endpoint}/${memberEntry.accountId}`, { headers: member.headers }),
  );
  await verifyStatus('Tenant administrator requests detail through a foreign tenant endpoint', 404, () =>
    request.get(`${root}/tenants/${other}/members/${memberEntry.accountId}`, { headers: administrator.headers }),
  );
  const foreignDirectory = await verifyStatus(
    'Foreign administrator retrieves their own membership identifier',
    200,
    () => request.get(`${root}/tenants/${other}/members`, { headers: foreign.headers }),
  );
  const foreignEntry = (await foreignDirectory.json()).items.find(({ email }) => email === foreign.email);
  expect(foreignEntry).toBeDefined();
  await verifyStatus(
    'Tenant administrator requests a foreign account through their authorized tenant endpoint',
    404,
    () => request.get(`${endpoint}/${foreignEntry.accountId}`, { headers: administrator.headers }),
  );
  await verifyStatus('Tenant administrator requests a nonexistent member in own tenant', 404, () =>
    request.get(`${endpoint}/${randomUUID()}`, { headers: administrator.headers }),
  );

  const next = await verifyStatus('Tenant administrator reads own directory after its last cursor', 200, () =>
    request.get(`${endpoint}?after=${page.items.at(-1).accountId}`, { headers: administrator.headers }),
  );
  expect(await next.json()).toEqual({ items: [], nextCursor: null });
  await verifyStatus('Tenant administrator submits a malformed own-directory cursor', 400, () =>
    request.get(`${endpoint}?after=invalid`, { headers: administrator.headers }),
  );
  await verifyStatus('Anonymous actor requests a tenant directory', 401, () => request.get(endpoint));
  await verifyStatus('Regular member requests own tenant directory', 404, () =>
    request.get(endpoint, { headers: member.headers }),
  );
  await verifyStatus('Platform-only administrator requests a tenant directory', 404, () =>
    request.get(endpoint, { headers: platform }),
  );
  await verifyStatus('Tenant administrator requests the foreign directory', 404, () =>
    request.get(`${root}/tenants/${other}/members`, { headers: administrator.headers }),
  );
});
