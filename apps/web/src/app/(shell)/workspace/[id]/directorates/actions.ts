'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { apiRequest, sessionCookie } from '../../../../../server/juno-api';
import { loadShell, localPath, type ShellLocale } from '../../../_components/shell-data';

export type CreateResult = { status: 'idle' | 'created' | 'invalid' | 'duplicate' | 'unavailable' };

/** Recheck the active membership on every submission; the API owns final authorization and uniqueness. */
export async function createDirectorate(
  id: string,
  locale: ShellLocale,
  _: CreateResult,
  form: FormData,
): Promise<CreateResult> {
  const { workspace } = await loadShell(locale, id);
  if (workspace?.role !== 'administrator') notFound();
  const token = (await cookies()).get(sessionCookie)?.value;
  if (!token) redirect(localPath('/sign-in', locale));
  const value = form.get('name');
  const name = typeof value === 'string' ? value.trim() : '';
  // String iteration counts Unicode code points, unlike HTML's UTF-16 maxlength.
  if (!name || [...name].length > 120 || /[\p{Cc}\p{Cs}]/u.test(name)) return { status: 'invalid' };
  const response = await apiRequest('tenants/' + workspace.id + '/directorates', {
    method: 'POST',
    headers: { authorization: 'Bearer ' + token, 'content-type': 'application/json' },
    body: JSON.stringify({ name }),
  }).catch(() => undefined);
  if (response?.status === 401) redirect(localPath('/sign-in', locale));
  if (response?.status === 403 || response?.status === 404) notFound();
  if (response?.status === 400) return { status: 'invalid' };
  if (response?.status === 409) return { status: 'duplicate' };
  if (response?.status !== 201) return { status: 'unavailable' };
  revalidatePath('/workspace/' + workspace.id + '/directorates');
  return { status: 'created' };
}
