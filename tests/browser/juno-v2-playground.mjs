import { chromium, expect } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
const out = process.env.JUNO_PLAYGROUND_EVIDENCE;
if (out) await mkdir(out, { recursive: true });
const browser = await chromium.launch({ channel: process.env.JUNO_BROWSER_CHANNEL ?? 'chrome' });
const p = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const faults = [];
const external = [];
p.on('pageerror', (e) => faults.push(String(e)));
p.on('request', (r) => {
  if (!r.url().startsWith('http://127.0.0.1:3304/')) external.push(r.url());
});
const screen = (name) => p.locator('select[name=screen]').selectOption(name);
const action = (name) => p.locator('button[data-action="' + name + '"]:visible').first();
const proof = [];
try {
  await p.goto('http://127.0.0.1:3304/');
  await p.evaluate(() => document.fonts.ready);
  expect(await p.evaluate(() => [...document.fonts].some((f) => f.family === 'Nunito' && f.status === 'loaded'))).toBe(
    true,
  );
  if (out) await p.screenshot({ path: join(out, 'desktop-members.png'), fullPage: true });
  await action('compact').click();
  await expect(p.locator('.shell')).toHaveAttribute('data-compact', 'true');
  await action('compact').click();
  await p.locator('input[name=prefix]').fill('ANA@');
  await p.getByRole('button', { name: 'Aplicar filtros', exact: true }).click();
  await expect(p.locator('tbody tr')).toHaveCount(1);
  const member = p.locator('table [data-member]').first();
  await member.click();
  await expect(p.getByRole('dialog', { name: 'Ana Costa' })).toBeVisible();
  await p.keyboard.press('Escape');
  await expect(member).toBeFocused();
  await p.locator('input[name=prefix]').fill('nobody');
  await p.getByRole('button', { name: 'Aplicar filtros', exact: true }).click();
  await expect(p.getByText('Nenhum membro corresponde aos filtros.')).toBeVisible();
  await action('reset').click();
  await action('switcher').click();
  await p.locator('dialog [data-org=coral]').click();
  await expect(p.getByRole('heading', { name: 'Estúdio Horizonte' })).toBeVisible();
  await expect(p.locator('.rail [data-action=members]')).toHaveCount(0);
  await screen('auth');
  await p.getByRole('button', { name: 'Entrar', exact: true }).click();
  await expect(p.getByLabel('E-mail', { exact: true })).toBeFocused();
  await expect(p.getByText('Digite um e-mail válido.')).toBeVisible();
  await p.getByLabel('E-mail', { exact: true }).fill('demo@example.invalid');
  await p.getByLabel('Senha', { exact: true }).fill('example password');
  await action('reveal').click();
  await expect(p.getByLabel('Senha', { exact: true })).toHaveAttribute('type', 'text');
  await action('reveal').click();
  await p.getByRole('button', { name: 'Entrar', exact: true }).click();
  await expect(p.getByRole('heading', { name: 'Organizações', exact: true })).toBeVisible();
  await screen('platform');
  await p.getByLabel('Nome da organização', { exact: true }).fill('Example Studio');
  const slug = p.getByLabel('Identificador da organização', { exact: true });
  await slug.fill('EXAMPLE');
  expect(await slug.evaluate((input) => input.validity.patternMismatch)).toBe(true);
  await slug.fill('example-studio');
  await p.getByRole('button', { name: 'Simular criação', exact: true }).click();
  await expect(p.getByText('Prévia enviada. Nenhum dado foi transmitido.')).toBeVisible();
  if (out) await p.screenshot({ path: join(out, 'desktop-platform.png'), fullPage: true });
  await screen('library');
  await p.getByLabel('Contato por e-mail').uncheck();
  await p.getByLabel('Mais tarde').check();
  await p.locator('select[name=sample-role]').selectOption('admin');
  await action('loading').click();
  await expect(p.locator('#feedback-example')).toContainText('Carregando');
  await expect(p.locator('#feedback-example')).toContainText('Exemplo salvo');
  await p.locator('select[name=feedback]').selectOption('error');
  await expect(p.locator('#feedback-example')).toContainText('Este é um erro');
  await action('confirm').click();
  await p.getByRole('button', { name: 'Confirmar', exact: true }).click();
  await expect(p.locator('#announcements')).toContainText('Ação de exemplo concluída.');
  await p.locator('select[name=theme]').first().selectOption('dark');
  await p.locator('select[name=palette]').selectOption('teal');
  await p.locator('select[name=lang]').first().selectOption('en');
  await p.locator('select[name=font]').selectOption('system');
  await expect(p.locator('html')).toHaveAttribute('lang', 'en');
  await expect(p.locator('html')).toHaveAttribute('data-font', 'system');
  if (out) await p.screenshot({ path: join(out, 'desktop-components.png'), fullPage: true });
  for (const width of [320, 375, 390, 768, 1024, 1280, 1920]) {
    await p.setViewportSize({ width, height: 900 });
    await screen('library');
    await action('tip').click();
    const overflow = await p.locator('#popover').evaluate((el) => {
      const r = el.getBoundingClientRect();
      return r.left < 0 || r.right > innerWidth || r.top < 0 || r.bottom > innerHeight;
    });
    expect(overflow).toBe(false);
    await p.keyboard.press('Escape');
    await expect(p.locator('#popover')).toBeHidden();
    const widthResult = await p.evaluate(() => ({
      viewport: innerWidth,
      document: document.documentElement.scrollWidth,
    }));
    expect(widthResult.document).toBeLessThanOrEqual(widthResult.viewport);
    proof.push({ ...widthResult, popoverWithinViewport: !overflow });
  }
  await p.setViewportSize({ width: 1280, height: 900 });
  await p.locator('select[name=width]').selectOption('320');
  await screen('dashboard');
  await expect(p.locator('#preview')).toHaveCSS('width', '320px');
  const drawer = action('drawer');
  await drawer.focus();
  await p.keyboard.press('Enter');
  const drawerPanel = p.getByRole('dialog', { name: 'Workspace actions' });
  await expect(drawerPanel).toBeVisible();
  const drawerRect = await drawerPanel.boundingBox();
  const previewRect = await p.locator('#preview').boundingBox();
  expect(drawerRect.x).toBeCloseTo(previewRect.x, 0);
  expect(drawerRect.width).toBeLessThan(previewRect.width);
  await p.keyboard.press('Tab');
  expect(await drawerPanel.evaluate((panel) => panel.contains(document.activeElement))).toBe(true);
  await p.keyboard.press('Escape');
  await expect(drawer).toBeFocused();
  await p.locator('.bottom [data-action=account]').click();
  await expect(p.getByRole('heading', { name: 'Account', exact: true })).toBeVisible();
  await p.setViewportSize({ width: 390, height: 900 });
  await p.locator('select[name=width]').selectOption('auto');
  if (out) await p.screenshot({ path: join(out, 'mobile-account.png'), fullPage: true });
  expect(faults).toEqual([]);
  expect(external).toEqual([]);
  if (out)
    await writeFile(
      join(out, 'validation.json'),
      JSON.stringify({ viewports: proof, scriptErrors: faults, externalRequests: external }, null, 2) + '\n',
    );
  console.log(
    'Validated interactions, typography, localization, actual and emulated mobile, bounds at seven widths, and absence of external requests.',
  );
} finally {
  await browser.close();
}
