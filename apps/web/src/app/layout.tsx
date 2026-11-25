import { connection } from 'next/server';
import { Suspense, type ReactNode } from 'react';
import { ReviewBuildInfoPanel } from '../components/review-build-info';
import { loadReviewBuildInfo } from '../server/review-build-info';
import './styles.css';

export const metadata = { title: 'Juno' };

async function ReviewBuildInfo() {
  await connection();
  const info = await loadReviewBuildInfo();
  return info && <ReviewBuildInfoPanel info={info} />;
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Suspense fallback={null}>
          <ReviewBuildInfo />
        </Suspense>
      </body>
    </html>
  );
}
