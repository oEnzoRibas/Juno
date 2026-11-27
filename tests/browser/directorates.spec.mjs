import { randomBytes } from 'node:crypto';
import { expect, test } from '@playwright/test';
import { verifyStatus } from './review-status.mjs';

async function fixtures(request, suffix = randomBytes(6).toString('hex')) {
  const api = `${process.env.JUNO_SMOKE_API ?? 'http://127.0.0.1:3001'}/api`;
  const email = process.env.JUNO_TEST_DIRECTORATES_ADMIN_EMAIL;
  const password = process.env.JUNO_TEST_DIRECTORATES_ADMIN_PASSWORD;
  if (!email || !password) throw new Error('Bootstrap the dedicated synthetic directorate fixture in Compose.');

  async function signIn(credentials) {
    const response = await verifyStatus('Synthetic actor signs in', 200, () =>
      request.post(`${api}/auth/sign-in`, { data: credentials }),
    );
    return { authorization: `Bearer ${(await response.json()).token}` };
  }

  const platform = await signIn({ email, password });
  async function tenant(label) {
    const name = `Fictional ${label}`;
    const response = await verifyStatus('Synthetic platform administrator provisions an organization', 201, () =>
      request.post(`${api}/tenants`, {
        headers: platform,
        data: { name, slug: `directorates-${label.toLowerCase()}-${suffix}`, accent: '#7565F5' },
      }),
    );
    const { id } = await response.json();
    return { id, name, endpoint: `${api}/tenants/${id}/directorates` };
  }

  async function member(organization, role, label) {
    const credentials = {
      email: `directorates-${label}-${suffix}@example.invalid`,
      password: randomBytes(18).toString('hex'),
    };
    const invitation = await verifyStatus(`Synthetic platform administrator invites a ${role}`, 201, () =>
      request.post(`${api}/tenants/${organization.id}/invitations`, {
        headers: platform,
        data: { email: credentials.email, role },
      }),
    );
    const { token } = await invitation.json();
    await verifyStatus(`Synthetic ${role} accepts the invitation`, 201, () =>
      request.post(`${api}/tenants/activation`, { data: { token, password: credentials.password } }),
    );
    return credentials;
  }

  return { api, member, platform, signIn, tenant };
}

test('directorate API enforces tenant scope, administrator writes and stable pagination', async ({ request }) => {
  test.setTimeout(60_000);
  const run = process.env.JUNO_TEST_DIRECTORATES_RUN;
  if (!/^[a-f0-9]{12}$/.test(run ?? '')) throw new Error('The Compose validator must supply a directorate run ID.');
  const { api, member, platform, signIn, tenant } = await fixtures(request, run);
  const own = await tenant('Atlas');
  const other = await tenant('Boreal');
  const administrator = await signIn(await member(own, 'administrator', 'atlas-admin'));
  const reader = await signIn(await member(own, 'member', 'atlas-reader'));
  const foreignAdministrator = await signIn(await member(other, 'administrator', 'boreal-admin'));

  await verifyStatus('Anonymous directorate list is denied', 401, () => request.get(own.endpoint));
  await verifyStatus('Invalid bearer cannot create a directorate', 401, () =>
    request.post(own.endpoint, { headers: { authorization: 'Bearer invalid' }, data: { name: 'Operations' } }),
  );
  for (const headers of [platform, foreignAdministrator]) {
    await verifyStatus('Actor outside the organization cannot list directorates', 404, () =>
      request.get(own.endpoint, { headers }),
    );
  }
  for (const headers of [reader, platform, foreignAdministrator]) {
    await verifyStatus('Actor without own administrator membership cannot create a directorate', 404, () =>
      request.post(own.endpoint, { headers, data: { name: 'Operations' } }),
    );
  }
  await verifyStatus('Invalid organization ID is rejected', 400, () =>
    request.get(`${api}/tenants/not-a-uuid/directorates`, { headers: administrator }),
  );
  await verifyStatus('Invalid directorate cursor is rejected', 400, () =>
    request.get(own.endpoint, { headers: reader, params: { after: 'not-a-uuid' } }),
  );
  for (const name of ['', '  ', '🚀'.repeat(121), 'Line\nBreak', 'Nul\u0000', '\ud800']) {
    await verifyStatus('Invalid directorate name is rejected', 400, () =>
      request.post(own.endpoint, { headers: administrator, data: { name } }),
    );
  }
  const read = (after) => request.get(own.endpoint, { headers: reader, params: after ? { after } : {} });
  const empty = await verifyStatus('An active organization member can list an empty directory', 200, () => read());
  expect(empty.headers()['cache-control']).toBe('no-store');
  expect(await empty.json()).toEqual({ items: [], nextCursor: null });

  const create = (name) => request.post(own.endpoint, { headers: administrator, data: { name } });
  const competing = await Promise.all([create('  Gestão Interna  '), create('gestão interna')]);
  expect(competing.map((response) => response.status()).toSorted()).toEqual([201, 409]);
  const winningIndex = competing.findIndex((response) => response.status() === 201);
  const winner = competing[winningIndex];
  const created = await winner.json();
  expect(winner.headers()['cache-control']).toBe('no-store');
  expect(created).toEqual({ id: expect.any(String), name: ['Gestão Interna', 'gestão interna'][winningIndex] });
  const foreign = await verifyStatus('A separate organization may reuse the normalized name', 201, () =>
    request.post(other.endpoint, { headers: foreignAdministrator, data: { name: 'GESTÃO INTERNA' } }),
  );
  expect((await foreign.json()).id).not.toBe(created.id);

  const recorded = [created];
  for (const name of ['🚀'.repeat(120), ...Array.from({ length: 49 }, (_, index) => `Synthetic unit ${index}`)]) {
    const response = await verifyStatus('Own administrator creates a synthetic directorate', 201, () => create(name));
    const item = await response.json();
    expect(item).toEqual({ id: expect.any(String), name });
    recorded.push(item);
  }
  const list = async (after) => {
    const response = await verifyStatus('Active member reads a directorate page', 200, () => read(after));
    expect(response.headers()['cache-control']).toBe('no-store');
    return response.json();
  };
  const first = await list();
  expect(first.items).toHaveLength(50);
  expect(first.nextCursor).toBe(first.items.at(-1).id);
  expect(await list()).toEqual(first);
  const last = await list(first.nextCursor);
  expect(last.items).toHaveLength(1);
  expect(last.nextCursor).toBeNull();
  const actual = [...first.items, ...last.items];
  expect(new Set(actual.map(({ id }) => id)).size).toBe(51);
  expect(actual).toEqual(expect.arrayContaining(recorded));
});

test('directorate screen supports keyboard creation on mobile and read-only access in English', async ({
  page,
  browser,
  request,
}) => {
  const { member, tenant } = await fixtures(request);
  const organization = await tenant('Aurora');
  const operator = await member(organization, 'administrator', 'aurora-admin');
  const reader = await member(organization, 'member', 'aurora-reader');
  const path = `/workspace/${organization.id}/directorates`;

  async function visit(target, credentials, copy) {
    const query = copy.locale === 'pt-BR' ? '?lang=pt-BR' : '';
    await target.goto(`/sign-in${query}`);
    await target.getByLabel(copy.email, { exact: true }).fill(credentials.email);
    await target.getByLabel(copy.password, { exact: true }).fill(credentials.password);
    await target.getByRole('button', { name: copy.signIn, exact: true }).click();
    await expect(target).toHaveURL(`/session${query}`);
    await target.getByRole('link', { name: organization.name, exact: true }).click();
    let navigation = target.getByRole('navigation');
    if (copy.openNavigation) {
      const toggle = target.getByRole('button', { name: copy.openNavigation });
      await toggle.press('Enter');
      navigation = target.getByRole('dialog', { name: copy.openNavigation }).getByRole('navigation');
    }
    const link = navigation.getByRole('link', { name: copy.heading, exact: true });
    await link.focus();
    await expect(link).toBeFocused();
    await target.keyboard.press('Enter');
    await expect(target).toHaveURL(`${path}${query}`);
    await expect(target.getByRole('heading', { name: copy.heading, exact: true })).toBeVisible();
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await visit(page, operator, {
    locale: 'pt-BR',
    email: 'E-mail',
    password: 'Senha',
    signIn: 'Entrar',
    heading: 'Diretorias',
    openNavigation: 'Abrir navegação',
  });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  await expect(page.getByText('Esta organização ainda não tem diretorias.')).toBeVisible();
  const name = 'Pesquisa Aurora';
  const field = page.getByRole('textbox', { name: 'Nome da diretoria' });
  await expect(field).toHaveAccessibleDescription(/1 a 120/);
  await field.fill(name);
  await field.press('Enter');
  await expect(page.getByRole('status')).toHaveText('Diretoria criada.');
  await expect(page.getByRole('listitem').filter({ hasText: name })).toBeVisible();

  await field.fill(name.toLowerCase());
  await field.press('Enter');
  await expect(page.getByRole('alert')).toContainText('Já existe uma diretoria com esse nome');
  await expect(field).toHaveAttribute('aria-invalid', 'true');
  await expect(field).toHaveAccessibleDescription(/Já existe uma diretoria/);

  const context = await browser.newContext();
  try {
    const memberPage = await context.newPage();
    await visit(memberPage, reader, {
      locale: 'en',
      email: 'Email address',
      password: 'Password',
      signIn: 'Sign in',
      heading: 'Directorates',
    });
    await expect(memberPage.getByRole('listitem').filter({ hasText: name })).toBeVisible();
    await expect(memberPage.getByRole('textbox', { name: 'Directorate name' })).toHaveCount(0);
    await expect(memberPage.getByRole('button', { name: 'Create directorate' })).toHaveCount(0);
  } finally {
    await context.close();
  }
});
