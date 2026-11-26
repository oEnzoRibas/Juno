import { DirectoryLink } from './member-directory-link';
import { directoryMessages } from './member-directory-messages';
import { localPath, type ShellLocale, type WorkspaceSummary } from './shell-data';

/** Tenant administrator gating mirrors the directory API for a verified membership. */
export function MemberDirectoryNavigation({
  workspace,
  locale,
  current = false,
}: {
  workspace?: WorkspaceSummary;
  locale: ShellLocale;
  current?: boolean;
}) {
  if (workspace?.role !== 'administrator') return null;
  const copy = directoryMessages[locale];
  return (
    <DirectoryLink
      href={localPath('/workspace/' + workspace.id + '/members', locale)}
      current={current}
      label={copy.members}
      loading={copy.loading}
    />
  );
}
