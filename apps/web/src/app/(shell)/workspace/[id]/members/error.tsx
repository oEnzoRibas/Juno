'use client';

import { useSearchParams } from 'next/navigation';
import { Button, Notice, PageHeading, Panel } from '../../../../../components/ui';
import { directoryMessages } from '../../../_components/member-directory-messages';

export default function MemberDirectoryError({ reset }: { reset: () => void }) {
  const locale = useSearchParams().get('lang') === 'pt-BR' ? 'pt-BR' : 'en';
  const copy = directoryMessages[locale];
  return (
    <main className="public-shell" lang={locale}>
      <Panel className="mb-4 grid gap-4" aria-labelledby="directory-error-title">
        <PageHeading id="directory-error-title" title={copy.members} />
        <Notice kind="error">{copy.error}</Notice>
        <div>
          <Button onClick={reset}>{copy.retry}</Button>
        </div>
      </Panel>
    </main>
  );
}
