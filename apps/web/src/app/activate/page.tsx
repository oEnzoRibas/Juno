import { cookies } from 'next/headers';
import { createTranslator } from 'next-intl';
import Link from 'next/link';
import { PublicAccess } from '../../components/public-access';
import { messages } from '../../content/messages';
import { sessionCookie } from '../../server/juno-api';
import { ActivationForm } from '../onboarding/forms';

export default async function Activate({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const locale = (await searchParams).lang === 'pt-BR' ? 'pt-BR' : 'en';
  const t = createTranslator({ locale, messages: messages[locale] });
  const signedIn = (await cookies()).has(sessionCookie);
  return (
    <PublicAccess locale={locale} route="/activate" title={t('activate')} description={t('activationIntro')}>
      <ActivationForm locale={locale} signedIn={signedIn} />
      {!signedIn && (
        <Link
          href={locale === 'pt-BR' ? '/sign-in?lang=pt-BR' : '/sign-in'}
          className="action-button"
          data-variant="tertiary"
        >
          {t('existingAccount')}
        </Link>
      )}
    </PublicAccess>
  );
}
