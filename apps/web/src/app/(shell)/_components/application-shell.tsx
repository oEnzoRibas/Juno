import type { ReactNode } from 'react';
import { createTranslator } from 'next-intl';
import Link from 'next/link';
import { locales, messages } from '../../../content/messages';
import { signOut } from '../../sign-in/actions';
import { localPath, type ShellLocale, type WorkspaceSummary } from './shell-data';
import styles from './application-shell.module.css';

interface ShellProps {
  locale: ShellLocale;
  platformAdmin: boolean;
  current?: WorkspaceSummary;
  workspaces: WorkspaceSummary[];
  children: ReactNode;
}

/** Render navigation from the server-verified account and membership list. */
export function ApplicationShell({ locale, platformAdmin, current, workspaces, children }: ShellProps) {
  const t = createTranslator({ locale, messages: messages[locale] });
  const alternate = locales[locale];
  const path = current ? `/workspace/${current.id}` : '/session';
  return (
    <div className={styles.frame} lang={locale}>
      <a className={styles.skip} href="#shell-main">{t('skipToContent')}</a>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href={localPath('/session', locale)} aria-label="Juno" className={styles.wordmark}>juno.</Link>
          <div className={styles.headerActions}>
            <Link href={localPath(path, alternate.lang)} lang={alternate.lang} hrefLang={alternate.lang} className={styles.utilityLink}>
              {alternate.label}
            </Link>
            <form action={signOut.bind(null, locale)}>
              <button className={styles.utilityLink} type="submit">{t('signOut')}</button>
            </form>
          </div>
        </div>
      </header>
      <div className={styles.layout}>
        <aside className={styles.rail}>
          <nav aria-label={t('workspaceNavigation')} className={styles.nav}>
            <Link href={localPath('/session', locale)} aria-current={current ? undefined : 'page'}>
              {t('workspaces')}
            </Link>
            {current && (
              <Link href={localPath(path, locale)} aria-current="page">
                {t('dashboard')}
              </Link>
            )}
            {current?.role === 'administrator' && <a href="#member-invite">{t('inviteMember')}</a>}
            {platformAdmin && <Link href={localPath('/platform', locale)}>{t('platformLink')}</Link>}
          </nav>
          {current && workspaces.length > 1 && (
            <details className={styles.switcher}>
              <summary>{t('switchOrganization')}</summary>
              <ul>
                {workspaces.map(workspace => (
                  <li key={workspace.id}>
                    <Link href={localPath(`/workspace/${workspace.id}`, locale)} aria-current={workspace.id === current.id ? 'true' : undefined}>
                      {workspace.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          )}
        </aside>
        <main id="shell-main" tabIndex={-1} className={styles.main}>{children}</main>
      </div>
    </div>
  );
}
