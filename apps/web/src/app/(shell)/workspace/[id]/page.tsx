import { notFound } from 'next/navigation';
import { createTranslator } from 'next-intl';
import { PageHeading, Panel } from '../../../../components/ui';
import { messages } from '../../../../content/messages';
import { ApplicationShell } from '../../_components/application-shell';
import { loadShell, localPath, shellLocale } from '../../_components/shell-data';
import { InviteForm } from '../../../onboarding/forms';
import styles from '../../_components/application-shell.module.css';

export default async function Workspace({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ lang?: string }>;
}) {
  const [route, query] = await Promise.all([params, searchParams]);
  const locale = shellLocale(query.lang);
  const { account, workspaces, workspace } = await loadShell(locale, route.id);
  if (!workspace) notFound();
  const t = createTranslator({ locale, messages: messages[locale] });
  const dashboard = localPath('/workspace/' + workspace.id, locale);
  const canInvite = workspace.capabilities?.inviteMember === true;

  return (
    <ApplicationShell
      locale={locale}
      platformAdmin={account.platformAdmin}
      accountEmail={account.email}
      current={workspace}
      workspaces={workspaces}
      canInvite={canInvite}
    >
      <section
        aria-labelledby="workspace-title"
        className={styles.dashboard}
        style={{ borderTopColor: workspace.accent }}
      >
        <div className={styles.pageTitle}>
          <PageHeading id="workspace-title" title={workspace.name} description={t('dashboardDescription')} />
        </div>
        <div className={styles.dashboardGrid}>
          <Panel className={styles.sectionPanel} aria-labelledby="membership-title">
            <h2 id="membership-title">{t('membershipLabel')}</h2>
            <dl>
              <dt>{t('role')}</dt>
              <dd className={styles.role}>{t(workspace.role)}</dd>
            </dl>
          </Panel>
          {canInvite && (
            <Panel className={styles.sectionPanel} aria-labelledby="member-invite">
              <h2 id="member-invite">{t('inviteMember')}</h2>
              <p>{t('workspaceInvitationHelp')}</p>
              <InviteForm
                workspace={workspace.id}
                locale={locale}
                platform={false}
                cancelHref={dashboard + '#workspace-title'}
              />
            </Panel>
          )}
        </div>
      </section>
    </ApplicationShell>
  );
}
