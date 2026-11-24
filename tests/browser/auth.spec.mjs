import { expect, test } from '@playwright/test';

const email = process.env.JUNO_TEST_ADMIN_EMAIL;
const password = process.env.JUNO_TEST_ADMIN_PASSWORD;

test('signs in through the localized web form and revokes the server session', async ({ page, request }) => {
  if (!email || !password) throw new Error('Bootstrap a synthetic admin and set the test account variables.');
  const api = process.env.JUNO_SMOKE_API ?? 'http://127.0.0.1:3001';

  await page.goto('/session?lang=pt-BR');
  await expect(page).toHaveURL(/\/sign-in\?lang=pt-BR$/);
  await page.getByLabel('E-mail', { exact: true }).fill(email);
  await page.getByLabel('Senha', { exact: true }).fill('invalid synthetic password');
  await page.getByRole('button', { name: 'Entrar' }).click();
  await expect(page.getByRole('alert').filter({ hasText: 'Não foi possível entrar' })).toBeVisible();

  await page.getByLabel('E-mail', { exact: true }).fill(email);
  await page.getByLabel('Senha', { exact: true }).fill(password);
  await page.getByRole('button', { name: 'Entrar' }).click();
  await expect(page.getByRole('heading', { name: 'Administração da plataforma' })).toBeVisible();

  const cookie = (await page.context().cookies()).find(({ name }) => name.endsWith('juno_session'));
  expect(Boolean(cookie?.httpOnly)).toBe(true);
  expect(cookie?.sameSite).toBe('Strict');
  const headers = { authorization: `Bearer ${cookie?.value}` };
  const session = await request.get(`${api}/api/auth/session`, { headers });
  expect(session.status()).toBe(200);
  expect((await session.json()).platformAdmin).toBe(true);

  await page.getByRole('button', { name: 'Sair' }).click();
  await expect(page).toHaveURL(/\/sign-in\?lang=pt-BR$/);
  const revoked = await request.get(`${api}/api/auth/session`, { headers });
  expect(revoked.status()).toBe(401);
});
