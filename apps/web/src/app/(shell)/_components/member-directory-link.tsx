'use client';

import Link, { useLinkStatus } from 'next/link';

function PendingStatus({ label }: { label: string }) {
  const { pending } = useLinkStatus();
  return <span role="status">{pending ? ` · ${label}` : ''}</span>;
}

/** Keep the current shell visible while the protected directory route loads. */
export function DirectoryLink({ href, current, label, loading }: {
  href: string;
  current: boolean;
  label: string;
  loading: string;
}) {
  return (
    <Link href={href} prefetch={false} aria-current={current ? 'page' : undefined}>
      {label}<PendingStatus label={loading} />
    </Link>
  );
}
