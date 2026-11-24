import { randomBytes } from 'node:crypto';
import { expect, test } from '@playwright/test';

test('lists authorized tenant members, handles cursor navigation and keeps denial neutral', async ({ page, browser, request }, testInfo) => {
  const api = `${process.env.JUNO_SMOKE_API ?? 'http://127.0.0.1:3001'}/api`;
  const adminEmail = process.env.JUNO_TEST_ADMIN_EMAIL;
  const adminPassword = process.env.JUNO_TEST_ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) throw new Error('Bootstrap the synthetic platform administrator first.');
  const suffix = randomBytes(6).toString('hex');
  const org = 'Estúdio Juno';

  async function signInApi(email, password) {
    const response = await request.post(`${api}/auth/sign-in`, { data: { email, password } });
    expect(response.status()).toBe(200);
    return { authorization: `Bearer ${(await response.json()).token}` };
  }

  async function signInWeb(target, email, password) {
    await target.goto('/sign-in?lang=pt-BR');
    await target.getByLabel('E-mail', { exact: true }).fill(email);
    await target.getByLabel('Senha', { exact: true }).fill(password);
    await target.getByRole('button', { name: 'Entrar' }).click();
    await expect(target).toHaveURL(/\/session\?lang=pt-BR$/);
  }

  const platform = await signInApi(adminEmail, adminPassword);
  async function createWorkspace(slug, name) {
    const result = await request.post(`${api}/tenants`, {
      headers: platform, data: { name, slug, accent: '#7565F5' },
    });
    expect(result.status()).toBe(201);
    return (await result.json()).id;
  }
  const workspace = await createWorkspace(`member-ui-${suffix}`, org);
  const other = await createWorkspace(`member-ui-other-${suffix}`, 'Other directory');

  async function addMember(role) {
    const email = `directory-${role}-${suffix}@example.invalid`;
    const password = randomBytes(18).toString('hex');
    const invite = await request.post(`${api}/tenants/${workspace}/invitations`, {
      headers: platform, data: { email, role },
    });
    expect(invite.status()).toBe(201);
    const activated = await request.post(`${api}/tenants/activation`, {
      data: { token: (await invite.json()).token, password },
    });
    expect(activated.status()).toBe(201);
    return { email, password };
  }

  const administrator = await addMember('administrator');
  const member = await addMember('member');
  await signInWeb(page, administrator.email, administrator.password);
  await page.getByRole('link', { name: org }).click();
  await page.getByRole('link', { name: 'Membros', exact: true }).click();
  const table = page.getByRole('table', { name: 'Membros' });
  await expect(table).toBeVisible();
  await expect(table.getByRole('row', { name: new RegExp(member.email) })).toContainText('Ativo');
  await expect(table.getByRole('row', { name: new RegExp(administrator.email) })).toContainText('Administrador');
  await expect(page.getByRole('link', { name: 'Membros', exact: true })).toHaveAttribute('aria-current', 'page');

  await testInfo.attach('member-directory-desktop', {
    body: await page.screenshot({ path: testInfo.outputPath('member-directory-desktop.png') }),
    contentType: 'image/png',
  });
  await page.setViewportSize({ width: 320, height: 760 });
  await page.emulateMedia({ colorScheme: 'dark' });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
  await expect(page.getByText('Role a tabela para ver todas as colunas.')).toBeVisible();
  const region = page.getByRole('region', { name: 'Membros' }).filter({ has: table }).last();
  await region.focus();
  await expect(region).toBeFocused();
  await testInfo.attach('member-directory-mobile', {
    body: await page.screenshot({ path: testInfo.outputPath('member-directory-mobile.png') }),
    contentType: 'image/png',
  });
  const directoryUrl = `/workspace/${workspace}/members`;

  const auth = await signInApi(administrator.email, administrator.password);
  const result = await request.get(`${api}/tenants/${workspace}/members`, { headers: auth });
  expect(result.status()).toBe(200);
  const rows = (await result.json()).items;
  await page.goto(`${directoryUrl}?lang=pt-BR&after=${rows.at(-1).accountId}`);
  await expect(page.getByText('Nenhum membro nesta página.')).toBeVisible();
  await page.getByRole('link', { name: 'Primeira página' }).click();
  await expect(table).toBeVisible();
  await page.getByRole('link', { name: 'English', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Members' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'Joined' })).toBeVisible();

  for (const path of [`/workspace/${other}/members?lang=pt-BR`, `${directoryUrl}?lang=pt-BR&after=wrong`]) {
    expect((await page.goto(path))?.status()).toBe(404);
    await expect(page.getByRole('heading', { name: 'Organização indisponível' })).toBeVisible();
    await expect(page.getByText(member.email)).toHaveCount(0);
  }

  const memberContext = await browser.newContext();
  try {
    const memberPage = await memberContext.newPage();
    await signInWeb(memberPage, member.email, member.password);
    await memberPage.getByRole('link', { name: org }).click();
    await expect(memberPage.getByRole('link', { name: 'Membros', exact: true })).toHaveCount(0);
    expect((await memberPage.goto(`${directoryUrl}?lang=pt-BR`))?.status()).toBe(404);
    await expect(memberPage.getByText(administrator.email)).toHaveCount(0);
  } finally {
    await memberContext.close();
  }
});
