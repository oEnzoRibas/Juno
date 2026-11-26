import { randomBytes } from 'node:crypto';
import { expect, test } from '@playwright/test';
import { verifyStatus } from './review-status.mjs';

test('an active organization administrator can update only their own workspace profile', async ({ request }) => {
  const root = `${process.env.JUNO_SMOKE_API ?? 'http://127.0.0.1:3001'}/api`;
  const email = process.env.JUNO_TEST_PROFILE_ADMIN_EMAIL;
  const password = process.env.JUNO_TEST_PROFILE_ADMIN_PASSWORD;
  const suffix = process.env.JUNO_TEST_PROFILE_RUN;
  if (!email || !password || !/^[a-f0-9]{12}$/.test(suffix ?? '')) {
    throw new Error('The profile test requires a dedicated synthetic account and run ID from the Compose validator.');
  }
  if (
    email.toLowerCase() === process.env.JUNO_TEST_ADMIN_EMAIL?.toLowerCase() ||
    password === process.env.JUNO_TEST_ADMIN_PASSWORD
  ) {
    throw new Error('The profile group must not reuse the primary fixture credentials.');
  }

  async function signIn(email, password, scenario) {
    const response = await verifyStatus(scenario, 200, () =>
      request.post(`${root}/auth/sign-in`, { data: { email, password } }),
    );
    return { authorization: `Bearer ${(await response.json()).token}` };
  }

  const openapi = await request.get(`${root}/openapi.json`);
  expect(openapi.status()).toBe(200);
  const contract = await openapi.json();
  const operation = contract.paths['/api/tenants/{id}/profile'].put;
  expect(operation.security).toEqual([{ bearer: [] }]);
  expect(Object.keys(operation.responses)).toEqual(expect.arrayContaining(['200', '400', '401', '404']));
  expect(contract.components.schemas.OrganizationProfileInput.required).toEqual(['name', 'accent']);
  expect(contract.components.schemas.OrganizationProfile.required).toEqual(
    expect.arrayContaining(['id', 'name', 'accent']),
  );

  const platform = await signIn(
    email,
    password,
    'Dedicated profile fixture administrator signs in to provision tenants',
  );
  async function tenant(label) {
    const response = await verifyStatus('Dedicated profile fixture administrator creates a synthetic tenant', 201, () =>
      request.post(`${root}/tenants`, {
        headers: platform,
        data: { slug: `profile-${label}-${suffix}`, name: label, accent: '#7565F5' },
      }),
    );
    return (await response.json()).id;
  }

  const own = await tenant('atlas');
  const other = await tenant('mare');
  async function membership(role) {
    const email = `profile-${role}-${suffix}@example.invalid`;
    const password = randomBytes(18).toString('hex');
    const invitation = await verifyStatus(`Profile fixture administrator invites a synthetic ${role}`, 201, () =>
      request.post(`${root}/tenants/${own}/invitations`, {
        headers: platform,
        data: { email, role },
      }),
    );
    const { token } = await invitation.json();
    await verifyStatus(`Synthetic ${role} activates their invitation`, 201, () =>
      request.post(`${root}/tenants/activation`, {
        data: { token, password },
      }),
    );
    return signIn(email, password, `Synthetic ${role} signs in`);
  }

  const administrator = await membership('administrator');
  const member = await membership('member');
  const endpoint = `${root}/tenants/${own}/profile`;
  const data = { name: '  Atlas Júnior  ', accent: '#aabbcc' };
  await verifyStatus('Anonymous actor attempts to update a tenant profile', 401, () => request.put(endpoint, { data }));
  for (const [actor, headers] of [
    ['Regular member', member],
    ['Platform-only administrator', platform],
  ]) {
    await verifyStatus(`${actor} attempts to update the tenant profile`, 404, () =>
      request.put(endpoint, { headers, data }),
    );
  }
  await verifyStatus('Tenant administrator attempts to update a foreign profile', 404, () =>
    request.put(`${root}/tenants/${other}/profile`, { headers: administrator, data }),
  );
  for (const [field, invalid] of [
    ['slug', { ...data, slug: 'other-slug' }],
    ['identity', { ...data, id: other }],
    ['accent', { ...data, accent: '<style>' }],
    ['name', { ...data, name: '   ' }],
  ]) {
    await verifyStatus(`Tenant administrator submits invalid or immutable ${field} for own profile`, 400, () =>
      request.put(endpoint, { headers: administrator, data: invalid }),
    );
  }

  const expected = { id: own, name: 'Atlas Júnior', accent: '#AABBCC' };
  const responses = await Promise.all([
    verifyStatus('Tenant administrator submits own profile update (parallel request A)', 200, () =>
      request.put(endpoint, { headers: administrator, data }),
    ),
    verifyStatus('Tenant administrator submits the identical own update (parallel request B)', 200, () =>
      request.put(endpoint, { headers: administrator, data }),
    ),
  ]);
  for (const response of responses) {
    expect(response.headers()['cache-control']).toBe('no-store');
    expect(await response.json()).toEqual(expected);
  }
  const dashboard = await verifyStatus('Regular member reads the normalized own workspace profile', 200, () =>
    request.get(`${root}/tenants/${own}`, { headers: member }),
  );
  expect(await dashboard.json()).toMatchObject(expected);
});
