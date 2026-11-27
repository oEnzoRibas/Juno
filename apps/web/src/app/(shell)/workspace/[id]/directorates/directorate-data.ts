import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { apiRequest, sessionCookie } from '../../../../../server/juno-api';
import { localPath, type ShellLocale } from '../../../_components/shell-data';

export interface Directorate {
  id: string;
  name: string;
}
export type DirectorateList =
  { status: 'ready'; items: Directorate[]; nextCursor: string | null } | { status: 'invalidPage' | 'unavailable' };

const uuid = /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i;

/** Preserve the API cursor and locale when navigating or returning from preferences. */
export function directorateHref(id: string, locale: ShellLocale, after?: string) {
  const query = new URLSearchParams();
  if (locale === 'pt-BR') query.set('lang', locale);
  if (after) query.set('after', after);
  return '/workspace/' + id + '/directorates' + (query.size ? '?' + query.toString() : '');
}

export async function loadDirectorates(id: string, locale: ShellLocale, after?: string): Promise<DirectorateList> {
  if (after !== undefined && !uuid.test(after)) return { status: 'invalidPage' };
  const token = (await cookies()).get(sessionCookie)?.value;
  if (!token) redirect(localPath('/sign-in', locale));
  const response = await apiRequest('tenants/' + id + '/directorates' + (after ? '?after=' + after : ''), {
    headers: { authorization: 'Bearer ' + token },
  }).catch(() => undefined);
  if (response?.status === 401) redirect(localPath('/sign-in', locale));
  if (response?.status === 403 || response?.status === 404) notFound();
  if (response?.status === 400) return { status: 'invalidPage' };
  if (!response?.ok) return { status: 'unavailable' };
  return { status: 'ready', ...((await response.json()) as { items: Directorate[]; nextCursor: string | null }) };
}
