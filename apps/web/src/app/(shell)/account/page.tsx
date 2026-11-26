import { createTranslator } from 'next-intl';
import Link from 'next/link';
import { Button, PageHeading, Panel } from '../../../components/ui';
import { locales, messages } from '../../../content/messages';
import { signOut } from '../../sign-in/actions';
import { ApplicationShell } from '../_components/application-shell';
import { accountPath, accountWorkspaceReturn, loadShell, localPath, shellLocale } from '../_components/shell-data';
import { ShellIcon } from '../_components/shell-icon';
import { ThemePicker } from '../_components/shell-preferences';
import styles from '../_components/application-shell.module.css';

export default async function Account({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string; workspace?: string; from?: string; returnTo?: string }>;
}) {
  const query = await searchParams;
  const locale = shellLocale(query.lang);
  const { account, workspaces } = await loadShell(locale);
  const current = workspaces.find((workspace) => workspace.id === query.workspace);
  const platform = !current && query.from === 'platform' && account.platformAdmin;
  const back = current
    ? accountWorkspaceReturn(current.id, locale, query.returnTo)
    : localPath(platform ? '/platform' : '/session', locale);
  const alternate = locales[locale];
  const t = createTranslator({ locale, messages: messages[locale] });
  return (
    <ApplicationShell
      locale={locale}
      platformAdmin={account.platformAdmin}
      current={current}
      workspaces={workspaces}
      section="account"
    >
      <Link href={back} className={styles.back}>
        <ShellIcon name="back" />
        {t(current ? 'backToWorkspace' : platform ? 'platformLink' : 'backToOrganizations')}
      </Link>
      <PageHeading title={t('account')} description={t('accountIntro')} />
      <Panel className={styles.accountPanel} aria-labelledby="preferences-title">
        <h2 id="preferences-title">{t('preferences')}</h2>
        <p className={styles.accountEmail}>{account.email}</p>
        <div className={styles.preferenceRow}>
          <span>{t('languageLabel')}</span>
          <Link
            className="action-button"
            data-variant="secondary"
            href={accountPath(alternate.lang, current?.id, platform, query.returnTo)}
            lang={alternate.lang}
            hrefLang={alternate.lang}
          >
            {alternate.label}
          </Link>
        </div>
        <ThemePicker label={t('themeLabel')} system={t('themeSystem')} light={t('themeLight')} dark={t('themeDark')} />
        <form action={signOut.bind(null, locale)}>
          <Button type="submit" variant="secondary">
            {t('signOut')}
          </Button>
        </form>
      </Panel>
    </ApplicationShell>
  );
}
