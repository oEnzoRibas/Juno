import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createTranslator } from 'next-intl';
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
  const account = await result.json() as { email: string; platformAdmin: boolean };
  const t = createTranslator({ locale, messages: messages[locale] });
  return (
    <main lang={locale} className="public-shell">
      <section className="public-panel" aria-labelledby="session-title">
        <h1 id="session-title" className="mb-4 text-3xl font-semibold">{t(account.platformAdmin ? 'platformAdmin' : 'account')}</h1>
        <p className="mb-6">{account.email}</p>
        <form action={signOut.bind(null, locale)}>
          <button type="submit" className="action-button">{t('signOut')}</button>
        </form>
      </section>
    </main>
  );
}
