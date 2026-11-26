import { createFormatter, createTranslator } from 'next-intl';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ApplicationShell } from '../../../../_components/application-shell';
import { directoryMessages } from '../../../../_components/member-directory-messages';
import { loadShell, localPath, shellLocale } from '../../../../_components/shell-data';
import { PageHeading, Panel } from '../../../../../../components/ui';
import { MemberDirectoryNavigation } from '../../../../_components/member-directory-navigation';
import styles from '../members.module.css';
import { messages } from '../../../../../../content/messages';
import { loadMember } from '../directory-data';
import { directoryHref, directoryQuery } from '../directory-query';

export default async function MemberDetail({
  params,
  searchParams,
}: {
  params: Promise<{ id: string; accountId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ id, accountId }, query] = await Promise.all([params, searchParams]);
  const locale = shellLocale(typeof query.lang === 'string' ? query.lang : undefined);
  const { account, workspaces, workspace } = await loadShell(locale, id);
  if (!workspace || workspace.role !== 'administrator') notFound();
  const member = await loadMember(id, locale, accountId);
  const filters = directoryQuery(query);
  const copy = directoryMessages[locale];
  const t = createTranslator({ locale, messages: messages[locale] });
  const formatter = createFormatter({ locale, timeZone: 'UTC' });

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
        { label: copy.members, href: directoryHref(id, locale, filters) },
        { label: copy.detail },
      ]}
      localePath={(alternate) => directoryHref(id, alternate, filters, accountId)}
    >
      <Panel
        className={styles.directoryPanel}
        style={{ borderTopColor: workspace.accent }}
        aria-labelledby="member-detail-title"
      >
        <Link
          className="mb-4 inline-flex min-h-11 items-center underline"
          href={directoryHref(id, locale, filters)}
          prefetch={false}
        >
          {copy.back}
        </Link>
        <div className="mb-6">
          <PageHeading id="member-detail-title" title={copy.detail} />
        </div>
        <dl className="grid gap-5 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-[var(--muted)]">{copy.email}</dt>
            <dd>{member.email}</dd>
          </div>
          <div>
            <dt className="text-sm text-[var(--muted)]">{t('role')}</dt>
            <dd>{t(member.role)}</dd>
          </div>
          <div>
            <dt className="text-sm text-[var(--muted)]">{copy.status}</dt>
            <dd>
              <span className={member.active ? styles.active : styles.inactive}>
                {member.active ? copy.active : copy.inactive}
              </span>
            </dd>
          </div>
          <div>
            <dt className="text-sm text-[var(--muted)]">{copy.joined}</dt>
            <dd>
              <time dateTime={member.joinedAt}>
                {formatter.dateTime(new Date(member.joinedAt), { dateStyle: 'medium' })}
              </time>
            </dd>
          </div>
        </dl>
      </Panel>
    </ApplicationShell>
  );
}
