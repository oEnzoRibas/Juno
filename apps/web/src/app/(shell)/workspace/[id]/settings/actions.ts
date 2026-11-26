'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { apiRequest, sessionCookie } from '../../../../../server/juno-api';
import { loadShell, localPath, type ShellLocale } from '../../../_components/shell-data';

export type ProfileResult =
  | { status: 'idle' }
  | { status: 'invalid' }
  | { status: 'unavailable' }
  | { status: 'saved'; name: string; accent: string };

/** Replace the profile using the server session and the workspace verified on this request. */
export async function saveProfile(
  id: string,
  locale: ShellLocale,
  _: ProfileResult,
  form: FormData,
): Promise<ProfileResult> {
  const { workspace } = await loadShell(locale, id);
  if (workspace?.role !== 'administrator') notFound();

  const token = (await cookies()).get(sessionCookie)?.value;
  if (!token) redirect(localPath('/sign-in', locale));
  const name = form.get('name');
  const accent = form.get('accent');
  if (typeof name !== 'string' || typeof accent !== 'string') return { status: 'invalid' };

  const response = await apiRequest('tenants/' + workspace.id + '/profile', {
    method: 'PUT',
    headers: { authorization: 'Bearer ' + token, 'content-type': 'application/json' },
    body: JSON.stringify({ name, accent }),
  }).catch(() => undefined);

  if (response?.status === 401) redirect(localPath('/sign-in', locale));
  if (response?.status === 403 || response?.status === 404) notFound();
  if (response?.status === 400) return { status: 'invalid' };
  if (!response?.ok) return { status: 'unavailable' };

  const saved = (await response.json()) as { name: string; accent: string };
  revalidatePath('/workspace/' + workspace.id);
  revalidatePath('/workspace/' + workspace.id + '/settings');
  revalidatePath('/session');
  return { status: 'saved', name: saved.name, accent: saved.accent };
}
