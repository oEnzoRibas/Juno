import { cookies } from 'next/headers';
import { createTranslator } from 'next-intl';
import Link from 'next/link';
import { messages } from '../../content/messages';
import { sessionCookie } from '../../server/juno-api';
import { ActivationForm } from '../onboarding/forms';

export default async function Activate({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const locale = (await searchParams).lang === 'pt-BR' ? 'pt-BR' : 'en';
  const t = createTranslator({ locale, messages: messages[locale] });
  const signedIn = (await cookies()).has(sessionCookie);
  return (
    <main lang={locale} className="public-shell">
      <section className="public-panel" aria-labelledby="activation-title">
        <h1 id="activation-title" className="mb-6 text-3xl font-semibold">{t('activate')}</h1>
        <ActivationForm locale={locale} signedIn={signedIn} />
        {!signedIn && <Link href={locale === 'pt-BR' ? '/sign-in?lang=pt-BR' : '/sign-in'} className="mt-5 inline-block underline">{t('existingAccount')}</Link>}
      </section>
    </main>
  );
}
