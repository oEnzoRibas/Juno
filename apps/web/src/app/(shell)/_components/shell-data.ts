import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { apiRequest, sessionCookie } from '../../../server/juno-api';

export type ShellLocale = 'en' | 'pt-BR';

type MembershipRole = 'administrator' | 'member';

interface ShellAccount {
  email: string;
  platformAdmin: boolean;
}

export interface WorkspaceSummary {
  id: string;
  name: string;
  role: MembershipRole;
}

export interface WorkspaceDetail extends WorkspaceSummary {
  slug: string;
  accent: string;
  capabilities?: { inviteMember: boolean };
}

export function shellLocale(lang?: string): ShellLocale {
  return lang === 'pt-BR' ? 'pt-BR' : 'en';
}

export function localPath(path: string, locale: ShellLocale): string {
  return locale === 'pt-BR' ? `${path}?lang=pt-BR` : path;
}

/** Keep the account route scoped to a known workspace or the installation page. */
export function accountPath(locale: ShellLocale, workspace?: string, platform = false, returnTo?: string): string {
  const query = new URLSearchParams();
  if (workspace) query.set('workspace', workspace);
  if (platform) query.set('from', 'platform');
  if (returnTo && workspace) query.set('returnTo', returnTo);
  if (locale === 'pt-BR') query.set('lang', locale);
  return query.size ? '/account?' + query.toString() : '/account';
}

/** Accept only relative routes under the verified workspace and keep their existing filters. */
export function accountWorkspaceReturn(workspace: string, locale: ShellLocale, returnTo?: string): string {
  const root = '/workspace/' + workspace;
  if (typeof returnTo !== 'string') return localPath(root, locale);
  const [path, search] = returnTo.split('?');
  if (!path.startsWith(root + '/')) return localPath(root, locale);
  const section = path.slice(root.length);
  if (!/^\/(?:members(?:\/[a-f0-9-]{36})?|settings)$/i.test(section)) return localPath(root, locale);
  const params = new URLSearchParams(search);
  if (locale === 'pt-BR') params.set('lang', locale);
  else params.delete('lang');
  return path + (params.size ? '?' + params.toString() : '');
}

/** Revalidate the session and membership against the API for every rendered shell. */
export async function loadShell(locale: ShellLocale, workspaceId?: string) {
  const token = (await cookies()).get(sessionCookie)?.value;
  if (!token) redirect(localPath('/sign-in', locale));
  const validId = workspaceId && /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i.test(workspaceId);

  const init = { headers: { authorization: `Bearer ${token}` } };
  const [session, list, detail] = await Promise.all([
    apiRequest('auth/session', init),
    apiRequest('tenants', init),
    validId ? apiRequest(`tenants/${workspaceId}`, init) : undefined,
  ]);
  if ([session, list, detail].some((response) => response?.status === 401)) redirect(localPath('/sign-in', locale));
  if (!session.ok || !list.ok) throw new Error('Could not load the authenticated shell');
  if ((workspaceId !== undefined && !validId) || (detail && [400, 403, 404].includes(detail.status))) notFound();
  if (detail && !detail.ok) throw new Error('Could not load the workspace');

  const [account, workspaces, workspace] = await Promise.all([
    session.json() as Promise<ShellAccount>,
    list.json() as Promise<WorkspaceSummary[]>,
    detail?.json() as Promise<WorkspaceDetail> | undefined,
  ]);
  return { account, workspaces, workspace };
}
