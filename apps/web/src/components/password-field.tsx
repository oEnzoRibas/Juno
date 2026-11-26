'use client';

import { useId, useState, type ComponentProps } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from './ui';

type PasswordFieldProps = Pick<
  ComponentProps<'input'>,
  'name' | 'autoComplete' | 'minLength' | 'maxLength' | 'required'
> & {
  label: string;
  show: string;
  hide: string;
};

export function PasswordField({ label, show, hide, ...input }: PasswordFieldProps) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>
      <div className="password-control">
        <input {...input} id={id} type={visible ? 'text' : 'password'} />
        <Button variant="secondary" aria-controls={id} onClick={() => setVisible(!visible)}>
          {visible ? hide : show}
        </Button>
      </div>
    </div>
  );
}

export function SubmitButton({ children }: { children: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" pending={pending}>
      {children}
    </Button>
  );
}
