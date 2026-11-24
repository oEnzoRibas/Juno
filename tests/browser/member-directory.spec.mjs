import { randomBytes } from 'node:crypto';
import { expect, test } from '@playwright/test';

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
      headers: platform, data: { slug, name: 'Synthetic directory fixture', accent: '#7565F5' },
    });
    expect(res.status()).toBe(201);
    return (await res.json()).id;
  }

  const own = await createTenant(`directory-${suffix}`);
  const other = await createTenant(`directory-other-${suffix}`);
  async function enableMember(role) {
    const email = `directory-${role}-${suffix}@example.invalid`;
    const password = randomBytes(18).toString('hex');
    const invitation = await request.post(`${root}/tenants/${own}/invitations`, { headers: platform, data: { email, role } });
    expect(invitation.status()).toBe(201);
    const activated = await request.post(`${root}/tenants/activation`, { data: { token: (await invitation.json()).token, password } });
    expect(activated.status()).toBe(201);
    return { email, headers: await login(email, password) };
  }

  const administrator = await enableMember('administrator');
  const member = await enableMember('member');
  const endpoint = `${root}/tenants/${own}/members`;
  const res = await request.get(endpoint, { headers: administrator.headers });
  expect(res.status()).toBe(200);
  expect(res.headers()['cache-control']).toBe('no-store');
  const page = await res.json();
  expect(page.nextCursor).toBeNull();
  expect(page.items.map(({ email }) => email).sort()).toEqual([administrator.email, member.email].sort());
  for (const item of page.items) {
    expect(Object.keys(item).sort()).toEqual(['accountId', 'active', 'email', 'joinedAt', 'role']);
  }
  const next = await request.get(`${endpoint}?after=${page.items.at(-1).accountId}`, { headers: administrator.headers });
  expect(await next.json()).toEqual({ items: [], nextCursor: null });
  expect((await request.get(`${endpoint}?after=invalid`, { headers: administrator.headers })).status()).toBe(400);
  expect((await request.get(endpoint)).status()).toBe(401);
  expect((await request.get(endpoint, { headers: member.headers })).status()).toBe(404);
  expect((await request.get(endpoint, { headers: platform })).status()).toBe(404);
  expect((await request.get(`${root}/tenants/${other}/members`, { headers: administrator.headers })).status()).toBe(404);
});
