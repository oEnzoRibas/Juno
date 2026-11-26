import type { ReactNode } from 'react';
import { createTranslator } from 'next-intl';
import Link from 'next/link';
import { messages } from '../../../content/messages';
import { accountPath, localPath, type ShellLocale, type WorkspaceSummary } from './shell-data';
import { ShellIcon, type ShellIconName } from './shell-icon';
import { NavigationToggle, OrganizationSwitcher } from './shell-preferences';
import styles from './application-shell.module.css';

interface ShellProps {
  locale: ShellLocale;
  platformAdmin: boolean;
  accountEmail?: string;
  current?: WorkspaceSummary;
  workspaces: WorkspaceSummary[];
  children: ReactNode;
  section?: 'dashboard' | 'organizations' | 'account' | 'platform' | 'members' | 'settings';
  localePath?: (locale: ShellLocale) => string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  additionalNavigation?: ReactNode;
  canInvite?: boolean;
}

function NavigationLink({
  href,
  label,
  icon,
  active,
}: {
  href: string;
  label: string;
  icon: ShellIconName;
  active?: boolean;
}) {
  return (
    <Link href={href} aria-label={label} aria-current={active ? 'page' : undefined}>
      <ShellIcon name={icon} />
      <span className={styles.navLabel} aria-hidden="true">
        {label}
      </span>
    </Link>
  );
}

/** Render the authenticated frame from server-verified account and workspace data. */
export function ApplicationShell({
  locale,
  platformAdmin,
  accountEmail,
  current,
  workspaces,
  children,
  section = 'dashboard',
  localePath,
  breadcrumbs,
  additionalNavigation,
  canInvite = false,
}: ShellProps) {
  const t = createTranslator({ locale, messages: messages[locale] });
  const previewRevision = process.env.JUNO_SHELL_PREVIEW_REVISION;
  const showPreview = /^[a-f0-9]{40}$/.test(previewRevision ?? '');
  const root = localPath('/session', locale);
  const dashboard = current && localPath('/workspace/' + current.id, locale);
  const first = workspaces[0];
  const overview = dashboard ?? (first && localPath('/workspace/' + first.id, locale));
  const account = accountPath(locale, current?.id, section === 'platform', localePath?.(locale));
  const organizationActive = section === 'organizations' || (section === 'dashboard' && !current);
  const trail = breadcrumbs ?? [
    { label: t('workspaces'), href: organizationActive ? undefined : root },
    ...(current ? [{ label: current.name, href: section === 'dashboard' ? undefined : dashboard }] : []),
    ...(section === 'platform' ? [{ label: t('platformAdmin') }] : []),
    ...(section === 'account' ? [{ label: t('account') }] : []),
    ...(current && section === 'dashboard' ? [{ label: t('dashboard') }] : []),
  ];

  const mainLinks = (
    <>
      {overview && (
        <NavigationLink
          href={overview}
          label={t('dashboard')}
          icon="dashboard"
          active={!!dashboard && section === 'dashboard'}
        />
      )}
      <NavigationLink href={root} label={t('workspaces')} icon="organization" active={organizationActive} />
    </>
  );
  const accountLink = (
    <NavigationLink href={account} label={t('account')} icon="account" active={section === 'account'} />
  );
  const navigation = (
    <>
      {current && (
        <OrganizationSwitcher label={t('switchOrganization')} name={current.name}>
          {workspaces.map((item) => (
            <li key={item.id}>
              <Link
                href={localPath('/workspace/' + item.id, locale)}
                aria-current={item.id === current.id ? 'true' : undefined}
              >
                <span>{item.name}</span>
                <small>{t(item.role)}</small>
              </Link>
            </li>
          ))}
        </OrganizationSwitcher>
      )}
      <nav aria-label={t('workspaceNavigation')} className={styles.nav}>
        {mainLinks}
        {additionalNavigation}
        {dashboard && current?.role === 'administrator' && (
          <NavigationLink
            href={localPath('/workspace/' + current.id + '/settings', locale)}
            label={t('organizationSettings')}
            icon="settings"
            active={section === 'settings'}
          />
        )}
        {dashboard && canInvite && (
          <NavigationLink href={dashboard + '#member-invite'} label={t('inviteMember')} icon="invite" />
        )}
        {platformAdmin && (
          <NavigationLink
            href={localPath('/platform', locale)}
            label={t('platformLink')}
            icon="settings"
            active={section === 'platform'}
          />
        )}
        {accountLink}
      </nav>
    </>
  );
  return (
    <div className={styles.frame} lang={locale}>
      <a className={styles.skip} href="#shell-main">
        {t('skipToContent')}
      </a>
      <div className={styles.layout}>
        <aside className={styles.rail} id="shell-sidebar">
          <Link href={root} aria-label="Juno" className={styles.railBrand}>
            <span aria-hidden="true">juno.</span>
          </Link>
          {navigation}
        </aside>
        <div className={styles.contentColumn}>
          <header className={styles.header}>
            <NavigationToggle
              expand={t('expandSidebar')}
              collapse={t('collapseSidebar')}
              open={t('openNavigation')}
              close={t('closeNavigation')}
            >
              {navigation}
            </NavigationToggle>
            {current ? (
              <strong className={styles.contextName}>{current.name}</strong>
            ) : (
              <Link href={root} aria-label="Juno" className="juno-wordmark">
                juno.
              </Link>
            )}
            {showPreview && (
              <span className={styles.preview}>
                {t('shellPreview')} <code>{previewRevision?.slice(0, 12)}</code>
              </span>
            )}
            <Link
              href={account}
              className={styles.headerAccount}
              title={accountEmail}
              aria-current={section === 'account' ? 'page' : undefined}
            >
              <ShellIcon name="account" />
              {t('account')}
            </Link>
          </header>
          <main id="shell-main" tabIndex={-1} className={styles.main}>
            <nav aria-label={t('breadcrumbs')} className={styles.breadcrumbs}>
              <ol>
                {trail.map(({ href, label }, index) => (
                  <li key={index}>
                    {index > 0 && <ShellIcon name="chevron" />}
                    {href ? (
                      <Link href={href}>{label}</Link>
                    ) : (
                      <span aria-current={index === trail.length - 1 ? 'page' : undefined}>{label}</span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
            {children}
          </main>
        </div>
      </div>
      <nav aria-label={t('mainNavigation')} className={styles.bottomNav}>
        {mainLinks}
        {accountLink}
      </nav>
    </div>
  );
}
