import { notFound } from 'next/navigation';
import { createTranslator } from 'next-intl';
import { messages } from '../../../content/messages';
import { ApplicationShell } from '../../(shell)/_components/application-shell';
import { loadShell, shellLocale } from '../../(shell)/_components/shell-data';
import { InviteForm } from '../../onboarding/forms';

export default async function Workspace({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ lang?: string }> }) {
  const [route, query] = await Promise.all([params, searchParams]);
  const locale = shellLocale(query.lang);
  const { account, workspaces, workspace } = await loadShell(locale, route.id);
  if (!workspace) notFound();
  const t = createTranslator({ locale, messages: messages[locale] });

  return (
    <ApplicationShell locale={locale} platformAdmin={account.platformAdmin} current={workspace} workspaces={workspaces}>
      <section className="public-panel border-t-8" style={{ borderTopColor: workspace.accent }} aria-labelledby="workspace-title">
        <p className="mb-2 text-sm font-semibold text-[var(--muted)]">{t('dashboard')}</p>
        <h1 id="workspace-title" className="mb-4 text-3xl font-semibold">{workspace.name}</h1>
        <dl className="mb-6">
          <dt className="text-sm text-[var(--muted)]">{t('role')}</dt>
          <dd className="font-medium">{t(workspace.role)}</dd>
        </dl>
        {workspace.role === 'administrator' && (
          <section aria-labelledby="member-invite" className="mt-6 border-t border-[var(--border)] pt-6">
            <h2 id="member-invite" className="mb-4 text-xl font-semibold">{t('inviteMember')}</h2>
            <InviteForm workspace={workspace.id} locale={locale} platform={false} />
          </section>
        )}
      </section>
    </ApplicationShell>
  );
}
