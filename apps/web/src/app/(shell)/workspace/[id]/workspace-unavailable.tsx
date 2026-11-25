'use client';

import { useSearchParams } from 'next/navigation';
import { createTranslator } from 'next-intl';
import Link from 'next/link';
import { messages } from '../../../../content/messages';

function LocalizedUnavailable() {
  const locale = useSearchParams().get('lang') === 'pt-BR' ? 'pt-BR' : 'en';
  return <WorkspaceUnavailable locale={locale} />;
}

/** Use the same explanation for malformed, missing and unauthorized workspaces. */
export function WorkspaceUnavailable({ locale }: { locale?: 'en' | 'pt-BR' }) {
  if (!locale) return <LocalizedUnavailable />;
  const t = createTranslator({ locale, messages: messages[locale] });
  return (
    <main lang={locale} className="public-shell">
      <section className="public-panel" aria-labelledby="workspace-unavailable">
        <h1 id="workspace-unavailable" className="mb-4 text-3xl font-semibold">{t('workspaceUnavailable')}</h1>
        <p className="mb-6 text-[var(--muted)]">{t('workspaceUnavailableDescription')}</p>
        <Link className="action-button" href={locale === 'pt-BR' ? '/session?lang=pt-BR' : '/session'}>{t('workspaces')}</Link>
      </section>
    </main>
  );
}
