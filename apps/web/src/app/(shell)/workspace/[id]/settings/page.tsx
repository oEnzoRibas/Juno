import { createTranslator } from 'next-intl';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageHeading, Panel } from '../../../../../components/ui';
import { messages } from '../../../../../content/messages';
import { ApplicationShell } from '../../../_components/application-shell';
import styles from '../../../_components/application-shell.module.css';
import { MemberDirectoryNavigation } from '../../../_components/member-directory-navigation';
import { loadShell, localPath, shellLocale } from '../../../_components/shell-data';
import { ShellIcon } from '../../../_components/shell-icon';
import { ProfileForm } from './profile-form';
import { profileMessages } from './profile-messages';

export default async function OrganizationSettings({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ lang?: string }>;
}) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const locale = shellLocale(query.lang);
  const { account, workspaces, workspace } = await loadShell(locale, id);
  if (workspace?.role !== 'administrator') notFound();
  const copy = profileMessages[locale];
  const t = createTranslator({ locale, messages: messages[locale] });
  const workspacePath = '/workspace/' + workspace.id;
  const dashboard = localPath(workspacePath, locale);

  return (
    <ApplicationShell
      locale={locale}
      platformAdmin={account.platformAdmin}
      current={workspace}
      workspaces={workspaces}
      section="settings"
      canInvite={workspace.capabilities?.inviteMember === true}
      additionalNavigation={<MemberDirectoryNavigation workspace={workspace} locale={locale} />}
      breadcrumbs={[
        { label: t('workspaces'), href: localPath('/session', locale) },
        { label: workspace.name, href: dashboard },
        { label: t('organizationSettings') },
      ]}
      localePath={(language) => localPath(workspacePath + '/settings', language)}
    >
      <Link href={dashboard} className={styles.back}>
        <ShellIcon name="back" />
        {copy.dashboard}
      </Link>
      <Panel
        className="grid gap-6"
        style={{
          borderBlockStartWidth: 'var(--tenant-accent-width)',
          borderTopColor: workspace.accent,
        }}
        aria-labelledby="profile-title"
      >
        <PageHeading id="profile-title" title={copy.title} description={copy.description} />
        <ProfileForm id={workspace.id} locale={locale} initial={{ name: workspace.name, accent: workspace.accent }} />
      </Panel>
    </ApplicationShell>
  );
}
