import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createTranslator } from 'next-intl';
import Link from 'next/link';
import { messages } from '../../content/messages';
import { apiRequest, sessionCookie } from '../../server/juno-api';
import { signOut } from '../sign-in/actions';

export default async function Session({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const locale = (await searchParams).lang === 'pt-BR' ? 'pt-BR' : 'en';
  const lang = locale === 'pt-BR' ? '?lang=pt-BR' : '';
  const token = (await cookies()).get(sessionCookie)?.value;
  if (!token) redirect(`/sign-in${lang}`);
  const result = await apiRequest('auth/session', { headers: { authorization: `Bearer ${token}` } });
  if (result.status === 401) redirect(`/sign-in${lang}`);
  if (!result.ok) throw new Error('Could not load the active session');
  const account = (await result.json()) as { email: string; platformAdmin: boolean };
  const listed = await apiRequest('tenants', { headers: { authorization: `Bearer ${token}` } });
  if (!listed.ok) throw new Error('Could not list the active organizations');
  const workspaces = (await listed.json()) as Array<{ id: string; name: string; role: 'administrator' | 'member' }>;
  const t = createTranslator({ locale, messages: messages[locale] });
  return (
    <main lang={locale} className="public-shell">
      <section className="public-panel" aria-labelledby="session-title">
        <h1 id="session-title" className="mb-4 text-3xl font-semibold">
          {t(account.platformAdmin ? 'platformAdmin' : 'account')}
        </h1>
        <p className="mb-6">{account.email}</p>
        {account.platformAdmin && (
          <Link className="mb-6 inline-flex min-h-11 items-center underline" href={`/platform${lang}`}>
            {t('platformLink')}
          </Link>
        )}
        {workspaces.length > 0 && (
          <section className="mb-6" aria-labelledby="organization-list">
            <h2 id="organization-list" className="mb-2 text-xl font-semibold">
              {t('workspaces')}
            </h2>
            <ul>
              {workspaces.map((workspace) => (
                <li key={workspace.id}>
                  <Link
                    className="inline-flex min-h-11 items-center underline"
                    href={`/workspace/${workspace.id}${lang}`}
                  >
                    {workspace.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
        <form action={signOut.bind(null, locale)}>
          <button type="submit" className="action-button">
            {t('signOut')}
          </button>
        </form>
      </section>
    </main>
  );
}
