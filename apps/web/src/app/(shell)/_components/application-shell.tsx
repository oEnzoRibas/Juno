import type { ReactNode } from 'react';
import { createTranslator } from 'next-intl';
import Link from 'next/link';
import { locales, messages } from '../../../content/messages';
import { signOut } from '../../sign-in/actions';
import { localPath, type ShellLocale, type WorkspaceSummary } from './shell-data';
import { ShellIcon, type ShellIconName } from './shell-icon';
import { AccountMenu, NavigationToggle, ThemePicker } from './shell-preferences';
import styles from './application-shell.module.css';

interface ShellProps {
  locale: ShellLocale;
  platformAdmin: boolean;
  accountEmail?: string;
  current?: WorkspaceSummary;
  workspaces: WorkspaceSummary[];
  children: ReactNode;
  section?: 'dashboard' | 'platform' | 'members' | 'settings';
  localePath?: (locale: ShellLocale) => string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  additionalNavigation?: ReactNode;
  canInvite?: boolean;
}

function NavigationLink({ href, label, icon, active }: {
  href: string; label: string; icon: ShellIconName; active?: boolean;
}) {
  return (
    <Link href={href} aria-label={label} aria-current={active ? 'page' : undefined}>
      <ShellIcon name={icon} /><span className={styles.navLabel} aria-hidden="true">{label}</span>
    </Link>
  );
}

/** Render the shared authenticated presentation from verified account and workspace data. */
export function ApplicationShell({
  locale, platformAdmin, accountEmail, current, workspaces, children, section = 'dashboard',
  localePath, breadcrumbs, additionalNavigation, canInvite = false,
}: ShellProps) {
  const t = createTranslator({ locale, messages: messages[locale] });
  const alternate = locales[locale];
  const previewRevision = process.env.JUNO_SHELL_PREVIEW_REVISION;
  const showPreview = /^[a-f0-9]{40}$/.test(previewRevision ?? '');
  const root = localPath('/session', locale);
  const workspace = current ? '/workspace/' + current.id : undefined;
  const path = section === 'platform' ? '/platform' : workspace ?? '/session';
  const dashboard = workspace ? localPath(workspace, locale) : undefined;
  const trail = breadcrumbs ?? [
    { label: t('workspaces'), href: current || section === 'platform' ? root : undefined },
    ...(current ? [{ label: current.name, href: section === 'dashboard' ? undefined : dashboard }] : []),
    ...(section === 'platform' ? [{ label: t('platformAdmin') }] : []),
    ...(current && section === 'dashboard' ? [{ label: t('dashboard') }] : []),
  ];
  const navigation = (
    <>
      {current && workspaces.length > 1 && (
        <details className={styles.switcher}>
          <summary aria-label={t('switchOrganization')}>
            <ShellIcon name="organization" />
            <span className={styles.navLabel} aria-hidden="true">{current.name}</span>
          </summary>
          <ul>
            {workspaces.map(item => (
              <li key={item.id}>
                <Link href={localPath('/workspace/' + item.id, locale)} aria-current={item.id === current.id ? 'true' : undefined}>
                  <span>{item.name}</span><small>{t(item.role)}</small>
                </Link>
              </li>
            ))}
          </ul>
        </details>
      )}
      <nav aria-label={t('workspaceNavigation')} className={styles.nav}>
        <NavigationLink href={root} label={t('workspaces')} icon="organization" active={!current && section !== 'platform'} />
        {dashboard && <NavigationLink href={dashboard} label={t('dashboard')} icon="dashboard" active={section === 'dashboard'} />}
        {additionalNavigation}
        {dashboard && canInvite && <NavigationLink href={dashboard + '#member-invite'} label={t('inviteMember')} icon="invite" />}
        {platformAdmin && <NavigationLink href={localPath('/platform', locale)} label={t('platformLink')} icon="settings" active={section === 'platform'} />}
      </nav>
    </>
  );
  return (
    <div className={styles.frame} lang={locale}>
      <a className={styles.skip} href="#shell-main">{t('skipToContent')}</a>
      <header className={styles.header}>
        <NavigationToggle expand={t('expandSidebar')} collapse={t('collapseSidebar')} open={t('openNavigation')} close={t('closeNavigation')}>
          {navigation}
        </NavigationToggle>
        <Link href={root} aria-label="Juno" className={styles.wordmark}>juno.</Link>
        <div className={styles.headerActions}>
          <Link href={localePath ? localePath(alternate.lang) : localPath(path, alternate.lang)}
            lang={alternate.lang} hrefLang={alternate.lang} className={styles.utilityLink}>{alternate.label}</Link>
          <AccountMenu label={t('accountMenu')}>
            {accountEmail && <p>{accountEmail}</p>}
            <ThemePicker label={t('themeLabel')} system={t('themeSystem')} light={t('themeLight')} dark={t('themeDark')} />
            <form action={signOut.bind(null, locale)}>
              <button className={styles.utilityLink} type="submit">{t('signOut')}</button>
            </form>
          </AccountMenu>
          <form action={signOut.bind(null, locale)}>
            <button className={styles.utilityLink} type="submit">{t('signOut')}</button>
          </form>
        </div>
        {showPreview && <span className={styles.preview}>{t('shellPreview')} <code>{previewRevision?.slice(0, 12)}</code></span>}
      </header>
      <div className={styles.layout}>
        <aside className={styles.rail} id="shell-sidebar">{navigation}</aside>
        <main id="shell-main" tabIndex={-1} className={styles.main}>
          <nav aria-label={t('breadcrumbs')} className={styles.breadcrumbs}>
            <ol>{trail.map(({ href, label }, index) => (
              <li key={index}>
                {index > 0 && <ShellIcon name="chevron" />}
                {href ? <Link href={href}>{label}</Link> : <span aria-current={index === trail.length - 1 ? 'page' : undefined}>{label}</span>}
              </li>
            ))}</ol>
          </nav>
          {children}
        </main>
      </div>
    </div>
  );
}
