import { createTranslator } from 'next-intl';
import Link from 'next/link';
import { messages } from '../../../content/messages';
import { ApplicationShell } from '../_components/application-shell';
import styles from '../_components/application-shell.module.css';
import { loadShell, localPath, shellLocale } from '../_components/shell-data';

export default async function Session({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const locale = shellLocale((await searchParams).lang);
  const { account, workspaces } = await loadShell(locale);
  const t = createTranslator({ locale, messages: messages[locale] });
  return (
    <ApplicationShell locale={locale} platformAdmin={account.platformAdmin} workspaces={workspaces} accountEmail={account.email}>
      <section className={styles.sectionPanel} aria-labelledby="session-title">
        <h1 id="session-title" className="mb-2 text-3xl font-semibold">{t(account.platformAdmin ? 'platformAdmin' : 'account')}</h1>
        <p className="mb-8 text-[var(--muted)]">{account.email}</p>
        <h2 className="mb-2 text-xl font-semibold">{t('workspaces')}</h2>
        {workspaces.length ? (
          <ul className={styles.cards}>
            {workspaces.map(workspace => (
              <li key={workspace.id}>
                <Link href={localPath(`/workspace/${workspace.id}`, locale)} aria-label={workspace.name}>
                  {workspace.name}
                  <span>{t(workspace.role)}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : <p className="text-[var(--muted)]">{t('emptyWorkspaces')}</p>}
      </section>
    </ApplicationShell>
  );
}
