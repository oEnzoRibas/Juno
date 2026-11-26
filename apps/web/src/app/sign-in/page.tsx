import { createTranslator } from 'next-intl';
import { PasswordField, SubmitButton } from '../../components/password-field';
import { PublicAccess } from '../../components/public-access';
import { Notice } from '../../components/ui';
import { messages } from '../../content/messages';
import { signIn } from './actions';

export default async function SignIn({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string; error?: string; activated?: string }>;
}) {
  const params = await searchParams;
  const locale = params.lang === 'pt-BR' ? 'pt-BR' : 'en';
  const t = createTranslator({ locale, messages: messages[locale] });
  return (
    <PublicAccess locale={locale} route="/sign-in" title={t('signIn')} description={t('signInIntro')}>
      {params.activated === '1' && <Notice kind="success">{t('activated')}</Notice>}
      {params.error === '1' && <Notice kind="error">{t('signInError')}</Notice>}
      <form action={signIn.bind(null, locale)} className="access-form">
        <label className="form-field">
          {t('email')}
          <input autoComplete="username" type="email" name="email" maxLength={254} required />
        </label>
        <PasswordField
          label={t('password')}
          name="password"
          autoComplete="current-password"
          show={t('showPassword')}
          hide={t('hidePassword')}
          maxLength={256}
          required
        />
        <SubmitButton>{t('signIn')}</SubmitButton>
      </form>
    </PublicAccess>
  );
}
