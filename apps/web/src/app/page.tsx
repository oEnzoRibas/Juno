import { createTranslator } from 'next-intl';
import Link from 'next/link';
import { locales, messages } from '../content/messages';

export default async function Home({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const locale = (await searchParams).lang === 'pt-BR' ? 'pt-BR' : 'en';
  const alternate = locales[locale];
  const t = createTranslator({ locale, messages: messages[locale] });
  return (
    <main lang={locale} className="public-shell">
      <header className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <span aria-label="Juno" className="text-3xl font-bold tracking-tight">
          juno.
        </span>
        <Link
          className="inline-flex min-h-11 items-center underline"
          href={alternate.href}
          hrefLang={alternate.lang}
          lang={alternate.lang}
        >
          {alternate.label}
        </Link>
      </header>
      <section aria-labelledby="setup-title" className="public-panel">
        <h1 id="setup-title" className="mb-4 text-3xl font-semibold tracking-tight sm:text-4xl">
          {t('title')}
        </h1>
        <p className="mb-6 text-lg text-[var(--muted)]">{t('description')}</p>
        <Link href={locale === 'pt-BR' ? '/sign-in?lang=pt-BR' : '/sign-in'} className="action-button">
          {t('signIn')}
        </Link>
      </section>
    </main>
  );
}
