import { headers } from 'next/headers';
import { Suspense, type ReactNode } from 'react';
import { DocumentLanguage } from '../components/document-language';
import { ShellPreferences } from './(shell)/_components/shell-preferences';
import './styles.css';

export const metadata = { title: 'Juno' };

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const language = (await headers()).get('x-juno-document-language') === 'pt-BR' ? 'pt-BR' : 'en';
  return (
    <html lang={language}>
      <body>
        <Suspense fallback={null}>
          <DocumentLanguage />
        </Suspense>
        <ShellPreferences>{children}</ShellPreferences>
      </body>
    </html>
  );
}
