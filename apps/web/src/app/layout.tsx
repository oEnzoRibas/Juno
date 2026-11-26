import type { ReactNode } from 'react';
import { ShellPreferences } from './(shell)/_components/shell-preferences';
import './styles.css';

export const metadata = { title: 'Juno' };

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <ShellPreferences>{children}</ShellPreferences>
      </body>
    </html>
  );
}
