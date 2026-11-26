'use client';

import { useSyncExternalStore } from 'react';
import Link from 'next/link';

function subscribe(change: () => void) {
  window.addEventListener('hashchange', change);
  return () => window.removeEventListener('hashchange', change);
}

const browserHash = () => window.location.hash;
const serverHash = () => '';

/** The invitation stays in the browser fragment when changing language. */
export function ActivationLanguageLink({ href, lang, children }: { href: string; lang: string; children: string }) {
  const fragment = useSyncExternalStore(subscribe, browserHash, serverHash);
  return (
    <Link
      href={href + fragment}
      hrefLang={lang}
      lang={lang}
      prefetch={false}
      className="action-button"
      data-variant="tertiary"
    >
      {children}
    </Link>
  );
}
