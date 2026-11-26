import { randomBytes } from 'node:crypto';
import { expect, test } from '@playwright/test';

function luminance(color) {
  const rgb = color.match(/^rgb\((\d+), (\d+), (\d+)\)$/);
  if (!rgb) throw new Error('Expected an opaque RGB color');
  const channels = rgb
    .slice(1)
    .map(Number)
    .map((value) => {
      const channel = value / 255;
      return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
    });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrast(first, second) {
  const [dark, light] = [luminance(first), luminance(second)].sort((a, b) => a - b);
  return (light + 0.05) / (dark + 0.05);
}

for (const theme of ['light', 'dark']) {
  test(`sign-in and activation preserve focus and contrast in ${theme} mode`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: theme });
    await page.setViewportSize({ width: 320, height: 740 });
    await page.goto('/sign-in?lang=pt-BR&error=1&activated=1');
    await expect(page.getByRole('main')).toHaveAttribute('lang', 'pt-BR');
    const email = page.getByLabel('E-mail', { exact: true });
    const password = page.getByLabel('Senha', { exact: true });
    const submit = page.getByRole('button', { name: 'Entrar' });
    const alert = page.getByRole('alert').filter({ hasText: 'Não foi possível entrar' });
    const status = page.getByRole('status').filter({ hasText: 'Convite aceito' });

    await expect(page.getByRole('heading', { name: 'Entrar' })).toBeVisible();
    await expect(page.locator('body')).toHaveCSS(
      'background-color',
      theme === 'light' ? 'rgb(248, 245, 253)' : 'rgb(24, 18, 34)',
    );
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Juno' })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'English' })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(email).toBeFocused();
    await expect(email).toHaveCSS('outline-width', '3px');
    const field = await email.evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        border: style.borderTopColor,
        focus: style.outlineColor,
        panel: getComputedStyle(element.closest('section')).backgroundColor,
      };
    });
    expect(contrast(field.border, field.panel)).toBeGreaterThanOrEqual(3);
    expect(contrast(field.focus, field.panel)).toBeGreaterThanOrEqual(3);

    await page.keyboard.press('Tab');
    await expect(password).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Mostrar' })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(submit).toBeFocused();
    const buttonsAndMessages = await Promise.all(
      [submit, alert, status].map((locator) =>
        locator.evaluate((element) => {
          const style = getComputedStyle(element);
          return [style.color, style.backgroundColor];
        }),
      ),
    );
    for (const [text, surface] of buttonsAndMessages) {
      expect(contrast(text, surface)).toBeGreaterThanOrEqual(4.5);
    }
    expect(await submit.evaluate((element) => element.getBoundingClientRect().height)).toBeGreaterThanOrEqual(44);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);

    await page.goto('/activate');
    await expect(page.getByRole('heading', { name: 'Accept invitation' })).toBeVisible();
    await expect(page.getByLabel('Invitation code')).toBeVisible();
    await expect(page.getByLabel('Choose a password')).toHaveAttribute('autocomplete', 'new-password');
    await expect(page.getByRole('main')).toHaveAttribute('lang', 'en');
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
  });
}

test('preserves separate tenant accents and shared accessible controls', async ({ page, request }) => {
  const api = process.env.JUNO_SMOKE_API ?? 'http://127.0.0.1:3001';
  const email = process.env.JUNO_TEST_ADMIN_EMAIL;
  const password = process.env.JUNO_TEST_ADMIN_PASSWORD;
  if (!email || !password) throw new Error('Bootstrap a synthetic platform administrator to validate tenant branding.');

  const login = await request.post(`${api}/api/auth/sign-in`, { data: { email, password } });
  expect(login.status()).toBe(200);
  const token = (await login.json()).token;
  const headers = { authorization: `Bearer ${token}` };
  const suffix = randomBytes(6).toString('hex');

  await page.goto('/sign-in');
  await page.getByLabel('Email address', { exact: true }).fill(email);
  await page.getByLabel('Password', { exact: true }).fill(password);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.waitForURL('**/session');

  try {
    for (const [index, accent, rendered] of [
      [1, '#FFFFFF', 'rgb(255, 255, 255)'],
      [2, '#10111A', 'rgb(16, 17, 26)'],
    ]) {
      const name = `Design system tenant ${index} ${suffix}`;
      const created = await request.post(`${api}/api/tenants`, {
        headers,
        data: { name, slug: `design-${index}-${suffix}`, accent },
      });
      expect(created.status()).toBe(201);
      const { id } = await created.json();
      const invitation = await request.post(`${api}/api/tenants/${id}/invitations`, {
        headers,
        data: { email, role: 'administrator' },
      });
      expect(invitation.status()).toBe(201);
      const activation = await request.post(`${api}/api/tenants/activation`, {
        headers,
        data: { token: (await invitation.json()).token },
      });
      expect(activation.status()).toBe(201);

      for (const theme of ['light', 'dark']) {
        await page.emulateMedia({ colorScheme: theme });
        await page.goto(`/workspace/${id}`);
        await expect(page.getByRole('heading', { name })).toBeVisible();
        const panel = page.getByRole('region', { name });
        await expect(panel).toHaveCSS('border-top-color', rendered);
        await expect(panel).toHaveCSS('border-top-width', '8px');
        await expect(page.getByRole('button', { name: 'Create invitation' })).toHaveCSS(
          'background-color',
          theme === 'light' ? 'rgb(99, 50, 186)' : 'rgb(201, 174, 255)',
        );
      }
    }
  } finally {
    await request.post(`${api}/api/auth/sign-out`, { headers });
  }
});
