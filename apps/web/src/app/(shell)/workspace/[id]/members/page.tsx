import { createFormatter, createTranslator } from 'next-intl';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ApplicationShell } from '../../../_components/application-shell';
import { directoryMessages } from '../../../_components/member-directory-messages';
import { loadShell, localPath, shellLocale } from '../../../_components/shell-data';
import { Button, PageHeading, Panel } from '../../../../../components/ui';
import { MemberDirectoryNavigation } from '../../../_components/member-directory-navigation';
import { messages } from '../../../../../content/messages';
import { loadDirectory } from './directory-data';
import { directoryHref, directoryQuery } from './directory-query';
import styles from './members.module.css';

export default async function WorkspaceMembers({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const locale = shellLocale(typeof query.lang === 'string' ? query.lang : undefined);
  const { account, workspaces, workspace } = await loadShell(locale, id);
  if (!workspace || workspace.role !== 'administrator') notFound();

  const filters = directoryQuery(query);
  const directory = await loadDirectory(id, locale, filters);
  const copy = directoryMessages[locale];
  const t = createTranslator({ locale, messages: messages[locale] });
  const format = createFormatter({ locale, timeZone: 'UTC' });
  const { after, ...firstPageFilters } = filters;
  const first = directoryHref(id, locale, firstPageFilters);
  const next = directory.nextCursor
    ? directoryHref(id, locale, { ...firstPageFilters, after: directory.nextCursor })
    : undefined;

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
        { label: workspace.name, href: localPath('/workspace/' + id, locale) },
        { label: copy.members },
      ]}
      localePath={(language) => directoryHref(id, language, filters)}
    >
      <div className="mb-6">
        <PageHeading id="member-directory-title" title={copy.members} description={copy.description} />
      </div>
      <Panel className="mb-6" aria-labelledby="member-filters-title">
        <h2 id="member-filters-title" className="mb-4 text-xl font-extrabold">
          {copy.filterHeading}
        </h2>
        <form method="get" className={styles.filters}>
          {locale === 'pt-BR' && <input type="hidden" name="lang" value={locale} />}
          <label className="form-field">
            {copy.prefix}
            <input
              type="search"
              name="emailPrefix"
              maxLength={254}
              pattern="[!-~]{1,254}"
              defaultValue={filters.emailPrefix}
            />
          </label>
          <label className="form-field">
            {t('role')}
            <select name="role" defaultValue={filters.role ?? ''}>
              <option value="">{copy.allRoles}</option>
              <option value="administrator">{t('administrator')}</option>
              <option value="member">{t('member')}</option>
            </select>
          </label>
          <label className="form-field">
            {copy.status}
            <select name="active" defaultValue={filters.active ?? ''}>
              <option value="">{copy.allStatuses}</option>
              <option value="true">{copy.active}</option>
              <option value="false">{copy.inactive}</option>
            </select>
          </label>
          <div className={styles.filterActions}>
            <Button type="submit">{copy.filter}</Button>
            {(filters.emailPrefix || filters.role || filters.active) && (
              <Link className="action-button" data-variant="tertiary" href={directoryHref(id, locale)} prefetch={false}>
                {copy.clear}
              </Link>
            )}
          </div>
        </form>
      </Panel>
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
                      <th scope="row">
                        <Link href={directoryHref(id, locale, filters, member.accountId)} prefetch={false}>
                          {member.email}
                        </Link>
                      </th>
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
        {(after !== undefined || next) && (
          <nav aria-label={copy.pagination} className={styles.pagination}>
            {after !== undefined && (
              <Link href={first} prefetch={false}>
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
