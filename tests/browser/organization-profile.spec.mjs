import { randomBytes } from 'node:crypto';
import { expect, test } from '@playwright/test';

test('an active organization administrator can update only their own workspace profile', async ({ request }) => {
  const root = `${process.env.JUNO_SMOKE_API ?? 'http://127.0.0.1:3001'}/api`;
  const email = process.env.JUNO_TEST_ADMIN_EMAIL;
  const password = process.env.JUNO_TEST_ADMIN_PASSWORD;
  if (!email || !password) throw new Error('Bootstrap a synthetic platform account first.');

  async function signIn(email, password) {
    const response = await request.post(`${root}/auth/sign-in`, { data: { email, password } });
    expect(response.status()).toBe(200);
    return { authorization: `Bearer ${(await response.json()).token}` };
  }

  const platform = await signIn(email, password);
  const suffix = randomBytes(6).toString('hex');
  async function tenant(label) {
    const response = await request.post(`${root}/tenants`, {
      headers: platform, data: { slug: `profile-${label}-${suffix}`, name: label, accent: '#7565F5' },
    });
    expect(response.status()).toBe(201);
    return (await response.json()).id;
  }

  const own = await tenant('atlas');
  const other = await tenant('mare');
  async function membership(role) {
    const email = `profile-${role}-${suffix}@example.invalid`;
    const password = randomBytes(18).toString('hex');
    const invitation = await request.post(`${root}/tenants/${own}/invitations`, {
      headers: platform, data: { email, role },
    });
    expect(invitation.status()).toBe(201);
    const activated = await request.post(`${root}/tenants/activation`, {
      data: { token: (await invitation.json()).token, password },
    });
    expect(activated.status()).toBe(201);
    return signIn(email, password);
  }

  const administrator = await membership('administrator');
  const member = await membership('member');
  const endpoint = `${root}/tenants/${own}/profile`;
  const data = { name: '  Atlas Júnior  ', accent: '#aabbcc' };
  expect((await request.put(endpoint, { data })).status()).toBe(401);
  for (const headers of [member, platform]) {
    expect((await request.put(endpoint, { headers, data })).status()).toBe(404);
  }
  expect((await request.put(`${root}/tenants/${other}/profile`, { headers: administrator, data })).status()).toBe(404);
  expect((await request.put(endpoint, { headers: administrator, data: { ...data, slug: 'stolen' } })).status()).toBe(400);
  expect((await request.put(endpoint, { headers: administrator, data: { ...data, accent: '<style>' } })).status()).toBe(400);

  const expected = { id: own, name: 'Atlas Júnior', accent: '#AABBCC' };
  const responses = await Promise.all([
    request.put(endpoint, { headers: administrator, data }),
    request.put(endpoint, { headers: administrator, data }),
  ]);
  for (const response of responses) {
    expect(response.status()).toBe(200);
    expect(response.headers()['cache-control']).toBe('no-store');
    expect(await response.json()).toEqual(expected);
  }
  const dashboard = await request.get(`${root}/tenants/${own}`, { headers: member });
  expect(await dashboard.json()).toMatchObject(expected);
});
