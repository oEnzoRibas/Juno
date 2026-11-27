import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageHeading, Panel, Notice } from '../../../../../components/ui';
import { directorateMessages } from '../../../../../content/directorates';
import { ApplicationShell } from '../../../_components/application-shell';
import { MemberDirectoryNavigation } from '../../../_components/member-directory-navigation';
import { loadShell, localPath, shellLocale } from '../../../_components/shell-data';
import { DirectorateForm } from './create-form';
import { directorateHref, loadDirectorates } from './directorate-data';

export default async function Directorates({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ lang?: string; after?: string }>;
}) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const locale = shellLocale(query.lang);
  const { account, workspaces, workspace } = await loadShell(locale, id);
  if (!workspace) notFound();
  const copy = directorateMessages[locale];
  const data = await loadDirectorates(workspace.id, locale, query.after);
  return (
    <ApplicationShell
      locale={locale}
      platformAdmin={account.platformAdmin}
      current={workspace}
      workspaces={workspaces}
      section="directorates"
      canInvite={workspace.capabilities?.inviteMember === true}
      additionalNavigation={<MemberDirectoryNavigation workspace={workspace} locale={locale} />}
      breadcrumbs={[
        { label: workspace.name, href: localPath('/workspace/' + workspace.id, locale) },
        { label: copy.title },
      ]}
      localePath={(language) => directorateHref(workspace.id, language, query.after)}
    >
      <div className="mb-6">
        <PageHeading title={copy.title} description={copy.description} />
      </div>
      <Panel className="mb-6" aria-label={copy.list}>
        {data.status === 'ready' ? (
          data.items.length ? (
            <ul className="grid gap-3">
              {data.items.map((item) => (
                <li key={item.id} className="break-words rounded-xl border border-[var(--border)] p-4 font-bold">
                  {item.name}
                </li>
              ))}
            </ul>
          ) : (
            <p>{copy.empty}</p>
          )
        ) : (
          <Notice kind="error">{copy[data.status]}</Notice>
        )}
        <nav className="mt-4 flex flex-wrap gap-3" aria-label={copy.list}>
          {query.after !== undefined && (
            <Link className="action-button" data-variant="secondary" href={directorateHref(workspace.id, locale)}>
              {copy.first}
            </Link>
          )}
          {data.status === 'ready' && data.nextCursor && (
            <Link
              className="action-button"
              data-variant="secondary"
              href={directorateHref(workspace.id, locale, data.nextCursor)}
            >
              {copy.next}
            </Link>
          )}
        </nav>
      </Panel>
      {workspace.role === 'administrator' && (
        <Panel className="mb-6" aria-labelledby="create-directorate-title">
          <h2 id="create-directorate-title" className="mb-4 text-xl font-extrabold">
            {copy.create}
          </h2>
          <DirectorateForm key={workspace.id} id={workspace.id} locale={locale} />
        </Panel>
      )}
      <Link className="action-button" data-variant="tertiary" href={localPath('/workspace/' + workspace.id, locale)}>
        {copy.dashboard}
      </Link>
    </ApplicationShell>
  );
}
