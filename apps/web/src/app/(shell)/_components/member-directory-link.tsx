'use client';

import Link, { useLinkStatus } from 'next/link';
import { ShellIcon } from './shell-icon';
import styles from './application-shell.module.css';

function PendingStatus({ label }: { label: string }) {
  const { pending } = useLinkStatus();
  return (
    <span role="status" className="sr-only">
      {pending ? label : ''}
    </span>
  );
}

/** Keep the current shell visible while the protected directory route loads. */
export function DirectoryLink({
  href,
  current,
  label,
  loading,
}: {
  href: string;
  current: boolean;
  label: string;
  loading: string;
}) {
  return (
    <Link href={href} prefetch={false} aria-label={label} aria-current={current ? 'page' : undefined}>
      <ShellIcon name="people" />
      <span className={styles.navLabel} aria-hidden="true">
        {label}
      </span>
      <PendingStatus label={loading} />
    </Link>
  );
}
