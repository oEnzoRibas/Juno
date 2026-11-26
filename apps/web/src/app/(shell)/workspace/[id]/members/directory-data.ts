import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { apiRequest, sessionCookie } from '../../../../../server/juno-api';
import { localPath, type ShellLocale } from '../../../_components/shell-data';

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

/** Read one server-authorized page of memberships in the requested organization. */
export async function loadDirectory(id: string, locale: ShellLocale, after?: string | string[]) {
  const token = (await cookies()).get(sessionCookie)?.value;
  if (!token) redirect(localPath('/sign-in', locale));
  if (Array.isArray(after)) notFound();
  const query = after === undefined ? '' : `?${new URLSearchParams({ after })}`;
  const response = await apiRequest(`tenants/${id}/members${query}`, {
    headers: { authorization: `Bearer ${token}` },
  });
  if (response.status === 401) redirect(localPath('/sign-in', locale));
  if ([400, 403, 404].includes(response.status)) notFound();
  if (!response.ok) throw new Error('Could not load the member directory');
  return response.json() as Promise<DirectoryPage>;
}
