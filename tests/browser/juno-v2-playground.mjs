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
const reviewToggle = p.locator('#review-toggle');
const reviewOptions = p.locator('#review-options');
async function option(name, value) {
  await reviewToggle.click();
  const control = reviewOptions.locator('select[name=' + name + ']');
  await control.focus();
  await control.selectOption(value);
  if (name !== 'screen') await p.keyboard.press('Escape');
  await expect(reviewOptions).toBeHidden();
}
const screen = (name) => option('screen', name);
const action = (name) => p.locator('button[data-action="' + name + '"]:visible').first();
const proof = [];
try {
  await p.goto('http://127.0.0.1:3304/');
  await expect(reviewOptions).toBeHidden();
  await reviewToggle.focus();
  await p.keyboard.press('Enter');
  await expect(reviewOptions).toBeVisible();
  await p.keyboard.press('Tab');
  await expect(reviewOptions.locator('select[name=screen]')).toBeFocused();
  await p.keyboard.press('Escape');
  await expect(reviewOptions).toBeHidden();
  await expect(reviewToggle).toBeFocused();
  await reviewToggle.click();
  await p.locator('#screen-title').click();
  await expect(reviewOptions).toBeHidden();
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
  await option('theme', 'dark');
  await option('palette', 'teal');
  await option('lang', 'en');
  await expect(p.locator('#announcements')).toBeEmpty();
  await option('font', 'system');
  await expect(p.locator('html')).toHaveAttribute('lang', 'en');
  await expect(p.locator('html')).toHaveAttribute('data-font', 'system');
  if (out) await p.screenshot({ path: join(out, 'desktop-components.png'), fullPage: true });
  for (const width of [320, 375, 390, 768, 1024, 1280, 1920]) {
    await p.setViewportSize({ width, height: 900 });
    await reviewToggle.click();
    const menuFits = await reviewOptions.evaluate((menu) => {
      const bounds = menu.getBoundingClientRect();
      return bounds.left >= 0 && bounds.right <= innerWidth && bounds.top >= 0 && bounds.bottom <= innerHeight;
    });
    expect(menuFits).toBe(true);
    await p.keyboard.press('Escape');
    await expect(reviewOptions).toBeHidden();
    await screen('library');
    await expect(p.locator('#screen-title')).toBeFocused();
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
    proof.push({ ...widthResult, popoverWithinViewport: !overflow, optionsMenuWithinViewport: menuFits });
  }
  await p.setViewportSize({ width: 1280, height: 900 });
  await option('width', '320');
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
  await option('width', 'auto');
  if (out) await p.screenshot({ path: join(out, 'mobile-account.png'), fullPage: true });
  await reviewToggle.click();
  if (out) await p.screenshot({ path: join(out, 'mobile-options.png') });
  await p.locator('#screen-title').click({ position: { x: 4, y: 4 }, force: true });
  await p.keyboard.press('Escape');
  await expect(reviewOptions).toBeHidden();
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
