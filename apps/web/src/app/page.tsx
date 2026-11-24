import { createTranslator } from 'next-intl';
import Link from 'next/link';

const messages = {
  en: { title: 'Workspace setup', description: 'The Juno web service is running.', language: 'Português (Brasil)' },
  'pt-BR': { title: 'Configuração do espaço de trabalho', description: 'O serviço web do Juno está em execução.', language: 'English' },
};

export default async function Home({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const locale = (await searchParams).lang === 'pt-BR' ? 'pt-BR' : 'en';
  const alternate = locale === 'en' ? 'pt-BR' : 'en';
  const t = createTranslator({ locale, messages: messages[locale] });
  return (
    <main lang={locale} className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center px-6 py-16">
      <p className="mb-3 text-xl font-semibold">Juno</p>
      <h1 className="mb-4 text-4xl font-semibold tracking-tight">{t('title')}</h1>
      <p className="mb-8 text-lg">{t('description')}</p>
      <Link className="self-start underline" href={alternate === 'en' ? '/' : '/?lang=pt-BR'} hrefLang={alternate} lang={alternate}>
        {t('language')}
      </Link>
    </main>
  );
}
