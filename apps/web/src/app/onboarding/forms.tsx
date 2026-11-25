'use client';

import { useActionState, useEffect, useState } from 'react';
import Link from 'next/link';
import { createTranslator } from 'next-intl';
import { messages } from '../../content/messages';
import { activate, invite, provision, type Result } from './actions';

type Locale = 'en' | 'pt-BR';

export function InviteForm({ workspace, locale, platform, cancelHref }: {
  workspace: string; locale: Locale; platform: boolean; cancelHref?: string;
}) {
  const [state, action, pending] = useActionState(invite.bind(null, workspace), {} as Result);
  const [origin, setOrigin] = useState('');
  const [copyFeedback, setCopyFeedback] = useState<'done' | 'error'>();
  useEffect(() => { setOrigin(window.location.origin); }, []);
  const t = createTranslator({ locale, messages: messages[locale] });
  const lang = locale === 'pt-BR' ? '?lang=pt-BR' : '';

  return (
    <form action={action} onSubmit={() => setCopyFeedback(undefined)} className="grid max-w-lg gap-4">
      {state.error && <p role="alert">{t('inviteError')}</p>}
      {state.value && (
        <div className="grid gap-2">
          <label className="form-field">
            {t('invitationLink')}
            <input value={`${origin}/activate${lang}#token=${state.value}`} readOnly />
          </label>
          <div>
            <button className="action-button" type="button" disabled={pending || !origin} onClick={async () => {
              try {
                await navigator.clipboard.writeText(origin + '/activate' + lang + '#token=' + state.value);
                setCopyFeedback('done');
              } catch {
                setCopyFeedback('error');
              }
            }}>{t('copyInvitation')}</button>
          </div>
          {copyFeedback && <p role="status">{t(copyFeedback === 'done' ? 'invitationCopied' : 'copyInvitationError')}</p>}
        </div>
      )}
      <label className="form-field">
        {t('email')}
        <input type="email" name="email" maxLength={254} required />
      </label>
      {platform ? (
        <label className="form-field">
          {t('role')}
          <select name="role">
            <option value="administrator">{t('administrator')}</option>
            <option value="member">{t('member')}</option>
          </select>
        </label>
      ) : <input type="hidden" name="role" value="member" />}
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" className="action-button" disabled={pending}>{t('issueInvite')}</button>
        {cancelHref && <Link href={cancelHref} className="underline" onClick={event => event.currentTarget.closest('form')?.reset()}>
          {t('cancelProvision')}
        </Link>}
      </div>
    </form>
  );
}

export function ProvisionForm({ locale, cancelHref }: { locale: Locale; cancelHref?: string }) {
  const [state, action, pending] = useActionState(provision, {} as Result);
  const t = createTranslator({ locale, messages: messages[locale] });
  return (
    <div className="grid gap-10">
      {!state.value && <form action={action} className="grid max-w-lg gap-4">
        {state.error && <p role="alert">{t('provisionError')}</p>}
        <label className="form-field">
          {t('organizationName')}
          <input name="name" maxLength={120} required />
        </label>
        <label className="form-field">
          {t('slug')}
          <input aria-describedby="organization-slug-hint" name="slug" maxLength={63} required pattern={'[a-z0-9]+(\\-[a-z0-9]+)*'} />
        </label>
        <p id="organization-slug-hint" className="text-sm text-[var(--muted)]">{t('slugHint')}</p>
        <label className="form-field">
          {t('accent')}
          <input aria-describedby="organization-accent-hint" name="accent" type="color" defaultValue="#7565f5" required />
        </label>
        <p id="organization-accent-hint" className="text-sm text-[var(--muted)]">{t('accentHint')}</p>
        <div className="flex flex-wrap items-center gap-4">
          <button type="submit" className="action-button" disabled={pending}>{t('createWorkspace')}</button>
          {cancelHref && <Link href={cancelHref} className="underline">{t('cancelProvision')}</Link>}
        </div>
      </form>}
      {state.value && (
        <section aria-labelledby="first-invite">
          <p role="status" className="mb-3">{t('workspaceCreated')}</p>
          <h2 id="first-invite" className="mb-4 text-xl font-semibold">{t('firstInvite')}</h2>
          <InviteForm key={state.value} workspace={state.value} platform locale={locale} />
        </section>
      )}
    </div>
  );
}

export function ActivationForm({ locale, signedIn }: { locale: Locale; signedIn: boolean }) {
  const [state, action, pending] = useActionState(activate.bind(null, locale), {} as Result);
  const [token, setToken] = useState('');
  useEffect(() => {
    setToken(new URLSearchParams(window.location.hash.slice(1)).get('token') ?? '');
  }, []);
  const t = createTranslator({ locale, messages: messages[locale] });
  return (
    <form action={action} className="grid max-w-lg gap-4">
      {state.error && <p role="alert">{t('activationError')}</p>}
      <label className="form-field">
        {t('invitationCode')}
        <input name="token" value={token} onChange={event => setToken(event.target.value)} maxLength={64} autoComplete="off" required />
      </label>
      {!signedIn && (
        <label className="form-field">
          {t('newPassword')}
          <input name="password" type="password" autoComplete="new-password" minLength={12} maxLength={256} required />
        </label>
      )}
      <div><button type="submit" className="action-button" disabled={pending}>{t('activate')}</button></div>
    </form>
  );
}
