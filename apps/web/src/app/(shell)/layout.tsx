import type { ReactNode } from 'react';
import { ShellPreferences } from './_components/shell-preferences';

/** Keep the navigation preferences mounted across authenticated routes. */
export default function AuthenticatedLayout({ children }: { children: ReactNode }) {
  return <ShellPreferences>{children}</ShellPreferences>;
}
