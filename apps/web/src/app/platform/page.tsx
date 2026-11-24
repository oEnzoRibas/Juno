import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { createTranslator } from 'next-intl';
import Link from 'next/link';
import { messages } from '../../content/messages';
import { apiRequest, sessionCookie } from '../../server/juno-api';
import { ProvisionForm } from '../onboarding/forms';

export default async function Platform({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const locale = (await searchParams).lang === 'pt-BR' ? 'pt-BR' : 'en';
  const lang = locale === 'pt-BR' ? '?lang=pt-BR' : '';
  const token = (await cookies()).get(sessionCookie)?.value;
  if (!token) redirect(`/sign-in${lang}`);
  const response = await apiRequest('auth/session', { headers: { authorization: `Bearer ${token}` } });
  if (response.status === 401) redirect(`/sign-in${lang}`);
  if (!response.ok) throw new Error('Could not load the active session');
  const actor = await response.json() as { platformAdmin: boolean };
  if (!actor.platformAdmin) notFound();
  const t = createTranslator({ locale, messages: messages[locale] });
  return (
    <main lang={locale} className="public-shell">
      <Link href={`/session${lang}`} className="mb-6 inline-flex min-h-11 items-center underline">{t('account')}</Link>
      <section className="public-panel" aria-labelledby="platform-title">
        <h1 id="platform-title" className="mb-6 text-3xl font-semibold">{t('createWorkspace')}</h1>
        <ProvisionForm locale={locale} />
      </section>
    </main>
  );
}
