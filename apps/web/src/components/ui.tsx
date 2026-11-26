import type { ComponentProps, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'destructive';

type ButtonProps = ComponentProps<'button'> & { variant?: ButtonVariant; pending?: boolean };

export function Button({ variant = 'primary', pending, disabled, className, type = 'button', ...props }: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      className={['action-button', className].filter(Boolean).join(' ')}
      data-variant={variant}
      aria-busy={pending || undefined}
      disabled={disabled || pending}
    />
  );
}

export function Panel({ className, ...props }: ComponentProps<'section'>) {
  return <section {...props} className={['ui-panel', className].filter(Boolean).join(' ')} />;
}

export function PageHeading({ id, title, description }: { id?: string; title: string; description?: string }) {
  return (
    <header className="ui-page-heading">
      <h1 id={id}>{title}</h1>
      {description && <p>{description}</p>}
    </header>
  );
}

export function Notice({ kind, children, id }: { kind: 'error' | 'success'; children: ReactNode; id?: string }) {
  return (
    <p id={id} className="notice" role={kind === 'error' ? 'alert' : 'status'}>
      {children}
    </p>
  );
}
