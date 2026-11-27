'use client';

import { useActionState, useState } from 'react';
import { Button, Notice } from '../../../../../components/ui';
import { directorateMessages } from '../../../../../content/directorates';
import type { ShellLocale } from '../../../_components/shell-data';
import { createDirectorate, type CreateResult } from './actions';

export function DirectorateForm({ id, locale }: { id: string; locale: ShellLocale }) {
  const copy = directorateMessages[locale];
  const [name, setName] = useState('');
  const [edited, setEdited] = useState(false);
  const [result, submit, pending] = useActionState<CreateResult, FormData>(
    async (previous: CreateResult, form: FormData) => {
      const next = await createDirectorate(id, locale, previous, form);
      if (next.status === 'created') setName('');
      setEdited(false);
      return next;
    },
    { status: 'idle' },
  );
  const showResult = !pending && !edited && result.status !== 'idle';
  const invalid = showResult && (result.status === 'invalid' || result.status === 'duplicate');
  return (
    <form action={submit} className="grid max-w-lg gap-4" aria-busy={pending}>
      <label className="form-field">
        {copy.name}
        <input
          name="name"
          value={name}
          required
          maxLength={240}
          disabled={pending}
          aria-invalid={invalid || undefined}
          aria-describedby={'directorate-hint' + (invalid ? ' directorate-result' : '')}
          onChange={(event) => {
            setName(event.target.value);
            setEdited(true);
          }}
        />
      </label>
      <p id="directorate-hint" className="text-sm text-[var(--muted)]">
        {copy.hint}
      </p>
      <div>
        <Button type="submit" pending={pending}>
          {pending ? copy.creating : copy.create}
        </Button>
      </div>
      {showResult && result.status !== 'idle' && (
        <Notice id="directorate-result" kind={result.status === 'created' ? 'success' : 'error'}>
          {copy[result.status]}
        </Notice>
      )}
    </form>
  );
}
