import assert from 'node:assert/strict';
import { secret } from './support.mjs';

export function credentials(role) {
  return { email: `review-${role}-${secret().slice(0, 12)}@example.invalid`, password: secret() };
}

export async function apiRequest(origin, path, { body, token, status = 200, cacheControl } = {}) {
  const headers = {};
  if (body) headers['content-type'] = 'application/json';
  if (token) headers.authorization = `Bearer ${token}`;
  const method = body ? 'POST' : 'GET';
  const response = await fetch(new URL(`/api${path}`, origin), {
    method,
    headers,
    body: body && JSON.stringify(body),
    signal: AbortSignal.timeout(10_000),
  });
  if (response.status !== status) {
    await response.body?.cancel();
    throw new Error(`${method} ${path} returned ${response.status}; expected ${status}`);
  }
  if (cacheControl && response.headers.get('cache-control') !== cacheControl) {
    throw new Error(`${method} ${path} returned an unexpected cache policy`);
  }
  return response.json();
}

export async function verifyDirectory(state, fixtures) {
  const origin = `http://127.0.0.1:${state.apiPort}`;
  const tokens = {};
  for (const [name, account] of Object.entries(fixtures.accounts)) {
    const { token } = await apiRequest(origin, '/auth/sign-in', { body: account });
    if (!token) throw new Error(`The ${name} fixture did not receive a session.`);
    tokens[name] = token;
  }
  const endpoint = `/tenants/${fixtures.tenants.alpha.id}/members`;
  const page = await apiRequest(origin, endpoint, { token: tokens.tenantAdmin, cacheControl: 'no-store' });
  assert.deepEqual(
    page.items.map((item) => Object.keys(item).sort()),
    [
      ['accountId', 'active', 'email', 'joinedAt', 'role'],
      ['accountId', 'active', 'email', 'joinedAt', 'role'],
    ],
  );
  assert.deepEqual(
    page.items.map((item) => item.email).sort(),
    [fixtures.accounts.tenantAdmin.email, fixtures.accounts.member.email].sort(),
  );
  assert.equal(page.nextCursor, null);
  assert.deepEqual(
    await apiRequest(origin, `${endpoint}?after=${page.items.at(-1).accountId}`, { token: tokens.tenantAdmin }),
    { items: [], nextCursor: null },
  );
  await apiRequest(origin, `${endpoint}?after=invalid`, { token: tokens.tenantAdmin, status: 400 });
  await apiRequest(origin, endpoint, { status: 401 });
  for (const name of ['member', 'foreignAdmin', 'platform']) {
    await apiRequest(origin, endpoint, { token: tokens[name], status: 404 });
  }
  console.info(
    'Directory: administrator 200, no-store and scoped rows; invalid cursor 400; anonymous 401; member, foreign tenant and platform operator 404.',
  );
}

export async function seed(state, bootstrap) {
  const origin = `http://127.0.0.1:${state.apiPort}`;
  const platform = credentials('platform');
  bootstrap(platform);
  const { token } = await apiRequest(origin, '/auth/sign-in', { body: platform });
  if (!token) throw new Error('The synthetic platform operator did not receive a session.');

  const tenants = {};
  const accounts = { platform };
  for (const [key, name, accent] of [
    ['alpha', 'Juno Review Alpha', '#7565F5'],
    ['beta', 'Juno Review Beta', '#A99BFF'],
  ]) {
    const { id } = await apiRequest(origin, '/tenants', {
      token,
      body: { slug: `review-${key}`, name, accent },
      status: 201,
    });
    tenants[key] = { id, name };
  }

  for (const [key, tenant, role] of [
    ['tenantAdmin', 'alpha', 'administrator'],
    ['member', 'alpha', 'member'],
    ['foreignAdmin', 'beta', 'administrator'],
  ]) {
    const account = credentials(key.toLowerCase());
    const invite = await apiRequest(origin, `/tenants/${tenants[tenant].id}/invitations`, {
      token,
      body: { email: account.email, role },
      status: 201,
    });
    await apiRequest(origin, '/tenants/activation', {
      body: { token: invite.token, password: account.password },
      status: 201,
    });
    accounts[key] = account;
  }
  return { tenants, accounts };
}
