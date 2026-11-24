import { randomBytes } from 'node:crypto';
import { expect, test } from '@playwright/test';

const api = process.env.JUNO_SMOKE_API ?? 'http://127.0.0.1:3001';

test('redacts onboarding audit data and requires an active administrator in that tenant', async ({ request }) => {
  const platformEmail = process.env.JUNO_TEST_ADMIN_EMAIL;
  const platformPassword = process.env.JUNO_TEST_ADMIN_PASSWORD;
  if (!platformEmail || !platformPassword) throw new Error('Bootstrap a synthetic platform admin before running this test.');

  async function login(email, password) {
    const response = await request.post(`${api}/api/auth/sign-in`, { data: { email, password } });
    expect(response.status()).toBe(200);
    return { authorization: `Bearer ${(await response.json()).token}` };
  }

  const platform = await login(platformEmail, platformPassword);
  const suffix = randomBytes(6).toString('hex');

  async function provision(slug) {
    const response = await request.post(`${api}/api/tenants`, {
      headers: platform,
      data: { slug, name: 'Synthetic audit organization', accent: '#7565F5' },
    });
    expect(response.status()).toBe(201);
    return (await response.json()).id;
  }

  async function inviteAndActivate(tenantId, role) {
    const email = `audit-${role}-${suffix}@example.invalid`;
    const password = randomBytes(18).toString('hex');
    const invite = await request.post(`${api}/api/tenants/${tenantId}/invitations`, {
      headers: platform, data: { email, role },
    });
    expect(invite.status()).toBe(201);
    const activation = await request.post(`${api}/api/tenants/activation`, {
      data: { token: (await invite.json()).token, password },
    });
    expect(activation.status()).toBe(201);
    return login(email, password);
  }

  const tenant = await provision(`audit-${suffix}`);
  const other = await provision(`audit-other-${suffix}`);
  const administrator = await inviteAndActivate(tenant, 'administrator');
  const member = await inviteAndActivate(tenant, 'member');
  const auditPath = `${api}/api/tenants/${tenant}/audit`;

  expect((await request.get(auditPath)).status()).toBe(401);
  expect((await request.get(auditPath, { headers: platform })).status()).toBe(404);
  expect((await request.get(auditPath, { headers: member })).status()).toBe(404);
  expect((await request.get(`${api}/api/tenants/${other}/audit`, { headers: administrator })).status()).toBe(404);

  const response = await request.get(auditPath, { headers: administrator });
  expect(response.status()).toBe(200);
  expect(response.headers()['cache-control']).toBe('no-store');
  const body = await response.json();
  expect(Object.keys(body)).toEqual(['events']);
  expect(body.events.map(({ event }) => event)).toEqual([
    'invitation_accepted', 'invitation_issued', 'invitation_accepted', 'invitation_issued', 'tenant_created',
  ]);
  for (const entry of body.events) {
    expect(Object.keys(entry).sort()).toEqual(['event', 'occurredAt']);
    expect(Number.isFinite(Date.parse(entry.occurredAt))).toBe(true);
  }

  const document = await (await request.get(`${api}/api/openapi.json`)).json();
  const contract = document.paths['/api/tenants/{id}/audit'].get;
  expect(contract.security).toEqual([{ bearer: [] }]);
  expect(contract.responses['404']).toBeDefined();
  expect(document.components.schemas.OnboardingAuditResponse.properties.events.maxItems).toBe(50);
});
