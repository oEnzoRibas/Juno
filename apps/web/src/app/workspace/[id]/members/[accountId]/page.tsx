import { createFormatter, createTranslator } from 'next-intl';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ApplicationShell } from '../../../../(shell)/_components/application-shell';
import { directoryMessages } from '../../../../(shell)/_components/member-directory-messages';
import { loadShell, shellLocale } from '../../../../(shell)/_components/shell-data';
import { messages } from '../../../../../content/messages';
import { loadMember } from '../directory-data';
import { directoryHref, directoryQuery } from '../directory-query';

export default async function MemberDetail({ params, searchParams }: {
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
    <ApplicationShell locale={locale} platformAdmin={account.platformAdmin} current={workspace} workspaces={workspaces}
      section="members" localePath={alternate => directoryHref(id, alternate, filters, accountId)}>
      <section className="public-panel border-t-8" style={{ borderTopColor: workspace.accent }} aria-labelledby="member-detail-title">
        <Link className="mb-4 inline-flex min-h-11 items-center underline" href={directoryHref(id, locale, filters)} prefetch={false}>
          {copy.back}
        </Link>
        <h1 id="member-detail-title" className="mb-6 text-3xl font-semibold">{copy.detail}</h1>
        <dl className="grid gap-5 sm:grid-cols-2">
          <div><dt className="text-sm text-[var(--muted)]">{copy.email}</dt><dd>{member.email}</dd></div>
          <div><dt className="text-sm text-[var(--muted)]">{t('role')}</dt><dd>{t(member.role)}</dd></div>
          <div><dt className="text-sm text-[var(--muted)]">{copy.status}</dt><dd>{member.active ? copy.active : copy.inactive}</dd></div>
          <div><dt className="text-sm text-[var(--muted)]">{copy.joined}</dt>
            <dd><time dateTime={member.joinedAt}>{formatter.dateTime(new Date(member.joinedAt), { dateStyle: 'medium' })}</time></dd>
          </div>
        </dl>
      </section>
    </ApplicationShell>
  );
}
