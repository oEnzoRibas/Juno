import { notFound } from 'next/navigation';
import { createTranslator } from 'next-intl';
import Link from 'next/link';
import { PageHeading, Panel } from '../../../components/ui';
import { messages } from '../../../content/messages';
import { ProvisionForm } from '../../onboarding/forms';
import { ApplicationShell } from '../_components/application-shell';
import { loadShell, localPath, shellLocale } from '../_components/shell-data';
import { ShellIcon } from '../_components/shell-icon';
import styles from '../_components/application-shell.module.css';

export default async function Platform({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const locale = shellLocale((await searchParams).lang);
  const { account, workspaces } = await loadShell(locale);
  if (!account.platformAdmin) notFound();
  const t = createTranslator({ locale, messages: messages[locale] });
  const back = localPath('/session', locale);
  return (
    <ApplicationShell
      locale={locale}
      platformAdmin
      accountEmail={account.email}
      workspaces={workspaces}
      section="platform"
    >
      <Link href={back} className={styles.back}>
        <ShellIcon name="back" />
        {t('backToOrganizations')}
      </Link>
      <div className={styles.pageTitle}>
        <PageHeading id="provision-title" title={t('createWorkspace')} description={t('platformDescription')} />
      </div>
      <Panel aria-labelledby="provision-title">
        <ProvisionForm locale={locale} cancelHref={back} />
      </Panel>
    </ApplicationShell>
  );
}
