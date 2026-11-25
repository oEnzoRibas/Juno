import type { ReactNode } from 'react';
import { createTranslator } from 'next-intl';
import Link from 'next/link';
import { locales, messages } from '../../../content/messages';
import { signOut } from '../../sign-in/actions';
import { localPath, type ShellLocale, type WorkspaceSummary } from './shell-data';
import { DirectoryLink } from './member-directory-link';
import { directoryMessages } from './member-directory-messages';
import styles from './application-shell.module.css';

interface ShellProps {
  locale: ShellLocale;
  platformAdmin: boolean;
  current?: WorkspaceSummary;
  workspaces: WorkspaceSummary[];
  children: ReactNode;
  section?: 'dashboard' | 'members';
  localePath?: (locale: ShellLocale) => string;
}

/** Render navigation from the server-verified account and membership list. */
export function ApplicationShell({ locale, platformAdmin, current, workspaces, children, section = 'dashboard', localePath }: ShellProps) {
  const t = createTranslator({ locale, messages: messages[locale] });
  const alternate = locales[locale];
  const dashboardPath = current ? `/workspace/${current.id}` : '/session';
  const directoryPath = current ? `${dashboardPath}/members` : undefined;
  const path = section === 'members' && directoryPath ? directoryPath : dashboardPath;
  return (
    <div className={styles.frame} lang={locale}>
      <a className={styles.skip} href="#shell-main">{t('skipToContent')}</a>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href={localPath('/session', locale)} aria-label="Juno" className={styles.wordmark}>juno.</Link>
          <div className={styles.headerActions}>
            <Link href={localePath ? localePath(alternate.lang) : localPath(path, alternate.lang)} lang={alternate.lang} hrefLang={alternate.lang} className={styles.utilityLink}>
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
              <Link href={localPath(dashboardPath, locale)} aria-current={section === 'dashboard' ? 'page' : undefined}>
                {t('dashboard')}
              </Link>
            )}
            {current?.role === 'administrator' && directoryPath && (
              <>
                <DirectoryLink href={localPath(directoryPath, locale)} current={section === 'members'}
                  label={directoryMessages[locale].members} loading={directoryMessages[locale].loading} />
                <Link href={`${localPath(dashboardPath, locale)}#member-invite`}>{t('inviteMember')}</Link>
              </>
            )}
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
