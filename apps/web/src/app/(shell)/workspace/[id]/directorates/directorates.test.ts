import { beforeEach, expect, test, vi } from 'vitest';
import { createDirectorate } from './actions';
import { directorateHref, loadDirectorates } from './directorate-data';
import { directorateMessages } from '../../../../../content/directorates';

const mocks = vi.hoisted(() => ({ request: vi.fn(), shell: vi.fn(), cookie: vi.fn(), revalidate: vi.fn() }));
vi.mock('next/headers', () => ({ cookies: async () => ({ get: mocks.cookie }) }));
vi.mock('next/cache', () => ({ revalidatePath: mocks.revalidate }));
vi.mock('next/navigation', () => ({
  notFound: () => {
    throw new Error('notFound');
  },
  redirect: (path: string) => {
    throw new Error('redirect:' + path);
  },
}));
vi.mock('../../../../../server/juno-api', () => ({ apiRequest: mocks.request, sessionCookie: 'session' }));
vi.mock('../../../_components/shell-data', () => ({
  loadShell: mocks.shell,
  localPath: (path: string, locale: string) => path + (locale === 'pt-BR' ? '?lang=pt-BR' : ''),
}));
const id = '11111111-1111-4111-8111-111111111111';
function create(name = 'Product', locale: 'en' | 'pt-BR' = 'en') {
  const form = new FormData();
  form.set('name', name);
  return createDirectorate(id, locale, { status: 'idle' }, form);
}
beforeEach(() => {
  vi.resetAllMocks();
  mocks.cookie.mockReturnValue({ value: 'synthetic-token' });
  mocks.shell.mockResolvedValue({ workspace: { id, role: 'administrator' } });
});

test('creates with trimmed display spelling and refreshes the scoped list only on 201', async () => {
  mocks.request.mockResolvedValue(new Response('{}', { status: 201 }));
  expect(await create('\t Produção \n')).toEqual({ status: 'created' });
  expect(mocks.request).toHaveBeenCalledWith(
    'tenants/' + id + '/directorates',
    expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ name: 'Produção' }),
      headers: { authorization: 'Bearer synthetic-token', 'content-type': 'application/json' },
    }),
  );
  expect(mocks.revalidate).toHaveBeenCalledWith('/workspace/' + id + '/directorates');
});
test('respects the Unicode code point limit and rejects controls and malformed surrogates', async () => {
  for (const value of ['', '  ', 'x'.repeat(121), 'a\nb', 'a\0']) {
    expect(await create(value)).toEqual({ status: 'invalid' });
  }
  expect(mocks.request).not.toHaveBeenCalled();
  const malformed = new FormData();
  // Native FormData converts unpaired surrogates to U+FFFD; exercise the guard directly.
  vi.spyOn(malformed, 'get').mockReturnValue('\ud800');
  expect(await createDirectorate(id, 'en', { status: 'idle' }, malformed)).toEqual({ status: 'invalid' });
  mocks.request.mockResolvedValue(new Response('{}', { status: 201 }));
  expect(await create('🐺'.repeat(120))).toEqual({ status: 'created' });
});
test('rechecks authorization before creation even when the UI was previously visible', async () => {
  mocks.shell.mockResolvedValue({ workspace: { id, role: 'member' } });
  await expect(create()).rejects.toThrow('notFound');
  mocks.shell.mockResolvedValue({ workspace: undefined });
  await expect(create()).rejects.toThrow('notFound');
  expect(mocks.request).not.toHaveBeenCalled();
});
test.each([
  [400, 'invalid'],
  [409, 'duplicate'],
  [503, 'unavailable'],
  [500, 'unavailable'],
])('maps API status %s into localized safe feedback', async (status, expected) => {
  mocks.request.mockResolvedValue(new Response('private backend detail', { status: Number(status) }));
  expect(await create()).toEqual({ status: expected });
  expect(mocks.revalidate).not.toHaveBeenCalled();
});
test('redirects expired sessions with locale and masks tenant denials', async () => {
  mocks.request.mockResolvedValue(new Response('', { status: 401 }));
  await expect(create('Product', 'pt-BR')).rejects.toThrow('redirect:/sign-in?lang=pt-BR');
  for (const status of [403, 404]) {
    mocks.request.mockResolvedValue(new Response('', { status }));
    await expect(create()).rejects.toThrow('notFound');
    await expect(loadDirectorates(id, 'en')).rejects.toThrow('notFound');
  }
  mocks.cookie.mockReturnValue(undefined);
  await expect(loadDirectorates(id, 'en')).rejects.toThrow('redirect:/sign-in');
});
test('loads an empty page or the exact next cursor with server authentication', async () => {
  const data = { items: [], nextCursor: id };
  mocks.request.mockResolvedValue(Response.json(data));
  expect(await loadDirectorates(id, 'en', id)).toEqual({ status: 'ready', ...data });
  expect(mocks.request).toHaveBeenCalledWith('tenants/' + id + '/directorates?after=' + id, {
    headers: { authorization: 'Bearer synthetic-token' },
  });
  expect(directorateHref(id, 'pt-BR', id)).toBe('/workspace/' + id + '/directorates?lang=pt-BR&after=' + id);
  expect(directorateHref(id, 'en')).toBe('/workspace/' + id + '/directorates');
});
test('rejects malformed cursors and handles unavailable API safely', async () => {
  expect(await loadDirectorates(id, 'en', '../private')).toEqual({ status: 'invalidPage' });
  expect(mocks.request).not.toHaveBeenCalled();
  mocks.request.mockRejectedValue(new Error('internal address'));
  expect(await loadDirectorates(id, 'en')).toEqual({ status: 'unavailable' });
  expect(await create()).toEqual({ status: 'unavailable' });
});
test('has consistent English and Portuguese feedback keys', () => {
  expect(Object.keys(directorateMessages.en)).toEqual(Object.keys(directorateMessages['pt-BR']));
  expect(directorateMessages.en.title).toBe('Directorates');
  expect(directorateMessages['pt-BR'].title).toBe('Diretorias');
});
