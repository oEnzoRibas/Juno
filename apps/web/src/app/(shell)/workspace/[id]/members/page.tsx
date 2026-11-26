import { createFormatter, createTranslator } from 'next-intl';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ApplicationShell } from '../../../_components/application-shell';
import { directoryMessages } from '../../../_components/member-directory-messages';
import { loadShell, localPath, shellLocale, type ShellLocale } from '../../../_components/shell-data';
import { PageHeading, Panel } from '../../../../../components/ui';
import { MemberDirectoryNavigation } from '../../../_components/member-directory-navigation';
import { messages } from '../../../../../content/messages';
import { loadDirectory } from './directory-data';
import styles from './members.module.css';

export default async function WorkspaceMembers({
  params,
  searchParams,
}: {
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
  const dashboard = localPath('/workspace/' + id, locale);
  const path = localPath(`/workspace/${id}/members`, locale);
  const next =
    directory.nextCursor === null
      ? undefined
      : `${path}${path.includes('?') ? '&' : '?'}after=${encodeURIComponent(directory.nextCursor)}`;

  return (
    <ApplicationShell
      locale={locale}
      platformAdmin={account.platformAdmin}
      current={workspace}
      workspaces={workspaces}
      section="members"
      canInvite={workspace.capabilities?.inviteMember === true}
      additionalNavigation={<MemberDirectoryNavigation workspace={workspace} locale={locale} current />}
      breadcrumbs={[
        { label: t('workspaces'), href: localPath('/session', locale) },
        { label: workspace.name, href: dashboard },
        { label: copy.members },
      ]}
      localePath={(language: ShellLocale) => {
        const href = localPath('/workspace/' + id + '/members', language);
        return typeof query.after === 'string'
          ? href + (href.includes('?') ? '&' : '?') + new URLSearchParams({ after: query.after })
          : href;
      }}
    >
      <div className="mb-6">
        <PageHeading id="member-directory-title" title={copy.members} description={copy.description} />
      </div>
      <Panel
        className={styles.directoryPanel}
        style={{ borderTopColor: workspace.accent }}
        aria-labelledby="member-directory-title"
      >
        {directory.items.length ? (
          <>
            <p id="member-table-scroll" className={styles.scrollHint}>
              {copy.scroll}
            </p>
            <div
              aria-describedby="member-table-scroll"
              tabIndex={0}
              role="region"
              aria-labelledby="member-directory-title"
              className={styles.tableRegion}
            >
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
                  {directory.items.map((member) => (
                    <tr key={member.accountId}>
                      <th scope="row">{member.email}</th>
                      <td>{t(member.role)}</td>
                      <td>
                        <span className={member.active ? styles.active : styles.inactive}>
                          {member.active ? copy.active : copy.inactive}
                        </span>
                      </td>
                      <td>
                        <time dateTime={member.joinedAt}>
                          {format.dateTime(new Date(member.joinedAt), { dateStyle: 'medium' })}
                        </time>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <p className="text-[var(--muted)]">{copy.empty}</p>
        )}
        {(query.after !== undefined || next) && (
          <nav aria-label={copy.pagination} className={styles.pagination}>
            {query.after !== undefined && (
              <Link href={path} prefetch={false}>
                {copy.first}
              </Link>
            )}
            {next && (
              <Link href={next} prefetch={false}>
                {copy.next}
              </Link>
            )}
          </nav>
        )}
      </Panel>
    </ApplicationShell>
  );
}
