import { createTranslator } from 'next-intl';
import Link from 'next/link';
import { PageHeading, Panel } from '../../../components/ui';
import { messages } from '../../../content/messages';
import { ApplicationShell } from '../_components/application-shell';
import styles from '../_components/application-shell.module.css';
import { loadShell, localPath, shellLocale } from '../_components/shell-data';

export default async function Session({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const locale = shellLocale((await searchParams).lang);
  const { account, workspaces } = await loadShell(locale);
  const t = createTranslator({ locale, messages: messages[locale] });
  return (
    <ApplicationShell
      locale={locale}
      platformAdmin={account.platformAdmin}
      workspaces={workspaces}
      accountEmail={account.email}
      section="organizations"
    >
      <div className={styles.pageTitle}>
        <PageHeading
          id="session-title"
          title={t(account.platformAdmin ? 'platformAdmin' : 'workspaces')}
          description={workspaces.length ? t('organizationsIntro') : undefined}
        />
      </div>
      <Panel aria-labelledby="session-title">
        {account.platformAdmin && <h2 className="mb-3 text-xl font-extrabold">{t('workspaces')}</h2>}
        {workspaces.length ? (
          <ul className={styles.cards}>
            {workspaces.map((workspace) => (
              <li key={workspace.id}>
                <Link href={localPath('/workspace/' + workspace.id, locale)} aria-label={workspace.name}>
                  {workspace.name}
                  <span>{t(workspace.role)}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[var(--muted)]">{t('emptyWorkspaces')}</p>
        )}
      </Panel>
    </ApplicationShell>
  );
}
