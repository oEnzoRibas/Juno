import { randomBytes } from 'node:crypto';
import { expect, test } from '@playwright/test';

const api = process.env.JUNO_SMOKE_API ?? 'http://127.0.0.1:3001';
const platformEmail = process.env.JUNO_TEST_ADMIN_EMAIL;
const platformPassword = process.env.JUNO_TEST_ADMIN_PASSWORD;

async function signIn(page, email, password) {
  await page.goto('/sign-in?lang=pt-BR');
  await page.getByLabel('E-mail', { exact: true }).fill(email);
  await page.getByLabel('Senha', { exact: true }).fill(password);
  await page.getByRole('button', { name: 'Entrar' }).click();
  await expect(page).toHaveURL(/\/session\?lang=pt-BR$/);
}

async function login(request, email, password) {
  const result = await request.post(`${api}/api/auth/sign-in`, { data: { email, password } });
  expect(result.status()).toBe(200);
  return { authorization: `Bearer ${(await result.json()).token}` };
}

test('provisions a branded tenant, activates its administrator and enforces tenant isolation', async ({
  browser,
  page,
  request,
}) => {
  if (!platformEmail || !platformPassword)
    throw new Error('Bootstrap a synthetic platform admin before running this test.');
  const suffix = randomBytes(6).toString('hex');
  const organization = `Studio ${suffix}`;
  const email = `administrator-${suffix}@example.invalid`;
  const password = randomBytes(18).toString('hex');
  const platformHeaders = await login(request, platformEmail, platformPassword);

  const other = await request.post(`${api}/api/tenants`, {
    headers: platformHeaders,
    data: { slug: `other-${suffix}`, name: 'Other organization', accent: '#A99BFF' },
  });
  expect(other.status()).toBe(201);
  const otherId = (await other.json()).id;
  expect((await request.get(`${api}/api/tenants/${otherId}`, { headers: platformHeaders })).status()).toBe(404);

  await signIn(page, platformEmail, platformPassword);
  await page.getByRole('link', { name: 'Abrir a administração da plataforma' }).click();
  await page.getByLabel('Nome da organização').fill(organization);
  await page.getByLabel('Identificador da organização').fill(`studio-${suffix}`);
  await page.getByLabel('Cor da marca').fill('#5543cf');
  await page.getByRole('button', { name: 'Criar organização' }).click();
  await expect(page.getByText('Organização criada.')).toBeVisible();
  await page.getByLabel('E-mail', { exact: true }).fill(email);
  await page.getByRole('button', { name: 'Criar convite' }).click();
  await expect(page.getByLabel('Link de convite de uso único')).toHaveValue(
    /\/activate\?lang=pt-BR#token=[a-f0-9]{64}$/,
  );
  const link = await page.getByLabel('Link de convite de uso único').inputValue();
  const invitation = new URLSearchParams(new URL(link).hash.slice(1)).get('token');

  const memberContext = await browser.newContext();
  try {
    const tenantPage = await memberContext.newPage();
    await tenantPage.goto(link);
    const code = tenantPage.getByLabel('Código do convite');
    await expect(code).toHaveValue(/^[a-f0-9]{64}$/);
    await tenantPage.getByRole('link', { name: 'English' }).click();
    await expect(tenantPage.getByRole('heading', { name: 'Accept invitation' })).toBeVisible();
    await expect(tenantPage.getByLabel('Invitation code')).toHaveValue(/^[a-f0-9]{64}$/);
    await tenantPage.getByRole('link', { name: 'Português (Brasil)' }).click();
    await expect(code).toHaveValue(/^[a-f0-9]{64}$/);
    await tenantPage.getByLabel('Escolha uma senha').fill(password);
    await tenantPage.getByRole('button', { name: 'Aceitar convite' }).click();
    await expect(tenantPage.getByText('Convite aceito. Entre para abrir sua organização.')).toBeVisible();
    await signIn(tenantPage, email, password);
    await tenantPage.getByRole('link', { name: organization }).click();
    await expect(tenantPage.getByRole('heading', { name: organization })).toBeVisible();
    await expect(tenantPage.getByText('Administrador', { exact: true })).toBeVisible();
    await expect(tenantPage.locator('section[aria-labelledby="workspace-title"]')).toHaveCSS(
      'border-top-color',
      'rgb(85, 67, 207)',
    );

    const headers = await login(request, email, password);
    const own = await request.get(`${api}/api/tenants`, { headers });
    expect(own.status()).toBe(200);
    const workspaces = await own.json();
    expect(workspaces).toHaveLength(1);
    expect(workspaces[0].name).toBe(organization);
    expect((await request.get(`${api}/api/tenants/${otherId}`, { headers })).status()).toBe(404);
    expect(
      (
        await request.post(`${api}/api/tenants/${otherId}/invitations`, {
          headers,
          data: { email: `cross-${suffix}@example.invalid`, role: 'member' },
        })
      ).status(),
    ).toBe(403);
    expect(
      (
        await request.post(`${api}/api/tenants`, {
          headers,
          data: { slug: `unexpected-${suffix}`, name: 'Unexpected', accent: '#A99BFF' },
        })
      ).status(),
    ).toBe(403);
    expect(
      (
        await request.post(`${api}/api/tenants/activation`, {
          data: { token: invitation, password },
        })
      ).status(),
    ).toBe(400);

    const ownId = workspaces[0].id;
    const memberEmail = `member-${suffix}@example.invalid`;
    const result = await request.post(`${api}/api/tenants/${ownId}/invitations`, {
      headers,
      data: { email: memberEmail, role: 'member' },
    });
    expect(result.status()).toBe(201);
    const memberToken = (await result.json()).token;
    const memberPass = randomBytes(18).toString('hex');
    const attempts = await Promise.all(
      [1, 2].map(() =>
        request.post(`${api}/api/tenants/activation`, {
          data: { token: memberToken, password: memberPass },
        }),
      ),
    );
    expect(attempts.map((result) => result.status()).sort()).toEqual([201, 400]);
    const memberHeaders = await login(request, memberEmail, memberPass);
    expect(
      (
        await request.post(`${api}/api/tenants/${ownId}/invitations`, {
          headers: memberHeaders,
          data: { email: `denied-${suffix}@example.invalid`, role: 'member' },
        })
      ).status(),
    ).toBe(403);

    const crossTenantPage = await tenantPage.goto(new URL(`/workspace/${otherId}`, link).toString());
    expect(crossTenantPage?.status()).toBe(404);
    await expect(tenantPage.getByText('Other organization')).toHaveCount(0);
  } finally {
    await memberContext.close();
  }
});
