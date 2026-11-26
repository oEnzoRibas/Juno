'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

/** Keep the document language accurate when the root layout survives navigation. */
export function DocumentLanguage() {
  const language = useSearchParams().get('lang') === 'pt-BR' ? 'pt-BR' : 'en';
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);
  return null;
}
