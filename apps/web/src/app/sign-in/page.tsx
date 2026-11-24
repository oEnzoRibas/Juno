import { createTranslator } from 'next-intl';
import Link from 'next/link';
import { messages } from '../../content/messages';
import { signIn } from './actions';

export default async function SignIn({ searchParams }: { searchParams: Promise<{ lang?: string; error?: string; activated?: string }> }) {
  const params = await searchParams;
  const locale = params.lang === 'pt-BR' ? 'pt-BR' : 'en';
  const t = createTranslator({ locale, messages: messages[locale] });
  return (
    <main lang={locale} className="public-shell">
      <Link className="mb-6 inline-flex min-h-11 items-center text-3xl font-bold tracking-tight" href={locale === 'pt-BR' ? '/?lang=pt-BR' : '/'} aria-label="Juno">juno.</Link>
      <section className="public-panel" aria-labelledby="sign-in-title">
        <h1 id="sign-in-title" className="mb-6 text-3xl font-semibold">{t('signIn')}</h1>
        {params.activated === '1' && <p role="status" className="mb-4">{t('activated')}</p>}
        {params.error === '1' && <p role="alert" className="mb-4 font-semibold">{t('signInError')}</p>}
        <form action={signIn.bind(null, locale)} className="flex max-w-md flex-col gap-5">
          <label className="form-field">
            {t('email')}
            <input autoComplete="username" type="email" name="email" maxLength={254} required />
          </label>
          <label className="form-field">
            {t('password')}
            <input autoComplete="current-password" type="password" name="password" maxLength={256} required />
          </label>
          <button type="submit" className="action-button self-start">{t('signIn')}</button>
        </form>
      </section>
    </main>
  );
}
