import { createFormatter, createTranslator } from 'next-intl';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ApplicationShell } from '../../../(shell)/_components/application-shell';
import { directoryMessages } from '../../../(shell)/_components/member-directory-messages';
import { loadShell, localPath, shellLocale } from '../../../(shell)/_components/shell-data';
import { messages } from '../../../../content/messages';
import { loadDirectory } from './directory-data';
import styles from './members.module.css';

export default async function WorkspaceMembers({ params, searchParams }: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ lang?: string; after?: string | string[] }>;
}) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const locale = shellLocale(query.lang);
  const { account, workspaces, workspace } = await loadShell(locale, id);
  if (!workspace || workspace.role !== 'administrator') notFound();

  const directory = await loadDirectory(id, locale, query.after);
  const copy = directoryMessages[locale];
  const t = createTranslator({ locale, messages: messages[locale] });
  const format = createFormatter({ locale, timeZone: 'UTC' });
  const path = localPath(`/workspace/${id}/members`, locale);
  const next = directory.nextCursor === null ? undefined
    : `${path}${path.includes('?') ? '&' : '?'}after=${encodeURIComponent(directory.nextCursor)}`;

  return (
    <ApplicationShell locale={locale} platformAdmin={account.platformAdmin} current={workspace} workspaces={workspaces} section="members">
      <section className="public-panel border-t-8" style={{ borderTopColor: workspace.accent }} aria-labelledby="member-directory-title">
        <p className="mb-2 text-sm font-semibold text-[var(--muted)]">{workspace.name}</p>
        <h1 id="member-directory-title" className="mb-2 text-3xl font-semibold">{copy.members}</h1>
        <p className="mb-6 text-[var(--muted)]">{copy.description}</p>
        {directory.items.length ? (
          <>
            <p id="member-table-scroll" className={styles.scrollHint}>{copy.scroll}</p>
            <div aria-describedby="member-table-scroll" tabIndex={0} role="region" aria-labelledby="member-directory-title" className={styles.tableRegion}>
              <table className={styles.table} aria-labelledby="member-directory-title">
                <thead>
                  <tr>
                    <th scope="col">{copy.email}</th>
                    <th scope="col">{t('role')}</th>
                    <th scope="col">{copy.status}</th>
                    <th scope="col">{copy.joined}</th>
                  </tr>
                </thead>
                <tbody>
                  {directory.items.map(member => (
                    <tr key={member.accountId}>
                      <th scope="row">{member.email}</th>
                      <td>{t(member.role)}</td>
                      <td><span className={member.active ? styles.active : styles.inactive}>{member.active ? copy.active : copy.inactive}</span></td>
                      <td><time dateTime={member.joinedAt}>{format.dateTime(new Date(member.joinedAt), { dateStyle: 'medium' })}</time></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : <p className="text-[var(--muted)]">{copy.empty}</p>}
        {(query.after !== undefined || next) && (
          <nav aria-label={copy.pagination} className={styles.pagination}>
            {query.after !== undefined && <Link href={path} prefetch={false}>{copy.first}</Link>}
            {next && <Link href={next} prefetch={false}>{copy.next}</Link>}
          </nav>
        )}
      </section>
    </ApplicationShell>
  );
}
