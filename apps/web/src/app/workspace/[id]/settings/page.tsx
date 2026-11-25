import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ApplicationShell } from '../../../(shell)/_components/application-shell';
import { loadShell, localPath, shellLocale } from '../../../(shell)/_components/shell-data';
import { ProfileForm } from './profile-form';
import { profileMessages } from './profile-messages';

export default async function OrganizationSettings({ params, searchParams }: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ lang?: string }>;
}) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const locale = shellLocale(query.lang);
  const { account, workspaces, workspace } = await loadShell(locale, id);
  if (workspace?.role !== 'administrator') notFound();
  const copy = profileMessages[locale];
  const workspacePath = '/workspace/' + workspace.id;

  return (
    <ApplicationShell locale={locale} platformAdmin={account.platformAdmin} current={workspace} workspaces={workspaces}
      section="settings">
      <section className="public-panel border-t-8" style={{ borderTopColor: workspace.accent }} aria-labelledby="profile-title">
        <Link href={localPath(workspacePath, locale)} className="mb-6 inline-block underline">{copy.dashboard}</Link>
        <p className="mb-2 break-words text-sm font-semibold text-[var(--muted)]">{workspace.name}</p>
        <h1 id="profile-title" className="mb-2 text-3xl font-semibold">{copy.title}</h1>
        <p className="mb-6 text-[var(--muted)]">{copy.description}</p>
        <ProfileForm id={workspace.id} locale={locale} initial={{ name: workspace.name, accent: workspace.accent }} />
      </section>
    </ApplicationShell>
  );
}
