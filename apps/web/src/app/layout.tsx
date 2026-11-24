import type { ReactNode } from 'react';
import './styles.css';

export const metadata = { title: 'Juno' };

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
