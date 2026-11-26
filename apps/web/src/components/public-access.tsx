import type { ReactNode } from 'react';
import Link from 'next/link';
import { locales } from '../content/messages';
import { ActivationLanguageLink } from './activation-language-link';
import { PageHeading, Panel } from './ui';

export function PublicAccess({
  locale,
  route,
  title,
  description,
  children,
}: {
  locale: keyof typeof locales;
  route: '/sign-in' | '/activate';
  title: string;
  description: string;
  children: ReactNode;
}) {
  const alternate = locales[locale];
  const languageHref = route + (alternate.lang === 'pt-BR' ? '?lang=pt-BR' : '');
  return (
    <main lang={locale} className="public-shell public-access">
      <header className="access-header">
        <Link href={locale === 'pt-BR' ? '/?lang=pt-BR' : '/'} className="juno-wordmark" aria-label="Juno">
          juno.
        </Link>
        {route === '/activate' ? (
          <ActivationLanguageLink href={languageHref} lang={alternate.lang}>
            {alternate.label}
          </ActivationLanguageLink>
        ) : (
          <Link
            href={languageHref}
            hrefLang={alternate.lang}
            lang={alternate.lang}
            className="action-button"
            data-variant="tertiary"
          >
            {alternate.label}
          </Link>
        )}
      </header>
      <Panel aria-labelledby="access-title" className="public-panel">
        <PageHeading id="access-title" title={title} description={description} />
        {children}
      </Panel>
    </main>
  );
}
