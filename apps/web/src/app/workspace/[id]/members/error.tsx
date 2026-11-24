'use client';

import { useSearchParams } from 'next/navigation';
import { directoryMessages } from '../../../(shell)/_components/member-directory-messages';

export default function MemberDirectoryError({ reset }: { reset: () => void }) {
  const locale = useSearchParams().get('lang') === 'pt-BR' ? 'pt-BR' : 'en';
  const copy = directoryMessages[locale];
  return (
    <main className="public-shell" lang={locale}>
      <section className="public-panel" aria-labelledby="directory-error-title">
        <h1 id="directory-error-title" className="mb-4 text-3xl font-semibold">{copy.members}</h1>
        <p role="alert" className="mb-4">{copy.error}</p>
        <button type="button" className="action-button" onClick={reset}>{copy.retry}</button>
      </section>
    </main>
  );
}
