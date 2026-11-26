import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { apiRequest, sessionCookie } from '../../../../../server/juno-api';
import { localPath, type ShellLocale } from '../../../_components/shell-data';
import type { DirectoryQuery } from './directory-query';

interface DirectoryEntry {
  accountId: string;
  email: string;
  role: 'administrator' | 'member';
  active: boolean;
  joinedAt: string;
}

interface DirectoryPage {
  items: DirectoryEntry[];
  nextCursor: string | null;
}

async function readDirectory<T>(path: string, locale: ShellLocale): Promise<T> {
  const token = (await cookies()).get(sessionCookie)?.value;
  if (!token) redirect(localPath('/sign-in', locale));
  const response = await apiRequest(path, { headers: { authorization: `Bearer ${token}` } });
  if (response.status === 401) redirect(localPath('/sign-in', locale));
  if ([400, 403, 404].includes(response.status)) notFound();
  if (!response.ok) throw new Error('Could not load the member directory');
  return response.json() as Promise<T>;
}

/** Read one page using the server-defined cursors and scoped filters. */
export function loadDirectory(id: string, locale: ShellLocale, query: DirectoryQuery) {
  const params = new URLSearchParams(query);
  return readDirectory<DirectoryPage>(`tenants/${id}/members${params.size ? `?${params}` : ''}`, locale);
}

/** Keep member detail authorization with the same server that owns the list. */
export function loadMember(id: string, locale: ShellLocale, accountId: string) {
  if (!/^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i.test(accountId)) notFound();
  return readDirectory<DirectoryEntry>(`tenants/${id}/members/${encodeURIComponent(accountId)}`, locale);
}
