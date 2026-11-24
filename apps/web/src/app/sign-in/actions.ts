'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { apiRequest, sessionCookie, secureSessionCookie } from '../../server/juno-api';

export async function signIn(locale: 'en' | 'pt-BR', form: FormData): Promise<void> {
  const lang = locale === 'pt-BR' ? '?lang=pt-BR' : '';
  const email = form.get('email');
  const password = form.get('password');
  if (typeof email !== 'string' || typeof password !== 'string') {
    redirect(`/sign-in${lang}${lang ? '&' : '?'}error=1`);
  }
  let result: Response | undefined;
  try {
    result = await apiRequest('auth/sign-in', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
  } catch {
    // An unavailable service and an invalid sign-in share the same public response.
  }
  if (!result?.ok) redirect(`/sign-in${lang}${lang ? '&' : '?'}error=1`);
  const session = await result.json() as { token: string; expiresAt: string };
  (await cookies()).set(sessionCookie, session.token, {
    httpOnly: true,
    sameSite: 'strict',
    secure: secureSessionCookie,
    path: '/',
    expires: new Date(session.expiresAt),
  });
  redirect(`/session${lang}`);
}

export async function signOut(locale: 'en' | 'pt-BR'): Promise<void> {
  const jar = await cookies();
  const token = jar.get(sessionCookie)?.value;
  if (token) {
    const response = await apiRequest('auth/sign-out', {
      method: 'POST',
      headers: { authorization: `Bearer ${token}` },
    });
    if (response.status !== 204) throw new Error('Could not revoke session');
  }
  jar.delete(sessionCookie);
  redirect(locale === 'pt-BR' ? '/sign-in?lang=pt-BR' : '/sign-in');
}
