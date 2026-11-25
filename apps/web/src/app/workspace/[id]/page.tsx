import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { createTranslator } from 'next-intl';
import Link from 'next/link';
import { messages } from '../../../content/messages';
import { apiRequest, sessionCookie } from '../../../server/juno-api';
import { InviteForm } from '../../onboarding/forms';

export default async function Workspace({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ lang?: string }>;
}) {
  const locale = (await searchParams).lang === 'pt-BR' ? 'pt-BR' : 'en';
  const lang = locale === 'pt-BR' ? '?lang=pt-BR' : '';
  const id = (await params).id;
  if (!/^[a-f0-9-]{36}$/i.test(id)) notFound();
  const token = (await cookies()).get(sessionCookie)?.value;
  if (!token) redirect(`/sign-in${lang}`);
  const response = await apiRequest(`tenants/${id}`, { headers: { authorization: `Bearer ${token}` } });
  if (response.status === 401) redirect(`/sign-in${lang}`);
  if (response.status === 404 || response.status === 400) notFound();
  if (!response.ok) throw new Error('Could not load the workspace');
  const workspace = (await response.json()) as { name: string; accent: string; role: 'administrator' | 'member' };
  const t = createTranslator({ locale, messages: messages[locale] });
  return (
    <main lang={locale} className="public-shell">
      <Link href={`/session${lang}`} className="mb-6 inline-flex min-h-11 items-center underline">
        {t('account')}
      </Link>
      <section
        className="public-panel border-t-8"
        style={{ borderTopColor: workspace.accent }}
        aria-labelledby="workspace-title"
      >
        <h1 id="workspace-title" className="mb-3 text-3xl font-semibold">
          {workspace.name}
        </h1>
        <p className="mb-6 text-[var(--muted)]">{t(workspace.role)}</p>
        {workspace.role === 'administrator' && (
          <section aria-labelledby="member-invite">
            <h2 id="member-invite" className="mb-4 text-xl font-semibold">
              {t('inviteMember')}
            </h2>
            <InviteForm workspace={id} locale={locale} platform={false} />
          </section>
        )}
      </section>
    </main>
  );
}
