import { randomBytes } from 'node:crypto';
import { expect, test } from '@playwright/test';

test('lists authorized tenant members, handles cursor navigation and keeps denial neutral', async ({
  page,
  browser,
  request,
}, testInfo) => {
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
      headers: platform,
      data: { name, slug, accent: '#7565F5' },
    });
    expect(result.status()).toBe(201);
    return (await result.json()).id;
  }
  const workspace = await createWorkspace(`member-ui-${suffix}`, org);
  const other = await createWorkspace(`member-ui-other-${suffix}`, 'Other directory');

  async function addMember(role, tenant = workspace) {
    const email = `directory-${role}-${suffix}${tenant === workspace ? '' : '-foreign'}@example.invalid`;
    const password = randomBytes(18).toString('hex');
    const invite = await request.post(`${api}/tenants/${tenant}/invitations`, {
      headers: platform,
      data: { email, role },
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
  const bounds = await region.boundingBox();
  expect(bounds.x).toBeGreaterThanOrEqual(0);
  expect(bounds.x + bounds.width).toBeLessThanOrEqual(320);
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
  const topLevel = page.getByRole('navigation', { name: 'Navegação principal' });
  await expect(topLevel.getByRole('link', { name: 'Membros' })).toHaveCount(0);
  const drawerButton = page.getByRole('button', { name: 'Abrir navegação' });
  await drawerButton.click();
  const drawer = page.getByRole('dialog', { name: 'Abrir navegação' });
  await expect(drawer.getByRole('link', { name: 'Membros' })).toHaveAttribute('aria-current', 'page');
  await page.keyboard.press('Escape');
  await expect(drawerButton).toBeFocused();
  await topLevel.getByRole('link', { name: 'Sua conta' }).click();
  await page.getByRole('combobox', { name: 'Idioma' }).selectOption('en');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await page.getByRole('link', { name: 'Back to workspace' }).click();
  await expect(page).toHaveURL(new RegExp(directoryUrl + '\\?after=' + rows.at(-1).accountId + '$'));
  await expect(page.getByText('No memberships on this page.')).toBeVisible();
  await page.getByRole('link', { name: 'First page' }).click();
  await expect(page.getByRole('table', { name: 'Members' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Members' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'Joined' })).toBeVisible();

  await page.goto(`${directoryUrl}?lang=pt-BR&after=${rows.at(-1).accountId}`);
  await page.getByLabel('Início do e-mail').fill(member.email.toUpperCase());
  await page.getByRole('combobox', { name: 'Função', exact: true }).selectOption('member');
  await page.getByRole('combobox', { name: 'Status', exact: true }).selectOption('true');
  await page.getByRole('button', { name: 'Aplicar filtros' }).click();
  await expect(page.getByRole('link', { name: member.email, exact: true })).toBeVisible();
  expect(new URL(page.url()).searchParams.has('after')).toBe(false);
  await expect(page.getByText(administrator.email)).toHaveCount(0);
  await page.setViewportSize({ width: 1280, height: 820 });
  await page.emulateMedia({ colorScheme: 'light' });
  await testInfo.attach('member-lookup-filters', {
    body: await page.screenshot({ path: testInfo.outputPath('member-lookup-filters.png') }),
    contentType: 'image/png',
  });
  await page.getByRole('link', { name: member.email, exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Detalhes do membro' })).toBeVisible();
  await expect(page.getByRole('main').getByText(member.email, { exact: true })).toBeVisible();
  await page.getByRole('banner').getByRole('link', { name: 'Sua conta' }).click();
  await page.getByRole('combobox', { name: 'Idioma' }).selectOption('en');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await page.getByRole('link', { name: 'Back to workspace' }).click();
  await expect(page.getByRole('heading', { name: 'Member details' })).toBeVisible();
  const returned = new URL(page.url());
  expect(returned.pathname).toMatch(/\/members\/[0-9a-f-]{36}$/i);
  expect(returned.searchParams.get('emailPrefix')).toBe(member.email.toUpperCase());
  expect(returned.searchParams.get('role')).toBe('member');
  expect(returned.searchParams.get('active')).toBe('true');
  await page.setViewportSize({ width: 375, height: 820 });
  await page.emulateMedia({ colorScheme: 'dark' });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(375);
  await testInfo.attach('member-lookup-detail', {
    body: await page.screenshot({ path: testInfo.outputPath('member-lookup-detail.png') }),
    contentType: 'image/png',
  });
  await page.getByRole('link', { name: 'Back to members' }).click();
  await expect(page.getByLabel('Email starts with')).toHaveValue(member.email.toUpperCase());
  await expect(page.getByRole('combobox', { name: 'Role', exact: true })).toHaveValue('member');
  await page.getByRole('combobox', { name: 'Status', exact: true }).selectOption('false');
  await page.getByRole('button', { name: 'Apply filters' }).click();
  await expect(page.getByText('No memberships on this page.')).toBeVisible();
  await page.getByRole('link', { name: 'Clear filters' }).click();
  await expect(page.getByRole('link', { name: administrator.email, exact: true })).toBeVisible();

  const detailPath = `${directoryUrl}/${rows.find((row) => row.email === member.email).accountId}`;
  const foreignAdmin = await addMember('administrator', other);
  const foreignSession = await signInApi(foreignAdmin.email, foreignAdmin.password);
  const foreignRows = await request.get(api + '/tenants/' + other + '/members', { headers: foreignSession });
  expect(foreignRows.status()).toBe(200);
  const foreignId = (await foreignRows.json()).items[0].accountId;
  expect((await page.goto(directoryUrl + '/' + foreignId + '?lang=pt-BR'))?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: 'Organização indisponível' })).toBeVisible();
  await expect(page.getByText(foreignAdmin.email)).toHaveCount(0);
  const foreignDetail = `/workspace/${other}/members/${rows.at(-1).accountId}`;
  expect((await page.goto(`${foreignDetail}?lang=pt-BR`))?.status()).toBe(404);
  await expect(page.getByText(member.email)).toHaveCount(0);

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
    expect((await memberPage.goto(`${detailPath}?lang=pt-BR`))?.status()).toBe(404);
    await expect(memberPage.getByText(member.email)).toHaveCount(0);
  } finally {
    await memberContext.close();
  }
});
