import type { ReactNode } from 'react';

const strokes = {
  menu: 'M3 6h18M3 12h18M3 18h18',
  close: 'm6 6 12 12M18 6 6 18',
  dashboard: 'M3 10l9-7 9 7v10H3zM9 20v-6h6v6',
  organization: 'M4 21V8h6V3h10v18zM7 12h1m-1 4h1m5-9h4m-4 4h4m-4 4h4',
  invite: 'M3 5h18v14H3zM3 6l9 7 9-7',
  people: 'M2 20v-2c0-3 3-4 6-4s6 1 6 4v2M16 14c3 0 6 1 6 4v2M8 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8m8-8a4 4 0 0 1 0 8',
  settings: 'M3 6h18M3 12h18M3 18h18M8 3v6m8 0v6m-8 0v6',
  chevron: 'm9 5 7 7-7 7',
  down: 'm5 9 7 7 7-7',
  back: 'M20 12H4m7-7-7 7 7 7',
  account: 'M4 21v-2c0-3 4-5 8-5s8 2 8 5v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8',
};

export type ShellIconName = keyof typeof strokes;

/** Render original decorative linework. Interactive parents own their accessible names. */
export function ShellIcon({ name }: { name: ShellIconName }): ReactNode {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
    strokeLinecap="round" strokeLinejoin="round" focusable="false" aria-hidden="true"><path d={strokes[name]} /></svg>;
}
