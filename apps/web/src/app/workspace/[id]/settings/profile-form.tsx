'use client';

import { useActionState, useState } from 'react';
import type { ShellLocale } from '../../../(shell)/_components/shell-data';
import { saveProfile, type ProfileResult } from './actions';
import { profileMessages } from './profile-messages';

type Fields = { name: string; accent: string };

function ProfileFields({ initial, id, locale }: { initial: Fields; id: string; locale: ShellLocale }) {
  const copy = profileMessages[locale];
  const [fields, setFields] = useState(initial);
  const [edited, setEdited] = useState(false);
  const [state, submit, pending] = useActionState(async (previous: ProfileResult, form: FormData) => {
    const result = await saveProfile(id, locale, previous, form);
    if (result.status === 'saved') setFields({ name: result.name, accent: result.accent });
    setEdited(false);
    return result;
  }, { status: 'idle' });
  const invalid = !edited && state.status === 'invalid';
  const message = !edited && (invalid ? copy.invalid : state.status === 'unavailable' ? copy.unavailable : undefined);

  return (
    <form action={submit} className="grid max-w-lg gap-4" aria-busy={pending}>
      <label className="form-field">
        {copy.name}
        <input name="name" value={fields.name} maxLength={120} required disabled={pending}
          aria-invalid={invalid || undefined} aria-describedby={invalid ? 'profile-error' : undefined}
          onChange={event => { setEdited(true); setFields({ ...fields, name: event.target.value }); }} />
      </label>
      <label className="form-field">
        {copy.accent}
        <input name="accent" value={fields.accent} maxLength={7} pattern="#[0-9A-Fa-f]{6}" required disabled={pending}
          aria-invalid={invalid || undefined} aria-describedby={invalid ? 'profile-accent-hint profile-error' : 'profile-accent-hint'}
          onChange={event => { setEdited(true); setFields({ ...fields, accent: event.target.value }); }} />
      </label>
      <p id="profile-accent-hint" className="-mt-2 text-sm text-[var(--muted)]">{copy.accentHint}</p>
      <div>
        <button type="submit" className="action-button" disabled={pending}>{pending ? copy.saving : copy.save}</button>
      </div>
      <div role="status">{!pending && !edited && state.status === 'saved' ? copy.saved : null}</div>
      <div id="profile-error" role="alert">{!pending ? message : null}</div>
    </form>
  );
}

export function ProfileForm({ initial, id, locale }: { initial: Fields; id: string; locale: ShellLocale }) {
  return <ProfileFields key={id} initial={initial} id={id} locale={locale} />;
}
