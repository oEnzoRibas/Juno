'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { apiRequest, sessionCookie } from '../../server/juno-api';

export interface Result {
  value?: string;
  error?: boolean;
}

function body(form: FormData, keys: string[]) {
  return JSON.stringify(Object.fromEntries(keys.map(key => [key, form.get(key)])));
}

async function post(path: string, payload: string): Promise<Response | undefined> {
  try {
    const token = (await cookies()).get(sessionCookie)?.value;
    const headers = new Headers({ 'content-type': 'application/json' });
    if (token) headers.set('authorization', `Bearer ${token}`);
    return await apiRequest(path, { method: 'POST', headers, body: payload });
  } catch {
    return undefined;
  }
}

export async function provision(_: Result, form: FormData): Promise<Result> {
  const response = await post('tenants', body(form, ['slug', 'name', 'accent']));
  return response?.ok ? { value: (await response.json() as { id: string }).id } : { error: true };
}

export async function invite(workspace: string, _: Result, form: FormData): Promise<Result> {
  if (!/^[a-f0-9-]{36}$/i.test(workspace)) return { error: true };
  const response = await post(`tenants/${workspace}/invitations`, body(form, ['email', 'role']));
  return response?.ok ? { value: (await response.json() as { token: string }).token } : { error: true };
}

export async function activate(locale: 'en' | 'pt-BR', _: Result, form: FormData): Promise<Result> {
  const response = await post('tenants/activation', body(form, ['token', 'password']));
  if (!response?.ok) return { error: true };
  const lang = locale === 'pt-BR' ? '?lang=pt-BR' : '';
  if ((await cookies()).has(sessionCookie)) {
    const result = await response.json() as { id: string };
    redirect(`/workspace/${result.id}${lang}`);
  }
  redirect(`/sign-in${lang}${lang ? '&' : '?'}activated=1`);
}
