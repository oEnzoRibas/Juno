import { randomBytes } from 'node:crypto';
import { expect, test } from '@playwright/test';

const api = process.env.JUNO_SMOKE_API ?? 'http://127.0.0.1:3001';

async function loginApi(request, email, password) {
  const response = await request.post(`${api}/api/auth/sign-in`, { data: { email, password } });
  expect(response.status()).toBe(200);
  return { authorization: `Bearer ${(await response.json()).token}` };
}

async function signIn(page, email, password) {
  await page.goto('/sign-in?lang=pt-BR');
  await page.getByLabel('E-mail', { exact: true }).fill(email);
  await page.getByLabel('Senha', { exact: true }).fill(password);
  await page.getByRole('button', { name: 'Entrar' }).click();
  await expect(page).toHaveURL(/\/session\?lang=pt-BR$/);
}

async function provision(request, headers, slug, name, accent) {
  const response = await request.post(`${api}/api/tenants`, { headers, data: { slug, name, accent } });
  expect(response.status()).toBe(201);
  return (await response.json()).id;
}

async function invite(request, headers, id, email, role) {
  const response = await request.post(`${api}/api/tenants/${id}/invitations`, { headers, data: { email, role } });
  expect(response.status()).toBe(201);
  return (await response.json()).token;
}

test('shows a localized empty organization state and handles a revoked session', async ({ page, request }) => {
  const email = process.env.JUNO_TEST_SHELL_EMPTY_EMAIL;
  const password = process.env.JUNO_TEST_SHELL_EMPTY_PASSWORD;
  if (!email || !password) throw new Error('Bootstrap a separate synthetic account for the empty shell case.');

  await page.goto('/session?lang=pt-BR');
  await expect(page).toHaveURL(/\/sign-in\?lang=pt-BR$/);
  await signIn(page, email, password);
  await expect(page.getByText('Você ainda não participa de uma organização.', { exact: false })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Abrir a administração da plataforma' })).toBeVisible();
  const cookie = (await page.context().cookies()).find(({ name }) => name.endsWith('juno_session'));
  expect(Boolean(cookie?.httpOnly)).toBe(true);
  const revoked = await request.post(`${api}/api/auth/sign-out`, { headers: { authorization: `Bearer ${cookie?.value}` } });
  expect(revoked.status()).toBe(204);
  await page.reload();
  await expect(page).toHaveURL(/\/sign-in\?lang=pt-BR$/);
});

test('switches organizations with server-derived roles, preserves branding, and handles neutral denial', async ({ page, request }) => {
  const adminEmail = process.env.JUNO_TEST_ADMIN_EMAIL;
  const adminPassword = process.env.JUNO_TEST_ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) throw new Error('Bootstrap a synthetic platform administrator.');
  const suffix = randomBytes(5).toString('hex');
  const email = `shell-${suffix}@example.invalid`;
  const password = randomBytes(18).toString('hex');
  const admin = await loginApi(request, adminEmail, adminPassword);

  const firstName = `Núcleo Criativo ${suffix}`;
  const secondName = `Laboratório de Projetos ${suffix}`;
  const first = await provision(request, admin, `shell-a-${suffix}`, firstName, '#7565F5');
  const second = await provision(request, admin, `shell-b-${suffix}`, secondName, '#A99BFF');
  const denied = await provision(request, admin, `shell-c-${suffix}`, 'Another protected organization', '#FFFFFF');
  const firstToken = await invite(request, admin, first, email, 'administrator');
  expect((await request.post(`${api}/api/tenants/activation`, { data: { token: firstToken, password } })).status()).toBe(201);
  const member = await loginApi(request, email, password);
  const secondToken = await invite(request, admin, second, email, 'member');
  expect((await request.post(`${api}/api/tenants/activation`, { headers: member, data: { token: secondToken } })).status()).toBe(201);

  await signIn(page, email, password);
  await expect(page.getByRole('link', { name: 'Abrir a administração da plataforma' })).toHaveCount(0);
  await page.getByRole('link', { name: firstName, exact: true }).click();
  await expect(page.getByRole('heading', { name: firstName })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Convidar membro' })).toBeVisible();
  await expect(page.getByRole('region', { name: firstName })).toHaveCSS('border-top-color', 'rgb(117, 101, 245)');

  await page.reload();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Pular para o conteúdo' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('main')).toBeFocused();
  const switcher = page.locator('details');
  await switcher.locator('summary').focus();
  await page.keyboard.press('Enter');
  await expect(switcher.getByRole('link', { name: firstName })).toHaveAttribute('aria-current', 'true');
  await switcher.getByRole('link', { name: secondName }).click();
  await expect(page).toHaveURL(new RegExp(`/workspace/${second}\\?lang=pt-BR$`));
  await expect(page.getByRole('heading', { name: secondName })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Convidar membro' })).toHaveCount(0);
  await expect(page.getByRole('region', { name: secondName })).toHaveCSS('border-top-color', 'rgb(169, 155, 255)');

  await page.emulateMedia({ colorScheme: 'dark' });
  await page.setViewportSize({ width: 320, height: 760 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
  await page.getByRole('link', { name: 'English', exact: true }).click();
  await expect(page).toHaveURL(new RegExp(`/workspace/${second}$`));
  await expect(page.getByRole('navigation', { name: 'Workspace navigation' })).toBeVisible();

  for (const id of [denied, 'invalid']) {
    const response = await page.goto(`/workspace/${id}?lang=pt-BR`);
    expect(response?.status()).toBe(404);
    await expect(page.getByRole('heading', { name: 'Organização indisponível' })).toBeVisible();
    await expect(page.getByText('Another protected organization')).toHaveCount(0);
  }
  await page.getByRole('link', { name: 'Suas organizações' }).click();
  await expect(page).toHaveURL(/\/session\?lang=pt-BR$/);
  await page.getByRole('button', { name: 'Sair' }).click();
  await expect(page).toHaveURL(/\/sign-in\?lang=pt-BR$/);
});
