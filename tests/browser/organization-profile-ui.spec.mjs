import { randomBytes } from 'node:crypto';
import { expect, test } from '@playwright/test';

test('updates an organization profile and preserves membership and tenant boundaries', async ({ page, browser, request }, testInfo) => {
  const api = (process.env.JUNO_SMOKE_API ?? 'http://127.0.0.1:3001') + '/api';
  const admin = process.env.JUNO_TEST_ADMIN_EMAIL;
  const password = process.env.JUNO_TEST_ADMIN_PASSWORD;
  if (!admin || !password) throw new Error('Bootstrap the synthetic platform administrator first.');
  const suffix = randomBytes(6).toString('hex');
  const name = 'Estúdio Aurora';

  async function signIn(email, secret) {
    const response = await request.post(api + '/auth/sign-in', { data: { email, password: secret } });
    expect(response.status()).toBe(200);
    return { authorization: 'Bearer ' + (await response.json()).token };
  }

  async function webSignIn(target, email, secret) {
    await target.goto('/sign-in?lang=pt-BR');
    await target.getByLabel('E-mail', { exact: true }).fill(email);
    await target.getByLabel('Senha', { exact: true }).fill(secret);
    await target.getByRole('button', { name: 'Entrar', exact: true }).click();
    await expect(target).toHaveURL(/\/session\?lang=pt-BR$/);
  }

  const platform = await signIn(admin, password);

  async function createOrganization(slug, title, accent) {
    const response = await request.post(api + '/tenants', {
      headers: platform,
      data: { slug, name: title, accent },
    });
    expect(response.status()).toBe(201);
    return (await response.json()).id;
  }

  const slug = 'profile-ui-' + suffix;
  const id = await createOrganization(slug, name, '#7565F5');
  const other = await createOrganization('other-' + suffix, 'Other organization', '#111111');
  const workspace = '/workspace/' + id;
  const settings = workspace + '/settings';
  expect((await page.goto(settings + '?lang=pt-BR'))?.status()).toBe(200);
  await expect(page).toHaveURL(/\/sign-in\?lang=pt-BR$/);

  async function invite(tenant, role, label) {
    const email = label + '-' + suffix + '@example.invalid';
    const secret = randomBytes(18).toString('hex');
    const response = await request.post(api + '/tenants/' + tenant + '/invitations', {
      headers: platform,
      data: { email, role },
    });
    expect(response.status()).toBe(201);
    const activation = await request.post(api + '/tenants/activation', {
      data: { token: (await response.json()).token, password: secret },
    });
    expect(activation.status()).toBe(201);
    return { email, secret };
  }

  const operator = await invite(id, 'administrator', 'profile-admin');
  const member = await invite(id, 'member', 'profile-member');
  const otherAdmin = await invite(other, 'administrator', 'other-admin');

  await webSignIn(page, operator.email, operator.secret);
  expect((await page.goto(settings + '?lang=pt-BR'))?.status()).toBe(200);
  const panel = page.getByRole('region', { name: 'Perfil da organização' });
  const field = panel.getByRole('textbox', { name: 'Nome da organização' });
  const accent = panel.getByRole('textbox', { name: 'Cor de destaque' });
  const save = panel.getByRole('button', { name: 'Salvar perfil' });
  await expect(field).toHaveValue(name);
  await expect(accent).toHaveValue('#7565F5');

  await field.fill('   ');
  await save.click();
  await expect(panel.getByRole('alert')).toContainText('Digite um nome de 1 a 120 caracteres');
  await expect(field).toHaveAttribute('aria-invalid', 'true');
  await expect(field).toHaveValue('   ');

  const updatedName = 'Estúdio Aurora Renovado';
  await field.fill('  ' + updatedName + '  ');
  await accent.fill('#1a698b');
  await save.click();
  await expect(panel.getByRole('status')).toHaveText('Perfil da organização salvo.');
  await expect(field).toHaveValue(updatedName);
  await expect(accent).toHaveValue('#1A698B');
  await expect(panel).toHaveCSS('border-top-color', 'rgb(26, 105, 139)');
  await testInfo.attach('organization-profile-desktop', {
    body: await page.screenshot({ path: testInfo.outputPath('organization-profile-desktop.png') }),
    contentType: 'image/png',
  });

  await page.getByRole('link', { name: 'English', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Organization profile' })).toBeVisible();
  await page.setViewportSize({ width: 320, height: 790 });
  await page.emulateMedia({ colorScheme: 'dark' });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
  await page.getByRole('textbox', { name: 'Organization name' }).focus();
  await expect(page.getByRole('textbox', { name: 'Organization name' })).toBeFocused();
  await testInfo.attach('organization-profile-mobile', {
    body: await page.screenshot({ path: testInfo.outputPath('organization-profile-mobile.png'), fullPage: true }),
    contentType: 'image/png',
  });
  await page.getByRole('link', { name: 'Back to dashboard' }).click();
  await expect(page.getByRole('heading', { name: updatedName })).toBeVisible();

  const current = await request.get(api + '/tenants/' + id, { headers: await signIn(operator.email, operator.secret) });
  expect(current.status()).toBe(200);
  expect(await current.json()).toMatchObject({ id, slug, name: updatedName, accent: '#1A698B' });
  const foreign = await request.get(api + '/tenants/' + other, { headers: await signIn(otherAdmin.email, otherAdmin.secret) });
  expect(foreign.status()).toBe(200);
  expect(await foreign.json()).toMatchObject({ id: other, name: 'Other organization', accent: '#111111' });

  for (const account of [member, otherAdmin, { email: admin, secret: password }]) {
    const context = await browser.newContext();
    try {
      const visitor = await context.newPage();
      await webSignIn(visitor, account.email, account.secret);
      expect((await visitor.goto(settings + '?lang=pt-BR'))?.status()).toBe(404);
      await expect(visitor.getByRole('heading', { name: 'Organização indisponível' })).toBeVisible();
      await expect(visitor.getByText(updatedName, { exact: true })).toHaveCount(0);
    } finally {
      await context.close();
    }
  }
});
