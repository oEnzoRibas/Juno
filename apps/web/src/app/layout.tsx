import { headers } from 'next/headers';
import { connection } from 'next/server';
import { Suspense, type ReactNode } from 'react';
import { DocumentLanguage } from '../components/document-language';
import { ReviewBuildInfoPanel } from '../components/review-build-info';
import { loadReviewBuildInfo } from '../server/review-build-info';
import { ShellPreferences } from './(shell)/_components/shell-preferences';
import './styles.css';

export const metadata = { title: 'Juno' };

async function ReviewBuildInfo() {
  await connection();
  const info = await loadReviewBuildInfo();
  return info && <ReviewBuildInfoPanel info={info} />;
}

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const language = (await headers()).get('x-juno-document-language') === 'pt-BR' ? 'pt-BR' : 'en';
  return (
    <html lang={language}>
      <body>
        <Suspense fallback={null}>
          <DocumentLanguage />
        </Suspense>
        <ShellPreferences>
          {children}
          <Suspense fallback={null}>
            <ReviewBuildInfo />
          </Suspense>
        </ShellPreferences>
      </body>
    </html>
  );
}
